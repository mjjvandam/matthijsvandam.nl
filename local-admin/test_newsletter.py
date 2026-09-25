import json
import tempfile
import unittest
from datetime import datetime, timedelta, timezone
from pathlib import Path

from newsletter import read_newsletter


class NewsletterTests(unittest.TestCase):
    def test_snapshot_exposes_only_aggregates_and_marks_old_counts(self):
        with tempfile.TemporaryDirectory() as directory:
            state = Path(directory)
            raw = {"source": "Brevo browser verification", "captured_at": (datetime.now(timezone.utc) - timedelta(days=2)).isoformat(),
                   "confirmed_subscribers": 1, "excluded_test_contacts": 1, "email": "private@example.com"}
            (state / "newsletter.json").write_text(json.dumps(raw))
            result = read_newsletter(state)
            self.assertEqual(result["confirmed_subscribers"], 1)
            self.assertTrue(result["stale"])
            self.assertNotIn("email", result)

    def test_missing_or_invalid_data_never_becomes_zero(self):
        with tempfile.TemporaryDirectory() as directory:
            state = Path(directory)
            self.assertNotIn("confirmed_subscribers", read_newsletter(state))
            base = {"source": "Brevo browser verification", "captured_at": datetime.now(timezone.utc).isoformat(),
                    "confirmed_subscribers": 0, "excluded_test_contacts": 1}
            for value in (-1, True, "1", None):
                (state / "newsletter.json").write_text(json.dumps(dict(base, confirmed_subscribers=value)))
                self.assertNotIn("confirmed_subscribers", read_newsletter(state))
            (state / "newsletter.json").write_text(json.dumps(base))
            self.assertEqual(read_newsletter(state)["confirmed_subscribers"], 0)


if __name__ == "__main__":
    unittest.main()
