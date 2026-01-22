import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string";
import { SignatureData, DEFAULT_SIGNATURE_DATA } from "@/types/signature";
import { TemplateId } from "@/lib/templates";
import { EmailThemeId } from "@/lib/email-themes";

/**
 * Shared signature data structure
 * Contains all necessary information to recreate a signature design
 */
export interface SharedSignatureData {
  /** Version for future compatibility */
  v: number;
  /** Signature data (using short keys to minimize URL length) */
  s: SignatureData;
  /** Template ID */
  t: TemplateId;
  /** Email theme ID (optional) */
  e?: EmailThemeId;
  /** Timestamp when shared */
  ts: number;
}

/**
 * Encode signature data for URL sharing
 * Uses lz-string compression to minimize URL length
 */
export function encodeSignatureForShare(
  signatureData: SignatureData,
  templateId: TemplateId,
  emailTheme?: EmailThemeId
): string {
  const shareData: SharedSignatureData = {
    v: 1,
    s: signatureData,
    t: templateId,
    ts: Date.now(),
  };
  
  // Only include email theme if it's not the default
  if (emailTheme && emailTheme !== "professional") {
    shareData.e = emailTheme;
  }

  const jsonString = JSON.stringify(shareData);
  return compressToEncodedURIComponent(jsonString);
}

/**
 * Decode signature data from URL hash
 * Returns null if decoding fails or data is invalid
 */
export function decodeSignatureFromShare(encoded: string): SharedSignatureData | null {
  try {
    const decompressed = decompressFromEncodedURIComponent(encoded);
    if (!decompressed) return null;

    const parsed = JSON.parse(decompressed) as SharedSignatureData;
    
    // Validate structure
    if (
      typeof parsed.v !== "number" ||
      typeof parsed.s !== "object" ||
      typeof parsed.t !== "string" ||
      typeof parsed.ts !== "number"
    ) {
      return null;
    }

    // Ensure signature data has required fields
    const signatureData: SignatureData = {
      ...DEFAULT_SIGNATURE_DATA,
      ...parsed.s,
    };

    return {
      ...parsed,
      s: signatureData,
    };
  } catch (error) {
    console.error("Failed to decode shared signature:", error);
    return null;
  }
}

/**
 * Generate a shareable URL for a signature
 */
export function generateShareUrl(
  signatureData: SignatureData,
  templateId: TemplateId,
  emailTheme?: EmailThemeId
): string {
  const encoded = encodeSignatureForShare(signatureData, templateId, emailTheme);
  
  // Use window.location.origin in browser, fallback for SSR
  const baseUrl = typeof window !== "undefined" 
    ? window.location.origin 
    : "";
  
  return `${baseUrl}/?share=${encoded}`;
}

/**
 * Check if the current URL contains shared signature data
 */
export function getSharedDataFromUrl(): SharedSignatureData | null {
  if (typeof window === "undefined") return null;
  
  const urlParams = new URLSearchParams(window.location.search);
  const shareParam = urlParams.get("share");
  
  if (!shareParam) return null;
  
  return decodeSignatureFromShare(shareParam);
}

/**
 * Clear the share parameter from the URL without page reload
 */
export function clearShareFromUrl(): void {
  if (typeof window === "undefined") return;
  
  const url = new URL(window.location.href);
  url.searchParams.delete("share");
  
  window.history.replaceState({}, "", url.pathname + url.search);
}

/**
 * Calculate approximate URL length for share link
 */
export function estimateShareUrlLength(
  signatureData: SignatureData,
  templateId: TemplateId,
  emailTheme?: EmailThemeId
): number {
  const encoded = encodeSignatureForShare(signatureData, templateId, emailTheme);
  const baseUrl = typeof window !== "undefined" 
    ? window.location.origin 
    : "https://example.com";
  
  return `${baseUrl}/?share=${encoded}`.length;
}
