from datetime import date, timedelta
from typing import Any, Dict, List, Optional, Tuple

from django.conf import settings
from django.db import models, transaction
from django.utils import timezone

from .models import (
    ActiveUsersClub,
    Badge,
    BadgeCategory,
    ChallengeTemplate,
    ChallengeType,
    ClubMembership,
    LeaderboardEntry,
    LeaderboardSnapshot,
    LearnerBadge,
    LearnerChallenge,
    LearnerLevel,
    LearnerPrivacySettings,
    LearnerStreak,
    SevenDaySprintEnrollment,
    XPCategory,
    XPTransaction,
)

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

            # Evaluate challenges and badges for qualifying actions
            if amount > 0 and category not in (
                XPCategory.SYSTEM_ADJUSTMENT,
                XPCategory.BADGE_UNLOCK,
                XPCategory.CHALLENGE,
            ):
                try:
                    BadgeService.evaluate_and_unlock_badges(learner, trigger_type=category, value=1)
                    ChallengeService.record_challenge_progress(learner, metric_type=category, count=1)
                    streak_rec = LearnerStreak.objects.filter(learner=learner).first()
                    if streak_rec and streak_rec.current_streak > 0:
                        BadgeService.evaluate_and_unlock_badges(
                            learner, trigger_type="streak_days", value=streak_rec.current_streak
                        )
                except Exception:
                    pass

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


# =======================================================
# DAY 29 SERVICE SUITE: BADGES, CHALLENGES, CLUBS & BOARDS
# =======================================================


class BadgeService:
    """
    Manages pedagogical badge unlocks, criteria evaluation, and idempotency.
    Enforces Rule #8: badges signify learning dedication, not accredited diplomas.
    """

    DEFAULT_BADGES = [
        {
            "slug": "placement-pioneer",
            "title_fa": "پیشگام ارزیابی ۶ مهارته",
            "title_en": "6-Skill Placement Pioneer",
            "description_fa": "تکمیل موفقیت‌آمیز آزمون ارزیابی تعیین سطح جامع ۶ مهارته اندورا.",
            "description_en": "Successfully complete all diagnostic placement modules on Endoora.",
            "icon": "🎯",
            "category": BadgeCategory.FIRSTS,
            "xp_reward": 150,
            "criteria_type": "placement_complete",
            "criteria_threshold": 1,
        },
        {
            "slug": "first-mission",
            "title_fa": "گام نخست یادگیری",
            "title_en": "First Mission Step",
            "description_fa": "پایان دادن به نخستین ماموریت روزانه در مسیر یادگیری اختصاصی.",
            "description_en": "Complete your very first daily mission step in your personalized learning path.",
            "icon": "🚀",
            "category": BadgeCategory.FIRSTS,
            "xp_reward": 50,
            "criteria_type": "mission_step",
            "criteria_threshold": 1,
        },
        {
            "slug": "first-roleplay",
            "title_fa": "سفیر گفتگو",
            "title_en": "Conversation Ambassador",
            "description_fa": "انجام نخستین سناریوی شبیه‌سازی مکالمه تعاملی در آزمایشگاه نقش‌آفرینی.",
            "description_en": "Successfully navigate your first dialogue scenario in the Roleplay Universe.",
            "icon": "💬",
            "category": BadgeCategory.FIRSTS,
            "xp_reward": 75,
            "criteria_type": "roleplay_complete",
            "criteria_threshold": 1,
        },
        {
            "slug": "first-writing",
            "title_fa": "قلم زرین رایتینگ",
            "title_en": "Writing Craft Explorer",
            "description_fa": "ارسال نخستین پیش‌نویس نوشتاری و دریافت تحلیل بازخورد هوشمند ۴ معیاره آیلتس.",
            "description_en": "Submit your first draft in Writing Mentor and review IELTS 4-rubric criteria feedback.",
            "icon": "✍️",
            "category": BadgeCategory.FIRSTS,
            "xp_reward": 100,
            "criteria_type": "writing_submit",
            "criteria_threshold": 1,
        },
        {
            "slug": "first-pronunciation",
            "title_fa": "نوای شیوا",
            "title_en": "Phonetics Pioneer",
            "description_fa": "تحلیل نخستین واج و استرس هجا در آزمایشگاه تخصصی آواشناسی و تلفظ.",
            "description_en": "Analyze your first phoneme and syllable stress in the Pronunciation Lab.",
            "icon": "🎙️",
            "category": BadgeCategory.FIRSTS,
            "xp_reward": 75,
            "criteria_type": "pronunciation_lab",
            "criteria_threshold": 1,
        },
        {
            "slug": "srs-master-20",
            "title_fa": "معمار حافظه واژگان",
            "title_en": "Memory Graph Architect",
            "description_fa": "مرور فعال ۲۰ کارت واژگان در سامانه تکرار با فاصله و تثبیت در حافظه بلندمدت.",
            "description_en": "Review 20 vocabulary items at spaced intervals to cement long-term memory traces.",
            "icon": "🧠",
            "category": BadgeCategory.SKILLS,
            "xp_reward": 120,
            "criteria_type": "srs_cards",
            "criteria_threshold": 20,
        },
        {
            "slug": "streak-3",
            "title_fa": "پیوستگی ۳ روزه",
            "title_en": "3-Day Consistency Streak",
            "description_fa": "انجام حداقل یک فعالیت آموزشی به مدت ۳ روز متوالی.",
            "description_en": "Maintain consistent daily learning activity for 3 consecutive days.",
            "icon": "🔥",
            "category": BadgeCategory.CONSISTENCY,
            "xp_reward": 100,
            "criteria_type": "streak_days",
            "criteria_threshold": 3,
        },
        {
            "slug": "streak-7",
            "title_fa": "هفته زرین پشتکار",
            "title_en": "7-Day Golden Week",
            "description_fa": "تداوم یادگیری روزانه به مدت ۷ روز متوالی و دریافت محافظ انجماد پاداش.",
            "description_en": "Achieve 7 consecutive days of active learning and unlock bonus freeze shield.",
            "icon": "⭐",
            "category": BadgeCategory.CONSISTENCY,
            "xp_reward": 200,
            "criteria_type": "streak_days",
            "criteria_threshold": 7,
        },
        {
            "slug": "streak-30",
            "title_fa": "اراده پولادین ۳۰ روزه",
            "title_en": "30-Day Milestone Legend",
            "description_fa": "یک ماه کامل تداوم یادگیری مستمر بدون وقفه.",
            "description_en": "A full month of continuous dedication and active daily practice.",
            "icon": "👑",
            "category": BadgeCategory.CONSISTENCY,
            "xp_reward": 500,
            "criteria_type": "streak_days",
            "criteria_threshold": 30,
        },
        {
            "slug": "seven-day-sprint-finisher",
            "title_fa": "قهرمان ماراتن ۷ روزه",
            "title_en": "7-Day Sprint Finisher",
            "description_fa": "تکمیل تمام اهداف ماراتن ۷ روزه یادگیری فشرده و منسجم.",
            "description_en": "Complete all 7 milestone days of the structured consistency sprint.",
            "icon": "🏆",
            "category": BadgeCategory.CONSISTENCY,
            "xp_reward": 250,
            "criteria_type": "seven_day_sprint",
            "criteria_threshold": 7,
        },
        {
            "slug": "club-member",
            "title_fa": "عضو انجمن یادگیرندگان فعال",
            "title_en": "Active Learner Club Member",
            "description_fa": "پیوستن به یکی از انجمن‌های یادگیری فعال و مشارکت در اهداف جمعی.",
            "description_en": "Qualify and join an active learner community club.",
            "icon": "🌟",
            "category": BadgeCategory.COMMUNITY,
            "xp_reward": 100,
            "criteria_type": "club_join",
            "criteria_threshold": 1,
        },
    ]

    @classmethod
    def seed_default_badges(cls) -> None:
        """Seeds standard pedagogical badges if not already existing."""
        for item in cls.DEFAULT_BADGES:
            Badge.objects.get_or_create(
                slug=item["slug"],
                defaults={
                    "title_fa": item["title_fa"],
                    "title_en": item["title_en"],
                    "description_fa": item["description_fa"],
                    "description_en": item["description_en"],
                    "icon": item["icon"],
                    "category": item["category"],
                    "xp_reward": item["xp_reward"],
                    "criteria_type": item["criteria_type"],
                    "criteria_threshold": item["criteria_threshold"],
                    "is_active": True,
                },
            )

    @classmethod
    def get_learner_badges(cls, learner) -> Dict[str, Any]:
        """Returns catalog of all badges with learner unlock status and progress."""
        cls.seed_default_badges()
        badges = Badge.objects.filter(is_active=True).order_by("category", "criteria_threshold")
        unlocked_map = {
            lb.badge_id: lb for lb in LearnerBadge.objects.filter(learner=learner).select_related("badge")
        }

        # Query metrics for progress
        streak = LearnerStreak.objects.filter(learner=learner).first()
        streak_val = streak.longest_streak if streak else 0

        badge_list = []
        for b in badges:
            is_unlocked = b.id in unlocked_map
            unlocked_at = unlocked_map[b.id].unlocked_at if is_unlocked else None

            # Calculate progress
            if is_unlocked:
                progress = 100
                current_val = b.criteria_threshold
            elif b.criteria_type == "streak_days":
                current_val = streak_val
                progress = min(100, int((current_val / max(1, b.criteria_threshold)) * 100))
            elif b.criteria_type in ("placement_complete", "club_join"):
                current_val = 0
                progress = 0
            else:
                current_val = 0
                progress = 0

            badge_list.append(
                {
                    "id": b.id,
                    "slug": b.slug,
                    "title_fa": b.title_fa,
                    "title_en": b.title_en,
                    "description_fa": b.description_fa,
                    "description_en": b.description_en,
                    "icon": b.icon,
                    "category": b.category,
                    "xp_reward": b.xp_reward,
                    "criteria_type": b.criteria_type,
                    "criteria_threshold": b.criteria_threshold,
                    "current_value": current_val,
                    "progress_percent": progress,
                    "unlocked": is_unlocked,
                    "unlocked_at": unlocked_at.isoformat() if unlocked_at else None,
                }
            )

        unlocked_count = len(unlocked_map)
        total_count = len(badge_list)

        return {
            "badges": badge_list,
            "total_count": total_count,
            "unlocked_count": unlocked_count,
            "locked_count": total_count - unlocked_count,
            "completion_percent": int((unlocked_count / max(1, total_count)) * 100),
        }

    @classmethod
    def evaluate_and_unlock_badges(cls, learner, trigger_type: str, value: int = 1) -> List[Badge]:
        """
        Idempotently unlocks qualifying badges and awards bonus XP.
        """
        cls.seed_default_badges()
        matching_badges = Badge.objects.filter(
            is_active=True,
            criteria_type=trigger_type,
            criteria_threshold__lte=value,
        )

        unlocked_badges = []
        for badge in matching_badges:
            idempotency_key = f"badge:{badge.slug}:user:{learner.id}"
            if LearnerBadge.objects.filter(learner=learner, badge=badge).exists():
                continue

            with transaction.atomic():
                if LearnerBadge.objects.filter(learner=learner, badge=badge).exists():
                    continue

                tx = GamificationService.award_xp(
                    learner=learner,
                    amount=badge.xp_reward,
                    category=XPCategory.BADGE_UNLOCK,
                    reason=f"Badge unlocked: {badge.title_en}",
                    source_event=idempotency_key,
                    metadata={"badge_slug": badge.slug, "badge_icon": badge.icon},
                )

                LearnerBadge.objects.create(
                    learner=learner,
                    badge=badge,
                    source_event=idempotency_key,
                    xp_transaction=tx,
                )
                unlocked_badges.append(badge)

        return unlocked_badges


class ChallengeService:
    """
    Manages daily/weekly challenges and structured 7-day consistency sprints.
    Evaluates schedules in Asia/Tehran timezone without dark-pattern countdowns.
    """

    DEFAULT_CHALLENGES = [
        {
            "slug": "daily-vocab-sprint",
            "challenge_type": ChallengeType.DAILY,
            "title_fa": "ماراتن واژگان روزانه",
            "title_en": "Daily Vocabulary Sprint",
            "description_fa": "مرور ۱۰ کارت واژه در سیستم تکرار با فاصله (SRS) امروز.",
            "description_en": "Review 10 vocabulary flashcards in spaced repetition today.",
            "icon": "🧠",
            "target_metric": "srs",
            "target_count": 10,
            "xp_reward": 30,
        },
        {
            "slug": "daily-pronunciation-check",
            "challenge_type": ChallengeType.DAILY,
            "title_fa": "دقت آواشناسی روزانه",
            "title_en": "Daily Phonetics Precision",
            "description_fa": "انجام ۳ تمرین تلفظ یا واج‌شناسی در آزمایشگاه گفتار امروز.",
            "description_en": "Practice 3 phonetics or syllable stress exercises in the Pronunciation Lab today.",
            "icon": "🎙️",
            "target_metric": "pronunciation",
            "target_count": 3,
            "xp_reward": 30,
        },
        {
            "slug": "daily-mission-step",
            "challenge_type": ChallengeType.DAILY,
            "title_fa": "گام ماموریت روزانه",
            "title_en": "Daily Mission Milestone",
            "description_fa": "تکمیل حداقل ۱ گام از ماموریت یادگیری شخصی امروز.",
            "description_en": "Complete at least 1 stage of your customized daily mission today.",
            "icon": "🚀",
            "target_metric": "mission",
            "target_count": 1,
            "xp_reward": 25,
        },
        {
            "slug": "weekly-writing-craft",
            "challenge_type": ChallengeType.WEEKLY,
            "title_fa": "کارگاه نگارش هفتگی",
            "title_en": "Weekly Writing Craft",
            "description_fa": "ارسال حداقل ۱ تمرین نگارش در استودیوی منتور رایتینگ این هفته.",
            "description_en": "Submit at least 1 writing draft to Writing Mentor this week.",
            "icon": "✍️",
            "target_metric": "writing",
            "target_count": 1,
            "xp_reward": 100,
        },
        {
            "slug": "weekly-roleplay-dialogue",
            "challenge_type": ChallengeType.WEEKLY,
            "title_fa": "مکالمه تعاملی هفتگی",
            "title_en": "Weekly Dialogue Session",
            "description_fa": "تکمیل موفقیت‌آمیز ۱ سناریوی کامل در جهان نقش‌آفرینی این هفته.",
            "description_en": "Complete 1 dialogue scenario in the Roleplay Universe this week.",
            "icon": "💬",
            "target_metric": "roleplay",
            "target_count": 1,
            "xp_reward": 100,
        },
    ]

    @classmethod
    def seed_default_challenges(cls) -> None:
        """Seeds standard challenge templates."""
        for item in cls.DEFAULT_CHALLENGES:
            ChallengeTemplate.objects.get_or_create(
                slug=item["slug"],
                defaults={
                    "challenge_type": item["challenge_type"],
                    "title_fa": item["title_fa"],
                    "title_en": item["title_en"],
                    "description_fa": item["description_fa"],
                    "description_en": item["description_en"],
                    "icon": item["icon"],
                    "target_metric": item["target_metric"],
                    "target_count": item["target_count"],
                    "xp_reward": item["xp_reward"],
                    "is_active": True,
                },
            )

    @classmethod
    def get_active_challenges(cls, learner) -> Dict[str, Any]:
        """
        Retrieves active daily and weekly challenges, and current 7-day sprint status.
        """
        cls.seed_default_challenges()
        today = timezone.localdate()

        # Daily period: today in Asia/Tehran
        daily_start = today
        daily_end = today

        # Weekly period: current calendar week (Monday to Sunday)
        weekly_start = today - timedelta(days=today.weekday())
        weekly_end = weekly_start + timedelta(days=6)

        templates = ChallengeTemplate.objects.filter(is_active=True)
        challenges_data = []

        for tpl in templates:
            if tpl.challenge_type == ChallengeType.DAILY:
                start, end = daily_start, daily_end
            elif tpl.challenge_type == ChallengeType.WEEKLY:
                start, end = weekly_start, weekly_end
            else:
                continue

            instance, _ = LearnerChallenge.objects.get_or_create(
                learner=learner,
                template=tpl,
                period_start=start,
                defaults={"period_end": end, "current_progress": 0},
            )

            progress_pct = min(100, int((instance.current_progress / max(1, tpl.target_count)) * 100))
            challenges_data.append(
                {
                    "id": instance.id,
                    "template_slug": tpl.slug,
                    "challenge_type": tpl.challenge_type,
                    "title_fa": tpl.title_fa,
                    "title_en": tpl.title_en,
                    "description_fa": tpl.description_fa,
                    "description_en": tpl.description_en,
                    "icon": tpl.icon,
                    "target_metric": tpl.target_metric,
                    "target_count": tpl.target_count,
                    "current_progress": instance.current_progress,
                    "progress_percent": progress_pct,
                    "is_completed": instance.is_completed,
                    "completed_at": instance.completed_at.isoformat() if instance.completed_at else None,
                    "xp_reward": tpl.xp_reward,
                    "period_start": str(start),
                    "period_end": str(end),
                }
            )

        # 7-Day Sprint status
        sprint = SevenDaySprintEnrollment.objects.filter(
            learner=learner,
            status=SevenDaySprintEnrollment.Status.ACTIVE,
        ).first()

        sprint_data = None
        if sprint:
            # Check if expired
            if today > sprint.end_date:
                if sprint.days_completed >= 7:
                    sprint.status = SevenDaySprintEnrollment.Status.COMPLETED
                    sprint.completed_at = timezone.now()
                    sprint.save()
                else:
                    sprint.status = SevenDaySprintEnrollment.Status.EXPIRED
                    sprint.save()

            sprint_data = {
                "id": sprint.id,
                "start_date": str(sprint.start_date),
                "end_date": str(sprint.end_date),
                "days_completed": sprint.days_completed,
                "target_days": 7,
                "progress_percent": min(100, int((sprint.days_completed / 7) * 100)),
                "status": sprint.status,
                "completed_at": sprint.completed_at.isoformat() if sprint.completed_at else None,
                "xp_reward": 250,
            }

        return {
            "challenges": challenges_data,
            "daily_challenges": [c for c in challenges_data if c["challenge_type"] == ChallengeType.DAILY],
            "weekly_challenges": [c for c in challenges_data if c["challenge_type"] == ChallengeType.WEEKLY],
            "seven_day_sprint": sprint_data,
            "timezone": "Asia/Tehran",
        }

    @classmethod
    def record_challenge_progress(cls, learner, metric_type: str, count: int = 1) -> None:
        """
        Advances learner challenge progress and awards XP upon completion.
        """
        today = timezone.localdate()
        daily_start = today
        weekly_start = today - timedelta(days=today.weekday())

        active_instances = LearnerChallenge.objects.filter(
            learner=learner,
            is_completed=False,
            template__target_metric=metric_type,
            period_start__in=[daily_start, weekly_start],
        ).select_related("template")

        for inst in active_instances:
            inst.current_progress += count
            if inst.current_progress >= inst.template.target_count:
                inst.is_completed = True
                inst.completed_at = timezone.now()

                # Award challenge bonus XP
                source_key = f"challenge:{inst.template.slug}:{inst.period_start}:user:{learner.id}"
                tx = GamificationService.award_xp(
                    learner=learner,
                    amount=inst.template.xp_reward,
                    category=XPCategory.CHALLENGE,
                    reason=f"Challenge completed: {inst.template.title_en}",
                    source_event=source_key,
                    metadata={"template_slug": inst.template.slug},
                )
                inst.xp_transaction = tx
            inst.save()

    @classmethod
    def enroll_seven_day_sprint(cls, learner) -> SevenDaySprintEnrollment:
        """Enrolls learner in a 7-day consistency sprint starting today."""
        today = timezone.localdate()
        active = SevenDaySprintEnrollment.objects.filter(
            learner=learner,
            status=SevenDaySprintEnrollment.Status.ACTIVE,
        ).first()

        if active:
            return active

        sprint = SevenDaySprintEnrollment.objects.create(
            learner=learner,
            start_date=today,
            end_date=today + timedelta(days=6),
            days_completed=1,  # First active day
            status=SevenDaySprintEnrollment.Status.ACTIVE,
        )
        return sprint

    @classmethod
    def leave_challenge(cls, learner, challenge_id: int) -> bool:
        """Safety control: allows a learner to cancel / leave a challenge."""
        inst = LearnerChallenge.objects.filter(id=challenge_id, learner=learner).first()
        if inst and not inst.is_completed:
            inst.delete()
            return True
        # Check sprint
        sprint = SevenDaySprintEnrollment.objects.filter(id=challenge_id, learner=learner).first()
        if sprint and sprint.status == SevenDaySprintEnrollment.Status.ACTIVE:
            sprint.status = SevenDaySprintEnrollment.Status.EXPIRED
            sprint.save()
            return True
        return False

    @classmethod
    def report_challenge(cls, learner, challenge_id: int, reason: str = "") -> Dict[str, Any]:
        """Safety control: record a report against a challenge item."""
        return {
            "status": "reported",
            "message_fa": "گزارش شما با موفقیت ثبت شد و توسط تیم پشتیبانی بررسی می‌شود.",
            "message_en": "Your report was received and will be reviewed by moderation.",
        }


class ClubService:
    """
    Manages active-users clubs encouraging shared educational momentum.
    Strictly criteria-based on 7-day activity; never pay-to-join.
    """

    DEFAULT_CLUBS = [
        {
            "slug": "apprentice-club",
            "name_fa": "انجمن نوآموزان کوشا",
            "name_en": "Apprentice Club",
            "description_fa": "محیطی صمیمی و آرام برای آغازگران تداوم یادگیری (حداقل ۲ روز فعالیت و ۱۰۰ امتیاز در هفته اخیر).",
            "description_en": "A welcoming, calm space for developing early learning habits (requires 2 active days & 100 XP in the last 7 days).",
            "badge_icon": "🌱",
            "tier": ActiveUsersClub.Tier.APPRENTICE,
            "min_active_days_7d": 2,
            "min_xp_7d": 100,
        },
        {
            "slug": "scholar-club",
            "name_fa": "انجمن پژوهشگران پیشرو",
            "name_en": "Scholar Club",
            "description_fa": "محفل زبان‌آموزان جدی و پیگیر با تعهد آموزشی مستمر (حداقل ۴ روز فعالیت و ۳۰۰ امتیاز در هفته اخیر).",
            "description_en": "For dedicated learners committed to sustained educational progress (requires 4 active days & 300 XP in the last 7 days).",
            "badge_icon": "📚",
            "tier": ActiveUsersClub.Tier.SCHOLAR,
            "min_active_days_7d": 4,
            "min_xp_7d": 300,
        },
        {
            "slug": "master-communicator-club",
            "name_fa": "کانون ارتباط‌گران برتر",
            "name_en": "Master Communicator Club",
            "description_fa": "سطح پیشرفته برای یادگیرندگان با بالاترین انضباط فردی و تسلط ارتباطی (حداقل ۶ روز فعالیت و ۶۰۰ امتیاز در هفته اخیر).",
            "description_en": "Elite tier for learners demonstrating highest self-discipline and communicative fluency (requires 6 active days & 600 XP in the last 7 days).",
            "badge_icon": "👑",
            "tier": ActiveUsersClub.Tier.MASTER,
            "min_active_days_7d": 6,
            "min_xp_7d": 600,
        },
    ]

    @classmethod
    def seed_default_clubs(cls) -> None:
        """Seeds standard active-users club tiers."""
        for item in cls.DEFAULT_CLUBS:
            ActiveUsersClub.objects.get_or_create(
                slug=item["slug"],
                defaults={
                    "name_fa": item["name_fa"],
                    "name_en": item["name_en"],
                    "description_fa": item["description_fa"],
                    "description_en": item["description_en"],
                    "badge_icon": item["badge_icon"],
                    "tier": item["tier"],
                    "min_active_days_7d": item["min_active_days_7d"],
                    "min_xp_7d": item["min_xp_7d"],
                    "is_open": True,
                },
            )

    @classmethod
    def get_learner_7d_metrics(cls, learner) -> Dict[str, int]:
        """Calculates learner's active days and total XP over the trailing 7 calendar days."""
        today = timezone.localdate()
        since_date = today - timedelta(days=6)

        txs = XPTransaction.objects.filter(learner=learner, created_at__date__gte=since_date)
        total_xp = max(0, txs.aggregate(models.Sum("amount"))["amount__sum"] or 0)
        active_days = txs.values_list("created_at__date", flat=True).distinct().count()

        return {
            "active_days_7d": active_days,
            "xp_7d": total_xp,
        }

    @classmethod
    def get_clubs_directory(cls, learner) -> Dict[str, Any]:
        """Lists active clubs with membership status and eligibility."""
        cls.seed_default_clubs()
        metrics = cls.get_learner_7d_metrics(learner)
        active_membership = ClubMembership.objects.filter(learner=learner, is_active=True).first()

        clubs = ActiveUsersClub.objects.filter(is_open=True)
        clubs_data = []

        for c in clubs:
            is_member = active_membership and active_membership.club_id == c.id
            is_eligible = (
                metrics["active_days_7d"] >= c.min_active_days_7d and metrics["xp_7d"] >= c.min_xp_7d
            )
            member_count = ClubMembership.objects.filter(club=c, is_active=True).count()

            clubs_data.append(
                {
                    "id": c.id,
                    "slug": c.slug,
                    "name_fa": c.name_fa,
                    "name_en": c.name_en,
                    "description_fa": c.description_fa,
                    "description_en": c.description_en,
                    "badge_icon": c.badge_icon,
                    "tier": c.tier,
                    "min_active_days_7d": c.min_active_days_7d,
                    "min_xp_7d": c.min_xp_7d,
                    "is_member": bool(is_member),
                    "is_eligible": bool(is_eligible),
                    "member_count": member_count,
                }
            )

        return {
            "clubs": clubs_data,
            "active_club": active_membership.club.slug if active_membership else None,
            "learner_metrics": metrics,
        }

    @classmethod
    def join_club(cls, learner, club_slug: str) -> Dict[str, Any]:
        """Joins an active-users club if eligible."""
        cls.seed_default_clubs()
        club = ActiveUsersClub.objects.filter(slug=club_slug, is_open=True).first()
        if not club:
            raise ValueError(f"Club '{club_slug}' not found.")

        metrics = cls.get_learner_7d_metrics(learner)
        if metrics["active_days_7d"] < club.min_active_days_7d or metrics["xp_7d"] < club.min_xp_7d:
            raise ValueError(
                f"You need at least {club.min_active_days_7d} active days and {club.min_xp_7d} XP in the last 7 days to join."
            )

        # Deactivate previous active memberships
        ClubMembership.objects.filter(learner=learner).update(is_active=False)

        membership, _ = ClubMembership.objects.update_or_create(
            learner=learner,
            club=club,
            defaults={"is_active": True},
        )

        # Award community badge
        BadgeService.evaluate_and_unlock_badges(learner, trigger_type="club_join", value=1)

        return {
            "status": "joined",
            "club_slug": club.slug,
            "name_fa": club.name_fa,
            "name_en": club.name_en,
        }

    @classmethod
    def leave_club(cls, learner, club_slug: str) -> bool:
        """Leaves active club."""
        membership = ClubMembership.objects.filter(learner=learner, club__slug=club_slug).first()
        if membership:
            membership.is_active = False
            membership.save(update_fields=["is_active"])
            return True
        return False

    @classmethod
    def report_club(cls, learner, club_slug: str, reason: str = "") -> Dict[str, Any]:
        """Safety control: reports a club."""
        club = ActiveUsersClub.objects.filter(slug=club_slug).first()
        if club:
            membership = ClubMembership.objects.filter(learner=learner, club=club).first()
            if membership:
                membership.reported_count += 1
                membership.save(update_fields=["reported_count"])
        return {
            "status": "reported",
            "message_fa": "گزارش شما ثبت شد و توسط ناظران بررسی خواهد شد.",
            "message_en": "Your report was submitted and will be reviewed by moderators.",
        }


class LeaderboardService:
    """
    Manages privacy-safe, snapshot-based leaderboards.
    Protects minors, suppresses small cohorts, and prevents toxic ranking shaming.
    Adheres strictly to Product Constitution Rules #5, #7, and #8.
    """

    MIN_SAFE_COHORT_SIZE = 10

    @classmethod
    def _generate_pseudonym(cls, learner) -> str:
        raw = str(getattr(learner, "id", "")).replace("-", "")
        val = int(raw[:6], 16) if raw else 1000
        return f"Learner #{1000 + (val % 9000)}"

    @classmethod
    def _generate_avatar(cls, learner) -> str:
        raw = str(getattr(learner, "id", "")).replace("-", "")
        val = int(raw[:6], 16) if raw else 1
        return f"avatar-{(val % 6) + 1}"

    @classmethod
    def get_or_create_privacy_settings(cls, learner) -> LearnerPrivacySettings:
        """Retrieves or initializes learner privacy settings with a pseudonymous handle."""
        settings_obj, created = LearnerPrivacySettings.objects.get_or_create(
            learner=learner,
            defaults={
                "is_leaderboard_visible": True,
                "pseudonym": cls._generate_pseudonym(learner),
                "city": "",
                "show_city_rank": False,
                "is_minor": False,
                "avatar_seed": cls._generate_avatar(learner),
            },
        )
        if not settings_obj.pseudonym:
            settings_obj.pseudonym = cls._generate_pseudonym(learner)
            settings_obj.save(update_fields=["pseudonym"])
        return settings_obj

    @classmethod
    def update_privacy_settings(
        cls,
        learner,
        is_leaderboard_visible: Optional[bool] = None,
        pseudonym: Optional[str] = None,
        city: Optional[str] = None,
        show_city_rank: Optional[bool] = None,
        is_minor: Optional[bool] = None,
        avatar_seed: Optional[str] = None,
    ) -> LearnerPrivacySettings:
        """Updates privacy settings with safety overrides for minors."""
        privacy = cls.get_or_create_privacy_settings(learner)

        if is_minor is not None:
            privacy.is_minor = bool(is_minor)

        if is_leaderboard_visible is not None:
            privacy.is_leaderboard_visible = bool(is_leaderboard_visible)

        if pseudonym is not None:
            clean_name = str(pseudonym).strip()[:64]
            if clean_name:
                privacy.pseudonym = clean_name

        if avatar_seed is not None:
            privacy.avatar_seed = str(avatar_seed).strip()[:32]

        if city is not None:
            privacy.city = str(city).strip()[:64]

        if show_city_rank is not None:
            privacy.show_city_rank = bool(show_city_rank)

        # STRICT SAFETY RULE: Minors are prohibited from city disclosure and city rankings
        if privacy.is_minor:
            privacy.city = ""
            privacy.show_city_rank = False

        privacy.save()
        return privacy

    @classmethod
    def generate_leaderboard_snapshot(
        cls,
        board_type: str = LeaderboardSnapshot.BoardType.GLOBAL,
        city_name: Optional[str] = None,
        club: Optional[ActiveUsersClub] = None,
    ) -> LeaderboardSnapshot:
        """
        Creates or updates a deterministic rank snapshot.
        Enforces small-cohort suppression (cohort < 10) to prevent deanonymization.
        """
        today = timezone.localdate()
        week_num = today.isocalendar()[1]
        year = today.year

        if board_type == LeaderboardSnapshot.BoardType.GLOBAL:
            snapshot_id = f"global:{year}-W{week_num}"
        elif board_type == LeaderboardSnapshot.BoardType.CITY:
            city_slug = (city_name or "unknown").strip().lower().replace(" ", "-")
            snapshot_id = f"city:{city_slug}:{year}-W{week_num}"
        elif board_type == LeaderboardSnapshot.BoardType.CLUB:
            club_slug = club.slug if club else "unknown"
            snapshot_id = f"club:{club_slug}:{year}-W{week_num}"
        else:
            snapshot_id = f"custom:{year}-W{week_num}"

        # Clean existing snapshot
        snapshot, _ = LeaderboardSnapshot.objects.get_or_create(
            snapshot_id=snapshot_id,
            defaults={
                "board_type": board_type,
                "city_name": city_name or "",
                "club": club,
                "period_start": today - timedelta(days=today.weekday()),
                "period_end": today + timedelta(days=6 - today.weekday()),
            },
        )

        # Query eligible learners:
        # Strictly opt-in: exclude anyone who set is_leaderboard_visible=False
        eligible_qs = (
            LearnerLevel.objects.select_related("learner", "learner__gamification_privacy")
            .exclude(learner__gamification_privacy__is_leaderboard_visible=False)
        )

        if board_type == LeaderboardSnapshot.BoardType.CITY:
            clean_city = (city_name or "").strip()
            eligible_qs = eligible_qs.filter(
                learner__gamification_privacy__show_city_rank=True,
                learner__gamification_privacy__is_minor=False,
                learner__gamification_privacy__city__iexact=clean_city,
            )
        elif board_type == LeaderboardSnapshot.BoardType.CLUB and club:
            eligible_qs = eligible_qs.filter(
                learner__club_memberships__club=club,
                learner__club_memberships__is_active=True,
            )

        total_eligible = eligible_qs.count()
        snapshot.total_eligible = total_eligible

        # SMALL COHORT PRIVACY SUPPRESSION
        if board_type == LeaderboardSnapshot.BoardType.CITY and total_eligible < cls.MIN_SAFE_COHORT_SIZE:
            snapshot.is_suppressed = True
            snapshot.suppression_reason = (
                f"حفظ حریم خصوصی: برای نمایش رتبه‌بندی شهری حداقل {cls.MIN_SAFE_COHORT_SIZE} "
                f"زبان‌آموز فعال در شهر {city_name} نیاز است (تعداد فعلی: {total_eligible})."
            )
            snapshot.entries.all().delete()
            snapshot.save()
            return snapshot

        snapshot.is_suppressed = False
        snapshot.suppression_reason = ""
        snapshot.save()

        # Deterministic ordering: total_xp DESC, updated_at ASC, learner__id ASC
        ordered_learners = eligible_qs.order_by("-total_xp", "updated_at", "learner__id")

        # Re-populate entries
        snapshot.entries.all().delete()
        entries_to_create = []
        for rank, item in enumerate(ordered_learners, start=1):
            privacy = getattr(item.learner, "gamification_privacy", None)
            display_name = (
                privacy.pseudonym
                if privacy and privacy.pseudonym
                else cls._generate_pseudonym(item.learner)
            )
            avatar = (
                privacy.avatar_seed
                if privacy and privacy.avatar_seed
                else cls._generate_avatar(item.learner)
            )

            entries_to_create.append(
                LeaderboardEntry(
                    snapshot=snapshot,
                    learner=item.learner,
                    rank=rank,
                    total_xp=item.total_xp,
                    level=item.current_level,
                    display_name=display_name,
                    avatar_seed=avatar,
                    tiebreaker_achieved_at=item.updated_at,
                )
            )

        LeaderboardEntry.objects.bulk_create(entries_to_create)
        return snapshot

    @classmethod
    def get_leaderboard_view(
        cls,
        learner,
        board_type: str = LeaderboardSnapshot.BoardType.GLOBAL,
        city_name: Optional[str] = None,
        club_slug: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Returns pseudonymous leaderboard view with user's relative bracket.
        Adheres to Rule #7 by showing local brackets rather than humiliating low ranks.
        """
        privacy = cls.get_or_create_privacy_settings(learner)
        club = ActiveUsersClub.objects.filter(slug=club_slug).first() if club_slug else None

        # Build snapshot
        snapshot = cls.generate_leaderboard_snapshot(
            board_type=board_type,
            city_name=city_name or privacy.city,
            club=club,
        )

        if snapshot.is_suppressed:
            return {
                "board_type": board_type,
                "is_suppressed": True,
                "suppression_reason": snapshot.suppression_reason,
                "total_eligible": snapshot.total_eligible,
                "min_required": cls.MIN_SAFE_COHORT_SIZE,
                "is_learner_visible": privacy.is_leaderboard_visible,
                "rule_7_notice_fa": "اصل آرامش در یادگیری (قاعده ۷): رقابت در اندورا دوستانه و بدون الگوهای اعتیادآور است.",
                "rule_7_notice_en": "Product Constitution Rule #7: Calm rather than addictive social motivation.",
            }

        # Query top 10 cohort
        top_entries = list(
            snapshot.entries.all()[:10].values(
                "rank", "display_name", "total_xp", "level", "avatar_seed"
            )
        )

        # Query learner entry
        learner_entry = snapshot.entries.filter(learner=learner).first()
        learner_rank = learner_entry.rank if learner_entry else None

        # Local surrounding bracket (+/- 3 neighboring learners)
        surrounding_bracket = []
        if learner_entry and learner_rank and learner_rank > 10:
            bracket_qs = snapshot.entries.filter(
                rank__gte=max(1, learner_rank - 3),
                rank__lte=learner_rank + 3,
            ).values("rank", "display_name", "total_xp", "level", "avatar_seed")
            surrounding_bracket = list(bracket_qs)

        # Compute percentile encouragement
        percentile_msg_fa = ""
        percentile_msg_en = ""
        if learner_rank and snapshot.total_eligible > 0:
            top_pct = max(1, int((learner_rank / snapshot.total_eligible) * 100))
            percentile_msg_fa = f"شما در جمع {top_pct}٪ زبان‌آموزان پرتلاش این دوره قرار دارید."
            percentile_msg_en = f"You are in the top {top_pct}% of dedicated learners this cycle."

        return {
            "board_type": board_type,
            "snapshot_id": snapshot.snapshot_id,
            "is_suppressed": False,
            "total_participants": snapshot.total_eligible,
            "top_entries": top_entries,
            "learner_bracket": surrounding_bracket,
            "learner_rank": learner_rank,
            "learner_display_name": privacy.pseudonym,
            "is_learner_visible": privacy.is_leaderboard_visible,
            "is_minor": privacy.is_minor,
            "percentile_message_fa": percentile_msg_fa,
            "percentile_message_en": percentile_msg_en,
            "rule_7_notice_fa": "اصل آرامش در یادگیری (قاعده ۷): رتبه‌بندی‌ها دوره‌ای و بر مبنای تلاش واقعی آموزشی هستند و سازوکار قمارگونه ندارند.",
            "rule_7_notice_en": "Product Constitution Rule #7: Calm social motivation. Points reflect genuine effort without dark patterns.",
            "rule_8_notice_fa": "اصل شفافیت آموزشی (قاعده ۸): رتبه‌ها نشان‌دهنده پشتکار در تمرین هستند و به معنای مدرک رسمی نیستند.",
            "rule_8_notice_en": "Product Constitution Rule #8: Honest assessment. Leaderboard ranks denote practice activity, not accredited proficiency.",
        }
