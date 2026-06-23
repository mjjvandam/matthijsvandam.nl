import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve(import.meta.dirname, "..");
const contentPath = path.join(root, "content.js");
const treatmentsDir = path.join(root, "behandelingen");
const cacheToken = "20260621herobalance1";

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const footPainViewOrder = ["top", "front", "sole", "medial", "lateral", "heel"];

const footPainViews = {
  top: {
    image: "../assets/foot-guide-dorsal.jpg",
    alt: "Bovenaanzicht van een voet",
    viewBox: "0 0 1024 1536",
    aspect: "1024 / 1536",
    maxWidth: "310px",
  },
  front: {
    image: "../assets/foot-guide-front.png",
    alt: "Voorkant van voet, tenen en enkel",
    viewBox: "0 0 1672 941",
    aspect: "1672 / 941",
    maxWidth: "520px",
  },
  sole: {
    image: "../assets/foot-guide-plantar.jpg",
    alt: "Onderzijde van een voet",
    viewBox: "0 0 1024 1536",
    aspect: "1024 / 1536",
    maxWidth: "310px",
  },
  medial: {
    image: "../assets/foot-guide-medial.jpg",
    alt: "Binnenzijde van voet en enkel",
    viewBox: "0 0 1672 940",
    aspect: "1672 / 940",
    maxWidth: "520px",
  },
  lateral: {
    image: "../assets/foot-guide-lateral.jpg",
    alt: "Buitenzijde van voet en enkel",
    viewBox: "0 0 1672 941",
    aspect: "1672 / 941",
    maxWidth: "520px",
  },
  heel: {
    image: "../assets/foot-guide-heel.jpg",
    alt: "Achteraanzicht van hiel, enkel en achillespees",
    viewBox: "0 0 1672 941",
    aspect: "1672 / 941",
    maxWidth: "520px",
  },
};

const extraTreatmentTopics = [];

const manualRelatedConditionIds = {
  "hallux-rigidus": ["mtp-1-artrodese"],
  "mtp-1-artrodese": ["hallux-rigidus", "hallux-valgus"],
};

const contentCode = fs.readFileSync(contentPath, "utf8");
const context = {
  window: { location: { pathname: "/", search: "" }, addEventListener() {}, siteContent: null },
  document: { addEventListener() {}, querySelectorAll() { return []; } },
  console,
};
vm.createContext(context);
vm.runInContext(contentCode, context);

const contentTopics = context.window.siteContent.footPainTopics || context.window.siteContent.footPainConditions;
const baseConditions = contentTopics.filter(
  (condition) => condition.id !== "algemene-voet-enkelinformatie"
);
const conditions = [...baseConditions, ...extraTreatmentTopics];
const painRegions = context.window.siteContent.painRegions;
const conditionById = new Map(conditions.map((condition) => [condition.id, condition]));
const regionById = new Map(painRegions.map((region) => [region.id, region]));

const basenameHref = (topic) => path.basename(topic.url);

const regionHasView = (region, view) => Boolean(region?.views?.[view]?.shape);

const lowerFirst = (value) => {
  const text = String(value || "");
  return text ? `${text.charAt(0).toLowerCase()}${text.slice(1)}` : text;
};

const chooseView = (condition) => {
  const regionIds = condition.painRegionIds || [];
  const preference = new Map([
    ["grote-teen-mtp1", "front"],
    ["kleine-tenen", "front"],
    ["voorvoet-bovenzijde", "front"],
    ["middenvoet-bovenzijde", "front"],
    ["wreef", "front"],
    ["achillespees", "heel"],
    ["hiel-achterzijde", "heel"],
    ["achterzijde-enkel", "heel"],
    ["hiel-onderzijde", "sole"],
    ["voorvoet-onderzijde", "sole"],
    ["middenvoet-onderzijde", "sole"],
    ["binnenzijde-voetboog", "medial"],
    ["binnenzijde-enkel", "medial"],
    ["buitenzijde-voet", "lateral"],
    ["buitenzijde-enkel", "lateral"],
    ["voorzijde-enkel", "front"],
  ]);

  const preferredView = regionIds.map((id) => preference.get(id)).find(Boolean);
  const scores = footPainViewOrder.map((view) => {
    const visibleCount = regionIds.filter((id) => regionHasView(regionById.get(id), view)).length;
    const preferenceBonus = view === preferredView ? 0.5 : 0;
    return { view, score: visibleCount + preferenceBonus };
  });

  return scores.sort((a, b) => b.score - a.score || footPainViewOrder.indexOf(a.view) - footPainViewOrder.indexOf(b.view))[0].view;
};

const relatedConditions = (condition, maxItems = 6) => {
  const sourceRegions = new Set(condition.painRegionIds || []);
  const sourceRegionData = [...sourceRegions].map((id) => regionById.get(id)).filter(Boolean);
  const scores = new Map();
  const order = new Map();
  let rank = 0;

  const addScore = (id, score) => {
    if (id === condition.id) return;
    scores.set(id, (scores.get(id) || 0) + score);
    if (!order.has(id)) order.set(id, rank);
    rank += 1;
  };

  for (const region of sourceRegionData) {
    for (const id of region.relatedConditionIds || []) {
      addScore(id, 2);
    }
  }

  for (const id of condition.relatedTopicIds || []) {
    addScore(id, 18);
  }

  for (const id of manualRelatedConditionIds[condition.id] || []) {
    addScore(id, 20);
  }

  for (const candidate of conditions) {
    if (candidate.id === condition.id) continue;
    const overlap = (candidate.painRegionIds || []).filter((id) => sourceRegions.has(id)).length;
    if (overlap > 0) scores.set(candidate.id, (scores.get(candidate.id) || 0) + overlap * 5);
  }

  return [...scores.entries()]
    .map(([id, score]) => ({ topic: conditionById.get(id), score }))
    .filter((item) => item.topic && item.topic.kind !== "treatment")
    .sort(
      (a, b) =>
        b.score - a.score ||
        (order.get(a.topic.id) ?? Number.MAX_SAFE_INTEGER) - (order.get(b.topic.id) ?? Number.MAX_SAFE_INTEGER) ||
        a.topic.title.localeCompare(b.topic.title, "nl")
    )
    .slice(0, maxItems)
    .map((item) => item.topic);
};

const relatedTreatmentTopics = (condition) =>
  (condition.relatedTreatmentIds || [])
    .map((id) => conditionById.get(id))
    .filter((topic) => topic?.kind === "treatment");

const regionPhrase = (regions, { lower = false } = {}) => {
  const labels = regions.map((region) => (lower ? lowerFirst(region.label) : region.label));
  if (labels.length <= 2) return labels.join(" en ");
  return `${labels.slice(0, 2).join(" en ")} en aangrenzende pijnplekken`;
};

const renderRegionGuide = (condition) => {
  const view = chooseView(condition);
  const viewMeta = footPainViews[view];
  const regions = (condition.painRegionIds || []).map((id) => regionById.get(id)).filter(Boolean);
  const visibleRegions = regions.filter((region) => regionHasView(region, view));
  const related = relatedConditions(condition);
  const treatments = relatedTreatmentTopics(condition);
  const headingId = `${condition.id}-regio-gids-title`;
  const paths = visibleRegions
    .map(
      (region) => `<path class="treatment-region-shape" d="${escapeHtml(region.views[view].shape)}">
                    <title>${escapeHtml(region.label)}</title>
                  </path>`
    )
    .join("\n                  ");

  const html = `<section class="section treatment-region-guide-section" aria-labelledby="${escapeHtml(headingId)}">
        <div class="treatment-region-guide">
          <div class="section-heading treatment-region-guide-heading">
            <p class="section-kicker">Voet- en enkelpijnwijzer</p>
            <h2 id="${escapeHtml(headingId)}">Gerelateerde klachten in dezelfde regio</h2>
            <p>
              In deze leeswijzer ${regions.length === 1 ? "is vooral deze plek" : "zijn vooral deze plekken"} uitgelicht: ${escapeHtml(regionPhrase(regions, { lower: true }))}.
              Klachten in dezelfde omgeving kunnen ook bij andere onderwerpen passen. Deze selectie is een anatomische leeswijzer en geen diagnose.
            </p>
          </div>
          <div class="treatment-region-guide-layout">
            <figure class="treatment-region-map" style="--treatment-region-aspect: ${escapeHtml(viewMeta.aspect)}; --treatment-region-map-max: ${escapeHtml(viewMeta.maxWidth)};">
              <div class="treatment-region-map-frame">
                <img src="${escapeHtml(viewMeta.image)}" alt="${escapeHtml(viewMeta.alt)}" loading="lazy">
                <svg viewBox="${escapeHtml(viewMeta.viewBox)}" aria-hidden="true" focusable="false">
                  ${paths}
                </svg>
              </div>
              <figcaption>Uitgelicht: ${escapeHtml(regionPhrase(visibleRegions.length ? visibleRegions : regions))}.</figcaption>
            </figure>
            <div class="treatment-region-related">
              <h3>Ook bekijken</h3>
              <div class="treatment-region-card-grid">
                ${related
                  .map(
                    (topic) => `<a class="treatment-region-card" href="${escapeHtml(basenameHref(topic))}">
                  <span>${escapeHtml(topic.tags?.[0] || "Voet en enkel")}</span>
                  <strong>${escapeHtml(topic.title)}</strong>
                  <p>${escapeHtml(topic.excerpt)}</p>
                </a>`
                  )
                  .join("\n                ")}
              </div>
              ${
                treatments.length
                  ? `<div class="treatment-region-treatment-options">
                <h3>Behandelopties die soms worden besproken</h3>
                <p>Welke behandeling passend is, hangt af van diagnose, onderzoek, ernst, functie, belasting en eerdere behandelingen.</p>
                <div class="treatment-region-card-grid">
                  ${treatments
                    .map(
                      (topic) => `<a class="treatment-region-card" href="${escapeHtml(basenameHref(topic))}">
                    <span>${escapeHtml(topic.primaryLabel || topic.tags?.[0] || "Behandeling")}</span>
                    <strong>${escapeHtml(topic.title)}</strong>
                    <p>${escapeHtml(topic.excerpt)}</p>
                  </a>`
                    )
                    .join("\n                  ")}
                </div>
              </div>`
                  : ""
              }
              <span class="treatment-region-guide-link treatment-region-guide-note">Volledige pijnwijzer nog in concept</span>
            </div>
          </div>
        </div>
      </section>`;
  return html.replace(/[ \t]+$/gm, "");
};

const existingRegionGuidePattern =
  /\n\s*<section class="section treatment-region-guide-section"[\s\S]*?\n\s*<\/section>(?=\n\s*<\/main>)/;
const oldRelatedSectionPattern =
  /\n\s*<section class="section treatment-related-section"[\s\S]*?\n\s*<\/section>(?=\n\s*<\/main>)/;
const inlineRelatedPattern =
  /\n\s*<h2>Verwante onderwerpen<\/h2>\s*\n\s*<div class="related-article-grid">[\s\S]*?\n\s*<\/div>(?=\n\s*<\/article>)/;

const updated = [];
const missing = [];

for (const condition of conditions) {
  const filePath = path.join(root, condition.url);
  const relativePath = path.relative(treatmentsDir, filePath);
  const insideTreatmentsDir = relativePath && !relativePath.startsWith("..") && !path.isAbsolute(relativePath);
  if (!insideTreatmentsDir) {
    throw new Error(`Regiogids mag alleen behandelpagina's aanpassen: ${condition.url}`);
  }
  if (!fs.existsSync(filePath)) {
    missing.push(condition.id);
    continue;
  }

  const original = fs.readFileSync(filePath, "utf8");
  let html = original.replace(existingRegionGuidePattern, "");
  const regionGuide = `\n\n      ${renderRegionGuide(condition)}`;

  if (oldRelatedSectionPattern.test(html)) {
    html = html.replace(oldRelatedSectionPattern, regionGuide);
  } else {
    html = html.replace(inlineRelatedPattern, "");
    html = html.replace(/\n\s*<\/main>/, `${regionGuide}\n    </main>`);
  }

  html = html.replace(/styles\.css\?v=[^"]+/g, `styles.css?v=${cacheToken}`);

  if (html !== original) {
    fs.writeFileSync(filePath, html, "utf8");
    updated.push(condition.id);
  }
}

console.log(`Regiogids bijgewerkt: ${updated.length}`);
console.log(updated.join("\n"));
if (missing.length) {
  console.log(`Ontbrekende pagina's: ${missing.length}`);
  console.log(missing.join("\n"));
}
