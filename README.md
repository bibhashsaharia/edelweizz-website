# Edelweizz India website

Warm, parent-focused redesign with the existing Edelweizz identity and actual centre photography.

## Develop and build

```sh
npm ci
npm run dev
npm run build
npm run preview
```

The existing Vite build continues to produce `dist`. The redesigned entry uses `index.html`, `src/site.js` and `src/site.css`; the previous React entry is retained for reference but is not loaded. Images and self-hosted fonts are in `public/assets`, including font licences.

## Parent experience

Seven service summaries and category filters; service-detail dialogs; a four-step child journey; photographs that open at full size; team information; FAQs; centre hours and contact details; policy dialogs. The enquiry builder prepares a WhatsApp message locally and lets the parent review it before opening WhatsApp. It does not submit or store an enquiry.

## Review status

Private review: https://edelweizz-india-review.bibhash-saharia.chatgpt.site

This branch is a draft for review. Do not merge, publish publicly, change domain bindings or replace edelweizzindia.com without the owner's approval. The commit uses `[CF-Pages-Skip]` to omit automatic Cloudflare Pages deployment. Keep that prefix on review commits. The private Sites project remains separate from this public source repository.

Before an approved public launch, remove the review-only `noindex, nofollow` meta tag, remove the `Disallow: /` robots rule, change the policy heading from private review to website, and confirm current team, service availability, contact details and policies with the owner. The approved release must use a new commit without the skip prefix.

## Validation

Vite production build and JavaScript syntax are checked when preparing this branch. The private redesign's earlier DOM checks covered service filters and dialogs, journey controls, enquiry preview/edit, policies and responsive rules. Those are not a substitute for visual device testing; rendered desktop and mobile QA remain review limitations in this environment.
