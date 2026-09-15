from __future__ import annotations
import re
from django.core.exceptions import ValidationError

def sanitize_text_input(value: str) -> str:
    value = re.sub(r'<script.*?>.*?</script>', '', value, flags=re.IGNORECASE | re.DOTALL)
    value = re.sub(r'on[a-z]+\s*=', '', value, flags=re.IGNORECASE)
    value = re.sub(r'javascript:', '', value, flags=re.IGNORECASE)
    return value

def validate_no_injection(value: str) -> None:
    patterns = [
        re.compile(r"UNION\s+SELECT", re.IGNORECASE),
        re.compile(r"DROP\s+TABLE", re.IGNORECASE),
        re.compile(r"INSERT\s+INTO.*VALUES", re.IGNORECASE),
        re.compile(r"DELETE\s+FROM.*WHERE\s+1=1", re.IGNORECASE),
        re.compile(r"OR\s+1=1", re.IGNORECASE),
        re.compile(r"';\s*--", re.IGNORECASE),
    ]
    for pattern in patterns:
        if pattern.search(value):
            raise ValidationError("محتوای نامعتبر و غیرمجاز تشخیص داده شد.")

def validate_content_length(value: str, max_bytes: int = 50_000) -> None:
    if len(value.encode('utf-8')) > max_bytes:
        raise ValidationError(f"طول محتوا نباید بیشتر از {max_bytes} بایت باشد.")

import ipaddress
import socket
from urllib.parse import urlparse

def validate_external_url(url: str) -> bool:
    parsed = urlparse(url)
    if parsed.scheme not in ('http', 'https'):
        return False
    try:
        if not parsed.hostname:
            return False
        ip = socket.gethostbyname(parsed.hostname)
        ip_obj = ipaddress.ip_address(ip)
        if ip_obj.is_private or ip_obj.is_loopback or str(ip_obj) == '169.254.169.254':
            return False
        return True
    except (socket.gaierror, ValueError, TypeError):
        return False
