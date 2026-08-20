from __future__ import annotations

import re
import string
import unicodedata
from typing import Any


_PERSIAN_EQUIVALENTS = str.maketrans(
    {
        "\u064a": "\u06cc",
        "\u0649": "\u06cc",
        "\u0643": "\u06a9",
        "\u200c": " ",
    }
)
_ASCII_PUNCTUATION = str.maketrans("", "", string.punctuation)


def normalize_text(
    value: str,
    *,
    case_sensitive: bool = False,
    strip_punctuation: bool = False,
) -> str:
    text = unicodedata.normalize("NFKC", str(value)).translate(_PERSIAN_EQUIVALENTS)
    text = re.sub(r"\s+", " ", text).strip()
    if strip_punctuation:
        text = text.translate(_ASCII_PUNCTUATION)
        text = re.sub(r"\s+", " ", text).strip()
    if not case_sensitive:
        text = text.casefold()
    return text


def normalize_scalar(value: Any) -> str:
    return normalize_text("" if value is None else str(value))


def normalize_list(values: list[Any]) -> list[str]:
    return [normalize_scalar(value) for value in values]
