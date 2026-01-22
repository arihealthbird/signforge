"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { VersionBadge, VersionModal } from "./version-modal";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);

  return (
    <>
      <footer className="border-t border-border bg-background/50 backdrop-blur-sm">
        {/* Main Footer Row */}
        <div className="px-4 py-2 flex flex-col md:flex-row items-center justify-between gap-2">
          {/* Left: Status + Version + Disclaimer */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Changes saved automatically</span>
            </div>
            <span className="hidden md:inline text-border">|</span>
            <VersionBadge onClick={() => setIsVersionModalOpen(true)} />
            <span className="hidden lg:inline text-border">|</span>
            <span className="hidden lg:inline">
              <span className="text-rainbow-animated font-medium">Free</span>
              <span className="text-muted-foreground"> tool • </span>
              <span className="text-rainbow-animated font-medium">No account required</span>
            </span>
          </div>

          {/* Right: Links + Branding */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
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
            <span className="text-border">|</span>
            <a
              href="https://www.openinsurance.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-foreground transition-colors group"
            >
              Powered by <span className="font-medium text-rainbow-animated group-hover:opacity-90">OpenOS</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Bottom Row: Copyright + Trademark Disclaimers */}
        <div className="px-4 py-2 border-t border-border/50 bg-secondary/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-1.5 text-[10px] text-muted-foreground/70">
            <p>
              © {currentYear} Open Insurance. All rights reserved. Provided "as is" without warranty.
            </p>
            <p className="text-center md:text-right">
              Star Wars™, Spider-Man™, and Pirates of the Caribbean™ are trademarks of Disney/Lucasfilm/Marvel. 
              The Office™ and Parks and Recreation™ are trademarks of NBCUniversal. All character themes are fan tributes.
            </p>
          </div>
        </div>
      </footer>

      {/* Version Modal */}
      <VersionModal 
        isOpen={isVersionModalOpen} 
        onClose={() => setIsVersionModalOpen(false)} 
      />
    </>
  );
}
