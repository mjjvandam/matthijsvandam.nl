const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const year = document.querySelector("[data-year]");
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

const expertiseIconFor = (card, label) => {
  const topic = card.getAttribute("data-topic") || "";
  const normalizedLabel = label.toLowerCase();
  if (topic.includes("leefstijl") || normalizedLabel.includes("herstel")) {
    return normalizedLabel.includes("bewegen") || normalizedLabel.includes("stappen")
      ? "assets/expertise-walking-person.svg"
      : "assets/expertise-care-pathway.svg";
  }
  if (topic.includes("knie") || normalizedLabel.includes("knie") || normalizedLabel.includes("sport")) {
    return "assets/expertise-knee-anatomy.svg";
  }
  if (topic.includes("enkel") || normalizedLabel.includes("enkel")) {
    return "assets/expertise-ankle-anatomy.svg";
  }
  return "assets/expertise-foot-anatomy.svg";
};

document.querySelectorAll(".expertise-card .article-card-body").forEach((body) => {
  const card = body.closest(".expertise-card");
  if (!card || body.querySelector(".expertise-flip")) return;

  const label = body.querySelector(".article-label")?.textContent?.trim() || "Expertise";
  const title = body.querySelector("h3")?.textContent?.trim() || "";
  const description = body.querySelector("p:not(.article-label)")?.textContent?.trim() || "";
  const existingIcon = body.querySelector(".expertise-card-icon");
  const icon = existingIcon || document.createElement("img");

  if (!existingIcon) {
    icon.className = "expertise-card-icon";
    icon.src = expertiseIconFor(card, label);
    icon.alt = "";
    icon.loading = "lazy";
  }

  card.classList.add("is-flip-card");
  card.setAttribute("tabindex", "0");
  card.setAttribute("aria-label", `${title}. ${description}`);

  const inner = document.createElement("div");
  inner.className = "expertise-flip";

  const front = document.createElement("div");
  front.className = "expertise-flip-face expertise-flip-front";
  front.setAttribute("aria-hidden", "true");

  const frontLabel = document.createElement("p");
  frontLabel.className = "article-label";
  frontLabel.textContent = label;

  const frontTitle = document.createElement("h3");
  frontTitle.textContent = title;

  front.append(icon, frontLabel, frontTitle);

  const back = document.createElement("div");
  back.className = "expertise-flip-face expertise-flip-back";

  const backLabel = document.createElement("p");
  backLabel.className = "article-label";
  backLabel.textContent = label;

  const backTitle = document.createElement("h3");
  backTitle.textContent = title;

  const backDescription = document.createElement("p");
  backDescription.textContent = description;

  back.append(backLabel, backTitle, backDescription);
  inner.append(front, back);
  body.replaceChildren(inner);
});

document.querySelectorAll("[data-card-filter-panel]").forEach((panel) => {
  const selector = panel.getAttribute("data-filter-target");
  if (!selector) return;
  const target = document.querySelector(selector);
  if (!target) return;
  const groups = Array.from(panel.querySelectorAll("[data-filter-group]"));
  const cards = Array.from(target.querySelectorAll("[data-topic]"));
  const empty = target.parentElement?.querySelector("[data-filter-empty]");
  const visibleLimit = Number.parseInt(panel.getAttribute("data-visible-limit") || "", 10);
  const allowClear = panel.getAttribute("data-allow-clear") === "true";
  const state = {};

  groups.forEach((group) => {
    const groupName = group.getAttribute("data-filter-group");
    if (!groupName) return;
    const active = group.querySelector(".filter-button.is-active");
    state[groupName] = active?.getAttribute("data-filter") || "alles";
  });

  const applyFilters = () => {
    let visibleCount = 0;
    cards.forEach((card) => {
      const topicMatches =
        !state.topic ||
        state.topic === "alles" ||
        (card.getAttribute("data-topic") || "").split(/\s+/).includes(state.topic);
      const typeMatches =
        !state.type ||
        state.type === "alles" ||
        (card.getAttribute("data-type") || "").split(/\s+/).includes(state.type);
      const withinLimit = !Number.isFinite(visibleLimit) || visibleCount < visibleLimit;
      card.hidden = !(topicMatches && typeMatches && withinLimit);
      if (!card.hidden) visibleCount += 1;
    });
    if (empty) empty.hidden = visibleCount !== 0;
  };

  groups.forEach((group) => {
    const groupName = group.getAttribute("data-filter-group");
    group.querySelectorAll("[data-filter]").forEach((button) => {
      button.addEventListener("click", () => {
        const isClearing = allowClear && button.classList.contains("is-active");
        state[groupName] = isClearing ? "alles" : button.getAttribute("data-filter") || "alles";
        group.querySelectorAll("[data-filter]").forEach((item) => {
          item.classList.toggle("is-active", !isClearing && item === button);
        });
        applyFilters();
      });
    });
  });

  applyFilters();
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
      "Verzenden lukt nu niet. Probeer het later opnieuw of gebruik de officiële ETZ-kanalen voor patiëntenzorg.";
  }
});
