import { describe, it, expect } from "vitest";
import { generateSignatureHTML } from "./signature-html";
import { COLOR_THEMES, DEFAULT_SIGNATURE_DATA, type SignatureData } from "@/types/signature";
import { SIGNATURE_TEMPLATES, type TemplateId } from "./templates";
import { contrast, ensureContrast, liftForDark, makeTokens, readableOn } from "./signature/kit";

/**
 * Quality gates that every design has to pass. They exist because the old
 * catalog failed all of them quietly: 119 entries rendered 18 different looks,
 * most layouts dropped fields the user had filled in, and none of it was caught.
 */

const ids = SIGNATURE_TEMPLATES.map((t) => t.id as TemplateId);

/** Unique markers, so each field can be counted in the output. */
const probe: SignatureData = {
  ...DEFAULT_SIGNATURE_DATA,
  fullName: "Zed Probe",
  jobTitle: "Chief Prober",
  company: "Probe Works",
  department: "Probing Dept",
  email: "zed@probe.example",
  phone: "+1 555 0142",
  website: "probe-site.example",
  address: "9 Probe Road",
  city: "Probeville",
  state: "PV",
  zipCode: "99999",
  country: "Probeland",
  calendarLink: "https://cal.example/zed",
  disclaimer: "Probe disclaimer text.",
  logoUrl: "https://probe.example/logo.png",
  profilePhotoUrl: "https://probe.example/zed.jpg",
  bannerUrl: "https://probe.example/banner.png",
  bannerLink: "https://probe.example/launch",
  socialLinks: [
    { platform: "linkedin", url: "https://linkedin.com/in/zed" },
    { platform: "github", url: "https://github.com/zed" },
    { platform: "twitter", url: "https://x.com/zed" },
    { platform: "instagram", url: "https://instagram.com/zed" },
  ],
  primaryColor: "#336699",
  secondaryColor: "#cc9933",
  textColor: "#222222",
};

const count = (haystack: string, needle: string) => haystack.split(needle).length - 1;
/** The visible text: every tag becomes a separator, so only content is left. */
const textOf = (html: string) => html.replace(/<[^>]*>/g, "\u0000");

describe("every design draws every field exactly once", () => {
  const TEXT: Array<[string, string]> = [
    ["name", "Zed Probe"],
    ["role", "Chief Prober"],
    ["company", "Probe Works"],
    ["department", "Probing Dept"],
    ["email", "zed@probe.example"],
    ["phone", "+1 555 0142"],
    ["website", "probe-site.example"],
    ["street", "9 Probe Road"],
    ["city line", "Probeville, PV 99999"],
    ["country", "Probeland"],
    ["disclaimer", "Probe disclaimer text."],
    ["LinkedIn", "LinkedIn"],
    ["GitHub", "GitHub"],
    ["X", ">X<"],
    ["Instagram", "Instagram"],
  ];
  const URLS: Array<[string, string]> = [
    ["photo", "https://probe.example/zed.jpg"],
    ["logo", "https://probe.example/logo.png"],
    ["booking link", "https://cal.example/zed"],
    ["LinkedIn link", "https://linkedin.com/in/zed"],
    ["GitHub link", "https://github.com/zed"],
    ["email link", "mailto:zed%40probe.example"],
    ["phone link", "tel:+15550142"],
    ["banner", "https://probe.example/banner.png"],
  ];

  it("shows each text field once, never dropped and never repeated", () => {
    for (const id of ids) {
      const html = generateSignatureHTML(probe, id);
      // The X label is matched with its tags because a bare "X" is too short to count.
      const text = textOf(html).replace(/\u0000X\u0000/g, ">X<");
      for (const [label, needle] of TEXT) {
        expect(count(text, needle), `${id}: ${label}`).toBe(1);
      }
    }
  });

  it("links each url once", () => {
    for (const id of ids) {
      const html = generateSignatureHTML(probe, id);
      for (const [label, needle] of URLS) {
        expect(count(html, needle), `${id}: ${label}`).toBe(1);
      }
    }
  });

  it("still shows everything when the initials are switched off", () => {
    for (const id of ids) {
      const html = generateSignatureHTML({ ...probe, showMonogram: false, profilePhotoUrl: "" }, id);
      const text = textOf(html);
      for (const [label, needle] of TEXT.slice(0, 11)) {
        expect(count(text, needle), `${id}: ${label}`).toBe(1);
      }
    }
  });
});

describe("every design honours the controls", () => {
  it("uses the accent line colour and the text colour", () => {
    for (const id of ids) {
      const html = generateSignatureHTML(probe, id);
      expect(html, `${id} accent line`).toContain("#cc9933");
      expect(html, `${id} text colour`).toContain("#222222");
    }
  });

  it("removes every accent rule when the Divider is None", () => {
    for (const id of ids) {
      const html = generateSignatureHTML({ ...probe, dividerStyle: "none" }, id);
      expect(html, id).not.toMatch(/border-(top|bottom|left|right):\d+px (solid|dashed|dotted) #cc9933/);
    }
  });

  it("draws the accent rule dashed when asked to", () => {
    // Rail and Stripe use the accent line as a fill, and Plain only colours its separators.
    const fills = new Set<TemplateId>(["rail", "stripe", "plain-text"]);
    for (const id of ids.filter((i) => !fills.has(i))) {
      const html = generateSignatureHTML({ ...probe, dividerStyle: "dashed" }, id);
      expect(html, id).toMatch(/border-(top|bottom|left|right):\d+px dashed #cc9933/);
    }
  });

  it("squares the photo when the Photo shape is Square", () => {
    for (const id of ids) {
      const html = generateSignatureHTML({ ...probe, photoShape: "square" }, id);
      expect(html, id).toMatch(/<img[^>]*zed\.jpg[^>]*border-radius:0;/);
    }
  });

  it("changes with Spacing and with Text size", () => {
    for (const id of ids) {
      const render = (patch: Partial<SignatureData>) => generateSignatureHTML({ ...probe, ...patch }, id);
      expect(render({ contentPadding: "compact" }), `${id} compact vs relaxed`).not.toBe(
        render({ contentPadding: "relaxed" })
      );
      expect(render({ fontSize: 10 }), `${id} 10px vs 18px`).not.toBe(render({ fontSize: 18 }));
    }
  });
});

describe("every design is built for email clients", () => {
  const variants: Array<[string, Parameters<typeof generateSignatureHTML>[2]]> = [
    ["export", {}],
    ["preview", { preserveFontVars: true }],
    ["dark", { dark: true }],
    ["credit", { credit: true }],
  ];

  for (const [label, options] of variants) {
    it(`avoids what Outlook for Windows, Gmail and Yahoo drop or break (${label})`, () => {
      for (const id of ids) {
        const html = generateSignatureHTML(probe, id, options);
        const at = `${id} (${label})`;

        expect(html, at).not.toMatch(/\sclass=/);
        expect(html, at).not.toMatch(/<(svg|style|script|link|iframe|form)\b/i);
        expect(html, at).not.toMatch(
          /linear-gradient|radial-gradient|box-shadow|opacity|position:|display:(flex|grid|inline-block)|min-width|border-spacing|float:/
        );
        expect(html, at).not.toMatch(/\b(undefined|NaN|null)\b|\[object/);

        // Spacing is padding on cells. The only margin is the auto margin that centres a table.
        expect(html.replace(/margin-(left|right):auto;/g, ""), at).not.toContain("margin");

        // Outlook for Windows renders weights under 600 as normal, so use only the two it honours.
        for (const [, weight] of html.matchAll(/font-weight:([^;"]+)/g)) {
          expect(["bold", "normal"], `${at} weight ${weight}`).toContain(weight);
        }
        // Em units letter-space differently in Outlook.
        for (const [, spacing] of html.matchAll(/letter-spacing:([^;"]+)/g)) {
          expect(spacing, `${at} letter-spacing`).toMatch(/^[\d.]+px$/);
        }
        // Every text cell sets an exact line height, which Outlook needs to honour it.
        for (const [, style] of html.matchAll(/style="([^"]*)"/g)) {
          if (/line-height:/.test(style)) expect(style, `${at} line-height`).toContain("mso-line-height-rule:exactly");
        }
        // Nothing below a readable size, apart from the zero-height spacer cells.
        for (const [, size] of html.matchAll(/font-size:([\d.]+)px/g)) {
          const px = Number(size);
          expect(px === 0 || px === 1 || px >= 9, `${at} font-size ${size}px`).toBe(true);
        }
        // Wide enough to look intentional, narrow enough for a phone and a Gmail sidebar.
        for (const [, w] of html.matchAll(/\swidth="(\d+)"/g)) {
          expect(Number(w), `${at} width ${w}`).toBeLessThanOrEqual(480);
        }

        for (const [tag] of html.matchAll(/<table\b[^>]*>/g)) {
          expect(tag, `${at} table`).toContain('role="presentation"');
          expect(tag, `${at} table`).toContain('cellpadding="0" cellspacing="0" border="0"');
          // Without this a rounded cell loses its corners in any page that collapses borders.
          expect(tag, `${at} table`).toContain("border-collapse:separate");
        }
        for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) {
          expect(tag, `${at} img`).toMatch(/\salt="/);
          expect(tag, `${at} img`).toMatch(/\swidth="\d+"/);
          expect(tag, `${at} img`).toContain("display:block");
        }
        // A link that wraps text carries its own colour and decoration, so no client restyles it.
        for (const [, attrs] of html.matchAll(/<a\b([^>]*)>(?!<img)/g)) {
          expect(attrs, `${at} link`).toContain("color:");
          expect(attrs, `${at} link`).toContain("text-decoration:");
        }
      }
    });
  }

  it("stays under the Gmail signature limit with everything filled in", () => {
    // Gmail stores at most 10,000 characters of HTML and adds some of its own after a paste.
    for (const id of ids) {
      const html = generateSignatureHTML(probe, id, { credit: true });
      expect(html.length, id).toBeLessThan(8000);
    }
  });

  it("keeps a light inbox panel out of the dark preview", () => {
    // Split draws its logo on a white tile on purpose.
    for (const id of ids.filter((i) => i !== "split-panel")) {
      const html = generateSignatureHTML(probe, id, { dark: true });
      expect(html, id).not.toContain("background-color:#ffffff");
    }
  });
});

describe("every design stays tidy when data is missing", () => {
  const bare: SignatureData = {
    ...DEFAULT_SIGNATURE_DATA,
    fullName: "Zed Probe",
    email: "zed@probe.example",
    primaryColor: "#336699",
  };
  const untidy = /<tr><\/tr>|<tbody><\/tbody>|<td[^>]*><\/td>/;

  it("leaves no empty rows or cells with only a name and an email", () => {
    for (const id of ids) {
      const html = generateSignatureHTML(bare, id);
      expect(html, id).not.toMatch(untidy);
      expect(html, id).toContain("Zed Probe");
      expect(html, id).toContain("zed@probe.example");
    }
  });

  it("leaves no empty rows or cells with nothing to draw a mark from", () => {
    for (const id of ids) {
      const html = generateSignatureHTML({ ...bare, showMonogram: false }, id);
      expect(html, id).not.toMatch(untidy);
    }
  });

  it("renders placeholders, not blanks or errors, for a completely empty signature", () => {
    for (const id of ids) {
      const html = generateSignatureHTML({ ...DEFAULT_SIGNATURE_DATA }, id);
      expect(html, id).toContain("Your Name");
      expect(html, id).not.toMatch(/\b(undefined|NaN|null)\b/);
    }
  });
});

describe("no two designs share a layout", () => {
  /** The tag tree with only the attributes that shape the layout: no styles, text or URLs. */
  const structure = (html: string): string[] =>
    (html.match(/<(table|tr|td|img|a|br)\b[^>]*>/g) ?? []).map((tag) => {
      const name = tag.match(/^<(\w+)/)![1];
      const keep = ["width", "height", "colspan", "align", "valign"]
        .map((a) => tag.match(new RegExp(`\\s${a}="([^"]*)"`))?.[1] && `${a}${tag.match(new RegExp(`\\s${a}="([^"]*)"`))![1]}`)
        .filter(Boolean)
        .join(",");
      return `${name}[${keep}]`;
    });

  const trigrams = (tokens: string[]) => {
    const m = new Map<string, number>();
    for (let i = 0; i <= tokens.length - 3; i++) {
      const k = tokens.slice(i, i + 3).join(">");
      m.set(k, (m.get(k) ?? 0) + 1);
    }
    return m;
  };
  const dice = (a: Map<string, number>, b: Map<string, number>) => {
    let shared = 0;
    let total = 0;
    for (const v of a.values()) total += v;
    for (const v of b.values()) total += v;
    for (const [k, v] of a) shared += Math.min(v, b.get(k) ?? 0);
    return (2 * shared) / total;
  };

  const trees = new Map(ids.map((id) => [id, structure(generateSignatureHTML(probe, id))]));

  it("gives every template its own structure", () => {
    expect(new Set([...trees.values()].map((t) => t.join(""))).size).toBe(ids.length);
  });

  it("keeps even the closest pair clearly apart", () => {
    // Related designs may share a skeleton (a mark, a rule, contacts) and differ in type and
    // colour. A copy with a tweak would score close to 1, which is what this guards against.
    const grams = new Map(ids.map((id) => [id, trigrams(trees.get(id)!)]));
    let worst = { score: 0, pair: "" };
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const score = dice(grams.get(ids[i])!, grams.get(ids[j])!);
        if (score > worst.score) worst = { score, pair: `${ids[i]} and ${ids[j]}` };
      }
    }
    expect(worst.score, worst.pair).toBeLessThan(0.96);
  });
});

describe("colour tokens", () => {
  const accents = [...COLOR_THEMES.map((t) => t.primaryColor), "#d4ff00", "#fde047", "#000000", "#ffffff"];
  const tokensFor = (primary: string, dark: boolean, extra: Partial<SignatureData> = {}) =>
    makeTokens(
      {
        ...DEFAULT_SIGNATURE_DATA,
        fontFamily: "Arial, sans-serif",
        fontSize: 14,
        contentPadding: "normal",
        // The wrapper lifts the accent for a dark inbox before the tokens see it.
        primaryColor: dark ? liftForDark(primary) : primary,
        ...extra,
      },
      dark
    );

  for (const dark of [false, true]) {
    it(`keeps text and accent text at AA on a ${dark ? "dark" : "light"} inbox, for every theme and the hard colours`, () => {
      for (const color of accents) {
        const t = tokensFor(color, dark);
        const at = `${color} ${dark ? "dark" : "light"}`;
        expect(contrast(t.accentInk, t.bg), `${at} accent as text`).toBeGreaterThanOrEqual(4.5);
        expect(contrast(t.muted, t.bg), `${at} muted`).toBeGreaterThanOrEqual(4.5);
        expect(contrast(t.body, t.bg), `${at} body`).toBeGreaterThanOrEqual(7);
        expect(contrast(t.ink, t.bg), `${at} ink`).toBeGreaterThanOrEqual(12);
        expect(contrast(t.onAccent, t.accent), `${at} text on accent`).toBeGreaterThanOrEqual(4.5);
        expect(contrast(t.onAccentLg, t.accent), `${at} large text on accent`).toBeGreaterThanOrEqual(3);
      }
    });
  }

  it("leaves the swatch itself untouched for fills", () => {
    expect(tokensFor("#d4ff00", false).accent).toBe("#d4ff00");
    expect(tokensFor("#d4ff00", false).accentInk).not.toBe("#d4ff00");
  });

  it("keeps the hierarchy when the user picks their own text colour", () => {
    const t = tokensFor("#336699", false, { textColor: "#444444" });
    expect(t.ink).toBe("#444444");
    expect(t.body).not.toBe(t.ink);
    expect(t.muted).not.toBe(t.body);
    expect(contrast(t.muted, t.bg)).toBeGreaterThanOrEqual(4.5);
  });

  it("ensureContrast only moves a colour that needs it, and readableOn prefers white", () => {
    expect(ensureContrast("#1e3a8a", "#ffffff", 4.5)).toBe("#1e3a8a");
    expect(contrast(ensureContrast("#d4ff00", "#ffffff", 4.5), "#ffffff")).toBeGreaterThanOrEqual(4.5);
    expect(contrast(ensureContrast("#1e3a8a", "#18181c", 4.5), "#18181c")).toBeGreaterThanOrEqual(4.5);
    expect(readableOn("#2563eb")).toBe("#ffffff");
    expect(readableOn("#d4ff00")).toBe("#111111");
  });
});
