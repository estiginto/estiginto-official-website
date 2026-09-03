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

test("homepage hero uses the approved two-line impact description in every locale", () => {
  const approvedHeroCopy = {
    zh: [
      "致力於打造",
      "有靈魂的設計",
      "以思緒縝密的設計著名",
      "讓企業產生持續的影響力",
    ],
    en: [
      "Driven to create",
      "design with soul",
      "Known for thoughtful, meticulously considered design.",
      "We help businesses create lasting impact.",
    ],
    ja: [
      "私たちが目指すのは",
      "魂のあるデザイン",
      "緻密に考え抜かれたデザインで知られています。",
      "企業が持続的な影響力を生み出せるよう支援します。",
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
  assert.doesNotMatch(heroSource, /copy\.hero\.lede\[2\]/);
});

test("client marquee exposes only its section heading while client names remain decorative", () => {
  const marqueeSource = functionSource("ClientLogoMarquee", "Marquee");

  assert.match(marqueeSource, /aria-hidden="true"/);
  assert.doesNotMatch(marqueeSource, /aria-label=\{copy\.clientLogos\.title\}/);
  assert.match(marqueeSource, /client-logo-marquee-header/);
  assert.match(marqueeSource, /<h2>\{copy\.clientLogos\.title\}<\/h2>/);
  assert.doesNotMatch(marqueeSource, /copy\.clientLogos\.eyebrow/);
  assert.doesNotMatch(marqueeSource, /copy\.clientLogos\.status/);
});

test("homepage finishes with client experience without a duplicate contact section", () => {
  const homepageSource = appSource.match(/\) : \(\s*<>[\s\S]*?<Hero copy=\{copy\} \/>[\s\S]*?<\/>\s*\)\}/)?.[0] || "";

  assert.doesNotMatch(homepageSource, /<Insights \/>/);
  assert.match(homepageSource, /<Marquee copy=\{copy\} \/>[\s\S]*?<ClientLogoMarquee copy=\{copy\} \/>/);
  assert.doesNotMatch(appSource, /<Contact copy=\{copy\} \/>/);
  assert.doesNotMatch(homepageSource, /<ServiceOverview copy=\{copy\} \/>/);
  assert.doesNotMatch(homepageSource, /<Numbers copy=\{copy\} \/>/);
  assert.doesNotMatch(homepageSource, /<Manifesto copy=\{copy\} \/>/);
});

test("service overview keeps the homepage service list compact and linked", () => {
  const serviceOverviewSource = functionSource("ServiceOverview", "Solutions");

  assert.match(serviceOverviewSource, /serviceFamiliesByLocale/);
  assert.match(serviceOverviewSource, /service-overview-grid/);
  assert.match(serviceOverviewSource, /href="\/solutions\.html"/);
});

test("achievements and footer omit the retired introduction and business ID", () => {
  const numbersSource = functionSource("Numbers", "Manifesto");
  const footerSource = functionSource("Footer", "ConstructionScreen");

  assert.match(numbersSource, /companyStatsByLocale/);
  assert.doesNotMatch(numbersSource, /copy\.achievements\.meta/);
  assert.doesNotMatch(numbersSource, /copy\.achievements\.label/);
  assert.match(footerSource, /footer\.company/);
  assert.doesNotMatch(appSource, /統一編號|42752468/);
});

test("footer preserves accessible contact channels after removing the duplicate card", () => {
  const iconStart = appSource.indexOf("function ContactIcon");
  const footerStart = appSource.indexOf("function Footer(");
  const constructionStart = appSource.indexOf("function ConstructionScreen(");

  assert.notEqual(iconStart, -1, "ContactIcon must exist");
  assert.ok(iconStart < footerStart, "ContactIcon must be defined before Footer");

  const iconSource = appSource.slice(iconStart, footerStart);
  const footerSource = appSource.slice(footerStart, constructionStart);
  const iconTypes = ["email", "phone", "mobile", "line"];

  assert.match(iconSource, /<svg/);
  assert.match(iconSource, /aria-hidden="true"/);
  assert.match(iconSource, /focusable="false"/);
  iconTypes.forEach((type) => {
    assert.ok(iconSource.includes(type), `ContactIcon must support ${type}`);
    assert.ok(footerSource.includes(`type="${type}"`), `Footer must render ${type}`);
  });

  [
    "mailto:contact@estiginto.com",
    "tel:+886224315362",
    "tel:+886972118427",
    "https://lin.ee/vFdwfVg",
  ].forEach((href) => {
    assert.ok(footerSource.includes(href), `Footer must preserve ${href}`);
  });
});
