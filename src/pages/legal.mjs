import { site, mailto } from '../site.mjs';
import { icon } from '../icons.mjs';
import { pageHero } from '../layout.mjs';

const UPDATED = '24 October 2026';
const emailLink = (s) => `<a href="${mailto(s)}">${site.email}</a>`;

export function privacy() {
  const body = `
${pageHero({ eyebrow: 'Legal', title: 'Privacy policy', lead: `Last updated: ${UPDATED}` })}
<section class="section container">
  <div class="card prose legal">
    <p>This policy explains how ${site.legalName} ("Avaru", "we", "us") handles information when you visit this website. It covers this website only. Our products, such as AdLease, will have their own privacy policies before they are made available to the public.</p>

    <h2>Summary</h2>
    <ul>
      <li>This website has no accounts, sign-up forms or contact forms.</li>
      <li>We do not use advertising or analytics cookies, and we do not run tracking scripts on this website.</li>
      <li>If you email us, we receive the information you choose to send.</li>
    </ul>

    <h2>Information we receive</h2>
    <h3>When you email us</h3>
    <p>The "email" links on this website open your own email app. If you send us a message, we receive your email address, your name if you include it, and anything you write or attach. We use this only to read and reply to your message and, for job introductions, to consider you for future roles.</p>
    <h3>Technical information</h3>
    <p>This website is hosted by Vercel. Like most websites, when you visit, the hosting provider automatically processes technical information such as your IP address, browser type, the pages requested and the time of the request. This is needed to deliver the website, keep it secure and diagnose problems.</p>
    <p>The website's typeface is loaded from Google Fonts, so your browser connects to Google's servers to download it. Google receives your IP address as part of that request.</p>

    <h2>Cookies</h2>
    <p>This website does not set cookies for advertising or analytics. If we add analytics or other tools in the future, we will update this policy first.</p>

    <h2>How long we keep information</h2>
    <p>We keep emails for as long as needed to deal with your enquiry and for a reasonable period afterwards, unless the law requires otherwise. Job introductions are kept only while they may be relevant to a future role, and you can ask us to delete them at any time.</p>

    <h2>Sharing</h2>
    <p>We do not sell your personal information. We share it only with service providers who help us run this website and our email, or when the law requires it.</p>

    <h2>Your rights</h2>
    <p>Under Kenya's Data Protection Act, 2019, you have rights over your personal data. These include the right to be told how it is used, to access it, to have it corrected or deleted, and to object to its use. To use any of these rights, email ${emailLink('Privacy request')}.</p>

    <h2>Children</h2>
    <p>This website is not aimed at children, and we do not knowingly collect information from them.</p>

    <h2>Changes</h2>
    <p>We may update this policy. The date at the top shows when it last changed.</p>

    <h2>Contact</h2>
    <p>${site.legalName}, ${site.country}. Email: ${emailLink('Privacy question')}.</p>
  </div>
</section>
`;
  return {
    path: '/privacy',
    title: 'Privacy Policy',
    description: `How ${site.legalName} handles information on this website: no forms, no tracking cookies, and email-only contact.`,
    body,
  };
}

export function terms() {
  const body = `
${pageHero({ eyebrow: 'Legal', title: 'Terms and conditions', lead: `Last updated: ${UPDATED}` })}
<section class="section container">
  <div class="notice" role="note">
    ${icon('fileText')}
    <p><strong>Draft:</strong> These terms are a working draft and may change before they are finalised.</p>
  </div>
  <div class="card prose legal">
    <p>These terms apply to your use of this website, operated by ${site.legalName} ("Avaru", "we", "us"). By using the website, you agree to them.</p>

    <h2>1. About this website</h2>
    <p>This website gives general information about Avaru and the products we are developing or planning. Products marked "in development" or "concept" are not available to the public, and their features may change or never be released.</p>

    <h2>2. No offer or advice</h2>
    <p>Nothing on this website is an offer of goods, services, financing or investment, or a request for any such offer. Nothing here is financial, legal or technical advice. Concept products such as The Haven do not accept or manage any money or investment.</p>

    <h2>3. Accuracy</h2>
    <p>We try to keep the information on this website accurate and current, but we do not guarantee that it is complete or free of errors. Product plans and statuses can change.</p>

    <h2>4. Intellectual property</h2>
    <p>The Avaru name, logo, product names and the content of this website belong to ${site.legalName} unless stated otherwise. You may view and share pages for personal, non-commercial purposes. You may not copy, change or reuse our content or branding for other purposes without our written permission.</p>

    <h2>5. Acceptable use</h2>
    <p>Do not misuse this website. For example, do not try to break its security, disrupt it, or use it for anything unlawful.</p>

    <h2>6. Links to other websites</h2>
    <p>If we link to other websites, we are not responsible for their content or privacy practices.</p>

    <h2>7. Liability</h2>
    <p>To the extent permitted by law, we are not liable for any loss arising from your use of, or reliance on, this website. Nothing in these terms limits any liability that cannot be limited under applicable law.</p>

    <h2>8. Governing law</h2>
    <p>These terms are governed by the laws of Kenya.</p>

    <h2>9. Changes</h2>
    <p>We may update these terms. The date at the top shows when they last changed.</p>

    <h2>10. Contact</h2>
    <p>Questions about these terms: ${emailLink('Question about the terms')}.</p>
  </div>
</section>
`;
  return {
    path: '/terms',
    title: 'Terms & Conditions',
    description: `Terms and conditions for using the ${site.legalName} website (draft).`,
    body,
  };
}

export function notFound() {
  const body = `
<section class="container not-found">
  <p class="eyebrow">Error 404</p>
  <h1>Page not found</h1>
  <p class="lead">The page you are looking for does not exist or has moved.</p>
  <div class="btn-row">
    <a class="btn btn-primary" href="/">Back to home ${icon('arrowRight')}</a>
    <a class="btn btn-ghost" href="/products">Our products</a>
    <a class="btn btn-ghost" href="/contact">Contact us</a>
  </div>
</section>
`;
  return { path: '/404', title: 'Page not found', description: 'This page could not be found. Return to the Avaru Tech home page or browse our products.', body, noindex: true, file: '404.html' };
}
