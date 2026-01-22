"use client";

import { clsx } from "clsx";
import {
  Eye,
  FileText,
  Layout,
  Palette,
  Wand2,
  Download,
} from "lucide-react";

export type MobileTab = "preview" | "content" | "templates" | "style" | "ai" | "export";

interface MobileNavProps {
  activeTab: MobileTab;
  onTabChange: (tab: MobileTab) => void;
  className?: string;
}

const tabs: { id: MobileTab; label: string; icon: typeof Eye; shortLabel?: string }[] = [
  { id: "preview", label: "Preview", icon: Eye },
  { id: "content", label: "Content", icon: FileText, shortLabel: "Edit" },
  { id: "templates", label: "Templates", icon: Layout, shortLabel: "Tmpl" },
  { id: "style", label: "Style", icon: Palette },
  { id: "ai", label: "AI", icon: Wand2 },
  { id: "export", label: "Export", icon: Download },
];

export function MobileNav({ activeTab, onTabChange, className }: MobileNavProps) {
  return (
    <nav
      className={clsx(
        "mobile-nav fixed bottom-0 left-0 right-0 z-50",
        "bg-background/95 backdrop-blur-xl border-t border-border",
        "safe-area-bottom",
        className
      )}
    >
      <div className="flex items-center justify-around h-16 px-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={clsx(
                "mobile-nav-item flex flex-col items-center justify-center",
                "min-w-[52px] h-14 px-2 rounded-xl transition-all duration-200",
                "active:scale-95",
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              <Icon
                className={clsx(
                  "w-5 h-5 mb-0.5 transition-transform duration-200",
                  isActive && "scale-110"
                )}
              />
              <span
                className={clsx(
                  "text-[10px] font-medium leading-none",
                  isActive ? "opacity-100" : "opacity-70"
                )}
              >
                {tab.shortLabel || tab.label}
              </span>
              {/* Active indicator dot */}
              {isActive && (
                <span className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

/**
 * Compact version for very small screens - shows only icons
 */
export function MobileNavCompact({ activeTab, onTabChange, className }: MobileNavProps) {
  return (
    <nav
      className={clsx(
        "mobile-nav-compact fixed bottom-0 left-0 right-0 z-50",
        "bg-background/95 backdrop-blur-xl border-t border-border",
        "safe-area-bottom",
        className
      )}
    >
      <div className="flex items-center justify-around h-14 px-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              aria-label={tab.label}
              className={clsx(
                "flex items-center justify-center",
                "w-11 h-11 rounded-xl transition-all duration-200",
                "active:scale-95",
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              <Icon
                className={clsx(
                  "w-5 h-5 transition-transform duration-200",
                  isActive && "scale-110"
                )}
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
}

/**
 * Hook to get safe area insets for mobile nav positioning
 */
export function useSafeAreaInset() {
  // This uses CSS env() variables, no JS needed
  // Just ensure the safe-area-bottom class is applied
  return null;
}
