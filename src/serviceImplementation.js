import { getConsultingHref } from "./consultingPages.js";

// Build and delivery content belongs to the service that provides it.
export const implementationOwners = {
  "custom-systems": "systems-consulting",
  "graphic-design": "visual-design",
  "marketing-ads": "international-marketing",
  "website-design": "digital-integration",
};

export function getServiceImplementationIds(service) {
  return Object.keys(implementationOwners).filter((id) => implementationOwners[id] === service);
}

export function getImplementationHref(id) {
  const owner = implementationOwners[id];
  return owner ? `${getConsultingHref(owner)}#implementation-${id}` : "/consulting.html";
}

// Keep existing bookmarks useful without exposing the former solutions page.
export function getHiddenSolutionsDestination(pathname, hash, search = "") {
  const prefix = pathname.match(/^\/(en|ja)(?=\/)/)?.[0] || "";
  if (pathname !== `${prefix}/solutions.html`) return null;
  const id = hash.replace(/^#/, "");
  const destination = getImplementationHref(id);
  const [path, anchor] = destination.split("#");
  return `${prefix}${path}${search}${anchor ? `#${anchor}` : ""}`;
}
