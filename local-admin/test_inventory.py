"""Meaningful source/state/security regression tests for dashboard inventory."""
from datetime import datetime, timedelta, timezone
from concurrent.futures import ThreadPoolExecutor
import json
from pathlib import Path
import stat
import tempfile
import unittest
from unittest.mock import patch

import inventory


class InventoryTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.repo = Path(self.temp.name) / "repo"
        self.state = self.repo / "local-admin" / "state"
        self.automations = Path(self.temp.name) / "automations"
        (self.repo / "behandelingen").mkdir(parents=True)
        (self.repo / "docs/site/reviews").mkdir(parents=True)
        self.state.mkdir(parents=True)
        self.patch = patch.object(inventory, "AUTOMATIONS_DIR", self.automations)
        self.patch.start()
        self.addCleanup(self.patch.stop)
        self.write("PUBLICATIE_REGISTER.json", json.dumps({"pages": []}))
        self.write("sitemap.xml", '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>')
        self.write(".vercelignore", "behandelingen/*.html\n")
        self.write("FOOT_PAIN_GUIDE_LAUNCH_INVENTARIS.md", "| Kaart | URL | Status | Review |\n")

    def write(self, relative, value):
        path = self.repo / relative
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(value, encoding="utf-8")
        return path

    def page(self, slug="hallux-valgus", status="opgewaardeerd, medische review nodig"):
        path = "behandelingen/" + slug + ".html"
        self.write(path, '<html><head><meta name="robots" content="noindex, nofollow"></head><body><h1>Een pagina</h1><p>Brontekst.</p></body></html>')
        if status:
            with (self.repo / inventory.INVENTORY_FILE).open("a", encoding="utf-8") as f:
                f.write(f"| {slug} | `{path}` | {status} | Controleer medische inhoud. |\n")
        return path

    def tasks(self):
        return {t["id"]: t for t in inventory.build_dashboard(self.repo, self.state)["tasks"]}

    def config(self, index=0, **overrides):
        routine_id, name, kind, _, _ = inventory.ROUTINES[index]
        data = {"version": 1, "id": routine_id, "kind": kind, "name": name,
                "status": "ACTIVE", "rrule": "FREQ=WEEKLY;BYDAY=WE;BYHOUR=19;BYMINUTE=30;BYSECOND=0",
                "prompt": "PRIVATE_PROMPT patient@example.org sk-secretvalue123"}
        data.update(overrides)
        folder = self.automations / routine_id
        folder.mkdir(parents=True, exist_ok=True)
        file = folder / "automation.toml"
        file.write_text("\n".join(key + " = " + json.dumps(value) for key, value in data.items()), encoding="utf-8")
        return file

    def test_current_public_state_supersedes_stale_review_inventory(self):
        path = self.page()
        self.write(path, '<meta name="robots" content="index, follow"><h1>Publiek</h1>')
        self.write("sitemap.xml", '<urlset><url><loc>https://matthijsvandam.nl/' + path + '</loc></url></urlset>')
        self.write("PUBLICATIE_REGISTER.json", json.dumps({"pages": [{"path": path, "verification_status": "geverifieerd", "verified_on": "2026-09-07"}]}))
        self.write(".vercelignore", "behandelingen/*.html\n!" + path + "\n")
        task = self.tasks()["page-hallux-valgus"]
        self.assertEqual(task["category"], "Gepubliceerd")
        self.assertFalse(task["can_check"])
        with self.assertRaises(ValueError):
            inventory.set_task_check(self.repo, self.state, task["id"], True)
        self.write("PUBLICATIE_REGISTER.json", json.dumps({"pages": [{"path": path, "verification_status": "review_nodig"}]}))
        self.assertEqual(self.tasks()[task["id"]]["status"], "Eigenaarreview nodig")

    def test_unknown_concepts_and_lisfranc_are_not_invented_reviews(self):
        self.page("enkelartrodese", None)
        self.page("mtp-1-artrodese", None)
        self.page("lisfranc-middenvoetletsel", None)
        tasks = self.tasks()
        self.assertEqual(tasks["page-enkelartrodese"]["category"], "Status vaststellen")
        self.assertEqual(tasks["page-mtp-1-artrodese"]["category"], "Status vaststellen")
        self.assertEqual(tasks["page-lisfranc-middenvoetletsel"]["status"], "Bewust geparkeerd")
        self.assertFalse(tasks["page-lisfranc-middenvoetletsel"]["can_check"])

    def test_viewed_marker_is_durable_private_and_invalidated_by_source_edit(self):
        relative = self.page()
        before = (self.repo / relative).read_text()
        result = inventory.set_task_check(self.repo, self.state, "page-hallux-valgus", True, "Nog een formulering bekijken")
        self.assertTrue(result["checked"])
        self.assertTrue(self.tasks()[result["id"]]["checked"])
        self.assertEqual((self.repo / relative).read_text(), before)
        stored = self.state / "task_checks.json"
        self.assertEqual(stat.S_IMODE(stored.stat().st_mode), 0o600)
        self.assertEqual(stat.S_IMODE(self.state.stat().st_mode), 0o700)
        self.write(relative, before.replace("Brontekst", "Gewijzigde tekst"))
        task = self.tasks()[result["id"]]
        self.assertFalse(task["checked"])
        self.assertEqual(task["note"], "")

    def test_inventory_status_change_invalidates_marker(self):
        self.page()
        inventory.set_task_check(self.repo, self.state, "page-hallux-valgus", True)
        file = self.repo / inventory.INVENTORY_FILE
        file.write_text(file.read_text().replace("opgewaardeerd, medische review nodig", "medisch akkoord"))
        task = self.tasks()["page-hallux-valgus"]
        self.assertFalse(task["checked"])
        self.assertEqual(task["category"], "Publicatievoorbereiding")
        self.assertEqual(json.loads((self.repo / inventory.REGISTER_FILE).read_text()), {"pages": []})

    def test_concurrent_marks_preserve_both_tasks(self):
        self.page("hallux-valgus")
        self.page("hielpijn")
        def mark(slug):
            return inventory.set_task_check(self.repo, self.state, "page-" + slug, True, slug)
        with ThreadPoolExecutor(max_workers=2) as pool:
            results = list(pool.map(mark, ["hallux-valgus", "hielpijn"]))
        self.assertTrue(all(result["checked"] for result in results))
        tasks = self.tasks()
        self.assertTrue(tasks["page-hallux-valgus"]["checked"])
        self.assertTrue(tasks["page-hielpijn"]["checked"])

    def test_invalid_input_unknown_task_and_corrupt_state_do_not_overwrite(self):
        self.page()
        for task_id, checked, note in [("../../outside", True, ""), ("unknown", True, ""),
                                       ("page-hallux-valgus", "true", ""),
                                       ("page-hallux-valgus", True, "x" * 2001)]:
            with self.assertRaises(ValueError):
                inventory.set_task_check(self.repo, self.state, task_id, checked, note)
        path = self.state / "task_checks.json"
        path.write_text("BROKEN")
        with self.assertRaises(ValueError):
            inventory.set_task_check(self.repo, self.state, "page-hallux-valgus", True)
        self.assertEqual(path.read_text(), "BROKEN")

    def test_config_reads_are_fresh_and_no_prompt_or_mail_data_leaks(self):
        self.config()
        report = "# Wekelijkse hoofdredactiecheck\n## Prioriteiten\n- **Belangrijk:** Controleer een wijziging.\n## Mailstatus\nPRIVATE_REPORT patient@example.org sk-secretvalue123\n"
        self.write("docs/site/reviews/sitecheck-2026-09-09.md", report)
        payload = inventory.build_dashboard(self.repo, self.state)
        first = payload["routines"][0]
        self.assertEqual(first["status"], "Ingeschakeld")
        self.assertIn("woensdag", first["schedule"])
        self.assertNotIn("next_run", first)
        rendered = json.dumps(payload)
        for private in ("PRIVATE_PROMPT", "PRIVATE_REPORT", "patient@example.org", "sk-secretvalue123"):
            self.assertNotIn(private, rendered)
        self.config(status="PAUSED", rrule="FREQ=WEEKLY;BYDAY=FR;BYHOUR=9;BYMINUTE=15")
        updated = inventory.build_dashboard(self.repo, self.state)["routines"][0]
        self.assertEqual(updated["status"], "Gepauzeerd")
        self.assertIn("vrijdag om 09:15", updated["schedule"])

    def test_unknown_config_schema_and_recurrence_are_explicit(self):
        self.config(version=2)
        self.assertEqual(inventory.build_dashboard(self.repo, self.state)["routines"][0]["status"], "Onbekend")
        self.config(rrule="FREQ=DAILY;BYHOUR=9;BYMINUTE=0;SOMETHING=NEW")
        result = inventory.build_dashboard(self.repo, self.state)["routines"][0]
        self.assertEqual(result["schedule"], "Planning onbekend")
        self.assertNotIn("next_run", result)
        self.config(timezone="America/New_York")
        self.assertEqual(inventory.build_dashboard(self.repo, self.state)["routines"][0]["status"], "Onbekend")

    def test_article_last_run_uses_dated_evidence_without_private_delivery_details(self):
        config = self.config(index=1)
        config.with_name("memory.md").write_text("# Runs\n## 2026-09-06\n- Aangemaakt: research en preview.\n- E-mail: PRIVATE_DELIVERY patient@example.org\n- Huidige runtime: 2026-09-06 21:36 CEST.\n## 2026-08-23\n- Oudere run.\n")
        routine = inventory.build_dashboard(self.repo, self.state)["routines"][1]
        self.assertEqual(routine["last_report"], "2026-09-06 21:36 CEST")
        self.assertNotIn("PRIVATE_DELIVERY", json.dumps(routine))

    def test_only_newest_weekly_report_can_create_current_attention_task(self):
        self.write("docs/site/reviews/sitecheck-2026-09-02.md", "# Check\n## Prioriteiten\n- **Belangrijk:** OLD_PENDING_FIX\n")
        self.write("docs/site/reviews/sitecheck-2026-09-09.md", "# Check\n## Prioriteiten\n- **Belangrijk:** geen gevonden.\n")
        self.assertNotIn("report-latest-sitecheck", self.tasks())
        self.assertNotIn("OLD_PENDING_FIX", json.dumps(inventory.build_dashboard(self.repo, self.state)))

    def test_weekly_menu_followup_uses_plain_language_only_for_explicit_finding(self):
        path = "docs/site/reviews/sitecheck-2026-09-09.md"
        self.write(path, "# Check\n## Prioriteiten\n- **Belangrijk:** lokale menufixes visueel nacontroleren met verse CSS/JS vóór eventuele publicatie. Browsercontrole op poort 8788 werd geweigerd.\n")
        routine = inventory.build_dashboard(self.repo, self.state)["routines"][0]
        self.assertEqual(routine["last_result"], "De lokale menuaanpassingen moeten nog visueel worden nagekeken vóór publicatie.")
        self.write(path, "# Check\n## Prioriteiten\n- **Belangrijk:** Controleer de vernieuwde afbeelding.\n")
        routine = inventory.build_dashboard(self.repo, self.state)["routines"][0]
        self.assertEqual(routine["last_result"], "Controleer de vernieuwde afbeelding.")

    def test_agent_snapshot_never_claims_live_state_and_expires(self):
        now = datetime.now(timezone.utc)
        file = self.state / "agents.json"
        data = {"updated_at": now.isoformat(), "agents": [{"name": "Redacteur", "status": "running", "role": "Artikelpilot", "prompt": "PRIVATE_AGENT_PROMPT"}]}
        file.write_text(json.dumps(data))
        fresh = inventory.build_dashboard(self.repo, self.state)["agents"][0]
        self.assertEqual(fresh["status"], "Actief bij vastleggen")
        self.assertIn("geen live", fresh["detail"])
        self.assertNotIn("PRIVATE_AGENT_PROMPT", json.dumps(fresh))
        data["updated_at"] = (now - timedelta(minutes=6)).isoformat()
        file.write_text(json.dumps(data))
        self.assertEqual(inventory.build_dashboard(self.repo, self.state)["agents"][0]["status"], "Momentopname verouderd")

    def test_invalid_registry_fails_closed_without_approving_pages(self):
        self.page()
        self.write("PUBLICATIE_REGISTER.json", "{")
        tasks = self.tasks()
        self.assertIn("source-status", tasks)
        self.assertEqual(tasks["page-hallux-valgus"]["status"], "Status vaststellen")
        self.write("PUBLICATIE_REGISTER.json", json.dumps({"pages": [{"path": {"invalid": True}, "verification_status": []}]}))
        self.assertIn("source-status", self.tasks())


if __name__ == "__main__":
    unittest.main()
