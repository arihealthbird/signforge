"use client";

import { useState } from "react";
import { Share2, X, Sparkles, Edit3, ArrowRight } from "lucide-react";
import { clsx } from "clsx";

interface SharedTemplateBannerProps {
  /** Original creator's name (if available) */
  creatorName?: string;
  /** Whether the user has started editing */
  hasStartedEditing: boolean;
  /** Called when user wants to dismiss the banner */
  onDismiss: () => void;
  /** Called when user clicks "Start Editing" */
  onStartEditing: () => void;
}

export function SharedTemplateBanner({
  creatorName,
  hasStartedEditing,
  onDismiss,
  onStartEditing,
}: SharedTemplateBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss();
  };

  return (
    <div 
      className={clsx(
        "relative overflow-hidden",
        "bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10",
        "border-b border-indigo-500/20"
      )}
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 animate-pulse" />
      
      <div className="relative px-4 py-2.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Icon */}
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex-shrink-0">
            <Share2 className="w-4 h-4 text-indigo-500" />
          </div>
          
          {/* Text */}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium truncate">
              {hasStartedEditing ? (
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                  You&apos;re customizing a shared template
                </span>
              ) : (
                <>
                  Viewing {creatorName ? `${creatorName}'s` : "a shared"} signature design
                </>
              )}
            </p>
            <p className="text-xs text-muted-foreground truncate hidden sm:block">
              {hasStartedEditing 
                ? "Make it yours! Your changes won't affect the original."
                : "Click \"Use Template\" to make it your own with your info."
              }
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {!hasStartedEditing && (
            <button
              onClick={onStartEditing}
              className={clsx(
                "h-8 px-3 rounded-lg text-xs font-medium",
                "bg-gradient-to-r from-indigo-500 to-purple-500 text-white",
                "hover:from-indigo-600 hover:to-purple-600",
                "transition-all hover:scale-[1.02] active:scale-[0.98]",
                "flex items-center gap-1.5",
                "shadow-sm shadow-indigo-500/20"
              )}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Use Template</span>
              <span className="sm:hidden">Use</span>
            </button>
          )}
          
          <button
            onClick={handleDismiss}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-indigo-500/50 via-purple-500/50 to-pink-500/50" />
    </div>
  );
}
