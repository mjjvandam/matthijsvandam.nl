# Verificatie loopverhaal

25 september 2026 · lokaal concept · medische/anatomische review open.

## Uitgevoerd

- Acht tekstscènes, 30 bronverwijzingen, acht stilstaande illustraties en afzonderlijke skeletcontrole. Geen productiepagina, sitemap, register of gedeelde productie-CSS voor dit werk aangepast.
- Brondata: één geselecteerde opname uit de Walking Biomechanics Dataset v6, met manifest en SHA256-hashes. Het gemiddelde van huidmarkers is een bekkenreferentie, geen gemeten heupcentrum. Botlengten/contactankers zijn retargeting; tenen en anatomie schematisch.
- `tools/check_motion.mjs`: 181 sleutelbeelden; maximale bot-/segmentlengteafronding 0,00114 mm; minimale voethoogte 0 mm; altijd minimaal één voet in contact. Vaste contactankers gecontroleerd. Maximale verplaatsing tussen circa 6 ms opeenvolgende frames 30,56 mm. 1001 deterministische renderposities zonder NaN/Infinity. Dit is technische geometriecontrole, geen klinische validatie.
- `tools/check_concept.py`: unieke IDs, lokale linkdoelen, altteksten, bronankers, acht statische beelden, noindex en uitsluiting van deployment/sitemap geslaagd.
- Browser: desktop 1059×990; mobiel 360×800, 390×844, 430×932. Geen horizontale overflow in gecontroleerde scènes; geen ontbrekende afbeeldingen of consolefouten. Donkere variant en lichte variant (tijdelijke fixture met alleen kleurvariabelen geforceerd) bekeken.
- 200% basislettergrootte via tijdelijke fixture: hoofdtekst 36 px op mobiel, automatische statische leesversie. Laag venster 1059×590 schakelt eveneens naar statische weergave. Header kan in leesmodus ombreken.
- JavaScript-loze fixture: acht zichtbare figuren en volledige tekst, geen scripts. Tijdelijke fixtures na controle verwijderd.
- Toetsenbord: Enter wisselt de leesknop; skeletslider Home/End geeft 0/100%. Bronankers openen het bronnenpaneel. Diepe links worden na asynchroon laden opnieuw uitgelijnd. Snel vooruit scrollen en terug naar hetzelfde anker leverde exact dezelfde fase (0,2352).
- Verminderde beweging is afgedekt in CSS én JS via dezelfde statische leesmodus. De daadwerkelijke OS-voorkeur is niet omgezet in deze browsercontrole; geen volledige assistieve-technologie-audit geclaimd.
- Designsysteem: eigen conceptcomponent en uitzondering beschreven; build/check geslaagd. Geen nieuwe ADR: bestaande ADR-0002/0005/0006.

## Grenzen en resterende beoordeling

Medische broninterpretatie en tekenanatomie moeten door Matthijs worden beoordeeld. De illustratie is geen klinisch gevalideerd model en geen exacte reconstructie van de deelnemer. De voetboogverdieping is een apart schematisch gewrichtsprincipe; er worden geen gemeten weefselrek, EMG, drukwaarden of behandeluitkomsten getoond. Onderzoekshoudingen zijn geen zelftest.

De algemene site-/publicatiecheck is niet volledig groen door andere werkboomwijzigingen en bestaande publieke conceptlinks. De productie-navigatiecheck verwacht bovendien een uitklapmenu en gedeelde headerklassen op beide lokale conceptpagina’s; die gebruiken bewust een eenvoudige eigen navigatie. De lokale link- en toetsenbordcontroles zijn daarom apart uitgevoerd. Er zijn geen checkregels versoepeld.

## Herbouwen

1. `python3 concepten/voet-enkel-loopverhaal/tools/prepare_motion.py`
2. `node concepten/voet-enkel-loopverhaal/tools/build_static.mjs`
3. `python3 concepten/voet-enkel-loopverhaal/tools/build_page.py`
4. `node concepten/voet-enkel-loopverhaal/tools/check_motion.mjs`
5. `python3 concepten/voet-enkel-loopverhaal/tools/check_concept.py`
6. `python3 tools/design_system.py --build` en `--check`.

Gebruik de beschikbare lokale Node-runtime als `node` niet op PATH staat. Er is geen npm-project/check nodig voor deze statische conceptmodule.
