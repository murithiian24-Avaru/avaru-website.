import { site } from '../site.mjs';
import { products, STATUS } from '../products.mjs';
import { icon } from '../icons.mjs';
import { statusPill, ctaBand, esc } from '../layout.mjs';

export default function home() {
  const statusRows = products
    .map(
      (p) => `<li class="status-row">
        <span class="status-icon">${icon(p.icon)}</span>
        <span class="status-name"><strong>${p.name}</strong><span>${p.category}</span></span>
        ${statusPill(p.status, STATUS)}
      </li>`
    )
    .join('');

  const cards = products
    .map(
      (p) => `<article class="card product-card${p.status === 'development' ? ' card-featured' : ''}">
        <div class="card-top">
          <span class="card-icon">${icon(p.icon)}</span>
          ${statusPill(p.status, STATUS)}
        </div>
        <h3>${p.name}</h3>
        <p class="card-kicker">${p.tagline}</p>
        <p>${p.summary}</p>
        <a class="text-link" href="/products#${p.id}" aria-label="More about ${p.name}">More about ${p.name} ${icon('arrowRight')}</a>
      </article>`
    )
    .join('');

  const capabilities = [
    ['smartphone', 'Mobile and software engineering', 'Android-first product development, with web and backend work to support it.'],
    ['cpu', 'AI-enabled products', 'Exploring practical uses of AI where it can genuinely help, such as diagnostics and operations.'],
    ['cloud', 'Cloud architecture', 'Planning services that are secure, maintainable and able to grow with demand.'],
    ['server', 'Digital infrastructure', 'Internal systems that let a small team build and run several products.'],
  ]
    .map(
      ([i, t, d]) => `<div class="card capability">
        <span class="card-icon">${icon(i)}</span>
        <h3>${t}</h3>
        <p>${d}</p>
      </div>`
    )
    .join('');

  const body = `
<section class="hero container">
  <div class="hero-copy">
    <p class="badge">${icon('sparkle')} Kenyan technology company</p>
    <h1><span class="hero-name">AVARU</span> <span class="gradient-text">${esc(site.tagline)}.</span></h1>
    <p class="lead">${site.legalName} is a technology company in ${site.country} creating digital products that aim to solve real-world problems, starting with AdLease, our ad-supported phone ownership app, which is now in development.</p>
    <div class="btn-row">
      <a class="btn btn-primary" href="/products">Explore our products ${icon('arrowRight')}</a>
      <a class="btn btn-ghost" href="/investors">Partner with Avaru</a>
    </div>
  </div>
  <aside class="hero-panel" aria-labelledby="portfolio-status">
    <div class="panel-bar"><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span><span id="portfolio-status">Portfolio status</span></div>
    <ul class="status-list">${statusRows}</ul>
    <p class="panel-foot">${icon('check', 'icon icon-sm')} Statuses are shown as they really are today.</p>
  </aside>
</section>

<section class="section container" aria-labelledby="products-heading">
  <div class="section-head">
    <p class="eyebrow">Our portfolio</p>
    <h2 id="products-heading">What we're building</h2>
    <p>One product in active development and four concepts we are planning. We label each one clearly so you always know what exists today.</p>
  </div>
  <div class="grid grid-3">${cards}</div>
</section>

<section class="section container" aria-labelledby="capabilities-heading">
  <div class="section-head">
    <p class="eyebrow">Technology</p>
    <h2 id="capabilities-heading">How we build</h2>
    <p>The skills and systems behind our products.</p>
  </div>
  <div class="grid grid-4">${capabilities}</div>
  <p class="section-link"><a class="text-link" href="/technology">Technology and services ${icon('arrowRight')}</a></p>
</section>

<section class="section container" aria-labelledby="principles-heading">
  <div class="split">
    <div>
      <p class="eyebrow">Our approach</p>
      <h2 id="principles-heading">Technology. Innovation. Impact.</h2>
      <p class="lead-sm">Avaru develops technology products designed to make everyday life more connected, accessible and intelligent. We are an early-stage company, and we would rather be clear about where we are than overstate it.</p>
    </div>
    <ul class="principles">
      <li><span class="card-icon">${icon('target')}</span><div><h3>Start from real problems</h3><p>We focus on technology that addresses genuine everyday challenges.</p></div></li>
      <li><span class="card-icon">${icon('shield')}</span><div><h3>Build carefully</h3><p>We aim to make security, privacy and reliability part of the design from the start.</p></div></li>
      <li><span class="card-icon">${icon('eye')}</span><div><h3>Be transparent</h3><p>Every product shows its real status: in development or concept.</p></div></li>
    </ul>
  </div>
</section>

${ctaBand({
  title: 'Interested in what we are building?',
  text: 'Investors, partners and collaborators can reach the team directly by email.',
  primary: { href: '/investors', label: 'Investors & partners' },
  secondary: { href: '/contact', label: 'Contact us' },
})}
`;

  const orgLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.legalName,
    alternateName: site.name,
    url: site.url + '/',
    logo: site.url + '/logo.png?v=2',
    email: site.email,
    address: { '@type': 'PostalAddress', addressCountry: site.countryCode },
    ...(site.social.length ? { sameAs: site.social.map((s) => s.url) } : {}),
  };
  const webLd = { '@context': 'https://schema.org', '@type': 'WebSite', name: site.legalName, url: site.url + '/' };

  return {
    path: '/',
    title: 'Home',
    description: site.description,
    body,
    jsonLd: [orgLd, webLd],
  };
}
