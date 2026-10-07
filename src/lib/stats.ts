import { SIGNATURE_TEMPLATES } from "@/lib/templates";
import { COLOR_THEMES, FONT_OPTIONS } from "@/types/signature";
import { SCENES } from "@/scenes";

/**
 * The numbers the landing page quotes, read from the registries so the copy
 * never drifts from what the product actually has. Removing the pop-culture
 * scene pack lowers `scenes` and the page follows.
 */
export const STATS = {
  templates: SIGNATURE_TEMPLATES.length,
  fonts: FONT_OPTIONS.length,
  colors: COLOR_THEMES.length,
  scenes: SCENES.length,
} as const;
