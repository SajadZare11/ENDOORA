from datetime import date, timedelta
from typing import Any, Dict, List, Optional, Tuple

from django.conf import settings
from django.db import models, transaction
from django.utils import timezone

from .models import LearnerLevel, LearnerStreak, XPCategory, XPTransaction

# Transparent level progression thresholds and bilingual titles (Rule #8 compliant)
LEVEL_THRESHOLDS: List[Tuple[int, int, str, str]] = [
    (1, 0, "Novice Explorer", "کاوشگر نوآموز"),
    (2, 100, "Dedicated Apprentice", "شاگرد کوشا"),
    (3, 250, "Active Practitioner", "تمرین‌کننده فعال"),
    (4, 450, "Consistent Scholar", "پژوهشگر مستمر"),
    (5, 700, "Language Navigator", "راهبر زبانی"),
    (6, 1000, "Fluency Builder", "معمار روان‌گویی"),
    (7, 1400, "Articulate Speaker", "گوینده شیوا"),
    (8, 1900, "Persistent Master", "استاد پیگیر"),
    (9, 2500, "Bilingual Scribe", "نویسنده دوزبانه"),
    (10, 3200, "Linguistic Polymath", "دانشور زبانی"),
    (11, 4000, "Advanced Orator", "سخنور پیشرفته"),
    (12, 5000, "Proficiency Pioneer", "پیشگام تسلط"),
    (13, 6200, "Academic Scholar", "پژوهشگر آکادمیک"),
    (14, 7600, "Master Communicator", "ارتباط‌گر خبره"),
    (15, 9200, "Global Ambassador", "سفیر جهانی"),
    (16, 11000, "Distinguished Linguist", "زبان‌شناس برجسته"),
    (17, 13000, "Fluency Luminary", "روشن‌ضمیر بیان"),
    (18, 15500, "Eloquent Virtuoso", "هنرمند بلاغت"),
    (19, 18500, "Grandmaster of English", "استاد بزرگ زبان"),
    (20, 22000, "Legendary Scholar", "دانشمند اسطوره‌ای"),
]


class GamificationService:
    """
    Core engine managing the financial-grade XP ledger, anti-exploit validation,
    level progression curves, and streak rules with freeze protections.
    Adheres strictly to Product Constitution Rules #7 (Calm) and #8 (Honest Assessment).
    """

    @staticmethod
    def calculate_level_progression(total_xp: int) -> Dict[str, Any]:
        """
        Calculates current level, educational titles, current bracket bounds,
        and progress percentage toward the next level from lifetime XP.
        """
        clamped_xp = max(0, int(total_xp or 0))
        current_level = 1
        title_en = LEVEL_THRESHOLDS[0][2]
        title_fa = LEVEL_THRESHOLDS[0][3]
        current_threshold = 0
        next_threshold = LEVEL_THRESHOLDS[1][1]

        for i, (lvl, thresh, t_en, t_fa) in enumerate(LEVEL_THRESHOLDS):
            if clamped_xp >= thresh:
                current_level = lvl
                title_en = t_en
                title_fa = t_fa
                current_threshold = thresh
                if i + 1 < len(LEVEL_THRESHOLDS):
                    next_threshold = LEVEL_THRESHOLDS[i + 1][1]
                else:
                    # Maximum catalog level reached
                    next_threshold = thresh + 5000
            else:
                break

        bracket_span = max(1, next_threshold - current_threshold)
        xp_in_bracket = max(0, clamped_xp - current_threshold)
        progress_percent = min(100, max(0, int((xp_in_bracket / bracket_span) * 100)))
        xp_to_next = max(0, next_threshold - clamped_xp)

        return {
            "current_level": current_level,
            "level_title_en": title_en,
            "level_title_fa": title_fa,
            "current_threshold": current_threshold,
            "next_threshold": next_threshold,
            "xp_to_next_level": xp_to_next,
            "progress_percent": progress_percent,
        }

    @classmethod
    def award_xp(
        cls,
        learner,
        amount: int,
        reason: str,
        source_event: str,
        category: str = XPCategory.MISSION,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> XPTransaction:
        """
        Atomically records an immutable XP transaction with strict idempotency.
        Prevents double-awarding XP on network retries or duplicate events.
        Automatically updates cached level record and daily streak.
        """
        clean_event = str(source_event or "").strip()
        if not clean_event:
            raise ValueError("A unique source_event idempotency key is required.")

        # Idempotency check: if transaction already exists, return existing record
        existing = XPTransaction.objects.filter(source_event=clean_event).first()
        if existing:
            return existing

        with transaction.atomic():
            # Double-check inside atomic block
            existing_locked = XPTransaction.objects.filter(source_event=clean_event).first()
            if existing_locked:
                return existing_locked

            tx = XPTransaction.objects.create(
                learner=learner,
                amount=amount,
                category=category,
                reason=reason,
                source_event=clean_event,
                metadata=metadata or {},
            )

            # Recompute lifetime total XP
            agg = XPTransaction.objects.filter(learner=learner).aggregate(models.Sum("amount"))
            total_xp = max(0, agg["amount__sum"] or 0)

            # Update LearnerLevel cache
            progression = cls.calculate_level_progression(total_xp)
            LearnerLevel.objects.update_or_create(
                learner=learner,
                defaults={
                    "current_level": progression["current_level"],
                    "total_xp": total_xp,
                    "level_title_en": progression["level_title_en"],
                    "level_title_fa": progression["level_title_fa"],
                },
            )

            # Update learner streak record for qualifying activities
            if amount > 0 and category != XPCategory.SYSTEM_ADJUSTMENT:
                cls.record_activity(learner)

            return tx

    @classmethod
    def record_activity(cls, learner, activity_date: Optional[date] = None) -> LearnerStreak:
        """
        Updates streak records using Asia/Tehran local calendar dates.
        Applies streak freeze protections to prevent punitive streak breakage (Rule #7).
        """
        today = activity_date or timezone.localdate()

        streak_record, _ = LearnerStreak.objects.get_or_create(
            learner=learner,
            defaults={
                "current_streak": 1,
                "longest_streak": 1,
                "last_activity_date": today,
                "freeze_credits": 1,
            },
        )

        last_date = streak_record.last_activity_date

        if not last_date:
            # First recorded activity
            streak_record.current_streak = 1
            streak_record.longest_streak = max(streak_record.longest_streak, 1)
            streak_record.last_activity_date = today
            streak_record.save(update_fields=["current_streak", "longest_streak", "last_activity_date", "updated_at"])
            return streak_record

        if last_date == today:
            # Already recorded today; maintain current streak
            return streak_record

        yesterday = today - timedelta(days=1)
        two_days_ago = today - timedelta(days=2)

        if last_date == yesterday:
            # Perfect consecutive day progression
            streak_record.current_streak += 1
            if streak_record.current_streak > streak_record.longest_streak:
                streak_record.longest_streak = streak_record.current_streak

            # Bonus freeze credit rewarded every 7 consecutive days (capped at 3)
            if streak_record.current_streak % 7 == 0 and streak_record.freeze_credits < 3:
                streak_record.freeze_credits += 1

            streak_record.last_activity_date = today
            streak_record.save(update_fields=["current_streak", "longest_streak", "freeze_credits", "last_activity_date", "updated_at"])
            return streak_record

        if last_date == two_days_ago:
            # Missed exactly one day - check for freeze protection
            if streak_record.freeze_credits > 0:
                streak_record.freeze_credits -= 1
                streak_record.current_streak += 1
                if streak_record.current_streak > streak_record.longest_streak:
                    streak_record.longest_streak = streak_record.current_streak
                streak_record.last_activity_date = today
                streak_record.save(update_fields=["current_streak", "longest_streak", "freeze_credits", "last_activity_date", "updated_at"])
                return streak_record

        # Missed more than one day or no freeze protection left; reset streak
        streak_record.current_streak = 1
        streak_record.longest_streak = max(streak_record.longest_streak, 1)
        streak_record.last_activity_date = today
        streak_record.save(update_fields=["current_streak", "longest_streak", "last_activity_date", "updated_at"])
        return streak_record

    @classmethod
    def get_learner_gamification_profile(cls, learner) -> Dict[str, Any]:
        """
        Retrieves a complete summary of learner gamification state,
        including XP balance, level progression, streak metrics, and recent transactions.
        """
        # Ensure level record exists
        level_record, _ = LearnerLevel.objects.get_or_create(
            learner=learner,
            defaults={
                "current_level": 1,
                "total_xp": 0,
                "level_title_en": LEVEL_THRESHOLDS[0][2],
                "level_title_fa": LEVEL_THRESHOLDS[0][3],
            },
        )

        progression = cls.calculate_level_progression(level_record.total_xp)

        # Retrieve streak record
        streak_record = LearnerStreak.objects.filter(learner=learner).first()
        today = timezone.localdate()
        current_streak = streak_record.current_streak if streak_record else 0
        longest_streak = streak_record.longest_streak if streak_record else 0
        freeze_credits = streak_record.freeze_credits if streak_record else 1
        last_activity_date = streak_record.last_activity_date if streak_record else None
        is_active_today = last_activity_date == today

        # Check if streak is stale (missed more than 1 day without freeze)
        if last_activity_date and last_activity_date < today - timedelta(days=2) and current_streak > 0:
            current_streak = 0

        # Retrieve recent transactions
        recent_txs = list(
            XPTransaction.objects.filter(learner=learner)[:10].values(
                "id", "amount", "category", "reason", "source_event", "created_at"
            )
        )

        return {
            "total_xp": level_record.total_xp,
            "current_level": progression["current_level"],
            "level_title_en": progression["level_title_en"],
            "level_title_fa": progression["level_title_fa"],
            "current_threshold": progression["current_threshold"],
            "next_threshold": progression["next_threshold"],
            "xp_to_next_level": progression["xp_to_next_level"],
            "progress_percent": progression["progress_percent"],
            "current_streak": current_streak,
            "longest_streak": longest_streak,
            "freeze_credits_remaining": freeze_credits,
            "is_streak_active_today": is_active_today,
            "last_activity_date": str(last_activity_date) if last_activity_date else None,
            "recent_transactions": recent_txs,
            "levels_catalog": [
                {
                    "level": lvl,
                    "threshold_xp": thresh,
                    "title_en": t_en,
                    "title_fa": t_fa,
                }
                for lvl, thresh, t_en, t_fa in LEVEL_THRESHOLDS
            ],
            "rule_7_disclaimer_fa": "اصل آرامش در یادگیری (قاعده ۷ قانون اساسی محصول): پیشرفت و امتیازهای این سیستم بر اساس شواهد واقعی آموزشی ثبت می‌شوند و فاقد سازوکارهای اعتیادآور یا قمارگونه هستند.",
            "rule_7_disclaimer_en": "Product Constitution Rule #7: Calm rather than addictive. Points and milestones reflect authentic learning dedication without dark patterns or manipulative mechanics.",
            "rule_8_disclaimer_fa": "اصل شفافیت آموزشی (قاعده ۸): رتبه‌ها و امتیازات بازتاب پشتکار در یادگیری هستند و نباید به عنوان مدرک رسمی یا صلاحیت دانشگاهی تلقی شوند.",
            "rule_8_disclaimer_en": "Product Constitution Rule #8: Honest assessment. Levels and milestones signify educational dedication and do not represent accredited certification.",
        }


class XPService:
    """Backward compatibility wrapper for legacy XPService references."""

    def award(self, event: Any) -> Dict[str, Any]:
        if isinstance(event, dict) and "learner" in event:
            tx = GamificationService.award_xp(
                learner=event["learner"],
                amount=event.get("amount", 10),
                reason=event.get("reason", "Activity completed"),
                source_event=event.get("source_event", f"legacy:{timezone.now().timestamp()}"),
                category=event.get("category", XPCategory.MISSION),
            )
            return {"status": "success", "transaction_id": tx.id}
        return {"status": "validated event required"}
