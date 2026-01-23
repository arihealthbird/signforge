"use client";

import { useState } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import {
  Eye,
  FileText,
  Palette,
  Download,
  Wand2,
  Sparkles,
} from "lucide-react";
import { DisclaimerModal } from "./disclaimer-modal";

// Simplified tab types for cleaner mobile nav
export type MobileTab = "preview" | "content" | "templates" | "style" | "ai" | "export";

// Primary tabs shown in bottom nav - now includes AI directly
type PrimaryTab = "preview" | "content" | "design" | "ai" | "export";

interface MobileNavProps {
  activeTab: MobileTab;
  onTabChange: (tab: MobileTab) => void;
  className?: string;
}

// Core navigation tabs - 5 tabs with AI integrated
const primaryTabs: { id: PrimaryTab; mapTo: MobileTab; label: string; icon: typeof Eye }[] = [
  { id: "preview", mapTo: "preview", label: "Preview", icon: Eye },
  { id: "content", mapTo: "content", label: "Edit", icon: FileText },
  { id: "ai", mapTo: "ai", label: "AI", icon: Sparkles },
  { id: "design", mapTo: "style", label: "Design", icon: Palette },
  { id: "export", mapTo: "export", label: "Export", icon: Download },
];

/**
 * Clean mobile navigation with:
 * - 5 tabs including AI in the center
 * - No floating button (cleaner experience)
 * - Touch-friendly targets
 */
export function MobileNav({ activeTab, onTabChange, className }: MobileNavProps) {
  // Map design-related tabs
  const isDesignActive = activeTab === "templates" || activeTab === "style";
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
  const currentYear = new Date().getFullYear();
  
  return (
    <>
      <nav
        className={clsx(
          "mobile-nav fixed bottom-0 left-0 right-0 z-50",
          "bg-background/98 backdrop-blur-xl border-t border-border",
          "touch-manipulation",
          className
        )}
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        {/* Footer info row */}
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-border/50 bg-secondary/30">
          <span className="text-[9px] text-muted-foreground/70">
            © {currentYear} Open Insurance
          </span>
          <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground/70">
            <span className="text-rainbow-animated font-medium">Free</span>
            <span className="opacity-50">•</span>
            <Link href="/privacy" className="hover:text-muted-foreground transition-colors">
              Privacy
            </Link>
            <span className="opacity-50">•</span>
            <Link href="/terms" className="hover:text-muted-foreground transition-colors">
              Terms
            </Link>
            <span className="opacity-50">•</span>
            <button
              onClick={() => setIsDisclaimerOpen(true)}
              className="hover:text-muted-foreground transition-colors"
            >
              Disclaimers
            </button>
          </div>
        </div>
        
        {/* Navigation tabs */}
        <div className="flex items-center justify-around h-[56px] px-1">
        {primaryTabs.map((tab) => {
          // Check if this tab or its mapped tab is active
          const isActive = tab.id === "design" 
            ? isDesignActive 
            : activeTab === tab.mapTo;
          const isAI = tab.id === "ai";
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
                "flex-1 h-[52px] rounded-xl transition-all duration-200",
                "active:scale-95 touch-manipulation",
                isActive
                  ? isAI ? "text-white" : "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {/* Active background pill - special for AI */}
              {isActive && (
                <span className={clsx(
                  "absolute inset-x-1 inset-y-0.5 rounded-lg",
                  isAI 
                    ? "bg-gradient-to-r from-[var(--gradient-start)] via-[var(--gradient-mid-3)] to-[var(--gradient-mid-4)]"
                    : "bg-primary/10"
                )} />
              )}
              {/* AI gradient background when not active */}
              {isAI && !isActive && (
                <span className="absolute inset-x-1 inset-y-0.5 rounded-lg bg-gradient-to-r from-[var(--gradient-mid-4)]/20 to-[var(--gradient-end)]/20" />
              )}
              <Icon
                className={clsx(
                  "relative z-10 w-5 h-5 mb-0.5 transition-all duration-200",
                  isActive && (isAI ? "text-white" : "text-primary scale-110"),
                  isAI && !isActive && "text-[var(--gradient-mid-4)]"
                )}
              />
              <span
                className={clsx(
                  "relative z-10 text-[10px] font-medium leading-none",
                  isActive 
                    ? (isAI ? "text-white" : "text-primary") 
                    : (isAI ? "text-[var(--gradient-mid-4)]" : "text-muted-foreground")
                )}
              >
                {tab.label}
              </span>
              {/* Design sub-indicator showing Templates vs Style */}
              {tab.id === "design" && isDesignActive && (
                <span className="absolute top-0.5 right-1 w-1.5 h-1.5 rounded-full bg-primary/50" />
              )}
            </button>
          );
        })}
        </div>
      </nav>
      
      {/* Disclaimer Modal */}
      <DisclaimerModal
        isOpen={isDisclaimerOpen}
        onClose={() => setIsDisclaimerOpen(false)}
      />
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
