# ADR-0009: Hostingroute voor publieke contact- en nieuwsbrieffuncties

Status: Proposed

Decision owner: site owner / Matthijs

Owner validation: needs owner validation

Datum: 2026-09-06

## Aanleiding en vastgesteld bewijs

De website draait op Vercel Hobby en bevat een aanbod voor zelfstandige adviesdiensten. Vercel beperkt Hobby tot niet-commercieel persoonlijk gebruik en noemt het aanbieden van producten of diensten als commercieel gebruik. Daarom kan deze combinatie niet als bevestigde gratis productieroute worden gepresenteerd. Er is geen Pro-abonnement gekocht en geen oordeel over het bestaande account door Vercel Support verkregen.

Brevo-domein en afzender zijn geverifieerd; de eerste mail is door Matthijs ontvangen. De sleutel is met toestemming als Production Secret bij Vercel opgeslagen. De contactroute staat uit. Deze voorbereiding rechtvaardigt geen betaalde upgrade of automatische publieke activering.

## Voorgesteld besluit

Onderzoek en test een gratis hostingmigratie in een afzonderlijke, niet-publieke proef voordat het domein wordt gewijzigd. Voorkeurskandidaat voor een eenvoudig aantoonbaar commercieel toegestaan pakket is Netlify Free. Netlify noemt commerciële projecten expliciet toegestaan op Free; de actuele prijslijst bevat 300 gedeelde credits per maand, functies en basis-rate-limiting. Deze limiet moet eerst tegen reëel verkeer en publicatiefrequentie worden doorgerekend. Een productiedeployment kost 15 credits, bandbreedte 20 credits/GB; twintig deployments zouden zonder verkeer al het hele maandbudget verbruiken. Free is dus geen garantie dat deze site zonder onderbreking binnen het budget blijft.

Cloudflare Workers/Pages Free is een tweede kandidaat, met gratis statische hosting en beperkte functiequota. Dit vraagt een andere backend-adapter, eigen misbruik-/quotacontrole en een aparte controle van accounts, voorwaarden en dataverwerking. Nog geen account of runtime ingericht. Geen claim van kosteloze volledige geschiktheid op basis van alleen een gratis label.

Als nul extra kosten niet haalbaar blijkt met de benodigde beschikbaarheid en privacyafspraken: leg de kleinste betaalde route voor. Niet zelfstandig upgraden. Vercel Pro is het alternatief met de minste wijziging aan de bestaande hosting, maar valt buiten het huidige nulbudget.

## Afbakening migratieproef na akkoord

1. Inventariseer werkelijk maandverkeer, bandbreedte en publicatiefrequentie; zet die af tegen de actuele limieten. Gebruik een expliciete marge en geen aanname dat laag bezoekersaantal gelijkstaat aan weinig verkeer.
2. Maak een expliciete publicatie-allowlist. Kopieer niet blind de volledige repo: .vercelignore is geen uitsluiting op een andere host. Alle conceptpagina's en lokale mailbestanden blijven buiten de upload.
3. Behoud bestaande URL's, redirects, headers, canonicalbeleid, sitemap en publicatieregister. Verifieer de 39 publieke pagina's afzonderlijk.
4. Hergebruik validatie en Brevo-mailstructuur met een dunne hostadapter. Keys uitsluitend in serversecrets. Geen extra abonneedatabase of nieuwe nieuwsbriefstrategie.
5. Vervang Vercel-specifieke firewall en analytics bewust. Test gedeelde misbruikbegrenzing, quota, dubbele verzoeken, foutafhandeling en mailbezorging. Geen volledig dossier of vrije tekst in logs opslaan.
6. Schakel eventuele standaard hostingbadge uit via de officiële instelling; geen visuele toevoeging aan de site zonder keuze van Matthijs.
7. Pas privacy- en leveranciersafspraken aan. DNS-omschakeling en publieke formulieractivering krijgen pas daarna een expliciet akkoord, met terugvalplan naar de huidige host.

## Wat dit voorstel niet autoriseert

Geen hostingmigratie, nieuw account, contractacceptatie, domeinwijziging, betaald product, medische inhoudswijziging of nieuwsbriefverzending. De bestaande Vercel-inrichting blijft behouden tijdens de beoordeling. De site wordt niet inhoudelijk aangepast om een hostingvoorwaarde te omzeilen.

## Bronnen

- Vercel: https://vercel.com/docs/limits/fair-use-guidelines
- Netlify commercieel Free: https://www.netlify.com/blog/introducing-netlify-free-plan/
- Netlify actuele prijs/credits: https://www.netlify.com/pricing/
- Netlify badge uitzetten: https://docs.netlify.com/manage/projects/powered-by-netlify-badge/
- Cloudflare Workers: https://developers.cloudflare.com/workers/platform/pricing/
- Cloudflare Pages: https://developers.cloudflare.com/pages/platform/limits/
- Cloudflare voorwaarden: https://www.cloudflare.com/terms/

Gerelateerd: ADR-0006 (publicatie), ADR-0008 (formulieren en mail). Beiden blijven ongewijzigd leidend.


## Vervolgkeuze 2026-09-06

Matthijs: “werk nog even door onder hobby”. De technische voorbereiding gaat verder op het bestaande Vercel Hobby-pakket. Migratievoorstel geparkeerd; geen upgrade, verhuizing of publiek activeringsbesluit. ADR-0009 blijft Proposed.
