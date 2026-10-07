import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, stripDangerousKeys, validateSignatureData } from "@/lib/security";
import { requestGeneration, type ChatTurn } from "@/lib/ai";
import { isTemplateId } from "@/lib/templates";
import { isSceneId } from "@/scenes";
import type { SignatureData } from "@/types/signature";

const MAX_PROMPT_LENGTH = 2000;

export async function POST(request: NextRequest) {
  const clientIp =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "anonymous";

  const rateLimit = checkRateLimit(clientIp, 12, 60000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment and try again." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rateLimit.resetIn / 1000)) } }
    );
  }

  let body: {
    prompt?: unknown;
    currentData?: unknown;
    template?: unknown;
    scene?: unknown;
    history?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const prompt = typeof body?.prompt === "string" ? body.prompt.trim() : "";
  if (!prompt) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }
  if (prompt.length > MAX_PROMPT_LENGTH) {
    return NextResponse.json(
      { error: `Prompt must be ${MAX_PROMPT_LENGTH} characters or fewer` },
      { status: 400 }
    );
  }

  // Validate currentData structure if provided (prevents junk reaching the model).
  const rawCurrent = body?.currentData ?? null;
  if (rawCurrent !== null && (typeof rawCurrent !== "object" || Array.isArray(rawCurrent))) {
    return NextResponse.json({ error: "Invalid currentData" }, { status: 400 });
  }
  if (rawCurrent !== null && !validateSignatureData(rawCurrent)) {
    return NextResponse.json({ error: "Invalid currentData" }, { status: 400 });
  }
  const currentData = rawCurrent === null ? null : (stripDangerousKeys(rawCurrent) as SignatureData);

  // Sanitised conversation memory: role + text pairs only, bounded in the caller.
  const history: ChatTurn[] = [];
  if (Array.isArray(body?.history)) {
    for (const turn of body.history.slice(0, 12)) {
      if (!turn || typeof turn !== "object") continue;
      const role = (turn as Record<string, unknown>).role;
      const text = (turn as Record<string, unknown>).text;
      if ((role === "user" || role === "assistant") && typeof text === "string" && text.trim()) {
        history.push({ role, text: text.slice(0, 2000) });
      }
    }
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const currentScene = isSceneId(body?.scene) ? body.scene : null;
    const currentTemplate = isTemplateId(body?.template) ? body.template : null;
    const result = await requestGeneration(
      prompt,
      currentData,
      controller.signal,
      currentScene,
      currentTemplate,
      history
    );
    return NextResponse.json({
      signature: result.signature,
      template: result.template,
      scene: result.scene,
      gifQuery: result.gifQuery,
      message: result.message,
      changes: result.changes,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "UNKNOWN";
    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json({ error: "The AI request timed out. Please try a shorter prompt." }, { status: 504 });
    }
    switch (message) {
      case "AI_NOT_CONFIGURED":
        return NextResponse.json({ error: "AI is not configured" }, { status: 503 });
      case "RATE_LIMITED":
        return NextResponse.json({ error: "AI service is busy. Please try again shortly." }, { status: 429 });
      case "AI_UNAVAILABLE":
        return NextResponse.json({ error: "AI service is temporarily unavailable." }, { status: 503 });
      default:
        console.error("Generate API error:", message);
        return NextResponse.json({ error: "Generation failed. Please try again." }, { status: 500 });
    }
  } finally {
    clearTimeout(timeout);
  }
}
