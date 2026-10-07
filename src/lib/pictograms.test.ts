import { describe, it, expect } from "vitest";
import { PICTOGRAMS, PICTOGRAM_NAMES, isPictogramName } from "./pictograms";

/** Emoji and other pictographic characters (plus the joiners that build them). */
const PICTOGRAPHIC = /[\p{Extended_Pictographic}\uFE0F\u200D]/u;

const COMMAND = /([MmLlHhVvCcSsQqTtAaZz])([^MmLlHhVvCcSsQqTtAaZz]*)/g;

interface Segment {
  cmd: string;
  nums: number[];
}

/** Splits SVG path data into commands and their numeric arguments. */
function parsePath(d: string): Segment[] {
  const out: Segment[] = [];
  for (const m of d.matchAll(COMMAND)) {
    const nums = (m[2].match(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi) ?? []).map(Number);
    out.push({ cmd: m[1], nums });
  }
  return out;
}

const allPaths = PICTOGRAM_NAMES.flatMap((name) => {
  const p = PICTOGRAMS[name] as { strokes: readonly string[]; solids?: readonly string[] };
  return [...p.strokes, ...(p.solids ?? [])].map((d) => ({ name, d }));
});

describe("pictograms", () => {
  it("ships a small, named set", () => {
    expect(PICTOGRAM_NAMES.length).toBeGreaterThanOrEqual(5);
    for (const name of PICTOGRAM_NAMES) {
      expect(name).toMatch(/^[a-z]+(?:-[a-z]+)*$/);
      expect(PICTOGRAMS[name].label.trim().length).toBeGreaterThan(0);
    }
  });

  it("draws every pictogram with at least one outline", () => {
    for (const name of PICTOGRAM_NAMES) {
      expect(PICTOGRAMS[name].strokes.length).toBeGreaterThan(0);
    }
  });

  it("only uses path commands and numbers, never markup", () => {
    for (const { name, d } of allPaths) {
      expect(d, name).toMatch(/^[MmLlHhVvCcSsQqTtAaZz0-9eE.,\-+\s]+$/);
      expect(d, name).not.toMatch(/[<>"']/);
    }
  });

  it("stays on the 24px grid", () => {
    for (const { name, d } of allPaths) {
      for (const { cmd, nums } of parsePath(d)) {
        const absolute = cmd === cmd.toUpperCase();
        for (const n of nums) {
          // Absolute coordinates sit inside the box; relative moves can never
          // be longer than the box either.
          if (absolute) expect(n, `${name}: ${d}`).toBeGreaterThanOrEqual(0);
          expect(Math.abs(n), `${name}: ${d}`).toBeLessThanOrEqual(24);
        }
      }
    }
  });

  it("starts every path with a move and closes filled details", () => {
    for (const name of PICTOGRAM_NAMES) {
      const p = PICTOGRAMS[name] as { strokes: readonly string[]; solids?: readonly string[] };
      for (const d of [...p.strokes, ...(p.solids ?? [])]) {
        expect(d, name).toMatch(/^M/);
      }
      for (const d of p.solids ?? []) {
        expect(d, `${name}: solids are filled, so they must be closed`).toMatch(/[zZ]\s*$/);
      }
    }
  });

  it("only transforms by rotation", () => {
    for (const name of PICTOGRAM_NAMES) {
      const p = PICTOGRAMS[name] as { transform?: string };
      if (p.transform) expect(p.transform, name).toMatch(/^rotate\(-?[\d.]+ [\d.]+ [\d.]+\)$/);
    }
  });

  it("contains no emoji or pictographic characters", () => {
    for (const name of PICTOGRAM_NAMES) {
      expect(name).not.toMatch(PICTOGRAPHIC);
      expect(PICTOGRAMS[name].label).not.toMatch(PICTOGRAPHIC);
    }
    for (const { name, d } of allPaths) expect(d, name).not.toMatch(PICTOGRAPHIC);
  });

  it("recognizes only its own names", () => {
    expect(isPictogramName("stapler")).toBe(true);
    expect(isPictogramName("waffle")).toBe(true);
    expect(isPictogramName("mail")).toBe(false);
    expect(isPictogramName("constructor")).toBe(false);
    expect(isPictogramName("__proto__")).toBe(false);
  });
});
