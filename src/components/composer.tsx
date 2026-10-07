"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Button, Chip, Kbd, cn } from "@/components/ui";
import { Icon } from "@/components/icons";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { EXAMPLE_PROMPTS } from "@/lib/samples";

const MAX_LENGTH = 2000;

/** Types example prompts into the empty box, one after another. */
function useTypewriter(lines: string[], active: boolean): string {
  const reduced = usePrefersReducedMotion();
  const [text, setText] = useState("");

  useEffect(() => {
    if (!active || reduced) return;
    let line = 0;
    let i = 0;
    let dir = 1;
    let timer = 0;

    const tick = () => {
      const full = lines[line];
      i += dir;
      setText(full.slice(0, i));
      if (dir === 1 && i >= full.length) {
        dir = -1;
        timer = window.setTimeout(tick, 1900);
        return;
      }
      if (dir === -1 && i <= 0) {
        dir = 1;
        line = (line + 1) % lines.length;
        timer = window.setTimeout(tick, 380);
        return;
      }
      timer = window.setTimeout(tick, dir === 1 ? 30 : 12);
    };

    timer = window.setTimeout(tick, 700);
    return () => window.clearTimeout(timer);
  }, [lines, active, reduced]);

  return reduced ? lines[0] : text;
}

export interface ComposerProps {
  onSubmit: (prompt: string) => void;
  loading?: boolean;
  /** `hero` is the big landing box, `dock` is the compact one under the chat. */
  variant?: "hero" | "dock";
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
}

/**
 * The prompt box. A flat paper card with a 2px ink border and a hard neon
 * offset shadow that grows when it has focus: the SignForge accent, used as
 * the active-state shadow.
 */
export function Composer({
  onSubmit,
  loading = false,
  variant = "hero",
  placeholder,
  autoFocus = false,
  className,
}: ComposerProps) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);
  const hero = variant === "hero";

  const typed = useTypewriter(EXAMPLE_PROMPTS, hero && !focused && value === "");

  useEffect(() => {
    if (autoFocus) ref.current?.focus();
  }, [autoFocus]);

  const submit = () => {
    const prompt = value.trim();
    if (!prompt || loading) return;
    onSubmit(prompt);
    setValue("");
  };

  const surprise = () => {
    const pick = EXAMPLE_PROMPTS[Math.floor(Math.random() * EXAMPLE_PROMPTS.length)];
    onSubmit(pick);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div
      className={cn(
        "border-2 border-ink bg-paper transition-shadow",
        hero
          ? "p-3 shadow-[6px_6px_0_var(--neon)] focus-within:shadow-[9px_9px_0_var(--neon)]"
          : "p-2 shadow-[3px_3px_0_var(--neon)] focus-within:shadow-[5px_5px_0_var(--neon)]",
        className
      )}
      data-active={loading}
    >
      <div className="relative">
        <textarea
          ref={ref}
          value={value}
          rows={hero ? 3 : 2}
          maxLength={MAX_LENGTH}
          disabled={loading}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-label="Describe the signature you want"
          placeholder={hero ? "" : placeholder}
          className={cn(
            "block w-full resize-none bg-transparent px-3 text-ink outline-none placeholder:text-muted/70 disabled:opacity-60",
            hero ? "pt-2 text-[17px] leading-relaxed sm:text-lg" : "pt-1.5 text-sm leading-relaxed"
          )}
        />
        {hero && value === "" ? (
          <span
            aria-hidden
            className="pointer-events-none absolute left-3 right-3 top-2 text-[17px] leading-relaxed text-muted/80 sm:text-lg"
          >
            {focused ? "Who are you, and what should it look like?" : typed}
            {!focused ? <span className="ml-0.5 inline-block animate-blink">|</span> : null}
          </span>
        ) : null}
      </div>

      <div className={cn("flex items-center gap-2", hero ? "mt-2 px-1" : "mt-1 px-0.5")}>
        {hero ? (
          <Chip onClick={surprise} disabled={loading}>
            <Icon name="shuffle" size="xs" />
            Surprise me
          </Chip>
        ) : null}
        <span className="ml-auto hidden items-center gap-1.5 text-[11px] text-muted sm:flex">
          <Kbd>Enter</Kbd> to generate
        </span>
        <Button
          variant="primary"
          size={hero ? "md" : "sm"}
          onClick={submit}
          disabled={!value.trim()}
          loading={loading}
          aria-label="Generate signature"
        >
          {loading ? "Forging" : "Generate"}
          {!loading ? <Icon name="arrow-up" size="sm" /> : null}
        </Button>
      </div>
    </div>
  );
}
