# Data Protection, GDPR/Persian Privacy Compliance & Automated Data Purging Handbook (SEC-002)

## Executive Summary

Day 52 institutes enterprise-grade data protection, comprehensive compliance with the European Union General Data Protection Regulation (GDPR Articles 15, 17, 20) and the Iranian Personal Data Protection & Privacy Framework (قانون صیانت و حفاظت از داده‌های شخصی), along with an automated data retention and cascade account erasure engine.

---

## 1. Statutory Data Subject Rights

### 1.1 Right of Access & Data Portability (GDPR Art. 15 & 20)
- Any authenticated user can trigger a full export of their personal data (`POST /api/privacy/export/`).
- The export service (`apps/api/data_protection/services/export_service.py`) aggregates:
  - Account identification and verified attributes.
  - Active and historical privacy preferences & consent records (`ConsentRecord`).
  - Learner & teacher profile metadata.
  - Educational progress: CEFR placement level, active daily missions, SRS flashcard retention statistics, Writing Mentor submissions, and Mistake Genome entries.
  - Financial ledger summaries (commission and payouts).
- Formatted as a standardized, machine-readable JSON archive (`format: "endoora_user_data_archive"`, `schema_version: "1.0.0"`).
- Cryptographic integrity verification via SHA-256 checksum (`integrity_checksum_sha256`).
- Export bundles expire and are automatically purged after 48 hours.

### 1.2 Right to Erasure / "Right to be Forgotten" (GDPR Art. 17)
- Scheduled account deletion requests enter a mandatory **7-day grace period** during which the user can cancel at will (`/account/data-controls`).
- Once the grace period elapses (`scheduled_for <= timezone.now()`), the cascade erasure engine (`execute_account_erasure`) irreversibly anonymizes personal identity:
  1. **User Identity Scrambling**:
     - Email scrambled to `deleted_<hash>@deleted.endoora.ir`.
     - Phone numbers and verification timestamps nullified.
     - First and last names cleared.
     - Password set to unusable (`set_unusable_password`).
     - Account permanently deactivated (`is_active = False`, `deactivated_at = timezone.now()`).
  2. **Profile Anonymization**: Bio, notes, and personal preferences scrubbed from `LearnerProfile` and `TeacherProfile`.
  3. **Biometric & Voice Scrubbing**: Audio binaries in `VoiceRecording` are purged; status transitioned to `purged`.
  4. **Credential & OTP Invalidation**: Pending one-time codes (`OneTimeCode`) are purged.
  5. **Statutory Ledger Preservation**: Double-entry financial records (`TeacherPayableLedgerEntry`) and legal audit events (`AuditEvent`) are preserved for the mandatory 7-year statutory tax/accounting window, with foreign keys pointing to the pseudonymized user record.

---

## 2. Granular Privacy Consents (`PrivacyConsentPreference`)

Users possess granular control over non-essential data processing via `/account/data-controls` and `api/privacy/preferences/`:
- **Functional Storage (عملکردی)**: Essential cookies and session management (Always Active / Non-negotiable).
- **Analytics Processing (تحلیلی)**: Pedagogical telemetry and learning progress analytics (Opt-in toggle, default ON).
- **AI Model Telemetry (بهینه‌سازی هوش مصنوعی)**: LLM/STT error tuning and prompt refinement (Opt-in toggle, default ON).
- **Marketing Communications (ارتباطات و اطلاع‌رسانی)**: Platform updates and educational newsletters (Opt-in toggle, default OFF).

Updates record client IP, user agent, timestamp, and active policy version tag.

---

## 3. Automated Data Retention Purging (`DataPurgeLog`)

The platform enforces strict time-based storage limitations:

| Data Domain | Retention Period | Expiry Action | Trigger |
|---|---|---|---|
| **Voice Recordings** | 7–30 Days (or Immediate) | Raw audio binaries purged | Nightly Cron / DPO Trigger |
| **Scheduled Account Deletions** | 7-Day Grace Window | Cascade irreversible erasure | Automated Retention Engine |
| **One-Time Passcodes (OTP)** | 30 Days (or 7d post-consumption) | Records deleted | Automated Retention Engine |
| **Data Export Archives** | 48 Hours | Archive files removed | Automated Retention Engine |
| **Financial & Audit Ledgers** | 7 Years Statutory | Preserved (anonymized) | Legal & Tax Requirement |

### Management Command
Administrators can run the retention sweep directly:
```bash
python manage.py purge_expired_data [--dry-run]
```

---

## 4. DPO Operations Console (`/operations/privacy`)

Located as the 9th workspace in the unified operations ribbon:
1. **Telemetry KPIs**: Live counts of pending deletions, completed data exports, total purge executions, and 100% compliance rating.
2. **Retention Policy Matrix**: Comprehensive inspection of data lifecycles across domains.
3. **Manual Purge Trigger**: On-demand execution with optional Dry Run simulation mode.
4. **Purge Execution Audit Trail**: Real-time log of prior automated and manual retention runs (`DataPurgeLog`).
5. **Statutory Rights Checklist**: Continuous verification against GDPR and Iranian personal data protection laws.
