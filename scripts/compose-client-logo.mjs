import sharp from "sharp";

const [input, output, title, subtitle] = process.argv.slice(2);

if (!input || !output || !title || !subtitle) {
  throw new Error("Usage: node scripts/compose-client-logo.mjs <input> <output> <title> <subtitle>");
}

const escapeXml = (value) => value
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

const icon = await sharp(input)
  .resize(92, 92, { fit: "contain" })
  .png()
  .toBuffer();

const labels = Buffer.from(`
  <svg width="320" height="160" viewBox="0 0 320 160" xmlns="http://www.w3.org/2000/svg">
    <style>
      .title { font-family: "Microsoft JhengHei", "Noto Sans CJK TC", sans-serif; font-size: 28px; font-weight: 700; fill: #171717; }
      .subtitle { font-family: Arial, sans-serif; font-size: 12px; font-weight: 500; letter-spacing: 0.1px; fill: #171717; }
    </style>
    <text class="title" x="146" y="72">${escapeXml(title)}</text>
    <text class="subtitle" x="146" y="98">${escapeXml(subtitle)}</text>
  </svg>
`);

await sharp({
  create: {
    width: 320,
    height: 160,
    channels: 4,
    background: { r: 255, g: 255, b: 255, alpha: 0 },
  },
})
  .composite([
    { input: icon, left: 38, top: 34 },
    { input: labels, left: 0, top: 0 },
  ])
  .webp({ lossless: true })
  .toFile(output);

console.log(`Created ${output}`);
