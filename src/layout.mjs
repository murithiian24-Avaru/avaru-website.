import { site, mailto } from './site.mjs';
import { icon } from './icons.mjs';

export const nav = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/products', label: 'Products' },
  { href: '/technology', label: 'Technology' },
  { href: '/investors', label: 'Investors' },
  { href: '/careers', label: 'Careers' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

export const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Official Avaru logo (see "Brand and logo" in README.md). Do not replace with text, CSS or redrawn versions.
// The image keeps the official artwork's proportions; only empty margin is trimmed.
export const logo = `<img class="logo-img" src="/brand/avaru-logo-lockup.png" width="334" height="240" alt="Avaru">`;

function header(path) {
  const links = nav
    .map((n) => {
      const current = n.href === path || (n.href !== '/' && path.startsWith(n.href + '/'));
      return `<li><a href="${n.href}"${current ? ' aria-current="page"' : ''}>${n.label}</a></li>`;
    })
    .join('');
  return `<header class="site-header">
  <div class="container header-inner">
    <a class="logo" href="/" aria-label="${esc(site.legalName)} home">${logo}</a>
    <nav class="primary-nav" id="primary-nav" aria-label="Main">
      <ul>${links}</ul>
      <a class="btn btn-outline nav-cta" href="/investors">Partner with us ${icon('arrowRight')}</a>
    </nav>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-nav" aria-label="Open menu">
      <span class="when-closed">${icon('menu')}</span><span class="when-open">${icon('x')}</span>
    </button>
  </div>
</header>`;
}

function footer() {
  const year = new Date().getFullYear();
  const social = site.social.length
    ? `<ul class="footer-social">${site.social.map((s) => `<li><a href="${esc(s.url)}" rel="me noopener">${esc(s.label)}</a></li>`).join('')}</ul>`
    : '';
  return `<footer class="site-footer">
  <div class="container footer-grid">
    <div class="footer-brand">
      <a class="logo" href="/" aria-label="${esc(site.legalName)} home">${logo}</a>
      <p>${esc(site.tagline)}. A technology company based in ${esc(site.country)}.</p>
      <a class="footer-email" href="${mailto('Enquiry from the Avaru website')}">${icon('mail')}<span>${esc(site.email)}</span></a>
      ${social}
    </div>
    <div>
      <h2 class="footer-heading">Company</h2>
      <ul>
        <li><a href="/about">About us</a></li>
        <li><a href="/careers">Careers</a></li>
        <li><a href="/blog">Blog</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
    </div>
    <div>
      <h2 class="footer-heading">What we build</h2>
      <ul>
        <li><a href="/products">Our products</a></li>
        <li><a href="/technology">Technology &amp; services</a></li>
        <li><a href="/investors">Investors &amp; partners</a></li>
      </ul>
    </div>
    <div>
      <h2 class="footer-heading">Legal</h2>
      <ul>
        <li><a href="/privacy">Privacy policy</a></li>
        <li><a href="/terms">Terms &amp; conditions</a></li>
      </ul>
    </div>
  </div>
  <div class="container footer-bottom">
    <p>&copy; ${year} ${esc(site.legalName)}. All rights reserved.</p>
    <p>Product statuses on this site reflect each product's current stage.</p>
  </div>
</footer>`;
}

export function page({ path, title, description, body, jsonLd = [], noindex = false }) {
  const canonical = site.url + (path === '/' ? '/' : path);
  const fullTitle = path === '/' ? `${site.legalName} | ${site.tagline}` : `${title} | ${site.legalName}`;
  const ld = jsonLd
    .map((o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`)
    .join('\n');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${canonical}">`}
<meta name="theme-color" content="#050B14">
<link rel="icon" href="/favicon.ico?v=2" sizes="16x16 32x32 48x48">
<link rel="icon" href="/favicon-32.png?v=2" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png?v=2">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.legalName)}">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${site.url}/og-image.png?v=2">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(site.legalName)} logo">
<meta property="og:locale" content="en_KE">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(fullTitle)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${site.url}/og-image.png?v=2">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap">
<link rel="stylesheet" href="/assets/styles.css">
<script src="/assets/main.js" defer></script>
${ld}
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
<div class="glow" aria-hidden="true"></div>
${header(path)}
<main id="main" tabindex="-1">
${body}
</main>
${footer()}
</body>
</html>
`;
}

// Shared building blocks used by several pages.
export function pageHero({ eyebrow, title, lead }) {
  return `<section class="page-hero container">
  <p class="eyebrow">${eyebrow}</p>
  <h1>${title}</h1>
  ${lead ? `<p class="lead">${lead}</p>` : ''}
</section>`;
}

export function statusPill(statusKey, STATUS) {
  const s = STATUS[statusKey];
  return `<span class="pill pill-${s.tone}">${s.label}</span>`;
}

export function ctaBand({ title, text, primary, secondary }) {
  return `<section class="container">
  <div class="cta-band">
    <div>
      <h2>${title}</h2>
      <p>${text}</p>
    </div>
    <div class="btn-row">
      <a class="btn btn-primary" href="${primary.href}">${primary.label} ${icon('arrowRight')}</a>
      ${secondary ? `<a class="btn btn-ghost" href="${secondary.href}">${secondary.label}</a>` : ''}
    </div>
  </div>
</section>`;
}
