# Endoora Taxonomy Governance

## Purpose

Day 12 creates one stable learning map used by future placement items, practice, courses,
Daily Missions, teacher assignments, analytics, search, and IELTS-like practice.

The taxonomy is **Persian-first** in presentation and bilingual in storage:

- `label_fa` and `description_fa` are the default user-facing labels.
- `label_en` and `description_en` are the optional English alternative.
- `slug` and UUID are language-neutral machine identifiers and must not change merely
  because a translation improves.

## Stable identity rule

A taxonomy node is never deleted or silently renamed after use.

- UUID: immutable database identity.
- `slug`: stable machine-readable identity.
- Display wording: editable/versioned without changing UUID/slug.
- Old topics: mark `deprecated`; optionally point to a replacement.
- Structural changes: use a new imported taxonomy release.

This protects historical questions, attempts, learning evidence, and reports.

## Supported node kinds

1. `skill`
2. `subskill`
3. `objective`
4. `grammar_topic`
5. `vocabulary_topic`
6. `age_tag`
7. `exam_tag`

The initial skill map contains the six core language skills plus Pronunciation,
Learning/Exam Strategy, and Culture/Language Use.

## CEFR and difficulty are different

`cefr_level` records the intended CEFR-aligned level of an objective/topic.
It is not a numeric difficulty score and must not be used as one.

A future question can be difficult for an A2 learner while still targeting an A2 objective.
Question/item difficulty belongs to the assessment/question-bank domain, not this taxonomy field.

## Descriptor/source and licensing rule

Endoora stores `descriptor_reference`, `source_name`, `source_url`, and `license_note`.

The Day 12 seed uses Endoora-authored paraphrases and source-reference notes. It does
not copy official CEFR descriptor text verbatim and it does not claim Endoora's wording
is an official CEFR descriptor.

Before importing any external wording verbatim, an editor must verify the reuse/licensing
terms and record them.

## Controlled import

Run from `apps/api` with the virtual environment active:

```powershell
python manage.py import_taxonomy --dry-run
python manage.py import_taxonomy
```

The importer:

- validates unique lowercase slugs;
- validates parent/replacement references;
- rejects prerequisite cycles;
- creates an immutable release record;
- preserves existing node UUIDs;
- creates node snapshots for each release;
- retires prerequisite edges instead of deleting their history;
- never deletes taxonomy nodes that disappear from a file.

Re-running the same release is idempotent. Reusing the same release version with
different JSON is rejected.

## Admin editing rules

Django admin provides a bilingual taxonomy browser/editor.

Allowed routine edits:

- Persian/English display wording;
- descriptions;
- source/licensing notes;
- estimated effort;
- status/deprecation;
- replacement pointer.

Protected behavior:

- UUID is read-only.
- Existing slug is read-only.
- releases/revisions/prerequisite history cannot be added/deleted manually.
- taxonomy nodes cannot be deleted through admin.

Structural batches and prerequisite changes should use a new versioned JSON import.

## Prerequisites

Prerequisites form a directed acyclic graph: an objective can require earlier objectives,
but cycles are invalid. The import command rejects cycles before committing changes.

## API contract

Base path: `/api/taxonomy/`

- `GET nodes/`
- `GET nodes/<uuid>/`
- `GET objectives/`
- `GET meta/`

Supported list filters:

- `kind`
- `cefr`
- `parent` (parent slug)
- `q`
- `page`
- `per_page` (maximum 100)
- `include_deprecated=1`
- `lang=en`

If `lang` is absent or invalid, Persian (`fa`) is used.

## Deprecation procedure

1. Never delete or rename a used node.
2. Create a new release file.
3. Set the old node `status` to `deprecated`.
4. Set `replacement` when a clear successor exists.
5. Import the new release.
6. Verify the old UUID is still queryable with `include_deprecated=1`.
7. Verify new selectors hide deprecated nodes by default.

## Day 12 acceptance evidence

The day is not complete until:

- import succeeds twice with no duplicated nodes;
- `makemigrations --check --dry-run` reports no changes;
- backend tests pass;
- Persian labels are default in API/admin;
- English labels are available with `lang=en`;
- a label can change in a new release without changing the UUID;
- deprecated nodes remain traceable;
- prerequisite cycle validation is proven;
- admin cannot delete a taxonomy node.
