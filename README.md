# SYNAPSE LABS — Next-Generation Spatial Hardware Showroom

[![Next.js 15](https://img.shields.io/badge/Next.js-15.5.27-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-000000?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/atlas)
[![Stripe](https://img.shields.io/badge/Stripe-Checkout-635BFF?style=for-the-badge&logo=stripe)](https://stripe.com/)
[![Tests](https://img.shields.io/badge/Tests-41%2F41%20Passing-brightgreen?style=for-the-badge)](https://github.com/techwithmano/synapselabs)

> **Live Production Storefront:** [https://synapselabs-nu.vercel.app](https://synapselabs-nu.vercel.app)

---

## 1. Executive Summary & Academic Abstract

**SYNAPSE LABS** is a full-stack, enterprise-grade e-commerce application and tactile hardware showroom engineered for next-generation spatial computing and neuro-wearable devices. 

Designed under the **"Engineered Calm"** aesthetic philosophy, the platform pairs an ultra-clean industrial hardware design system (porcelain ceramics, brushed aerospace titanium, and glowing optical cobalt) with an interactive **Three.js WebGL 3D showcase**, real-time telemetry simulation lab, dual-currency international pricing engine, full-stack MongoDB Atlas data persistence, JWT session security, and live Stripe payment processing.

---

## 2. System Architecture & Technical Stack

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT BROWSER                                 │
│   Next.js 15 App Router · React 19 · Three.js WebGL · Vanilla CSS System    │
└───────────────┬─────────────────────────────────────────────┬───────────────┘
                │ HTTP Requests / Server Actions              │ WebGL Canvas
                ▼                                             ▼
┌───────────────────────────────────────────┐   ┌─────────────────────────────┐
│          NEXT.JS ROUTE HANDLERS           │   │    INTERACTIVE 3D ENGINE    │
│  /api/products  /api/orders  /api/auth/*   │   │  CAD Lathe Smart Ring Mesh  │
│  /api/checkout (Stripe Session Orchestrator)│   │  RoomEnvironment PBR Light  │
└───────┬───────────────────────────┬───────┘   │  360° Drag & Touch Damping  │
        │                           │           └─────────────────────────────┘
        ▼                           ▼
┌──────────────────┐    ┌─────────────────────────────────────────────────────┐
│  MONGODB ATLAS   │    │                STRIPE PAYMENT GATEWAY               │
│  Mongoose Models │    │  Live Checkout Session Creation                     │
│  · Users         │    │  Dual Currency (KWD & USD) Dynamic Settlement       │
│  · Products      │    │  Automated Currency Fallback Routing                │
│  · Orders        │    │  Payment Verification & Order Reconciliation        │
└──────────────────┘    └─────────────────────────────────────────────────────┘
```

### Core Technologies
- **Framework:** Next.js 15.5.27 (App Router with SSR and Route Handlers)
- **Frontend UI:** React 19, TypeScript, Lucide Icons, Glassmorphic CSS Lighting Architecture
- **3D Graphics Engine:** Three.js with `LatheGeometry`, PBR `MeshPhysicalMaterial`, `RoomEnvironment` with PMREM studio reflections, and interactive inertia drag damping
- **Database & ODM:** MongoDB Atlas with Mongoose 8.x schema validation, indexes, and cascades
- **Authentication & Security:** HttpOnly, Secure, SameSite JWT session cookies; bcrypt password hashing; strict input sanitization
- **Payment Gateway:** Stripe API with dual-currency support (`kwd` / `usd`) and automated settlement routing
- **Testing Suite:** Automated 41-assertion end-to-end integration test runner (`tests/full-integration.ts`)

---

## 3. Key Feature Showcase

### 🪩 1. Interactive 3D WebGL Smart Ring (`HeroCanvas3D.tsx`)
- Modeled with precision CAD cross-section curves (`THREE.LatheGeometry`) reflecting contemporary luxury smart rings (Oura Horizon / Galaxy Ring).
- **Physical Materials:**
  - Outer shell: Sintered Zirconia Ceramic (`#F7F7F5`, roughness `0.16`, clearcoat `1.0`, IOR `1.54`).
  - Inner chassis: Brushed Grade 5 Aerospace Titanium (`#94A3B8`, metalness `0.95`, roughness `0.22`).
  - Equatorial Groove: Recessed hairline cobalt optical pulse slit (`#2563EB`).
- **Biometric PPG Sensor Cluster:** 3 medical-grade optical sensor nodes on the inner rim with dark optical resin lenses and pulsing green/cobalt micro-LEDs.
- **Controls:** Full 360° mouse and touch drag-to-rotate with velocity momentum damping, idle floating levitation bob, and a procedural soft contact shadow plane.

### 🔬 2. Real-Time Telemetry Demonstration Lab
- Interactive sensor visualizer located in the technology section demonstrating:
  1. **Optical PPG Waveform:** Simulated continuous cardiovascular pulse waveform, resting pulse cadence (68 BPM), HRV neural readiness (72 ms), and SpO2 (99.2%).
  2. **Spatial Acoustic Conduction:** Animated frequency response spectrum (20Hz–40kHz), sub-1.2ms latency, and beamforming isolation (-38 dB).
  3. **Inductive Flux Resonance:** 15W magnetic resonance charging waveform, GaN thermal dissipation (31.4°C), and 94.8% power efficiency.

### 🔍 3. Product Engineering Specifications Modal
- Clicking any product card or "View product specs ↗" opens a museum-grade industrial specification sheet.
- Displays high-resolution photography, material composition, sensor arrays, battery autonomy, environmental durability (10 ATM / IP68), and key engineering capabilities.
- Direct "Add to bag" action and full keyboard accessibility (`Escape` key listener).

### 💱 4. Dual-Currency Financial Engine (KWD & USD)
- Live client-side and server-side currency switching between **Kuwaiti Dinar (KWD)** and **US Dollars (USD)**.
- Formats currency with accurate decimals (3 decimals for KWD, 2 decimals for USD).
- Automated fallback logic for Stripe accounts without native KWD settlement, ensuring 100% successful checkout creation.

### 📱 5. Responsive Glassmorphic Navigation
- Sticky floating navbar with blur filter (`backdrop-filter: blur(22px)`).
- Desktop user profile pill displaying user avatar initial badge and flexible name formatting.
- Integrated mobile navigation drawer (`.mobile-nav-tray`) with smooth slide-down animation on screens $\le 820\text{px}$, providing one-tap access to Devices, Technology, Currency toggle, Orders, and Account actions.

---

## 4. API Endpoints Reference

| Method | Endpoint | Description | Auth Required |
|:-------|:---------|:------------|:-------------:|
| `GET` | `/api/products` | Synchronizes and returns the hardware product catalog | No |
| `GET` | `/api/auth/me` | Validates session cookie and returns active user profile | Yes (Cookie) |
| `POST` | `/api/auth/signup` | Registers new user, hashes password, sets HttpOnly JWT | No |
| `POST` | `/api/auth/login` | Authenticates user credentials, sets HttpOnly JWT | No |
| `POST` | `/api/auth/logout` | Clears authentication cookie | Yes (Cookie) |
| `GET` | `/api/orders` | Retrieves authenticated user's order history | Yes (Cookie) |
| `POST` | `/api/checkout` | Validates cart items, creates pending order, returns Stripe URL | Yes (Cookie) |

---

## 5. Automated Integration Test Suite

The repository contains an automated end-to-end integration test suite (`tests/full-integration.ts`) verifying all layers of the architecture against live cloud databases and payment APIs:

```bash
pnpm run test:integration
```

### Verification Matrix (41/41 Passing):
- **Phase 1: Database CRUD & Models (MongoDB Atlas)**
  - Connection establishment and connection pooling
  - User document creation, email lookups, and unique constraints
  - Bcrypt salted password hash validation
  - Product document creation, queries, and catalog sync
  - Order document creation, status updates, and Mongoose `.populate()` cross-collection reference resolution
  - Automated test record cleanup
- **Phase 2: Stripe Integration (Test Mode)**
  - Stripe API authentication and balance retrieval
  - Checkout session creation in both USD and KWD
  - Currency conversion, minor-unit calculations, and checkout URL validation
  - Dual-currency settlement fallback routing
  - Test session cleanup
- **Phase 3: Live Next.js Server & Security Isolation**
  - Live Next.js test server bootstrap
  - Unauthenticated guest request rejection (401 Unauthorized on `/api/orders` and `/api/checkout`)
  - User signup and login with secure HttpOnly cookies
  - User isolation verification: User A cannot inspect User B's orders
  - Order creation via checkout flow and post-checkout fulfillment
  - Cookie invalidation upon logout

---

## 6. Local Development & Installation Guide

### Prerequisites
- Node.js 20.x or higher
- pnpm (`npm install -g pnpm`)
- MongoDB Atlas cluster connection string
- Stripe Test Mode API keys

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/techwithmano/synapselabs.git
   cd synapselabs/artifacts/klyph-store
   ```

2. **Install dependencies:**
   ```bash
   pnpm install --ignore-scripts
   ```

3. **Configure Environment Variables (`.env`):**
   ```env
   MONGODB_URI="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/synapselabs?retryWrites=true&w=majority"
   STRIPE_SECRET_KEY="sk_test_..."
   JWT_SECRET="super-secret-jwt-key"
   NEXT_PUBLIC_BASE_URL="http://localhost:3000"
   ```

4. **Run the local development server:**
   ```bash
   pnpm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Typecheck & Production Build:**
   ```bash
   pnpm run typecheck
   pnpm run build
   ```

---

## 7. Submission Acknowledgments

Engineered and submitted for evaluation as a modern production-ready full-stack hardware showcase.

*Copyright © 2026 Synapse Labs. All rights reserved.*
