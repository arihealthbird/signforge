import type { TemplateId } from "@/lib/templates";
import {
  button,
  contactItems,
  contacts,
  dot,
  edge,
  ensureContrast,
  footerRows,
  join,
  logo,
  mark,
  mix,
  root,
  row,
  socials,
  tbl,
  td,
  tr,
  trow,
  tstyle,
  type Ctx,
  type Renderer,
} from "../kit";

/** A solid accent band carries your name and role. */
const namePlate: Renderer = (c) => {
  const t = c.t;
  const m = mark(c, { size: 48, fill: "ring", inverse: true });
  const band = td(
    tbl(
      tr(
        td(
          tbl(
            trow(c, "name", c.name, { color: t.onAccent }) +
              trow(c, "label", c.title, { color: t.onAccent, bold: true, track: 1.5, pt: 3 })
          ),
          "vertical-align:middle;",
          `width="100%"`
        ),
        m ? td(m, "vertical-align:middle;padding-left:16px;") : ""
      ),
      { full: true }
    ),
    `background-color:${t.accent};${edge(c, "bottom", { w: 3 })}border-radius:8px 8px 0 0;padding:16px 20px;`
  );
  const left =
    trow(c, "body", c.company, { bold: true, color: t.ink }) +
    (c.dept ? trow(c, "small", c.dept, { pt: 1 }) : "") +
    (c.addr.length ? trow(c, "small", c.addr.join("<br>"), { pt: t.u * 2 }) : "");
  const right = contacts(c, { style: "lettered", address: false });
  const body = tbl(
    tr(td(tbl(left), "vertical-align:top;padding-right:16px;", `width="190"`), right ? td(right, "vertical-align:top;") : "")
  );
  return root(c, 460, `<tr>${band}</tr>` + row(body, { pt: t.u * 4 }) + footerRows(c, { socials: "text", button: "solid" }));
};

/** A soft bordered card with the logo at the top right. */
const modernCard: Renderer = (c) => {
  const t = c.t;
  const m = mark(c, { size: 60, shape: c.d.photoShape === "circle" ? "rounded" : c.d.photoShape });
  const lg = logo(c, 96, 36);
  const ident =
    trow(c, "name", c.name) +
    trow(c, "lead", c.title, { color: t.accentInk, pt: 2 }) +
    trow(c, "body", join([c.company, c.dept], dot(c)), { pt: 2 });
  const head = tbl(
    tr(
      m ? td(m, "vertical-align:top;padding-right:14px;", `width="74"`) : "",
      td(tbl(ident), "vertical-align:top;", `width="100%"`),
      lg ? td(lg, "vertical-align:top;padding-left:14px;", `align="right"`) : ""
    ),
    { full: true }
  );
  const inner =
    row(head, { pb: t.u * 3 }) +
    row(contacts(c, { style: "inline", address: true }), { pt: t.u * 3, style: edge(c, "top", { kind: "hair" }) }) +
    (c.links.length ? row(socials(c, { style: "text" }), { pt: t.u * 2 }) : "") +
    (c.cta ? row(button(c, { style: "solid", label: "Book a meeting" }), { pt: t.u * 3 }) : "");
  const card = td(
    tbl(inner, { full: true }),
    `background-color:${t.panel};border:1px solid ${t.hair};${edge(c, "top", { w: 3 })}border-radius:12px;padding:20px;`
  );
  return root(c, 460, `<tr>${card}</tr>` + footerRows(c, { socials: false, button: false, logoW: false }));
};

/** A tinted panel with a left accent bar and a booking button. */
const tintPanel: Renderer = (c) => {
  const t = c.t;
  const m = mark(c, { size: 56, shape: c.d.photoShape === "circle" ? "rounded" : c.d.photoShape });
  const accentT = ensureContrast(t.accentInk, t.tint, 4.5);
  const mutedT = ensureContrast(t.muted, t.tint, 4.5);
  const ident =
    trow(c, "name", c.name) +
    trow(c, "lead", c.title, { color: accentT, bold: true, pt: 2 }) +
    trow(c, "body", join([c.company, c.dept], dot(c)), { pt: 2 }) +
    row(contacts(c, { style: "tiles", muted: mutedT, gap: 6 }), { pt: t.u * 3 }) +
    (c.cta ? row(button(c, { style: "solid", label: "Book a meeting" }), { pt: t.u * 3 }) : "");
  const inner = tbl(
    tr(m ? td(m, "vertical-align:top;padding-right:16px;") : "", td(tbl(ident), "vertical-align:top;"))
  );
  const panel = td(
    inner,
    `background-color:${t.tint};${edge(c, "left", { w: 4 })}border-radius:8px;padding:16px 20px;`
  );
  return root(c, 460, `<tr>${panel}</tr>` + footerRows(c, { socials: "text", button: false }));
};

/** Two columns of label-over-value contact details. */
function contactGrid(c: Ctx): string {
  const t = c.t;
  const items = contactItems(c, true);
  if (!items.length) return "";
  const label = `font-size:${t.size.label}px;text-transform:uppercase;letter-spacing:1px;font-weight:bold;color:${t.muted};`;
  const rows: string[] = [];
  for (let i = 0; i < items.length; i += 2) {
    const pair = items.slice(i, i + 2);
    rows.push(
      tr(
        ...[0, 1].map((k) => {
          const item = pair[k];
          const pad = (i ? `padding-top:${t.u * 3}px;` : "") + (k ? "padding-left:12px;" : "");
          if (!item) return td("&nbsp;", pad, `width="50%"`);
          const value = item.html(item.key === "address" ? t.muted : t.ink);
          return td(
            `<span style="${label}">${item.word}</span><br>${value}`,
            tstyle(c, "body", { color: item.key === "address" ? t.muted : t.ink }) + pad + "vertical-align:top;",
            `width="50%"`
          );
        })
      )
    );
  }
  return tbl(rows.join(""), { full: true });
}

/** A three-color top bar over a name row and contact columns. */
const stripe: Renderer = (c) => {
  const t = c.t;
  const second = c.d.secondaryColor ? t.rule : mix(t.accent, t.bg, 0.45);
  const seg = (bg: string, w: string) =>
    `<td width="${w}" height="5" style="width:${w};height:5px;background-color:${bg};font-size:0;line-height:0;mso-line-height-rule:exactly;">&nbsp;</td>`;
  const bar = tbl(tr(seg(t.accent, "60%"), seg(second, "28%"), seg(t.tintStrong, "12%")), { full: true });
  const photo = mark(c, { size: 44 });
  const head = tbl(
    tr(
      td(
        tbl(trow(c, "name", c.name) + trow(c, "body", join([c.title, c.company, c.dept], dot(c)), { pt: 2 })),
        "vertical-align:middle;",
        `width="100%"`
      ),
      photo ? td(photo, "vertical-align:middle;padding-left:14px;") : ""
    ),
    { full: true }
  );
  const grid = contactGrid(c);
  return root(
    c,
    460,
    row(bar) +
      row(head, { pt: t.u * 4, pb: grid ? t.u * 3 : 0 }) +
      (grid ? row(grid, { pt: t.u * 3, style: edge(c, "top", { kind: "hair" }) }) : "") +
      footerRows(c, { socials: "text", button: "outline" })
  );
};

export const boldDesigns = {
  "name-plate": namePlate,
  "modern-card": modernCard,
  "tint-panel": tintPanel,
  stripe,
} satisfies Partial<Record<TemplateId, Renderer>>;
