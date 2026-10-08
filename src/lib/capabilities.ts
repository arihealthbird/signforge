/**
 * What the configured AI provider can do beyond text. The composer shows its
 * microphone and attach buttons only for what is on, so a visitor is never
 * offered something that would fail. Kept free of imports so the browser can
 * use it without pulling in any server code.
 */
export interface Capabilities {
  /** Voice dictation (speech to text). */
  voice: boolean;
  /** Reference images attached to a request. */
  images: boolean;
}

export const NO_CAPABILITIES: Capabilities = { voice: false, images: false };
