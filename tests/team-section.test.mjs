import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
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
