"""Generate a print-friendly PDF summary using ReportLab."""
from __future__ import annotations
from io import BytesIO
from xml.sax.saxutils import escape
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether


def build_pdf(report) -> BytesIO:
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer, pagesize=A4, rightMargin=18*mm, leftMargin=18*mm,
        topMargin=17*mm, bottomMargin=17*mm,
        title="CareNote Symptom Summary", author="CareNote",
    )
    base = getSampleStyleSheet()
    title_style = ParagraphStyle("CareTitle", parent=base["Title"], fontName="ZapfChancery-MediumItalic", fontSize=20, leading=25, textColor=colors.HexColor("#176b63"), alignment=TA_LEFT, spaceAfter=5*mm)
    heading = ParagraphStyle("CareHeading", parent=base["Heading2"], fontSize=12, leading=16, textColor=colors.HexColor("#1e2b39"), spaceBefore=5*mm, spaceAfter=2*mm)
    body = ParagraphStyle("CareBody", parent=base["BodyText"], fontSize=9, leading=13, textColor=colors.HexColor("#44515d"), spaceAfter=2*mm)
    small = ParagraphStyle("CareSmall", parent=body, fontSize=8, leading=11, textColor=colors.HexColor("#6f7d8c"))
    story = [Paragraph("CareNote", title_style), Paragraph("Symptom summary · Educational note, not a diagnosis", body)]
    story.append(Paragraph("What you reported", heading))
    symptoms = report.get("symptoms") or []
    story.append(Paragraph(escape(", ".join(str(s) for s in symptoms) or "None provided"), body))
    details = [
        [Paragraph("Duration", small), Paragraph("Self-reported severity", small), Paragraph("Progression", small)],
        [Paragraph(escape(str(report.get("duration", "Not provided"))), body), Paragraph(escape(str(report.get("severity", "Unsure"))), body), Paragraph(escape(str(report.get("progression", "Not sure"))), body)],
    ]
    table = Table(details, colWidths=[55*mm, 55*mm, 55*mm])
    table.setStyle(TableStyle([("BACKGROUND", (0,0), (-1,0), colors.HexColor("#eff7f5")), ("BOX", (0,0), (-1,-1), .5, colors.HexColor("#dce6e9")), ("INNERGRID", (0,0), (-1,-1), .35, colors.HexColor("#e4eaf0")), ("VALIGN", (0,0), (-1,-1), "TOP"), ("LEFTPADDING", (0,0), (-1,-1), 8), ("RIGHTPADDING", (0,0), (-1,-1), 8), ("TOPPADDING", (0,0), (-1,-1), 7), ("BOTTOMPADDING", (0,0), (-1,-1), 7)]))
    story.extend([Spacer(1, 3*mm), table, Paragraph("Additional notes", heading), Paragraph(escape(str(report.get("notes", "None provided")).replace("\n", "<br/>")), body)])
    health = report.get("health_records") or {}
    if health:
        story.append(Paragraph("Health measurements (self-reported)", heading))
        entries = []
        if health.get("height_cm") is not None and health.get("weight_kg") is not None:
            entries.append(f"Height: {health['height_cm']} cm · Weight: {health['weight_kg']} kg · BMI: {health.get('bmi', 'Not available')} ({health.get('bmi_category', 'Not classified')})")
        bp = health.get("blood_pressure")
        if bp: entries.append(f"Blood pressure ({bp.get('date','date not provided')}): {bp.get('systolic')}/{bp.get('diastolic')} mmHg")
        temp = health.get("temperature")
        if temp: entries.append(f"Temperature ({temp.get('date','date not provided')}): {temp.get('value')} °{temp.get('unit','C')}")
        pulse = health.get("pulse")
        if pulse: entries.append(f"Pulse ({pulse.get('date','date not provided')}): {pulse.get('bpm')} BPM")
        for med in health.get("medications", []):
            entries.append(f"Medication entered: {med.get('name') or 'Name not provided'} · Dosage: {med.get('dosage') or 'Not provided'} · Schedule: {med.get('schedule') or 'Not provided'}")
        for entry in entries: story.append(Paragraph(escape(entry), body))
        story.append(Paragraph("These entries are user-provided records, not a clinical interpretation. BMI is a screening measure only; do not change medication based on this report.", small))
    story.append(Paragraph("Appointment preparation", heading))
    questions = str(report.get("appointment_questions") or "No questions were entered. Consider asking the clinician about symptom changes, follow-up, and appropriate next steps.")
    story.append(Paragraph(escape(questions).replace("\n", "<br/>"), body))
    warning = report.get("warning") or {}
    story.append(Paragraph("Warning-sign checklist", heading))
    story.append(Paragraph(escape(str(warning.get("message", "No warning information available."))), body))
    if warning.get("signs"):
        story.append(Paragraph("Selected signs: " + escape(", ".join(map(str, warning["signs"]))), body))
    analysis = report.get("analysis") or {}
    story.append(Paragraph("Local model output", heading))
    if analysis.get("available"):
        story.append(Paragraph("Dataset label: <b>" + escape(str(analysis.get("label", "Unavailable"))) + "</b>", body))
        story.append(Paragraph(escape(str(analysis.get("message", "This label is not a diagnosis."))), small))
    else:
        story.append(Paragraph("Model result unavailable: " + escape(str(analysis.get("message", "No local model is available."))), body))
    story.extend([Spacer(1, 4*mm), Paragraph("Important limitation", heading), Paragraph("This educational application is not a medical device. The classifier and warning-sign checklist are not clinically validated, cannot diagnose or triage, and cannot rule out an emergency. For severe, sudden, worsening, or concerning symptoms, seek professional medical assessment promptly.", small)])
    generated = report.get("generated_at")
    if generated:
        story.extend([Spacer(1, 3*mm), Paragraph("Generated: " + escape(str(generated)), small)])
    doc.build(story)
    buffer.seek(0)
    return buffer
