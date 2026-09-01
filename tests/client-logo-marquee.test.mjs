import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import sharp from "sharp";
import test from "node:test";
import { marketingAssetPaths } from "../scripts/static-assets.mjs";
import { buildClientLogoLanes, clientLogos } from "../src/clientLogoMarquee.js";

const css = readFileSync(new URL("../src/App.css", import.meta.url), "utf8");
const appSource = readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
const extractionSource = readFileSync(new URL("../scripts/extract-client-logos.py", import.meta.url), "utf8");

async function getVisibleLogoBounds(path) {
  const { info } = await sharp(path)
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer({ resolveWithObject: true });

  return {
    width: info.width,
    height: info.height,
    left: -info.trimOffsetLeft,
    top: -info.trimOffsetTop,
  };
}

async function getVisiblePixelRatio(path) {
  const { data, info } = await sharp(path)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  let visiblePixels = 0;

  for (let alphaIndex = 3; alphaIndex < data.length; alphaIndex += 4) {
    if (data[alphaIndex] > 16) visiblePixels += 1;
  }

  return visiblePixels / (info.width * info.height);
}

test("client logos render at the approved larger marquee size", () => {
  const itemRule = css.match(/\.client-logo-marquee-item\s*\{([^}]*)\}/)?.[1] || "";
  const imageRule = css.match(/\.client-logo-marquee-item img\s*\{([^}]*)\}/)?.[1] || "";

  assert.match(itemRule, /flex:\s*1 0 clamp\(184px,\s*17vw,\s*252px\)/);
  assert.match(itemRule, /min-height:\s*clamp\(92px,\s*8vw,\s*118px\)/);
  assert.match(imageRule, /width:\s*min\(96%,\s*220px\)/);
  assert.match(imageRule, /height:\s*80px/);
  assert.match(imageRule, /max-height:\s*none/);
  assert.match(imageRule, /filter:\s*grayscale\(1\) contrast\(1\.22\)/);
  assert.match(imageRule, /opacity:\s*0\.86/);
});

test("client logo hover keeps its existing reveal while rendering on a crisp layer", () => {
  const imageRule = css.match(/\.client-logo-marquee-item img\s*\{([^}]*)\}/)?.[1] || "";
  const hoverRule = css.match(/\.client-logo-marquee-item:hover img\s*\{([^}]*)\}/)?.[1] || "";

  assert.match(imageRule, /backface-visibility:\s*hidden/);
  assert.match(imageRule, /image-rendering:\s*auto/);
  assert.match(hoverRule, /filter:\s*none/);
  assert.match(hoverRule, /opacity:\s*1/);
  assert.match(hoverRule, /translateZ\(0\) scale\(1\.04\)/);
});

test("client logo marquee does not pause on hover or expose client names as text alternatives", () => {
  const marqueeSource = appSource.match(/function ClientLogoMarquee[\s\S]*?\n\}/)?.[0] || "";

  assert.doesNotMatch(css, /client-logo-marquee-field:hover[^{]*\{[^}]*animation-play-state:\s*paused/);
  assert.match(marqueeSource, /aria-hidden="true"/);
  assert.match(marqueeSource, /<img src=\{client\.src\} alt=""/);
  assert.doesNotMatch(marqueeSource, /aria-label=\{copy\.clientLogos\.title\}/);
  assert.doesNotMatch(marqueeSource, /alt=\{client\.alt\}/);
});

test("client logo inventory contains every normalized source logo", () => {
  assert.equal(clientLogos.length, 48);
  assert.equal(new Set(clientLogos.map((client) => client.id)).size, 48);
  assert.equal(new Set(clientLogos.map((client) => client.src)).size, 48);
  assert.equal(clientLogos.every((client) => client.alt.length > 0), true);
  assert.equal(clientLogos.every((client) => existsSync(`.${client.src}`)), true);
  assert.equal(clientLogos.some((client) => client.id === "fable"), false);
  assert.equal(clientLogos.some((client) => client.id === "tainan-airport"), false);
  assert.equal(clientLogos.some((client) => client.id === "rotary"), false);
  assert.equal(clientLogos.some((client) => client.id === "lions"), false);
  assert.equal(clientLogos.some((client) => client.id === "wilderness"), false);
  assert.equal(clientLogos.some((client) => client.id === "gb-biotech"), false);
});

test("every declared marketing asset exists before the production copy step", () => {
  for (const assetPath of marketingAssetPaths) {
    assert.equal(
      existsSync(new URL(`../img/${assetPath}`, import.meta.url)),
      true,
      `${assetPath} must exist before it is copied to dist`,
    );
  }
});

test("displayed client logos provide three-times-density source images", async () => {
  const metadata = await Promise.all(clientLogos.map((client) => sharp(`.${client.src}`).metadata()));
  assert.equal(metadata.every((image) => image.width === 960 && image.height === 480), true);
});

test("mobile client logo lanes keep every logo inside a fixed, unrotated cell", () => {
  const mobileRule = css.match(/@media \(max-width: 640px\), \(pointer: coarse\) \{([\s\S]*?)\n\}/)?.[1] || "";

  assert.match(mobileRule, /\.client-logo-marquee-field\s*\{[^}]*transform:\s*none/);
  assert.match(mobileRule, /\.client-logo-marquee-item\s*\{[^}]*flex:\s*0 0 168px/);
  assert.match(mobileRule, /\.client-logo-marquee-item\s*\{[^}]*overflow:\s*hidden/);
  assert.match(mobileRule, /\.client-logo-marquee-item img\s*\{[^}]*max-width:\s*calc\(100% - 20px\)/);
});

test("client logo anchor leaves its heading clear of the sticky navigation", () => {
  const sectionRule = css.match(/\.client-logo-marquee\s*\{([^}]*)\}/)?.[1] || "";

  assert.match(sectionRule, /scroll-margin-top:\s*clamp\(64px,\s*8vw,\s*88px\)/);
});

test("King Life is extracted from a complete high-resolution PDF crop", () => {
  assert.match(
    extractionSource,
    /\("king-life", "King Life 徠福文具", \(1360, 1150, 1850, 1290\)\)/,
  );
});

test("client inventory is arranged into four curated brand lanes", () => {
  const lanes = buildClientLogoLanes(clientLogos);

  assert.deepEqual(lanes.map((lane) => lane.length), [13, 5, 10, 20]);
  assert.deepEqual(lanes[1].map((client) => client.id), [
    "tradevan",
    "bureau-foreign-trade",
    "trade-negotiations",
    "taipei-architects",
    "taiwan-stock-exchange",
  ]);
  assert.deepEqual(lanes[0].map((client) => client.id), [
    "marketech",
    "ezoom",
    "ey",
    "lotus",
    "commonwealth",
    "morinaga",
    "jung-kwan-jang",
    "yang-ming",
    "you-ming-huei",
    "taiwan-mainstream-coop",
    "kyl-auction",
    "kyce",
    "king-life",
  ]);
  assert.deepEqual(lanes[2].map((client) => client.id), [
    "merica",
    "bauer-group",
    "lecoln-keysight",
    "evco-creative-home",
    "conflux",
    "taiwan-psychoanalytic",
    "wealthylife",
    "sleekstrip",
    "zhencheng-family-office",
    "spg",
  ]);
  assert.equal(lanes[3].some((client) => client.id === "eighteen-tea"), true);
  assert.deepEqual(
    lanes[3].slice(-9).map((client) => client.id),
    [
      "fvs",
      "juoda",
      "yun-counseling",
      "shanheyu",
      "apex-royal",
      "noah-builders",
      "zentia",
      "yabung",
      "chun-hon-tech",
    ],
  );
  assert.equal(lanes.flat().every((item) => item.src !== null), true);
});

test("Chun Hon Tech is rendered from the supplied asset in the fourth lane", async () => {
  const lanes = buildClientLogoLanes(clientLogos);
  const client = lanes[3].find((item) => item.id === "chun-hon-tech");

  assert.deepEqual(client, {
    id: "chun-hon-tech",
    alt: "中流科技 Chun Hon Tech",
    tier: 4,
    src: "/img/client-logos/chun-hon-tech.webp",
  });
  assert.equal(existsSync(`.${client.src}`), true);
  assert.deepEqual(
    await sharp(`.${client.src}`).metadata().then(({ width, height }) => ({ width, height })),
    { width: 960, height: 480 },
  );
});

test("Merica uses a wide lockup with readable copy to the right of its mark", async () => {
  const bounds = await getVisibleLogoBounds("./img/client-logos/merica.webp");

  assert.ok(bounds.width >= 650, `expected a wide lockup, received ${bounds.width}px`);
  assert.ok(bounds.left >= 70, `expected safe left margin, received ${bounds.left}px`);
  assert.ok(960 - bounds.left - bounds.width >= 70, "expected safe right margin");
});

test("WealthyLife artwork keeps enough transparent margin to avoid visual clipping", async () => {
  const bounds = await getVisibleLogoBounds("./img/client-logos/wealthylife.webp");

  assert.ok(bounds.left >= 110, `expected wider left margin, received ${bounds.left}px`);
  assert.ok(960 - bounds.left - bounds.width >= 110, "expected wider right margin");
  assert.ok(bounds.top >= 110, `expected safe top margin, received ${bounds.top}px`);
  assert.ok(480 - bounds.top - bounds.height >= 110, "expected safe bottom margin");
});

test("Lotus uses the transparent official wordmark instead of a handmade backing panel", async () => {
  const visiblePixelRatio = await getVisiblePixelRatio("./img/client-logos/lotus.webp");
  const bounds = await getVisibleLogoBounds("./img/client-logos/lotus.webp");

  assert.ok(visiblePixelRatio < 0.3, `expected transparent artwork, received ${visiblePixelRatio}`);
  assert.ok(bounds.width >= 650, `expected a legible wordmark, received ${bounds.width}px`);
});

test("King Life uses its official two-mark lockup without the old full-width color strip", async () => {
  const visiblePixelRatio = await getVisiblePixelRatio("./img/client-logos/king-life.webp");
  const bounds = await getVisibleLogoBounds("./img/client-logos/king-life.webp");

  assert.ok(visiblePixelRatio < 0.28, `expected transparent artwork, received ${visiblePixelRatio}`);
  assert.ok(bounds.width >= 600, `expected a legible lockup, received ${bounds.width}px`);
});

test("Marketech fills its logo cell from the official artwork instead of a padded thumbnail", async () => {
  const bounds = await getVisibleLogoBounds("./img/client-logos/marketech.webp");

  assert.ok(bounds.width >= 760, `expected a wide official mark, received ${bounds.width}px`);
  assert.ok(bounds.height >= 220, `expected a legible official mark, received ${bounds.height}px`);
});

test("client logo marquee reserves four populated lanes without inventing brands", () => {
  const lanes = buildClientLogoLanes();

  assert.equal(lanes.length, 4);
  assert.deepEqual(lanes.map((lane) => lane.length), [6, 6, 6, 6]);
  assert.equal(lanes.flat().every((item) => item.src === null && item.alt === ""), true);
  assert.equal(new Set(lanes.flat().map((item) => item.id)).size, 24);
});

test("client logos are distributed across all four lanes without truncation", () => {
  const clients = Array.from({ length: 29 }, (_, index) => ({
    id: `client-${index + 1}`,
    src: `/img/clients/client-${index + 1}.svg`,
    alt: `Client ${index + 1}`,
  }));

  const lanes = buildClientLogoLanes(clients);

  assert.deepEqual(lanes.map((lane) => lane.length), [8, 7, 7, 7]);
  assert.deepEqual(lanes.flatMap((lane) => lane).map((item) => item.id).sort(), clients.map((item) => item.id).sort());
});
