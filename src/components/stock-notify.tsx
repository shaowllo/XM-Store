"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface StockNotifyProps {
  productName: string;
}

export function StockNotify({ productName }: StockNotifyProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    toast.success(`We'll notify you when ${productName} is back in stock`);
    setTimeout(() => {
      setOpen(false);
      setSubmitted(false);
      setEmail("");
    }, 2000);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors mt-3"
      >
        <Bell className="h-3.5 w-3.5" />
        Notify me when available
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => !submitted && setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="rounded-2xl border bg-card p-6 max-w-sm w-full mx-4 shadow-2xl"
            >
              {submitted ? (
                <div className="text-center py-4">
                  <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <Check className="h-6 w-6 text-primary" />
                  </div>
                  <p className="font-semibold">You&apos;re on the list!</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    We&apos;ll email you when {productName} is back.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-primary" />
                      <h3 className="text-sm font-semibold">Stock Notification</h3>
                    </div>
                    <button
                      onClick={() => setOpen(false)}
                      className="h-6 w-6 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">
                    Get notified when <span className="font-medium text-foreground">{productName}</span> is back in stock.
                  </p>
                  <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="flex-1 rounded-xl border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
                    />
                    <Button type="submit" size="sm" className="rounded-full">
                      Notify
                    </Button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
