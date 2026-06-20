export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  tags: string[];
  rating: number;
  reviews: number;
  badge?: string;
  colors?: string[];
}

export interface Category {
  id: string;
  name: string;
}

export interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  color: string;
  productId: string;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export type OrderStatus =
  | 'pending'
  | 'cod_confirmed'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cod_paid'
  | 'cancelled';

export interface ShippingAddress {
  fullName: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  street: string;
  landmark?: string;
}

import type { CartItem } from "@/components/cart-provider";

export interface Order {
  id: string;
  items: CartItem[];
  totalPrice: number;
  totalItems: number;
  status: OrderStatus;
  createdAt: string;
  shippedAt?: string;
  deliveredAt?: string;
  paymentMethod?: 'cod';
  shippingAddress?: ShippingAddress;
  trackingNumber?: string;
}
