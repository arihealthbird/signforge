import { describe, expect, it } from "vitest";
import nextConfig from "../next.config";

/** The static security headers every response carries (the CSP is built per request in proxy.ts). */
async function staticHeaders(): Promise<Record<string, string>> {
  const rules = (await nextConfig.headers?.()) ?? [];
  return Object.fromEntries(rules.flatMap((rule) => rule.headers).map(({ key, value }) => [key, value]));
}

describe("static security headers", () => {
  it("lets this origin use the microphone, because browser voice input fails outright without it", async () => {
    const policy = (await staticHeaders())["Permissions-Policy"];
    expect(policy).toContain("microphone=(self)");
    expect(policy).not.toContain("microphone=()");
  });

  it("keeps the camera and geolocation switched off", async () => {
    const policy = (await staticHeaders())["Permissions-Policy"];
    expect(policy).toContain("camera=()");
    expect(policy).toContain("geolocation=()");
  });

  it("keeps the transport and framing protections", async () => {
    const headers = await staticHeaders();
    expect(headers["Strict-Transport-Security"]).toContain("max-age=63072000");
    expect(headers["X-Content-Type-Options"]).toBe("nosniff");
    expect(headers["X-Frame-Options"]).toBe("SAMEORIGIN");
  });
});
