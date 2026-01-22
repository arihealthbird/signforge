"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Heart, ExternalLink, Coffee, Frown, PartyPopper, Rocket, Pizza, Sparkles, Cat, Dog, Ghost, Zap } from "lucide-react";
import { clsx } from "clsx";
import { Button } from "./button";
import { GiphyFetch } from "@giphy/js-fetch-api";
import { IGif } from "@giphy/js-types";

// Initialize Giphy client
const gf = new GiphyFetch(process.env.NEXT_PUBLIC_GIPHY_API_KEY || "");

interface ExportDonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
}

const DONATE_URL = "https://givebutter.com/c5WBuI";

interface DonationVariation {
  id: string;
  emoji: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  skipText: string;
  sadTitle: string;
  sadSubtitle: string;
  sadEmoji: string;
  continueText: string;
  gifSearchTerm: string; // Search term for related GIF
  sadGifSearchTerm: string; // Search term for sad state GIF
}

const DONATION_VARIATIONS: DonationVariation[] = [
  {
    id: "coffee",
    emoji: "☕",
    icon: Coffee,
    title: "Wait! Before you go...",
    subtitle: "One small coffee = One huge difference",
    description: "This signature took 3 cups of coffee to build. Help us stay caffeinated so we can keep shipping features at 2am! 🌙",
    ctaText: "Buy us a coffee ☕",
    skipText: "I'm broke too, skip",
    sadTitle: "It's okay, we understand...",
    sadSubtitle: "We'll be here, coding in the dark, sipping our cold instant coffee... it's fine, really. 🥲",
    sadEmoji: "😢",
    continueText: "Continue to export (sorry)",
    gifSearchTerm: "coffee love",
    sadGifSearchTerm: "sad coffee",
  },
  {
    id: "pizza",
    emoji: "🍕",
    icon: Pizza,
    title: "Hold up, friend!",
    subtitle: "Code runs on pizza, not just coffee",
    description: "Fun fact: This entire app was built during late-night pizza sessions. Your donation = more pizza = more features. Science! 🧪",
    ctaText: "Fund the pizza fund 🍕",
    skipText: "No pizza for you, skip",
    sadTitle: "*sad pizza noises*",
    sadSubtitle: "The pizza box is empty now... just like our hearts. But at least YOU have a cool signature! 🍕💔",
    sadEmoji: "😿",
    continueText: "Continue (we're not crying)",
    gifSearchTerm: "pizza party",
    sadGifSearchTerm: "sad eating",
  },
  {
    id: "rocket",
    emoji: "🚀",
    icon: Rocket,
    title: "Mission Control calling!",
    subtitle: "Help us reach the moon 🌙",
    description: "You're about to export greatness! Want to help us launch more features into orbit? Every dollar is rocket fuel! 🛸",
    ctaText: "Fuel the rocket 🚀",
    skipText: "Houston, we have no budget",
    sadTitle: "Mission... aborted?",
    sadSubtitle: "The rocket stays grounded today. But hey, at least your signature is ready for liftoff! 🌍",
    sadEmoji: "🛸",
    continueText: "Ground control, continue",
    gifSearchTerm: "rocket launch",
    sadGifSearchTerm: "sad astronaut",
  },
  {
    id: "party",
    emoji: "🎉",
    icon: PartyPopper,
    title: "Woohoo! Export time!",
    subtitle: "But first... a tiny celebration?",
    description: "You just made something awesome! How about a small party contribution? We promise to dance for every donation! 💃🕺",
    ctaText: "Join the party 🎉",
    skipText: "I'm more of an introvert",
    sadTitle: "The confetti machine broke...",
    sadSubtitle: "*puts party hat back in drawer slowly* That's cool, we'll party by ourselves. Alone. In the dark. 🎈",
    sadEmoji: "🥳",
    continueText: "Continue (party pooper mode)",
    gifSearchTerm: "party celebration",
    sadGifSearchTerm: "sad party",
  },
  {
    id: "cat",
    emoji: "🐱",
    icon: Cat,
    title: "Meow! Got a moment?",
    subtitle: "Our office cat demands tribute",
    description: "Mr. Whiskers the office cat insists that running open-source projects requires treats. Also servers. But mostly treats. 🐟",
    ctaText: "Appease the cat 🐱",
    skipText: "I'm more of a dog person",
    sadTitle: "Mr. Whiskers is disappointed",
    sadSubtitle: "*knocks your signature off the table* Mr. Whiskers says it's fine. He's lying. Cats never forgive. 😾",
    sadEmoji: "😿",
    continueText: "Continue (avoiding eye contact)",
    gifSearchTerm: "cute cat",
    sadGifSearchTerm: "sad cat",
  },
  {
    id: "ghost",
    emoji: "👻",
    icon: Ghost,
    title: "Boo! Quick question!",
    subtitle: "Don't ghost our donation page",
    description: "Like this free tool? Our developers are surviving on hopes, dreams, and the occasional ramen. Haunt us with your generosity! 👻",
    ctaText: "Be a friendly ghost 👻",
    skipText: "I'll just vanish, bye",
    sadTitle: "You've ghosted us...",
    sadSubtitle: "*fades through wall dramatically* We'll just be here... transparent... forgotten... like always... 💨",
    sadEmoji: "👻",
    continueText: "Continue (disappearing act)",
    gifSearchTerm: "friendly ghost",
    sadGifSearchTerm: "sad ghost",
  },
];

export function ExportDonationModal({ isOpen, onClose, onContinue }: ExportDonationModalProps) {
  const [variation, setVariation] = useState<DonationVariation | null>(null);
  const [showSadState, setShowSadState] = useState(false);
  const [currentGif, setCurrentGif] = useState<IGif | null>(null);
  const [gifLoading, setGifLoading] = useState(false);

  // Fetch a random GIF based on search term
  const fetchRandomGif = useCallback(async (searchTerm: string) => {
    if (!process.env.NEXT_PUBLIC_GIPHY_API_KEY) return;
    
    setGifLoading(true);
    try {
      const result = await gf.search(searchTerm, { limit: 25, rating: "g" });
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

  // Pick a random variation when modal opens
  useEffect(() => {
    if (isOpen) {
      const randomIndex = Math.floor(Math.random() * DONATION_VARIATIONS.length);
      const selectedVariation = DONATION_VARIATIONS[randomIndex];
      setVariation(selectedVariation);
      setShowSadState(false);
      setCurrentGif(null);
      document.body.style.overflow = "hidden";
      
      // Fetch initial GIF
      fetchRandomGif(selectedVariation.gifSearchTerm);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, fetchRandomGif]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setShowSadState(false);
    onClose();
  }, [onClose]);

  const handleDonate = () => {
    window.open(DONATE_URL, "_blank", "noopener,noreferrer");
    // After donation click, proceed to export
    setTimeout(() => {
      handleClose();
      onContinue();
    }, 500);
  };

  const handleSkip = () => {
    setShowSadState(true);
    // Fetch sad GIF
    if (variation) {
      fetchRandomGif(variation.sadGifSearchTerm);
    }
  };

  const handleContinueAfterSad = () => {
    handleClose();
    onContinue();
  };

  if (!isOpen || !variation) return null;

  const IconComponent = variation.icon;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" />

      {/* Modal */}
      <div
        className={clsx(
          "relative w-full max-w-[calc(100vw-1.5rem)] sm:max-w-md bg-background rounded-2xl shadow-2xl",
          "overflow-hidden max-h-[calc(100vh-2rem)] overflow-y-auto",
          "animate-in zoom-in-95 fade-in duration-200",
          "border-rainbow-animated glow-rainbow"
        )}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors z-10"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {!showSadState ? (
          // Main donation appeal
          <>
            {/* Header with rainbow gradient */}
            <div className="relative px-4 sm:px-8 pt-8 sm:pt-10 pb-4 sm:pb-6 text-center bg-gradient-to-b from-[var(--gradient-mid-3)]/10 via-[var(--gradient-mid-1)]/5 to-transparent">
              {/* Floating emoji */}
              <div className="absolute top-4 left-8 text-2xl animate-bounce">{variation.emoji}</div>
              <div className="absolute top-6 right-12 text-xl animate-bounce" style={{ animationDelay: "0.2s" }}>✨</div>
              
              {/* GIF Display */}
              {currentGif && !gifLoading ? (
                <div className="mb-4 rounded-xl overflow-hidden inline-block border-rainbow-animated">
                  <img
                    src={currentGif.images.fixed_height_small.url}
                    alt={currentGif.title}
                    className="max-h-24 rounded-lg"
                  />
                </div>
              ) : (
                /* Rainbow bordered icon container (fallback) */
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--gradient-start)]/20 via-[var(--gradient-mid-3)]/20 to-[var(--gradient-end)]/20 mb-4 border-rainbow-animated">
                  <IconComponent className="w-10 h-10 text-[var(--gradient-mid-3)]" />
                </div>
              )}
              <h2 className="text-xl font-bold mb-2 text-rainbow">{variation.title}</h2>
              <p className="text-base font-medium text-[var(--gradient-mid-4)] dark:text-[var(--gradient-mid-2)]">
                {variation.subtitle}
              </p>
            </div>

            {/* Description */}
            <div className="px-4 sm:px-8 py-3 sm:py-4">
              <p className="text-xs sm:text-sm text-muted-foreground text-center leading-relaxed">
                {variation.description}
              </p>
            </div>

            {/* Fun stats */}
            <div className="px-4 sm:px-8 pb-4">
              <div className="flex items-center justify-center gap-3 sm:gap-6 text-center">
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-rainbow">100%</div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground">Free & Open Source</div>
                </div>
                <div className="w-px h-8 sm:h-10 bg-gradient-to-b from-transparent via-[var(--gradient-mid-3)]/30 to-transparent" />
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-rainbow-animated">∞</div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground">Gratitude</div>
                </div>
                <div className="w-px h-8 sm:h-10 bg-gradient-to-b from-transparent via-[var(--gradient-mid-3)]/30 to-transparent" />
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-foreground flex items-center justify-center">
                    <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--gradient-mid-1)] fill-[var(--gradient-mid-1)] animate-pulse" />
                  </div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground">Made with Love</div>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="px-4 sm:px-8 pb-6 sm:pb-8 pt-2 space-y-3">
              <button
                onClick={handleDonate}
                className={clsx(
                  "w-full py-4 px-6 rounded-xl font-semibold text-white",
                  "bg-gradient-to-r from-[var(--gradient-start)] via-[var(--gradient-mid-3)] to-[var(--gradient-end)]",
                  "hover:brightness-110",
                  "transition-all hover:scale-[1.02] active:scale-[0.98]",
                  "flex items-center justify-center gap-2",
                  "shadow-lg shadow-[var(--gradient-mid-3)]/25",
                  "text-lg",
                  "rainbow-hover-glow"
                )}
              >
                <span>{variation.ctaText}</span>
                <ExternalLink className="w-4 h-4 opacity-70" />
              </button>
              
              <button
                onClick={handleSkip}
                className={clsx(
                  "w-full py-3 px-6 rounded-xl font-medium",
                  "text-muted-foreground hover:text-foreground",
                  "border border-border hover:border-foreground/20",
                  "transition-all hover:bg-secondary/50",
                  "text-sm"
                )}
              >
                {variation.skipText}
              </button>
            </div>
          </>
        ) : (
          // Sad state after skip
          <>
            {/* Sad header */}
            <div className="relative px-4 sm:px-8 pt-10 sm:pt-12 pb-4 sm:pb-6 text-center bg-gradient-to-b from-[var(--gradient-mid-4)]/10 via-gray-500/5 to-transparent">
              {/* Sad GIF or emoji */}
              {currentGif && !gifLoading ? (
                <div className="mb-4 rounded-xl overflow-hidden inline-block">
                  <img
                    src={currentGif.images.fixed_height_small.url}
                    alt={currentGif.title}
                    className="max-h-24 rounded-lg opacity-80"
                  />
                </div>
              ) : (
                <div className="text-6xl mb-4 animate-bounce" style={{ animationDuration: "2s" }}>
                  {variation.sadEmoji}
                </div>
              )}
              <h2 className="text-xl font-bold mb-2 text-rainbow">{variation.sadTitle}</h2>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
                {variation.sadSubtitle}
              </p>
            </div>

            {/* Reassurance */}
            <div className="px-4 sm:px-8 py-4 sm:py-6">
              <div className="p-3 sm:p-4 rounded-lg bg-secondary/50 border-rainbow">
                <p className="text-xs sm:text-sm text-muted-foreground text-center">
                  Just kidding! <span className="text-rainbow-animated">We still love you.</span> 💜<br />
                  <span className="text-[10px] sm:text-xs">Your signature is ready to rock!</span>
                </p>
              </div>
            </div>

            {/* Continue button */}
            <div className="px-4 sm:px-8 pb-6 sm:pb-8 pt-2 space-y-3">
              <button
                onClick={handleContinueAfterSad}
                className={clsx(
                  "w-full py-3.5 px-6 rounded-xl font-medium",
                  "bg-secondary hover:bg-secondary/80",
                  "border border-border",
                  "transition-all hover:scale-[1.02] active:scale-[0.98]",
                  "flex items-center justify-center gap-2"
                )}
              >
                <Zap className="w-4 h-4" />
                <span>{variation.continueText}</span>
              </button>

              {/* Second chance */}
              <button
                onClick={handleDonate}
                className="w-full py-2 px-4 text-sm text-muted-foreground hover:text-rainbow-animated transition-colors flex items-center justify-center gap-2 group"
              >
                <Heart className="w-3 h-3 group-hover:text-[var(--gradient-mid-1)]" />
                <span>Actually, I changed my mind!</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
