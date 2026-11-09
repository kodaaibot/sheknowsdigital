// Structured data, built the same way as on magstags.com:
// one canonical Person entity (Mags' profile on magstags.com) that every site references by @id,
// a full Organization node on the homepage, and page-level nodes that link to both by @id.
import { SITE } from './site';

export const ORG_ID = `${SITE.url}/#organization`;
export const WEBSITE_ID = `${SITE.url}/#website`;
/** The Person entity defined on magstags.com/mags-sikora/. Keep this @id identical on both sites. */
export const PERSON_ID = 'https://www.magstags.com/mags-sikora/#person';
const PERSON_URL = 'https://www.magstags.com/mags-sikora/';

const PERSON_SAME_AS = [
  'https://www.linkedin.com/in/magdalenasikora/',
  'https://x.com/magssikora',
  'https://www.youtube.com/c/Sheknowsdigital',
  'https://www.sheknowsdigital.com/',
];

export const website = {
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: `${SITE.url}/`,
  name: 'She Knows Digital',
  alternateName: 'sheknowsdigital',
  description: 'Senior eCommerce SEO consulting by Mags Sikora: technical audits, migrations, AI and full-SERP strategy.',
  publisher: { '@type': 'Organization', '@id': ORG_ID },
  inLanguage: 'en-GB',
};

/** Full Organization node. Homepage only; other pages point to it by @id. */
export const organization = {
  '@type': 'Organization',
  '@id': ORG_ID,
  name: 'She Knows Digital',
  alternateName: 'sheknowsdigital',
  legalName: 'She Knows Digital Sp z o.o.',
  url: `${SITE.url}/`,
  logo: { '@type': 'ImageObject', url: `${SITE.url}/logo-512.png`, width: 512, height: 512 },
  image: `${SITE.url}/images/home/mags-sikora-about.webp`,
  description:
    'Independent eCommerce SEO consultancy led by Mags Sikora. Technical audits, large-scale migrations, AI and full-SERP strategy, information architecture and organic growth advisory for enterprise websites.',
  foundingDate: '2012',
  founder: { '@id': PERSON_ID },
  knowsAbout: [
    'E-commerce SEO',
    'Technical SEO audits',
    'Site migrations',
    'AI search and full-SERP strategy',
    'Information architecture',
    'Organic growth advisory',
  ],
  sameAs: [
    'https://www.youtube.com/c/Sheknowsdigital',
    'https://www.facebook.com/sheknowsdigital',
    'https://www.instagram.com/sheknowsdigital/',
  ],
};

/** Short Person node for pages that only need to name the entity (as on the magstags.com homepage). */
export const personStub = {
  '@type': 'Person',
  '@id': PERSON_ID,
  name: 'Mags Sikora',
  url: PERSON_URL,
  sameAs: PERSON_SAME_AS,
};

/** Full Person node, mirroring magstags.com/mags-sikora/. Used on the About page. */
export const person = {
  '@type': 'Person',
  '@id': PERSON_ID,
  name: 'Mags Sikora',
  alternateName: 'Magdalena Sikora',
  givenName: 'Magdalena',
  familyName: 'Sikora',
  url: PERSON_URL,
  image: 'https://www.magstags.com/mags-sikora/mags-sikora-seo-specialist-agentic-commerce.jpg',
  jobTitle: 'Senior SEO Consultant, SEO Director',
  description:
    'Senior SEO consultant with 18+ years leading enterprise search programmes across e-commerce, travel, and publishing. Founder of MagsTags. Currently at Intrepid Digital.',
  worksFor: [
    { '@type': 'Organization', name: 'Intrepid Digital' },
    { '@type': 'Organization', '@id': ORG_ID, name: 'She Knows Digital', url: `${SITE.url}/` },
  ],
  alumniOf: [
    { '@type': 'EducationalOrganization', name: 'Jagiellonian University', url: 'https://en.uj.edu.pl/' },
    { '@type': 'EducationalOrganization', name: 'HEC Liège', url: 'https://www.hec.uliege.be/' },
  ],
  hasCredential: {
    '@type': 'EducationalOccupationalCredential',
    credentialCategory: 'degree',
    educationalLevel: "Master's degree",
    name: 'MSc in Marketing and Management',
  },
  knowsAbout: [
    'Enterprise SEO',
    'Technical SEO migrations',
    'International SEO',
    'Hreflang strategy',
    'E-commerce SEO',
    'Structured data and schema markup',
    'Google Merchant Center',
    'AI-integrated search',
    'Pre-acquisition SEO due diligence',
  ],
  knowsLanguage: ['en', 'pl'],
  sameAs: PERSON_SAME_AS,
};

export type Crumb = [name: string, path: string];

/** Home > ...trail > current page. */
export const breadcrumb = (path: string, name: string, trail: Crumb[] = []) => ({
  '@type': 'BreadcrumbList',
  '@id': `${SITE.url}${path}#breadcrumb`,
  itemListElement: [['Home', '/'] as Crumb, ...trail, [name, path] as Crumb].map(([n, p], i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: n,
    item: `${SITE.url}${p}`,
  })),
});

/** The page-level node every page carries. `extra` can change @type (ProfilePage, ContactPage...) and add properties. */
export const webPage = (path: string, name: string, description: string | undefined, extra: Record<string, unknown> = {}) => ({
  '@type': 'WebPage',
  '@id': `${SITE.url}${path}#webpage`,
  url: `${SITE.url}${path}`,
  name,
  ...(description ? { description } : {}),
  isPartOf: { '@id': WEBSITE_ID },
  ...(path === '/' ? {} : { breadcrumb: { '@id': `${SITE.url}${path}#breadcrumb` } }),
  inLanguage: 'en-GB',
  ...extra,
});

export const itemList = (items: { name: string; path: string }[]) => ({
  '@type': 'ItemList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, url: `${SITE.url}${it.path}` })),
});

/** Services page, mirroring the ProfessionalService node on magstags.com/seo-services/. */
export const professionalService = (services: string[][]) => ({
  '@type': 'ProfessionalService',
  '@id': `${SITE.url}/services/#service`,
  name: 'She Knows Digital SEO Consulting',
  url: `${SITE.url}/services/`,
  image: `${SITE.url}/logo-512.png`,
  description:
    'Senior, hands-on SEO consulting for enterprise eCommerce: technical audits, large-scale migrations, AI and full-SERP strategy, information architecture and organic growth advisory.',
  areaServed: 'Worldwide',
  founder: { '@id': PERSON_ID },
  parentOrganization: { '@id': ORG_ID },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'SEO Consulting Services',
    itemListElement: services.map(([name, , description]) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name, description, provider: { '@id': PERSON_ID } },
    })),
  },
});
