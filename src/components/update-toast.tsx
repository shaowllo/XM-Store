"use client";

import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { usePwa } from "./pwa-provider";

/**
 * Toast shown when a new Service Worker version is available.
 * User can click to apply the update (reloads the page).
 */
export function UpdateToast() {
  const { updateAvailable, applyUpdate } = usePwa();

  return (
    <AnimatePresence>
      {updateAvailable && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="fixed bottom-6 right-6 z-50 max-w-sm"
        >
          <div className="rounded-2xl border bg-card shadow-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 shrink-0">
                <RefreshCw className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">Update Available</p>
                <p className="text-xs text-muted-foreground">
                  A new version is ready
                </p>
              </div>
              <button
                onClick={applyUpdate}
                className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity shrink-0"
              >
                Reload
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
