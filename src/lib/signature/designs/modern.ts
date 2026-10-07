import type { TemplateId } from "@/lib/templates";
import {
  centered,
  contacts,
  dot,
  edge,
  footerRows,
  join,
  logo,
  mark,
  root,
  row,
  socials,
  tbl,
  td,
  tr,
  trow,
  type Align,
  type Renderer,
} from "../kit";

/** A tall accent rail with a role tag and two tiers of detail. */
const rail: Renderer = (c) => {
  const t = c.t;
  const photo = mark(c, { size: 48, monogram: false });
  const ident =
    trow(c, "label", c.title, { color: t.accentInk, bold: true, track: 1.5 }) +
    trow(c, "name", c.name, { pt: 2 }) +
    trow(c, "body", join([c.company, c.dept], dot(c)), { pt: 2 }) +
    row(contacts(c, { style: "colon", size: t.size.small, valueColor: t.body }), { pt: t.u * 3 });
  const main = tbl(
    tr(
      td("&nbsp;", `width:4px;background-color:${t.rule};font-size:0;line-height:0;mso-line-height-rule:exactly;`, `width="4"`),
      td(tbl(ident), "padding-left:14px;vertical-align:top;"),
      photo ? td(photo, "padding-left:16px;vertical-align:top;") : ""
    )
  );
  return root(c, 460, row(main) + footerRows(c, { socials: "caps", button: "link" }));
};

/** Monospace labels with accent slashes and a thin left border. */
const terminal: Renderer = (c) => {
  const t = c.t;
  const photo = mark(c, { size: 44, monogram: false, shape: c.d.photoShape === "circle" ? "rounded" : c.d.photoShape });
  const bar = edge(c, "left");
  const at = `<span style="color:${t.accentInk};font-weight:bold;">@</span>`;
  const ident =
    (photo ? row(photo, { pb: t.u * 2 }) : "") +
    trow(c, "name", c.name) +
    trow(c, "body", `${c.title} ${at} ${c.company}${c.dept ? ` / ${c.dept}` : ""}`, { pt: 2 }) +
    row(contacts(c, { style: "mono", size: t.size.small }), { pt: t.u * 3 }) +
    (c.links.length ? row(socials(c, { style: "slash" }), { pt: t.u * 3 }) : "");
  const main = tbl(tr(td(tbl(ident), `vertical-align:top;${bar}padding-left:${bar ? 14 : 0}px;`)));
  return root(c, 460, row(main) + footerRows(c, { socials: false, button: "link", label: "Schedule a call" }));
};

/** An accent panel with a large mark beside the details. */
const splitPanel: Renderer = (c) => {
  const t = c.t;
  const m = mark(c, { size: 64, fill: "ring", inverse: true });
  const lg = logo(c, 88, 40);
  const tile = lg ? tbl(tr(td(lg, "background-color:#ffffff;border-radius:6px;padding:8px;")), { align: "center" }) : "";
  const panelBody = (m ? row(centered(m), { align: "center" }) : "") + (tile ? row(tile, { pt: m ? t.u * 3 : 0, align: "center" }) : "");
  const panel = panelBody
    ? td(tbl(panelBody), `background-color:${t.accent};border-radius:10px 0 0 10px;padding:20px 18px;vertical-align:middle;`, `width="${lg ? 104 : 64}"`)
    : td("&nbsp;", `width:8px;background-color:${t.accent};font-size:0;line-height:0;mso-line-height-rule:exactly;`, `width="8"`);
  const ident =
    trow(c, "name", c.name) +
    trow(c, "lead", c.title, { color: t.accentInk, pt: 2 }) +
    trow(c, "body", join([c.company, c.dept], dot(c)), { pt: 2, pb: t.u * 3 }) +
    row(contacts(c, { style: "lettered" }), { pt: t.u * 3, style: edge(c, "top", { w: 1 }) });
  const main = tbl(tr(panel, td(tbl(ident), "vertical-align:middle;padding-left:20px;")));
  return root(c, 460, row(main) + footerRows(c, { socials: "caps", button: "solid", logoW: false }));
};

/** Right-aligned details with the mark on the right edge. */
const mirror: Renderer = (c) => {
  const t = c.t;
  const a: Align = "right";
  const m = mark(c, { size: 56 });
  const text =
    trow(c, "name", c.name, { align: a }) +
    trow(c, "lead", c.title, { color: t.accentInk, align: a, pt: 2 }) +
    trow(c, "body", join([c.company, c.dept], dot(c)), { align: a, pt: 2 });
  const head = tbl(
    tr(
      td(tbl(text, { align: a }), "vertical-align:middle;", `align="right" width="100%"`),
      m ? td(m, "vertical-align:middle;padding-left:14px;") : ""
    ),
    { full: true }
  );
  const body =
    row(head, { pb: t.u * 3 }) +
    row(contacts(c, { style: "plain", align: a }), { pt: t.u * 3, align: a, style: edge(c, "top") });
  return root(c, 420, body + footerRows(c, { align: a, socials: "text", button: "outline" }));
};

export const modernDesigns = {
  rail,
  terminal,
  "split-panel": splitPanel,
  mirror,
} satisfies Partial<Record<TemplateId, Renderer>>;
