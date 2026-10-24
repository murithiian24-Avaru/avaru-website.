// Static site build for avaru-website. No npm dependencies: run with `node build.mjs`.
// Output goes to ./dist, which Vercel serves (see vercel.json).
import { mkdir, rm, writeFile, cp, readdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { site } from './src/site.mjs';
import { page } from './src/layout.mjs';
import home from './src/pages/home.mjs';
import about from './src/pages/about.mjs';
import productsPage from './src/pages/products.mjs';
import technology from './src/pages/technology.mjs';
import investors from './src/pages/investors.mjs';
import careers from './src/pages/careers.mjs';
import blog from './src/pages/blog.mjs';
import contact from './src/pages/contact.mjs';
import { privacy, terms, notFound } from './src/pages/legal.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const out = join(root, 'dist');
const today = new Date().toISOString().slice(0, 10);

const pages = [
  home(),
  about(),
  productsPage(),
  technology(),
  investors(),
  careers(),
  ...blog(),
  contact(),
  privacy(),
  terms(),
  notFound(),
];

// Guard against duplicate routes.
const seen = new Set();
for (const p of pages) {
  if (seen.has(p.path)) throw new Error(`Duplicate route: ${p.path}`);
  seen.add(p.path);
}

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

// Static files (CSS, JS, icons, images) are copied as-is.
await cp(join(root, 'public'), out, { recursive: true });

// Each route is written as <route>.html; vercel.json "cleanUrls" serves it at /<route>.
for (const p of pages) {
  const file = p.file || (p.path === '/' ? 'index.html' : `${p.path.slice(1)}.html`);
  const dest = join(out, file);
  await mkdir(dirname(dest), { recursive: true });
  await writeFile(dest, page(p));
}

const indexable = pages.filter((p) => !p.noindex);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexable
  .map((p) => `  <url><loc>${site.url}${p.path === '/' ? '/' : p.path}</loc><lastmod>${p.lastmod || today}</lastmod></url>`)
  .join('\n')}
</urlset>
`;
await writeFile(join(out, 'sitemap.xml'), sitemap);

await writeFile(
  join(out, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`
);

const files = await readdir(out, { recursive: true });
console.log(`Built ${pages.length} pages and ${files.length} files into dist/ for ${site.url}`);
