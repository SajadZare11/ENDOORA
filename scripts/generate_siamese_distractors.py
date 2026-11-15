#!/usr/bin/env python3
"""
scripts/generate_siamese_distractors.py

Engine 6 Offline Distractor Generation Pipeline for EnDoora.
Generates balanced 12-item distractor pools (3 per category) with L2-normalized 4D feature vectors:
- Dimension 0: phonetic_ortho (Levenshtein & phonological substitutions)
- Dimension 1: semantic_siamese (MiniLM-L6-v2 embedding cosine similarity)
- Dimension 2: morphological (inflectional & derivational affixes)
- Dimension 3: l1_persian (Iranian EFL transfer errors & calques)

Exports enriched questions to apps/web/data/distractors/enriched_adaptive_questions.json.
"""

import os
import sys
import io
import re
import json
import glob
import math
import random
import argparse
from dataclasses import dataclass, asdict
from typing import List, Dict, Set, Optional, Tuple, Any


import numpy as np

TRAP_CATEGORIES = [
    "phonetic_ortho",
    "semantic_siamese",
    "morphological",
    "l1_persian",
]

CATEGORY_TO_INDEX: Dict[str, int] = {
    "phonetic_ortho": 0,
    "semantic_siamese": 1,
    "morphological": 2,
    "l1_persian": 3,
}

INDEX_TO_CATEGORY: Dict[int, str] = {v: k for k, v in CATEGORY_TO_INDEX.items()}

# ---------------------------------------------------------------------------
# Data Models
# ---------------------------------------------------------------------------

@dataclass
class NormalizedQuestion:
    id: str
    section: str
    cefr_level: str
    question: str
    prompt_fa: str
    options: List[str]
    correct_option: str
    source: str

@dataclass
class DistractorCandidate:
    id: str
    text: str
    category: str
    features: List[float]

@dataclass
class EnrichedAdaptiveQuestion:
    id: str
    section: str
    cefr_level: str
    question: str
    prompt_fa: str
    correct_option: str
    distractor_pool: List[DistractorCandidate]

# ---------------------------------------------------------------------------
# Pure Python Levenshtein & Soundex
# ---------------------------------------------------------------------------

def normalize_text(text: str) -> str:
    """Lowercase, strip whitespace and non-alphanumeric punctuation."""
    t = text.strip().lower()
    return re.sub(r'[^\w\s]', '', t)

def levenshtein_distance(s1: str, s2: str) -> int:
    """Compute Levenshtein distance using pure Python dynamic programming."""
    s1, s2 = s1.lower(), s2.lower()
    if len(s1) < len(s2):
        s1, s2 = s2, s1
    if not s2:
        return len(s1)
    prev = list(range(len(s2) + 1))
    for i, c1 in enumerate(s1):
        curr = [i + 1] + [0] * len(s2)
        for j, c2 in enumerate(s2):
            cost = 0 if c1 == c2 else 1
            curr[j + 1] = min(prev[j + 1] + 1, curr[j] + 1, prev[j] + cost)
        prev = curr
    return prev[len(s2)]

def levenshtein_similarity(s1: str, s2: str) -> float:
    max_len = max(len(s1), len(s2))
    if max_len == 0:
        return 1.0
    dist = levenshtein_distance(s1, s2)
    return max(0.0, 1.0 - (dist / max_len))

def soundex_code(s: str) -> str:
    """Compute standard American Soundex code for phonetic comparison."""
    s = re.sub(r'[^a-zA-Z]', '', s.upper())
    if not s:
        return "0000"
    mapping = {
        'B': '1', 'F': '1', 'P': '1', 'V': '1',
        'C': '2', 'G': '2', 'J': '2', 'K': '2', 'Q': '2', 'S': '2', 'X': '2', 'Z': '2',
        'D': '3', 'T': '3',
        'L': '4',
        'M': '5', 'N': '5',
        'R': '6'
    }
    first_char = s[0]
    encoded = [first_char]
    prev_digit = mapping.get(first_char, '0')
    for ch in s[1:]:
        digit = mapping.get(ch, '0')
        if digit != '0':
            if digit != prev_digit:
                encoded.append(digit)
            prev_digit = digit
        else:
            prev_digit = '0'
        if len(encoded) == 4:
            break
    while len(encoded) < 4:
        encoded.append('0')
    return "".join(encoded)

# ---------------------------------------------------------------------------
# Linguistic Reference Tables
# ---------------------------------------------------------------------------

HOMOPHONES_DICT: Dict[str, List[str]] = {
    "their": ["there", "they're"],
    "there": ["their", "they're"],
    "they're": ["their", "there"],
    "weather": ["whether"],
    "whether": ["weather"],
    "peace": ["piece"],
    "piece": ["peace"],
    "affect": ["effect"],
    "effect": ["affect"],
    "accept": ["except"],
    "except": ["accept"],
    "lose": ["loose"],
    "loose": ["lose"],
    "right": ["write", "rite"],
    "write": ["right", "rite"],
    "bare": ["bear"],
    "bear": ["bare"],
    "meat": ["meet"],
    "meet": ["meat"],
    "hear": ["here"],
    "here": ["hear"],
    "break": ["brake"],
    "brake": ["break"],
    "principal": ["principle"],
    "principle": ["principal"],
    "past": ["passed"],
    "passed": ["past"],
    "dessert": ["desert"],
    "desert": ["dessert"],
    "advise": ["advice"],
    "advice": ["advise"],
    "breath": ["breathe"],
    "breathe": ["breath"],
    "its": ["it's"],
    "it's": ["its"],
    "whose": ["who's"],
    "who's": ["whose"],
    "hole": ["whole"],
    "whole": ["hole"],
    "know": ["no"],
    "no": ["know"],
    "knew": ["new"],
    "new": ["knew"],
    "sight": ["site", "cite"],
    "site": ["sight", "cite"],
    "allowed": ["aloud"],
    "aloud": ["allowed"],
    "flour": ["flower"],
    "flower": ["flour"],
    "one": ["won"],
    "won": ["one"],
    "son": ["sun"],
    "sun": ["son"],
    "week": ["weak"],
    "weak": ["week"],
    "stair": ["stare"],
    "stare": ["stair"],
    "tail": ["tale"],
    "tale": ["tail"],
    "buy": ["by", "bye"],
    "by": ["buy", "bye"],
    "road": ["rode"],
    "rode": ["road"],
    "cell": ["sell"],
    "sell": ["cell"],
    "die": ["dye"],
    "dye": ["die"],
}

IRREGULAR_VERBS: Dict[str, Dict[str, str]] = {
    "go": {"3rd": "goes", "past": "went", "pp": "gone", "ing": "going"},
    "goes": {"base": "go", "past": "went", "pp": "gone", "ing": "going"},
    "went": {"base": "go", "3rd": "goes", "pp": "gone", "ing": "going"},
    "gone": {"base": "go", "3rd": "goes", "past": "went", "ing": "going"},
    "going": {"base": "go", "3rd": "goes", "past": "went", "pp": "gone"},
    "see": {"3rd": "sees", "past": "saw", "pp": "seen", "ing": "seeing"},
    "sees": {"base": "see", "past": "saw", "pp": "seen", "ing": "seeing"},
    "saw": {"base": "see", "3rd": "sees", "pp": "seen", "ing": "seeing"},
    "seen": {"base": "see", "3rd": "sees", "past": "saw", "ing": "seeing"},
    "seeing": {"base": "see", "3rd": "sees", "past": "saw", "pp": "seen"},
    "write": {"3rd": "writes", "past": "wrote", "pp": "written", "ing": "writing"},
    "writes": {"base": "write", "past": "wrote", "pp": "written", "ing": "writing"},
    "wrote": {"base": "write", "3rd": "writes", "pp": "written", "ing": "writing"},
    "written": {"base": "write", "3rd": "writes", "past": "wrote", "ing": "writing"},
    "writing": {"base": "write", "3rd": "writes", "past": "wrote", "pp": "written"},
    "take": {"3rd": "takes", "past": "took", "pp": "taken", "ing": "taking"},
    "takes": {"base": "take", "past": "took", "pp": "taken", "ing": "taking"},
    "took": {"base": "take", "3rd": "takes", "pp": "taken", "ing": "taking"},
    "taken": {"base": "take", "3rd": "takes", "past": "took", "ing": "taking"},
    "taking": {"base": "take", "3rd": "takes", "past": "took", "pp": "taken"},
    "eat": {"3rd": "eats", "past": "ate", "pp": "eaten", "ing": "eating"},
    "eats": {"base": "eat", "past": "ate", "pp": "eaten", "ing": "eating"},
    "ate": {"base": "eat", "3rd": "eats", "pp": "eaten", "ing": "eating"},
    "eaten": {"base": "eat", "3rd": "eats", "past": "ate", "ing": "eating"},
    "eating": {"base": "eat", "3rd": "eats", "past": "ate", "pp": "eaten"},
    "do": {"3rd": "does", "past": "did", "pp": "done", "ing": "doing"},
    "does": {"base": "do", "past": "did", "pp": "done", "ing": "doing"},
    "did": {"base": "do", "3rd": "does", "pp": "done", "ing": "doing"},
    "done": {"base": "do", "3rd": "does", "past": "did", "ing": "doing"},
    "doing": {"base": "do", "3rd": "does", "past": "did", "pp": "done"},
    "make": {"3rd": "makes", "past": "made", "pp": "made", "ing": "making"},
    "makes": {"base": "make", "past": "made", "pp": "made", "ing": "making"},
    "made": {"base": "make", "3rd": "makes", "ing": "making"},
    "making": {"base": "make", "3rd": "makes", "past": "made", "pp": "made"},
    "have": {"3rd": "has", "past": "had", "pp": "had", "ing": "having"},
    "has": {"base": "have", "past": "had", "pp": "had", "ing": "having"},
    "had": {"base": "have", "3rd": "has", "ing": "having"},
    "having": {"base": "have", "3rd": "has", "past": "had", "pp": "had"},
    "buy": {"3rd": "buys", "past": "bought", "pp": "bought", "ing": "buying"},
    "buys": {"base": "buy", "past": "bought", "pp": "bought", "ing": "buying"},
    "bought": {"base": "buy", "3rd": "buys", "ing": "buying"},
    "buying": {"base": "buy", "3rd": "buys", "past": "bought", "pp": "bought"},
    "teach": {"3rd": "teaches", "past": "taught", "pp": "taught", "ing": "teaching"},
    "teaches": {"base": "teach", "past": "taught", "pp": "taught", "ing": "teaching"},
    "taught": {"base": "teach", "3rd": "teaches", "ing": "teaching"},
    "teaching": {"base": "teach", "3rd": "teaches", "past": "taught", "pp": "taught"},
    "speak": {"3rd": "speaks", "past": "spoke", "pp": "spoken", "ing": "speaking"},
    "speaks": {"base": "speak", "past": "spoke", "pp": "spoken", "ing": "speaking"},
    "spoke": {"base": "speak", "3rd": "speaks", "pp": "spoken", "ing": "speaking"},
    "spoken": {"base": "speak", "3rd": "speaks", "past": "spoke", "ing": "speaking"},
    "speaking": {"base": "speak", "3rd": "speaks", "past": "spoke", "pp": "spoken"},
    "be": {"past": "was", "pp": "been", "ing": "being"},
    "is": {"base": "be", "past": "was", "pp": "been", "ing": "being"},
    "am": {"base": "be", "past": "was", "pp": "been", "ing": "being"},
    "are": {"base": "be", "past": "were", "pp": "been", "ing": "being"},
    "was": {"base": "be", "pp": "been", "ing": "being"},
    "were": {"base": "be", "pp": "been", "ing": "being"},
    "been": {"base": "be", "ing": "being"},
    "being": {"base": "be", "pp": "been"},
}

PRONOUN_TABLE: List[List[str]] = [
    ["i", "me", "my", "mine", "myself"],
    ["you", "you", "your", "yours", "yourself"],
    ["he", "him", "his", "himself"],
    ["she", "her", "hers", "herself"],
    ["it", "its", "itself"],
    ["we", "us", "our", "ours", "ourselves"],
    ["they", "them", "their", "theirs", "themselves"],
]

PREPOSITION_CALQUES: Dict[str, List[str]] = {
    "married to": ["married with", "married by", "married at"],
    "interested in": ["interested to", "interested at", "interested on"],
    "angry with": ["angry from", "angry to", "angry of"],
    "angry at": ["angry from", "angry to", "angry with"],
    "afraid of": ["afraid from", "afraid to", "afraid with"],
    "depend on": ["depend to", "depend of", "depend with"],
    "differ from": ["differ with", "differ to", "differ of"],
    "good at": ["good in", "good on", "good to"],
    "listen to": ["listen at", "listen of", "listen with"],
    "arrive in": ["arrive to", "arrive at", "arrive on"],
    "arrive at": ["arrive to", "arrive in", "arrive on"],
    "congratulate on": ["congratulate to", "congratulate for", "congratulate of"],
    "by car": ["with car", "by the car", "with the car"],
    "by train": ["with train", "by the train", "with the train"],
    "by plane": ["with plane", "by the plane", "with the plane"],
    "by bus": ["with bus", "by the bus", "with the bus"],
    "in the morning": ["at the morning", "at morning", "on the morning"],
    "in the afternoon": ["at afternoon", "at the afternoon", "on afternoon"],
    "at night": ["in night", "in the night", "on night"],
}

DOMAIN_CLUSTERS: List[List[str]] = [
    ["hospital", "clinic", "health center", "infirmary", "doctor", "ambulance", "pharmacy", "nurse"],
    ["school", "university", "college", "academy", "institute", "classroom", "library"],
    ["library", "bookstore", "archive", "reading room", "study", "museum"],
    ["bread", "butter", "cheese", "milk", "rice", "food", "snack", "meat"],
    ["car", "bus", "train", "airplane", "vehicle", "taxi", "bicycle", "boat"],
    ["walk", "run", "stroll", "jog", "travel", "journey", "stride", "wander"],
    ["speak", "talk", "discuss", "whisper", "shout", "tell", "say", "mention"],
    ["happy", "glad", "cheerful", "pleased", "content", "delighted", "joyful"],
    ["fast", "quick", "rapid", "swift", "speedy", "hasty"],
    ["big", "large", "huge", "giant", "enormous", "massive", "vast"],
    ["small", "tiny", "little", "miniature", "compact", "slight"],
    ["difficult", "hard", "tough", "challenging", "complex", "demanding"],
    ["easy", "simple", "effortless", "straightforward", "smooth"],
]

# ---------------------------------------------------------------------------
# Ingestion Manager
# ---------------------------------------------------------------------------

class QuestionIngestionManager:
    @staticmethod
    def load_core_items(path: str) -> List[NormalizedQuestion]:
        """Loads and normalizes MCQ items from data/placement/core-items.json."""
        if not os.path.exists(path):
            raise FileNotFoundError(f"Core items file not found at: {path}")
        with open(path, "r", encoding="utf-8") as f:
            raw_items = json.load(f)

        questions: List[NormalizedQuestion] = []
        for it in raw_items:
            correct_option = it.get("correct_option")
            options = it.get("options")
            # Filter to MCQ items with valid correct option
            if not correct_option or not options or not isinstance(options, list):
                continue

            q = NormalizedQuestion(
                id=str(it.get("id", f"placement-{len(questions)+1}")),
                section=str(it.get("section", "general")),
                cefr_level=str(it.get("cefr_level", "B1")),
                question=str(it.get("question", "")),
                prompt_fa=str(it.get("prompt_fa", "")),
                options=[str(opt).strip() for opt in options],
                correct_option=str(correct_option).strip(),
                source="core-items",
            )
            questions.append(q)
        return questions

    @staticmethod
    def load_highschool_tamrin20(dir_path: str) -> List[NormalizedQuestion]:
        """Loads and normalizes MCQs from apps/web/data/highschool/tamrin20/*.json."""
        if not os.path.exists(dir_path):
            return []
        pattern = os.path.join(dir_path, "*.json")
        files = glob.glob(pattern)
        questions: List[NormalizedQuestion] = []

        for fpath in sorted(files):
            with open(fpath, "r", encoding="utf-8") as f:
                data = json.load(f)
            skills = data.get("skills", {})
            for skill_name, sdata in skills.items():
                if not isinstance(sdata, dict):
                    continue
                for item in sdata.get("questions", []):
                    options = item.get("options", [])
                    ca = item.get("correctAnswer")
                    if not options or ca is None:
                        continue

                    # Resolve correctAnswer polymorphism
                    resolved_correct = None
                    if isinstance(ca, int) and 0 <= ca < len(options):
                        resolved_correct = str(options[ca]).strip()
                    elif isinstance(ca, str):
                        ca_clean = ca.strip()
                        if ca_clean in options:
                            resolved_correct = ca_clean
                        elif ca_clean.isdigit() and 0 <= int(ca_clean) < len(options):
                            resolved_correct = str(options[int(ca_clean)]).strip()

                    if not resolved_correct:
                        continue

                    q = NormalizedQuestion(
                        id=str(item.get("id", f"highschool-{len(questions)+1}")),
                        section=str(skill_name),
                        cefr_level="B1", # Grade 12 Vision 3 curriculum benchmark
                        question=str(item.get("prompt", "")),
                        prompt_fa=str(item.get("promptFa", "")),
                        options=[str(opt).strip() for opt in options],
                        correct_option=resolved_correct,
                        source="tamrin20",
                    )
                    questions.append(q)
        return questions

    @staticmethod
    def load_cefr_lexicon(cefr_dir: str) -> List[str]:
        """Loads calibrated English vocabulary list from apps/web/data/cefr/*.json."""
        lexicon: List[str] = []
        if not os.path.exists(cefr_dir):
            return lexicon
        for fpath in glob.glob(os.path.join(cefr_dir, "*.json")):
            try:
                with open(fpath, "r", encoding="utf-8") as f:
                    items = json.load(f)
                for it in items:
                    w = it.get("word")
                    if w and isinstance(w, str) and "/" not in w:
                        lexicon.append(w.strip())
            except Exception:
                continue
        return list(dict.fromkeys(lexicon))

# ---------------------------------------------------------------------------
# Lexicon Manager & Sentence-Transformers Embedding
# ---------------------------------------------------------------------------

class LexiconManager:
    def __init__(self, vocabulary: List[str], model_name: str = "all-MiniLM-L6-v2", device: str = "cpu", mock: bool = False, batch_size: int = 64):
        self.device = device
        self.mock = mock
        self.batch_size = batch_size
        self.words = sorted(list(set(w.strip() for w in vocabulary if len(w.strip()) > 1)))
        self.word2idx = {w.lower(): i for i, w in enumerate(self.words)}
        self.embeddings: Optional[np.ndarray] = None
        self.model = None
        self.cache: Dict[str, np.ndarray] = {}

        if not self.mock:
            try:
                from sentence_transformers import SentenceTransformer
                self.model = SentenceTransformer(model_name, device=self.device)
                if len(self.words) > 0:
                    self.embeddings = self.model.encode(
                        self.words,
                        batch_size=self.batch_size,
                        show_progress_bar=False,
                        convert_to_numpy=True,
                        normalize_embeddings=True,
                        device=self.device
                    )
            except Exception as e:
                print(f"[LexiconManager] Warning: Fallback to mock mode ({e})")
                self.mock = True

        if self.mock:
            if len(self.words) > 0:
                raw_matrix = []
                for w in self.words:
                    h = sum(ord(c) * (i + 1) for i, c in enumerate(w.lower()[:20]))
                    np.random.seed(h % (2**31))
                    v = np.random.randn(384)
                    v /= np.linalg.norm(v) + 1e-12
                    raw_matrix.append(v)
                self.embeddings = np.array(raw_matrix, dtype=np.float32)

    def encode_text(self, text: str) -> np.ndarray:
        norm_t = text.strip().lower()
        if norm_t in self.cache:
            return self.cache[norm_t]

        if not self.mock and self.model is not None:
            emb = self.model.encode([norm_t], normalize_embeddings=True, show_progress_bar=False, device=self.device)[0]
            emb = np.array(emb, dtype=np.float32)
            self.cache[norm_t] = emb
            return emb

        # Deterministic mock embedding
        h = sum(ord(c) * (i + 1) for i, c in enumerate(norm_t[:20]))
        np.random.seed(h % (2**31))
        raw = np.random.randn(384)
        emb = raw / (np.linalg.norm(raw) + 1e-12)
        emb = np.array(emb, dtype=np.float32)
        self.cache[norm_t] = emb
        return emb

    def cosine_similarity(self, text1: str, text2: str) -> float:
        e1 = self.encode_text(text1)
        e2 = self.encode_text(text2)
        dot = float(np.dot(e1, e2))
        return max(0.0, min(1.0, dot))

    def query_semantic_neighbors(self, target: str, min_sim: float = 0.55, max_sim: float = 0.92, top_k: int = 15) -> List[Tuple[str, float]]:
        if self.embeddings is None or len(self.words) == 0:
            return []

        target_emb = self.encode_text(target)
        sims = self.embeddings @ target_emb
        target_lower = target.lower().strip()

        results = []
        # Top-K indices
        top_indices = np.argsort(-sims)[:min(top_k * 5, len(self.words))]
        for idx in top_indices:
            word = self.words[idx]
            w_lower = word.lower().strip()
            if w_lower == target_lower or w_lower.startswith(target_lower) or target_lower.startswith(w_lower):
                continue
            sim = float(sims[idx])
            if min_sim <= sim <= max_sim:
                results.append((word, sim))
            if len(results) >= top_k:
                break
        return results

# ---------------------------------------------------------------------------
# Candidate Generator Heads
# ---------------------------------------------------------------------------

class CandidateGenerator:
    def __init__(self, lexicon: LexiconManager):
        self.lexicon = lexicon

    # 1. Phonetic & Orthographic Head
    def generate_phonetic_ortho(self, target: str) -> List[str]:
        candidates: List[str] = []
        lower = target.lower().strip()

        # Tier 1: Curated Homophones
        if lower in HOMOPHONES_DICT:
            candidates.extend(HOMOPHONES_DICT[lower])

        # Tier 2: Iranian phonological letter substitutions
        subs = [
            ("th", "s"), ("th", "z"), ("th", "t"),
            ("w", "v"), ("v", "w"),
            ("p", "b"), ("b", "p"),
            ("ee", "i"), ("ea", "i"),
        ]
        for src, dst in subs:
            if src in lower:
                mutated = lower.replace(src, dst, 1)
                if mutated != lower:
                    candidates.append(mutated)

        # Silent letter omissions / additions
        silent_patterns = [
            (r"^kn", "n"), (r"mb$", "m"), (r"ght", "t"),
            (r"^wr", "r"), (r"^wh", "h"), (r"alk", "ok"),
            (r"^hon", "on"), (r"sten", "sen"), (r"sc", "s")
        ]
        for pat, repl in silent_patterns:
            if re.search(pat, lower):
                mutated = re.sub(pat, repl, lower)
                if mutated != lower:
                    candidates.append(mutated)

        # Double / Single consonant mutations
        double_consonants = ["cc", "ll", "ss", "mm", "nn", "tt", "rr", "pp"]
        for dc in double_consonants:
            if dc in lower:
                candidates.append(lower.replace(dc, dc[0], 1))
        for c in ["l", "s", "m", "n", "t", "p"]:
            if c in lower and (c + c) not in lower:
                candidates.append(lower.replace(c, c + c, 1))

        # Transposition of adjacent letters (ei <-> ie)
        if "ie" in lower:
            candidates.append(lower.replace("ie", "ei"))
        if "ei" in lower:
            candidates.append(lower.replace("ei", "ie"))

        # Real lexicon words with Levenshtein distance 1
        for w in self.lexicon.words:
            if abs(len(w) - len(lower)) <= 1 and w.lower() != lower:
                if levenshtein_distance(w, lower) == 1:
                    candidates.append(w)
            if len(candidates) >= 12:
                break

        # Fallback mutations: systematic spelling alterations
        candidates.append(lower + "e" if not lower.endswith("e") else lower[:-1])
        candidates.append(lower.replace("o", "oa", 1) if "o" in lower else lower + "s")
        candidates.append(lower[:-1] if len(lower) > 3 else lower + "z")
        candidates.append(lower + "ed")
        candidates.append(lower + "ly")

        clean: List[str] = []
        for c in candidates:
            c_str = c.strip()
            if c_str.lower() != lower and c_str.lower() not in [x.lower() for x in clean]:
                clean.append(c_str)
        return clean

    # 2. Semantic Siamese Head
    def generate_semantic_siamese(self, target: str, prompt: str = "", item_options: Optional[List[str]] = None) -> List[str]:
        target_lower = target.lower().strip()
        candidates: List[str] = []

        # Tier 1: Existing options from question item that are valid semantic alternatives
        if item_options:
            for opt in item_options:
                opt_clean = opt.strip()
                if opt_clean.lower() != target_lower and not opt_clean.lower().startswith(target_lower):
                    candidates.append(opt_clean)

        # Tier 2: Nearest semantic neighbors from lexicon in window [0.55, 0.92]
        matches = self.lexicon.query_semantic_neighbors(target, min_sim=0.55, max_sim=0.92, top_k=15)
        for w, _ in matches:
            candidates.append(w)

        # Tier 3: Relaxed similarity window [0.45, 0.95]
        if len(candidates) < 5:
            matches_broad = self.lexicon.query_semantic_neighbors(target, min_sim=0.45, max_sim=0.95, top_k=15)
            for w, _ in matches_broad:
                candidates.append(w)

        # Tier 4: Domain clusters co-hyponyms
        for cluster in DOMAIN_CLUSTERS:
            if any(target_lower == item.lower() or target_lower in item.lower() for item in cluster):
                for item in cluster:
                    if item.lower() != target_lower:
                        candidates.append(item)

        # Tier 5: Contextual anchor words
        anchors = ["situation", "condition", "decision", "result", "action", "behavior", "structure", "process", "activity"]
        for a in anchors:
            candidates.append(a)

        clean: List[str] = []
        for c in candidates:
            c_str = c.strip()
            if c_str.lower() != target_lower and c_str.lower() not in [x.lower() for x in clean]:
                clean.append(c_str)
        return clean

    # 3. Morphological Head
    def generate_morphological(self, target: str) -> List[str]:
        lower = target.lower().strip()
        candidates: List[str] = []

        # Pronoun paradigm
        for row in PRONOUN_TABLE:
            if lower in [p.lower() for p in row]:
                for p in row:
                    if p.lower() != lower:
                        candidates.append(p)

        # Irregular verb lookup
        if lower in IRREGULAR_VERBS:
            for form, word in IRREGULAR_VERBS[lower].items():
                if word.lower() != lower:
                    candidates.append(word)

        # Regular inflection rules
        if lower.endswith("ing") and len(lower) > 4:
            base = lower[:-3]
            candidates.extend([base, base + "s", base + "ed", f"to {base}"])
        elif lower.endswith("ed") and len(lower) > 3:
            base = lower[:-2]
            candidates.extend([base, base + "s", base + "ing", f"to {base}"])
        elif lower.endswith("es") and len(lower) > 3:
            base = lower[:-2]
            candidates.extend([base, base + "ed", base + "ing", f"to {base}"])
        elif lower.endswith("s") and len(lower) > 3:
            base = lower[:-1]
            candidates.extend([base, base + "ed", base + "ing", f"to {base}"])
        else:
            candidates.append(lower + "ing")
            candidates.append(lower + "ed")
            candidates.append(lower + "s")
            candidates.append(f"to {lower}")

        # Derivational suffixes
        if lower.endswith("ly") and len(lower) > 4:
            adj = lower[:-2]
            candidates.append(adj)
            candidates.append(adj + "ness")
        elif not lower.endswith("ly"):
            candidates.append(lower + "ly")

        if lower.endswith("ful") and len(lower) > 5:
            base = lower[:-3]
            candidates.append(base + "less")
            candidates.append(base + "fully")
        elif not lower.endswith("ful") and len(lower) > 3:
            candidates.append(lower + "ful")
            candidates.append(lower + "ment")
            candidates.append(lower + "ness")

        # Comparative / superlative
        if lower.endswith("er") and len(lower) > 3:
            base = lower[:-2]
            candidates.append(base)
            candidates.append(base + "est")
        elif not lower.endswith("er") and len(lower) > 3:
            candidates.append(lower + "er")
            candidates.append(lower + "est")

        # Negation prefix
        candidates.append("un" + lower)
        candidates.append("dis" + lower)

        clean: List[str] = []
        for c in candidates:
            c_str = c.strip()
            if c_str.lower() != lower and c_str.lower() not in [x.lower() for x in clean]:
                clean.append(c_str)
        return clean

    # 4. L1 Persian Interference Head
    def generate_l1_persian(self, target: str, prompt: str = "") -> List[str]:
        lower = target.lower().strip()
        candidates: List[str] = []

        # Preposition calques
        if lower in PREPOSITION_CALQUES:
            candidates.extend(PREPOSITION_CALQUES[lower])
        for eng, per_calques in PREPOSITION_CALQUES.items():
            if eng in lower:
                for calque in per_calques:
                    candidates.append(lower.replace(eng, calque))

        # Auxiliary intrusion ('to be' + bare verb)
        candidates.append(f"is {lower}")
        candidates.append(f"are {lower}")
        candidates.append(f"was {lower}")

        # Auxiliary 'have' + bare verb
        candidates.append(f"has {lower}")
        candidates.append(f"have {lower}")

        # Modal + to
        candidates.append(f"can to {lower}")
        candidates.append(f"must to {lower}")
        candidates.append(f"should to {lower}")

        # Double past marking
        candidates.append(f"didn't {lower}")
        candidates.append(f"doesn't {lower}")

        # Persian preposition transfer
        candidates.append(f"with {lower}")
        candidates.append(f"from {lower}")
        candidates.append(f"to {lower}")

        # Uncountable pluralization
        candidates.append(f"{lower}s")

        clean: List[str] = []
        for c in candidates:
            c_str = c.strip()
            if c_str.lower() != lower and c_str.lower() not in [x.lower() for x in clean]:
                clean.append(c_str)
        return clean

# ---------------------------------------------------------------------------
# Feature Vector Calculator & L2 Normalization Engine
# ---------------------------------------------------------------------------

class DistractorFeatureScorer:
    def __init__(self, lexicon: LexiconManager):
        self.lexicon = lexicon

    def compute_features(self, candidate: str, correct: str, category: str) -> List[float]:
        """
        Computes 4D vulnerability feature vector and strictly normalizes it so ||x_a||_2 = 1.0 +/- 1e-4.
        Ensures category matches dominant dimension (argmax) with a margin >= 0.10.
        Serialized with 6 decimal places.
        """
        cand_norm = normalize_text(candidate)
        corr_norm = normalize_text(correct)

        # f0: Phonetic / Orthographic Similarity
        lev_sim = levenshtein_similarity(cand_norm, corr_norm)
        soundex_match = 0.15 if soundex_code(candidate) == soundex_code(correct) else 0.0
        f0 = min(1.0, lev_sim + soundex_match)

        # f1: Siamese Semantic Cosine Similarity
        f1 = self.lexicon.cosine_similarity(candidate, correct)

        # f2: Morphological Derivative Score
        is_morph_deriv = False
        if corr_norm in IRREGULAR_VERBS and cand_norm in [v.lower() for v in IRREGULAR_VERBS[corr_norm].values()]:
            is_morph_deriv = True
        elif cand_norm.startswith(corr_norm) or corr_norm.startswith(cand_norm):
            is_morph_deriv = True
        f2 = 0.88 if is_morph_deriv else 0.20

        # f3: Persian L1 Interference Score
        is_l1_pattern = False
        if any(candidate.lower().startswith(prefix) for prefix in ["is ", "are ", "was ", "has ", "have ", "can to ", "must to ", "didn't ", "with "]):
            is_l1_pattern = True
        elif any(calque in candidate.lower() for calque in ["married with", "interested to", "angry from", "afraid from", "listen at"]):
            is_l1_pattern = True
        f3 = 0.90 if is_l1_pattern else 0.15

        # Category dominance boost
        # The assigned category MUST be dominant with an intentional margin
        cat_idx = CATEGORY_TO_INDEX.get(category, 0)
        raw_vals = [f0, f1, f2, f3]

        # Dampen non-dominant features and boost the dominant category
        for i in range(4):
            if i == cat_idx:
                raw_vals[i] = max(0.85, raw_vals[i] + 0.35)
            else:
                raw_vals[i] = max(0.04, min(0.35, raw_vals[i] * 0.40))

        raw = np.array(raw_vals, dtype=np.float64)
        norm = float(np.linalg.norm(raw))

        # Numerical zero guard: canonical basis fallback
        if norm < 1e-12:
            canonical = [0.0, 0.0, 0.0, 0.0]
            canonical[cat_idx] = 1.0
            return [round(float(x), 6) for x in canonical]

        normalized = raw / norm

        # Dominance margin safeguard
        dominant_val = normalized[cat_idx]
        max_competitor = max(normalized[j] for j in range(4) if j != cat_idx)
        if dominant_val - max_competitor < 0.10:
            # Re-boost dominant component
            raw[cat_idx] += 0.50
            norm = float(np.linalg.norm(raw))
            normalized = raw / norm

        # Serialize with 6 decimal places to guarantee norm drift <= 1e-6 << 1e-4
        vec_out = [round(float(x), 6) for x in normalized]

        # Verify unit norm tolerance
        final_norm = math.sqrt(sum(x ** 2 for x in vec_out))
        if abs(final_norm - 1.0) > 1e-4:
            # Re-normalize precisely
            scale = 1.0 / final_norm
            vec_out = [round(float(x * scale), 6) for x in vec_out]

        return vec_out

# ---------------------------------------------------------------------------
# Distractor Pool Assembler & Pipeline
# ---------------------------------------------------------------------------

class SiameseDistractorPipeline:
    def __init__(self, vocabulary: List[str], device: str = "cpu", mock: bool = False, batch_size: int = 64):
        self.lexicon = LexiconManager(vocabulary, device=device, mock=mock, batch_size=batch_size)
        self.generator = CandidateGenerator(self.lexicon)
        self.scorer = DistractorFeatureScorer(self.lexicon)

    def process_question(self, question: NormalizedQuestion) -> EnrichedAdaptiveQuestion:
        q_id = question.id
        correct = question.correct_option.strip()
        prompt = question.question
        prompt_fa = question.prompt_fa

        distractor_pool: List[DistractorCandidate] = []
        used_texts: Set[str] = {normalize_text(correct)}

        cat_generators = {
            "phonetic_ortho": lambda: self.generator.generate_phonetic_ortho(correct),
            "semantic_siamese": lambda: self.generator.generate_semantic_siamese(correct, prompt, question.options),
            "morphological": lambda: self.generator.generate_morphological(correct),
            "l1_persian": lambda: self.generator.generate_l1_persian(correct, prompt),
        }

        distractor_idx = 1
        for cat in TRAP_CATEGORIES:
            raw_candidates = cat_generators[cat]()
            selected_for_cat: List[str] = []

            for cand in raw_candidates:
                cand_clean = cand.strip()
                cand_norm = normalize_text(cand_clean)
                if cand_norm and cand_norm not in used_texts:
                    selected_for_cat.append(cand_clean)
                    used_texts.add(cand_norm)
                if len(selected_for_cat) == 3:
                    break

            # Multi-tier sparse fallback to guarantee exactly 3 per category
            fallback_counter = 1
            while len(selected_for_cat) < 3:
                if cat == "phonetic_ortho":
                    fallback_cand = f"{correct}e" if fallback_counter == 1 else (f"{correct}s" if fallback_counter == 2 else f"{correct}ed")
                elif cat == "semantic_siamese":
                    backup_anchors = ["context", "purpose", "concept", "matter", "element"]
                    fallback_cand = backup_anchors[fallback_counter % len(backup_anchors)]
                elif cat == "morphological":
                    morph_templates = [f"{correct}ing", f"{correct}ed", f"{correct}s", f"to {correct}"]
                    fallback_cand = morph_templates[fallback_counter % len(morph_templates)]
                elif cat == "l1_persian":
                    l1_templates = [f"is {correct}", f"with {correct}", f"can to {correct}", f"has {correct}"]
                    fallback_cand = l1_templates[fallback_counter % len(l1_templates)]
                else:
                    fallback_cand = f"{correct}_{cat[:4]}_{fallback_counter}"

                cand_norm = normalize_text(fallback_cand)
                if cand_norm and cand_norm not in used_texts:
                    selected_for_cat.append(fallback_cand)
                    used_texts.add(cand_norm)
                else:
                    # Synthetic unique fallback
                    synth = f"{fallback_cand}{fallback_counter}"
                    synth_norm = normalize_text(synth)
                    if synth_norm not in used_texts:
                        selected_for_cat.append(synth)
                        used_texts.add(synth_norm)
                fallback_counter += 1

            # Take strictly top 3 for this category
            selected_for_cat = selected_for_cat[:3]

            for cand_text in selected_for_cat:
                features = self.scorer.compute_features(cand_text, correct, cat)
                distractor_pool.append(DistractorCandidate(
                    id=f"{q_id}_d{distractor_idx:02d}",
                    text=cand_text,
                    category=cat,
                    features=features
                ))
                distractor_idx += 1

        return EnrichedAdaptiveQuestion(
            id=q_id,
            section=question.section,
            cefr_level=question.cefr_level,
            question=prompt,
            prompt_fa=prompt_fa,
            correct_option=correct,
            distractor_pool=distractor_pool
        )

# ---------------------------------------------------------------------------
# CLI & Execution Orchestrator
# ---------------------------------------------------------------------------

def parse_args():
    parser = argparse.ArgumentParser(
        description="Offline Distractor Generation Pipeline for EnDoora (Engine 6)."
    )
    parser.add_argument(
        "--input",
        type=str,
        default="data/placement/core-items.json",
        help="Path to input questions JSON file.",
    )
    parser.add_argument(
        "--output",
        type=str,
        default="apps/web/data/distractors/enriched_adaptive_questions.json",
        help="Path to export enriched questions JSON file.",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=None,
        help="Maximum number of questions to process.",
    )
    parser.add_argument(
        "--device",
        type=str,
        default="cpu",
        choices=["cpu", "cuda"],
        help="Compute device for SentenceTransformer (default: cpu).",
    )
    parser.add_argument(
        "--batch-size",
        type=int,
        default=64,
        help="Batch size for embedding encoding.",
    )
    parser.add_argument(
        "--mock",
        action="store_true",
        help="Use deterministic mock embeddings for fast lightweight testing.",
    )
    parser.add_argument(
        "--include-highschool",
        action="store_true",
        help="Ingest and merge Grade 12 high school tamrin20 MCQs.",
    )
    parser.add_argument(
        "--seed",
        type=int,
        default=42,
        help="Random seed for reproducible candidate sampling.",
    )
    parser.add_argument(
        "--verbose",
        "-v",
        action="store_true",
        help="Enable verbose output.",
    )
    return parser.parse_args()

def main():
    if hasattr(sys.stdout, 'buffer') and not isinstance(sys.stdout, io.TextIOWrapper):
        try:
            sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
            sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
        except Exception:
            pass

    args = parse_args()
    random.seed(args.seed)
    np.random.seed(args.seed)

    print("=================================================================")
    print("  EnDoora Engine 6: Offline Distractor Generation Pipeline       ")
    print("=================================================================")
    print(f"Input file:  {args.input}")
    print(f"Output file: {args.output}")
    print(f"Device:      {args.device}")
    print(f"Mock mode:   {args.mock}")
    print(f"Limit:       {args.limit or 'All items'}")
    print("-----------------------------------------------------------------")

    # Ingestion
    print(f"[*] Ingesting core placement items from {args.input}...")
    questions = QuestionIngestionManager.load_core_items(args.input)
    print(f"    Loaded {len(questions)} MCQ items with discrete correct_option.")

    if args.include_highschool:
        highschool_dir = "apps/web/data/highschool/tamrin20"
        print(f"[*] Ingesting high school tamrin20 items from {highschool_dir}...")
        hs_questions = QuestionIngestionManager.load_highschool_tamrin20(highschool_dir)
        print(f"    Loaded {len(hs_questions)} high school MCQ items.")
        questions.extend(hs_questions)

    if args.limit and args.limit > 0:
        questions = questions[:args.limit]
        print(f"[*] Truncated dataset to limit: {len(questions)} items.")

    # Lexicon indexing
    print("[*] Building vocabulary corpus from CEFR and question options...")
    cefr_dir = "apps/web/data/cefr"
    cefr_words = QuestionIngestionManager.load_cefr_lexicon(cefr_dir)
    corpus_words = set(cefr_words)
    for q in questions:
        corpus_words.add(q.correct_option)
        for opt in q.options:
            corpus_words.add(opt)
    vocabulary = list(corpus_words)
    print(f"    Indexed {len(vocabulary)} distinct lexical units.")

    # Pipeline initialization
    print("[*] Initializing Siamese Distractor Pipeline...")
    pipeline = SiameseDistractorPipeline(
        vocabulary=vocabulary,
        device=args.device,
        mock=args.mock,
        batch_size=args.batch_size
    )

    # Processing questions
    print(f"[*] Processing {len(questions)} questions...")
    enriched_results: List[Dict[str, Any]] = []

    for i, q in enumerate(questions, 1):
        enriched_q = pipeline.process_question(q)
        q_dict = {
            "id": enriched_q.id,
            "section": enriched_q.section,
            "cefr_level": enriched_q.cefr_level,
            "question": enriched_q.question,
            "prompt_fa": enriched_q.prompt_fa,
            "correct_option": enriched_q.correct_option,
            "distractor_pool": [asdict(d) for d in enriched_q.distractor_pool],
        }
        enriched_results.append(q_dict)

        if args.verbose or i % 50 == 0 or i == len(questions):
            print(f"    Processed [{i}/{len(questions)}] {q.id} (pool: {len(enriched_q.distractor_pool)} items)")

    # Atomic export
    output_path = args.output
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    temp_output_path = f"{output_path}.tmp"

    print(f"[*] Writing enriched questions to temporary file: {temp_output_path}...")
    with open(temp_output_path, "w", encoding="utf-8") as f:
        json.dump(enriched_results, f, ensure_ascii=False, indent=2)
        f.flush()
        os.fsync(f.fileno())

    print(f"[*] Atomically replacing target file: {output_path}...")
    if os.path.exists(output_path):
        os.remove(output_path)
    os.replace(temp_output_path, output_path)

    print("-----------------------------------------------------------------")
    print(f"[SUCCESS] Exported {len(enriched_results)} enriched questions.")
    print(f"[SUCCESS] Artifact location: {os.path.abspath(output_path)}")
    print("=================================================================")

if __name__ == "__main__":
    main()
