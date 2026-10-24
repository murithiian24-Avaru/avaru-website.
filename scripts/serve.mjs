// Local preview server for dist/. Mimics the routing in vercel.json:
//   1. redirects: /index.html -> /, and /<page>.html -> /<page> (except the
//      passthrough Gemini file, which is served at its exact .html URL)
//   2. trailing slashes are removed
//   3. real files are served as-is
//   4. extensionless paths are rewritten to <path>.html
//   5. anything else returns 404.html with status 404
// Headers from vercel.json are applied in order (later rules override earlier keys).
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const port = Number(process.env.PORT || 4173);
const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8',
};
const vercel = JSON.parse(await readFile(fileURLToPath(new URL('../vercel.json', import.meta.url)), 'utf8'));

// Supports the header source forms used in vercel.json: "/(.*)", "/dir/(.*)" and exact paths.
const headerRules = vercel.headers.map((r) => ({ re: new RegExp('^' + r.source.replace(/\./g, '\\.').replace('(\\.*)', '(.*)') + '$'), headers: r.headers }));
const PASSTHROUGH = /^\/gemini-code-1788439996424\.html$/;

async function isFile(p) {
  try { return (await stat(p)).isFile(); } catch { return false; }
}

createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const path = decodeURIComponent(url.pathname);
  for (const rule of headerRules) if (rule.re.test(path)) for (const h of rule.headers) res.setHeader(h.key, h.value);

  if (path === '/index.html') { res.writeHead(308, { Location: '/' }); return res.end(); }
  if (path.endsWith('.html') && !PASSTHROUGH.test(path) && /^\/[^.]+\.html$/.test(path)) {
    res.writeHead(308, { Location: path.slice(0, -5) + url.search }); return res.end();
  }
  if (path.length > 1 && path.endsWith('/')) {
    res.writeHead(308, { Location: path.replace(/\/+$/, '') + url.search }); return res.end();
  }
  const safe = normalize(path).replace(/^(\.\.[/\\])+/, '');
  const candidates = safe === '/' ? ['index.html'] : [safe.slice(1)];
  if (/^\/[^.]+$/.test(safe)) candidates.push(safe.slice(1) + '.html');
  for (const c of candidates) {
    const file = join(dist, c);
    if (file.startsWith(dist) && (await isFile(file))) {
      res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream' });
      return res.end(await readFile(file));
    }
  }
  res.writeHead(404, { 'Content-Type': types['.html'] });
  res.end(await readFile(join(dist, '404.html')));
}).listen(port, () => console.log(`Serving dist/ at http://localhost:${port}`));
