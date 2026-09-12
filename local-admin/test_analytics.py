import json
from pathlib import Path
import tempfile
import unittest

from analytics import read_analytics


class AnalyticsTest(unittest.TestCase):
    def test_missing_is_unknown_not_zero(self):
        with tempfile.TemporaryDirectory() as folder:
            info = read_analytics(Path(folder), Path(folder))
            self.assertNotIn("visitors", info)
            self.assertNotIn("views", info)

    def test_snapshot_scope_sanitization_and_timestamp(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            (root / "PUBLICATIE_REGISTER.json").write_text(json.dumps({"pages": [{"path": "index.html"}]}))
            value = {"captured_at": "2026-09-09T18:00:00Z", "views": 94, "visitors": 36,
                     "environment": "Production", "period": "7 dagen", "token": "must-not-escape",
                     "pages": [{"path": "/", "visitors": 25}, {"path": "javascript:bad()", "visitors": 3}]}
            (root / "analytics.json").write_text(json.dumps(value))
            info = read_analytics(root, root)
            self.assertEqual(info["status"], "Momentopname")
            self.assertEqual(info["visitors"], 36)
            self.assertEqual(len(info["pages"]), 1)
            self.assertNotIn("must-not-escape", json.dumps(info))
            value["views"] = -1
            (root / "analytics.json").write_text(json.dumps(value))
            self.assertNotIn("views", read_analytics(root, root))

    def test_ranked_titles_keep_homepage_routes_separate(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            (root / "PUBLICATIE_REGISTER.json").write_text(json.dumps({"pages": [
                {"path": "index.html", "title": "Matthijs van Dam"},
                {"path": "projecten.html", "title": "Projecten | drs. Matthijs van Dam"}]}))
            value = {"captured_at": "2026-09-09T18:00:00Z", "views": 94, "visitors": 36,
                     "environment": "Production", "period": "Exacte providerperiode",
                     "period_label": "2–9 september 2026", "pages": [
                         {"path": "/index.html", "visitors": 5},
                         {"path": "/projecten.html", "visitors": 8, "title": "Niet vertrouwde kop"},
                         {"path": "/", "visitors": 25},
                         {"path": "/concept.html", "visitors": 80}]}
            (root / "analytics.json").write_text(json.dumps(value))
            info = read_analytics(root, root)
            self.assertEqual(info["period_label"], "2–9 september 2026")
            self.assertEqual(info["period"], "Exacte providerperiode")
            self.assertEqual([(p["title"], p["visitors"]) for p in info["pages"]], [
                ("Homepage", 25), ("Projecten", 8), ("Homepage (via /index.html)", 5)])
            self.assertEqual(info["visitors"], 36)
            value["pages"].append({"path": "/", "visitors": 25})
            (root / "analytics.json").write_text(json.dumps(value))
            self.assertNotIn("visitors", read_analytics(root, root))

    def test_malformed_snapshot_stays_unavailable(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            (root / "PUBLICATIE_REGISTER.json").write_text(json.dumps({"pages": []}))
            for value in ([], {"captured_at": []}, {"captured_at": "2026-09-09T18:00:00Z",
                          "views": 0, "visitors": 0, "environment": "Production",
                          "period": "7 dagen", "pages": [None]}):
                (root / "analytics.json").write_text(json.dumps(value))
                self.assertNotIn("visitors", read_analytics(root, root))


if __name__ == "__main__":
    unittest.main()
