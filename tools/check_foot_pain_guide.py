#!/usr/bin/env python3
"""Static consistency checks for the Foot Pain Guide prototype."""

from __future__ import annotations

import re
from collections import Counter
from pathlib import Path
from urllib.parse import urlparse


ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / "content.js"
CONCEPT_PAGE = ROOT / "concept-foot-pain-guide.html"
STYLES = ROOT / "styles.css"
EXPECTED_VIEWS = ("top", "sole", "medial", "lateral", "heel")
REQUIRED_ASSETS = {
    "top": "assets/foot-guide-dorsal.jpg",
    "sole": "assets/foot-guide-plantar.jpg",
    "medial": "assets/foot-guide-medial.jpg",
    "lateral": "assets/foot-guide-lateral.jpg",
    "heel": "assets/foot-guide-heel.jpg",
}
FORBIDDEN_COPY = (
    "Mogelijke oorzaken van pijn bij:",
    "Wanneer een vastzetoperatie niet vastgroeit",
    "zenuwirritatie tussen de middenvoetsbeentjes vraagt",
    "Bekijk algemene behandelonderwerpen",
)
REQUIRED_COPY = (
    "geen diagnose",
    "geen uitslag",
    "officiële zorgkanalen",
    "Deze informatie vervangt geen medisch consult",
)
REQUIRED_CONDITION_IDS = (
    "jicht-podagra",
    "ganglion-enkel",
    "tarsal-boss",
    "ganglion-middenvoet",
    "anterieur-enkel-impingement",
    "posterieur-enkel-impingement",
    "metatarsalgie",
    "morton-neuroom",
    "mtp-plantaire-plaatklachten",
    "peesplaatklachten-hielspoor",
    "corpus-liberum-enkel",
)
REQUIRED_REGION_IDS = (
    "voorzijde-enkel",
    "achterzijde-enkel",
)
FORBIDDEN_CONDITION_IDS = (
    "enkel-impingement",
    "metatarsalgie-morton",
    "nagelproblemen",
    "tarsaal-tunnelsyndroom",
    "voorste-enkelpees-slijmbeursklachten",
)
REQUIRED_REVIEW_EXCLUSIONS = (
    "Nagelproblemen",
    "Tarsaal tunnelsyndroom",
    "Pees- of slijmbeursklachten voorzijde enkel",
)
REVIEWED_REGION_OVERLAPS = {
    ("top", "middenvoet-bovenzijde", "wreef"),
    ("top", "voorvoet-bovenzijde", "wreef"),
    ("sole", "grote-teen-mtp1", "voorvoet-onderzijde"),
    ("sole", "kleine-tenen", "voorvoet-onderzijde"),
    ("medial", "achillespees", "binnenzijde-enkel"),
    ("medial", "grote-teen-mtp1", "voorvoet-onderzijde"),
    ("medial", "hiel-achterzijde", "hiel-onderzijde"),
    ("medial", "middenvoet-bovenzijde", "wreef"),
    ("medial", "binnenzijde-voetboog", "middenvoet-onderzijde"),
    ("medial", "voorvoet-bovenzijde", "wreef"),
    ("lateral", "achillespees", "buitenzijde-enkel"),
    ("lateral", "buitenzijde-voet", "kleine-tenen"),
    ("lateral", "buitenzijde-voet", "voorvoet-onderzijde"),
    ("lateral", "hiel-achterzijde", "hiel-onderzijde"),
    ("lateral", "kleine-tenen", "voorvoet-onderzijde"),
    ("lateral", "middenvoet-bovenzijde", "voorzijde-enkel"),
    ("lateral", "middenvoet-bovenzijde", "wreef"),
    ("lateral", "voorvoet-bovenzijde", "wreef"),
    ("lateral", "voorzijde-enkel", "wreef"),
    ("heel", "achillespees", "achterzijde-enkel"),
}
OVERLAP_REVIEW_THRESHOLD = 0.55


def balanced_block(text: str, start: int, opener: str, closer: str) -> str:
    depth = 0
    in_string = ""
    escaped = False
    block_start = -1

    for index in range(start, len(text)):
        char = text[index]

        if in_string:
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif char == in_string:
                in_string = ""
            continue

        if char in {'"', "'", "`"}:
            in_string = char
            continue

        if char == opener:
            if depth == 0:
                block_start = index
            depth += 1
        elif char == closer:
            depth -= 1
            if depth == 0 and block_start >= 0:
                return text[block_start + 1 : index]

    raise ValueError(f"Geen sluitend blok gevonden voor {opener}{closer}.")


def const_array(text: str, name: str) -> str:
    marker = f"const {name} = ["
    start = text.find(marker)
    if start == -1:
        raise ValueError(f"Constante {name} niet gevonden.")
    return balanced_block(text, text.find("[", start), "[", "]")


def top_level_objects(array_text: str) -> list[str]:
    objects: list[str] = []
    index = 0
    while index < len(array_text):
        if array_text[index] == "{":
            block = balanced_block(array_text, index, "{", "}")
            objects.append(block)
            index += len(block) + 2
        else:
            index += 1
    return objects


def string_value(block: str, key: str) -> str:
    match = re.search(rf'\b{re.escape(key)}:\s*"([^"]+)"', block)
    return match.group(1) if match else ""


def array_values(block: str, key: str) -> list[str]:
    match = re.search(rf'\b{re.escape(key)}:\s*\[([^\]]*)\]', block, re.S)
    if not match:
        return []
    return re.findall(r'"([^"]+)"', match.group(1))


def views_for_region(block: str) -> dict[str, str]:
    marker = "views:"
    start = block.find(marker)
    if start == -1:
        return {}
    views_block = balanced_block(block, block.find("{", start), "{", "}")
    return {
        view: shape
        for view, shape in re.findall(r'\b(top|sole|medial|lateral|heel):\s*\{\s*shape:\s*"([^"]+)"\s*\}', views_block)
    }


def local_target_exists(url: str) -> bool:
    path = urlparse(url).path
    return bool(path) and (ROOT / path).exists()


SVG_TOKEN_RE = re.compile(r"([MCZL])|(-?\d+(?:\.\d+)?)")


def shape_polygon(shape: str) -> list[tuple[float, float]]:
    tokens = [match.group(0) for match in SVG_TOKEN_RE.finditer(shape)]
    points: list[tuple[float, float]] = []
    index = 0
    command = ""
    current: tuple[float, float] | None = None
    start: tuple[float, float] | None = None

    while index < len(tokens):
        if tokens[index] in {"M", "C", "L", "Z"}:
            command = tokens[index]
            index += 1

        if command == "M" and index + 1 < len(tokens):
            current = (float(tokens[index]), float(tokens[index + 1]))
            start = current
            points.append(current)
            index += 2
            command = "C"
        elif command == "L" and index + 1 < len(tokens):
            current = (float(tokens[index]), float(tokens[index + 1]))
            points.append(current)
            index += 2
        elif command == "C" and current:
            while index + 5 < len(tokens) and tokens[index] not in {"M", "C", "L", "Z"}:
                p0 = current
                p1 = (float(tokens[index]), float(tokens[index + 1]))
                p2 = (float(tokens[index + 2]), float(tokens[index + 3]))
                p3 = (float(tokens[index + 4]), float(tokens[index + 5]))
                index += 6
                for step in range(1, 13):
                    t = step / 12
                    mt = 1 - t
                    points.append(
                        (
                            mt**3 * p0[0] + 3 * mt**2 * t * p1[0] + 3 * mt * t**2 * p2[0] + t**3 * p3[0],
                            mt**3 * p0[1] + 3 * mt**2 * t * p1[1] + 3 * mt * t**2 * p2[1] + t**3 * p3[1],
                        )
                    )
                current = p3
                if index >= len(tokens) or tokens[index] in {"M", "C", "L", "Z"}:
                    break
        elif command == "Z":
            if start and points and points[-1] != start:
                points.append(start)
        else:
            break

    return points


def polygon_bounds(points: list[tuple[float, float]]) -> tuple[float, float, float, float]:
    xs = [point[0] for point in points]
    ys = [point[1] for point in points]
    return min(xs), min(ys), max(xs), max(ys)


def point_in_polygon(point: tuple[float, float], polygon: list[tuple[float, float]]) -> bool:
    x, y = point
    inside = False
    previous = len(polygon) - 1

    for index, current in enumerate(polygon):
        xi, yi = current
        xj, yj = polygon[previous]
        if (yi > y) != (yj > y) and x < (xj - xi) * (y - yi) / (yj - yi + 1e-9) + xi:
            inside = not inside
        previous = index

    return inside


def sampled_polygon_area(polygon: list[tuple[float, float]], bounds: tuple[float, float, float, float], steps: int = 24) -> float:
    x1, y1, x2, y2 = bounds
    if x2 <= x1 or y2 <= y1:
        return 0
    hits = 0
    for x_step in range(steps):
        x = x1 + (x_step + 0.5) * (x2 - x1) / steps
        for y_step in range(steps):
            y = y1 + (y_step + 0.5) * (y2 - y1) / steps
            if point_in_polygon((x, y), polygon):
                hits += 1
    return hits * (x2 - x1) * (y2 - y1) / (steps * steps)


def sampled_overlap_ratio(shape_a: str, shape_b: str) -> float:
    polygon_a = shape_polygon(shape_a)
    polygon_b = shape_polygon(shape_b)
    if len(polygon_a) < 3 or len(polygon_b) < 3:
        return 0

    bounds_a = polygon_bounds(polygon_a)
    bounds_b = polygon_bounds(polygon_b)
    x1 = max(bounds_a[0], bounds_b[0])
    y1 = max(bounds_a[1], bounds_b[1])
    x2 = min(bounds_a[2], bounds_b[2])
    y2 = min(bounds_a[3], bounds_b[3])
    if x2 <= x1 or y2 <= y1:
        return 0

    steps = 24
    hits = 0
    for x_step in range(steps):
        x = x1 + (x_step + 0.5) * (x2 - x1) / steps
        for y_step in range(steps):
            y = y1 + (y_step + 0.5) * (y2 - y1) / steps
            if point_in_polygon((x, y), polygon_a) and point_in_polygon((x, y), polygon_b):
                hits += 1

    overlap_area = hits * (x2 - x1) * (y2 - y1) / (steps * steps)
    smaller_area = min(sampled_polygon_area(polygon_a, bounds_a, steps), sampled_polygon_area(polygon_b, bounds_b, steps))
    return overlap_area / smaller_area if smaller_area else 0


def run_checks() -> list[tuple[str, str]]:
    issues: list[tuple[str, str]] = []
    content = CONTENT.read_text(encoding="utf-8")
    concept = CONCEPT_PAGE.read_text(encoding="utf-8")
    styles = STYLES.read_text(encoding="utf-8")

    regions = []
    for block in top_level_objects(const_array(content, "painRegions")):
        region = {
            "id": string_value(block, "id"),
            "related": array_values(block, "relatedConditionIds"),
            "views": views_for_region(block),
        }
        regions.append(region)

    conditions = []
    for block in top_level_objects(const_array(content, "footPainConditions")):
        condition = {
            "id": string_value(block, "id"),
            "title": string_value(block, "title"),
            "excerpt": string_value(block, "excerpt"),
            "url": string_value(block, "url"),
            "regions": array_values(block, "painRegionIds"),
        }
        conditions.append(condition)

    region_ids = {region["id"] for region in regions}
    condition_ids = {condition["id"] for condition in conditions}
    condition_by_id = {condition["id"]: condition for condition in conditions}
    region_by_id = {region["id"]: region for region in regions}

    if len(regions) < 15:
        issues.append(("too_few_regions", str(len(regions))))
    if len(conditions) < 19:
        issues.append(("too_few_conditions", str(len(conditions))))
    for region_id in REQUIRED_REGION_IDS:
        if region_id not in region_ids:
            issues.append(("missing_required_region", region_id))
    for condition_id in REQUIRED_CONDITION_IDS:
        if condition_id not in condition_ids:
            issues.append(("missing_required_condition", condition_id))
    for condition_id in FORBIDDEN_CONDITION_IDS:
        if condition_id in condition_ids:
            issues.append(("forbidden_condition", condition_id))

    expected_view_order = "const footPainViewOrder = [" + ", ".join(f'"{view}"' for view in EXPECTED_VIEWS) + "]"
    if expected_view_order not in content:
        issues.append(("view_order_changed", ", ".join(EXPECTED_VIEWS)))

    for view, asset in REQUIRED_ASSETS.items():
        if asset not in content:
            issues.append(("missing_view_asset_reference", f"{view}: {asset}"))
        if not (ROOT / asset).exists():
            issues.append(("missing_view_asset_file", f"{view}: {asset}"))

    for region in regions:
        if not region["id"]:
            issues.append(("region_missing_id", "onbekende regio"))
            continue
        if not region["views"]:
            issues.append(("region_missing_views", region["id"]))
        if len(region["views"]) < 2:
            issues.append(("region_not_multiview", region["id"]))
        for view, shape in region["views"].items():
            if view not in EXPECTED_VIEWS:
                issues.append(("unknown_region_view", f"{region['id']}: {view}"))
            if not shape.startswith("M") or len(shape) < 20:
                issues.append(("suspicious_shape", f"{region['id']}: {view}"))
        for condition_id in region["related"]:
            if condition_id not in condition_ids:
                issues.append(("missing_condition_reference", f"{region['id']} -> {condition_id}"))
                continue
            if region["id"] not in condition_by_id[condition_id]["regions"]:
                issues.append(("mapping_not_reciprocal_region_to_condition", f"{region['id']} -> {condition_id}"))

    for condition in conditions:
        if not condition["id"]:
            issues.append(("condition_missing_id", "onbekende kaart"))
            continue
        for region_id in condition["regions"]:
            if region_id not in region_ids:
                issues.append(("missing_region_reference", f"{condition['id']} -> {region_id}"))
                continue
            if condition["id"] not in region_by_id[region_id]["related"]:
                issues.append(("mapping_not_reciprocal_condition_to_region", f"{condition['id']} -> {region_id}"))
        if condition["url"] and not local_target_exists(condition["url"]):
            issues.append(("missing_condition_url", f"{condition['id']}: {condition['url']}"))

    duplicate_titles = [title for title, count in Counter(condition["title"] for condition in conditions).items() if title and count > 1]
    for title in duplicate_titles:
        issues.append(("duplicate_condition_title", title))

    duplicate_excerpts = [excerpt for excerpt, count in Counter(condition["excerpt"] for condition in conditions).items() if excerpt and count > 1]
    for excerpt in duplicate_excerpts:
        issues.append(("duplicate_condition_excerpt", excerpt[:80]))

    for view in EXPECTED_VIEWS:
        seen: dict[str, str] = {}
        for region in regions:
            shape = region["views"].get(view)
            if not shape:
                continue
            if shape in seen:
                issues.append(("duplicate_shape", f"{view}: {seen[shape]} == {region['id']}"))
            seen[shape] = region["id"]
        view_regions = [region for region in regions if region["id"] != "onduidelijke-meerdere-plekken" and region["views"].get(view)]
        for index, region in enumerate(view_regions):
            for other in view_regions[index + 1 :]:
                pair = tuple(sorted((region["id"], other["id"])))
                reviewed_pair = (view, pair[0], pair[1])
                ratio = sampled_overlap_ratio(region["views"][view], other["views"][view])
                if ratio >= OVERLAP_REVIEW_THRESHOLD and reviewed_pair not in REVIEWED_REGION_OVERLAPS:
                    issues.append(("unreviewed_region_overlap", f"{view}: {pair[0]} / {pair[1]} ({ratio:.2f})"))

    for required in REQUIRED_COPY:
        if required not in content and required not in concept:
            issues.append(("missing_safety_copy", required))

    for forbidden in FORBIDDEN_COPY:
        if forbidden in content or forbidden in concept:
            issues.append(("forbidden_copy", forbidden))

    if 'content="noindex, nofollow"' not in concept:
        issues.append(("concept_not_noindex_nofollow", "concept-foot-pain-guide.html"))
    if "?debugRegions=1" not in content and "debugRegions" not in content:
        issues.append(("missing_debug_mode", "debugRegions"))
    if "restoreFocus" not in content:
        issues.append(("missing_focus_restore", "restoreFocus"))
    if "data-foot-view-status" not in content:
        issues.append(("missing_view_status", "data-foot-view-status"))
    if "foot-guide-review-map" not in content or "Medische mapping voor review" not in content:
        issues.append(("missing_review_mapping_table", "foot-guide-review-map"))
    if "Niet tonen in MVP" not in content:
        issues.append(("missing_review_exclusion_column", "Niet tonen in MVP"))
    for topic in REQUIRED_REVIEW_EXCLUSIONS:
        if topic not in content:
            issues.append(("missing_review_exclusion_topic", topic))
    if ".foot-guide-review-table-wrap" not in styles or "overflow-x: auto" not in styles:
        issues.append(("missing_review_table_overflow_guard", "foot-guide-review-table-wrap"))
    if "@media (max-width: 520px)" not in styles:
        issues.append(("missing_mobile_breakpoint", "max-width: 520px"))
    if ".foot-guide-toolbar .filter-bar" not in styles or "flex-wrap: nowrap" not in styles:
        issues.append(("missing_mobile_filter_scroll_guard", "foot-guide-toolbar"))
    if "20260614footguide15" not in concept:
        issues.append(("concept_cache_token_not_updated", "20260614footguide15"))

    return issues


def main() -> int:
    issues = run_checks()
    if not issues:
        print("Foot Pain Guide gecontroleerd: geen structurele issues gevonden.")
        return 0

    print(f"Foot Pain Guide gecontroleerd: {len(issues)} issue(s) gevonden.")
    for kind, detail in issues:
        print(f"- {kind}: {detail}")
    print("Samenvatting:", dict(Counter(kind for kind, _ in issues)))
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
