import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { consultingServicesByLocale } from "../src/consultingContent.js";
import { consultingCaseIds, consultingFaqByLocale, consultingServiceIds, getConsultingHref, getLegacyConsultingDestination } from "../src/consultingPages.js";
import { getServiceMenuGroups } from "../src/navigationMenu.js";
import { getPageFromPath, getPageMetadata, localizeHref } from "../src/siteRoutes.js";
import { caseStudiesByLocale } from "../src/content2026.js";
import { getPageTransitionVariant } from "../src/pageTransition.js";

for (const locale of ["zh", "en", "ja"]) {
  test(`${locale} consulting services have distinct shareable pages and matching metadata`, () => {
    const titles = new Set();
    for (const id of consultingServiceIds) {
      const href = localizeHref(getConsultingHref(id), locale);
      assert.equal(getPageFromPath(href)?.key, id);
      assert.equal(getPageTransitionVariant(href), "matrix");
      assert.equal(getServiceMenuGroups(locale).growth.items.find((item) => item.key === id).href, getConsultingHref(id));
      const service = consultingServicesByLocale[locale].services.find((item) => item.id === id);
      const menuName = getServiceMenuGroups(locale).growth.items.find((item) => item.key === id).label;
      assert.equal(service.title, menuName, "page and menu must name the same service");
      const metadata = getPageMetadata(id, locale);
      assert.ok(metadata.title.includes(menuName));
      assert.equal(metadata.canonical, `https://estiginto.com${href}`);
      assert.ok(metadata.description.length > 20);
      titles.add(metadata.title);
      assert.match(readFileSync(new URL(`../${id}.html`, import.meta.url), "utf8"), new RegExp(`data-target-section="${id}"`));
      assert.equal(localizeHref(`${href}#service-faq`, "ja"), `/ja/${id}.html#service-faq`);
    }
    assert.equal(titles.size, 5);
  });

  test(`${locale} service references exist and specialized FAQs are complete`, () => {
    for (const id of consultingServiceIds) {
      const content = consultingServicesByLocale[locale].services.find((item) => item.id === id);
      for (const field of ["situations", "scope", "deliverables"]) assert.ok(content[field].length >= 2);
      assert.ok(content.scope.length >= 4, "service scope must explain the actual work");
      assert.equal(new Set(content.scope.map((item) => item.title)).size, content.scope.length);
      for (const item of content.scope) assert.ok(item.title?.trim() && item.description?.trim(), "each scope item needs a title and a complete explanation");
      for (const caseId of consultingCaseIds[id]) assert.ok(caseStudiesByLocale[locale].some((item) => item.id === caseId));
      if (id === "international-finance") {
        assert.deepEqual(consultingCaseIds[id], []);
        continue;
      }
      const questions = consultingFaqByLocale[locale][id];
      assert.equal(questions.length, 4);
      assert.equal(new Set(questions.map(([q]) => q)).size, 4);
      for (const [question, answer] of questions) {
        assert.ok(question.trim() && answer.trim());
        if (locale === "en") assert.doesNotMatch(question + answer, /\p{Script=Han}/u);
        if (locale === "ja") assert.match(answer, /[ぁ-んァ-ン]/u);
      }
    }
  });
}

test("legacy service bookmarks redirect only known services and preserve language and query", () => {
  for (const prefix of ["", "/en", "/ja"]) for (const id of consultingServiceIds) {
    assert.equal(getLegacyConsultingDestination(`${prefix}/consulting.html`, `#${id}`, "?ref=bookmark"), `${prefix}/${id}.html?ref=bookmark`);
  }
  assert.equal(getLegacyConsultingDestination("/consulting.html", "#unknown"), null);
  assert.equal(getLegacyConsultingDestination("/solutions.html", "#systems-consulting"), null);
  assert.equal(getLegacyConsultingDestination("/Oasis/consulting.html", "#systems-consulting"), null);
  assert.equal(getConsultingHref("untrusted"), "/consulting.html");
});

test("new hero statement replaces the previous statement in all languages", () => {
  const app = readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
  for (const line of ["提供您持續閃耀的力量。", "Giving you the power to keep shining.", "あなたが輝き続けるための力を。"]) assert.ok(app.includes(line));
  assert.doesNotMatch(app, /整合科技、產業與金融的力量|珍貴價值|Bringing together the strengths|かけがえのない価値/);
});
