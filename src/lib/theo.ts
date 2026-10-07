import { SITE } from "@/lib/site";

/**
 * Client for Theo, the AI orchestration API from HiTheo (https://hitheo.ai).
 * Reference: https://docs.hitheo.ai/api-reference/completions/create
 *
 * SignForge is an E.V.I. (embedded virtual intelligence): its own persona on top
 * of Theo's engine. Every request is one stateless completion. It sends no
 * conversation id, tools or skills, so Theo keeps no conversation on its behalf.
 *
 * Server-only: this module reads the API key from the environment.
 */

/**
 * The www host, always. The apex domain redirects to www, and most HTTP clients
 * drop the Authorization header when they follow a redirect, which surfaces as a
 * confusing 401.
 */
export const THEO_DEFAULT_BASE_URL = "https://www.hitheo.ai";

/**
 * The modes that return text, which is all SignForge needs. `fast` is quick and
 * inexpensive; `think` reasons for longer.
 */
export const THEO_MODES = ["fast", "think"] as const;
export type TheoMode = (typeof THEO_MODES)[number];
export const THEO_DEFAULT_MODE: TheoMode = "fast";

export interface TheoConfig {
  apiKey: string;
  /** The API origin plus an optional path prefix, without a trailing slash. */
  baseUrl: string;
  mode: TheoMode;
}

type Env = Record<string, string | undefined>;

/**
 * Reads the Theo settings from the environment. Throws `AI_NOT_CONFIGURED` when
 * the key is missing or the base URL is unusable, so the API route can answer
 * with a clean 503 instead of a stack trace.
 */
export function readTheoConfig(env: Env = process.env): TheoConfig {
  const apiKey = env.THEO_API_KEY?.trim();
  if (!apiKey) throw new Error("AI_NOT_CONFIGURED");

  return {
    apiKey,
    baseUrl: resolveBaseUrl(env.THEO_BASE_URL),
    mode: resolveMode(env.THEO_MODE),
  };
}

function resolveBaseUrl(raw: string | undefined): string {
  const value = raw?.trim();
  if (!value) return THEO_DEFAULT_BASE_URL;

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    console.error("THEO_BASE_URL is not a valid URL.");
    throw new Error("AI_NOT_CONFIGURED");
  }

  // The key is only ever sent over TLS.
  if (url.protocol !== "https:") {
    console.error("THEO_BASE_URL must be an https URL.");
    throw new Error("AI_NOT_CONFIGURED");
  }

  if (url.hostname === "hitheo.ai") url.hostname = "www.hitheo.ai";
  return `${url.origin}${url.pathname.replace(/\/+$/, "")}`;
}

function resolveMode(raw: string | undefined): TheoMode {
  const value = raw?.trim().toLowerCase();
  return THEO_MODES.find((mode) => mode === value) ?? THEO_DEFAULT_MODE;
}

/**
 * A failed call to Theo. `status` is the HTTP status, or 0 when Theo could not
 * be reached. `requestId` is what HiTheo support asks for.
 */
export class TheoApiError extends Error {
  readonly status: number;
  readonly code: string | null;
  readonly requestId: string | null;

  constructor(status: number, code: string | null, requestId: string | null, message?: string) {
    super(message ?? `Theo API error ${status}${code ? ` (${code})` : ""}`);
    this.name = "TheoApiError";
    this.status = status;
    this.code = code;
    this.requestId = requestId;
  }
}

export interface TheoCompletionInput {
  /** The user turn. */
  prompt: string;
  /** Replaces Theo's own personality: SignForge's designer instructions. */
  persona: string;
  temperature?: number;
  signal?: AbortSignal;
}

/**
 * Sends one completion through Theo's orchestration pipeline and returns the
 * generated text. Aborts propagate untouched so the caller can time out.
 */
export async function theoComplete(
  input: TheoCompletionInput,
  config: TheoConfig = readTheoConfig()
): Promise<string> {
  let response: Response;
  try {
    response = await fetch(`${config.baseUrl}/api/v1/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
        "User-Agent": `${SITE.name} (+${SITE.url})`,
      },
      body: JSON.stringify({
        prompt: input.prompt,
        mode: config.mode,
        persona: { system_prompt: input.persona },
        temperature: input.temperature,
        // One pass: SignForge uses no tools, so there is no loop to run.
        max_iterations: 1,
      }),
      signal: input.signal,
    });
  } catch (error) {
    if ((error as { name?: string } | null)?.name === "AbortError") throw error;
    throw new TheoApiError(0, "network_error", null, "Could not reach the Theo API");
  }

  const body: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const detail = (body as { error?: { code?: unknown; request_id?: unknown } } | null)?.error;
    throw new TheoApiError(
      response.status,
      typeof detail?.code === "string" ? detail.code : null,
      typeof detail?.request_id === "string" ? detail.request_id : response.headers.get("x-request-id")
    );
  }

  const content = (body as { content?: unknown } | null)?.content;
  return typeof content === "string" ? content : "";
}
