export interface SocialLink {
  platform: "linkedin" | "twitter" | "facebook" | "instagram" | "github" | "youtube" | "website";
  url: string;
}

// Element-level style overrides for visual editing
export interface ElementStyleOverride {
  fontWeight?: "normal" | "bold" | "500" | "600" | "700";
  fontStyle?: "normal" | "italic";
  textDecoration?: "none" | "underline";
  color?: string;
  fontSize?: number; // relative adjustment in px (+/- from base)
  letterSpacing?: string;
  textAlign?: "left" | "center" | "right";
  marginTop?: number;
  marginBottom?: number;
}

// Map of element IDs to their style overrides
export type ElementStyleOverrides = {
  [key in EditableElement]?: ElementStyleOverride;
};

// All editable elements in signature
export type EditableElement = 
  | "fullName"
  | "jobTitle"
  | "company"
  | "department"
  | "email"
  | "phone"
  | "website"
  | "address"
  | "disclaimer";

export interface SignatureData {
  // Personal Info
  fullName: string;
  jobTitle: string;
  company: string;
  department?: string;
  
  // Contact Info
  email: string;
  phone?: string;
  mobile?: string;
  fax?: string;
  
  // Address
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  
  // Web & Social
  website?: string;
  socialLinks: SocialLink[];
  
  // Branding
  logoUrl?: string;
  logoWidth?: number;
  profilePhotoUrl?: string;
  profilePhotoSize?: number;
  
  // Styling
  primaryColor: string;
  secondaryColor?: string;
  fontFamily: string;
  fontSize: number;
  
  // Additional
  disclaimer?: string;
  bannerUrl?: string;
  bannerLink?: string;
  calendarLink?: string;
  
  // GIF Support
  gifBannerUrl?: string;
  
  // Visual Editor Overrides
  styleOverrides?: ElementStyleOverrides;
}

export interface SignatureTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: "professional" | "creative" | "minimal" | "corporate";
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
};

export const FONT_CATEGORIES = [
  { id: "sans-serif", label: "Modern Sans-Serif" },
  { id: "serif", label: "Serif" },
  { id: "web-safe", label: "Classic Web-Safe" },
  { id: "system", label: "System Fonts" },
] as const;

export const FONT_OPTIONS = [
  // Modern Sans-Serif (Google Fonts)
  { label: "Inter", value: "var(--font-inter), 'Inter', system-ui, sans-serif", category: "sans-serif" },
  { label: "Roboto", value: "var(--font-roboto), 'Roboto', Arial, sans-serif", category: "sans-serif" },
  { label: "Open Sans", value: "var(--font-open-sans), 'Open Sans', Arial, sans-serif", category: "sans-serif" },
  { label: "Lato", value: "var(--font-lato), 'Lato', Arial, sans-serif", category: "sans-serif" },
  { label: "Montserrat", value: "var(--font-montserrat), 'Montserrat', Arial, sans-serif", category: "sans-serif" },
  { label: "Poppins", value: "var(--font-poppins), 'Poppins', Arial, sans-serif", category: "sans-serif" },
  { label: "Source Sans 3", value: "var(--font-source-sans), 'Source Sans 3', Arial, sans-serif", category: "sans-serif" },
  { label: "Nunito", value: "var(--font-nunito), 'Nunito', Arial, sans-serif", category: "sans-serif" },
  { label: "DM Sans", value: "var(--font-dm-sans), 'DM Sans', Arial, sans-serif", category: "sans-serif" },
  { label: "Outfit", value: "var(--font-outfit), 'Outfit', Arial, sans-serif", category: "sans-serif" },
  { label: "Plus Jakarta Sans", value: "var(--font-plus-jakarta), 'Plus Jakarta Sans', Arial, sans-serif", category: "sans-serif" },
  { label: "Manrope", value: "var(--font-manrope), 'Manrope', Arial, sans-serif", category: "sans-serif" },
  { label: "Space Grotesk", value: "var(--font-space-grotesk), 'Space Grotesk', Arial, sans-serif", category: "sans-serif" },
  { label: "Sora", value: "var(--font-sora), 'Sora', Arial, sans-serif", category: "sans-serif" },
  { label: "Lexend", value: "var(--font-lexend), 'Lexend', Arial, sans-serif", category: "sans-serif" },
  { label: "Onest", value: "var(--font-onest), 'Onest', Arial, sans-serif", category: "sans-serif" },
  { label: "Raleway", value: "var(--font-raleway), 'Raleway', Arial, sans-serif", category: "sans-serif" },
  { label: "Work Sans", value: "var(--font-work-sans), 'Work Sans', Arial, sans-serif", category: "sans-serif" },
  
  // Serif Fonts (Google Fonts)
  { label: "Playfair Display", value: "var(--font-playfair), 'Playfair Display', Georgia, serif", category: "serif" },
  { label: "Merriweather", value: "var(--font-merriweather), 'Merriweather', Georgia, serif", category: "serif" },
  { label: "Lora", value: "var(--font-lora), 'Lora', Georgia, serif", category: "serif" },
  { label: "Source Serif 4", value: "var(--font-source-serif), 'Source Serif 4', Georgia, serif", category: "serif" },
  
  // Classic Web-Safe Fonts
  { label: "Arial", value: "Arial, sans-serif", category: "web-safe" },
  { label: "Helvetica", value: "Helvetica, Arial, sans-serif", category: "web-safe" },
  { label: "Georgia", value: "Georgia, serif", category: "web-safe" },
  { label: "Times New Roman", value: "'Times New Roman', Times, serif", category: "web-safe" },
  { label: "Verdana", value: "Verdana, Geneva, sans-serif", category: "web-safe" },
  { label: "Trebuchet MS", value: "'Trebuchet MS', sans-serif", category: "web-safe" },
  { label: "Tahoma", value: "Tahoma, Geneva, sans-serif", category: "web-safe" },
  { label: "Courier New", value: "'Courier New', Courier, monospace", category: "web-safe" },
  { label: "Lucida Console", value: "'Lucida Console', Monaco, monospace", category: "web-safe" },
  { label: "Palatino", value: "'Palatino Linotype', 'Book Antiqua', Palatino, serif", category: "web-safe" },
  { label: "Garamond", value: "Garamond, Baskerville, 'Times New Roman', serif", category: "web-safe" },
  { label: "Century Gothic", value: "'Century Gothic', sans-serif", category: "web-safe" },
  
  // System Fonts
  { label: "System UI", value: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", category: "system" },
  { label: "SF Pro", value: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif", category: "system" },
  { label: "Segoe UI", value: "'Segoe UI', Tahoma, Geneva, sans-serif", category: "system" },
];

export const SOCIAL_PLATFORMS = [
  { id: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/yourprofile" },
  { id: "twitter", label: "Twitter/X", placeholder: "https://twitter.com/yourhandle" },
  { id: "facebook", label: "Facebook", placeholder: "https://facebook.com/yourpage" },
  { id: "instagram", label: "Instagram", placeholder: "https://instagram.com/yourhandle" },
  { id: "github", label: "GitHub", placeholder: "https://github.com/yourusername" },
  { id: "youtube", label: "YouTube", placeholder: "https://youtube.com/@yourchannel" },
  { id: "website", label: "Website", placeholder: "https://yourwebsite.com" },
] as const;

// Pre-set color themes
export interface ColorTheme {
  id: string;
  name: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  previewColors: string[]; // For visual preview swatch
}

export const COLOR_THEMES: ColorTheme[] = [
  {
    id: "professional-blue",
    name: "Professional Blue",
    description: "Classic corporate look",
    primaryColor: "#2563eb",
    secondaryColor: "#1e40af",
    accentColor: "#3b82f6",
    previewColors: ["#2563eb", "#1e40af", "#3b82f6", "#dbeafe"],
  },
  {
    id: "modern-slate",
    name: "Modern Slate",
    description: "Sleek and minimal",
    primaryColor: "#334155",
    secondaryColor: "#1e293b",
    accentColor: "#64748b",
    previewColors: ["#334155", "#1e293b", "#64748b", "#f1f5f9"],
  },
  {
    id: "vibrant-purple",
    name: "Vibrant Purple",
    description: "Creative and bold",
    primaryColor: "#7c3aed",
    secondaryColor: "#5b21b6",
    accentColor: "#a78bfa",
    previewColors: ["#7c3aed", "#5b21b6", "#a78bfa", "#ede9fe"],
  },
  {
    id: "emerald-fresh",
    name: "Emerald Fresh",
    description: "Clean and refreshing",
    primaryColor: "#059669",
    secondaryColor: "#047857",
    accentColor: "#34d399",
    previewColors: ["#059669", "#047857", "#34d399", "#d1fae5"],
  },
  {
    id: "sunset-orange",
    name: "Sunset Orange",
    description: "Warm and energetic",
    primaryColor: "#ea580c",
    secondaryColor: "#c2410c",
    accentColor: "#fb923c",
    previewColors: ["#ea580c", "#c2410c", "#fb923c", "#fed7aa"],
  },
  {
    id: "rose-elegant",
    name: "Rose Elegant",
    description: "Sophisticated charm",
    primaryColor: "#e11d48",
    secondaryColor: "#be123c",
    accentColor: "#fb7185",
    previewColors: ["#e11d48", "#be123c", "#fb7185", "#fecdd3"],
  },
  {
    id: "ocean-teal",
    name: "Ocean Teal",
    description: "Calm and trustworthy",
    primaryColor: "#0891b2",
    secondaryColor: "#0e7490",
    accentColor: "#22d3ee",
    previewColors: ["#0891b2", "#0e7490", "#22d3ee", "#cffafe"],
  },
  {
    id: "midnight-dark",
    name: "Midnight Dark",
    description: "Bold and powerful",
    primaryColor: "#18181b",
    secondaryColor: "#09090b",
    accentColor: "#52525b",
    previewColors: ["#18181b", "#09090b", "#52525b", "#fafafa"],
  },
  {
    id: "amber-gold",
    name: "Amber Gold",
    description: "Premium and luxurious",
    primaryColor: "#d97706",
    secondaryColor: "#b45309",
    accentColor: "#fbbf24",
    previewColors: ["#d97706", "#b45309", "#fbbf24", "#fef3c7"],
  },
  {
    id: "indigo-night",
    name: "Indigo Night",
    description: "Deep and mysterious",
    primaryColor: "#4f46e5",
    secondaryColor: "#3730a3",
    accentColor: "#818cf8",
    previewColors: ["#4f46e5", "#3730a3", "#818cf8", "#e0e7ff"],
  },
];
