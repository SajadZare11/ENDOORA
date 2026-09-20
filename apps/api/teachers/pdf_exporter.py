from __future__ import annotations

import io
import os
import re
import unicodedata
from html import escape
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

TYPE_LABELS = {
    "lesson": "Lesson Plan",
    "activity": "Classroom Activity",
    "worksheet": "Student Worksheet",
    "assessment": "Calibrated Assessment",
}

_TEACHER_ONLY_KEYWORDS = (
    "ANSWER KEY",
    "TEACHER NOTES",
    "MARKING GUIDE",
    "SCORING GUIDE",
    "TEACHER SCRIPT",
    "CONCEPT CHECKING QUESTIONS",
    "CCQ",
)
_HEADING_BREAK_WORDS = ("ANSWER KEY", "TEACHER NOTES", "MARKING GUIDE", "SCORING GUIDE")
_MARKDOWN_PREFIX = re.compile(r"^\s{0,3}(#{1,6})\s+(.*)$")
_NUMBERED_ITEM = re.compile(r"^\s*(\d+)[.)]\s+(.*)$")
_BULLET_ITEM = re.compile(r"^\s*[-*•]\s+(.*)$")


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
        if "Endoora-Regular" not in pdfmetrics.getRegisteredFontNames():
            pdfmetrics.registerFont(TTFont("Endoora-Regular", str(regular)))
        if bold is not None and "Endoora-Bold" not in pdfmetrics.getRegisteredFontNames():
            pdfmetrics.registerFont(TTFont("Endoora-Bold", str(bold)))
        return "Endoora-Regular", "Endoora-Bold" if bold is not None else "Endoora-Regular"
    except Exception:
        return "Helvetica", "Helvetica-Bold"


REGULAR_FONT, BOLD_FONT = _register_portable_fonts()


class NumberedCanvas(canvas.Canvas):
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
            self.draw_page_number(num_pages)
            super().showPage()
        super().save()

    def draw_page_number(self, page_count: int) -> None:
        self.saveState()
        self.setFont(REGULAR_FONT, 8)
        self.setFillColor(colors.HexColor("#64748B"))

        # Header
        self.drawRightString(
            A4[0] - 18 * mm,
            A4[1] - 12 * mm,
            "Endoora TeacherOS  •  Classroom Material",
        )
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.5)
        self.line(18 * mm, A4[1] - 14 * mm, A4[0] - 18 * mm, A4[1] - 14 * mm)

        # Footer
        footer_text = f"Page {self._pageNumber} of {page_count}"
        self.drawCentredString(A4[0] / 2.0, 10 * mm, footer_text)
        self.restoreState()


def _clean_inline_markdown(text: str) -> str:
    cleaned = text.replace("**", "").replace("`", "")
    return " ".join(cleaned.strip().split())


def _safe_filename(value: object, *, material_id: Any, mode: str = "teacher") -> str:
    title = _clean_inline_markdown(str(value or "Endoora_Material"))
    title = re.sub(r'[<>:"/\\|?*\x00-\x1F]', "", title)
    title = re.sub(r"\s+", " ", title).strip(" .")
    if not title:
        title = "Endoora_Material"
    if len(title) > 60:
        title = title[:60].rstrip()
    suffix = "- Student Edition" if mode == "student" else "- Teacher Edition"
    return f"{title} {suffix} (#{material_id}).pdf"


def _pdf_safe_text(value: object) -> str:
    text = str(value or "").replace("\u00a0", " ")
    replacements = {
        "✅": "[OK]",
        "❌": "[X]",
        "☐": "[ ]",
        "☑": "[x]",
        "✓": "[x]",
        "→": "->",
        "←": "<-",
        "–": "-",
        "—": "-",
    }
    for source, target in replacements.items():
        text = text.replace(source, target)

    safe_characters: list[str] = []
    for character in text:
        cat = unicodedata.category(character)
        if cat in {"So", "Sk"} and ord(character) > 255:
            continue
        safe_characters.append(character)
    return "".join(safe_characters)


def _paragraph_text(value: object) -> str:
    return escape(_pdf_safe_text(value), quote=False)


def _is_teacher_only_heading(heading: str) -> bool:
    upper = heading.upper()
    return any(keyword in upper for keyword in _TEACHER_ONLY_KEYWORDS)


def _styles() -> dict[str, ParagraphStyle]:
    sample = getSampleStyleSheet()
    return {
        "title": ParagraphStyle(
            "TeacherOSTitle",
            parent=sample["Title"],
            fontName=BOLD_FONT,
            fontSize=18,
            leading=22,
            alignment=TA_CENTER,
            spaceAfter=3 * mm,
            textColor=colors.HexColor("#0F172A"),
        ),
        "subtitle": ParagraphStyle(
            "TeacherOSSubtitle",
            parent=sample["Normal"],
            fontName=BOLD_FONT,
            fontSize=10,
            leading=13,
            alignment=TA_CENTER,
            spaceAfter=6 * mm,
            textColor=colors.HexColor("#3B82F6"),
        ),
        "h1": ParagraphStyle(
            "TeacherOSH1",
            parent=sample["Heading1"],
            fontName=BOLD_FONT,
            fontSize=13,
            leading=16,
            spaceBefore=4 * mm,
            spaceAfter=2 * mm,
            textColor=colors.HexColor("#1E293B"),
            keepWithNext=True,
        ),
        "h2": ParagraphStyle(
            "TeacherOSH2",
            parent=sample["Heading2"],
            fontName=BOLD_FONT,
            fontSize=11,
            leading=14,
            spaceBefore=3 * mm,
            spaceAfter=1.5 * mm,
            textColor=colors.HexColor("#334155"),
            keepWithNext=True,
        ),
        "h3": ParagraphStyle(
            "TeacherOSH3",
            parent=sample["Heading3"],
            fontName=BOLD_FONT,
            fontSize=10,
            leading=13,
            spaceBefore=2 * mm,
            spaceAfter=1 * mm,
            textColor=colors.HexColor("#475569"),
            keepWithNext=True,
        ),
        "body": ParagraphStyle(
            "TeacherOSBody",
            parent=sample["Normal"],
            fontName=REGULAR_FONT,
            fontSize=9.5,
            leading=13.5,
            spaceAfter=2 * mm,
            textColor=colors.HexColor("#1E293B"),
        ),
        "bullet": ParagraphStyle(
            "TeacherOSBullet",
            parent=sample["Normal"],
            fontName=REGULAR_FONT,
            fontSize=9.5,
            leading=13.5,
            leftIndent=15,
            firstLineIndent=-10,
            spaceAfter=1.5 * mm,
            textColor=colors.HexColor("#1E293B"),
        ),
        "meta_label": ParagraphStyle(
            "TeacherOSMetaLabel",
            parent=sample["Normal"],
            fontName=BOLD_FONT,
            fontSize=8.5,
            leading=11,
            textColor=colors.HexColor("#1E293B"),
        ),
        "meta_val": ParagraphStyle(
            "TeacherOSMetaValue",
            parent=sample["Normal"],
            fontName=REGULAR_FONT,
            fontSize=8.5,
            leading=11,
            textColor=colors.HexColor("#334155"),
        ),
    }


def _build_metadata_table(material: dict[str, Any], mode: str, styles: dict[str, ParagraphStyle]) -> Table:
    type_label = TYPE_LABELS.get(str(material.get("material_type") or ""), "Material")
    subtype = str(material.get("subtype") or "").strip()
    level = str(material.get("cefr_level") or material.get("level") or "").strip()
    topic = str(material.get("topic") or "").strip()
    class_title = str(material.get("class_title") or "").strip()

    rows: list[list[Any]] = [
        [
            Paragraph("Resource Type", styles["meta_label"]),
            Paragraph(_paragraph_text(type_label), styles["meta_val"]),
        ]
    ]
    if subtype and subtype.lower() != type_label.lower():
        rows.append([
            Paragraph("Pedagogical Focus", styles["meta_label"]),
            Paragraph(_paragraph_text(subtype), styles["meta_val"]),
        ])
    if level:
        rows.append([
            Paragraph("CEFR Level", styles["meta_label"]),
            Paragraph(_paragraph_text(level), styles["meta_val"]),
        ])
    if topic:
        rows.append([
            Paragraph("Core Topic", styles["meta_label"]),
            Paragraph(_paragraph_text(topic), styles["meta_val"]),
        ])
    if class_title:
        rows.append([
            Paragraph("Target Class", styles["meta_label"]),
            Paragraph(_paragraph_text(class_title), styles["meta_val"]),
        ])
    if mode == "student":
        rows.append([
            Paragraph("Student Name", styles["meta_label"]),
            Paragraph("___________________________    Date: ____________", styles["meta_val"]),
        ])

    table = Table(rows, colWidths=[40 * mm, 134 * mm])
    table.setStyle(
        TableStyle([
            ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#F1F5F9")),
            ("TEXTCOLOR", (0, 0), (-1, -1), colors.HexColor("#1E293B")),
            ("ALIGN", (0, 0), (-1, -1), "LEFT"),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
            ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#94A3B8")),
            ("TOPPADDING", (0, 0), (-1, -1), 3),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
        ])
    )
    return table


def build_pdf_document(material: dict[str, Any], mode: str = "teacher") -> io.BytesIO:
    output = io.BytesIO()
    doc = SimpleDocTemplate(
        output,
        pagesize=A4,
        leftMargin=18 * mm,
        rightMargin=18 * mm,
        topMargin=20 * mm,
        bottomMargin=18 * mm,
    )

    styles = _styles()
    story: list[Any] = []

    # Title & Subtitle
    title = _clean_inline_markdown(str(material.get("title") or "Classroom Material"))
    story.append(Paragraph(_paragraph_text(title), styles["title"]))

    type_label = TYPE_LABELS.get(str(material.get("material_type") or ""), "Material")
    edition_label = "Student Handout" if mode == "student" else "Teacher Lesson Plan & Answer Key"
    story.append(Paragraph(f"{type_label} — {edition_label}", styles["subtitle"]))

    # Metadata Grid
    story.append(_build_metadata_table(material, mode, styles))
    story.append(Spacer(1, 4 * mm))

    # Content
    content = str(material.get("raw_markdown") or material.get("content") or "").strip()
    is_suppressed_section = False
    page_break_added = False

    for raw_line in content.replace("\r\n", "\n").replace("\r", "\n").split("\n"):
        line = raw_line.strip()
        if not line:
            continue

        markdown_heading = _MARKDOWN_PREFIX.match(line)
        if markdown_heading:
            marker, heading_text = markdown_heading.groups()
            heading = _clean_inline_markdown(heading_text)
            level = min(3, len(marker))

            if mode == "student" and _is_teacher_only_heading(heading):
                is_suppressed_section = True
                continue
            elif mode == "student" and level <= 2 and is_suppressed_section:
                if not _is_teacher_only_heading(heading):
                    is_suppressed_section = False

            if is_suppressed_section:
                continue

            if mode == "teacher" and not page_break_added and any(word in heading.upper() for word in _HEADING_BREAK_WORDS):
                story.append(PageBreak())
                page_break_added = True

            style_key = f"h{level}"
            story.append(Paragraph(_paragraph_text(heading), styles[style_key]))
            continue

        if is_suppressed_section:
            continue

        cleaned = _clean_inline_markdown(line)

        # Skip horizontal dividers
        if cleaned in ("---", "***", "___"):
            story.append(Spacer(1, 2 * mm))
            continue

        numbered = _NUMBERED_ITEM.match(cleaned)
        if numbered:
            number, item_text = numbered.groups()
            text = f"<b>{number}.</b> {_paragraph_text(item_text)}"
            story.append(Paragraph(text, styles["bullet"]))
            continue

        bullet = _BULLET_ITEM.match(cleaned)
        if bullet:
            text = f"&bull; {_paragraph_text(bullet.group(1))}"
            story.append(Paragraph(text, styles["bullet"]))
            continue

        story.append(Paragraph(_paragraph_text(cleaned), styles["body"]))

    doc.build(story, canvasmaker=NumberedCanvas)
    output.seek(0)
    return output


def create_pdf_export(material: dict[str, Any], mode: str = "teacher") -> tuple[io.BytesIO, str]:
    material_id = material.get("id") or "0"
    output = build_pdf_document(material, mode=mode)
    filename = _safe_filename(material.get("title"), material_id=material_id, mode=mode)
    return output, filename
