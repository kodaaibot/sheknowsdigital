// One-off migration: wp-export/api/posts.json -> src/content/posts/*.md
// Run from the repo root: node scripts/convert-posts.mjs
import fs from 'node:fs';
import TurndownService from 'turndown';

const BASE = 'https://www.sheknowsdigital.com';
const posts = JSON.parse(fs.readFileSync('wp-export/api/posts.json', 'utf8'));
const cats = Object.fromEntries(JSON.parse(fs.readFileSync('wp-export/api/categories.json', 'utf8')).map((c) => [c.id, c]));
const media = Object.fromEntries(JSON.parse(fs.readFileSync('wp-export/api/media.json', 'utf8')).map((m) => [m.id, m]));

const decode = (s) =>
  s.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&nbsp;/g, ' ').replace(/&hellip;/g, '…');
const strip = (s) => decode(s.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
const local = (u) => u.replace(/^https?:\/\/(www\.)?sheknowsdigital\.com/, '');

const snapshotMeta = (link) => {
  const slug = link.slice(BASE.length + 1).replace(/\/$/, '').replace(/\//g, '__') || 'index';
  const html = fs.readFileSync(`wp-export/html/${slug}.html`, 'utf8');
  const get = (re) => { const m = html.match(re); return m ? decode(m[1].trim()) : ''; };
  return {
    titleTag: get(/<title[^>]*>([\s\S]*?)<\/title>/i),
    description: get(/<meta name="description" content="([\s\S]*?)"/i),
    ogImage: get(/<meta property="og:image" content="([\s\S]*?)"/i),
  };
};

const td = new TurndownService({ headingStyle: 'atx', bulletListMarker: '-', codeBlockStyle: 'fenced', emDelimiter: '*' });
td.keep(['iframe', 'table', 'figure']);
td.addRule('img', {
  filter: 'img',
  replacement: (_, node) => {
    const src = local(node.getAttribute('src') || '');
    const alt = (node.getAttribute('alt') || '').replace(/[\[\]]/g, '');
    return src ? `![${alt}](${src})` : '';
  },
});

const yaml = (o) => Object.entries(o).filter(([, v]) => v !== '' && v !== undefined)
  .map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join('\n');

let broken = 0;
for (const p of posts) {
  const meta = snapshotMeta(p.link);
  let html = p.content.rendered;
  // Eight 2015-16 posts render an old Elementor homepage layout instead of the article
  // (the article body is not exposed by WordPress). Publish the excerpt until the text is recovered.
  const needsContent = html.includes('data-elementor-type');
  if (needsContent) { html = p.excerpt.rendered.replace(/\s*\[&hellip;\]|\s*\[…\]/g, '…'); broken++; }
  html = html
    .replace(/<(script|style|noscript)[\s\S]*?<\/\1>/gi, '')
    .replace(/(href|src)="https?:\/\/(www\.)?sheknowsdigital\.com(\/[^"]*)?"/g, (_, a, __, path) => `${a}="${path || '/'}"`)
    .replace(/\s(srcset|sizes|decoding|fetchpriority|loading)="[^"]*"/g, '');
  const fm = media[p.featured_media];
  const front = {
    title: decode(p.title.rendered),
    titleTag: meta.titleTag,
    description: meta.description,
    excerpt: strip(p.excerpt.rendered).replace(/\s*\[…\]$/, '…'),
    date: p.date,
    modified: p.modified,
    categories: p.categories.map((id) => cats[id]?.slug).filter(Boolean),
    featuredImage: fm ? local(fm.source_url) : '',
    featuredImageAlt: fm?.alt_text || '',
    ogImage: meta.ogImage,
    needsContent: needsContent || undefined,
  };
  const body = td.turndown(html).replace(/\\?\[separator[^\]]*\\?\]/g, "").replace(/\n{3,}/g, '\n\n').replace(/\]\(\/seo-ebook\)/g, "](/seo-ebook/)");
  fs.writeFileSync(`src/content/posts/${p.slug}.md`, `---\n${yaml(front)}\n---\n\n${body}\n`);
}
console.log(`${posts.length} posts written, ${broken} flagged needsContent`);
