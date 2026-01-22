"use client";

import { useEffect } from "react";
import { X, Heart, ExternalLink, Sparkles, Code2, Users, Coffee } from "lucide-react";
import { clsx } from "clsx";

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DONATE_URL = "https://givebutter.com/c5WBuI";

export function DonateModal({ isOpen, onClose }: DonateModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleDonate = () => {
    window.open(DONATE_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" />

      {/* Modal */}
      <div
        className={clsx(
          "relative w-full max-w-[calc(100vw-1.5rem)] sm:max-w-md bg-background rounded-2xl shadow-2xl",
          "border border-border overflow-hidden max-h-[calc(100vh-2rem)] overflow-y-auto",
          "animate-in zoom-in-95 fade-in duration-200"
        )}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors z-10"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header with gradient */}
        <div className="relative px-5 sm:px-8 pt-8 sm:pt-10 pb-4 sm:pb-6 text-center bg-gradient-to-b from-rose-500/10 via-amber-500/5 to-transparent">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500/20 to-amber-500/20 mb-4">
            <Heart className="w-8 h-8 text-rose-500" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Support Signature Forge</h2>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            Help us keep this tool free, open source, and continuously improving for everyone.
          </p>
        </div>

        {/* Features */}
        <div className="px-5 sm:px-8 py-4 sm:py-6 space-y-3 sm:space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
              <Code2 className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">100% Open Source</p>
              <p className="text-xs text-muted-foreground">Free forever, no hidden costs or premium tiers</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">New Features</p>
              <p className="text-xs text-muted-foreground">Your support helps fund new templates and AI features</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
              <Users className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">Community Driven</p>
              <p className="text-xs text-muted-foreground">Built by the community, for the community</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="px-5 sm:px-8 pb-6 sm:pb-8 pt-2">
          <button
            onClick={handleDonate}
            className={clsx(
              "w-full py-3.5 px-6 rounded-xl font-medium text-white",
              "bg-gradient-to-r from-rose-500 to-amber-500",
              "hover:from-rose-600 hover:to-amber-600",
              "transition-all hover:scale-[1.02] active:scale-[0.98]",
              "flex items-center justify-center gap-2",
              "shadow-lg shadow-rose-500/20"
            )}
          >
            <Coffee className="w-4 h-4" />
            <span>Buy us a coffee</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </button>
          <p className="text-center text-xs text-muted-foreground mt-3">
            You&apos;ll be redirected to our secure donation page
          </p>
        </div>
      </div>
    </div>
  );
}
