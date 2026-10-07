import { describe, it, expect } from "vitest";
import { EXAMPLES, EXAMPLE_PROMPTS, SAMPLES } from "./samples";
import { STATS } from "./stats";
import { SIGNATURE_TEMPLATES, isTemplateId } from "./templates";
import { COLOR_THEMES, FONT_OPTIONS } from "@/types/signature";
import { SCENES, getScene, isSceneId } from "@/scenes";
import { isIconName } from "@/components/icons";

const PICTOGRAPHIC = /[\p{Extended_Pictographic}\uFE0F\u200D]/u;

describe("SAMPLES", () => {
  it("use real templates and scenes", () => {
    for (const s of SAMPLES) {
      expect(isTemplateId(s.template), s.id).toBe(true);
      expect(isSceneId(s.scene), s.id).toBe(true);
    }
  });

  it("stay on the core scenes, so the pop-culture pack can be removed without breaking the demo", () => {
    for (const s of SAMPLES) expect(getScene(s.scene).group, s.id).not.toBe("pop-culture");
  });

  it("have unique ids and captions", () => {
    expect(new Set(SAMPLES.map((s) => s.id)).size).toBe(SAMPLES.length);
    for (const s of SAMPLES) expect(s.prompt.length).toBeGreaterThan(10);
  });

  it("show a different design each, so the demo shows the range", () => {
    expect(new Set(SAMPLES.map((s) => s.template)).size).toBe(SAMPLES.length);
  });
});

describe("EXAMPLES", () => {
  it("point at icons in the registry, never emoji", () => {
    expect(EXAMPLES.length).toBeGreaterThanOrEqual(4);
    for (const e of EXAMPLES) {
      expect(isIconName(e.icon), `${e.label} icon "${e.icon}"`).toBe(true);
      expect(e.label).not.toMatch(PICTOGRAPHIC);
      expect(e.prompt).not.toMatch(PICTOGRAPHIC);
      expect("emoji" in e).toBe(false);
    }
  });

  it("feed the composer's typewriter", () => {
    expect(EXAMPLE_PROMPTS).toEqual(EXAMPLES.map((e) => e.prompt));
  });
});

describe("STATS", () => {
  it("read the registries, so landing copy cannot drift", () => {
    expect(STATS.templates).toBe(SIGNATURE_TEMPLATES.length);
    expect(STATS.fonts).toBe(FONT_OPTIONS.length);
    expect(STATS.colors).toBe(COLOR_THEMES.length);
    expect(STATS.scenes).toBe(SCENES.length);
  });

  it("match the numbers the product is documented to have", () => {
    expect(STATS.templates).toBe(24);
    expect(STATS.fonts).toBe(18);
    expect(STATS.scenes).toBe(11);
  });
});
