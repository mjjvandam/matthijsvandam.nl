/* Fixed theme preference; the native Brevo runtime handles double opt-in. */
(() => {
  const form = document.querySelector('[data-theme-newsletter]');
  if (!form) return;
  const choices = [...form.querySelectorAll('[name="mvd-newsletter-audience"]')];
  const lists = [...form.querySelectorAll('[data-theme-audience]')];
  const button = form.querySelector('[type="submit"]');
  const status = document.querySelector('#theme-load-status');
  const error = document.querySelector('#theme-form-error');
  const runtime = document.querySelector('#brevo-runtime');
  const requested = new URLSearchParams(window.location.search).get('doelgroep');
  if (!choices.some(input => input.checked)) {
    const match = choices.find(input => input.value === requested);
    if (match) match.checked = true;
  }
  const sync = () => {
    const audience = choices.find(input => input.checked)?.value;
    lists.forEach(input => {
      const checked = input.dataset.themeAudience === audience;
      const changed = input.checked !== checked;
      input.checked = checked;
      input.disabled = !input.checked;
      if (changed) input.dispatchEvent(new Event('change', {bubbles: true}));
    });
  };
  choices.forEach(input => input.addEventListener('change', sync));
  sync();
  form.addEventListener('submit', event => {
    sync();
    if (lists.filter(input => input.checked && !input.disabled).length !== 1 || !form.checkValidity()) {
      event.preventDefault();
      event.stopImmediatePropagation();
      error.textContent = 'Kies voor wie je leest en controleer de verplichte velden.';
      error.hidden = false;
      form.reportValidity();
    } else {
      error.hidden = true;
    }
  }, true);
  runtime.addEventListener('load', () => {
    button.disabled = false;
    status.hidden = true;
  });
  runtime.addEventListener('error', () => {
    button.disabled = true;
    status.textContent = 'Het formulier kon niet laden. Vernieuw de pagina of probeer het later opnieuw.';
  });
})();
