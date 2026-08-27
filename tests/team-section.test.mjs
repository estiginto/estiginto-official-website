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
      meta: "Our Team",
      groupLabels: { leadership: "領導團隊", advisory: "顧問團隊" },
    },
    en: {
      eyebrow: "Leadership & Advisory",
      meta: "Our Team",
      groupLabels: { leadership: "Leadership", advisory: "Advisory" },
    },
    ja: {
      eyebrow: "リーダーシップ＆アドバイザリー",
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
      zh: { role: "法律顧問", summary: "美國執業律師，擅長國際商務專業，橫跨美國、亞洲及拉丁美洲，兼具法律實務、跨境商務與國際市場經驗，擅長以法律與商業雙重視角處理跨國事務。" },
      en: { role: "Legal Consultant", summary: "A practicing attorney in the United States with expertise in international business across the United States, Asia, and Latin America. Combining legal practice, cross-border business, and international market experience, he handles multinational matters through both legal and commercial perspectives." },
      ja: { role: "法律顧問", summary: "米国で実務に従事する弁護士。米国、アジア、ラテンアメリカにまたがる国際ビジネスを専門とし、法務実務、越境ビジネス、国際市場の経験を生かして、法務とビジネス双方の視点から国際案件に対応します。" },
    },
  );

  assert.deepEqual(
    Object.fromEntries(supportedLocales.map((locale) => {
      const nicole = teamMembersByLocale[locale].find(({ id }) => id === "nicole-chien");
      return [locale, { role: nicole.role, summary: nicole.summary }];
    })),
    {
      zh: { role: "國際專案經理", summary: "15 年以上跨領域資歷，熟悉軟體工程、市場行銷、國際商務與組織協調實務經驗，擅長跨文化溝通、台美文化及商務合作專案推進。" },
      en: { role: "Global Project Manager", summary: "More than 15 years of cross-disciplinary experience spanning software engineering, marketing, international business, and organizational coordination. She specializes in cross-cultural communication and advancing Taiwan–U.S. cultural and business collaboration projects." },
      ja: { role: "グローバルプロジェクトマネージャー", summary: "15年以上の分野横断的な経験を持ち、ソフトウェアエンジニアリング、マーケティング、国際ビジネス、組織調整の実務に精通しています。異文化コミュニケーションと台湾・米国間の文化・ビジネス協力プロジェクトの推進を得意とします。" },
    },
  );

  assert.deepEqual(
    Object.fromEntries(supportedLocales.map((locale) => {
      const members = teamMembersByLocale[locale];
      return [locale, Object.fromEntries(["lanar-lan", "yu-liang-chen", "cindy-wu"].map((id) => {
        const member = members.find((candidate) => candidate.id === id);
        return [id, member.summary];
      }))];
    })),
    {
      zh: {
        "lanar-lan": "20 年以上系統開發與企業數位轉型經驗。\n擅長將複雜工作轉化為可長期執行的策略與架構。",
        "yu-liang-chen": "20 年以上系統架構及整合經驗。\n擅長大型系統維運及資訊安全。",
        "cindy-wu": "30 年以上跨文化溝通、國際行銷與組織領導背景，長期深耕品牌策略、國際市場拓展及跨領域資源整合。\n橫跨企業顧問、國際教育、文化外交與房地產等領域，擅長以全球視野整合品牌、行銷與國際合作策略，致力於打造具國際影響力與市場價值的品牌。",
      },
      en: {
        "lanar-lan": "More than 20 years of experience in systems development and enterprise digital transformation.\nSpecializes in turning complex work into strategies and frameworks built for long-term execution.",
        "yu-liang-chen": "More than 20 years of experience in systems architecture and integration.\nSpecializes in large-scale system operations and information security.",
        "cindy-wu": "More than 30 years of experience in cross-cultural communication, international marketing, and organizational leadership, with extensive work in brand strategy, global market expansion, and cross-disciplinary resource integration.\nHer experience spans corporate consulting, international education, cultural diplomacy, and real estate. She brings a global perspective to brand, marketing, and international partnership strategies, building brands with international influence and market value.",
      },
      ja: {
        "lanar-lan": "20年以上にわたるシステム開発および企業のデジタルトランスフォーメーション経験。\n複雑な業務を、長期的に実行可能な戦略と仕組みに転換することを得意とします。",
        "yu-liang-chen": "20年以上にわたるシステムアーキテクチャおよび統合経験。\n大規模システムの運用保守と情報セキュリティを得意とします。",
        "cindy-wu": "30年以上にわたり、異文化コミュニケーション、国際マーケティング、組織リーダーシップに携わり、ブランド戦略、海外市場開拓、分野横断のリソース統合を推進してきました。\n企業コンサルティング、国際教育、文化外交、不動産など幅広い領域で培った経験を生かし、グローバルな視点からブランド、マーケティング、国際連携の戦略を統合し、国際的な影響力と市場価値を備えたブランドづくりに取り組んでいます。",
      },
    },
  );

  for (const locale of supportedLocales) {
    const cindy = teamMembersByLocale[locale].find(({ id }) => id === "cindy-wu");
    assert.equal(cindy.linkedin, "https://www.linkedin.com/in/cindy-wu-b3b1b89/");
  }
});

test("about page presents only leadership and advisory while achievements follow solutions", () => {
  const app = readFileSync(resolve(root, "src/App.jsx"), "utf8");

  assert.match(app, /initialSection === "about"\s*\?\s*<TeamSection copy=\{copy\} \/>/);
  assert.match(app, /initialSection === "solutions"\s*\?\s*<>\s*<Solutions copy=\{copy\} \/>\s*<Numbers copy=\{copy\} \/>\s*<\/>/);
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
  assert.match(app, /member\.linkedin\s*\?/);
  assert.match(app, /href=\{member\.linkedin\}[\s\S]*?target="_blank"[\s\S]*?rel="noreferrer"/);
  assert.match(app, /<LinkedInIcon\s*\/>/);
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
