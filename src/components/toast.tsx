"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Icon } from "@/components/icons";

/** A tiny toast: call `show("Copied")` and render `node` once near the root. */
export function useToast(): { show: (message: string) => void; node: ReactNode } {
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const show = useCallback((next: string) => {
    setMessage(next);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setMessage(null), 2800);
  }, []);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const node = message ? (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed bottom-6 left-1/2 z-[120] -translate-x-1/2 animate-pop"
    >
      <div className="flex items-center gap-2.5 border-2 border-ink bg-ink px-4 py-2.5 text-sm font-medium text-paper shadow-[4px_4px_0_var(--neon)]">
        <span className="flex size-5 items-center justify-center bg-neon text-neon-ink">
          <Icon name="check" size="xs" />
        </span>
        {message}
      </div>
    </div>
  ) : null;

  return { show, node };
}
