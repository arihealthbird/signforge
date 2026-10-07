import { describe, it, expect } from "vitest";
import {
  DEFAULT_SCENE_ID,
  SCENES,
  SCENE_GROUPS,
  getScene,
  isSceneId,
  sceneDescription,
  scenesByGroup,
  type FxKind,
  type Scene,
} from "./index";
import { CORE_SCENES } from "./core";
import { POP_CULTURE_SCENES } from "./pop-culture";
import { isIconName } from "@/components/icons";
import { isHex6 } from "@/lib/color";

const PICTOGRAPHIC = /[\p{Extended_Pictographic}\uFE0F\u200D]/u;
const EM_DASH = /\u2014/;

/** Every string a scene can put on screen or in the AI prompt. */
function copyOf(s: Scene): string[] {
  return [s.name, s.blurb, s.to, s.subject, s.greeting, ...s.body, s.closing];
}

/** The effects the canvas engine implements. Keep in step with scene-fx.tsx. */
const FX_KINDS: FxKind[] = [
  "none",
  "embers",
  "sparkles",
  "bubbles",
  "rain",
  "stars",
  "papers",
  "leaves",
  "fireflies",
  "web",
  "scanlines",
];

describe("scene registry", () => {
  it("has unique, simple ids", () => {
    const ids = SCENES.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z]+$/);
  });

  it("is the core pack followed by the pop-culture pack", () => {
    expect(CORE_SCENES).toHaveLength(6);
    expect(POP_CULTURE_SCENES).toHaveLength(5);
    expect(SCENES).toHaveLength(CORE_SCENES.length + POP_CULTURE_SCENES.length);
    expect(SCENES.slice(0, 6).map((s) => s.id)).toEqual(CORE_SCENES.map((s) => s.id));
    expect(DEFAULT_SCENE_ID).toBe("classic");
    expect(SCENES[0].id).toBe(DEFAULT_SCENE_ID);
  });

  it("keeps the packs apart by group", () => {
    for (const s of CORE_SCENES) expect(s.group).not.toBe("pop-culture");
    for (const s of POP_CULTURE_SCENES) expect(s.group).toBe("pop-culture");
    expect(POP_CULTURE_SCENES.map((s) => s.id)).toEqual(["office", "parks", "vader", "yoda", "spiderman"]);
  });

  it("gives every scene an icon from the registry and a valid accent", () => {
    for (const s of SCENES) {
      expect(isIconName(s.icon), `${s.id} icon "${s.icon}"`).toBe(true);
      expect(isHex6(s.accent), `${s.id} accent`).toBe(true);
      expect(SCENE_GROUPS.map((g) => g.id)).toContain(s.group);
    }
  });

  it("uses valid colors and effects", () => {
    for (const s of SCENES) {
      expect(s.dots, s.id).toHaveLength(3);
      for (const c of s.dots) expect(isHex6(c), `${s.id} dot ${c}`).toBe(true);
      for (const c of s.fxColors) expect(isHex6(c), `${s.id} fx ${c}`).toBe(true);
      for (const c of [s.barText.light, s.barText.dark]) expect(isHex6(c), `${s.id} text ${c}`).toBe(true);
      expect(FX_KINDS, s.id).toContain(s.fx);
      if (s.fx !== "none") expect(s.fxColors.length, s.id).toBeGreaterThan(0);
      for (const paint of [s.bar.light, s.bar.dark, s.stage.light, s.stage.dark]) {
        expect(paint, s.id).toMatch(/gradient\(/);
      }
    }
  });

  it("writes real copy for the mock email", () => {
    for (const s of SCENES) {
      expect(s.body.length, s.id).toBeGreaterThanOrEqual(1);
      for (const text of copyOf(s)) expect(text.trim().length, `${s.id}: "${text}"`).toBeGreaterThan(0);
      expect(s.to, s.id).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    }
  });

  it("contains no emoji and no em dashes in any copy", () => {
    for (const s of SCENES) {
      for (const text of copyOf(s)) {
        expect(text, `${s.id}: ${text}`).not.toMatch(PICTOGRAPHIC);
        expect(text, `${s.id}: ${text}`).not.toMatch(EM_DASH);
      }
      expect(s.icon).not.toMatch(PICTOGRAPHIC);
    }
  });

  it("only names fonts we ship, in a safe stack", () => {
    const shipped = ["Pirata One", "IM Fell English", "Pacifico"];
    for (const s of SCENES) {
      if (!s.font) continue;
      expect(s.font, s.id).toMatch(/^[A-Za-z0-9 ,'-]+$/);
      expect(
        shipped.some((f) => s.font?.includes(f)),
        `${s.id} font ${s.font}`
      ).toBe(true);
    }
  });

  it("keeps backdrops as plain file names under a media base, and The Office and Parks & Rec effect-only", () => {
    for (const s of SCENES) {
      if (!s.backdrop) continue;
      expect(s.backdrop.file, s.id).toMatch(/^[a-z]+\.mp4$/);
      expect(s.backdrop.poster, s.id).toMatch(/^[a-z]+\.jpg$/);
      expect(s.backdrop.opacity, s.id).toBeGreaterThan(0);
      expect(s.backdrop.opacity, s.id).toBeLessThanOrEqual(1);
    }
    // The Office and Parks & Rec are effect-only.
    expect(getScene("office").backdrop).toBeUndefined();
    expect(getScene("parks").backdrop).toBeUndefined();
  });
});

describe("lookups", () => {
  it("accepts registered ids and rejects everything else", () => {
    for (const s of SCENES) expect(isSceneId(s.id)).toBe(true);
    for (const bad of ["darth-vader", "the-office", "Classic", "", "constructor", "__proto__", 4, null, undefined]) {
      expect(isSceneId(bad)).toBe(false);
    }
  });

  it("falls back to the first scene for an unknown id", () => {
    expect(getScene("office").name).toBe("The Office");
    expect(getScene("nope" as never).id).toBe("classic");
  });
});

describe("grouping for the picker", () => {
  it("lists Everyday, Adventure and Pop culture in that order, each with scenes", () => {
    const sections = scenesByGroup();
    expect(sections.map((s) => s.group.id)).toEqual(["everyday", "adventure", "pop-culture"]);
    expect(sections.map((s) => s.group.label)).toEqual(["Everyday", "Adventure", "Pop culture"]);
    for (const section of sections) expect(section.scenes.length).toBeGreaterThan(0);
    expect(sections.flatMap((s) => s.scenes)).toHaveLength(SCENES.length);
  });

  it("carries the unofficial-tribute note on the pop-culture group only", () => {
    const notes = SCENE_GROUPS.filter((g) => g.note);
    expect(notes.map((g) => g.id)).toEqual(["pop-culture"]);
    expect(notes[0].note).toMatch(/unofficial/i);
    expect(notes[0].note).toMatch(/not affiliated/i);
  });
});

describe("AI description", () => {
  it("lists every scene so the model can pick it", () => {
    const text = sceneDescription();
    for (const s of SCENES) expect(text).toContain(`- ${s.id}: `);
    expect(text.split("\n")).toHaveLength(SCENES.length);
  });

  it("names the show or character so a request can match it", () => {
    const text = sceneDescription();
    for (const needle of ["The Office", "Parks and Recreation", "Darth Vader", "Yoda", "Spider-Man"]) {
      expect(text).toContain(needle);
    }
  });

  it("suggests an accent for every scene except the default", () => {
    const lines = sceneDescription().split("\n");
    for (const s of SCENES) {
      const line = lines.find((l) => l.startsWith(`- ${s.id}: `)) ?? "";
      if (s.id === DEFAULT_SCENE_ID) expect(line).not.toContain("Suggested accent");
      else expect(line).toContain(`Suggested accent color ${s.accent}.`);
    }
  });
});
