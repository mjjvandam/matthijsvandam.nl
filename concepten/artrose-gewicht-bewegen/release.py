#!/usr/bin/env python3
"""Materialize only the approved theme changes in a clean release checkout."""
import argparse
import hashlib
import importlib.util
import json
import posixpath
import re
import shutil
import subprocess
from pathlib import Path

HERE = Path(__file__).resolve().parent
SOURCE = HERE.parents[1]
STAMP = '20261011-artrose'


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--target', type=Path, required=True)
    args = parser.parse_args()
    target = args.target.resolve()
    assert target != SOURCE and (target / '.git').exists()
    def base(name):
        return subprocess.check_output(['git', 'show', 'b255554:' + name], cwd=target).decode()
    spec = importlib.util.spec_from_file_location('theme_build', HERE / 'build.py')
    build = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(build)
    build.ROOT = target
    changes = {}
    for name in build.EXISTING:
        changes[name] = build.modify(name, base(name))
    content = base('content.js')
    revised = content.replace('project.featured && project.id !== "transmuraal-tilburg-cohort"', 'project.featured')
    assert revised != content
    changes['content.js'] = revised

    # Keep the reviewed form layout, using the existing native DOI contract.
    hub = build.shell().replace('noindex, nofollow', 'index, follow')
    hub = hub.replace('/assets/portrait-matthijs-van-dam.jpg', '/assets/knee-anatomy-model-editorial.jpg')
    original = re.search(r'<form\b.*?</form>', hub, re.S)[0]
    newsletter = base('nieuwsbrief.html')
    action = json.loads((HERE / 'newsletter-plan.json').read_text())['provider_form_action']
    assert action.startswith('https://4f8d0bed.sibforms.com/serve/')
    form = original.replace('class="contact-form theme-signup" data-theme-signup', 'class="contact-form theme-signup" id="sib-form" data-theme-newsletter')
    form = form.replace('aria-label="Nieuwsbrief over artrose, gewicht en bewegen"', 'action="' + action + '" method="POST" data-type="subscription" aria-label="Nieuwsbrief over artrose, gewicht en bewegen"')
    form = form.replace('name="audience"', 'name="mvd-newsletter-audience"')
    form = form.replace('name="OPT_IN" type="checkbox"', 'name="OPT_IN" id="OPT_IN" value="1" type="checkbox" class="input_replaced"')
    # Use the native field wrappers for validation while retaining the reviewed layout.
    for name in ['FIRSTNAME', 'LASTNAME', 'EMAIL']:
        form = re.sub(r'<label>([^<]+)(<input name="' + name + r'"[^>]+>)</label>', lambda m: '<div class="sib-input sib-form-block"><div class="form__entry entry_block"><label>' + m[1] + m[2].replace('<input ', '<input class="input" id="' + name + '" data-required="true" ') + '</label><label class="entry__error entry__error--primary"></label></div></div>', form)
    form = form.replace('<label class="consent-row"><input name="OPT_IN"', '<div class="sib-optin sib-form-block" data-required="true"><div class="form__entry entry_mcq"><label class="consent-row"><input name="OPT_IN"')
    form = form.replace('Ik kan mij altijd uitschrijven.</span></label>', 'Ik kan mij altijd uitschrijven.</span></label><label class="entry__error entry__error--primary"></label></div></div>')
    form = re.sub(r'<button\b.*?</button>', '<button class="button button-primary sib-form-block__button sib-form-block__button-with-loader" type="submit" disabled>Inschrijven</button>', form, flags=re.S)
    spinner = re.search(r'<button class="button button-primary sib-form-block__button.*?(<svg.*?</svg>)', newsletter, re.S)[1]
    form = form.replace('disabled>Inschrijven</button>', 'disabled>' + spinner + 'Inschrijven</button>')
    form = re.sub(r'<p[^>]*data-preview-form-note.*?</p>', '<p class="theme-small" id="theme-load-status">Het inschrijfformulier wordt geladen…</p>', form, flags=re.S)
    form = re.sub(r'<p data-signup-status.*?</p>', '<p id="theme-form-error" role="alert" tabindex="-1" hidden></p>', form, flags=re.S)
    form = re.sub(r'<noscript>.*?</noscript>', '<noscript><p>Schakel JavaScript in om je in te schrijven.</p></noscript>', form, flags=re.S)
    form = form.replace('</form>', '''<div hidden class="sib-checkbox-group sib-form-block" data-required="true"><div class="form__entry entry_mcq"><input class="input_replaced" type="checkbox" name="lists_27[]" value="13" data-theme-audience="patienten" data-required="true" disabled><input class="input_replaced" type="checkbox" name="lists_27[]" value="14" data-theme-audience="zorgprofessionals" data-required="true" disabled><label class="entry__error entry__error--primary"></label></div></div><label hidden aria-hidden="true">Laat dit veld leeg<input class="input--hidden" type="text" name="email_address_check" autocomplete="off" tabindex="-1"></label><input type="hidden" name="locale" value="nl"></form>''')
    form = re.sub(r'(<input class="input_replaced" type="checkbox" name="lists_27\[\]"[^>]+>)', r'<div class="entry__choice"><label class="checkbox__label">\1</label></div>', form)
    form = form.replace('value="13" data-theme-audience', 'value="13" data-value="13" data-theme-audience').replace('value="14" data-theme-audience', 'value="14" data-value="14" data-theme-audience')
    # Give Brevo the same provider message/container structure as the live form.
    panels = '''<div id="sib-form-container" class="sib-form-container"><div id="error-message" class="sib-form-message-panel" role="alert" tabindex="-1"><p class="sib-form-message-panel__inner-text">Je inschrijving kon niet worden verwerkt. Probeer het later opnieuw.</p></div><div id="success-message" class="sib-form-message-panel" role="status" tabindex="-1"><p class="sib-form-message-panel__inner-text">Je ontvangt een e-mail om je inschrijving te bevestigen. Geen e-mail ontvangen? Kijk ook in je map met ongewenste e-mail (spam).</p></div><div id="sib-container">'''
    hub = hub.replace(original, panels + form + '</div></div>')
    settings = re.search(r'<script>\s*window.LOCALE.*?</script>', newsletter, re.S)[0]
    hub = hub.replace('</body>', settings + f'<script defer src="/assets/artrose-newsletter.js?v={STAMP}"></script><script defer id="brevo-runtime" src="https://sibforms.com/forms/end-form/build/main.js"></script><script src="/feedback.js?v=20260924e"></script></body>')
    schema = {'@context': 'https://schema.org', '@type': 'CollectionPage', 'name': 'Artrose, gewicht en bewegen', 'url': 'https://www.matthijsvandam.nl/artrose-gewicht-bewegen.html', 'inLanguage': 'nl', 'author': {'@type': 'Person', 'name': 'Matthijs van Dam'}}
    hub = hub.replace('</head>', '<script type="application/ld+json">' + json.dumps(schema, ensure_ascii=False) + '</script></head>')
    changes['artrose-gewicht-bewegen.html'] = hub

    # One shared production module. No analytics, feedback or generic site JS here.
    bmi = (SOURCE / 'concepten/meer-dan-je-bmi/index.html').read_text()
    bmi = bmi.replace('noindex, nofollow', 'index, follow')
    bmi = re.sub(r'<title>.*?</title>', '<title>Meer dan je BMI | Matthijs van Dam</title>', bmi)
    description = 'Bereken je BMI en lees wat de uitkomst kan betekenen voor je gezondheid en gewrichten. Met optionele uitleg over buikomvang.'
    bmi = re.sub(r'<meta name="description"[^>]+>', '<meta name="description" content="' + description + '">', bmi)
    bmi = bmi.replace('../../styles.css', f'/styles.css?v={STAMP}')
    for name in ['module.css', 'logic.js', 'terms.js', 'module.js', 'story.js', 'flow.js']:
        bmi = re.sub(r'(src|href)="' + re.escape(name) + r'(?:\?[^"]*)?"', lambda m: m[1] + '="/assets/bmi/' + name + '?v=' + sha(SOURCE / 'concepten/meer-dan-je-bmi' / name)[:12] + '"', bmi)
    bmi = bmi.replace('Matthijs van Dam · lokaal concept', 'Matthijs van Dam · Meer dan je BMI')
    bmi = bmi.replace('<span class="bmi-kicker">Matthijs van Dam · Meer dan je BMI</span>', '<a class="bmi-kicker" href="/artrose-gewicht-bewegen.html">← Artrose, gewicht en bewegen</a>')
    bmi = re.sub(r'<aside class="bmi-aside".*?</aside>', '', bmi, flags=re.S)
    bmi = bmi.replace('../artrose-gewicht-bewegen/integratie/artrose-gewicht-bewegen.html', '/artrose-gewicht-bewegen.html')
    bmi = bmi.replace('../../disclaimer.html', '/disclaimer.html')
    bmi = bmi.replace('Medische review en publicatiebesluit staan open · broncontrole 10 oktober 2026.', 'Algemene uitleg · broncontrole 10 oktober 2026.')
    social = f'''<link rel="canonical" href="https://www.matthijsvandam.nl/meer-dan-je-bmi.html"><meta property="og:type" content="website"><meta property="og:locale" content="nl_NL"><meta property="og:site_name" content="Matthijs van Dam"><meta property="og:title" content="Meer dan je BMI"><meta property="og:description" content="{description}"><meta property="og:url" content="https://www.matthijsvandam.nl/meer-dan-je-bmi.html"><meta property="og:image" content="https://www.matthijsvandam.nl/assets/knee-anatomy-model-editorial.jpg"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="Meer dan je BMI"><meta name="twitter:description" content="{description}"><meta name="twitter:image" content="https://www.matthijsvandam.nl/assets/knee-anatomy-model-editorial.jpg"><link rel="icon" href="/assets/logo-mvd-mark-v2.svg">'''
    bmi = bmi.replace('</head>', social + '</head>')
    changes['meer-dan-je-bmi.html'] = bmi

    # General signup retains all existing choices; the new theme is explicit.
    extra = ''
    for audience, list_id in [('patienten', 13), ('zorgprofessionals', 14)]:
        extra += f'<label class="consent-row" data-newsletter-topic data-newsletter-audience="{audience}"><input class="input_replaced" type="checkbox" name="lists_27[]" value="{list_id}" data-required="true" disabled><span>Artrose, gewicht en bewegen</span></label>\n'
    changes['nieuwsbrief.html'] = changes['nieuwsbrief.html'].replace('              <label class="entry__error entry__error--primary"></label>\n              </div>\n            </fieldset>', extra + '              <label class="entry__error entry__error--primary"></label>\n              </div>\n            </fieldset>', 1)

    for name, text in changes.items():
        if name.endswith('.html'):
            text = re.sub(r'(?m)^[ \t]+$', '', text)
            text = text.replace('/assets/artrose-thema.css"', f'/assets/artrose-thema.css?v={STAMP}"')
            text = re.sub(r'((?:href|src)="/?(?:\.\./)?(?:styles.css|script.js|content.js))(?:\?[^"]*)?(?=")', r'\1?v=' + STAMP, text)
            text = re.sub(r'\b(href|src)="/(?!/)([^"]*)"', lambda m: m[1] + '="' + posixpath.relpath(m[2].split('?', 1)[0].split('#',1)[0], posixpath.dirname(name) or '.') + m[2][len(m[2].split('?',1)[0].split('#',1)[0]):] + '"', text)
            if name == 'meer-dan-je-bmi.html':
                text = text.replace('<body', '<body', 1).replace('<main', '<a class="skip-link" href="#bmi-main">Ga naar inhoud</a><main id="bmi-main"', 1)
        (target / name).write_text(text)
    (target / 'assets/artrose-thema.css').write_bytes((HERE / 'theme.css').read_bytes())
    shutil.copy2(HERE / 'newsletter.js', target / 'assets/artrose-newsletter.js')
    (target / 'assets/bmi').mkdir(exist_ok=True)
    for name in ['module.css', 'logic.js', 'terms.js', 'module.js', 'story.js', 'flow.js']:
        shutil.copy2(SOURCE / 'concepten/meer-dan-je-bmi' / name, target / 'assets/bmi' / name)

    # Version-specific human approval, only for this reviewed route integration.
    register_path = target / 'PUBLICATIE_REGISTER.json'
    register = json.loads(base('PUBLICATIE_REGISTER.json'))
    for name in changes:
        if not name.endswith('.html'):
            continue
        row = next((p for p in register['pages'] if p['path'] == name), None)
        if row is None:
            row = {'path': name, 'title': re.search(r'<title>(.*?)</title>', changes[name], re.S)[1], 'spoor': 'patientinformatie'}
            register['pages'].append(row)
        row.update(verification_status='geverifieerd', verified_by='Matthijs van Dam', verified_on='2026-10-11')
        row['review_notes'] = row.get('review_notes', '') + ' 11 oktober 2026: Matthijs rondde de review van de themapagina af en gaf expliciet akkoord op publicatie met alle ingangen elders. De huidige BMI-tool is afzonderlijk expliciet inhoudelijk beoordeeld en vrijgegeven. Bestaande pagina’s krijgen uitsluitend de beoordeelde thema-ingangen; overige lokale tekstwijzigingen zijn uitgesloten.'
    register_path.write_text(json.dumps(register, ensure_ascii=False, indent=2) + '\n')
    sitemap_path = target / 'sitemap.xml'
    sitemap = base('sitemap.xml')
    for name in ['artrose-gewicht-bewegen.html', 'meer-dan-je-bmi.html']:
        assert name not in sitemap
        sitemap = sitemap.replace('</urlset>', f'  <url><loc>https://www.matthijsvandam.nl/{name}</loc><lastmod>2026-10-11</lastmod></url>\n</urlset>')
    sitemap_path.write_text(sitemap)
    from release_support import prepare_support
    prepare_support(target, SOURCE, HERE, base)
    print(f'{len(changes)} scoped source files prepared; DOI provider configuration/testing remains separate.')


if __name__ == '__main__':
    main()
