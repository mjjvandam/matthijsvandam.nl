# Codex-werkwijze matthijsvandam.nl

Dit document is het praktische werkprotocol voor Codex bij matthijsvandam.nl. `AGENTS.md`
bepaalt de vaste projectregels. `REDACTIEKOMPAS.md` is de inhoudelijke hoofdleidraad.
Deze werkwijze vertaalt die afspraken naar dagelijkse opdrachten, reviews en publicatiechecks.

## Vaste werkcyclus

Gebruik deze cyclus bij nieuwe pagina's, artikelen, grotere tekstwijzigingen en alles wat
publicatie of medische positionering raakt.

1. Bepaal doel, doelgroep en spoor.
   - patientgerichte uitleg;
   - patientgerelateerde informatie voor professionals;
   - niet-patientgebonden advies of consultancy;
   - algemeen profiel, project, publicatie of juridisch/technisch onderdeel.

2. Bepaal de plek in de sitestructuur.
   - hoofdpagina, behandelpagina, artikel, projectpagina, conceptpagina of alleen researchdossier;
   - zichtbaarheid via navigatie, kaarten, interne links en sitemap;
   - gewenste vervolgstap per doelgroep, met officiele zorgkanalen bij patientgebonden vragen.

3. Doe een compacte staffronde.
   - bronredacteur: bronstatus, primaire bron, richtlijnbasis, bronhierarchie en claimrisico;
   - stijlredacteur: rustige professionele toon, geen AI-taal, geen patientenfolderritme waar dat niet past;
   - medische veiligheidsreviewer: geen behandelclaims, geen advies op maat, geen patientportaaltaal.

4. Werk redactioneel en technisch klein en herleidbaar.
   - behoud bestaande vormtaal, componenten, CSS-variabelen en navigatiepatronen;
   - vermijd brede refactors;
   - maak expliciet welke medische punten Matthijs nog moet beoordelen.
   - controleer vóór oplevering wat elders moet meeveranderen: zoek oude en nieuwe termen,
     links en functies ook op ongewijzigde pagina's en in gedeelde data en werkinstructies;
   - volg per geraakt doelgroepspoor tekst, knop/link, werkelijke bestemming en uitleg.
     Controleer bijvoorbeeld contactroutes na een nieuw formulier, gesloten oproepen en
     gewijzigde project- of publicatiestatus. Een technisch geldige link is niet voldoende;
   - gebruik de sectie 'Wijzigingen en samenhang controleren' in
     `local-admin/WEEKLY_SITECHECK_WORKFLOW.md` als controlekader. Rapporteer scope,
     bewuste uitzonderingen en open controles; behoud medische en publicatiepoorten.
     Wacht voor deze oplevercontrole niet op de volgende weekcheck.

5. Kies het passende publicatiespoor en controleer publicatiestatus.
   - gebruik standaard de **gerichte pagina-release** voor één bestaande pagina zonder
     structurele wijzigingen;
   - gebruik de **uitgebreide release** bij nieuwe publieke pagina's, meerdere pagina's,
     wijzigingen aan navigatie/filters/templates/content.js, metadata/schema, sitemap,
     robots, canonical, deployment-grenzen, contact/nieuwsbrief of Search Console;
   - concept/noindex blijft buiten live-scope;
   - gepubliceerde pagina's horen in `PUBLICATIE_REGISTER.json`;
   - nieuwe of gewijzigde gepubliceerde pagina's blijven `review_nodig` totdat Matthijs akkoord geeft.
   - controleer bij vrijgave alle bestaande tegels voor die pagina, zowel op `index.html` als op
     `behandelingen.html`: vervang `data-concept-url` door `data-url` en gebruik één omvattende
     `a.article-card-link` binnen `article-card-clickable`, niet alleen een klein Lees-meer-linkje;
   - behoud concepttegels zonder publieke link; alleen een lokaal bestand of medische review is
     geen publicatiebesluit. Controleer sitemap, robots, deployment en register samen. Bij een
     gerichte release volstaat dit voor de gewijzigde pagina en de directe route ernaartoe; voer
     geen volledige site- of homepagecontrole opnieuw uit als de relevante pre-publicatiecheck
     al is afgerond;
   - controleer relevante kruislinks en terugroutes. `check_site_quality.py` signaleert bestaande
     tegels die na publicatie nog niet klikbaar zijn en klikbare tegels naar conceptpagina's.
   - de filters op homepage en behandeloverzicht gebruiken `data-published-first`: tegels met
     een vrijgegeven `data-url` en bijpassende omvattende link komen eerst, daarna de overige
     tegels. De onderlinge volgorde binnen beide groepen blijft behouden. De homepage past
     de grens van vier tegels pas daarna toe; conceptlinks worden niet automatisch geactiveerd.

6. Rond af met een korte kwaliteitsrapportage.
   - gewijzigde bestanden;
   - uitgevoerde checks;
   - resterende medische of inhoudelijke reviewpunten;
   - status: concept, review nodig of geverifieerd.

## Standaard checks

Gebruik waar passend:

- `python3 tools/check_site_quality.py`
- `python3 tools/check_publication_verification.py`
- `python3 tools/check_seo_basics.py`
- `python3 tools/generate_faqs.py --check` bij FAQ-wijzigingen
- `python3 tools/check_faqs.py` bij FAQ-wijzigingen

Als een wijziging invloed heeft op hero's, kaarten, navigatie, filters, formulieren of tekstblokken,
controleer ook mobiele breedtes rond 360, 390 en 430 px. Bij publicatiegerichte wijzigingen hoort
ook een controle op interne links, metadata, canonical, robots, JSON-LD, sitemap en zichtbare
medische veiligheidsgrenzen.

### Gerichte pagina-release

De gerichte route is de standaard voor één bestaande pagina zonder structurele wijziging.

**Vóór eigenaarakkoord**

- inhoudelijke, medische en broncontrole;
- lokale preview en alleen de relevante mobiele controle;
- relevante site-, SEO- en publicatiechecks;
- controle van gewijzigde kaarten, metadata en interne links.

**Na eigenaarakkoord**

1. Leg het akkoord vast voor de exacte versie.
2. Werk alleen de betreffende registerstatus en noodzakelijke publicatiebestanden bij.
3. Controleer de diff en draai een gerichte integriteitscontrole.
4. Commit en push de afgesproken bestanden.
5. Wacht op een `READY`-deployment.
6. Controleer de gewijzigde URL, de directe ouderroute en sitemap/robots/register.

Controleer bij deze route niet opnieuw alle kernpagina's, alle mobiele breedtes of Search Console,
tenzij de wijziging die onderdelen raakt. Een deployment, lokaal pakket of registerwijziging is
geen zelfstandig bewijs dat de livepagina correct is; de gewijzigde URL blijft altijd onderdeel
van de nacontrole.

### Uitgebreide release

Gebruik de uitgebreide route wanneer de wijziging meerdere pagina's of gedeelde infrastructuur
raakt. Controleer dan de volledige relevante routes, gedeelde data, mobiele breedtes, metadata,
structured data, sitemap/robots/canonical, deploymentgrenzen en — bij vindbaarheidswijzigingen —
Search Console volgens `local-admin/SEARCH_CONSOLE_WORKFLOW.md`.

Search Console is dus geen standaardstap na iedere inhoudelijke pagina-release. Het is verplicht
bij wijzigingen aan URL's, redirects, canonical, sitemap, robots, navigatie/interne links en bij
de expliciet relevante nacontrole van een publieke release.

## Opdrachtformats

### Nieuwe behandelpagina

```text
Maak of herwerk een concept-behandelpagina over [onderwerp].

Doelgroep: patienten die zich algemeen orienteren.
Spoor: patientgerichte uitleg, geen patientportaal.
Status: concept/noindex tenzij expliciet anders gevraagd.

Gebruik de vaste staffronde uit CODEX_WERKWIJZE.md.
Let extra op:
- geen medisch advies op maat;
- geen behandelclaims of operatiedruk;
- heldere afbakening met verwante klachten;
- veilige verwijzing naar officiele zorgkanalen;
- metadata, interne links en mobiele leesbaarheid.

Rond af met:
1. gewijzigde bestanden;
2. uitgevoerde checks;
3. medische reviewpunten voor Matthijs;
4. publicatiestatus.
```

### Review bestaande pagina voor publicatie

```text
Beoordeel [pad] voor publicatie.

Gebruik rollen: hoofdredactie, sitestructuur/integratie, SEO, juridisch/compliance,
medische veiligheid en ICT/kwaliteit.

Geef eerst:
1. blokkades voor publicatie;
2. concrete verbeteringen;
3. medische punten die Matthijs moet controleren;
4. technische checks die nodig zijn.

Voer kleine veilige verbeteringen zelf uit, maar markeer medische inhoud niet als geverifieerd.
```

### Artikel op basis van bron of nieuwsaanleiding

```text
Werk een artikelvoorstel uit op basis van [bron/aanleiding].

Gebruik media alleen als radar. Zoek of controleer de achterliggende primaire bron,
richtlijn, congres-/verenigingsbron of officiele medische bron.

Label per bron de status:
- media-aanleiding;
- congres-/verenigingsbron;
- peer-reviewed studie;
- richtlijn/officiele publieksbron;
- achtergrondbron.

Schrijf eerst concreet wat de bron liet zien: wat is onderzocht of gemeld, bij wie,
wat werd gevonden en wat blijft onzeker. Daarna pas duiden.
```

### SEO en interne links

```text
Controleer [pad of paginacluster] op vindbaarheid en interne samenhang.

Let op:
- zoekintentie en doelgroep;
- title, meta description, H1/H2;
- canonical, robots, OpenGraph en social preview;
- interne links en veilige vervolgstap;
- geen commerciele SEO-taal of behandelclaims.

Geef concrete tekstvoorstellen en pas kleine veilige verbeteringen toe.
```

### Technische pre-publicatiecheck

```text
Controleer de site technisch voor publicatie van [pagina/cluster].

Draai waar passend:
- python3 tools/check_site_quality.py
- python3 tools/check_publication_verification.py
- python3 tools/check_seo_basics.py
- python3 tools/generate_faqs.py --check bij FAQ-wijzigingen
- python3 tools/check_faqs.py bij FAQ-wijzigingen

Controleer daarnaast mobiele breedtes 360, 390 en 430 px wanneer layout of zichtbare UI is geraakt.
Rapporteer alleen relevante issues, restpunten en publicatieblokkades.
```

### Livegangvoorbereiding

```text
Doe een livegangcheck voor matthijsvandam.nl.

Controleer:
- metadata, canonical, OpenGraph en social preview;
- favicon/logo;
- robots.txt en sitemap.xml;
- privacy en disclaimer;
- PUBLICATIE_REGISTER.json;
- medische disclaimer en zichtbare zorgkanaalgrenzen;
- bestaande kwaliteitschecks.

Publiceer niets en koppel geen domein zonder expliciete toestemming.
```

## Afrondingsformat voor Codex

Sluit grotere taken af met deze compacte vorm:

```text
Gedaan:
- [belangrijkste wijziging]

Gewijzigd:
- [bestanden]

Checks:
- [commando of handmatige controle]: [resultaat]

Nog door Matthijs te beoordelen:
- [medische/professionele punten of "geen nieuwe medische claims"]

Publicatiestatus:
- [concept / review nodig / geverifieerd blijft ongewijzigd]
```

## Ontwerpwijzigingen en gedeeld gebruik

Volg bij alle visuele/interactieve wijzigingen `docs/site/DESIGN_SYSTEM.md`. Bepaal eerst gedeelde component versus pagina-uitzondering, inventariseer de afnemers met `python3 tools/design_system.py --impact BESTAND-OF-COMPONENT`, wijzig de relevante afnemers mee en werk regels/voorbeelden bij. Genereer met `--build`, controleer met `--check` en voer visuele controles uit. Geen afronding zonder vermelding van scope, uitzonderingen en lokale/live-status. Bestaande inhoudelijke en publicatiepoorten blijven gelden.
