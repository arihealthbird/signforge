import type { TemplateId } from "@/lib/templates";
import {
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
  tstyle,
  type Renderer,
} from "../kit";

/** Name and role on one line, a fine rule and one dot-separated contact line. */
const minimalModern: Renderer = (c) => {
  const t = c.t;
  const photo = mark(c, { size: 36, monogram: false });
  const nameSize = Math.round(t.base * 1.25);
  const head =
    `<span style="font-weight:bold;color:${t.ink};font-size:${nameSize}px;">${c.name}</span>` +
    `<span style="color:${t.muted};">&nbsp;&nbsp;|&nbsp;&nbsp;</span>` +
    `<span style="color:${t.body};">${c.title}</span>`;
  const lines =
    trow(c, "lead", head, { lh: Math.round(nameSize * 1.3) }) +
    trow(c, "body", join([c.company, c.dept], dot(c)), { pt: 2, color: t.accentInk });
  const top = photo
    ? tbl(tr(td(photo, "vertical-align:middle;padding-right:12px;"), td(tbl(lines), "vertical-align:middle;")))
    : tbl(lines);
  const body =
    row(top, { pb: t.u * 3 }) +
    row(contacts(c, { style: "inline", address: true }), { pt: t.u * 3, style: edge(c, "top", { w: 1 }) });
  return root(c, 460, body + footerRows(c, { socials: "text", button: "link" }));
};

/** A full-width hairline over three quiet columns. */
const hairline: Renderer = (c) => {
  const t = c.t;
  const photo = mark(c, { size: 44, monogram: false });
  const lg = logo(c, 90, 34);
  const head = tbl(
    tr(
      td(c.name, tstyle(c, "name") + "vertical-align:middle;", `width="100%"`),
      photo ? td(photo, "vertical-align:middle;padding-left:12px;") : "",
      lg ? td(lg, "vertical-align:middle;padding-left:12px;") : ""
    ),
    { full: true }
  );
  const identity =
    trow(c, "body", c.title, { color: t.ink }) +
    trow(c, "small", c.company, { pt: 2 }) +
    (c.dept ? trow(c, "small", c.dept, { pt: 1 }) : "");
  const cols = [identity ? tbl(identity) : "", contacts(c, { style: "plain", size: t.size.small }), socials(c, { style: "stack" })].filter(Boolean);
  const widths = cols.length === 3 ? [170, 170, 120] : cols.length === 2 ? [210, 250] : [460];
  const body = tbl(
    tr(
      ...cols.map((html, i) =>
        td(html, `vertical-align:top;${i ? "padding-left:18px;" : ""}`, `width="${widths[i] - (i ? 18 : 0)}"`)
      )
    )
  );
  return root(
    c,
    460,
    row(head, { pb: t.u * 3 }) +
      row(body, { pt: t.u * 3, style: edge(c, "top", { w: 1 }) }) +
      footerRows(c, { socials: false, button: "link", logoW: false })
  );
};

/** Reads like typed text, with color only on links. */
const plainText: Renderer = (c) => {
  const t = c.t;
  const photo = mark(c, { size: 44, monogram: false });
  const lines =
    trow(c, "lead", c.name, { bold: true, color: t.ink }) +
    trow(c, "lead", join([join([c.title, c.company], ", "), c.dept], dot(c)), { color: t.body }) +
    row(
      contacts(c, { style: "inline", sep: "|", sepColor: t.rule, valueColor: t.accentInk, size: t.size.lead, address: true }),
      { pt: t.u }
    );
  const top = photo
    ? tbl(tr(td(photo, "vertical-align:top;padding-right:12px;"), td(tbl(lines), "vertical-align:top;")))
    : tbl(lines);
  return root(c, 440, row(top) + footerRows(c, { socials: "text", button: "link" }));
};

/** One tidy row with a small mark and stacked contacts. */
const compactHorizontal: Renderer = (c) => {
  const t = c.t;
  const m = mark(c, { size: 44 });
  const ident =
    trow(c, "lead", c.name, { bold: true, color: t.ink, size: Math.round(t.base * 1.15) }) +
    trow(c, "small", join([c.title, c.company], dot(c)), { color: t.body, pt: 1 }) +
    (c.dept ? trow(c, "small", c.dept, { pt: 1 }) : "");
  const reach = contacts(c, { style: "plain", size: t.size.small });
  const main = tbl(
    tr(
      m ? td(m, "vertical-align:middle;padding-right:12px;") : "",
      td(tbl(ident), "vertical-align:middle;padding-right:16px;"),
      reach ? td(reach, `vertical-align:middle;padding-left:16px;${edge(c, "left", { w: 1 })}`) : ""
    )
  );
  return root(c, 460, row(main) + footerRows(c, { socials: "text", button: "link" }));
};

export const minimalDesigns = {
  "minimal-modern": minimalModern,
  hairline,
  "plain-text": plainText,
  "compact-horizontal": compactHorizontal,
} satisfies Partial<Record<TemplateId, Renderer>>;
