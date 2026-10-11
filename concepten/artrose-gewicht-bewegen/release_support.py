"""Scoped documentation and newsletter preparation for the approved release."""
import hashlib
import json
import shutil
import subprocess


def prepare_support(target, source, here, base):
    def write(name, text):
        (target / name).parent.mkdir(parents=True, exist_ok=True)
        (target / name).write_text(text)

    config = json.loads(base('local-mail-preview/config.json'))
    for audience, label in [('patienten', 'patiënten'), ('zorgprofessionals', 'zorgprofessionals')]:
        config['streams'].append({'id': 'artrose-' + audience, 'label': 'Artrose, gewicht en bewegen · voor ' + label, 'audiences': [audience], 'topics': [], 'allTopics': ['artrose', 'leefstijl'], 'projects': ['transmuraal-tilburg-cohort']})
    write('local-mail-preview/config.json', json.dumps(config, ensure_ascii=False, indent=2) + '\n')
    lists = json.loads(base('local-mail-preview/brevo-lists.json'))
    lists['listIds'].update({'artrose-patienten': 13, 'artrose-zorgprofessionals': 14})
    write('local-mail-preview/brevo-lists.json', json.dumps(lists, ensure_ascii=False, indent=2) + '\n')
    for name in ['core.cjs', 'artrose-streams.test.cjs']:
        shutil.copy2(source / 'local-mail-preview' / name, target / 'local-mail-preview' / name)

    # Preserve the explicitly reviewed standalone calculator without loading analytics.
    nav = base('tools/check_navigation_contract.py')
    nav = nav.replace('        if parser.data_headers != 1:', '''        if rel == "meer-dan-je-bmi.html":
            # Approved standalone tool (ADR-0016); explicit return and safety routes.
            links = {relative_html_path(a.get("href", "")) for a in parser.anchors}
            for required in ("artrose-gewicht-bewegen.html", "disclaimer.html"):
                if required not in links:
                    issues.append(("tool_missing_return_route", f"{rel}: {required}"))
            continue

        if parser.data_headers != 1:''')
    write('tools/check_navigation_contract.py', nav)

    adr = (source / 'docs/decisions/ADR-0016-artrose-themaroute-en-nieuwsbrief.md').read_text()
    adr = adr.replace('Status: Proposed', 'Status: Accepted')
    adr = adr.replace('Owner validation: needs owner validation voor publieke invoering. Het lokale concept is op 11 oktober 2026 expliciet opgedragen; dat is geen acceptatie van deze ADR of publicatieakkoord.', 'Owner validation: Matthijs heeft op 11 oktober 2026 de samenhangende review afgerond en expliciet publicatie van de themapagina met alle ingangen vrijgegeven. Hij heeft de huidige BMI-tool afzonderlijk inhoudelijk beoordeeld en expliciet vrijgegeven. Dit legt zijn besluit vast; technische ketenproef en liveverificatie blijven afzonderlijke stappen.')
    adr = adr.replace('## Voorgesteld besluit voor publieke invoering', '## Besluit voor publieke invoering')
    adr = adr.replace('publieke invoering blijft needs owner validation.', 'publieke invoering is door Matthijs vrijgegeven.')
    adr = adr.replace('zij is niet zelfstandig geaccepteerd.', 'zij is na de samenhangende eigenaarreview door Matthijs geaccepteerd.')
    adr = adr[:adr.index('Alleen lokale kopieën worden nu gebouwd')] + '''De publieke calculator blijft de beoordeelde zelfstandige pagina, met een teruglink naar het thema en een disclaimerlink. Zij laadt uitsluitend lokale calculatorbestanden, zonder site-analytics, feedback of gegevensopslag. De navigatiecheck controleert deze twee routes als expliciete uitzondering op de volledige siteshell.

## Uitvoering en verificatie

De gecontroleerde release bouwt voort op origin/main b255554. Bestaande medische pagina’s krijgen alleen de beoordeelde thema-ingangen; andere lokale wijzigingen blijven uitgesloten. De twee nieuwe Brevo-lijsten zijn 13 (patiënten) en 14 (zorgprofessionals). Native double opt-in, voorkeuren en uitschrijving blijven leidend. Campagnedrafts en verzending vereisen afzonderlijke vrijgave.

De medische eigenaarreview en livevrijgave zijn gegeven. Technische ketenproef, deployment en livebewijs worden afzonderlijk vastgelegd in het releaseverslag. Trouw krijgt pas een inhoudelijke kaart na beschikbaarheid van de exacte bron; het ontbreken ervan blokkeert de overige themaroute niet.
'''
    write('docs/decisions/ADR-0016-artrose-themaroute-en-nieuwsbrief.md', adr)
    index = base('docs/decisions/ADR-INDEX.md')
    index = index.replace('\nStatus notes:', '\n| [ADR-0016](ADR-0016-artrose-themaroute-en-nieuwsbrief.md) | Artrose-themaroute en onderwerpgerichte nieuwsbrief | Accepted | Themapagina, homepage, contextuele ingangen en twee expliciete nieuwsbriefkeuzes | Samenhangende eigenaarreview en publieke vrijgave door Matthijs op 11 oktober 2026; BMI afzonderlijk vrijgegeven |\n\nStatus notes:')
    write('docs/decisions/ADR-INDEX.md', index)

    catalog = json.loads(base('docs/design-system/components.json'))
    local_catalog = json.loads((source / 'docs/design-system/components.json').read_text())
    for entry in local_catalog['components']:
        if entry['id'] in ['artrose-theme', 'artrose-home-entry', 'artrose-context-entry']:
            entry['source'] = entry['source'].replace('concepten/artrose-gewicht-bewegen/integratie/', '')
            entry['sources'] = ['styles.css', 'assets/artrose-thema.css'] + (['assets/artrose-newsletter.js'] if entry['id'] == 'artrose-theme' else [])
            entry['rule'] = entry['rule'].replace('Lokaal concept; publieke invoering volgt Proposed ADR-0016.', 'Publieke variant volgens Accepted ADR-0016.').replace('in dit lokale concept ', '')
            catalog['components'].append(entry)
    catalog['components'].append({'id': 'bmi-tool', 'name': 'Meer dan je BMI', 'source': 'meer-dan-je-bmi.html', 'selector': '.bmi-card', 'markers': ['bmi-card'], 'sources': ['styles.css'] + ['assets/bmi/' + name for name in ['module.css', 'logic.js', 'terms.js', 'module.js', 'story.js', 'flow.js']], 'rule': 'Beoordeelde zelfstandige BMI-uitleg met lokale invoer; geen analytics, feedback of gegevensopslag. Gedeelde calculatorbron onder assets/bmi. Teruglink naar thema en disclaimer verplicht; mobiel en reduced motion behouden tekstuele resultaten. Geen diagnostische uitkomst of behandeladvies. ADR-0016 Accepted.'})
    write('docs/design-system/components.json', json.dumps(catalog, ensure_ascii=False, indent=2) + '\n')
    design = base('docs/site/DESIGN_SYSTEM.md') + '''
## Artrose-themaroute en BMI — vrijgave 11 oktober 2026

De goedgekeurde themaroute gebruikt één gedeelde compositiebron `assets/artrose-thema.css` voor hub, homepageblok en alle contextuele ingangen. Bestaande sitekleuren, knoppen, koppen en leeskaarten blijven uit styles.css komen. Dit is een begrensde themacompositie binnen het bestaande designsysteem. Vier inhoudelijke delen gaan vooraf aan het volledige nieuwsbriefpaneel. Intro, sticky themanavigatie en onderzoekstekst houden de inschrijving bereikbaar. De themarij staat onder de vaste header (86 px; 80 px tot 520 px), is 66 px hoog (56 px mobiel) en schuift horizontaal bij ruimtegebrek; sectieankers en focus houden met beide balken rekening. Nieuwsbriefkop en tekst beslaan de paneelbreedte boven het formulier.

`assets/artrose-newsletter.js` koppelt de expliciete doelgroep aan één vaste artroselijst. Brevo verzorgt de native bevestiging. De algemene inschrijfpagina behoudt de andere onderwerpen en biedt het nieuwe onderwerp ook aan. Voor de zelfstandige BMI-pagina is de goedgekeurde calculatorbron gekopieerd naar `assets/bmi/`, zonder generieke site-JS, feedback of analytics; teruglink en disclaimer zijn verplicht. De componentcatalogus gebruikt de publieke afnemers als voorbeelden. Controle: desktop, 360/390/430 px, licht/donker en echte calculator/formulierbediening. Bestaande lokale prototypes blijven noindex en buiten deployment. ADR-0016 is door Matthijs vrijgegeven.
'''
    write('docs/site/DESIGN_SYSTEM.md', design)
    write('docs/site/PAGE_MODELS.md', base('docs/site/PAGE_MODELS.md') + '\n## Artrose-hub en zelfstandige BMI-uitleg — ADR-0016\n\nDe themapagina is een CollectionPage binnen de bestaande knie/artrose/leefstijlpijler; geen nieuwe hoofdnavigatie, zorgaanbod of patiëntportaal. Meer dan je BMI is een afzonderlijk goedgekeurde interactieve uitlegpagina, met teruglink en disclaimer in plaats van de volledige siteshell. Geen invoeropslag, analytics of koppeling van medische invoer aan nieuwsbriefinschrijving. Beide routes zijn op 11 oktober 2026 door Matthijs inhoudelijk vrijgegeven.\n')
    write('docs/site/INTERNAL_LINKING_MODEL.md', base('docs/site/INTERNAL_LINKING_MODEL.md') + '\n## Artrose, gewicht en bewegen — 11 oktober 2026\n\nDe homepage en relevante uitleg-, artikel- en projectpagina’s krijgen de beoordeelde themaroute. Patiënten gaan naar algemene uitleg of het formulier; professionals kunnen direct naar #onderzoek. De themapagina verbindt bestaande inhoud zonder behandelaanbod te verbreden. De zelfstandige BMI-pagina linkt terug naar het thema. ADR-0016 Accepted.\n')
    write('docs/site/CURRENT_SITE_STATE.md', base('docs/site/CURRENT_SITE_STATE.md') + '\n## Vrijgegeven artroseroute — 11 oktober 2026\n\nMatthijs heeft de themapagina, homepagevervanging en alle bijbehorende ingangen beoordeeld en voor publicatie vrijgegeven. De huidige BMI-tool is afzonderlijk inhoudelijk beoordeeld en vrijgegeven. Release vanaf origin/main b255554, met uitsluiting van andere lokale wijzigingen. Nieuwe routes: artrose-gewicht-bewegen.html en meer-dan-je-bmi.html. Publicatie- en livebewijs: docs/site/reviews/publicatie-artrose-gewicht-bewegen-2026-10-11.md.\n')
    # Save the exact reviewed authoring input without generated demo copies.
    for name in ['hub.html', 'theme.css', 'newsletter.js', 'newsletter-plan.json', 'build.py', 'check.py', 'preview.js', 'qa.html', 'release.py', 'release_support.py']:
        if (here / name).exists():
            write('concepten/artrose-gewicht-bewegen/' + name, (here / name).read_text())
    for name in ['index.html', 'module.css', 'logic.js', 'terms.js', 'module.js', 'story.js', 'flow.js']:
        write('concepten/meer-dan-je-bmi/' + name, (source / 'concepten/meer-dan-je-bmi' / name).read_text())
    report = source / 'docs/site/reviews/publicatie-artrose-gewicht-bewegen-2026-10-11.md'
    if report.exists():
        write('docs/site/reviews/' + report.name, report.read_text())
    hashes = {name: hashlib.sha256((source / 'concepten/meer-dan-je-bmi' / name).read_bytes()).hexdigest() for name in ['index.html', 'module.css', 'logic.js', 'terms.js', 'module.js', 'story.js', 'flow.js']}
    hashes['hub.html'] = hashlib.sha256((here / 'hub.html').read_bytes()).hexdigest()
    write('concepten/artrose-gewicht-bewegen/approved-source-hashes.json', json.dumps({'owner': 'Matthijs van Dam', 'approved_on': '2026-10-11', 'source_sha256': hashes}, indent=2) + '\n')
    subprocess.run(['python3', 'tools/design_system.py', '--build'], cwd=target, check=True)
