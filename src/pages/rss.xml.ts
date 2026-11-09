import type { APIRoute } from 'astro';
import { getPosts, SITE } from '../lib/site';

const esc = (s = '') => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const GET: APIRoute = async () => {
  const posts = await getPosts();
  const items = posts
    .map((p) => `    <item><title>${esc(p.data.title)}</title><link>${SITE.url}/${p.id}/</link><guid>${SITE.url}/${p.id}/</guid><pubDate>${p.data.date.toUTCString()}</pubDate><description>${esc(p.data.excerpt)}</description></item>`)
    .join('\n');
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel>\n    <title>She Knows Digital</title><link>${SITE.url}/</link><description>SEO resources from Mags Sikora</description><language>en-GB</language>\n${items}\n</channel></rss>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
