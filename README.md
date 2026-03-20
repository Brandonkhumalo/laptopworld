# Laptop World Zimbabwe

E-commerce platform for **Laptop World Zimbabwe** — selling laptops, cellphones, smartwatches, and accessories. Built with Next.js and Django REST Framework.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![Django](https://img.shields.io/badge/Django-5-092E20?logo=django)
![TypeScript](https://img.shields.io/badge/TypeScript-blue?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)

## Features

- **Product Catalog** — Browse laptops, cellphones, smartwatches, and accessories by category
- **Shopping Cart** — API-synced cart with localStorage session persistence
- **Wishlist** — Save products for later (localStorage-based)
- **PayNow Payments** — Zimbabwe-native payment integration (EcoCash, OneMoney, etc.)
- **Google Maps Delivery** — Address picker with delivery zone support
- **Admin Dashboard** — Manage products, categories, orders, and deals
- **Deals & Promotions** — Time-limited deals with discount pricing
- **Responsive Design** — Mobile-first UI with shadcn/ui components and Framer Motion animations
- **Email Notifications** — Order confirmation and status updates via Resend

## Tech Stack

| Layer     | Technology                                          |
| --------- | --------------------------------------------------- |
| Frontend  | Next.js 16 (App Router), React 18, TypeScript       |
| UI        | shadcn/ui (Radix), Tailwind CSS, Framer Motion      |
| State     | React Context (cart, wishlist), TanStack React Query |
| Forms     | react-hook-form + Zod                                |
| Backend   | Django 5, Django REST Framework                      |
| Database  | SQLite (dev) / PostgreSQL (prod)                     |
| Payments  | PayNow Zimbabwe                                      |
| Maps      | Google Maps JS API                                   |
| Email     | Resend API                                           |
| Testing   | Vitest + Testing Library                             |

## Prerequisites

- **Node.js** >= 18
- **Python** >= 3.10
- **npm** or **yarn**

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/laptopworld.git
cd laptopworld
```

### 2. Set up the backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser  # Create an admin account
```

### 3. Set up the frontend

```bash
# From the project root
npm install
```

### 4. Configure environment variables

Create a `.env` file in the `backend/` directory:

```env
PAYNOW_INTEGRATION_ID=your_paynow_id
PAYNOW_INTEGRATION_KEY=your_paynow_key
RESEND_API_KEY=your_resend_api_key
GOOGLE_MAPS_API_KEY=your_google_maps_key
```

### 5. Run both servers

You need both servers running simultaneously — Next.js proxies API requests to Django.

```bash
# Terminal 1 — Backend (port 8000)
cd backend
python manage.py runserver 8000

# Terminal 2 — Frontend (port 5000)
npm run dev
```

Open [http://localhost:5000](http://localhost:5000) in your browser.

## Project Structure

```
app/                    # Next.js App Router pages
src/
├── components/         # Reusable UI components
│   └── ui/             # shadcn/ui primitives
├── views/              # Page-level view components
├── hooks/              # Custom hooks (cart, wishlist, toast)
├── lib/                # Utilities (API client, helpers)
└── test/               # Test setup and test files

backend/
├── config/             # Django settings, URLs, WSGI
├── api/                # Models, views, serializers, services
│   ├── models.py       # Category, Product, Order, Deal, etc.
│   ├── views.py        # DRF ViewSets + auth endpoints
│   ├── serializers.py  # REST serializers
│   └── services.py     # PayNow + Resend integrations
└── media/              # Uploaded product images
```

## Scripts

| Command            | Description                          |
| ------------------ | ------------------------------------ |
| `npm run dev`      | Start Next.js dev server (port 5000) |
| `npm run build`    | Production build                     |
| `npm run start`    | Start production server (port 5000)  |
| `npm run lint`     | Run ESLint                           |
| `npm run test`     | Run tests (single run)               |
| `npm run test:watch` | Run tests (watch mode)             |

## Admin Access

Navigate to [http://localhost:5000/admin](http://localhost:5000/admin) to access the admin dashboard. Use the credentials you created with `createsuperuser`.

## Payment Flow

1. Customer places an order and selects PayNow as payment method
2. Backend initiates a PayNow transaction (EcoCash, OneMoney, etc.)
3. Customer completes payment on their mobile device
4. Backend polls PayNow for payment status
5. Order status updates and confirmation email is sent via Resend

## License

This project is proprietary software owned by Laptop World Zimbabwe.
