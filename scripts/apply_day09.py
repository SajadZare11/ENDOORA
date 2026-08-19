from __future__ import annotations

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def read(path: Path) -> str:
    if not path.exists():
        raise SystemExit(f"Required file not found: {path.relative_to(ROOT)}")
    return path.read_text(encoding="utf-8")


def patch_settings() -> str | None:
    path = ROOT / "apps/api/endoora_api/settings/base.py"
    text = read(path)
    if '"dashboard"' in text or "'dashboard'" in text:
        return None

    for anchor in (
        '    "permissions",\n',
        '    "accounts",\n',
        "    'permissions',\n",
        "    'accounts',\n",
    ):
        if anchor in text:
            path.write_text(
                text.replace(anchor, anchor + '    "dashboard",\n', 1),
                encoding="utf-8",
            )
            return str(path.relative_to(ROOT))

    raise SystemExit(
        "Could not safely add dashboard to INSTALLED_APPS. "
        "Do not replace the file. Send settings/base.py to ChatGPT."
    )


def patch_urls() -> str | None:
    path = ROOT / "apps/api/endoora_api/urls.py"
    text = read(path)
    if 'include("dashboard.urls")' in text or "include('dashboard.urls')" in text:
        return None

    line = '    path("api/dashboard/", include("dashboard.urls")),\n'

    for anchor in (
        '    path("api/auth/", include("accounts.urls")),\n',
        "    path('api/auth/', include('accounts.urls')),\n",
    ):
        if anchor in text:
            path.write_text(text.replace(anchor, anchor + line, 1), encoding="utf-8")
            return str(path.relative_to(ROOT))

    closing = text.rfind("]")
    if "urlpatterns = [" in text and closing != -1:
        path.write_text(text[:closing] + line + text[closing:], encoding="utf-8")
        return str(path.relative_to(ROOT))

    raise SystemExit(
        "Could not safely add dashboard URLs. "
        "Do not replace the file. Send endoora_api/urls.py to ChatGPT."
    )


def patch_next_config() -> str | None:
    path = ROOT / "apps/web/next.config.ts"
    text = read(path)
    if "/api/:path*" in text:
        return None

    if "async rewrites()" in text:
        raise SystemExit(
            "next.config.ts already has rewrites() but not the generic API proxy. "
            "Do not overwrite it. Send next.config.ts to ChatGPT for a safe merge."
        )

    method = (
        '  async rewrites() {\n'
        '    const apiBase =\n'
        '      process.env.ENDOORA_API_INTERNAL_URL ?? "http://127.0.0.1:8000";\n'
        '    return [\n'
        '      {\n'
        '        source: "/api/:path*",\n'
        '        destination: `${apiBase}/api/:path*`,\n'
        '      },\n'
        '    ];\n'
        '  },\n'
    )

    anchor = "  poweredByHeader: false,\n"
    if anchor not in text:
        raise SystemExit(
            "Could not safely patch next.config.ts. "
            "Do not replace it. Send the file to ChatGPT."
        )

    path.write_text(text.replace(anchor, anchor + method, 1), encoding="utf-8")
    return str(path.relative_to(ROOT))


def verify_new_files() -> None:
    required = (
        "apps/api/dashboard/views.py",
        "apps/api/dashboard/tests.py",
        "apps/web/components/learner/LearnerShell.tsx",
        "apps/web/components/learner/LearnerDashboard.tsx",
        "apps/web/app/(learner)/dashboard/page.tsx",
        "scripts/check_day09.py",
    )
    missing = [item for item in required if not (ROOT / item).exists()]
    if missing:
        raise SystemExit("Missing Day 09 files: " + ", ".join(missing))


def main() -> None:
    verify_new_files()
    changed = [
        result
        for result in (patch_settings(), patch_urls(), patch_next_config())
        if result is not None
    ]

    if changed:
        print("Day 09 safe patch applied:")
        for item in changed:
            print(f" - {item}")
    else:
        print("Day 09 config patch was already present.")

    print()
    print(r"Next: python scripts\check_day09.py")


if __name__ == "__main__":
    main()
