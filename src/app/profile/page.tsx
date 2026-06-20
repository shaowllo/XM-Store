"use client";

import { motion } from "framer-motion";
import { User, ShoppingBag, MapPin, Heart, LogOut, ChevronRight, Settings } from "lucide-react";
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
      icon: ShoppingBag,
      label: "我的订单",
      description: `${orders.length} 笔订单`,
      href: "/orders",
    },
    {
      icon: MapPin,
      label: "收货地址",
      description: `${addresses.length} 个地址`,
      href: "/profile/addresses",
    },
    {
      icon: Heart,
      label: "我的收藏",
      description: `${wishlist.length} 件商品`,
      href: "/wishlist",
    },
    {
      icon: Settings,
      label: "账号设置",
      description: "修改个人信息",
      href: "/profile",
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Breadcrumb items={[{ label: "个人中心" }]} />

      {/* User Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 pb-8 border-b"
      >
        <span className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Profile
        </span>
        <div className="flex items-center gap-5 mt-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-foreground">
            <User className="h-8 w-8 text-background" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{user.email}</p>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-8 py-8 border-b">
        {[
          { value: orders.length, label: "订单" },
          { value: addresses.length, label: "地址" },
          { value: wishlist.length, label: "收藏" },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Menu */}
      <div className="mt-8 space-y-1">
        {menuItems.map((item, index) => (
          <Link key={item.label} href={item.href}>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="group flex items-center gap-4 py-4 px-2 rounded-xl hover:bg-muted transition-colors"
            >
              <item.icon className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              <div className="flex-1">
                <p className="font-medium text-sm">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Logout */}
      <div className="mt-8 pt-8 border-t">
        <Button
          variant="outline"
          className="w-full rounded-full"
          onClick={logout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          退出登录
        </Button>
      </div>
    </div>
  );
}
