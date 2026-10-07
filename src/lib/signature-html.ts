import { SignatureData } from "@/types/signature";
import { DEFAULT_TEMPLATE_ID, getTemplate, type TemplateId } from "@/lib/templates";
import { SITE, THEOVEX, THEO_AI } from "@/lib/site";
import { DESIGNS, DESIGN_ALIGN } from "@/lib/signature";
import { aligned, attr, hex6, liftForDark, makeCtx, row, tbl, url, type Ctx } from "@/lib/signature/kit";

/**
 * Pure, email-safe signature HTML generation.
 *
 * Every design returns a table-based fragment with inline styles only: no
 * classes, no external assets, no SVG. This is the single source of truth used
 * for BOTH the on-screen preview and the copy/download export. The designs
 * themselves live in `src/lib/signature/designs`, built from the primitives in
 * `src/lib/signature/kit.ts`.
 *
 * Data is stored raw and escaped exactly once, in the kit, at render time.
 * Everything that lands in a `style` attribute is normalized here first.
 */

function oneOf<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return typeof value === "string" && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : fallback;
}

/**
 * Font stacks are interpolated into a `style` attribute, so only a tight
 * whitelist of characters survives. This also neutralises `;` and `"` from
 * untrusted share links.
 */
function safeFont(family: string): string {
  return family
    .replace(/"/g, "'")
    .replace(/[^A-Za-z0-9 ,'\-_().]/g, "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .join(", ");
}

// Keeps var(--font-x) tokens so the self-hosted preview fonts apply on screen.
function fontStack(family: string): string {
  return safeFont(family);
}

// Email clients do not define CSS custom properties, so strip var(--font-x)
// tokens for the exported HTML.
function stripFontVars(family: string): string {
  return safeFont(family)
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s && !s.startsWith("var("))
    .join(", ");
}

/** Clamps and validates every value that is interpolated into a style attribute. */
function normalize(data: SignatureData, fontFamily: string, dark: boolean): SignatureData {
  const size = Number.isFinite(data.fontSize) ? Math.round(data.fontSize) : 14;
  const tone = (color: string) => (dark ? liftForDark(hex6(color)) : hex6(color));
  return {
    ...data,
    fontFamily: fontFamily || "Arial, Helvetica, sans-serif",
    fontSize: Math.min(24, Math.max(8, size)),
    primaryColor: tone(data.primaryColor),
    secondaryColor: data.secondaryColor ? tone(data.secondaryColor) : undefined,
    textColor: data.textColor ? tone(data.textColor) : undefined,
    dividerStyle: oneOf(data.dividerStyle, ["solid", "dashed", "dotted", "none"] as const, "solid"),
    photoShape: oneOf(data.photoShape, ["circle", "rounded", "square"] as const, "circle"),
    contentPadding: oneOf(data.contentPadding, ["compact", "normal", "relaxed"] as const, "normal"),
    socialLinks: Array.isArray(data.socialLinks) ? data.socialLinks : [],
  };
}

// ── Banner + credit ───────────────────────────────────────────────────

function banner(c: Ctx): string {
  const src = url(c.d.gifBannerUrl) || url(c.d.bannerUrl);
  if (!src) return "";
  const link = url(c.d.bannerLink);
  // Boxed in both directions so a tall GIF can't dominate the signature. The
  // width attribute is for Outlook for Windows, which ignores CSS image sizing.
  const image = `<img src="${attr(src)}" alt="Banner" width="360" style="display:block;width:auto;height:auto;max-width:360px;max-height:200px;border:0;border-radius:8px;" />`;
  return link ? `<a href="${attr(link)}" style="text-decoration:none;">${image}</a>` : image;
}

function credit(c: Ctx): string {
  const color = c.t.muted;
  const a = `color:${color};text-decoration:underline;`;
  return `<span style="font-family:${c.t.font};font-size:${c.t.size.fine}px;line-height:${Math.round(c.t.size.fine * 1.45)}px;mso-line-height-rule:exactly;color:${color};">Made with <a href="${attr(SITE.repoUrl)}" style="${a}">${SITE.name}</a>, a <a href="${attr(THEOVEX.url)}" style="${a}">${THEOVEX.name}</a> project &middot; Powered by <a href="${attr(THEO_AI.url)}" style="${a}">${THEO_AI.name}</a></span>`;
}

export interface HtmlOptions {
  dark?: boolean;
  /**
   * Keep `var(--font-x)` tokens so self-hosted fonts apply on screen.
   * Defaults to false (strips them) for email-safe export.
   */
  preserveFontVars?: boolean;
  /** Append the small "Made with SignForge · Powered by Theo AI" line. Defaults to false. */
  credit?: boolean;
}

/**
 * Generate the email-safe signature HTML fragment for a given template.
 * Safe to render via dangerouslySetInnerHTML: all text and URLs are escaped
 * and every style value is normalized.
 *
 * - Preview: call with `{ preserveFontVars: true }` so loaded fonts apply.
 * - Export: omit the flag (defaults to stripping `var(...)` tokens).
 */
export function generateSignatureHTML(
  data: SignatureData,
  templateId: TemplateId,
  options: HtmlOptions = {}
): string {
  const template = getTemplate(templateId);
  const fontFamily = options.preserveFontVars
    ? fontStack(data.fontFamily ?? "")
    : stripFontVars(data.fontFamily ?? "");
  const dark = options.dark ?? false;
  const c = makeCtx(normalize(data, fontFamily, dark), dark);

  const body = (DESIGNS[template.id] ?? DESIGNS[DEFAULT_TEMPLATE_ID])(c);
  const bannerHtml = banner(c);
  const creditHtml = options.credit ? credit(c) : "";
  if (!bannerHtml && !creditHtml) return body;

  // The banner and credit line follow the design's alignment (centered, right).
  const a = DESIGN_ALIGN[template.id] ?? "left";
  return tbl(
    row(body) +
      (bannerHtml ? row(aligned(bannerHtml, a), { pt: 14, align: a }) : "") +
      (creditHtml ? row(creditHtml, { pt: 12, align: a }) : "")
  );
}

/** Wraps the fragment in a minimal standalone HTML document for file download. */
export function wrapHtmlDocument(fragment: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Signature</title></head><body style="margin:0;padding:24px;background:#ffffff;">${fragment}</body></html>`;
}

/**
 * A readable plain-text twin of the HTML, for the text/plain clipboard flavour.
 * The markup uses entities (`&nbsp;`, `&middot;` and the escapes) that a plain-text
 * field would otherwise show literally.
 */
export function htmlToPlainText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(tr|p|div)>/gi, "\n")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&middot;/g, "\u00B7")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&#x2F;/g, "/")
    // Last, so text a user typed as "&lt;" (escaped to "&amp;lt;") is not decoded twice.
    .replace(/&amp;/g, "&")
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{2,}/g, "\n")
    .trim();
}
