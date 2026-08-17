# Endoora Deployment Runbook — Day 01 Baseline

No deployment is performed on Day 01.

Planned environments:
- development
- test
- staging
- production

Planned hostnames:
- endoora.ir
- www.endoora.ir -> permanent redirect to root
- api.endoora.ir
- staging.endoora.ir
- api-staging.endoora.ir
- media.endoora.ir if required

IRNIC DNS must not be changed until staging infrastructure exists and exact host records are known.

Paid production additionally requires HTTPS, live-payment verification, reconciliation/refund/support procedures, monitoring, backups, legal pages, and incident response.
