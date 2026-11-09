#!/usr/bin/env python3
"""Build content/ and content/inventory.csv from the raw WordPress export in wp-export/.

Run from the repo root: python3 scripts/build_inventory.py
"""
import csv, html, json, re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
EXP = ROOT / "wp-export"
BASE = "https://www.sheknowsdigital.com/"


def snap(link):
    slug = link[len(BASE):].strip("/").replace("/", "__") or "index"
    p = EXP / "html" / f"{slug}.html"
    return p.read_text(encoding="utf-8", errors="replace") if p.exists() else ""


def first(pattern, text):
    m = re.search(pattern, text, re.I | re.S)
    return html.unescape(m.group(1).strip()) if m else ""


def meta(text):
    return {
        "title_tag": first(r"<title[^>]*>(.*?)</title>", text),
        "meta_description": first(r'<meta name="description" content="(.*?)"', text),
        "canonical": first(r'<link rel="canonical" href="(.*?)"', text),
        "robots": first(r'<meta name="robots" content="(.*?)"', text),
        "og_image": first(r'<meta property="og:image" content="(.*?)"', text),
        "h1": re.sub(r"<[^>]+>", "", first(r"<h1[^>]*>(.*?)</h1>", text)).strip(),
    }


def fm(d):
    out = ["---"]
    for k, v in d.items():
        out.append(f"{k}: {json.dumps(v, ensure_ascii=False)}")
    return "\n".join(out + ["---", ""])


cats = {c["id"]: c for c in json.loads((EXP / "api/categories.json").read_text())}
media = {m["id"]: m for m in json.loads((EXP / "api/media.json").read_text())}
rows = []

for kind in ("pages", "posts"):
    for it in json.loads((EXP / f"api/{kind}.json").read_text()):
        link = it["link"]
        m = meta(snap(link))
        fmedia = media.get(it.get("featured_media") or 0, {})
        d = {
            "url": link,
            "path": "/" + link[len(BASE):],
            "type": kind[:-1],
            "slug": it["slug"],
            "title": html.unescape(it["title"]["rendered"]),
            "date": it["date"],
            "modified": it["modified"],
            "categories": [html.unescape(cats[c]["name"]) for c in it.get("categories", []) if c in cats],
            "featured_image": fmedia.get("source_url", ""),
            "featured_image_alt": fmedia.get("alt_text", ""),
            **m,
        }
        body = it["content"]["rendered"]
        d["built_with_elementor"] = "elementor" in body
        name = it["slug"] or "index"
        if link == BASE:
            name = "index"
        (ROOT / "content" / kind / f"{name}.html").write_text(fm(d) + body, encoding="utf-8")
        rows.append(d)

for c in cats.values():
    if not c.get("count"):
        continue
    m = meta(snap(c["link"]))
    rows.append({"url": c["link"], "path": "/" + c["link"][len(BASE):], "type": "category",
                 "slug": c["slug"], "title": html.unescape(c["name"]), "date": "", "modified": "",
                 "categories": [], "featured_image": "", "featured_image_alt": "",
                 "built_with_elementor": False, **m})

cols = ["path", "type", "title", "title_tag", "meta_description", "h1", "canonical", "robots",
        "date", "modified", "categories", "built_with_elementor", "featured_image", "og_image", "url"]
with open(ROOT / "content/inventory.csv", "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=cols, extrasaction="ignore")
    w.writeheader()
    for r in sorted(rows, key=lambda r: (r["type"], r["path"])):
        r = dict(r, categories="; ".join(r["categories"]))
        w.writerow(r)
print(f"{len(rows)} URLs inventoried")
