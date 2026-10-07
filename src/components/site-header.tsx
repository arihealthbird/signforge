"use client";

import Link from "next/link";
import { Button, cn } from "@/components/ui";
import { Icon } from "@/components/icons";
import { Logo, TheoVexMark } from "@/components/brand";
import { ThemeToggle } from "@/components/theme-toggle";
import { SITE, THEOVEX, THEO_AI } from "@/lib/site";

export type HeaderVariant = "landing" | "studio" | "page";

/** A squared nav chip. Transparent until hovered, like the TheoVex tab bar. */
const chip =
  "inline-flex items-center gap-1.5 border-2 border-transparent px-2.5 py-1.5 text-sm text-muted transition-[background-color,border-color,color] " +
  "hover:border-ink/15 hover:bg-paper/70 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30";

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

/**
 * The flat sticky header. On the landing page it carries section links; in the
 * studio it keeps a quiet "A TheoVex project" chip so the credit never leaves
 * the screen; on static pages it links back to the studio. It does not react
 * to scrolling: the bar sticks and nothing else about it moves.
 */
export function SiteHeader({
  variant,
  onPrimary,
  onLogo,
}: {
  variant: HeaderVariant;
  /** Landing: open the studio. Studio: start a new signature. */
  onPrimary?: () => void;
  /** Studio: go back to the landing page without losing the draft. */
  onLogo?: () => void;
}) {
  const base = variant === "landing" ? "" : "/";
  const logo = <Logo />;

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-canvas/90 backdrop-blur-xl">
      <div className="shell-gutter shell-wide flex h-14 items-center gap-3 lg:h-[3.75rem]">
        {onLogo ? (
          <button
            type="button"
            onClick={onLogo}
            aria-label="SignForge home"
            className="shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
          >
            {logo}
          </button>
        ) : (
          <Link
            href="/"
            aria-label="SignForge home"
            className="shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
          >
            {logo}
          </Link>
        )}

        {variant === "studio" ? (
          <div className="hidden items-center gap-2 md:flex">
            <a
              href={THEO_AI.url}
              {...ext}
              className="inline-flex items-center gap-1.5 border border-line bg-paper/70 px-2.5 py-1.5 font-mono text-[11px] text-muted transition-colors hover:border-ink hover:text-ink"
            >
              <TheoVexMark className="size-3" />{THEO_AI.name}
            </a>
            <a
              href={THEOVEX.url}
              {...ext}
              className="inline-flex items-center gap-2 border border-line bg-paper/70 px-2.5 py-1.5 font-mono text-[11px] text-muted transition-colors hover:border-ink hover:text-ink"
            >
              <TheoVexMark className="size-3" />A {THEOVEX.name} project
            </a>
          </div>
        ) : (
          <nav aria-label="Main" className="hidden min-w-0 flex-1 items-center justify-center gap-1.5 md:flex">
            <a href={`${base}#how`} className={chip}>
              How it works
            </a>
            <a href={`${base}#features`} className={chip}>
              Features
            </a>
            <a href={SITE.repoUrl} {...ext} className={chip}>
              Open source
            </a>
            <a href={THEOVEX.url} {...ext} className={chip}>
              <TheoVexMark className="size-3" />
              {THEOVEX.name}
            </a>
            <a href={THEO_AI.url} {...ext} className={chip}>
              <TheoVexMark className="size-3" />
              {THEO_AI.name}
            </a>
          </nav>
        )}

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <a
            href={SITE.repoUrl}
            {...ext}
            aria-label="SignForge on GitHub"
            className="grid size-9 place-items-center border-2 border-ink/20 text-ink transition-colors hover:border-ink hover:bg-ink/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
          >
            <Icon name="github" size="sm" />
          </a>
          <ThemeToggle />
          {variant === "page" ? (
            <Link
              href="/"
              className={cn(
                "inline-flex h-9 items-center gap-1.5 whitespace-nowrap border-2 border-ink bg-ink px-4 text-sm font-medium text-paper",
                "transition-transform hover:-translate-y-px active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
              )}
            >
              Open studio
            </Link>
          ) : (
            <Button variant="primary" size="nav" onClick={onPrimary}>
              {variant === "studio" ? <Icon name="plus" size="sm" /> : null}
              {variant === "studio" ? "New" : "Open studio"}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
