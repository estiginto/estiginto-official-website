export const siteOrigin = "https://estiginto.com";
export const siteLocales = ["zh", "en", "ja"];
export const sitePages = [
  { key: "home", file: "index.html", path: "/" },
  { key: "about", file: "about.html", path: "/about.html" },
  { key: "solutions", file: "solutions.html", path: "/solutions.html" },
  { key: "case", file: "case.html", path: "/case.html" },
  { key: "consulting", file: "consulting.html", path: "/consulting.html" },
  { key: "faq", file: "faq.html", path: "/faq.html" },
  { key: "contact", file: "contact.html", path: "/contact.html" },
];

const metadataByLocale = {
  zh: {
    home: ["ESTIGINTO 造物者科技｜資訊系統、設計、行銷與國際金融", "自 2011 年起，提供網站與客製化系統、品牌視覺、國際行銷，以及跨境資產資訊整合與專業協作服務。"],
    about: ["關於我們｜ESTIGINTO 造物者科技", "認識 ESTIGINTO 團隊與服務方向，涵蓋資訊系統、品牌設計、數位整合、國際行銷及跨境專業協作。"],
    solutions: ["解決方案｜ESTIGINTO 造物者科技", "網站設計、客製化系統開發、平面與品牌設計、行銷與廣告投放，依營運需求提供規劃與建置。"],
    case: ["精選實績｜ESTIGINTO 造物者科技", "查看 ESTIGINTO 在營運整合、IoT、電商會員與數位產品上的精選實績，了解各專案的應用需求與建置內容。"],
    consulting: ["顧問服務｜ESTIGINTO 造物者科技", "資訊系統、視覺設計、國際行銷、國際金融與數位整合，提供需求盤點、建置規劃及跨專業協作。"],
    faq: ["合作說明｜ESTIGINTO 造物者科技", "了解需求評估、預算與時程、系統整合、資料使用、交付驗收、授權及長期維護的合作方式。"],
    contact: ["聯絡我們｜ESTIGINTO 造物者科技", "透過 Email、電話或 LINE 洽詢資訊系統、網站、品牌設計、國際行銷及跨境資產與國際金融協作需求。"],
  },
  en: {
    home: ["ESTIGINTO | Systems, Design, Marketing & International Finance", "Since 2011, ESTIGINTO has delivered websites, custom systems, brand design, international marketing, and cross-border asset information and professional coordination."],
    about: ["About Us | ESTIGINTO", "Meet the ESTIGINTO team and explore our work in information systems, brand design, digital integration, international marketing, and cross-border coordination."],
    solutions: ["Solutions | ESTIGINTO", "Website design, custom system development, brand and graphic design, and marketing and advertising planned around your operating requirements."],
    case: ["Selected Work | ESTIGINTO", "Explore delivered features across business systems, equipment monitoring, e-commerce, and brand websites."],
    consulting: ["Consulting | ESTIGINTO", "Information systems, visual design, international marketing, international finance, and digital integration: requirements, implementation planning, and professional coordination."],
    faq: ["Working with Us | ESTIGINTO", "Learn about requirements, budgets, timelines, integrations, data use, acceptance, licensing, and ongoing support."],
    contact: ["Contact Us | ESTIGINTO", "Contact us by email, phone, or LINE about systems, websites, design, international marketing, and cross-border asset and financial coordination."],
  },
  ja: {
    home: ["ESTIGINTO｜情報システム・デザイン・マーケティング・国際金融", "2011年よりWebサイト、業務システム、ブランドデザイン、国際マーケティング、国際資産情報の統合と専門家連携を支援しています。"],
    about: ["私たちについて｜ESTIGINTO", "ESTIGINTOのチームと、情報システム、ブランドデザイン、デジタル統合、国際マーケティング、国際的な専門家連携をご紹介します。"],
    solutions: ["ソリューション｜ESTIGINTO", "Webサイト制作、業務システム開発、ブランド・グラフィックデザイン、マーケティング・広告運用を業務要件に合わせて提供します。"],
    case: ["実績紹介｜ESTIGINTO", "業務システム、設備監視、EC、ブランドサイトの構築実績と提供した機能を用途別にご紹介します。"],
    consulting: ["コンサルティング｜ESTIGINTO", "情報システム、ビジュアルデザイン、国際マーケティング、国際金融、デジタル統合の要件整理、構築計画、専門家連携を支援します。"],
    faq: ["ご依頼について｜ESTIGINTO", "要件、予算、日程、システム連携、データ利用、検収、ライセンス、保守についてご案内します。"],
    contact: ["お問い合わせ｜ESTIGINTO", "情報システム、Web、デザイン、国際マーケティング、国際資産・金融の専門家連携について、メール・電話・LINEでご相談ください。"],
  },
};

export function getLocaleFromPath(pathname) {
  return pathname.match(/^\/(en|ja)(?:\/|$)/)?.[1] || "zh";
}

export function getPageFromPath(pathname) {
  const path = pathname.replace(/^\/(en|ja)(?=\/|$)/, "") || "/";
  return sitePages.find((page) => page.path === path || (page.key === "home" && path === "/index.html")) || null;
}

// Localize only owned marketing routes. External links, assets and subsites keep their paths.
export function localizeHref(href, locale = "zh") {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  const url = new URL(href, siteOrigin);
  const page = getPageFromPath(url.pathname);
  if (!page) return href;
  const prefix = locale === "en" || locale === "ja" ? `/${locale}` : "";
  return `${prefix}${page.path}${url.search}${url.hash}`;
}

export function getPageMetadata(pageKey, locale = "zh") {
  const resolvedLocale = siteLocales.includes(locale) ? locale : "zh";
  const page = sitePages.find((item) => item.key === pageKey) || sitePages[0];
  const [title, description] = metadataByLocale[resolvedLocale][page.key];
  return {
    title, description,
    keywords: page.key === "case" ? {
      zh: "客製化系統開發, ERP 系統, WMS 倉儲管理, IoT 整合, 即時監控, 電子商務網站, 會員系統, 預約系統, 品牌官網, UI/UX 設計",
      en: "Custom system development, ERP, WMS, IoT integration, monitoring, e-commerce, membership, booking, brand websites, UI/UX design",
      ja: "業務システム開発, ERP, WMS, IoT連携, 設備監視, EC, 会員システム, 予約, ブランドサイト, UI/UXデザイン",
    }[resolvedLocale] : title.replaceAll("｜", ", ").replaceAll(" | ", ", "),
    language: resolvedLocale === "zh" ? "zh-Hant" : resolvedLocale,
    ogLocale: { zh: "zh_TW", en: "en_US", ja: "ja_JP" }[resolvedLocale],
    canonical: `${siteOrigin}${localizeHref(page.path, resolvedLocale)}`,
    alternates: [...siteLocales.map((language) => ({ language: language === "zh" ? "zh-Hant" : language, href: `${siteOrigin}${localizeHref(page.path, language)}` })), { language: "x-default", href: `${siteOrigin}${page.path}` }],
  };
}

export function applyPageMetadata(document, pageKey, locale) {
  const meta = getPageMetadata(pageKey, locale);
  document.documentElement.lang = meta.language;
  document.title = meta.title;
  const setMeta = (attribute, key, content) => {
    let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
    if (!element) { element = document.createElement("meta"); element.setAttribute(attribute, key); document.head.append(element); }
    element.content = content;
  };
  setMeta("name", "description", meta.description);
  setMeta("name", "keywords", meta.keywords);
  for (const [key, content] of Object.entries({ "og:title": meta.title, "og:description": meta.description, "og:url": meta.canonical, "og:locale": meta.ogLocale, "og:site_name": "ESTIGINTO" })) setMeta("property", key, content);
  setMeta("name", "twitter:title", meta.title);
  setMeta("name", "twitter:description", meta.description);
  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.append(canonical); }
  canonical.href = meta.canonical;
  document.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach((element) => element.remove());
  for (const alternate of meta.alternates) {
    const element = document.createElement("link"); element.rel = "alternate"; element.hreflang = alternate.language; element.href = alternate.href; document.head.append(element);
  }
}
