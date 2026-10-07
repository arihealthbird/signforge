import { DEFAULT_SIGNATURE_DATA, FONT_OPTIONS, SignatureData } from "@/types/signature";
import type { TemplateId } from "@/lib/templates";
import type { SceneId } from "@/scenes";
import type { IconName } from "@/components/icons";

const font = (label: string) =>
  FONT_OPTIONS.find((f) => f.label === label)?.value ?? DEFAULT_SIGNATURE_DATA.fontFamily;

export interface Sample {
  id: string;
  /** The prompt that "generated" it, shown as the caption in the demo. */
  prompt: string;
  template: TemplateId;
  scene: SceneId;
  data: SignatureData;
}

/** Fictional people and companies. Shown in the landing demo and used as the
 *  starting point when someone opens the studio without a prompt. */
export const SAMPLES: Sample[] = [
  {
    id: "dana",
    prompt: "Dana Whitfield, managing partner at Whitfield & Ross LLP. Elegant, navy, serif.",
    template: "executive-elegant",
    scene: "classic",
    data: {
      ...DEFAULT_SIGNATURE_DATA,
      fullName: "Dana Whitfield",
      jobTitle: "Managing Partner",
      company: "Whitfield & Ross LLP",
      email: "dana@whitfieldross.com",
      phone: "+1 (212) 555-0142",
      website: "whitfieldross.com",
      socialLinks: [{ platform: "linkedin", url: "https://linkedin.com/in/danawhitfield" }],
      primaryColor: "#1e3a8a",
      secondaryColor: "#c9a227",
      fontFamily: font("Playfair Display"),
      fontSize: 14,
    },
  },
  {
    id: "marcus",
    prompt: "Marcus Webb, founder of Orbit Labs. Bold, techy, space-age.",
    template: "rail",
    scene: "cosmic",
    data: {
      ...DEFAULT_SIGNATURE_DATA,
      fullName: "Marcus Webb",
      jobTitle: "Founder & CEO",
      company: "Orbit Labs",
      email: "marcus@orbitlabs.io",
      phone: "+1 (415) 555-0199",
      calendarLink: "https://cal.com/marcuswebb",
      socialLinks: [
        { platform: "github", url: "https://github.com/marcuswebb" },
        { platform: "twitter", url: "https://x.com/marcuswebb" },
      ],
      primaryColor: "#7c3aed",
      secondaryColor: "#5b21b6",
      fontFamily: font("Space Grotesk"),
      fontSize: 14,
    },
  },
  {
    id: "priya",
    prompt: "Priya Shah, pediatric nurse practitioner at St. Mary's. Calm, trustworthy, soft green.",
    template: "care-team",
    scene: "classic",
    data: {
      ...DEFAULT_SIGNATURE_DATA,
      fullName: "Priya Shah, DNP",
      jobTitle: "Pediatric Nurse Practitioner",
      company: "St. Mary's Children's Hospital",
      email: "priya.shah@stmarys.org",
      phone: "+1 (617) 555-0123",
      website: "stmarys.org",
      address: "120 Longwood Ave",
      city: "Boston",
      state: "MA",
      primaryColor: "#0f766e",
      secondaryColor: "#99d5cf",
      fontFamily: font("Manrope"),
      fontSize: 14,
    },
  },
  {
    id: "jack",
    prompt: "Captain Jack Reyes, harbor tours. Full pirate mode, ahoy!",
    template: "name-plate",
    scene: "pirate",
    data: {
      ...DEFAULT_SIGNATURE_DATA,
      fullName: "Captain Jack Reyes",
      jobTitle: "Harbor Tours Captain",
      company: "Blackwater Voyages",
      email: "jack@blackwatervoyages.co",
      phone: "+1 (305) 555-0166",
      website: "blackwatervoyages.co",
      calendarLink: "https://blackwatervoyages.co/book",
      primaryColor: "#b45309",
      secondaryColor: "#78350f",
      fontFamily: font("Lora"),
      fontSize: 14,
    },
  },
  {
    id: "mina",
    prompt: "Mina Okafor, freelance illustrator. Playful, pink, loves the beach.",
    template: "creator",
    scene: "surf",
    data: {
      ...DEFAULT_SIGNATURE_DATA,
      fullName: "Mina Okafor",
      jobTitle: "Freelance Illustrator",
      company: "Studio Okafor",
      email: "hello@studiookafor.com",
      website: "studiookafor.com",
      socialLinks: [
        { platform: "instagram", url: "https://instagram.com/studiookafor" },
        { platform: "youtube", url: "https://youtube.com/@studiookafor" },
      ],
      primaryColor: "#db2777",
      secondaryColor: "#be185d",
      fontFamily: font("Outfit"),
      photoShape: "rounded",
      fontSize: 14,
    },
  },
];

export interface Example {
  /** Short label for the chip. */
  label: string;
  /** A key in the icon registry (`src/components/icons.tsx`). */
  icon: IconName;
  /** The full prompt that is sent when the chip is clicked. */
  prompt: string;
}

/** One-click starting points shown under the composer. */
export const EXAMPLES: Example[] = [
  {
    label: "Nurse, calm green",
    icon: "stethoscope",
    prompt: "Priya Shah, pediatric nurse practitioner at St. Mary's. Calm, trustworthy, soft green.",
  },
  {
    label: "Founder with a GIF",
    icon: "rocket",
    prompt: "Marcus Webb, founder of Orbit Labs. Bold and techy, with a confetti GIF.",
  },
  {
    label: "Law partner, navy serif",
    icon: "scale",
    prompt: "Dana Whitfield, managing partner at Whitfield & Ross LLP. Elegant, navy, serif.",
  },
  {
    label: "Pirate captain",
    icon: "ship",
    prompt: "Captain Jack Reyes, harbor tours. Full pirate mode, ahoy!",
  },
  {
    label: "Playful illustrator",
    icon: "palette",
    prompt: "Mina Okafor, freelance illustrator. Playful pastel pink, loves the beach.",
  },
  {
    label: "Warm sales lead",
    icon: "handshake",
    prompt: "Leo Park, sales director at Northwind. Warm, friendly, orange.",
  },
];

export const EXAMPLE_PROMPTS: string[] = EXAMPLES.map((e) => e.prompt);
