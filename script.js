const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const year = document.querySelector("[data-year]");
const newsletterForm = document.querySelector("[data-newsletter-form]");
const newsletterStatus = document.querySelector("[data-newsletter-status]");
const newsletterPreview = document.querySelector("[data-newsletter-preview]");
const articleCards = Array.from(document.querySelectorAll(".article-card[data-newsletter]"));
const contactForm = document.querySelector("[data-contact-form]");
const contactStatus = document.querySelector("[data-contact-status]");

if (year) {
  year.textContent = new Date().getFullYear();
}

const syncHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
};

syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

navToggle?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("is-open") ?? false;
  header?.classList.toggle("is-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

nav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    nav.classList.remove("is-open");
    header?.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  }
});

const syncNewsletterPreview = () => {
  if (!newsletterPreview || !newsletterForm) return;
  const data = new FormData(newsletterForm);
  const type = data.get("type");
  if (type !== "patienten" && type !== "zorgprofessionals") return;
  const matchingArticles = articleCards.filter((card) => {
    const audiences = card.getAttribute("data-newsletter")?.split(/\s+/) ?? [];
    return audiences.includes(type);
  });
  const names = matchingArticles.map((card) => card.querySelector("h3")?.textContent?.trim()).filter(Boolean);
  const list = names.length
    ? '<ul>' + names.map((name) => '<li>' + name + '</li>').join('') + '</ul>'
    : '<p>Er zijn nog geen artikelen voor deze doelgroep gelabeld.</p>';
  newsletterPreview.innerHTML = '<strong>Artikelen voor deze nieuwsbrief</strong>' + list;
};

newsletterForm?.addEventListener("change", syncNewsletterPreview);

newsletterForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (newsletterStatus) {
    const data = new FormData(newsletterForm);
    const type = data.get("type") === "zorgprofessionals" ? "zorgprofessionals" : "patienten";
    newsletterStatus.textContent =
      `Dank je. Bij livegang koppelen we je aanmelding aan de nieuwsbrief voor ${type}.`;
  }
  syncNewsletterPreview();
});

contactForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!contactStatus) return;

  const formData = new FormData(contactForm);
  if (formData.get("website")) {
    contactStatus.textContent = "Dank je. Je bericht is ontvangen.";
    contactForm.reset();
    return;
  }

  contactStatus.textContent = "Je bericht wordt verzonden...";

  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Object.fromEntries(formData.entries())),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.message || "Het bericht kon niet worden verzonden.");
    }

    contactForm.reset();
    contactStatus.textContent = "Dank je. Je bericht is verzonden.";
  } catch (error) {
    contactStatus.textContent =
      "Verzenden lukt nu niet. Probeer het later opnieuw of gebruik de officiele ETZ-kanalen voor patientenzorg.";
  }
});
