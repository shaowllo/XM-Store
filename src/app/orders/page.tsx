"use client";

import { motion } from "framer-motion";
import { Package, Clock, Trash2, ShoppingBag, CircleCheck, Truck, XCircle, ChevronRight } from "lucide-react";
import { useOrders, type OrderStatus } from "@/components/order-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb } from "@/components/breadcrumb";
import Image from "next/image";
import Link from "next/link";

const statusMap: Record<OrderStatus, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: "待发货", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", icon: <Clock className="h-4 w-4" /> },
  shipped: { label: "已发货", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", icon: <Truck className="h-4 w-4" /> },
  delivered: { label: "已完成", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", icon: <CircleCheck className="h-4 w-4" /> },
  cancelled: { label: "已取消", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", icon: <XCircle className="h-4 w-4" /> },
};

export default function OrdersPage() {
  const { orders, clearOrders } = useOrders();

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
        <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold">暂无订单</h1>
        <p className="mt-2 text-muted-foreground">您还没有完成任何订单</p>
        <Link href="/products">
          <Button className="mt-6 gap-2">
            <ShoppingBag className="h-4 w-4" />
            去购物
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: "我的订单" }]} />
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">我的订单</h1>
        <Button variant="outline" size="sm" onClick={clearOrders} className="gap-2">
          <Trash2 className="h-4 w-4" />
          清空历史
        </Button>
      </div>

      <div className="mt-8 space-y-6">
        {orders.map((order) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border bg-card p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">订单号</p>
                <p className="font-mono font-medium">{order.id}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {new Date(order.createdAt).toLocaleString("zh-CN")}
                </div>
                <Badge className={`mt-1 gap-1 ${statusMap[order.status].color}`}>
                  {statusMap[order.status].icon}
                  {statusMap[order.status].label}
                </Badge>
                <p className="text-lg font-bold mt-1">
                  ¥{order.totalPrice.toLocaleString()}
                </p>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.cartItemId} className="flex items-center gap-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-muted">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.product.name}</p>
                    {item.selectedColor && item.selectedColor !== "default" && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <span
                          className="inline-block h-3 w-3 rounded-full border"
                          style={{ backgroundColor: item.selectedColor }}
                        />
                        <span className="text-xs text-muted-foreground">
                          已选颜色
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm">x{item.quantity}</p>
                    <p className="text-sm text-muted-foreground">
                      ¥
                      {(
                        item.product.price * item.quantity
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="flex items-center justify-end">
              <Link href={`/orders/${order.id}`}>
                <Button variant="ghost" size="sm" className="gap-1">
                  查看详情
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
