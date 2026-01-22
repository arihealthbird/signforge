"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { EmailThemeId } from "@/lib/email-themes";
import { getThemeVisuals, themeVisuals } from "@/lib/theme-visuals";

interface VideoBackgroundProps {
  themeId: EmailThemeId;
  className?: string;
}

// Video cache to preload and store video elements
type VideoState = "idle" | "loading" | "loaded" | "error";

interface CachedVideo {
  url: string;
  state: VideoState;
  blob?: Blob;
  objectUrl?: string;
  retryCount: number;
}

const videoCache = new Map<string, CachedVideo>();
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

// Preload a single video URL
async function preloadVideo(url: string): Promise<Blob> {
  const response = await fetch(url, {
    mode: "cors",
    credentials: "same-origin",
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch video: ${response.status}`);
  }
  return await response.blob();
}

// Get or create cached video
async function getCachedVideo(url: string): Promise<string | null> {
  const cached = videoCache.get(url);
  
  if (cached?.objectUrl && cached.state === "loaded") {
    return cached.objectUrl;
  }
  
  if (cached?.state === "loading") {
    // Wait for existing load to complete
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        const current = videoCache.get(url);
        if (current?.state === "loaded" && current.objectUrl) {
          clearInterval(checkInterval);
          resolve(current.objectUrl);
        } else if (current?.state === "error") {
          clearInterval(checkInterval);
          resolve(null);
        }
      }, 100);
      // Timeout after 30s
      setTimeout(() => {
        clearInterval(checkInterval);
        resolve(null);
      }, 30000);
    });
  }
  
  // Start loading
  videoCache.set(url, { url, state: "loading", retryCount: 0 });
  
  try {
    const blob = await preloadVideo(url);
    const objectUrl = URL.createObjectURL(blob);
    videoCache.set(url, { url, state: "loaded", blob, objectUrl, retryCount: 0 });
    return objectUrl;
  } catch {
    const current = videoCache.get(url);
    const retryCount = (current?.retryCount || 0) + 1;
    
    if (retryCount < MAX_RETRIES) {
      videoCache.set(url, { url, state: "idle", retryCount });
      // Retry after delay
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY * retryCount));
      return getCachedVideo(url);
    }
    
    videoCache.set(url, { url, state: "error", retryCount });
    return null;
  }
}

// Preload all theme videos in the background
function preloadAllThemeVideos() {
  const themeIds = Object.keys(themeVisuals) as EmailThemeId[];
  
  // Use requestIdleCallback for non-blocking preload
  const preloadNext = (index: number) => {
    if (index >= themeIds.length) return;
    
    const themeId = themeIds[index];
    const visuals = getThemeVisuals(themeId);
    
    if (visuals.videoUrl && !videoCache.has(visuals.videoUrl)) {
      // Low priority preload
      getCachedVideo(visuals.videoUrl).then(() => {
        // Continue to next after small delay to avoid overwhelming
        setTimeout(() => preloadNext(index + 1), 500);
      });
    } else {
      preloadNext(index + 1);
    }
  };
  
  // Start preloading after a delay to not block initial render
  if (typeof window !== "undefined") {
    if ("requestIdleCallback" in window) {
      (window as Window & { requestIdleCallback: (cb: () => void) => void })
        .requestIdleCallback(() => preloadNext(0));
    } else {
      setTimeout(() => preloadNext(0), 2000);
    }
  }
}

// Track if we've started preloading
let preloadStarted = false;

export function VideoBackground({ themeId, className }: VideoBackgroundProps) {
  const [mounted, setMounted] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [loadState, setLoadState] = useState<VideoState>("idle");
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const visuals = getThemeVisuals(themeId);

  // Start preloading all videos on first mount
  useEffect(() => {
    setMounted(true);
    if (!preloadStarted) {
      preloadStarted = true;
      preloadAllThemeVideos();
    }
  }, []);

  // Load current theme's video
  useEffect(() => {
    if (!mounted || !visuals.videoUrl) return;
    
    let cancelled = false;
    setLoadState("loading");
    
    getCachedVideo(visuals.videoUrl).then((objectUrl) => {
      if (cancelled) return;
      
      if (objectUrl) {
        setVideoSrc(objectUrl);
        setLoadState("loaded");
      } else {
        // Fallback to direct URL if caching fails
        setVideoSrc(visuals.videoUrl!);
        setLoadState("loaded");
      }
    });
    
    return () => {
      cancelled = true;
    };
  }, [mounted, themeId, visuals.videoUrl]);

  // Intersection observer for performance - pause when not visible
  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [mounted]);

  // Play/pause based on visibility
  useEffect(() => {
    if (!videoRef.current) return;
    
    if (isVisible && loadState === "loaded") {
      videoRef.current.play().catch(() => {
        // Autoplay might be blocked, that's okay
      });
    } else {
      videoRef.current.pause();
    }
  }, [isVisible, loadState]);

  // Handle video element errors with retry
  const handleError = useCallback(() => {
    if (!visuals.videoUrl) return;
    
    const cached = videoCache.get(visuals.videoUrl);
    if (cached && cached.retryCount < MAX_RETRIES) {
      // Reset cache and retry
      videoCache.delete(visuals.videoUrl);
      setLoadState("loading");
      getCachedVideo(visuals.videoUrl).then((objectUrl) => {
        if (objectUrl) {
          setVideoSrc(objectUrl);
          setLoadState("loaded");
        } else {
          setLoadState("error");
        }
      });
    } else {
      setLoadState("error");
    }
  }, [visuals.videoUrl]);

  // Don't render if no video URL or not mounted
  if (!mounted || !visuals.videoUrl) {
    return null;
  }

  // Gracefully hide on error instead of removing from DOM
  const showVideo = loadState === "loaded" && videoSrc;

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        opacity: showVideo ? (visuals.videoOpacity || 0.2) : 0,
        transition: "opacity 0.8s ease-in-out",
      }}
    >
      {videoSrc && (
        <video
          ref={videoRef}
          key={videoSrc} // Force new element when source changes
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onCanPlayThrough={() => setLoadState("loaded")}
          onError={handleError}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            mixBlendMode: visuals.videoBlendMode || "screen",
            filter: visuals.videoFilter || "none",
          }}
        >
          <source src={videoSrc} type="video/mp4" />
          {/* Fallback for WebM */}
          {visuals.videoUrlWebm && (
            <source src={visuals.videoUrlWebm} type="video/webm" />
          )}
        </video>
      )}
      
      {/* Loading placeholder - subtle pulse */}
      {loadState === "loading" && (
        <div 
          className="absolute inset-0 animate-pulse"
          style={{
            backgroundColor: "rgba(0,0,0,0.1)",
          }}
        />
      )}
    </div>
  );
}
