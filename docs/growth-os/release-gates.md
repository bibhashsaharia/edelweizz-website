# Edelweizz Growth OS — release gates and evidence (19 October 2026)

## Status
Private dashboard code exists **only on a non-production feature branch**. It is **not a deployed funnel**, and an empty analytics table must never be reported as zero search traffic.

Goal stored in Supabase: **30 active children by 12 February 2027**. The number is a target, not the current verified count.

### Implemented in review branch
- Private Growth OS with Google sign-in, Supabase row-level security and read-only data access.
- Overview, leads, analytics, integrations, opportunities, activity, and child-first principles.
- Real growth tables are queried; no sample agent runs, scores, impressions, leads or conversions are fabricated.
- Proposed **PII-free** lead-attribution ledger is in `docs/growth-os/lead-ledger.sql` but deliberately has **not** been applied.
- Tests for unavailable sources, empty dataset, recorded conversion and metric freshness.
- The companion PR runs tests, lint and a production-style build **without deploying**.

### Unverified / release blockers
1. **Production source-of-truth:** Obtain the exact current live deployed site source and relevant backend configuration. GitHub `main` is behind the public site. Never merge the review branch into `main` or trigger a redeploy until its form, staff sign-in, journal, team content, contact information and SEO are preserved.
2. **Actual enquiry persistence:** Identify the real form server endpoint and storage table; verify an approved labelled test enquiry writes once, appears in an authorised staff inbox, is rejected or reported clearly on failure, and follows the centre's notice and consent rules.
3. **Lead reconciliation:** Map safe `external_ref` values to confirmed persisted enquiries, or record staff-confirmed inbound calls/WhatsApp enquiries; do **not** import child names, diagnoses, therapy notes, phone numbers or email into Growth OS or Google Analytics. Define a safe dedupe and funnel-stage update process.
4. **Google access and data:** Grant authorised GSC property and GA4 access, check production tags and event receipts. Import metrics with actual source, observation date, unit and property. Google Business Profile linked in Metricool **does not** mean an active Growth OS GBP connector.
5. **Private preview auth:** Configure only the public Supabase URL/publishable key in the review build; whitelist the preview callback URL for Google Auth; verify allowed/denied user views, expired token refresh and sign-out.
6. **Permission/retention review:** Present lead schema and owner-only RLS proposal for review before database changes. Do not grant anonymous inserts; validate and rate-limit any separate public intake service.
7. **Approval:** Owner approval is required for production merge, any live form changes, DNS change, clinical content, photos, reviews and Google Business Profile publication.

## Acceptance checks
- A parent enquiry is counted only after a successful durable save or staff-confirmed conversation.
- Each stored lead is one uniquely attributable record; stage changes can be traced without leaking child data into analytics.
- A missing/unavailable source reads **Not connected / No verified data**, not `0`.
- GSC and GA4 data must be timestamped and source-labelled, including clear measurement windows.
- Protected dashboard is accessible only to authorised users; anonymous/unauthorised users cannot read metrics or enquiries.
- `npm ci && npm test && npm run lint && npm run build` succeeds on the review PR before deployment is even considered.
- No production deploy occurs from this branch, and no autonomous public publishing occurs.

## Community and clinical voice
Edelweizz is a parent-led centre supporting neurodiverse children, autonomy, dignity, relationships, participation and quality of life. Marketing should help families find appropriate support without fear, cure claims, invented outcomes or exposure of private child information.
