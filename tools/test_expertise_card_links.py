"""Regression tests for the publication-aware expertise-card check."""

import tempfile
import unittest
from pathlib import Path

from check_site_quality import check_expertise_cards


class ExpertiseCardLinksTest(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.base = Path(self.temp.name)
        self.public = self.base / "public.html"
        self.concept = self.base / "concept.html"
        self.public.write_text('<meta name="robots" content="index, follow">', encoding="utf-8")
        self.concept.write_text('<meta name="robots" content="noindex, nofollow">', encoding="utf-8")

    def codes(self, html, public_paths=None):
        return {kind for kind, _ in check_expertise_cards(html, self.base, public_paths or set(), {})}

    def full_card(self, destination="public.html"):
        return f'''<article class="expertise-card article-card-clickable" data-url="{destination}">
          <a class="article-card-link" href="{destination}">
            <div class="article-card-body"><img src="image.png"><h3>Onderwerp</h3></div>
          </a></article>'''

    def test_public_full_card_passes(self):
        self.assertEqual(self.codes(self.full_card()), set())

    def test_published_page_still_marked_concept_is_caught(self):
        html = '<article class="expertise-card" data-concept-url="public.html"><div class="article-card-body"></div></article>'
        self.assertIn("published_expertise_card_still_concept", self.codes(html))

    def test_text_link_is_not_a_full_card(self):
        html = '<article class="expertise-card" data-url="public.html"><div class="article-card-body"><a href="public.html">Lees meer</a></div></article>'
        self.assertIn("published_expertise_card_not_fully_linked", self.codes(html))

    def test_concept_without_link_passes(self):
        html = '<article class="expertise-card" data-concept-url="concept.html"><div class="article-card-body"></div></article>'
        self.assertEqual(self.codes(html), set())

    def test_concept_link_is_caught(self):
        self.assertIn("expertise_card_links_to_nonpublic_page", self.codes(self.full_card("concept.html")))

    def test_runtime_url_to_concept_is_caught(self):
        html = '<article class="expertise-card" data-url="concept.html"><div class="article-card-body"></div></article>'
        self.assertIn("expertise_card_public_url_not_released", self.codes(html))

    def test_sitemap_alone_counts_as_public(self):
        html = '<article class="expertise-card" data-concept-url="concept.html"></article>'
        self.assertIn("published_expertise_card_still_concept", self.codes(html, {self.concept.resolve()}))

    def test_wrong_wrapper_target_is_caught(self):
        html = self.full_card().replace('href="public.html"', 'href="concept.html"')
        self.assertIn("published_expertise_card_not_fully_linked", self.codes(html))

    def test_other_cards_do_not_inherit_links(self):
        html = self.full_card() + '<article class="expertise-card" data-concept-url="concept.html"><div class="article-card-body"></div></article>'
        self.assertEqual(self.codes(html), set())

    def test_no_mapping_is_not_guessed(self):
        self.assertEqual(self.codes('<article class="expertise-card"><h3>Onbekend onderwerp</h3></article>'), set())


if __name__ == "__main__":
    unittest.main()
