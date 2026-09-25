"""Promote the owner-approved local story into the existing public overview pages.
Run after build_integration.py; unrelated page content and metadata are preserved.
"""
from pathlib import Path
import re, hashlib, shutil
ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'concepten/artrosezorg-in-transitie-visueel'
PREVIEW=SOURCE/'integratie'
OUT=ROOT/'assets/artrose-story'
OUT.mkdir(exist_ok=True)
def digest(s): return hashlib.sha256(s.encode()).hexdigest()[:12]
def public(s):
    return s.replace('/concepten/artrosezorg-in-transitie-visueel/integratie/artikelen.html','/artikelen.html').replace('/concepten/artrosezorg-in-transitie-visueel/assets/','/assets/artrose-story/').replace('Deze visuele uitwerking is met hulp van AI voorbereid en blijft een lokaal concept voor inhoudelijke beoordeling.','Deze visuele uitwerking is met hulp van AI voorbereid en door mij inhoudelijk beoordeeld.')
css= (PREVIEW/'story-scoped.css').read_text()+'\n'+re.sub(r'@import[^;]+;','',(PREVIEW/'integration.css').read_text())
css=css.replace('--preview-header-height','--story-header-height')
cssname=f'story-{digest(css)}.css';(OUT/cssname).write_text(css)
js=(PREVIEW/'story.js').read_text()
js+='''\n(() => {
 const header=document.querySelector('[data-header]');
 if(!header) return;
 const measure=()=>document.documentElement.style.setProperty('--story-header-height', `${header.getBoundingClientRect().height}px`);
 new ResizeObserver(measure).observe(header); measure();
})();\n'''
jsname=f'story-{digest(js)}.js';(OUT/jsname).write_text(js)
for p in (SOURCE/'assets').glob('journey-*.svg'): shutil.copy2(p,OUT/p.name)
start='<!-- ARTROSE-STORY:START -->';end='<!-- ARTROSE-STORY:END -->'
for name in ['index.html','artikelen.html']:
    p=ROOT/name;s=p.read_text()
    s=re.sub(r'<!-- ARTROSE-STORY:START -->.*?<!-- ARTROSE-STORY:END -->','',s,flags=re.S)
    s=re.sub(r'\s*<(?:link|script)[^>]*(?:href|src)="/assets/artrose-story/[^>]+>(?:</script>)?','',s)
    preview=(PREVIEW/name).read_text()
    if name=='index.html':
        feature=preview[preview.index('<section class="artrose-story home-story"'):preview.index('      <section class="section location-band"')].strip()
        s=s.replace('      <section class="section location-band"',start+public(feature)+end+'\n      <section class="section location-band"',1)
    else:
        feature=preview[preview.index('<section class="artrose-story" data-story-root'):preview.index('</main>',preview.index('<section class="artrose-story" data-story-root'))]
        s=s.replace('<p class="section-kicker">Artikelen en updates</p>','')
        s=s.replace('<body>','<body class="placement-articles">')
        s=s.replace('<main class="listing-page articles-browser" id="articles-content">','<main><div class="listing-page articles-browser" id="articles-content">')
        # The closing div stays outside the replaceable story block.
        if start not in p.read_text(): s=s.replace('</main>','</div></main>',1)
        s=s.replace('</main>',start+public(feature)+end+'</main>',1)
        s=s.replace('window.siteContent.renderArticlesOverview(matches);','window.siteContent.renderArticlesOverview(matches, Boolean(state.audience || state.topic || project));')
    s=s.replace('</head>',f'<link rel="stylesheet" href="/assets/artrose-story/{cssname}">\n</head>')
    s=s.replace('</body>',f'<script src="/assets/artrose-story/{jsname}"></script>\n</body>')
    s=re.sub(r'((?:href|src)=")/(?!/)',r'\1',s)
    s='\n'.join(line.rstrip() for line in s.split('\n'))
    assert '/concepten/' not in s
    p.write_text(s)
p=ROOT/'content.js';s=p.read_text().replace('const renderArticlesOverview = (items) => {','const renderArticlesOverview = (items, filtered = false) => {').replace('const compactArticles = items.slice(cardLimit);','const compactArticles = items.slice(cardLimit, filtered ? undefined : cardLimit + 5);');p.write_text(s)
for name in ['index.html','artikelen.html']:
    p=ROOT/name;s=p.read_text();s=re.sub(r'src="content.js[^\"]*"',f'src="content.js?v={digest((ROOT/"content.js").read_text())}"',s);p.write_text(s)
print('Published source generated: homepage + articles; static assets:',cssname,jsname)
