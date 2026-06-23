import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve(import.meta.dirname, "..");
const contentPath = path.join(root, "content.js");
const treatmentsDir = path.join(root, "behandelingen");

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const sentence = (value) => String(value || "").replace(/\s+/g, " ").trim();

const pageSpecs = {
  "jicht-podagra": {
    category: "Voorvoet",
    h1: "Jicht en podagra rond de grote teen",
    summary: [
      "Aanvallen met pijn, roodheid en zwelling rond de grote teen kunnen bij jicht passen.",
      "Andere oorzaken, zoals infectie, artrose of letsel, moeten in de juiste context worden meegewogen.",
      "Bij hevige acute klachten of ziek zijn is beoordeling via de juiste zorgroute belangrijk.",
    ],
    what: "Jicht is een ontstekingsreactie in of rond een gewricht. Podagra is de naam die vaak wordt gebruikt wanneer zo'n aanval rond het grote-teengewricht optreedt.",
    symptoms: "De pijn kan plots beginnen en samengaan met roodheid, warmte, zwelling en drukpijn. Soms is aanraken of een schoen dragen al gevoelig.",
    differential: "Niet iedere rode of gezwollen teen is jicht. Infectie, artrose, een wondje, letsel of andere ontstekingsbeelden kunnen erop lijken.",
    assessment: "De beoordeling hangt af van het verhaal, lichamelijk onderzoek, medicatie, eerdere aanvallen en soms bloedonderzoek of beeldvorming.",
    conservative: "Algemene maatregelen kunnen gaan over ontlasting, schoenruimte, medicatie via de eigen behandelaar en aandacht voor uitlokkende factoren.",
    specialist: "Orthopedische beoordeling is vooral relevant als er twijfel is over de oorzaak, blijvende gewrichtsschade of een andere voet- of teenaandoening.",
  },
  metatarsalgie: {
    category: "Voorvoet",
    h1: "Metatarsalgie: pijn onder de bal van de voet",
    summary: [
      "Metatarsalgie beschrijft pijn onder de bal van de voet.",
      "Drukverdeling, voetstand, schoenen, belasting en teenstand kunnen meespelen.",
      "De precieze oorzaak verschilt per persoon en vraagt context.",
    ],
    what: "Metatarsalgie is geen enkele diagnose, maar een beschrijvende term voor pijn rond de kopjes van de middenvoetsbeentjes.",
    symptoms: "Klachten zitten vaak onder de voorvoet en nemen toe bij staan, lopen of schoenen met weinig demping. Soms voelt het alsof er op een steentje wordt gelopen.",
    differential: "Morton neuroom, plantaire plaatklachten, stressreactie, sesamoidklachten en teenstandafwijkingen kunnen overlappende klachten geven.",
    assessment: "Onderzoek richt zich op de plek van de drukpijn, eelt, teenstand, voetboog, schoenbelasting en soms aanvullende beeldvorming.",
    conservative: "Niet-operatieve opties kunnen bestaan uit schoenadvies, drukverdeling, zoolaanpassing, aanpassing van belasting en behandeling van onderliggende factoren.",
    specialist: "Specialistische beoordeling kan passen bij aanhoudende pijn, duidelijke standsafwijking, verdenking op letsel of onvoldoende effect van drukontlasting.",
  },
  "morton-neuroom": {
    category: "Voorvoet",
    h1: "Morton neuroom: zenuwklachten in de voorvoet",
    summary: [
      "Een Morton neuroom kan pijn, tintelingen of uitstraling richting tenen geven.",
      "De klachten zitten vaak tussen de middenvoetsbeentjes.",
      "De gids kan dit niet onderscheiden van andere oorzaken van voorvoetpijn.",
    ],
    what: "Bij een Morton neuroom is er irritatie of verdikking rond een zenuw tussen de middenvoetsbeentjes. De naam wordt vaak gebruikt bij brandende of uitstralende voorvoetklachten.",
    symptoms: "Klachten kunnen brandend, stekend of tintelend zijn en soms naar twee tenen uitstralen. Strakke schoenen of langdurig lopen kunnen de klachten versterken.",
    differential: "Metatarsalgie, MTP-klachten, stressreacties en teenstandafwijkingen kunnen vergelijkbare voorvoetpijn geven.",
    assessment: "De beoordeling bestaat uit het klachtenpatroon, onderzoek van de voorvoet, schoenfactoren en soms echografie of MRI wanneer dat nodig is.",
    conservative: "Vaak wordt eerst gekeken naar schoenruimte, drukontlasting, zoolaanpassing en belasting. Injectie of operatie is niet automatisch de eerste stap.",
    specialist: "Beoordeling kan zinvol zijn bij aanhoudende uitstralende pijn, duidelijke beperking of twijfel tussen zenuw-, gewrichts- en drukklachten.",
  },
  "mtp-plantaire-plaatklachten": {
    category: "Voorvoet",
    h1: "MTP- en plantaire plaatklachten",
    summary: [
      "Pijn rond de basis van de tenen kan met het MTP-gewricht of de plantaire plaat samenhangen.",
      "Instabiliteit, druk en teenstand zijn belangrijke aandachtspunten.",
      "De juiste duiding vraagt lichamelijk onderzoek.",
    ],
    what: "De MTP-gewrichten verbinden de tenen met de middenvoetsbeentjes. De plantaire plaat helpt het gewricht aan de onderzijde te stabiliseren.",
    symptoms: "Klachten kunnen zitten onder of rond de basis van een teen, soms met zwelling, drukpijn of het gevoel dat een teen minder stabiel staat.",
    differential: "Metatarsalgie, Morton neuroom, hamerteen, stressletsel en artrose kunnen deels dezelfde regio klachten geven.",
    assessment: "Onderzoek kijkt naar drukpijn, beweeglijkheid, stand van de teen, stabiliteit en de belasting van de voorvoet.",
    conservative: "Niet-operatieve zorg kan gericht zijn op drukontlasting, taping, zoolaanpassing, schoenadvies en het verminderen van provocerende belasting.",
    specialist: "Specialistische beoordeling kan nodig zijn bij toenemende teenstand, verdenking op instabiliteit of aanhoudende pijn ondanks gerichte maatregelen.",
  },
  "tailors-bunion": {
    category: "Voorvoet",
    h1: "Tailor's bunion: pijn aan de buitenzijde van de voorvoet",
    summary: [
      "Een tailor's bunion geeft vaak druk rond het vijfde middenvoetsbeentje.",
      "Schoendruk en voetvorm spelen vaak een rol.",
      "Operatie is alleen een optie bij zorgvuldig geselecteerde klachten.",
    ],
    what: "Een tailor's bunion, ook bunionette genoemd, is een pijnlijke prominentie aan de buitenzijde van de voorvoet bij de kleine teen.",
    symptoms: "De plek kan rood, gevoelig of verdikt worden door schoendruk. Soms is er pijn bij lopen of eeltvorming aan de buitenrand.",
    differential: "Drukklachten door schoenen, huidproblemen, slijmbeursirritatie, teenstand en algemene voorvoetbelasting kunnen meespelen.",
    assessment: "Beoordeling gaat over de plek van de druk, schoenruimte, stand van het vijfde middenvoetsbeentje en eventuele huidproblemen.",
    conservative: "Ruimere schoenen, bescherming, zoolaanpassing en drukvermindering zijn vaak de eerste stap.",
    specialist: "Bij blijvende pijn, huidproblemen of duidelijke standsafwijking kan orthopedische beoordeling passend zijn.",
  },
  sesamoidklachten: {
    category: "Voorvoet",
    h1: "Sesamoidklachten onder de grote teen",
    summary: [
      "Sesamoidklachten geven pijn onder het grote-teengewricht.",
      "Afwikkeling, drukverdeling en belasting zijn belangrijk.",
      "Andere oorzaken van pijn onder de grote teen moeten worden uitgesloten.",
    ],
    what: "Sesamoïden zijn kleine botjes onder het grote-teengewricht. Ze helpen bij de afwikkeling en vangen druk op.",
    symptoms: "Pijn zit vaak onder het grote-teengewricht en kan toenemen bij afzetten, sporten, springen of schoenen met weinig demping.",
    differential: "Hallux rigidus, peesirritatie, drukklachten, stressreactie en letsel kunnen vergelijkbare pijn geven.",
    assessment: "De beoordeling kijkt naar exacte drukpijn, beweeglijkheid van de grote teen, voetstand, belasting en soms beeldvorming.",
    conservative: "Maatregelen zijn meestal gericht op ontlasting, schoenadvies, zoolaanpassing en tijdelijk aanpassen van sport of belasting.",
    specialist: "Specialistische beoordeling kan passen bij langdurige pijn, duidelijke sportbeperking of verdenking op bot- of gewrichtsletsel.",
  },
  voorvoetcorrectie: {
    category: "Voorvoet",
    h1: "Voorvoetcorrectie bij standsafwijkingen",
    summary: [
      "Voorvoetcorrectie is een verzamelnaam voor operaties aan tenen of middenvoetsbeentjes.",
      "De indicatie hangt af van pijn, druk, stand, huid en eerdere niet-operatieve maatregelen.",
      "Een operatie wordt niet alleen op basis van het uiterlijk besproken.",
    ],
    what: "Een voorvoetcorrectie kan gericht zijn op de grote teen, kleine tenen of middenvoetsbeentjes. Het doel is meestal druk en pijn verminderen door stand of belasting te verbeteren.",
    symptoms: "Klachten kunnen bestaan uit schoenproblemen, drukplekken, eelt, teenstandafwijkingen of pijn onder de bal van de voet.",
    differential: "Voorvoetpijn kan veel oorzaken hebben. De vraag is steeds welk gewricht, welk bot en welke belasting de klachten veroorzaakt.",
    assessment: "Voor een indicatie zijn lichamelijk onderzoek, belastingsfoto's en bespreking van verwachtingen belangrijk.",
    conservative: "Vaak wordt eerst gekeken naar schoenen, bescherming, podotherapie, zoolaanpassing of aanpassen van belasting.",
    specialist: "Een operatie kan worden besproken wanneer klachten duidelijk zijn, niet-operatieve opties onvoldoende helpen en de verwachting realistisch is.",
  },
  enkelverzwikking: {
    category: "Enkel",
    h1: "Enkelverzwikking: pijn na het door de enkel gaan",
    summary: [
      "Na een enkelverzwikking kunnen pijn, zwelling en onzekerheid tijdelijk blijven bestaan.",
      "De meeste verzwikkingen worden niet geopereerd.",
      "Aanhoudende klachten kunnen wel reden zijn voor beoordeling.",
    ],
    what: "Een enkelverzwikking ontstaat meestal wanneer de voet naar binnen klapt en de banden aan de buitenzijde van de enkel worden opgerekt of beschadigd.",
    symptoms: "Pijn, zwelling, blauwe verkleuring en onzeker lopen komen vaak voor. Soms blijft er later pijn, stijfheid of doorzwikken bestaan.",
    differential: "Naast bandletsel kunnen botletsel, kraakbeenletsel, peesklachten of een breuk vergelijkbare klachten geven.",
    assessment: "Beoordeling hangt af van het moment na het letsel, belastbaarheid, zwelling, drukpijn en eventueel beeldvorming.",
    conservative: "Niet-operatieve zorg bestaat vaak uit bescherming, geleidelijke belasting, oefentherapie en herstel van kracht, balans en vertrouwen.",
    specialist: "Beoordeling is passend bij forse klachten, niet kunnen belasten, verdenking op breuk of aanhoudende instabiliteit.",
  },
  "chronische-enkelinstabiliteit": {
    category: "Enkel",
    h1: "Chronische enkelinstabiliteit",
    summary: [
      "Chronische enkelinstabiliteit betekent dat de enkel blijft doorzwikken of onzeker voelt.",
      "Oefentherapie is vaak een belangrijke eerste stap.",
      "Operatie is selectief en vraagt zorgvuldige indicatiestelling.",
    ],
    what: "Na enkelbandletsel kunnen banden, spiercontrole en balans onvoldoende herstellen. Daardoor kan de enkel instabiel blijven aanvoelen.",
    symptoms: "Mensen beschrijven doorzwikken, onzekerheid op ongelijke ondergrond, sportbeperkingen of terugkerende verzwikkingen.",
    differential: "Peesproblemen, kraakbeenletsel, voetstand, zenuwklachten of pijnvermijding kunnen het beeld beïnvloeden.",
    assessment: "Onderzoek kijkt naar stabiliteit, stand, kracht, balans, eerdere verzwikkingen en soms aanvullende beeldvorming.",
    conservative: "Gerichte oefentherapie, balans, kracht en sportopbouw zijn meestal essentieel. Een brace of tape kan soms tijdelijk helpen.",
    specialist: "Specialistische beoordeling kan passen bij blijvend doorzwikken ondanks goede revalidatie of bij verdenking op bijkomend letsel.",
  },
  "anterieur-enkel-impingement": {
    category: "Enkel",
    h1: "Anterieur enkelimpingement: inklemming aan de voorzijde",
    summary: [
      "Anterieure inklemmingsklachten zitten aan de voorzijde van de enkel.",
      "Pijn kan optreden bij buigen, belasten of sporten.",
      "De gids kan niet bepalen of er daadwerkelijk inklemming is.",
    ],
    what: "Bij anterieur enkelimpingement is er pijn of blokkadegevoel aan de voorzijde van de enkel, soms door botaanwas, littekenweefsel of irritatie na eerder letsel.",
    symptoms: "Klachten kunnen ontstaan bij diepe buiging van de enkel, traplopen, hurken, hardlopen of sporten.",
    differential: "Kraakbeenletsel, corpus liberum, artrose, peesklachten of bandletsel kunnen vergelijkbare pijn geven.",
    assessment: "Onderzoek kijkt naar bewegingsbeperking, drukpijn, stabiliteit, voorgeschiedenis en vaak beeldvorming.",
    conservative: "Aanpassen van belasting, oefentherapie, mobiliteit, schoen- of sportaanpassingen kunnen onderdeel zijn van de eerste aanpak.",
    specialist: "Bij aanhoudende mechanische klachten of duidelijke beperking kan specialistische beoordeling en soms kijkoperatie worden besproken.",
  },
  "posterieur-enkel-impingement": {
    category: "Enkel",
    h1: "Posterieur enkelimpingement: pijn achter in de enkel",
    summary: [
      "Posterieur enkelimpingement geeft pijn achter in de enkel.",
      "Het komt soms naar voren bij sport, dans of diepe buiging.",
      "Os trigonum kan hierbij een rol spelen, maar is niet altijd de oorzaak.",
    ],
    what: "Posterieur enkelimpingement betekent dat structuren achter in de enkel geïrriteerd of ingeklemd kunnen raken bij bepaalde bewegingen.",
    symptoms: "Pijn ontstaat vaak bij spitsen van de voet, afzetten, springen, dans of sportbelasting.",
    differential: "Achillespeesklachten, Haglund-klachten, os trigonum, gewrichtsklachten en peesirritatie kunnen overlappen.",
    assessment: "Beoordeling kijkt naar bewegingsprovocatie, sportbelasting, drukpijn, pezen en beeldvorming wanneer nodig.",
    conservative: "Rustiger opbouwen, aanpassing van sportbelasting, oefentherapie en soms gerichte behandeling van irritatie kunnen worden besproken.",
    specialist: "Bij blijvende mechanische pijn of sportbeperking kan orthopedische beoordeling passend zijn.",
  },
  "ganglion-enkel": {
    category: "Enkel",
    h1: "Ganglion rond de enkel",
    summary: [
      "Een ganglion is een met vocht gevulde zwelling.",
      "Rond de enkel kan het druk, irritatie of onzekerheid geven.",
      "Niet elke zwelling is een ganglion.",
    ],
    what: "Een ganglion is meestal een goedaardige zwelling met geleiachtig vocht die bij een gewricht of peesschede kan ontstaan.",
    symptoms: "Klachten hangen af van plek en grootte: druk in schoenen, lokale pijn, zichtbare zwelling of irritatie bij bewegen.",
    differential: "Andere zwellingen, slijmbeursirritatie, peesproblemen, cysten of zeldzamere oorzaken moeten soms worden onderscheiden.",
    assessment: "Onderzoek kijkt naar locatie, beweeglijkheid, huid, relatie met pezen of gewricht en soms echografie of MRI.",
    conservative: "Als klachten mild zijn, kan afwachten of drukvermindering passend zijn. Prikken of opereren is niet altijd nodig.",
    specialist: "Beoordeling is zinvol bij groei, pijn, twijfel over de aard van de zwelling of duidelijke hinder.",
  },
  peroneuspeesklachten: {
    category: "Enkel",
    h1: "Peroneuspeesklachten aan de buitenzijde",
    summary: [
      "Peroneuspeesklachten geven vaak pijn aan de buitenzijde van voet of enkel.",
      "Ze kunnen samenhangen met sport, voetstand of eerder verzwikken.",
      "De precieze peesstructuur moet bij onderzoek worden beoordeeld.",
    ],
    what: "De peroneuspezen lopen achter de buitenenkel en langs de buitenzijde van de voet. Ze helpen bij stabiliteit en sturen van de voet.",
    symptoms: "Pijn zit vaak achter of onder de buitenenkel, soms met zwelling, knappen of gevoeligheid bij zijwaartse belasting.",
    differential: "Enkelbandletsel, sinus tarsi-klachten, stressletsel, gewrichtsklachten of voetstand kunnen erop lijken.",
    assessment: "Onderzoek richt zich op peesverloop, kracht, stand, stabiliteit en soms echografie of MRI.",
    conservative: "Belasting aanpassen, oefentherapie, schoen- of zoolaanpassing en herstel van stabiliteit kunnen een rol spelen.",
    specialist: "Specialistische beoordeling kan passen bij aanhoudende pijn, verdenking op peesscheur of instabiliteit van de pees.",
  },
  "sinus-tarsi-klachten": {
    category: "Achtervoet",
    h1: "Sinus tarsi-klachten aan de buitenzijde van de achtervoet",
    summary: [
      "Sinus tarsi-klachten zitten vaak aan de buitenzijde van de achtervoet.",
      "Eerder verzwikken, voetstand en belasting kunnen meespelen.",
      "Het is een beschrijving van een pijnregio, geen zekerheid over de oorzaak.",
    ],
    what: "De sinus tarsi is een ruimte aan de buitenzijde van de achtervoet, tussen enkel en hielbeen. Irritatie daar kan pijn geven bij belasting.",
    symptoms: "Pijn zit vaak voor of onder de buitenenkel en kan toenemen op ongelijke ondergrond of na verzwikken.",
    differential: "Enkelinstabiliteit, peroneuspeesklachten, subtalaire gewrichtsklachten en voetstand kunnen vergelijkbare klachten geven.",
    assessment: "Beoordeling kijkt naar stand van de achtervoet, stabiliteit, drukpijn, bewegelijkheid en voorgeschiedenis.",
    conservative: "Oefentherapie, stabiliteit, zoolaanpassing, schoenadvies en belastingopbouw kunnen worden besproken.",
    specialist: "Bij aanhoudende pijn of verdenking op gewrichts- of standproblematiek kan specialistische beoordeling zinvol zijn.",
  },
  "os-trigonum": {
    category: "Enkel",
    h1: "Os trigonum en pijn achter in de enkel",
    summary: [
      "Een os trigonum is een extra botje achter het sprongbeen.",
      "Het kan klachten geven bij diepe buiging, maar is vaak ook een toevalsbevinding.",
      "De klacht en het onderzoek bepalen de betekenis.",
    ],
    what: "Een os trigonum is een botvariant achter in de enkel. Het is op zichzelf niet altijd ziekmakend.",
    symptoms: "Klachten kunnen optreden bij spitsen van de voet, dans, voetbal, springen of andere bewegingen waarbij de achterkant van de enkel wordt belast.",
    differential: "Posterieur impingement, Achillespeesklachten, FHL-peesklachten en gewrichtsproblemen kunnen overlappende pijn geven.",
    assessment: "Onderzoek kijkt naar provocerende bewegingen, drukpijn, sportbelasting en beeldvorming.",
    conservative: "Aanpassing van belasting, oefentherapie en rustiger opbouw kunnen eerst worden geprobeerd wanneer dat passend is.",
    specialist: "Bij aanhoudende mechanische klachten kan specialistische beoordeling en soms gerichte operatieve behandeling worden besproken.",
  },
  enkelartrose: {
    category: "Enkel",
    h1: "Artrose van de enkel",
    summary: [
      "Enkelartrose kan pijn, stijfheid en zwelling geven.",
      "Eerder letsel of standafwijking kan een rol spelen.",
      "Behandeling hangt af van klachten, stand, functie en beeldvorming.",
    ],
    what: "Artrose van de enkel betekent dat het kraakbeen van het enkelgewricht is aangedaan. Dit kan het bewegen en belasten van de enkel pijnlijk maken.",
    symptoms: "Klachten zijn vaak pijn bij lopen, startstijfheid, zwelling, verminderde beweeglijkheid en moeite met langere belasting.",
    differential: "Kraakbeenletsel, impingement, peesklachten, ontsteking en pijn na een breuk kunnen erop lijken.",
    assessment: "Onderzoek en röntgenfoto's helpen om artrose, stand en ernst te beoordelen. Soms is aanvullende beeldvorming nodig.",
    conservative: "Niet-operatieve opties kunnen bestaan uit schoenaanpassing, brace, fysiotherapie, pijnstilling via de eigen behandelaar en belasting aanpassen.",
    specialist: "Bij ernstige beperkingen kan beoordeling gaan over operatieve mogelijkheden zoals standcorrectie, artrodese of in geselecteerde situaties een prothese.",
  },
  "kraakbeenletsel-enkel": {
    category: "Enkel",
    h1: "Kraakbeenletsel van de enkel",
    summary: [
      "Kraakbeen-botletsel in de enkel kan pijn, zwelling of blokkeren geven.",
      "Het ontstaat soms na een verzwikking of ander letsel.",
      "De betekenis hangt af van plek, grootte en klachten.",
    ],
    what: "Kraakbeenletsel van de enkel gaat vaak over beschadiging van kraakbeen en onderliggend bot in het sprongbeen of enkelgewricht.",
    symptoms: "Klachten kunnen bestaan uit diepe enkelpijn, zwelling na belasting, haperen, blokkeren of onzekerheid.",
    differential: "Enkelinstabiliteit, impingement, corpus liberum, artrose en peesklachten kunnen vergelijkbare symptomen geven.",
    assessment: "Beoordeling combineert het verhaal, lichamelijk onderzoek, röntgenfoto's en soms MRI of CT.",
    conservative: "Niet-operatieve behandeling kan bestaan uit belasting aanpassen, oefentherapie en opbouw afhankelijk van klachten en letsel.",
    specialist: "Specialistische beoordeling is zinvol bij aanhoudende diepe pijn, zwelling, blokkeren of verdenking op los fragment.",
  },
  "corpus-liberum-enkel": {
    category: "Enkel",
    h1: "Corpus liberum in de enkel",
    summary: [
      "Een corpus liberum is een los fragment in of rond het gewricht.",
      "Het kan mechanische klachten geven, zoals blokkeren of haperen.",
      "De diagnose vraagt onderzoek en meestal beeldvorming.",
    ],
    what: "Een corpus liberum is een los stukje bot, kraakbeen of kalkachtig materiaal dat in het enkelgewricht kan bewegen.",
    symptoms: "Klachten kunnen bestaan uit plots haperen, slotklachten, zwelling na belasting of diepe pijn in de enkel.",
    differential: "Kraakbeenletsel, impingement, artrose en peesklachten kunnen mechanische klachten nabootsen.",
    assessment: "Beoordeling vraagt een precies klachtenverhaal, lichamelijk onderzoek en vaak röntgenfoto, CT of MRI.",
    conservative: "Als klachten beperkt zijn, kan soms worden afgewacht of belasting worden aangepast. Bij echte blokkeringen is dat anders.",
    specialist: "Specialistische beoordeling kan passend zijn bij slotklachten, herhaald blokkeren of verdenking op een los fragment.",
  },
  "platvoet-volwassen": {
    category: "Achtervoet",
    h1: "Platvoet bij volwassenen",
    summary: [
      "Een platvoet bij volwassenen kan pijn aan binnenzijde voet of enkel geven.",
      "Voetstand, pezen en belastbaarheid zijn belangrijk.",
      "Niet iedere lage voetboog is een probleem.",
    ],
    what: "Bij een platvoet zakt de voetboog meer door. Bij volwassenen kan dit soepel of stijver zijn en soms samenhangen met peesproblemen of artrose.",
    symptoms: "Klachten kunnen zitten langs de binnenzijde van voet of enkel, met vermoeidheid, moeite met lange afstanden of verandering van voetstand.",
    differential: "Tibialis posterior-peesklachten, artrose, voetboogbelasting en algemene standsvariatie kunnen overlappen.",
    assessment: "Onderzoek kijkt naar soepelheid, hielstand, peesfunctie, slijtage, schoenen en belastingsfoto's.",
    conservative: "Schoenadvies, zoolaanpassing, oefentherapie en belasting aanpassen kunnen belangrijk zijn.",
    specialist: "Bij toenemende standverandering, pijn of beperkingen kan specialistische beoordeling zinvol zijn.",
  },
  "tibialis-posterior-peesklachten": {
    category: "Achtervoet",
    h1: "Tibialis posterior-peesklachten",
    summary: [
      "Deze pees ondersteunt de binnenzijde van de voetboog.",
      "Klachten kunnen pijn aan binnenzijde voet of enkel geven.",
      "Voetstand en peesfunctie moeten samen worden beoordeeld.",
    ],
    what: "De tibialis posteriorpees loopt achter de binnenenkel en helpt de voetboog ondersteunen.",
    symptoms: "Pijn of zwelling kan achter de binnenenkel of langs de binnenzijde van de voet zitten. Soms verandert de voetstand langzaam.",
    differential: "Platvoet, artrose, peesirritatie, bandproblemen of andere binnenzijde-enkelklachten kunnen op elkaar lijken.",
    assessment: "Beoordeling richt zich op peesfunctie, voetstand, kracht, soepelheid en soms beeldvorming.",
    conservative: "Zoolaanpassing, brace, oefentherapie, schoenadvies en belasting aanpassen kunnen onderdeel zijn van de behandeling.",
    specialist: "Specialistische beoordeling kan passen bij toenemende platvoetstand, pijn ondanks maatregelen of verdenking op peesschade.",
  },
  "holvoet-cavovarus": {
    category: "Achtervoet",
    h1: "Holvoet en cavovarus",
    summary: [
      "Een holvoet heeft een hoge voetboog en soms kanteling van de achtervoet.",
      "Dit kan drukplekken, buitenzijdepijn of enkelinstabiliteit geven.",
      "De oorzaak en soepelheid verschillen per persoon.",
    ],
    what: "Bij een holvoet is de voetboog hoog. Bij cavovarus kantelt de achtervoet vaak meer naar buiten, waardoor de belasting verandert.",
    symptoms: "Klachten kunnen bestaan uit druk onder de voorvoet of hiel, pijn aan de buitenzijde, eelt, schoenproblemen of doorzwikken.",
    differential: "Enkelinstabiliteit, peroneuspeesklachten, stressklachten en algemene voetvorm spelen vaak door elkaar.",
    assessment: "Onderzoek kijkt naar stand, soepelheid, spierbalans, neurologische voorgeschiedenis, schoenen en belastingsfoto's.",
    conservative: "Zoolaanpassing, schoenadvies, oefentherapie en stabiliteitstraining kunnen worden besproken.",
    specialist: "Bij duidelijke standproblematiek, progressie of blijvende beperkingen kan specialistische beoordeling nodig zijn.",
  },
  achillespeesklachten: {
    category: "Achtervoet",
    h1: "Achillespeesklachten",
    summary: [
      "Achillespeesklachten kunnen in de pees of bij de aanhechting zitten.",
      "Belasting, opbouw, schoenen en kuitfunctie spelen vaak mee.",
      "Herstel vraagt vaak tijd en gerichte opbouw.",
    ],
    what: "De achillespees verbindt de kuitspieren met het hielbeen. Klachten kunnen in het middendeel van de pees of bij de aanhechting ontstaan.",
    symptoms: "Pijn kan optreden bij opstarten, traplopen, hardlopen of springen. Soms is er verdikking, stijfheid of gevoeligheid bij knijpen.",
    differential: "Haglund-klachten, slijmbeursirritatie, posterieur impingement en kuit- of hielproblemen kunnen overlappen.",
    assessment: "Beoordeling kijkt naar plek van de pijn, peeskwaliteit, kracht, bewegelijkheid, trainingsopbouw en soms echografie of MRI.",
    conservative: "Belasting aanpassen, oefentherapie, kuitopbouw, schoenadvies en tijd zijn vaak belangrijk. Injecties of operatie zijn niet standaard.",
    specialist: "Specialistische beoordeling kan passen bij langdurige klachten, duidelijke functieverlies of verdenking op scheur of ernstige peesverandering.",
  },
  hielpijn: {
    category: "Achtervoet",
    h1: "Hielpijn: pijn onder of achter de hiel",
    summary: [
      "Hielpijn is een klachtregio, geen diagnose.",
      "De plek onder of achter de hiel geeft richting.",
      "Peesplaat, vetkussen, Achilles en schoendruk kunnen allemaal meespelen.",
    ],
    what: "Hielpijn kan onder de hiel, achter de hiel of meer rondom de achtervoet zitten. De oorzaak verschilt per plek en belasting.",
    symptoms: "Onderhielpijn geeft vaak startpijn of pijn bij staan. Achterhielpijn kan te maken hebben met de achillespeesaanhechting of schoendruk.",
    differential: "Peesplaatklachten, vetkussenklachten, Haglund, Achillespeesklachten, stressletsel en zenuwklachten kunnen overlappen.",
    assessment: "Onderzoek kijkt naar exacte plek, startpijn, schoendruk, voetstand, pezen en soms beeldvorming.",
    conservative: "Schoenadvies, belasting aanpassen, rek- of oefenprogramma, zoolaanpassing en tijd kunnen onderdeel zijn van de aanpak.",
    specialist: "Beoordeling is passend bij aanhoudende pijn, nachtelijke pijn, verdenking op stressletsel of duidelijke beperkingen.",
  },
  "peesplaatklachten-hielspoor": {
    category: "Achtervoet",
    h1: "Peesplaatklachten en hielspoor",
    summary: [
      "Pijn onder de hiel wordt vaak peesplaatklacht of fasciitis plantaris genoemd.",
      "Een hielspoor op een foto verklaart klachten niet altijd.",
      "Startpijn en belasting zijn belangrijke aanknopingspunten.",
    ],
    what: "De peesplaat loopt onder de voet van hiel naar voorvoet. Irritatie bij de aanhechting onder de hiel kan pijn geven.",
    symptoms: "Vaak is er pijn bij de eerste stappen na rust of bij lang staan. De pijn zit meestal onder of iets aan de binnenzijde van de hiel.",
    differential: "Vetkussenklachten, stressletsel, zenuwklachten en andere hielproblemen kunnen vergelijkbare pijn geven.",
    assessment: "Beoordeling gebeurt op basis van plek, startpijn, drukpijn, belasting, voetstand en soms beeldvorming.",
    conservative: "Meestal wordt gestart met uitleg, belasting aanpassen, rek- en oefenprogramma, schoenadvies en eventueel zoolaanpassing.",
    specialist: "Specialistische beoordeling kan zinvol zijn bij langdurige klachten, atypisch beloop of twijfel over de oorzaak.",
  },
  "vetkussen-hielklachten": {
    category: "Achtervoet",
    h1: "Vetkussenklachten onder de hiel",
    summary: [
      "Het vetkussen onder de hiel vangt druk op.",
      "Klachten kunnen direct onder de hiel zitten bij staan of harde ondergrond.",
      "Dit verschilt van klassieke peesplaatklachten.",
    ],
    what: "Het vetkussen onder de hiel werkt als demping. Bij irritatie of verminderde demping kan drukpijn ontstaan.",
    symptoms: "Pijn zit vaak midden onder de hiel en neemt toe bij lang staan, harde ondergrond of dunne schoenen.",
    differential: "Peesplaatklachten, stressletsel, zenuwklachten en algemene hielpijn kunnen erop lijken.",
    assessment: "Onderzoek kijkt naar de exacte pijnplek, demping, huid, schoenbelasting en provocerende omstandigheden.",
    conservative: "Demping, schoenadvies, hak- of zoolaanpassing en vermijden van harde belasting kunnen helpen om druk te verminderen.",
    specialist: "Specialistische beoordeling kan passen bij aanhoudende pijn of wanneer de oorzaak niet duidelijk is.",
  },
  "haglund-retrocalcaneaire-klachten": {
    category: "Achtervoet",
    h1: "Haglund- en slijmbeursklachten achter de hiel",
    summary: [
      "Pijn achter op de hiel kan met schoendruk, slijmbeurs of achillespeesaanhechting samenhangen.",
      "Een Haglund-vorm is niet altijd de enige oorzaak.",
      "De plek van pijn en de relatie met schoenen zijn belangrijk.",
    ],
    what: "Haglund wordt vaak gebruikt voor een benige vorm aan de achter-bovenzijde van het hielbeen die kan drukken bij schoenen.",
    symptoms: "Klachten bestaan uit pijn achter op de hiel, roodheid, zwelling, schoendruk of irritatie bij lopen.",
    differential: "Achillespeesaanhechtingsklachten, slijmbeursirritatie, posterieur impingement en huiddruk kunnen overlappen.",
    assessment: "Onderzoek kijkt naar schoendruk, peesaanhechting, slijmbeurs, hielvorm en soms röntgenfoto of echo.",
    conservative: "Schoenaanpassing, drukvermindering, belasting aanpassen en oefentherapie kunnen worden besproken.",
    specialist: "Bij aanhoudende hinder of peesaanhechtingsproblemen kan specialistische beoordeling zinvol zijn.",
  },
  "tarsal-boss": {
    category: "Middenvoet",
    h1: "Tarsal boss: benige verdikking op de wreef",
    summary: [
      "Een tarsal boss is een benige verdikking bovenop de middenvoet of wreef.",
      "Klachten ontstaan vaak door schoendruk.",
      "Niet elke verdikking hoeft behandeld te worden.",
    ],
    what: "Een tarsal boss is een lokale benige prominentie, vaak bij gewrichten bovenop de middenvoet.",
    symptoms: "Klachten bestaan uit druk in schoenen, pijn bovenop de voet, roodheid of irritatie van huid of pezen.",
    differential: "Ganglion, artrose, peesirritatie en schoendruk zonder benige afwijking kunnen vergelijkbaar aanvoelen.",
    assessment: "Beoordeling kijkt naar de plek, hardheid, relatie met schoenen, huid en eventueel röntgenfoto.",
    conservative: "Schoenaanpassing, vetertechniek, bescherming of drukvermindering zijn vaak de eerste stap.",
    specialist: "Specialistische beoordeling kan passen bij duidelijke pijn, groei, huidproblemen of twijfel over de aard van de zwelling.",
  },
  "ganglion-middenvoet": {
    category: "Middenvoet",
    h1: "Ganglion op de middenvoet of wreef",
    summary: [
      "Een ganglion op de wreef kan als lokale zwelling opvallen.",
      "Schoendruk kan klachten geven.",
      "Niet elke zwelling bovenop de voet is een ganglion.",
    ],
    what: "Een ganglion is een met vocht gevulde zwelling die kan ontstaan rond een gewricht of peesschede.",
    symptoms: "Klachten hangen af van plek en grootte: zichtbare zwelling, druk in schoenen of lokale irritatie.",
    differential: "Tarsal boss, peeszwelling, artrose of andere weke-delenzwellingen kunnen erop lijken.",
    assessment: "Onderzoek kijkt naar vorm, beweeglijkheid, hardheid, relatie met pezen of gewrichten en soms echografie.",
    conservative: "Als klachten beperkt zijn, kan afwachten of drukvermindering genoeg zijn.",
    specialist: "Bij pijn, groei, onzekerheid of hinder in schoenen kan beoordeling zinvol zijn.",
  },
  "stressreactie-stressfractuur": {
    category: "Middenvoet",
    h1: "Stressreactie of stressfractuur van de voet",
    summary: [
      "Botstress kan pijn geven die toeneemt bij belasting.",
      "Het ontstaat vaak door verhouding tussen belasting en herstel.",
      "Tijdige beoordeling kan belangrijk zijn bij verdenking op stressletsel.",
    ],
    what: "Een stressreactie of stressfractuur ontstaat wanneer bot herhaald wordt belast en onvoldoende herstelt.",
    symptoms: "Pijn neemt vaak toe tijdens lopen of sporten en kan later ook in rust aanwezig zijn. Soms is er lokale drukpijn of zwelling.",
    differential: "Peesklachten, metatarsalgie, Lisfranc-letsel en gewrichtsklachten kunnen lijken op stresspijn.",
    assessment: "Beoordeling kijkt naar belasting, trainingsopbouw, pijnplek, drukpijn en soms röntgenfoto of MRI.",
    conservative: "Ontlasting, tijdelijke aanpassing van sport, schoenadvies en geleidelijke opbouw zijn vaak belangrijk.",
    specialist: "Bij duidelijke verdenking, aanhoudende pijn of risicoplekken kan specialistische beoordeling nodig zijn.",
  },
  "lisfranc-middenvoetletsel": {
    category: "Middenvoet",
    h1: "Lisfranc- en middenvoetletsel",
    summary: [
      "Lisfranc-letsel zit rond de gewrichten van de middenvoet.",
      "Het kan ontstaan na verdraaiing, val of ongeval.",
      "Soms is het letsel subtiel maar wel belangrijk.",
    ],
    what: "Het Lisfranc-gebied verbindt de middenvoet met de voorvoet. Letsel daar kan banden, gewrichten of bot betreffen.",
    symptoms: "Klachten kunnen bestaan uit pijn midden op de voet, zwelling, moeite met belasten en pijn bij afwikkelen.",
    differential: "Kneuzing, stressfractuur, artrose en peesklachten kunnen deels hetzelfde gebied pijn doen.",
    assessment: "Beoordeling vraagt aandacht voor het ongevalsmechanisme, drukpijn, belastingsfoto's en soms CT of MRI.",
    conservative: "De behandeling hangt sterk af van stabiliteit en ernst. Soms is ontlasting voldoende, soms is specialistische behandeling nodig.",
    specialist: "Bij verdenking op Lisfranc-letsel is tijdige beoordeling belangrijk, vooral als belasten pijnlijk blijft.",
  },
  "artrose-na-breuk": {
    category: "Voet en enkel",
    h1: "Artrose na een breuk in voet of enkel",
    summary: [
      "Na een breuk kan later pijn of stijfheid ontstaan door gewrichtsschade.",
      "Stand, kraakbeen en eerdere behandeling zijn belangrijk.",
      "De klachten kunnen jaren na het letsel ontstaan.",
    ],
    what: "Artrose na een breuk ontstaat wanneer een gewricht door eerder letsel beschadigd is geraakt of anders is gaan belasten.",
    symptoms: "Pijn, stijfheid, zwelling, verminderde loopafstand en moeite met ongelijke ondergrond kunnen voorkomen.",
    differential: "Peesklachten, instabiliteit, standafwijking, niet goed genezen bot of implantaatirritatie kunnen ook klachten geven.",
    assessment: "Beoordeling kijkt naar voorgeschiedenis, stand, gewricht, röntgenfoto's en soms CT.",
    conservative: "Schoenaanpassing, brace, fysiotherapie, pijnstilling via eigen behandelaar en belasting aanpassen kunnen worden besproken.",
    specialist: "Specialistische beoordeling kan passen bij duidelijke beperkingen, standafwijking of wanneer operatieve opties worden overwogen.",
  },
  "revisie-artrodese": {
    category: "Voet en enkel",
    h1: "Revisie na artrodese van voet of enkel",
    summary: [
      "Bij aanhoudende klachten na artrodese wordt gekeken naar botgenezing, stand en implantaten.",
      "Niet iedere pijn na een vastzetoperatie betekent dat de artrodese niet is vastgegroeid.",
      "Dit is complexe zorg en vraagt zorgvuldige beoordeling.",
    ],
    what: "Een artrodese is een operatie waarbij een gewricht wordt vastgezet. Revisie betekent dat opnieuw wordt beoordeeld of een vervolgbehandeling nodig is.",
    symptoms: "Klachten kunnen bestaan uit pijn bij belasten, zwelling, druk van implantaten, standproblemen of beperkingen in lopen.",
    differential: "Pijn kan komen door niet-genezing, overbelasting van omliggende gewrichten, implantaatirritatie, stand of andere oorzaken.",
    assessment: "Beoordeling vraagt vergelijking met eerdere operatiegegevens, röntgenfoto's, soms CT en een helder beeld van functie en verwachtingen.",
    conservative: "Niet-operatieve opties kunnen bestaan uit schoenaanpassing, brace, belasting aanpassen of behandeling van omliggende klachten.",
    specialist: "Specialistische beoordeling is passend wanneer er aanhoudende beperkingen zijn of wanneer een revisieoperatie wordt overwogen.",
  },
};

const defaultSpec = (condition) => ({
  category: condition.tags?.[0] || "Voet en enkel",
  h1: condition.title,
  summary: [
    `${condition.title} kan klachten geven die per persoon verschillen.`,
    "Deze pagina geeft algemene uitleg en stelt geen diagnose.",
    "De juiste betekenis hangt af van verhaal, lichamelijk onderzoek en zo nodig beeldvorming.",
  ],
  what: condition.excerpt,
  symptoms: "Klachten kunnen pijn, druk, stijfheid, zwelling of beperking bij lopen en sporten geven. De exacte plek en duur van de klachten zijn belangrijk.",
  differential: "Andere oorzaken in hetzelfde gebied kunnen erop lijken. Daarom is deze pagina bedoeld als algemene oriëntatie, niet als persoonlijke beoordeling.",
  assessment: "Beoordeling bestaat uit het klachtenverhaal, lichamelijk onderzoek, eerdere behandeling en soms aanvullende beeldvorming.",
  conservative: "Niet-operatieve mogelijkheden kunnen bestaan uit schoenadvies, zoolaanpassing, oefentherapie, belasting aanpassen of pijnstilling via de eigen behandelaar.",
  specialist: "Specialistische beoordeling kan zinvol zijn bij aanhoudende pijn, duidelijke beperkingen, twijfel over de oorzaak of onvoldoende herstel.",
});

const contentCode = fs.readFileSync(contentPath, "utf8");
const context = {
  window: { location: { pathname: "/", search: "" }, addEventListener() {}, siteContent: null },
  document: { addEventListener() {}, querySelectorAll() { return []; } },
  console,
};
vm.createContext(context);
vm.runInContext(contentCode, context);

const conditions = context.window.siteContent.footPainConditions.filter(
  (condition) => condition.id !== "algemene-voet-enkelinformatie"
);
const conditionById = new Map(conditions.map((condition) => [condition.id, condition]));

const treatmentUrl = (id) => `behandelingen/${id}.html`;
const relativeTreatmentUrl = (id) => `${id}.html`;

const relatedConditions = (condition) =>
  conditions
    .filter((candidate) => candidate.id !== condition.id)
    .map((candidate) => ({
      condition: candidate,
      score: candidate.painRegionIds.filter((id) => condition.painRegionIds.includes(id)).length,
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.condition.title.localeCompare(b.condition.title, "nl"))
    .slice(0, 4)
    .map((item) => item.condition);

const heroImageFor = (spec) => {
  const category = `${spec.category || ""}`.toLowerCase();
  if (category.includes("enkel")) {
    return {
      src: "expertise-ankle-editorial.jpg",
      alt: "Rustig medisch beeld bij voet- en enkelklachten",
    };
  }
  if (category.includes("achtervoet") || category.includes("hiel")) {
    return {
      src: "tile-achtervoet-standsafwijking.jpg",
      alt: "Algemeen beeld bij achtervoet- en hielklachten",
    };
  }
  return {
    src: "tile-voorvoet-pijn-v2.jpg",
    alt: "Algemeen beeld bij voorvoetklachten",
  };
};

const pageHtml = (condition) => {
  const spec = { ...defaultSpec(condition), ...(pageSpecs[condition.id] || {}) };
  const heroImage = heroImageFor(spec);
  const title = `${condition.title} | drs. Matthijs van Dam`;
  const description = sentence(`${condition.excerpt} Algemene patiëntinformatie over klachten, beoordeling en behandelrichtingen. Geen medisch advies op maat.`).slice(0, 158);
  const canonical = `https://matthijsvandam.nl/behandelingen/${condition.id}.html`;
  const related = relatedConditions(condition);
  const reviewPoints = [
    "Klopt de medische afbakening van dit onderwerp?",
    "Zijn de belangrijkste andere oorzaken passend genoemd?",
    "Is de toon veilig genoeg zonder diagnose- of behandelclaim?",
  ];

  return `<!doctype html>
<html lang="nl">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    <meta name="robots" content="noindex, follow">
    <link rel="canonical" href="${canonical}">
    <meta property="og:type" content="article">
    <meta property="og:locale" content="nl_NL">
    <meta property="og:site_name" content="drs. Matthijs van Dam">
    <meta property="og:title" content="${escapeHtml(spec.h1)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:image" content="https://matthijsvandam.nl/assets/social-preview.png">
    <meta property="og:image:alt" content="drs. Matthijs van Dam, orthopedisch chirurg in Tilburg">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(spec.h1)}">
    <meta name="twitter:description" content="${escapeHtml(description)}">
    <meta name="twitter:image" content="https://matthijsvandam.nl/assets/social-preview.png">
    <meta name="twitter:image:alt" content="drs. Matthijs van Dam, orthopedisch chirurg in Tilburg">
    <link rel="icon" href="../assets/logo-mvd-mark-v2.svg" type="image/svg+xml">
    <link rel="stylesheet" href="../styles.css?v=20260621herobalance1">
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "MedicalWebPage",
        "headline": ${JSON.stringify(spec.h1)},
        "description": ${JSON.stringify(description)},
        "url": ${JSON.stringify(canonical)},
        "dateModified": "2026-06-14",
        "inLanguage": "nl-NL",
        "author": {
          "@type": "Person",
          "name": "drs. Matthijs van Dam"
        },
        "isPartOf": {
          "@type": "WebSite",
          "name": "drs. Matthijs van Dam",
          "url": "https://matthijsvandam.nl/"
        },
        "medicalAudience": [
          {
            "@type": "MedicalAudience",
            "audienceType": "Patient"
          }
        ],
        "about": ${JSON.stringify([condition.title, ...(condition.tags || [])])}
      }
    </script>
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://matthijsvandam.nl/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Behandelingen",
            "item": "https://matthijsvandam.nl/behandelingen.html"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": ${JSON.stringify(condition.title)},
            "item": ${JSON.stringify(canonical)}
          }
        ]
      }
    </script>
  </head>
  <body>
    <a class="skip-link" href="#inhoud">Ga naar inhoud</a>
    <header class="site-header legal-header" data-header>
      <a class="brand" href="../index.html#top" aria-label="Terug naar drs. Matthijs van Dam home">
        <img class="brand-logo brand-logo-tree" src="../assets/logo-mvd-header-mark.png" alt="" width="62" height="62">
        <span class="brand-text">drs. Matthijs van Dam</span>
      </a>
      <button class="nav-toggle" type="button" aria-label="Menu openen" aria-expanded="false" data-nav-toggle>
        <span></span>
        <span></span>
      </button>
      <nav class="site-nav legal-nav" aria-label="Navigatie" data-nav>
        <a href="../behandelingen.html">Behandelingen</a>
        <a href="../professionals.html">Professionals</a>
        <a href="../index.html#contact">Contact</a>
      </nav>
    </header>

    <main class="treatment-detail-page" id="inhoud">
      <section class="treatment-detail-hero">
        <div class="treatment-detail-hero-copy">
          <p class="section-kicker">${escapeHtml(spec.category)}</p>
          <h1>${escapeHtml(spec.h1)}</h1>
          <p class="lead">${escapeHtml(condition.excerpt)}</p>
          <div class="article-meta" aria-label="Onderwerpen">
            <a href="../behandelingen.html">Behandelingen</a>
            <span>Voet- en enkelpijnwijzer</span>
            <span>Concept voor medische review</span>
          </div>
        </div>
        <div class="treatment-detail-hero-visual">
          <figure class="treatment-detail-hero-media">
            <img src="../assets/${heroImage.src}" alt="${escapeHtml(heroImage.alt)}" width="1400" height="788" loading="eager">
            <figcaption>${escapeHtml(spec.h1)}: algemene informatie over klachten, beoordeling en behandelrichtingen.</figcaption>
          </figure>
          <aside class="treatment-author-card" aria-label="Geschreven door">
            <img src="../assets/portrait-matthijs-van-dam.jpg" alt="" width="72" height="72" loading="eager">
            <div>
              <span>Geschreven door</span>
              <strong>drs. Matthijs van Dam</strong>
              <p>Orthopedisch chirurg in het Orthopedisch Centrum ETZ in Tilburg.</p>
              <a href="../over-mij.html">Meer over mij</a>
            </div>
          </aside>
        </div>
      </section>

      <section class="section treatment-detail-section">
        <div class="treatment-detail-layout">
          <aside class="treatment-detail-aside" aria-label="Samenvatting en praktische route">
            <div class="treatment-summary-card">
              <strong>Kort samengevat</strong>
              <ul>
                ${spec.summary.map((item) => `<li>${escapeHtml(item)}</li>`).join("\n                ")}
              </ul>
            </div>
            <details class="treatment-summary-card treatment-safety-details">
              <summary><strong>Algemene informatie</strong></summary>
              <p>Deze pagina geeft algemene uitleg en vervangt geen persoonlijke beoordeling. Voor diagnose, behandeling, verwijzing, afspraken of spoed zijn je eigen huisarts, behandelaar of de officiële zorgkanalen de juiste route.</p>
            </details>
            <div class="treatment-summary-card">
              <strong>Medische review</strong>
              <p>Dit is een lokale conceptpagina. De inhoud is bedoeld als rustige basis voor medische eindredactie door Matthijs voordat publicatie wordt overwogen.</p>
            </div>
            <nav class="treatment-summary-card treatment-anchor-card" aria-label="Op deze pagina">
              <strong>Op deze pagina</strong>
              <a href="#wat-is-het">Wat is het?</a>
              <a href="#klachten">Klachten</a>
              <a href="#andere-oorzaken">Wat kan het ook zijn?</a>
              <a href="#beoordeling">Beoordeling</a>
              <a href="#behandeling">Behandelrichtingen</a>
              <a href="#review">Reviewpunten</a>
            </nav>
          </aside>

          <article class="treatment-detail-content">
            <h2 id="wat-is-het">Wat is ${escapeHtml(condition.title.toLowerCase())}?</h2>
            <p>${escapeHtml(spec.what)}</p>

            <h2 id="klachten">Welke klachten kunnen erbij passen?</h2>
            <p>${escapeHtml(spec.symptoms)}</p>

            <h2 id="andere-oorzaken">Wat kan het ook zijn?</h2>
            <p>${escapeHtml(spec.differential)}</p>

            <h2 id="beoordeling">Hoe wordt dit beoordeeld?</h2>
            <p>${escapeHtml(spec.assessment)}</p>

            <h2 id="behandeling">Algemene behandelrichtingen</h2>
            <p>${escapeHtml(spec.conservative)}</p>
            <p>${escapeHtml(spec.specialist)}</p>

            <div class="patient-callout">
              <strong>Geen diagnose via deze pagina.</strong>
              <p>De Voet- en enkelpijnwijzer en deze pagina helpen om algemene onderwerpen te herkennen. Ze sluiten andere oorzaken niet uit en vervangen geen medisch consult.</p>
            </div>

            <h2 id="review">Medische reviewpunten</h2>
            <ul>
              ${reviewPoints.map((item) => `<li>${escapeHtml(item)}</li>`).join("\n              ")}
            </ul>

            <h2>Verwante onderwerpen</h2>
            <div class="related-article-grid">
              ${related
                .map(
                  (item) => `<a class="related-article-card" href="${relativeTreatmentUrl(item.id)}">
                <span>${escapeHtml(item.tags?.[0] || "Voet en enkel")}</span>
                <strong>${escapeHtml(item.title)}</strong>
                <p>${escapeHtml(item.excerpt)}</p>
              </a>`
                )
                .join("\n              ")}
            </div>
          </article>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <span>© drs. Matthijs van Dam</span>
      <span>
        <a href="../privacy.html">Privacy</a>
        <a href="../disclaimer.html">Disclaimer</a>
      </span>
    </footer>
    <script src="../script.js?v=20260619hub1"></script>
  </body>
</html>
`;
};

const created = [];
const skipped = [];

for (const condition of conditions) {
  const target = path.join(treatmentsDir, `${condition.id}.html`);
  if (fs.existsSync(target)) {
    skipped.push(condition.id);
    continue;
  }
  fs.writeFileSync(target, pageHtml(condition), "utf8");
  created.push(condition.id);
}

const inventoryLines = [
  "# Voet- en enkelpijnwijzer launch-inventaris",
  "",
  "Alle inhoudelijke kaarten krijgen een eigen conceptpagina in `behandelingen/`. De pagina's blijven `noindex, follow` totdat Matthijs de medische inhoud heeft beoordeeld en de livegang expliciet akkoord is.",
  "",
  "| Kaart | Concept-URL | Status | Reviewpunten |",
  "| --- | --- | --- | --- |",
  ...conditions.map((condition) => {
    const exists = fs.existsSync(path.join(treatmentsDir, `${condition.id}.html`));
    const status = exists ? "concept aanwezig, medische review nodig" : "ontbreekt";
    return `| ${condition.title} | \`${treatmentUrl(condition.id)}\` | ${status} | medische afbakening, veilige toon, interne links |`;
  }),
  "",
];
fs.writeFileSync(path.join(root, "FOOT_PAIN_GUIDE_LAUNCH_INVENTARIS.md"), inventoryLines.join("\n"), "utf8");

console.log(`Aangemaakt: ${created.length}`);
console.log(created.join("\n"));
console.log(`Overgeslagen bestaand: ${skipped.length}`);
console.log(skipped.join("\n"));
