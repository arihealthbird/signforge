"use client";

import { useEffect, useSyncExternalStore } from "react";
import { NO_CAPABILITIES, type Capabilities } from "@/lib/capabilities";

/**
 * A tiny external store holding the answer from `/api/capabilities`. It is
 * fetched once per page load and shared by every composer on the page. Until
 * the server answers, and when it cannot be reached, everything optional stays
 * hidden, so the first render is identical on the server and in the browser.
 */

type Listener = () => void;

let current: Capabilities | null = null;
let request: Promise<void> | null = null;
const listeners = new Set<Listener>();

export const capabilitiesStore = {
  get: (): Capabilities | null => current,

  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  /** Fetches the flags once. A failed attempt is retried by the next caller. */
  load(): Promise<void> {
    if (current || request) return request ?? Promise.resolve();
    request = fetch("/api/capabilities", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("bad status"))))
      .then((json: Partial<Capabilities> | null) => {
        current = { voice: json?.voice === true, images: json?.images === true };
        listeners.forEach((listener) => listener());
      })
      .catch(() => {
        request = null;
      });
    return request;
  },

  /** Forgets everything. For tests. */
  reset() {
    current = null;
    request = null;
  },
};

/** The optional features this deployment offers. Both are false until known. */
export function useCapabilities(): Capabilities {
  const known = useSyncExternalStore(capabilitiesStore.subscribe, capabilitiesStore.get, () => null);

  useEffect(() => {
    void capabilitiesStore.load();
  }, []);

  return known ?? NO_CAPABILITIES;
}
