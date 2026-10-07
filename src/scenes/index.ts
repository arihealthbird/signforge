import { CORE_SCENES } from "./core";
// The pop-culture pack is a single import. Remove this line, the spread below
// and the `src/scenes/pop-culture` folder to ship without it.
import { POP_CULTURE_SCENES } from "./pop-culture";
import { SCENE_GROUPS, type Scene, type SceneGroupInfo, type SceneId } from "./types";

export { SCENE_GROUPS };
export type { FxKind, Scene, SceneBackdrop, SceneGroup, SceneGroupInfo, SceneId } from "./types";

export const SCENES: readonly Scene[] = [...CORE_SCENES, ...POP_CULTURE_SCENES];

export const DEFAULT_SCENE_ID: SceneId = "classic";

export function isSceneId(value: unknown): value is SceneId {
  return typeof value === "string" && SCENES.some((s) => s.id === value);
}

export function getScene(id: SceneId): Scene {
  return SCENES.find((s) => s.id === id) ?? SCENES[0];
}

export interface SceneSection {
  group: SceneGroupInfo;
  scenes: Scene[];
}

/** Scenes grouped for the picker. Groups with no scenes are left out, so a
 *  build without the pop-culture pack simply has no "Pop culture" section. */
export function scenesByGroup(): SceneSection[] {
  return SCENE_GROUPS.map((group) => ({
    group,
    scenes: SCENES.filter((s) => s.group === group.id),
  })).filter((section) => section.scenes.length > 0);
}

/** Used in the AI system prompt so the model knows when to pick a scene. */
export function sceneDescription(): string {
  return SCENES.map((s) => {
    const accent = s.id === DEFAULT_SCENE_ID ? "" : ` Suggested accent color ${s.accent}.`;
    return `- ${s.id}: ${s.blurb}${accent}`;
  }).join("\n");
}
