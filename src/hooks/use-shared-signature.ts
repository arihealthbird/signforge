"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  SharedSignatureData, 
  getSharedDataFromUrl, 
  clearShareFromUrl 
} from "@/lib/share";

export interface UseSharedSignatureResult {
  /** Shared data if present in URL */
  sharedData: SharedSignatureData | null;
  /** Whether we're currently loading/checking the URL */
  isLoading: boolean;
  /** Whether a shared template is active */
  isSharedTemplate: boolean;
  /** Clear the shared template state and URL param */
  clearShared: () => void;
  /** Mark the shared data as "used" (user has started editing) */
  markAsUsed: () => void;
  /** Whether the user has started customizing the shared template */
  hasBeenCustomized: boolean;
}

/**
 * Hook to detect and manage shared signature data from URL
 * 
 * Usage:
 * ```tsx
 * const { sharedData, isSharedTemplate, clearShared } = useSharedSignature();
 * 
 * useEffect(() => {
 *   if (sharedData) {
 *     setSignatureData(sharedData.s);
 *     setSelectedTemplate(sharedData.t);
 *   }
 * }, [sharedData]);
 * ```
 */
export function useSharedSignature(): UseSharedSignatureResult {
  const [sharedData, setSharedData] = useState<SharedSignatureData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasBeenCustomized, setHasBeenCustomized] = useState(false);

  // Check URL for shared data on mount
  useEffect(() => {
    const data = getSharedDataFromUrl();
    if (data) {
      setSharedData(data);
    }
    setIsLoading(false);
  }, []);

  const clearShared = useCallback(() => {
    setSharedData(null);
    setHasBeenCustomized(false);
    clearShareFromUrl();
  }, []);

  const markAsUsed = useCallback(() => {
    setHasBeenCustomized(true);
    // Clear URL param but keep the state for the banner
    clearShareFromUrl();
  }, []);

  return {
    sharedData,
    isLoading,
    isSharedTemplate: sharedData !== null,
    clearShared,
    markAsUsed,
    hasBeenCustomized,
  };
}
