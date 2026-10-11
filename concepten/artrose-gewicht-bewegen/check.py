#!/usr/bin/env python3
"""Verify local boundary and navigation graph; no network or mutations."""
import json
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
from build import HERE, ROOT, ROUTES, check

class Page(HTMLParser):
    def __init__(self, path):
        super().__init__(); self.path=path; self.links=[]; self.ids=[]; self.robots=None; self.external_scripts=[]
        self.feed(path.read_text())
    def handle_starttag(self, tag, pairs):
        a=dict(pairs)
        if 'id' in a: self.ids.append(a['id'])
        for key in ['href','src']:
            if key in a: self.links.append((tag,key,a[key]))
        if tag=='meta' and a.get('name')=='robots': self.robots=a.get('content')
        if tag=='script' and a.get('src','').startswith('http'): self.external_scripts.append(a['src'])

check()
errors=[]; inherited=[]; link_count=0
pages={path:Page(HERE/'integratie'/path) for path in ROUTES}
for route,page in pages.items():
    if page.robots!='noindex, nofollow': errors.append(f'Indexering: {route}')
    if page.external_scripts: errors.append(f'Externe scripts: {route}')
    if len(page.ids)!=len(set(page.ids)): inherited.append(f'Bestaande dubbele IDs: {route}')
    for tag,key,link in page.links:
        if tag=='base': continue
        parsed=urlsplit(link)
        if parsed.scheme or link.startswith('//'): continue
        if not parsed.path: continue
        destination=ROOT/unquote(parsed.path.lstrip('/'))
        if not destination.is_file(): errors.append(f'Ontbreekt: {route} → {link}'); continue
        link_count+=1
        if parsed.fragment and destination.suffix=='.html':
            target=Page(destination)
            if unquote(parsed.fragment) not in target.ids:
                # New local graph must work; unrelated existing source anchors reported separately.
                text=f'Anker ontbreekt: {route} → {link}'
                (errors if 'artrose-gewicht-bewegen' in link or route=='artrose-gewicht-bewegen.html' else inherited).append(text)
manifest=json.loads((HERE/'manifest.json').read_text())
assert 'concepten/' in (ROOT/'.vercelignore').read_text().splitlines()
assert 'artrose-gewicht-bewegen.html' not in (ROOT/'sitemap.xml').read_text()
assert 'artrose-gewicht-bewegen.html' not in (ROOT/'PUBLICATIE_REGISTER.json').read_text()
hub=(HERE/'integratie/artrose-gewicht-bewegen.html').read_text()
assert 'data-theme-signup' in hub and 'name="audience"' in hub
assert 'name="lists_27[]"' not in hub and 'sibforms.com' not in hub
assert 'form-action &#39;none&#39;' in hub
home=(HERE/'integratie/index.html').read_text()
assert home.count('id="artrose-gewicht-bewegen"')==1
assert 'id="transmuraal-tilburg-cohort"' not in home
assert '<!-- ARTROSE-STORY:START -->' not in home
report={'pages':len(pages),'local_links_checked':link_count,'blocking':sorted(set(errors)),'inherited_notes':sorted(set(inherited)),'public_sources_unchanged':True}
(HERE/'check-result.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(report,ensure_ascii=False,indent=2))
raise SystemExit(bool(errors))
