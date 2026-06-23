const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const year = document.querySelector("[data-year]");
const contactForm = document.querySelector("[data-contact-form]");
const contactStatus = document.querySelector("[data-contact-status]");
const root = document.documentElement;
const themeStorageKey = "mvd-theme";
const analyticsHostnames = ["matthijsvandam.nl", "www.matthijsvandam.nl"];
const readLocalStorage = (key) => {
  try {
    return window.localStorage?.getItem(key) || null;
  } catch {
    return null;
  }
};
const writeLocalStorage = (key, value) => {
  try {
    window.localStorage?.setItem(key, value);
  } catch {
    // Storage can be unavailable in some privacy modes.
  }
};
const safeCssIdentifier = (value) => {
  if (window.CSS?.escape) return window.CSS.escape(value);
  return String(value).replace(/["\\]/g, "\\$&");
};
const shouldLoadVercelAnalytics =
  analyticsHostnames.includes(window.location.hostname) || window.location.hostname.endsWith(".vercel.app");

if (shouldLoadVercelAnalytics) {
  window.va =
    window.va ||
    function () {
      (window.vaq = window.vaq || []).push(arguments);
    };

  window.va("beforeSend", (event) => {
    if (readLocalStorage("mvd-analytics-disable") === "true") {
      return null;
    }

    if (!event?.url) {
      return event;
    }

    try {
      const url = new URL(event.url);
      const allowedParams = new Set(["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]);
      Array.from(url.searchParams.keys()).forEach((key) => {
        if (!allowedParams.has(key)) {
          url.searchParams.delete(key);
        }
      });
      url.hash = "";

      return {
        ...event,
        url: url.toString(),
      };
    } catch {
      return event;
    }
  });

  if (!document.querySelector('script[src="/_vercel/insights/script.js"]')) {
    const analyticsScript = document.createElement("script");
    analyticsScript.defer = true;
    analyticsScript.src = "/_vercel/insights/script.js";
    document.head.append(analyticsScript);
  }
}

const trackAnalyticsEvent = (name, data = {}) => {
  if (!shouldLoadVercelAnalytics || typeof window.va !== "function") return;
  window.va("event", { name, data });
};

if (year) {
  year.textContent = new Date().getFullYear();
}

const preferredTheme = () =>
  window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";

const currentTheme = () => root.getAttribute("data-theme") || preferredTheme();

const setTheme = (theme, persist = true) => {
  root.setAttribute("data-theme", theme);
  if (persist) {
    writeLocalStorage(themeStorageKey, theme);
  }
  const themeToggle = document.querySelector("[data-theme-toggle]");
  if (!themeToggle) return;
  const isDark = theme === "dark";
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute("aria-label", isDark ? "Lichte modus inschakelen" : "Donkere modus inschakelen");
};

const storedTheme = readLocalStorage(themeStorageKey);
if (storedTheme === "dark" || storedTheme === "light") {
  setTheme(storedTheme, false);
}

window.matchMedia?.("(prefers-color-scheme: dark)").addEventListener?.("change", () => {
  const savedTheme = readLocalStorage(themeStorageKey);
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

document.addEventListener("click", (event) => {
  const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
  if (!link || link.hasAttribute("data-professional-email")) return;

  const href = link.getAttribute("href") || "";
  let url;
  try {
    url = new URL(href, window.location.href);
  } catch {
    return;
  }

  const hostname = url.hostname.replace(/^www\./, "");
  if (hostname === "etz.nl" || hostname === "doctolib.com" || hostname.endsWith(".doctolib.com")) {
    trackAnalyticsEvent("official_channel_click", {
      target: hostname,
      page: window.location.pathname,
    });
    return;
  }

  if (hostname === "linkedin.com" || hostname.endsWith(".linkedin.com")) {
    trackAnalyticsEvent("external_profile_click", {
      target: "linkedin",
      page: window.location.pathname,
    });
  }
});

document.querySelectorAll("[data-professional-email]").forEach((link) => {
  link.addEventListener("click", (event) => {
    trackAnalyticsEvent("professional_email_click", {
      page: window.location.pathname,
    });
    event.preventDefault();
    const user = link.getAttribute("data-user")?.split("").reverse().join("");
    const domain = link.getAttribute("data-domain")?.split("").reverse().join("");
    if (!user || !domain) return;
    window.location.href = `mailto:${user}@${domain}`;
  });
});

const expertiseImageFor = (card, label, title) => {
  const topic = card.getAttribute("data-topic") || "";
  const searchable = `${label} ${title} ${card.getAttribute("data-search") || ""}`.toLowerCase();
  const normalizedLabel = label.toLowerCase();
  if (searchable.includes("hallux") || searchable.includes("grote teen")) {
    return "assets/tile-hallux-clinic-v2.jpg";
  }
  if (
    searchable.includes("metatarsalgie") ||
    searchable.includes("morton") ||
    searchable.includes("hamerteen") ||
    searchable.includes("klauwteen") ||
    searchable.includes("tailor") ||
    searchable.includes("bunionette") ||
    searchable.includes("voorvoetpijn") ||
    searchable.includes("bal voet")
  ) {
    return "assets/tile-voorvoet-pijn-v2.jpg";
  }
  if (topic.includes("knie") || normalizedLabel.includes("knie")) {
    return "assets/knee-anatomy-model-editorial.jpg";
  }
  if (
    searchable.includes("knieprothese") ||
    searchable.includes("totale knie") ||
    searchable.includes("artrose van de knie") ||
    searchable.includes("knie artrose")
  ) {
    return "assets/knee-anatomy-model-editorial.jpg";
  }
  if (topic.includes("knie") && searchable.includes("kraakbeen")) {
    return "assets/knee-anatomy-model-editorial.jpg";
  }
  if (
    topic.includes("leefstijl") ||
    searchable.includes("obesitas") ||
    searchable.includes("gewicht") ||
    normalizedLabel.includes("herstel")
  ) {
    return "assets/tile-leefstijl-artrose-v2.jpg";
  }
  if (
    topic.includes("achtervoet") ||
    searchable.includes("platvoet") ||
    searchable.includes("holvoet") ||
    searchable.includes("cavovarus") ||
    normalizedLabel.includes("achtervoet")
  ) {
    return "assets/tile-achtervoet-standsafwijking.jpg";
  }
  if (
    topic.includes("enkel") ||
    searchable.includes("enkel") ||
    searchable.includes("os trigonum") ||
    searchable.includes("impingement")
  ) {
    return "assets/tile-enkel-artrose-kraakbeen.jpg";
  }
  if (topic.includes("leefstijl") || normalizedLabel.includes("herstel")) {
    return "assets/tile-leefstijl-artrose-v2.jpg";
  }
  if (topic.includes("knie") || normalizedLabel.includes("knie") || normalizedLabel.includes("sport")) {
    return "assets/knee-anatomy-model-editorial.jpg";
  }
  if (topic.includes("enkel") || topic.includes("achtervoet") || normalizedLabel.includes("enkel") || normalizedLabel.includes("achtervoet")) {
    return "assets/tile-enkel-artrose-kraakbeen.jpg";
  }
  if (topic.includes("voorvoet") || normalizedLabel.includes("voorvoet")) {
    return "assets/tile-voorvoet-pijn-v2.jpg";
  }
  return "assets/tile-voorvoet-algemeen.svg";
};

const canUseHoverCards =
  !document.querySelector(".expertise-page") &&
  window.matchMedia?.("(hover: hover) and (pointer: fine)").matches &&
  window.matchMedia?.("(min-width: 841px)").matches;

const normalizeSearchText = (value) =>
  String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const searchStopWords = new Set([
  "aan",
  "achter",
  "bij",
  "binnenkant",
  "boven",
  "bovenkant",
  "buitenkant",
  "de",
  "een",
  "en",
  "heb",
  "het",
  "ik",
  "in",
  "last",
  "kant",
  "me",
  "met",
  "mijn",
  "mn",
  "of",
  "onder",
  "onderkant",
  "onderzijde",
  "op",
  "pijn",
  "rond",
  "te",
  "van",
  "voor",
  "voet",
  "waar",
  "zijde",
  "zit",
]);

const locationSearchAliases = [
  {
    triggers: ["onder mijn voet", "onder voet", "onderkant voet", "onderzijde voet", "voetzool", "zool"],
    terms: [
      "voorvoet onderzijde",
      "pijn onder bal voet",
      "metatarsalgie",
      "mtp plantaire plaat",
      "sesamoid",
      "middenvoet onderzijde",
      "voetboog",
      "peesplaat",
      "hielspoor",
      "hielpijn",
      "vetkussen",
    ],
  },
  {
    triggers: ["pijn in mijn voet", "pijn aan mijn voet", "pijn voet", "voetpijn"],
    terms: ["voorvoet", "middenvoet", "achtervoet", "hielpijn", "hallux", "enkel", "stressreactie"],
  },
  {
    triggers: ["bal van mijn voet", "bal voet", "voorvoet onder", "onder voorvoet"],
    terms: ["metatarsalgie", "morton", "mtp plantaire plaat", "sesamoid", "voorvoet onderzijde"],
  },
  {
    triggers: ["op mijn wreef", "op wreef", "pijn wreef", "wreef", "bovenop voet", "bovenkant voet"],
    terms: ["wreef", "tarsal boss", "ganglion middenvoet", "middenvoet bovenzijde", "stressreactie", "lisfranc", "holvoet"],
  },
  {
    triggers: ["binnenkant voet", "binnenzijde voet", "voetboog", "binnenboog", "boog voet"],
    terms: ["voetboog", "tibialis posterior", "platvoet", "peesplaat", "middenvoet onderzijde"],
  },
  {
    triggers: ["buitenkant voet", "buitenzijde voet", "buitenrand voet"],
    terms: ["buitenzijde voet", "peroneus", "sinus tarsi", "holvoet", "tailor", "stressreactie"],
  },
  {
    triggers: ["onder mijn hiel", "onder hiel", "onderkant hiel", "hiel onder", "hielpijn"],
    terms: ["hielpijn", "peesplaat", "hielspoor", "vetkussen", "hiel onderzijde"],
  },
  {
    triggers: ["achter mijn hiel", "achter hiel", "achterkant hiel", "achilles", "achillespees"],
    terms: ["achillespees", "haglund", "retrocalcaneaire", "posterieur impingement", "os trigonum", "hiel achterzijde"],
  },
  {
    triggers: ["binnenkant enkel", "binnenenkel", "binnenzijde enkel"],
    terms: ["binnenzijde enkel", "tibialis posterior", "platvoet", "enkelartrose", "ganglion enkel"],
  },
  {
    triggers: ["buitenkant enkel", "buitenenkel", "buitenzijde enkel"],
    terms: ["buitenzijde enkel", "enkelverzwikking", "chronische enkelinstabiliteit", "peroneus", "sinus tarsi"],
  },
  {
    triggers: ["voorkant enkel", "voorzijde enkel", "voor enkel"],
    terms: ["voorzijde enkel", "anterieur impingement", "kraakbeen enkel", "corpus liberum enkel", "enkelartrose"],
  },
  {
    triggers: ["achterkant enkel", "achterzijde enkel", "achter enkel"],
    terms: ["achterzijde enkel", "posterieur impingement", "os trigonum", "achillespees", "haglund"],
  },
  {
    triggers: ["grote teen", "grote teen gewricht", "grote-teengewricht"],
    terms: ["grote teen", "hallux", "mtp1", "mtp-1", "jicht", "sesamoid"],
  },
  {
    triggers: ["kleine teen", "kleine tenen", "tenen"],
    terms: ["kleine tenen", "hamerteen", "klauwteen", "morton", "mtp plantaire plaat", "tailor"],
  },
];

const expandedSearchTerms = (searchTerm) => {
  const normalized = normalizeSearchText(searchTerm);
  if (!normalized) return { terms: [], tokens: [] };

  const terms = new Set([normalized]);
  const tokens = normalized
    .split(/\s+/)
    .filter((word) => word.length >= 3 && !searchStopWords.has(word));
  let hasLocationAlias = false;

  locationSearchAliases.forEach(({ triggers, terms: aliasTerms }) => {
    if (triggers.some((trigger) => normalized.includes(normalizeSearchText(trigger)))) {
      hasLocationAlias = true;
      aliasTerms.forEach((term) => terms.add(normalizeSearchText(term)));
    }
  });

  if (!hasLocationAlias) {
    tokens.forEach((token) => terms.add(token));
  }

  return { terms: [...terms].filter(Boolean), tokens: hasLocationAlias ? [] : tokens };
};

if (canUseHoverCards) {
  document.querySelectorAll(".expertise-card .article-card-body").forEach((body) => {
    const card = body.closest(".expertise-card");
    if (!card || body.querySelector(".expertise-flip")) return;

    const label = body.querySelector(".article-label")?.textContent?.trim() || "Expertise";
    const title = body.querySelector("h3")?.textContent?.trim() || "";
    const description = body.querySelector("p:not(.article-label)")?.textContent?.trim() || "";
    const url = card.getAttribute("data-url");
    const image = document.createElement("img");
    image.className = "expertise-card-icon expertise-card-photo";
    image.src = expertiseImageFor(card, label, title);
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
    if (url) {
      const link = document.createElement("a");
      link.className = "article-link expertise-card-link";
      link.href = url;
      link.textContent = "Lees meer";
      back.append(link);
    }
    inner.append(front, back);
    body.replaceChildren(inner);
  });
} else {
  document.querySelectorAll(".expertise-card .article-card-body").forEach((body) => {
    const card = body.closest(".expertise-card");
    if (!card || body.querySelector("img")) return;

    const label = body.querySelector(".article-label")?.textContent?.trim() || "Expertise";
    const title = body.querySelector("h3")?.textContent?.trim() || "";
    const image = document.createElement("img");
    image.className = "expertise-card-icon expertise-card-photo";
    image.src = expertiseImageFor(card, label, title);
    image.alt = "";
    image.loading = "lazy";

    body.prepend(image);
  });
}

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
  const summaryLink = panel.parentElement?.querySelector("[data-filter-summary-link]");
  const summaryNote = panel.parentElement?.querySelector("[data-filter-summary-note]");
  const summaryLabels = {
    voorvoet: "voorvoetonderwerpen",
    enkel: "enkelonderwerpen",
    achtervoet: "achtervoetonderwerpen",
    knie: "knieonderwerpen",
    sport: "sport voet/enkel-onderwerpen",
    leefstijl: "leefstijlonderwerpen",
  };
  const summaryTopicLabels = {
    voorvoet: "voorvoetonderwerpen",
    enkel: "enkelonderwerpen",
    achtervoet: "achtervoetonderwerpen",
    knie: "knieonderwerpen",
    sport: "sport voet/enkel-onderwerpen",
    leefstijl: "leefstijlonderwerpen",
  };
  const state = { search: "" };

  const syncGroupButtons = (group, activeValue) => {
    group.querySelectorAll("[data-filter]").forEach((button) => {
      const isActive = button.getAttribute("data-filter") === activeValue;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  };

  groups.forEach((group) => {
    const groupName = group.getAttribute("data-filter-group");
    if (!groupName) return;
    const queryValue = new URLSearchParams(window.location.search).get(groupName);
    const queryButton = queryValue ? group.querySelector(`[data-filter="${safeCssIdentifier(queryValue)}"]`) : null;
    const active = queryButton || group.querySelector(".filter-button.is-active");
    state[groupName] = active?.getAttribute("data-filter") || "alles";
    syncGroupButtons(group, state[groupName]);
  });

  const inferFilterFromSearch = (group, searchTerm) => {
    if (!searchTerm) return "";
    const words = searchTerm.split(/[\s,/.-]+/).filter(Boolean);
    const buttons = Array.from(group.querySelectorAll("[data-filter]"));
    return (
      buttons.find((button) => {
        const value = normalizeSearchText(button.getAttribute("data-filter") || "");
        const label = normalizeSearchText(button.textContent || "");
        return searchTerm === value || searchTerm === label || words.includes(value);
      })?.getAttribute("data-filter") || ""
    );
  };

  const syncFiltersFromSearch = () => {
    const searchTerm = normalizeSearchText(state.search);
    groups.forEach((group) => {
      const groupName = group.getAttribute("data-filter-group");
      if (!groupName) return;
      const inferred = inferFilterFromSearch(group, searchTerm);
      if (inferred) {
        state[groupName] = inferred;
        syncGroupButtons(group, inferred);
      } else if (searchTerm) {
        state[groupName] = "alles";
        syncGroupButtons(group, "alles");
      }
    });
  };

  const applyFilters = () => {
    let visibleCount = 0;
    const searchTerm = normalizeSearchText(state.search);
    const { terms: searchTerms, tokens: searchTokens } = expandedSearchTerms(searchTerm);
    cards.forEach((card) => {
      const searchableText = [
        card.getAttribute("data-topic") || "",
        card.getAttribute("data-type") || "",
        card.getAttribute("data-search") || "",
        card.textContent || "",
        card.getAttribute("aria-label") || "",
      ]
        .join(" ")
        .toLowerCase();
      const normalizedSearchableText = normalizeSearchText(searchableText);
      const topicMatches =
        searchTerm ||
        !state.topic ||
        state.topic === "alles" ||
        (card.getAttribute("data-topic") || "").split(/\s+/).includes(state.topic);
      const typeMatches =
        searchTerm ||
        !state.type ||
        state.type === "alles" ||
        (card.getAttribute("data-type") || "").split(/\s+/).includes(state.type);
      const searchMatches =
        !searchTerm ||
        searchTerms.some((term) => normalizedSearchableText.includes(term)) ||
        (searchTokens.length > 0 && searchTokens.every((token) => normalizedSearchableText.includes(token)));
      const withinLimit = !Number.isFinite(visibleLimit) || visibleCount < visibleLimit;
      card.hidden = !(topicMatches && typeMatches && searchMatches && withinLimit);
      if (!card.hidden) visibleCount += 1;
    });
      target.querySelectorAll(".expertise-topic-section").forEach((section) => {
        const sectionHasVisibleCards = Array.from(section.querySelectorAll("[data-topic]")).some((card) => !card.hidden);
        section.hidden = !sectionHasVisibleCards;
      });
      if (empty) empty.hidden = visibleCount !== 0;
    if (summaryLink) {
      const topic = state.topic || "alles";
      const baseHref = summaryLink.getAttribute("data-base-href") || summaryLink.getAttribute("href") || "";
      const label = summaryLabels[topic] || "onderwerpen";
      const noteLabel = summaryTopicLabels[topic] || "onderwerpen";
      summaryLink.textContent = `Bekijk alle ${label}`;
      summaryLink.setAttribute("href", topic === "alles" ? baseHref : `${baseHref}?topic=${encodeURIComponent(topic)}`);
      if (summaryNote && Number.isFinite(visibleLimit)) {
        summaryNote.textContent = `Een selectie van ${visibleLimit} ${noteLabel}.`;
      }
      if (Number.isFinite(visibleLimit)) {
        summaryLink.setAttribute(
          "aria-label",
          `Op de homepage staan maximaal ${visibleLimit} onderwerpen per filter. Bekijk alle ${label}.`
        );
      }
    }
  };

  groups.forEach((group) => {
    const groupName = group.getAttribute("data-filter-group");
    group.querySelectorAll("[data-filter]").forEach((button) => {
      button.addEventListener("click", () => {
        const isClearing = allowClear && button.classList.contains("is-active");
        state[groupName] = isClearing ? "alles" : button.getAttribute("data-filter") || "alles";
        syncGroupButtons(group, isClearing ? "alles" : state[groupName]);
        applyFilters();
      });
    });
  });

  search?.addEventListener("input", () => {
    state.search = search.value || "";
    syncFiltersFromSearch();
    applyFilters();
  });

  applyFilters();
});

document.querySelectorAll("[data-professional-article-filters]").forEach((panel) => {
  const selector = panel.getAttribute("data-filter-target");
  const target = selector ? document.querySelector(selector) : null;
  if (!target) return;

  const empty = target.parentElement?.querySelector("[data-professional-filter-empty]");
  const buttons = Array.from(panel.querySelectorAll("[data-professional-filter]"));
  const topicMatchers = {
    artrose: (topics, text) => topics.includes("artrose") || text.includes("artrose"),
    knie: (topics, text) => topics.includes("knie-kraakbeen") || text.includes("knie"),
    "voet-enkel": (topics, text) =>
      topics.includes("voet-en-enkel") || text.includes("voet") || text.includes("enkel"),
    onderwijs: (topics, text) => topics.includes("onderwijs") || text.includes("onderwijs"),
    samenwerken: (_topics, text) =>
      ["samenwerking", "samenwerken", "netwerk", "transmuraal", "zorgpad", "verbinden", "regio"].some(
        (term) => text.includes(term)
      ),
  };

  const applyProfessionalFilter = (filter) => {
    const cards = Array.from(target.querySelectorAll("[data-topics]"));
    let visibleCount = 0;
    cards.forEach((card) => {
      const topics = (card.getAttribute("data-topics") || "").split(/\s+/).filter(Boolean);
      const text = (card.textContent || "").toLowerCase();
      const matches = filter === "alles" || topicMatchers[filter]?.(topics, text);
      card.hidden = !matches;
      if (matches) visibleCount += 1;
    });
    buttons.forEach((button) => {
      const isActive = button.getAttribute("data-professional-filter") === filter;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
    if (empty) empty.hidden = visibleCount !== 0;
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      applyProfessionalFilter(button.getAttribute("data-professional-filter") || "alles");
    });
  });

  applyProfessionalFilter("alles");
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
