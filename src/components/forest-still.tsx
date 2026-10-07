/**
 * ForestStill: the footer's pixel forest, drawn once as a single inline SVG.
 *
 * Ported from the TheoVex site's `ForestStill`, which is the cheap stand-in for
 * its live 3D footer. The same world: mountain ridges receding into fog, a
 * layered pine tree line and a grass band. No canvas, no WebGL, no animation
 * frame and no JavaScript after paint. It renders on the server and costs
 * nothing to keep on screen.
 *
 * Geometry is generated at module scope with a seeded PRNG, so the server and
 * the client produce byte-identical markup and it never re-renders.
 *
 * Theming is done in CSS, not JavaScript. Both the day and the night still are
 * emitted and one is hidden by the `dark:` variant: this component renders on
 * the server, where the theme is unknowable, so choosing a palette in JS would
 * guarantee a hydration mismatch on every dark-mode load.
 */

import { cn } from "@/lib/cn";
import type { ForestPalette } from "@/lib/forest-palettes";

/** Deterministic PRNG (mulberry32). */
function makeRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// The still is drawn in a fixed 400 x 200 space and stretched to the footer.
const VB_W = 400;
const VB_H = 200;

/** A jagged ridge silhouette as an SVG path, from the left edge to the right. */
function ridgePath(seed: number, baseY: number, height: number, steps: number) {
  const rng = makeRng(seed);
  const dx = VB_W / steps;
  // Quantised to whole units so the silhouette keeps hard pixel steps.
  const points: string[] = [`M -4 ${VB_H}`, `L -4 ${Math.round(baseY)}`];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // Two overlaid sines give a mountain-range profile; the noise roughens it.
    const wave =
      Math.sin(t * Math.PI * 2.3 + seed) * 0.5 + Math.sin(t * Math.PI * 5.7 + seed * 0.7) * 0.3;
    const peak = height * (0.45 + wave * 0.4 + rng() * 0.22);
    points.push(`L ${Math.round(i * dx)} ${Math.round(baseY - peak)}`);
  }
  points.push(`L ${VB_W + 4} ${Math.round(baseY)}`, `L ${VB_W + 4} ${VB_H}`, "Z");
  return points.join(" ");
}

interface PineSpec {
  x: number;
  y: number;
  scale: number;
  tone: number;
}

/** One depth band of pines, scattered deterministically. */
function pineBand(seed: number, count: number, y: number, scale: number): PineSpec[] {
  const rng = makeRng(seed);
  return Array.from({ length: count }, (_, i) => {
    const slot = (i + 0.5) / count;
    return {
      // Jitter within the slot so the band reads scattered, never gridded.
      x: Math.round((slot + ((rng() - 0.5) * 0.7) / count) * VB_W),
      y: Math.round(y + (rng() - 0.5) * 4),
      scale: scale * (0.72 + rng() * 0.56),
      tone: Math.floor(rng() * 6),
    };
  });
}

const RIDGE_FARTHEST = ridgePath(23, 118, 52, 22);
const RIDGE_FAR = ridgePath(41, 128, 40, 26);
const RIDGE_NEAR = ridgePath(87, 138, 26, 30);

const PINES_FAR = pineBand(7, 26, 140, 7);
const PINES_MID = pineBand(19, 18, 152, 11);
const PINES_NEAR = pineBand(31, 11, 168, 17);

/**
 * A chunky pixel pine: a stepped triangular canopy over a short trunk, drawn
 * with rects rather than a polygon so it keeps the 8-bit staircase edge.
 */
function Pine({ pine, foliage, trunk }: { pine: PineSpec; foliage: string; trunk: string }) {
  const { x, y, scale } = pine;
  const unit = Math.max(1, Math.round(scale / 4));
  const tiers = 4;
  return (
    <g>
      <rect x={x - unit / 2} y={y - unit} width={unit} height={unit * 2} fill={trunk} />
      {Array.from({ length: tiers }, (_, i) => {
        // Widest tier at the bottom, narrowing to the tip.
        const w = unit * (tiers - i) * 1.5;
        return (
          <rect
            key={i}
            x={x - w / 2}
            y={y - unit - (i + 1) * unit * 1.15}
            width={w}
            height={unit * 1.3}
            fill={foliage}
          />
        );
      })}
    </g>
  );
}

function StillScene({
  palette,
  idPrefix,
  className,
}: {
  palette: ForestPalette;
  /** Namespaces the gradient ids, since the day and night stills share a document. */
  idPrefix: string;
  className?: string;
}) {
  const hazeId = `${idPrefix}-haze`;
  const groundId = `${idPrefix}-ground`;
  const pines = (band: PineSpec[], key: string) =>
    band.map((p, i) => (
      <Pine
        key={`${key}${i}`}
        pine={p}
        foliage={palette.foliage[p.tone % palette.foliage.length]}
        trunk={palette.trunk}
      />
    ));

  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      preserveAspectRatio="xMidYMax slice"
      className={cn("absolute inset-0 size-full", className)}
      style={{ imageRendering: "pixelated" }}
    >
      <defs>
        {/* Haze toward the horizon, so the ridges dissolve into the page canvas
            instead of ending in a hard line. */}
        <linearGradient id={hazeId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={palette.fog} stopOpacity="0.92" />
          <stop offset="55%" stopColor={palette.fog} stopOpacity="0.28" />
          <stop offset="100%" stopColor={palette.fog} stopOpacity="0" />
        </linearGradient>
        <linearGradient id={groundId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={palette.grass} />
          <stop offset="100%" stopColor={palette.ground} />
        </linearGradient>
      </defs>

      {/* Ridges, farthest first. */}
      <path d={RIDGE_FARTHEST} fill={palette.mountainFarthest} />
      <path d={RIDGE_FAR} fill={palette.mountainFar} />
      <path d={RIDGE_NEAR} fill={palette.mountainNear} />

      {/* Ground plane, then the tree line back to front. */}
      <rect x="0" y="138" width={VB_W} height={VB_H - 138} fill={`url(#${groundId})`} />
      {pines(PINES_FAR, "f")}
      {pines(PINES_MID, "m")}
      {pines(PINES_NEAR, "n")}

      {/* Haze last, over everything, fading downward. */}
      <rect x="0" y="0" width={VB_W} height="150" fill={`url(#${hazeId})`} />
    </svg>
  );
}

export function ForestStill({
  day,
  night,
  idPrefix = "fs",
}: {
  day: ForestPalette;
  night: ForestPalette;
  idPrefix?: string;
}) {
  return (
    <>
      <StillScene palette={day} idPrefix={`${idPrefix}-day`} className="dark:hidden" />
      <StillScene palette={night} idPrefix={`${idPrefix}-night`} className="hidden dark:block" />
    </>
  );
}
