(() => {
  // UI translation catalog. The selected language is server-rendered on <html lang>.
  // Translate text throughout every page, including labels, descriptions, buttons,
  // placeholders, option labels, and dynamically inserted UI text—not just navigation.
  const catalog = {
    en: {},
    hi: {
      "YOUR HEALTH, ORGANIZED": "आपका स्वास्थ्य, व्यवस्थित",
      "A local-first symptom organization tool":
        "लक्षणों को व्यवस्थित करने का स्थानीय टूल",
      "Not a diagnostic tool. For severe, sudden, or worsening symptoms, seek urgent medical care.":
        "यह निदान का उपकरण नहीं है। गंभीर, अचानक या बढ़ते लक्षणों पर तुरंत चिकित्सा सहायता लें।",
      Dashboard: "डैशबोर्ड",
      "New report": "नई रिपोर्ट",
      "New symptom report": "नई लक्षण रिपोर्ट",
      "New symptom summary": "नई लक्षण-सारांश रिपोर्ट",
      "Health records": "स्वास्थ्य रिकॉर्ड",
      History: "इतिहास",
      "Model & safety": "मॉडल और सुरक्षा",
      Profile: "प्रोफ़ाइल",
      "Sign out": "साइन आउट",
      "Sign in": "साइन इन",
      "Get started": "शुरू करें",
      Language: "भाषा",
      "YOUR WORKSPACE": "आपका कार्यक्षेत्र",
      "Good to see you.": "आपसे फिर मिलकर अच्छा लगा।",
      "Keep your symptom notes organized and ready when you need them.":
        "अपने लक्षणों के नोट व्यवस्थित रखें, ताकि ज़रूरत पड़ने पर आसानी से मिलें।",
      "Saved reports": "सहेजी गई रिपोर्टें",
      "Across your history": "आपके पूरे इतिहास में",
      "Recent activity": "हाल की गतिविधि",
      "Latest reports shown below": "नीचे नवीनतम रिपोर्टें दिखाई गई हैं",
      "Local model": "स्थानीय मॉडल",
      Available: "उपलब्ध",
      "Not configured": "कॉन्फ़िगर नहीं है",
      "Dataset-backed classifier loaded": "डेटासेट-आधारित क्लासिफ़ायर लोड है",
      "Intake works; add source dataset for ML":
        "जानकारी दर्ज करना उपलब्ध है; ML के लिए मूल डेटासेट जोड़ें",
      "Recent symptom reports": "हाल की लक्षण रिपोर्टें",
      "Your latest saved summaries": "आपके नवीनतम सहेजे गए सारांश",
      "View all →": "सभी देखें →",
      "Your notebook starts here": "आपकी नोटबुक यहाँ से शुरू होती है",
      "Create your first symptom summary to begin building a useful timeline.":
        "उपयोगी समयरेखा बनाने के लिए अपना पहला लक्षण-सारांश बनाएँ।",
      "Create first report": "पहली रिपोर्ट बनाएँ",
      "Your reporting patterns": "आपकी रिपोर्ट का पैटर्न",
      "Counts from saved notes only": "केवल सहेजे गए नोट्स की गिनती",
      "Self-reported severity": "स्वयं बताई गई गंभीरता",
      "Most recorded symptoms": "सबसे अधिक दर्ज लक्षण",
      "These charts describe your entries, not clinical risk or disease progression.":
        "ये चार्ट आपकी दर्ज जानकारी दिखाते हैं, चिकित्सकीय जोखिम या बीमारी की प्रगति नहीं।",
      "Your trends will appear as you save reports.":
        "रिपोर्टें सहेजने पर आपके रुझान यहाँ दिखेंगे।",
      "Open health records & trackers": "स्वास्थ्य रिकॉर्ड और ट्रैकर खोलें",
      "Browse report history": "रिपोर्ट इतिहास देखें",
      "Read model limitations": "मॉडल की सीमाएँ पढ़ें",
      "YOUR PERSONAL HEALTH LOG": "आपका निजी स्वास्थ्य लॉग",
      "Save measurements, symptom changes, medication details, and questions for your next appointment. Records stay attached to your account.":
        "माप, लक्षणों में बदलाव, दवाओं का विवरण और अगली मुलाकात के प्रश्न सहेजें। रिकॉर्ड आपके खाते से जुड़े रहेंगे।",
      "Create symptom report →": "लक्षण रिपोर्ट बनाएँ →",
      "How this works": "यह कैसे काम करता है",
      "Save each entry below. When you create a symptom report, recent saved health records are added to the report snapshot and its PDF. This is a personal record—not a diagnosis or a treatment recommendation.":
        "नीचे प्रत्येक प्रविष्टि सहेजें। लक्षण रिपोर्ट बनाते समय हाल के स्वास्थ्य रिकॉर्ड रिपोर्ट और PDF में जोड़े जाते हैं। यह निजी रिकॉर्ड है—निदान या उपचार की सलाह नहीं।",
      "BMI calculator": "BMI कैलकुलेटर",
      "Height, weight, BMI and adult category":
        "लंबाई, वज़न, BMI और वयस्क श्रेणी",
      "Height (cm)": "लंबाई (सेमी)",
      "Weight (kg)": "वज़न (किग्रा)",
      "Measurement date": "माप की तारीख",
      "BMI is a screening measure. Adult categories are not intended for children and teenagers.":
        "BMI एक प्रारंभिक स्क्रीनिंग माप है। वयस्क श्रेणियाँ बच्चों और किशोरों के लिए नहीं हैं।",
      "Calculate & save BMI": "BMI की गणना करें और सहेजें",
      "Blood pressure": "रक्तचाप",
      "Save systolic and diastolic readings":
        "सिस्टोलिक और डायस्टोलिक रीडिंग सहेजें",
      "Systolic (mmHg)": "सिस्टोलिक (mmHg)",
      "Diastolic (mmHg)": "डायस्टोलिक (mmHg)",
      "Reading date": "रीडिंग की तारीख",
      "Save blood pressure": "रक्तचाप सहेजें",
      "Temperature log": "तापमान लॉग",
      "Enter Celsius or Fahrenheit; view the conversion":
        "सेल्सियस या फ़ारेनहाइट दर्ज करें और रूपांतरण देखें",
      Temperature: "तापमान",
      Unit: "इकाई",
      "°C Celsius": "°C सेल्सियस",
      "°F Fahrenheit": "°F फ़ारेनहाइट",
      "Enter a value to see the conversion.":
        "रूपांतरण देखने के लिए मान दर्ज करें।",
      "Save temperature": "तापमान सहेजें",
      "Pulse-rate tracker": "नाड़ी दर ट्रैकर",
      "Record your heart rate in beats per minute":
        "अपनी हृदय गति प्रति मिनट धड़कनों में दर्ज करें",
      "Heart rate (BPM)": "हृदय गति (BPM)",
      "Save pulse rate": "नाड़ी दर सहेजें",
      "Symptom timeline": "लक्षण समयरेखा",
      "Record what changed, severity, and duration":
        "बदलाव, गंभीरता और अवधि दर्ज करें",
      Symptom: "लक्षण",
      Severity: "गंभीरता",
      "Choose severity": "गंभीरता चुनें",
      Mild: "हल्का",
      Moderate: "मध्यम",
      Severe: "गंभीर",
      Unsure: "निश्चित नहीं",
      Duration: "अवधि",
      Date: "तारीख",
      "Additional notes": "अतिरिक्त नोट्स",
      "Add timeline entry": "समयरेखा प्रविष्टि जोड़ें",
      "Medication list": "दवाओं की सूची",
      "Keep a record of medicines as prescribed":
        "निर्देशानुसार दवाओं का रिकॉर्ड रखें",
      "Medication name": "दवा का नाम",
      "Dosage as prescribed": "निर्धारित खुराक",
      Schedule: "समय-सारणी",
      "Date added": "जोड़ने की तारीख",
      "CareNote does not recommend medicines or doses. Follow your clinician’s instructions.":
        "CareNote दवाओं या खुराक की सलाह नहीं देता। अपने स्वास्थ्य-विशेषज्ञ के निर्देशों का पालन करें।",
      "Save medication": "दवा सहेजें",
      "Appointment preparation": "डॉक्टर से मुलाकात की तैयारी",
      "Keep your questions ready for the doctor":
        "डॉक्टर के लिए अपने प्रश्न तैयार रखें",
      "Questions for your appointment": "मुलाकात के लिए प्रश्न",
      "Save appointment questions": "मुलाकात के प्रश्न सहेजें",
      "Saved health records": "सहेजे गए स्वास्थ्य रिकॉर्ड",
      "recent entries · newest first": "हाल की प्रविष्टियाँ · नई सबसे पहले",
      "Your health log is ready": "आपका स्वास्थ्य लॉग तैयार है",
      "Save a measurement, symptom, medication, or appointment question above. Your saved entries will appear here.":
        "ऊपर कोई माप, लक्षण, दवा या मुलाकात का प्रश्न सहेजें। आपकी प्रविष्टियाँ यहाँ दिखाई देंगी।",
      Delete: "हटाएँ",
      "Make sense of your symptoms.": "अपने लक्षणों को बेहतर समझें।",
      "Prepare for better conversations.":
        "स्वास्थ्य-विशेषज्ञ से बेहतर बातचीत की तैयारी करें।",
      "Organize what you’re feeling, track changes over time, and create a clear summary to discuss with a healthcare professional.":
        "अपने लक्षण व्यवस्थित करें, समय के साथ बदलाव दर्ज करें और स्वास्थ्य-विशेषज्ञ से चर्चा के लिए स्पष्ट सारांश बनाएँ।",
      "Create your workspace": "अपना कार्यक्षेत्र बनाएँ",
      "How the model works →": "मॉडल कैसे काम करता है →",
      "No external AI API": "बाहरी AI API नहीं",
      "You control saved reports": "सहेजी गई रिपोर्टों पर आपका नियंत्रण",
      "Exportable summaries": "निर्यात योग्य सारांश",
      "Symptom overview": "लक्षणों का अवलोकन",
      "Personal health notes": "निजी स्वास्थ्य नोट्स",
      "HOW HAVE YOU BEEN FEELING?": "आप कैसा महसूस कर रहे हैं?",
      Fatigue: "थकान",
      Headache: "सिरदर्द",
      "+ Add symptom": "+ लक्षण जोड़ें",
      "SEVERITY OVER TIME": "समय के साथ गंभीरता",
      "Illustrative only": "केवल उदाहरण",
      "Ready to share": "साझा करने के लिए तैयार",
      "Clear, structured summary": "स्पष्ट, व्यवस्थित सारांश",
      "Guided symptom intake": "निर्देशित लक्षण प्रविष्टि",
      "Capture symptoms, duration, severity, and progression in a calm, step-by-step flow.":
        "सरल चरणों में लक्षण, अवधि, गंभीरता और बदलाव दर्ज करें।",
      "Track your history": "अपना इतिहास ट्रैक करें",
      "Review saved summaries and notice changes in what you have reported over time.":
        "सहेजे गए सारांश देखें और समय के साथ दर्ज बदलावों पर ध्यान दें।",
      "Shareable reports": "साझा करने योग्य रिपोर्टें",
      "Export a print-friendly PDF designed to support—not replace—a clinical conversation.":
        "ऐसा PDF निर्यात करें जो चिकित्सकीय बातचीत में मदद करे, उसका विकल्प न बने।",
      "Transparent ML": "पारदर्शी ML",
      "Inspect dataset limitations and model evaluation rather than mistaking a label for a diagnosis.":
        "किसी लेबल को निदान समझने के बजाय डेटासेट की सीमाएँ और मॉडल मूल्यांकन देखें।",
      "Built for organization, not diagnosis.":
        "व्यवस्थित करने के लिए बनाया गया, निदान के लिए नहीं।",
      "CareNote is an educational prototype. Its model and warning checklist are not clinically validated and cannot determine whether you are safe.":
        "CareNote एक शैक्षणिक प्रोटोटाइप है। इसका मॉडल और चेतावनी सूची चिकित्सकीय रूप से प्रमाणित नहीं हैं और आपकी सुरक्षा तय नहीं कर सकते।",
      "Read safety notes →": "सुरक्षा संबंधी जानकारी पढ़ें →",
      "Report history": "रिपोर्ट इतिहास",
      "Find, review, export, or remove a saved symptom summary.":
        "सहेजे गए लक्षण-सारांश खोजें, देखें, निर्यात करें या हटाएँ।",
      "Search reports": "रिपोर्ट खोजें",
      Search: "खोजें",
      Clear: "साफ़ करें",
      "No matching reports": "कोई मिलती-जुलती रिपोर्ट नहीं",
      "No reports yet": "अभी कोई रिपोर्ट नहीं",
      "Try another search term. Your saved summaries will appear here.":
        "कोई दूसरा शब्द खोजें। आपके सहेजे गए सारांश यहाँ दिखेंगे।",
      "Understand the model.": "मॉडल को समझें।",
      "What this application can do, what it cannot do, and where its data comes from.":
        "यह ऐप क्या कर सकता है, क्या नहीं कर सकता और इसका डेटा कहाँ से आता है।",
      "Not a diagnostic tool": "यह निदान का उपकरण नहीं है",
      "CareNote is an educational prototype. A model label is a dataset classification—not a diagnosis, medical probability, or treatment recommendation. The warning-sign checklist is incomplete; a negative screen cannot rule out an emergency.":
        "CareNote एक शैक्षणिक प्रोटोटाइप है। मॉडल लेबल डेटासेट का वर्गीकरण है—निदान, चिकित्सकीय संभावना या उपचार की सलाह नहीं। चेतावनी संकेतों की सूची अधूरी है; नकारात्मक स्क्रीनिंग आपातस्थिति को खारिज नहीं करती।",
      "Dataset available": "डेटासेट उपलब्ध",
      "Local CSV required for classifier":
        "क्लासिफ़ायर के लिए स्थानीय CSV आवश्यक",
      "Unique patterns": "अद्वितीय पैटर्न",
      "After exact pattern deduplication": "एक जैसे पैटर्न हटाने के बाद",
      Classes: "वर्ग",
      "Dataset labels, not diseases diagnosed":
        "डेटासेट लेबल, निदान की गई बीमारियाँ नहीं",
      "Symptom features": "लक्षण विशेषताएँ",
      "Available in source dataset": "मूल डेटासेट में उपलब्ध",
      "Evaluation snapshot": "मूल्यांकन सारांश",
      "Held-out dataset benchmark only": "केवल अलग रखे गए डेटासेट का बेंचमार्क",
      Accuracy: "सटीकता",
      "Macro F1": "मैक्रो F1",
      "Training rows": "प्रशिक्षण पंक्तियाँ",
      "Test rows": "परीक्षण पंक्तियाँ",
      "These metrics do not establish clinical validity. A small or constructed dataset can yield unstable results and may not represent real patient encounters.":
        "ये माप चिकित्सकीय वैधता सिद्ध नहीं करते। छोटा या कृत्रिम डेटासेट अस्थिर परिणाम दे सकता है और वास्तविक मरीजों का प्रतिनिधित्व नहीं कर सकता।",
      "Classifier not loaded": "क्लासिफ़ायर लोड नहीं है",
      "Copy your original data/dataset.csv into this project’s data/ folder. Do not use synthetic rows to claim medical performance.":
        "अपनी मूल data/dataset.csv फ़ाइल इस प्रोजेक्ट के data/ फ़ोल्डर में रखें। चिकित्सकीय प्रदर्शन का दावा करने के लिए कृत्रिम पंक्तियों का उपयोग न करें।",
      "Safety by design": "डिज़ाइन में सुरक्षा",
      "Separate from the ML prediction": "ML अनुमान से अलग",
      "Independent warning checklist": "स्वतंत्र चेतावनी सूची",
      "Configured warning signs are checked separately from the classifier.":
        "निर्धारित चेतावनी संकेतों की जाँच क्लासिफ़ायर से अलग होती है।",
      "No confidence-as-diagnosis": "विश्वास-स्कोर को निदान न मानें",
      "The interface does not present classifier probabilities as medical certainty.":
        "इंटरफ़ेस क्लासिफ़ायर की संभावनाओं को चिकित्सकीय निश्चितता के रूप में नहीं दिखाता।",
      "Local-only inference": "केवल स्थानीय अनुमान",
      "No external AI API is used by this implementation.":
        "इस संस्करण में बाहरी AI API का उपयोग नहीं होता।",
      "Human clinical judgment": "मानवीय चिकित्सकीय निर्णय",
      "Qualified professionals must interpret symptoms in context.":
        "योग्य पेशेवरों को संदर्भ के साथ लक्षणों की व्याख्या करनी चाहिए।",
      "Before any production healthcare use":
        "वास्तविक स्वास्थ्य उपयोग से पहले",
      "Have warning-sign rules reviewed and approved by qualified clinicians.":
        "चेतावनी संकेत नियमों की योग्य चिकित्सकों से समीक्षा और स्वीकृति लें।",
      "Validate on representative, independently collected data with documented consent and provenance.":
        "दस्तावेज़ित सहमति और स्रोत वाले स्वतंत्र रूप से एकत्र प्रतिनिधि डेटा पर सत्यापन करें।",
      "Perform privacy, security, accessibility, bias, and risk-management reviews.":
        "गोपनीयता, सुरक्षा, पहुँच, पक्षपात और जोखिम प्रबंधन की समीक्षा करें।",
      "Establish clinical governance, incident reporting, monitoring, and change control.":
        "चिकित्सकीय निगरानी, घटना रिपोर्टिंग, मॉनिटरिंग और बदलाव नियंत्रण स्थापित करें।",
      "Do not use this prototype for diagnosis, triage, or treatment decisions.":
        "इस प्रोटोटाइप का उपयोग निदान, प्राथमिकता निर्धारण या उपचार निर्णयों के लिए न करें।",
      "Your profile": "आपकी प्रोफ़ाइल",
      "Manage your sign-in credentials and the information stored in your workspace.":
        "अपने साइन-इन विवरण और कार्यक्षेत्र में सहेजी गई जानकारी प्रबंधित करें।",
      "Account details": "खाते का विवरण",
      "Member since": "सदस्य बने",
      "Change password": "पासवर्ड बदलें",
      "Current password": "वर्तमान पासवर्ड",
      "New password": "नया पासवर्ड",
      "Confirm password": "पासवर्ड की पुष्टि करें",
      "Update password": "पासवर्ड अपडेट करें",
      "Privacy controls": "गोपनीयता नियंत्रण",
      "Saved reports can contain sensitive health information. Keep your device secure and download exports only to trusted locations.":
        "सहेजी गई रिपोर्टों में संवेदनशील स्वास्थ्य जानकारी हो सकती है। अपने उपकरण को सुरक्षित रखें और फ़ाइलें केवल भरोसेमंद स्थानों पर डाउनलोड करें।",
      "Export your saved data": "अपना सहेजा डेटा निर्यात करें",
      "Download report content as JSON.":
        "रिपोर्ट की सामग्री JSON के रूप में डाउनलोड करें।",
      "Export JSON ↓": "JSON निर्यात करें ↓",
      "Delete a report": "रिपोर्ट हटाएँ",
      "Remove individual summaries from History.":
        "इतिहास से अलग-अलग सारांश हटाएँ।",
      "Open history →": "इतिहास खोलें →",
      "Delete account and reports": "खाता और रिपोर्टें हटाएँ",
      "This permanently deletes your account and all reports saved in this local database.":
        "इससे आपका खाता और इस स्थानीय डेटाबेस में सहेजी गई सभी रिपोर्टें स्थायी रूप से हट जाएँगी।",
      "Type DELETE to confirm": "पुष्टि के लिए DELETE लिखें",
      "Delete account": "खाता हटाएँ",
      "Let’s document how you’re feeling.": "आइए, आपके लक्षण दर्ज करें।",
      "This helps organize your notes. It does not diagnose or determine whether symptoms are safe.":
        "इससे आपके नोट व्यवस्थित होते हैं। यह निदान नहीं करता और न ही लक्षणों की सुरक्षा तय करता है।",
      "Back to dashboard": "डैशबोर्ड पर वापस जाएँ",
      Symptoms: "लक्षण",
      "What are you feeling?": "आप क्या महसूस कर रहे हैं?",
      Details: "विवरण",
      "How has it changed?": "इसमें क्या बदलाव आया है?",
      Review: "समीक्षा",
      "Check your summary": "अपने सारांश की जाँच करें",
      "Choose your symptoms": "अपने लक्षण चुनें",
      "Select all that apply. Use search to find a symptom quickly.":
        "लागू होने वाले सभी लक्षण चुनें। खोज से लक्षण जल्दी ढूँढें।",
      "All symptoms": "सभी लक्षण",
      "symptoms selected": "लक्षण चुने गए",
      "Clear selection": "चयन हटाएँ",
      "Add a little context": "थोड़ा संदर्भ जोड़ें",
      "Your own description helps make the report more useful.":
        "आपका विवरण रिपोर्ट को अधिक उपयोगी बनाता है।",
      "How long have you experienced these symptoms?":
        "आपको ये लक्षण कब से हैं?",
      "Choose duration": "अवधि चुनें",
      "How would you describe the severity?":
        "आप गंभीरता का वर्णन कैसे करेंगे?",
      "Compared with when it started": "शुरुआत की तुलना में",
      "Not sure": "पता नहीं",
      Improving: "बेहतर हो रहा है",
      "About the same": "लगभग वैसा ही",
      "Getting worse": "बढ़ रहा है",
      "Comes and goes": "आता-जाता रहता है",
      "(optional · avoid names or identifying details)":
        "(वैकल्पिक · नाम या पहचान की जानकारी न दें)",
      "Only include information you are comfortable storing in your account.":
        "केवल वही जानकारी दें जिसे खाते में सहेजने में आप सहज हों।",
      "Health measurements": "स्वास्थ्य माप",
      "(optional)": "(वैकल्पिक)",
      "These self-reported values will be saved in this report. Leave anything blank if you do not know it.":
        "आपके बताए गए मान इस रिपोर्ट में सहेजे जाएँगे। जानकारी न हो तो खाली छोड़ दें।",
      "Diastolic (mmHg)": "डायस्टोलिक (mmHg)",
      "Pulse rate (BPM)": "नाड़ी दर (BPM)",
      "Questions for your doctor": "डॉक्टर के लिए प्रश्न",
      "BMI is a screening measure, not a diagnosis. This tool does not interpret blood pressure, temperature or pulse as a clinical assessment. Enter medication details exactly as prescribed; CareNote does not recommend doses.":
        "BMI एक स्क्रीनिंग माप है, निदान नहीं। यह टूल रक्तचाप, तापमान या नाड़ी की चिकित्सकीय व्याख्या नहीं करता। दवा का विवरण निर्देशानुसार दर्ज करें; CareNote खुराक की सलाह नहीं देता।",
      "Review before creating": "बनाने से पहले समीक्षा करें",
      "Check your entries. You can go back to make changes.":
        "अपनी प्रविष्टियाँ जाँचें। बदलाव के लिए वापस जा सकते हैं।",
      "Symptom summary preview": "लक्षण-सारांश का पूर्वावलोकन",
      "PRIVATE NOTE": "निजी नोट",
      "No symptoms selected": "कोई लक्षण नहीं चुना गया",
      "Not provided": "नहीं दिया गया",
      "Before you continue": "आगे बढ़ने से पहले",
      "This app cannot rule out emergencies. For severe, sudden, or worsening symptoms—or if you are worried—seek medical advice promptly. Do not wait for an app result.":
        "यह ऐप आपातस्थिति को खारिज नहीं कर सकता। गंभीर, अचानक या बढ़ते लक्षणों पर—या चिंता होने पर—जल्दी चिकित्सा सलाह लें। ऐप के परिणाम की प्रतीक्षा न करें।",
      "Health details": "स्वास्थ्य विवरण",
      "Optional BMI, vital-sign readings, medication details and doctor questions are saved with the report you create.":
        "वैकल्पिक BMI, जीवन-संकेत रीडिंग, दवा विवरण और डॉक्टर के प्रश्न बनाई गई रिपोर्ट में सहेजे जाते हैं।",
      Back: "वापस",
      "Continue →": "जारी रखें →",
      "Create symptom summary": "लक्षण-सारांश बनाएँ",
      "A clearer picture starts with your notes.":
        "स्पष्ट समझ आपके नोट्स से शुरू होती है।",
      "There are no right or wrong answers. If you don’t know something, it’s okay to leave it blank.":
        "यहाँ सही या गलत उत्तर नहीं हैं। कुछ पता न हो तो खाली छोड़ सकते हैं।",
      "Your answers, your control": "आपके उत्तर, आपका नियंत्रण",
      "You can edit or delete saved reports.":
        "आप सहेजी गई रिपोर्टों को संपादित या हटा सकते हैं।",
      "Local machine learning": "स्थानीय मशीन लर्निंग",
      "Not medical advice": "चिकित्सकीय सलाह नहीं",
      "A clinician can interpret symptoms in context.":
        "चिकित्सक संदर्भ के साथ लक्षणों की व्याख्या कर सकते हैं।",
      "A structured note to help you prepare for a healthcare conversation.":
        "स्वास्थ्य-विशेषज्ञ से बातचीत की तैयारी में मदद के लिए व्यवस्थित नोट।",
      "Edit report": "रिपोर्ट संपादित करें",
      "↓ Download PDF": "↓ PDF डाउनलोड करें",
      "Warning-sign screening needs attention":
        "चेतावनी संकेतों की स्क्रीनिंग पर ध्यान दें",
      "Screening limitation": "स्क्रीनिंग की सीमा",
      "What you reported": "आपने क्या बताया",
      "Based on your entries": "आपकी प्रविष्टियों पर आधारित",
      "YOUR NOTES": "आपके नोट्स",
      "Self-reported severity": "स्वयं बताई गई गंभीरता",
      Progression: "बदलाव",
      "Medication list entered": "दवाओं की सूची दर्ज की गई",
      "Dosage:": "खुराक:",
      "Schedule:": "समय-सारणी:",
      "No optional health measurements were added to this report.":
        "इस रिपोर्ट में कोई वैकल्पिक स्वास्थ्य माप नहीं जोड़ा गया।",
      "To save reusable appointment questions and health logs, visit":
        "दोबारा उपयोग योग्य प्रश्न और स्वास्थ्य लॉग सहेजने के लिए यहाँ जाएँ",
      "Local model output": "स्थानीय मॉडल आउटपुट",
      "Dataset label · not a diagnosis": "डेटासेट लेबल · निदान नहीं",
      "Model result unavailable": "मॉडल परिणाम उपलब्ध नहीं",
      "The symptom summary and PDF export still work without a model dataset.":
        "मॉडल डेटासेट के बिना भी लक्षण-सारांश और PDF निर्यात काम करते हैं।",
      "Bring this to a conversation": "इसे मुलाकात में साथ ले जाएँ",
      "This report can help you remember what to mention. A qualified healthcare professional can assess your symptoms alongside your history and examination.":
        "यह रिपोर्ट आपको बताने वाली बातें याद रखने में मदद कर सकती है। योग्य स्वास्थ्य-विशेषज्ञ आपके इतिहास और जाँच के साथ लक्षणों का आकलन कर सकते हैं।",
      "Review your timeline": "अपनी समयरेखा देखें",
      "When it started and how it changed.": "यह कब शुरू हुआ और कैसे बदला।",
      "Share relevant context": "ज़रूरी संदर्भ साझा करें",
      "Include medicines or existing conditions directly with your clinician.":
        "दवाओं या मौजूदा स्थितियों की जानकारी चिकित्सक को दें।",
      "Seek care when needed": "ज़रूरत पड़ने पर चिकित्सा लें",
      "Don’t delay urgent help while preparing a report.":
        "रिपोर्ट तैयार करते समय ज़रूरी चिकित्सा सहायता में देर न करें।",
      "Delete this report": "यह रिपोर्ट हटाएँ",
      "Select at least one symptom to continue.":
        "जारी रखने के लिए कम-से-कम एक लक्षण चुनें।",
      "Select at least one symptom before creating the summary.":
        "सारांश बनाने से पहले कम-से-कम एक लक्षण चुनें।",
      "Enter a temperature to see the conversion.":
        "रूपांतरण देखने के लिए तापमान दर्ज करें।",
      "Language preference updated.": "भाषा की प्राथमिकता अपडेट की गई।",
      "YOUR PERSONAL WORKSPACE": "आपका निजी कार्यक्षेत्र",
      "Keep your health notes clear, organized, and yours.":
        "अपने स्वास्थ्य नोट्स स्पष्ट, व्यवस्थित और अपने नियंत्रण में रखें।",
      "Save symptom summaries, review changes, and take a more structured note to your next appointment.":
        "लक्षण सारांश सहेजें, बदलाव देखें और अगली मुलाकात के लिए व्यवस्थित नोट तैयार करें।",
      "✳ Local-first by default": "✳ डिफ़ॉल्ट रूप से स्थानीय",
      "▤ Export whenever you need": "▤ ज़रूरत पड़ने पर निर्यात करें",
      "⌁ Designed for clarity": "⌁ स्पष्टता के लिए बनाया गया",
      "Create your account": "अपना खाता बनाएँ",
      "Welcome back": "वापसी पर स्वागत है",
      "Reset your password": "पासवर्ड रीसेट करें",
      "Choose a new password": "नया पासवर्ड चुनें",
      "Start your private symptom notebook.":
        "अपनी निजी लक्षण नोटबुक शुरू करें।",
      "Sign in to continue to your workspace.":
        "अपने कार्यक्षेत्र में जाने के लिए साइन इन करें।",
      "If your account exists, we'll send a reset link when email is configured.":
        "यदि खाता मौजूद है, तो ईमेल सुविधा सेट होने पर रीसेट लिंक भेजा जाएगा।",
      "Choose a strong password for your account.":
        "अपने खाते के लिए मज़बूत पासवर्ड चुनें।",
      "Email address": "ईमेल पता",
      Password: "पासवर्ड",
      "Confirm new password": "नए पासवर्ड की पुष्टि करें",
      "Send reset link": "रीसेट लिंक भेजें",
      "Already have an account?": "क्या आपका पहले से खाता है?",
      "Forgot password?": "पासवर्ड भूल गए?",
      "Back to sign in": "साइन इन पर वापस जाएँ",
      "At least 12 characters": "कम-से-कम 12 अक्षर",
      "Search by title or symptom…": "शीर्षक या लक्षण से खोजें…",
      "Download PDF": "PDF डाउनलोड करें",
      Edit: "संपादित करें",
      "YOUR NOTEBOOK": "आपकी नोटबुक",
      "TRANSPARENCY & RESPONSIBLE AI": "पारदर्शिता और जिम्मेदार AI",
      "LOCAL MODEL LOADED": "स्थानीय मॉडल लोड है",
      "MODEL UNAVAILABLE": "मॉडल उपलब्ध नहीं है",
      "PRIVATE BY DESIGN · LOCAL ML": "निजता को प्राथमिकता · स्थानीय ML",
      DEMO: "डेमो",
      "ACCOUNT & PRIVACY": "खाता और गोपनीयता",
      "Permanently delete this account and all saved reports?":
        "क्या आप यह खाता और सभी सहेजी गई रिपोर्ट स्थायी रूप से हटाना चाहते हैं?",
      "SYMPTOM SUMMARY": "लक्षण सारांश",
      "Selected signs:": "चुने गए संकेत:",
      Height: "लंबाई",
      Weight: "वज़न",
      "Blood pressure ·": "रक्तचाप ·",
      "Temperature ·": "तापमान ·",
      "Pulse ·": "नाड़ी ·",
      "Don't delay urgent help while preparing a report.":
        "रिपोर्ट तैयार करते समय तुरंत सहायता लेने में देरी न करें।",
      "EDIT SAVED REPORT": "सहेजी गई रिपोर्ट संपादित करें",
      "GUIDED INTAKE · 3 STEPS": "निर्देशित जानकारी · 3 चरण",
      "Update your summary": "अपना सारांश अपडेट करें",
      "← Back to dashboard": "← डैशबोर्ड पर वापस जाएँ",
      "Blood pressure — systolic (mmHg)": "रक्तचाप — सिस्टोलिक (mmHg)",
      "(optional · one medicine per line)": "(वैकल्पिक · हर पंक्ति में एक दवा)",
      "Format each line as: name | dosage as prescribed | schedule. CareNote does not recommend medication or doses.":
        "हर पंक्ति का प्रारूप: नाम | निर्धारित खुराक | समय-सारणी। CareNote दवा या खुराक की सलाह नहीं देता।",
      "ⓘ Before you continue": "ⓘ आगे बढ़ने से पहले",
      "← Back": "← वापस",
      "Search symptoms…": "लक्षण खोजें…",
      "e.g. 170": "जैसे 170",
      "e.g. 68.5": "जैसे 68.5",
      "e.g. 120": "जैसे 120",
      "e.g. 80": "जैसे 80",
      "e.g. 37": "जैसे 37",
      "e.g. 72": "जैसे 72",
      "Medicine name | dosage as prescribed | schedule":
        "दवा का नाम | निर्धारित खुराक | समय-सारणी",
      "What should I ask at my appointment?":
        "मुलाकात में मुझे क्या पूछना चाहिए?",
      "CareNote does not recommend medicines or doses. Follow your clinician's instructions.":
        "CareNote दवा या खुराक की सलाह नहीं देता। अपने चिकित्सक के निर्देशों का पालन करें।",
      "⌁ ◷ ▤ ✎": "⌁ ◷ ▤ ✎",
      "BMI:": "BMI:",
      "Blood pressure:": "रक्तचाप:",
      "Temperature:": "तापमान:",
      "Pulse:": "नाड़ी:",
      "Symptom:": "लक्षण:",
      "Medication:": "दवा:",
      "Appointment questions": "मुलाकात के प्रश्न",
      "Name on the package/prescription": "पैकेट/पर्चे पर दिया गया नाम",
      "Enter exactly as prescribed": "जैसा निर्धारित है वैसा ही दर्ज करें",
      "e.g. schedule as prescribed": "जैसे निर्धारित समय-सारणी",
      "e.g. headache": "जैसे सिरदर्द",
      "e.g. 2 days": "जैसे 2 दिन",
      "What changed, or what seemed to trigger it?":
        "क्या बदला, या किस कारण से ऐसा लगा?",
      "1. What might explain these symptoms?\n2. What changes should I monitor?\n3. When should I follow up?":
        "1. इन लक्षणों का क्या कारण हो सकता है?\n2. मुझे किन बदलावों पर ध्यान देना चाहिए?\n3. मुझे दोबारा कब संपर्क करना चाहिए?",
      "Available Not configured": "उपलब्ध · कॉन्फ़िगर नहीं है",
      "＋ New symptom report": "＋ नई लक्षण रिपोर्ट",
      "＋ New report": "＋ नई रिपोर्ट",
      "· symptoms": "· लक्षण",
      "· symptoms ·": "· लक्षण ·",
      "No external AI API is called.":
        "किसी बाहरी AI API को कॉल नहीं किया जाता।",
      "Search symptoms": "लक्षण खोजें",
      "Organize what you're feeling, track changes over time, and create a clear summary to discuss with a healthcare professional.":
        "अपने लक्षण व्यवस्थित करें, समय के साथ बदलाव दर्ज करें और स्वास्थ्य-विशेषज्ञ से चर्चा के लिए स्पष्ट सारांश बनाएँ.",
      "✓ No external AI API": "✓ बाहरी AI API नहीं",
      "✓ You control saved reports": "✓ सहेजी गई रिपोर्टों पर आपका नियंत्रण",
      "✓ Exportable summaries": "✓ निर्यात योग्य सारांश",
      "Copy your original data/dataset.csv into this project's data/ folder. Do not use synthetic rows to claim medical performance.":
        "अपनी मूल data/dataset.csv फ़ाइल इस प्रोजेक्ट के data/ फ़ोल्डर में कॉपी करें। चिकित्सा प्रदर्शन का दावा करने के लिए कृत्रिम डेटा का उपयोग न करें।",
      "Your symptom summary": "आपका लक्षण सारांश",
      "No questions added yet. Consider asking your clinician what symptoms to monitor, when to follow up, and whether any next steps are appropriate.":
        "अभी कोई प्रश्न नहीं जोड़ा गया है। अपने चिकित्सक से पूछें कि किन लक्षणों पर ध्यान दें, दोबारा कब संपर्क करें और आगे क्या कदम उचित होंगे.",
      Underweight: "कम वज़न",
      "Healthy weight range": "स्वस्थ वज़न की सीमा",
      "Overweight range": "अधिक वज़न की सीमा",
      "Obesity range": "मोटापे की श्रेणी",
      "Name not provided": "नाम दर्ज नहीं",
      "Not entered": "दर्ज नहीं किया गया",
      "Abdominal Pain": "पेट दर्द",
      "Abnormal Menstruation": "अनियमित मासिक धर्म",
      Acidity: "एसिडिटी",
      "Acute Liver Failure": "तीव्र यकृत विफलता",
      "Altered Sensorium": "मानसिक स्थिति में बदलाव",
      Anxiety: "चिंता",
      "Back Pain": "पीठ दर्द",
      "Belly Pain": "पेट दर्द",
      Blackheads: "ब्लैकहेड्स",
      "Bladder Discomfort": "मूत्राशय में असहजता",
      Blister: "छाला",
      "Blood In Sputum": "बलगम में खून",
      "Bloody Stool": "मल में खून",
      "Blurred And Distorted Vision": "धुंधला या विकृत दिखना",
      Breathlessness: "साँस फूलना",
      "Brittle Nails": "कमज़ोर नाखून",
      Bruising: "नील पड़ना",
      "Burning Micturition": "पेशाब में जलन",
      "Chest Pain": "सीने में दर्द",
      Chills: "ठंड लगना",
      "Cold Hands And Feets": "हाथ-पैर ठंडे होना",
      Coma: "कोमा",
      Congestion: "जकड़न या बंद होना",
      Constipation: "कब्ज़",
      "Continuous Feel Of Urine": "बार-बार पेशाब की इच्छा",
      "Continuous Sneezing": "लगातार छींक आना",
      Cough: "खाँसी",
      Cramps: "ऐंठन",
      "Dark Urine": "गहरे रंग का पेशाब",
      Dehydration: "निर्जलीकरण",
      Depression: "अवसाद",
      Diarrhoea: "दस्त",
      "Dischromic Patches": "त्वचा पर रंग के धब्बे",
      "Distention Of Abdomen": "पेट फूलना",
      Dizziness: "चक्कर आना",
      "Drying And Tingling Lips": "होंठ सूखना या झुनझुनी",
      "Enlarged Thyroid": "थायरॉइड का बढ़ना",
      "Excessive Hunger": "बहुत अधिक भूख लगना",
      "Extra Marital Contacts": "विवाहेतर यौन संपर्क",
      "Family History": "पारिवारिक इतिहास",
      "Fast Heart Rate": "तेज़ हृदय गति",
      Fatigue: "थकान",
      "Fluid Overload": "शरीर में अतिरिक्त तरल",
      "Foul Smell Of Urine": "पेशाब में दुर्गंध",
      "Foul Smell Ofurine": "पेशाब में दुर्गंध",
      Headache: "सिरदर्द",
      "High Fever": "तेज़ बुखार",
      "Hip Joint Pain": "कूल्हे के जोड़ में दर्द",
      "History Of Alcohol Consumption": "शराब सेवन का इतिहास",
      "Increased Appetite": "भूख बढ़ना",
      Indigestion: "अपच",
      "Inflammatory Nails": "नाखूनों में सूजन",
      "Internal Itching": "अंदरूनी खुजली",
      "Irregular Sugar Level": "अनियमित रक्त शर्करा",
      Irritability: "चिड़चिड़ापन",
      "Irritation In Anus": "गुदा में जलन",
      Itching: "खुजली",
      "Joint Pain": "जोड़ों में दर्द",
      "Knee Pain": "घुटने में दर्द",
      "Lack Of Concentration": "ध्यान केंद्रित करने में कठिनाई",
      Lethargy: "सुस्ती",
      "Loss Of Appetite": "भूख न लगना",
      "Loss Of Balance": "संतुलन खोना",
      "Loss Of Smell": "सूँघने की क्षमता कम होना",
      Malaise: "अस्वस्थ महसूस करना",
      "Mild Fever": "हल्का बुखार",
      "Mood Swings": "मूड में बदलाव",
      "Movement Stiffness": "चलने-फिरने में अकड़न",
      "Mucoid Sputum": "बलगमयुक्त कफ",
      "Muscle Pain": "मांसपेशियों में दर्द",
      "Muscle Wasting": "मांसपेशियों का क्षय",
      "Muscle Weakness": "मांसपेशियों में कमज़ोरी",
      Nausea: "जी मिचलाना",
      "Neck Pain": "गर्दन में दर्द",
      "Nodal Skin Eruptions": "त्वचा पर उभरे दाने",
      Obesity: "मोटापा",
      "Pain Behind The Eyes": "आँखों के पीछे दर्द",
      "Pain During Bowel Movements": "मल त्याग के समय दर्द",
      "Pain In Anal Region": "गुदा क्षेत्र में दर्द",
      "Painful Walking": "चलने में दर्द",
      Palpitations: "दिल की धड़कन महसूस होना",
      "Passage Of Gases": "गैस निकलना",
      "Patches In Throat": "गले में धब्बे",
      Phlegm: "बलगम",
      Polyuria: "बार-बार अधिक पेशाब आना",
      Prognosis: "रोग की संभावित प्रगति",
      "Prominent Veins On Calf": "पिंडली पर उभरी नसें",
      "Puffy Face And Eyes": "चेहरे और आँखों में सूजन",
      "Pus Filled Pimples": "मवाद वाले मुहाँसे",
      "Receiving Blood Transfusion": "रक्त चढ़वाने का इतिहास",
      "Receiving Unsterile Injections": "अस्वच्छ इंजेक्शन लगने का इतिहास",
      "Red Sore Around Nose": "नाक के आसपास लाल घाव",
      "Red Spots Over Body": "शरीर पर लाल धब्बे",
      "Redness Of Eyes": "आँखों में लालिमा",
      Restlessness: "बेचैनी",
      "Runny Nose": "नाक बहना",
      "Rusty Sputum": "जंग जैसे रंग का बलगम",
      Scurring: "दाँतों पर मैल जमना",
      Shivering: "कँपकँपी",
      "Silver Like Dusting": "चाँदी जैसी पपड़ी",
      "Sinus Pressure": "साइनस में दबाव",
      "Skin Peeling": "त्वचा छिलना",
      "Skin Rash": "त्वचा पर चकत्ते",
      "Slurred Speech": "लड़खड़ाती बोली",
      "Small Dents In Nails": "नाखूनों में छोटे गड्ढे",
      "Spinning Movements": "घूमने जैसा महसूस होना",
      "Spotting Urination": "पेशाब में धब्बे या रक्त के निशान",
      "Stiff Neck": "गर्दन में अकड़न",
      "Stomach Bleeding": "पेट या पाचन तंत्र में रक्तस्राव",
      "Stomach Pain": "पेट दर्द",
      "Sunken Eyes": "धँसी हुई आँखें",
      Sweating: "पसीना आना",
      "Swelled Lymph Nodes": "लसीका ग्रंथियों में सूजन",
      "Swelling Joints": "जोड़ों में सूजन",
      "Swelling Of Stomach": "पेट में सूजन",
      "Swollen Blood Vessels": "रक्त वाहिकाओं में सूजन",
      "Swollen Extremeties": "हाथ-पैरों में सूजन",
      "Swollen Legs": "पैरों में सूजन",
      "Throat Irritation": "गले में जलन",
      "Toxic Look (Typhos)": "गंभीर रूप से बीमार दिखना (टाइफस जैसा)",
      "Ulcers On Tongue": "जीभ पर छाले",
      Unsteadiness: "अस्थिरता",
      "Visual Disturbances": "दृष्टि में परेशानी",
      Vomiting: "उल्टी",
      "Watering From Eyes": "आँखों से पानी आना",
      "Weakness In Limbs": "हाथ-पैरों में कमज़ोरी",
      "Weakness Of One Body Side": "शरीर के एक तरफ कमज़ोरी",
      "Weight Gain": "वज़न बढ़ना",
      "Weight Loss": "वज़न घटना",
      "Yellow Crust Ooze": "पीली पपड़ी या स्राव",
      "Yellow Urine": "पीला पेशाब",
      "Yellowing Of Eyes": "आँखों का पीला पड़ना",
      "Yellowish Skin": "त्वचा का पीला पड़ना",
      "Breathing & senses": "श्वास और इंद्रियाँ",
      Digestive: "पाचन",
      General: "सामान्य",
      "Mood & cognition": "मनोदशा और सोच",
      Other: "अन्य",
      "Pain & movement": "दर्द और गतिविधि",
      "Skin & hair": "त्वचा और बाल",
      "SYMPTOM SUMMARY ·": "लक्षण सारांश ·",
      "· A local-first symptom organization tool":
        "· लक्षण व्यवस्थित रखने का स्थानीय साधन",
      "BMI & body measurements": "BMI और शरीर के माप",
      "Your health workspace": "आपका स्वास्थ्य कार्यक्षेत्र",
      "Choose a tracker to add a record, review its history, and explore your trends. Each tracker has its own page.":
        "रिकॉर्ड जोड़ने, इतिहास देखने और रुझान समझने के लिए ट्रैकर चुनें। हर ट्रैकर का अपना पृष्ठ है।",
      "Each record is saved to your account. The latest saved value is also shown in your profile. These logs are for personal documentation and do not diagnose conditions or replace clinical advice.":
        "हर रिकॉर्ड आपके खाते में सहेजा जाता है। नवीनतम मान आपकी प्रोफ़ाइल में भी दिखता है। ये निजी रिकॉर्ड हैं, निदान नहीं और चिकित्सकीय सलाह का विकल्प नहीं।",
      "Latest record": "नवीनतम रिकॉर्ड",
      "No records yet": "अभी कोई रिकॉर्ड नहीं",
      "Start by adding your first entry": "अपनी पहली प्रविष्टि जोड़ें",
      "Open tracker": "ट्रैकर खोलें",
      "All health records": "सभी स्वास्थ्य रिकॉर्ड",
      "PERSONAL TRACKER": "निजी ट्रैकर",
      "Log dated height and weight measurements. BMI is a screening measure, not a diagnosis.":
        "तारीख सहित लंबाई और वज़न दर्ज करें। BMI स्क्रीनिंग माप है, निदान नहीं।",
      "Save each entry to your account. Entries remain in this tracker’s history.":
        "हर प्रविष्टि अपने खाते में सहेजें। प्रविष्टियाँ इस ट्रैकर के इतिहास में रहेंगी।",
      "Add a record": "रिकॉर्ड जोड़ें",
      "Entries are saved to your account and remain in this tracker's history.":
        "प्रविष्टियाँ आपके खाते में सहेजी जाती हैं और इस ट्रैकर के इतिहास में रहती हैं।",
      "Save BMI measurement": "BMI माप सहेजें",
      "Save blood pressure": "रक्तचाप सहेजें",
      "Save temperature": "तापमान सहेजें",
      "Save pulse": "नाड़ी सहेजें",
      "Add timeline entry": "समयरेखा प्रविष्टि जोड़ें",
      "Save medication": "दवा सहेजें",
      "Save appointment questions": "मुलाकात के प्रश्न सहेजें",
      "Measurement trend": "माप का रुझान",
      "Severity overview": "गंभीरता का सारांश",
      "Medication history": "दवा इतिहास",
      "Appointment history": "मुलाकात का इतिहास",
      "A visual summary of your saved readings, newest entries included.":
        "आपकी सहेजी गई रीडिंग का दृश्य सारांश, जिसमें नवीनतम प्रविष्टियाँ भी हैं।",
      "Count of symptom entries by self-reported severity.":
        "स्वयं बताई गई गंभीरता के अनुसार लक्षण प्रविष्टियों की संख्या।",
      "Your saved entries, ordered by date.":
        "आपकी सहेजी गई प्रविष्टियाँ, तारीख के अनुसार।",
      "No history yet": "अभी कोई इतिहास नहीं",
      "Save your first entry to start building a personal history and trend view.":
        "निजी इतिहास और रुझान शुरू करने के लिए पहली प्रविष्टि सहेजें।",
      "Entries by self-reported severity":
        "स्वयं बताई गई गंभीरता के अनुसार प्रविष्टियाँ",
      "Entries by date": "तारीख के अनुसार प्रविष्टियाँ",
      "Latest saved value": "नवीनतम सहेजा गया मान",
      "Showing up to 12 dated records. This graph is descriptive and does not indicate a diagnosis.":
        "अधिकतम 12 तारीख वाली प्रविष्टियाँ दिखाई गई हैं। यह ग्राफ केवल रिकॉर्ड दिखाता है, निदान नहीं।",
      "Systolic is shown as the main line and diastolic as the second line.":
        "मुख्य रेखा सिस्टोलिक और दूसरी रेखा डायस्टोलिक दिखाती है।",
      "Temperatures are normalized to Celsius for comparison.":
        "तुलना के लिए तापमान सेल्सियस में बदले गए हैं।",
      "Current health snapshot": "वर्तमान स्वास्थ्य सारांश",
      "Latest saved value and total history count for each tracker. These are personal records, not clinical assessments.":
        "हर ट्रैकर का नवीनतम मान और कुल इतिहास संख्या। ये निजी रिकॉर्ड हैं, चिकित्सकीय मूल्यांकन नहीं।",
      "All health records →": "सभी स्वास्थ्य रिकॉर्ड →",
      Updated: "अपडेट किया गया",
      "saved entries": "सहेजी गई प्रविष्टियाँ",
      "Systolic pressure is normally higher than diastolic; check the entered values.":
        "सिस्टोलिक दबाव सामान्यतः डायस्टोलिक से अधिक होता है; दर्ज मान जाँचें।",
      "Enter valid systolic and diastolic readings.":
        "मान्य सिस्टोलिक और डायस्टोलिक रीडिंग दर्ज करें.",
      "Please enter valid values for this record.":
        "कृपया इस रिकॉर्ड के लिए मान्य मान दर्ज करें।",
      "Health record saved to your history.":
        "स्वास्थ्य रिकॉर्ड आपके इतिहास में सहेजा गया।",
      "Health record deleted.": "स्वास्थ्य रिकॉर्ड हटाया गया।",
      "Delete this health record?": "क्या यह स्वास्थ्य रिकॉर्ड हटाना है?",
      "Height (cm)": "लंबाई (सेमी)",
      "Weight (kg)": "वज़न (किग्रा)",
      "Systolic (mmHg)": "सिस्टोलिक (mmHg)",
      "Diastolic (mmHg)": "डायस्टोलिक (mmHg)",
      "Reading date": "रीडिंग की तारीख",
      "Measurement date": "माप की तारीख",
      Temperature: "तापमान",
      Unit: "इकाई",
      "°C Celsius": "°C सेल्सियस",
      "°F Fahrenheit": "°F फ़ारेनहाइट",
      "Enter a value to see the conversion.":
        "रूपांतरण देखने के लिए मान दर्ज करें।",
      "Heart rate (BPM)": "हृदय गति (BPM)",
      Symptom: "लक्षण",
      Severity: "गंभीरता",
      "Choose severity": "गंभीरता चुनें",
      Duration: "अवधि",
      Date: "तारीख",
      Notes: "नोट्स",
      "Dosage as prescribed": "निर्धारित खुराक",
      Schedule: "समय-सारणी",
      "Medication name": "दवा का नाम",
      "Questions for your appointment": "मुलाकात के लिए प्रश्न",
      "Questions for your doctor": "डॉक्टर के लिए प्रश्न",
      History: "इतिहास",
      Delete: "हटाएँ",
      Save: "सहेजें",
      record: "रिकॉर्ड",
      records: "रिकॉर्ड",
      entries: "प्रविष्टियाँ",
      entry: "प्रविष्टि",
      saved: "सहेजा गया",
      Profile: "प्रोफ़ाइल",
      "No records saved yet": "अभी कोई रिकॉर्ड सहेजा नहीं गया",
      "Your new entries will appear here, with their dates and details.":
        "आपकी नई प्रविष्टियाँ तारीख और विवरण सहित यहाँ दिखाई देंगी।",
      "BMI is a screening measure, not a diagnosis.":
        "BMI स्क्रीनिंग माप है, निदान नहीं।",
      "A single reading is not enough to diagnose a blood-pressure condition.":
        "एक रीडिंग से रक्तचाप की स्थिति का निदान नहीं होता।",
      "Use the dosage and schedule provided by your clinician or pharmacist.":
        "अपने चिकित्सक या फार्मासिस्ट द्वारा बताई गई खुराक और समय-सारणी का उपयोग करें।",
      "Record heart rate in beats per minute.":
        "हृदय गति प्रति मिनट धड़कनों में दर्ज करें।",
      "Keep a dated record of heart rate in beats per minute.":
        "हृदय गति का तारीख सहित रिकॉर्ड रखें।",
      "Keep a timeline of symptoms, their severity, duration, and any notes.":
        "लक्षणों, उनकी गंभीरता, अवधि और नोट्स की समयरेखा रखें।",
      "Document medications and the instructions you have been given. CareNote does not recommend medication or dosage.":
        "दवाओं और मिले निर्देशों का रिकॉर्ड रखें। CareNote दवा या खुराक की सलाह नहीं देता।",
      "Write down questions and topics you want to discuss with your clinician.":
        "अपने चिकित्सक से चर्चा करने वाले प्रश्न और विषय लिखें।",
      "BMI is a screening measure. Adult categories are not intended for children and teenagers.":
        "BMI स्क्रीनिंग माप है। वयस्क श्रेणियाँ बच्चों और किशोरों के लिए नहीं हैं।",
      "Temperature conversion is for reference only.":
        "तापमान रूपांतरण केवल संदर्भ के लिए है।",
      "Open profile →": "प्रोफ़ाइल खोलें →",
      "See your latest health snapshot": "अपना नवीनतम स्वास्थ्य सारांश देखें",
      "Your profile shows the latest saved value and total history count for every tracker.":
        "आपकी प्रोफ़ाइल हर ट्रैकर का नवीनतम सहेजा गया मान और कुल रिकॉर्ड संख्या दिखाती है।",
      "This application is an educational prototype, not a diagnostic tool.":
        "यह एप्लिकेशन एक शैक्षणिक प्रोटोटाइप है, निदान का उपकरण नहीं.",
    },
    mr: {
      "YOUR HEALTH, ORGANIZED": "तुमचे आरोग्य, व्यवस्थित",
      "A local-first symptom organization tool":
        "लक्षणांची नोंद व्यवस्थित ठेवण्यासाठी स्थानिक साधन",
      "Not a diagnostic tool. For severe, sudden, or worsening symptoms, seek urgent medical care.":
        "हे निदानाचे साधन नाही. गंभीर, अचानक किंवा वाढणारी लक्षणे असल्यास तातडीने वैद्यकीय मदत घ्या.",
      Dashboard: "डॅशबोर्ड",
      "New report": "नवीन अहवाल",
      "New symptom report": "नवीन लक्षण अहवाल",
      "New symptom summary": "नवीन लक्षण सारांश",
      "Health records": "आरोग्य नोंदी",
      History: "इतिहास",
      "Model & safety": "मॉडेल आणि सुरक्षितता",
      Profile: "प्रोफाइल",
      "Sign out": "साइन आउट",
      "Sign in": "साइन इन",
      "Get started": "सुरू करा",
      Language: "भाषा",
      "YOUR WORKSPACE": "तुमचे कार्यक्षेत्र",
      "Good to see you.": "पुन्हा भेटून आनंद झाला.",
      "Keep your symptom notes organized and ready when you need them.":
        "तुमच्या लक्षणांच्या नोंदी व्यवस्थित ठेवा, म्हणजे गरज पडल्यावर सहज मिळतील.",
      "Saved reports": "जतन केलेले अहवाल",
      "Across your history": "तुमच्या संपूर्ण इतिहासात",
      "Recent activity": "अलीकडील कृती",
      "Latest reports shown below": "नवीनतम अहवाल खाली दाखवले आहेत",
      "Local model": "स्थानिक मॉडेल",
      Available: "उपलब्ध",
      "Not configured": "कॉन्फिगर केलेले नाही",
      "Dataset-backed classifier loaded": "डेटासेट-आधारित क्लासिफायर लोड झाले",
      "Intake works; add source dataset for ML":
        "माहिती नोंदवणे सुरू आहे; ML साठी मूळ डेटासेट जोडा",
      "Recent symptom reports": "अलीकडील लक्षण अहवाल",
      "Your latest saved summaries": "तुमचे नवीनतम जतन केलेले सारांश",
      "View all →": "सर्व पहा →",
      "Your notebook starts here": "तुमची नोंदवही येथे सुरू होते",
      "Create your first symptom summary to begin building a useful timeline.":
        "उपयुक्त कालरेषा तयार करण्यासाठी पहिला लक्षण सारांश तयार करा.",
      "Create first report": "पहिला अहवाल तयार करा",
      "Your reporting patterns": "तुमच्या नोंदींचे स्वरूप",
      "Counts from saved notes only": "फक्त जतन केलेल्या नोंदींची मोजणी",
      "Self-reported severity": "स्वतः सांगितलेली तीव्रता",
      "Most recorded symptoms": "सर्वाधिक नोंदवलेली लक्षणे",
      "These charts describe your entries, not clinical risk or disease progression.":
        "हे आलेख तुमच्या नोंदी दाखवतात; वैद्यकीय धोका किंवा आजाराची प्रगती नाही.",
      "Your trends will appear as you save reports.":
        "अहवाल जतन केल्यावर तुमचे कल येथे दिसतील.",
      "Open health records & trackers": "आरोग्य नोंदी आणि ट्रॅकर्स उघडा",
      "Browse report history": "अहवाल इतिहास पहा",
      "Read model limitations": "मॉडेलच्या मर्यादा वाचा",
      "YOUR PERSONAL HEALTH LOG": "तुमची वैयक्तिक आरोग्य नोंद",
      "Save measurements, symptom changes, medication details, and questions for your next appointment. Records stay attached to your account.":
        "मोजमाप, लक्षणांतील बदल, औषधांची माहिती आणि पुढील भेटीसाठी प्रश्न जतन करा. नोंदी तुमच्या खात्याशी जोडलेल्या राहतील.",
      "Create symptom report →": "लक्षण अहवाल तयार करा →",
      "How this works": "हे कसे कार्य करते",
      "Save each entry below. When you create a symptom report, recent saved health records are added to the report snapshot and its PDF. This is a personal record—not a diagnosis or a treatment recommendation.":
        "खाली प्रत्येक नोंद जतन करा. लक्षण अहवाल तयार केल्यावर अलीकडील आरोग्य नोंदी अहवालात आणि PDF मध्ये जोडल्या जातात. ही वैयक्तिक नोंद आहे—निदान किंवा उपचार सल्ला नाही.",
      "BMI calculator": "BMI कॅल्क्युलेटर",
      "Height, weight, BMI and adult category":
        "उंची, वजन, BMI आणि प्रौढ श्रेणी",
      "Height (cm)": "उंची (सेमी)",
      "Weight (kg)": "वजन (किलो)",
      "Measurement date": "मोजमापाची तारीख",
      "BMI is a screening measure. Adult categories are not intended for children and teenagers.":
        "BMI हे प्राथमिक तपासणीचे मोजमाप आहे. प्रौढांच्या श्रेणी मुलांसाठी आणि किशोरवयीनांसाठी लागू नाहीत.",
      "Calculate & save BMI": "BMI मोजा आणि जतन करा",
      "Blood pressure": "रक्तदाब",
      "Save systolic and diastolic readings":
        "सिस्टोलिक आणि डायस्टोलिक नोंदी जतन करा",
      "Systolic (mmHg)": "सिस्टोलिक (mmHg)",
      "Diastolic (mmHg)": "डायस्टोलिक (mmHg)",
      "Reading date": "नोंदीची तारीख",
      "Save blood pressure": "रक्तदाब जतन करा",
      "Temperature log": "तापमान नोंद",
      "Enter Celsius or Fahrenheit; view the conversion":
        "सेल्सिअस किंवा फॅरेनहाइट टाका आणि रूपांतरण पहा",
      Temperature: "तापमान",
      Unit: "एकक",
      "°C Celsius": "°C सेल्सिअस",
      "°F Fahrenheit": "°F फॅरेनहाइट",
      "Enter a value to see the conversion.":
        "रूपांतरण पाहण्यासाठी मूल्य टाका.",
      "Save temperature": "तापमान जतन करा",
      "Pulse-rate tracker": "नाडी दर ट्रॅकर",
      "Record your heart rate in beats per minute":
        "प्रति मिनिट हृदयाचे ठोके नोंदवा",
      "Heart rate (BPM)": "हृदयगती (BPM)",
      "Save pulse rate": "नाडी दर जतन करा",
      "Symptom timeline": "लक्षणांची कालरेषा",
      "Record what changed, severity, and duration":
        "बदल, तीव्रता आणि कालावधी नोंदवा",
      Symptom: "लक्षण",
      Severity: "तीव्रता",
      "Choose severity": "तीव्रता निवडा",
      Mild: "सौम्य",
      Moderate: "मध्यम",
      Severe: "गंभीर",
      Unsure: "निश्चित नाही",
      Duration: "कालावधी",
      Date: "तारीख",
      "Additional notes": "अतिरिक्त नोंदी",
      "Add timeline entry": "कालरेषेत नोंद जोडा",
      "Medication list": "औषधांची यादी",
      "Keep a record of medicines as prescribed":
        "डॉक्टरांनी सांगितलेल्या औषधांची नोंद ठेवा",
      "Medication name": "औषधाचे नाव",
      "Dosage as prescribed": "सांगितलेला डोस",
      Schedule: "वेळापत्रक",
      "Date added": "जोडल्याची तारीख",
      "CareNote does not recommend medicines or doses. Follow your clinician’s instructions.":
        "CareNote औषधे किंवा डोस सुचवत नाही. डॉक्टरांच्या सूचनांचे पालन करा.",
      "Save medication": "औषध जतन करा",
      "Appointment preparation": "डॉक्टरांच्या भेटीची तयारी",
      "Keep your questions ready for the doctor":
        "डॉक्टरांसाठी प्रश्न तयार ठेवा",
      "Questions for your appointment": "भेटीसाठी प्रश्न",
      "Save appointment questions": "भेटीचे प्रश्न जतन करा",
      "Saved health records": "जतन केलेल्या आरोग्य नोंदी",
      "recent entries · newest first": "अलीकडील नोंदी · नवीन आधी",
      "Your health log is ready": "तुमची आरोग्य नोंद तयार आहे",
      "Save a measurement, symptom, medication, or appointment question above. Your saved entries will appear here.":
        "वर मोजमाप, लक्षण, औषध किंवा भेटीचा प्रश्न जतन करा. जतन केलेल्या नोंदी येथे दिसतील.",
      Delete: "हटवा",
      "Make sense of your symptoms.": "तुमची लक्षणे समजून घ्या.",
      "Prepare for better conversations.":
        "आरोग्यतज्ज्ञांशी चांगल्या संवादाची तयारी करा.",
      "Organize what you’re feeling, track changes over time, and create a clear summary to discuss with a healthcare professional.":
        "तुमची लक्षणे व्यवस्थित नोंदवा, कालांतराने होणारे बदल पाहा आणि आरोग्यतज्ज्ञांशी चर्चा करण्यासाठी स्पष्ट सारांश तयार करा.",
      "Create your workspace": "तुमचे कार्यक्षेत्र तयार करा",
      "How the model works →": "मॉडेल कसे कार्य करते →",
      "No external AI API": "बाह्य AI API नाही",
      "You control saved reports": "जतन केलेल्या अहवालांवर तुमचे नियंत्रण",
      "Exportable summaries": "निर्यात करता येणारे सारांश",
      "Symptom overview": "लक्षणांचा आढावा",
      "Personal health notes": "वैयक्तिक आरोग्य नोंदी",
      "HOW HAVE YOU BEEN FEELING?": "तुम्हाला कसे वाटत आहे?",
      Fatigue: "थकवा",
      Headache: "डोकेदुखी",
      "+ Add symptom": "+ लक्षण जोडा",
      "SEVERITY OVER TIME": "कालांतराने तीव्रता",
      "Illustrative only": "फक्त उदाहरण",
      "Ready to share": "सामायिक करण्यास तयार",
      "Clear, structured summary": "स्पष्ट, व्यवस्थित सारांश",
      "Guided symptom intake": "मार्गदर्शित लक्षण नोंद",
      "Capture symptoms, duration, severity, and progression in a calm, step-by-step flow.":
        "सोप्या टप्प्यांमध्ये लक्षणे, कालावधी, तीव्रता आणि बदल नोंदवा.",
      "Track your history": "तुमचा इतिहास नोंदवा",
      "Review saved summaries and notice changes in what you have reported over time.":
        "जतन केलेले सारांश पाहा आणि कालांतराने नोंदवलेल्या बदलांकडे लक्ष द्या.",
      "Shareable reports": "सामायिक करता येणारे अहवाल",
      "Export a print-friendly PDF designed to support—not replace—a clinical conversation.":
        "वैद्यकीय संवादाला मदत करणारा, त्याची जागा न घेणारा PDF निर्यात करा.",
      "Transparent ML": "पारदर्शक ML",
      "Inspect dataset limitations and model evaluation rather than mistaking a label for a diagnosis.":
        "लेबलला निदान समजण्याऐवजी डेटासेटच्या मर्यादा आणि मॉडेलचे मूल्यमापन तपासा.",
      "Built for organization, not diagnosis.":
        "व्यवस्थापनासाठी बनवलेले, निदानासाठी नाही.",
      "CareNote is an educational prototype. Its model and warning checklist are not clinically validated and cannot determine whether you are safe.":
        "CareNote हा शैक्षणिक नमुना आहे. त्याचे मॉडेल आणि इशारा यादी वैद्यकीयदृष्ट्या प्रमाणित नाहीत आणि तुमची सुरक्षितता ठरवू शकत नाहीत.",
      "Read safety notes →": "सुरक्षिततेच्या सूचना वाचा →",
      "Report history": "अहवाल इतिहास",
      "Find, review, export, or remove a saved symptom summary.":
        "जतन केलेला लक्षण सारांश शोधा, पाहा, निर्यात करा किंवा हटवा.",
      "Search reports": "अहवाल शोधा",
      Search: "शोधा",
      Clear: "पुसून टाका",
      "No matching reports": "जुळणारे अहवाल नाहीत",
      "No reports yet": "अजून अहवाल नाहीत",
      "Try another search term. Your saved summaries will appear here.":
        "दुसरा शोध शब्द वापरा. तुमचे जतन केलेले सारांश येथे दिसतील.",
      "Understand the model.": "मॉडेल समजून घ्या.",
      "What this application can do, what it cannot do, and where its data comes from.":
        "हे अॅप काय करू शकते, काय करू शकत नाही आणि त्याचा डेटा कुठून येतो.",
      "Not a diagnostic tool": "हे निदानाचे साधन नाही",
      "CareNote is an educational prototype. A model label is a dataset classification—not a diagnosis, medical probability, or treatment recommendation. The warning-sign checklist is incomplete; a negative screen cannot rule out an emergency.":
        "CareNote हा शैक्षणिक नमुना आहे. मॉडेल लेबल हे डेटासेटचे वर्गीकरण आहे—निदान, वैद्यकीय शक्यता किंवा उपचार सल्ला नाही. इशारा यादी अपूर्ण आहे; नकारात्मक तपासणीमुळे आपत्कालीन स्थिती नाकारता येत नाही.",
      "Dataset available": "डेटासेट उपलब्ध",
      "Local CSV required for classifier": "क्लासिफायरसाठी स्थानिक CSV आवश्यक",
      "Unique patterns": "वेगळे नमुने",
      "After exact pattern deduplication": "एकसारखे नमुने काढल्यानंतर",
      Classes: "वर्ग",
      "Dataset labels, not diseases diagnosed":
        "डेटासेट लेबले, निदान केलेले आजार नाहीत",
      "Symptom features": "लक्षण वैशिष्ट्ये",
      "Available in source dataset": "मूळ डेटासेटमध्ये उपलब्ध",
      "Evaluation snapshot": "मूल्यमापन सारांश",
      "Held-out dataset benchmark only":
        "फक्त वेगळ्या ठेवलेल्या डेटासेटचा बेंचमार्क",
      Accuracy: "अचूकता",
      "Macro F1": "मॅक्रो F1",
      "Training rows": "प्रशिक्षण ओळी",
      "Test rows": "चाचणी ओळी",
      "These metrics do not establish clinical validity. A small or constructed dataset can yield unstable results and may not represent real patient encounters.":
        "हे मापदंड वैद्यकीय वैधता सिद्ध करत नाहीत. लहान किंवा तयार केलेला डेटासेट अस्थिर निकाल देऊ शकतो आणि खऱ्या रुग्णांच्या भेटी दर्शवेलच असे नाही.",
      "Classifier not loaded": "क्लासिफायर लोड झालेले नाही",
      "Safety by design": "डिझाइनमधील सुरक्षितता",
      "Independent warning checklist": "स्वतंत्र इशारा यादी",
      "Configured warning signs are checked separately from the classifier.":
        "ठरवलेले इशारे क्लासिफायरपासून स्वतंत्रपणे तपासले जातात.",
      "No confidence-as-diagnosis": "विश्वास गुण म्हणजे निदान नाही",
      "The interface does not present classifier probabilities as medical certainty.":
        "इंटरफेस क्लासिफायरची शक्यता वैद्यकीय निश्चितता म्हणून दाखवत नाही.",
      "Local-only inference": "फक्त स्थानिक अनुमान",
      "No external AI API is used by this implementation.":
        "या आवृत्तीत बाह्य AI API वापरले जात नाही.",
      "Human clinical judgment": "मानवी वैद्यकीय निर्णय",
      "Qualified professionals must interpret symptoms in context.":
        "पात्र तज्ज्ञांनी संदर्भानुसार लक्षणांचा अर्थ लावावा.",
      "Before any production healthcare use": "प्रत्यक्ष आरोग्य वापरापूर्वी",
      "Have warning-sign rules reviewed and approved by qualified clinicians.":
        "इशारा नियमांची पात्र डॉक्टरांकडून तपासणी व मान्यता घ्या.",
      "Validate on representative, independently collected data with documented consent and provenance.":
        "नोंदवलेली संमती आणि स्रोत असलेल्या स्वतंत्र, प्रतिनिधिक डेटावर पडताळणी करा.",
      "Perform privacy, security, accessibility, bias, and risk-management reviews.":
        "गोपनीयता, सुरक्षा, प्रवेशयोग्यता, पक्षपात आणि जोखीम व्यवस्थापनाची समीक्षा करा.",
      "Establish clinical governance, incident reporting, monitoring, and change control.":
        "वैद्यकीय प्रशासन, घटना अहवाल, देखरेख आणि बदल नियंत्रण स्थापन करा.",
      "Do not use this prototype for diagnosis, triage, or treatment decisions.":
        "या नमुन्याचा वापर निदान, प्राधान्य ठरवणे किंवा उपचार निर्णयांसाठी करू नका.",
      "Your profile": "तुमची प्रोफाइल",
      "Manage your sign-in credentials and the information stored in your workspace.":
        "साइन-इन तपशील आणि कार्यक्षेत्रातील माहिती व्यवस्थापित करा.",
      "Account details": "खात्याचा तपशील",
      "Member since": "सदस्य झाल्यापासून",
      "Change password": "पासवर्ड बदला",
      "Current password": "सध्याचा पासवर्ड",
      "New password": "नवीन पासवर्ड",
      "Confirm password": "पासवर्डची पुष्टी करा",
      "Update password": "पासवर्ड अद्ययावत करा",
      "Privacy controls": "गोपनीयता नियंत्रण",
      "Export your saved data": "जतन केलेला डेटा निर्यात करा",
      "Download report content as JSON.":
        "अहवालातील माहिती JSON स्वरूपात डाउनलोड करा.",
      "Export JSON ↓": "JSON निर्यात करा ↓",
      "Delete a report": "अहवाल हटवा",
      "Remove individual summaries from History.":
        "इतिहासातून स्वतंत्र सारांश हटवा.",
      "Open history →": "इतिहास उघडा →",
      "Delete account and reports": "खाते आणि अहवाल हटवा",
      "Type DELETE to confirm": "पुष्टीसाठी DELETE टाइप करा",
      "Delete account": "खाते हटवा",
      "Let’s document how you’re feeling.": "तुम्हाला कसे वाटते ते नोंदवूया.",
      "This helps organize your notes. It does not diagnose or determine whether symptoms are safe.":
        "यामुळे तुमच्या नोंदी व्यवस्थित होतात. हे निदान करत नाही किंवा लक्षणे सुरक्षित आहेत का हे ठरवत नाही.",
      "Back to dashboard": "डॅशबोर्डवर परत जा",
      Symptoms: "लक्षणे",
      "What are you feeling?": "तुम्हाला काय जाणवत आहे?",
      Details: "तपशील",
      "How has it changed?": "काय बदल झाला आहे?",
      Review: "पुनरावलोकन",
      "Check your summary": "तुमचा सारांश तपासा",
      "Choose your symptoms": "तुमची लक्षणे निवडा",
      "Select all that apply. Use search to find a symptom quickly.":
        "लागू होणारी सर्व लक्षणे निवडा. शोध वापरून लक्षण पटकन शोधा.",
      "All symptoms": "सर्व लक्षणे",
      "symptoms selected": "लक्षणे निवडली",
      "Clear selection": "निवड काढून टाका",
      "Add a little context": "थोडा संदर्भ जोडा",
      "Your own description helps make the report more useful.":
        "तुमचे वर्णन अहवाल अधिक उपयुक्त बनवते.",
      "How long have you experienced these symptoms?":
        "ही लक्षणे किती काळापासून आहेत?",
      "Choose duration": "कालावधी निवडा",
      "How would you describe the severity?": "तीव्रतेचे वर्णन कसे कराल?",
      "Compared with when it started": "सुरुवातीच्या तुलनेत",
      "Not sure": "निश्चित नाही",
      Improving: "सुधारत आहे",
      "About the same": "जवळपास तसेच",
      "Getting worse": "वाढत आहे",
      "Comes and goes": "येत-जात असते",
      "Additional notes": "अतिरिक्त नोंदी",
      "Only include information you are comfortable storing in your account.":
        "खात्यात जतन करण्यास तुम्हाला योग्य वाटणारी माहितीच द्या.",
      "Health measurements": "आरोग्य मोजमाप",
      "These self-reported values will be saved in this report. Leave anything blank if you do not know it.":
        "तुम्ही दिलेली मूल्ये या अहवालात जतन होतील. माहिती नसल्यास रिकामे ठेवा.",
      "Questions for your doctor": "डॉक्टरांसाठी प्रश्न",
      "Review before creating": "तयार करण्यापूर्वी तपासा",
      "Check your entries. You can go back to make changes.":
        "तुमच्या नोंदी तपासा. बदल करण्यासाठी मागे जाऊ शकता.",
      "Symptom summary preview": "लक्षण सारांश पूर्वदृश्य",
      "PRIVATE NOTE": "खाजगी नोंद",
      "No symptoms selected": "कोणतीही लक्षणे निवडलेली नाहीत",
      "Not provided": "दिलेली नाही",
      "Before you continue": "पुढे जाण्यापूर्वी",
      "This app cannot rule out emergencies. For severe, sudden, or worsening symptoms—or if you are worried—seek medical advice promptly. Do not wait for an app result.":
        "हे अॅप आपत्कालीन स्थिती नाकारू शकत नाही. गंभीर, अचानक किंवा वाढणारी लक्षणे असल्यास—किंवा काळजी वाटत असल्यास—लवकर वैद्यकीय सल्ला घ्या. अॅपच्या निकालाची वाट पाहू नका.",
      "Health details": "आरोग्य तपशील",
      Back: "मागे",
      "Continue →": "पुढे →",
      "Create symptom summary": "लक्षण सारांश तयार करा",
      "A clearer picture starts with your notes.":
        "तुमच्या नोंदींमधून स्पष्ट चित्र सुरू होते.",
      "There are no right or wrong answers. If you don’t know something, it’s okay to leave it blank.":
        "येथे बरोबर किंवा चूक उत्तर नाही. माहिती नसेल तर रिकामे ठेवू शकता.",
      "Your answers, your control": "तुमची उत्तरे, तुमचे नियंत्रण",
      "You can edit or delete saved reports.":
        "तुम्ही जतन केलेले अहवाल बदलू किंवा हटवू शकता.",
      "Local machine learning": "स्थानिक मशीन लर्निंग",
      "Not medical advice": "वैद्यकीय सल्ला नाही",
      "A clinician can interpret symptoms in context.":
        "डॉक्टर संदर्भानुसार लक्षणांचा अर्थ लावू शकतात.",
      "A structured note to help you prepare for a healthcare conversation.":
        "आरोग्यतज्ज्ञांशी चर्चेची तयारी करण्यासाठी व्यवस्थित नोंद.",
      "Edit report": "अहवाल संपादित करा",
      "↓ Download PDF": "↓ PDF डाउनलोड करा",
      "Warning-sign screening needs attention":
        "इशारा चिन्हांच्या तपासणीकडे लक्ष द्या",
      "Screening limitation": "तपासणीची मर्यादा",
      "What you reported": "तुम्ही काय नोंदवले",
      "Based on your entries": "तुमच्या नोंदींवर आधारित",
      "YOUR NOTES": "तुमच्या नोंदी",
      "Self-reported severity": "स्वतः सांगितलेली तीव्रता",
      Progression: "बदल",
      "Medication list entered": "औषधांची यादी नोंदवली",
      "Dosage:": "डोस:",
      "Schedule:": "वेळापत्रक:",
      "No optional health measurements were added to this report.":
        "या अहवालात पर्यायी आरोग्य मोजमाप जोडलेली नाहीत.",
      "To save reusable appointment questions and health logs, visit":
        "पुन्हा वापरता येणारे भेटीचे प्रश्न आणि आरोग्य नोंदी जतन करण्यासाठी येथे जा",
      "Local model output": "स्थानिक मॉडेल निकाल",
      "Dataset label · not a diagnosis": "डेटासेट लेबल · निदान नाही",
      "Model result unavailable": "मॉडेलचा निकाल उपलब्ध नाही",
      "The symptom summary and PDF export still work without a model dataset.":
        "मॉडेल डेटासेट नसतानाही लक्षण सारांश आणि PDF निर्यात कार्य करतात.",
      "Bring this to a conversation": "भेटीवेळी हे सोबत घ्या",
      "This report can help you remember what to mention. A qualified healthcare professional can assess your symptoms alongside your history and examination.":
        "काय सांगायचे ते लक्षात ठेवण्यास हा अहवाल मदत करू शकतो. पात्र आरोग्यतज्ज्ञ तुमचा इतिहास आणि तपासणीसह लक्षणांचे मूल्यांकन करू शकतात.",
      "Review your timeline": "तुमची कालरेषा पाहा",
      "When it started and how it changed.": "कधी सुरू झाले आणि कसे बदलले.",
      "Share relevant context": "संबंधित माहिती सांगा",
      "Include medicines or existing conditions directly with your clinician.":
        "औषधे किंवा सध्याच्या स्थितींबद्दल डॉक्टरांना सांगा.",
      "Seek care when needed": "गरज पडल्यास वैद्यकीय मदत घ्या",
      "Don’t delay urgent help while preparing a report.":
        "अहवाल तयार करताना तातडीची मदत घेण्यास उशीर करू नका.",
      "Delete this report": "हा अहवाल हटवा",
      "Select at least one symptom to continue.":
        "पुढे जाण्यासाठी किमान एक लक्षण निवडा.",
      "Select at least one symptom before creating the summary.":
        "सारांश तयार करण्यापूर्वी किमान एक लक्षण निवडा.",
      "Enter a temperature to see the conversion.":
        "रूपांतरण पाहण्यासाठी तापमान टाका.",
      "Language preference updated.": "भाषेची पसंती अद्ययावत केली.",
      "YOUR PERSONAL WORKSPACE": "तुमचे वैयक्तिक कार्यक्षेत्र",
      "Keep your health notes clear, organized, and yours.":
        "तुमच्या आरोग्याच्या नोंदी स्पष्ट, व्यवस्थित आणि तुमच्या नियंत्रणात ठेवा.",
      "Save symptom summaries, review changes, and take a more structured note to your next appointment.":
        "लक्षणांचे सारांश जतन करा, बदल पाहा आणि पुढील भेटीसाठी अधिक व्यवस्थित नोंद तयार करा.",
      "✳ Local-first by default": "✳ डीफॉल्टने स्थानिक",
      "▤ Export whenever you need": "▤ गरजेनुसार निर्यात करा",
      "⌁ Designed for clarity": "⌁ स्पष्टतेसाठी तयार केलेले",
      "Create your account": "तुमचे खाते तयार करा",
      "Welcome back": "पुन्हा स्वागत आहे",
      "Reset your password": "पासवर्ड रीसेट करा",
      "Choose a new password": "नवीन पासवर्ड निवडा",
      "Start your private symptom notebook.":
        "तुमची वैयक्तिक लक्षण नोंदवही सुरू करा.",
      "Sign in to continue to your workspace.":
        "तुमच्या कार्यक्षेत्रात जाण्यासाठी साइन इन करा.",
      "If your account exists, we'll send a reset link when email is configured.":
        "खाते अस्तित्वात असल्यास, ईमेल सुविधा सेट केल्यावर रीसेट लिंक पाठवली जाईल.",
      "Choose a strong password for your account.":
        "तुमच्या खात्यासाठी मजबूत पासवर्ड निवडा.",
      "Email address": "ईमेल पत्ता",
      Password: "पासवर्ड",
      "Confirm new password": "नवीन पासवर्डची पुष्टी करा",
      "Send reset link": "रीसेट लिंक पाठवा",
      "Already have an account?": "तुमचे खाते आधीच आहे का?",
      "Forgot password?": "पासवर्ड विसरलात?",
      "Back to sign in": "साइन इनकडे परत जा",
      "At least 12 characters": "किमान १२ अक्षरे",
      "Search by title or symptom…": "शीर्षक किंवा लक्षणानुसार शोधा…",
      "Download PDF": "PDF डाउनलोड करा",
      Edit: "संपादित करा",
      "YOUR NOTEBOOK": "तुमची नोंदवही",
      "TRANSPARENCY & RESPONSIBLE AI": "पारदर्शकता आणि जबाबदार AI",
      "LOCAL MODEL LOADED": "स्थानिक मॉडेल लोड झाले",
      "MODEL UNAVAILABLE": "मॉडेल उपलब्ध नाही",
      "PRIVATE BY DESIGN · LOCAL ML": "गोपनीयतेला प्राधान्य · स्थानिक ML",
      DEMO: "डेमो",
      "ACCOUNT & PRIVACY": "खाते आणि गोपनीयता",
      "Permanently delete this account and all saved reports?":
        "हे खाते आणि सर्व जतन केलेले अहवाल कायमचे हटवायचे का?",
      "SYMPTOM SUMMARY": "लक्षणांचा सारांश",
      "Selected signs:": "निवडलेली चिन्हे:",
      Height: "उंची",
      Weight: "वजन",
      "Blood pressure ·": "रक्तदाब ·",
      "Temperature ·": "तापमान ·",
      "Pulse ·": "नाडी ·",
      "Don't delay urgent help while preparing a report.":
        "अहवाल तयार करताना तातडीची मदत घेण्यास उशीर करू नका.",
      "EDIT SAVED REPORT": "जतन केलेला अहवाल संपादित करा",
      "GUIDED INTAKE · 3 STEPS": "मार्गदर्शित नोंद · ३ टप्पे",
      "Update your summary": "तुमचा सारांश अद्ययावत करा",
      "← Back to dashboard": "← डॅशबोर्डवर परत जा",
      "Blood pressure — systolic (mmHg)": "रक्तदाब — सिस्टोलिक (mmHg)",
      "(optional · one medicine per line)": "(पर्यायी · प्रत्येक ओळीत एक औषध)",
      "Format each line as: name | dosage as prescribed | schedule. CareNote does not recommend medication or doses.":
        "प्रत्येक ओळीचा नमुना: नाव | सांगितलेला डोस | वेळापत्रक. CareNote औषधे किंवा डोस सुचवत नाही.",
      "ⓘ Before you continue": "ⓘ पुढे जाण्यापूर्वी",
      "← Back": "← मागे",
      "Search symptoms…": "लक्षणे शोधा…",
      "e.g. 170": "उदा. १७०",
      "e.g. 68.5": "उदा. ६८.५",
      "e.g. 120": "उदा. १२०",
      "e.g. 80": "उदा. ८०",
      "e.g. 37": "उदा. ३७",
      "e.g. 72": "उदा. ७२",
      "Medicine name | dosage as prescribed | schedule":
        "औषधाचे नाव | सांगितलेला डोस | वेळापत्रक",
      "What should I ask at my appointment?": "भेटीदरम्यान मी काय विचारावे?",
      "CareNote does not recommend medicines or doses. Follow your clinician's instructions.":
        "CareNote औषधे किंवा डोस सुचवत नाही. तुमच्या डॉक्टरांच्या सूचनांचे पालन करा.",
      "⌁ ◷ ▤ ✎": "⌁ ◷ ▤ ✎",
      "BMI:": "BMI:",
      "Blood pressure:": "रक्तदाब:",
      "Temperature:": "तापमान:",
      "Pulse:": "नाडी:",
      "Symptom:": "लक्षण:",
      "Medication:": "औषध:",
      "Appointment questions": "भेटीचे प्रश्न",
      "Name on the package/prescription": "पॅकेट/प्रिस्क्रिप्शनवरील नाव",
      "Enter exactly as prescribed": "जसे लिहिले आहे तसेच नोंदवा",
      "e.g. schedule as prescribed": "उदा. सांगितलेले वेळापत्रक",
      "e.g. headache": "उदा. डोकेदुखी",
      "e.g. 2 days": "उदा. २ दिवस",
      "What changed, or what seemed to trigger it?":
        "काय बदलले किंवा कशामुळे त्रास सुरू झाल्यासारखे वाटले?",
      "1. What might explain these symptoms?\n2. What changes should I monitor?\n3. When should I follow up?":
        "१. या लक्षणांचे कारण काय असू शकते?\n२. कोणत्या बदलांकडे लक्ष द्यावे?\n३. पुन्हा कधी संपर्क साधावा?",
      "Available Not configured": "उपलब्ध · कॉन्फिगर केलेले नाही",
      "＋ New symptom report": "＋ नवीन लक्षण अहवाल",
      "＋ New report": "＋ नवीन अहवाल",
      "· symptoms": "· लक्षणे",
      "· symptoms ·": "· लक्षणे ·",
      "No external AI API is called.": "बाह्य AI API ला कॉल केला जात नाही.",
      "Search symptoms": "लक्षणे शोधा",
      "Organize what you're feeling, track changes over time, and create a clear summary to discuss with a healthcare professional.":
        "तुम्हाला कसे वाटते ते व्यवस्थित नोंदवा, काळानुसार बदल नोंदवा आणि आरोग्यतज्ज्ञांशी चर्चा करण्यासाठी स्पष्ट सारांश तयार करा.",
      "✓ No external AI API": "✓ बाह्य AI API नाही",
      "✓ You control saved reports": "✓ जतन केलेल्या अहवालांवर तुमचे नियंत्रण",
      "✓ Exportable summaries": "✓ निर्यात करता येणारे सारांश",
      "Copy your original data/dataset.csv into this project's data/ folder. Do not use synthetic rows to claim medical performance.":
        "तुमची मूळ data/dataset.csv फाइल या प्रकल्पाच्या data/ फोल्डरमध्ये कॉपी करा. वैद्यकीय कामगिरीचा दावा करण्यासाठी कृत्रिम डेटा वापरू नका.",
      "Your symptom summary": "तुमचा लक्षण सारांश",
      "No questions added yet. Consider asking your clinician what symptoms to monitor, when to follow up, and whether any next steps are appropriate.":
        "अजून प्रश्न जोडलेले नाहीत. कोणत्या लक्षणांकडे लक्ष द्यावे, पुन्हा कधी संपर्क साधावा आणि पुढील पावले कोणती असावीत हे डॉक्टरांना विचारा.",
      "Separate from the ML prediction": "ML अंदाजापासून स्वतंत्र",
      Underweight: "कमी वजन",
      "Healthy weight range": "निरोगी वजनाची श्रेणी",
      "Overweight range": "जास्त वजनाची श्रेणी",
      "Obesity range": "लठ्ठपणाची श्रेणी",
      "Name not provided": "नाव दिलेले नाही",
      "Not entered": "नोंदवलेले नाही",
      "Abdominal Pain": "पोटदुखी",
      "Abnormal Menstruation": "अनियमित मासिक पाळी",
      Acidity: "आम्लपित्त",
      "Acute Liver Failure": "तीव्र यकृत निकामी होणे",
      "Altered Sensorium": "जाणीव किंवा मानसिक स्थितीत बदल",
      Anxiety: "चिंता",
      "Back Pain": "पाठदुखी",
      "Belly Pain": "पोटदुखी",
      Blackheads: "ब्लॅकहेड्स",
      "Bladder Discomfort": "मूत्राशयात अस्वस्थता",
      Blister: "फोड",
      "Blood In Sputum": "कफात रक्त",
      "Bloody Stool": "मलात रक्त",
      "Blurred And Distorted Vision": "अस्पष्ट किंवा विकृत दिसणे",
      Breathlessness: "धाप लागणे",
      "Brittle Nails": "ठिसूळ नखे",
      Bruising: "शरीरावर निळसर डाग",
      "Burning Micturition": "लघवी करताना जळजळ",
      "Chest Pain": "छातीत दुखणे",
      Chills: "थंडी वाजणे",
      "Cold Hands And Feets": "हात-पाय थंड पडणे",
      Coma: "कोमा",
      Congestion: "कोंदटपणा",
      Constipation: "बद्धकोष्ठता",
      "Continuous Feel Of Urine": "सतत लघवीची भावना",
      "Continuous Sneezing": "सतत शिंका येणे",
      Cough: "खोकला",
      Cramps: "आकडी",
      "Dark Urine": "गडद रंगाची लघवी",
      Dehydration: "निर्जलीकरण",
      Depression: "नैराश्य",
      Diarrhoea: "जुलाब",
      "Dischromic Patches": "त्वचेवरील रंगाचे डाग",
      "Distention Of Abdomen": "पोट फुगणे",
      Dizziness: "चक्कर येणे",
      "Drying And Tingling Lips": "ओठ कोरडे पडणे किंवा मुंग्या येणे",
      "Enlarged Thyroid": "थायरॉईड ग्रंथी वाढणे",
      "Excessive Hunger": "अतिशय भूक लागणे",
      "Extra Marital Contacts": "विवाहबाह्य लैंगिक संपर्क",
      "Family History": "कौटुंबिक इतिहास",
      "Fast Heart Rate": "हृदयाचे ठोके वेगाने पडणे",
      Fatigue: "थकवा",
      "Fluid Overload": "शरीरात अतिरिक्त द्रव साचणे",
      "Foul Smell Of Urine": "लघवीला दुर्गंध येणे",
      "Foul Smell Ofurine": "लघवीला दुर्गंध येणे",
      Headache: "डोकेदुखी",
      "High Fever": "जास्त ताप",
      "Hip Joint Pain": "नितंबाच्या सांध्यात दुखणे",
      "History Of Alcohol Consumption": "मद्यपानाचा इतिहास",
      "Increased Appetite": "भूक वाढणे",
      Indigestion: "अपचन",
      "Inflammatory Nails": "नखांना सूज येणे",
      "Internal Itching": "आतील खाज",
      "Irregular Sugar Level": "रक्तातील साखरेची अनियमित पातळी",
      Irritability: "चिडचिड",
      "Irritation In Anus": "गुदद्वारात जळजळ",
      Itching: "खाज",
      "Joint Pain": "सांधेदुखी",
      "Knee Pain": "गुडघेदुखी",
      "Lack Of Concentration": "एकाग्रता कमी होणे",
      Lethargy: "सुस्ती",
      "Loss Of Appetite": "भूक न लागणे",
      "Loss Of Balance": "तोल जाणे",
      "Loss Of Smell": "वास घेण्याची क्षमता कमी होणे",
      Malaise: "अस्वस्थ वाटणे",
      "Mild Fever": "किरकोळ ताप",
      "Mood Swings": "मनःस्थितीत बदल",
      "Movement Stiffness": "हालचालींमध्ये कडकपणा",
      "Mucoid Sputum": "श्लेष्मायुक्त कफ",
      "Muscle Pain": "स्नायूदुखी",
      "Muscle Wasting": "स्नायूंचा क्षय",
      "Muscle Weakness": "स्नायू कमकुवत होणे",
      Nausea: "मळमळ",
      "Neck Pain": "मानदुखी",
      "Nodal Skin Eruptions": "त्वचेवर उठलेले पुरळ",
      Obesity: "लठ्ठपणा",
      "Pain Behind The Eyes": "डोळ्यांच्या मागे दुखणे",
      "Pain During Bowel Movements": "शौच करताना दुखणे",
      "Pain In Anal Region": "गुदद्वाराच्या भागात दुखणे",
      "Painful Walking": "चालताना दुखणे",
      Palpitations: "हृदयाची धडधड जाणवणे",
      "Passage Of Gases": "वायू जाणे",
      "Patches In Throat": "घशात डाग",
      Phlegm: "कफ",
      Polyuria: "वारंवार जास्त लघवी होणे",
      Prognosis: "रोगाचा संभाव्य प्रवास",
      "Prominent Veins On Calf": "पोटरीवरील ठळक शिरा",
      "Puffy Face And Eyes": "चेहरा आणि डोळ्यांभोवती सूज",
      "Pus Filled Pimples": "पू भरलेले मुरुम",
      "Receiving Blood Transfusion": "रक्त चढवण्याचा इतिहास",
      "Receiving Unsterile Injections": "अस्वच्छ इंजेक्शन घेतल्याचा इतिहास",
      "Red Sore Around Nose": "नाकाभोवती लाल जखम",
      "Red Spots Over Body": "शरीरावर लाल डाग",
      "Redness Of Eyes": "डोळे लाल होणे",
      Restlessness: "अस्वस्थता",
      "Runny Nose": "नाक वाहणे",
      "Rusty Sputum": "गंजट रंगाचा कफ",
      Scurring: "दातांवर थर जमा होणे",
      Shivering: "थरथर कापणे",
      "Silver Like Dusting": "चांदीसारखा खवलेदार थर",
      "Sinus Pressure": "सायनसमध्ये दाब",
      "Skin Peeling": "त्वचा सोलवटणे",
      "Skin Rash": "त्वचेवर पुरळ",
      "Slurred Speech": "अस्पष्ट बोलणे",
      "Small Dents In Nails": "नखांवर लहान खळगे",
      "Spinning Movements": "भोवळ येणे",
      "Spotting Urination": "लघवीत डाग किंवा रक्ताचे चिन्ह",
      "Stiff Neck": "मान आखडणे",
      "Stomach Bleeding": "पोट किंवा पचनसंस्थेत रक्तस्राव",
      "Stomach Pain": "पोटदुखी",
      "Sunken Eyes": "खोल गेलेले डोळे",
      Sweating: "घाम येणे",
      "Swelled Lymph Nodes": "लसिका ग्रंथींना सूज",
      "Swelling Joints": "सांध्यांना सूज",
      "Swelling Of Stomach": "पोटाला सूज",
      "Swollen Blood Vessels": "रक्तवाहिन्या सुजणे",
      "Swollen Extremeties": "हात-पायांना सूज",
      "Swollen Legs": "पायांना सूज",
      "Throat Irritation": "घशात खवखव",
      "Toxic Look (Typhos)": "गंभीर आजारी दिसणे (टायफससारखे)",
      "Ulcers On Tongue": "जिभेवर व्रण",
      Unsteadiness: "अस्थिरपणा",
      "Visual Disturbances": "दृष्टीत अडथळे",
      Vomiting: "उलटी",
      "Watering From Eyes": "डोळ्यांतून पाणी येणे",
      "Weakness In Limbs": "हात-पाय कमकुवत होणे",
      "Weakness Of One Body Side": "शरीराच्या एका बाजूला कमकुवतपणा",
      "Weight Gain": "वजन वाढणे",
      "Weight Loss": "वजन कमी होणे",
      "Yellow Crust Ooze": "पिवळसर खपली किंवा स्त्राव",
      "Yellow Urine": "पिवळी लघवी",
      "Yellowing Of Eyes": "डोळे पिवळे पडणे",
      "Yellowish Skin": "त्वचा पिवळी पडणे",
      "Breathing & senses": "श्वसन आणि संवेदना",
      Digestive: "पचन",
      General: "सामान्य",
      "Mood & cognition": "मनःस्थिती आणि विचार",
      Other: "इतर",
      "Pain & movement": "वेदना आणि हालचाल",
      "Skin & hair": "त्वचा आणि केस",
      "SYMPTOM SUMMARY ·": "लक्षण सारांश ·",
      "· A local-first symptom organization tool":
        "· लक्षण नोंदवण्यासाठी स्थानिक साधन",
      "BMI & body measurements": "BMI आणि शरीराची मोजमापे",
      "Your health workspace": "तुमचे आरोग्य कार्यक्षेत्र",
      "Choose a tracker to add a record, review its history, and explore your trends. Each tracker has its own page.":
        "नोंद जोडण्यासाठी, इतिहास पाहण्यासाठी आणि कल समजून घेण्यासाठी ट्रॅकर निवडा. प्रत्येक ट्रॅकरचे स्वतंत्र पृष्ठ आहे.",
      "Each record is saved to your account. The latest saved value is also shown in your profile. These logs are for personal documentation and do not diagnose conditions or replace clinical advice.":
        "प्रत्येक नोंद तुमच्या खात्यात जतन होते. नवीनतम मूल्य तुमच्या प्रोफाइलमध्येही दिसते. या वैयक्तिक नोंदी आहेत; निदान किंवा वैद्यकीय सल्ल्याचा पर्याय नाहीत.",
      "Latest record": "नवीनतम नोंद",
      "No records yet": "अजून नोंदी नाहीत",
      "Start by adding your first entry": "पहिली नोंद जोडून सुरुवात करा",
      "Open tracker": "ट्रॅकर उघडा",
      "All health records": "सर्व आरोग्य नोंदी",
      "PERSONAL TRACKER": "वैयक्तिक ट्रॅकर",
      "Log dated height and weight measurements. BMI is a screening measure, not a diagnosis.":
        "तारीखेसह उंची आणि वजन नोंदवा. BMI हे प्राथमिक तपासणी मोजमाप आहे, निदान नाही.",
      "Save each entry to your account. Entries remain in this tracker’s history.":
        "प्रत्येक नोंद तुमच्या खात्यात जतन करा. नोंदी या ट्रॅकरच्या इतिहासात राहतील.",
      "Add a record": "नोंद जोडा",
      "Entries are saved to your account and remain in this tracker's history.":
        "नोंदी तुमच्या खात्यात जतन होतात आणि या ट्रॅकरच्या इतिहासात राहतात.",
      "Save BMI measurement": "BMI मोजमाप जतन करा",
      "Save blood pressure": "रक्तदाब जतन करा",
      "Save temperature": "तापमान जतन करा",
      "Save pulse": "नाडी जतन करा",
      "Add timeline entry": "कालरेषेत नोंद जोडा",
      "Save medication": "औषध जतन करा",
      "Save appointment questions": "भेटीचे प्रश्न जतन करा",
      "Measurement trend": "मोजमापाचा कल",
      "Severity overview": "तीव्रतेचा आढावा",
      "Medication history": "औषधांचा इतिहास",
      "Appointment history": "भेटीचा इतिहास",
      "A visual summary of your saved readings, newest entries included.":
        "तुमच्या जतन केलेल्या मोजमापांचा दृश्य सारांश, नवीन नोंदींसह.",
      "Count of symptom entries by self-reported severity.":
        "स्वतः सांगितलेल्या तीव्रतेनुसार लक्षण नोंदींची संख्या.",
      "Your saved entries, ordered by date.":
        "तारीखेनुसार मांडलेल्या तुमच्या जतन केलेल्या नोंदी.",
      "No history yet": "अजून इतिहास नाही",
      "Save your first entry to start building a personal history and trend view.":
        "वैयक्तिक इतिहास आणि कल पाहण्यासाठी पहिली नोंद जतन करा.",
      "Entries by self-reported severity":
        "स्वतः सांगितलेल्या तीव्रतेनुसार नोंदी",
      "Entries by date": "तारखेनुसार नोंदी",
      "Latest saved value": "नवीनतम जतन केलेले मूल्य",
      "Showing up to 12 dated records. This graph is descriptive and does not indicate a diagnosis.":
        "तारीखेसह जास्तीत जास्त १२ नोंदी दाखवल्या आहेत. हा आलेख फक्त नोंदी दाखवतो, निदान नाही.",
      "Systolic is shown as the main line and diastolic as the second line.":
        "मुख्य रेषा सिस्टोलिक आणि दुसरी रेषा डायस्टोलिक दाखवते.",
      "Temperatures are normalized to Celsius for comparison.":
        "तुलनेसाठी तापमान सेल्सिअसमध्ये रूपांतरित केले आहे.",
      "Current health snapshot": "सध्याचा आरोग्य सारांश",
      "Latest saved value and total history count for each tracker. These are personal records, not clinical assessments.":
        "प्रत्येक ट्रॅकरचे नवीनतम मूल्य आणि एकूण नोंदी. या वैयक्तिक नोंदी आहेत, वैद्यकीय मूल्यांकन नाही.",
      "All health records →": "सर्व आरोग्य नोंदी →",
      Updated: "अद्ययावत",
      "saved entries": "जतन केलेल्या नोंदी",
      "Systolic pressure is normally higher than diastolic; check the entered values.":
        "सिस्टोलिक दाब सामान्यतः डायस्टोलिकपेक्षा जास्त असतो; नोंद तपासा.",
      "Enter valid systolic and diastolic readings.":
        "वैध सिस्टोलिक आणि डायस्टोलिक मोजमापे भरा.",
      "Please enter valid values for this record.":
        "या नोंदीसाठी वैध मूल्ये भरा.",
      "Health record saved to your history.":
        "आरोग्य नोंद तुमच्या इतिहासात जतन केली.",
      "Health record deleted.": "आरोग्य नोंद हटवली.",
      "Delete this health record?": "ही आरोग्य नोंद हटवायची का?",
      "Height (cm)": "उंची (सेमी)",
      "Weight (kg)": "वजन (किलो)",
      "Systolic (mmHg)": "सिस्टोलिक (mmHg)",
      "Diastolic (mmHg)": "डायस्टोलिक (mmHg)",
      "Reading date": "नोंदीची तारीख",
      "Measurement date": "मोजमापाची तारीख",
      Temperature: "तापमान",
      Unit: "एकक",
      "°C Celsius": "°C सेल्सिअस",
      "°F Fahrenheit": "°F फॅरेनहाइट",
      "Enter a value to see the conversion.":
        "रूपांतरण पाहण्यासाठी मूल्य टाका.",
      "Heart rate (BPM)": "हृदयगती (BPM)",
      Symptom: "लक्षण",
      Severity: "तीव्रता",
      "Choose severity": "तीव्रता निवडा",
      Duration: "कालावधी",
      Date: "तारीख",
      Notes: "नोंदी",
      "Dosage as prescribed": "सांगितलेला डोस",
      Schedule: "वेळापत्रक",
      "Medication name": "औषधाचे नाव",
      "Questions for your appointment": "भेटीसाठी प्रश्न",
      "Questions for your doctor": "डॉक्टरांसाठी प्रश्न",
      History: "इतिहास",
      Delete: "हटवा",
      Save: "जतन करा",
      record: "नोंद",
      records: "नोंदी",
      entries: "नोंदी",
      entry: "नोंद",
      saved: "जतन केले",
      Profile: "प्रोफाइल",
      "No records saved yet": "अजून नोंदी जतन केलेल्या नाहीत",
      "Your new entries will appear here, with their dates and details.":
        "तुमच्या नवीन नोंदी तारखा आणि तपशीलांसह येथे दिसतील.",
      "BMI is a screening measure, not a diagnosis.":
        "BMI हे प्राथमिक तपासणी मोजमाप आहे, निदान नाही.",
      "A single reading is not enough to diagnose a blood-pressure condition.":
        "एका मोजमापावरून रक्तदाबाच्या स्थितीचे निदान करता येत नाही.",
      "Use the dosage and schedule provided by your clinician or pharmacist.":
        "तुमच्या डॉक्टरांनी किंवा फार्मासिस्टने दिलेला डोस आणि वेळापत्रक वापरा.",
      "Record heart rate in beats per minute.":
        "हृदयाचे ठोके प्रति मिनिट नोंदवा.",
      "Keep a dated record of heart rate in beats per minute.":
        "हृदयगतीची तारीखेसह नोंद ठेवा.",
      "Keep a timeline of symptoms, their severity, duration, and any notes.":
        "लक्षणे, तीव्रता, कालावधी आणि नोंदींची कालरेषा ठेवा.",
      "Document medications and the instructions you have been given. CareNote does not recommend medication or dosage.":
        "औषधे आणि मिळालेल्या सूचना नोंदवा. CareNote औषध किंवा डोस सुचवत नाही.",
      "Write down questions and topics you want to discuss with your clinician.":
        "डॉक्टरांशी चर्चा करायचे प्रश्न आणि विषय लिहून ठेवा.",
      "Temperature conversion is for reference only.":
        "तापमान रूपांतरण फक्त संदर्भासाठी आहे.",
      "Open profile →": "प्रोफाइल उघडा →",
      "See your latest health snapshot": "तुमचा नवीनतम आरोग्य सारांश पाहा",
      "Your profile shows the latest saved value and total history count for every tracker.":
        "तुमचे प्रोफाइल प्रत्येक ट्रॅकरचे नवीनतम जतन केलेले मूल्य आणि एकूण नोंदी दाखवते.",
      "This application is an educational prototype, not a diagnostic tool.":
        "हे अॅप शैक्षणिक नमुना आहे, निदानाचे साधन नाही.",
    },
  };
  const language = document.documentElement.lang || "en";
  const dictionary = catalog[language] || {};
  const normalize = (value) => value.replace(/\s+/g, " ").trim();
  const normalizedDictionary = Object.fromEntries(
    Object.entries(dictionary).map(([key, value]) => [normalize(key), value]),
  );
  const translateTextNode = (node) => {
    if (!node || node.nodeType !== Node.TEXT_NODE || !node.nodeValue.trim())
      return;
    const original = normalize(node.nodeValue);
    const translated = normalizedDictionary[original];
    if (translated && translated !== original) {
      const leading = node.nodeValue.match(/^\s*/)?.[0] || "";
      const trailing = node.nodeValue.match(/\s*$/)?.[0] || "";
      node.nodeValue = leading + translated + trailing;
    }
  };
  const translateElement = (root) => {
    if (!root) return;
    if (root.nodeType === Node.TEXT_NODE) {
      translateTextNode(root);
      return;
    }
    if (
      root.nodeType !== Node.ELEMENT_NODE &&
      root.nodeType !== Node.DOCUMENT_NODE
    )
      return;
    const elements = [];
    if (root.nodeType === Node.ELEMENT_NODE) elements.push(root);
    if (root.querySelectorAll) elements.push(...root.querySelectorAll("*"));
    elements.forEach((el) => {
      ["placeholder", "aria-label", "title", "data-confirm"].forEach((attr) => {
        const value = el.getAttribute(attr);
        if (value && normalizedDictionary[normalize(value)])
          el.setAttribute(attr, normalizedDictionary[normalize(value)]);
      });
      if (el.tagName === "OPTION") {
        const value = normalize(el.textContent);
        if (normalizedDictionary[value])
          el.textContent = normalizedDictionary[value];
      }
    });
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(translateTextNode);
  };
  translateElement(document.body);
  // Keep UI text translated when the wizard, temperature converter, or reports update it.
  const observer = new MutationObserver((records) =>
    records.forEach((record) => {
      if (record.type === "childList")
        record.addedNodes.forEach(translateElement);
      else if (record.type === "characterData")
        translateTextNode(record.target);
    }),
  );
  observer.observe(document.body, {
    subtree: true,
    childList: true,
    characterData: true,
  });
  const t = (value) => dictionary[value] || value;

  document.querySelectorAll("form[data-confirm]").forEach((form) =>
    form.addEventListener("submit", (event) => {
      if (!window.confirm(form.dataset.confirm)) event.preventDefault();
    }),
  );
  document
    .getElementById("language")
    ?.addEventListener("change", (event) =>
      event.currentTarget.form?.requestSubmit(),
    );
  const form = document.getElementById("symptom-wizard");
  if (!form) return;
  const steps = [...form.querySelectorAll("[data-step]")];
  const indicators = [...form.querySelectorAll("[data-step-indicator]")];
  const back = document.getElementById("wizard-back");
  const next = document.getElementById("wizard-next");
  const submit = document.getElementById("wizard-submit");
  const search = document.getElementById("symptom-search");
  const cards = [...form.querySelectorAll(".symptom-option")];
  let step = 0,
    category = "all";
  const selected = () => [
    ...form.querySelectorAll('input[name="symptoms"]:checked'),
  ];
  function count() {
    const el = document.getElementById("selected-count");
    if (el) el.textContent = selected().length;
  }
  function filterSymptoms() {
    const query = (search?.value || "").trim().toLowerCase();
    cards.forEach((card) => {
      const visibleLabel = (card.textContent || "").toLowerCase();
      const englishLabel = (card.dataset.label || "").toLowerCase();
      card.hidden = !(
        (englishLabel.includes(query) || visibleLabel.includes(query)) &&
        (category === "all" || card.dataset.category === category)
      );
    });
  }
  function updateReview() {
    const chosen = selected().map((input) =>
      input
        .closest("label")
        .querySelector("span:last-child")
        .textContent.trim(),
    );
    const sym = document.getElementById("review-symptoms");
    if (sym) sym.innerHTML = "";
    if (sym) {
      if (chosen.length)
        chosen.forEach((name) => {
          const chip = document.createElement("span");
          chip.className = "symptom-chip";
          chip.textContent = name;
          sym.appendChild(chip);
        });
      else sym.textContent = t("No symptoms selected");
    }
    const duration =
      form.querySelector('[name="duration"]')?.value || "Not provided";
    const severity =
      form.querySelector('[name="severity"]:checked')?.value || "unsure";
    const progression =
      form.querySelector('[name="progression"]')?.selectedOptions[0]
        ?.textContent || "Not sure";
    document.getElementById("review-duration").textContent = duration;
    document.getElementById("review-severity").textContent = t(
      severity.charAt(0).toUpperCase() + severity.slice(1),
    );
    document.getElementById("review-progression").textContent = progression;
  }
  function showStep(index) {
    step = Math.max(0, Math.min(steps.length - 1, index));
    steps.forEach((el, i) => el.classList.toggle("active", i === step));
    indicators.forEach((el, i) => {
      el.classList.toggle("active", i === step);
      el.classList.toggle("complete", i < step);
    });
    back.hidden = step === 0;
    next.hidden = step === steps.length - 1;
    submit.hidden = step !== steps.length - 1;
    if (step === 2) updateReview();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  next.addEventListener("click", () => {
    if (step === 0 && !selected().length) {
      const first = form.querySelector(".symptom-option input");
      first?.focus();
      alert(t("Select at least one symptom to continue."));
      return;
    }
    showStep(step + 1);
  });
  back.addEventListener("click", () => showStep(step - 1));
  form
    .querySelectorAll('input[name="symptoms"]')
    .forEach((el) => el.addEventListener("change", count));
  document.getElementById("clear-symptoms")?.addEventListener("click", () => {
    form
      .querySelectorAll('input[name="symptoms"]')
      .forEach((el) => (el.checked = false));
    count();
  });
  search?.addEventListener("input", filterSymptoms);
  form.querySelectorAll(".category-tab[data-category]").forEach((btn) =>
    btn.addEventListener("click", () => {
      category = btn.dataset.category;
      form
        .querySelectorAll(".category-tab")
        .forEach((b) => b.classList.toggle("active", b === btn));
      filterSymptoms();
    }),
  );
  form.addEventListener("submit", (e) => {
    if (!selected().length) {
      e.preventDefault();
      showStep(0);
      alert(t("Select at least one symptom before creating the summary."));
    }
  });
  count();
  filterSymptoms();
  showStep(0);
})();

// Live Celsius/Fahrenheit conversion for the health log form.
(() => {
  const input = document.getElementById("temperature-value");
  const unit = document.getElementById("temperature-unit");
  const output = document.getElementById("temperature-conversion");
  if (!input || !unit || !output) return;
  const update = () => {
    const value = Number(input.value);
    if (!input.value || !Number.isFinite(value)) {
      output.textContent =
        document.documentElement.lang === "hi"
          ? "रूपांतरण देखने के लिए तापमान दर्ज करें।"
          : document.documentElement.lang === "mr"
            ? "रूपांतरण पाहण्यासाठी तापमान टाका."
            : "Enter a temperature to see the conversion.";
      return;
    }
    if (unit.value === "C")
      output.textContent = `${value.toFixed(1)} °C = ${((value * 9) / 5 + 32).toFixed(1)} °F`;
    else
      output.textContent = `${value.toFixed(1)} °F = ${(((value - 32) * 5) / 9).toFixed(1)} °C`;
  };
  input.addEventListener("input", update);
  unit.addEventListener("change", update);
  update();
})();

// Health records temperature conversion widget.
document.addEventListener("DOMContentLoaded", function () {
  const value = document.getElementById("health-temp-value");
  const unit = document.getElementById("health-temp-unit");
  const output = document.getElementById("health-temp-conversion");
  if (!value || !unit || !output) return;
  function updateTemperatureConversion() {
    if (!value.value) {
      output.textContent = "Enter a value to see the conversion.";
      return;
    }
    const n = Number(value.value);
    if (!Number.isFinite(n)) return;
    output.textContent =
      unit.value === "C"
        ? `${n.toFixed(1)} °C = ${((n * 9) / 5 + 32).toFixed(1)} °F`
        : `${n.toFixed(1)} °F = ${(((n - 32) * 5) / 9).toFixed(1)} °C`;
  }
  value.addEventListener("input", updateTemperatureConversion);
  unit.addEventListener("change", updateTemperatureConversion);
});
