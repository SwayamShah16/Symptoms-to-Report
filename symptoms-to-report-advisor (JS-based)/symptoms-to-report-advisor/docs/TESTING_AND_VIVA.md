# Testing, demo script and viva preparation

## 1. Five realistic test cases

Enter these by hand, or use Smart Fill with the sentence shown. The rule tests in `tests/test-rules.js` (TC1 to TC5) run them automatically.

| # | Emergency check | Age | Symptoms | Duration | Severity | Worsening | Other | Expected result |
|---|---|---|---|---|---|---|---|---|
| TC1 | "None of these apply" | 18 to 64 | Sore throat, cough, fatigue | 1 to 3 days | Mild | No | none | **Monitor.** Says no rule suggested urgent care and that this does not rule out a problem. |
| TC2 | "None of these apply" | 18 to 64 | Fever, body aches, headache | 4 to 7 days | Moderate | No | Temperature 38.6 C | **Soon.** Rule `S-FEVER-DURATION`. |
| TC3 | Tick **Chest pain or pressure** | 18 to 64 | Fatigue | Less than 24 hours | Mild | No | none | **Emergency.** Red alert appears the moment the box is ticked. Mild severity does not downgrade it. |
| TC4 | "None of these apply" | Under 3 months | Fever | Less than 24 hours | Mild | No | none | **Urgent.** Rule `U-INFANT`. |
| TC5 | "None of these apply" | 18 to 64 | Vomiting, diarrhea, dizziness | 1 to 3 days | Moderate | Yes | none | **Urgent.** Rule `U-WORSENING-MODERATE` (and `S-FLUID-LOSS` is also listed). |

## 2. Smart Fill test sentences

Paste each into the Smart Fill box and press "Fill the form for me".

| Sentence | Expected |
|---|---|
| I have had a fever of 38.6 C and a dry cough for 5 days. I feel very tired. It is getting worse. | Fever, cough, fatigue ticked. Duration 4 to 7 days. Worsening yes. Temperature 38.6 C. Who: myself. |
| My 2 year old daughter has loose motions since last night. | Diarrhea. Duration less than 24 hours. Age 3 months to 12 years. Who: someone else. |
| Sore throat and runny nose since yesterday, mild, no fever. | Sore throat and runny nose, but **not** fever. Duration 1 to 3 days. Severity mild. |
| chest pain and I can't breathe | Two emergency signs ticked, live alert shown. "None of these apply" is **not** ticked. |
| dizzy for a few days | Dizziness ticked. Duration left blank with a message to choose it yourself. |

## 3. Extra checks worth showing

- **Validation:** press "Create my report" on an empty form. An error summary links to each problem.
- **Unanswered emergency question:** Smart Fill never answers it for you, and the form will not submit until you do.
- **"Not sure":** choosing "I am not sure" in the emergency check gives Urgent.
- **Safety cannot be downgraded:** TC3 with severity Mild is still Emergency.
- **Safety guide page:** open it from the menu. Every rule is listed in a table.
- **Search and follow-ups:** type "cou" in the symptom search. Tick vomiting and notice the follow-up questions appear.
- **Comparison:** make a second assessment in the same tab. The report shows what changed.
- **Export:** Copy as text, Download as text, and Print / Save as PDF.
- **Text size:** the A, A+ and A++ buttons.
- **Offline:** turn off Wi-Fi and repeat TC1.

## 4. Four-minute demonstration script

1. **(20 s) Problem.** "Appointments are short and people forget details. This turns symptoms into a clear report and shows when not to wait."
2. **(20 s) Home.** Point to the emergency banner and the safety notice.
3. **(50 s) Smart Fill.** Paste the first sentence from section 2. "It fills the form in my browser. It is free, works offline and sends nothing." Point to the "what I picked up" list and the evidence. "It never answers the emergency check for me."
4. **(40 s) Emergency check.** Tick *Chest pain or pressure*. "The alert appears immediately." Untick it, then choose "None of these apply".
5. **(40 s) Report.** Create the report. Show the level ladder and "How this guidance was decided" with rule `S-FEVER-DURATION`. "Every decision is explainable."
6. **(30 s) Safety guide.** Open it. "Every rule is listed here, generated from the same data the rules use."
7. **(30 s) Export.** Print / Save as PDF, then Copy as text.
8. **(30 s) Honesty and AI.** "The safety check and Smart Fill are hand-written rules, not machine learning, and are not clinically validated. Optional AI can improve wording only, never changes the guidance, and is skipped for emergencies."

## 5. Likely viva questions and answers

**Q1. Where is the AI in this project?**
Three places, labelled honestly. The safety checker is a rule-based expert system, which is classic symbolic AI. Smart Fill is a natural-language rule system that reads plain English with patterns. The optional wording feature uses a generative model (Gemini or Anthropic). None of the first two is machine learning, and I do not claim they are.

**Q2. Why rules for safety instead of machine learning?**
Rules are transparent, testable and explainable. Every outcome traces to a named rule, and the Safety guide page lists them all. I also had no validated clinical dataset, and a model I could not explain would be risky for a safety decision.

**Q3. How does Smart Fill work, and how do you stop it making mistakes?**
It lowercases the text and matches everyday words, such as "loose motions" for diarrhea. It skips symptoms after a negation word ("no fever"), reads numbers and units for duration and temperature, and chooses the more severe word if several appear. It shows what it picked up with the matched words so the person can check. It leaves vague answers blank, such as "a few days", rather than guessing. It never answers "None of these apply" for the user.

**Q4. Is this a diagnosis tool?**
No. It never names a disease. It organises what the user entered and gives general guidance on how soon to seek care.

**Q5. How do you make sure an emergency is never missed or downgraded?**
Emergency rules run first and the highest level always wins. The result is frozen, and AI code only receives text to rewrite. For emergencies the AI is not called at all. A calm result never rules out an emergency, and the app says so. A live alert appears as soon as a warning sign is ticked or typed.

**Q6. What if the user does not know whether they have a warning sign?**
"I am not sure" gives Urgent, and the emergency question is mandatory. A missing answer is never treated as "no warning signs".

**Q7. Where did your rules come from?**
From widely published public-health warning signs (for example stroke, heart, breathing, severe allergy) and common care-seeking conventions. They are not clinically validated. Where I could not support a threshold I left it out, for example there is no numeric temperature rule.

**Q8. How can it be used on a website for free?**
The core is plain static files, so it hosts free on GitHub Pages or Netlify, and Smart Fill and the safety check work there. For optional AI wording, Vercel's free plan can run the `api/` functions with a free Gemini key stored as an environment variable.

**Q9. How is the AI key kept secret, and is the free key safe for health data?**
The key lives only in a server environment variable, never in browser code. The free Gemini tier may let Google use requests to improve its products, so the README says not to use real patient details. Medicines, allergies and conditions are never sent, and AI is opt-in.

**Q10. What stops the AI saying something harmful?**
The prompt forbids diagnosis, medicines, doses and reassurance. The reply is also checked in the browser for shape, length, doses, prescribing, "you probably have" and reassurance wording. If it fails the check, or the API fails, the app uses the local text.

**Q11. How did you test it?**
40 automated tests of the rules, a fuzz test of 4000 random inputs checking every rule that fires is listed in the Safety guide, 15 tests for Smart Fill, and tests of the AI filter. I also tested the interface in a simulated browser (forms, validation, emergency alerts, Smart Fill, search, follow-ups, export, comparison, print call), and the AI server and serverless functions against mock AI services. I did not test the real AI services, real browsers on several devices, or a screen reader.

**Q12. What are the biggest limitations?**
Not clinically validated, an incomplete warning-sign list, simple phrase matching that ignores negation for emergencies, Smart Fill can misread unusual wording, and duration cut-offs are conventions.

**Q13. What would you do next?**
Clinical review with a cited source for each rule, Smart Fill in Hindi and Marathi, emergency numbers by country, and accessibility and usability testing.

## 6. Final checklist

**Works, and tested by me**
- [x] Safety rules for every sign, free-text wording, "not sure", and all four levels (40 tests plus a 4000-input fuzz test)
- [x] Smart Fill on sample sentences, including negation, children, emergencies and vague durations (15 tests)
- [x] Home, Safety guide, form, report views and navigation, in a simulated browser (48 checks)
- [x] Validation, live emergency alert, progress, symptom search, follow-up questions, who-for and background fields
- [x] Report: ladder, glance, comparison with the previous assessment, checklist, notes space, reference
- [x] Print button calls `window.print()`, Copy as text, Download as text
- [x] Optional AI: opt-in box, skipped for emergencies, unsafe or failed replies fall back, Gemini and Anthropic paths, serverless handlers (all against mock services)

**Not verified by me, so please check yourself**
- [ ] The visual design and the printed PDF layout (open the page and use Print preview)
- [ ] Safari, Firefox and phones
- [ ] Screen reader use
- [ ] The real Gemini or Anthropic services. Only mock versions were tested. Model names can change, so set `GEMINI_MODEL` if the default is rejected.
- [ ] A real Vercel, GitHub Pages or Netlify deployment
- [ ] Emergency and crisis numbers for your country

**Requires configuration (optional)**
- [ ] AI wording: a free Gemini key from aistudio.google.com/app/apikey, set as `GEMINI_API_KEY`

**Incomplete by design**
- [ ] Clinical validation of the rules
- [ ] Negation-aware emergency matching
- [ ] Languages other than English
