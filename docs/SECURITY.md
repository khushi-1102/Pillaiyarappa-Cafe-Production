# SECURITY GUIDE — Pillaiyarappa South Indian Corner

## Security Controls Implemented

1. **Anti-Spam & Bot Mitigation:**
   - Honeypot fields on public contact and catering forms.
   - Client and server-level 10-digit Indian mobile validation (`^[6-9]\d{9}$`).
   - Duplicate submission debounce.

2. **Data Privacy (Indian DPDP Act 2023):**
   - No tracking cookies or advertising pixels.
   - Visitor telephone numbers are collected strictly for delivery coordination and catering quotes.
   - Dedicated `/privacy` and `/terms` disclosures.

3. **Admin Authentication & RBAC:**
   - Role-based separation (`owner`, `admin`, `editor`).
   - Generic authentication errors to prevent user enumeration.
   - Local and cloud audit logging for administrative mutations.
