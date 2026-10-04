import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { getPageMetadata, localizeHref, siteLocales, siteOrigin, sitePages } from "../src/siteRoutes.js";

const escape = (text) => text.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

export function renderLocalizedHtml(html, key, locale) {
  const meta = getPageMetadata(key, locale);
  let output = html.replace(/<html\s+lang="[^"]*"/, `<html lang="${meta.language}"`)
    .replace(/\s*<title>[\s\S]*?<\/title>/g, "")
    .replace(/\s*<meta\b[^>]*(?:name="(?:description|keywords|twitter:title|twitter:description)"|property="og:(?:title|description|url|locale|site_name)")[^>]*>/g, "")
    .replace(/\s*<link\b[^>]*(?:rel="canonical"|hreflang=)[^>]*>/g, "");
  const tags = [
    `<title>${escape(meta.title)}</title>`,
    `<meta name="description" content="${escape(meta.description)}" />`,
    `<meta name="keywords" content="${escape(meta.keywords)}" />`,
    `<link rel="canonical" href="${meta.canonical}" />`,
    ...meta.alternates.map((item) => `<link rel="alternate" hreflang="${item.language}" href="${item.href}" />`),
    ...Object.entries({ "og:title": meta.title, "og:description": meta.description, "og:url": meta.canonical, "og:locale": meta.ogLocale, "og:site_name": "ESTIGINTO" }).map(([key, value]) => `<meta property="${key}" content="${escape(value)}" />`),
    `<meta name="twitter:title" content="${escape(meta.title)}" />`,
    `<meta name="twitter:description" content="${escape(meta.description)}" />`,
  ];
  return output.replace("</head>", `${tags.join("\n    ")}\n  </head>`);
}

export function renderSitemap() {
  const entries = sitePages.map((page) => `  <url><loc>${siteOrigin}${page.path}</loc>${getPageMetadata(page.key).alternates.map((item) => `<xhtml:link rel="alternate" hreflang="${item.language}" href="${item.href}"/>`).join("")}</url>`);
  for (const locale of ["en", "ja"]) {
    for (const page of sitePages) entries.push(`  <url><loc>${siteOrigin}${localizeHref(page.path, locale)}</loc>${getPageMetadata(page.key, locale).alternates.map((item) => `<xhtml:link rel="alternate" hreflang="${item.language}" href="${item.href}"/>`).join("")}</url>`);
  }
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join("\n")}\n</urlset>\n`;
}

export async function writeLocalizedPages(dist) {
  for (const page of sitePages) {
    const html = await readFile(join(dist, page.file), "utf8");
    for (const locale of siteLocales) {
      const directory = locale === "zh" ? dist : join(dist, locale);
      await mkdir(directory, { recursive: true });
      await writeFile(join(directory, page.file), renderLocalizedHtml(html, page.key, locale));
    }
  }
  await writeFile(join(dist, "sitemap.xml"), renderSitemap());
}
