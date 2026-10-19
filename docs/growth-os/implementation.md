# Growth OS — implementation notes and release gates
**Working branch:** `feat/growth-os-truthful-funnel-20261019`
**Scope:** non-production private dashboard, no deployment or Supabase schema change.

## Added
- `src/growth/GrowthOS.jsx`: secure read-only dashboard. Removes hard-coded agent statuses, invented SEO scores and fake opportunity data.
- `src/growth/data.js`: read-only REST adapter using public Supabase URL/key and a short-lived user sign-in session; row-level security remains authoritative.
- `src/growth/metrics.js`: conservative measurement summaries, explicit missing-data state.
- `src/growth/metrics.test.js`: tests to run using `npm test`.
- `docs/growth-os/lead-ledger.sql`: proposed protected schema, **not applied**.
- `docs/growth-os/brand-story.md`: founder-centred site/GBP/Instagram copy **not published**.

## Preview setup
1. Check that the current production deployment is reconciled to the true source repository before any merge.
2. In a non-production preview, set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` (or existing public anon key) from the linked Supabase project. **Never configure a service role/secret key.**
3. In Supabase Auth, configure allowed preview redirect URL ending in `/growth-os.html`; verify Google OAuth is enabled. If a preview URL is not allowlisted, OAuth sign-in will not return correctly.
4. Only the existing Growth OS owner can see rows under the current owner-only RLS policies. Signed-out or unauthorised viewers must not see data.
5. Run `npm ci && npm test && npm run lint && npm run build`. Check preview on mobile and desktop.
6. Never deploy `main` or this branch to the live domain until the newer live enquiry form, journal, staff sign-in and production assets are reconciled.

## Verification gates that remain OPEN
- [ ] Live form endpoint and persistent store identified; confirm actual 'enquiry saved' behavior in approved test environment.
- [ ] Proposed `growth_leads` migration reviewed; RLS tested and applied through approved Supabase change workflow, without creating duplicate child or medical records.
- [ ] Lead ingestion validated end-to-end and deduplicated by stable external ID; exclude CTA clicks and drafted WhatsApp.
- [ ] Workspace preview configured with OAuth and owner-only access; frontend actually loaded with no secrets.
- [ ] Google Search Console domain property readable through authorised connection.
- [ ] GA4 validated on actual production pages with no PII; successful-save conversion event only.
- [ ] GBP reporting ingestion explicitly connected to Growth OS (Metricool account connection is separate).
- [ ] Real metrics and integration states visible, with source and observation dates.
- [ ] Brand story approved and any child-related disclosure reviewed.
- [ ] PR accepted, separately approve production publication.

**Important:** Zero rows means zero rows *in this Growth OS database*, not necessarily zero website visits, enquiries, assessments or children enrolled.
