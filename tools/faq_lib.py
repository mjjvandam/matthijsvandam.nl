#!/usr/bin/env python3
"""Shared helpers for the central FAQ registry."""

from __future__ import annotations

import html
import json
import os
import posixpath
import re
import unicodedata
from html.parser import HTMLParser
from pathlib import Path, PurePosixPath
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
FAQ_DATA = ROOT / "data" / "faqs.json"
FAQ_PLACEMENTS = ROOT / "data" / "faq-placements.json"
SECTION_START = "<!-- faq:section:start -->"
SECTION_END = "<!-- faq:section:end -->"
SCHEMA_START = "<!-- faq:jsonld:start -->"
SCHEMA_END = "<!-- faq:jsonld:end -->"
MARKDOWN_START = "<!-- faq:markdown:start -->"
MARKDOWN_END = "<!-- faq:markdown:end -->"


class VisibleTextParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.parts: list[str] = []

    def handle_data(self, data: str) -> None:
        self.parts.append(data)


def visible_text(fragment: str) -> str:
    parser = VisibleTextParser()
    parser.feed(fragment)
    return " ".join("".join(parser.parts).split())


def normalized_question(value: str) -> str:
    normalized = unicodedata.normalize("NFKD", value.lower())
    normalized = "".join(char for char in normalized if not unicodedata.combining(char))
    return re.sub(r"[^a-z0-9]+", " ", normalized).strip()


def load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def load_registry() -> tuple[dict[str, dict[str, Any]], list[dict[str, Any]]]:
    data = load_json(FAQ_DATA)
    placements = load_json(FAQ_PLACEMENTS)
    return data["faqs"], placements["pages"]


def indent_block(value: str, indent: str) -> str:
    return "\n".join(f"{indent}{line}" if line else "" for line in value.splitlines())


def relative_target(source_path: str, target_path: str, anchor: str | None = None) -> str:
    source_parent = str(PurePosixPath(source_path).parent)
    result = posixpath.relpath(target_path, source_parent)
    if anchor:
        result = f"{result}#{anchor}"
    return result


def render_faq_section(page: dict[str, Any], records: dict[str, dict[str, Any]], indent: str) -> str:
    section_id = page.get("sectionId", "vragen")
    heading_id = page.get("headingId", "faq-title")
    heading = html.escape(page.get("heading", "Veelgestelde vragen"))
    lines = [
        f'{indent}<section class="treatment-faq" id="{html.escape(section_id)}" aria-labelledby="{html.escape(heading_id)}">',
        f'{indent}  <h2 id="{html.escape(heading_id)}">{heading}</h2>',
    ]

    for item in page["items"]:
        record = records[item["id"]]
        mode = item["mode"]
        if mode in {"full", "context"}:
            lines.extend(
                [
                    f'{indent}  <details id="{html.escape(record["anchor"])}">',
                    f'{indent}    <summary>{html.escape(record["question"])}</summary>',
                    indent_block(record["answerHtml"], f"{indent}    "),
                    f"{indent}  </details>",
                ]
            )
            continue

        if mode != "link":
            raise ValueError(f"Onbekende FAQ-weergavemodus: {mode}")
        label = item.get("label", record["question"])
        target_page = item.get("targetPage", record["primaryPage"])
        target_anchor = item.get("targetAnchor", record["anchor"])
        href = relative_target(page["path"], target_page, target_anchor)
        intro_html = item.get("introHtml", "Dit antwoord wordt op de vaste informatiepagina onderhouden.")
        link_label = item.get("linkLabel", "Lees het volledige antwoord")
        local_anchor = item.get("anchor", f'faq-link-{record["id"]}')
        lines.extend(
            [
                f'{indent}  <details id="{html.escape(local_anchor)}">',
                f'{indent}    <summary>{html.escape(label)}</summary>',
                f'{indent}    <p>{intro_html} <a href="{html.escape(href, quote=True)}">{html.escape(link_label)}</a>.</p>',
                f"{indent}  </details>",
            ]
        )

    lines.append(f"{indent}</section>")
    return "\n".join(lines)


def schema_items(page: dict[str, Any], records: dict[str, dict[str, Any]]) -> list[dict[str, Any]]:
    result: list[dict[str, Any]] = []
    for item in page["items"]:
        if item["mode"] not in {"full", "context"}:
            continue
        record = records[item["id"]]
        result.append(
            {
                "@type": "Question",
                "name": record["question"],
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": visible_text(record["answerHtml"]),
                },
            }
        )
    return result


def render_schema(page: dict[str, Any], records: dict[str, dict[str, Any]], indent: str) -> str:
    payload = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": schema_items(page, records),
    }
    body = json.dumps(payload, ensure_ascii=False, indent=2)
    return "\n".join(
        [
            f'{indent}<script type="application/ld+json">',
            indent_block(body, f"{indent}  "),
            f"{indent}</script>",
        ]
    )


def _replace_marked(text: str, start: str, end: str, content: str) -> str | None:
    pattern = re.compile(
        rf"(?P<indent>^[ \t]*){re.escape(start)}.*?^[ \t]*{re.escape(end)}",
        re.M | re.S,
    )
    match = pattern.search(text)
    if not match:
        return None
    indent = match.group("indent")
    block = f"{indent}{start}\n{content}\n{indent}{end}"
    return f"{text[:match.start()]}{block}{text[match.end():]}"


def find_faq_schema_span(text: str) -> tuple[int, int, str] | None:
    pattern = re.compile(
        r'(?P<indent>^[ \t]*)<script\s+type="application/ld\+json">(?P<body>.*?)</script>',
        re.M | re.S,
    )
    for match in pattern.finditer(text):
        try:
            payload = json.loads(match.group("body"))
        except json.JSONDecodeError:
            continue
        payloads = payload if isinstance(payload, list) else [payload]
        if any(isinstance(item, dict) and item.get("@type") == "FAQPage" for item in payloads):
            return match.start(), match.end(), match.group("indent")
    return None


def find_faq_section_span(text: str) -> tuple[int, int, str] | None:
    pattern = re.compile(
        r'(?P<indent>^[ \t]*)<section\s+class="treatment-faq".*?</section>',
        re.M | re.S,
    )
    match = pattern.search(text)
    if not match:
        return None
    return match.start(), match.end(), match.group("indent")


def generate_html_text(page: dict[str, Any], records: dict[str, dict[str, Any]], original: str) -> str:
    section_marked = re.search(rf"^[ \t]*{re.escape(SECTION_START)}", original, re.M)
    if section_marked:
        indent = re.match(r"[ \t]*", section_marked.group(0)).group(0)
        section = render_faq_section(page, records, indent)
        updated = _replace_marked(original, SECTION_START, SECTION_END, section)
        if updated is None:
            raise RuntimeError(f'FAQ-sectiemarkers zijn onvolledig in {page["path"]}')
    else:
        span = find_faq_section_span(original)
        if not span:
            raise RuntimeError(f'Geen FAQ-sectie gevonden in {page["path"]}')
        start, end, indent = span
        section = render_faq_section(page, records, indent)
        block = f"{indent}{SECTION_START}\n{section}\n{indent}{SECTION_END}"
        updated = f"{original[:start]}{block}{original[end:]}"

    if not page.get("schema", False):
        schema_marked = re.search(rf"^[ \t]*{re.escape(SCHEMA_START)}", updated, re.M)
        if schema_marked:
            pattern = re.compile(
                rf"^[ \t]*{re.escape(SCHEMA_START)}.*?^[ \t]*{re.escape(SCHEMA_END)}\r?\n?",
                re.M | re.S,
            )
            result, count = pattern.subn("", updated, count=1)
            if count != 1:
                raise RuntimeError(f'FAQ-schemamarkers zijn onvolledig in {page["path"]}')
            return result
        span = find_faq_schema_span(updated)
        if span:
            start, end, _ = span
            return f"{updated[:start]}{updated[end:]}"
        return updated

    schema_marker = re.search(rf"^[ \t]*{re.escape(SCHEMA_START)}", updated, re.M)
    if schema_marker:
        indent = re.match(r"[ \t]*", schema_marker.group(0)).group(0)
        schema = render_schema(page, records, indent)
        result = _replace_marked(updated, SCHEMA_START, SCHEMA_END, schema)
        if result is None:
            raise RuntimeError(f'FAQ-schemamarkers zijn onvolledig in {page["path"]}')
        return result

    span = find_faq_schema_span(updated)
    if not span:
        raise RuntimeError(f'Geen bestaand FAQ-schema gevonden in {page["path"]}')
    start, end, indent = span
    schema = render_schema(page, records, indent)
    block = f"{indent}{SCHEMA_START}\n{schema}\n{indent}{SCHEMA_END}"
    return f"{updated[:start]}{block}{updated[end:]}"


def render_markdown(page: dict[str, Any], records: dict[str, dict[str, Any]]) -> str:
    lines = [f'## {page.get("heading", "Veelgestelde vragen")}']
    for item in page["items"]:
        record = records[item["id"]]
        mode = item["mode"]
        if mode in {"full", "context"}:
            lines.extend(["", f'### {record["question"]}', ""])
            lines.append(record.get("answerMarkdown") or visible_text(record["answerHtml"]))
            continue
        label = item.get("label", record["question"])
        target_page = item.get("targetPage", record["primaryPage"])
        target_anchor = item.get("targetAnchor", record["anchor"])
        href = relative_target(page["markdownPath"], target_page, target_anchor)
        intro = visible_text(item.get("introHtml", "Dit antwoord wordt op de vaste informatiepagina onderhouden."))
        link_label = item.get("linkLabel", "Lees het volledige antwoord")
        lines.extend(["", f"### {label}", "", f"{intro} [{link_label}]({href})."])
    return "\n".join(lines)


def generate_markdown_text(page: dict[str, Any], records: dict[str, dict[str, Any]], original: str) -> str:
    content = render_markdown(page, records)
    marked = _replace_marked(original, MARKDOWN_START, MARKDOWN_END, content)
    if marked is not None:
        return marked
    pattern = re.compile(r"^## Veelgestelde vragen.*?(?=^## Bronnen\s*$)", re.M | re.S)
    match = pattern.search(original)
    if not match:
        raise RuntimeError(f'Geen FAQ-markdownsectie gevonden in {page["markdownPath"]}')
    block = f"{MARKDOWN_START}\n{content}\n{MARKDOWN_END}\n\n"
    return f"{original[:match.start()]}{block}{original[match.end():]}"


def generated_outputs() -> dict[Path, str]:
    records, pages = load_registry()
    outputs: dict[Path, str] = {}
    for page in pages:
        html_path = ROOT / page["path"]
        original = html_path.read_text(encoding="utf-8")
        outputs[html_path] = generate_html_text(page, records, original)
        if page.get("markdownPath"):
            markdown_path = ROOT / page["markdownPath"]
            markdown = markdown_path.read_text(encoding="utf-8")
            outputs[markdown_path] = generate_markdown_text(page, records, markdown)
    return outputs


def write_if_changed(path: Path, content: str) -> bool:
    current = path.read_text(encoding="utf-8") if path.exists() else ""
    if current == content:
        return False
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")
    return True
