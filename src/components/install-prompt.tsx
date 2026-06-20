"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X } from "lucide-react";
import { usePwa } from "./pwa-provider";

/**
 * Floating install prompt — shown when the browser fires beforeinstallprompt.
 * Allows the user to add the app to their home screen.
 */
export function InstallPrompt() {
  const { canInstall, promptInstall } = usePwa();
  const [dismissed, setDismissed] = useState(false);

  return (
    <AnimatePresence>
      {canInstall && !dismissed && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm"
        >
          <div className="rounded-2xl border bg-background/95 backdrop-blur-xl p-4 shadow-2xl shadow-foreground/5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Download className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">Install XM Store</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Add to your home screen for the best experience
                </p>
              </div>
              <button
                onClick={() => setDismissed(true)}
                className="shrink-0 flex h-6 w-6 items-center justify-center rounded-full hover:bg-muted transition-colors"
                aria-label="Dismiss"
              >
                <X className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </div>
            <button
              onClick={promptInstall}
              className="mt-3 w-full rounded-xl bg-foreground py-2.5 text-sm font-semibold text-background hover:opacity-90 transition-opacity"
            >
              Add to Home Screen
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
