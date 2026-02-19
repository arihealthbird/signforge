import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import { checkRateLimit, validateFileMagicBytes } from "@/lib/security";

// Cloudflare R2 client (S3-compatible)
const R2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME || "signature-forge";
const PUBLIC_URL_BASE = process.env.R2_PUBLIC_URL || "";

// Allowed image types and max size (2MB)
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_FILE_SIZE = 2 * 1024 * 1024;
const MAX_REQUEST_SIZE = 3 * 1024 * 1024; // 3MB (file + formdata overhead)
const MAX_IMAGE_DIMENSION = 4096; // Max width or height in pixels
const MAX_GIF_FRAMES = 100; // Max frames in animated GIF

// Map MIME type to safe file extension (never trust user-provided extensions)
const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "image/webp": "webp",
};

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 20 uploads per minute
    // Priority: Cloudflare > reverse proxy > forwarded (least trusted) > fallback
    const clientIp =
      request.headers.get("cf-connecting-ip") ||
      request.headers.get("x-real-ip") ||
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "anonymous";

    const rateLimit = await checkRateLimit(`upload:${clientIp}`, 20, 60000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many uploads. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil(rateLimit.resetIn / 1000)),
          },
        }
      );
    }

    // Check request body size before parsing
    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > MAX_REQUEST_SIZE) {
      return NextResponse.json(
        { error: "Request too large" },
        { status: 413 }
      );
    }

    // Check if R2 is configured
    if (!process.env.R2_ENDPOINT || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
      return NextResponse.json(
        { error: "Image storage is not configured" },
        { status: 503 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: JPEG, PNG, GIF, WebP" },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 2MB" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Validate magic bytes match claimed MIME type
    if (!validateFileMagicBytes(buffer, file.type)) {
      return NextResponse.json(
        { error: "File content does not match declared type" },
        { status: 400 }
      );
    }

    // Validate image dimensions and GIF frame count (prevents decompression bombs)
    try {
      const metadata = await sharp(buffer).metadata();
      if (
        (metadata.width && metadata.width > MAX_IMAGE_DIMENSION) ||
        (metadata.height && metadata.height > MAX_IMAGE_DIMENSION)
      ) {
        return NextResponse.json(
          { error: `Image dimensions too large. Maximum ${MAX_IMAGE_DIMENSION}x${MAX_IMAGE_DIMENSION}px` },
          { status: 400 }
        );
      }
      if (metadata.pages && metadata.pages > MAX_GIF_FRAMES) {
        return NextResponse.json(
          { error: `Too many frames in animation. Maximum ${MAX_GIF_FRAMES}` },
          { status: 400 }
        );
      }
    } catch {
      return NextResponse.json(
        { error: "Unable to process image" },
        { status: 400 }
      );
    }

    // Derive extension from validated MIME type (never from user filename)
    const ext = MIME_TO_EXT[file.type] || "bin";
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 10);
    const filename = `signatures/${timestamp}-${random}.${ext}`;

    // Upload to R2
    await R2.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: buffer,
        ContentType: file.type,
        CacheControl: "public, max-age=31536000", // 1 year cache
      })
    );

    // Construct public URL
    const publicUrl = `${PUBLIC_URL_BASE}/${filename}`;

    return NextResponse.json(
      { url: publicUrl },
      {
        headers: {
          "X-RateLimit-Remaining": String(rateLimit.remaining),
        },
      }
    );
  } catch (error) {
    console.error("Upload error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
