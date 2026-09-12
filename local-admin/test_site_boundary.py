"""The admin exception must never hide an accidentally public page."""
import importlib.util
from pathlib import Path
import tempfile
import unittest


class SiteBoundaryTest(unittest.TestCase):
    def test_admin_navigation_exception_retains_public_guard(self):
        path = Path(__file__).resolve().parents[1] / "tools/check_navigation_contract.py"
        spec = importlib.util.spec_from_file_location("navigation_boundary_test", path)
        nav = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(nav)
        with tempfile.TemporaryDirectory() as directory:
            nav.ROOT = Path(directory)
            nav.SITEMAP = nav.ROOT / "sitemap.xml"
            nav.SITEMAP.write_text('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>')
            page = nav.ROOT / "local-admin/ui/index.html"
            page.parent.mkdir(parents=True)
            page.write_text('<meta name="robots" content="noindex, nofollow">')
            self.assertEqual(nav.run_checks(), [])
            page.write_text('<meta name="robots" content="index, follow">')
            self.assertTrue(any(code == "navigation_header_count" for code, detail in nav.run_checks()))
            page.write_text('<meta name="robots" content="noindex, nofollow">')
            nav.SITEMAP.write_text('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://matthijsvandam.nl/local-admin/ui/index.html</loc></url></urlset>')
            self.assertTrue(any(code == "navigation_header_count" for code, detail in nav.run_checks()))


if __name__ == "__main__":
    unittest.main()
