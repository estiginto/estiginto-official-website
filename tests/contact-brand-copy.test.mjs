import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

const appSource = readFileSync(resolve(import.meta.dirname, "../src/App.jsx"), "utf8");

function functionSource(name, nextName) {
  const start = appSource.indexOf(`function ${name}`);
  const end = appSource.indexOf(`function ${nextName}`, start + 1);

  assert.notEqual(start, -1, `${name} must exist`);
  assert.notEqual(end, -1, `${nextName} must follow ${name}`);
  return appSource.slice(start, end);
}

test("homepage hero uses the approved three-line description in every locale", () => {
  const approvedHeroCopy = {
    zh: [
      "致力於打造",
      "有靈魂的設計",
      "透過技術，改變人與世界互動的方式",
      "我們以思緒縝密的設計著名",
      "讓企業的運作，成為能夠長久運作的現實",
    ],
    en: [
      "Driven to create",
      "design with soul",
      "Through technology, we reshape how people interact with the world.",
      "We are known for thoughtful, meticulously considered design.",
      "We turn business operations into enduring, workable realities.",
    ],
    ja: [
      "私たちが目指すのは",
      "魂のあるデザイン",
      "テクノロジーを通じて、人と世界の関わり方を変える。",
      "私たちは、緻密に思考されたデザインで知られています。",
      "企業の仕組みを、持続的に機能する現実へと変えていきます。",
    ],
  };

  Object.entries(approvedHeroCopy).forEach(([locale, strings]) => {
    strings.forEach((copy) => {
      assert.ok(appSource.includes(copy), `${locale} hero must include: ${copy}`);
    });
  });

  const heroSource = functionSource("Hero", "PageTransition");
  assert.match(heroSource, /copy\.hero\.title\[0\]/);
  assert.match(heroSource, /copy\.hero\.title\[1\]/);
  assert.doesNotMatch(heroSource, /copy\.hero\.title\[2\]/);
  assert.match(heroSource, /copy\.hero\.lede\[0\]/);
  assert.match(heroSource, /copy\.hero\.lede\[1\]/);
  assert.match(heroSource, /copy\.hero\.lede\[2\]/);
});

test("homepage prioritizes services and articles over systems methodology", () => {
  const homepageSource = appSource.match(/\) : \(\s*<>[\s\S]*?<Hero copy=\{copy\} \/>[\s\S]*?<\/>\s*\)\}/)?.[0] || "";

  assert.match(homepageSource, /<Solutions copy=\{copy\} \/>/);
  assert.match(homepageSource, /<Insights \/>/);
  assert.doesNotMatch(homepageSource, /<Numbers copy=\{copy\} \/>/);
  assert.doesNotMatch(homepageSource, /<Manifesto copy=\{copy\} \/>/);
});

test("achievements and footer omit the retired introduction and business ID", () => {
  const numbersSource = functionSource("Numbers", "Manifesto");
  const footerSource = functionSource("Footer", "ConstructionScreen");

  assert.match(numbersSource, /companyStatsByLocale/);
  assert.match(numbersSource, /copy\.achievements\.meta/);
  assert.doesNotMatch(numbersSource, /copy\.achievements\.label/);
  assert.match(footerSource, /footer\.company/);
  assert.doesNotMatch(appSource, /統一編號|42752468/);
});

test("main contact card and footer reuse accessible icons for every channel", () => {
  const iconStart = appSource.indexOf("function ContactIcon");
  const contactStart = appSource.indexOf("function Contact(");
  const footerStart = appSource.indexOf("function Footer(");
  const constructionStart = appSource.indexOf("function ConstructionScreen(");

  assert.notEqual(iconStart, -1, "ContactIcon must exist");
  assert.ok(iconStart < contactStart, "ContactIcon must be defined outside Contact");

  const iconSource = appSource.slice(iconStart, contactStart);
  const contactSource = appSource.slice(contactStart, footerStart);
  const footerSource = appSource.slice(footerStart, constructionStart);
  const iconTypes = ["email", "phone", "mobile", "line"];

  assert.match(iconSource, /<svg/);
  assert.match(iconSource, /aria-hidden="true"/);
  assert.match(iconSource, /focusable="false"/);
  iconTypes.forEach((type) => {
    assert.ok(iconSource.includes(type), `ContactIcon must support ${type}`);
    assert.ok(contactSource.includes(`type="${type}"`), `Contact must render ${type}`);
    assert.ok(footerSource.includes(`type="${type}"`), `Footer must render ${type}`);
  });

  [
    "mailto:contact@estiginto.com",
    "tel:+886224315362",
    "tel:+886972118427",
    "https://lin.ee/vFdwfVg",
  ].forEach((href) => {
    assert.ok(contactSource.includes(href), `Contact must preserve ${href}`);
    assert.ok(footerSource.includes(href), `Footer must preserve ${href}`);
  });
});
