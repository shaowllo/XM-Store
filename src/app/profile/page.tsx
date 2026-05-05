"use client";

import { motion } from "framer-motion";
import { User, ShoppingBag, MapPin, Heart, LogOut, ChevronRight, Settings } from "lucide-react";
import { useUser } from "@/components/user-provider";
import { useOrders } from "@/components/order-provider";
import { useAddress } from "@/components/address-provider";
import { useWishlist } from "@/components/wishlist-provider";
import { Breadcrumb } from "@/components/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function ProfilePage() {
  const { user, logout } = useUser();
  const { orders } = useOrders();
  const { addresses } = useAddress();
  const { wishlist } = useWishlist();

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <User className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold">请先登录</h1>
        <p className="mt-2 text-muted-foreground">登录后查看您的个人信息</p>
        <Link href="/login">
          <Button className="mt-6 gap-2">
            <LogOut className="h-4 w-4" />
            去登录
          </Button>
        </Link>
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
      href: "#",
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Breadcrumb items={[{ label: "个人中心" }]} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border bg-card p-6"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
      </motion.div>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold">{orders.length}</p>
          <p className="text-xs text-muted-foreground mt-1">订单</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold">{addresses.length}</p>
          <p className="text-xs text-muted-foreground mt-1">地址</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold">{wishlist.length}</p>
          <p className="text-xs text-muted-foreground mt-1">收藏</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold">{user.name.charAt(0)}</p>
          <p className="text-xs text-muted-foreground mt-1">等级</p>
        </Card>
      </div>

      <div className="mt-6 space-y-3">
        {menuItems.map((item) => (
          <Link key={item.label} href={item.href}>
            <motion.div
              whileHover={{ x: 4 }}
              className="flex items-center gap-4 rounded-xl border bg-card p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {item.icon}
              </div>
              <div className="flex-1">
                <p className="font-medium">{item.label}</p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </motion.div>
          </Link>
        ))}
      </div>

      <div className="mt-6">
        <Button variant="destructive" className="w-full gap-2" onClick={logout}>
          <LogOut className="h-4 w-4" />
          退出登录
        </Button>
      </div>
    </div>
  );
}
