# sheknowsdigital.com

Rebuild of www.sheknowsdigital.com off WordPress (Elementor + All in One SEO) as a static site.
This is Mags Sikora's own consultancy site. Keep it separate from client work and from her other projects.

## State

- Stack and host: NOT DECIDED YET (static HTML on Netlify, or Astro). Do not scaffold a framework until Mags confirms.
- The live domain still points at WordPress. Do not ask for DNS changes until the new build has passed a parity check on a preview URL.

## Repo layout

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
