"""Read-only source inventory with private, revision-bound 'viewed' notes.

No function here edits website content, medical approval or automation settings.
"""
from __future__ import annotations

from contextlib import contextmanager
from datetime import datetime, timezone
import fcntl
import fnmatch
import hashlib
from html.parser import HTMLParser
import json
import os
from pathlib import Path
import re
import tempfile
from urllib.parse import urlsplit
import xml.etree.ElementTree as ET


AUTOMATIONS_DIR = Path.home() / ".codex" / "automations"
MAX_SOURCE_BYTES = 2_000_000
MAX_NOTE = 2000
MAX_AGENT_AGE_SECONDS = 300
ROUTINES = (
    ("wekelijkse-hoofdredactie-sitecheck-matthijsvandam-nl",
     "Wekelijkse hoofdredactie sitecheck matthijsvandam.nl", "cron",
     "Controleert redactie, medische grenzen, links, vormgeving en techniek.", "weekly"),
    ("tweewekelijkse-artikelkansen-matthijsvandam-nl",
     "Tweewekelijkse artikelkansen, concept en sitepreview matthijsvandam.nl", "cron",
     "Zoekt bronnen en bereidt research, een artikelconcept en een voorvertoning voor.", "articles"),
    ("maandelijkse-site-automatiserings-apk-matthijsvandam-nl",
     "Maandelijkse site-automatiserings-APK matthijsvandam.nl", "cron",
     "Beoordeelt diagnostisch of de routines en projectafspraken nog aansluiten.", "monthly"),
    ("bewaartermijn-websitecontact-controleren", "Bewaartermijn websitecontact controleren",
     "heartbeat", "Controleert bewaartermijnen van websitecontact; verwijdert niets zonder eigenaarakkoord.", "contact"),
)
INVENTORY_FILE = "FOOT_PAIN_GUIDE_LAUNCH_INVENTARIS.md"
REGISTER_FILE = "PUBLICATIE_REGISTER.json"
WORK_ITEMS_FILE = "local-admin/work-items.json"
ROUTINE_RECAPS_FILE = "local-admin/routine-recaps.json"
MAX_WORK_ITEMS = 100
MAX_WORK_CATALOG_BYTES = 250_000


def _now():
    return datetime.now(timezone.utc)


def _iso(value):
    return value.isoformat(timespec="seconds").replace("+00:00", "Z")


def _text(path, limit=MAX_SOURCE_BYTES):
    try:
        if path.stat().st_size > limit:
            return None
        return path.read_text(encoding="utf-8")
    except (OSError, UnicodeError):
        return None


def _json(path):
    raw = _text(path)
    if raw is None:
        return None
    try:
        return json.loads(raw)
    except (ValueError, TypeError):
        return None


def _safe(value, length=350):
    """Short UI text, never complete prompts, report bodies, or exception text."""
    if not isinstance(value, str):
        return ""
    value = re.sub(r"<[^>]*>", "", value)
    value = re.sub(r"\b[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}\b", "[e-mailadres weggelaten]", value)
    value = re.sub(r"(?i)\b(?:bearer\s+\S+|(?:sk|ghp|github_pat|art_v1)[_-][A-Za-z0-9_-]+)",
                   "[geheim weggelaten]", value)
    value = re.sub(r"\b(?:r-)?[a-f0-9]{16,}\b", "[identificatie weggelaten]", value)
    return " ".join(value.split())[:length]


def _digest(*parts):
    raw = json.dumps(parts, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


class _Page(HTMLParser):
    def __init__(self, raw):
        super().__init__(convert_charrefs=True)
        self.robots = ""
        self.h1 = []
        self.in_h1 = False
        self.feed(raw)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "meta" and attrs.get("name", "").lower() == "robots":
            self.robots = attrs.get("content", "").lower()
        if tag == "h1":
            self.in_h1 = True

    def handle_endtag(self, tag):
        if tag == "h1":
            self.in_h1 = False

    def handle_data(self, data):
        if self.in_h1:
            self.h1.append(data)


def _inventory(raw):
    result = {}
    for line in (raw or "").splitlines():
        if not line.startswith("|"):
            continue
        cells = [x.strip() for x in line.split("|")]
        if len(cells) < 6:
            continue
        match = re.fullmatch(r"`(behandelingen/[a-z0-9-]+\.html)`", cells[2])
        if match:
            result[match[1]] = {"title": cells[1], "status": cells[3], "detail": cells[4]}
        elif "Lisfranc" in cells[1]:
            result["behandelingen/lisfranc-middenvoetletsel.html"] = {
                "title": cells[1], "status": cells[3], "detail": cells[4]}
    return result


def _sitemap(raw):
    if raw is None:
        return None
    try:
        document = ET.fromstring(raw)
    except ET.ParseError:
        return None
    paths = set()
    for element in document.iter():
        if element.tag.split("}")[-1] == "loc" and element.text:
            match = re.fullmatch(r"https://(?:www\.)?matthijsvandam\.nl/(.*)", element.text.strip())
            if match:
                paths.add(match[1] or "index.html")
    return paths


def _excluded(path, rules):
    if rules is None:
        return None
    excluded = False
    for line in rules.splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        negative = line.startswith("!")
        pattern = line[1:] if negative else line
        if fnmatch.fnmatchcase(path, pattern) or (pattern.endswith("/") and path.startswith(pattern)):
            excluded = not negative
    return excluded


def _task(task_id, title, category, status, source, detail, fingerprint, url=None, can_check=True):
    result = {"id": task_id, "title": _safe(title, 200), "category": category,
              "status": status, "source": source, "detail": _safe(detail, 600),
              "checked": False, "can_check": can_check, "note": "", "_fingerprint": fingerprint}
    if url:
        result["url"] = url
    return result


def _page_tasks(repo_root):
    register_raw = _json(repo_root / REGISTER_FILE)
    register_ok = isinstance(register_raw, dict) and isinstance(register_raw.get("pages"), list)
    rows = register_raw["pages"] if register_ok else []
    if any(not isinstance(row, dict) or not isinstance(row.get("path"), str)
           or row.get("verification_status") not in ("geverifieerd", "review_nodig", "niet_publiceren") for row in rows):
        register_ok = False
    register = {row["path"]: row for row in rows} if register_ok else {}
    if len(register) != len(rows):
        register_ok, register = False, {}
    inventory_raw = _text(repo_root / INVENTORY_FILE)
    inventory = _inventory(inventory_raw)
    sitemap = _sitemap(_text(repo_root / "sitemap.xml"))
    rules = _text(repo_root / ".vercelignore")
    tasks = []
    if not register_ok or sitemap is None or inventory_raw is None or rules is None:
        tasks.append(_task("source-status", "Bronnen voor paginastatus controleren", "Status vaststellen",
                           "Bron onleesbaar", REGISTER_FILE + ", sitemap.xml, " + INVENTORY_FILE + ", .vercelignore",
                           "Een bron ontbreekt of is niet herkenbaar. Pagina's worden niet automatisch als goedgekeurd beschouwd.",
                           _digest(register_ok, sitemap is not None, inventory_raw is not None, rules is not None)))
    for path in sorted((repo_root / "behandelingen").glob("*.html")):
        if not re.fullmatch(r"[a-z0-9-]+\.html", path.name) or path.is_symlink():
            continue
        rel = path.relative_to(repo_root).as_posix()
        raw = _text(path)
        entry = register.get(rel, {})
        inv = inventory.get(rel, {})
        if raw is None:
            tasks.append(_task("page-" + path.stem, path.stem, "Status vaststellen", "Bestand onleesbaar",
                               rel, "Pagina kan niet worden ingelezen.", _digest(rel, "unreadable")))
            continue
        page = _Page(raw)
        robots = {x.strip() for x in page.robots.split(",")}
        indexed = {"index", "follow"}.issubset(robots)
        in_sitemap = rel in (sitemap or set())
        public = indexed or in_sitemap
        excluded = _excluded(rel, rules)
        title = inv.get("title") or " ".join(page.h1) or path.stem.replace("-", " ")
        status = entry.get("verification_status")
        inv_status = inv.get("status", "")
        category, label, can_check = "Status vaststellen", "Status vaststellen", True
        detail = "Conceptbestand; een actuele, eenduidige reviewstatus ontbreekt in de inventaris."
        if rel == "behandelingen/lisfranc-middenvoetletsel.html" and not public:
            category, label, can_check = "Geparkeerd", "Bewust geparkeerd", False
            detail = "Alleen oriënterende differentiaal in de pijnwijzer; geen publiek behandelspoor."
        elif public:
            consistent = indexed and in_sitemap and excluded is False and register_ok
            if status == "geverifieerd" and consistent:
                category, label, can_check = "Gepubliceerd", "Geverifieerd in register", False
                detail = "Publieke bronpagina; bestaande eigenaarverificatie " + str(entry.get("verified_on") or "zonder datum") + ". Geen nieuwe reviewtaak."
            elif status == "review_nodig" and consistent:
                category, label = "Medische review", "Eigenaarreview nodig"
                detail = "De publieke pagina staat in het register op review_nodig. Bekeken markeren geeft geen inhoudelijk akkoord."
            else:
                detail = "Publieke signalen, deploymentuitsluiting en register zijn niet eenduidig; controleer de publicatiegrens."
        elif robots == {"noindex", "nofollow"} and excluded is True and register_ok and sitemap is not None:
            if inv_status in {"opgewaardeerd, medische review nodig", "basisconcept, medische review nodig"}:
                category, label = "Medische review", "Medisch nakijken"
                detail = inv.get("detail") or "Medische review nodig volgens de inventaris."
                if inv_status.startswith("basisconcept"):
                    label = "Basisconcept voorbereiden"
            elif inv_status == "medisch akkoord":
                category, label = "Publicatievoorbereiding", "Medisch akkoord volgens inventaris"
                detail = "Nog niet publiek vrijgegeven. Controleer de overige publicatievoorwaarden."
            elif inv_status == "publicatieklaar":
                category, label = "Publicatievoorbereiding", "Publicatiestatus controleren"
                detail = "Inventaris noemt publicatieklaar, maar de bronpagina is nog concept. Geen automatische vrijgave."
        else:
            detail = "Conceptstatus en deploymentuitsluiting zijn niet volledig bevestigd. Controleer de bronnen."
        fingerprint = _digest(raw, inv, entry, in_sitemap, excluded, register_ok, sitemap is not None)
        sources = rel + "; " + (REGISTER_FILE if public else INVENTORY_FILE)
        tasks.append(_task("page-" + path.stem, title, category, label, sources, detail, fingerprint,
                           url="/reference/" + rel, can_check=can_check))
    return tasks


def _latest_report(repo_root, prefix):
    candidates = []
    folder = repo_root / "docs" / "site" / "reviews"
    for path in folder.glob(prefix + "*.md"):
        match = re.fullmatch(re.escape(prefix) + r"(\d{4}-\d{2}(?:-\d{2})?)\.md", path.name)
        if match:
            candidates.append((match[1], path))
    if not candidates:
        return None, None, None
    date, path = max(candidates)
    try:
        if not path.resolve().is_relative_to(Path(repo_root).resolve()):
            return date, path, None
    except (OSError, RuntimeError):
        return date, path, None
    return date, path, _text(path)


def _section(raw, heading):
    match = re.search(r"(?m)^#{1,6}\s+" + re.escape(heading) + r"\s*$", raw or "")
    if not match:
        return ""
    tail = raw[match.end():]
    return re.split(r"(?m)^#{1,6}\s+", tail, maxsplit=1)[0].strip()


def _report_tasks(repo_root):
    tasks = []
    date, path, raw = _latest_report(repo_root, "sitecheck-")
    if raw:
        notice = _section(raw, "Ter kennisname")
        if notice and not re.match(r"^(?:geen|niet van toepassing)\b", notice, re.I):
            tasks.append(_task("notice-latest-sitecheck", "Ter kennisname: laatste sitecheck",
                               "Beheer & routines", "Te bekijken", path.relative_to(repo_root).as_posix(),
                               date + ": " + notice, _digest(date, notice),
                               url="/reports/wekelijkse-hoofdredactie-sitecheck-matthijsvandam-nl"))
        priorities = _section(raw, "Prioriteiten")
        lines = [x for x in priorities.splitlines() if re.match(r"-\s*\*\*(Kritiek|Belangrijk):\*\*", x)]
        actionable = [x for x in lines if not re.search(r":\*\*\s*(geen|niet van toepassing)\b", x, re.I)]
        if actionable:
            detail = re.sub(r"-\s*\*\*(?:Kritiek|Belangrijk):\*\*\s*", "", " ".join(actionable))
            tasks.append(_task("report-latest-sitecheck", "Aandachtspunten laatste sitecheck bekijken",
                               "Sitekwaliteit", "Te bekijken", path.relative_to(repo_root).as_posix(),
                               date + ": " + detail, _digest(raw)))
    date, path, raw = _latest_report(repo_root, "site-automation-apk-")
    if raw and "AANDACHT_NODIG" in _section(raw, "SITE_AUTOMATISERINGS_APK_STATUS"):
        # A dated report review, not an automatic re-creation of each historical fix.
        tasks.append(_task("report-latest-apk", "Laatste automatiserings-APK beoordelen", "Routines",
                           "Verslag bekijken", path.relative_to(repo_root).as_posix(),
                           date + ": het verslag vraagt aandacht. Vergelijk met nieuwere controles; oudere bevindingen kunnen inmiddels zijn opgelost.",
                           _digest(raw)))
    return tasks


def _metadata(path):
    """Only read allowlisted scalar TOML metadata, also on Python without tomllib."""
    raw = _text(path)
    if raw is None:
        return None
    # A newly introduced timezone schema must not be silently interpreted as local time.
    if re.search(r"(?m)^(?:timezone|time_zone)\s*=", raw):
        return None
    result = {}
    for key in ("version", "id", "kind", "name", "status", "rrule"):
        matches = re.findall(r"(?m)^" + key + r"\s*=\s*(.*?)\s*$", raw)
        if len(matches) != 1:
            return None
        try:
            value = json.loads(matches[0])
        except ValueError:
            return None
        if (key == "version" and (type(value) is not int or value != 1)) or (key != "version" and not isinstance(value, str)):
            return None
        result[key] = value
    return result


def _schedule(rule):
    days = {"MO": "maandag", "TU": "dinsdag", "WE": "woensdag", "TH": "donderdag",
            "FR": "vrijdag", "SA": "zaterdag", "SU": "zondag"}
    try:
        pairs = [part.split("=") for part in rule.split(";")]
        if any(len(p) != 2 for p in pairs) or len({p[0] for p in pairs}) != len(pairs):
            return None
        values = dict(pairs)
        if set(values) - {"FREQ", "INTERVAL", "BYDAY", "BYHOUR", "BYMINUTE", "BYSECOND", "BYMONTHDAY", "BYSETPOS"}:
            return None
        hour, minute = int(values["BYHOUR"]), int(values["BYMINUTE"])
        if not 0 <= hour <= 23 or not 0 <= minute <= 59 or values.get("BYSECOND", "0") != "0":
            return None
        interval = int(values.get("INTERVAL", "1"))
        if not 1 <= interval <= 52:
            return None
        when = f"{hour:02d}:{minute:02d}"
        if values.get("FREQ") == "WEEKLY" and not ({"BYMONTHDAY", "BYSETPOS"} & set(values)):
            selected = values["BYDAY"].split(",")
            if any(day not in days for day in selected):
                return None
            prefix = "Iedere week" if interval == 1 else f"Om de {interval} weken"
            return prefix + " op " + ", ".join(days[day] for day in selected) + " om " + when
        if values.get("FREQ") == "MONTHLY" and interval == 1:
            if "BYMONTHDAY" in values and not ({"BYDAY", "BYSETPOS"} & set(values)):
                day = int(values["BYMONTHDAY"])
                if 1 <= day <= 31:
                    return f"Elke maand op dag {day} om {when}"
            if values.get("BYSETPOS") == "1" and values.get("BYDAY") in days and "BYMONTHDAY" not in values:
                return "Eerste " + days[values["BYDAY"]] + " van de maand om " + when
    except (ValueError, KeyError, TypeError):
        pass
    return None


def _memory_section(automation_id):
    raw = _text(AUTOMATIONS_DIR / automation_id / "memory.md")
    sections = list(re.finditer(r"(?m)^##\s+(\d{4}-\d{2}-\d{2})([^\n]*)", raw or ""))
    if not sections:
        return None, ""
    newest = max(sections, key=lambda match: match[1])
    block = re.split(r"(?m)^##\s+", raw[newest.end():], maxsplit=1)[0]
    timestamp = re.search(r"(?:Huidige runtime:|Huidige run afgerond(?: op)?)\s*(\d{4}-\d{2}-\d{2}(?:[ T]\d{2}:\d{2}(?::\d{2})?(?:\s+CEST|\s+CET|[+-]\d{2}:\d{2}|Z)?)?)", block)
    if timestamp:
        return timestamp[1], block
    heading_timestamp = re.match(r"T\d{2}:\d{2}:\d{2}(?:[+-]\d{2}:\d{2}|Z)", newest[2])
    return newest[1] + (heading_timestamp[0] if heading_timestamp else ""), block


def _run_evidence(repo_root, automation_id, kind):
    if kind in {"weekly", "monthly"}:
        prefix = "sitecheck-" if kind == "weekly" else "site-automation-apk-"
        date, path, raw = _latest_report(repo_root, prefix)
        if not raw:
            return None, "Geen leesbaar uitvoeringsverslag gevonden."
        if kind == "monthly":
            outcome = _section(raw, "SITE_AUTOMATISERINGS_APK_STATUS").splitlines()
            result = "Aandacht nodig volgens het verslag." if outcome and outcome[0] == "AANDACHT_NODIG" else "Verslag beschikbaar; uitkomst niet eenduidig herkend."
            timestamp, _ = _memory_section(automation_id)
            return timestamp if timestamp and timestamp.startswith(date) else date, result
        priorities = _section(raw, "Prioriteiten")
        important = re.search(r"(?m)^-\s*\*\*Belangrijk:\*\*\s*(.+)$", priorities)
        finished = re.search(r"(?m)^Afgerond:\s*(\d{4}-\d{2}-\d{2}[^\n]*)", raw)
        summary = _safe(important[1]) if important else "Sitecheckverslag beschikbaar."
        if important and re.search(r"\blokale menufixes\s+visueel nacontroleren\b", important[1], re.I):
            summary = "De lokale menuaanpassingen moeten nog visueel worden nagekeken vóór publicatie."
        return finished[1] if finished else date, summary
    # The article memory contains private delivery details; expose only dated evidence.
    timestamp, block = _memory_section(automation_id)
    if not timestamp:
        return None, "Nog geen uitvoeringsverslag gevonden."
    if kind == "articles":
        result = "Artikelrun vastgelegd; research, concept en voorvertoning volgens het runverslag." if "Aangemaakt:" in block else "Gedateerde runnotitie beschikbaar; voltooiing niet vastgesteld."
    else:
        result = "Gedateerde controlenotitie beschikbaar; inhoud blijft buiten dit dashboard."
    return timestamp, result


def _routines(repo_root):
    result = []
    recap_items = _recap_items(repo_root)
    for routine_id, fallback_name, expected_kind, role, report_kind in ROUTINES:
        data = _metadata(AUTOMATIONS_DIR / routine_id / "automation.toml")
        recognized = data and data["id"] == routine_id and data["kind"] == expected_kind and data["status"] in {"ACTIVE", "PAUSED"}
        schedule = _schedule(data["rrule"]) if recognized else None
        last_report, last_result = _run_evidence(repo_root, routine_id, report_kind)
        detail = "Momentopname van configuratie en verslagen; dit bewijst geen lopende uitvoering of volgende start."
        if not recognized:
            detail = "Configuratie ontbreekt of het schema is niet herkenbaar. Status en planning zijn onbekend."
        elif not schedule:
            detail = "Configuratie is leesbaar, maar het ingestelde planningsschema wordt niet herkend. Geen volgende uitvoering berekend."
        else:
            detail += " Tijden volgen de lokale context Europe/Amsterdam; het bestand bevat geen bevestigde tijdzone-instelling."
        result.append({"id": routine_id, "name": _safe(data["name"], 200) if recognized else fallback_name,
                       "status": ({"ACTIVE": "Ingeschakeld", "PAUSED": "Gepauzeerd"}[data["status"]] if recognized else "Onbekend"),
                       "schedule": schedule or "Planning onbekend", "role": role,
                       "last_report": last_report, "last_result": last_result, "detail": detail,
                       "recap": _routine_recap(repo_root, routine_id, report_kind, recap_items.get(routine_id))})
    return result


def _recap_items(repo_root):
    """Read the small owner-curated recap catalog without exposing its raw text."""
    root = Path(repo_root).resolve()
    path = root / ROUTINE_RECAPS_FILE
    try:
        if not path.resolve().is_relative_to(root):
            return {}
        raw = _text(path, 50_000)
        data = json.loads(raw) if raw is not None else None
        if (not isinstance(data, dict) or set(data) != {"version", "items"} or type(data["version"]) is not int
                or data["version"] != 1 or not isinstance(data["items"], list) or len(data["items"]) > 4):
            return {}
        known = {routine[0] for routine in ROUTINES}
        result = {}
        for item in data["items"]:
            if (not isinstance(item, dict) or not {"id", "source_sha256", "highlights"} <= set(item)
                    or not set(item) <= {"id", "source_sha256", "highlights", "supporting_sources"}
                    or not isinstance(item["id"], str) or item["id"] not in known or item["id"] in result
                    or not isinstance(item["source_sha256"], str) or not re.fullmatch(r"[a-f0-9]{64}", item["source_sha256"])
                    or not isinstance(item["highlights"], list) or not 1 <= len(item["highlights"]) <= 3
                    or not isinstance(item.get("supporting_sources", []), list) or len(item.get("supporting_sources", [])) > 12):
                return {}
            highlights = []
            for point in item["highlights"]:
                if (not isinstance(point, dict) or set(point) != {"label", "text"}
                        or point["label"] not in {"Gedaan", "Uitkomst", "Vervolg"}):
                    return {}
                text = _safe(_redact_report_text(_work_text(point["text"], 500)), 500)
                if not text:
                    return {}
                highlights.append({"label": point["label"], "text": text})
            result[item["id"]] = {**item, "highlights": highlights}
        return result
    except (ValueError, KeyError, TypeError, OSError, RuntimeError):
        return {}


def _routine_recap(repo_root, routine_id, report_kind, item):
    source = None
    report_url = None
    if report_kind in {"weekly", "monthly"}:
        prefix = "sitecheck-" if report_kind == "weekly" else "site-automation-apk-"
        _, _, source = _latest_report(repo_root, prefix)
        if source:
            report_url = "/reports/" + routine_id
    else:
        _, source = _memory_section(routine_id)
    result = {"status": "missing", "highlights": [], "message": "Korte terugblik nog niet beschikbaar."}
    if report_url:
        result["report_url"] = report_url
    if item is None or not source:
        return result
    matches = hashlib.sha256(source.encode("utf-8")).hexdigest() == item["source_sha256"]
    try:
        for supporting in item.get("supporting_sources", []):
            expected, current = _work_source(repo_root, supporting)
            matches = matches and current == expected["sha256"]
    except (ValueError, TypeError, KeyError):
        matches = False
    if not matches:
        result.update(status="outdated", message="Nieuw verslag beschikbaar; korte terugblik nog bijwerken.")
        return result
    result.update(status="current", highlights=item["highlights"], message="Terugblik gecontroleerd tegen het beschikbare verslag.")
    return result


def _redact_report_text(raw):
    """Plain-text reading copy: omit delivery sections and redact private details."""
    private = re.compile(r"(?i)(?:\b(?:e-?mail|mailstatus|gmail|smtp|delivery|recipient|ontvanger|bezorging|bezorgd|verzonden|verstuurd|aflevering|message[-_ ]?id|sent)\b|\b(?:to|cc|bcc)\s*:|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,})")
    private_line = re.compile(r"(?i)(?:\b(?:e-?mail|mailstatus|delivery|recipient|ontvanger|bezorgd|verzonden|verstuurd|aflevering|message[-_ ]?id|gmail(?:[_ -]?(?:message|thread))?[_ -]?id|sent)\b|\b(?:to|cc|bcc)\s*:|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,})")
    result, skip_depth = [], None
    for line in raw.splitlines():
        heading = re.match(r"^\s*(#{1,6})\s+(.+?)\s*#*\s*$", line)
        if heading:
            depth = len(heading[1])
            if skip_depth is not None and depth <= skip_depth:
                skip_depth = None
            if private.search(heading[2]):
                skip_depth = depth if skip_depth is None else skip_depth
        if skip_depth is not None or private_line.search(line):
            continue
        line = re.sub(r"(?i)(?:/(?:Users|home|private|var|tmp|Volumes)/|[A-Z]:\\Users\\).*", "[lokaal pad weggelaten]", line)
        line = re.sub(r'https?://[^\s<>"\']+', lambda match: _work_url(match.group()) or "[link weggelaten]", line)
        line = re.sub(r"(?i)\b(?:bearer\s+\S+|(?:sk|ghp|github_pat|art_v1)[_-][A-Za-z0-9_-]+)", "[geheim weggelaten]", line)
        line = re.sub(r"(?i)\b[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}\b", "[identificatie weggelaten]", line)
        line = re.sub(r"(?i)\b(?:team|prj|dpl|org|acct|account|user|thread|client|campaign|contact)[_-][A-Za-z0-9_-]{6,}\b", "[identificatie weggelaten]", line)
        line = re.sub(r"(?i)\b(?:[A-Z0-9_]*(?:TOKEN|SECRET|PASSWORD|API_KEY|ACCESS_KEY)|(?:account|team|project|user)[_ -]?id)\s*[:=]\s*(?:\"[^\"]*\"|'[^']*'|[^,\s;]+)", "[privégegeven weggelaten]", line)
        line = re.sub(r"\b(?:r-)?[a-f0-9]{16,}\b", "[identificatie weggelaten]", line)
        result.append(line)
    return "\n".join(result).strip()


def read_routine_report(repo_root, routine_id):
    """Only the latest weekly/monthly report; no paths or automation memory input."""
    routine = next((item for item in ROUTINES if item[0] == routine_id and item[4] in {"weekly", "monthly"}), None)
    if routine is None:
        raise KeyError("Geen leesverslag voor deze routine.")
    prefix = "sitecheck-" if routine[4] == "weekly" else "site-automation-apk-"
    date, path, raw = _latest_report(repo_root, prefix)
    if not raw:
        raise FileNotFoundError("Geen veilig leesbaar verslag beschikbaar.")
    return {"title": _safe(routine[1], 200), "date": date,
            "source": path.relative_to(repo_root).as_posix(), "text": _redact_report_text(raw)}


def _agents(state_dir):
    snapshot = _json(state_dir / "agents.json")
    unavailable = [{"name": "Codex", "status": "Geen momentopname", "role": "Uitvoering van taken",
                    "updated_at": None, "detail": "Er is geen recente agentstatus aangeleverd. Dit scherm leest geen sessiedatabase."}]
    if not isinstance(snapshot, dict) or not isinstance(snapshot.get("agents"), list):
        return unavailable
    stamp = snapshot.get("updated_at")
    try:
        parsed = datetime.fromisoformat(stamp.replace("Z", "+00:00"))
        if parsed.tzinfo is None:
            return unavailable
        age = (_now() - parsed).total_seconds()
    except (ValueError, TypeError, AttributeError):
        return unavailable
    stale = age > MAX_AGENT_AGE_SECONDS or age < -60
    labels = {"running": "Actief bij vastleggen", "active": "Actief bij vastleggen", "idle": "Beschikbaar bij vastleggen",
              "completed": "Afgerond bij vastleggen", "complete": "Afgerond bij vastleggen", "done": "Afgerond bij vastleggen",
              "waiting": "Wachtte bij vastleggen", "blocked": "Aandacht nodig bij vastleggen", "failed": "Fout bij vastleggen"}
    agents = []
    for item in snapshot["agents"][:20]:
        if not isinstance(item, dict) or not isinstance(item.get("name"), str):
            continue
        status = item.get("status") if isinstance(item.get("status"), str) else ""
        agents.append({"name": _safe(item["name"], 120),
                       "status": "Momentopname verouderd" if stale else labels.get(status, "Status onbekend bij vastleggen"),
                       "role": _safe(item.get("role", "Uitvoering van een taak"), 250), "updated_at": _iso(parsed),
                       "detail": "Momentopname; geen live verbinding met deze agent. " + ("Ververs de momentopname om recente activiteit te zien." if stale else "Activiteit kan sinds het vastleggen zijn veranderd.")})
    return agents or unavailable


def _with_checks(tasks, state_dir):
    stored = _json(state_dir / "task_checks.json")
    checks = stored.get("checks", {}) if isinstance(stored, dict) and stored.get("version") == 1 else {}
    if not isinstance(checks, dict):
        checks = {}
    for task in tasks:
        record = checks.get(task["id"], {})
        if task["can_check"] and isinstance(record, dict) and record.get("source_sha256") == task["_fingerprint"]:
            task["checked"] = record.get("checked") is True
            task["note"] = record.get("note", "")[:MAX_NOTE] if isinstance(record.get("note"), str) else ""
            task["checked_at"] = record.get("updated_at")
        task.pop("_fingerprint", None)
    return tasks


def _raw_tasks(repo_root):
    work = _work_tasks(repo_root)
    reports = [report for report in _report_tasks(repo_root) if not any(
        item.get("replaces_report") == report["id"] and not item["evidence_changed"]
        and any(source["path"] == report["source"] for source in item.get("sources", []))
        for item in work)]
    return _page_tasks(repo_root) + reports + work


def _work_url(value):
    """No credential-bearing URLs or links to private network services."""
    if not isinstance(value, str) or not value or len(value) > 1500 or any(ord(c) < 33 for c in value):
        return None
    try:
        parsed = urlsplit(value)
        host = parsed.hostname or ""
        if (parsed.scheme != "https" or parsed.username is not None or parsed.password is not None
                or parsed.query or parsed.fragment or parsed.port not in (None, 443)
                or not re.fullmatch(r"[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?\.[a-z]{2,}", host)
                or host.endswith((".localhost", ".local", ".internal", ".test"))
                or "\\" in value
                or re.search(r"(?i)(?:token|api[-_]key|secret|password|credential|bearer|sk_|github_pat_)", parsed.path)
                or any(len(segment) > 100 for segment in parsed.path.split("/"))):
            return None
        return value
    except ValueError:
        return None


def _work_text(value, limit):
    if not isinstance(value, str) or not value.strip() or len(value) > limit or "\x00" in value:
        raise ValueError("Ongeldige taaktekst.")
    value = re.sub(r'https?://[^\s<>"\']+', lambda match: _work_url(match.group()) or "[link weggelaten]", value)
    result = _safe(value, limit)
    if not result:
        raise ValueError("Lege taaktekst.")
    return result


def _work_source(repo_root, value):
    if not isinstance(value, dict) or set(value) != {"path", "sha256"}:
        raise ValueError("Ongeldige bewijsbron.")
    relative, expected = value["path"], value["sha256"]
    if (not isinstance(relative, str) or len(relative) > 250 or not relative
            or not re.fullmatch(r"[A-Za-z0-9_ ./-]+", relative)):
        raise ValueError("Ongeldig bronpad.")
    parts = relative.split("/")
    if (relative.startswith("/") or any(part in ("", ".", "..", ".git", ".codex") or part.lower().startswith(".env") for part in parts)
            or any(ord(c) < 32 for c in relative) or relative.startswith("local-admin/state/")
            or not isinstance(expected, str) or not re.fullmatch(r"[a-f0-9]{64}", expected)):
        raise ValueError("Ongeldig bronpad of vingerafdruk.")
    root = Path(repo_root).resolve()
    candidate = root / relative
    try:
        resolved = candidate.resolve()
        if not resolved.is_relative_to(root):
            raise ValueError("Bewijsbron ligt buiten het project.")
        # Hash bytes only. Source content and private data never enter the response.
        if not resolved.is_file() or resolved.stat().st_size > MAX_SOURCE_BYTES:
            current = None
        else:
            current = hashlib.sha256(resolved.read_bytes()).hexdigest()
    except (OSError, RuntimeError):
        current = None
    return {"path": relative, "sha256": expected}, current


def _work_tasks(repo_root):
    """Curated workflow states are evidence-bound, separate from medical review."""
    root = Path(repo_root).resolve()
    path = root / WORK_ITEMS_FILE
    if not path.exists() and not path.is_symlink():
        return []
    raw = None
    try:
        if not path.resolve().is_relative_to(root):
            raise ValueError("Catalogus ligt buiten het project.")
        raw = _text(path, MAX_WORK_CATALOG_BYTES)
        data = json.loads(raw) if raw is not None else None
        if (not isinstance(data, dict) or set(data) != {"version", "reviewed_at", "items"}
                or type(data.get("version")) is not int or data["version"] != 1
                or not isinstance(data.get("items"), list) or len(data["items"]) > MAX_WORK_ITEMS
                or not isinstance(data.get("reviewed_at"), str) or len(data["reviewed_at"]) > 40):
            raise ValueError("Ongeldige werkcatalogus.")
        timestamp = datetime.fromisoformat(data["reviewed_at"].replace("Z", "+00:00"))
        if timestamp.tzinfo is None:
            raise ValueError("Beoordelingsdatum mist tijdzone.")
        tasks, ids = [], set()
        required = {"id", "title", "category", "status", "status_label", "detail", "next_action", "priority", "sources"}
        for item in data["items"]:
            if not isinstance(item, dict) or not required <= set(item) or not set(item) <= required | {"url", "replaces_report"}:
                raise ValueError("Ongeldige werktaak.")
            task_id = item["id"]
            if not isinstance(task_id, str) or not re.fullmatch(r"work-[a-z0-9-]{1,140}", task_id) or task_id in ids:
                raise ValueError("Dubbel of ongeldig taaknummer.")
            ids.add(task_id)
            if "replaces_report" in item and item["replaces_report"] not in {"report-latest-sitecheck", "report-latest-apk"}:
                raise ValueError("Onbekende vervangende verslagtaak.")
            if (item["status"] not in {"open", "waiting", "later", "done"}
                    or type(item["priority"]) is not int or item["priority"] not in (1, 2, 3)
                    or not isinstance(item["sources"], list) or not 1 <= len(item["sources"]) <= 12):
                raise ValueError("Ongeldige werkstatus of bewijsbronnen.")
            title = _work_text(item["title"], 200)
            category = _work_text(item["category"], 80)
            label = _work_text(item["status_label"], 80)
            detail = _work_text(item["detail"], 1000)
            next_action = _work_text(item["next_action"], 600)
            evidence = [_work_source(root, source) for source in item["sources"]]
            if len({source["path"] for source, _ in evidence}) != len(evidence):
                raise ValueError("Dubbele bewijsbron.")
            changed = any(current != source["sha256"] for source, current in evidence)
            status = "open" if changed else item["status"]
            url = _work_url(item.get("url"))
            task = _task(task_id, title, category, "Status opnieuw controleren" if changed else label,
                         ", ".join(source["path"] for source, _ in evidence), detail,
                         _digest(item, data["reviewed_at"], evidence), url=url, can_check=status != "done")
            task.update(kind="work", workflow_status=status, next_action=next_action, priority=item["priority"],
                        reviewed_at=data["reviewed_at"], evidence_changed=changed,
                        sources=[source for source, _ in evidence])
            if "replaces_report" in item:
                task["replaces_report"] = item["replaces_report"]
            tasks.append(task)
        return tasks
    except (ValueError, TypeError, KeyError, OSError, RuntimeError):
        task = _task("work-catalog-check", "Werkcatalogus controleren", "Status vaststellen", "Bron onleesbaar",
                     WORK_ITEMS_FILE, "De werkcatalogus is niet volledig of niet veilig leesbaar. Controleer de bron voordat je taken als afgerond beschouwt.",
                     _digest("work-catalog-invalid", raw), can_check=True)
        task.update(kind="work", workflow_status="open", next_action="Controleer de werkcatalogus en de verwijzingen naar bewijsbronnen.",
                    priority=1, reviewed_at=None, evidence_changed=True)
        return [task]


def build_dashboard(repo_root: Path, state_dir: Path):
    """Refresh sources on every request; only stored 'viewed' markers are reused."""
    repo_root, state_dir = Path(repo_root), Path(state_dir)
    try:
        from analytics import read_analytics
        analytics = read_analytics(repo_root, state_dir)
    except (ImportError, OSError, ValueError, TypeError):
        analytics = {"status": "Niet beschikbaar", "message": "Er zijn geen gecontroleerde bezoekcijfers beschikbaar."}
    from search_console import read_search_console
    search_console = read_search_console(state_dir)
    from ideas import read_ideas, idea_tasks
    ideas = read_ideas(repo_root, state_dir)
    return {"generated_at": _iso(_now()), "tasks": _with_checks(_raw_tasks(repo_root), state_dir) + idea_tasks(ideas),
            "routines": _routines(repo_root), "agents": _agents(state_dir), "analytics": analytics, "ideas": ideas, "search_console": search_console}


@contextmanager
def _state_lock(state_dir):
    state_dir.mkdir(parents=True, exist_ok=True, mode=0o700)
    if state_dir.is_symlink():
        raise ValueError("De opslagmap mag geen symbolische koppeling zijn.")
    os.chmod(state_dir, 0o700)
    lock_path = state_dir / ".task_checks.lock"
    if lock_path.is_symlink():
        raise ValueError("Ongeldig slotbestand.")
    fd = os.open(lock_path, os.O_CREAT | os.O_RDWR, 0o600)
    try:
        fcntl.flock(fd, fcntl.LOCK_EX)
        yield
    finally:
        fcntl.flock(fd, fcntl.LOCK_UN)
        os.close(fd)


def _atomic_json(path, data):
    if path.is_symlink():
        raise ValueError("Het opslagbestand mag geen symbolische koppeling zijn.")
    fd, temporary = tempfile.mkstemp(prefix=".task-checks-", suffix=".tmp", dir=path.parent)
    try:
        os.fchmod(fd, 0o600)
        with os.fdopen(fd, "w", encoding="utf-8") as file:
            json.dump(data, file, ensure_ascii=False, indent=2)
            file.write("\n")
            file.flush()
            os.fsync(file.fileno())
        os.replace(temporary, path)
        directory = os.open(path.parent, os.O_RDONLY)
        try:
            os.fsync(directory)
        finally:
            os.close(directory)
    finally:
        if os.path.exists(temporary):
            os.unlink(temporary)


def set_task_check(repo_root: Path, state_dir: Path, task_id, checked, note=None):
    """Mark only a current, recognized task as viewed; never grant medical approval."""
    if not isinstance(task_id, str) or not re.fullmatch(r"[a-z0-9-]{1,150}", task_id):
        raise ValueError("Onbekende taak.")
    if type(checked) is not bool or (note is not None and (not isinstance(note, str) or len(note) > MAX_NOTE or "\x00" in note)):
        raise ValueError("Gebruik een geldig bekeken-vinkje en een notitie van maximaal 2000 tekens.")
    repo_root, state_dir = Path(repo_root), Path(state_dir)
    with _state_lock(state_dir):
        tasks = {task["id"]: task for task in _raw_tasks(repo_root)}
        task = tasks.get(task_id)
        if not task or not task["can_check"]:
            raise ValueError("Deze taak kan niet als bekeken worden gemarkeerd.")
        path = state_dir / "task_checks.json"
        stored = _json(path)
        if path.exists() and (not isinstance(stored, dict) or stored.get("version") != 1 or not isinstance(stored.get("checks"), dict)):
            raise ValueError("Bestaande taaknotities zijn niet leesbaar; er is niets overschreven.")
        checks = stored["checks"] if stored else {}
        # Keep only known tasks to bound private storage and avoid reviving removed work.
        checks = {key: value for key, value in checks.items() if key in tasks}
        if note is None:
            previous = checks.get(task_id)
            prior_note = previous.get("note") if isinstance(previous, dict) else None
            same_source = isinstance(previous, dict) and previous.get("source_sha256") == task["_fingerprint"]
            note = prior_note if (same_source and isinstance(prior_note, str)
                                  and len(prior_note) <= MAX_NOTE and "\x00" not in prior_note) else ""
        checks[task_id] = {"checked": checked, "note": note.strip(), "updated_at": _iso(_now()),
                           "source_sha256": task["_fingerprint"]}
        _atomic_json(path, {"version": 1, "checks": checks})
    return _with_checks([task], state_dir)[0]
