"""Local-only placement previews generated from the current site and story sources."""
import re
import hashlib
from pathlib import Path
from urllib.parse import urljoin
import build as story

ROOT=Path(__file__).resolve().parent
SITE=ROOT.parent.parent
OUT=ROOT/'integratie'
OUT.mkdir(exist_ok=True)
URL='/concepten/artrosezorg-in-transitie-visueel/'
PREVIEW=URL+'integratie/'

def rebase(html, origin):
    def attr(m):
        name,url=m.groups()
        if url.startswith(('http:', 'https:', 'mailto:', 'tel:', 'data:', '#')): return m.group(0)
        return f'{name}="{urljoin(origin,url)}"'
    return re.sub(r'(href|src|action)="([^"]+)"',attr,html)

def page(name):
    base=(SITE/name).read_text()
    if '<!-- ARTROSE-STORY:START -->' in base:
        base=re.sub(r'<!-- ARTROSE-STORY:START -->.*?<!-- ARTROSE-STORY:END -->','',base,flags=re.S)
        base=re.sub(r'<(?:link|script)[^>]*(?:href|src)="/?assets/artrose-story/[^>]+>(?:</script>)?','',base)
        if name=='artikelen.html':
            base=base.replace('<main><div class="listing-page articles-browser" id="articles-content">','<main class="listing-page articles-browser" id="articles-content">').replace('</div></main>','</main>')
    html=rebase(base,'/')
    html=html.replace('content="index, follow"','content="noindex, nofollow"')
    html=re.sub(r'<script type="application/ld\+json">.*?</script>','',html,flags=re.S)
    html=re.sub(r'<link rel="canonical"[^>]*>','',html)
    html=re.sub(r'(<title>)(.*?)(</title>)',r'\1Lokale plaatsingspreview — \2\3',html)
    html=html.replace('href="/artikelen.html','href="'+PREVIEW+'artikelen.html').replace('href="/index.html','href="'+PREVIEW+'index.html')
    html=re.sub(r'src="/content.js[^\"]*"','src="'+PREVIEW+'content.js"',html)
    html=re.sub(r'src="/script.js[^\"]*"','src="'+PREVIEW+'site-script.js"',html)
    css_version=hashlib.sha256((OUT/'integration.css').read_bytes()).hexdigest()[:12]
    html=html.replace('</head>',f'<link rel="stylesheet" href="{PREVIEW}integration.css?v={css_version}"></head>')
    html=html.replace('<body>','<body><div class="placement-notice">Lokale plaatsingspreview · nog niet gepubliceerd</div>')
    return html

# Keep the public renderer unchanged; this generated preview adds the scoped limit.
content=(SITE/'content.js').read_text()
content=content.replace('return `${prefixForCurrentPage()}${url}`;', 'return `/${url}`;')
content=content.replace('const renderArticlesOverview = (items) => {','const renderArticlesOverview = (items, filtered = false) => {')
content=content.replace('const compactArticles = items.slice(cardLimit);','const compactArticles = items.slice(cardLimit, filtered ? undefined : cardLimit + 5);')
(OUT/'content.js').write_text(content)
# The site script adds treatment-card images after HTML rebasing. Resolve those
# against the site root as well, rather than the nested preview directory.
site_script=(SITE/'script.js').read_text()
image_assignment='image.src = expertiseImageFor(card, label, title);'
assert site_script.count(image_assignment)==2
site_script=site_script.replace(image_assignment, 'image.src = new URL(expertiseImageFor(card, label, title), location.origin + "/").href;')
site_script += """
// Local placement previews share the measured header inset with the scroll stage.
if (header) {
  const syncPreviewHeader = () => {
    document.documentElement.style.setProperty('--preview-header-height', `${header.getBoundingClientRect().height}px`);
  };
  new ResizeObserver(syncPreviewHeader).observe(header);
  syncPreviewHeader();
}
"""
(OUT/'site-script.js').write_text(site_script)

article=page('artikelen.html')
article=article.replace('<p class="section-kicker">Artikelen en updates</p>', '')
article=article.replace('window.siteContent.renderArticlesOverview(matches);','window.siteContent.renderArticlesOverview(matches, Boolean(state.audience || state.topic || project));')
article=article.replace("reset.href = 'artikelen.html';",f"reset.href = '{PREVIEW}artikelen.html';")
main=re.search(r'<main>(.*?)</main>',story.html,re.S).group(1)
main=rebase(main,URL)
main=main.replace('<h1>','<h2 class="feature-title">').replace('</h1>','</h2>')
feature='<section class="artrose-story" data-story-root id="artrose-in-beeld" aria-label="Artrosezorg in transitie: visueel verhaal">'+main+'</section>'
article=article.replace('<main class="listing-page articles-browser" id="articles-content">', '<main><div class="listing-page articles-browser" id="articles-content">')
article=article.replace('</main>', '</div>'+feature+'</main>')
article=article.replace('<body>', '<body class="placement-articles">')
article=article.replace('</body>',f'<script src="{PREVIEW}story.js"></script></body>')
(OUT/'artikelen.html').write_text('\n'.join(line.rstrip() for line in article.split('\n')))

# Scope the existing art direction to the feature, keeping site navigation intact.
scoped=(ROOT/'story.css').read_text().replace('.artrose-story', ':scope').replace('.has-motion', ':scope.has-motion').replace('.has-js', ':scope.has-js')
css='@scope (.artrose-story) {\n'+scoped+'\n}\n'
(OUT/'story-scoped.css').write_text(css)
js=(ROOT/'story.js').read_text().replace('const body = document.body;',"const body = document.querySelector('[data-story-root]') || document.body;")
start=js.index('  const menuToggle =')
end=js.index('  let readingMode',start)
js=js[:start]+js[end:]
js=js.replace('    const mapBeat=current===6?beat:current>6?1:0;', '')
map_start=js.index('    const mapStation=stations[6];')
map_end=js.index('    const cx=',map_start)
js=js[:map_start]+'    const mapBeat=current===6?beat:current>6?1:0;\n    if(stations[6]) {\n'+js[map_start:map_end]+'    }\n'+js[map_end:]
# Home omits optional controls; retain automatic accessibility fallbacks.
js=js.replace("    toggle.setAttribute('aria-pressed',String(readingMode||staticRequired));", "    if(toggle) {\n    toggle.setAttribute('aria-pressed',String(readingMode||staticRequired));")
js=js.replace("    const isMotion=body.classList.contains('has-motion');", "    }\n    const isMotion=body.classList.contains('has-motion');")
js=js.replace('  toggle.hidden=false;', '  if(toggle) toggle.hidden=false;')
js=js.replace("  toggle.addEventListener('click',", "  toggle?.addEventListener('click',")
js=js.replace("document.querySelector('#color-mode').addEventListener", "document.querySelector('#color-mode')?.addEventListener")
# One renderer controls both the existing actor and the sign in its world.
js=js.replace("    body.dataset.journeyPhase=beat.toFixed(3);", """
    const sign=document.querySelector('#journey-sign');
    if(sign){
      // Pull a folded board from the trouser pocket, unfold below the chest,
      // then lower it. All phases reverse with scroll and start at zero size.
      const progress=current===1?local:0;
      const pull=ease((progress-.12)/.18);
      const unfold=ease((progress-.27)/.22);
      const lower=ease((progress-.46)/.22);
      const size=.16*pull+.84*unfold;
      const sx=18+27*pull+55*unfold;
      const sy=-49+18*pull+23*unfold+28*lower;
      sign.setAttribute('visibility',size>0?'visible':'hidden');
      sign.setAttribute('transform',`translate(${pos[0]+sx} ${pos[1]+sy}) rotate(${-8*pull*(1-unfold)}) scale(${size})`);
      sign.querySelector('a').style.pointerEvents=lower>.9?'all':'none';
      sign.querySelector('a').setAttribute('tabindex',lower>.9?'0':'-1');
      if(current===1){
        const bend=Math.sin(lower*Math.PI);
        upper.setAttribute('transform',`translate(0 -15) rotate(${bend*14} 0 -37)`);
        arm.removeAttribute('transform');
        const reach=Math.sin(Math.PI*Math.min(1,(progress-.10)/.62));
        const handX=18+Math.max(0,reach)*37;
        const handY=-34+Math.max(0,reach)*16;
        arm.querySelector('path').setAttribute('d',`M16 -73 L${21+Math.max(0,reach)*12} -49 L${handX} ${handY}`);
        arm.querySelector('path:last-child').setAttribute('d',`M${handX} ${handY} l4 -3`);
      }else{
        arm.querySelector('path').setAttribute('d','M16 -73 L24 -54 L37 -59');
        arm.querySelector('path:last-child').setAttribute('d','M36 -59 l4 -3');
      }
    }
    body.dataset.journeyPhase=beat.toFixed(3);""")
(OUT/'story.js').write_text(js)

# First station and the same articulated protagonist; no heavy national map on home.
from journey_art import definitions, protagonist
# Crop the landscape using the source world, but omit all stations after the first.
world=story.world
# SVG nesting is handled by XML rather than string-cutting closing tags.
import xml.etree.ElementTree as ET
ET.register_namespace('', 'http://www.w3.org/2000/svg')
svg=ET.fromstring('<svg xmlns="http://www.w3.org/2000/svg">'+definitions()+world+'</svg>')
station=next(el for el in svg.iter() if el.get('class')=='world-station station-0')
landscape=ET.tostring(station,encoding='unicode')
art=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="300 -80 710 550" aria-hidden="true">{definitions()}{landscape}<g transform="translate(610 300)">{protagonist()}</g></svg>'
home=page('index.html')
teaser=f'''<section class="section artrose-teaser" id="artrose-voorproef" aria-labelledby="teaser-title">
<div class="teaser-copy"><p class="teaser-eyebrow">Wetenschap in beeld · 5 minuten</p><h2 id="teaser-title">Artrosezorg<br><em>in transitie.</em></h2><p>Het begint bij gewone dingen. Opstaan uit een stoel. Een trap nemen. Naar buiten gaan.</p><p>Samen met Taco Gosens en collega’s schreef ik in het NTvG over artrosezorg. In dit visuele verhaal zie je hoe uitleg, bewegen en samenwerking een stevigere plaats kunnen krijgen.</p><a class="article-link" href="{PREVIEW}artikelen.html#artrose-in-beeld">Volg het visuele verhaal <span aria-hidden="true">→</span></a></div><div class="teaser-art">{art}</div></section>'''
# Begin the actual story on home, ending after its second moment.
import json
opening_chapters=''.join(re.findall(r'<section class="journey-moment".*?</section>', story.chapters, re.S)[:2])
opening_chapters=rebase(opening_chapters,URL)
opening_config=dict(story.config,scenes=story.config['scenes'][:2])
# Keep the first two places and connecting path; omit later stations and map assets.
stage=ET.fromstring(re.search(r'<svg.*?</svg>',story.journey_stage,re.S).group(0))
for parent in stage.iter():
    for child in list(parent):
        match=re.search(r'world-station station-(\d+)',child.get('class',''))
        if match and int(match.group(1))>1:parent.remove(child)
sign=f'''<g xmlns="http://www.w3.org/2000/svg" id="journey-sign" transform="translate(245 810)" visibility="hidden"><path d="M-50 0 L-65 39 M60 0 L76 39" stroke="#7b6350" stroke-width="7" stroke-linecap="round"/><a href="{PREVIEW}artikelen.html#artrose-in-beeld" aria-label="Lees het hele verhaal over artrosezorg"><rect class="farewell-board" x="-80" y="-70" width="252" height="76" rx="8" fill="#244c3d" stroke="#8da992" stroke-width="2"/><text x="46" y="-25" text-anchor="middle" fill="#fffdf8" font-family="Inter,system-ui,sans-serif" font-size="21" font-weight="600">Lees het hele verhaal →</text></a></g>'''
next(el for el in stage.iter() if el.get('id')=='world-camera').append(ET.fromstring(sign))
next(el for el in stage.iter() if el.get('id')=='world-landscape').set('aria-hidden','true')
opening_stage='<div class="journey-stage"><div class="journey-canvas">'+ET.tostring(stage,encoding='unicode')+'<p class="stage-label">Dagelijkse activiteiten als vertrekpunt</p></div></div>'
teaser=teaser.replace('id="artrose-voorproef"','id="home-story-intro"')
teaser=re.sub(r'<a class="article-link".*?</a>', '',teaser)
# The intro is a still; the articulated actor appears in the continuous scene below.
teaser=teaser.replace('<div class="teaser-art">'+art+'</div>', '')
teaser=teaser.replace('Artrosezorg<br><em>', 'Artrosezorg <em>')
# Static reading mode uses a plain board link beside the existing illustration.
farewell=f'<p class="home-static-continue"><a href="{PREVIEW}artikelen.html#artrose-in-beeld">Lees het hele verhaal →</a></p>'
opening=f'<section class="artrose-story home-story" data-story-root id="artrose-voorproef" aria-labelledby="teaser-title">{teaser}<div class="scroll-story" id="verhaal">{opening_stage}<div class="journey-text">{opening_chapters}</div></div><script type="application/json" id="journey-data">{json.dumps(opening_config,ensure_ascii=False)}</script>{farewell}</section>'
anchor='      <section class="section location-band"'
assert home.count(anchor)==1
home=home.replace(anchor,opening+'\n'+anchor)
home=home.replace('</body>',f'<script src="{PREVIEW}story.js"></script></body>')
(OUT/'index.html').write_text('\n'.join(line.rstrip() for line in home.split('\n')))
print('Plaatsingspreviews:', OUT)
