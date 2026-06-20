import type { Metadata } from "next";
import { Suspense } from "react";
import { Breadcrumb } from "@/components/breadcrumb";
import { ProductsContent } from "./products-content";
import { CompareBar } from "@/components/compare-bar";

export const metadata: Metadata = {
  title: "全部产品 | XM Store",
  description: "探索 XM Store 全系列科技数码产品，包括手机、音频、穿戴设备、电脑和智能家居",
};

export default function ProductsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <Breadcrumb items={[{ label: "全部产品" }]} />
      <Suspense fallback={<div className="py-20 text-center">加载中...</div>}>
        <ProductsContent />
      </Suspense>
      <CompareBar />
    </div>
  );
}
