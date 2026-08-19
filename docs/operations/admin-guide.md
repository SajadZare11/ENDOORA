# راهنمای عملیات Endoora — Day 11

این صفحه برای کنسول داخلی Django Admin است؛ صفحه عمومی سایت نیست.

## هدف

`Endoora Operations` باید به مدیر اجازه دهد تنظیمات امن، Feature Flagها و تاریخچه تغییرات را ببیند، بدون اینکه رمزها، OTP، متن خام زبان‌آموز، صوت، پیام خصوصی یا اطلاعات پرداخت در لاگ ممیزی ذخیره شود.

## آدرس محلی

پس از اجرای API:

`http://127.0.0.1:8000/admin/`

## ساخت حساب مدیر محلی

فقط اگر هنوز superuser ندارید، از پوشه `apps\api` اجرا کنید:

`python manage.py createsuperuser`

رمز را فقط در ترمینال محلی وارد کنید و هرگز در Git یا چت قرار ندهید.

## گروه‌های عملیاتی

از `apps\api` اجرا کنید:

`python manage.py bootstrap_admin_roles`

گروه‌های زیر ساخته می‌شوند:

- `Endoora Support` — فقط مشاهده محدود رکوردهای حساب مجاز؛ بدون تغییر نقش/قابلیت.
- `Endoora Content Editor` — پایه دسترسی محتوایی برای اپ‌های محتوای آینده.
- `Endoora Finance` — پایه مالی آینده؛ در Day 11 اجازه تغییر آزاد وضعیت پرداخت ندارد.
- `Endoora Moderator` — پایه moderation برای اپ‌های آینده.

داشتن `is_staff=True` به‌تنهایی دسترسی کامل ایجاد نمی‌کند. نقش/گروه عملیاتی و permissionهای Django هم بررسی می‌شوند.

## SystemSetting

برای مقادیری است که واقعاً باید از دیتابیس قابل مدیریت باشند.

هر رکورد باید `owner` و `rationale` داشته باشد. کلیدهای مربوط به secret/token/password/API key/OTP/Merchant ID رد می‌شوند. این مقادیر باید فقط در `.env` یا secret manager قرار بگیرند.

نمونه امن:

- key: `homepage_item_limit`
- value_type: `integer`
- value: `6`
- environment_scope: `global`
- owner: `product`
- rationale: `Keep dashboard summaries compact`

## FeatureFlag

هر Flag باید این موارد را مشخص کند:

- `owner`
- `rationale`
- `rollout_percentage`
- `environments`
- `dependencies`
- `kill_switch_behavior`

برای Flag فعال، rollout نمی‌تواند صفر باشد.

## AuditEvent

AuditEvent فقط قابل مشاهده است. ویرایش و حذف از Django Admin و ORM مسدود شده است.

هر تغییر privileged شامل این خلاصه‌هاست:

- actor
- target
- before/after summary
- reason
- time
- request method/path
- environment

فیلدهای حساس در snapshot با `<redacted-...>` جایگزین می‌شوند.

## دلیل تغییر

برای SystemSetting و FeatureFlag، `rationale` علت عملیاتی را نگه می‌دارد. برای APIهای مدیریتی آینده می‌توان هدر `X-Endoora-Audit-Reason` را ارسال کرد. این هدر نباید شامل secret یا داده خصوصی کاربر باشد.

## ممنوع

- ذخیره API key، Merchant ID، password، OTP یا token در SystemSetting
- تغییر دستی payment state
- حذف AuditEvent
- دادن superuser به Support/Editor برای راحتی
- استفاده از impersonation برای «دیدن به جای کاربر»

## تست روز 11

دستورها و مسیر دستی دقیق در:

`docs/operations/DAY_11_ACCEPTANCE_GATE.md`
