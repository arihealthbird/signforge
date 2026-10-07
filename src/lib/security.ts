/**
 * Security utilities for input sanitization and validation.
 *
 * Everything here is pure and framework-agnostic so it can be unit-tested and
 * reused by the API routes, the URL-sharing codec, and the HTML exporter.
 */

/**
 * Escapes text for use as HTML *content*. Signature data is stored raw and
 * escaped exactly once, at render time, so never call this on data you are
 * about to store.
 */
export function escapeHtml(str: string | undefined | null): string {
  if (!str) return "";
  const htmlEscapes: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
  };
  return str.replace(/[&<>"'\/]/g, (char) => htmlEscapes[char] ?? char);
}

/**
 * Escapes a value for use inside a double- or single-quoted HTML *attribute*
 * (href, src, ...). Unlike `escapeHtml` it leaves `/` alone so URLs stay
 * readable in the exported HTML source.
 */
export function escapeAttr(str: string | undefined | null): string {
  if (!str) return "";
  const attrEscapes: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
    "`": "&#96;",
  };
  return str.replace(/[&<>"'`]/g, (char) => attrEscapes[char] ?? char);
}

/**
 * Cleans free text coming from untrusted input (AI output, share links):
 * strips control characters, collapses whitespace, trims and length-limits.
 * It deliberately does NOT HTML-escape; escaping happens once at render time.
 */
export function cleanText(value: unknown, maxLength = 500): string {
  if (typeof value !== "string") return "";
  const stripped = value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u200E\u200F\u202A-\u202E\u2066-\u2069]/g, "");
  return truncate(stripped.replace(/[ \t]+/g, " ").trim(), maxLength);
}

/**
 * Validates and normalizes a URL for use in href/src attributes.
 * Blocks javascript:, data:, vbscript:, file: protocols and private IPs.
 */
export function validateUrl(url: string | undefined | null): string {
  if (!url) return "";

  const cleaned = url.replace(/[\x00\t\n\r\u200E\u200F\u202A-\u202E\u2066-\u2069]/g, "");
  const trimmed = cleaned.trim();
  if (!trimmed) return "";
  if (trimmed.length > 2048) return "";

  const lowerUrl = trimmed.toLowerCase();
  const dangerousProtocols = ["javascript:", "data:", "vbscript:", "file:"];
  for (const protocol of dangerousProtocols) {
    if (lowerUrl.startsWith(protocol)) return "";
  }

  const safeProtocols = ["http://", "https://", "mailto:", "tel:"];
  const hasProtocol = safeProtocols.some((p) => lowerUrl.startsWith(p));

  let result: string;
  if (!hasProtocol && !lowerUrl.includes(":")) {
    result = trimmed.includes(".") ? `https://${trimmed}` : trimmed;
  } else if (hasProtocol) {
    result = trimmed;
  } else {
    return "";
  }

  if (isPrivateUrl(result)) return "";
  return encodeUnsafeUrlChars(result);
}

const UNSAFE_URL_CHARS: Record<string, string> = {
  " ": "%20",
  '"': "%22",
  "'": "%27",
  "<": "%3C",
  ">": "%3E",
  "`": "%60",
  "\\": "%5C",
};

/**
 * Percent-encodes characters that could break out of an HTML attribute or
 * smuggle markup. A URL is data, never a place to open a new attribute.
 */
function encodeUnsafeUrlChars(url: string): string {
  return url.replace(/[ "'<>`\\]/g, (char) => UNSAFE_URL_CHARS[char] ?? char);
}

function isPrivateUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname;

    if (hostname === "localhost") return true;

    if (hostname.startsWith("[")) {
      const ipv6 = hostname.slice(1, -1).toLowerCase();
      if (ipv6 === "::1") return true;
      if (/^fe[89ab]/i.test(ipv6)) return true;
      if (/^f[cd]/i.test(ipv6)) return true;
      if (ipv6.startsWith("::ffff:")) {
        const ipv4Part = ipv6.slice(7);
        const ipv4Match = ipv4Part.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
        if (ipv4Match) {
          const [, a, b] = ipv4Match.map(Number);
          if (isPrivateIpv4(a, b)) return true;
        }
      }
    }

    const ipv4Match = hostname.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
    if (ipv4Match) {
      const [, a, b] = ipv4Match.map(Number);
      if (isPrivateIpv4(a, b)) return true;
    }

    return false;
  } catch {
    return false;
  }
}

function isPrivateIpv4(a: number, b: number): boolean {
  if (a === 127 || a === 10 || a === 0) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 169 && b === 254) return true;
  return false;
}

export function validateEmail(email: string | undefined | null): string {
  if (!email) return "";
  const trimmed = email.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) ? trimmed : "";
}

export function sanitizeColor(color: string | undefined | null): string {
  if (!color) return "#6366f1";
  const hexRegex = /^#([A-Fa-f0-9]{3,4}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/;
  return hexRegex.test(color) ? color : "#6366f1";
}

export function truncate(str: string | undefined | null, maxLength: number): string {
  if (!str) return "";
  return str.length > maxLength ? str.slice(0, maxLength) : str;
}

/**
 * In-memory sliding-window rate limiter (per-process).
 * Suitable for single-instance and serverless minimum-footprint deployments.
 */
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

export function checkRateLimit(
  identifier: string,
  maxRequests = 10,
  windowMs = 60000
): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  if (rateLimitMap.size > 10000) {
    for (const [key, value] of rateLimitMap.entries()) {
      if (value.resetTime < now) rateLimitMap.delete(key);
    }
  }

  if (!entry || entry.resetTime < now) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetIn: windowMs };
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetIn: entry.resetTime - now };
  }

  entry.count++;
  return {
    allowed: true,
    remaining: maxRequests - entry.count,
    resetIn: entry.resetTime - now,
  };
}

/** Recursively strips dangerous prototype-pollution keys from an object. */
export function stripDangerousKeys<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(stripDangerousKeys) as T;

  const DANGEROUS_KEYS = new Set(["__proto__", "constructor", "prototype"]);
  const cleaned: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    if (DANGEROUS_KEYS.has(key)) continue;
    cleaned[key] = stripDangerousKeys(value);
  }
  return cleaned as T;
}

const URL_FIELDS = [
  "website",
  "logoUrl",
  "profilePhotoUrl",
  "calendarLink",
  "bannerUrl",
  "bannerLink",
  "gifBannerUrl",
];
const COLOR_FIELDS = ["primaryColor", "secondaryColor", "textColor"];

/** Sanitizes all URL and color fields in a signature data object. */
export function sanitizeSignatureFields(data: Record<string, unknown>): Record<string, unknown> {
  const sanitized = { ...data };

  for (const field of URL_FIELDS) {
    if (typeof sanitized[field] === "string") {
      sanitized[field] = validateUrl(sanitized[field] as string);
    }
  }
  for (const field of COLOR_FIELDS) {
    if (typeof sanitized[field] === "string") {
      sanitized[field] = sanitizeColor(sanitized[field] as string);
    }
  }

  if (Array.isArray(sanitized.socialLinks)) {
    sanitized.socialLinks = (sanitized.socialLinks as Array<{ platform: string; url: string }>).map(
      (link) => ({ ...link, url: typeof link.url === "string" ? validateUrl(link.url) : "" })
    );
  }

  return sanitized;
}

const STRING_FIELDS = [
  "fullName", "jobTitle", "company", "department", "email", "phone",
  "website", "address", "city", "state", "zipCode", "country",
  "logoUrl", "profilePhotoUrl", "primaryColor", "secondaryColor",
  "textColor", "fontFamily", "disclaimer", "calendarLink",
  "bannerUrl", "bannerLink", "gifBannerUrl",
];

const ENUM_FIELDS: Record<string, string[]> = {
  dividerStyle: ["solid", "dashed", "dotted", "none"],
  photoShape: ["circle", "rounded", "square"],
  contentPadding: ["compact", "normal", "relaxed"],
};

const VALID_PLATFORMS = ["linkedin", "twitter", "facebook", "instagram", "github", "youtube", "tiktok", "website"];

/** Validates the structure of signature data from untrusted input. */
export function validateSignatureData(data: unknown): boolean {
  if (!data || typeof data !== "object") return false;
  const obj = data as Record<string, unknown>;

  for (const [field, allowed] of Object.entries(ENUM_FIELDS)) {
    if (obj[field] !== undefined) {
      if (typeof obj[field] !== "string" || !allowed.includes(obj[field] as string)) return false;
    }
  }

  for (const field of STRING_FIELDS) {
    if (obj[field] !== undefined && typeof obj[field] !== "string") return false;
    const maxLen = field === "disclaimer" ? 2000 : 500;
    if (typeof obj[field] === "string" && (obj[field] as string).length > maxLen) return false;
  }

  if (obj.fontSize !== undefined && typeof obj.fontSize !== "number") return false;
  if (obj.showMonogram !== undefined && typeof obj.showMonogram !== "boolean") return false;

  if (obj.socialLinks !== undefined) {
    if (!Array.isArray(obj.socialLinks)) return false;
    if (obj.socialLinks.length > 20) return false;
    for (const link of obj.socialLinks) {
      if (typeof link !== "object" || !link) return false;
      if (typeof link.platform !== "string" || !VALID_PLATFORMS.includes(link.platform)) return false;
      if (typeof link.url !== "string" || link.url.length > 500) return false;
    }
  }

  return true;
}
