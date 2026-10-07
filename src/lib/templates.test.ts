import { describe, it, expect } from "vitest";
import {
  DEFAULT_TEMPLATE_ID,
  LEGACY_TEMPLATE_IDS,
  SIGNATURE_TEMPLATES,
  TEMPLATE_CATEGORIES,
  getTemplate,
  isTemplateId,
  resolveTemplateId,
  templateDescription,
} from "./templates";
import { DESIGNS, DESIGN_ALIGN } from "./signature";

const PICTOGRAPHIC = /[\p{Extended_Pictographic}\uFE0F\u200D]/u;

describe("template registry", () => {
  it("has unique ids and names, each in a known category", () => {
    const categories = TEMPLATE_CATEGORIES.map((c) => c.id) as string[];
    expect(new Set(SIGNATURE_TEMPLATES.map((t) => t.id)).size).toBe(SIGNATURE_TEMPLATES.length);
    expect(new Set(SIGNATURE_TEMPLATES.map((t) => t.name)).size).toBe(SIGNATURE_TEMPLATES.length);
    for (const t of SIGNATURE_TEMPLATES) expect(categories, t.id).toContain(t.category);
  });

  it("sorts the catalog into six styles of four designs", () => {
    expect(TEMPLATE_CATEGORIES).toHaveLength(6);
    expect(SIGNATURE_TEMPLATES).toHaveLength(24);
    for (const c of TEMPLATE_CATEGORIES) {
      expect(SIGNATURE_TEMPLATES.filter((t) => t.category === c.id), c.id).toHaveLength(4);
    }
  });

  it("describes every design for people and for the AI, in plain copy", () => {
    for (const t of SIGNATURE_TEMPLATES) {
      expect(t.description.length, t.id).toBeGreaterThan(20);
      expect(t.bestFor.length, t.id).toBeGreaterThan(0);
      for (const text of [t.name, t.description, ...t.bestFor]) {
        expect(text, t.id).not.toMatch(PICTOGRAPHIC);
        expect(text, t.id).not.toContain("\u2014");
      }
    }
  });

  it("has a renderer for every id and none for an id that does not exist", () => {
    expect(Object.keys(DESIGNS).sort()).toEqual(SIGNATURE_TEMPLATES.map((t) => t.id).sort());
    for (const id of Object.keys(DESIGN_ALIGN)) expect(isTemplateId(id), id).toBe(true);
  });

  it("uses a default that exists", () => {
    expect(isTemplateId(DEFAULT_TEMPLATE_ID)).toBe(true);
  });
});

describe("ids", () => {
  it("isTemplateId is strict: only current ids pass, which is what AI output and the API need", () => {
    expect(isTemplateId("rail")).toBe(true);
    expect(isTemplateId("creative-gradient")).toBe(false);
    expect(isTemplateId("banner-cta")).toBe(false);
    for (const bad of ["", "nope", "__proto__", "constructor", 7, null, undefined, {}]) {
      expect(isTemplateId(bad), String(bad)).toBe(false);
    }
  });

  it("maps every retired id to a design that exists, and no current id is also retired", () => {
    for (const [legacy, current] of Object.entries(LEGACY_TEMPLATE_IDS)) {
      expect(isTemplateId(current), legacy).toBe(true);
      expect(isTemplateId(legacy), legacy).toBe(false);
    }
    expect(LEGACY_TEMPLATE_IDS["creative-gradient"]).toBe("tint-panel");
    expect(LEGACY_TEMPLATE_IDS["banner-cta"]).toBe("name-plate");
  });

  it("keeps every id that shipped in the last release working", () => {
    // The ten ids a saved draft or a share link could carry from before the rebuild.
    const shipped = [
      "professional-classic",
      "minimal-modern",
      "corporate-bold",
      "creative-gradient",
      "executive-elegant",
      "startup-fresh",
      "compact-horizontal",
      "modern-card",
      "two-column",
      "banner-cta",
    ];
    for (const id of shipped) expect(resolveTemplateId(id), id).not.toBeNull();
  });

  it("resolveTemplateId follows aliases and rejects anything else, including prototype keys", () => {
    expect(resolveTemplateId("rail")).toBe("rail");
    expect(resolveTemplateId("creative-gradient")).toBe("tint-panel");
    for (const bad of ["", "nope", "__proto__", "constructor", "toString", 7, null, undefined]) {
      expect(resolveTemplateId(bad), String(bad)).toBeNull();
    }
  });

  it("getTemplate resolves aliases and falls back to the default design", () => {
    expect(getTemplate("rail").id).toBe("rail");
    expect(getTemplate("creative-gradient").id).toBe("tint-panel");
    expect(getTemplate("nope").id).toBe(DEFAULT_TEMPLATE_ID);
  });
});

describe("the catalog the AI reads", () => {
  const lines = templateDescription().split("\n");

  it("has one line per design, led by its id, with the style word and the best-for list", () => {
    expect(lines).toHaveLength(SIGNATURE_TEMPLATES.length);
    SIGNATURE_TEMPLATES.forEach((t, i) => {
      expect(lines[i]).toContain(`- ${t.id}: ${t.name} [${t.category}].`);
      expect(lines[i]).toContain(`Best for: ${t.bestFor.join(", ")}.`);
    });
  });

  it("stays compact, so most of the prompt is not spent on the template list", () => {
    // The 119-entry list was about 16,000 characters, most of the whole system prompt.
    expect(templateDescription().length).toBeLessThan(5000);
  });
});
