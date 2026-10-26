"""Conservative educational warning-sign prompts, independent of ML output.

This checklist is incomplete and is not suitable for triage or emergency clearance.
"""
from .data_pipeline import normalize_symptom

# These labels are drawn from the supplied symptom dataset. The list is intentionally
# small and must not be interpreted as comprehensive clinical screening.
_WARNING_SYMPTOMS = {
    "chest pain": "chest pain",
    "breathlessness": "breathlessness",
    "blood in sputum": "blood in sputum",
    "coma": "coma or unresponsiveness",
    "altered sensorium": "altered sensorium or confusion",
    "acute liver failure": "acute liver failure label in the source list",
}


def check_warning_signs(selected_symptoms):
    selected = {normalize_symptom(s) for s in selected_symptoms}
    signs = [description for key, description in _WARNING_SYMPTOMS.items() if key in selected]
    if signs:
        return {
            "triggered": True,
            "signs": signs,
            "message": "One or more selected entries may warrant urgent professional assessment. This checklist is incomplete and cannot determine urgency or rule out an emergency. Seek emergency help for severe or sudden symptoms.",
        }
    return {
        "triggered": False,
        "signs": [],
        "message": "No configured warning sign was matched. This checklist is incomplete and does not mean symptoms are safe. Seek prompt medical care for severe, sudden, worsening, or concerning symptoms.",
    }
