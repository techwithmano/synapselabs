# SYNAPSE LABS — Brand Identity & Design System Specification
> **Style Direction**: *Engineered Calm*  
> **Slogan**: *"Intelligence, in form."*  
> **Route**: [`/brand`](https://synapselabs-nu.vercel.app/brand)

---

## 1. Store Concept

### What We Sell
Synapse Labs designs and manufactures tactile, museum-grade neuro-wearables and ambient sensory instruments:
- **Synapse Core Ring (SC-01)**: Sintered zirconia ceramic smart ring featuring multi-spectral PPG telemetry (530nm/660nm), sub-epidermal thermal sensors, 10 ATM water resistance, and continuous 7-day battery life.
- **Aura Spatial Clip (AC-02)**: Ergonomic auricle bone-conduction audio clip in brushed aerospace titanium, delivering spatial acoustic fields without occluding the ear canal.
- **NeuroDock Magnetic Slate (ND-03)**: Monolithic chamfered ceramic and obsidian aluminum inductive charging dock with 15W resonant GaN power transfer and 360° recessed cobalt breathing halo.

### Who It's For
High-performance knowledge workers, creative technologists, researchers, and discerning individuals who demand continuous, deep biometric insights and spatial audio clarity without the anxiety, visual clutter, or interruption of wrist-mounted touchscreens.

### Why Us ("The Synapse Difference")
- **Screen-Free Serenity**: Unobtrusive sensory integration with zero notification spam.
- **Museum-Grade Tactility**: Monolithic sintered ceramics and grade-5 titanium calibrated for physical weight and timeless durability.
- **On-Device Cryptography**: Absolute biometric sovereignty. Zero cloud telemetry retention or third-party behavioral profiling.
- **Engineered Calm**: Quiet, unyielding physical elegance designed for a lifetime of everyday wear.

---

## 2. Brand Identity & Attributes

### 3 Core Personality Words
1. **Quiet**  
   *Tone & Behavior*: Restrained, serene, distraction-free. Copy is concise, informative, and devoid of hyperbolic marketing jargon or urgent sales triggers.
2. **Precise**  
   *Tone & Behavior*: Surgical, geometric, calibrated. Every tolerance, sensor wavelength, and metallic chamfer is documented with sub-millimeter clarity.
3. **Confident**  
   *Tone & Behavior*: Monolithic, unhurried, enduring. The hardware speaks through tangible substance, high-key porcelain canvas lighting, and honest craftsmanship.

### Slogan
> **"Intelligence, in form."**  
*Sub-slogan / Headline lockup*: *"Continuous biometric clarity."*

---

## 3. Visual Identity & Logo System

### Mark Concept
The Synapse mark represents a **concentric neural ring with an optical telemetry node**. A 45-degree diagonal hairline opening exposes an electric cobalt telemetry emitter, evoking the optical sensor pulse embedded in our zirconia ceramic hardware.

```
       .---.           Concentric Sintered Ring (Titanium/Obsidian)
     /   |   \
    |   (o)   |        Central Optical Telemetry Node (#2563EB)
     \   '---'===>     45° Telemetry Slit (Light Emitter)
       '---'
```

### Usage Guidelines
- **Scalability**: Calibrated for rendering from 16px favicons to 120px architectural signatures without loss of geometric legibility.
- **Light Surfaces (`#F6F5F0`, `#FFFFFF`)**: Obsidian Slate `#0F172A` ring with `#2563EB` telemetry accent.
- **Dark Surfaces (`#0F172A`, `#1E293B`)**: Pure White `#FFFFFF` ring with `#60A5FA` / `#2563EB` telemetry accent.
- **Accessibility**: Rendered as semantic `<svg role="img" aria-labelledby="synapse-logo-title">` containing an accessible `<title id="synapse-logo-title">SYNAPSE LABS Logo</title>`.

---

## 4. Color Architecture & WCAG 2.1 AA Compliance

Our palette adheres strictly to the "Engineered Calm" aesthetic—a warm high-key porcelain base accented by surgical cobalt and grounded in deep obsidian slate.

| Token | CSS Variable | Hex | Role & Application | Contrast Ratio (vs Canvas) | WCAG Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Porcelain** | `--synapse-porcelain` | `#F6F5F0` | Primary ambient canvas background | Base (0:1) | Canvas Base |
| **Pure White** | `--synapse-white` | `#FFFFFF` | Elevated card surfaces, modal dialogs, and drawer stages | 1.07:1 | Component Canvas |
| **Obsidian Slate** | `--synapse-obsidian` | `#0F172A` | Primary typography, headers, monolithic CTA buttons | **15.6:1** | **AAA Pass** (>= 7.0:1) |
| **Electric Cobalt** | `--synapse-cobalt` | `#2563EB` | Optical telemetry pulse, active indicators, focus rings | **5.1:1** | **AA Pass** (>= 4.5:1) |
| **Cobalt Light** | `--synapse-cobalt-light` | `#60A5FA` | Hover states, dark mode accents, telemetry halos | 4.6:1 (on dark) | **AA Pass** (>= 4.5:1) |
| **Satin Titanium** | `--synapse-steel` | `#475569` | Secondary metadata labels, specs, category indicators | **7.0:1** | **AAA Pass** (>= 4.5:1) |
| **Hairline Line** | `--synapse-line` | `rgba(15, 23, 42, 0.14)` | Card borders, table dividers, input boundaries | **3.2:1** | **Pass** (>= 3.0:1 non-text) |

---

## 5. Typography System & Modular Scale

### Font Pairing
- **Display Typeface**: `Inter Display`, `system-ui`, `-apple-system`, `sans-serif`  
  *Characteristics*: Tight letter-spacing (`-0.03em`), geometric authority, bold anchors (`font-weight: 700 / 800`).
- **Body & Instrumentation Typeface**: `Inter`, `-apple-system`, `system-ui`, `sans-serif`  
  *Characteristics*: Calibrated readability, neutral geometry, optical metrics (`font-weight: 400 / 500`, `line-height: 1.6`).

### Defined Modular Scale (1.250 Major Third)

| Level | Size (px) | Size (rem) | Weight | Line Height | Tracking | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Micro** | 11px | 0.6875rem | 700 | 1.2 | `+0.08em` | Eyebrow badges, sensor frequency telemetry, uppercase labels |
| **Caption** | 13px | 0.8125rem | 500 / 600 | 1.4 | `+0.01em` | Metadata timestamps, variant options, cart helper text |
| **Body Small** | 14px | 0.875rem | 400 / 500 | 1.5 | `0em` | Product card descriptions, spec values, navigation items |
| **Body Base** | 15px | 0.9375rem | 400 / 500 | 1.6 | `-0.01em` | Core editorial copy, feature explanations, modal details |
| **Subhead** | 18px | 1.125rem | 600 | 1.4 | `-0.015em` | Card titles, section subheaders, drawer header |
| **Heading 3** | 22px | 1.375rem | 700 | 1.3 | `-0.02em` | Product card titles, technology pillar headings |
| **Heading 2** | 32px | 2.000rem | 700 / 800 | 1.2 | `-0.025em` | Section headings ("The Hardware Portfolio", "The Synapse Lab") |
| **Display 1** | 48px–60px | 3.0rem–3.75rem | 800 | 1.05 | `-0.035em` | Hero flagship headline ("Intelligence, in form.") |

---

## 6. The 5-Step Customer Journey

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   1. ENTER   │ ──> │  2. EXPLORE  │ ──> │  3. CHOOSE   │ ──> │ 4. INTERACT  │ ──> │5. GET FEEDBACK│
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
  High-Key Canvas      Live Nav Search      Inline Variants      Add-to-Bag Button     Slide-Over Cart
  3D WebGL Canvas      Category Filters     Quick Specs Modal    Wishlist Heart        Toast Status
  Hero CTA ↗           320px–1440px Grid    Saved Items          Lab Telemetry Demo    1-Click Checkout
```

1. **Enter**: The customer arrives at the high-key porcelain canvas (`#F6F5F0`). An interactive 3D WebGL ceramic ring floats in space with real-time cursor/touch lighting. The primary hero CTA *"Explore the collection ↗"* clearly directs attention down to the hardware catalog.
2. **Explore**: The customer navigates through live instantaneous search in the sticky header, or filters the catalog using tactile category pills (*All*, *Wearables*, *Spatial Audio*, *Power Systems*) with reactive device count readouts.
3. **Choose**: The customer inspects sub-millimeter hardware specs via the modal viewer, toggles sizing or finish variants inline on the card, or saves preferred instruments to their client-persisted Wishlist.
4. **Interact**: The customer selects their chosen variant and triggers *"Add to Bag"*. The interactive button executes an asynchronous 4-state sequence (`idle` $\rightarrow$ `adding` $\rightarrow$ `added` $\rightarrow$ `idle`) with a tactile checkmark.
5. **Get Feedback**: The slide-over cart drawer glides in automatically. A discreet status toast announces the confirmation to screen readers. Keyboard focus automatically shifts to the primary *"Secure Checkout"* CTA, displaying exact totals in KWD or USD.

---

## 7. Interaction Design Inventory (5 Impactful Interactions)

1. **Product Card Hover Lift & Tactile Elevation**:  
   Cards smoothly elevate with physical surface depth using `--synapse-shadow-multi` and `-4px` vertical translation. Quick specs inspection is keyboard accessible (`Enter` or `Space`). On touch devices, controls remain persistently visible.
2. **Add-to-Bag 4-State Machine with Focused Drawer Transition**:  
   Asynchronous button transitions from idle to spinner (`Adding...`) to confirmation (`Added to Bag ✓`). Immediately slides open the cart drawer, updates cart badge count, triggers an accessible live region toast, and shifts keyboard focus to the checkout action.
3. **Live Search with Instant Combobox Filtering**:  
   Accessible search combobox in the sticky navigation with `role="search"`. Filters devices instantly by name, category, or description with thumbnail previews, keyboard arrow navigation (`ArrowUp`/`ArrowDown`), `Escape` dismiss, and polite empty states.
4. **Client-Persisted Favorites / Wishlist**:  
   Heart toggle button with animated pulse and `aria-pressed` state on cards and modal. A dedicated Wishlist drawer in the header displays saved items with direct one-click quick add to cart, persisted across sessions in `localStorage`.
5. **Category Filter Chips & Sort Controls**:  
   Pill filters for *All*, *Wearables*, *Spatial Audio*, and *Power Systems* combined with price and alphabetical sorting. Displays live "Showing X of Y devices" count with a one-click "Reset filters" button.

---

## 8. Summary Checklist & Deliverable Index

- **Brand Sheet Route**: [`/brand`](https://synapselabs-nu.vercel.app/brand)
- **Brand Documentation**: `artifacts/klyph-store/BRAND.md` & `BRAND.md`
- **AI Ad Package**: `docs/ad/AD_PACKAGE.md`
- **Color Variables**: `artifacts/klyph-store/src/synapse.css`
- **Logo Component**: `artifacts/klyph-store/src/components/SynapseLogo.tsx`
- **Storefront Component**: `artifacts/klyph-store/src/SynapseStorefront.tsx`
