import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Source scans that keep the design system honest. They read every source file
 * under `src/` (tests excluded) and fail with the file and line of each hit.
 */

const SRC = fileURLToPath(new URL("..", import.meta.url));

interface SourceFile {
  rel: string;
  text: string;
}

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

const FILES: SourceFile[] = walk(SRC)
  .filter((f) => /\.(ts|tsx|css|svg)$/.test(f) && !/\.test\.tsx?$/.test(f))
  .map((f) => ({ rel: path.relative(SRC, f), text: fs.readFileSync(f, "utf8") }));

/** Every match of `pattern`, as "file:line: matched text". */
function hits(pattern: RegExp, files: SourceFile[] = FILES): string[] {
  const out: string[] = [];
  for (const { rel, text } of files) {
    text.split("\n").forEach((line, i) => {
      for (const m of line.matchAll(pattern)) out.push(`${rel}:${i + 1}: ${m[0]}`);
    });
  }
  return out;
}

// Emoji, symbols that render as emoji, and the joiners that build sequences.
const PICTOGRAPHIC = /[\p{Extended_Pictographic}\uFE0F\u200D]/gu;
// Legal marks are text, not pictures, and are the only allowed exceptions.
const ALLOWED_MARKS = new Set(["\u00A9", "\u00AE", "\u2122"]);

describe("source files", () => {
  it("finds the source tree", () => {
    expect(FILES.length).toBeGreaterThan(40);
    expect(FILES.some((f) => f.rel === path.join("components", "icons.tsx"))).toBe(true);
  });

  it("contains no emoji or pictographic characters", () => {
    const found = hits(PICTOGRAPHIC).filter((h) => !ALLOWED_MARKS.has(h.slice(h.lastIndexOf(": ") + 2)));
    expect(found).toEqual([]);
  });

  it("contains no em dashes (the rendered-copy rule applies to everything we write)", () => {
    expect(hits(/\u2014/g)).toEqual([]);
  });

  it("references no third-party font host", () => {
    expect(hits(/fontshare|fonts\.googleapis|fonts\.gstatic|use\.typekit|api\.fontshare/gi)).toEqual([]);
  });

  it("has dropped General Sans and Instrument Serif", () => {
    expect(hits(/general[- ]sans|instrument[- ]serif/gi)).toEqual([]);
  });
});

describe("icons", () => {
  it("are imported from lucide-react only by the registry", () => {
    const importers = FILES.filter((f) => /from\s+["']lucide-react["']/.test(f.text)).map((f) => f.rel);
    expect(importers).toEqual([path.join("components", "icons.tsx")]);
  });

  it("are never written inline as svg in components, except the brand marks and the registry", () => {
    const allowed = new Set([
      path.join("components", "icons.tsx"),
      path.join("components", "brand.tsx"),
      path.join("components", "forest-still.tsx"),
      path.join("app", "icon.svg"),
    ]);
    const offenders = FILES.filter(
      (f) => f.rel.startsWith("components") && /<svg[\s>]/.test(f.text) && !allowed.has(f.rel)
    ).map((f) => f.rel);
    expect(offenders).toEqual([]);
  });
});

describe("the TheoVex skin", () => {
  it("has retired the OpenCharts-era pieces", () => {
    const retired = /btn-lime|rainbow-ring|sparkle-btn|SparkleButton|lime-glow|--sf-angle|\bsf-backdrop\b/g;
    expect(hits(retired)).toEqual([]);
  });

  it("no longer uses the old grayscale-ramp and shadcn-style color utilities", () => {
    const old =
      /\b(?:bg|text|border|ring|fill|stroke|from|to|via)-(?:gs-(?:cloud|smoke|steel|space|graphite|arsenic|phantom)|card(?:-foreground)?|muted-foreground|popover|primary(?:-foreground)?|secondary|accent(?:-foreground)?)\b/g;
    expect(hits(old)).toEqual([]);
  });

  it("squares the shell and exempts only the signature", () => {
    const css = FILES.find((f) => f.rel === path.join("app", "globals.css"))?.text ?? "";
    expect(css).toMatch(/body :not\(\[data-skin\] \*\):not\(\[data-skin\]\)\s*\{\s*border-radius:\s*0 !important/);
    const wrappers = FILES.filter((f) => /data-skin=/.test(f.text)).map((f) => f.rel);
    expect(wrappers).toEqual([path.join("components", "signature-html.tsx")]);
  });

  it("injects signature HTML only through the data-skin wrapper", () => {
    const injectors = FILES.filter((f) => /dangerouslySetInnerHTML=\{\{/.test(f.text)).map((f) => f.rel).sort();
    // The wrapper, plus the theme init script in the root layout (a constant, not signature data).
    expect(injectors).toEqual([path.join("app", "layout.tsx"), path.join("components", "signature-html.tsx")]);
  });

  it("keeps the footer forest on the same canvas colors as the page", () => {
    const css = FILES.find((f) => f.rel === path.join("app", "globals.css"))?.text ?? "";
    const palettes = FILES.find((f) => f.rel === path.join("lib", "forest-palettes.ts"))?.text ?? "";
    // `[^}]` already spans newlines, so no dotAll flag is needed (the target is ES2017).
    const light = css.match(/:root\s*\{[^}]*?--canvas:\s*(#[0-9a-f]{6})/i)?.[1];
    const dark = css.match(/\.dark\s*\{[^}]*?--canvas:\s*(#[0-9a-f]{6})/i)?.[1];
    expect(light).toBeTruthy();
    expect(dark).toBeTruthy();
    expect(palettes).toContain(`fog: "${light}"`);
    expect(palettes).toContain(`fog: "${dark}"`);
  });
});
