import json
import logging
from pathlib import Path
from typing import Any, Dict, List, Optional

from django.conf import settings
from django.utils import timezone

from mistake_genome.services import MistakeGenomeService
from srs.models import SrsItem

from .models import RoleplayMessage, RoleplayReport, RoleplaySession

logger = logging.getLogger(__name__)

PROMPT_INJECTION_KEYWORDS = [
    "ignore previous instructions",
    "ignore all instructions",
    "ignore above",
    "disregard all",
    "disregard previous",
    "system prompt",
    "reveal your instructions",
    "reveal instructions",
    "reveal system prompt",
    "tell me your system prompt",
    "tell me your instructions",
    "jailbreak",
    "dan mode",
    "developer mode",
    "act as an unrestricted",
    "bypass filter",
    "tell me your rules",
    "override instructions",
]

COMMON_MISTAKE_PATTERNS = [
    {
        "id": "mst_agree",
        "detect": ["i am agree", "i'm agree"],
        "tag": "grammar.stative_verb",
        "title_en": "Stative Verb Collocation ('agree')",
        "title_fa": "استفاده نادرست از فعل 'agree' با فعل to be",
        "original": "I am agree",
        "corrected": "I agree",
        "explanation_en": "In English, 'agree' is already a verb; do not use 'am agree'.",
        "explanation_fa": "در زبان انگلیسی agree خود فعل است و نیازی به am ندارد؛ بگویید I agree.",
    },
    {
        "id": "mst_went",
        "detect": ["have went", "has went"],
        "tag": "grammar.irregular_participle",
        "title_en": "Present Perfect Participle ('gone' vs 'went')",
        "title_fa": "استفاده از شکل گذشته به جای اسم مفعول در زمان کامل",
        "original": "have went",
        "corrected": "have gone",
        "explanation_en": "The past participle of 'go' is 'gone', used with have/has.",
        "explanation_fa": "شکل سوم (اسم مفعول) فعل go کلمه gone است: have gone.",
    },
    {
        "id": "mst_explain_me",
        "detect": ["explain me"],
        "tag": "grammar.preposition_dative",
        "title_en": "Preposition with 'Explain'",
        "title_fa": "حرف اضافه همراه با فعل explain",
        "original": "explain me",
        "corrected": "explain to me",
        "explanation_en": "'Explain' requires the preposition 'to' before the person receiving the explanation.",
        "explanation_fa": "فعل explain به حرف اضافه to نیاز دارد: explain to me.",
    },
    {
        "id": "mst_informations",
        "detect": ["informations"],
        "tag": "grammar.uncountable_noun",
        "title_en": "Uncountable Noun ('information')",
        "title_fa": "جمع بستن اسم غیرقابل شمارش information",
        "original": "informations",
        "corrected": "information",
        "explanation_en": "'Information' is an uncountable noun in English and never takes a plural 's'.",
        "explanation_fa": "واژه information غیرقابل شمارش است و هیچ‌گاه جمع بسته نمی‌شود.",
    },
    {
        "id": "mst_depend_of",
        "detect": ["depend of", "depends of"],
        "tag": "grammar.dependent_preposition",
        "title_en": "Preposition with 'Depend'",
        "title_fa": "حرف اضافه همراه با فعل depend",
        "original": "depend of",
        "corrected": "depend on",
        "explanation_en": "The correct collocation is 'depend on' or 'depend upon', not 'depend of'.",
        "explanation_fa": "حرف اضافه صحیح برای فعل depend کلمه on است: it depends on...",
    },
    {
        "id": "mst_listen_me",
        "detect": ["listen me"],
        "tag": "grammar.preposition_collocation",
        "title_en": "Preposition with 'Listen'",
        "title_fa": "حرف اضافه همراه با فعل listen",
        "original": "listen me",
        "corrected": "listen to me",
        "explanation_en": "'Listen' takes the preposition 'to' when followed by an object.",
        "explanation_fa": "فعل listen هنگام داشتن مفعول به حرف اضافه to نیاز دارد: listen to me.",
    },
    {
        "id": "mst_look_forward",
        "detect": ["look forward to meet", "looking forward to meet"],
        "tag": "grammar.gerund_after_to",
        "title_en": "Gerund after 'Look Forward To'",
        "title_fa": "کاربرد اسم مصدر (ing) بعد از look forward to",
        "original": "look forward to meet",
        "corrected": "look forward to meeting",
        "explanation_en": "'Look forward to' is followed by a gerund (-ing form), not base infinitive.",
        "explanation_fa": "عبارت look forward to نیازمند اسم مصدر با ing است: look forward to meeting.",
    },
]


class RoleplayService:
    """
    Core business logic engine for the Endoora Text-Based Roleplay Universe v1.
    """

    _scenarios_cache: Optional[Dict[str, Dict[str, Any]]] = None

    @classmethod
    def _find_scenarios_dir(cls) -> Path:
        """Locates the data/scenarios directory reliably."""
        candidates = []
        repo_root = getattr(settings, "REPO_ROOT", None)
        if repo_root:
            candidates.append(Path(repo_root) / "data" / "scenarios")

        candidates.extend([
            Path(__file__).resolve().parents[3] / "data" / "scenarios",
            Path("data/scenarios").resolve(),
        ])

        for c in candidates:
            resolved = c.resolve()
            if resolved.is_dir():
                return resolved
        return (Path(__file__).resolve().parents[3] / "data" / "scenarios").resolve()

    @classmethod
    def get_scenarios(cls, reload: bool = False) -> List[Dict[str, Any]]:
        """Loads and returns all scenario specifications."""
        if cls._scenarios_cache is not None and not reload:
            return list(cls._scenarios_cache.values())

        scenarios_dir = cls._find_scenarios_dir()
        scenarios: Dict[str, Dict[str, Any]] = {}

        if scenarios_dir.is_dir():
            for filepath in sorted(scenarios_dir.glob("*.json")):
                try:
                    with open(filepath, "r", encoding="utf-8") as f:
                        data = json.load(f)
                        scenario_id = data.get("id")
                        if scenario_id:
                            scenarios[scenario_id] = data
                except Exception as exc:
                    logger.error("Failed to load scenario %s: %s", filepath, exc)

        cls._scenarios_cache = scenarios
        return list(scenarios.values())

    @classmethod
    def get_scenario(cls, scenario_id: str) -> Optional[Dict[str, Any]]:
        """Gets a scenario by its unique identifier."""
        scenarios = cls.get_scenarios()
        for sc in scenarios:
            if sc.get("id") == scenario_id:
                return sc
        return None

    def start_or_resume_session(self, learner, scenario_id: str) -> RoleplaySession:
        """
        Starts a new roleplay session or resumes an active one.
        Initializes the scenario character greeting if new.
        """
        scenario = self.get_scenario(scenario_id)
        if not scenario:
            raise ValueError(f"Scenario '{scenario_id}' not found.")

        # Find existing active session
        session = (
            RoleplaySession.objects.filter(
                learner=learner,
                scenario_id=scenario_id,
                status="active",
            )
            .order_by("-updated_at")
            .first()
        )

        if not session:
            max_turns = scenario.get("max_turns", 10)
            session = RoleplaySession.objects.create(
                learner=learner,
                scenario_id=scenario_id,
                scenario_title=scenario.get("title_en", scenario_id),
                status="active",
                turn_count=0,
                max_turns=max_turns,
                goals_completed=[],
                xp_awarded=False,
            )
            # Create character initial greeting
            char_name = scenario.get("character", {}).get("name_en", "Assistant")
            initial_text = scenario.get(
                "initial_message_en",
                "Hello! Let us begin our scenario practice.",
            )
            RoleplayMessage.objects.create(
                session=session,
                sender="character",
                sender_name=char_name,
                content=initial_text,
            )

        return session

    def send_message(
        self,
        learner,
        session_id: int,
        user_text: str,
    ) -> Dict[str, Any]:
        """
        Processes a learner turn:
        1. Enforces max length (500 chars) and turn limits.
        2. Detects prompt injection attempts and handles them gracefully in-character.
        3. Maintains character immersion: NEVER interrupts with mid-turn grammar corrections.
        4. Evaluates completed goals.
        5. Generates the in-character dialogue continuation.
        6. If max turns reached or goals satisfied, finalizes session with report & XP.
        """
        session = RoleplaySession.objects.get(id=session_id, learner=learner)
        scenario = self.get_scenario(session.scenario_id)
        if not scenario:
            raise ValueError(f"Scenario '{session.scenario_id}' not found.")

        if session.status == "completed":
            report = getattr(session, "report", None)
            if not report:
                report = self.create_report(session)
            return {
                "session_status": "completed",
                "character_message": "This scenario has already concluded. Please review your post-conversation report!",
                "turn_count": session.turn_count,
                "max_turns": session.max_turns,
                "goals_completed": session.goals_completed,
                "report_ready": True,
            }

        # Bounded token usage: cap message length at 500 characters
        clean_text = user_text.strip()[:500]
        if not clean_text:
            raise ValueError("Message cannot be empty.")

        # Persist learner message
        learner_msg = RoleplayMessage.objects.create(
            session=session,
            sender="learner",
            sender_name="Learner",
            content=clean_text,
        )

        session.turn_count += 1

        # Check for prompt injection attempts
        lower_input = clean_text.lower()
        is_injection = any(keyword in lower_input for keyword in PROMPT_INJECTION_KEYWORDS)

        # Evaluate scenario goals
        goals = scenario.get("goals", [])
        completed_goal_ids = set(session.goals_completed)
        newly_completed = []

        for g in goals:
            g_id = g.get("id")
            if g_id not in completed_goal_ids:
                keywords = g.get("keywords", [])
                if any(kw.lower() in lower_input for kw in keywords):
                    completed_goal_ids.add(g_id)
                    newly_completed.append(g_id)

        session.goals_completed = list(completed_goal_ids)

        char_info = scenario.get("character", {})
        char_name = char_info.get("name_en", "Assistant")

        # Determine character response
        if is_injection:
            # Maintain persona; politely decline injection and redirect without exposing prompts
            character_reply = self._generate_in_character_redirection(scenario, clean_text)
        else:
            # Advance dialogue naturally in-character without mid-turn corrections
            character_reply = self._generate_in_character_reply(
                scenario=scenario,
                clean_text=clean_text,
                session=session,
                all_goals_done=(len(completed_goal_ids) >= len(goals)),
            )

        # Check completion condition: all goals achieved OR max turns reached
        is_now_complete = (
            len(completed_goal_ids) >= len(goals)
            or session.turn_count >= session.max_turns
        )

        if is_now_complete and session.status != "completed":
            session.status = "completed"
            closing = f" [Scenario Complete! Excellent conversation practice.]"
            character_reply += closing

        # Persist character reply
        char_msg = RoleplayMessage.objects.create(
            session=session,
            sender="character",
            sender_name=char_name,
            content=character_reply,
        )

        session.save(update_fields=["turn_count", "goals_completed", "status", "updated_at"])

        report_data = None
        if session.status == "completed":
            report = self.create_report(session)
            report_data = {
                "score": report.communicative_score,
                "xp_earned": report.xp_earned,
                "cefr": report.estimated_cefr,
            }

        return {
            "session_status": session.status,
            "character_message": character_reply,
            "character_name": char_name,
            "turn_count": session.turn_count,
            "max_turns": session.max_turns,
            "goals_completed": session.goals_completed,
            "report_ready": session.status == "completed",
            "report_summary": report_data,
        }

    def _generate_in_character_redirection(
        self,
        scenario: Dict[str, Any],
        user_input: str,
    ) -> str:
        """Keeps character strictly in-character when an injection attempt is made."""
        sc_id = scenario.get("id", "")
        char_name = scenario.get("character", {}).get("name_en", "Assistant")

        redirections = {
            "airport": f"{char_name}: Let's keep our focus on your passport and the official purpose of your trip to the UK.",
            "hotel": f"{char_name}: I'd be happy to assist you with your hotel accommodation and reservation details. Could we return to your stay?",
            "restaurant": f"{char_name}: Let us focus on your order this evening! Would you like to hear about our house specialties or drinks?",
            "shopping": f"{char_name}: I can certainly assist you with returning or exchanging this item. Do you have the receipt handy?",
            "travel": f"{char_name}: I'm right here to guide your transit route! Where are you trying to go on the subway?",
            "university": f"{char_name}: As your academic advisor, I want to ensure your course enrollment goes smoothly. Let's look at your syllabus options.",
            "job_interview": f"{char_name}: Let's direct our attention back to your technical experience and past engineering projects.",
            "business": f"{char_name}: As product lead, I need us to stay focused on our delivery timeline and sprint scope.",
            "friendly_chat": f"{char_name}: Haha, anyway! Let's get back to what we were talking about. How's everything else going?",
            "ielts_speaking": f"{char_name}: In this speaking test, we must adhere to our environmental discussion topic. Let us proceed.",
        }
        return redirections.get(
            sc_id,
            f"{char_name}: Let's stay focused on our conversation topic and continue our discussion.",
        )

    def _generate_in_character_reply(
        self,
        scenario: Dict[str, Any],
        clean_text: str,
        session: RoleplaySession,
        all_goals_done: bool,
    ) -> str:
        """
        Generates in-character dialog advancing the scenario immersion.
        Zero mid-turn grammar corrections!
        """
        char_name = scenario.get("character", {}).get("name_en", "Assistant")
        sc_id = scenario.get("id", "")
        turn = session.turn_count

        if all_goals_done:
            closings = {
                "airport": f"{char_name}: Everything looks perfectly in order. Here is your passport. Welcome to the United Kingdom, enjoy your stay!",
                "hotel": f"{char_name}: Perfect! Here are your room keys for room 402 on the quiet side. Breakfast is on us. Enjoy your stay with us!",
                "restaurant": f"{char_name}: Wonderful choice! I will place your order with the kitchen immediately. Your meal will be served shortly.",
                "shopping": f"{char_name}: That is sorted out for you. We have exchanged the item for size Large, and here is your updated receipt. Have a great day!",
                "travel": f"{char_name}: You're all set! Take the yellow line from platform 2 and you'll arrive right at the gallery entrance. Safe travels!",
                "university": f"{char_name}: Excellent plan. That balances your research requirements with manageable coursework. I've approved your registration!",
                "job_interview": f"{char_name}: Thank you for sharing such concrete insights. That gives our hiring committee a very clear picture. We'll be in touch soon!",
                "business": f"{char_name}: We have consensus. Phasing the core release first mitigates our risk while satisfying stakeholder urgency. Let's align the team.",
                "friendly_chat": f"{char_name}: Sounds like an awesome plan! Let's definitely do that this weekend. Can't wait to catch up more!",
                "ielts_speaking": f"{char_name}: Thank you very much. That concludes the speaking interview. You demonstrated structured argumentation throughout.",
            }
            return closings.get(sc_id, f"{char_name}: Thank you for having this conversation. Everything is resolved!")

        # Dynamic turn-based conversational reactions based on scenario
        dialogue_trees = {
            "airport": [
                f"{char_name}: Understood. And where will you be staying during your time here? Do you have hotel or residential arrangements?",
                f"{char_name}: Thank you. Could you also confirm the date of your departure or show proof of your return flight ticket?",
                f"{char_name}: I see. Are you carrying any commercial goods, plants, or currency exceeding the standard customs limits?",
            ],
            "hotel": [
                f"{char_name}: Thank you for confirming that. Would you prefer a room with a king bed or two twins, and do you require a high-floor view?",
                f"{char_name}: Certainly, I have noted that down. Would you like a wake-up call scheduled or assistance with your luggage?",
                f"{char_name}: Breakfast is served daily from 7:00 to 10:30 AM in the atrium. Let me finalize your room key card.",
            ],
            "restaurant": [
                f"{char_name}: Excellent choice. For the main dish, would you like our homemade truffle fettuccine or the wood-fired sea bass?",
                f"{char_name}: Duly noted! Do you or anyone in your party have any allergies to nuts, shellfish, or gluten?",
                f"{char_name}: Fantastic. Would you also care to see our dessert menu or perhaps an espresso to finish?",
            ],
            "shopping": [
                f"{char_name}: I see the issue with the zipper. Do you happen to have the store receipt or your order number with you?",
                f"{char_name}: Thank you. Would you like us to look for the exact same style in a larger size, or do you prefer a refund back to your payment card?",
                f"{char_name}: Let me quickly inspect the inventory in the back for that size. One moment please.",
            ],
            "travel": [
                f"{char_name}: To reach that destination, you will want Line 1 heading southbound. Do you have a PRESTO transit card or will you tap contactless?",
                f"{char_name}: That works seamlessly. When you get to the central hub, remember to follow the transfer signs to Platform 3.",
                f"{char_name}: Trains run every 4 minutes, so you won't have to wait long. Is there anything else about the route I can clarify?",
            ],
            "university": [
                f"{char_name}: That seminar covers cutting-edge material. Have you completed the foundational methodology prerequisite last term?",
                f"{char_name}: Great. Keep in mind the weekly readings are fairly demanding. How many total credit hours are you targeting this semester?",
                f"{char_name}: Sounds like a rigorous yet balanced schedule. Let's ensure you submit the add/drop form before the Friday deadline.",
            ],
            "job_interview": [
                f"{char_name}: That sounds like a significant challenge. How did you coordinate with other teams or stakeholders while resolving that?",
                f"{char_name}: What key metrics or testing procedures did you establish to confirm the system stayed reliable under production traffic?",
                f"{char_name}: That highlights strong ownership. Do you have any questions for me about our architectural roadmap or team dynamics?",
            ],
            "business": [
                f"{char_name}: That timeline is tight. What trade-offs or scope cuts would you recommend to keep the deployment stable?",
                f"{char_name}: If we split the release into Phase 1 core features and Phase 2 enhancements, would that protect our QA window?",
                f"{char_name}: Let's document this agreed milestone so the product and engineering teams are completely in sync.",
            ],
            "friendly_chat": [
                f"{char_name}: Wow, that sounds really interesting! How has that been treating you lately?",
                f"{char_name}: Totally get that. What are you looking forward to doing most once things calm down?",
                f"{char_name}: We definitely need to make time for that! Let's check our calendars later today.",
            ],
            "ielts_speaking": [
                f"{char_name}: Interesting perspective. How do you believe government regulations can balance economic growth with environmental conservation?",
                f"{char_name}: In what ways might public awareness and individual consumer habits influence these environmental outcomes in the coming decade?",
                f"{char_name}: Could you contrast the effectiveness of technological solutions versus strict environmental legislation?",
            ],
        }

        tree = dialogue_trees.get(sc_id, [
            f"{char_name}: I understand your point. Could you tell me a little more about your perspective on that?",
            f"{char_name}: That makes sense in this situation. How would you like to conclude our arrangement?",
        ])

        idx = (turn - 1) % len(tree)
        return tree[idx]

    def get_hint(self, learner, session_id: int) -> Dict[str, str]:
        """Returns a pedagogical phrasing hint to help the learner unblock their turn."""
        session = RoleplaySession.objects.get(id=session_id, learner=learner)
        scenario = self.get_scenario(session.scenario_id)
        if not scenario:
            return {
                "hint_en": "Try answering the character's last question clearly and directly.",
                "hint_fa": "سعی کنید به آخرین سوال شخصیت به طور مستقیم و شفاف پاسخ دهید.",
            }

        goals = scenario.get("goals", [])
        completed = set(session.goals_completed)
        uncompleted = [g for g in goals if g.get("id") not in completed]

        if uncompleted:
            target_goal = uncompleted[0]
            desc_en = target_goal.get("description_en", "")
            desc_fa = target_goal.get("description_fa", "")
            prompts = scenario.get("suggested_prompts", [])
            suggested = prompts[0] if prompts else "State your requirement clearly."
            return {
                "hint_en": f"Goal: {desc_en}. Example: \"{suggested}\"",
                "hint_fa": f"هدف: {desc_fa}",
            }

        prompts = scenario.get("suggested_prompts", [])
        sample = prompts[-1] if prompts else "Thank you for your assistance."
        return {
            "hint_en": f"Wrap up the conversation: \"{sample}\"",
            "hint_fa": "مکالمه را با تشکر و جمع‌بندی به پایان برسانید.",
        }

    def create_report(self, session: RoleplaySession) -> RoleplayReport:
        """
        Builds the deferred post-conversation diagnostic report.
        Strict anti-exploit rule: awards XP only once per session.
        """
        scenario = self.get_scenario(session.scenario_id) or {}
        goals = scenario.get("goals", [])
        total_goals = len(goals)
        achieved_goals = len(session.goals_completed)

        # 1. Accomplishments
        accomplishments_en = []
        accomplishments_fa = []
        completed_set = set(session.goals_completed)
        for g in goals:
            if g.get("id") in completed_set:
                accomplishments_en.append(g.get("description_en", "Achieved conversational goal"))
                accomplishments_fa.append(g.get("description_fa", "دستیابی به هدف مکالمه"))

        if not accomplishments_en:
            accomplishments_en.append("Participated actively in realistic situational dialogue.")
            accomplishments_fa.append("مشارکت فعال در مکالمه واقعی سناریو.")

        # 2. Deferred error analysis across learner messages
        learner_msgs = session.messages.filter(sender="learner").order_by("timestamp")
        combined_text = " ".join(m.content for m in learner_msgs).lower()

        detected_mistakes = []
        for idx, rule in enumerate(COMMON_MISTAKE_PATTERNS, start=1):
            if any(pattern in combined_text for pattern in rule["detect"]):
                detected_mistakes.append({
                    "id": f"mst_{idx}_{rule['id']}",
                    "tag": rule["tag"],
                    "title_en": rule["title_en"],
                    "title_fa": rule["title_fa"],
                    "original": rule["original"],
                    "corrected": rule["corrected"],
                    "explanation_en": rule["explanation_en"],
                    "explanation_fa": rule["explanation_fa"],
                    "accepted": False,
                })

        # 3. Target vocabulary extraction from scenario
        vocab_items = []
        for v in scenario.get("target_vocabulary", []):
            vocab_items.append({
                "word": v.get("word", ""),
                "lemma": v.get("word", "").lower(),
                "definition": v.get("definition", ""),
                "meaning_fa": v.get("meaning_fa", ""),
                "level": v.get("level", "B1"),
                "saved_to_srs": False,
            })

        # 4. Communicative score calculation
        goal_ratio = (achieved_goals / total_goals) if total_goals > 0 else 1.0
        base_score = 70 + int(goal_ratio * 25)
        # Deduct minor points for detected mistakes, minimum 60, maximum 98
        final_score = max(60, min(98, base_score - (len(detected_mistakes) * 3)))

        # 5. Anti-exploit XP check: XP is strictly awarded ONCE per completed session
        xp_to_award = 50
        if not session.xp_awarded:
            session.xp_awarded = True
            session.save(update_fields=["xp_awarded"])
        else:
            xp_to_award = 0

        report, _ = RoleplayReport.objects.update_or_create(
            session=session,
            defaults={
                "goals_achieved_count": achieved_goals,
                "total_goals_count": total_goals,
                "communicative_score": final_score,
                "estimated_cefr": scenario.get("level", "B1"),
                "accomplishments_en": accomplishments_en,
                "accomplishments_fa": accomplishments_fa,
                "feedback_mistakes": detected_mistakes,
                "vocabulary_extracted": vocab_items,
                "xp_earned": 50,  # Displays static 50 XP badge for completing the session
            },
        )
        return report

    def accept_mistake(
        self,
        learner,
        session_id: int,
        mistake_id: str,
    ) -> RoleplayReport:
        """
        Accepts a deferred grammatical feedback item from the report and syncs
        it into the learner's Mistake Genome profile.
        """
        session = RoleplaySession.objects.get(id=session_id, learner=learner)
        report = session.report

        target_mistake = None
        updated_mistakes = []
        for m in report.feedback_mistakes:
            if m.get("id") == mistake_id:
                m["accepted"] = True
                target_mistake = m
            updated_mistakes.append(m)

        if target_mistake:
            report.feedback_mistakes = updated_mistakes
            report.save(update_fields=["feedback_mistakes"])

            # Integrate with Mistake Genome Service
            try:
                genome_service = MistakeGenomeService()
                genome_service.record_mistake(
                    learner=learner,
                    tag=target_mistake.get("tag", "grammar.roleplay"),
                    category="grammar",
                    title_fa=target_mistake.get("title_fa", ""),
                    title_en=target_mistake.get("title_en", ""),
                    source_activity="roleplay",
                    raw_snippet=target_mistake.get("original", ""),
                    correction_snippet=target_mistake.get("corrected", ""),
                    explanation_fa=target_mistake.get("explanation_fa", ""),
                    explanation_en=target_mistake.get("explanation_en", ""),
                    source_id=f"roleplay-{session.id}",
                )
            except Exception as exc:
                logger.error("Failed to record mistake to Mistake Genome: %s", exc)

        return report

    def save_srs_word(
        self,
        learner,
        session_id: int,
        lemma: str,
    ) -> RoleplayReport:
        """
        Saves an extracted target vocabulary word from the report directly
        into the learner's active SRS deck.
        """
        session = RoleplaySession.objects.get(id=session_id, learner=learner)
        report = session.report

        normalized_lemma = lemma.strip().lower()
        target_vocab = None
        updated_vocab = []

        for v in report.vocabulary_extracted:
            if v.get("lemma", "").lower() == normalized_lemma or v.get("word", "").lower() == normalized_lemma:
                v["saved_to_srs"] = True
                target_vocab = v
            updated_vocab.append(v)

        if target_vocab:
            report.vocabulary_extracted = updated_vocab
            report.save(update_fields=["vocabulary_extracted"])

            # Create or ensure SrsItem in learner's deck
            try:
                SrsItem.objects.get_or_create(
                    learner=learner,
                    lemma=normalized_lemma,
                    defaults={
                        "term": target_vocab.get("word", normalized_lemma),
                        "meaning_fa": target_vocab.get("meaning_fa", target_vocab.get("definition", "")),
                        "example_sentence": f"Practiced in roleplay scenario: {session.scenario_title}",
                        "source_type": "roleplay",
                        "source_text": f"Roleplay: {session.scenario_title}",
                        "due_at": timezone.now(),
                    },
                )
            except Exception as exc:
                logger.error("Failed to save vocabulary word to SRS: %s", exc)

        return report
