// Rewrites third-party <iframe>s in post Markdown so they only load after cookie consent.
// The address moves to data-consent-src and a placeholder explains what will load; public/consent.js
// swaps it back in once the visitor allows embedded content. Safe to re-run: converted iframes are skipped.
// Usage: node scripts/consent-embeds.mjs
import fs from 'node:fs';
import path from 'node:path';

const DIR = 'src/content/posts';
const PROVIDERS = [
  [/youtube(-nocookie)?\.com|youtu\.be/, 'YouTube', 'video'],
  [/slideshare\.net/, 'SlideShare', 'presentation'],
  [/giphy\.com/, 'Giphy', 'animation'],
];
const attr = (tag, name) => tag.match(new RegExp(`\\s${name}="([^"]*)"`, 'i'))?.[1];
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

let total = 0;
for (const file of fs.readdirSync(DIR).filter((f) => f.endsWith('.md'))) {
  const p = path.join(DIR, file);
  const before = fs.readFileSync(p, 'utf8');
  const after = before.replace(/<iframe\b[^>]*\ssrc="([^"]+)"[^>]*>\s*<\/iframe>/gi, (tag, raw) => {
    const src = raw.startsWith('//') ? `https:${raw}` : raw;
    const host = new URL(src).hostname;
    const [, name, kind] = PROVIDERS.find(([re]) => re.test(host)) ?? [null, host.replace(/^www\./, ''), 'content'];
    const width = parseInt(attr(tag, 'width') ?? '', 10) || 560;
    const height = parseInt(attr(tag, 'height') ?? '', 10) || 315;
    const open = name === 'YouTube' ? src.replace(/\/embed\/([^?]+).*/, '/watch?v=$1') : src;
    total++;
    return `<div class="consent-embed" data-provider="${name}" style="aspect-ratio: ${width} / ${height}"><div class="consent-embed-note"><p>This ${kind} is hosted by ${name}, which sets its own cookies.</p><button type="button" data-consent-load>Allow embedded content</button><a href="${esc(open)}" rel="noopener nofollow" target="_blank">Open on ${name}</a></div><iframe data-consent-src="${esc(src)}" title="${name} ${kind}" width="${width}" height="${height}" loading="lazy" allowfullscreen hidden></iframe></div>`;
  });
  if (after !== before) fs.writeFileSync(p, after);
}
console.log(`${total} iframe(s) converted`);
