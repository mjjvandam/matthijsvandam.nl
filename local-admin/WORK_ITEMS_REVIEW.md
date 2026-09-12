# Samengevoegde takenlijst — 10 september 2026

De aanvullende werktaken staan in `work-items.json`. De beheeromgeving leest die bij iedere verversing en combineert ze met de actuele behandelpagina's, het publicatieregister en nieuwe verslagen. De vier hoofdgroepen zijn Contact & nieuwsbrief, Inhoud & redactie, Techniek & vindbaarheid en Beheer & routines. Dit is een beoordeelde inventaris van aangesloten bronnen, geen garantie dat alle mogelijke werkzaamheden zijn gevonden.

## Wat is gecontroleerd

- Het contactformulier is op 10 september opnieuw zichtbaar in de echte browser op `https://www.matthijsvandam.nl/#contact`, met contactgrenzen, invoervelden en Versturen. `CONTACT_RELEASE.md` legt livegang en eerste inboxontvangst op 7 september vast. Vandaag is niets ingestuurd. De inboxweergave van de later gewijzigde contactmail is nog een afzonderlijke controle.
- Die live browserpagina gebruikt `https://matthijsvandam.nl/` als canonical, terwijl het geopende adres naar `www` leidt. De keuze voor één voorkeursadres blijft een expliciet besluit. Zoekmachineaccounts zijn vandaag niet bekeken; hun inrichting heet daarom Status vaststellen, niet Niet ingericht.
- De nieuwsbrief gebruikt de geaccepteerde native Brevo-route uit ADR-0013. Aanmeld- en voorkeurformulieren, template 9 en conceptcampagne 10 zijn voorbereid volgens het laatste bouwverslag. Volledige aanmelding, ontvangst, voorkeurwijziging, afmelding, gezamenlijke frequentiegrens en publieke activering zijn daarin nog niet afgerond. Providerinstellingen zijn vandaag niet opnieuw gecontroleerd.
- Twee bestaande artikelconcepten vragen nog beoordeling: instabiliteit na een enkelverzwikking en oefeningen bij knieartrose. Hun aanwezigheid is geen nieuwe schrijfopdracht. Syndesmoseletsel en transfermetatarsalgie zijn afzonderlijke toekomstige onderwerpen uit de inhoudelijke backlog.
- De pijnwijzer heeft een eigen review-/vrijgavetaak; de medische review van de gekoppelde behandelpagina's blijft in de bestaande lijst. Lisfranc blijft geparkeerd.
- De laatste sitecheck en APK leveren de technische aandachtspunten: conceptbestanden, menunacontrole, canonical/zoekmachine-inrichting, beeldbank, hostingkeuze en actualiseren van routine-/projectinstructies. Oude validatorfouten uit de APK zijn niet opnieuw opgevoerd omdat de latere sitecheck de oplossing vastlegt.
- Voor de nieuwe lokale beheeromgeving staan uitbreiding naar meer artikeltemplates en het controleren van de back-updekking als vervolgpunten. Er is niet aangenomen dat de computer helemaal geen back-up heeft.

## Status en onderhoud

Iedere aanvullende taak bevat een concrete volgende actie, een peildatum en bronbestanden met hun gecontroleerde inhoudsversie. Verandert een bron of ontbreekt die, dan vraagt het dashboard opnieuw om statuscontrole. Ook een eerder afgeronde taak wordt dan niet stilzwijgend als afgerond behouden. Dat is een signaal om de nieuwe bron te lezen, geen bewijs dat het werk opnieuw moet worden gedaan.

Een vinkje **Bekeken** registreert uitsluitend dat Matthijs een punt heeft gelezen. Een aanvullende werktaak blijft in de open werklijst totdat gecontroleerd bewijs in de catalogus de status Afgerond rechtvaardigt. Medisch akkoord, publicatie en verzending volgen hun eigen bestaande route. Het dashboard voert geen taak uit door hem te tonen of aan te vinken.

Wanneer werk wordt afgerond, controleert Codex de concrete uitkomst, werkt de betreffende taak en bronverwijzingen bij en ververst daarna het dashboard. Maak geen nieuwe taak naast dezelfde bestaande ID. De bronhash mag alleen na inhoudelijke herbeoordeling worden bijgewerkt; een melding wegschrijven is geen controle. Er is geen automatisch verborgen netwerkonderzoek.

De generieke taak voor een verslag vervalt wanneer een actuele concrete taak hetzelfde verslag aantoonbaar overneemt. Een nieuw of gewijzigd verslag verschijnt weer als te beoordelen. De oorspronkelijke contactlivegang blijft onder Afgerond/Alles vindbaar; de nieuwste mailcontrole is een aparte open taak.

## Grenzen

Deze wijziging breidt uitsluitend het lokale dashboard en de taakdocumentatie uit onder ADR-0014. Contactformulier, nieuwsbrief, medische artikelen, sitemap, register, deployment en automations worden hiermee niet gewijzigd of geactiveerd. Beoordeelde historische concepten worden niet opnieuw opengezet omdat hun oude conceptbestand nog bestaat.
