# Tijdelijke websitefeedback — live sinds 24 september 2026

## Doel en bereik

Een rustige, vrijwillige vraag voor bezoekers die vijf verschillende publieke pagina's in hetzelfde browsertabblad hebben bezocht. Een vaste kleine footerlink laat ook andere bezoekers reageren. De campagne loopt tot en met 24 oktober 2026. Daarna verdwijnen de kaart en footerlink vanzelf en stopt `/api/feedback` met het aannemen van berichten. Er komen geen nieuwe accounts, leveranciers, cookies of analyticsgebeurtenissen bij.

De kaart vermeldt dat de site kort geleden is gepubliceerd en vraagt of de content de bezoeker verder heeft geholpen (ja, gedeeltelijk, nee). Zij biedt maximaal 500 tekens optionele toelichting en vraagt geen naam of e-mailadres. De kaart toont geen aparte medische disclaimer; de privacyverklaring houdt de grens voor medische en andere persoonsgegevens vast. De bezoeklijst blijft uitsluitend in `sessionStorage`; de keuze om te sluiten of te verzenden staat in `localStorage` voor deze campagne. Geen bezochte URL of browser-ID wordt meegestuurd met de feedback.

Voor lokale vormcontrole kun je op `127.0.0.1` of `localhost` `?feedback-preview=1` aan een pagina-URL toevoegen. Dat toont de kaart ook wanneer de publieke endpoint nog uit staat. De uitzondering werkt niet op publieke domeinen; lokaal versturen vereist nog steeds een werkende test-API.

## Ontvangst en grens

`/api/feedback` gebruikt de bestaande Brevo-API-sleutel en dezelfde geverifieerde afzender als het contactformulier. Eén antwoord wordt als gewone tekstmail naar de bestaande Gmail-mailbox gestuurd. De handler controleert de herkomst, JSON, een honeypot, keuze, lengte, aanvraag-ID en campagne-einde. Een idempotencyKey beperkt dubbele aflevering bij herhaalde verzoeken. Er is geen aparte opslag of automatisch antwoord.

De bestaande Vercel Hobby-limietregel is op 24 september gepubliceerd met een OR-groep voor `Request Path Starts with /api/contact` en `Request Path Starts with /api/feedback`. De grens bleef vijf verzoeken per IP per 60 seconden, met HTTP 429 als vervolgactie. Er is geen tweede regel, account of betaald plan toegevoegd. De feedbackwidget onthoudt een positieve beschikbaarheidscheck voor de duur van het browsertabblad, zodat vijf paginaweergaven slechts één GET naar deze route doen en de limiet niet opmaken. Een uitgeschakelde route wordt opnieuw gecontroleerd bij een volgende paginaweergave.

De Production-variabelen `FEEDBACK_EDGE_RATE_LIMIT_VERIFIED=true` en `FEEDBACK_FORM_ENABLED=true` zijn ingesteld vóór de nieuwe deployment. De bestaande `BREVO_API_KEY` bleef ongewijzigd. Een 503 van de handler betekent dat de feedbackroute uit staat; de kaart blijft dan verborgen. Na 24 oktober sluit de handler vanzelf en verdwijnen kaart en footerlink. Verwijder de tijdelijke assets en paginaverwijzingen in een latere gecontroleerde release.

De privacytekst moet met de kaart en endpoint tegelijk live gaan. Feedback blijft apart van de nieuwsbrief en het professionele contactformulier. Ontvangen toelichtingen kunnen ongevraagd persoonlijke gegevens bevatten; behandel en verwijder die volgens de privacytekst, zonder medische beantwoording via deze route.

Lokale controle op 24 september: bij navigatie door vijf verschillende publieke pagina's verscheen de kaart na acht seconden op de vijfde pagina; een zesde pagina liet de kaart niet opnieuw automatisch zien. De mockserver ontving één beschikbaarheids-GET voor deze zes pagina's.

Publieke vrijgave op 24 september: de functionele release met commit `be0455e` kreeg een `Ready` Production-deployment op Vercel. `/api/feedback` geeft op de www-host HTTP 200 met `{"enabled":true}`; het apex-domein leidt naar www. `feedback.js`, `feedback.css`, de homepage en de privacyverklaring geven HTTP 200. De live homepage toont de feedbackknop en de goedgekeurde kaarttekst. Eén duidelijk als test gemarkeerd antwoord (`Ja`) werd via de publieke kaart verzonden; de bevestiging verscheen op de site en het bericht met onderwerp `[Websitefeedback] Ja` is in de bestaande Gmail-inbox ontvangen. De sleutelwaarde en het resterende mailquotum zijn niet ingezien.

## Review en vrijgave

ADR-0008 dekt het gebruik van de bestaande maildienst en formuliergrenzen; ADR-0006 dekt de afzonderlijke publieke vrijgave. Matthijs gaf op 24 september expliciet akkoord voor de aangepaste kaart, de bestaande Vercel-limietregel en één proefinzending. Medische pagina-inhoud, robots, sitemap en publicatiestatus zijn niet aangepast. De feedbackfunctie is publiek; latere inhoudelijke uitbreidingen blijven afzonderlijk te beoordelen.
