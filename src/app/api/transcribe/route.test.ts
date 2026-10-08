import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "./route";

const KEY = "theo_sk_not_a_real_key";

interface Options {
  type?: string;
  size?: number;
  filename?: string;
  language?: string;
  withFile?: boolean;
  headers?: Record<string, string>;
}

function upload({ type = "audio/webm", size = 8, filename = "x.webm", language, withFile = true, headers = {} }: Options = {}) {
  const form = new FormData();
  if (withFile) form.append("file", new File([new Uint8Array(size).fill(1)], filename, { type }));
  if (language !== undefined) form.append("language", language);
  return new NextRequest("https://signforge.com/api/transcribe", { method: "POST", headers, body: form });
}

function stubTheo(response: Response = new Response(JSON.stringify({ text: "build me a signature" }), { status: 200 })) {
  const fetchMock = vi.fn<typeof fetch>(async () => response);
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

let nextIp = 0;
/** A fresh visitor per test, so the in-memory rate limiter never leaks between them. */
const visitor = () => ({ "x-real-ip": `203.0.113.${++nextIp}` });

beforeEach(() => {
  vi.stubEnv("VERCEL", "");
  vi.stubEnv("TRUSTED_IP_HEADER", "");
  vi.stubEnv("THEO_API_KEY", KEY);
  vi.stubEnv("THEO_BASE_URL", "");
  vi.stubEnv("AI_API_KEY", "");
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("POST /api/transcribe", () => {
  it("forwards one clean upload to Theo and returns the transcript", async () => {
    const fetchMock = stubTheo();

    const res = await POST(upload({ headers: visitor() }));

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ text: "build me a signature" });
    expect(fetchMock.mock.calls[0][0]).toBe("https://www.hitheo.ai/api/v1/audio/stt");
  });

  it("accepts the codec parameters browsers add to the type", async () => {
    stubTheo();
    const res = await POST(upload({ type: "audio/webm;codecs=opus", headers: visitor() }));
    expect(res.status).toBe(200);
  });

  it("names the upstream upload itself instead of passing on the visitor's filename", async () => {
    const fetchMock = stubTheo();
    await POST(upload({ type: "audio/mp4", filename: "../../etc/passwd", headers: visitor() }));
    const sent = (fetchMock.mock.calls[0][1]?.body as FormData).get("file") as File;
    expect(sent.name).toBe("recording.m4a");
  });

  it("reduces a regional language tag to the two letters Theo expects", async () => {
    const fetchMock = stubTheo();
    await POST(upload({ language: "en-US", headers: visitor() }));
    expect((fetchMock.mock.calls[0][1]?.body as FormData).get("language")).toBe("en");
  });

  it.each(["english", "e", "123", "en-", "../etc", ""])("drops the language %j instead of forwarding it", async (language) => {
    const fetchMock = stubTheo();
    await POST(upload({ language, headers: visitor() }));
    expect((fetchMock.mock.calls[0][1]?.body as FormData).get("language")).toBeNull();
  });

  it.each(["audio/ogg", "application/pdf", "text/html"])("rejects %s, which Theo does not document", async (type) => {
    const fetchMock = stubTheo();
    const res = await POST(upload({ type, headers: visitor() }));
    expect(res.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects a request with no file, and an empty one", async () => {
    const fetchMock = stubTheo();
    expect((await POST(upload({ withFile: false, headers: visitor() }))).status).toBe(400);
    expect((await POST(upload({ size: 0, headers: visitor() }))).status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("refuses an upload that declares itself too large, before reading it", async () => {
    const fetchMock = stubTheo();
    const res = await POST(upload({ headers: { ...visitor(), "content-length": String(50 * 1024 * 1024) } }));
    expect(res.status).toBe(413);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("refuses a file over 10 MB even when the request did not declare its length", async () => {
    const fetchMock = stubTheo();
    const res = await POST(upload({ size: 10 * 1024 * 1024 + 1, headers: visitor() }));
    expect(res.status).toBe(413);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("says so when there is no speech in the recording", async () => {
    stubTheo(new Response(JSON.stringify({ text: "   " }), { status: 200 }));
    expect((await POST(upload({ headers: visitor() }))).status).toBe(422);
  });
});

describe("POST /api/transcribe rate limiting", () => {
  it("keys the limit on the trusted address, not on a header a visitor can forge", async () => {
    const statuses: number[] = [];
    for (let i = 1; i <= 14; i++) {
      const res = await POST(
        upload({ withFile: false, headers: { "x-real-ip": "198.51.100.200", "cf-connecting-ip": `192.0.2.${i}` } })
      );
      statuses.push(res.status);
    }
    // Twelve are within the allowance (a missing file is a 400), then the limiter steps in.
    expect(statuses.slice(0, 12).every((status) => status === 400)).toBe(true);
    expect(statuses.slice(12)).toEqual([429, 429]);
  });

  it("is a separate allowance from /api/generate, per visitor", async () => {
    const headers = { "x-real-ip": "198.51.100.201" };
    for (let i = 0; i < 12; i++) await POST(upload({ withFile: false, headers }));
    expect((await POST(upload({ withFile: false, headers }))).status).toBe(429);
    expect((await POST(upload({ withFile: false, headers: { "x-real-ip": "198.51.100.202" } }))).status).toBe(400);
  });
});

describe("POST /api/transcribe without Theo", () => {
  it("is not configured without a Theo key, and never calls out", async () => {
    vi.stubEnv("THEO_API_KEY", "");
    const fetchMock = stubTheo();
    const res = await POST(upload({ headers: visitor() }));
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ error: "Voice is not configured." });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("does not offer voice through a text-only provider", async () => {
    vi.stubEnv("THEO_API_KEY", "");
    vi.stubEnv("AI_API_KEY", "sk_not_a_real_key");
    vi.stubEnv("AI_BASE_URL", "https://llm.example.com/v1");
    vi.stubEnv("AI_MODEL", "some-model");
    const fetchMock = stubTheo();
    expect((await POST(upload({ headers: visitor() }))).status).toBe(503);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("POST /api/transcribe when Theo fails", () => {
  it.each([
    [401, 503, "Voice is not configured."],
    [429, 429, "Voice service is busy. Please try again shortly."],
    [400, 422, "Could not transcribe that audio. Try again."],
    [500, 503, "Voice service is temporarily unavailable."],
  ])("turns a Theo %i into a %i", async (theoStatus, status, error) => {
    stubTheo(new Response(JSON.stringify({ error: { code: "example" } }), { status: theoStatus }));
    const res = await POST(upload({ headers: visitor() }));
    expect(res.status).toBe(status);
    expect(await res.json()).toEqual({ error });
  });
});
