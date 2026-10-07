"use client";

import { useEffect, useMemo, useState } from "react";
import { Button, Chip, MonoLabel, cn, pad2 } from "@/components/ui";
import { Icon, IconTile, type IconName } from "@/components/icons";
import { Composer } from "@/components/composer";
import { EmailWindow } from "@/components/email-window";
import { SignatureHtml } from "@/components/signature-html";
import { SignForgeMark, TheoToken, TheoVexMark, TheoVexPill } from "@/components/brand";
import { SITE, THEOVEX, THEO_AI } from "@/lib/site";
import { STATS } from "@/lib/stats";
import { EXAMPLES, SAMPLES, type Sample } from "@/lib/samples";
import { SCENES, getScene } from "@/scenes";
import { generateSignatureHTML } from "@/lib/signature-html";
import type { TemplateId } from "@/lib/templates";
import { usePrefersReducedMotion, useAppTheme } from "@/lib/hooks";

/* ── Shared bits ──────────────────────────────────────────────────────── */

const NUMBER_WORDS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve"];
const word = (n: number) => NUMBER_WORDS[n] ?? String(n);

// The TheoVex product accents, used the way theovex.com uses them: a coloured
// top border and a tinted tile per card, so each one reads as its own object.
const VIOLET = "#7c3aed";
const BLUE = "#2d6bff";
const CORAL = "#ff6a4d";
const GREEN = "#0e9f6e";

/** The numbered eyebrow, the big headline and one lead paragraph. */
function SectionHead({
  index,
  label,
  title,
  lead,
  onDark = false,
}: {
  index: number;
  label: string;
  title: React.ReactNode;
  lead?: string;
  onDark?: boolean;
}) {
  return (
    <div className="max-w-4xl">
      <MonoLabel className={onDark ? "text-white/55" : undefined}>
        <span aria-hidden className={onDark ? "text-white/30" : "text-ink/35"}>
          {pad2(index)} ·
        </span>
        {label}
      </MonoLabel>
      <h2 className={cn("display type-display-2 mt-4 sm:mt-5", onDark ? "text-white" : "text-ink")}>{title}</h2>
      {lead ? (
        <p className={cn("type-lead mt-4 max-w-2xl sm:mt-5", onDark ? "text-white/65" : "text-muted")}>{lead}</p>
      ) : null}
    </div>
  );
}

/* ── Hero ─────────────────────────────────────────────────────────────── */

const INDEX = [
  { id: "demo", label: "The live demo" },
  { id: "how", label: "How it works" },
  { id: "features", label: "What is inside" },
  { id: "theovex", label: "Who makes it" },
];

/** The page's table of contents as a ruled strip: number, label, arrow. */
function IndexStrip() {
  return (
    <nav aria-label="On this page" className="relative z-10 border-t border-line">
      <ol className="shell-wide grid divide-y divide-line text-left sm:grid-cols-4 sm:divide-x sm:divide-y-0">
        {INDEX.map((s, i) => (
          <li key={s.id} className="min-w-0">
            <a
              href={`#${s.id}`}
              className="group flex min-h-11 w-full items-center gap-4 px-5 py-3.5 transition-colors hover:bg-paper sm:px-6 sm:py-5"
            >
              <span className="mono-label shrink-0 text-ink/35">{pad2(i + 1)}</span>
              <span className="min-w-0 flex-1 text-[0.9375rem] font-medium leading-snug text-ink">{s.label}</span>
              <Icon
                name="arrow-down"
                size="sm"
                className="text-ink/30 transition-transform group-hover:translate-y-0.5 group-hover:text-ink/60"
              />
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function Hero({
  onGenerate,
  loading,
  hasDraft,
  onContinue,
}: {
  onGenerate: (prompt: string) => void;
  loading: boolean;
  hasDraft: boolean;
  onContinue: () => void;
}) {
  return (
    <section className="relative overflow-hidden border-b border-line">
      {/* Editorial side rules at the shared content edge. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-full max-w-[84rem] -translate-x-1/2 border-x border-line lg:block"
      />

      <div className="shell-gutter relative z-10 mx-auto flex max-w-5xl animate-fade-up flex-col items-center pb-12 pt-12 text-center sm:pb-16 sm:pt-20 lg:pt-24">
        <TheoVexPill />

        <h1 className="display type-display-1 mt-7 text-ink sm:mt-9">{SITE.tagline}</h1>

        <p className="type-lead mx-auto mt-6 max-w-2xl text-ink/75 sm:mt-8">
          Describe who you are and how the signature should look. {THEO_AI.name} designs it, previews it in an
          inbox scene, and exports table-based HTML that pastes into Gmail, Outlook, and Apple Mail.
        </p>

        <p className="mt-5 flex items-center justify-center gap-1.5 font-mono text-[12px] text-muted sm:mt-6">
          <TheoVexMark className="size-3.5" />
          Powered by{" "}
          <a
            href={THEO_AI.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-ink underline underline-offset-2 hover:opacity-70"
          >
            {THEO_AI.name}
          </a>
        </p>

        <div className="mt-9 w-full max-w-2xl text-left sm:mt-11">
          <Composer onSubmit={onGenerate} loading={loading} />
        </div>

        <div className="mx-auto mt-7 flex max-w-3xl flex-wrap justify-center gap-2">
          {EXAMPLES.map((e) => (
            <Chip key={e.label} onClick={() => onGenerate(e.prompt)} disabled={loading}>
              <Icon name={e.icon} size="xs" />
              {e.label}
            </Chip>
          ))}
        </div>

        {hasDraft ? (
          <button
            type="button"
            onClick={onContinue}
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
          >
            Continue where you left off
            <Icon name="arrow-right" size="sm" />
          </button>
        ) : null}

        <p className="mono-label mt-7 text-ink/50">
          {pad2(STATS.templates)} templates · {pad2(STATS.fonts)} fonts · {pad2(STATS.scenes)} scenes · No account
        </p>
      </div>

      <IndexStrip />
    </section>
  );
}

/* ── 01 · Live demo ───────────────────────────────────────────────────── */

function DemoStage({ onUseSample }: { onUseSample: (sample: Sample) => void }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = usePrefersReducedMotion();
  const theme = useAppTheme();

  useEffect(() => {
    if (paused || reduced) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % SAMPLES.length), 5600);
    return () => window.clearInterval(id);
  }, [paused, reduced]);

  const sample = SAMPLES[index];

  return (
    <section id="demo" className="shell-gutter shell-wide shell-section">
      <SectionHead
        index={1}
        label="The live demo"
        title={`${word(SAMPLES.length)} sentences, ${word(SAMPLES.length).toLowerCase()} signatures.`}
        lead="Each one below was designed from a single prompt. The signature in the window is the exact HTML you export."
      />

      <div
        key={sample.id}
        className="mt-8 inline-flex max-w-full animate-fade-in items-center gap-2 border border-line bg-paper px-3 py-1.5 text-xs text-muted sm:text-sm"
      >
        <SignForgeMark className="size-4 shrink-0" />
        <span className="truncate">&ldquo;{sample.prompt}&rdquo;</span>
      </div>

      <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} className="relative mt-4">
        <EmailWindow
          data={sample.data}
          templateId={sample.template}
          scene={getScene(sample.scene)}
          dark={theme === "dark"}
          revision={index}
        />
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2" role="tablist" aria-label="Example signatures">
          {SAMPLES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Example ${i + 1}`}
              onClick={() => setIndex(i)}
              className={cn(
                "h-2.5 border border-ink transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40",
                i === index ? "w-8 bg-neon" : "w-2.5 bg-transparent hover:bg-ink/20"
              )}
            />
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={() => onUseSample(sample)}>
          Start from this one
          <Icon name="arrow-right" size="sm" />
        </Button>
      </div>
    </section>
  );
}

/* ── 02 · How it works ────────────────────────────────────────────────── */

const STEPS: { icon: IconName; tint: string; title: string; text: string }[] = [
  {
    icon: "chat",
    tint: VIOLET,
    title: "Describe",
    text: "Your name, your role and the look you want, in plain English. The model returns a template, a color pair, a font and a scene as structured JSON. It never invents image URLs.",
  },
  {
    icon: "refine",
    tint: BLUE,
    title: "Refine",
    text: "Ask for changes in chat, or edit by hand. Template previews update live with your own details.",
  },
  {
    icon: "export",
    tint: GREEN,
    title: "Export",
    text: "Copy rich text, copy HTML, download a file or share a link. Tables and inline styles only, so Gmail, Outlook and Apple Mail render it the same way.",
  },
];

function HowItWorks() {
  return (
    <section id="how" className="shell-gutter shell-wide shell-section">
      <SectionHead index={2} label="How it works" title="Three steps. Under a minute." />
      <ol className="mt-10 grid gap-4 sm:mt-12 md:grid-cols-3">
        {STEPS.map((s, i) => (
          <li
            key={s.title}
            className="flex flex-col border border-line bg-paper p-5 transition-[transform,border-color] hover:-translate-y-0.5 hover:border-ink/30 sm:p-6"
            style={{ borderTop: `2px solid ${s.tint}` }}
          >
            <div className="flex items-start justify-between">
              <IconTile name={s.icon} tint={s.tint} size="lg" />
              <span className="mono-label text-ink/30">{pad2(i + 1)}</span>
            </div>
            <h3 className="display mt-6 text-[1.5rem] leading-none text-ink sm:text-[1.75rem]">{s.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{s.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ── 03 · What is inside ──────────────────────────────────────────────── */

function MiniSignature({ sample, template }: { sample: Sample; template: TemplateId }) {
  const html = useMemo(
    () => generateSignatureHTML(sample.data, template, { preserveFontVars: true }),
    [sample, template]
  );
  return (
    <div className="pointer-events-none h-[104px] overflow-hidden border border-line bg-white p-3" aria-hidden>
      <SignatureHtml html={html} style={{ width: "200%", transform: "scale(0.5)", transformOrigin: "top left" }} />
    </div>
  );
}

/** A flat card: a coloured top border, a mono category, a display title. */
function Card({
  tint,
  category,
  index,
  title,
  text,
  className,
  children,
}: {
  tint: string;
  category: string;
  index: number;
  title: string;
  text: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn("flex flex-col border border-line bg-paper p-5 sm:p-6", className)}
      style={{ borderTop: `2px solid ${tint}` }}
    >
      <div className="flex items-center gap-2">
        <span className="size-2 shrink-0" style={{ background: tint }} aria-hidden />
        <MonoLabel className="min-w-0 flex-1 text-ink/45">{category}</MonoLabel>
        <MonoLabel className="shrink-0 text-ink/25">{pad2(index)}</MonoLabel>
      </div>
      <h3 className="display mt-3.5 text-[1.5rem] leading-none text-ink sm:text-[1.75rem]">{title}</h3>
      <p className="mt-2.5 max-w-md text-[0.8125rem] leading-relaxed text-muted sm:mt-3 sm:text-sm">{text}</p>
      {children ? <div className="mt-6 flex-1">{children}</div> : null}
    </div>
  );
}

function Features() {
  const floaters: { icon: IconName; tint: string; delay: string }[] = [
    { icon: "wave", tint: CORAL, delay: "0s" },
    { icon: "rocket", tint: VIOLET, delay: "-2s" },
    { icon: "party", tint: GREEN, delay: "-4s" },
  ];

  return (
    <section id="features" className="shell-gutter shell-wide shell-section">
      <SectionHead
        index={3}
        label="What is inside"
        title={
          <>
            <span className="whitespace-nowrap">{STATS.templates} templates.</span>{" "}
            <span className="whitespace-nowrap">{STATS.fonts} fonts.</span>{" "}
            <span className="whitespace-nowrap">{STATS.scenes} scenes.</span>
          </>
        }
        lead="Everything runs in the browser except the AI call. No account, no database, no tracking."
      />

      <div className="mt-10 grid gap-4 sm:mt-12 md:grid-cols-6">
        <Card
          className="md:col-span-4"
          tint={VIOLET}
          category="Chat"
          index={1}
          title="Design by conversation"
          text="Ask for changes the way you would ask a designer. The model edits the template, colors and fonts, and can search for a GIF."
        >
          <div className="space-y-3 border border-line bg-paper-soft p-4">
            <div className="flex justify-end">
              <span className="border-2 border-ink bg-ink px-3.5 py-2 text-[13px] text-paper">
                Make it bolder and add a confetti GIF
              </span>
            </div>
            <div className="flex gap-2.5">
              <SignForgeMark className="size-6 shrink-0" />
              <div className="text-[13px] leading-relaxed text-ink">
                Switched to Startup in violet and found three confetti GIFs.
                <div className="mt-2 flex gap-1.5">
                  {(["party", "sparkles", "rocket"] as const).map((n, i) => (
                    <IconTile key={n} name={n} tint={[GREEN, VIOLET, CORAL][i]} size="lg" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card
          className="md:col-span-2"
          tint={BLUE}
          category="Export"
          index={2}
          title={`${STATS.templates} email-safe templates`}
          text="Tables and inline styles only, so they render everywhere."
        >
          <div className="grid gap-2">
            <MiniSignature sample={SAMPLES[0]} template="minimal-modern" />
            <MiniSignature sample={SAMPLES[4]} template="modern-card" />
          </div>
        </Card>

        <Card
          className="md:col-span-2"
          tint={CORAL}
          category="Extras"
          index={3}
          title="Animated GIF banners"
          text="Search GIPHY, or paste a URL. Results stay family-friendly."
        >
          <div className="flex justify-center gap-3 pt-1">
            {floaters.map((f) => (
              <span key={f.icon} className="animate-float" style={{ animationDelay: f.delay }}>
                <IconTile name={f.icon} tint={f.tint} size="xl" />
              </span>
            ))}
          </div>
        </Card>

        <Card
          className="md:col-span-2"
          tint={GREEN}
          category="Preview"
          index={4}
          title={`${STATS.scenes} inbox scenes`}
          text="Pirate, noir, cosmic, and more. Scenes change the mock inbox, never your export."
        >
          <div className="flex flex-wrap gap-1.5">
            {SCENES.map((s) => (
              <span
                key={s.id}
                className="inline-flex items-center gap-1.5 border border-line bg-paper-soft py-1 pl-1 pr-2 text-[11px] font-medium text-ink"
              >
                <IconTile name={s.icon} tint={s.accent} size="xs" />
                {s.name}
              </span>
            ))}
          </div>
        </Card>

        <Card
          className="md:col-span-2"
          tint="var(--ink)"
          category="Privacy"
          index={5}
          title="Private by design"
          text="Your signature lives in your browser."
        >
          <ul className="space-y-2 text-sm text-ink">
            {[`${SITE.license} licensed`, "No account, no database", "Draft stays in your browser", "Dark-mode preview built in"].map(
              (t) => (
                <li key={t} className="flex items-center gap-2.5">
                  <span className="flex size-5 shrink-0 items-center justify-center border border-ink bg-neon text-neon-ink">
                    <Icon name="lock" size="xs" />
                  </span>
                  {t}
                </li>
              )
            )}
          </ul>
        </Card>
      </div>
    </section>
  );
}

/* ── 04 · Who makes it ────────────────────────────────────────────────── */

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

function TheoVexBand() {
  return (
    <section id="theovex" className="shell-gutter shell-wide shell-section">
      <div className="section-dark relative isolate overflow-hidden border border-white/10 px-5 py-12 text-center sm:px-16 sm:py-20">
        <div aria-hidden className="grid-lines pointer-events-none absolute inset-0 -z-10 opacity-50" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_50%_0%,rgba(124,58,237,0.22),transparent_70%)]"
        />

        <MonoLabel dot className="justify-center text-white/55">
          <span aria-hidden className="text-white/30">
            04 ·
          </span>
          From {THEOVEX.name}
          <TheoVexMark className="size-4" />
        </MonoLabel>

        <h2 className="display type-display-1 mx-auto mt-5 max-w-3xl text-white sm:mt-6">
          Build on <TheoToken />.
        </h2>

        <p className="type-lead mx-auto mt-5 max-w-2xl text-white/65 sm:mt-6">
          {THEOVEX.blurb} {SITE.name} is a free project from the team. The code is {SITE.license}: read it, run
          it, change it.
        </p>

        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:mt-10 sm:flex-row sm:items-center">
          <a
            href={THEO_AI.url}
            {...ext}
            className="inline-flex h-12 items-center justify-center gap-2 bg-white px-6 text-[15px] font-medium text-[#0a0a0a] transition-colors hover:bg-white/85"
          >
            Meet {THEO_AI.name}
            <Icon name="arrow-up-right" size="md" />
          </a>
          <a
            href={THEOVEX.url}
            {...ext}
            className="inline-flex h-12 items-center justify-center gap-2 border border-white/30 px-6 text-[15px] font-medium text-white transition-colors hover:bg-white/10"
          >
            Meet {THEOVEX.name}
            <Icon name="arrow-up-right" size="md" />
          </a>
          <a
            href={THEOVEX.docsUrl}
            {...ext}
            className="inline-flex h-12 items-center justify-center gap-2 border border-white/30 px-6 text-[15px] font-medium text-white transition-colors hover:bg-white/10"
          >
            Build on Theo
            <Icon name="arrow-up-right" size="md" />
          </a>
          <a
            href={THEOVEX.openChartsUrl}
            {...ext}
            className="inline-flex h-12 items-center justify-center gap-2 border border-white/30 px-6 text-[15px] font-medium text-white transition-colors hover:bg-white/10"
          >
            See OpenCharts
            <Icon name="arrow-up-right" size="md" />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ── Landing ──────────────────────────────────────────────────────────── */

export function Landing({
  onGenerate,
  loading,
  hasDraft,
  onContinue,
  onUseSample,
}: {
  onGenerate: (prompt: string) => void;
  loading: boolean;
  hasDraft: boolean;
  onContinue: () => void;
  onUseSample: (sample: Sample) => void;
}) {
  return (
    <>
      <Hero onGenerate={onGenerate} loading={loading} hasDraft={hasDraft} onContinue={onContinue} />
      <DemoStage onUseSample={onUseSample} />
      <HowItWorks />
      <Features />
      <TheoVexBand />
    </>
  );
}
