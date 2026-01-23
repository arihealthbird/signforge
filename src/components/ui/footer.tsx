"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { VersionBadge, VersionModal } from "./version-modal";
import { DisclaimerModal } from "./disclaimer-modal";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
  const [isDisclaimerModalOpen, setIsDisclaimerModalOpen] = useState(false);

  return (
    <>
      <footer className="border-t border-border bg-background/50 backdrop-blur-sm">
        {/* Main Footer Row */}
        <div className="px-4 py-3 md:py-2 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-2">
          {/* Left: Status + Version */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span>Saved automatically</span>
            </div>
            <span className="text-border">|</span>
            <VersionBadge onClick={() => setIsVersionModalOpen(true)} />
          </div>

          {/* Center: Free tool badge - visible on all screens */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-rainbow-animated font-medium">Free</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-rainbow-animated font-medium">No signup</span>
          </div>

          {/* Right: Links + Branding */}
          <div className="flex items-center gap-2 md:gap-3 text-xs text-muted-foreground">
            <Link 
              href="/privacy" 
              className="hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
            <span className="text-border">•</span>
            <Link 
              href="/terms" 
              className="hover:text-foreground transition-colors"
            >
              Terms
            </Link>
            <span className="text-border hidden md:inline">|</span>
            <a
              href="https://www.openinsurance.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 hover:text-foreground transition-colors group"
            >
              Powered by <span className="font-medium text-rainbow-animated group-hover:opacity-90">OpenOS</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Mobile: Powered by row */}
        <div className="md:hidden px-4 pb-2 flex justify-center">
          <a
            href="https://www.openinsurance.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors group"
          >
            Powered by <span className="font-medium text-rainbow-animated group-hover:opacity-90">OpenOS</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Bottom Row: Copyright + Disclaimers Link */}
        <div className="px-4 py-2 border-t border-border/50 bg-secondary/20">
          <div className="flex items-center justify-center md:justify-between gap-3 text-[10px] text-muted-foreground/70">
            <p>© {currentYear} Open Insurance</p>
            <button
              onClick={() => setIsDisclaimerModalOpen(true)}
              className="hover:text-muted-foreground transition-colors underline underline-offset-2"
            >
              Disclaimers
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <VersionModal 
        isOpen={isVersionModalOpen} 
        onClose={() => setIsVersionModalOpen(false)} 
      />
      <DisclaimerModal
        isOpen={isDisclaimerModalOpen}
        onClose={() => setIsDisclaimerModalOpen(false)}
      />
    </>
  );
}
