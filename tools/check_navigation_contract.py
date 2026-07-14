#!/usr/bin/env python3
"""Check the route-aware navigation contract for matthijsvandam.nl."""

from __future__ import annotations

from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urldefrag, urlparse
import re


ROOT = Path(__file__).resolve().parents[1]
SITEMAP = ROOT / "sitemap.xml"
REDIRECT_EXCEPTIONS = {"expertise.html": "behandelingen.html"}
MAIN_MENU_LABELS = {
    "Over",
    "Klachten en behandelingen",
    "Professionals",
    "Advies",
    "Projecten",
    "Artikelen",
    "Publicaties",
}
CONTEXT_LABELS = {"Contact", "Privacy", "Disclaimer", "Project"}
ALLOWED_MENU_LABELS = MAIN_MENU_LABELS | CONTEXT_LABELS


class NavParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.ids: set[str] = set()
        self.data_headers = 0
        self.data_navs = 0
        self.data_nav_toggles = 0
        self.robots_content = ""
        self.refresh_target = ""
        self.in_data_nav = False
        self.nav_depth = 0
        self.in_nav_link = False
        self.current_nav_link: dict[str, str] | None = None
        self.nav_links: list[dict[str, str]] = []
        self.anchors: list[dict[str, str]] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        data = {key: value or "" for key, value in attrs}
        if "id" in data:
            self.ids.add(data["id"])
        if tag == "header" and "data-header" in data:
            self.data_headers += 1
        if tag == "button" and "data-nav-toggle" in data:
            self.data_nav_toggles += 1
        if tag == "meta":
            if data.get("name", "").lower() == "robots":
                self.robots_content = data.get("content", "")
            if data.get("http-equiv", "").lower() == "refresh":
                self.refresh_target = data.get("content", "")
        if tag == "nav" and "data-nav" in data and not self.in_data_nav:
            self.data_navs += 1
            self.in_data_nav = True
            self.nav_depth = 1
            return
        if tag == "a":
            self.anchors.append(data)
        if self.in_data_nav:
            if tag == "nav":
                self.nav_depth += 1
            if tag == "a":
                self.in_nav_link = True
                self.current_nav_link = {"href": data.get("href", ""), "text": ""}

    def handle_endtag(self, tag: str) -> None:
        if self.in_data_nav and tag == "a" and self.in_nav_link and self.current_nav_link is not None:
            self.current_nav_link["text"] = " ".join(self.current_nav_link["text"].split())
            self.nav_links.append(self.current_nav_link)
            self.current_nav_link = None
            self.in_nav_link = False
        if self.in_data_nav and tag == "nav":
            self.nav_depth -= 1
            if self.nav_depth == 0:
                self.in_data_nav = False

    def handle_data(self, data: str) -> None:
        if self.in_nav_link and self.current_nav_link is not None:
            self.current_nav_link["text"] += data


def collect_html_files() -> list[Path]:
    return sorted(path for path in ROOT.rglob("*.html") if ".git" not in path.parts)


def relative_html_path(path: str) -> str:
    parsed = urlparse(path)
    rel = unquote(parsed.path).lstrip("/")
    if not rel or rel.endswith("/"):
        rel = f"{rel}index.html" if rel else "index.html"
    return rel


def sitemap_paths() -> set[str]:
    if not SITEMAP.exists():
        return set()
    text = SITEMAP.read_text(encoding="utf-8", errors="ignore")
    return {relative_html_path(loc) for loc in re.findall(r"<loc>(.*?)</loc>", text)}


def robots_tokens(content: str) -> set[str]:
    return {token.strip().lower() for token in re.split(r"[, ]+", content) if token.strip()}


def is_public(path: Path, parser: NavParser, public_paths: set[str]) -> bool:
    rel = str(path.relative_to(ROOT))
    tokens = robots_tokens(parser.robots_content)
    return rel in public_paths or ("index" in tokens and "noindex" not in tokens)


def is_external(value: str) -> bool:
    parsed = urlparse(value)
    return bool(parsed.scheme) or value.startswith(("mailto:", "tel:", "data:"))


def local_target(base: Path, href: str) -> tuple[Path, str]:
    target_without_fragment, fragment = urldefrag(href)
    target_path = urlparse(target_without_fragment).path
    target = (base / (target_path or base.name)).resolve() if target_without_fragment else base.resolve()
    return target, fragment


def target_rel(path: Path) -> str:
    try:
        return str(path.relative_to(ROOT))
    except ValueError:
        return str(path)


def is_concept_target(rel: str, public_paths: set[str]) -> bool:
    if rel in public_paths:
        return False
    return rel == "concept-foot-pain-guide.html" or rel.startswith(("behandelingen/", "concepten/"))


def expected_route_label(rel: str) -> str | None:
    if rel in {"index.html", "404.html", "over-mij.html", "privacy.html", "disclaimer.html", "expertise.html"}:
        return None
    if rel == "behandelingen.html" or rel == "concept-foot-pain-guide.html" or rel.startswith("behandelingen/"):
        return "Klachten en behandelingen"
    if rel == "professionals.html":
        return "Professionals"
    if rel == "advies-consultancy.html":
        return "Advies"
    if rel == "projecten.html" or rel.startswith("projecten/"):
        return "Projecten"
    if rel == "artikelen.html" or rel.startswith("concepten/previews/"):
        return "Artikelen"
    if rel.startswith("artikelen/"):
        return None
    if rel == "publicaties.html":
        return "Publicaties"
    return None


def has_redirect_exception(rel: str, parser: NavParser) -> bool:
    expected = REDIRECT_EXCEPTIONS.get(rel)
    if not expected:
        return False
    tokens = robots_tokens(parser.robots_content)
    return "noindex" in tokens and expected in parser.refresh_target


def parse_pages(paths: list[Path]) -> dict[Path, NavParser]:
    parsed: dict[Path, NavParser] = {}
    for path in paths:
        parser = NavParser()
        parser.feed(path.read_text(encoding="utf-8", errors="ignore"))
        parsed[path.resolve()] = parser
    return parsed


def run_checks() -> list[tuple[str, str]]:
    issues: list[tuple[str, str]] = []
    paths = collect_html_files()
    parsed = parse_pages(paths)
    public_paths = sitemap_paths()

    for path in paths:
        parser = parsed[path.resolve()]
        rel = str(path.relative_to(ROOT))
        public_page = is_public(path, parser, public_paths)

        if has_redirect_exception(rel, parser):
            if parser.data_headers or parser.data_navs or parser.data_nav_toggles:
                issues.append(("redirect_has_navigation", rel))
            continue

        if parser.data_headers != 1:
            issues.append(("navigation_header_count", f"{rel}: {parser.data_headers}"))
        if parser.data_navs != 1:
            issues.append(("navigation_nav_count", f"{rel}: {parser.data_navs}"))
        if parser.data_nav_toggles != 1:
            issues.append(("navigation_toggle_count", f"{rel}: {parser.data_nav_toggles}"))

        labels = [link["text"] for link in parser.nav_links]
        for label in labels:
            if label not in ALLOWED_MENU_LABELS:
                issues.append(("navigation_unknown_label", f"{rel}: {label}"))

        required_label = expected_route_label(rel)
        if required_label and required_label not in labels:
            issues.append(("navigation_missing_route_label", f"{rel}: {required_label}"))
        if rel.startswith("artikelen/") and not (set(labels) & MAIN_MENU_LABELS):
            issues.append(("navigation_missing_article_route", rel))
        if rel == "index.html" and not MAIN_MENU_LABELS.issubset(set(labels)):
            missing = sorted(MAIN_MENU_LABELS - set(labels))
            issues.append(("navigation_missing_main_labels", f"{rel}: {', '.join(missing)}"))

        for link in parser.nav_links:
            href = link["href"]
            if not href or is_external(href):
                issues.append(("navigation_nonlocal_link", f"{rel}: {href}"))
                continue
            target, fragment = local_target(path.parent, href)
            if not target.exists():
                issues.append(("navigation_missing_target", f"{rel}: {href}"))
                continue
            target_parser = parsed.get(target.resolve())
            if target_parser and fragment and fragment not in target_parser.ids:
                issues.append(("navigation_missing_fragment", f"{rel}: {href}"))

        if public_page:
            for anchor in parser.anchors:
                href = anchor.get("href", "")
                if not href or is_external(href):
                    continue
                target, _fragment = local_target(path.parent, href)
                rel_target = target_rel(target)
                if target.exists() and is_concept_target(rel_target, public_paths):
                    issues.append(("public_link_to_concept", f"{rel}: {href}"))

    return issues


def main() -> int:
    html_count = len(collect_html_files())
    issues = run_checks()
    print(f"Navigatiebestanden gecontroleerd: {html_count}")

    if not issues:
        print("Resultaat: navigatiecontract klopt.")
        return 0

    print(f"Resultaat: {len(issues)} issue(s) gevonden.")
    for kind, detail in issues:
        print(f"- {kind}: {detail}")
    print("Samenvatting:", dict(Counter(kind for kind, _ in issues)))
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
