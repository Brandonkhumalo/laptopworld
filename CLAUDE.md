# Laptop World - E-Commerce Platform

## Overview

Full-stack e-commerce platform for **Laptop World Zimbabwe** — selling laptops, cellphones, smartwatches, and accessories. React frontend + Django REST backend with PayNow Zimbabwe payments, Google Maps delivery, and an admin dashboard.

## Tech Stack

| Layer        | Technology                                                    |
| ------------ | ------------------------------------------------------------- |
| Frontend     | React 18, TypeScript, Vite (SWC), react-router-dom v6        |
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
src/
├── components/        # Reusable UI components (ProductCard, Navbar, AddressPicker, etc.)
│   └── ui/            # shadcn/ui primitives (~40 components)
├── pages/             # Route-level pages (Index, ShopPage, CartPage, AdminDashboard, etc.)
├── hooks/             # Custom hooks: use-cart, use-wishlist, use-mobile, use-toast
├── lib/               # Utilities: api.ts (API client), utils.ts (cn helper), specTemplates.ts
├── assets/            # Static images and logos
├── test/              # Vitest setup and test files
├── App.tsx            # Root: providers + router setup
└── index.css          # Tailwind base + CSS variable theming

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

- **API client**: `src/lib/api.ts` — all frontend-to-backend communication, session/token handling
- **Cart logic**: `src/hooks/use-cart.tsx` — Context provider, API-synced cart with localStorage session
- **Wishlist**: `src/hooks/use-wishlist.tsx` — Context provider, localStorage-only persistence
- **Routes**: `src/App.tsx:29-42` — all page routes defined
- **Spec templates**: `src/lib/specTemplates.ts:14-281` — category-specific product field definitions
- **Admin auth**: `backend/api/views.py:20-59` — in-memory token store, SHA256 token generation
- **Payment flow**: `backend/api/services.py:14-60` — PayNow initiation + polling
- **Vite proxy**: `vite.config.ts:13-22` — `/api/*` and `/media/*` proxy to Django on port 8000

## Adding new features or fixing bug

## Commands
**IMPORTANT** : when you work on a new feature or bug, create a git branch first. Then work on changes in that branch for the remainder of the session

## Commands

```bash
# Frontend
npm run dev           # Vite dev server on http://localhost:5000
npm run build         # Production build → dist/
npm run build:dev     # Dev build with debug flags
npm run lint          # ESLint
npm run test          # Vitest (single run)
npm run test:watch    # Vitest (watch mode)

# Backend
cd backend
python manage.py runserver 8000    # Django dev server
python manage.py migrate           # Apply DB migrations
python manage.py createsuperuser   # Create admin user
```

Both servers must run simultaneously — Vite proxies API requests to Django.

## Environment Variables

Backend requires (in environment or `.env`):
- `PAYNOW_INTEGRATION_ID`, `PAYNOW_INTEGRATION_KEY` — PayNow credentials
- `RESEND_API_KEY` — Email service
- `GOOGLE_MAPS_API_KEY` — Maps integration (served via `/api/maps-key/` endpoint)

## Important Conventions

- **Path aliases**: `@/` maps to `src/`, `@assets/` maps to `attached_assets/` (see `vite.config.ts`)
- **TypeScript config**: Relaxed — `noImplicitAny: false`, `strictNullChecks: false` (`tsconfig.json`)
- **API pattern**: All API calls go through `src/lib/api.ts` namespaced object (e.g., `api.products.list()`)
- **Auth**: Bearer token in `Authorization` header, cart session via `X-Cart-Session` header
- **Components**: Functional components only, hooks for shared state, Framer Motion for animations
- **Backend permissions**: ViewSets use `AllowAny` for read, `IsAdminUser` for write operations

## Additional Documentation

When working on specific areas, consult these files for detailed patterns:

| Topic | File | When to check |
| ----- | ---- | ------------- |
| Architecture & patterns | `.claude/docs/architectural_patterns.md` | Modifying state, API calls, auth, payments, maps, or component structure |
