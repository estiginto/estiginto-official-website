import assert from "node:assert/strict";
import test from "node:test";
import { getServiceMenuGroups } from "../src/navigationMenu.js";
import { renderSitemap } from "../scripts/localized-pages.mjs";
import { readFileSync } from "node:fs";
import { serviceFamiliesByLocale } from "../src/content2026.js";
import { serviceDetailsByLocale } from "../src/serviceDetails.js";
import { consultingServiceIds } from "../src/consultingPages.js";
import { getPageMetadata } from "../src/siteRoutes.js";
import { renderLocalizedHtml } from "../scripts/localized-pages.mjs";
import { implementationOwners, getServiceImplementationIds, getImplementationHref, getHiddenSolutionsDestination } from "../src/serviceImplementation.js";

test("published navigation and sitemap do not expose the hidden solutions area", () => {
  for (const locale of ["zh", "en", "ja"]) {
    const groups = getServiceMenuGroups(locale);
    for (const group of Object.values(groups)) {
      assert.doesNotMatch(group.label, /解決方案|Solutions|ソリューション/);
      for (const item of group.items) assert.doesNotMatch(item.href, /solutions\.html/);
    }
  }
  assert.doesNotMatch(renderSitemap(), /solutions\.html/);
});

test("each implementation belongs to one service and keeps complete delivery content in all languages", () => {
  assert.deepEqual(implementationOwners, {
    "custom-systems": "systems-consulting", "graphic-design": "visual-design",
    "marketing-ads": "international-marketing", "website-design": "digital-integration",
  });
  assert.deepEqual(consultingServiceIds.flatMap(getServiceImplementationIds).sort(), Object.keys(implementationOwners).sort());
  for (const locale of ["zh", "en", "ja"]) for (const [id, owner] of Object.entries(implementationOwners)) {
    const family = serviceFamiliesByLocale[locale].find((item) => item.id === id);
    const delivery = serviceDetailsByLocale[locale].solutions[id];
    assert.ok(family.title && family.summary && family.capabilities.length);
    assert.ok(delivery.deliverables.length && delivery.preparation && delivery.boundaries);
    assert.equal(getImplementationHref(id), `/${owner}.html#implementation-${id}`);
  }
});

test("hidden solutions bookmarks retain their language and query and reach the owning service", () => {
  for (const prefix of ["", "/en", "/ja"]) {
    for (const [id, owner] of Object.entries(implementationOwners)) {
      assert.equal(getHiddenSolutionsDestination(`${prefix}/solutions.html`, `#${id}`, "?ref=bookmark"), `${prefix}/${owner}.html?ref=bookmark#implementation-${id}`);
    }
    for (const hash of ["", "#unknown"]) assert.equal(getHiddenSolutionsDestination(`${prefix}/solutions.html`, hash, "?ref=bookmark"), `${prefix}/consulting.html?ref=bookmark`);
  }
  for (const path of ["/", "/Oasis/", "/en/consulting.html", "/solutions-other.html"]) assert.equal(getHiddenSolutionsDestination(path, "#custom-systems"), null);
});

test("legacy solutions HTML remains available but is excluded from indexing in every language", () => {
  const source = readFileSync(new URL("../solutions.html", import.meta.url), "utf8");
  for (const locale of ["zh", "en", "ja"]) {
    const html = renderLocalizedHtml(source, "solutions", locale);
    assert.match(html, /name="robots" content="noindex, follow"/);
    assert.equal((html.match(/name="robots"/g) || []).length, 1);
    assert.equal(getPageMetadata("consulting", locale).robots, null);
  }
});
