"""Evidence-bound local work catalog; no changes to medical/publication status."""
import copy
import hashlib
import http.client
import json
from pathlib import Path
import tempfile
import threading
from types import SimpleNamespace
import unittest
from unittest.mock import patch

import inventory
from server import LocalServer


class WorkItemTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(prefix="mvd-work-items-")
        self.addCleanup(self.tmp.cleanup)
        self.repo = Path(self.tmp.name) / "repo"
        self.state = self.repo / "local-admin/state"
        (self.repo / "local-admin").mkdir(parents=True)
        self.source = self.repo / "docs/status.md"
        self.source.parent.mkdir()
        self.source.write_text("Een controleerbare projectstatus. PRIVATE_SOURCE_CONTENT")
        self.catalog_path = self.repo / inventory.WORK_ITEMS_FILE
        self.base_item = {"id": "work-newsletter", "title": "Nieuwsbrief nalopen", "category": "Nieuwsbrief",
                          "status": "waiting", "status_label": "Wacht op beoordeling",
                          "detail": "De conceptopzet staat klaar.", "next_action": "Beoordeel de opzet.", "priority": 2,
                          "sources": [{"path": "docs/status.md", "sha256": self.hash()}],
                          "url": "https://matthijsvandam.nl/artikelen.html"}
        self.catalog = {"version": 1, "reviewed_at": "2026-09-10T12:00:00+02:00", "items": [copy.deepcopy(self.base_item)]}
        self.patch = patch.object(inventory, "AUTOMATIONS_DIR", Path(self.tmp.name) / "automations")
        self.patch.start()
        self.addCleanup(self.patch.stop)

    def hash(self):
        return hashlib.sha256(self.source.read_bytes()).hexdigest()

    def write_catalog(self):
        self.catalog_path.write_text(json.dumps(self.catalog, ensure_ascii=False))

    def tasks(self):
        return {item["id"]: item for item in inventory.build_dashboard(self.repo, self.state)["tasks"]}

    def test_catalog_is_read_fresh_with_workflow_status_and_safe_source_summary(self):
        self.write_catalog()
        task = self.tasks()["work-newsletter"]
        self.assertEqual(task["kind"], "work")
        self.assertEqual(task["status"], "Wacht op beoordeling")
        self.assertEqual(task["workflow_status"], "waiting")
        self.assertEqual(task["priority"], 2)
        self.assertEqual(task["next_action"], "Beoordeel de opzet.")
        self.assertEqual(task["reviewed_at"], self.catalog["reviewed_at"])
        self.assertFalse(task["evidence_changed"])
        self.assertTrue(task["can_check"])
        self.assertNotIn("_fingerprint", task)
        self.assertNotIn("PRIVATE_SOURCE_CONTENT", json.dumps(task))
        self.catalog["items"][0].update(title="Nieuwe taaknaam", status="later", status_label="Bewust later")
        self.write_catalog()
        refreshed = self.tasks()["work-newsletter"]
        self.assertEqual(refreshed["title"], "Nieuwe taaknaam")
        self.assertEqual(refreshed["workflow_status"], "later")

    def test_check_is_only_viewed_and_expires_on_evidence_or_catalog_change(self):
        self.write_catalog()
        original_catalog = self.catalog_path.read_bytes()
        inventory.set_task_check(self.repo, self.state, "work-newsletter", True, "Ik heb dit bekeken.")
        viewed = self.tasks()["work-newsletter"]
        self.assertTrue(viewed["checked"])
        self.assertEqual(viewed["workflow_status"], "waiting")
        self.assertEqual(self.catalog_path.read_bytes(), original_catalog)
        self.source.write_text("De bronstatus is gewijzigd.")
        changed = self.tasks()["work-newsletter"]
        self.assertFalse(changed["checked"])
        self.assertEqual(changed["note"], "")
        self.assertTrue(changed["evidence_changed"])
        self.assertEqual(changed["status"], "Status opnieuw controleren")
        self.assertEqual(changed["workflow_status"], "open")
        inventory.set_task_check(self.repo, self.state, "work-newsletter", True)
        self.catalog["items"][0]["next_action"] = "Bespreek de gewijzigde bron."
        self.write_catalog()
        self.assertFalse(self.tasks()["work-newsletter"]["checked"])

    def test_http_toggling_preserves_note_explicit_empty_clears_and_drift_discards(self):
        self.write_catalog()
        server = LocalServer(("127.0.0.1", 0), SimpleNamespace(repo=self.repo, state_dir=self.state))
        threading.Thread(target=server.serve_forever, daemon=True).start()
        self.addCleanup(server.server_close)
        self.addCleanup(server.shutdown)
        client = http.client.HTTPConnection("127.0.0.1", server.server_port, timeout=5)
        client.request("GET", "/api/session")
        response = client.getresponse()
        cookie = response.getheader("Set-Cookie").split(";")[0]
        csrf = json.loads(response.read())["csrf"]
        client.close()

        def update(payload):
            connection = http.client.HTTPConnection("127.0.0.1", server.server_port, timeout=5)
            connection.request("POST", "/api/tasks/work-newsletter/check", json.dumps(payload),
                               {"Content-Type": "application/json", "Cookie": cookie, "X-CSRF-Token": csrf})
            response = connection.getresponse()
            status, body = response.status, json.loads(response.read())
            connection.close()
            return status, body

        self.assertEqual(update({"checked": False, "note": "Mijn opgeslagen notitie."})[0], 200)
        for checked in (True, False, True):
            status, task = update({"checked": checked})
            self.assertEqual(status, 200)
            self.assertEqual(task["checked"], checked)
            self.assertEqual(task["note"], "Mijn opgeslagen notitie.")
        self.assertEqual(update({"checked": False, "note": None})[0], 400)
        self.assertEqual(self.tasks()["work-newsletter"]["note"], "Mijn opgeslagen notitie.")
        self.assertEqual(update({"checked": False, "note": ""})[1]["note"], "")
        update({"checked": False, "note": "Notitie bij de vorige bron."})
        self.source.write_text("De bewijsbron is nu gewijzigd.")
        status, task = update({"checked": True})
        self.assertEqual(status, 200)
        self.assertTrue(task["evidence_changed"])
        self.assertEqual(task["note"], "")

    def test_done_requires_current_evidence_and_missing_source_reopens(self):
        self.catalog["items"][0].update(status="done", status_label="Afgerond")
        self.write_catalog()
        task = self.tasks()["work-newsletter"]
        self.assertEqual(task["workflow_status"], "done")
        self.assertFalse(task["can_check"])
        with self.assertRaises(ValueError):
            inventory.set_task_check(self.repo, self.state, "work-newsletter", True)
        self.source.unlink()
        reopened = self.tasks()["work-newsletter"]
        self.assertEqual(reopened["workflow_status"], "open")
        self.assertTrue(reopened["evidence_changed"])
        self.assertTrue(reopened["can_check"])
        self.assertEqual(reopened["status"], "Status opnieuw controleren")

    def test_absent_catalog_is_optional_but_invalid_catalog_is_visible(self):
        self.assertEqual(inventory._work_tasks(self.repo), [])
        for bad in ("{", "[]", json.dumps({"version": 2, "items": []}), "x" * (inventory.MAX_WORK_CATALOG_BYTES + 1)):
            with self.subTest(bad=bad[:40]):
                self.catalog_path.write_text(bad)
                items = inventory._work_tasks(self.repo)
                self.assertEqual(len(items), 1)
                self.assertEqual(items[0]["id"], "work-catalog-check")
                self.assertEqual(items[0]["workflow_status"], "open")
                self.assertTrue(items[0]["evidence_changed"])

    def test_unsafe_paths_and_external_symlinks_fail_without_source_leak(self):
        outside = Path(self.tmp.name) / "outside.md"
        outside.write_text("OUTSIDE_SECRET_CONTENT")
        (self.repo / "docs/link.md").symlink_to(outside)
        for bad_path in ("../outside.md", str(outside), "docs/../status.md", "docs/link.md", ".env", "local-admin/state/agents.json", "https://example.org/token-secret"):
            with self.subTest(path=bad_path):
                self.catalog["items"][0]["sources"][0]["path"] = bad_path
                self.write_catalog()
                tasks = self.tasks()
                self.assertIn("work-catalog-check", tasks)
                self.assertNotIn("work-newsletter", tasks)
                self.assertNotIn("OUTSIDE_SECRET_CONTENT", json.dumps(tasks))
        self.catalog_path.unlink()
        self.catalog_path.symlink_to(outside)
        self.assertEqual(inventory._work_tasks(self.repo)[0]["id"], "work-catalog-check")

    def test_secret_urls_are_omitted_and_text_urls_are_sanitized(self):
        for url in ("https://example.org/path?token=PRIVATE_TOKEN", "https://user:password@example.org/path",
                    "https://example.org/path#PRIVATE_TOKEN", "http://example.org/path", "https://127.0.0.1/path",
                    "https://service.local/path", "https://example.org/access-token/PRIVATE_TOKEN"):
            with self.subTest(url=url):
                self.catalog["items"][0]["url"] = url
                self.catalog["items"][0]["detail"] = "Controleer https://example.org/path?token=PRIVATE_TOKEN"
                self.write_catalog()
                task = self.tasks()["work-newsletter"]
                self.assertNotIn("url", task)
                self.assertNotIn("PRIVATE_TOKEN", json.dumps(task))
        self.catalog["items"][0]["url"] = self.base_item["url"]
        self.write_catalog()
        self.assertEqual(self.tasks()["work-newsletter"]["url"], self.base_item["url"])

    def test_invalid_shapes_duplicate_ids_hashes_and_limits_fail_closed(self):
        variants = []
        for key, value in (("status", "geverifieerd"), ("priority", True), ("sources", []), ("title", "x" * 201), ("id", "page-hielpijn")):
            catalog = copy.deepcopy(self.catalog)
            catalog["items"][0][key] = value
            variants.append(catalog)
        catalog = copy.deepcopy(self.catalog)
        catalog["items"].append(copy.deepcopy(catalog["items"][0]))
        variants.append(catalog)
        catalog = copy.deepcopy(self.catalog)
        catalog["items"][0]["sources"][0]["sha256"] = "not-a-hash"
        variants.append(catalog)
        catalog = copy.deepcopy(self.catalog)
        catalog["reviewed_at"] = "2026-09-10"
        variants.append(catalog)
        for catalog in variants:
            with self.subTest(catalog=catalog):
                self.catalog_path.write_text(json.dumps(catalog))
                self.assertEqual(inventory._work_tasks(self.repo)[0]["id"], "work-catalog-check")

    def test_work_items_do_not_override_medical_registry_or_review_tasks(self):
        self.write_catalog()
        treatments = self.repo / "behandelingen"
        treatments.mkdir()
        page = "behandelingen/hielpijn.html"
        (self.repo / page).write_text('<meta name="robots" content="noindex, nofollow"><h1>Hielpijn</h1>')
        register = self.repo / inventory.REGISTER_FILE
        register.write_text(json.dumps({"pages": []}))
        (self.repo / "sitemap.xml").write_text("<urlset></urlset>")
        (self.repo / ".vercelignore").write_text("behandelingen/*.html\n")
        (self.repo / inventory.INVENTORY_FILE).write_text(f"| Hielpijn | `{page}` | opgewaardeerd, medische review nodig | Controleer de tekst. |\n")
        before_registry = register.read_bytes()
        medical_before = self.tasks()["page-hielpijn"]
        inventory.set_task_check(self.repo, self.state, "work-newsletter", True)
        medical_after = self.tasks()["page-hielpijn"]
        self.assertEqual(medical_after, medical_before)
        self.assertEqual(medical_after["status"], "Medisch nakijken")
        self.assertEqual(register.read_bytes(), before_registry)

    def test_concrete_work_replaces_only_its_unchanged_current_report(self):
        report_path = "docs/site/reviews/sitecheck-2026-09-09.md"
        report = self.repo / report_path
        report.parent.mkdir(parents=True)
        report.write_text("# Controle\n## Prioriteiten\n- **Belangrijk:** Controleer het menu.\n")
        self.catalog["items"][0]["replaces_report"] = "report-latest-sitecheck"
        self.catalog["items"][0]["sources"] = [{"path": report_path, "sha256": hashlib.sha256(report.read_bytes()).hexdigest()}]
        self.write_catalog()
        self.assertNotIn("report-latest-sitecheck", self.tasks())
        self.assertIn("work-newsletter", self.tasks())
        report.write_text(report.read_text() + "- **Belangrijk:** Controleer ook de afbeelding.\n")
        self.assertIn("report-latest-sitecheck", self.tasks())
        self.assertTrue(self.tasks()["work-newsletter"]["evidence_changed"])
        self.catalog["items"][0]["sources"][0]["sha256"] = hashlib.sha256(report.read_bytes()).hexdigest()
        self.write_catalog()
        self.assertNotIn("report-latest-sitecheck", self.tasks())
        newer = report.with_name("sitecheck-2026-09-10.md")
        newer.write_text("# Controle\n## Prioriteiten\n- **Belangrijk:** Een nieuw aandachtspunt.\n")
        self.assertIn("report-latest-sitecheck", self.tasks())
        self.assertEqual(self.tasks()["report-latest-sitecheck"]["source"], newer.relative_to(self.repo).as_posix())


if __name__ == "__main__":
    unittest.main()
