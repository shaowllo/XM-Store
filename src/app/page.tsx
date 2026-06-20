"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowRight, ArrowDown, Diamond } from "lucide-react";
import { products } from "@/lib/data";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.15 } },
};

export default function Home() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const t = useTranslations("home");

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
      {/* HERO — Full-bleed immersive */}
      <section className="relative min-h-[100svh] flex items-center overflow-hidden bg-black">
        {/* Background layers */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=1920&h=1080&fit=crop"
            alt="XM Store Hero"
            fill
            className="object-cover object-center opacity-50"
            sizes="100vw"
            priority
          />
          {/* Dramatic gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
          {/* Gold ambient light */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-amber-500/8 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-10 pt-20 pb-32">
          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            className="max-w-3xl"
          >
            <motion.div
              variants={fadeUp}
              transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="h-px w-12 bg-gradient-to-r from-amber-500/60 to-transparent" />
              <span className="text-xs tracking-[0.25em] uppercase text-amber-500/80 font-medium">
                XM Store
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-5xl md:text-7xl lg:text-8xl font-serif font-semibold text-white leading-[1.08]"
            >
              {t("heroTitle")}
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mt-8 text-lg md:text-xl text-white/50 max-w-xl leading-relaxed font-sans"
            >
              {t("heroSubtitle")}
            </motion.p>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mt-12 flex items-center gap-6"
            >
              <Link
                href="/products"
                className="btn-gold inline-flex items-center gap-2.5 rounded-lg px-8 py-4 text-sm font-semibold text-amber-950 tracking-wide"
              >
                {t("shopNow")}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={`/products/${heroProduct.id}`}
                className="group inline-flex items-center gap-2 text-sm font-medium text-white/60 hover:text-white transition-colors"
              >
                Discover
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] tracking-[0.2em] uppercase text-white/30">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <ArrowDown className="h-4 w-4 text-white/30" />
          </motion.div>
        </motion.div>
      </section>

      {/* FEATURED PRODUCTS — Editorial layout */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="pt-28 pb-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <Diamond className="h-3.5 w-3.5 text-amber-500/60" />
              <p className="text-xs tracking-[0.2em] uppercase text-amber-500/70 font-medium">Curated Selection</p>
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif font-semibold text-foreground leading-[1.15]">
              {t("featuredProducts")}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: index * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <Link href={`/products/${product.id}`} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-all duration-700 group-hover:scale-[1.04]"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-4 py-2 text-xs font-medium text-white">
                        View Details
                        <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                  <div className="pt-5">
                    <h3 className="text-lg font-serif font-semibold text-foreground group-hover:text-amber-500/80 transition-colors">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground font-sans">
                      ${product.price.toLocaleString()}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* NEW ARRIVAL — Split editorial */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-28 md:py-36">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16 items-center">
            {/* Image — spans 3 cols, first on mobile */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative aspect-[4/5] lg:aspect-[5/6] overflow-hidden rounded-2xl bg-muted order-1 lg:order-2 lg:col-span-3 gold-glow"
            >
              <Image
                src={newArrival.image}
                alt={newArrival.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
            </motion.div>

            {/* Content — spans 2 cols */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="order-2 lg:order-1 lg:col-span-2"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8 bg-amber-500/40" />
                <p className="text-xs tracking-[0.2em] uppercase text-amber-500/70 font-medium">New Arrival</p>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold text-foreground leading-[1.1]">
                {newArrival.name}
              </h2>
              <p className="mt-6 text-base leading-relaxed text-muted-foreground font-sans max-w-md">
                {newArrival.description}
              </p>
              <div className="mt-8 flex items-baseline gap-4">
                <span className="text-3xl font-serif font-semibold text-foreground">
                  ${newArrival.price.toLocaleString()}
                </span>
                {newArrival.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through font-sans">
                    ${newArrival.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              <Link
                href={`/products/${newArrival.id}`}
                className="mt-8 btn-gold inline-flex items-center gap-2.5 rounded-lg px-8 py-4 text-sm font-semibold text-amber-950 tracking-wide"
              >
                Buy Now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CATEGORIES — Geometric grid */}
      <section className="bg-secondary/30">
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-28 md:py-36">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-3">
              <Diamond className="h-3.5 w-3.5 text-amber-500/60" />
              <p className="text-xs tracking-[0.2em] uppercase text-amber-500/70 font-medium">Explore</p>
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif font-semibold text-foreground leading-[1.15]">
              {t("categories")}
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {[
              { id: "phone", name: "Phones", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop" },
              { id: "audio", name: "Audio", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop" },
              { id: "wearable", name: "Wearables", image: "https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=600&h=600&fit=crop" },
              { id: "computer", name: "Computers", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop" },
            ].map((cat, index) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link href={`/products?category=${cat.id}`} className="group block">
                  <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-cover transition-all duration-700 group-hover:scale-[1.06]"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute inset-0 flex items-end p-5">
                      <span className="font-serif text-white text-xl font-semibold tracking-tight">
                        {cat.name}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PROMO BANNER */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/10 px-8 md:px-12 py-12 md:py-16"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <p className="text-sm tracking-[0.15em] uppercase text-amber-500/70 font-medium mb-2">Special Offer</p>
                <h3 className="text-2xl md:text-3xl font-serif font-semibold text-foreground">
                  {t("promoBanner")}
                </h3>
              </div>
              <Link
                href="/products"
                className="btn-gold inline-flex items-center gap-2.5 rounded-lg px-7 py-3.5 text-sm font-semibold text-amber-950 tracking-wide shrink-0"
              >
                {t("shopNow")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-xl mx-auto text-center"
          >
            <Diamond className="h-5 w-5 text-amber-500/50 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground">
              {t("newsletter")}
            </h2>
            <p className="mt-4 text-muted-foreground font-sans leading-relaxed">
              Subscribe for new arrivals and exclusive deals
            </p>
            <form onSubmit={handleSubscribe} className="mt-8 flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("newsletterPlaceholder")}
                aria-label="Email address"
                required
                className="flex-1 rounded-lg border border-border bg-secondary/50 px-5 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20 transition-all"
              />
              <button
                type="submit"
                disabled={subscribed}
                className="btn-gold rounded-lg px-7 py-3.5 text-sm font-semibold text-amber-950 tracking-wide disabled:opacity-40 shrink-0"
              >
                {subscribed ? "Subscribed" : t("subscribe")}
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
