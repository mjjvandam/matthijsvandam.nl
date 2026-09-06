# Known Drift Risks

## 1. Live versus repo-canonical

Risico:

- De repo gebruikt canonicals op `https://matthijsvandam.nl/`.
- Eerdere livecontext wees op mogelijke `www`-redirect.

Gevolg:

- SEO-signalen kunnen versnipperen.

Status:

- te valideren.

## 2. Concept versus publiek

Risico:

- 32 `behandelingen/*.html`-pagina's en `concept-foot-pain-guide.html` bestaan lokaal, maar zijn niet publiek bedoeld; enkelverzwikking, enkelartrose en enkelprothese zijn de publieke uitzonderingen.
- Een kleine wijziging in `.vercelignore`, robots of sitemap kan conceptcontent zichtbaar maken.

Beheersing:

- `check_publication_verification.py` draaien.
- `check_foot_pain_guide.py` draaien bij pijnwijzerwijzigingen.
- Nieuwe publieke pagina's altijd in `PUBLICATIE_REGISTER.json`.

## 3. Register versus todo

Risico:

- `SITE_TODO.md` kan achterlopen op `PUBLICATIE_REGISTER.json`.
- Tijdens audit waren alle 29 publieke pagina's geverifieerd, terwijl oudere todo-tekst nog reviewpunten voor gepubliceerde pagina's kan noemen.

Beheersing:

- Bij publicatiestatus altijd `PUBLICATIE_REGISTER.json` en check-output als waarheid gebruiken.
- Todo's periodiek opschonen.

## 4. Lisfranc en trauma-afbakening

Risico:

- `lisfranc-middenvoetletsel` bestaat lokaal als concept en in pijnwijzerdata.
- Het mag niet gaan lezen als behandelspoor of publiek aanbod.

Beheersing:

- In pijnwijzer: `url: ""` en verklarende `guideNote`.
- Geen publieke behandelkaart.
- Geen sitemap/publicatie zonder expliciet nieuw besluit.

## 5. Contentclusters groeien uit elkaar

Risico:

- Dezelfde onderwerpen leven in `behandelingen.html`, `content.js`, conceptpagina's, artikelen, projecten, register en launch-inventaris.

Gevolg:

- Interne links, metadata, kaartteksten en reviewstatus kunnen uiteenlopen.

Beheersing:

- Per onderwerp een bronpad vastleggen voordat het live gaat.
- Bij wijzigingen altijd hub, detailpagina, `content.js`, sitemap en register samen controleren.

## 6. Projectcontent wordt te breed

Risico:

- Zorgontwikkeling, AI, digitale zorg en consultancy kunnen losraken van orthopedie, ETZ-context of regionale zorg.

Beheersing:

- Nieuwe projectpagina's koppelen aan bestaande pijlers.
- Niet-patientgebonden advies duidelijk scheiden van verwijzing of patientzorg.

## 7. SEO gaat claimend worden

Risico:

- Zoekoptimalisatie kan ongemerkt leiden tot behandelclaims of te wervende snippets.

Beheersing:

- Geen commerciele SEO-taal.
- Titles/descriptions controleren op veilige formulering.
- `check_seo_basics.py` aanvullen met handmatige medische veiligheidscheck.

## 8. Beeldbank en assets

Risico:

- `beeldbank/` is niet bedoeld als gewone publieke content, maar kan technisch direct bereikbaar zijn afhankelijk van deployment.

Status:

- te valideren.

## 9. Contactformulier

Risico:

- Contactfunctionaliteit kan verwarring geven met patientvragen of medische gegevens.

Beheersing:

- Formulier pas activeren na bewuste configuratie.
- Geen patientgegevens via de site.
- Duidelijke verwijzing naar officiele zorgkanalen.

## 10. Tijdgebonden artikelen

Risico:

- Artikelen over panel, event, subsidie of projectstatus kunnen verouderen.

Beheersing:

- Datum zichtbaar houden.
- `archive` en eventuele offline-datum controleren.
- Projectstatussen periodiek nalopen.

## 11. FAQ-kopieen en schema lopen uiteen

Risico:

- Dezelfde patientvraag kan op een behandelpagina, artikel en in JSON-LD afzonderlijk worden aangepast.
- Gelijkluidende vragen kunnen medisch verschillende antwoorden hebben en daardoor ten onrechte worden samengevoegd.

Beheersing:

- `data/faqs.json` en `data/faq-placements.json` als centrale bron gebruiken.
- Alleen wijzigen via `tools/generate_faqs.py`.
- `python3 tools/generate_faqs.py --check` en `python3 tools/check_faqs.py` draaien.
- Duplicaten inhoudelijk classificeren en medische reviewstatus per antwoord behouden.

## 12. Avondmodus combineert lichte panelen met lichte tekst

Risico:

- Een paneel met een vaste lichte achtergrondkleur kan in avondmodus lichte teksttokens erven.
- Dit geeft vooral op tabletbreedte slecht leesbare koppen, labels en kaartteksten.

Beheersing:

- Geef lichte paneelcomponenten zowel voor `data-theme="dark"` als voor automatische donkere systeemvoorkeur een expliciet donker oppervlak.
- Controleer gedeelde componenten op tabletbreedte en meet tekstcontrast na wijzigingen aan achtergronden of themakleuren.
