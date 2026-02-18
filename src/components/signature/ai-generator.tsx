"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { SignatureData } from "@/types/signature";
import { TemplateId } from "@/lib/templates";
import { Sparkles, Wand2, Loader2, Star, Lightbulb, Palette, Building2, Check, ImagePlus, User, X, History, ChevronDown, Briefcase, GraduationCap, HeartPulse } from "lucide-react";
import { clsx } from "clsx";
import { EmailThemeId } from "@/lib/email-themes";
import { getThemePlaceholders } from "@/lib/theme-placeholders";
import { Turnstile, isTurnstileEnabled } from "@/components/ui/turnstile";

interface UploadedImage {
  type: "profile" | "logo";
  file: File;
  preview: string;
  url?: string; // Set after upload
  uploading?: boolean;
}

interface AIGeneratorProps {
  currentData: SignatureData;
  onGenerate: (data: Partial<SignatureData>, suggestedTemplate?: TemplateId | null) => void;
  onGeneratingChange?: (isGenerating: boolean) => void;
  onGenerationComplete?: () => void;
  emailTheme?: EmailThemeId;
}

const PROMPT_STORAGE_KEY = "ai-signature-current-prompt";
const PROMPT_HISTORY_KEY = "ai-signature-prompt-history";
const MAX_HISTORY_ITEMS = 10;

export function AIGenerator({ currentData, onGenerate, onGeneratingChange, onGenerationComplete, emailTheme = "professional" }: AIGeneratorProps) {
  const [prompt, setPrompt] = useState("");
  const [promptHistory, setPromptHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  
  const profileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);
  
  // Get theme-specific placeholders
  const placeholders = useMemo(() => getThemePlaceholders(emailTheme), [emailTheme]);

  // Load prompt and history from sessionStorage on mount
  useEffect(() => {
    try {
      const savedPrompt = sessionStorage.getItem(PROMPT_STORAGE_KEY);
      if (savedPrompt) {
        setPrompt(savedPrompt);
      }
      const savedHistory = sessionStorage.getItem(PROMPT_HISTORY_KEY);
      if (savedHistory) {
        setPromptHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      // sessionStorage might not be available
    }
  }, []);

  // Save prompt to sessionStorage when it changes
  useEffect(() => {
    try {
      sessionStorage.setItem(PROMPT_STORAGE_KEY, prompt);
    } catch (e) {
      // sessionStorage might not be available
    }
  }, [prompt]);

  // Save history to sessionStorage when it changes
  useEffect(() => {
    try {
      sessionStorage.setItem(PROMPT_HISTORY_KEY, JSON.stringify(promptHistory));
    } catch (e) {
      // sessionStorage might not be available
    }
  }, [promptHistory]);

  const addToHistory = (newPrompt: string) => {
    if (!newPrompt.trim()) return;
    setPromptHistory(prev => {
      // Don't add duplicates at the top
      const filtered = prev.filter(p => p !== newPrompt);
      const updated = [newPrompt, ...filtered].slice(0, MAX_HISTORY_ITEMS);
      return updated;
    });
  };

  // Notify parent of generating state changes
  useEffect(() => {
    onGeneratingChange?.(isGenerating);
  }, [isGenerating, onGeneratingChange]);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      uploadedImages.forEach(img => URL.revokeObjectURL(img.preview));
    };
  }, []);

  // Click outside to close history dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (historyRef.current && !historyRef.current.contains(e.target as Node)) {
        setShowHistory(false);
      }
    };
    if (showHistory) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showHistory]);

  const handleTurnstileVerify = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);

  const handleTurnstileExpire = useCallback(() => {
    setTurnstileToken(null);
  }, []);

  const uploadImage = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const headers: Record<string, string> = {};
      if (turnstileToken) {
        headers["x-turnstile-token"] = turnstileToken;
      }

      const response = await fetch("/api/upload", {
        method: "POST",
        headers,
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Upload failed");
      }

      const data = await response.json();
      return data.url;
    } catch (err) {
      console.error("Upload error:", err);
      return null;
    }
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>, type: "profile" | "logo") => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a valid image (JPEG, PNG, GIF, or WebP)");
      return;
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be smaller than 2MB");
      return;
    }

    // Remove existing image of same type
    setUploadedImages(prev => prev.filter(img => img.type !== type));

    // Create preview and add to state
    const preview = URL.createObjectURL(file);
    const newImage: UploadedImage = { type, file, preview, uploading: true };
    setUploadedImages(prev => [...prev, newImage]);

    // Upload to server
    setIsUploading(true);
    const url = await uploadImage(file);
    setIsUploading(false);

    if (url) {
      setUploadedImages(prev => 
        prev.map(img => 
          img.type === type ? { ...img, url, uploading: false } : img
        )
      );
    } else {
      // Remove failed upload
      setUploadedImages(prev => prev.filter(img => img.type !== type));
      URL.revokeObjectURL(preview);
      setError(`Failed to upload ${type === "profile" ? "profile photo" : "logo"}`);
    }

    // Reset input
    e.target.value = "";
  };

  const removeImage = (type: "profile" | "logo") => {
    const img = uploadedImages.find(i => i.type === type);
    if (img) {
      URL.revokeObjectURL(img.preview);
      setUploadedImages(prev => prev.filter(i => i.type !== type));
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a description of what you want");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Prepare image URLs if any
      const profileImage = uploadedImages.find(img => img.type === "profile");
      const logoImage = uploadedImages.find(img => img.type === "logo");

      const fetchHeaders: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (turnstileToken) {
        fetchHeaders["x-turnstile-token"] = turnstileToken;
      }

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: fetchHeaders,
        body: JSON.stringify({
          prompt,
          currentData,
          providedImages: {
            profilePhotoUrl: profileImage?.url || null,
            logoUrl: logoImage?.url || null,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate signature");
      }

      const data = await response.json();
      onGenerate(data.signature, data.suggestedTemplate);
      
      // Add prompt to history before clearing
      addToHistory(prompt);
      
      // Clear uploaded images after successful generation
      uploadedImages.forEach(img => URL.revokeObjectURL(img.preview));
      setUploadedImages([]);
      
      // Show success message
      const changes: string[] = [];
      if (data.signature.fullName) changes.push("content");
      if (data.signature.primaryColor || data.signature.fontFamily) changes.push("styling");
      if (data.signature.profilePhotoUrl || data.signature.logoUrl) changes.push("images");
      if (data.suggestedTemplate) changes.push("template");
      
      setSuccessMessage(`Generated ${changes.length > 0 ? changes.join(", ") : "signature"}!`);
      
      // Notify parent that generation is complete
      setTimeout(() => {
        onGenerationComplete?.();
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate signature");
    } finally {
      setIsGenerating(false);
    }
  };

  // Icon mapping for quick prompts
  const quickPromptIcons = [Lightbulb, Building2, Palette, Star, Wand2, Briefcase, GraduationCap, HeartPulse];
  
  const quickPrompts = placeholders.aiQuickPrompts.map((prompt, index) => ({
    ...prompt,
    icon: quickPromptIcons[index % quickPromptIcons.length],
  }));

  return (
    <div className="relative">
      {/* Main container with rainbow border */}
      <div className={clsx(
        "relative rounded-xl overflow-hidden transition-all duration-500",
        isGenerating ? "ai-pulse-glow" : "rainbow-hover-glow"
      )}>
        {/* Animated rainbow border - always visible */}
        <div className="absolute inset-0 border-rainbow-animated rounded-xl pointer-events-none z-10" />
        
        {/* Background gradient */}
        <div className="absolute inset-[2px] rounded-[10px] bg-gradient-to-br from-background via-background to-[var(--gradient-end)]/5" />
        
        {/* Content */}
        <div className="relative z-0 p-4">
          {/* Header with rainbow accent */}
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-2">
              {/* Animated icon container */}
              <div className="relative">
                <div className="w-10 h-10 rounded-lg border-rainbow-animated flex items-center justify-center bg-background">
                  <Sparkles className={clsx(
                    "w-5 h-5 transition-all duration-300",
                    isGenerating ? "text-[var(--gradient-mid-3)] animate-pulse" : "text-[var(--gradient-mid-4)]"
                  )} />
                </div>
                {/* Floating sparkles around icon */}
                <span className="sparkle sparkle-1" style={{ width: '3px', height: '3px' }} />
                <span className="sparkle sparkle-2" style={{ width: '3px', height: '3px' }} />
              </div>
              
              <div>
                <h3 className="font-semibold text-rainbow-animated text-base">
                  AI Signature Assistant
                </h3>
                <p className="text-xs text-muted-foreground">
                  Powered by magic ✨
                </p>
              </div>
            </div>
          </div>

          {/* Textarea with rainbow focus */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-muted-foreground">
                Describe your perfect signature
              </label>
              
              {/* Prompt History Dropdown */}
              {promptHistory.length > 0 && (
                <div ref={historyRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setShowHistory(!showHistory)}
                    className={clsx(
                      "flex items-center gap-1 text-xs px-2 py-1 rounded-md transition-all duration-200",
                      "text-muted-foreground hover:text-foreground hover:bg-secondary/80",
                      showHistory && "bg-secondary/80 text-foreground"
                    )}
                  >
                    <History className="w-3 h-3" />
                    <span>History</span>
                    <ChevronDown className={clsx(
                      "w-3 h-3 transition-transform duration-200",
                      showHistory && "rotate-180"
                    )} />
                  </button>
                  
                  {showHistory && (
                    <div className="absolute right-0 top-full mt-1 w-72 max-h-48 overflow-y-auto z-20 rounded-lg border border-border/60 bg-background shadow-lg">
                      {promptHistory.map((historyPrompt, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            setPrompt(historyPrompt);
                            setShowHistory(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs text-muted-foreground hover:bg-secondary/60 hover:text-foreground transition-colors border-b border-border/30 last:border-b-0"
                        >
                          <span className="line-clamp-2">{historyPrompt}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className={clsx(
              "relative rounded-lg transition-all duration-300",
              prompt && "border-rainbow-animated"
            )}>
              <textarea
                placeholder={placeholders.aiPlaceholder}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className={clsx(
                  "flex min-h-[100px] w-full rounded-lg bg-secondary/50 px-3 py-3 text-sm",
                  "placeholder:text-muted-foreground/60 resize-none",
                  "focus-visible:outline-none transition-all duration-300",
                  "border-2",
                  prompt ? "border-transparent" : "border-border/50 focus:border-[var(--gradient-mid-3)]/50"
                )}
              />
              {/* Shimmer effect when typing */}
              {prompt && (
                <div className="absolute inset-0 rounded-lg pointer-events-none overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--gradient-mid-3)]/5 to-transparent animate-pulse" />
                </div>
              )}
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="mb-3 sm:mb-4">
            <p className="text-[10px] sm:text-xs text-muted-foreground mb-2 flex items-center gap-1">
              <ImagePlus className="w-3 h-3 text-[var(--gradient-mid-4)]" />
              Add your images (optional)
            </p>
            
            {/* Hidden file inputs */}
            <input
              ref={profileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={(e) => handleImageSelect(e, "profile")}
              className="hidden"
            />
            <input
              ref={logoInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={(e) => handleImageSelect(e, "logo")}
              className="hidden"
            />
            
            <div className="flex flex-col sm:flex-row gap-2">
              {/* Profile Photo Upload */}
              {!uploadedImages.find(img => img.type === "profile") ? (
                <button
                  type="button"
                  onClick={() => profileInputRef.current?.click()}
                  disabled={isUploading || isGenerating}
                  className={clsx(
                    "flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg",
                    "bg-secondary/60 hover:bg-secondary border border-dashed border-border/60",
                    "text-xs text-muted-foreground hover:text-foreground",
                    "transition-all duration-200",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                >
                  <User className="w-4 h-4" />
                  <span>Profile Photo</span>
                </button>
              ) : (
                <div className="flex-1 relative group">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/80 border border-[var(--gradient-mid-4)]/30">
                    <img
                      src={uploadedImages.find(img => img.type === "profile")?.preview}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="text-xs text-foreground truncate flex-1">Profile photo</span>
                    {uploadedImages.find(img => img.type === "profile")?.uploading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
                    ) : (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage("profile")}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Logo Upload */}
              {!uploadedImages.find(img => img.type === "logo") ? (
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  disabled={isUploading || isGenerating}
                  className={clsx(
                    "flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg",
                    "bg-secondary/60 hover:bg-secondary border border-dashed border-border/60",
                    "text-xs text-muted-foreground hover:text-foreground",
                    "transition-all duration-200",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Company Logo</span>
                </button>
              ) : (
                <div className="flex-1 relative group">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/80 border border-[var(--gradient-mid-4)]/30">
                    <img
                      src={uploadedImages.find(img => img.type === "logo")?.preview}
                      alt="Logo"
                      className="w-8 h-8 rounded object-contain bg-white"
                    />
                    <span className="text-xs text-foreground truncate flex-1">Company logo</span>
                    {uploadedImages.find(img => img.type === "logo")?.uploading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
                    ) : (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage("logo")}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
            
            {uploadedImages.length > 0 && (
              <p className="text-[10px] text-muted-foreground/60 mt-1.5">
                AI will use your images in the generated signature
              </p>
            )}
          </div>

          {/* Quick prompts with rainbow styling */}
          <div className="mb-3 sm:mb-4">
            <p className="text-[10px] sm:text-xs text-muted-foreground mb-2 flex items-center gap-1">
              <Lightbulb className="w-3 h-3 text-[var(--gradient-mid-1)]" />
              Quick suggestions
            </p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {quickPrompts.map((qp, i) => (
                <button
                  key={i}
                  onClick={() => setPrompt(qp.text)}
                  className={clsx(
                    "group relative text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full transition-all duration-300",
                    "bg-secondary/80 hover:bg-secondary",
                    "border border-transparent hover:border-transparent",
                    "quick-prompt-pill",
                    "flex items-center gap-1 sm:gap-1.5"
                  )}
                  title={qp.text}
                >
                  <qp.icon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[var(--gradient-mid-4)] group-hover:text-[var(--gradient-start)] transition-colors" />
                  <span className="group-hover:text-foreground transition-colors">{qp.short}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Success message */}
          {successMessage && (
            <div className="mb-4 text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-2 rounded-lg border border-emerald-500/20 flex items-center gap-2">
              <Check className="w-4 h-4" />
              {successMessage} Check the Content tab to edit.
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mb-4 text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg border border-destructive/20">
              {error}
            </div>
          )}

          {/* Generate button with full rainbow treatment */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className={clsx(
              "w-full relative overflow-hidden rounded-lg font-medium text-sm py-3 px-4",
              "transition-all duration-300 transform",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
              isGenerating 
                ? "bg-background" 
                : "bg-gradient-to-r from-[var(--gradient-start)] via-[var(--gradient-mid-3)] to-[var(--gradient-end)] text-white",
              !isGenerating && !prompt.trim() && "opacity-60",
              !isGenerating && prompt.trim() && "hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
            )}
          >
            {/* Animated background for generating state */}
            {isGenerating && (
              <div 
                className="absolute inset-0 bg-gradient-to-r from-[var(--gradient-start)] via-[var(--gradient-mid-3)] to-[var(--gradient-end)]"
                style={{
                  backgroundSize: '200% 100%',
                  animation: 'rainbow-border-shift 2s linear infinite',
                }}
              />
            )}
            
            {/* Button content */}
            <span className={clsx(
              "relative z-10 flex items-center justify-center gap-2",
              isGenerating && "text-white"
            )}>
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating magic...</span>
                  <span className="animate-pulse">✨</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>Generate with AI</span>
                </>
              )}
            </span>
            
            {/* Sparkles on button */}
            {!isGenerating && prompt.trim() && (
              <>
                <span className="sparkle sparkle-1" />
                <span className="sparkle sparkle-3" />
              </>
            )}
          </button>

          {/* Turnstile bot protection */}
          {isTurnstileEnabled() && (
            <div className="mt-3 flex justify-center">
              <div className="transform scale-[0.85] origin-center -my-1">
                <Turnstile
                  onVerify={handleTurnstileVerify}
                  onExpire={handleTurnstileExpire}
                  size="compact"
                />
              </div>
            </div>
          )}

          {/* Footer hint */}
          <p className="text-[10px] text-muted-foreground/60 text-center mt-3">
            AI will analyze your request and update the signature preview
          </p>
        </div>
      </div>
    </div>
  );
}
