from django.core.management.base import BaseCommand
from django.db import transaction
from ielts.practice_content import UNITS
from reading_path.models import ClinicRevision, ClinicQuestion

# The intervals refer to the original repair-v1.mp3. Re-listen during owner review.
LISTEN = [
    (
        "The Saturday repair morning starts at ten.",
        0,
        4480,
        [
            "ساعت نه در اعلان نیامده است.",
            "ten زمان شروع است.",
            "ساعت یازده اعلام نشده است.",
        ],
    ),
    (
        "but they cannot work on phones.",
        7360,
        11920,
        [
            "رادیو در فهرست وسایل قابل بررسی است.",
            "phones استثنای اعلام‌شده است.",
            "چراغ در فهرست وسایل قابل بررسی است.",
        ],
    ),
    (
        "If a new part is needed, you will pay for the part yourself.",
        11920,
        17360,
        [
            "برای ورود هزینه‌ای گفته نشده است.",
            "بازرسی رایگان است.",
            "هزینهٔ قطعه با مراجعه‌کننده است.",
        ],
    ),
    (
        "so this week we will meet in the garden room.",
        17360,
        22240,
        [
            "میز اصلی محل ثبت‌نام است.",
            "محل برگزاری این هفته اتاق باغ است.",
            "اتاق همیشگی در حال رنگ‌آمیزی است.",
        ],
    ),
    (
        "Please enter through the side door on Park Road.",
        22240,
        25840,
        [
            "ورودی کناری خیابان پارک دقیقاً ذکر می‌شود.",
            "نام کتابخانه ورودی مناسب را تعیین نمی‌کند.",
            "دروازهٔ باغ در اعلان نیامده است.",
        ],
    ),
    (
        "leave your name at the main desk by Thursday evening.",
        24800,
        28764,
        [
            "صبح جمعه بعد از مهلت است.",
            "شنبه روز برنامه است، نه مهلت ثبت‌نام.",
            "تا عصر پنج‌شنبه باید نام را ثبت کرد.",
        ],
    ),
]
READ = [
    (
        "everyone had to reserve a place, including library members.",
        [
            "اعضای کتابخانه نیز مشمول رزرو هستند.",
            "متن معافیتی برای اعضا قائل نشده است.",
            "قانون اعضا صریحاً بیان شده است.",
        ],
    ),
    (
        "The library did not change its opening hours.",
        [
            "ساعت کار ثابت مانده است.",
            "متن تغییر ساعت را صریحاً رد می‌کند.",
            "اطلاعات مربوط به ساعت کار وجود دارد.",
        ],
    ),
    (
        "On the first two Saturdays, visitors could enter without booking.",
        [
            "شرط ورود، تعداد بازدیدکنندگان را مشخص نمی‌کند.",
            "برتری شنبهٔ اول هم گزارش نشده است.",
            "بین تعداد بازدیدکنندگان دو شنبه مقایسه نشده است.",
        ],
    ),
    (
        "A rain tank supplies some of the water, and the rest comes from the building.",
        [
            "some با all برابر نیست.",
            "بخشی از آب از ساختمان می‌آید.",
            "منبع بقیهٔ آب بیان شده است.",
        ],
    ),
    (
        "a request from the building manager to keep the stairway clear.",
        [
            "دلیل درخواست روشن نگه داشتن مسیر عبور است.",
            "جمله‌ای خلاف این خواسته وجود ندارد.",
            "خواست مدیر به روشنی ذکر شده است.",
        ],
    ),
    (
        "It has yet to compare these records with those of any other garden.",
        [
            "مصرف کمتر اندازه‌گیری و مقایسه نشده است.",
            "مصرف بیشتر یا برابر هم اثبات نشده است.",
            "نبود مقایسه اجازهٔ نتیجه‌گیری نمی‌دهد.",
        ],
    ),
]


class Command(BaseCommand):
    help = "Create editable evidence revisions for the two original practice units."

    @transaction.atomic
    def handle(self, **options):
        for slug, unit in UNITS.items():
            listening = unit["skill"] == "listening"
            draft, new = ClinicRevision.objects.get_or_create(
                slug=slug.replace("-v1", "-evidence-v2"),
                defaults={
                    "source_slug": slug,
                    "title": unit["title"],
                    "instruction": unit["instruction"],
                    "material": unit.get("transcript", unit.get("passage")),
                    "duration_ms": 28764 if listening else 0,
                },
            )
            if not new:
                continue
            for q, entry in zip(
                unit["questions"], LISTEN if listening else READ, strict=True
            ):
                ClinicQuestion.objects.create(
                    draft=draft,
                    code=q["id"],
                    prompt=q["prompt"],
                    options="\n".join(q["choices"]),
                    answer=q["answer"],
                    explanation=q["explanation"],
                    evidence=entry[0],
                    reasons="\n".join(entry[-1]),
                    start_ms=entry[1] if listening else None,
                    end_ms=entry[2] if listening else None,
                )
            self.stdout.write(f"Draft {draft.slug} is ready for review.")
