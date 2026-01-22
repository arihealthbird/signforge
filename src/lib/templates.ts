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
];

export type TemplateId = typeof SIGNATURE_TEMPLATES[number]["id"];
