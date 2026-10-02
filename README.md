# Kiddy Closet 🧸

> **Little Styles, Big Smiles** — Premium Baby Clothing Catalogue Platform

A complete, production-ready baby clothing boutique catalogue platform. Designed as an exclusive **catalogue only** platform with **WhatsApp Enquiry** as the primary customer action. No cart, checkout, or customer account requirements.

---

## 🌟 Architecture Overview

```
kidz/
├── AdminPanel/     # React Native Web + Vite Admin Management Panel (Port 3001)
├── Frontend/       # React JS + Vite Customer Boutique Catalogue & Integrated REST API (Port 3000)
└── package.json    # Root scripts for launching AdminPanel & Frontend
```

---

## 🚀 Quick Start & Running Locally

| App | Description | URL | Port |
|---|---|---|---|
| **Frontend** | Customer Catalogue & REST API | [http://localhost:3000](http://localhost:3000) | `3000` |
| **AdminPanel** | React Native Web Management | [http://localhost:3001](http://localhost:3001) | `3001` |

### Running Commands:
```bash
# In project root:
npm run dev:frontend  # Starts Frontend & API on port 3000
npm run dev:admin     # Starts AdminPanel on port 3001

# Or cd directly into folders:
cd Frontend && npm run dev
cd AdminPanel && npm run dev

# Building for production:
npm run build:frontend
npm run build:admin
```

---

## 🔑 Admin Credentials

| Field | Value |
|---|---|
| **Login URL** | [http://localhost:3001](http://localhost:3001) |
| **Email** | `admin@kiddycloset.com` |
| **Password** | `Admin@123456` |
| **Role** | Superadmin |

---

## 💬 WhatsApp Enquiry System

When customers click **"Enquire on WhatsApp"** on any product card or detail page:
- It generates a pre-formatted message including:
  - Product Name & Category
  - Selected Age Size (e.g. `0-3 Months`, `6-9 Months`)
  - Age-specific catalogue price (e.g. `₹999`)
  - Direct URL link to the product in the catalogue
- Direct link format:
  `https://wa.me/{whatsappNumber}?text=Hi%20Kiddy%20Closet...`
- Configurable directly from the **Admin Panel -> Settings** (`whatsappNumber`).

---

## 💎 Features Implemented

### 1. Customer Catalogue Website (`apps/web`)
- **Luxury Baby Boutique Aesthetic**: Soft pastel colors (`#FFE5EC`, `#D8EEFE`, `#FFE5D9`), cream backgrounds, rounded cards, ambient 3D decorations.
- **Header**: Responsive navigation, brand tagline, live announcement pill, and direct WhatsApp contact.
- **Hero Section**: High-resolution photography, value pillars (100% Organic, Age-Wise Custom Fit, Direct WhatsApp Assistance), and quick CTA links.
- **Baby Boys & Girls Showcase Cards**: Distinct gender cards with previews and age counters.
- **Interactive Catalogue & Filters**:
  - Live search with instant filtering
  - Category selector (`All`, `Boys`, `Girls`)
  - Age dropdown (`0-3M`, `3-6M`, `6-9M`, `9-12M`, `12-18M`, `18-24M`, `2-3Y`)
  - Dress style selector (`Romper`, `Frock`, `Partywear`, `Two-Piece Set`, etc.)
  - Collection filter (`Newborn Essentials`, `Party & Festive Sparkle`, `Playtime Rompers & Sets`, `Sunny Days & Summer Fun`)
  - Sorting (`Featured`, `Price: Low to High`, `Price: High to Low`, `Newest`)
- **Product Detail Page (`/product/[slug]`)**:
  - High-res image gallery with thumbnail preview
  - Interactive **Age-Based Pricing Table**: clicking an age bracket updates the active price and syncs to the WhatsApp payload
  - Large **"Enquire on WhatsApp"** CTA button with celebratory confetti
  - Baby Safety & Fabric care specifications
  - "You May Also Adore" related products grid
- **Floating WhatsApp Concierge**: Persistent bottom-right widget with quick question presets (Sizing help, fabric safety, delivery timeframe).

### 2. Admin Panel (`apps/admin`)
- Built with **React Native Web & TypeScript**.
- **Secure Authentication**: JWT token authentication with auto-login persistence.
- **Dashboard**:
  - Live KPI metrics (Total products, Boys, Girls, In-stock, Out-of-stock)
  - Quick action shortcuts
  - Recent products feed
- **Product Management (CRUD)**:
  - Full outfit list with search and category filtering
  - Add & Edit outfit form: Name, Category, Dress Type, Collection, Description, Availability, Featured badge
  - Image uploader with live preview, order badges, and delete action
  - Dynamic **Age-Based Pricing Editor**: add/remove age tiers, configure custom prices and availability per size
  - Delete with confirmation
- **Age Brackets Management (CRUD)**:
  - Create and edit age brackets (e.g. `0-3 Months`, min/max months, active state)
- **Collections Management (CRUD)**:
  - Add, edit, and organize seasonal collections
- **Business Settings**:
  - Update primary WhatsApp number, customer care phone, store address, email, and social links.

### 3. Backend REST API (`apps/api`)
- Node.js, Express, and TypeScript.
- **Dual-Mode Persistence**:
  - Works out of the box with file-backed persistence (`data/store.json`) and local static uploads (`/uploads`).
  - Supports Google Cloud / Firebase Firestore & Storage credentials if provided in `.env`.
- Seed script (`npm run seed`) populating 8 complete sample baby outfits, 7 age brackets, 4 collections, business settings, and superadmin account.
# littleplacket
