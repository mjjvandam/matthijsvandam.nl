const RESEND_ENDPOINT = "https://api.resend.com/emails";
const ALLOWED_TYPES = new Set([
  "Samenwerking",
  "Onderwijs of scholing",
  "Zorgontwikkeling",
  "Onderzoek",
  "Media of publicatie",
  "Anders",
]);
const FIELD_LIMITS = {
  naam: 120,
  email: 180,
  type: 40,
  onderwerp: 160,
  bericht: 4000,
};

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const isEmail = (value = "") => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());

module.exports = async (request, response) => {
  response.setHeader("Cache-Control", "no-store");

  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ message: "Alleen POST is toegestaan." });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const contactTo = process.env.CONTACT_TO_EMAIL;
  const contactFrom = process.env.CONTACT_FROM_EMAIL;

  if (!resendApiKey || !contactTo || !contactFrom) {
    return response.status(503).json({ message: "De mailkoppeling is nog niet geconfigureerd." });
  }

  let body = request.body || {};
  if (typeof body === "string") {
    try {
      body = JSON.parse(body || "{}");
    } catch {
      return response.status(400).json({ message: "Ongeldig berichtformaat." });
    }
  }
  const naam = String(body.naam || "").trim();
  const email = String(body.email || "").trim();
  const type = String(body.type || "").trim();
  const onderwerp = String(body.onderwerp || "").trim();
  const bericht = String(body.bericht || "").trim();
  const noMedicalData = Boolean(body.geen_medische_gegevens);
  const honeypot = String(body.website || "").trim();
  const receivedAt = new Date().toLocaleString("nl-NL", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Amsterdam",
  });

  if (honeypot) {
    return response.status(200).json({ message: "Bericht ontvangen." });
  }

  if (!naam || !isEmail(email) || !type || !onderwerp || !bericht || !noMedicalData) {
    return response.status(400).json({ message: "Vul alle verplichte velden in." });
  }

  if (!ALLOWED_TYPES.has(type)) {
    return response.status(400).json({ message: "Kies een geldig type vraag." });
  }

  const tooLong =
    naam.length > FIELD_LIMITS.naam ||
    email.length > FIELD_LIMITS.email ||
    type.length > FIELD_LIMITS.type ||
    onderwerp.length > FIELD_LIMITS.onderwerp ||
    bericht.length > FIELD_LIMITS.bericht;

  if (tooLong) {
    return response.status(400).json({ message: "Een of meer velden zijn te lang." });
  }

  const subject = `Websitecontact: ${onderwerp}`;
  const text = [
    "Nieuw bericht via matthijsvandam.nl",
    "",
    `Ontvangen: ${receivedAt}`,
    `Naam: ${naam}`,
    `E-mail: ${email}`,
    `Type vraag: ${type}`,
    `Onderwerp: ${onderwerp}`,
    "Geen medische gegevens bevestigd: ja",
    "",
    "Let op: dit formulier is niet bedoeld voor medische of patientgebonden informatie.",
    "",
    bericht,
  ].join("\n");
  const html = `
    <h1>Nieuw bericht via matthijsvandam.nl</h1>
    <p><strong>Ontvangen:</strong> ${escapeHtml(receivedAt)}</p>
    <p><strong>Naam:</strong> ${escapeHtml(naam)}</p>
    <p><strong>E-mail:</strong> ${escapeHtml(email)}</p>
    <p><strong>Type vraag:</strong> ${escapeHtml(type)}</p>
    <p><strong>Onderwerp:</strong> ${escapeHtml(onderwerp)}</p>
    <p><strong>Geen medische gegevens bevestigd:</strong> ja</p>
    <p><strong>Let op:</strong> dit formulier is niet bedoeld voor medische of patientgebonden informatie.</p>
    <hr>
    <p>${escapeHtml(bericht).replaceAll("\n", "<br>")}</p>
  `;

  let resendResponse;
  try {
    resendResponse = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: contactFrom,
        to: [contactTo],
        reply_to: email,
        subject,
        text,
        html,
      }),
    });
  } catch {
    return response.status(502).json({ message: "De e-maildienst is tijdelijk niet bereikbaar." });
  }

  if (!resendResponse.ok) {
    return response.status(502).json({ message: "De e-maildienst gaf een foutmelding." });
  }

  return response.status(200).json({ message: "Bericht verzonden." });
};
