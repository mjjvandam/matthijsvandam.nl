/* Alleen demonstratie. Geen fetch, opslag, provider-script of formulierverzending. */
document.querySelectorAll('form[data-theme-signup],form.contact-form,#sib-form').forEach(form => {
  form.removeAttribute('action');
  form.addEventListener('submit', event => {
    event.preventDefault();
    event.stopImmediatePropagation();
    const status = form.querySelector('[data-signup-status]');
    if (!status) return;
    const audience = form.querySelector('[name=audience]:checked')?.value;
    status.textContent = `Zo werkt de aanmelding: je ontvangt een e-mail om je inschrijving voor ${audience === 'patienten' ? 'patiënten' : 'zorgprofessionals'} te bevestigen. Geen e-mail ontvangen? Kijk ook in je map met ongewenste e-mail (spam). Dit is een lokaal voorbeeld; er is niets verstuurd en je bent niet ingeschreven.`;
    status.hidden = false;
    status.focus({preventScroll:true});
  }, true);
  form.querySelector('button[type=submit]')?.removeAttribute('disabled');
});
const chosenAudience = new URLSearchParams(location.search).get('doelgroep');
if (['patienten','zorgprofessionals'].includes(chosenAudience)) {
  document.querySelector(`[data-theme-signup] [value="${chosenAudience}"]`)?.click();
}
// Houd ook dynamische kaarten in de lokale integratiepreview.
const routes = JSON.parse(document.querySelector('#theme-preview-routes')?.textContent || '{}');
document.addEventListener('click', event => {
  const target = event.target instanceof Element ? event.target.closest('[data-url],a[href]') : null;
  if (!target) return;
  const raw = target.getAttribute('href') || target.dataset.url;
  if (!raw) return;
  const url = new URL(raw, document.baseURI);
  if (url.origin !== location.origin) return;
  const key = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
  if (routes[key]) {
    event.preventDefault();
    event.stopImmediatePropagation();
    location.href = routes[key] + url.search + url.hash;
  }
}, true);
