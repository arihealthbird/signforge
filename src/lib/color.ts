/**
 * Small colour helpers for UI chrome. They only accept 6-digit hex values (the
 * scene and brand registries are constants, and a test enforces the format).
 * Signature colours go through `sanitizeColor` in security.ts instead.
 */

const HEX6 = /^#[0-9a-fA-F]{6}$/;

export function isHex6(value: string): boolean {
  return HEX6.test(value);
}

/** WCAG relative luminance of a 6-digit hex colour, 0 (black) to 1 (white). */
export function hexLuminance(hex: string): number {
  const channel = (start: number) => {
    const v = parseInt(hex.slice(start, start + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
}

/** True for colours that need dark ink on top of them (neon, amber, cream). */
export function isBright(hex: string): boolean {
  return isHex6(hex) && hexLuminance(hex) > 0.45;
}
