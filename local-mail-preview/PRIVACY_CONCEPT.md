# Privacytekst contact en nieuwsbrief — concept

Status: lokale redactionele voorbereiding, niet gepubliceerd. De huidige publieke privacy.html blijft correct vermelden dat beide formulieren niet actief zijn. Dit concept mag pas publiek worden nadat verantwoordelijke, mailbox, leveranciersafspraken en bewaartermijnen zijn bevestigd.

## Nog te bevestigen door Matthijs

- Verantwoordelijke: Matthijs persoonlijk of AOdK B.V.; vraag staat open.
- Gewone contactberichten: voorstel maximaal 12 maanden na afhandeling; vraag staat open. Dit is nog geen bestaande verwijderinstelling.
- Ontvangst in gewone Gmail blijft de gewenste route, maar Google biedt hiervoor geen verwerkersovereenkomst. Een eventueel bestaande zakelijke mailbox met passende afspraken verdient eerst controle. De geslaagde test is geen privacygoedkeuring voor berichten van bezoekers.
- Definitieve hostingkeuze en bijbehorende verwerkersafspraken; huidige route is Vercel → Brevo → Gmail.
- Brevo: actuele accountinstellingen voor bewaartermijnen en open-/kliktracking controleren. Volgens de documentatie worden transactionele logs en voorbeeldweergaven standaard onbeperkt bewaard; daarom geen korte bewaartermijn als voldongen feit opschrijven.

## Voorgestelde tekst voor bezoekers

### Wie is verantwoordelijk?

[Bevestigde naam verantwoordelijke] beheert matthijsvandam.nl en is verantwoordelijk voor de verwerking van gegevens via het contactformulier en de nieuwsbrief. Voor privacyvragen kun je schrijven naar [bevestigd contactadres].

### Contactformulier

Als je het contactformulier gebruikt, verwerk ik je naam, e-mailadres, onderwerp, soort vraag en bericht om je vraag te beantwoorden en daarover met je te communiceren. Voor gewone zakelijke correspondentie is de voorgestelde grondslag het gerechtvaardigd belang om vragen zorgvuldig af te handelen. Als je zelf om een offerte of opdracht vraagt, kan de verwerking nodig zijn om op jouw verzoek een overeenkomst voor te bereiden.

De naam, het e-mailadres, het onderwerp en het bericht zijn nodig om je bericht te kunnen behandelen. Het formulier heeft geen bijlagenfunctie. Stuur geen medische gegevens, foto's, uitslagen, verwijsbrieven of informatie over lopende patiëntenzorg. Gebruik voor medische vragen, afspraken en spoed de officiële zorgkanalen van het ETZ, je huisarts of je behandelaar.

Je bericht wordt via [definitieve hostingpartij] en Brevo doorgestuurd naar [bevestigde mailboxdienst]. Een contactbericht schrijft je niet in voor een nieuwsbrief. Je ontvangt geen automatische kopie van je vrije berichttekst.

Gewone contactberichten worden [bevestigde termijn] na afhandeling verwijderd. Als correspondentie onderdeel wordt van een opdracht of noodzakelijk is voor een wettelijke verplichting of rechtsvordering, wordt daarvoor afzonderlijk bepaald welke gegevens nodig zijn en hoe lang ze bewaard worden. [Uitvoeringsafspraak voor mailbox, prullenbak, archieven en leverancierslogs nog vastleggen.]

### Nieuwsbrief

Alleen als je je daarvoor inschrijft en je e-mailadres bevestigt, ontvang je de gekozen nieuwsbrief. Hiervoor worden je voornaam, achternaam, e-mailadres, gekozen onderwerpen, doelgroepkeuze en de bevestiging van je toestemming verwerkt. De grondslag is jouw toestemming. Je ontvangt maximaal twaalf nieuwsbrieven per jaar, over alle keuzes samen. [Pas opnemen zodra deze gezamenlijke frequentiegrens daadwerkelijk is geïmplementeerd.]

De doelgroepkeuze bepaalt voor welk publiek de tekst is geschreven. Er wordt niet uit afgeleid dat je een aandoening hebt of onder behandeling bent. Geef bij de inschrijving geen medische informatie op.

Brevo beheert de verzending en inschrijving. Je kunt je via iedere nieuwsbrief afmelden. Voorkeurwijzigingen worden pas doorgevoerd nadat de toegang tot je e-mailadres is gecontroleerd. Na afmelden stopt de verzending; alleen de minimaal noodzakelijke informatie om de afmelding te respecteren en toestemming te kunnen verantwoorden wordt bewaard, volgens een vooraf vastgestelde termijn. [Termijn en werking bij bestaande adressen nog bevestigen en testen.]

### Beveiliging, leveranciers en doorgifte

De website gebruikt technische gegevens, waaronder het IP-adres, om misbruik van het formulier te beperken. De formulierinhoud wordt niet opgenomen in eigen analytics of technische foutmeldingen. Alleen noodzakelijke leveranciers krijgen gegevens voor de hierboven beschreven doelen.

[Noem de definitieve hosting-, mail- en mailboxleveranciers en hun rol. Leg de toepasselijke verwerkersafspraken en eventuele doorgiften buiten de EER met bijbehorende waarborgen vast. Geen claim opnemen dat alle gegevens uitsluitend in Europa blijven zonder bewijs.]

### Je rechten

Je kunt vragen om inzage, correctie of verwijdering van je persoonsgegevens. Afhankelijk van de situatie kun je ook vragen om beperking, bezwaar maken of je gegevens ontvangen voor overdracht. Je kunt je toestemming voor de nieuwsbrief altijd intrekken; dat verandert niets aan de rechtmatigheid van de verwerking vóór die intrekking. Neem hiervoor contact op via [bevestigd privacyadres]. Je kunt ook een klacht indienen bij de Autoriteit Persoonsgegevens.

## Uitvoering voordat dit beleid kan gelden

1. Verantwoordelijke en contactadres bevestigen; grondslag en belangenafweging vastleggen.
2. Definitieve mailbox met passende afspraken kiezen. Geen zakelijke verwerkersovereenkomst voor gewone Gmail suggereren.
3. Hosting en Brevo-contracten, subverwerkers en doorgiftewaarborgen vastleggen; geen contract namens Matthijs accepteren zonder concrete toestemming.
4. Gewenste mailboxbewaartermijn uitvoerbaar maken. Bij Brevo kortst passende bewaartermijn voor previews/logs kiezen en eerst de gevolgen voor bestaande data beoordelen.
5. Individuele open-/kliktracking uitzetten en verifiëren; tekstmail op zichzelf bewijst niet dat alle accounttracking uitstaat.
6. Nieuwsbriefvoorkeuren, verplichte namen, double opt-in, afmelden en jaarlimiet testen vóór publicatie van het nieuwsbriefdeel.
7. Pas daarna privacy.html en zichtbare formulieren samen vrijgeven. Tot die tijd blijft de bestaande publieke tekst staan.

## Bronnen, gecontroleerd 2026-09-06

- AP: https://autoriteitpersoonsgegevens.nl/nl/onderwerpen/algemene-informatie-avg/verantwoordingsplicht
- AP privacyrechten: https://autoriteitpersoonsgegevens.nl/themas/basis-avg/privacyrechten-avg/voor-organisaties-privacyrechten-in-de-praktijk
- Google, gewone Gmail heeft geen DPA: https://support.google.com/policies/answer/9581826?hl=en
- Brevo logs en previews: https://help.brevo.com/hc/en-us/articles/360021533839-Manage-your-transactional-logs-and-email-previews
- Brevo voorwaarden: https://www.brevo.com/legal/termsofuse/ (contractbijlagen nog per account vastleggen)
