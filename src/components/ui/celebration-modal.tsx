"use client";

import { useEffect, useCallback, useState } from "react";
import { X, Heart, ExternalLink, Sparkles } from "lucide-react";
import { clsx } from "clsx";
import { BalloonBackground } from "./balloons-pop-background";
import { GiphyFetch } from "@giphy/js-fetch-api";
import { IGif } from "@giphy/js-types";

// Initialize Giphy client
const gf = new GiphyFetch(process.env.NEXT_PUBLIC_GIPHY_API_KEY || "");

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DONATE_URL = "https://givebutter.com/c5WBuI";

interface CelebrationVariation {
  title: string;
  subtitle: string;
  message: string;
  donationText: string;
  ctaText: string;
  skipText: string;
  gifSearchTerm: string;
}

const CELEBRATION_VARIATIONS: CelebrationVariation[] = [
  {
    title: "You Did It! 🎉",
    subtitle: "We're so happy you gave us a shot!",
    message: "Your email signature is ready to make you look like a total pro. Go ahead, impress everyone!",
    donationText: "If this saved you time, maybe buy us a coffee? ☕ We promise to drink it while coding more features.",
    ctaText: "Support the Project",
    skipText: "Thanks, I'm good!",
    gifSearchTerm: "celebration success",
  },
  {
    title: "Woohoo! 🚀",
    subtitle: "Your signature just leveled up!",
    message: "You're about to look 10x more professional in every email. That's basically a superpower.",
    donationText: "Plot twist: we're fueled entirely by gratitude and the occasional burrito. 🌯",
    ctaText: "Buy Us a Burrito",
    skipText: "Maybe next time!",
    gifSearchTerm: "happy dance",
  },
  {
    title: "Nailed It! 💪",
    subtitle: "Look at you, being all professional!",
    message: "Your inbox is about to become significantly more impressive. You're welcome, future you.",
    donationText: "Fun fact: Every donation adds exactly 0.001% more sparkle to the confetti. That's science! ✨",
    ctaText: "Add More Sparkle",
    skipText: "I have enough sparkle",
    gifSearchTerm: "you did it",
  },
  {
    title: "High Five! ✋",
    subtitle: "Your signature game is strong!",
    message: "Somewhere out there, a recruiter is about to be impressed. You're making moves.",
    donationText: "Our servers run on hopes, dreams, and occasionally actual money. Just saying. 💸",
    ctaText: "Keep the Dream Alive",
    skipText: "Living the dream already",
    gifSearchTerm: "high five celebration",
  },
  {
    title: "Boom! 💥",
    subtitle: "Signature: unlocked!",
    message: "You just crafted something beautiful. Time to spread it across the internet like confetti.",
    donationText: "If you laughed even once, that's worth at least $1... right? Asking for a friend. 🤔",
    ctaText: "Pay Per Laugh",
    skipText: "I'm more of a smiler",
    gifSearchTerm: "awesome celebration",
  },
  {
    title: "Achievement Unlocked! 🎮",
    subtitle: "+100 Professional Points",
    message: "You've completed the legendary quest of 'Making a Good First Impression'. Rare drop acquired!",
    donationText: "This free tool was made by developers who definitely don't survive on energy drinks. Okay, maybe a little. 🧃",
    ctaText: "Fund the Energy Drinks",
    skipText: "Stay caffeinated, friends",
    gifSearchTerm: "video game victory",
  },
  {
    title: "*Chef's Kiss* 👨‍🍳",
    subtitle: "Perfection, served fresh!",
    message: "This signature is so good, Gordon Ramsay would approve. And he doesn't approve of anything.",
    donationText: "Our code is free, but our pizza habit isn't. Help us stay fed while we build cool stuff! 🍕",
    ctaText: "Feed the Devs",
    skipText: "They'll survive",
    gifSearchTerm: "chef kiss perfect",
  },
  {
    title: "Smooth! 😎",
    subtitle: "That was easier than expected, right?",
    message: "You just did in 2 minutes what would've taken an hour in HTML. Time saved = coffee earned.",
    donationText: "We built this instead of sleeping. No regrets, but maybe some donations? 😴",
    ctaText: "Let Us Sleep In",
    skipText: "Keep grinding!",
    gifSearchTerm: "smooth moves",
  },
  {
    title: "Mic Drop! 🎙️",
    subtitle: "Your email game just changed forever!",
    message: "Every email you send now carries an aura of professionalism. It's basically a vibe shift.",
    donationText: "This project is 100% open source and 100% powered by good vibes. And sometimes actual money. 🌈",
    ctaText: "Send Good Vibes",
    skipText: "Vibes received!",
    gifSearchTerm: "mic drop",
  },
  {
    title: "Legendary! ✨",
    subtitle: "You've ascended to email royalty!",
    message: "Your recipients will now bow before the majesty of your well-crafted signature. Probably.",
    donationText: "Running servers costs money, but making people smile is priceless. Help us do both? 🙏",
    ctaText: "Keep Us Running",
    skipText: "You're doing great!",
    gifSearchTerm: "legendary epic",
  },
  {
    title: "*Confetti Cannon* 🎊",
    subtitle: "This calls for a celebration!",
    message: "You made something awesome and it took like zero effort. That's the dream, friend.",
    donationText: "We're a small team with big dreams and moderate coffee addictions. Every little bit helps! ☕",
    ctaText: "Fuel the Caffeine",
    skipText: "Stay wired!",
    gifSearchTerm: "confetti party",
  },
  {
    title: "Crushed It! 👊",
    subtitle: "Your signature is chef's-kiss perfect!",
    message: "Time to copy-paste your way to inbox domination. Your professional reputation thanks you.",
    donationText: "We're not saying we're heroes, but we did make this free. Hero-adjacent, at least. 🦸",
    ctaText: "Support Your Heroes",
    skipText: "Already my hero!",
    gifSearchTerm: "crushed it success",
  },
  {
    title: "Ding Ding! 🔔",
    subtitle: "Order up: one perfect signature!",
    message: "Fresh out of the oven and ready to impress. Handle with care — it's that good.",
    donationText: "Made with ❤️ and way too much late-night coding. Donations help us see daylight occasionally. 🌅",
    ctaText: "Help Us Touch Grass",
    skipText: "Enjoy the indoors!",
    gifSearchTerm: "order up ding",
  },
  {
    title: "Victory Lap! 🏆",
    subtitle: "You've officially won at email!",
    message: "Take a bow. You just made your digital presence 1000% better. That's not even an exaggeration.",
    donationText: "This tool is free because we believe in karma. But also, you know, bills exist. 💸",
    ctaText: "Balance the Karma",
    skipText: "Universe is balanced",
    gifSearchTerm: "victory lap celebration",
  },
  {
    title: "Plot Twist! 🎬",
    subtitle: "The signature was inside you all along!",
    message: "JK, it was in our app. But now it's yours! Go forth and conquer the professional world.",
    donationText: "We wrote a million lines of code so you could click a few buttons. Worth it? We think so. 💻",
    ctaText: "Appreciate the Code",
    skipText: "Code appreciated!",
    gifSearchTerm: "plot twist surprise",
  },
];

export function CelebrationModal({ isOpen, onClose }: CelebrationModalProps) {
  const [variation, setVariation] = useState<CelebrationVariation | null>(null);
  const [currentGif, setCurrentGif] = useState<IGif | null>(null);
  const [gifLoading, setGifLoading] = useState(false);

  // Fetch a random celebration GIF
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

  // Pick random variation and fetch GIF when modal opens
  useEffect(() => {
    if (isOpen) {
      const randomIndex = Math.floor(Math.random() * CELEBRATION_VARIATIONS.length);
      const selectedVariation = CELEBRATION_VARIATIONS[randomIndex];
      setVariation(selectedVariation);
      setCurrentGif(null);
      document.body.style.overflow = "hidden";
      fetchRandomGif(selectedVariation.gifSearchTerm);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, fetchRandomGif]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleDonate = useCallback(() => {
    window.open(DONATE_URL, "_blank", "noopener,noreferrer");
  }, []);

  if (!isOpen || !variation) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Semi-transparent backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" />

      {/* Balloons floating over everything */}
      <BalloonBackground className="z-[1]" />

      {/* Modal Content */}
      <div
        className={clsx(
          "relative z-10 w-full max-w-[calc(100vw-1.5rem)] sm:max-w-md",
          "bg-background rounded-2xl shadow-2xl",
          "overflow-hidden max-h-[calc(100vh-2rem)] overflow-y-auto",
          "animate-in zoom-in-95 fade-in duration-200",
          "border-rainbow-animated glow-rainbow"
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

        {/* Header with GIF */}
        <div className="relative px-4 sm:px-8 pt-8 sm:pt-10 pb-4 sm:pb-6 text-center bg-gradient-to-b from-[var(--gradient-mid-3)]/10 via-[var(--gradient-mid-1)]/5 to-transparent">
          {/* Single subtle sparkle */}
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
            /* Loading placeholder */
            <div className="mb-4 w-32 h-24 mx-auto rounded-xl bg-secondary/50 animate-pulse border-rainbow-animated" />
          )}
          
          <h2 className="text-xl font-bold mb-2 text-rainbow">
            {variation.title}
          </h2>
          <p className="text-base font-medium text-[var(--gradient-mid-4)] dark:text-[var(--gradient-mid-2)]">
            {variation.subtitle}
          </p>
        </div>

        {/* Message */}
        <div className="px-4 sm:px-8 py-3 sm:py-4">
          <p className="text-xs sm:text-sm text-muted-foreground text-center leading-relaxed">
            {variation.message}
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

        {/* Donation suggestion */}
        <div className="px-4 sm:px-8 pb-4">
          <div className="p-3 sm:p-4 rounded-lg bg-secondary/50 border-rainbow">
            <p className="text-xs sm:text-sm text-center text-muted-foreground italic leading-relaxed">
              {variation.donationText}
            </p>
          </div>
        </div>

        {/* CTAs */}
        <div className="px-4 sm:px-8 pb-6 sm:pb-8 pt-2 space-y-3">
          <button
            onClick={handleDonate}
            className={clsx(
              "w-full py-3.5 px-6 rounded-xl font-medium text-white",
              "bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500",
              "hover:from-violet-600 hover:via-purple-600 hover:to-fuchsia-600",
              "transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]",
              "flex items-center justify-center gap-2",
              "shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30",
              "text-base"
            )}
          >
            <Heart className="w-4 h-4" />
            <span>{variation.ctaText}</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </button>
          
          <button
            onClick={onClose}
            className={clsx(
              "w-full py-3 px-6 rounded-xl font-medium",
              "text-muted-foreground hover:text-foreground",
              "border border-border hover:border-foreground/20",
              "transition-all hover:bg-secondary/50",
              "flex items-center justify-center gap-2",
              "text-sm"
            )}
          >
            <Sparkles className="w-4 h-4" />
            <span>{variation.skipText}</span>
          </button>
        </div>

        {/* Tip to pop balloons */}
        <div className="px-4 sm:px-8 pb-6 text-center">
          <p className="text-[10px] sm:text-xs text-muted-foreground/70">
            💡 Tip: Move your mouse over the balloons to pop them!
          </p>
        </div>
      </div>
    </div>
  );
}
