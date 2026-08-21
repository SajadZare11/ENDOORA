# Endoora Day 11 admin permission hotfix

Fixes:

`TypeError: BaseModelAdmin.has_add_permission() takes 2 positional arguments but 3 were given`

Cause:
Django `ModelAdmin.has_add_permission()` accepts `(self, request)`, while the original Day 11 generic permission wrapper passed `(self, request, obj)` to every hook.

Files replaced:
- `apps/api/audit/admin_policy.py`
- `apps/api/audit/tests.py`
- `scripts/check_day11.py`

No migration is added or changed by this hotfix.
No user data is modified by this hotfix.
