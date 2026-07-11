# Maandelijkse site-automatiserings-APK matthijsvandam.nl

Gebruik dit document als canonieke prompt voor de maandelijkse Codex-cron
`maandelijkse-site-automatiserings-apk-matthijsvandam-nl`.

## Doel

Controleer maandelijks diagnostisch of de site-gerelateerde automatiseringen voor
`matthijsvandam.nl` nog bestaan, actief zijn, volgens het bedoelde ritme draaien
en inhoudelijk aansluiten op de actuele site-afspraken.

Dit is een meta-check boven de bestaande site-automatiseringen. Het is geen
sitecheck, geen artikelrun, geen reparatieroute, geen publicatieroute en geen
medische review.

Gepland ritme: iedere eerste maandag van de maand rond 20:00 lokale tijd.

## Scope

Werk in:

- `/Users/matthijsvandam/Documents/GitHub/matthijsvandam.nl`

Controleer alleen deze site-gerelateerde automations:

- `wekelijkse-hoofdredactie-sitecheck-matthijsvandam-nl`
- `tweewekelijkse-artikelkansen-matthijsvandam-nl`
- `maandelijkse-site-automatiserings-apk-matthijsvandam-nl`

Laat andere projecten en automations buiten scope, behalve wanneer ze per ongeluk
naar deze site-workspace verwijzen of deze site kunnen wijzigen.

## Verplichte bronlaag

Lees minimaal:

- `AGENTS.md`
- `CODEX_WERKWIJZE.md`
- `REDACTIEKOMPAS.md`
- `docs/site/CURRENT_SITE_STATE.md`
- `docs/site/SITE_POSITIONING.md`
- `docs/site/TARGET_AUDIENCES.md`
- `docs/site/CONTENT_PILLARS.md`
- `docs/site/PAGE_MODELS.md`
- `docs/site/SEO_AND_AI_VISIBILITY_MODEL.md`
- `docs/site/FOOT_ANKLE_PAIN_GUIDE_MODEL.md`
- `docs/site/INTERNAL_LINKING_MODEL.md`
- `docs/site/MEDICAL_CONTENT_SAFETY_RULES.md`
- `docs/site/INVARIANTS.md`
- `docs/site/KNOWN_DRIFT_RISKS.md`
- `docs/decisions/ADR-INDEX.md`
- `PUBLICATIE_REGISTER.json`
- `sitemap.xml`
- `robots.txt`
- `.vercelignore`
- de automation-configs onder `~/.codex/automations/` voor de drie site-automations
- de automation-memorybestanden voor die automations, wanneer aanwezig

## Controles

Controleer expliciet:

- of de drie site-automations bestaan;
- of ze `ACTIVE` zijn;
- of ze de juiste workspace gebruiken;
- of hun ritme logisch is ten opzichte van hun doel;
- of hun prompts nog aansluiten op `AGENTS.md`, `CODEX_WERKWIJZE.md`,
  `REDACTIEKOMPAS.md`, de `docs/site/`-bronlaag en de ADR-index;
- of de wekelijkse sitecheck medische veiligheid, concept/public-grenzen,
  publicatieregister, sitemap, robots, canonical, structured data en rustige
  medische vormtaal blijft bewaken;
- of de tweewekelijkse artikelkansenrun bronketen-gedreven blijft, media alleen
  als radar gebruikt, concepten en previews niet publiceert, geen sitemap,
  `content.js`, navigatie of publieke pagina's wijzigt zonder expliciete opdracht,
  en geen medische inhoud als geverifieerd markeert;
- of deze APK zelf diagnostisch blijft en geen automations, prompts, scripts,
  sitebestanden, JSON-data, registerstatussen, sitemap, robots, canonical,
  `.vercelignore`, contentvelden of publicatiecriteria wijzigt;
- of `review_nodig` als governance-status wordt behandeld en niet automatisch
  als technische fout;
- of bekende driftpunten uit `docs/site/KNOWN_DRIFT_RISKS.md` een maandstatus
  krijgen: canonical host, concept versus publiek, register versus todo, Lisfranc,
  contentclusters, projectcontent, SEO-claimtaal, beeldbank, contactformulier en
  tijdgebonden artikelen.

## Diagnostische checks

Je mag diagnostisch draaien:

```bash
PYTHONPYCACHEPREFIX=/private/tmp/mvd-site-automation-apk-pycache python3 tools/check_site_quality.py
PYTHONPYCACHEPREFIX=/private/tmp/mvd-site-automation-apk-pycache python3 tools/check_publication_verification.py
PYTHONPYCACHEPREFIX=/private/tmp/mvd-site-automation-apk-pycache python3 tools/check_seo_basics.py
PYTHONPYCACHEPREFIX=/private/tmp/mvd-site-automation-apk-pycache python3 tools/check_foot_pain_guide.py
PYTHONPYCACHEPREFIX=/private/tmp/mvd-site-automation-apk-pycache python3 tools/check_treatment_page_quality.py
```

Als een check niet is uitgevoerd, zeg dat expliciet. Claim nooit dat een check
groen is wanneer hij niet is gedraaid.

Er is geen `package.json`; verzin geen npm-, lint-, typecheck- of buildstap.

## Gedragsgrens

Wijzig niets behalve het maandrapport.

Niet doen:

- geen automations aanpassen;
- geen prompts, scripts of sitebestanden aanpassen;
- geen `PUBLICATIE_REGISTER.json`, `sitemap.xml`, `robots.txt`, canonicals,
  `.vercelignore`, `content.js` of publieke HTML wijzigen;
- geen conceptpagina's publiek maken;
- geen medische of professionele inhoud als `geverifieerd` markeren;
- geen mail sturen of conceptmail maken;
- geen domein koppelen, deploy starten, formulier activeren of publicatiestap zetten;
- geen artikelkansenrun, sitecheck of herstelactie starten als reparatie.

## Output

Schrijf precies een lokaal rapport naar:

- `docs/site/reviews/site-automation-apk-YYYY-MM.md`

Maak de map aan wanneer die ontbreekt. Gebruik exact deze koppen:

```text
SITE_AUTOMATISERINGS_APK_STATUS
MAAND
GEVONDEN_SITE_AUTOMATIONS
CONFIG_EN_RITME_STATUS
PROMPT_EN_DOC_DRIFT
PUBLICATIE_EN_MEDISCHE_GRENZEN
TECHNISCHE_CHECKS
RISICO_TOP_5
ACTIES_VOOR_EIGENAAR
NIET_GEDAAN
```

Gebruik maximaal vijf eigenaaracties. Gebruik alleen deze actielabels:

- `geen actie`
- `technische fix nodig`
- `documentatie bijwerken`
- `automation-update nodig`
- `needs owner validation`

## Statuslogica

Gebruik voor `SITE_AUTOMATISERINGS_APK_STATUS` een van:

- `OK`
- `AANDACHT_NODIG`
- `ACTIE_NODIG`

`OK` betekent dat de automationconfiguratie, prompts en bekende driftpunten geen
materiele actie vragen. `AANDACHT_NODIG` betekent dat er aandachtspunten zijn die
geen directe breuk vormen. `ACTIE_NODIG` betekent dat een automation ontbreekt,
niet actief is, naar de verkeerde workspace wijst, buiten de afgesproken grenzen
kan schrijven/publiceren of niet meer aansluit op de site-governance.

## ADR-check

Noem in het rapport dat deze APK ADR-0004, ADR-0005 en ADR-0006 controleert,
maar geen nieuwe ADR nodig heeft zolang de definities voor SEO/AI-zichtbaarheid,
medische veiligheid en publicatiegovernance ongewijzigd blijven.
