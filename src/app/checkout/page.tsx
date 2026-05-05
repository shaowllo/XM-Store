"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CreditCard, Truck, Shield, Clock, CheckCircle, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { useOrders } from "@/components/order-provider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";

export default function CheckoutPage() {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const { addOrder } = useOrders();
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState<"review" | "processing" | "success">("review");

  if (items.length === 0 && step !== "success") {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold">购物车是空的</h1>
        <p className="mt-2 text-muted-foreground">请先添加商品到购物车</p>
        <Link href="/products">
          <Button className="mt-6 gap-2">
            <ShoppingBag className="h-4 w-4" />
            去购物
          </Button>
        </Link>
      </div>
    );
  }

  const handlePay = () => {
    setProcessing(true);
    setStep("processing");
    setTimeout(() => {
      addOrder(items, totalPrice, totalItems);
      clearCart();
      setProcessing(false);
      setStep("success");
    }, 2000);
  };

  if (step === "success") {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mx-auto h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mb-6"
        >
          <CheckCircle className="h-10 w-10 text-green-600" />
        </motion.div>
        <h1 className="text-2xl font-bold">支付成功</h1>
        <p className="mt-2 text-muted-foreground">您的订单已确认，我们将尽快为您发货</p>
        <div className="mt-8 flex gap-3 justify-center">
          <Link href="/orders">
            <Button>查看订单</Button>
          </Link>
          <Link href="/products">
            <Button variant="outline">继续购物</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold tracking-tight">
        {step === "processing" ? "处理中..." : "结算"}
      </h1>

      {step === "processing" ? (
        <div className="mt-12 flex flex-col items-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent"
          />
          <p className="mt-4 text-muted-foreground">正在处理您的支付...</p>
        </div>
      ) : (
        <>
          <div className="mt-8 space-y-4">
            {items.map((item) => (
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
                <div className="flex-1">
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
                  <p className="text-sm text-muted-foreground mt-1">
                    x{item.quantity}
                  </p>
                </div>
                <p className="font-medium">
                  ¥{(item.product.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          <Separator className="my-6" />

          <div className="rounded-xl bg-muted p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-primary" />
              <span className="text-sm">极速配送，预计 1-3 个工作日送达</span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm">正品保障，7 天无理由退换</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary" />
              <span className="text-sm">售后无忧，专业客服支持</span>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between text-lg font-bold">
            <span>合计</span>
            <span>¥{totalPrice.toLocaleString()}</span>
          </div>

          <Button
            className="w-full mt-8 gap-2"
            size="lg"
            onClick={handlePay}
            disabled={processing}
          >
            <CreditCard className="h-5 w-5" />
            确认支付
          </Button>
        </>
      )}
    </div>
  );
}
