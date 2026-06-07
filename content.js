(function () {
  const projects = [
    {
      id: "leefstijlgerichte-kansen-orthopedie",
      title: "Leefstijlgerichte kansen in de orthopedie",
      label: "NOV-project",
      summary:
        "Een project over teachable moments, patiëntperspectief en praktische handvatten om leefstijl zorgvuldig bespreekbaar te maken.",
      image: "assets/article-knee-osteoarthritis-support.jpg",
      imageAlt: "Respectvol gesprek over knieartrose, bewegen en herstel",
      url: "projecten/leefstijlgerichte-kansen-orthopedie.html",
      featured: true,
    },
    {
      id: "transmuraal-tilburg-cohort",
      title: "Transmuraal Tilburg Cohort",
      label: "Transmurale zorg",
      summary:
        "Een digitaal transmuraal zorgpad voor artrose en obesitas, met aandacht voor ziekenhuiszorg, regio, leefstijl en evaluatie.",
      image: "assets/project-transmuraal-tilburg-cohort-editorial.jpg",
      imageAlt: "Multidisciplinair overleg over digitaal zorgpad, artrose en leefstijl",
      url: "projecten/transmuraal-tilburg-cohort.html",
      featured: true,
    },
    {
      id: "we-walk",
      title: "We Walk",
      label: "Digitale innovatie",
      summary:
        "Een project met Tilburg University over digitale ondersteuning van bewegen bij patiënten en ziekenhuismedewerkers.",
      image: "assets/project-we-walk-editorial.jpg",
      imageAlt: "Smartphone met AR-wandelroute op een rustige campus",
      url: "projecten/we-walk.html",
      featured: true,
    },
    {
      id: "3d-planning-voet-enkel",
      title: "3D-planning bij voet- en enkelchirurgie",
      label: "3D-planning",
      summary:
        "Van CT-gebaseerde planning naar patiënt-specifieke hulpmiddelen bij complexe voet- en enkelchirurgie.",
      image: "assets/article-3d-planning-lab.jpg",
      imageAlt: "3D-geprint voetmodel en planning in een ziekenhuislab",
      url: "projecten/3d-planning-voet-enkel.html",
      featured: true,
    },
  ];

  const articles = [
    {
      id: "footprint-quick-scan-medewerkers",
      title: "FOOTprint Quick Scan op 30 juni",
      label: "Medewerkers",
      summary: "Een laagdrempelige voetscreening voor ETZ-medewerkers door drs. Matthijs van Dam en schoentechnicus Joep van Buchrnhornen. De 35 beschikbare plekken zijn inmiddels gevuld.",
      image: "assets/article-footprint-quick-scan-editorial.jpg",
      imageAlt: "Voetscreening met werkschoenen, inlegzolen en voetmodel",
      url: "artikelen/footprint-quick-scan-medewerkers.html",
      date: "2026-06-30",
      audience: ["zorgprofessionals"],
      topics: ["voet-en-enkel", "preventie"],
    },
    {
      id: "patientpanel-leefstijl-orthopedie",
      title: "Online patiëntpanel over leefstijl en orthopedie",
      label: "Patiënten gezocht",
      summary:
        "Voor maandag 29 juni 2026 zoeken we patiënten die online willen meedenken over duidelijke en respectvolle leefstijlinformatie.",
      image: "assets/article-knee-osteoarthritis-support.jpg",
      imageAlt: "Respectvol gesprek over knieartrose, bewegen en herstel",
      url: "artikelen/patientpanel-leefstijl-orthopedie.html",
      date: "2026-06-29",
      audience: ["patienten"],
      topics: ["leefstijl", "onderzoek"],
      project: "leefstijlgerichte-kansen-orthopedie",
    },
    {
      id: "heracleum-hulpfonds-subsidie-transmuraal-tilburg-cohort",
      title: "Heracleum Hulpfonds kent subsidie toe aan Transmuraal Tilburg Cohort",
      label: "December 2025",
      summary: "Over de subsidie voor de onderzoeksopzet en dataverzameling binnen het digitale zorgpad.",
      image: "assets/project-heracleum-logo.jpg",
      imageAlt: "Logo van het Heracleum Hulpfonds",
      imageContain: true,
      url: "artikelen/heracleum-hulpfonds-subsidie-transmuraal-tilburg-cohort.html",
      date: "2025-12-01",
      audience: ["patienten", "zorgprofessionals"],
      topics: ["artrose", "leefstijl", "onderzoek"],
      project: "transmuraal-tilburg-cohort",
    },
    {
      id: "we-walk-ar-campusroute-tilburg",
      title: "We Walk prototype: wandelen door een AR-route op de campus",
      label: "Najaar 2025",
      summary: "Over een door een Digital Sciences-student ontwikkeld AR-prototype voor een mogelijke campusroute.",
      image: "assets/project-we-walk-editorial.jpg",
      imageAlt: "Smartphone met AR-wandelroute op een rustige campus",
      url: "artikelen/we-walk-ar-campusroute-tilburg.html",
      date: "2025-10-01",
      audience: ["patienten", "zorgprofessionals"],
      topics: ["leefstijl", "onderzoek", "digitale-zorg"],
      project: "we-walk",
    },
    {
      id: "digitaal-zorgpad-artrose-obesitas",
      title: "Leefstijlcoalitie-voucher voor digitale artrosezorg in Tilburg",
      label: "Augustus 2025",
      summary: "Over de implementatievoucher voor een digitale en persoonlijke aanpak rond artrose en obesitas.",
      image: "assets/article-digital-care-pathway-editorial.jpg",
      imageAlt: "Tablet met digitaal zorgpad en knie-anatomiemodel in een spreekkamer",
      url: "artikelen/digitaal-zorgpad-artrose-obesitas.html",
      date: "2025-08-01",
      audience: ["patienten", "zorgprofessionals"],
      topics: ["artrose", "leefstijl", "onderzoek"],
      project: "transmuraal-tilburg-cohort",
    },
    {
      id: "vaillant-fonds-digitaal-zorgpad",
      title: "Vaillant Fonds ondersteunt verdere ontwikkeling digitaal zorgpad",
      label: "2025",
      summary: "Over de bijdrage voor de verdere ontwikkeling van het digitale zorgpad binnen het Transmuraal Tilburg Cohort.",
      image: "assets/article-digital-care-pathway-editorial.jpg",
      imageAlt: "Tablet met digitaal zorgpad en knie-anatomiemodel in een spreekkamer",
      url: "artikelen/vaillant-fonds-digitaal-zorgpad.html",
      date: "2025-07-01",
      audience: ["patienten", "zorgprofessionals"],
      topics: ["artrose", "leefstijl", "onderzoek"],
      project: "transmuraal-tilburg-cohort",
    },
    {
      id: "revisie-artrodese-niet-vastgegroeid-patienten",
      title: "Niet vastgegroeide artrodese: wat betekent revisie-artrodese?",
      label: "Patiënten",
      summary:
        "Uitleg over pseudoartrose, een niet-vastgegroeide artrodese en hoe 3D-planning kan helpen bij complexe revisiechirurgie van voet en enkel.",
      image: "assets/article-3d-planning-lab.jpg",
      imageAlt: "3D-geprint voetmodel en planning in een ziekenhuislab",
      url: "artikelen/revisie-artrodese-niet-vastgegroeid-patienten.html",
      date: "2025-06-01",
      audience: ["patienten"],
      topics: ["voet-en-enkel", "onderzoek"],
      project: "3d-planning-voet-enkel",
    },
    {
      id: "patient-specifieke-instrumentatie-voet-enkel-professionals",
      title: "Patiënt-specifieke instrumentatie bij complexe voet- en enkelchirurgie",
      label: "Zorgprofessionals",
      summary:
        "Professionele duiding van 3D-planning, custom drill guides en schroefpositionering bij revisie-artrodese in gecompromitteerd bot.",
      image: "assets/article-3d-planning-lab.jpg",
      imageAlt: "3D-geprint voetmodel en planning in een ziekenhuislab",
      url: "artikelen/patient-specifieke-instrumentatie-voet-enkel-professionals.html",
      date: "2025-06-01",
      audience: ["zorgprofessionals"],
      topics: ["voet-en-enkel", "onderzoek"],
      project: "3d-planning-voet-enkel",
    },
    {
      id: "leefstijlzorg-tweede-lijn-professionals",
      title: "Leefstijlzorg in de tweede lijn: zorgvuldig signaleren en verbinden",
      label: "Zorgprofessionals",
      summary: "Een genuanceerde beschouwing over signaleren, afbakenen en verwijzen binnen passende leefstijlzorg.",
      image: "assets/article-knee-osteoarthritis-support.jpg",
      imageAlt: "Respectvol gesprek over knieartrose, bewegen en herstel",
      url: "artikelen/leefstijlzorg-tweede-lijn-professionals.html",
      date: "2025-05-01",
      audience: ["zorgprofessionals"],
      topics: ["artrose", "leefstijl", "onderzoek"],
    },
    {
      id: "artrosezorg-transitie-professionals",
      title: "Artrosezorg in transitie: wat vraagt dit van professionals?",
      label: "Zorgprofessionals",
      summary:
        "Professionele duiding van het NTvG-artikel over educatie, oefentherapie, leefstijl, netwerkzorg en digitale monitoring.",
      image: "assets/article-knee-osteoarthritis-support.jpg",
      imageAlt: "Respectvol gesprek over knieartrose, bewegen en herstel",
      url: "artikelen/artrosezorg-transitie-professionals.html",
      date: "2026-01-01",
      audience: ["zorgprofessionals"],
      topics: ["artrose", "leefstijl", "onderzoek"],
    },
    {
      id: "artrosezorg-transitie-patienten",
      title: "Artrosezorg in transitie: wat betekent dit voor patiënten?",
      label: "Patiënten",
      summary:
        "Begrijpelijke uitleg over artrosezorg, bewegen, leefstijl en samenwerking tussen zorgverleners, zonder medisch advies op maat.",
      image: "assets/article-knee-osteoarthritis-support.jpg",
      imageAlt: "Respectvol gesprek over knieartrose, bewegen en herstel",
      url: "artikelen/artrosezorg-transitie-patienten.html",
      date: "2026-01-01",
      audience: ["patienten"],
      topics: ["artrose", "leefstijl"],
    },
  ];

  const sortByDateDesc = (items) =>
    [...items].sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));

  const filterLabels = {
    patienten: "Patiënten",
    zorgprofessionals: "Zorgprofessionals",
    "voet-en-enkel": "Voet en enkel",
    artrose: "Artrose",
    leefstijl: "Leefstijl",
    onderzoek: "Onderzoek",
    "digitale-zorg": "Digitale zorg",
    preventie: "Preventie",
  };

  const preferredFilterOrder = {
    audience: ["patienten", "zorgprofessionals"],
    topic: ["voet-en-enkel", "artrose", "leefstijl", "onderzoek", "digitale-zorg", "preventie"],
  };

  const labelForFilter = (value) =>
    filterLabels[value] ||
    value
      .split("-")
      .filter(Boolean)
      .map((part, index) => (index === 0 ? part.charAt(0).toUpperCase() + part.slice(1) : part))
      .join(" ");

  const sortedFilterValues = (values, groupName) => {
    const preferred = preferredFilterOrder[groupName] || [];
    return [...values].sort((a, b) => {
      const aIndex = preferred.indexOf(a);
      const bIndex = preferred.indexOf(b);
      if (aIndex !== -1 || bIndex !== -1) {
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
      }
      return labelForFilter(a).localeCompare(labelForFilter(b), "nl");
    });
  };

  const renderArticleFilters = () => {
    const filters = {
      audience: new Set(),
      topic: new Set(),
    };
    articles.forEach((article) => {
      article.audience.forEach((audience) => filters.audience.add(audience));
      article.topics.forEach((topic) => filters.topic.add(topic));
    });
    document.querySelectorAll("[data-filter-options]").forEach((container) => {
      const groupName = container.getAttribute("data-filter-options");
      const values = sortedFilterValues(filters[groupName] || [], groupName);
      container.innerHTML = values
        .map(
          (value) =>
            `<button class="filter-button" type="button" data-filter="${value}" aria-pressed="false">${labelForFilter(value)}</button>`
        )
        .join("");
    });
  };

  const prefixForCurrentPage = () => {
    const path = window.location.pathname;
    return path.includes("/artikelen/") || path.includes("/projecten/") ? "../" : "";
  };

  const resolvePath = (url) => {
    if (/^(https?:|mailto:|tel:|#)/.test(url)) return url;
    return `${prefixForCurrentPage()}${url}`;
  };

  const articleCard = (article) => {
    const imageClasses = ["article-card-image"];
    if (article.imageContain) imageClasses.push("project-card-image", "project-card-image-contain");
    return `
      <article class="article-card" data-audience="${article.audience.join(" ")}" data-topics="${article.topics.join(" ")}">
        <img class="${imageClasses.join(" ")}" src="${resolvePath(article.image)}" alt="${article.imageAlt}" loading="lazy">
        <div class="article-card-body">
          <p class="article-label">${article.label}</p>
          <h3>${article.title}</h3>
          <p>${article.summary}</p>
          <a class="article-link" href="${resolvePath(article.url)}">Lees artikel</a>
        </div>
      </article>
    `;
  };

  const projectCard = (project) => `
    <article class="article-card">
      <img class="article-card-image project-card-image" src="${resolvePath(project.image)}" alt="${project.imageAlt}" loading="lazy">
      <div class="article-card-body">
        <p class="article-label">${project.label}</p>
        <h3>${project.title}</h3>
        <p>${project.summary}</p>
        <a class="article-link" href="${resolvePath(project.url)}">Bekijk project</a>
      </div>
    </article>
  `;

  const renderList = (selector, items, cardFactory) => {
    document.querySelectorAll(selector).forEach((container) => {
      const limit = Number.parseInt(container.getAttribute("data-limit") || "", 10);
      const selected = Number.isFinite(limit) ? items.slice(0, limit) : items;
      container.innerHTML = selected.map(cardFactory).join("");
    });
  };

  renderList("[data-content='articles-list']", sortByDateDesc(articles), articleCard);
  renderList("[data-content='home-articles']", sortByDateDesc(articles), articleCard);
  renderArticleFilters();
  renderList("[data-content='projects-list']", projects, projectCard);
  renderList("[data-content='home-projects']", projects.filter((project) => project.featured).slice(0, 3), projectCard);
  renderList("[data-content='professional-projects']", projects.filter((project) => project.featured).slice(0, 3), projectCard);
  renderList(
    "[data-content='professional-articles']",
    sortByDateDesc(articles).filter((article) => article.audience.includes("zorgprofessionals")),
    articleCard
  );
  renderList(
    "[data-content='treatment-articles']",
    sortByDateDesc(articles).filter(
      (article) =>
        article.audience.includes("patienten") &&
        article.topics.some((topic) => ["voet-en-enkel", "artrose", "leefstijl", "preventie"].includes(topic))
    ),
    articleCard
  );

  document.querySelectorAll("[data-content='project-news']").forEach((container) => {
    const projectId = container.getAttribute("data-project");
    const projectArticles = sortByDateDesc(articles).filter((article) => article.project === projectId);
    container.innerHTML = projectArticles.map(articleCard).join("");
    const section = container.closest(".related-section");
    if (section) section.hidden = projectArticles.length === 0;
  });

  window.siteContent = { articles, projects };
})();
