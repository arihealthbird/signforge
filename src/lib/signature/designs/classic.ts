import type { TemplateId } from "@/lib/templates";
import {
  contacts,
  dot,
  edge,
  ensureContrast,
  footerRows,
  join,
  logo,
  mark,
  roleDept,
  root,
  row,
  tbl,
  td,
  tr,
  trow,
  type Renderer,
} from "../kit";

/** Monogram or photo, an accent rule and tidy lettered contact lines. */
const professionalClassic: Renderer = (c) => {
  const t = c.t;
  const m = mark(c, { size: 76 });
  const rule = edge(c, "left");
  const ident =
    trow(c, "name", c.name, { color: t.accentInk }) +
    trow(c, "lead", roleDept(c), { pt: 2 }) +
    trow(c, "body", c.company, { pt: 2, bold: true, color: t.ink }) +
    row(contacts(c, { style: "lettered" }), { pt: t.u * 3 });
  const main = tbl(
    tr(
      m ? td(m, "vertical-align:top;padding-right:16px;") : "",
      td(tbl(ident), `vertical-align:top;${rule}padding-left:${m || rule ? 16 : 0}px;`)
    )
  );
  return root(c, 460, row(main) + footerRows(c, { socials: "text", button: "link" }));
};

/** Identity on the left, labelled contact rows on the right. */
const twoColumn: Renderer = (c) => {
  const t = c.t;
  const m = mark(c, { size: 56, shape: c.d.photoShape === "circle" ? "rounded" : c.d.photoShape });
  const left =
    (m ? row(m, { pb: t.u * 3 }) : "") +
    trow(c, "name", c.name) +
    trow(c, "lead", c.title, { color: t.accentInk, pt: 2 }) +
    trow(c, "body", c.company, { pt: 2 }) +
    (c.dept ? trow(c, "small", c.dept, { pt: 2 }) : "");
  const right = contacts(c, { style: "worded" });
  const main = tbl(
    tr(
      td(tbl(left), "vertical-align:top;padding-right:22px;", `width="196"`),
      right ? td(right, `vertical-align:top;padding-left:22px;${edge(c, "left", { w: 1 })}`) : ""
    )
  );
  return root(c, 480, row(main) + footerRows(c, { socials: "caps", button: "solid" }));
};

/** Logo-led layout with a bold name and a labelled contact table. */
const corporateBold: Renderer = (c) => {
  const t = c.t;
  const lg = logo(c, 120, 56);
  const shape = c.d.photoShape === "circle" ? "square" : c.d.photoShape;
  // A logo leads when there is one, with the photo beneath it. With no logo the
  // photo or monogram leads.
  const m = lg ? (c.photo ? mark(c, { size: 48, shape }) : "") : mark(c, { size: 64, shape });
  const lead = (lg ? row(lg) : "") + (m ? row(m, { pt: lg ? t.u * 3 : 0 }) : "");
  const rule = edge(c, "left");
  const ident =
    trow(c, "name", c.name, { size: Math.round(t.base * 1.55) }) +
    trow(c, "label", c.title, { color: t.accentInk, bold: true, track: 1.5, pt: 3 }) +
    trow(c, "body", join([c.company, c.dept], dot(c)), { pt: 3 }) +
    row(contacts(c, { style: "colon" }), { pt: t.u * 3 });
  const main = tbl(
    tr(
      lead ? td(tbl(lead), "vertical-align:middle;padding-right:18px;") : "",
      td(tbl(ident), `vertical-align:middle;${lead ? rule : ""}padding-left:${lead && rule ? 18 : 0}px;`)
    )
  );
  return root(c, 460, row(main) + footerRows(c, { socials: "caps", button: "solid", logoW: false }));
};

/** Calm tinted panel with credentials, full address and a confidentiality footer. */
const careTeam: Renderer = (c) => {
  const t = c.t;
  const m = mark(c, { size: 64 });
  const accentT = ensureContrast(t.accentInk, t.tint, 4.5);
  const mutedT = ensureContrast(t.muted, t.tint, 4.5);
  const ident =
    trow(c, "name", c.name) +
    trow(c, "lead", c.title, { color: accentT, bold: true, pt: 2 }) +
    trow(c, "body", join([c.dept, c.company], dot(c)), { pt: 2 });
  const head = tbl(
    tr(
      m ? td(m, "vertical-align:middle;padding-right:16px;") : "",
      td(tbl(ident), "vertical-align:middle;")
    )
  );
  const panel = td(
    tbl(
      row(head, { pb: t.u * 3 }) +
        row(contacts(c, { style: "worded", muted: mutedT }), {
          pt: t.u * 3,
          style: edge(c, "top", { w: 1 }),
        }),
      { full: true }
    ),
    `background-color:${t.tint};border-radius:10px;padding:16px 18px;`
  );
  return root(c, 460, `<tr>${panel}</tr>` + footerRows(c, { socials: "text", button: "solid" }));
};

export const classicDesigns = {
  "professional-classic": professionalClassic,
  "two-column": twoColumn,
  "corporate-bold": corporateBold,
  "care-team": careTeam,
} satisfies Partial<Record<TemplateId, Renderer>>;
