import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { getLocaleFromPath, getPageFromPath, getPageMetadata, localizeHref, siteLocales, sitePages } from "../src/siteRoutes.js";
import { getContactHref, getServiceLabel } from "../src/serviceConnections.js";
import { renderLocalizedHtml, renderSitemap } from "../scripts/localized-pages.mjs";

for (const locale of siteLocales) {
  test(`${locale} routes identify all public pages and retain a shareable language`, () => {
    for (const page of sitePages) {
      const href = localizeHref(page.path, locale);
      assert.equal(getPageFromPath(href)?.key, page.key);
      assert.equal(getLocaleFromPath(href), locale);
      const metadata = getPageMetadata(page.key, locale);
      assert.equal(metadata.canonical, `https://estiginto.com${href}`);
      assert.equal(metadata.alternates.length, 4);
      assert.equal(metadata.alternates.find((item) => item.language === "x-default").href, `https://estiginto.com${page.path}`);
    }
  });

  test(`${locale} build emits translated metadata with no duplicate or stale canonical tags`, () => {
    for (const page of sitePages) {
      const source = readFileSync(new URL(`../${page.file}`, import.meta.url), "utf8");
      const html = renderLocalizedHtml(source, page.key, locale);
      const metadata = getPageMetadata(page.key, locale);
      assert.equal((html.match(/<title>/g) || []).length, 1);
      assert.equal((html.match(/name="description"/g) || []).length, 1);
      assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
      assert.equal((html.match(/hreflang=/g) || []).length, 4);
      assert.ok(html.includes(`href="${metadata.canonical}"`));
      assert.ok(html.includes(`property="og:locale" content="${metadata.ogLocale}"`));
      assert.ok(html.includes(`lang="${metadata.language}"`));
      if (locale !== "zh") assert.notEqual(metadata.title, getPageMetadata(page.key, "zh").title);
      // Re-running the build must not accumulate title, alternate or metadata tags.
      assert.equal(renderLocalizedHtml(html, page.key, locale), html);
    }
  });
}

test("switching language preserves the chosen service and section", () => {
  const href = "/ja/contact.html?service=international-finance#contact-options-title";
  assert.equal(localizeHref(href, "en"), "/en/contact.html?service=international-finance#contact-options-title");
  assert.equal(localizeHref(href, "zh"), "/contact.html?service=international-finance#contact-options-title");
  assert.equal(localizeHref("/en/solutions.html#custom-systems", "ja"), "/ja/solutions.html#custom-systems");
});

test("subsites, assets, external links and unknown paths are never rewritten into marketing routes", () => {
  for (const href of ["/Oasis/", "/map.html", "/brightbean-privacy.html", "/img/logo_estiginto.png", "/unknown.html", "https://lin.ee/vFdwfVg", "mailto:contact@estiginto.com", "//example.com/about.html", "#international-finance"]) {
    assert.equal(localizeHref(href, "en"), href);
  }
  assert.equal(getPageFromPath("/en/not-a-page.html"), null);
});

test("service inquiry context accepts only known services and uses localized labels", () => {
  assert.equal(getContactHref("international-finance", "en"), "/en/contact.html?service=international-finance");
  assert.equal(getServiceLabel("international-finance", "zh"), "國際金融");
  assert.equal(getServiceLabel("custom-systems", "ja"), "業務システム開発");
  assert.equal(getContactHref("untrusted-input", "en"), "/en/contact.html");
  assert.equal(getServiceLabel("<script>", "zh"), null);
});

test("sitemap includes all marketing URLs with reciprocal language alternatives", () => {
  const sitemap = renderSitemap();
  assert.equal((sitemap.match(/<loc>/g) || []).length, sitePages.filter((page) => !page.hidden).length * siteLocales.length);
  assert.equal((sitemap.match(/xhtml:link/g) || []).length, sitePages.filter((page) => !page.hidden).length * siteLocales.length * 4);
  for (const locale of siteLocales) for (const page of sitePages.filter((page) => !page.hidden)) assert.ok(sitemap.includes(`<loc>https://estiginto.com${localizeHref(page.path, locale)}</loc>`));
  assert.doesNotMatch(sitemap, /\/Oasis\//);
});
