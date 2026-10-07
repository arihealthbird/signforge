import type { TemplateId } from "@/lib/templates";
import {
  centered,
  contacts,
  dot,
  edge,
  footerRows,
  join,
  mark,
  roleDept,
  root,
  row,
  socials,
  tbl,
  td,
  tr,
  trow,
  tstyle,
  type Align,
  type Ctx,
  type Renderer,
} from "../kit";

/** Two thin lines a few pixels apart, centred. Empty when the Divider is off. */
function doubleRule(c: Ctx, w: number): string {
  const line = edge(c, "top", { w: 1 });
  if (!line) return "";
  const cell = (h: number) =>
    `<td width="${w}" height="${h}" style="width:${w}px;height:${h}px;font-size:0;line-height:0;mso-line-height-rule:exactly;${line}">&nbsp;</td>`;
  return tbl(`<tr>${cell(3)}</tr><tr>${cell(1)}</tr>`, { w, align: "center" });
}

/** Centered letterhead with a ringed monogram and a double hairline. */
const executiveElegant: Renderer = (c) => {
  const t = c.t;
  const a: Align = "center";
  const m = mark(c, { size: 72, fill: "ring" });
  const dbl = doubleRule(c, 56);
  const body =
    (m ? row(centered(m), { align: a }) : "") +
    trow(c, "name", c.name, { size: Math.round(t.base * 1.35), caps: true, track: 2, align: a, pt: m ? t.u * 3 : 0 }) +
    trow(c, "lead", c.title, { italic: true, color: t.accentInk, align: a, pt: 2 }) +
    (dbl ? row(dbl, { pt: t.u * 3, align: a }) : "") +
    trow(c, "label", join([c.company, c.dept], dot(c)), { color: t.ink, bold: true, track: 2, align: a, pt: t.u * 3 }) +
    row(contacts(c, { style: "inline", align: a, address: true }), { pt: t.u * 3, align: a });
  return root(c, 440, body + footerRows(c, { align: a, socials: "caps", button: "outline" }));
};

/** Company on a top rule, a large name, two quiet columns and fine print. */
const chambers: Renderer = (c) => {
  const t = c.t;
  const photo = mark(c, { size: 52, monogram: false, shape: c.d.photoShape === "circle" ? "rounded" : c.d.photoShape });
  const cell = `vertical-align:top;${edge(c, "top", { w: 2 })}padding-top:${t.u * 3}px;`;
  const nameBlock =
    trow(c, "name", c.name, { size: Math.round(t.base * 1.65) }) +
    trow(c, "lead", roleDept(c), { italic: true, color: t.accentInk, pt: 2 });
  // Fixed column widths that add up to the table: a `width:100%` cell beside a text cell
  // would squeeze the company label down to its longest word.
  const nameW = 480 - 216 - (photo ? 52 + 14 : 0);
  const head = tbl(
    tr(
      photo ? td(photo, `${cell}padding-right:14px;`, `width="52"`) : "",
      td(tbl(nameBlock), cell, `width="${nameW}"`),
      td(c.company, `${cell}padding-left:16px;text-align:right;` + tstyle(c, "label", { color: t.accentInk, bold: true, track: 2 }), `align="right" width="200"`)
    ),
    { w: 480 }
  );
  const reach = contacts(c, { style: "plain", address: false });
  const addr = c.addr.length ? trow(c, "small", c.addr.join("<br>")) : "";
  const links = c.links.length ? row(socials(c, { style: "text" }), { pt: addr ? t.u * 2 : 0 }) : "";
  const side = addr || links ? tbl(addr + links) : "";
  const cols =
    reach || side
      ? tbl(
          tr(
            reach ? td(reach, "vertical-align:top;", `width="240"`) : "",
            side ? td(side, "vertical-align:top;padding-left:20px;") : ""
          )
        )
      : "";
  return root(
    c,
    480,
    row(head, { pb: t.u * 3 }) +
      (cols ? row(cols, { pt: t.u * 3, style: edge(c, "top", { kind: "hair" }) }) : "") +
      footerRows(c, { socials: false, button: "outline" })
  );
};

/** Airy and quiet, with a fine vertical line in the accent color. */
const atelier: Renderer = (c) => {
  const t = c.t;
  const photo = mark(c, { size: 64, monogram: false });
  const left =
    trow(c, "label", c.name, { size: Math.round(t.base * 0.95), color: t.ink, bold: true, track: 2.5, lh: Math.round(t.base * 1.4) }) +
    trow(c, "lead", c.title, { italic: true, pt: 3 }) +
    trow(c, "label", join([c.company, c.dept], dot(c)), { pt: t.u * 2, track: 1.5 });
  const right = contacts(c, { style: "plain", size: t.size.small, valueColor: t.body });
  const rule = edge(c, "left", { w: 1 });
  const main = tbl(
    tr(
      photo ? td(photo, "vertical-align:top;padding-right:20px;") : "",
      td(tbl(left), `vertical-align:top;padding-right:${right && rule ? 24 : 0}px;`),
      right ? td(right, `vertical-align:top;${rule}padding-left:${rule ? 24 : 0}px;`) : ""
    )
  );
  return root(c, 460, row(main) + footerRows(c, { socials: "caps", button: "link" }));
};

/** A large ringed monogram beside a vertical hairline. */
const seal: Renderer = (c) => {
  const t = c.t;
  const m = mark(c, { size: 84, fill: "ring" });
  const ident =
    trow(c, "name", c.name, { size: Math.round(t.base * 1.35), caps: true, track: 1.5 }) +
    trow(c, "lead", c.title, { italic: true, color: t.accentInk, pt: 2 }) +
    trow(c, "body", join([c.company, c.dept], dot(c)), { pt: 2 }) +
    row(contacts(c, { style: "worded" }), { pt: t.u * 3 });
  const main = tbl(
    tr(
      m ? td(m, "vertical-align:top;padding-right:20px;") : "",
      td(tbl(ident), `vertical-align:top;${edge(c, "left", { w: 1 })}padding-left:${m ? 20 : 14}px;`)
    )
  );
  return root(c, 460, row(main) + footerRows(c, { socials: "caps", button: "outline" }));
};

export const elegantDesigns = {
  "executive-elegant": executiveElegant,
  chambers,
  atelier,
  seal,
} satisfies Partial<Record<TemplateId, Renderer>>;
