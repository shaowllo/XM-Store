# XM Store 外贸独立站改造 — 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 XM Store 从中文科技数码电商站改造为面向中东市场的英语外贸独立站，支持 COD 支付和 Aramex 物流集成。

**Architecture:** 在现有 Next.js 14 App Router + React Context + LocalStorage 架构上增量改造。引入 next-intl 管理英文文本，翻译产品数据为英语/USD，扩展订单状态支持 COD 流程，新增物流适配层对接 Aramex。

**Tech Stack:** next-intl, Next.js 14, React 18, TypeScript, Tailwind CSS

---

## 文件结构

| 文件 | 类型 | 职责 |
|------|------|------|
| `messages/en.json` | 新增 | 英文 UI 文本翻译键值对 |
| `src/i18n/request.ts` | 新增 | next-intl 请求配置 |
| `next.config.mjs` | 修改 | 添加 next-intl 插件 |
| `src/app/layout.tsx` | 修改 | 集成 NextIntlClientProvider |
| `src/lib/data.ts` | 修改 | 产品英文名、描述 + USD 价格 |
| `src/lib/constants.ts` | 修改 | 分类/特性英文 |
| `src/lib/types.ts` | 修改 | 订单状态新增 COD 枚举值 |
| `src/components/order-provider.tsx` | 修改 | COD 状态流转逻辑 |
| `src/app/checkout/page.tsx` | 修改 | COD 支付选项 + 中东地址格式 |
| `src/app/orders/[id]/page.tsx` | 修改 | 物流追踪展示 |
| `src/lib/shipping/adapter.ts` | 新增 | 物流适配器接口定义 |
| `src/lib/shipping/aramex.ts` | 新增 | Aramex API 实现 |
| `src/app/api/shipping/aramex/route.ts` | 新增 | Aramex API Route 代理 |
| 所有含中文 UI 文本的组件 | 修改 | 替换为 `useTranslations` hook |

---

### Task 1: 安装 next-intl 并创建 i18n 基础设施

**Files:**
- Modify: `package.json`
- Create: `src/i18n/request.ts`
- Create: `messages/en.json`
- Modify: `next.config.mjs`

- [ ] **Step 1: 安装 next-intl**

Run: `npm install next-intl`

Expected: package.json 中新增 next-intl 依赖

- [ ] **Step 2: 创建 i18n request 配置**

Create `src/i18n/request.ts`:

```typescript
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
  const locale = 'en';

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
```

- [ ] **Step 3: 创建英文翻译文件**

Create `messages/en.json` with initial content:

```json
{
  "common": {
    "siteName": "XM Store",
    "loading": "Loading...",
    "error": "Something went wrong",
    "backToHome": "Back to Home",
    "submit": "Submit",
    "cancel": "Cancel",
    "save": "Save",
    "delete": "Delete",
    "edit": "Edit",
    "search": "Search",
    "noResults": "No results found",
    "viewAll": "View All"
  },
  "nav": {
    "home": "Home",
    "products": "Products",
    "about": "About",
    "orders": "My Orders",
    "wishlist": "Wishlist",
    "profile": "Profile",
    "login": "Login",
    "register": "Register",
    "logout": "Logout",
    "cart": "Cart",
    "searchPlaceholder": "Search products..."
  },
  "home": {
    "heroTitle": "Premium Tech, Delivered to Your Doorstep",
    "heroSubtitle": "Discover the latest in smartphones, audio, wearables, and smart home devices — with fast shipping across the Middle East.",
    "shopNow": "Shop Now",
    "categories": "Shop by Category",
    "featuredProducts": "Featured Products",
    "newArrivals": "New Arrivals",
    "promoBanner": "Free shipping on orders over $200",
    "newsletter": "Subscribe to our newsletter",
    "newsletterPlaceholder": "Enter your email",
    "subscribe": "Subscribe"
  },
  "product": {
    "addToCart": "Add to Cart",
    "removeFromCart": "Remove",
    "outOfStock": "Out of Stock",
    "quantity": "Quantity",
    "total": "Total",
    "description": "Description",
    "specifications": "Specifications",
    "reviews": "Reviews",
    "relatedProducts": "Related Products",
    "color": "Color",
    "price": "Price",
    "soldBy": "Sold by XM Store",
    "freeShipping": "Free Shipping",
    "badgeNew": "New",
    "badgeSale": "Sale",
    "badgePopular": "Popular",
    "categories": {
      "all": "All",
      "phones": "Phones",
      "audio": "Audio",
      "wearables": "Wearables",
      "computers": "Computers",
      "smartHome": "Smart Home"
    },
    "sortBy": "Sort by",
    "sortDefault": "Default",
    "sortPriceLow": "Price: Low to High",
    "sortPriceHigh": "Price: High to Low",
    "sortRating": "Best Rated",
    "gridView": "Grid View",
    "listView": "List View"
  },
  "cart": {
    "title": "Shopping Cart",
    "empty": "Your cart is empty",
    "continueShopping": "Continue Shopping",
    "subtotal": "Subtotal",
    "checkout": "Checkout",
    "itemAdded": "Added to cart",
    "itemRemoved": "Removed from cart"
  },
  "checkout": {
    "title": "Checkout",
    "shippingAddress": "Shipping Address",
    "fullName": "Full Name",
    "phone": "Phone Number",
    "province": "Province / Region",
    "city": "City",
    "district": "District",
    "street": "Street / Building",
    "landmark": "Landmark (optional)",
    "orderSummary": "Order Summary",
    "paymentMethod": "Payment Method",
    "cod": "Cash on Delivery (COD)",
    "codDescription": "Pay in cash when your order arrives. No extra fees.",
    "totalAmount": "Total Amount",
    "placeOrder": "Place Order",
    "orderConfirmed": "Order Confirmed!",
    "orderNumber": "Order Number",
    "codInstructions": "Please prepare the exact amount in cash when the delivery arrives."
  },
  "order": {
    "title": "My Orders",
    "orderDetails": "Order Details",
    "orderDate": "Order Date",
    "status": "Status",
    "total": "Total",
    "items": "Items",
    "tracking": "Tracking",
    "trackingNumber": "Tracking Number",
    "noOrders": "No orders yet",
    "status_cod_confirmed": "Awaiting Confirmation",
    "status_out_for_delivery": "Out for Delivery",
    "status_delivered": "Delivered",
    "status_cod_paid": "Paid (COD)",
    "status_cancelled": "Cancelled",
    "status_pending": "Pending",
    "status_shipped": "Shipped"
  },
  "profile": {
    "title": "My Profile",
    "personalInfo": "Personal Information",
    "name": "Name",
    "email": "Email",
    "addresses": "My Addresses",
    "addAddress": "Add Address",
    "editAddress": "Edit Address",
    "defaultAddress": "Default",
    "setDefault": "Set as Default",
    "noAddresses": "No addresses yet"
  },
  "wishlist": {
    "title": "My Wishlist",
    "empty": "Your wishlist is empty",
    "addToCart": "Add to Cart"
  },
  "footer": {
    "aboutUs": "About Us",
    "contactUs": "Contact Us",
    "privacyPolicy": "Privacy Policy",
    "termsOfService": "Terms of Service",
    "refundPolicy": "Refund & Return Policy",
    "followUs": "Follow Us",
    "newsletter": "Subscribe for exclusive deals",
    "emailPlaceholder": "your@email.com",
    "subscribe": "Subscribe",
    "copyright": "© 2026 XM Store. All rights reserved.",
    "rights": "Premium tech products delivered across the Middle East."
  },
  "error": {
    "title": "Oops! Something went wrong",
    "description": "An unexpected error occurred. Please try again.",
    "retry": "Try Again",
    "notFound": "Page not found",
    "notFoundDescription": "The page you're looking for doesn't exist.",
    "goHome": "Go Home"
  },
  "search": {
    "title": "Search Products",
    "placeholder": "Search by product name...",
    "noResults": "No products found",
    "results": "Search Results"
  },
  "auth": {
    "login": "Login",
    "register": "Create Account",
    "name": "Full Name",
    "email": "Email Address",
    "password": "Password",
    "confirmPassword": "Confirm Password",
    "loginError": "Invalid email or password",
    "registerSuccess": "Account created successfully",
    "noAccount": "Don't have an account?",
    "hasAccount": "Already have an account?",
    "registerHere": "Register here",
    "loginHere": "Login here"
  }
}
```

- [ ] **Step 4: 修改 next.config.mjs**

Read current `next.config.mjs` first, then modify to add next-intl plugin:

```javascript
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [
      { hostname: 'images.unsplash.com' },
    ],
  },
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: true },
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
};

export default withNextIntl(nextConfig);
```

Note: next-intl 的 `output: 'export'` 配置需要验证兼容性。如果构建失败，可能需要调整。

- [ ] **Step 5: Commit**

```bash
git add package.json src/i18n/ messages/ next.config.mjs
git commit -m "feat: add next-intl i18n infrastructure"
```

---

### Task 2: 翻译产品数据和常量

**Files:**
- Modify: `src/lib/data.ts`
- Modify: `src/lib/constants.ts`

- [ ] **Step 1: 翻译产品数据**

Open `src/lib/data.ts` and translate all product names, descriptions, tags, and categories to English. Change `originalPrice` to reflect USD values (~7x conversion for display, or use reasonable US retail prices).

Key changes:
- Product names: e.g., "旗舰智能手机 Pro Max" → "Flagship Smartphone Pro Max"
- Descriptions: Translate all descriptions to English
- category values: `"手机"` → `"phones"`, `"音频"` → `"audio"`, etc.
- tags: Translate all tag values to English
- prices: ¥ → $ (use reasonable USD pricing, e.g., ¥899 → $129, ¥1299 → $179)

- [ ] **Step 2: 翻译常量**

Open `src/lib/constants.ts` and translate all category labels and feature lists to English.

Category labels:
```typescript
export const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'phones', label: 'Phones' },
  { value: 'audio', label: 'Audio' },
  { value: 'wearables', label: 'Wearables' },
  { value: 'computers', label: 'Computers' },
  { value: 'smartHome', label: 'Smart Home' },
] as const;
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/data.ts src/lib/constants.ts
git commit -m "feat: translate product data and constants to English + USD"
```

---

### Task 3: 集成 next-intl 到布局层

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: 读取当前 layout.tsx**

Read `src/app/layout.tsx` to understand current structure.

- [ ] **Step 2: 集成 NextIntlClientProvider**

Wrap the app content with `NextIntlClientProvider`:

```tsx
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
// ... existing imports

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            {/* ... existing content ... */}
          </ThemeProvider>
        </NextIntlClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: integrate next-intl into root layout"
```

---

### Task 4: 替换 UI 组件中的中文文本（Navbar、Footer、首页）

**Files:**
- Modify: `src/components/navbar.tsx`
- Modify: `src/components/footer.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/components/hero-carousel.tsx`
- Modify: `src/components/search-dialog.tsx`

- [ ] **Step 1: 替换 Navbar 文本**

Read `src/components/navbar.tsx` and replace all Chinese text with `useTranslations('nav')` calls:

```tsx
import { useTranslations } from 'next-intl';

export function Navbar() {
  const t = useTranslations('nav');
  // Replace "产品" with {t('products')}
  // Replace "关于" with {t('about')}
  // etc.
}
```

- [ ] **Step 2: 替换 Footer 文本**

Read `src/components/footer.tsx` and replace Chinese text with `useTranslations('footer')`.

- [ ] **Step 3: 替换首页文本**

Read `src/app/page.tsx` and replace Chinese text with `useTranslations('home')`.

- [ ] **Step 4: 替换 Hero Carousel 文本**

Read `src/components/hero-carousel.tsx` and replace text.

- [ ] **Step 5: 替换 Search Dialog 文本**

Read `src/components/search-dialog.tsx` and replace text.

- [ ] **Step 6: Commit**

```bash
git add src/components/navbar.tsx src/components/footer.tsx src/app/page.tsx src/components/hero-carousel.tsx src/components/search-dialog.tsx
git commit -m "feat: translate navbar, footer, homepage to English"
```

---

### Task 5: 替换产品相关组件中的中文文本

**Files:**
- Modify: `src/app/products/[id]/product-detail-client.tsx`
- Modify: `src/app/products/products-content.tsx`
- Modify: `src/components/product-card.tsx`

- [ ] **Step 1: 替换 products-content.tsx 文本**

Read file and replace category labels, sort labels, view toggle text with `useTranslations('product')`.

- [ ] **Step 2: 替换 product-detail-client.tsx 文本**

Read file and replace button text, section headings, badge text with `useTranslations('product')`.

- [ ] **Step 3: 替换 product-card.tsx 文本**

Read file and replace badge text, button text with `useTranslations('product')`.

- [ ] **Step 4: Commit**

```bash
git add src/app/products/ src/components/product-card.tsx
git commit -m "feat: translate product pages to English"
```

---

### Task 6: 替换结算、订单、用户中心组件中的中文文本

**Files:**
- Modify: `src/app/checkout/page.tsx`
- Modify: `src/app/orders/page.tsx`
- Modify: `src/app/orders/[id]/page.tsx`
- Modify: `src/app/profile/page.tsx`
- Modify: `src/app/profile/addresses/page.tsx`
- Modify: `src/app/wishlist/page.tsx`
- Modify: `src/app/login/page.tsx`
- Modify: `src/app/register/page.tsx`
- Modify: `src/app/about/page.tsx`

- [ ] **Step 1-9: 逐一替换各页面中文文本为 `useTranslations()`**

Each page gets translated. Use appropriate namespaces: `'checkout'`, `'order'`, `'profile'`, `'wishlist'`, `'auth'`, `'common'`.

- [ ] **Step 10: Commit**

```bash
git add src/app/checkout/ src/app/orders/ src/app/profile/ src/app/wishlist/ src/app/login/ src/app/register/ src/app/about/
git commit -m "feat: translate checkout, orders, profile, auth pages to English"
```

---

### Task 7: 扩展订单类型支持 COD

**Files:**
- Modify: `src/lib/types.ts`

- [ ] **Step 1: 添加 COD 订单状态**

Read `src/lib/types.ts` and extend the `OrderStatus` type:

```typescript
export type OrderStatus =
  | 'pending'
  | 'cod_confirmed'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cod_paid'
  | 'cancelled';
```

Also add payment info to Order type:

```typescript
export interface Order {
  id: string;
  items: CartItem[];
  totalPrice: number;
  totalItems: number;
  status: OrderStatus;
  createdAt: string;
  // New fields for COD
  paymentMethod: 'cod';
  shippingAddress: ShippingAddress;
  trackingNumber?: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  street: string;
  landmark?: string;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/types.ts
git commit -m "feat: add COD order status and shipping address types"
```

---

### Task 8: 更新 OrderProvider 支持 COD 流程

**Files:**
- Modify: `src/components/order-provider.tsx`

- [ ] **Step 1: 读取并修改 order-provider.tsx**

Read the current file and update:

```typescript
// Update addOrder to accept paymentMethod and shippingAddress
const addOrder = useCallback((
  items: CartItem[],
  totalPrice: number,
  totalItems: number,
  paymentMethod: 'cod' = 'cod',
  shippingAddress?: ShippingAddress
) => {
  const newOrder: Order = {
    id: generateId(),
    items,
    totalPrice,
    totalItems,
    status: 'cod_confirmed',
    createdAt: new Date().toISOString(),
    paymentMethod,
    shippingAddress,
  };
  const updated = [newOrder, ...orders];
  setOrders(updated);
  setStorageValue(updated);
  return newOrder;
}, [orders, userId]);

// Add updateTrackingNumber function
const updateTrackingNumber = useCallback((orderId: string, trackingNumber: string) => {
  setOrders(prev =>
    prev.map(order =>
      order.id === orderId
        ? { ...order, trackingNumber, status: 'out_for_delivery' as OrderStatus }
        : order
    )
  );
}, []);
```

- [ ] **Step 2: Commit**

```bash
git add src/components/order-provider.tsx
git commit -m "feat: update order provider for COD flow"
```

---

### Task 9: 改造结算页支持 COD + 中东地址

**Files:**
- Modify: `src/app/checkout/page.tsx`

- [ ] **Step 1: 读取当前 checkout page.tsx**

Read the current file to understand the form structure.

- [ ] **Step 2: 重写结算页**

Replace the checkout page with a COD-focused flow:

```tsx
'use client';

import { useTranslations } from 'next-intl';
import { useCart } from '@/components/cart-provider';
import { useOrder } from '@/components/order-provider';
import { useAddress } from '@/components/address-provider';
import { useUser } from '@/components/user-provider';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface CheckoutForm {
  fullName: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  street: string;
  landmark: string;
}

export default function CheckoutPage() {
  const t = useTranslations('checkout');
  const tOrder = useTranslations('order');
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const { addOrder } = useOrder();
  const { user } = useUser();
  const router = useRouter();
  const [form, setForm] = useState<CheckoutForm>({
    fullName: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    street: '',
    landmark: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [lastOrder, setLastOrder] = useState<any>(null);

  if (!user) {
    router.push('/login?redirect=/checkout');
    return null;
  }

  if (items.length === 0 && !submitted) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>
        <p>{t('empty', {}, { defaultMessage: 'Your cart is empty' })}</p>
        <Button onClick={() => router.push('/products')} className="mt-4">
          {t('continueShopping', {}, { defaultMessage: 'Continue Shopping' })}
        </Button>
      </div>
    );
  }

  if (submitted && lastOrder) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="text-green-500 text-6xl mb-4">✓</div>
          <h1 className="text-2xl font-bold mb-2">{t('orderConfirmed')}</h1>
          <p className="text-muted-foreground mb-6">
            {t('orderNumber')}: <strong>#{lastOrder.id}</strong>
          </p>
          <Card className="p-6 mb-6 text-left">
            <h3 className="font-semibold mb-2">{t('orderSummary')}</h3>
            <p className="text-sm text-muted-foreground">
              {tOrder('total')}: ${lastOrder.totalPrice.toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground">{t('codInstructions')}</p>
          </Card>
          <Button onClick={() => router.push('/orders')}>
            {tOrder('title')}
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const order = addOrder(items, totalPrice, totalItems, 'cod', form);
    setLastOrder(order);
    setSubmitted(true);
    clearCart();
    toast.success(t('orderConfirmed'));
  };

  // Render form with COD payment option and shipping address fields
  // ... (render the form with all the input fields)
}
```

Due to the complexity of the checkout form, the actual implementation will render:
- 7 address input fields (fullName, phone, province, city, district, street, landmark)
- Order summary section showing items, total
- COD payment method display with description
- Place order button

- [ ] **Step 2: Commit**

```bash
git add src/app/checkout/page.tsx
git commit -m "feat: redesign checkout for COD payment and Middle East address"
```

---

### Task 10: 创建物流适配器接口

**Files:**
- Create: `src/lib/shipping/adapter.ts`

- [ ] **Step 1: 创建适配器接口**

Create `src/lib/shipping/adapter.ts`:

```typescript
export interface ShipmentRequest {
  orderId: string;
  customerName: string;
  phone: string;
  address: {
    province: string;
    city: string;
    district: string;
    street: string;
    landmark?: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    weight?: number;
  }>;
}

export interface ShipmentResult {
  success: boolean;
  trackingNumber?: string;
  labelUrl?: string;
  error?: string;
}

export interface TrackingInfo {
  status: string;
  estimatedDelivery?: string;
  events: Array<{
    date: string;
    description: string;
    location?: string;
  }>;
}

export interface RateRequest {
  destination: {
    city: string;
    province: string;
  };
  items: Array<{ weight?: number }>;
}

export interface RateInfo {
  total: number;
  currency: string;
  estimatedDays: string;
}

export interface ShippingAdapter {
  createShipment(request: ShipmentRequest): Promise<ShipmentResult>;
  trackOrder(trackingNumber: string): Promise<TrackingInfo>;
  getRate(request: RateRequest): Promise<RateInfo>;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/shipping/adapter.ts
git commit -m "feat: create shipping adapter interface"
```

---

### Task 11: 实现 Aramex 物流适配器

**Files:**
- Create: `src/lib/shipping/aramex.ts`
- Create: `src/app/api/shipping/aramex/route.ts`

- [ ] **Step 1: 创建实现文件**

Create `src/lib/shipping/aramex.ts`:

```typescript
import type { ShippingAdapter, ShipmentRequest, ShipmentResult, TrackingInfo, RateRequest, RateInfo } from './adapter';

// Aramex API endpoints and credentials from environment
const ARAMEX_API_BASE = process.env.ARAMEX_API_BASE || 'https://api.aramex.com/shipping/v1';
const ARAMEX_ACCOUNT_NUMBER = process.env.ARAMEX_ACCOUNT_NUMBER || '';
const ARAMEX_USERNAME = process.env.ARAMEX_USERNAME || '';
const ARAMEX_PASSWORD = process.env.ARAMEX_PASSWORD || '';

export class AramexAdapter implements ShippingAdapter {
  private async request(endpoint: string, body: any) {
    const response = await fetch(`${ARAMEX_API_BASE}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${btoa(`${ARAMEX_USERNAME}:${ARAMEX_PASSWORD}`)}`,
      },
      body: JSON.stringify(body),
    });
    return response.json();
  }

  async createShipment(request: ShipmentRequest): Promise<ShipmentResult> {
    try {
      const payload = {
        ClientInfo: {
          UserName: ARAMEX_USERNAME,
          Password: ARAMEX_PASSWORD,
          AccountNumber: ARAMEX_ACCOUNT_NUMBER,
        },
        Shipments: [
          {
            Reference1: request.orderId,
            Shipper: {
              // Default shipper (XM Store warehouse)
              Reference1: 'XM Store',
              PartyAddress: {
                Line1: 'Warehouse Address',
                City: 'Dubai',
              },
            },
            Consignee: {
              Reference1: request.customerName,
              PartyAddress: {
                Line1: request.address.street,
                Line2: request.address.landmark || '',
                City: request.address.city,
              },
              Phone: request.phone,
            },
            Details: {
              Dimensions: { Weight: 1 },
              DescriptionOfGoods: request.items.map(i => i.name).join(', '),
              NumberOfPieces: request.items.reduce((sum, i) => sum + i.quantity, 0),
            },
          },
        ],
      };

      const result = await this.request('/shipments', payload);
      return {
        success: true,
        trackingNumber: result.Shipments?.[0]?.ID,
        labelUrl: result.Shipments?.[0]?.LabelUrl,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async trackOrder(trackingNumber: string): Promise<TrackingInfo> {
    try {
      const result = await this.request('/track', {
        ClientInfo: {
          UserName: ARAMEX_USERNAME,
          Password: ARAMEX_PASSWORD,
          AccountNumber: ARAMEX_ACCOUNT_NUMBER,
        },
        Shipments: [{ ID: trackingNumber }],
      });

      const trackResult = result.TrackingResults?.[0];
      return {
        status: trackResult?.Value || 'Unknown',
        estimatedDelivery: trackResult?.ExpectedDeliveryDate,
        events: (trackResult?.TrackingEvents || []).map((event: any) => ({
          date: event.EventDate,
          description: event.EventDescription,
          location: event.EventLocation,
        })),
      };
    } catch {
      return { status: 'Unknown', events: [] };
    }
  }

  async getRate(request: RateRequest): Promise<RateInfo> {
    // Simplified rate calculation
    // In production, call Aramex rate API
    return {
      total: 15,
      currency: 'USD',
      estimatedDays: '3-5 business days',
    };
  }
}

export const aramexAdapter = new AramexAdapter();
```

- [ ] **Step 2: 创建 API Route 代理**

Create `src/app/api/shipping/aramex/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { aramexAdapter } from '@/lib/shipping/aramex';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action, data } = body;

  switch (action) {
    case 'createShipment':
      return NextResponse.json(await aramexAdapter.createShipment(data));
    case 'trackOrder':
      return NextResponse.json(await aramexAdapter.trackOrder(data.trackingNumber));
    case 'getRate':
      return NextResponse.json(await aramexAdapter.getRate(data));
    default:
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/shipping/aramex.ts src/app/api/shipping/aramex/route.ts
git commit -m "feat: implement Aramex shipping adapter + API route"
```

---

### Task 12: 订单详情页添加物流追踪展示

**Files:**
- Modify: `src/app/orders/[id]/page.tsx`

- [ ] **Step 1: 添加物流追踪展示**

Read current file and add tracking section:

```tsx
// ... inside the OrderDetail component
const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null);

useEffect(() => {
  if (order?.trackingNumber) {
    fetch('/api/shipping/aramex', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'trackOrder',
        data: { trackingNumber: order.trackingNumber },
      }),
    })
      .then(res => res.json())
      .then(setTrackingInfo)
      .catch(() => {});
  }
}, [order?.trackingNumber]);

// Render tracking timeline if trackingInfo exists
```

- [ ] **Step 2: Commit**

```bash
git add src/app/orders/[id]/page.tsx
git commit -m "feat: add Aramex tracking display to order detail page"
```

---

### Task 13: 翻译剩余 UI 组件

**Files:**
- Modify: `src/app/error.tsx`
- Modify: `src/app/not-found.tsx`
- Modify: `src/components/empty-state.tsx`
- Modify: `src/components/cart-sheet.tsx`
- Modify: `src/components/mini-cart-dropdown.tsx`

- [ ] **Step 1-5: 逐一替换中文文本为 `useTranslations()`**

- [ ] **Step 6: Commit**

```bash
git add src/app/error.tsx src/app/not-found.tsx src/components/empty-state.tsx src/components/cart-sheet.tsx src/components/mini-cart-dropdown.tsx
git commit -m "feat: translate remaining UI components to English"
```

---

### Task 14: 构建验证

- [ ] **Step 1: 检查类型错误**

Run: `npx tsc --noEmit`
Expected: No type errors

- [ ] **Step 2: 运行测试**

Run: `npm test`
Expected: All existing tests pass

- [ ] **Step 3: 构建项目**

Run: `npm run build`
Expected: Build succeeds
