/* ============================================================================
   assistant.js - "Smart Fill" for Symptoms to Report Advisor

   Reads a sentence or two typed in plain English ("fever for 3 days, getting
   worse") and works out which form answers it can fill in. It runs entirely in
   the browser, is free, needs no key or internet, and sends nothing anywhere.

   HONEST LABEL: this is hand-written language rules (keyword and pattern
   matching). It is NOT a trained AI model and it can misread. The person must
   review every answer. Smart Fill never answers the emergency question
   "None of these apply" for them - it can only tick warning signs it finds.
   ============================================================================ */
(function (root) {
  'use strict';

  const R = (typeof module !== 'undefined' && module.exports) ? require('./rules.js') : root.SymptomRules;

  /* ---------- Symptom vocabulary (everyday words, including Indian English) ---------- */

  const SYMPTOM_WORDS = {
    fever: /\b(?:fever|feverish|high temperature|burning up|running a temperature|temperature of)\b/g,
    chills: /\b(?:chills?|shivering|shivers|shaking with cold)\b/g,
    fatigue: /\b(?:tired|tiredness|fatigue|fatigued|exhausted|exhaustion|drained|low energy|no energy|lethargic|worn out)\b/g,
    lossappetite: /\b(?:(?:no|loss of|lost my|lost|poor|low) appetite|not hungry|don[’']?t feel like eating|off my food|not eating)\b/g,
    bodyaches: /\b(?:body ?aches?|body pain|aching (?:all over|body)|muscle (?:aches?|pains?)|myalgia|sore muscles)\b/g,
    jointpain: /\b(?:joint pains?|joints? (?:hurt|ache|are sore)|achy joints|knee pain|aching joints)\b/g,
    headache: /\b(?:headaches?|head (?:hurts|aches?|pain)|pain in (?:my )?head|migraine)\b/g,
    sorethroat: /\b(?:sore throat|throat (?:pain|hurts|is sore|is scratchy)|scratchy throat|painful throat)\b/g,
    runnynose: /\b(?:runny nose|blocked nose|stuffy nose|stuffed up|nasal congestion|congested|sniffles|sneezing)\b/g,
    earpain: /\b(?:ear ?ache|ear pain|pain in (?:my |the )?ear|ear hurts)\b/g,
    tasteloss: /\b(?:(?:lost|loss of|no|can[’']?t)(?: my)? (?:sense of )?(?:taste|smell)|can[’']?t taste|can[’']?t smell)\b/g,
    dizziness: /\b(?:dizzy|dizziness|light-?headed|giddy|vertigo|room (?:is )?spinning)\b/g,
    cough: /\b(?:cough|coughing|coughs)\b/g,
    breathless: /\b(?:short(?:ness)? of breath|breathless|out of breath|wheezing|wheeze)\b/g,
    palpitations: /\b(?:palpitations?|racing heart|heart (?:is )?(?:racing|pounding|fluttering|skipping)|irregular heart ?beat|fast heart ?beat|heart beating fast)\b/g,
    nausea: /\b(?:nausea|nauseous|nauseated|queasy|feel(?:ing)? sick|sick to my stomach)\b/g,
    vomiting: /\b(?:vomit(?:ing|ed|s)?|throwing up|threw up|puking|puked)\b/g,
    diarrhea: /\b(?:diarrh?o?ea|loose (?:stools?|motions?)|runny stools?|watery stools?)\b/g,
    constipation: /\b(?:constipat\w*|hard stools?|can[’']?t (?:pass stool|poop|go to the toilet))\b/g,
    abdominalpain: /\b(?:(?:stomach|abdominal|tummy|belly) (?:pain|ache|cramps?|hurts)|stomach ?ache|tummy ?ache|belly ?ache|cramps)\b/g,
    backpain: /\b(?:back ?pain|back ?ache|back hurts|pain in (?:my )?back)\b/g,
    rash: /\b(?:rash|hives|red spots|itchy skin|skin eruptions?)\b/g,
    urination: /\b(?:(?:pain|burning|stinging) (?:when|while|on|during) (?:urinating|peeing|passing urine)|painful urination|burning urine|burning (?:sensation )?when I pee)\b/g
  };

  const OTHER_SIGN_WORDS = {
    fluids: /\b(?:(?:can[’']?t|cannot|unable to|not able to) keep (?:any |down )?(?:fluids?|water|food|anything)(?: down)?|vomiting everything)\b/g,
    dehydration: /\b(?:dehydrat\w*|very dry mouth|extreme thirst|barely (?:peeing|urinating)|very little urine|hardly (?:peeing|urinating))\b/g,
    bloodstoolurine: /\bblood in (?:my |the )?(?:stools?|urine|poo|pee)\b/g,
    vulnerable: /\b(?:pregnan\w*|weak(?:ened)? immune|immune system is weak|immunosuppress\w*|chemotherapy|transplant|dialysis|cancer)\b/g
  };

  const NUMBER_WORDS = {
    a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8,
    nine: 9, ten: 10, eleven: 11, twelve: 12, 'couple of': 2, 'a couple of': 2
  };

  /* ---------- Helpers ---------- */

  function labelOf(list, id) {
    const item = list.find(function (entry) { return entry.id === id; });
    return item ? item.label : id;
  }

  // True if a negation word appears earlier in the same clause ("no fever", "without cough").
  function isNegated(text, index) {
    const before = text.slice(Math.max(0, index - 40), index);
    const clause = before.split(/[.;,!?\n]| but | however | although /).pop();
    return /\b(?:no|not|without|denies|deny|never|zero|free of)\b|n[’']t\b/.test(clause);
  }

  // Finds the first match of a global regex that is not negated. Returns the matched text or ''.
  function findAffirmed(text, regex) {
    const re = new RegExp(regex.source, 'g');
    let match;
    while ((match = re.exec(text)) !== null) {
      if (!isNegated(text, match.index)) return match[0];
      if (match[0] === '') re.lastIndex += 1;
    }
    return '';
  }

  function bucketForDays(days) {
    if (days < 1) return 'lt24h';
    if (days <= 3) return '1-3d';
    if (days <= 7) return '4-7d';
    if (days <= 14) return '8-14d';
    return 'gt14d';
  }

  /* ---------- Individual readers ---------- */

  function readDuration(t, unclear) {
    const amount = t.match(/\b(more than |over |longer than )?(\d+(?:\.\d+)?|a couple of|couple of|an|a|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\s*(hours?|hrs?|days?|weeks?|months?)\b(?![\s-]*old)/);
    if (amount) {
      const raw = amount[2];
      const n = Object.prototype.hasOwnProperty.call(NUMBER_WORDS, raw) ? NUMBER_WORDS[raw] : parseFloat(raw);
      const unit = amount[3].charAt(0);
      let days = unit === 'h' ? n / 24 : unit === 'd' ? n : unit === 'w' ? n * 7 : n * 30;
      if (amount[1]) days += 0.01; // "more than 3 days" belongs in the next bucket up
      return { id: bucketForDays(days), evidence: amount[0].trim() };
    }
    if (/\b(?:a few days|few days|several days)\b/.test(t)) {
      unclear.push('You said "a few days". Please pick the closest duration yourself.');
      return null;
    }
    if (/\b(?:since last week|last week)\b/.test(t)) return { id: '8-14d', evidence: 'last week' };
    const recent = t.match(/\b(?:this morning|since morning|today|tonight|since last night|last night|few hours|couple of hours|an hour|just now|since this afternoon)\b/);
    if (recent) return { id: 'lt24h', evidence: recent[0] };
    const yesterday = t.match(/\b(?:since yesterday|yesterday)\b/);
    if (yesterday) return { id: '1-3d', evidence: yesterday[0] };
    return null;
  }

  function readSeverity(t) {
    // If several words appear, the more severe one wins (we prefer caution).
    const severe = t.match(/\b(?:severe|terrible|unbearable|excruciating|extreme|intense|very bad|really bad|worst|can[’']?t (?:do anything|function|work|get out of bed|sleep))\b/);
    if (severe) return { id: 'severe', evidence: severe[0] };
    const moderate = t.match(/\b(?:moderate|quite bad|pretty bad|fairly bad|bad)\b/);
    if (moderate) return { id: 'moderate', evidence: moderate[0] };
    const mild = t.match(/\b(?:mild|slight|minor|a little|a bit|not too bad|not that bad)\b/);
    if (mild) return { id: 'mild', evidence: mild[0] };
    return null;
  }

  function readWorsening(t) {
    const notWorseRe = /\b(?:not (?:getting )?worse|no worse|isn[’']?t (?:getting )?worse|not worsening)\b/;
    const notWorse = t.match(notWorseRe);
    t = t.replace(new RegExp(notWorseRe.source, 'g'), ' '); // so "not getting worse" is not also read as "getting worse"
    const worse = t.match(/\b(?:getting worse|gotten worse|got worse|becoming worse|worsening|worse and worse|much worse|is worse|are worse|deteriorat\w*)\b/);
    const better = t.match(/\b(?:getting better|improving|improved|settling|a bit better|much better)\b/);
    if (notWorse && !worse) return { id: 'no', evidence: notWorse[0] };
    if (worse && !notWorse) return { id: 'yes', evidence: worse[0] };
    if (better && !worse) return { id: 'no', evidence: better[0] };
    return null;
  }

  function readPain(t) {
    const m = t.match(/\b(severe|unbearable|excruciating|moderate|mild)\s+(?:\w+\s+)?pain\b/);
    if (!m) return null;
    const id = /severe|unbearable|excruciating/.test(m[1]) ? 'severe' : m[1];
    return { id: id, evidence: m[0] };
  }

  function readTemperature(t) {
    const patterns = [
      /(?:temp(?:erature)?|fever|thermometer|reading)[^\d\n]{0,25}(\d{2,3}(?:\.\d)?)(?!\s*(?:day|hour|hr|week|month|year))\s*(?:°|º|degrees?|deg)?\s*(c(?:elsius)?|f(?:ahrenheit)?)?\b/,
      /(\d{2,3}(?:\.\d)?)\s*(?:°|º)\s*(c|f)\b/,
      /(\d{2,3}(?:\.\d)?)\s*degrees?\s*(celsius|fahrenheit|c|f)?\b/
    ];
    for (let i = 0; i < patterns.length; i += 1) {
      const m = t.match(patterns[i]);
      if (!m) continue;
      const value = parseFloat(m[1]);
      const unit = m[2] ? m[2].charAt(0).toUpperCase() : (value >= 80 ? 'F' : 'C');
      const range = unit === 'F' ? [86, 113] : [30, 45];
      if (value >= range[0] && value <= range[1]) return { value: String(value), unit: unit, evidence: m[0].trim() };
    }
    return null;
  }

  function ageIdFromYears(years) {
    if (years <= 12) return '3m-12y';
    if (years <= 17) return '13-17';
    if (years <= 64) return '18-64';
    return '65plus';
  }

  function readAge(t) {
    const old = t.match(/\b(\d+(?:\.\d+)?)[\s-]*(day|week|month|year)s?[\s-]*old\b/);
    if (old) {
      const n = parseFloat(old[1]);
      const unit = old[2];
      let id;
      if (unit === 'day' || unit === 'week') id = unit === 'day' || n < 13 ? 'under3m' : '3m-12y';
      else if (unit === 'month') id = n < 3 ? 'under3m' : '3m-12y';
      else id = ageIdFromYears(n);
      return { id: id, evidence: old[0] };
    }
    const stated = t.match(/\b(?:aged?|i am|i[’']m|im)\s+(\d{1,3})\b(?!\s*(?:°|º|degrees?|days?|hours?|weeks?|months?|c\b|f\b))/);
    if (stated) return { id: ageIdFromYears(parseInt(stated[1], 10)), evidence: stated[0] };
    if (/\bnewborn\b/.test(t)) return { id: 'under3m', evidence: 'newborn' };
    return null;
  }

  function readForWhom(t) {
    const other = t.match(/\bmy (?:\d+(?:\.\d+)?[\s-]*(?:day|week|month|year)s?[\s-]*old\s+|little\s+|elderly\s+|younger\s+|older\s+)?(?:son|daughter|child|baby|kid|toddler|girl|boy|mother|mom|mum|father|dad|wife|husband|grandmother|grandfather|grandma|grandpa|brother|sister|friend|patient)\b/);
    if (other) return { id: 'other', evidence: other[0] };
    const self = t.match(/\b(?:i have|i am|i[’']m|i[’']ve|i feel|i got|i had)\b/);
    if (self) return { id: 'self', evidence: self[0] };
    return null;
  }

  /* ---------- Main entry ---------- */

  function parseNarrative(rawText) {
    const original = String(rawText || '').trim();
    const t = original.toLowerCase().replace(/[’]/g, "'");
    const items = [];
    const unclear = [];
    const result = {
      symptoms: [], emergencySigns: [], otherSigns: [], duration: '', severity: '', worsening: '', pain: '',
      temperature: null, ageGroup: '', forWhom: '', items: items, unclear: unclear, text: original
    };
    if (t === '') return result;

    // Symptoms
    const symptomEvidence = [];
    R.SYMPTOMS.forEach(function (symptom) {
      const found = findAffirmed(t, SYMPTOM_WORDS[symptom.id]);
      if (found) { result.symptoms.push(symptom.id); symptomEvidence.push(symptom.label + ' ("' + found + '")'); }
    });
    if (result.symptoms.length) {
      items.push({ field: 'Symptoms', value: result.symptoms.map(function (id) { return labelOf(R.SYMPTOMS, id); }).join(', '), evidence: symptomEvidence.join('; ') });
    }

    // Warning signs it can see. These are ticked for the person to confirm.
    R.scanEmergencyText(t).forEach(function (id) { result.emergencySigns.push(id); });
    if (result.emergencySigns.length) {
      items.push({ field: 'Emergency warning signs', value: result.emergencySigns.map(function (id) { return labelOf(R.EMERGENCY_SIGNS, id); }).join('; '), evidence: 'Your wording matches a warning sign. Please read the emergency check carefully.' });
    }
    Object.keys(OTHER_SIGN_WORDS).forEach(function (id) {
      const found = findAffirmed(t, OTHER_SIGN_WORDS[id]);
      if (found) {
        result.otherSigns.push(id);
        items.push({ field: 'Other sign', value: labelOf(R.OTHER_SIGNS, id), evidence: '"' + found + '"' });
      }
    });

    const duration = readDuration(t, unclear);
    if (duration) { result.duration = duration.id; items.push({ field: 'Duration', value: labelOf(R.DURATIONS, duration.id), evidence: '"' + duration.evidence + '"' }); }

    const severity = readSeverity(t);
    if (severity) { result.severity = severity.id; items.push({ field: 'Severity', value: labelOf(R.SEVERITIES, severity.id), evidence: '"' + severity.evidence + '"' }); }

    const worsening = readWorsening(t);
    if (worsening) { result.worsening = worsening.id; items.push({ field: 'Getting worse', value: labelOf(R.WORSENING, worsening.id), evidence: '"' + worsening.evidence + '"' }); }

    const pain = readPain(t);
    if (pain) { result.pain = pain.id; items.push({ field: 'Pain', value: labelOf(R.PAIN_LEVELS, pain.id), evidence: '"' + pain.evidence + '"' }); }

    const temperature = readTemperature(t);
    if (temperature) {
      result.temperature = { value: temperature.value, unit: temperature.unit };
      items.push({ field: 'Temperature', value: temperature.value + ' \u00B0' + temperature.unit, evidence: '"' + temperature.evidence + '"' });
    }

    const age = readAge(t);
    if (age) { result.ageGroup = age.id; items.push({ field: 'Age group', value: labelOf(R.AGE_GROUPS, age.id), evidence: '"' + age.evidence + '"' }); }

    const who = readForWhom(t);
    if (who) { result.forWhom = who.id; items.push({ field: 'Who it is for', value: labelOf(R.WHO_FOR, who.id), evidence: '"' + who.evidence + '"' }); }

    if (result.symptoms.length === 0 && result.emergencySigns.length === 0) {
      unclear.push('I could not recognise any symptoms. Try simple words such as "fever", "cough" or "stomach pain", or pick them from the list below.');
    }
    return result;
  }

  const EXAMPLES = [
    'I have had a fever of 38.6 C and a dry cough for 5 days. I feel very tired and my body aches. It is getting worse.',
    'My 2 year old daughter has been vomiting since last night and has loose motions. She is not getting worse.',
    'Sore throat and runny nose since yesterday, mild, no fever.'
  ];

  const api = { parseNarrative: parseNarrative, EXAMPLES: EXAMPLES };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.SymptomAssistant = api;
})(this);
