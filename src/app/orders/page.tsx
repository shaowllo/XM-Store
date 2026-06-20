"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Package, Clock, Truck, CheckCircle, XCircle, ChevronRight } from "lucide-react";
import { useOrders } from "@/components/order-provider";
import { EmptyState } from "@/components/empty-state";
import { Breadcrumb } from "@/components/breadcrumb";

const statusConfig: Record<string, { label: string; icon: React.ComponentType<{ className?: string }>; color: string; bg: string }> = {
  pending: { label: "Pending", icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
  shipped: { label: "Shipped", icon: Truck, color: "text-blue-500", bg: "bg-blue-500/10" },
  delivered: { label: "Delivered", icon: CheckCircle, color: "text-green-500", bg: "bg-green-500/10" },
  cancelled: { label: "Cancelled", icon: XCircle, color: "text-red-500", bg: "bg-red-500/10" },
};

const statusFilters = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
];

export default function OrdersPage() {
  const { orders } = useOrders();
  const [filter, setFilter] = useState("all");

  const filteredOrders =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Breadcrumb items={[{ label: "My Orders" }]} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6"
      >
        <span className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Orders
        </span>
        <div className="flex items-end justify-between mt-2">
          <h1 className="text-2xl font-bold">My Orders</h1>
          <span className="text-sm text-muted-foreground">{filteredOrders.length}</span>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="flex gap-2 mt-8 overflow-x-auto pb-2">
        {statusFilters.map((s) => (
          <button
            key={s.value}
            onClick={() => setFilter(s.value)}
            className={`shrink-0 px-4 py-2 text-sm font-medium rounded-full transition-all ${
              filter === s.value
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Orders */}
      <div className="mt-6 space-y-3">
        {filteredOrders.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No orders yet"
            description="You haven't placed any orders yet."
          />
        ) : (
          filteredOrders.map((order, index) => {
            const status = statusConfig[order.status];
            const StatusIcon = status.icon;
            const date = new Date(order.createdAt).toLocaleDateString("zh-CN");
            const firstItem = order.items[0];

            if (!firstItem) return null;

            return (
              <Link key={order.id} href={`/orders/${order.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group flex items-center gap-4 py-5 px-4 rounded-xl border hover:bg-muted transition-colors"
                >
                  {/* Product Image */}
                  <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-muted shrink-0">
                    <Image
                      src={firstItem.product.image}
                      alt={firstItem.product.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{date}</span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs text-muted-foreground">{order.id}</span>
                    </div>
                    <p className="font-medium text-sm mt-1 truncate">
                      {firstItem.product.name}
                      {order.items.length > 1 && (
                        <span className="text-muted-foreground"> & {order.items.length - 1} more</span>
                      )}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium ${status.color}`}>
                        <StatusIcon className="h-3 w-3" />
                        {status.label}
                      </span>
                    </div>
                  </div>

                  {/* Price & Arrow */}
                  <div className="text-right shrink-0">
                    <p className="font-semibold text-sm">
                      ${order.totalPrice.toLocaleString()}
                    </p>
                    <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto mt-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
