# ARCHITECTURE — Pillaiyarappa South Indian Corner Website

## 1. System Overview

```
Visitor (Mobile 4G / Desktop) ──► Edge CDN / PWA Service Worker (Cache-First)
                                       │
Owner / Admin (+Credentials)  ──► React SPA & Admin CMS
                                       │
        ┌──────────────────────────────┼──────────────────────────────┐
        ▼                              ▼                              ▼
Local Offline Persistence       Supabase Cloud (Optional)      External Delivery & Maps
├─ LocalStorage Store           ├─ PostgreSQL DB (RLS)         ├─ Zomato Verified Link
├─ Service Worker Cache         ├─ Supabase Auth               ├─ Swiggy Verified Link
└─ Offline Sync Queue           └─ Storage Buckets             └─ Google Maps Search API
```

## 2. Core Principles

1. **Brand Fidelity:** Strictly retains the deity emblem, yellow wave banner, uppercase green wordmark, cutlery icons, and pure-vegetarian indicator.
2. **Offline-First:** All menu browsing, branch discovery, and catering enquiry submissions work seamlessly offline. Submissions are queued and auto-synced upon reconnection.
3. **Accessibility:** WCAG 2.1 AA compliant, screen reader landmarks, `#FFE600` focus rings, and full keyboard navigation.
4. **Single Source of Truth:** Business details (phones, branch addresses, delivery offer) are centralized in `src/data/initialData.ts` and managed in `/admin`.
