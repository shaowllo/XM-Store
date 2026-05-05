"use client";

import { CartProvider } from "@/components/cart-provider";
import { WishlistProvider } from "@/components/wishlist-provider";
import { OrderProvider } from "@/components/order-provider";
import { UserProvider } from "@/components/user-provider";
import { AddressProvider } from "@/components/address-provider";
import { CouponProvider } from "@/components/coupon-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <AddressProvider>
        <CouponProvider>
          <CartProvider>
            <WishlistProvider>
              <OrderProvider>
                {children}
              </OrderProvider>
            </WishlistProvider>
          </CartProvider>
        </CouponProvider>
      </AddressProvider>
    </UserProvider>
  );
}
