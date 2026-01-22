"use client";

import { useEffect, useCallback, useState } from "react";
import { X, Trash2, Undo2 } from "lucide-react";
import { clsx } from "clsx";
import { GiphyFetch } from "@giphy/js-fetch-api";
import { IGif } from "@giphy/js-types";

// Initialize Giphy client
const gf = new GiphyFetch(process.env.NEXT_PUBLIC_GIPHY_API_KEY || "");

interface ResetConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

interface ResetVariation {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  gifSearchTerm: string;
}

const RESET_VARIATIONS: ResetVariation[] = [
  {
    title: "Whoa there! 🤠",
    message: "Your signature had dreams, you know.",
    confirmText: "Yeet it",
    cancelText: "Spare it",
    gifSearchTerm: "are you sure",
  },
  {
    title: "Hold up! ✋",
    message: "9/10 signatures feel betrayed by this.",
    confirmText: "Do it anyway",
    cancelText: "I'm sorry",
    gifSearchTerm: "no please",
  },
  {
    title: "Emotional damage! 💔",
    message: "Somewhere, a database row is trembling.",
    confirmText: "Shadow realm",
    cancelText: "I'll spare it",
    gifSearchTerm: "emotional damage",
  },
  {
    title: "Plot twist! 🎬",
    message: "The villain was you all along.",
    confirmText: "Embrace chaos",
    cancelText: "Redemption arc",
    gifSearchTerm: "betrayal",
  },
  {
    title: "Danger zone! 🚨",
    message: "Kenny Loggins wrote a song about this.",
    confirmText: "Highway to it",
    cancelText: "Turn back",
    gifSearchTerm: "danger",
  },
  {
    title: "You sure? 🤔",
    message: "This is like throwing away pizza.",
    confirmText: "I'm sure",
    cancelText: "Wait no",
    gifSearchTerm: "thinking",
  },
  {
    title: "Final boss! 👾",
    message: "Few have not regretted this click.",
    confirmText: "FINISH HIM",
    cancelText: "Continue quest",
    gifSearchTerm: "boss fight",
  },
  {
    title: "The council worries 🧙",
    message: "Starting over means... effort.",
    confirmText: "Ignore them",
    cancelText: "They're wise",
    gifSearchTerm: "worried",
  },
  {
    title: "Breaking news! 📰",
    message: "Local user makes questionable choice.",
    confirmText: "Make headlines",
    cancelText: "Stay quiet",
    gifSearchTerm: "breaking news",
  },
  {
    title: "Self-destruct? 💣",
    message: "T-minus whatever seconds...",
    confirmText: "Detonate",
    cancelText: "Abort",
    gifSearchTerm: "explosion",
  },
];

export function ResetConfirmationModal({ isOpen, onClose, onConfirm }: ResetConfirmationModalProps) {
  const [variation, setVariation] = useState<ResetVariation | null>(null);
  const [currentGif, setCurrentGif] = useState<IGif | null>(null);
  const [gifLoading, setGifLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch a random GIF
  const fetchRandomGif = useCallback(async (searchTerm: string) => {
    if (!process.env.NEXT_PUBLIC_GIPHY_API_KEY) return;
    
    setGifLoading(true);
    try {
      const result = await gf.search(searchTerm, { limit: 20, rating: "g" });
      if (result.data.length > 0) {
        const randomIndex = Math.floor(Math.random() * result.data.length);
        setCurrentGif(result.data[randomIndex]);
      }
    } catch (error) {
      console.error("Failed to fetch GIF:", error);
    } finally {
      setGifLoading(false);
    }
  }, []);

  // Pick random variation and fetch GIF when modal opens
  useEffect(() => {
    if (isOpen) {
      const randomIndex = Math.floor(Math.random() * RESET_VARIATIONS.length);
      const selectedVariation = RESET_VARIATIONS[randomIndex];
      setVariation(selectedVariation);
      setCurrentGif(null);
      setIsDeleting(false);
      fetchRandomGif(selectedVariation.gifSearchTerm);
    }
  }, [isOpen, fetchRandomGif]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isDeleting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isDeleting, onClose]);

  const handleConfirm = useCallback(() => {
    setIsDeleting(true);
    // Let the animation play, then execute
    setTimeout(() => {
      onConfirm();
      onClose();
    }, 600);
  }, [onConfirm, onClose]);

  if (!isOpen || !variation) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && !isDeleting && onClose()}
    >
      {/* Subtle backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] animate-in fade-in duration-150" />

      {/* Compact Popup */}
      <div
        className={clsx(
          "relative z-10 w-full max-w-xs",
          "bg-background rounded-xl shadow-xl",
          "overflow-hidden",
          "animate-in zoom-in-95 fade-in slide-in-from-bottom-2 duration-200",
          "border border-border",
          isDeleting && "animate-delete-shake"
        )}
      >
        {/* Compact header with inline GIF */}
        <div className="p-4 pb-3">
          <div className="flex items-start gap-3">
            {/* Small GIF */}
            <div className="flex-shrink-0">
              {currentGif && !gifLoading ? (
                <div className={clsx(
                  "w-14 h-14 rounded-lg overflow-hidden border border-border",
                  isDeleting && "animate-spin-slow"
                )}>
                  <img
                    src={currentGif.images.fixed_height_small.url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-lg bg-muted animate-pulse" />
              )}
            </div>
            
            {/* Title & Message */}
            <div className="flex-1 min-w-0">
              <h3 className={clsx(
                "font-semibold text-sm mb-0.5",
                isDeleting ? "text-red-500" : "text-foreground"
              )}>
                {variation.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {variation.message}
              </p>
            </div>

            {/* Close X */}
            {!isDeleting && (
              <button
                onClick={onClose}
                className="flex-shrink-0 p-1 -m-1 text-muted-foreground hover:text-foreground transition-colors rounded"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Compact buttons */}
        <div className="px-4 pb-4 flex gap-2">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className={clsx(
              "flex-1 py-2 px-3 rounded-lg text-xs font-medium",
              "bg-secondary hover:bg-secondary/80 text-foreground",
              "transition-all",
              "flex items-center justify-center gap-1.5",
              isDeleting && "opacity-50 cursor-not-allowed"
            )}
          >
            <Undo2 className="w-3.5 h-3.5" />
            {variation.cancelText}
          </button>
          
          <button
            onClick={handleConfirm}
            disabled={isDeleting}
            className={clsx(
              "flex-1 py-2 px-3 rounded-lg text-xs font-medium",
              "bg-red-500/10 hover:bg-red-500/20 text-red-500 dark:text-red-400",
              "border border-red-500/20 hover:border-red-500/30",
              "transition-all",
              "flex items-center justify-center gap-1.5",
              isDeleting && "bg-red-500 text-white border-red-500"
            )}
          >
            <Trash2 className={clsx("w-3.5 h-3.5", isDeleting && "animate-bounce")} />
            {isDeleting ? "Bye bye..." : variation.confirmText}
          </button>
        </div>

        {/* Delete animation overlay */}
        {isDeleting && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Particles flying out */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-red-500/60 rounded-full animate-particle"
                style={{
                  left: '50%',
                  top: '50%',
                  animationDelay: `${i * 50}ms`,
                  '--angle': `${i * 45}deg`,
                } as React.CSSProperties}
              />
            ))}
            {/* Flash effect */}
            <div className="absolute inset-0 bg-red-500/10 animate-flash" />
          </div>
        )}
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes delete-shake {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          10% { transform: translateX(-3px) rotate(-1deg); }
          20% { transform: translateX(3px) rotate(1deg); }
          30% { transform: translateX(-3px) rotate(-1deg); }
          40% { transform: translateX(3px) rotate(1deg); }
          50% { transform: translateX(-2px) rotate(-0.5deg); }
          60% { transform: translateX(2px) rotate(0.5deg); }
          70% { transform: translateX(-1px) rotate(0deg); }
          80% { transform: translateX(1px) rotate(0deg); }
          90% { transform: scale(0.98); }
          100% { transform: scale(0.95); opacity: 0.8; }
        }
        .animate-delete-shake {
          animation: delete-shake 0.6s ease-in-out forwards;
        }
        
        @keyframes particle {
          0% { 
            transform: translate(-50%, -50%) rotate(var(--angle)) translateY(0) scale(1);
            opacity: 1;
          }
          100% { 
            transform: translate(-50%, -50%) rotate(var(--angle)) translateY(-60px) scale(0);
            opacity: 0;
          }
        }
        .animate-particle {
          animation: particle 0.5s ease-out forwards;
        }
        
        @keyframes flash {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        .animate-flash {
          animation: flash 0.3s ease-out;
        }
        
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 0.6s ease-in-out;
        }
      `}</style>
    </div>
  );
}
