import type { Metadata } from "next";
import { DM_Sans, Cormorant_Garamond, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { AppProviders } from "@/components/app-providers";
import { WebVitals } from "@/components/web-vitals";
import { BackToTop } from "@/components/back-to-top";
import { CartFlyProvider } from "@/components/cart-fly-context";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { themeScript } from "@/lib/theme-store";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "XM Store — Premium Tech, Delivered",
  description: "Discover the latest in premium tech — smartphones, audio, wearables, and more. Fast shipping across the Middle East.",
  manifest: "/manifest.json",
  keywords: ["tech", "electronics", "smartphones", "audio", "wearables", "premium", "ecommerce", "middle east"],
  authors: [{ name: "XM Store" }],
  openGraph: {
    title: "XM Store — Premium Tech, Delivered",
    description: "Discover the latest in premium tech — smartphones, audio, wearables, and more.",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();

  return (
    <html
      lang="en"
      className={`h-full antialiased ${dmSans.variable} ${cormorant.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background font-sans bg-mesh">
        <script dangerouslySetInnerHTML={{ __html: themeScript() }} />
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            <AppProviders>
              <CartFlyProvider>
                <WebVitals />
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
                <Toaster
                  position="top-center"
                  richColors
                  closeButton
                  toastOptions={{
                    className: "font-sans text-sm",
                  }}
                />
                <BackToTop />
              </CartFlyProvider>
            </AppProviders>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
