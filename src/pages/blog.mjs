import { site, mailto } from '../site.mjs';
import { posts } from '../blog.mjs';
import { icon } from '../icons.mjs';
import { pageHero, esc } from '../layout.mjs';

const fmt = (d) =>
  new Date(d + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function validate(p) {
  for (const k of ['slug', 'title', 'date', 'summary', 'html']) {
    if (!p[k]) throw new Error(`Blog post is missing "${k}": ${JSON.stringify(p.slug || p.title)}`);
  }
  if (!SLUG.test(p.slug)) throw new Error(`Invalid blog slug "${p.slug}"`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(p.date)) throw new Error(`Invalid date for "${p.slug}"`);
}

export default function blog() {
  posts.forEach(validate);
  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));

  const listing = sorted.length
    ? `<div class="grid grid-3">${sorted
        .map(
          (p) => `<article class="card post-card">
            <p class="card-kicker"><time datetime="${p.date}">${fmt(p.date)}</time></p>
            <h2 class="h3"><a href="/blog/${p.slug}">${esc(p.title)}</a></h2>
            <p>${esc(p.summary)}</p>
            <a class="text-link" href="/blog/${p.slug}" aria-label="Read ${esc(p.title)}">Read article ${icon('arrowRight')}</a>
          </article>`
        )
        .join('')}</div>`
    : `<div class="card empty-state">
        <span class="card-icon card-icon-lg">${icon('fileText')}</span>
        <h2>No articles yet</h2>
        <p>We have not published any articles yet. When we do, they will appear here.</p>
        <a class="btn btn-outline" href="${mailto('Blog: topic suggestion')}">${icon('mail')} Suggest a topic</a>
      </div>`;

  const index = {
    path: '/blog',
    title: 'Blog',
    description: `News and articles from ${site.legalName} about engineering, products and technology from Kenya.`,
    body: `
${pageHero({
  eyebrow: 'Insights',
  title: 'The Avaru Tech blog',
  lead: 'Thoughts on engineering, products and technology from Kenya.',
})}
<section class="section container">${listing}</section>
`,
  };

  const articles = sorted.map((p) => ({
    path: `/blog/${p.slug}`,
    title: p.title,
    description: p.summary,
    lastmod: p.date,
    body: `
<article class="container article">
  <p class="eyebrow"><a href="/blog">Blog</a></p>
  <h1>${esc(p.title)}</h1>
  <p class="article-meta"><time datetime="${p.date}">${fmt(p.date)}</time>${p.author ? ` · ${esc(p.author)}` : ''}</p>
  <div class="prose">${p.html}</div>
  <p><a class="text-link" href="/blog">Back to the blog ${icon('arrowRight')}</a></p>
</article>
`,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: p.title,
        datePublished: p.date,
        author: { '@type': 'Organization', name: p.author || site.legalName },
        publisher: { '@type': 'Organization', name: site.legalName },
        mainEntityOfPage: `${site.url}/blog/${p.slug}`,
      },
    ],
  }));

  return [index, ...articles];
}
