# Laptop World - E-Commerce Platform

## Overview

Full-stack e-commerce platform for **Laptop World Zimbabwe** — selling laptops, cellphones, smartwatches, and accessories. Next.js frontend + Django REST backend with PayNow Zimbabwe payments, Google Maps delivery, and an admin dashboard.

## Tech Stack

| Layer        | Technology                                                    |
| ------------ | ------------------------------------------------------------- |
| Frontend     | Next.js 16 (App Router), React 18, TypeScript                |
| UI           | shadcn/ui (Radix primitives), Tailwind CSS, Framer Motion     |
| State        | React Context (cart, wishlist), localStorage persistence       |
| Data         | @tanstack/react-query (configured), centralized fetch client   |
| Forms        | react-hook-form + Zod validation                              |
| Backend      | Django 5, Django REST Framework, SQLite                       |
| Payments     | PayNow Zimbabwe (Paynow Python SDK)                           |
| Maps         | Google Maps JS API (dynamic script loading)                   |
| Email        | Resend API                                                    |
| Testing      | Vitest + @testing-library/react (JSDOM)                       |

## Project Structure

```
app/                   # Next.js App Router pages
├── layout.tsx         # Root layout with metadata + Providers
├── providers.tsx      # Client providers (QueryClient, Cart, Wishlist, Toasters)
├── globals.css        # Tailwind base + CSS variable theming
├── page.tsx           # Homepage (/)
├── not-found.tsx      # 404 page
├── shop/page.tsx      # /shop
├── deals/page.tsx     # /deals
├── cart/page.tsx      # /cart
├── wishlist/page.tsx  # /wishlist
├── category/[id]/     # /category/:id
├── product/[id]/      # /product/:id
├── payment-status/[orderNumber]/  # /payment-status/:orderNumber
├── admin/page.tsx     # /admin (login)
├── admin/dashboard/   # /admin/dashboard
└── amenities/page.tsx # /amenities

src/
├── components/        # Reusable UI components (ProductCard, Navbar, AddressPicker, etc.)
│   └── ui/            # shadcn/ui primitives (~40 components)
├── views/             # Page-level view components (rendered by app/ route pages)
├── hooks/             # Custom hooks: use-cart, use-wishlist, use-mobile, use-toast
├── lib/               # Utilities: api.ts (API client), utils.ts (cn helper), specTemplates.ts
├── assets/            # Source images (copied to public/images/ at build)
└── test/              # Vitest setup and test files

public/
├── logo.png           # Site favicon and logo
├── robots.txt         # SEO robots directive
└── images/            # Static images served at /images/*

backend/
├── config/            # Django settings, root URLs, WSGI/ASGI
├── api/               # Main app: models, views (ViewSets), serializers, services, middleware
│   ├── models.py      # Category, Product, ProductImage, Cart, Order, Deal, DeliverySetting
│   ├── views.py       # DRF ViewSets + custom auth endpoints
│   ├── serializers.py # All DRF serializers
│   ├── services.py    # PayNow payment + Resend email integration
│   └── middleware.py   # CSRF bypass for /api/ routes
├── media/             # Uploaded product images
└── db.sqlite3         # Development database
```

## Key Files

- **Root layout**: `app/layout.tsx` — metadata, fonts, global CSS, Providers wrapper
- **Providers**: `app/providers.tsx` — QueryClient, Cart, Wishlist, Toasters (client component)
- **API client**: `src/lib/api.ts` — all frontend-to-backend communication, session/token handling
- **Cart logic**: `src/hooks/use-cart.tsx` — Context provider, API-synced cart with localStorage session
- **Wishlist**: `src/hooks/use-wishlist.tsx` — Context provider, localStorage-only persistence
- **Spec templates**: `src/lib/specTemplates.ts` — category-specific product field definitions
- **Admin auth**: `backend/api/views.py` — in-memory token store, SHA256 token generation
- **Payment flow**: `backend/api/services.py` — PayNow initiation + polling
- **API proxy**: `next.config.js` — rewrites `/api/*` and `/media/*` to Django on port 8000

## Adding new features or fixing bug

## Commands
**IMPORTANT** : when you work on a new feature or bug, create a git branch first. Then work on changes in that branch for the remainder of the session

## Commands

```bash
# Frontend
npm run dev           # Next.js dev server on http://localhost:5000
npm run build         # Production build → .next/
npm run start         # Start production server on port 5000
npm run lint          # Next.js lint
npm run test          # Vitest (single run)
npm run test:watch    # Vitest (watch mode)

# Backend
cd backend
python manage.py runserver 8000    # Django dev server
python manage.py migrate           # Apply DB migrations
python manage.py createsuperuser   # Create admin user
```

Both servers must run simultaneously — Next.js rewrites proxy API requests to Django.

## Environment Variables

Backend requires (in environment or `.env`):
- `PAYNOW_INTEGRATION_ID`, `PAYNOW_INTEGRATION_KEY` — PayNow credentials
- `RESEND_API_KEY` — Email service
- `GOOGLE_MAPS_API_KEY` — Maps integration (served via `/api/maps-key/` endpoint)

## Important Conventions

- **Path aliases**: `@/` maps to `src/` (see `tsconfig.json`)
- **TypeScript config**: Relaxed — `noImplicitAny: false`, `strictNullChecks: false` (`tsconfig.json`)
- **App Router**: Pages in `app/` are server components by default; view components in `src/views/` use `"use client"`
- **Routing**: Use `next/link` for `<Link>`, `next/navigation` for `useRouter`, `useParams`, `useSearchParams`, `usePathname`
- **API pattern**: All API calls go through `src/lib/api.ts` namespaced object (e.g., `api.products.list()`)
- **Auth**: Bearer token in `Authorization` header, cart session via `X-Cart-Session` header
- **Components**: Functional components only, hooks for shared state, Framer Motion for animations
- **Static images**: Stored in `public/images/`, referenced as `/images/filename`
- **Backend permissions**: ViewSets use `AllowAny` for read, `IsAdminUser` for write operations

## Additional Documentation

When working on specific areas, consult these files for detailed patterns:

| Topic | File | When to check |
| ----- | ---- | ------------- |
| Architecture & patterns | `.claude/docs/architectural_patterns.md` | Modifying state, API calls, auth, payments, maps, or component structure |
