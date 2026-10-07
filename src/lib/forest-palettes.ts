/**
 * The footer forest's day and night palettes, ported from the TheoVex site so
 * the two stay one world. Only the fields the static still draws are kept.
 *
 * Fog intentionally matches the page canvas (`--canvas` in globals.css, per
 * theme), so hazed ridges melt into the page instead of ending on a line.
 */
export interface ForestPalette {
  fog: string;
  ground: string;
  grass: string;
  trunk: string;
  foliage: readonly string[];
  mountainFarthest: string;
  mountainFar: string;
  mountainNear: string;
}

export const FOREST_PALETTES: Record<"day" | "night", ForestPalette> = {
  day: {
    fog: "#f4f3ef",
    ground: "#3f7a3a",
    grass: "#57a64c",
    trunk: "#6b4a2f",
    foliage: ["#4e9a44", "#3f8a3a", "#62b257", "#7cc06a", "#3e8f5e", "#6fae3f"],
    mountainFarthest: "#ddd0e2",
    mountainFar: "#cdb9d4",
    mountainNear: "#9fbb9d",
  },
  night: {
    fog: "#0b0c11",
    ground: "#123320",
    grass: "#1f6a3a",
    trunk: "#3a2a1c",
    foliage: ["#1e5e34", "#17502c", "#2a7a45", "#155b6e", "#1d6b4f", "#33824f"],
    mountainFarthest: "#141a38",
    mountainFar: "#1a2347",
    mountainNear: "#13344a",
  },
};
