from __future__ import annotations

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]

SECTIONS = {
    "docs/product/PROJECT_STATE.md": """
## Day 09 — Learner application shell

- Current roadmap day completed: Day 09, after the local acceptance gate passed.
- Learner Home is Persian-first with an English switch.
- Learner Home uses one aggregated endpoint: `GET /api/dashboard/home/`.
- First-time learners receive one primary next action: Placement.
- Unsupported CEFR, skill, path, SRS, assignment, class, XP, and notification values are not invented.
- Authentication and learner-role access are enforced server-side.
- Day 09 added no database model and required no migration.
- Exact next roadmap day: Day 10 — Build the teacher application shell and simplified navigation.
""",
    "docs/product/CHANGELOG.md": """
## Day 09 — Learner application shell

- Added the protected learner dashboard and responsive learner shell.
- Added Persian-first learner navigation with an English interface switch.
- Added one dominant Today / next-best-action card with a “why this action?” explanation.
- Added first-time, login-required, permission-denied, loading, offline, error, and retry states.
- Added the aggregated learner-home API and bounded primary-CTA analytics event.
- Added negative role tests and assertions that prevent fabricated progress values.
""",
    "docs/product/ROADMAP_PROGRESS.md": """
## Day 09 — Learner application shell

Status: complete only after the Day 09 automated and manual acceptance gate has passed.

Success gate: a learner can answer “What should I do now?” within five seconds, using one aggregated endpoint, with clear 360 px mobile hierarchy and no unsupported scores.
""",
    "docs/product/KNOWN_LIMITATIONS.md": """
## Day 09

- Placement scoring, missions, SRS, assignments, classes, courses, XP, and notifications are not implemented by the Day 09 shell.
- Their dashboard areas remain explicitly unavailable or empty until their owning roadmap days provide real evidence.
- The Day 09 Placement destination is a safe foundation page, not the final placement engine.
""",
    "docs/architecture/API_CONTRACTS.md": """
## Day 09 learner dashboard API

### `GET /api/dashboard/home/`

Session-authenticated, learner-only aggregated dashboard response.

It contains one next-best action plus bounded dashboard summaries. Until later learning domains exist, unavailable values remain empty, `false`, or `null`; they are never populated with invented learning evidence.

### `POST /api/dashboard/events/`

Session-authenticated, learner-only bounded analytics event.

Accepted event: `primary_cta_click`.

Raw learner content and arbitrary analytics event names are rejected.
""",
    "docs/architecture/ARCHITECTURE.md": """
## Day 09 learner-home aggregation boundary

The learner dashboard reads from one dashboard service boundary rather than making one frontend request per future feature.

The next-best-action resolver is deterministic. Later Placement, Mission, SRS, Assignment, and Class services will supply real signals to it.

Authorization remains a Django server responsibility; the Next.js learner shell is presentation and recovery UX, not the security boundary.
""",
    "docs/architecture/DATA_DICTIONARY.md": """
## Day 09 dashboard data

Day 09 creates no persistent dashboard model.

The dashboard response is derived from the authenticated user plus bounded learning signals. No CEFR estimate, progress percentage, XP amount, assignment, class, SRS count, or notification count is fabricated or persisted by this module.
""",
    "docs/quality/TEST_MATRIX.md": """
## Day 09 learner dashboard

- Anonymous -> learner dashboard: denied.
- Teacher -> learner dashboard: denied server-side.
- Learner -> learner dashboard: allowed.
- First-time learner -> Placement is the single primary action.
- No learning evidence -> no skill estimate and no path percentage.
- Next-best-action resolver priority: urgent assignment > mission > SRS > placement > class > general learning.
- Dashboard analytics -> bounded event/action identifiers only.
- 360 px -> mobile bottom navigation and dominant Today action.
- Offline/retry -> visible recovery behavior.
- Persian/English -> RTL/LTR switch verified.
""",
}


def append_once(relative: str, section: str) -> bool:
    path = ROOT / relative
    path.parent.mkdir(parents=True, exist_ok=True)

    if path.exists():
        current = path.read_text(encoding="utf-8")
        if "## Day 09" in current:
            return False
        updated = current.rstrip() + "\n\n" + section.strip() + "\n"
    else:
        updated = section.strip() + "\n"

    path.write_text(updated, encoding="utf-8")
    return True


def main() -> None:
    changed = []
    for relative, section in SECTIONS.items():
        if append_once(relative, section):
            changed.append(relative)

    if changed:
        print("Day 09 documentation recorded:")
        for item in changed:
            print(f" - {item}")
    else:
        print("Day 09 documentation was already recorded.")

    print()
    print("Review git diff before committing.")


if __name__ == "__main__":
    main()
