"""
PII Scanner and Privacy Guard for Endoora Community.
Scans text content for Iranian private learner data before submission:
- Mobile Phone Numbers (09xx, +989xx, 00989xx)
- Iranian National Identity Numbers (10 digits with checksum option)
- Bank Card Numbers (16-digit debit/credit cards)
- Iranian Bank Sheba Numbers (IR + 24 digits)
"""

from __future__ import annotations

import re
from typing import List, Dict, Any
from django.core.exceptions import ValidationError


# Regular expressions for Iranian PII
IRAN_PHONE_REGEX = re.compile(
    r'(?:(?:\+98|0098|0)?9\d{9})\b',
    re.ASCII
)

# 16-digit bank cards (with optional spaces or dashes)
BANK_CARD_REGEX = re.compile(
    r'\b(?:\d{4}[ -]?){3}\d{4}\b',
    re.ASCII
)

# Iranian Sheba account numbers
SHEBA_REGEX = re.compile(
    r'\bIR\d{24}\b',
    re.IGNORECASE | re.ASCII
)

# 10-digit National IDs (prevent matching random longer numbers)
NATIONAL_ID_REGEX = re.compile(
    r'\b\d{10}\b',
    re.ASCII
)


def validate_iranian_national_id(code: str) -> bool:
    """Validate 10-digit Iranian National ID using official checksum algorithm."""
    if not code.isdigit() or len(code) != 10:
        return False
    # Check for repetitive invalid patterns (e.g. 0000000000, 1111111111)
    if len(set(code)) == 1:
        return False

    digits = [int(c) for c in code]
    checksum = digits[9]
    weighted_sum = sum(digits[i] * (10 - i) for i in range(9))
    remainder = weighted_sum % 11

    if remainder < 2:
        return checksum == remainder
    return checksum == (11 - remainder)


def scan_pii(text: str) -> List[Dict[str, Any]]:
    """
    Scans a string for private learner data / PII.
    Returns a list of detected items with type, matched substring, and description.
    """
    if not text or not isinstance(text, str):
        return []

    findings: List[Dict[str, Any]] = []

    # 1. Phone numbers
    for match in IRAN_PHONE_REGEX.finditer(text):
        matched_str = match.group()
        # Ensure it looks like a genuine Iranian phone number (starts with 09 or +989)
        clean_num = re.sub(r'\D', '', matched_str)
        if clean_num.startswith('9') and len(clean_num) == 10:
            clean_num = '0' + clean_num
        if clean_num.startswith('09') and len(clean_num) == 11:
            findings.append({
                "type": "phone_number",
                "matched": matched_str,
                "message_fa": "شماره تلفن همراه شناسایی شد. انتشار اطلاعات تماس در بخش عمومی مجاز نیست.",
                "message_en": "Mobile phone number detected. Sharing contact information publicly is prohibited.",
            })

    # 2. Bank card numbers
    for match in BANK_CARD_REGEX.finditer(text):
        matched_str = match.group()
        digits = re.sub(r'\D', '', matched_str)
        if len(digits) == 16:
            findings.append({
                "type": "bank_card",
                "matched": matched_str,
                "message_fa": "شماره کارت بانکی شناسایی شد. اطلاعات مالی نباید منتشر شود.",
                "message_en": "Bank card number detected. Financial data must not be shared.",
            })

    # 3. Sheba
    for match in SHEBA_REGEX.finditer(text):
        matched_str = match.group()
        findings.append({
            "type": "sheba_number",
            "matched": matched_str,
            "message_fa": "شماره شبا بانکی شناسایی شد.",
            "message_en": "Sheba bank account number detected.",
        })

    # 4. National ID
    for match in NATIONAL_ID_REGEX.finditer(text):
        matched_str = match.group()
        if validate_iranian_national_id(matched_str):
            findings.append({
                "type": "national_id",
                "matched": matched_str,
                "message_fa": "کد ملی شناسایی شد. انتشار مدارک و کدهای هویتی اکیداً ممنوع است.",
                "message_en": "National ID detected. Publishing identification numbers is strictly forbidden.",
            })

    return findings


def assert_no_pii(text: str, field_name: str = "content") -> None:
    """Raises a Django ValidationError if PII is detected in the given text."""
    findings = scan_pii(text)
    if findings:
        reasons = [f"{item['type']}: {item['message_fa']}" for item in findings]
        raise ValidationError({
            field_name: f"خطای حریم خصوصی: اطلاعات حساس یا هویتی شناسایی شد ({', '.join(reasons)})"
        })
