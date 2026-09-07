const contactForm=document.querySelector("[data-contact-form]");
const contactStatus=document.querySelector("[data-contact-status]");
contactForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!contactStatus || contactForm.dataset.sending === "true") return;
  if (!contactForm.reportValidity()) return;
  const formData = new FormData(contactForm);
  if (formData.get("website")) return;
  contactForm.dataset.sending = "true";
  const submit = contactForm.querySelector('[type="submit"]');
  if (submit) submit.disabled = true;
  const requestId = contactForm.dataset.requestId || crypto.randomUUID();
  contactForm.dataset.requestId = requestId;
  contactStatus.textContent = "Je bericht wordt verzonden...";
  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({...Object.fromEntries(formData.entries()),
        website: String(formData.get("website") || ""),
        geen_medische_gegevens: formData.has("geen_medische_gegevens"), requestId}),
      signal: AbortSignal.timeout(12000),
    });
    const result = await response.json().catch(() => ({}));
    if (response.ok && result.code === "accepted") {
      contactForm.reset();
      delete contactForm.dataset.requestId;
      contactStatus.textContent = "Dank je. Je bericht is verzonden.";
    } else if ([400, 403, 413, 415, 429, 503].includes(response.status)) {
      contactStatus.textContent = result.message || "Verzenden is nu niet mogelijk. Je tekst is behouden.";
    } else {
      contactStatus.textContent = result.message || "De verzendstatus is onzeker. Verstuur het bericht niet opnieuw.";
      return; // Keep button locked on ambiguous or duplicate responses.
    }
    contactForm.dataset.sending = "false";
    if (submit) submit.disabled = false;
  } catch {
    contactStatus.textContent = "De verzendstatus is onzeker. Je tekst is behouden. Verstuur het bericht niet opnieuw voordat de ontvangst is gecontroleerd.";
  }
});
