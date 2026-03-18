# Architectural Patterns & Design Decisions

## 1. State Management: Context + Hooks

The app uses **React Context API** for shared state instead of Redux or Zustand. Each domain gets its own context + provider:

- **Cart** (`src/hooks/use-cart.tsx:45-110`): API-synced state. On mount, fetches from backend. Every mutation (add/update/remove) calls the API then updates local state. Session tracked via UUID in localStorage (`X-Cart-Session` header).
- **Wishlist** (`src/hooks/use-wishlist.tsx:14-71`): Local-only state. Persists to localStorage via `useEffect` on every change. No backend sync.

**Pattern**: Provider wraps the app in `src/App.tsx:24-47` — `CartProvider` and `WishlistProvider` nest inside `QueryClientProvider` and `BrowserRouter`.

**Convention**: Access state via custom hooks (`useCart()`, `useWishlist()`) — never import context directly.

## 2. API Client Architecture

All API communication is centralized in `src/lib/api.ts`.

**Structure** (`src/lib/api.ts:24-52`):
- Private `apiFetch()` function handles headers, auth tokens, cart sessions, error handling
- Public `api` object exposes namespaced methods: `api.products.list()`, `api.cart.add()`, etc.
- FormData detection: skips `Content-Type: application/json` when body is `FormData` (for image uploads)

**Session management** (`src/lib/api.ts:3-22`):
- Cart session: UUID generated on first visit, stored in `localStorage('cart_session')`
- Admin token: stored in `localStorage('admin_token')`, sent as `Bearer` in `Authorization` header

**Convention**: Never call `fetch()` directly from components — always use the `api` object.

## 3. Authentication Pattern

**Admin-only auth** — no customer accounts exist.

**Frontend** (`src/lib/api.ts:12-22`, `src/pages/AdminLogin.tsx`):
- Login stores token in localStorage
- Every API call auto-attaches token via `apiFetch()` if present
- Dashboard checks auth on mount (`src/pages/AdminDashboard.tsx:67-73`)

**Backend** (`backend/api/views.py:20-59`):
- In-memory `admin_tokens` dict (not persistent across restarts)
- Login creates SHA256 hash of `username + timestamp` as token
- `IsAdminUser` permission class extracts Bearer token from header, checks dict

**Convention**: ViewSets use conditional permissions — `AllowAny` for `list`/`retrieve`, `IsAdminUser` for `create`/`update`/`destroy` (`backend/api/views.py:62-70`).

## 4. Backend ViewSet Pattern

All API endpoints use DRF `ModelViewSet` with `DefaultRouter` auto-registration (`backend/api/urls.py`).

**Common patterns**:
- **Conditional permissions**: `get_permissions()` override per ViewSet (`backend/api/views.py:67-70`)
- **Query parameter filtering**: `get_queryset()` reads `?category=`, `?search=` from URL (`backend/api/views.py:81-93`)
- **Multi-image upload**: `perform_create()` handles `additional_images` from `FILES.getlist()` (`backend/api/views.py:112-114`)
- **Custom actions**: Cart operations use `@api_view` function views, not ViewSet actions (`backend/api/views.py:186+`)

**Convention**: Models use JSONField for flexible data (product specs, deal metadata).

## 5. Payment Integration (PayNow)

Two-phase payment flow:

**Initiation** (`backend/api/services.py:14-38`):
1. Create PayNow payment object with order number + customer email
2. Add each order item as a line item
3. Send payment → receive `redirect_url` + `poll_url`
4. Store `poll_url` on Order model
5. Return `redirect_url` → frontend redirects user to PayNow

**Verification** (`backend/api/services.py:41-60`):
1. Frontend polls `/api/orders/{id}/check-payment/` after redirect back
2. Backend calls PayNow `check_transaction_status()` with stored `poll_url`
3. Status mapped: `paid`/`delivered`/`awaiting delivery` → mark order as paid

**Frontend flow** (`src/pages/CartPage.tsx:54-74`): `handleCheckout()` → `api.checkout.create()` → `window.location.href = redirect_url`

## 6. Google Maps Integration

**Dynamic loading** (`src/components/AddressPicker.tsx:52-76`):
- Script injected into DOM on component mount (not loaded globally)
- Uses `window.initGoogleMaps` callback pattern
- API key fetched from backend via `/api/maps-key/` endpoint

**Harare boundary detection** (`src/components/AddressPicker.tsx:14-30`):
- Haversine formula calculates distance from `HARARE_CENTER` (-17.8292, 31.0522)
- Addresses within 30km radius are "in Harare" → standard delivery fee
- Outside Harare → higher fee or collection only

**Convention**: All map logic lives in `AddressPicker` component — delivery fee decisions happen on the frontend.

## 7. Component Patterns

**Animation convention**: Framer Motion `motion.div` with scroll-triggered entry animations:
- `initial={{ opacity: 0, y: 30 }}` → `whileInView={{ opacity: 1, y: 0 }}`
- Staggered via `delay: index * 0.08`
- Example: `src/components/ProductCard.tsx:52-59`

**Carousel pattern**: Index-wrapping for infinite scroll:
- `setStartIndex((prev) => (prev + 1) % products.length)`
- Auto-advance via `setInterval` in `useEffect`
- Example: `src/components/FeaturedProducts.tsx:31-44`

**Dropdown pattern**: Timeout-based hover menus (not click-based):
- `clearTimeout` on enter, `setTimeout(300ms)` on leave
- Example: `src/components/Navbar.tsx:65-72`

## 8. Styling System

**Theming** (`src/index.css:7-89`):
- HSL CSS variables for all colors (Tailwind's `hsl(var(--primary))` pattern)
- Dark mode variables defined in `.dark` selector
- Custom gradients: `--gradient-hero`, `--gradient-accent`

**Tailwind extensions** (`tailwind.config.ts`):
- Custom fonts: Space Grotesk (headings), Inter (body)
- Custom shadows: `shadow-product`, `shadow-card`
- Custom animations: `fade-in`, `slide-up`, `scale-in`

**Convention**: Use `cn()` utility (`src/lib/utils.ts`) for conditional class merging (clsx + tailwind-merge).

## 9. Routing

Flat route structure in `src/App.tsx:29-42`:
- No nested layouts or route groups
- Dynamic segments: `/product/:id`, `/category/:id`, `/payment-status/:orderNumber`
- Admin routes: `/admin` (login), `/admin/dashboard`

**Convention**: Pages handle their own data fetching in `useEffect` on mount. No route-level loaders.

## 10. Data Models (Backend)

Key relationships (`backend/api/models.py`):
- `Product` → `Category` (ForeignKey)
- `Product` → `ProductImage` (one-to-many, ordered)
- `Cart` → `CartItem` → `Product` (session-based, UUID key)
- `Order` → `OrderItem` (snapshot of product data at purchase time)
- `Deal` → `Product` (ForeignKey, with `discount_percentage` + `start_date`/`end_date`)
- `DeliverySetting` — singleton-like config for delivery fees

**Convention**: Product specs stored as JSON (`specifications` field) — structure varies by category, defined in `src/lib/specTemplates.ts`.
