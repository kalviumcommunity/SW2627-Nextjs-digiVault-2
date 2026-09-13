"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DigiDocument } from "@/lib/types";
import { listDocuments, ListDocumentsParams } from "@/lib/api";

export function useInfiniteDocuments(params: Omit<ListDocumentsParams, "cursor">) {
  const [items, setItems] = useState<DigiDocument[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestInFlight = useRef(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const paramsKey = JSON.stringify(params);

  const loadPage = useCallback(
    async (nextCursor: string | null, replace: boolean) => {
      if (requestInFlight.current) return;
      requestInFlight.current = true;
      setError(null);
      if (replace) setInitialLoading(true);
      else setLoadingMore(true);

      try {
        const result = await listDocuments({ ...params, cursor: nextCursor });
        setItems((prev) => {
          const base = replace ? [] : prev;
          const existingIds = new Set(base.map((d) => d.id));
          const merged = [...base, ...result.items.filter((d) => !existingIds.has(d.id))];
          return merged;
        });
        setCursor(result.nextCursor);
        setHasMore(result.hasMore);
      } catch {
        setError("Couldn't load documents. Please try again.");
      } finally {
        requestInFlight.current = false;
        setInitialLoading(false);
        setLoadingMore(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [paramsKey]
  );

  // Reload from scratch whenever filter/search/sort params change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset pagination when filters change
    setItems([]);
    setCursor(null);
    setHasMore(true);
    loadPage(null, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsKey]);

  const loadMore = useCallback(() => {
    if (!hasMore || loadingMore || initialLoading || requestInFlight.current) return;
    loadPage(cursor, false);
  }, [hasMore, loadingMore, initialLoading, cursor, loadPage]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: "200px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [loadMore]);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const prependItem = useCallback((doc: DigiDocument) => {
    setItems((prev) => [doc, ...prev]);
  }, []);

  const retry = useCallback(() => {
    if (items.length === 0) loadPage(null, true);
    else loadPage(cursor, false);
  }, [items.length, cursor, loadPage]);

  return {
    items,
    hasMore,
    initialLoading,
    loadingMore,
    error,
    sentinelRef,
    removeItem,
    prependItem,
    retry,
  };
}
