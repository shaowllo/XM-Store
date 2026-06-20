"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Truck, Shield, Clock, CheckCircle, ShoppingBag, MapPin, Wallet } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { useOrders } from "@/components/order-provider";
import { useUser } from "@/components/user-provider";
import { EmptyState } from "@/components/empty-state";
import { Breadcrumb } from "@/components/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import type { ShippingAddress } from "@/lib/types";

export default function CheckoutPage() {
  const t = useTranslations("checkout");
  const to = useTranslations("order");
  const tc = useTranslations("cart");
  const { user } = useUser();
  const router = useRouter();
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const { addOrder } = useOrders();
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState<"review" | "processing" | "success">("review");
  const [errors, setErrors] = useState<Partial<Record<keyof ShippingAddress, string>>>({});

  const [formData, setFormData] = useState<ShippingAddress>({
    fullName: "",
    phone: "",
    province: "",
    city: "",
    district: "",
    street: "",
    landmark: "",
  });

  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/checkout");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const requiredFields: (keyof ShippingAddress)[] = [
    "fullName",
    "phone",
    "province",
    "city",
    "district",
    "street",
  ];

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ShippingAddress, string>> = {};
    for (const field of requiredFields) {
      if (!formData[field]?.trim()) {
        newErrors[field] = to("required");
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof ShippingAddress, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = () => {
    if (!validate()) {
      toast.error("Please fill in all required fields");
      return;
    }
    setProcessing(true);
    setStep("processing");
    setTimeout(() => {
      addOrder(items, totalPrice, totalItems, "cod", formData);
      clearCart();
      setProcessing(false);
      setStep("success");
      toast.success("Order placed successfully!");
    }, 1500);
  };

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
          <p className="mt-2 text-muted-foreground">
            Your order has been confirmed. You will pay upon delivery (Cash on Delivery).
          </p>
          <div className="mt-8 flex gap-3 justify-center">
            <Link href="/orders">
              <Button className="rounded-full">View Orders</Button>
            </Link>
            <Link href="/products">
              <Button variant="outline" className="rounded-full">{tc("continueShopping")}</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const fieldLabel = (field: keyof ShippingAddress): string => {
    const labels: Record<keyof ShippingAddress, string> = {
      fullName: "Full Name",
      phone: "Phone Number",
      province: "Province / Region",
      city: "City",
      district: "District",
      street: "Street / Building",
      landmark: "Landmark (optional)",
    };
    return labels[field];
  };

  const fieldPlaceholder = (field: keyof ShippingAddress): string => {
    const placeholders: Record<keyof ShippingAddress, string> = {
      fullName: "e.g. Ahmad Al-Farsi",
      phone: "e.g. +966 55 123 4567",
      province: "e.g. Riyadh Province",
      city: "e.g. Riyadh",
      district: "e.g. Al-Malaz",
      street: "e.g. King Fahd Road, Building 42",
      landmark: "e.g. Near Al-Faisal Tower",
    };
    return placeholders[field];
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
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
            <p className="mt-4 text-muted-foreground">Processing your order...</p>
          </div>
        ) : (
          <div className="mt-10 grid gap-10 lg:grid-cols-5">
            {/* Left: Address Form + Payment */}
            <div className="lg:col-span-3 space-y-8">
              {/* Shipping Address Form */}
              <section>
                <div className="flex items-center gap-2 mb-5">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <h2 className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                    Shipping Address
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(["fullName", "phone"] as const).map((field) => (
                    <div key={field}>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                        {fieldLabel(field)}
                        {requiredFields.includes(field) && <span className="text-red-500 ml-0.5">*</span>}
                      </label>
                      <input
                        type={field === "phone" ? "tel" : "text"}
                        value={formData[field]}
                        onChange={(e) => handleChange(field, e.target.value)}
                        placeholder={fieldPlaceholder(field)}
                        aria-label={fieldLabel(field)}
                        className={`w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-foreground/20 ${
                          errors[field] ? "border-red-400" : ""
                        }`}
                      />
                      {errors[field] && <p className="mt-1 text-xs text-red-500">{errors[field]}</p>}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                  {(["province", "city", "district"] as const).map((field) => (
                    <div key={field}>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                        {fieldLabel(field)}
                        {requiredFields.includes(field) && <span className="text-red-500 ml-0.5">*</span>}
                      </label>
                      <input
                        type="text"
                        value={formData[field]}
                        onChange={(e) => handleChange(field, e.target.value)}
                        placeholder={fieldPlaceholder(field)}
                        aria-label={fieldLabel(field)}
                        className={`w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-foreground/20 ${
                          errors[field] ? "border-red-400" : ""
                        }`}
                      />
                      {errors[field] && <p className="mt-1 text-xs text-red-500">{errors[field]}</p>}
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                    {fieldLabel("street")}
                    <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.street}
                    onChange={(e) => handleChange("street", e.target.value)}
                    placeholder={fieldPlaceholder("street")}
                    aria-label={fieldLabel("street")}
                    className={`w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-foreground/20 ${
                      errors.street ? "border-red-400" : ""
                    }`}
                  />
                  {errors.street && <p className="mt-1 text-xs text-red-500">{errors.street}</p>}
                </div>
                <div className="mt-4">
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                    {fieldLabel("landmark")}
                  </label>
                  <input
                    type="text"
                    value={formData.landmark ?? ""}
                    onChange={(e) => handleChange("landmark", e.target.value)}
                    placeholder={fieldPlaceholder("landmark")}
                    aria-label={fieldLabel("landmark")}
                    className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-foreground/20"
                  />
                </div>
              </section>

              {/* COD Payment */}
              <section>
                <div className="flex items-center gap-2 mb-5">
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                  <h2 className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                    Payment Method
                  </h2>
                </div>
                <div className="rounded-xl border border-foreground bg-foreground/5 p-4 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-foreground/10 flex items-center justify-center shrink-0">
                    <Wallet className="h-5 w-5 text-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Cash on Delivery (COD)</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Pay in cash when your order arrives at your door
                    </p>
                  </div>
                </div>
              </section>

              {/* Features */}
              <section className="pt-6 border-t space-y-4">
                <div className="flex items-center gap-4">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm">Fast Delivery</p>
                    <p className="text-xs text-muted-foreground">1-3 business days within city</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm">Pay on Delivery</p>
                    <p className="text-xs text-muted-foreground">Inspect before you pay</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm">Easy Returns</p>
                    <p className="text-xs text-muted-foreground">7-day return policy</p>
                  </div>
                </div>
              </section>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-2">
              <div className="lg:sticky lg:top-24 rounded-2xl border bg-card p-6 space-y-5">
                <h2 className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                  Order Summary ({totalItems} items)
                </h2>

                {/* Items */}
                <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.cartItemId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-3"
                    >
                      <div className="relative h-14 w-14 overflow-hidden rounded-lg bg-muted shrink-0">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          x{item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-semibold shrink-0">
                        ${(item.product.price * item.quantity).toLocaleString()}
                      </p>
                    </motion.div>
                  ))}
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">${totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                <Button
                  className="w-full rounded-full"
                  size="lg"
                  onClick={handleSubmit}
                  disabled={processing || items.length === 0}
                >
                  <Wallet className="h-5 w-5 mr-2" />
                  Place Order (COD)
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  By placing this order, you agree to our Terms of Service
                </p>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
