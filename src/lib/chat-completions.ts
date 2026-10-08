import { SITE } from "@/lib/site";
import { ProviderError } from "@/lib/provider-error";

/**
 * Client for any API that follows the common `POST {base}/chat/completions`
 * shape: OpenAI, OpenRouter, Together, Groq, Mistral, a gateway you run
 * yourself, and many more. SignForge uses it when `THEO_API_KEY` is not set.
 *
 * Nothing here names a vendor. The operator picks the provider entirely through
 * `AI_API_KEY`, `AI_BASE_URL` and `AI_MODEL`, so the repository stays neutral.
 * An option that only one provider understands goes in `AI_EXTRA_BODY`.
 *
 * Images and audio are not part of this client: it sends text only.
 *
 * Server-only: this module reads the API key from the environment.
 */

/**
 * Room for the JSON design plus the thinking that reasoning models do before
 * they write it. Those tokens count against the same limit.
 */
export const CHAT_MAX_TOKENS = 4000;

export interface ChatCompletionsConfig {
  apiKey: string;
  /** The API origin plus an optional path prefix such as `/v1`, without a trailing slash. */
  baseUrl: string;
  model: string;
  /**
   * Extra top-level request fields from `AI_EXTRA_BODY`, for options that only
   * one provider understands. Empty by default.
   */
  extraBody: Record<string, unknown>;
}

type Env = Record<string, string | undefined>;

/**
 * Reads the provider settings from the environment. Throws `AI_NOT_CONFIGURED`
 * when the key is missing or the rest is unusable, so the API route can answer
 * with a clean 503 instead of a stack trace. The log names the variable that is
 * wrong and never prints a value.
 */
export function readChatCompletionsConfig(env: Env = process.env): ChatCompletionsConfig {
  const apiKey = env.AI_API_KEY?.trim();
  if (!apiKey) throw new Error("AI_NOT_CONFIGURED");

  const baseUrl = env.AI_BASE_URL?.trim();
  const model = env.AI_MODEL?.trim();
  if (!baseUrl || !model) {
    const missing = [baseUrl ? null : "AI_BASE_URL", model ? null : "AI_MODEL"].filter(Boolean);
    console.error(`AI_API_KEY is set, but ${missing.join(" and ")} must be set too.`);
    throw new Error("AI_NOT_CONFIGURED");
  }

  return {
    apiKey,
    baseUrl: resolveBaseUrl(baseUrl),
    model,
    extraBody: resolveExtraBody(env.AI_EXTRA_BODY),
  };
}

function resolveBaseUrl(value: string): string {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    console.error("AI_BASE_URL is not a valid URL.");
    throw new Error("AI_NOT_CONFIGURED");
  }

  // The key is only ever sent over TLS, and never inside a URL.
  if (url.protocol !== "https:" || url.username || url.password) {
    console.error("AI_BASE_URL must be an https URL without credentials.");
    throw new Error("AI_NOT_CONFIGURED");
  }

  return `${url.origin}${url.pathname.replace(/\/+$/, "")}`;
}

/** Fields the client always sets itself, so the operator cannot replace them. */
const RESERVED_BODY_FIELDS = ["model", "messages", "stream", "temperature", "max_tokens"] as const;

/**
 * Reads `AI_EXTRA_BODY`: a JSON object whose fields are added to every request.
 * It is how an operator passes an option only their provider knows, for example
 * a switch that turns off a reasoning phase. Anything unusable fails closed,
 * and the log names the problem without printing the value.
 */
function resolveExtraBody(raw: string | undefined): Record<string, unknown> {
  const value = raw?.trim();
  if (!value) return {};

  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    console.error("AI_EXTRA_BODY is not valid JSON.");
    throw new Error("AI_NOT_CONFIGURED");
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    console.error("AI_EXTRA_BODY must be a JSON object.");
    throw new Error("AI_NOT_CONFIGURED");
  }

  const reserved = RESERVED_BODY_FIELDS.filter((field) => field in parsed);
  if (reserved.length) {
    console.error(`AI_EXTRA_BODY cannot set ${reserved.join(", ")}.`);
    throw new Error("AI_NOT_CONFIGURED");
  }

  return parsed as Record<string, unknown>;
}

/** A failed call to the configured chat completions provider. */
export class AiApiError extends ProviderError {
  constructor(status: number, code: string | null, requestId: string | null, message?: string) {
    super("custom", status, code, requestId, message);
    this.name = "AiApiError";
  }
}

export interface ChatCompletionInput {
  /** The user turn. */
  prompt: string;
  /** The system message: SignForge's designer instructions. */
  persona: string;
  temperature?: number;
  signal?: AbortSignal;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

/**
 * The short machine code a provider reports with an error, in any of the common
 * shapes: `{ error: { code } }`, `{ error: { type } }`, `{ reason }`. The human
 * message is never read, because some providers echo part of the key in it.
 */
function errorCode(body: unknown): string | null {
  const root = asRecord(body);
  const nested = asRecord(root?.error);
  for (const value of [nested?.code, nested?.type, root?.reason, root?.code]) {
    if (typeof value === "string" && value) return value.slice(0, 80);
  }
  return null;
}

function readContent(body: unknown): string {
  const choices = asRecord(body)?.choices;
  const message = Array.isArray(choices) ? asRecord(asRecord(choices[0])?.message) : null;

  const content = message?.content;
  if (typeof content === "string" && content.trim()) return content;

  // Some reasoning models leave `content` empty and answer in `reasoning_content`.
  const reasoning = message?.reasoning_content;
  return typeof reasoning === "string" ? reasoning : "";
}

/**
 * Sends one stateless chat completion and returns the generated text. Aborts
 * propagate untouched so the caller can time out.
 */
export async function chatComplete(
  input: ChatCompletionInput,
  config: ChatCompletionsConfig = readChatCompletionsConfig()
): Promise<string> {
  let response: Response;
  try {
    response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
        "User-Agent": `${SITE.name} (+${SITE.url})`,
      },
      body: JSON.stringify({
        // First, so the fields below always win over anything in the extras.
        ...config.extraBody,
        model: config.model,
        messages: [
          { role: "system", content: input.persona },
          { role: "user", content: input.prompt },
        ],
        temperature: input.temperature,
        max_tokens: CHAT_MAX_TOKENS,
      }),
      signal: input.signal,
    });
  } catch (error) {
    if ((error as { name?: string } | null)?.name === "AbortError") throw error;
    throw new AiApiError(0, "network_error", null, "Could not reach the AI provider");
  }

  const body: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new AiApiError(response.status, errorCode(body), response.headers.get("x-request-id"));
  }

  return readContent(body);
}
