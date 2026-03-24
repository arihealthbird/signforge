import { SignatureTemplate } from "@/types/signature";

export const SIGNATURE_TEMPLATES: SignatureTemplate[] = [
  {
    id: "professional-classic",
    name: "Professional Classic",
    description: "Clean and traditional layout with photo on the left",
    thumbnail: "/templates/professional-classic.png",
    category: "professional",
  },
  {
    id: "minimal-modern",
    name: "Minimal Modern",
    description: "Sleek, minimalist design with subtle accents",
    thumbnail: "/templates/minimal-modern.png",
    category: "minimal",
  },
  {
    id: "corporate-bold",
    name: "Corporate Bold",
    description: "Bold branding with prominent company logo",
    thumbnail: "/templates/corporate-bold.png",
    category: "corporate",
  },
  {
    id: "creative-gradient",
    name: "Creative Gradient",
    description: "Eye-catching design with gradient accents",
    thumbnail: "/templates/creative-gradient.png",
    category: "creative",
  },
  {
    id: "executive-elegant",
    name: "Executive Elegant",
    description: "Sophisticated design for senior professionals",
    thumbnail: "/templates/executive-elegant.png",
    category: "professional",
  },
  {
    id: "startup-fresh",
    name: "Startup Fresh",
    description: "Modern and approachable for startups",
    thumbnail: "/templates/startup-fresh.png",
    category: "creative",
  },
  {
    id: "compact-horizontal",
    name: "Compact Horizontal",
    description: "Single-row ultra-compact layout",
    thumbnail: "/templates/compact-horizontal.png",
    category: "minimal",
  },
  {
    id: "modern-card",
    name: "Modern Card",
    description: "Structured card with subtle background",
    thumbnail: "/templates/modern-card.png",
    category: "creative",
  },
  {
    id: "two-column",
    name: "Two Column",
    description: "Balanced two-column grid layout",
    thumbnail: "/templates/two-column.png",
    category: "professional",
  },
  {
    id: "banner-cta",
    name: "Banner CTA",
    description: "Full-width banner with call-to-action button",
    thumbnail: "/templates/banner-cta.png",
    category: "creative",
  },
];

export type TemplateId = typeof SIGNATURE_TEMPLATES[number]["id"];
