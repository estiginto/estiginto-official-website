import { getServiceMenuGroups } from "./navigationMenu.js";
import { serviceFamiliesByLocale } from "./content2026.js";
import { localizeHref } from "./siteRoutes.js";

export function getServiceLabel(id, locale = "zh") {
  const services = [...getServiceMenuGroups(locale).growth.items, ...(serviceFamiliesByLocale[locale] || serviceFamiliesByLocale.zh)];
  const service = services.find((item) => (item.key || item.id) === id);
  return service?.label || service?.title || null;
}

export function getContactHref(id, locale = "zh") {
  const query = getServiceLabel(id, locale) ? `?service=${encodeURIComponent(id)}` : "";
  return localizeHref(`/contact.html${query}`, locale);
}

export const solutionConnections = {
  "website-design": ["digital-integration", "visual-design"],
  "custom-systems": ["systems-consulting", "digital-integration"],
  "graphic-design": ["visual-design"],
  "marketing-ads": ["international-marketing"],
};

export const consultingConnections = {
  "systems-consulting": ["custom-systems"],
  "visual-design": ["graphic-design", "website-design"],
  "international-marketing": ["marketing-ads", "website-design"],
  "digital-integration": ["website-design", "custom-systems"],
};

export const connectionCopy = {
  zh: { planning: "相關顧問規劃", implementation: "相關建置服務", intro: "顧問服務提供需求盤點、策略規劃與專業協作；解決方案說明網站、系統、設計與行銷的建置內容。可依需求分別委託或整合執行。", solutions: "查看解決方案" },
  en: { planning: "Related consulting", implementation: "Related implementation", intro: "Consulting covers requirements, strategy, and professional coordination. Solutions describe website, system, design, and marketing delivery. You can commission either separately or together.", solutions: "Explore solutions" },
  ja: { planning: "関連するコンサルティング", implementation: "関連する構築サービス", intro: "コンサルティングでは要件整理、戦略設計、専門家連携を支援し、ソリューションではWeb、システム、デザイン、マーケティングの構築内容をご案内します。個別のご依頼にも、一括での実施にも対応します。", solutions: "ソリューションを見る" },
};
