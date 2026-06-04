# matthijsvandam.nl

Statische conceptsite voor de persoonlijke professionele website van Matthijs van Dam.

## Inhoudelijke richting

- Persoonlijke expert-hub, geen patientportaal.
- Focus op voet, enkel en sportletsel; knieartrose; leefstijl en obesitas zonder stigma; onderzoek, onderwijs en zorgontwikkeling.
- Geen medisch advies op maat.
- Voor afspraken, patientenzorg en spoed verwijzen naar officiele zorgkanalen.

## Klaar voor livegang

Aanwezig:

- `index.html`
- `privacy.html`
- `disclaimer.html`
- `404.html`
- `robots.txt`
- `sitemap.xml`
- favicon/logo assets
- social preview PNG
- nieuwsbriefstructuur met twee doelgroepen
- basis SEO en structured data
- contactformulier via een Vercel Function en Resend

## Nog handmatig beslissen

- Definitieve foto/portret of hero-beeld.
- Nieuwsbriefdienst kiezen en pas daarna koppelen.
- Medische/professionele claims inhoudelijk nalopen.

## Contactformulier via Vercel

Het contactformulier verstuurt berichten via `/api/contact`. Voor live gebruik zijn in Vercel
deze Environment Variables nodig:

- `RESEND_API_KEY`: API-key uit Resend.
- `CONTACT_TO_EMAIL`: het e-mailadres waarop berichten moeten binnenkomen.
- `CONTACT_FROM_EMAIL`: de afzender die in Resend is toegestaan, bijvoorbeeld
  `Matthijs van Dam <website@matthijsvandam.nl>`.

In Resend moet het gebruikte domein of subdomein eerst zijn geverifieerd met de DNS-records
die Resend opgeeft. Die records worden bij TransIP toegevoegd. Zonder deze instellingen toont
het formulier een foutmelding en wordt er geen bericht verzonden.

## Simpele livegang

Publiceer via Vercel vanuit de GitHub-repository.
Controleer daarna:

- `https://matthijsvandam.nl/`
- `https://matthijsvandam.nl/privacy.html`
- `https://matthijsvandam.nl/disclaimer.html`
- `https://matthijsvandam.nl/robots.txt`
- `https://matthijsvandam.nl/sitemap.xml`

Voor Vercel staat `vercel.json` klaar. Voor Netlify/Cloudflare Pages staat `_headers` klaar.
