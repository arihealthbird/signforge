"use client";

import { useState, useEffect } from "react";
import { Heart, X, Github } from "lucide-react";
import { clsx } from "clsx";

interface DonationBannerProps {
  onDonateClick: () => void;
  onVisibilityChange?: (visible: boolean) => void;
}

export function DonationBanner({ onDonateClick, onVisibilityChange }: DonationBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if banner was previously dismissed in this session
    const dismissed = sessionStorage.getItem("donation-banner-dismissed");
    if (!dismissed) {
      // Delay showing banner for a smoother experience
      const timer = setTimeout(() => {
        setIsVisible(true);
        onVisibilityChange?.(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [onVisibilityChange]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    onVisibilityChange?.(false);
    sessionStorage.setItem("donation-banner-dismissed", "true");
  };

  if (isDismissed || !isVisible) return null;

  return (
    <div
      className={clsx(
        "relative overflow-hidden border-b border-border/30",
        "bg-gradient-to-r from-rose-500/5 via-amber-500/5 to-rose-500/5",
        "animate-in slide-in-from-top duration-500"
      )}
    >
      {/* Subtle animated shimmer */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer" />
      
      {/* Mobile: Compact single-line layout */}
      <div className="relative h-8 flex items-center justify-center px-8">
        <div className="flex items-center gap-1.5 text-[11px] sm:text-xs">
          <Heart className="w-3 h-3 text-rose-500/80 flex-shrink-0 hidden xs:block" />
          <span className="text-muted-foreground">
            <span className="hidden sm:inline">Signature Forge is </span>
            Free & open source
          </span>
          <span className="text-muted-foreground/50">·</span>
          <button
            onClick={onDonateClick}
            className="font-medium text-rose-500/90 hover:text-rose-500 transition-colors"
          >
            Support
          </button>
        </div>
        
        <button
          onClick={handleDismiss}
          className="absolute right-1.5 sm:right-2 p-1.5 rounded-full text-muted-foreground/60 hover:text-foreground hover:bg-secondary/50 transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
