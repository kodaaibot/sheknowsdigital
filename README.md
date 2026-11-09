# sheknowsdigital.com

Astro rebuild of www.sheknowsdigital.com, moving off WordPress. Deploys to Netlify (`npm run build`, publish `dist`).

- `wp-export/` : snapshot of the WordPress site (2026-11-09)
- `content/` : pages and posts extracted from the snapshot, plus `inventory.csv`
- `public/` : media files at their original `/wp-content/uploads/` paths
- `scripts/build_inventory.py` : regenerates `content/` from `wp-export/`

See `CLAUDE.md` for migration rules and current state.
