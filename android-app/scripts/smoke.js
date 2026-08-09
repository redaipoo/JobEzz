/**
 * JobEzz — Smoke tests (zero dependencies, runs on plain Node).
 * Covers the pure modules (utils, i18n) so CI can gate regressions without
 * a full RN/Jest setup. Exits non-zero on any failure.
 *
 * Run: node scripts/smoke.js
 */
const assert = require('assert');

let passed = 0;
let failed = 0;

function ok(name, fn) {
  try {
    fn();
    passed++;
    console.log('  ok  ' + name);
  } catch (e) {
    failed++;
    console.error('  FAIL ' + name + ' -> ' + e.message);
  }
}

(async () => {
  console.log('JobEzz smoke tests');

  const utils = await import('../src/utils.ts');

  /* clamp */
  ok('clamp keeps in-range values', () => assert.strictEqual(utils.clamp(5, 0, 10), 5));
  ok('clamp clamps below min', () => assert.strictEqual(utils.clamp(-1, 0, 10), 0));
  ok('clamp clamps above max', () => assert.strictEqual(utils.clamp(11, 0, 10), 10));

  /* lerp */
  ok('lerp mid point', () => assert.strictEqual(utils.lerp(0, 10, 0.5), 5));
  ok('lerp end points', () => {
    assert.strictEqual(utils.lerp(0, 10, 0), 0);
    assert.strictEqual(utils.lerp(0, 10, 1), 10);
  });

  /* truncateText */
  ok('truncateText short text untouched', () => assert.strictEqual(utils.truncateText('مرحبا', 10), 'مرحبا'));
  ok('truncateText long text + ellipsis', () => assert.strictEqual(utils.truncateText('abcdefgh', 5), 'abcd…'));
  ok('truncateText empty input', () => assert.strictEqual(utils.truncateText(''), ''));

  /* jobMatchScore */
  const profile = { city: 'بنغازي', skills: ['سباكة', 'صيانة', 'Excel'], experience: '3 سنوات' };
  ok('jobMatchScore perfect overlap', () => {
    const s = utils.jobMatchScore({ matchScore: 95, expLevel: 'متوسط', loc: 'بنغازي', skills: ['سباكة', 'صيانة'] }, profile);
    assert.strictEqual(s, 98); /* capped */
  });
  ok('jobMatchScore no overlap keeps base', () => {
    const s = utils.jobMatchScore({ matchScore: 42, expLevel: 'مبتدئ', loc: 'طرابلس', skills: ['Figma'] }, profile);
    assert.strictEqual(s, 42);
  });
  ok('jobMatchScore respects floor', () => {
    const s = utils.jobMatchScore({ matchScore: 10, loc: 'طرابلس', skills: [] }, profile);
    assert.strictEqual(s, 25);
  });

  /* i18n */
  const i18n = await import('../src/i18n.ts');
  ok('i18n exposes STRINGS for ar/en', () => {
    assert.ok(i18n.STRINGS.ar && i18n.STRINGS.en);
  });
  ok('i18n ar has expected keys', () => {
    ['app', 'home', 'jobs', 'services', 'courses', 'profile'].forEach((k) => {
      assert.ok(k in i18n.STRINGS.ar, 'missing ar key: ' + k);
    });
  });
  ok('i18n en has expected keys', () => {
    ['app', 'home', 'jobs', 'services', 'courses', 'profile'].forEach((k) => {
      assert.ok(k in i18n.STRINGS.en, 'missing en key: ' + k);
    });
  });
  ok('i18n parity: ar keys === en keys (strict bilingual)', () => {
    const arKeys = Object.keys(i18n.STRINGS.ar).sort();
    const enKeys = Object.keys(i18n.STRINGS.en).sort();
    const onlyAr = arKeys.filter((k) => !enKeys.includes(k));
    const onlyEn = enKeys.filter((k) => !arKeys.includes(k));
    assert.deepStrictEqual(onlyAr, [], 'keys only in ar: ' + onlyAr.join(', '));
    assert.deepStrictEqual(onlyEn, [], 'keys only in en: ' + onlyEn.join(', '));
  });
  ok('i18n parity: nested values match shape in both languages', () => {
    const ar = i18n.STRINGS.ar;
    const en = i18n.STRINGS.en;
    Object.keys(ar).forEach((k) => {
      const a = ar[k];
      const e = en[k];
      if (typeof a === 'object' && a !== null) {
        assert.strictEqual(typeof e, 'object', 'en.' + k + ' is not an object');
        assert.deepStrictEqual(Object.keys(a).sort(), Object.keys(e).sort(), 'nested keys differ in ' + k);
      }
    });
  });

  console.log('\n' + passed + ' passed, ' + failed + ' failed');
  process.exit(failed > 0 ? 1 : 0);
})().catch((e) => {
  console.error('Smoke runner crashed:', e);
  process.exit(1);
});
