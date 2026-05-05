import type { Metadata } from "next";
import Image from "next/image";
import { Zap, Target, Heart, Globe, Users, Award, TrendingUp, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "关于我们 | XM Store",
  description: "了解 XM Store 的品牌故事、核心价值观和发展历程。我们致力于为全球消费者提供最前沿的科技产品。",
  openGraph: {
    title: "关于 XM Store",
    description: "了解 XM Store 的品牌故事、核心价值观和发展历程",
  },
};

const values = [
  {
    icon: Zap,
    title: "创新驱动",
    description: "我们始终走在科技前沿，将最新技术融入每一款产品",
  },
  {
    icon: Target,
    title: "品质至上",
    description: "严格的质量控制体系，确保每件产品都达到最高标准",
  },
  {
    icon: Heart,
    title: "用户为本",
    description: "以用户需求为核心，打造极致的产品体验",
  },
  {
    icon: Globe,
    title: "全球视野",
    description: "面向全球市场，服务世界各地的消费者",
  },
];

const milestones = [
  { year: "2018", title: "品牌创立", desc: "XM Store正式成立" },
  { year: "2019", title: "首款产品", desc: "XM Pro手机发布" },
  { year: "2021", title: "全球扩张", desc: "进入20+国家和地区" },
  { year: "2023", title: "百万用户", desc: "全球用户突破100万" },
  { year: "2025", title: "持续创新", desc: "发布多款旗舰新品" },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-24 md:py-32">
        <div className="absolute inset-0">
          <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[100px]" />
          <div className="absolute -left-40 -bottom-40 h-[500px] w-[500px] rounded-full bg-accent/20 blur-[100px]" />
          <div className="absolute inset-0 noise-overlay" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-sm border border-white/10 mb-6">
            <Zap className="h-4 w-4" />
            科技改变生活
          </span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            关于 <span className="gradient-text">XM Store</span>
          </h1>
          <p className="mt-6 text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
            我们致力于为全球消费者提供最前沿的科技产品，
            让每个人都能享受科技带来的美好生活
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
              <Heart className="h-4 w-4" />
              品牌故事
            </span>
            <h2 className="text-3xl font-bold tracking-tight">从初心到使命</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              XM Store成立于2018年，是一家专注于科技数码产品的电商平台。
              我们相信科技应该服务于生活，让每个人都能轻松享受科技带来的便利与乐趣。
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              从最初的一款智能手机，到如今涵盖手机、音频、穿戴、电脑、智能家居等多个品类，
              XM Store始终坚持品质至上、用户为本的理念，赢得了全球数百万用户的信赖。
            </p>
            <div className="mt-8 grid grid-cols-3 gap-6">
              <div className="text-center p-4 rounded-2xl bg-secondary/50">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white mb-2">
                  <Users className="h-5 w-5" />
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">100万+</div>
                <div className="text-sm text-muted-foreground mt-1">全球用户</div>
              </div>
              <div className="text-center p-4 rounded-2xl bg-secondary/50">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white mb-2">
                  <Award className="h-5 w-5" />
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">50+</div>
                <div className="text-sm text-muted-foreground mt-1">产品品类</div>
              </div>
              <div className="text-center p-4 rounded-2xl bg-secondary/50">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white mb-2">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">20+</div>
                <div className="text-sm text-muted-foreground mt-1">覆盖国家</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-2xl" />
            <div className="relative aspect-video rounded-3xl overflow-hidden bg-muted">
              <Image
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=450&fit=crop"
                alt="Office"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/50 via-background to-muted/50" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent mb-4">
              <Target className="h-4 w-4" />
              核心价值观
            </span>
            <h2 className="text-3xl font-bold tracking-tight">指引我们前行的信念</h2>
            <p className="mt-3 text-muted-foreground">
              指引我们前行的信念与原则
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="group rounded-2xl border bg-card p-6 text-center hover:shadow-xl hover:shadow-primary/10 hover:border-primary/20 hover:-translate-y-1 transition-all"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 text-primary group-hover:from-primary group-hover:to-accent group-hover:text-white transition-all">
                  <value.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-4 font-semibold">{value.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
            <TrendingUp className="h-4 w-4" />
            发展历程
          </span>
          <h2 className="text-3xl font-bold tracking-tight">从创立到成长</h2>
          <p className="mt-3 text-muted-foreground">
            从创立到成长的每一步
          </p>
        </div>
        <div className="relative">
          <div className="absolute left-1/2 h-full w-px -translate-x-1/2 bg-gradient-to-b from-primary via-accent to-primary hidden md:block" />
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div
                key={milestone.year}
                className={`flex flex-col md:flex-row items-center gap-4 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                <div className="flex-1 text-center md:text-right">
                  <div className="rounded-2xl border bg-card p-6 inline-block hover:shadow-lg hover:shadow-primary/5 transition-all">
                    <div className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {milestone.year}
                    </div>
                    <div className="font-semibold mt-1">{milestone.title}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {milestone.desc}
                    </div>
                  </div>
                </div>
                <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white text-sm font-bold shadow-lg shadow-primary/25">
                  {index + 1}
                </div>
                <div className="flex-1 hidden md:block" />
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
            <div className="absolute inset-0 noise-overlay" />
          </div>
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold">加入我们</h2>
            <p className="mt-3 text-white/70 max-w-md mx-auto">
              与我们一起，用科技改变世界，创造更美好的未来
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Button className="bg-white text-slate-900 hover:bg-white/90 rounded-xl gap-2 px-8" size="lg">
                <Users className="h-4 w-4" />
                了解职位
              </Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-xl gap-2" size="lg">
                <Phone className="h-4 w-4" />
                联系我们
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
