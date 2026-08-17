# Endoora Naming Standard

## Public product identity

Public product name:

Endoora

Official motto:

A new door to your English

Canonical production domain:

https://endoora.ir

## Technical naming

Preferred technical slug:

endoora

Preferred repository root:

Endoora/

New internal identifiers should normally use lowercase `endoora`.

Product-specific environment variables should use the `ENDOORA_` prefix when appropriate.

Examples:

ENDOORA_TIMEZONE
ENDOORA_PUBLIC_URL
ENDOORA_API_URL

## Brand rules

Use `Endoora` in:

- Website headings
- Page titles
- Public marketing content
- Emails
- Receipts
- Support messages
- Legal documents
- User-facing notifications
- Generated reports

Use `endoora` for:

- Repository/service slugs
- Package-safe identifiers
- URLs where lowercase is appropriate
- Storage prefixes
- Environment/service identifiers

## Motto usage

The motto is:

A new door to your English

The motto may appear in:

- Homepage hero
- Public marketing pages
- Brand presentations
- Selected footer treatments
- Product documents

The motto must not replace functional navigation labels such as:

- Login
- Placement Test
- Dashboard
- Practice
- Account

## Previous brand

The previous project name was NeuraLingo.

Because this project is being built from scratch, new source code, documentation, databases, environment variables, service names, and public content must use Endoora naming from the beginning.

If an old identifier is later imported from a previous prototype or external system, it must not be renamed destructively without checking references and migration safety.

## Domain rule

The canonical production website will be:

https://endoora.ir

The `www` version should eventually redirect permanently to the canonical root domain:

https://www.endoora.ir
→
https://endoora.ir

DNS must not be changed during Day 01.

Production DNS configuration belongs to the deployment stage after the required hosting and staging infrastructure exists.
