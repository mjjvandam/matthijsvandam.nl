"""Read-only publication registration and local-copy comparison for the pilot."""
from __future__ import annotations

import fnmatch
from html.parser import HTMLParser
import json
from pathlib import Path
from urllib.parse import urlsplit
import xml.etree.ElementTree as ET

from content_model import ValidationError, read_card


def _read(repo, relative):
    root = Path(repo).resolve()
    path = root / relative
    try:
        if not path.resolve().is_relative_to(root) or not path.is_file() or path.stat().st_size > 2_000_000:
            return None
        return path.read_text(encoding="utf-8")
    except (OSError, UnicodeError, RuntimeError):
        return None


class _Robots(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.values = []
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "meta" and attrs.get("name", "").lower() == "robots":
            self.values.append({value.strip().lower() for value in attrs.get("content", "").split(",")})


def publication_status(repo, model):
    """Report repository registration only, never infer a new live verification."""
    url = "https://matthijsvandam.nl/" + model["path"]
    unknown = {"state": "unknown", "label": "Publicatiestatus controleren",
               "detail": "De lokale publicatiebronnen ontbreken of spreken elkaar tegen. De actuele website is hiermee niet opnieuw gecontroleerd.", "url": url}
    source = _read(repo, model["path"])
    register_text = _read(repo, "PUBLICATIE_REGISTER.json")
    sitemap_text = _read(repo, "sitemap.xml")
    exclusions = _read(repo, ".vercelignore")
    if any(value is None for value in (source, register_text, sitemap_text, exclusions)):
        return unknown
    try:
        register = json.loads(register_text)
        if not isinstance(register, dict) or not isinstance(register.get("pages"), list):
            return unknown
        entries = {}
        for entry in register["pages"]:
            if (not isinstance(entry, dict) or not isinstance(entry.get("path"), str)
                    or entry.get("verification_status") not in {"geverifieerd", "review_nodig", "niet_publiceren"}
                    or entry["path"] in entries):
                return unknown
            entries[entry["path"]] = entry
        sitemap = ET.fromstring(sitemap_text)
        if sitemap.tag.split("}")[-1] != "urlset":
            return unknown
        sitemap_paths = set()
        for node in sitemap.iter():
            if node.tag.split("}")[-1] != "loc":
                continue
            parsed = urlsplit((node.text or "").strip())
            if (parsed.scheme != "https" or parsed.hostname not in {"matthijsvandam.nl", "www.matthijsvandam.nl"}
                    or parsed.query or parsed.fragment or parsed.username or parsed.password
                    or parsed.path.lstrip("/") in sitemap_paths):
                return unknown
            sitemap_paths.add(parsed.path.lstrip("/"))
        robots = _Robots(source).values
        if (len(robots) != 1 or not robots[0] or ({"index", "noindex"} <= robots[0])
                or ({"follow", "nofollow"} <= robots[0])):
            return unknown
        indexed = {"index", "follow"} <= robots[0]
        noindex = "noindex" in robots[0]
        if not indexed and not noindex:
            return unknown
        excluded = False
        for line in exclusions.splitlines():
            pattern = line.strip()
            if not pattern or pattern.startswith("#"):
                continue
            include = pattern.startswith("!")
            pattern = pattern[1:] if include else pattern
            pattern = pattern.lstrip("/")
            if fnmatch.fnmatchcase(model["path"], pattern) or (pattern.endswith("/") and model["path"].startswith(pattern)):
                excluded = not include
        registered = entries.get(model["path"])
        in_sitemap = model["path"] in sitemap_paths
        # The project treats either index/follow or sitemap as public scope.
        # A confident label requires the other source signals to agree as well.
        if indexed or in_sitemap:
            if not indexed or not in_sitemap or excluded or not registered or registered["verification_status"] == "niet_publiceren":
                return unknown
            detail = "Volgens de huidige sitebestanden en het publicatieregister staat de bestaande pagina gepubliceerd. Dit is een registratie, geen nieuwe livecontrole."
            if registered["verification_status"] == "review_nodig":
                detail += " Het register vermeldt dat inhoudelijke beoordeling nodig is."
            return {"state": "published", "label": "Gepubliceerd", "detail": detail, "url": url}
        if noindex and not in_sitemap and excluded and (not registered or registered["verification_status"] != "geverifieerd"):
            return {"state": "unpublished", "label": "Niet gepubliceerd",
                    "detail": "Volgens de huidige lokale bronnen staat deze pagina buiten het publicatiespoor. Dit is een registratie, geen nieuwe livecontrole.", "url": url}
    except (ValueError, TypeError, KeyError, ET.ParseError):
        return unknown
    return unknown


def working_copy_status(repo, model, document):
    source = _read(repo, model["path"])
    cards = _read(repo, "content.js")
    unknown = {"state": "unknown", "label": "Werkversie nog vergelijken",
               "detail": "De oorspronkelijke pagina of artikelkaart is niet leesbaar. De lokale werkversie kan nog niet betrouwbaar worden vergeleken."}
    if source is None or cards is None:
        return unknown
    try:
        _, card_raw = read_card(cards, model["id"])
    except (ValidationError, ValueError, TypeError, KeyError):
        return unknown
    if source != model["template"] or card_raw != model["card_raw"]:
        return {"state": "source_changed", "label": "Bron gewijzigd · vergelijken nodig",
                "detail": "De oorspronkelijke pagina of artikelkaart is buiten de beheeromgeving gewijzigd. Vergelijk die wijziging eerst met de lokale werkversie."}
    if document == model["baseline"]:
        return {"state": "unchanged", "label": "Geen lokale wijzigingen",
                "detail": "Deze opgeslagen werkversie is inhoudelijk gelijk aan de oorspronkelijke import, inclusief de artikelkaart."}
    return {"state": "changed", "label": "Lokale wijzigingen",
            "detail": "Deze opgeslagen werkversie wijkt af van de importbron. De bestaande publicatiebron is hierdoor niet aangepast."}
