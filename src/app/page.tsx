"use client";

import { useState } from "react";
import Image from "next/image";
import { HeroCarousel } from "@/components/hero-carousel";
import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/data";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Zap, Headphones, Watch, Laptop } from "lucide-react";

const categoryIcons: Record<string, React.ReactNode> = {
  phone: <Zap className="h-6 w-6" />,
  audio: <Headphones className="h-6 w-6" />,
  wearable: <Watch className="h-6 w-6" />,
  computer: <Laptop className="h-6 w-6" />,
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Home() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !EMAIL_REGEX.test(email)) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 3000);
  };

  const featuredProducts = products.slice(0, 4);
  const newArrivals = products.slice(4, 8);

  return (
    <div className="flex flex-col">
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { id: "phone", name: "手机", count: "12款" },
            { id: "audio", name: "音频", count: "8款" },
            { id: "wearable", name: "穿戴", count: "6款" },
            { id: "computer", name: "电脑", count: "10款" },
          ].map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.id}`}
              className="group flex flex-col items-center gap-3 rounded-2xl border bg-card p-6 transition-all hover:shadow-lg hover:border-primary/20"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                {categoryIcons[cat.id]}
              </div>
              <div className="text-center">
                <h3 className="font-semibold">{cat.name}</h3>
                <p className="text-sm text-muted-foreground">{cat.count}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-muted/30 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">精选推荐</h2>
              <p className="mt-2 text-muted-foreground">
                本季最受欢迎的热门产品
              </p>
            </div>
            <Link href="/products">
              <Button variant="ghost" className="gap-2">
                查看全部
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 text-white">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-primary/30 blur-3xl" />
            <div className="absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
          </div>
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 p-8 md:p-12">
            <div className="max-w-md">
              <span className="inline-block rounded-full bg-white/10 px-4 py-1 text-sm font-medium mb-4">
                限时优惠
              </span>
              <h2 className="text-3xl md:text-4xl font-bold">
                新品首发，立减500元
              </h2>
              <p className="mt-4 text-white/70">
                购买XM Buds Pro即享首发优惠，体验沉浸式降噪音质
              </p>
              <Link href="/products/2">
                <Button className="mt-6 bg-white text-black hover:bg-white/90" size="lg">
                  立即抢购
                </Button>
              </Link>
            </div>
            <div className="relative h-64 w-64">
              <Image
                src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop"
                alt="Promo"
                fill
                className="rounded-2xl object-cover shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500"
                sizes="256px"
              />
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="bg-muted/30 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">新品上市</h2>
              <p className="mt-2 text-muted-foreground">
                探索最新发布的科技好物
              </p>
            </div>
            <Link href="/products">
              <Button variant="ghost" className="gap-2">
                查看全部
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-2xl border bg-card p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold">订阅获取最新资讯</h2>
          <p className="mt-3 text-muted-foreground max-w-md mx-auto">
            第一时间获取新品发布、独家优惠和科技资讯
          </p>
          <form onSubmit={handleSubscribe} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="输入您的邮箱"
              required
              className="flex-1 rounded-lg border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
            <Button type="submit" size="lg" disabled={subscribed}>
              {subscribed ? "已订阅" : "订阅"}
            </Button>
          </form>
          {subscribed && (
            <p className="mt-3 text-sm text-green-600">感谢订阅！我们会将最新资讯发送到您的邮箱。</p>
          )}
        </div>
      </section>
    </div>
  );
}
