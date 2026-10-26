import { site, mailto } from '../site.mjs';
import { icon } from '../icons.mjs';
import { pageHero } from '../layout.mjs';

export default function careers() {
  const areas = ['Android development', 'Web and backend engineering', 'Product design', 'AI and data', 'Business development']
    .map((a) => `<li>${icon('check', 'icon icon-sm')} ${a}</li>`)
    .join('');

  const body = `
${pageHero({
  eyebrow: 'Careers',
  title: 'Build the future with Avaru',
  lead: 'We are a small, early-stage team. We will list roles here when we are hiring.',
})}

<section class="section container">
  <div class="split">
    <div class="card empty-state">
      <span class="card-icon card-icon-lg">${icon('briefcase')}</span>
      <h2>No open roles right now</h2>
      <p>We are not advertising any specific positions at the moment. You are welcome to introduce yourself, and we will keep your details in mind for future roles.</p>
      <a class="btn btn-primary" href="${mailto('Careers: introduction')}">${icon('mail')} Email your CV</a>
      <p class="small">Opens your email app, addressed to ${site.email}. Please attach your CV and tell us which area interests you.</p>
    </div>
    <div class="prose">
      <h2>Areas we expect to grow in</h2>
      <p>As our products develop, these are the skills we expect to need most:</p>
      <ul class="checklist">${areas}</ul>
      <p class="small">This is not a list of open jobs. It is a guide to the kinds of people we would like to hear from.</p>
      <h2>A note on recruitment safety</h2>
      <p>We will never ask you to pay a fee to apply or to be hired. Genuine messages from us come from ${site.email}.</p>
    </div>
  </div>
</section>
`;
  return {
    path: '/careers',
    title: 'Careers',
    description: 'Careers at Avaru Tech. There are no open roles right now, but you can introduce yourself to the team by email.',
    body,
  };
}
