# Eigenaarmelding nieuwsbrief — 23 september 2026

Op expliciete opdracht van Matthijs ingericht en geactiveerd in Brevo.

- Workflow 1: MVD - melding bevestigde inschrijving, https://app.brevo.com/automation/edit/1 . Status Active in editor teruggelezen, opgeslagen 20:51.
- Trigger: Form submitted, uitsluitend Copy of MVD nieuwsbrief - native proef - niet publiceren (websiteformulier 6a9f81effd758e360d87d286). Geen proef-, voorkeuren- of afmeldformulier geselecteerd.
- Native dubbele opt-in blijft bepalend: volgens officiële Brevo-documentatie wordt deze melding pas na bevestiging uitgevoerd: https://help.brevo.com/hc/en-us/articles/27278282993682-Notify-your-team-by-email-when-a-contact-submits-a-form .
- Actie Notify by email, afzender website@mail.matthijsvandam.nl, vaste ontvanger mjjvandam@gmail.com, onderwerp Nieuwe bevestigde nieuwsbriefinschrijving.
- Nederlandstalige berichttekst bevat params.contact.EMAIL, FIRSTNAME en LASTNAME; als variabelen in opgeslagen preview teruggelezen.
- Re-entry uit: een contact doorloopt de melding eenmalig. Herinschrijving van hetzelfde contact geeft dus geen tweede melding.
- Geen ontvangerslijst gewijzigd, geen nieuwsbriefcampagne geactiveerd, geen site gepubliceerd. Binnen bestaande native route ADR-0013; geen nieuwe ADR nodig.

## Open controle

Actieve configuratie bewezen; bezorging en variabele-invulling bij een echte volgende bevestigde inschrijving nog niet waargenomen. Geen testmail verzonden. Bestaande marketingtoestemming van de eigenaar niet gewijzigd.

## Ter kennisname

Eigenaarmelding staat aan; de eerste echte ontvangst moet nog worden gecontroleerd.
