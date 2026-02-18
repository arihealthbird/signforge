/**
 * Security utilities for input sanitization and validation
 */

/**
 * Escapes HTML special characters to prevent XSS attacks
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
  
  return str.replace(/[&<>"'/]/g, (char) => htmlEscapes[char] || char);
}

/**
 * Validates a URL to ensure it's safe to use in href attributes
 * Blocks javascript:, data:, and vbscript: protocols
 * Strips null bytes and unicode direction overrides
 * Blocks private/internal IPs
 */
export function validateUrl(url: string | undefined | null): string {
  if (!url) return "";
  
  // Strip null bytes and unicode direction override characters
  const cleaned = url.replace(/[\x00\u200E\u200F\u202A-\u202E\u2066-\u2069]/g, "");
  const trimmed = cleaned.trim();
  
  if (!trimmed) return "";
  
  // Enforce URL length limit
  if (trimmed.length > 2048) return "";
  
  // Check for dangerous protocols
  const lowerUrl = trimmed.toLowerCase();
  const dangerousProtocols = ["javascript:", "data:", "vbscript:", "file:"];
  
  for (const protocol of dangerousProtocols) {
    if (lowerUrl.startsWith(protocol)) {
      return "";
    }
  }
  
  // Allow http, https, mailto, tel protocols
  const safeProtocols = ["http://", "https://", "mailto:", "tel:"];
  const hasProtocol = safeProtocols.some((p) => lowerUrl.startsWith(p));
  
  // If no protocol, assume https for website URLs
  let result: string;
  if (!hasProtocol && !lowerUrl.includes(":")) {
    // Check if it looks like a domain
    if (trimmed.includes(".")) {
      result = `https://${trimmed}`;
    } else {
      return trimmed;
    }
  } else if (hasProtocol) {
    result = trimmed;
  } else {
    return "";
  }
  
  // Block private/internal IPs (SSRF prevention)
  if (isPrivateUrl(result)) return "";
  
  return result;
}

/**
 * Checks if a URL points to a private/internal IP address
 */
function isPrivateUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname;
    
    // Block localhost
    if (hostname === "localhost" || hostname === "[::1]") return true;
    
    // Block private IPv4 ranges
    const ipv4Match = hostname.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
    if (ipv4Match) {
      const [, a, b] = ipv4Match.map(Number);
      if (a === 127) return true;           // 127.0.0.0/8 loopback
      if (a === 10) return true;             // 10.0.0.0/8 private
      if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12 private
      if (a === 192 && b === 168) return true; // 192.168.0.0/16 private
      if (a === 169 && b === 254) return true; // 169.254.0.0/16 link-local
      if (a === 0) return true;              // 0.0.0.0/8
    }
    
    return false;
  } catch {
    return false;
  }
}

/**
 * Validates email format (basic validation)
 */
export function validateEmail(email: string | undefined | null): string {
  if (!email) return "";
  
  const trimmed = email.trim();
  // Basic email regex - not meant to be comprehensive, just a sanity check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  return emailRegex.test(trimmed) ? trimmed : "";
}

/**
 * Sanitizes a hex color value
 */
export function sanitizeColor(color: string | undefined | null): string {
  if (!color) return "#6366f1"; // Default color
  
  // Match valid hex colors (3, 4, 6, or 8 characters)
  const hexRegex = /^#([A-Fa-f0-9]{3,4}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/;
  
  return hexRegex.test(color) ? color : "#6366f1";
}

/**
 * Truncates a string to a maximum length
 */
export function truncate(str: string | undefined | null, maxLength: number): string {
  if (!str) return "";
  return str.length > maxLength ? str.slice(0, maxLength) : str;
}

/**
 * Simple in-memory rate limiter
 */
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000 // 1 minute
): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);
  
  // Clean up old entries periodically
  if (rateLimitMap.size > 10000) {
    for (const [key, value] of rateLimitMap.entries()) {
      if (value.resetTime < now) {
        rateLimitMap.delete(key);
      }
    }
  }
  
  if (!entry || entry.resetTime < now) {
    // Create new entry or reset expired one
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { allowed: true, remaining: maxRequests - 1, resetIn: windowMs };
  }
  
  if (entry.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetIn: entry.resetTime - now,
    };
  }
  
  entry.count++;
  return {
    allowed: true,
    remaining: maxRequests - entry.count,
    resetIn: entry.resetTime - now,
  };
}

/**
 * Validates file content against expected MIME type using magic bytes.
 * Returns true if the file's magic bytes match the claimed MIME type.
 */
export function validateFileMagicBytes(buffer: Buffer, mimeType: string): boolean {
  if (buffer.length < 12) return false;

  switch (mimeType) {
    case "image/jpeg":
      // JPEG: starts with FF D8 FF
      return buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF;

    case "image/png":
      // PNG: starts with 89 50 4E 47 0D 0A 1A 0A
      return (
        buffer[0] === 0x89 &&
        buffer[1] === 0x50 &&
        buffer[2] === 0x4E &&
        buffer[3] === 0x47
      );

    case "image/gif":
      // GIF: starts with 47 49 46 38 ("GIF8")
      return (
        buffer[0] === 0x47 &&
        buffer[1] === 0x49 &&
        buffer[2] === 0x46 &&
        buffer[3] === 0x38
      );

    case "image/webp":
      // WebP: starts with RIFF....WEBP
      return (
        buffer[0] === 0x52 && // R
        buffer[1] === 0x49 && // I
        buffer[2] === 0x46 && // F
        buffer[3] === 0x46 && // F
        buffer[8] === 0x57 && // W
        buffer[9] === 0x45 && // E
        buffer[10] === 0x42 && // B
        buffer[11] === 0x50    // P
      );

    default:
      return false;
  }
}

/**
 * Recursively strips dangerous prototype-pollution keys from an object.
 */
export function stripDangerousKeys<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") return obj;

  if (Array.isArray(obj)) {
    return obj.map(stripDangerousKeys) as T;
  }

  const DANGEROUS_KEYS = new Set(["__proto__", "constructor", "prototype"]);
  const cleaned: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    if (DANGEROUS_KEYS.has(key)) continue;
    cleaned[key] = stripDangerousKeys(value);
  }

  return cleaned as T;
}

/**
 * Sanitizes all URL and color fields in a signature data object.
 */
export function sanitizeSignatureFields(data: Record<string, unknown>): Record<string, unknown> {
  const urlFields = [
    "website", "logoUrl", "profilePhotoUrl", "bannerUrl",
    "bannerLink", "calendarLink", "gifBannerUrl",
  ];
  const colorFields = ["primaryColor", "secondaryColor"];

  const sanitized = { ...data };

  for (const field of urlFields) {
    if (typeof sanitized[field] === "string") {
      sanitized[field] = validateUrl(sanitized[field] as string);
    }
  }

  for (const field of colorFields) {
    if (typeof sanitized[field] === "string") {
      sanitized[field] = sanitizeColor(sanitized[field] as string);
    }
  }

  // Sanitize social link URLs
  if (Array.isArray(sanitized.socialLinks)) {
    sanitized.socialLinks = (sanitized.socialLinks as Array<{ platform: string; url: string }>).map(
      (link) => ({
        ...link,
        url: typeof link.url === "string" ? validateUrl(link.url) : "",
      })
    );
  }

  return sanitized;
}

/**
 * Verifies a Cloudflare Turnstile token server-side.
 * Returns true if verification succeeds or if Turnstile is not configured.
 */
export async function verifyTurnstileToken(token: string | null): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  
  // If Turnstile is not configured, skip verification (allow request)
  if (!secretKey) return true;

  // Skip verification in development mode (localhost testing)
  if (process.env.NODE_ENV === "development") return true;
  
  // If configured but no token provided, reject
  if (!token) return false;
  
  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: secretKey,
          response: token,
        }),
      }
    );
    
    const data = await response.json();
    return data.success === true;
  } catch {
    // On verification failure, reject the request
    return false;
  }
}

/**
 * Validates the structure of signature data from API requests
 */
export function validateSignatureData(data: unknown): boolean {
  if (!data || typeof data !== "object") return false;
  
  const obj = data as Record<string, unknown>;
  
  // Check that only expected fields are present with correct types
  const stringFields = [
    "fullName", "jobTitle", "company", "department", "email",
    "phone", "mobile", "fax", "address", "city", "state",
    "zipCode", "country", "website", "logoUrl", "profilePhotoUrl",
    "primaryColor", "secondaryColor", "fontFamily", "disclaimer",
    "bannerUrl", "bannerLink", "calendarLink", "gifBannerUrl"
  ];
  
  const numberFields = ["logoWidth", "profilePhotoSize", "fontSize"];
  
  for (const field of stringFields) {
    if (obj[field] !== undefined && typeof obj[field] !== "string") {
      return false;
    }
    // Check string length limits
    if (typeof obj[field] === "string" && (obj[field] as string).length > 5000) {
      return false;
    }
  }
  
  for (const field of numberFields) {
    if (obj[field] !== undefined && typeof obj[field] !== "number") {
      return false;
    }
  }
  
  // Validate socialLinks if present
  if (obj.socialLinks !== undefined) {
    if (!Array.isArray(obj.socialLinks)) return false;
    if (obj.socialLinks.length > 20) return false;
    
    const validPlatforms = ["linkedin", "twitter", "facebook", "instagram", "github", "youtube", "website"];
    for (const link of obj.socialLinks) {
      if (typeof link !== "object" || !link) return false;
      if (typeof link.platform !== "string" || !validPlatforms.includes(link.platform)) return false;
      if (typeof link.url !== "string" || link.url.length > 500) return false;
    }
  }
  
  return true;
}
