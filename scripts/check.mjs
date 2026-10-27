// Static checks on dist/: every internal link and asset resolves, each page has
// one <h1>, a unique title and description, a canonical URL, and Open Graph tags.
// Also checks the sitemap and robots.txt, and scans for banned placeholder content.
// Run after a build: `node scripts/check.mjs` (or `npm run check`).
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
// Original files copied through unchanged; they are not site pages, so page checks skip them.
const PASSTHROUGH = ['gemini-code-1788439996424.html'];
const files = (await readdir(dist, { recursive: true })).map(String);
const htmlFiles = files.filter((f) => f.endsWith('.html') && !PASSTHROUGH.includes(f));
for (const f of PASSTHROUGH) if (!files.includes(f)) errors_early(`passthrough file missing from dist: ${f}`);
function errors_early(m) { console.error('✗ ' + m); process.exit(1); }
const errors = [];
const fail = (m) => errors.push(m);

const routeFor = (f) => (f === 'index.html' ? '/' : '/' + f.replace(/\.html$/, ''));
const routes = new Set(htmlFiles.filter((f) => f !== '404.html').map(routeFor));
const fileSet = new Set(files.map((f) => '/' + f.replace(/\\/g, '/')));

const titles = new Map();
const descs = new Map();
const pageIds = new Map();

for (const f of htmlFiles) {
  const html = await readFile(join(dist, f), 'utf8');
  pageIds.set(routeFor(f), new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
}

for (const f of htmlFiles) {
  const html = await readFile(join(dist, f), 'utf8');
  const route = routeFor(f);
  const h1s = html.match(/<h1[\s>]/g) || [];
  if (h1s.length !== 1) fail(`${route}: expected 1 <h1>, found ${h1s.length}`);
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const desc = html.match(/<meta name="description" content="([^"]+)"/)?.[1];
  if (!title) fail(`${route}: missing <title>`);
  if (!desc) fail(`${route}: missing meta description`);
  if (desc && (desc.length < 50 || desc.length > 170)) fail(`${route}: description length ${desc.length} (aim for 50-170)`);
  if (titles.has(title)) fail(`${route}: duplicate title with ${titles.get(title)}`);
  if (descs.has(desc)) fail(`${route}: duplicate description with ${descs.get(desc)}`);
  titles.set(title, route); descs.set(desc, route);
  if (f !== '404.html') {
    if (!html.includes('<link rel="canonical"')) fail(`${route}: missing canonical`);
    for (const p of ['og:title', 'og:description', 'og:url', 'og:image']) if (!html.includes(`property="${p}"`)) fail(`${route}: missing ${p}`);
  }
  if (!html.includes('lang="en"')) fail(`${route}: missing lang`);
  if (/href="#"/.test(html)) fail(`${route}: empty # link`);
  if (/lorem ipsum|testimonial|avaru\.tech|hello@|#facebook|#instagram|#linkedin|"#x"/i.test(html)) fail(`${route}: banned placeholder content`);
  for (const img of html.matchAll(/<img\b[^>]*>/g)) if (!/\salt="/.test(img[0])) fail(`${route}: <img> without alt`);

  // Brand: only the official logo assets may be used (see "Brand and logo" in README.md).
  if (!html.includes('src="/brand/avaru-logo-lockup.png"')) fail(`${route}: official logo missing from header/footer`);
  if (/favicon\.svg|class="logo-mark"/.test(html)) fail(`${route}: outdated placeholder logo referenced`);
  for (const m of html.matchAll(/<meta (?:property|name)="(?:og|twitter):image" content="([^"]+)"/g)) {
    if (!fileSet.has(new URL(m[1]).pathname)) fail(`${route}: social image not found: ${m[1]}`);
  }

  for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const url = m[1];
    if (/^(https?:|mailto:|tel:)/.test(url)) {
      if (url.startsWith('mailto:') && !url.startsWith('mailto:infoavarultd@gmail.com')) fail(`${route}: unexpected email ${url}`);
      continue;
    }
    const [pathWithQuery, hash] = url.split('#');
    const pathPart = pathWithQuery.split('?')[0];
    const target = pathPart === '' ? route : pathPart;
    if (!target.startsWith('/')) { fail(`${route}: relative link ${url}`); continue; }
    if (pathPart !== '' && !routes.has(target) && !fileSet.has(target)) { fail(`${route}: broken link ${url}`); continue; }
    if (hash && !(pageIds.get(target) || new Set()).has(hash)) fail(`${route}: missing anchor ${url}`);
  }
}

const sitemap = await readFile(join(dist, 'sitemap.xml'), 'utf8');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
if (!sitemap.startsWith('<?xml')) fail('sitemap.xml: missing XML declaration');
for (const r of routes) if (!locs.includes(r)) fail(`sitemap.xml: missing ${r}`);
for (const l of locs) if (!routes.has(l)) fail(`sitemap.xml: lists unknown ${l}`);
const robots = await readFile(join(dist, 'robots.txt'), 'utf8');
if (!/Sitemap: https:\/\/.+\/sitemap\.xml/.test(robots)) fail('robots.txt: missing Sitemap line');

for (const f of htmlFiles) {
  const html = await readFile(join(dist, f), 'utf8');
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch { fail(`${routeFor(f)}: invalid JSON-LD`); }
  }
}

if (errors.length) {
  console.error(`✗ ${errors.length} problem(s):\n- ` + errors.join('\n- '));
  process.exit(1);
}
console.log(`✓ ${htmlFiles.length} pages checked: links, anchors, assets, metadata, sitemap, robots.txt and JSON-LD all OK`);
