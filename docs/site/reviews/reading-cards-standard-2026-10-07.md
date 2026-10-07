# Verder lezen — sitestandaard, 7 oktober 2026

Matthijs heeft na beoordeling van de eerste live variant gevraagd deze de standaard voor de site te maken. Dit pakket past twintig extra thematische Verder lezen-blokken aan: zes aandoeningen-/behandelpagina’s en veertien artikelen. De bestaande live variant op Knieprothese bij obesitas blijft behouden.

## Scope

Gedeelde CSS en componentcatalogus; kleine bestaande beelden, volledige klikbare kaart, bronlabel waar aanwezig, titel en toelichting. Een neutraal SVG-documenticoon voor bestemmingen zonder passend bestaand beeld. Projectnieuws, artikeloverzichten, thematische hubingangen, nieuwsbriefbevestiging en bron-/publicatielijsten behouden hun bestaande component. Geen nieuwe links, metadata, routes, indexeerbaarheid of medische hoofdtekst. De losse linkblokken op Knieartrose, Bewegen bij artrose en Obesitas en gewrichtsklachten krijgen korte oriënterende toelichtingen.

## Controles

Alle twintig pagina’s gecontroleerd met Chromium op 360, 390, 430 en 1440 px, in licht en donker. Geen horizontale overflow; miniaturen laden; kaarten blijven binnen de viewport. Screenshots van elke pagina op mobiel en desktop opgeslagen onder /private/tmp/reading-standard-*.png; voorbeelden visueel beoordeeld. Alle oorspronkelijke linkbestemmingen en hun volgorde, title en H1 programmatisch vergeleken met HEAD en behouden. Sitekwaliteit, SEO-basis, designsysteem en behandelpagina-kwaliteit slagen in de geïsoleerde pakketcontrole. Er is geen package.json, dus geen npm-checks.

## Governance

ADR-0004/0005/0006; bestaande vormvariant, geen nieuwe ADR nodig. Concepten behouden noindex en deploymentuitsluiting. Matthijs heeft de bredere uitrol op 7 oktober 2026 gereviewd en expliciet vrijgegeven voor publicatie. Bestaand inhoudelijk akkoord wordt niet uitgebreid naar nieuwe medische claims. De publicatiechecker signaleert gewijzigde publieke pagina’s zolang dit pakket niet is vastgelegd/vrijgegeven; dit is de bestaande publicatiepoort. Search Console is niet opnieuw nodig: geen wijzigingen aan bestemmingen, sitemap, canonical, robots of navigatieroutes. Ander lopend werk blijft buiten dit pakket.

## Pagina’s

- behandelingen/bewegen-bij-artrose.html
- behandelingen/enkelartrodese.html
- behandelingen/enkelartrose.html
- behandelingen/enkelprothese.html
- behandelingen/knieartrose.html
- behandelingen/obesitas-gewrichtsklachten.html
- artikelen/8-vragen-obesitasmedicijnen-reuma-artrose.html
- artikelen/aaos-richtlijn-enkelartrose.html
- artikelen/artrosezorg-transitie-patienten.html
- artikelen/artrosezorg-transitie-professionals.html
- artikelen/digitaal-zorgpad-artrose-obesitas.html
- artikelen/knieprothese-bariatrische-chirurgie-obesitas-knieartrose.html
- artikelen/kraakbeenletsel-enkel-consensus-diagnostiek.html
- artikelen/kuitspier-en-voetpijn.html
- artikelen/leonie-meihuizen-onderzoeker-transmuraal-tilburg-cohort.html
- artikelen/na-verzwikte-enkel-instabiel-blijven.html
- artikelen/obesitasmedicatie-knieartrose-minder-pijn-minder-bewegen.html
- artikelen/patient-specifieke-instrumentatie-voet-enkel-professionals.html
- artikelen/probleemgeorienteerd-denken-orthopedie-boekbijdrage.html
- artikelen/revisie-artrodese-niet-vastgegroeid-patienten.html
