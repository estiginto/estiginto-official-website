import assert from "node:assert/strict";
import test from "node:test";

import { getServiceMenuGroups } from "../src/navigationMenu.js";

const destinations = [
  "/about.html",
  "/case.html",
  "/faq.html",
  "/contact.html",
  "/systems-consulting.html",
  "/visual-design.html",
  "/international-marketing.html",
  "/international-finance.html",
  "/digital-integration.html",
];

const expectedLabels = {
  zh: ["關於我們", "精選實績", "合作說明", "聯絡我們", "資訊系統", "視覺設計", "國際行銷", "國際金融", "數位整合"],
  en: ["About", "Selected Work", "Working with us", "Contact", "Information Systems", "Visual Design", "International Marketing", "International Finance", "Digital Integration"],
  ja: ["私たちについて", "実績紹介", "ご依頼について", "お問い合わせ", "情報システム", "ビジュアルデザイン", "国際マーケティング", "国際金融", "デジタル統合"],
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

  assert.equal(groups.digital.label, "網站導覽");
  assert.equal(groups.growth.label, "顧問服務");
});
