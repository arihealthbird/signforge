/**
 * A small set of original pictograms for subjects Lucide does not draw
 * (a stapler, a waffle, a web, a hilt, a hat).
 *
 * They follow Lucide's rules so they sit next to its icons without looking
 * different: a 24 x 24 grid, a 2px stroke, round caps and joins, no fill on
 * outlines. Small solid details are allowed and are drawn without a stroke.
 *
 * This file is pure data so it is safe on the server and easy to test. The
 * renderer lives in `src/components/icons.tsx`. Every pictogram is original
 * artwork released under the project's Apache-2.0 license.
 */

export interface Pictogram {
  /** Human name, used as the accessible label when the icon stands alone. */
  label: string;
  /** Outline paths. Stroked with currentColor, never filled. */
  strokes: readonly string[];
  /** Small solid details. Filled with currentColor, never stroked. */
  solids?: readonly string[];
  /** Optional transform for the whole drawing, in the 24 x 24 space. */
  transform?: string;
}

export const PICTOGRAMS = {
  /** A desk stapler with its arm raised: the wedge-shaped arm, two posts and a solid base. */
  stapler: {
    label: "Stapler",
    strokes: ["M3.5 12.5V9.5L17.5 5l3.5 2.5v3.5z", "M5 12.5V16", "M17 11v5"],
    solids: ["M3 16h18a1 1 0 0 1 1 1v1.5H2V17a1 1 0 0 1 1-1z"],
  },

  /** A waffle with a pat of butter in the middle square. */
  waffle: {
    label: "Waffle",
    strokes: [
      "M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
      "M3 9h18",
      "M3 15h18",
      "M9 3v18",
      "M15 3v18",
    ],
    solids: ["M11 11h2v2h-2z"],
  },

  /** A spider web: three spokes and two sagging rings. */
  web: {
    label: "Web",
    strokes: [
      "M12 2v20",
      "M3.3 7l17.4 10",
      "M3.3 17L20.7 7",
      "M12 3Q14.9 6.9 19.8 7.5Q17.9 12 19.8 16.5Q14.9 17.1 12 21Q9.1 17.1 4.2 16.5Q6.2 12 4.2 7.5Q9.1 6.9 12 3z",
      "M12 7Q13.6 9.2 16.3 9.5Q15.3 12 16.3 14.5Q13.6 14.8 12 17Q10.4 14.8 7.7 14.5Q8.7 12 7.7 9.5Q10.4 9.2 12 7z",
    ],
  },

  /** An energy-blade hilt on the diagonal: a solid grip with a collar and pommel, and the blade. */
  "saber-hilt": {
    label: "Saber hilt",
    strokes: ["M12.5 11.5L20.5 3.5"],
    solids: [
      "M14.13 13.13L12.86 14.4L12.22 13.76L7.69 18.29L8.11 18.71L6.98 19.84L4.16 17.02L5.29 15.89L5.71 16.31L10.24 11.78L9.6 11.14L10.87 9.87z",
    ],
  },

  /** A fedora: wide brim, crown and band. */
  fedora: {
    label: "Fedora",
    strokes: [
      "M2.5 16.5c0-1.4 4-2.5 9.5-2.5s9.5 1.1 9.5 2.5-4 2.5-9.5 2.5-9.5-1.1-9.5-2.5z",
      "M6.5 14.4V10C6.5 7 8.5 5 12 5s5.5 2 5.5 5v4.4",
      "M6.6 11.8c3.4 1 7.4 1 10.8 0",
    ],
  },
} as const satisfies Record<string, Pictogram>;

export type PictogramName = keyof typeof PICTOGRAMS;

export const PICTOGRAM_NAMES = Object.keys(PICTOGRAMS) as PictogramName[];

export function isPictogramName(value: string): value is PictogramName {
  return Object.prototype.hasOwnProperty.call(PICTOGRAMS, value);
}
