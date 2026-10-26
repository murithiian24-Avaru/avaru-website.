import { site } from '../site.mjs';
import { icon } from '../icons.mjs';
import { pageHero, ctaBand } from '../layout.mjs';

export default function about() {
  const values = [
    ['target', 'Meaningful problems', 'We focus on technology that addresses genuine everyday challenges.'],
    ['mapPin', 'Built from Africa', 'Building from Kenya, with solutions designed for global relevance.'],
    ['layers', 'Modern engineering', 'Combining software, AI, data and modern digital infrastructure.'],
    ['users', 'Room to grow', 'Designing products that can grow across markets over time.'],
  ]
    .map(([i, t, d]) => `<div class="card"><span class="card-icon">${icon(i)}</span><h3>${t}</h3><p>${d}</p></div>`)
    .join('');

  const body = `
${pageHero({
  eyebrow: 'About us',
  title: 'We are building more than apps.',
  lead: `${site.legalName} is a young, founder-led technology company in ${site.country}, with global ambitions.`,
})}

<section class="section container">
  <div class="split">
    <div class="prose">
      <h2>Who we are</h2>
      <p>Avaru Tech is a Kenyan technology company that designs and builds digital products. We work across device access, transport, AI, aviation learning and diaspora projects. These are areas where we believe well-built technology can make everyday life more connected, accessible and intelligent.</p>
      <p>We are at an early stage. Our first product, <a href="/products#adlease">AdLease</a>, is in development. Our other products are concepts that we are researching and planning. We would rather show you exactly where we are than make claims we cannot support.</p>
    </div>
    <div class="stack">
      <div class="card"><span class="card-icon">${icon('target')}</span><h3>Our mission</h3><p>To create innovative, accessible and scalable technology solutions that solve real-world problems and create meaningful economic opportunities.</p></div>
      <div class="card"><span class="card-icon">${icon('eye')}</span><h3>Our vision</h3><p>To become a globally recognised technology company originating from Africa.</p></div>
    </div>
  </div>
</section>

<section class="section container" aria-labelledby="values-heading">
  <div class="section-head">
    <p class="eyebrow">What guides us</p>
    <h2 id="values-heading">Our principles</h2>
  </div>
  <div class="grid grid-4">${values}</div>
</section>

<section class="section container" aria-labelledby="story-heading">
  <div class="card prose story">
    <h2 id="story-heading">Where we are today</h2>
    <ul class="checklist">
      <li>${icon('check', 'icon icon-sm')} ${site.legalName} is a technology company based in ${site.country}.</li>
      <li>${icon('check', 'icon icon-sm')} AdLease, our highest-priority product, is in development as an Android app.</li>
      <li>${icon('check', 'icon icon-sm')} Zubari, AeroVault, AutoEar and The Haven are concepts at the planning stage.</li>
      <li>${icon('check', 'icon icon-sm')} Avaru Core, our internal management hub, supports how we run the company. Avaru Nexus, an AI management layer, is planned.</li>
    </ul>
  </div>
</section>

${ctaBand({
  title: 'Want to know more?',
  text: 'See the products we are working on, or get in touch with the team.',
  primary: { href: '/products', label: 'Our products' },
  secondary: { href: '/contact', label: 'Contact us' },
})}
`;
  return {
    path: '/about',
    title: 'About Us',
    description: `About ${site.legalName}: a founder-led Kenyan technology company, its mission, vision and current stage.`,
    body,
  };
}
