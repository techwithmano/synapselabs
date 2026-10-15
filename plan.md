# SYNAPSE LABS — Storefront Overhaul Execution Plan

## Mission
Transform "SYNAPSE LABS" inside `artifacts/klyph-store` into a production-grade, award-worthy neuro-wearable and spatial computing storefront featuring high-precision local hardware SVG assets, automatic MongoDB catalog synchronization, refined futuristic micro-interactions, seamless Stripe checkout integration, and 100% test passing.

---

## Master Checklist & Progress Tracker

### [x] Phase 1: High-Precision Local Hardware Assets (`public/images/synapse/`)
- [x] 1.1 Create directory `artifacts/klyph-store/public/images/synapse/`
- [x] 1.2 Create `public/images/synapse/hero-synapse.svg` (1280x1000, 1.28:1 aspect ratio)
  - 3D perspective matte white ceramic neuro-ring floating on radial studio gradient
  - Satin titanium inner chassis with optical PPG/EEG sensor nodes
  - Hairline cobalt blue telemetry slit pulsing across outer rim
- [x] 1.3 Create `public/images/synapse/synapse-core-ring.svg` (1000x820, 1.22:1 aspect ratio)
  - Isometric 35° floating perspective of the matte zirconia ceramic smart ring
  - Subtle soft ground shadow and glowing cobalt telemetry notch
- [x] 1.4 Create `public/images/synapse/aura-spatial-clip.svg` (1000x820, 1.22:1 aspect ratio)
  - Ergonomic C-cuff ear-wearable in porcelain white ceramic
  - Brushed titanium hinge, precision acoustic micro-grille, micro-LED pairing dot
- [x] 1.5 Create `public/images/synapse/neurodock-slate.svg` (1000x820, 1.22:1 aspect ratio)
  - Monolithic inductive charging pad with chamfered ceramic top plate
  - Slim aluminum base and illuminated circular cobalt blue halo ring
- [x] 1.6 Update `public/favicon.svg` (512x512)
  - Obsidian navy square (`#0F172A`, `rx="120"`) with centered electric cobalt (`#2563EB`) synaptic `S` monogram
- [x] **CHECKPOINT 1**: Verify all 5 SVG files exist, are syntactically valid XML/SVG, and match exact dimension/aspect-ratio specs.

---

### [x] Phase 2: Product Catalog & Database Synchronization (`app/api/products/route.ts`)
- [x] 2.1 Update `seedProducts` definition in `app/api/products/route.ts`:
  - Item 1: `name`: "Synapse Core Ring", `price`: 18, `category`: "Wearables", `image`: "/images/synapse/synapse-core-ring.svg", `description`: "Matte ceramic biometric pulse and neural telemetry band with titanium interior."
  - Item 2: `name`: "Aura Spatial Clip", `price`: 26, `category`: "Audio", `image`: "/images/synapse/aura-spatial-clip.svg", `description`: "Titanium bone-conduction spatial audio and voice interface with acoustic micro-grille."
  - Item 3: `name`: "NeuroDock Magnetic Slate", `price`: 14, `category`: "Power", `image`: "/images/synapse/neurodock-slate.svg", `description`: "High-speed inductive ceramic charging plate with illuminated cobalt status halo."
- [x] 2.2 Enhance `GET /api/products` synchronization logic:
  - Automatically update any existing items in MongoDB that have outdated Unsplash URLs or legacy names so they match the new local assets and copy.
  - Return all products with `Cache-Control: no-store`.
- [x] **CHECKPOINT 2**: Test `GET /api/products` against live MongoDB Atlas to confirm synchronization of all 3 products with local SVG paths.

---

### [x] Phase 3: UI Micro-Interactions & Styling (`synapse.css` & Components)
- [x] 3.1 Update `synapse.css`:
  - Style `.product-image-well` and `.hero-image-frame` with porcelain background (`#F8FAFC`), razor hairline borders (`1px solid #E2E8F0`), and smooth hover transition (`transform: scale(1.025)`).
  - Add glowing pulse animation for active status badges and telemetry indicators (`box-shadow: 0 0 12px rgba(37, 99, 235, 0.4)`).
  - Enforce antialiased typography smoothing, deep obsidian headings (`#0F172A`), and cobalt CTAs (`#2563EB`).
- [x] 3.2 Update `SynapseStorefront.tsx`:
  - Ensure hero showcase displays the new high-precision flagship asset (`/images/synapse/hero-synapse.svg`).
  - Ensure product cards render the updated local SVG images cleanly with responsive containers.
- [x] **CHECKPOINT 3**: Inspect CSS and frontend markup to ensure seamless, glitch-free layout without layout shift.

---

### [x] Phase 4: Stripe Checkout Integration
- [x] 4.1 Verify Stripe dependency and environment configuration.
- [x] 4.2 Verify `POST /api/checkout`:
  - Verifies session token from `token` cookie (returns 401 if not authenticated).
  - Validates cart items and calculates amounts in smallest currency units.
  - Creates Stripe Checkout session with `metadata: { userId, orderId }`.
  - Sets `success_url` to `${origin}/success?session_id={CHECKOUT_SESSION_ID}` and `cancel_url` to `${origin}/cart`.
  - Handles automatic settlement currency fallback (KWD -> USD).
- [x] 4.3 Verify `app/success/page.tsx`:
  - Verifies payment session from Stripe.
  - Marks order as `paid` in MongoDB.
  - Clears client cart via `CartClear`.
  - Renders links to `/orders` ("View in My Orders") and `/` ("Continue Shopping").
- [x] 4.4 Wire Cart Checkout button in `SynapseStorefront.tsx`:
  - If unauthenticated, redirect to `/login?next=%2Fcart`.
  - If authenticated, post cart to `/api/checkout` and redirect to `data.url`.
- [x] **CHECKPOINT 4**: Verify checkout route, success verification, and cart drawer interaction end-to-end.

---

### [x] Phase 5: Verification & Production Build
- [x] 5.1 Run TypeScript typechecks (`pnpm run typecheck`).
- [x] 5.2 Run full Next.js production build (`pnpm run build`).
- [x] 5.3 Run full 41-assertion integration test suite (`pnpm test:integration`).
- [x] **CHECKPOINT 5**: 0 errors, 0 hydration warnings, 100% test pass rate (41/41 passing).
