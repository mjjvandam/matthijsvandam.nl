# Weekcheck naar dashboard — 11 september 2026

Matthijs heeft gevraagd de wekelijkse rapportmail te laten vervallen: terugblik in het dashboard, concrete vervolgacties op Nog te doen en kennisgevingen met Bekeken. Dit is geen nieuwe sitecheck.

## Uitgevoerd

- De bestaande dashboard-inventaris leest nu een afzonderlijke sectie Ter kennisname uit het laatste weekverslag. Bekeken werkt met de bestaande lokale leesopslag en laat concrete werktaken open. Een gewijzigde kennisgeving of een nieuwe verslagdatum maakt de kennisgeving opnieuw ongelezen; een wijziging elders in hetzelfde verslag doet dat niet.
- De kennisgeving uit de controle van 9 september is toegevoegd aan dat bestaande verslag. De datum en historische mailstatus blijven behouden. De bijbehorende terugblik en taakbronversie zijn na vergelijking bijgewerkt; de inhoudelijke bevindingen zijn niet veranderd en er is geen nieuwe menutaak aangemaakt.
- De uitvoerafspraken staan in local-admin/WEEKLY_SITECHECK_WORKFLOW.md. De volledige gewenste schedulerprompt staat klaar in local-admin/weekly-sitecheck-prompt.txt.
- Geen mail verzonden of conceptmail aangemaakt. Het bestaande Gmail-concept is niet verwijderd.

## Nog geblokkeerd

De officiële Codex automation-tool weigerde zowel view als update: "MCP tool call requires approval, but approval policy is never". De opgeslagen schedulerprompt is daarom NIET aangepast en bevat nog de oude mailopdracht. Er is geen directe bestandsomweg gebruikt. De eigenaar moet de klaargezette prompt in de routine-editor overnemen, of de officiële tool in een sessie met geschikte toestemming laten uitvoeren. Ritme en model blijven ongewijzigd.

## Controle en grenzen

65 backendtests geslaagd, inclusief leesmarkering die uitsluitend met gewijzigde kennisgeving vervalt en lege kennisgevingen die geen taak opleveren. De bestaande tests bewaken aparte werkstatus, broncontrole, duplicaatpreventie en tijdelijke testopslag. ADR-0014 dekt deze lokale uitbreiding; geen nieuw ADR nodig. Medische inhoud, registerstatus en publieke website zijn niet gewijzigd. Schedulerwijziging is pas afgerond na gecontroleerd teruglezen.

Runregistratie: 2026-09-11. Automation-memory is in deze sessie geen toegestane schrijfmap; deze voortgang is daarom in dit lokale verslag vastgelegd.

## Laatste verificatie

- Sitekwaliteit, publicatieverificatie en SEO slagen; 40 publieke pagina’s blijven geverifieerd. git diff --check schoon.
- Rechtstreekse dashboard-inventaris toont de nieuwe kennisgeving, een actuele weekterugblik en precies één concrete menutaak. De bestaande menutaak heeft inmiddels gewijzigde script/CSS-bronnen en vraagt terecht statuscontrole; daarom blijft ook het algemene verslagcontrolepunt zichtbaar. Die bronwaarschuwing is niet weggewerkt.
- De al draaiende beheerserver op 8878 gebruikt nog de oude Python-code. Herstarten werd door de sandbox geweigerd (operation not permitted); opnieuw starten op die poort meldde Address already in use. Sluit het bestaande servervenster en start Start beheer.command opnieuw om de nieuwe kennisgevingskaart te laden. Browsercontrole van de vernieuwde server is hierdoor niet uitgevoerd.
- Geen package.json; geen npm-checks. Geen nieuwe medische review nodig voor deze lokale dashboarduitbreiding.

Afgerond lokaal / externe wijziging geblokkeerd: 2026-09-11T21:08:16+02:00

## Vervolg na stoppen oude processen — 11 september 2026

De oude beheerserver is door de gebruiker gestopt. De nieuwe server draait op 127.0.0.1:8878; de browser toont de kennisgeving met Bekeken en de bestaande concrete werkpunten. De herstartblokkade is opgelost.

Frisse blik ondersteunt nu Agents & routines, Skills & werkwijzen en Vereenvoudigen. Drie concrete voorstellen zijn toegevoegd over brononderhoud, herbruikbare publicatiechecks en minder dubbele routines. De browser toont 15 ideeën: 12 nieuw, 2 bewaard en 1 in Nog te doen. Bestaande keuzes zijn behouden.

De voorbereide weekroutine vult bij minder dan drie onbeoordeelde ideeën maximaal drie zinvolle voorstellen aan, met behoud van eerdere keuzes en aandacht voor afschalen. Dit gebeurt pas bij een geslaagde weekrun nadat de prompt is opgeslagen; het aanvullen is nog niet actief. De officiële automation-tool weigert opnieuw zowel lezen als wijzigen met dezelfde approval-policy-fout. Alleen deze schedulerwijziging blijft geblokkeerd.

66 beheertests slagen. Sitekwaliteit, publicatieverificatie (40 geverifieerde publieke pagina’s), SEO en git diff --check slagen. Browsercontrole bevestigt de nieuwe categorieën, voorstellen en leesmarkering. Geen nieuwe layout toegevoegd; mobiele breedtes zijn in deze vervolgcontrole niet afzonderlijk getest. ADR-0014 blijft van toepassing; geen nieuw ADR nodig. Geen medische inhoud gewijzigd, geen nieuwe eigenaarreview en geen publicatie uitgevoerd.
