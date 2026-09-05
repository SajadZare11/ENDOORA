# Endoora Voice Pipeline & Voice Roleplay Architecture (Day 26)

## 1. Executive Summary

Day 26 of the Endoora 60-Day Roadmap delivers **Voice Lab v1 & Voice Conversation Beta**. This milestone introduces an end-to-end oral fluency architecture that integrates browser-native audio capture, signed upload ticketing, real-time Speech-to-Text (STT), in-place transcript verification, Text-to-Speech (TTS) voice persona synthesis, and biometric privacy controls with automated audio purging.

All implementations strictly adhere to **Product Constitution Rule #8 (Educational Integrity & Formative Diagnostic Evidence)**.

---

## 2. Anticipated Mistakes & Architectural Mitigations

| Failure Mode / Mistake | Risk Level | Architectural Mitigation |
| :--- | :--- | :--- |
| **Proxying large audio blobs through frontend server** | High (memory spikes, gateway timeouts, I/O bottlenecks) | **Signed Upload Tickets**: Learners request a ticket (`/api/voice/upload-ticket/`) with hard limits: maximum **90 seconds** duration and **10 MB** file size. Audio streams directly to storage endpoints without blocking frontend nodes. |
| **Blocking learners on mic denial or unsupported browser** | High (learner abandonment, poor UX on restricted devices) | **Non-Blocking Graceful Fallback**: If `getUserMedia` is denied or browser lacks audio recording support, the interface provides seamless text fallback input without interrupting conversational progression. |
| **Inaccurate STT transcripts misleading AI models** | Medium (confusing roleplay responses, learner frustration) | **Learner Transcript Review & Edit**: Learners can review the recognized transcript, preview their audio, and manually correct any misrecognized words before submitting their turn. |
| **Biometric privacy violations & unbounded retention** | Critical (compliance risk, learner trust) | **User-Configured Retention**: Learners select retention duration (0 days / immediate purge, 7 days for review, or 30 days). Automated management command `python manage.py cleanup_expired_audio` purges expired audio files and clears recording paths. |
| **Monolithic or unresponsive TTS voices** | Medium (poor auditory comprehension for beginners) | **Configurable Accent & Speed**: User-selectable accents (`en-US`, `en-GB`) and speed multipliers (`0.8x`, `1.0x`, `1.2x`) synthesized via `/api/voice/tts/` and synced with user preferences. |

---

## 3. Data Model Architecture

Located in `apps/api/voice_lab/models.py`:

### 3.1 `VoiceRecording` (aliased as `AudioAttempt`)
- `id`: Auto-incrementing primary key.
- `user`: Foreign key to `auth.User` (nullable for anonymous guests).
- `scenario_id`: CharField(max_length=64), e.g. `"airport"`, `"hotel"`.
- `session_id`: CharField(max_length=64), linked to `RoleplaySession`.
- `audio_file`: FileField(upload_to="audio_recordings/%Y/%m/%d/", null=True).
- `mime_type`: CharField(max_length=64), default `"audio/webm"`.
- `file_size_bytes`: IntegerField(default=0).
- `duration_seconds`: FloatField(default=0.0).
- `raw_transcript`: TextField(blank=True).
- `corrected_transcript`: TextField(blank=True).
- `stt_confidence`: FloatField(default=0.0).
- `retention_days`: IntegerField(default=7).
- `expires_at`: DateTimeField(db_index=True).
- `is_purged`: BooleanField(default=False).
- `created_at`: DateTimeField(auto_now_add=True).

### 3.2 `VoicePreference`
- `user`: OneToOneField to `auth.User`.
- `preferred_accent`: CharField(max_length=16), choices `["en-US", "en-GB"]`.
- `preferred_speed`: FloatField(default=1.0), choices `[0.8, 1.0, 1.2]`.
- `retention_days`: IntegerField(default=7).
- `auto_play_tts`: BooleanField(default=True).
- `updated_at`: DateTimeField(auto_now=True).

---

## 4. API Endpoints

Routed at `/api/voice/` and mirrored at `/api/speech/`:

1. `POST /api/voice/upload-ticket/`:
   - Validates file size ($\le 10\text{ MB}$) and MIME type.
   - Creates a pending `VoiceRecording` record.
   - Returns `{ recording_id, upload_url, max_duration_sec: 90, max_file_size_bytes: 10485760 }`.

2. `POST /api/voice/recordings/<id>/upload/`:
   - Accepts multipart audio binary.
   - Stores audio file and triggers STT transcription service.
   - Returns `{ id, duration_seconds, raw_transcript, corrected_transcript, expires_at }`.

3. `PATCH /api/voice/recordings/<id>/transcript/`:
   - Allows learner to update `corrected_transcript`.
   - Returns updated recording metadata.

4. `POST /api/voice/tts/`:
   - Accepts `{ text, accent, speed }`.
   - Returns `{ text, accent, speed, audio_url, synthesized: true }`.

5. `GET / PUT /api/voice/preferences/`:
   - Reads and updates user voice preferences (`preferred_accent`, `preferred_speed`, `retention_days`).

6. `POST /api/voice/cleanup/`:
   - Triggers server-side retention cleanup for administrative / maintenance tasks.

---

## 5. Scheduled Purge Management Command

Command: `python manage.py cleanup_expired_audio`
- Queries all `VoiceRecording` records where `expires_at <= now()` and `is_purged=False`.
- Safely deletes underlying binary files from storage (`storage.delete(recording.audio_file.name)`).
- Sets `audio_file = None` and `is_purged = True`.
- Preserves anonymized diagnostic metadata (transcripts and duration) while respecting user biometric privacy.

---

## 6. Frontend Voice Architecture

- **`VoiceRecorder` component** (`apps/web/components/voice-recorder/VoiceRecorder.tsx`):
  - 24-bar live AudioContext frequency analyzer visualizer.
  - 90-second countdown timer.
  - Real-time client STT (Web Speech API) with graceful fallback.
  - Audio playback preview via native HTML5 `<audio>` element.
  - In-place transcript review and editing textarea.
  - Automatic non-blocking fallback input when mic is denied or unsupported.
- **Voice Roleplay Beta page** (`apps/web/app/(learner)/roleplay/voice/page.tsx`):
  - 10 full conversational scenarios across CEFR levels A2 to C1.
  - Top audio toolbar for live accent (`en-US`/`en-GB`), speed (`0.8x`/`1.0x`/`1.2x`), and retention policy adjustments.
  - Turn-by-turn dialogue stream with instant character TTS playback.
  - Integrated `VoiceRecorder` for oral turn submission.
  - Post-conversation diagnostic report view with communicative effectiveness score, goals achieved, and vocabulary extraction.
- **100% Tokenized CSS**: Strict zero raw-hex rule enforced across all CSS modules.
