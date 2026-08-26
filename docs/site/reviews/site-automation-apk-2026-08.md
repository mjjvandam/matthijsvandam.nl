# SITE_AUTOMATISERINGS_APK_STATUS

`AANDACHT_NODIG`

De drie verplichte site-automations bestaan, zijn `ACTIVE`, gebruiken de juiste workspace en hebben een logisch ritme. Er is geen directe automationbreuk gevonden. Aandacht is nodig omdat de twee uitvoerende prompts de actuele bronlaag en ADR-index niet expliciet als verplichte leeslaag noemen, en omdat de publicatievalidator één bestaande afwijking meldt voor het tijdgebonden patiëntpanelartikel.

# MAAND

2026-08. Diagnostische uitvoering afgerond op 2026-08-05 (Europe/Amsterdam).

# GEVONDEN_SITE_AUTOMATIONS

- `wekelijkse-hoofdredactie-sitecheck-matthijsvandam-nl`: gevonden; status `ACTIVE`.
- `tweewekelijkse-artikelkansen-matthijsvandam-nl`: gevonden; status `ACTIVE`.
- `maandelijkse-site-automatiserings-apk-matthijsvandam-nl`: gevonden; status `ACTIVE`.
- Geen andere automations onderzocht op inhoud. Er is niet breed gezocht naar automations van andere projecten; daardoor is niet vastgesteld of een automation buiten scope per ongeluk naar deze workspace verwijst.

# CONFIG_EN_RITME_STATUS

- Wekelijkse sitecheck: juiste workspace; `FREQ=WEEKLY;BYDAY=WE;BYHOUR=19;BYMINUTE=30`; passend bij een wekelijkse hoofdredactiecheck.
- Tweewekelijkse artikelkansen: juiste workspace; `FREQ=WEEKLY;INTERVAL=2;BYDAY=SU;BYHOUR=19;BYMINUTE=30`; passend bij een tweewekelijkse bron- en conceptrun.
- Maandelijkse APK: juiste workspace; `FREQ=MONTHLY;BYDAY=MO;BYSETPOS=1;BYHOUR=20;BYMINUTE=0`; conform eerste maandag rond 20:00 lokale tijd.
- De automation-memory laat recente uitvoeringen zien voor de wekelijkse sitecheck (laatst vastgelegd 2026-07-30) en artikelkansenrun (laatst vastgelegd 2026-07-26). Deze APK had nog geen eerdere memoryrun.
- De feitelijke schedulerhistorie, gemiste triggers en exacte starttijden zijn niet onafhankelijk uit een schedulerlog gecontroleerd. Alleen configuratie en aanwezige run-memory zijn diagnostisch beoordeeld.

# PROMPT_EN_DOC_DRIFT

- De wekelijkse sitecheck bewaakt inhoudelijk medische veiligheid, doelgroepgrenzen, metadata, interne links, sitemap, robots, canonical, JSON-LD, mobiele leesbaarheid en rustige medische vormtaal. De prompt noemt `AGENTS.md`, maar niet expliciet `CODEX_WERKWIJZE.md`, `REDACTIEKOMPAS.md`, de volledige `docs/site/`-bronlaag of `docs/decisions/ADR-INDEX.md`. Ook staat niet expliciet dat `review_nodig` een governance-status is. Dit is beperkte promptdrift, geen aangetoonde uitvoeringsbreuk.
- De artikelkansenprompt blijft bronketen-gedreven: media zijn alleen radar, een stevige achterliggende bron is verplicht, bronstatus en actualiteit worden gelabeld, medische claims blijven begrensd en concept/preview blijft `noindex` en buiten sitemap, `content.js`, navigatie en publieke HTML. De prompt noemt de actuele sitebronlaag en ADR-index niet expliciet als verplichte leeslaag. Dit is beperkte documentkoppeldrift.
- De APK-prompt sluit rechtstreeks aan op `AGENTS.md` en `docs/site/SITE_AUTOMATION_APK_PROMPT.md` en blijft diagnostisch: geen reparatie, mail, publicatie of site-/automationwijziging.
- Deze APK heeft ADR-0004 (SEO en AI-zichtbaarheid), ADR-0005 (medische veiligheid) en ADR-0006 (publicatiegovernance) gecontroleerd. Er is geen nieuwe ADR nodig zolang deze definities ongewijzigd blijven.

# PUBLICATIE_EN_MEDISCHE_GRENZEN

- De wekelijkse sitecheckprompt bewaakt concept/public-grenzen, sitemap, robots, canonical, structured data en medische vormtaal, maar verwijst niet expliciet naar `PUBLICATIE_REGISTER.json`; publicatiegovernance is daardoor minder scherp verankerd dan in de huidige bronlaag.
- De artikelkansenprompt verbiedt wijziging van gepubliceerde HTML, `content.js`, `sitemap.xml`, `robots.txt` en navigatie voor een concept, en verbiedt publicatie. Hij markeert medische inhoud niet automatisch als geverifieerd en vraagt menselijke review.
- `review_nodig` is in deze APK behandeld als governance-status en niet als technische fout. De actuele validator telde 0 pagina's met `review_nodig`.
- `check_publication_verification.py` vond wel `published_page_changed_since_verification` voor `artikelen/patientpanel-leefstijl-orthopedie.html`. Dit vraagt bewuste eigenaarbeoordeling of technische registerintegriteitscontrole; de APK heeft geen registerstatus gewijzigd.
- Geen nieuwe medische claims beoordeeld of geverifieerd. Geen concept publiek gemaakt en geen publicatiehandeling uitgevoerd.

# TECHNISCHE_CHECKS

- `check_site_quality.py`: uitgevoerd; exit 0; 70 HTML-bestanden gecontroleerd; geen structurele issues gevonden.
- `check_publication_verification.py`: uitgevoerd; exit 1; 32 gepubliceerde pagina's, 32 geregistreerd als geverifieerd, 0 `review_nodig`, 45 concept/noindex buiten live-scope; één `published_page_changed_since_verification` voor het patiëntpanelartikel.
- `check_seo_basics.py`: uitgevoerd; exit 0; 32 sitemap-pagina's gecontroleerd; geen SEO-basisissues gevonden.
- `check_foot_pain_guide.py`: uitgevoerd; exit 0; geen structurele issues gevonden.
- `check_treatment_page_quality.py`: uitgevoerd; exit 0; inventaris en paginastatus consistent.
- Er is geen `package.json`; npm-, lint-, typecheck- en buildchecks zijn niet uitgevoerd en niet beschikbaar als projectstap.
- Geen live-site-, browser-, mobiele-, console-, e-mail-, domein-, formulier-, deployment- of schedulerlogcheck uitgevoerd.

# RISICO_TOP_5

1. Tijdgebonden publicatie/register: het patiëntpanelartikel is gewijzigd sinds de vastgelegde verificatiebasis; dit is de enige actuele technische afwijking.
2. Prompt/documentkoppeling: de wekelijkse sitecheck en artikelkansenrun noemen de volledige actuele `docs/site/`-bronlaag en ADR-index niet expliciet.
3. Canonical host: repo gebruikt de apex-host; mogelijk `www`-livegedrag blijft `needs owner validation` en is niet live gecontroleerd.
4. Concept/public en contentclusters: lokale behandelconcepten, pijnwijzerdata, `content.js`, sitemap, register en inventaris kunnen uit elkaar lopen; de uitgevoerde validators vonden nu geen structurele concept- of behandelstatusfout.
5. Overige bekende drift: Lisfranc blijft alleen oriënterende differentiaal zonder publieke behandelroute; projectcontent en SEO-claimtaal tonen in de uitgevoerde checks geen technische fout. Publieke bereikbaarheid van `beeldbank/`, activering van het contactformulier en inhoudelijke actualiteit van overige tijdgebonden artikelen zijn niet live of handmatig volledig gecontroleerd en blijven aandachtspunten.

# ACTIES_VOOR_EIGENAAR

- `needs owner validation`: bevestig of de huidige wijziging van `artikelen/patientpanel-leefstijl-orthopedie.html` overeenkomt met het inhoudelijk akkoord; laat pas daarna de technische verificatiebasis herstellen.
- `automation-update nodig`: overweeg de wekelijkse sitecheckprompt expliciet te laten verwijzen naar `CODEX_WERKWIJZE.md`, `REDACTIEKOMPAS.md`, de actuele `docs/site/`-bronlaag, ADR-0004/0005/0006, `PUBLICATIE_REGISTER.json` en de governancebetekenis van `review_nodig`.
- `automation-update nodig`: overweeg dezelfde expliciete bronlaag- en ADR-verankering toe te voegen aan de artikelkansenprompt; de bestaande bronketen-, concept- en medische grenzen kunnen inhoudelijk behouden blijven.
- `needs owner validation`: canonical apex versus `www` en de bedoelde publieke bereikbaarheid van `beeldbank/` blijven open governancepunten.

# NIET_GEDAAN

- Geen automation, prompt, script, sitebestand, JSON-data, `PUBLICATIE_REGISTER.json`, sitemap, robots, canonical, `.vercelignore`, `content.js`, publieke HTML, registerstatus of publicatiecriterium gewijzigd.
- Geen sitecheckautomation, artikelkansenrun of herstelactie gestart als reparatie.
- Geen mail verstuurd en geen conceptmail gemaakt.
- Niets gepubliceerd, geen domein gekoppeld, geen formulier geactiveerd en geen deployment gestart.
- Geen live-site-, browser-, mobiele-, console- of visuele vormtaalcheck uitgevoerd.
- Geen brede audit van automations buiten de drie opgegeven site-automations uitgevoerd; kruisprojectverwijzingen buiten deze drie zijn daarom niet uitgesloten.
