# Designsysteem — oplevering 13 september 2026

Opdracht: bestaande vormgeving uitwerken als compacte stijlgids en toekomstige wijzigingen samen met relevante andere pagina’s onderhouden.

## Opgeleverd

- `docs/site/DESIGN_SYSTEM.md`: bronverdeling, ontwerpregels, gedeelde component versus pagina-uitzondering, afnemerscontrole, visuele review en publicatiegrenzen.
- `docs/design-system/components.json`: zeven componentgroepen met concrete bronselectors en herkenningskenmerken.
- `docs/design-system/index.html`, `catalogue.js`, `catalogue.css`: lokale voorbeelden uit echte pagina’s, actuele CSS-kleuren, licht/donker en 1200/360/390/430 px.
- `docs/design-system/usage.json`: herleidbare afnemers en bronvingerafdrukken.
- `tools/design_system.py`: bouwen, synchronisatiecontrole en impactinventarisatie. Werkt zonder npm of externe Python-pakketten.
- `AGENTS.md` en `CODEX_WERKWIJZE.md`: verplicht meenemen bij volgende ontwerpwijzigingen; actuele staat verwijst naar de gids.
- `tools/check_site_quality.py`: designsysteemcontrole opgenomen. Navigatiecheck slaat alleen de niet-publieke stijlgidsmap over, net als andere lokale hulpmiddelen; publieke pagina’s blijven onder de controle vallen.

## Verificatie

- Sitekwaliteit: 77 HTML-pagina’s, geen issues.
- SEO-basis: 40 sitemap-pagina’s, geen issues.
- Designsysteemcontrole: actuele bronvingerafdrukken, gebruikslijst en gegenereerde pagina gelijk.
- Geïsoleerde driftproeven in tijdelijke opslag: CSS-wijziging wordt gedetecteerd; nieuwe pagina met project-context verschijnt in impactlijst en maakt de inventaris verouderd; verwijderen van een voorbeeldselector geeft een fout. Echte site niet gewijzigd door de proeven.
- Browser: alle zeven voorbeelden laden. Licht en donker en mobiele breedtekeuze functioneren. Artikeloverzicht en projectcontext op 360/390/430 px zonder horizontale overflow; projectcontext en FAQ visueel bekeken.
- Publicatiecheck: meldt bestaande gewijzigde index.html en cohortpagina. Deze opdracht wijzigt geen publieke HTML/CSS/JS of inhoudelijk akkoord.
- Geen package.json, dus geen npm-checks.

## Grenzen

De impactlijst is conservatief; nieuwe of indirecte patronen vragen handmatige analyse. Opnieuw genereren is geen inhoudelijk of visueel akkoord. Niet alle interactieve toestanden van de hele website zijn opnieuw getest: de productiecomponenten zijn in deze opdracht niet veranderd.

ADR-0004/0006 en INVARIANTS §10 zijn toegepast op bestaande vormgeving/documentatie. Geen nieuwe architectuur of nieuwe ADR nodig. Geen medische review nodig voor deze documentatie; geen medische goedkeuring verleend. De stijlgids blijft lokaal, noindex/nofollow en via docs/ uitgesloten van deployment. Niets gepubliceerd.
