# Edelweizz India website

Production website for Edelweizz Pediatric Therapy Center, Sarjapur–Chembanahalli, Bengaluru.

## Build

```sh
npm ci
npm run dev
npm run build
npm run preview
```

The site is built with Vite. The production entry uses `index.html`, `src/site.js` and `src/site.css`. Shared public assets live in `public/assets`. Dedicated service and parent-answer pages live under `public/<slug>/index.html` so they publish as crawlable URLs.

## Production goals

1. Convert parent enquiries with clear service information, real centre photography, visible contact details and low-friction WhatsApp contact.
2. Rank for non-brand local-intent searches such as speech therapy, occupational therapy, behaviour/ABA support, special education, early intervention and developmental assessment around Sarjapur.
3. Build strong machine-readable entity signals for Google and AI discovery through consistent NAP data, structured data, dedicated URLs, internal links and useful parent-answer content.
4. Keep copy factual and parent-focused. No keyword stuffing or generic SEO filler.

## Site architecture

- `/` — conversion hub / centre overview
- `/speech-therapy-sarjapur/`
- `/occupational-therapy-sarjapur/`
- `/behaviour-aba-therapy-sarjapur/`
- `/special-education-sarjapur/`
- `/early-intervention-sarjapur/`
- `/developmental-assessment-sarjapur/`
- `/parent-questions/`

The homepage remains the main brand and conversion page. Dedicated pages carry deeper service intent and parent questions.

## Current release work

Completed on this branch:
- redesigned homepage with real centre photography
- current centre hours, address and contact details
- service overview, child journey, team information and parent FAQ
- LocalBusiness structured data foundation
- public crawl rule in `robots.txt`
- shared styling for dedicated service pages
- first dedicated page: `/speech-therapy-sarjapur/`

Before merge to `main`:
- add the remaining dedicated service / assessment / parent-question pages
- link dedicated pages from the homepage
- remove review-only `noindex` and private-review language
- add/update `sitemap.xml`
- validate internal links, canonical URLs, structured data and build output
- review current team/service/contact facts

After merge:
- verify the public domain serves the new build
- verify `robots.txt`, sitemap, canonicals, page titles and structured data on the live site
- test priority parent/search queries and record whether Edelweizz appears
- use the results to decide the next content and authority-building actions

## Discovery measurement

Track a fixed query set rather than relying on impressions. Example groups:
- speech therapy Sarjapur
- occupational therapy Sarjapur
- ABA / behaviour therapy Sarjapur
- special education Sarjapur
- early intervention Sarjapur
- developmental assessment Sarjapur
- child development centre Sarjapur
- realistic parent questions about delayed speech, sensory concerns, behaviour, school readiness and developmental support

Record branded visibility, non-brand visibility, referring/cited sources and competitors appearing instead of Edelweizz.
