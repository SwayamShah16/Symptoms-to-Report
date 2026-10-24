/* ============================================================================
   script.js - Symptoms to Report Advisor (user interface)

   All safety decisions come from rules.js (window.SymptomRules). Smart Fill
   comes from assistant.js. This file collects answers, shows errors, draws the
   report and the safety guide, and - only if the person opts in and a server
   with an API key is available - asks an AI to improve the wording.
   User text is always inserted with textContent, never innerHTML.
   ============================================================================ */
(function () {
  'use strict';

  const R = window.SymptomRules;
  const A = window.SymptomAssistant;
  const ORIGINAL_TITLE = document.title;

  /* ---------- Small DOM helpers ---------- */

  function $(selector, scope) { return (scope || document).querySelector(selector); }
  function $all(selector, scope) { return Array.prototype.slice.call((scope || document).querySelectorAll(selector)); }

  // el('p', { className: 'x', text: 'hello', attrs: { id: 'y' } }, [childNode])
  function el(tag, options, children) {
    const opts = options || {};
    const node = document.createElement(tag);
    if (opts.className) node.className = opts.className;
    if (opts.text !== undefined) node.textContent = opts.text;
    if (opts.attrs) Object.keys(opts.attrs).forEach(function (key) { node.setAttribute(key, opts.attrs[key]); });
    (children || []).forEach(function (child) { node.appendChild(child); });
    return node;
  }

  const form = $('#assessment-form');
  const views = { home: $('#view-home'), guide: $('#view-guide'), assessment: $('#view-assessment'), report: $('#view-report') };

  // Kept only in memory for this browser tab, so a second assessment can be compared with the first.
  let previousSnapshot = null;
  let currentReport = null;

  /* ---------- Views and navigation ---------- */

  function showView(name, scrollTargetId) {
    Object.keys(views).forEach(function (key) { views[key].hidden = key !== name; });
    $all('.nav-link[data-view]').forEach(function (button) {
      if (button.dataset.view === name) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
    if (name !== 'report') document.title = ORIGINAL_TITLE;

    if (scrollTargetId) {
      const target = document.getElementById(scrollTargetId);
      if (target) { target.scrollIntoView(); target.focus({ preventScroll: true }); }
    } else {
      window.scrollTo(0, 0);
      const heading = $('h1', views[name]);
      if (heading) heading.focus({ preventScroll: true });
    }
  }

  document.addEventListener('click', function (event) {
    const viewButton = event.target.closest('[data-view]');
    if (viewButton) { showView(viewButton.dataset.view); return; }
    const scrollButton = event.target.closest('[data-scroll]');
    if (scrollButton) { showView('home', scrollButton.dataset.scroll); return; }
    const sizeButton = event.target.closest('[data-size]');
    if (sizeButton) setTextSize(sizeButton);
  });

  function setTextSize(activeButton) {
    document.documentElement.style.fontSize = activeButton.dataset.size + '%';
    $all('[data-size]').forEach(function (button) { button.setAttribute('aria-pressed', String(button === activeButton)); });
  }

  /* ---------- Building the form from the option lists in rules.js ---------- */

  function fillSelect(select, list, placeholder) {
    select.appendChild(el('option', { text: placeholder, attrs: { value: '' } }));
    list.forEach(function (item) { select.appendChild(el('option', { text: item.label, attrs: { value: item.id } })); });
  }

  // One checkbox or radio drawn as a selectable card.
  function makeChoice(options) {
    const input = el('input', { attrs: { type: options.type, name: options.name, value: options.value } });
    if (options.id) input.id = options.id;
    const textParts = [el('span', { className: 'choice-label', text: options.label })];
    if (options.hint) textParts.push(el('span', { className: 'choice-hint', text: options.hint }));
    const body = el('span', { className: 'choice-body' }, [
      el('span', { className: 'mark', attrs: { 'aria-hidden': 'true' } }),
      el('span', { className: 'choice-text' }, textParts)
    ]);
    const classes = 'choice ' + (options.type === 'radio' ? 'radio ' : '') + (options.className || '');
    return el('label', { className: classes.trim() }, [input, body]);
  }

  function buildForm() {
    fillSelect($('#ageGroup'), R.AGE_GROUPS, 'Prefer not to say');
    fillSelect($('#duration'), R.DURATIONS, 'Choose one');
    const pain = $('#pain');
    R.PAIN_LEVELS.forEach(function (item) { pain.appendChild(el('option', { text: item.label, attrs: { value: item.id } })); });

    // Symptoms, grouped by body area
    R.SYMPTOM_GROUPS.forEach(function (group) {
      const grid = el('div', { className: 'choice-grid' });
      R.SYMPTOMS.filter(function (s) { return s.group === group.id; }).forEach(function (s) {
        grid.appendChild(makeChoice({ type: 'checkbox', name: 'symptom', value: s.id, label: s.label }));
      });
      $('#symptom-options').appendChild(el('div', { className: 'symptom-group' }, [
        el('p', { className: 'group-title', text: group.label }), grid
      ]));
    });

    // Optional follow-up questions, one block per symptom, hidden until that symptom is chosen
    R.SYMPTOMS.forEach(function (symptom) {
      const questions = R.FOLLOW_UPS.filter(function (q) { return q.symptom === symptom.id; });
      if (!questions.length) return;
      const row = el('div', { className: 'inline-fields' });
      questions.forEach(function (q) {
        const selectId = 'fu-' + q.id;
        const select = el('select', { attrs: { id: selectId, 'data-followup': q.id } });
        select.appendChild(el('option', { text: 'Skip', attrs: { value: '' } }));
        q.options.forEach(function (o) { select.appendChild(el('option', { text: o.label, attrs: { value: o.id } })); });
        row.appendChild(el('div', { className: 'field-pair' }, [el('label', { text: q.label, attrs: { for: selectId } }), select]));
      });
      const block = el('div', { className: 'followup-block', attrs: { 'data-symptom': symptom.id } }, [
        el('p', { className: 'group-title', text: symptom.label }), row
      ]);
      block.hidden = true;
      $('#followup-list').appendChild(block);
    });

    R.WHO_FOR.forEach(function (w) {
      $('#whofor-options').appendChild(makeChoice({ type: 'radio', name: 'forWhom', value: w.id, label: w.label }));
    });
    R.SEVERITIES.forEach(function (s) {
      $('#severity-options').appendChild(makeChoice({ type: 'radio', name: 'severity', value: s.id, label: s.label, hint: s.hint }));
    });
    R.WORSENING.forEach(function (w) {
      $('#worsening-options').appendChild(makeChoice({ type: 'radio', name: 'worsening', value: w.id, label: w.label }));
    });
    R.EMERGENCY_SIGNS.forEach(function (sign) {
      $('#emergency-options').appendChild(makeChoice({ type: 'checkbox', name: 'emergency', value: sign.id, label: sign.label, className: 'danger' }));
    });
    R.OTHER_SIGNS.forEach(function (sign) {
      $('#other-sign-options').appendChild(makeChoice({ type: 'checkbox', name: 'othersign', value: sign.id, label: sign.label }));
    });

    const answers = $('.warning-answers');
    answers.appendChild(makeChoice({ type: 'checkbox', name: 'warning-none', value: 'none', id: 'warn-none', label: 'None of these apply' }));
    answers.appendChild(makeChoice({ type: 'checkbox', name: 'warning-unsure', value: 'unsure', id: 'warn-unsure', label: 'I am not sure' }));
  }

  /* ---------- Reading the form ---------- */

  function collectInput() {
    const checkedValues = function (name) {
      return $all('input[name="' + name + '"]:checked', form).map(function (input) { return input.value; });
    };
    const radioValue = function (name) {
      const checked = $('input[name="' + name + '"]:checked', form);
      return checked ? checked.value : '';
    };
    const followUps = {};
    $all('[data-followup]', form).forEach(function (select) {
      if (select.value && !select.closest('.followup-block').hidden) followUps[select.dataset.followup] = select.value;
    });
    return {
      ageGroup: $('#ageGroup').value,
      forWhom: radioValue('forWhom'),
      symptoms: checkedValues('symptom'),
      followUps: followUps,
      otherSymptoms: $('#otherSymptoms').value,
      duration: $('#duration').value,
      severity: radioValue('severity'),
      temperatureValue: $('#temperatureValue').value,
      temperatureUnit: $('#temperatureUnit').value,
      pain: $('#pain').value,
      details: $('#details').value,
      worsening: radioValue('worsening'),
      emergencySigns: checkedValues('emergency'),
      otherSigns: checkedValues('othersign'),
      noneApply: $('#warn-none').checked,
      notSure: $('#warn-unsure').checked,
      medicines: $('#medicines').value,
      allergies: $('#allergies').value,
      conditions: $('#conditions').value
    };
  }

  /* ---------- Keeping the form tidy: exclusion, follow-ups, search, progress ---------- */

  function syncFollowUps() {
    const selected = $all('input[name="symptom"]:checked', form).map(function (input) { return input.value; });
    let anyVisible = false;
    $all('.followup-block', form).forEach(function (block) {
      const visible = selected.indexOf(block.dataset.symptom) !== -1;
      block.hidden = !visible;
      if (!visible) $all('select', block).forEach(function (select) { select.value = ''; });
      if (visible) anyVisible = true;
    });
    $('#followup-section').hidden = !anyVisible;
  }

  function filterSymptoms() {
    const query = $('#symptom-search').value.trim().toLowerCase();
    let shown = 0;
    $all('#symptom-options .choice').forEach(function (choice) {
      const label = $('.choice-label', choice).textContent.toLowerCase();
      const visible = !query || label.indexOf(query) !== -1 || $('input', choice).checked; // ticked ones never vanish
      choice.hidden = !visible;
      if (visible) shown += 1;
    });
    $all('.symptom-group').forEach(function (group) {
      group.hidden = !$all('.choice', group).some(function (choice) { return !choice.hidden; });
    });
    $('#symptom-count').textContent = query ? shown + (shown === 1 ? ' symptom shown' : ' symptoms shown') : '';
  }

  function updateProgress() {
    const input = R.normalizeInput(collectInput());
    const answered = [
      input.noneApply || input.notSure || input.emergencySigns.length > 0,
      input.symptoms.length > 0 || input.otherSymptoms !== '',
      input.duration !== '',
      input.severity !== '',
      input.worsening !== ''
    ].filter(Boolean).length;
    $('#progress-bar').value = answered;
    $('#progress-text').textContent = 'Required answers: ' + answered + ' of 5';
  }

  function updateLiveAlert() {
    const alertBox = $('#live-alert');
    const safety = R.evaluateSafety(collectInput());
    const emergencyReasons = safety.triggered.filter(function (t) { return t.level === 'emergency'; });

    alertBox.textContent = '';
    if (emergencyReasons.length === 0) { alertBox.hidden = true; return; }
    alertBox.appendChild(el('strong', { text: 'This may be an emergency. ' }));
    alertBox.appendChild(document.createTextNode(
      'Call your local emergency number now (' + R.EMERGENCY_NUMBERS + ') or go to the nearest emergency department. ' +
      'Do not wait to finish this form.'));
    if (emergencyReasons.some(function (t) { return t.tag === 'selfharm'; })) {
      alertBox.appendChild(el('span', { className: 'alert-extra', text: crisisText() }));
    }
    alertBox.hidden = false;
  }

  function crisisText() {
    return 'If you are thinking about harming yourself, contact emergency services or a crisis line right now. ' +
      'In India you can call Tele-MANAS on 14416, in the US call or text 988, and in the UK or Ireland call Samaritans on 116 123. ' +
      'Please check the number for your own country.';
  }

  function syncAll() {
    syncFollowUps();
    filterSymptoms();
    updateLiveAlert();
    updateProgress();
  }

  form.addEventListener('change', function (event) {
    const target = event.target;
    const none = $('#warn-none');
    // "None of these apply" must never sit alongside a warning sign.
    if (target === none && none.checked) {
      $all('input[name="emergency"], #warn-unsure', form).forEach(function (input) { input.checked = false; });
    } else if ((target.name === 'emergency' || target.id === 'warn-unsure') && target.checked) {
      none.checked = false;
    }
    syncAll();
  });
  form.addEventListener('input', function (event) {
    if (event.target.id === 'symptom-search') filterSymptoms();
    updateLiveAlert();
    updateProgress();
  });

  /* ---------- Smart Fill (free, offline) ---------- */

  let exampleIndex = 0;

  function setChecked(selector, on) {
    const input = $(selector, form);
    if (input) input.checked = on;
  }

  function applyNarrative(result) {
    result.symptoms.forEach(function (id) { setChecked('input[name="symptom"][value="' + id + '"]', true); });
    result.emergencySigns.forEach(function (id) { setChecked('input[name="emergency"][value="' + id + '"]', true); });
    if (result.emergencySigns.length) $('#warn-none').checked = false; // never leave "none" next to a sign
    result.otherSigns.forEach(function (id) { setChecked('input[name="othersign"][value="' + id + '"]', true); });
    if (result.duration) $('#duration').value = result.duration;
    if (result.severity) setChecked('input[name="severity"][value="' + result.severity + '"]', true);
    if (result.worsening) setChecked('input[name="worsening"][value="' + result.worsening + '"]', true);
    if (result.forWhom) setChecked('input[name="forWhom"][value="' + result.forWhom + '"]', true);
    if (result.pain) $('#pain').value = result.pain;
    if (result.ageGroup) $('#ageGroup').value = result.ageGroup;
    if (result.temperature) {
      $('#temperatureValue').value = result.temperature.value;
      $('#temperatureUnit').value = result.temperature.unit;
    }
    if (!$('#otherSymptoms').value.trim()) $('#otherSymptoms').value = result.text.slice(0, 300);
    syncAll();
  }

  function runSmartFill() {
    const text = $('#narrative').value;
    const box = $('#smartfill-result');
    box.textContent = '';
    box.hidden = false;

    if (!text.trim()) {
      box.appendChild(el('p', { text: 'Type a sentence first, or press "Try an example".' }));
      return;
    }
    const result = A.parseNarrative(text);
    applyNarrative(result);

    if (result.items.length) {
      box.appendChild(el('p', { className: 'smartfill-title', text: 'Here is what I picked up. Please check each one below.' }));
      const list = el('ul', { className: 'smartfill-list' });
      result.items.forEach(function (item) {
        list.appendChild(el('li', {}, [el('strong', { text: item.field + ': ' }), document.createTextNode(item.value + '  '), el('span', { className: 'evidence', text: item.evidence })]));
      });
      box.appendChild(list);
    }
    result.unclear.forEach(function (message) { box.appendChild(el('p', { className: 'smartfill-warn', text: message })); });
    if (result.emergencySigns.length) {
      box.appendChild(el('p', { className: 'smartfill-warn', text: 'Your words match an emergency warning sign. If this is happening now, call your local emergency number first.' }));
    }
    box.appendChild(el('p', { className: 'hint', text: 'Smart Fill uses simple language rules and can misread. You still need to answer the emergency check (section 1) yourself.' }));
  }

  /* ---------- Validation messages ---------- */

  const FIELD_GROUP_IDS = {
    ageGroup: 'group-ageGroup', forWhom: 'group-forWhom', symptoms: 'group-symptoms', otherSymptoms: 'group-symptoms',
    duration: 'group-duration', severity: 'group-severity', worsening: 'group-worsening',
    temperature: 'group-temperature', details: 'group-details', warnings: 'group-warnings',
    medicines: 'group-background', allergies: 'group-background', conditions: 'group-background'
  };

  function clearErrors() {
    $all('.field-error', form).forEach(function (p) { p.hidden = true; p.textContent = ''; });
    $all('.has-error', form).forEach(function (n) { n.classList.remove('has-error'); });
    const summary = $('#error-summary');
    summary.hidden = true;
    summary.textContent = '';
  }

  function showErrors(errors) {
    const summary = $('#error-summary');
    const list = el('ul');
    summary.appendChild(el('strong', { text: 'Please fix the following before creating your report:' }));

    Object.keys(errors).forEach(function (key) {
      const errorLine = $('#err-' + key);
      errorLine.textContent = errors[key];
      errorLine.hidden = false;
      const group = document.getElementById(FIELD_GROUP_IDS[key]);
      if (group) group.classList.add('has-error');

      const link = el('a', { text: errors[key], attrs: { href: '#' + FIELD_GROUP_IDS[key] } });
      link.addEventListener('click', function (event) {
        event.preventDefault();
        const control = group && $('input, select, textarea', group);
        if (control) control.focus();
      });
      list.appendChild(el('li', {}, [link]));
    });

    summary.appendChild(list);
    summary.hidden = false;
    summary.focus();
  }

  /* ---------- Report rendering ---------- */

  function paragraph(text, className) { return el('p', { text: text, className: className || '' }); }

  function bulletList(items, className) {
    return el('ul', { className: 'report-list ' + (className || '') },
      items.map(function (item) { return el('li', { text: item }); }));
  }

  function tagList(items) {
    return el('ul', { className: 'tags' }, items.map(function (item) { return el('li', { text: item }); }));
  }

  function fact(term, nodes) {
    return el('div', { className: 'fact' }, [el('dt', { text: term }), el('dd', {}, nodes)]);
  }

  function reportSection(title, nodes, className) {
    return el('section', { className: 'report-section ' + (className || '') }, [el('h2', { text: title })].concat(nodes));
  }

  function renderReport(report) {
    const root = $('#report-content');
    root.textContent = '';
    const level = report.guidance.level;
    $('#report-meta').textContent = 'Prepared with Symptoms to Report Advisor, a student demonstration project. Reference ' + report.reference + '.';

    // 1. Guidance banner comes first, so an emergency can never be missed.
    const banner = el('section', { className: 'level-banner level-' + level, attrs: { 'aria-label': 'Care guidance' } });
    banner.appendChild(el('p', { className: 'level-kicker', text: R.LEVELS[level].label }));
    banner.appendChild(el('h2', { className: 'level-title', text: report.guidance.title }));
    banner.appendChild(bulletList(report.guidance.steps));
    if (level === 'emergency') {
      const emergencyReasons = report.reasons.filter(function (r) { return r.level === 'emergency'; });
      banner.appendChild(el('p', { className: 'level-why', text: 'Why you are seeing this:' }));
      banner.appendChild(bulletList(emergencyReasons.map(function (r) { return r.text; })));
    }
    if (report.guidance.selfHarm) banner.appendChild(paragraph(crisisText(), 'level-crisis'));
    root.appendChild(banner);

    // Four-step ladder showing where this guidance sits.
    const ladder = el('ol', { className: 'ladder', attrs: { 'aria-label': 'Guidance level, from monitor to emergency' } });
    ['monitor', 'soon', 'urgent', 'emergency'].forEach(function (key) {
      const item = el('li', { className: 'is-' + key, text: R.LEVELS[key].label });
      if (key === level) item.setAttribute('aria-current', 'true');
      ladder.appendChild(item);
    });
    root.appendChild(ladder);

    // At a glance
    const glance = el('div', { className: 'glance' });
    [['Guidance', R.LEVELS[level].label], ['Duration', report.duration], ['Severity', report.severity], ['Getting worse', report.worsening]].forEach(function (pair) {
      glance.appendChild(el('div', { className: 'glance-item' }, [el('span', { className: 'glance-label', text: pair[0] }), el('strong', { text: pair[1] })]));
    });
    root.appendChild(glance);

    // Changes since the last assessment in this session
    if (report.comparison.length) {
      root.appendChild(reportSection('Changes since your previous assessment', [bulletList(report.comparison)], 'comparison'));
    }

    // 2. Key facts
    const facts = el('dl', { className: 'facts' });
    facts.appendChild(fact('Date and time', [document.createTextNode(report.dateTime)]));
    facts.appendChild(fact('Prepared for', [document.createTextNode(report.preparedFor)]));
    facts.appendChild(fact('Age group', [document.createTextNode(report.ageGroup)]));

    const symptomNodes = [];
    if (report.symptoms.length) symptomNodes.push(tagList(report.symptoms));
    if (report.otherSymptoms) symptomNodes.push(paragraph('In your own words: "' + report.otherSymptoms + '"'));
    facts.appendChild(fact('Reported symptoms', symptomNodes));

    if (report.followUpDetails.length) {
      facts.appendChild(fact('More about the symptoms', [bulletList(report.followUpDetails.map(function (d) {
        return d.symptom + ' - ' + d.label + ': ' + d.value;
      }))]));
    }

    facts.appendChild(fact('Duration', [document.createTextNode(report.duration)]));
    facts.appendChild(fact('Severity', [document.createTextNode(report.severity)]));

    const extraNodes = [paragraph('Getting worse: ' + report.worsening)];
    extraNodes.push(paragraph('Temperature: ' + (report.temperature || 'Not recorded')));
    extraNodes.push(paragraph('Pain: ' + report.pain));
    if (report.details) extraNodes.push(paragraph('Other details: "' + report.details + '"'));
    facts.appendChild(fact('Additional details', extraNodes));

    const warningNodes = [paragraph(report.warningStatement)];
    if (report.emergencySigns.length) warningNodes.push(bulletList(report.emergencySigns));
    if (report.otherSigns.length) {
      warningNodes.push(paragraph('Other signs you mentioned:'));
      warningNodes.push(bulletList(report.otherSigns));
    }
    facts.appendChild(fact('Warning signs', warningNodes));

    facts.appendChild(fact('For your healthcare professional', [
      paragraph('Medicines: ' + report.background.medicines),
      paragraph('Allergies: ' + report.background.allergies),
      paragraph('Medical conditions: ' + report.background.conditions)
    ]));
    root.appendChild(facts);

    // 3. Summary
    const sourceLabel = report.generatedBy === 'ai'
      ? 'Wording by AI (checked against safety filters). The care guidance above comes only from the fixed safety rules.'
      : 'Written by the built-in template from your answers. No AI was used.';
    const summaryNodes = [paragraph(report.summary), paragraph(sourceLabel, 'source-note')];
    if (report.notice) summaryNodes.push(paragraph(report.notice, 'source-note'));
    root.appendChild(reportSection('Summary in plain language', summaryNodes));

    // 4. Questions, missing information, what to bring
    root.appendChild(reportSection('Questions you may want to discuss', [bulletList(report.questions)]));
    root.appendChild(reportSection('Worth gathering before your visit', [bulletList(report.missingInfo)]));
    root.appendChild(reportSection('What to bring', [bulletList(report.checklist, 'checklist')]));

    // 5. How the guidance was decided (transparent rules)
    const reasonItems = report.reasons.map(function (r) {
      return r.id + ' (' + R.LEVELS[r.level].label + '): ' + r.text;
    });
    root.appendChild(reportSection('How this guidance was decided', [
      paragraph('The highest level triggered by the fixed rules is used. A lower level never cancels a higher one, and a calm result does not rule out an emergency.'),
      bulletList(reasonItems),
      paragraph('These rules are hand-written and have not been clinically validated.', 'source-note')
    ]));

    // 6. Space for notes at the appointment (useful on paper)
    const lines = [];
    for (let i = 0; i < 6; i += 1) lines.push(el('div', { className: 'note-line' }));
    root.appendChild(reportSection('Notes from my appointment', lines, 'notes-section'));

    // 7. Reminder
    root.appendChild(el('section', { className: 'report-section disclaimer' }, [
      el('h2', { text: 'This is not a diagnosis' }),
      paragraph(report.disclaimer)
    ]));

    document.title = 'Symptoms report - ' + report.dateTime;
    setReportStatus('In the print window, choose "Save as PDF" as the destination to keep a copy.');
  }

  function setReportStatus(message) { $('#report-status').textContent = message; }

  /* ---------- Safety guide page ---------- */

  function renderGuide() {
    R.EMERGENCY_SIGNS.forEach(function (sign) { $('#guide-emergency').appendChild(el('li', { text: sign.label })); });
    R.OTHER_SIGNS.forEach(function (sign) { $('#guide-other').appendChild(el('li', { text: sign.label })); });
    R.RULE_CATALOG.forEach(function (rule) {
      $('#rules-body').appendChild(el('tr', { className: 'rule-' + rule.level }, [
        el('td', { text: rule.id }),
        el('td', { text: R.LEVELS[rule.level].label }),
        el('td', { text: rule.when })
      ]));
    });
  }

  /* ---------- Copy, download, print ---------- */

  function copyReportText() {
    if (!currentReport) return;
    const text = R.reportToText(currentReport);
    const done = function (ok) { setReportStatus(ok ? 'Report copied to the clipboard.' : 'Could not copy. Use "Download as text" instead.'); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
      return;
    }
    const scratch = el('textarea', { attrs: { 'aria-hidden': 'true' } });
    scratch.value = text;
    scratch.style.position = 'fixed';
    scratch.style.opacity = '0';
    document.body.appendChild(scratch);
    scratch.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
    scratch.remove();
    done(ok);
  }

  function downloadReportText() {
    if (!currentReport) return;
    const blob = new Blob([R.reportToText(currentReport)], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = el('a', { attrs: { href: url, download: 'symptoms-report-' + currentReport.reference + '.txt' } });
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    setReportStatus('Report downloaded as a text file. It contains health details, so keep it private.');
  }

  /* ---------- Optional AI wording (via a server that holds the key) ---------- */

  // The browser never sees an API key. It only talks to our own server, which
  // holds the key. If the server is absent (plain file, GitHub Pages, python
  // http.server) or has no key, the AI option simply never appears.
  function checkAiAvailability() {
    if (!/^https?:$/.test(window.location.protocol) || typeof fetch !== 'function') return;
    fetch('/api/ai-status')
      .then(function (response) { return response.ok ? response.json() : null; })
      .then(function (data) { if (data && data.enabled === true) $('#ai-option').hidden = false; })
      .catch(function () { /* AI stays hidden */ });
  }

  function requestAiExtras(payload) {
    const controller = new AbortController();
    const timer = setTimeout(function () { controller.abort(); }, 20000);
    return fetch('/api/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    }).then(function (response) {
      if (!response.ok) throw new Error('AI request failed');
      return response.json();
    }).finally(function () { clearTimeout(timer); });
  }

  function setBusy(isBusy) {
    const button = $('#submit-btn');
    button.disabled = isBusy;
    button.textContent = isBusy ? 'Preparing your report...' : 'Create my report';
    $('#status-text').textContent = isBusy ? 'Asking the AI to improve the wording. This can take a few seconds.' : '';
  }

  /* ---------- Submit: validate -> safety rules -> report (-> optional AI) ---------- */

  let busy = false;

  function finishReport(report) {
    report.comparison = R.compareAssessments(previousSnapshot, report.snapshot);
    previousSnapshot = report.snapshot;
    currentReport = report;
    renderReport(report);
    showView('report');
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (busy) return;

    const input = collectInput();
    clearErrors();
    const errors = R.validateInput(input);
    if (Object.keys(errors).length > 0) { showErrors(errors); return; }

    // Step 1: safety rules run FIRST and are frozen.
    const safety = R.evaluateSafety(input);
    // Step 2: local report, always available.
    const report = R.buildLocalReport(input, safety);

    const wantsAi = $('#use-ai').checked && !$('#ai-option').hidden;
    if (!wantsAi || safety.level === 'emergency') { // an emergency never waits for AI
      finishReport(report);
      return;
    }

    busy = true;
    setBusy(true);
    requestAiExtras(R.buildAiPayload(input))
      .then(function (data) {
        const clean = R.validateAiExtras(data);
        if (!clean) throw new Error('AI response rejected');
        // The AI may only change wording. Level, guidance and reasons stay as the rules set them.
        report.summary = clean.summary;
        report.questions = R.uniqueList(clean.questions.concat(report.questions)).slice(0, 10);
        report.missingInfo = R.uniqueList(report.missingInfo.concat(clean.missingInfo)).slice(0, 8);
        report.generatedBy = 'ai';
      })
      .catch(function () {
        report.notice = 'AI wording was not available, so the built-in template was used instead.';
      })
      .then(function () {
        busy = false;
        setBusy(false);
        finishReport(report);
      });
  });

  /* ---------- Buttons ---------- */

  $('#print-btn').addEventListener('click', function () { window.print(); });
  $('#copy-btn').addEventListener('click', copyReportText);
  $('#download-btn').addEventListener('click', downloadReportText);
  $('#edit-btn').addEventListener('click', function () { showView('assessment'); });
  $('#new-btn').addEventListener('click', function () { resetForm(); showView('assessment'); });
  $('#clear-btn').addEventListener('click', function () { resetForm(); $('#narrative').focus(); });
  $('#smartfill-btn').addEventListener('click', runSmartFill);
  $('#example-btn').addEventListener('click', function () {
    $('#narrative').value = A.EXAMPLES[exampleIndex % A.EXAMPLES.length];
    exampleIndex += 1;
    runSmartFill();
  });

  function resetForm() {
    form.reset();
    $('#narrative').value = '';
    const result = $('#smartfill-result');
    result.hidden = true;
    result.textContent = '';
    clearErrors();
    syncAll();
    $('#report-content').textContent = '';
    currentReport = null;
  }

  /* ---------- Start ---------- */

  buildForm();
  renderGuide();
  syncAll();
  checkAiAvailability();
  showView('home');
})();
