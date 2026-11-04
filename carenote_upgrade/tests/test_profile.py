from datetime import date

from modules.health_profile import parse_profile, summarize, report_snapshot, calc_age


class Form(dict):
    def getlist(self, key):
        v = self.get(key, [])
        return v if isinstance(v, list) else [v]


GOOD = {"preferred_name": "Asha", "dob": "2002-05-10", "sex": "Female", "height_cm": "165", "weight_kg": "58",
        "blood_group": "O+", "conditions": ["Asthma", "Not a real one"], "allergies": "Penicillin",
        "medication_list": "Inhaler | as prescribed | when needed", "smoking": "Never", "consent": "on",
        "emergency_name": "Parent", "emergency_phone": "+91 98765 43210"}


def test_valid_profile_and_summary():
    profile, errors = parse_profile(Form(GOOD), today=date(2026, 11, 4))
    assert errors == []
    assert profile["conditions"] == ["Asthma"]
    s = summarize(profile, today=date(2026, 11, 4))
    assert s["age"] == 24 and s["bmi"] == 21.3 and s["bmi_category"] == "Healthy weight range"
    assert s["completeness"] >= 80
    assert "dob" not in report_snapshot(s)


def test_required_fields_and_bad_values():
    _, errors = parse_profile(Form({"preferred_name": "", "dob": "2999-01-01", "emergency_phone": "abc"}))
    assert len(errors) == 4
    assert calc_age("not-a-date") is None


def test_explicit_none_answers_count_as_answered():
    data = dict(GOOD, conditions=[], no_conditions="on", no_allergies="on", allergies="x")
    profile, _ = parse_profile(Form(data), today=date(2026, 11, 4))
    assert profile["allergies"] == "" and profile["no_allergies"]
    assert report_snapshot(summarize(profile))["allergies"] == "None reported"
