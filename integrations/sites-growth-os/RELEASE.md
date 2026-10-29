# Release evidence — 29 October 2026

- Baseline: Sites version 9, source 18d3a02719345b398b3be20b691124eb12c05263.
- Published: Sites version 10, source 715ea06d2864728b5343cf8f1f2927c2b7c3af13.
- Deployment: appgdep_6ae3478a7ad88191aa0f4fca78fa575c, native status succeeded, 29 October 2026.
- Deployment URL returned by Sites: https://edelweizz-india-review.bibhash-saharia.chatgpt.site
- Existing custom domain retained: https://edelweizzindia.com
- Owner-only dashboard route: /optimizer, also linked from the staff console.
- Validation: 48 optimizer checks and all 59 existing console/backend checks passed (107 total); TypeScript and production build passed. The new tests cover owner access, cross-origin protection, deduplication, contact-data exclusion, equal complete periods, partial baselines, missing/preliminary data, weighted search metrics, scoped writer authentication/rotation, idempotent receipts, failure retention, revision conflicts and the real Apps Script under isolated provider/trigger mocks.
- Existing D1/R2 bindings and auth retained; no migrations, DNS or audience changes.

## Still unverified or awaiting setup

- Browser preview was unavailable: the managed preview reported an existing development server in another directory. It was not killed or replaced. Browser geometry and hosted owner sign-in were not verified in this run.
- Direct automated verification of the custom domain was rejected by Cloudflare with HTTP 403 / error 1010. No security setting was disabled, no fingerprint workaround was used, and the production writer was not claimed verified.
- Google Search Console authorization and a successful live Google reporting save have not occurred. No Google metrics have been fabricated. The free updater and manual CSV fallback are implemented; the owner setup is at /optimizer-setup.md and inside the dashboard.
- A daily Apps Script trigger must only be installed after Google access and a dashboard save receipt succeed. A trigger installation or code publication alone is not an operating optimizer.
- Metricool account access was available, but no continuous reporting feed to this dashboard is claimed.
- This folder is the current optimizer overlay. The repository root remains the older Vite codebase; full source reconciliation still needs an authorized private destination and a separate controlled review.

## Rollback

Redeploy the already saved Sites version 9. Preserve D1/R2 data and authentication. The namespaced optimizer records and newly added managed writer secret are inert under that older version; do not delete family records to roll back.
