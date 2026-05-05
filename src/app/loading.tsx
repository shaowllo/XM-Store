import { Store } from "lucide-react";

export default function RootLoading() {
  return (
    <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
        <Store className="h-6 w-6 animate-pulse text-primary" />
      </div>
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      <p className="text-sm text-muted-foreground">加载中...</p>
    </div>
  );
}
