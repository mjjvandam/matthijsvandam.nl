# Frisse blik in het lokale dashboard

Datum: 10 september 2026.

Matthijs gaf expliciet opdracht voor een klein adviesblok vanuit uiteenlopende perspectieven, met ook grotere ideeën zoals geavanceerde hulpmiddelen, uitgebreidere bezoekersanalyse en advertentieruimte. De uitbreiding blijft binnen het lokale dashboard van ADR-0014.

## Wat is gemaakt

Het startdashboard toont één voorstel tegelijk. Het blok bevat de titel, invalshoeken, het voorstel en keuzeacties. Eerste stap, inspanning, afweging, toets en bronnen zijn uitklapbaar. Het aparte onderdeel **Frisse blik** bevat filters op perspectief, soort idee en eerdere keuze; **Tools & nieuwe mogelijkheden** omvat ook ondernemende ideeën zoals sponsoring.

De eerste door Codex samengestelde verzameling bevat twaalf ideeën: gebruiksdoelen meten, een sitezoeker, een vragenkaart, advertentieruimte/sponsoring onderzoeken, adviescases, projecttijdlijnen, een interactieve onderzoeksfiguur, een verwijzerskaart, een lees-/afdrukstand, zoekvragen voor de redactie, een brongebonden AI-leesassistent en een scholingspakket.

De ideeën bouwen op concrete sitebronnen. Specifieke externe mogelijkheden verwijzen naar primaire documentatie: Vercel custom events, Pagefind, Search Console en herkenbaarheid van reclame bij Stichting Reclame Code. Kosten en mogelijkheden moeten bij eventuele uitvoering opnieuw worden gecontroleerd. Er zijn geen commerciële opbrengsten, medische effecten of daadwerkelijk geuite patiëntbehoeften als bewezen aangenomen.

## Betekenis van keuzes

- Bewaren en afwijzen zijn lokale, duurzame keuzes, terug te vinden na herladen.
- **Naar Nog te doen** maakt exact één onderzoekstaak. Een taak verwijderen zet het idee terug bij bewaarde ideeën; ongedaan maken herstelt de vorige keuze.
- Een onderzoekstaak is geen uitvoeringsopdracht, medisch akkoord of publieke vrijgave.
- Opslag gebruikt versiecontrole voor zowel de idee-inhoud als de keuze. Een gewijzigde catalogustekst krijgt niet stilzwijgend dezelfde gekozen taak; het oude keuzerecord blijft bewaard en de nieuwe tekst vraagt herbevestiging.
- **Ander idee** bladert door de bestaande verzameling. De datum en herkomst zijn zichtbaar. Deze uitbreiding voegt geen automatische ideeëngeneratie, scheduler of externe modelverbinding toe.

## Controle

- **63 Python-tests geslaagd**, waaronder negen nieuwe ideeëncontroles voor opslag/herladen, herschikking van de catalogus, exact één taak, ongedaan maken, versieconflicten, gewijzigde ideeën, gelijktijdige keuzes, beschadigde opslag, onveilige verwijzingen, publieke grenzen en HTTP-sessie/CSRF.
- JavaScript-syntaxis en whitespace gecontroleerd.
- Browsercontrole met uitsluitend tijdelijke testopslag: sponsoridee bewaren → herladen → terugvinden → naar taken → precies één taak → terug naar bewaren → ongedaan maken → afwijzen → herladen → terug naar nieuwe voorstellen.
- Filter **Tools & nieuwe mogelijkheden** bevat de advertentieproef; filter ICT’er toont de AI-leesassistent. De eerste stap en onderbouwing blijven per idee bereikbaar.
- Dashboard en ideeënroute gecontroleerd op 360, 390 en 430 px zonder horizontale paginaoverloop. Desktopweergave visueel gecontroleerd op 1280 px. Het compacte dashboardblok is daar ongeveer 378 px hoog.
- De echte omgeving bevat twaalf ideeën. Tijdens de eindcontrole waren daarin inmiddels drie keuzes gemaakt: gebruiksmetingen en adviescases bewaard, de sitezoeker naar Nog te doen. Deze keuzes zijn behouden; de browserproef gebruikte een andere opslag en alleen het sponsoridee. De publieke bronbestanden en de echte artikelstaat zijn exact gelijk aan vóór deze opdracht. De lokale beheerserver is herstart.
- Geen publieke inhoud, indexering, advertenties, tracking, externe dienst of routine geactiveerd. Geen npm-project; de bestaande Python-controles zijn gebruikt. Brede publieke sitechecks zijn niet opnieuw uitgevoerd voor deze afgeschermde lokale uitbreiding; de testset controleert de grens met de publieke site.

## Bestanden en onderhoud

Backend: `local-admin/ideas.py`, `local-admin/server.py`, `local-admin/inventory.py` en `local-admin/test_ideas.py`. Inhoud: `local-admin/ideas-catalog.json`. Interface: `local-admin/ui/app.js`, `app.css` en `index.html`. Documentatie: `local-admin/README.md` en `docs/site/EDITORIAL_WORKSPACE_DESIGN.md`.

De README-bronversie is alleen voor `work-admin-expansion` en `work-admin-backup` opnieuw beoordeeld in `local-admin/work-items.json`. Beide bestaande vervolgtaken blijven open/later; overige bronwaarschuwingen blijven intact.

Bij het aanvullen blijven gekozen ideeën en hun stabiele ID’s in de verzameling staan, zodat keuzes terugvindbaar blijven. Codex leest de bestaande keuzes, actuele site en taken en controleert relevante externe bronnen opnieuw. Het bekijken of opslaan van een idee verandert geen positionering. Concrete uitvoering van bijvoorbeeld sponsoring, medische hulpmiddelen of een AI-interface doorloopt nog de daarbij passende inhoudelijke, technische en eigenaarbesluiten. Voor dit lokale adviesblok is geen nieuwe ADR of medische review nodig.
