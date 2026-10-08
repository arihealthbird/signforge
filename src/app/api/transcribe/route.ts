import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/security";
import { theoTranscribe } from "@/lib/theo";
import { toServiceError } from "@/lib/ai";

const MAX_AUDIO_BYTES = 10 * 1024 * 1024;
// A multipart body is a little larger than the file inside it.
const MAX_BODY_BYTES = MAX_AUDIO_BYTES + 256 * 1024;

/** The formats Theo's speech-to-text documents: MP3, MP4, MPEG, MPGA, M4A, WAV and WebM. */
const AUDIO_MIME_TYPES = new Set([
  "audio/webm",
  "video/webm",
  "audio/mp4",
  "video/mp4",
  "audio/x-m4a",
  "audio/m4a",
  "audio/mpeg",
  "audio/mp3",
  "audio/mpga",
  "audio/wav",
  "audio/x-wav",
]);

/** Theo expects a two-letter ISO 639-1 code, so a regional tag such as `en-US` becomes `en`. */
function normalizeLanguage(raw: unknown): string | undefined {
  if (typeof raw !== "string") return undefined;
  const match = /^([a-z]{2})(?:[-_][a-z0-9]{2,8})?$/i.exec(raw.trim());
  return match ? match[1].toLowerCase() : undefined;
}

/** A fixed name for the upstream upload, so nothing the visitor chose is forwarded. */
function filenameFor(mime: string): string {
  if (mime.includes("mp4") || mime.includes("m4a")) return "recording.m4a";
  if (mime.includes("mpeg") || mime.includes("mp3") || mime.includes("mpga")) return "recording.mp3";
  if (mime.includes("wav")) return "recording.wav";
  return "recording.webm";
}

export async function POST(request: NextRequest) {
  const clientIp = getClientIp(request.headers);

  // A separate bucket from /api/generate, so dictating is not throttled by design calls.
  const rateLimit = checkRateLimit(`stt:${clientIp}`, 12, 60000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment and try again." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rateLimit.resetIn / 1000)) } }
    );
  }

  // Refuse an oversized upload before it is read into memory. A body that does
  // not declare its length is still checked once parsed, below.
  const declared = Number(request.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "The recording is too large (max 10 MB)." }, { status: 413 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Expected an audio file." }, { status: 400 });
  }

  const raw = form.get("file");
  if (!raw || typeof raw !== "object" || typeof (raw as Blob).arrayBuffer !== "function") {
    return NextResponse.json({ error: "Audio file is required." }, { status: 400 });
  }
  const file = raw as Blob;

  if (file.size === 0) {
    return NextResponse.json({ error: "The recording was empty." }, { status: 400 });
  }
  if (file.size > MAX_AUDIO_BYTES) {
    return NextResponse.json({ error: "The recording is too large (max 10 MB)." }, { status: 413 });
  }

  // Browsers append codec parameters, for example `audio/webm;codecs=opus`.
  const mime = (file.type || "").split(";")[0].trim().toLowerCase();
  if (mime && !AUDIO_MIME_TYPES.has(mime)) {
    return NextResponse.json({ error: "Unsupported audio format." }, { status: 400 });
  }

  const language = normalizeLanguage(form.get("language"));

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const text = await theoTranscribe(file, { filename: filenameFor(mime), language, signal: controller.signal });
    const trimmed = text.trim();
    if (!trimmed) {
      return NextResponse.json({ error: "No speech detected. Try again." }, { status: 422 });
    }
    return NextResponse.json({ text: trimmed });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json({ error: "Transcription took too long. Please try again." }, { status: 504 });
    }
    const message = toServiceError(error).message;
    switch (message) {
      case "AI_NOT_CONFIGURED":
        return NextResponse.json({ error: "Voice is not configured." }, { status: 503 });
      case "RATE_LIMITED":
        return NextResponse.json({ error: "Voice service is busy. Please try again shortly." }, { status: 429 });
      case "AI_REQUEST_REJECTED":
        return NextResponse.json({ error: "Could not transcribe that audio. Try again." }, { status: 422 });
      case "AI_UNAVAILABLE":
        return NextResponse.json({ error: "Voice service is temporarily unavailable." }, { status: 503 });
      default:
        console.error("Transcribe API error:", message);
        return NextResponse.json({ error: "Transcription failed. Please try again." }, { status: 500 });
    }
  } finally {
    clearTimeout(timeout);
  }
}
