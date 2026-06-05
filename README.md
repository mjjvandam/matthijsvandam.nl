# matthijsvandam.nl

Statische conceptsite voor de professionele website van Matthijs van Dam.

## Inhoudelijke richting

- Expert-hub, geen patiëntportaal.
- Focus op voet, enkel en sportletsel; knieartrose; leefstijl en obesitas zonder stigma; onderzoek, onderwijs en zorgontwikkeling.
- Geen medisch advies op maat.
- Voor afspraken, patiëntenzorg en spoed verwijzen naar officiële zorgkanalen.

## Klaar voor livegang

Aanwezig:

- `index.html`
- `expertise.html`
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
- gevulde expertise-, artikel-, project- en publicatiepagina's
- contactformulier technisch voorbereid, maar nog niet zichtbaar geactiveerd

## Nog handmatig beslissen

- Medische/professionele claims inhoudelijk nalopen.
- Visuele klikronde doen op desktop en mobiel.

## Contactformulier via Vercel

Het contactformulier is technisch voorbereid via `/api/contact`, maar staat voorlopig niet zichtbaar
op de website. Voor live gebruik zijn in Vercel deze Environment Variables nodig:

- `RESEND_API_KEY`: API-key uit Resend.
- `CONTACT_TO_EMAIL`: het e-mailadres waarop berichten moeten binnenkomen.
- `CONTACT_FROM_EMAIL`: de afzender die in Resend is toegestaan, bijvoorbeeld
  `Matthijs van Dam <website@matthijsvandam.nl>`.

In Resend moet het gebruikte domein of subdomein eerst zijn geverifieerd met de DNS-records
die Resend opgeeft. Die records worden bij TransIP toegevoegd. Zonder deze instellingen toont
het formulier een foutmelding en wordt er geen bericht verzonden.

## Simpele livegang

Publiceer via Vercel vanuit de GitHub-repository.
Controleer voor het pushen lokaal:

- homepage: hero, biografie, expertise, projecten, artikelen, publicaties en contactroutes;
- `expertise.html`: filters en 20 onderwerpen;
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
- `https://matthijsvandam.nl/expertise.html`
- `https://matthijsvandam.nl/artikelen.html`
- `https://matthijsvandam.nl/projecten.html`
- `https://matthijsvandam.nl/publicaties.html`
- `https://matthijsvandam.nl/privacy.html`
- `https://matthijsvandam.nl/disclaimer.html`
- `https://matthijsvandam.nl/robots.txt`
- `https://matthijsvandam.nl/sitemap.xml`

Voor Vercel staat `vercel.json` klaar. Voor Netlify/Cloudflare Pages staat `_headers` klaar.
