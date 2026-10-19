# Live-site reconciliation runbook — 19 October 2026

## Objective
Synchronize Edelweizz's **authoritative production source** with GitHub, protecting existing public site, parent enquiries, staff access, journal, analytics and SEO.

## Confirmed code state
- GitHub `main` commit `298a198374a12d78a3b37d809fdb1727032f532d` is the last known release baseline.
- The Growth OS private dashboard is staged separately as draft PR #4 on `feat/growth-os-truthful-funnel-20261019`; tests, lint and build passed.
- Earlier live audit found richer production enquiry / team / journal / sign-in functionality than GitHub `main`, but the deployment's source branch and backend endpoint have not been verified.
- This branch runs a read-only public page comparison with a downloadable report. It **does not** recover private Cloudflare deployment source or server-side credentials.

## Reconciliation gates
1. Obtain a Cloudflare Pages project/deployment record for `edelweizzindia.com`: exact account/project, latest production deployment ID, timestamp, deployed commit SHA, linked repository and branch (or direct-upload origin). Check for environment-specific build settings. **Do not copy secrets into an issue.**
2. Use the run's `edelweizz-live-reconciliation` artifact to compare published URLs, titles, asset hashes and public text flags with GitHub's built baseline. Where they differ, obtain the original deploy's complete source (Git/backup/deployment artifact), **not just the minified live bundle**.
3. Diff real current production source against `main`: enquiry form/server endpoint, durable storage, staff sign-in, team, journal, address, site metadata, robots/sitemap, structured data, analytics, media files and routing.
4. Recreate all working production features in a **separate preview branch** and match exact content, layout and backend behaviour. Validate using non-sensitive test records in a safe environment with authorisation.
5. Verify CI build/tests, end-to-end enquiry persistence and login, mobile visual QA, and working phone/WhatsApp links. No service-role key in client code. No clinical details in analytics.
6. Update GitHub source of truth only after review and approval; then align Cloudflare Pages branch to that approved Git commit. A freeze on manual/direct uploads prevents drift. Document rollback to the previously working deploy.
7. Merge Growth OS only **after** the website matches its recoverable live source and the private dashboard can be safely previewed; production deploy requires explicit owner approval.

## Known limitation
A public website inspection cannot prove that server-side lead storage exists or disclose the Cloudflare build source. Cloudflare project access or a trusted export is required to finish full synchronization. This runbook is not proof of completed sync.
