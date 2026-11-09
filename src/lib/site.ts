import { getCollection } from 'astro:content';

export const SITE = {
  name: 'SHE KNOWS DIGITAL',
  url: 'https://www.sheknowsdigital.com',
  author: 'Mags Sikora',
  defaultOgImage: 'https://www.sheknowsdigital.com/wp-content/uploads/2021/12/she-knows-digital-logo.png',
};

export const NAV = [
  { href: '/services/', label: 'Services' },
  { href: '/about/', label: 'About' },
  { href: '/audit/', label: 'Health Check' },
  { href: '/blog/', label: 'Field Notes' },
];

export const SERVICES = [
  ['Technical Audits', 'Survey the terrain before the climb', 'Crawl, rendering, indexation and Core Web Vitals diagnostics for catalogues of 100k to millions of URLs. You get a prioritised roadmap sized by revenue impact and effort, written so engineering teams can ship it.'],
  ['Large-scale Migrations', 'Expedition planning for replatforms', 'Platform, domain and headless migrations with full redirect mapping, pre-launch staging checks and close monitoring for the weeks after launch. The aim is simple: keep your rankings and revenue through the move.'],
  ['AI & Full-SERP Strategy', 'Read the weather, not just the map', 'Visibility across AI Overviews, LLM answers, Shopping, images and rich results. Structured data, product feeds and content built for how people search now, not how they searched five years ago.'],
  ['Information Architecture', 'Root systems that carry growth', "Category taxonomy, faceted navigation and internal linking matched to real search demand, so authority reaches the pages that drive revenue and crawl budget isn't wasted on filter pages."],
  ['Organic Growth Advisory', 'Tending what compounds', 'Ongoing senior support for in-house SEO and product teams: roadmaps, forecasting, board-level reporting and getting stakeholders on board. Steady, compounding gains instead of quick wins that fade.'],
];

// Slugs, names and title tags match the WordPress category archives.
export const CATEGORIES: Record<string, string> = {
  inspiration: 'Inspiration',
  resources: 'Resources',
  'seo-traffic': 'SEO & Traffic',
  'wordpress-seo': 'wordpress seo',
};

export async function getPosts() {
  const posts = await getCollection('posts');
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export const formatDate = (d: Date) =>
  d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
