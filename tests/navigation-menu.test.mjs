import assert from "node:assert/strict";
import test from "node:test";

import { getServiceMenuGroups } from "../src/navigationMenu.js";

const destinations = [
  "/consulting.html#systems-consulting",
  "/solutions.html#custom-systems",
  "/case.html#case-group-operations-management",
  "/contact.html",
  "/consulting.html#systems-consulting",
  "/consulting.html#visual-design",
  "/consulting.html#international-marketing",
  "/consulting.html#international-finance",
  "/consulting.html#digital-integration",
];

const expectedLabels = {
  zh: ["系統規劃", "客製開發", "系統案例", "專案諮詢", "資訊系統", "視覺設計", "國際行銷", "國際金融", "數位整合"],
  en: ["Planning", "Custom Dev", "System Work", "Consult", "Information Systems", "Visual Design", "International Marketing", "International Finance", "Digital Integration"],
  ja: ["システム設計", "開発", "導入事例", "相談", "情報システム", "ビジュアルデザイン", "国際マーケティング", "国際金融", "デジタル統合"],
};

for (const locale of ["zh", "en", "ja"]) {
  test(`${locale} exposes both service groups with the approved destinations`, () => {
    const groups = getServiceMenuGroups(locale);
    const items = Object.values(groups).flatMap((group) => group.items);

    assert.deepEqual(Object.keys(groups), ["digital", "growth"]);
    assert.deepEqual(items.map((item) => item.label), expectedLabels[locale]);
    assert.deepEqual(items.map((item) => item.href), destinations);
  });
}

test("unsupported locales fall back to the Chinese service menu", () => {
  const groups = getServiceMenuGroups("unsupported");

  assert.equal(groups.digital.label, "解決方案");
  assert.equal(groups.growth.label, "顧問服務");
});
