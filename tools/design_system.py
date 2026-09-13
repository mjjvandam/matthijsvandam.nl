#!/usr/bin/env python3
"""Build the local design catalogue and find affected pages; never edits the site."""
import argparse
import hashlib
import json
from pathlib import Path
from html.parser import HTMLParser

ROOT = Path(__file__).resolve().parents[1]
CATALOG = ROOT / 'docs/design-system/components.json'
OUTPUT = ROOT / 'docs/design-system/index.html'
INVENTORY = ROOT / 'docs/design-system/usage.json'

class Markers(HTMLParser):
    def __init__(self):
        super().__init__(); self.values = set()
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        self.values.update(attrs.get('class', '').split())
        self.values.add(attrs.get('data-content', ''))


def data():
    catalog = json.loads(CATALOG.read_text())
    pages = sorted(p for pattern in ('*.html','artikelen/*.html','projecten/*.html','behandelingen/*.html') for p in ROOT.glob(pattern))
    parsed = {}
    for p in pages:
        parser = Markers(); parser.feed(p.read_text()); parsed[p.relative_to(ROOT).as_posix()] = parser.values
    public = {p['path'] for p in json.loads((ROOT/'PUBLICATIE_REGISTER.json').read_text())['pages']}
    components = []
    for entry in catalog['components']:
        item = dict(entry)
        source = ROOT/item['source']
        if not source.exists(): raise ValueError(f"Missing example source: {source}")
        if item['selector'].removeprefix('.') not in parsed[item['source']]:
            raise ValueError(f"Missing example selector: {item['source']} {item['selector']}")
        item['pages'] = [{'path': path, 'scope': 'registered' if path in public else 'concept'} for path, markers in parsed.items() if set(item['markers']) & markers]
        tracked = sorted(set(item['sources'] + [item['source']] + [p['path'] for p in item['pages']]))
        item['fingerprints'] = {path: hashlib.sha256((ROOT/path).read_bytes()).hexdigest() for path in tracked}
        components.append(item)
    return {'version': 1, 'catalogue_sources': {path: hashlib.sha256((ROOT/path).read_bytes()).hexdigest() for path in ('docs/design-system/catalogue.js', 'docs/design-system/catalogue.css', 'docs/site/DESIGN_SYSTEM.md')}, 'components': components}


def render(inventory):
    payload = json.dumps(inventory, ensure_ascii=False).replace('<','\\u003c')
    # The shell is documentation only. Frames load the real site CSS, markup and JS.
    return '''<!doctype html>
<html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex, nofollow"><title>Stijlgids — Matthijs van Dam</title>
<link rel="stylesheet" href="../../styles.css"><link rel="stylesheet" href="catalogue.css"></head>
<body><main class="ds-shell" id="top"><p class="ds-eyebrow">Lokaal · bestaande website als bron</p>
<h1>Stijlgids</h1><p>Dit overzicht gebruikt de echte pagina’s, CSS en interacties van de lokale site. Lokale voorbeelden zijn geen bewijs van publicatie of medisch akkoord.</p>
<p><a href="../site/DESIGN_SYSTEM.md">Ontwerp- en wijzigingsafspraken</a></p>
<section class="ds-foundations"><h2>Kleuren en typografie</h2><p>De kleurvlakken lezen de actuele CSS-variabelen. Koppen en lopende tekst hieronder gebruiken de bestaande lettertypen.</p><div id="tokens"></div>
<p class="ds-type-heading">Rustige, herkenbare koppen</p><p>Heldere lopende tekst, met voldoende ruimte om te lezen.</p></section>
<div class="ds-controls"><label for="theme">Kleurmodus</label><select id="theme"><option value="light">Licht</option><option value="dark">Donker</option></select>
<label for="width">Voorbeeldbreedte</label><select id="width"><option value="1200">Desktop · 1200 px</option><option value="360">Mobiel · 360 px</option><option value="390">Mobiel · 390 px</option><option value="430">Mobiel · 430 px</option></select></div>
<p>De voorbeelden tonen echte pagina’s ter hoogte van het onderdeel. Open de bronpagina voor een controle zonder kader. Formulieren verzenden niet vanuit deze voorbeelden.</p>
<div id="examples"></div></main>
<script type="application/json" id="catalogue-data">''' + payload + '''</script><script src="catalogue.js"></script></body></html>
'''


def run_checks():
    try:
        current = data()
        expected = json.dumps(current, ensure_ascii=False, indent=2)+'\n'
        issues = []
        if not INVENTORY.exists() or INVENTORY.read_text() != expected:
            issues.append(('design_system_stale', 'Bronnen of gebruik veranderd: controleer impact en voer python3 tools/design_system.py --build uit.'))
        if not OUTPUT.exists() or OUTPUT.read_text() != render(current):
            issues.append(('design_gallery_stale', 'Voorbeeldpagina bijwerken na inhoudelijke impactcontrole.'))
        if 'docs/' not in (ROOT/'.vercelignore').read_text().splitlines():
            issues.append(('design_gallery_deploy_scope', 'docs/ moet uitgesloten blijven van deployment.'))
        return issues
    except (ValueError, OSError, KeyError) as error:
        return [('design_system_invalid', str(error))]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--build', action='store_true')
    parser.add_argument('--check', action='store_true')
    parser.add_argument('--impact', metavar='COMPONENT_OR_FILE')
    args = parser.parse_args()
    if args.impact:
        matches = [c for c in data()['components'] if args.impact == c['id'] or args.impact in c['sources'] or any(args.impact == p['path'] for p in c['pages'])]
        if not matches: print('Geen catalogusmatch; handmatige impactanalyse nodig.'); return 1
        for c in matches:
            print(c['id']+': '+c['name'])
            for p in c['pages']: print('  '+p['scope']+' '+p['path'])
        print('Dit is een conservatieve kandidatenlijst, geen bewijs dat iedere pagina moet wijzigen of is goedgekeurd.')
        return 0
    if args.build:
        current = data(); INVENTORY.write_text(json.dumps(current,ensure_ascii=False,indent=2)+'\n'); OUTPUT.write_text(render(current))
        print('Stijlgids en gebruiksoverzicht bijgewerkt. Visuele review en publicatie blijven afzonderlijk.')
    issues = run_checks()
    for kind, detail in issues: print(kind+': '+detail)
    if not issues: print('Designsysteem: bronnen, voorbeelden en gebruiksoverzicht lopen gelijk.')
    return bool(issues)

if __name__ == '__main__': raise SystemExit(main())
