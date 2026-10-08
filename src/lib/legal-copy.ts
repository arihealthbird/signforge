import type { ProviderInfo } from "@/lib/ai-provider";

/**
 * The AI paragraphs of the privacy policy and the terms, written for whichever
 * provider this deployment actually uses. The legal pages must never say that
 * text goes to one company while it goes to another, so they are built from the
 * provider's description instead of being typed out by hand.
 */

export interface LegalCopySection {
  title: string;
  body: string[];
}

const RATE_LIMIT =
  "To protect the service from abuse we keep your IP address in memory for a short time to rate-limit requests. It is not written to a database.";

const SELF_HOSTING =
  "If you self-host SignForge, you supply your own AI provider key through an environment variable. The key stays on your server and is never sent to the browser.";

const REQUEST_CONTENTS =
  "the text of your request, the recent messages in the conversation and the signature you are editing";

/** "Name (https://origin)" when the operator gave a URL, otherwise just the name. */
function named(provider: ProviderInfo): string {
  return provider.url ? `${provider.name} (${provider.url})` : provider.name;
}

export function aiPrivacySection(provider: ProviderInfo): LegalCopySection {
  const title = "AI generation";

  if (provider.id === "theo") {
    return {
      title,
      body: [
        `When you ask the AI to design or change a signature, ${REQUEST_CONTENTS} are sent from our server to Theo, the AI orchestration API at hitheo.ai. Theo routes the request to a model and returns the result. We do not store these requests.`,
        "If you attach a reference image, your browser shrinks it and sends it with your request. If you dictate with the microphone, the recording goes through our server to Theo, which turns it into text. We do not store images or recordings.",
        "Theo handles that data under its own documentation and policies. It does not use prompts or responses to train models, and it may keep request audit logs and short-lived cache entries. It passes the request to the model provider it selects to produce the answer. Details: https://docs.hitheo.ai/security/data-privacy.",
        RATE_LIMIT,
        SELF_HOSTING,
      ],
    };
  }

  if (provider.id === "custom") {
    return {
      title,
      body: [
        `When you ask the AI to design or change a signature, ${REQUEST_CONTENTS} are sent from our server to ${named(provider)}, the AI provider this site uses, which generates the result and returns it. We do not store these requests.`,
        "That provider processes the data under its own terms and privacy policy, which we do not control. Reference images and voice dictation are switched off on this site, so no images or audio are sent to it.",
        RATE_LIMIT,
        SELF_HOSTING,
      ],
    };
  }

  return {
    title,
    body: [
      "AI features are switched off on this site because no AI provider is configured, so nothing you type is sent to one.",
      SELF_HOSTING,
    ],
  };
}

export function aiTermsSection(provider: ProviderInfo): LegalCopySection {
  const title = "AI-generated content";
  const review = "You are responsible for reviewing everything you export or share.";

  if (provider.id === "theo") {
    return {
      title,
      body: [
        `AI features generate content with Theo, an AI orchestration API that routes each request to a third-party model. Output can be inaccurate, including made-up contact details and links. ${review}`,
      ],
    };
  }

  if (provider.id === "custom") {
    return {
      title,
      body: [
        `AI features generate content with a third-party AI model provided by ${provider.name}. Output can be inaccurate, including made-up contact details and links. ${review}`,
      ],
    };
  }

  return { title, body: [`AI features are switched off on this site. ${review}`] };
}
