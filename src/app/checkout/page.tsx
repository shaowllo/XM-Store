"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("checkout");
  const tc = useTranslations("cart");
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
        <Breadcrumb items={[{ label: tc("title"), href: "/cart" }, { label: t("title") }]} />
        <EmptyState
          icon={ShoppingBag}
          title={tc("empty")}
          description="Add items to your cart before checkout"
          action={{ label: tc("continueShopping"), href: "/products", icon: <ShoppingBag className="h-4 w-4" /> }}
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
      toast.success(`Coupon ${coupon.code} applied! You saved ¥${coupon.discount}`);
    } else {
      setCouponError("Invalid, expired, or minimum not met");
      toast.error("Failed to apply coupon");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError("");
  };

  const handlePay = () => {
    if (!selectedAddress) {
      toast.error("Please select a shipping address");
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
      toast.success("Order placed successfully!");
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
          <h1 className="text-2xl font-bold">{t("orderConfirmed")}</h1>
          <p className="mt-2 text-muted-foreground">Your order has been confirmed and will be shipped soon.</p>
          <div className="mt-8 flex gap-3 justify-center">
            <Link href="/orders">
              <Button className="rounded-full">
                View Orders
              </Button>
            </Link>
            <Link href="/products">
              <Button variant="outline" className="rounded-full">{tc("continueShopping")}</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: tc("title"), href: "/cart" }, { label: t("title") }]} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Checkout
        </span>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">
          {step === "processing" ? "Processing..." : t("title")}
        </h1>

        {step === "processing" ? (
          <div className="mt-12 flex flex-col items-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="h-12 w-12 rounded-full border-4 border-foreground border-t-transparent"
            />
            <p className="mt-4 text-muted-foreground">Processing your payment...</p>
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
                        <span className="text-xs text-muted-foreground">Selected</span>
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
                    aria-label={showAddressList ? "Collapse address list" : "Expand address list"}
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
                  <p>No shipping address</p>
                  <Link href="/profile/addresses">
                    <Button variant="link" size="sm" className="px-0">Add address</Button>
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
                  aria-label={showCouponList ? "Collapse coupon list" : "Expand coupon list"}
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
                    aria-label="Remove coupon"
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
                    placeholder="Enter coupon code"
                    aria-label="Coupon code"
                    className="flex-1 rounded-full border bg-background px-5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
                    onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                  />
                  <Button size="sm" className="rounded-full px-6" onClick={handleApplyCoupon}>Apply</Button>
                </div>
              )}
              {couponError && <p className="mt-2 text-xs text-red-500">{couponError}</p>}
              {showCouponList && (
                <div className="mt-3 space-y-2">
                  <p className="text-xs text-muted-foreground">Available coupons:</p>
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
                      <p className="text-xs text-muted-foreground mt-1">Min order: ¥{c.minOrderAmount}, expires: {c.expiryDate}</p>
                    </button>
                  ))}
                  {availableCoupons.length === 0 && (
                    <p className="text-xs text-muted-foreground">No coupons available</p>
                  )}
                </div>
              )}
            </div>

            {/* Features */}
            <div className="mt-10 pt-10 border-t space-y-4">
              <div className="flex items-center gap-4">
                <Truck className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm">Fast Delivery</p>
                  <p className="text-xs text-muted-foreground">1-3 business days</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm">Genuine Products</p>
                  <p className="text-xs text-muted-foreground">7-day returns</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm">After-sales Support</p>
                  <p className="text-xs text-muted-foreground">Dedicated support</p>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="mt-10 pt-10 border-t space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">¥{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              {appliedCoupon && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Coupon ({appliedCoupon.code})</span>
                  <span className="text-green-600 font-medium">-¥{appliedCoupon.discount}</span>
                </div>
              )}
              <Separator />
              <div className="flex items-center justify-between text-lg font-bold">
                <span>Total</span>
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
              {t("placeOrder")}
            </Button>
          </>
        )}
      </motion.div>
    </div>
  );
}
