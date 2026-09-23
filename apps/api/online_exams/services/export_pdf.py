from __future__ import annotations

import io
from pathlib import Path
from typing import Any

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import (
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

from ..models import ExamSubmission, OnlineExam


def _register_portable_fonts() -> tuple[str, str]:
    regular_candidates = [
        Path("C:/Windows/Fonts/arial.ttf"),
        Path("C:/Windows/Fonts/calibri.ttf"),
        Path("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"),
        Path("/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf"),
        Path("/Library/Fonts/Arial.ttf"),
    ]
    bold_candidates = [
        Path("C:/Windows/Fonts/arialbd.ttf"),
        Path("C:/Windows/Fonts/calibrib.ttf"),
        Path("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"),
        Path("/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf"),
        Path("/Library/Fonts/Arial Bold.ttf"),
    ]

    regular = next((p for p in regular_candidates if p.exists()), None)
    bold = next((p for p in bold_candidates if p.exists()), None)
    if regular is None:
        return "Helvetica", "Helvetica-Bold"

    try:
        if "Endoora-Exam-Regular" not in pdfmetrics.getRegisteredFontNames():
            pdfmetrics.registerFont(TTFont("Endoora-Exam-Regular", str(regular)))
        if bold is not None and "Endoora-Exam-Bold" not in pdfmetrics.getRegisteredFontNames():
            pdfmetrics.registerFont(TTFont("Endoora-Exam-Bold", str(bold)))
        return "Endoora-Exam-Regular", "Endoora-Exam-Bold" if bold is not None else "Endoora-Exam-Regular"
    except Exception:
        return "Helvetica", "Helvetica-Bold"


REGULAR_FONT, BOLD_FONT = _register_portable_fonts()


class ExamNumberedCanvas(canvas.Canvas):
    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, **kwargs)
        self._saved_page_states: list[dict[str, Any]] = []

    def showPage(self) -> None:
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self) -> None:
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count: int) -> None:
        self.saveState()
        self.setFont(REGULAR_FONT, 8)
        self.setFillColor(colors.HexColor("#64748B"))

        # Header bar
        self.drawString(18 * mm, A4[1] - 12 * mm, "Endoora Examination & Anti-Cheat System")
        self.drawRightString(A4[0] - 18 * mm, A4[1] - 12 * mm, "Official Transcript & Report Card")
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.5)
        self.line(18 * mm, A4[1] - 14 * mm, A4[0] - 18 * mm, A4[1] - 14 * mm)

        # Footer
        footer_text = f"Page {self._pageNumber} of {page_count}"
        self.drawCentredString(A4[0] / 2.0, 10 * mm, footer_text)
        self.restoreState()


class ExamPdfExporter:
    """موتور تولید کارنامه و گزارش رسمی PDF آزمون آنلاین"""

    @classmethod
    def generate_student_report(cls, submission_id: str) -> io.BytesIO:
        """Generate official PDF report card for a student submission."""
        submission = ExamSubmission.objects.select_related('exam', 'student').prefetch_related(
            'answers__exam_question__question_version'
        ).get(id=submission_id)

        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=A4,
            leftMargin=18 * mm,
            rightMargin=18 * mm,
            topMargin=20 * mm,
            bottomMargin=18 * mm,
        )

        styles = getSampleStyleSheet()

        title_style = ParagraphStyle(
            "DocTitle",
            parent=styles["Normal"],
            fontName=BOLD_FONT,
            fontSize=18,
            leading=22,
            textColor=colors.HexColor("#0F172A"),
            alignment=TA_LEFT,
        )

        subtitle_style = ParagraphStyle(
            "DocSubtitle",
            parent=styles["Normal"],
            fontName=REGULAR_FONT,
            fontSize=10,
            leading=14,
            textColor=colors.HexColor("#64748B"),
            alignment=TA_LEFT,
        )

        cell_bold = ParagraphStyle(
            "CellBold",
            parent=styles["Normal"],
            fontName=BOLD_FONT,
            fontSize=9,
            leading=12,
            textColor=colors.HexColor("#0F172A"),
        )

        cell_regular = ParagraphStyle(
            "CellRegular",
            parent=styles["Normal"],
            fontName=REGULAR_FONT,
            fontSize=8.5,
            leading=11,
            textColor=colors.HexColor("#334155"),
        )

        story: list[Any] = []

        # Document Header
        story.append(Paragraph(f"Official Examination Report Card", title_style))
        story.append(Paragraph(f"Exam: {submission.exam.title}", subtitle_style))
        story.append(Spacer(1, 4 * mm))

        # Student & Overview Table
        student_name = getattr(submission.student, "name", None) or submission.student.email
        score_val = float(submission.total_score or 0)
        max_possible = float(submission.max_possible_score or 100)
        pct = float(submission.percentage or 0)
        passing_pct = float(submission.exam.passing_score or 60)
        is_passed = pct >= passing_pct

        meta_data = [
            [
                Paragraph("<b>Student:</b>", cell_bold),
                Paragraph(student_name, cell_regular),
                Paragraph("<b>Date Taken:</b>", cell_bold),
                Paragraph(
                    submission.submitted_at.strftime("%Y-%m-%d %H:%M") if submission.submitted_at else "In Progress",
                    cell_regular,
                ),
            ],
            [
                Paragraph("<b>Total Score:</b>", cell_bold),
                Paragraph(f"<b>{score_val:.1f} / {max_possible:.1f} ({pct:.1f}%)</b>", cell_bold),
                Paragraph("<b>Result Status:</b>", cell_bold),
                Paragraph(
                    f"<font color='{'#059669' if is_passed else '#DC2626'}'><b>{'PASSED' if is_passed else 'NEEDS IMPROVEMENT'}</b></font>",
                    cell_bold,
                ),
            ],
            [
                Paragraph("<b>Integrity Score:</b>", cell_bold),
                Paragraph(f"<b>{float(submission.integrity_score or 100):.0f}% (Anti-Cheat Verified)</b>", cell_bold),
                Paragraph("<b>Attempt:</b>", cell_bold),
                Paragraph(f"#{submission.attempt_number}", cell_regular),
            ],
        ]

        meta_table = Table(meta_data, colWidths=[32 * mm, 55 * mm, 35 * mm, 52 * mm])
        meta_table.setStyle(
            TableStyle([
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#F8FAFC")),
                ("BOX", (0, 0), (-1, -1), 1, colors.HexColor("#CBD5E1")),
                ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
                ("PADDING", (0, 0), (-1, -1), 6),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ])
        )
        story.append(meta_table)
        story.append(Spacer(1, 6 * mm))

        # Item Response Table
        story.append(Paragraph("<b>Question-by-Question Breakdown</b>", cell_bold))
        story.append(Spacer(1, 2 * mm))

        item_headers = ["#", "Item Type", "Max Points", "Score Awarded", "Evaluation & Teacher Feedback"]
        table_rows = [[Paragraph(f"<b>{h}</b>", cell_bold) for h in item_headers]]

        for idx, ans in enumerate(submission.answers.all().order_by("exam_question__order"), start=1):
            eq = ans.exam_question
            q_type = eq.question_version.question_type.upper()
            max_pts = float(eq.points)
            awarded = float(ans.score_awarded or 0)
            feedback = ans.teacher_feedback or ("Auto-Scored Correct" if awarded >= max_pts else "Auto-Scored")

            table_rows.append([
                Paragraph(str(idx), cell_regular),
                Paragraph(q_type, cell_regular),
                Paragraph(f"{max_pts:.1f}", cell_regular),
                Paragraph(f"<b>{awarded:.1f}</b>", cell_bold),
                Paragraph(feedback, cell_regular),
            ])

        items_table = Table(table_rows, colWidths=[10 * mm, 34 * mm, 24 * mm, 26 * mm, 80 * mm])
        items_table.setStyle(
            TableStyle([
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#EEF2F6")),
                ("BOX", (0, 0), (-1, -1), 1, colors.HexColor("#CBD5E1")),
                ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
                ("PADDING", (0, 0), (-1, -1), 5),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ])
        )
        story.append(items_table)
        story.append(Spacer(1, 8 * mm))

        # Security & Verification Stamp
        stamp_data = [
            [
                Paragraph("<b>Security & Integrity Verification:</b>", cell_bold),
                Paragraph("<b>Instructor Signature & Approval:</b>", cell_bold),
            ],
            [
                Paragraph(
                    f"Telemetric proctoring record verified.<br/>"
                    f"Total Suspicious Events: {len(submission.integrity_details.get('penalties_breakdown', []))}<br/>"
                    f"Final Integrity Score: <b>{float(submission.integrity_score or 100):.0f}%</b>",
                    cell_regular,
                ),
                Paragraph(
                    "<br/><br/>________________________________________<br/>"
                    "Verified by Endoora Examination Authority",
                    cell_regular,
                ),
            ],
        ]
        stamp_table = Table(stamp_data, colWidths=[90 * mm, 84 * mm])
        stamp_table.setStyle(
            TableStyle([
                ("BOX", (0, 0), (-1, -1), 1, colors.HexColor("#E2E8F0")),
                ("PADDING", (0, 0), (-1, -1), 8),
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#FAFAFA")),
            ])
        )
        story.append(stamp_table)

        doc.build(story, canvasmaker=ExamNumberedCanvas)
        buffer.seek(0)
        return buffer

    @classmethod
    def generate_exam_summary(cls, exam_id: str) -> io.BytesIO:
        """Generate master class-wide summary report for an exam."""
        exam = OnlineExam.objects.prefetch_related(
            "exam_questions__question_version",
            "submissions__student",
        ).get(id=exam_id)

        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=A4,
            leftMargin=18 * mm,
            rightMargin=18 * mm,
            topMargin=20 * mm,
            bottomMargin=18 * mm,
        )

        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            "Title",
            parent=styles["Normal"],
            fontName=BOLD_FONT,
            fontSize=16,
            leading=20,
            textColor=colors.HexColor("#0F172A"),
        )
        cell_bold = ParagraphStyle(
            "CellBold",
            parent=styles["Normal"],
            fontName=BOLD_FONT,
            fontSize=9,
            leading=12,
            textColor=colors.HexColor("#0F172A"),
        )
        cell_regular = ParagraphStyle(
            "CellRegular",
            parent=styles["Normal"],
            fontName=REGULAR_FONT,
            fontSize=8.5,
            leading=11,
            textColor=colors.HexColor("#334155"),
        )

        story: list[Any] = []

        story.append(Paragraph(f"Master Exam Summary Report: {exam.title}", title_style))
        story.append(Spacer(1, 4 * mm))

        submissions = list(exam.submissions.all())
        total_subs = len(submissions)
        scores = [float(s.percentage or 0) for s in submissions if s.percentage is not None]
        avg_score = sum(scores) / len(scores) if scores else 0
        integrities = [float(s.integrity_score or 100) for s in submissions]
        avg_integrity = sum(integrities) / len(integrities) if integrities else 100
        pass_count = sum(1 for sc in scores if sc >= float(exam.passing_score or 60))

        summary_data = [
            [
                Paragraph("<b>Total Participants:</b>", cell_bold),
                Paragraph(str(total_subs), cell_regular),
                Paragraph("<b>Pass Rate:</b>", cell_bold),
                Paragraph(f"{(pass_count / total_subs * 100):.1f}%" if total_subs else "N/A", cell_bold),
            ],
            [
                Paragraph("<b>Average Score:</b>", cell_bold),
                Paragraph(f"{avg_score:.1f}%", cell_bold),
                Paragraph("<b>Avg Integrity Score:</b>", cell_bold),
                Paragraph(f"{avg_integrity:.1f}%", cell_bold),
            ],
        ]
        sum_table = Table(summary_data, colWidths=[40 * mm, 45 * mm, 40 * mm, 49 * mm])
        sum_table.setStyle(
            TableStyle([
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#F1F5F9")),
                ("BOX", (0, 0), (-1, -1), 1, colors.HexColor("#CBD5E1")),
                ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
                ("PADDING", (0, 0), (-1, -1), 6),
            ])
        )
        story.append(sum_table)
        story.append(Spacer(1, 6 * mm))

        # Participants Table
        story.append(Paragraph("<b>Student Results & Security Audits</b>", cell_bold))
        story.append(Spacer(1, 2 * mm))

        headers = ["#", "Student", "Score", "Percentage", "Integrity", "Status"]
        table_rows = [[Paragraph(f"<b>{h}</b>", cell_bold) for h in headers]]

        for idx, s in enumerate(submissions, start=1):
            name = getattr(s.student, "name", None) or s.student.email
            sc = float(s.total_score or 0)
            pct_val = float(s.percentage or 0)
            integ = float(s.integrity_score or 100)

            table_rows.append([
                Paragraph(str(idx), cell_regular),
                Paragraph(name, cell_regular),
                Paragraph(f"{sc:.1f}", cell_regular),
                Paragraph(f"{pct_val:.1f}%", cell_bold),
                Paragraph(f"{integ:.0f}%", cell_regular),
                Paragraph(s.status, cell_regular),
            ])

        res_table = Table(table_rows, colWidths=[10 * mm, 60 * mm, 25 * mm, 25 * mm, 25 * mm, 29 * mm])
        res_table.setStyle(
            TableStyle([
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#EEF2F6")),
                ("BOX", (0, 0), (-1, -1), 1, colors.HexColor("#CBD5E1")),
                ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
                ("PADDING", (0, 0), (-1, -1), 5),
            ])
        )
        story.append(res_table)

        doc.build(story, canvasmaker=ExamNumberedCanvas)
        buffer.seek(0)
        return buffer
