"""Build native Brevo integration and a network-free review of identical markup."""
from pathlib import Path
import html
ROOT=Path(__file__).parent
ACTION='https://4f8d0bed.sibforms.com/serve/MUIFAIr9umuP9Uc1UHYFqpzvTHykNjFhazysfTQSjzMfw3wV97G5p6J6wja3l5dmSDUtIWbz1bPypFWcbj-_hxM1wCqLNIOhCYd4nS61DtRRpn2D32QfPKXAUexE8e--bLX5lbXNvF2MJHNy36cUIBiaoevtwHYMdweuIJ9VcPVbkHCANVb8Y94WzBVL2x8PPR6F3kJ2jF8Yqj5uZg=='
# Field names, IDs and structural classes from Brevo's HTML export, 2026-09-08.
def entry(label,name,kind,autocomplete):
 return f'<div class="sib-input sib-form-block"><div class="form__entry entry_block"><div class="form__label-row"><label class="entry__label" for="{name}">{label}</label><div class="entry__field"><input class="input" id="{name}" name="{name}" type="{kind}" autocomplete="{autocomplete}" maxlength="200" data-required="true" required></div></div><label class="entry__error entry__error--primary"></label></div></div>'
choices=[]
for value,label,audience in [(6,'Algemeen',''),(5,'Voet en enkel','patienten'),(8,'Transmuraal Tilburg Cohort','patienten'),(4,'Voet en enkel','zorgprofessionals'),(7,'Transmuraal Tilburg Cohort','zorgprofessionals')]:
 attr=f' data-audience="{audience}"' if audience else ''
 choices.append(f'<div class="entry__choice"{attr}><label class="choice checkbox__label"><input type="checkbox" name="lists_27[]" value="{value}" data-value="{html.escape(label)}" data-required="true"> <span>{label}</span></label></div>')
body='''<header><a href="https://matthijsvandam.nl/">MatthijsvanDam<span>.nl</span></a></header><main>__NOTICE__<section><p class="kicker">NIEUWSBRIEF</p><h1>Schrijf je in</h1><p>Ik schrijf over diverse onderwerpen en voor verschillende doelgroepen. Schrijf je in voor de onderwerpen die je interesseren. Ik stuur je maximaal 12 keer per jaar een nieuwsbrief.</p>
<div class="sib-form"><div id="sib-form-container" class="sib-form-container">
<div id="error-message" role="alert" tabindex="-1" class="sib-form-message-panel"><div class="sib-form-message-panel__text"><span class="sib-form-message-panel__inner-text">Je aanvraag kon niet worden verwerkt. Probeer het later opnieuw.</span></div></div>
<div id="success-message" role="status" tabindex="-1" class="sib-form-message-panel"><div class="sib-form-message-panel__text"><span class="sib-form-message-panel__inner-text">Controleer je e-mail en bevestig je inschrijving met de link in het bericht.</span></div></div>
<div id="sib-container" class="sib-container--large sib-container--vertical"><form id="sib-form" method="POST" action="'''+ACTION+'''" data-type="subscription">
<fieldset><legend>Ik ben…</legend><div class="audiences"><label><input type="radio" name="audience" value="patienten" required> Patiënt</label><label><input type="radio" name="audience" value="zorgprofessionals" required> Zorgprofessional</label></div></fieldset>
<fieldset id="topics" hidden><legend>Welke onderwerpen wil je volgen?</legend><p class="hint">Je kunt meerdere onderwerpen kiezen.</p><div class="sib-checkbox-group sib-form-block" data-required="true"><div class="form__entry entry_mcq"><div class="form__label-row">'''+''.join(choices)+'''</div><label class="entry__error entry__error--primary"></label></div></div><p id="audience-note" class="hint" aria-live="polite"></p></fieldset>
<div class="names">'''+entry('Voornaam','FIRSTNAME','text','given-name')+entry('Achternaam','LASTNAME','text','family-name')+'''</div>'''+entry('E-mailadres','EMAIL','email','email')+'''
<div class="sib-optin sib-form-block" data-required="true"><div class="form__entry entry_mcq"><div class="form__label-row"><div class="entry__choice"><label class="consent"><input type="checkbox" id="OPT_IN" name="OPT_IN" value="1" required><span>Ik wil de nieuwsbrief van Matthijs van Dam ontvangen over de gekozen onderwerpen. Maximaal 12 keer per jaar. Ik kan mij altijd uitschrijven.</span></label></div></div><label class="entry__error entry__error--primary"></label></div></div>
<p class="hint">Je inschrijving gaat in nadat je deze per e-mail bevestigt. Je kunt je onderwerpen later aanpassen. <a href="https://www.matthijsvandam.nl/privacy.html">Privacyverklaring</a></p>
<div class="sib-form-block"><button class="sib-form-block__button sib-form-block__button-with-loader" form="sib-form" type="submit" disabled><svg class="icon progress-indicator__icon sib-hide-loader-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="2"/></svg>Inschrijven</button></div>
<noscript><p>Schakel JavaScript in om dit formulier te gebruiken.</p></noscript><p id="local-error" role="alert" tabindex="-1" class="hint"></p><p id="load-status" class="hint">__STATUS__</p>
<div class="honey" aria-hidden="true"><label>Laat dit veld leeg<input type="text" name="email_address_check" value="" tabindex="-1" autocomplete="off" class="input--hidden"></label></div><input type="hidden" name="locale" value="nl">
</form></div></div></div></section></main><footer>MatthijsvanDam.nl</footer>'''
for review in (True,False):
 csp="default-src 'self'; form-action 'none'; base-uri 'none'" if review else "default-src 'self'; script-src 'self' https://sibforms.com; style-src 'self' 'unsafe-inline' https://sibforms.com; connect-src https://4f8d0bed.sibforms.com; form-action https://4f8d0bed.sibforms.com; base-uri 'none'"
 scripts='<script src="form.js" defer></script>'
 if not review:scripts+='<script src="brevo-settings.js"></script><script src="enable-native.js" defer></script><script defer src="https://sibforms.com/forms/end-form/build/main.js" id="brevo-runtime"></script>'
 notice='<aside>Vormgevingsproef — inschrijven staat hier nog uit.</aside>' if review else '<aside>Besloten integratieproef — nog niet op de website gepubliceerd.</aside>'
 status='Deze vormgevingsproef verstuurt geen gegevens.' if review else 'Het inschrijfformulier wordt geladen…'
 output=f'<!doctype html><html lang="nl" data-review="{str(review).lower()}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><meta http-equiv="Content-Security-Policy" content="{csp}"><title>Nieuwsbrief · MatthijsvanDam.nl</title><link rel="stylesheet" href="style.css">{scripts}</head><body>'+body.replace('__NOTICE__',notice).replace('__STATUS__',status)+'</body></html>'
 (ROOT/('index.html' if review else 'integration.html')).write_text(output)
print('Generated review and native integration. No network requests.')
