# Endoora Domain Map

## Canonical production domain

Public website:

https://endoora.ir

Purpose:

Public marketing website plus authenticated learner and teacher application.

## Planned production hostnames

### Public website

https://endoora.ir

Status:

Reserved for production.

### WWW redirect

https://www.endoora.ir

Purpose:

Permanent redirect to:

https://endoora.ir

### Production API

https://api.endoora.ir

Purpose:

Django REST API and approved server-side callbacks.

### Production media

https://media.endoora.ir

Purpose:

Optional object-storage or CDN delivery for approved media.

This hostname will only be used if the selected infrastructure requires it.

## Planned staging hostnames

### Staging website

https://staging.endoora.ir

Purpose:

Production-like testing before release.

### Staging API

https://api-staging.endoora.ir

Purpose:

Staging Django API.

## Local development

Local development addresses will be selected during environment setup.

Localhost addresses must never be used in:

- Production payment callbacks
- Production emails
- Canonical metadata
- Production receipts
- Production sitemap entries

## DNS rule

No IRNIC nameserver or DNS change will be performed during Day 01.

The domain is documented now so architecture and URLs remain consistent.

Actual DNS records will be configured after the staging infrastructure exists during the deployment phase.

## Canonical-host rule

The canonical production public hostname is:

endoora.ir

Alternative public hostnames must redirect to the canonical hostname instead of creating duplicate public versions of the website.
