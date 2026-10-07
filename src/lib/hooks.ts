"use client";

import { useSyncExternalStore } from "react";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const PREFERS_DARK = "(prefers-color-scheme: dark)";
const THEME_KEY = "sf-theme";
const THEME_EVENT = "sf-theme-change";

function subscribeReducedMotion(callback: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

/** True when the visitor asked the OS for reduced motion. SSR-safe. */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false
  );
}

export type AppTheme = "light" | "dark";

function readTheme(): AppTheme {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia(PREFERS_DARK).matches ? "dark" : "light";
}

function subscribeTheme(callback: () => void) {
  const mq = window.matchMedia(PREFERS_DARK);
  window.addEventListener(THEME_EVENT, callback);
  mq.addEventListener("change", callback);
  return () => {
    window.removeEventListener(THEME_EVENT, callback);
    mq.removeEventListener("change", callback);
  };
}

/** The current app theme (the `.dark` class on <html> is set by the init script). */
export function useAppTheme(): AppTheme {
  return useSyncExternalStore(subscribeTheme, readTheme, () => "light");
}

export function setAppTheme(next: AppTheme): void {
  document.documentElement.classList.toggle("dark", next === "dark");
  localStorage.setItem(THEME_KEY, next);
  window.dispatchEvent(new Event(THEME_EVENT));
}
