"use client";

import { useState } from "react";
import { SignatureData, SocialLink } from "@/types/signature";
import { TemplateId } from "@/lib/templates";
import { SceneId, getScene } from "@/scenes";
import { ChatMessage, ChatThread } from "@/components/chat-thread";
import { DesignPanel, DetailsPanel, ExtrasPanel } from "@/components/panels";
import { EmailWindow } from "@/components/email-window";
import { ExportBar } from "@/components/export-bar";
import { GiphyPicker, giphyEnabled, type GiphyGif } from "@/components/giphy";
import { Icon, type IconName } from "@/components/icons";
import { ScenePicker } from "@/components/scene-picker";
import { Segmented, cn } from "@/components/ui";
import { useToast } from "@/components/toast";

type Tab = "chat" | "design" | "details" | "extras";

const TABS: { id: Tab; label: string; icon: IconName }[] = [
  { id: "chat", label: "Chat", icon: "chat" },
  { id: "design", label: "Design", icon: "design" },
  { id: "details", label: "Details", icon: "details" },
  { id: "extras", label: "Extras", icon: "extras" },
];

export interface StudioProps {
  data: SignatureData;
  onPatch: (patch: Partial<SignatureData>) => void;
  onSocialLinksChange: (links: SocialLink[]) => void;
  templateId: TemplateId;
  onTemplateChange: (id: TemplateId) => void;
  sceneId: SceneId;
  onSceneChange: (id: SceneId) => void;
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
  onSend: (prompt: string) => void;
  onRetry: () => void;
  /** Bumped after every generation to replay the signature's entrance. */
  revision: number;
  credit: boolean;
  onCreditChange: (value: boolean) => void;
}

export function Studio({
  data,
  onPatch,
  onSocialLinksChange,
  templateId,
  onTemplateChange,
  sceneId,
  onSceneChange,
  messages,
  loading,
  error,
  onSend,
  onRetry,
  revision,
  credit,
  onCreditChange,
}: StudioProps) {
  const [tab, setTab] = useState<Tab>("chat");
  const [previewDark, setPreviewDark] = useState(false);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [gifOpen, setGifOpen] = useState(false);
  const [gifQuery, setGifQuery] = useState("");
  const toast = useToast();

  const scene = getScene(sceneId);

  const openGifs = (query = "") => {
    setGifQuery(query);
    setGifOpen(true);
  };

  const pickGif = (gif: GiphyGif) => {
    onPatch({ gifBannerUrl: gif.url });
    setGifOpen(false);
    toast.show("GIF added under your signature.");
  };

  return (
    <div className="mx-auto grid w-full max-w-[1440px] gap-5 px-3 pb-12 pt-5 sm:px-5 lg:grid-cols-[minmax(380px,460px)_minmax(0,1fr)] lg:items-start">
      {/* Left: controls */}
      <aside
        className={cn(
          "order-2 flex h-[min(720px,calc(100svh-7rem))] flex-col overflow-hidden border border-line bg-paper lg:order-1 lg:sticky lg:h-[calc(100svh-var(--shell-header-h)-2rem)]",
          "lg:top-[calc(var(--shell-header-h)+1rem)]"
        )}
      >
        <div
          role="tablist"
          aria-label="Studio sections"
          className="grid grid-cols-4 gap-1.5 border-b border-line bg-paper-soft/60 p-2"
        >
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(t.id)}
                className={cn(
                  "flex flex-col items-center gap-1 border-2 py-2 text-[11px] font-semibold transition-[background-color,border-color,color,box-shadow]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30",
                  active
                    ? "pixel-neon-xs border-ink bg-paper text-ink"
                    : "border-transparent text-muted hover:border-ink/15 hover:bg-paper/70 hover:text-ink"
                )}
              >
                <Icon name={t.icon} size="md" />
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="min-h-0 flex-1">
          {tab === "chat" ? (
            <ChatThread
              messages={messages}
              loading={loading}
              error={error}
              onSend={onSend}
              onRetry={onRetry}
              onPickGif={pickGif}
              onMoreGifs={openGifs}
            />
          ) : (
            <div className="h-full overflow-y-auto">
              {tab === "design" ? (
                <DesignPanel
                  data={data}
                  templateId={templateId}
                  onChange={onPatch}
                  onTemplateChange={onTemplateChange}
                />
              ) : null}
              {tab === "details" ? (
                <DetailsPanel data={data} onChange={onPatch} onSocialLinksChange={onSocialLinksChange} />
              ) : null}
              {tab === "extras" ? (
                <ExtrasPanel data={data} onChange={onPatch} onOpenGifPicker={() => openGifs()} />
              ) : null}
            </div>
          )}
        </div>
      </aside>

      {/* Right: preview + export */}
      <section className="order-1 min-w-0 space-y-4 lg:order-2 lg:sticky lg:top-[calc(var(--shell-header-h)+1rem)]">
        <div className="relative z-20 flex flex-wrap items-center justify-between gap-3">
          <ScenePicker value={sceneId} onChange={onSceneChange} />

          <div className="flex items-center gap-2">
            <Segmented
              value={previewDark ? "dark" : "light"}
              onChange={(v) => setPreviewDark(v === "dark")}
              ariaLabel="Inbox appearance"
              options={[
                { value: "light", icon: <Icon name="sun" size="sm" />, label: "Light", title: "Light inbox" },
                { value: "dark", icon: <Icon name="moon" size="sm" />, label: "Dark", title: "Dark inbox" },
              ]}
            />
            <Segmented
              value={device}
              onChange={setDevice}
              ariaLabel="Preview width"
              options={[
                { value: "desktop", icon: <Icon name="desktop" size="sm" />, title: "Desktop width" },
                { value: "mobile", icon: <Icon name="phone" size="sm" />, title: "Phone width" },
              ]}
            />
          </div>
        </div>

        {/* The primary action sits above the preview so it is never below the fold. */}
        <ExportBar
          data={data}
          templateId={templateId}
          credit={credit}
          onCreditChange={onCreditChange}
          onToast={toast.show}
        />

        <EmailWindow
          data={data}
          templateId={templateId}
          scene={scene}
          dark={previewDark}
          device={device}
          loading={loading}
          credit={credit}
          revision={revision}
        />
      </section>

      {giphyEnabled ? (
        <GiphyPicker
          key={gifQuery}
          open={gifOpen}
          initialQuery={gifQuery}
          onClose={() => setGifOpen(false)}
          onPick={pickGif}
        />
      ) : null}
      {toast.node}
    </div>
  );
}
