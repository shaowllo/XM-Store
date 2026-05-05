"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useUser } from "./user-provider";

export interface Address {
  id: string;
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detail: string;
  isDefault: boolean;
}

interface AddressContextType {
  addresses: Address[];
  addAddress: (address: Omit<Address, "id">) => void;
  updateAddress: (id: string, address: Partial<Address>) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  defaultAddress: Address | undefined;
}

const AddressContext = createContext<AddressContextType | undefined>(undefined);

export function AddressProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const userId = user?.id || "guest";
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const init = () => {
      try {
        const saved = localStorage.getItem(`xmstore-addresses-${userId}`);
        if (saved) {
          setAddresses(JSON.parse(saved));
        }
      } catch (e) {
        console.error("Failed to load addresses from localStorage", e);
      }
      setIsHydrated(true);
    };
    const timer = setTimeout(init, 0);
    return () => clearTimeout(timer);
  }, [userId]);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(`xmstore-addresses-${userId}`, JSON.stringify(addresses));
    }
  }, [addresses, isHydrated, userId]);

  const addAddress = useCallback((address: Omit<Address, "id">) => {
    const newAddress: Address = { id: `addr-${Date.now()}`, ...address };
    setAddresses((prev) => {
      if (newAddress.isDefault) {
        return [...prev.map((a) => ({ ...a, isDefault: false })), newAddress];
      }
      return [...prev, newAddress];
    });
  }, []);

  const updateAddress = useCallback((id: string, address: Partial<Address>) => {
    setAddresses((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        const updated = { ...a, ...address };
        return updated;
      })
    );
  }, []);

  const removeAddress = useCallback((id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const setDefaultAddress = useCallback((id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
  }, []);

  const defaultAddress = addresses.find((a) => a.isDefault);

  return (
    <AddressContext.Provider
      value={{ addresses, addAddress, updateAddress, removeAddress, setDefaultAddress, defaultAddress }}
    >
      {children}
    </AddressContext.Provider>
  );
}

export function useAddress() {
  const context = useContext(AddressContext);
  if (!context) throw new Error("useAddress must be used within AddressProvider");
  return context;
}
