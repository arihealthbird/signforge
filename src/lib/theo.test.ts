import { afterEach, describe, expect, it, vi } from "vitest";
import { THEO_DEFAULT_BASE_URL, TheoApiError, readTheoConfig, theoComplete, theoTranscribe } from "./theo";

const KEY = "theo_sk_not_a_real_key";
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

function stubFetch(result: Response | Error) {
  const fetchMock = vi.fn<typeof fetch>(async () => {
    if (result instanceof Error) throw result;
    return result;
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("readTheoConfig", () => {
  it("needs a key", () => {
    expect(() => readTheoConfig({})).toThrow("AI_NOT_CONFIGURED");
    expect(() => readTheoConfig({ THEO_API_KEY: "   " })).toThrow("AI_NOT_CONFIGURED");
  });

  it("defaults to the www host and the fast mode, and trims the key", () => {
    expect(readTheoConfig({ THEO_API_KEY: `  ${KEY}  ` })).toEqual({
      apiKey: KEY,
      baseUrl: THEO_DEFAULT_BASE_URL,
      mode: "fast",
    });
  });

  it("accepts a base URL override, drops the trailing slash and keeps a path prefix", () => {
    const config = readTheoConfig({ THEO_API_KEY: KEY, THEO_BASE_URL: "https://gateway.example.com/theo/" });
    expect(config.baseUrl).toBe("https://gateway.example.com/theo");
  });

  it("always talks to www, because the apex redirect drops the Authorization header", () => {
    const config = readTheoConfig({ THEO_API_KEY: KEY, THEO_BASE_URL: "https://hitheo.ai" });
    expect(config.baseUrl).toBe("https://www.hitheo.ai");
  });

  it("only accepts https URLs, so the key never travels in the clear", () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    for (const bad of ["http://www.hitheo.ai", "ftp://files.example.com", "not a url"]) {
      expect(() => readTheoConfig({ THEO_API_KEY: KEY, THEO_BASE_URL: bad }), bad).toThrow("AI_NOT_CONFIGURED");
    }
    expect(log).toHaveBeenCalled();
    expect(JSON.stringify(log.mock.calls)).not.toContain(KEY);
  });

  it("reads the mode, ignoring case, and falls back on anything it does not know", () => {
    expect(readTheoConfig({ THEO_API_KEY: KEY, THEO_MODE: "THINK" }).mode).toBe("think");
    expect(readTheoConfig({ THEO_API_KEY: KEY, THEO_MODE: "image" }).mode).toBe("fast");
    expect(readTheoConfig({ THEO_API_KEY: KEY, THEO_MODE: "" }).mode).toBe("fast");
  });
});

describe("theoComplete", () => {
  const config = () => readTheoConfig({ THEO_API_KEY: KEY });

  it("posts one stateless completion with SignForge's own persona", async () => {
    const fetchMock = stubFetch(reply({ content: "{}" }));
    const controller = new AbortController();

    await theoComplete({ ...input, signal: controller.signal }, config());

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://www.hitheo.ai/api/v1/completions");
    expect(init?.method).toBe("POST");
    expect(init?.signal).toBe(controller.signal);

    const headers = init?.headers as Record<string, string>;
    expect(headers.Authorization).toBe(`Bearer ${KEY}`);
    expect(headers["Content-Type"]).toBe("application/json");
    expect(headers["User-Agent"]).toMatch(/^SignForge /);

    // Exactly these fields: no conversation id, tools or skills.
    expect(JSON.parse(String(init?.body))).toEqual({
      prompt: "hello",
      mode: "fast",
      persona: { system_prompt: "You design email signatures." },
      temperature: 0.6,
      max_iterations: 1,
    });
  });

  it("sends the configured mode", async () => {
    const fetchMock = stubFetch(reply({ content: "{}" }));
    await theoComplete(input, readTheoConfig({ THEO_API_KEY: KEY, THEO_MODE: "think" }));
    expect(JSON.parse(String(fetchMock.mock.calls[0][1]?.body)).mode).toBe("think");
  });

  it("returns the generated text", async () => {
    stubFetch(reply({ id: "cmpl_1", object: "completion", content: '{"fullName":"Jane"}' }));
    await expect(theoComplete(input, config())).resolves.toBe('{"fullName":"Jane"}');
  });

  it("returns an empty string when the reply has no text", async () => {
    stubFetch(reply({ id: "cmpl_1" }));
    await expect(theoComplete(input, config())).resolves.toBe("");
    stubFetch(reply({ content: 42 }));
    await expect(theoComplete(input, config())).resolves.toBe("");
  });

  it("raises a TheoApiError carrying the code and request id from Theo's error envelope", async () => {
    stubFetch(
      reply(
        {
          error: {
            message: "Invalid or revoked API key.",
            type: "authentication_error",
            code: "invalid_api_key",
            request_id: "req_abc123",
          },
        },
        { status: 401 }
      )
    );

    const error = await theoComplete(input, config()).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(TheoApiError);
    expect(error).toMatchObject({ status: 401, code: "invalid_api_key", requestId: "req_abc123" });
    expect(String((error as Error).message)).not.toContain(KEY);
  });

  it("falls back to the X-Request-Id header when the error body is not JSON", async () => {
    stubFetch(new Response("<html>Bad gateway</html>", { status: 502, headers: { "x-request-id": "req_header" } }));
    const error = await theoComplete(input, config()).catch((e: unknown) => e);
    expect(error).toMatchObject({ status: 502, code: null, requestId: "req_header" });
  });

  it("reports an unreachable Theo as status 0", async () => {
    stubFetch(new TypeError("fetch failed"));
    const error = await theoComplete(input, config()).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(TheoApiError);
    expect(error).toMatchObject({ status: 0, code: "network_error" });
  });

  it("lets an abort through untouched so the caller can time out", async () => {
    const abort = new DOMException("The operation was aborted.", "AbortError");
    stubFetch(abort);
    await expect(theoComplete(input, config())).rejects.toBe(abort);
  });

  it("forwards image attachments as image_base64", async () => {
    const fetchMock = stubFetch(reply({ content: "{}" }));
    await theoComplete(
      {
        ...input,
        attachments: [
          { data: "QUJDRA==", mimeType: "image/png" },
          { data: "eHl6", mimeType: "image/webp" },
        ],
      },
      config()
    );
    expect(JSON.parse(String(fetchMock.mock.calls[0][1]?.body)).attachments).toEqual([
      { type: "image_base64", data: "QUJDRA==", mime_type: "image/png" },
      { type: "image_base64", data: "eHl6", mime_type: "image/webp" },
    ]);
  });

  it("omits attachments when none are supplied", async () => {
    const fetchMock = stubFetch(reply({ content: "{}" }));
    await theoComplete(input, config());
    expect(JSON.parse(String(fetchMock.mock.calls[0][1]?.body)).attachments).toBeUndefined();
  });
});

describe("theoTranscribe", () => {
  const config = () => readTheoConfig({ THEO_API_KEY: KEY });

  it("uploads one multipart audio file and returns the transcript", async () => {
    const fetchMock = stubFetch(reply({ text: "build me a signature" }));

    await expect(
      theoTranscribe(new Blob(["audio"]), { filename: "recording.webm", language: "en" }, config())
    ).resolves.toBe("build me a signature");

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://www.hitheo.ai/api/v1/audio/stt");
    expect(init?.method).toBe("POST");
    const headers = init?.headers as Record<string, string>;
    expect(headers.Authorization).toBe(`Bearer ${KEY}`);
    expect(headers["Content-Type"]).toBeUndefined(); // FormData supplies the boundary

    const form = init?.body as FormData;
    expect(form.get("language")).toBe("en");
    const uploaded = form.get("file") as File;
    expect(uploaded.name).toBe("recording.webm");
  });

  it("raises a TheoApiError on failure and returns an empty string when there is no transcript", async () => {
    stubFetch(reply({ error: { code: "invalid_api_key", request_id: "req_x" } }, { status: 401 }));
    await expect(theoTranscribe(new Blob(["audio"]), {}, config())).rejects.toMatchObject({ status: 401 });

    stubFetch(reply({}));
    await expect(theoTranscribe(new Blob(["audio"]), {}, config())).resolves.toBe("");
  });
});
