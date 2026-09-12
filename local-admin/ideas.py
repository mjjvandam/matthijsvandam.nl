"""Curated local ideas and explicit owner choices; no execution or learning loop."""
from __future__ import annotations

from contextlib import contextmanager
from datetime import datetime, timezone
import fcntl
import hashlib
import json
import os
from pathlib import Path
import re
import tempfile

from inventory import _work_source, _work_text, _work_url

CATALOG = "local-admin/ideas-catalog.json"
CHOICES = {"new", "saved", "todo", "dismissed"}
PERSPECTIVES = {"Ondernemer", "ICT’er", "Arts / verwijzer", "Patiënt", "Redacteur / ontwerper"}
CATEGORIES = {"Contact & nieuwsbrief", "Inhoud & redactie", "Techniek & vindbaarheid", "Beheer & routines"}
ID = re.compile(r"[a-z0-9][a-z0-9-]{0,79}")
SHA = re.compile(r"[a-f0-9]{64}")


class IdeasError(ValueError):
    pass


class IdeasConflict(IdeasError):
    def __init__(self, message, current):
        super().__init__(message)
        self.current = current


def _hash(value):
    return hashlib.sha256(json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode()).hexdigest()


def _timestamp(value):
    if not isinstance(value, str) or len(value) > 40:
        raise ValueError("Ongeldig tijdstip.")
    parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
    if parsed.tzinfo is None:
        raise ValueError("Een tijdzone is vereist.")
    return value


def _json_file(path, max_bytes):
    if path.is_symlink() or not path.is_file() or path.stat().st_size > max_bytes:
        raise ValueError("Bestand niet veilig leesbaar.")
    def unique_keys(pairs):
        result = {}
        for key, value in pairs:
            if key in result:
                raise ValueError("Dubbele JSON-sleutel.")
            result[key] = value
        return result
    return json.loads(path.read_text(encoding="utf-8"), object_pairs_hook=unique_keys)


def _catalog(repo):
    root = Path(repo).resolve()
    path = root / CATALOG
    try:
        if not path.resolve().is_relative_to(root):
            raise ValueError("Ongeldig cataloguspad.")
        data = _json_file(path, 250_000)
        if (not isinstance(data, dict) or set(data) != {"version", "updated_at", "items"}
                or type(data["version"]) is not int or data["version"] != 1
                or not isinstance(data["items"], list) or len(data["items"]) > 30):
            raise ValueError("Ongeldige catalogus.")
        _timestamp(data["updated_at"])
        result, ids = [], set()
        required = {"id", "title", "perspectives", "category", "kind", "why", "proposal", "first_step",
                    "effort", "tradeoff", "success_check", "evidence", "priority", "reviewed_at"}
        for original in data["items"]:
            if not isinstance(original, dict) or set(original) != required:
                raise ValueError("Onvolledig idee.")
            item = dict(original)
            if not isinstance(item["id"], str) or not ID.fullmatch(item["id"]) or item["id"] in ids:
                raise ValueError("Dubbel of ongeldig idee.")
            ids.add(item["id"])
            if (not isinstance(item["perspectives"], list) or not 1 <= len(item["perspectives"]) <= 5
                    or any(not isinstance(value, str) or value not in PERSPECTIVES for value in item["perspectives"])
                    or len(set(item["perspectives"])) != len(item["perspectives"])
                    or item["category"] not in CATEGORIES or item["kind"] not in {"tool", "growth", "content", "experience", "agent", "skill", "simplify"}
                    or item["effort"] not in {"Klein", "Middel", "Groot"}
                    or type(item["priority"]) is not int or item["priority"] not in (1, 2, 3)):
                raise ValueError("Ongeldig ideeveld.")
            for name, limit in (("title", 180), ("why", 700), ("proposal", 1000), ("first_step", 600),
                                ("tradeoff", 700), ("success_check", 600)):
                item[name] = _work_text(item[name], limit)
            _timestamp(item["reviewed_at"])
            if not isinstance(item["evidence"], list) or not 1 <= len(item["evidence"]) <= 8:
                raise ValueError("Ongeldige onderbouwing.")
            evidence = []
            for source in item["evidence"]:
                if not isinstance(source, dict) or set(source) not in ({"label", "url"}, {"label", "path"}):
                    raise ValueError("Ongeldige verwijzing.")
                label = _work_text(source["label"], 160)
                if "url" in source:
                    url = _work_url(source["url"])
                    if url is None:
                        raise ValueError("Onveilig linkadres.")
                    evidence.append({"label": label, "url": url})
                else:
                    checked, actual = _work_source(root, {"path": source["path"], "sha256": "0" * 64})
                    if actual is None:
                        raise ValueError("Onderbouwing ontbreekt.")
                    evidence.append({"label": label, "path": checked["path"]})
            item["evidence"] = evidence
            item["version"] = _hash(item)
            result.append(item)
        return {"updated_at": data["updated_at"], "items": result}
    except (OSError, UnicodeError, ValueError, TypeError, KeyError, RuntimeError) as exc:
        raise IdeasError("De ideeëncatalogus ontbreekt of is niet veilig leesbaar. Er zijn geen ideeën of keuzes gewijzigd.") from exc


def _state(state_dir):
    path = Path(state_dir) / "ideas.json"
    try:
        if Path(state_dir).is_symlink():
            raise ValueError("Ongeldige opslagmap.")
        if not path.exists() and not path.is_symlink():
            return {"version": 1, "choices": {}}
        data = _json_file(path, 200_000)
        if (not isinstance(data, dict) or set(data) != {"version", "choices"} or type(data["version"]) is not int
                or data["version"] != 1 or not isinstance(data["choices"], dict) or len(data["choices"]) > 300):
            raise ValueError("Ongeldige ideeënopslag.")
        for idea_id, record in data["choices"].items():
            if (not ID.fullmatch(idea_id) or not isinstance(record, dict)
                    or set(record) != {"choice", "version", "revision", "updated_at"}
                    or record["choice"] not in CHOICES or not isinstance(record["version"], str)
                    or not SHA.fullmatch(record["version"]) or type(record["revision"]) is not int
                    or not 1 <= record["revision"] <= 1_000_000):
                raise ValueError("Ongeldige idee-keuze.")
            _timestamp(record["updated_at"])
        return data
    except (OSError, UnicodeError, ValueError, TypeError, KeyError, RuntimeError) as exc:
        raise IdeasError("De opgeslagen ideeënkeuzes zijn niet veilig leesbaar. Er is niets overschreven; laat de lokale opslag controleren.") from exc


def _choice_version(idea_id, record):
    return _hash({"id": idea_id, "record": record})


def _snapshot(catalog, state):
    result = []
    for item in catalog["items"]:
        record = state["choices"].get(item["id"])
        stale = bool(record and record["version"] != item["version"])
        result.append({**item, "choice": record["choice"] if record and not stale else "new",
                       "choice_stale": stale, "previous_choice": record["choice"] if stale else None,
                       "choice_version": _choice_version(item["id"], record),
                       "updated_at": record["updated_at"] if record else None})
    return {"items": result, "updated_at": catalog["updated_at"], "mode": "curated",
            "replenishment": {"new_count": sum(item["choice"] == "new" for item in result),
                              "needed": sum(item["choice"] == "new" for item in result) < 3,
                              "max_additions": 3}}


def read_ideas(repo, state_dir):
    try:
        return _snapshot(_catalog(repo), _state(state_dir))
    except IdeasError as exc:
        return {"items": [], "updated_at": None, "mode": "curated", "error": str(exc)}


def idea_tasks(snapshot):
    """A choice creates a single research task, never an execution instruction."""
    return [{"id": "idea-" + item["id"], "idea_id": item["id"], "kind": "idea", "title": item["title"],
             "category": item["category"], "status": "Idee om te onderzoeken", "workflow_status": "open",
             "next_action": item["first_step"], "detail": item["proposal"], "priority": item["priority"],
             "source": "Frisse blik · handmatig gekozen idee", "reviewed_at": item["reviewed_at"],
             "can_check": False, "checked": False, "note": ""}
            for item in snapshot.get("items", []) if item["choice"] == "todo" and not item.get("choice_stale")]


@contextmanager
def _lock(state_dir):
    state_dir = Path(state_dir)
    if state_dir.is_symlink():
        raise IdeasError("De opslagmap mag geen symbolische koppeling zijn.")
    state_dir.mkdir(parents=True, exist_ok=True, mode=0o700)
    state_dir.chmod(0o700)
    lock = state_dir / ".ideas.lock"
    if lock.is_symlink():
        raise IdeasError("Ongeldig slotbestand voor ideeënkeuzes.")
    descriptor = os.open(lock, os.O_RDWR | os.O_CREAT, 0o600)
    try:
        fcntl.flock(descriptor, fcntl.LOCK_EX)
        yield
    finally:
        fcntl.flock(descriptor, fcntl.LOCK_UN)
        os.close(descriptor)


def _save(state_dir, data):
    path = Path(state_dir) / "ideas.json"
    if path.is_symlink():
        raise IdeasError("Het opslagbestand mag geen symbolische koppeling zijn.")
    raw = json.dumps(data, ensure_ascii=False, indent=2) + "\n"
    if len(raw.encode()) > 200_000 or len(data["choices"]) > 300:
        raise IdeasError("De ideeënopslag is vol. Laat deze controleren voordat er nieuwe keuzes worden bewaard.")
    descriptor, temporary = tempfile.mkstemp(prefix=".ideas-", suffix=".tmp", dir=state_dir)
    try:
        os.fchmod(descriptor, 0o600)
        with os.fdopen(descriptor, "w", encoding="utf-8") as stream:
            stream.write(raw)
            stream.flush()
            os.fsync(stream.fileno())
        os.replace(temporary, path)
        folder = os.open(state_dir, os.O_RDONLY)
        try:
            os.fsync(folder)
        finally:
            os.close(folder)
    finally:
        if os.path.exists(temporary):
            os.unlink(temporary)


def choose_idea(repo, state_dir, idea_id, choice, version, choice_version):
    if (not isinstance(idea_id, str) or not ID.fullmatch(idea_id) or not isinstance(choice, str) or choice not in CHOICES
            or not isinstance(version, str) or not SHA.fullmatch(version)
            or not isinstance(choice_version, str) or not SHA.fullmatch(choice_version)):
        raise IdeasError("Kies een geldige actie voor het actuele idee.")
    # Catalog is validated before creating any private storage or lock file.
    _catalog(repo)
    with _lock(state_dir):
        catalog, state = _catalog(repo), _state(state_dir)
        current = _snapshot(catalog, state)
        item = next((item for item in current["items"] if item["id"] == idea_id), None)
        if item is None:
            raise IdeasConflict("Dit idee staat niet meer in de actuele selectie. Vernieuw het overzicht.", current)
        if item["version"] != version:
            raise IdeasConflict("Dit idee is gewijzigd. Bekijk de actuele tekst voordat je opnieuw kiest.", current)
        # Retried identical choices are harmless and must never add duplicate tasks.
        if item["choice"] == choice and not item["choice_stale"]:
            return current
        if item["choice_version"] != choice_version:
            raise IdeasConflict("Je keuze is inmiddels in een ander venster aangepast. Vernieuw het overzicht.", current)
        previous = state["choices"].get(idea_id)
        if previous and previous["revision"] >= 1_000_000:
            raise IdeasError("De keuzehistorie heeft de opslaggrens bereikt. Laat de lokale opslag controleren.")
        state["choices"][idea_id] = {"choice": choice, "version": version,
                                     "revision": previous["revision"] + 1 if previous else 1,
                                     "updated_at": datetime.now(timezone.utc).isoformat(timespec="microseconds")}
        _save(state_dir, state)
        return _snapshot(catalog, state)
