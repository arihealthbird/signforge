import { describe, it, expect } from "vitest";
import { compressToEncodedURIComponent } from "lz-string";
import { decodeSignatureFromShare, encodeSignatureForShare } from "./share";
import { DEFAULT_SIGNATURE_DATA, type SignatureData } from "@/types/signature";
import { DEFAULT_TEMPLATE_ID } from "./templates";

const data: SignatureData = {
  ...DEFAULT_SIGNATURE_DATA,
  fullName: "Zed Probe",
  jobTitle: "Chief Prober",
  company: "Probe Works",
  email: "zed@probe.example",
};

/** Builds a share payload by hand, the way an older release would have written it. */
const payload = (overrides: Record<string, unknown>) =>
  compressToEncodedURIComponent(JSON.stringify({ v: 1, s: data, t: "rail", ts: Date.now(), ...overrides }));

describe("share links", () => {
  it("round-trips a signature with a current template", () => {
    const shared = decodeSignatureFromShare(encodeSignatureForShare(data, "seal"));
    expect(shared?.t).toBe("seal");
    expect(shared?.s.fullName).toBe("Zed Probe");
  });

  it("opens a link from before the rebuild on the design that replaced its template", () => {
    expect(decodeSignatureFromShare(payload({ t: "creative-gradient" }))?.t).toBe("tint-panel");
    expect(decodeSignatureFromShare(payload({ t: "banner-cta" }))?.t).toBe("name-plate");
  });

  it("opens a link with an unknown template on the default design instead of dropping the signature", () => {
    const shared = decodeSignatureFromShare(payload({ t: "tech-developer" }));
    expect(shared?.t).toBe(DEFAULT_TEMPLATE_ID);
    expect(shared?.s.email).toBe("zed@probe.example");
  });

  it("still rejects a payload that is not a valid signature", () => {
    expect(decodeSignatureFromShare(payload({ s: { ...data, fontSize: "big" } }))).toBeNull();
    expect(decodeSignatureFromShare(payload({ t: 42 }))).toBeNull();
    expect(decodeSignatureFromShare("not a share link")).toBeNull();
  });

  it("does not let a hostile template id through to the renderer", () => {
    const shared = decodeSignatureFromShare(payload({ t: "__proto__" }));
    expect(shared?.t).toBe(DEFAULT_TEMPLATE_ID);
  });
});
