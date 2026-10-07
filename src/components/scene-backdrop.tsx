"use client";

import { sceneMedia } from "@/scenes/backdrop";
import type { Scene } from "@/scenes";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/cn";

/**
 * A short looping video behind the mock window, for scenes that define one.
 * Nothing renders unless `NEXT_PUBLIC_SCENE_MEDIA_BASE` points at hosted files
 * (see `src/scenes/backdrop.ts`), so a default install ships no media and
 * makes no request. It mounts only for the scene that is on screen, so the
 * video is fetched when someone picks that scene, never up front, and it is
 * skipped under reduced motion.
 */
export function SceneBackdrop({ scene, className }: { scene: Scene; className?: string }) {
  const reduced = usePrefersReducedMotion();
  const media = sceneMedia(scene);
  if (!media || reduced) return null;

  return (
    <video
      key={media.video}
      className={cn("h-full w-full object-cover", className)}
      src={media.video}
      poster={media.poster}
      style={{ opacity: media.opacity }}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden
    />
  );
}
