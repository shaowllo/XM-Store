import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CartProvider } from "@/components/cart-provider";
import { WishlistProvider } from "@/components/wishlist-provider";
import { OrderProvider } from "@/components/order-provider";
import { UserProvider } from "@/components/user-provider";
import { AddressProvider } from "@/components/address-provider";
import { CouponProvider } from "@/components/coupon-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { WebVitals } from "@/components/web-vitals";
import { BackToTop } from "@/components/back-to-top";

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
          <UserProvider>
            <AddressProvider>
              <CouponProvider>
                <CartProvider>
                  <WishlistProvider>
                    <OrderProvider>
                      <WebVitals />
                      <Navbar />
                      <main className="flex-1">{children}</main>
                      <Footer />
                      <Toaster position="top-center" richColors closeButton />
                      <BackToTop />
                    </OrderProvider>
                  </WishlistProvider>
                </CartProvider>
              </CouponProvider>
            </AddressProvider>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
