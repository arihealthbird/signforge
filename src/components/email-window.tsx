"use client";

import { useMemo } from "react";
import { SignatureData } from "@/types/signature";
import { TemplateId } from "@/lib/templates";
import { generateSignatureHTML } from "@/lib/signature-html";
import type { Scene } from "@/scenes";
import { SceneFx } from "@/components/scene-fx";
import { SceneBackdrop } from "@/components/scene-backdrop";
import { SignatureHtml } from "@/components/signature-html";
import { Icon } from "@/components/icons";
import { PixelProgress, cn } from "@/components/ui";

export interface EmailWindowProps {
  data: SignatureData;
  templateId: TemplateId;
  scene: Scene;
  /** Preview the signature in a dark inbox (independent of the app theme). */
  dark: boolean;
  device?: "desktop" | "mobile";
  /** Show the "forging" state while the AI is working. */
  loading?: boolean;
  /** Preview the optional "Made with SignForge" credit line. */
  credit?: boolean;
  /** Bump to replay the entrance animation (e.g. after a generation). */
  revision?: number;
  /** Render the ambient effect behind the window. */
  fx?: boolean;
  className?: string;
}

/**
 * The preview stage: a mock email composer on a scene backdrop. The signature
 * inside is the exact HTML that gets exported (email-safe tables and inline
 * styles), so what you see is what you paste.
 *
 * The window follows the house pixel look (squared, hard offset shadow in the
 * scene's accent). Its own colours follow the preview's light/dark switch, not
 * the app theme, because that is what an inbox does.
 */
export function EmailWindow({
  data,
  templateId,
  scene,
  dark,
  device = "desktop",
  loading = false,
  credit = false,
  revision = 0,
  fx = true,
  className,
}: EmailWindowProps) {
  const html = useMemo(
    () => generateSignatureHTML(data, templateId, { dark, preserveFontVars: true, credit }),
    [data, templateId, dark, credit]
  );

  const wash = dark ? scene.stage.dark : scene.stage.light;
  const dots = dark ? "rgba(255,255,255,0.07)" : "rgba(10,10,10,0.1)";
  const text = dark ? "text-zinc-300" : "text-zinc-700";
  const label = dark ? "text-zinc-500" : "text-zinc-400";
  const rule = dark ? "border-white/10" : "border-zinc-200";
  const fontStyle = scene.font ? { fontFamily: scene.font } : undefined;

  return (
    <div
      className={cn("relative isolate overflow-hidden border border-line", className)}
      style={{
        backgroundColor: dark ? "#0f0f12" : "#f4f3ef",
        backgroundImage: `${wash}, radial-gradient(${dots} 1px, transparent 1px)`,
        backgroundSize: "auto, 18px 18px",
      }}
    >
      <div className="pointer-events-none absolute inset-0 -z-20" aria-hidden>
        <SceneBackdrop scene={scene} />
      </div>
      {fx ? (
        <SceneFx
          kind={scene.fx}
          colors={scene.fxColors}
          dark={dark}
          className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
        />
      ) : null}

      <div
        className={cn(
          "mx-auto px-3 py-5 transition-[max-width] duration-300 sm:px-8 sm:py-8",
          device === "mobile" ? "max-w-[440px]" : "max-w-[840px]"
        )}
      >
        <div
          className={cn("overflow-hidden border-2", dark ? "bg-[#18181c]" : "bg-white")}
          style={{
            borderColor: dark ? "rgba(255,255,255,0.22)" : "#0a0a0a",
            boxShadow: `6px 6px 0 ${scene.accent}`,
          }}
        >
          {/* Title bar */}
          <div
            className="flex items-center gap-3 px-4 py-2.5"
            style={{
              background: dark ? scene.bar.dark : scene.bar.light,
              color: dark ? scene.barText.dark : scene.barText.light,
            }}
          >
            <div className="flex gap-1.5" aria-hidden>
              {scene.dots.map((c, i) => (
                <span key={i} className="size-2.5 border border-black/25" style={{ background: c }} />
              ))}
            </div>
            <span className="text-xs font-medium">New message</span>
            <span className="ml-auto inline-flex items-center gap-3 opacity-90">
              <span className="hidden items-center gap-2 sm:inline-flex">
                <Icon name="attach" size="xs" />
                <Icon name="send" size="xs" />
              </span>
              <span className="mono-label-xs inline-flex items-center gap-1.5">
                <Icon name={scene.icon} size="xs" />
                {scene.name}
              </span>
            </span>
          </div>

          {/* Recipients */}
          <div className={cn("space-y-1.5 border-b px-5 py-3 text-[13px]", rule, text)}>
            <div className="flex items-baseline gap-3">
              <span className={cn("mono-label-xs w-14 shrink-0", label)}>To</span>
              <span className="truncate">{scene.to}</span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className={cn("mono-label-xs w-14 shrink-0", label)}>Subject</span>
              <span className="truncate font-medium" style={fontStyle}>
                {scene.subject}
              </span>
            </div>
          </div>

          {/* Message */}
          <div className={cn("px-5 pb-6 pt-4 text-[14px] leading-relaxed", text)}>
            <p className="text-[15px]" style={fontStyle}>
              {scene.greeting}
            </p>
            {scene.body.map((p) => (
              <p key={p} className="mt-3">
                {p}
              </p>
            ))}
            <p className="mt-3">{scene.closing}</p>

            {/* The signature: exactly what gets exported. */}
            <div className="relative mt-5 overflow-x-auto">
              <SignatureHtml
                key={`${templateId}-${revision}`}
                html={html}
                className={cn("animate-fade-in transition", loading && "opacity-25 blur-[2px]")}
              />
              {loading ? <ForgingOverlay dark={dark} /> : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ForgingOverlay({ dark }: { dark: boolean }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center" aria-live="polite">
      <span
        className={cn(
          "mono-label inline-flex items-center gap-3 border-2 px-3 py-2.5",
          dark ? "border-white/30 bg-black/75 text-white" : "border-ink bg-white text-ink"
        )}
      >
        Forging your signature
        <PixelProgress cells={10} size="sm" label="Forging your signature" />
      </span>
    </div>
  );
}
