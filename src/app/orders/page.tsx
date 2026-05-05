"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Package, ChevronRight, ShoppingBag, Calendar, Clock, CheckCircle, Truck, PackageCheck } from "lucide-react";
import { useOrders } from "@/components/order-provider";
import { EmptyState } from "@/components/empty-state";
import { Breadcrumb } from "@/components/breadcrumb";

const statusConfig: Record<string, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  pending: { label: "待发货", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
  shipped: { label: "已发货", icon: Truck, color: "text-blue-600", bg: "bg-blue-50" },
  delivered: { label: "已送达", icon: PackageCheck, color: "text-green-600", bg: "bg-green-50" },
  completed: { label: "已完成", icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
};

export default function OrdersPage() {
  const { orders } = useOrders();
  const [filter, setFilter] = useState<string>("all");

  const filteredOrders = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: "我的订单" }]} />
        <EmptyState
          icon={Package}
          title="暂无订单"
          description="您还没有下过订单，快去选购心仪的商品吧"
          action={{ label: "去购物", href: "/products", icon: <ShoppingBag className="h-4 w-4" /> }}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: "我的订单" }]} />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">我的订单</h1>
            <p className="mt-2 text-muted-foreground">查看和管理您的所有订单</p>
          </div>
          <div className="flex gap-2">
            {["all", "pending", "shipped", "delivered", "completed"].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  filter === s
                    ? "bg-primary text-white shadow-lg shadow-primary/25"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {s === "all" ? "全部" : statusConfig[s]?.label || s}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 space-y-4">
          {filteredOrders.map((order, index) => {
            const status = statusConfig[order.status] || statusConfig.pending;
            const StatusIcon = status.icon;

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/orders/${order.id}`}>
                  <div className="group rounded-2xl border bg-card p-5 transition-all hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-0.5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-muted-foreground">{order.id}</span>
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${status.bg}`}>
                          <StatusIcon className={`h-3.5 w-3.5 ${status.color}`} />
                          <span className={`text-xs font-medium ${status.color}`}>{status.label}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(order.createdAt).toLocaleDateString("zh-CN")}
                        <ChevronRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex -space-x-3">
                        {order.items.slice(0, 4).map((item, idx) => (
                          <div
                            key={idx}
                            className="relative h-14 w-14 overflow-hidden rounded-xl border-2 border-background bg-muted"
                          >
                            <Image
                              src={item.product.image}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                              sizes="56px"
                            />
                          </div>
                        ))}
                        {order.items.length > 4 && (
                          <div className="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-background bg-muted text-xs font-medium">
                            +{order.items.length - 4}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-muted-foreground">
                          共 {order.totalItems} 件商品
                        </p>
                        <p className="text-lg font-bold mt-1">
                          ¥{order.totalPrice.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
