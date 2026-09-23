from __future__ import annotations

from decimal import Decimal
from typing import Any

from django.db.models import Count
from django.utils import timezone

from ..models import ExamSubmission, ProctoringLog

PENALTY_WEIGHTS: dict[str, Decimal] = {
    'blur': Decimal('3.00'),
    'tab_hidden': Decimal('3.00'),
    'fullscreen_exit': Decimal('10.00'),
    'paste_attempt': Decimal('5.00'),
    'devtools_attempt': Decimal('8.00'),
    'shortcut_blocked': Decimal('5.00'),
    'window_resize': Decimal('2.00'),
}

FAST_SUBMISSION_PENALTY = Decimal('15.00')


class IntegrityCalculator:
    """محاسبه‌گر هوشمند نمره اصالت و امانت‌داری آزمون (Anti-Cheat Engine)
    
    Dynamically calculates an Integrity Score (0–100%) based on total blur events,
    fullscreen drops, devtools access attempts, and abnormal submission timings.
    """

    @classmethod
    def calculate_score(cls, submission_id: str) -> dict[str, Any]:
        """Calculate and persist integrity score for a given submission."""
        submission = ExamSubmission.objects.select_related('exam').get(id=submission_id)

        # Aggregate events by type
        event_counts_query = (
            ProctoringLog.objects.filter(submission_id=submission_id)
            .values('event_type')
            .annotate(total=Count('id'))
        )
        counts: dict[str, int] = {item['event_type']: item['total'] for item in event_counts_query}

        penalties_breakdown: list[dict[str, Any]] = []
        total_penalties = Decimal('0.00')
        flags: list[str] = []

        for event_type, weight in PENALTY_WEIGHTS.items():
            count = counts.get(event_type, 0)
            if count > 0:
                penalty_for_type = Decimal(count) * weight
                total_penalties += penalty_for_type
                penalties_breakdown.append({
                    'event_type': event_type,
                    'count': count,
                    'penalty_per_event': str(weight),
                    'total_penalty': str(penalty_for_type),
                })

                if event_type == 'fullscreen_exit' and count >= 2:
                    flags.append(f"خروج مکرر از حالت تمام‌صفحه ({count} بار)")
                elif event_type in {'blur', 'tab_hidden'} and count >= 5:
                    flags.append(f"خروج مکرر از تب آزمون ({count} بار)")
                elif event_type in {'devtools_attempt', 'shortcut_blocked'} and count >= 1:
                    flags.append(f"تلاش برای استفاده از میانبرهای غیرمجاز یا DevTools ({count} بار)")

        # Timing anomaly check: fast submission (< 20% of allowed time)
        if submission.started_at and submission.submitted_at and submission.exam.duration_minutes > 0:
            allowed_seconds = submission.exam.duration_minutes * 60
            actual_seconds = (submission.submitted_at - submission.started_at).total_seconds()

            if actual_seconds > 0 and actual_seconds < (allowed_seconds * 0.20):
                total_penalties += FAST_SUBMISSION_PENALTY
                flags.append("ارسال غیرعادی در مدت زمان بسیار کوتاه (کمتر از ۲۰٪ زمان استاندارد)")
                penalties_breakdown.append({
                    'event_type': 'fast_submission_anomaly',
                    'count': 1,
                    'penalty_per_event': str(FAST_SUBMISSION_PENALTY),
                    'total_penalty': str(FAST_SUBMISSION_PENALTY),
                })

        # Calculate final integrity score
        final_score = Decimal('100.00') - total_penalties
        final_score = max(Decimal('0.00'), min(Decimal('100.00'), final_score))
        final_score = round(final_score, 2)

        details: dict[str, Any] = {
            'score': str(final_score),
            'total_penalties': str(total_penalties),
            'flags': flags,
            'event_counts': counts,
            'penalties_breakdown': penalties_breakdown,
            'calculated_at': timezone.now().isoformat(),
        }

        # Update submission model
        submission.integrity_score = final_score
        submission.integrity_details = details
        submission.save(update_fields=['integrity_score', 'integrity_details', 'updated_at'])

        return details
