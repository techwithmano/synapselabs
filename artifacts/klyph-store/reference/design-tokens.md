---
name: Obsidian Precision
colors:
  surface: '#0f131d'
  surface-dim: '#0f131d'
  surface-bright: '#353944'
  surface-container-lowest: '#0a0e18'
  surface-container-low: '#171b26'
  surface-container: '#1c1f2a'
  surface-container-high: '#262a35'
  surface-container-highest: '#313540'
  on-surface: '#dfe2f1'
  on-surface-variant: '#d1c6ab'
  inverse-surface: '#dfe2f1'
  inverse-on-surface: '#2c303b'
  outline: '#9a9078'
  outline-variant: '#4d4632'
  surface-tint: '#eec200'
  primary: '#ffecb9'
  on-primary: '#3c2f00'
  primary-container: '#facc15'
  on-primary-container: '#6c5700'
  inverse-primary: '#735c00'
  secondary: '#ffca45'
  on-secondary: '#3f2e00'
  secondary-container: '#e4ae00'
  on-secondary-container: '#5b4400'
  tertiary: '#e5eeff'
  on-tertiary: '#233144'
  tertiary-container: '#c3d2eb'
  on-tertiary-container: '#4c5a6f'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffe083'
  primary-fixed-dim: '#eec200'
  on-primary-fixed: '#231b00'
  on-primary-fixed-variant: '#574500'
  secondary-fixed: '#ffdf9a'
  secondary-fixed-dim: '#f7be1d'
  on-secondary-fixed: '#251a00'
  on-secondary-fixed-variant: '#5a4300'
  tertiary-fixed: '#d5e3fd'
  tertiary-fixed-dim: '#b9c7e0'
  on-tertiary-fixed: '#0d1c2f'
  on-tertiary-fixed-variant: '#3a485c'
  background: '#0f131d'
  on-background: '#dfe2f1'
  surface-variant: '#313540'
typography:
  display-xl:
    fontFamily: Space Grotesk
    fontSize: 56px
    fontWeight: '600'
    lineHeight: 64px
    letterSpacing: -0.03em
  display-xl-mobile:
    fontFamily: Space Grotesk
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Space Grotesk
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.08em
  label-sm:
    fontFamily: Space Grotesk
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.1em
  mono-crypto:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 3rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system embodies high-security cryptography expressed through refined physical hardware luxury. The aesthetic bridges high-end horology, military-grade aerospace engineering, and austere architectural minimalism. It rejects garish cyberpunk tropes in favor of an understated, monolithic presence: disciplined, unyielding, and tactile.

The design movement is an interplay of **Minimalism** and **Tactile Precision**. Surfaces evoke physical materials—beveled matte slate, vapor-deposited gold contact pins, and chamfered titanium edges. The UI conveys an unshakeable sense of cold cryptographic sovereignty, reassuring high-net-worth custodians that their assets exist in an impenetrable, sovereign vault.

## Colors

The palette operates in strict hierarchy to reinforce calm, focused vigilance:
- **Canvas / Root Background (`#0B0F19`)**: Deep midnight obsidian space that absorbs light and minimizes ocular strain during critical key operations.
- **Surface Elevation 1 (`#111827`)**: Monolithic slate tier for interactive units, security modules, and hardware telemetry displays.
- **Borders & Dividers (`#1F2937`)**: Precision structural hairpins calibrated to 1px thickness to emulate micro-machined chassis seams.
- **Accents (`#FACC15` / `#EAB308`)**: Cryptographic gold reserved exclusively for active biometric confirmations, primary state changes, and verified hardware states.
- **Muted Elements (`#334155`)**: Subdued structural accents and inactive states mimicking matte titanium bead-blasting.
- **Typographic Neutral Hierarchy**: Pure cold white (`#F8FAFC`) for primary telemetry, cryptographic hashes, and critical amounts; muted titanium (`#94A3B8`) for contextual metadata and secondary attributes.

## Typography

The typographic system creates an interplay between analytical engineering and clear readability. **Space Grotesk** governs all headings, numeric telemetry, badges, and cryptographic key strings; its subtle geometric quirks evoke physical laser engraving and security tooling. **Inter** handles all body content and verification instructions, providing distortion-free legibility in high-stakes operational flows.

All micro-labels and technical status indicators are styled in uppercase with intentional tracking (`0.08em` to `0.1em`) to replicate industrial device markings. Cryptographic public addresses and multi-sig hashes utilize `mono-crypto` with deliberate character spacing to prevent misreading during address poisoning checks.

## Layout & Spacing

The layout philosophy follows a **Disciplined Fluid Grid** rooted in an 8pt architectural rhythm, with a strict 4pt sub-grid for high-density hardware metrics:
- **Desktop (1024px+)**: 12-column grid, 48px outer margins, 24px gutters. Content caps at 1280px max-width to maintain clean lateral borders and frame the central security console.
- **Tablet (768px - 1023px)**: 8-column grid, 32px outer margins, 20px gutters. Secondary diagnostic panels collapse into segmented sliding drawers.
- **Mobile (Below 768px)**: 4-column grid, 20px outer margins, 16px gutters. Cryptographic verification flows expand edge-to-edge with locked bottom utility bars for physical thumbprint alignment.

Inner component spacing strictly leverages the `space-*` scale to prevent arbitrary positioning, prioritizing generous vertical negative space to make security confirmations feel methodical rather than rushed.

## Elevation & Depth

Visual hierarchy is maintained through **Tonal Layers paired with Micro-Machined Outlines and Radial Accent Bleeds**:
- **Layer 0 (Canvas)**: Solid `#0B0F19` void.
- **Layer 1 (Modular Shells & Cards)**: Surface `#111827` defined by a crisp 1px stroke of `#1F2937`. No heavy drop shadows are used; depth is established through absolute edge definition.
- **Layer 2 (Overlays & Modals)**: `#111827` backed by an ultra-deep semi-transparent backdrop blur (`backdrop-filter: blur(16px)` over `rgba(11, 15, 25, 0.85)`), edged with a dual-tone border: 1px `#334155` on top, fading to `#1F2937` on the base to simulate overhead raking light.
- **Cryptographic Active Elevation**: When an element enters a signing or biometric verification state, it emits an ambient gold aura (`0px 0px 32px -8px rgba(234, 179, 8, 0.18)`), visually signaling hardware power and active bus telemetry.

## Shapes

The design uses **Soft Precision Geometry** (`roundedness: 1`), reflecting the chamfered corners of CNC-machined aerospace alloy.
- **Panels & Cards**: 4px border radius (`rounded-sm`). Tight, surgical geometry that emphasizes solid planar mass.
- **Containers & Device Shells**: 8px border radius (`rounded-lg`). Provides balanced contouring without softening the industrial profile.
- **Badges & Biometric Indicators**: Full capsules (`rounded-full`), reserved specifically for telemetry chips, state badges, and capacitive fingerprint capture surfaces to establish tactile contrast against the rectangular structural grid.

## Components

### Action Buttons
- **Primary / Authorization**: Background in solid cryptographic gold (`#FACC15`), text in deep obsidian (`#0B0F19`) at `Space Grotesk 600`. On hover/focus, transitions to `#EAB308` with a restrained gold glow (`box-shadow: 0 0 20px rgba(250, 204, 21, 0.25)`). Active state applies an inner inset compression shadow.
- **Secondary / Hardware Standby**: Transparent background, 1px perimeter border in `#334155`, text in `#F8FAFC`. On hover, border shifts to `#94A3B8` with an interior slate tint (`rgba(51, 65, 85, 0.15)`).

### Status Badges & Chips
- Scaled down (`label-sm`), uppercase, encased in pill geometry (`rounded-full`).
- Inactive/Standby: Background `rgba(51, 65, 85, 0.2)`, border `1px solid #1F2937`, text `#94A3B8`.
- Secure/Connected: Background `rgba(234, 179, 8, 0.1)`, border `1px solid rgba(234, 179, 8, 0.4)`, text `#FACC15`, accompanied by a pulsating 4px gold status dot.

### Cryptographic Surface Cards
- Container fills `#111827` enclosed by a razor-thin 1px line of `#1F2937`.
- Header metadata separates from payloads via a horizontal 1px rule in `#1F2937`. 
- Interactive cards expose a subtle `#334155` border transition on hover alongside an ultra-fine linear gradient edge highlight.

### Input Fields & Seed Phrasings
- Recessed background tint (`#0B0F19`), inset 1px border (`#1F2937`).
- Active focus state sharpens the border to `#EAB308` with zero outer fuzzy rings, preserving an angular, surgical finish.
- Placeholder text calibrated to `#334155`; active values render in `#F8FAFC` utilizing `mono-crypto`.

### Biometric Scan Confirmation Triggers
- Specialized hardware authentication modules: capacitive sensory bounds rendered with concentric, hairline rings (`#1F2937`).
- Upon touch registration or WebAuthn engagement, rings transition sequentially from `#334155` to glowing `#FACC15` alongside a gold pulse radiating outward from the contact node.

### Multi-Sig Transaction Review Rows
- Compact row components divided by hairline `#1F2937` borders. 
- Left-aligned parameter labels set in titanium `label-sm` (`#94A3B8`), paired with right-aligned cryptographic parameters in cold white `#F8FAFC` `Space Grotesk`.