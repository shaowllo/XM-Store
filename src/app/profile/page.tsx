"use client";

import { motion } from "framer-motion";
import { User, ShoppingBag, MapPin, Heart, LogOut, ChevronRight, Settings, Sparkles } from "lucide-react";
import { useUser } from "@/components/user-provider";
import { useOrders } from "@/components/order-provider";
import { useAddress } from "@/components/address-provider";
import { useWishlist } from "@/components/wishlist-provider";
import { EmptyState } from "@/components/empty-state";
import { Breadcrumb } from "@/components/breadcrumb";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ProfilePage() {
  const { user, logout } = useUser();
  const { orders } = useOrders();
  const { addresses } = useAddress();
  const { wishlist } = useWishlist();

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Breadcrumb items={[{ label: "个人中心" }]} />
        <EmptyState
          icon={User}
          title="请先登录"
          description="登录后查看您的个人信息、订单和收藏"
          action={{ label: "去登录", href: "/login", icon: <LogOut className="h-4 w-4" /> }}
        />
      </div>
    );
  }

  const menuItems = [
    {
      icon: <ShoppingBag className="h-5 w-5" />,
      label: "我的订单",
      description: `${orders.length} 笔订单`,
      href: "/orders",
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      label: "收货地址",
      description: `${addresses.length} 个地址`,
      href: "/profile/addresses",
    },
    {
      icon: <Heart className="h-5 w-5" />,
      label: "我的收藏",
      description: `${wishlist.length} 件商品`,
      href: "/wishlist",
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: "账号设置",
      description: "修改个人信息",
      href: "/profile",
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Breadcrumb items={[{ label: "个人中心" }]} />

      {/* User Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border bg-card p-8"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative flex items-center gap-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/25">
            <User className="h-10 w-10 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                <Sparkles className="h-3 w-3" />
                VIP
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { value: orders.length, label: "订单", color: "from-primary to-blue-500" },
          { value: addresses.length, label: "地址", color: "from-accent to-cyan-500" },
          { value: wishlist.length, label: "收藏", color: "from-pink-500 to-rose-500" },
          { value: user.name.charAt(0), label: "等级", color: "from-amber-500 to-orange-500" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="rounded-2xl border bg-card p-5 text-center hover:shadow-lg hover:shadow-primary/5 transition-all"
          >
            <p className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
              {stat.value}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Menu */}
      <div className="mt-6 space-y-3">
        {menuItems.map((item, index) => (
          <Link key={item.label} href={item.href}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              whileHover={{ x: 4 }}
              className="group flex items-center gap-4 rounded-2xl border bg-card p-5 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 transition-all"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 text-primary group-hover:from-primary group-hover:to-accent group-hover:text-white transition-all">
                {item.icon}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{item.label}</p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Logout */}
      <div className="mt-6">
        <Button
          variant="outline"
          className="w-full gap-2 rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          退出登录
        </Button>
      </div>
    </div>
  );
}
