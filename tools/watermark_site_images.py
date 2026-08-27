#!/usr/bin/env python3
from __future__ import annotations

import argparse
import fnmatch
import html
import io
import json
import re
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Any

try:
    from PIL import Image, ImageDraw, ImageFont, ImageOps, PngImagePlugin
except ModuleNotFoundError as exc:  # pragma: no cover - alleen relevant buiten de projectruntime
    raise SystemExit(
        "Pillow ontbreekt. Gebruik de Codex-workspace-Python of installeer Pillow voor deze beeldtool."
    ) from exc


SOURCE_URL = "https://matthijsvandam.nl/"
AUTHOR = "drs. Matthijs van Dam"
COPYRIGHT = "Copyright drs. Matthijs van Dam / matthijsvandam.nl"
COPYRIGHT_LABEL = "© Matthijs van Dam · matthijsvandam.nl"
DESCRIPTION = "Afbeelding afkomstig van matthijsvandam.nl"
SOFTWARE = "MVD image watermark v2"
SVG_MARKER = "mvd-copyright-v2"
SUPPORTED_SUFFIXES = {".jpg", ".jpeg", ".png", ".webp", ".svg"}


@dataclass(frozen=True)
class Classification:
    status: str
    reason: str


def load_manifest(path: Path) -> dict[str, Any]:
    with path.open(encoding="utf-8") as handle:
        manifest = json.load(handle)
    if manifest.get("version") != 1:
        raise ValueError(f"Onbekende manifestversie in {path}")
    return manifest


def classify(path: Path, manifest: dict[str, Any]) -> Classification | None:
    normalized = path.as_posix()
    for item in manifest.get("overrides", []):
        if item["path"] == normalized:
            return Classification(item["status"], item["reason"])
    for item in manifest.get("rules", []):
        if fnmatch.fnmatch(normalized, item["pattern"]):
            return Classification(item["status"], item["reason"])
    return None


def git_bytes(revision: str, path: Path) -> bytes:
    result = subprocess.run(
        ["git", "show", f"{revision}:{path.as_posix()}"],
        check=False,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    if result.returncode != 0:
        message = result.stderr.decode("utf-8", errors="replace").strip()
        raise RuntimeError(f"Schone bron ontbreekt voor {path} op {revision}: {message}")
    return result.stdout


def source_revision(path: Path, manifest: dict[str, Any]) -> str:
    return manifest.get("source_revision_overrides", {}).get(
        path.as_posix(), manifest["default_source_revision"]
    )


def source_bytes(path: Path, manifest: dict[str, Any]) -> bytes:
    return git_bytes(source_revision(path, manifest), path)


def image_software(image: Image.Image) -> str:
    return str(image.info.get("Software") or image.getexif().get(305, ""))


def load_font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = (
        Path("/System/Library/Fonts/Supplemental/Arial.ttf"),
        Path("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"),
        Path("/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf"),
    )
    for candidate in candidates:
        if candidate.exists():
            return ImageFont.truetype(str(candidate), size=size)
    return ImageFont.load_default(size=size)


def add_text_watermark(image: Image.Image) -> Image.Image:
    base = ImageOps.exif_transpose(image).convert("RGBA")
    shortest = min(base.size)
    font_size = max(13, min(24, round(shortest * 0.018)))
    margin = max(14, round(shortest * 0.022))
    stroke_width = max(1, round(font_size * 0.1))
    font = load_font(font_size)
    draw = ImageDraw.Draw(base)
    bbox = draw.textbbox((0, 0), COPYRIGHT_LABEL, font=font, stroke_width=stroke_width)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    x = base.width - text_width - margin
    y = base.height - text_height - margin - bbox[1]
    draw.text(
        (x, y),
        COPYRIGHT_LABEL,
        font=font,
        fill=(18, 69, 74, 220),
        stroke_width=stroke_width,
        stroke_fill=(255, 253, 248, 220),
    )
    return base


def exif_for(source: Image.Image) -> Image.Exif:
    exif = source.getexif()
    exif.pop(274, None)  # pixels zijn al volgens de EXIF-orientatie gedraaid
    exif[270] = DESCRIPTION
    exif[305] = SOFTWARE
    exif[315] = AUTHOR
    exif[33432] = COPYRIGHT
    return exif


def png_info() -> PngImagePlugin.PngInfo:
    info = PngImagePlugin.PngInfo()
    info.add_text("Title", DESCRIPTION)
    info.add_text("Author", AUTHOR)
    info.add_text("Copyright", COPYRIGHT)
    info.add_text("Source", SOURCE_URL)
    info.add_text("Software", SOFTWARE)
    return info


def save_raster(source_data: bytes, target: Path) -> None:
    with Image.open(io.BytesIO(source_data)) as source:
        if image_software(source) in {"MVD image watermark v1", SOFTWARE}:
            raise ValueError(f"De vastgelegde bron voor {target} is niet schoon")
        watermarked = add_text_watermark(source)
        suffix = target.suffix.lower()
        icc_profile = source.info.get("icc_profile")
        if suffix in {".jpg", ".jpeg"}:
            watermarked.convert("RGB").save(
                target,
                "JPEG",
                quality=92,
                subsampling=0,
                optimize=True,
                exif=exif_for(source).tobytes(),
                icc_profile=icc_profile,
            )
        elif suffix == ".png":
            watermarked.save(
                target,
                "PNG",
                pnginfo=png_info(),
                optimize=True,
                icc_profile=icc_profile,
            )
        elif suffix == ".webp":
            watermarked.save(target, "WEBP", quality=92, method=6, exif=exif_for(source).tobytes())
        else:
            raise ValueError(f"Niet-ondersteund rasterformaat: {target}")


def svg_viewbox(svg: str, path: Path) -> tuple[float, float]:
    match = re.search(r"\bviewBox=[\"']([^\"']+)[\"']", svg)
    if not match:
        raise ValueError(f"SVG zonder viewBox: {path}")
    values = [float(value) for value in re.split(r"[\s,]+", match.group(1).strip())]
    if len(values) != 4:
        raise ValueError(f"Ongeldige SVG-viewBox: {path}")
    return values[2], values[3]


def save_svg(source_data: bytes, target: Path) -> None:
    svg = source_data.decode("utf-8")
    if SVG_MARKER in svg:
        raise ValueError(f"De vastgelegde SVG-bron voor {target} is niet schoon")
    width, height = svg_viewbox(svg, target)
    shortest = min(width, height)
    font_size = max(12.0, min(22.0, shortest * 0.018))
    margin = max(12.0, shortest * 0.022)
    stroke_width = max(1.0, font_size * 0.1)
    escaped_label = html.escape(COPYRIGHT_LABEL)
    addition = f"""
  <metadata id="{SVG_MARKER}-metadata">{html.escape(COPYRIGHT)} | {SOURCE_URL}</metadata>
  <g id="{SVG_MARKER}" aria-hidden="true" pointer-events="none">
    <text x="{width - margin:.2f}" y="{height - margin:.2f}" text-anchor="end"
      font-family="Arial, Helvetica, sans-serif" font-size="{font_size:.2f}"
      fill="#12454a" fill-opacity="0.86" stroke="#fffdf8" stroke-opacity="0.86"
      stroke-width="{stroke_width:.2f}" paint-order="stroke">{escaped_label}</text>
  </g>
"""
    if "</svg>" not in svg:
        raise ValueError(f"Ongeldige SVG: {target}")
    target.write_text(svg.replace("</svg>", f"{addition}</svg>"), encoding="utf-8")


def current_has_v2(path: Path) -> bool:
    if path.suffix.lower() == ".svg":
        return SVG_MARKER in path.read_text(encoding="utf-8")
    with Image.open(path) as image:
        return image_software(image) == SOFTWARE


def apply_asset(path: Path, manifest: dict[str, Any], output_dir: Path | None) -> Path:
    target = path if output_dir is None else output_dir / path
    target.parent.mkdir(parents=True, exist_ok=True)
    data = source_bytes(path, manifest)
    if path.suffix.lower() == ".svg":
        save_svg(data, target)
    else:
        save_raster(data, target)
    return target


def inventory(manifest: dict[str, Any]) -> list[tuple[Path, Classification | None]]:
    root = Path(manifest.get("asset_root", "assets"))
    assets = [
        path
        for path in sorted(root.iterdir())
        if path.is_file() and path.suffix.lower() in SUPPORTED_SUFFIXES
    ]
    return [(path, classify(path, manifest)) for path in assets]


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Beheer subtiele copyrightmarkering en bronmetadata voor site-eigen beelden."
    )
    parser.add_argument(
        "--manifest", type=Path, default=Path("data/site-image-rights.json")
    )
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--apply", action="store_true", help="Werk alle site-eigen assets bij.")
    mode.add_argument("--check", action="store_true", help="Controleer register en markeringen.")
    mode.add_argument("--report", action="store_true", help="Toon alleen de inventarisatie.")
    parser.add_argument(
        "--only", action="append", default=[], help="Beperk tot exact pad; meermaals toegestaan."
    )
    parser.add_argument(
        "--output-dir", type=Path, help="Schrijf previews onder deze map in plaats van in assets/."
    )
    args = parser.parse_args()

    manifest = load_manifest(args.manifest)
    rows = inventory(manifest)
    selected = set(args.only)
    if selected:
        known = {path.as_posix() for path, _ in rows}
        missing = selected - known
        if missing:
            raise SystemExit(f"Onbekende --only-paden: {', '.join(sorted(missing))}")
        rows = [(path, item) for path, item in rows if path.as_posix() in selected]

    counts = {"watermark": 0, "exclude": 0, "review_required": 0, "unclassified": 0}
    failures: list[str] = []
    for path, item in rows:
        if item is None:
            counts["unclassified"] += 1
            failures.append(f"unclassified: {path}")
            continue
        counts[item.status] = counts.get(item.status, 0) + 1
        if args.report:
            print(f"{item.status}: {path} -- {item.reason}")
        elif item.status == "watermark" and args.apply:
            target = apply_asset(path, manifest, args.output_dir)
            print(f"updated: {target} (bron {source_revision(path, manifest)})")
        elif item.status == "watermark" and args.check:
            if current_has_v2(path):
                print(f"ok: {path}")
            else:
                failures.append(f"missing_v2_watermark: {path}")

    print(
        "summary: "
        + ", ".join(f"{key}={value}" for key, value in sorted(counts.items()))
    )
    if failures:
        print("issues:", file=sys.stderr)
        for failure in failures:
            print(f"- {failure}", file=sys.stderr)
        raise SystemExit(1)


if __name__ == "__main__":
    main()
