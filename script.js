const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const year = document.querySelector("[data-year]");
const newsletterForm = document.querySelector("[data-newsletter-form]");
const newsletterStatus = document.querySelector("[data-newsletter-status]");

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

newsletterForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (newsletterStatus) {
    const data = new FormData(newsletterForm);
    const type = data.get("type") === "zorgprofessionals" ? "zorgprofessionals" : "patienten";
    newsletterStatus.textContent =
      `Dank je. Bij livegang koppelen we je aanmelding aan de nieuwsbrief voor ${type}.`;
  }
});
