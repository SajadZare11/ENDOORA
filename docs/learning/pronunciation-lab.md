# Pronunciation Lab & Speech Intelligibility Workbench (Day 27)

## Architectural Overview

The **Pronunciation Lab** (`/pronunciation`) provides Persian-speaking English learners with a formative acoustic feedback environment. It bridges theoretical phonology with practical speech habits through interactive target cards, live audio recording, real-time waveform inspection, and automated speech pacing analysis.

```
+-------------------------------------------------------------+
|                      Pronunciation Lab                      |
|                                                             |
|  +-------------------------------------------------------+  |
|  |       Product Constitution Rule #8 Disclaimer        |  |
|  |     (Intelligibility & Stress, Never Fake Accents)    |  |
|  +-------------------------------------------------------+  |
|                                                             |
|  +------------------+             +----------------------+  |
|  | Curated Persian  |             |  Acoustic Workbench  |  |
|  |   L1 Catalog     |  Select     |  - 24-Bar Visualizer |  |
|  | - Minimal Pairs  | ----------> |  - Speech Rate (WPM) |  |
|  | - Stress Shifts  |             |  - Hesitation Counts |  |
|  | - Clusters       |             |  - Stress Alignment  |  |
|  | - Connected Sp.  |             +----------+-----------+  |
|  +------------------+                        |              |
|                                     Save     v              |
|                             +----------------------------+  |
|                             |   Learner Mistake Genome   |  |
|                             |  (Category: pronunciation) |  |
|                             +----------------------------+  |
+-------------------------------------------------------------+
```

---

## Pedagogical Features

### 1. Dual Accent Reference Playback
- Toggle between American English (`en-US`) and British English (`en-GB`).
- Speed control (`0.85x` study mode vs `1.0x` natural conversational tempo).

### 2. Formative Intelligibility Metrics
- **Speech Rate (WPM)**: Instantaneous calculation of words spoken per minute.
- **Hesitation Tracking**: Counts disruptive intra-clause pauses.
- **Syllable Stress Match**: Evaluates emphasis placement against primary stress patterns.
- **Intelligibility Trend Score (0–100)**: Transparent, non-fabricated indicator of overall communicative clarity.

### 3. The Shadowing Studio
The lab guides learners through the three-phase **Shadowing Method**:
1. **Analytical Listening**: Auditory mapping of stressed syllables and vowel quality.
2. **Real-Time Echoing**: Speaking simultaneously with a ~200ms lag to mimic native articulatory muscle movements.
3. **Fluency Review**: Checking speech rhythm stability and eliminating epenthetic vowels.

### 4. Mistake Genome Bridging
When learners encounter persistent phonological stumbling blocks, they can click **"Track Challenge in Mistake Genome"**. This creates an entry in `LearnerMistakePattern` (`category="pronunciation"`), which will inform personalized spaced repetition missions and practice drills in upcoming study days.
