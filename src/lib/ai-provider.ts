import { THEO_AI } from "@/lib/site";
import { NO_CAPABILITIES, type Capabilities } from "@/lib/capabilities";
import { chatComplete, readChatCompletionsConfig } from "@/lib/chat-completions";
import { readTheoConfig, theoComplete, type TheoCompletionInput } from "@/lib/theo";

/**
 * Chooses the AI provider for this deployment, from the environment alone.
 *
 *  1. Theo, when `THEO_API_KEY` is set. It also unlocks voice dictation and
 *     reference images.
 *  2. Any chat completions API, when `AI_API_KEY` is set (with `AI_BASE_URL`
 *     and `AI_MODEL`). Text only.
 *  3. Nothing: generation answers `AI_NOT_CONFIGURED`.
 *
 * Server-only: this module reads secrets from the environment.
 */

export type ProviderId = "theo" | "custom";

type Env = Record<string, string | undefined>;

/** What a completion needs. A provider that cannot use attachments ignores them. */
export type CompletionInput = TheoCompletionInput;

export function activeProvider(env: Env = process.env): ProviderId | null {
  if (env.THEO_API_KEY?.trim()) return "theo";
  if (env.AI_API_KEY?.trim()) return "custom";
  return null;
}

/** Sends one stateless completion through the configured provider. */
export async function complete(input: CompletionInput, env: Env = process.env): Promise<string> {
  switch (activeProvider(env)) {
    case "theo":
      return theoComplete(input, readTheoConfig(env));
    case "custom":
      return chatComplete(input, readChatCompletionsConfig(env));
    default:
      throw new Error("AI_NOT_CONFIGURED");
  }
}

/** Voice and images need Theo. Every other provider here is text only. */
export function getCapabilities(env: Env = process.env): Capabilities {
  return activeProvider(env) === "theo" ? { voice: true, images: true } : { ...NO_CAPABILITIES };
}

export interface ProviderInfo {
  id: ProviderId | null;
  /** The name to show visitors. Empty when no provider is configured. */
  name: string;
  /** An https origin to show next to the name, or null. */
  url: string | null;
}

/**
 * Who receives visitors' requests, for the privacy and terms pages. A custom
 * provider is named by the operator through `AI_PROVIDER_NAME` and
 * `AI_PROVIDER_URL`; without them the host of `AI_BASE_URL` stands in, so the
 * page is never wrong about where the text goes.
 */
export function describeProvider(env: Env = process.env): ProviderInfo {
  const id = activeProvider(env);
  if (id === "theo") return { id, name: "Theo", url: THEO_AI.url };
  if (id === "custom") {
    return {
      id,
      name: providerName(env) ?? hostOf(env.AI_BASE_URL) ?? "the configured AI provider",
      url: httpsOrigin(env.AI_PROVIDER_URL),
    };
  }
  return { id: null, name: "", url: null };
}

function providerName(env: Env): string | null {
  const name = env.AI_PROVIDER_NAME?.replace(/\s+/g, " ").trim().slice(0, 80);
  return name || null;
}

function parseHttps(value: string | undefined): URL | null {
  try {
    const url = new URL(value?.trim() ?? "");
    return url.protocol === "https:" ? url : null;
  } catch {
    return null;
  }
}

function hostOf(value: string | undefined): string | null {
  return parseHttps(value)?.hostname ?? null;
}

function httpsOrigin(value: string | undefined): string | null {
  return parseHttps(value)?.origin ?? null;
}
