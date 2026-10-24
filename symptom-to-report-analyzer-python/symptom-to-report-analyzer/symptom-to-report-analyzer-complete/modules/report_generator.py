from io import BytesIO
from xml.sax.saxutils import escape
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, ListFlowable, ListItem

def build_pdf(report):
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=46, leftMargin=46,
                            topMargin=44, bottomMargin=44)
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(
        name="ReportTitle", parent=styles["Title"], alignment=TA_CENTER,
        textColor=colors.HexColor("#165d68"), spaceAfter=12
    ))
    story = [
        Paragraph("Symptom Summary Report", styles["ReportTitle"]),
        Paragraph("Prepared by CareNote • Symptom Summary", styles["Heading2"]),
        Paragraph("Generated: " + escape(str(report["generated_at"])), styles["Normal"]),
        Spacer(1, 12),
        Paragraph("1. Reported information", styles["Heading2"]),
        Paragraph("<b>Selected symptoms:</b> " + escape(", ".join(report["symptoms"])), styles["BodyText"]),
        Paragraph("<b>Duration:</b> " + escape(report["duration"]), styles["BodyText"]),
        Paragraph("<b>Self-reported severity:</b> " + escape(report["severity"]), styles["BodyText"]),
        Paragraph("<b>Additional notes:</b> " + escape(report["notes"]), styles["BodyText"]),
        Spacer(1, 10),
        Paragraph("2. Independent safety screening", styles["Heading2"]),
        Paragraph(escape(report["warning"]["message"]), styles["BodyText"]),
        Spacer(1, 10),
        Paragraph("3. Symptom pattern overview", styles["Heading2"]),
        Paragraph("<b>Dataset label:</b> " + escape(report["analysis"]["pattern"]), styles["BodyText"]),
    ]
    if report["analysis"].get("description"):
        story.append(Paragraph("<b>Dataset description (not personalized advice):</b> " +
                               escape(report["analysis"]["description"]), styles["BodyText"]))
    story += [
        Paragraph("<b>Training source:</b> " + escape(report["analysis"]["data_source"]), styles["BodyText"]),
        Paragraph(escape(report["analysis"]["disclaimer"]), styles["BodyText"]),
        Spacer(1, 10),
        Paragraph("4. Important health information", styles["Heading2"]),
        Paragraph(
            "This report is for informational purposes only and cannot diagnose or rule out a condition. It is not a "
            "treatment recommendation. A qualified healthcare professional can assess symptoms alongside medical "
            "history and other relevant information. If symptoms are sudden, severe, or worsening, seek urgent "
            "medical help rather than waiting for an app result.",
            styles["BodyText"]
        ),
        Spacer(1, 8),
        Paragraph(
            "Privacy: CareNote does not intentionally store form submissions. The PDF may contain sensitive "
            "information; keep it private and do not include identifying details in notes.",
            styles["Italic"]
        )
    ]
    doc.build(story)
    buffer.seek(0)
    return buffer
