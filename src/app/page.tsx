"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import {
  DEFAULT_SIGNATURE_DATA,
  FONT_OPTIONS,
  SignatureData,
  SocialLink,
} from "@/types/signature";
import {
  DEFAULT_TEMPLATE_ID,
  SIGNATURE_TEMPLATES,
  TemplateId,
  isTemplateId,
  resolveTemplateId,
} from "@/lib/templates";
import { DEFAULT_SCENE_ID, SceneId, getScene, isSceneId } from "@/scenes";
import { SAMPLES, type Sample } from "@/lib/samples";
import { getSharedDataFromUrl, clearShareFromUrl } from "@/lib/share";
import { sanitizeSignatureFields, stripDangerousKeys, validateSignatureData } from "@/lib/security";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Landing } from "@/components/landing";
import { Studio } from "@/components/studio";
import { FOLLOW_UPS, type ChatMessage } from "@/components/chat-thread";
import { giphyEnabled } from "@/components/giphy";

/* ── Draft persistence (browser only, never sent anywhere) ───────────── */

const DRAFT_KEY = "sf-draft-v1";
const DRAFT_EVENT = "sf-draft-change";

interface Draft {
  data: SignatureData;
  template: TemplateId;
  scene: SceneId;
  credit: boolean;
}

function subscribeDraft(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(DRAFT_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(DRAFT_EVENT, callback);
  };
}

function readDraftRaw(): string | null {
  try {
    return localStorage.getItem(DRAFT_KEY);
  } catch {
    return null;
  }
}

function parseDraft(raw: string | null): Draft | null {
  if (!raw) return null;
  try {
    const parsed = stripDangerousKeys(JSON.parse(raw)) as Partial<Draft>;
    if (!parsed || !validateSignatureData(parsed.data)) return null;
    const data = sanitizeSignatureFields({
      ...DEFAULT_SIGNATURE_DATA,
      ...parsed.data,
    }) as unknown as SignatureData;
    return {
      data,
      // A draft saved before the catalog was rebuilt keeps its content: a legacy id maps to
      // its nearest design and an unknown one to the default.
      template: resolveTemplateId(parsed.template) ?? DEFAULT_TEMPLATE_ID,
      scene: isSceneId(parsed.scene) ? parsed.scene : DEFAULT_SCENE_ID,
      credit: parsed.credit !== false,
    };
  } catch {
    return null;
  }
}

/* ── Page ─────────────────────────────────────────────────────────────── */

type Mode = "landing" | "studio";

interface GenerateResponse {
  signature?: SignatureData;
  template?: string | null;
  scene?: string | null;
  gifQuery?: string | null;
  message?: string | null;
  changes?: { field: string; note?: string }[];
  error?: string;
}

type HistoryTurn = { role: "user" | "assistant"; text: string };

/** Distills the visible thread into the bounded history sent to the model. */
function toHistory(messages: ChatMessage[]): HistoryTurn[] {
  return messages
    .filter((m) => m.text.trim().length > 0)
    .map((m) => ({ role: m.role, text: m.text }))
    .slice(-10);
}

export default function Home() {
  const [mode, setMode] = useState<Mode>("landing");
  const [data, setData] = useState<SignatureData>(SAMPLES[0].data);
  const [templateId, setTemplateId] = useState<TemplateId>(SAMPLES[0].template);
  const [sceneId, setSceneId] = useState<SceneId>(SAMPLES[0].scene);
  const [credit, setCredit] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);

  // True once the signature in the studio is "someone's" (generated, edited,
  // shared or restored) rather than the built-in starter, so the AI refines it.
  const hasDesign = useRef(false);
  const lastPrompt = useRef("");
  const messagesRef = useRef<ChatMessage[]>([]);

  const rawDraft = useSyncExternalStore(subscribeDraft, readDraftRaw, () => null);
  const draft = useMemo(() => parseDraft(rawDraft), [rawDraft]);

  // Jump to the top when switching between landing and studio. Skipped on the
  // first render so deep links like /#features keep their scroll position.
  const firstMode = useRef(true);
  useEffect(() => {
    if (firstMode.current) {
      firstMode.current = false;
      return;
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [mode]);

  // Load a signature shared via ?share= when present.
  useEffect(() => {
    const shared = getSharedDataFromUrl();
    if (!shared) return;
    hasDesign.current = true;
    setData((prev) => ({ ...prev, ...shared.s }));
    setTemplateId(shared.t);
    setMessages([
      { role: "assistant", text: "Here's a signature that was shared with you. Edit it in the tabs, or ask me for changes." },
    ]);
    setMode("studio");
    clearShareFromUrl();
  }, []);

  // Save the draft while the studio is open, but only once it holds a real
  // design (not the untouched starter signature).
  useEffect(() => {
    if (mode !== "studio" || !hasDesign.current) return;
    const id = window.setTimeout(() => {
      try {
        const payload: Draft = { data, template: templateId, scene: sceneId, credit };
        localStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
        window.dispatchEvent(new Event(DRAFT_EVENT));
      } catch {
        // Storage can be unavailable (private mode); the draft is a nicety.
      }
    }, 500);
    return () => window.clearTimeout(id);
  }, [mode, data, templateId, sceneId, credit]);

  // Keep a ref of the latest messages so send/retry can build history without
  // going stale inside memoized callbacks.
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const patch = useCallback((p: Partial<SignatureData>) => {
    hasDesign.current = true;
    setData((d) => ({ ...d, ...p }));
  }, []);

  const setSocialLinks = useCallback((links: SocialLink[]) => {
    hasDesign.current = true;
    setData((d) => ({ ...d, socialLinks: links }));
  }, []);

  /** Runs one generation. The caller decides whether a user message was added. */
  const run = useCallback(
    async (prompt: string, history: HistoryTurn[] = []) => {
      lastPrompt.current = prompt;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt,
            currentData: hasDesign.current ? data : null,
            scene: sceneId,
            template: templateId,
            history,
          }),
        });
        const json = (await res.json().catch(() => null)) as GenerateResponse | null;
        if (!res.ok || !json?.signature) {
          throw new Error(json?.error || "Generation failed. Please try again.");
        }

        const refined = hasDesign.current;
        hasDesign.current = true;

        const nextTemplate = isTemplateId(json.template) ? json.template : templateId;
        // When refining, keep the current scene unless the model changed it; a
        // fresh design starts from the classic inbox.
        const nextScene = isSceneId(json.scene) ? json.scene : refined ? sceneId : DEFAULT_SCENE_ID;

        // Refinements merge over the current signature so fields the model
        // never touches (GIF, banner, monogram) always survive. A fresh design
        // replaces everything.
        const incoming = json.signature;
        setData(refined ? (prev) => ({ ...prev, ...incoming }) : incoming);
        setTemplateId(nextTemplate);
        setSceneId(nextScene);
        setRevision((r) => r + 1);

        const tpl = SIGNATURE_TEMPLATES.find((t) => t.id === nextTemplate);
        const font = FONT_OPTIONS.find((f) => f.value === json.signature?.fontFamily)?.label;
        const mood = nextScene !== DEFAULT_SCENE_ID ? `, ${getScene(nextScene).name} scene` : "";
        const gif = json.gifQuery && giphyEnabled;
        const fallback =
          `${refined ? "Updated" : "Done"}: ${tpl?.name ?? "your signature"}${font ? ` in ${font}` : ""}${mood}. ` +
          (gif ? "Here are a few GIFs to try. " : "") +
          (refined
            ? "Want any changes?"
            : "Please double-check your contact details in the Details tab, then tell me what to change.");
        // Prefer the model's own explanation of what it changed, and fall back to
        // the client-built summary when the model did not author one.
        const text = json.message?.trim() ? json.message.trim() : fallback;

        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            text,
            gifQuery: gif ? json.gifQuery : null,
            suggestions: FOLLOW_UPS.filter((s) => giphyEnabled || !/GIF/i.test(s)),
          },
        ]);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Generation failed. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [data, sceneId, templateId]
  );

  const generate = useCallback(
    (prompt: string) => {
      if (loading) return;
      const history = toHistory(messagesRef.current);
      if (mode === "landing") {
        // A prompt from the landing page always starts a brand new signature.
        // Only prompts typed inside the studio refine the current one.
        hasDesign.current = false;
        setMessages([{ role: "user", text: prompt }]);
      } else {
        setMessages((m) => [...m, { role: "user", text: prompt }]);
      }
      setMode("studio");
      void run(prompt, history);
    },
    [loading, mode, run]
  );

  const retry = useCallback(() => {
    if (!lastPrompt.current) return;
    // Drop the trailing user turn being retried so it is not duplicated in history.
    const history = toHistory(messagesRef.current).slice(0, -1);
    void run(lastPrompt.current, history);
  }, [run]);

  const openStudio = useCallback(() => setMode("studio"), []);
  const goLanding = useCallback(() => setMode("landing"), []);

  const loadSample = useCallback((sample: Sample) => {
    hasDesign.current = true;
    setData(sample.data);
    setTemplateId(sample.template);
    setSceneId(sample.scene);
    setRevision((r) => r + 1);
    setMessages([
      {
        role: "assistant",
        text: "Loaded the example. Ask me to change anything, or edit it in the Design, Details and Extras tabs.",
        suggestions: FOLLOW_UPS.filter((s) => giphyEnabled || !/GIF/i.test(s)),
      },
    ]);
    setMode("studio");
  }, []);

  const continueDraft = useCallback(() => {
    if (!draft) return;
    hasDesign.current = true;
    setData(draft.data);
    setTemplateId(draft.template);
    setSceneId(draft.scene);
    setCredit(draft.credit);
    setRevision((r) => r + 1);
    setMessages([
      { role: "assistant", text: "Welcome back. Your last signature is loaded. What shall we change?" },
    ]);
    setMode("studio");
  }, [draft]);

  return (
    <div className="relative min-h-screen">
      <SiteHeader
        variant={mode}
        onPrimary={mode === "landing" ? openStudio : goLanding}
        onLogo={mode === "studio" ? goLanding : undefined}
      />

      <main>
        {mode === "landing" ? (
          <Landing
            onGenerate={generate}
            loading={loading}
            hasDraft={draft !== null}
            onContinue={continueDraft}
            onUseSample={loadSample}
          />
        ) : (
          <Studio
            data={data}
            onPatch={patch}
            onSocialLinksChange={setSocialLinks}
            templateId={templateId}
            onTemplateChange={setTemplateId}
            sceneId={sceneId}
            onSceneChange={setSceneId}
            messages={messages}
            loading={loading}
            error={error}
            onSend={generate}
            onRetry={retry}
            revision={revision}
            credit={credit}
            onCreditChange={setCredit}
          />
        )}
      </main>

      <SiteFooter compact={mode === "studio"} />
    </div>
  );
}
