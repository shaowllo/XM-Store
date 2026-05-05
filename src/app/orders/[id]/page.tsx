"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Package, Clock, Truck, CircleCheck, XCircle, MapPin, ArrowLeft, Calendar } from "lucide-react";
import { useOrders, type OrderStatus } from "@/components/order-provider";
import { useAddress } from "@/components/address-provider";
import { Breadcrumb } from "@/components/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";

const statusMap: Record<OrderStatus, { label: string; gradient: string; icon: React.ReactNode; description: string }> = {
  pending: { label: "待发货", gradient: "from-amber-400 to-orange-500", icon: <Clock className="h-5 w-5" />, description: "订单已提交，正在准备发货" },
  shipped: { label: "已发货", gradient: "from-blue-400 to-cyan-500", icon: <Truck className="h-5 w-5" />, description: "商品已发出，请注意查收" },
  delivered: { label: "已完成", gradient: "from-green-400 to-emerald-500", icon: <CircleCheck className="h-5 w-5" />, description: "订单已完成，感谢购买" },
  cancelled: { label: "已取消", gradient: "from-red-400 to-rose-500", icon: <XCircle className="h-5 w-5" />, description: "订单已取消" },
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const { orders } = useOrders();
  const { defaultAddress } = useAddress();
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center py-20 px-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
        </div>
        <div className="relative text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-secondary mb-6">
            <Package className="h-10 w-10 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold">订单未找到</h1>
          <p className="mt-2 text-muted-foreground">该订单不存在或已被删除</p>
          <Link href="/orders">
            <Button className="mt-6 gap-2 rounded-xl">
              <ArrowLeft className="h-4 w-4" />
              返回订单列表
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const status = statusMap[order.status];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Breadcrumb items={[{ label: "我的订单", href: "/orders" }, { label: `订单 ${order.id.slice(-6)}` }]} />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight">订单详情</h1>
        <p className="mt-1 text-muted-foreground">订单号: {order.id}</p>

        {/* Status Card */}
        <div className="mt-6 rounded-2xl border bg-card p-6 relative overflow-hidden">
          <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${status.gradient}`} />
          <div className="flex items-center gap-4">
            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${status.gradient} text-white shadow-lg`}>
              {status.icon}
            </div>
            <div>
              <h2 className="text-lg font-bold">{status.label}</h2>
              <p className="text-sm text-muted-foreground">{status.description}</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground text-xs">下单时间</p>
                <p className="font-medium">{new Date(order.createdAt).toLocaleString("zh-CN")}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
              <Package className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground text-xs">商品总数</p>
                <p className="font-medium">{order.totalItems} 件</p>
              </div>
            </div>
            {order.shippedAt && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
                <Truck className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground text-xs">发货时间</p>
                  <p className="font-medium">{new Date(order.shippedAt).toLocaleString("zh-CN")}</p>
                </div>
              </div>
            )}
            {order.deliveredAt && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
                <CircleCheck className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground text-xs">完成时间</p>
                  <p className="font-medium">{new Date(order.deliveredAt).toLocaleString("zh-CN")}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Address */}
        <div className="mt-4 rounded-2xl border bg-card p-6">
          <h2 className="font-semibold flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <MapPin className="h-4 w-4 text-primary" />
            </div>
            收货信息
          </h2>
          {defaultAddress ? (
            <div className="mt-3 text-sm pl-10">
              <p className="font-medium">{defaultAddress.name} {defaultAddress.phone}</p>
              <p className="text-muted-foreground mt-1">{defaultAddress.province} {defaultAddress.city} {defaultAddress.district} {defaultAddress.detail}</p>
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground pl-10">暂无默认收货地址</p>
          )}
        </div>

        {/* Items */}
        <div className="mt-4 rounded-2xl border bg-card p-6">
          <h2 className="font-semibold mb-4">商品清单</h2>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <motion.div
                key={item.cartItemId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-4 p-3 rounded-xl bg-secondary/50"
              >
                <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-muted shrink-0">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{item.product.name}</p>
                  {item.selectedColor && item.selectedColor !== "default" && (
                    <div className="flex items-center gap-1.5 mt-1">
                      <span
                        className="inline-block h-3 w-3 rounded-full border"
                        style={{ backgroundColor: item.selectedColor }}
                      />
                      <span className="text-xs text-muted-foreground">已选颜色</span>
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground mt-1">x{item.quantity}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-semibold">¥{(item.product.price * item.quantity).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">¥{item.product.price.toLocaleString()} / 件</p>
                </div>
              </motion.div>
            ))}
          </div>

          <Separator className="my-5" />

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">商品总额</span>
              <span className="font-medium">¥{order.totalPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">运费</span>
              <span className="text-green-600 font-medium">免运费</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>实付金额</span>
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent text-xl">
                ¥{order.totalPrice.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
