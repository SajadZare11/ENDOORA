from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models


class XPCategory(models.TextChoices):
    MISSION = "mission", "Daily Mission Step"
    ROLEPLAY = "roleplay", "Roleplay Scenario Completion"
    SRS = "srs", "SRS Vocabulary Review"
    PRONUNCIATION = "pronunciation", "Pronunciation Lab Practice"
    WRITING = "writing", "Writing Mentor Submission"
    PLACEMENT = "placement", "Placement Diagnostic Section"
    STREAK_BONUS = "streak_bonus", "Streak Consistency Reward"
    CHALLENGE = "challenge", "Challenge Completion Reward"
    BADGE_UNLOCK = "badge_unlock", "Badge Achievement Reward"
    SYSTEM_ADJUSTMENT = "system_adjustment", "Compensatory Adjustment"


class XPTransaction(models.Model):
    """
    Immutable ledger entry for learner experience points (XP).
    Financial-grade ledger: strictly append-only, with unique idempotency keys
    (source_event) preventing duplicate awards or network replay attacks.
    """

    learner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="xp_transactions",
    )
    amount = models.IntegerField(help_text="Points awarded (positive) or reversal (negative)")
    category = models.CharField(
        max_length=64,
        choices=XPCategory.choices,
        default=XPCategory.MISSION,
    )
    reason = models.CharField(max_length=255)
    source_event = models.CharField(
        max_length=255,
        unique=True,
        db_index=True,
        help_text="Unique event idempotency key e.g. mission:2026-09-05:step:2:user:1",
    )
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "XP Transaction"
        verbose_name_plural = "XP Transactions"

    def __str__(self):
        sign = "+" if self.amount >= 0 else ""
        return f"{sign}{self.amount} XP [{self.category}] for {self.learner_id} ({self.source_event})"

    def save(self, *args, **kwargs):
        if self.pk:
            raise ValidationError("XP transactions are immutable financial records and cannot be updated.")
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        raise ValidationError("XP transactions cannot be deleted; compensatory adjustments must be used.")

    @property
    def learner_id(self) -> int:
        return self.learner_id or self.learner.id


class LearnerStreak(models.Model):
    """
    Tracks daily learning consistency and streak records calculated in Asia/Tehran timezone.
    Includes freeze credit grace periods to support calm learning (Product Constitution Rule #7).
    """

    learner = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="streak_record",
    )
    current_streak = models.PositiveIntegerField(default=0)
    longest_streak = models.PositiveIntegerField(default=0)
    last_activity_date = models.DateField(null=True, blank=True)
    freeze_credits = models.PositiveIntegerField(
        default=1,
        help_text="Grace freeze protections available to protect against accidental streak breakage",
    )
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Learner Streak"
        verbose_name_plural = "Learner Streaks"

    def __str__(self):
        return f"Streak: {self.current_streak} days (Longest: {self.longest_streak}) for Learner {self.learner_id}"


class LearnerLevel(models.Model):
    """
    Cached learner progression level and total cumulative XP.
    Complies with Product Constitution Rule #8: levels indicate educational dedication,
    not official accredited CEFR certification.
    """

    learner = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="level_record",
    )
    current_level = models.PositiveIntegerField(default=1)
    total_xp = models.PositiveIntegerField(default=0)
    level_title_fa = models.CharField(max_length=128, default="کاوشگر نوآموز")
    level_title_en = models.CharField(max_length=128, default="Novice Explorer")
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Learner Level"
        verbose_name_plural = "Learner Levels"

    def __str__(self):
        return f"Level {self.current_level} ({self.level_title_en}) - {self.total_xp} XP"


# ==========================================
# DAY 29: BADGES, CHALLENGES & LEADERBOARDS
# ==========================================


class BadgeCategory(models.TextChoices):
    FIRSTS = "firsts", "Meaningful Firsts"
    CONSISTENCY = "consistency", "Consistency & Habits"
    SKILLS = "skills", "Skill Mastery"
    COMMUNITY = "community", "Community & Clubs"


class Badge(models.Model):
    """
    Pedagogical achievement badge recognizing genuine learning milestones.
    Prevents cosmetic/exploitative badge farming by tying directly to server-verified events.
    """

    slug = models.SlugField(max_length=64, unique=True, db_index=True)
    title_fa = models.CharField(max_length=128)
    title_en = models.CharField(max_length=128)
    description_fa = models.TextField()
    description_en = models.TextField()
    icon = models.CharField(max_length=32, default="🏅")
    category = models.CharField(
        max_length=32,
        choices=BadgeCategory.choices,
        default=BadgeCategory.FIRSTS,
    )
    xp_reward = models.PositiveIntegerField(default=100)
    criteria_type = models.CharField(
        max_length=64,
        help_text="Metric type e.g. placement_complete, streak_days, srs_cards, writing_submit, roleplay_complete, seven_day_sprint",
    )
    criteria_threshold = models.PositiveIntegerField(default=1)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["category", "criteria_threshold", "slug"]
        verbose_name = "Badge"
        verbose_name_plural = "Badges"

    def __str__(self):
        return f"{self.icon} {self.title_en} ({self.slug})"


class LearnerBadge(models.Model):
    """
    Unlocked learner badge record with unique source_event idempotency key.
    """

    learner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="unlocked_badges",
    )
    badge = models.ForeignKey(
        Badge,
        on_delete=models.CASCADE,
        related_name="awarded_learners",
    )
    unlocked_at = models.DateTimeField(auto_now_add=True)
    source_event = models.CharField(
        max_length=255,
        unique=True,
        db_index=True,
        help_text="Unique event idempotency key e.g. badge:streak-3:user:1",
    )
    xp_transaction = models.ForeignKey(
        XPTransaction,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="badge_award",
    )

    class Meta:
        ordering = ["-unlocked_at"]
        unique_together = [("learner", "badge")]
        verbose_name = "Learner Badge"
        verbose_name_plural = "Learner Badges"

    def __str__(self):
        return f"{self.learner_id} unlocked {self.badge.slug} at {self.unlocked_at}"


class ChallengeType(models.TextChoices):
    DAILY = "daily", "Daily Challenge"
    WEEKLY = "weekly", "Weekly Challenge"
    SEVEN_DAY_SPRINT = "seven_day_sprint", "7-Day Consistency Sprint"


class ChallengeTemplate(models.Model):
    """
    Template for recurring daily/weekly challenges and structured sprints.
    All scheduling evaluated in Asia/Tehran local calendar days.
    """

    slug = models.SlugField(max_length=64, unique=True, db_index=True)
    challenge_type = models.CharField(
        max_length=32,
        choices=ChallengeType.choices,
        default=ChallengeType.DAILY,
    )
    title_fa = models.CharField(max_length=128)
    title_en = models.CharField(max_length=128)
    description_fa = models.TextField()
    description_en = models.TextField()
    icon = models.CharField(max_length=32, default="🎯")
    target_metric = models.CharField(
        max_length=64,
        help_text="Target metric e.g. srs_reviews, pronunciation_exercises, roleplay_complete, writing_submit, active_days, consecutive_days",
    )
    target_count = models.PositiveIntegerField(default=1)
    xp_reward = models.PositiveIntegerField(default=50)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["challenge_type", "target_count", "slug"]
        verbose_name = "Challenge Template"
        verbose_name_plural = "Challenge Templates"

    def __str__(self):
        return f"[{self.challenge_type}] {self.title_en} ({self.slug})"


class LearnerChallenge(models.Model):
    """
    Learner's individual instance and progress for a given challenge cycle.
    """

    learner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="learner_challenges",
    )
    template = models.ForeignKey(
        ChallengeTemplate,
        on_delete=models.CASCADE,
        related_name="learner_instances",
    )
    period_start = models.DateField(help_text="Period start in Asia/Tehran")
    period_end = models.DateField(help_text="Period end in Asia/Tehran")
    current_progress = models.PositiveIntegerField(default=0)
    is_completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    xp_transaction = models.ForeignKey(
        XPTransaction,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="challenge_award",
    )

    class Meta:
        unique_together = [("learner", "template", "period_start")]
        ordering = ["-period_start"]
        verbose_name = "Learner Challenge"
        verbose_name_plural = "Learner Challenges"

    def __str__(self):
        status = "Completed" if self.is_completed else f"{self.current_progress}/{self.template.target_count}"
        return f"{self.learner_id} - {self.template.slug} [{self.period_start}] ({status})"


class SevenDaySprintEnrollment(models.Model):
    """
    Explicit 7-day challenge enrollment managing daily consistency checklist,
    milestone bonuses, and safe completion rewards.
    """

    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        COMPLETED = "completed", "Completed"
        EXPIRED = "expired", "Expired"

    learner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="sprint_enrollments",
    )
    start_date = models.DateField(help_text="Sprint start date in Asia/Tehran")
    end_date = models.DateField(help_text="Sprint end date in Asia/Tehran")
    days_completed = models.PositiveIntegerField(default=0)
    status = models.CharField(
        max_length=32,
        choices=Status.choices,
        default=Status.ACTIVE,
    )
    completed_at = models.DateTimeField(null=True, blank=True)
    reward_tx = models.ForeignKey(
        XPTransaction,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="sprint_award",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "7-Day Sprint Enrollment"
        verbose_name_plural = "7-Day Sprint Enrollments"

    def __str__(self):
        return f"Sprint {self.learner_id}: {self.days_completed}/7 days [{self.status}]"


class ActiveUsersClub(models.Model):
    """
    Active-users club tier encouraging consistent participation without elitism.
    Admission is strictly based on transparent educational activity in the last 7 days.
    """

    class Tier(models.TextChoices):
        APPRENTICE = "apprentice", "Apprentice Club"
        SCHOLAR = "scholar", "Scholar Club"
        MASTER = "master", "Master Communicator Club"

    slug = models.SlugField(max_length=64, unique=True, db_index=True)
    name_fa = models.CharField(max_length=128)
    name_en = models.CharField(max_length=128)
    description_fa = models.TextField()
    description_en = models.TextField()
    badge_icon = models.CharField(max_length=32, default="🌟")
    tier = models.CharField(
        max_length=32,
        choices=Tier.choices,
        default=Tier.APPRENTICE,
    )
    min_active_days_7d = models.PositiveIntegerField(default=2)
    min_xp_7d = models.PositiveIntegerField(default=100)
    is_open = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["min_active_days_7d", "min_xp_7d"]
        verbose_name = "Active Users Club"
        verbose_name_plural = "Active Users Clubs"

    def __str__(self):
        return f"{self.badge_icon} {self.name_en} ({self.tier})"


class ClubMembership(models.Model):
    """
    User membership in an active-users club with leave and report safety controls.
    """

    learner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="club_memberships",
    )
    club = models.ForeignKey(
        ActiveUsersClub,
        on_delete=models.CASCADE,
        related_name="members",
    )
    joined_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    reported_count = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = [("learner", "club")]
        ordering = ["-joined_at"]
        verbose_name = "Club Membership"
        verbose_name_plural = "Club Memberships"

    def __str__(self):
        return f"{self.learner_id} in {self.club.slug} (active={self.is_active})"


class LearnerPrivacySettings(models.Model):
    """
    Privacy & opt-in controls governing leaderboards and social visibility.
    Strictly prevents deanonymization and minors' location disclosure (Product Constitution Rule #5).
    """

    learner = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="gamification_privacy",
    )
    is_leaderboard_visible = models.BooleanField(
        default=True,
        help_text="Opt-in visibility toggle. If False, learner never appears on any public/cohort leaderboard.",
    )
    pseudonym = models.CharField(
        max_length=64,
        blank=True,
        help_text="Pseudonym handle e.g. 'Learner #4821' or 'PhoenixScholar'. Real name never exposed.",
    )
    city = models.CharField(
        max_length=64,
        blank=True,
        help_text="City location for optional city-level cohort comparison.",
    )
    show_city_rank = models.BooleanField(
        default=False,
        help_text="Consent to appear on city-level cohort leaderboard when cohort is safely large.",
    )
    is_minor = models.BooleanField(
        default=False,
        help_text="Under-18 safeguard: strictly suppresses city location and forbids city leaderboard presence.",
    )
    avatar_seed = models.CharField(max_length=32, default="avatar-1")
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Learner Privacy Settings"
        verbose_name_plural = "Learner Privacy Settings"

    def __str__(self):
        return f"Privacy for {self.learner_id} (visible={self.is_leaderboard_visible}, minor={self.is_minor})"


class LeaderboardSnapshot(models.Model):
    """
    Precomputed rank snapshot preventing heavy real-time database queries on page loads.
    Enforces small-cohort privacy suppression (cohort size < 10) to prevent deanonymization.
    """

    class BoardType(models.TextChoices):
        GLOBAL = "global", "Global Cohort"
        CITY = "city", "City Cohort"
        CLUB = "club", "Club Cohort"

    snapshot_id = models.CharField(max_length=64, unique=True, db_index=True)
    board_type = models.CharField(
        max_length=32,
        choices=BoardType.choices,
        default=BoardType.GLOBAL,
    )
    city_name = models.CharField(max_length=64, null=True, blank=True)
    club = models.ForeignKey(
        ActiveUsersClub,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="snapshots",
    )
    period_start = models.DateField()
    period_end = models.DateField()
    is_suppressed = models.BooleanField(
        default=False,
        help_text="True if cohort size is below minimum safe threshold (10 learners) to protect privacy.",
    )
    suppression_reason = models.CharField(max_length=255, blank=True)
    total_eligible = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Leaderboard Snapshot"
        verbose_name_plural = "Leaderboard Snapshots"

    def __str__(self):
        return f"Snapshot {self.snapshot_id} [{self.board_type}] ({self.total_eligible} users, suppressed={self.is_suppressed})"


class LeaderboardEntry(models.Model):
    """
    Individual pseudonymous entry in a snapshot.
    Ties broken deterministically by (total_xp DESC, tiebreaker_achieved_at ASC, learner_id ASC).
    """

    snapshot = models.ForeignKey(
        LeaderboardSnapshot,
        on_delete=models.CASCADE,
        related_name="entries",
    )
    learner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="leaderboard_entries",
    )
    rank = models.PositiveIntegerField()
    total_xp = models.PositiveIntegerField()
    level = models.PositiveIntegerField(default=1)
    display_name = models.CharField(
        max_length=64,
        help_text="Pseudonym display name only; never real name or phone",
    )
    avatar_seed = models.CharField(max_length=32, default="avatar-1")
    tiebreaker_achieved_at = models.DateTimeField()

    class Meta:
        ordering = ["rank"]
        unique_together = [("snapshot", "learner")]
        verbose_name = "Leaderboard Entry"
        verbose_name_plural = "Leaderboard Entries"

    def __str__(self):
        return f"#{self.rank} {self.display_name} ({self.total_xp} XP) in {self.snapshot_id}"
