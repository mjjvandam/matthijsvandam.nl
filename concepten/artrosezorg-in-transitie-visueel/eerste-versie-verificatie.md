> Historisch document van de eerste versie; vervangen na opdracht van Matthijs om de NTvG-beschouwing zelf te verbeelden.

# Verificatie — lokaal artrose-scrollverhaal

24 september 2026. Alleen lokaal gebouwd en getest; niet gecommit, gepusht of gepubliceerd. Medische eigenaarreview open. Hoofdtekst: **713 woorden**, exclusief koppen, bijschriften en bronnen.

## Blocking issues

- Geen gevonden die de oplevering als **lokaal concept** blokkeren.
- Publieke vrijgave is niet verleend. De bronverschillen met de NTvG-beschouwing en de volledige medische tekst/beeldbetekenis vragen beoordeling door Matthijs; zie `bronverantwoording.md`.

## Non-blocking issues

- De bestaande sitebrede kwaliteitscheck blijft rood met **32 reeds bestaande meldingen**: 30 publieke links naar concepten en twee homepage-kaartmeldingen rond chronische enkelinstabiliteit. Vóór deze opdracht waren er 34 meldingen: dezelfde 32 plus twee verouderde designsysteembestanden. Geen nieuwe melding blijft over.
- Geen volledige VoiceOver-gebruikerssessie of fysieke iPhone/Android-test uitgevoerd. Wel semantiek, toegankelijkheidsboom, toetsenbord, zichtbare focus, alle figuurbijschriften en brongegevens gecontroleerd.

## Drift-risico's

- `verhaal.json` en de vectorcomposities in `build.py` zijn de herbouwbare bronnen. Rechtstreeks gewijzigde gegenereerde HTML/SVG/Markdown kan bij herbouw overschreven worden. Documenteer ontwerpwijzigingen daar, en render de deelafbeelding opnieuw als die verandert.
- De bijgewerkte stijlgids bevat ook eerder achtergelopen fingerprints en bestaande registerclassificaties. Dat registreert de huidige lokale bronnen, zonder review of publicatie te verlenen. De onderliggende bestaande pagina’s zijn niet aangepast.
- De toekomstige URL en inkomende links staan uitsluitend in `publicatievoorstel.json`. Bij verplaatsing moeten relatieve links, metadata en assets opnieuw worden gecontroleerd.

## Concrete herstelacties

- Eigen gevonden problemen hersteld: SVG-raamgeometrie en stoelpositie, niet-werkende kleurbediening zonder JS verborgen, legenda en koppen bij 200% tekstvergroting passend gemaakt, sticky beeld uitgeschakeld bij vergrote tekst, gewone hoofdstuksprongen zonder globale smooth-scroll, toetsenbordmenu met Escape en focusterugkeer.
- Navigatiecontract behouden met compacte artikelhoofdnavigatie. Geen uitzondering aan de navigatiechecker toegevoegd.
- Designsysteemgenerator uitgebreid met alleen expliciet gecatalogiseerde lokale bronpagina’s, zodat een voorbeeld onder `concepten/` dezelfde controle krijgt. Geen brede import van oude previews.
- Bestaande 32 siteproblemen buiten deze opdracht gelaten. Bronverschillen apart vastgelegd; bestaande publieke artroseartikelen niet stilzwijgend herschreven.

## Checks uitgevoerd

| Controle | Resultaat |
|---|---|
| Desktop 1280 × 800, licht en donker | Alle zes beeldcomposities bekeken; tekst/beeld passen, geen horizontale overloop |
| 360 × 800, 390 × 844, 430 × 844 | Licht en donker visueel bekeken, koppen en labels passend; geen horizontale overloop |
| Rotatie naar 844 × 390 | Via viewportemulatie: sticky beeld verborgen, zes gewone figuren beschikbaar; geen overloop |
| Langzaam scrollen begeleiding | Scène 3 achtereenvolgens deel 0 → 1 → 2, juiste illustratie krijgt nadruk |
| Snelle scrollsprongen | Van begeleiding naar slot en terug: scène 5 en terug scène 2/deel 2 correct hersteld (nulgebaseerde dataset) |
| Hoofdstuklinks | Alle zes hoofdstukken; vooruit en terug; juiste scène zonder voorgaande animatie nodig |
| Toetsenbord | Enter opent/sluit menu; Tab naar Artikelen; zichtbare focus; Escape sluit en geeft focus terug; hoofdstuklink en bronuitklapper werken met Enter |
| Lees zonder animatie | Zes gewone figuren zichtbaar; terugschakelen naar scrollbeelden werkt |
| JavaScript geblokkeerd | QA-server CSP `script-src 'none'`: zes gewone figuren, hoofdstuklinks, inhoud en bronnentabel beschikbaar; JS-bediening verborgen |
| Verminderde beweging | `matchMedia`-voorkeur gesimuleerd in lokale QA-fixture: geen `has-motion`, zes figuren, systeemvoorkeur wint. CSS reduce-regel schakelt transitions/animations uit. Geen OS-instelling gewijzigd |
| Tekstvergroting | Lokale QA-fixture met 200% rootlettergrootte op 360 px: gewone scènes, geen overloop, onderzoekslegenda twee kolommen. Grote koppen mogen over regels afbreken |
| Screenreaderstructuur | Eén H1, benoemde hoofdstukken, echte tekst/percentages, tabel met rij-/kolomkoppen, figuurbijschriften in leesvolgorde; decoratieve doublure aria-hidden |
| Browserconsole | Geen fouten/waarschuwingen op gewone preview; scriptblokkering op no-JS-fixture is opzettelijk |
| Deelafbeelding | PNG 1200 × 630 gerenderd uit bewerkbare SVG en visueel gecontroleerd |
| `check_concept.py` | Geslaagd: 713 woorden, 6 scènes, 100 tekens, exacte groepsaantallen, bron/HTML-consistentie, links/ankers, SVG, noindex en deploymentgrens |
| `node --check story.js` | Geslaagd |
| `design_system.py --impact artrose-scrollverhaal` | Eén afnemer: het lokale concept |
| `design_system.py --build` / `--check` | Geslaagd; catalogus, voorbeeld en bronfingerprints bijgewerkt |
| `check_seo_basics.py` | Geslaagd; 50 bestaande sitemap-pagina’s; concept niet toegevoegd |
| `check_publication_verification.py` | Geslaagd; 49 bestaande gepubliceerde/geverifieerde pagina’s; 56 concepten; geen goedkeuringsstatus gewijzigd |
| `check_site_quality.py` | 32 bestaande meldingen, geen nieuwe; zie boven |
| `git diff --check` | Geslaagd |
| Npm-checks | Niet beschikbaar: repository heeft geen `package.json` |

## Niet geverifieerd

- Medische eigenaargoedkeuring, live hosting, indexatie en Search Console. Er is geen release uitgevoerd; deze stappen staan in het publicatievoorstel.
- Native OS-instelling voor verminderde beweging en echte toestelrotatie: alleen gecontroleerde simulaties gebruikt, zoals hierboven benoemd.
- Volledige ondersteunende-technologietest met een gebruiker.

## Scope en bewaakte grenzen

Nieuwe bestanden: conceptpakket met HTML/CSS/JS, herbouwbare tekst en SVG's, PNG, storyboard, claimoverzicht, publicatievoorstel, QA-server/check en dit verslag; definitieve concepttekst in `concepten/artikelen/`; redactioneel leerdossier met onveranderlijke nulversie. Bestaande bestanden: designsysteemcatalogus, documentatie, gegenereerde galerij/gebruikslijst en drie regels in de generator voor expliciete lokale bronnen. Gedeelde productie-CSS/JS, `content.js`, sitemap, robots, register en bestaande artikelen ongewijzigd.

De vooraf aanwezige wijziging aan `assets/peroneus-saltans-drieluik.png` is intact gelaten. Er zijn geen assets of illustraties uit de inspiratieartikelen gekopieerd.

ADR-check: bestaande artikelenvariant binnen ADR-0002/0004/0005/0006. Geen nieuw paginamodel, route, doelgroep, zorglogica of productiearchitectuur; geen nieuwe ADR nodig. Owner validation voor medische inhoud en publicatie blijft open.

Nulversie: `concepten/editorial-learning/2026-09-24-artrosezorg-in-transitie-visueel/first-concept.md`, SHA-256 `1af8dcb7593e74a47f00bed597e1d8db9af0d43eec18a47ac23001b6bd7cea1d`. `approved-version.md` is uitsluitend de door de starttool aangemaakte melding dat nog geen goedgekeurde versie bestaat. Geen finalize uitgevoerd.
