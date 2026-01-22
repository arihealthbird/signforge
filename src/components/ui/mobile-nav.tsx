"use client";

import { clsx } from "clsx";
import {
  Eye,
  FileText,
  Palette,
  Download,
  Wand2,
  Sparkles,
} from "lucide-react";

// Simplified tab types for cleaner mobile nav
export type MobileTab = "preview" | "content" | "templates" | "style" | "ai" | "export";

// Primary tabs shown in bottom nav (reduced from 6 to 4)
type PrimaryTab = "preview" | "content" | "design" | "export";

interface MobileNavProps {
  activeTab: MobileTab;
  onTabChange: (tab: MobileTab) => void;
  className?: string;
}

// Core navigation tabs - simplified for better UX
const primaryTabs: { id: PrimaryTab; mapTo: MobileTab; label: string; icon: typeof Eye }[] = [
  { id: "preview", mapTo: "preview", label: "Preview", icon: Eye },
  { id: "content", mapTo: "content", label: "Edit", icon: FileText },
  { id: "design", mapTo: "style", label: "Design", icon: Palette },
  { id: "export", mapTo: "export", label: "Export", icon: Download },
];

/**
 * Redesigned mobile navigation with:
 * - 4 primary tabs (was 6)
 * - Floating AI button
 * - Larger touch targets (48x48 minimum)
 * - Better visual hierarchy
 */
export function MobileNav({ activeTab, onTabChange, className }: MobileNavProps) {
  // Map design-related tabs
  const isDesignActive = activeTab === "templates" || activeTab === "style";
  
  return (
    <>
      {/* AI Floating Action Button - Always visible */}
      <button
        onClick={() => onTabChange("ai")}
        className={clsx(
          "fixed z-50 flex items-center justify-center",
          "w-14 h-14 rounded-full shadow-lg",
          "transition-all duration-300 active:scale-95",
          "touch-manipulation",
          // Position above the nav bar
          "bottom-[88px] right-4",
          // Safe area adjustment
          "mb-safe",
          activeTab === "ai"
            ? "bg-gradient-to-br from-[var(--gradient-start)] via-[var(--gradient-mid-3)] to-[var(--gradient-mid-4)] text-white scale-110 shadow-xl"
            : "bg-gradient-to-br from-[var(--gradient-mid-4)] to-[var(--gradient-end)] text-white hover:scale-105"
        )}
        aria-label="AI Assistant"
      >
        <Sparkles className={clsx(
          "w-6 h-6",
          activeTab === "ai" && "animate-pulse"
        )} />
        {/* Glow effect when active */}
        {activeTab === "ai" && (
          <span className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-mid-4)] animate-ping opacity-30" />
        )}
      </button>

      {/* Main Bottom Navigation */}
      <nav
        className={clsx(
          "mobile-nav fixed bottom-0 left-0 right-0 z-50",
          "bg-background/98 backdrop-blur-xl border-t border-border",
          "touch-manipulation",
          className
        )}
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="flex items-center justify-around h-[68px] px-2">
          {primaryTabs.map((tab) => {
            // Check if this tab or its mapped tab is active
            const isActive = tab.id === "design" 
              ? isDesignActive 
              : activeTab === tab.mapTo;
            const Icon = tab.icon;
            
            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === "design") {
                    // Toggle between templates and style, or default to style
                    onTabChange(activeTab === "style" ? "templates" : "style");
                  } else {
                    onTabChange(tab.mapTo);
                  }
                }}
                className={clsx(
                  "mobile-nav-item relative flex flex-col items-center justify-center",
                  "w-[72px] h-[56px] rounded-2xl transition-all duration-200",
                  "active:scale-95 touch-manipulation",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {/* Active background pill */}
                {isActive && (
                  <span className="absolute inset-x-2 inset-y-1 bg-primary/10 rounded-xl" />
                )}
                <Icon
                  className={clsx(
                    "relative z-10 w-6 h-6 mb-1 transition-all duration-200",
                    isActive && "text-primary scale-110"
                  )}
                />
                <span
                  className={clsx(
                    "relative z-10 text-[11px] font-medium leading-none",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {tab.label}
                </span>
                {/* Design sub-indicator showing Templates vs Style */}
                {tab.id === "design" && isDesignActive && (
                  <span className="absolute -top-1 right-2 w-2 h-2 rounded-full bg-primary/50" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}

/**
 * Original full navigation with all 6 tabs (for backwards compatibility)
 */
export function MobileNavFull({ activeTab, onTabChange, className }: MobileNavProps) {
  const allTabs = [
    { id: "preview" as MobileTab, label: "Preview", icon: Eye },
    { id: "content" as MobileTab, label: "Edit", icon: FileText },
    { id: "style" as MobileTab, label: "Design", icon: Palette },
    { id: "ai" as MobileTab, label: "AI", icon: Wand2 },
    { id: "export" as MobileTab, label: "Export", icon: Download },
  ];
  
  return (
    <nav
      className={clsx(
        "mobile-nav fixed bottom-0 left-0 right-0 z-50",
        "bg-background/98 backdrop-blur-xl border-t border-border",
        className
      )}
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex items-center justify-around h-16 px-1">
        {allTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={clsx(
                "mobile-nav-item flex flex-col items-center justify-center",
                "min-w-[56px] h-14 px-2 rounded-xl transition-all duration-200",
                "active:scale-95 touch-manipulation",
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
                {tab.label}
              </span>
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
