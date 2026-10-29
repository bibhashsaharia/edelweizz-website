# Growth optimizer — 29 October 2026

The current Sites Worker remains the application source of truth. This release
extends version 9 (source 18d3a02719345b398b3be20b691124eb12c05263).
It does not deploy the older Vite implementation from GitHub main.

## Implemented

- Owner-only /optimizer dashboard and API. Front desk, editors and anonymous
  visitors cannot read it. No analytics runs on the private dashboard.
- Complete 7-day and 28-day enquiry comparisons in India time; deduplicated new
  people, reviewed conversations and separate consented visitor/call/WhatsApp
  signals. Limited baseline history suppresses misleading growth percentages.
- Google date-only property totals, weighted position, CTR and query/page
  opportunities. Missing data, preliminary data, stale receipts and source
  errors are explicit. Query rows are bounded and never summed as site totals.
- Revision-protected action log with evidence, status history, full source
  commit, deployment reference and a 14-day observation date.
- Free private Google Apps Script updater, read-only Google scope, final-data
  requests, bounded query reports, idempotent save receipts, failure retention
  and a daily trigger installer that requires a successful save first.
- An English Dates CSV fallback. It is labelled manual and does not claim
  automatic query reporting.
- A scoped authenticated writer for reporting only. It cannot read the owner
  dashboard or family records, change staff access, or edit the public site.
- A bounded Metricool observation import for the exact existing Edelweizz
  brand. It does not infer data for missing dates or assume a daily feed.
- Accurate hyperlocal homepage metadata, service metadata and Service
  structured data using existing public service/location facts.

## Data and authorization

Existing enquiries, auth, D1 DB and R2 BUCKET remain in place. There are no
schema migrations. Optimizer state uses namespaced optimizer: keys in the
existing private site_settings table. Only aggregate enquiry results leave
the reporting SQL; dedupe contacts and family payloads are not returned.

The private dashboard checks the existing verified owner identity on every
request. Writes from the owner console also validate Origin. The external
reporting writer requires a 256-bit scoped key, bounded JSON and rate limits.
Its endpoint is /api/optimizer/ingest.

OPTIMIZER_SYNC_KEY is a managed production secret for initial unattended
verification/import. Its value must never be saved in source or a log. When
the owner creates a private updater key in the dashboard, a hash is stored in
D1 and immediately supersedes that deployment key. Owner-created keys expire
after 180 days. They are shown once for private Script Properties.

No keys are sent to Google. The Apps Script obtains Google's short-lived
read-only token inside Google and sends only bounded reports to Edelweizz.
No family enquiry answers enter Google Analytics or Search Console imports.

## Source truth and release checks

Run the existing console tests and tests/optimizer.test.mjs from the canonical
Sites checkout, then TypeScript and the supported Sites build helper.
Use the supported source workflow to commit/push/package the exact release,
save that version and deploy it. The source hosting manifest retains the
same project, DB and BUCKET; no audience or DNS changes are part of this work.

The public GitHub repository contains an optimizer integration overlay and
release provenance. The entire private Sites application must not be copied
into that public repository. GitHub main remains the older Vite project until
a separately reviewed reconciliation to an authorized private destination.

## Google activation remains a real release dependency

The GSC Wizard subscription is not used. Google Search Console access and
Apps Script authorization must actually succeed before declaring a live
Google feed. See /optimizer-setup.md for the owner's one-time setup.

A successful build, private-writer verification, stored property identifier,
Metricool connection badge or installed trigger is not proof that Google
metrics have been ingested. Keep built, tested, published, connected and
operating status separate in release notes.

## Rollback

Deploy the previously saved Sites version 9 through the supported Sites
deployment tools. This restores its Worker and public content without
dropping D1/R2 records. Namespaced optimizer state can remain inert; do not
delete records or change staff authentication to roll back. The new runtime
writer secret is unused by version 9 and can be removed separately if needed.

## Measurement limits

Search Console shows queries where this property appeared. It cannot measure
every search in a radius or an exact Maps rank grid. Google reporting dates
are Pacific dates, first-party comparisons are India dates, and the actual
windows are displayed. Google's newest final data may lag today.

Use actual enquiry outcomes, not reach or click counts, as the principal
marketing result. Review the existing page and collect a meaningful baseline;
do not manufacture daily content edits or locality doorway pages. Clinical
content, credentials, offers and availability retain owner review. No ranking,
lead-volume or universal AI-answer inclusion is guaranteed.
