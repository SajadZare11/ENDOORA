import re
from decimal import Decimal
from typing import Any, Dict, List, Tuple
from .scoring import round_to_ielts_half_band, map_band_to_cefr


# Academic Word List sample & advanced lexical markers
ACADEMIC_WORD_LIST = {
    "accommodate", "accumulate", "acquire", "adequate", "adjacent", "advocate", "aggregate", "allocate",
    "alternative", "ambiguous", "amend", "analogy", "anticipate", "apparent", "append", "appreciate",
    "arbitrary", "aspect", "assemble", "assess", "assign", "assist", "assume", "assure", "attain",
    "attribute", "automate", "available", "aware", "behalf", "benefit", "bias", "brief", "bulk",
    "capable", "capacity", "category", "cease", "challenge", "channel", "cite", "clarify", "clause",
    "coherent", "coincide", "collapse", "commence", "commission", "commit", "commodity", "compatible",
    "compensate", "compile", "complement", "complex", "component", "compound", "comprehensive", "comprise",
    "compute", "conceive", "conclude", "concurrent", "conduct", "confer", "confine", "conform", "consent",
    "consequent", "considerable", "consist", "constant", "constitute", "constrain", "construct", "consult",
    "consume", "contact", "contemporary", "context", "contract", "contradict", "contrary", "contrast",
    "contribute", "controversy", "convene", "converse", "convert", "convince", "cooperate", "coordinate",
    "core", "corporate", "correspond", "crucial", "currency", "cycle", "data", "debate", "decade",
    "decline", "deduce", "define", "definite", "demonstrate", "denote", "deny", "depress", "derive",
    "design", "despite", "detect", "deviate", "device", "devote", "differentiate", "dimension", "diminish",
    "discrete", "discriminate", "displace", "display", "dispose", "distinct", "distort", "distribute",
    "diverse", "document", "domain", "domestic", "dominate", "draft", "drama", "duration", "dynamic",
    "economy", "eliminate", "emerge", "emphasis", "empirical", "enable", "encounter", "energy", "enforce",
    "enhance", "enormous", "ensure", "entity", "environment", "equate", "equip", "equivalent", "erode",
    "error", "establish", "estate", "estimate", "ethic", "ethnic", "evaluate", "eventual", "evident",
    "evolve", "exceed", "exclude", "exhibit", "expand", "expert", "explicit", "exploit", "export", "expose",
    "external", "extract", "facilitate", "factor", "feature", "federal", "fee", "file", "final", "finance",
    "finite", "flexible", "fluctuate", "focus", "format", "formula", "forthcoming", "foundation", "framework",
    "function", "fund", "fundamental", "furthermore", "gender", "generate", "generation", "globe", "goal",
    "grade", "grant", "guarantee", "guideline", "hence", "hierarchy", "highlight", "hypothesis", "identical",
    "identify", "ideology", "ignorance", "illustrate", "image", "immigrate", "impact", "implement",
    "implicate", "implicit", "imply", "impose", "incentive", "incidence", "incline", "income", "incorporate",
    "index", "indicate", "individual", "induce", "inevitable", "infer", "infrastructure", "inherent",
    "inhibit", "initial", "initiate", "injure", "innovate", "input", "insert", "insight", "inspect",
    "instance", "institute", "instruct", "integral", "integrate", "integrity", "intelligence", "intense",
    "interact", "intermediate", "internal", "interpret", "interval", "intervene", "intrinsic", "invest",
    "investigate", "invoke", "involve", "isolate", "issue", "item", "job", "journal", "justify", "label",
    "labor", "layer", "lecture", "legal", "legislate", "levy", "liberal", "license", "likewise", "link",
    "locate", "logic", "maintain", "major", "manipulate", "manual", "margin", "mature", "maximise",
    "mechanism", "media", "mediate", "medical", "medium", "mental", "method", "migrate", "military",
    "minimal", "minimise", "minimum", "ministry", "minor", "mode", "modify", "monitor", "motive", "mutual",
    "negate", "network", "neutral", "nevertheless", "nonetheless", "norm", "normal", "notion", "nuclear",
    "objective", "obtain", "obvious", "occupy", "occur", "odd", "offset", "ongoing", "option", "orient",
    "outcome", "output", "overall", "overlap", "overseas", "panel", "paradigm", "paragraph", "parallel",
    "parameter", "participate", "partner", "passive", "perceive", "percent", "period", "persist",
    "perspective", "phase", "phenomenon", "philosophy", "physical", "plus", "policy", "portion", "pose",
    "positive", "potential", "practitioner", "precede", "precise", "predict", "predominant", "preliminary",
    "presume", "previous", "primary", "prime", "principal", "principle", "prior", "priority", "proceed",
    "process", "professional", "prohibit", "project", "promote", "proportion", "prospect", "protocol",
    "psychology", "publication", "publish", "purchase", "pursue", "qualitative", "quote", "radical",
    "random", "range", "ratio", "rational", "react", "recover", "refine", "regime", "region", "register",
    "regulate", "reinforce", "reject", "relax", "release", "relevant", "reluctance", "rely", "remove",
    "require", "research", "reside", "resolve", "resource", "respond", "restore", "restrain", "restrict",
    "retain", "reveal", "revenue", "reverse", "revise", "revolution", "rigid", "role", "route", "scenario",
    "schedule", "scheme", "scope", "section", "sector", "secure", "seek", "select", "sequence", "series",
    "shift", "significant", "similar", "simulate", "site", "so-called", "sole", "somewhat", "source",
    "specific", "specify", "sphere", "stable", "statistic", "status", "straightforward", "strategy",
    "stress", "structure", "style", "submit", "subordinate", "subsequent", "subsidy", "substitute",
    "successor", "sufficient", "sum", "summary", "supplement", "survey", "survive", "suspend", "sustain",
    "symbol", "tape", "target", "task", "team", "technical", "technique", "technology", "temporary",
    "tense", "terminate", "text", "theme", "theory", "thereby", "thesis", "topic", "trace", "tradition",
    "transfer", "transform", "transit", "transmit", "transport", "trend", "trigger", "ultimate",
    "undergo", "underlie", "undertake", "uniform", "unify", "unique", "utilise", "valid", "vary",
    "vehicle", "version", "via", "violate", "virtual", "visible", "vision", "visual", "volume", "voluntary",
    "welfare", "whereas", "whereby", "widespread"
}

# Cohesive transitions dictionary
COHESIVE_CONNECTORS = [
    "furthermore", "moreover", "in addition", "additionally", "on the other hand",
    "in contrast", "conversely", "however", "nevertheless", "nonetheless",
    "consequently", "as a result", "therefore", "thus", "hence", "accordingly",
    "for instance", "for example", "specifically", "in particular", "to illustrate",
    "in conclusion", "to summarize", "overall", "in summary", "to conclude"
]

# Common L1 Persian Transfer & Writing Error Patterns
ERROR_RULES = [
    {
        "pattern": r"\bdiscuss\s+about\b",
        "category": "grammar",
        "snippet": "discuss about",
        "suggestion": "discuss",
        "explanation_en": "The verb 'discuss' is transitive in formal English and takes a direct object without the preposition 'about'.",
        "explanation_fa": "فعل discuss در انگلیسی متعدی است و نیازی به حرف اضافه about ندارد (تداخل زبان مادری فارسی)."
    },
    {
        "pattern": r"\b(i\s+am\s+agree|we\s+are\s+agree)\b",
        "category": "grammar",
        "snippet": "am agree / are agree",
        "suggestion": "agree",
        "explanation_en": "'Agree' is a lexical verb, not an adjective. Say 'I agree' rather than 'I am agree'.",
        "explanation_fa": "واژه agree فعل است نه صفت؛ بنابراین نیازی به فعل to be (am/is/are) ندارد."
    },
    {
        "pattern": r"\bin\s+my\s+opinion\s*,\s*i\s+think\b",
        "category": "cohesion",
        "snippet": "in my opinion, I think",
        "suggestion": "in my opinion, ... OR I believe ...",
        "explanation_en": "Tautological repetition: 'In my opinion' and 'I think' express the identical function. Use either one to preserve academic conciseness.",
        "explanation_fa": "تکرار حشوآمیز: عبارت‌های in my opinion و I think دارای بار معنایی یکسان هستند. جهت حفظ ایجاز آکادمیک فقط از یکی استفاده کنید."
    },
    {
        "pattern": r"\b(make|makes|made)\s+(a\s+)?research\b",
        "category": "lexical",
        "snippet": "make research",
        "suggestion": "conduct research / carry out research",
        "explanation_en": "'Research' is an uncountable noun that collocates naturally with 'conduct', 'carry out', or 'undertake' rather than 'make'.",
        "explanation_fa": "ترکیب واژگانی (کالوکیشن): واژه research با فعل‌های conduct، carry out یا undertake همنشین می‌شود نه make."
    },
    {
        "pattern": r"\b(don't|can't|won't|isn't|aren't|doesn't|it's|they're)\b",
        "category": "grammar",
        "snippet": "contracted form (e.g. don't, can't)",
        "suggestion": "do not / cannot / will not / is not",
        "explanation_en": "Informal contraction: Academic IELTS writing requires full non-contracted forms (e.g. 'cannot', 'does not').",
        "explanation_fa": "شکل مخفف غیررسمی: در رایتینگ آکادمیک آیلتس باید صورت کامل واژگان نظیر cannot و do not نوشته شود."
    },
    {
        "pattern": r"\b(very\s+good|a\s+good\s+thing)\b",
        "category": "lexical",
        "snippet": "very good",
        "suggestion": "beneficial / advantageous / compelling / highly effective",
        "explanation_en": "Informal/generic vocabulary: Elevate lexical resource with precise academic adjectives.",
        "explanation_fa": "واژگان عمومی: برای افزایش نمره واژگان (Lexical Resource) از صفات دقیق‌تر نظیر beneficial یا advantageous استفاده کنید."
    },
    {
        "pattern": r"\b(very\s+bad)\b",
        "category": "lexical",
        "snippet": "very bad",
        "suggestion": "detrimental / adverse / deleterious",
        "explanation_en": "Informal/generic vocabulary: Replace 'very bad' with formal academic terms such as 'detrimental' or 'adverse'.",
        "explanation_fa": "واژگان عمومی: واژه very bad را با واژگان رسمی آکادمیک مانند detrimental یا adverse جایگزین کنید."
    },
    {
        "pattern": r"\bexplain\s+me\b",
        "category": "grammar",
        "snippet": "explain me",
        "suggestion": "explain to me",
        "explanation_en": "Preposition omission: 'Explain' requires the preposition 'to' before the personal indirect object.",
        "explanation_fa": "حذف حرف اضافه: فعل explain نیازمند حرف اضافه to پیش از مفعول شخصی است (explain to me)."
    },
    {
        "pattern": r"\bnowadays\b",
        "category": "lexical",
        "snippet": "nowadays",
        "suggestion": "in contemporary society / in recent years / present-day",
        "explanation_en": "Overused cliché: 'Nowadays' is heavily clichéd in candidate essays; prefer 'in contemporary society' or 'in recent years'.",
        "explanation_fa": "عبارت کلیشه‌ای: کلمه nowadays بسیار پرتکرار و کلیشه‌ای است؛ ترجیحاً از in contemporary society یا in recent years استفاده کنید."
    }
]


def extract_paragraphs(text: str) -> List[str]:
    """Splits text into meaningful paragraphs separated by newlines."""
    lines = [p.strip() for p in text.split("\n") if len(p.strip()) > 0]
    return lines


def extract_sentences(text: str) -> List[str]:
    """Splits text into sentences."""
    raw = re.split(r"[.!?]+", text)
    return [s.strip() for s in raw if len(s.strip()) > 3]


def count_words(text: str) -> int:
    """Accurately counts words in text."""
    if not text:
        return 0
    words = re.findall(r"\b[A-Za-z0-9'-]+\b", text)
    return len(words)


def analyze_task_performance(
    text: str,
    is_task_2: bool = True,
    time_seconds: int = 0
) -> Tuple[Decimal, Decimal, Decimal, Decimal, Decimal, List[Dict[str, Any]], Dict[str, Any]]:
    """
    Evaluates an IELTS Writing Task response across:
    1. Task Achievement (Task 1) or Task Response (Task 2)
    2. Coherence and Cohesion (CC)
    3. Lexical Resource (LR)
    4. Grammatical Range and Accuracy (GRA)

    Returns: (ta_or_tr, cc, lr, gra, task_band, annotations, metadata)
    """
    word_count = count_words(text)
    paragraphs = extract_paragraphs(text)
    sentences = extract_sentences(text)
    lower_text = text.lower()

    annotations: List[Dict[str, Any]] = []

    # -------------------------------------------------------------
    # 1. Task Achievement / Task Response (TA / TR)
    # -------------------------------------------------------------
    min_required_words = 250 if is_task_2 else 150
    ta_score = Decimal("6.5")

    # Word count penalty logic
    if word_count < min_required_words:
        deficit = min_required_words - word_count
        if deficit > 100:
            ta_score = Decimal("4.0")
        elif deficit > 50:
            ta_score = Decimal("5.0")
        else:
            ta_score = Decimal("5.5")
    elif word_count >= (min_required_words + 50):
        ta_score = Decimal("7.0")

    # Content checks:
    # Task 1 must have an overview
    if not is_task_2:
        has_overview = any(
            marker in lower_text
            for marker in ["overall", "in summary", "it is evident", "a notable trend", "the most significant"]
        )
        if not has_overview and word_count >= 100:
            ta_score = min(ta_score, Decimal("5.0"))
            annotations.append({
                "task": 1,
                "snippet": "Overview section",
                "category": "task_response",
                "suggestion": "Include a clear overview paragraph summarizing major trends (e.g. 'Overall, it is evident that...')",
                "explanation_en": "Official Band Descriptors stipulate that Task 1 without a clear overview cannot exceed Band 5.0 in Task Achievement.",
                "explanation_fa": "بر اساس توصیف‌گر رسمی آیلتس، تسک ۱ بدون بند نمای کلی (Overview) نمی‌تواند نمره‌ای بالاتر از ۵.۰ در Task Achievement دریافت کند."
            })
        elif has_overview and ta_score >= Decimal("6.0"):
            ta_score = min(Decimal("9.0"), ta_score + Decimal("0.5"))
    else:
        # Task 2: clear thesis & conclusion
        has_conclusion = any(
            marker in lower_text
            for marker in ["in conclusion", "to conclude", "in summary", "to sum up"]
        )
        has_balanced_discussion = any(
            marker in lower_text
            for marker in ["on the other hand", "however", "conversely", "in contrast", "opponents argue", "others believe"]
        )
        if not has_conclusion and word_count >= 150:
            ta_score = min(ta_score, Decimal("5.5"))
            annotations.append({
                "task": 2,
                "snippet": "Conclusion paragraph",
                "category": "task_response",
                "suggestion": "Add a clear concluding paragraph restating your final position.",
                "explanation_en": "A complete Task 2 essay must feature a definitive conclusion summarizing core arguments and thesis.",
                "explanation_fa": "مقاله تحلیلی تسک ۲ باید دارای بند نتیجه‌گیری مشخصی باشد که موضع نهایی نویسنده را جمع‌بندی نماید."
            })
        if has_balanced_discussion and has_conclusion and word_count >= 250:
            ta_score = min(Decimal("8.5"), ta_score + Decimal("0.5"))

    # -------------------------------------------------------------
    # 2. Coherence and Cohesion (CC)
    # -------------------------------------------------------------
    cc_score = Decimal("6.0")

    # Paragraphing structure
    num_paras = len(paragraphs)
    if num_paras < 2 and word_count > 80:
        cc_score = Decimal("4.5")
        annotations.append({
            "task": 2 if is_task_2 else 1,
            "snippet": "Paragraph formatting",
            "category": "cohesion",
            "suggestion": "Divide your writing into 3 to 5 logical paragraphs (Introduction, Body Paragraphs, Conclusion).",
            "explanation_en": "Writing as a single monolithic block prevents coherent paragraph progression and severely limits Coherence and Cohesion.",
            "explanation_fa": "نوشتن متن به صورت یکپارچه و بدون پاراگراف‌بندی مشخص، نمره پیوستگی و انسجام (CC) را به زیر ۵.۰ کاهش می‌دهد."
        })
    elif num_paras in [3, 4, 5]:
        cc_score = Decimal("6.5")

    # Transition markers
    found_connectors = [conn for conn in COHESIVE_CONNECTORS if conn in lower_text]
    connector_variety = len(set(found_connectors))

    if connector_variety >= 4:
        cc_score = min(Decimal("8.5"), cc_score + Decimal("0.5"))
    elif connector_variety <= 1 and word_count >= 150:
        cc_score = min(cc_score, Decimal("5.5"))

    # -------------------------------------------------------------
    # 3. Lexical Resource (LR)
    # -------------------------------------------------------------
    lr_score = Decimal("6.0")
    all_words = re.findall(r"\b[a-z]+\b", lower_text)
    unique_words = set(all_words)
    total_w = max(1, len(all_words))

    # Type-Token Ratio
    ttr = len(unique_words) / total_w
    awl_matches = unique_words.intersection(ACADEMIC_WORD_LIST)
    awl_count = len(awl_matches)

    if awl_count >= 12 and ttr >= 0.45:
        lr_score = Decimal("7.5")
    elif awl_count >= 7 and ttr >= 0.40:
        lr_score = Decimal("6.5")
    elif awl_count < 3 or ttr < 0.35:
        lr_score = Decimal("5.0")

    # -------------------------------------------------------------
    # 4. Grammatical Range and Accuracy (GRA)
    # -------------------------------------------------------------
    gra_score = Decimal("6.0")

    # Complex clauses detection
    complex_markers = ["although", "whereas", "while", "since", "because", "unless", "provided that", "which", "whose"]
    complex_count = sum(lower_text.count(marker) for marker in complex_markers)

    # Passive voice detection
    passive_matches = len(re.findall(r"\b(is|are|was|were|been|being)\s+([a-z]+ed|[a-z]+en)\b", lower_text))

    if complex_count >= 4 and passive_matches >= 2:
        gra_score = Decimal("7.0")
    elif complex_count >= 2:
        gra_score = Decimal("6.5")
    else:
        gra_score = Decimal("5.5")

    # Error checking across rules
    error_count = 0
    for rule in ERROR_RULES:
        if re.search(rule["pattern"], text, re.IGNORECASE):
            error_count += 1
            annotations.append({
                "task": 2 if is_task_2 else 1,
                "snippet": rule["snippet"],
                "category": rule["category"],
                "suggestion": rule["suggestion"],
                "explanation_en": rule["explanation_en"],
                "explanation_fa": rule["explanation_fa"],
            })

    if error_count >= 4:
        gra_score = max(Decimal("4.5"), gra_score - Decimal("1.0"))
        lr_score = max(Decimal("5.0"), lr_score - Decimal("0.5"))
    elif error_count >= 2:
        gra_score = max(Decimal("5.0"), gra_score - Decimal("0.5"))

    # Cap band by overall scale
    task_band = round_to_ielts_half_band((ta_score + cc_score + lr_score + gra_score) / Decimal("4.0"))

    metadata = {
        "word_count": word_count,
        "paragraph_count": num_paras,
        "sentence_count": len(sentences),
        "awl_word_count": awl_count,
        "type_token_ratio": round(ttr, 2),
        "cohesive_connectors_used": found_connectors,
        "error_count": error_count,
    }

    return ta_score, cc_score, lr_score, gra_score, task_band, annotations, metadata


def evaluate_ielts_writing_submission(
    task1_text: str = "",
    task2_text: str = "",
    task1_time_seconds: int = 0,
    task2_time_seconds: int = 0,
) -> Dict[str, Any]:
    """
    Evaluates full writing attempt combining Task 1 and Task 2.
    Applies the official IELTS weighting rule:
    Composite Band = round_to_ielts_half_band((Task 1 Band + 2 * Task 2 Band) / 3)
    """
    has_t1 = bool(task1_text and len(task1_text.strip()) > 10)
    has_t2 = bool(task2_text and len(task2_text.strip()) > 10)

    all_annotations: List[Dict[str, Any]] = []
    pedagogical_advice: List[str] = []

    t1_scores: Dict[str, Any] = {}
    t2_scores: Dict[str, Any] = {}

    if has_t1:
        ta, cc, lr, gra, t1_band, t1_ann, t1_meta = analyze_task_performance(
            task1_text, is_task_2=False, time_seconds=task1_time_seconds
        )
        t1_scores = {
            "ta": float(ta),
            "cc": float(cc),
            "lr": float(lr),
            "gra": float(gra),
            "band": float(t1_band),
            "metadata": t1_meta,
        }
        all_annotations.extend(t1_ann)
    else:
        t1_scores = {"ta": 0.0, "cc": 0.0, "lr": 0.0, "gra": 0.0, "band": 0.0, "metadata": {}}

    if has_t2:
        tr, cc, lr, gra, t2_band, t2_ann, t2_meta = analyze_task_performance(
            task2_text, is_task_2=True, time_seconds=task2_time_seconds
        )
        t2_scores = {
            "tr": float(tr),
            "cc": float(cc),
            "lr": float(lr),
            "gra": float(gra),
            "band": float(t2_band),
            "metadata": t2_meta,
        }
        all_annotations.extend(t2_ann)
    else:
        t2_scores = {"tr": 0.0, "cc": 0.0, "lr": 0.0, "gra": 0.0, "band": 0.0, "metadata": {}}

    # Compute official composite score
    if has_t1 and has_t2:
        t1_b = Decimal(str(t1_scores["band"]))
        t2_b = Decimal(str(t2_scores["band"]))
        # Task 2 is weighted 2/3, Task 1 is 1/3
        composite_raw = (t1_b + Decimal("2.0") * t2_b) / Decimal("3.0")
        overall_band = round_to_ielts_half_band(composite_raw)
    elif has_t2:
        overall_band = Decimal(str(t2_scores["band"]))
    elif has_t1:
        overall_band = Decimal(str(t1_scores["band"]))
    else:
        overall_band = Decimal("0.0")

    # Range and Uncertainty (Confidence Interval)
    band_min = max(Decimal("1.0"), overall_band - Decimal("0.5"))
    band_max = min(Decimal("9.0"), overall_band + Decimal("0.5"))
    confidence = Decimal("0.88")

    # CEFR mapping
    cefr_data = map_band_to_cefr(overall_band)
    cefr_level = cefr_data["level"]

    # Pedagogical advice compilation
    if has_t1 and t1_scores.get("metadata", {}).get("word_count", 0) < 150:
        pedagogical_advice.append("در تسک ۱ تعداد کلمات شما کمتر از حد نصاب ۱۵۰ کلمه است. کمبود کلمات منجر به کسر نمره قطعی در Task Achievement می‌شود.")

    if has_t2 and t2_scores.get("metadata", {}).get("word_count", 0) < 250:
        pedagogical_advice.append("در تسک ۲ تعداد کلمات به حد نصاب ۲۵۰ کلمه نرسیده است. برای حفظ نمره باند بالاتر از ۶.۰، حتماً بسط ایده‌ها و نتیجه‌گیری کامل را رعایت کنید.")

    if len(all_annotations) > 0:
        pedagogical_advice.append("بررسی نکات درون‌متنی: برای بهبود نمره گرامر و واژگان، اصلاحات املایی و جایگزینی عبارات آکادمیک در بخش تحلیل بندها را مرور نمایید.")

    if has_t2 and t2_scores.get("lr", 0) < 6.5:
        pedagogical_advice.append("ارتقای واژگان آکادمیک: استفاده از کالوکیشن‌های آکادمیک (AWL) و پرهیز از واژگان بسیار عامیانه نظیر 'good' و 'bad' به پیشرفت به باند ۷.۰ کمک شایانی خواهد کرد.")

    if has_t1 and t1_scores.get("cc", 0) >= 6.5:
        pedagogical_advice.append("نقطه قوت: انسجام و پیوستگی ایده‌ها در توصیف نمودار بسیار منظم و منطبق بر استانداردهای گزارش‌نویسی آیلتس بوده است.")

    criteria_breakdown = {
        "task_achievement_or_response": {
            "score": t2_scores.get("tr", t1_scores.get("ta", 0)),
            "descriptor_en": "Addresses all parts of the task with a well-developed response and supported main ideas.",
            "guidance_fa": "پوشش جامع تمام ابعاد صورت سوال، تبیین شفاف موضع و ارائه شواهد و مثال‌های منطقی.",
        },
        "coherence_and_cohesion": {
            "score": round((t1_scores.get("cc", 6.0) + t2_scores.get("cc", 6.0)) / 2, 1) if (has_t1 and has_t2) else t2_scores.get("cc", t1_scores.get("cc", 0)),
            "descriptor_en": "Information and ideas are logically organized with clear progression throughout.",
            "guidance_fa": "سازمان‌بندی منطقی پاراگراف‌ها و استفاده متوازن از کلمات ربط و پیش‌برنده بحث.",
        },
        "lexical_resource": {
            "score": round((t1_scores.get("lr", 6.0) + t2_scores.get("lr", 6.0)) / 2, 1) if (has_t1 and has_t2) else t2_scores.get("lr", t1_scores.get("lr", 0)),
            "descriptor_en": "Uses an adequate to wide range of vocabulary with academic precision and awareness of collocation.",
            "guidance_fa": "تنوع مناسب لغات آکادمیک، رعایت هم‌آیی واژگان و پرهیز از خطاهای فاحش املایی.",
        },
        "grammatical_range_and_accuracy": {
            "score": round((t1_scores.get("gra", 6.0) + t2_scores.get("gra", 6.0)) / 2, 1) if (has_t1 and has_t2) else t2_scores.get("gra", t1_scores.get("gra", 0)),
            "descriptor_en": "Demonstrates a blend of simple and complex sentence structures with good grammatical control.",
            "guidance_fa": "کاربرد متنوع جملات مرکب و مجهول هم‌زمان با کنترل و دقت ساختاری مناسب.",
        }
    }

    return {
        "overall_band": float(overall_band),
        "overall_band_min": float(band_min),
        "overall_band_max": float(band_max),
        "confidence_score": float(confidence),
        "cefr_level": cefr_level,
        "task1_scores": t1_scores,
        "task2_scores": t2_scores,
        "criteria_breakdown": criteria_breakdown,
        "annotations": all_annotations,
        "pedagogical_advice": pedagogical_advice,
    }
