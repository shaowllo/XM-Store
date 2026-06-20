"use client";

import { useSyncExternalStore, useCallback, useRef } from "react";

/**
 * Hydration-safe localStorage hook using useSyncExternalStore.
 *
 * Eliminates the setTimeout-based hydration flicker and SSR mismatch
 * warnings by subscribing to localStorage as an external store.
 */
export function useLocalStorage<T>(key: string, defaultValue: T) {
  const defaultValueRef = useRef(defaultValue);

  // Cache the last raw string + parsed value so we return the same object
  // reference when localStorage hasn't changed (avoids infinite re-renders).
  const cacheRef = useRef<{ raw: string | null; parsed: T }>({
    raw: null,
    parsed: defaultValue,
  });

  const getSnapshot = useCallback((): T => {
    try {
      const raw = localStorage.getItem(key);
      // Return cached reference if raw value hasn't changed
      if (raw === cacheRef.current.raw) return cacheRef.current.parsed;
      if (raw === null) {
        cacheRef.current = { raw: null, parsed: defaultValueRef.current };
        return defaultValueRef.current;
      }
      const parsed = JSON.parse(raw) as T;
      cacheRef.current = { raw, parsed };
      return parsed;
    } catch {
      return defaultValueRef.current;
    }
  }, [key]);

  const subscribe = useCallback(
    (callback: () => void) => {
      const handler = (e: StorageEvent) => {
        if (e.key === key) callback();
      };
      window.addEventListener("storage", handler);
      return () => window.removeEventListener("storage", handler);
    },
    [key]
  );

  const value = useSyncExternalStore(
    subscribe,
    getSnapshot,
    // Server/SSR snapshot — always returns the default
    () => defaultValueRef.current
  );

  const setValue = useCallback(
    (updater: T | ((prev: T) => T)) => {
      const prev = getSnapshot();
      const next = typeof updater === "function" ? (updater as (prev: T) => T)(prev) : updater;
      localStorage.setItem(key, JSON.stringify(next));
      // Dispatch a storage event so useSyncExternalStore picks up the change
      // in the same window (native storage events only fire across tabs).
      window.dispatchEvent(new StorageEvent("storage", { key }));
    },
    [key, getSnapshot]
  );

  const reset = useCallback(() => {
    setValue(defaultValueRef.current);
  }, [setValue]);

  return [value, setValue, reset] as const;
}
