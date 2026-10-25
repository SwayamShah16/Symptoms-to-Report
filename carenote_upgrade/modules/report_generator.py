"""Generate a concise, print-friendly PDF symptom summary."""
from io import BytesIO
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether
from xml.sax.saxutils import escape

def build_pdf(report):
    output = BytesIO()
    doc = SimpleDocTemplate(output, pagesize=A4, rightMargin=18*mm, leftMargin=18*mm, topMargin=16*mm, bottomMargin=16*mm)
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name="SmallNote", parent=styles["BodyText"], fontSize=8, leading=11, textColor=colors.HexColor("#52616b")))
    story = [Paragraph("CareNote", styles["Title"]), Paragraph("Symptom summary for discussion with a qualified healthcare professional", styles["Normal"]), Spacer(1, 7*mm)]
    details = [["Created", escape(str(report.get("generated_at", "Not recorded")))], ["Duration", escape(str(report.get("duration", "Not provided")))],
               ["Self-reported severity", escape(str(report.get("severity", "Not provided")))], ["Progression", escape(str(report.get("progression", "Not provided")))]]
    table = Table(details, colWidths=[43*mm, 120*mm])
    table.setStyle(TableStyle([("BACKGROUND", (0,0), (0,-1), colors.HexColor("#eef4f6")), ("GRID", (0,0), (-1,-1), .4, colors.HexColor("#d8e1e5")), ("VALIGN", (0,0), (-1,-1), "TOP"), ("PADDING", (0,0), (-1,-1), 7)]))
    story += [table, Spacer(1, 6*mm), Paragraph("Reported symptoms", styles["Heading2"])]
    symptoms = report.get("symptoms", [])
    story.append(Paragraph(escape(", ".join(symptoms) if symptoms else "None recorded"), styles["BodyText"]))
    story += [Spacer(1, 4*mm), Paragraph("Additional notes", styles["Heading2"]), Paragraph(escape(str(report.get("notes", "None provided"))).replace("\n", "<br/>"), styles["BodyText"])]
    warning = report.get("warning", {})
    story += [Spacer(1, 5*mm), Paragraph("Warning-sign screening", styles["Heading2"]), Paragraph(escape(str(warning.get("message", "Not available"))), styles["BodyText"])]
    analysis = report.get("analysis", {})
    story += [Spacer(1, 5*mm), Paragraph("Local model information", styles["Heading2"]), Paragraph(escape(str(analysis.get("message", "Model unavailable"))), styles["BodyText"])]
    if analysis.get("available"):
        story.append(Paragraph("Dataset label (not a diagnosis): " + escape(str(analysis.get("label", "Unavailable"))), styles["BodyText"]))
    story += [Spacer(1, 8*mm), Paragraph("Important limitation: This report organizes user-entered information. It is not a diagnosis, does not establish that a person is safe, and must not be used to delay urgent care or replace a clinician's assessment.", styles["SmallNote"])]
    doc.build(story)
    output.seek(0)
    return output
