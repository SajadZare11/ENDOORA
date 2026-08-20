# Endoora Question Bank Governance — Day 13

## Purpose

The question bank is the single reusable source of assessment/practice items for later placement,
practice, teacher assignments, and IELTS-like simulations. A consuming domain stores the immutable
`QuestionVersion.id`, not a copied prompt or answer key.

## Persian-first product rule

- Endoora interface copy defaults to Persian and RTL.
- English interface copy is available as an option.
- English learning passages, IPA, URLs, email, and code remain isolated LTR.
- Stable UUIDs/slugs never depend on translated labels.

## Versioning

`Question` is the stable identity. `QuestionVersion` is the content snapshot.

When published content needs correction, create the next version, review/publish it, and retire the old
version when appropriate. Never edit a published version in place.

## Publication requirements

A version cannot publish without author, reviewer, source origin/title, documented licence, CEFR,
at least one Day 12 taxonomy objective, and the appropriate answer key or rubric.

## Copyright

Allowed content includes Endoora-owned originals, public-domain material with source metadata,
properly licensed material, and human-reviewed AI-assisted original content with a rights review.

Do not copy commercial coursebooks, Cambridge IELTS tests, British Council content, or protected
question sets without permission.

## Answer-key boundary

Learner pre-submission serializers exclude answer keys, accepted variants, rubrics, and explanations.
`learner_payload` is checked for embedded protected-answer fields.

Published-bank enumeration is editor/administrator-only. A known version can be rendered through the learner-safe serializer only for an authenticated user. After an authenticated submission, the answer-check endpoint returns only a result and explanation, not the raw stored answer key.

## Review workflow

`draft -> in_review -> published -> retired`

Review events are append-only. Imported items always start as draft.

## Taxonomy links

Question versions link only to Day 12 taxonomy nodes of kind `objective`. Published/retired links are immutable.

## Media

Day 13 stores media metadata/references only. Upload and signed-storage pipelines come later.
Published/retired media metadata is immutable.

## Difficulty versus CEFR

CEFR (`A1`–`C2`) and item difficulty (`1`–`5`) are deliberately separate.

## Import/export

Identical existing slug/version content is skipped. Conflicting content at the same slug/version fails:
create a new version instead. Import never auto-publishes. Protected exports contain answer keys and
must stay in controlled editor/backup workflows.

## Future consumers

Day 14 placement attempts and later assignments must store `QuestionVersion.id`, not only `Question.id`.
