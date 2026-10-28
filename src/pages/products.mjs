import { products, platforms, STATUS } from '../products.mjs';
import { icon } from '../icons.mjs';
import { pageHero, statusPill, ctaBand, endorsement } from '../layout.mjs';
import { mailto } from '../site.mjs';

export default function productsPage() {
  const legend = Object.entries(STATUS)
    .filter(([k]) => k !== 'planned')
    .map(([k, s]) => `<li>${statusPill(k, STATUS)}<span>${s.note}</span></li>`)
    .join('');

  const toc = products
    .map((p) => `<li><a href="#${p.id}">${p.name}</a></li>`)
    .join('');

  const sections = products
    .map(
      (p) => `<article class="card product-detail${p.status === 'development' ? ' card-featured' : ''}" id="${p.id}" aria-labelledby="${p.id}-title">
        <div class="product-detail-head">
          <span class="card-icon card-icon-lg">${icon(p.icon)}</span>
          <div>
            <p class="card-kicker">${p.category}</p>
            <h2 id="${p.id}-title">${p.name}</h2>
          </div>
          ${statusPill(p.status, STATUS)}
        </div>
        <p class="product-tagline">${p.tagline}</p>
        ${p.detail.map((d) => `<p>${d}</p>`).join('')}
        <p class="product-status-note"><strong>Status:</strong> ${STATUS[p.status].label}. ${STATUS[p.status].note}</p>
        <a class="text-link" href="${mailto(`${p.name} enquiry`)}">Ask about ${p.name} by email ${icon('arrowRight')}</a>
        ${endorsement()}
      </article>`
    )
    .join('');

  const internal = platforms
    .map(
      (p) => `<div class="card">
        <div class="card-top"><span class="card-icon">${icon(p.icon)}</span>${statusPill(p.status, STATUS)}</div>
        <h3>${p.name}</h3>
        <p>${p.summary}</p>
      </div>`
    )
    .join('');

  const body = `
${pageHero({
  eyebrow: 'Our products',
  title: 'Products and concepts',
  lead: 'Every product is clearly labelled with its real stage. AdLease is in development. The others are concepts we are planning.',
})}

<section class="container">
  <div class="card legend" aria-label="Status key">
    <h2 class="visually-hidden">What the statuses mean</h2>
    <ul>${legend}</ul>
  </div>
  <nav class="product-toc" aria-label="Products on this page"><ul>${toc}</ul></nav>
</section>

<section class="section container stack-lg">${sections}</section>

<section class="section container" aria-labelledby="internal-heading">
  <div class="section-head">
    <p class="eyebrow">Behind the scenes</p>
    <h2 id="internal-heading">Internal platforms</h2>
    <p>These support how we work. They are not products you can sign up for.</p>
  </div>
  <div class="grid grid-2">${internal}</div>
</section>

${ctaBand({
  title: 'Interested in partnering on a product?',
  text: 'We are open to conversations with partners who share our goals.',
  primary: { href: '/investors', label: 'Investors & partners' },
  secondary: { href: '/contact', label: 'Contact us' },
})}
`;
  return {
    path: '/products',
    title: 'Our Products',
    description:
      'Avaru Tech products and their real status: AdLease (in development), and the Zubari, AeroVault, AutoEar and The Haven concepts.',
    body,
  };
}
