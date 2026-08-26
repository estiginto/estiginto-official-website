const clientLogoAssetPaths = [
  "marketech", "ezoom", "tradevan", "ey", "lotus", "spg",
  "taiwan-mainstream-coop", "kyl-auction", "eighteen-tea", "evco-creative-home", "merica", "after-school-nest",
  "commonwealth", "bureau-foreign-trade", "trade-negotiations", "taiwan-stock-exchange", "taipei-architects",
  "morinaga", "jung-kwan-jang", "kyce", "conflux", "fable", "tainan-airport", "archi-5", "mca-creative-industries",
  "taiwan-psychoanalytic", "wealthylife", "beyond-amazing", "sleekstrip", "king-life",
  "jing-he-medical", "a-plus-dermatology", "bauer-group", "lecoln-keysight", "mj-color",
  "rotary", "bcfbw", "lions", "vantage", "wilderness", "worthbee", "gb-biotech", "fvs", "yang-ming",
].map((name) => `client-logos/${name}.webp`);

export const marketingAssetPaths = [
  "Logo_ESTIGINTO.svg",
  "logo_estiginto.png",
  "plan/businesspeople-meeting-plan-analysis-graph-company-finance-strat.webp",
  "plan/close-up-elegant-decoration-house.webp",
  "plan/interior-large-distribution-warehouse-with-shelves-stacked-with-palettes-goods-ready-market.webp",
  "plan/laptop-coworking-space_53876-14515.webp",
  "plan/man-holding-credit-card-hand-entering-security-code-using-laptop-keyboard.webp",
  ...clientLogoAssetPaths,
];

export const rootStaticFiles = ["robots.txt", "sitemap.xml"];

export function shouldCopyOasisPath(relativePath) {
  const normalized = relativePath.replaceAll("\\", "/").replace(/^\.\//, "");
  return normalized !== "assets/videos" && !normalized.startsWith("assets/videos/");
}

