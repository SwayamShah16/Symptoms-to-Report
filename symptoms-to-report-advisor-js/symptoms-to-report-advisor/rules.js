/* ============================================================================
   rules.js - Symptoms to Report Advisor

   Everything that decides SAFETY lives in this one file. It has no DOM code,
   so it can be read top to bottom, tested in Node (tests/test-rules.js) and
   explained in a viva.

   IMPORTANT: this is a hand-written, rule-based checker. It is NOT machine
   learning and it is NOT a validated medical triage system.
   ============================================================================ */
(function (root) {
  'use strict';

  /* --------------------------------------------------------------------------
     1. OPTION LISTS
     One source of truth, used by the form AND the report so labels never drift.
     -------------------------------------------------------------------------- */

  const AGE_GROUPS = [
    { id: 'under3m', label: 'Under 3 months' },
    { id: '3m-12y', label: '3 months to 12 years' },
    { id: '13-17', label: '13 to 17 years' },
    { id: '18-64', label: '18 to 64 years' },
    { id: '65plus', label: '65 years or older' }
  ];

  // Symptoms are grouped by body area so the long list stays easy to scan.
  const SYMPTOM_GROUPS = [
    { id: 'general', label: 'General' },
    { id: 'head', label: 'Head, ears, nose and throat' },
    { id: 'chest', label: 'Chest and breathing' },
    { id: 'stomach', label: 'Stomach and digestion' },
    { id: 'body', label: 'Back and skin' },
    { id: 'urinary', label: 'Urinary' }
  ];

  const SYMPTOMS = [
    { id: 'fever', label: 'Fever', group: 'general' },
    { id: 'chills', label: 'Chills', group: 'general' },
    { id: 'fatigue', label: 'Fatigue', group: 'general' },
    { id: 'lossappetite', label: 'Loss of appetite', group: 'general' },
    { id: 'bodyaches', label: 'Body aches', group: 'general' },
    { id: 'jointpain', label: 'Joint pain', group: 'general' },
    { id: 'headache', label: 'Headache', group: 'head' },
    { id: 'sorethroat', label: 'Sore throat', group: 'head' },
    { id: 'runnynose', label: 'Runny or blocked nose', group: 'head' },
    { id: 'earpain', label: 'Ear pain', group: 'head' },
    { id: 'tasteloss', label: 'Loss of taste or smell', group: 'head' },
    { id: 'dizziness', label: 'Dizziness', group: 'head' },
    { id: 'cough', label: 'Cough', group: 'chest' },
    { id: 'breathless', label: 'Shortness of breath', group: 'chest' },
    { id: 'palpitations', label: 'Fast or irregular heartbeat', group: 'chest' },
    { id: 'nausea', label: 'Nausea', group: 'stomach' },
    { id: 'vomiting', label: 'Vomiting', group: 'stomach' },
    { id: 'diarrhea', label: 'Diarrhea', group: 'stomach' },
    { id: 'constipation', label: 'Constipation', group: 'stomach' },
    { id: 'abdominalpain', label: 'Abdominal pain', group: 'stomach' },
    { id: 'backpain', label: 'Back pain', group: 'body' },
    { id: 'rash', label: 'Skin rash', group: 'body' },
    { id: 'urination', label: 'Painful urination', group: 'urinary' }
  ];

  // Optional detail questions that appear only for the symptoms chosen.
  // They are recorded for the healthcare professional. They are NOT scored.
  const COUNT_OPTIONS = [
    { id: '1-2', label: '1 to 2 times' },
    { id: '3-5', label: '3 to 5 times' },
    { id: '6plus', label: '6 or more times' }
  ];
  const FOLLOW_UPS = [
    { symptom: 'fever', id: 'fever-pattern', label: 'Fever pattern', options: [{ id: 'constant', label: 'Constant' }, { id: 'comes', label: 'Comes and goes' }] },
    { symptom: 'cough', id: 'cough-type', label: 'Type of cough', options: [{ id: 'dry', label: 'Dry' }, { id: 'phlegm', label: 'With phlegm or mucus' }] },
    { symptom: 'headache', id: 'headache-location', label: 'Where is the headache?', options: [{ id: 'whole', label: 'Whole head' }, { id: 'one-side', label: 'One side' }, { id: 'front', label: 'Front or forehead' }, { id: 'back', label: 'Back of the head' }] },
    { symptom: 'headache', id: 'headache-onset', label: 'How did it start?', options: [{ id: 'gradual', label: 'Gradually' }, { id: 'sudden', label: 'Suddenly' }] },
    { symptom: 'sorethroat', id: 'throat-swallow', label: 'Swallowing', options: [{ id: 'ok', label: 'Painful, but I can swallow' }, { id: 'hard', label: 'Hard to swallow food or drink' }] },
    { symptom: 'vomiting', id: 'vomit-count', label: 'Times vomited in the last 24 hours', options: COUNT_OPTIONS },
    { symptom: 'diarrhea', id: 'diarrhea-count', label: 'Loose stools in the last 24 hours', options: COUNT_OPTIONS },
    { symptom: 'abdominalpain', id: 'abdomen-location', label: 'Where is the pain?', options: [{ id: 'upper', label: 'Upper abdomen' }, { id: 'lower', label: 'Lower abdomen' }, { id: 'left', label: 'Left side' }, { id: 'right', label: 'Right side' }, { id: 'all', label: 'All over' }] },
    { symptom: 'abdominalpain', id: 'abdomen-type', label: 'What does the pain feel like?', options: [{ id: 'sharp', label: 'Sharp' }, { id: 'dull', label: 'Dull ache' }, { id: 'cramping', label: 'Cramping' }] },
    { symptom: 'dizziness', id: 'dizzy-type', label: 'What does the dizziness feel like?', options: [{ id: 'spinning', label: 'Spinning' }, { id: 'lightheaded', label: 'Lightheaded' }, { id: 'unsteady', label: 'Unsteady on my feet' }] }
  ];

  const WHO_FOR = [
    { id: 'self', label: 'Myself' },
    { id: 'other', label: 'Someone else, such as my child or a relative' }
  ];

  // "rank" lets rules compare durations: higher = longer.
  const DURATIONS = [
    { id: 'lt24h', label: 'Less than 24 hours', rank: 0 },
    { id: '1-3d', label: '1 to 3 days', rank: 1 },
    { id: '4-7d', label: '4 to 7 days', rank: 2 },
    { id: '8-14d', label: '8 to 14 days', rank: 3 },
    { id: 'gt14d', label: 'More than 14 days', rank: 4 }
  ];

  const SEVERITIES = [
    { id: 'mild', label: 'Mild', hint: 'Noticeable, but I can do my usual activities.' },
    { id: 'moderate', label: 'Moderate', hint: 'It limits some of my usual activities.' },
    { id: 'severe', label: 'Severe', hint: 'I cannot do my usual activities, or it is hard to bear.' }
  ];

  const PAIN_LEVELS = [
    { id: 'none', label: 'No pain / not applicable' },
    { id: 'mild', label: 'Mild pain' },
    { id: 'moderate', label: 'Moderate pain' },
    { id: 'severe', label: 'Severe pain' }
  ];

  const WORSENING = [
    { id: 'yes', label: 'Yes, getting worse' },
    { id: 'no', label: 'No, staying the same or improving' },
    { id: 'unsure', label: 'Not sure' }
  ];

  // Emergency warning signs. These widely published "call emergency services"
  // signs come from public-health guidance (stroke, heart, breathing, allergy,
  // meningitis, seizure, bleeding, crisis). The list is deliberately short and
  // is NOT complete - see README "Limitations".
  const EMERGENCY_SIGNS = [
    { id: 'breathing', label: 'Severe difficulty breathing, or too breathless to speak', report: 'severe difficulty breathing' },
    { id: 'chestpain', label: 'Chest pain or pressure (especially spreading to the arm, jaw or back, or with sweating)', report: 'chest pain or pressure' },
    { id: 'unconscious', label: 'Fainted, unconscious, or cannot be woken', report: 'fainting, unconsciousness or being unable to wake' },
    { id: 'confusion', label: 'New confusion, or not making sense', report: 'new confusion' },
    { id: 'stroke', label: 'Sudden weakness or numbness (face, arm or leg), a drooping face, or sudden trouble speaking', report: 'sudden weakness, numbness, a drooping face or trouble speaking' },
    { id: 'seizure', label: 'A seizure (fit)', report: 'a seizure' },
    { id: 'allergy', label: 'Swelling of the face, lips, tongue or throat, or a severe allergic reaction', report: 'swelling of the face, lips, tongue or throat, or a severe allergic reaction' },
    { id: 'bleeding', label: 'Vomiting or coughing up blood, or heavy bleeding that will not stop', report: 'vomiting or coughing up blood, or heavy bleeding' },
    { id: 'meningitis', label: 'Stiff neck with fever and headache, or a rash that does not fade when pressed with a glass', report: 'stiff neck with fever and headache, or a rash that does not fade' },
    { id: 'thunderclap', label: 'A sudden, very severe headache unlike any you have had before', report: 'a sudden, very severe headache' },
    { id: 'selfharm', label: 'Thoughts of harming yourself', report: 'thoughts of harming yourself' }
  ];

  // Lower-tier signs: not shown as emergencies, but they raise the guidance level.
  const OTHER_SIGNS = [
    { id: 'fluids', label: 'Unable to keep any fluids down', level: 'urgent', report: 'being unable to keep fluids down' },
    { id: 'dehydration', label: 'Signs of dehydration (very dry mouth, very little urine, extreme thirst)', level: 'urgent', report: 'signs of dehydration' },
    { id: 'bloodstoolurine', label: 'Blood in stool or urine', level: 'urgent', report: 'blood in stool or urine' },
    { id: 'vulnerable', label: 'Pregnant, weakened immune system, or a serious long-term health condition', level: 'urgent', report: 'pregnancy, a weakened immune system or a serious long-term condition' }
  ];

  const LEVELS = {
    emergency: { rank: 3, label: 'Emergency', title: 'Get emergency help now' },
    urgent: { rank: 2, label: 'Urgent', title: 'Speak to a healthcare professional today' },
    soon: { rank: 1, label: 'Soon', title: 'Arrange an appointment in the next few days' },
    monitor: { rank: 0, label: 'Monitor', title: 'Keep monitoring and follow up if needed' }
  };

  /* --------------------------------------------------------------------------
     2. FREE-TEXT SCANNING
     People often type a warning sign in their own words. These patterns look
     for it. Limitation: simple phrase matching - it does not understand
     negation ("no chest pain" still matches), because we prefer a false alarm
     over a missed warning sign.
     The quote class [’'] accepts both straight and curly apostrophes.
     -------------------------------------------------------------------------- */

  const EMERGENCY_TEXT_PATTERNS = [
    { id: 'breathing', regex: /\b(?:can[’']?t|cannot|can not|unable to|struggling to|trouble|difficulty|hard to)\s+(?:\w+\s+)?breath(?:e|ing)\b/i },
    { id: 'chestpain', regex: /\bchest\s+(?:pain|pressure|tightness|discomfort)\b/i },
    { id: 'unconscious', regex: /\b(?:unconscious|passed out|blacked out|fainted|won[’']?t wake|can[’']?t (?:be )?(?:wake|woken))\b/i },
    { id: 'confusion', regex: /\b(?:confus(?:ed|ion)|disorient\w*)/i },
    { id: 'stroke', regex: /\b(?:slurred speech|slurring|can[’']?t speak|trouble speaking|face (?:is )?droop\w*|drooping face|weakness on one side|numb\w* on one side)/i },
    { id: 'seizure', regex: /\b(?:seizure|convulsion|convulsing)/i },
    { id: 'selfharm', regex: /\b(?:suicid\w*|kill myself|end my life|(?:harm|hurt) myself|self[- ]harm)/i },
    { id: 'bleeding', regex: /\b(?:(?:vomit\w*|cough\w*) (?:up )?blood|bleeding (?:heavily|that won[’']?t stop|won[’']?t stop))/i },
    { id: 'allergy', regex: /\b(?:(?:lips?|tongue|throat|face) (?:is |are )?swell\w*|swollen (?:lips?|tongue|throat|face)|swelling (?:of|in) (?:my |the )?(?:lips?|tongue|throat|face))/i },
    { id: 'meningitis', regex: /\bstiff neck/i },
    { id: 'thunderclap', regex: /\b(?:thunderclap|worst headache|sudden(?:ly)? (?:very |extremely )?severe headache)/i }
  ];

  const URGENT_TEXT_PATTERNS = [
    { id: 'breathless', regex: /\b(?:short(?:ness)? of breath|breathless\w*|wheez\w*)/i }
  ];

  function scanText(text, patterns) {
    const hits = [];
    const source = String(text || '');
    patterns.forEach(function (pattern) {
      const match = source.match(pattern.regex);
      if (match) hits.push({ id: pattern.id, match: match[0].trim() });
    });
    return hits;
  }

  /* --------------------------------------------------------------------------
     3. SMALL HELPERS
     -------------------------------------------------------------------------- */

  function labelOf(list, id) {
    const item = list.find(function (entry) { return entry.id === id; });
    return item ? item.label : '';
  }

  function labelsOf(list, ids) {
    return ids.map(function (id) { return labelOf(list, id); }).filter(Boolean);
  }

  function durationRank(id) {
    const item = DURATIONS.find(function (entry) { return entry.id === id; });
    return item ? item.rank : -1;
  }

  function joinList(items) {
    if (items.length <= 1) return items.join('');
    return items.slice(0, -1).join(', ') + ' and ' + items[items.length - 1];
  }

  function uniqueList(items) {
    const seen = new Set();
    return items.filter(function (item) {
      const key = item.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function lowerFirst(text) {
    return text.charAt(0).toLowerCase() + text.slice(1);
  }

  // Turns whatever the form gives us into a predictable shape.
  function normalizeInput(raw) {
    const r = raw || {};
    const asArray = function (value) { return Array.isArray(value) ? value.slice() : []; };
    return {
      ageGroup: r.ageGroup || '',
      symptoms: asArray(r.symptoms),
      otherSymptoms: String(r.otherSymptoms || '').trim(),
      duration: r.duration || '',
      severity: r.severity || '',
      temperatureValue: r.temperatureValue === undefined || r.temperatureValue === null ? '' : String(r.temperatureValue).trim(),
      temperatureUnit: r.temperatureUnit === 'F' ? 'F' : 'C',
      pain: r.pain || 'none',
      details: String(r.details || '').trim(),
      worsening: r.worsening || '',
      emergencySigns: asArray(r.emergencySigns),
      otherSigns: asArray(r.otherSigns),
      noneApply: Boolean(r.noneApply),
      notSure: Boolean(r.notSure),
      forWhom: r.forWhom || '',
      followUps: cleanFollowUps(r.followUps, asArray(r.symptoms)),
      medicines: String(r.medicines || '').trim(),
      allergies: String(r.allergies || '').trim(),
      conditions: String(r.conditions || '').trim()
    };
  }

  // Keeps only follow-up answers that are valid AND belong to a selected symptom.
  function cleanFollowUps(raw, selectedSymptoms) {
    const clean = {};
    if (!raw || typeof raw !== 'object') return clean;
    FOLLOW_UPS.forEach(function (question) {
      const answer = raw[question.id];
      if (selectedSymptoms.indexOf(question.symptom) === -1) return;
      if (question.options.some(function (o) { return o.id === answer; })) clean[question.id] = answer;
    });
    return clean;
  }

  function temperatureText(input) {
    return input.temperatureValue === '' ? '' : input.temperatureValue + ' \u00B0' + input.temperatureUnit;
  }

  /* --------------------------------------------------------------------------
     4. VALIDATION
     Returns an object of { fieldName: 'message' }. Empty object = valid.
     -------------------------------------------------------------------------- */

  function validateInput(raw) {
    const input = normalizeInput(raw);
    const errors = {};
    const MAX_TEXT = 300;

    if (input.ageGroup && !labelOf(AGE_GROUPS, input.ageGroup)) {
      errors.ageGroup = 'Choose an age group from the list, or leave it as "Prefer not to say".';
    }

    if (input.symptoms.length === 0 && input.otherSymptoms === '') {
      errors.symptoms = 'Choose at least one symptom, or describe it in your own words below.';
    }
    if (input.otherSymptoms.length > MAX_TEXT) {
      errors.otherSymptoms = 'Please keep this under ' + MAX_TEXT + ' characters.';
    }

    if (!labelOf(DURATIONS, input.duration)) errors.duration = 'Choose how long the symptoms have lasted.';
    if (!labelOf(SEVERITIES, input.severity)) errors.severity = 'Choose how severe the symptoms are.';
    if (!labelOf(WORSENING, input.worsening)) errors.worsening = 'Tell us whether the symptoms are getting worse.';

    if (input.temperatureValue !== '') {
      const value = Number(input.temperatureValue);
      const range = input.temperatureUnit === 'F' ? [86, 113] : [30, 45];
      if (!Number.isFinite(value) || value < range[0] || value > range[1]) {
        errors.temperature = 'Enter a temperature between ' + range[0] + ' and ' + range[1] +
          ' \u00B0' + input.temperatureUnit + ', or leave it empty.';
      }
    }
    if (input.details.length > MAX_TEXT) errors.details = 'Please keep this under ' + MAX_TEXT + ' characters.';

    if (input.forWhom && !labelOf(WHO_FOR, input.forWhom)) errors.forWhom = 'Choose who these symptoms are for, or leave it blank.';
    ['medicines', 'allergies', 'conditions'].forEach(function (key) {
      if (input[key].length > 200) errors[key] = 'Please keep this under 200 characters.';
    });

    // We never assume "no warning signs" - the person must answer.
    const answeredWarnings = input.noneApply || input.notSure || input.emergencySigns.length > 0;
    if (!answeredWarnings) {
      errors.warnings = 'Please answer the emergency check: tick any sign that applies, or choose "None of these apply".';
    } else if (input.noneApply && (input.emergencySigns.length > 0 || input.notSure)) {
      errors.warnings = '"None of these apply" cannot be combined with a warning sign or "Not sure". Please fix your answer.';
    }

    return errors;
  }

  /* --------------------------------------------------------------------------
     5. THE SAFETY CHECKER
     Runs BEFORE any report text or AI. Every triggered rule is recorded with
     an id and a plain-language reason, so the result is fully explainable.
     The highest level wins. Nothing here can be changed by AI output.
     -------------------------------------------------------------------------- */

  function evaluateSafety(raw) {
    const input = normalizeInput(raw);
    const triggered = [];
    const add = function (id, level, text, tag) {
      triggered.push({ id: id, level: level, text: text, tag: tag || '' });
    };
    const has = function (symptomId) { return input.symptoms.indexOf(symptomId) !== -1; };
    const rank = durationRank(input.duration);
    const freeText = input.otherSymptoms + ' ' + input.details;
    const anySymptom = input.symptoms.length > 0 || input.otherSymptoms !== '';

    // ---- Layer 1: EMERGENCY ----
    EMERGENCY_SIGNS.forEach(function (sign) {
      if (input.emergencySigns.indexOf(sign.id) !== -1) {
        add('E-' + sign.id, 'emergency', 'You reported ' + sign.report + '.', sign.id === 'selfharm' ? 'selfharm' : '');
      }
    });
    scanText(freeText, EMERGENCY_TEXT_PATTERNS).forEach(function (hit) {
      if (input.emergencySigns.indexOf(hit.id) !== -1) return; // already covered by a tick
      add('E-TEXT-' + hit.id, 'emergency',
        'Your own words mention "' + hit.match + '", which can be an emergency warning sign. If this is happening now, treat it as an emergency.',
        hit.id === 'selfharm' ? 'selfharm' : '');
    });

    // ---- Layer 2: URGENT (same-day advice) ----
    if (input.severity === 'severe') add('U-SEVERE', 'urgent', 'You rated your symptoms as severe.');
    if (input.worsening === 'yes' && input.severity === 'moderate') add('U-WORSENING-MODERATE', 'urgent', 'Your moderate symptoms are getting worse.');
    if (input.ageGroup === 'under3m' && anySymptom) {
      add('U-INFANT', 'urgent', 'Babies under 3 months can become unwell quickly, so any symptoms should be checked promptly by a healthcare professional.');
    }
    if (input.notSure) add('U-UNSURE', 'urgent', 'You were not sure about the emergency warning signs, so this tool cannot rule them out.');
    if (input.pain === 'severe') add('U-SEVERE-PAIN', 'urgent', 'You reported severe pain.');
    if (has('breathless')) add('U-BREATHLESS-SYMPTOM', 'urgent', 'You reported shortness of breath.');
    if (has('palpitations')) add('U-PALPITATIONS', 'urgent', 'You reported a fast or irregular heartbeat.');
    if (has('rash') && has('fever')) add('U-RASH-FEVER', 'urgent', 'A rash together with a fever should be checked promptly.');
    OTHER_SIGNS.forEach(function (sign) {
      if (input.otherSigns.indexOf(sign.id) !== -1) add('U-' + sign.id, sign.level, 'You reported ' + sign.report + '.');
    });
    scanText(freeText, URGENT_TEXT_PATTERNS).forEach(function (hit) {
      add('U-TEXT-' + hit.id, 'urgent', 'Your own words mention "' + hit.match + '", which should be checked promptly.');
    });

    // ---- Layer 3: SOON (appointment in the next few days) ----
    // Duration cut-offs below are common general-practice conventions, not
    // validated clinical thresholds (see README "Limitations").
    if (input.worsening === 'yes' && input.severity === 'mild') add('S-WORSENING-MILD', 'soon', 'Your symptoms are getting worse.');
    if (has('fever') && rank >= 2) add('S-FEVER-DURATION', 'soon', 'Fever has lasted more than 3 days.');
    if (rank >= 3) add('S-LONG-DURATION', 'soon', 'Symptoms have lasted more than a week.');
    if ((has('vomiting') || has('diarrhea')) && has('dizziness')) {
      add('S-FLUID-LOSS', 'soon', 'Vomiting or diarrhea together with dizziness can be a sign of fluid loss.');
    }
    if (has('urination')) add('S-URINARY', 'soon', 'Painful urination is worth having checked.');
    if (input.severity === 'moderate' && (input.ageGroup === '65plus' || input.ageGroup === '3m-12y')) {
      add('S-AGE-MODERATE', 'soon', 'Moderate symptoms in young children and older adults are worth checking sooner.');
    }

    // ---- Default: MONITOR ----
    if (triggered.length === 0) {
      add('M-DEFAULT', 'monitor', 'None of the rules for urgent or emergency care were triggered by what you entered. This does not rule out a problem.');
    }

    // Highest level wins; strongest reasons are listed first.
    triggered.sort(function (a, b) { return LEVELS[b.level].rank - LEVELS[a.level].rank; });
    const level = triggered[0].level;
    triggered.forEach(Object.freeze);
    return Object.freeze({ level: level, triggered: Object.freeze(triggered) });
  }

  /* --------------------------------------------------------------------------
     6. LOCAL REPORT BUILDER (works with no internet and no AI)
     Only restates what the person entered. Never invents symptoms, history,
     vital signs, test results or diagnoses.
     -------------------------------------------------------------------------- */

  const SYMPTOM_QUESTIONS = {
    fever: 'How should I monitor my temperature, and what reading or pattern should make me contact you?',
    headache: 'Is there a pattern or trigger to my headaches that I should keep track of?',
    cough: 'Does my cough need a chest examination or any tests?',
    sorethroat: 'Does my sore throat need to be examined or tested?',
    fatigue: 'Could my tiredness have a cause that needs checking?',
    nausea: 'How can I keep fluids down, and which signs of dehydration should I watch for?',
    vomiting: 'How can I keep fluids down, and which signs of dehydration should I watch for?',
    diarrhea: 'How can I keep fluids down, and which signs of dehydration should I watch for?',
    abdominalpain: 'Do the location and type of my abdominal pain matter, and does it need to be examined?',
    dizziness: 'Is it safe for me to drive or be on my own when I feel dizzy, and does it need checking?',
    bodyaches: 'Are my body aches linked to my other symptoms, and what can I safely do about them?',
    chills: 'Are my chills linked to a fever or another cause that needs checking?',
    lossappetite: 'Could my loss of appetite be linked to my other symptoms or to any medicines?',
    jointpain: 'Do my joint pains need to be examined, and are they linked to my other symptoms?',
    runnynose: 'Could allergies or an infection be behind my nose symptoms, and how can I tell?',
    earpain: 'Does my ear pain need to be examined?',
    tasteloss: 'Does my loss of taste or smell need testing or follow-up?',
    breathless: 'What could be causing my shortness of breath, and do I need tests?',
    palpitations: 'Does my heartbeat need to be checked with tests such as an ECG?',
    constipation: 'How long without a bowel movement is too long, and when should I be checked?',
    backpain: 'Does my back pain need to be examined, and which movements should I avoid?',
    rash: 'Does my rash need to be examined, and could it be linked to a medicine, food or something I touched?',
    urination: 'Does my painful urination need a urine test?'
  };

  const GENERAL_QUESTIONS = [
    'What could be causing these symptoms, and what else should be ruled out?',
    'Which warning signs should make me seek care sooner?',
    'Do I need any tests or an examination?',
    'Could my current medicines or health conditions be relevant?',
    'When should I expect to feel better, and when should I follow up with you?'
  ];

  const EMERGENCY_NUMBERS = 'for example 112 in India, 911 in the US, 999 in the UK';

  const DISCLAIMER = 'This report was organised from the information you typed in. It is not a diagnosis, it does not replace a healthcare professional, and it cannot guarantee that you are safe. It comes from a student demonstration project, not a validated medical triage system.';

  function buildSummary(input) {
    const parts = [];
    const symptomLabels = labelsOf(SYMPTOMS, input.symptoms).map(lowerFirst);
    if (input.forWhom === 'other') parts.push('These answers were given on behalf of someone else.');

    if (symptomLabels.length && input.otherSymptoms) {
      parts.push('You reported ' + joinList(symptomLabels) + '. You also described: "' + input.otherSymptoms + '".');
    } else if (symptomLabels.length) {
      parts.push('You reported ' + joinList(symptomLabels) + '.');
    } else if (input.otherSymptoms) {
      parts.push('You described your symptoms as: "' + input.otherSymptoms + '".');
    }

    parts.push('They have been present for ' + lowerFirst(labelOf(DURATIONS, input.duration)) +
      ', and you rated them as ' + input.severity + ' overall.');

    if (input.worsening === 'yes') parts.push('You said they are getting worse.');
    else if (input.worsening === 'no') parts.push('You said they are staying the same or improving.');
    else parts.push('You were not sure whether they are getting worse.');

    if (temperatureText(input)) parts.push('The temperature you recorded was ' + temperatureText(input) + '.');
    if (input.pain !== 'none') parts.push('You described your pain as ' + input.pain + '.');
    if (input.details) parts.push('Other details you gave: "' + input.details + '".');

    if (input.noneApply) {
      parts.push('You said that none of the listed emergency warning signs apply.');
    } else if (input.emergencySigns.length) {
      parts.push('You reported these emergency warning signs: ' +
        joinList(input.emergencySigns.map(function (id) {
          const sign = EMERGENCY_SIGNS.find(function (s) { return s.id === id; });
          return sign ? sign.report : id;
        })) + '.');
      if (input.notSure) parts.push('You were also unsure about other warning signs.');
    } else if (input.notSure) {
      parts.push('You were not sure whether any emergency warning signs apply.');
    }

    if (input.otherSigns.length) {
      parts.push('You also reported ' + joinList(input.otherSigns.map(function (id) {
        const sign = OTHER_SIGNS.find(function (s) { return s.id === id; });
        return sign ? sign.report : id;
      })) + '.');
    }
    return parts.join(' ');
  }

  function buildQuestions(input) {
    const list = [];
    input.symptoms.forEach(function (id) { if (SYMPTOM_QUESTIONS[id]) list.push(SYMPTOM_QUESTIONS[id]); });
    GENERAL_QUESTIONS.forEach(function (q) { list.push(q); });
    return uniqueList(list);
  }

  // "Missing information" = things this form did not capture that may be worth
  // noting before a visit. These are prompts, not assumptions about the person.
  function buildMissingInfo(input) {
    const list = [];
    if (!input.ageGroup) list.push('You did not give an age group. Age can change how quickly a symptom should be checked, so mention it to your healthcare professional.');
    if (input.symptoms.indexOf('fever') !== -1 && input.temperatureValue === '') {
      list.push('You listed a fever but did not record a temperature. If you can, measure it and note the reading and the time.');
    }
    if (input.worsening === 'unsure') list.push('You were unsure whether your symptoms are getting worse. Noting how they have changed since they started can help.');
    const notGiven = [];
    if (!input.medicines) notGiven.push('medicines');
    if (!input.allergies) notGiven.push('allergies');
    if (!input.conditions) notGiven.push('medical conditions');
    if (notGiven.length) list.push('You did not enter ' + joinList(notGiven) + '. Bring this information to your appointment.');
    return list;
  }

  function buildGuidance(level, triggered) {
    const selfHarm = triggered.some(function (t) { return t.tag === 'selfharm'; });
    let steps;
    if (level === 'emergency') {
      steps = [
        'Call your local emergency number now (' + EMERGENCY_NUMBERS + ') or go to the nearest emergency department.',
        'If you can, do not be alone, and avoid driving yourself.',
        'Do not wait to finish this form, or for a report, before getting help.'
      ];
    } else if (level === 'urgent') {
      steps = [
        'Contact a healthcare professional today: your doctor or clinic, a nurse advice line, or an urgent care service.',
        'Do not wait to see whether the symptoms settle on their own.',
        'If an emergency warning sign appears or you quickly get worse, call your local emergency number (' + EMERGENCY_NUMBERS + ').'
      ];
    } else if (level === 'soon') {
      steps = [
        'Arrange to see a healthcare professional in the next few days, or sooner if you feel worse.',
        'Take this report and a list of any medicines you use.',
        'If an emergency warning sign appears, call your local emergency number (' + EMERGENCY_NUMBERS + ').'
      ];
    } else {
      steps = [
        'Based only on what you entered, no rule suggested urgent care. That does not rule out a problem.',
        'Keep watching your symptoms. Speak to a healthcare professional if they do not improve, change, or you are worried.',
        'If an emergency warning sign appears, call your local emergency number (' + EMERGENCY_NUMBERS + ').'
      ];
    }
    return { level: level, title: LEVELS[level].title, steps: steps, selfHarm: selfHarm };
  }

  function buildLocalReport(raw, safety, when) {
    const input = normalizeInput(raw);
    const date = when instanceof Date ? when : new Date();

    let warningStatement;
    if (input.noneApply) warningStatement = 'You said none of the emergency warning signs apply.';
    else if (input.emergencySigns.length === 0 && input.notSure) warningStatement = 'You were not sure about the emergency warning signs. They cannot be ruled out.';
    else warningStatement = 'Emergency warning signs reported:';

    const dateTime = date.toLocaleString(undefined, { dateStyle: 'long', timeStyle: 'short' });
    const symptomLabels = labelsOf(SYMPTOMS, input.symptoms);

    return {
      generatedBy: 'rules',
      notice: '',
      reference: 'SRA-' + date.getTime().toString(36).toUpperCase(),
      dateTime: dateTime,
      preparedFor: labelOf(WHO_FOR, input.forWhom) || 'Not stated',
      followUpDetails: FOLLOW_UPS.filter(function (q) { return input.followUps[q.id]; }).map(function (q) {
        return { label: q.label, value: labelOf(q.options, input.followUps[q.id]), symptom: labelOf(SYMPTOMS, q.symptom) };
      }),
      background: {
        medicines: input.medicines || 'Not provided',
        allergies: input.allergies || 'Not provided',
        conditions: input.conditions || 'Not provided'
      },
      checklist: [
        'This report, printed or on your phone',
        'Your medicines, or a photo of their labels',
        'Details of any allergies and past medical conditions',
        'Recent test results or earlier medical reports, if you have them',
        'A pen to note down the answers'
      ],
      snapshot: {
        level: safety.level,
        severity: labelOf(SEVERITIES, input.severity),
        duration: labelOf(DURATIONS, input.duration),
        worsening: labelOf(WORSENING, input.worsening),
        symptoms: symptomLabels,
        time: dateTime
      },
      comparison: [],
      ageGroup: labelOf(AGE_GROUPS, input.ageGroup) || 'Not provided',
      symptoms: symptomLabels,
      otherSymptoms: input.otherSymptoms,
      duration: labelOf(DURATIONS, input.duration),
      severity: labelOf(SEVERITIES, input.severity),
      temperature: temperatureText(input),
      pain: labelOf(PAIN_LEVELS, input.pain),
      worsening: labelOf(WORSENING, input.worsening),
      details: input.details,
      warningStatement: warningStatement,
      emergencySigns: input.emergencySigns.map(function (id) {
        const sign = EMERGENCY_SIGNS.find(function (s) { return s.id === id; });
        return sign ? sign.report : id;
      }),
      otherSigns: input.otherSigns.map(function (id) {
        const sign = OTHER_SIGNS.find(function (s) { return s.id === id; });
        return sign ? sign.report : id;
      }),
      summary: buildSummary(input),
      questions: buildQuestions(input),
      missingInfo: buildMissingInfo(input),
      guidance: buildGuidance(safety.level, safety.triggered),
      reasons: safety.triggered.map(function (t) { return { id: t.id, level: t.level, text: t.text }; }),
      disclaimer: DISCLAIMER
    };
  }

  /* --------------------------------------------------------------------------
     7. OPTIONAL AI SUPPORT (pure helpers; no network code here)
     -------------------------------------------------------------------------- */

  // Only labels the model needs. No name, address, IP or free identifiers.
  function buildAiPayload(raw) {
    const input = normalizeInput(raw);
    const warnings = [];
    if (input.noneApply) warnings.push('None of the listed emergency warning signs apply');
    if (input.notSure) warnings.push('Not sure about the emergency warning signs');
    input.emergencySigns.forEach(function (id) {
      const sign = EMERGENCY_SIGNS.find(function (s) { return s.id === id; });
      if (sign) warnings.push(sign.report);
    });
    input.otherSigns.forEach(function (id) {
      const sign = OTHER_SIGNS.find(function (s) { return s.id === id; });
      if (sign) warnings.push(sign.report);
    });
    return {
      ageGroup: labelOf(AGE_GROUPS, input.ageGroup) || 'Not provided',
      symptoms: labelsOf(SYMPTOMS, input.symptoms),
      symptomDetails: FOLLOW_UPS.filter(function (q) { return input.followUps[q.id]; }).map(function (q) {
        return q.label + ': ' + labelOf(q.options, input.followUps[q.id]);
      }),
      otherSymptoms: input.otherSymptoms,
      duration: labelOf(DURATIONS, input.duration),
      severity: labelOf(SEVERITIES, input.severity),
      temperature: temperatureText(input),
      pain: labelOf(PAIN_LEVELS, input.pain),
      worsening: labelOf(WORSENING, input.worsening),
      warningSigns: warnings,
      details: input.details
    };
  }

  // Words and claims we refuse to show from an AI response. If any appear, the
  // app discards the AI text and uses the local template instead.
  const AI_BANNED = /(\b\d+(?:\.\d+)?\s?(?:mg|mcg|ml|g|tablets?|pills?|capsules?)\b|prescri|dosage|\bdose\b|\byou (?:probably|likely|definitely|may|might|could) have\b|nothing to worry|not serious|harmless|no need to|safe to ignore|will go away|\bjust a\b)/i;

  function validateAiExtras(data) {
    if (!data || typeof data !== 'object') return null;
    const isText = function (value, max) { return typeof value === 'string' && value.trim() !== '' && value.length <= max; };
    const cleanList = function (list, maxItems, maxLen) {
      if (!Array.isArray(list)) return null;
      const out = list.filter(function (item) { return isText(item, maxLen); }).map(function (item) { return item.trim(); });
      return out.length === list.length && out.length <= maxItems ? out : null;
    };

    if (!isText(data.summary, 900)) return null;
    const questions = cleanList(data.questions, 8, 220);
    const missingInfo = cleanList(data.missingInfo, 6, 220);
    if (!questions || !missingInfo) return null;

    const everything = [data.summary].concat(questions, missingInfo).join(' ');
    if (AI_BANNED.test(everything)) return null;

    return { summary: data.summary.trim(), questions: questions, missingInfo: missingInfo };
  }

  /* --------------------------------------------------------------------------
     8. RULE CATALOG (shown on the Safety guide page) + HELPERS
     Built from the same lists the rules use, so the page cannot drift from
     the logic. tests/test-rules.js checks that every rule that can fire is
     listed here.
     -------------------------------------------------------------------------- */

  function buildRuleCatalog() {
    const rules = [];
    EMERGENCY_SIGNS.forEach(function (sign) {
      rules.push({ id: 'E-' + sign.id, level: 'emergency', when: 'You tick: ' + sign.label + '.' });
    });
    EMERGENCY_TEXT_PATTERNS.forEach(function (pattern) {
      const sign = EMERGENCY_SIGNS.find(function (s) { return s.id === pattern.id; });
      rules.push({ id: 'E-TEXT-' + pattern.id, level: 'emergency', when: 'Your own words match a phrase about ' + (sign ? sign.report : pattern.id) + '.' });
    });
    rules.push({ id: 'U-SEVERE', level: 'urgent', when: 'You rate your symptoms as severe.' });
    rules.push({ id: 'U-WORSENING-MODERATE', level: 'urgent', when: 'Moderate symptoms that are getting worse.' });
    rules.push({ id: 'U-INFANT', level: 'urgent', when: 'Any symptoms in a baby under 3 months.' });
    rules.push({ id: 'U-UNSURE', level: 'urgent', when: 'You are not sure about the emergency warning signs.' });
    rules.push({ id: 'U-SEVERE-PAIN', level: 'urgent', when: 'You report severe pain.' });
    rules.push({ id: 'U-BREATHLESS-SYMPTOM', level: 'urgent', when: 'You select shortness of breath.' });
    rules.push({ id: 'U-PALPITATIONS', level: 'urgent', when: 'You select a fast or irregular heartbeat.' });
    rules.push({ id: 'U-RASH-FEVER', level: 'urgent', when: 'A skin rash together with a fever.' });
    OTHER_SIGNS.forEach(function (sign) {
      rules.push({ id: 'U-' + sign.id, level: sign.level, when: 'You tick: ' + sign.label + '.' });
    });
    URGENT_TEXT_PATTERNS.forEach(function (pattern) {
      rules.push({ id: 'U-TEXT-' + pattern.id, level: 'urgent', when: 'Your own words mention being short of breath or wheezing.' });
    });
    rules.push({ id: 'S-WORSENING-MILD', level: 'soon', when: 'Mild symptoms that are getting worse.' });
    rules.push({ id: 'S-FEVER-DURATION', level: 'soon', when: 'Fever for more than 3 days.' });
    rules.push({ id: 'S-LONG-DURATION', level: 'soon', when: 'Any symptoms for more than a week.' });
    rules.push({ id: 'S-FLUID-LOSS', level: 'soon', when: 'Vomiting or diarrhea together with dizziness.' });
    rules.push({ id: 'S-URINARY', level: 'soon', when: 'Painful urination.' });
    rules.push({ id: 'S-AGE-MODERATE', level: 'soon', when: 'Moderate symptoms in a child aged 12 or under, or an adult aged 65 or over.' });
    rules.push({ id: 'M-DEFAULT', level: 'monitor', when: 'None of the rules above were triggered. This never rules out a problem.' });
    return rules;
  }
  const RULE_CATALOG = buildRuleCatalog();

  // Returns the ids of emergency phrases found in text (used by Smart Fill).
  function scanEmergencyText(text) {
    return scanText(text, EMERGENCY_TEXT_PATTERNS).map(function (hit) { return hit.id; });
  }

  // Compares this assessment with the previous one from the same browser session.
  function compareAssessments(previous, current) {
    if (!previous) return [];
    const notes = [];
    const before = LEVELS[previous.level];
    const after = LEVELS[current.level];
    if (after.rank > before.rank) notes.push('The guidance level is higher than last time: ' + before.label + ' to ' + after.label + '.');
    else if (after.rank < before.rank) notes.push('The guidance level is lower than last time: ' + before.label + ' to ' + after.label + '. The rules only score what you entered. A lower level never means you are safe.');
    else notes.push('The guidance level is unchanged: ' + after.label + '.');
    if (previous.severity !== current.severity) notes.push('Severity changed from ' + previous.severity.toLowerCase() + ' to ' + current.severity.toLowerCase() + '.');
    if (previous.worsening !== current.worsening) notes.push('"Getting worse" changed from "' + previous.worsening + '" to "' + current.worsening + '".');
    const added = current.symptoms.filter(function (x) { return previous.symptoms.indexOf(x) === -1; });
    const removed = previous.symptoms.filter(function (x) { return current.symptoms.indexOf(x) === -1; });
    if (added.length) notes.push('New symptoms since last time: ' + joinList(added.map(lowerFirst)) + '.');
    if (removed.length) notes.push('No longer reported: ' + joinList(removed.map(lowerFirst)) + '.');
    notes.push('The earlier assessment was made on ' + previous.time + ' (kept only in this browser tab, never saved).');
    return notes;
  }

  // Plain-text version of the report, for Copy and Download.
  function reportToText(report) {
    const lines = [];
    const add = function (line) { lines.push(line === undefined ? '' : line); };
    const bullets = function (items) { items.forEach(function (item) { add('  - ' + item); }); };

    add('SYMPTOMS REPORT  (reference ' + report.reference + ')');
    add('Prepared with Symptoms to Report Advisor, a student demonstration project.');
    add('');
    add('CARE GUIDANCE: ' + LEVELS[report.guidance.level].label.toUpperCase() + ' - ' + report.guidance.title);
    bullets(report.guidance.steps);
    add('');
    add('Date and time: ' + report.dateTime);
    add('Prepared for: ' + report.preparedFor);
    add('Age group: ' + report.ageGroup);
    add('Symptoms: ' + (report.symptoms.length ? report.symptoms.join(', ') : 'None selected'));
    if (report.otherSymptoms) add('In own words: "' + report.otherSymptoms + '"');
    report.followUpDetails.forEach(function (d) { add('  ' + d.symptom + ' - ' + d.label + ': ' + d.value); });
    add('Duration: ' + report.duration);
    add('Severity: ' + report.severity);
    add('Getting worse: ' + report.worsening);
    add('Temperature: ' + (report.temperature || 'Not recorded'));
    add('Pain: ' + report.pain);
    if (report.details) add('Other details: "' + report.details + '"');
    add(report.emergencySigns.length ? 'Emergency warning signs reported: ' + report.emergencySigns.join('; ') : report.warningStatement);
    if (report.otherSigns.length) add('Other signs reported: ' + report.otherSigns.join('; '));
    add('Medicines: ' + report.background.medicines);
    add('Allergies: ' + report.background.allergies);
    add('Medical conditions: ' + report.background.conditions);
    add('');
    add('SUMMARY');
    add(report.summary);
    if (report.comparison.length) { add(''); add('CHANGES SINCE THE PREVIOUS ASSESSMENT IN THIS SESSION'); bullets(report.comparison); }
    add('');
    add('QUESTIONS TO DISCUSS');
    report.questions.forEach(function (q, i) { add('  ' + (i + 1) + '. ' + q); });
    add('');
    add('WORTH GATHERING BEFORE YOUR VISIT');
    bullets(report.missingInfo);
    add('');
    add('WHAT TO BRING');
    bullets(report.checklist);
    add('');
    add('HOW THIS GUIDANCE WAS DECIDED');
    bullets(report.reasons.map(function (r) { return r.id + ' (' + LEVELS[r.level].label + '): ' + r.text; }));
    add('');
    add(report.disclaimer);
    return lines.join('\n');
  }

  /* --------------------------------------------------------------------------
     9. EXPORTS (browser global + Node for tests)
     -------------------------------------------------------------------------- */

  const api = {
    SYMPTOM_GROUPS: SYMPTOM_GROUPS, FOLLOW_UPS: FOLLOW_UPS, WHO_FOR: WHO_FOR, RULE_CATALOG: RULE_CATALOG,
    scanEmergencyText: scanEmergencyText, compareAssessments: compareAssessments, reportToText: reportToText,
    AGE_GROUPS: AGE_GROUPS, SYMPTOMS: SYMPTOMS, DURATIONS: DURATIONS, SEVERITIES: SEVERITIES,
    PAIN_LEVELS: PAIN_LEVELS, WORSENING: WORSENING, EMERGENCY_SIGNS: EMERGENCY_SIGNS,
    OTHER_SIGNS: OTHER_SIGNS, LEVELS: LEVELS, EMERGENCY_NUMBERS: EMERGENCY_NUMBERS,
    normalizeInput: normalizeInput, validateInput: validateInput, evaluateSafety: evaluateSafety,
    buildLocalReport: buildLocalReport, buildAiPayload: buildAiPayload, validateAiExtras: validateAiExtras,
    uniqueList: uniqueList
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.SymptomRules = api;
})(this);
