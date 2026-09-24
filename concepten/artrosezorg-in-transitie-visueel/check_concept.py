"""Controleer brongetallen, bron/HTML-consistentie en lokale publicatiegrens."""
import json
import re
from html import unescape
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit
import xml.etree.ElementTree as ET

BASE=Path(__file__).resolve().parent
REPO=BASE.parents[1]
class Page(HTMLParser):
    def __init__(self):
        super().__init__(); self.ids=[]; self.refs=[]; self.robots=None; self.h1=0
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if 'id' in a:self.ids.append(a['id'])
        if tag=='h1':self.h1+=1
        if tag=='meta' and a.get('name')=='robots':self.robots=a.get('content')
        for key in ('src','href'):
            if key in a:self.refs.append(a[key])

html=(BASE/'index.html').read_text();page=Page();page.feed(html)
assert page.h1==1 and len(page.ids)==len(set(page.ids)), 'Koppen of dubbele IDs'
assert page.robots=='noindex, nofollow'
for ref in page.refs:
    url=urlsplit(ref)
    if url.scheme or url.netloc:continue
    if url.path:assert (BASE/url.path).resolve().exists(),ref
    elif url.fragment:assert url.fragment in page.ids,ref
data=json.loads((BASE/'verhaal.json').read_text())
words=len(data['intro'].split())+sum(len(p.split()) for c in data['chapters'] for p in c['paragraphs'])
assert 700<=words<=900,words
for chapter in data['chapters']:
    assert chapter['id'] in page.ids
    for paragraph in chapter['paragraphs']:assert paragraph in unescape(html)
assert len(data['chapters'])==8
assert 'GLA:D' in html and 'Beweeghuis' in html and 'https://www.ntvg.nl/D8889' in html
textual_html=re.sub(r'data:image/[^;]+;base64,[A-Za-z0-9+/=]+', "", html)
for removed in ['Lawford', 'NICE', '55.059', 'research-legend', 'Operatiewens bij twee metingen']:
    assert removed not in textual_html, 'Verwijderde zelfstandige bronlaag teruggekeerd: '+removed
assert 'concepten/' in (REPO/'.vercelignore').read_text().splitlines()
assert 'artrosezorg-in-transitie-visueel' not in (REPO/'sitemap.xml').read_text()
assert 'artrosezorg-in-transitie-visueel' not in (REPO/'content.js').read_text()
for i in range(1,9):ET.fromstring((BASE/f'assets/journey-{i}.svg').read_text())
assert html.count('id="traveller"')==1
assert 'chapter-number' not in html
assert 'journey-data' in page.ids
print(f'PASS: {words} woorden; 8 momenten; NTvG-bronlijn; tekst/HTML; links; SVG; noindex; deployment/sitemap/content-grens.')
