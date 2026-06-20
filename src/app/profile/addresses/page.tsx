"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { MapPin, Plus, Trash2, Star, X, Check } from "lucide-react";
import { useAddress, type Address } from "@/components/address-provider";
import { Breadcrumb } from "@/components/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Link from "next/link";

interface AddressFormData {
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detail: string;
  isDefault: boolean;
}

function validateAddress(data: AddressFormData): string | null {
  if (!data.name || data.name.length < 2) return "Name must be at least 2 characters";
  if (!data.phone) return "Please enter a phone number";
  if (!/^1[3-9]\d{9}$/.test(data.phone)) return "Please enter a valid phone number";
  if (!data.province) return "Please enter a province";
  if (!data.city) return "Please enter a city";
  if (!data.detail || data.detail.length < 5) return "Address must be at least 5 characters";
  return null;
}

function AddressForm({
  onSubmit,
  onCancel,
  initialData,
}: {
  onSubmit: (data: AddressFormData) => void;
  onCancel: () => void;
  initialData?: Address;
}) {
  const [form, setForm] = useState<AddressFormData>({
    name: initialData?.name || "",
    phone: initialData?.phone || "",
    province: initialData?.province || "",
    city: initialData?.city || "",
    district: initialData?.district || "",
    detail: initialData?.detail || "",
    isDefault: initialData?.isDefault || false,
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateAddress(form);
    if (validationError) {
      setError(validationError);
      return;
    }
    onSubmit(form);
    setError(null);
  };

  const updateField = (field: keyof AddressFormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      onSubmit={handleSubmit}
      className="relative overflow-hidden rounded-2xl border bg-card p-6 space-y-4"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <div className="relative">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{initialData ? "Edit Address" : "New Address"}</h3>
          <Button type="button" variant="ghost" size="icon" onClick={onCancel} className="rounded-lg">
            <X className="h-4 w-4" />
          </Button>
        </div>
        {error && (
          <div className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            className="rounded-xl"
          />
          <Input
            placeholder="Phone Number"
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            className="rounded-xl"
          />
          <Input
            placeholder="Province / Region"
            value={form.province}
            onChange={(e) => updateField("province", e.target.value)}
            className="rounded-xl"
          />
          <Input
            placeholder="City"
            value={form.city}
            onChange={(e) => updateField("city", e.target.value)}
            className="rounded-xl"
          />
          <Input
            placeholder="District"
            value={form.district}
            onChange={(e) => updateField("district", e.target.value)}
            className="rounded-xl"
          />
          <Input
            placeholder="Street / Building"
            value={form.detail}
            onChange={(e) => updateField("detail", e.target.value)}
            className="rounded-xl"
          />
        </div>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={form.isDefault}
            onChange={(e) => updateField("isDefault", e.target.checked)}
            className="rounded border-gray-300"
          />
          Set as default address
        </label>
        <div className="flex gap-3">
          <Button type="submit" className="gap-1 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity">
            <Check className="h-4 w-4" />
            Save
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} className="rounded-xl">
            Cancel
          </Button>
        </div>
      </div>
    </motion.form>
  );
}

export default function AddressesPage() {
  const t = useTranslations("profile");
  const { addresses, addAddress, removeAddress, setDefaultAddress } = useAddress();
  const [showForm, setShowForm] = useState(false);

  const handleAddAddress = (data: AddressFormData) => {
    addAddress(data);
    setShowForm(false);
    toast.success("Address added successfully");
  };

  const handleRemoveAddress = (id: string) => {
    removeAddress(id);
    toast.info("Address deleted");
  };

  const handleSetDefault = (id: string) => {
    setDefaultAddress(id);
    toast.success("Set as default address");
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Breadcrumb items={[{ label: "Profile", href: "/profile" }, { label: t("addresses") }]} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
            <MapPin className="h-4 w-4" />
            Address Management
          </span>
          <h1 className="text-3xl font-bold tracking-tight">{t("addresses")}</h1>
          <p className="mt-2 text-muted-foreground">Manage your shipping addresses</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="gap-1 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" />
          {t("addAddress")}
        </Button>
      </motion.div>

      <AnimatePresence>
        {showForm && (
          <div className="mt-6">
            <AddressForm onSubmit={handleAddAddress} onCancel={() => setShowForm(false)} />
          </div>
        )}
      </AnimatePresence>

      <div className="mt-6 space-y-4">
        {addresses.length === 0 && !showForm && (
          <div className="text-center py-16 rounded-2xl border bg-card">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mx-auto mb-4">
              <MapPin className="h-8 w-8 text-primary" />
            </div>
            <p className="text-muted-foreground">{t("noAddresses")}</p>
            <Button
              variant="outline"
              className="mt-4 gap-1 rounded-xl"
              onClick={() => setShowForm(true)}
            >
              <Plus className="h-4 w-4" />
              {t("addAddress")}
            </Button>
          </div>
        )}

        <AnimatePresence>
          {addresses.map((address) => (
            <motion.div
              key={address.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="p-5 hover:shadow-lg hover:shadow-primary/5 transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{address.name}</span>
                      <span className="text-sm text-muted-foreground">{address.phone}</span>
                      {address.isDefault && (
                        <span className="inline-flex items-center gap-0.5 text-xs bg-gradient-to-r from-primary to-accent text-white px-2.5 py-1 rounded-full">
                          <Star className="h-3 w-3 fill-white" />
                          {t("defaultAddress")}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {address.province} {address.city} {address.district} {address.detail}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!address.isDefault && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSetDefault(address.id)}
                        className="rounded-lg"
                      >
                        {t("setDefault")}
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveAddress(address.id)}
                      className="rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-8">
        <Link href="/profile">
          <Button variant="outline" className="rounded-xl">Back to Profile</Button>
        </Link>
      </div>
    </div>
  );
}
