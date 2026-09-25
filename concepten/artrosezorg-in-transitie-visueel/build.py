"""Build the local NTvG visual story and its complete static reading alternative."""
import json
import hashlib
from html import escape
from pathlib import Path
from journey_art import make_world, protagonist, definitions, person_static, protagonist_still, G, map_art
ROOT=Path(__file__).resolve().parent
ASSETS=ROOT/'assets'
data=json.loads((ROOT/'verhaal.json').read_text())
world,route=make_world(data)
static_world=world.replace('<g class="country-map" transform="translate(0 -120)">','<g class="country-map" transform="translate(-100 -145) scale(.78)">').replace('<g class="region-network">','<g class="region-network" transform="translate(190 -60) scale(.48)">')
config={'route':route,'scenes':[{k:c[k] for k in ('id','station','camera_scale','pose','text_side','focus_x','actor_station')} for c in data['chapters']]}
chapters=''
for i,c in enumerate(data['chapters']):
    x,y=c['station']
    # The fallback uses the same world, cropped around each meaningful station.
    seated=c["pose"]=="seated"
    ax,ay=c["actor_station"]
    if i==7: ax,ay=route[-1]
    static_actor=protagonist_still(ax,ay,.85,seated=seated)
    still=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x-345} {y-435} 690 565" aria-hidden="true">{definitions()}<style>.growth-trend{{display:none}}.world-station:not(.station-{i}){{display:none}}</style>{static_world}{static_actor}</svg>'
    (ASSETS/f'journey-{i+1}.svg').write_text(still)
    paragraphs=''.join(f'<p data-beat="{j}">{escape(p)}</p>' for j,p in enumerate(c['paragraphs']))
    chapters+=f'''<section class="journey-moment" id="{c['id']}" aria-labelledby="heading-{i}" data-scene="{i}" data-text-side="{c['text_side']}">
    <figure class="journey-still"><img src="assets/journey-{i+1}.svg" alt="" width="690" height="565" loading="lazy"><figcaption>{c['caption']}</figcaption></figure>
    <div class="journey-copy"><p class="eyebrow">{c['label']}</p><h2 id="heading-{i}">{c['title']}</h2>{paragraphs}</div></section>'''
nav=''.join(f'<a href="#{c["id"]}">{c["label"]}</a>' for c in data['chapters'])
journey_stage=f'''<div class="journey-stage" aria-hidden="true"><div class="journey-canvas"><svg id="journey-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 900">{definitions()}<g id="world-camera"><g id="world-landscape">{world}</g>{protagonist()}</g></svg><p class="stage-label">Een leesroute door het artikel</p></div></div>'''
hero=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="320 -130 690 565" aria-hidden="true">{definitions()}{world}{protagonist_still(660,300,.85)}</svg>'
hero=hero.replace('id="','id="hero-').replace('url(#','url(#hero-')
asset_version=hashlib.sha256((ROOT/'story.css').read_bytes()+(ROOT/'story.js').read_bytes()).hexdigest()[:10]
intro_html=escape(data['intro'])
for link in data.get('intro_links',[]):
    intro_html=intro_html.replace(escape(link['text']),f'<a href="{escape(link["href"],quote=True)}">{escape(link["text"])}</a>')
closing_html=''
for i,card in enumerate(data['closing']):
    card_id=f' id="{card["id"]}"' if card.get('id') else ''
    citation=f'<p class="closing-citation">{escape(card["citation"])}</p>' if card.get('citation') else ''
    links=''.join(f'<li><a href="{escape(link["href"],quote=True)}">{escape(link["text"])} <span aria-hidden="true">↗</span></a></li>' for link in card['links'])
    newsletter=''
    if card.get('newsletter'):
        n=card['newsletter']
        newsletter_text=f'<p>{escape(n["text"])}</p>' if n.get('text') else ''
        newsletter=f'<aside class="closing-newsletter" aria-label="Nieuwsbrief"><strong>{escape(n["title"])}</strong>{newsletter_text}<a href="{escape(n["href"],quote=True)}">{escape(n["link_text"])} <span aria-hidden="true">→</span></a></aside>'
    closing_html+=f'<article class="closing-card"{card_id} aria-labelledby="closing-title-{i}"><p class="eyebrow">{escape(card["label"])}</p><h3 id="closing-title-{i}">{escape(card["title"])}</h3><p>{escape(card["text"])}</p>{citation}{newsletter}<ul class="closing-links">{links}</ul></article>'
html=f'''<!doctype html>
<html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow"><title>Artrosezorg in transitie — een visueel verhaal | Matthijs van Dam</title>
<meta name="description" content="Visuele uitleg van de NTvG-beschouwing Artrosezorg in transitie, over een nationaal beweeg- en educatieprogramma. Lokaal concept.">
<meta name="color-scheme" content="light dark"><link rel="stylesheet" href="../../styles.css"><link rel="stylesheet" href="story.css?v={asset_version}">
<script src="story.js?v={asset_version}" defer></script></head><body class="artrose-story">
<a class="skip-link" href="#verhaal">Ga naar het verhaal</a>
<header class="story-header" data-header><a href="../../index.html" class="wordmark">Matthijs <span>van Dam</span><small>Orthopedie · onderzoek · zorgontwikkeling</small></a><span class="concept-badge">Lokaal concept</span><button class="story-menu-toggle" type="button" data-nav-toggle aria-controls="story-site-nav" aria-expanded="false" hidden>Menu</button><nav class="story-site-nav" id="story-site-nav" data-nav aria-label="Hoofdnavigatie"><a href="../../artikelen.html">Artikelen</a><a href="../../over-mij.html">Over</a></nav></header>
<main>
<div class="story-intro"><p class="eyebrow">Een NTvG-artikel in beeld <span>—</span> 5 minuten</p><h1>Artrosezorg <em>in transitie.</em></h1><p class="subtitle">{data['subtitle']}</p><p class="intro-copy">{intro_html}</p><a class="start-link" href="#dagelijks-leven">Ontdek het verhaal <span aria-hidden="true">↓</span></a></div>
<div class="reading-tools"><button id="motion-toggle" type="button" hidden aria-pressed="false">Lees zonder animatie</button><label>Kleur <select id="color-mode"><option value="auto">Automatisch</option><option value="light">Licht</option><option value="dark">Donker</option></select></label><a class="source-shortcut" href="#bronnen">Het NTvG-artikel ↗</a><details class="chapter-menu"><summary>Plekken in het verhaal</summary><nav aria-label="Hoofdstukken">{nav}</nav></details></div>
<div class="scroll-story" id="verhaal">{journey_stage}<div class="journey-text">{chapters}</div></div><script type="application/json" id="journey-data">{json.dumps(config,ensure_ascii=False)}</script>
<section class="story-after" id="verder" aria-labelledby="sources-title"><p class="eyebrow">Van inzicht naar praktijk</p><h2 id="sources-title">Verder met artrosezorg.</h2>
<div class="closing-grid">{closing_html}</div>
<details><summary>Over deze visuele samenvatting</summary><p>De tekst volgt de redenering van de beschouwing: de gevolgen van artrose, de rol van begeleiding en welzijn, en het voorstel voor een landelijk programma in regionale netwerken. Het Beweeghuis wordt genoemd als het praktijkvoorbeeld uit het artikel. De volledige onderbouwing en literatuurverwijzingen staan in de oorspronkelijke publicatie.</p><p>De tekeningen zijn speciaal voor deze uitleg gemaakt. Ze tonen fictieve personen en schematische situaties, geen meetgegevens of voorspellingen van herstel. Het landelijke programma wordt weergegeven als ons voorstel.</p><p>Ik ben mede-auteur van de beschouwing. Deze visuele uitwerking is met hulp van AI voorbereid en blijft een lokaal concept voor inhoudelijke beoordeling.</p><p>Kaartcontour: <a href="https://www.naturalearthdata.com/about/terms-of-use/">Natural Earth, publiek domein</a>. De kaart licht het landelijke voorstel toe. Tilburg en het Orthopedisch Centrum ETZ zijn toegevoegd als lokaal visueel aanknopingspunt; het Beweeghuis in Maastricht-Heuvelland blijft het praktijkvoorbeeld uit het artikel. Stippen en verbindingen zijn schematisch.</p><a href="https://pubmed.ncbi.nlm.nih.gov/41810568/">Publicatiegegevens bij PubMed ↗</a></details>
<p class="medical-note">Dit is algemene informatie, geen persoonlijk behandeladvies. Bespreek vragen over uw eigen klachten met uw huisarts of behandelaar. <a href="../../disclaimer.html">Lees de disclaimer.</a></p><a class="back-top" href="#">Terug naar het begin ↑</a></section>
</main><footer class="story-footer">Matthijs van Dam <span>Een NTvG-artikel in beeld.</span></footer></body></html>'''
(ROOT/'index.html').write_text(html)
draft='# '+data['title']+'\n\n'+data['subtitle']+'\n\n'+data['intro']+'\n\n'
for c in data['chapters']:draft+='## '+c['title']+'\n\n'+'\n\n'.join(c['paragraphs'])+'\n\n'
for card in data['closing']:
    draft+='## '+card['title']+'\n\n'+card['text']+'\n\n'
    if card.get('citation'):draft+=card['citation']+'\n\n'
    for link in card['links']:draft+='- ['+link['text']+']('+link['href']+')\n'
    draft+='\n'
draft+='\nBron en verantwoording: zie index.html en bronverantwoording.md in het bijbehorende conceptpakket.\n\nStatus: definitieve concepttekst; medische eigenaarreview en publicatiebesluit open.\n'
(ROOT.parent/'artikelen'/'2026-09-24-artrosezorg-in-transitie-visueel.md').write_text(draft)
share=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#f7f4ed"/>{definitions()}<text x="70" y="95" fill="#244c3d" font-family="sans-serif" font-size="19" letter-spacing="3">EEN NTVG-ARTIKEL IN BEELD</text><text x="68" y="230" fill="#17201c" font-family="Georgia,serif" font-size="70">Artrosezorg</text><text x="68" y="314" fill="#244c3d" font-family="Georgia,serif" font-size="70" font-style="italic">in transitie.</text><text x="72" y="402" fill="#17201c" font-family="sans-serif" font-size="22">Een reis door de zorg rondom de persoon.</text><text x="72" y="555" fill="#244c3d" font-family="sans-serif" font-size="22">Matthijs van Dam</text><svg x="650" y="110" width="530" height="430" viewBox="320 -130 690 565">{world}{protagonist_still(660,300,.85)}</svg></svg>'
(ASSETS/'deelafbeelding.svg').write_text(share)
print('Concept gebouwd:', ROOT/'index.html')
