"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Button, Chip, Kbd, cn } from "@/components/ui";
import { Icon } from "@/components/icons";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { useCapabilities } from "@/lib/use-capabilities";
import { EXAMPLE_PROMPTS } from "@/lib/samples";
import { MAX_ATTACHMENTS, MAX_ATTACHMENT_CHARS, type ImageAttachment } from "@/lib/attachments";

const MAX_LENGTH = 2000;
const MAX_IMAGE_DIMENSION = 1024;

/** Types example prompts into the empty box, one after another. */
function useTypewriter(lines: string[], active: boolean): string {
  const reduced = usePrefersReducedMotion();
  const [text, setText] = useState("");

  useEffect(() => {
    if (!active || reduced) return;
    let line = 0;
    let i = 0;
    let dir = 1;
    let timer = 0;

    const tick = () => {
      const full = lines[line];
      i += dir;
      setText(full.slice(0, i));
      if (dir === 1 && i >= full.length) {
        dir = -1;
        timer = window.setTimeout(tick, 1900);
        return;
      }
      if (dir === -1 && i <= 0) {
        dir = 1;
        line = (line + 1) % lines.length;
        timer = window.setTimeout(tick, 380);
        return;
      }
      timer = window.setTimeout(tick, dir === 1 ? 30 : 12);
    };

    timer = window.setTimeout(tick, 700);
    return () => window.clearTimeout(timer);
  }, [lines, active, reduced]);

  return reduced ? lines[0] : text;
}

/* ── Image handling (client only) ─────────────────────────────────────── */

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not read that image."));
    img.src = src;
  });
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result === "string") {
        const base64 = result.slice(result.indexOf(",") + 1);
        if (base64) resolve(base64);
        else reject(new Error("Could not read that image."));
      } else {
        reject(new Error("Could not read that image."));
      }
    };
    reader.onerror = () => reject(new Error("Could not read that image."));
    reader.readAsDataURL(blob);
  });
}

/**
 * Downsizes and re-encodes a picked file to a bounded reference image.
 * WebP keeps transparency and stays small; PNG is the universal fallback.
 */
async function processImageFile(file: File): Promise<ImageAttachment | null> {
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);
    const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(img.width, img.height));
    const width = Math.max(1, Math.round(img.width * scale));
    const height = Math.max(1, Math.round(img.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0, width, height);

    const webp = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/webp", 0.85)
    );
    const blob = webp ?? (await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png")));
    if (!blob || blob.size === 0) return null;

    const data = await blobToBase64(blob);
    if (!data || data.length > MAX_ATTACHMENT_CHARS) return null;
    return { data, mimeType: blob.type === "image/png" ? "image/png" : "image/webp" };
  } catch {
    return null;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export interface ComposerProps {
  onSubmit: (prompt: string, attachments?: ImageAttachment[]) => void;
  loading?: boolean;
  /** `hero` is the big landing box, `dock` is the compact one under the chat. */
  variant?: "hero" | "dock";
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
}

const TOOL_BUTTON =
  "inline-flex h-8 w-8 shrink-0 items-center justify-center border-2 border-ink/20 text-ink transition-colors " +
  "hover:border-ink hover:bg-paper-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30 " +
  "disabled:pointer-events-none disabled:opacity-40";

/**
 * The prompt box. A flat paper card with a 2px ink border and a hard neon
 * offset shadow that grows when it has focus: the SignForge accent, used as
 * the active-state shadow.
 */
export function Composer({
  onSubmit,
  loading = false,
  variant = "hero",
  placeholder,
  autoFocus = false,
  className,
}: ComposerProps) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [attachments, setAttachments] = useState<ImageAttachment[]>([]);
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const ref = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const hero = variant === "hero";
  // Only what the configured AI provider can serve is offered.
  const { images: canAttach, voice: canDictate } = useCapabilities();

  const typed = useTypewriter(EXAMPLE_PROMPTS, hero && !focused && value === "");

  useEffect(() => {
    if (autoFocus) ref.current?.focus();
  }, [autoFocus]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      recorderRef.current = null;
    };
  }, []);

  const submit = () => {
    const prompt = value.trim();
    if (!prompt || loading) return;
    onSubmit(prompt, attachments.length ? attachments : undefined);
    setValue("");
    setAttachments([]);
    setNotice(null);
  };

  const surprise = () => {
    const pick = EXAMPLE_PROMPTS[Math.floor(Math.random() * EXAMPLE_PROMPTS.length)];
    onSubmit(pick);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submit();
    }
  };

  const onFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setNotice(null);
    const incoming: ImageAttachment[] = [];
    for (const file of Array.from(files)) {
      if (incoming.length + attachments.length >= MAX_ATTACHMENTS) break;
      const processed = await processImageFile(file);
      if (processed) incoming.push(processed);
    }
    if (incoming.length) setAttachments((a) => [...a, ...incoming].slice(0, MAX_ATTACHMENTS));
    else if (files.length > 0) setNotice("That image could not be attached.");
    e.target.value = "";
  };

  const removeAttachment = (index: number) => {
    setAttachments((a) => a.filter((_, i) => i !== index));
  };

  const stopStream = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    recorderRef.current = null;
  };

  const transcribe = async (blob: Blob, type: string) => {
    setTranscribing(true);
    try {
      const form = new FormData();
      form.append("file", blob, type.includes("mp4") ? "recording.m4a" : "recording.webm");
      const res = await fetch("/api/transcribe", { method: "POST", body: form });
      const json = (await res.json().catch(() => null)) as { text?: string; error?: string } | null;
      if (!res.ok || !json?.text) {
        throw new Error(json?.error || "Could not transcribe that. Please try again.");
      }
      const text = json.text.trim();
      if (!text) {
        setNotice("No speech heard. Try again.");
      } else {
        setValue((v) => {
          const next = (v && !/\s$/.test(v) ? `${v} ` : v) + text;
          return next.length > MAX_LENGTH ? next.slice(0, MAX_LENGTH) : next;
        });
      }
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not transcribe that. Please try again.");
    } finally {
      setTranscribing(false);
    }
  };

  const startRecording = async () => {
    setNotice(null);
    if (!window.MediaRecorder || !navigator.mediaDevices?.getUserMedia) {
      setNotice("Voice input is not supported in this browser.");
      return;
    }

    // A microphone that was blocked earlier silently rejects without
    // prompting again, so surface the fix before we even try to record.
    try {
      const status = await navigator.permissions?.query({ name: "microphone" });
      if (status && status.state === "denied") {
        setNotice(
          "Microphone access is blocked for this site. Allow it in your browser's site settings, then reload."
        );
        return;
      }
    } catch {
      // `permissions.query` isn't available everywhere; fall through to getUserMedia.
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = ["audio/webm", "audio/mp4"].find((t) => MediaRecorder.isTypeSupported(t));
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      streamRef.current = stream;
      recorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onerror = () => {
        setRecording(false);
        setNotice("Recording failed. Please try again.");
        stopStream();
      };
      recorder.onstop = () => {
        const type = mimeType ?? (recorder.mimeType || "audio/webm");
        const blob = new Blob(chunksRef.current, { type });
        stopStream();
        void transcribe(blob, type);
      };

      recorder.start();
      setRecording(true);
    } catch (error) {
      const name = error instanceof DOMException ? error.name : "";
      if (name === "NotAllowedError" || name === "SecurityError") {
        setNotice(
          "Microphone access is blocked. Enable it in your browser's site settings and in System Settings > Privacy & Security > Microphone, then reload."
        );
      } else if (name === "NotFoundError") {
        setNotice("No microphone was detected. Connect one and try again.");
      } else if (name === "NotReadableError") {
        setNotice("The microphone is busy in another app. Close that app and try again.");
      } else {
        setNotice("Microphone access is unavailable. Enable it in your browser's site settings and try again.");
      }
    }
  };

  const stopRecording = () => {
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== "inactive") recorder.stop();
    setRecording(false);
  };

  return (
    <div
      className={cn(
        "border-2 border-ink bg-paper transition-shadow",
        hero
          ? "p-3 shadow-[6px_6px_0_var(--neon)] focus-within:shadow-[9px_9px_0_var(--neon)]"
          : "p-2 shadow-[3px_3px_0_var(--neon)] focus-within:shadow-[5px_5px_0_var(--neon)]",
        className
      )}
      data-active={loading}
    >
      <div className="relative">
        <textarea
          ref={ref}
          value={value}
          rows={hero ? 3 : 2}
          maxLength={MAX_LENGTH}
          disabled={loading}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-label="Describe the signature you want"
          placeholder={hero ? "" : placeholder}
          className={cn(
            "block w-full resize-none bg-transparent px-3 text-ink outline-none placeholder:text-muted/70 disabled:opacity-60",
            hero ? "pt-2 text-[17px] leading-relaxed sm:text-lg" : "pt-1.5 text-sm leading-relaxed"
          )}
        />
        {hero && value === "" ? (
          <span
            aria-hidden
            className="pointer-events-none absolute left-3 right-3 top-2 text-[17px] leading-relaxed text-muted/80 sm:text-lg"
          >
            {focused ? "Who are you, and what should it look like?" : typed}
            {!focused ? <span className="ml-0.5 inline-block animate-blink">|</span> : null}
          </span>
        ) : null}
      </div>

      {attachments.length ? (
        <div className={cn("flex flex-wrap gap-2", hero ? "mt-2 px-1" : "mt-1.5 px-0.5")}>
          {attachments.map((a, i) => (
            <div key={i} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`data:${a.mimeType};base64,${a.data}`}
                alt="Attached reference"
                className="h-14 w-14 border-2 border-ink bg-paper-soft object-cover"
              />
              <button
                type="button"
                onClick={() => removeAttachment(i)}
                aria-label="Remove image"
                className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center border border-ink bg-paper text-ink transition-colors hover:bg-ink hover:text-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
              >
                <Icon name="x" size="xs" />
              </button>
            </div>
          ))}
        </div>
      ) : null}

      {notice ? (
        <p className={cn("text-xs text-danger", hero ? "mt-2 px-1" : "mt-1.5 px-0.5")}>{notice}</p>
      ) : null}

      <div className={cn("flex items-center gap-2", hero ? "mt-2 px-1" : "mt-1 px-0.5")}>
        {canAttach ? (
          <>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={onFiles}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={loading || attachments.length >= MAX_ATTACHMENTS}
              aria-label="Attach an image"
              title="Attach an image"
              className={TOOL_BUTTON}
            >
              <Icon name="attach" size="sm" />
            </button>
          </>
        ) : null}
        {canDictate ? (
          <button
            type="button"
            onClick={recording ? stopRecording : () => void startRecording()}
            disabled={loading || transcribing}
            aria-label={recording ? "Stop recording" : "Dictate"}
            title={recording ? "Stop recording" : "Dictate"}
            className={cn(TOOL_BUTTON, recording && "border-danger bg-danger/10 text-danger")}
          >
            {transcribing ? (
              <Icon name="loader" size="sm" className="animate-spin" />
            ) : recording ? (
              <Icon name="x" size="sm" />
            ) : (
              <Icon name="mic" size="sm" />
            )}
          </button>
        ) : null}

        {hero ? (
          <Chip onClick={surprise} disabled={loading}>
            <Icon name="shuffle" size="xs" />
            Surprise me
          </Chip>
        ) : null}
        <span className="ml-auto hidden items-center gap-1.5 text-[11px] text-muted sm:flex">
          <Kbd>Enter</Kbd> to generate
        </span>
        <Button
          variant="primary"
          size={hero ? "md" : "sm"}
          onClick={submit}
          disabled={!value.trim()}
          loading={loading}
          aria-label="Generate signature"
        >
          {loading ? "Forging" : "Generate"}
          {!loading ? <Icon name="arrow-up" size="sm" /> : null}
        </Button>
      </div>
    </div>
  );
}
