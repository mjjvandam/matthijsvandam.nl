import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

// Exercise the actual browser helper without adding a build system or DOM dependency.
const source = readFileSync(new URL("../script.js", import.meta.url), "utf8");
const start = source.indexOf("const sortPublishedExpertiseCards =");
const end = source.indexOf('document.querySelectorAll("[data-card-filter-panel]")', start);
assert.ok(start >= 0 && end > start);
const sortCards = runInNewContext(`${source.slice(start, end)}\nsortPublishedExpertiseCards;`);

const card = (id, attrs = {}, href = null) => ({
  id,
  matches: (selector) => selector === ".expertise-card",
  getAttribute: (name) => attrs[name] ?? null,
  hasAttribute: (name) => Object.hasOwn(attrs, name),
  querySelector: () => href === null ? null : { getAttribute: () => href },
});
const publicCard = (id) => card(id, { "data-url": `${id}.html` }, `${id}.html`);
const group = (...cards) => {
  const container = {
    children: cards,
    append(item) {
      this.children.splice(this.children.indexOf(item), 1);
      this.children.push(item);
    },
  };
  cards.forEach((item) => { item.parentElement = container; });
  return container;
};
const sortGroups = (...groups) => sortCards({ querySelectorAll: () => groups.flatMap((g) => g.children) });
const ids = (container) => container.children.map((item) => item.id);

const mixed = group(card("concept-a"), publicCard("public-a"), card("concept-b"), publicCard("public-b"));
sortGroups(mixed);
assert.deepEqual(ids(mixed), ["public-a", "public-b", "concept-a", "concept-b"]);
sortGroups(mixed);
assert.deepEqual(ids(mixed), ["public-a", "public-b", "concept-a", "concept-b"]);

const allPublic = group(publicCard("b"), publicCard("a"));
const noPublic = group(card("d"), card("c"));
sortGroups(allPublic, noPublic);
assert.deepEqual(ids(allPublic), ["b", "a"]);
assert.deepEqual(ids(noPublic), ["d", "c"]);

const guarded = group(
  card("concept", { "data-url": "concept.html", "data-concept-url": "concept.html" }, "concept.html"),
  card("missing-link", { "data-url": "missing.html" }),
  card("mismatch", { "data-url": "one.html" }, "other.html"),
  publicCard("released"),
);
sortGroups(guarded);
assert.deepEqual(ids(guarded), ["released", "concept", "missing-link", "mismatch"]);

// A later publication uses the same rule; no hardcoded list of current pages.
const future = group(card("concept-a"), publicCard("newly-published"), publicCard("existing"));
sortGroups(future);
assert.deepEqual(ids(future), ["newly-published", "existing", "concept-a"]);
sortGroups();
console.log("Expertise-card order: 7 scenarios passed.");
