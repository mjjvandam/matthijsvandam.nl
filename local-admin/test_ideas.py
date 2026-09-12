"""Durable owner choices for curated ideas; no public mutation or automatic work."""
import copy
from concurrent.futures import ThreadPoolExecutor
import http.client
import json
from pathlib import Path
import stat
import tempfile
import threading
from types import SimpleNamespace
import unittest
from unittest.mock import patch

from ideas import CATALOG, IdeasConflict, IdeasError, choose_idea, read_ideas
import inventory
from server import LocalServer


class IdeaTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(prefix="mvd-ideas-test-")
        self.addCleanup(self.tmp.cleanup)
        self.repo = Path(self.tmp.name) / "repo"
        self.state = self.repo / "local-admin/state"
        (self.repo / "local-admin").mkdir(parents=True)
        (self.repo / "docs").mkdir()
        (self.repo / "docs/evidence.md").write_text("Bestaande algemene context.")
        self.catalog_path = self.repo / CATALOG
        self.item = {"id": "reading-route", "title": "Een korte leesroute", "perspectives": ["Patiënt", "Redacteur / ontwerper"],
                     "category": "Inhoud & redactie", "kind": "experience", "why": "De lezer zoekt een volgend onderwerp.",
                     "proposal": "Onderzoek een kleine leesroute.", "first_step": "Bekijk drie bestaande artikelen.", "effort": "Klein",
                     "tradeoff": "Meer links kunnen afleiden.", "success_check": "Een lezer vindt een passend vervolg.",
                     "evidence": [{"label": "Projectcontext", "path": "docs/evidence.md"}], "priority": 2,
                     "reviewed_at": "2026-09-10T20:00:00+02:00"}
        self.catalog = {"version": 1, "updated_at": "2026-09-10T20:00:00+02:00", "items": [copy.deepcopy(self.item)]}
        self.save_catalog()
        self.patch = patch.object(inventory, "AUTOMATIONS_DIR", Path(self.tmp.name) / "automations")
        self.patch.start()
        self.addCleanup(self.patch.stop)

    def save_catalog(self):
        self.catalog_path.write_text(json.dumps(self.catalog, ensure_ascii=False))

    def snapshot(self):
        return read_ideas(self.repo, self.state)

    def current(self, idea_id="reading-route"):
        return next(item for item in self.snapshot()["items"] if item["id"] == idea_id)

    def choose(self, choice, item=None):
        item = item or self.current()
        return choose_idea(self.repo, self.state, item["id"], choice, item["version"], item["choice_version"])

    def tasks(self):
        return [task for task in inventory.build_dashboard(self.repo, self.state)["tasks"] if task.get("kind") == "idea"]

    def test_replenishment_threshold_and_new_kinds_preserve_choices(self):
        self.catalog['items'] = [dict(self.item, id='idea-' + kind, kind=kind)
                                 for kind in ('agent', 'skill', 'simplify')]
        self.save_catalog()
        self.assertFalse(self.snapshot()['replenishment']['needed'])
        self.choose('saved', self.current('idea-agent'))
        result = self.snapshot()
        self.assertTrue(result['replenishment']['needed'])
        self.assertEqual(result['replenishment']['new_count'], 2)
        self.assertEqual(result['replenishment']['max_additions'], 3)
        self.assertEqual(self.current('idea-agent')['choice'], 'saved')
        self.assertEqual(self.tasks(), [])
        self.catalog_path.write_text('broken')
        self.assertIn('error', self.snapshot())
        self.assertNotIn('replenishment', self.snapshot())

    def test_saved_choice_survives_reload_catalog_reorder_and_undo(self):
        initial = self.current()
        self.assertEqual(initial["choice"], "new")
        self.assertFalse((self.state / "ideas.json").exists())
        self.choose("saved")
        saved = self.current()
        self.assertEqual(saved["choice"], "saved")
        self.assertNotEqual(saved["choice_version"], initial["choice_version"])
        self.assertEqual(stat.S_IMODE((self.state / "ideas.json").stat().st_mode), 0o600)
        second = copy.deepcopy(self.item)
        second["id"] = "second-idea"
        self.catalog["items"].insert(0, second)
        self.catalog["updated_at"] = "2026-09-11T20:00:00+02:00"
        self.save_catalog()
        refreshed = self.current()
        self.assertEqual(refreshed["version"], saved["version"])
        self.assertEqual(refreshed["choice_version"], saved["choice_version"])
        self.assertEqual(refreshed["choice"], "saved")
        self.choose("dismissed")
        self.assertEqual(self.current()["choice"], "dismissed")
        self.choose("new")
        self.assertEqual(self.current()["choice"], "new")
        self.assertEqual(self.tasks(), [])

    def test_promotion_is_idempotent_exactly_one_task_and_reversible(self):
        item = self.current()
        first = self.choose("todo", item)
        second = self.choose("todo", item)
        self.assertEqual(first, second)
        tasks = self.tasks()
        self.assertEqual(len(tasks), 1)
        task = tasks[0]
        self.assertEqual(task["id"], "idea-reading-route")
        self.assertEqual(task["idea_id"], "reading-route")
        self.assertEqual(task["workflow_status"], "open")
        self.assertEqual(task["status"], "Idee om te onderzoeken")
        self.assertFalse(task["can_check"])
        self.assertFalse(task["checked"])
        self.assertEqual(task["next_action"], self.item["first_step"])
        self.choose("saved")
        self.assertEqual(self.tasks(), [])
        self.choose("todo")
        self.assertEqual(len(self.tasks()), 1)
        self.choose("dismissed")
        self.assertEqual(self.tasks(), [])

    def test_stale_content_and_choice_tokens_conflict_without_overwriting(self):
        old = self.current()
        self.catalog["items"][0]["proposal"] = "Een anders geformuleerd voorstel."
        self.save_catalog()
        with self.assertRaises(IdeasConflict) as changed:
            self.choose("todo", old)
        self.assertEqual(changed.exception.current["items"][0]["choice"], "new")
        current = self.current()
        self.choose("saved", current)
        with self.assertRaises(IdeasConflict):
            self.choose("dismissed", current)
        self.assertEqual(self.current()["choice"], "saved")
        self.choose("new")
        with self.assertRaises(IdeasConflict):
            self.choose("todo", current)
        self.assertEqual(self.current()["choice"], "new")

    def test_changed_idea_requires_reconfirmation_before_task_can_change(self):
        self.choose("todo")
        old_state = (self.state / "ideas.json").read_bytes()
        self.catalog["items"][0]["first_step"] = "Een andere onderzoeksstap beoordelen."
        self.save_catalog()
        changed = self.current()
        self.assertTrue(changed["choice_stale"])
        self.assertEqual(changed["previous_choice"], "todo")
        self.assertEqual(changed["choice"], "new")
        self.assertEqual(self.tasks(), [])
        self.assertEqual((self.state / "ideas.json").read_bytes(), old_state)
        self.choose("todo", changed)
        confirmed = self.current()
        self.assertFalse(confirmed["choice_stale"])
        self.assertIsNone(confirmed["previous_choice"])
        self.assertEqual(len(self.tasks()), 1)
        self.assertEqual(self.tasks()[0]["next_action"], "Een andere onderzoeksstap beoordelen.")
        self.catalog["items"][0]["title"] = "Een vernieuwd idee"
        self.save_catalog()
        self.choose("new")
        self.assertFalse(self.current()["choice_stale"])
        self.assertEqual(self.current()["choice"], "new")

    def test_concurrent_choices_for_different_ideas_are_both_retained(self):
        other = copy.deepcopy(self.item)
        other["id"] = "other-idea"
        self.catalog["items"].append(other)
        self.save_catalog()
        items = self.snapshot()["items"]
        with ThreadPoolExecutor(max_workers=2) as pool:
            list(pool.map(lambda item: self.choose("saved", item), items))
        self.assertEqual([item["choice"] for item in self.snapshot()["items"]], ["saved", "saved"])

    def test_corrupt_or_symlinked_state_is_not_overwritten(self):
        item = self.current()
        self.state.mkdir()
        state_file = self.state / "ideas.json"
        state_file.write_text('{"version":1,"choices":[]}', encoding="utf-8")
        before = state_file.read_bytes()
        self.assertIn("error", self.snapshot())
        with self.assertRaises(IdeasError):
            self.choose("saved", item)
        self.assertEqual(state_file.read_bytes(), before)
        outside = Path(self.tmp.name) / "outside.json"
        outside.write_text('{"version":1,"choices":{}}')
        state_file.unlink()
        state_file.symlink_to(outside)
        self.assertIn("error", self.snapshot())
        with self.assertRaises(IdeasError):
            self.choose("saved", item)
        self.assertEqual(outside.read_text(), '{"version":1,"choices":{}}')

    def test_missing_invalid_and_unsafe_catalogs_leave_dashboard_available(self):
        cases = [None, "{", {"version": 2, "items": []}]
        for evidence in ({"label": "Bron", "path": "../outside.md"},
                         {"label": "Bron", "path": ".env"},
                         {"label": "Bron", "url": "https://example.org/path?token=SECRET_VALUE"},
                         {"label": "Bron", "url": "https://user:password@example.org/path"}):
            data = copy.deepcopy(self.catalog)
            data["items"][0]["evidence"] = [evidence]
            cases.append(data)
        for case in cases:
            with self.subTest(case=case):
                if case is None:
                    self.catalog_path.unlink(missing_ok=True)
                else:
                    self.catalog_path.write_text(case if isinstance(case, str) else json.dumps(case))
                dashboard = inventory.build_dashboard(self.repo, self.state)
                self.assertIn("tasks", dashboard)
                self.assertIn("routines", dashboard)
                self.assertEqual(dashboard["ideas"]["items"], [])
                self.assertIn("error", dashboard["ideas"])
                self.assertNotIn("SECRET_VALUE", json.dumps(dashboard))

    def test_choices_never_change_public_sources_or_medical_approval(self):
        originals = {"index.html": "<h1>Publieke website</h1>", "content.js": "const articles=[];",
                     "PUBLICATIE_REGISTER.json": json.dumps({"pages": []}),
                     "sitemap.xml": "<urlset></urlset>", ".vercelignore": "local-admin/\n"}
        for path, content in originals.items():
            (self.repo / path).write_text(content)
        self.choose("saved")
        self.choose("todo")
        self.choose("dismissed")
        self.choose("new")
        for path, content in originals.items():
            self.assertEqual((self.repo / path).read_text(), content)
        self.assertFalse((self.state / "editorial.sqlite3").exists())

    def test_http_auth_csrf_schema_and_conflict_contract(self):
        server = LocalServer(("127.0.0.1", 0), SimpleNamespace(repo=self.repo, state_dir=self.state))
        threading.Thread(target=server.serve_forever, daemon=True).start()
        self.addCleanup(server.server_close)
        self.addCleanup(server.shutdown)
        def request(method, path, payload=None, headers=None):
            connection = http.client.HTTPConnection("127.0.0.1", server.server_port, timeout=5)
            connection.request(method, path, json.dumps(payload) if payload is not None else None, headers or {})
            response = connection.getresponse()
            result = response.status, dict(response.getheaders()), json.loads(response.read())
            connection.close()
            return result
        item = self.current()
        payload = {"choice": "todo", "version": item["version"], "choice_version": item["choice_version"]}
        path = "/api/ideas/reading-route/choice"
        self.assertEqual(request("POST", path, payload)[0], 403)
        _, headers, session = request("GET", "/api/session")
        auth = {"Cookie": headers["Set-Cookie"].split(";")[0], "Content-Type": "application/json"}
        self.assertEqual(request("POST", path, payload, auth)[0], 403)
        auth["X-CSRF-Token"] = session["csrf"]
        status, _, response = request("POST", path, payload, auth)
        self.assertEqual(status, 200)
        self.assertEqual(response["ideas"]["items"][0]["choice"], "todo")
        self.assertEqual(request("POST", path, payload, auth)[0], 200)
        status, _, conflict = request("POST", path, payload | {"choice": "dismissed"}, auth)
        self.assertEqual(status, 409)
        self.assertEqual(conflict["current"]["ideas"]["items"][0]["choice"], "todo")
        self.assertEqual(request("POST", path, payload | {"actor": "owner"}, auth)[0], 400)
        self.assertEqual(request("POST", path, payload, auth | {"Origin": "https://other.example.org"})[0], 403)


if __name__ == "__main__":
    unittest.main()
