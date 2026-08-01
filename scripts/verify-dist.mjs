import { readdir, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const root = process.cwd();
const dist = join(root, "dist");
const requiredFiles = [
  "index.html",
  "about.html",
  "case.html",
  "solutions.html",
  "faq.html",
  "contact.html",
  "robots.txt",
  "sitemap.xml",
];
const maxDistBytes = 40 * 1024 * 1024;
const maxMarketingImageBytes = 1024 * 1024;

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await walk(path));
    } else {
      files.push(path);
    }
  }

  return files;
}

for (const file of requiredFiles) {
  await stat(join(dist, file));
}

const files = await walk(dist);
let totalBytes = 0;

for (const file of files) {
  const normalized = relative(dist, file).replaceAll("\\", "/");
  const { size } = await stat(file);
  totalBytes += size;

  if (normalized.startsWith("Oasis/assets/videos/")) {
    throw new Error(`Local Oasis video leaked into production: ${normalized}`);
  }

  if (normalized.startsWith("img/") && size > maxMarketingImageBytes) {
    throw new Error(`Marketing image exceeds 1 MiB: ${normalized} (${size} bytes)`);
  }
}

if (totalBytes > maxDistBytes) {
  throw new Error(`Production output exceeds 40 MiB: ${totalBytes} bytes`);
}

console.log(`Verified ${files.length} files, ${(totalBytes / 1024 / 1024).toFixed(2)} MiB total.`);
