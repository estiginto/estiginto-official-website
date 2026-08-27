import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const outputDirectory = path.resolve("img/client-logos");
const canvas = { width: 960, height: 480 };
const content = { width: 816, height: 336 };
const navy = "#14253f";

const sourceLogos = [
  ["juoda", "C:/Project/juoda.com.tw/customer-assets/juoda/logo-dark.png"],
  ["yun-counseling", "C:/Project/Yun-Counseling/public/brand/yun-logo-primary.png"],
  ["apex-royal", "C:/Project/apex-royal/src/assets/apex-legacy-logo.png"],
  ["noah-builders", "C:/Project/noahbuilders.org/src/assets/media/logos/logo_red_noahbuilders.png"],
];

async function writeCentered(id, logoBuffer) {
  const metadata = await sharp(logoBuffer).metadata();
  const left = Math.round((canvas.width - metadata.width) / 2);
  const top = Math.round((canvas.height - metadata.height) / 2);

  await sharp({
    create: {
      ...canvas,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    },
  })
    .composite([{ input: logoBuffer, left, top }])
    .webp({ lossless: true })
    .toFile(path.join(outputDirectory, `${id}.webp`));
}

async function normalizeSource(id, source) {
  const buffer = await sharp(source, { density: 300 })
    .rotate()
    .trim({ threshold: 12 })
    .resize(content.width, content.height, { fit: "inside", withoutEnlargement: false })
    .sharpen({ sigma: 0.55 })
    .png()
    .toBuffer();

  await writeCentered(id, buffer);
}

function textSvg({ title, subtitle = "", width = 560, align = "start" }) {
  const anchor = align === "middle" ? "middle" : "start";
  const x = align === "middle" ? width / 2 : 0;
  return Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="230" viewBox="0 0 ${width} 230">
      <style>
        .title { font-family: "Microsoft JhengHei", "Noto Sans CJK TC", sans-serif; font-size: 58px; font-weight: 700; letter-spacing: 2px; fill: ${navy}; }
        .subtitle { font-family: Arial, sans-serif; font-size: 24px; font-weight: 600; letter-spacing: 5px; fill: #526075; }
      </style>
      <text class="title" x="${x}" y="96" text-anchor="${anchor}">${title}</text>
      ${subtitle ? `<text class="subtitle" x="${x}" y="150" text-anchor="${anchor}">${subtitle}</text>` : ""}
      <rect x="${align === "middle" ? width / 2 - 34 : 0}" y="188" width="68" height="3" rx="1.5" fill="#b88743"/>
    </svg>
  `);
}

async function composeMarkAndText(id, markSource, title, subtitle) {
  const mark = await sharp(markSource, { density: 300 })
    .trim({ threshold: 10 })
    .resize(210, 210, { fit: "inside" })
    .png()
    .toBuffer();
  const markMetadata = await sharp(mark).metadata();
  const label = textSvg({ title, subtitle, width: 510 });

  await sharp({
    create: {
      ...canvas,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    },
  })
    .composite([
      { input: mark, left: 90, top: Math.round((canvas.height - markMetadata.height) / 2) },
      { input: label, left: 340, top: 125 },
    ])
    .webp({ lossless: true })
    .toFile(path.join(outputDirectory, `${id}.webp`));
}

async function composeTextOnly(id, title, subtitle) {
  const label = textSvg({ title, subtitle, width: 816, align: "middle" });
  await sharp({
    create: {
      ...canvas,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    },
  })
    .composite([{ input: label, left: 72, top: 125 }])
    .webp({ lossless: true })
    .toFile(path.join(outputDirectory, `${id}.webp`));
}

async function extractZentiaWordmark() {
  const source = "C:/Project/zentia/src/assets/client-media/footer-logo.jpg";
  const crop = { left: 88, top: 350, width: 1080, height: 470 };
  const { data, info } = await sharp(source)
    .extract(crop)
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const rgba = Buffer.alloc(info.width * info.height * 4);

  for (let index = 0; index < data.length; index += 1) {
    const alpha = Math.max(0, Math.min(255, Math.round((data[index] - 70) * 1.7)));
    rgba[index * 4] = 20;
    rgba[index * 4 + 1] = 37;
    rgba[index * 4 + 2] = 63;
    rgba[index * 4 + 3] = alpha;
  }

  const wordmark = await sharp(rgba, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .trim({ threshold: 10 })
    .resize(content.width, content.height, { fit: "inside" })
    .sharpen({ sigma: 0.5 })
    .png()
    .toBuffer();
  await writeCentered("zentia", wordmark);
}

await mkdir(outputDirectory, { recursive: true });
await Promise.all(sourceLogos.map(([id, source]) => normalizeSource(id, source)));
await composeTextOnly("zhencheng-family-office", "臻承國際家族辦公室聯盟", "INTERNATIONAL FAMILY OFFICE ALLIANCE");
await composeMarkAndText("shanheyu", "C:/Project/善和寓/assets/logo.svg", "善和寓", "SHAN HE YU");
await composeMarkAndText("yabung", "C:/Project/yabung-official/public/assets/mark.svg", "亞楓好物", "YABUNG ENTERPRISE");
await extractZentiaWordmark();

console.log("Imported 8 cross-project client logos.");
