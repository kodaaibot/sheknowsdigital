import { getCollection } from 'astro:content';

export const SITE = {
  name: 'SHE KNOWS DIGITAL',
  url: 'https://www.sheknowsdigital.com',
  author: 'Mags Sikora',
  defaultOgImage: 'https://www.sheknowsdigital.com/wp-content/uploads/2021/12/she-knows-digital-logo.png',
};

export const NAV = [
  { href: '/about/', label: 'About' },
  { href: '/', label: 'Work with me' },
  { href: '/seo-checklist-blog-post-writing/', label: 'SEO Checklist' },
  { href: '/contact/', label: 'Contact' },
  { href: '/blog/', label: 'Blog' },
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
