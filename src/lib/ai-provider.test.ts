import { afterEach, describe, expect, it, vi } from "vitest";
import { activeProvider, complete, describeProvider, getCapabilities } from "./ai-provider";

const THEO = { THEO_API_KEY: "theo_sk_not_a_real_key" };
const CUSTOM = { AI_API_KEY: "sk_not_a_real_key", AI_BASE_URL: "https://llm.example.com/v1", AI_MODEL: "some-model" };
const input = { prompt: "hello", persona: "You design email signatures." };

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function stubFetch(body: unknown) {
  const fetchMock = vi.fn<typeof fetch>(
    async () => new Response(JSON.stringify(body), { status: 200, headers: { "content-type": "application/json" } })
  );
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("activeProvider", () => {
  it("is Theo when its key is set", () => {
    expect(activeProvider(THEO)).toBe("theo");
  });

  it("is the chat completions provider when only AI_API_KEY is set", () => {
    expect(activeProvider(CUSTOM)).toBe("custom");
  });

  it("prefers Theo when both are set", () => {
    expect(activeProvider({ ...CUSTOM, ...THEO })).toBe("theo");
  });

  it("is none when no key is set, and a blank key does not count", () => {
    expect(activeProvider({})).toBeNull();
    expect(activeProvider({ THEO_API_KEY: "  ", AI_API_KEY: "" })).toBeNull();
  });

  it("never reads OPENAI_API_KEY", () => {
    expect(activeProvider({ OPENAI_API_KEY: "sk_not_a_real_key" })).toBeNull();
  });
});

describe("complete", () => {
  it("sends the request to Theo when Theo is configured", async () => {
    const fetchMock = stubFetch({ content: "from theo" });
    await expect(complete(input, THEO)).resolves.toBe("from theo");
    expect(fetchMock.mock.calls[0][0]).toBe("https://www.hitheo.ai/api/v1/completions");
  });

  it("sends the request to the chat completions provider otherwise", async () => {
    const fetchMock = stubFetch({ choices: [{ message: { content: "from the provider" } }] });
    await expect(complete(input, CUSTOM)).resolves.toBe("from the provider");
    expect(fetchMock.mock.calls[0][0]).toBe("https://llm.example.com/v1/chat/completions");
  });

  it("passes the operator's extra request fields to the chat completions provider", async () => {
    const fetchMock = stubFetch({ choices: [{ message: { content: "ok" } }] });
    await complete(input, { ...CUSTOM, AI_EXTRA_BODY: '{"thinking":{"type":"disabled"}}' });
    expect(JSON.parse(String(fetchMock.mock.calls[0][1]?.body)).thinking).toEqual({ type: "disabled" });
  });

  it("does not send the extra fields to Theo", async () => {
    const fetchMock = stubFetch({ content: "from theo" });
    await complete(input, { ...THEO, AI_EXTRA_BODY: '{"thinking":{"type":"disabled"}}' });
    expect(String(fetchMock.mock.calls[0][1]?.body)).not.toContain("thinking");
  });

  it("uses Theo, and only Theo, when both are configured", async () => {
    const fetchMock = stubFetch({ content: "from theo" });
    await complete(input, { ...CUSTOM, ...THEO });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(String(fetchMock.mock.calls[0][0])).toContain("hitheo.ai");
  });

  it("is not configured without a provider, and never calls out", async () => {
    const fetchMock = stubFetch({});
    await expect(complete(input, {})).rejects.toThrow("AI_NOT_CONFIGURED");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("is not configured when the chosen provider is only half set up", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const fetchMock = stubFetch({});
    await expect(complete(input, { AI_API_KEY: "sk_not_a_real_key" })).rejects.toThrow("AI_NOT_CONFIGURED");
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("getCapabilities", () => {
  it("offers voice and images with Theo", () => {
    expect(getCapabilities(THEO)).toEqual({ voice: true, images: true });
  });

  it("offers neither with a text-only provider", () => {
    expect(getCapabilities(CUSTOM)).toEqual({ voice: false, images: false });
  });

  it("offers neither when nothing is configured", () => {
    expect(getCapabilities({})).toEqual({ voice: false, images: false });
  });

  it("hands out a fresh object each time", () => {
    const first = getCapabilities({});
    first.voice = true;
    expect(getCapabilities({}).voice).toBe(false);
  });
});

describe("describeProvider", () => {
  it("describes Theo", () => {
    expect(describeProvider(THEO)).toEqual({ id: "theo", name: "Theo", url: "https://hitheo.ai" });
  });

  it("uses the name and URL the operator gives", () => {
    expect(
      describeProvider({ ...CUSTOM, AI_PROVIDER_NAME: "  Example   AI ", AI_PROVIDER_URL: "https://example.com/about?x=1" })
    ).toEqual({ id: "custom", name: "Example AI", url: "https://example.com" });
  });

  it("falls back to the host of the base URL, so the page is never wrong about where text goes", () => {
    expect(describeProvider(CUSTOM)).toEqual({ id: "custom", name: "llm.example.com", url: null });
  });

  it("ignores a provider URL that is not https", () => {
    expect(describeProvider({ ...CUSTOM, AI_PROVIDER_URL: "http://example.com" }).url).toBeNull();
    expect(describeProvider({ ...CUSTOM, AI_PROVIDER_URL: "javascript:alert(1)" }).url).toBeNull();
    expect(describeProvider({ ...CUSTOM, AI_PROVIDER_URL: "nonsense" }).url).toBeNull();
  });

  it("bounds the name", () => {
    expect(describeProvider({ ...CUSTOM, AI_PROVIDER_NAME: "a".repeat(300) }).name).toHaveLength(80);
  });

  it("describes nothing when no provider is configured", () => {
    expect(describeProvider({})).toEqual({ id: null, name: "", url: null });
  });

  it("says Theo even when the other provider is also configured, because Theo is the one used", () => {
    expect(describeProvider({ ...CUSTOM, ...THEO, AI_PROVIDER_NAME: "Example AI" }).id).toBe("theo");
  });
});
