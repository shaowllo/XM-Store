import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-6">
        <FileQuestion className="h-8 w-8 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-bold">页面未找到</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        您访问的页面不存在或已被移除
      </p>
      <Link href="/" className="mt-6">
        <Button className="rounded-full">返回首页</Button>
      </Link>
    </div>
  );
}
