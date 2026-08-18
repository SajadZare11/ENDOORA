# Endoora Persian-First Localization Contract

Status: **Non-negotiable product rule**

## Default experience

- Endoora's default user-facing language is **Persian (fa)**.
- The default page direction is **RTL**.
- The primary audience is Iranian English learners and teachers.
- A visible **English** language switch must be available.
- The language choice should persist when account/localization infrastructure is implemented.

## Brand exception

The following remain in English in both language modes:

- `Endoora`
- `A new door to your English`

Do not translate or transliterate the public product name or motto in the main brand lockup.

## What remains LTR inside Persian pages

Even when the interface is Persian/RTL, isolate these in LTR containers:

- English-learning examples
- English answer fields where the learner must write English
- IPA
- email addresses
- URLs
- code and technical identifiers
- route examples
- IELTS passages and English exam content
- model/provider identifiers shown only in operational developer/admin contexts

Use `dir="ltr"` and appropriate `lang="en"` where the semantic language is English.

## Navigation display labels

Machine routes stay stable and English-safe. Display labels are localized.

Examples:

| Route | Persian default label | English option |
|---|---|---|
| `/` | خانه | Home |
| `/placement` | تعیین سطح | Placement |
| `/teachers` | مدرس‌ها | Teachers |
| `/classes` | کلاس‌ها | Classes |
| `/pricing` | تعرفه‌ها | Pricing |
| `/account` | حساب کاربری | Account |
| `/account/billing` | صورتحساب | Billing |

Do not translate route slugs merely to make the UI Persian.

## Typography

- Persian UI: Vazirmatn or approved Persian-readable local font.
- English/LTR educational text: Inter or approved Latin fallback.
- Persian body line-height remains generous for readability.

## Numbers, dates, time and money

Later localization work must deliberately define display formatting rather than mixing formats accidentally.

Product rules already fixed elsewhere remain:

- display/scheduling timezone: `Asia/Tehran`
- money presented to users in تومان under the canonical money convention
- timestamps stored in UTC

## Accessibility

Changing language must update:

- `lang`
- `dir`
- visible labels
- accessible names where those names are localized

Keyboard navigation and focus order must remain logical in both RTL and LTR modes.

## Testing rule

Every user-facing screen added from Day 05 onward must be checked in:

1. Persian default / RTL
2. English option / LTR
3. Persian UI containing isolated English/LTR educational content
4. 360 px mobile
5. desktop

A page that only works in English does not pass the Endoora definition of done.
