"use client";

import { motion } from "framer-motion";
import { Package, Clock, Trash2 } from "lucide-react";
import { useOrders } from "@/components/order-provider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";

export default function OrdersPage() {
  const { orders, clearOrders } = useOrders();

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
        <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold">暂无订单</h1>
        <p className="mt-2 text-muted-foreground">您还没有完成任何订单</p>
        <Link href="/products">
          <Button className="mt-6">去购物</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">订单历史</h1>
          <p className="mt-2 text-muted-foreground">共 {orders.length} 笔订单</p>
        </div>
        {orders.length > 0 && (
          <Button variant="outline" size="sm" onClick={clearOrders} className="gap-2">
            <Trash2 className="h-4 w-4" />
            清空历史
          </Button>
        )}
      </div>

      <div className="mt-8 space-y-6">
        {orders.map((order, index) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="rounded-2xl border bg-card p-6"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-sm text-muted-foreground">订单号</p>
                <p className="font-medium">{order.id}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {new Date(order.createdAt).toLocaleString("zh-CN")}
                </div>
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
          </motion.div>
        ))}
      </div>
    </div>
  );
}
