import { cp, mkdir } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { marketingAssetPaths, rootStaticFiles, shouldCopyOasisPath } from "./static-assets.mjs";

const root = process.cwd();
const dist = join(root, "dist");

await mkdir(dist, { recursive: true });

for (const assetPath of marketingAssetPaths) {
  const destination = join(dist, "img", assetPath);
  await mkdir(dirname(destination), { recursive: true });
  await cp(join(root, "img", assetPath), destination, { force: true });
}

const oasisRoot = join(root, "Oasis");
await cp(oasisRoot, join(dist, "Oasis"), {
  recursive: true,
  force: true,
  filter: (source) => shouldCopyOasisPath(relative(oasisRoot, source)),
});

for (const file of rootStaticFiles) {
  await cp(join(root, file), join(dist, file), { force: true });
}
