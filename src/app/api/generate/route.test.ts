import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "./route";

/**
 * An empty body fails validation with a 400, after the rate limiter has run and
 * before anything reaches the AI, so these requests cost nothing.
 */
function post(headers: Record<string, string>) {
  return POST(
    new NextRequest("https://signforge.com/api/generate", {
      method: "POST",
      headers: { "content-type": "application/json", ...headers },
      body: "{}",
    })
  );
}

describe("POST /api/generate rate limiting", () => {
  beforeEach(() => {
    vi.stubEnv("VERCEL", "");
    vi.stubEnv("TRUSTED_IP_HEADER", "");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("throttles one address even when every request forges a different cf-connecting-ip", async () => {
    const statuses: number[] = [];
    for (let i = 1; i <= 14; i++) {
      const res = await post({ "x-real-ip": "203.0.113.50", "cf-connecting-ip": `198.51.100.${i}` });
      statuses.push(res.status);
    }
    // The first twelve are within the allowance (the empty body is rejected with a 400).
    expect(statuses.slice(0, 12).every((status) => status === 400)).toBe(true);
    expect(statuses.slice(12)).toEqual([429, 429]);
  });

  it("gives each visitor their own allowance", async () => {
    for (let i = 0; i < 12; i++) await post({ "x-real-ip": "203.0.113.60" });
    expect((await post({ "x-real-ip": "203.0.113.60" })).status).toBe(429);
    expect((await post({ "x-real-ip": "203.0.113.61" })).status).toBe(400);
  });

  it("on Vercel, keys the limit on the address Vercel sets, not on headers a visitor sends", async () => {
    vi.stubEnv("VERCEL", "1");
    const statuses: number[] = [];
    for (let i = 1; i <= 13; i++) {
      const res = await post({ "x-vercel-forwarded-for": "203.0.113.70", "cf-connecting-ip": `198.51.100.${i}` });
      statuses.push(res.status);
    }
    expect(statuses[12]).toBe(429);
  });
});
