export const marketingAssetPaths = [
  "Logo_ESTIGINTO.svg",
  "logo_estiginto.png",
  "plan/businesspeople-meeting-plan-analysis-graph-company-finance-strat.webp",
  "plan/close-up-elegant-decoration-house.webp",
  "plan/interior-large-distribution-warehouse-with-shelves-stacked-with-palettes-goods-ready-market.webp",
  "plan/laptop-coworking-space_53876-14515.webp",
  "plan/man-holding-credit-card-hand-entering-security-code-using-laptop-keyboard.webp",
];

export const rootStaticFiles = ["robots.txt", "sitemap.xml"];

export function shouldCopyOasisPath(relativePath) {
  const normalized = relativePath.replaceAll("\\", "/").replace(/^\.\//, "");
  return normalized !== "assets/videos" && !normalized.startsWith("assets/videos/");
}

