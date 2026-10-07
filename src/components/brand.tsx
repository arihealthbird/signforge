import Image from "next/image";
import { useId } from "react";
import { THEOVEX } from "@/lib/site";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/icons";

/* ── SignForge ────────────────────────────────────────────────────────── */

/**
 * The SignForge mark: a signature stroke shaped like an "S", with a spark
 * flying off it, on a squared tile with a hard offset block behind it (the
 * house pixel motif, no ring or glow). Ink tile with a neon stroke in light
 * mode, neon tile with an ink stroke in dark mode. Original artwork, safe to
 * ship under Apache-2.0.
 */
export function SignForgeMark({
  className,
  title,
  inverse = false,
}: {
  className?: string;
  title?: string;
  /** Force the on-dark palette (white offset block, neon tile, dark "S"). */
  inverse?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 36 36"
      className={cn("shrink-0", className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      {/* The offset block. */}
      <rect
        x="4"
        y="4"
        width="32"
        height="32"
        className={inverse ? "fill-white" : "fill-neon dark:fill-ink"}
      />
      {/* The tile. */}
      <rect width="32" height="32" className={inverse ? "fill-neon" : "fill-ink dark:fill-neon"} />
      <path
        d="M21 11.2C20.2 9 18.3 7.8 15.8 7.8c-3 0-5.2 1.6-5.2 3.9 0 2.3 1.8 3.2 5.2 4 3.5.9 5.4 1.9 5.4 4.3 0 2.5-2.3 4.2-5.4 4.2-2.8 0-4.8-1.1-5.7-3.2"
        fill="none"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={inverse ? "stroke-neon-ink" : "stroke-neon dark:stroke-neon-ink"}
      />
      <path
        d="M25.8 4.2l.8 2.3 2.3.8-2.3.8-.8 2.3-.8-2.3-2.3-.8 2.3-.8z"
        className={inverse ? "fill-neon-ink" : "fill-neon dark:fill-neon-ink"}
      />
    </svg>
  );
}

/**
 * The wordmark: the mark, then `sign` in Geist 800 and `forge` in Pixelify
 * Sans, the same pairing TheoVex uses for `theo` + `vex`.
 */
export function Logo({
  size = "md",
  wordmark = true,
  className,
  inverse = false,
}: {
  size?: "sm" | "md" | "lg";
  wordmark?: boolean;
  className?: string;
  /** Force the on-dark palette for dark surfaces like the footer. */
  inverse?: boolean;
}) {
  const dim = size === "sm" ? "size-7" : size === "lg" ? "size-10" : "size-8";
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <SignForgeMark className={dim} inverse={inverse} />
      {wordmark ? (
        <span
          className={cn(
            "inline-flex items-baseline leading-none",
            inverse ? "text-white" : "text-ink",
            size === "lg" ? "text-[26px]" : "text-[19px]"
          )}
        >
          <span className="font-extrabold tracking-[-0.045em]">sign</span>
          <span className="pixel-token text-[1.08em]">forge</span>
        </span>
      ) : null}
    </span>
  );
}

/* ── TheoVex ──────────────────────────────────────────────────────────── */

/** Pink → violet → blue, the TheoVex gradient. */
const THEOVEX_GRADIENT = ["#E879F9", "#A78BFA", "#60A5FA"] as const;

/**
 * Silhouette (antenna, head, ears, chin) + face cut-out + two eyes on a
 * 48 x 45 grid: the TheoVex pixel-robot mascot, drawn as one even-odd path so
 * it stays crisp at tiny sizes and needs no image request.
 */
const THEOVEX_PATH =
  "M19.5 0H28.5V8H41V15H48V38H41V45H7V38H0V15H7V8H19.5Z" +
  "M9 17V20.5H7V33H9V36H39V33H41V20.5H39V17Z" +
  "M14.5 23.5V30H21V23.5Z" +
  "M27 23.5V30H33.5V23.5Z";

export function TheoVexMark({
  className,
  tone = "gradient",
  title,
}: {
  className?: string;
  /** `gradient` is the brand ramp, `mono` fills with currentColor. */
  tone?: "gradient" | "mono";
  title?: string;
}) {
  const gid = `sf-theovex-${useId().replace(/:/g, "")}`;
  return (
    <svg
      viewBox="0 0 48 45"
      className={cn("inline-block shrink-0", className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      {tone === "gradient" ? (
        <defs>
          <linearGradient id={gid} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor={THEOVEX_GRADIENT[0]} />
            <stop offset="50%" stopColor={THEOVEX_GRADIENT[1]} />
            <stop offset="100%" stopColor={THEOVEX_GRADIENT[2]} />
          </linearGradient>
        </defs>
      ) : null}
      <path
        fillRule="evenodd"
        fill={tone === "gradient" ? `url(#${gid})` : "currentColor"}
        d={THEOVEX_PATH}
      />
    </svg>
  );
}

/**
 * The TheoVex wordmark (`theo` in Pixelify Sans + `vex`, with the robot), from
 * `public/brand/theovex/`. These files are TheoVex trademarks and are not
 * covered by the Apache-2.0 license (see NOTICE). `onScene` forces the white
 * version, for use over the dark footer scene.
 */
const WORDMARK_W = 1500;
const WORDMARK_H = 279;

export function TheoVexWordmark({
  className,
  onScene = false,
}: {
  className?: string;
  onScene?: boolean;
}) {
  const base = cn("block w-auto select-none", className);
  if (onScene) {
    return (
      <Image
        src="/brand/theovex/wordmark-white.png"
        alt="TheoVex"
        width={WORDMARK_W}
        height={WORDMARK_H}
        unoptimized
        className={base}
      />
    );
  }
  return (
    <>
      <Image
        src="/brand/theovex/wordmark-black.png"
        alt="TheoVex"
        width={WORDMARK_W}
        height={WORDMARK_H}
        unoptimized
        className={cn(base, "dark:hidden")}
      />
      <Image
        src="/brand/theovex/wordmark-white.png"
        alt=""
        width={WORDMARK_W}
        height={WORDMARK_H}
        unoptimized
        className={cn(base, "hidden dark:block")}
      />
    </>
  );
}

/**
 * The lowercase pixel `theo` token (Pixelify Sans), with the colour inherited
 * from its surroundings. Used inline in display copy: `Build on <TheoToken />.`
 */
export function TheoToken({ className }: { className?: string }) {
  return <span className={cn("pixel-token", className)}>theo</span>;
}

/** The "A TheoVex project" chip: a bordered mono tag that links to theovex.com. */
export function TheoVexPill({ className, short = false }: { className?: string; short?: boolean }) {
  return (
    <a
      href={THEOVEX.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group inline-flex items-center gap-2 border border-ink/20 bg-paper/80 py-1 pl-1 pr-2.5 font-mono text-[11px] font-medium text-ink backdrop-blur-sm",
        "transition-[border-color,box-shadow,transform] hover:-translate-x-px hover:-translate-y-px hover:border-ink hover:shadow-[3px_3px_0_var(--neon)]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/40",
        className
      )}
    >
      <span className="bg-neon px-1.5 py-1 text-[10px] font-bold uppercase leading-none tracking-[0.14em] text-neon-ink">
        Free
      </span>
      <TheoVexMark className="size-3.5" />
      <span className="font-semibold">A TheoVex project</span>
      {short ? null : <span className="hidden text-muted sm:inline">Open source</span>}
      <Icon
        name="arrow-up-right"
        size="xs"
        className="text-muted transition-transform group-hover:-translate-y-px group-hover:translate-x-px group-hover:text-ink"
      />
    </a>
  );
}
