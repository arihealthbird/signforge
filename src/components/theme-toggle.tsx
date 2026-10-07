"use client";

import { Icon } from "@/components/icons";
import { setAppTheme, useAppTheme } from "@/lib/hooks";

export function ThemeToggle() {
  const theme = useAppTheme();
  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
      onClick={() => setAppTheme(next)}
      className="grid size-9 shrink-0 place-items-center border-2 border-ink/20 text-ink transition-colors hover:border-ink hover:bg-ink/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
    >
      <Icon name={theme === "dark" ? "sun" : "moon"} size="sm" />
    </button>
  );
}
