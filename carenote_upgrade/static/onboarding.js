(() => {
  "use strict";

  const form = document.getElementById("onboard-form");
  if (!form) return;

  const steps = [...form.querySelectorAll(".ob-step")];
  const tabs = [...form.querySelectorAll("[data-go]")];
  const back = document.getElementById("ob-back");
  const next = document.getElementById("ob-next");
  const save = document.getElementById("ob-save");
  const fill = document.getElementById("ob-fill");
  let currentStep = 0;
  let furthestStep = 0;

  form.classList.add("is-stepper");

  function value(name) {
    const field = form.elements[name];
    return field ? String(field.value || "").trim() : "";
  }

  function ageFrom(dob) {
    const birthDate = new Date(dob);
    if (Number.isNaN(birthDate.getTime())) return null;

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age -= 1;
    }
    return age >= 0 && age <= 120 ? age : null;
  }

  function setError(stepIndex, message) {
    const error = steps[stepIndex].querySelector(".ob-error");
    if (!error) return;
    error.textContent = message || "";
    error.hidden = !message;
  }

  function isValid(stepIndex) {
    if (stepIndex === 0) {
      if (!value("preferred_name")) {
        setError(0, "Tell us what to call you.");
        form.elements.preferred_name.focus();
        return false;
      }
      if (ageFrom(value("dob")) === null) {
        setError(0, "Enter a valid date of birth.");
        form.elements.dob.focus();
        return false;
      }
      setError(0, "");
    }

    if (stepIndex === 4 && !form.elements.consent.checked) {
      setError(4, "Please tick the consent box to create your passport.");
      form.elements.consent.focus();
      return false;
    }
    return true;
  }

  function showStep(stepIndex, silent = false) {
    currentStep = stepIndex;
    furthestStep = Math.max(furthestStep, stepIndex);
    steps.forEach((step, index) => { step.hidden = index !== stepIndex; });
    tabs.forEach((tab, index) => {
      if (index === stepIndex) tab.setAttribute("aria-current", "step");
      else tab.removeAttribute("aria-current");
      tab.classList.toggle("done", index < stepIndex);
      tab.disabled = index > furthestStep;
    });

    fill.style.width = `${((stepIndex + 1) / steps.length) * 100}%`;
    back.hidden = stepIndex === 0;
    next.hidden = stepIndex === steps.length - 1;
    save.hidden = stepIndex !== steps.length - 1;
    if (silent) return;

    const firstField = steps[stepIndex].querySelector(
      'input:not([type="checkbox"]):not([type="radio"]),select,textarea',
    );
    if (firstField && window.matchMedia("(min-width:901px)").matches) {
      firstField.focus({ preventScroll: true });
    }
    form.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion:reduce)").matches ? "auto" : "smooth",
      block: "start",
    });
  }

  next.addEventListener("click", () => {
    if (isValid(currentStep)) showStep(Math.min(currentStep + 1, steps.length - 1));
  });
  back.addEventListener("click", () => showStep(Math.max(currentStep - 1, 0)));
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const stepIndex = Number(tab.getAttribute("data-go"));
      if (stepIndex <= furthestStep && (stepIndex < currentStep || isValid(currentStep))) {
        showStep(stepIndex);
      }
    });
  });

  form.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && event.target.tagName === "INPUT" && event.target.type !== "checkbox" && currentStep < steps.length - 1) {
      event.preventDefault();
      next.click();
    }
  });
  form.addEventListener("submit", (event) => {
    if (!isValid(0)) {
      event.preventDefault();
      showStep(0);
    } else if (!isValid(4)) {
      event.preventDefault();
      showStep(4);
    }
  });

  const exclusiveFields = [
    ["no_conditions", ["conditions", "other_conditions"]],
    ["no_allergies", ["allergies"]],
    ["no_medications", ["medication_list"]],
  ];
  exclusiveFields.forEach(([noneFieldName, fieldNames]) => {
    const noneField = form.elements[noneFieldName];
    noneField.addEventListener("change", () => {
      if (!noneField.checked) return;
      fieldNames.forEach((name) => {
        form.querySelectorAll(`[name="${name}"]`).forEach((field) => {
          if (field.type === "checkbox") field.checked = false;
          else field.value = "";
        });
      });
    });

    fieldNames.forEach((name) => {
      form.querySelectorAll(`[name="${name}"]`).forEach((field) => {
        const clearNoneChoice = () => {
          if (field.type === "checkbox" ? field.checked : field.value) noneField.checked = false;
        };
        field.addEventListener("input", clearNoneChoice);
        field.addEventListener("change", clearNoneChoice);
      });
    });
  });

  showStep(0, true);
})();
