# Edelweizz: free Google reporting

This connects Google Search Console directly to the private owner dashboard.
No GSC Wizard subscription is needed. Google's API is free subject to quotas.
The script reads search reports only. It cannot edit Search Console or your
website, read your enquiry inbox, or publish clinical content.

## One-time owner setup

Complete these steps when you can safely use your computer.

1. Sign in to https://search.google.com/search-console using the Google account
   that owns or can read Edelweizz's property. Select the existing verified
   sc-domain:edelweizzindia.com or https://edelweizzindia.com/ property.
   Do not create a duplicate property unnecessarily.
2. At https://script.google.com create a private project called Edelweizz Google
   reporting. Copy /optimizer-sync.gs into Code.gs. In Project Settings, show
   appsscript.json and replace its contents with /optimizer-appsscript.json.
3. Enable Google Search Console API in the script's linked Google Cloud
   project. Project Settings shows the association. If the default project
   does not expose the API controls, link a standard project you own, enable
   Search Console API there, and configure its OAuth consent as an application
   you control. Use Google's normal authorization; do not bypass a warning.
4. In the Edelweizz owner dashboard at /optimizer, create a private updater
   key. It is displayed only once. In the private script's Project Settings →
   Script Properties, set GSC_PROPERTY to the exact property from step 1 and
   EDELWEIZZ_SYNC_KEY to the private key. Never put the key in source or GitHub.
5. Select syncEdelweizz and Run. Approve the read-only Search Console,
   external-request and private-trigger permissions for this private script.
6. Confirm that the owner dashboard has a saved reporting receipt, with the
   right dates and source. A writer check alone does not prove Google access.
7. Only after step 6 succeeds, run installDailyTrigger. It installs one daily
   refresh at approximately 8 AM India time, preserving a matching trigger.
   It refuses to install until a recent report save has succeeded.

## What is measured

Google impressions, clicks, CTR and impression-weighted average position are
shown for comparable 7-day and 28-day windows. Google dates use Pacific time.
The latest final date returned can lag today and is shown explicitly; there
is no promise that yesterday's data is final.

At most 250 query/page pairs are fetched per window. They are not summed to
invent property totals; date-only totals are fetched separately. Local-intent
opportunities apply to existing pages. Searches where the website did not
appear, exact neighbourhood demand and precise Maps ranks are unavailable.

The enquiry trend uses the existing inbox, deduplicates new people and excludes
spam/duplicate records. Staff must review new submissions. Call clicks,
WhatsApp clicks and direction requests are interest, not received conversations.
Google receives none of the family's enquiry answers.

## Failure and recovery

- Edelweizz HTTP 401: the key is wrong, replaced or expired. Generate a new key
  in the owner dashboard and replace the private script property.
- Google 401/403: check the executing account's property permission, selected
  property and OAuth grant.
- API disabled: enable Search Console API in the linked Google Cloud project.
- Empty Google report: a property may have no returned observations. Do not
  interpret that as zero website traffic.
- A failed refresh retains the last successful report with a visible warning.
- The writer accepts at most 12 requests per hour. Do not repeatedly run it.
- Complete missing permissions through Google's normal sign-in process.

For a fallback, export the English Dates CSV from Search Console and import it
in the dashboard. Label preliminary data honestly. A CSV does not establish an
automatic feed or query/page opportunities.

## Review the strategy

Review daily; edit when evidence warrants it. Keep each action's source commit,
deployment and date in the log, then observe it for at least 14 days. Use equal
complete periods and treat small samples cautiously. A correlation does not
establish that one edit caused an improvement.

Clinical advice, credentials, availability and offers keep their owner review.
Helpful local content, clear services and accurate business information support
discoverability; no system can promise a rank, leads or every AI mention.

Official references:
- https://support.google.com/webmasters/answer/12919192
- https://developers.google.com/webmaster-tools/v1/searchanalytics/query
- https://developers.google.com/apps-script/guides/triggers/installable
- https://developers.google.com/apps-script/guides/services/authorization
