#!/usr/bin/env python3
"""Local owner pilot. Standard library only. Never writes public website files.

Local machine access is the owner boundary: this is not a multiuser login system.
The HTTP server binds only to 127.0.0.1 and rejects foreign hosts and origins.
"""
from __future__ import annotations

import argparse
from contextlib import contextmanager
from datetime import datetime, timezone
from http.cookies import SimpleCookie
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import html
import json
import mimetypes
import os
from pathlib import Path
import re
import secrets
import sqlite3
import sys
import threading
import tempfile
import time
import webbrowser
import zipfile
from urllib.parse import parse_qs, unquote, urlsplit

from content_model import (PILOT_ID, ValidationError, asset_paths, canonical, digest,
                           fingerprint, import_article, preview_html, protect_preview, render_article,
                           render_card, render_content_js, validate_document)
from article_status import publication_status, working_copy_status

REPO_ROOT = Path(__file__).resolve().parent.parent
MAX_BODY = 250000


def now():
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


class Conflict(Exception):
    pass


class Store:
    def __init__(self, repo=REPO_ROOT, state_dir=None):
        self.repo = Path(repo).resolve()
        supplied_state = Path(state_dir or self.repo / "local-admin/state")
        if supplied_state.is_symlink():
            raise ValidationError("De opslagmap mag geen symbolische koppeling zijn.")
        self.state_dir = supplied_state.resolve()
        if self.state_dir.is_relative_to(self.repo) and not self.state_dir.is_relative_to(self.repo / "local-admin/state"):
            raise ValidationError("Bewaar beheerdata binnen local-admin/state of een afzonderlijke tijdelijke map.")
        self.state_dir.mkdir(parents=True, exist_ok=True, mode=0o700)
        self.state_dir.chmod(0o700)
        self.db = self.state_dir / "editorial.sqlite3"
        if self.db.is_symlink():
            raise ValidationError("Het opslagbestand mag geen symbolische koppeling zijn.")
        self.initialize()
        self.db.chmod(0o600)

    @contextmanager
    def connection(self, write=False):
        con = sqlite3.connect(self.db, timeout=15)
        con.row_factory = sqlite3.Row
        con.execute("PRAGMA foreign_keys=ON")
        try:
            if write:
                con.execute("BEGIN IMMEDIATE")
            yield con
            con.commit()
        except Exception:
            con.rollback()
            raise
        finally:
            con.close()

    def initialize(self):
        with self.connection() as con:
            con.executescript("""
                CREATE TABLE IF NOT EXISTS articles (
                    id TEXT PRIMARY KEY, model TEXT NOT NULL, revision INTEGER NOT NULL,
                    status TEXT NOT NULL, updated_at TEXT NOT NULL,
                    submitted TEXT, approval TEXT);
                CREATE TABLE IF NOT EXISTS revisions (
                    article_id TEXT NOT NULL REFERENCES articles(id), revision INTEGER NOT NULL,
                    document TEXT NOT NULL, source_hash TEXT NOT NULL,
                    at TEXT NOT NULL, actor TEXT NOT NULL, action TEXT NOT NULL, note TEXT NOT NULL,
                    PRIMARY KEY(article_id, revision));
                CREATE TABLE IF NOT EXISTS events (
                    id INTEGER PRIMARY KEY, article_id TEXT NOT NULL REFERENCES articles(id),
                    revision INTEGER NOT NULL, action TEXT NOT NULL, at TEXT NOT NULL,
                    actor TEXT NOT NULL, note TEXT NOT NULL, detail TEXT NOT NULL);
                CREATE TRIGGER IF NOT EXISTS immutable_revisions_update BEFORE UPDATE ON revisions
                    BEGIN SELECT RAISE(ABORT,'Revisions are immutable'); END;
                CREATE TRIGGER IF NOT EXISTS immutable_revisions_delete BEFORE DELETE ON revisions
                    BEGIN SELECT RAISE(ABORT,'Revisions are immutable'); END;
                CREATE TRIGGER IF NOT EXISTS immutable_events_update BEFORE UPDATE ON events
                    BEGIN SELECT RAISE(ABORT,'Events are immutable'); END;
                CREATE TRIGGER IF NOT EXISTS immutable_events_delete BEFORE DELETE ON events
                    BEGIN SELECT RAISE(ABORT,'Events are immutable'); END;
            """)
        with self.connection(write=True) as con:
            if con.execute("SELECT 1 FROM articles WHERE id=?", (PILOT_ID,)).fetchone():
                return
            model = import_article(self.repo)
            at, document = now(), canonical(model["baseline"])
            con.execute("INSERT INTO articles VALUES (?,?,?,?,?,?,?)",
                        (PILOT_ID, canonical(model), 1, "Concept", at, None, None))
            con.execute("INSERT INTO revisions VALUES (?,?,?,?,?,?,?,?)",
                        (PILOT_ID, 1, document, digest(document), at, "Codex import", "Import", "Geïsoleerde kopie van bestaand artikel; geen historische nulversie."))
            self.event(con, PILOT_ID, 1, "Import", "Codex import", "Bestaande publieke bron ongewijzigd.")

    @staticmethod
    def event(con, article_id, revision, action, actor, note="", detail=None):
        con.execute("INSERT INTO events(article_id,revision,action,at,actor,note,detail) VALUES (?,?,?,?,?,?,?)",
                    (article_id, revision, action, now(), actor, note, canonical(detail or {})))

    @staticmethod
    def row(con, article_id):
        row = con.execute("SELECT * FROM articles WHERE id=?", (article_id,)).fetchone()
        if row is None:
            raise KeyError(article_id)
        return row

    @staticmethod
    def check_revision(row, base_revision):
        if type(base_revision) is not int or base_revision != row["revision"]:
            raise Conflict("Deze pagina heeft inmiddels een andere versie. Vergelijk de wijzigingen voordat je opnieuw opslaat.")

    def get(self, article_id, revision=None):
        with self.connection() as con:
            row = self.row(con, article_id)
            revision = revision or row["revision"]
            item = con.execute("SELECT * FROM revisions WHERE article_id=? AND revision=?", (article_id, revision)).fetchone()
            if item is None:
                raise KeyError("Onbekende revisie")
            model, document = json.loads(row["model"]), json.loads(item["document"])
            approval = json.loads(row["approval"]) if row["approval"] else None
            status = row["status"] if revision == row["revision"] else "Historische versie"
            dependency_error = None
            try:
                current_fingerprint = fingerprint(model, document, self.repo)
            except ValidationError as exc:
                current_fingerprint = None
                dependency_error = str(exc)
            if approval:
                approval["valid"] = bool(current_fingerprint and approval["revision"] == revision and approval["fingerprint"] == current_fingerprint["hash"])
                if not approval["valid"] and status == "Goedgekeurd":
                    status = "Akkoord vervallen"
            history = [dict(event) for event in con.execute(
                "SELECT revision,action,at,actor,note FROM events WHERE article_id=? ORDER BY id DESC", (article_id,))]
            source_path = self.repo / model["path"]
            return {"id": article_id, "revision": revision, "latest_revision": row["revision"],
                    "status": status, "updated_at": row["updated_at"], "document": document,
                    "baseline": model["baseline"], "history": history, "approval": approval,
                    "url": "https://matthijsvandam.nl/" + model["path"],
                    "preview_url": f"/preview/{article_id}?revision={revision}",
                    "source_drift": not source_path.exists() or digest(source_path.read_bytes()) != digest(model["template"]),
                    "dependency_error": dependency_error,
                    "local_only": True, "published": False,
                    "publication": publication_status(self.repo, model),
                    "working_copy": working_copy_status(self.repo, model, document),
                    "card": render_card(model, document)}

    def list(self):
        with self.connection() as con:
            ids = [row[0] for row in con.execute("SELECT id FROM articles ORDER BY updated_at DESC")]
        return [{key: article[key] for key in ("id", "url", "revision", "status", "updated_at", "publication", "working_copy")} |
                {"title": article["document"]["title"]} for article in (self.get(i) for i in ids)]

    def model_document(self, article_id, revision=None):
        with self.connection() as con:
            row = self.row(con, article_id)
            item = con.execute("SELECT document FROM revisions WHERE article_id=? AND revision=?",
                               (article_id, revision or row["revision"])).fetchone()
            if item is None:
                raise KeyError("Onbekende revisie")
            return json.loads(row["model"]), json.loads(item[0])

    def save(self, article_id, base_revision, document, actor="Matthijs (lokale eigenaar)", action="Opgeslagen", note=""):
        with self.connection(write=True) as con:
            row = self.row(con, article_id)
            self.check_revision(row, base_revision)
            model = json.loads(row["model"])
            validate_document(document, model["baseline"])
            encoded = canonical(document)
            previous = con.execute("SELECT document FROM revisions WHERE article_id=? AND revision=?", (article_id, base_revision)).fetchone()[0]
            if encoded == previous and action != "Hersteld":
                return self.get(article_id)
            revision, at = base_revision + 1, now()
            con.execute("INSERT INTO revisions VALUES (?,?,?,?,?,?,?,?)", (article_id, revision, encoded, digest(encoded), at, actor, action, note))
            con.execute("UPDATE articles SET revision=?,status='Concept',updated_at=?,submitted=NULL,approval=NULL WHERE id=?", (revision, at, article_id))
            self.event(con, article_id, revision, action, actor, note)
        return self.get(article_id)

    def action(self, article_id, action, base_revision, note="", restore_revision=None, actor="Matthijs (lokale eigenaar)"):
        if not isinstance(note, str) or len(note) > 4000:
            raise ValidationError("Een toelichting mag maximaal 4000 tekens bevatten.")
        if action == "restore":
            if type(restore_revision) is not int or restore_revision < 1:
                raise ValidationError("Kies een geldige eerdere versie.")
            _, document = self.model_document(article_id, restore_revision)
            return self.save(article_id, base_revision, document, actor, "Hersteld", f"Versie {restore_revision} hersteld als nieuwe versie. " + note)
        with self.connection(write=True) as con:
            row = self.row(con, article_id)
            self.check_revision(row, base_revision)
            model = json.loads(row["model"])
            document = json.loads(con.execute("SELECT document FROM revisions WHERE article_id=? AND revision=?", (article_id, base_revision)).fetchone()[0])
            if action == "submit":
                fp = fingerprint(model, document, self.repo)
                con.execute("UPDATE articles SET status='Ter beoordeling',submitted=?,approval=NULL,updated_at=? WHERE id=?", (canonical(fp), now(), article_id))
                self.event(con, article_id, base_revision, "Ter beoordeling", actor, note, fp)
            elif action == "approve":
                if row["status"] != "Ter beoordeling" or not row["submitted"]:
                    raise ValidationError("Bied de opgeslagen versie eerst ter beoordeling aan.")
                fp = fingerprint(model, document, self.repo)
                if fp["hash"] != json.loads(row["submitted"])["hash"]:
                    raise Conflict("De pagina of een afhankelijkheid is na het aanbieden gewijzigd. Bekijk de voorvertoning en bied opnieuw aan.")
                approval = {"revision": base_revision, "at": now(), "actor": actor,
                            "fingerprint": fp["hash"], "scope": "local-owner-pilot", "live": False}
                con.execute("UPDATE articles SET status='Goedgekeurd',approval=?,updated_at=? WHERE id=?", (canonical(approval), now(), article_id))
                self.event(con, article_id, base_revision, "Goedgekeurd", actor, note, {"approval": approval, "inputs": fp})
            elif action == "return":
                if not note.strip():
                    raise ValidationError("Geef een toelichting bij terugsturen.")
                con.execute("UPDATE articles SET status='Concept',submitted=NULL,approval=NULL,updated_at=? WHERE id=?", (now(), article_id))
                self.event(con, article_id, base_revision, "Teruggestuurd", actor, note.strip())
            else:
                raise ValidationError("Onbekende redactieactie.")
        return self.get(article_id)

    def prepare(self, article_id, base_revision, actor="Matthijs (lokale eigenaar)"):
        with self.connection(write=True) as con:
            row = self.row(con, article_id)
            self.check_revision(row, base_revision)
            model = json.loads(row["model"])
            document = json.loads(con.execute("SELECT document FROM revisions WHERE article_id=? AND revision=?", (article_id, base_revision)).fetchone()[0])
            fp = fingerprint(model, document, self.repo)
            approval = json.loads(row["approval"]) if row["approval"] else None
            if row["status"] != "Goedgekeurd" or not approval or approval["revision"] != base_revision or approval["fingerprint"] != fp["hash"]:
                raise Conflict("Een geldig akkoord voor deze exacte versie en afhankelijkheden ontbreekt.")
            export_dir = self.state_dir / "exports"
            if export_dir.is_symlink():
                raise ValidationError("De exportmap mag geen symbolische koppeling zijn.")
            export_dir.mkdir(parents=True, exist_ok=True, mode=0o700)
            archive_path = export_dir / f"{article_id}-r{base_revision}-{secrets.token_hex(8)}.zip"
            temporary_root = Path(tempfile.gettempdir()).resolve()
            if temporary_root.is_relative_to(self.repo):
                temporary_root = Path("/tmp").resolve()
            if temporary_root.is_relative_to(self.repo):
                raise ValidationError("Er is geen tijdelijke werkmap buiten de website beschikbaar.")
            archive_temp = None
            try:
                # Public-page validators walk every HTML file in the repository.
                # Stage outside it; only a private ZIP is retained in local state.
                with tempfile.TemporaryDirectory(prefix="mvd-admin-package-", dir=temporary_root) as staging:
                    folder = Path(staging)
                    for path in asset_paths(model, self.repo):
                        if path in {model["path"], "content.js"}:
                            continue
                        source, target = self.repo / path, folder / path
                        if not source.is_file():
                            raise ValidationError(f"Een weergavebestand ontbreekt: {path}")
                        data = source.read_bytes()
                        if digest(data) != fp["dependencies"][path]:
                            raise Conflict("Een weergavebestand veranderde tijdens het voorbereiden.")
                        target.parent.mkdir(parents=True, exist_ok=True)
                        target.write_bytes(data)
                    target = folder / model["path"]
                    target.parent.mkdir(parents=True, exist_ok=True)
                    target.write_text(render_article(model, document), encoding="utf-8")
                    (folder / "content.js").write_text(render_content_js(model, document, self.repo), encoding="utf-8")
                    (folder / "article.json").write_text(json.dumps(document, ensure_ascii=False, indent=2), encoding="utf-8")
                    (folder / "card.json").write_text(json.dumps(render_card(model, document), ensure_ascii=False, indent=2), encoding="utf-8")
                    if fingerprint(model, document, self.repo)["hash"] != fp["hash"]:
                        raise Conflict("De invoer veranderde tijdens het voorbereiden. Er is geen geldig pakket gemaakt.")
                    manifest = {"article_id": article_id, "revision": base_revision, "prepared_at": now(),
                                "approval": approval, "fingerprint": fp, "local_only": True, "live": False,
                                "release_checks": "Nog niet uitgevoerd; dit pakket is geen publicatiebesluit.",
                                "files": {str(p.relative_to(folder)): digest(p.read_bytes()) for p in sorted(folder.rglob("*")) if p.is_file()}}
                    (folder / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
                    with tempfile.NamedTemporaryFile(prefix=".package-", suffix=".zip.tmp", dir=export_dir, delete=False) as output:
                        archive_temp = Path(output.name)
                        with zipfile.ZipFile(output, "w", compression=zipfile.ZIP_DEFLATED) as archive:
                            for item in sorted(folder.rglob("*")):
                                if item.is_file():
                                    archive.write(item, arcname=item.relative_to(folder).as_posix())
                        output.flush()
                        os.fsync(output.fileno())
                    os.replace(archive_temp, archive_path)
                    archive_path.chmod(0o600)
                    directory_fd = os.open(export_dir, os.O_RDONLY)
                    try:
                        os.fsync(directory_fd)
                    finally:
                        os.close(directory_fd)
                self.event(con, article_id, base_revision, "Lokaal pakket voorbereid", actor, "Geen livegang; publicatiecontroles en expliciete vrijgave blijven nodig.", {"fingerprint": fp["hash"], "archive": archive_path.name})
            except Exception:
                if archive_temp is not None:
                    archive_temp.unlink(missing_ok=True)
                archive_path.unlink(missing_ok=True)
                raise
        return {"article": self.get(article_id), "package": {"path": str(archive_path), "revision": base_revision,
                "files": sorted(manifest["files"]) + ["manifest.json"], "live": False}}


class LocalServer(ThreadingHTTPServer):
    daemon_threads = True

    def __init__(self, address, store):
        if address[0] != "127.0.0.1":
            raise ValueError("Deze lokale pilot mag alleen op 127.0.0.1 luisteren.")
        super().__init__(address, Handler)
        self.store = store
        self.sessions = {}
        self.session_lock = threading.Lock()
        self.allowed_hosts = {f"127.0.0.1:{self.server_port}", f"localhost:{self.server_port}"}


class Handler(BaseHTTPRequestHandler):
    server_version = "MVDLocal/1"

    def setup(self):
        super().setup()
        self.connection.settimeout(15)

    def log_message(self, format, *args):
        # Do not log cookies, bodies, CSRF tokens, or query strings.
        if args:
            sys.stderr.write(f"{now()} {self.command} {urlsplit(self.path).path}\n")

    def send(self, status, payload, content_type="application/json; charset=utf-8", headers=None):
        if isinstance(payload, (dict, list)):
            payload = json.dumps(payload, ensure_ascii=False).encode()
        elif isinstance(payload, str):
            payload = payload.encode()
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(payload)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "no-referrer")
        self.send_header("X-Robots-Tag", "noindex, nofollow")
        self.send_header("Content-Security-Policy", "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-src 'self'; frame-ancestors 'self'; object-src 'none'; base-uri 'self'; form-action 'self'")
        for key, value in (headers or {}).items():
            self.send_header(key, value)
        self.end_headers()
        self.wfile.write(payload)

    def check_boundary(self):
        if self.headers.get("Host") not in self.server.allowed_hosts:
            raise PermissionError("Alleen toegang via dit lokale beheeradres is toegestaan.")
        origin = self.headers.get("Origin")
        if origin and origin not in {"http://" + host for host in self.server.allowed_hosts}:
            raise PermissionError("Deze aanvraag komt van een andere website.")
        if self.headers.get("Sec-Fetch-Site") == "cross-site":
            raise PermissionError("Aanvragen vanuit andere websites zijn niet toegestaan.")

    def session(self, create=False):
        cookie = SimpleCookie()
        try:
            cookie.load(self.headers.get("Cookie", ""))
            token = cookie["mvd_local_session"].value if "mvd_local_session" in cookie else None
        except Exception:
            token = None
        with self.server.session_lock:
            self.server.sessions = {key: value for key, value in self.server.sessions.items() if value["expires"] > time.time()}
            data = self.server.sessions.get(token)
            if data:
                return token, data, False
            if not create:
                raise PermissionError("Open eerst het lokale beheerscherm om een sessie te starten.")
            if len(self.server.sessions) >= 128:
                self.server.sessions.pop(next(iter(self.server.sessions)))
            token = secrets.token_urlsafe(32)
            data = {"csrf": secrets.token_urlsafe(32), "expires": time.time() + 8 * 3600}
            self.server.sessions[token] = data
            return token, data, True

    def body(self):
        if self.headers.get("Transfer-Encoding"):
            raise ValidationError("Transfer-Encoding wordt niet ondersteund.")
        if self.headers.get("Content-Type", "").split(";")[0].strip() != "application/json":
            raise ValidationError("Gebruik een JSON-aanvraag.")
        try:
            size = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            raise ValidationError("Ongeldige aanvraaglengte.") from None
        if not 0 < size <= MAX_BODY:
            raise ValidationError("De aanvraag is leeg of te groot.")
        try:
            data = json.loads(self.rfile.read(size))
        except (ValueError, UnicodeError):
            raise ValidationError("De aanvraag bevat geen geldige JSON.") from None
        if not isinstance(data, dict):
            raise ValidationError("Er wordt een JSON-object verwacht.")
        return data

    def do_GET(self):
        self.dispatch()

    def do_PUT(self):
        self.dispatch()

    def do_POST(self):
        self.dispatch()

    def dispatch(self):
        article_id = None
        try:
            self.check_boundary()
            path = unquote(urlsplit(self.path).path)
            if self.command == "GET" and path == "/api/session":
                token, data, created = self.session(create=True)
                return self.send(200, {"csrf": data["csrf"], "mode": "local-owner", "owner": "Matthijs"},
                                 headers={"Set-Cookie": f"mvd_local_session={token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800"} if created else {})
            if self.command == "GET" and path in {"/", "/index.html", "/app.js", "/app.css", "/assets/app.js", "/assets/app.css"}:
                name = "index.html" if path in {"/", "/index.html"} else Path(path).name
                return self.serve_file(Path(__file__).parent / "ui" / name)
            self.session()
            if self.command != "GET":
                _, session, _ = self.session()
                supplied = self.headers.get("X-CSRF-Token", "")
                if not secrets.compare_digest(supplied, session["csrf"]):
                    raise PermissionError("De sessiecontrole ontbreekt. Herlaad het beheerscherm.")
            if self.command == "GET" and path == "/api/articles":
                return self.send(200, {"articles": self.server.store.list()})
            if self.command == "GET" and path == "/api/dashboard":
                from inventory import build_dashboard
                return self.send(200, build_dashboard(self.server.store.repo, self.server.store.state_dir))
            idea_match = re.fullmatch(r"/api/ideas/([a-z0-9-]+)/choice", path)
            if self.command == "POST" and idea_match:
                from ideas import choose_idea, IdeasConflict, IdeasError
                data = self.body()
                if set(data) != {"choice", "version", "choice_version"}:
                    raise ValidationError("Een ideeënkeuze vereist de actie en de actuele versiegegevens.")
                try:
                    current = choose_idea(self.server.store.repo, self.server.store.state_dir, idea_match[1],
                                          data["choice"], data["version"], data["choice_version"])
                except IdeasConflict as exc:
                    return self.send(409, {"error": str(exc), "current": {"ideas": exc.current}})
                except IdeasError as exc:
                    raise ValidationError(str(exc)) from None
                return self.send(200, {"ideas": current})
            report_match = re.fullmatch(r"/reports/([a-z0-9-]+)", path)
            if self.command == "GET" and report_match:
                from inventory import read_routine_report
                report = read_routine_report(self.server.store.repo, report_match[1])
                title = html.escape(report["title"])
                source = html.escape(report["source"])
                date = html.escape(report["date"])
                body = html.escape(report["text"])
                rendered = (f'<!doctype html><html lang="nl"><head><meta charset="utf-8">'
                            f'<meta name="viewport" content="width=device-width, initial-scale=1">'
                            f'<meta name="robots" content="noindex, nofollow"><title>{title}</title>'
                            '<style>body{margin:0;background:#f7f4ed;color:#17201c;font:16px/1.6 system-ui,sans-serif}'
                            'main{max-width:900px;margin:auto;padding:24px clamp(16px,4vw,40px)}'
                            'h1{font-size:clamp(24px,4vw,34px);line-height:1.25;overflow-wrap:anywhere}'
                            'a{color:#244c3d}p{overflow-wrap:anywhere}.context{color:#5d675f}'
                            'pre{white-space:pre-wrap;overflow-wrap:anywhere;font:inherit;padding:20px;'
                            'border:1px solid #d8d5ca;background:#fffdf8;border-radius:10px}</style></head>'
                            f'<body><main><a href="/#routines">Terug naar agents en routines</a><p class="context">Leesversie van verslag</p><h1>{title}</h1>'
                            f'<p class="context">Verslag van {date} · {source}</p>'
                            '<p class="context">Correspondentiegegevens weggelaten. Dit is een lokale leesversie; persoonlijke technische gegevens zijn afgeschermd.</p>'
                            f'<pre>{body}</pre></main></body></html>')
                return self.send(200, rendered, "text/html; charset=utf-8")
            task_match = re.fullmatch(r"/api/tasks/([a-zA-Z0-9_.:-]+)/check", path)
            if self.command == "POST" and task_match:
                from inventory import set_task_check
                data = self.body()
                if not set(data) <= {"checked", "note"} or type(data.get("checked")) is not bool:
                    raise ValidationError("Geef aan of je dit punt hebt bekeken.")
                if "note" in data and (not isinstance(data["note"], str) or len(data["note"]) > 2000):
                    raise ValidationError("De toelichting is te lang of ongeldig.")
                try:
                    task = set_task_check(self.server.store.repo, self.server.store.state_dir,
                                          task_match[1], data["checked"], data.get("note"))
                except ValueError as exc:
                    raise ValidationError(str(exc)) from None
                return self.send(200, task)
            match = re.fullmatch(r"/api/articles/([a-z0-9-]+)(?:/(submit|approve|return|restore|prepare))?", path)
            if match:
                article_id, action = match.groups()
                if self.command == "GET" and not action:
                    return self.send(200, self.server.store.get(article_id))
                if self.command == "PUT" and not action:
                    data = self.body()
                    if set(data) != {"base_revision", "document"}:
                        raise ValidationError("Opslaan verwacht alleen de basisversie en artikelvelden.")
                    return self.send(200, self.server.store.save(article_id, data["base_revision"], data["document"]))
                if self.command == "POST" and action:
                    data = self.body()
                    if not set(data) <= {"base_revision", "note", "restore_revision"} or "base_revision" not in data:
                        raise ValidationError("Onbekende actievelden.")
                    result = self.server.store.prepare(article_id, data["base_revision"]) if action == "prepare" else self.server.store.action(article_id, action, data["base_revision"], data.get("note", ""), data.get("restore_revision"))
                    return self.send(200, result)
            match = re.fullmatch(r"/preview/([a-z0-9-]+)", path)
            if self.command == "GET" and match:
                params = parse_qs(urlsplit(self.path).query)
                try:
                    revision = int(params["revision"][0]) if "revision" in params else None
                except ValueError:
                    raise ValidationError("Ongeldige revisie.") from None
                model, document = self.server.store.model_document(match[1], revision)
                return self.send(200, preview_html(model, document, revision, self.server.store.repo), "text/html; charset=utf-8")
            reference = re.fullmatch(r"/reference/(behandelingen/[a-z0-9-]+\.html)", path)
            if self.command == "GET" and reference:
                candidate = (self.server.store.repo / reference[1]).resolve()
                if not candidate.is_relative_to(self.server.store.repo / "behandelingen"):
                    raise PermissionError("Ongeldige referentiepagina.")
                return self.send(200, protect_preview(candidate.read_text(encoding="utf-8"), reference[1],
                                                     local_url=path, repo=self.server.store.repo, reference=True),
                                 "text/html; charset=utf-8")
            if self.command == "GET" and path.startswith("/site/"):
                relative = path[len("/site/"):]
                allowed = set()
                for item in self.server.store.list():
                    model, _ = self.server.store.model_document(item["id"])
                    allowed.update(p for p in asset_paths(model, self.server.store.repo) if p.startswith("assets/") or p in {"styles.css", "script.js", "content.js"})
                candidate = (self.server.store.repo / relative).resolve()
                safe_asset = (relative.startswith("assets/") and candidate.suffix.lower() in
                              {".png", ".jpg", ".jpeg", ".webp", ".avif", ".gif", ".svg", ".woff", ".woff2"} and
                              candidate.is_relative_to(self.server.store.repo / "assets"))
                if (relative not in allowed and not safe_asset) or not candidate.is_relative_to(self.server.store.repo):
                    raise PermissionError("Dit bestand hoort niet bij de voorvertoning.")
                if relative == "content.js":
                    # The pilot contains exactly one managed article. Card rendering
                    # therefore uses its same current saved document.
                    params = parse_qs(urlsplit(self.path).query)
                    try:
                        revision = int(params["mvd_revision"][0]) if "mvd_revision" in params else None
                    except ValueError:
                        raise ValidationError("Ongeldige revisie.") from None
                    model, document = self.server.store.model_document(PILOT_ID, revision)
                    return self.send(200, render_content_js(model, document, self.server.store.repo), "text/javascript; charset=utf-8")
                return self.serve_file(candidate)
            self.send(404, {"error": "Deze beheerroute bestaat niet."})
        except Conflict as exc:
            self.send(409, {"error": str(exc), "current": self.server.store.get(article_id) if article_id else None})
        except PermissionError as exc:
            self.send(403, {"error": str(exc)})
        except (ValidationError, json.JSONDecodeError) as exc:
            self.send(400, {"error": str(exc)})
        except (KeyError, FileNotFoundError):
            self.send(404, {"error": "Dit artikel, deze versie of dit bestand bestaat niet."})
        except (BrokenPipeError, ConnectionResetError):
            pass
        except Exception as exc:
            sys.stderr.write(f"Beheerfout: {type(exc).__name__}: {exc}\n")
            self.send(500, {"error": "De aanvraag kon niet worden afgerond. Controleer de lokale beheerlog."})

    def serve_file(self, path):
        content_type = mimetypes.guess_type(path)[0] or "application/octet-stream"
        if content_type.startswith("text/") or path.suffix == ".js":
            content_type += "; charset=utf-8"
        return self.send(200, path.read_bytes(), content_type)


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--state-dir", type=Path, help="Afzonderlijke lokale state-map (bijvoorbeeld voor tests).")
    sub = parser.add_subparsers(dest="command", required=True)
    sub.add_parser("init")
    sub.add_parser("list")
    serve = sub.add_parser("serve")
    serve.add_argument("--port", type=int, default=8878)
    serve.add_argument("--open", action="store_true", help="Open het lokale beheeradres in de standaardbrowser.")
    export = sub.add_parser("export")
    export.add_argument("id")
    export.add_argument("--out", type=Path, required=True)
    save = sub.add_parser("save")
    save.add_argument("id")
    save.add_argument("--input", type=Path, required=True)
    save.add_argument("--base-revision", type=int, required=True)
    for action in ("submit", "approve", "return", "restore", "prepare"):
        command = sub.add_parser(action)
        command.add_argument("id")
        command.add_argument("--base-revision", type=int, required=True)
        command.add_argument("--note", default="")
        if action == "restore":
            command.add_argument("--restore-revision", type=int, required=True)
    args = parser.parse_args(argv)
    store = Store(state_dir=args.state_dir)
    if args.command == "serve":
        server = LocalServer(("127.0.0.1", args.port), store)
        print(f"Lokaal beheer: http://127.0.0.1:{server.server_port}/ — alleen deze computer; geen livegang.", flush=True)
        if args.open:
            webbrowser.open(f"http://127.0.0.1:{server.server_port}/")
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass
        finally:
            server.server_close()
        return
    if args.command == "init":
        result = {"initialized": True, "articles": store.list()}
    elif args.command == "list":
        result = {"articles": store.list()}
    elif args.command == "export":
        result = store.get(args.id)
        # Codex edits this document and sends it back through save. No generated
        # public HTML or alternate maintenance source is changed.
        destination = args.out.resolve()
        if destination.is_relative_to(store.repo) and not (destination.is_relative_to(store.state_dir) or destination.is_relative_to(store.repo / "local-admin/exports")):
            raise ValidationError("Exporteer naar een tijdelijke map of local-admin/state; publieke bronbestanden mogen niet worden overschreven.")
        if args.out.is_symlink():
            raise ValidationError("Exporteren naar een symbolische koppeling is niet toegestaan.")
        args.out.write_text(json.dumps(result["document"], ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        result = {"file": str(args.out), "base_revision": result["revision"], "local_only": True}
    elif args.command == "save":
        result = store.save(args.id, args.base_revision, json.loads(args.input.read_text(encoding="utf-8")), actor="Codex via lokale CLI")
    elif args.command == "prepare":
        result = store.prepare(args.id, args.base_revision, actor="Codex via lokale CLI")
    elif args.command == "approve":
        parser.error("Eigenaarakkoord wordt alleen in het lokale eigenaarscherm gegeven; de Codex-CLI kan geen eigenaarakkoord verlenen.")
    else:
        result = store.action(args.id, args.command, args.base_revision, args.note, getattr(args, "restore_revision", None), actor="Codex via lokale CLI")
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    try:
        main()
    except (ValidationError, Conflict, KeyError) as exc:
        print(str(exc), file=sys.stderr)
        raise SystemExit(1)
