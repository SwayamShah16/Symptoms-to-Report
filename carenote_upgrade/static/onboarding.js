(function () {
  "use strict";
  var form = document.getElementById("onboard-form");
  if (!form) return;
  var steps = [].slice.call(form.querySelectorAll(".ob-step"));
  var tabs = [].slice.call(form.querySelectorAll("[data-go]"));
  var back = document.getElementById("ob-back"), next = document.getElementById("ob-next"), save = document.getElementById("ob-save");
  var fill = document.getElementById("ob-fill"), cur = 0, reached = 0;
  form.classList.add("is-stepper");
  function $(id) { return document.getElementById(id); }
  function val(n) { var e = form.elements[n]; return e ? String(e.value || "").trim() : ""; }
  function checked(n) { return [].slice.call(form.querySelectorAll('[name="' + n + '"]:checked')).map(function (e) { return e.value; }); }
  function age(dob) {
    var d = new Date(dob); if (isNaN(d)) return null;
    var t = new Date(), a = t.getFullYear() - d.getFullYear(), m = t.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && t.getDate() < d.getDate())) a--;
    return a >= 0 && a <= 120 ? a : null;
  }
  function tags(el, items, empty) {
    el.textContent = "";
    if (!items.length) { var em = document.createElement("em"); em.textContent = empty; el.appendChild(em); return; }
    items.forEach(function (t) { var s = document.createElement("span"); s.textContent = t; el.appendChild(s); });
  }
  function render() {
    var name = val("preferred_name"), a = age(val("dob")), sex = val("sex");
    $("pp-name").textContent = name || "Your name";
    $("pp-avatar").textContent = name ? name.charAt(0).toUpperCase() : "?";
    $("pp-meta").textContent = [a !== null ? a + " years" : "", sex].filter(Boolean).join(" · ") || "Age and sex appear here";
    var h = parseFloat(val("height_cm")), w = parseFloat(val("weight_kg")), bmiEl = $("pp-bmi"), dot = $("pp-bmi-dot");
    if (h >= 50 && h <= 250 && w >= 2 && w <= 500) {
      var b = w / Math.pow(h / 100, 2), cat = b < 18.5 ? "Underweight" : b < 25 ? "Healthy weight range" : b < 30 ? "Overweight range" : "Obesity range";
      bmiEl.textContent = b.toFixed(1) + " · " + cat;
      dot.style.left = Math.max(0, Math.min(100, (Math.min(40, Math.max(14, b)) - 14) / 26 * 100)) + "%";
    } else { bmiEl.textContent = "Add height and weight"; dot.style.left = "-10px"; }
    $("pp-blood").textContent = val("blood_group") || "Not added";
    var conds = form.elements.no_conditions.checked ? ["None reported"] : checked("conditions").concat(val("other_conditions") ? [val("other_conditions")] : []);
    tags($("pp-cond"), conds, "Not added");
    $("pp-allergy").textContent = form.elements.no_allergies.checked ? "None reported" : (val("allergies") || "Not added");
    var meds = val("medication_list").split("\n").filter(function (l) { return l.trim(); }).length;
    $("pp-meds").textContent = form.elements.no_medications.checked ? "None" : (meds ? meds + " listed" : "Not added");
    var life = []; ["smoking", "alcohol", "activity"].forEach(function (n) { var c = checked(n)[0]; if (c) life.push({ smoking: "Smoking: ", alcohol: "Alcohol: ", activity: "" }[n] + c); });
    if (val("sleep_hours")) life.push(val("sleep_hours") + " h sleep");
    tags($("pp-life"), life, "Not added");
    $("pp-emerg").textContent = val("emergency_name") ? val("emergency_name") + (val("emergency_phone") ? " · " + val("emergency_phone") : "") : "Not added";
    var answered = [name, a !== null, sex, h && w, val("blood_group"), conds.length, form.elements.no_allergies.checked || val("allergies"), form.elements.no_medications.checked || meds, checked("smoking")[0] || checked("activity")[0], val("emergency_name") && val("emergency_phone")].filter(Boolean).length;
    var pct = Math.round(answered * 10);
    $("pp-ring").style.setProperty("--pct", pct); $("pp-pct").textContent = pct + "%";
  }
  function error(i, msg) { var e = steps[i].querySelector(".ob-error"); if (!e) return; e.textContent = msg || ""; e.hidden = !msg; }
  function valid(i) {
    if (i === 0) {
      if (!val("preferred_name")) { error(0, "Tell us what to call you."); form.elements.preferred_name.focus(); return false; }
      if (age(val("dob")) === null) { error(0, "Enter a valid date of birth."); form.elements.dob.focus(); return false; }
      error(0, "");
    }
    if (i === 4 && !form.elements.consent.checked) { error(4, "Please tick the consent box to create your passport."); form.elements.consent.focus(); return false; }
    return true;
  }
  function show(i, silent) {
    cur = i; reached = Math.max(reached, i);
    steps.forEach(function (s, k) { s.hidden = k !== i; });
    tabs.forEach(function (t, k) { if (k === i) t.setAttribute("aria-current", "step"); else t.removeAttribute("aria-current"); t.classList.toggle("done", k < i); t.disabled = k > reached; });
    fill.style.width = ((i + 1) / steps.length * 100) + "%";
    back.hidden = i === 0; next.hidden = i === steps.length - 1; save.hidden = i !== steps.length - 1;
    if (silent) return;
    var f = steps[i].querySelector("input:not([type=checkbox]):not([type=radio]),select,textarea"); if (f && window.matchMedia("(min-width:901px)").matches) f.focus({ preventScroll: true });
    form.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion:reduce)").matches ? "auto" : "smooth", block: "start" });
  }
  next.addEventListener("click", function () { if (valid(cur)) show(Math.min(cur + 1, steps.length - 1)); });
  back.addEventListener("click", function () { show(Math.max(cur - 1, 0)); });
  tabs.forEach(function (t) { t.addEventListener("click", function () { var k = +t.getAttribute("data-go"); if (k <= reached && (k < cur || valid(cur))) show(k); }); });
  form.addEventListener("keydown", function (e) { if (e.key === "Enter" && e.target.tagName === "INPUT" && e.target.type !== "checkbox" && cur < steps.length - 1) { e.preventDefault(); next.click(); } });
  form.addEventListener("submit", function (e) { if (!valid(0)) { e.preventDefault(); show(0); } else if (!valid(4)) { e.preventDefault(); show(4); } });
  form.addEventListener("input", render); form.addEventListener("change", render);
  var none = [["no_conditions", ["conditions", "other_conditions"]], ["no_allergies", ["allergies"]], ["no_medications", ["medication_list"]]];
  none.forEach(function (p) { form.elements[p[0]].addEventListener("change", function () { if (this.checked) p[1].forEach(function (n) { [].slice.call(form.querySelectorAll('[name="' + n + '"]')).forEach(function (el) { if (el.type === "checkbox") el.checked = false; else el.value = ""; }); }); render(); }); });
  [["no_conditions", ["conditions", "other_conditions"]], ["no_allergies", ["allergies"]], ["no_medications", ["medication_list"]]].forEach(function (p) {
    p[1].forEach(function (n) { [].slice.call(form.querySelectorAll('[name="' + n + '"]')).forEach(function (el) { el.addEventListener("input", function () { if (el.type === "checkbox" ? el.checked : el.value) form.elements[p[0]].checked = false; render(); }); el.addEventListener("change", function () { if (el.type === "checkbox" && el.checked) form.elements[p[0]].checked = false; render(); }); }); });
  });
  render(); show(0, true);
})();
