"""Conservative warning-sign checklist, intentionally separate from ML."""
URGENT_KEYS = {
    "chest_pain",
    "breathing_difficulty",
    "sudden_weakness",
    "confusion",
    "severe_bleeding",
    "severe_allergic_reaction",
    "fainting",
}

def check_warning_signs(selected):
    flagged = sorted(URGENT_KEYS.intersection(set(selected)))
    if flagged:
        return {
            "urgent": True,
            "flagged": flagged,
            "message": (
                "One or more selected symptoms can be warning signs of a serious condition. "
                "Seek urgent medical assessment now. If symptoms are severe, sudden, or worsening, "
                "contact your local emergency service. Do not wait for this tool's result."
            ),
        }
    return {
        "urgent": False,
        "flagged": [],
        "message": (
            "No warning sign from this prototype's limited checklist was selected. "
            "This does not rule out an emergency. If you feel seriously unwell, symptoms worsen, "
            "or you are concerned, seek professional medical advice."
        ),
    }
