import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { proxy, config } from "./proxy";

function csp(path = "/"): Record<string, string> {
  const res = proxy(new NextRequest(`https://signforge.com${path}`));
  const header = res.headers.get("Content-Security-Policy") ?? "";
  const out: Record<string, string> = {};
  for (const part of header.split(";")) {
    const [name, ...rest] = part.trim().split(/\s+/);
    if (name) out[name] = rest.join(" ");
  }
  return out;
}

describe("Content-Security-Policy", () => {
  it("is set on pages", () => {
    const policy = csp("/");
    expect(policy["default-src"]).toBe("'self'");
    expect(policy["object-src"]).toBe("'none'");
    expect(policy["frame-ancestors"]).toBe("'none'");
  });

  it("allows no third-party font or style hosts: every typeface is self-hosted", () => {
    const policy = csp("/");
    expect(policy["font-src"]).toBe("'self' data:");
    expect(policy["style-src"]).toBe("'self' 'unsafe-inline'");
    const whole = Object.values(policy).join(" ");
    expect(whole.toLowerCase()).not.toContain("fontshare");
    expect(whole.toLowerCase()).not.toContain("googleapis");
    expect(whole.toLowerCase()).not.toContain("gstatic");
  });

  it("still lets the GIF picker reach GIPHY and nothing else", () => {
    expect(csp("/")["connect-src"]).toBe("'self' https://api.giphy.com");
  });

  it("keeps media closed unless a scene media base is configured", () => {
    // NEXT_PUBLIC_SCENE_MEDIA_BASE is not set in the test environment.
    expect(csp("/")["media-src"]).toBe("'self' blob:");
  });

  it("sets a request id", () => {
    const res = proxy(new NextRequest("https://signforge.com/"));
    expect(res.headers.get("X-Request-ID")).toMatch(/^[0-9a-f-]{36}$/);
  });
});

describe("matcher", () => {
  it("skips static assets, fonts, images and the brand folder", () => {
    const [pattern] = config.matcher;
    for (const skipped of ["_next/static", "_next/image", "icon.svg", "fonts", "images", "brand"]) {
      expect(pattern).toContain(skipped);
    }
  });
});
