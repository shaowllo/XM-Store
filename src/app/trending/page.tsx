import type { Metadata } from "next";
import { Breadcrumb } from "@/components/breadcrumb";
import { TrendingContent } from "./trending-content";

export const metadata: Metadata = {
  title: "Trending | XM Store",
  description: "Most popular products at XM Store — top rated and most reviewed",
};

export default function TrendingPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <Breadcrumb items={[{ label: "Trending" }]} />
      <TrendingContent />
    </div>
  );
}
