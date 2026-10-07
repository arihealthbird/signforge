"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Chip, cn } from "@/components/ui";
import { Icon } from "@/components/icons";

/**
 * GIPHY support, brought back from the original SignForge but rebuilt on the
 * plain REST API (no SDK packages). It is enabled only when
 * NEXT_PUBLIC_GIPHY_API_KEY is set; GIPHY keys are designed to be public.
 * Results are filtered to the "g" rating because these end up in work email.
 */

export const GIPHY_KEY = process.env.NEXT_PUBLIC_GIPHY_API_KEY ?? "";
export const giphyEnabled = GIPHY_KEY.length > 0;

export interface GiphyGif {
  id: string;
  title: string;
  /** Small animated preview for the grid. */
  preview: string;
  previewW: number;
  previewH: number;
  /** The GIF that goes into the signature. */
  url: string;
}

interface RawImage {
  url?: string;
  width?: string;
  height?: string;
}
interface RawGif {
  id: string;
  title?: string;
  images?: Record<string, RawImage | undefined>;
}

/** Drops GIPHY's tracking query string; the media URL works without it. */
function cleanUrl(url: string): string {
  return url.split("?")[0];
}

function toGif(raw: RawGif): GiphyGif | null {
  const preview = raw.images?.fixed_width ?? raw.images?.fixed_height ?? raw.images?.original;
  // `downsized` keeps the file small enough for an email signature.
  const full = raw.images?.downsized ?? raw.images?.original ?? preview;
  if (!preview?.url || !full?.url) return null;
  return {
    id: raw.id,
    title: raw.title || "GIF",
    preview: preview.url,
    previewW: Number(preview.width) || 200,
    previewH: Number(preview.height) || 150,
    url: cleanUrl(full.url),
  };
}

export async function fetchGifs({
  query,
  offset = 0,
  limit = 24,
  signal,
}: {
  query: string;
  offset?: number;
  limit?: number;
  signal?: AbortSignal;
}): Promise<{ gifs: GiphyGif[]; total: number }> {
  const q = query.trim();
  const params = new URLSearchParams({
    api_key: GIPHY_KEY,
    limit: String(limit),
    offset: String(offset),
    rating: "g",
    lang: "en",
  });
  if (q) params.set("q", q);
  const res = await fetch(`https://api.giphy.com/v1/gifs/${q ? "search" : "trending"}?${params}`, {
    signal,
  });
  if (!res.ok) {
    throw new Error(
      res.status === 429
        ? "GIPHY is rate limiting this key. Try again in a little while."
        : "Couldn't reach GIPHY right now."
    );
  }
  const json = (await res.json()) as { data?: RawGif[]; pagination?: { total_count?: number } };
  const gifs = (json.data ?? []).map(toGif).filter((g): g is GiphyGif => g !== null);
  return { gifs, total: json.pagination?.total_count ?? gifs.length };
}

const QUICK_SEARCHES = ["thank you", "wave", "celebrate", "typing", "coffee", "high five", "mind blown", "rocket"];

interface Loaded {
  key: string;
  gifs: GiphyGif[];
  total: number;
  error?: string;
}

/* ── Picker modal ─────────────────────────────────────────────────────── */

export function GiphyPicker({
  open,
  onClose,
  onPick,
  initialQuery = "",
}: {
  open: boolean;
  onClose: () => void;
  onPick: (gif: GiphyGif) => void;
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [debounced, setDebounced] = useState(initialQuery);
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const key = debounced.trim().toLowerCase();
  const loading = !loaded || loaded.key !== key;

  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(query), 320);
    return () => window.clearTimeout(id);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const ctrl = new AbortController();
    fetchGifs({ query: key, signal: ctrl.signal })
      .then(({ gifs, total }) => setLoaded({ key, gifs, total }))
      .catch((e: unknown) => {
        if (ctrl.signal.aborted) return;
        setLoaded({
          key,
          gifs: [],
          total: 0,
          error: e instanceof Error ? e.message : "Something went wrong.",
        });
      });
    return () => ctrl.abort();
  }, [open, key]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 60);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
      window.clearTimeout(focusTimer);
    };
  }, [open, onClose]);

  const loadMore = async () => {
    if (!loaded || loadingMore) return;
    setLoadingMore(true);
    try {
      const { gifs } = await fetchGifs({ query: key, offset: loaded.gifs.length });
      setLoaded((prev) =>
        prev && prev.key === key
          ? { ...prev, gifs: [...prev.gifs, ...gifs.filter((g) => !prev.gifs.some((p) => p.id === g.id))] }
          : prev
      );
    } catch {
      // Keep what we have; the user can retry.
    } finally {
      setLoadingMore(false);
    }
  };

  if (!open) return null;

  const gifs = loaded && loaded.key === key ? loaded.gifs : [];
  const hasMore = loaded && loaded.key === key && !loaded.error && loaded.gifs.length < loaded.total;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Choose a GIF"
    >
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 animate-fade-in bg-black/55 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative flex max-h-[90vh] w-full max-w-3xl animate-pop flex-col overflow-hidden border-2 border-ink bg-paper shadow-[8px_8px_0_var(--neon)]">
        <div className="flex items-start justify-between gap-4 px-6 pb-3 pt-5">
          <div>
            <h2 className="mono-label text-ink">Add a GIF</h2>
            <p className="mt-2 text-xs text-muted">
              An animated banner under your signature. Family-friendly results only.
            </p>
          </div>
          <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close">
            <Icon name="x" size="sm" />
          </Button>
        </div>

        <div className="px-6 pb-3">
          <div className="relative">
            <Icon
              name="search"
              size="sm"
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search GIPHY"
              aria-label="Search GIPHY"
              className="h-11 w-full border border-line bg-paper pl-10 pr-4 text-sm text-ink outline-none transition-[border-color,box-shadow] placeholder:text-muted/70 focus:border-ink focus:shadow-[3px_3px_0_var(--neon)]"
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {QUICK_SEARCHES.map((s) => (
              <Chip
                key={s}
                className={cn("py-1", query.toLowerCase() === s && "border-ink bg-paper-soft")}
                onClick={() => {
                  setQuery(s);
                  setDebounced(s);
                }}
              >
                {s}
              </Chip>
            ))}
          </div>
        </div>

        <div className="min-h-[300px] flex-1 overflow-y-auto px-6 pb-4">
          {loading ? (
            <div className="columns-2 gap-2 sm:columns-3">
              {Array.from({ length: 9 }, (_, i) => (
                <div
                  key={i}
                  className="sf-shimmer mb-2 bg-ink/[0.06]"
                  style={{ height: 90 + ((i * 37) % 70) }}
                />
              ))}
            </div>
          ) : loaded?.error ? (
            <p className="py-16 text-center text-sm text-muted">{loaded.error}</p>
          ) : gifs.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted">No GIFs found. Try a different search.</p>
          ) : (
            <>
              <div className="columns-2 gap-2 sm:columns-3">
                {gifs.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => onPick(g)}
                    title={g.title}
                    className="group relative mb-2 block w-full overflow-hidden bg-ink/[0.06] outline-none focus-visible:ring-2 focus-visible:ring-ink"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={g.preview}
                      alt={g.title}
                      loading="lazy"
                      width={g.previewW}
                      height={g.previewH}
                      className="block h-auto w-full"
                    />
                    <span className="absolute inset-0 ring-0 ring-inset ring-neon transition-all group-hover:ring-4" />
                  </button>
                ))}
              </div>
              {hasMore ? (
                <div className="flex justify-center pt-2">
                  <Button variant="soft" size="sm" onClick={loadMore} loading={loadingMore}>
                    Load more
                  </Button>
                </div>
              ) : null}
            </>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line bg-paper-soft px-6 py-3 text-xs text-muted">
          <a
            href="https://giphy.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mono-label hover:text-ink"
          >
            Powered by GIPHY
          </a>
          <span>Outlook for Windows shows only the first frame of a GIF.</span>
        </div>
      </div>
    </div>
  );
}

/* ── Inline suggestions (used by the chat when the AI asks for a GIF) ─── */

export function GifSuggestions({
  query,
  onPick,
  onMore,
}: {
  query: string;
  onPick: (gif: GiphyGif) => void;
  onMore: () => void;
}) {
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const key = query.trim().toLowerCase();
  const loading = !loaded || loaded.key !== key;

  useEffect(() => {
    const ctrl = new AbortController();
    fetchGifs({ query: key, limit: 8, signal: ctrl.signal })
      .then(({ gifs, total }) => setLoaded({ key, gifs, total }))
      .catch((e: unknown) => {
        if (ctrl.signal.aborted) return;
        setLoaded({ key, gifs: [], total: 0, error: e instanceof Error ? e.message : "error" });
      });
    return () => ctrl.abort();
  }, [key]);

  if (!loading && (loaded?.error || loaded?.gifs.length === 0)) return null;

  return (
    <div className="mt-3 border border-line bg-paper p-2.5">
      <div className="mb-2 flex items-center justify-between px-1">
        <span className="mono-label inline-flex items-center gap-1.5 text-muted">
          <Icon name="sparkles" size="xs" />
          GIFs for &ldquo;{query}&rdquo;
        </span>
        <button
          type="button"
          onClick={onMore}
          className="text-xs font-medium text-ink underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
        >
          More
        </button>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {loading
          ? Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="sf-shimmer h-20 w-28 shrink-0 bg-ink/[0.06]" />
            ))
          : loaded?.gifs.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => onPick(g)}
                title={g.title}
                className="group relative h-20 shrink-0 overflow-hidden bg-ink/[0.06] outline-none focus-visible:ring-2 focus-visible:ring-ink"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g.preview} alt={g.title} loading="lazy" className="h-full w-auto" />
                <span className="absolute inset-0 ring-0 ring-inset ring-neon transition-all group-hover:ring-2" />
              </button>
            ))}
        {loading ? <Icon name="loader" size="sm" className="my-auto shrink-0 animate-spin text-muted" /> : null}
      </div>
    </div>
  );
}
