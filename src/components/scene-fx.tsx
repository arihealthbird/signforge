"use client";

import { useEffect, useRef } from "react";
import type { FxKind } from "@/scenes";

/**
 * Ambient effects behind the email window. A small hand-rolled canvas engine
 * instead of a particles library: one behavior per effect, one loop, paused
 * when the tab is hidden or the stage is scrolled out of view, and a single
 * static frame under reduced motion. No dependencies, no network.
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  a: number;
  phase: number;
  color: string;
  len: number;
  rot: number;
  vr: number;
  /** A variant within a behavior (a leaf or a pollen grain, a firefly or mist). */
  k: number;
}

interface Size {
  w: number;
  h: number;
  dark: boolean;
}

interface Frame extends Size {
  ctx: CanvasRenderingContext2D;
  t: number;
}

interface Behavior {
  /** Stage pixels per particle. Smaller means denser. */
  density: number;
  max: number;
  min?: number;
  spawn: (size: Size, palette: readonly string[], initial: boolean) => Particle;
  /** Advances and draws every particle for one frame. */
  frame: (
    f: Frame,
    particles: Particle[],
    palette: readonly string[],
    respawn: (p: Particle) => void
  ) => void;
}

const TAU = Math.PI * 2;
const rand = (min: number, max: number) => min + Math.random() * (max - min);
const pick = (palette: readonly string[]) => palette[Math.floor(Math.random() * palette.length)];

function blank(palette: readonly string[], dark: boolean): Particle {
  // White would vanish on a light stage, so light mode draws from the other
  // colors in the palette when there are any.
  const usable = dark ? palette : palette.filter((c) => c.toLowerCase() !== "#ffffff");
  return {
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    r: 1,
    a: 1,
    phase: rand(0, TAU),
    color: pick(usable.length ? usable : palette),
    len: 0,
    rot: 0,
    vr: 0,
    k: 0,
  };
}

function circle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, TAU);
  ctx.fill();
}

/** A four-point twinkle star drawn with quadratic curves. */
function star(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.quadraticCurveTo(x, y, x, y + r);
  ctx.quadraticCurveTo(x, y, x - r, y);
  ctx.quadraticCurveTo(x, y, x, y - r);
  ctx.fill();
}

/** "#rrggbb" and an alpha to an rgba() string. */
function rgba(hex: string, a: number): string {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

const BEHAVIORS: Record<Exclude<FxKind, "none">, Behavior> = {
  /* Pirate: embers rising from below, with a soft halo. */
  embers: {
    density: 16000,
    max: 56,
    spawn: (s, pal, initial) => ({
      ...blank(pal, s.dark),
      x: rand(0, s.w),
      y: initial ? rand(0, s.h) : s.h + 8,
      vx: rand(-0.15, 0.15),
      vy: -rand(0.25, 0.8),
      r: rand(0.8, 2.6),
      a: rand(0.5, 1),
    }),
    frame: ({ ctx, h, t }, ps, _pal, respawn) => {
      for (const p of ps) {
        p.x += p.vx + Math.sin(t / 900 + p.phase) * 0.18;
        p.y += p.vy;
        const life = Math.max(0, Math.min(1, p.y / h));
        if (p.y < -10) respawn(p);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.a * life * 0.25;
        circle(ctx, p.x, p.y, p.r * 3);
        ctx.globalAlpha = p.a * life;
        circle(ctx, p.x, p.y, p.r);
      }
    },
  },

  /* Bard: twinkling four-point stars that relocate when they fade out. */
  sparkles: {
    density: 16000,
    max: 56,
    spawn: (s, pal) => ({ ...blank(pal, s.dark), x: rand(0, s.w), y: rand(0, s.h), r: rand(3, 8) }),
    frame: ({ ctx, w, h, t }, ps) => {
      for (const p of ps) {
        const tw = 0.5 + 0.5 * Math.sin(t / 650 + p.phase);
        if (tw < 0.02) {
          p.x = rand(0, w);
          p.y = rand(0, h);
        }
        ctx.fillStyle = p.color;
        ctx.globalAlpha = tw;
        star(ctx, p.x, p.y, p.r * (0.5 + tw * 0.6));
      }
    },
  },

  /* Surf: bubbles drifting up, each with a highlight. */
  bubbles: {
    density: 16000,
    max: 56,
    spawn: (s, pal, initial) => ({
      ...blank(pal, s.dark),
      x: rand(0, s.w),
      y: initial ? rand(0, s.h) : s.h + 20,
      vy: -rand(0.2, 0.55),
      r: rand(3, 13),
      a: rand(0.35, 0.8),
    }),
    frame: ({ ctx, t }, ps, _pal, respawn) => {
      for (const p of ps) {
        p.x += Math.sin(t / 1100 + p.phase) * 0.35;
        p.y += p.vy;
        if (p.y < -p.r * 2) respawn(p);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1;
        ctx.globalAlpha = p.a * 0.7;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, TAU);
        ctx.stroke();
        ctx.globalAlpha = p.a * 0.12;
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.globalAlpha = p.a * 0.8;
        circle(ctx, p.x - p.r * 0.35, p.y - p.r * 0.35, Math.max(0.8, p.r * 0.18));
      }
    },
  },

  /* Noir: slanted rain streaks. */
  rain: {
    density: 16000,
    max: 56,
    spawn: (s, pal, initial) => ({
      ...blank(pal, s.dark),
      x: rand(-20, s.w + 40),
      y: initial ? rand(-s.h, s.h) : rand(-60, -10),
      vx: -1.4,
      vy: rand(6, 11),
      len: rand(10, 22),
      a: rand(0.25, 0.55),
    }),
    frame: ({ ctx, h }, ps, _pal, respawn) => {
      for (const p of ps) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y > h + 20) respawn(p);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1;
        ctx.globalAlpha = p.a;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.vx * 1.6, p.y - p.len);
        ctx.stroke();
      }
    },
  },

  /* Cosmic: a drifting, twinkling star field. */
  stars: {
    density: 9000,
    max: 90,
    spawn: (s, pal) => ({
      ...blank(pal, s.dark),
      x: rand(0, s.w),
      y: rand(0, s.h),
      vx: rand(0.01, 0.05),
      r: rand(0.4, 1.7),
      a: rand(0.4, 1),
    }),
    frame: ({ ctx, w, t }, ps) => {
      for (const p of ps) {
        p.x += p.vx;
        if (p.x > w + 4) p.x = -4;
        const tw = 0.55 + 0.45 * Math.sin(t / 700 + p.phase);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.a * tw;
        circle(ctx, p.x, p.y, p.r);
      }
    },
  },

  /* The Office: sheets of paper and the odd sticky note, tumbling down. */
  papers: {
    density: 18000,
    max: 40,
    min: 12,
    spawn: (s, pal, initial) => {
      const sticky = Math.random() < 0.2;
      return {
        ...blank(pal, s.dark),
        k: sticky ? 1 : 0,
        color: sticky ? "#ffe36e" : pick(pal),
        x: rand(0, s.w),
        y: initial ? rand(-20, s.h) : -24,
        vx: rand(-0.25, 0.25),
        vy: rand(0.35, 1),
        r: rand(7, 12),
        rot: rand(0, TAU),
        vr: rand(-0.02, 0.02),
        a: rand(0.6, 0.95),
      };
    },
    frame: ({ ctx, h, t, dark }, ps, _pal, respawn) => {
      for (const p of ps) {
        p.x += p.vx + Math.sin(t / 800 + p.phase) * 0.35;
        p.y += p.vy;
        p.rot += p.vr;
        if (p.y > h + 24) respawn(p);
        // Flips as it falls: the width swings between 40% and 100%.
        const flip = 0.4 + 0.6 * Math.abs(Math.cos(t / 1100 + p.phase));
        const pw = p.r;
        const ph = p.k ? p.r : p.r * 1.3;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.scale(flip, 1);
        ctx.globalAlpha = p.a;
        ctx.fillStyle = p.color;
        ctx.fillRect(-pw / 2, -ph / 2, pw, ph);
        // A thin outline so white paper still reads on a light stage.
        ctx.lineWidth = 1;
        ctx.strokeStyle = dark ? "rgba(255,255,255,0.4)" : "rgba(70,55,35,0.38)";
        ctx.strokeRect(-pw / 2, -ph / 2, pw, ph);
        if (!p.k) {
          ctx.beginPath();
          for (const row of [-0.16, 0.1]) {
            ctx.moveTo(-pw * 0.3, ph * row);
            ctx.lineTo(pw * 0.3, ph * row);
          }
          ctx.stroke();
        }
        ctx.restore();
      }
    },
  },

  /* Parks & Rec: autumn leaves swaying down, and pollen drifting across. */
  leaves: {
    density: 16000,
    max: 50,
    spawn: (s, pal, initial) => {
      if (Math.random() < 0.4) {
        return {
          ...blank(pal, s.dark),
          k: 1,
          color: "#f5c518",
          x: rand(0, s.w),
          y: rand(0, s.h),
          vx: rand(0.05, 0.3),
          vy: rand(-0.25, 0.05),
          r: rand(0.8, 1.8),
          a: rand(0.4, 0.9),
        };
      }
      return {
        ...blank(pal, s.dark),
        x: rand(0, s.w),
        y: initial ? rand(-10, s.h) : -14,
        vx: rand(-0.2, 0.35),
        vy: rand(0.4, 0.95),
        r: rand(5, 9),
        rot: rand(0, TAU),
        vr: rand(-0.025, 0.025),
        a: rand(0.55, 0.95),
      };
    },
    frame: ({ ctx, w, h, t }, ps, _pal, respawn) => {
      for (const p of ps) {
        if (p.k === 1) {
          p.x += p.vx + Math.sin(t / 1300 + p.phase) * 0.2;
          p.y += p.vy + Math.cos(t / 1700 + p.phase) * 0.12;
          if (p.x > w + 6 || p.y < -6 || p.y > h + 6) {
            p.x = -4;
            p.y = rand(0, h);
          }
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.a * (0.5 + 0.5 * Math.sin(t / 500 + p.phase));
          circle(ctx, p.x, p.y, p.r);
          continue;
        }
        p.x += p.vx + Math.sin(t / 900 + p.phase) * 0.5;
        p.y += p.vy;
        p.rot += p.vr;
        if (p.y > h + 14) respawn(p);
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot + Math.sin(t / 800 + p.phase) * 0.4);
        ctx.globalAlpha = p.a;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.moveTo(0, -p.r);
        ctx.quadraticCurveTo(p.r * 0.95, 0, 0, p.r);
        ctx.quadraticCurveTo(-p.r * 0.95, 0, 0, -p.r);
        ctx.fill();
        // The midrib.
        ctx.strokeStyle = "rgba(0,0,0,0.28)";
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(0, -p.r * 0.8);
        ctx.lineTo(0, p.r * 0.9);
        ctx.stroke();
        ctx.restore();
      }
    },
  },

  /* Yoda: fireflies pulsing in the dark, and mist rolling low across the swamp. */
  fireflies: {
    density: 15000,
    max: 46,
    spawn: (s, pal) => {
      if (Math.random() < 0.14) {
        return {
          ...blank(pal, s.dark),
          k: 1,
          x: rand(-40, s.w),
          y: rand(s.h * 0.45, s.h),
          vx: rand(0.06, 0.18),
          r: rand(70, 150),
          a: rand(0.07, 0.13),
        };
      }
      return {
        ...blank(pal, s.dark),
        x: rand(0, s.w),
        y: rand(0, s.h),
        vx: rand(-0.22, 0.22),
        vy: rand(-0.22, 0.12),
        r: rand(1.2, 2.4),
        a: rand(0.6, 1),
      };
    },
    frame: ({ ctx, w, h, t, dark }, ps) => {
      for (const p of ps) {
        if (p.k === 1) {
          p.x += p.vx;
          if (p.x - p.r > w) p.x = -p.r;
          const mist = dark ? "#b8d8c0" : "#7fa88a";
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
          g.addColorStop(0, rgba(mist, p.a));
          g.addColorStop(1, rgba(mist, 0));
          ctx.globalAlpha = 1;
          ctx.fillStyle = g;
          ctx.fillRect(p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
          continue;
        }
        p.x += p.vx + Math.sin(t / 1200 + p.phase) * 0.25;
        p.y += p.vy + Math.cos(t / 1500 + p.phase) * 0.2;
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;
        const pulse = 0.5 + 0.5 * Math.sin(t / 650 + p.phase);
        const halo = p.r * (5 + pulse * 3);
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, halo);
        g.addColorStop(0, rgba(p.color, 0.1 + 0.5 * pulse));
        g.addColorStop(1, rgba(p.color, 0));
        ctx.globalAlpha = 1;
        ctx.fillStyle = g;
        ctx.fillRect(p.x - halo, p.y - halo, halo * 2, halo * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.55 + 0.45 * pulse;
        circle(ctx, p.x, p.y, p.r * 0.7);
      }
    },
  },

  /* Spider-Man: drifting nodes joined by fine web lines when they get close. */
  web: {
    density: 10000,
    max: 60,
    min: 18,
    spawn: (s, pal) => ({
      ...blank(pal, s.dark),
      x: rand(0, s.w),
      y: rand(0, s.h),
      vx: rand(-0.3, 0.3),
      vy: rand(-0.3, 0.3),
      r: rand(1, 2.4),
      a: rand(0.5, 0.9),
    }),
    frame: ({ ctx, w, h }, ps) => {
      const reach = Math.min(150, Math.max(90, w / 8));
      for (const p of ps) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }
      ctx.lineWidth = 1;
      for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < ps.length; j++) {
          const dx = ps[i].x - ps[j].x;
          const dy = ps[i].y - ps[j].y;
          const d2 = dx * dx + dy * dy;
          if (d2 >= reach * reach) continue;
          ctx.globalAlpha = (1 - Math.sqrt(d2) / reach) * 0.35;
          ctx.strokeStyle = ps[i].color;
          ctx.beginPath();
          ctx.moveTo(ps[i].x, ps[i].y);
          ctx.lineTo(ps[j].x, ps[j].y);
          ctx.stroke();
        }
      }
      for (const p of ps) {
        ctx.globalAlpha = p.a;
        ctx.fillStyle = p.color;
        circle(ctx, p.x, p.y, p.r);
      }
    },
  },

  /* Vader: a hologram. Scanlines, a slow bright sweep, and flickering pixels. */
  scanlines: {
    density: 26000,
    max: 34,
    min: 10,
    spawn: (s, pal, initial) => ({
      ...blank(pal, s.dark),
      x: rand(0, s.w),
      y: initial ? rand(0, s.h) : s.h + 6,
      vy: -rand(0.15, 0.6),
      r: rand(1.5, 4),
      len: rand(0.8, 1.8),
      a: rand(0.3, 0.9),
    }),
    frame: ({ ctx, w, h, t, dark }, ps, _pal, respawn) => {
      ctx.globalAlpha = 1;
      ctx.fillStyle = dark ? "rgba(239,68,68,0.06)" : "rgba(127,29,29,0.07)";
      ctx.beginPath();
      for (let y = 0; y < h; y += 3) ctx.rect(0, y, w, 1);
      ctx.fill();

      const band = 140;
      const sweep = ((t / 18) % (h + band * 2)) - band;
      const g = ctx.createLinearGradient(0, sweep, 0, sweep + band);
      g.addColorStop(0, "rgba(239,68,68,0)");
      g.addColorStop(0.5, dark ? "rgba(239,68,68,0.14)" : "rgba(220,38,38,0.1)");
      g.addColorStop(1, "rgba(239,68,68,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, sweep, w, band);

      for (const p of ps) {
        p.y += p.vy;
        if (p.y < -6) respawn(p);
        const flicker = Math.sin(t / 120 + p.phase) > 0.35 ? 1 : 0.15;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.a * flicker;
        ctx.fillRect(Math.round(p.x), Math.round(p.y), p.r, p.r * p.len);
      }
    },
  },
};

export function SceneFx({
  kind,
  colors,
  dark = false,
  className,
}: {
  kind: FxKind;
  colors: readonly string[];
  /** The preview's inbox appearance, so effects can stay visible on both. */
  dark?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || kind === "none") return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const behavior = BEHAVIORS[kind];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const palette = colors.length ? colors : ["#ffffff"];

    let w = 0;
    let h = 0;
    let raf = 0;
    let running = false;
    let onScreen = true;
    let particles: Particle[] = [];

    const size = (): Size => ({ w, h, dark });
    const respawn = (p: Particle) => {
      Object.assign(p, behavior.spawn(size(), palette, false));
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      behavior.frame({ ctx, w, h, t, dark }, particles, palette, respawn);
      ctx.globalAlpha = 1;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(
        behavior.min ?? 14,
        Math.min(behavior.max, Math.round((w * h) / behavior.density))
      );
      particles = Array.from({ length: count }, () => behavior.spawn(size(), palette, true));
      if (reduced) draw(0);
    };

    const loop = (t: number) => {
      if (!running) return;
      draw(t);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || reduced) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    const sync = () => (document.hidden || !onScreen ? stop() : start());

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    // Nothing to animate while the stage is off screen or the tab is hidden.
    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    });
    io.observe(canvas);
    document.addEventListener("visibilitychange", sync);
    sync();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [kind, colors, dark]);

  if (kind === "none") return null;
  return <canvas ref={ref} className={className} aria-hidden />;
}
