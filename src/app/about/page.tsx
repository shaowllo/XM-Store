"use client";

import { motion } from "framer-motion";
import { Zap, Target, Heart, Globe } from "lucide-react";

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
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute -left-40 -bottom-40 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold tracking-tight"
          >
            关于 XM Store
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg text-white/70 max-w-2xl mx-auto"
          >
            我们致力于为全球消费者提供最前沿的科技产品，
            让每个人都能享受科技带来的美好生活
          </motion.p>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">品牌故事</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              XM Store成立于2018年，是一家专注于科技数码产品的电商平台。
              我们相信科技应该服务于生活，让每个人都能轻松享受科技带来的便利与乐趣。
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              从最初的一款智能手机，到如今涵盖手机、音频、穿戴、电脑、智能家居等多个品类，
              XM Store始终坚持品质至上、用户为本的理念，赢得了全球数百万用户的信赖。
            </p>
            <div className="mt-8 grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">100万+</div>
                <div className="text-sm text-muted-foreground mt-1">全球用户</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">50+</div>
                <div className="text-sm text-muted-foreground mt-1">产品品类</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">20+</div>
                <div className="text-sm text-muted-foreground mt-1">覆盖国家</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-video rounded-2xl overflow-hidden bg-muted">
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=450&fit=crop"
                alt="Office"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">核心价值观</h2>
            <p className="mt-3 text-muted-foreground">
              指引我们前行的信念与原则
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="rounded-2xl border bg-card p-6 text-center"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <value.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-4 font-semibold">{value.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">发展历程</h2>
          <p className="mt-3 text-muted-foreground">
            从创立到成长的每一步
          </p>
        </div>
        <div className="relative">
          <div className="absolute left-1/2 h-full w-px -translate-x-1/2 bg-border hidden md:block" />
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={`flex flex-col md:flex-row items-center gap-4 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                <div className="flex-1 text-center md:text-right">
                  <div className="rounded-2xl border bg-card p-6 inline-block">
                    <div className="text-2xl font-bold text-primary">
                      {milestone.year}
                    </div>
                    <div className="font-semibold mt-1">{milestone.title}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {milestone.desc}
                    </div>
                  </div>
                </div>
                <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  {index + 1}
                </div>
                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="rounded-2xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold">加入我们</h2>
          <p className="mt-3 text-primary-foreground/80 max-w-md mx-auto">
            与我们一起，用科技改变世界，创造更美好的未来
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <button className="rounded-lg bg-white text-primary px-6 py-3 font-medium hover:bg-white/90 transition-colors">
              了解职位
            </button>
            <button className="rounded-lg border border-white/30 px-6 py-3 font-medium hover:bg-white/10 transition-colors">
              联系我们
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
