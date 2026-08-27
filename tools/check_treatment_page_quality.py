#!/usr/bin/env python3
"""Quality gate for Foot Pain Guide treatment pages.

The goal is not to pretend that every page is finished. The gate verifies that
upgraded pages really meet the richer treatment-page standard, while remaining
skeleton pages are explicitly labelled as basisconcept in the launch inventory.
"""

from __future__ import annotations

import re
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / "content.js"
INVENTORY = ROOT / "FOOT_PAIN_GUIDE_LAUNCH_INVENTARIS.md"
VERCEL_IGNORE = ROOT / ".vercelignore"
ALLOWED_STATUSES = {
    "basisconcept, medische review nodig",
    "opgewaardeerd, medische review nodig",
    "medisch akkoord",
    "publicatieklaar",
}
MIN_UPGRADED_WORDS = 1300
PUBLIC_STATUSES = {"publicatieklaar"}


class TextParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.text: list[str] = []

    def handle_data(self, data: str) -> None:
        self.text.append(data)


def strip_tags(html: str) -> str:
    parser = TextParser()
    parser.feed(html)
    return " ".join(parser.text)


def word_count(html: str) -> int:
    return len(re.findall(r"\b[\w'-]+\b", strip_tags(html), re.UNICODE))


def condition_urls() -> dict[str, str]:
    content = CONTENT.read_text(encoding="utf-8")
    match = re.search(r"const footPainConditions = \[(.*?)\];", content, re.S)
    if not match:
        raise RuntimeError("footPainConditions niet gevonden")
    urls: dict[str, str] = {}
    for block in re.findall(r"\{\s*id: \"([^\"]+)\"(.*?)\n\s*\}", match.group(1), re.S):
        condition_id, rest = block
        url_match = re.search(r'url: "([^"]+)"', rest)
        if condition_id != "algemene-voet-enkelinformatie" and url_match:
            urls[condition_id] = url_match.group(1)
    return urls


def inventory_statuses() -> dict[str, str]:
    text = INVENTORY.read_text(encoding="utf-8")
    statuses: dict[str, str] = {}
    for line in text.splitlines():
        if not line.startswith("| ") or "`behandelingen/" not in line:
            continue
        cells = [cell.strip() for cell in line.strip("|").split("|")]
        if len(cells) < 4:
            continue
        url_match = re.search(r"`behandelingen/([^`]+)`", cells[1])
        if not url_match:
            continue
        condition_id = url_match.group(1).removesuffix(".html")
        statuses[condition_id] = cells[2]
    return statuses


def run_checks() -> list[tuple[str, str]]:
    issues: list[tuple[str, str]] = []
    urls = condition_urls()
    statuses = inventory_statuses()
    vercel_ignore = VERCEL_IGNORE.read_text(encoding="utf-8") if VERCEL_IGNORE.exists() else ""

    for required_ignore in ["concept-foot-pain-guide.html", "behandelingen/*.html"]:
        if required_ignore not in vercel_ignore:
            issues.append(("concept_pages_not_excluded_from_deploy", required_ignore))

    for condition_id, url in urls.items():
        if not url.startswith("behandelingen/") or not url.endswith(".html"):
            issues.append(("condition_not_treatment_page", f"{condition_id}: {url}"))
            continue

        html_path = ROOT / url
        if not html_path.exists():
            issues.append(("missing_treatment_page", f"{condition_id}: {url}"))
            continue

        status = statuses.get(condition_id, "")
        if not status:
            issues.append(("missing_inventory_status", condition_id))
            continue
        if status not in ALLOWED_STATUSES:
            issues.append(("unknown_inventory_status", f"{condition_id}: {status}"))

        html = html_path.read_text(encoding="utf-8", errors="ignore")
        words = word_count(html)

        is_public = status in PUBLIC_STATUSES

        if is_public:
            if 'content="index, follow"' not in html:
                issues.append(("public_treatment_page_not_index_follow", condition_id))
        elif 'content="noindex, nofollow"' not in html:
            issues.append(("treatment_page_not_noindex_nofollow", condition_id))

        is_upgraded = status.startswith("opgewaardeerd") or status in {"medisch akkoord", "publicatieklaar"}
        if is_upgraded:
            if words < MIN_UPGRADED_WORDS:
                issues.append(("upgraded_page_too_thin", f"{condition_id}: {words} woorden"))
            required_elements = [
                "class=\"treatment-faq\"",
                "faq:section:start",
                "class=\"patient-disclaimer\"",
                "Waar kan je terecht?",
                "officiële zorgkanalen",
            ]
            if not is_public:
                required_elements.append("class=\"section treatment-region-guide-section\"")
            for required in required_elements:
                if required not in html:
                    issues.append(("upgraded_page_missing_required_element", f"{condition_id}: {required}"))
        elif status.startswith("basisconcept") and words >= MIN_UPGRADED_WORDS:
            issues.append(("basisconcept_may_be_ready_for_status_update", f"{condition_id}: {words} woorden"))

    return issues


def main() -> int:
    issues = run_checks()
    if not issues:
        print("Behandelpagina-kwaliteit gecontroleerd: inventaris en paginastatus zijn consistent.")
        return 0

    print(f"Behandelpagina-kwaliteit gecontroleerd: {len(issues)} issue(s) gevonden.")
    for kind, detail in issues:
        print(f"- {kind}: {detail}")
    print("Samenvatting:", dict(Counter(kind for kind, _ in issues)))
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
