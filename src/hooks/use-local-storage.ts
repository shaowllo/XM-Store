"use client";

import { useState, useEffect, useCallback } from "react";
import { getStorageItem, setStorageItem } from "@/lib/storage";

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => getStorageItem(key, defaultValue));

  useEffect(() => {
    setStorageItem(key, value);
  }, [key, value]);

  const reset = useCallback(() => {
    setValue(defaultValue);
  }, [defaultValue]);

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

  return [value, setValueWrapper, reset] as const;
}
