# sheknowsdigital.com

Rebuild of www.sheknowsdigital.com off WordPress (Elementor + All in One SEO) as a static site.
This is Mags Sikora's own consultancy site. Keep it separate from client work and from her other projects.

## State

- Stack: Astro (static output), hosted on Netlify's free plan. Forms use Netlify Forms.
- The live domain still points at WordPress. Do not ask for DNS changes until the build has been checked on a Netlify preview URL.
- Open before launch:
  - Eight 2015-16 posts are marked `needsContent: true`. On WordPress they render an old homepage layout instead of the article, so only the excerpt could be exported. The full text needs recovering (WordPress admin export or revisions) and pasting into the Markdown files.
  - The checklist and ebook forms only collect signups in Netlify. Nothing emails the subscriber or delivers the PDF until an email tool is connected, although `/thank-you/` tells people to check their inbox.
  - `/cookie-policy/` has a heading and no body, as on WordPress, and there is no privacy policy page although the forms collect names and emails.
  - `/terms-and-conditions/` was drafted on 2026-11-09 and has not had legal review.
  - Netlify dashboard settings that cannot be set from the repo: form detection must be enabled, and the email notification for form submissions must be added under Forms.
- Forms use Netlify's reCAPTCHA (`data-netlify-recaptcha`) plus a honeypot field.

## Design

`main` carries the design Mags chose: her Lovable "sheknowsdigital" project (Fraunces display type, Manrope text, warm paper ground, forest green, clay accent), merged from `theme-refresh` on 2026-11-09. The faithful port of the old WordPress look is preserved at commit `b62eec2`.

- `/` (`src/pages/index.astro`) is a like-for-like rebuild of the Lovable homepage, copy included. Its three "field notes" cards are the design's placeholder articles and are not links: those articles are not written yet.
- `/services/` and `/audit/` (interactive health check, weights and score bands copied from the design) are new pages that did not exist on WordPress.
- `/about/` and `/contact/` use the Lovable pages. `/about/` also keeps the original WordPress story under "How it started" so no content is lost.
- `/blog/` is "Field Notes": the Lovable layout filled with the 24 real posts, with the real categories as filter links.
- Home, About, Contact and Blog use the Lovable title tags and meta descriptions. The checklist page's meta description also changed. These five are the only deliberate metadata changes and are listed as `RETITLED` in `scripts/check-parity.mjs`.
- Autotrader must not appear anywhere on the site (Mags' instruction, Nov 2026). The homepage "Experience with" strip uses the brand logos from `public/wp-content/uploads/2022/02/`.
- The About page career trail is Mags' own copy. Do not rewrite it.
- Design tokens are at the top of `src/styles/global.css`.

## Structured data

Defined in `src/lib/schema.ts`, following the pattern on magstags.com.

- The Person entity is `https://www.magstags.com/mags-sikora/#person`. It is the same @id on both sites: never mint a second Person @id on this domain. If the Person node changes on magstags.com, mirror the change in `schema.ts`.
- Homepage: full `Organization` (`/#organization`), a short `Person` node and `WebSite` (`/#website`).
- `/about/`: full `Person`, `BreadcrumbList` and `ProfilePage` whose `mainEntity` is the Person @id.
- Posts: `BlogPosting` with `author` pointing at the Person @id and `publisher` at the Organization @id, plus `BreadcrumbList`.
- Other pages carry no JSON-LD yet.
- The Organization `logo` is the 190x32 wordmark from WordPress, which is below Google's 112x112 minimum. Replace it when a square logo exists.

## Commands

- `npm run dev` : local dev server
- `npm run build` : build to `dist/`
- `npm run check:parity` : after a build, compares every URL's title, meta description, canonical, robots and H1 count with `content/inventory.csv`, checks every internal link and image resolves, and checks the sitemap. Must report 0 failures before any deploy.

## Repo layout

- `src/content/posts/*.md` : the 24 blog posts. File name = URL slug. To publish a post, add a Markdown file here with the same front matter.
- `src/pages/` : one file per page. `[slug].astro` is the post template, `category/[category].astro` the category archive.
- `src/layouts/Base.astro` : head, SEO tags, JSON-LD, header and footer. `src/styles/global.css` : all styles.
- `public/_redirects` : 301s for retired WordPress URLs (pagination, feeds, old sitemaps, author archive).

- `wp-export/` : raw snapshot of the WordPress site taken 2026-11-09. Read-only reference. `api/` is the REST API JSON, `html/` is the rendered HTML of every URL (the source of truth for current design, title tags, meta and JSON-LD), `sitemaps/` and `robots.txt` as served.
- `content/` : generated from `wp-export/` by `python3 scripts/build_inventory.py`. One file per page/post (front matter + body HTML) and `inventory.csv` (URL, title tag, meta description, H1, canonical, robots, dates, categories).
- `public/wp-content/uploads/` : every media file referenced by the live site, at its original path, so existing image and PDF URLs keep working without redirects.

## Migration rules

- Every URL in `content/inventory.csv` must exist on the new site at the identical path, with trailing slash, on `https://www.sheknowsdigital.com` (www is canonical).
- Posts live at the root (`/slug/`), not under `/blog/`. Category archives are `/category/<slug>/`.
- Carry over title tags, meta descriptions and canonicals unchanged at launch. Content rewrites come after the platform move, not with it.
- `/disclaimer/` is noindex today and is not in the XML sitemap. Keep that.
- Forms to replace: contact (`/contact/`), SEO checklist signup (`/seo-checklist-blog-post-writing/`, leads to `/thank-you/` and the checklist PDF), ebook signup (`/seo-ebook/`). All are Elementor forms today.
- Pages built in Elementor have noisy body HTML. Rebuild their layout from the `wp-export/html/` snapshot instead of reusing the markup.

## Writing

British English. No em dashes.
