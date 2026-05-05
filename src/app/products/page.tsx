import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "全部产品 | XM Store",
  description: "探索 XM Store 全系列科技数码产品，包括手机、音频、穿戴设备、电脑和智能家居",
};

import { Suspense } from "react";
import { ProductsContent } from "./products-content";

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-20 text-center">加载中...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
