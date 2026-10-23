import type { IeltsClinicData } from "@endoora/contracts";

export const SPEAKING_PERSIAN_L1_PHONOLOGY_CLINIC: IeltsClinicData = {
  id: "speaking-persian-l1-phonology",
  skill: "speaking",
  titleFa: "اصلاح چالش‌های تلفظی فارسی‌زبان‌ها",
  titleEn: "Persian L1 Phonological & Stress Correction",
  targetBands: "باند ۷.۰ تا ۹.۰",
  estimatedMinutes: 25,
  heroIcon: "🗣️",
  badgeLabelFa: "پاکسازی خطاهای آوایی فارسی",
  hurdleSummaryFa:
    "ریشه‌کن کردن خطاهای ناخودآگاه آوایی ایرانی‌ها در آیلتس: تفکیک صدای /w/ از /v/، ادای روان /θ/ و /ð/، حذف کسره اضافی در کلماتی مانند e-sport و e-student، و تکیه صحیح واژگان.",

  strategyGuide: {
    corePrinciplesFa: [
      "معضل /w/ در برابر /v/: در فارسی صدای /w/ وجود ندارد و زبان‌آموزان به اشتباه کلماتی چون world, with, work را با دندان روی لب پایین (مانند /v/) ادا می‌کنند. برای /w/، لب‌ها باید کاملاً غنچه و گرد شوند و دندان‌ها هیچ تماسی با لب نداشته باشند.",
      "تله کسره پیش‌آغازی در خوشه‌های صامت (Epenthesis): در ساختار هجایی فارسی، هیچ واژه‌ای با دو حرف بی‌صدا (Consonant Cluster) آغاز نمی‌شود؛ به همین دلیل ایرانی‌ها ناخودآگاه یک کسره /e/ به ابتدای کلماتی مثل sport (e-sport)، student (e-student) یا speak (e-speak) اضافه می‌کنند که سریعاً لهجه سنگین را به اگزمینر مخابره می‌کند.",
      "تلفظ صدای دندانی /θ/ و /ð/: در فارسی این اصوات به /s/ یا /t/ و /z/ یا /d/ تبدیل می‌شوند. برای think, thank, method نوک زبان باید دقیقاً بین دندان‌های پیشین لمس شود.",
      "تکیه نادرست هجاها (Word Stress Displacement): فارسی تکیه را معمولاً روی هجای پایانی می‌گذارد، اما انگلیسی در کلماتی چون 'PHO-to-graph', 'eco-NO-mic', 'de-VE-lop-ment' تکیه متحرک دارد.",
    ],
    goldenFormulaFa:
      "صدای /w/: لب‌های گرد مثل فوت کردن شمع (بدون تماس دندان) | خوشه‌های /s/: شروع با صدای سوت ممتد 'ssss-port' بدون هیچ واکه اضافی قبل از آن.",
    goldenFormulaEn:
      "/w/: Rounded lips, zero dental contact | /s/ clusters: Sustained fricative lead-in ('ssss-tudent') with strict zero preceding epenthesis.",
    timeManagementTipFa:
      "قبل از ورود به اتاق مصاحبه، با تکرار عبارت 'We went west to work with wonderful women' عضلات لب را گرم و فعال کنید.",
    keyVocabulary: [
      { word: "phonological interference", fa: "تداخل آواشناسی زبان مادری", ipa: "/ˌfəʊ.nəˈlɒdʒ.ɪ.kəl ˌɪn.təˈfɪə.rəns/" },
      { word: "epenthesis", fa: "افزودن واکه اضافی میان حروف بی‌صدا", ipa: "/ɪˈpen.θə.sɪs/" },
      { word: "labiovelar glide", fa: "صدای نیمه‌مصوت لبی-نرم‌کامی (/w/)", ipa: "/ˌleɪ.bi.əʊˈviː.lər ɡlaɪd/" },
      { word: "word stress", fa: "تکیه یا ضرب‌آهنگ هجایی واژگان", ipa: "/wɜːd stres/" },
    ],
  },

  trapDeconstructions: [
    {
      id: "trap-1-w-vs-v",
      trapTitleFa: "تله یکی‌انگاری واج /w/ و /v/ (/w/ vs /v/ Merger)",
      trapTitleEn: "Substituting Labiodental /v/ for Bilabial /w/",
      contextPassageOrPrompt:
        "The candidate says: 'I vould like to vork in a very vide vorld.'",
      commonWrongChoice: "تلفظ یکسان w و v با تماس دندان‌های بالا و لب پایین",
      whyWrongFa:
        "در انگلیسی 'wine' (شراب) و 'vine' (درخت مو) یا 'wet' (خیس) و 'vet' (دامپزشک) دو واژه کاملاً مجزا هستند و اشتباه در آنها امتیاز Pronunciation را به ۵ کاهش می‌دهد.",
      correctChoice:
        "تلفظ متمایز: 'I would (/w/) like to work (/w/) in a very (/v/) wide (/w/) world (/w/).'",
      whyCorrectFa:
        "در would, work, wide, world لب‌ها کاملاً لوله‌ای و گرد می‌شوند؛ فقط در very دندان بالا لب پایین را لمس می‌کند.",
      examinerSecretFa:
        "معیار بند ۷ کمبریج برای تلفظ می‌گوید: 'Shows all the positive features of Band 6 and some, but not all, of the positive features of Band 8. Is generally understood throughout, though mispronunciation of a few words or sounds occasionally reduces clarity.'",
    },
    {
      id: "trap-2-es-sport",
      trapTitleFa: "تله کسره اضافه در کلمات با شروع s (The Epenthetic /e/ Reflex)",
      trapTitleEn: "Adding an Initial Vowel to /s/ Consonant Clusters",
      contextPassageOrPrompt:
        "The candidate says: 'In my country, doing e-sport and going to e-school is popular among e-students.'",
      commonWrongChoice: "گفتن /e-spɔːt/، /e-skuːl/ و /e-stjuːdənt/",
      whyWrongFa:
        "یک خطای بارز فونوتکتیک در گویشوران زبان فارسی که روانی لهجه را به شدت تصنعی و ناپخته نشان می‌دهد.",
      correctChoice: "شروع پیوسته: '...doing /spɔːt/ and going to /skuːl/ is popular among /stjuːdənts/.'",
      whyCorrectFa:
        "هوا پیش از شروع واژه از لای دندان‌ها خارج می‌شود ('sssss-port') بدون اینکه حنجره صدای کسره /e/ تولید کند.",
      examinerSecretFa:
        "اگزمینرهای مجرب در ۳۰ ثانیه نخست مصاحبه متوجه این الگوی فارسی می‌شوند.",
    },
  ],

  drills: [
    {
      id: "phono-q1",
      orderNumber: 1,
      promptFa: "کدام یک از جفت‌واژه‌های زیر تفاوت معنایی مستقیم بر اثر خطای تلفظ /w/ و /v/ دارند (Minimal Pairs)؟",
      promptEn: "Identify the minimal pair where confusing /w/ and /v/ fundamentally changes the intended meaning in an IELTS response.",
      options: [
        "wet (مرطوب) در برابر vet (دامپزشک)",
        "cat در برابر bat",
        "ship در برابر sheep",
        "pen در برابر pan",
      ],
      correctAnswerIndex: 0,
      trapTypeBadge: "#MinimalPairAcoustics",
      explanation: {
        briefFa: "گزینه ۱ صحیح است: 'wet' با صدای /w/ آغاز می‌شود و 'vet' با صدای /v/.",
        detailedFa:
          "اگر داوطلب بگوید 'The dog was wet' ولی آن را با دندان روی لب بگوید ('The dog was vet')، شنونده دچار ابهام شناختی جدی می‌شود.",
        cambridgeTipFa:
          "جفت‌های مینیمال مانند west/vest, wine/vine, wheel/veal بهترین تمرین برای تقویت عضلات لب هستند.",
      },
    },
    {
      id: "phono-q2",
      orderNumber: 2,
      promptFa: "تکیه اصلی (Primary Stress) در کلمه 'photography' روی کدام هجا قرار دارد؟",
      promptEn: "Where does the primary stress fall in the word 'photography'?",
      options: [
        "pho-TOG-ra-phy (هجای دوم)",
        "PHO-to-gra-phy (هجای اول)",
        "pho-to-GRAPH-y (هجای سوم)",
        "pho-to-gra-PHY (هجای چهارم)",
      ],
      correctAnswerIndex: 0,
      trapTypeBadge: "#ShiftStressTrap",
      explanation: {
        briefFa: "گزینه ۱ درست است: تکیه روی هجای دوم است (pho-TOG-ra-phy /fəˈtɒɡ.rə.fi/).",
        detailedFa:
          "در حالی که 'PHO-to-graph' تکیه بر هجای اول دارد، با اضافه شدن پسوند -y در 'photography' تکیه به هجای دوم (TOG) جابه‌جا می‌شود.",
        cambridgeTipFa:
          "جابه‌جایی تکیه در خانواده واژگان (photo, photography, photographic) از شایع‌ترین تله‌های بخش اسپیکینگ است.",
      },
    },
  ],
};
