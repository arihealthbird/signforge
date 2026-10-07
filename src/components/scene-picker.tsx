"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { SCENES, getScene, scenesByGroup, type SceneId } from "@/scenes";
import { Icon, IconTile } from "@/components/icons";
import { cn } from "@/components/ui";

const ARROWS = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"];

/**
 * The scene picker: one button that shows the current scene, and a popover
 * grid grouped Everyday, Adventure and Pop culture. Each scene is an icon tile
 * plus its name. Scenes only change the mock inbox, never the exported HTML.
 *
 * Keyboard: Escape closes, the arrow keys, Home and End move between scenes,
 * and focus returns to the button after a pick.
 */
export function ScenePicker({
  value,
  onChange,
}: {
  value: SceneId;
  onChange: (id: SceneId) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const current = getScene(value);
  const sections = scenesByGroup();

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const first =
      panel?.querySelector<HTMLElement>('[role="radio"][aria-checked="true"]') ??
      panel?.querySelector<HTMLElement>('[role="radio"]');
    first?.focus();

    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    };
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  const pick = (id: SceneId) => {
    onChange(id);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const onPanelKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!ARROWS.includes(e.key)) return;
    const items = Array.from(panelRef.current?.querySelectorAll<HTMLElement>('[role="radio"]') ?? []);
    const at = items.indexOf(document.activeElement as HTMLElement);
    if (at === -1) return;
    e.preventDefault();
    const step = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : -1;
    const next =
      e.key === "Home" ? 0 : e.key === "End" ? items.length - 1 : (at + step + items.length) % items.length;
    items[next].focus();
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "pixel-neon-xs inline-flex h-10 items-center gap-2.5 border-2 border-ink bg-paper py-0 pl-1.5 pr-3 text-[13px] font-medium text-ink",
          "transition-transform hover:-translate-x-px hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
        )}
      >
        <IconTile name={current.icon} tint={current.accent} size="sm" />
        <span className="mono-label text-muted">Scene</span>
        <span>{current.name}</span>
        <Icon
          name="chevron-down"
          size="sm"
          className={cn("text-muted transition-transform", open && "rotate-180")}
        />
      </button>

      {open ? (
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-label="Choose a scene"
          onKeyDown={onPanelKeyDown}
          className="absolute left-0 top-[calc(100%+10px)] z-40 w-[min(34rem,calc(100vw-1.5rem))] animate-pop border-2 border-ink bg-paper p-4 shadow-[6px_6px_0_var(--neon)]"
        >
          <div className="flex items-baseline justify-between gap-3">
            <span className="mono-label text-muted">
              <span className="text-ink/35">{String(SCENES.length).padStart(2, "0")} · </span>
              Scenes
            </span>
            <span className="text-[11px] text-muted">Changes the mock inbox only, never your export.</span>
          </div>

          <div className="mt-4 space-y-5">
            {sections.map(({ group, scenes }) => (
              <section key={group.id}>
                <h3 className="mono-label text-ink/60">{group.label}</h3>
                {group.note ? (
                  <p className="mt-1.5 text-[11px] leading-snug text-muted">{group.note}</p>
                ) : null}
                <div
                  role="radiogroup"
                  aria-label={group.label}
                  className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-3"
                >
                  {scenes.map((s) => {
                    const active = s.id === value;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        title={s.blurb}
                        onClick={() => pick(s.id)}
                        className={cn(
                          "flex items-center gap-2.5 border-2 p-1.5 pr-2 text-left transition-[border-color,box-shadow,transform]",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40",
                          active
                            ? "pixel-neon-xs border-ink bg-paper"
                            : "border-line hover:-translate-x-px hover:-translate-y-px hover:border-ink"
                        )}
                      >
                        <IconTile name={s.icon} tint={s.accent} size="sm" />
                        <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-ink">
                          {s.name}
                        </span>
                        {active ? <Icon name="check" size="xs" className="text-ink" /> : null}
                      </button>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
