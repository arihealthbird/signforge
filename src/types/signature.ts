export interface SocialLink {
  platform:
    | "linkedin"
    | "twitter"
    | "facebook"
    | "instagram"
    | "github"
    | "youtube"
    | "tiktok"
    | "website";
  url: string;
}

/**
 * The canonical signature model. This is the single source of truth shared by
 * the AI provider, the on-screen preview, the URL-sharing codec, and the
 * email-safe HTML exporter.
 */
export interface SignatureData {
  // Identity
  fullName: string;
  jobTitle: string;
  company: string;
  department?: string;

  // Contact
  email: string;
  phone?: string;
  website?: string;

  // Address
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;

  // Social
  socialLinks: SocialLink[];

  // Branding
  logoUrl?: string;
  profilePhotoUrl?: string;
  /**
   * When there is no profile photo, fill the photo slot with a monogram
   * (the person's initials on the accent colour). Defaults to on.
   */
  showMonogram?: boolean;

  // Banner (a static image or an animated GIF shown under the signature)
  bannerUrl?: string;
  bannerLink?: string;
  gifBannerUrl?: string;

  // Style
  primaryColor: string;
  secondaryColor?: string;
  textColor?: string;
  fontFamily: string;
  fontSize: number;

  // Extra content
  disclaimer?: string;
  calendarLink?: string;

  // Layout
  dividerStyle?: "solid" | "dashed" | "dotted" | "none";
  photoShape?: "circle" | "rounded" | "square";
  contentPadding?: "compact" | "normal" | "relaxed";
}

export const DEFAULT_SIGNATURE_DATA: SignatureData = {
  fullName: "",
  jobTitle: "",
  company: "",
  email: "",
  socialLinks: [],
  primaryColor: "#6366f1",
  fontFamily: "var(--font-inter), 'Inter', system-ui, sans-serif",
  fontSize: 14,
  dividerStyle: "solid",
  photoShape: "circle",
  contentPadding: "normal",
};

export const FONT_CATEGORIES = [
  { id: "sans-serif", label: "Modern Sans-Serif" },
  { id: "serif", label: "Serif" },
  { id: "web-safe", label: "Classic Web-Safe" },
] as const;

export interface FontOption {
  label: string;
  value: string;
  category: "sans-serif" | "serif" | "web-safe";
}

export const FONT_OPTIONS: FontOption[] = [
  // Modern Sans-Serif (self-hosted via next/font)
  { label: "Inter", value: "var(--font-inter), 'Inter', system-ui, sans-serif", category: "sans-serif" },
  { label: "Roboto", value: "var(--font-roboto), 'Roboto', Arial, sans-serif", category: "sans-serif" },
  { label: "Open Sans", value: "var(--font-open-sans), 'Open Sans', Arial, sans-serif", category: "sans-serif" },
  { label: "Montserrat", value: "var(--font-montserrat), 'Montserrat', Arial, sans-serif", category: "sans-serif" },
  { label: "Poppins", value: "var(--font-poppins), 'Poppins', Arial, sans-serif", category: "sans-serif" },
  { label: "DM Sans", value: "var(--font-dm-sans), 'DM Sans', Arial, sans-serif", category: "sans-serif" },
  { label: "Outfit", value: "var(--font-outfit), 'Outfit', Arial, sans-serif", category: "sans-serif" },
  { label: "Plus Jakarta Sans", value: "var(--font-plus-jakarta), 'Plus Jakarta Sans', Arial, sans-serif", category: "sans-serif" },
  { label: "Space Grotesk", value: "var(--font-space-grotesk), 'Space Grotesk', Arial, sans-serif", category: "sans-serif" },
  { label: "Manrope", value: "var(--font-manrope), 'Manrope', Arial, sans-serif", category: "sans-serif" },

  // Serif (self-hosted via next/font)
  { label: "Playfair Display", value: "var(--font-playfair), 'Playfair Display', Georgia, serif", category: "serif" },
  { label: "Merriweather", value: "var(--font-merriweather), 'Merriweather', Georgia, serif", category: "serif" },
  { label: "Lora", value: "var(--font-lora), 'Lora', Georgia, serif", category: "serif" },

  // Classic Web-Safe (no loading required)
  { label: "Arial", value: "Arial, Helvetica, sans-serif", category: "web-safe" },
  { label: "Helvetica", value: "Helvetica, Arial, sans-serif", category: "web-safe" },
  { label: "Georgia", value: "Georgia, 'Times New Roman', serif", category: "web-safe" },
  { label: "Times New Roman", value: "'Times New Roman', Times, serif", category: "web-safe" },
  { label: "Verdana", value: "Verdana, Geneva, sans-serif", category: "web-safe" },
];

export const SOCIAL_PLATFORMS = [
  { id: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/yourprofile" },
  { id: "twitter", label: "Twitter/X", placeholder: "https://twitter.com/yourhandle" },
  { id: "facebook", label: "Facebook", placeholder: "https://facebook.com/yourpage" },
  { id: "instagram", label: "Instagram", placeholder: "https://instagram.com/yourhandle" },
  { id: "github", label: "GitHub", placeholder: "https://github.com/yourusername" },
  { id: "youtube", label: "YouTube", placeholder: "https://youtube.com/@yourchannel" },
  { id: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@yourhandle" },
  { id: "website", label: "Website", placeholder: "https://yourwebsite.com" },
] as const;

export interface ColorTheme {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
}

export const COLOR_THEMES: ColorTheme[] = [
  { id: "professional-blue", name: "Professional Blue", primaryColor: "#2563eb", secondaryColor: "#1e40af" },
  { id: "modern-slate", name: "Modern Slate", primaryColor: "#334155", secondaryColor: "#1e293b" },
  { id: "vibrant-purple", name: "Vibrant Purple", primaryColor: "#7c3aed", secondaryColor: "#5b21b6" },
  { id: "emerald-fresh", name: "Emerald Fresh", primaryColor: "#059669", secondaryColor: "#047857" },
  { id: "sunset-orange", name: "Sunset Orange", primaryColor: "#ea580c", secondaryColor: "#c2410c" },
  { id: "rose-elegant", name: "Rose Elegant", primaryColor: "#e11d48", secondaryColor: "#be123c" },
  { id: "ocean-teal", name: "Ocean Teal", primaryColor: "#0891b2", secondaryColor: "#0e7490" },
  { id: "midnight-dark", name: "Midnight Dark", primaryColor: "#18181b", secondaryColor: "#09090b" },
  { id: "amber-gold", name: "Amber Gold", primaryColor: "#d97706", secondaryColor: "#b45309" },
  { id: "indigo-night", name: "Indigo Night", primaryColor: "#4f46e5", secondaryColor: "#3730a3" },
];
