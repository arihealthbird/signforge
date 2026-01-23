"use client";

import { useState, useRef, useEffect } from "react";
import { EMAIL_THEMES, EmailThemeId, getEmailTheme } from "@/lib/email-themes";
import { ChevronDown } from "lucide-react";
import { clsx } from "clsx";

interface EmailThemeSelectorProps {
  value: EmailThemeId;
  onChange: (value: EmailThemeId) => void;
}

// Color mapping for theme badges
const THEME_COLORS: Record<EmailThemeId, string> = {
  "professional": "#6366f1",
  "darth-vader": "#ef4444",
  "yoda": "#22c55e",
  "spider-man": "#dc2626",
  "pirate": "#f59e0b",
  "shakespeare": "#a855f7",
  "surfer-dude": "#06b6d4",
  "the-office": "#8b7355",
  "parks-and-recreation": "#daa520",
};

// Custom logo images for specific themes
const THEME_LOGOS: Partial<Record<EmailThemeId, string>> = {
  "darth-vader": "/images/darth-vader-logo-v2.jpg",
  "yoda": "/images/yoda-logo.png",
"pirate": "/images/pirates-logo-v2.png",
  "spider-man": "/images/spiderman-logo.png",
  "shakespeare": "/images/shakes-logo.png",
  "surfer-dude": "/images/surfing.png",
  "the-office": "/images/office-logo-small.png",
  "parks-and-recreation": "/images/parks-logo-small.png",
};

function ThemeBadge({ themeId, size = "sm" }: { themeId: EmailThemeId; size?: "sm" | "md" }) {
  const color = THEME_COLORS[themeId];
  const logo = THEME_LOGOS[themeId];
  const sizeClasses = size === "sm" ? "w-5 h-5" : "w-6 h-6";
  const dotSizeClasses = size === "sm" ? "w-2.5 h-2.5" : "w-3 h-3";
  
  // If theme has a custom logo, show it
  if (logo) {
    return (
      <img 
        src={logo}
        alt=""
        className={clsx(sizeClasses, "flex-shrink-0 object-contain rounded-sm")}
      />
    );
  }
  
  // Default colored dot
  return (
    <span 
      className={clsx(dotSizeClasses, "rounded-full flex-shrink-0")}
      style={{ backgroundColor: color }}
    />
  );
}

export function EmailThemeSelector({ value, onChange }: EmailThemeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const currentTheme = getEmailTheme(value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger Button - compact on mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-md text-xs font-medium transition-all",
          "border shadow-sm",
          isOpen
            ? "bg-card border-primary/40 text-foreground ring-2 ring-primary/20"
            : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-border/80"
        )}
      >
        <span className="flex items-center gap-1.5">
          <ThemeBadge themeId={value} />
          <span className="font-medium text-foreground text-[11px] sm:text-xs max-w-[60px] sm:max-w-none truncate">{currentTheme.name}</span>
        </span>
        <ChevronDown 
          className={clsx(
            "w-3 h-3 sm:w-3.5 sm:h-3.5 text-muted-foreground transition-transform duration-200 flex-shrink-0",
            isOpen && "rotate-180"
          )} 
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div 
          className={clsx(
            "absolute top-full left-0 mt-2 z-50",
            "w-64 sm:w-72 rounded-lg overflow-hidden",
            "bg-card border border-border shadow-2xl",
            "animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200",
            "max-h-[70vh] overflow-y-auto"
          )}
        >
          {/* Header */}
          <div className="px-4 py-3 bg-secondary/50 border-b border-border">
            <p className="text-sm font-semibold text-foreground">Preview Voice</p>
            <p className="text-xs text-muted-foreground mt-0.5">Choose a character to write your email</p>
          </div>
          
          {/* Options */}
          <div className="p-2 max-h-[320px] overflow-y-auto">
            {EMAIL_THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => {
                  onChange(theme.id);
                  setIsOpen(false);
                }}
                className={clsx(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left transition-all",
                  value === theme.id
                    ? "bg-primary/10"
                    : "hover:bg-secondary/70"
                )}
              >
                <ThemeBadge themeId={theme.id} size="md" />
                <div className="flex-1 min-w-0">
                  <p className={clsx(
                    "text-sm font-medium",
                    value === theme.id ? "text-primary" : "text-foreground"
                  )}>
                    {theme.name}
                  </p>
                  {theme.character && (
                    <p className="text-[11px] text-muted-foreground truncate">
                      {theme.character}
                    </p>
                  )}
                </div>
                {value === theme.id && (
                  <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
          
          {/* Footer */}
          <div className="px-4 py-2.5 bg-secondary/30 border-t border-border">
            <p className="text-[11px] text-muted-foreground text-center">
              For preview only — doesn't affect your signature
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
