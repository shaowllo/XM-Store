"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { HeroCarousel } from "@/components/hero-carousel";
import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/data";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Smartphone, Headphones, Watch, Laptop, Mail, CheckCircle, Zap, TrendingUp, Sparkles } from "lucide-react";

const categoryIcons: Record<string, React.ReactNode> = {
  phone: <Smartphone className="h-6 w-6" />,
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
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
            <Zap className="h-4 w-4" />
            探索分类
          </span>
          <h2 className="text-3xl font-bold">按类别浏览</h2>
          <p className="mt-2 text-muted-foreground">找到属于你的科技好物</p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { id: "phone", name: "手机", count: "12款", desc: "旗舰性能" },
            { id: "audio", name: "音频", count: "8款", desc: "沉浸音质" },
            { id: "wearable", name: "穿戴", count: "6款", desc: "智能生活" },
            { id: "computer", name: "电脑", count: "10款", desc: "高效办公" },
          ].map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Link
                href={`/products?category=${cat.id}`}
                className="group flex flex-col items-center gap-4 rounded-2xl border bg-card p-8 transition-all hover:shadow-xl hover:border-primary/20 hover:-translate-y-1"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 text-primary transition-all group-hover:from-primary group-hover:to-accent group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary/25">
                  {categoryIcons[cat.id]}
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-lg">{cat.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{cat.desc}</p>
                  <span className="inline-block mt-2 text-xs font-medium text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                    {cat.count}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/50 via-background to-muted/50" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-end justify-between mb-12"
          >
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent mb-4">
                <TrendingUp className="h-4 w-4" />
                热门推荐
              </span>
              <h2 className="text-3xl font-bold">精选推荐</h2>
              <p className="mt-2 text-muted-foreground">
                本季最受欢迎的热门产品
              </p>
            </div>
            <Link href="/products">
              <Button variant="ghost" className="gap-2 rounded-xl">
                查看全部
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white"
        >
          <div className="absolute inset-0">
            <div className="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[100px]" />
            <div className="absolute -left-32 -bottom-32 h-[500px] w-[500px] rounded-full bg-accent/20 blur-[100px]" />
            <div className="absolute inset-0 noise-overlay" />
          </div>
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 p-8 md:p-16">
            <div className="max-w-lg">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-sm border border-white/10"
              >
                <Sparkles className="h-4 w-4" />
                限时优惠
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="mt-6 text-4xl md:text-5xl font-bold leading-tight"
              >
                新品首发，
                <span className="gradient-text">立减500元</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="mt-4 text-lg text-white/60 leading-relaxed"
              >
                购买 XM Buds Pro 即享首发优惠，体验沉浸式降噪音质，让音乐成为你的私人空间
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="mt-8 flex gap-4"
              >
                <Link href="/products/2">
                  <Button className="bg-white text-slate-900 hover:bg-white/90 rounded-xl px-8" size="lg">
                    立即抢购
                  </Button>
                </Link>
                <Link href="/products/2">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10 rounded-xl"
                  >
                    了解更多
                  </Button>
                </Link>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="relative h-72 w-72 shrink-0"
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/30 to-accent/30 blur-2xl" />
              <Image
                src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop"
                alt="XM Buds Pro 新品首发"
                fill
                className="rounded-3xl object-cover shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700 relative z-10"
                sizes="288px"
              />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* New Arrivals */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/50 via-background to-muted/50" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-end justify-between mb-12"
          >
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
                <Sparkles className="h-4 w-4" />
                全新上市
              </span>
              <h2 className="text-3xl font-bold">新品上市</h2>
              <p className="mt-2 text-muted-foreground">
                探索最新发布的科技好物
              </p>
            </div>
            <Link href="/products">
              <Button variant="ghost" className="gap-2 rounded-xl">
                查看全部
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border bg-card p-8 md:p-16 text-center"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-accent/10 blur-3xl" />
          <div className="relative">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent mb-6">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">订阅获取最新资讯</h2>
            <p className="mt-3 text-muted-foreground max-w-md mx-auto">
              第一时间获取新品发布、独家优惠和科技资讯，不错过任何精彩
            </p>
            <form onSubmit={handleSubscribe} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="输入您的邮箱"
                  aria-label="邮箱地址"
                  required
                  className="w-full rounded-xl border bg-background pl-11 pr-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
              <Button type="submit" size="lg" disabled={subscribed} className="rounded-xl gap-2 px-8">
                {subscribed ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    已订阅
                  </>
                ) : (
                  "立即订阅"
                )}
              </Button>
            </form>
            {subscribed && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-sm text-green-600 flex items-center justify-center gap-1"
              >
                <CheckCircle className="h-4 w-4" />
                感谢订阅！我们会将最新资讯发送到您的邮箱。
              </motion.p>
            )}
          </div>
        </motion.div>
      </section>
    </div>
  );
}
