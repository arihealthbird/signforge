"use client";

import { useRef, useState, type CSSProperties, type FormEvent, type PointerEvent, type ReactNode } from "react";
import { Icon } from "@/components/icons";

export type FooterLink = { label: string; href: string };
export type FooterColumn = { title: string; links: FooterLink[] };
export type FooterSocial = { label: string; href: string; icon: ReactNode };

export type DitheredFooterProps = {
  brand?: string;
  /** Where the wordmark links to. */
  brandHref?: string;
  /** Replaces the plain-text brand link, e.g. a themed logo. */
  brandLogo?: ReactNode;
  tagline?: string;
  /** Rendered under the tagline, for a company attribution or similar. */
  brandNote?: ReactNode;
  columns?: FooterColumn[];
  socials?: FooterSocial[];
  legal?: FooterLink[];
  copyright?: string;
  /** Link to your real status page, shown with a green dot. Off unless you pass one. */
  status?: FooterLink | null;
  /** Colour of the dot field. It is the footer's only colour, so it carries the brand. */
  accent?: string;
  /** Called with the email address. Resolve to show the success message. */
  onSubscribe?: (email: string) => void | Promise<void>;
};

// Stochastic dither: vertical noise, sparse at the top and dense at the bottom,
// thresholded to on/off in one inline SVG filter. Used as a mask, so the dots
// take whatever accent colour you pass.
const DITHER =
  "url('data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27360%27%20height%3D%27240%27%3E%3Cdefs%3E%3ClinearGradient%20id%3D%27g%27%20x1%3D%270%27%20y1%3D%270%27%20x2%3D%270%27%20y2%3D%271%27%3E%3Cstop%20offset%3D%270.04%27%20stop-color%3D%27%23000%27%2F%3E%3Cstop%20offset%3D%270.96%27%20stop-color%3D%27%23fff%27%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%27f%27%20x%3D%270%27%20y%3D%270%27%20width%3D%27100%25%27%20height%3D%27100%25%27%20color-interpolation-filters%3D%27sRGB%27%3E%3CfeTurbulence%20type%3D%27fractalNoise%27%20baseFrequency%3D%270.2%27%20numOctaves%3D%272%27%20seed%3D%277%27%20stitchTiles%3D%27stitch%27%20result%3D%27n%27%2F%3E%3CfeColorMatrix%20in%3D%27n%27%20type%3D%27matrix%27%20values%3D%271%200%200%200%200%201%200%200%200%200%201%200%200%200%200%200%200%200%200%201%27%20result%3D%27ng%27%2F%3E%3CfeComposite%20in%3D%27SourceGraphic%27%20in2%3D%27ng%27%20operator%3D%27arithmetic%27%20k2%3D%270.5%27%20k3%3D%270.5%27%20result%3D%27s%27%2F%3E%3CfeComponentTransfer%20in%3D%27s%27%20result%3D%27t%27%3E%3CfeFuncR%20type%3D%27discrete%27%20tableValues%3D%270%201%27%2F%3E%3C/feComponentTransfer%3E%3CfeColorMatrix%20in%3D%27t%27%20type%3D%27matrix%27%20values%3D%270%200%200%200%201%200%200%200%200%200.5%200%200%200%200%200%201%200%200%200%200%27%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%27100%25%27%20height%3D%27100%25%27%20fill%3D%27url%28%23g%29%27%20filter%3D%27url%28%23f%29%27%2F%3E%3C%2Fsvg%3E')";

const GRID = "radial-gradient(circle, #000 0.9px, transparent 1.3px)";

// Scoped by the df- prefix. Masks and motion live here rather than in utility
// classes, so the component renders the same on Tailwind v3 and v4.
const STYLES = `
.df-field { position: absolute; inset: 0; }
.df-field.df-lit {
  -webkit-mask-image: radial-gradient(circle 190px at var(--df-x, 50%) var(--df-y, 50%), #000 35%, rgb(0 0 0 / .22) 100%);
  mask-image: radial-gradient(circle 190px at var(--df-x, 50%) var(--df-y, 50%), #000 35%, rgb(0 0 0 / .22) 100%);
}
.df-dots {
  position: absolute; top: 0; bottom: 0; left: 0;
  width: calc(100% + 360px);
  background: var(--df-accent);
  will-change: transform;
  -webkit-mask-image: ${GRID}, ${DITHER};
  mask-image: ${GRID}, ${DITHER};
  -webkit-mask-size: 4px 4px, 360px 240px;
  mask-size: 4px 4px, 360px 240px;
  -webkit-mask-repeat: repeat, repeat-x;
  mask-repeat: repeat, repeat-x;
  -webkit-mask-position: 0 0, left bottom;
  mask-position: 0 0, left bottom;
  -webkit-mask-composite: source-in;
  mask-composite: intersect;
}
@media (prefers-reduced-motion: no-preference) {
  .df-dots { animation: df-drift 90s linear infinite; }
  @supports (animation-timeline: view()) {
    .df-band { view-timeline: --df-band; }
    .df-mark { animation: df-rise linear both; animation-timeline: --df-band; animation-range: entry 20% entry 100%; }
  }
}
@keyframes df-drift { to { transform: translateX(-360px); } }
@keyframes df-rise { from { translate: 0 30%; } }
`;

const toLinks = (labels: string[]): FooterLink[] =>
  labels.map((label) => ({ label, href: "/" + label.toLowerCase().replace(/\s+/g, "-") }));

const DEFAULT_SOCIALS: FooterSocial[] = [
  { label: "GitHub", href: "https://github.com", icon: <Icon name="github" size="sm" /> },
];

const DEFAULT_COLUMNS: FooterColumn[] = [
  { title: "Product", links: toLinks(["Features", "Pricing", "Changelog", "Roadmap"]) },
  { title: "Resources", links: toLinks(["Docs", "Guides", "Community", "Blog"]) },
  { title: "Company", links: toLinks(["About", "Careers", "Contact", "Press"]) },
];

const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--df-accent)]";
const coarse =
  "[@media(pointer:coarse)]:inline-flex [@media(pointer:coarse)]:min-h-11 [@media(pointer:coarse)]:items-center";

/** External links open in a new tab; internal routes stay in the same one. */
const ext = (href: string) =>
  /^https?:\/\//.test(href) ? ({ target: "_blank", rel: "noopener noreferrer" } as const) : {};

export default function DitheredFooter({
  brand = "Acme",
  brandHref = "/",
  brandLogo,
  tagline = "Tools for teams who ship. Built in the open, one release at a time.",
  brandNote,
  columns = DEFAULT_COLUMNS,
  socials = DEFAULT_SOCIALS,
  legal = toLinks(["Privacy", "Terms"]),
  copyright = `© ${new Date().getFullYear()} Acme, Inc.`,
  status = null,
  accent = "var(--neon)",
  onSubscribe,
}: DitheredFooterProps) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const field = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setState("sending");
    try {
      await onSubscribe?.(email);
      setState("done");
      setEmail("");
    } catch {
      setState("error");
    }
  };

  // Spotlight: dots under a mouse pointer stay at full strength and the rest dim.
  // Touch and pen get the plain field; there is no hover to follow.
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !field.current) return;
    const el = field.current;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty("--df-x", `${x}px`);
      el.style.setProperty("--df-y", `${y}px`);
      el.classList.add("df-lit");
    });
  };
  const onLeave = () => {
    cancelAnimationFrame(frame.current);
    field.current?.classList.remove("df-lit");
  };

  const toTop = () =>
    window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });

  return (
    <footer
      className="section-dark overflow-hidden border-t border-white/10"
      style={{ "--df-accent": accent } as CSSProperties}
    >
      <style>{STYLES}</style>

      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-12 px-6 pb-16 pt-16 sm:gap-x-10 sm:px-8 md:grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(0,1fr))]">
        <div className="col-span-2 md:col-span-1">
          <a
            href={brandHref}
            className={`inline-flex rounded-sm text-base font-semibold tracking-tight text-white ${focus}`}
          >
            {brandLogo ?? brand}
          </a>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/70">{tagline}</p>
          {brandNote}

          {onSubscribe ? (
            <form className="mt-8 max-w-sm" onSubmit={submit}>
              {/* A visible label, not a placeholder: placeholders vanish while you type. */}
              <label htmlFor="df-email" className="block text-sm font-medium text-white">
                Get product updates by email
              </label>
              <div className="mt-2 flex gap-2">
                <input
                  id="df-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setState("idle");
                  }}
                  className="h-10 min-w-0 flex-1 rounded-md border border-white/25 bg-transparent px-3 text-sm text-white transition-colors placeholder:text-white/40 focus:border-[var(--df-accent)] focus:outline focus:outline-2 focus:outline-offset-0 focus:outline-[var(--df-accent)] [@media(pointer:coarse)]:h-11"
                />
                <button
                  disabled={state === "sending"}
                  className={`h-10 shrink-0 rounded-md bg-white px-4 text-sm font-medium text-[#060606] transition hover:opacity-90 active:scale-[0.97] disabled:opacity-60 ${focus} [@media(pointer:coarse)]:h-11`}
                >
                  {state === "sending" ? "Subscribing…" : "Subscribe"}
                </button>
              </div>
              <p role="status" className="mt-2 min-h-5 text-sm text-white/60">
                {state === "done" && "Thanks. You're on the list."}
                {state === "error" && "That didn't go through. Please try again."}
              </p>
            </form>
          ) : null}
        </div>

        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <p className="text-sm font-medium text-white">{col.title}</p>
            <ul className="mt-4 space-y-3 [@media(pointer:coarse)]:space-y-0">
              {col.links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    {...ext(l.href)}
                    className={`rounded-sm text-sm text-white/70 transition-colors hover:text-white ${focus} ${coarse}`}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      {/* The name is not drawn: it is the gap in the dots. It is solid where the
          field is dense and dissolves as the dots thin out towards the top. */}
      <div
        aria-hidden="true"
        className="df-band relative h-60 overflow-hidden"
        onPointerMove={onMove}
        onPointerLeave={onLeave}
      >
        <div ref={field} className="df-field">
          {/* One tile wider than the band, slid left by exactly one tile, so the loop is seamless. */}
          <div className="df-dots" />
        </div>
        <p className="df-mark pointer-events-none absolute inset-x-0 -bottom-[0.05em] select-none text-center text-[clamp(5rem,21vw,13rem)] font-extrabold leading-[0.8] tracking-[-0.06em] text-[#060606]">
          {brand}
        </p>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-5 text-sm text-white/70 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <p>{copyright}</p>
            {legal.map((l) => (
              <a
                key={l.label}
                href={l.href}
                {...ext(l.href)}
                className={`rounded-sm transition-colors hover:text-white ${focus} ${coarse}`}
              >
                {l.label}
              </a>
            ))}
            {status && (
              <a
                href={status.href}
                {...ext(status.href)}
                className={`inline-flex items-center gap-2 rounded-sm transition-colors hover:text-white ${focus} ${coarse}`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                {status.label}
              </a>
            )}
          </div>
          <div className="-mr-2 flex items-center gap-1">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                {...ext(s.href)}
                className={`grid h-9 w-9 place-items-center rounded-md transition-colors hover:bg-white/5 hover:text-white ${focus} [@media(pointer:coarse)]:h-11 [@media(pointer:coarse)]:w-11`}
              >
                {s.icon}
              </a>
            ))}
            <span className="mx-2 h-4 w-px bg-white/10" aria-hidden="true" />
            <button
              type="button"
              onClick={toTop}
              className={`inline-flex items-center gap-1.5 rounded-sm px-1 text-white/70 transition-colors hover:text-white ${focus} ${coarse}`}
            >
              Back to top
              <Icon name="arrow-up" size="xs" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export { DitheredFooter };