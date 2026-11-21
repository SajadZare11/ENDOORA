"""Original ENDOORA short practice units. Publish an exact revision after review."""
from hashlib import sha256
import json


def question(key, statement, choices, answer, explanation):
    return dict(id=key, prompt=statement, choices=choices, answer=answer, explanation=explanation)


TFNG = ["True", "False", "Not Given"]
TRANSCRIPT = (
    "Welcome to the Oak Street library. The Saturday repair morning starts at ten. "
    "Please bring one small electrical item per person. Our volunteers can look at lamps and radios, "
    "but they cannot work on phones. There is no charge for the inspection. "
    "If a new part is needed, you will pay for the part yourself. "
    "The usual meeting room is being painted, so this week we will meet in the garden room. "
    "Please enter through the side door on Park Road. "
    "To reserve a place, leave your name at the main desk by Thursday evening."
)
UNITS = {
    "rooftop-v1": dict(
        title="Reading · A rooftop garden", skill="reading", language="en", version=1,
        instruction="Decide whether the text supports each statement, contradicts it, or leaves it open.",
        passage=("In April, the Mehr Library opened its rooftop garden to readers on Saturday mornings. "
                 "On the first two Saturdays, visitors could enter without booking. From the third Saturday onward, "
                 "everyone had to reserve a place, including library members. The change followed a request from "
                 "the building manager to keep the stairway clear. The library did not change its opening hours. "
                 "Volunteers water the beds on weekdays. A rain tank supplies some of the water, and the rest comes "
                 "from the building. The library records how much water it uses each week. It has yet to compare "
                 "these records with those of any other garden."),
        questions=[
            question("r1","Library members needed a reservation on the fourth Saturday.",TFNG,"True","از شنبهٔ سوم به بعد همه، از جمله اعضا، باید جا رزرو می‌کردند."),
            question("r2","The library extended its opening hours when booking began.",TFNG,"False","متن صریحاً می‌گوید ساعت کار تغییر نکرد."),
            question("r3","More people visited on the second Saturday than on the first.",TFNG,"Not Given","تعداد بازدیدکنندگان این دو روز در متن مقایسه نشده است."),
            question("r4","All the water used in the beds comes from the rain tank.",TFNG,"False","فقط بخشی از آب از مخزن باران تأمین می‌شود."),
            question("r5","The manager wanted to keep the stairway clear.",TFNG,"True","متن باز ماندن راه‌پله را دلیل درخواست مدیر می‌داند."),
            question("r6","The rooftop garden uses less water than the town park.",TFNG,"Not Given","دادهٔ مقایسه‌ای وجود ندارد. نبودِ مدرک برای یک ادعا، نادرست بودن آن را ثابت نمی‌کند."),
        ]),
    "repair-v1": dict(
        title="Listening · Repair morning", skill="listening", language="en", version=1,
        instruction="Listen to the library announcement and choose one answer for each question.",
        audio="/audio/practice/repair-v1.mp3", audio_sha256="bc20fbfe186b7cd125f1f7b7b63f62d01f5239fa68d24b361d0f4dcbdbeaa20b", transcript=TRANSCRIPT,
        questions=[
            question("l1","When does the event begin?",["Nine","Ten","Eleven"],"Ten","عبارت starts at ten زمان شروع را مشخص می‌کند."),
            question("l2","Which item will volunteers decline?",["A radio","A phone","A lamp"],"A phone","پس از but گوینده تلفن را استثنا می‌کند."),
            question("l3","What must a visitor pay for?",["Entry","Inspection","A replacement part"],"A replacement part","بازرسی رایگان است، اما هزینهٔ قطعه با مراجعه‌کننده است."),
            question("l4","Where is this week's session?",["The main desk","The garden room","The usual meeting room"],"The garden room","اتاق همیشگی در حال رنگ‌آمیزی است."),
            question("l5","Which entrance should visitors use?",["Park Road side door","Oak Street main door","Garden gate"],"Park Road side door","side door on Park Road به ورودی مربوط است."),
            question("l6","What is the booking deadline?",["Friday morning","Saturday morning","Thursday evening"],"Thursday evening","بعد از by، مهلت ثبت‌نام آمده است."),
        ]),
}


def revision(unit):
    return sha256(json.dumps(unit, ensure_ascii=False, sort_keys=True).encode()).hexdigest()


def public_unit(unit):
    return {**{k: v for k, v in unit.items() if k not in {"questions", "transcript"}},
            "questions": [{k: q[k] for k in ("id", "prompt", "choices")} for q in unit["questions"]]}


def grade(unit, answers):
    rows = [{**{k: q[k] for k in ("id", "answer", "explanation")},
             "correct": answers.get(q["id"]) == q["answer"]} for q in unit["questions"]]
    result = dict(correct=sum(row["correct"] for row in rows), total=len(rows), items=rows)
    if "transcript" in unit:
        result["transcript"] = unit["transcript"]
    return result
