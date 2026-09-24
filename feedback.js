/* Tijdelijke, vrijwillige feedbackronde. Geen bezoekgeschiedenis verlaat de browser. */
(() => {
  const campaign = 'sitefeedback-2026-09';
  const endsAt = Date.parse('2026-10-24T22:00:00Z');
  if (Date.now() >= endsAt || document.querySelector('meta[name="robots"]')?.content.includes('noindex')) return;
  const localPreview = ['localhost', '127.0.0.1'].includes(location.hostname)
    && new URLSearchParams(location.search).has('feedback-preview');
  const session = (() => { try { return window.sessionStorage; } catch { return null; } })();
  const availabilityKey = `${campaign}-available`;
  const knownAvailable = (() => { try { return session?.getItem(availabilityKey) === '1'; } catch { return false; } })();
  const availability = localPreview ? Promise.resolve({ enabled: true })
    : knownAvailable ? Promise.resolve({ enabled: true })
    : fetch('/api/feedback', { signal: AbortSignal.timeout(5000) })
      .then((response) => response.ok ? response.json() : { enabled: false })
      .then((result) => {
        if (result.enabled) { try { session?.setItem(availabilityKey, '1'); } catch { /* Private mode. */ } }
        return result;
      });
  availability
    .then(({ enabled }) => {
  if (!enabled) return;

  const seenKey = `${campaign}-pages`;
  const doneKey = `${campaign}-done`;
  const shownKey = `${campaign}-shown`;
  const local = (() => { try { return window.localStorage; } catch { return null; } })();
  const sitePath = location.pathname.replace(/\/$/, '/index.html');
  const get = (storage, key) => { try { return storage?.getItem(key); } catch { return null; } };
  const set = (storage, key, value) => { try { storage?.setItem(key, value); } catch { /* Private mode. */ } };
  let pages = [];
  try { pages = JSON.parse(get(session, seenKey) || '[]'); } catch { /* Ignore corrupt local state. */ }
  if (!Array.isArray(pages)) pages = [];
  if (!pages.includes(sitePath)) pages.push(sitePath);
  set(session, seenKey, JSON.stringify(pages.slice(-50)));

  const region = document.createElement('aside');
  region.className = 'site-feedback';
  region.setAttribute('aria-labelledby', 'site-feedback-title');
  region.hidden = true;
  region.innerHTML = `
    <button class="site-feedback-close" type="button" aria-label="Feedbackvraag sluiten" data-feedback-close>×</button>
    <p class="site-feedback-kicker">Een korte vraag</p>
    <h2 id="site-feedback-title">Hoe ervaar je deze website?</h2>
    <p>De site is nu een maand online. Je reactie helpt de website te verbeteren.</p>
    <form data-feedback-form>
      <fieldset>
        <legend>Heb je gevonden wat je zocht?</legend>
        <div class="site-feedback-options">
          <label><input type="radio" name="answer" value="yes" required> Ja</label>
          <label><input type="radio" name="answer" value="partly"> Gedeeltelijk</label>
          <label><input type="radio" name="answer" value="no"> Nee</label>
        </div>
      </fieldset>
      <details class="site-feedback-more"><summary>Wil je iets toelichten? (optioneel)</summary>
        <label class="site-feedback-note">Wat kan duidelijker of ontbreekt er?
          <textarea name="note" maxlength="500" rows="3"></textarea>
        </label>
      </details>
      <p class="site-feedback-boundary">Deel geen persoonlijke medische informatie. Voor medische vragen, afspraken of spoed zijn de officiële zorgkanalen bedoeld.</p>
      <p class="site-feedback-privacy">Je antwoord gaat per e-mail naar Matthijs en schrijft je nergens voor in. <a href="/privacy.html">Privacy</a></p>
      <label class="site-feedback-trap" aria-hidden="true">Website <input name="website" tabindex="-1" autocomplete="off"></label>
      <button class="site-feedback-submit" type="submit">Versturen</button>
      <p class="site-feedback-status" role="status" aria-live="polite" data-feedback-status></p>
    </form>`;
  document.body.append(region);

  const open = () => { set(session, shownKey, '1'); region.hidden = false; };
  const close = () => { region.hidden = true; set(local, doneKey, 'closed'); set(session, doneKey, 'closed'); };
  region.querySelector('[data-feedback-close]').addEventListener('click', close);
  const footer = document.querySelector('.site-footer .footer-links');
  let reopenButton;
  if (footer && get(local, doneKey) !== 'sent' && get(session, doneKey) !== 'sent') {
    const button = document.createElement('button');
    button.className = 'site-feedback-footer-link';
    button.type = 'button';
    button.textContent = 'Feedback over deze site';
    button.addEventListener('click', () => { open(); region.querySelector('[data-feedback-close]').focus(); });
    footer.append(button);
    reopenButton = button;
  }
  if (pages.length >= 5 && !get(local, doneKey) && !get(session, doneKey) && !get(session, shownKey)) {
    setTimeout(() => {
      if (document.visibilityState === 'visible' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
        open();
      }
    }, 8000);
  }

  const form = region.querySelector('[data-feedback-form]');
  const status = region.querySelector('[data-feedback-status]');
  const submit = region.querySelector('[type="submit"]');
  let requestId;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity() || submit.disabled) return;
    const data = new FormData(form);
    if (data.get('website')) return;
    requestId ||= crypto.randomUUID();
    submit.disabled = true;
    status.textContent = 'Bezig met versturen…';
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer: data.get('answer'), note: data.get('note'), website: '', requestId }),
        signal: AbortSignal.timeout(12000),
      });
      const result = await response.json().catch(() => ({}));
      if (response.ok && result.code === 'accepted') {
        set(local, doneKey, 'sent');
        set(session, doneKey, 'sent');
        reopenButton?.remove();
        form.querySelectorAll('fieldset, .site-feedback-more, .site-feedback-boundary, .site-feedback-privacy, .site-feedback-submit').forEach((item) => { item.hidden = true; });
        status.textContent = 'Dank je wel. Je feedback is verstuurd.';
        return;
      }
      status.textContent = result.message || 'Versturen is nu niet mogelijk.';
      if ([400, 403, 413, 415, 429, 503].includes(response.status)) submit.disabled = false;
    } catch {
      status.textContent = 'De verzendstatus is onzeker. Controleer de ontvangst voordat je opnieuw verstuurt.';
    }
  });
    }).catch(() => { /* The invitation stays hidden when the route is unavailable. */ });
})();
