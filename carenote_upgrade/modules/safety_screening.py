"""Conservative, rule-based warning-sign screening, independent of the ML model."""
# This checklist is intentionally limited and must be clinically reviewed before any real deployment.
WARNING_TERMS = {
    "chest_pain": "Chest pain",
    "shortness_of_breath": "Shortness of breath",
    "confusion": "Confusion",
}

def check_warning_signs(symptoms):
    found = [WARNING_TERMS[s] for s in symptoms if s in WARNING_TERMS]
    if found:
        return {"triggered": True, "signs": found,
                "message": "One or more selected symptoms can require urgent assessment. If symptoms are severe, sudden, or worsening, contact local emergency services or seek urgent medical care now. Do not wait for this report."}
    return {"triggered": False, "signs": [],
            "message": "No warning sign from this limited checklist was selected. This does not rule out an emergency or mean that symptoms are safe."}
