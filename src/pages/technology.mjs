import { icon } from '../icons.mjs';
import { pageHero, ctaBand } from '../layout.mjs';
import { mailto } from '../site.mjs';

export default function technology() {
  const areas = [
    {
      icon: 'code',
      title: 'Software engineering',
      text: 'Our main focus is mobile development, with Android as our first platform. AdLease is being built as an Android app, with the web and backend services it will need.',
      points: ['Android app development', 'Web front ends and APIs', 'Release testing (planned)'],
    },
    {
      icon: 'cpu',
      title: 'AI-enabled solutions',
      text: 'We are exploring practical uses of artificial intelligence. AutoEar, for example, is a concept for AI-assisted vehicle diagnostics. We only describe AI features as working once they are built and tested.',
      points: ['Researching AI use cases', 'Planning for human oversight', 'Clear limits on what AI can do'],
    },
    {
      icon: 'cloud',
      title: 'Cloud architecture',
      text: 'We plan to run our services on managed cloud platforms, so a small team can operate and scale them as demand grows.',
      points: ['Managed cloud hosting (planned)', 'Access control and secret handling (planned)', 'Monitoring and backups (planned)'],
    },
    {
      icon: 'server',
      title: 'Digital infrastructure',
      text: 'Avaru Core is our internal founder and management hub. Avaru Nexus is a planned AI management layer that would sit on top of it. Neither is a public product.',
      points: ['Avaru Core (internal tool)', 'Avaru Nexus (planned)', 'Shared foundations across products'],
    },
  ]
    .map(
      (a) => `<article class="card area">
        <span class="card-icon card-icon-lg">${icon(a.icon)}</span>
        <h2>${a.title}</h2>
        <p>${a.text}</p>
        <ul class="checklist">${a.points.map((p) => `<li>${icon('check', 'icon icon-sm')} ${p}</li>`).join('')}</ul>
      </article>`
    )
    .join('');

  const body = `
${pageHero({
  eyebrow: 'Technology & services',
  title: 'How we build our products',
  lead: 'The engineering areas we work in and the standards we design to. We are focused on building our own products first.',
})}

<section class="section container"><div class="grid grid-2">${areas}</div></section>

<section class="section container" aria-labelledby="security-heading">
  <div class="card split-card">
    <span class="card-icon card-icon-lg">${icon('shield')}</span>
    <div class="prose">
      <h2 id="security-heading">Security and privacy</h2>
      <p>Our products are expected to handle personal and, in some cases, financial information. We aim to treat security and privacy as design requirements, not add-ons: collecting only the data we need, protecting credentials and keys, and reviewing third-party services before we use them.</p>
    </div>
  </div>
</section>

<section class="section container" aria-labelledby="work-heading">
  <div class="card split-card">
    <span class="card-icon card-icon-lg">${icon('briefcase')}</span>
    <div class="prose">
      <h2 id="work-heading">Working with us</h2>
      <p>We are not currently advertising client services. If you have a project or partnership in mind that fits our work, we are happy to talk.</p>
      <p><a class="text-link" href="${mailto('Technology partnership enquiry')}">Email us about a project ${icon('arrowRight')}</a></p>
    </div>
  </div>
</section>

${ctaBand({
  title: 'See where this work is going',
  text: 'Explore the products these capabilities support.',
  primary: { href: '/products', label: 'Our products' },
  secondary: { href: '/contact', label: 'Contact us' },
})}
`;
  return {
    path: '/technology',
    title: 'Technology & Services',
    description:
      'How Avaru Tech builds: Android-first software engineering, AI-enabled product research, cloud architecture and internal digital infrastructure.',
    body,
  };
}
