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
  zh: { planning: "相關顧問規劃", implementation: "相關建置服務" },
  en: { planning: "Related consulting", implementation: "Related implementation" },
  ja: { planning: "関連するコンサルティング", implementation: "関連する構築サービス" },
};
