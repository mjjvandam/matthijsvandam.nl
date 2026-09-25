# Wat er gebeurt bij één stap

Onderzoeks- en uitvoeringswerkpakket · 25 september 2026 · lokaal concept, medische review nodig.

## Einddoel

Een visueel artikel van ongeveer zes minuten waarin de lezer begrijpt hoe voet, enkel en kuit tijdens lopen samenwerken, wat een loopanalyse zichtbaar kan maken en waarom een bewegingsverschil niet vanzelf de oorzaak van pijn verklaart. De beweging wordt een inhoudelijk gecontroleerde illustratie. Zij is geen diagnose, meetinstrument of demonstratie van een behandeling.

## Leesvolgorde

1. [Onderzoeksdossier](onderzoeksdossier.md): zoekaanpak, bronbeoordeling, conclusies en grenzen.
2. [Beeld- en bewegingsdraaiboek](beeld-en-beweging.md): anatomie, contact met de grond, fasering, scènes, vormgeving en acceptatie.
3. [Artikeltekst](artikeltekst.md): complete eerste tekstversie, met broncodes voor de redactie.
4. [Bouw- en reviewplan](bouw-en-reviewplan.md): stappen van bewijs naar gecontroleerd beeld.

Bibliografische metadata van 25 wetenschappelijke publicaties staan in `bibliografie.json`. Met vijf officiële klinische en opleidingsbronnen bevat het dossier 30 beoordeelde bronnen. `zoeklog-europepmc.json` bewaart de aanvullende zoekvragen en opgehaalde resultaten. `dataset-verkenning.json` bewaart de aangetroffen Figshare-versie en licentie; geselecteerde bewegingsbestanden zijn gedownload en verwerkt; `motion-manifest.json` documenteert de gekozen opname, bewerkingen en grenzen.

## Wat nu wel en niet is afgerond

De gerichte literatuurverkenning, het inhoudelijke beeldplan en een volledige concepttekst zijn uitgewerkt. Dit is geen systematische review. Bij bronnen is aangegeven of volledige tekst, abstract of officiële webinformatie is bekeken. Het draaiboek specificeert wat de animatie moet laten zien; het bewijst nog niet dat een gebouwde animatie dat correct doet.

Het scrollverhaal staat in `index.html`. `rig.html` toont dezelfde beweging zonder anatomische illustratie, met een bedienbare tijdlijn en tien controlebeelden. `renderer.mjs` wordt zowel voor de animatie als de stilstaande beelden gebruikt. De eerdere grove demo blijft alleen een sfeerproef.

Bekijk lokaal: <http://127.0.0.1:8874/concepten/voet-enkel-loopverhaal/index.html>. De acht scènes volgen de vastgelegde tekst. De koppeling voetboog en weefselbeweging is schematisch; zij is geen extra gemeten uitkomst. Zie `verificatie.md` voor controles en resterende medische/anatomische review.

Er is geen nieuwe publieke pagina gemaakt. Homepage, artikeloverzicht, productieassets, metadata, sitemap en publicatieregister zijn voor dit werkpakket niet gewijzigd. Bestaande andere werkboomwijzigingen zijn behouden.

## Sitekader

Doelgroep: algemeen geïnteresseerd publiek en patiënten; verdieping voor professionals via bronnen, zonder de hoofdtekst tot een onderwijsboek te maken. Pijler: voet, enkel en sportletsel. Paginamodel: visueel verklarend artikel, lokaal concept.

ADR-check: ADR-0002, ADR-0005 en ADR-0006 dekken onderwerp, medische grenzen en conceptstatus. Geen nieuw structureel besluit nodig voor deze conceptuitwerking. De pagina-eigen blauw/witte vormgeving volgt de expliciete wens van Matthijs; die verandert de gedeelde site-identiteit niet en is als uitzondering in het designsysteem vastgelegd.

Medische eigenaar-validatie nodig: concepttekst, interpretatie van kuitbeperking, anatomische tekeningen en uiteindelijke beweging. Publicatie valt buiten dit werkpakket.
