"""Regression tests use disposable databases and copies, never the owner's state."""
import copy
import http.client
import json
from pathlib import Path
import shutil
import sqlite3
import tempfile
import threading
import unittest
import zipfile

from content_model import (PILOT_ID, SourceParser, ValidationError, asset_paths,
                           digest, fingerprint, import_article, preview_html, protect_preview, render_article,
                           render_card, render_content_js, validate_document)
from server import Conflict, LocalServer, REPO_ROOT, Store


class BackendTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(prefix="mvd-admin-test-")
        self.addCleanup(self.tmp.cleanup)
        self.repo = Path(self.tmp.name) / "repo"
        self.repo.mkdir()
        original = import_article(REPO_ROOT)
        for relative in asset_paths(original, REPO_ROOT):
            target = self.repo / relative
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(REPO_ROOT / relative, target)
        self.store = Store(self.repo, Path(self.tmp.name) / "state")
        self.article = self.store.get(PILOT_ID)
        self.document = copy.deepcopy(self.article["document"])
        self.model, _ = self.store.model_document(PILOT_ID)

    def approve(self, revision=1):
        self.store.action(PILOT_ID, "submit", revision)
        return self.store.action(PILOT_ID, "approve", revision)

    def publication_fixture(self, published=True):
        path = f"artikelen/{PILOT_ID}.html"
        entries = [{"path": path, "verification_status": "geverifieerd"}] if published else []
        (self.repo / "PUBLICATIE_REGISTER.json").write_text(json.dumps({"pages": entries}))
        location = f"<url><loc>https://matthijsvandam.nl/{path}</loc></url>" if published else ""
        (self.repo / "sitemap.xml").write_text(f"<urlset>{location}</urlset>")
        (self.repo / ".vercelignore").write_text("local-admin/\n" + (path + "\n" if not published else ""))

    def test_publication_registration_and_unchanged_working_copy_are_separate(self):
        self.publication_fixture()
        article = self.store.get(PILOT_ID)
        self.assertEqual(article["publication"]["state"], "published")
        self.assertIn("geen nieuwe livecontrole", article["publication"]["detail"])
        self.assertEqual(article["working_copy"]["state"], "unchanged")
        self.assertEqual(article["status"], "Concept")
        self.assertFalse(article["published"])
        self.assertIsNone(article["approval"])
        listed = self.store.list()[0]
        self.assertEqual(listed["publication"], article["publication"])
        self.assertEqual(listed["working_copy"], article["working_copy"])

    def test_local_card_edit_and_restore_keep_original_publication_registration(self):
        self.publication_fixture()
        self.document["card_summary"] = "Een andere lokale artikelkaart."
        saved = self.store.save(PILOT_ID, 1, self.document)
        self.assertEqual(saved["publication"]["state"], "published")
        self.assertEqual(saved["working_copy"]["state"], "changed")
        restored = self.store.action(PILOT_ID, "restore", 2, restore_revision=1)
        self.assertEqual(restored["revision"], 3)
        self.assertEqual(restored["working_copy"]["state"], "unchanged")
        self.assertEqual(restored["publication"]["state"], "published")
        self.assertEqual(restored["status"], "Concept")
        self.assertIsNone(restored["approval"])

    def test_local_approval_cannot_turn_unpublished_source_into_publication(self):
        self.publication_fixture(published=False)
        path = self.repo / f"artikelen/{PILOT_ID}.html"
        path.write_text(path.read_text().replace('content="index, follow"', 'content="noindex, nofollow"'))
        store = Store(self.repo, Path(self.tmp.name) / "unpublished-state")
        store.action(PILOT_ID, "submit", 1)
        article = store.action(PILOT_ID, "approve", 1)
        self.assertEqual(article["status"], "Goedgekeurd")
        self.assertTrue(article["approval"]["valid"])
        self.assertEqual(article["publication"]["state"], "unpublished")
        self.assertEqual(article["working_copy"]["state"], "unchanged")
        self.assertFalse(article["published"])
        (self.repo / ".vercelignore").write_text("local-admin/\n")
        self.assertEqual(store.get(PILOT_ID)["publication"]["state"], "unknown")

    def test_external_html_and_card_drift_require_comparison_and_missing_source_is_unknown(self):
        self.publication_fixture()
        path = self.repo / self.model["path"]
        path.write_text(path.read_text() + "\n<!-- Externe wijziging -->")
        article = self.store.get(PILOT_ID)
        self.assertEqual(article["working_copy"]["state"], "source_changed")
        self.assertEqual(article["publication"]["state"], "published")
        self.assertIsNotNone(article["dependency_error"])
        path.write_text(self.model["template"])
        cards = self.repo / "content.js"
        original_cards = cards.read_text()
        cards.write_text(original_cards.replace(self.model["card"]["summary"], "Buiten beheer gewijzigde kaart."))
        self.assertEqual(self.store.get(PILOT_ID)["working_copy"]["state"], "source_changed")
        cards.write_text(original_cards)
        path.unlink()
        article = self.store.get(PILOT_ID)
        self.assertEqual(article["working_copy"]["state"], "unknown")
        self.assertEqual(article["publication"]["state"], "unknown")

    def test_missing_or_conflicting_publication_evidence_is_unknown(self):
        self.publication_fixture()
        register = self.repo / "PUBLICATIE_REGISTER.json"
        register.unlink()
        article = self.store.get(PILOT_ID)
        self.assertEqual(article["publication"]["state"], "unknown")
        self.assertEqual(article["working_copy"]["state"], "unchanged")
        self.publication_fixture()
        (self.repo / "sitemap.xml").write_text("<urlset></urlset>")
        self.assertEqual(self.store.get(PILOT_ID)["publication"]["state"], "unknown")
        self.publication_fixture()
        (self.repo / ".vercelignore").write_text("artikelen/*.html\n")
        self.assertEqual(self.store.get(PILOT_ID)["publication"]["state"], "unknown")
        self.publication_fixture()
        register.write_text(json.dumps({"pages": [{"path": self.model["path"], "verification_status": "niet_publiceren"}]}))
        self.assertEqual(self.store.get(PILOT_ID)["publication"]["state"], "unknown")

    def test_unchanged_render_is_exact_and_preserves_full_card(self):
        self.assertEqual(render_article(self.model, self.document).encode(), (self.repo / self.model["path"]).read_bytes())
        self.assertEqual(render_content_js(self.model, self.document, self.repo), (self.repo / "content.js").read_text())
        self.assertEqual(render_card(self.model, self.document), self.model["card"])
        self.assertEqual(len(self.document["blocks"]), 9)
        self.assertTrue(any("../projecten/transmuraal" in block["html"] for block in self.document["blocks"]))

    def test_renderer_changes_only_selected_fields_and_synchronizes_metadata(self):
        self.document["title"] = 'Een titel </script> met "aanhaling"'
        self.document["meta_description"] = 'Nieuwe omschrijving met <tekens> & uitleg'
        self.document["card_summary"] = "Nieuwe kaarttekst"
        rendered = render_article(self.model, self.document)
        self.assertIn('Een titel &lt;/script&gt; met &quot;aanhaling&quot;', rendered)
        self.assertIn('"headline": "Een titel \\u003c/script>', rendered)
        self.assertIn("Nieuwe omschrijving met &lt;tekens&gt; &amp; uitleg", rendered)
        self.assertIn(self.model["baseline"]["social_title"], rendered)
        self.assertIn(self.model["baseline"]["meta_title"], rendered)
        old = SourceParser(self.model["template"]).nodes
        new = SourceParser(rendered).nodes
        links = lambda nodes: [n["attrs"] for n in nodes if n["tag"] == "a"]
        self.assertEqual(links(old), links(new))
        self.assertIn('summary:\n        "Nieuwe kaarttekst"', render_content_js(self.model, self.document, self.repo))
        self.assertEqual(render_card(self.model, self.document)["project"], "transmuraal-tilburg-cohort")

    def test_save_persists_conflicts_restore_and_immutable_history(self):
        self.document["title"] = "Een opgeslagen concept"
        saved = self.store.save(PILOT_ID, 1, self.document)
        self.assertEqual(saved["revision"], 2)
        reopened = Store(self.repo, self.store.state_dir).get(PILOT_ID)
        self.assertEqual(reopened["document"], self.document)
        with self.assertRaises(Conflict):
            self.store.save(PILOT_ID, 1, self.article["document"])
        approved = self.approve(2)
        self.assertTrue(approved["approval"]["valid"])
        restored = self.store.action(PILOT_ID, "restore", 2, restore_revision=1)
        self.assertEqual(restored["revision"], 3)
        self.assertEqual(restored["document"], self.article["document"])
        self.assertIsNone(restored["approval"])
        self.assertEqual(restored["status"], "Concept")
        self.assertTrue(any(h["action"] == "Goedgekeurd" for h in restored["history"]))
        with sqlite3.connect(self.store.db) as connection:
            with self.assertRaises(sqlite3.IntegrityError):
                connection.execute("UPDATE revisions SET document='{}'")
            with self.assertRaises(sqlite3.IntegrityError):
                connection.execute("DELETE FROM events")

    def test_noop_does_not_invalidate_approval_but_edit_does(self):
        self.approve()
        unchanged = self.store.save(PILOT_ID, 1, self.document)
        self.assertEqual(unchanged["revision"], 1)
        self.assertTrue(unchanged["approval"]["valid"])
        self.document["lead"] += " Een aanvulling."
        changed = self.store.save(PILOT_ID, 1, self.document)
        self.assertEqual(changed["status"], "Concept")
        self.assertIsNone(changed["approval"])

    def test_dependency_change_invalidates_approval_and_submission(self):
        self.approve()
        css = self.repo / "styles.css"
        css.write_text(css.read_text() + "\n/* changed dependency */\n")
        changed = self.store.get(PILOT_ID)
        self.assertEqual(changed["status"], "Akkoord vervallen")
        self.assertFalse(changed["approval"]["valid"])
        with self.assertRaises(Conflict):
            self.store.prepare(PILOT_ID, 1)
        self.store.action(PILOT_ID, "submit", 1)
        css.write_text(css.read_text() + "\n/* changed again */\n")
        with self.assertRaises(Conflict):
            self.store.action(PILOT_ID, "approve", 1)

    def test_source_drift_and_missing_assets_cannot_be_approved(self):
        article_path = self.repo / self.model["path"]
        article_path.write_text(article_path.read_text() + "\n<!-- outside edit -->")
        self.assertTrue(self.store.get(PILOT_ID)["source_drift"])
        with self.assertRaises(ValidationError):
            self.store.action(PILOT_ID, "submit", 1)
        article_path.write_text(self.model["template"])
        (self.repo / self.model["card"]["image"]).unlink()
        self.assertIn("ontbreekt", self.store.get(PILOT_ID)["dependency_error"])
        with self.assertRaises(ValidationError):
            self.store.action(PILOT_ID, "submit", 1)

    def test_return_requires_note_and_protected_fields_are_rejected(self):
        with self.assertRaises(ValidationError):
            self.store.action(PILOT_ID, "return", 1)
        returned = self.store.action(PILOT_ID, "return", 1, "Controleer de formulering.")
        self.assertEqual(returned["history"][0]["note"], "Controleer de formulering.")
        self.document["approval"] = True
        with self.assertRaises(ValidationError):
            self.store.save(PILOT_ID, 1, self.document)

    def test_state_cannot_write_public_folders_or_follow_database_symlinks(self):
        with self.assertRaises(ValidationError):
            Store(self.repo, self.repo / "artikelen")
        isolated = Path(self.tmp.name) / "unsafe-state"
        isolated.mkdir()
        (isolated / "editorial.sqlite3").symlink_to(self.store.db)
        with self.assertRaises(ValidationError):
            Store(self.repo, isolated)

    def test_unsafe_html_and_links_are_rejected(self):
        for fragment in ('<script>alert(1)</script>', '<img src=x onerror=alert(1)>',
                         '<a href="javascript:alert(1)">bad</a>',
                         '<a href="java&#9;script:alert(1)">bad</a>',
                         '<a href="https://example.org" onclick="x()">bad</a>',
                         '<a href="//evil.test">bad</a>', '<strong>niet afgesloten',
                         '<!-- injected -->tekst', '<svg><a>tekst</a></svg>'):
            with self.subTest(fragment=fragment):
                document = copy.deepcopy(self.document)
                document["blocks"][1]["html"] = fragment
                with self.assertRaises(ValidationError):
                    validate_document(document, self.model["baseline"])
        self.document["blocks"][1]["html"] = '<strong>Gewone tekst</strong> en <a href="../over-mij.html" rel="noopener">een link</a>.'
        validate_document(self.document, self.model["baseline"])

    def test_prepare_is_exact_local_package_without_public_mutation(self):
        # Exercise the real default layout INSIDE a disposable repository: no
        # generated indexable HTML may appear below local-admin/state.
        self.store = Store(self.repo)
        originals = {path: (self.repo / path).read_bytes() for path in asset_paths(self.model, self.repo)}
        original_html_paths = set(self.repo.rglob("*.html"))
        self.document["card_summary"] = "Nieuwe kaart in het lokale pakket."
        self.store.save(PILOT_ID, 1, self.document)
        self.approve(2)
        prepared = self.store.prepare(PILOT_ID, 2)
        archive_path = Path(prepared["package"]["path"])
        self.assertTrue(archive_path.is_relative_to(self.store.state_dir))
        self.assertEqual(archive_path.suffix, ".zip")
        self.assertEqual(archive_path.stat().st_mode & 0o777, 0o600)
        self.assertFalse(prepared["package"]["live"])
        with zipfile.ZipFile(archive_path) as archive:
            manifest = json.loads(archive.read("manifest.json"))
            self.assertEqual(manifest["revision"], 2)
            self.assertEqual(set(archive.namelist()), set(prepared["package"]["files"]))
            self.assertIn("Nieuwe kaart in het lokale pakket.", archive.read("content.js").decode())
            self.assertEqual(archive.read(self.model["path"]).decode(), self.model["template"])
            for filename, expected_hash in manifest["files"].items():
                self.assertEqual(digest(archive.read(filename)), expected_hash, filename)
        self.assertEqual(list(self.store.state_dir.rglob("*.html")), [])
        self.assertEqual(set(self.repo.rglob("*.html")), original_html_paths)
        for path, content in originals.items():
            self.assertEqual((self.repo / path).read_bytes(), content, path)

    def test_preview_keeps_assets_local_and_marks_itself_nonindexable(self):
        rendered = preview_html(self.model, self.document, 1)
        self.assertIn('<base href="/site/artikelen/"', rendered)
        self.assertIn('content="noindex, nofollow"', rendered)
        self.assertIn('href="https://matthijsvandam.nl/projecten/transmuraal-tilburg-cohort.html"', rendered)
        self.assertIn("mvd_revision=1", rendered)
        self.assertIn(f'href="/preview/{PILOT_ID}?revision=1#main-content" target="_self"', rendered)
        self.assertEqual((self.repo / self.model["path"]).read_text(), self.model["template"])

    def test_reference_fragments_and_existing_concept_links_stay_local(self):
        treatment_dir = self.repo / "behandelingen"
        treatment_dir.mkdir()
        (treatment_dir / "achillespeesklachten.html").write_text("A real local concept")
        (treatment_dir / "hielpijn.html").write_text("Another local concept")
        source = ('<!doctype html><html><head></head><body><a href="#wat-is-het">Wat is het?</a>'
                  '<a href="hielpijn.html#vragen" target="_blank">Hielpijn</a>'
                  '<a href="https://matthijsvandam.nl/behandelingen/hielpijn.html">Hielpijn absoluut</a>'
                  '<a href="onbekend.html">Niet lokaal</a><section id="wat-is-het">Tekst</section></body></html>')
        route = "/reference/behandelingen/achillespeesklachten.html"
        rendered = protect_preview(source, "behandelingen/achillespeesklachten.html",
                                   local_url=route, repo=self.repo, reference=True)
        self.assertIn(f'href="{route}#wat-is-het" target="_self"', rendered)
        self.assertIn('href="/reference/behandelingen/hielpijn.html#vragen" target="_self"', rendered)
        self.assertIn('href="/reference/behandelingen/hielpijn.html" target="_self"', rendered)
        self.assertIn('href="https://matthijsvandam.nl/behandelingen/onbekend.html"', rendered)
        self.assertIn("Lokale leesversie · publicatiestatus in dashboard.", rendered)
        self.assertIn('<a href="/#taken" target="_blank"', rendered)
        self.assertNotIn('href="#wat-is-het"', rendered)

    def test_http_session_csrf_host_origin_and_path_boundaries(self):
        server = LocalServer(("127.0.0.1", 0), self.store)
        runner = threading.Thread(target=server.serve_forever, daemon=True)
        runner.start()
        self.addCleanup(server.server_close)
        self.addCleanup(server.shutdown)

        def request(method, path, body=None, headers=None):
            client = http.client.HTTPConnection("127.0.0.1", server.server_port, timeout=5)
            client.request(method, path, json.dumps(body) if body is not None else None, headers or {})
            response = client.getresponse()
            result = response.status, dict(response.getheaders()), response.read()
            client.close()
            return result

        self.assertEqual(request("GET", "/api/articles")[0], 403)
        self.assertEqual(request("GET", "/preview/" + PILOT_ID)[0], 403)
        self.assertEqual(request("GET", "/api/session", headers={"Host": "evil.test"})[0], 403)
        self.assertEqual(request("GET", "/api/session", headers={"Origin": "https://evil.test"})[0], 403)
        self.assertEqual(request("GET", "/api/session", headers={"Sec-Fetch-Site": "cross-site"})[0], 403)
        status, headers, data = request("GET", "/api/session")
        self.assertEqual(status, 200)
        self.assertIn("HttpOnly", headers["Set-Cookie"])
        self.assertIn("SameSite=Strict", headers["Set-Cookie"])
        auth = {"Cookie": headers["Set-Cookie"].split(";")[0], "Content-Type": "application/json"}
        body = {"base_revision": 1, "document": self.document}
        self.assertEqual(request("PUT", "/api/articles/" + PILOT_ID, body, auth)[0], 403)
        auth["X-CSRF-Token"] = json.loads(data)["csrf"]
        self.assertEqual(request("PUT", "/api/articles/" + PILOT_ID, body, auth)[0], 200)
        self.assertEqual(request("PUT", "/api/articles/" + PILOT_ID, body, auth | {"Origin": "https://evil.test"})[0], 403)
        self.assertEqual(request("POST", "/api/articles/" + PILOT_ID + "/approve", {"base_revision": 1, "actor": "owner"}, auth)[0], 400)
        self.document["title"] = "HTTP opgeslagen"
        self.assertEqual(request("PUT", "/api/articles/" + PILOT_ID, body, auth)[0], 200)
        self.assertEqual(request("PUT", "/api/articles/" + PILOT_ID, body, auth)[0], 409)
        self.assertEqual(request("GET", "/site/../local-admin/state/editorial.sqlite3", headers=auth)[0], 403)
        self.assertEqual(request("GET", "/site/%2e%2e/AGENTS.md", headers=auth)[0], 403)
        self.assertEqual(request("GET", "/site/styles.css", headers=auth)[0], 200)
        status, headers, _ = request("GET", "/preview/" + PILOT_ID + "?revision=1", headers=auth)
        self.assertEqual(status, 200)
        self.assertIn("noindex", headers["X-Robots-Tag"])
        self.assertIn("frame-ancestors 'self'", headers["Content-Security-Policy"])
        with self.assertRaises(ValueError):
            LocalServer(("0.0.0.0", 0), self.store)


if __name__ == "__main__":
    unittest.main()
