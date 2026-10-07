import { describe, it, expect } from "vitest";
import {
  escapeHtml,
  escapeAttr,
  cleanText,
  validateUrl,
  validateEmail,
  sanitizeColor,
  sanitizeSignatureFields,
  truncate,
  validateSignatureData,
} from "./security";
import { DEFAULT_SIGNATURE_DATA } from "@/types/signature";

describe("escapeHtml", () => {
  it("escapes HTML-sensitive characters", () => {
    expect(escapeHtml(`<script>alert("x")</script>`)).toBe(
      "&lt;script&gt;alert(&quot;x&quot;)&lt;&#x2F;script&gt;"
    );
  });

  it("handles empty and nullish values", () => {
    expect(escapeHtml("")).toBe("");
    expect(escapeHtml(null)).toBe("");
    expect(escapeHtml(undefined)).toBe("");
  });
});

describe("escapeAttr", () => {
  it("escapes characters that could close or inject attributes", () => {
    expect(escapeAttr(`a"b'c<d>e&f`)).toBe("a&quot;b&#39;c&lt;d&gt;e&amp;f");
  });

  it("leaves slashes alone so URLs stay readable", () => {
    expect(escapeAttr("https://x.com/a/b?c=1&d=2")).toBe("https://x.com/a/b?c=1&amp;d=2");
  });

  it("handles empty and nullish values", () => {
    expect(escapeAttr("")).toBe("");
    expect(escapeAttr(null)).toBe("");
  });
});

describe("cleanText", () => {
  it("strips control characters, collapses spaces and trims", () => {
    expect(cleanText("  Jane\u0000   Doe \u202E ")).toBe("Jane Doe");
  });

  it("does not HTML-escape", () => {
    expect(cleanText("A & B")).toBe("A & B");
  });

  it("limits length and rejects non-strings", () => {
    expect(cleanText("abcdef", 3)).toBe("abc");
    expect(cleanText(42)).toBe("");
  });
});

describe("validateUrl", () => {
  it("percent-encodes characters that could break out of an attribute", () => {
    const out = validateUrl(`https://x.com/a" onerror="alert(1)`);
    expect(out).not.toContain('"');
    expect(out).not.toContain(" ");
    expect(out).toContain("%22");
    expect(validateUrl("https://x.com/it's")).toBe("https://x.com/it%27s");
    expect(validateUrl("https://x.com/<b>")).toBe("https://x.com/%3Cb%3E");
  });

  it("allows safe http/https URLs", () => {
    expect(validateUrl("https://example.com")).toBe("https://example.com");
    expect(validateUrl("http://example.com")).toBe("http://example.com");
  });

  it("prepends https to bare domains", () => {
    expect(validateUrl("example.com")).toBe("https://example.com");
  });

  it("blocks dangerous protocols", () => {
    expect(validateUrl("javascript:alert(1)")).toBe("");
    expect(validateUrl("data:text/html,<script>x</script>")).toBe("");
    expect(validateUrl("vbscript:x")).toBe("");
    expect(validateUrl("file:///etc/passwd")).toBe("");
  });

  it("blocks private network addresses", () => {
    expect(validateUrl("http://localhost")).toBe("");
    expect(validateUrl("http://127.0.0.1")).toBe("");
    expect(validateUrl("http://192.168.1.1")).toBe("");
    expect(validateUrl("http://10.0.0.1")).toBe("");
  });

  it("returns empty for empty input", () => {
    expect(validateUrl("")).toBe("");
    expect(validateUrl(null)).toBe("");
  });
});

describe("validateEmail", () => {
  it("accepts valid emails and rejects invalid ones", () => {
    expect(validateEmail("jane@acme.com")).toBe("jane@acme.com");
    expect(validateEmail("not-an-email")).toBe("");
    expect(validateEmail("")).toBe("");
  });
});

describe("sanitizeColor", () => {
  it("accepts valid hex colors", () => {
    expect(sanitizeColor("#6366f1")).toBe("#6366f1");
    expect(sanitizeColor("#fff")).toBe("#fff");
  });

  it("falls back to the default for invalid colors", () => {
    expect(sanitizeColor("red")).toBe("#6366f1");
    expect(sanitizeColor("url(x)")).toBe("#6366f1");
  });
});

describe("truncate", () => {
  it("truncates long strings", () => {
    expect(truncate("abcdef", 3)).toBe("abc");
    expect(truncate("abc", 3)).toBe("abc");
  });
});

describe("sanitizeSignatureFields", () => {
  it("sanitises the banner and GIF URL fields", () => {
    const out = sanitizeSignatureFields({
      bannerUrl: "javascript:alert(1)",
      bannerLink: "https://example.com/promo",
      gifBannerUrl: "data:image/gif;base64,AAAA",
    });
    expect(out.bannerUrl).toBe("");
    expect(out.bannerLink).toBe("https://example.com/promo");
    expect(out.gifBannerUrl).toBe("");
  });
});

describe("validateSignatureData", () => {
  it("accepts the default signature data", () => {
    expect(validateSignatureData(DEFAULT_SIGNATURE_DATA)).toBe(true);
  });

  it("accepts banner fields and rejects a non-boolean showMonogram", () => {
    expect(
      validateSignatureData({
        ...DEFAULT_SIGNATURE_DATA,
        gifBannerUrl: "https://media.giphy.com/media/x/giphy.gif",
        showMonogram: false,
      })
    ).toBe(true);
    expect(validateSignatureData({ ...DEFAULT_SIGNATURE_DATA, showMonogram: "yes" })).toBe(false);
  });

  it("rejects a non-object", () => {
    expect(validateSignatureData(null)).toBe(false);
    expect(validateSignatureData("x")).toBe(false);
  });

  it("rejects invalid social platforms", () => {
    expect(
      validateSignatureData({
        ...DEFAULT_SIGNATURE_DATA,
        socialLinks: [{ platform: "not-a-platform", url: "https://x.com" }],
      })
    ).toBe(false);
  });

  it("rejects wrong field types", () => {
    expect(validateSignatureData({ ...DEFAULT_SIGNATURE_DATA, fontSize: "14" })).toBe(false);
    expect(validateSignatureData({ ...DEFAULT_SIGNATURE_DATA, fullName: 123 })).toBe(false);
  });
});
