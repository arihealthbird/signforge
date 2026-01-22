"use client";

import { useMemo } from "react";
import { EmailThemeId, getEmailTheme } from "@/lib/email-themes";
import { getThemeVisuals } from "@/lib/theme-visuals";
import { LottieBackground } from "./lottie-background";
import { RiveBackground } from "./rive-background";
import { VideoBackground } from "./video-background";
import { FloatingElements } from "./floating-elements";

interface ThemeCanvasEffectsProps {
  themeId: EmailThemeId;
  className?: string;
}

// Corner decoration SVGs for each theme
const cornerDecorations: Record<string, string> = {
  "darth-vader": `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- Imperial angular design -->
    <path d="M0 0 L100 0 L100 15 L15 15 L15 100 L0 100 Z" fill="currentColor" opacity="0.2"/>
    <path d="M0 0 L70 0 L70 6 L6 6 L6 70 L0 70 Z" fill="currentColor" opacity="0.35"/>
    <path d="M0 0 L40 0 L40 3 L3 3 L3 40 L0 40 Z" fill="currentColor" opacity="0.5"/>
    <!-- Imperial cog/gear accent -->
    <circle cx="25" cy="25" r="8" stroke="currentColor" stroke-width="2" fill="none" opacity="0.3"/>
    <circle cx="25" cy="25" r="3" fill="currentColor" opacity="0.5"/>
    <path d="M25 14 L25 19 M25 31 L25 36 M14 25 L19 25 M31 25 L36 25" stroke="currentColor" stroke-width="1.5" opacity="0.4"/>
    <!-- Corner triangles - TIE fighter inspired -->
    <path d="M0 0 L20 0 L0 20 Z" fill="currentColor" opacity="0.15"/>
    <path d="M85 0 L100 0 L100 15 Z" fill="currentColor" opacity="0.1"/>
  </svg>`,
  
  yoda: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- Mystical organic curves -->
    <path d="M0 0 Q40 8 80 0 L100 0 L100 20 Q60 28 20 20 Q8 40 0 80 L0 0" fill="currentColor" opacity="0.08"/>
    <!-- Force energy swirls -->
    <circle cx="25" cy="25" r="15" fill="currentColor" opacity="0.08"/>
    <circle cx="20" cy="20" r="10" fill="currentColor" opacity="0.12"/>
    <circle cx="15" cy="15" r="6" fill="currentColor" opacity="0.18"/>
    <!-- Star accents -->
    <path d="M30 10 L31 14 L35 14 L32 17 L33 21 L30 18 L27 21 L28 17 L25 14 L29 14 Z" fill="currentColor" opacity="0.3"/>
    <path d="M12 35 L13 38 L16 38 L13.5 40 L14.5 43 L12 41 L9.5 43 L10.5 40 L8 38 L11 38 Z" fill="currentColor" opacity="0.25"/>
    <!-- Mist wisps -->
    <path d="M0 50 Q15 45 30 55 Q45 65 60 50" stroke="currentColor" stroke-width="1" fill="none" opacity="0.15"/>
    <path d="M0 65 Q20 60 40 70" stroke="currentColor" stroke-width="0.5" fill="none" opacity="0.1"/>
  </svg>`,

  "spider-man": `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
    <!-- Web corner pattern -->
    <path d="M0 0 L100 0 M0 0 L0 100 M0 0 L100 100" stroke-width="1" opacity="0.25"/>
    <path d="M0 0 L70 35 M0 0 L35 70" stroke-width="0.75" opacity="0.2"/>
    <path d="M0 0 L50 15 M0 0 L15 50" stroke-width="0.5" opacity="0.15"/>
    <!-- Concentric web arcs -->
    <path d="M0 20 Q10 10 20 0" stroke-width="0.5" opacity="0.15" fill="none"/>
    <path d="M0 40 Q20 20 40 0" stroke-width="0.5" opacity="0.12" fill="none"/>
    <path d="M0 60 Q30 30 60 0" stroke-width="0.5" opacity="0.1" fill="none"/>
    <path d="M0 80 Q40 40 80 0" stroke-width="0.5" opacity="0.08" fill="none"/>
    <!-- Inner circles for web center -->
    <circle cx="0" cy="0" r="15" stroke-width="0.5" opacity="0.2" fill="none"/>
    <circle cx="0" cy="0" r="30" stroke-width="0.5" opacity="0.15" fill="none"/>
    <circle cx="0" cy="0" r="50" stroke-width="0.5" opacity="0.1" fill="none"/>
    <circle cx="0" cy="0" r="75" stroke-width="0.5" opacity="0.06" fill="none"/>
  </svg>`,

  pirate: `<svg viewBox="0 0 100 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 0 L40 0 L35 5 L5 5 L5 35 L0 40 Z" fill="currentColor" opacity="0.15"/>
    <path d="M10 10 L25 10 L25 25 L10 25 Z" fill="none" stroke="currentColor" stroke-width="2" opacity="0.2"/>
    <circle cx="17.5" cy="17.5" r="3" fill="currentColor" opacity="0.3"/>
  </svg>`,

  shakespeare: `<svg viewBox="0 0 100 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 0 Q30 5 50 0 Q30 15 0 10 Z" fill="currentColor" opacity="0.15"/>
    <path d="M0 0 L0 50 Q10 40 5 25 Q15 30 10 15 Q20 20 15 5 L50 0 Q35 10 20 5 Q25 15 10 10 Z" fill="currentColor" opacity="0.08"/>
    <circle cx="8" cy="8" r="2" fill="currentColor" opacity="0.4"/>
  </svg>`,

  "surfer-dude": `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 30 Q25 20 50 30 Q75 40 100 30 L100 50 Q75 40 50 50 Q25 60 0 50 Z" fill="currentColor" opacity="0.08" transform="rotate(-45 50 50)"/>
    <circle cx="15" cy="15" r="12" fill="currentColor" opacity="0.15"/>
    <circle cx="15" cy="15" r="8" fill="currentColor" opacity="0.1"/>
  </svg>`,
};

// Floating canvas elements (larger, for the canvas area)
function generateCanvasElements(themeId: EmailThemeId, accentColor: string) {
  const elements: Array<{
    id: string;
    svg: string;
    style: React.CSSProperties;
    keyframes: string;
  }> = [];

  const baseElements: Record<string, Array<{
    svg: string;
    size: number;
    position: { top?: string; bottom?: string; left?: string; right?: string };
    animation: string;
    opacity: number;
  }>> = {
    "darth-vader": [
      {
        svg: `<svg viewBox="0 0 40 40" fill="${accentColor}" opacity="0.3"><polygon points="20,5 35,35 5,35"/></svg>`,
        size: 30,
        position: { top: "15%", left: "5%" },
        animation: "canvasFloat1 15s ease-in-out infinite",
        opacity: 0.4,
      },
      {
        svg: `<svg viewBox="0 0 20 20" fill="${accentColor}"><circle cx="10" cy="10" r="8" opacity="0.5"/></svg>`,
        size: 16,
        position: { bottom: "20%", left: "8%" },
        animation: "canvasFloat2 20s ease-in-out infinite",
        opacity: 0.3,
      },
      {
        svg: `<svg viewBox="0 0 20 20" fill="${accentColor}"><circle cx="10" cy="10" r="6" opacity="0.4"/></svg>`,
        size: 12,
        position: { top: "40%", right: "6%" },
        animation: "canvasFloat3 18s ease-in-out infinite",
        opacity: 0.35,
      },
    ],
    yoda: [
      {
        svg: `<svg viewBox="0 0 30 30" fill="${accentColor}"><path d="M15 3 L17 12 L26 14 L17 16 L15 25 L13 16 L4 14 L13 12 Z" opacity="0.5"/></svg>`,
        size: 28,
        position: { top: "20%", left: "4%" },
        animation: "canvasFloat1 22s ease-in-out infinite",
        opacity: 0.4,
      },
      {
        svg: `<svg viewBox="0 0 20 20" fill="${accentColor}"><circle cx="10" cy="10" r="8" opacity="0.3"/></svg>`,
        size: 20,
        position: { bottom: "25%", left: "6%" },
        animation: "canvasFloat2 25s ease-in-out infinite",
        opacity: 0.25,
      },
      {
        svg: `<svg viewBox="0 0 20 20" fill="${accentColor}"><circle cx="10" cy="10" r="10" opacity="0.2"/></svg>`,
        size: 24,
        position: { top: "50%", right: "5%" },
        animation: "canvasFloat3 20s ease-in-out infinite",
        opacity: 0.3,
      },
    ],
    "spider-man": [
      // Large spinning web in corner
      {
        svg: `<svg viewBox="0 0 60 60" stroke="${accentColor}" fill="none">
          <circle cx="30" cy="30" r="25" stroke-width="0.75" opacity="0.3"/>
          <circle cx="30" cy="30" r="18" stroke-width="0.75" opacity="0.35"/>
          <circle cx="30" cy="30" r="11" stroke-width="0.75" opacity="0.4"/>
          <circle cx="30" cy="30" r="5" stroke-width="0.75" opacity="0.5"/>
          <line x1="30" y1="5" x2="30" y2="55" stroke-width="0.5" opacity="0.3"/>
          <line x1="5" y1="30" x2="55" y2="30" stroke-width="0.5" opacity="0.3"/>
          <line x1="10" y1="10" x2="50" y2="50" stroke-width="0.5" opacity="0.25"/>
          <line x1="50" y1="10" x2="10" y2="50" stroke-width="0.5" opacity="0.25"/>
        </svg>`,
        size: 60,
        position: { top: "5%", left: "2%" },
        animation: "canvasSpin 40s linear infinite",
        opacity: 0.2,
      },
      // Smaller web bottom right
      {
        svg: `<svg viewBox="0 0 50 50" stroke="${accentColor}" fill="none">
          <circle cx="25" cy="25" r="20" stroke-width="0.5" opacity="0.25"/>
          <circle cx="25" cy="25" r="14" stroke-width="0.5" opacity="0.3"/>
          <circle cx="25" cy="25" r="8" stroke-width="0.5" opacity="0.35"/>
          <line x1="25" y1="5" x2="25" y2="45" stroke-width="0.5" opacity="0.25"/>
          <line x1="5" y1="25" x2="45" y2="25" stroke-width="0.5" opacity="0.25"/>
          <line x1="8" y1="8" x2="42" y2="42" stroke-width="0.5" opacity="0.2"/>
          <line x1="42" y1="8" x2="8" y2="42" stroke-width="0.5" opacity="0.2"/>
        </svg>`,
        size: 50,
        position: { bottom: "8%", right: "3%" },
        animation: "canvasSpin 35s linear infinite reverse",
        opacity: 0.18,
      },
      // Spider emblem descending
      {
        svg: `<svg viewBox="0 0 32 32" fill="${accentColor}">
          <ellipse cx="16" cy="18" rx="4" ry="5" opacity="0.5"/>
          <circle cx="16" cy="11" r="3" opacity="0.5"/>
          <line x1="16" y1="0" x2="16" y2="8" stroke="${accentColor}" stroke-width="0.5" opacity="0.3"/>
        </svg>`,
        size: 20,
        position: { top: "15%", right: "15%" },
        animation: "canvasFloat1 20s ease-in-out infinite",
        opacity: 0.35,
      },
      // Red accent glow circles
      {
        svg: `<svg viewBox="0 0 20 20" fill="${accentColor}"><circle cx="10" cy="10" r="8" opacity="0.2"/><circle cx="10" cy="10" r="4" opacity="0.4"/></svg>`,
        size: 16,
        position: { bottom: "25%", left: "6%" },
        animation: "canvasTwinkle 4s ease-in-out infinite",
        opacity: 0.4,
      },
      {
        svg: `<svg viewBox="0 0 20 20" fill="#1e40af"><circle cx="10" cy="10" r="8" opacity="0.15"/><circle cx="10" cy="10" r="4" opacity="0.3"/></svg>`,
        size: 14,
        position: { top: "35%", right: "5%" },
        animation: "canvasTwinkle 5s ease-in-out infinite 1s",
        opacity: 0.3,
      },
    ],
    pirate: [
      {
        svg: `<svg viewBox="0 0 24 24" fill="${accentColor}"><circle cx="12" cy="12" r="10" opacity="0.6"/><text x="12" y="16" text-anchor="middle" font-size="12" fill="#000" opacity="0.3">$</text></svg>`,
        size: 22,
        position: { top: "18%", left: "5%" },
        animation: "canvasFall 12s linear infinite",
        opacity: 0.5,
      },
      {
        svg: `<svg viewBox="0 0 24 24" fill="${accentColor}"><circle cx="12" cy="12" r="10" opacity="0.5"/></svg>`,
        size: 18,
        position: { top: "35%", left: "8%" },
        animation: "canvasFall 15s linear infinite 3s",
        opacity: 0.4,
      },
      {
        svg: `<svg viewBox="0 0 24 24" fill="${accentColor}"><circle cx="12" cy="12" r="10" opacity="0.4"/></svg>`,
        size: 14,
        position: { top: "25%", right: "6%" },
        animation: "canvasFall 18s linear infinite 6s",
        opacity: 0.35,
      },
    ],
    shakespeare: [
      {
        svg: `<svg viewBox="0 0 24 24" fill="${accentColor}"><polygon points="12,2 15,9 22,9 16,14 18,22 12,17 6,22 8,14 2,9 9,9" opacity="0.5"/></svg>`,
        size: 20,
        position: { top: "12%", left: "4%" },
        animation: "canvasTwinkle 3s ease-in-out infinite",
        opacity: 0.5,
      },
      {
        svg: `<svg viewBox="0 0 24 24" fill="${accentColor}"><polygon points="12,2 15,9 22,9 16,14 18,22 12,17 6,22 8,14 2,9 9,9" opacity="0.4"/></svg>`,
        size: 14,
        position: { bottom: "20%", left: "7%" },
        animation: "canvasTwinkle 4s ease-in-out infinite 1s",
        opacity: 0.4,
      },
      {
        svg: `<svg viewBox="0 0 24 24" fill="${accentColor}"><polygon points="12,2 15,9 22,9 16,14 18,22 12,17 6,22 8,14 2,9 9,9" opacity="0.3"/></svg>`,
        size: 16,
        position: { top: "45%", right: "5%" },
        animation: "canvasTwinkle 3.5s ease-in-out infinite 0.5s",
        opacity: 0.35,
      },
    ],
    "surfer-dude": [
      {
        svg: `<svg viewBox="0 0 48 24" stroke="${accentColor}" fill="none"><path d="M0 12 Q12 4 24 12 Q36 20 48 12" stroke-width="2" opacity="0.4"/></svg>`,
        size: 60,
        position: { bottom: "8%", left: "2%" },
        animation: "canvasWave 8s ease-in-out infinite",
        opacity: 0.3,
      },
      {
        svg: `<svg viewBox="0 0 48 24" stroke="${accentColor}" fill="none"><path d="M0 12 Q12 4 24 12 Q36 20 48 12" stroke-width="2" opacity="0.3"/></svg>`,
        size: 50,
        position: { bottom: "12%", right: "3%" },
        animation: "canvasWave 10s ease-in-out infinite 2s",
        opacity: 0.25,
      },
      {
        svg: `<svg viewBox="0 0 32 32" fill="${accentColor}"><circle cx="16" cy="16" r="10" opacity="0.3"/></svg>`,
        size: 35,
        position: { top: "8%", right: "5%" },
        animation: "canvasSunPulse 6s ease-in-out infinite",
        opacity: 0.35,
      },
    ],
  };

  const themeElements = baseElements[themeId] || [];
  
  themeElements.forEach((el, i) => {
    elements.push({
      id: `canvas-el-${themeId}-${i}`,
      svg: el.svg,
      style: {
        position: "absolute",
        width: el.size,
        height: "auto",
        opacity: el.opacity,
        pointerEvents: "none",
        zIndex: 1,
        ...el.position,
        animation: el.animation,
      },
      keyframes: "",
    });
  });

  return elements;
}

// Keyframes for canvas animations
const canvasKeyframes = `
  @keyframes canvasFloat1 {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(5deg); }
  }
  @keyframes canvasFloat2 {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-15px) rotate(-5deg); }
  }
  @keyframes canvasFloat3 {
    0%, 100% { transform: translateX(0) translateY(0); }
    50% { transform: translateX(-10px) translateY(-10px); }
  }
  @keyframes canvasSpin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes canvasFall {
    0% { transform: translateY(-20px) rotate(0deg); opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { transform: translateY(calc(100vh - 100px)) rotate(360deg); opacity: 0; }
  }
  @keyframes canvasTwinkle {
    0%, 100% { transform: scale(1); opacity: 0.3; }
    50% { transform: scale(1.2); opacity: 0.7; }
  }
  @keyframes canvasWave {
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(20px); }
  }
  @keyframes canvasSunPulse {
    0%, 100% { transform: scale(1); opacity: 0.3; }
    50% { transform: scale(1.1); opacity: 0.5; }
  }
`;

export function ThemeCanvasEffects({ themeId, className }: ThemeCanvasEffectsProps) {
  const theme = getEmailTheme(themeId);
  const visuals = getThemeVisuals(themeId);
  const accentColor = theme.accentColor || "#ffffff";

  // Only show effects for fun themes
  if (themeId === "professional") {
    return null;
  }

  const canvasElements = useMemo(
    () => generateCanvasElements(themeId, accentColor),
    [themeId, accentColor]
  );

  const cornerSvg = cornerDecorations[themeId];

  return (
    <div className={className}>
      {/* Global keyframes */}
      <style dangerouslySetInnerHTML={{ __html: canvasKeyframes }} />

      {/* Backgrounds: only render if primaryBackground is set to a specific type */}
      {(() => {
        const bg = visuals.primaryBackground;
        const commonClass = "absolute inset-0 pointer-events-none z-[1]";
        
        // Don't render any background if set to "none"
        if (bg === "none" || !bg) {
          return null;
        }
        
        if (bg === "video" && visuals.videoUrl) {
          return <VideoBackground themeId={themeId} className={commonClass} />;
        }
        if (bg === "rive" && visuals.riveUrl) {
          return <RiveBackground themeId={themeId} className={commonClass} />;
        }
        if (bg === "lottie" && visuals.lottieUrl) {
          return <LottieBackground themeId={themeId} className={commonClass} />;
        }
        return null;
      })()}

      {/* Ambient gradient overlay */}
      {visuals.ambientGlow && (
        <>
          {/* Top glow */}
          <div
            className="absolute top-0 left-0 right-0 h-32 pointer-events-none z-[2]"
            style={{
              background: `linear-gradient(to bottom, ${accentColor}15 0%, transparent 100%)`,
            }}
          />
          {/* Bottom glow */}
          <div
            className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none z-[2]"
            style={{
              background: `linear-gradient(to top, ${accentColor}10 0%, transparent 100%)`,
            }}
          />
        </>
      )}

      {/* Corner decorations */}
      {cornerSvg && (
        <>
          {/* Top-left */}
          <div
            className="absolute top-0 left-0 w-24 h-24 pointer-events-none z-[3]"
            style={{ color: accentColor }}
            dangerouslySetInnerHTML={{ __html: cornerSvg }}
          />
          {/* Top-right */}
          <div
            className="absolute top-0 right-0 w-24 h-24 pointer-events-none z-[3]"
            style={{ color: accentColor, transform: "scaleX(-1)" }}
            dangerouslySetInnerHTML={{ __html: cornerSvg }}
          />
          {/* Bottom-left */}
          <div
            className="absolute bottom-0 left-0 w-24 h-24 pointer-events-none z-[3]"
            style={{ color: accentColor, transform: "scaleY(-1)" }}
            dangerouslySetInnerHTML={{ __html: cornerSvg }}
          />
          {/* Bottom-right */}
          <div
            className="absolute bottom-0 right-0 w-24 h-24 pointer-events-none z-[3]"
            style={{ color: accentColor, transform: "scale(-1)" }}
            dangerouslySetInnerHTML={{ __html: cornerSvg }}
          />
        </>
      )}

      {/* Floating canvas elements (simple geometric) */}
      {canvasElements.map((el) => (
        <div
          key={el.id}
          style={el.style}
          dangerouslySetInnerHTML={{ __html: el.svg }}
        />
      ))}

      {/* Theme-specific floating elements (lightsabers, webs, skulls, etc.) */}
      <FloatingElements
        themeId={themeId}
        className="absolute inset-0 pointer-events-none z-[4]"
      />
    </div>
  );
}
