# AH-Accounts Portal screenshots

Drop product screenshots here. `dashboard.jpg` is referenced by `image` /
`mockup` in `lib/data.ts` (`projects` → `ah-accounts`) and rendered by the
case-study hero (`components/case/CaseHero.tsx`). This project's case study
in `lib/case-studies.ts` (`AH_ACCOUNTS`) uses the features-list System Build
format (no screenshots required there), matching how `ah-website` is done —
add a `screens` array with `image` paths later if you want the sticky-scroll
screenshot walkthrough instead.

Suggested files to add:

- `dashboard.jpg` — Dashboard (summary cards + recent transactions)
- `trip-payments.png` — Trip-Payments bills list, with filters and payment history
- `bill-form.png` — New Bill form with the live invoice preview
- `general-ledger.png` — General Ledger, Revenue/Expense tabs
- `tax-receipt.png` — A sample GST Tax Receipt PDF (mask any real customer data)

Until `dashboard.jpg` exists, the hero will show a broken image in place of
the background/mockup — everything else on the page renders normally.

Note: the live app's Supabase client falls back to a hardcoded production
URL and anon key when no `.env` is set (`src/lib/supabase.ts` in
`adventure-ledger-main`), so running it locally to capture screenshots talks
to real production data. Mask or use seed/test data before capturing — don't
screenshot real customer names, phone numbers or payment amounts.
