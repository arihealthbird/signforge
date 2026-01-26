"use client";

import { useState, useEffect } from "react";

export type LayoutMode = "mobile" | "tablet" | "desktop";

export interface ResponsiveState {
  layoutMode: LayoutMode;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  width: number;
  mounted: boolean;
}

// Breakpoints - adjusted for better 3-panel layout support
// Desktop requires enough space for 3 panels to not feel cramped
const BREAKPOINTS = {
  mobile: 0,
  tablet: 768,  // md - single column with drawers
  desktop: 1280, // xl - full 3-panel layout (was 1024, now needs more space)
} as const;

/**
 * Hook to detect responsive layout mode
 * Uses window.matchMedia for efficient media query detection
 */
export function useResponsive(): ResponsiveState {
  // Always start with desktop for SSR to ensure consistent hydration
  const [state, setState] = useState<ResponsiveState>({
    layoutMode: "desktop",
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    width: 1200,
    mounted: false,
  });

  useEffect(() => {
    // Set initial client state with mounted: true
    const initialState = getResponsiveState();
    setState({ ...initialState, mounted: true });

    // Create media queries
    const mobileQuery = window.matchMedia(`(max-width: ${BREAKPOINTS.tablet - 1}px)`);
    const tabletQuery = window.matchMedia(
      `(min-width: ${BREAKPOINTS.tablet}px) and (max-width: ${BREAKPOINTS.desktop - 1}px)`
    );
    const desktopQuery = window.matchMedia(`(min-width: ${BREAKPOINTS.desktop}px)`);

    const handleChange = () => {
      setState({ ...getResponsiveState(), mounted: true });
    };

    // Modern API with fallback
    if (mobileQuery.addEventListener) {
      mobileQuery.addEventListener("change", handleChange);
      tabletQuery.addEventListener("change", handleChange);
      desktopQuery.addEventListener("change", handleChange);
    } else {
      // Fallback for older browsers
      mobileQuery.addListener(handleChange);
      tabletQuery.addListener(handleChange);
      desktopQuery.addListener(handleChange);
    }

    // Also listen to resize for width updates
    window.addEventListener("resize", handleChange);

    return () => {
      if (mobileQuery.removeEventListener) {
        mobileQuery.removeEventListener("change", handleChange);
        tabletQuery.removeEventListener("change", handleChange);
        desktopQuery.removeEventListener("change", handleChange);
      } else {
        mobileQuery.removeListener(handleChange);
        tabletQuery.removeListener(handleChange);
        desktopQuery.removeListener(handleChange);
      }
      window.removeEventListener("resize", handleChange);
    };
  }, []);

  return state;
}

function getResponsiveState(): ResponsiveState {
  const width = typeof window !== "undefined" ? window.innerWidth : 1200;
  
  let layoutMode: LayoutMode;
  if (width < BREAKPOINTS.tablet) {
    layoutMode = "mobile";
  } else if (width < BREAKPOINTS.desktop) {
    layoutMode = "tablet";
  } else {
    layoutMode = "desktop";
  }

  return {
    layoutMode,
    isMobile: layoutMode === "mobile",
    isTablet: layoutMode === "tablet",
    isDesktop: layoutMode === "desktop",
    width,
    mounted: false, // Will be overridden by caller
  };
}

/**
 * Export breakpoints for use in other components
 */
export { BREAKPOINTS };
