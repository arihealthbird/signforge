import type { TemplateId } from "@/lib/templates";
import type { Align, Renderer } from "./kit";
import { classicDesigns } from "./designs/classic";
import { minimalDesigns } from "./designs/minimal";
import { elegantDesigns } from "./designs/elegant";
import { modernDesigns } from "./designs/modern";
import { boldDesigns } from "./designs/bold";
import { friendlyDesigns } from "./designs/friendly";

/**
 * One hand-built renderer per template id. Typing the record by `TemplateId`
 * makes a missing renderer a compile error.
 */
export const DESIGNS: Record<TemplateId, Renderer> = {
  ...classicDesigns,
  ...minimalDesigns,
  ...elegantDesigns,
  ...modernDesigns,
  ...boldDesigns,
  ...friendlyDesigns,
};

/**
 * How a design is aligned, so the banner and credit line under it follow suit.
 * Anything not listed is left-aligned.
 */
export const DESIGN_ALIGN: Partial<Record<TemplateId, Align>> = {
  "executive-elegant": "center",
  mirror: "right",
};
