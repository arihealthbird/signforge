import Link from "next/link";
import { Logo, TheoVexMark } from "@/components/brand";
import {
  DitheredFooter,
  type FooterColumn,
  type FooterSocial,
} from "@/components/dithered-footer";
import { Icon } from "@/components/icons";
import { SITE, THEOVEX, THEO_AI } from "@/lib/site";

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

/**
 * The footer. The full version is the dithered footer: a neon dot field with
 * the wordmark punched out of it, plus link columns and fine print on an
 * always-dark surface. `compact` is a flat line, used on the legal pages and
 * in the studio, where the page should stay quiet.
 */
export function SiteFooter({ compact = false }: { compact?: boolean }) {
  const year = new Date().getFullYear();

  if (compact) {
    return (
      <footer className="border-t border-line">
        <div className="shell-gutter shell-wide flex flex-col items-center justify-between gap-3 py-6 text-xs text-muted sm:flex-row">
          <p>
            &copy; {year} {THEOVEX.name}. {SITE.name} is free and open source under {SITE.license}.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="hover:text-ink">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-ink">
              Terms
            </Link>
            <a href={THEO_AI.url} {...ext} className="inline-flex items-center gap-1.5 hover:text-ink">
              <TheoVexMark className="size-3" />{THEO_AI.name}
            </a>
            <a href={THEOVEX.url} {...ext} className="inline-flex items-center gap-1.5 hover:text-ink">
              <TheoVexMark className="size-3" />A {THEOVEX.name} project
            </a>
          </div>
        </div>
      </footer>
    );
  }

  const columns: FooterColumn[] = [
    {
      title: "Product",
      links: [
        { label: "How it works", href: "/#how" },
        { label: "Features", href: "/#features" },
        { label: "Open the studio", href: "/" },
      ],
    },
    {
      title: "Open source",
      links: [
        { label: "GitHub", href: SITE.repoUrl },
        { label: `${SITE.license} license`, href: `${SITE.repoUrl}/blob/main/LICENSE` },
        { label: "Contributing", href: `${SITE.repoUrl}/blob/main/CONTRIBUTING.md` },
        { label: "Security", href: `${SITE.repoUrl}/blob/main/SECURITY.md` },
      ],
    },
    {
      title: THEOVEX.name,
      links: [
        { label: "theovex.com", href: THEOVEX.url },
        { label: THEO_AI.name, href: THEO_AI.url },
        { label: "OpenCharts", href: THEOVEX.openChartsUrl },
        { label: "Build on Theo", href: THEOVEX.docsUrl },
      ],
    },
  ];

  const socials: FooterSocial[] = [
    { label: "GitHub", href: SITE.repoUrl, icon: <Icon name="github" size="sm" /> },
  ];

  return (
    <DitheredFooter
      brand={SITE.name}
      brandHref="/"
      brandLogo={<Logo inverse />}
      tagline={SITE.tagline}
      brandNote={
        <a
          href={THEOVEX.url}
          {...ext}
          className="mt-3 inline-flex items-center gap-1.5 text-xs text-white/60 transition-colors hover:text-white"
        >
          <TheoVexMark tone="mono" className="size-3.5" />A {THEOVEX.name} project
        </a>
      }
      columns={columns}
      socials={socials}
      legal={[
        { label: "Privacy", href: "/privacy" },
        { label: "Terms", href: "/terms" },
      ]}
      copyright={`© ${year} ${THEOVEX.name}. ${SITE.name} is free and open source under ${SITE.license}.`}
    />
  );
}
