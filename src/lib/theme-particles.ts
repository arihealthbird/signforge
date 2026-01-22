import type { ISourceOptions } from "@tsparticles/engine";
import { EmailThemeId } from "./email-themes";

// Base particle config that all themes extend
const baseConfig: ISourceOptions = {
  fullScreen: { enable: false },
  fpsLimit: 60,
  detectRetina: true,
};

// Professional - Subtle floating dots
const professionalParticles: ISourceOptions = {
  ...baseConfig,
  particles: {
    number: { value: 20, density: { enable: true } },
    color: { value: "#6366f1" },
    shape: { type: "circle" },
    opacity: { value: { min: 0.1, max: 0.3 } },
    size: { value: { min: 1, max: 3 } },
    move: {
      enable: true,
      speed: 0.3,
      direction: "none",
      random: true,
      straight: false,
      outModes: { default: "out" },
    },
  },
};

// Darth Vader - Red particles, dark force energy, occasional lightning
const darthVaderParticles: ISourceOptions = {
  ...baseConfig,
  particles: {
    number: { value: 60, density: { enable: true } },
    color: { value: ["#ef4444", "#dc2626", "#991b1b", "#450a0a"] },
    shape: { type: ["circle", "triangle"] },
    opacity: {
      value: { min: 0.2, max: 0.8 },
      animation: { enable: true, speed: 1, sync: false },
    },
    size: { value: { min: 1, max: 4 } },
    move: {
      enable: true,
      speed: { min: 0.5, max: 2 },
      direction: "none",
      random: true,
      straight: false,
      outModes: { default: "out" },
      attract: { enable: true, rotate: { x: 600, y: 1200 } },
    },
    twinkle: {
      particles: { enable: true, frequency: 0.05, color: "#ff0000", opacity: 1 },
    },
  },
  interactivity: {
    events: {
      onHover: { enable: true, mode: "repulse" },
    },
    modes: {
      repulse: { distance: 100, duration: 0.4 },
    },
  },
};

// Yoda - Green mystical particles, swamp mist effect
const yodaParticles: ISourceOptions = {
  ...baseConfig,
  particles: {
    number: { value: 50, density: { enable: true } },
    color: { value: ["#34d399", "#10b981", "#059669", "#047857", "#065f46"] },
    shape: { type: "circle" },
    opacity: {
      value: { min: 0.1, max: 0.6 },
      animation: { enable: true, speed: 0.5, sync: false },
    },
    size: {
      value: { min: 2, max: 8 },
      animation: { enable: true, speed: 2, sync: false },
    },
    move: {
      enable: true,
      speed: { min: 0.2, max: 0.8 },
      direction: "top",
      random: true,
      straight: false,
      outModes: { default: "out" },
      drift: 2,
    },
    wobble: {
      enable: true,
      distance: 10,
      speed: 5,
    },
  },
};

// Spider-Man - Web strands and red/blue particles with connected web effect
const spiderManParticles: ISourceOptions = {
  ...baseConfig,
  particles: {
    number: { value: 50, density: { enable: true } },
    color: { value: ["#dc2626", "#ef4444", "#1e40af", "#3b82f6", "#ffffff"] },
    shape: { type: "circle" },
    opacity: {
      value: { min: 0.2, max: 0.7 },
      animation: { enable: true, speed: 0.5, sync: false },
    },
    size: { value: { min: 1, max: 4 } },
    links: {
      enable: true,
      distance: 100,
      color: { value: ["#ffffff", "#ef4444"] },
      opacity: 0.25,
      width: 1,
      triangles: {
        enable: true,
        opacity: 0.05,
      },
    },
    move: {
      enable: true,
      speed: { min: 0.8, max: 2.5 },
      direction: "none",
      random: true,
      straight: false,
      outModes: { default: "bounce" },
      attract: { enable: true, rotate: { x: 600, y: 1200 } },
    },
    twinkle: {
      particles: {
        enable: true,
        frequency: 0.03,
        color: "#ef4444",
        opacity: 0.8,
      },
    },
  },
  interactivity: {
    events: {
      onHover: { enable: true, mode: "grab" },
    },
    modes: {
      grab: { distance: 180, links: { opacity: 0.6, color: "#ef4444" } },
    },
  },
};

// Pirate - Gold doubloons falling, ocean mist
const pirateParticles: ISourceOptions = {
  ...baseConfig,
  particles: {
    number: { value: 35, density: { enable: true } },
    color: { value: ["#f59e0b", "#fbbf24", "#d97706", "#92400e", "#78350f"] },
    shape: { type: "circle" },
    opacity: {
      value: { min: 0.4, max: 0.9 },
      animation: { enable: true, speed: 0.8, sync: false },
    },
    size: { value: { min: 2, max: 6 } },
    move: {
      enable: true,
      speed: { min: 1, max: 2.5 },
      direction: "bottom",
      random: true,
      straight: false,
      outModes: { default: "out" },
      gravity: { enable: true, acceleration: 0.5 },
    },
    rotate: {
      value: { min: 0, max: 360 },
      direction: "random",
      animation: { enable: true, speed: 10 },
    },
    tilt: {
      enable: true,
      value: { min: 0, max: 360 },
      direction: "random",
      animation: { enable: true, speed: 30 },
    },
  },
};

// Shakespeare - Quill feathers, golden sparkles, theatrical
const shakespeareParticles: ISourceOptions = {
  ...baseConfig,
  particles: {
    number: { value: 45, density: { enable: true } },
    color: { value: ["#a855f7", "#7c3aed", "#f59e0b", "#fbbf24", "#ffffff"] },
    shape: { type: ["circle", "star"] },
    opacity: {
      value: { min: 0.2, max: 0.8 },
      animation: { enable: true, speed: 1, sync: false },
    },
    size: { value: { min: 1, max: 5 } },
    move: {
      enable: true,
      speed: { min: 0.3, max: 1.2 },
      direction: "none",
      random: true,
      straight: false,
      outModes: { default: "out" },
    },
    twinkle: {
      particles: {
        enable: true,
        frequency: 0.08,
        color: "#fbbf24",
        opacity: 1,
      },
    },
    rotate: {
      value: { min: 0, max: 360 },
      direction: "random",
      animation: { enable: true, speed: 5 },
    },
  },
};

// Surfer Dude - Hawaii tropical vibes with ocean, sunset, and flower colors
const surferDudeParticles: ISourceOptions = {
  ...baseConfig,
  particles: {
    number: { value: 50, density: { enable: true } },
    color: { 
      value: [
        "#06b6d4", // Ocean cyan
        "#0891b2", // Deep ocean
        "#22d3ee", // Light turquoise
        "#f97316", // Sunset orange
        "#fbbf24", // Golden sun
        "#ec4899", // Hibiscus pink
        "#f472b6", // Light pink
        "#fef3c7", // Plumeria cream
        "#a3e635", // Palm green
        "#fb923c", // Papaya orange
      ] 
    },
    shape: { type: ["circle", "star"] },
    opacity: {
      value: { min: 0.15, max: 0.6 },
      animation: { enable: true, speed: 0.6, sync: false },
    },
    size: {
      value: { min: 2, max: 10 },
      animation: { enable: true, speed: 2, sync: false },
    },
    move: {
      enable: true,
      speed: { min: 0.3, max: 1.2 },
      direction: "top-right",
      random: true,
      straight: false,
      outModes: { default: "out" },
      drift: 1,
    },
    wobble: {
      enable: true,
      distance: 20,
      speed: 6,
    },
    rotate: {
      value: { min: 0, max: 360 },
      direction: "random",
      animation: { enable: true, speed: 4 },
    },
    twinkle: {
      particles: {
        enable: true,
        frequency: 0.04,
        color: "#fef3c7",
        opacity: 0.9,
      },
    },
  },
};

// The Office - Paper confetti, coffee, office supplies vibes
const theOfficeParticles: ISourceOptions = {
  ...baseConfig,
  particles: {
    number: { value: 35, density: { enable: true } },
    color: { value: ["#f5f0e6", "#fff9c4", "#c4b8a8", "#8b7355", "#ffd700", "#f4d03f"] },
    shape: { type: ["square", "circle"] },
    opacity: {
      value: { min: 0.15, max: 0.5 },
      animation: { enable: true, speed: 0.5, sync: false },
    },
    size: {
      value: { min: 3, max: 10 },
      animation: { enable: true, speed: 2, sync: false },
    },
    move: {
      enable: true,
      speed: { min: 0.3, max: 1 },
      direction: "bottom",
      random: true,
      straight: false,
      outModes: { default: "out" },
      gravity: { enable: true, acceleration: 0.3 },
    },
    rotate: {
      value: { min: 0, max: 360 },
      direction: "random",
      animation: { enable: true, speed: 8 },
    },
    tilt: {
      enable: true,
      value: { min: 0, max: 360 },
      direction: "random",
      animation: { enable: true, speed: 15 },
    },
    wobble: {
      enable: true,
      distance: 10,
      speed: 5,
    },
  },
};

// Parks and Recreation - Warm government/autumn leaves vibe
const parksAndRecreationParticles: ISourceOptions = {
  ...baseConfig,
  particles: {
    number: { value: 25, density: { enable: true } },
    color: { value: ["#daa520", "#f59e0b", "#fbbf24", "#d4a574", "#a89880", "#4ade80"] },
    shape: { type: ["circle", "square"] },
    opacity: {
      value: { min: 0.15, max: 0.5 },
      animation: { enable: true, speed: 0.6, sync: false },
    },
    size: {
      value: { min: 3, max: 10 },
      animation: { enable: true, speed: 2, sync: false },
    },
    move: {
      enable: true,
      speed: { min: 0.4, max: 1.2 },
      direction: "bottom",
      random: true,
      straight: false,
      outModes: { default: "out" },
      gravity: { enable: true, acceleration: 0.2 },
    },
    rotate: {
      value: { min: 0, max: 360 },
      direction: "random",
      animation: { enable: true, speed: 6 },
    },
    tilt: {
      enable: true,
      value: { min: 0, max: 360 },
      direction: "random",
      animation: { enable: true, speed: 12 },
    },
    wobble: {
      enable: true,
      distance: 12,
      speed: 6,
    },
  },
};

// Map theme IDs to particle configurations
export const themeParticlesConfig: Record<EmailThemeId, ISourceOptions> = {
  professional: professionalParticles,
  "darth-vader": darthVaderParticles,
  yoda: yodaParticles,
  "spider-man": spiderManParticles,
  pirate: pirateParticles,
  shakespeare: shakespeareParticles,
  "surfer-dude": surferDudeParticles,
  "the-office": theOfficeParticles,
  "parks-and-recreation": parksAndRecreationParticles,
};

export function getThemeParticles(themeId: EmailThemeId): ISourceOptions {
  return themeParticlesConfig[themeId] || professionalParticles;
}
