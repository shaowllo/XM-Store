import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { AppProviders } from "@/components/app-providers";
import { WebVitals } from "@/components/web-vitals";
import { BackToTop } from "@/components/back-to-top";
import { CartFlyProvider } from "@/components/cart-fly-context";
import { PetalFall } from "@/components/petal-fall";

export const metadata: Metadata = {
  title: "XM Store - 科技数码精选",
  description: "探索最新科技数码产品，品质生活从这里开始",
  manifest: "/manifest.json",
  keywords: ["科技", "数码", "手机", "耳机", "智能手表", "电脑", "电商"],
  authors: [{ name: "XM Store" }],
  openGraph: {
    title: "XM Store - 科技数码精选",
    description: "探索最新科技数码产品，品质生活从这里开始",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-background font-sans">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AppProviders>
            <CartFlyProvider>
              <WebVitals />
              <PetalFall />
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
              <Toaster position="top-center" richColors closeButton />
              <BackToTop />
            </CartFlyProvider>
          </AppProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
