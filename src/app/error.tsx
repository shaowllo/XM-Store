"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("error");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-6">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>
      <h2 className="text-2xl font-bold">{t("title")}</h2>
      <p className="mt-2 text-sm text-muted-foreground text-center max-w-md">
        {t("description")}
      </p>
      <div className="mt-6 flex gap-3">
        <Button onClick={reset} className="rounded-full">
          {t("retry")}
        </Button>
        <Button variant="outline" onClick={() => (window.location.href = "/")} className="rounded-full">
          {t("goHome")}
        </Button>
      </div>
    </div>
  );
}
