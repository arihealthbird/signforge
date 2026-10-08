import { describe, expect, it } from "vitest";
import { describeProvider } from "./ai-provider";
import { aiPrivacySection, aiTermsSection } from "./legal-copy";

const theo = describeProvider({ THEO_API_KEY: "theo_sk_not_a_real_key" });
const custom = describeProvider({
  AI_API_KEY: "sk_not_a_real_key",
  AI_BASE_URL: "https://api.example.com/v1",
  AI_MODEL: "some-model",
  AI_PROVIDER_NAME: "Example AI",
  AI_PROVIDER_URL: "https://example.com",
});
const unnamed = describeProvider({
  AI_API_KEY: "sk_not_a_real_key",
  AI_BASE_URL: "https://api.example.com/v1",
  AI_MODEL: "some-model",
});
const none = describeProvider({});

const text = (section: { body: string[] }) => section.body.join("\n");

describe("the privacy policy's AI section", () => {
  it("names Theo and covers images and recordings when Theo is the provider", () => {
    const body = text(aiPrivacySection(theo));
    expect(body).toContain("Theo");
    expect(body).toContain("hitheo.ai");
    expect(body).toMatch(/reference image/i);
    expect(body).toMatch(/recording/i);
    expect(body).toContain("We do not store these requests.");
  });

  it("names the configured provider, with its URL, and never Theo", () => {
    const body = text(aiPrivacySection(custom));
    expect(body).toContain("Example AI (https://example.com)");
    expect(body).toContain("We do not store these requests.");
    expect(body).not.toMatch(/theo/i);
    expect(body).not.toContain("hitheo");
  });

  it("says that images and audio are not sent when the provider is text only", () => {
    expect(text(aiPrivacySection(custom))).toMatch(/images and voice dictation are switched off/i);
  });

  it("names the host when the operator gave no name, so it is never wrong about where text goes", () => {
    const body = text(aiPrivacySection(unnamed));
    expect(body).toContain("api.example.com");
    expect(body).not.toMatch(/theo/i);
  });

  it("claims no provider when none is configured", () => {
    const body = text(aiPrivacySection(none));
    expect(body).toMatch(/switched off/i);
    expect(body).not.toMatch(/theo|hitheo|example/i);
  });

  it("keeps the IP address and self-hosting notes where an AI provider is used", () => {
    for (const provider of [theo, custom]) {
      const body = text(aiPrivacySection(provider));
      expect(body).toContain("IP address");
      expect(body).toContain("self-host");
    }
  });
});

describe("the terms' AI section", () => {
  it("describes Theo, the configured provider, or no provider as appropriate", () => {
    expect(text(aiTermsSection(theo))).toContain("Theo");
    expect(text(aiTermsSection(custom))).toContain("Example AI");
    expect(text(aiTermsSection(custom))).not.toMatch(/theo/i);
    expect(text(aiTermsSection(none))).toMatch(/switched off/i);
  });

  it("always tells people to review what they export", () => {
    for (const provider of [theo, custom, none]) {
      expect(text(aiTermsSection(provider))).toContain("reviewing everything you export or share");
    }
  });
});

describe("every variant", () => {
  it("never opens a sentence with the provider's name, which may be a lower-case host name", () => {
    const lower = describeProvider({
      AI_API_KEY: "sk_not_a_real_key",
      AI_BASE_URL: "https://api.example.com/v1",
      AI_MODEL: "some-model",
      AI_PROVIDER_NAME: "example-llm",
    });
    for (const provider of [custom, unnamed, lower]) {
      const sentences = text(aiPrivacySection(provider)).split(/(?<=[.!?])\s+/);
      for (const sentence of sentences) {
        expect(sentence.startsWith(provider.name), sentence).toBe(false);
      }
    }
  });

  it("keeps to the house style: no em dashes, no markup", () => {
    for (const provider of [theo, custom, unnamed, none]) {
      for (const section of [aiPrivacySection(provider), aiTermsSection(provider)]) {
        const body = `${section.title}\n${text(section)}`;
        expect(body).not.toContain("\u2014");
        expect(body).not.toMatch(/[<>]/);
      }
    }
  });
});
