"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { products } from "@/lib/data";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.12 } },
};

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

  const heroProduct = products[0];
  const featuredProducts = products.slice(0, 3);
  const newArrival = products[1];

  return (
    <div className="flex flex-col">
      {/* Hero — Apple-style full-bleed */}
      <section className="relative min-h-[100svh] flex items-end pb-20 md:pb-28 overflow-hidden bg-black">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=1920&h=1080&fit=crop"
            alt="XM Store Hero"
            fill
            className="object-cover object-center opacity-60"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </div>

        <motion.div
          variants={stagger}
          initial="initial"
          animate="animate"
          className="relative z-10 mx-auto w-full max-w-5xl px-6 md:px-12"
        >
          <motion.p variants={fadeUp} transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }} className="text-sm tracking-[0.2em] uppercase text-white/50 mb-4">
            XM Store
          </motion.p>
          <motion.h1 variants={fadeUp} transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }} className="text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight text-white leading-[1.05]">
            科技，<br />触手可及。
          </motion.h1>
          <motion.p variants={fadeUp} transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }} className="mt-6 text-lg md:text-xl text-white/60 max-w-lg leading-relaxed">
            探索前沿数码产品，让创新融入日常。
          </motion.p>
          <motion.div variants={fadeUp} transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }} className="mt-10 flex items-center gap-6">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-medium text-black transition-all hover:bg-white/90"
            >
              探索全部产品
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={`/products/${heroProduct.id}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              了解更多
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Feature Strip — 3 products, image-led */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="px-6 md:px-12 pt-24 pb-8"
          >
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">Featured</p>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">精选推荐</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: index * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <Link href={`/products/${product.id}`} className="group block">
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="px-6 md:px-8 py-6">
                    <h3 className="text-lg font-semibold tracking-tight">{product.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">¥{product.price.toLocaleString()}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial — Single product story */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex items-center px-6 md:px-16 lg:px-24 py-20 lg:py-32"
            >
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">New Arrival</p>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.1]">
                  {newArrival.name}
                </h2>
                <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-md">
                  {newArrival.description}
                </p>
                <div className="mt-8 flex items-center gap-4">
                  <span className="text-2xl font-semibold">¥{newArrival.price.toLocaleString()}</span>
                  {newArrival.originalPrice && (
                    <span className="text-lg text-muted-foreground line-through">
                      ¥{newArrival.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                <Link
                  href={`/products/${newArrival.id}`}
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-8 py-4 text-sm font-medium text-background transition-all hover:bg-foreground/90"
                >
                  立即购买
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative aspect-square lg:aspect-auto lg:min-h-[600px] overflow-hidden bg-muted"
            >
              <Image
                src={newArrival.image}
                alt={newArrival.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Category Grid — Minimal tiles */}
      <section className="bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 md:px-12 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">Categories</p>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">按类别浏览</h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { id: "phone", name: "手机", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop" },
              { id: "audio", name: "音频", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop" },
              { id: "wearable", name: "穿戴", image: "https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=600&h=600&fit=crop" },
              { id: "computer", name: "电脑", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop" },
            ].map((cat, index) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/products?category=${cat.id}`} className="group block">
                  <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
                    <div className="absolute inset-0 flex items-end p-5">
                      <span className="text-white text-lg font-semibold">{cat.name}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter — Minimal CTA */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-6 md:px-12 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">保持联系</h2>
            <p className="mt-4 text-muted-foreground">
              订阅获取新品发布与独家优惠
            </p>
            <form onSubmit={handleSubscribe} className="mt-8 flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="您的邮箱"
                aria-label="邮箱地址"
                required
                className="flex-1 rounded-full border bg-background px-6 py-3.5 text-sm outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
              />
              <button
                type="submit"
                disabled={subscribed}
                className="rounded-full bg-foreground px-8 py-3.5 text-sm font-medium text-background transition-all hover:bg-foreground/90 disabled:opacity-50"
              >
                {subscribed ? "已订阅" : "订阅"}
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
