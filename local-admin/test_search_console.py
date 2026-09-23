"""Snapshot validation against observed Google status and exclusion reasons."""
import json
import tempfile
import unittest
from datetime import datetime, timezone
from pathlib import Path
from search_console import read_search_console


class SearchConsoleTests(unittest.TestCase):
    def read(self, **changes):
        data = dict(captured_at=datetime.now(timezone.utc).isoformat(),
                    index_updated_at='2026-09-21', verified=True,
                    sitemap_status='Succesvol', discovered=49, indexed=20,
                    not_indexed=40, not_found=5, redirected=5, canonical_alternate=1,
                    discovered_not_indexed=29, crawled_not_indexed=0)
        data.update(changes)
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory)
            (path / 'search-console.json').write_text(json.dumps(data))
            return read_search_console(path)

    def test_current_google_snapshot(self):
        result = self.read()
        self.assertEqual(result['status'], 'Opgeslagen momentopname')
        self.assertEqual(result['discovered_not_indexed'], 29)
        self.assertEqual(result['not_indexed'], 40)

    def test_legacy_snapshot_without_extra_reasons(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory)
            data = self.read()
            data.pop('discovered_not_indexed'); data.pop('crawled_not_indexed')
            data['not_indexed'] = 11; data['sitemap_status'] = 'Sitemap is verwerkt'
            (path / 'search-console.json').write_text(json.dumps(data))
            result = read_search_console(path)
            self.assertEqual(result['status'], 'Opgeslagen momentopname')
            self.assertNotIn('discovered_not_indexed', result)

    def test_inconsistent_or_unknown_values_are_rejected(self):
        for changes in ({'not_indexed': 11}, {'discovered_not_indexed': -1},
                        {'crawled_not_indexed': True}, {'sitemap_status': 'Onbekend'}):
            with self.subTest(changes=changes):
                self.assertEqual(self.read(**changes)['status'], 'Niet opgehaald')
