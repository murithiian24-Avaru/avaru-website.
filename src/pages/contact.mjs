import { site, mailto } from '../site.mjs';
import { icon } from '../icons.mjs';
import { pageHero } from '../layout.mjs';

export default function contact() {
  const topics = [
    ['mail', 'General enquiries', 'General enquiry', 'Questions about Avaru or this website.'],
    ['users', 'Partnerships', 'Partnership enquiry', 'Working together on a product or market.'],
    ['trendingUp', 'Investors', 'Investment enquiry', 'Learning about the company and our plans.'],
    ['briefcase', 'Careers', 'Careers: introduction', 'Introducing yourself for future roles.'],
    ['smartphone', 'AdLease', 'AdLease enquiry', 'Questions about AdLease, which is in development.'],
    ['fileText', 'Media', 'Media enquiry', 'Press and media questions.'],
  ]
    .map(
      ([i, t, subject, d]) => `<a class="card contact-option" href="${mailto(subject)}">
        <span class="card-icon">${icon(i === 'trendingUp' ? 'target' : i)}</span>
        <span class="contact-option-text"><strong>${t}</strong><span>${d}</span></span>
        <span class="contact-option-cta">Email ${icon('arrowRight')}</span>
      </a>`
    )
    .join('');

  const body = `
${pageHero({
  eyebrow: 'Contact',
  title: 'Get in touch',
  lead: 'The best way to reach us is by email. Choose a topic below and your email app will open with the subject filled in.',
})}

<section class="section container">
  <div class="contact-layout">
    <div class="card contact-card">
      <h2 class="h3">Email</h2>
      <p><a class="contact-email" href="${mailto('Enquiry from the Avaru website')}">${icon('mail')} ${site.email}</a></p>
      <h2 class="h3">Location</h2>
      <p class="contact-line">${icon('mapPin')} ${site.country}</p>
      <p class="small">We do not currently publish a phone number or office address. We aim to reply to emails as soon as we can.</p>
    </div>
    <div>
      <h2 class="visually-hidden">Choose a topic</h2>
      <div class="contact-options">${topics}</div>
      <p class="small">These links open your own email app. This website does not collect or store anything you type.</p>
    </div>
  </div>
</section>
`;
  return {
    path: '/contact',
    title: 'Contact',
    description: `Contact ${site.legalName} by email at ${site.email} for general, partnership, investor, careers and media enquiries.`,
    body,
  };
}
