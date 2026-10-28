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
public/brand/          Official logo and the files made from it (see Brand and logo)
scripts/serve.mjs      Local preview server
scripts/check.mjs      Automated checks
scripts/brand/         Extraction and verification of the endorsement mark (Python)
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

## Brand and logo

The official Avaru logo is `public/brand/avaru-logo-official.png`, an exact,
unmodified copy of the file approved by the company (1024×1024). It is the
single source of truth. Every other logo file below is made from it by
resizing or by trimming empty background only. Never recreate the logo in
text, CSS or SVG, recolour it, stretch it, or use an alternative logo without
written approval.

| File | Made from the official logo | Used for |
|---|---|---|
| `public/brand/avaru-logo-official.png` | Original, byte-for-byte | Master file for all channels |
| `public/brand/avaru-logo-lockup.png` | Empty margin trimmed, 334×240 | Header and footer (`src/layout.mjs`) |
| `public/logo.png` | Resized to 512×512 | Google structured data (`src/pages/home.mjs`) |
| `public/apple-touch-icon.png` | Resized to 180×180 | iPhone/iPad home-screen icon |
| `public/og-image.png` | Placed, unchanged, on its own background colour (#101823), 1200×630, with the tagline below as separate text in Inter SemiBold | Link previews (WhatsApp, LinkedIn, X) |
| `public/favicon.ico`, `public/favicon-32.png`, `public/brand/avaru-icon-256.png` | The "A" mark cropped from the official logo | Browser tab icons (the full logo is unreadable at 16–48 px) |
| `public/brand/avaru-mark-white.png` | The "A" extracted by `scripts/brand/derive-mark.py`: white artwork on transparent, 398×285, keyline and glow left out (see Endorsement mark) | "Powered by Avaru" endorsement on the Products page |

Icon and social-image links carry a version (`?v=2`, social image `?v=3`) so browsers and social networks fetch
the new files instead of cached old ones. If a logo file changes again, bump
the number in `src/layout.mjs` and `src/pages/home.mjs`.
`npm run check` fails if a page is missing the official logo or still
references the old placeholder.

### Endorsement mark ("Powered by Avaru")

Avaru is the parent company of its products. Each product keeps its own name
and identity and is endorsed with the Avaru "A" and the words "Powered by
Avaru". On this website the endorsement appears once at the foot of each of the
five product cards on `/products` (AdLease, Zubari, AeroVault, AutoEar, The
Haven). It is not used on the home page, in the header or footer (they show the
full official logo), or for Avaru Core and Avaru Nexus.

**Usage rules:** `endorsement()` in `src/layout.mjs`. The mark is 24 px tall
(never under 20 px, where the swoosh tip and inner opening blur), with clear
space of at least half its height, on dark backgrounds only. "Powered by Avaru"
is live text in Inter, never part of the image. The mark stays sharp up to
about 140 px tall on standard screens (94 px on 3× phone screens); larger uses,
print and app splash screens need the original vector artwork, which is not in
this repository. Do not trace or vectorise the PNG.

**How the mark is made.** `scripts/brand/derive-mark.py` extracts the "A" from
the master. It never draws, traces, resizes, reshapes or recolours it:

```bash
python3 scripts/brand/derive-mark.py          # extract, save, verify (needs Pillow + NumPy)
python3 scripts/brand/derive-mark.py --check  # verify the committed file only
```

The master contains white artwork, a navy background, a near-black **keyline**
1–2 px wide around the artwork edges (broken in places), and a faint **glow** in
the navy just outside the keyline. By the founder's decision (28 Oct 2026) the
mark keeps the white artwork and leaves out the keyline and the glow. **The
mark therefore does not reproduce every pixel of the master.**

**Verification results** (28 Oct 2026, master SHA-256
`9031557c5f24f9a9b58d49cff211357a28143b589d70ca2b2b619d7d0a31ab47`). The script
first checks its own extraction, then separately re-reads the saved PNG and
compares it with the master alone:

| Check | Result | Limit |
|---|---|---|
| Master fingerprint (full SHA-256) | matches | must match |
| Mark found in the master by search | x 320, y 248 (398×285 crop) | must match reported position |
| White-artwork outline (50%) vs master | 0 of 38,234 artwork pixels differ | 0 |
| Master pixels certainly ≥50% white but not opaque in mark | 0 | 0 |
| Master pixels certainly <50% white but opaque in mark | 0 | 0 |
| Retained pixels outside the keyline / on the keyline | 0 / 0 | 0 |
| Detached faint pixels ("ghost rim") | 0 | 0 |
| Kept edge pixels off their measured opacity | 0 of 5,294 | 0 |
| Fully opaque pixels: least white in the master | 97.4% | ≥ 95% |
| Opaque pixel colour vs master | max 7/255, mean 1.06 | ≤ 24/255 |
| Dropped pixels outside the keyline: most white | 10.8% (4,738 px) | ≤ 11% (exception, below) |
| Other dropped background: most white | 3.3% | ≤ 5% |
| Pixels with evidence both ways (see below) | 18 (1.09% of outline) | ≤ 1.5% (exception, below) |

Reported, not pass/fail: the mark placed on navy differs from the master by up
to 35/255 where the keyline was removed (2,043 keyline pixels) and up to
31/255 on edge pixels, because those pixels were keyline or glow in the master.
2,081 very dark edge pixels (within background noise of navy or darker) are
dropped; one pixel this dark cannot be read reliably, and could hold up to
10.3% white.

**Limitations and approved exceptions**

- An edge pixel is part white and part dark, and the dark part may be keyline
  or navy. Brightness alone cannot always tell which; 49 outline pixels are
  undecidable that way. The script resolves them from neighbouring pixels (the
  keyline is continuous): 48 touch the keyline, 1 touches only navy.
- 18 of those touch **both** keyline and navy, where the keyline is broken. They
  are read as keyline. Their opacity is uncertain by at most 14/255, and each
  could fall on either side of the 50% outline. Positions (x, y in the master):
  (410,530) (422,512) (424,347) (432,498) (439,489) (441,402) (442,415)
  (444,483) (454,379) (456,404) (467,272) (486,322) (495,252) (495,433)
  (551,266) (552,267) (571,297) (649,436). The limit for these was raised from
  0.5% to 1.5% of the outline with the founder's approval.
- Pixels outside the keyline are treated as background, including the faint
  glow. Read as navy + white, the glow reaches 10.8% white, so the limit for
  pixels within 2 px of the keyline was raised from 5% to 11% with the
  founder's approval. All other background keeps the 5% limit.
- At the 24 px endorsement size, one master pixel is about one twelfth of a
  screen pixel, so none of the above is visible on the website.

`npm run check` fails if the master's fingerprint changes, if a product card is
missing the endorsement, or if the endorsement appears anywhere else.

### Tagline

The official tagline is **"The Power Behind Everyday Innovation"**. It lives
in one place, `tagline` in `src/site.mjs`, which feeds the home page heading,
the home page title and the footer. It is also set as text (not part of the
logo artwork) in `public/og-image.png`; if the tagline changes, regenerate
that image and bump its `?v=` number in `src/layout.mjs`.

### Typography

Fonts are loaded from Google Fonts in `src/layout.mjs` and set through CSS
variables at the top of `public/assets/styles.css`:

- `--font-heading`: **Manrope** (600, 700) for headings
- `--font-body`: **Inter** (400–700) for body text, navigation, buttons and footer
- `--tracking-caps`: letter spacing for small uppercase labels

Use these variables rather than naming fonts in individual rules. The logo
artwork keeps its own lettering; never retype it in a website font.

## Deployment (Vercel)

Vercel reads `vercel.json`:

- Build command: `node build.mjs`
- Output directory: `dist`
- Install command: none (no dependencies)
- Clean URLs: a rewrite serves `about.html` at `/about`, and `/about.html` redirects to `/about`
  (the built-in `cleanUrls` option is off so the Gemini file below can keep its `.html` URL)
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
files and are kept unchanged.

- `gemini-code-1788439996424.html` is copied byte-for-byte into the published
  site and stays reachable at `/gemini-code-1788439996424.html`. It is the
  earlier single-file version of the site and loads React, Babel, Tailwind and
  Lucide from CDNs, so `vercel.json` gives that one URL its own, looser
  Content-Security-Policy. It is also sent with `X-Robots-Tag: noindex` so its
  outdated content does not appear in search results, and it is left out of the
  sitemap. `build.mjs` (`PASSTHROUGH`) and `scripts/check.mjs` list it.
- `CNAME` is only used by GitHub Pages, which is not enabled. Vercel ignores it,
  so it stays in the repository but is not published. Its current value,
  `avaru.tech.com`, is not a domain you can register (it would be a subdomain of
  `tech.com`).
