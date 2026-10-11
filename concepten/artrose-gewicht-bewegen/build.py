#!/usr/bin/env python3
"""Build reviewable local copies and exact release diffs; never edits public sources."""
import argparse
import difflib
import hashlib
import json
import posixpath
import re
from pathlib import Path
from urllib.parse import urlsplit

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
PREFIX = '/concepten/artrose-gewicht-bewegen/integratie/'
THEME = 'artrose-gewicht-bewegen.html'
TREATMENTS = ['knieartrose', 'bewegen-bij-artrose', 'obesitas-gewrichtsklachten', 'knieprothese-obesitas']
ARTICLES = ['8-vragen-obesitasmedicijnen-reuma-artrose', 'obesitasmedicatie-knieartrose-minder-pijn-minder-bewegen', 'knieprothese-bariatrische-chirurgie-obesitas-knieartrose', 'artrosezorg-transitie-patienten', 'artrosezorg-transitie-professionals', 'digitaal-zorgpad-artrose-obesitas', 'leonie-meihuizen-onderzoeker-transmuraal-tilburg-cohort', 'heracleum-hulpfonds-subsidie-transmuraal-tilburg-cohort', 'vaillant-fonds-digitaal-zorgpad', 'patientpanel-leefstijl-orthopedie', 'we-walk-ar-campusroute-tilburg']
PROJECTS = ['transmuraal-tilburg-cohort', 'leefstijlgerichte-kansen-orthopedie', 'we-walk', 'vrxoa-immersive-experiences-artrose']
EXISTING = ['index.html', 'behandelingen.html', 'artikelen.html', 'professionals.html', 'projecten.html', 'nieuwsbrief.html', 'over-mij.html', 'publicaties.html'] + [f'behandelingen/{x}.html' for x in TREATMENTS] + [f'artikelen/{x}.html' for x in ARTICLES] + [f'projecten/{x}.html' for x in PROJECTS]
ROUTES = {path: PREFIX + path for path in EXISTING + [THEME, 'meer-dan-je-bmi.html']}

def digest(data):
    return hashlib.sha256(data).hexdigest()

def home_block():
    return '''<!-- ARTROSE-THEMA:START --><section class="section theme-home" id="artrose-gewicht-bewegen" aria-labelledby="theme-home-title"><div class="theme-home-panel"><div><p class="section-kicker">Artrose en leefstijl</p><h2 id="theme-home-title">Artrose, gewicht<br>en bewegen</h2><p>Uitleg over artrose en obesitas, bewegen met gewrichtsklachten en de afweging rond een knieprothese. Hier vind je ook artikelen en mijn werk aan artrosezorg.</p><div class="theme-actions"><a class="button button-primary" href="/artrose-gewicht-bewegen.html">Bekijk het thema</a><a class="article-link" href="/artrose-gewicht-bewegen.html#nieuwsbrief">Ontvang nieuwe artikelen</a></div></div><div class="theme-home-aside"><p class="section-kicker">Interactieve uitleg</p><strong>Meer dan je BMI</strong><p>Bereken je BMI en ontdek wat het getal wel en niet vertelt over je gezondheid en gewrichten.</p><a class="article-link" href="/meer-dan-je-bmi.html">Bekijk de tool →</a></div></div></section><!-- ARTROSE-THEMA:END -->'''

def entry(path):
    professional = path == 'professionals.html' or path.startswith('projecten') or 'professionals' in path
    copy = 'Patiëntuitleg, artikelen en mijn werk aan onderzoek en regionale artrosezorg bij elkaar.' if professional else 'Uitleg over knieartrose en obesitas, Meer dan je BMI en artikelen over bewegen en behandeling.'
    audience = 'zorgprofessionals' if professional else 'patienten'
    return f'''<!-- ARTROSE-INGANG:START --><aside class="theme-entry" aria-label="Meer over artrose, gewicht en bewegen"><strong>Artrose, gewicht en bewegen</strong><p>{copy}</p><div class="theme-entry-links"><a class="article-link" href="/artrose-gewicht-bewegen.html{'#onderzoek' if professional else ''}">Bekijk het thema →</a><a class="article-link" href="/artrose-gewicht-bewegen.html?doelgroep={audience}#nieuwsbrief">Ontvang artikelen per e-mail →</a></div></aside><!-- ARTROSE-INGANG:END -->'''

def modify(path, source):
    if path == 'index.html':
        pattern = r'(<section class="section visitor-route-band".*?</section>)'
        source, n = re.subn(pattern, lambda m:m[0]+'\n'+home_block(), source, count=1, flags=re.S)
        assert n == 1, path
        # These stories remain on their full pages; avoid three competing home introductions.
        source, n = re.subn(r'<section class="section cohort-home".*?</section>', '', source, count=1, flags=re.S)
        assert n == 1, path
        source, n = re.subn(r'<!-- ARTROSE-STORY:START -->.*?<!-- ARTROSE-STORY:END -->', '', source, count=1, flags=re.S)
        assert n == 1, path
    elif path == 'over-mij.html':
        source=source.replace('<h2>Persoonlijk</h2>', '<aside class="theme-entry"><p>Mijn uitleg, hulpmiddelen en projecten rond <a href="/artrose-gewicht-bewegen.html">artrose, gewicht en bewegen</a> vind je bij elkaar op de themapagina.</p></aside><h2>Persoonlijk</h2>',1)
    elif path == 'publicaties.html':
        anchor='<a class="article-link" href="https://pubmed.ncbi.nlm.nih.gov/41810568/" rel="noopener">Bekijk op PubMed</a>'
        assert anchor in source
        source=source.replace(anchor,anchor+'<aside class="theme-entry"><p>Lees ook de uitleg, artikelen en projecten over <a href="/artrose-gewicht-bewegen.html#onderzoek">artrose, gewicht en bewegen</a>.</p></aside>',1)
    elif path == 'artikelen.html':
        source, n = re.subn(r'<section class="related-section articles-topic-entry".*?</section>', entry(path), source, count=1, flags=re.S)
        assert n == 1, path
    elif path in ['behandelingen.html','professionals.html','projecten.html','nieuwsbrief.html']:
        # After intro, before results or long professional story.
        source, n = re.subn(r'(<main\b[^>]*>.*?</section>)', lambda m:m[0]+'\n<section class="section">'+entry(path)+'</section>', source, count=1, flags=re.S)
        assert n == 1, path
    else:
        # One compact entrance beside related reading; preserve existing links and medical body.
        match = re.search(r'<section class="related-section', source)
        if match:
            source = source[:match.start()] + entry(path) + source[match.start():]
        else:
            source = source.replace('</main>', '<section class="section">'+entry(path)+'</section></main>', 1)
        if path == 'behandelingen/obesitas-gewrichtsklachten.html':
            source = source.replace('<h2 id="beginnen">', '<p class="article-newsletter-callout">Wat vertelt jouw BMI? <a href="/meer-dan-je-bmi.html">Bekijk Meer dan je BMI</a>.</p><h2 id="beginnen">', 1)
    # Existing topic-specific newsletter calls now use the scoped form; general nav remains.
    source = re.sub(r'(<(?:aside|div|p)\b[^>]*class="[^"]*article-newsletter-callout[^\"]*"[^>]*>)(.*?)(</(?:aside|div|p)>)', lambda m:m[1]+re.sub(r'href="(?:\.\./)?nieuwsbrief.html"','href="/artrose-gewicht-bewegen.html#nieuwsbrief"',m[2])+m[3],source,flags=re.S)
    source = source.replace('</head>', '<link rel="stylesheet" href="/assets/artrose-thema.css">\n</head>', 1)
    return source

def shell():
    template = (ROOT/'nieuwsbrief.html').read_text()
    header = re.search(r'<header\b.*?</header>', template, re.S)[0]
    header = header.replace(' aria-current="page"', '')
    footer = re.search(r'<footer\b.*?</footer>', template, re.S)[0]
    return '''<!doctype html><html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Artrose, gewicht en bewegen | Matthijs van Dam</title><meta name="description" content="Uitleg over knieartrose, obesitas en bewegen. Ontdek Meer dan je BMI, lees artikelen en volg het werk van Matthijs van Dam aan artrosezorg."><meta name="robots" content="noindex, nofollow"><link rel="canonical" href="https://www.matthijsvandam.nl/artrose-gewicht-bewegen.html"><meta property="og:type" content="website"><meta property="og:locale" content="nl_NL"><meta property="og:site_name" content="drs. Matthijs van Dam"><meta property="og:title" content="Artrose, gewicht en bewegen"><meta property="og:description" content="Uitleg, interactieve hulpmiddelen en achtergrond bij artrosezorg."><meta property="og:url" content="https://www.matthijsvandam.nl/artrose-gewicht-bewegen.html"><meta property="og:image" content="https://www.matthijsvandam.nl/assets/portrait-matthijs-van-dam.jpg"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="Artrose, gewicht en bewegen"><meta name="twitter:description" content="Uitleg, interactieve hulpmiddelen en achtergrond bij artrosezorg."><meta name="twitter:image" content="https://www.matthijsvandam.nl/assets/portrait-matthijs-van-dam.jpg"><link rel="icon" href="/assets/logo-mvd-mark-v2.svg"><link rel="stylesheet" href="/styles.css"><link rel="stylesheet" href="/assets/artrose-thema.css"></head><body><a class="skip-link" href="#main-content">Ga naar inhoud</a>'''+header+(HERE/'hub.html').read_text().replace('/concepten/meer-dan-je-bmi/index.html','/meer-dan-je-bmi.html')+footer+'<script src="/script.js"></script></body></html>'

def localize(source, path):
    # Resolve all relative attributes from their original source location, then route copies.
    def attr(match):
        key, quote, raw = match.groups()
        if raw.startswith('#'): return key+'='+quote+ROUTES[path]+raw+quote
        if raw.startswith(('data:','mailto:','tel:','http:','https:','//')): return match[0]
        parsed = urlsplit(raw)
        resolved = parsed.path.lstrip('/') if raw.startswith('/') else posixpath.normpath(posixpath.join(posixpath.dirname(path),parsed.path))
        destination = ROUTES.get(resolved, '/'+resolved)
        return key+'='+quote+destination+('?' + parsed.query if parsed.query else '')+('#'+parsed.fragment if parsed.fragment else '')+quote
    source = re.sub(r'\b(href|src|action)=(\"|\x27)(.*?)\2', attr, source)
    source = re.sub(r'(<meta\b[^>]*name="robots"[^>]*content=")[^"]*',r'\g<1>noindex, nofollow',source)
    source = re.sub(r'<script\b[^>]*src="(?:https?://|[^\"]*feedback.js)[^\"]*"[^>]*>\s*</script>','',source)
    source = re.sub(r'<link[^>]*href="[^\"]*feedback.css[^\"]*"[^>]*>','',source)
    source = source.replace('/assets/artrose-thema.css','/concepten/artrose-gewicht-bewegen/theme.css?v='+digest((HERE/'theme.css').read_bytes())[:12])
    source = re.sub(r'(/content.js)(\?[^\"]*)?', '/concepten/artrose-gewicht-bewegen/integratie/content.js', source)
    source = source.replace('</head>', '<base href="/">\n<meta http-equiv="Content-Security-Policy" content="form-action &#39;none&#39;; connect-src &#39;none&#39;">\n</head>')
    bar = '<div class="theme-preview-bar"><span>Lokaal concept · niet gepubliceerd</span><a href="'+PREFIX+THEME+'">Themapagina</a><a href="'+PREFIX+'index.html#artrose-gewicht-bewegen">Homepageblok</a><a href="/concepten/artrose-gewicht-bewegen/overzicht.html">Alle ingangen</a></div>'
    source = re.sub(r'(<body\b[^>]*>)',lambda m:m[0]+bar,source,count=1)
    setup = '<script type="application/json" id="theme-preview-routes">'+json.dumps(ROUTES)+'</script><script src="/concepten/artrose-gewicht-bewegen/preview.js?v='+digest((HERE/'preview.js').read_bytes())[:12]+'"></script>'
    source = source.replace('</head>',setup+'</head>') if '<form' not in source else source
    # Forms exist only after body has parsed; attach guard before normal scripts.
    if '<form' in source:
        index = source.find('<script',source.find('</main>'))
        source = source[:index]+setup+source[index:]
    return source

def build():
    before = {path:(ROOT/path).read_bytes() for path in EXISTING}
    staged = {path:modify(path,data.decode()) for path,data in before.items()}
    staged[THEME] = shell()
    bmi = (ROOT/'concepten/meer-dan-je-bmi/index.html').read_text()
    # Route BMI assets to the single existing source, no copied calculation logic.
    bmi = re.sub(r'\b(src|href)="([^\"]+)"', lambda m:m[0] if m[2].startswith(('#','http','/','data:')) else m[1]+'="'+posixpath.normpath('/concepten/meer-dan-je-bmi/'+m[2])+'"',bmi)
    bmi = bmi.replace('</head>','<link rel="stylesheet" href="/assets/artrose-thema.css"></head>')
    bmi = bmi.replace('</main>',entry('behandelingen/obesitas-gewrichtsklachten.html')+'</main>')
    staged['meer-dan-je-bmi.html'] = bmi
    out = HERE/'integratie'
    content_before=(ROOT/'content.js').read_text()
    content_after=content_before.replace('project.featured && project.id !== "transmuraal-tilburg-cohort"','project.featured')
    assert content_after != content_before
    out.mkdir(parents=True,exist_ok=True)
    (out/'content.js').write_text(content_after)
    patch = []
    patch.extend(difflib.unified_diff(content_before.splitlines(True),content_after.splitlines(True),fromfile='a/content.js',tofile='b/content.js'))
    for path,source in staged.items():
        target = out/path; target.parent.mkdir(parents=True,exist_ok=True)
        target.write_text(localize(source,path))
        patch.extend(difflib.unified_diff(before.get(path,b'').decode().splitlines(True),source.splitlines(True),fromfile='a/'+path,tofile='b/'+path))
    (HERE/'voorgestelde-wijzigingen.patch').write_text(''.join(patch))
    manifest = {'status':'local-concept-only','created':'2026-10-11','production_sources_unchanged':True,'routes':ROUTES,'baseline_sha256':{path:digest(data) for path,data in before.items()},'preview_sha256':{path:digest((out/path).read_bytes()) for path in staged},'shared_sources_sha256':{path:digest((ROOT/path).read_bytes()) for path in ['styles.css','script.js','content.js','concepten/meer-dan-je-bmi/index.html','concepten/meer-dan-je-bmi/logic.js','concepten/meer-dan-je-bmi/module.js']}}
    manifest['concept_sources_sha256']={name:digest((HERE/name).read_bytes()) for name in ['hub.html','theme.css','preview.js','build.py','newsletter-plan.json']}
    manifest['content_preview_sha256']=digest((out/'content.js').read_bytes())
    (HERE/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
    links = ''.join(f'<li><a href="{ROUTES[path]}">{path}</a></li>' for path in staged)
    (HERE/'overzicht.html').write_text('<!doctype html><html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex, nofollow"><title>Conceptoverzicht artrose</title><link rel="stylesheet" href="/styles.css"></head><body><main class="section"><h1>Artrose, gewicht en bewegen</h1><p>Lokaal voorstel: themapagina, homepage, ingangen en nieuwsbrief. Alle hieronder vermelde pagina’s zijn aangepaste kopieën.</p><p><a href="'+ROUTES[THEME]+'">Open de themapagina →</a></p><ul>'+links+'</ul></main></body></html>')
    assert all((ROOT/path).read_bytes()==data for path,data in before.items())
    print(f'{len(staged)} lokale pagina’s; publieke bronnen bytegelijk behouden.')

def check():
    manifest = json.loads((HERE/'manifest.json').read_text())
    for key in ['baseline_sha256','shared_sources_sha256']:
        for path,sha in manifest[key].items():
            assert digest((ROOT/path).read_bytes())==sha, f'Bron gewijzigd na preview: {path}; bewust opnieuw vergelijken.'
    for path,sha in manifest['preview_sha256'].items():
        assert digest((HERE/'integratie'/path).read_bytes())==sha, f'Preview handmatig gewijzigd: {path}'
    for path,sha in manifest.get('concept_sources_sha256',{}).items():
        assert digest((HERE/path).read_bytes())==sha, f'Conceptbron gewijzigd: {path}; bewust opnieuw bouwen.'
    assert digest((HERE/'integratie/content.js').read_bytes())==manifest['content_preview_sha256']
    print('Bronnen en previewversies komen overeen met manifest.')

if __name__ == '__main__':
    parser = argparse.ArgumentParser(); parser.add_argument('--check',action='store_true'); args=parser.parse_args()
    check() if args.check else build()
