const contactForm=document.querySelector("[data-contact-form]");
const contactStatus=document.querySelector("[data-contact-status]");
const newMessage = document.querySelector("[data-contact-new]");
newMessage?.addEventListener("click", () => {
  contactForm.reset();
  delete contactForm.dataset.requestId;
  delete contactForm.dataset.sent;
  contactForm.dataset.sending = "false";
  contactStatus.textContent = "";
  newMessage.hidden = true;
  const submit = contactForm.querySelector('[type="submit"]');
  submit.disabled = false;
  submit.textContent = "Versturen";
  contactForm.querySelector('[name="naam"]').focus();
});
function showStatus(message) {
  contactStatus.textContent = message;
  contactStatus.focus();
}
contactForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!contactStatus || contactForm.dataset.sending === "true") return;
  if (!contactForm.reportValidity()) return;
  const formData = new FormData(contactForm);
  if (formData.get("website")) return;
  contactForm.dataset.sending = "true";
  const submit = contactForm.querySelector('[type="submit"]');
  if (submit) { submit.disabled = true; submit.textContent = "Bezig met versturen…"; }
  const requestId = contactForm.dataset.requestId || crypto.randomUUID();
  contactForm.dataset.requestId = requestId;
  contactStatus.textContent = "Je bericht wordt verzonden...";
  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({...Object.fromEntries(formData.entries()),
        website: String(formData.get("website") || ""),
        contactgrenzen_begrepen: formData.has("contactgrenzen_begrepen"), requestId}),
      signal: AbortSignal.timeout(12000),
    });
    const result = await response.json().catch(() => ({}));
    if (response.ok && result.code === "accepted") {
      contactForm.dataset.sent = "true";
      newMessage.hidden = false;
      showStatus("Bedankt voor je bericht.\nJe bericht is verzonden. Je hoeft het niet opnieuw te versturen.");
      return;
    } else if ([400, 403, 413, 415, 429, 503].includes(response.status)) {
      showStatus((result.message || "Verzenden is nu niet mogelijk.") + " Je ingevulde gegevens zijn behouden.");
    } else {
      showStatus(result.message || "De verzendstatus is onzeker. Verstuur het bericht niet opnieuw.");
      return; // Keep button locked on ambiguous or duplicate responses.
    }
    contactForm.dataset.sending = "false";
    if (submit) { submit.disabled = false; submit.textContent = "Versturen"; }
  } catch {
    showStatus("De verzendstatus is onzeker. Je tekst is behouden. Verstuur het bericht niet opnieuw voordat de ontvangst is gecontroleerd.");
  }
});
