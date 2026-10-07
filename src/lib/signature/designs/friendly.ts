import type { TemplateId } from "@/lib/templates";
import {
  bar,
  button,
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
  tstyle,
  type Renderer,
} from "../kit";

/** A role chip beside the company, tiled contacts and a booking button. */
const startupFresh: Renderer = (c) => {
  const t = c.t;
  const m = mark(c, { size: 40, shape: c.d.photoShape === "circle" ? "rounded" : c.d.photoShape });
  const chipBg = t.tintStrong;
  const chipFg = ensureContrast(t.accentInk, chipBg, 4.5);
  const lh = Math.round(t.size.small * 1.3);
  const head = tbl(
    tr(
      m ? td(m, "vertical-align:middle;padding-right:12px;") : "",
      td(c.name, tstyle(c, "name") + "vertical-align:middle;")
    )
  );
  const company = c.dept ? `${c.company} &middot; ${c.dept}` : c.company;
  const chip = tbl(
    tr(
      td(c.title, `background-color:${chipBg};border-radius:4px;padding:3px 9px;` + tstyle(c, "small", { color: chipFg, bold: true, lh })),
      td(`at ${company}`, "padding:3px 0 3px 8px;" + tstyle(c, "small", { color: t.body, lh }))
    )
  );
  const body =
    row(head) +
    row(bar(c), { pt: t.u * 2 }) +
    row(chip, { pt: t.u * 2 }) +
    row(contacts(c, { style: "tiles", gap: 6 }), { pt: t.u * 3 });
  return root(c, 460, body + footerRows(c, { socials: "text", button: "solid", label: "Schedule a call" }));
};

/** A tall portrait mark with a large name. */
const portrait: Renderer = (c) => {
  const t = c.t;
  const m = mark(c, {
    size: 88,
    h: 112,
    fill: "tint",
    shape: c.d.photoShape === "circle" ? "rounded" : c.d.photoShape,
  });
  const ident =
    trow(c, "name", c.name, { size: Math.round(t.base * 1.75) }) +
    row(bar(c), { pt: t.u * 2 }) +
    trow(c, "lead", c.title, { color: t.accentInk, bold: true, pt: 3 }) +
    trow(c, "body", join([c.company, c.dept], dot(c)), { pt: 2 }) +
    row(contacts(c, { style: "plain" }), { pt: t.u * 3 });
  const main = tbl(
    tr(m ? td(m, "vertical-align:top;padding-right:20px;") : "", td(tbl(ident), "vertical-align:top;"))
  );
  return root(c, 460, row(main) + footerRows(c, { socials: "text", button: "link" }));
};

/** An oversized name with outlined chips and an outline button. */
const creator: Renderer = (c) => {
  const t = c.t;
  const m = mark(c, { size: 48 });
  const big = Math.round(t.base * 1.9);
  const lh = Math.round(t.size.small * 1.3);
  const head = tbl(
    tr(
      m ? td(m, "vertical-align:middle;padding-right:14px;") : "",
      td(c.name, tstyle(c, "name", { size: big, lh: Math.round(big * 1.1) }) + "vertical-align:middle;")
    )
  );
  const chip = tbl(
    tr(
      td(
        c.title,
        `border:1px solid ${t.accentInk};border-radius:99px;padding:3px 11px;` +
          tstyle(c, "small", { color: t.accentInk, bold: true, lh })
      ),
      td(join([c.company, c.dept], dot(c)), "padding:4px 0 4px 10px;" + tstyle(c, "small", { color: t.body, lh }))
    )
  );
  const body =
    row(head) +
    row(bar(c), { pt: t.u * 2 }) +
    row(chip, { pt: t.u * 2 }) +
    row(contacts(c, { style: "inline", address: true }), { pt: t.u * 3 });
  return root(c, 460, body + footerRows(c, { socials: "chips", button: "outline" }));
};

/** Logo on top with a prominent booking button and the address. */
const storefront: Renderer = (c) => {
  const t = c.t;
  const lg = logo(c, 140, 48);
  const m = mark(c, { size: 44 });
  const brand = lg
    ? row(lg, { pb: t.u * 3 })
    : trow(c, "label", c.company, { size: Math.round(t.base * 1.05), color: t.accentInk, bold: true, track: 3, pb: t.u * 3 });
  // With no logo the company is the brand line above; with one, it still appears in text.
  const who = tbl(
    tr(
      m ? td(m, "vertical-align:middle;padding-right:12px;") : "",
      td(
        tbl(
          trow(c, "name", c.name, { size: Math.round(t.base * 1.3) }) +
            trow(c, "body", roleDept(c), { pt: 1 }) +
            (lg ? trow(c, "small", c.company, { pt: 1 }) : "")
        ),
        "vertical-align:middle;"
      )
    )
  );
  const body =
    brand +
    row(who, { pt: t.u * 3, style: edge(c, "top") }) +
    row(contacts(c, { style: "inline", address: true }), { pt: t.u * 3 }) +
    (c.cta ? row(button(c, { style: "solid", label: "Book a visit", wide: true }), { pt: t.u * 4 }) : "");
  return root(c, 460, body + footerRows(c, { socials: "caps", button: false, logoW: false }));
};

export const friendlyDesigns = {
  "startup-fresh": startupFresh,
  portrait,
  creator,
  storefront,
} satisfies Partial<Record<TemplateId, Renderer>>;
