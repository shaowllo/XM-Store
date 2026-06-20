"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { CreditCard, Truck, Shield, Clock, CheckCircle, ShoppingBag, Tag, ChevronDown, ChevronUp, X } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { useOrders } from "@/components/order-provider";
import { useAddress } from "@/components/address-provider";
import { useCoupon as useCouponContext } from "@/components/coupon-provider";
import { EmptyState } from "@/components/empty-state";
import { Breadcrumb } from "@/components/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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

  const availableCoupons = useMemo(() =>
    coupons.filter((c) => !c.used && new Date(c.expiryDate) > new Date() && totalPrice >= c.minOrderAmount),
    [coupons, totalPrice]
  );

  if (items.length === 0 && step !== "success") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
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
      <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center py-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="mx-auto h-20 w-20 rounded-full bg-foreground flex items-center justify-center mb-6"
          >
            <CheckCircle className="h-10 w-10 text-background" />
          </motion.div>
          <h1 className="text-2xl font-bold">支付成功</h1>
          <p className="mt-2 text-muted-foreground">您的订单已确认，我们将尽快为您发货</p>
          <div className="mt-8 flex gap-3 justify-center">
            <Link href="/orders">
              <Button className="rounded-full">
                查看订单
              </Button>
            </Link>
            <Link href="/products">
              <Button variant="outline" className="rounded-full">继续购物</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: "购物车", href: "/cart" }, { label: "结算" }]} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Checkout
        </span>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">
          {step === "processing" ? "处理中..." : "结算"}
        </h1>

        {step === "processing" ? (
          <div className="mt-12 flex flex-col items-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="h-12 w-12 rounded-full border-4 border-foreground border-t-transparent"
            />
            <p className="mt-4 text-muted-foreground">正在处理您的支付...</p>
          </div>
        ) : (
          <>
            {/* Order Items */}
            <div className="mt-10 space-y-4">
              {items.map((item, index) => (
                <motion.div
                  key={item.cartItemId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
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
                        <span className="text-xs text-muted-foreground">已选颜色</span>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      x{item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-sm">
                    ¥{(item.product.price * item.quantity).toLocaleString()}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Address */}
            <div className="mt-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                  Shipping Address
                </h3>
                {addresses.length > 0 && (
                  <button
                    onClick={() => setShowAddressList(!showAddressList)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showAddressList ? "收起地址列表" : "展开地址列表"}
                    aria-expanded={showAddressList}
                  >
                    {showAddressList ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                )}
              </div>
              {selectedAddress ? (
                <div className="text-sm">
                  <p className="font-medium">{selectedAddress.name} {selectedAddress.phone}</p>
                  <p className="text-muted-foreground mt-0.5">{selectedAddress.province} {selectedAddress.city} {selectedAddress.district} {selectedAddress.detail}</p>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
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
                      className={`w-full text-left rounded-xl border p-4 text-sm transition-all ${
                        selectedAddressId === addr.id ? "border-foreground bg-foreground/5" : "hover:bg-muted"
                      }`}
                    >
                      <p className="font-medium">{addr.name} {addr.phone}</p>
                      <p className="text-muted-foreground">{addr.province} {addr.city} {addr.district} {addr.detail}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Coupon */}
            <div className="mt-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                  Coupon
                </h3>
                <button
                  onClick={() => setShowCouponList(!showCouponList)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showCouponList ? "收起优惠券列表" : "展开优惠券列表"}
                  aria-expanded={showCouponList}
                >
                  {showCouponList ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
              </div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium">
                    <Tag className="h-3.5 w-3.5" />
                    {appliedCoupon.code} -¥{appliedCoupon.discount}
                  </span>
                  <button
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    onClick={handleRemoveCoupon}
                    aria-label="移除优惠券"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="输入优惠码"
                    aria-label="优惠码"
                    className="flex-1 rounded-full border bg-background px-5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
                    onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                  />
                  <Button size="sm" className="rounded-full px-6" onClick={handleApplyCoupon}>应用</Button>
                </div>
              )}
              {couponError && <p className="mt-2 text-xs text-red-500">{couponError}</p>}
              {showCouponList && (
                <div className="mt-3 space-y-2">
                  <p className="text-xs text-muted-foreground">可用优惠券：</p>
                  {availableCoupons.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => { setCouponCode(c.code); setShowCouponList(false); }}
                      className="w-full text-left rounded-xl border p-4 text-sm hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{c.code}</span>
                        <span className="font-semibold">-¥{c.discount}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">满¥{c.minOrderAmount}可用，有效期至 {c.expiryDate}</p>
                    </button>
                  ))}
                  {availableCoupons.length === 0 && (
                    <p className="text-xs text-muted-foreground">暂无可用的优惠券</p>
                  )}
                </div>
              )}
            </div>

            {/* Features */}
            <div className="mt-10 pt-10 border-t space-y-4">
              <div className="flex items-center gap-4">
                <Truck className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm">极速配送</p>
                  <p className="text-xs text-muted-foreground">预计 1-3 个工作日送达</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm">正品保障</p>
                  <p className="text-xs text-muted-foreground">7 天无理由退换</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm">售后无忧</p>
                  <p className="text-xs text-muted-foreground">专业客服支持</p>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="mt-10 pt-10 border-t space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">商品总额</span>
                <span className="font-medium">¥{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">运费</span>
                <span className="text-green-600 font-medium">免运费</span>
              </div>
              {appliedCoupon && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">优惠券 ({appliedCoupon.code})</span>
                  <span className="text-green-600 font-medium">-¥{appliedCoupon.discount}</span>
                </div>
              )}
              <Separator />
              <div className="flex items-center justify-between text-lg font-bold">
                <span>合计</span>
                <span>¥{finalPrice.toLocaleString()}</span>
              </div>
            </div>

            <Button
              className="w-full mt-10 rounded-full"
              size="lg"
              onClick={handlePay}
              disabled={processing || items.length === 0}
            >
              <CreditCard className="h-5 w-5 mr-2" />
              确认支付
            </Button>
          </>
        )}
      </motion.div>
    </div>
  );
}
