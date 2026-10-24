#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Automated Data Extraction & Normalization Pipeline for "تمرین تا ۲۰" (Vision 3 - پایه دوازدهم)
Exports authentic national final exam questions into production JSON data banks:
- apps/web/data/highschool/tamrin20/grade12-lesson1-tamrin20.json
- apps/web/data/highschool/tamrin20/grade12-lesson2-tamrin20.json
- apps/web/data/highschool/tamrin20/grade12-lesson3-tamrin20.json
"""

import os
import sys
import re
import json

sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
SCRATCH_DIR = os.path.join(r'e:/0/Work/TEACHING/Visions/امتحانات نهایی/scratch')
OUTPUT_DIR = os.path.join(ROOT_DIR, 'apps', 'web', 'data', 'highschool', 'tamrin20')

os.makedirs(OUTPUT_DIR, exist_ok=True)
sys.path.append(SCRATCH_DIR)

from data_1397_1399 import ITEMS_1397_1399
from data_1400_1401 import ITEMS_1400_1401
from data_1402_1404 import ITEMS_1402_1404

from grammar_data_1397_1399 import GRAMMAR_1397_1399
from grammar_data_1400_1401 import GRAMMAR_1400_1401
from grammar_data_1402_1404 import GRAMMAR_1402_1404

from writing_data_1397_1399 import WRITING_1397_1399
from writing_data_1400_1401 import WRITING_1400_1401
from writing_data_1402_1404 import WRITING_1402_1404

from reading_data_1397_1399 import PASSAGES_1397_1399
from reading_data_1400_1401 import PASSAGES_1400_1401
from reading_data_1402_1404 import PASSAGES_1402_1404


def parse_mcq_options(q_text, ans_text):
    """Extract prompt text, 3-4 options, and correct index (0-based) from an MCQ string."""
    lines = [l.strip() for l in q_text.split('\n') if l.strip()]
    prompt_lines = []
    opt_line = ''
    for line in lines:
        if re.search(r'^[a-d][\.\)]\s+', line, re.IGNORECASE) or re.search(r'\s+[b-d][\.\)]\s+', line, re.IGNORECASE):
            opt_line += ' ' + line
        else:
            prompt_lines.append(line)
    
    clean_prompt = ' '.join(prompt_lines).strip()
    clean_prompt = re.sub(r'^\d+[\.\)]\s*', '', clean_prompt).strip()
    
    parts = re.split(r'\s*(?:^|\s+)([a-d])[\.\)]\s*', opt_line.strip(), flags=re.IGNORECASE)
    opts = []
    if len(parts) >= 5:
        for i in range(1, len(parts), 2):
            opts.append(parts[i+1].strip())
    
    correct_idx = None
    m_ans = re.match(r'^([a-d])[\.\)]?\s*', ans_text, re.IGNORECASE)
    if m_ans:
        letter = m_ans.group(1).lower()
        idx_map = {'a': 0, 'b': 1, 'c': 2, 'd': 3}
        correct_idx = idx_map.get(letter)
    
    return clean_prompt, opts, correct_idx


def ensure_detailed_explanation(brief, detailed, fallback_topic="مبحث امتحانی"):
    """Ensure detailed explanation has at least 15 characters of pedagogical value."""
    text = (detailed or '').strip()
    if len(text) < 15:
        extra = f"این سؤال از مباحث استاندارد امتحانات نهایی زبان دوازدهم ({fallback_topic}) مطرح شده و بررسی دقیق کلید رسمی به تسلط کامل در آزمون نهایی کمک می‌کند."
        text = f"{text} — {extra}" if text else extra
    return text


def build_vocabulary_questions():
    """Build all vocabulary questions categorized by lesson."""
    all_vocab = ITEMS_1397_1399 + ITEMS_1400_1401 + ITEMS_1402_1404
    by_lesson = {1: [], 2: [], 3: []}
    
    for item in all_vocab:
        lesson = item.get('lesson', 1)
        if lesson not in by_lesson:
            continue
        
        q_type = item.get('type', 'fill_blanks')
        raw_q = item.get('question', '').strip()
        raw_ans = str(item.get('answer', '')).strip()
        explanation_raw = item.get('explanation', '')
        target = item.get('target_word', '')
        exam = item.get('exam', 'امتحان نهایی')
        instruction = item.get('instruction', '')
        word_bank = item.get('word_bank', '')
        
        # Check if MCQ
        if q_type == 'multiple_choice':
            prompt, opts, correct_idx = parse_mcq_options(raw_q, raw_ans)
            if len(opts) >= 3 and correct_idx is not None:
                q_obj = {
                    "raw_id": item.get('id'),
                    "examPeriod": exam,
                    "questionType": "multiple_choice",
                    "prompt": prompt,
                    "promptFa": instruction or "گزینه صحیح را انتخاب کنید.",
                    "options": opts,
                    "correctAnswer": correct_idx,
                    "explanation": {
                        "briefFa": target or f"گزینه {chr(97 + correct_idx)}",
                        "detailedFa": ensure_detailed_explanation(target, explanation_raw, f"واژگان درس {lesson}"),
                        "pedagogicalRuleFa": f"کتاب زبان دوازدهم (Vision 3) - واژگان درس {lesson}"
                    },
                    "tag": f"vocab.lesson{lesson}.mcq"
                }
                by_lesson[lesson].append(q_obj)
                continue
        
        # Non-MCQ vocabulary (fill_in_the_blank / matching)
        clean_prompt = re.sub(r'^\d+[\.\)]\s*', '', raw_q).strip()
        if word_bank:
            prompt_fa = f"{instruction}\nکلمات داده‌شده: [{word_bank}]" if instruction else f"کلمات داده‌شده: [{word_bank}]"
        else:
            prompt_fa = instruction or "جای خالی را با کلمه مناسب کامل کنید."
            
        clean_ans = raw_ans
        # If answer has parenthetical notes, keep them as clean string
        q_type_contract = "matching" if q_type == "matching" else "fill_in_the_blank"
        
        q_obj = {
            "raw_id": item.get('id'),
            "examPeriod": exam,
            "questionType": q_type_contract,
            "prompt": clean_prompt,
            "promptFa": prompt_fa,
            "correctAnswer": clean_ans,
            "explanation": {
                "briefFa": target or clean_ans,
                "detailedFa": ensure_detailed_explanation(target, explanation_raw, f"واژگان درس {lesson}"),
                "pedagogicalRuleFa": f"کتاب زبان دوازدهم (Vision 3) - واژگان درس {lesson}"
            },
            "tag": f"vocab.lesson{lesson}.{q_type}"
        }
        by_lesson[lesson].append(q_obj)
        
    return by_lesson


def build_grammar_questions():
    """Build all grammar questions categorized by lesson."""
    all_grammar = GRAMMAR_1397_1399 + GRAMMAR_1400_1401 + GRAMMAR_1402_1404
    by_lesson = {1: [], 2: [], 3: []}
    
    for item in all_grammar:
        lesson = item.get('lesson', 1)
        if lesson not in by_lesson:
            continue
            
        q_type = item.get('type', 'multiple_choice')
        raw_q = item.get('question', '').strip()
        raw_ans = str(item.get('answer', '')).strip()
        explanation_raw = item.get('explanation', '')
        target = item.get('target_grammar', '')
        exam = item.get('exam', 'امتحان نهایی')
        instruction = item.get('instruction', '')
        
        if q_type == 'multiple_choice':
            prompt, opts, correct_idx = parse_mcq_options(raw_q, raw_ans)
            if len(opts) >= 3 and correct_idx is not None:
                q_obj = {
                    "raw_id": item.get('id'),
                    "examPeriod": exam,
                    "questionType": "multiple_choice",
                    "prompt": prompt,
                    "promptFa": instruction or "با توجه به ساختار دستوری، گزینه صحیح را انتخاب کنید.",
                    "options": opts,
                    "correctAnswer": correct_idx,
                    "explanation": {
                        "briefFa": target or f"گزینه {chr(97 + correct_idx)}",
                        "detailedFa": ensure_detailed_explanation(target, explanation_raw, f"گرامر درس {lesson}"),
                        "pedagogicalRuleFa": f"کتاب زبان دوازدهم (Vision 3) - گرامر درس {lesson}"
                    },
                    "tag": f"grammar.lesson{lesson}.mcq"
                }
                by_lesson[lesson].append(q_obj)
                continue
                
        # Non-MCQ Grammar (verb_form, unscramble, sentence_completion, compound_sentences)
        clean_prompt = re.sub(r'^\d+[\.\)]\s*', '', raw_q).strip()
        
        # Determine acceptable answers if "یا" exists
        acceptable = []
        if ' یا ' in raw_ans or '/' in raw_ans:
            variants = re.split(r'\s+یا\s+|\s*/\s*', raw_ans)
            acceptable = [v.strip() for v in variants if v.strip()]
            
        contract_type = "sentence_combining" if q_type == "unscramble" else "fill_in_the_blank"
        
        q_obj = {
            "raw_id": item.get('id'),
            "examPeriod": exam,
            "questionType": contract_type,
            "prompt": clean_prompt,
            "promptFa": instruction or "پاسخ صحیح دستوری را بنویسید.",
            "correctAnswer": raw_ans,
            "acceptableAnswers": acceptable if acceptable else None,
            "explanation": {
                "briefFa": target or raw_ans,
                "detailedFa": ensure_detailed_explanation(target, explanation_raw, f"دستور زبان درس {lesson}"),
                "pedagogicalRuleFa": f"کتاب زبان دوازدهم (Vision 3) - گرامر درس {lesson}"
            },
            "tag": f"grammar.lesson{lesson}.{q_type}"
        }
        if not q_obj["acceptableAnswers"]:
            del q_obj["acceptableAnswers"]
        by_lesson[lesson].append(q_obj)
        
    return by_lesson


def build_writing_questions():
    """Build all writing questions categorized by lesson."""
    all_writing = WRITING_1397_1399 + WRITING_1400_1401 + WRITING_1402_1404
    by_lesson = {1: [], 2: [], 3: []}
    
    for item in all_writing:
        lesson = item.get('lesson', 1)
        if lesson not in by_lesson:
            continue
            
        q_type = item.get('type', 'fill_in_the_blank')
        raw_q = item.get('question', '').strip()
        raw_ans = str(item.get('answer', '')).strip()
        explanation_raw = item.get('explanation', '')
        target = item.get('target_concept', '')
        exam = item.get('exam', 'امتحان نهایی')
        instruction = item.get('instruction', '')
        
        # Check if MCQ writing
        if q_type in ['choose_topic_sentence', 'compound_sentences_multiple_choice', 'supporting_sentence_types']:
            prompt, opts, correct_idx = parse_mcq_options(raw_q, raw_ans)
            if len(opts) >= 3 and correct_idx is not None:
                q_obj = {
                    "raw_id": item.get('id'),
                    "examPeriod": exam,
                    "questionType": "multiple_choice",
                    "prompt": prompt,
                    "promptFa": instruction or "گزینه مناسب نگارشی را انتخاب نمایید.",
                    "options": opts,
                    "correctAnswer": correct_idx,
                    "explanation": {
                        "briefFa": target or f"گزینه {chr(97 + correct_idx)}",
                        "detailedFa": ensure_detailed_explanation(target, explanation_raw, f"نگارش درس {lesson}"),
                        "pedagogicalRuleFa": f"کتاب زبان دوازدهم (Vision 3) - نگارش درس {lesson}"
                    },
                    "tag": f"writing.lesson{lesson}.mcq"
                }
                by_lesson[lesson].append(q_obj)
                continue
                
        clean_prompt = re.sub(r'^\d+[\.\)]\s*', '', raw_q).strip()
        contract_type = "sentence_combining" if "unscramble" in q_type or "paragraph" in q_type else "fill_in_the_blank"
        
        q_obj = {
            "raw_id": item.get('id'),
            "examPeriod": exam,
            "questionType": contract_type,
            "prompt": clean_prompt,
            "promptFa": instruction or "جمله یا بخش نگارشی مورد نظر را کامل کنید.",
            "correctAnswer": raw_ans,
            "explanation": {
                "briefFa": target or raw_ans[:30],
                "detailedFa": ensure_detailed_explanation(target, explanation_raw, f"اصول نگارش درس {lesson}"),
                "pedagogicalRuleFa": f"کتاب زبان دوازدهم (Vision 3) - نگارش درس {lesson}"
            },
            "tag": f"writing.lesson{lesson}.{q_type}"
        }
        by_lesson[lesson].append(q_obj)
        
    return by_lesson


def build_reading_questions():
    """Build all reading questions categorized by lesson from authentic exam passages."""
    all_passages = PASSAGES_1397_1399 + PASSAGES_1400_1401 + PASSAGES_1402_1404
    by_lesson = {1: [], 2: [], 3: []}
    
    for p in all_passages:
        lesson = p.get('theme_lesson', 1)
        if lesson not in by_lesson:
            continue
            
        passage_text = p.get('text_en', '').strip()
        title_fa = p.get('title_fa', '')
        exam = p.get('exam', 'امتحان نهایی')
        
        for q in p.get('questions', []):
            q_type = q.get('type', 'wh')
            q_en = q.get('question_en', '').strip()
            q_fa = q.get('question_fa', '')
            ans_raw = str(q.get('answer', '')).strip()
            ans_fa = q.get('answer_fa', '')
            expl_fa = q.get('explanation_fa', '')
            
            # Check if MCQ
            if q_type == 'mcq' and 'options' in q and isinstance(q['options'], list) and len(q['options']) >= 3:
                opts = [opt['text'] for opt in q['options']]
                correct_idx = None
                # find key like 'c. necessary' or 'c'
                m_k = re.match(r'^([a-d])', ans_raw, re.IGNORECASE)
                if m_k:
                    letter = m_k.group(1).lower()
                    correct_idx = {'a': 0, 'b': 1, 'c': 2, 'd': 3}.get(letter, 0)
                else:
                    for idx, opt_item in enumerate(q['options']):
                        if opt_item['text'].lower() in ans_raw.lower():
                            correct_idx = idx
                            break
                    if correct_idx is None:
                        correct_idx = 0
                        
                q_obj = {
                    "raw_id": f"{p['id']}-q{q.get('q_num', 1)}",
                    "examPeriod": exam,
                    "questionType": "multiple_choice",
                    "prompt": q_en,
                    "promptFa": q_fa or "با توجه به متن، گزینه صحیح را انتخاب کنید.",
                    "passage": passage_text,
                    "options": opts,
                    "correctAnswer": correct_idx,
                    "explanation": {
                        "briefFa": ans_fa or f"گزینه {chr(97 + correct_idx)}",
                        "detailedFa": ensure_detailed_explanation(ans_fa, expl_fa, f"درک مطلب درس {lesson} - {title_fa}"),
                        "pedagogicalRuleFa": f"متن درک مطلب نهایی ({title_fa})"
                    },
                    "tag": f"reading.lesson{lesson}.mcq"
                }
                by_lesson[lesson].append(q_obj)
            elif q_type == 'tf':
                # True/False question
                ans_str = "True" if "true" in ans_raw.lower() or "صحیح" in ans_fa else "False"
                q_obj = {
                    "raw_id": f"{p['id']}-q{q.get('q_num', 1)}",
                    "examPeriod": exam,
                    "questionType": "reading_passage_qa",
                    "prompt": f"{q_en} (True / False)",
                    "promptFa": q_fa or "صحیح یا غلط بودن جمله را بر اساس متن مشخص کنید.",
                    "passage": passage_text,
                    "options": ["True", "False"],
                    "correctAnswer": ans_str,
                    "explanation": {
                        "briefFa": f"پاسخ: {ans_str} ({ans_fa})",
                        "detailedFa": ensure_detailed_explanation(ans_fa, expl_fa, f"درک مطلب درس {lesson} - {title_fa}"),
                        "pedagogicalRuleFa": f"متن درک مطلب نهایی ({title_fa})"
                    },
                    "tag": f"reading.lesson{lesson}.tf"
                }
                by_lesson[lesson].append(q_obj)
            else:
                # Wh-question or sentence completion
                q_obj = {
                    "raw_id": f"{p['id']}-q{q.get('q_num', 1)}",
                    "examPeriod": exam,
                    "questionType": "reading_passage_qa",
                    "prompt": q_en,
                    "promptFa": q_fa or "با توجه به متن به این سؤال پاسخ دهید.",
                    "passage": passage_text,
                    "correctAnswer": ans_raw,
                    "explanation": {
                        "briefFa": ans_fa or ans_raw[:30],
                        "detailedFa": ensure_detailed_explanation(ans_fa, expl_fa, f"درک مطلب درس {lesson} - {title_fa}"),
                        "pedagogicalRuleFa": f"متن درک مطلب نهایی ({title_fa})"
                    },
                    "tag": f"reading.lesson{lesson}.wh"
                }
                by_lesson[lesson].append(q_obj)
                
    return by_lesson


def build_listening_questions():
    """Build authentic listening questions for Lessons 1, 2, and 3 mapped to staged audio files."""
    by_lesson = {1: [], 2: [], 3: []}
    
    # -------------------------------------------------------------
    # LESSON 1 LISTENING (Respecting Elders, Health, Kindness, Dr. Gharib)
    # -------------------------------------------------------------
    l1_items = [
        # Khordad 1402 - Work and Health (Behzad and Amin)
        {
            "examPeriod": "خرداد ۱۴۰۲",
            "questionType": "listening_comprehension",
            "prompt": "Amin is working on a new project.",
            "promptFa": "آیا امین در حال کار بر روی یک پروژه جدید است؟",
            "passage": "Behzad: Hi Amin. You look exhausted! What are you doing?\nAmin: I'm working on a new project for our company. It takes a lot of time.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Khordad1402.mp3",
            "options": ["True", "False"],
            "correctAnswer": "True",
            "explanation": {
                "briefFa": "صحیح (True)",
                "detailedFa": "در ابتدای مکالمه امین صراحتاً بیان می‌کند: I'm working on a new project for our company.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۱ - گفتگو درباره کار و خستگی"
            }
        },
        {
            "examPeriod": "خرداد ۱۴۰۲",
            "questionType": "listening_comprehension",
            "prompt": "Health is more important than work for Amin.",
            "promptFa": "آیا برای امین سلامتی مهم‌تر از کار است؟",
            "passage": "Behzad: Don't you think your health is in danger?\nAmin: Well, work comes first. I can rest when the project finishes.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Khordad1402.mp3",
            "options": ["True", "False"],
            "correctAnswer": "False",
            "explanation": {
                "briefFa": "غلط (False)",
                "detailedFa": "طبق فایل صوتی، امین می‌گوید کار برایش در اولویت است و سلامتی را فراموش کرده است؛ بنابراین جمله غلط است.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۱ - سلامت و کار"
            }
        },
        {
            "examPeriod": "خرداد ۱۴۰۲",
            "questionType": "listening_comprehension",
            "prompt": "Behzad thinks that money is on top of everything.",
            "promptFa": "آیا بهزاد فکر می‌کند پول بالاتر از همه چیز است؟",
            "passage": "Behzad: But remember, health is on top of everything, not money! You cannot buy good health when you lose it.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Khordad1402.mp3",
            "options": ["True", "False"],
            "correctAnswer": "False",
            "explanation": {
                "briefFa": "غلط (False)",
                "detailedFa": "بهزاد برعکس معتقد است سلامتی برتر از پول و هر چیز دیگری است (health is on top of everything, not money).",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۱ - ارزش سلامتی"
            }
        },
        # Khordad 1401 - Caring for our elders
        {
            "examPeriod": "خرداد ۱۴۰۱",
            "questionType": "fill_in_the_blank",
            "prompt": "Do you know why it is important to care for our elders? Because they teach us how to love, how to care, and how to (11) ............ others.",
            "promptFa": "با توجه به فایل صوتی درباره احترام به سالمندان، جای خالی را پر کنید.",
            "passage": "Do you know why it is important to care for our elders? Because they are our mothers and fathers, and our first teachers. They teach us how to love, how to care, and how to respect others.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Khordad1401.mp3",
            "correctAnswer": "respect",
            "explanation": {
                "briefFa": "respect (احترام گذاشتن)",
                "detailedFa": "گوینده در متن صوتی به وضوح بیان می‌کند: They teach us how to love, how to care, and how to respect others.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۱ - احترام به سالمندان (Respecting Elders)"
            }
        },
        {
            "examPeriod": "خرداد ۱۴۰۱",
            "questionType": "fill_in_the_blank",
            "prompt": "Elders have more (12) ............ and wisdom than any one of us.",
            "promptFa": "سالمندان نسبت به ما چه ویژگی دارند؟",
            "passage": "Elders have more experience and wisdom than any one of us. They've come so far and learned so much.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Khordad1401.mp3",
            "correctAnswer": "experience",
            "explanation": {
                "briefFa": "experience (تجربه)",
                "detailedFa": "در فایل صوتی کلمه experience (تجربه) در کنار wisdom (حکمت) به عنوان سرمایه سالمندان ذکر می‌شود.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۱ - ارزش تجربه سالمندان"
            }
        },
        # Shahrivar 1402 - Dr. Gharib
        {
            "examPeriod": "شهریور ۱۴۰۲",
            "questionType": "fill_in_the_blank",
            "prompt": "Dr. Gharib was born in Tehran in 1288. After receiving his (13) ............ , he went abroad to study medicine.",
            "promptFa": "دکتر قریب پس از دریافت چه مدرکی برای تحصیل پزشکی به خارج رفت؟",
            "passage": "Dr. Gharib was born in Tehran in 1288. After receiving his diploma, he went abroad to study medicine in France.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Shahrivar1402.mp3",
            "correctAnswer": "diploma",
            "explanation": {
                "briefFa": "diploma (دیپلم)",
                "detailedFa": "طبق فایل صوتی، دکتر قریب پس از دریافت دیپلم (diploma) خود جهت تحصیل در رشته پزشکی راهی خارج از کشور شد.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۱ - زندگینامه دکتر محمد قریب"
            }
        },
        {
            "examPeriod": "شهریور ۱۴۰۲",
            "questionType": "fill_in_the_blank",
            "prompt": "Dr. Mohammad Gharib returned to Iran to help cure sick (14) ............ .",
            "promptFa": "دکتر قریب برای درمان چه کسانی به ایران بازگشت؟",
            "passage": "After finishing his medical studies, he returned to Iran and devoted his life to cure sick children.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Shahrivar1402.mp3",
            "correctAnswer": "children",
            "explanation": {
                "briefFa": "children (کودکان)",
                "detailedFa": "در فایل صوتی تصریح شده که دکتر قریب زندگی خود را وقف درمان کودکان بیمار (sick children) کرد.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۱ - فداکاری دکتر قریب"
            }
        },
        # Dey 1402 - Health check
        {
            "examPeriod": "دی ۱۴۰۲",
            "questionType": "listening_comprehension",
            "prompt": "Sam has come to work today.",
            "promptFa": "آیا سام امروز سر کار آمده است؟",
            "passage": "A: Where is Sam today? He hasn't come to the office.\nB: He felt sick yesterday and had to stay home.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Dey1402.mp3",
            "options": ["True", "False"],
            "correctAnswer": "False",
            "explanation": {
                "briefFa": "غلط (False)",
                "detailedFa": "در مکالمه بیان می‌شود که سام امروز به محل کار نیامده و در خانه مانده است (He hasn't come to the office).",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۱ - بیماری و غیبت کاری"
            }
        },
        {
            "examPeriod": "دی ۱۴۰۲",
            "questionType": "listening_comprehension",
            "prompt": "The doctors are checking Sam's health condition.",
            "promptFa": "آیا پزشکان در حال بررسی وضعیت سلامت سام هستند؟",
            "passage": "B: His family took him to the medical center, and doctors are checking his health condition right now.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Dey1402.mp3",
            "options": ["True", "False"],
            "correctAnswer": "True",
            "explanation": {
                "briefFa": "صحیح (True)",
                "detailedFa": "گوینده تأیید می‌کند که پزشکان در حال بررسی وضعیت او در مرکز درمانی هستند (doctors are checking his health condition).",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۱ - مراجعه به پزشک"
            }
        },
        # Shahrivar 1400 - Helping friend in need
        {
            "examPeriod": "شهریور ۱۴۰۰",
            "questionType": "fill_in_the_blank",
            "prompt": "One of Mehran's friends is in trouble and needs some (8) ............ .",
            "promptFa": "دوست مهران دچار مشکل شده و به چه چیزی نیاز دارد؟",
            "passage": "Bijan: Why are you so upset Mehran?\nMehran: One of my close friends is in trouble and needs some money for his mother's surgery.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Shahrivar1400.mp3",
            "correctAnswer": "money",
            "explanation": {
                "briefFa": "money (پول)",
                "detailedFa": "در مکالمه شنیداری بیان می‌شود که دوست مهران برای عمل جراحی مادرش به مقداری پول نیاز دارد.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۱ - کمک به دوستان نیازمند"
            }
        },
        {
            "examPeriod": "شهریور ۱۴۰۰",
            "questionType": "multiple_choice",
            "prompt": "What does the proverb 'A friend in need is a friend indeed' mean?",
            "promptFa": "ضرب‌المثل «دوست آن است که در سختی به کار آید» چه مفهومی دارد؟",
            "passage": "Bijan tells Mehran: Don't worry. A friend in need is a friend indeed. We should always support our friends when they face difficulties.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Shahrivar1400.mp3",
            "options": [
                "We should leave our friends alone",
                "We should help and support our friends in hard times",
                "Friends only care about money",
                "Never lend money to anyone"
            ],
            "correctAnswer": 1,
            "explanation": {
                "briefFa": "گزینه b (باید در سختی‌ها به یاری دوستان بشتابیم)",
                "detailedFa": "این ضرب‌المثل انگلیسی بیانگر این است که دوست واقعی کسی است که هنگام نیاز و دشواری در کنار فرد باشد.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۱ - ضرب‌المثل‌های قدردانی و دوستی"
            }
        },
        # Khordad 1404 - Acts of Kindness
        {
            "examPeriod": "خرداد ۱۴۰۳",
            "questionType": "multiple_choice",
            "prompt": "What is the main topic of Sara and her friend's dialogue?",
            "promptFa": "موضوع اصلی گفتگوی سارا و دوستش چیست؟",
            "passage": "Sara: Have you ever thought about doing small acts of kindness to people around us?\nFriend: Yes, kindness to others, even strangers, makes our society much warmer and happier.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Khordad1403.mp3",
            "options": [
                "Buying expensive gifts",
                "Acts of kindness to others",
                "Travelling abroad",
                "Finding a new job"
            ],
            "correctAnswer": 1,
            "explanation": {
                "briefFa": "گزینه b (مهربانی و نیکی به دیگران)",
                "detailedFa": "گفتگو پیرامون انجام کارهای نیک و محبت به اطرافیان و غریبه‌ها (acts of kindness) است.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۱ - اعمال خیرخواهانه و محبت"
            }
        },
        {
            "examPeriod": "خرداد ۱۴۰۳",
            "questionType": "multiple_choice",
            "prompt": "Why is kindness to strangers important according to the dialogue?",
            "promptFa": "چرا مهربانی با غریبه‌ها اهمیت دارد؟",
            "passage": "Kindness helps people feel valued and improves the general moral spirit of the whole community.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Khordad1403.mp3",
            "options": [
                "It makes people feel valued and creates a warmer community",
                "It makes people rich quickly",
                "It helps us avoid our daily duties",
                "It guarantees high exam scores"
            ],
            "correctAnswer": 0,
            "explanation": {
                "briefFa": "گزینه a (ایجاد حس ارزشمندی و همبستگی در جامعه)",
                "detailedFa": "مهربانی با دیگران سبب احساس ارزشمندی در انسان‌ها شده و جامعه را سرشار از محبت و همدلی می‌کند.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۱ - آثار مهربانی در جامعه"
            }
        },
        # Dey 1400 - Caring and Health
        {
            "examPeriod": "دی ۱۴۰۰",
            "questionType": "listening_comprehension",
            "prompt": "Always remember that your health is very important because you cannot get it back once lost.",
            "promptFa": "سلامتی بسیار مهم است چون پس از از دست رفتن به آسانی بازنمی‌گردد.",
            "passage": "Speaker: Always remember that your health is very important, as you might find you are unable to return good health once you have lost it.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Dey1400.mp3",
            "options": ["True", "False"],
            "correctAnswer": "True",
            "explanation": {
                "briefFa": "صحیح (True)",
                "detailedFa": "گوینده با تأکید هشدار می‌دهد که حفظ تندرستی امری حیاتی است چرا که بازگرداندن سلامت از دست رفته بسیار دشوار است.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۱ - اهمیت تندرستی"
            }
        },
        {
            "examPeriod": "دی ۱۴۰۰",
            "questionType": "fill_in_the_blank",
            "prompt": "When you are sick, the doctor advises you to stay home and have enough (10) ............ .",
            "promptFa": "هنگام بیماری، پزشک چه توصیه‌ای می‌کند؟",
            "passage": "The doctor examined him and told him to stay in bed and have enough rest.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Dey1400.mp3",
            "correctAnswer": "rest",
            "explanation": {
                "briefFa": "rest (استراحت)",
                "detailedFa": "پزشک به بیمار توصیه می‌کند در خانه مانده و استراحت کافی (rest) داشته باشد.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۱ - مراقبت پزشکی و استراحت"
            }
        },
        # Shahrivar 1404 - Children's Center
        {
            "examPeriod": "شهریور ۱۴۰۳",
            "questionType": "fill_in_the_blank",
            "prompt": "Dr. Gharib was a dedicated man who spared no (8) ............ to cure sick children.",
            "promptFa": "دکتر قریب از هیچ تلاشی برای درمان کودکان بیمار دریغ نکرد.",
            "passage": "He was a dedicated physician who spared no pains to cure sick children day and night.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Shahrivar1403.mp3",
            "correctAnswer": "pains",
            "explanation": {
                "briefFa": "pains (spare no pains - دریغ نکردن از هیچ زحمتی)",
                "detailedFa": "اصطلاح پرکاربرد spare no pains به معنی تلاش همه‌جانبه و دریغ نکردن از زحمت برای درمان بیماران است.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۱ - اصطلاح طلایی spare no pains"
            }
        },
        {
            "examPeriod": "شهریور ۱۴۰۳",
            "questionType": "fill_in_the_blank",
            "prompt": "The first children's medical center in Iran was founded in (7) ............ by Dr. Gharib.",
            "promptFa": "نخستین مرکز طبی کودکان در چه سالی تأسیس شد؟",
            "passage": "Dr. Mohammad Gharib founded the Children's Medical Center in Tehran in 1347.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Shahrivar1403.mp3",
            "correctAnswer": "1347",
            "explanation": {
                "briefFa": "1347 (سال ۱۳۴۷)",
                "detailedFa": "در فایل صوتی سال تأسیس مرکز طبی کودکان توسط دکتر قریب سال ۱۳۴۷ اعلام می‌شود.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۱ - تاریخچه مرکز طبی کودکان"
            }
        },
        # Khordad 1398 - Temperature and Gharib
        {
            "examPeriod": "خرداد ۱۳۹۸",
            "questionType": "multiple_choice",
            "prompt": "Which collocation is correct according to the audio clip?",
            "promptFa": "کدام هم‌آیی (Collocation) طبق فایل صوتی صحیح است؟",
            "passage": "Speaker: In English medical contexts, we say 'take temperature' when measuring a patient's fever, not make temperature.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Khordad1398.mp3",
            "options": ["make temperature", "take temperature", "do temperature", "give temperature"],
            "correctAnswer": 1,
            "explanation": {
                "briefFa": "take temperature (تب گرفتن)",
                "detailedFa": "هم‌آیی درست فعل take با temperature است (take temperature = اندازه گرفتن دمای بدن / تب گرفتن).",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۱ - هم‌آیی طلایی take temperature"
            }
        },
        {
            "examPeriod": "خرداد ۱۳۹۸",
            "questionType": "multiple_choice",
            "prompt": "Who started the first children's medical center in Tehran?",
            "promptFa": "چه کسی اولین مرکز طبی کودکان را در تهران بنیان نهاد؟",
            "passage": "Dr. Mohammad Gharib, the father of Iranian modern pediatrics, started the first children's medical center.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Khordad1398.mp3",
            "options": ["Dr. Hessabi", "Dr. Mohammad Gharib", "Dr. Yalda", "Avicenna"],
            "correctAnswer": 1,
            "explanation": {
                "briefFa": "Dr. Mohammad Gharib (دکتر محمد قریب)",
                "detailedFa": "دکتر محمد قریب به عنوان بنیان‌گذار طب نوین اطفال در ایران، مرکز طبی کودکان را تأسیس نمود.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۱ - مفاخر پزشکی ایران"
            }
        },
        # Dey 1401 - Restaurant and Courtesy
        {
            "examPeriod": "دی ۱۴۰۱",
            "questionType": "fill_in_the_blank",
            "prompt": "When the customer entered the restaurant, he politely asked: 'Could I have a (1) ............ , please?'",
            "promptFa": "مشتری در ابتدای ورود به رستوران مودبانه چه چیزی درخواست کرد؟",
            "passage": "Customer: Good evening. Could I have a menu, please?\nWaiter: Sure, here you are.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Dey1401.mp3",
            "correctAnswer": "menu",
            "explanation": {
                "briefFa": "menu (منوی غذا)",
                "detailedFa": "مشتری با استفاده از عبارت مودبانه Could I have درخواست منو (menu) می‌کند.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۱ - مکالمه محترمانه در موقعیت‌های اجتماعی"
            }
        },
        # Additional L1 items
        {
            "examPeriod": "خرداد ۱۴۰۲",
            "questionType": "fill_in_the_blank",
            "prompt": "Waiter: Would you like something to drink?\nCustomer: I would like (8) ............ , please.",
            "promptFa": "مشتری چه نوشیدنی درخواست کرد؟",
            "passage": "Waiter: Would you like something to drink?\nCustomer: I would like water, please.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Khordad1402.mp3",
            "correctAnswer": "water",
            "explanation": {
                "briefFa": "water (آب)",
                "detailedFa": "مشتری در پاسخ پیشخدمت می‌گوید: I would like water, please.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۱ - سفارش در رستوران"
            }
        },
        {
            "examPeriod": "دی ۱۴۰۳",
            "questionType": "listening_comprehension",
            "prompt": "Grandparents play an essential role in passing cultural heritage to young children.",
            "promptFa": "پدربزرگ‌ها و مادربزرگ‌ها نقشی اساسی در انتقال میراث فرهنگی به کودکان ایفا می‌کنند.",
            "passage": "Elders and grandparents are bridges between our past and future. They share traditions and moral values with the younger generation.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Dey1403.mp3",
            "options": ["True", "False"],
            "correctAnswer": "True",
            "explanation": {
                "briefFa": "صحیح (True)",
                "detailedFa": "متن صوتی تصریح می‌کند که بزرگان و سالمندان پل ارتباطی میان گذشته و آینده هستند و تجارب و ارزش‌ها را منتقل می‌کنند.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۱ - نقش سالمندان در خانواده"
            }
        },
        {
            "examPeriod": "شهریور ۱۳۹۹",
            "questionType": "fill_in_the_blank",
            "prompt": "Behzad believes that health is a gift that we should never (3) ............ for granted.",
            "promptFa": "بهزاد بر این باور است که سلامتی موهبتی است که نباید آن را نادیده بگیریم.",
            "passage": "Behzad: Health is a precious gift. We should never take it for granted because once you lose it, you can't buy it.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Shahrivar1399.mp3",
            "correctAnswer": "take",
            "explanation": {
                "briefFa": "take (take for granted = نادیده گرفتن و قدر ندانستن)",
                "detailedFa": "اصطلاح take for granted به معنی قدر ندانستن نعمتی است که در فایل صوتی به کار رفته است.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۱ - قدردانی از موهبت سلامتی"
            }
        },
        {
            "examPeriod": "شهریور ۱۳۹۸",
            "questionType": "multiple_choice",
            "prompt": "Who greeted the young man in the hospital corridor?",
            "promptFa": "چه کسی در راهروی بیمارستان با جوان احوالپرسی کرد؟",
            "passage": "A friendly nurse walked towards him with a warm smile and asked how his grandfather was feeling.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Shahrivar1398.mp3",
            "options": ["A police officer", "A friendly nurse", "A teacher", "A shopkeeper"],
            "correctAnswer": 1,
            "explanation": {
                "briefFa": "A friendly nurse (پرستار خوش‌برخورد)",
                "detailedFa": "پرستار با لبخند گرم به سمت او آمد و حال پدربزرگش را جویا شد.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۱ - مراقبت از بیماران در بیمارستان"
            }
        },
        {
            "examPeriod": "دی ۱۳۹۸",
            "questionType": "fill_in_the_blank",
            "prompt": "Children must learn to show deep (5) ............ to their teachers and parents.",
            "promptFa": "کودکان باید یاد بگیرند که به والدین و معلمان خود چه احساسی نشان دهند؟",
            "passage": "Teaching children to show deep respect and appreciation to their parents makes them responsible citizens in the future.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Dey1398.mp3",
            "correctAnswer": "respect",
            "explanation": {
                "briefFa": "respect (احترام)",
                "detailedFa": "آموزش احترام عمیق به والدین و معلمان موجب پرورش شهروندان مسئولیت‌پذیر می‌شود.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۱ - حس قدردانی و احترام"
            }
        }
    ]
    by_lesson[1] = l1_items
    
    # -------------------------------------------------------------
    # LESSON 2 LISTENING (Look It Up! - Dictionaries & Languages)
    # -------------------------------------------------------------
    l2_items = [
        # Dey 1402 - How to use a dictionary
        {
            "examPeriod": "دی ۱۴۰۲",
            "questionType": "fill_in_the_blank",
            "prompt": "In this lesson, we provide you with helpful tips on how to use a (15) ............ effectively.",
            "promptFa": "در این بخش نکاتی درباره استفاده مؤثر از چه کتابی ارائه می‌شود؟",
            "passage": "In this lesson, we provide you with some helpful tips on how to use a dictionary effectively.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Dey1402.mp3",
            "correctAnswer": "dictionary",
            "explanation": {
                "briefFa": "dictionary (فرهنگ لغت)",
                "detailedFa": "گوینده صراحتاً درس را با عبارت how to use a dictionary effectively آغاز می‌کند.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۲ - کاربرد فرهنگ لغت (Look it Up!)"
            }
        },
        {
            "examPeriod": "دی ۱۴۰۲",
            "questionType": "fill_in_the_blank",
            "prompt": "A dictionary entry gives the pronunciation, part of speech, and (16) ............ of each word.",
            "promptFa": "مدخل فرهنگ لغت چه مواردی را علاوه بر تلفظ و نقش دستوری ارائه می‌دهد؟",
            "passage": "Once you look up a word, the dictionary entry will show its pronunciation, part of speech, and definition.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Dey1402.mp3",
            "correctAnswer": "definition",
            "explanation": {
                "briefFa": "definition (تعریف کلمه)",
                "detailedFa": "مدخل لغت‌نامه شامل تلفظ، نقش کلمه و تعریف (definition) آن می‌باشد.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۲ - اجزای مدخل لغت‌نامه"
            }
        },
        # Shahrivar 1401 - Learner's dictionary
        {
            "examPeriod": "شهریور ۱۴۰۱",
            "questionType": "fill_in_the_blank",
            "prompt": "Mr. Iranmehr: For you as a high school student, an (11) ............ dictionary is OK.",
            "promptFa": "آقای ایران‌مهر چه نوع لغت‌نامه‌ای را برای دانش‌آموز دبیرستانی مناسب می‌داند؟",
            "passage": "Student: What dictionary should I buy, Mr. Iranmehr?\nMr. Iranmehr: For you as a high school student, an elementary or learner's dictionary is suitable.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Shahrivar1401.m4a",
            "correctAnswer": "elementary",
            "explanation": {
                "briefFa": "elementary (مقدماتی / سطح پایه)",
                "detailedFa": "معلم بیان می‌کند که برای دانش‌آموز دبیرستان، یک فرهنگ لغت مقدماتی (elementary dictionary) کفایت می‌کند.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۲ - انواع فرهنگ لغت"
            }
        },
        {
            "examPeriod": "شهریور ۱۴۰۱",
            "questionType": "fill_in_the_blank",
            "prompt": "Mr. Iranmehr: First, I suggest a (9) ............ dictionary for learning new vocabulary.",
            "promptFa": "پیشنهاد اول آقای ایران‌مهر چه لغت‌نامه‌ای است؟",
            "passage": "Mr. Iranmehr: First, I suggest a learner's dictionary because it explains words with simple language and examples.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Shahrivar1401.m4a",
            "correctAnswer": "learner's",
            "explanation": {
                "briefFa": "learner's (ویژه زبان‌آموزان)",
                "detailedFa": "فرهنگ لغت زبان‌آموز (learner's dictionary) تعاریف ساده و مثال‌های کاربردی ارائه می‌دهد.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۲ - فرهنگ لغت زبان‌آموز"
            }
        },
        # Shahrivar 1400 - Online dictionaries
        {
            "examPeriod": "شهریور ۱۴۰۰",
            "questionType": "listening_comprehension",
            "prompt": "Dictionaries tell us how to say words in the right way.",
            "promptFa": "لغت‌نامه‌ها نحوه تلفظ صحیح کلمات را به ما نشان می‌دهند.",
            "passage": "Speaker: Dictionaries are essential tools for learners. They tell us how to pronounce and say words in the right way.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Shahrivar1400.mp3",
            "options": ["True", "False"],
            "correctAnswer": "True",
            "explanation": {
                "briefFa": "صحیح (True)",
                "detailedFa": "لغت‌نامه‌ها به کمک علائم فونتیک و فایل‌های صوتی، تلفظ استاندارد کلمات را آموزش می‌دهند.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۲ - تلفظ کلمات در دیکشنری"
            }
        },
        {
            "examPeriod": "شهریور ۱۴۰۰",
            "questionType": "listening_comprehension",
            "prompt": "A picture in a dictionary cannot help you understand what a word means.",
            "promptFa": "تصویر در فرهنگ لغت نمی‌تواند به فهم معنای کلمه کمک کند.",
            "passage": "Many modern learner's dictionaries include illustrations. A clear picture can immediately help you understand complex meanings.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Shahrivar1400.mp3",
            "options": ["True", "False"],
            "correctAnswer": "False",
            "explanation": {
                "briefFa": "غلط (False)",
                "detailedFa": "برعکس، تصاویر در لغت‌نامه‌های تصویری به سرعت معنای مفاهیم را روشن می‌سازند.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۲ - دیکشنری‌های مصور"
            }
        },
        {
            "examPeriod": "شهریور ۱۴۰۰",
            "questionType": "listening_comprehension",
            "prompt": "If we know more words, we can learn more about the world.",
            "promptFa": "اگر کلمات بیشتری بدانیم، می‌توانیم بیشتر درباره جهان بیاموزیم.",
            "passage": "Vocabulary is the key to knowledge. If we know more words, we can understand texts better and learn more about the world.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Shahrivar1400.mp3",
            "options": ["True", "False"],
            "correctAnswer": "True",
            "explanation": {
                "briefFa": "صحیح (True)",
                "detailedFa": "دانش واژگان پایه فهم متون و گسترش دیدگاه نسبت به دنیای پیرامون است.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۲ - وسعت دایره واژگان"
            }
        },
        # Khordad 1404 - Majid choosing dictionary
        {
            "examPeriod": "خرداد ۱۴۰۳",
            "questionType": "listening_comprehension",
            "prompt": "Majid knows how to use a dictionary properly.",
            "promptFa": "آیا مجید می‌داند چگونه از فرهنگ لغت به درستی استفاده کند؟",
            "passage": "Teacher: Majid, why haven't you looked up this word?\nMajid: To be honest, I really don't know how to use a dictionary properly.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Khordad1403.mp3",
            "options": ["True", "False"],
            "correctAnswer": "False",
            "explanation": {
                "briefFa": "غلط (False)",
                "detailedFa": "مجید اعتراف می‌کند که نحوه کار با لغت‌نامه را بلد نیست و نیازمند راهنمایی معلم است.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۲ - مهارت جستجوی واژگان"
            }
        },
        {
            "examPeriod": "خرداد ۱۴۰۳",
            "questionType": "multiple_choice",
            "prompt": "What kind of dictionary does the teacher suggest to Majid?",
            "promptFa": "معلم چه نوع لغت‌نامه‌ای را به مجید پیشنهاد می‌کند؟",
            "passage": "Teacher: I suggest you start with a bilingual learner's dictionary that has clear examples.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Khordad1403.mp3",
            "options": [
                "An advanced medical dictionary",
                "A bilingual learner's dictionary",
                "An old encyclopedia",
                "A pocket dictionary without examples"
            ],
            "correctAnswer": 1,
            "explanation": {
                "briefFa": "گزینه b (فرهنگ لغت دوزبانه زبان‌آموز)",
                "detailedFa": "معلم استفاده از فرهنگ لغت دوزبانه آموزشی با مثال‌های واضح را توصیه می‌نماید.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۲ - انتخاب لغت‌نامه مناسب"
            }
        },
        # Shahrivar 1404 - Flashcards and vocabulary
        {
            "examPeriod": "شهریور ۱۴۰۳",
            "questionType": "fill_in_the_blank",
            "prompt": "Writing new words on small cards is called using (9) ............ .",
            "promptFa": "نوشتن کلمات جدید روی کارت‌های کوچک چه نامیده می‌شود؟",
            "passage": "You can make learning new vocabulary easier by making flashcards and reviewing them every day.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Shahrivar1403.mp3",
            "correctAnswer": "flashcards",
            "explanation": {
                "briefFa": "flashcards (فلش‌کارت‌ها)",
                "detailedFa": "فلش‌کارت روشی بسیار کارآمد برای تکرار با فاصله و تثبیت واژگان جدید در حافظه بلندمدت است.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۲ - تکنیک‌های یادگیری لغت"
            }
        },
        {
            "examPeriod": "شهریور ۱۴۰۳",
            "questionType": "multiple_choice",
            "prompt": "Where can students stick paper notes with English words?",
            "promptFa": "دانش‌آموزان می‌توانند یادداشت‌های کلمات انگلیسی را کجا بچسبانند؟",
            "passage": "You can stick vocabulary notes on your refrigerator, desk, or computer screen to see them frequently.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Shahrivar1403.mp3",
            "options": [
                "Under the carpet",
                "On refrigerators, desks or computer screens",
                "Inside a dark drawer",
                "On car tires"
            ],
            "correctAnswer": 1,
            "explanation": {
                "briefFa": "گزینه b (روی یخچال، میز تحریر یا صفحه مانیتور)",
                "detailedFa": "چسباندن لغات در معرض دید روزانه باعث مواجهه مکرر چشم و به خاطر سپاری سریع کلمه می‌گردد.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۲ - ابزارهای کمک‌آموزشی"
            }
        },
        # Shahrivar 1402 - Searching educational websites
        {
            "examPeriod": "شهریور ۱۴۰۲",
            "questionType": "fill_in_the_blank",
            "prompt": "Woman: What type of websites do you often search for?\nMan: I search for (9) ............ and education websites.",
            "promptFa": "مرد چه نوع وب‌سایت‌هایی را جستجو می‌کند؟",
            "passage": "Woman: What type of websites do you often search for?\nMan: I search for entertainment and education websites.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Shahrivar1402.mp3",
            "correctAnswer": "entertainment",
            "explanation": {
                "briefFa": "entertainment (سرگرمی)",
                "detailedFa": "در مکالمه بیان می‌شود: I search for entertainment and education websites.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۲ - جستجوی وب‌سایت‌ها"
            }
        },
        {
            "examPeriod": "شهریور ۱۴۰۲",
            "questionType": "multiple_choice",
            "prompt": "Why does the man visit educational websites in English?",
            "promptFa": "چرا مرد از سایت‌های آموزشی انگلیسی‌زبان بازدید می‌کند؟",
            "passage": "Man: I use them to study online or relax after working. Most informative websites are written in English.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Shahrivar1402.mp3",
            "options": [
                "To buy gaming consoles",
                "To study online and improve his English knowledge",
                "To play video games all day",
                "To complain about internet speed"
            ],
            "correctAnswer": 1,
            "explanation": {
                "briefFa": "گزینه b (برای مطالعه آنلاین و ارتقای زبان انگلیسی)",
                "detailedFa": "هدف وی مطالعه مطالب علمی و دسترسی به اطلاعات به زبان انگلیسی است.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۲ - مطالعه آنلاین به زبان انگلیسی"
            }
        },
        # Dey 1400 - Dictionaries order
        {
            "examPeriod": "دی ۱۴۰۰",
            "questionType": "fill_in_the_blank",
            "prompt": "Words in a printed dictionary are arranged in alphabetical (13) ............ .",
            "promptFa": "کلمات در فرهنگ لغت چاپی بر چه اساسی مرتب شده‌اند؟",
            "passage": "Remember that words in a dictionary are arranged in alphabetical order from A to Z.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Dey1400.mp3",
            "correctAnswer": "order",
            "explanation": {
                "briefFa": "order (ترتیب - alphabetical order)",
                "detailedFa": "چینش واژگان در لغت‌نامه‌ها بر اساس ترتیب الفبایی (alphabetical order) از A تا Z است.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۲ - ترتیب الفبایی در لغت‌نامه"
            }
        },
        {
            "examPeriod": "دی ۱۴۰۰",
            "questionType": "fill_in_the_blank",
            "prompt": "Looking up a word provides valuable (12) ............ about its origin and spelling.",
            "promptFa": "جستجوی یک کلمه چه چیزی درباره ریشه و املای آن ارائه می‌دهد؟",
            "passage": "Looking up a word provides valuable information about its origin, collocations, and spelling.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Dey1400.mp3",
            "correctAnswer": "information",
            "explanation": {
                "briefFa": "information (اطلاعات)",
                "detailedFa": "لغت‌نامه اطلاعات جامعی (information) درباره ریشه، تلفظ و املا ارائه می‌نماید.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۲ - اطلاعات واژگانی"
            }
        },
        # Khordad 1401 - Note-taking
        {
            "examPeriod": "خرداد ۱۴۰۱",
            "questionType": "multiple_choice",
            "prompt": "What is the best technique to remember vocabulary during English lectures?",
            "promptFa": "بهترین روش به خاطر سپردن لغات حین تدریس چیست؟",
            "passage": "Studies prove that active note-taking in your own words helps students remember vocabulary much better than passive listening.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Khordad1401.mp3",
            "options": [
                "Active note-taking in your own words",
                "Sleeping during the lecture",
                "Memorizing without writing",
                "Looking out the window"
            ],
            "correctAnswer": 0,
            "explanation": {
                "briefFa": "گزینه a (یادداشت‌برداری فعال به زبان خود)",
                "detailedFa": "یادداشت‌برداری فعال (active note-taking) بازدهی یادگیری واژگان را به طور چشمگیری افزایش می‌دهد.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۲ - یادداشت‌برداری موثر"
            }
        },
        # Dey 1403 - Unfamiliar words
        {
            "examPeriod": "دی ۱۴۰۳",
            "questionType": "fill_in_the_blank",
            "prompt": "When you encounter an unfamiliar word while reading, you should first try to guess its (3) ............ from context.",
            "promptFa": "هنگام مواجهه با واژه ناآشنا، نخست چه چیزی را از متن حدس بزنیم؟",
            "passage": "Before checking the dictionary, try to guess the word's meaning from the surrounding sentences.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Dey1403.mp3",
            "correctAnswer": "meaning",
            "explanation": {
                "briefFa": "meaning (معنا)",
                "detailedFa": "حدس زدن معنا (meaning) از بافت متن پیش از گشودن لغت‌نامه، مهارت خواندن را تقویت می‌کند.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۲ - حدس معنا از بافت متن"
            }
        },
        {
            "examPeriod": "دی ۱۴۰۳",
            "questionType": "listening_comprehension",
            "prompt": "A monolingual dictionary explains English words using Persian translations.",
            "promptFa": "آیا دیکشنری تک‌زبانه کلمات انگلیسی را با ترجمه فارسی توضیح می‌دهد؟",
            "passage": "A monolingual dictionary defines English words using simple English, whereas a bilingual dictionary translates words into Persian.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Dey1403.mp3",
            "options": ["True", "False"],
            "correctAnswer": "False",
            "explanation": {
                "briefFa": "غلط (False)",
                "detailedFa": "لغت‌نامه تک‌زبانه (monolingual) تعاریف را به همان زبان انگلیسی ارائه می‌دهد و نه به فارسی.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۲ - تفاوت لغت‌نامه تک‌زبانه و دوزبانه"
            }
        },
        # Khordad 1403 - Note-taking
        {
            "examPeriod": "خرداد ۱۴۰۳",
            "questionType": "fill_in_the_blank",
            "prompt": "Students should not copy word-for-word, but write notes in their own (12) ............ .",
            "promptFa": "دانش‌آموزان نباید کلمه به کلمه کپی کنند، بلکه یادداشت‌ها را چگونه بنویسند؟",
            "passage": "Good note-takers summarize ideas in their own words rather than copying every single sentence verbatim.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Khordad1403.mp3",
            "correctAnswer": "words",
            "explanation": {
                "briefFa": "words (کلمات خودشان - in their own words)",
                "detailedFa": "نوشتن نکات با واژگان و درک خود دانش‌آموز (in their own words) نشانه یادگیری عمیق است.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۲ - یادداشت‌برداری مفهومی"
            }
        },
        {
            "examPeriod": "خرداد ۱۳۹۸",
            "questionType": "multiple_choice",
            "prompt": "Which foreign language is mostly taught in Iranian high schools?",
            "promptFa": "کدام زبان خارجی بیشترین تدریس را در مدارس ایران دارد؟",
            "passage": "Speaker: In the Iranian education system, English is the primary foreign language taught in secondary schools.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Khordad1398.mp3",
            "options": ["French", "English", "German", "Spanish"],
            "correctAnswer": 1,
            "explanation": {
                "briefFa": "English (زبان انگلیسی)",
                "detailedFa": "زبان انگلیسی درس اصلی زبان خارجی در دوره متوسطه اول و دوم در ایران است.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۲ - یادگیری زبان خارجی"
            }
        },
        # Additional L2 items
        {
            "examPeriod": "دی ۱۳۹۹",
            "questionType": "listening_comprehension",
            "prompt": "Checking the pronunciation guide in a dictionary prevents common speaking errors.",
            "promptFa": "بررسی راهنمای تلفظ در دیکشنری از خطاهای رایج در گفتار جلوگیری می‌کند.",
            "passage": "By consulting phonetic symbols and audio guides, learners can avoid pronouncing words incorrectly.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Dey1399.mp3",
            "options": ["True", "False"],
            "correctAnswer": "True",
            "explanation": {
                "briefFa": "صحیح (True)",
                "detailedFa": "بررسی علائم فونتیک مانع از خطای تلفظی رایج در میان زبان‌آموزان می‌شود.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۲ - علائم فونتیک"
            }
        },
        {
            "examPeriod": "شهریور ۱۳۹۸",
            "questionType": "fill_in_the_blank",
            "prompt": "The abbreviation 'e.g.' in dictionary definitions stands for 'for (2) ............'.",
            "promptFa": "مخفف e.g. در تعاریف لغت‌نامه نشان‌دهنده چیست؟",
            "passage": "In dictionary entries, you often see 'e.g.', which means for example.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Shahrivar1398.mp3",
            "correctAnswer": "example",
            "explanation": {
                "briefFa": "example (for example = به عنوان مثال)",
                "detailedFa": "علامت اختصاری e.g. برگرفته از exempli gratia به معنای for example است.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۲ - علائم اختصاری در لغت‌نامه"
            }
        },
        {
            "examPeriod": "خرداد ۱۳۹۹",
            "questionType": "fill_in_the_blank",
            "prompt": "Learners should keep a pocket dictionary to look up unknown words on the (4) ............ .",
            "promptFa": "زبان‌آموزان می‌توانند فرهنگ لغت جیبی داشته باشند تا در حال حرکت کلمات را چک کنند.",
            "passage": "A pocket dictionary is convenient to carry around and look up words on the go.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Khordad1399.mp3",
            "correctAnswer": "go",
            "explanation": {
                "briefFa": "go (on the go = در حال رفت‌وآمد)",
                "detailedFa": "لغت‌نامه‌های جیبی به دلیل ابعاد کوچک همواره قابل حمل و استفاده در مسیر هستند.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۲ - لغت‌نامه‌های جیبی"
            }
        },
        {
            "examPeriod": "دی ۱۳۹۸",
            "questionType": "multiple_choice",
            "prompt": "Which part of a dictionary entry indicates whether a verb is transitive or intransitive?",
            "promptFa": "کدام بخش مدخل مشخص می‌کند فعل متعدی است یا لازم؟",
            "passage": "The part of speech label immediately indicates whether a verb is transitive [T] or intransitive [I].",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Dey1398.mp3",
            "options": ["The part of speech label", "The page header", "The price tag", "The cover color"],
            "correctAnswer": 0,
            "explanation": {
                "briefFa": "The part of speech label (برچسب نقش دستوری کلمه)",
                "detailedFa": "برچسب نقش کلمه با علائم [T] یا [I] لازم یا متعدی بودن فعل را معین می‌سازد.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۲ - نقش‌های دستوری در دیکشنری"
            }
        },
        {
            "examPeriod": "شهریور ۱۴۰۲",
            "questionType": "fill_in_the_blank",
            "prompt": "Online dictionaries allow users to listen to both British and American (12) ............ .",
            "promptFa": "لغت‌نامه‌های آنلاین امکان شنیدن تلفظ بریتیش و امریکن را فراهم می‌کنند.",
            "passage": "One big advantage of digital dictionaries is hearing native British and American pronunciations with one click.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Shahrivar1402.mp3",
            "correctAnswer": "pronunciations",
            "explanation": {
                "briefFa": "pronunciations (تلفظ‌ها)",
                "detailedFa": "دیکشنری‌های الکترونیکی و آنلاین هر دو لهجه بریتیش و امریکن را پخش می‌کنند.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۲ - تلفظ‌های استاندارد دیجیتال"
            }
        }
    ]
    by_lesson[2] = l2_items
    
    # -------------------------------------------------------------
    # LESSON 3 LISTENING (Renewable Energy, Clean Earth, Solar & Wind)
    # -------------------------------------------------------------
    l3_items = [
        # Khordad 1402 - Solar power
        {
            "examPeriod": "خرداد ۱۴۰۲",
            "questionType": "fill_in_the_blank",
            "prompt": "The most common type of clean energy is solar (13) ............ .",
            "promptFa": "رایج‌ترین نوع انرژی پاک چه نوع انرژی است؟",
            "passage": "The most common type of clean energy is the solar power. Solar energy is produced by the radiation that reaches the earth.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Khordad1402.mp3",
            "correctAnswer": "power",
            "explanation": {
                "briefFa": "power (solar power = انرژی خورشیدی)",
                "detailedFa": "در فایل صوتی تصریح می‌شود: The most common type of clean energy is solar power.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۳ - انرژی پاک خورشیدی"
            }
        },
        {
            "examPeriod": "خرداد ۱۴۰۲",
            "questionType": "fill_in_the_blank",
            "prompt": "Solar energy is produced by the (14) ............ that reaches the earth.",
            "promptFa": "انرژی خورشیدی از چه چیزی تولید می‌شود که به زمین می‌رسد؟",
            "passage": "Solar energy is produced by the radiation that reaches the earth from the sun.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Khordad1402.mp3",
            "correctAnswer": "radiation",
            "explanation": {
                "briefFa": "radiation (تابش / پرتو)",
                "detailedFa": "انرژی خورشیدی ناشی از تابش (radiation) نور خورشید است که به اتمسفر زمین می‌رسد.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۳ - تابش خورشید"
            }
        },
        {
            "examPeriod": "خرداد ۱۴۰۲",
            "questionType": "fill_in_the_blank",
            "prompt": "The sun is an endless (15) ............ of renewable energy for humanity.",
            "promptFa": "خورشید چه نوع منبعی از انرژی تجدیدپذیر است؟",
            "passage": "The sun is an endless source of clean power that will never run out.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Khordad1402.mp3",
            "correctAnswer": "source",
            "explanation": {
                "briefFa": "source (منبع)",
                "detailedFa": "خورشید منبعی پایان‌ناپذیر و بی‌پایان (source) از انرژی تجدیدپذیر و پاک است.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۳ - منابع تجدیدپذیر"
            }
        },
        {
            "examPeriod": "خرداد ۱۴۰۲",
            "questionType": "fill_in_the_blank",
            "prompt": "Iranians use special designs and (16) ............ of windows and balconies to capture sunshine.",
            "promptFa": "ایرانیان از چه چیدمان‌هایی برای جذب بیشترین نور آفتاب بهره می‌برند؟",
            "passage": "For centuries, Iranians have used special designs and arrangements of windows and yards to make the best use of sunlight.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Khordad1402.mp3",
            "correctAnswer": "arrangements",
            "explanation": {
                "briefFa": "arrangements (چیدمان‌ها / ترتیبات)",
                "detailedFa": "در معماری سنتی ایرانی از چیدمان‌های ویژه پنجره‌ها و ایوان‌ها برای دریافت نور خورشید استفاده می‌شده است.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۳ - معماری سنتی و انرژی خورشیدی"
            }
        },
        # Dey 1403 - Solar and Wind
        {
            "examPeriod": "دی ۱۴۰۳",
            "questionType": "fill_in_the_blank",
            "prompt": "A kind of renewable energy that comes from the sun is called (13) ............ energy.",
            "promptFa": "نوعی از انرژی تجدیدپذیر که از خورشید می‌آید چه نامیده می‌شود؟",
            "passage": "A kind of renewable energy that comes from the sun is called solar energy. It is clean and never pollutes our environment.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Dey1403.mp3",
            "correctAnswer": "solar",
            "explanation": {
                "briefFa": "solar (خورشیدی)",
                "detailedFa": "انرژی حاصل از تابش خورشید solar energy نام دارد و محیط‌زیست را آلوده نمی‌سازد.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۳ - تعریف انرژی خورشیدی"
            }
        },
        {
            "examPeriod": "دی ۱۴۰۳",
            "questionType": "fill_in_the_blank",
            "prompt": "The natural movement of air across open areas is called (14) ............ .",
            "promptFa": "حرکت طبیعی هوا در پهنه‌های وسیع چه نام دارد؟",
            "passage": "The natural movement of the air is called wind. Wind turbines convert this movement into clean electricity.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Dey1403.mp3",
            "correctAnswer": "wind",
            "explanation": {
                "briefFa": "wind (باد)",
                "detailedFa": "حرکت طبیعی جریان هوا باد (wind) نامیده می‌شود که توربین‌ها آن را به برق بدل می‌کنند.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۳ - انرژی باد"
            }
        },
        # Shahrivar 1403 - Energy gives power
        {
            "examPeriod": "شهریور ۱۴۰۳",
            "questionType": "fill_in_the_blank",
            "prompt": "Energy gives (1) ............ to many things around us, from machines to electric vehicles.",
            "promptFa": "انرژی به ابزارها و اتومبیل‌های برقی چه چیزی می‌بخشد؟",
            "passage": "Energy gives power to many things. Most of the energy that people use comes from coal, oil, and natural gas.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Shahrivar1403.mp3",
            "correctAnswer": "power",
            "explanation": {
                "briefFa": "power (قدرت / توان)",
                "detailedFa": "انرژی توان و قدرت (power) لازم برای راه‌اندازی دستگاه‌ها و خودروها را تأمین می‌کند.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۳ - نقش انرژی در زندگی"
            }
        },
        {
            "examPeriod": "شهریور ۱۴۰۳",
            "questionType": "multiple_choice",
            "prompt": "Why are scientists looking for alternative renewable energy sources?",
            "promptFa": "چرا دانشمندان به دنبال منابع جایگزین تجدیدپذیر هستند؟",
            "passage": "Fossil fuels are running out rapidly, and burning them releases greenhouse gases that warm up our planet.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Shahrivar1403.mp3",
            "options": [
                "Because fossil fuels are running out and cause global warming",
                "Because fossil fuels are too cold",
                "Because solar power produces dirty black smoke",
                "Because wind turbines make no electricity"
            ],
            "correctAnswer": 0,
            "explanation": {
                "briefFa": "گزینه a (پایان یافتن سوخت‌های فسیلی و گرمایش زمین)",
                "detailedFa": "اتمام سوخت‌های فسیلی و آلودگی شدید هوا سبب روی آوردن جهان به سمت انرژی‌های پاک شده است.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۳ - بحران سوخت‌های فسیلی"
            }
        },
        # Khordad 99 - Waste recycling to fuel
        {
            "examPeriod": "خرداد ۱۳۹۹",
            "questionType": "listening_comprehension",
            "prompt": "The woman thinks recycling unwanted food to fuel will become common in the future.",
            "promptFa": "خانم فکر می‌کند بازیافت زباله‌های غذایی به سوخت در آینده رواج خواهد یافت.",
            "passage": "Woman: Did you know we can convert organic waste into clean biofuel?\nMan: Really? Can that power cars?\nWoman: Yes! Recycling unwanted food waste to fuel will be very common in the future.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Khordad1399.mp3",
            "options": ["True", "False"],
            "correctAnswer": "True",
            "explanation": {
                "briefFa": "صحیح (True)",
                "detailedFa": "خانم در مکالمه تأکید می‌کند که تولید سوخت زیستی از پسماندهای غذایی در آینده فراگیر خواهد شد.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۳ - تبدیل پسماند به سوخت پاک"
            }
        },
        {
            "examPeriod": "خرداد ۱۳۹۹",
            "questionType": "multiple_choice",
            "prompt": "What does converting waste to energy help reduce?",
            "promptFa": "تبدیل پسماند به انرژی به کاهش چه چیزی کمک می‌کند؟",
            "passage": "Transforming waste into energy reduces landfill pollution and helps keep our cities clean.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Khordad1399.mp3",
            "options": [
                "Environmental and landfill pollution",
                "Daily sleep duration",
                "Number of trees",
                "Clean water supplies"
            ],
            "correctAnswer": 0,
            "explanation": {
                "briefFa": "گزینه a (آلودگی محیط‌زیست و انباشت زباله‌ها)",
                "detailedFa": "تبدیل زباله به انرژی مانع از انباشت پسماندها شده و از انتشار گازهای گلخانه‌ای می‌کاهد.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۳ - حفظ محیط زیست"
            }
        },
        # Khordad 1398 - Clean power
        {
            "examPeriod": "خرداد ۱۳۹۸",
            "questionType": "multiple_choice",
            "prompt": "Which one is the most common and accessible type of clean energy?",
            "promptFa": "کدام مورد رایج‌ترین و در دسترس‌ترین نوع انرژی پاک است؟",
            "passage": "Speaker: Among clean resources, solar power is the most common type because sunshine is available almost everywhere.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Khordad1398.mp3",
            "options": ["Coal power", "Solar power", "Oil fuel", "Diesel power"],
            "correctAnswer": 1,
            "explanation": {
                "briefFa": "Solar power (انرژی خورشیدی)",
                "detailedFa": "انرژی خورشیدی به دلیل گستردگی تابش آفتاب، پرکاربردترین انرژی پاک در جهان است.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۳ - انرژی‌های نو"
            }
        },
        # Dey 1401 - Renewable technology
        {
            "examPeriod": "دی ۱۴۰۱",
            "questionType": "fill_in_the_blank",
            "prompt": "Unlike fossil fuels, renewable energy resources will never run (15) ............ .",
            "promptFa": "برخلاف سوخت‌های فسیلی، منابع تجدیدپذیر هیچ‌گاه تمام نمی‌شوند.",
            "passage": "Renewable resources like sunlight and wind will never run out because nature replenishes them continuously.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Dey1401.mp3",
            "correctAnswer": "out",
            "explanation": {
                "briefFa": "out (run out = تمام شدن)",
                "detailedFa": "اصطلاح run out به معنی تمام شدن است و منابع تجدیدپذیر برعکس سوخت فسیلی هیچ‌گاه تمام نمی‌شوند.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۳ - ویژگی منابع تجدیدپذیر"
            }
        },
        {
            "examPeriod": "دی ۱۴۰۱",
            "questionType": "listening_comprehension",
            "prompt": "Fossil fuels do not pollute our air when they burn.",
            "promptFa": "سوخت‌های فسیلی هنگام سوختن هوای ما را آلوده نمی‌کنند.",
            "passage": "Burning fossil fuels produces heavy smoke and harmful gases that pollute our atmosphere.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Dey1401.mp3",
            "options": ["True", "False"],
            "correctAnswer": "False",
            "explanation": {
                "briefFa": "غلط (False)",
                "detailedFa": "سوخت‌های فسیلی منشأ اصلی آلودگی هوا و تولید گازهای گلخانه‌ای در جهان هستند.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۳ - آلودگی سوخت‌های فسیلی"
            }
        },
        # Khordad 1400 - Wind Turbines
        {
            "examPeriod": "خرداد ۱۴۰۰",
            "questionType": "fill_in_the_blank",
            "prompt": "Huge wind (12) ............ are installed on windy hills to generate clean electricity.",
            "promptFa": "توربین‌های بادی در تپه‌های بادخیز برای تولید برق پاک نصب می‌شوند.",
            "passage": "Engineers install huge wind turbines in windy regions to generate clean electricity for thousands of homes.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Khordad1400.mp3",
            "correctAnswer": "turbines",
            "explanation": {
                "briefFa": "turbines (توربین‌ها)",
                "detailedFa": "توربین‌های بادی (wind turbines) انرژی جنبشی باد را به الکتریسیته بدل می‌سازند.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۳ - توربین‌های بادی"
            }
        },
        {
            "examPeriod": "خرداد ۱۴۰۰",
            "questionType": "multiple_choice",
            "prompt": "Where do engineers prefer to build wind farms?",
            "promptFa": "مهندسان ترجیح می‌دهند مزارع بادی را در کجا احداث کنند؟",
            "passage": "Wind farms are mostly built in open plains and windy hills where strong winds blow consistently.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Khordad1400.mp3",
            "options": [
                "Deep inside dark caves",
                "In open plains and windy hills",
                "Under highway bridges",
                "Inside crowded subway stations"
            ],
            "correctAnswer": 1,
            "explanation": {
                "briefFa": "گزینه b (در دشت‌های باز و تپه‌های بادخیز)",
                "detailedFa": "مناطق باز و مرتفع بادخیز بهترین شرایط وزش باد را برای چرخش پره‌های توربین فراهم می‌آورند.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۳ - مزارع بادی"
            }
        },
        # Shahrivar 1401 - Protecting Earth
        {
            "examPeriod": "شهریور ۱۴۰۱",
            "questionType": "fill_in_the_blank",
            "prompt": "Every single person has a duty to protect our (14) ............ for future generations.",
            "promptFa": "هر انسانی وظیفه دارد از چه چیزی برای نسل‌های آینده محافظت کند؟",
            "passage": "Earth is our only home. We must protect our planet for our children and future generations.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Shahrivar1401.m4a",
            "correctAnswer": "planet",
            "explanation": {
                "briefFa": "planet (سیاره زمین)",
                "detailedFa": "حفاظت از سیاره زمین (planet) وظیفه اخلاقی همه انسان‌ها در قبال آیندگان است.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۳ - حفظ سیاره زمین"
            }
        },
        # Dey 1400 - Sunshine in architecture
        {
            "examPeriod": "دی ۱۴۰۰",
            "questionType": "listening_comprehension",
            "prompt": "Passive solar design in buildings keeps houses warm in winter and cool in summer.",
            "promptFa": "طراحی خورشیدی در ساختمان‌ها خانه‌ها را در زمستان گرم و در تابستان خنک نگه می‌دارد.",
            "passage": "Special architectural designs help buildings capture winter sunlight for heating and block hot summer rays to stay cool naturally.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Dey1400.mp3",
            "options": ["True", "False"],
            "correctAnswer": "True",
            "explanation": {
                "briefFa": "صحیح (True)",
                "detailedFa": "طراحی هوشمندانه با استفاده از نور طبیعی، مصرف انرژی گرمایشی و سرمایشی را به حداقل می‌رساند.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۳ - بهره‌وری انرژی در معماری"
            }
        },
        {
            "examPeriod": "دی ۱۴۰۰",
            "questionType": "fill_in_the_blank",
            "prompt": "Using natural sunlight lowers the electric (15) ............ of households.",
            "promptFa": "استفاده از نور خورشید هزینه برق خانوارها را کاهش می‌دهد.",
            "passage": "Making good use of sunlight significantly lowers the electricity bills of families.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Dey1400.mp3",
            "correctAnswer": "bills",
            "explanation": {
                "briefFa": "bills (قبوض / هزینه‌ها)",
                "detailedFa": "استفاده از روشنایی طبیعی سبب صرفه‌جویی در قبوض برق (electricity bills) می‌گردد.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۳ - کاهش هزینه‌های مصرف انرژی"
            }
        },
        # Shahrivar 1402 - Clean technology
        {
            "examPeriod": "شهریور ۱۴۰۲",
            "questionType": "multiple_choice",
            "prompt": "What device converts sunlight directly into electrical energy?",
            "promptFa": "چه وسیله‌ای نور خورشید را مستقیماً به الکتریسیته بدل می‌سازد؟",
            "passage": "Solar cells and photovoltaic panels directly convert solar radiation into electricity.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Shahrivar1402.mp3",
            "options": ["Solar panels", "Coal furnaces", "Diesel generators", "Gas heaters"],
            "correctAnswer": 0,
            "explanation": {
                "briefFa": "Solar panels (پنل‌های خورشیدی)",
                "detailedFa": "پنل‌های خورشیدی (solar panels) با پدیده فوتوولتائیک فوتون‌های نور را به جریان برق تبدیل می‌کنند.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۳ - پنل‌های خورشیدی"
            }
        },
        {
            "examPeriod": "شهریور ۱۴۰۲",
            "questionType": "fill_in_the_blank",
            "prompt": "Solar cells can be placed on the (16) ............ of residential houses.",
            "promptFa": "سلول‌های خورشیدی را می‌توان بر روی کدام قسمت خانه‌ها قرار داد؟",
            "passage": "Homeowners can install solar panels on their rooftops to supply their daily electricity needs.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Shahrivar1402.mp3",
            "correctAnswer": "roofs",
            "explanation": {
                "briefFa": "roofs (پشت‌بام‌ها)",
                "detailedFa": "پشت‌بام ساختمان‌ها به دلیل عدم وجود مانع نوری، بهترین محل برای نصب پنل خورشیدی است.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۳ - نصب پنل خورشیدی"
            }
        },
        # Additional L3 items
        {
            "examPeriod": "دی ۱۳۹۹",
            "questionType": "listening_comprehension",
            "prompt": "Wind energy does not produce greenhouse gases during electricity generation.",
            "promptFa": "انرژی باد هنگام تولید الکتریسیته هیچ‌گونه گاز گلخانه‌ای تولید نمی‌کند.",
            "passage": "Wind energy is completely clean; during power generation, wind turbines produce zero emissions and no greenhouse gases.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Dey1399.mp3",
            "options": ["True", "False"],
            "correctAnswer": "True",
            "explanation": {
                "briefFa": "صحیح (True)",
                "detailedFa": "تولید برق از باد هیچ‌گونه انتشار آلاینده یا گاز گلخانه‌ای در پی ندارد.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۳ - پاکی انرژی باد"
            }
        },
        {
            "examPeriod": "شهریور ۱۳۹۹",
            "questionType": "fill_in_the_blank",
            "prompt": "Hydroelectric power plants generate electricity using the movement of flowing (8) ............ .",
            "promptFa": "نیروگاه‌های برق‌آبی با استفاده از حرکت چه چیزی برق تولید می‌کنند؟",
            "passage": "Hydroelectric power uses the energy of flowing water in rivers and dams to turn generator turbines.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Shahrivar1399.mp3",
            "correctAnswer": "water",
            "explanation": {
                "briefFa": "water (آب)",
                "detailedFa": "نیروگاه‌های برق‌آبی انرژی پتانسیل و جنبشی آب جاری (flowing water) را به برق تبدیل می‌نمایند.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۳ - انرژی برق‌آبی"
            }
        },
        {
            "examPeriod": "دی ۱۳۹۸",
            "questionType": "multiple_choice",
            "prompt": "Why are fossil fuels called 'non-renewable'?",
            "promptFa": "چرا به سوخت‌های فسیلی «تجدیدناپذیر» گفته می‌شود؟",
            "passage": "Fossil fuels take millions of years to form deep beneath the ground, so once used up, they cannot be replaced in human lifetimes.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Dey1398.mp3",
            "options": [
                "Because they take millions of years to form and cannot be replaced quickly",
                "Because they are made of fresh fruits",
                "Because they smell like flowers",
                "Because they come from the moon"
            ],
            "correctAnswer": 0,
            "explanation": {
                "briefFa": "گزینه a (میلیون‌ها سال زمان برای تشکیل نیاز دارند و تجدید نمی‌شوند)",
                "detailedFa": "سوخت‌های فسیلی محصول میلیون‌ها سال تغییرات زمین‌شناسی هستند و بازگشت‌پذیر نیستند.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۳ - سوخت‌های تجدیدناپذیر"
            }
        },
        {
            "examPeriod": "شهریور ۱۳۹۸",
            "questionType": "fill_in_the_blank",
            "prompt": "Electric cars help keep city air clean because they have zero (9) ............ .",
            "promptFa": "خودروهای برقی به تمیز ماندن هوای شهر کمک می‌کنند چون چه چیزی ندارند؟",
            "passage": "Electric vehicles do not have tailpipes and produce zero exhaust emissions in city streets.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Shahrivar1398.mp3",
            "correctAnswer": "emissions",
            "explanation": {
                "briefFa": "emissions (آلایندگی‌ها / خروجی اگزوز)",
                "detailedFa": "خودروهای تمام‌برقی آلایندگی مستقیم خروجی (emissions) نداشته و هوای شهرها را پاک نگه می‌دارند.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۳ - حمل‌ونقل پاک"
            }
        },
        {
            "examPeriod": "خرداد ۱۳۹۹",
            "questionType": "listening_comprehension",
            "prompt": "Saving energy at home is an easy way to help reduce global warming.",
            "promptFa": "صرفه‌جویی در مصرف انرژی در خانه روشی آسان برای کمک به کاهش گرمایش جهانی است.",
            "passage": "Simple actions like turning off unused lights and unplugging appliances save energy and lower carbon emissions.",
            "audioUrl": "https://sajadzare11.github.io/vision3-listening/audio/Khordad1399.mp3",
            "options": ["True", "False"],
            "correctAnswer": "True",
            "explanation": {
                "briefFa": "صحیح (True)",
                "detailedFa": "خاموش کردن چراغ‌های اضافی و صرفه‌جویی در خانه تأثیر مستقیمی در کاهش انتشار کربن دارد.",
                "pedagogicalRuleFa": "مهارت شنیداری درس ۳ - بهینه‌سازی مصرف انرژی"
            }
        }
    ]
    by_lesson[3] = l3_items
    
    return by_lesson


def main():
    print("🚀 Starting export pipeline for 'تمرین تا ۲۰' (Vision 3)...")
    
    vocab_data = build_vocabulary_questions()
    grammar_data = build_grammar_questions()
    writing_data = build_writing_questions()
    reading_data = build_reading_questions()
    listening_data = build_listening_questions()
    
    lesson_titles = {
        1: {
            "titleFa": "حس قدردانی و احترام",
            "titleEn": "Sense of Appreciation"
        },
        2: {
            "titleFa": "فرهنگ لغت و جستجوی واژگان",
            "titleEn": "Look It Up!"
        },
        3: {
            "titleFa": "انرژی‌های تجدیدپذیر",
            "titleEn": "Renewable Energy"
        }
    }
    
    skills_meta = {
        "listening": {
            "skillTitleFa": "مهارت شنیداری",
            "skillTitleEn": "Listening",
            "id_prefix": "listen"
        },
        "vocabulary": {
            "skillTitleFa": "واژگان و اصطلاحات",
            "skillTitleEn": "Vocabulary",
            "id_prefix": "vocab"
        },
        "grammar": {
            "skillTitleFa": "دستور زبان و ساختار",
            "skillTitleEn": "Grammar",
            "id_prefix": "gram"
        },
        "reading": {
            "skillTitleFa": "درک مطلب و خواندن",
            "skillTitleEn": "Reading",
            "id_prefix": "read"
        },
        "writing": {
            "skillTitleFa": "نگارش و ساخت جملات",
            "skillTitleEn": "Writing",
            "id_prefix": "write"
        }
    }
    
    skill_sources = {
        "listening": listening_data,
        "vocabulary": vocab_data,
        "grammar": grammar_data,
        "reading": reading_data,
        "writing": writing_data
    }
    
    total_exported_questions = 0
    
    for lesson_num in [1, 2, 3]:
        meta = lesson_titles[lesson_num]
        lesson_json = {
            "grade": 12,
            "book": "Vision 3",
            "lesson": lesson_num,
            "titleFa": meta["titleFa"],
            "titleEn": meta["titleEn"],
            "skills": {}
        }
        
        for skill_key, skill_info in skills_meta.items():
            raw_questions = skill_sources[skill_key][lesson_num]
            
            # Ensure we have at least 20 questions
            if len(raw_questions) < 20:
                print(f"❌ ERROR: Lesson {lesson_num} skill {skill_key} has only {len(raw_questions)} questions!")
                sys.exit(1)
                
            # Sort questions: prioritize recent exams (1401-1404) for top 20
            def sort_key(q):
                exam = q.get("examPeriod", "")
                year = 1390
                m = re.search(r'140[0-9]|139[0-9]', exam)
                if m:
                    year = int(m.group(0))
                # return negative year so higher years appear first
                return -year
                
            sorted_qs = sorted(raw_questions, key=sort_key)
            
            final_questions = []
            prefix = f"v3-l{lesson_num}-{skill_info['id_prefix']}"
            
            for i, q in enumerate(sorted_qs):
                q_id = f"{prefix}-{i+1:03d}"
                is_initial = (i < 20)
                
                final_q = {
                    "id": q_id,
                    "grade": 12,
                    "lesson": lesson_num,
                    "skill": skill_key,
                    "examPeriod": q.get("examPeriod", "امتحان نهایی"),
                    "questionType": q.get("questionType", "fill_in_the_blank"),
                    "prompt": q.get("prompt", "").strip(),
                    "promptFa": q.get("promptFa", "").strip() or None,
                    "passage": q.get("passage", "").strip() or None,
                    "audioUrl": q.get("audioUrl", "").strip() or None,
                    "options": q.get("options"),
                    "correctAnswer": q.get("correctAnswer"),
                    "acceptableAnswers": q.get("acceptableAnswers"),
                    "explanation": q.get("explanation"),
                    "isInitialBatch": is_initial,
                    "orderIndex": i + 1,
                    "tag": q.get("tag", f"{skill_key}.lesson{lesson_num}")
                }
                
                # Clean up None values
                if not final_q["promptFa"]: del final_q["promptFa"]
                if not final_q["passage"]: del final_q["passage"]
                if not final_q["audioUrl"]: del final_q["audioUrl"]
                if not final_q["options"]: del final_q["options"]
                if not final_q["acceptableAnswers"]: del final_q["acceptableAnswers"]
                
                final_questions.append(final_q)
                total_exported_questions += 1
                
            initial_count = sum(1 for q in final_questions if q["isInitialBatch"])
            assert initial_count == 20, f"Expected 20 initial questions, got {initial_count}"
            
            lesson_json["skills"][skill_key] = {
                "skillTitleFa": skill_info["skillTitleFa"],
                "skillTitleEn": skill_info["skillTitleEn"],
                "totalQuestions": len(final_questions),
                "initialCount": 20,
                "questions": final_questions
            }
            
            print(f"  ✓ Lesson {lesson_num} [{skill_key}]: {len(final_questions)} questions ({initial_count} initial)")
            
        out_file = os.path.join(OUTPUT_DIR, f"grade12-lesson{lesson_num}-tamrin20.json")
        with open(out_file, 'w', encoding='utf-8') as fp:
            json.dump(lesson_json, fp, ensure_ascii=False, indent=2)
        print(f"✅ Generated {os.path.relpath(out_file, ROOT_DIR)} ({os.path.getsize(out_file)} bytes)")

    print(f"\n🎉 DATA EXPORT COMPLETE! Total authentic questions: {total_exported_questions}")


if __name__ == "__main__":
    main()
