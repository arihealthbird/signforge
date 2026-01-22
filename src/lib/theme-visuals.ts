import { EmailThemeId } from "./email-themes";

// Floating SVG element definition
export interface FloatingElement {
  id: string;
  svg: string; // SVG markup
  size: number; // Base size in pixels
  opacity: number;
  animationDuration: number; // seconds
  animationDelay: number; // seconds
  startPosition: { x: string; y: string }; // CSS values
  endPosition?: { x: string; y: string }; // Optional end position for drift
  rotation?: number; // degrees
  rotationAnimation?: boolean;
}

// Background type priority: video > rive > lottie > particles
export type BackgroundType = "video" | "rive" | "lottie" | "particles" | "none";

// Theme visuals configuration
export interface ThemeVisuals {
  // Primary background type to use
  primaryBackground: BackgroundType;
  
  // Lottie animation config
  lottieUrl?: string; // URL to Lottie JSON animation
  lottieOpacity?: number;
  
  // Rive animation config
  riveUrl?: string; // URL to .riv file
  riveOpacity?: number;
  riveStateMachine?: string; // State machine name if needed
  
  // Video background config
  videoUrl?: string; // URL to mp4 video (local or remote)
  videoUrlWebm?: string; // Optional WebM fallback
  videoOpacity?: number;
  videoBlendMode?: "screen" | "overlay" | "multiply" | "normal";
  videoFilter?: string; // CSS filter (e.g., "hue-rotate(180deg)")
  
  // Floating elements
  floatingElements: FloatingElement[];
  
  // Ambient glow effect
  ambientGlow?: {
    color: string;
    intensity: number;
  };
}

// SVG Icons for each theme
const svgIcons = {
  // Lightsaber (for Vader/Yoda)
  lightsaberRed: `<svg viewBox="0 0 24 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="9" y="44" width="6" height="20" rx="1" fill="#4a4a4a"/>
    <rect x="8" y="48" width="8" height="3" fill="#666"/>
    <rect x="10" y="0" width="4" height="44" fill="#ef4444" opacity="0.9"/>
    <rect x="11" y="0" width="2" height="44" fill="#ff6b6b"/>
    <rect x="10" y="0" width="4" height="44" fill="url(#redGlow)" opacity="0.5"/>
    <defs><linearGradient id="redGlow" x1="12" y1="0" x2="12" y2="44"><stop stop-color="#ff0000"/><stop offset="1" stop-color="#ff0000" stop-opacity="0"/></linearGradient></defs>
  </svg>`,
  
  lightsaberGreen: `<svg viewBox="0 0 24 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="9" y="44" width="6" height="20" rx="1" fill="#4a4a4a"/>
    <rect x="8" y="48" width="8" height="3" fill="#666"/>
    <rect x="10" y="0" width="4" height="44" fill="#22c55e" opacity="0.9"/>
    <rect x="11" y="0" width="2" height="44" fill="#4ade80"/>
    <rect x="10" y="0" width="4" height="44" fill="url(#greenGlow)" opacity="0.5"/>
    <defs><linearGradient id="greenGlow" x1="12" y1="0" x2="12" y2="44"><stop stop-color="#22c55e"/><stop offset="1" stop-color="#22c55e" stop-opacity="0"/></linearGradient></defs>
  </svg>`,

  // Imperial/Rebel symbols
  imperial: `<svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="14" stroke="currentColor" stroke-width="2" fill="none" opacity="0.3"/>
    <circle cx="16" cy="16" r="4" fill="currentColor"/>
    <path d="M16 2 L16 8 M16 24 L16 30 M2 16 L8 16 M24 16 L30 16" stroke="currentColor" stroke-width="2"/>
    <path d="M5 5 L10 10 M22 22 L27 27 M27 5 L22 10 M5 27 L10 22" stroke="currentColor" stroke-width="1.5"/>
  </svg>`,

  // Jedi symbol
  jedi: `<svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 2 L18 12 L28 14 L18 16 L16 26 L14 16 L4 14 L14 12 Z" fill="currentColor" opacity="0.6"/>
    <circle cx="16" cy="14" r="3" fill="currentColor"/>
  </svg>`,

  // Spider web - detailed web pattern
  spiderWeb: `<svg viewBox="0 0 60 60" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
    <!-- Concentric circles -->
    <circle cx="30" cy="30" r="28" stroke-width="0.5" opacity="0.25"/>
    <circle cx="30" cy="30" r="22" stroke-width="0.5" opacity="0.3"/>
    <circle cx="30" cy="30" r="16" stroke-width="0.5" opacity="0.35"/>
    <circle cx="30" cy="30" r="10" stroke-width="0.5" opacity="0.4"/>
    <circle cx="30" cy="30" r="5" stroke-width="0.5" opacity="0.5"/>
    <!-- Radial lines -->
    <line x1="30" y1="2" x2="30" y2="58" stroke-width="0.5" opacity="0.3"/>
    <line x1="2" y1="30" x2="58" y2="30" stroke-width="0.5" opacity="0.3"/>
    <line x1="6" y1="6" x2="54" y2="54" stroke-width="0.5" opacity="0.3"/>
    <line x1="54" y1="6" x2="6" y2="54" stroke-width="0.5" opacity="0.3"/>
    <line x1="30" y1="2" x2="12" y2="52" stroke-width="0.5" opacity="0.25"/>
    <line x1="30" y1="2" x2="48" y2="52" stroke-width="0.5" opacity="0.25"/>
    <line x1="2" y1="30" x2="52" y2="12" stroke-width="0.5" opacity="0.25"/>
    <line x1="2" y1="30" x2="52" y2="48" stroke-width="0.5" opacity="0.25"/>
  </svg>`,

  // Spider emblem - iconic Spider-Man spider
  spider: `<svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="16" cy="18" rx="5" ry="6" fill="currentColor"/>
    <circle cx="16" cy="10" r="4" fill="currentColor"/>
    <!-- Spider legs -->
    <path d="M11 10 Q6 6 3 8" stroke="currentColor" stroke-width="1.5" fill="none"/>
    <path d="M21 10 Q26 6 29 8" stroke="currentColor" stroke-width="1.5" fill="none"/>
    <path d="M10 14 Q4 12 2 16" stroke="currentColor" stroke-width="1.5" fill="none"/>
    <path d="M22 14 Q28 12 30 16" stroke="currentColor" stroke-width="1.5" fill="none"/>
    <path d="M10 20 Q4 22 2 26" stroke="currentColor" stroke-width="1.5" fill="none"/>
    <path d="M22 20 Q28 22 30 26" stroke="currentColor" stroke-width="1.5" fill="none"/>
    <path d="M12 24 Q8 28 6 30" stroke="currentColor" stroke-width="1.5" fill="none"/>
    <path d="M20 24 Q24 28 26 30" stroke="currentColor" stroke-width="1.5" fill="none"/>
  </svg>`,

  // Web shooter - projectile web
  webShooter: `<svg viewBox="0 0 40 20" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 10 Q10 8 20 10 Q30 12 40 10" stroke-width="1" opacity="0.6"/>
    <path d="M0 10 Q10 12 20 10 Q30 8 40 10" stroke-width="1" opacity="0.6"/>
    <path d="M5 10 L35 10" stroke-width="0.5" opacity="0.4"/>
    <circle cx="5" cy="10" r="2" fill="currentColor" opacity="0.5"/>
  </svg>`,

  // NYC Building silhouette
  nycBuilding: `<svg viewBox="0 0 40 60" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="20" width="30" height="40" fill="currentColor" opacity="0.3"/>
    <rect x="10" y="0" width="6" height="60" fill="currentColor" opacity="0.25"/>
    <rect x="24" y="10" width="6" height="50" fill="currentColor" opacity="0.25"/>
    <rect x="8" y="25" width="4" height="4" fill="currentColor" opacity="0.15"/>
    <rect x="18" y="25" width="4" height="4" fill="currentColor" opacity="0.15"/>
    <rect x="28" y="25" width="4" height="4" fill="currentColor" opacity="0.15"/>
    <rect x="8" y="35" width="4" height="4" fill="currentColor" opacity="0.15"/>
    <rect x="18" y="35" width="4" height="4" fill="currentColor" opacity="0.15"/>
    <rect x="28" y="35" width="4" height="4" fill="currentColor" opacity="0.15"/>
  </svg>`,

  // Skull (pirate)
  skull: `<svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="16" cy="13" rx="10" ry="11" fill="currentColor" opacity="0.9"/>
    <circle cx="11" cy="12" r="3" fill="#000"/>
    <circle cx="21" cy="12" r="3" fill="#000"/>
    <path d="M12 20 L14 18 L16 20 L18 18 L20 20" stroke="#000" stroke-width="1.5" fill="none"/>
    <rect x="13" y="24" width="2" height="4" fill="currentColor"/>
    <rect x="17" y="24" width="2" height="4" fill="currentColor"/>
  </svg>`,

  // Anchor
  anchor: `<svg viewBox="0 0 24 32" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="4" r="3" stroke-width="2"/>
    <line x1="12" y1="7" x2="12" y2="28" stroke-width="2"/>
    <path d="M4 20 Q4 28 12 28 Q20 28 20 20" stroke-width="2" fill="none"/>
    <line x1="6" y1="16" x2="18" y2="16" stroke-width="2"/>
  </svg>`,

  // Coin/Doubloon
  coin: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="currentColor"/>
    <circle cx="12" cy="12" r="8" stroke="#000" stroke-opacity="0.2" stroke-width="1" fill="none"/>
    <text x="12" y="16" text-anchor="middle" font-size="10" fill="#000" opacity="0.3">$</text>
  </svg>`,

  // Theater masks
  theaterMask: `<svg viewBox="0 0 32 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="10" cy="12" rx="8" ry="10" fill="currentColor" opacity="0.8"/>
    <circle cx="7" cy="10" r="2" fill="#000" opacity="0.5"/>
    <circle cx="13" cy="10" r="2" fill="#000" opacity="0.5"/>
    <path d="M6 16 Q10 20 14 16" stroke="#000" stroke-width="1" fill="none" opacity="0.5"/>
    <ellipse cx="22" cy="12" rx="8" ry="10" fill="currentColor" opacity="0.6"/>
    <circle cx="19" cy="10" r="2" fill="#000" opacity="0.5"/>
    <circle cx="25" cy="10" r="2" fill="#000" opacity="0.5"/>
    <path d="M18 16 Q22 13 26 16" stroke="#000" stroke-width="1" fill="none" opacity="0.5"/>
  </svg>`,

  // Quill
  quill: `<svg viewBox="0 0 24 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0 Q20 8 20 20 Q20 32 12 48 Q12 32 8 24 Q4 16 12 0" fill="currentColor" opacity="0.7"/>
    <line x1="12" y1="10" x2="12" y2="44" stroke="currentColor" stroke-width="1" opacity="0.5"/>
  </svg>`,

  // Star
  star: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <polygon points="12,2 15,9 22,9 16,14 18,22 12,17 6,22 8,14 2,9 9,9" fill="currentColor"/>
  </svg>`,

  // Wave
  wave: `<svg viewBox="0 0 48 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 12 Q6 6 12 12 Q18 18 24 12 Q30 6 36 12 Q42 18 48 12" stroke-width="2" fill="none"/>
  </svg>`,

  // Surfboard
  surfboard: `<svg viewBox="0 0 12 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="6" cy="24" rx="5" ry="22" fill="currentColor"/>
    <line x1="6" y1="8" x2="6" y2="40" stroke="#fff" stroke-width="1" opacity="0.3"/>
  </svg>`,

  // Sun
  sun: `<svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="8" fill="currentColor"/>
    <g stroke="currentColor" stroke-width="2">
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="16" y1="26" x2="16" y2="30"/>
      <line x1="2" y1="16" x2="6" y2="16"/>
      <line x1="26" y1="16" x2="30" y2="16"/>
      <line x1="6" y1="6" x2="9" y2="9"/>
      <line x1="23" y1="23" x2="26" y2="26"/>
      <line x1="6" y1="26" x2="9" y2="23"/>
      <line x1="23" y1="9" x2="26" y2="6"/>
    </g>
  </svg>`,

  // Tiki Torch - Classic Hawaiian torch with flame
  tikiTorch: `<svg viewBox="0 0 24 80" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <!-- Flame -->
    <path d="M12 0 C8 5, 6 10, 8 16 C6 14, 5 18, 8 22 C5 20, 4 24, 12 28 C20 24, 19 20, 16 22 C19 18, 18 14, 16 16 C18 10, 16 5, 12 0" fill="#f97316" opacity="0.9"/>
    <path d="M12 4 C10 7, 9 11, 10 15 C8 13, 8 16, 10 19 C8 18, 7 21, 12 24 C17 21, 16 18, 14 19 C16 16, 16 13, 14 15 C15 11, 14 7, 12 4" fill="#fbbf24" opacity="0.95"/>
    <ellipse cx="12" cy="8" rx="3" ry="4" fill="#fef3c7" opacity="0.6"/>
    <!-- Torch bowl -->
    <path d="M6 28 L8 26 L16 26 L18 28 L17 32 L7 32 Z" fill="#92400e"/>
    <ellipse cx="12" cy="26" rx="5" ry="2" fill="#78350f"/>
    <!-- Bamboo pole with segments -->
    <rect x="10" y="32" width="4" height="48" fill="#a16207" rx="1"/>
    <rect x="9" y="40" width="6" height="2" fill="#854d0e" rx="0.5"/>
    <rect x="9" y="52" width="6" height="2" fill="#854d0e" rx="0.5"/>
    <rect x="9" y="64" width="6" height="2" fill="#854d0e" rx="0.5"/>
    <!-- Bamboo texture lines -->
    <line x1="11" y1="34" x2="11" y2="80" stroke="#78350f" stroke-width="0.5" opacity="0.3"/>
    <line x1="13" y1="34" x2="13" y2="80" stroke="#78350f" stroke-width="0.5" opacity="0.3"/>
  </svg>`,

  // Tiki Head (Moai-style) - Hawaiian tiki god carving
  tikiHead: `<svg viewBox="0 0 40 56" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <!-- Head shape -->
    <path d="M8 12 C8 4, 32 4, 32 12 L34 44 C34 52, 6 52, 6 44 Z" fill="#92400e"/>
    <!-- Face details -->
    <rect x="12" y="18" width="6" height="8" rx="1" fill="#451a03" opacity="0.8"/>
    <rect x="22" y="18" width="6" height="8" rx="1" fill="#451a03" opacity="0.8"/>
    <!-- Eyebrow ridges -->
    <path d="M10 16 L19 14 L19 16 L10 18 Z" fill="#78350f"/>
    <path d="M30 16 L21 14 L21 16 L30 18 Z" fill="#78350f"/>
    <!-- Nose -->
    <path d="M18 28 L20 26 L22 28 L22 34 L18 34 Z" fill="#78350f"/>
    <!-- Mouth with teeth -->
    <rect x="14" y="38" width="12" height="6" rx="1" fill="#451a03"/>
    <rect x="15" y="39" width="3" height="4" fill="#f5f5f4" opacity="0.9"/>
    <rect x="19" y="39" width="3" height="4" fill="#f5f5f4" opacity="0.9"/>
    <rect x="23" y="39" width="3" height="4" fill="#f5f5f4" opacity="0.9"/>
    <!-- Ear decorations -->
    <ellipse cx="6" cy="28" rx="3" ry="6" fill="#78350f"/>
    <ellipse cx="34" cy="28" rx="3" ry="6" fill="#78350f"/>
    <!-- Crown/headdress detail -->
    <path d="M12 8 L14 4 L16 8 M18 6 L20 2 L22 6 M24 8 L26 4 L28 8" stroke="#78350f" stroke-width="2" fill="none"/>
    <!-- Wood grain texture -->
    <path d="M10 20 C15 22, 25 20, 30 22" stroke="#78350f" stroke-width="0.5" fill="none" opacity="0.4"/>
    <path d="M8 32 C14 34, 26 32, 32 34" stroke="#78350f" stroke-width="0.5" fill="none" opacity="0.4"/>
  </svg>`,

  // Hibiscus Flower - Classic Hawaiian flower
  hibiscus: `<svg viewBox="0 0 40 40" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <!-- Petals -->
    <ellipse cx="20" cy="8" rx="7" ry="10" fill="#ec4899" opacity="0.9"/>
    <ellipse cx="8" cy="18" rx="10" ry="7" fill="#ec4899" opacity="0.85" transform="rotate(-20 8 18)"/>
    <ellipse cx="32" cy="18" rx="10" ry="7" fill="#ec4899" opacity="0.85" transform="rotate(20 32 18)"/>
    <ellipse cx="12" cy="32" rx="8" ry="10" fill="#ec4899" opacity="0.8" transform="rotate(30 12 32)"/>
    <ellipse cx="28" cy="32" rx="8" ry="10" fill="#ec4899" opacity="0.8" transform="rotate(-30 28 32)"/>
    <!-- Petal veins -->
    <line x1="20" y1="4" x2="20" y2="14" stroke="#be185d" stroke-width="0.8" opacity="0.5"/>
    <line x1="4" y1="18" x2="14" y2="18" stroke="#be185d" stroke-width="0.8" opacity="0.5"/>
    <line x1="26" y1="18" x2="36" y2="18" stroke="#be185d" stroke-width="0.8" opacity="0.5"/>
    <!-- Center -->
    <circle cx="20" cy="20" r="6" fill="#fbbf24"/>
    <circle cx="20" cy="20" r="4" fill="#f59e0b"/>
    <!-- Stamen -->
    <line x1="20" y1="12" x2="20" y2="20" stroke="#dc2626" stroke-width="2"/>
    <circle cx="20" cy="11" r="1.5" fill="#fef3c7"/>
    <line x1="18" y1="14" x2="16" y2="10" stroke="#dc2626" stroke-width="1"/>
    <circle cx="16" cy="9" r="1" fill="#fef3c7"/>
    <line x1="22" y1="14" x2="24" y2="10" stroke="#dc2626" stroke-width="1"/>
    <circle cx="24" cy="9" r="1" fill="#fef3c7"/>
  </svg>`,

  // Palm Tree - Tropical palm silhouette
  palmTree: `<svg viewBox="0 0 48 64" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <!-- Trunk -->
    <path d="M22 28 C20 40, 18 52, 20 64 L28 64 C30 52, 28 40, 26 28" fill="#92400e"/>
    <!-- Trunk texture -->
    <path d="M20 32 C24 33, 26 32, 28 33" stroke="#78350f" stroke-width="1" fill="none"/>
    <path d="M19 40 C24 41, 26 40, 29 41" stroke="#78350f" stroke-width="1" fill="none"/>
    <path d="M18 50 C24 51, 26 50, 30 51" stroke="#78350f" stroke-width="1" fill="none"/>
    <!-- Palm fronds -->
    <path d="M24 26 C30 20, 42 18, 48 22 C42 20, 34 22, 24 26" fill="#22c55e" opacity="0.9"/>
    <path d="M24 26 C18 20, 6 18, 0 22 C6 20, 14 22, 24 26" fill="#22c55e" opacity="0.9"/>
    <path d="M24 24 C28 14, 38 8, 46 6 C38 10, 30 16, 24 24" fill="#16a34a" opacity="0.85"/>
    <path d="M24 24 C20 14, 10 8, 2 6 C10 10, 18 16, 24 24" fill="#16a34a" opacity="0.85"/>
    <path d="M24 22 C26 10, 30 2, 36 0 C32 4, 28 12, 24 22" fill="#15803d" opacity="0.8"/>
    <path d="M24 22 C22 10, 18 2, 12 0 C16 4, 20 12, 24 22" fill="#15803d" opacity="0.8"/>
    <!-- Coconuts -->
    <circle cx="22" cy="27" r="3" fill="#78350f"/>
    <circle cx="26" cy="28" r="2.5" fill="#92400e"/>
    <circle cx="24" cy="25" r="2" fill="#78350f"/>
  </svg>`,

  // Plumeria/Frangipani - Hawaiian lei flower
  plumeria: `<svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <!-- Petals -->
    <ellipse cx="16" cy="6" rx="5" ry="8" fill="#fef3c7" opacity="0.95"/>
    <ellipse cx="6" cy="14" rx="8" ry="5" fill="#fef3c7" opacity="0.9" transform="rotate(-30 6 14)"/>
    <ellipse cx="26" cy="14" rx="8" ry="5" fill="#fef3c7" opacity="0.9" transform="rotate(30 26 14)"/>
    <ellipse cx="10" cy="26" rx="6" ry="8" fill="#fef3c7" opacity="0.85" transform="rotate(20 10 26)"/>
    <ellipse cx="22" cy="26" rx="6" ry="8" fill="#fef3c7" opacity="0.85" transform="rotate(-20 22 26)"/>
    <!-- Yellow gradient at center of petals -->
    <ellipse cx="16" cy="10" rx="3" ry="4" fill="#fbbf24" opacity="0.6"/>
    <ellipse cx="9" cy="15" rx="4" ry="3" fill="#fbbf24" opacity="0.5" transform="rotate(-30 9 15)"/>
    <ellipse cx="23" cy="15" rx="4" ry="3" fill="#fbbf24" opacity="0.5" transform="rotate(30 23 15)"/>
    <!-- Center -->
    <circle cx="16" cy="16" r="4" fill="#fbbf24"/>
    <circle cx="16" cy="16" r="2" fill="#f59e0b"/>
  </svg>`,

  // Ocean Wave - Detailed wave pattern
  oceanWave: `<svg viewBox="0 0 80 32" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
    <!-- Main wave -->
    <path d="M0 20 C10 8, 20 8, 30 16 C40 24, 50 24, 60 16 C70 8, 80 8, 90 20" stroke="currentColor" stroke-width="3" fill="none" opacity="0.8"/>
    <!-- Wave foam/crest -->
    <path d="M25 14 C28 10, 32 10, 35 14" stroke="currentColor" stroke-width="2" fill="none" opacity="0.6"/>
    <path d="M55 14 C58 10, 62 10, 65 14" stroke="currentColor" stroke-width="2" fill="none" opacity="0.6"/>
    <!-- Secondary wave -->
    <path d="M0 26 C15 18, 25 18, 40 24 C55 30, 65 30, 80 26" stroke="currentColor" stroke-width="1.5" fill="none" opacity="0.5"/>
    <!-- Spray dots -->
    <circle cx="28" cy="10" r="1" fill="currentColor" opacity="0.4"/>
    <circle cx="32" cy="8" r="1.5" fill="currentColor" opacity="0.3"/>
    <circle cx="58" cy="10" r="1" fill="currentColor" opacity="0.4"/>
    <circle cx="62" cy="8" r="1.5" fill="currentColor" opacity="0.3"/>
  </svg>`,

  // Tropical Fish - Colorful reef fish
  tropicalFish: `<svg viewBox="0 0 40 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <!-- Body -->
    <ellipse cx="20" cy="12" rx="14" ry="8" fill="#06b6d4"/>
    <!-- Stripes -->
    <path d="M14 6 C14 10, 14 14, 14 18" stroke="#0891b2" stroke-width="2" opacity="0.6"/>
    <path d="M20 5 C20 10, 20 14, 20 19" stroke="#0891b2" stroke-width="2" opacity="0.6"/>
    <path d="M26 6 C26 10, 26 14, 26 18" stroke="#0891b2" stroke-width="2" opacity="0.6"/>
    <!-- Tail -->
    <path d="M34 12 L40 6 L40 18 Z" fill="#f97316"/>
    <!-- Fins -->
    <path d="M18 4 C22 0, 26 2, 24 6" fill="#f97316" opacity="0.9"/>
    <path d="M18 20 C22 24, 26 22, 24 18" fill="#0891b2" opacity="0.7"/>
    <!-- Eye -->
    <circle cx="10" cy="10" r="3" fill="#fff"/>
    <circle cx="9" cy="10" r="1.5" fill="#1e293b"/>
    <!-- Mouth -->
    <path d="M4 12 C6 11, 6 13, 4 12" stroke="#0e7490" stroke-width="1" fill="none"/>
  </svg>`,

  // Ukulele - Hawaiian instrument
  ukulele: `<svg viewBox="0 0 20 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <!-- Body -->
    <ellipse cx="10" cy="38" rx="9" ry="9" fill="#d97706"/>
    <ellipse cx="10" cy="38" rx="7" ry="7" fill="#b45309" opacity="0.3"/>
    <!-- Sound hole -->
    <circle cx="10" cy="38" r="3" fill="#451a03"/>
    <!-- Neck -->
    <rect x="8" y="6" width="4" height="24" fill="#92400e" rx="1"/>
    <!-- Headstock -->
    <rect x="7" y="2" width="6" height="6" fill="#78350f" rx="1"/>
    <!-- Tuning pegs -->
    <circle cx="6" cy="4" r="1.5" fill="#d4d4d4"/>
    <circle cx="14" cy="4" r="1.5" fill="#d4d4d4"/>
    <circle cx="6" cy="8" r="1.5" fill="#d4d4d4"/>
    <circle cx="14" cy="8" r="1.5" fill="#d4d4d4"/>
    <!-- Strings -->
    <line x1="9" y1="8" x2="9" y2="42" stroke="#fef3c7" stroke-width="0.3"/>
    <line x1="10" y1="8" x2="10" y2="42" stroke="#fef3c7" stroke-width="0.3"/>
    <line x1="11" y1="8" x2="11" y2="42" stroke="#fef3c7" stroke-width="0.3"/>
    <!-- Bridge -->
    <rect x="8" y="42" width="4" height="2" fill="#451a03" rx="0.5"/>
  </svg>`,

  // Shaka Hand - Hang loose gesture
  shaka: `<svg viewBox="0 0 40 40" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <!-- Palm -->
    <ellipse cx="20" cy="24" rx="10" ry="8" fill="#fcd34d"/>
    <!-- Thumb (extended) -->
    <path d="M8 18 C4 16, 2 18, 4 22 C6 26, 10 26, 12 24" fill="#fcd34d"/>
    <!-- Pinky (extended) -->
    <path d="M32 18 C36 16, 38 18, 36 22 C34 26, 30 26, 28 24" fill="#fcd34d"/>
    <!-- Folded fingers -->
    <ellipse cx="16" cy="18" rx="3" ry="5" fill="#fcd34d"/>
    <ellipse cx="20" cy="17" rx="3" ry="5" fill="#fcd34d"/>
    <ellipse cx="24" cy="18" rx="3" ry="5" fill="#fcd34d"/>
    <!-- Finger detail lines -->
    <path d="M14 16 L14 20" stroke="#d97706" stroke-width="0.5" opacity="0.4"/>
    <path d="M20 15 L20 19" stroke="#d97706" stroke-width="0.5" opacity="0.4"/>
    <path d="M26 16 L26 20" stroke="#d97706" stroke-width="0.5" opacity="0.4"/>
    <!-- Wrist -->
    <rect x="14" y="30" width="12" height="8" fill="#fcd34d" rx="2"/>
  </svg>`,

  // Sunset - Hawaiian sunset
  sunset: `<svg viewBox="0 0 48 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <!-- Sun -->
    <circle cx="24" cy="20" r="12" fill="#f97316"/>
    <circle cx="24" cy="20" r="10" fill="#fbbf24" opacity="0.8"/>
    <circle cx="24" cy="20" r="6" fill="#fef3c7" opacity="0.6"/>
    <!-- Horizon line mask -->
    <rect x="0" y="20" width="48" height="12" fill="#0891b2" opacity="0.8"/>
    <!-- Sun reflection -->
    <ellipse cx="24" cy="26" rx="8" ry="4" fill="#f97316" opacity="0.4"/>
    <ellipse cx="24" cy="28" rx="12" ry="3" fill="#fbbf24" opacity="0.2"/>
  </svg>`,

  // Paper clip
  paperClip: `<svg viewBox="0 0 24 48" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 12 L18 34 C18 40 14 44 8 44 C2 44 -2 38 2 32 L8 10 C10 4 18 4 18 12" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.7"/>
    <path d="M10 14 L10 32 C10 36 12 38 14 36" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.5"/>
  </svg>`,

  // Post-it note
  postIt: `<svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 4 L28 4 L28 22 L22 28 L4 28 Z" fill="currentColor" opacity="0.9"/>
    <path d="M22 22 L22 28 L28 22 Z" fill="currentColor" opacity="0.6"/>
    <line x1="8" y1="10" x2="20" y2="10" stroke="#000" stroke-width="1" opacity="0.2"/>
    <line x1="8" y1="14" x2="18" y2="14" stroke="#000" stroke-width="1" opacity="0.2"/>
    <line x1="8" y1="18" x2="16" y2="18" stroke="#000" stroke-width="1" opacity="0.2"/>
  </svg>`,

  // Pencil
  pencil: `<svg viewBox="0 0 12 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <polygon points="6,0 10,8 10,40 2,40 2,8" fill="#f4d03f" opacity="0.9"/>
    <polygon points="6,0 2,8 10,8" fill="#2c2c2c"/>
    <rect x="2" y="38" width="8" height="6" fill="#ffb6c1" opacity="0.8"/>
    <rect x="2" y="36" width="8" height="3" fill="#c0c0c0"/>
    <line x1="6" y1="8" x2="6" y2="36" stroke="#c9a227" stroke-width="1" opacity="0.3"/>
  </svg>`,

  // Coffee mug
  coffeeMug: `<svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="8" width="20" height="20" rx="2" fill="currentColor" opacity="0.9"/>
    <path d="M24 12 L28 12 C30 12 32 14 32 17 C32 20 30 22 28 22 L24 22" stroke="currentColor" stroke-width="2" fill="none"/>
    <ellipse cx="14" cy="10" rx="8" ry="2" fill="#6b4423" opacity="0.6"/>
    <path d="M10 4 Q12 2 14 4 Q16 6 18 4" stroke="currentColor" stroke-width="1.5" fill="none" opacity="0.4"/>
  </svg>`,

  // Stapler
  stapler: `<svg viewBox="0 0 48 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="14" width="40" height="8" rx="2" fill="#dc2626" opacity="0.9"/>
    <path d="M8 14 L8 8 L36 8 L36 14" fill="#991b1b" opacity="0.8"/>
    <rect x="6" y="6" width="4" height="4" rx="1" fill="#666" opacity="0.7"/>
  </svg>`,

  // Dundie trophy
  dundie: `<svg viewBox="0 0 24 40" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="12" cy="36" rx="8" ry="3" fill="#4a3728" opacity="0.9"/>
    <rect x="10" y="28" width="4" height="10" fill="#8b7355"/>
    <path d="M4 8 L4 20 C4 24 8 26 12 26 C16 26 20 24 20 20 L20 8 Z" fill="#ffd700" opacity="0.9"/>
    <path d="M4 8 C4 6 8 4 12 4 C16 4 20 6 20 8" fill="#ffd700"/>
    <path d="M0 10 L4 12 L4 16 L0 14 Z" fill="#ffd700" opacity="0.7"/>
    <path d="M24 10 L20 12 L20 16 L24 14 Z" fill="#ffd700" opacity="0.7"/>
  </svg>`,

  // Paper sheet
  paper: `<svg viewBox="0 0 28 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 0 L20 0 L28 8 L28 36 L0 36 Z" fill="#fff" opacity="0.95"/>
    <path d="M20 0 L20 8 L28 8" fill="#e5e5e5"/>
    <line x1="4" y1="12" x2="24" y2="12" stroke="#ccc" stroke-width="0.5"/>
    <line x1="4" y1="16" x2="24" y2="16" stroke="#ccc" stroke-width="0.5"/>
    <line x1="4" y1="20" x2="24" y2="20" stroke="#ccc" stroke-width="0.5"/>
    <line x1="4" y1="24" x2="20" y2="24" stroke="#ccc" stroke-width="0.5"/>
    <line x1="4" y1="28" x2="18" y2="28" stroke="#ccc" stroke-width="0.5"/>
  </svg>`,

  // Parks & Recreation themed icons
  // Tree (parks/nature)
  tree: `<svg viewBox="0 0 32 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <rect x="13" y="36" width="6" height="12" fill="#8B4513" opacity="0.9"/>
    <polygon points="16,0 28,18 22,18 30,30 20,30 24,36 8,36 12,30 2,30 10,18 4,18" fill="currentColor" opacity="0.85"/>
    <polygon points="16,0 24,14 18,14 26,26 18,26 22,32 10,32 14,26 6,26 14,14 8,14" fill="currentColor" opacity="0.65"/>
  </svg>`,

  // Waffle (JJ's Diner)
  waffle: `<svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="28" height="28" rx="3" fill="#D4A574" opacity="0.95"/>
    <rect x="4" y="4" width="24" height="24" rx="2" fill="#C4956A"/>
    <line x1="4" y1="10" x2="28" y2="10" stroke="#8B6914" stroke-width="1" opacity="0.4"/>
    <line x1="4" y1="16" x2="28" y2="16" stroke="#8B6914" stroke-width="1" opacity="0.4"/>
    <line x1="4" y1="22" x2="28" y2="22" stroke="#8B6914" stroke-width="1" opacity="0.4"/>
    <line x1="10" y1="4" x2="10" y2="28" stroke="#8B6914" stroke-width="1" opacity="0.4"/>
    <line x1="16" y1="4" x2="16" y2="28" stroke="#8B6914" stroke-width="1" opacity="0.4"/>
    <line x1="22" y1="4" x2="22" y2="28" stroke="#8B6914" stroke-width="1" opacity="0.4"/>
    <ellipse cx="8" cy="8" rx="2" ry="1.5" fill="#FCD34D" opacity="0.7"/>
    <ellipse cx="20" cy="14" rx="3" ry="2" fill="#FCD34D" opacity="0.6"/>
  </svg>`,

  // Government Seal
  govSeal: `<svg viewBox="0 0 40 40" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="18" stroke="currentColor" stroke-width="2" fill="none" opacity="0.7"/>
    <circle cx="20" cy="20" r="15" stroke="currentColor" stroke-width="1" fill="none" opacity="0.5"/>
    <circle cx="20" cy="20" r="12" fill="currentColor" opacity="0.15"/>
    <polygon points="20,6 22,14 30,14 24,19 26,27 20,22 14,27 16,19 10,14 18,14" fill="currentColor" opacity="0.6"/>
    <circle cx="20" cy="20" r="4" fill="currentColor" opacity="0.4"/>
  </svg>`,

  // Li'l Sebastian (mini horse)
  miniHorse: `<svg viewBox="0 0 40 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="24" cy="18" rx="12" ry="8" fill="currentColor" opacity="0.9"/>
    <ellipse cx="10" cy="14" rx="6" ry="5" fill="currentColor" opacity="0.85"/>
    <ellipse cx="6" cy="10" rx="3" ry="4" fill="currentColor" opacity="0.8"/>
    <circle cx="4" cy="8" r="1.5" fill="#333" opacity="0.6"/>
    <rect x="14" y="22" width="3" height="10" rx="1" fill="currentColor" opacity="0.85"/>
    <rect x="20" y="22" width="3" height="10" rx="1" fill="currentColor" opacity="0.85"/>
    <rect x="28" y="22" width="3" height="10" rx="1" fill="currentColor" opacity="0.85"/>
    <rect x="34" y="22" width="3" height="10" rx="1" fill="currentColor" opacity="0.85"/>
    <path d="M36 16 Q42 12 38 8" stroke="currentColor" stroke-width="2" fill="none" opacity="0.7"/>
    <polygon points="4,6 2,2 6,4" fill="currentColor" opacity="0.7"/>
    <polygon points="8,6 10,2 6,4" fill="currentColor" opacity="0.7"/>
  </svg>`,

  // Binder (Leslie's planning binders)
  binder: `<svg viewBox="0 0 28 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="0" width="24" height="36" rx="2" fill="currentColor" opacity="0.9"/>
    <rect x="4" y="2" width="20" height="32" fill="#fff" opacity="0.95"/>
    <circle cx="6" cy="8" r="2" fill="#c0c0c0"/>
    <circle cx="6" cy="18" r="2" fill="#c0c0c0"/>
    <circle cx="6" cy="28" r="2" fill="#c0c0c0"/>
    <line x1="10" y1="8" x2="22" y2="8" stroke="#ccc" stroke-width="1"/>
    <line x1="10" y1="12" x2="20" y2="12" stroke="#ccc" stroke-width="1"/>
    <line x1="10" y1="16" x2="18" y2="16" stroke="#ccc" stroke-width="1"/>
    <rect x="8" y="22" width="6" height="8" fill="#4ade80" opacity="0.5"/>
    <rect x="15" y="22" width="6" height="8" fill="#fbbf24" opacity="0.5"/>
  </svg>`,

  // Leaf (nature/parks)
  leaf: `<svg viewBox="0 0 24 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0 C20 4 24 14 20 24 C18 28 14 32 12 32 C10 32 6 28 4 24 C0 14 4 4 12 0" fill="currentColor" opacity="0.8"/>
    <path d="M12 4 L12 28 M8 10 L12 14 M16 10 L12 14 M8 18 L12 22 M16 18 L12 22" stroke="currentColor" stroke-width="1" fill="none" opacity="0.4"/>
  </svg>`,
};

// Theme-specific visual configurations
export const themeVisuals: Record<EmailThemeId, ThemeVisuals> = {
  professional: {
    primaryBackground: "none",
    floatingElements: [], // No floating elements for professional
  },

  "darth-vader": {
    primaryBackground: "video",
    
    // Darth Vader dark side themed video background
    videoUrl: "/videos/darthvader-background.mp4",
    videoOpacity: 0.2,
    videoBlendMode: "screen",
    videoFilter: "saturate(0.8) brightness(0.8) contrast(1.1)",
    
    // Rive: Find space animation at https://rive.app/community/
    riveUrl: "https://cdn.rive.app/animations/vehicles.riv",
    riveOpacity: 0.15,
    
    // Lottie: Stars/space animation
    lottieUrl: "https://lottie.host/a5b2a3e6-5f65-4b90-9f37-efc3c7c7f3e0/3yGHZxOyLh.json",
    lottieOpacity: 0.2,
    floatingElements: [
      {
        id: "vader-saber-1",
        svg: svgIcons.lightsaberRed,
        size: 40,
        opacity: 0.4,
        animationDuration: 20,
        animationDelay: 0,
        startPosition: { x: "10%", y: "-10%" },
        endPosition: { x: "15%", y: "110%" },
        rotation: 45,
      },
      {
        id: "vader-imperial-1",
        svg: svgIcons.imperial,
        size: 28,
        opacity: 0.15,
        animationDuration: 25,
        animationDelay: 5,
        startPosition: { x: "80%", y: "110%" },
        endPosition: { x: "75%", y: "-10%" },
        rotationAnimation: true,
      },
      {
        id: "vader-imperial-2",
        svg: svgIcons.imperial,
        size: 20,
        opacity: 0.1,
        animationDuration: 30,
        animationDelay: 12,
        startPosition: { x: "50%", y: "-5%" },
        endPosition: { x: "55%", y: "105%" },
        rotationAnimation: true,
      },
      {
        id: "vader-saber-2",
        svg: svgIcons.lightsaberRed,
        size: 32,
        opacity: 0.3,
        animationDuration: 22,
        animationDelay: 8,
        startPosition: { x: "90%", y: "20%" },
        endPosition: { x: "85%", y: "120%" },
        rotation: -30,
      },
    ],
    ambientGlow: { color: "#ef4444", intensity: 0.1 },
  },

  yoda: {
    primaryBackground: "video",
    
    // Yoda mystical forest themed video background
    videoUrl: "/videos/yoda-background.mp4",
    videoOpacity: 0.18,
    videoBlendMode: "overlay",
    videoFilter: "saturate(0.9) brightness(0.85) hue-rotate(10deg)",
    
    // Lottie: Nature/mystical particles
    lottieUrl: "https://lottie.host/3f5c3e8a-3b6b-4c9a-9c8d-5f6e7a8b9c0d/xYzAbCdEfG.json",
    lottieOpacity: 0.15,
    floatingElements: [
      {
        id: "yoda-saber-1",
        svg: svgIcons.lightsaberGreen,
        size: 36,
        opacity: 0.35,
        animationDuration: 18,
        animationDelay: 0,
        startPosition: { x: "85%", y: "-10%" },
        endPosition: { x: "80%", y: "110%" },
        rotation: 30,
      },
      {
        id: "yoda-jedi-1",
        svg: svgIcons.jedi,
        size: 24,
        opacity: 0.2,
        animationDuration: 22,
        animationDelay: 4,
        startPosition: { x: "15%", y: "110%" },
        endPosition: { x: "20%", y: "-10%" },
        rotationAnimation: true,
      },
      {
        id: "yoda-jedi-2",
        svg: svgIcons.jedi,
        size: 18,
        opacity: 0.15,
        animationDuration: 28,
        animationDelay: 10,
        startPosition: { x: "60%", y: "105%" },
        endPosition: { x: "55%", y: "-5%" },
        rotationAnimation: true,
      },
      {
        id: "yoda-star-1",
        svg: svgIcons.star,
        size: 12,
        opacity: 0.25,
        animationDuration: 15,
        animationDelay: 6,
        startPosition: { x: "40%", y: "-5%" },
        endPosition: { x: "45%", y: "105%" },
      },
    ],
    ambientGlow: { color: "#22c55e", intensity: 0.08 },
  },

  "spider-man": {
    primaryBackground: "video",
    
    // Spider-Man NYC cityscape themed video background
    videoUrl: "/videos/nyc-background.mp4",
    videoOpacity: 0.22,
    videoBlendMode: "screen",
    videoFilter: "saturate(0.85) brightness(0.7) contrast(1.2) hue-rotate(-5deg)",
    
    // Lottie: City/urban animation
    lottieUrl: "https://lottie.host/embed/4e3d2c1b-0a9f-8e7d-6c5b-4a3f2e1d0c9b/AbCdEfGhIj.json",
    lottieOpacity: 0.12,
    floatingElements: [
      // Large corner webs
      {
        id: "spidey-web-corner-1",
        svg: svgIcons.spiderWeb,
        size: 80,
        opacity: 0.12,
        animationDuration: 40,
        animationDelay: 0,
        startPosition: { x: "-5%", y: "-5%" },
        rotationAnimation: true,
      },
      {
        id: "spidey-web-corner-2",
        svg: svgIcons.spiderWeb,
        size: 70,
        opacity: 0.1,
        animationDuration: 45,
        animationDelay: 5,
        startPosition: { x: "80%", y: "75%" },
        rotationAnimation: true,
      },
      // Medium floating webs
      {
        id: "spidey-web-float-1",
        svg: svgIcons.spiderWeb,
        size: 45,
        opacity: 0.08,
        animationDuration: 35,
        animationDelay: 10,
        startPosition: { x: "85%", y: "10%" },
        rotationAnimation: true,
      },
      // Descending spider
      {
        id: "spidey-spider-descend-1",
        svg: svgIcons.spider,
        size: 22,
        opacity: 0.25,
        animationDuration: 18,
        animationDelay: 2,
        startPosition: { x: "15%", y: "-10%" },
        endPosition: { x: "18%", y: "110%" },
      },
      {
        id: "spidey-spider-descend-2",
        svg: svgIcons.spider,
        size: 16,
        opacity: 0.2,
        animationDuration: 22,
        animationDelay: 8,
        startPosition: { x: "75%", y: "-5%" },
        endPosition: { x: "72%", y: "105%" },
      },
      {
        id: "spidey-spider-descend-3",
        svg: svgIcons.spider,
        size: 14,
        opacity: 0.15,
        animationDuration: 28,
        animationDelay: 15,
        startPosition: { x: "45%", y: "-8%" },
        endPosition: { x: "48%", y: "108%" },
      },
      // Web shooter streaks
      {
        id: "spidey-webshoot-1",
        svg: svgIcons.webShooter,
        size: 50,
        opacity: 0.15,
        animationDuration: 12,
        animationDelay: 0,
        startPosition: { x: "-10%", y: "25%" },
        endPosition: { x: "110%", y: "30%" },
        rotation: 5,
      },
      {
        id: "spidey-webshoot-2",
        svg: svgIcons.webShooter,
        size: 40,
        opacity: 0.12,
        animationDuration: 15,
        animationDelay: 6,
        startPosition: { x: "-10%", y: "65%" },
        endPosition: { x: "110%", y: "60%" },
        rotation: -3,
      },
    ],
    ambientGlow: { color: "#dc2626", intensity: 0.1 },
  },

  pirate: {
    primaryBackground: "video",
    
    // Pirates of the Caribbean themed video background
    videoUrl: "/videos/pirate-background.mp4",
    videoOpacity: 0.18,
    videoBlendMode: "overlay",
    videoFilter: "saturate(0.85) brightness(0.9)",
    
    // Lottie: Ocean/waves animation
    lottieUrl: "https://lottie.host/0a1b2c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d/OceanWaves.json",
    lottieOpacity: 0.15,
    floatingElements: [
      {
        id: "pirate-skull-1",
        svg: svgIcons.skull,
        size: 26,
        opacity: 0.2,
        animationDuration: 20,
        animationDelay: 0,
        startPosition: { x: "10%", y: "-10%" },
        endPosition: { x: "15%", y: "110%" },
        rotationAnimation: true,
      },
      {
        id: "pirate-anchor-1",
        svg: svgIcons.anchor,
        size: 28,
        opacity: 0.18,
        animationDuration: 25,
        animationDelay: 6,
        startPosition: { x: "85%", y: "-5%" },
        endPosition: { x: "80%", y: "105%" },
      },
      {
        id: "pirate-coin-1",
        svg: svgIcons.coin,
        size: 16,
        opacity: 0.35,
        animationDuration: 12,
        animationDelay: 2,
        startPosition: { x: "30%", y: "-10%" },
        endPosition: { x: "35%", y: "110%" },
        rotationAnimation: true,
      },
      {
        id: "pirate-coin-2",
        svg: svgIcons.coin,
        size: 14,
        opacity: 0.3,
        animationDuration: 14,
        animationDelay: 7,
        startPosition: { x: "60%", y: "-5%" },
        endPosition: { x: "55%", y: "105%" },
        rotationAnimation: true,
      },
      {
        id: "pirate-coin-3",
        svg: svgIcons.coin,
        size: 12,
        opacity: 0.25,
        animationDuration: 16,
        animationDelay: 11,
        startPosition: { x: "75%", y: "-8%" },
        endPosition: { x: "70%", y: "108%" },
        rotationAnimation: true,
      },
    ],
    ambientGlow: { color: "#f59e0b", intensity: 0.08 },
  },

  shakespeare: {
    primaryBackground: "video",
    
    // Shakespeare theatrical themed video background
    videoUrl: "/videos/Shakespeare-background.mp4",
    videoOpacity: 0.18,
    videoBlendMode: "screen",
    videoFilter: "saturate(0.85) brightness(0.85) sepia(0.1)",
    floatingElements: [
      {
        id: "shakespeare-mask-1",
        svg: svgIcons.theaterMask,
        size: 36,
        opacity: 0.2,
        animationDuration: 25,
        animationDelay: 0,
        startPosition: { x: "8%", y: "20%" },
        endPosition: { x: "12%", y: "80%" },
      },
      {
        id: "shakespeare-quill-1",
        svg: svgIcons.quill,
        size: 30,
        opacity: 0.25,
        animationDuration: 20,
        animationDelay: 5,
        startPosition: { x: "88%", y: "-10%" },
        endPosition: { x: "82%", y: "110%" },
        rotation: -20,
      },
      {
        id: "shakespeare-star-1",
        svg: svgIcons.star,
        size: 14,
        opacity: 0.3,
        animationDuration: 15,
        animationDelay: 3,
        startPosition: { x: "25%", y: "110%" },
        endPosition: { x: "30%", y: "-10%" },
      },
      {
        id: "shakespeare-star-2",
        svg: svgIcons.star,
        size: 10,
        opacity: 0.25,
        animationDuration: 18,
        animationDelay: 9,
        startPosition: { x: "65%", y: "105%" },
        endPosition: { x: "60%", y: "-5%" },
      },
      {
        id: "shakespeare-quill-2",
        svg: svgIcons.quill,
        size: 22,
        opacity: 0.18,
        animationDuration: 28,
        animationDelay: 14,
        startPosition: { x: "45%", y: "-8%" },
        endPosition: { x: "50%", y: "108%" },
        rotation: 15,
      },
    ],
    ambientGlow: { color: "#a855f7", intensity: 0.08 },
  },

  "surfer-dude": {
    primaryBackground: "video",
    
    // Surfer beach themed video background - tropical Hawaii vibes
    videoUrl: "/videos/surfer-background.mp4",
    videoOpacity: 0.22,
    videoBlendMode: "overlay",
    videoFilter: "saturate(1.2) brightness(0.92) hue-rotate(-5deg)",
    
    // Lottie: Beach/tropical animation
    lottieUrl: "https://lottie.host/5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b/BeachSunset.json",
    lottieOpacity: 0.15,
    floatingElements: [
      // Tiki torches on sides - flickering flames
      {
        id: "surfer-tiki-torch-1",
        svg: svgIcons.tikiTorch,
        size: 50,
        opacity: 0.35,
        animationDuration: 40,
        animationDelay: 0,
        startPosition: { x: "3%", y: "60%" },
      },
      {
        id: "surfer-tiki-torch-2",
        svg: svgIcons.tikiTorch,
        size: 45,
        opacity: 0.3,
        animationDuration: 45,
        animationDelay: 2,
        startPosition: { x: "92%", y: "55%" },
      },
      // Tiki head decorations
      {
        id: "surfer-tiki-head-1",
        svg: svgIcons.tikiHead,
        size: 32,
        opacity: 0.2,
        animationDuration: 35,
        animationDelay: 5,
        startPosition: { x: "5%", y: "15%" },
        endPosition: { x: "8%", y: "25%" },
      },
      {
        id: "surfer-tiki-head-2",
        svg: svgIcons.tikiHead,
        size: 28,
        opacity: 0.15,
        animationDuration: 40,
        animationDelay: 15,
        startPosition: { x: "88%", y: "20%" },
        endPosition: { x: "85%", y: "30%" },
      },
      // Hibiscus flowers floating
      {
        id: "surfer-hibiscus-1",
        svg: svgIcons.hibiscus,
        size: 28,
        opacity: 0.3,
        animationDuration: 18,
        animationDelay: 0,
        startPosition: { x: "15%", y: "-10%" },
        endPosition: { x: "22%", y: "110%" },
        rotationAnimation: true,
      },
      {
        id: "surfer-hibiscus-2",
        svg: svgIcons.hibiscus,
        size: 22,
        opacity: 0.25,
        animationDuration: 22,
        animationDelay: 8,
        startPosition: { x: "75%", y: "-5%" },
        endPosition: { x: "70%", y: "105%" },
        rotationAnimation: true,
      },
      // Plumeria flowers
      {
        id: "surfer-plumeria-1",
        svg: svgIcons.plumeria,
        size: 20,
        opacity: 0.28,
        animationDuration: 20,
        animationDelay: 4,
        startPosition: { x: "45%", y: "-8%" },
        endPosition: { x: "50%", y: "108%" },
        rotationAnimation: true,
      },
      {
        id: "surfer-plumeria-2",
        svg: svgIcons.plumeria,
        size: 16,
        opacity: 0.22,
        animationDuration: 25,
        animationDelay: 12,
        startPosition: { x: "30%", y: "-5%" },
        endPosition: { x: "35%", y: "105%" },
        rotationAnimation: true,
      },
      // Ocean waves
      {
        id: "surfer-wave-1",
        svg: svgIcons.oceanWave,
        size: 60,
        opacity: 0.18,
        animationDuration: 10,
        animationDelay: 0,
        startPosition: { x: "-15%", y: "80%" },
        endPosition: { x: "115%", y: "80%" },
      },
      {
        id: "surfer-wave-2",
        svg: svgIcons.oceanWave,
        size: 50,
        opacity: 0.14,
        animationDuration: 14,
        animationDelay: 5,
        startPosition: { x: "-10%", y: "88%" },
        endPosition: { x: "110%", y: "88%" },
      },
      // Palm tree silhouette
      {
        id: "surfer-palm-1",
        svg: svgIcons.palmTree,
        size: 40,
        opacity: 0.15,
        animationDuration: 50,
        animationDelay: 0,
        startPosition: { x: "2%", y: "30%" },
      },
      // Surfboards
      {
        id: "surfer-board-1",
        svg: svgIcons.surfboard,
        size: 26,
        opacity: 0.22,
        animationDuration: 22,
        animationDelay: 6,
        startPosition: { x: "60%", y: "-10%" },
        endPosition: { x: "55%", y: "110%" },
        rotation: 25,
      },
      // Tropical fish
      {
        id: "surfer-fish-1",
        svg: svgIcons.tropicalFish,
        size: 24,
        opacity: 0.2,
        animationDuration: 15,
        animationDelay: 3,
        startPosition: { x: "-10%", y: "70%" },
        endPosition: { x: "110%", y: "72%" },
      },
      {
        id: "surfer-fish-2",
        svg: svgIcons.tropicalFish,
        size: 18,
        opacity: 0.15,
        animationDuration: 18,
        animationDelay: 10,
        startPosition: { x: "110%", y: "75%" },
        endPosition: { x: "-10%", y: "73%" },
      },
      // Sunset in corner
      {
        id: "surfer-sunset-1",
        svg: svgIcons.sunset,
        size: 48,
        opacity: 0.2,
        animationDuration: 60,
        animationDelay: 0,
        startPosition: { x: "82%", y: "5%" },
      },
    ],
    ambientGlow: { color: "#f97316", intensity: 0.1 },
  },

  "the-office": {
    primaryBackground: "video",
    
    // The Office paper/office themed video background
    videoUrl: "/videos/office-background.mp4",
    videoOpacity: 0.15,
    videoBlendMode: "overlay",
    videoFilter: "saturate(0.9) brightness(1.05) sepia(0.15)",
    
    floatingElements: [
      {
        id: "office-paperclip-1",
        svg: svgIcons.paperClip,
        size: 28,
        opacity: 0.25,
        animationDuration: 20,
        animationDelay: 0,
        startPosition: { x: "8%", y: "-10%" },
        endPosition: { x: "12%", y: "110%" },
        rotation: 15,
        rotationAnimation: true,
      },
      {
        id: "office-postit-1",
        svg: svgIcons.postIt,
        size: 32,
        opacity: 0.2,
        animationDuration: 25,
        animationDelay: 4,
        startPosition: { x: "85%", y: "-5%" },
        endPosition: { x: "80%", y: "105%" },
        rotation: -8,
      },
      {
        id: "office-pencil-1",
        svg: svgIcons.pencil,
        size: 24,
        opacity: 0.22,
        animationDuration: 18,
        animationDelay: 8,
        startPosition: { x: "25%", y: "110%" },
        endPosition: { x: "30%", y: "-10%" },
        rotation: 45,
      },
      {
        id: "office-paper-1",
        svg: svgIcons.paper,
        size: 26,
        opacity: 0.18,
        animationDuration: 22,
        animationDelay: 2,
        startPosition: { x: "60%", y: "-8%" },
        endPosition: { x: "55%", y: "108%" },
        rotation: 12,
      },
      {
        id: "office-dundie-1",
        svg: svgIcons.dundie,
        size: 30,
        opacity: 0.2,
        animationDuration: 30,
        animationDelay: 10,
        startPosition: { x: "75%", y: "110%" },
        endPosition: { x: "70%", y: "-10%" },
      },
      {
        id: "office-paperclip-2",
        svg: svgIcons.paperClip,
        size: 20,
        opacity: 0.18,
        animationDuration: 24,
        animationDelay: 14,
        startPosition: { x: "45%", y: "-5%" },
        endPosition: { x: "50%", y: "105%" },
        rotation: -25,
        rotationAnimation: true,
      },
      {
        id: "office-mug-1",
        svg: svgIcons.coffeeMug,
        size: 24,
        opacity: 0.15,
        animationDuration: 35,
        animationDelay: 6,
        startPosition: { x: "15%", y: "105%" },
        endPosition: { x: "20%", y: "-5%" },
      },
    ],
    ambientGlow: { color: "#8b7355", intensity: 0.06 },
  },

  "parks-and-recreation": {
    primaryBackground: "video",
    
    // Parks and Recreation nature/government themed video background
    videoUrl: "/videos/parks-background.mp4",
    videoOpacity: 0.18,
    videoBlendMode: "overlay",
    videoFilter: "saturate(1.1) brightness(0.95) contrast(1.05)",
    
    floatingElements: [
      {
        id: "parks-tree-1",
        svg: svgIcons.tree,
        size: 36,
        opacity: 0.2,
        animationDuration: 28,
        animationDelay: 0,
        startPosition: { x: "5%", y: "-10%" },
        endPosition: { x: "10%", y: "110%" },
      },
      {
        id: "parks-waffle-1",
        svg: svgIcons.waffle,
        size: 26,
        opacity: 0.25,
        animationDuration: 18,
        animationDelay: 3,
        startPosition: { x: "85%", y: "-5%" },
        endPosition: { x: "80%", y: "105%" },
        rotationAnimation: true,
      },
      {
        id: "parks-seal-1",
        svg: svgIcons.govSeal,
        size: 32,
        opacity: 0.15,
        animationDuration: 35,
        animationDelay: 8,
        startPosition: { x: "50%", y: "110%" },
        endPosition: { x: "45%", y: "-10%" },
        rotationAnimation: true,
      },
      {
        id: "parks-horse-1",
        svg: svgIcons.miniHorse,
        size: 28,
        opacity: 0.2,
        animationDuration: 25,
        animationDelay: 12,
        startPosition: { x: "70%", y: "-8%" },
        endPosition: { x: "65%", y: "108%" },
      },
      {
        id: "parks-binder-1",
        svg: svgIcons.binder,
        size: 24,
        opacity: 0.22,
        animationDuration: 22,
        animationDelay: 5,
        startPosition: { x: "20%", y: "110%" },
        endPosition: { x: "25%", y: "-10%" },
        rotation: -10,
      },
      {
        id: "parks-leaf-1",
        svg: svgIcons.leaf,
        size: 20,
        opacity: 0.25,
        animationDuration: 15,
        animationDelay: 2,
        startPosition: { x: "35%", y: "-5%" },
        endPosition: { x: "40%", y: "105%" },
        rotationAnimation: true,
      },
      {
        id: "parks-leaf-2",
        svg: svgIcons.leaf,
        size: 16,
        opacity: 0.2,
        animationDuration: 20,
        animationDelay: 10,
        startPosition: { x: "90%", y: "30%" },
        endPosition: { x: "85%", y: "130%" },
        rotationAnimation: true,
      },
      {
        id: "parks-waffle-2",
        svg: svgIcons.waffle,
        size: 20,
        opacity: 0.18,
        animationDuration: 24,
        animationDelay: 16,
        startPosition: { x: "15%", y: "105%" },
        endPosition: { x: "20%", y: "-5%" },
        rotationAnimation: true,
      },
    ],
    ambientGlow: { color: "#daa520", intensity: 0.06 },
  },
};

export function getThemeVisuals(themeId: EmailThemeId): ThemeVisuals {
  const base: ThemeVisuals = {
    primaryBackground: "none",
    floatingElements: [],
  };
  return { ...base, ...(themeVisuals[themeId] as Partial<ThemeVisuals>) } as ThemeVisuals;
}
