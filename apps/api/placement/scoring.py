"""
Psychometric IRT / Rasch Scoring Engine and Concordance Engine
Endoora Proprietary Adaptive Placement Testing System.

Calculates latent ability (theta) and standard error (SE) via Item Response Theory
(1-PL Rasch / Bayesian MAP with Newton-Raphson), maps ability to the 0-100 Endoora
Placement Index using authorized deterministic piecewise linear concordances,
and outputs CEFR bands (A1 to C2), skill subscores, Can-Do descriptors, and
curriculum textbook recommendations.
"""

import math
from dataclasses import dataclass, field
from typing import Any


@dataclass(frozen=True)
class SectionScore:
    """
    Psychometric score summary for a test section.
    Replaces legacy scoring fields with endoora_index.
    """
    section: str
    correct: int
    total: int
    percentage: float
    endoora_index: int
    cefr_level: str
    theta: float = 0.0
    standard_error: float = 1.0


CEFR_LEVEL_RANK: dict[str, int] = {
    "A1": 1,
    "A2": 2,
    "B1": 3,
    "B2": 4,
    "C1": 5,
    "C2": 6,
}

RANK_TO_CEFR: dict[int, str] = {v: k for k, v in CEFR_LEVEL_RANK.items()}

# Authoritative CEFR concordance bands according to ORIGINAL_REQUEST.md & PROJECT.md
CEFR_BANDS: list[dict[str, Any]] = [
    {"level": "A1", "theta_min": -3.0, "theta_max": -1.8, "index_min": 0, "index_max": 29},
    {"level": "A2", "theta_min": -1.8, "theta_max": -0.8, "index_min": 30, "index_max": 44},
    {"level": "B1", "theta_min": -0.8, "theta_max": 0.2, "index_min": 45, "index_max": 64},
    {"level": "B2", "theta_min": 0.2, "theta_max": 1.2, "index_min": 65, "index_max": 79},
    {"level": "C1", "theta_min": 1.2, "theta_max": 2.2, "index_min": 80, "index_max": 91},
    {"level": "C2", "theta_min": 2.2, "theta_max": 3.0, "index_min": 92, "index_max": 100},
]


def item_probability(theta: float, b_i: float, a_i: float = 1.0) -> float:
    """
    Calculates the probability of a correct response under the 2-PL IRT / Rasch model.
    P_i(theta) = 1 / (1 + exp(-a_i * (theta - b_i)))
    """
    z = a_i * (theta - b_i)
    if z < -40.0:
        return 0.0
    if z > 40.0:
        return 1.0
    return 1.0 / (1.0 + math.exp(-z))


def estimate_theta_rasch(responses: list[dict]) -> tuple[float, float]:
    """
    Estimates candidate latent ability theta in [-3.0, +3.0] and standard error SE(theta)
    using 1-PL Rasch / Bayesian MAP (Maximum A Posteriori) with bounded Newton-Raphson iteration.

    Parameters
    ----------
    responses : list[dict]
        List of response dictionaries, each containing:
          - 'difficulty_b': float (item difficulty logit parameter b_i in [-3.0, +3.0])
          - 'discrimination_a': float (optional, item discrimination parameter a_i, default 1.0)
          - 'is_correct': bool (True if answered correctly, False otherwise)

    Returns
    -------
    tuple[float, float]
        (theta, standard_error):
          - theta: latent ability estimate clamped in [-3.0, +3.0], rounded to 3 decimal places.
          - standard_error: measurement standard error SE = 1 / sqrt(I(theta)), rounded to 3 decimal places.
    """
    if not responses:
        return (0.0, 1.0)

    # Standard normal population prior: mu = 0.0, sigma^2 = 1.0
    prior_mean = 0.0
    prior_variance = 1.0

    theta = 0.0  # Unbiased initial starting point
    max_iterations = 25
    convergence_delta = 0.001

    for _ in range(max_iterations):
        # First and second derivatives of the log-posterior
        first_derivative = -(theta - prior_mean) / prior_variance
        second_derivative = -1.0 / prior_variance

        for r in responses:
            a = float(r.get("discrimination_a") if r.get("discrimination_a") is not None else 1.0)
            b = float(r.get("difficulty_b", 0.0))
            u = 1.0 if r.get("is_correct") else 0.0

            p = item_probability(theta, b, a)
            q = 1.0 - p

            first_derivative += a * (u - p)
            second_derivative -= a * a * p * q

        if abs(second_derivative) < 1e-9:
            break

        step = first_derivative / second_derivative
        new_theta = max(-3.0, min(3.0, theta - step))

        if abs(new_theta - theta) < convergence_delta:
            theta = new_theta
            break
        theta = new_theta

    # Calculate Test Information and Standard Error: SE = 1 / sqrt(I(theta))
    information = 1.0 / prior_variance
    for r in responses:
        a = float(r.get("discrimination_a") if r.get("discrimination_a") is not None else 1.0)
        b = float(r.get("difficulty_b", 0.0))
        p = item_probability(theta, b, a)
        information += a * a * p * (1.0 - p)

    standard_error = round(1.0 / math.sqrt(information), 3)
    rounded_theta = round(theta, 3)

    return (rounded_theta, standard_error)


def theta_to_endoora_index(theta: float) -> int:
    """
    Deterministic piecewise linear concordance mapping latent ability theta in [-3.0, +3.0]
    to the authentic 0-100 Endoora Placement Index according to authorized CEFR bands:

      - A1: theta < -1.8             ==> 0–29
      - A2: -1.8 <= theta < -0.8     ==> 30–44
      - B1: -0.8 <= theta <  0.2     ==> 45–64
      - B2:  0.2 <= theta <  1.2     ==> 65–79
      - C1:  1.2 <= theta <  2.2     ==> 80–91
      - C2:  theta >= 2.2            ==> 92–100
    """
    clamped = max(-3.0, min(3.0, float(theta)))

    if clamped < -1.8:
        # A1: [-3.0, -1.8) -> [0, 29] (span = 29, width = 1.2)
        ratio = (clamped - (-3.0)) / (-1.8 - (-3.0))
        return max(0, min(29, int(math.floor(ratio * 29 + 0.5))))
    elif clamped < -0.8:
        # A2: [-1.8, -0.8) -> [30, 44] (span = 14, width = 1.0)
        ratio = (clamped - (-1.8)) / (-0.8 - (-1.8))
        return max(30, min(44, int(math.floor(30 + ratio * 14 + 0.5))))
    elif clamped < 0.2:
        # B1: [-0.8, 0.2) -> [45, 64] (span = 19, width = 1.0)
        ratio = (clamped - (-0.8)) / (0.2 - (-0.8))
        return max(45, min(64, int(math.floor(45 + ratio * 19 + 0.5))))
    elif clamped < 1.2:
        # B2: [0.2, 1.2) -> [65, 79] (span = 14, width = 1.0)
        ratio = (clamped - 0.2) / (1.2 - 0.2)
        return max(65, min(79, int(math.floor(65 + ratio * 14 + 0.5))))
    elif clamped < 2.2:
        # C1: [1.2, 2.2) -> [80, 91] (span = 11, width = 1.0)
        ratio = (clamped - 1.2) / (2.2 - 1.2)
        return max(80, min(91, int(math.floor(80 + ratio * 11 + 0.5))))
    else:
        # C2: [2.2, 3.0] -> [92, 100] (span = 8, width = 0.8)
        ratio = (clamped - 2.2) / (3.0 - 2.2)
        return max(92, min(100, int(math.floor(92 + ratio * 8 + 0.5))))


def endoora_index_to_cefr(index: int) -> str:
    """
    Returns CEFR level string ('A1' through 'C2') strictly based on
    authorized Endoora Placement Index concordance bands.
    """
    idx = max(0, min(100, int(round(index))))
    if idx >= 92:
        return "C2"
    if idx >= 80:
        return "C1"
    if idx >= 65:
        return "B2"
    if idx >= 45:
        return "B1"
    if idx >= 30:
        return "A2"
    return "A1"


def theta_to_cefr(theta: float) -> str:
    """
    Maps continuous ability parameter theta directly to CEFR level.
    """
    if theta < -1.8:
        return "A1"
    if theta < -0.8:
        return "A2"
    if theta < 0.2:
        return "B1"
    if theta < 1.2:
        return "B2"
    if theta < 2.2:
        return "C1"
    return "C2"


def normalize_answer(value: Any) -> str:
    """
    Normalizes learner answer input for deterministic comparison.
    Handles None, dict payloads (selected_option, spoken_text, written_text), and strings.
    """
    if value is None:
        return ""
    if isinstance(value, dict):
        value = (
            value.get("selected_option")
            or value.get("spoken_text")
            or value.get("written_text")
            or ""
        )
    return str(value).strip().lower()


def score_section(section: str, responses: list[dict]) -> SectionScore:
    """
    Scores a discrete test section (e.g. grammar, vocabulary, reading, listening, speaking, writing),
    returning a SectionScore containing item counts, accuracy percentage, endoora_index,
    and diagnosed CEFR level.
    """
    correct = 0
    total = len(responses)

    if not total:
        return SectionScore(
            section=section,
            correct=0,
            total=0,
            percentage=0.0,
            endoora_index=0,
            cefr_level="A1",
            theta=-3.0,
            standard_error=1.0,
        )

    # Calculate weighted accuracy and rank sum
    rank_sum = 0
    correct_rank_sum = 0
    irt_responses = []

    for item in responses:
        answer = normalize_answer(item.get("answer"))
        expected = normalize_answer(item.get("correct_answer"))
        item_cefr = (item.get("cefr_level") or "B1").upper()
        rank = CEFR_LEVEL_RANK.get(item_cefr, 3)
        rank_sum += rank

        is_item_correct = (answer == expected) or (item.get("is_correct") is True)
        if is_item_correct:
            correct += 1
            correct_rank_sum += rank

        # Extract or derive IRT parameters
        b_val = item.get("difficulty_b")
        if b_val is None:
            # Fallback difficulty from CEFR level
            cefr_b_defaults = {
                "A1": -2.2, "A2": -1.3, "B1": -0.3,
                "B2": 0.7, "C1": 1.7, "C2": 2.6
            }
            b_val = cefr_b_defaults.get(item_cefr, 0.0)

        a_val = item.get("discrimination_a", 1.0) or 1.0

        irt_responses.append({
            "difficulty_b": float(b_val),
            "discrimination_a": float(a_val),
            "is_correct": is_item_correct,
        })

    percentage = round((correct / total) * 100, 2)

    # Estimate section ability using IRT
    theta, se = estimate_theta_rasch(irt_responses)
    endoora_index = theta_to_endoora_index(theta)
    cefr = endoora_index_to_cefr(endoora_index)

    return SectionScore(
        section=section,
        correct=correct,
        total=total,
        percentage=percentage,
        endoora_index=endoora_index,
        cefr_level=cefr,
        theta=theta,
        standard_error=se,
    )


# Descriptive and curriculum metadata for each CEFR tier
CEFR_DESCRIPTIONS: dict[str, dict[str, Any]] = {
    "A1": {
        "name_fa": "مبتدی (Starter)",
        "name_en": "Beginner",
        "badge_color": "#94a3b8",
        "summary_fa": "درک و بیان عبارات روزمره، معرفی خود و برقراری ارتباط در موقعیت‌های ابتدایی با سخنرانان صبور.",
        "summary_en": "Can understand and use familiar everyday expressions and basic phrases aimed at the satisfaction of needs.",
        "index_range": "۰ – ۲۹ / ۱۰۰",
        "recommended_books": [
            "American English File Starter",
            "English Grammar in Use (Basic)",
            "Tactics for Listening (Basic)",
        ],
        "can_do_descriptors": [
            "می‌تواند عبارات ساده و روزمره را متوجه شود و برای نیازهای ابتدایی استفاده کند.",
            "می‌تواند خود و دیگران را معرفی کند و سوالات ساده در مورد محل زندگی بپرسد.",
            "می‌تواند در صورت آرام صحبت کردن طرف مقابل، ارتباط اولیه برقرار کند.",
        ],
    },
    "A2": {
        "name_fa": "مقدماتی (Elementary)",
        "name_en": "Elementary",
        "badge_color": "#38bdf8",
        "summary_fa": "توانایی درک جملات در زمینه‌های پرکاربرد (اطلاعات فردی، خرید، محیط کار) و تبادل اطلاعات ساده.",
        "summary_en": "Can communicate in simple and routine tasks requiring a simple and direct exchange of information on familiar topics.",
        "index_range": "۳۰ – ۴۴ / ۱۰۰",
        "recommended_books": [
            "American English File 1",
            "Speakout Starter/Elementary",
            "Destination A1/A2",
        ],
        "can_do_descriptors": [
            "می‌تواند جملات و اصطلاحات مرتبط با موضوعات پرکاربرد (خانواده، خرید، کار) را درک کند.",
            "می‌تواند در موقعیت‌های روتین تبادل اطلاعات ساده انجام دهد.",
            "می‌تواند پیشینه خود، محیط اطراف و نیازهای فوری را توصیف کند.",
        ],
    },
    "B1": {
        "name_fa": "متوسط (Intermediate)",
        "name_en": "Intermediate",
        "badge_color": "#34d399",
        "summary_fa": "درک نکات اصلی متون شفاف، مکالمه در سفرها و ارائه توضیحات کوتاه درباره برنامه‌ها، تجربیات و دلایل.",
        "summary_en": "Can understand the main points of clear standard input on familiar matters and handle most travel/work situations.",
        "index_range": "۴۵ – ۶۴ / ۱۰۰",
        "recommended_books": [
            "American English File 2 & 3",
            "Oxford Word Skills (Intermediate)",
            "Destination B1",
        ],
        "can_do_descriptors": [
            "می‌تواند نکات اصلی موضوعات کاری، تحصیلی و اوقات فراغت را متوجه شود.",
            "می‌تواند در اکثر موقعیت‌های مسافرتی به زبان انگلیسی ارتباط برقرار کند.",
            "می‌تواند متون ساده و منسجم درباره موضوعات مورد علاقه تولید کند.",
            "می‌تواند تجربیات، رویدادها، آرزوها و دلایل برنامه‌های خود را به صورت کوتاه بیان کند.",
        ],
    },
    "B2": {
        "name_fa": "فوق‌متوسط (Upper-Intermediate)",
        "name_en": "Upper-Intermediate",
        "badge_color": "#818cf8",
        "summary_fa": "درک متون پیچیده، مکالمه روان و پیوسته با افراد بومی، و نگارش متون مستدل در موضوعات تخصصی.",
        "summary_en": "Can interact with a degree of fluency and spontaneity with native speakers and formulate nuanced arguments.",
        "index_range": "۶۵ – ۷۹ / ۱۰۰",
        "recommended_books": [
            "American English File 4",
            "Cambridge English Empower B2",
            "Destination B2",
        ],
        "can_do_descriptors": [
            "می‌تواند ایده‌های اصلی متون پیچیده در موضوعات ملموس و انتزاعی را درک کند.",
            "می‌تواند بدون تلاش زیاد و با روانی مناسب با انگلیسی‌زبانان گفت‌وگو کند.",
            "می‌تواند متون شفاف و با جزئیات درباره طیف گسترده‌ای از موضوعات بنویسد.",
        ],
    },
    "C1": {
        "name_fa": "پیشرفته (Advanced)",
        "name_en": "Advanced",
        "badge_color": "#f59e0b",
        "summary_fa": "درک طیف وسیعی از متون طولانی و معانی ضمنی، بیان روان بدون جستجوی کلمات، و تسلط در محافل دانشگاهی.",
        "summary_en": "Can express ideas fluently and spontaneously, using language flexibly and effectively for social, academic and professional purposes.",
        "index_range": "۸۰ – ۹۱ / ۱۰۰",
        "recommended_books": [
            "American English File 5",
            "Cambridge Advanced Grammar in Use",
            "IELTS Cambridge 15-18",
        ],
        "can_do_descriptors": [
            "می‌تواند متون طولانی و دشوار را بفهمد و معانی پنهان و ضمنی را درک کند.",
            "می‌تواند ایده‌های خود را به صورت روان و خودانگیخته بدون مکث بیان کند.",
            "می‌تواند از زبان به شکل منعطف در محیط‌های اجتماعی، دانشگاهی و شغلی استفاده کند.",
        ],
    },
    "C2": {
        "name_fa": "مسلط و حرفه‌ای (Proficient)",
        "name_en": "Proficient",
        "badge_color": "#ec4899",
        "summary_fa": "تسلط کامل، درک فوری هر گفتار یا نوشتار، و بازآفرینی استدلال‌ها با دقت، تمایز ظریف و روانی بالا.",
        "summary_en": "Can express themselves spontaneously, very fluently and precisely, differentiating finer shades of meaning even in complex situations.",
        "index_range": "۹۲ – ۱۰۰ / ۱۰۰",
        "recommended_books": [
            "Proficiency Expert (Pearson)",
            "Cambridge English: Proficiency (CPE) Masterclass",
        ],
        "can_do_descriptors": [
            "می‌تواند هر گفتار یا نوشتاری را بدون زحمت متوجه شود.",
            "می‌تواند اطلاعات برگرفته از منابع مختلف را خلاصه و بازسازی کند.",
            "می‌تواند حتی در پیچیده‌ترین موقعیت‌ها تمایزهای ظریف معنایی را به دقت بیان کند.",
        ],
    },
}


def get_cefr_description(level: str) -> dict[str, Any]:
    """Retrieves full competency metadata and Can-Do descriptors for a given CEFR tier."""
    lvl = (level or "B1").upper()
    return CEFR_DESCRIPTIONS.get(lvl, CEFR_DESCRIPTIONS["B1"])


def calculate_subscores(
    all_responses: list[dict],
) -> dict[str, SectionScore]:
    """
    Computes individual skill subscores across all 6 core sections:
    grammar, vocabulary, reading, listening, speaking, writing.
    """
    grouped: dict[str, list[dict]] = {
        "grammar": [],
        "vocabulary": [],
        "reading": [],
        "listening": [],
        "speaking": [],
        "writing": [],
    }

    for resp in all_responses:
        sec = resp.get("section", "grammar").lower()
        if sec in grouped:
            grouped[sec].append(resp)
        else:
            grouped.setdefault(sec, []).append(resp)

    return {sec: score_section(sec, items) for sec, items in grouped.items()}


def build_placement_diagnostic_report(
    responses: list[dict],
) -> dict[str, Any]:
    """
    Assembles a comprehensive, verifiable diagnostic placement report:
      - Latent ability theta & standard error SE(theta)
      - Authentic 0-100 Endoora Placement Index
      - Final CEFR placement (A1 through C2)
      - 6-skill breakdown with section scores
      - Tailored Can-Do descriptors
      - Curriculum textbook recommendations
      - Honest assessment notice
    """
    theta, se = estimate_theta_rasch(responses)
    subscores = calculate_subscores(responses)

    # Final overall score and CEFR level are strictly the arithmetic average of the skill subscores
    sec_indices = [score.endoora_index for score in subscores.values()]
    endoora_index = int(round(sum(sec_indices) / len(sec_indices))) if sec_indices else 0
    cefr_level = endoora_index_to_cefr(endoora_index)
    cefr_meta = get_cefr_description(cefr_level)

    return {
        "theta": theta,
        "standard_error": se,
        "endoora_index": endoora_index,
        "cefr_level": cefr_level,
        "cefr_meta": {
            "name_fa": cefr_meta["name_fa"],
            "name_en": cefr_meta["name_en"],
            "badge_color": cefr_meta["badge_color"],
            "summary_fa": cefr_meta["summary_fa"],
            "summary_en": cefr_meta["summary_en"],
            "index_range": cefr_meta["index_range"],
            "recommended_books": cefr_meta["recommended_books"],
            "can_do_descriptors": cefr_meta["can_do_descriptors"],
        },
        "sections": {
            sec: {
                "section": score.section,
                "correct": score.correct,
                "total": score.total,
                "percentage": score.percentage,
                "endoora_index": score.endoora_index,
                "cefr_level": score.cefr_level,
                "theta": score.theta,
                "standard_error": score.standard_error,
            }
            for sec, score in subscores.items()
        },
        "notice": (
            "این کارنامه یک برآورد آموزشی استاندارد مطابق چارچوب CEFR و سامانه سنجش اختصاصی اندورا است "
            "و نشان‌دهنده عملکرد مستند شما در ارزیابی انطباقی می‌باشد."
        ),
    }
