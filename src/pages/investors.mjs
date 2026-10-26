import { site, mailto } from '../site.mjs';
import { products, STATUS } from '../products.mjs';
import { icon } from '../icons.mjs';
import { pageHero, statusPill } from '../layout.mjs';

export default function investors() {
  const rows = products
    .map(
      (p) => `<tr><th scope="row">${p.name}</th><td>${p.category}</td><td>${statusPill(p.status, STATUS)}</td></tr>`
    )
    .join('');

  const routes = [
    ['trendingUp', 'Investors', 'Investment enquiry', 'For investors who want to learn about the company and our plans.'],
    ['users', 'Strategic partners', 'Partnership enquiry', 'For companies interested in working with us on a product or market.'],
    ['smartphone', 'AdLease partners', 'AdLease partnership enquiry', 'For advertisers, device suppliers or financing partners interested in AdLease.'],
  ]
    .map(
      ([, t, subject, d]) => `<div class="card enquiry">
        <h3>${t}</h3>
        <p>${d}</p>
        <a class="btn btn-outline btn-block" href="${mailto(subject)}">${icon('mail')} Email: ${subject}</a>
      </div>`
    )
    .join('');

  const body = `
${pageHero({
  eyebrow: 'Investors & partners',
  title: 'Partner with Avaru',
  lead: `${site.legalName} is an early-stage technology company in ${site.country}. Here is an accurate picture of where we are today.`,
})}

<section class="section container">
  <div class="split">
    <div class="prose">
      <h2>Company overview</h2>
      <p>We design and build digital products across device access, transport, AI, aviation learning and diaspora projects. Our immediate focus is AdLease, an ad-supported, instalment-based phone ownership app that is in development for Android.</p>
      <p>We have not launched a product publicly yet. We do not publish revenue, user or traction figures, because we do not have launched products to report on. When that changes, we will share verified information.</p>
    </div>
    <div class="card">
      <h2 class="h3">Portfolio at a glance</h2>
      <div class="table-wrap">
        <table>
          <thead><tr><th scope="col">Product</th><th scope="col">Area</th><th scope="col">Status</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      <p class="small"><a class="text-link" href="/products">Full product details ${icon('arrowRight')}</a></p>
    </div>
  </div>
</section>

<section class="section container" aria-labelledby="enquiry-heading">
  <div class="section-head">
    <p class="eyebrow">Get in touch</p>
    <h2 id="enquiry-heading">Start a conversation</h2>
    <p>Each button opens your email app with a pre-filled subject line, addressed to <a href="${mailto('Investor or partner enquiry')}">${site.email}</a>.</p>
  </div>
  <div class="grid grid-3">${routes}</div>
</section>

<section class="section container">
  <div class="notice" role="note">
    ${icon('fileText')}
    <p><strong>Important:</strong> This page is for general information only. It is not an offer to sell, or a request for an offer to buy, any shares, securities or other investment, and it is not financial advice. Any investment discussion would happen privately and would be subject to applicable law and proper documentation.</p>
  </div>
</section>
`;
  return {
    path: '/investors',
    title: 'Investors & Partners',
    description:
      'Investor and partner information for Avaru Tech: an accurate company overview, product statuses and how to start a conversation.',
    body,
  };
}
