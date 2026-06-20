"use client";

import React, { createContext, useContext, useCallback, useMemo } from "react";
import { useUser } from "./user-provider";
import { useLocalStorage } from "@/hooks/use-local-storage";

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
  const ADDRESSES_KEY = `xmstore-addresses-${userId}`;
  const [addresses, setAddresses] = useLocalStorage<Address[]>(ADDRESSES_KEY, []);

  const addAddress = useCallback((address: Omit<Address, "id">) => {
    const newAddress: Address = { id: `addr-${Date.now()}`, ...address };
    setAddresses((prev) => {
      if (newAddress.isDefault) {
        return [...prev.map((a) => ({ ...a, isDefault: false })), newAddress];
      }
      return [...prev, newAddress];
    });
  }, [setAddresses]);

  const updateAddress = useCallback((id: string, address: Partial<Address>) => {
    setAddresses((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        const updated = { ...a, ...address };
        return updated;
      })
    );
  }, [setAddresses]);

  const removeAddress = useCallback((id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  }, [setAddresses]);

  const setDefaultAddress = useCallback((id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
  }, [setAddresses]);

  const defaultAddress = addresses.find((a) => a.isDefault);

  const contextValue = useMemo(
    () => ({ addresses, addAddress, updateAddress, removeAddress, setDefaultAddress, defaultAddress }),
    [addresses, addAddress, updateAddress, removeAddress, setDefaultAddress, defaultAddress]
  );

  return (
    <AddressContext.Provider value={contextValue}>
      {children}
    </AddressContext.Provider>
  );
}

export function useAddress() {
  const context = useContext(AddressContext);
  if (!context) throw new Error("useAddress must be used within AddressProvider");
  return context;
}
