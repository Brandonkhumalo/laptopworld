# Mbuluundi Investments

## Overview
Full-stack e-commerce platform for Mbuluundi Investments, Zimbabwe's premier tech store. Built with independent React frontend and Django backend, designed to be independently hostable.

## Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5 (port 5000)
- **Styling**: Tailwind CSS 3 with shadcn/ui components
- **Routing**: react-router-dom v6
- **State/Data**: @tanstack/react-query v5
- **Animations**: framer-motion
- **Icons**: lucide-react

### Backend
- **Framework**: Django 5 with Django REST Framework
- **Database**: SQLite3
- **Auth**: Token-based admin authentication (Bearer tokens)
- **CORS**: django-cors-headers
- **Port**: 8000

## Project Structure

### Frontend (`src/`)
- `components/` - Reusable UI components (Navbar with hover dropdowns, ProductCard with wishlist, FeaturedProducts, Categories, CountdownBanner, HeroSection, Footer)
  - `ui/` - shadcn/ui primitive components
- `pages/` - Page-level route components
  - `Index.tsx` - Home page with hero, featured products, categories, deals banner (sections hide when no data)
  - `ShopPage.tsx` - All products with search and category filters
  - `DealsPage.tsx` - Active deals listing
  - `CategoryPage.tsx` - Products filtered by category
  - `ProductPage.tsx` - Product detail with image gallery, key features, tabs (About/Specifications), sticky pricing sidebar
  - `CartPage.tsx` - Cart with checkout flow (delivery/collection)
  - `WishlistPage.tsx` - Saved items page
  - `AdminLogin.tsx` - Admin login page
  - `AdminDashboard.tsx` - Full admin panel (categories with types, products with structured specs, top picks, deals, orders)
- `hooks/use-cart.tsx` - Cart provider with API sync
- `hooks/use-wishlist.tsx` - Wishlist provider with localStorage persistence
- `lib/api.ts` - Centralized API layer communicating with Django backend
- `lib/specTemplates.ts` - Category-specific specification field templates (phone, laptop, smartwatch, accessory, other)
- `assets/` - Static assets (logo, hero banner)

### Backend (`backend/`)
- `config/` - Django project settings
- `api/` - Main API app
  - `models.py` - Category (with category_type), Product (with key_features, brand, condition, warranty), ProductImage, Deal, TopPick, Cart, CartItem, Order, OrderItem
  - `views.py` - REST API viewsets and custom actions (multi-image upload support)
  - `serializers.py` - DRF serializers
  - `urls.py` - API URL routing
  - `middleware.py` - CSRF exemption for API routes

## API Endpoints
- `GET/POST /api/categories/` - Category CRUD (includes category_type: phone/laptop/smartwatch/accessory/other)
- `GET/POST /api/products/` - Product CRUD (supports ?category, ?search; includes key_features, specifications, multiple images)
- `DELETE /api/product-images/<id>/delete/` - Delete individual product image
- `GET/POST /api/deals/` - Deal management
- `GET/POST /api/top-picks/` - Top picks management
- `GET /api/cart/` - Get cart (uses X-Cart-Session header)
- `POST /api/cart/add/` - Add to cart
- `PUT/DELETE /api/cart/item/<id>/` - Update/remove cart item
- `POST /api/checkout/` - Create order from cart
- `GET /api/orders/` - List orders (admin only)
- `POST /api/orders/<id>/update_status/` - Update order status
- `POST /api/auth/login/` - Admin login (returns Bearer token)
- `GET /api/auth/check/` - Verify auth status

## Running
- Workflow "Django Backend" runs `cd backend && python manage.py runserver 0.0.0.0:8000`
- Workflow "Start application" runs `npm run dev` on port 5000

## Key Features
- Admin dashboard with tabs: Categories, Products, Top Picks, Deals, Online Purchases
- Category types (phone/laptop/smartwatch/accessory/other) drive specification field templates
- Product form shows structured spec fields based on category type (not raw JSON)
- Multiple product images (up to 8) with gallery view on product page
- Key features as bullet points displayed prominently on product detail page
- Product page with 3-column layout: image gallery | key features | sticky pricing sidebar
- Tabbed content below: "About This Item" (description) and "Specifications" (grouped table)
- 6-item rotating product slider for top picks
- Navbar with hover dropdowns on desktop
- Wishlist system with localStorage persistence, heart icon on product cards and detail page
- Product search across product names, category names, and descriptions
- Persistent cart with session-based tracking
- Checkout with delivery/collection options
- Order management with status tracking
- Deal pricing with automatic discount badges
- Dynamic footer (categories fetched from API)
- Sections (Top Picks, Categories, Deals Banner) hide when no admin data exists

## Admin Credentials
- Username: Mbuluundi
- Password: admin@Mbuluundi
- Login at: /admin

## Environment
- `VITE_API_URL` - Override backend URL (defaults to http://localhost:8000)
