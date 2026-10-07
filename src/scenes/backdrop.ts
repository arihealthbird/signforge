import type { Scene } from "./types";

/**
 * Optional scene backdrops.
 *
 * Some scenes can show a short looping video behind the mock window. No media
 * is committed to this repo. A host that wants them re-encodes its own loops
 * (see README), serves them from a CDN, and sets
 * `NEXT_PUBLIC_SCENE_MEDIA_BASE` to that folder's https URL. When the variable
 * is unset or invalid, every scene falls back to its particle effect.
 */

/** The configured media base as a URL, or null when unset or not https. */
export function sceneMediaBase(raw: string | undefined = process.env.NEXT_PUBLIC_SCENE_MEDIA_BASE): URL | null {
  if (!raw) return null;
  try {
    const url = new URL(raw);
    return url.protocol === "https:" ? url : null;
  } catch {
    return null;
  }
}

/** The origin to allow in `media-src` (used by the CSP in `src/proxy.ts`). */
export function sceneMediaOrigin(raw?: string): string | null {
  return sceneMediaBase(raw)?.origin ?? null;
}

export interface SceneMedia {
  video: string;
  poster: string;
  opacity: number;
}

/** Resolves a scene's backdrop against the media base, or null if it has none. */
export function sceneMedia(scene: Scene, raw?: string): SceneMedia | null {
  const base = sceneMediaBase(raw);
  if (!base || !scene.backdrop) return null;
  const root = base.href.endsWith("/") ? base.href : `${base.href}/`;
  return {
    video: new URL(scene.backdrop.file, root).href,
    poster: new URL(scene.backdrop.poster, root).href,
    opacity: scene.backdrop.opacity,
  };
}
