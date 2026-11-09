import type { APIRoute } from 'astro';
import { getPosts, SITE, CATEGORIES } from '../lib/site';

// Same URL set as the WordPress sitemap: every indexable page. /disclaimer/ is noindex and stays out.
const PAGES = ['/', '/about/', '/blog/', '/contact/', '/cookie-policy/', '/seo-checklist-blog-post-writing/', '/seo-ebook/', '/thank-you/'];

export const GET: APIRoute = async () => {
  const posts = await getPosts();
  const urls = [
    ...PAGES.map((p) => ({ loc: p })),
    ...posts.map((p) => ({ loc: `/${p.id}/`, lastmod: (p.data.modified ?? p.data.date).toISOString() })),
    ...Object.keys(CATEGORIES).map((c) => ({ loc: `/category/${c}/` })),
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `  <url><loc>${SITE.url}${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`)
    .join('\n')}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
