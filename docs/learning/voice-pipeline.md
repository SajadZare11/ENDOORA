# Voice Pipeline & Oral Fluency Learning Architecture

## Overview
Voice Lab v1 and Voice Roleplay Beta (Day 26) establish the acoustic and spoken dialogue layer of Endoora. The pipeline enables learners to build real-world spoken fluency in situational contexts without fear of interruption.

## Core Pillars
1. **Low-Latency Conversational Pacing**: Spoken turns are recorded client-side with immediate waveform feedback and submitted via signed upload tickets.
2. **Learner Agency in Speech Recognition**: Learners can review and correct automated transcripts prior to submission, preventing STT misinterpretations from breaking the immersion.
3. **Inclusive Non-Blocking Fallback**: Learner progression is never blocked if microphone permissions are denied or unsupported; seamless text fallback is provided.
4. **Pedagogical Voice Synthesis**: AI personas speak with selectable accents (US/UK) and speeds (0.8x, 1.0x, 1.2x) to scaffold auditory comprehension for different proficiency levels.
5. **Biometric Privacy by Design**: Learners retain control over their recorded audio retention, with options for immediate purge or 7/30-day review before automated deletion.

For technical architecture and API documentation, refer to [`docs/ai/voice-pipeline.md`](../ai/voice-pipeline.md).
