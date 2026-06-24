"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Package, ShoppingBag, TrendingUp, DollarSign,
  Clock, CheckCircle, XCircle, Truck, Loader2, ExternalLink,
} from "lucide-react";
import { useUser } from "@/components/user-provider";
import { products } from "@/lib/data";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Get orders from localStorage
function getAllOrders() {
  try {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith("xmstore-orders-"));
    const all: any[] = [];
    for (const key of keys) {
      const raw = localStorage.getItem(key);
      if (raw) all.push(...JSON.parse(raw));
    }
    return all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch { return []; }
}

function getOrderStats(orders: any[]) {
  const total = orders.length;
  const revenue = orders.reduce((s: number, o: any) => s + (o.totalPrice || 0), 0);
  const pending = orders.filter((o) => o.status === "cod_confirmed" || o.status === "pending").length;
  const shipped = orders.filter((o) => o.status === "shipped" || o.status === "out_for_delivery").length;
  const delivered = orders.filter((o) => o.status === "delivered" || o.status === "cod_paid").length;
  return { total, revenue, pending, shipped, delivered };
}

const STATUS_FLOW: Record<string, string> = {
  cod_confirmed: "Confirmed",
  shipped: "Shipped",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cod_paid: "Paid",
  cancelled: "Cancelled",
};

export default function AdminPage() {
  const { user } = useUser();
  const router = useRouter();
  const [tab, setTab] = useState<"dashboard" | "orders">("dashboard");
  const [orders, setOrders] = useState(getAllOrders);

  const refreshOrders = () => setOrders(getAllOrders());

  const stats = useMemo(() => getOrderStats(orders), [orders]);

  const updateStatus = (orderId: string, newStatus: string) => {
    try {
      const keys = Object.keys(localStorage).filter((k) => k.startsWith("xmstore-orders-"));
      for (const key of keys) {
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        const list = JSON.parse(raw);
        const idx = list.findIndex((o: any) => o.id === orderId);
        if (idx >= 0) {
          list[idx].status = newStatus;
          localStorage.setItem(key, JSON.stringify(list));
          break;
        }
      }
      refreshOrders();
    } catch {}
  };

  // Simple bar for revenue chart
  const maxRevenue = Math.max(...orders.map((o) => o.totalPrice || 0), 1);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground">
          <LayoutDashboard className="h-5 w-5 text-background" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">Manage orders and view store analytics</p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 rounded-xl bg-muted p-1 mb-8 w-fit">
        <button
          onClick={() => setTab("dashboard")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === "dashboard" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <LayoutDashboard className="h-3.5 w-3.5 inline mr-1.5" />
          Dashboard
        </button>
        <button
          onClick={() => setTab("orders")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === "orders" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <ShoppingBag className="h-3.5 w-3.5 inline mr-1.5" />
          Orders ({stats.total})
        </button>
      </div>

      {tab === "dashboard" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Orders", value: stats.total, icon: ShoppingBag, color: "text-blue-500" },
              { label: "Revenue", value: `$${stats.revenue.toLocaleString()}`, icon: DollarSign, color: "text-green-500" },
              { label: "Pending", value: stats.pending, icon: Clock, color: "text-amber-500" },
              { label: "Delivered", value: stats.delivered, icon: CheckCircle, color: "text-emerald-500" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border bg-card p-5">
                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-muted ${stat.color}`}>
                    <stat.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Revenue mini chart */}
          {orders.length > 0 && (
            <div className="rounded-2xl border bg-card p-6">
              <h3 className="text-sm font-semibold mb-4">Recent Orders Revenue</h3>
              <div className="flex items-end gap-1 h-32">
                {orders.slice(0, 20).reverse().map((order) => (
                  <div
                    key={order.id}
                    className="flex-1 rounded-t bg-primary/30 hover:bg-primary/50 transition-colors relative group"
                    style={{ height: `${Math.max(4, (order.totalPrice || 0) / maxRevenue * 100)}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-foreground text-background text-[10px] px-2 py-0.5 rounded whitespace-nowrap transition-opacity">
                      ${order.totalPrice?.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground mt-2">Latest orders (left = oldest)</p>
            </div>
          )}

          {/* Popular products */}
          <div className="rounded-2xl border bg-card p-6">
            <h3 className="text-sm font-semibold mb-4">Popular Products</h3>
            <div className="space-y-3">
              {[...products]
                .sort((a, b) => b.reviews - a.reviews)
                .slice(0, 5)
                .map((p, i) => (
                  <div key={p.id} className="flex items-center gap-3">
                    <span className="w-5 text-xs font-bold text-muted-foreground">#{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{p.name}</p>
                      <p className="text-[10px] text-muted-foreground">{p.category} · {p.reviews} reviews</p>
                    </div>
                    <span className="text-sm font-semibold">${p.price.toLocaleString()}</span>
                  </div>
                ))}
            </div>
          </div>
        </motion.div>
      )}

      {tab === "orders" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {orders.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <ShoppingBag className="h-10 w-10 mx-auto mb-3 text-muted-foreground/40" />
              <p className="font-medium">No orders yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground text-[10px] uppercase tracking-wider">
                    <th className="text-left py-3 px-2 font-medium">Order ID</th>
                    <th className="text-left py-3 px-2 font-medium">Customer</th>
                    <th className="text-left py-3 px-2 font-medium">Items</th>
                    <th className="text-right py-3 px-2 font-medium">Total</th>
                    <th className="text-center py-3 px-2 font-medium">Status</th>
                    <th className="text-center py-3 px-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-2">
                        <span className="font-mono text-[10px]">{order.id.slice(0, 16)}...</span>
                      </td>
                      <td className="py-3 px-2">
                        <p className="text-sm font-medium">{order.shippingAddress?.fullName || "—"}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "—"}
                        </p>
                      </td>
                      <td className="py-3 px-2">
                        <span className="text-xs">{order.totalItems} items</span>
                      </td>
                      <td className="py-3 px-2 text-right font-semibold">
                        ${order.totalPrice?.toLocaleString() || "0"}
                      </td>
                      <td className="py-3 px-2 text-center">
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          className={`text-xs rounded-full px-2 py-1 border font-medium ${
                            order.status === "delivered" || order.status === "cod_paid"
                              ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
                              : order.status === "cancelled"
                              ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800"
                              : order.status === "shipped" || order.status === "out_for_delivery"
                              ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800"
                              : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800"
                          }`}
                        >
                          {Object.entries(STATUS_FLOW).map(([val, label]) => (
                            <option key={val} value={val}>{label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <Link
                          href={`/orders/${order.id}`}
                          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <ExternalLink className="h-3 w-3" />
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
