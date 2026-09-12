# ADR-0014: Redactieomgeving voor artikelen en projectupdates

Status: Accepted

Decision owner: site owner / Matthijs

Owner acceptance: Matthijs, 2026-09-09 — expliciet “ja akkoord” en “akkoord met werkpakket” in taak `Beoordeel beheeroptie MVD-site`.

Datum voorstel: 2026-09-09

## ADR lifecycle

Alleen Matthijs mag dit besluit accepteren of vervangen. Zijn expliciete akkoord op het voorgelegde werkpakket is hier vastgelegd; dit is geen zelfstandige acceptatie door Codex. De opdracht autoriseert de hieronder begrensde lokale technische pilot, inclusief dashboard, taken, bestaande bezoekersinformatie en agents/routines. Overzetten van de werkelijke publicatiebron, externe accounts/toegang/kosten en livegang blijven afzonderlijke concrete besluiten.

## Context

Matthijs wil onderzoeken of een overzichtelijke beheeromgeving, geïnspireerd op het ROETZ-beheer, ook voor zijn eigen website nuttig is. Het doel is bestaande inhoud gemakkelijker voorbereiden en beoordelen, met ruimte voor bijdragen van anderen.

De huidige site is statische HTML/CSS/JS. Artikel- en projectkaarten staan in `content.js`; de volledige pagina-inhoud en metadata staan grotendeels in afzonderlijke HTML-bestanden. FAQ's hebben al een centrale bron en statische generator. Een formulier boven alleen `content.js` beheert daarom geen volledige pagina en zou afzonderlijke versies van dezelfde tekst kunnen laten ontstaan.

Bronlaag:

- `AGENTS.md`: structuurwijzigingen, eigenaarbesluiten en publicatiegrenzen.
- `docs/site/CURRENT_SITE_STATE.md`: huidige techniek en concept/public-scheiding.
- `docs/site/PAGE_MODELS.md` en `docs/site/INTERNAL_LINKING_MODEL.md`: paginatypen en doelgroepbewuste koppelingen.
- `docs/site/INVARIANTS.md`, `REDACTIEKOMPAS.md` en `CODEX_WERKWIJZE.md`: persoonlijke positionering, redactionele verantwoordelijkheid en werkcyclus.
- ADR-0004: metadata, vindbaarheid en indexeerbaarheid.
- ADR-0005: broncontrole, medische veiligheid en eigenaarreview.
- ADR-0006: publicatie, verificatie en `PUBLICATIE_REGISTER.json`.
- ADR-0007 en `docs/site/FAQ_CONTENT_MODEL.md`: centrale FAQ-bron en generatie.
- `docs/site/ARTICLE_EDITORIAL_PROFILE.md`: schrijfbasis en onveranderlijke eerste conceptversie.

Dit voorstel bouwt daarop voort. Het accepteert, vervangt of verruimt geen bestaand besluit.

## Decision

Onderstaande keuzes zijn geaccepteerd binnen de lokale pilotscope. Inhoudelijke goedkeuring van individuele pagina's en publieke activering volgen afzonderlijk.

### 1. Begin met één klein redactioneel spoor

De pilot beheert artikelen en nieuwsberichten, waaronder projectupdates als artikel. Een medewerker kan een concept voorbereiden en ter beoordeling aanbieden. Matthijs beoordeelt de inhoud en bepaalt of de exacte versie mag worden gepubliceerd.

Volledige projectpagina's en publicaties kunnen later aansluiten. FAQ's blijven vooralsnog via hun huidige centrale bron lopen. Behandelpagina's, pijnwijzerlogica, navigatie, contact, nieuwsbrief en privacy vallen buiten de eerste pilot. Er komt geen vrije paginabouwer.

### 2. Gebruik per inhoudstype één onderhouden bron

Na acceptatie van dit ADR kiest Codex binnen de pilot een passend bronformaat en bouwt de renderer en controles. Eén kopie van een bestaand artikel wordt in een geïsoleerde lokale proef naar dat bronmodel overgezet. Uit die bron worden de detailpagina, kaarten en metadata gegenereerd met de bestaande vormgeving, routes en URL's. Deze proef maakt de nieuwe bron nog niet leidend voor de publieke website.

Titel, inleiding en tekst worden niet daarnaast zelfstandig in gegenereerde HTML onderhouden. Bewuste verschillen, zoals een kortere kaarttitel of afzonderlijke zoekomschrijving, zijn expliciete redactionele velden in dezelfde bron. Het scherm laat zien waar een afwijking wordt gebruikt; een generator mag die niet stilzwijgend overschrijven.

Relevante bestaande koppelingen, afbeeldingen, bronverwijzingen en FAQ-plaatsingen blijven herkenbaar. Een bestaande FAQ wordt via zijn vaste ID gekoppeld en niet gekopieerd naar een tweede onderhoudsbron. Niet-gemigreerde pagina's behouden hun huidige bron. Per pagina staat vast welke route geldt; dubbel schrijven is niet toegestaan.

### 3. Beoordeel en publiceer een vastgelegde versie

Een revisie heeft een vaste identiteit en een reproduceerbaar overzicht van de betrokken bron, afbeeldingen, FAQ-records, templates, generatorversie en andere afhankelijkheden die de beoordeelde pagina of metadata bepalen. De goedkeuring verwijst naar die versie en de bijbehorende gegenereerde uitvoer.

Latere wijzigingen aan de revisie of deze afhankelijkheden maken het publicatieakkoord ongeldig voor de nieuwe uitvoer. Opnieuw genereren zonder inhoudelijke wijziging is alleen dezelfde versie wanneer de controle op de vastgelegde invoer en uitvoer dat aantoont. Wijzigingen buiten die afhankelijkheden trekken niet willekeurig alle artikelgoedkeuringen in.

Goedkeuring is een handeling van de bevoegde eigenaar met vastgelegde identiteit, tijdstip en versie. Een bewerkbaar vinkje of tekstveld van een redacteur geldt niet als eigenaarakkoord. De goedkeuringsregistratie moet buiten de schrijfrechten van gewone redacteuren worden beschermd.

De bestaande statussen in `PUBLICATIE_REGISTER.json` veranderen niet. Werkstatussen zoals concept en ter beoordeling horen bij de revisie. Ze vervangen niet de registerstatus of het bewijs van feitelijke livegang. Bij een wijziging van een bestaande publieke pagina blijft de huidige goedgekeurde versie live terwijl de nieuwe revisie besloten wordt voorbereid. De registerverwerking voor de nieuwe release blijft onder ADR-0006 vallen.

### 4. Scheid schrijven, goedkeuren en uitvoeren

De voorgestelde rollen zijn:

| Rol | Bevoegdheid |
| --- | --- |
| Redacteur | Toegewezen inhoud voorbereiden, wijzigen en aanbieden; geen eigenaarakkoord of livegang |
| Inhoudelijk eigenaar | Matthijs: wijzigingen bekijken, terugsturen en de exacte inhoud voor publicatie goedkeuren |
| Publicatie-uitvoerder | Alleen een geldige, expliciet vrijgegeven versie na geslaagde controles publiceren; geen inhoudelijk akkoord verlenen |

In de eerste pilot kan Matthijs zowel eigenaar als publicatie-uitvoerder zijn. Het onderscheid blijft bestaan, zodat een technisch uitvoerende rol later geen medische beslissingsmacht krijgt. Identiteit, toegang per collectie/pagina, intrekken van toegang en beveiliging van de publicatieroute moeten met echte afzonderlijke accounts worden getest.

Decap CMS is een kandidaat voor de editor, geen gekozen of geïnstalleerde oplossing voor deze site. Een Git-gebaseerde editor met repository-schrijfrechten geeft niet vanzelf beperkte rechten per pagina. Verborgen velden of collecties in de interface vormen geen toegangsbeveiliging. Directe Git- en API-toegang, goedkeuringsrechten en de route naar de publicatiebranch moeten in de technische proef worden meegenomen. Als gewenste beperkingen niet afdwingbaar zijn, moet de rolverdeling of oplossing eerst opnieuw worden beoordeeld.

### 5. Houd revisies besloten en behandel conflicten expliciet

De echte voorvertoning gebruikt dezelfde bron en rendering als de beoogde publieke pagina, inclusief relevante metadata en koppelingen. Concepttoegang vereist daadwerkelijke toegangscontrole. `noindex`, een lastig te raden URL of het weglaten uit de navigatie beveiligt een concept niet.

Opslaan controleert of de geopende basisversie nog actueel is. Bij een gelijktijdige wijziging volgt een vergelijking en bewuste oplossing; de laatste schrijver overschrijft niet ongemerkt andermans werk. Revisies en acties blijven herleidbaar.

Herstel gebeurt als een nieuwe gecontroleerde bronwijziging met vergelijking, actuele controles en expliciete vrijgave. Een oude HTML-kopie terugplaatsen of een verouderd akkoord hergebruiken is geen herstelroute.

### 6. Behoud de bestaande controles en redactionele leerlus

De publicatieroute moet de bestaande site-, SEO-, publicatie- en waar van toepassing FAQ- en paginatypecontroles uitvoeren. Voorvertoning en mobiele controle horen bij beoordeling van de uiteindelijke uitvoer. Een technische controle kan medische goedkeuring niet vervangen.

Voor een nieuw volledig conceptartikel blijven het redactieprofiel, de vereiste voorbeelden en de bestaande leerlus gelden. De eerste volledige conceptversie wordt onmiddellijk onveranderlijk vastgelegd; een editor mag `first-concept.md` niet vervangen. Definitieve leerversies volgen pas na expliciet eigenaarakkoord. Bij import van bestaande artikelen wordt geen historische eerste conceptversie verzonnen. Leerdossiers blijven buiten deployment en buiten de gewone redacteurstoegang.

### 7. Onderzoek binnen de bestaande hostingcontext

Dit voorstel veronderstelt geen hostingwissel, nieuwe betaalde dienst, nieuw account of nieuwe inschrijving. Login, gedeelde opslag, beveiligde preview en publicatie zijn nog te kiezen en te toetsen binnen de beschikbare omgeving. Eventuele diensten, kosten en beheerlast worden vóór uitvoering concreet voorgelegd.

### 8. Dashboard, taken, agents en routines

Het geaccepteerde werkpakket omvat een lokale startpagina met artikelen, open taken, reviewvoortgang, bestaande Vercel-bezoekersinformatie en een overzicht van agents/routines. De behandelpagina's worden nu alleen gelezen en als werkvoorraad getoond; deze uitbreiding maakt ze niet bewerkbaar of publicatieklaar.

De werkvoorraad volgt het actuele publicatieregister, de bestanden en de launch-inventaris. Een verouderde todo mag eerder expliciet goedgekeurde pagina's niet opnieuw als onbeoordeeld classificeren. Een taak afvinken betekent lokaal 'bekeken'; medische verificatie of publicatierechten veranderen daardoor niet. Bij gewijzigde bron vervalt die leesmarkering.

Automations worden alleen gelezen. Het dashboard onderscheidt ingeschakeld, gepland ritme, laatst aantoonbaar verslag en een momentopname van actieve Codex-taken. Onbekende uitvoeringsstatus of volgende start wordt niet ingevuld op basis van aannames. Een momentopname wordt van een tijdstip voorzien en kan verouderen. Rollen zoals bronredacteur zijn geen bewijs van zelfstandig of voortdurend actieve agents. Volledige prompts, accountgegevens en persoonlijke contactgegevens worden niet overgenomen.

Bezoekersmetingen blijven apart van inhoudsbeheer. De eerste koppeling gebruikt alleen bestaande toegang en geaggregeerde gegevens. Een gedateerde momentopname wordt niet als live teller gepresenteerd; een toekomstige serverkoppeling houdt toegangssleutels buiten de browser. Nieuwe betaalde diensten, credentials of toegang voor andere gebruikers worden niet aangemaakt in deze lokale stap.

### 9. Uitvoeringskeuze voor de lokale pilot

De pilot gebruikt Python met de standaardbibliotheek, een lokale SQLite-bron met onveranderlijke revisies en een kleine browserinterface. De editor en Codex gebruiken dezelfde opslag- en versiecontrole via service/CLI. De server is alleen op loopback beschikbaar en wordt afgeschermd tegen verzoeken vanaf andere websites. Dit is één lokale eigenaarsomgeving; het bewijst geen rechtenmodel voor meerdere mensen of bescherming tegen iemand met toegang tot dezelfde computeraccount.

De volledige map `local-admin/` blijft buiten Vercel-deployment; persoonlijke staat en uitvoerpakketten blijven ook buiten Git. Opslaan maakt geen publieke bestanden aan. Een voorbereid pakket komt alleen in de lokale uitvoermap en moet nog de bestaande publicatieroute doorlopen.

## Consequences

- Redacteuren kunnen inhoud voorbereiden zonder HTML te hoeven bewerken; Matthijs ziet een voorvertoning en de verschillen voordat hij beslist.
- De meeste benodigde werkzaamheden zitten in bronintegratie, versiebeheer, rechten en publicatiecontrole. Een fraai formulier is daarvan slechts de zichtbare voorkant.
- Acceptatie autoriseert de lokale technische pilot: bronformaat kiezen, renderer en tests bouwen en één artikelkopie geïsoleerd omzetten en vergelijken. Gewone correcties en uitbreiding binnen deze geaccepteerde lokale artikelenpilot vragen geen herhaald akkoord per uitvoeringskeuze. De werkelijke publicatiebron blijft daarbij ongewijzigd.
- De huidige [demonstratie](/Users/matthijsvandam/.codex/visualizations/2026/09/09/01a08459-21f4-7713-9789-4ee18917da6b/redactie-ontwerp.html) is een lokaal interactief ontwerp. Titel, inleiding, tekst van drie secties, alternatieve afbeeldingstekst en kaartomschrijving zijn tijdelijk bewerkbaar. Er is een vergelijking per veld en een demonstratie van goedkeuren, terugsturen en vervallen van akkoord na wijziging.
- Die preview benadert de artikelinhoud en vormgeving; navigatie, gerelateerde kaarten en interne tekstlinks zijn geen exacte volledige paginaweergave en SEO-uitvoer wordt niet gerenderd. Afbeelding kiezen, een nieuw artikel maken, login, echte opslag en publicatie zijn niet gebouwd. De demonstratie heeft geen backend; wijzigingen bestaan alleen tijdelijk in het geopende scherm.
- De lokale pilot kan op basis van het gegeven akkoord autonoom worden uitgevoerd. Overgang naar een nieuwe werkelijke publicatiebron, externe accounts/toegangsrechten/kosten en publieke activering worden later als concrete, beoordeelbare stappen voorgelegd.

## What must not change without a new ADR

- Matthijs' inhoudelijke eindverantwoordelijkheid en de grenzen uit ADR-0005 en ADR-0006.
- De betekenis van de bestaande publicatie- en verificatiestatussen.
- De scheiding tussen een besloten revisie en de huidige publieke versie.
- Goedkeuring voor een specifieke versie, inclusief de relevante afhankelijkheden.
- Eén onderhouden bron per gemigreerd inhoudstype en de centrale FAQ-bron.
- Statische publieke uitvoer, bestaande URL's en de afgesproken inhoudelijke/visuele grenzen.

Uitbreiding naar behandelpagina's, pijnwijzer, vrije pagina-indeling, nieuwe publicatiebevoegdheden of een andere hosting-/opslagarchitectuur vraagt een expliciete ADR-check. Als de bestaande besluiten die uitbreiding niet dekken, is een nieuw besluit met `needs owner validation` nodig.

## Vastgelegd eigenaarbesluit en resterende besluiten

Matthijs heeft het werkpakket inclusief dit ADR, dashboard en bestaande analytics goedgekeurd op 9 september 2026. Codex kan de lokale pilot binnen deze scope uitvoeren en verbeteren zonder telkens toestemming voor gewone technische keuzes te vragen. Nieuwe externe accounts, wijzigingen in toegangsrechten, eventuele kosten, het leidend maken van een nieuwe publicatiebron en publieke activering blijven afzonderlijke concrete besluiten. Dit akkoord is geen inhoudelijk akkoord voor gewijzigde of nieuwe medische artikelen.
