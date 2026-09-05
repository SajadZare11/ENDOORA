"""
Endoora AI Mistake Genome - Service Layer
Orchestrates:
1. Pattern aggregation with strict evidence thresholds (never calling one mistake permanent DNA).
2. Distinction between occasional slips and recurring patterns.
3. Constructive L1 Persian transfer analysis avoiding shame language.
4. Learner disputes and corrections (disputed patterns stop recommendations).
5. Evidence privacy redaction and deletion retention.
6. Practice targeting integration for Daily Mission and AI Exercises.
"""

import logging
from typing import Any

from django.db import transaction
from django.utils import timezone

from .models import (
    LearnerMistakePattern,
    MistakeCategory,
    MistakeEvidence,
    MistakeSeverity,
    MistakeStatus,
)

logger = logging.getLogger(__name__)


class MistakeGenomeService:
    """Manages learner mistake patterns, evidence accumulation, disputes, and targeting."""

    # Crucial acceptance check: a pattern requires at least 2 distinct evidence events before becoming "recurring"
    EVIDENCE_RECURRING_THRESHOLD = 2

    # Maximum length for raw snippet to prevent accidental bulk data dumps
    MAX_SNIPPET_LENGTH = 500

    def record_mistake(
        self,
        learner,
        tag: str,
        category: str = MistakeCategory.GRAMMAR,
        title_fa: str = "",
        title_en: str = "",
        source_activity: str = "exercise",
        raw_snippet: str = "",
        correction_snippet: str = "",
        explanation_fa: str = "",
        explanation_en: str = "",
        severity: str = MistakeSeverity.MODERATE,
        source_id: str = "",
        l1_note_fa: str = "",
        l1_note_en: str = "",
    ) -> tuple[LearnerMistakePattern, MistakeEvidence]:
        """
        Records a mistake occurrence and updates or creates the aggregated pattern.
        """
        normalized_tag = tag.strip().lower()
        if not title_en:
            title_en = normalized_tag.replace(".", " ").replace("_", " ").title()
        if not title_fa:
            title_fa = f"الگوی {title_en}"

        # Sanitize and truncate raw snippet for learner privacy
        sanitized_raw = raw_snippet.strip()[: self.MAX_SNIPPET_LENGTH]
        sanitized_correction = correction_snippet.strip()[: self.MAX_SNIPPET_LENGTH]

        with transaction.atomic():
            pattern, created = LearnerMistakePattern.objects.select_for_update().get_or_create(
                learner=learner,
                tag=normalized_tag,
                defaults={
                    "category": category,
                    "title_fa": title_fa,
                    "title_en": title_en,
                    "l1_interference_note_fa": l1_note_fa,
                    "l1_interference_note_en": l1_note_en,
                    "status": MistakeStatus.OCCASIONAL,
                    "severity": severity,
                    "evidence_count": 0,
                    "decay_score": 1.0,
                },
            )

            # Increment evidence count
            pattern.evidence_count += 1
            pattern.decay_score = 1.0
            pattern.severity = severity

            # Update notes if provided
            if l1_note_fa and not pattern.l1_interference_note_fa:
                pattern.l1_interference_note_fa = l1_note_fa
            if l1_note_en and not pattern.l1_interference_note_en:
                pattern.l1_interference_note_en = l1_note_en

            # Transition from occasional to recurring if threshold met
            if (
                pattern.evidence_count >= self.EVIDENCE_RECURRING_THRESHOLD
                and pattern.status == MistakeStatus.OCCASIONAL
                and not pattern.is_disputed
            ):
                pattern.status = MistakeStatus.RECURRING

            pattern.save()

            evidence = MistakeEvidence.objects.create(
                pattern=pattern,
                learner=learner,
                source_activity=source_activity,
                source_id=str(source_id),
                raw_mistake_snippet=sanitized_raw,
                correction_snippet=sanitized_correction,
                explanation_fa=explanation_fa,
                explanation_en=explanation_en,
            )

        return pattern, evidence

    def dispute_pattern(
        self, learner, pattern_id: int, reason: str = ""
    ) -> LearnerMistakePattern:
        """
        Allows learner to dispute or correct a mistake classification (e.g. accidental typo).
        Disputed patterns are immediately excluded from active practice recommendations.
        """
        pattern = LearnerMistakePattern.objects.get(id=pattern_id, learner=learner)
        pattern.is_disputed = True
        pattern.status = MistakeStatus.DISPUTED
        pattern.dispute_reason = reason.strip()
        pattern.disputed_at = timezone.now()
        pattern.save(
            update_fields=["is_disputed", "status", "dispute_reason", "disputed_at"]
        )
        return pattern

    def resolve_pattern(self, learner, pattern_id: int) -> LearnerMistakePattern:
        """Marks a pattern as mastered/resolved through successful deliberate practice."""
        pattern = LearnerMistakePattern.objects.get(id=pattern_id, learner=learner)
        pattern.status = MistakeStatus.MASTERED
        pattern.save(update_fields=["status"])
        return pattern

    def delete_evidence(self, learner, evidence_id: int) -> bool:
        """
        Scrubs personal snippet text from evidence record to protect privacy while
        maintaining aggregate count integrity.
        """
        try:
            evidence = MistakeEvidence.objects.get(id=evidence_id, learner=learner)
            evidence.raw_mistake_snippet = "[حذف‌شده بر اساس درخواست حریم خصوصی]"
            evidence.is_scrubbed = True
            evidence.save(update_fields=["raw_mistake_snippet", "is_scrubbed"])
            return True
        except MistakeEvidence.DoesNotExist:
            return False

    def get_top_practice_targets(
        self, learner, limit: int = 3
    ) -> list[LearnerMistakePattern]:
        """
        Returns active patterns requiring deliberate practice.
        GUARANTEE: Disputed patterns and mastered patterns are NEVER recommended.
        """
        queryset = LearnerMistakePattern.objects.filter(
            learner=learner,
            is_disputed=False,
        ).exclude(
            status__in=[MistakeStatus.DISPUTED, MistakeStatus.MASTERED]
        )

        # Prioritize recurring patterns first, then high-count occasional patterns
        recurring = list(
            queryset.filter(status=MistakeStatus.RECURRING).order_by(
                "-evidence_count", "-last_seen_at"
            )[:limit]
        )

        if len(recurring) < limit:
            remaining_slots = limit - len(recurring)
            occasional = list(
                queryset.filter(status=MistakeStatus.OCCASIONAL)
                .exclude(id__in=[p.id for p in recurring])
                .order_by("-evidence_count", "-last_seen_at")[:remaining_slots]
            )
            recurring.extend(occasional)

        return recurring

    def get_learner_genome_summary(self, learner) -> dict[str, Any]:
        """Aggregates all mistake genome patterns for learner dashboard."""
        patterns = list(LearnerMistakePattern.objects.filter(learner=learner))

        recurring_count = sum(
            1 for p in patterns if p.status == MistakeStatus.RECURRING and not p.is_disputed
        )
        occasional_count = sum(
            1 for p in patterns if p.status == MistakeStatus.OCCASIONAL and not p.is_disputed
        )
        disputed_count = sum(1 for p in patterns if p.is_disputed)
        mastered_count = sum(1 for p in patterns if p.status == MistakeStatus.MASTERED)

        # Category distribution
        category_counts: dict[str, int] = {}
        for p in patterns:
            category_counts[p.category] = category_counts.get(p.category, 0) + 1

        top_targets = self.get_top_practice_targets(learner, limit=3)

        return {
            "total_patterns": len(patterns),
            "recurring_count": recurring_count,
            "occasional_count": occasional_count,
            "disputed_count": disputed_count,
            "mastered_count": mastered_count,
            "category_distribution": category_counts,
            "top_practice_targets": [
                {
                    "id": p.id,
                    "tag": p.tag,
                    "category": p.category,
                    "title_fa": p.title_fa,
                    "title_en": p.title_en,
                    "evidence_count": p.evidence_count,
                    "severity": p.severity,
                    "status": p.status,
                    "l1_note_fa": p.l1_interference_note_fa,
                }
                for p in top_targets
            ],
        }

    # Backward compatibility method for legacy callers
    def analyze(self, learner_id: int) -> dict[str, Any]:
        from django.contrib.auth import get_user_model
        User = get_user_model()
        try:
            learner = User.objects.get(id=learner_id)
            return self.get_learner_genome_summary(learner)
        except User.DoesNotExist:
            return {"patterns": [], "message": "Learner not found."}
