import { Store } from "lucide-react";

export default function RootLoading() {
  return (
    <div className="flex h-[60vh] flex-col items-center justify-center gap-6">
      <div className="relative">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30 blur-xl animate-pulse" />
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent">
          <Store className="h-7 w-7 text-white" />
        </div>
      </div>
      <div className="flex flex-col items-center gap-3">
        <div className="h-1.5 w-32 rounded-full bg-muted overflow-hidden">
          <div className="h-full w-full bg-gradient-to-r from-primary to-accent animate-[shimmer_1.5s_infinite] -translate-x-full" />
        </div>
        <p className="text-sm text-muted-foreground animate-pulse">加载中...</p>
      </div>
    </div>
  );
}
