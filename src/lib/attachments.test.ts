import { describe, expect, it } from "vitest";
import { IMAGE_MIME_TYPES, MAX_ATTACHMENTS, isImageMimeType, sanitizeAttachments } from "./attachments";

const DATA = "aGVsbG8gd29ybGQ="; // base64("hello world"), 16 chars

describe("sanitizeAttachments", () => {
  it("keeps valid base64 images and drops junk", () => {
    expect(
      sanitizeAttachments([
        { data: DATA, mimeType: "image/png" },
        { data: DATA, mimeType: "image/webp" },
        { data: DATA, mimeType: "image/jpeg" },
        { data: DATA, mimeType: "text/html" }, // bad mime
        { data: "not base64!...", mimeType: "image/png" }, // bad data
        { data: "short", mimeType: "image/png" }, // too short
        42,
        null,
      ])
    ).toEqual([
      { data: DATA, mimeType: "image/png" },
      { data: DATA, mimeType: "image/webp" },
      { data: DATA, mimeType: "image/jpeg" },
    ]);
  });

  it("caps the number of attachments", () => {
    const many = Array.from({ length: MAX_ATTACHMENTS + 5 }, () => ({
      data: DATA,
      mimeType: "image/png",
    }));
    expect(sanitizeAttachments(many)).toHaveLength(MAX_ATTACHMENTS);
  });

  it("rejects non-arrays", () => {
    expect(sanitizeAttachments("nope")).toEqual([]);
    expect(sanitizeAttachments(undefined)).toEqual([]);
  });
});

describe("isImageMimeType", () => {
  it("accepts only the whitelisted image types", () => {
    for (const mime of IMAGE_MIME_TYPES) expect(isImageMimeType(mime)).toBe(true);
    expect(isImageMimeType("image/gif")).toBe(false);
    expect(isImageMimeType("text/html")).toBe(false);
    expect(isImageMimeType(undefined)).toBe(false);
  });
});