from __future__ import annotations

import io
from decimal import Decimal
from typing import Any

import openpyxl
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter

from ..models import ExamAnswer, ExamQuestion, ExamSubmission, OnlineExam


class ExamExcelExporter:
    """موتور خروجی جامع اکسل آزمون آنلاین
    
    Generates a professional 3-sheet Excel workbook with styled headers and matrix grids:
    - Sheet 1 "Summary": Student info, final scores, status, integrity score, submission time
    - Sheet 2 "Item Response Matrix": Students vs Questions matrix with responses and correctness
    - Sheet 3 "CEFR Skill Breakdown": CEFR skill-level performance
    """

    @classmethod
    def generate(cls, exam_id: str) -> io.BytesIO:
        """Generate complete 3-sheet Excel workbook for an exam."""
        exam = OnlineExam.objects.prefetch_related(
            'exam_questions__question_version',
            'submissions__student',
            'submissions__answers__exam_question__question_version',
        ).get(id=exam_id)

        wb = openpyxl.Workbook()
        # Default active sheet
        ws_summary = wb.active
        ws_summary.title = "خلاصه نتایج"

        ws_matrix = wb.create_sheet(title="ماتریس ارزیابی سوالات")
        ws_skills = wb.create_sheet(title="تفکیک مهارت‌های زبانی")

        cls._populate_summary_sheet(ws_summary, exam)
        cls._populate_matrix_sheet(ws_matrix, exam)
        cls._populate_skills_sheet(ws_skills, exam)

        output = io.BytesIO()
        wb.save(output)
        output.seek(0)
        return output

    @classmethod
    def _get_styles(cls) -> dict[str, Any]:
        header_fill = PatternFill(start_color="312E81", end_color="312E81", fill_type="solid")
        header_font = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
        sub_fill = PatternFill(start_color="4F46E5", end_color="4F46E5", fill_type="solid")
        title_font = Font(name="Calibri", size=14, bold=True, color="1E293B")
        regular_font = Font(name="Calibri", size=10)
        bold_font = Font(name="Calibri", size=10, bold=True)
        center_align = Alignment(horizontal="center", vertical="center", wrap_text=True)
        right_align = Alignment(horizontal="right", vertical="center")
        thin_border = Border(
            left=Side(style="thin", color="CBD5E1"),
            right=Side(style="thin", color="CBD5E1"),
            top=Side(style="thin", color="CBD5E1"),
            bottom=Side(style="thin", color="CBD5E1"),
        )
        return {
            'header_fill': header_fill,
            'header_font': header_font,
            'sub_fill': sub_fill,
            'title_font': title_font,
            'regular_font': regular_font,
            'bold_font': bold_font,
            'center_align': center_align,
            'right_align': right_align,
            'thin_border': thin_border,
        }

    @classmethod
    def _populate_summary_sheet(cls, ws: Any, exam: OnlineExam) -> None:
        styles = cls._get_styles()

        # Title
        ws.merge_cells("A1:G1")
        ws["A1"] = f"گزارش نتایج آزمون: {exam.title}"
        ws["A1"].font = styles['title_font']
        ws["A1"].alignment = styles['right_align']

        # Meta info
        ws["A2"] = f"مدت زمان: {exam.duration_minutes} دقیقه | نمره قبولی: {exam.passing_score}٪"
        ws["A2"].font = styles['regular_font']

        headers = [
            "ردیف",
            "نام / ایمیل زبان‌آموز",
            "وضعیت",
            "نمره نهایی",
            "درصد نمره",
            "نمره اصالت (Anti-Cheat)",
            "زمان ارسال",
        ]

        row_idx = 4
        for col_idx, header in enumerate(headers, start=1):
            cell = ws.cell(row=row_idx, column=col_idx, value=header)
            cell.fill = styles['header_fill']
            cell.font = styles['header_font']
            cell.alignment = styles['center_align']

        submissions = list(exam.submissions.all())
        for idx, sub in enumerate(submissions, start=1):
            row_idx += 1
            student_identifier = getattr(sub.student, 'name', None) or sub.student.email

            ws.cell(row=row_idx, column=1, value=idx).alignment = styles['center_align']
            ws.cell(row=row_idx, column=2, value=student_identifier).alignment = styles['right_align']
            ws.cell(row=row_idx, column=3, value=sub.status).alignment = styles['center_align']
            ws.cell(row=row_idx, column=4, value=float(sub.total_score or 0)).alignment = styles['center_align']
            ws.cell(row=row_idx, column=5, value=f"{sub.percentage or 0}%").alignment = styles['center_align']
            ws.cell(row=row_idx, column=6, value=f"{sub.integrity_score or 100}%").alignment = styles['center_align']
            ws.cell(row=row_idx, column=7, value=sub.submitted_at.strftime("%Y-%m-%d %H:%M") if sub.submitted_at else "—").alignment = styles['center_align']

            for c in range(1, 8):
                ws.cell(row=row_idx, column=c).border = styles['thin_border']
                ws.cell(row=row_idx, column=c).font = styles['regular_font']

        cls._auto_fit_columns(ws)

    @classmethod
    def _populate_matrix_sheet(cls, ws: Any, exam: OnlineExam) -> None:
        styles = cls._get_styles()

        questions = list(exam.exam_questions.select_related('question_version').order_by('order'))
        submissions = list(exam.submissions.prefetch_related('answers').all())

        ws.merge_cells("A1:D1")
        ws["A1"] = "ماتریس پاسخ‌ها و ارزیابی سوالات (Item Response Matrix)"
        ws["A1"].font = styles['title_font']

        # Header Row
        ws.cell(row=3, column=1, value="زبان‌آموز").fill = styles['header_fill']
        ws.cell(row=3, column=1).font = styles['header_font']
        ws.cell(row=3, column=1).alignment = styles['center_align']

        for col_idx, q in enumerate(questions, start=2):
            q_label = f"Q{q.order} ({q.points}ن)"
            cell = ws.cell(row=3, column=col_idx, value=q_label)
            cell.fill = styles['header_fill']
            cell.font = styles['header_font']
            cell.alignment = styles['center_align']

        row_idx = 3
        for sub in submissions:
            row_idx += 1
            student_name = getattr(sub.student, 'name', None) or sub.student.email
            cell = ws.cell(row=row_idx, column=1, value=student_name)
            cell.font = styles['bold_font']
            cell.border = styles['thin_border']

            answer_map = {ans.exam_question_id: ans for ans in sub.answers.all()}

            for col_idx, q in enumerate(questions, start=2):
                ans = answer_map.get(q.id)
                score_awarded = ans.score_awarded if ans else Decimal('0.00')
                score_val = float(score_awarded or 0)
                max_pts = float(q.points or 1)

                is_full = score_val >= max_pts
                is_zero = score_val == 0

                cell = ws.cell(row=row_idx, column=col_idx, value=score_val)
                cell.alignment = styles['center_align']
                cell.border = styles['thin_border']
                cell.font = styles['regular_font']

                if is_full:
                    cell.fill = PatternFill(start_color="DCFCE7", end_color="DCFCE7", fill_type="solid")
                elif is_zero:
                    cell.fill = PatternFill(start_color="FEE2E2", end_color="FEE2E2", fill_type="solid")
                else:
                    cell.fill = PatternFill(start_color="FEF3C7", end_color="FEF3C7", fill_type="solid")

        cls._auto_fit_columns(ws)

    @classmethod
    def _populate_skills_sheet(cls, ws: Any, exam: OnlineExam) -> None:
        styles = cls._get_styles()

        ws.merge_cells("A1:E1")
        ws["A1"] = "تفکیک عملکرد بر اساس مهارت‌های CEFR (Skills Breakdown)"
        ws["A1"].font = styles['title_font']

        headers = ["زبان‌آموز", "گرامر (Grammar)", "واژگان (Vocabulary)", "شنیداری (Listening)", "نگارش و گفتار (Speaking & Writing)"]
        row_idx = 3
        for col_idx, header in enumerate(headers, start=1):
            cell = ws.cell(row=row_idx, column=col_idx, value=header)
            cell.fill = styles['header_fill']
            cell.font = styles['header_font']
            cell.alignment = styles['center_align']

        submissions = list(exam.submissions.prefetch_related('answers__exam_question__question_version').all())
        for sub in submissions:
            row_idx += 1
            student_name = getattr(sub.student, 'name', None) or sub.student.email
            ws.cell(row=row_idx, column=1, value=student_name).font = styles['bold_font']
            ws.cell(row=row_idx, column=1).border = styles['thin_border']

            grammar_pts = Decimal('0.00')
            vocab_pts = Decimal('0.00')
            listening_pts = Decimal('0.00')
            prod_pts = Decimal('0.00')

            for ans in sub.answers.all():
                q_type = ans.exam_question.question_version.question_type
                sc = ans.score_awarded or Decimal('0.00')
                if q_type in {'mcq', 'ordering'}:
                    grammar_pts += sc
                elif q_type in {'gap', 'matching'}:
                    vocab_pts += sc
                elif q_type == 'audio':
                    listening_pts += sc
                elif q_type in {'speaking', 'long_writing'}:
                    prod_pts += sc

            ws.cell(row=row_idx, column=2, value=float(grammar_pts)).alignment = styles['center_align']
            ws.cell(row=row_idx, column=3, value=float(vocab_pts)).alignment = styles['center_align']
            ws.cell(row=row_idx, column=4, value=float(listening_pts)).alignment = styles['center_align']
            ws.cell(row=row_idx, column=5, value=float(prod_pts)).alignment = styles['center_align']

            for c in range(1, 6):
                ws.cell(row=row_idx, column=c).border = styles['thin_border']
                ws.cell(row=row_idx, column=c).font = styles['regular_font']

        cls._auto_fit_columns(ws)

    @classmethod
    def _auto_fit_columns(cls, ws: Any) -> None:
        for col in ws.columns:
            max_len = max(len(str(cell.value or '')) for cell in col)
            col_letter = get_column_letter(col[0].column)
            ws.column_dimensions[col_letter].width = max(max_len + 4, 14)
