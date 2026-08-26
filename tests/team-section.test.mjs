import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import { marketingAssetPaths } from "../scripts/static-assets.mjs";
import * as content2026 from "../src/content2026.js";

const root = resolve(import.meta.dirname, "..");

test("about team keeps the confirmed five English-only public identities in every locale", () => {
  const { supportedLocales, teamMembersByLocale } = content2026;
  assert.ok(teamMembersByLocale, "team member content must be exported");
  const expected = [
    ["lanar-lan", "CEO", "leadership"],
    ["yu-liang-chen", "CTO", "leadership"],
    ["cindy-wu", "CMO", "leadership"],
    ["yen-chen", "Director of International Business & Marketing Development", "advisory"],
    ["wayne-schutte", "International Education Coordinator & Curriculum Specialist", "advisory"],
  ];

  for (const locale of supportedLocales) {
    const members = teamMembersByLocale[locale];
    assert.deepEqual(members.map(({ id, role, group }) => [id, role, group]), expected);
    assert.equal(members.every(({ name, role, summary }) => !/[\u3040-\u30ff\u3400-\u9fff]/u.test(`${name}${role}${summary}`)), true);
  }
});

test("about page presents leadership and advisory after the studio manifesto", () => {
  const app = readFileSync(resolve(root, "src/App.jsx"), "utf8");

  assert.match(app, /<Numbers copy=\{copy\} \/>\s*<Manifesto copy=\{copy\} \/>\s*<TeamSection copy=\{copy\} \/>/);
});

test("about team renders the confirmed portraits and keeps a monogram fallback", () => {
  const members = content2026.teamMembersByLocale.en;
  const portraits = Object.fromEntries(members.map(({ id, portrait }) => [id, portrait]));

  assert.deepEqual(portraits, {
    "lanar-lan": "/img/team/avatar_lanar.jpg",
    "yu-liang-chen": undefined,
    "cindy-wu": "/img/team/avatar_Cindy.jpg",
    "yen-chen": "/img/team/avatar_Yen.jpg",
    "wayne-schutte": "/img/team/avatar_wayne.png",
  });

  for (const portrait of Object.values(portraits).filter(Boolean)) {
    assert.equal(existsSync(resolve(root, portrait.slice(1))), true, `${portrait} must exist`);
    assert.equal(marketingAssetPaths.includes(portrait.replace(/^\/img\//, "")), true, `${portrait} must ship in dist`);
  }

  const app = readFileSync(resolve(root, "src/App.jsx"), "utf8");
  assert.match(app, /member\.portrait\s*\?\s*\(/);
  assert.match(app, /<img[\s\S]*?src=\{member\.portrait\}[\s\S]*?alt=\{member\.name\}/);
  assert.match(app, /:\s*\(\s*<span[^>]*>\{member\.mark\}<\/span>/);
});
