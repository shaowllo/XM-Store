"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getStorageItem, setStorageItem } from "@/lib/storage";

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [value, setValue] = useState<T>(defaultValue);
  const defaultValueRef = useRef(defaultValue);

  useEffect(() => {
    const init = () => {
      try {
        const saved = getStorageItem<T>(key, defaultValueRef.current);
        setValue(saved);
      } catch {
        setValue(defaultValueRef.current);
      }
      setIsHydrated(true);
    };
    const timer = setTimeout(init, 0);
    return () => clearTimeout(timer);
  }, [key]);

  useEffect(() => {
    if (isHydrated) {
      setStorageItem(key, value);
    }
  }, [key, value, isHydrated]);

  const reset = useCallback(() => {
    setValue(defaultValueRef.current);
  }, []);

  const setValueWrapper = useCallback(
    (updater: T | ((prev: T) => T)) => {
      setValue((prev) => {
        if (typeof updater === "function") {
          return (updater as (prev: T) => T)(prev);
        }
        return updater;
      });
    },
    []
  );

  return [value, setValueWrapper, reset, isHydrated] as const;
}
