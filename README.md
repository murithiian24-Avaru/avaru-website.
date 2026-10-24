# Avaru Tech Company Limited website

The corporate website for Avaru Tech Company Limited. It is a static site built
by a small Node.js script with **no npm dependencies**, and hosted on Vercel.

## Pages

| URL | Page |
|---|---|
| `/` | Home |
| `/about` | About us |
| `/products` | Our products (anchors: `#adlease`, `#zubari`, `#aerovault`, `#autoear`, `#the-haven`) |
| `/technology` | Technology & services |
| `/investors` | Investors & partners |
| `/careers` | Careers |
| `/blog` | Blog (a page per post at `/blog/<slug>`) |
| `/contact` | Contact |
| `/privacy` | Privacy policy |
| `/terms` | Terms & conditions (draft, under legal review) |
| any unknown URL | Custom 404 page |

## Requirements

- Node.js 20 or newer. Nothing to install: there is no `npm install` step.

## Commands

```bash
node build.mjs            # build the site into dist/
node scripts/check.mjs    # check links, anchors, metadata, sitemap, robots.txt, JSON-LD
node scripts/serve.mjs    # preview dist/ at http://localhost:4173 (behaves like Vercel)

npm run build             # same as node build.mjs
npm run check             # build + checks
npm run preview           # build + local server
```

Run `npm run check` before every push. It fails if any internal link or anchor
is broken, a page is missing a title, description, canonical URL or Open
Graph tags, or the sitemap does not match the pages.

## Project structure

```
build.mjs              Build script: renders every page into dist/
vercel.json            Vercel build settings, clean URLs and security headers
src/site.mjs           Verified company details (name, email, country, site URL)
src/products.mjs       Products and their status (in development / concept)
src/blog.mjs           Blog posts (empty until something is published)
src/layout.mjs         Shared page shell: <head>, header, footer, metadata
src/icons.mjs          Inline SVG icons
src/pages/*.mjs        One file per page
public/                Copied to dist/ as-is: CSS, JS, favicon, logo, social image
scripts/serve.mjs      Local preview server
scripts/check.mjs      Automated checks
CNAME, gemini-code-1788439996424.html   Original files, kept unchanged (see below)
```

## Editing content

- **Company details:** `src/site.mjs`. Only add facts the company has confirmed.
- **Product status:** `src/products.mjs`. Change a status only when there is
  evidence, for example when AdLease is actually live on Google Play.
- **Social media:** add verified profiles to `social` in `src/site.mjs`. They
  then appear in the footer and in the structured data. The list is empty on
  purpose until real accounts are confirmed.
- **Blog posts:** add an entry to `posts` in `src/blog.mjs` (an example is in
  the file). The page, the listing and the sitemap update automatically.
- **Contact:** the site has no forms. Every "email" link opens the visitor's
  email app, addressed to the official email with a pre-filled subject.
  Nothing is collected or stored by the website.

## Deployment (Vercel)

Vercel reads `vercel.json`:

- Build command: `node build.mjs`
- Output directory: `dist`
- Install command: none (no dependencies)
- Clean URLs: `/about` serves `about.html`, and `/about.html` redirects to `/about`
- Security headers: CSP, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` and others

Release process:

1. Work on a feature branch and push it. Vercel builds a **preview** deployment
   for the branch. Production is not affected.
2. Review the preview URL on desktop and mobile.
3. When approved, merge the branch into `main` (through a pull request on GitHub).
   Vercel then builds and publishes production.
4. To undo a release, use **Instant Rollback** on the previous production
   deployment in the Vercel dashboard, or revert the merge commit.

### Site URL and custom domain

Canonical URLs, Open Graph URLs, the sitemap and robots.txt use `SITE_URL`.
It defaults to `https://avaru-website.vercel.app`. When the custom domain is
live, set an environment variable in Vercel (Project → Settings →
Environment Variables) for **Production**:

```
SITE_URL=https://www.your-domain.example
```

Then redeploy. No code change is needed.

### Vercel Authentication

The Vercel project currently has **Vercel Authentication** turned on for all
deployments except custom domains. While that is on, visitors who are not
logged in to Vercel cannot see `*.vercel.app` URLs. A custom domain is public.
Decide whether to turn it off for production in Project → Settings →
Deployment Protection.

## Original files

`CNAME` and `gemini-code-1788439996424.html` are the repository's original
files and are kept unchanged. They are **not** copied into the published site:

- `CNAME` is only used by GitHub Pages, which is not enabled. Vercel ignores it.
- `gemini-code-1788439996424.html` is the earlier single-file version of the site.
  It contains outdated content (for example, wrong product statuses and contact
  details), so publishing it would contradict the new site.
