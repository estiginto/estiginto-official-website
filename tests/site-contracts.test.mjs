import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import { getServiceMenuGroups } from "../src/navigationMenu.js";

const root = resolve(import.meta.dirname, "..");
const read = (path) => readFileSync(resolve(root, path), "utf8");

const pages = [
  ["index.html", "https://estiginto.com/"],
  ["about.html", "https://estiginto.com/about.html"],
  ["case.html", "https://estiginto.com/case.html"],
  ["solutions.html", "https://estiginto.com/solutions.html"],
  ["consulting.html", "https://estiginto.com/consulting.html"],
  ["faq.html", "https://estiginto.com/faq.html"],
  ["contact.html", "https://estiginto.com/contact.html"],
];

test("every public page has complete page-specific discovery metadata", () => {
  const titles = new Set();

  for (const [file, canonical] of pages) {
    const html = read(file);
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1];

    assert.ok(title, `${file} must have a title`);
    assert.ok(!titles.has(title), `${file} title must be unique`);
    titles.add(title);
    assert.match(html, /<meta\s+name="description"\s+content="[^"]+"\s*\/?>/s, `${file} description`);
    assert.ok(html.includes(`<link rel="canonical" href="${canonical}"`), `${file} canonical`);
    assert.match(html, /property="og:title"/s, `${file} og:title`);
    assert.match(html, /property="og:description"/s, `${file} og:description`);
    assert.ok(html.includes(`property="og:url" content="${canonical}"`), `${file} og:url`);
    assert.match(html, /name="twitter:card"/s, `${file} twitter card`);
  }
});

test("every public page declares the existing brand favicon", () => {
  for (const [file] of pages) {
    const html = read(file);
    assert.match(html, /<link rel="icon" href="\/img\/logo_estiginto\.png"/s, `${file} favicon`);
  }
});

test("primary navigation gives solutions and case studies distinct destinations", () => {
  const items = getServiceMenuGroups("zh").digital.items;
  const solutions = items.find((item) => item.key === "system-planning");
  const cases = items.find((item) => item.key === "system-cases");

  assert.equal(solutions?.href, "/solutions.html");
  assert.equal(cases?.href, "/case.html#case-group-operations-management");
  assert.notEqual(solutions?.href, cases?.href);
});

test("footer navigation preserves solutions, case studies, and FAQ destinations", () => {
  const app = read("src/App.jsx");

  assert.match(app, /<a href="\/solutions\.html">\{menuLabels\[copy\.locale\]\?\.solutions/);
  assert.match(app, /<a href="\/case\.html">\{menuLabels\[copy\.locale\]\?\.case/);
  assert.match(app, /<a href="\/faq\.html">\{copy\.footer\.faqLabel\}<\/a>/);
});

test("solutions page has a distinct localized page heading", () => {
  const app = read("src/App.jsx");

  assert.match(app, /solutions:\s*{\s*kicker: "Solutions",\s*title: "解決方案"/);
  assert.match(app, /solutions: \{ kicker: "Solutions", title: "Solutions"/);
  assert.match(app, /solutions: \{ kicker: "Solutions", title: "ソリューション"/);
});

test("finished about and case pages are not production-gated as drafts", () => {
  const app = read("src/App.jsx");

  assert.doesNotMatch(app, /const isDraftPage/);
  assert.doesNotMatch(app, /shouldShowConstructionScreen/);
});

test("all referenced plan photographs use WebP", () => {
  const app = read("src/App.jsx");
  const references = [...app.matchAll(/image:\s*"(\/img\/plan\/[^"]+)"/g)].map((match) => match[1]);

  assert.ok(references.length >= 5, "expected plan-image references");
  for (const reference of references) {
    assert.equal(reference.endsWith(".webp"), true, `${reference} must be WebP`);
  }
});

test("public pages consume the verified localized 2026 content model", () => {
  const app = read("src/App.jsx");

  assert.match(app, /from "\.\/content2026\.js"/);
  assert.match(app, /companyStatsByLocale\[copy\.locale\]/);
  assert.match(app, /serviceFamiliesByLocale\[copy\.locale\]/);
  assert.match(app, /href="tel:\+886972118427"/);
  assert.match(app, /Est\. 2011/);
  assert.doesNotMatch(app, /Est\. 2012/);
  assert.doesNotMatch(app, /val:\s*"99\.9"/);
  assert.doesNotMatch(app, /val:\s*"70"/);
});

test("consulting page presents the four approved advisory services", () => {
  const app = read("src/App.jsx");
  const html = read("consulting.html");

  assert.match(html, /data-target-section="consulting"/);
  assert.match(app, /function ConsultingServices\(\{ copy \}\)/);
  assert.match(app, /const consultingServicesByLocale\s*=\s*\{/);
  for (const id of ["systems-consulting", "digital-integration", "visual-design", "international-marketing"]) {
    assert.match(app, new RegExp(`id: "${id}"`));
  }
  assert.match(app, /現況盤點/);
  assert.match(app, /目標確認/);
  assert.match(app, /策略規劃/);
  assert.match(app, /執行協作/);
  assert.match(app, /成效檢視/);
  assert.match(app, /initialSection === "consulting"/);
});

test("consulting page is included in the production bundle", () => {
  const viteConfig = readFileSync(resolve(import.meta.dirname, "../vite.config.js"), "utf8");
  const distVerifier = readFileSync(resolve(import.meta.dirname, "../scripts/verify-dist.mjs"), "utf8");

  assert.match(viteConfig, /consulting:\s*htmlEntry\("\.\/consulting\.html"\)/);
  assert.match(distVerifier, /"consulting\.html"/);
});

test("page entry restores late-rendered hash destinations", () => {
  const app = read("src/App.jsx");
  const css = read("src/App.css");

  assert.match(app, /decodeURIComponent\(window\.location\.hash\.slice\(1\)\)/);
  assert.match(app, /hashTarget\?\.scrollIntoView\(\{ block: "start" \}\)/);
  assert.match(css, /\.consulting-service\s*\{[\s\S]*?scroll-margin-top:\s*96px;/);
});

test("all internal pages share the geometric transition overlay", () => {
  const app = read("src/App.jsx");
  const css = read("src/App.css");

  assert.match(app, /function PageTransition\(\)/);
  assert.match(app, /transition-\$\{variant\}/);
  assert.match(app, /data-variant=\{variant\}/);
  assert.match(app, /page-transition-grille/);
  assert.match(app, /page-transition-matrix/);
  assert.match(app, /page-transition-aperture/);
  assert.match(app, /page-transition-axis/);
  assert.match(app, /getTransitionDestination/);
  assert.match(app, /document\.addEventListener\("click"/);
  assert.match(app, /page-transition-panel-top/);
  assert.match(app, /page-transition-panel-bottom/);
  assert.match(app, /page-transition-scan/);
  assert.match(app, /estiginto:page-entered/);
  assert.match(css, /\.page-transition\s*\{/);
  assert.match(css, /\.page-transition\.is-leaving/);
  assert.match(css, /prefers-reduced-motion:\s*reduce[\s\S]*page-transition/);
});

test("geometric transitions use the approved graphite ivory and champagne palette", () => {
  const css = read("src/App.css");
  const transitionCss = css.match(/\.page-transition\s*\{[\s\S]*?\n\.section\s*\{/)?.[0] || "";

  assert.match(transitionCss, /--transition-graphite:\s*#171817;/);
  assert.match(transitionCss, /--transition-graphite-soft:\s*#242522;/);
  assert.match(transitionCss, /--transition-ivory:\s*#eee8dc;/);
  assert.match(transitionCss, /--transition-champagne:\s*#b89a62;/);
  assert.match(transitionCss, /\.transition-axis \.page-transition-axis::before\s*\{[\s\S]*?left:\s*50%;[\s\S]*?var\(--transition-ivory\)/);
  assert.match(transitionCss, /@keyframes page-axis-cross-vertical/);
  assert.match(transitionCss, /\.page-transition-scan\s*\{[\s\S]*?var\(--transition-champagne\)/);
  assert.doesNotMatch(transitionCss, /#4f9dff|rgba\(79,\s*157,\s*255/);
});

test("homepage hero provides an accessible mechanical background", () => {
  const app = read("src/App.jsx");
  const css = read("src/App.css");

  assert.match(app, /function HeroTechBackground\(\)/);
  assert.match(app, /className="hero-tech-background" aria-hidden="true"/);
  assert.match(app, /hero-tech-ring-outer/);
  assert.match(app, /hero-tech-ring-inner/);
  assert.match(app, /hero-tech-markers/);
  assert.match(app, /hero-tech-scan/);
  assert.match(app, /matchMedia\("\(pointer: fine\)"\)/);
  assert.match(app, /requestAnimationFrame/);
  assert.match(app, /cancelAnimationFrame/);
  assert.match(css, /\.hero-tech-ring-outer\s*\{[\s\S]*?28s linear infinite/);
  assert.match(css, /\.hero-tech-ring-inner\s*\{[\s\S]*?22s linear infinite/);
  assert.match(css, /\.hero-tech-scan\s*\{[\s\S]*?9s/);
  assert.match(css, /\.hero::after\s*\{[\s\S]*?linear-gradient\([\s\S]*?rgba\(57,\s*127,\s*199/);
  assert.match(css, /\.hero::after\s*\{[\s\S]*?animation:\s*hero-grid-scan 7s/);
  assert.match(css, /@keyframes hero-grid-scan[\s\S]*?translateY\(18%\)/);
  assert.match(css, /@keyframes hero-grid-breathe[\s\S]*?background-position/);
  assert.match(css, /prefers-reduced-motion:\s*reduce[\s\S]*hero-tech-background/);
});

test("case page groups selected work by client value", () => {
  const app = read("src/App.jsx");
  const css = read("src/App.css");

  assert.match(app, /function CasePortfolio\(\{ copy \}\)/);
  assert.match(app, /caseStudiesByLocale\[copy\.locale\]/);
  assert.match(app, /caseStudyGroupsByLocale\[copy\.locale\]/);
  assert.match(app, /className="case-portfolio-group"/);
  assert.match(app, /className="case-portfolio-keywords"/);
  assert.match(app, /group\.keywords\.map/);
  assert.match(app, /caseStudy\.outcome/);
  assert.doesNotMatch(app, /caseStudy\.industry/);
  assert.match(app, /aria-expanded=\{isActive\}/);
  assert.match(app, /role="region"/);
  assert.match(app, /精選實績/);
  assert.match(app, /查看解法/);
  assert.doesNotMatch(app, /14 個匿名案例|跨產業匿名案例|14 anonymized cases|匿名事例 14件/);
  assert.match(css, /\.case-portfolio-group\s*\{/);
  assert.match(css, /\.case-portfolio-group-header\s*\{/);
  assert.match(css, /\.case-portfolio-keywords\s*\{/);
  assert.match(css, /\.case-portfolio-keywords li\s*\{/);
  assert.match(css, /\.case-portfolio-outcome/);
  assert.doesNotMatch(app, /3\.2%/);
  assert.doesNotMatch(app, /D\+0\.7/);
  assert.doesNotMatch(app, /28h/);
});

test("case metadata presents selected capabilities without anonymity framing", () => {
  const html = read("case.html");

  const keywordMeta = html.match(/<meta name="keywords" content="([^"]+)"\s*\/?>/g) || [];
  assert.equal(keywordMeta.length, 1, "case page must have one keywords meta tag");
  assert.match(keywordMeta[0], /客製化系統開發/);
  assert.match(keywordMeta[0], /ERP/);
  assert.match(keywordMeta[0], /IoT/);
  assert.match(keywordMeta[0], /UI\/UX/);

  assert.match(html, /精選實績｜ESTIGINTO 造物者科技/);
  assert.match(html, /營運整合、IoT、電商會員與數位產品/);
  assert.doesNotMatch(html, /匿名|14 個跨產業/);
});

test("asset policy excludes local Oasis videos", () => {
  const output = execFileSync(
    process.execPath,
    ["--input-type=module", "--eval", "import { shouldCopyOasisPath } from './scripts/static-assets.mjs'; process.stdout.write(String(shouldCopyOasisPath('assets/videos/example.mp4')));"],
    { cwd: root, encoding: "utf8" },
  );

  assert.equal(output, "false");
});

test("robots and sitemap sources exist and list the public pages", () => {
  assert.equal(existsSync(resolve(root, "robots.txt")), true, "robots.txt must exist");
  assert.equal(existsSync(resolve(root, "sitemap.xml")), true, "sitemap.xml must exist");

  const robots = read("robots.txt");
  const sitemap = read("sitemap.xml");
  assert.match(robots, /Sitemap: https:\/\/estiginto\.com\/sitemap\.xml/);
  for (const [, canonical] of pages) {
    assert.ok(sitemap.includes(`<loc>${canonical}</loc>`), `${canonical} must be in sitemap`);
  }
});
