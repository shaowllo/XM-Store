import type { Metadata } from "next";
import Image from "next/image";
import { Zap, Target, Heart, Globe, Users, Award, TrendingUp, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About Us | XM Store",
  description: "Discover the XM Store story, our core values, and our journey. We are dedicated to bringing the latest tech products to consumers worldwide.",
  openGraph: {
    title: "About XM Store",
    description: "Discover the XM Store story, our core values, and our journey",
  },
};

const values = [
  {
    icon: Zap,
    title: "Innovation Driven",
    description: "We stay at the forefront of technology, integrating the latest innovations into every product",
  },
  {
    icon: Target,
    title: "Quality First",
    description: "Strict quality control to ensure every product meets the highest standards",
  },
  {
    icon: Heart,
    title: "User Centric",
    description: "Putting user needs at the core to deliver exceptional product experiences",
  },
  {
    icon: Globe,
    title: "Global Vision",
    description: "Serving consumers worldwide with a global market perspective",
  },
];

const milestones = [
  { year: "2018", title: "Brand Founded", desc: "XM Store was officially established" },
  { year: "2019", title: "First Product", desc: "XM Pro smartphone launched" },
  { year: "2021", title: "Global Expansion", desc: "Entered 20+ countries and regions" },
  { year: "2023", title: "Million Users", desc: "Over 1 million users worldwide" },
  { year: "2025", title: "Continuous Innovation", desc: "Launched multiple flagship products" },
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
            Technology Changes Life
          </span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            About <span className="gradient-text">XM Store</span>
          </h1>
          <p className="mt-6 text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
            We are dedicated to bringing the latest tech products to consumers worldwide, so everyone can enjoy the good life that technology brings.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
              <Heart className="h-4 w-4" />
              Our Story
            </span>
            <h2 className="text-3xl font-bold tracking-tight">From Vision to Mission</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Founded in 2018, XM Store is an e-commerce platform specializing in tech and digital products. We believe technology should serve life, making it easier and more enjoyable for everyone.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              From our first smartphone to a wide range of categories including phones, audio, wearables, computers, and smart home devices, XM Store has always upheld the principles of quality first and user centricity, earning the trust of millions of users worldwide.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-6">
              <div className="text-center p-4 rounded-2xl bg-secondary/50">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white mb-2">
                  <Users className="h-5 w-5" />
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">1M+</div>
                <div className="text-sm text-muted-foreground mt-1">Global Users</div>
              </div>
              <div className="text-center p-4 rounded-2xl bg-secondary/50">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white mb-2">
                  <Award className="h-5 w-5" />
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">50+</div>
                <div className="text-sm text-muted-foreground mt-1">Product Categories</div>
              </div>
              <div className="text-center p-4 rounded-2xl bg-secondary/50">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white mb-2">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">20+</div>
                <div className="text-sm text-muted-foreground mt-1">Countries Covered</div>
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
              Core Values
            </span>
            <h2 className="text-3xl font-bold tracking-tight">Our Guiding Principles</h2>
            <p className="mt-3 text-muted-foreground">
              The beliefs and principles that guide us forward
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
            Our Journey
          </span>
          <h2 className="text-3xl font-bold tracking-tight">From Founding to Growth</h2>
          <p className="mt-3 text-muted-foreground">
            Every step from founding to growth
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
            <h2 className="text-3xl md:text-4xl font-bold">Join Us</h2>
            <p className="mt-3 text-white/70 max-w-md mx-auto">
              Join us in changing the world with technology and creating a better future
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Button className="bg-white text-slate-900 hover:bg-white/90 rounded-xl gap-2 px-8" size="lg">
                <Users className="h-4 w-4" />
                View Positions
              </Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-xl gap-2" size="lg">
                <Phone className="h-4 w-4" />
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
