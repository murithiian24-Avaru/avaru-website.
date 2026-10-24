// Local preview server for dist/. Mimics the Vercel settings in vercel.json:
// clean URLs (/about serves about.html), .html URLs redirect to clean ones,
// trailing slashes are removed, and unknown paths return 404.html with status 404.
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
const globalHeaders = Object.fromEntries(vercel.headers[0].headers.map((h) => [h.key, h.value]));

async function isFile(p) {
  try { return (await stat(p)).isFile(); } catch { return false; }
}

createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  let path = decodeURIComponent(url.pathname);
  for (const [k, v] of Object.entries(globalHeaders)) res.setHeader(k, v);

  if (path.length > 1 && path.endsWith('/')) {
    res.writeHead(308, { Location: path.replace(/\/+$/, '') + url.search }); return res.end();
  }
  if (path.endsWith('.html')) {
    const clean = path === '/index.html' ? '/' : path.slice(0, -5);
    res.writeHead(308, { Location: clean + url.search }); return res.end();
  }
  const safe = normalize(path).replace(/^(\.\.[/\\])+/, '');
  const candidates = safe === '/' ? ['index.html'] : [safe.slice(1), safe.slice(1) + '.html'];
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
