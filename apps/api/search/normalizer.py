"""
Text Normalization utilities for Unified Search.
Provides Persian character normalization (ي/ی, ك/ک, ة/ه, diacritics removal, ZWNJ),
English case folding, and query tokenization.
"""

import re
import unicodedata

# Arabic to Persian character mapping
CHAR_MAP = {
    "\u064A": "\u06CC",  # Arabic Yeh -> Persian Yeh
    "\u0649": "\u06CC",  # Alef Maksura -> Persian Yeh
    "\u0643": "\u06A9",  # Arabic Kaf -> Persian Kaf
    "\u0629": "\u0647",  # Teh Marbuta -> Heh
    "\u0624": "\u0648",  # Waw with Hamza -> Waw
    "\u0626": "\u06CC",  # Yeh with Hamza -> Persian Yeh
    "\u0622": "\u0627",  # Alef with Madda -> Alef
    "\u0623": "\u0627",  # Alef with Hamza Above -> Alef
    "\u0625": "\u0627",  # Alef with Hamza Below -> Alef
}

# Arabic/Persian diacritics pattern (Harakat, Tanwin, Shadda, Sukun)
DIACRITICS_PATTERN = re.compile(r"[\u064B-\u065F\u0670]")

# Arabic & Persian numerals to English digits
DIGIT_MAP = {
    "۰": "0", "۱": "1", "۲": "2", "۳": "3", "۴": "4",
    "۵": "5", "۶": "6", "۷": "7", "۸": "8", "۹": "9",
    "٠": "0", "١": "1", "٢": "2", "٣": "3", "٤": "4",
    "٥": "5", "٦": "6", "٧": "7", "٨": "8", "٩": "9",
}

# Extra whitespaces & ZWNJ (Zero-Width Non-Joiner)
ZWNJ = "\u200C"
WHITESPACE_PATTERN = re.compile(r"\s+")


def normalize_persian_text(text: str) -> str:
    """Normalizes Persian/Arabic characters and strips diacritics."""
    if not text:
        return ""

    # Unicode NFKD normalization
    text = unicodedata.normalize("NFKD", text)

    # Replace mapped characters
    for orig, target in CHAR_MAP.items():
        text = text.replace(orig, target)

    # Replace digits
    for orig, target in DIGIT_MAP.items():
        text = text.replace(orig, target)

    # Strip diacritics
    text = DIACRITICS_PATTERN.sub("", text)

    # Normalize ZWNJ into a single space for token searching
    text = text.replace(ZWNJ, " ")

    # Normalize whitespace
    text = WHITESPACE_PATTERN.sub(" ", text).strip()
    return text


def normalize_text(text: str) -> str:
    """General text normalizer for Persian & English queries."""
    if not text:
        return ""
    # Lowercase English letters
    text = text.lower()
    # Normalize Persian / Arabic
    text = normalize_persian_text(text)
    return text


def tokenize(text: str) -> list[str]:
    """Tokenizes normalized text into search tokens, removing punctuation."""
    norm = normalize_text(text)
    # Split on non-alphanumeric (Persian characters are in \w in Python regex with re.UNICODE)
    tokens = [t for t in re.split(r"[^\w]+", norm, flags=re.UNICODE) if len(t) > 1]
    return tokens
