#!/usr/bin/env python3
"""Validate the patient-first central FAQ architecture from ADR-0007."""

from __future__ import annotations

import json
import re
from collections import Counter, defaultdict
from difflib import SequenceMatcher
from pathlib import Path
from typing import Any

from faq_lib import (
    FAQ_DATA,
    FAQ_PLACEMENTS,
    ROOT,
    SCHEMA_END,
    SCHEMA_START,
    SECTION_END,
    SECTION_START,
    generated_outputs,
    load_registry,
    normalized_question,
    schema_items,
    visible_text,
)


ALLOWED_MODES = {"full", "link", "context"}
ALLOWED_REVIEW_STATUSES = {
    "basisconcept, medische review nodig",
    "opgewaardeerd, medische review nodig",
    "medische review nodig",
    "medisch akkoord",
    "publicatieklaar",
}
REVIEWED_STATUSES = {"medisch akkoord", "publicatieklaar"}


def page_is_public(path: Path) -> bool:
    html = path.read_text(encoding="utf-8")
    return 'content="index, follow"' in html


def extract_visible_details(html: str) -> dict[str, tuple[str, str]]:
    """Read the actual rendered FAQ details, independent of generator output."""
    section_match = re.search(
        rf"{re.escape(SECTION_START)}(?P<body>.*?){re.escape(SECTION_END)}",
        html,
        re.S,
    )
    if not section_match:
        return {}
    details: dict[str, tuple[str, str]] = {}
    pattern = re.compile(
        r'<details\s+id="(?P<anchor>[^"]+)">\s*'
        r'<summary>(?P<question>.*?)</summary>(?P<answer>.*?)</details>',
        re.S,
    )
    for match in pattern.finditer(section_match.group("body")):
        details[match.group("anchor")] = (
            visible_text(match.group("question")),
            visible_text(match.group("answer")),
        )
    return details


def extract_faq_schema(html: str) -> list[dict[str, Any]] | None:
    schema_match = re.search(
        rf"{re.escape(SCHEMA_START)}(?P<body>.*?){re.escape(SCHEMA_END)}",
        html,
        re.S,
    )
    if not schema_match:
        return None
    script_match = re.search(
        r'<script\s+type="application/ld\+json">(?P<payload>.*?)</script>',
        schema_match.group("body"),
        re.S,
    )
    if not script_match:
        return None
    try:
        payload = json.loads(script_match.group("payload"))
    except json.JSONDecodeError:
        return None
    if not isinstance(payload, dict) or payload.get("@type") != "FAQPage":
        return None
    main_entity = payload.get("mainEntity")
    return main_entity if isinstance(main_entity, list) else None


def validate() -> tuple[list[str], list[str]]:
    errors: list[str] = []
    warnings: list[str] = []
    if not FAQ_DATA.exists() or not FAQ_PLACEMENTS.exists():
        return ["centrale FAQ-databestanden ontbreken"], []

    records, pages = load_registry()
    placements_by_id: dict[str, list[tuple[dict[str, Any], dict[str, Any]]]] = defaultdict(list)
    page_paths: set[str] = set()

    for record_id, record in records.items():
        if record.get("id") != record_id:
            errors.append(f"FAQ-ID en objectsleutel verschillen: {record_id}")
        for field in ["question", "answerHtml", "audience", "topics", "primaryPage", "anchor", "medicalReviewStatus"]:
            if not record.get(field):
                errors.append(f"{record_id}: verplicht veld ontbreekt of is leeg: {field}")
        if record.get("medicalReviewStatus") not in ALLOWED_REVIEW_STATUSES:
            errors.append(f'{record_id}: onbekende reviewstatus: {record.get("medicalReviewStatus")}')
        if record.get("medicalReviewStatus") in REVIEWED_STATUSES and not record.get("reviewedAt"):
            errors.append(f"{record_id}: reviewdatum ontbreekt bij akkoordstatus")
        if not (ROOT / record.get("primaryPage", "")).exists():
            errors.append(f'{record_id}: primaire pagina bestaat niet: {record.get("primaryPage")}')
        if not record.get("answerHtml", "").lstrip().startswith("<p"):
            warnings.append(f"{record_id}: antwoord begint niet met een paragraaf")

    for page in pages:
        path = page.get("path", "")
        if path in page_paths:
            errors.append(f"dubbele paginaplaatsing: {path}")
        page_paths.add(path)
        html_path = ROOT / path
        if not html_path.exists():
            errors.append(f"plaatsingspagina bestaat niet: {path}")
            continue
        html = html_path.read_text(encoding="utf-8")
        if SECTION_START not in html or SECTION_END not in html:
            errors.append(f"gegenereerde FAQ-markers ontbreken: {path}")
        actual_details = extract_visible_details(html)
        local_anchors: set[str] = set()
        for item in page.get("items", []):
            record_id = item.get("id", "")
            mode = item.get("mode")
            if record_id not in records:
                errors.append(f"{path}: onbekende FAQ-ID: {record_id}")
                continue
            if mode not in ALLOWED_MODES:
                errors.append(f"{path}: ongeldige modus voor {record_id}: {mode}")
                continue
            placements_by_id[record_id].append((page, item))
            anchor = item.get("anchor") if mode == "link" else records[record_id]["anchor"]
            if anchor in local_anchors:
                errors.append(f"{path}: dubbel FAQ-anchor: {anchor}")
            local_anchors.add(anchor)
            if mode == "link":
                target_page = item.get("targetPage", records[record_id]["primaryPage"])
                target_path = ROOT / target_page
                if not target_path.exists():
                    errors.append(f"{path}: linkdoel bestaat niet: {target_page}")
                elif page_is_public(html_path) and not page_is_public(target_path):
                    errors.append(f"{path}: publieke FAQ-link wijst naar conceptpagina: {target_page}")
                continue

            record = records[record_id]
            actual = actual_details.get(record["anchor"])
            expected = (record["question"], visible_text(record["answerHtml"]))
            if actual is None:
                errors.append(f'{path}: zichtbare FAQ ontbreekt bij anchor {record["anchor"]}')
            elif actual != expected:
                errors.append(f"{path}: zichtbare vraag of antwoord wijkt af van centrale bron: {record_id}")

        if page.get("schema", False):
            if SCHEMA_START not in html or SCHEMA_END not in html:
                errors.append(f"gegenereerde FAQ-schemamarkers ontbreken: {path}")
            actual_schema = extract_faq_schema(html)
            expected_schema = schema_items(page, records)
            if actual_schema is None:
                errors.append(f"FAQPage-schema ontbreekt of is ongeldig: {path}")
            elif actual_schema != expected_schema:
                errors.append(f"zichtbare FAQ en FAQPage-schema lopen uiteen: {path}")
        elif SCHEMA_START in html or SCHEMA_END in html:
            errors.append(f"FAQPage-schema staat nog op een pagina met schema=false: {path}")

    for record_id, record in records.items():
        full = [
            (page, item)
            for page, item in placements_by_id.get(record_id, [])
            if item["mode"] in {"full", "context"}
        ]
        if len(full) != 1:
            errors.append(f"{record_id}: verwacht één primaire volledige plaatsing, gevonden {len(full)}")
        elif full[0][0]["path"] != record["primaryPage"]:
            errors.append(
                f'{record_id}: volledige plaatsing staat op {full[0][0]["path"]}, niet op primaire pagina {record["primaryPage"]}'
            )

    for pattern in ["behandelingen/*.html", "artikelen/*.html", "concepten/previews/*.html"]:
        for html_path in ROOT.glob(pattern):
            relative_path = html_path.relative_to(ROOT).as_posix()
            html = html_path.read_text(encoding="utf-8")
            if (SECTION_START in html or 'class="treatment-faq"' in html) and relative_path not in page_paths:
                errors.append(f"FAQ-sectie staat buiten het centrale plaatsingsregister: {relative_path}")

    normalized: dict[str, list[str]] = defaultdict(list)
    for record_id, record in records.items():
        normalized[normalized_question(record["question"])].append(record_id)
    exact_groups = [ids for ids in normalized.values() if len(ids) > 1]
    unreviewed_exact = [
        ids
        for ids in exact_groups
        if any(records[record_id].get("duplicateReviewStatus") != "reviewed-page-specific-2026-08-26" for record_id in ids)
    ]
    if unreviewed_exact:
        warnings.append(
            f"{len(unreviewed_exact)} groep(en) met nog niet geclassificeerde exact genormaliseerde vraagtekst"
        )

    record_items = list(records.items())
    near_count = 0
    unreviewed_near = 0
    for index, (id_a, record_a) in enumerate(record_items):
        norm_a = normalized_question(record_a["question"])
        for id_b, record_b in record_items[index + 1 :]:
            if record_a["primaryPage"] == record_b["primaryPage"]:
                continue
            norm_b = normalized_question(record_b["question"])
            if norm_a == norm_b:
                continue
            if SequenceMatcher(None, norm_a, norm_b).ratio() >= 0.88:
                near_count += 1
                if (
                    record_a.get("nearDuplicateReviewStatus") != "reviewed-page-specific-2026-08-26"
                    or record_b.get("nearDuplicateReviewStatus") != "reviewed-page-specific-2026-08-26"
                ):
                    unreviewed_near += 1
    if unreviewed_near:
        warnings.append(
            f"{unreviewed_near} nog niet geclassificeerde sterke bijna-dubbelkandidaten"
        )

    for path, expected in generated_outputs().items():
        if path.read_text(encoding="utf-8") != expected:
            errors.append(f"gegenereerde output is verouderd: {path.relative_to(ROOT)}")

    return errors, warnings


def main() -> int:
    errors, warnings = validate()
    for warning in warnings:
        print(f"WAARSCHUWING: {warning}")
    if errors:
        print(f"FAQ-controle: {len(errors)} fout(en).")
        for error in errors:
            print(f"- {error}")
        return 1
    records, pages = load_registry()
    placements = sum(len(page["items"]) for page in pages)
    print(f"FAQ-controle geslaagd: {len(records)} records, {len(pages)} pagina's, {placements} plaatsingen.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
