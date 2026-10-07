import type { SignatureData } from "@/types/signature";
import { escapeHtml, escapeAttr, validateUrl, sanitizeColor } from "@/lib/security";

/**
 * Building blocks for the signature designs.
 *
 * Every design is a small function that composes these primitives, so the
 * email-safety rules live in one place:
 *
 * - Padding, borders and backgrounds sit on table cells. Outlook for Windows
 *   ignores padding on links and spans, and borders on divs.
 * - Images carry HTML width and height attributes, because Outlook for Windows
 *   ignores CSS width on images.
 * - Font weights are `normal` or `bold`, letter-spacing is in px, and every
 *   text cell sets an exact px line-height (with `mso-line-height-rule`).
 * - No gradients, shadows, opacity, margin spacing, min-width or
 *   border-spacing. Rounded corners are an enhancement: Outlook for Windows
 *   draws them square.
 * - Every table is presentational and sets `border-collapse:separate`, so the
 *   in-app preview and a real inbox draw rounded cells the same way.
 *
 * Data is stored raw and escaped exactly once, here. Text goes through `esc`,
 * attribute values through `attr`, URLs through `url`, and every value that
 * lands in a `style` attribute comes from the normalized data or the tokens.
 */

export const esc = (v?: string | null) => escapeHtml(v);
export const attr = (v?: string | null) => escapeAttr(v);
export const url = (v?: string | null): string | null => validateUrl(v) || null;

/** Monospace stack for tiles and the Terminal design. */
export const MONO = "'Courier New',Courier,monospace";

// ── Colour ────────────────────────────────────────────────────────────

/** Validates a colour and reduces it to plain 6-digit hex. */
export function hex6(color: string): string {
  const c = sanitizeColor(color).replace("#", "");
  if (c.length === 3 || c.length === 4) {
    return "#" + c.slice(0, 3).split("").map((ch) => ch + ch).join("");
  }
  return "#" + c.slice(0, 6);
}

/** WCAG relative luminance of a 6-digit hex colour. */
export function luminance(hex: string): number {
  const channel = (start: number) => {
    const v = parseInt(hex.slice(start, start + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
}

/** WCAG contrast ratio between two 6-digit hex colours. */
export function contrast(a: string, b: string): number {
  const x = luminance(a);
  const y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

const toHex = (n: number) =>
  Math.round(Math.min(255, Math.max(0, n))).toString(16).padStart(2, "0");

/** Mixes `a` toward `b`: t = 0 is `a`, t = 1 is `b`. */
export function mix(a: string, b: string, t: number): string {
  const ch = (h: string, s: number) => parseInt(h.slice(s, s + 2), 16);
  const m = (s: number) => toHex(ch(a, s) + (ch(b, s) - ch(a, s)) * t);
  return `#${m(1)}${m(3)}${m(5)}`;
}

/**
 * Moves `fg` toward black (on a light background) or white (on a dark one)
 * until it reaches `min` contrast against `bg`. A colour that already passes is
 * returned unchanged.
 */
export function ensureContrast(fg: string, bg: string, min = 4.5): string {
  if (contrast(fg, bg) >= min) return fg;
  const target = luminance(bg) > 0.4 ? "#000000" : "#ffffff";
  for (let t = 0.05; t <= 1.0001; t += 0.05) {
    const next = mix(fg, target, t);
    if (contrast(next, bg) >= min) return next;
  }
  return target;
}

export const LIGHT_BG = "#ffffff";
/** Roughly the background of a dark inbox, used to judge contrast. */
export const DARK_BG = "#18181c";

/**
 * Dark-mode email clients recolour dark accents so they stay readable. The dark
 * PREVIEW does the same. The exported HTML is never touched.
 */
export function liftForDark(hex: string): string {
  return ensureContrast(hex, DARK_BG, 4.5);
}

/** White or near-black, whichever reads on `fill` (white wins when it passes). */
export function readableOn(fill: string, min = 4.5): string {
  const white = contrast("#ffffff", fill);
  const dark = contrast("#111111", fill);
  if (white >= min) return "#ffffff";
  if (dark >= min) return "#111111";
  return white >= dark ? "#ffffff" : "#111111";
}

/** Softens `ink` toward `bg` by up to `t`, never dropping below `min` contrast. */
function soften(ink: string, bg: string, t: number, min: number): string {
  for (let k = t; k > 0; k -= 0.04) {
    const next = mix(ink, bg, k);
    if (contrast(next, bg) >= min) return next;
  }
  return ink;
}

// ── Tokens ────────────────────────────────────────────────────────────

export interface Tokens {
  dark: boolean;
  font: string;
  base: number;
  size: { name: number; lead: number; body: number; small: number; label: number; fine: number };
  /** Spacing unit in px, scaled by the Spacing control. */
  u: number;
  /** The inbox background the colours are judged against. */
  bg: string;
  ink: string;
  body: string;
  muted: string;
  hair: string;
  /** The exact swatch: fills, bars and large text. */
  accent: string;
  /** The accent made safe for small text on the inbox background. */
  accentInk: string;
  /** Text on an accent fill, for small type (4.5:1). */
  onAccent: string;
  /** Text on an accent fill, for large bold type (3:1). */
  onAccentLg: string;
  /** Secondary colour (or the accent): rules and details. */
  rule: string;
  tint: string;
  tintStrong: string;
  panel: string;
}

/** Builds the tokens from NORMALIZED data (6-digit hex, clamped size, valid enums). */
export function makeTokens(d: SignatureData, dark: boolean): Tokens {
  const bg = dark ? DARK_BG : LIGHT_BG;
  const base = d.fontSize;
  const px = (k: number, floor: number) => Math.max(floor, Math.round(base * k));
  const accent = d.primaryColor;
  const custom = d.textColor;
  const ink = custom ?? (dark ? "#f4f4f5" : "#111827");
  return {
    dark,
    font: d.fontFamily,
    base,
    size: {
      name: px(1.5, 14),
      lead: Math.max(base, 10),
      body: px(0.93, 10),
      small: px(0.86, 10),
      label: px(0.72, 9),
      fine: px(0.8, 10),
    },
    u: d.contentPadding === "compact" ? 3 : d.contentPadding === "relaxed" ? 6 : 4,
    bg,
    ink,
    body: custom ? soften(ink, bg, 0.12, 7) : dark ? "#d4d4d8" : "#374151",
    muted: custom ? soften(ink, bg, 0.4, 4.5) : dark ? "#a1a1aa" : "#6b7280",
    hair: dark ? "#35353d" : "#e5e7eb",
    accent,
    accentInk: dark ? accent : ensureContrast(accent, bg, 4.5),
    onAccent: readableOn(accent, 4.5),
    onAccentLg: readableOn(accent, 3),
    rule: d.secondaryColor ?? accent,
    tint: dark ? mix(accent, DARK_BG, 0.8) : mix(accent, LIGHT_BG, 0.9),
    tintStrong: dark ? mix(accent, DARK_BG, 0.68) : mix(accent, LIGHT_BG, 0.82),
    panel: dark ? "#1f1f24" : "#f9fafb",
  };
}

// ── Context ───────────────────────────────────────────────────────────

const PLATFORM_LABELS: Record<string, string> = {
  linkedin: "LinkedIn",
  twitter: "X",
  facebook: "Facebook",
  instagram: "Instagram",
  github: "GitHub",
  youtube: "YouTube",
  tiktok: "TikTok",
  website: "Website",
};

export interface SocialItem {
  /** Already escaped. */
  label: string;
  href: string;
}

/** Everything a design needs, already escaped and validated. */
export interface Ctx {
  d: SignatureData;
  dark: boolean;
  t: Tokens;
  /** Escaped, with a placeholder when empty. */
  name: string;
  title: string;
  company: string;
  /** Escaped, or an empty string. */
  dept: string;
  initials: string;
  email: string;
  phone: string;
  web: { href: string; label: string } | null;
  /** Escaped address lines: street, city line, country. */
  addr: string[];
  links: SocialItem[];
  cta: string | null;
  photo: string | null;
  logo: string | null;
  /** Escaped disclaimer, or an empty string. */
  fine: string;
}

function initialsOf(name?: string): string {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  const first = Array.from(parts[0])[0] ?? "";
  const last = parts.length > 1 ? (Array.from(parts[parts.length - 1])[0] ?? "") : "";
  return (first + last).toUpperCase();
}

export function makeCtx(d: SignatureData, dark: boolean): Ctx {
  const web = url(d.website);
  const cityLine = [d.city, [d.state, d.zipCode].filter(Boolean).join(" ")].filter(Boolean).join(", ");
  const addr = [d.address, cityLine, d.country]
    .filter((v): v is string => typeof v === "string" && v.trim().length > 0)
    .map(esc);
  const links: SocialItem[] = [];
  for (const l of d.socialLinks) {
    const href = url(l.url);
    if (href) links.push({ label: esc(PLATFORM_LABELS[l.platform] || l.platform), href });
  }
  return {
    d,
    dark,
    t: makeTokens(d, dark),
    name: esc(d.fullName || "Your Name"),
    title: esc(d.jobTitle || "Job Title"),
    company: esc(d.company || "Company"),
    dept: esc(d.department),
    initials: esc(initialsOf(d.fullName)),
    email: (d.email ?? "").trim(),
    phone: (d.phone ?? "").trim(),
    web: web ? { href: web, label: web.replace(/^https?:\/\//, "") } : null,
    addr,
    links,
    cta: url(d.calendarLink),
    photo: url(d.profilePhotoUrl),
    logo: url(d.logoUrl),
    fine: esc(d.disclaimer),
  };
}

// ── Markup primitives ─────────────────────────────────────────────────

export type Align = "left" | "center" | "right";
export type Role = "name" | "lead" | "body" | "small" | "label" | "fine";

export interface TextOpts {
  size?: number;
  color?: string;
  bold?: boolean;
  italic?: boolean;
  caps?: boolean;
  track?: number;
  lh?: number;
  font?: string;
}

export interface RowOpts {
  pt?: number;
  pb?: number;
  align?: Align;
  style?: string;
  attrs?: string;
}

export interface TblOpts {
  w?: number;
  full?: boolean;
  align?: Align;
  style?: string;
}

/**
 * A presentational layout table. A centred or right-aligned table carries the
 * `align` attribute for Outlook and an auto margin for everything else: the
 * attribute alone is overridden by any page that resets margins (as the app does).
 */
export function tbl(rows: string, o: TblOpts = {}): string {
  const width = o.full ? ` width="100%"` : o.w ? ` width="${o.w}"` : "";
  const align = o.align && o.align !== "left" ? ` align="${o.align}"` : "";
  const auto =
    o.align === "center" ? "margin-left:auto;margin-right:auto;" : o.align === "right" ? "margin-left:auto;" : "";
  const style =
    "border-collapse:separate;" +
    (o.full ? "width:100%;" : o.w ? `width:${o.w}px;` : "") +
    auto +
    (o.style ?? "");
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0"${width}${align} style="${style}"><tbody>${rows}</tbody></table>`;
}

export const tr = (...cells: string[]) => `<tr>${cells.join("")}</tr>`;

/** One cell. `attrs` is for constants only (valign, width, colspan), never user data. */
export function td(html: string, style = "", attrs = ""): string {
  return `<td${attrs ? ` ${attrs}` : ""}${style ? ` style="${style}"` : ""}>${html}</td>`;
}

/** A one-cell row. Empty content draws nothing, so a missing field leaves no blank row. */
export function row(html: string, o: RowOpts = {}): string {
  if (!html) return "";
  const shifted = o.align && o.align !== "left";
  const style =
    (o.pt ? `padding-top:${o.pt}px;` : "") +
    (o.pb ? `padding-bottom:${o.pb}px;` : "") +
    (shifted ? `text-align:${o.align};` : "") +
    (o.style ?? "");
  return `<tr><td${shifted ? ` align="${o.align}"` : ""}${o.attrs ? ` ${o.attrs}` : ""}${style ? ` style="${style}"` : ""}>${html}</td></tr>`;
}

/** Centres a block inside a wider cell (auto margins are not honoured by Outlook). */
export const centered = (html: string) => tbl(row(html), { align: "center" });

/** Places a block flush left, centred or flush right inside a wider cell. */
export const aligned = (html: string, a: Align) => (a === "left" ? html : tbl(row(html), { align: a }));

/** Inline style for a text role. */
export function tstyle(c: Ctx, role: Role, o: TextOpts = {}): string {
  const t = c.t;
  const size = o.size ?? t.size[role];
  const color = o.color ?? (role === "name" ? t.ink : role === "lead" || role === "body" ? t.body : t.muted);
  const bold = o.bold ?? role === "name";
  const caps = o.caps ?? role === "label";
  const track = o.track ?? (caps ? 1 : 0);
  const k = role === "name" ? 1.25 : role === "fine" ? 1.45 : 1.4;
  const lh = o.lh ?? Math.round(size * k);
  return (
    `font-family:${o.font ?? t.font};font-size:${size}px;line-height:${lh}px;mso-line-height-rule:exactly;color:${color};` +
    (bold ? "font-weight:bold;" : "") +
    (o.italic ? "font-style:italic;" : "") +
    (caps ? "text-transform:uppercase;" : "") +
    (track ? `letter-spacing:${track}px;` : "")
  );
}

/** A text row: one cell carrying the full type style. */
export function trow(c: Ctx, role: Role, html: string, o: TextOpts & RowOpts = {}): string {
  return row(html, { pt: o.pt, pb: o.pb, align: o.align, attrs: o.attrs, style: tstyle(c, role, o) + (o.style ?? "") });
}

/** A border for one edge. The accent rule honours the Divider control; hairlines always draw. */
export function edge(
  c: Ctx,
  side: "top" | "bottom" | "left" | "right",
  o: { kind?: "rule" | "hair"; w?: number; color?: string } = {}
): string {
  if ((o.kind ?? "rule") === "hair") return `border-${side}:${o.w ?? 1}px solid ${o.color ?? c.t.hair};`;
  const style = c.d.dividerStyle ?? "solid";
  if (style === "none") return "";
  return `border-${side}:${o.w ?? 2}px ${style} ${o.color ?? c.t.rule};`;
}

export const dot = (c: Ctx) => `<span style="color:${c.t.muted};">&nbsp;&middot;&nbsp;</span>`;

/** Joins non-empty HTML fragments. */
export const join = (parts: Array<string | false | null | undefined>, sep: string) =>
  parts.filter((p): p is string => Boolean(p)).join(sep);

/** Role, then the department when there is one. */
export const roleDept = (c: Ctx) => join([c.title, c.dept], dot(c));

export function link(href: string, html: string, color: string, extra = ""): string {
  return `<a href="${attr(href)}" style="color:${color};text-decoration:none;${extra}">${html}</a>`;
}

/** A `tel:` href that keeps only digits and a leading plus, or null when it is not dialable. */
export function telHref(phone: string): string | null {
  const digits = phone.replace(/[^\d+]/g, "").replace(/(?!^)\+/g, "");
  return digits.replace(/\D/g, "").length >= 3 ? `tel:${digits}` : null;
}

// ── Marks and logos ───────────────────────────────────────────────────

export interface MarkOpts {
  size: number;
  /** Height for a tall mark. Defaults to `size`. */
  h?: number;
  fill?: "solid" | "ring" | "tint";
  /** Overrides the Photo shape control for designs whose geometry needs it. */
  shape?: "circle" | "rounded" | "square";
  /** Pass false for designs that show a photo but never draw initials. */
  monogram?: boolean;
  /** Draw on an accent panel: outline and initials in the on-accent colour. */
  inverse?: boolean;
}

function radiusOf(shape: string, w: number, h: number): string {
  if (shape === "square") return "0";
  if (shape === "rounded") return `${Math.max(6, Math.round(Math.min(w, h) * 0.16))}px`;
  return w === h ? "50%" : `${Math.round(Math.min(w, h) / 2)}px`;
}

/** The photo, or the initials monogram, in the requested size and fill. */
export function mark(c: Ctx, o: MarkOpts): string {
  const t = c.t;
  const w = o.size;
  const h = o.h ?? o.size;
  const r = radiusOf(o.shape ?? c.d.photoShape ?? "circle", w, h);
  if (c.photo) {
    // The pixel max-width keeps the photo from collapsing in a shrink-to-fit cell next to a
    // `width:100%` cell, which a percentage max-width (as many page resets add) would allow.
    return `<img src="${attr(c.photo)}" alt="${esc(c.d.fullName || "Profile photo")}" width="${w}" height="${h}" style="display:block;width:${w}px;height:${h}px;max-width:${w}px;border:0;border-radius:${r};object-fit:cover;" />`;
  }
  if (o.monogram === false || c.d.showMonogram === false || !c.initials) return "";

  const fill = o.fill ?? "solid";
  const bw = fill === "ring" ? 2 : 0;
  const iw = w - bw * 2;
  const ih = h - bw * 2;
  let look: string;
  if (fill === "ring") {
    const col = o.inverse ? t.onAccent : t.accent;
    look = `border:2px solid ${col};color:${o.inverse ? t.onAccent : t.accentInk};`;
  } else if (fill === "tint") {
    look = `background-color:${t.tintStrong};color:${ensureContrast(t.accentInk, t.tintStrong, 4.5)};`;
  } else {
    look = `background-color:${t.accent};color:${t.onAccentLg};`;
  }
  const fs = Math.round(Math.min(iw, ih) * (c.initials.length > 1 ? 0.36 : 0.44));
  // The table gets a definite width so a neighbouring `width:100%` cell cannot squeeze it.
  return tbl(
    tr(
      `<td width="${iw}" height="${ih}" align="center" valign="middle" style="width:${iw}px;height:${ih}px;${look}border-radius:${r};font-family:${t.font};font-size:${fs}px;line-height:${ih}px;mso-line-height-rule:exactly;font-weight:bold;letter-spacing:1px;text-align:center;">${c.initials}</td>`
    ),
    { w }
  );
}

/**
 * The logo, fitted inside a box. The width attribute is for Outlook for Windows,
 * which ignores CSS sizing on images; everything else uses the CSS box.
 */
export function logo(c: Ctx, w: number, h?: number): string {
  if (!c.logo) return "";
  return `<img src="${attr(c.logo)}" alt="${esc(c.d.company || "Logo")}" width="${w}" style="display:block;width:auto;height:auto;max-width:${w}px;max-height:${h ?? Math.round(w * 0.45)}px;border:0;" />`;
}

// ── Contacts ──────────────────────────────────────────────────────────

export type ContactStyle = "inline" | "lettered" | "colon" | "worded" | "tiles" | "mono" | "plain";

export interface ContactOpts {
  style: ContactStyle;
  /** Include the address. Defaults to true, except for the inline style. */
  address?: boolean;
  valueColor?: string;
  labelColor?: string;
  /** Colour for the address and the default labels, for use on a tinted panel. */
  muted?: string;
  /** Separator for the inline style. Defaults to a middle dot. */
  sep?: string;
  /** Colour of the inline separators. Defaults to the muted colour. */
  sepColor?: string;
  size?: number;
  labelW?: number;
  /** Vertical gap between rows in px. */
  gap?: number;
  align?: Align;
  only?: Array<"email" | "phone" | "web">;
}

export interface ContactItem {
  key: "email" | "phone" | "web" | "address";
  letter: string;
  word: string;
  html: (color: string) => string;
}

/** The contact fields that exist, in order, for designs that lay them out themselves. */
export function contactItems(c: Ctx, withAddress: boolean, only?: ContactOpts["only"]): ContactItem[] {
  const out: ContactItem[] = [];
  const allow = (k: "email" | "phone" | "web") => !only || only.includes(k);
  if (c.email && allow("email")) {
    out.push({
      key: "email",
      letter: "E",
      word: "Email",
      html: (col) => link(`mailto:${encodeURIComponent(c.email)}`, esc(c.email), col),
    });
  }
  if (c.phone && allow("phone")) {
    const tel = telHref(c.phone);
    out.push({
      key: "phone",
      letter: "T",
      word: "Phone",
      html: (col) => (tel ? link(tel, esc(c.phone), col) : `<span style="color:${col};">${esc(c.phone)}</span>`),
    });
  }
  if (c.web && allow("web")) {
    const w = c.web;
    out.push({ key: "web", letter: "W", word: "Web", html: (col) => link(w.href, esc(w.label), col) });
  }
  if (withAddress && c.addr.length) {
    out.push({ key: "address", letter: "A", word: "Office", html: () => c.addr.join("<br>") });
  }
  return out;
}

/** A letter tile: a tinted 20px cell holding E, T, W or A in a mono face. */
function tile(c: Ctx, letter: string, valign: "top" | "middle"): string {
  const t = c.t;
  const fg = ensureContrast(t.accentInk, t.tintStrong, 4.5);
  return `<td width="20" height="20" align="center" valign="${valign}" style="width:20px;height:20px;background-color:${t.tintStrong};color:${fg};font-family:${MONO};font-size:11px;line-height:20px;mso-line-height-rule:exactly;font-weight:bold;text-align:center;border-radius:4px;">${letter}</td>`;
}

/** Contact details in one of the label systems. Returns a block (a table). */
export function contacts(c: Ctx, o: ContactOpts): string {
  const t = c.t;
  const list = contactItems(c, o.address ?? o.style !== "inline", o.only);
  if (!list.length) return "";
  const vc = o.valueColor ?? t.ink;
  const muted = o.muted ?? t.muted;
  const gap = o.gap ?? Math.max(2, t.u - 1);
  const size = o.size;
  const align = o.align;

  if (o.style === "inline") {
    const runs = list.filter((i) => i.key !== "address").map((i) => i.html(vc));
    const address = list.find((i) => i.key === "address");
    const sep = `<span style="color:${o.sepColor ?? muted};">&nbsp;${o.sep ?? "&middot;"}&nbsp;</span>`;
    return tbl(
      (runs.length ? trow(c, "body", join(runs, sep), { color: vc, size, align }) : "") +
        (address ? trow(c, "small", address.html(muted), { color: muted, pt: runs.length ? gap : 0, align }) : ""),
      { align }
    );
  }

  if (o.style === "tiles") {
    // Tiles are direct cells (a nested table per tile would add a lot of markup), with a
    // spacer row between items because Outlook for Windows ignores border-spacing.
    const spacer = `<tr><td colspan="2" height="${gap}" style="height:${gap}px;font-size:0;line-height:0;mso-line-height-rule:exactly;">&nbsp;</td></tr>`;
    return tbl(
      list
        .map((i) => {
          const isAddr = i.key === "address";
          const valign = isAddr ? "top" : "middle";
          return tr(
            tile(c, i.letter, valign),
            td(
              i.html(isAddr ? muted : vc),
              tstyle(c, isAddr ? "small" : "body", { color: isAddr ? muted : vc, size }) + `padding-left:8px;vertical-align:${valign};`
            )
          );
        })
        .join(spacer),
      { align }
    );
  }

  const lw = o.labelW ?? (o.style === "worded" ? 64 : o.style === "mono" ? 70 : o.style === "plain" ? 0 : 22);
  const rows = list.map((i, idx) => {
    const pt = idx ? `padding-top:${gap}px;` : "";
    const isAddr = i.key === "address";
    const value = td(
      i.html(isAddr ? muted : vc),
      tstyle(c, isAddr ? "small" : "body", { color: isAddr ? muted : vc, size }) + pt + "vertical-align:top;"
    );
    if (o.style === "plain") return tr(value);
    const labelColor = o.labelColor;
    let label: string;
    switch (o.style) {
      case "lettered":
        label = tstyle(c, "body", { color: labelColor ?? t.accentInk, bold: true, size });
        return tr(td(i.letter, label + pt + "vertical-align:top;", `width="${lw}"`), value);
      case "colon":
        label = tstyle(c, "body", { color: labelColor ?? muted, bold: true, size });
        return tr(td(`${i.letter}:`, label + pt + "vertical-align:top;", `width="${lw}"`), value);
      case "worded":
        label = tstyle(c, "label", { color: labelColor ?? muted, bold: true, lh: Math.round((size ?? t.size.body) * 1.4) });
        return tr(td(i.word, label + pt + "vertical-align:top;padding-right:10px;", `width="${lw}"`), value);
      default: {
        label = tstyle(c, "body", { color: labelColor ?? muted, size, font: MONO });
        return tr(
          td(`${i.word.toLowerCase()}<span style="color:${t.accentInk};font-weight:bold;"> /</span>`, label + pt + "vertical-align:top;padding-right:8px;", `width="${lw}"`),
          value
        );
      }
    }
  });
  return tbl(rows.join(""), { align });
}

/** A short accent underline for under a name. Empty when the Divider is off. */
export function bar(c: Ctx, w = 32): string {
  const line = edge(c, "top", { w: 3 });
  if (!line) return "";
  return tbl(
    `<tr><td width="${w}" style="width:${w}px;font-size:1px;line-height:1px;mso-line-height-rule:exactly;${line}">&nbsp;</td></tr>`,
    { w }
  );
}

/** The address as lines, for designs that place it on its own. */
export const addressHtml = (c: Ctx, sep = "<br>") => c.addr.join(sep);

// ── Socials ───────────────────────────────────────────────────────────

export type SocialStyle = "text" | "caps" | "chips" | "stack" | "slash";

export interface SocialOpts {
  style: SocialStyle;
  color?: string;
  align?: Align;
  size?: number;
  perRow?: number;
}

/** Social links as text, tracked caps, or outlined chips. Returns an inline run or a block. */
export function socials(c: Ctx, o: SocialOpts): string {
  if (!c.links.length) return "";
  const t = c.t;
  const color = o.color ?? t.accentInk;

  if (o.style === "chips") {
    const per = o.perRow ?? 4;
    const blocks: string[] = [];
    for (let i = 0; i < c.links.length; i += per) {
      const cells = c.links
        .slice(i, i + per)
        .map(
          (l, k) =>
            (k ? `<td width="6" style="width:6px;font-size:0;line-height:0;mso-line-height-rule:exactly;">&nbsp;</td>` : "") +
            td(
              `<a href="${attr(l.href)}" style="color:${color};text-decoration:none;">${l.label}</a>`,
              `border:1px solid ${color};border-radius:99px;padding:3px 11px;` +
                tstyle(c, "small", { color, bold: true, size: o.size, lh: Math.round((o.size ?? t.size.small) * 1.3) }),
              `align="center"`
            )
        )
        .join("");
      blocks.push(row(tbl(tr(cells), { align: o.align }), { pt: i ? 6 : 0, align: o.align }));
    }
    return tbl(blocks.join(""), { align: o.align });
  }

  const runs = c.links.map((l) => `<a href="${attr(l.href)}" style="color:${color};text-decoration:none;">${l.label}</a>`);

  if (o.style === "stack") {
    return tbl(
      c.links
        .map((l, i) => trow(c, "small", `<a href="${attr(l.href)}" style="color:${color};text-decoration:none;">${l.label}</a>`, { color, size: o.size, pt: i ? 2 : 0 }))
        .join(""),
      { align: o.align }
    );
  }

  if (o.style === "slash") {
    const slash = `<span style="color:${t.accentInk};font-weight:bold;">/</span>`;
    return `<span style="${tstyle(c, "small", { color, size: o.size, font: MONO })}">${slash}&nbsp;${join(runs, `&nbsp;${slash}&nbsp;`)}</span>`;
  }

  const caps = o.style === "caps";
  const sep = `<span style="color:${t.muted};">${caps ? "&nbsp;&nbsp;/&nbsp;&nbsp;" : "&nbsp;&nbsp;&middot;&nbsp;&nbsp;"}</span>`;
  const style = caps
    ? tstyle(c, "label", { color, bold: true, size: o.size, track: 1.5 })
    : tstyle(c, "small", { color, size: o.size });
  return `<span style="${style}">${join(runs, sep)}</span>`;
}

// ── Buttons ───────────────────────────────────────────────────────────

export type ButtonStyle = "solid" | "outline" | "link";

export interface ButtonOpts {
  style: ButtonStyle;
  label: string;
  align?: Align;
  size?: number;
  /** More generous padding, for a design where the button is the call to action. */
  wide?: boolean;
}

/** The booking button, built as a table cell so Outlook for Windows pads it. */
export function button(c: Ctx, o: ButtonOpts): string {
  if (!c.cta) return "";
  const t = c.t;
  const href = attr(c.cta);
  const label = esc(o.label);
  const size = o.size ?? t.size.body;
  const lh = Math.round(size * 1.3);
  if (o.style === "link") {
    return `<a href="${href}" style="color:${t.accentInk};font-family:${t.font};font-size:${size}px;font-weight:bold;text-decoration:underline;">${label}</a>`;
  }
  const solid = o.style === "solid";
  const anchor = `<a href="${href}" style="color:${solid ? t.onAccent : t.accentInk};font-family:${t.font};font-size:${size}px;line-height:${lh}px;mso-line-height-rule:exactly;font-weight:bold;text-decoration:none;">${label}</a>`;
  const px = o.wide ? 28 : 18;
  const py = o.wide ? 10 : 8;
  const look = solid
    ? `background-color:${t.accent};padding:${py}px ${px}px;`
    : `border:2px solid ${t.accentInk};padding:${py - 2}px ${px - 2}px;`;
  return tbl(tr(td(anchor, `${look}border-radius:6px;text-align:center;`, `align="center"`)), { align: o.align });
}

// ── Fine print and footer ─────────────────────────────────────────────

/** The disclaimer in small print under a hairline. */
export function finePrint(c: Ctx, o: { align?: Align; rule?: boolean } = {}): string {
  if (!c.fine) return "";
  const ruled = o.rule !== false;
  return tbl(
    row(c.fine, {
      pt: ruled ? c.t.u * 3 : 0,
      align: o.align,
      style: tstyle(c, "fine") + (ruled ? edge(c, "top", { kind: "hair" }) : ""),
    }),
    { full: true }
  );
}

export interface FooterOpts {
  align?: Align;
  /** A style, or false when the design places the socials itself. */
  socials?: false | SocialStyle;
  socialColor?: string;
  button?: false | ButtonStyle;
  label?: string;
  logoW?: number | false;
  /** Draw the disclaimer. Defaults to true. */
  fine?: boolean;
  /** Space above each row in px. */
  gap?: number;
}

/**
 * The rows every design ends with: socials, booking button, logo, disclaimer.
 * A design that places one of them itself passes `false` for it, so each field
 * is drawn exactly once.
 */
export function footerRows(c: Ctx, o: FooterOpts = {}): string {
  const t = c.t;
  const a = o.align ?? "left";
  const g = o.gap ?? t.u * 3;
  let out = "";
  if (o.socials !== false && c.links.length) {
    out += row(socials(c, { style: o.socials ?? "text", align: a, color: o.socialColor }), { pt: g, align: a });
  }
  if (o.button !== false && c.cta) {
    out += row(button(c, { style: o.button ?? "link", label: o.label ?? "Book a meeting", align: a }), { pt: g, align: a });
  }
  if (o.logoW !== false && c.logo) {
    out += row(aligned(logo(c, o.logoW ?? 110), a), { pt: g, align: a });
  }
  if (o.fine !== false && c.fine) out += row(finePrint(c, { align: a }), { pt: g });
  return out;
}

/** The outer table of a design: a fixed width, with the base type for inheriting clients. */
export function root(c: Ctx, w: number, rows: string, extra = ""): string {
  const t = c.t;
  return tbl(rows, {
    w,
    style: `font-family:${t.font};font-size:${t.base}px;line-height:${Math.round(t.base * 1.4)}px;mso-line-height-rule:exactly;color:${t.ink};max-width:100%;${extra}`,
  });
}

export type Renderer = (c: Ctx) => string;
