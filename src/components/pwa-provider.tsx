"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

interface PwaContextType {
  /** Whether the app is currently online. */
  isOnline: boolean;
  /** Whether a new SW version is waiting to activate. */
  updateAvailable: boolean;
  /** Trigger update: post SKIP_WAITING to SW, then reload. */
  applyUpdate: () => void;
  /** Whether the beforeinstallprompt event has fired (app can be installed). */
  canInstall: boolean;
  /** Trigger the install prompt. */
  promptInstall: () => void;
}

const PwaContext = createContext<PwaContextType | undefined>(undefined);

export function PwaProvider({ children }: { children: ReactNode }) {
  const [isOnline, setIsOnline] = useState(true);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Track online status
  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Register Service Worker
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          // Check for updates on page load
          registration.update();

          // Detect SW update waiting
          if (registration.waiting) {
            setUpdateAvailable(true);
          }

          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                  setUpdateAvailable(true);
                }
              });
            }
          });
        })
        .catch(() => {
          // SW registration failed silently (e.g., no HTTPS in dev)
        });

      // Listen for controller change (after SW takes over)
      let refreshing = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    }
  }, []);

  // Listen for beforeinstallprompt
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const applyUpdate = useCallback(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        if (registration.waiting) {
          registration.waiting.postMessage({ type: "SKIP_WAITING" });
        }
      });
    }
  }, []);

  const promptInstall = useCallback(() => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => {
        setDeferredPrompt(null);
        setCanInstall(false);
      });
    }
  }, [deferredPrompt]);

  return (
    <PwaContext.Provider value={{ isOnline, updateAvailable, applyUpdate, canInstall, promptInstall }}>
      {children}
    </PwaContext.Provider>
  );
}

export function usePwa() {
  const context = useContext(PwaContext);
  if (!context) {
    throw new Error("usePwa must be used within a PwaProvider");
  }
  return context;
}
