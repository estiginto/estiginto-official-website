import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import { marketingAssetPaths } from "../scripts/static-assets.mjs";
import * as content2026 from "../src/content2026.js";

const root = resolve(import.meta.dirname, "..");

test("about page publishes the approved four-part introduction in every locale", () => {
  assert.deepEqual(content2026.aboutIntroductionsByLocale, {
    zh: [
      "團隊早期由國家軟體競賽代表選手組成。",
      "服務對象涵蓋政府單位、國際及涉外組織、金融投資機構、家族辦公室，以及有跨境營運需求的企業主。",
      "服務範圍涵蓋企業資訊架構、營運系統、資料治理、資訊安全、AI 導入與風險治理，協助企業整合數位營運所需的系統與能力。",
      "提升決策與執行效率，建立能支援長期成長與國際布局的數位能力。",
    ],
    en: [
      "Our team was initially formed by national software competition representatives.",
      "We serve government agencies, international and foreign-affairs organizations, financial investment institutions, family offices, and business owners with cross-border operating needs.",
      "Our work spans enterprise information architecture, operational systems, data governance, information security, AI adoption, and risk governance, integrating the systems and capabilities companies need to operate digitally.",
      "We improve decision-making and execution while building digital capabilities that support long-term growth and international expansion.",
    ],
    ja: [
      "チームは、ソフトウェア全国大会の代表選手を中心に発足しました。",
      "政府機関、国際・渉外組織、金融投資機関、ファミリーオフィス、そして国境を越えた事業運営を必要とする経営者を支援しています。",
      "企業情報アーキテクチャ、業務システム、データガバナンス、情報セキュリティから、AI導入、リスクガバナンスまで、企業のデジタル運営に必要なシステムと能力を統合します。",
      "意思決定と実行の効率を高め、長期的な成長と国際展開を支えるデジタル能力を構築します。",
    ],
  });

  const app = readFileSync(resolve(root, "src/App.jsx"), "utf8");
  assert.match(app, /Array\.isArray\(page\.lede\)/);
});

test("about team localizes its section copy, roles, summaries, and group labels", () => {
  const { supportedLocales, teamMembersByLocale, teamSectionCopyByLocale } = content2026;
  assert.ok(teamMembersByLocale, "team member content must be exported");
  assert.deepEqual(teamSectionCopyByLocale, {
    zh: {
      eyebrow: "領導與顧問團隊",
      label: "一起推動工作的成員",
      meta: "Our Team",
      groupLabels: { leadership: "領導團隊", advisory: "顧問團隊" },
    },
    en: {
      eyebrow: "Leadership & Advisory",
      label: "People behind the work",
      meta: "Our Team",
      groupLabels: { leadership: "Leadership", advisory: "Advisory" },
    },
    ja: {
      eyebrow: "リーダーシップ＆アドバイザリー",
      label: "事業を支えるメンバー",
      meta: "Our Team",
      groupLabels: { leadership: "リーダーシップ", advisory: "アドバイザリー" },
    },
  });

  const expectedNames = ["Lanar Lan", "Yu-Liang Chen", "Cindy Wu", "Nicole Chien", "Yen Chen", "Wayne Schutte", "Michael Mlejnek"];

  for (const locale of supportedLocales) {
    const members = teamMembersByLocale[locale];
    assert.deepEqual(members.map(({ name }) => name), expectedNames);
    assert.equal(members.length, 7);
  }

  assert.equal(teamMembersByLocale.zh.every(({ role, summary }) => /[\u3400-\u9fff]/u.test(`${role}${summary}`) || /^(CEO|CTO|CMO)$/.test(role)), true);
  assert.equal(teamMembersByLocale.en.every(({ role, summary }) => !/[\u3040-\u30ff\u3400-\u9fff]/u.test(`${role}${summary}`)), true);
  assert.equal(teamMembersByLocale.ja.every(({ role, summary }) => /[\u3040-\u30ff\u3400-\u9fff]/u.test(`${role}${summary}`) || /^(CEO|CTO|CMO)$/.test(role)), true);

  assert.deepEqual(
    Object.fromEntries(supportedLocales.map((locale) => {
      const michael = teamMembersByLocale[locale].find(({ id }) => id === "michael-mlejnek");
      return [locale, { role: michael.role, summary: michael.summary }];
    })),
    {
      zh: { role: "法律顧問", summary: "顧問，內布拉斯加州執業律師。" },
      en: { role: "Legal Consultant", summary: "Consultant and licensed attorney practicing in Nebraska." },
      ja: { role: "法律顧問", summary: "コンサルタント。ネブラスカ州で弁護士資格を持ち、実務に従事しています。" },
    },
  );

  assert.deepEqual(
    Object.fromEntries(supportedLocales.map((locale) => {
      const nicole = teamMembersByLocale[locale].find(({ id }) => id === "nicole-chien");
      return [locale, { role: nicole.role, summary: nicole.summary }];
    })),
    {
      zh: { role: "國際專案經理", summary: "" },
      en: { role: "Global Project Manager", summary: "" },
      ja: { role: "グローバルプロジェクトマネージャー", summary: "" },
    },
  );
});

test("about page presents leadership and advisory without the studio manifesto", () => {
  const app = readFileSync(resolve(root, "src/App.jsx"), "utf8");

  assert.match(app, /<Numbers copy=\{copy\} \/>\s*<TeamSection copy=\{copy\} \/>/);
  assert.doesNotMatch(app, /<Manifesto copy=\{copy\} \/>/);
});

test("about team renders the confirmed portraits and keeps a monogram fallback", () => {
  const members = content2026.teamMembersByLocale.en;
  const portraits = Object.fromEntries(members.map(({ id, portrait }) => [id, portrait]));

  assert.deepEqual(portraits, {
    "lanar-lan": "/img/team/avatar_lanar.jpg",
    "yu-liang-chen": "/img/team/avatar_YuLiang.webp",
    "cindy-wu": "/img/team/avatar_Cindy.jpg",
    "nicole-chien": "/img/team/avatar_Nicole.webp",
    "yen-chen": "/img/team/avatar_Yen.jpg",
    "wayne-schutte": "/img/team/avatar_wayne.png",
    "michael-mlejnek": "/img/team/avatar_Michael.webp",
  });

  for (const portrait of Object.values(portraits).filter(Boolean)) {
    assert.equal(existsSync(resolve(root, portrait.slice(1))), true, `${portrait} must exist`);
    assert.equal(marketingAssetPaths.includes(portrait.replace(/^\/img\//, "")), true, `${portrait} must ship in dist`);
  }

  const app = readFileSync(resolve(root, "src/App.jsx"), "utf8");
  assert.match(app, /member\.portrait\s*\?\s*\(/);
  assert.match(app, /<img[\s\S]*?src=\{member\.portrait\}[\s\S]*?alt=\{member\.name\}/);
  assert.match(app, /:\s*\(\s*<span[^>]*>\{member\.mark\}<\/span>/);
});

test("every team portrait carries an individual crop so faces keep comparable visual weight", () => {
  const members = content2026.teamMembersByLocale.zh;
  const photographedMembers = members.filter(({ portrait }) => portrait);

  for (const member of photographedMembers) {
    assert.equal(Number.isFinite(member.portraitFrame?.scale), true, `${member.name} must define a portrait scale`);
    assert.equal(Number.isFinite(member.portraitFrame?.x), true, `${member.name} must define a horizontal focal point`);
    assert.equal(Number.isFinite(member.portraitFrame?.y), true, `${member.name} must define a vertical focal point`);
    assert.equal(Number.isFinite(member.portraitFrame?.offsetY), true, `${member.name} must define a vertical alignment offset`);
    assert.equal(member.portraitFrame.x, 50, `${member.name} must share the centered portrait axis`);
    assert.equal(member.portraitFrame.scale >= 1, true, `${member.name} must not shrink inside the portrait frame`);
  }

  const michael = photographedMembers.find(({ id }) => id === "michael-mlejnek");
  const yuLiang = photographedMembers.find(({ id }) => id === "yu-liang-chen");
  const nicole = photographedMembers.find(({ id }) => id === "nicole-chien");
  const lanar = photographedMembers.find(({ id }) => id === "lanar-lan");
  const cindy = photographedMembers.find(({ id }) => id === "cindy-wu");
  assert.equal(lanar.portraitFrame.scale >= 1.8, true, "Lanar's portrait needs a close chest-up crop");
  assert.equal(lanar.portraitFrame.offsetY < 0, true, "Lanar's portrait needs an upward framing adjustment");
  assert.equal(cindy.portraitFrame.scale >= 1.2, true, "Cindy's portrait needs comparable visual weight");
  assert.equal(yuLiang.portraitFrame.scale >= 3, true, "Yu-Liang's full-body source needs a close chest-up crop");
  assert.equal(nicole.name, "Nicole Chien");
  assert.equal(nicole.portraitFrame.scale >= 2.8, true, "Nicole's full-body source needs a close chest-up crop");
  assert.equal(michael.portraitFrame.scale >= 2.7, true, "Michael's full-body source needs a close chest-up crop");
});
