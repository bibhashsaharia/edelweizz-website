# Current Sites Growth optimizer

This overlay is the optimizer implementation published as Sites version 10 on 29 October 2026. It belongs to the current Worker application, not the older Vite app at this repository root. Do not deploy the root Vite build over the current website.

The full private application remains in the existing Sites source repository. These new optimizer files, public SEO patch and release mapping make this change traceable in GitHub without exporting the complete private application or runtime data into this public repository.

## Integrating or reproducing

1. Open the existing Sites project through the supported Sites source workflow. Start from version 9 source 18d3a02719345b398b3be20b691124eb12c05263, preserving newer changes if present.
2. Copy this overlay's app, lib, public, site, tests and docs files into that canonical checkout. Apply public-seo-v9.patch there.
3. In the existing private site/console.html navigation, add an owner-only link to /optimizer with the existing data-owner attribute. Do not remove its existing enquiry, authentication, article, team or settings interfaces.
4. Configure OPTIMIZER_SYNC_KEY as a managed secret for the scoped initial writer. Never commit its value. Owner-created keys supersede it.
5. Run node tests/optimizer.test.mjs, node tests/console.test.mjs, TypeScript and the supported Sites build helper. Keep existing dependencies and DB/BUCKET bindings. No schema migration is required.
6. Package, save and deploy the exact pushed source commit through Sites.

The public source manifest below lets the owner compare these files byte for byte with the canonical deployed source. See RELEASE.md for actual evidence and limits.
