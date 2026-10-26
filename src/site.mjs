// Verified company details. Only add facts here that the company has confirmed.
// Everything on the site (pages, metadata, structured data) reads from this file.

export const site = {
  legalName: 'Avaru Tech Company Limited',
  name: 'Avaru Tech',
  // Canonical origin used for canonical URLs, Open Graph, sitemap and robots.txt.
  // Set SITE_URL in Vercel (Project → Settings → Environment Variables) once the
  // custom domain is live, e.g. SITE_URL=https://www.example.com
  url: (process.env.SITE_URL || 'https://avaru-website.vercel.app').replace(/\/+$/, ''),
  email: 'infoavarultd@gmail.com',
  country: 'Kenya',
  countryCode: 'KE',
  tagline: 'Building Technology for a Smarter Future',
  description:
    'Avaru Tech Company Limited is a Kenyan technology company building digital products for device access, transport, AI diagnostics, aviation learning and the diaspora.',
  // Social accounts are intentionally empty until verified profiles are provided.
  // Add entries like { label: 'LinkedIn', url: 'https://...' } to show them in the footer.
  social: [],
};

// Pre-addressed email links. They open the visitor's own email app; nothing is
// sent or stored by this website.
export function mailto(subject) {
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}`;
}
