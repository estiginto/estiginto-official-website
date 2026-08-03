import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

const appSource = readFileSync(resolve(import.meta.dirname, "../src/App.jsx"), "utf8");

const expectedCaseIds = [
  "senior-care-iot",
  "pharma-management",
  "shipping-warehouse",
  "art-collection",
  "fresh-food-omnichannel",
  "government-administration",
  "yacht-event-management",
  "production-quality",
  "manufacturing-management",
  "travel-discovery",
  "location-broadcast",
  "event-booking-commerce",
  "consumer-brand-site",
];

const expectedCaseGroups = {
  "operations-management": [
    "pharma-management",
    "government-administration",
    "production-quality",
    "manufacturing-management",
  ],
  "iot-visibility": [
    "senior-care-iot",
    "shipping-warehouse",
    "location-broadcast",
  ],
  "commerce-members": [
    "fresh-food-omnichannel",
    "yacht-event-management",
    "event-booking-commerce",
    "consumer-brand-site",
  ],
  "brand-digital": ["art-collection", "travel-discovery"],
};

function assertCompleteStrings(value, path = "content") {
  if (typeof value === "string") {
    if (path.endsWith(".suffix")) {
      return;
    }
    assert.notEqual(value.trim(), "", `${path} must not be blank`);
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => assertCompleteStrings(item, `${path}[${index}]`));
    return;
  }

  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, item]) => assertCompleteStrings(item, `${path}.${key}`));
  }
}

test("2026 content provides complete, matching locale inventories", async () => {
  const {
    supportedLocales,
    companyStatsByLocale,
    serviceFamiliesByLocale,
    caseStudiesByLocale,
    caseStudyGroupsByLocale,
  } = await import("../src/content2026.js");

  assert.deepEqual(supportedLocales, ["zh", "en", "ja"]);

  for (const locale of supportedLocales) {
    assert.equal(companyStatsByLocale[locale].length, 3, `${locale} company stats`);
    assert.equal(serviceFamiliesByLocale[locale].length, 4, `${locale} service families`);
    assert.equal(caseStudiesByLocale[locale].length, 13, `${locale} case studies`);
    assert.deepEqual(
      caseStudiesByLocale[locale].map(({ id }) => id),
      expectedCaseIds,
      `${locale} case IDs and order`,
    );
    assert.equal(
      caseStudiesByLocale[locale].some(({ id }) => id === "elevator-operations"),
      false,
      `${locale} elevator case must stay hidden`,
    );
    assert.deepEqual(
      caseStudiesByLocale[locale].map(({ number }) => number),
      ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13"],
      `${locale} visible case numbering`,
    );
    assertCompleteStrings(companyStatsByLocale[locale], `${locale}.companyStats`);
    assertCompleteStrings(serviceFamiliesByLocale[locale], `${locale}.serviceFamilies`);
    assertCompleteStrings(caseStudiesByLocale[locale], `${locale}.caseStudies`);

    const groups = caseStudyGroupsByLocale[locale];
    assert.deepEqual(groups.map(({ id }) => id), Object.keys(expectedCaseGroups));
    assert.deepEqual(
      Object.fromEntries(groups.map(({ id, caseIds }) => [id, caseIds])),
      expectedCaseGroups,
    );
    assert.deepEqual(
      groups.flatMap(({ caseIds }) => caseIds).sort(),
      [...expectedCaseIds].sort(),
    );
    assertCompleteStrings(groups, `${locale}.caseStudyGroups`);

    for (const group of groups) {
      assert.ok(group.keywords.length >= 5, `${locale}.${group.id} minimum keywords`);
      assert.ok(group.keywords.length <= 8, `${locale}.${group.id} maximum keywords`);
      assert.equal(new Set(group.keywords).size, group.keywords.length, `${locale}.${group.id} keywords must be unique`);
      group.keywords.forEach((keyword) => {
        assert.equal(typeof keyword, "string", `${locale}.${group.id} keyword type`);
        assert.notEqual(keyword.trim(), "", `${locale}.${group.id} keyword must not be blank`);
      });
    }

    for (const service of serviceFamiliesByLocale[locale]) {
      assert.equal(service.image.endsWith(".webp"), true, `${locale}.${service.id} image must use WebP`);
      assert.ok(service.capabilities.length >= 4, `${locale}.${service.id} capabilities`);
    }

    for (const caseStudy of caseStudiesByLocale[locale]) {
      assert.ok(caseStudy.capabilities.length >= 5, `${locale}.${caseStudy.id} capabilities`);
      assert.equal("industry" in caseStudy, false, `${locale}.${caseStudy.id} must use outcome copy`);
      assert.equal(typeof caseStudy.outcome, "string", `${locale}.${caseStudy.id} outcome`);
      assert.notEqual(caseStudy.outcome.trim(), "", `${locale}.${caseStudy.id} outcome must not be blank`);
      assert.equal("customerName" in caseStudy, false, `${locale}.${caseStudy.id} must not expose a customer name`);
      assert.equal("logo" in caseStudy, false, `${locale}.${caseStudy.id} must not expose a logo`);
    }
  }

  assert.ok(caseStudyGroupsByLocale.zh[0].keywords.includes("ERP"));
  assert.ok(caseStudyGroupsByLocale.en[1].keywords.includes("Real-time Monitoring"));
  assert.ok(caseStudyGroupsByLocale.ja[2].keywords.includes("会員システム"));
});

test("2026 public content excludes unsupported global proof claims", async () => {
  const content = await import("../src/content2026.js");
  const serialized = JSON.stringify(content);

  assert.doesNotMatch(serialized, /99\.9/);
  assert.doesNotMatch(serialized, /70\+/);
  assert.match(serialized, /325/);
  assert.match(serialized, /2011/);
  assert.match(serialized, /12/);
});

test("shared footer keeps LINE and removes Facebook", () => {
  assert.match(appSource, /https:\/\/lin\.ee\/vFdwfVg/);
  assert.doesNotMatch(appSource, /facebook\.com|>Facebook</i);
});
