import { stat } from "node:fs/promises";
import { basename, extname, join } from "node:path";
import sharp from "sharp";

const root = process.cwd();
const imageDir = join(root, "img", "plan");
const sources = [
  "businesspeople-meeting-plan-analysis-graph-company-finance-strat.jpg",
  "close-up-elegant-decoration-house.jpg",
  "interior-large-distribution-warehouse-with-shelves-stacked-with-palettes-goods-ready-market.jpg",
  "man-holding-credit-card-hand-entering-security-code-using-laptop-keyboard.jpg",
];

for (const source of sources) {
  const input = join(imageDir, source);
  const output = join(imageDir, `${basename(source, extname(source))}.webp`);

  await sharp(input)
    .rotate()
    .resize({ width: 1920, height: 1920, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82, effort: 5 })
    .toFile(output);

  const { size } = await stat(output);
  console.log(`${basename(output)} ${(size / 1024).toFixed(0)} KiB`);
}
