from __future__ import annotations

import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FORBIDDEN_TRACKED_NAMES = {".env", "id_rsa", "id_ed25519"}
SCAN_EXCLUDED_RELATIVE_PATHS = {Path("scripts/test_scan_secrets.py")}
FIXED_PATTERNS = [
    ("private key", re.compile(r"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----")),
    ("OpenRouter key", re.compile(r"sk-or-v1-[A-Za-z0-9_-]{20,}")),
]
GENERIC_SECRET_ASSIGNMENT = re.compile(
    r"(?im)\b(api[_-]?key|secret[_-]?key|merchant[_-]?id)\s*[:=]\s*['\"]?([^\s'\"#]+)"
)
PLACEHOLDER_MARKERS = {
    "placeholder",
    "replace-me",
    "change-me",
    "example",
    "dummy",
    "fake",
    "local-development",
    "ci-only",
    "not-a-production-secret",
    "your-",
    "<",
    ">",
}


def tracked_files() -> list[Path]:
    result = subprocess.run(
        ["git", "ls-files"],
        cwd=ROOT,
        check=True,
        capture_output=True,
        text=True,
    )
    return [ROOT / line for line in result.stdout.splitlines() if line.strip()]


def is_obvious_placeholder(value: str) -> bool:
    normalized = value.strip().lower()
    if not normalized:
        return True
    return any(marker in normalized for marker in PLACEHOLDER_MARKERS)


def scan_text(text: str) -> list[str]:
    findings: list[str] = []
    for label, pattern in FIXED_PATTERNS:
        if pattern.search(text):
            findings.append(label)

    for match in GENERIC_SECRET_ASSIGNMENT.finditer(text):
        value = match.group(2).rstrip(",;)")
        if len(value) >= 24 and not is_obvious_placeholder(value):
            findings.append("generic API secret assignment")
            break

    return findings


def main() -> int:
    problems: list[str] = []
    for path in tracked_files():
        relative_path = path.relative_to(ROOT)
        if relative_path in SCAN_EXCLUDED_RELATIVE_PATHS:
            continue
        if path.name in FORBIDDEN_TRACKED_NAMES:
            problems.append(f"forbidden tracked file: {relative_path}")
            continue
        if not path.is_file() or path.suffix.lower() in {".png", ".jpg", ".jpeg", ".gif", ".pdf", ".zip"}:
            continue
        try:
            text = path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue
        for label in scan_text(text):
            problems.append(f"possible {label}: {relative_path}")

    if problems:
        print("Secret scan FAILED")
        for problem in problems:
            print(f"- {problem}")
        return 1

    print("Secret scan passed: no baseline secret patterns found in tracked files.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
