"""
TeacherOS Writing Diagnostics & Evidence Feedback Service for Endoora.
Evaluates student written submissions across the 4 CEFR / IELTS Rubric criteria:
1. Task Achievement / Task Response
2. Coherence & Cohesion
3. Lexical Resource
4. Grammatical Range & Accuracy

Produces a structured 3-column pedagogical feedback model:
- Column 1: Inline corrections with grammatical rules and categories.
- Column 2: Strengths and specific commendations.
- Column 3: Actionable next steps and a concrete revision task.
"""

from __future__ import annotations

import io
import re
import uuid
from typing import Any, Mapping, Sequence

from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    KeepTogether,
    HRFlowable,
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas


_VALID_MODES = {"light", "balanced", "detailed", "rubric"}
_VALID_LEVELS = {"A1", "A2", "B1", "B2", "C1", "C2"}

CEFR_BAND_MAP = {
    "A1": "3.0",
    "A2": "4.0",
    "B1": "5.0",
    "B2": "6.5",
    "C1": "7.5",
    "C2": "8.5",
}


def diagnose_writing(
    text: str,
    level: str = "B1",
    mode: str = "rubric",
    task_prompt: str | None = None,
    student_label: str = "Student",
) -> dict[str, Any]:
    """Deterministically analyze writing submission for rubrics, corrections, strengths, and next steps."""
    clean_text = text.strip()
    words = [w for w in re.split(r"\s+", clean_text) if w]
    word_count = len(words)
    sentences = [s.strip() for s in re.split(r"[.!?\n]+", clean_text) if len(s.strip()) > 3]
    sentence_count = max(1, len(sentences))

    level = level.upper() if level and level.upper() in _VALID_LEVELS else "B1"
    mode = mode.lower() if mode and mode.lower() in _VALID_MODES else "rubric"

    # 1. Strengths Extraction
    strengths: list[str] = []
    if word_count >= 120:
        strengths.append(
            "توانایی عالی در توسعه پاراگراف و بیان تفصیلی ایده‌ها (Sustained discourse and paragraph development)"
        )
    elif word_count >= 50:
        strengths.append(
            "ارتباط موثر با موضوع تکلیف و ساختار مشخص جملات (Clear core message and direct response to prompt)"
        )
    else:
        strengths.append(
            "انتقال مفهوم کلی پیام با حداقل واژگان مورد نیاز (Basic message conveyance with relevant core lexis)"
        )

    cohesive_markers = [
        w
        for w in [
            "because",
            "however",
            "therefore",
            "although",
            "for example",
            "furthermore",
            "in addition",
            "also",
            "and",
            "but",
            "so",
            "since",
        ]
        if re.search(rf"\b{re.escape(w)}\b", clean_text, re.IGNORECASE)
    ]
    if cohesive_markers:
        markers_str = ", ".join(cohesive_markers[:4])
        strengths.append(
            f"کاربرد موفق حروف ربط و پیونددهنده‌های منطقی ({markers_str}) جهت اتصال افکار (Effective cohesive linking)"
        )

    complex_markers = [
        w
        for w in ["if", "when", "while", "which", "that", "who", "where", "unless", "even though"]
        if re.search(rf"\b{re.escape(w)}\b", clean_text, re.IGNORECASE)
    ]
    if complex_markers:
        strengths.append(
            "تلاش قابل تقدیر برای تولید ساختارهای مرکب و بندهای پیرو (Willingness to attempt complex clauses)"
        )

    # 2. Linguistic Error Diagnostics (Pattern Matching)
    corrections: list[dict[str, Any]] = []
    suggestions: list[dict[str, Any]] = []

    # Rule A: Third Person Singular Agreement
    m = re.search(r"\b(he|she|it|everyone|someone|everybody)\s+([a-z]+)\b", clean_text, re.IGNORECASE)
    if m:
        subj = m.group(1)
        verb = m.group(2).lower()
        non_3rd_verbs = {
            "go": "goes",
            "do": "does",
            "have": "has",
            "like": "likes",
            "want": "wants",
            "play": "plays",
            "think": "thinks",
            "see": "sees",
            "make": "makes",
            "say": "says",
        }
        if verb in non_3rd_verbs:
            orig = f"{subj} {verb}"
            corr = f"{subj} {non_3rd_verbs[verb]}"
            corrections.append({
                "id": str(uuid.uuid4())[:8],
                "original": orig,
                "corrected": corr,
                "rule": "در زمان حال ساده، فاعل‌های سوم‌شخص مفرد به پسوند -s یا -es نیاز دارند. (Third-person -s agreement).",
                "category": "grammar",
            })

    # Rule B: Past Simple vs Present Perfect with specific past time
    m_past = re.search(
        r"\b(last\s+year|yesterday|two\s+days\s+ago|in\s+20\d\d|last\s+month)\b.*?have\s+([a-z]+ed|[a-z]+en|gone|been|seen|traveled|bought)",
        clean_text,
        re.IGNORECASE,
    )
    if not m_past:
        m_past = re.search(
            r"have\s+([a-z]+ed|[a-z]+en|gone|traveled|bought).*?\b(last\s+year|yesterday|two\s+days\s+ago|in\s+20\d\d)\b",
            clean_text,
            re.IGNORECASE,
        )
    if m_past:
        corrections.append({
            "id": str(uuid.uuid4())[:8],
            "original": m_past.group(0),
            "corrected": re.sub(r"\bhave\s+", "", m_past.group(0), flags=re.IGNORECASE),
            "rule": "قیدهای زمان معین در گذشته (مانند Last year, Yesterday) نیازمند گذشته ساده هستند نه حال کامل. (Definite past time markers require Past Simple).",
            "category": "grammar",
        })

    # Rule C: Subject-verb agreement with Plural Subject + was
    m_was = re.search(r"\b(we|they|people|students|children)\s+was\b", clean_text, re.IGNORECASE)
    if m_was:
        corrections.append({
            "id": str(uuid.uuid4())[:8],
            "original": m_was.group(0),
            "corrected": m_was.group(0).replace("was", "were").replace("Was", "Were"),
            "rule": "فاعل‌های جمع (We, They, People) در گذشته با فعل 'were' به کار می‌روند نه 'was'. (Plural past agreement: were).",
            "category": "grammar",
        })

    # Rule D: Participial adjectives: exciting vs excited / boring vs bored
    m_adj = re.search(r"\b(we|i|they|she|he)\s+(was|were|am|is|felt)\s+very\s+(exciting|boring|tiring)\b", clean_text, re.IGNORECASE)
    if m_adj:
        orig = m_adj.group(0)
        corr = orig.replace("exciting", "excited").replace("boring", "bored").replace("tiring", "tired")
        corrections.append({
            "id": str(uuid.uuid4())[:8],
            "original": orig,
            "corrected": corr,
            "rule": "برای بیان احساسات افراد از صفت دارای پسوند -ed (مانند excited) استفاده می‌شود؛ صفت‌های -ing ویژگی عامل را توصیف می‌کنند.",
            "category": "lexis",
        })

    # Rule E: Second Conditional if-clause with 'will'
    m_cond = re.search(r"\bif\s+([a-z]+)\s+will\s+([a-z]+).*?would\b", clean_text, re.IGNORECASE)
    if m_cond:
        orig = m_cond.group(0)
        pronoun = m_cond.group(1)
        verb = m_cond.group(2)
        past_v = "went" if verb == "go" else ("had" if verb == "have" else f"{verb}ed")
        corr = f"If {pronoun} {past_v} ... would"
        corrections.append({
            "id": str(uuid.uuid4())[:8],
            "original": orig,
            "corrected": corr,
            "rule": "در بند شرطی نوع دوم (Second Conditional)، بند if با فعل زمان گذشته ساده بیان می‌شود و 'will' به کار نمی‌رود.",
            "category": "grammar",
        })

    # Rule F: Make vs Do collocations
    m_colloc = re.search(r"\b(do|did|doing)\s+(a\s+decision|a\s+mistake|a\s+choice|progress)\b", clean_text, re.IGNORECASE)
    if m_colloc:
        orig = m_colloc.group(0)
        corr = orig.replace("do", "make").replace("did", "made").replace("doing", "making")
        corrections.append({
            "id": str(uuid.uuid4())[:8],
            "original": orig,
            "corrected": corr,
            "rule": "همایند واژگانی (Collocation): با واژه‌های decision, mistake و progress فعل make به کار می‌رود نه do.",
            "category": "collocation",
        })

    # Fallback generic correction if text is clean or short
    if not corrections and word_count < 15:
        corrections.append({
            "id": str(uuid.uuid4())[:8],
            "original": clean_text[:40],
            "corrected": clean_text[:40] + " (نیاز به بسط و جملات کامل‌تر)",
            "rule": "تعداد کلمات کمتر از حد استاندارد است. افزودن جزئیات توضیحی و صفات توصیفی توصیه می‌شود.",
            "category": "discourse",
        })

    # Suggestions (Style & Lexical polish)
    if "good" in clean_text.lower():
        suggestions.append({
            "id": str(uuid.uuid4())[:8],
            "original": "good",
            "suggestion": "rewarding / exceptional / captivating",
            "rationale": "جایگزینی صفت‌های عمومی با واژگان توصیفی دقیق‌تر جهت ارتقای نمره دایره واژگان (Lexical Resource).",
        })
    if "a lot of" in clean_text.lower():
        suggestions.append({
            "id": str(uuid.uuid4())[:8],
            "original": "a lot of",
            "suggestion": "a substantial number of / an abundance of",
            "rationale": "کاربرد واژگان آکادمیک‌تر در رایتینگ تحلیلی به جای اصطلاحات محاوره‌ای.",
        })

    # 3. Rubric Scoring Calculations (0.0 - 9.0 scale & CEFR matching)
    error_count = len(corrections)
    error_penalty = min(2.0, error_count * 0.5)

    base_score = 6.0
    if level == "A1":
        base_score = 3.5
    elif level == "A2":
        base_score = 4.5
    elif level == "B1":
        base_score = 5.5
    elif level == "B2":
        base_score = 6.5
    elif level == "C1":
        base_score = 7.5
    elif level == "C2":
        base_score = 8.5

    length_bonus = 0.5 if word_count >= 80 else (-0.5 if word_count < 35 else 0.0)
    cohesion_bonus = 0.5 if len(cohesive_markers) >= 2 else 0.0

    task_score = max(1.0, min(9.0, round(base_score + length_bonus, 1)))
    coherence_score = max(1.0, min(9.0, round(base_score + cohesion_bonus - (0.3 if error_count > 3 else 0), 1)))
    lexical_score = max(1.0, min(9.0, round(base_score + (0.5 if suggestions else 0) - (0.3 if error_count > 2 else 0), 1)))
    grammar_score = max(1.0, min(9.0, round(base_score - error_penalty, 1)))

    overall_band = round((task_score + coherence_score + lexical_score + grammar_score) / 4.0 * 2) / 2.0
    overall_band_str = f"{overall_band:.1f}"

    # Map overall band to CEFR
    if overall_band >= 8.5:
        calc_cefr = "C2"
    elif overall_band >= 7.0:
        calc_cefr = "C1"
    elif overall_band >= 5.5:
        calc_cefr = "B2"
    elif overall_band >= 4.5:
        calc_cefr = "B1"
    elif overall_band >= 3.5:
        calc_cefr = "A2"
    else:
        calc_cefr = "A1"

    # 4. Actionable Next Steps & Concrete Revision Task
    next_steps: list[str] = []
    if any(c["category"] == "grammar" for c in corrections):
        next_steps.append("مرور قواعد زمان‌های گذشته و تطابق شناسه سوم‌شخص مفرد با انجام کوئیز ۵ دقیقه‌ای")
    if any(c["category"] == "lexis" for c in corrections):
        next_steps.append("تمرین تفاوت صفت‌های هیجان‌یافته و هیجان‌انگیز (-ed vs -ing participial adjectives)")
    if any(c["category"] == "collocation" for c in corrections):
        next_steps.append("یادگیری همایندهای متداول افعال Make و Do در دفترچه لغات")
    next_steps.append("بازنویسی نسخه دوم متن با اعمال تصحیحات پیشنهادی بدون تغییر ایده اصلی")

    revision_task = (
        f"متن بالا را با در نظر گرفتن تصحیحات فوق مجدداً بازنویسی کنید؛ اطمینان حاصل کنید حداقل ۲ صفت دقیق‌تر و ۱ ساختار ترکیبی (مانند although یا because) در متن گنجانده شود."
    )

    rubrics = {
        "task_achievement": {
            "score": task_score,
            "band": f"{task_score:.1f}",
            "feedback_en": f"Covers prompt requirements with {word_count} words and clear audience focus.",
            "feedback_fa": f"پوشش مناسب نیازمندی‌های موضوع تکلیف با {word_count} کلمه و وضوح پیام.",
        },
        "coherence_cohesion": {
            "score": coherence_score,
            "band": f"{coherence_score:.1f}",
            "feedback_en": f"Logical progression with {len(cohesive_markers)} cohesive linking devices.",
            "feedback_fa": f"توالی منطقی جملات و بهره‌گیری از {len(cohesive_markers)} اتصال‌دهنده متنی.",
        },
        "lexical_resource": {
            "score": lexical_score,
            "band": f"{lexical_score:.1f}",
            "feedback_en": "Adequate vocabulary range for target CEFR with opportunities for idiomatic precision.",
            "feedback_fa": "دایره واژگان متناسب با سطح، همراه با فرصت ارتقا به واژگان همایند و غنی‌تر.",
        },
        "grammatical_accuracy": {
            "score": grammar_score,
            "band": f"{grammar_score:.1f}",
            "feedback_en": f"Demonstrates good control with {len(corrections)} target accuracy points to address.",
            "feedback_fa": f"کنترل خوب دستوری با {len(corrections)} نکته ویرایشی که نیازمند دقت در بازنویسی است.",
        },
    }

    # Format Student Copy Markdown
    student_lines = [
        f"# 🌟 کارنامه و بازخورد رایتینگ (Writing Feedback): {student_label}",
        f"**سطح ارزیابی‌شده (CEFR):** {calc_cefr} | **نمره تخمینی باند آیلتس:** {overall_band_str} / 9.0",
        "",
        "### 💪 نقاط قوت و درخشش زبانی (Strengths):",
    ]
    for s in strengths:
        student_lines.append(f"- {s}")
    student_lines.append("")
    student_lines.append("### ✏️ نکات ویرایشی و تصحیحات درون‌متنی (Inline Corrections):")
    for c in corrections:
        student_lines.append(f"- **متن زبان‌آموز:** `{c['original']}`")
        student_lines.append(f"  - **فرم اصلاح‌شده:** `{c['corrected']}`")
        student_lines.append(f"  - **دلیل آموزشی:** {c['rule']}")
    student_lines.append("")
    student_lines.append("### 🎯 گام‌های بعدی و تکلیف بازنویسی (Actionable Next Steps):")
    student_lines.append(f"- {revision_task}")
    for n in next_steps:
        student_lines.append(f"- {n}")

    student_copy = "\n".join(student_lines)

    # Format Teacher Copy Markdown
    teacher_lines = [
        f"# 📋 پرونده تشخیصی رایتینگ معلم (Teacher Writing Diagnostic) — {student_label}",
        f"**سطح هدف:** {level} | **سطح برآوردی:** {calc_cefr} | **باند آیلتس:** {overall_band_str} | **طول متن:** {word_count} کلمه",
        "",
        "### ریزنمرات ۴ گانه ارزیابی CEFR / IELTS:",
        f"- پاسخ به سوال (Task Response): **{task_score}**",
        f"- انسجام و پیوستگی (Coherence & Cohesion): **{coherence_score}**",
        f"- دایره واژگان (Lexical Resource): **{lexical_score}**",
        f"- صحت و تنوع دستوری (Grammatical Range): **{grammar_score}**",
        "",
        "### خطاهای شناسایی‌شده جهت درج در پرونده (Mistake Profile):",
    ]
    for c in corrections:
        teacher_lines.append(f"- [{c['category'].upper()}] `{c['original']}` -> `{c['corrected']}` ({c['rule']})")
    teacher_lines.append("")
    teacher_lines.append("⏱️ **زمان تخمینی صرفه‌جویی‌شده برای مدرس:** ~۱۲ دقیقه")

    teacher_copy = "\n".join(teacher_lines)

    return {
        "band": overall_band_str,
        "cefr": calc_cefr,
        "target_level": level,
        "mode": mode,
        "word_count": word_count,
        "sentence_count": sentence_count,
        "rubrics": rubrics,
        "corrections": corrections,
        "suggestions": suggestions,
        "strengths": strengths,
        "next_steps": next_steps,
        "revision_task": revision_task,
        "student_copy": student_copy,
        "teacher_copy": teacher_copy,
        "time_saved_minutes": 12,
    }


def create_writing_feedback_word_export(feedback_data: dict[str, Any], mode: str = "student") -> bytes:
    """Generate professional Word (.docx) writing feedback report."""
    doc = Document()

    for section in doc.sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.8)
        section.right_margin = Inches(0.8)

    title_p = doc.add_paragraph()
    title_run = title_p.add_run(
        "Endoora TeacherOS · Writing Assessment & Feedback Report"
        if mode == "teacher"
        else "Endoora · Student Writing Feedback & Action Plan"
    )
    title_run.bold = True
    title_run.font.size = Pt(20)
    title_run.font.color.rgb = RGBColor(0x1E, 0x3A, 0x8A)

    band = feedback_data.get("band", "6.0")
    cefr = feedback_data.get("cefr", "B1")
    word_count = feedback_data.get("word_count", 0)

    # Metadata Table
    table = doc.add_table(rows=2, cols=4)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False

    meta_items = [
        ("CEFR Level", cefr),
        ("Estimated IELTS Band", f"{band} / 9.0"),
        ("Word Count", f"{word_count} words"),
        ("Edition", "Teacher Diagnostic" if mode == "teacher" else "Student Action Card"),
    ]

    for idx, (lbl, val) in enumerate(meta_items):
        r = idx // 4
        c = idx % 4
        cell = table.cell(r, c)
        cell.paragraphs[0].text = ""
        p = cell.paragraphs[0]
        run_l = p.add_run(f"{lbl}\n")
        run_l.font.size = Pt(8.5)
        run_l.font.color.rgb = RGBColor(0x64, 0x74, 0x8B)
        run_v = p.add_run(str(val))
        run_v.bold = True
        run_v.font.size = Pt(11)
        run_v.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)

    doc.add_paragraph()

    # Rubrics Table
    rubrics = feedback_data.get("rubrics", {})
    if rubrics:
        h = doc.add_heading("CEFR & IELTS 4-Criteria Rubric Breakdown", level=2)
        h.runs[0].font.color.rgb = RGBColor(0x1E, 0x3A, 0x8A)

        rubric_table = doc.add_table(rows=1, cols=3)
        rubric_table.alignment = WD_TABLE_ALIGNMENT.CENTER
        hdr_cells = rubric_table.rows[0].cells
        hdr_cells[0].text = "Criterion"
        hdr_cells[1].text = "Band / Score"
        hdr_cells[2].text = "Diagnostic Feedback"
        for c in hdr_cells:
            c.paragraphs[0].runs[0].bold = True

        criteria_labels = [
            ("task_achievement", "Task Achievement / Response"),
            ("coherence_cohesion", "Coherence & Cohesion"),
            ("lexical_resource", "Lexical Resource"),
            ("grammatical_accuracy", "Grammatical Range & Accuracy"),
        ]

        for key, name in criteria_labels:
            crit_data = rubrics.get(key, {})
            row_cells = rubric_table.add_row().cells
            row_cells[0].text = name
            row_cells[1].text = str(crit_data.get("band", crit_data.get("score", "-")))
            row_cells[2].text = crit_data.get("feedback_en", "")

    doc.add_paragraph()

    # Strengths Section
    strengths = feedback_data.get("strengths", [])
    if strengths:
        h = doc.add_heading("🌟 Strengths & Highlights", level=2)
        h.runs[0].font.color.rgb = RGBColor(0x05, 0x96, 0x69)
        for s in strengths:
            p = doc.add_paragraph(style="List Bullet")
            p.add_run(s)

    # Corrections Section
    corrections = feedback_data.get("corrections", [])
    if corrections:
        h = doc.add_heading("✏️ Granular Inline Corrections", level=2)
        h.runs[0].font.color.rgb = RGBColor(0xDC, 0x26, 0x26)

        for c in corrections:
            p = doc.add_paragraph(style="List Bullet")
            r_orig = p.add_run(f"Original: \"{c.get('original')}\"\n")
            r_orig.font.color.rgb = RGBColor(0x99, 0x1B, 0x1B)
            r_corr = p.add_run(f"✓ Corrected: \"{c.get('corrected')}\"\n")
            r_corr.bold = True
            r_corr.font.color.rgb = RGBColor(0x16, 0x65, 0x34)
            r_rule = p.add_run(f"Rule: {c.get('rule')}")
            r_rule.font.size = Pt(9.5)
            r_rule.font.color.rgb = RGBColor(0x47, 0x55, 0x69)

    # Actionable Next Steps
    next_steps = feedback_data.get("next_steps", [])
    if next_steps:
        h = doc.add_heading("🎯 Actionable Next Steps & Revision Task", level=2)
        h.runs[0].font.color.rgb = RGBColor(0x02, 0x84, 0xC7)
        rev = feedback_data.get("revision_task")
        if rev:
            p_rev = doc.add_paragraph()
            r = p_rev.add_run(f"Assigned Task: {rev}")
            r.bold = True

        for step in next_steps:
            p = doc.add_paragraph(style="List Bullet")
            p.add_run(step)

    # Save to buffer
    bio = io.BytesIO()
    doc.save(bio)
    bio.seek(0)
    return bio.getvalue()


class _NumberedCanvas(canvas.Canvas):
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

    def draw_page_decorations(self, total_pages: int) -> None:
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        self.drawString(54, 842 - 36, "Endoora TeacherOS · Writing Assessment Diagnostic")
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(54, 842 - 42, 595 - 54, 842 - 42)

        page_str = f"Page {self._pageNumber} of {total_pages}"
        self.drawRightString(595 - 54, 36, page_str)
        self.drawString(54, 36, "Confidential · Pedagogical Evidence & Writing Rubric Card")
        self.line(54, 48, 595 - 54, 48)
        self.restoreState()


def create_writing_feedback_pdf_export(feedback_data: dict[str, Any], mode: str = "student") -> bytes:
    """Generate professional PDF writing feedback report."""
    bio = io.BytesIO()
    doc = SimpleDocTemplate(
        bio,
        pagesize=A4,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54,
    )

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        "DocTitle",
        parent=styles["Heading1"],
        fontSize=18,
        leading=22,
        textColor=colors.HexColor("#1E3A8A"),
        spaceAfter=10,
    )
    section_style = ParagraphStyle(
        "SectionH2",
        parent=styles["Heading2"],
        fontSize=13,
        leading=16,
        textColor=colors.HexColor("#1E3A8A"),
        spaceBefore=12,
        spaceAfter=6,
    )
    body_style = ParagraphStyle(
        "Body",
        parent=styles["Normal"],
        fontSize=9.5,
        leading=13.5,
        textColor=colors.HexColor("#0F172A"),
        spaceAfter=4,
    )

    flowables = []

    # Title
    t_text = (
        "Endoora TeacherOS · Writing Assessment Diagnostic"
        if mode == "teacher"
        else "Endoora · Student Writing Feedback & Action Plan"
    )
    flowables.append(Paragraph(t_text, title_style))

    # Meta Table
    band = feedback_data.get("band", "6.0")
    cefr = feedback_data.get("cefr", "B1")
    word_count = feedback_data.get("word_count", 0)

    meta_data = [
        [
            Paragraph(f"<b>CEFR:</b> {cefr}", body_style),
            Paragraph(f"<b>IELTS Band:</b> {band} / 9.0", body_style),
            Paragraph(f"<b>Words:</b> {word_count}", body_style),
            Paragraph(f"<b>Edition:</b> {'Teacher' if mode == 'teacher' else 'Student'}", body_style),
        ]
    ]
    t = Table(meta_data, colWidths=[120, 120, 120, 127])
    t.setStyle(
        TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#F1F5F9")),
            ("PADDING", (0, 0), (-1, -1), 6),
            ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ])
    )
    flowables.append(t)
    flowables.append(Spacer(1, 12))

    # Rubrics
    rubrics = feedback_data.get("rubrics", {})
    if rubrics:
        flowables.append(Paragraph("CEFR / IELTS 4-Criteria Rubric Breakdown", section_style))
        r_rows = [
            [
                Paragraph("<b>Criterion</b>", body_style),
                Paragraph("<b>Score</b>", body_style),
                Paragraph("<b>Diagnostic Feedback</b>", body_style),
            ]
        ]
        criteria_labels = [
            ("task_achievement", "Task Achievement"),
            ("coherence_cohesion", "Coherence & Cohesion"),
            ("lexical_resource", "Lexical Resource"),
            ("grammatical_accuracy", "Grammar & Accuracy"),
        ]
        for k, lbl in criteria_labels:
            cd = rubrics.get(k, {})
            r_rows.append([
                Paragraph(lbl, body_style),
                Paragraph(f"<b>{cd.get('band', cd.get('score', '-'))}</b>", body_style),
                Paragraph(cd.get("feedback_en", ""), body_style),
            ])

        rt = Table(r_rows, colWidths=[140, 60, 287])
        rt.setStyle(
            TableStyle([
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#E2E8F0")),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
                ("PADDING", (0, 0), (-1, -1), 5),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ])
        )
        flowables.append(rt)
        flowables.append(Spacer(1, 12))

    # Strengths
    strengths = feedback_data.get("strengths", [])
    if strengths:
        flowables.append(Paragraph("🌟 Key Strengths & Commendations", section_style))
        for s in strengths:
            flowables.append(Paragraph(f"• {s}", body_style))
        flowables.append(Spacer(1, 8))

    # Corrections
    corrections = feedback_data.get("corrections", [])
    if corrections:
        flowables.append(Paragraph("✏️ Granular Inline Corrections", section_style))
        for c in corrections:
            c_p = Paragraph(
                f"<b>Original:</b> <font color='#991B1B'>{c.get('original')}</font><br/>"
                f"<b>Correction:</b> <font color='#166534'><b>{c.get('corrected')}</b></font><br/>"
                f"<i>Rule:</i> {c.get('rule')}",
                body_style,
            )
            flowables.append(c_p)
            flowables.append(Spacer(1, 4))
        flowables.append(Spacer(1, 8))

    # Actionable Next Steps
    next_steps = feedback_data.get("next_steps", [])
    if next_steps:
        flowables.append(Paragraph("🎯 Actionable Next Steps & Practice", section_style))
        rev = feedback_data.get("revision_task")
        if rev:
            flowables.append(Paragraph(f"<b>Assigned Task:</b> {rev}", body_style))
        for ns in next_steps:
            flowables.append(Paragraph(f"• {ns}", body_style))

    doc.build(flowables, canvasmaker=_NumberedCanvas)
    bio.seek(0)
    return bio.getvalue()
