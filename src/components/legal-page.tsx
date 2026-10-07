import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MonoLabel, pad2 } from "@/components/ui";

export interface LegalSection {
  title: string;
  body: string[];
}

/** Shared layout for the privacy policy and terms of use. */
export function LegalPage({
  title,
  updated,
  sections,
}: {
  title: string;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <div className="relative min-h-screen">
      <SiteHeader variant="page" />
      <main className="shell-gutter mx-auto max-w-3xl pb-20 pt-12 sm:pt-20">
        <MonoLabel dot>Legal</MonoLabel>
        <h1 className="display mt-5 text-[clamp(2.25rem,7vw,4rem)] text-ink">{title}</h1>
        <p className="mono-label mt-4 text-ink/45">Last updated: {updated}</p>

        <div className="mt-12 space-y-10 border-t border-line pt-10">
          {sections.map((s, i) => (
            <section key={s.title}>
              <h2 className="flex items-baseline gap-3">
                <span className="mono-label shrink-0 text-ink/30">{pad2(i + 1)}</span>
                <span className="text-xl font-semibold tracking-tight text-ink">{s.title}</span>
              </h2>
              <div className="mt-3 space-y-3 sm:pl-9">
                {s.body.map((p, j) => (
                  <p key={j} className="text-[15px] leading-relaxed text-muted">
                    {p}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
      <SiteFooter compact />
    </div>
  );
}
