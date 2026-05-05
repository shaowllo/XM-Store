import Link from "next/link";
import { Truck, Shield, RotateCcw, Headphones } from "lucide-react";

const features = [
  { icon: Truck, title: "极速配送", desc: "全国包邮，次日送达" },
  { icon: Shield, title: "品质保障", desc: "官方正品，假一赔十" },
  { icon: RotateCcw, title: "无忧退换", desc: "7天无理由退换货" },
  { icon: Headphones, title: "专属客服", desc: "24小时在线支持" },
];

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      {/* Features */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {features.map((f) => (
            <div key={f.title} className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-sm">{f.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Footer */}
      <div className="border-t">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="text-xl font-bold tracking-tight">
                XM<span className="text-primary">Store</span>
              </Link>
              <p className="mt-3 text-sm text-muted-foreground">
                探索最新科技数码产品，品质生活从这里开始
              </p>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-3">产品分类</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/products?category=phone" className="hover:text-foreground transition-colors">手机</Link></li>
                <li><Link href="/products?category=audio" className="hover:text-foreground transition-colors">音频</Link></li>
                <li><Link href="/products?category=wearable" className="hover:text-foreground transition-colors">穿戴</Link></li>
                <li><Link href="/products?category=computer" className="hover:text-foreground transition-colors">电脑</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-3">服务支持</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">售后服务</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">配送说明</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">退换政策</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">常见问题</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-3">关于我们</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground transition-colors">品牌故事</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">联系我们</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">加入我们</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">隐私政策</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-muted-foreground">
            © 2025 XM Store. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
