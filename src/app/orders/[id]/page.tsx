"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Clock, Truck, CheckCircle, XCircle, Package, ArrowLeft, MapPin, Loader2 } from "lucide-react";
import { useOrders } from "@/components/order-provider";
import { Breadcrumb } from "@/components/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TrackingInfo } from "@/lib/shipping/adapter";

const statusConfig: Record<string, { label: string; icon: React.ComponentType<{ className?: string }>; color: string; step: number }> = {
  pending: { label: "Pending", icon: Clock, color: "text-amber-500", step: 1 },
  shipped: { label: "Shipped", icon: Truck, color: "text-blue-500", step: 2 },
  delivered: { label: "Delivered", icon: CheckCircle, color: "text-green-500", step: 3 },
  cancelled: { label: "Cancelled", icon: XCircle, color: "text-red-500", step: 0 },
};

const timelineSteps = [
  { key: "pending", label: "Pending", icon: Clock },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle },
];

export default function OrderDetailPage() {
  const params = useParams();
  const { orders } = useOrders();
  const order = useMemo(
    () => orders.find((o) => o.id === params.id),
    [orders, params.id]
  );

  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null);
  const [trackingLoaded, setTrackingLoaded] = useState(false);

  useEffect(() => {
    if (order?.trackingNumber) {
      fetch("/api/shipping/aramex", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "trackOrder",
          data: { trackingNumber: order.trackingNumber },
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setTrackingInfo(data);
          setTrackingLoaded(true);
        })
        .catch(() => {
          setTrackingLoaded(true);
        });
    }
  }, [order?.trackingNumber]);

  const trackingLoading = !!order?.trackingNumber && !trackingLoaded;

  if (!order) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Breadcrumb items={[{ label: "My Orders", href: "/orders" }, { label: "Order Details" }]} />
        <div className="mt-10 text-center">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Order not found</p>
          <Link href="/orders" className="text-sm text-primary hover:underline mt-2 inline-block">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const status = statusConfig[order.status];
  const StatusIcon = status.icon;
  const date = new Date(order.createdAt).toLocaleDateString("zh-CN");

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Breadcrumb items={[{ label: "My Orders", href: "/orders" }, { label: "Order Details" }]} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
              Order Detail
            </span>
            <div className="flex items-center gap-3 mt-2">
              <Link href="/orders">
                <ArrowLeft className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
              </Link>
              <h1 className="text-2xl font-bold">{order.id}</h1>
            </div>
          </div>
          <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${status.color}`}>
            <StatusIcon className="h-4 w-4" />
            {status.label}
          </span>
        </div>

        {/* Timeline */}
        {order.status !== "cancelled" && (
          <div className="mt-8 flex items-center">
            {timelineSteps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = status.step >= index + 1;
              const isCurrent = status.step === index + 1;

              return (
                <div key={step.key} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                        isActive
                          ? "border-foreground bg-foreground text-background"
                          : "border-muted text-muted-foreground"
                      } ${isCurrent ? "ring-4 ring-foreground/10" : ""}`}
                    >
                      <StepIcon className="h-4 w-4" />
                    </div>
                    <span
                      className={`text-xs mt-2 font-medium ${
                        isActive ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index < timelineSteps.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 mx-2 ${
                        isActive && status.step > index + 1 ? "bg-foreground" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Items */}
        <div className="mt-10">
          <h3 className="text-xs font-medium tracking-widest text-muted-foreground uppercase mb-4">
            Items
          </h3>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div
                key={item.cartItemId}
                className="flex items-center gap-4 py-4 border-b last:border-0"
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
                  <p className="font-medium text-sm">{item.product.name}</p>
                  {item.selectedColor && item.selectedColor !== "default" && (
                    <div className="flex items-center gap-1.5 mt-1">
                      <span
                        className="inline-block h-2.5 w-2.5 rounded-full border"
                        style={{ backgroundColor: item.selectedColor }}
                      />
                      <span className="text-xs text-muted-foreground">Selected</span>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">x{item.quantity}</p>
                </div>
                <p className="font-semibold text-sm">
                  ${(item.product.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Tracking */}
        {order.trackingNumber && (
          <Card className="mt-10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Tracking Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm mb-4">
                <span className="text-muted-foreground">Tracking Number:</span>
                <code className="rounded bg-muted px-2 py-0.5 text-xs font-mono">
                  {order.trackingNumber}
                </code>
              </div>

              {trackingLoading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading tracking data...
                </div>
              )}

              {trackingInfo && !trackingLoading && (
                <div className="space-y-4">
                  {/* Current Status */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <Badge
                      variant={
                        trackingInfo.status === "delivered"
                          ? "default"
                          : trackingInfo.status === "shipped"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {trackingInfo.status}
                    </Badge>
                  </div>

                  {/* Estimated Delivery */}
                  {trackingInfo.estimatedDelivery && (
                    <p className="text-sm text-muted-foreground">
                      Estimated Delivery: {new Date(trackingInfo.estimatedDelivery).toLocaleDateString("zh-CN")}
                    </p>
                  )}

                  {/* Timeline */}
                  {trackingInfo.events.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-xs font-medium tracking-widest text-muted-foreground uppercase mb-3">
                        Tracking Timeline
                      </h4>
                      <div className="relative space-y-0">
                        {trackingInfo.events.map((event, index) => (
                          <div key={index} className="flex gap-3 pb-6 last:pb-0 relative">
                            {/* Vertical line */}
                            {index < trackingInfo.events.length - 1 && (
                              <div className="absolute left-[11px] top-4 bottom-0 w-0.5 bg-border" />
                            )}
                            {/* Dot */}
                            <div className="relative flex h-6 w-6 shrink-0 items-center justify-center">
                              <div
                                className={`h-2.5 w-2.5 rounded-full ${
                                  index === 0
                                    ? "bg-primary"
                                    : "bg-muted-foreground/30"
                                }`}
                              />
                            </div>
                            {/* Content */}
                            <div className="flex-1 min-w-0 pt-0.5">
                              <p className="text-sm font-medium">
                                {event.description}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs text-muted-foreground">
                                  {new Date(event.date).toLocaleString("zh-CN")}
                                </span>
                                {event.location && (
                                  <>
                                    <span className="text-muted-foreground/30">·</span>
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      {event.location}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Summary */}
        <div className="mt-10 pt-8 border-t space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Order Date</span>
            <span>{date}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Items</span>
            <span>{order.totalItems}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span className="text-green-600">Free</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between text-lg font-bold">
            <span>Total</span>
            <span>${order.totalPrice.toLocaleString()}</span>
          </div>
        </div>

        {/* Back */}
        <div className="mt-10">
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
