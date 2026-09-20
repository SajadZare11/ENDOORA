from __future__ import annotations

import io
import re
from typing import Any

from docx import Document
from docx.enum.table import WD_CELL_VERTICAL_ALIGNMENT, WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Inches, Pt

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


def _clean_inline_markdown(text: str) -> str:
    cleaned = text.replace("**", "").replace("`", "")
    return cleaned.strip()


def _safe_filename(value: object, *, material_id: Any, mode: str = "teacher") -> str:
    title = _clean_inline_markdown(str(value or "Endoora_Material"))
    title = re.sub(r'[<>:"/\\|?*\x00-\x1F]', "", title)
    title = re.sub(r"\s+", " ", title).strip(" .")
    if not title:
        title = "Endoora_Material"
    if len(title) > 60:
        title = title[:60].rstrip()
    suffix = "- Student Edition" if mode == "student" else "- Teacher Edition"
    return f"{title} {suffix} (#{material_id}).docx"


def _set_cell_shading(cell: Any, fill: str) -> None:
    tc_pr = cell._tc.get_or_add_tcPr()
    shading = tc_pr.find(qn("w:shd"))
    if shading is None:
        shading = OxmlElement("w:shd")
        tc_pr.append(shading)
    shading.set(qn("w:fill"), fill)


def _set_repeat_table_header(row: Any) -> None:
    tr_pr = row._tr.get_or_add_trPr()
    tbl_header = OxmlElement("w:tblHeader")
    tbl_header.set(qn("w:val"), "true")
    tr_pr.append(tbl_header)


def _configure_document(document: Document, material: dict[str, Any], mode: str) -> None:
    section = document.sections[0]
    section.page_width = Inches(8.27)  # A4
    section.page_height = Inches(11.69)
    section.top_margin = Inches(0.65)
    section.bottom_margin = Inches(0.65)
    section.left_margin = Inches(0.7)
    section.right_margin = Inches(0.7)
    section.header_distance = Inches(0.3)
    section.footer_distance = Inches(0.3)

    normal = document.styles["Normal"]
    normal.font.name = "Arial"
    normal.font.size = Pt(10.5)
    normal.paragraph_format.space_after = Pt(4)
    normal.paragraph_format.line_spacing = 1.08

    title_style = document.styles["Title"]
    title_style.font.name = "Arial"
    title_style.font.size = Pt(20)
    title_style.font.bold = True
    title_style.paragraph_format.space_after = Pt(8)

    for style_name, size in (("Heading 1", 14), ("Heading 2", 12), ("Heading 3", 11)):
        style = document.styles[style_name]
        style.font.name = "Arial"
        style.font.size = Pt(size)
        style.font.bold = True
        style.paragraph_format.space_before = Pt(8)
        style.paragraph_format.space_after = Pt(4)
        style.paragraph_format.keep_with_next = True

    header = section.header.paragraphs[0]
    header.text = "Endoora TeacherOS  •  Classroom Material"
    header.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    for run in header.runs:
        run.font.name = "Arial"
        run.font.size = Pt(8)
        run.font.bold = True

    edition_text = "Student Edition (Handout)" if mode == "student" else "Teacher Edition (Complete)"
    footer = section.footer.paragraphs[0]
    footer.text = f"Endoora TeacherOS  |  {edition_text}  |  Material #{material.get('id', '')}"
    footer.alignment = WD_ALIGN_PARAGRAPH.CENTER
    for run in footer.runs:
        run.font.name = "Arial"
        run.font.size = Pt(8)


def _add_metadata_table(document: Document, material: dict[str, Any], mode: str) -> None:
    type_label = TYPE_LABELS.get(str(material.get("material_type") or ""), "Classroom Material")
    subtype = str(material.get("subtype") or "").strip()
    level = str(material.get("cefr_level") or material.get("level") or "").strip()
    topic = str(material.get("topic") or "").strip()
    class_title = str(material.get("class_title") or "").strip()

    rows: list[tuple[str, str]] = [("Resource Type", type_label)]
    if subtype and subtype.lower() != type_label.lower():
        rows.append(("Pedagogical Focus", subtype))
    if level:
        rows.append(("CEFR Level", level))
    if topic:
        rows.append(("Core Topic", topic))
    if class_title:
        rows.append(("Target Class", class_title))
    if mode == "student":
        rows.append(("Student Name", "___________________________    Date: ____________"))

    metadata = material.get("metadata")
    if isinstance(metadata, dict) and mode == "teacher":
        grammar = str(metadata.get("grammar_focus") or metadata.get("grammar") or "").strip()
        vocab = str(metadata.get("vocabulary_focus") or metadata.get("vocabulary") or "").strip()
        duration = metadata.get("duration") or metadata.get("duration_minutes")
        methodology = str(metadata.get("methodology") or "").upper()
        if methodology:
            rows.append(("Methodology", methodology))
        if grammar:
            rows.append(("Grammar Target", grammar))
        if vocab:
            rows.append(("Vocabulary Focus", vocab))
        if duration:
            rows.append(("Time Allocation", f"{duration} minutes"))

    table = document.add_table(rows=len(rows), cols=2)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = True
    table.style = "Table Grid"
    _set_repeat_table_header(table.rows[0])

    for row_index, (label, value) in enumerate(rows):
        label_cell, value_cell = table.rows[row_index].cells
        label_cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
        value_cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
        label_cell.text = label
        value_cell.text = value
        _set_cell_shading(label_cell, "E7E6E6")
        for run in label_cell.paragraphs[0].runs:
            run.bold = True
            run.font.name = "Arial"
            run.font.size = Pt(9)
        for run in value_cell.paragraphs[0].runs:
            run.font.name = "Arial"
            run.font.size = Pt(9)

    document.add_paragraph()


def _is_teacher_only_heading(heading: str) -> bool:
    upper = heading.upper()
    return any(keyword in upper for keyword in _TEACHER_ONLY_KEYWORDS)


def _add_content(document: Document, content: str, mode: str) -> None:
    page_break_added = False
    is_suppressed_section = False

    for raw_line in content.replace("\r\n", "\n").replace("\r", "\n").split("\n"):
        line = raw_line.strip()
        if not line:
            continue

        markdown_heading = _MARKDOWN_PREFIX.match(line)
        if markdown_heading:
            marker, heading_text = markdown_heading.groups()
            heading = _clean_inline_markdown(heading_text)
            heading_level = min(3, len(marker))

            if mode == "student" and _is_teacher_only_heading(heading):
                is_suppressed_section = True
                continue
            elif mode == "student" and heading_level <= 2 and is_suppressed_section:
                # If a new major section starts that is not teacher-only, resume
                if not _is_teacher_only_heading(heading):
                    is_suppressed_section = False

            if is_suppressed_section:
                continue

            if mode == "teacher" and not page_break_added and any(word in heading.upper() for word in _HEADING_BREAK_WORDS):
                document.add_page_break()
                page_break_added = True

            document.add_heading(heading, level=heading_level)
            continue

        if is_suppressed_section:
            continue

        cleaned = _clean_inline_markdown(line)

        # Skip horizontal dividers
        if cleaned in ("---", "***", "___"):
            p = document.add_paragraph()
            p.paragraph_format.space_before = Pt(4)
            p.paragraph_format.space_after = Pt(4)
            continue

        numbered = _NUMBERED_ITEM.match(cleaned)
        if numbered:
            number, item_text = numbered.groups()
            paragraph = document.add_paragraph()
            paragraph.paragraph_format.left_indent = Inches(0.24)
            paragraph.paragraph_format.first_line_indent = Inches(-0.24)
            paragraph.add_run(f"{number}.  {_clean_inline_markdown(item_text)}")
            continue

        bullet = _BULLET_ITEM.match(cleaned)
        if bullet:
            paragraph = document.add_paragraph(style="List Bullet")
            paragraph.add_run(_clean_inline_markdown(bullet.group(1)))
            continue

        paragraph = document.add_paragraph(cleaned)
        paragraph.paragraph_format.keep_together = False


def build_word_document(material: dict[str, Any], mode: str = "teacher") -> Document:
    document = Document()
    _configure_document(document, material, mode)

    title = _clean_inline_markdown(str(material.get("title") or "Classroom Material"))
    title_paragraph = document.add_paragraph(style="Title")
    title_paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER
    title_paragraph.add_run(title)

    subtitle = TYPE_LABELS.get(str(material.get("material_type") or ""), "Classroom Material")
    if mode == "student":
        subtitle = f"{subtitle} — Student Handout"
    else:
        subtitle = f"{subtitle} — Teacher Plan & Key"

    subtitle_paragraph = document.add_paragraph()
    subtitle_paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER
    subtitle_run = subtitle_paragraph.add_run(subtitle)
    subtitle_run.bold = True
    subtitle_run.font.name = "Arial"
    subtitle_run.font.size = Pt(10)

    _add_metadata_table(document, material, mode)

    content = str(material.get("raw_markdown") or material.get("content") or "").strip()
    if content:
        _add_content(document, content, mode)
    else:
        document.add_paragraph("This saved material has no readable content.")

    return document


def create_word_export(material: dict[str, Any], mode: str = "teacher") -> tuple[io.BytesIO, str]:
    material_id = material.get("id") or "0"
    document = build_word_document(material, mode=mode)
    output = io.BytesIO()
    document.save(output)
    output.seek(0)
    filename = _safe_filename(material.get("title"), material_id=material_id, mode=mode)
    return output, filename
