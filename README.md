# matthijsvandam.nl

Statische conceptsite voor de professionele website van Matthijs van Dam.

## Inhoudelijke richting

- Expert-hub, geen patiëntportaal.
- Focus op voet, enkel en sportletsel; knieartrose; leefstijl en obesitas zonder stigma; onderzoek, onderwijs en zorgontwikkeling.
- Geen medisch advies op maat.
- Voor afspraken, patiëntenzorg en spoed verwijzen naar officiële zorgkanalen.

## Toon van artikelen

- Patiëntgerichte medische uitleg blijft rustig, algemeen en niet sturend.
- Professionele beschouwingen mogen analytischer zijn, maar moeten concreet blijven en niet als beleidsnota klinken.
- Artikelen over onderwijs, publicaties, projecten of persoonlijke betrokkenheid mogen in de ik-vorm worden geschreven.
- Vermijd koppen die te veel uitleggen waarom iets strategisch op de site past, zoals "Waarom dit past bij...".
- Schrijf liever vanuit ervaring: wat gebeurde er, wat vond Matthijs belangrijk, wat neemt hij mee, welke nuance hoort erbij.
- Vermijd AI-achtige afstandelijke zinnen zoals "dit sluit aan bij de bredere professionele ontwikkeling" wanneer een gewone persoonlijke formulering beter is.

## Beeldrichtlijn behandel-tegels

- Tegelbeelden moeten direct herkenbaar passen bij het onderwerp, zonder abstracte anatomie wanneer een rustig klinisch beeld beter werkt.
- Hallux valgus en hallux rigidus gebruiken een voorvoet/grote-teenbeeld met klinische context, zonder handen en zonder overdreven afwijking.
- Metatarsalgie, Morton neuroom, hamertenen en tailor's bunion gebruiken een algemener voorvoetpijnbeeld rond de bal van de voet.
- Bij voetbeelden altijd controleren op anatomie: vijf tenen per voet, geen vreemde teenstand, geen ontbrekende of extra middenvoetsbeentjes.
- Gebruik geen rontgen-, bot- of modelbeeld als de anatomie niet betrouwbaar genoeg is of als het onderwerp ook met een patiëntvriendelijk klinisch beeld duidelijk kan worden.
- Interne referentiebeelden, goedgekeurde voorbeelden en prompts staan in `beeldbank/`; definitieve websitebeelden blijven in `assets/`.

## Klaar voor livegang

Aanwezig:

- `index.html`
- `behandelingen.html`
- `artikelen.html`
- `projecten.html`
- `publicaties.html`
- `privacy.html`
- `disclaimer.html`
- `404.html`
- `robots.txt`
- `sitemap.xml`
- favicon/logo assets
- social preview PNG
- basis SEO en structured data
- gevulde behandelingen-, artikel-, project- en publicatiepagina's
- contactformulier technisch voorbereid, maar nog niet zichtbaar geactiveerd

## Nog handmatig beslissen

- Medische/professionele claims inhoudelijk nalopen.
- Visuele klikronde doen op desktop en mobiel.

## Lokale conceptpagina's

Uitgebreide behandelpagina's die nog niet klaar zijn voor publicatie staan lokaal in `behandelingen/`.
Die map wordt genegeerd via `.gitignore`, zodat conceptpagina's niet per ongeluk live gaan bij commit en push.
Wanneer een pagina inhoudelijk en visueel klaar is, moet deze bewust uit `.gitignore` worden gehaald,
in de sitemap worden opgenomen en opnieuw medisch worden gecontroleerd.

## Contactformulier via Vercel

Het contactformulier is technisch voorbereid via `/api/contact`, maar staat voorlopig niet zichtbaar
op de website. Voor live gebruik zijn in Vercel deze Environment Variables nodig:

- `RESEND_API_KEY`: API-key uit Resend.
- `CONTACT_TO_EMAIL`: het e-mailadres waarop berichten moeten binnenkomen.
- `CONTACT_FROM_EMAIL`: de afzender die in Resend is toegestaan, bijvoorbeeld
  `Matthijs van Dam <website@matthijsvandam.nl>`.
- `CONTACT_FORM_ENABLED`: zet op `true` om de mailroute bewust te activeren.

In Resend moet het gebruikte domein of subdomein eerst zijn geverifieerd met de DNS-records
die Resend opgeeft. Die records worden bij TransIP toegevoegd. Zonder deze instellingen toont
het formulier een foutmelding en wordt er geen bericht verzonden.

## Simpele livegang

Publiceer via Vercel vanuit de GitHub-repository.
Controleer voor het pushen lokaal:

- homepage: hero, biografie, behandelingen, projecten, artikelen, publicaties en contactroutes;
- `behandelingen.html`: filters, zoekfunctie en behandelingen/aandachtsgebieden;
- `artikelen.html`: filters en alle artikelkaarten;
- `projecten.html`: alle projectkaarten;
- `publicaties.html`: publicaties en bronlinks;
- `privacy.html` en `disclaimer.html`: juridische en medische veiligheidsteksten.

Committen via GitHub Desktop:

1. Vul bij Summary een korte titel in, bijvoorbeeld `Website vullen voor lancering`.
2. Klik op `Commit to main`.
3. Klik daarna op `Push origin`.
4. Controleer in Vercel of de deployment klaar is.

Controleer daarna online:

- `https://matthijsvandam.nl/`
- `https://matthijsvandam.nl/behandelingen.html`
- `https://matthijsvandam.nl/artikelen.html`
- `https://matthijsvandam.nl/projecten.html`
- `https://matthijsvandam.nl/publicaties.html`
- `https://matthijsvandam.nl/privacy.html`
- `https://matthijsvandam.nl/disclaimer.html`
- `https://matthijsvandam.nl/robots.txt`
- `https://matthijsvandam.nl/sitemap.xml`

Voor Vercel staat `vercel.json` klaar. Voor Netlify/Cloudflare Pages staat `_headers` klaar.
