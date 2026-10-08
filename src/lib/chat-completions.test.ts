import { afterEach, describe, expect, it, vi } from "vitest";
import { AiApiError, CHAT_MAX_TOKENS, chatComplete, readChatCompletionsConfig } from "./chat-completions";
import { ProviderError } from "./provider-error";

const KEY = "sk_not_a_real_key";
const ENV = { AI_API_KEY: KEY, AI_BASE_URL: "https://llm.example.com/v1", AI_MODEL: "some-model" };
const input = { prompt: "hello", persona: "You design email signatures.", temperature: 0.6 };

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function reply(body: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "content-type": "application/json" },
    ...init,
  });
}

const completion = (message: Record<string, unknown>) => ({ choices: [{ index: 0, message }] });

function stubFetch(result: Response | Error) {
  const fetchMock = vi.fn<typeof fetch>(async () => {
    if (result instanceof Error) throw result;
    return result;
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("readChatCompletionsConfig", () => {
  it("needs a key, and says nothing about it when there is none", () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => readChatCompletionsConfig({})).toThrow("AI_NOT_CONFIGURED");
    expect(() => readChatCompletionsConfig({ ...ENV, AI_API_KEY: "   " })).toThrow("AI_NOT_CONFIGURED");
    expect(log).not.toHaveBeenCalled();
  });

  it("needs a base URL and a model, and names the missing one without printing any value", () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => readChatCompletionsConfig({ ...ENV, AI_BASE_URL: "" })).toThrow("AI_NOT_CONFIGURED");
    expect(String(log.mock.calls[0][0])).toContain("AI_BASE_URL");

    expect(() => readChatCompletionsConfig({ ...ENV, AI_MODEL: " " })).toThrow("AI_NOT_CONFIGURED");
    expect(String(log.mock.calls[1][0])).toContain("AI_MODEL");

    expect(JSON.stringify(log.mock.calls)).not.toContain(KEY);
  });

  it("trims every value, drops the trailing slash and keeps a path prefix", () => {
    expect(
      readChatCompletionsConfig({
        AI_API_KEY: `  ${KEY}  `,
        AI_BASE_URL: "  https://llm.example.com/v1/  ",
        AI_MODEL: "  some-model  ",
      })
    ).toEqual({ apiKey: KEY, baseUrl: "https://llm.example.com/v1", model: "some-model", extraBody: {} });
  });

  it("accepts a bare origin", () => {
    expect(readChatCompletionsConfig({ ...ENV, AI_BASE_URL: "https://llm.example.com" }).baseUrl).toBe(
      "https://llm.example.com"
    );
  });

  it("only accepts https URLs without credentials, so the key never travels in the clear", () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    for (const bad of [
      "http://llm.example.com/v1",
      "ftp://files.example.com",
      "not a url",
      "https://user:secret@llm.example.com/v1",
    ]) {
      expect(() => readChatCompletionsConfig({ ...ENV, AI_BASE_URL: bad }), bad).toThrow("AI_NOT_CONFIGURED");
    }
    expect(log).toHaveBeenCalled();
    const logged = JSON.stringify(log.mock.calls);
    expect(logged).not.toContain(KEY);
    expect(logged).not.toContain("secret");
  });

  describe("AI_EXTRA_BODY", () => {
    const withExtra = (value: string) => readChatCompletionsConfig({ ...ENV, AI_EXTRA_BODY: value });

    it("adds nothing by default", () => {
      expect(readChatCompletionsConfig(ENV).extraBody).toEqual({});
      expect(withExtra("   ").extraBody).toEqual({});
    });

    it("reads a JSON object, nested fields included", () => {
      expect(withExtra('  {"thinking":{"type":"disabled"},"top_p":0.9}  ').extraBody).toEqual({
        thinking: { type: "disabled" },
        top_p: 0.9,
      });
    });

    it.each([["not json"], ["{broken"], ["[1,2]"], ["null"], ['"text"'], ["42"]])(
      "fails closed on %s",
      (bad) => {
        const log = vi.spyOn(console, "error").mockImplementation(() => {});
        expect(() => withExtra(bad)).toThrow("AI_NOT_CONFIGURED");
        expect(String(log.mock.calls[0][0])).toContain("AI_EXTRA_BODY");
      }
    );

    it("never prints the value it was given", () => {
      const log = vi.spyOn(console, "error").mockImplementation(() => {});
      expect(() => withExtra('{"token": "hush-hush-value", oops')).toThrow("AI_NOT_CONFIGURED");
      expect(() => withExtra('{"token": "hush-hush-value", "model": "x"}')).toThrow("AI_NOT_CONFIGURED");
      expect(JSON.stringify(log.mock.calls)).not.toContain("hush-hush-value");
    });

    it.each(["model", "messages", "stream", "temperature", "max_tokens"])(
      "refuses to replace %s, which SignForge controls",
      (field) => {
        const log = vi.spyOn(console, "error").mockImplementation(() => {});
        expect(() => withExtra(JSON.stringify({ thinking: {}, [field]: 1 }))).toThrow("AI_NOT_CONFIGURED");
        expect(String(log.mock.calls[0][0])).toContain(field);
      }
    );
  });
});

describe("chatComplete", () => {
  const config = () => readChatCompletionsConfig(ENV);

  it("posts one stateless completion: a system message with the persona and a user message", async () => {
    const fetchMock = stubFetch(reply(completion({ role: "assistant", content: "{}" })));
    const controller = new AbortController();

    await chatComplete({ ...input, signal: controller.signal }, config());

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://llm.example.com/v1/chat/completions");
    expect(init?.method).toBe("POST");
    expect(init?.signal).toBe(controller.signal);

    const headers = init?.headers as Record<string, string>;
    expect(headers.Authorization).toBe(`Bearer ${KEY}`);
    expect(headers["Content-Type"]).toBe("application/json");
    expect(headers["User-Agent"]).toMatch(/^SignForge /);

    // Exactly these fields: no tools, no conversation, no response format.
    expect(JSON.parse(String(init?.body))).toEqual({
      model: "some-model",
      messages: [
        { role: "system", content: "You design email signatures." },
        { role: "user", content: "hello" },
      ],
      temperature: 0.6,
      max_tokens: CHAT_MAX_TOKENS,
    });
  });

  it("leaves temperature out when none is given", async () => {
    const fetchMock = stubFetch(reply(completion({ content: "{}" })));
    await chatComplete({ prompt: "hello", persona: "p" }, config());
    expect(JSON.parse(String(fetchMock.mock.calls[0][1]?.body))).not.toHaveProperty("temperature");
  });

  it("adds the operator's extra fields to the request", async () => {
    const fetchMock = stubFetch(reply(completion({ content: "{}" })));
    const extra = readChatCompletionsConfig({ ...ENV, AI_EXTRA_BODY: '{"thinking":{"type":"disabled"}}' });

    await chatComplete(input, extra);

    expect(JSON.parse(String(fetchMock.mock.calls[0][1]?.body))).toMatchObject({
      model: "some-model",
      thinking: { type: "disabled" },
      max_tokens: CHAT_MAX_TOKENS,
    });
  });

  it("keeps the fields it controls even if a hand-built config carries conflicting extras", async () => {
    const fetchMock = stubFetch(reply(completion({ content: "{}" })));

    await chatComplete(input, {
      ...config(),
      extraBody: { model: "other", messages: [], max_tokens: 1, temperature: 2, thinking: { type: "disabled" } },
    });

    const body = JSON.parse(String(fetchMock.mock.calls[0][1]?.body));
    expect(body.model).toBe("some-model");
    expect(body.messages).toHaveLength(2);
    expect(body.max_tokens).toBe(CHAT_MAX_TOKENS);
    expect(body.temperature).toBe(0.6);
    expect(body.thinking).toEqual({ type: "disabled" });
  });

  it("returns the message content", async () => {
    stubFetch(reply(completion({ role: "assistant", content: '{"fullName":"Jane"}' })));
    await expect(chatComplete(input, config())).resolves.toBe('{"fullName":"Jane"}');
  });

  it("falls back to reasoning_content when a reasoning model leaves content empty", async () => {
    stubFetch(reply(completion({ content: "", reasoning_content: '{"fullName":"Jane"}' })));
    await expect(chatComplete(input, config())).resolves.toBe('{"fullName":"Jane"}');
  });

  it("prefers content over reasoning_content", async () => {
    stubFetch(reply(completion({ content: '{"fullName":"Final"}', reasoning_content: "thinking out loud" })));
    await expect(chatComplete(input, config())).resolves.toBe('{"fullName":"Final"}');
  });

  it("returns an empty string when the reply has no usable text", async () => {
    for (const body of [{}, { choices: [] }, { choices: [{}] }, completion({ content: 42 }), completion({ content: null })]) {
      stubFetch(reply(body));
      await expect(chatComplete(input, config()), JSON.stringify(body)).resolves.toBe("");
    }
  });

  it("sends text only, ignoring any attachments it is handed", async () => {
    const fetchMock = stubFetch(reply(completion({ content: "{}" })));
    await chatComplete(
      { ...input, attachments: [{ data: "QUJDRA==", mimeType: "image/png" }] } as Parameters<typeof chatComplete>[0],
      config()
    );
    expect(String(fetchMock.mock.calls[0][1]?.body)).not.toContain("QUJDRA==");
  });

  it.each([
    ["an OpenAI-style error", { error: { message: "nope", type: "invalid_request_error", code: "invalid_api_key" } }, "invalid_api_key"],
    ["an error with only a type", { error: { type: "rate_limit_error" } }, "rate_limit_error"],
    ["a flat reason", { code: 401, reason: "FAILED_TO_AUTH", message: "failed to authenticate API key" }, "FAILED_TO_AUTH"],
    ["an error with no code at all", { message: "boom" }, null],
  ])("raises an AiApiError from %s", async (_name, body, code) => {
    stubFetch(reply(body, { status: 401, headers: { "x-request-id": "req_42", "content-type": "application/json" } }));

    const error = await chatComplete(input, config()).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(AiApiError);
    expect(error).toBeInstanceOf(ProviderError);
    expect(error).toMatchObject({ provider: "custom", status: 401, code, requestId: "req_42" });
  });

  it("never copies the provider's message into the error, because some echo part of the key", async () => {
    stubFetch(reply({ error: { message: `Incorrect API key provided: ${KEY}`, code: "invalid_api_key" } }, { status: 401 }));
    const error = (await chatComplete(input, config()).catch((e: unknown) => e)) as Error;
    expect(error.message).not.toContain(KEY);
    expect(JSON.stringify(error)).not.toContain(KEY);
  });

  it("bounds the error code it keeps", async () => {
    stubFetch(reply({ error: { code: "x".repeat(500) } }, { status: 500 }));
    const error = (await chatComplete(input, config()).catch((e: unknown) => e)) as AiApiError;
    expect(error.code).toHaveLength(80);
  });

  it("copes with an error body that is not JSON", async () => {
    stubFetch(new Response("<html>Bad gateway</html>", { status: 502, headers: { "x-request-id": "req_header" } }));
    const error = await chatComplete(input, config()).catch((e: unknown) => e);
    expect(error).toMatchObject({ status: 502, code: null, requestId: "req_header" });
  });

  it("reports an unreachable provider as status 0", async () => {
    stubFetch(new TypeError("fetch failed"));
    const error = await chatComplete(input, config()).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(AiApiError);
    expect(error).toMatchObject({ status: 0, code: "network_error" });
  });

  it("lets an abort through untouched so the caller can time out", async () => {
    const abort = new DOMException("The operation was aborted.", "AbortError");
    stubFetch(abort);
    await expect(chatComplete(input, config())).rejects.toBe(abort);
  });
});
