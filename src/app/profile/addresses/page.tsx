"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Plus, Trash2, Star, X, Check } from "lucide-react";
import { useAddress, type Address } from "@/components/address-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Link from "next/link";

function AddressForm({
  onSubmit,
  onCancel,
  initialData,
}: {
  onSubmit: (data: Omit<Address, "id">) => void;
  onCancel: () => void;
  initialData?: Address;
}) {
  const [form, setForm] = useState({
    name: initialData?.name || "",
    phone: initialData?.phone || "",
    province: initialData?.province || "",
    city: initialData?.city || "",
    district: initialData?.district || "",
    detail: initialData?.detail || "",
    isDefault: initialData?.isDefault || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.province || !form.city || !form.detail) return;
    onSubmit(form);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      onSubmit={handleSubmit}
      className="rounded-xl border bg-card p-6 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{initialData ? "编辑地址" : "新增地址"}</h3>
        <Button type="button" variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          placeholder="收货人姓名"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <Input
          placeholder="手机号码"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          required
        />
        <Input
          placeholder="省"
          value={form.province}
          onChange={(e) => setForm({ ...form, province: e.target.value })}
          required
        />
        <Input
          placeholder="市"
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
          required
        />
        <Input
          placeholder="区/县"
          value={form.district}
          onChange={(e) => setForm({ ...form, district: e.target.value })}
        />
        <Input
          placeholder="详细地址"
          value={form.detail}
          onChange={(e) => setForm({ ...form, detail: e.target.value })}
          required
        />
      </div>
      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={form.isDefault}
          onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
          className="rounded border-gray-300"
        />
        设为默认地址
      </label>
      <div className="flex gap-3">
        <Button type="submit" className="gap-1">
          <Check className="h-4 w-4" />
          保存
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          取消
        </Button>
      </div>
    </motion.form>
  );
}

export default function AddressesPage() {
  const { addresses, addAddress, removeAddress, setDefaultAddress } = useAddress();
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">收货地址</h1>
          <p className="mt-1 text-muted-foreground">管理您的收货地址</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-1">
          <Plus className="h-4 w-4" />
          新增地址
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <div className="mt-6">
            <AddressForm
              onSubmit={(data) => {
                addAddress(data);
                setShowForm(false);
              }}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}
      </AnimatePresence>

      <div className="mt-6 space-y-4">
        {addresses.length === 0 && !showForm && (
          <div className="text-center py-16">
            <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">暂无收货地址</p>
            <Button variant="outline" className="mt-4 gap-1" onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4" />
              添加地址
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
              <Card className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{address.name}</span>
                      <span className="text-sm text-muted-foreground">{address.phone}</span>
                      {address.isDefault && (
                        <span className="inline-flex items-center gap-0.5 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                          <Star className="h-3 w-3 fill-primary" />
                          默认
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
                        onClick={() => setDefaultAddress(address.id)}
                      >
                        设为默认
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeAddress(address.id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
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
          <Button variant="outline">返回个人中心</Button>
        </Link>
      </div>
    </div>
  );
}
