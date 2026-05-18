# Fifty Store - React + Tailwind E-commerce

Modern e-commerce frontend for **Fifty Store** (Tunisia), built with React, TypeScript, Tailwind CSS, and Vite.

## Store Info

- Store: **Fifty Store**
- Founder: **Wissem Loueti**
- Phone / WhatsApp: **+216 99 400 090**
- Currency: **TND**
- Delivery: **Livraison sur toute la Tunisie**
- Payment: **Paiement a la livraison**

## Features

- Light / Dark theme with localStorage persistence
- Vibrant premium theme (orange/fuchsia) + attention animations
- Premium responsive UI (desktop + mobile)
- Real routing with `react-router-dom`
- Auth system with roles (`admin` / `client`)
- Login/Register with email/password
- Google login/signup via Supabase OAuth
- Protected routes (admin and client separated)
- Product listing + details
- Cart with quantity updates and localStorage
- Checkout with WhatsApp order generation
- Wishlist/favorites with localStorage
- Advanced filters (search, category, brand, price, sort)
- Store location section with Google Maps iframe
- Contact, About, and Admin demo pages
- Toast notifications via `react-hot-toast`
- SEO basics with `react-helmet-async`
- Loading states + product skeletons + empty states

## Routes

- `/` Home
- `/shop` Shop
- `/product/:id` Product details
- `/cart` Cart
- `/checkout` Checkout
- `/wishlist` Wishlist
- `/contact` Contact
- `/about` About
- `/login` Login
- `/register` Register
- `/account` Client account (protected)
- `/admin` Admin dashboard (protected)

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- `react-router-dom`
- `react-hot-toast`
- `react-helmet-async`
- `lucide-react`

## Getting Started

```bash
npm install
npm run dev
```

Open: `http://localhost:5173`

## Access Frontend / Backend

### Frontend (local)

```bash
cd "C:\Users\LENOVO\Downloads\fifty store\project"
npm install
npm run dev
```

Then open:

- `http://localhost:5173`

### Backend

This project does **not** include a separate Node/Express backend folder.
Current backend is handled by **Supabase** (Auth + DB/API).

To access backend:

1. Create/connect your Supabase project
2. Add env vars in project root `.env`:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ADMIN_EMAIL=admin@email.com
VITE_ADMIN_LOCAL_PASSWORD=Admin@12345
```

3. Open Supabase dashboard:

- `https://supabase.com/dashboard`
- Project panel: Auth, Database, Tables, API

If Supabase env vars are missing, app still works in local auth fallback mode (no external backend).

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run typecheck
```

## Important Config To Update

Edit: `src/data/store.ts`

```ts
export const STORE_LOCATION = {
  name: "Fifty Store",
  address: "Tunisia",
  city: "Tunisia",
  phone: "+216 99 400 090",
  googleMapsUrl: "https://maps.app.goo.gl/KX1CNrLEs2SmmFqVA?g_st=ic",
  embedMapUrl: "https://maps.google.com/maps?q=36.8065,10.1815&z=15&output=embed"
};
```

You can change:

- `address` to your exact boutique address
- `googleMapsUrl` to your preferred public maps link
- `embedMapUrl` if you want a different map center/zoom

## Auth Config (Google + Admin)

Create `.env` in project root:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ADMIN_EMAIL=admin@email.com
VITE_ADMIN_LOCAL_PASSWORD=Admin@12345
```

Notes:

- If Supabase env is set: email auth + Google OAuth are active.
- If Supabase env is missing: app uses local auth fallback.
- Local fallback auto-creates admin account:
  - email = `VITE_ADMIN_EMAIL` (or default `admin@fiftystore.tn`)
  - password = `VITE_ADMIN_LOCAL_PASSWORD` (or default `Admin@12345`)

For Google OAuth in Supabase:

1. Enable **Google** provider in Supabase Auth settings.
2. Add your app URL in redirect URLs (example: `http://localhost:5173`).
3. Configure Google client ID/secret in Supabase.

## WhatsApp Checkout

Checkout opens:

`https://wa.me/21699400090?text=...`

Message includes:

- customer name, phone, city, address, notes
- product names, quantities, unit prices
- total price
- payment method
- delivery info

## Build Status

- Lint: passing
- Typecheck: passing
- Production build: passing
