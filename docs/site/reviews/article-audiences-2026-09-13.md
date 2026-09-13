# Artikelkeuzes — lokale wijziging 13 september 2026

Opdracht Matthijs: zichtbaar ‘Voor wie’ weghalen, ‘Ik ben patiënt’ en ‘Ik werk in de zorg’ gebruiken, medewerkers onder zorgprofessionals brengen.

Gewijzigd: artikelen.html, content.js, styles.css, de categorielabels in beide FOOTprint-artikelen en projecten/footprint-quick-scan.html. De twee FOOTprint-artikelen zijn nu via zorgprofessionals vindbaar. Oude audience=medewerkers-links normaliseren naar zorgprofessionals. Artikelteksten en pagina-URL's behouden.

Designsysteem: component article-overview bijgewerkt in components.json en DESIGN_SYSTEM.md; TARGET_AUDIENCES.md legt het eigenaarbesluit vast. Stijlgids en usage.json opnieuw gegenereerd. Doelgroep heeft een toegankelijk groepslabel zonder zichtbare kop, blijft altijd open; alleen onderwerp is mobiel uitklapbaar. Mobiel staan de groepen onder elkaar. Deze filtervorm blijft beperkt tot het artikeloverzicht; andere modules gebruiken hun bestaande patroon.

Controle: sitekwaliteit, SEO-basis, designsysteem en pijnwijzercheck zonder issues. Browsercontrole op 360/390/430 px en desktop, licht en donker. Geen horizontale overflow in metingen op 360/430/1280 px. Zorgfilter bevat beide FOOTprint-artikelen; patiëntfilter bevat geen FOOTprint-artikelen. Nogmaals klikken wist het filter. Oude medewerkerslink getest en genormaliseerd. Geen browserconsolefouten tijdens de controle. Geen package.json, dus geen npm-checks beschikbaar.

ADR-check: binnen ADR-0001 (bestaande professionele doelgroep), ADR-0004 (filterlinks) en ADR-0006 (publicatie). Geen nieuw hoofdspoor of paginamodel; geen nieuwe ADR nodig. Bestaande medische inhoud is niet gewijzigd.

Publicatieregister: vier gewijzigde HTML-pagina's op review_nodig, met historische review behouden. De publicatiecheck meldt daarom vier open reviewstatussen en vier gewijzigde bronversies. Dit zijn vrijgavepunten, geen groene publicatiecheck. Visuele eigenaarreview en livevrijgave staan open. Niets gedeployed. Search Console-workflow gelezen; geen nieuwe Google-controle of indexeringsaanvraag uitgevoerd bij deze lokale filteraanpassing. Bij publieke release de bestaande nacontrole meenemen.
