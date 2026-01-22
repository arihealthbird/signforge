"use client";

import { X, Sparkles, Heart, ExternalLink } from "lucide-react";
import { AnimatedLogo } from "./animated-logo";

interface VersionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const APP_VERSION = "3.1.0";
const BUILD_DATE = "January 2026";

export function VersionModal({ isOpen, onClose }: VersionModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-background border border-border rounded-2xl shadow-2xl overflow-hidden">
        {/* Rainbow top border */}
        <div className="h-1 w-full bg-gradient-to-r from-[var(--gradient-start)] via-[var(--gradient-mid-3)] to-[var(--gradient-end)]" />
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content */}
        <div className="p-8 flex flex-col items-center text-center">
          {/* Logo with glow effect */}
          <div className="relative mb-6">
            <div className="absolute inset-0 blur-2xl opacity-30 bg-gradient-to-r from-[var(--gradient-start)] via-[var(--gradient-mid-3)] to-[var(--gradient-end)] rounded-full scale-150" />
            <div className="relative scale-150">
              <AnimatedLogo />
            </div>
          </div>

          {/* App name */}
          <h2 className="text-2xl font-bold mb-1">Signature Forge</h2>
          <p className="text-sm text-muted-foreground mb-4">
            by <span className="text-rainbow-animated font-medium">OpenOS</span>
          </p>

          {/* Version badge */}
          <div className="flex items-center gap-2 mb-6">
            <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-500 border border-amber-500/30">
              BETA
            </span>
            <span className="px-3 py-1 text-sm font-mono font-medium rounded-full bg-secondary border border-border">
              v{APP_VERSION}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-6 max-w-xs">
            AI-powered email signature builder. Create stunning, professional signatures in seconds.
          </p>

          {/* Divider with sparkles */}
          <div className="flex items-center gap-3 w-full mb-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            <Sparkles className="w-4 h-4 text-[var(--gradient-mid-3)]" />
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-4 w-full text-sm mb-6">
            <div className="text-left">
              <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Build</p>
              <p className="font-medium">{BUILD_DATE}</p>
            </div>
            <div className="text-left">
              <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Platform</p>
              <p className="font-medium">Web Application</p>
            </div>
            <div className="text-left">
              <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">License</p>
              <p className="font-medium">Free to Use</p>
            </div>
            <div className="text-left">
              <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Status</p>
              <p className="font-medium text-emerald-500">Active Development</p>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-3 mb-6">
            <a
              href="https://www.openinsurance.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Website
            </a>
          </div>

          {/* Copyright */}
          <div className="pt-4 border-t border-border w-full">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} <span className="text-rainbow-animated">Open Insurance</span>. All rights reserved.
            </p>
            <p className="text-[10px] text-muted-foreground/60 mt-1 flex items-center justify-center gap-1">
              Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for the community
            </p>
          </div>
        </div>

        {/* Rainbow bottom accent */}
        <div className="h-0.5 w-full bg-gradient-to-r from-[var(--gradient-end)] via-[var(--gradient-mid-3)] to-[var(--gradient-start)] opacity-50" />
      </div>
    </div>
  );
}

interface VersionBadgeProps {
  onClick: () => void;
}

export function VersionBadge({ onClick }: VersionBadgeProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-secondary/50 transition-all group"
    >
      <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-500 border border-amber-500/30 group-hover:border-amber-500/50 transition-colors">
        BETA
      </span>
      <span className="text-xs font-mono text-muted-foreground group-hover:text-foreground transition-colors">
        v{APP_VERSION}
      </span>
    </button>
  );
}
