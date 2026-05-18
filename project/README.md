# Fifty Store - Futuristic Ecommerce Platform

Next-generation Tunisian tech ecommerce built with React + TypeScript + Tailwind.

## Core Identity

- Store: **Fifty Store**
- Founder: **Wissem Loueti**
- WhatsApp: **+216 99 400 090**
- Delivery: **Livraison rapide sur toute la Tunisie**
- Payment: **Paiement a la livraison**
- Location: **Jemmel, Monastir, Tunisia**

## Major Upgrades Included

- Futuristic premium UI (glassmorphism, neon gradients, particles, glow effects)
- Smooth route transitions + advanced animations (Framer Motion, GSAP, Lenis)
- Enhanced hero with cinematic effects and animated counters
- AI-like product recommender (budget + usage preferences)
- Floating AI/live support widget with quick prompts + typing effect
- Advanced product cards (3D tilt, quick view, compare, live viewers, stock bar)
- Flash sale timer + trending sections + recently viewed products
- Mobile app-like UX (bottom navigation + floating cart)
- PWA support (manifest, service worker, install prompt, offline page)
- Supabase-ready catalog + orders + customers + wishlist sync
- Advanced admin dashboard with charts and CRUD-ready actions
- SEO improvements + sitemap + robots.txt
- Vercel + Netlify deployment config

## Installed Packages

- `framer-motion`
- `gsap`
- `lenis`
- `recharts`
- `@supabase/supabase-js` (already present)

## Project Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run typecheck
```

## Run Locally

```bash
cd "C:\Users\LENOVO\Downloads\fifty store\project"
npm install
npm run dev
```

Open `http://localhost:5173`.

## Acces Frontend / Backend / Admin

### Frontend

- URL locale: `http://localhost:5173`
- Commandes:

```bash
cd "C:\Users\LENOVO\Downloads\fifty store\project"
npm run dev
```

### Backend (Supabase)

- Backend utilise Supabase (pas de backend Node local dans ce projet).
- Dashboard: `https://supabase.com/dashboard`
- Variables obligatoires dans `.env`:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ADMIN_EMAIL=admin@fiftystore.tn
VITE_ADMIN_LOCAL_PASSWORD=Admin@12345
```

### Admin (acces local/demo)

- Page login: `http://localhost:5173/login`
- Email admin: `admin@fiftystore.tn`
- Mot de passe admin: `Admin@12345`

Si tu modifies `VITE_ADMIN_EMAIL` ou `VITE_ADMIN_LOCAL_PASSWORD`, utilise les nouvelles valeurs.

## Environment Variables

Create `.env` in project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ADMIN_EMAIL=admin@fiftystore.tn
VITE_ADMIN_LOCAL_PASSWORD=Admin@12345
VITE_SITE_URL=https://fifty-store.tn
```

If Supabase is missing/unavailable, the app automatically falls back to local mock/localStorage mode.

## Supabase Files

- `src/lib/supabase.ts` (TypeScript app integration)
- `src/lib/supabase.js` (JS variant requested)

## Required Supabase Tables

Create these tables in `public` schema:

1. `products`
- `id` (bigint, primary key)
- `name` (text)
- `brand` (text)
- `category` (text)
- `price` (numeric)
- `old_price` (numeric, nullable)
- `description` (text)
- `image_url` (text, nullable)
- `image` (text, nullable)
- `images` (jsonb, nullable)
- `video_url` (text, nullable)
- `stock` (int)
- `rating` (numeric)
- `reviews` (int)
- `is_best_seller` (boolean)
- `is_new` (boolean)
- `created_at` (timestamp, default now())

2. `categories`
- `id` (text primary key)
- `slug` (text, nullable)
- `name` (text)

3. `customers`
- `id` (bigint, primary key)
- `full_name` (text)
- `phone` (text, unique recommended)
- `city` (text)
- `address` (text)
- `created_at` (timestamp, default now())

4. `orders`
- `id` (bigint, primary key)
- `customer_id` (bigint, nullable)
- `customer_name` (text)
- `phone` (text)
- `city` (text)
- `address` (text)
- `notes` (text, nullable)
- `total` (numeric)
- `status` (text) default `En cours`
- `payment_method` (text, nullable)
- `delivery_method` (text, nullable)
- `created_at` (timestamp, default now())

5. `order_items`
- `id` (bigint, primary key)
- `order_id` (bigint)
- `product_id` (bigint)
- `product_name` (text)
- `quantity` (int)
- `unit_price` (numeric)
- `total_price` (numeric)

6. `wishlist`
- `id` (bigint, primary key)
- `user_id` (uuid)
- `product_id` (bigint)
- `created_at` (timestamp, default now())
- Unique index on `(user_id, product_id)`

## Current Supabase Integrations

### Products
- Catalog fetches products from Supabase
- Realtime subscription on products table
- Local mock fallback if Supabase fails or returns empty

### Orders
- Checkout stores customer/order data in Supabase
- Cart items are inserted into `order_items`
- WhatsApp checkout remains always active (never blocked)

### Customers
- Customer is created if not existing (based on phone)
- Existing customer info is updated when ordering

### Wishlist
- LocalStorage wishlist always works
- If Supabase auth session exists, wishlist syncs to `wishlist` table

### Admin Dashboard
- Add product (local + Supabase sync when available)
- Edit product price (local + Supabase sync)
- Delete product (local + Supabase sync)
- Orders can be loaded from Supabase
- Order status updates are synced to Supabase

## PWA Support

Added:

- `public/manifest.webmanifest`
- `public/sw.js`
- `public/offline.html`
- install prompt button in UI
- service worker registration in `src/main.tsx`

## SEO & Marketing

Added/updated:

- page-level SEO via `react-helmet-async`
- Open Graph + Twitter card tags
- `public/sitemap.xml`
- `public/robots.txt`
- canonical URLs and robots metadata

## Deployment

### Vercel

- Config file: `vercel.json`
- Build command: `npm run build`
- Output: `dist`

### Netlify

- Config file: `netlify.toml`
- Build command: `npm run build`
- Publish directory: `dist`
- SPA redirect configured

## Managing Content

### Update products quickly

- Preferred: Supabase `products` table
- Fallback/mock source: `src/data/products.ts`

### Update store location/contact

Edit `src/data/store.ts`:
- `STORE_INFO`
- `STORE_LOCATION`

### Update AI recommender logic

Edit `src/components/AIProductRecommender.tsx` scoring rules.

### Update AI/live support responses

Edit `src/components/chat/AIAssistantWidget.tsx` in `buildAssistantReply()`.

## Build Status

- `npm run typecheck`: ✅
- `npm run build`: ✅

