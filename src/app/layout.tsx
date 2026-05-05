import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CartProvider } from "@/components/cart-provider";
import { WishlistProvider } from "@/components/wishlist-provider";
import { OrderProvider } from "@/components/order-provider";

export const metadata: Metadata = {
  title: "XM Store - 科技数码精选",
  description: "探索最新科技数码产品，品质生活从这里开始",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background font-sans">
        <CartProvider>
          <WishlistProvider>
            <OrderProvider>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </OrderProvider>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
