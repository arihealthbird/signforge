"use client";

import { useEffect, useRef } from "react";
import { TheoVexMark } from "@/components/brand";
import { Composer } from "@/components/composer";
import { GifSuggestions, giphyEnabled, type GiphyGif } from "@/components/giphy";
import { Icon } from "@/components/icons";
import { Button, Chip, PixelProgress } from "@/components/ui";
import { THEO_AI } from "@/lib/site";
import type { ImageAttachment } from "@/lib/attachments";

export interface ChatMessage {
  role: "user" | "assistant";
  text: string;
  /** Reference images the user attached to this message. */
  attachments?: ImageAttachment[];
  /** When set, show GIF suggestions for this search phrase under the message. */
  gifQuery?: string | null;
  /** One-tap follow-ups shown under the latest assistant message. */
  suggestions?: string[];
}

export const FOLLOW_UPS = [
  "Make it more minimal",
  "Bolder colors",
  "Try a different style",
  "Add a waving GIF",
];

const STARTERS = [
  "A clean signature for a software engineer",
  "Elegant and serif for a lawyer",
  "Playful and colorful for a designer",
];

export function ChatThread({
  messages,
  loading,
  error,
  onSend,
  onRetry,
  onPickGif,
  onMoreGifs,
}: {
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
  onSend: (prompt: string, attachments?: ImageAttachment[]) => void;
  onRetry: () => void;
  onPickGif: (gif: GiphyGif) => void;
  onMoreGifs: (query: string) => void;
}) {
  const listRef = useRef<HTMLDivElement>(null);

  // Scroll only the message list. `scrollIntoView` would also scroll the page,
  // which on phones (where the chat sits below the preview) jumps the viewport.
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, loading, error]);

  const lastAssistant = [...messages].map((m) => m.role).lastIndexOf("assistant");

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div ref={listRef} className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5">
        {messages.length === 0 ? (
          <Assistant>
            <p>
              I am Theo AI. Tell me who you are and how the signature should look. I will design it,
              and you can keep asking for changes.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {STARTERS.map((s) => (
                <Chip key={s} onClick={() => onSend(s)}>
                  {s}
                </Chip>
              ))}
            </div>
          </Assistant>
        ) : null}

        {messages.map((m, i) =>
          m.role === "user" ? (
            <div key={i} className="flex animate-fade-up justify-end">
              <div className="max-w-[88%]">
                {m.attachments?.length ? (
                  <div className="mb-1.5 flex flex-wrap justify-end gap-1.5">
                    {m.attachments.map((a, j) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={j}
                        src={`data:${a.mimeType};base64,${a.data}`}
                        alt="Attached reference"
                        className="h-14 w-14 border-2 border-ink bg-paper-soft object-cover"
                      />
                    ))}
                  </div>
                ) : null}
                <div className="border-2 border-ink bg-ink px-4 py-2.5 text-sm leading-relaxed text-paper">
                  {m.text}
                </div>
              </div>
            </div>
          ) : (
            <Assistant key={i}>
              <p>{m.text}</p>
              {m.gifQuery && giphyEnabled ? (
                <GifSuggestions
                  query={m.gifQuery}
                  onPick={onPickGif}
                  onMore={() => onMoreGifs(m.gifQuery ?? "")}
                />
              ) : null}
              {i === lastAssistant && !loading && m.suggestions?.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {m.suggestions.map((s) => (
                    <Chip key={s} onClick={() => onSend(s)}>
                      {s}
                    </Chip>
                  ))}
                </div>
              ) : null}
            </Assistant>
          )
        )}

        {loading ? (
          <Assistant>
            <span className="inline-flex flex-col gap-2.5 text-muted">
              <span className="mono-label">Forging your signature</span>
              <PixelProgress cells={14} size="sm" label="Forging your signature" />
            </span>
          </Assistant>
        ) : null}

        {error ? (
          <div className="animate-fade-in border-2 border-danger/40 bg-danger/5 p-3.5 text-sm">
            <p className="text-danger">{error}</p>
            <Button variant="soft" size="sm" className="mt-2.5" onClick={onRetry}>
              <Icon name="retry" size="xs" />
              Try again
            </Button>
          </div>
        ) : null}
      </div>

      <div className="border-t border-line p-3">
        <Composer
          variant="dock"
          loading={loading}
          onSubmit={onSend}
          placeholder={messages.length ? "Ask for a change: bolder, serif, add a GIF…" : "Describe your signature…"}
        />
        <div className="mt-2.5 flex items-center justify-center gap-1.5">
          <TheoVexMark className="size-3.5" />
          <span className="font-mono text-[11px] text-muted">
            Powered by{" "}
            <a
              href={THEO_AI.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-ink underline underline-offset-2 hover:opacity-70"
            >
              {THEO_AI.name}
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}

function Assistant({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex animate-fade-up gap-3">
      <TheoVexMark className="mt-0.5 size-7 shrink-0" />
      <div className="min-w-0 flex-1 pt-1 text-sm leading-relaxed text-ink">{children}</div>
    </div>
  );
}
