#!/usr/bin/env python3
"""Gate for human publication verification on matthijsvandam.nl."""

from __future__ import annotations

import json
import re
from collections import Counter
from dataclasses import dataclass
from html.parser import HTMLParser
from pathlib import Path
from typing import Any
from xml.etree import ElementTree as ET


ROOT = Path(__file__).resolve().parents[1]
REGISTER = ROOT / "PUBLICATIE_REGISTER.json"
SITEMAP = ROOT / "sitemap.xml"
SITE_URL = "https://matthijsvandam.nl/"
ALLOWED_STATUSES = {"review_nodig", "geverifieerd", "niet_publiceren"}
REQUIRED_STATUS = "geverifieerd"


class PageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.title = ""
        self._in_title = False
        self.meta: list[dict[str, str]] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag == "title":
            self._in_title = True
        elif tag == "meta":
            self.meta.append({key: value or "" for key, value in attrs})

    def handle_endtag(self, tag: str) -> None:
        if tag == "title":
            self._in_title = False

    def handle_data(self, data: str) -> None:
        if self._in_title:
            clean = " ".join(data.split())
            if clean:
                self.title += (" " if self.title else "") + clean


@dataclass(frozen=True)
class PageInfo:
    path: str
    title: str
    robots: str
    in_sitemap: bool

    @property
    def index_follow(self) -> bool:
        tokens = set(re.split(r"[\s,]+", self.robots.lower().strip()))
        return "index" in tokens and "follow" in tokens and "noindex" not in tokens

    @property
    def published(self) -> bool:
        return self.in_sitemap or self.index_follow


def sitemap_paths() -> set[str]:
    namespace = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    paths: set[str] = set()
    root = ET.parse(SITEMAP).getroot()

    for url in root.findall("s:url", namespace):
        loc = url.findtext("s:loc", default="", namespaces=namespace)
        if not loc:
            continue
        if not loc.startswith(SITE_URL):
            continue

        path = loc.removeprefix(SITE_URL)
        if not path:
            path = "index.html"
        elif path.endswith("/"):
            path = f"{path}index.html"
        paths.add(path)

    return paths


def html_files() -> list[Path]:
    return sorted(
        path
        for path in ROOT.rglob("*.html")
        if ".git" not in path.parts and "node_modules" not in path.parts
    )


def parse_page(path: Path, in_sitemap: bool) -> PageInfo:
    parser = PageParser()
    parser.feed(path.read_text(encoding="utf-8", errors="ignore"))
    robots = next(
        (meta.get("content", "") for meta in parser.meta if meta.get("name") == "robots"),
        "",
    )
    return PageInfo(
        path=path.relative_to(ROOT).as_posix(),
        title=parser.title,
        robots=robots,
        in_sitemap=in_sitemap,
    )


def load_register() -> tuple[dict[str, dict[str, Any]], list[tuple[str, str]]]:
    issues: list[tuple[str, str]] = []
    data = json.loads(REGISTER.read_text(encoding="utf-8"))
    pages = data.get("pages", [])
    if not isinstance(pages, list):
        return {}, [("invalid_register", "pages is geen lijst")]

    by_path: dict[str, dict[str, Any]] = {}
    for index, item in enumerate(pages, start=1):
        if not isinstance(item, dict):
            issues.append(("invalid_register_entry", f"item {index} is geen object"))
            continue

        path = item.get("path", "")
        status = item.get("verification_status", "")
        if not path:
            issues.append(("missing_register_path", f"item {index}"))
            continue
        if path in by_path:
            issues.append(("duplicate_register_path", path))
        if status not in ALLOWED_STATUSES:
            issues.append(("invalid_verification_status", f"{path}: {status}"))

        by_path[path] = item

    return by_path, issues


def run_checks() -> tuple[list[tuple[str, str]], dict[str, int]]:
    issues: list[tuple[str, str]] = []
    sitemap = sitemap_paths()
    register, register_issues = load_register()
    issues.extend(register_issues)

    pages = {
        page.relative_to(ROOT).as_posix(): parse_page(
            page,
            page.relative_to(ROOT).as_posix() in sitemap,
        )
        for page in html_files()
    }
    published = {path: info for path, info in pages.items() if info.published}
    review_needed: list[str] = []
    verified: list[str] = []
    concepts: list[str] = []

    for path in sorted(sitemap):
        if path not in pages:
            issues.append(("sitemap_missing_file", path))

    for path, info in sorted(published.items()):
        entry = register.get(path)
        if not entry:
            issues.append(("published_page_missing_register_entry", path))
            continue

        status = entry.get("verification_status", "")
        if status == REQUIRED_STATUS:
            verified.append(path)
        else:
            review_needed.append(path)
            issues.append(("published_page_not_verified", f"{path}: {status}"))

        if info.in_sitemap and not info.index_follow:
            issues.append(("sitemap_page_not_index_follow", f"{path}: robots={info.robots or 'ontbreekt'}"))
        if info.index_follow and not info.in_sitemap:
            issues.append(("index_follow_page_missing_from_sitemap", path))

    for path, item in sorted(register.items()):
        status = item.get("verification_status", "")
        info = pages.get(path)
        if status == REQUIRED_STATUS:
            if not info:
                issues.append(("verified_page_missing_file", path))
            elif not info.published:
                issues.append(("verified_page_not_published", f"{path}: robots={info.robots or 'ontbreekt'}"))

    for path, info in sorted(pages.items()):
        if not info.published:
            concepts.append(path)

    summary = {
        "html_total": len(pages),
        "published_total": len(published),
        "verified": len(verified),
        "review_needed": len(review_needed),
        "concept_or_noindex": len(concepts),
        "issues": len(issues),
    }
    return issues, summary


def main() -> int:
    issues, summary = run_checks()
    print("Publicatieverificatie gecontroleerd.")
    print(f"- HTML-bestanden totaal: {summary['html_total']}")
    print(f"- Gepubliceerd volgens sitemap of robots: {summary['published_total']}")
    print(f"- Geverifieerd: {summary['verified']}")
    print(f"- Review nodig: {summary['review_needed']}")
    print(f"- Concept/noindex buiten live-scope: {summary['concept_or_noindex']}")

    if not issues:
        print("Resultaat: alle gepubliceerde pagina's zijn menselijk geverifieerd.")
        return 0

    print(f"Resultaat: {len(issues)} punt(en) gevonden.")
    for kind, detail in issues:
        print(f"- {kind}: {detail}")
    print("Samenvatting:", dict(Counter(kind for kind, _ in issues)))
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
