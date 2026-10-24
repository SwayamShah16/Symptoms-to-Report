/* Run with:  node tests/test-assistant.js
   Checks Smart Fill (assistant.js) on sample sentences. */
'use strict';
const assert = require('assert');
const A = require('../assistant.js');

const tests = [];
function test(name, fn) { tests.push({ name: name, fn: fn }); }
const parse = A.parseNarrative;

test('Reads symptoms, duration, worsening and temperature', function () {
  const r = parse('I have had a fever of 38.6 C and a dry cough for 5 days. I feel very tired. It is getting worse.');
  ['fever', 'cough', 'fatigue'].forEach(function (id) { assert.ok(r.symptoms.indexOf(id) !== -1, id); });
  assert.strictEqual(r.duration, '4-7d');
  assert.strictEqual(r.worsening, 'yes');
  assert.deepStrictEqual(r.temperature, { value: '38.6', unit: 'C' });
  assert.strictEqual(r.forWhom, 'self');
});
test('Negated symptoms are not ticked ("no fever")', function () {
  const r = parse('Sore throat and runny nose since yesterday, mild, no fever.');
  assert.ok(r.symptoms.indexOf('fever') === -1);
  assert.ok(r.symptoms.indexOf('sorethroat') !== -1 && r.symptoms.indexOf('runnynose') !== -1);
  assert.strictEqual(r.duration, '1-3d');
  assert.strictEqual(r.severity, 'mild');
});
test('"not getting worse" is read as NOT worsening', function () {
  assert.strictEqual(parse('vomiting, not getting worse').worsening, 'no');
  assert.strictEqual(parse('vomiting, getting worse').worsening, 'yes');
});
test('Child age and "someone else" are detected', function () {
  const r = parse('My 2 year old daughter has loose motions since last night');
  assert.strictEqual(r.ageGroup, '3m-12y');
  assert.strictEqual(r.forWhom, 'other');
  assert.ok(r.symptoms.indexOf('diarrhea') !== -1);
  assert.strictEqual(r.duration, 'lt24h');
});
test('Baby under 3 months is detected from weeks or months', function () {
  assert.strictEqual(parse('my 6 week old baby has a fever').ageGroup, 'under3m');
  assert.strictEqual(parse('my 2 month old has a fever').ageGroup, 'under3m');
  assert.strictEqual(parse('my 8 month old has a fever').ageGroup, '3m-12y');
});
test('"3 month old" is an age, not a duration', function () {
  assert.strictEqual(parse('my 3 month old baby has a cough').duration, '');
});
test('Adult age groups', function () {
  assert.strictEqual(parse('I am 70 years old with a cough').ageGroup, '65plus');
  assert.strictEqual(parse('I am 30 years old with a cough').ageGroup, '18-64');
});
test('Emergency wording is ticked, "none of these apply" never is', function () {
  const r = parse("chest pain and I can't breathe");
  assert.ok(r.emergencySigns.indexOf('chestpain') !== -1 && r.emergencySigns.indexOf('breathing') !== -1);
  assert.strictEqual(r.noneApply, undefined);
});
test('Vague duration is left blank with a note, not guessed', function () {
  const r = parse('dizzy for a few days');
  assert.strictEqual(r.duration, '');
  assert.ok(r.unclear.some(function (m) { return /few days/.test(m); }));
});
test('"more than a week" goes to the longer bucket (cautious)', function () {
  assert.strictEqual(parse('headache for more than a week').duration, '8-14d');
  assert.strictEqual(parse('headache for a week').duration, '4-7d');
});
test('Severity: the more severe word wins', function () {
  assert.strictEqual(parse('a mild headache but severe nausea').severity, 'severe');
});
test('A duration number is never mistaken for a temperature', function () {
  assert.strictEqual(parse('fever for 10 days').temperature, null);
  assert.deepStrictEqual(parse('temperature 101 F').temperature, { value: '101', unit: 'F' });
});
test('Other signs: cannot keep fluids down, pregnancy', function () {
  const r = parse("I'm pregnant and can't keep fluids down");
  assert.ok(r.otherSigns.indexOf('fluids') !== -1 && r.otherSigns.indexOf('vulnerable') !== -1);
});
test('Unrecognised text gives a helpful message', function () {
  const r = parse('blah blah');
  assert.strictEqual(r.symptoms.length, 0);
  assert.ok(r.unclear.length === 1);
  assert.strictEqual(parse('').items.length, 0);
});
test('All built-in examples are understood', function () {
  A.EXAMPLES.forEach(function (text) { assert.ok(parse(text).symptoms.length > 0, text); });
});

let failed = 0;
tests.forEach(function (t) {
  try { t.fn(); console.log('PASS  ' + t.name); }
  catch (err) { failed += 1; console.log('FAIL  ' + t.name + '\n      ' + err.message); }
});
console.log('\n' + (tests.length - failed) + ' of ' + tests.length + ' tests passed.');
process.exit(failed ? 1 : 0);
