"use client";

import { useState, useEffect, useCallback } from "react";
import { GiphyFetch } from "@giphy/js-fetch-api";
import { Grid } from "@giphy/react-components";
import { IGif } from "@giphy/js-types";
import { X, Search, TrendingUp, Sparkles, Loader2 } from "lucide-react";
import { clsx } from "clsx";
import { Input } from "./input";
import { Button } from "./button";

// Initialize Giphy client
const gf = new GiphyFetch(process.env.NEXT_PUBLIC_GIPHY_API_KEY || "");

interface GiphyPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (gifUrl: string, gif: IGif) => void;
  title?: string;
  searchPlaceholder?: string;
  initialSearch?: string;
}

type TabType = "trending" | "search";

export function GiphyPicker({
  isOpen,
  onClose,
  onSelect,
  title = "Choose a GIF",
  searchPlaceholder = "Search for GIFs...",
  initialSearch = "",
}: GiphyPickerProps) {
  const [activeTab, setActiveTab] = useState<TabType>(initialSearch ? "search" : "trending");
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [debouncedQuery, setDebouncedQuery] = useState(initialSearch);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (initialSearch) {
        setSearchQuery(initialSearch);
        setDebouncedQuery(initialSearch);
        setActiveTab("search");
      }
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, initialSearch]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Fetch functions for Giphy Grid
  const fetchTrending = useCallback(
    (offset: number) => gf.trending({ offset, limit: 20 }),
    []
  );

  const fetchSearch = useCallback(
    (offset: number) => gf.search(debouncedQuery, { offset, limit: 20 }),
    [debouncedQuery]
  );

  const handleGifClick = (gif: IGif, e: React.SyntheticEvent<HTMLElement>) => {
    e.preventDefault();
    // Use the original GIF URL for best quality in email signatures
    const gifUrl = gif.images.original.url;
    onSelect(gifUrl, gif);
    onClose();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveTab("search");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[250] flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" />

      {/* Modal */}
      <div
        className={clsx(
          "relative w-full max-w-2xl max-h-[85vh] bg-background rounded-2xl shadow-2xl",
          "border border-border overflow-hidden flex flex-col",
          "animate-in zoom-in-95 fade-in duration-200"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-gradient-to-b from-secondary/50 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">{title}</h2>
              <p className="text-xs text-muted-foreground">Powered by GIPHY</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-4 border-b border-border">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value.trim()) {
                  setActiveTab("search");
                }
              }}
              className="pl-10 pr-4"
            />
          </form>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 py-2 border-b border-border bg-secondary/30">
          <button
            onClick={() => setActiveTab("trending")}
            className={clsx(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              activeTab === "trending"
                ? "bg-background text-foreground shadow-sm border border-border"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            )}
          >
            <TrendingUp className="w-4 h-4" />
            Trending
          </button>
          <button
            onClick={() => setActiveTab("search")}
            className={clsx(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              activeTab === "search"
                ? "bg-background text-foreground shadow-sm border border-border"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            )}
          >
            <Search className="w-4 h-4" />
            Search Results
          </button>
        </div>

        {/* GIF Grid */}
        <div className="flex-1 overflow-y-auto p-4 min-h-[400px]">
          {activeTab === "trending" && (
            <Grid
              key="trending"
              width={580}
              columns={3}
              gutter={8}
              fetchGifs={fetchTrending}
              onGifClick={handleGifClick}
              noLink
              hideAttribution
            />
          )}
          {activeTab === "search" && debouncedQuery && (
            <Grid
              key={`search-${debouncedQuery}`}
              width={580}
              columns={3}
              gutter={8}
              fetchGifs={fetchSearch}
              onGifClick={handleGifClick}
              noLink
              hideAttribution
            />
          )}
          {activeTab === "search" && !debouncedQuery && (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <Search className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-sm">Type something to search for GIFs</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-border bg-secondary/30 flex items-center justify-between">
          <a
            href="https://giphy.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <img
              src="https://giphy.com/static/img/giphy_logo_square_social.png"
              alt="GIPHY"
              className="w-5 h-5 rounded"
            />
            Powered by GIPHY
          </a>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

// Compact inline GIF picker button component
interface GiphyButtonProps {
  onSelect: (gifUrl: string, gif: IGif) => void;
  className?: string;
  initialSearch?: string;
  buttonText?: string;
}

export function GiphyButton({
  onSelect,
  className,
  initialSearch,
  buttonText = "Add GIF",
}: GiphyButtonProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsPickerOpen(true)}
        className={clsx("gap-2", className)}
      >
        <Sparkles className="w-4 h-4" />
        {buttonText}
      </Button>
      <GiphyPicker
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelect={onSelect}
        initialSearch={initialSearch}
      />
    </>
  );
}
