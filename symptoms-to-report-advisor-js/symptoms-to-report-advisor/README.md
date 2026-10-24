# Symptoms to Report Advisor

A student mini project for **AI in Healthcare**. It helps a person organise their symptoms into a clear report for a healthcare professional, and gives general guidance on how soon to seek care. Free to use, no account, nothing saved.

> **Medical safety notice:** This project does not diagnose disease, does not replace a doctor, and cannot guarantee that anyone is safe. It is a demonstration, not a validated medical triage system. In an emergency, call your local emergency number (112 in India, 911 in the US, 999 in the UK).

## Run it (no installs, no internet, no API key)

Double-click `index.html`. Everything below works offline except the optional AI wording.

```
symptoms-to-report-advisor/
  index.html            page structure (home, safety guide, form, report)
  style.css             styling, responsive layout, print layout
  rules.js              symptoms, validation, SAFETY RULES, report builder, rule catalog
  assistant.js          Smart Fill: offline plain-English intake
  script.js             user interface
  backend/server.js     OPTIONAL local server for AI wording
  backend/ai-core.js    shared AI code (Gemini free key or Anthropic)
  api/report.js         OPTIONAL serverless version for free hosting on Vercel
  api/ai-status.js
  tests/test-rules.js   40 tests of the safety rules and report
  tests/test-assistant.js  15 tests of Smart Fill
  docs/TESTING_AND_VIVA.md
```

Run the tests (Node.js only, nothing to install): `node tests/test-rules.js` and `node tests/test-assistant.js`

## Problem statement

People often struggle to describe their symptoms clearly in a short appointment, and may not know which symptoms need urgent attention. This project turns a person's answers into an organised report and applies visible safety rules to say how soon care should be sought.

## Objectives

- Capture symptoms accurately, in a list or in the person's own words.
- Check for emergency warning signs **before** anything else, using transparent rules.
- Produce a readable, printable report that never invents information.
- Work free, offline, with no accounts and no stored health data.
- Be honest about what the project is and is not.

## Technology stack

HTML5, CSS3 and vanilla JavaScript. Printing uses `window.print()`. The optional AI wording uses a small Node.js function (Node 18+, no packages) that calls Google Gemini (free key) or Anthropic.

## Features

**Input**
- **Smart Fill (free, offline):** type "fever and dry cough for 5 days, getting worse" and it fills in symptoms, duration, severity, worsening, temperature, age and who the symptoms are for. It shows what it picked up, with the words it relied on, so you can check it.
- 23 symptoms grouped by body area, with a search box.
- Optional follow-up questions that appear for the symptoms you pick (cough type, where the pain is, how often you vomited, and more).
- Who the symptoms are for, age group, temperature, pain, other signs, and optional medicines, allergies and conditions (names only).
- Progress indicator, clear error messages with links to the problem field, and larger text buttons (A, A+, A++).

**Safety**
- Emergency check first, with a live alert the moment a red sign is ticked or typed.
- Four guidance levels (Emergency, Urgent, Soon, Monitor). The highest triggered rule wins.
- A **Safety guide** page lists every emergency sign, emergency numbers and every rule in full. It is generated from the same data the rules use, and a test checks that no rule is missing.

**Report**
- Guidance banner and level ladder, at-a-glance summary, date and time, reference number, who it is for, symptoms and details, warning signs, background, plain-language summary, questions to discuss, what to gather, a "what to bring" checklist, how the guidance was decided, space for notes, and a "not a diagnosis" reminder.
- Print / Save as PDF with a clean print layout, Copy as text, Download as text.
- If you do a second assessment in the same tab, the report shows what changed since the first (kept in memory only).

**Optional AI wording** (see below). Smart Fill is not AI. It is language rules.

## System workflow

```
Own words -> [Smart Fill pre-fills the form, you review]
Answers -> Validation -> SAFETY RULES (frozen result) -> Local report
                                          |
                                          +-> [optional, never for emergencies]
                                              AI improves wording only
                                              -> output filter -> or fall back to local text
-> Report -> Print / Copy / Download
```

## The rules

See the **Safety guide** page in the app for the full list. In short:

| Level | Examples |
|---|---|
| Emergency | Any ticked or typed emergency sign: severe breathing difficulty, chest pain or pressure, unconsciousness, new confusion, stroke signs, seizure, severe allergy signs, serious bleeding, meningitis signs, sudden severe headache, thoughts of self-harm |
| Urgent | Severe symptoms, moderate and worsening, baby under 3 months, "not sure" about emergency signs, severe pain, shortness of breath, fast or irregular heartbeat, rash with fever, cannot keep fluids down, dehydration signs, blood in stool or urine, pregnancy or weak immunity or long-term condition |
| Soon | Mild but worsening, fever for more than 3 days, symptoms for more than a week, vomiting or diarrhea with dizziness, painful urination, moderate symptoms in young children or older adults |
| Monitor | No rule fired. This never rules out a problem. |

## Put it online for free

The core site is static files, so it can be hosted free anywhere. **Smart Fill and the whole safety check work on any static host.**

1. **GitHub Pages:** create a repository, upload the files, then Settings > Pages > deploy from the main branch. (AI wording will not appear, which is fine.)
2. **Netlify Drop:** drag the folder onto app.netlify.com/drop. (No AI wording.)
3. **Vercel (free Hobby plan), with AI wording:** import the repository, then in Project Settings > Environment Variables add `GEMINI_API_KEY`. The `api/` folder becomes serverless functions and the AI checkbox appears automatically.

Never put an API key in any file in the project. Only environment variables.

## Optional AI wording (separate from the core app)

AI can only rewrite the **summary and questions**. It never sees or changes the guidance level, and it is skipped entirely for emergencies.

**You do not need a paid key.** Google AI Studio gives a free Gemini API key with no card: go to aistudio.google.com/app/apikey. A paid Anthropic key also works.

Run locally (Node 18+):

- macOS / Linux: `GEMINI_API_KEY=your-key node backend/server.js`
- Windows PowerShell: `$env:GEMINI_API_KEY="your-key"; node backend/server.js`
- Anthropic instead: `ANTHROPIC_API_KEY=your-key node backend/server.js`
- Optional: `AI_PROVIDER=gemini|anthropic`, `GEMINI_MODEL`, `AI_MODEL`.

Open `http://localhost:3000`. The opt-in checkbox appears only when the server says a key is configured.

How it stays safe:
- The key lives only in an environment variable on the server. The browser never sees it.
- Only the known answer fields are forwarded, trimmed. Medicines, allergies and conditions are **not** sent.
- The model is told not to diagnose, mention medicines or doses, reassure, or invent facts. Its reply is checked again in the browser. Anything that looks like a dose, a prescription, a likely condition or reassurance is thrown away and the local text is used.
- If the AI fails or takes more than 20 seconds, the app uses the local text automatically.
- Rate limit of 10 requests a minute (per server instance). Request contents are never logged.

**Privacy warning:** Google states that free-tier Gemini requests may be used to improve its products. Do not use real patient details with a free key. For a class demo, use made-up data.

## Privacy

- No account, and no name, address or phone number is requested.
- Nothing is stored. There is no database and no `localStorage`. Closing the tab clears everything, including the comparison with an earlier assessment.
- Smart Fill runs in the browser and sends nothing.
- Data leaves the browser only if the optional AI feature is configured **and** the person ticks the box.
- **Limitations:** printing, copying or downloading a report puts health details on the device or clipboard, so keep them private. This project has had no privacy or security review and is not designed for real patient data.

## Limitations (please read)

- **Not validated.** The rules come from commonly published public-health warning signs. They have not been clinically tested, and the list is not complete.
- **Thresholds are conventions.** The duration cut-offs (fever for more than 3 days, symptoms for more than a week) are common conventions, not validated thresholds. There is no numeric temperature rule because a safe threshold could not be supported.
- **Free-text matching is simple.** Emergency phrases are matched without understanding negation ("no chest pain" still triggers a warning). We chose false alarms over missed warnings.
- **Smart Fill can misread.** It uses keyword patterns, so it can miss unusual wording and cannot understand every sentence. It ignores negated symptoms ("no fever") but may miss a symptom that follows a "no" in the same clause. It leaves vague durations such as "a few days" blank on purpose. It never answers the emergency check for the user.
- **Follow-up details are recorded, not scored.**
- **It cannot rule out an emergency.** Monitor only means no rule fired.
- **Not machine learning.** The safety checker and Smart Fill are hand-written rule systems. Only the optional wording feature uses a generative model.
- Emergency numbers and crisis helplines should be checked for your country.
- Not tested with a screen reader or on every browser and phone.

## Future scope

- Clinical review of the rules by a qualified professional, with a cited source for each rule.
- Smart Fill that understands more phrasing, other languages (Hindi, Marathi), and spelling mistakes.
- Emergency numbers chosen by country.
- Accessibility testing with assistive technology, and usability testing with real users.
- A privacy and security review before any real-world use.
