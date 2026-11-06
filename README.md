# PILLAIYARAPPA — South Indian Corner

Production website and administration management system for **Pillaiyarappa — South Indian Corner** in Gurugram, built to replicate the original poster branding and mobile/desktop reference mockups.

---

## 🌟 Brand Identity & Source of Truth

- **Brand Name:** `Pillaiyarappa — South Indian Corner`
- **Identity Lockup:**
  - Sacred Temple Deity / Ganesha emblem on top-left
  - Wavy bright yellow banner with bold green uppercase `PILLAIYARAPPA`
  - Crisscrossed white spoon & fork above banner on the right
  - Supporting white text `South Indian Corner` with green dot vegetarian square indicator
- **Contact Numbers:** `9899101195` and `9953919033` ("M. 9899101195 / 9953919033")
- **Delivery Offer:** `Free Home Delivery Minimum Order = ₹500/-`
- **Catering Line:** `Contact for Parties & Catering Orders`
- **Locations in Gurugram:**
  - **Branch 1:** Shop No. 3, Opp. Mayom Hospital, South City-1, Gurugram
  - **Branch 2:** Shop No. 48, Sec-40, Huda Market, Gurugram
- **Core Menu Categories:** `Dosas`, `Idlis`, `Vadas`, `Uttapams`, `South Indian Favourites`

---

## 🚀 Key Features

1. **Responsive Desktop & Mobile Layouts:**
   - Matches the visual reference mockup across 320px to 1920px viewports.
   - Mobile includes top image hero, full-width yellow pill buttons, compact 3-column menu grid, branch accordion, and a persistent 4-action sticky bottom bar (Call, WhatsApp, Zomato, Swiggy).
   - Desktop includes full navigation, phone lockup, Order Online dropdown, side-by-side branch cards with storefront photos, and 4 quick conversion tiles.

2. **Accessibility (WCAG 2.1 AA Compliant):**
   - Skip to main content link (`#main-content`)
   - Visible high-contrast focus rings (`#FFE600` outline)
   - Full keyboard navigation across dialogs, mobile drawer (Escape to close), and image lightboxes (Escape, ArrowLeft, ArrowRight)
   - Screen-reader friendly semantic landmarks (`<header>`, `<main>`, `<nav>`, `<footer>`, `<aside>`) and ARIA live regions
   - Respects `prefers-reduced-motion`

3. **High Performance & Battery Efficiency:**
   - Deep OLED black theme (`#0A0A0A`) minimizing screen power consumption on mobile AMOLED displays
   - Zero bulky external dependencies; crisp vector SVGs
   - Fast client routing and lightweight React 19 architecture

4. **Progressive Web App (PWA) & Offline Mode:**
   - `manifest.webmanifest` and Service Worker (`/sw.js`) with cache-first and stale-while-revalidate strategies
   - In-app install button (`PWAInstallButton`) with guided instructions for iOS Safari and Android
   - Live network status detection with offline indicator badge
   - Offline form queuing: catering and callback enquiries submitted offline are stored in local storage and automatically synced upon reconnection

5. **Full Admin Management Portal (`/admin`):**
   - **Credentials:** `admin@pillaiyarappa.com` / `Pillaiyarappa@2026`
   - **Dashboard:** Enquiries metrics, menu stats, quick actions
   - **Menu Management:** Edit prices, names, descriptions, and 1-click toggle availability ("Sold Out Today")
   - **Enquiries Inbox:** Filter by status (`new`, `contacted`, `confirmed`, `completed`, `cancelled`), coordinator notes, one-click Call and WhatsApp buttons, and CSV export
   - **Settings:** Update contact phones, WhatsApp number, Zomato & Swiggy URLs, delivery minimum, and announcement banners
   - **Audit Trail:** Immutable record of administrative operations

---

## 🛠️ Verification & Build Commands

- Development: `npm run dev`
- Production Build: `npm run build`
- Typecheck & Lint: `npm run lint`
