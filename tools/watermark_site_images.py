#!/usr/bin/env python3
from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image, ImageDraw, PngImagePlugin


SOURCE_URL = "https://matthijsvandam.nl/"
AUTHOR = "drs. Matthijs van Dam"
COPYRIGHT = "Copyright drs. Matthijs van Dam / matthijsvandam.nl"
DESCRIPTION = "Afbeelding afkomstig van matthijsvandam.nl"
SOFTWARE = "MVD image watermark v1"


def resize_logo(logo: Image.Image, image_size: tuple[int, int]) -> Image.Image:
    width, height = image_size
    target_width = max(120, min(300, round(width * 0.18)))
    ratio = target_width / logo.width
    target_height = max(1, round(logo.height * ratio))
    return logo.resize((target_width, target_height), Image.Resampling.LANCZOS)


def with_opacity(image: Image.Image, opacity: int) -> Image.Image:
    result = image.copy()
    alpha = result.getchannel("A")
    alpha = alpha.point(lambda value: min(value, opacity))
    result.putalpha(alpha)
    return result


def add_watermark(image: Image.Image, logo: Image.Image) -> Image.Image:
    base = image.convert("RGBA")
    mark = with_opacity(resize_logo(logo, base.size), 230)
    margin = max(18, round(min(base.size) * 0.035))
    padding_x = max(14, round(mark.width * 0.12))
    padding_y = max(10, round(mark.height * 0.18))
    panel_w = mark.width + padding_x * 2
    panel_h = mark.height + padding_y * 2
    x = base.width - panel_w - margin
    y = base.height - panel_h - margin

    overlay = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    draw.rounded_rectangle(
        (x, y, x + panel_w, y + panel_h),
        radius=max(10, panel_h // 5),
        fill=(255, 253, 248, 218),
        outline=(36, 76, 61, 88),
        width=max(1, round(min(base.size) * 0.002)),
    )
    overlay.alpha_composite(mark, (x + padding_x, y + padding_y))
    return Image.alpha_composite(base, overlay)


def exif_for(image: Image.Image) -> Image.Exif:
    exif = image.getexif()
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


def process_image(path: Path, logo: Image.Image, force: bool) -> str:
    with Image.open(path) as source:
      existing_software = str(source.getexif().get(305, ""))
      if existing_software == SOFTWARE and not force:
          return "skip"

      watermarked = add_watermark(source, logo)
      suffix = path.suffix.lower()
      if suffix in {".jpg", ".jpeg"}:
          rgb = watermarked.convert("RGB")
          rgb.save(path, "JPEG", quality=92, subsampling=0, optimize=True, exif=exif_for(source).tobytes())
      elif suffix == ".png":
          watermarked.save(path, "PNG", pnginfo=png_info(), optimize=True)
      elif suffix == ".webp":
          watermarked.save(path, "WEBP", quality=92, method=6)
      else:
          raise ValueError(f"Niet ondersteund bestandstype: {path}")
    return "updated"


def main() -> None:
    parser = argparse.ArgumentParser(description="Voeg MVD-watermark en bronmetadata toe aan sitebeelden.")
    parser.add_argument("images", nargs="+", type=Path)
    parser.add_argument("--logo", type=Path, default=Path("assets/logo-mvd-full-transparent.png"))
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args()

    logo = Image.open(args.logo).convert("RGBA")
    for image_path in args.images:
        result = process_image(image_path, logo, args.force)
        print(f"{result}: {image_path}")


if __name__ == "__main__":
    main()
