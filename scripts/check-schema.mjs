// Validate the JSON-LD on every built page. Run after `npm run build`: npm run check:schema
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';

const BASE = 'https://www.sheknowsdigital.com';
const PERSON = 'https://www.magstags.com/mags-sikora/#person';
const SITE_IDS = [`${BASE}/#organization`, `${BASE}/#website`, PERSON];
const PAGE_TYPES = ['WebPage', 'ProfilePage', 'ContactPage', 'CollectionPage'];

const pages = [];
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => {
  const f = path.join(d, e.name);
  if (e.isDirectory()) walk(f); else if (e.name === 'index.html') pages.push(f);
});
walk('dist');
const fileFor = (url) => {
  const p = decodeURI(url.slice(BASE.length).split('#')[0].split('?')[0]);
  const f = path.join('dist', p);
  return fs.existsSync(f) && fs.statSync(f).isFile() ? f : fs.existsSync(path.join(f, 'index.html')) ? path.join(f, 'index.html') : null;
};

let fail = 0;
const defined = new Set();
const typeCount = {};
const report = [];
for (const file of pages.sort()) {
  const rel = '/' + path.relative('dist', path.dirname(file)).replace(/\\/g, '/');
  const url = BASE + (rel === '/' ? '/' : rel + '/');
  const bad = (m) => { fail++; console.log(`FAIL ${url.slice(BASE.length)}: ${m}`); };
  const doc = parse(fs.readFileSync(file, 'utf8'));
  const blocks = doc.querySelectorAll('script[type="application/ld+json"]');
  if (blocks.length !== 1) { bad(`${blocks.length} JSON-LD blocks (expected 1)`); continue; }
  let data;
  try { data = JSON.parse(blocks[0].text); } catch (e) { bad('JSON does not parse: ' + e.message); continue; }
  if (data['@context'] !== 'https://schema.org') bad('wrong @context');
  const nodes = data['@graph'] ?? [];
  const ids = nodes.map((n) => n['@id']).filter(Boolean);
  if (new Set(ids).size !== ids.length) bad('duplicate @id in graph');
  ids.forEach((i) => defined.add(i));
  report.push([url.slice(BASE.length), nodes.map((n) => n['@type']).join(', ')]);
  nodes.forEach((n) => (typeCount[n['@type']] = (typeCount[n['@type']] || 0) + 1));

  // Generic checks on every value in the graph.
  const visit = (v, key, top) => {
    if (v === null || v === '' || (Array.isArray(v) && v.length === 0)) bad(`empty value at ${key}`);
    else if (Array.isArray(v)) v.forEach((x) => visit(x, key, false));
    else if (typeof v === 'object') {
      const keys = Object.keys(v);
      if (!top && keys.length === 1 && keys[0] === '@id' && !ids.includes(v['@id']) && !SITE_IDS.includes(v['@id'])) bad(`reference to undefined @id ${v['@id']}`);
      if (!v['@type'] && !(keys.length === 1 && keys[0] === '@id')) bad(`object without @type at ${key}`);
      for (const k of keys) visit(v[k], k, false);
    } else if (typeof v === 'string' && ['url', 'item', 'image', 'primaryImageOfPage', '@id'].includes(key)) {
      if (!/^https:\/\//.test(v)) bad(`${key} is not an absolute https URL: ${v}`);
      else if (v.startsWith(BASE + '/') && !fileFor(v)) bad(`${key} points at a URL that is not in the build: ${v}`);
    }
  };
  nodes.forEach((n) => visit(n, n['@type'], true));

  const page = nodes.find((n) => PAGE_TYPES.includes(n['@type']));
  if (!page) bad('no WebPage node');
  else {
    if (page.url !== url) bad(`WebPage url ${page.url}`);
    if (page.url !== doc.querySelector('link[rel=canonical]')?.getAttribute('href')) bad('WebPage url differs from canonical');
    if (page.name !== doc.querySelector('title')?.text) bad('WebPage name differs from <title>');
    if (page.isPartOf?.['@id'] !== `${BASE}/#website`) bad('WebPage not linked to WebSite');
  }
  const crumbs = nodes.find((n) => n['@type'] === 'BreadcrumbList');
  if (rel !== '/') {
    if (!crumbs) bad('no BreadcrumbList');
    else {
      const items = crumbs.itemListElement;
      items.forEach((it, i) => { if (it.position !== i + 1 || !it.name || !it.item) bad(`breadcrumb item ${i + 1} malformed`); });
      if (items[0].item !== `${BASE}/`) bad('breadcrumb does not start at Home');
      if (items.at(-1).item !== url) bad('breadcrumb does not end at this page');
    }
  }
  for (const n of nodes) {
    const need = (...props) => props.forEach((p) => { if (n[p] === undefined) bad(`${n['@type']} missing ${p}`); });
    if (n['@type'] === 'BlogPosting') {
      need('headline', 'image', 'datePublished', 'dateModified', 'author', 'publisher', 'mainEntityOfPage');
      if ((n.headline || '').length > 110) bad(`headline is ${n.headline.length} characters (Google truncates at 110)`);
      const [p, m] = [Date.parse(n.datePublished), Date.parse(n.dateModified)];
      if (Number.isNaN(p) || Number.isNaN(m) || m < p) bad('invalid or inverted dates');
      if (!n.author?.name || !n.author?.url) bad('author needs name and url');
      if (n.author?.['@id'] !== PERSON) bad('author is not the shared Person @id');
    }
    if (n['@type'] === 'Organization' && n['@id']) {
      need('name', 'url', 'logo', 'founder', 'sameAs');
      if (!(n.logo?.width >= 112 && n.logo?.height >= 112)) bad('logo is smaller than 112x112');
    }
    if (n['@type'] === 'Person' && n['@id'] !== PERSON) bad(`unexpected Person @id ${n['@id']}`);
    if (n['@type'] === 'Person') need('name', 'url', 'sameAs');
    if (n['@type'] === 'ProfilePage' && n.mainEntity?.['@id'] !== PERSON) bad('ProfilePage mainEntity is not the Person');
    if (n['@type'] === 'ProfessionalService') need('name', 'url', 'description', 'hasOfferCatalog');
    if (n['@type'] === 'WebSite') need('name', 'url', 'publisher');
  }
}
for (const id of SITE_IDS) if (!defined.has(id)) { fail++; console.log(`FAIL site-level @id is never defined: ${id}`); }

if (process.argv.includes('--list')) report.forEach(([p, t]) => console.log(p.padEnd(72), t));
console.log(`${pages.length} pages checked | ${Object.entries(typeCount).map(([t, c]) => `${t} ${c}`).join(', ')}`);
console.log(`${fail} failures`);
process.exit(fail ? 1 : 0);
