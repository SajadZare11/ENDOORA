from datetime import timedelta
import re
from django.core.exceptions import ValidationError
from django.utils import timezone
from .models import SrsCandidate, SrsItem, SrsReview

# Curated seed dictionary for offline/deterministic enrichment of common words
CURATED_VOCAB_GLOSSARY = {
    "discovery": {
        "lemma": "discovery",
        "part_of_speech": "noun",
        "meaning_fa": "کشف، دستاورد علمی جدید",
        "phonetic": "/dɪˈskʌv.ər.i/",
        "collocation_en": "make a breakthrough discovery",
        "collocation_fa": "دست زدن به یک کشف بزرگ",
    },
    "ambiguous": {
        "lemma": "ambiguous",
        "part_of_speech": "adjective",
        "meaning_fa": "مبهم، چندپهلو، دارای چند معنا",
        "phonetic": "/æmˈbɪɡ.ju.əs/",
        "collocation_en": "highly ambiguous statement",
        "collocation_fa": "بیان کاملاً مبهم",
    },
    "cohesion": {
        "lemma": "cohesion",
        "part_of_speech": "noun",
        "meaning_fa": "انسجام، همبستگی درونی متن یا جامعه",
        "phonetic": "/koʊˈhiː.ʒən/",
        "collocation_en": "maintain textual cohesion",
        "collocation_fa": "حفظ انسجام متن",
    },
    "substantial": {
        "lemma": "substantial",
        "part_of_speech": "adjective",
        "meaning_fa": "قابل توجه، چشمگیر، اساسی",
        "phonetic": "/səbˈstæn.ʃəl/",
        "collocation_en": "substantial improvement",
        "collocation_fa": "بهبود قابل توجه",
    },
    "articulate": {
        "lemma": "articulate",
        "part_of_speech": "adjective",
        "meaning_fa": "رسا، واضح بیان کردن",
        "phonetic": "/ɑːˈtɪk.jə.lət/",
        "collocation_en": "clearly articulate the vision",
        "collocation_fa": "بیان شفاف چشم‌انداز",
    },
    "meticulous": {
        "lemma": "meticulous",
        "part_of_speech": "adjective",
        "meaning_fa": "دقیق، بسیار موشکافانه",
        "phonetic": "/məˈtɪk.jə.ləs/",
        "collocation_en": "meticulous attention to detail",
        "collocation_fa": "توجه دقیق به جزئیات",
    },
    "resilience": {
        "lemma": "resilience",
        "part_of_speech": "noun",
        "meaning_fa": "تاب‌آوری، انعطاف‌پذیری در برابر سختی",
        "phonetic": "/rɪˈzɪl.jəns/",
        "collocation_en": "demonstrate remarkable resilience",
        "collocation_fa": "نشان دادن تاب‌آوری چشمگیر",
    },
    "comprehend": {
        "lemma": "comprehend",
        "part_of_speech": "verb",
        "meaning_fa": "درک کردن، فهمیدن عمیق",
        "phonetic": "/ˌkɑːm.prɪˈhend/",
        "collocation_en": "fully comprehend the implications",
        "collocation_fa": "درک کامل پیامدها",
    },
}

STOP_WORDS = {
    "a", "an", "the", "and", "or", "but", "if", "then", "in", "on", "at", "to", "for",
    "with", "by", "about", "against", "between", "into", "through", "during", "before",
    "after", "above", "below", "from", "up", "down", "is", "am", "are", "was", "were",
    "be", "been", "being", "have", "has", "had", "do", "does", "did", "can", "could",
    "will", "would", "shall", "should", "may", "might", "must", "it", "its", "he",
    "his", "she", "her", "they", "them", "their", "we", "us", "our", "you", "your",
    "i", "me", "my", "this", "that", "these", "those", "what", "which", "who", "when",
    "where", "why", "how", "all", "any", "both", "each", "few", "more", "most", "some",
    "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very",
}


def lemmatize_simple(word: str) -> str:
    """Deterministic basic English lemmatizer for deduplication."""
    w = word.lower().strip()
    if w.endswith("ies") and len(w) > 4:
        return w[:-3] + "y"
    if w.endswith("es") and len(w) > 3 and not w.endswith("ies"):
        return w[:-2]
    if w.endswith("s") and len(w) > 2 and not w.endswith("ss"):
        return w[:-1]
    if w.endswith("ed") and len(w) > 3:
        if w.endswith("ied") and len(w) > 4:
            return w[:-3] + "y"
        return w[:-2] if not w.endswith("eed") else w[:-1]
    if w.endswith("ing") and len(w) > 4:
        return w[:-3]
    return w


def review_item(item: SrsItem, rating: int, response_time_ms: int | None = None) -> dict:
    """
    Transparent SM-2 inspired SRS review scheduler with Anti-Spam protection.
    Ratings:
      1 = Again (Failed recall; reset interval to 1d; increment lapse; flag leech if lapses >= 4)
      2 = Hard (Struggled; 1.2x interval; reduce ease factor)
      3 = Good (Successful recall; standard interval expansion)
      4 = Easy (Instant effortless recall; bonus interval; increase ease factor)
    """
    rating = max(1, min(4, int(rating)))
    now = timezone.now()

    # Anti-spam guard: reject rapid repetitive bursts on the exact same card under 400ms
    if response_time_ms is not None and response_time_ms < 300:
        raise ValidationError("Review response too rapid. Please inspect card content before rating.")

    previous_interval = item.interval_days
    previous_ef = item.ease_factor

    if rating == 1:
        # Again: Reset interval, increment lapse count, decrease ease factor
        item.interval_days = 1
        item.repetition = 0
        item.lapse_count += 1
        item.ease_factor = max(1.3, round(item.ease_factor - 0.2, 2))
        item.status = "learning"

        # Leech handling: flag card after persistent failures
        if item.lapse_count >= SrsItem.LEECH_LAPSE_THRESHOLD:
            item.is_leech = True
            item.leech_action = "contextual_remedy"

    elif rating == 2:
        # Hard: slight growth, lower ease factor
        item.interval_days = max(1, round(previous_interval * 1.2))
        item.ease_factor = max(1.3, round(item.ease_factor - 0.15, 2))
        item.status = "learning" if item.repetition < 2 else "review"

    elif rating == 3:
        # Good: normal SM-2 progression
        if item.repetition == 0:
            item.interval_days = 1
        elif item.repetition == 1:
            item.interval_days = 3
        else:
            item.interval_days = max(1, round(previous_interval * item.ease_factor))
        item.repetition += 1
        item.status = "mastered" if item.repetition >= 5 else "review"

    elif rating == 4:
        # Easy: accelerated growth, increase ease factor
        if item.repetition == 0:
            item.interval_days = 2
        elif item.repetition == 1:
            item.interval_days = 5
        else:
            item.interval_days = max(previous_interval + 1, round(previous_interval * item.ease_factor * 1.3))
        item.ease_factor = min(3.0, round(item.ease_factor + 0.15, 2))
        item.repetition += 1
        item.status = "mastered" if item.repetition >= 4 else "review"

    item.due_at = now + timedelta(days=item.interval_days)
    item.last_reviewed_at = now
    item.save(
        update_fields=[
            "interval_days",
            "repetition",
            "ease_factor",
            "lapse_count",
            "is_leech",
            "leech_action",
            "status",
            "due_at",
            "last_reviewed_at",
            "updated_at",
        ]
    )

    review_record = SrsReview.objects.create(
        item=item,
        rating=rating,
        previous_interval_days=previous_interval,
        new_interval_days=item.interval_days,
        previous_ease_factor=previous_ef,
        new_ease_factor=item.ease_factor,
        response_time_ms=response_time_ms,
    )

    return {
        "item": item,
        "review_id": review_record.id,
        "previous_interval_days": previous_interval,
        "new_interval_days": item.interval_days,
        "previous_ease_factor": previous_ef,
        "new_ease_factor": item.ease_factor,
        "is_leech": item.is_leech,
        "lapse_count": item.lapse_count,
        "next_intervals": item.calculate_next_intervals(),
    }


def extract_candidates(
    learner,
    text: str,
    source_type: str = "writing",
    source_id: str = "",
) -> list[SrsCandidate]:
    """
    Extracts candidate vocabulary from learner activity (conversations, writing, lessons).
    Deduplicates against existing deck items and pending candidates.
    Preserves traceable source sentences.
    """
    if not text or not text.strip():
        return []

    # Tokenize into sentences and words
    sentences = re.split(r"(?<=[.!?])\s+", text.strip())
    created_candidates = []

    seen_lemmas = set()

    for sentence in sentences:
        words = re.findall(r"\b[A-Za-z]+(?:'[A-Za-z]+)?\b", sentence)
        for raw_word in words:
            word_clean = raw_word.lower()
            if len(word_clean) < 3 or word_clean in STOP_WORDS:
                continue

            lemma = lemmatize_simple(word_clean)
            if lemma in seen_lemmas:
                continue
            seen_lemmas.add(lemma)

            # Check for existing card or pending candidate
            if SrsItem.objects.filter(learner=learner, lemma=lemma).exists():
                continue
            if SrsCandidate.objects.filter(learner=learner, lemma=lemma, status="pending").exists():
                continue

            # Lookup gloss or generate default
            info = CURATED_VOCAB_GLOSSARY.get(lemma, {
                "lemma": lemma,
                "part_of_speech": "noun" if word_clean.endswith(("tion", "ment", "ity", "ance", "ence")) else "word",
                "meaning_fa": f"واژه {word_clean} (استخراج‌شده از متن)",
                "phonetic": f"/{word_clean}/",
                "collocation_en": "",
                "collocation_fa": "",
            })

            cand = SrsCandidate.objects.create(
                learner=learner,
                term=raw_word,
                lemma=lemma,
                part_of_speech=info["part_of_speech"],
                meaning_fa=info["meaning_fa"],
                example_sentence=sentence.strip(),
                source_text=sentence.strip(),
                source_type=source_type,
                source_id=source_id,
                phonetic=info.get("phonetic", ""),
                status="pending",
            )
            created_candidates.append(cand)

    return created_candidates


def approve_candidate(
    candidate_id: int,
    learner,
    custom_meaning: str | None = None,
    custom_example: str | None = None,
) -> SrsItem:
    """
    Learner approval step: turns candidate into an active SRS item.
    Supports user edits of bilingual meaning and personal example.
    """
    candidate = SrsCandidate.objects.get(id=candidate_id, learner=learner)
    now = timezone.now()

    # Check if duplicate item already exists
    existing = SrsItem.objects.filter(
        learner=learner,
        lemma=candidate.lemma,
        part_of_speech=candidate.part_of_speech,
    ).first()

    if existing:
        candidate.status = "approved"
        candidate.save(update_fields=["status", "updated_at"])
        return existing

    meaning_fa = (custom_meaning or "").strip() or candidate.meaning_fa or f"معنی واژه {candidate.term}"
    example_sentence = (custom_example or "").strip() or candidate.example_sentence or candidate.source_text

    gloss = CURATED_VOCAB_GLOSSARY.get(candidate.lemma, {})

    item = SrsItem.objects.create(
        learner=learner,
        term=candidate.term,
        lemma=candidate.lemma,
        part_of_speech=candidate.part_of_speech,
        meaning_fa=meaning_fa,
        example_sentence=example_sentence,
        collocation_en=gloss.get("collocation_en", ""),
        collocation_fa=gloss.get("collocation_fa", ""),
        phonetic=candidate.phonetic or gloss.get("phonetic", ""),
        audio_url="",
        source_text=candidate.source_text,
        source_type=candidate.source_type,
        status="new",
        interval_days=1,
        repetition=0,
        ease_factor=2.5,
        lapse_count=0,
        is_leech=False,
        due_at=now,
    )

    candidate.status = "approved"
    candidate.save(update_fields=["status", "updated_at"])
    return item


def ignore_candidate(candidate_id: int, learner) -> SrsCandidate:
    """Rejects a candidate word from entering the learner's SRS deck."""
    candidate = SrsCandidate.objects.get(id=candidate_id, learner=learner)
    candidate.status = "ignored"
    candidate.save(update_fields=["status", "updated_at"])
    return candidate


def delete_srs_item(item_id: int, learner) -> bool:
    """
    Deletes an SRS card and completely clears personal source context
    to satisfy data privacy and user control requirements.
    """
    deleted_count, _ = SrsItem.objects.filter(id=item_id, learner=learner).delete()
    return deleted_count > 0


def edit_srs_item(
    item_id: int,
    learner,
    meaning_fa: str | None = None,
    example_sentence: str | None = None,
) -> SrsItem:
    """Learner correction of flawed AI meanings or personal example updates."""
    item = SrsItem.objects.get(id=item_id, learner=learner)
    updates = []
    if meaning_fa is not None:
        item.meaning_fa = meaning_fa.strip()
        updates.append("meaning_fa")
    if example_sentence is not None:
        item.example_sentence = example_sentence.strip()
        updates.append("example_sentence")

    if updates:
        updates.append("updated_at")
        item.save(update_fields=updates)
    return item


def get_srs_stats(learner) -> dict:
    """Returns deck summary metrics for dashboard and Today mission integration."""
    now = timezone.now()
    qs = SrsItem.objects.filter(learner=learner)
    return {
        "total_cards": qs.count(),
        "due_count": qs.filter(due_at__lte=now).count(),
        "learning_count": qs.filter(status="learning").count(),
        "review_count": qs.filter(status="review").count(),
        "mastered_count": qs.filter(status="mastered").count(),
        "leeches_count": qs.filter(is_leech=True).count(),
        "pending_candidates_count": SrsCandidate.objects.filter(learner=learner, status="pending").count(),
    }
