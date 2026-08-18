from __future__ import annotations

import re

IRAN_MOBILE_RE = re.compile(r"^\+989\d{9}$")


class InvalidIranianMobile(ValueError):
    pass


def normalize_iranian_mobile(value: str | None) -> str | None:
    if value is None:
        return None

    raw = str(value).strip()
    if raw == "":
        return None

    compact = re.sub(r"[\s\-\(\)]", "", raw)

    if compact.startswith("0098"):
        compact = "+98" + compact[4:]
    elif compact.startswith("+98"):
        pass
    elif compact.startswith("98"):
        compact = "+" + compact
    elif compact.startswith("0"):
        compact = "+98" + compact[1:]
    elif compact.startswith("9"):
        compact = "+98" + compact
    else:
        raise InvalidIranianMobile(
            "Enter an Iranian mobile number such as 09123456789 or +989123456789."
        )

    if not IRAN_MOBILE_RE.fullmatch(compact):
        raise InvalidIranianMobile(
            "Enter a valid Iranian mobile number such as 09123456789."
        )

    return compact
