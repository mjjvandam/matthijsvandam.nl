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

    def test_page_performance_is_returned_as_a_separate_dated_observation(self):
        performance = {
            'captured_at': datetime.now(timezone.utc).isoformat(),
            'period': '25 augustus–21 september 2026 (28 dagen)',
            'comparison_period': '28 juli–24 augustus 2026 (28 dagen)',
            'summary': {'clicks': 58, 'impressions': 1180},
            'top_pages': [{'path': '/', 'clicks': 45, 'impressions': 770}],
            'attention': {'path': '/behandelingen.html', 'impressions': 125,
                          'previous_impressions': 26, 'clicks': 1, 'ctr': 0.8,
                          'position': 31.3, 'change_percent': 381},
        }
        result = self.read(performance=performance)
        self.assertEqual(result['performance']['top_pages'][0]['clicks'], 45)
        self.assertEqual(result['performance']['attention']['previous_impressions'], 26)

    def test_invalid_optional_performance_does_not_invalidate_index_snapshot(self):
        result = self.read(performance={'captured_at': 'invalid'})
        self.assertEqual(result['status'], 'Opgeslagen momentopname')
        self.assertNotIn('performance', result)

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
