# Nieuwsbriefmelding en dashboardteller — 24 september 2026

## Providercontrole en herstel

Op opdracht van Matthijs is bestaande Brevo-workflow 1 aangepast. Eén echte lezer had de native bevestigingsmail ontvangen en aangeklikt en was aan drie productielijsten toegevoegd. De actieve formuliertrigger had nul contacten verwerkt. De technische oorzaak binnen Brevo is niet bewezen.

Aan dezelfde workflow is trigger 3, Contact added to list, toegevoegd voor uitsluitend productielijsten 4, 5, 6, 7 en 8. Beide triggers leiden naar dezelfde bestaande Notify by email-actie. Herintrede blijft uit: meerdere onderwerpkeuzes leveren niet bewust meerdere meldingen op. De native dubbele opt-in is niet gewijzigd. De lijsttrigger reageert ook op handmatige toevoeging/import in deze productielijsten; gebruik die lijsten daarom uitsluitend voor contacten met bestaande toestemming. Bestaande contacten worden niet opnieuw verwerkt alleen door opslaan van deze trigger.

Opslag om 21:11 en Active in Brevo teruggelezen. Eén berichttest naar het eigen, reeds bekende adres uitgevoerd. Brevo-log om 21:12 toont Sent en Delivered; de preview bevat de correct ingevulde eigen naam en het eigen e-mailadres. Dit bewijst de berichtactie en providerbezorging, niet de nieuwe trigger bij een volgende echte inschrijving. Die ketencontrole blijft open. Geen testbericht aan de lezer verzonden; geen nieuwsbriefcampagne verstuurd.

## Dashboard

Overzicht en Nog te doen tonen dezelfde compacte teller: 1 unieke bevestigde lezer, exclusief 1 eigen/testcontact. Bron: Brevo-contactlijst (2 contacten), bevestigde inschrijving en lijsttoevoeging in de contactgeschiedenis. Onderwerpkeuzes worden niet opgeteld. Alleen geaggregeerde telling en controletijd staan in lokale state/newsletter.json; geen namen of e-mailadressen.

Dit is een gedateerde, handmatig gecontroleerde opname. Na 24 uur verschijnt opnieuw controleren. Vernieuwen leest de opname opnieuw; de link naar Brevo geeft toegang tot de actuele inschrijvingen. Er is geen automatische providerkoppeling of nieuwe credential ingericht.

## Scope en controles

Bestaande native route ADR-0013 en lokale dashboardweergave ADR-0014; geen nieuwe ADR nodig. Geen publieke pagina, medische inhoud, indexering of publicatieverificatie gewijzigd. Bestaande lokale panel- en tekststijlen hergebruikt; de lokale beheerinterface heeft geen match in de publieke designsysteemcatalogus. Geen gedeelde CSS gewijzigd.

Validatie: 74 lokale dashboardtests geslaagd; werkcatalogus na wijziging gevalideerd (24 taken); git diff --check en designsysteemcontrole geslaagd. Overzicht visueel bekeken op desktop en 360/390/430 px. Bestaande lokale interface heeft geen afzonderlijk donker thema. Geen package.json en geen npm-checks. Beheerserver herstart op poort 8878.
