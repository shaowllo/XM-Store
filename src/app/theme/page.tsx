import type { Metadata } from "next";
import { Breadcrumb } from "@/components/breadcrumb";
import { ThemeStudio } from "@/components/theme-studio";

export const metadata: Metadata = {
  title: "Theme Studio | XM Store",
  description: "Customize your store theme — colors, border radius, and more",
};

export default function ThemePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <Breadcrumb items={[{ label: "Theme Studio" }]} />
      <ThemeStudio />
    </div>
  );
}
