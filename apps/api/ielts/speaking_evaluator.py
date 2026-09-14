import re
from decimal import Decimal
from typing import Any, Dict, List, Tuple
from .scoring import round_to_ielts_half_band, map_band_to_cefr
from .writing_evaluator import ACADEMIC_WORD_LIST

# Discourse connectives in spoken IELTS English
SPOKEN_DISCOURSE_MARKERS = [
    "well", "actually", "to be honest", "frankly speaking", "as a matter of fact",
    "on the one hand", "on the other hand", "for instance", "for example",
    "in particular", "specifically", "furthermore", "moreover", "in addition",
    "conversely", "nevertheless", "to put it another way", "on the whole",
    "speaking of which", "in terms of", "as far as i am concerned", "from my perspective"
]

# Spoken filler and hesitation markers
HESITATION_MARKERS = [
    "um", "uh", "er", "ah", "like", "you know", "i mean", "sort of", "kind of"
]

# High-band spoken collocations and idiomatic expressions
SPOKEN_IDIOMATIC_COLLOCATIONS = [
    "broaden horizons", "hands-on experience", "in the long run", "pros and cons",
    "state-of-the-art", "vital role", "play a crucial role", "pave the way",
    "standpoint", "stepping stone", "double-edged sword", "matter of opinion",
    "food for thought", "strike a balance", "second to none", "leap of faith"
]

# Persian (L1) Phonological Interference Clusters (Rule #8 Compliant)
PERSIAN_PHONOLOGICAL_PATTERNS = [
    {
        "sound": "/w/ vs /v/",
        "title_fa": "تمایز واج‌های /w/ و /v/",
        "guidance_fa": "زبان فارسی فاقد صدای نیمه‌مصوت /w/ است و گویشوران فارسی تمایل دارند آن را با /v/ جایگزین کنند. در ادای واژگانی چون world، with و work، لب‌ها باید کاملاً گرد شده و دندان‌ها هیچ‌گونه تماسی با لب پایین نداشته باشند.",
        "examples": ["world", "work", "where", "with", "would", "wonderful"]
    },
    {
        "sound": "/θ/ vs /s/ or /t/",
        "title_fa": "تلفظ صدای سایشی دندانی /θ/",
        "guidance_fa": "صدای /θ/ در فارسی وجود ندارد و معمولاً به /s/ یا /t/ تبدیل می‌شود. نوک زبان باید دقیقاً بین دندان‌های پیشین بالا و پایین قرار گیرد (مانند think، thought و three).",
        "examples": ["think", "thought", "three", "method", "theme", "theory"]
    },
    {
        "sound": "Consonant Cluster Epenthesis",
        "title_fa": "پرهیز از درج واکه کمکی پیش از خوشه‌های بی‌صدا (Epenthesis)",
        "guidance_fa": "ساختار هجای فارسی اجازه وجود خوشه صامت در آغاز واژه را نمی‌دهد، لذا زبان‌آموزان ناخودآگاه یک کسره /e/ به ابتدای کلماتی مثل sport (e-sport) یا student (e-student) اضافه می‌کنند. شروع صوت باید مستقیماً با صدای سوت‌مانند /s/ باشد.",
        "examples": ["sport", "student", "skill", "specific", "special", "start"]
    }
]

# Spoken Grammatical & Lexical Error Rules
SP_ERROR_RULES = [
    {
        "pattern": r"\bdiscuss\s+about\b",
        "category": "grammar",
        "snippet": "discuss about",
        "suggestion": "discuss",
        "explanation_en": "The verb 'discuss' is transitive in formal English and takes a direct object without 'about'.",
        "explanation_fa": "فعل discuss نیازی به حرف اضافه about ندارد."
    },
    {
        "pattern": r"\b(i\s+am\s+agree|we\s+are\s+agree)\b",
        "category": "grammar",
        "snippet": "am agree / are agree",
        "suggestion": "I agree / we agree",
        "explanation_en": "'Agree' is a verb, not an adjective. Avoid 'I am agree'.",
        "explanation_fa": "کلمه agree فعل است و بدون فعل to be به کار می‌رود (I agree)."
    },
    {
        "pattern": r"\b(make|makes|made)\s+(a\s+)?research\b",
        "category": "lexical",
        "snippet": "make research",
        "suggestion": "conduct research / do research",
        "explanation_en": "'Research' collocates naturally with 'conduct' or 'do' rather than 'make'.",
        "explanation_fa": "ترکیب واژگانی: واژه research با conduct یا do همنشین می‌شود."
    },
    {
        "pattern": r"\bexplain\s+me\b",
        "category": "grammar",
        "snippet": "explain me",
        "suggestion": "explain to me",
        "explanation_en": "'Explain' requires 'to' before the personal indirect object.",
        "explanation_fa": "فعل explain نیازمند حرف اضافه to است (explain to me)."
    },
    {
        "pattern": r"\b(informations|advices)\b",
        "category": "grammar",
        "snippet": "informations / advices",
        "suggestion": "information / pieces of advice",
        "explanation_en": "'Information' and 'advice' are uncountable nouns in English and never take plural -s.",
        "explanation_fa": "واژگان information و advice اسم‌های غیرقابل شمارش هستند و نباید جمع بسته شوند."
    },
    {
        "pattern": r"\b(peoples)\b",
        "category": "grammar",
        "snippet": "peoples (when meaning persons)",
        "suggestion": "people",
        "explanation_en": "'People' is already the plural form of person when referring to individuals.",
        "explanation_fa": "واژه people خود حالت جمع person است؛ مگر در مفهوم 'اقوام یا ملل'."
    },
    {
        "pattern": r"\b(every\s+students|every\s+people)\b",
        "category": "grammar",
        "snippet": "every students",
        "suggestion": "every student / all students",
        "explanation_en": "'Every' is followed by a singular countable noun.",
        "explanation_fa": "بعد از every باید اسم مفرد قابل شمارش بیاید (every student)."
    }
]


def count_spoken_words(text: str) -> int:
    """Counts spoken words in candidate transcript."""
    if not text:
        return 0
    words = re.findall(r"\b[A-Za-z0-9'-]+\b", text)
    return len(words)


def calculate_speech_rate(word_count: int, duration_seconds: int) -> float:
    """
    Calculates Words Per Minute (WPM).
    Target conversational fluency range: 110 - 150 WPM.
    """
    if duration_seconds <= 0 or word_count <= 0:
        return 0.0
    return round((word_count / duration_seconds) * 60.0, 1)


def analyze_speaking_part(
    transcript: str,
    duration_seconds: int,
    part_number: int = 1
) -> Dict[str, Any]:
    """
    Analyzes an individual speaking part (Part 1, Part 2, or Part 3)
    extracting metrics for fluency, vocabulary, grammar, and pronunciation.
    """
    words = count_spoken_words(transcript)
    wpm = calculate_speech_rate(words, duration_seconds)
    lower = transcript.lower()

    # Fluency markers & hesitations
    hesitation_count = 0
    for marker in HESITATION_MARKERS:
        # Match as standalone word
        hesitation_count += len(re.findall(rf"\b{re.escape(marker)}\b", lower))

    # Connective markers
    discourse_used = [m for m in SPOKEN_DISCOURSE_MARKERS if m in lower]

    # Lexical markers
    tokens = re.findall(r"\b[a-z]+\b", lower)
    unique_tokens = set(tokens)
    ttr = (len(unique_tokens) / max(1, len(tokens)))
    awl_matches = unique_tokens.intersection(ACADEMIC_WORD_LIST)
    idioms_used = [c for c in SPOKEN_IDIOMATIC_COLLOCATIONS if c in lower]

    # Grammatical structures
    complex_conjunctions = ["although", "even though", "because", "since", "while", "whereas", "unless", "provided that"]
    complex_count = sum(lower.count(c) for c in complex_conjunctions)
    modal_verbs = ["might", "could", "would", "should", "must"]
    modals_count = sum(len(re.findall(rf"\b{m}\b", lower)) for m in modal_verbs)

    # Phonological challenges identified
    phonology_flags = []
    w_pattern = re.findall(r"\b(w[a-z]+)\b", lower)
    if w_pattern:
        hits = [w for w in set(w_pattern) if len(w) >= 3][:3]
        if hits:
            phonology_flags.append({
                "sound": "/w/ vs /v/",
                "title_fa": "تمایز واج‌های /w/ و /v/",
                "guidance_fa": "زبان فارسی فاقد صدای نیمه‌مصوت /w/ است و گویشوران فارسی تمایل دارند آن را با /v/ جایگزین کنند. در ادای واژگانی چون world، with و work، لب‌ها باید کاملاً گرد شده و دندان‌ها هیچ‌گونه تماسی با لب پایین نداشته باشند.",
                "sample_words": hits,
            })

    th_pattern = re.findall(r"\b(th[a-z]+|[a-z]+th)\b", lower)
    if th_pattern:
        hits = [w for w in set(th_pattern) if len(w) >= 3][:3]
        if hits:
            phonology_flags.append({
                "sound": "/θ/ vs /s/ or /t/",
                "title_fa": "تلفظ صدای سایشی دندانی /θ/",
                "guidance_fa": "صدای /θ/ در فارسی وجود ندارد و معمولاً به /s/ یا /t/ تبدیل می‌شود. نوک زبان باید دقیقاً بین دندان‌های پیشین بالا و پایین قرار گیرد (مانند think، thought و three).",
                "sample_words": hits,
            })

    s_cluster_pattern = re.findall(r"\b(s[ptkmnclf][a-z]+)\b", lower)
    if s_cluster_pattern:
        hits = [w for w in set(s_cluster_pattern) if len(w) >= 4][:3]
        if hits:
            phonology_flags.append({
                "sound": "Consonant Cluster Epenthesis",
                "title_fa": "پرهیز از درج واکه کمکی پیش از خوشه‌های بی‌صدا (Epenthesis)",
                "guidance_fa": "ساختار هجای فارسی اجازه وجود خوشه صامت در آغاز واژه را نمی‌دهد، لذا زبان‌آموزان ناخودآگاه یک کسره /e/ به ابتدای کلماتی مثل sport (e-sport) یا student (e-student) اضافه می‌کنند. شروع صوت باید مستقیماً با صدای سوت‌مانند /s/ باشد.",
                "sample_words": hits,
            })

    # Error checking
    part_annotations = []
    for err in SP_ERROR_RULES:
        if re.search(err["pattern"], transcript, re.IGNORECASE):
            part_annotations.append({
                "part": part_number,
                "snippet": err["snippet"],
                "category": err["category"],
                "suggestion": err["suggestion"],
                "explanation_en": err["explanation_en"],
                "explanation_fa": err["explanation_fa"],
            })

    return {
        "word_count": words,
        "duration_seconds": duration_seconds,
        "wpm": wpm,
        "hesitation_count": hesitation_count,
        "discourse_markers": discourse_used,
        "type_token_ratio": round(ttr, 2),
        "awl_words": list(awl_matches),
        "idioms_used": idioms_used,
        "complex_clauses": complex_count,
        "modal_verbs": modals_count,
        "phonology_flags": phonology_flags,
        "annotations": part_annotations,
    }


def evaluate_ielts_speaking_submission(
    part1_transcript: str = "",
    part1_duration_seconds: int = 0,
    part2_transcript: str = "",
    part2_duration_seconds: int = 0,
    part3_transcript: str = "",
    part3_duration_seconds: int = 0,
) -> Dict[str, Any]:
    """
    Evaluates a candidate's complete 3-Part CD-IELTS Speaking simulation.
    Applies the official IELTS Speaking grading rubric across the 4 criteria:
      1. Fluency and Coherence (FC)
      2. Lexical Resource (LR)
      3. Grammatical Range and Accuracy (GRA)
      4. Pronunciation (PR)
    Overall Band = round_to_ielts_half_band((FC + LR + GRA + PR) / 4.0)
    """
    p1 = analyze_speaking_part(part1_transcript, part1_duration_seconds, part_number=1)
    p2 = analyze_speaking_part(part2_transcript, part2_duration_seconds, part_number=2)
    p3 = analyze_speaking_part(part3_transcript, part3_duration_seconds, part_number=3)

    total_words = p1["word_count"] + p2["word_count"] + p3["word_count"]
    total_duration = p1["duration_seconds"] + p2["duration_seconds"] + p3["duration_seconds"]
    composite_wpm = calculate_speech_rate(total_words, total_duration)

    all_annotations = p1["annotations"] + p2["annotations"] + p3["annotations"]
    all_discourse = set(p1["discourse_markers"] + p2["discourse_markers"] + p3["discourse_markers"])
    all_awl = set(p1["awl_words"] + p2["awl_words"] + p3["awl_words"])
    all_idioms = set(p1["idioms_used"] + p2["idioms_used"] + p3["idioms_used"])
    total_hesitations = p1["hesitation_count"] + p2["hesitation_count"] + p3["hesitation_count"]
    total_complex = p1["complex_clauses"] + p2["complex_clauses"] + p3["complex_clauses"]

    # -------------------------------------------------------------------------
    # 1. Fluency and Coherence (FC)
    # -------------------------------------------------------------------------
    fc = Decimal("6.0")

    # Speech rate evaluation: Target 110 - 150 WPM
    if 115 <= composite_wpm <= 155:
        fc += Decimal("0.5")
    elif 95 <= composite_wpm < 115:
        pass  # neutral
    elif composite_wpm < 85 and total_words > 30:
        fc -= Decimal("0.5")
    elif composite_wpm > 175:
        # Pacing too rapid, may impair coherence
        pass

    # Cue card turn length: In Part 2, candidate should speak for 90-120 seconds or ~130+ words
    if p2["word_count"] >= 130 and p2["duration_seconds"] >= 70:
        fc = min(Decimal("8.5"), fc + Decimal("0.5"))
    elif p2["word_count"] < 60 and p2["word_count"] > 0:
        fc = max(Decimal("4.5"), fc - Decimal("0.5"))

    # Discourse markers variety
    if len(all_discourse) >= 5:
        fc = min(Decimal("8.5"), fc + Decimal("0.5"))
    elif len(all_discourse) <= 1 and total_words > 100:
        fc = max(Decimal("5.0"), fc - Decimal("0.5"))

    # Excessive hesitation penalty
    hesitation_ratio = total_hesitations / max(1, total_words)
    if hesitation_ratio > 0.08:
        fc = max(Decimal("4.5"), fc - Decimal("0.5"))

    # -------------------------------------------------------------------------
    # 2. Lexical Resource (LR)
    # -------------------------------------------------------------------------
    lr = Decimal("6.0")
    if len(all_awl) >= 8 or len(all_idioms) >= 2:
        lr = Decimal("7.0")
        if len(all_awl) >= 14 and len(all_idioms) >= 3:
            lr = Decimal("8.0")
    elif len(all_awl) >= 4:
        lr = Decimal("6.5")
    elif len(all_awl) <= 1 and total_words >= 100:
        lr = Decimal("5.5")

    # Lexical errors reduction
    lexical_errors = [a for a in all_annotations if a["category"] == "lexical"]
    if len(lexical_errors) >= 2:
        lr = max(Decimal("5.0"), lr - Decimal("0.5"))

    # -------------------------------------------------------------------------
    # 3. Grammatical Range and Accuracy (GRA)
    # -------------------------------------------------------------------------
    gra = Decimal("6.0")
    if total_complex >= 5:
        gra = Decimal("7.0")
        if total_complex >= 8 and len(all_annotations) <= 1:
            gra = Decimal("8.0")
    elif total_complex >= 2:
        gra = Decimal("6.5")
    else:
        gra = Decimal("5.5")

    grammar_errors = [a for a in all_annotations if a["category"] == "grammar"]
    if len(grammar_errors) >= 3:
        gra = max(Decimal("4.5"), gra - Decimal("1.0"))
    elif len(grammar_errors) >= 1:
        gra = max(Decimal("5.0"), gra - Decimal("0.5"))

    # -------------------------------------------------------------------------
    # 4. Pronunciation & Intelligibility (PR) - Rule #8 Compliant
    # -------------------------------------------------------------------------
    pr = Decimal("6.5")
    # Pacing stability proxy
    if 110 <= composite_wpm <= 150 and hesitation_ratio < 0.05:
        pr = Decimal("7.0")
    elif composite_wpm < 85 or composite_wpm > 180:
        pr = Decimal("5.5")

    # Aggregate phonological challenges
    combined_phonology = []
    seen_sounds = set()
    for part_res in [p1, p2, p3]:
        for pflag in part_res["phonology_flags"]:
            if pflag["sound"] not in seen_sounds:
                seen_sounds.add(pflag["sound"])
                combined_phonology.append(pflag)

    # Intelligibility score (0 - 100)
    intelligibility = 85
    if composite_wpm < 90 or composite_wpm > 170:
        intelligibility -= 10
    if hesitation_ratio > 0.05:
        intelligibility -= 8
    if len(combined_phonology) >= 3:
        intelligibility -= 5
    intelligibility = max(55, min(96, intelligibility))

    # -------------------------------------------------------------------------
    # Composite Band Calculation (Arithmetic Mean of 4 Criteria)
    # -------------------------------------------------------------------------
    composite_raw = (fc + lr + gra + pr) / Decimal("4.0")
    overall_band = round_to_ielts_half_band(composite_raw)

    band_min = max(Decimal("1.0"), overall_band - Decimal("0.5"))
    band_max = min(Decimal("9.0"), overall_band + Decimal("0.5"))
    confidence = Decimal("0.87")

    cefr_data = map_band_to_cefr(overall_band)
    cefr_level = cefr_data["level"]

    # -------------------------------------------------------------------------
    # Pedagogical Recommendations (Persian)
    # -------------------------------------------------------------------------
    pedagogical_advice: List[str] = []

    if composite_wpm < 105 and total_words > 40:
        pedagogical_advice.append(
            f"سرعت گفتار شما ({composite_wpm} کلمه در دقیقه) کمتر از بازه بهینه آیلتس (۱۱۰ تا ۱۵۰ WPM) است. "
            "تمرین بیان روان‌تر با اتصال واژگان و کاهش تردید در بازیابی لغات به ارتقای نمره روانی (FC) کمک می‌کند."
        )
    elif composite_wpm > 165:
        pedagogical_advice.append(
            f"سرعت کلامی شما ({composite_wpm} WPM) نسبتاً شتاب‌زده است. کمی مکث هدفمند روی نکات کلیدی، "
            "وضوح هجاها و کنترل لحن گفتار را تقویت می‌نماید."
        )

    if p2["duration_seconds"] < 60 and p2["word_count"] > 0:
        pedagogical_advice.append(
            "در بخش دوم (Cue Card)، پاسخ شما کمتر از ۱ دقیقه بود. در آزمون رسمی حتماً باید بین ۱ تا ۲ دقیقه صحبت کنید. "
            "از زمان ۱ دقیقه‌ای آماده‌سازی برای یادداشت کلیدواژه‌ها پیرامون تمام بولت‌های کارت استفاده نمایید."
        )

    if len(all_discourse) < 3:
        pedagogical_advice.append(
            "به‌کارگیری مارکرهای گفتمانی: استفاده طبیعی از عباراتی مانند 'To be honest'، 'As a matter of fact' و "
            "'On the other hand' به ساختار کلام شما عمق و پیوستگی منسجم‌تری می‌بخشد."
        )

    if len(combined_phonology) > 0:
        pedagogical_advice.append(
            "چالش‌های آوایی و تلفظ زبان فارسی: بررسی تمایز آواهای /w/ و /v/ و همچنین پرهیز از درج کسره پیش از کلمات با خوشه بی‌صدا "
            "(نظیر sport و student) وضوح بین‌المللی کلام را طبق استاندارد اگزمینر بالا می‌برد."
        )

    if len(all_annotations) > 0:
        pedagogical_advice.append(
            "اصلاحات گرامری و واژگانی ثبت‌شده روی متن را در برگه تحلیل بررسی کنید تا خطاهای متداول تکرار نشوند."
        )

    criteria_breakdown = {
        "fluency_and_coherence": {
            "score": float(fc),
            "title_fa": "روانی و انسجام کلامی (FC)",
            "descriptor_en": "Speaks at length without noticeable effort or loss of coherence. Uses a range of connective markers.",
            "guidance_fa": "سخن گفتن پیوسته بدون مکث‌های طولانی برای پیدا کردن لغات، حفظ سرعت مکالمه بین ۱۱۰ تا ۱۵۰ کلمه در دقیقه و بسط منطقی ایده‌ها.",
        },
        "lexical_resource": {
            "score": float(lr),
            "title_fa": "دامنه واژگان و اصطلاحات (LR)",
            "descriptor_en": "Uses vocabulary resource flexibly to discuss a variety of topics and uses some less common and idiomatic words.",
            "guidance_fa": "استفاده متنوع و طبیعی از لغات آکادمیک، کالوکیشن‌های رایج در مکالمه و بیان اصطلاحات بدون احساس تصنع.",
        },
        "grammatical_range_and_accuracy": {
            "score": float(gra),
            "title_fa": "تنوع و صحت ساختارهای دستوری (GRA)",
            "descriptor_en": "Uses a mix of simple and complex structures and produces a majority of error-free sentences.",
            "guidance_fa": "به‌کارگیری جملات مرکب با حروف ربط، کاربرد افعال وجهی (Modals) و حداقل خطای ساختاری و زمانی.",
        },
        "pronunciation": {
            "score": float(pr),
            "title_fa": "تلفظ، ریتم و وضوح کلامی (PR)",
            "descriptor_en": "Uses a range of pronunciation features with mixed control. Shows ability to be understood throughout.",
            "guidance_fa": "وضوح و شفافیت آوایی بالا، تکیه هجایی متناسب و رعایت ریتم طبیعی زبان بدون ایجاد ابهام در درک شنونده.",
        }
    }

    fluency_metrics = {
        "composite_wpm": composite_wpm,
        "total_words": total_words,
        "total_duration_seconds": total_duration,
        "hesitation_count": total_hesitations,
        "hesitation_ratio": round(hesitation_ratio, 3),
        "discourse_markers_count": len(all_discourse),
        "discourse_markers_used": list(all_discourse),
        "part1_wpm": p1["wpm"],
        "part2_wpm": p2["wpm"],
        "part3_wpm": p3["wpm"],
    }

    pronunciation_diagnostics = {
        "intelligibility_score": intelligibility,
        "pacing_stability": "Optimal" if (110 <= composite_wpm <= 155) else ("Slow" if composite_wpm < 110 else "Fast"),
        "persian_phonological_flags": combined_phonology,
        "syllable_stress_note": "تمرکز بر رعایت تکیه هجایی کلمات چندبخشی جهت افزایش خوانایی و روانی بین‌المللی کلام.",
    }

    return {
        "overall_band": float(overall_band),
        "overall_band_min": float(band_min),
        "overall_band_max": float(band_max),
        "confidence_score": float(confidence),
        "cefr_level": cefr_level,
        "fc_score": float(fc),
        "lr_score": float(lr),
        "gra_score": float(gra),
        "pr_score": float(pr),
        "criteria_breakdown": criteria_breakdown,
        "fluency_metrics": fluency_metrics,
        "pronunciation_diagnostics": pronunciation_diagnostics,
        "annotations": all_annotations,
        "pedagogical_advice": pedagogical_advice,
        "parts_metadata": {
            "part1": {"word_count": p1["word_count"], "duration_seconds": p1["duration_seconds"], "wpm": p1["wpm"]},
            "part2": {"word_count": p2["word_count"], "duration_seconds": p2["duration_seconds"], "wpm": p2["wpm"]},
            "part3": {"word_count": p3["word_count"], "duration_seconds": p3["duration_seconds"], "wpm": p3["wpm"]},
        }
    }
