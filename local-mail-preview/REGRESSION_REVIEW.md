# Regressiecontrole aanvraaggebonden bevestiging

Scope: lokale formulier/mailbevestiging, vormgeving, tests en ADR-0010. Geen medische teksten, artikeldata, publieke metadata, publicatieregister of sitemap gewijzigd. De andere nieuwe obesitasconceptbestanden in de werkboom horen niet bij deze opdracht.

## Blocking issues

- Geen gevonden voor de lokale proef. Niet productierijp: geheugenopslag en fake provider hebben geen duurzaamheid, gedeelde locks over processen, publieke webhookauthenticatie of bewezen afmeldsynchronisatie met echte verzending. Die route wordt niet gedeployed.

## Non-blocking issues

- De algemene sitekwaliteitscheck meldt ontbrekende volledige siteheader, nav en toggle op `confirmation.html` en het oude `templates/confirm-subscription.html` (zes meldingen). Deze lokale functionele pagina en e-mailtemplate hebben een andere navigatiebehoefte. De publieke laag slaagt voor SEO/publicatie; geen check-uitzonderingen toegevoegd om de meldingen te verbergen.
- Het nieuwsbriefvoorbeeld bevat nog plaatsaanduidingen, geen artikelinhoud of werkende campagnevoorkeur-/uitschrijflinks.

## Drift-risico's

- Memory locks of de lokale suppressieflag ten onrechte als productiegarantie beschrijven.
- Een oude lokale mock of afgekeurde Brevo DOI-adapter opnieuw gebruiken. De actieve server gebruikt de nieuwe service; de oude transportfunctie weigert altijd.
- De twaalf-per-jaar-belofte in het ontwerp verwarren met een al geïmplementeerde verzendgrens.

## Concrete herstelacties

- Bij productiebouw: adaptercontract op gedeelde duurzame opslag uitvoeren, echte provider/afmelding en late uitkomsten beproeven, verzendlimiet en privacyafronding meenemen. Eerst externe inrichting concreet maken, geen stilzwijgende upgrade.
- Bij publieke bevestigingspagina: het functionele paginamodel en passende navigatie meenemen in de publicatiecheck.

## Checks uitgevoerd

- 39 Node-tests geslaagd; fouten, hergebruik, vervanging, verlopen tokens, twee service-instanties, afmeldrace en onzekere late uitkomst.
- Browserketen volledig lokaal geslaagd; geen browserconsolefouten.
- Mail, bevestigingspagina en nieuwsbriefvoorbeeld 360/390/430 px zonder horizontale overflow; screenshots visueel beoordeeld.
- Publicatiecontrole 39/39 geverifieerd; SEO-check geslaagd; algemene kwaliteitscheck met zes beschreven lokale navigatiemeldingen; git diff --check geslaagd.
- Geen package.json, dus geen npm-checks beschikbaar.

## Niet geverifieerd

- Nieuwe route bij echte provider, permanente/gedeelde opslag, procesuitval, meerdere regio's en webhookauthenticatie.
- Gmail/Outlook-rendering van de nieuwe mail, publiek gebruik en automatische nieuwsbriefverzending.
- Privacykeuzes en daadwerkelijke jaarlimiet. ADR-0010 is geaccepteerd voor lokale bouw; productiekeuzes en livegang blijven open.
