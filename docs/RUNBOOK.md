# OPERATIONAL RUNBOOK — Pillaiyarappa South Indian Corner

## 1. Quick Start & Local Run

```bash
# Install dependencies
npm install

# Run dev server on port 3000
npm run dev

# Build for production
npm run build

# Type check & lint
npm run lint
```

## 2. Supabase Online Cloud Provisioning (Optional)

1. Create a project on [Supabase Dashboard](https://supabase.com/dashboard) in the Mumbai (`ap-south-1`) region.
2. Open **SQL Editor** and run in order:
   - `supabase/migrations/0001_init.sql`
   - `supabase/migrations/0002_rls.sql`
   - `supabase/migrations/0003_storage.sql`
   - `supabase/seed.sql`
3. Copy `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to your `.env.local` or hosting provider.

## 3. Admin Access

- **URL:** `/admin`
- **Default Email:** `admin@pillaiyarappa.com`
- **Default Password:** `Pillaiyarappa@2026`
- **Capabilities:** Update prices, mark dishes "Sold Out Today", manage catering leads, export enquiries to CSV, and update branch addresses.
