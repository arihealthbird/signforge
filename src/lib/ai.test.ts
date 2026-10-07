import { describe, it, expect } from "vitest";
import { extractJson, coerceSignature, buildSystemPrompt } from "./ai";
import { DEFAULT_SIGNATURE_DATA } from "@/types/signature";
import { SCENES } from "@/scenes";
import { SIGNATURE_TEMPLATES } from "./templates";

describe("extractJson", () => {
  it("parses plain JSON objects", () => {
    expect(extractJson(`{ "fullName": "Jane" }`)).toEqual({ fullName: "Jane" });
  });

  it("strips markdown code fences", () => {
    const out = extractJson("```json\n{ \"fullName\": \"Jane\" }\n```");
    expect(out).toEqual({ fullName: "Jane" });
  });

  it("extracts JSON embedded in prose", () => {
    const out = extractJson('Sure! Here you go: { "fullName": "Jane" } Hope it helps.');
    expect(out).toEqual({ fullName: "Jane" });
  });

  it("returns null for non-JSON input", () => {
    expect(extractJson("no json here at all")).toBeNull();
  });
});

describe("coerceSignature", () => {
  it("maps known fields onto the signature", () => {
    const { signature } = coerceSignature({
      fullName: "Jane Doe",
      jobTitle: "CTO",
      company: "Nimbus",
      email: "jane@nimbus.io",
      primaryColor: "#0ea5e9",
      fontSize: 16,
    });
    expect(signature.fullName).toBe("Jane Doe");
    expect(signature.jobTitle).toBe("CTO");
    expect(signature.company).toBe("Nimbus");
    expect(signature.email).toBe("jane@nimbus.io");
    expect(signature.primaryColor).toBe("#0ea5e9");
    expect(signature.fontSize).toBe(16);
  });

  it("clamps font size to the supported range", () => {
    expect(coerceSignature({ fontSize: 500 }).signature.fontSize).toBe(18);
    expect(coerceSignature({ fontSize: 1 }).signature.fontSize).toBe(10);
  });

  it("falls back on invalid colors and rejects unknown templates", () => {
    const { signature, template } = coerceSignature({
      primaryColor: "hotpink",
      suggestedTemplate: "space-theme",
    });
    expect(signature.primaryColor).toBe("#6366f1");
    expect(template).toBeNull();
  });

  it("accepts every current template id and rejects retired ones, so the model cannot revive them", () => {
    for (const t of SIGNATURE_TEMPLATES) {
      expect(coerceSignature({ suggestedTemplate: t.id }).template, t.id).toBe(t.id);
    }
    expect(coerceSignature({ suggestedTemplate: "creative-gradient" }).template).toBeNull();
    expect(coerceSignature({ suggestedTemplate: "banner-cta" }).template).toBeNull();
  });

  it("stores text raw so it is escaped exactly once at render time", () => {
    const { signature } = coerceSignature({
      fullName: "Sinéad O'Brien",
      company: "Johnson & Johnson / Partners",
    });
    expect(signature.fullName).toBe("Sinéad O'Brien");
    expect(signature.company).toBe("Johnson & Johnson / Partners");
    expect(signature.company).not.toContain("&amp;");
  });

  it("drops angle brackets from text and validates URLs", () => {
    const { signature } = coerceSignature({
      fullName: `<img src=x onerror=alert(1)>`,
      website: "javascript:alert(1)",
    });
    expect(signature.fullName).not.toContain("<");
    expect(signature.fullName).not.toContain(">");
    expect(signature.website).toBe("");
  });

  it("only keeps valid social platforms", () => {
    const { signature } = coerceSignature({
      socialLinks: [
        { platform: "linkedin", url: "https://linkedin.com/in/jane" },
        { platform: "myspace", url: "https://myspace.com/jane" },
      ],
    });
    expect(signature.socialLinks).toHaveLength(1);
    expect(signature.socialLinks[0].platform).toBe("linkedin");
  });

  it("merges onto the provided base signature", () => {
    const base = { ...DEFAULT_SIGNATURE_DATA, company: "Existing Co", department: "Ops" };
    const { signature } = coerceSignature({ fullName: "New Name" }, base);
    expect(signature.fullName).toBe("New Name");
    expect(signature.company).toBe("Existing Co");
    expect(signature.department).toBe("Ops");
  });

  it("keeps an existing banner when refining", () => {
    const base = { ...DEFAULT_SIGNATURE_DATA, gifBannerUrl: "https://media.giphy.com/media/x/giphy.gif" };
    const { signature } = coerceSignature({ fullName: "Jane" }, base);
    expect(signature.gifBannerUrl).toBe("https://media.giphy.com/media/x/giphy.gif");
  });

  it("accepts a valid scene and rejects unknown ones", () => {
    expect(coerceSignature({ scene: "pirate" }).scene).toBe("pirate");
    expect(coerceSignature({ scene: "darth-vader" }).scene).toBeNull();
    expect(coerceSignature({}).scene).toBeNull();
  });

  it("accepts every registered scene, including the pop-culture pack", () => {
    for (const s of SCENES) expect(coerceSignature({ scene: s.id }).scene).toBe(s.id);
    for (const id of ["office", "parks", "vader", "yoda", "spiderman"]) {
      expect(coerceSignature({ scene: id }).scene).toBe(id);
    }
  });

  it("rejects scene ids it does not know, even ones that look plausible", () => {
    for (const id of ["the-office", "parks-and-recreation", "spider-man", "darth-vader", "Office", ""]) {
      expect(coerceSignature({ scene: id }).scene).toBeNull();
    }
    expect(coerceSignature({ scene: 7 }).scene).toBeNull();
  });

  it("returns a sanitised gifQuery", () => {
    expect(coerceSignature({ gifQuery: "  thank you!! " }).gifQuery).toBe("thank you");
    expect(coerceSignature({ gifQuery: "<script>" }).gifQuery).toBe("script");
    expect(coerceSignature({ gifQuery: "x" }).gifQuery).toBeNull();
    expect(coerceSignature({}).gifQuery).toBeNull();
  });

  it("never lets the model set image URLs to unsafe schemes", () => {
    const { signature } = coerceSignature({
      logoUrl: "javascript:alert(1)",
      profilePhotoUrl: `https://x.com/a.png" onerror="alert(1)`,
    });
    expect(signature.logoUrl).toBe("");
    expect(signature.profilePhotoUrl).not.toContain('"');
  });
});

describe("buildSystemPrompt", () => {
  it("mentions the schema fields the client depends on", () => {
    const prompt = buildSystemPrompt();
    expect(prompt).toContain("suggestedTemplate");
    expect(prompt).toContain("scene");
    expect(prompt).toContain("gifQuery");
    expect(prompt).toContain("NEVER invent image URLs");
  });

  it("lists every template with its style word and best-for list", () => {
    const prompt = buildSystemPrompt();
    for (const t of SIGNATURE_TEMPLATES) {
      expect(prompt).toContain(`- ${t.id}: ${t.name} [${t.category}].`);
      expect(prompt).toContain(`Best for: ${t.bestFor.join(", ")}.`);
    }
  });

  it("does not hard-code template ids in the industry guidance, so it cannot drift from the catalog", () => {
    const prompt = buildSystemPrompt();
    const guidance = prompt.slice(prompt.indexOf("INDUSTRY GUIDELINES"), prompt.indexOf("OUTPUT JSON SCHEMA"));
    expect(guidance).toContain("Best for");
    for (const t of SIGNATURE_TEMPLATES) expect(guidance, t.id).not.toContain(t.id);
  });

  it("stays small now that the catalog is 24 designs rather than 119 near-duplicates", () => {
    // The old prompt was about 20,000 characters, most of it the template list.
    expect(buildSystemPrompt().length).toBeLessThan(10000);
  });

  it("lists every scene, with a suggested accent for the themed ones", () => {
    const prompt = buildSystemPrompt();
    for (const s of SCENES) expect(prompt).toContain(`- ${s.id}: `);
    expect(prompt).toContain("Suggested accent color #ef4444.");
    expect(prompt).toContain("matches one of the scenes above");
  });

  it("does not hard-code scene names, so removing the pop-culture pack stays safe", () => {
    const prompt = buildSystemPrompt();
    const instruction = prompt.slice(prompt.indexOf("Only choose a scene"), prompt.indexOf("GIFS:"));
    for (const name of ["Office", "Vader", "Yoda", "Spider", "Parks"]) {
      expect(instruction).not.toContain(name);
    }
  });
});
