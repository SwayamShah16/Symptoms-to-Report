(() => {
  const translations = {
    en: {dashboard:'Dashboard',newReport:'New report',history:'History',model:'Model & safety',profile:'Profile',signOut:'Sign out',signIn:'Sign in',getStarted:'Get started'},
    hi: {dashboard:'डैशबोर्ड',newReport:'नई रिपोर्ट',history:'इतिहास',model:'मॉडल और सुरक्षा',profile:'प्रोफ़ाइल',signOut:'साइन आउट',signIn:'साइन इन',getStarted:'शुरू करें'},
    mr: {dashboard:'डॅशबोर्ड',newReport:'नवीन अहवाल',history:'इतिहास',model:'मॉडेल आणि सुरक्षितता',profile:'प्रोफाइल',signOut:'साइन आउट',signIn:'साइन इन',getStarted:'सुरू करा'}
  };
  const language = document.documentElement.lang || 'en';
  document.querySelectorAll('[data-i18n]').forEach(el => { const key = el.dataset.i18n; if (translations[language]?.[key]) el.textContent = translations[language][key]; });

  document.querySelectorAll('form[data-confirm]').forEach(form => form.addEventListener('submit', event => { if (!window.confirm(form.dataset.confirm)) event.preventDefault(); }));
  const form = document.getElementById('symptom-wizard');
  if (!form) return;
  const steps = [...form.querySelectorAll('[data-step]')];
  const indicators = [...form.querySelectorAll('[data-step-indicator]')];
  const back = document.getElementById('wizard-back');
  const next = document.getElementById('wizard-next');
  const submit = document.getElementById('wizard-submit');
  const search = document.getElementById('symptom-search');
  const cards = [...form.querySelectorAll('.symptom-option')];
  let step = 0, category = 'all';
  const selected = () => [...form.querySelectorAll('input[name="symptoms"]:checked')];
  function count() { const el=document.getElementById('selected-count'); if(el) el.textContent=selected().length; }
  function filterSymptoms() {
    const query=(search?.value||'').trim().toLowerCase();
    cards.forEach(card => { card.hidden = !(card.dataset.label.includes(query) && (category==='all'||card.dataset.category===category)); });
  }
  function updateReview() {
    const chosen=selected().map(input=>input.closest('label').querySelector('span:last-child').textContent.trim());
    const sym=document.getElementById('review-symptoms'); if(sym) sym.innerHTML='';
    if(sym) { if(chosen.length) chosen.forEach(name=>{const chip=document.createElement('span');chip.className='symptom-chip';chip.textContent=name;sym.appendChild(chip);}); else sym.textContent='No symptoms selected'; }
    const duration=form.querySelector('[name="duration"]')?.value || 'Not provided';
    const severity=form.querySelector('[name="severity"]:checked')?.value || 'unsure';
    const progression=form.querySelector('[name="progression"]')?.selectedOptions[0]?.textContent || 'Not sure';
    document.getElementById('review-duration').textContent=duration;
    document.getElementById('review-severity').textContent=severity.charAt(0).toUpperCase()+severity.slice(1);
    document.getElementById('review-progression').textContent=progression;
  }
  function showStep(index) {
    step=Math.max(0,Math.min(steps.length-1,index));
    steps.forEach((el,i)=>el.classList.toggle('active',i===step));
    indicators.forEach((el,i)=>{el.classList.toggle('active',i===step);el.classList.toggle('complete',i<step);});
    back.hidden=step===0; next.hidden=step===steps.length-1; submit.hidden=step!==steps.length-1;
    if(step===2) updateReview();
    window.scrollTo({top:0,behavior:'smooth'});
  }
  next.addEventListener('click',()=>{ if(step===0 && !selected().length){const first=form.querySelector('.symptom-option input'); first?.focus(); alert('Select at least one symptom to continue.');return;} showStep(step+1); });
  back.addEventListener('click',()=>showStep(step-1));
  form.querySelectorAll('input[name="symptoms"]').forEach(el=>el.addEventListener('change',count));
  document.getElementById('clear-symptoms')?.addEventListener('click',()=>{form.querySelectorAll('input[name="symptoms"]').forEach(el=>el.checked=false);count();});
  search?.addEventListener('input',filterSymptoms);
  form.querySelectorAll('[data-category]').forEach(btn=>btn.addEventListener('click',()=>{category=btn.dataset.category;form.querySelectorAll('.category-tab').forEach(b=>b.classList.toggle('active',b===btn));filterSymptoms();}));
  form.addEventListener('submit',e=>{if(!selected().length){e.preventDefault();showStep(0);alert('Select at least one symptom before creating the summary.');}});
  count(); filterSymptoms(); showStep(0);
})();
