import test from 'node:test';
import assert from 'node:assert/strict';
import { faqContentByLocale } from '../src/faqContent.js';

test('FAQ translations retain matching unique question IDs and complete answers', () => {
  const expected = faqContentByLocale.zh.map(group => group.items.map(item => item[0]));
  for (const groups of Object.values(faqContentByLocale)) {
    assert.deepEqual(groups.map(group => group.items.map(item => item[0])), expected);
    const items = groups.flatMap(group => group.items);
    assert.equal(new Set(items.map(item => item[0])).size, items.length);
    for (const [id, question, answer] of items) {
      assert.ok(question.trim() && answer.trim(), `Missing content for ${id}`);
    }
  }
});

test('English and Japanese FAQ answers are translated rather than falling back to Chinese', () => {
  const chinese = new Map(faqContentByLocale.zh.flatMap(group => group.items).map(([id, , answer]) => [id, answer]));
  for (const locale of ['en', 'ja']) {
    for (const [id, , answer] of faqContentByLocale[locale].flatMap(group => group.items)) {
      assert.notEqual(answer, chinese.get(id));
      if (locale === 'en') assert.doesNotMatch(answer, /\p{Script=Han}/u);
      else assert.match(answer, /[ぁ-んァ-ン]/u);
    }
  }
});
