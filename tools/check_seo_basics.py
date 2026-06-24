#!/usr/bin/env python3
"""Basic SEO checks for published pages on matthijsvandam.nl."""

from __future__ import annotations

from collections import Counter
from dataclasses import dataclass
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse
from xml.etree import ElementTree as ET


ROOT = Path(__file__).resolve().parents[1]
SITEMAP = ROOT / "sitemap.xml"
SITE_URL = "https://matthijsvandam.nl/"
MAX_TITLE_LENGTH = 65
MAX_DESCRIPTION_LENGTH = 170


class PageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.title = ""
        self._in_title = False
        self.h1_count = 0
        self.meta: list[dict[str, str]] = []
        self.links: list[dict[str, str]] = []
        self.structured_data_count = 0

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        data = {key: value or "" for key, value in attrs}
        if tag == "title":
            self._in_title = True
        elif tag == "h1":
            self.h1_count += 1
        elif tag == "meta":
            self.meta.append(data)
        elif tag == "link":
            self.links.append(data)
        elif tag == "script" and data.get("type") == "application/ld+json":
            self.structured_data_count += 1

    def handle_endtag(self, tag: str) -> None:
        if tag == "title":
            self._in_title = False

    def handle_data(self, data: str) -> None:
        if self._in_title:
            clean = " ".join(data.split())
            if clean:
                self.title += (" " if self.title else "") + clean


@dataclass(frozen=True)
class SitemapEntry:
    path: str
    loc: str
    lastmod: str


def sitemap_entries() -> list[SitemapEntry]:
    namespace = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    entries: list[SitemapEntry] = []
    root = ET.parse(SITEMAP).getroot()

    for url in root.findall("s:url", namespace):
        loc = url.findtext("s:loc", default="", namespaces=namespace)
        lastmod = url.findtext("s:lastmod", default="", namespaces=namespace)
        if not loc.startswith(SITE_URL):
            entries.append(SitemapEntry(path="", loc=loc, lastmod=lastmod))
            continue

        path = loc.removeprefix(SITE_URL)
        if not path:
            path = "index.html"
        elif path.endswith("/"):
            path = f"{path}index.html"
        entries.append(SitemapEntry(path=path, loc=loc, lastmod=lastmod))

    return entries


def parse_page(path: Path) -> PageParser:
    parser = PageParser()
    parser.feed(path.read_text(encoding="utf-8", errors="ignore"))
    return parser


def meta_content(page: PageParser, *, name: str = "", prop: str = "") -> str:
    for meta in page.meta:
        if name and meta.get("name") == name:
            return meta.get("content", "").strip()
        if prop and meta.get("property") == prop:
            return meta.get("content", "").strip()
    return ""


def canonical_href(page: PageParser) -> str:
    for link in page.links:
        if link.get("rel") == "canonical":
            return link.get("href", "").strip()
    return ""


def is_absolute_https(url: str) -> bool:
    parsed = urlparse(url)
    return parsed.scheme == "https" and parsed.netloc == "matthijsvandam.nl"


def run_checks() -> tuple[list[tuple[str, str]], dict[str, int]]:
    issues: list[tuple[str, str]] = []
    entries = sitemap_entries()

    for entry in entries:
        if not entry.loc:
            issues.append(("sitemap_missing_loc", "lege loc"))
            continue
        if not is_absolute_https(entry.loc):
            issues.append(("sitemap_loc_not_https", entry.loc))
        if not entry.lastmod:
            issues.append(("sitemap_missing_lastmod", entry.loc))
        if not entry.path:
            continue

        file_path = ROOT / entry.path
        if not file_path.exists():
            issues.append(("sitemap_file_missing", entry.path))
            continue

        page = parse_page(file_path)
        title = page.title.strip()
        description = meta_content(page, name="description")
        robots = meta_content(page, name="robots").lower()
        canonical = canonical_href(page)

        if not title:
            issues.append(("missing_title", entry.path))
        elif len(title) > MAX_TITLE_LENGTH:
            issues.append(("long_title", f"{entry.path}: {len(title)}"))

        if not description:
            issues.append(("missing_meta_description", entry.path))
        elif len(description) > MAX_DESCRIPTION_LENGTH:
            issues.append(("long_meta_description", f"{entry.path}: {len(description)}"))

        if robots != "index, follow":
            issues.append(("published_page_not_index_follow", f"{entry.path}: {robots or 'ontbreekt'}"))
        if canonical != entry.loc:
            issues.append(("canonical_sitemap_mismatch", f"{entry.path}: {canonical or 'ontbreekt'}"))
        if page.h1_count != 1:
            issues.append(("unexpected_h1_count", f"{entry.path}: {page.h1_count}"))
        if not meta_content(page, prop="og:title"):
            issues.append(("missing_og_title", entry.path))
        if not meta_content(page, prop="og:description"):
            issues.append(("missing_og_description", entry.path))
        if not meta_content(page, name="twitter:description"):
            issues.append(("missing_twitter_description", entry.path))

    summary = {
        "published_pages": len(entries),
        "issues": len(issues),
    }
    return issues, summary


def main() -> int:
    issues, summary = run_checks()
    print("SEO-basis gecontroleerd.")
    print(f"- Gepubliceerde sitemap-pagina's: {summary['published_pages']}")

    if not issues:
        print("Resultaat: geen SEO-basisissues gevonden.")
        return 0

    print(f"Resultaat: {len(issues)} issue(s) gevonden.")
    for kind, detail in issues:
        print(f"- {kind}: {detail}")
    print("Samenvatting:", dict(Counter(kind for kind, _ in issues)))
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
