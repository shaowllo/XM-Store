"use client";

import { Button } from "@/components/ui/button";

export default function RootError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold">出错了</h2>
      <p className="text-muted-foreground">{error.message || "页面加载失败"}</p>
      <Button onClick={reset}>重试</Button>
    </div>
  );
}
