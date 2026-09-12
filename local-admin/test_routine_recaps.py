"""Exact-evidence routine recaps and protected, redacted report reading."""
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


class RoutineRecapTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(prefix="mvd-routine-recap-")
        self.addCleanup(self.tmp.cleanup)
        self.repo = Path(self.tmp.name) / "repo"
        self.state = self.repo / "local-admin/state"
        self.reports = self.repo / "docs/site/reviews"
        self.reports.mkdir(parents=True)
        (self.repo / "local-admin").mkdir()
        self.automations = Path(self.tmp.name) / "automations"
        self.patch = patch.object(inventory, "AUTOMATIONS_DIR", self.automations)
        self.patch.start()
        self.addCleanup(self.patch.stop)
        self.weekly = inventory.ROUTINES[0][0]
        self.articles = inventory.ROUTINES[1][0]
        self.monthly = inventory.ROUTINES[2][0]
        self.report = self.reports / "sitecheck-2026-09-09.md"
        self.report.write_text("# Sitecheck\nAfgerond: 2026-09-09 20:00 CEST\n## Prioriteiten\n- **Belangrijk:** Controleer het menu.\n")
        self.catalog_path = self.repo / inventory.ROUTINE_RECAPS_FILE
        self.catalog = {"version": 1, "items": [{"id": self.weekly,
                        "source_sha256": self.sha(self.report.read_text()),
                        "highlights": [{"label": "Gedaan", "text": "De website is gecontroleerd."},
                                       {"label": "Vervolg", "text": "Controleer het menu."}]}]}

    @staticmethod
    def sha(raw):
        return hashlib.sha256(raw.encode("utf-8")).hexdigest()

    def save(self):
        self.catalog_path.write_text(json.dumps(self.catalog, ensure_ascii=False))

    def routine(self, routine_id=None):
        return next(item for item in inventory._routines(self.repo) if item["id"] == (routine_id or self.weekly))

    def test_current_recap_matches_raw_report_and_preserves_existing_fields(self):
        original = inventory._run_evidence(self.repo, self.weekly, "weekly")
        self.save()
        routine = self.routine()
        self.assertEqual((routine["last_report"], routine["last_result"]), original)
        self.assertEqual(routine["recap"]["status"], "current")
        self.assertEqual(len(routine["recap"]["highlights"]), 2)
        self.assertEqual(routine["recap"]["report_url"], "/reports/" + self.weekly)
        self.catalog["items"][0]["highlights"][0]["text"] = "Actuele korte terugblik."
        self.save()
        self.assertEqual(self.routine()["recap"]["highlights"][0]["text"], "Actuele korte terugblik.")

    def test_notice_read_marker_is_separate_and_changes_only_with_notice(self):
        self.report.write_text(self.report.read_text() + "\n## Ter kennisname\nDe controle is afgerond.\n")
        notice_id = "notice-latest-sitecheck"
        tasks = inventory._raw_tasks(self.repo)
        self.assertIn(notice_id, {item["id"] for item in tasks})
        self.assertIn("report-latest-sitecheck", {item["id"] for item in tasks})
        inventory.set_task_check(self.repo, self.state, notice_id, True)
        def notice():
            return next(item for item in inventory._with_checks(inventory._raw_tasks(self.repo), self.state)
                        if item["id"] == notice_id)
        self.assertTrue(notice()["checked"])
        self.report.write_text(self.report.read_text() + "\n## Techniek\nExtra controlebewijs.\n")
        self.assertTrue(notice()["checked"])
        self.report.write_text(self.report.read_text().replace("De controle is afgerond.", "Er is een nieuwe bevinding."))
        self.assertFalse(notice()["checked"])

    def test_no_notice_for_empty_or_explicit_none(self):
        for section in ("", "\n## Ter kennisname\n", "\n## Ter kennisname\nGeen nieuwe kennisgeving.\n"):
            self.report.write_text("# Sitecheck\n" + section)
            self.assertNotIn("notice-latest-sitecheck", {item["id"] for item in inventory._raw_tasks(self.repo)})

    def test_changed_newer_or_missing_report_never_shows_old_highlights(self):
        self.save()
        self.report.write_text(self.report.read_text() + "Nieuw resultaat.\n")
        recap = self.routine()["recap"]
        self.assertEqual(recap["status"], "outdated")
        self.assertEqual(recap["highlights"], [])
        self.assertEqual(recap["message"], "Nieuw verslag beschikbaar; korte terugblik nog bijwerken.")
        self.catalog["items"][0]["source_sha256"] = self.sha(self.report.read_text())
        self.save()
        newer = self.report.with_name("sitecheck-2026-09-10.md")
        newer.write_text("# Nieuw verslag\n## Prioriteiten\n- **Belangrijk:** Nieuwe bevinding.\n")
        routine = self.routine()
        self.assertEqual(routine["recap"]["status"], "outdated")
        self.assertEqual(routine["last_result"], "Nieuwe bevinding.")
        self.report.unlink()
        newer.unlink()
        self.assertEqual(self.routine()["recap"]["status"], "missing")
        self.assertNotIn("report_url", self.routine()["recap"])

    def test_supporting_hashes_must_remain_current_and_inside_repo(self):
        support = self.repo / "docs/confirmation.md"
        support.write_text("Eigenaarbesluit vastgelegd.")
        self.catalog["items"][0]["supporting_sources"] = [{"path": "docs/confirmation.md", "sha256": self.sha(support.read_text())}]
        self.save()
        self.assertEqual(self.routine()["recap"]["status"], "current")
        support.write_text("Besluit gewijzigd.")
        self.assertEqual(self.routine()["recap"]["status"], "outdated")
        support.unlink()
        self.assertEqual(self.routine()["recap"]["highlights"], [])
        self.catalog["items"][0]["supporting_sources"][0]["path"] = "../outside.md"
        self.save()
        self.assertEqual(self.routine()["recap"]["status"], "outdated")

    def test_article_memory_hashes_only_latest_block_and_has_no_report_route(self):
        folder = self.automations / self.articles
        folder.mkdir(parents=True)
        memory = folder / "memory.md"
        memory.write_text("# Runs\n## 2026-09-09\nAangemaakt: concept en preview.\nE-mail: private@example.org\n## 2026-09-01\nOud resultaat.\n")
        _, block = inventory._memory_section(self.articles)
        self.catalog["items"] = [{"id": self.articles, "source_sha256": self.sha(block),
                                  "highlights": [{"label": "Gedaan", "text": "Concept en voorvertoning voorbereid."}]}]
        self.save()
        recap = self.routine(self.articles)["recap"]
        self.assertEqual(recap["status"], "current")
        self.assertNotIn("report_url", recap)
        self.assertNotIn("private@example.org", json.dumps(self.routine(self.articles)))
        memory.write_text(memory.read_text().replace("Oud resultaat.", "Aangepaste oude notitie."))
        self.assertEqual(self.routine(self.articles)["recap"]["status"], "current")
        memory.write_text(memory.read_text() + "\n## 2026-09-10\nNieuwe run.\n")
        self.assertEqual(self.routine(self.articles)["recap"]["status"], "outdated")
        with self.assertRaises(KeyError):
            inventory.read_routine_report(self.repo, self.articles)

    def test_missing_unknown_and_invalid_catalogs_do_not_invent_recaps(self):
        self.assertEqual(self.routine()["recap"]["status"], "missing")
        self.catalog["items"][0]["id"] = "unknown-routine"
        self.save()
        self.assertEqual(len(inventory._routines(self.repo)), 4)
        self.assertEqual(self.routine()["recap"]["highlights"], [])
        self.catalog_path.write_text("{")
        self.assertEqual(self.routine()["recap"]["status"], "missing")
        self.catalog["items"][0]["id"] = self.weekly
        self.catalog["items"][0]["highlights"] *= 2
        self.save()
        self.assertEqual(self.routine()["recap"]["highlights"], [])

    def test_report_omits_delivery_sections_and_redacts_private_identifiers(self):
        self.report.write_text("# Leesbaar verslag\n## Controle\nGewone bevinding <script>alert(1)</script>.\n"
                               "Geen live HTTP-, browser-, Gmail- of schedulerlogcheck uitgevoerd.\n"
                               "Pad: /Users/private-user/Documents/geheim.md\n"
                               "Account: team_1234567890abcdef\n"
                               "Sessie 019f9feb-18ae-7971-97f4-9c92cb4f1a19\n"
                               "Sleutel sk-SUPERSECRET123456789\n"
                               "TOKEN=HIDDEN_VALUE\n"
                               "E-mail: private@example.org\n"
                               "## Mailstatus\nSENT_PRIVATE_STATUS\n### Details\nOPAQUE_DELIVERY_DATA\n"
                               "## Volgende stap\nControleer de inhoud.\n")
        report = inventory.read_routine_report(self.repo, self.weekly)
        text = report["text"]
        for private in ("private-user", "geheim.md", "team_1234567890abcdef", "019f9feb", "SUPERSECRET", "HIDDEN_VALUE",
                        "private@example.org", "SENT_PRIVATE_STATUS", "OPAQUE_DELIVERY_DATA", "Mailstatus"):
            self.assertNotIn(private, text)
        self.assertIn("<script>alert(1)</script>", text)
        self.assertIn("Controleer de inhoud.", text)
        self.assertIn("Geen live HTTP-, browser-, Gmail- of schedulerlogcheck uitgevoerd.", text)
        self.assertEqual(report["source"], "docs/site/reviews/sitecheck-2026-09-09.md")

    def test_report_path_escape_symlink_and_size_limits_are_rejected(self):
        for identifier in ("../../outside", "sitecheck-2026-09-09.md", "unknown", self.articles):
            with self.assertRaises(KeyError):
                inventory.read_routine_report(self.repo, identifier)
        outside = Path(self.tmp.name) / "outside.md"
        outside.write_text("PRIVATE_OUTSIDE")
        self.report.unlink()
        self.report.symlink_to(outside)
        with self.assertRaises(FileNotFoundError):
            inventory.read_routine_report(self.repo, self.weekly)
        self.assertNotIn("report_url", self.routine()["recap"])
        self.report.unlink()
        self.report.write_text("x" * (inventory.MAX_SOURCE_BYTES + 1))
        with self.assertRaises(FileNotFoundError):
            inventory.read_routine_report(self.repo, self.weekly)

    def test_http_report_route_requires_session_whitelists_id_and_escapes_html(self):
        self.report.write_text("# Rapport\n<script>alert('x')</script>\n## Mailstatus\nPRIVATE_DELIVERY\n")
        server = LocalServer(("127.0.0.1", 0), SimpleNamespace(repo=self.repo, state_dir=self.state))
        threading.Thread(target=server.serve_forever, daemon=True).start()
        self.addCleanup(server.server_close)
        self.addCleanup(server.shutdown)
        def request(path, cookie=None):
            connection = http.client.HTTPConnection("127.0.0.1", server.server_port, timeout=5)
            connection.request("GET", path, headers={"Cookie": cookie} if cookie else {})
            response = connection.getresponse()
            result = response.status, dict(response.getheaders()), response.read().decode()
            connection.close()
            return result
        self.assertEqual(request("/reports/" + self.weekly)[0], 403)
        _, headers, _ = request("/api/session")
        cookie = headers["Set-Cookie"].split(";")[0]
        status, headers, body = request("/reports/" + self.weekly, cookie)
        self.assertEqual(status, 200)
        self.assertIn("text/html", headers["Content-Type"])
        self.assertIn("noindex", headers["X-Robots-Tag"])
        self.assertIn("&lt;script&gt;", body)
        self.assertNotIn("<script>", body)
        self.assertNotIn("PRIVATE_DELIVERY", body)
        self.assertIn("white-space:pre-wrap", body)
        self.assertEqual(request("/reports/" + self.articles, cookie)[0], 404)
        self.assertEqual(request("/reports/%2e%2e%2foutside", cookie)[0], 404)


if __name__ == "__main__":
    unittest.main()
