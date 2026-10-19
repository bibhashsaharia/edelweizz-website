import { readFile, writeFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';

const site = 'https://edelweizzindia.com';
const pages = [
  '/', '/services/', '/speech-therapy-sarjapur/', '/occupational-therapy-sarjapur/',
  '/behaviour-aba-therapy-sarjapur/', '/special-education-sarjapur/',
  '/early-intervention-sarjapur/', '/developmental-assessment-sarjapur/',
  '/parent-questions/', '/robots.txt', '/sitemap.xml',
];
const signatureTerms = [
  'enquiry saved', 'staff sign-in', 'staff login', 'journal', 'our team', 'meet our team',
  'assessment', 'speech therapy', 'occupational therapy', 'early intervention',
  'opening soon', 'whatsapp', 'google-analytics.com', 'googletagmanager.com',
];
const report = [
  '# Edelweizz public-site versus GitHub comparison',
  '',
  'Read-only run. The published site was fetched using GET requests only.',
  'No forms were submitted, no database accessed, and no deployment performed.',
  'The GitHub baseline is the checked-out pull request merge candidate built with `npm run build`.',
  'This is **not** confirmation that server-side services, Cloudflare configuration, or enquiry persistence match.',
  '',
  '| Path | Live status | GitHub built file | Byte-identical | Live bytes | Baseline bytes |',
  '| --- | --- | --- | --- | ---: | ---: |',
];
const differences = [];
const localRoot = path.resolve('dist');
const localAssetsRoot = path.join(localRoot, 'assets');
function sha(data) { return createHash('sha256').update(data).digest('hex'); }
function cleanText(data) {
  return String(data)
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]*>/g, ' ').replace(/&(?:nbsp|amp|quot|apos);/g, ' ')
    .replace(/\s+/g, ' ').trim().toLowerCase();
}
function title(html) { return (String(html).match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '').replace(/\s+/g, ' ').trim(); }
function scripts(html) { return [...String(html).matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["']/gi)].map(x => x[1]).filter(x => x.startsWith('/')); }
function flagTerms(text) { return signatureTerms.filter(term => text.includes(term)); }
const controller = () => AbortSignal.timeout(16000);
for (const pathname of pages) {
  const filename = pathname === '/' ? 'index.html' : /\.(xml|txt)$/.test(pathname) ? pathname.slice(1) : pathname.slice(1) + 'index.html';
  const localPath = path.resolve(localRoot, filename);
  if (!localPath.startsWith(localRoot + path.sep)) throw new Error('Unsafe file path');
  let local;
  try { local = await readFile(localPath); } catch { /* report absent baseline */ }
  let status = 'error', live;
  try {
    const response = await fetch(site + pathname, {
      signal: controller(), redirect: 'follow',
      headers: { 'User-Agent': 'EdelweizzSiteReconciliation/1.0 (read-only; GitHub Actions)' },
    });
    status = String(response.status);
    if (response.ok) {
      const len = Number(response.headers.get('content-length') || 0);
      if (len > 4000000) throw new Error('Public document too large to compare');
      const data = Buffer.from(await response.arrayBuffer());
      if (data.length > 4000000) throw new Error('Public document too large to compare');
      live = data;
    }
  } catch { status = 'fetch unavailable'; }
  const identical = live && local ? (sha(live) === sha(local) ? 'YES' : 'NO') : 'Not comparable';
  const baseline = local ? 'present' : 'missing';
  report.push(`| \`${pathname}\` | ${status} | ${baseline} | ${identical} | ${live?.length ?? '—'} | ${local?.length ?? '—'} |`);
  if (identical !== 'YES') differences.push(pathname);
  if (pathname === '/' && live && local) {
    const liveText = cleanText(live.toString());
    const localText = cleanText(local.toString());
    report.push('', '## Homepage metadata and observed content differences', '',
      `- Live title: ${JSON.stringify(title(live.toString()))}`,
      `- GitHub-built title: ${JSON.stringify(title(local.toString()))}`,
      `- Live HTML text hints: ${flagTerms(liveText).join(', ') || 'none'}`,
      `- GitHub-built HTML text hints: ${flagTerms(localText).join(', ') || 'none'}`,
      `- Live first-party script tags: ${scripts(live.toString()).length}`,
      `- GitHub-built first-party script tags: ${scripts(local.toString()).length}`);
    // Fingerprint public JavaScript only: do not print bundled code, tokens or API responses.
    const resourcePaths = [...new Set(scripts(live.toString()))].slice(0, 8);
    if (resourcePaths.length) {
      report.push('', '## Live JavaScript asset fingerprints', '', '| Public asset | Reachable | Bytes | SHA-256 |', '| --- | --- | ---: | --- |');
      for (const asset of resourcePaths) {
        if (!asset.startsWith('/') || asset.startsWith('//') || asset.includes('..')) continue;
        try {
          const resp = await fetch(site + asset, { signal: controller() });
          if (!resp.ok) { report.push(`| \`${asset.replaceAll('|','')}\` | HTTP ${resp.status} | — | — |`); continue; }
          const len = Number(resp.headers.get('content-length') || 0);
          if (len > 3000000) continue;
          const buf = Buffer.from(await resp.arrayBuffer());
          if (buf.length > 3000000) continue;
          report.push(`| \`${asset.replaceAll('|','')}\` | yes | ${buf.length} | \`${sha(buf)}\` |`);
          const s = buf.toString().toLowerCase();
          if (flagTerms(s).length) report.push(`\nUI/bundle text hints for \`${asset.replaceAll('|','')}\`: ${flagTerms(s).join(', ')}. These are text matches only, not verified working features.\n`);
        } catch { report.push(`| \`${asset.replaceAll('|','')}\` | request failed | — | — |`); }
      }
    }
  }
}
report.push('', '## Result and protection', '',
  `- Pages differing, missing or unreachable: **${differences.length} of ${pages.length}**.`,
  '- **A difference is not automatically a regression.** Production configuration, dynamic behaviour, staff login and lead persistence cannot be reconstructed from static HTML.',
  '- Before any merge/redeploy, identify the current Cloudflare Pages project, deployment ID, linked branch and complete source tree; preserve public content, staff access, journal, contact form, SEO, and data.',
  '- Keep Growth OS draft PR #4 separate until this reconciliation is reviewed.',
  '- Never deploy a `main` commit solely because this report ran.',
  ''
);
await writeFile('reconciliation-report.md', report.join('\n'));
if (differences.length) console.log(`Audit complete: ${differences.length}/${pages.length} public paths differ, are absent locally, or cannot be fetched. Review artifact; production not touched.`);
else console.log('All compared public pages were byte-identical. This does not validate backend or deployment linkage.');
