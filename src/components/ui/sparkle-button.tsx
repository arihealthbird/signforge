"use client";

import { forwardRef, ButtonHTMLAttributes, ReactNode } from "react";
import { clsx } from "clsx";

export interface SparkleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg";
}

const SparkleButton = forwardRef<HTMLButtonElement, SparkleButtonProps>(
  ({ className, children, variant = "outline", size = "sm", ...props }, ref) => {
    return (
      <button
        className={clsx(
          "relative inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          "border-rainbow-animated bg-background sparkle-container",
          "hover:scale-[1.02] active:scale-[0.98]",
          {
            "h-10 px-4 py-2": size === "default",
            "h-9 px-3": size === "sm",
            "h-11 px-8": size === "lg",
          },
          className
        )}
        ref={ref}
        {...props}
      >
        {/* Sparkle particles */}
        <span className="sparkle sparkle-1" />
        <span className="sparkle sparkle-2" />
        <span className="sparkle sparkle-3" />
        <span className="sparkle sparkle-4" />
        <span className="sparkle sparkle-5" />
        
        {/* Button content */}
        <span className="relative z-10 flex items-center gap-2">
          {children}
        </span>
        
        {/* Inner subtle gradient */}
        <span className="absolute inset-[2px] rounded-md bg-gradient-to-r from-[var(--gradient-start)]/5 via-transparent to-[var(--gradient-end)]/5 pointer-events-none" />
      </button>
    );
  }
);

SparkleButton.displayName = "SparkleButton";

export { SparkleButton };
