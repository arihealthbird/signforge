import {
  forwardRef,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/icons";

export { cn };

/* ── Button ───────────────────────────────────────────────────────────── */

type ButtonVariant = "primary" | "outline" | "soft" | "ghost";
type ButtonSize = "sm" | "nav" | "md" | "lg" | "icon" | "icon-sm";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  /**
   * Adds the neon hard offset shadow and the press-in motion. Use it on the
   * one primary action of a surface, not on every button.
   */
  lifted?: boolean;
}

const buttonVariants: Record<ButtonVariant, string> = {
  primary: "border-2 border-ink bg-ink text-paper hover:bg-ink/90",
  outline: "border-2 border-ink/15 bg-paper/60 text-ink hover:border-ink hover:bg-paper",
  soft: "border-2 border-transparent bg-ink/[0.05] text-ink hover:bg-ink/[0.09]",
  ghost: "border-2 border-transparent text-muted hover:bg-ink/[0.05] hover:text-ink",
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: "h-8 gap-1.5 px-3 text-[13px]",
  /** The header's size: 36px, to sit level with the square icon buttons. */
  nav: "h-9 gap-1.5 px-4 text-sm",
  md: "h-10 gap-2 px-4 text-sm",
  lg: "h-12 gap-2 px-6 text-[15px]",
  icon: "h-10 w-10",
  "icon-sm": "h-8 w-8",
};

const LIFTED =
  "shadow-[3px_3px_0_var(--neon)] hover:-translate-x-px hover:-translate-y-px hover:shadow-[4px_4px_0_var(--neon)] " +
  "active:translate-x-[2px] active:translate-y-[2px] active:shadow-[0_0_0_var(--neon)]";

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "outline", size = "md", loading = false, lifted = false, disabled, children, ...props },
    ref
  ) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap font-medium transition-[background-color,border-color,color,box-shadow,transform]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
        "disabled:pointer-events-none disabled:opacity-50",
        buttonVariants[variant],
        buttonSizes[size],
        lifted && LIFTED,
        className
      )}
      {...props}
    >
      {loading ? <Spinner className="size-4" /> : null}
      {children}
    </button>
  )
);
Button.displayName = "Button";

export function Spinner({ className }: { className?: string }) {
  return <Icon name="loader" size="md" className={cn("animate-spin", className)} />;
}

/* ── Fields ───────────────────────────────────────────────────────────── */

const fieldClass =
  "w-full border border-line bg-paper px-3 text-sm text-ink outline-none transition-[border-color,box-shadow] placeholder:text-muted/70 " +
  "focus:border-ink focus:shadow-[3px_3px_0_var(--neon)] disabled:cursor-not-allowed disabled:opacity-50";

export const selectClass = cn(fieldClass, "h-10 appearance-none pr-8");

function FieldWrap({
  label,
  hint,
  className,
  children,
}: {
  label?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={cn("flex flex-col gap-1.5", className)}>
      {label ? <span className="text-xs font-medium text-muted">{label}</span> : null}
      {children}
      {hint ? <span className="text-xs text-muted/80">{hint}</span> : null}
    </label>
  );
}

export const TextField = forwardRef<
  HTMLInputElement,
  Omit<InputHTMLAttributes<HTMLInputElement>, "className"> & {
    label?: string;
    hint?: string;
    className?: string;
    inputClassName?: string;
  }
>(({ label, hint, className, inputClassName, ...props }, ref) => (
  <FieldWrap label={label} hint={hint} className={className}>
    <input ref={ref} className={cn(fieldClass, "h-10", inputClassName)} {...props} />
  </FieldWrap>
));
TextField.displayName = "TextField";

export const TextArea = forwardRef<
  HTMLTextAreaElement,
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "className"> & {
    label?: string;
    hint?: string;
    className?: string;
    inputClassName?: string;
  }
>(({ label, hint, className, inputClassName, ...props }, ref) => (
  <FieldWrap label={label} hint={hint} className={className}>
    <textarea
      ref={ref}
      className={cn(fieldClass, "min-h-[88px] resize-none py-2.5", inputClassName)}
      {...props}
    />
  </FieldWrap>
));
TextArea.displayName = "TextArea";

/* ── Segmented control ────────────────────────────────────────────────── */

export interface SegmentedOption<T extends string> {
  value: T;
  label?: ReactNode;
  icon?: ReactNode;
  title?: string;
}

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  className,
  ariaLabel,
}: {
  value: T;
  onChange: (value: T) => void;
  options: SegmentedOption<T>[];
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} className={cn("inline-flex items-center gap-1", className)}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            title={o.title}
            onClick={() => onChange(o.value)}
            className={cn(
              "inline-flex h-8 items-center justify-center gap-1.5 border-2 px-2.5 text-[13px] font-medium transition-[background-color,border-color,color,box-shadow]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30",
              active
                ? "pixel-neon-xs border-ink bg-paper text-ink"
                : "border-transparent text-muted hover:border-ink/15 hover:bg-paper/70 hover:text-ink"
            )}
          >
            {o.icon}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/* ── Switch ───────────────────────────────────────────────────────────── */

export function Switch({
  checked,
  onChange,
  label,
  className,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "group inline-flex items-center gap-2.5 text-left text-xs font-medium text-muted transition-colors hover:text-ink",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
        className
      )}
    >
      <span
        className={cn(
          "relative h-5 w-9 shrink-0 border-2 border-ink transition-colors",
          checked ? "bg-neon" : "bg-paper"
        )}
      >
        <span
          className={cn(
            "absolute left-0.5 top-0.5 size-3 bg-ink transition-transform",
            checked ? "translate-x-4" : "translate-x-0"
          )}
        />
      </span>
      <span>{label}</span>
    </button>
  );
}

/* ── Small pieces ─────────────────────────────────────────────────────── */

export function Chip({ className, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center gap-1.5 border border-line bg-paper px-2.5 py-1.5 text-left text-xs font-medium text-ink",
        "transition-[border-color,box-shadow,transform] hover:-translate-x-px hover:-translate-y-px hover:border-ink hover:shadow-[2px_2px_0_var(--neon)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30 disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="border border-line bg-paper-soft px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted">
      {children}
    </kbd>
  );
}

/** A numbered mono eyebrow: "02 · THE LIVE DEMO". `dot` adds a status dot. */
export function MonoLabel({
  children,
  className,
  dot = false,
}: {
  children: ReactNode;
  className?: string;
  dot?: boolean;
}) {
  // Two text-color utilities on one element resolve by stylesheet order, not by
  // class order, so the muted default only applies when the caller sets no color.
  const hasColor = /(^|\s)text-(ink|white|muted|neon|danger|paper|black)\b/.test(className ?? "");
  return (
    <span className={cn("mono-label inline-flex items-center gap-2", !hasColor && "text-muted", className)}>
      {dot ? <span className="live-dot inline-block size-2 border border-ink bg-neon" aria-hidden /> : null}
      {children}
    </span>
  );
}

export function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

export function PanelSection({
  title,
  index,
  hint,
  children,
  className,
}: {
  title: string;
  /** Position in the panel, shown as "01 ·". */
  index?: number;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("space-y-3", className)}>
      <div>
        <h3 className="mono-label text-muted">
          {index !== undefined ? <span className="text-ink/35">{pad2(index)} · </span> : null}
          {title}
        </h3>
        {hint ? <p className="mt-1.5 text-xs leading-relaxed text-muted/90">{hint}</p> : null}
      </div>
      {children}
    </section>
  );
}

/**
 * The loading state: a row of squares with a short lit run marching along it.
 * Indeterminate, so it announces itself as a progress bar without a value.
 */
export function PixelProgress({
  cells = 12,
  size = "md",
  label = "Working",
  className,
}: {
  cells?: number;
  size?: "sm" | "md";
  label?: string;
  className?: string;
}) {
  return (
    <span
      role="progressbar"
      aria-label={label}
      aria-busy="true"
      className={cn("inline-flex gap-[3px]", className)}
    >
      {Array.from({ length: cells }, (_, i) => (
        <span
          key={i}
          className={cn("pixel-cell", size === "sm" ? "size-2" : "size-2.5")}
          style={{ "--i": i } as CSSProperties}
        />
      ))}
    </span>
  );
}
