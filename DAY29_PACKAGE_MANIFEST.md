# Day 29 Package Manifest

## Scope
Day 29: Badges, Daily/Weekly Challenges, Active Users Clubs & Privacy-Safe Leaderboards.

## Backend Assets
- `apps/api/gamification/models.py`: Added `Badge`, `LearnerBadge`, `ChallengeTemplate`, `LearnerChallenge`, `SevenDaySprintEnrollment`, `ActiveUsersClub`, `ClubMembership`, `LearnerPrivacySettings`, `LeaderboardSnapshot`, `LeaderboardEntry`. Added `CHALLENGE` and `BADGE_UNLOCK` to `XPCategory`.
- `apps/api/gamification/migrations/0002_activeusersclub_badge_challengetemplate_and_more.py`: Database schema migration.
- `apps/api/gamification/services.py`: Implemented `BadgeService`, `ChallengeService`, `ClubService`, and `LeaderboardService` (with cohort size threshold `MIN_SAFE_COHORT_SIZE = 10`, minor location masking, pseudonymization).
- `apps/api/gamification/serializers.py`: Serializers for privacy updates, club joining, challenge reporting, and snapshots.
- `apps/api/gamification/views.py`: API viewsets and actions for badges, challenges, clubs, leaderboards, and privacy settings.
- `apps/api/gamification/urls.py`: Routed endpoints under `/api/gamification/`.
- `apps/api/gamification/tests.py`: Unit and regression test suite covering all Day 29 features.

## Frontend Assets
- `apps/web/app/(learner)/achievements/page.tsx`: Interactive 5-tab Achievements & Recognition Hub.
- `apps/web/app/(learner)/achievements/achievements.module.css`: 100% tokenized CSS module, 0 raw hex colors, logical properties only.
- `apps/web/app/(learner)/badges/page.tsx`: Updated with cross-link navigation to `/achievements`.

## Documentation & Verification
- `docs/safety/leaderboard-policy.md`: Privacy and anti-doxxing policies.
- `scripts/backup_day29.ps1`: Automated pre-migration database backup script.
- `scripts/check_day29.py`: Contract and verification script for Day 29.
