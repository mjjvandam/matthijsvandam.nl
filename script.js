const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const year = document.querySelector("[data-year]");
const contactForm = document.querySelector("[data-contact-form]");
const contactStatus = document.querySelector("[data-contact-status]");
const root = document.documentElement;
const themeStorageKey = "mvd-theme";

if (year) {
  year.textContent = new Date().getFullYear();
}

const preferredTheme = () =>
  window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";

const currentTheme = () => root.getAttribute("data-theme") || preferredTheme();

const setTheme = (theme, persist = true) => {
  root.setAttribute("data-theme", theme);
  if (persist) {
    window.localStorage?.setItem(themeStorageKey, theme);
  }
  const themeToggle = document.querySelector("[data-theme-toggle]");
  if (!themeToggle) return;
  const isDark = theme === "dark";
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute("aria-label", isDark ? "Lichte modus inschakelen" : "Donkere modus inschakelen");
};

const storedTheme = window.localStorage?.getItem(themeStorageKey);
if (storedTheme === "dark" || storedTheme === "light") {
  setTheme(storedTheme, false);
}

window.matchMedia?.("(prefers-color-scheme: dark)").addEventListener?.("change", () => {
  const savedTheme = window.localStorage?.getItem(themeStorageKey);
  if (savedTheme !== "dark" && savedTheme !== "light") {
    setTheme(preferredTheme(), false);
  }
});

if (header && navToggle) {
  const themeToggle = document.createElement("button");
  themeToggle.className = "theme-toggle";
  themeToggle.type = "button";
  themeToggle.setAttribute("data-theme-toggle", "");
  themeToggle.innerHTML = '<span class="theme-toggle-icon" aria-hidden="true"></span>';
  header.insertBefore(themeToggle, navToggle);
  setTheme(currentTheme(), false);

  themeToggle.addEventListener("click", () => {
    setTheme(currentTheme() === "dark" ? "light" : "dark");
  });
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

document.querySelectorAll("[data-professional-email]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const user = link.getAttribute("data-user")?.split("").reverse().join("");
    const domain = link.getAttribute("data-domain")?.split("").reverse().join("");
    if (!user || !domain) return;
    window.location.href = `mailto:${user}@${domain}`;
  });
});

const expertiseImageFor = (card, label) => {
  const topic = card.getAttribute("data-topic") || "";
  const normalizedLabel = label.toLowerCase();
  if (topic.includes("leefstijl") || normalizedLabel.includes("herstel")) {
    return "assets/article-knee-osteoarthritis-support.jpg";
  }
  if (topic.includes("knie") || normalizedLabel.includes("knie") || normalizedLabel.includes("sport")) {
    return "assets/article-knee-osteoarthritis-support.jpg";
  }
  if (topic.includes("enkel") || normalizedLabel.includes("enkel")) {
    return "assets/expertise-ankle-editorial.jpg";
  }
  return "assets/expertise-forefoot-editorial.jpg";
};

document.querySelectorAll(".expertise-card .article-card-body").forEach((body) => {
  const card = body.closest(".expertise-card");
  if (!card || body.querySelector(".expertise-flip")) return;

  const label = body.querySelector(".article-label")?.textContent?.trim() || "Expertise";
  const title = body.querySelector("h3")?.textContent?.trim() || "";
  const description = body.querySelector("p:not(.article-label)")?.textContent?.trim() || "";
  const image = document.createElement("img");
  image.className = "expertise-card-icon expertise-card-photo";
  image.src = expertiseImageFor(card, label);
  image.alt = "";
  image.loading = "lazy";

  card.classList.add("is-flip-card");
  card.setAttribute("tabindex", "0");
  card.setAttribute("aria-label", `${title}. ${description}`);

  const inner = document.createElement("div");
  inner.className = "expertise-flip";

  const front = document.createElement("div");
  front.className = "expertise-flip-face expertise-flip-front";
  front.setAttribute("aria-hidden", "true");

  const frontTitle = document.createElement("h3");
  frontTitle.textContent = title;

  front.append(image, frontTitle);

  const back = document.createElement("div");
  back.className = "expertise-flip-face expertise-flip-back";

  const backTitle = document.createElement("h3");
  backTitle.textContent = title;

  const backDescription = document.createElement("p");
  backDescription.textContent = description;

  back.append(backTitle, backDescription);
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
  const search = panel.querySelector("[data-card-search]");
  const visibleLimit = Number.parseInt(panel.getAttribute("data-visible-limit") || "", 10);
  const allowClear = panel.getAttribute("data-allow-clear") === "true";
  const state = { search: "" };

  groups.forEach((group) => {
    const groupName = group.getAttribute("data-filter-group");
    if (!groupName) return;
    const active = group.querySelector(".filter-button.is-active");
    state[groupName] = active?.getAttribute("data-filter") || "alles";
  });

  const applyFilters = () => {
    let visibleCount = 0;
    const searchTerm = state.search.trim().toLowerCase();
    cards.forEach((card) => {
      const searchableText = [
        card.getAttribute("data-topic") || "",
        card.getAttribute("data-type") || "",
        card.textContent || "",
        card.getAttribute("aria-label") || "",
      ]
        .join(" ")
        .toLowerCase();
      const topicMatches =
        !state.topic ||
        state.topic === "alles" ||
        (card.getAttribute("data-topic") || "").split(/\s+/).includes(state.topic);
      const typeMatches =
        !state.type ||
        state.type === "alles" ||
        (card.getAttribute("data-type") || "").split(/\s+/).includes(state.type);
      const searchMatches = !searchTerm || searchableText.includes(searchTerm);
      const withinLimit = !Number.isFinite(visibleLimit) || visibleCount < visibleLimit;
      card.hidden = !(topicMatches && typeMatches && searchMatches && withinLimit);
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

  search?.addEventListener("input", () => {
    state.search = search.value || "";
    applyFilters();
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
