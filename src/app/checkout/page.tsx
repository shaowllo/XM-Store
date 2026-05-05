"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { CreditCard, Truck, Shield, Clock, CheckCircle, ShoppingBag, MapPin, Tag, ChevronDown, ChevronUp, X } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { useOrders } from "@/components/order-provider";
import { useAddress } from "@/components/address-provider";
import { useCoupon as useCouponContext } from "@/components/coupon-provider";
import { EmptyState } from "@/components/empty-state";
import { Breadcrumb } from "@/components/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";

export default function CheckoutPage() {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { addresses, defaultAddress } = useAddress();
  const { coupons, validateCoupon, useCoupon: markCouponUsed } = useCouponContext();
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState<"review" | "processing" | "success">("review");
  const [selectedAddressId, setSelectedAddressId] = useState<string | undefined>(defaultAddress?.id);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState("");
  const [showAddressList, setShowAddressList] = useState(false);
  const [showCouponList, setShowCouponList] = useState(false);

  if (items.length === 0 && step !== "success") {
    return (
      <div className="mx-auto max-w-7xl px-4">
        <Breadcrumb items={[{ label: "购物车", href: "/cart" }, { label: "结算" }]} />
        <EmptyState
          icon={ShoppingBag}
          title="购物车是空的"
          description="请先添加商品到购物车后再来结算"
          action={{ label: "去购物", href: "/products", icon: <ShoppingBag className="h-4 w-4" /> }}
        />
      </div>
    );
  }

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) || defaultAddress;
  const discount = appliedCoupon?.discount || 0;
  const finalPrice = Math.max(0, totalPrice - discount);

  const handleApplyCoupon = () => {
    setCouponError("");
    if (!couponCode.trim()) return;
    const coupon = validateCoupon(couponCode.trim().toUpperCase(), totalPrice);
    if (coupon) {
      setAppliedCoupon({ code: coupon.code, discount: coupon.discount });
      setCouponCode("");
      toast.success(`优惠券 ${coupon.code} 已应用，节省 ¥${coupon.discount}`);
    } else {
      setCouponError("优惠券无效、已使用、已过期或未达到最低消费金额");
      toast.error("优惠券应用失败");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError("");
  };

  const handlePay = () => {
    if (!selectedAddress) {
      toast.error("请选择收货地址");
      return;
    }
    setProcessing(true);
    setStep("processing");
    setTimeout(() => {
      if (appliedCoupon) {
        markCouponUsed(appliedCoupon.code);
      }
      addOrder(items, finalPrice, totalItems);
      clearCart();
      setProcessing(false);
      setStep("success");
      toast.success("订单支付成功！");
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
      <Breadcrumb items={[{ label: "购物车", href: "/cart" }, { label: "结算" }]} />
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

          {/* 收货地址 */}
          <div className="rounded-xl border p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                收货地址
              </h3>
              {addresses.length > 0 && (
                <Button variant="ghost" size="sm" onClick={() => setShowAddressList(!showAddressList)} aria-label={showAddressList ? "收起地址列表" : "展开地址列表"} aria-expanded={showAddressList}>
                  {showAddressList ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              )}
            </div>
            {selectedAddress ? (
              <div className="mt-2 text-sm">
                <p className="font-medium">{selectedAddress.name} {selectedAddress.phone}</p>
                <p className="text-muted-foreground">{selectedAddress.province} {selectedAddress.city} {selectedAddress.district} {selectedAddress.detail}</p>
              </div>
            ) : (
              <div className="mt-2 text-sm text-muted-foreground">
                <p>暂无收货地址</p>
                <Link href="/profile/addresses">
                  <Button variant="link" size="sm" className="px-0">去添加地址</Button>
                </Link>
              </div>
            )}
            {showAddressList && addresses.length > 0 && (
              <div className="mt-3 space-y-2">
                {addresses.map((addr) => (
                  <button
                    key={addr.id}
                    onClick={() => { setSelectedAddressId(addr.id); setShowAddressList(false); }}
                    className={`w-full text-left rounded-lg border p-3 text-sm transition-colors ${
                      selectedAddressId === addr.id ? "border-primary bg-primary/5" : "hover:bg-muted"
                    }`}
                  >
                    <p className="font-medium">{addr.name} {addr.phone}</p>
                    <p className="text-muted-foreground">{addr.province} {addr.city} {addr.district} {addr.detail}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 优惠券 */}
          <div className="rounded-xl border p-4 mt-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <Tag className="h-4 w-4" />
                优惠券
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setShowCouponList(!showCouponList)} aria-label={showCouponList ? "收起优惠券列表" : "展开优惠券列表"} aria-expanded={showCouponList}>
                {showCouponList ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
            {appliedCoupon ? (
              <div className="mt-2 flex items-center justify-between">
                <Badge variant="outline" className="gap-1 text-green-600 border-green-200">
                  <Tag className="h-3 w-3" />
                  {appliedCoupon.code} -¥{appliedCoupon.discount}
                </Badge>
                <Button variant="ghost" size="sm" onClick={handleRemoveCoupon} aria-label="移除优惠券">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="输入优惠码"
                  aria-label="优惠码"
                  className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                  onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                />
                <Button size="sm" onClick={handleApplyCoupon}>应用</Button>
              </div>
            )}
            {couponError && <p className="mt-2 text-xs text-red-500">{couponError}</p>}
            {showCouponList && (
              <div className="mt-3 space-y-2">
                <p className="text-xs text-muted-foreground">可用优惠券：</p>
                {coupons.filter((c) => !c.used && new Date(c.expiryDate) > new Date() && totalPrice >= c.minOrderAmount).map((c) => (
                  <button
                    key={c.id}
                    onClick={() => { setCouponCode(c.code); setShowCouponList(false); }}
                    className="w-full text-left rounded-lg border p-3 text-sm hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{c.code}</span>
                      <span className="text-green-600">-¥{c.discount}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">满¥{c.minOrderAmount}可用，有效期至 {c.expiryDate}</p>
                  </button>
                ))}
                {coupons.filter((c) => !c.used && new Date(c.expiryDate) > new Date() && totalPrice >= c.minOrderAmount).length === 0 && (
                  <p className="text-xs text-muted-foreground">暂无可用的优惠券</p>
                )}
              </div>
            )}
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

          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">商品总额</span>
              <span>¥{totalPrice.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">运费</span>
              <span className="text-green-600">免运费</span>
            </div>
            {appliedCoupon && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">优惠券 ({appliedCoupon.code})</span>
                <span className="text-green-600">-¥{appliedCoupon.discount}</span>
              </div>
            )}
            <Separator />
            <div className="flex items-center justify-between text-lg font-bold">
              <span>合计</span>
              <span>¥{finalPrice.toLocaleString()}</span>
            </div>
          </div>

          <Button
            className="w-full mt-8 gap-2"
            size="lg"
            onClick={handlePay}
            disabled={processing || items.length === 0}
          >
            <CreditCard className="h-5 w-5" />
            确认支付
          </Button>
        </>
      )}
    </div>
  );
}
