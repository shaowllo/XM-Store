import Link from "next/link";
import { motion } from "framer-motion";
import { Truck, Shield, RotateCcw, Headphones, Store, ArrowUpRight } from "lucide-react";

const features = [
  { icon: Truck, title: "极速配送", desc: "全国包邮，次日送达" },
  { icon: Shield, title: "品质保障", desc: "官方正品，假一赔十" },
  { icon: RotateCcw, title: "无忧退换", desc: "7天无理由退换货" },
  { icon: Headphones, title: "专属客服", desc: "24小时在线支持" },
];

const footerLinks = {
  products: {
    title: "产品分类",
    links: [
      { label: "手机", href: "/products?category=phone" },
      { label: "音频", href: "/products?category=audio" },
      { label: "穿戴", href: "/products?category=wearable" },
      { label: "电脑", href: "/products?category=computer" },
    ],
  },
  support: {
    title: "服务支持",
    links: [
      { label: "售后服务", href: "/about" },
      { label: "配送说明", href: "/about" },
      { label: "退换政策", href: "/about" },
      { label: "常见问题", href: "/about" },
    ],
  },
  about: {
    title: "关于我们",
    links: [
      { label: "品牌故事", href: "/about" },
      { label: "联系我们", href: "/about" },
      { label: "加入我们", href: "/about" },
      { label: "隐私政策", href: "/about" },
    ],
  },
};

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-muted/30">
      {/* Features */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {features.map((f, index) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="flex items-start gap-4"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-accent/10">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{f.title}</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Footer */}
      <div className="border-t border-border/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-2">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                  <Store className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold gradient-text">XMStore</span>
              </Link>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-xs">
                探索最新科技数码产品，品质生活从这里开始。我们致力于为用户提供最优质的科技产品和购物体验。
              </p>
              <div className="mt-6 flex gap-3">
                {["微信", "微博", "抖音"].map((social) => (
                  <button
                    key={social}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-muted-foreground hover:bg-primary hover:text-white transition-all text-xs font-medium"
                  >
                    {social[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Links */}
            {Object.entries(footerLinks).map(([key, section]) => (
              <div key={key}>
                <h4 className="font-semibold text-sm mb-4">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="group flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                        <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-border/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 XM Store. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/about" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                服务条款
              </Link>
              <Link href="/about" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                隐私政策
              </Link>
              <Link href="/about" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Cookie 设置
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
