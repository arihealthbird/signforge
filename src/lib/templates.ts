/**
 * The template registry: metadata only. Each id has exactly one hand-built
 * renderer in `src/lib/signature/designs`, keyed by `TemplateId`, so a missing
 * renderer is a compile error and no two entries can silently render the same.
 */

export const TEMPLATE_CATEGORIES = [
  { id: "classic", label: "Classic" },
  { id: "minimal", label: "Minimal" },
  { id: "elegant", label: "Elegant" },
  { id: "modern", label: "Modern" },
  { id: "bold", label: "Bold" },
  { id: "friendly", label: "Friendly" },
] as const;

export type TemplateCategory = (typeof TEMPLATE_CATEGORIES)[number]["id"];

interface TemplateSpec {
  id: string;
  name: string;
  /** Shown as the picker tooltip and read by the AI, so keep it plain and specific. */
  description: string;
  category: TemplateCategory;
  /** Roles and industries the design suits. The AI picks a template from this. */
  bestFor: readonly string[];
}

const SPECS = [
  // Classic
  {
    id: "professional-classic",
    name: "Classic",
    description: "Monogram or photo, an accent rule and tidy lettered contact lines.",
    category: "classic",
    bestFor: ["consulting", "finance", "sales", "general business"],
  },
  {
    id: "two-column",
    name: "Ledger",
    description: "Identity on the left, labelled contact rows on the right.",
    category: "classic",
    bestFor: ["professional services", "practices", "detail-heavy roles"],
  },
  {
    id: "corporate-bold",
    name: "Corporate",
    description: "Logo-led layout with a bold name and a labelled contact table.",
    category: "classic",
    bestFor: ["enterprise", "banking", "operations", "corporate teams"],
  },
  {
    id: "care-team",
    name: "Care",
    description: "Calm tinted panel with credentials, full address and a confidentiality footer.",
    category: "classic",
    bestFor: ["healthcare", "clinics", "labs", "wellness"],
  },
  // Minimal
  {
    id: "minimal-modern",
    name: "Minimal",
    description: "Name and role on one line, a fine rule and one contact line.",
    category: "minimal",
    bestFor: ["tech", "engineering", "design"],
  },
  {
    id: "hairline",
    name: "Hairline",
    description: "A full-width hairline over three quiet columns.",
    category: "minimal",
    bestFor: ["architecture", "design studios", "editors"],
  },
  {
    id: "plain-text",
    name: "Plain",
    description: "Reads like typed text, with color only on links.",
    category: "minimal",
    bestFor: ["reply chains", "executives who want quiet", "researchers"],
  },
  {
    id: "compact-horizontal",
    name: "Compact",
    description: "One tidy row with a small mark and stacked contacts.",
    category: "minimal",
    bestFor: ["support", "short replies", "mobile-first teams"],
  },
  // Elegant
  {
    id: "executive-elegant",
    name: "Executive",
    description: "Centered letterhead with a ringed monogram and a double hairline.",
    category: "elegant",
    bestFor: ["legal", "finance", "c-suite", "luxury"],
  },
  {
    id: "chambers",
    name: "Chambers",
    description: "Company on a top rule, a large name, two quiet columns and fine print.",
    category: "elegant",
    bestFor: ["law", "accounting", "advisory"],
  },
  {
    id: "atelier",
    name: "Atelier",
    description: "Airy and quiet, with a fine vertical line in the accent color.",
    category: "elegant",
    bestFor: ["fashion", "interiors", "art", "boutiques"],
  },
  {
    id: "seal",
    name: "Seal",
    description: "A large ringed monogram beside a vertical hairline.",
    category: "elegant",
    bestFor: ["academia", "clinical leadership", "foundations", "nonprofits"],
  },
  // Modern
  {
    id: "rail",
    name: "Rail",
    description: "A tall accent rail with a role tag and two tiers of detail.",
    category: "modern",
    bestFor: ["product", "saas", "startups"],
  },
  {
    id: "terminal",
    name: "Terminal",
    description: "Monospace labels with accent slashes and a thin left border.",
    category: "modern",
    bestFor: ["developers", "devops", "security", "data"],
  },
  {
    id: "split-panel",
    name: "Split",
    description: "An accent panel with a large mark beside the details.",
    category: "modern",
    bestFor: ["agencies", "brands", "marketing"],
  },
  {
    id: "mirror",
    name: "Mirror",
    description: "Right-aligned details with the mark on the right edge.",
    category: "modern",
    bestFor: ["editorial", "consultants", "authors"],
  },
  // Bold
  {
    id: "name-plate",
    name: "Name Plate",
    description: "A solid accent band carries your name and role.",
    category: "bold",
    bestFor: ["sales", "real estate", "events", "recruiting"],
  },
  {
    id: "modern-card",
    name: "Card",
    description: "A soft bordered card with the logo at the top right.",
    category: "bold",
    bestFor: ["saas", "agencies", "sales teams"],
  },
  {
    id: "tint-panel",
    name: "Tint",
    description: "A tinted panel with a left accent bar and a booking button.",
    category: "bold",
    bestFor: ["marketing", "consultants", "coaches"],
  },
  {
    id: "stripe",
    name: "Stripe",
    description: "A three-color top bar over a name row and contact columns.",
    category: "bold",
    bestFor: ["creative leads", "media", "education"],
  },
  // Friendly
  {
    id: "startup-fresh",
    name: "Startup",
    description: "A role chip, tiled contacts and a booking button.",
    category: "friendly",
    bestFor: ["founders", "startups", "freelancers"],
  },
  {
    id: "portrait",
    name: "Portrait",
    description: "A tall portrait mark with a large name.",
    category: "friendly",
    bestFor: ["personal brands", "speakers", "realtors", "coaches"],
  },
  {
    id: "creator",
    name: "Creator",
    description: "An oversized name with outlined chips and an outline button.",
    category: "friendly",
    bestFor: ["creators", "photographers", "writers", "illustrators"],
  },
  {
    id: "storefront",
    name: "Storefront",
    description: "Logo on top with a prominent booking button and the address.",
    category: "friendly",
    bestFor: ["retail", "hospitality", "restaurants", "salons"],
  },
] as const satisfies readonly TemplateSpec[];

export type TemplateId = (typeof SPECS)[number]["id"];

export interface SignatureTemplate {
  id: TemplateId;
  name: string;
  description: string;
  category: TemplateCategory;
  bestFor: readonly string[];
}

export const SIGNATURE_TEMPLATES: readonly SignatureTemplate[] = SPECS;

export const DEFAULT_TEMPLATE_ID: TemplateId = "professional-classic";

/**
 * Ids that shipped before the catalog was rebuilt and no longer exist. Old share
 * links and saved drafts that carry one still open, on the nearest design.
 */
export const LEGACY_TEMPLATE_IDS: Readonly<Record<string, TemplateId>> = {
  "creative-gradient": "tint-panel",
  "banner-cta": "name-plate",
};

/** Strict: true only for a current id. Use this for untrusted input such as AI output. */
export function isTemplateId(value: unknown): value is TemplateId {
  return typeof value === "string" && SPECS.some((spec) => spec.id === value);
}

/** Maps a current or legacy id to a current id, or null when it is unknown. */
export function resolveTemplateId(value: unknown): TemplateId | null {
  if (isTemplateId(value)) return value;
  if (typeof value === "string" && Object.prototype.hasOwnProperty.call(LEGACY_TEMPLATE_IDS, value)) {
    return LEGACY_TEMPLATE_IDS[value];
  }
  return null;
}

/** Looks a template up by current or legacy id, falling back to the default design. */
export function getTemplate(id: string): SignatureTemplate {
  const resolved = resolveTemplateId(id) ?? DEFAULT_TEMPLATE_ID;
  return SIGNATURE_TEMPLATES.find((template) => template.id === resolved) ?? SIGNATURE_TEMPLATES[0];
}

/** One compact line per template for the AI prompt: id, name, style word, description, best-for. */
export function templateDescription(): string {
  return SIGNATURE_TEMPLATES.map(
    (template) =>
      `- ${template.id}: ${template.name} [${template.category}]. ${template.description} Best for: ${template.bestFor.join(", ")}.`
  ).join("\n");
}
