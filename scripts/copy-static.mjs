import { cp, mkdir } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const dist = join(root, "dist");

const staticDirs = [
  "img",
];

await mkdir(dist, { recursive: true });

for (const dir of staticDirs) {
  await cp(join(root, dir), join(dist, dir), {
    recursive: true,
    force: true,
    filter: (source) => !source.includes("/old/") && !source.endsWith(".psd") && !source.endsWith(".mp4"),
  });
}
