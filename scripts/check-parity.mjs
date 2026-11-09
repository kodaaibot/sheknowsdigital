// Compare the built site (dist/) with the WordPress snapshot (content/inventory.csv).
// Run after `npm run build`: npm run check:parity
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';

const BASE = 'https://www.sheknowsdigital.com';
const rows = fs.readFileSync('content/inventory.csv', 'utf8').trim().split(/\r?\n/);
const header = rows.shift().split(',');
const csv = (line) => { const out = []; let cur = '', q = false; for (let i = 0; i < line.length; i++) { const c = line[i]; if (q) { if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; } else if (c === '"') q = false; else cur += c; } else if (c === '"') q = true; else if (c === ',') { out.push(cur); cur = ''; } else cur += c; } out.push(cur); return out; };
// Re-join rows broken by newlines inside quoted fields.
const lines = []; let buf = '';
for (const r of rows) { buf = buf ? buf + '\n' + r : r; if ((buf.match(/"/g) || []).length % 2 === 0) { lines.push(buf); buf = ''; } }
const inv = lines.map((l) => Object.fromEntries(csv(l).map((v, i) => [header[i], v])));

const norm = (s) => (s || '').replace(/\s+/g, ' ').trim();
let fail = 0;
const bad = (msg) => { fail++; console.log('FAIL', msg); };
const files = new Set();
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : files.add('/' + path.relative('dist', path.join(d, e.name)))));
walk('dist');
const exists = (p) => { p = decodeURI(p.split('#')[0].split('?')[0]); return files.has(p) || files.has(p.replace(/\/?$/, '/index.html')); };

for (const r of inv) {
  const f = path.join('dist', r.path, 'index.html');
  if (!fs.existsSync(f)) { bad(`${r.path} missing`); continue; }
  const doc = parse(fs.readFileSync(f, 'utf8'));
  const meta = (sel, attr = 'content') => doc.querySelector(sel)?.getAttribute(attr) || '';
  const title = norm(doc.querySelector('title')?.text);
  if (title !== norm(r.title_tag)) bad(`${r.path} title: "${title}" vs "${r.title_tag}"`);
  if (norm(meta('meta[name=description]')) !== norm(r.meta_description)) bad(`${r.path} meta description differs`);
  if (meta('link[rel=canonical]', 'href') !== r.url) bad(`${r.path} canonical ${meta('link[rel=canonical]', 'href')}`);
  const wasNoindex = r.robots.includes('noindex'), isNoindex = meta('meta[name=robots]').includes('noindex');
  if (wasNoindex !== isNoindex) bad(`${r.path} robots changed`);
  if (doc.querySelectorAll('h1').length !== 1) bad(`${r.path} has ${doc.querySelectorAll('h1').length} h1`);
}

// Every internal link, image and asset in the build must resolve.
const redirects = fs.readFileSync('public/_redirects', 'utf8');
for (const f of [...files].filter((x) => x.endsWith('.html'))) {
  const doc = parse(fs.readFileSync('dist' + f, 'utf8'));
  for (const el of doc.querySelectorAll('[href],[src]')) {
    let u = el.getAttribute('href') ?? el.getAttribute('src');
    if (u.startsWith(BASE)) u = u.slice(BASE.length) || '/';
    if (!u.startsWith('/') || u.startsWith('//')) continue;
    if (el.tagName === 'LINK' && el.getAttribute('rel') === 'canonical') continue;
    if (!exists(u)) bad(`${f}: broken ${el.tagName.toLowerCase()} -> ${u}`);
    if (el.tagName === 'A' && !u.includes('.') && !u.split('#')[0].endsWith('/')) bad(`${f}: link without trailing slash -> ${u}`);
  }
}
const sm = fs.readFileSync('dist/sitemap.xml', 'utf8').match(/<loc>[^<]+/g).map((x) => x.slice(5));
const want = inv.filter((r) => !r.robots.includes('noindex')).map((r) => r.url);
for (const u of want) if (!sm.includes(u)) bad(`sitemap missing ${u}`);
for (const u of sm) if (!want.includes(u)) bad(`sitemap extra ${u}`);

console.log(`${inv.length} URLs checked, ${sm.length} in sitemap, ${fail} failures`);
process.exit(fail ? 1 : 0);
