# Cohort en compacte artikelblokken — lokale review

Gewijzigd: content.js, script.js, styles.css, artikelen.html,
projecten/transmuraal-tilburg-cohort.html, PUBLICATIE_REGISTER.json,
docs/site/PAGE_MODELS.md en bestaande nieuwsbrief-/Search Console-vervolgtaken.
Bestaande wijzigingen vooraf veiliggesteld in /private/tmp/mvd-cohort-before-20260912.

Drie kaarten, vijf titels en bij meer dan acht een gerichte vervolgroute.
Cohortselectie: expliciete projectkoppeling of artrose én leefstijl; dit omvat
bariatrische chirurgie. Volledig archief: drie kaarten, alle overige titels.
Het archief neemt ook artikelen met archive:false mee, zodat de vervolgroute
geen relevante stukken verliest. Homepage behoudt de eigen bestaande selectie.

Checks: sitekwaliteit, SEO-basis en pijnwijzer slagen; git diff --check schoon.
Browser: twintig pagina/breedte-combinaties (360, 390, 430, 1280), archief- en
professionalsfilters en grensgeval met tien artikelen slagen, geen JS-fouten.
Cohortsectie op mobiel en desktop visueel bekeken. Geen package.json/npm-checks.
Publicatiecheck meldt bewust negen review_nodig-pagina's en gewijzigde hashes
voor artikelen.html en de cohortpagina; eerdere goedkeuringen blijven historische evidence.
Geen nieuwe medische claims. Visuele eigenaarreview en publieke release open.

ADR-check: 0002, 0004, 0006 en 0008/0013; uitwerking van bestaande patronen,
geen nieuwe ADR nodig. Nieuwsbrief niet geactiveerd; onderwerpgerichte
inschrijving opgenomen in work-newsletter-release. Search Console-verslag apart
bijgewerkt na echte controle. Geen deployment uitgevoerd.

## Aanvulling: eigen homepageblok

Op vervolgopdracht van Matthijs krijgt het cohort een eigen sectie tussen
#behandelingen en #locaties. Korte tekst gebaseerd op de bestaande projectpagina,
bestaand projectbeeld en Lees meer over het cohort. Alleen de home-projects-selectie
sluit het cohort uit, vóór de grens van drie kaarten; de andere overzichten behouden het.
Gewijzigd: index.html, content.js, styles.css, PUBLICATIE_REGISTER.json en PAGE_MODELS.md.
Snapshot vóór deze aanvulling: /private/tmp/mvd-cohort-home-before-20260912.

Sitekwaliteit en SEO-basis slagen. Browsercontrole op 360/390/430/1280 px:
volgorde, geen dubbele projectkaart, drie resterende projectkaarten, geladen afbeelding,
werkende vervolglink, cohort in volledig projectoverzicht en geen JS-fouten bevestigd.
Mobiele en desktop-screenshots visueel beoordeeld; geen horizontale overloop.
Publicatiecheck blijft bewust open (9 review_nodig, nu 3 gewijzigde HTML-hashes).
Geen npm-checks beschikbaar. ADR 0001/0002/0004/0006: expliciet gevraagde projectuitlichting
binnen bestaande positionering; geen nieuwe ADR nodig. Geen nieuwe behandelclaims.
De Search Console-controle uit deze werksessie blijft de actuele uitgangsmeting;
geen URL-, sitemap- of canonicalwijziging, geen indexeringsaanvraag gedaan.
Eigenaarreview van tekst/weergave en publieke release blijven open; niet gedeployed.

## Eigenaarakkoord

Matthijs geeft na de lokale preview op 12 september 2026 expliciet akkoord:
“ja akkoord helemaal”. Inhoudelijke en visuele review van de beschreven wijzigingen
is daarmee afgerond. De negen betrokken registervermeldingen zijn geverifieerd;
eerdere reviewnotities blijven als geschiedenis behouden. Exacte lokale bestandsversies
staan met SHA-256 in cohort-owner-approval-2026-09-12.json.
Geen deployment of nieuwsbriefactivering uitgevoerd. De bestaande publicatiecheck
signaleert nog drie gewijzigde HTML-bestanden omdat die check git status gebruikt,
onafhankelijk van het vastgelegde eigenaarakkoord; geen nieuwe inhoudelijke blokkade.
