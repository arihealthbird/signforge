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
 */
export function validateUrl(url: string | undefined | null): string {
  if (!url) return "";
  
  const trimmed = url.trim();
  
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
  if (!hasProtocol && !lowerUrl.includes(":")) {
    // Check if it looks like a domain
    if (trimmed.includes(".")) {
      return `https://${trimmed}`;
    }
    return trimmed;
  }
  
  return hasProtocol ? trimmed : "";
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
    "bannerUrl", "bannerLink", "calendarLink"
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
