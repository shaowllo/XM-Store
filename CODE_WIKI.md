# XM Store - Code Wiki

> 项目代号：XM Store  
> 类型：Next.js 电商前端应用  
> 最后更新：2026-05-05

---

## 1. 项目概述

XM Store 是一个基于 **Next.js 14** 构建的现代化科技数码产品电商网站，采用 **React 18** + **TypeScript** + **Tailwind CSS v4** 技术栈。项目采用客户端状态管理（React Context + LocalStorage）实现购物车、用户系统、订单管理、收藏夹等核心电商功能，支持深色/浅色主题切换，并具备完整的 PWA 支持。

### 1.1 核心特性

- 产品浏览与分类筛选（手机、音频、穿戴、电脑、智能家居）
- 购物车管理（添加、删除、数量调整、颜色选择）
- 用户认证（注册/登录，基于 LocalStorage）
- 订单管理（下单、状态追踪、历史查看）
- 收藏夹功能
- 收货地址管理
- 优惠券系统
- 深色/浅色主题切换
- 响应式设计（移动端优先）
- PWA 支持（manifest + service worker）
- 动画效果（Framer Motion）
- 性能监控（Web Vitals）

---

## 2. 技术架构

### 2.1 技术栈

| 层级 | 技术 | 版本 | 用途 |
|------|------|------|------|
| 框架 | Next.js | 14.2.35 | React 全栈框架，App Router |
| 运行时 | React | 18.3.1 | UI 库 |
| 语言 | TypeScript | 5.x | 类型安全 |
| 样式 | Tailwind CSS | 4.x | 原子化 CSS |
| 动画 | Framer Motion | 12.38.0 | 页面/组件动画 |
| 图标 | Lucide React | 1.14.0 | 图标库 |
| 表单 | React Hook Form | 7.75.0 | 表单管理 |
| 校验 | Zod | 4.4.3 | 表单校验 |
| 主题 | next-themes | 0.4.6 | 深色/浅色主题 |
| 通知 | Sonner | 2.0.7 | Toast 通知 |
| UI 组件 | @base-ui/react | 1.4.1 | 底层 UI 组件 |
| 测试 | Vitest | 4.1.5 | 单元测试 |
| 测试 | @testing-library/react | 16.3.2 | React 测试工具 |

### 2.2 项目结构

```
site/
├── public/                          # 静态资源
│   ├── icons/                       # PWA 图标
│   ├── manifest.json                # PWA 配置
│   └── *.svg                        # 其他静态图标
├── src/
│   ├── app/                         # Next.js App Router 页面
│   │   ├── page.tsx                 # 首页
│   │   ├── layout.tsx               # 根布局
│   │   ├── globals.css              # 全局样式（Tailwind v4 @theme）
│   │   ├── error.tsx                # 错误边界
│   │   ├── loading.tsx              # 全局加载状态
│   │   ├── about/                   # 关于页面
│   │   ├── checkout/                # 结算页面
│   │   ├── login/                   # 登录页面
│   │   ├── register/                # 注册页面
│   │   ├── orders/                  # 订单列表
│   │   │   └── [id]/                # 订单详情
│   │   ├── products/                # 产品列表
│   │   │   └── [id]/                # 产品详情
│   │   ├── profile/                 # 个人中心
│   │   │   └── addresses/           # 地址管理
│   │   └── wishlist/                # 收藏夹
│   ├── components/                  # React 组件
│   │   ├── ui/                      # 基础 UI 组件（Button, Input, Card 等）
│   │   ├── app-providers.tsx        # 全局 Provider 组合
│   │   ├── navbar.tsx               # 导航栏
│   │   ├── footer.tsx               # 页脚
│   │   ├── hero-carousel.tsx        # 首页轮播图
│   │   ├── product-card.tsx         # 产品卡片
│   │   ├── search-dialog.tsx        # 搜索弹窗
│   │   ├── breadcrumb.tsx           # 面包屑导航
│   │   ├── empty-state.tsx          # 空状态组件
│   │   ├── back-to-top.tsx          # 回到顶部
│   │   ├── theme-provider.tsx       # 主题 Provider
│   │   ├── theme-toggle.tsx         # 主题切换按钮
│   │   ├── web-vitals.tsx           # 性能监控
│   │   ├── cart-provider.tsx        # 购物车状态管理
│   │   ├── user-provider.tsx        # 用户状态管理
│   │   ├── order-provider.tsx       # 订单状态管理
│   │   ├── wishlist-provider.tsx    # 收藏夹状态管理
│   │   ├── address-provider.tsx     # 地址状态管理
│   │   └── coupon-provider.tsx      # 优惠券状态管理
│   ├── hooks/                       # 自定义 Hooks
│   │   └── use-local-storage.ts     # LocalStorage Hook（支持 SSR）
│   ├── lib/                         # 工具库与数据
│   │   ├── types.ts                 # TypeScript 类型定义
│   │   ├── data.ts                  # 静态产品数据
│   │   ├── constants.ts             # 常量（分类、特性）
│   │   ├── utils.ts                 # 工具函数（cn 合并类名）
│   │   ├── storage.ts               # LocalStorage 封装
│   │   └── vitals.ts                # Web Vitals 上报
│   ├── test/                        # 测试配置
│   │   └── setup.ts                 # Vitest 初始化
│   └── middleware.ts                # Next.js 中间件（路由保护）
├── next.config.mjs                  # Next.js 配置
├── tailwind.config.ts               # Tailwind 配置（v4 已迁移到 CSS）
├── vitest.config.ts                 # Vitest 配置
├── tsconfig.json                    # TypeScript 配置
├── package.json                     # 依赖管理
└── components.json                  # shadcn/ui 配置
```

---

## 3. 核心模块详解

### 3.1 页面路由（App Router）

| 路由 | 文件 | 类型 | 说明 |
|------|------|------|------|
| `/` | `app/page.tsx` | Client | 首页：轮播图、分类入口、精选产品、新品、促销、订阅 |
| `/products` | `app/products/page.tsx` | Server | 产品列表页（Suspense + ProductsContent） |
| `/products/[id]` | `app/products/[id]/page.tsx` | Server | 产品详情页（SSG generateStaticParams） |
| `/checkout` | `app/checkout/page.tsx` | Client | 结算页（需登录） |
| `/orders` | `app/orders/page.tsx` | Client | 订单列表（需登录） |
| `/orders/[id]` | `app/orders/[id]/page.tsx` | Client | 订单详情（需登录） |
| `/login` | `app/login/page.tsx` | Client | 登录页 |
| `/register` | `app/register/page.tsx` | Client | 注册页 |
| `/profile` | `app/profile/page.tsx` | Client | 个人中心（需登录） |
| `/profile/addresses` | `app/profile/addresses/page.tsx` | Client | 地址管理（需登录） |
| `/wishlist` | `app/wishlist/page.tsx` | Client | 收藏夹（需登录） |
| `/about` | `app/about/page.tsx` | Server | 关于页面 |

### 3.2 状态管理架构（Context + LocalStorage）

所有业务状态通过 React Context 管理，并持久化到 LocalStorage，实现用户数据在刷新后保留。

```
AppProviders (components/app-providers.tsx)
├── UserProvider          # 用户登录状态
├── AddressProvider       # 收货地址（依赖 User）
├── CouponProvider        # 优惠券（依赖 User）
├── CartProvider          # 购物车（依赖 User）
├── WishlistProvider      # 收藏夹（依赖 User）
└── OrderProvider         # 订单（依赖 User）
```

**数据隔离策略**：每个用户有独立的 LocalStorage Key，格式为 `xmstore-{feature}-{userId}`，未登录用户使用 `guest` 后缀。

#### 3.2.1 UserProvider

- **文件**：`src/components/user-provider.tsx`
- **职责**：用户注册、登录、登出
- **存储**：`localStorage` (`xmstore-user`, `xmstore-users`)
- **Cookie**：登录后设置 `xmstore-user` Cookie（供 Middleware 读取）
- **接口**：
  - `login(email, password): boolean`
  - `register(name, email, password): boolean`
  - `logout(): void`

#### 3.2.2 CartProvider

- **文件**：`src/components/cart-provider.tsx`
- **职责**：购物车增删改查
- **存储**：`localStorage` (`xmstore-cart-{userId}`)
- **关键逻辑**：
  - 同一产品不同颜色视为不同购物车项（`cartItemId = {productId}--{color}`）
  - 添加商品后自动打开购物车抽屉
- **接口**：
  - `addToCart(product, color?, quantity?)`
  - `removeFromCart(cartItemId)`
  - `updateQuantity(cartItemId, quantity)`
  - `clearCart()`

#### 3.2.3 OrderProvider

- **文件**：`src/components/order-provider.tsx`
- **职责**：订单创建与状态管理
- **存储**：`localStorage` (`xmstore-orders-{userId}`)
- **订单状态**：`pending` → `shipped` → `delivered` / `cancelled`
- **接口**：
  - `addOrder(items, totalPrice, totalItems)`
  - `updateOrderStatus(orderId, status)`
  - `clearOrders()`

#### 3.2.4 WishlistProvider

- **文件**：`src/components/wishlist-provider.tsx`
- **职责**：产品收藏管理
- **存储**：`localStorage` (`xmstore-wishlist-{userId}`)
- **接口**：
  - `toggleWishlist(productId)`
  - `isInWishlist(productId): boolean`
  - `removeFromWishlist(productId)`
  - `clearWishlist()`

#### 3.2.5 AddressProvider

- **文件**：`src/components/address-provider.tsx`
- **职责**：收货地址 CRUD
- **存储**：`localStorage` (`xmstore-addresses-{userId}`)
- **接口**：
  - `addAddress(address)`
  - `updateAddress(id, partial)`
  - `removeAddress(id)`
  - `setDefaultAddress(id)`
  - `defaultAddress: Address | undefined`

#### 3.2.6 CouponProvider

- **文件**：`src/components/coupon-provider.tsx`
- **职责**：优惠券验证与使用
- **存储**：`localStorage` (`xmstore-coupons-{userId}`)
- **默认优惠券**：`WELCOME`（满200减50）、`SAVE100`（满500减100）
- **接口**：
  - `validateCoupon(code, orderAmount): Coupon | null`
  - `useCoupon(code)`

### 3.3 中间件（Middleware）

- **文件**：`src/middleware.ts`
- **职责**：路由权限保护
- **保护路由**：`/profile/*`, `/orders/*`, `/checkout`, `/wishlist`
- **机制**：检查 `xmstore-user` Cookie，未登录则重定向到 `/login?redirect={pathname}`

### 3.4 数据层

#### 3.4.1 产品数据（静态）

- **文件**：`src/lib/data.ts`
- **内容**：8 款科技产品（手机、耳机、手表、笔记本、音箱、平板、摄像头、运动耳机）
- **产品字段**：
  ```typescript
  interface Product {
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
  ```

#### 3.4.2 轮播图数据

- **文件**：`src/lib/data.ts`
- **内容**：3 张首页轮播图，关联到具体产品

#### 3.4.3 分类数据

- **文件**：`src/lib/constants.ts`
- **内容**：6 个产品分类（全部、手机、音频、穿戴、电脑、智能家居）

---

## 4. 关键组件说明

### 4.1 布局组件

| 组件 | 文件 | 说明 |
|------|------|------|
| RootLayout | `app/layout.tsx` | 根布局：ThemeProvider → AppProviders → Navbar → main → Footer → Toaster |
| Navbar | `components/navbar.tsx` | 顶部导航：Logo、导航链接、搜索、主题切换、购物车抽屉、用户菜单、移动端菜单 |
| Footer | `components/footer.tsx` | 页脚：链接、社交媒体、订阅 |
| AppProviders | `components/app-providers.tsx` | 组合所有 Context Provider |

### 4.2 产品相关组件

| 组件 | 文件 | 说明 |
|------|------|------|
| ProductCard | `components/product-card.tsx` | 产品卡片：图片、评分、名称、颜色选择、价格、加入购物车、收藏 |
| ProductsContent | `app/products/products-content.tsx` | 产品列表内容：分类筛选、排序、网格/列表视图切换 |
| ProductDetailClient | `app/products/[id]/product-detail-client.tsx` | 产品详情页客户端组件：图片画廊、规格、颜色选择、加入购物车 |
| HeroCarousel | `components/hero-carousel.tsx` | 首页轮播图：自动播放、手动切换、动画过渡 |

### 4.3 UI 基础组件

位于 `src/components/ui/`，基于 `@base-ui/react` 和 Tailwind CSS 构建：

- **Button** (`button.tsx`)：支持多种变体（default, outline, ghost, link）和尺寸
- **Input** (`input.tsx`)：表单输入框
- **Card** (`card.tsx`)：卡片容器
- **Badge** (`badge.tsx`)：标签徽章
- **Sheet** (`sheet.tsx`)：侧滑抽屉（用于购物车）
- **ScrollArea** (`scroll-area.tsx`)：自定义滚动区域
- **Separator** (`separator.tsx`)：分隔线
- **Avatar** (`avatar.tsx`)：头像组件

### 4.4 其他功能组件

| 组件 | 文件 | 说明 |
|------|------|------|
| SearchDialog | `components/search-dialog.tsx` | 全局搜索弹窗 |
| Breadcrumb | `components/breadcrumb.tsx` | 面包屑导航 |
| EmptyState | `components/empty-state.tsx` | 空状态展示 |
| BackToTop | `components/back-to-top.tsx` | 回到顶部按钮 |
| ThemeToggle | `components/theme-toggle.tsx` | 深色/浅色主题切换 |
| WebVitals | `components/web-vitals.tsx` | 性能指标上报 |

---

## 5. 自定义 Hooks

### 5.1 useLocalStorage

- **文件**：`src/hooks/use-local-storage.ts`
- **说明**：支持 SSR 的 LocalStorage Hook，解决 hydration 不匹配问题
- **返回**：`[value, setValue, reset, isHydrated]`
- **特性**：
  - 延迟初始化（setTimeout 0）避免 SSR/CSR 不一致
  - 自动序列化/反序列化 JSON
  - 值变更自动同步到 LocalStorage

---

## 6. 工具函数

### 6.1 cn（类名合并）

- **文件**：`src/lib/utils.ts`
- **实现**：`clsx` + `tailwind-merge`
- **用途**：安全合并 Tailwind CSS 类名，处理条件类名和冲突

### 6.2 Storage 封装

- **文件**：`src/lib/storage.ts`
- **函数**：
  - `getStorageItem<T>(key, defaultValue): T`
  - `setStorageItem<T>(key, value): void`
  - `removeStorageItem(key): void`
- **特性**：SSR 安全（检查 `typeof window`）

---

## 7. 样式系统

### 7.1 Tailwind CSS v4 配置

Tailwind v4 配置已迁移到 CSS 文件中的 `@theme` 指令：`src/app/globals.css`

**主题变量**：

| 变量 | 浅色模式 | 深色模式 | 说明 |
|------|----------|----------|------|
| `--color-background` | `hsl(220 25% 97%)` | `hsl(220 25% 5%)` | 背景色 |
| `--color-foreground` | `hsl(220 20% 10%)` | `hsl(220 15% 95%)` | 文字色 |
| `--color-primary` | `hsl(220 85% 55%)` | `hsl(190 90% 55%)` | 主色（蓝→青） |
| `--color-accent` | `hsl(190 90% 50%)` | `hsl(190 90% 50%)` | 强调色（青色） |
| `--color-card` | `hsl(0 0% 100%)` | `hsl(220 20% 8%)` | 卡片背景 |
| `--color-muted` | `hsl(220 20% 94%)` | `hsl(220 20% 15%)` | 次要背景 |
| `--radius` | `0.75rem` | - | 圆角大小 |

### 7.2 自定义工具类

- `.gradient-text`：渐变文字（primary → accent）
- `.glass`：毛玻璃效果（backdrop-blur）
- `.glow-primary` / `.glow-accent`：发光阴影
- `.noise-overlay`：噪点纹理叠加

### 7.3 滚动条样式

自定义 WebKit 滚动条：6px 宽度，半透明 thumb，hover 加深。

---

## 8. 测试

### 8.1 测试配置

- **框架**：Vitest 4.x
- **环境**：jsdom
- **React 测试**：@testing-library/react + @testing-library/jest-dom
- **配置**：`vitest.config.ts`

### 8.2 测试文件

| 文件 | 说明 |
|------|------|
| `src/components/ui/button.test.tsx` | Button 组件测试 |
| `src/components/footer.test.tsx` | Footer 组件测试 |
| `src/lib/data.test.ts` | 数据层测试 |
| `src/lib/utils.test.ts` | 工具函数测试 |

### 8.3 运行测试

```bash
npm test          # 运行所有测试
npm run test:watch # 监听模式
```

---

## 9. 依赖关系

### 9.1 生产依赖

```
next
├── react
├── react-dom
├── next-themes          # 主题切换
├── framer-motion        # 动画
├── lucide-react         # 图标
├── @tabler/icons-react  # 额外图标
├── @base-ui/react       # UI 基础组件
├── class-variance-authority  # 组件变体
├── clsx + tailwind-merge     # 类名合并
├── sonner               # Toast 通知
├── react-hook-form      # 表单
├── @hookform/resolvers  # 表单校验集成
├── zod                  # 校验库
├── tw-animate-css       # Tailwind 动画
└── web-vitals           # 性能监控
```

### 9.2 开发依赖

```
typescript
tailwindcss + @tailwindcss/postcss   # Tailwind v4
vitest + @vitejs/plugin-react         # 测试
@testing-library/react + jest-dom     # React 测试
eslint + eslint-config-next           # 代码检查
jsdom                                 # DOM 环境
@types/node/react/react-dom           # 类型定义
```

---

## 10. 项目运行方式

### 10.1 环境要求

- Node.js 18+
- npm 或 pnpm

### 10.2 安装依赖

```bash
npm install
```

### 10.3 开发模式

```bash
npm run dev
```
- 启动 Next.js 开发服务器（默认 http://localhost:3000）
- 支持热更新

### 10.4 构建

```bash
npm run build
```
- 生成静态导出（`next.config.mjs` 中配置）
- 输出到 `dist/` 目录

### 10.5 生产运行

```bash
npm start
```

### 10.6 代码检查

```bash
npm run lint
```

### 10.7 测试

```bash
npm test
npm run test:watch
```

---

## 11. 配置说明

### 11.1 next.config.mjs

```javascript
{
  images: {
    unoptimized: true,           // 静态导出时禁用图片优化
    remotePatterns: [
      { hostname: "images.unsplash.com" }  // 允许 Unsplash 图片
    ]
  },
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: true },
  experimental: {
    workerThreads: false,
    cpus: 1
  }
}
```

### 11.2 tsconfig.json

- **目标**：ES2017
- **模块**：ESNext + Bundler 解析
- **路径别名**：`@/*` → `./src/*`
- **严格模式**：启用

### 11.3 PWA 配置

- **manifest**：`public/manifest.json`
- **图标**：`public/icons/icon-192x192.png`, `icon-512x512.png`
- **主题色**：通过 manifest 配置

---

## 12. 迭代记录

项目采用迭代式开发，迭代记录保存在 `iterations/` 目录：

| 文件 | 日期 | 说明 |
|------|------|------|
| `iteration-01-2026-05-05.md` | 2026-05-05 | 初始搭建 |
| `iteration-02-2026-05-05.md` | 2026-05-05 | 首页与产品展示 |
| `iteration-03-2026-05-05.md` | 2026-05-05 | 购物车功能 |
| `iteration-04-2026-05-05.md` | 2026-05-05 | 用户系统 |
| `iteration-05-2026-05-05.md` | 2026-05-05 | 结算与订单 |
| `iteration-06-2026-05-05.md` | 2026-05-05 | 收藏夹与地址 |
| `iteration-07-2026-05-05.md` | 2026-05-05 | 优惠券系统 |
| `iteration-08-2026-05-05.md` | 2026-05-05 | 主题与样式优化 |
| `iteration-09-2026-05-05.md` | 2026-05-05 | 动画与交互 |
| `iteration-10-2026-05-05.md` | 2026-05-05 | 搜索功能 |
| `iteration-11-2026-05-05.md` | 2026-05-05 | 响应式优化 |
| `iteration-12-2026-05-05.md` | 2026-05-05 | 测试覆盖 |
| `iteration-13-2026-05-05.md` | 2026-05-05 | 性能优化 |
| `project-analysis-2026-05-05.md` | 2026-05-05 | 项目分析 |

---

## 13. 开发规范

### 13.1 代码风格

- **组件**：PascalCase（如 `ProductCard`）
- **文件**：kebab-case（如 `cart-provider.tsx`）
- **Hooks**：camelCase 前缀 `use`（如 `useLocalStorage`）
- **类型**：PascalCase（如 `CartItem`, `OrderStatus`）

### 13.2 组件模式

- **Server Component**：默认，用于数据获取和静态渲染
- **Client Component**：`"use client"` 指令，用于交互逻辑和浏览器 API
- **Provider 模式**：所有状态管理使用 React Context + Hook

### 13.3 文件组织原则

- 页面组件放在 `app/` 对应路由目录
- 共享组件放在 `components/`
- UI 基础组件放在 `components/ui/`
- 自定义 Hooks 放在 `hooks/`
- 工具函数放在 `lib/`
- 类型定义集中在 `lib/types.ts`

---

*文档结束*
