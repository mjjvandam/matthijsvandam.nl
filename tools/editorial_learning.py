#!/usr/bin/env python3
"""Create and validate local editorial-learning dossiers."""

from __future__ import annotations

import argparse
import difflib
import re
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_BASE = ROOT / "concepten" / "editorial-learning"
SLUG_RE = re.compile(r"^\d{4}-\d{2}-\d{2}-[a-z0-9]+(?:-[a-z0-9]+)*$")
PENDING_APPROVAL = "# Nog geen goedgekeurde versie\n\nDit bestand wordt pas vervangen na expliciet publicatieakkoord van Matthijs.\n"
PENDING_ANALYSIS = "# Leeranalyse nog niet uitgevoerd\n\nVergelijking en eventuele profielwijziging volgen pas na expliciet publicatieakkoord.\n"


def dossier(base: Path, slug: str) -> Path:
    if not SLUG_RE.fullmatch(slug):
        raise ValueError("slug moet beginnen met YYYY-MM-DD en alleen kleine letters, cijfers en koppeltekens bevatten")
    return base / slug


def start(args: argparse.Namespace) -> None:
    source = Path(args.source).resolve()
    if not source.is_file():
        raise ValueError(f"bronbestand ontbreekt: {source}")
    target = dossier(args.base, args.slug)
    first = target / "first-concept.md"
    if first.exists():
        raise FileExistsError(f"nulversie bestaat al en wordt niet overschreven: {first}")
    target.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(source, first)
    (target / "approved-version.md").write_text(PENDING_APPROVAL, encoding="utf-8")
    (target / "learning-analysis.md").write_text(PENDING_ANALYSIS, encoding="utf-8")
    print(first)


def finalize(args: argparse.Namespace) -> None:
    if not args.owner_approved:
        raise ValueError("finaliseren vereist --owner-approved na expliciet publicatieakkoord")
    source = Path(args.source).resolve()
    if not source.is_file():
        raise ValueError(f"bronbestand ontbreekt: {source}")
    target = dossier(args.base, args.slug)
    first = target / "first-concept.md"
    approved = target / "approved-version.md"
    analysis = target / "learning-analysis.md"
    if not first.is_file():
        raise FileNotFoundError(f"nulversie ontbreekt: {first}")
    if approved.exists() and approved.read_text(encoding="utf-8") != PENDING_APPROVAL:
        raise FileExistsError(f"goedgekeurde versie bestaat al en wordt niet overschreven: {approved}")
    shutil.copyfile(source, approved)

    before = first.read_text(encoding="utf-8").splitlines()
    after = approved.read_text(encoding="utf-8").splitlines()
    diff = list(difflib.unified_diff(before, after, lineterm=""))
    additions = sum(line.startswith("+") and not line.startswith("+++") for line in diff)
    deletions = sum(line.startswith("-") and not line.startswith("---") for line in diff)
    template = f"""# Leeranalyse: {args.slug}

- **Status:** vergelijking gereed; inhoudelijke classificatie nog uit te voeren
- **Verschil:** {additions} toegevoegde en {deletions} verwijderde regels
- **Publicatieakkoord:** expliciet bevestigd vóór vastlegging

## Aantoonbare correctiepatronen

Vul alleen patronen in die rechtstreeks uit de vergelijking of expliciete eigenaarfeedback volgen.

## Generaliseerbare lessen

Activeer alleen een regel die in minimaal twee van de laatste vier volledig geredigeerde trajecten terugkomt of expliciet door Matthijs is bevestigd.

## Niet generaliseren

Plaats hier medische feiten, cijfers, namen, publicatiedata, onderwerpgebonden termen, nieuwe broninformatie en studiespecifieke conclusies.
"""
    analysis.write_text(template, encoding="utf-8")
    print(analysis)


def check(args: argparse.Namespace) -> None:
    errors: list[str] = []
    profile = ROOT / "docs" / "site" / "ARTICLE_EDITORIAL_PROFILE.md"
    if not profile.is_file():
        errors.append(f"ontbreekt: {profile}")
    else:
        active = re.findall(r"^- \*\*[A-Z]{2}-\d{2}", profile.read_text(encoding="utf-8"), re.MULTILINE)
        if len(active) > 20:
            errors.append(f"redactieprofiel bevat {len(active)} actieve regels; maximum is 20")
    required = {"first-concept.md", "approved-version.md", "learning-analysis.md"}
    if args.base.exists():
        for item in sorted(args.base.iterdir()):
            if item.is_dir():
                missing = required - {path.name for path in item.iterdir() if path.is_file()}
                if missing:
                    errors.append(f"{item}: ontbreekt {', '.join(sorted(missing))}")
    vercelignore = ROOT / ".vercelignore"
    if "concepten/editorial-learning/" not in vercelignore.read_text(encoding="utf-8"):
        errors.append("editorial-learning ontbreekt in .vercelignore")
    for public_index in (ROOT / "sitemap.xml", ROOT / "content.js"):
        if public_index.is_file() and "editorial-learning" in public_index.read_text(encoding="utf-8"):
            errors.append(f"publieke verwijzing gevonden in {public_index}")
    if errors:
        print("\n".join(f"FOUT: {error}" for error in errors), file=sys.stderr)
        raise SystemExit(1)
    print("Redactionele leerlaag: schoon")


def parser() -> argparse.ArgumentParser:
    result = argparse.ArgumentParser()
    result.add_argument("--base", type=Path, default=DEFAULT_BASE)
    commands = result.add_subparsers(dest="command", required=True)
    start_parser = commands.add_parser("start")
    start_parser.add_argument("--slug", required=True)
    start_parser.add_argument("--source", required=True)
    start_parser.set_defaults(func=start)
    final_parser = commands.add_parser("finalize")
    final_parser.add_argument("--slug", required=True)
    final_parser.add_argument("--source", required=True)
    final_parser.add_argument("--owner-approved", action="store_true")
    final_parser.set_defaults(func=finalize)
    check_parser = commands.add_parser("check")
    check_parser.set_defaults(func=check)
    return result


def main() -> None:
    args = parser().parse_args()
    try:
        args.func(args)
    except (ValueError, FileNotFoundError, FileExistsError) as exc:
        print(f"FOUT: {exc}", file=sys.stderr)
        raise SystemExit(1) from exc


if __name__ == "__main__":
    main()
