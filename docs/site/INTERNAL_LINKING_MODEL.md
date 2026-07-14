# Internal Linking Model

## Doel

Interne links moeten bezoekers helpen naar de juiste route zonder patientinformatie, professionele afstemming en consultancy te vermengen.

Elke interne link moet beantwoorden:

- Voor wie is deze vervolgstap?
- Is dit algemene informatie, professionele context of niet-patientgebonden advies?
- Is de vervolgstap veilig binnen officiele zorgkanalen?

## Hoofdnavigatie

De vaste publieke navigatie verwijst naar:

- Over
- Klachten en behandelingen
- Professionals
- Advies
- Projecten
- Artikelen
- Publicaties

Homepage-ankers vullen dit aan met:

- behandelingen;
- projecten;
- artikelen;
- publicaties;
- contact.

## Menucontract

Het hoofdmenu is een routecontract, geen losse lijst met willekeurige links.

Vaste publieke hoofditems:

- Over
- Klachten en behandelingen
- Professionals
- Advies
- Projecten
- Artikelen
- Publicaties

Compacte detailmenu's zijn toegestaan voor artikelen, projecten en concept-behandelpagina's. Ze moeten dan wel terugleiden naar de passende hub of route:

- artikelpagina's naar `artikelen.html` of de relevante professionele/adviesroute;
- projectpagina's naar `projecten.html`;
- behandel- en klachtenpagina's naar `behandelingen.html`;
- juridische en veiligheidscontext naar `privacy.html`, `disclaimer.html` of `index.html#contact` waar passend.

`Contact`, `Privacy` en `Disclaimer` zijn contextuele veiligheids- en contactlinks. Ze vormen geen extra hoofdspoor naast patienten, professionals en advies/zorgontwikkeling.

Een zichtbare wijziging aan hoofdmenu-items, doelgroep-routes of de scheiding tussen patient-, professional- en adviesroutes vraagt een expliciete ADR-check en owner validation.

## Route per doelgroep

Patienten:

- homepage naar `behandelingen.html`;
- `behandelingen.html` naar relevante patientartikelen;
- patientartikelen terug naar hub, disclaimer, privacy en contactgrenzen.

Professionals:

- homepage naar `professionals.html`;
- `professionals.html` naar professionele artikelen, publicaties en Doctolib Connect;
- professionele artikelen naar professionals-hub, publicaties en relevante projectcontext.

Partners en advies:

- homepage naar `advies-consultancy.html`;
- adviespagina naar projecten, onderwijsartikelen en e-mailroute;
- projectpagina's naar projectnieuws en relevante artikelen.

## Artikel- en projectkoppeling

`content.js` gebruikt:

- `audience`;
- `topics`;
- `project`;
- `archive`;
- `featured`.

Deze velden bepalen waar artikelen en projecten verschijnen. Pas deze velden zorgvuldig aan, omdat ze meerdere lijsten tegelijk beinvloeden.

## Behandelpagina-koppeling

Publiek:

- `behandelingen.html` toont kaartinformatie en filters.

Concept:

- `behandelingen/*.html` linkt onderling naar verwante conceptpagina's.
- Deze links blijven intern/lokaal zolang de pagina's `noindex` en buiten deployment staan.

## Veiligheidslinks

Gebruik consequent:

- `disclaimer.html` voor medische grenzen;
- `privacy.html` voor gegevensverwerking;
- `index.html#contact` voor algemene contactcontext;
- officiele externe zorgkanalen voor patientgebonden vragen.

## Niet doen

- Geen patientvraag direct naar advies/consultancy sturen.
- Geen conceptpagina publiek linken zonder publicatiebesluit.
- Geen link naar een behandeling toevoegen als Matthijs dat onderwerp niet als eigen aanbod voert.
- Geen los artikel prominent plaatsen als het beter alleen verdiepende context is.

## Te valideren

- Of er een centrale linkmatrix nodig is voor alle behandelpagina's voor livegang.
- Of oude anchorlinks op de homepage later moeten worden vervangen door volledige hubpagina-links.
