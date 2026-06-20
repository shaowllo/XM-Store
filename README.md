# XM Store — Premium Tech, Delivered

> A full-featured e-commerce demo built with Next.js 14, showcasing modern frontend architecture with a dark-luxury aesthetic.

![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-base--nova-000?logo=shadcnui)

---

## ✨ Features

- **Product Catalog** — Browse, filter by category, sort by price/rating, grid/list toggle
- **Product Detail** — Image gallery, color selection, add to cart / wishlist
- **Shopping Cart** — Persistent cart with quantity controls, fly-to-cart animation
- **Checkout** — Address form, COD payment, order summary
- **Order Tracking** — Order history with status timeline and live Aramex tracking
- **User Auth** — Register / login with hashed passwords and session tokens
- **Wishlist** — Save favorites across sessions
- **Profile & Addresses** — Manage multiple shipping addresses
- **Search** — Global search dialog with category filters and text highlighting
- **Responsive Design** — Mobile-first with adaptive layouts
- **Dark/Light Themes** — Gold-accented dark theme with warm parchment light theme
- **i18n** — next-intl powered (English, extensible to more locales)

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript (strict) |
| **Styling** | Tailwind CSS v4 + CSS variables |
| **UI Components** | shadcn/ui (base-nova), @base-ui/react |
| **Icons** | lucide-react, @tabler/icons-react |
| **Animations** | framer-motion v12 |
| **Forms** | react-hook-form + zod v4 |
| **i18n** | next-intl v4 |
| **Notifications** | sonner v2 |
| **State** | React Context + localStorage (useSyncExternalStore) |
| **Testing** | Vitest v4 + jsdom + Testing Library |
| **Linting** | ESLint v9 (flat config) |

## 🏗️ Architecture

```
src/
├── app/                  # Next.js App Router pages
│   ├── layout.tsx        # Root layout (providers, navbar, footer)
│   ├── page.tsx          # Homepage (hero, featured, categories)
│   ├── products/         # Product listing + detail (SSG)
│   ├── checkout/         # Checkout flow
│   ├── orders/           # Order list + detail + tracking
│   ├── profile/          # Profile dashboard + address CRUD
│   ├── login|register/   # Authentication pages
│   ├── wishlist/         # Favorites
│   └── api/shipping/     # Aramex shipping API proxy
├── components/           # Shared components
│   ├── ui/               # shadcn/ui primitives
│   ├── *-provider.tsx    # Context providers (cart, user, orders, etc.)
│   ├── navbar.tsx        # Sticky navigation bar
│   ├── footer.tsx        # Site footer
│   └── product-card.tsx  # Product card component
├── hooks/                # Custom hooks
│   └── use-local-storage # Hydration-safe localStorage hook
├── lib/                  # Utilities, types, data, env
│   ├── env.ts            # Environment variable validation
│   ├── crypto.ts         # Password hashing (Web Crypto API)
│   ├── data.ts           # Static product data
│   ├── types.ts          # Shared TypeScript types
│   └── shipping/         # Aramex shipping adapter
├── i18n/                 # next-intl configuration
└── middleware.ts         # Route protection
```

### State Management

All application state lives in React Context + localStorage, keyed per user:

```
UserProvider → AddressProvider → CouponProvider
  → CartProvider → WishlistProvider → OrderProvider
```

The custom `useLocalStorage` hook uses `useSyncExternalStore` for hydration-safe,
SSR-compatible persistence with cross-tab synchronization.

### Data Flow

- **Products**: Static data at build time (SSG via `generateStaticParams`)
- **Auth**: Client-side only — passwords hashed with SHA-256, session tokens in cookies
- **Cart/Orders**: React state → `useEffect` sync to `localStorage`
- **Shipping**: Only server-side API call — proxied to Aramex via `/api/shipping/aramex`

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables

For shipping features, create `.env.local`:

```env
ARAMEX_ACCOUNT_NUMBER=your_account
ARAMEX_USERNAME=your_username
ARAMEX_PASSWORD=your_password
ARAMEX_API_BASE=https://api.aramex.com/shipping/v1
```

The app works without these — only the Aramex tracking features will be unavailable.

## 🧪 Testing

```bash
# Run tests once
npm test

# Watch mode
npm run test:watch
```

## 📦 Scripts

| Script | Description |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Production server |
| `npm run lint` | ESLint check |
| `npm test` | Run Vitest tests |

## 🚢 Deployment

The project is Vercel-ready. Deploy with:

```bash
npx vercel
```

Or connect your GitHub repository for automatic deployments.

## 📄 License

MIT

---

<p align="center">Built with ❤️ using Next.js</p>
