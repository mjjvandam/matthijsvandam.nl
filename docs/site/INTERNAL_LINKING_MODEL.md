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
