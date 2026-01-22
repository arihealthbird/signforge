"use client";

import { useEffect, useState, useCallback } from "react";
import { 
  X, Link2, Check, Copy, ExternalLink, 
  Mail, MessageCircle, Linkedin,
  Sparkles, PartyPopper, Rocket, Heart, Zap
} from "lucide-react";
import { clsx } from "clsx";
import { SignatureData } from "@/types/signature";
import { TemplateId, SIGNATURE_TEMPLATES } from "@/lib/templates";
import { EmailThemeId } from "@/lib/email-themes";
import { generateShareUrl, estimateShareUrlLength } from "@/lib/share";
import { GiphyFetch } from "@giphy/js-fetch-api";
import { IGif } from "@giphy/js-types";

// Initialize Giphy client
const gf = new GiphyFetch(process.env.NEXT_PUBLIC_GIPHY_API_KEY || "");

// Fun share messages
const SHARE_MESSAGES = [
  { title: "Spread the Love! 💌", subtitle: "Your signature is too good to keep secret!" },
  { title: "Share the Magic! ✨", subtitle: "Let your friends level up their email game too!" },
  { title: "Pass It On! 🚀", subtitle: "Good design should be shared with the world!" },
  { title: "Sharing is Caring! 💝", subtitle: "Help someone else look professional today!" },
  { title: "Send It! 📤", subtitle: "Your signature deserves to be seen!" },
];

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  signatureData: SignatureData;
  templateId: TemplateId;
  emailTheme?: EmailThemeId;
}

export function ShareModal({ 
  isOpen, 
  onClose, 
  signatureData, 
  templateId,
  emailTheme 
}: ShareModalProps) {
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [urlLength, setUrlLength] = useState(0);
  const [message, setMessage] = useState(SHARE_MESSAGES[0]);
  const [currentGif, setCurrentGif] = useState<IGif | null>(null);
  const [gifLoading, setGifLoading] = useState(false);

  // Fetch a random share GIF
  const fetchRandomGif = useCallback(async () => {
    if (!process.env.NEXT_PUBLIC_GIPHY_API_KEY) return;
    
    setGifLoading(true);
    try {
      const searchTerms = ["share love", "pass it on", "spread joy", "high five", "teamwork"];
      const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];
      const result = await gf.search(randomTerm, { limit: 20, rating: "g" });
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

  // Generate share URL and pick random message when modal opens
  useEffect(() => {
    if (isOpen) {
      const url = generateShareUrl(signatureData, templateId, emailTheme);
      setShareUrl(url);
      setUrlLength(estimateShareUrlLength(signatureData, templateId, emailTheme));
      setCopied(false);
      setMessage(SHARE_MESSAGES[Math.floor(Math.random() * SHARE_MESSAGES.length)]);
      setCurrentGif(null);
      fetchRandomGif();
    }
  }, [isOpen, signatureData, templateId, emailTheme, fetchRandomGif]);

  // Handle body scroll lock
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

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  }, [shareUrl]);

  const handleShareVia = useCallback((platform: "x" | "linkedin" | "email" | "whatsapp") => {
    const text = `Check out my email signature design created with Signature Forge! ✨`;
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(text);
    
    const emailSubject = "Check out this email signature tool! ✨";
    const emailBody = `Hey!\n\nI just created a professional email signature using Signature Forge and thought you might like it too!\n\nClick the link below to see my design and create your own:\n${shareUrl}\n\nEnjoy! 🚀`;
    
    const urls: Record<string, string> = {
      x: `https://x.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      email: `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`,
      whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    };
    
    window.open(urls[platform], "_blank", "noopener,noreferrer");
  }, [shareUrl]);

  if (!isOpen) return null;

  const template = SIGNATURE_TEMPLATES.find(t => t.id === templateId);
  const urlLengthPercent = Math.min((urlLength / 2000) * 100, 100);
  const isUrlTooLong = urlLength > 2000;

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
          "relative w-full max-w-[calc(100vw-1.5rem)] sm:max-w-lg bg-background rounded-2xl shadow-2xl",
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

        {/* Header with rainbow gradient and GIF */}
        <div className="relative px-5 sm:px-8 pt-8 sm:pt-10 pb-4 sm:pb-6 text-center bg-gradient-to-b from-[var(--gradient-mid-3)]/10 via-[var(--gradient-mid-1)]/5 to-transparent">
          {/* GIF Display */}
          {currentGif && !gifLoading ? (
            <div className="mb-4 rounded-xl overflow-hidden inline-block border-rainbow-animated shadow-lg">
              <img
                src={currentGif.images.fixed_height.url}
                alt={currentGif.title}
                className="max-h-40 sm:max-h-48 rounded-lg"
              />
            </div>
          ) : (
            <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-[var(--gradient-start)] via-[var(--gradient-mid-3)] to-[var(--gradient-end)] mb-4 animate-pulse">
              <Rocket className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            </div>
          )}
          
          <h2 className="text-xl font-bold mb-2 text-rainbow">
            {message.title}
          </h2>
          <p className="text-sm text-[var(--gradient-mid-4)] dark:text-[var(--gradient-mid-2)] max-w-sm mx-auto font-medium">
            {message.subtitle}
          </p>
        </div>

        {/* What you're sharing preview */}
        <div className="px-5 sm:px-8 pb-4">
          <div className="rounded-xl border-rainbow bg-gradient-to-br from-secondary/50 to-secondary/20 p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--gradient-mid-2)] to-[var(--gradient-mid-4)] flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">
                  {signatureData.fullName || "Your Awesome Signature"} ✨
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {template?.name || "Custom Template"} • {signatureData.company || "Ready to impress!"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Copy link section */}
        <div className="px-5 sm:px-8 pb-4 space-y-3">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
            <Link2 className="w-3.5 h-3.5" />
            Magic Link
          </label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className={clsx(
                  "w-full h-12 px-4 pr-10 rounded-xl border bg-secondary/50 text-sm",
                  "focus:outline-none focus:ring-2 focus:ring-[var(--gradient-mid-3)]/50 transition-all",
                  isUrlTooLong ? "border-amber-500/50" : "border-border"
                )}
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <Zap className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--gradient-mid-3)]" />
            </div>
            <button
              onClick={handleCopyLink}
              className={clsx(
                "h-12 px-5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2",
                copied
                  ? "bg-emerald-500 text-white scale-105"
                  : "bg-gradient-to-r from-[var(--gradient-mid-2)] to-[var(--gradient-mid-4)] text-white hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[var(--gradient-mid-3)]/20"
              )}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span className="hidden sm:inline">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span className="hidden sm:inline">Copy</span>
                </>
              )}
            </button>
          </div>

          {/* URL length indicator - only show if notable */}
          {urlLengthPercent > 30 && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Link size</span>
                <span className={clsx(
                  isUrlTooLong ? "text-amber-500" : "text-muted-foreground"
                )}>
                  {urlLengthPercent < 50 ? "Compact! 👍" : urlLengthPercent < 80 ? "Getting cozy" : "A bit chunky 🐘"}
                </span>
              </div>
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                <div 
                  className={clsx(
                    "h-full rounded-full transition-all",
                    urlLengthPercent < 50 
                      ? "bg-gradient-to-r from-emerald-400 to-emerald-500" 
                      : urlLengthPercent < 80 
                        ? "bg-gradient-to-r from-amber-400 to-amber-500" 
                        : "bg-gradient-to-r from-rose-400 to-rose-500"
                  )}
                  style={{ width: `${urlLengthPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Share via platforms - more visual */}
        <div className="px-5 sm:px-8 pb-4">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5 mb-3">
            <Heart className="w-3.5 h-3.5 text-[var(--gradient-mid-1)]" />
            Share the love
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => handleShareVia("x")}
              className="flex-1 h-11 rounded-xl border border-border bg-secondary/30 hover:bg-black/10 hover:border-black/30 dark:hover:bg-white/10 dark:hover:border-white/30 transition-all flex items-center justify-center gap-2 text-sm group"
            >
              <svg className="w-4 h-4 group-hover:text-black dark:group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span className="hidden sm:inline">X</span>
            </button>
            <button
              onClick={() => handleShareVia("linkedin")}
              className="flex-1 h-11 rounded-xl border border-border bg-secondary/30 hover:bg-[#0A66C2]/10 hover:border-[#0A66C2]/30 transition-all flex items-center justify-center gap-2 text-sm group"
            >
              <Linkedin className="w-4 h-4 group-hover:text-[#0A66C2] transition-colors" />
              <span className="hidden sm:inline">LinkedIn</span>
            </button>
            <button
              onClick={() => handleShareVia("whatsapp")}
              className="flex-1 h-11 rounded-xl border border-border bg-secondary/30 hover:bg-[#25D366]/10 hover:border-[#25D366]/30 transition-all flex items-center justify-center gap-2 text-sm group"
            >
              <MessageCircle className="w-4 h-4 group-hover:text-[#25D366] transition-colors" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>
            <button
              onClick={() => handleShareVia("email")}
              className="flex-1 h-11 rounded-xl border border-border bg-secondary/30 hover:bg-[var(--gradient-mid-3)]/10 hover:border-[var(--gradient-mid-3)]/30 transition-all flex items-center justify-center gap-2 text-sm group"
            >
              <Mail className="w-4 h-4 group-hover:text-[var(--gradient-mid-3)] transition-colors" />
              <span className="hidden sm:inline">Email</span>
            </button>
          </div>
        </div>

        {/* How it works - more fun */}
        <div className="px-5 sm:px-8 pb-6 sm:pb-8 pt-2">
          <div className="rounded-xl border-rainbow bg-gradient-to-br from-secondary/30 to-transparent p-4">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-rainbow">
              <PartyPopper className="w-4 h-4" />
              How the magic works
            </h3>
            <div className="space-y-2.5">
              <div className="flex items-start gap-2.5 text-xs text-muted-foreground">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-br from-[var(--gradient-mid-2)]/20 to-[var(--gradient-mid-4)]/20 text-[var(--gradient-mid-3)] font-bold flex-shrink-0 text-[10px]">
                  1
                </span>
                <span>Your design is encoded in the link — <span className="text-foreground font-medium">no account needed!</span></span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-muted-foreground">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-br from-[var(--gradient-mid-2)]/20 to-[var(--gradient-mid-4)]/20 text-[var(--gradient-mid-3)] font-bold flex-shrink-0 text-[10px]">
                  2
                </span>
                <span>Friends click the link and see your signature as a <span className="text-foreground font-medium">starting template</span></span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-muted-foreground">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-br from-[var(--gradient-mid-2)]/20 to-[var(--gradient-mid-4)]/20 text-[var(--gradient-mid-3)] font-bold flex-shrink-0 text-[10px]">
                  3
                </span>
                <span>They customize with their info — <span className="text-foreground font-medium">your data stays safe!</span> 🔒</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
