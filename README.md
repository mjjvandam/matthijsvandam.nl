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
- Gebruik `REDACTIEKOMPAS.md` als vaste hoofdredactionele leidraad voor sitestructuur,
  doelgroepen, aandoeningenpagina's, vindbaarheid en publicatiechecks.

## Beeldrichtlijn behandel-tegels

- Tegelbeelden moeten direct herkenbaar passen bij het onderwerp, zonder abstracte anatomie wanneer een rustig klinisch beeld beter werkt.
- Hallux valgus en hallux rigidus gebruiken een voorvoet/grote-teenbeeld met klinische context, zonder handen en zonder overdreven afwijking.
- Metatarsalgie, Morton neuroom, hamertenen en tailor's bunion gebruiken een algemener voorvoetpijnbeeld rond de bal van de voet.
- Bij voetbeelden altijd controleren op anatomie: vijf tenen per voet, geen vreemde teenstand, geen ontbrekende of extra middenvoetsbeentjes.
- Gebruik geen rontgen-, bot- of modelbeeld als de anatomie niet betrouwbaar genoeg is of als het onderwerp ook met een patiëntvriendelijk klinisch beeld duidelijk kan worden.
- Interne referentiebeelden, goedgekeurde voorbeelden en prompts staan in `beeldbank/`; definitieve websitebeelden blijven in `assets/`.
- Site-eigen artikel-, project- en aandoeningsbeelden krijgen voor publicatie een subtiel zichtbaar
  Matthijs van Dam-logo en bronmetadata. Gebruik daarvoor `tools/watermark_site_images.py`.
  Externe logo's of beelden van derden niet visueel watermerken zonder toestemming.

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

## Publicatieverificatie

Gebruik `CODEX_WERKWIJZE.md` als praktisch werkprotocol voor Codex-opdrachten, reviews en
pre-publicatiechecks. `REDACTIEKOMPAS.md` blijft de inhoudelijke hoofdleidraad; het werkprotocol
bevat de vaste opdrachtformats, staffronde en afrondingsrapportage.

Alle pagina's die gepubliceerd zijn, moeten intern door Matthijs zijn geverifieerd voordat de site
actief breder wordt gedeeld. Een pagina geldt als gepubliceerd wanneer deze meegaat in de deployment,
via de openbare navigatie bereikbaar is, in `sitemap.xml` staat of
`<meta name="robots" content="index, follow">` heeft.

De verificatiestatus staat in `PUBLICATIE_REGISTER.json`. Nieuwe of gewijzigde gepubliceerde pagina's
blijven daar op `review_nodig` totdat Matthijs de inhoud, medische grenzen, positionering en veilige
vervolgstappen heeft gecontroleerd. Na akkoord wordt alleen het register aangepast naar
`geverifieerd`, met `verified_by`, `verified_on` en eventueel een korte `review_notes`.

Controleer de status met:

- `python3 tools/check_publication_verification.py`

Deze check faalt bewust zolang een gepubliceerde pagina nog niet op `geverifieerd` staat. Dat is de
bedoeling: zo kan een pagina niet ongemerkt live blijven zonder expliciet inhoudelijk akkoord.

## Lokale conceptpagina's

Uitgebreide behandelpagina's die nog niet klaar zijn voor publicatie staan technisch in de repository
in `behandelingen/`, maar blijven concept doordat ze niet meegaan in de Vercel-deployment, op
`noindex, nofollow` staan, ontbreken in `sitemap.xml`, niet via openbare kaarten doorklikbaar zijn en
een aparte reviewstatus hebben in `FOOT_PAIN_GUIDE_LAUNCH_INVENTARIS.md`. De Voet- en
enkelpijnwijzer blijft op dezelfde manier lokaal concept via `concept-foot-pain-guide.html`.

Wanneer een pagina inhoudelijk en visueel klaar is, moet deze bewust worden overgezet naar
publicatie: verwijderen uit `.vercelignore`, opnemen in de sitemap, op `index, follow` zetten,
openbare links herstellen, registreren in `PUBLICATIE_REGISTER.json` en opnieuw medisch laten
controleren.

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

- structurele sitecheck: `python3 tools/check_site_quality.py`;
- publicatieverificatie: `python3 tools/check_publication_verification.py`;
- SEO-basischeck: `python3 tools/check_seo_basics.py`;
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
