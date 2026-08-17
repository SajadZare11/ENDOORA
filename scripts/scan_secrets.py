from __future__ import annotations

import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FORBIDDEN_TRACKED_NAMES = {".env", "id_rsa", "id_ed25519"}
PATTERNS = [
    ("private key", re.compile(r"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----")),
    ("OpenRouter key", re.compile(r"sk-or-v1-[A-Za-z0-9_-]{20,}")),
    ("generic API secret assignment", re.compile(r"(?i)(api[_-]?key|secret[_-]?key|merchant[_-]?id)\s*[:=]\s*['\"]?[A-Za-z0-9_-]{24,}")),
]


def tracked_files() -> list[Path]:
    result = subprocess.run(
        ["git", "ls-files"],
        cwd=ROOT,
        check=True,
        capture_output=True,
        text=True,
    )
    return [ROOT / line for line in result.stdout.splitlines() if line.strip()]


def main() -> int:
    problems: list[str] = []
    for path in tracked_files():
        if path.name in FORBIDDEN_TRACKED_NAMES:
            problems.append(f"forbidden tracked file: {path.relative_to(ROOT)}")
            continue
        if not path.is_file() or path.suffix.lower() in {".png", ".jpg", ".jpeg", ".gif", ".pdf", ".zip"}:
            continue
        try:
            text = path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue
        for label, pattern in PATTERNS:
            if pattern.search(text):
                problems.append(f"possible {label}: {path.relative_to(ROOT)}")

    if problems:
        print("Secret scan FAILED")
        for problem in problems:
            print(f"- {problem}")
        return 1

    print("Secret scan passed: no baseline secret patterns found in tracked files.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
