#!/usr/bin/env python3
"""Repeatable static quality checks for matthijsvandam.nl."""

from __future__ import annotations

from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urldefrag, urlparse
import importlib.util
from xml.etree import ElementTree as ET


ROOT = Path(__file__).resolve().parents[1]
HTML_GLOBS = ("*.html", "artikelen/*.html", "projecten/*.html", "behandelingen/*.html")
NAVIGATION_CHECK = ROOT / "tools" / "check_navigation_contract.py"


class PageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.ids: set[str] = set()
        self.meta: list[dict[str, str]] = []
        self.links: list[dict[str, str]] = []
        self.scripts: list[dict[str, str]] = []
        self.images: list[dict[str, str]] = []
        self.anchors: list[dict[str, str]] = []
        self.buttons: list[dict[str, str]] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        data = {key: value or "" for key, value in attrs}
        if "id" in data:
            self.ids.add(data["id"])
        if tag == "meta":
            self.meta.append(data)
        elif tag == "link":
            self.links.append(data)
        elif tag == "script":
            self.scripts.append(data)
        elif tag == "img":
            self.images.append(data)
        elif tag == "a":
            self.anchors.append(data)
        elif tag == "button":
            self.buttons.append(data)


class ExpertiseCardParser(HTMLParser):
    """Inspect static card links, including the wrapper used by the hover renderer."""

    VOID_TAGS = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}

    def __init__(self) -> None:
        super().__init__()
        self.stack = []
        self.cards = []
        self.current = None
        self.card_depth = 0

    def handle_starttag(self, tag, attrs):
        data = {key: value or "" for key, value in attrs}
        classes = data.get("class", "").split()
        if tag == "article" and "expertise-card" in classes:
            self.current = {"attrs": data, "links": [], "wrappers": []}
            self.cards.append(self.current)
            self.card_depth = len(self.stack)
        if self.current is not None:
            if tag == "a":
                self.current["links"].append(data)
            if "article-card-body" in classes:
                parent = self.stack[self.card_depth + 1:self.card_depth + 2]
                wrapper = parent[0][1] if parent and parent[0][0] == "a" else {}
                self.current["wrappers"].append(wrapper)
        if tag not in self.VOID_TAGS:
            self.stack.append((tag, data))

    def handle_endtag(self, tag):
        for index in range(len(self.stack) - 1, -1, -1):
            if self.stack[index][0] == tag:
                if self.current is not None and index == self.card_depth:
                    self.current = None
                del self.stack[index:]
                break

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in self.VOID_TAGS:
            self.handle_endtag(tag)


def check_expertise_cards(text, base, public_paths, cache):
    """Detect forgotten publication links; never promote or publish content."""
    parser = ExpertiseCardParser()
    parser.feed(text)
    issues = []

    def target(value):
        return local_path(ROOT if value.startswith("/") else base, value.lstrip("/"))

    def published(path):
        if not path.is_file():
            return False
        page = parse_page(path, cache)
        robots = next((meta.get("content", "") for meta in page.meta if meta.get("name") == "robots"), "")
        tokens = set(robots.lower().replace(",", " ").split())
        return path in public_paths or ({"index", "follow"} <= tokens and "noindex" not in tokens)

    for card in parser.cards:
        attrs, links = card["attrs"], card["links"]
        value = attrs.get("data-url") or attrs.get("data-concept-url")
        if not value and links:
            value = links[0].get("href")
        if not value or is_external(value):
            continue  # No target means an informational tile, not a guessed page mapping.
        destination = target(value)
        is_public = published(destination)
        for link in links:
            href = link.get("href", "")
            if href and not is_external(href) and not href.startswith("#") and not published(target(href)):
                issues.append(("expertise_card_links_to_nonpublic_page", href))
        if not is_public:
            if attrs.get("data-url"):
                issues.append(("expertise_card_public_url_not_released", value))
            continue
        if attrs.get("data-concept-url"):
            issues.append(("published_expertise_card_still_concept", value))
        wrappers = card["wrappers"]
        if not (
            attrs.get("data-url")
            and "article-card-clickable" in attrs.get("class", "").split()
            and len(links) == 1
            and wrappers
            and all("article-card-link" in wrapper.get("class", "").split()
                    and target(wrapper.get("href", "")) == destination for wrapper in wrappers)
        ):
            issues.append(("published_expertise_card_not_fully_linked", value))
    return issues


def is_external(value: str) -> bool:
    parsed = urlparse(value)
    return bool(parsed.scheme) or value.startswith(("mailto:", "tel:", "data:"))


def local_path(base: Path, value: str) -> Path:
    return (base / urlparse(value).path).resolve()


def parse_page(path: Path, cache: dict[Path, PageParser]) -> PageParser:
    resolved = path.resolve()
    if resolved not in cache:
        parser = PageParser()
        parser.feed(resolved.read_text(encoding="utf-8", errors="ignore"))
        cache[resolved] = parser
    return cache[resolved]


def collect_html_files() -> list[Path]:
    files: list[Path] = []
    for pattern in HTML_GLOBS:
        files.extend(ROOT.glob(pattern))
    return sorted(files)


def run_checks() -> list[tuple[str, str]]:
    issues: list[tuple[str, str]] = []
    cache: dict[Path, PageParser] = {}
    sitemap = ET.parse(ROOT / "sitemap.xml")
    public_paths = {
        (ROOT / (urlparse(loc.text or "").path.lstrip("/") or "index.html")).resolve()
        for loc in sitemap.iter("{http://www.sitemaps.org/schemas/sitemap/0.9}loc")
    }

    for path in collect_html_files():
      text = path.read_text(encoding="utf-8", errors="ignore")
      page = PageParser()
      page.feed(text)
      base = path.parent
      rel_path = path.relative_to(ROOT)

      if "expertise-card" in text:
          for kind, detail in check_expertise_cards(text, base, public_paths, cache):
              issues.append((kind, f"{rel_path}: {detail}"))

      if 'class="skip-link"' not in text:
          issues.append(("missing_skiplink", str(rel_path)))
      if not any(meta.get("name") == "description" and meta.get("content", "").strip() for meta in page.meta):
          issues.append(("missing_meta_description", str(rel_path)))
      if not any(link.get("rel") == "canonical" and link.get("href") for link in page.links):
          issues.append(("missing_canonical", str(rel_path)))
      if not any(meta.get("name") == "robots" for meta in page.meta):
          issues.append(("missing_robots_meta", str(rel_path)))

      for image in page.images:
          src = image.get("src", "")
          if "alt" not in image:
              issues.append(("image_missing_alt", f"{rel_path}: {src}"))
          if src and not is_external(src) and not local_path(base, src).exists():
              issues.append(("missing_image_file", f"{rel_path}: {src}"))

      for link in page.links:
          href = link.get("href", "")
          if href and not is_external(href) and not href.startswith("#") and not local_path(base, href).exists():
              issues.append(("missing_link_asset", f"{rel_path}: {href}"))

      for script in page.scripts:
          src = script.get("src", "")
          if src and not is_external(src) and not local_path(base, src).exists():
              issues.append(("missing_script_file", f"{rel_path}: {src}"))

      for anchor in page.anchors:
          href = anchor.get("href", "")
          if not href or is_external(href):
              continue

          target_without_fragment, fragment = urldefrag(href)
          target_path = urlparse(target_without_fragment).path
          target = (base / (target_path or path.name)).resolve() if target_without_fragment else path.resolve()

          if not target.exists():
              issues.append(("missing_href_target", f"{rel_path}: {href}"))
              continue
          if fragment and fragment not in parse_page(target, cache).ids:
              issues.append(("missing_fragment", f"{rel_path}: {href}"))

      for button in page.buttons:
          if "filter-button" in button.get("class", "") and "aria-pressed" not in button:
              issues.append(("filter_missing_aria_pressed", str(rel_path)))

    if NAVIGATION_CHECK.exists():
        spec = importlib.util.spec_from_file_location("check_navigation_contract", NAVIGATION_CHECK)
        if spec and spec.loader:
            navigation_module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(navigation_module)
            for kind, detail in navigation_module.run_checks():
                issues.append((kind, detail))

    return issues


def main() -> int:
    html_count = len(collect_html_files())
    issues = run_checks()
    print(f"HTML-bestanden gecontroleerd: {html_count}")

    if not issues:
        print("Resultaat: geen structurele issues gevonden.")
        return 0

    print(f"Resultaat: {len(issues)} issue(s) gevonden.")
    for kind, detail in issues:
        print(f"- {kind}: {detail}")

    print("Samenvatting:", dict(Counter(kind for kind, _ in issues)))
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
