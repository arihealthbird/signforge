import { describe, it, expect } from "vitest";
import { generateSignatureHTML, htmlToPlainText, wrapHtmlDocument } from "./signature-html";
import { DEFAULT_SIGNATURE_DATA, SignatureData } from "@/types/signature";
import { SIGNATURE_TEMPLATES, TemplateId } from "./templates";
import { DESIGNS } from "./signature";
import { contrast, luminance } from "./signature/kit";

const base: SignatureData = {
  ...DEFAULT_SIGNATURE_DATA,
  fullName: "Alex Chen",
  jobTitle: "Product Designer",
  company: "Acme",
  email: "alex@acme.com",
  phone: "+1 555 0100",
  website: "acme.com",
  primaryColor: "#4f46e5",
  socialLinks: [
    { platform: "linkedin", url: "https://linkedin.com/in/alexchen" },
    { platform: "github", url: "https://github.com/alexchen" },
  ],
};

const ids = SIGNATURE_TEMPLATES.map((t) => t.id as TemplateId);

describe("generateSignatureHTML", () => {
  it("has exactly one hand-built renderer for every template", () => {
    expect(Object.keys(DESIGNS).sort()).toEqual([...ids].sort());
  });

  it("renders every registered template as email-safe tables", () => {
    for (const id of ids) {
      const html = generateSignatureHTML(base, id);
      expect(html).toContain("<table");
      expect(html.toLowerCase()).toContain("alex chen");
      expect(html).not.toContain("class=");
      expect(html).not.toContain("<svg");
    }
  });

  it("escapes user-provided text", () => {
    const html = generateSignatureHTML(
      { ...base, fullName: `<script>alert(1)</script>` },
      "minimal-modern"
    );
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("escapes text exactly once (no double encoding)", () => {
    for (const id of ids) {
      const html = generateSignatureHTML({ ...base, company: "Johnson & Johnson" }, id);
      expect(html, id).toContain("Johnson &amp; Johnson");
      expect(html, id).not.toContain("&amp;amp;");
    }
  });

  it("strips var(--font-*) tokens for email-safe export by default", () => {
    const html = generateSignatureHTML(base, "professional-classic");
    expect(html).not.toContain("var(--font");
  });

  it("keeps var(--font-*) tokens when preserveFontVars is set (preview)", () => {
    const html = generateSignatureHTML(base, "professional-classic", {
      preserveFontVars: true,
    });
    expect(html).toContain("var(--font-inter)");
  });

  it("drops social links with dangerous URLs", () => {
    const html = generateSignatureHTML(
      {
        ...base,
        socialLinks: [{ platform: "linkedin", url: "javascript:alert(1)" }],
      },
      "startup-fresh"
    );
    expect(html).not.toContain("javascript:");
  });

  it("falls back to the default design for an unknown id, and maps retired ids to their successor", () => {
    const fallback = generateSignatureHTML(base, "does-not-exist" as TemplateId);
    expect(fallback).toBe(generateSignatureHTML(base, "professional-classic"));
    expect(generateSignatureHTML(base, "creative-gradient" as TemplateId)).toBe(
      generateSignatureHTML(base, "tint-panel")
    );
  });
});

describe("injection hardening", () => {
  const payload = `https://x.com/a" onmouseover="alert(1)`;

  it("cannot break out of href/src attributes via URLs", () => {
    for (const id of ids) {
      const html = generateSignatureHTML(
        {
          ...base,
          website: payload,
          profilePhotoUrl: payload,
          logoUrl: payload,
          calendarLink: payload,
          gifBannerUrl: payload,
          bannerLink: payload,
          socialLinks: [{ platform: "linkedin", url: payload }],
        },
        id
      );
      expect(html, id).not.toMatch(/"\s*onmouseover\s*=/i);
      expect(html, id).not.toContain('onmouseover="');
    }
  });

  it("cannot inject into style attributes via fontFamily or colours", () => {
    for (const id of ids) {
      const html = generateSignatureHTML(
        {
          ...base,
          fontFamily: `Arial" onload="alert(1)`,
          primaryColor: `red;background:url(javascript:alert(1))`,
          secondaryColor: `#fff" onerror="x`,
          textColor: `#000;position:fixed`,
        },
        id
      );
      expect(html, id).not.toContain("onload=");
      expect(html, id).not.toContain("onerror=");
      expect(html, id).not.toContain("javascript:");
      expect(html, id).not.toContain("position:fixed");
    }
  });

  it("cannot inject through a phone number, which becomes a tel: link", () => {
    for (const id of ids) {
      const html = generateSignatureHTML({ ...base, phone: `555" onclick="alert(1)` }, id);
      expect(html, id).not.toMatch(/"\s*onclick\s*=/i);
      // Only digits and a leading plus survive into the href (the 1 comes from alert(1)).
      expect(html, id).toContain('href="tel:5551"');
    }
  });

  it("clamps absurd font sizes", () => {
    const html = generateSignatureHTML({ ...base, fontSize: 9999 }, "minimal-modern");
    expect(html).toContain("font-size:24px");
    expect(html).not.toContain("font-size:9999");
  });

  it("normalises short and alpha hex colours so alpha suffixes stay valid", () => {
    const html = generateSignatureHTML({ ...base, primaryColor: "#f0a" }, "tint-panel");
    expect(html).toContain("#ff00aa");
    expect(html).not.toContain("#f0a14");
  });
});

describe("monogram", () => {
  it("fills the photo slot with initials when there is no photo", () => {
    const html = generateSignatureHTML(base, "professional-classic");
    expect(html).toContain(">AC<");
  });

  it("can be turned off", () => {
    const html = generateSignatureHTML({ ...base, showMonogram: false }, "professional-classic");
    expect(html).not.toContain(">AC<");
  });

  it("is replaced by a real photo when one is provided", () => {
    const html = generateSignatureHTML(
      { ...base, profilePhotoUrl: "https://example.com/me.jpg" },
      "professional-classic"
    );
    expect(html).toContain("https://example.com/me.jpg");
    expect(html).not.toContain(">AC<");
  });

  it("picks a readable text colour for light accents", () => {
    const html = generateSignatureHTML({ ...base, primaryColor: "#d4ff00" }, "professional-classic");
    expect(html).toContain("color:#111111");
  });

  it("centres the monogram in the executive template, for Outlook and for pages that reset margins", () => {
    const html = generateSignatureHTML(base, "executive-elegant");
    expect(html).toContain('align="center"');
    expect(html).toContain("margin-left:auto;margin-right:auto");
    expect(html).toContain(">AC<");
  });

  it("renders nothing when the name is empty", () => {
    const html = generateSignatureHTML({ ...base, fullName: "" }, "professional-classic");
    expect(html).not.toContain("letter-spacing:1px;text-align:center;");
  });

  it("is a definite-width table, so a wide neighbour cannot squeeze it into an oval", () => {
    const html = generateSignatureHTML(base, "stripe");
    expect(html).toMatch(/<table[^>]*width="44"[^>]*><tbody><tr><td width="44" height="44"/);
  });

  it("keeps a photo from collapsing next to a full-width cell", () => {
    const html = generateSignatureHTML({ ...base, profilePhotoUrl: "https://example.com/me.jpg" }, "stripe");
    expect(html).toMatch(/<img[^>]*max-width:44px/);
  });
});

describe("dark preview", () => {
  it("lifts a dark accent so it stays readable, without touching the export", () => {
    const navy = { ...base, primaryColor: "#1e3a8a" };
    const exported = generateSignatureHTML(navy, "professional-classic");
    expect(exported).toContain("#1e3a8a");

    const preview = generateSignatureHTML(navy, "professional-classic", { dark: true });
    expect(preview).not.toContain("#1e3a8a");
  });

  it("leaves an already-light accent alone", () => {
    const html = generateSignatureHTML({ ...base, primaryColor: "#d4ff00" }, "professional-classic", {
      dark: true,
    });
    expect(html).toContain("#d4ff00");
  });
});

describe("banner and credit", () => {
  const gif = "https://media.giphy.com/media/abc123/giphy.gif";

  it("renders a GIF banner under the signature, linked when a link is set", () => {
    const html = generateSignatureHTML(
      { ...base, gifBannerUrl: gif, bannerLink: "https://acme.com/launch" },
      "minimal-modern"
    );
    expect(html).toContain(gif);
    expect(html).toContain('<a href="https://acme.com/launch"');
  });

  it("falls back to the static banner image", () => {
    const html = generateSignatureHTML(
      { ...base, bannerUrl: "https://acme.com/banner.png" },
      "minimal-modern"
    );
    expect(html).toContain("https://acme.com/banner.png");
  });

  it("prefers the GIF over the static banner", () => {
    const html = generateSignatureHTML(
      { ...base, gifBannerUrl: gif, bannerUrl: "https://acme.com/banner.png" },
      "minimal-modern"
    );
    expect(html).toContain(gif);
    expect(html).not.toContain("banner.png");
  });

  it("sizes the banner for Outlook with an attribute and for everything else with CSS", () => {
    const html = generateSignatureHTML({ ...base, gifBannerUrl: gif }, "minimal-modern");
    expect(html).toMatch(/<img[^>]*width="360"[^>]*max-width:360px/);
  });

  it("omits the credit by default and adds it on request", () => {
    const plain = generateSignatureHTML(base, "minimal-modern");
    expect(plain).not.toContain("theovex.com");
    expect(plain).not.toContain("Theo AI");

    const withCredit = generateSignatureHTML(base, "minimal-modern", { credit: true });
    expect(withCredit).toContain("SignForge");
    expect(withCredit).toContain("https://theovex.com");
    expect(withCredit).toContain("TheoVex");
    expect(withCredit).toContain("opencharts.com/features/theo");
    expect(withCredit).toContain("Theo AI");
    expect(withCredit).not.toContain("class=");
  });

  it("draws the credit line in a colour that passes AA on white and on a dark inbox", () => {
    const light = generateSignatureHTML(base, "minimal-modern", { credit: true });
    const dark = generateSignatureHTML(base, "minimal-modern", { credit: true, dark: true });
    const colorOf = (html: string) => html.match(/color:(#[0-9a-f]{6});">Made with/i)![1];
    expect(contrast(colorOf(light), "#ffffff")).toBeGreaterThanOrEqual(4.5);
    expect(contrast(colorOf(dark), "#18181c")).toBeGreaterThanOrEqual(4.5);
  });

  it("keeps exports free of classes when banner and credit are on", () => {
    const html = generateSignatureHTML({ ...base, gifBannerUrl: gif }, "two-column", {
      credit: true,
    });
    expect(html).not.toContain("class=");
    expect(html).not.toContain("var(--font");
  });

  it("keeps the banner and credit aligned with centered and right-aligned designs", () => {
    const centered = generateSignatureHTML({ ...base, gifBannerUrl: gif }, "executive-elegant", { credit: true });
    expect(centered).toMatch(/<table[^>]*align="center"[^>]*><tbody><tr><td><img[^>]*giphy\.gif/);
    const right = generateSignatureHTML(base, "mirror", { credit: true });
    expect(right).toMatch(/<td align="right"[^>]*><span[^>]*>Made with/);
  });
});

/** Every field filled in, so every template shows every optional row. */
const full: SignatureData = {
  ...base,
  department: "Design",
  address: "1 Main Street",
  city: "Austin",
  state: "TX",
  zipCode: "78701",
  country: "USA",
  calendarLink: "https://cal.com/alex",
  disclaimer: "Confidential.",
  logoUrl: "https://acme.com/logo.png",
  profilePhotoUrl: "https://acme.com/alex.jpg",
  bannerUrl: "https://acme.com/banner.png",
  bannerLink: "https://acme.com/launch",
  socialLinks: [
    ...base.socialLinks,
    { platform: "twitter", url: "https://x.com/alexchen" },
    { platform: "website", url: "https://acme.com" },
  ],
};

// Emoji, symbols that render as emoji, and the joiners that build sequences.
const PICTOGRAPHIC = /[\p{Extended_Pictographic}\uFE0F\u200D]/u;

describe("no emoji in exported HTML", () => {
  const variants: Array<[string, Parameters<typeof generateSignatureHTML>[2]]> = [
    ["export", {}],
    ["preview", { preserveFontVars: true }],
    ["dark preview", { dark: true, preserveFontVars: true }],
    ["with credit", { credit: true }],
  ];

  it("keeps every template free of emoji and pictographic symbols", () => {
    expect(ids.length).toBeGreaterThanOrEqual(20);
    for (const id of ids) {
      for (const [label, options] of variants) {
        const html = generateSignatureHTML(full, id, options);
        expect(html, `${id} (${label})`).not.toMatch(PICTOGRAPHIC);
      }
    }
  });

  it("stays emoji-free when the data itself has none", () => {
    const sparse = { ...base, phone: "", website: "", socialLinks: [] };
    for (const id of ids) {
      expect(generateSignatureHTML(sparse, id), id).not.toMatch(PICTOGRAPHIC);
    }
  });

  it("still escapes text that arrives with emoji from a user, rather than adding its own", () => {
    const html = generateSignatureHTML({ ...base, jobTitle: "Designer 🎨" }, "minimal-modern");
    // The user's own characters pass through untouched; the template adds none.
    expect(html.match(/\p{Extended_Pictographic}/gu)).toHaveLength(1);
  });
});

describe("contact letter tiles", () => {
  const tiled: TemplateId[] = ["startup-fresh", "tint-panel"];

  /** A tile is a one-cell table whose only content is the letter. */
  const tile = (letter: string) => new RegExp(`<td [^>]*font-family:'Courier New'[^>]*>${letter}</td>`);
  const tileColours = (html: string) =>
    html.match(/background-color:(#[0-9a-f]{6,8});color:(#[0-9a-f]{6});font-family:'Courier New'/i)!;

  it("mark email, telephone, web and address in the two designs that carry contact tiles", () => {
    for (const id of tiled) {
      const html = generateSignatureHTML(full, id);
      for (const letter of ["E", "T", "W", "A"]) expect(html, `${id} ${letter}`).toMatch(tile(letter));
    }
  });

  it("draw a tile only for a row that exists", () => {
    const noContact = { ...base, email: "", phone: "", website: "", socialLinks: [] };
    for (const id of tiled) {
      const html = generateSignatureHTML(noContact, id);
      expect(html, id).not.toMatch(tile("E"));
      expect(html, id).not.toMatch(tile("T"));
      expect(html, id).not.toMatch(tile("W"));
      expect(html, id).not.toMatch(tile("A"));
    }
  });

  it("are a tinted table cell with inline styles only", () => {
    for (const id of tiled) {
      const html = generateSignatureHTML(full, id);
      expect(html, id).toContain("font-family:'Courier New',Courier,monospace");
      expect(html, id).toMatch(/background-color:#[0-9a-f]{6};color:#[0-9a-f]{6};font-family:'Courier New'/i);
      expect(html, id).not.toContain("class=");
      expect(html, id).not.toContain("<svg");
      // The only images are the ones the user supplied.
      const imgs = [...html.matchAll(/<img [^>]*src="([^"]+)"/g)].map((m) => m[1]);
      for (const src of imgs) expect(src).toMatch(/^https:\/\/acme\.com\//);
    }
  });

  it("tint with a solid color in the export so Outlook draws it too", () => {
    const html = generateSignatureHTML({ ...full, primaryColor: "#4f46e5" }, "tint-panel");
    expect(tileColours(html)[1]).toHaveLength(7);
  });

  it("use a deep tone in a dark inbox and a pale one in a light inbox", () => {
    for (const id of tiled) {
      const dark = tileColours(generateSignatureHTML(full, id, { dark: true }))[1];
      const light = tileColours(generateSignatureHTML(full, id))[1];
      expect(luminance(dark), `${id} dark`).toBeLessThan(0.2);
      expect(luminance(light), `${id} light`).toBeGreaterThan(0.6);
    }
  });

  it("keep a very light accent readable on their own tint", () => {
    for (const id of tiled) {
      const [, bg, fg] = tileColours(generateSignatureHTML({ ...full, primaryColor: "#d4ff00" }, id));
      expect(contrast(fg, bg), id).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("escape the values beside the tiles", () => {
    const html = generateSignatureHTML(
      { ...full, phone: "<b>555</b>", address: "A & B <i>" },
      "tint-panel"
    );
    expect(html).not.toContain("<b>555</b>");
    expect(html).toContain("&lt;b&gt;555&lt;&#x2F;b&gt;");
    expect(html).toContain("A &amp; B &lt;i&gt;");
  });

  it("use plain call-to-action labels", () => {
    expect(generateSignatureHTML(full, "tint-panel")).toContain(">Book a meeting</a>");
    expect(generateSignatureHTML(full, "two-column")).toContain(">Book a meeting</a>");
    expect(generateSignatureHTML(full, "startup-fresh")).toContain(">Schedule a call</a>");
    expect(generateSignatureHTML(full, "storefront")).toContain(">Book a visit</a>");
  });
});

describe("wrapHtmlDocument", () => {
  it("wraps a fragment in a complete HTML document", () => {
    const doc = wrapHtmlDocument(generateSignatureHTML(base, "minimal-modern"));
    expect(doc).toContain("<!DOCTYPE html>");
    expect(doc).toContain("<html>");
    expect(doc).toContain("Alex Chen");
  });
});

describe("htmlToPlainText", () => {
  it("leaves no markup or entities in the clipboard text of any design", () => {
    for (const id of ids) {
      const text = htmlToPlainText(generateSignatureHTML(full, id, { credit: true }));
      expect(text, id).toContain("Alex Chen");
      expect(text, id).toContain("alex@acme.com");
      expect(text, id).toContain("+1 555 0100");
      expect(text, id).not.toMatch(/<|>|&[a-z#0-9]+;/i);
    }
  });

  it("decodes the separators a design draws and keeps what the user typed", () => {
    const text = htmlToPlainText(
      generateSignatureHTML(
        { ...base, company: "Johnson & Johnson", jobTitle: "Head of &middot; &lt;Design&gt;" },
        "minimal-modern"
      )
    );
    expect(text).toContain("Johnson & Johnson");
    expect(text).toContain("Head of &middot; &lt;Design&gt;");
    expect(text).toContain("alex@acme.com \u00B7 +1 555 0100");
  });
});
