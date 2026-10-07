/**
 * Single source of truth for names and links used across the UI, the exported
 * HTML credit line, and metadata.
 */
export const SITE = {
  name: "SignForge",
  tagline: "Email signatures from a single sentence.",
  description:
    "SignForge turns one sentence into an email signature that pastes into Gmail, Outlook and Apple Mail. Free and open source, from TheoVex.",
  repoUrl: "https://github.com/arihealthbird/signforge",
  license: "Apache-2.0",
} as const;

/**
 * TheoVex is the company behind SignForge. It is an AI research lab for highly
 * regulated industries (healthcare and insurtech first), not a productivity
 * platform, so keep copy about it in that register.
 */
export const THEOVEX = {
  name: "TheoVex",
  url: "https://theovex.com",
  docsUrl: "https://docs.hitheo.ai",
  openChartsUrl: "https://opencharts.com",
  tagline: "Intelligence, as a layer.",
  blurb:
    "TheoVex is an AI research lab for highly regulated industries, healthcare and insurtech first.",
} as const;

/**
 * Theo AI is the assistant that powers SignForge: it reads the prompt, picks a
 * template and scene, and writes the signature. Learn more on the OpenCharts
 * Theo page.
 */
export const THEO_AI = {
  name: "Theo AI",
  url: "http://opencharts.com/features/theo",
  blurb: "SignForge is powered by Theo AI.",
} as const;
