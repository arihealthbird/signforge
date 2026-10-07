import type { IconName } from "@/components/icons";

/**
 * Scenes are the "mood" of the mock email client the signature is previewed
 * in: the title-bar gradient, the sample message, an icon, an accent colour
 * and an optional particle effect behind the window. They never affect the
 * exported HTML.
 *
 * This file is pure data and types, safe to import on the server (the AI layer
 * uses the ids and blurbs to pick a mood).
 */

/** The original scenes that ship in `src/scenes/core`. */
export type CoreSceneId = "classic" | "pirate" | "bard" | "surf" | "noir" | "cosmic";

/**
 * The pop-culture pack in `src/scenes/pop-culture`: parody tributes. To ship
 * without them, delete that folder, remove its import in `src/scenes/index.ts`
 * and drop this union.
 */
export type PopSceneId = "office" | "parks" | "vader" | "yoda" | "spiderman";

export type SceneId = CoreSceneId | PopSceneId;

export type SceneGroup = "everyday" | "adventure" | "pop-culture";

export interface SceneGroupInfo {
  id: SceneGroup;
  label: string;
  /** A short line shown under the group heading in the picker. */
  note?: string;
}

export const SCENE_GROUPS: readonly SceneGroupInfo[] = [
  { id: "everyday", label: "Everyday" },
  { id: "adventure", label: "Adventure" },
  {
    id: "pop-culture",
    label: "Pop culture",
    note: "Unofficial tributes. Not affiliated with or endorsed by the shows, studios or their owners.",
  },
];

/**
 * The particle effects the canvas engine (`src/components/scene-fx.tsx`) can
 * draw. A new scene should reuse one of these or add a behavior there.
 */
export type FxKind =
  | "none"
  | "embers"
  | "sparkles"
  | "bubbles"
  | "rain"
  | "stars"
  | "papers"
  | "leaves"
  | "fireflies"
  | "web"
  | "scanlines";

/**
 * An optional looping video behind the window. No media ships with the repo:
 * the files are resolved against `NEXT_PUBLIC_SCENE_MEDIA_BASE` and the
 * backdrop simply does not render when that is unset (see `./backdrop.ts`).
 */
export interface SceneBackdrop {
  /** File name under the media base, for example "pirate.mp4". */
  file: string;
  /** Still frame shown until the video is ready, for example "pirate.jpg". */
  poster: string;
  /** How strongly the video shows through, 0 to 1. */
  opacity: number;
}

export interface Scene {
  id: SceneId;
  name: string;
  group: SceneGroup;
  /** A key in the icon registry (`src/components/icons.tsx`). */
  icon: IconName;
  /** A 6-digit hex. Tints the scene's icon tile and its selected state. */
  accent: string;
  /** One line used for the tooltip and to tell the AI when to pick it. */
  blurb: string;
  to: string;
  subject: string;
  greeting: string;
  body: string[];
  closing: string;
  /** Title-bar background per colour mode. */
  bar: { light: string; dark: string };
  /** Title-bar text colour per colour mode. */
  barText: { light: string; dark: string };
  /** The three window-control squares. */
  dots: [string, string, string];
  /** Soft wash painted on the stage behind the window. */
  stage: { light: string; dark: string };
  fx: FxKind;
  fxColors: string[];
  /** Optional face for the greeting and subject lines. Must be one we ship. */
  font?: string;
  backdrop?: SceneBackdrop;
}
