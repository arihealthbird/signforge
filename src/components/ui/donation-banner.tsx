"use client";

import { useState, useEffect } from "react";
import { Heart, X } from "lucide-react";
import { clsx } from "clsx";

interface DonationBannerProps {
  onDonateClick: () => void;
}

export function DonationBanner({ onDonateClick }: DonationBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if banner was previously dismissed in this session
    const dismissed = sessionStorage.getItem("donation-banner-dismissed");
    if (!dismissed) {
      // Delay showing banner for a smoother experience
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    sessionStorage.setItem("donation-banner-dismissed", "true");
  };

  if (isDismissed || !isVisible) return null;

  return (
    <div
      className={clsx(
        "relative overflow-hidden border-b border-border/50",
        "bg-gradient-to-r from-rose-500/5 via-amber-500/5 to-rose-500/5",
        "animate-in slide-in-from-top duration-500"
      )}
    >
      {/* Subtle animated shimmer */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer" />
      
      <div className="relative px-3 sm:px-4 py-2 flex items-center justify-center gap-2 sm:gap-3">
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm flex-wrap justify-center pr-6 sm:pr-8">
          <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-rose-500/80 flex-shrink-0" />
          <span className="text-muted-foreground hidden sm:inline">
            Signature Forge is free and open source.
          </span>
          <span className="text-muted-foreground sm:hidden">
            Free & open source.
          </span>
          <button
            onClick={onDonateClick}
            className="font-medium text-foreground hover:text-rose-500 transition-colors underline underline-offset-2 decoration-rose-500/30 hover:decoration-rose-500"
          >
            Support us
          </button>
          <span className="text-muted-foreground hidden sm:inline">
            to help keep it that way.
          </span>
        </div>
        
        <button
          onClick={handleDismiss}
          className="absolute right-2 sm:right-3 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </button>
      </div>
    </div>
  );
}
