import type { Metadata } from "next";
import Image from "next/image";
import { Zap, Code2, Palette, Box, Sparkles, Globe, Smartphone, TestTube } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About | XM Store",
  description: "XM Store is a full-featured e-commerce demo built with Next.js 14, showcasing modern frontend architecture with a dark-luxury aesthetic.",
  openGraph: {
    title: "About XM Store",
    description: "A Next.js 14 e-commerce demo showcasing modern frontend architecture",
  },
};

const highlights = [
  {
    icon: Code2,
    title: "Next.js 14 App Router",
    description: "Leveraging the latest App Router patterns — layouts, loading states, error boundaries, SSG, and server/client component composition.",
  },
  {
    icon: Palette,
    title: "Tailwind CSS v4 + shadcn/ui",
    description: "Utility-first styling with a custom dark-luxury design system, CSS variables for theming, and accessible UI primitives.",
  },
  {
    icon: Box,
    title: "Three.js 3D Viewer",
    description: "Interactive 3D product viewer with auto-rotation, orbit controls, and fullscreen mode — powered by Three.js.",
  },
  {
    icon: Sparkles,
    title: "AI Recommendations",
    description: "Cosine similarity engine that recommends products based on category, tags, and price proximity — no external API needed.",
  },
  {
    icon: Globe,
    title: "i18n & RTL Ready",
    description: "Internationalized with next-intl, bilingual (English/Chinese), and architected for Arabic RTL support.",
  },
  {
    icon: Smartphone,
    title: "PWA & Offline",
    description: "Service Worker caching, offline fallback page, and install-to-homescreen prompt for a native-like experience.",
  },
  {
    icon: TestTube,
    title: "TypeScript + Vitest",
    description: "Strict TypeScript throughout with comprehensive test coverage using Vitest, jsdom, and Testing Library.",
  },
  {
    icon: Zap,
    title: "Client-Side State",
    description: "All state managed via React Context + localStorage with useSyncExternalStore for hydration-safe, cross-tab persistence.",
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-24 md:py-32">
        <div className="absolute inset-0">
          <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[100px]" />
          <div className="absolute -left-40 -bottom-40 h-[500px] w-[500px] rounded-full bg-accent/20 blur-[100px]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-sm border border-white/10 mb-6">
            <Zap className="h-4 w-4" />
            Modern Frontend Architecture
          </span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            About <span className="gold-text">XM Store</span>
          </h1>
          <p className="mt-6 text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
            A full-featured e-commerce demo built with Next.js 14, showcasing modern frontend architecture with a dark-luxury aesthetic.
            All data lives in your browser &mdash; no backend required.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <span className="rounded-full bg-white/10 backdrop-blur-sm border border-white/10 px-4 py-1.5 text-sm">Next.js 14</span>
            <span className="rounded-full bg-white/10 backdrop-blur-sm border border-white/10 px-4 py-1.5 text-sm">TypeScript</span>
            <span className="rounded-full bg-white/10 backdrop-blur-sm border border-white/10 px-4 py-1.5 text-sm">Tailwind v4</span>
            <span className="rounded-full bg-white/10 backdrop-blur-sm border border-white/10 px-4 py-1.5 text-sm">shadcn/ui</span>
            <span className="rounded-full bg-white/10 backdrop-blur-sm border border-white/10 px-4 py-1.5 text-sm">Three.js</span>
            <span className="rounded-full bg-white/10 backdrop-blur-sm border border-white/10 px-4 py-1.5 text-sm">Framer Motion</span>
          </div>
        </div>
      </section>

      {/* What is XM Store */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
              <Code2 className="h-4 w-4" />
              What Is This?
            </span>
            <h2 className="text-3xl font-bold tracking-tight">A Frontend Engineering Showcase</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              XM Store is a demonstration project that explores modern React and Next.js patterns.
              It simulates a complete e-commerce experience entirely on the client side &mdash;
              products, cart, orders, user accounts, reviews, and theme preferences are all stored
              in your browser&apos;s localStorage.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              The only server-side call is the Aramex shipping API for order tracking. Everything else
              runs in the browser, making it a zero-backend demo that&apos;s instantly deployable anywhere.
            </p>
            <div className="mt-8 flex gap-3">
              <Link href="/products">
                <Button className="rounded-full gap-2">
                  <Zap className="h-4 w-4" />
                  Browse Products
                </Button>
              </Link>
              <Link href="https://github.com/shaowllo/XM-Store" target="_blank">
                <Button variant="outline" className="rounded-full gap-2">
                  <Code2 className="h-4 w-4" />
                  View Source
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-2xl" />
            <div className="relative aspect-video rounded-3xl overflow-hidden bg-muted">
              <Image
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=450&fit=crop"
                alt="Developer workspace"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tech Highlights */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/50 via-background to-muted/50" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent mb-4">
              <Zap className="h-4 w-4" />
              Technical Highlights
            </span>
            <h2 className="text-3xl font-bold tracking-tight">What Makes It Interesting</h2>
            <p className="mt-3 text-muted-foreground">
              Modern patterns and libraries working together
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((item) => (
              <div
                key={item.title}
                className="group rounded-2xl border bg-card p-6 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/20 hover:-translate-y-1 transition-all"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 text-primary group-hover:from-primary group-hover:to-accent group-hover:text-white transition-all">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Timeline */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
            <Sparkles className="h-4 w-4" />
            Feature Evolution
          </span>
          <h2 className="text-3xl font-bold tracking-tight">Built in Phases</h2>
          <p className="mt-3 text-muted-foreground">
            Each phase added a new dimension to the experience
          </p>
        </div>
        <div className="relative">
          <div className="absolute left-1/2 h-full w-px -translate-x-1/2 bg-gradient-to-b from-primary via-accent to-primary hidden md:block" />
          <div className="space-y-8">
            {[
              { phase: "Core", desc: "Product catalog, cart, checkout, orders, auth, wishlist", color: "from-blue-500 to-blue-600" },
              { phase: "Security", desc: "SHA-256 password hashing, session tokens, env validation", color: "from-red-500 to-red-600" },
              { phase: "Visual", desc: "Image magnifier, product gallery, 3D viewer, theme studio, compare tool", color: "from-purple-500 to-purple-600" },
              { phase: "Data", desc: "AI recommendations, price history charts, trending, reviews", color: "from-amber-500 to-amber-600" },
              { phase: "PWA", desc: "Service Worker, offline support, install prompt, update toast", color: "from-emerald-500 to-emerald-600" },
            ].map((item, index) => (
              <div
                key={item.phase}
                className={`flex flex-col md:flex-row items-center gap-4 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                <div className="flex-1 text-center md:text-right">
                  <div className="rounded-2xl border bg-card p-6 inline-block hover:shadow-lg hover:shadow-primary/5 transition-all">
                    <div className={`text-2xl font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                      {item.phase}
                    </div>
                    <div className="text-sm text-muted-foreground mt-2 max-w-xs">
                      {item.desc}
                    </div>
                  </div>
                </div>
                <div className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${item.color} text-white text-sm font-bold shadow-lg`}>
                  {index + 1}
                </div>
                <div className="flex-1 hidden md:block" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stack */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/50 via-background to-muted/50" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Tech Stack</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
            {[
              { name: "Next.js", role: "Framework", img: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=100&h=100&fit=crop" },
              { name: "React", role: "UI Library", img: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=100&h=100&fit=crop" },
              { name: "TypeScript", role: "Language", img: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=100&h=100&fit=crop" },
              { name: "Tailwind", role: "Styling", img: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=100&h=100&fit=crop" },
              { name: "Three.js", role: "3D", img: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=100&h=100&fit=crop" },
              { name: "Framer", role: "Motion", img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=100&h=100&fit=crop" },
            ].map((tech) => (
              <div key={tech.name} className="rounded-2xl border bg-card p-4 text-center hover:shadow-md transition-all">
                <div className="relative h-10 w-10 mx-auto rounded-full overflow-hidden bg-muted mb-2">
                  <Image src={tech.img} alt={tech.name} fill className="object-cover" sizes="40px" />
                </div>
                <p className="text-sm font-semibold">{tech.name}</p>
                <p className="text-[10px] text-muted-foreground">{tech.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8 md:p-12 text-center">
          <div className="absolute inset-0">
            <div className="absolute -right-32 -top-32 h-[400px] w-[400px] rounded-full bg-primary/20 blur-[100px]" />
            <div className="absolute -left-32 -bottom-32 h-[400px] w-[400px] rounded-full bg-accent/20 blur-[100px]" />
          </div>
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold">Explore the Demo</h2>
            <p className="mt-3 text-white/70 max-w-md mx-auto">
              Browse products, compare features, view in 3D, or customize the theme &mdash; all in your browser. No signup needed.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/products">
                <Button className="bg-white text-slate-900 hover:bg-white/90 rounded-xl gap-2 px-8" size="lg">
                  <Zap className="h-4 w-4" />
                  Start Browsing
                </Button>
              </Link>
              <Link href="/theme">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-xl gap-2" size="lg">
                  <Palette className="h-4 w-4" />
                  Try Theme Studio
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
