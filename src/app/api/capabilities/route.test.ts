import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "./route";

beforeEach(() => {
  vi.stubEnv("THEO_API_KEY", "");
  vi.stubEnv("AI_API_KEY", "");
  vi.stubEnv("AI_BASE_URL", "");
  vi.stubEnv("AI_MODEL", "");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("GET /api/capabilities", () => {
  it("offers voice and images when Theo is the provider", async () => {
    vi.stubEnv("THEO_API_KEY", "theo_sk_not_a_real_key");
    const res = GET();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ voice: true, images: true });
  });

  it("offers neither with a text-only provider", async () => {
    vi.stubEnv("AI_API_KEY", "sk_not_a_real_key");
    vi.stubEnv("AI_BASE_URL", "https://llm.example.com/v1");
    vi.stubEnv("AI_MODEL", "some-model");
    expect(await GET().json()).toEqual({ voice: false, images: false });
  });

  it("offers neither when nothing is configured", async () => {
    expect(await GET().json()).toEqual({ voice: false, images: false });
  });

  it("is never cached, because a self-hosted container receives its keys at runtime", () => {
    expect(GET().headers.get("cache-control")).toBe("no-store");
  });

  it("reflects a change of environment between requests", async () => {
    expect(await GET().json()).toEqual({ voice: false, images: false });
    vi.stubEnv("THEO_API_KEY", "theo_sk_not_a_real_key");
    expect(await GET().json()).toEqual({ voice: true, images: true });
  });

  it("says nothing about which provider is in use", async () => {
    vi.stubEnv("AI_API_KEY", "sk_not_a_real_key");
    vi.stubEnv("AI_BASE_URL", "https://llm.example.com/v1");
    vi.stubEnv("AI_MODEL", "some-model");
    const body = JSON.stringify(await GET().json());
    expect(body).not.toContain("example");
    expect(Object.keys(JSON.parse(body)).sort()).toEqual(["images", "voice"]);
  });
});
