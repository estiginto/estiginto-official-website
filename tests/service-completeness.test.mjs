import assert from "node:assert/strict";
import test from "node:test";
import { consultingServiceIds, consultingCaseIds } from "../src/consultingPages.js";
import { getServiceLabel, getContactHref } from "../src/serviceConnections.js";
import { servicePlanningByLocale } from "../src/servicePlanning.js";
import { caseStudiesByLocale } from "../src/content2026.js";
import { consultingServicesByLocale } from "../src/consultingContent.js";

test("every published service has a visible localized name and preserves inquiry context", () => {
  for (const locale of ["zh", "en", "ja"]) {
    for (const id of consultingServiceIds) {
      assert.ok(getServiceLabel(id, locale)?.trim(), `${locale}/${id} missing name`);
      assert.ok(getContactHref(id, locale).endsWith(`?service=${id}`));
    }
  }
});

test("service case destinations exist in every locale and finance grouping loses no scope", () => {
  for (const locale of ["zh", "en", "ja"]) {
    for (const id of consultingServiceIds) {
      assert.ok(servicePlanningByLocale[locale][id]);
      for (const caseId of consultingCaseIds[id]) assert.ok(caseStudiesByLocale[locale].some(item => item.id === caseId));
    }
    const indices = servicePlanningByLocale[locale]["international-finance"].groups.flatMap(group => group.indices);
    const scope = consultingServicesByLocale[locale].services.find(item => item.id === "international-finance").scope;
    assert.deepEqual([...indices].sort((a, b) => a - b), scope.map((_, index) => index));
  }
});
