/**
 * Image attachments shared by the composer (client) and the API routes
 * (server). These helpers are pure and framework-agnostic, in the same style
 * as lib/security.ts, so they can be unit-tested and reused on both sides.
 *
 * An uploaded image is a visual *reference* for the AI: the model reads its
 * palette, typography mood and layout. It is never stored server-side and
 * never becomes a signature image URL.
 */

export const IMAGE_MIME_TYPES = ["image/png", "image/jpeg", "image/webp"] as const;
export type ImageMimeType = (typeof IMAGE_MIME_TYPES)[number];

/** The most reference images one request will accept. */
export const MAX_ATTACHMENTS = 3;

/**
 * Upper bound on the base64 payload accepted or forwarded (~1.5 MB of image).
 * The composer downscales to 1024px and compresses well below this before
 * sending; the server side re-checks the same bound.
 */
export const MAX_ATTACHMENT_CHARS = 2_000_000;

export interface ImageAttachment {
  /** Base64 image bytes, without a `data:` prefix. */
  data: string;
  mimeType: ImageMimeType;
}

export function isImageMimeType(value: unknown): value is ImageMimeType {
  return typeof value === "string" && (IMAGE_MIME_TYPES as readonly string[]).includes(value);
}

const BASE64_RE = /^[A-Za-z0-9+/]+={0,2}$/;

function isBase64ImageData(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length >= 16 &&
    value.length <= MAX_ATTACHMENT_CHARS &&
    BASE64_RE.test(value)
  );
}

/**
 * Maps untrusted request input onto clean, bounded attachments. Anything that
 * is not a whitelisted image type of a sane size is silently dropped, so junk
 * never reaches the model call.
 */
export function sanitizeAttachments(raw: unknown): ImageAttachment[] {
  if (!Array.isArray(raw)) return [];
  const out: ImageAttachment[] = [];
  for (const item of raw.slice(0, MAX_ATTACHMENTS)) {
    if (!item || typeof item !== "object") continue;
    const { data, mimeType } = item as Record<string, unknown>;
    if (isImageMimeType(mimeType) && isBase64ImageData(data)) {
      out.push({ data, mimeType });
    }
  }
  return out;
}