import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ICON_NAMES, ICON_STROKE, Icon, IconTile, isIconName } from "./icons";
import { PICTOGRAM_NAMES } from "@/lib/pictograms";
import { hexLuminance, isBright, isHex6 } from "@/lib/color";

const PICTOGRAPHIC = /[\p{Extended_Pictographic}\uFE0F\u200D]/u;

describe("icon registry", () => {
  it("has unique, kebab-case names and includes every pictogram", () => {
    expect(new Set(ICON_NAMES).size).toBe(ICON_NAMES.length);
    for (const name of ICON_NAMES) {
      expect(name).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(name).not.toMatch(PICTOGRAPHIC);
    }
    for (const name of PICTOGRAM_NAMES) expect(ICON_NAMES).toContain(name);
  });

  it("recognizes registered names and nothing else", () => {
    for (const name of ICON_NAMES) expect(isIconName(name)).toBe(true);
    expect(isIconName("")).toBe(false);
    expect(isIconName("🙂")).toBe(false);
    expect(isIconName("constructor")).toBe(false);
  });

  it("renders every icon as an svg with the shared stroke", () => {
    for (const name of ICON_NAMES) {
      const html = renderToStaticMarkup(createElement(Icon, { name, size: "md" }));
      expect(html, name).toContain("<svg");
      expect(html, name).toContain(`stroke-width="${ICON_STROKE}"`);
      expect(html, name).toContain('aria-hidden="true"');
      expect(html, name).not.toMatch(PICTOGRAPHIC);
    }
  });

  it("names an icon only when asked to", () => {
    const labelled = renderToStaticMarkup(createElement(Icon, { name: "mail", label: "Inbox" }));
    expect(labelled).toContain('role="img"');
    expect(labelled).toContain('aria-label="Inbox"');
    expect(labelled).not.toContain("aria-hidden");
  });

  it("sizes icons from a short list", () => {
    const sizes = { xs: 14, sm: 16, md: 18, lg: 20, xl: 24 } as const;
    for (const [size, px] of Object.entries(sizes)) {
      const html = renderToStaticMarkup(
        createElement(Icon, { name: "check", size: size as keyof typeof sizes })
      );
      expect(html).toContain(`width="${px}"`);
      expect(html).toContain(`height="${px}"`);
    }
  });

  it("draws pictograms with their own paths, solids unstroked", () => {
    const waffle = renderToStaticMarkup(createElement(Icon, { name: "waffle" }));
    expect(waffle).toContain('viewBox="0 0 24 24"');
    expect(waffle).toContain('fill="currentColor" stroke="none"');
    const hilt = renderToStaticMarkup(createElement(Icon, { name: "saber-hilt" }));
    expect(hilt).toContain('fill="currentColor" stroke="none"');
  });
});

describe("IconTile", () => {
  it("gives bright tints an ink glyph so they read on a light surface", () => {
    const html = renderToStaticMarkup(createElement(IconTile, { name: "mail", tint: "#d4ff00" }));
    expect(html).toContain("color:var(--ink)");
    expect(html).toContain("color-mix(in srgb, #d4ff00");
  });

  it("colors darker tints and mixes in ink so they also hold on the dark canvas", () => {
    const html = renderToStaticMarkup(createElement(IconTile, { name: "ship", tint: "#5a7c4c" }));
    expect(html).toContain("color:color-mix(in srgb, #5a7c4c 72%, var(--ink))");
  });

  it("is a square tile in the requested size", () => {
    for (const [size, box] of [
      ["xs", "size-6"],
      ["sm", "size-8"],
      ["md", "size-10"],
      ["lg", "size-12"],
      ["xl", "size-16"],
    ] as const) {
      const html = renderToStaticMarkup(createElement(IconTile, { name: "mail", tint: "#2d6bff", size }));
      expect(html).toContain(box);
    }
  });
});

describe("color helpers", () => {
  it("accepts only 6-digit hex", () => {
    expect(isHex6("#d4ff00")).toBe(true);
    expect(isHex6("#D4FF00")).toBe(true);
    expect(isHex6("#fff")).toBe(false);
    expect(isHex6("d4ff00")).toBe(false);
    expect(isHex6("red")).toBe(false);
  });

  it("measures luminance and flags bright colors", () => {
    expect(hexLuminance("#000000")).toBeCloseTo(0, 5);
    expect(hexLuminance("#ffffff")).toBeCloseTo(1, 5);
    expect(isBright("#d4ff00")).toBe(true);
    expect(isBright("#fbbf24")).toBe(true);
    // Goldenrod sits just under the threshold: its glyph is the accent mixed with ink.
    expect(isBright("#daa520")).toBe(false);
    expect(isBright("#1e3a8a")).toBe(false);
    expect(isBright("not-a-color")).toBe(false);
  });
});
