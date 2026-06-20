<div align="center">
  <br/>
  <img src="https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=1200&h=300&fit=crop&auto=format" alt="XM Store Hero" width="100%" style="border-radius: 16px;"/>
  <br/><br/>

  <h1>XM Store — Premium Tech, Delivered</h1>

  <p>A full-featured e-commerce demo built with Next.js 14, showcasing modern frontend architecture with a dark-luxury aesthetic.</p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-14.2-black?logo=next.js&style=flat-square" alt="Next.js"/>
    <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&style=flat-square" alt="TypeScript"/>
    <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&style=flat-square" alt="Tailwind CSS"/>
    <img src="https://img.shields.io/badge/shadcn/ui-nova-000?logo=shadcnui&style=flat-square" alt="shadcn/ui"/>
    <img src="https://img.shields.io/badge/Three.js-black?logo=three.js&style=flat-square" alt="Three.js"/>
    <img src="https://img.shields.io/badge/Framer_Motion-12-0055FF?logo=framer&style=flat-square" alt="Framer Motion"/>
  </p>

  <br/>
</div>

---

## ✨ Features

<div align="center">
  <table>
    <tr>
      <td align="center" width="25%">
        <img src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&h=200&fit=crop" width="80" style="border-radius:12px"/>
        <br/><b>📱 Product Catalog</b>
        <br/><sub>Filter by category, sort by price/rating, grid/list toggle</sub>
      </td>
      <td align="center" width="25%">
        <img src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&h=200&fit=crop" width="80" style="border-radius:12px"/>
        <br/><b>🛒 Smart Cart</b>
        <br/><sub>Persistent cart with fly-to-cart animation, quantity controls</sub>
      </td>
      <td align="center" width="25%">
        <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop" width="80" style="border-radius:12px"/>
        <br/><b>📦 Order Tracking</b>
        <br/><sub>Status timeline, COD payments, live Aramex tracking</sub>
      </td>
      <td align="center" width="25%">
        <img src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&h=200&fit=crop" width="80" style="border-radius:12px"/>
        <br/><b>🔍 Global Search</b>
        <br/><sub>Category filters, text highlighting, recent searches</sub>
      </td>
    </tr>
  </table>
</div>

### 🎨 Visual Experience Pack

<table>
  <tr>
    <td align="center" width="25%"><b>🔍 Magnifier Zoom</b><br/><sub>Desktop hover lens with pixel-accurate magnification</sub></td>
    <td align="center" width="25%"><b>⚖️ Product Compare</b><br/><sub>Side-by-side spec comparison table</sub></td>
    <td align="center" width="25%"><b>🎨 Theme Studio</b><br/><sub>Custom colors, border radius, real-time preview</sub></td>
    <td align="center" width="25%"><b>📦 3D Viewer</b><br/><sub>Three.js rotatable product model</sub></td>
  </tr>
</table>

### 📊 Smart Data Pack

<table>
  <tr>
    <td align="center" width="25%"><b>🔮 AI Recommendations</b><br/><sub>Cosine similarity engine for "You Might Also Like"</sub></td>
    <td align="center" width="25%"><b>📈 Price History</b><br/><sub>Interactive recharts area chart with 7/30/90d ranges</sub></td>
    <td align="center" width="25%"><b>🔥 Trending</b><br/><sub>Top-ranked products by rating and popularity</sub></td>
    <td align="center" width="25%"><b>👁️ Recently Viewed</b><br/><sub>Track and resume browsing on homepage</sub></td>
  </tr>
</table>

### 💬 Social Pack

<table>
  <tr>
    <td align="center" width="25%"><b>⭐ Reviews & Ratings</b><br/><sub>Star selector, distribution chart, user reviews</sub></td>
    <td align="center" width="25%"><b>🔗 Product Sharing</b><br/><sub>Web Share API with clipboard fallback</sub></td>
    <td align="center" width="25%"><b>🔔 Stock Alerts</b><br/><sub>Email notification modal for out-of-stock items</sub></td>
    <td align="center" width="25%"><b>💬 Search Autocomplete</b><br/><sub>Recent searches, trending suggestions</sub></td>
  </tr>
</table>

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technology | Version |
|---|---|---|
| **Framework** | [Next.js](https://nextjs.org) (App Router) | 14.2 |
| **Language** | [TypeScript](https://typescriptlang.org) (strict) | 5.x |
| **Styling** | [Tailwind CSS](https://tailwindcss.com) v4 + CSS Variables | 4.x |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com) (base-nova) + [@base-ui/react](https://base-ui.com) | — |
| **Icons** | [lucide-react](https://lucide.dev) + [@tabler/icons-react](https://tabler.io/icons) | — |
| **Animation** | [framer-motion](https://framer.com/motion) | 12.x |
| **3D Graphics** | [Three.js](https://threejs.org) + [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) | — |
| **Charts** | [recharts](https://recharts.org) | — |
| **Forms** | [react-hook-form](https://react-hook-form.com) + [zod](https://zod.dev) v4 | — |
| **i18n** | [next-intl](https://next-intl-docs.vercel.app) | 4.x |
| **State** | React Context + localStorage (useSyncExternalStore) | — |
| **Notifications** | [sonner](https://sonner.emilkowal.ski) | 2.x |
| **Testing** | [Vitest](https://vitest.dev) + jsdom + Testing Library | 4.x |
| **Linting** | ESLint (flat config) | 9.x |

</div>

---

## 🏗️ Architecture

```
src/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx                # Root layout (providers, navbar, footer)
│   ├── page.tsx                  # Homepage (hero, featured, AI recs, recently viewed)
│   ├── products/                 # Product listing + detail (SSG)
│   ├── compare/                  # Side-by-side product comparison
│   ├── checkout/                 # Checkout flow (COD)
│   ├── orders/                   # Order list + detail + Aramex tracking
│   ├── profile/                  # Profile dashboard + address CRUD
│   ├── theme/                    # Theme Studio customization page
│   ├── trending/                 # Trending products ranked list
│   ├── login|register/           # Authentication pages (hashed passwords)
│   ├── wishlist/                 # Favorites
│   └── api/shipping/             # Aramex shipping API proxy
│
├── components/                   # Shared React components
│   ├── ui/                       # shadcn/ui primitives (button, input, card, etc.)
│   ├── cart-provider.tsx         # Cart state + localStorage persistence
│   ├── user-provider.tsx         # Auth context (login, register, logout)
│   ├── cart-recommendations.tsx   # AI-powered cart suggestions
│   ├── compare-bar.tsx           # Floating compare toolbar
│   ├── magnifier-zoom.tsx        # Desktop hover magnifier lens
│   ├── price-chart.tsx           # recharts price history area chart
│   ├── product-gallery.tsx       # Image gallery with thumbnails
│   ├── product-viewer-3d.tsx     # Three.js 3D product viewer
│   ├── review-section.tsx        # Reviews + ratings system
│   ├── search-dialog.tsx         # Global search with autocomplete
│   ├── stock-notify.tsx          # Back-in-stock notification modal
│   ├── theme-studio.tsx          # Theme customization UI
│   ├── navbar.tsx                # Sticky navigation bar
│   └── footer.tsx                # Site footer
│
├── hooks/
│   └── use-local-storage.ts      # Hydration-safe localStorage (useSyncExternalStore)
│
├── lib/
│   ├── data.ts                   # Static product data (8 products)
│   ├── types.ts                  # Shared TypeScript types
│   ├── crypto.ts                 # SHA-256 password hashing
│   ├── env.ts                    # Environment variable validation
│   ├── recommendations.ts        # Cosine similarity recommendation engine
│   ├── review-store.ts           # Product reviews (localStorage)
│   ├── price-history.ts          # Simulated price history generator
│   ├── compare-store.ts          # Compare list (localStorage)
│   ├── theme-store.ts            # Theme customization persistence
│   ├── recently-viewed.ts        # Recently viewed tracking
│   ├── recent-searches.ts        # Search history tracking
│   └── shipping/                 # Aramex shipping adapter
│
├── i18n/                         # next-intl configuration
└── middleware.ts                 # Route protection (session token based)
```

### State Management

```
UserProvider ─┬─> AddressProvider ──┬─> CouponProvider ──┬─> CartProvider
              │                     │                     │
              │                     │                     └─> WishlistProvider
              │                     └─> ...                                  
              └─> OrderProvider
```

All state backed by `useSyncExternalStore` for hydration-safe, cross-tab synchronized localStorage persistence.

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production (uses all CPU cores)
npm run build

# Start production server
npm start

# Run tests
npm test

# Watch mode
npm run test:watch
```

### Environment Variables

For shipping features, create `.env.local`:

```env
ARAMEX_ACCOUNT_NUMBER=your_account
ARAMEX_USERNAME=your_username
ARAMEX_PASSWORD=your_password
ARAMEX_API_BASE=https://api.aramex.com/shipping/v1
```

The app works without these — only Aramex tracking features will be unavailable. Missing vars produce a console warning at startup.

---

## 🧪 Testing

```bash
npm test         # Run all tests
npm run test:watch  # Watch mode
```

Tests cover: utility functions, data integrity, component rendering, and state logic.

---

## 📦 Scripts

| Script | Description |
|---|---|
| `npm run dev` | Development server (Next.js) |
| `npm run build` | Production build |
| `npm start` | Production server |
| `npm run lint` | ESLint check (flat config) |
| `npm test` | Run Vitest tests |
| `npm run test:watch` | Tests in watch mode |

---

## 🚢 Deployment

The project is Vercel-ready:

```bash
npx vercel
```

Or connect your GitHub repository for automatic deployments. No Docker required.

---

## 🗺️ Route Map

| Route | Description | Auth |
|---|---|---|
| `/` | Homepage | Public |
| `/products` | Product catalog | Public |
| `/products/[id]` | Product detail (SSG) | Public |
| `/compare?ids=1,2,3` | Product comparison | Public |
| `/trending` | Trending products | Public |
| `/theme` | Theme Studio | Public |
| `/about` | About page | Public |
| `/login` / `/register` | Authentication | Public |
| `/checkout` | Checkout flow | Required |
| `/orders` | Order history | Required |
| `/orders/[id]` | Order detail + tracking | Required |
| `/profile` | Profile dashboard | Required |
| `/profile/addresses` | Address management | Required |
| `/wishlist` | Favorites | Required |

---

## 📄 License

MIT

---

<div align="center">
  <sub>Built with ❤️ using Next.js · TypeScript · Tailwind CSS · shadcn/ui</sub>
  <br/>
  <sub>© 2026 XM Store. All rights reserved.</sub>
</div>
