import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string";
import { SignatureData, DEFAULT_SIGNATURE_DATA } from "@/types/signature";
import { DEFAULT_TEMPLATE_ID, resolveTemplateId, TemplateId } from "@/lib/templates";
import {
  stripDangerousKeys,
  validateSignatureData,
  sanitizeSignatureFields,
} from "@/lib/security";

const MAX_DECOMPRESSED_SIZE = 100 * 1024;

export interface SharedSignatureData {
  v: number;
  s: SignatureData;
  t: TemplateId;
  ts: number;
}

export function encodeSignatureForShare(
  signatureData: SignatureData,
  templateId: TemplateId
): string {
  const shareData: SharedSignatureData = {
    v: 1,
    s: signatureData,
    t: templateId,
    ts: Date.now(),
  };
  return compressToEncodedURIComponent(JSON.stringify(shareData));
}

export function decodeSignatureFromShare(encoded: string): SharedSignatureData | null {
  try {
    if (encoded.length > 50000) return null;

    const decompressed = decompressFromEncodedURIComponent(encoded);
    if (!decompressed) return null;
    if (decompressed.length > MAX_DECOMPRESSED_SIZE) return null;

    const parsed = stripDangerousKeys(JSON.parse(decompressed)) as SharedSignatureData;

    if (
      typeof parsed?.v !== "number" ||
      typeof parsed?.s !== "object" ||
      parsed.s === null ||
      typeof parsed?.t !== "string" ||
      typeof parsed?.ts !== "number"
    ) {
      return null;
    }

    if (!validateSignatureData(parsed.s)) return null;

    // A template id from before the catalog was rebuilt opens on its nearest design, and an
    // unknown one on the default, so a shared signature is never discarded over its template.
    const template = resolveTemplateId(parsed.t) ?? DEFAULT_TEMPLATE_ID;

    // Text is stored raw and escaped once at render time (signature-html.ts);
    // only URLs and colours are normalised here.
    const merged = { ...DEFAULT_SIGNATURE_DATA, ...parsed.s };
    const sanitized = sanitizeSignatureFields(merged as Record<string, unknown>);

    return { ...parsed, t: template, s: sanitized as unknown as SignatureData };
  } catch (error) {
    console.error("Failed to decode shared signature:", error);
    return null;
  }
}

export function generateShareUrl(
  signatureData: SignatureData,
  templateId: TemplateId
): string {
  const encoded = encodeSignatureForShare(signatureData, templateId);
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  return `${baseUrl}/?share=${encoded}`;
}

export function getSharedDataFromUrl(): SharedSignatureData | null {
  if (typeof window === "undefined") return null;
  const shareParam = new URLSearchParams(window.location.search).get("share");
  if (!shareParam) return null;
  return decodeSignatureFromShare(shareParam);
}

export function clearShareFromUrl(): void {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  url.searchParams.delete("share");
  window.history.replaceState({}, "", url.pathname + url.search);
}
