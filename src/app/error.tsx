"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-6">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>
      <h2 className="text-2xl font-bold">出了点问题</h2>
      <p className="mt-2 text-sm text-muted-foreground text-center max-w-md">
        应用遇到了一个意外错误，请尝试刷新页面或返回首页
      </p>
      <div className="mt-6 flex gap-3">
        <Button onClick={reset} className="rounded-full">
          重试
        </Button>
        <Button variant="outline" onClick={() => (window.location.href = "/")} className="rounded-full">
          返回首页
        </Button>
      </div>
    </div>
  );
}
