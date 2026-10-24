/* Run with:  node tests/test-rules.js
   Checks the safety rules, validation and the AI-output guard against sample
   inputs. No installs needed (Node 14+). */
'use strict';
const assert = require('assert');
const R = require('../rules.js');

// A baseline valid input: mild cold, no warning signs. Each test overrides parts.
function sample(overrides) {
  return Object.assign({
    ageGroup: '18-64',
    symptoms: ['sorethroat', 'cough', 'fatigue'],
    otherSymptoms: '',
    duration: '1-3d',
    severity: 'mild',
    temperatureValue: '',
    temperatureUnit: 'C',
    pain: 'none',
    details: '',
    worsening: 'no',
    emergencySigns: [],
    otherSigns: [],
    noneApply: true,
    notSure: false
  }, overrides);
}

const tests = [];
function test(name, fn) { tests.push({ name: name, fn: fn }); }
const levelOf = function (input) { return R.evaluateSafety(input).level; };

// ---- The five realistic test cases (also listed in docs/TESTING_AND_VIVA.md) ----
test('TC1 mild cold-like symptoms -> monitor', function () {
  assert.strictEqual(levelOf(sample({})), 'monitor');
});
test('TC2 fever for 5 days, moderate -> soon', function () {
  const input = sample({ symptoms: ['fever', 'bodyaches', 'headache'], duration: '4-7d', severity: 'moderate', temperatureValue: '38.6' });
  const result = R.evaluateSafety(input);
  assert.strictEqual(result.level, 'soon');
  assert.ok(result.triggered.some(function (t) { return t.id === 'S-FEVER-DURATION'; }));
});
test('TC3 chest pain ticked, otherwise mild -> emergency', function () {
  const input = sample({ symptoms: ['fatigue'], emergencySigns: ['chestpain'], noneApply: false });
  assert.strictEqual(levelOf(input), 'emergency');
});
test('TC4 baby under 3 months with fever -> urgent', function () {
  const input = sample({ ageGroup: 'under3m', symptoms: ['fever'], duration: 'lt24h' });
  assert.strictEqual(levelOf(input), 'urgent');
});
test('TC5 vomiting, diarrhea, dizziness, moderate and worsening -> urgent', function () {
  const input = sample({ symptoms: ['vomiting', 'diarrhea', 'dizziness'], severity: 'moderate', worsening: 'yes' });
  assert.strictEqual(levelOf(input), 'urgent');
});

// ---- Extra safety behaviour ----
test('Mild severity can never downgrade an emergency sign', function () {
  const input = sample({ severity: 'mild', emergencySigns: ['stroke'], noneApply: false });
  assert.strictEqual(levelOf(input), 'emergency');
});
test('Every emergency checkbox on its own triggers emergency', function () {
  R.EMERGENCY_SIGNS.forEach(function (sign) {
    assert.strictEqual(levelOf(sample({ emergencySigns: [sign.id], noneApply: false })), 'emergency', sign.id);
  });
});
test('Emergency wording typed in free text triggers emergency (curly apostrophe too)', function () {
  assert.strictEqual(levelOf(sample({ otherSymptoms: 'I can\u2019t breathe properly' })), 'emergency');
  assert.strictEqual(levelOf(sample({ details: 'tight chest pain since morning' })), 'emergency');
  assert.strictEqual(levelOf(sample({ otherSymptoms: 'feeling like I want to kill myself' })), 'emergency');
});
test('Self-harm wording adds crisis support to the guidance', function () {
  const input = sample({ emergencySigns: ['selfharm'], noneApply: false });
  const report = R.buildLocalReport(input, R.evaluateSafety(input));
  assert.strictEqual(report.guidance.selfHarm, true);
});
test('"Not sure" about warning signs is never treated as "none" -> urgent', function () {
  assert.strictEqual(levelOf(sample({ noneApply: false, notSure: true })), 'urgent');
});
test('Severe symptoms -> urgent, even with no warning signs', function () {
  assert.strictEqual(levelOf(sample({ severity: 'severe' })), 'urgent');
});
test('Mild but worsening -> soon', function () {
  assert.strictEqual(levelOf(sample({ worsening: 'yes' })), 'soon');
});
test('Symptoms longer than a week -> soon', function () {
  assert.strictEqual(levelOf(sample({ duration: '8-14d' })), 'soon');
});
test('Pregnancy / weakened immunity / long-term condition -> urgent', function () {
  assert.strictEqual(levelOf(sample({ otherSigns: ['vulnerable'] })), 'urgent');
});
test('Triggered rules are returned with reasons and are read-only', function () {
  const result = R.evaluateSafety(sample({ severity: 'severe' }));
  assert.ok(result.triggered.length > 0 && result.triggered[0].text.length > 0);
  assert.ok(Object.isFrozen(result) && Object.isFrozen(result.triggered));
});

// ---- Validation ----
test('Valid sample passes validation', function () {
  assert.deepStrictEqual(R.validateInput(sample({})), {});
});
test('Empty form reports every required field', function () {
  const errors = R.validateInput({});
  ['symptoms', 'duration', 'severity', 'worsening', 'warnings'].forEach(function (key) {
    assert.ok(errors[key], 'missing error for ' + key);
  });
});
test('Warning-sign question must be answered (no silent "none")', function () {
  assert.ok(R.validateInput(sample({ noneApply: false })).warnings);
});
test('"None of these apply" cannot be combined with a sign', function () {
  assert.ok(R.validateInput(sample({ noneApply: true, emergencySigns: ['seizure'] })).warnings);
});
test('Temperature is range-checked per unit', function () {
  assert.ok(R.validateInput(sample({ temperatureValue: '98.6', temperatureUnit: 'C' })).temperature);
  assert.ok(R.validateInput(sample({ temperatureValue: 'abc' })).temperature);
  assert.strictEqual(R.validateInput(sample({ temperatureValue: '98.6', temperatureUnit: 'F' })).temperature, undefined);
});
test('Own-words symptom text alone is enough for the symptom field', function () {
  assert.strictEqual(R.validateInput(sample({ symptoms: [], otherSymptoms: 'itchy eyes' })).symptoms, undefined);
});

// ---- Report content ----
test('Report only restates entered information', function () {
  const input = sample({ symptoms: ['fever'], temperatureValue: '38.2' });
  const report = R.buildLocalReport(input, R.evaluateSafety(input));
  assert.deepStrictEqual(report.symptoms, ['Fever']);
  assert.ok(report.summary.indexOf('38.2') !== -1);
  assert.ok(!/cough|headache/i.test(report.summary));
  assert.ok(report.disclaimer.indexOf('not a diagnosis') !== -1);
});
test('Missing temperature is flagged when fever is selected', function () {
  const input = sample({ symptoms: ['fever'] });
  const report = R.buildLocalReport(input, R.evaluateSafety(input));
  assert.ok(report.missingInfo.some(function (m) { return /did not record a temperature/.test(m); }));
});
test('AI payload carries no name or address fields', function () {
  const keys = Object.keys(R.buildAiPayload(sample({}))).join(',');
  assert.ok(!/name|address|phone|email/i.test(keys));
});

// ---- AI output guard ----
const goodAi = { summary: 'You reported a sore throat and cough for 1 to 3 days.', questions: ['What could be causing this?'], missingInfo: ['No temperature was recorded.'] };
test('AI guard accepts clean, cautious output', function () {
  assert.ok(R.validateAiExtras(goodAi));
});
test('AI guard rejects dosage, prescribing and reassurance', function () {
  const bad = [
    'Take 500 mg of paracetamol.',
    'Your doctor may prescribe antibiotics.',
    'This is harmless and will go away.',
    'You probably have the flu.',
    'There is nothing to worry about.'
  ];
  bad.forEach(function (text) {
    assert.strictEqual(R.validateAiExtras(Object.assign({}, goodAi, { summary: text })), null, text);
  });
});
test('AI guard rejects malformed shapes', function () {
  assert.strictEqual(R.validateAiExtras(null), null);
  assert.strictEqual(R.validateAiExtras({ summary: 'x', questions: 'no', missingInfo: [] }), null);
  assert.strictEqual(R.validateAiExtras(Object.assign({}, goodAi, { questions: [42] })), null);
});

// ---- New in v2: more symptoms, details, catalog, comparison, export ----
test('Shortness of breath symptom -> urgent', function () {
  assert.strictEqual(levelOf(sample({ symptoms: ['breathless'] })), 'urgent');
});
test('Fast or irregular heartbeat -> urgent', function () {
  assert.strictEqual(levelOf(sample({ symptoms: ['palpitations'] })), 'urgent');
});
test('Rash alone is not urgent, rash with fever is', function () {
  assert.strictEqual(levelOf(sample({ symptoms: ['rash'] })), 'monitor');
  assert.strictEqual(levelOf(sample({ symptoms: ['rash', 'fever'] })), 'urgent');
});
test('Painful urination -> soon', function () {
  assert.strictEqual(levelOf(sample({ symptoms: ['urination'] })), 'soon');
});
test('Thunderclap headache sign and wording -> emergency', function () {
  assert.strictEqual(levelOf(sample({ symptoms: ['headache'], emergencySigns: ['thunderclap'], noneApply: false })), 'emergency');
  assert.strictEqual(levelOf(sample({ otherSymptoms: 'the worst headache of my life' })), 'emergency');
});
test('Follow-up answers are kept only for selected symptoms and valid options', function () {
  const input = R.normalizeInput(sample({
    symptoms: ['cough'],
    followUps: { 'cough-type': 'dry', 'fever-pattern': 'constant', 'cough-type-x': 'dry' }
  }));
  assert.deepStrictEqual(input.followUps, { 'cough-type': 'dry' });
  assert.deepStrictEqual(R.normalizeInput(sample({ symptoms: ['cough'], followUps: { 'cough-type': 'bogus' } })).followUps, {});
});
test('Follow-ups are recorded in the report but never change the level', function () {
  const input = sample({ symptoms: ['vomiting'], followUps: { 'vomit-count': '6plus' } });
  const safety = R.evaluateSafety(input);
  const report = R.buildLocalReport(input, safety);
  assert.strictEqual(safety.level, 'monitor');
  assert.ok(report.followUpDetails.some(function (d) { return d.value === '6 or more times'; }));
});
test('Background fields appear in the report and are length-checked', function () {
  const input = sample({ medicines: 'Metformin', allergies: 'Penicillin', conditions: 'Asthma' });
  const report = R.buildLocalReport(input, R.evaluateSafety(input));
  assert.strictEqual(report.background.medicines, 'Metformin');
  assert.ok(!report.missingInfo.some(function (m) { return /did not enter/.test(m); }));
  assert.ok(R.validateInput(sample({ medicines: 'x'.repeat(201) })).medicines);
  const empty = R.buildLocalReport(sample({}), R.evaluateSafety(sample({})));
  assert.ok(empty.missingInfo.some(function (m) { return /medicines, allergies and medical conditions/.test(m); }));
});
test('"Prepared for someone else" is stated in the summary', function () {
  const input = sample({ forWhom: 'other' });
  assert.ok(R.buildLocalReport(input, R.evaluateSafety(input)).summary.indexOf('on behalf of someone else') !== -1);
});
test('Medicine, allergy and condition text is never sent to the AI', function () {
  const payload = R.buildAiPayload(sample({ medicines: 'SECRET-MED', allergies: 'SECRET-ALLERGY', conditions: 'SECRET-COND' }));
  assert.ok(JSON.stringify(payload).indexOf('SECRET') === -1);
});

test('Rule catalog lists every rule that can fire (fuzz test, 4000 random inputs)', function () {
  const known = new Set(R.RULE_CATALOG.map(function (r) { return r.id; }));
  let seed = 12345;
  const rand = function () { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
  const pick = function (list) { return list[Math.floor(rand() * list.length)]; };
  const some = function (list, chance) { return list.filter(function () { return rand() < chance; }).map(function (x) { return x.id; }); };
  const phrases = ['', 'chest pain', "can't breathe", 'shortness of breath', 'wheezing', 'worst headache', 'kill myself', 'stiff neck', 'plain words'];
  const seen = new Set();
  for (let i = 0; i < 4000; i += 1) {
    const result = R.evaluateSafety({
      ageGroup: pick(['', 'under3m', '3m-12y', '13-17', '18-64', '65plus']),
      symptoms: some(R.SYMPTOMS, 0.15),
      otherSymptoms: pick(phrases), details: pick(phrases),
      duration: pick(R.DURATIONS).id, severity: pick(R.SEVERITIES).id, pain: pick(R.PAIN_LEVELS).id,
      worsening: pick(R.WORSENING).id,
      emergencySigns: some(R.EMERGENCY_SIGNS, 0.05), otherSigns: some(R.OTHER_SIGNS, 0.1),
      noneApply: rand() < 0.5, notSure: rand() < 0.1
    });
    result.triggered.forEach(function (t) {
      seen.add(t.id);
      assert.ok(known.has(t.id), 'rule missing from catalog: ' + t.id);
    });
  }
  assert.ok(seen.size >= 25, 'fuzz only reached ' + seen.size + ' rules');
});

test('Comparison reports higher/lower level, new symptoms and severity change', function () {
  const before = R.buildLocalReport(sample({}), R.evaluateSafety(sample({}))).snapshot;
  const worse = sample({ symptoms: ['sorethroat', 'cough', 'fever'], severity: 'severe' });
  const after = R.buildLocalReport(worse, R.evaluateSafety(worse)).snapshot;
  const notes = R.compareAssessments(before, after).join(' ');
  assert.ok(/higher than last time: Monitor to Urgent/.test(notes));
  assert.ok(/Severity changed from mild to severe/.test(notes));
  assert.ok(/New symptoms since last time: fever/.test(notes));
  assert.deepStrictEqual(R.compareAssessments(null, after), []);
  const lower = R.compareAssessments(after, before).join(' ');
  assert.ok(/lower than last time/.test(lower) && /never means you are safe/.test(lower));
});
test('Plain-text export contains guidance, symptoms, questions and the disclaimer', function () {
  const input = sample({ symptoms: ['fever'], temperatureValue: '38.2', medicines: 'Paracetamol' });
  const report = R.buildLocalReport(input, R.evaluateSafety(input));
  const text = R.reportToText(report);
  ['CARE GUIDANCE', 'Symptoms: Fever', '38.2', 'Medicines: Paracetamol', 'QUESTIONS TO DISCUSS', 'WHAT TO BRING', 'not a diagnosis', report.reference]
    .forEach(function (part) { assert.ok(text.indexOf(part) !== -1, 'missing: ' + part); });
});

// ---- Runner ----
let failed = 0;
tests.forEach(function (t) {
  try { t.fn(); console.log('PASS  ' + t.name); }
  catch (err) { failed += 1; console.log('FAIL  ' + t.name + '\n      ' + err.message); }
});
console.log('\n' + (tests.length - failed) + ' of ' + tests.length + ' tests passed.');
process.exit(failed ? 1 : 0);
