"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Package, Clock, Truck, CircleCheck, XCircle, ArrowLeft, MapPin } from "lucide-react";
import { useOrders, type OrderStatus } from "@/components/order-provider";
import { useAddress } from "@/components/address-provider";
import { Breadcrumb } from "@/components/breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";

const statusMap: Record<OrderStatus, { label: string; color: string; icon: React.ReactNode; description: string }> = {
  pending: { label: "待发货", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", icon: <Clock className="h-5 w-5" />, description: "订单已提交，正在准备发货" },
  shipped: { label: "已发货", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", icon: <Truck className="h-5 w-5" />, description: "商品已发出，请注意查收" },
  delivered: { label: "已完成", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", icon: <CircleCheck className="h-5 w-5" />, description: "订单已完成，感谢购买" },
  cancelled: { label: "已取消", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", icon: <XCircle className="h-5 w-5" />, description: "订单已取消" },
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const { orders } = useOrders();
  const { defaultAddress } = useAddress();
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold">订单未找到</h1>
        <p className="mt-2 text-muted-foreground">该订单不存在或已被删除</p>
        <Link href="/orders">
          <Button className="mt-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            返回订单列表
          </Button>
        </Link>
      </div>
    );
  }

  const status = statusMap[order.status];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Breadcrumb items={[{ label: "我的订单", href: "/orders" }, { label: "订单详情" }]} />

      <h1 className="text-3xl font-bold">订单详情</h1>
      <p className="mt-1 text-muted-foreground">订单号: {order.id}</p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 rounded-2xl border bg-card p-6"
      >
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${status.color}`}>
            {status.icon}
          </div>
          <div>
            <Badge className={`gap-1 ${status.color}`}>
              {status.icon}
              {status.label}
            </Badge>
            <p className="mt-1 text-sm text-muted-foreground">{status.description}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">下单时间</p>
            <p className="font-medium">{new Date(order.createdAt).toLocaleString("zh-CN")}</p>
          </div>
          <div>
            <p className="text-muted-foreground">商品总数</p>
            <p className="font-medium">{order.totalItems} 件</p>
          </div>
          {order.shippedAt && (
            <div>
              <p className="text-muted-foreground">发货时间</p>
              <p className="font-medium">{new Date(order.shippedAt).toLocaleString("zh-CN")}</p>
            </div>
          )}
          {order.deliveredAt && (
            <div>
              <p className="text-muted-foreground">完成时间</p>
              <p className="font-medium">{new Date(order.deliveredAt).toLocaleString("zh-CN")}</p>
            </div>
          )}
        </div>
      </motion.div>

      <div className="mt-6 rounded-2xl border bg-card p-6">
        <h2 className="font-semibold flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          收货信息
        </h2>
        {defaultAddress ? (
          <div className="mt-2 text-sm">
            <p className="font-medium">{defaultAddress.name} {defaultAddress.phone}</p>
            <p className="text-muted-foreground">{defaultAddress.province} {defaultAddress.city} {defaultAddress.district} {defaultAddress.detail}</p>
          </div>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">暂无默认收货地址</p>
        )}
      </div>

      <div className="mt-6 rounded-2xl border bg-card p-6">
        <h2 className="font-semibold mb-4">商品清单</h2>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.cartItemId} className="flex items-center gap-4">
              <div className="relative h-20 w-20 overflow-hidden rounded-lg bg-muted">
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
                <p className="font-medium">¥{(item.product.price * item.quantity).toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">¥{item.product.price.toLocaleString()} / 件</p>
              </div>
            </div>
          ))}
        </div>

        <Separator className="my-4" />

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">商品总额</span>
            <span>¥{order.totalPrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">运费</span>
            <span className="text-green-600">免运费</span>
          </div>
          <Separator />
          <div className="flex justify-between text-base font-bold">
            <span>实付金额</span>
            <span>¥{order.totalPrice.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
