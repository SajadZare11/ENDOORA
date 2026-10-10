import type { SpeakingMission, CefrLevel } from "./types";
export type { SpeakingMission, SpeakingTurn, SpeakingKeywordObjective, SpeakingVocabUpgrade } from "./types";

// ============================================================================
// SPEAKING MISSIONS CURRICULUM: A1 TO C2 (10 LEVELS PER CEFR, 60 TOTAL)
// ============================================================================

export const A1_SPEAKING_MISSIONS: SpeakingMission[] = [
  {
    levelNumber: 1,
    cefr: "A1",
    titleFa: "احوال‌پرسی و معرفی دوستانه",
    titleEn: "Hello & First Introductions",
    scenarioFa: "در کافه محوطه دانشگاه لندن با یک هم‌کلاسی جدید روبرو شده‌ای. با آرامش و اعتماد به نفس یخ گفتگو را باز کن.",
    locationContextFa: "کافه پردیس دانشگاه لندن",
    xpReward: 60,
    timeLimitTotalSeconds: 65,
    minPassScore: 70,
    ghostRival: {
      name: "سارا رضایی",
      avatar: "👩‍🎓",
      city: "شیراز",
      reactionTimeAvg: 1.6,
      targetScore: 820,
      wpm: 88,
      title: "قهرمان شروع مکالمه",
    },
    turns: [
      {
        turnNumber: 1,
        characterSpeaker: {
          name: "Emma",
          roleFa: "دانشجوی جدید",
          text: "Hi there! Is anyone sitting here? May I join you?",
          avatar: "👩‍🦰",
        },
        idealResponse: {
          text: "Hi Emma! No, nobody is here. Please have a seat. Nice to meet you!",
          audioText: "Hi Emma! No, nobody is here. Please have a seat. Nice to meet you!",
          explanationFa: "پاسخ دوستانه و مودبانه با دعوت به نشستن و استفاده از عبارت کلیدی Nice to meet you.",
        },
        keywords: [
          { id: "k-a1-1-1", phrase: "Nice to meet you", phoneticOrHintFa: "/naɪs tuː miːt juː/ (خوشبختم)", weight: 30 },
          { id: "k-a1-1-2", phrase: "have a seat", phoneticOrHintFa: "/hæv ə siːt/ (بفرما بشین)", weight: 25 },
        ],
        fallbackOptions: [
          "Hi Emma! No, nobody is here. Please have a seat. Nice to meet you!",
          "Yes, go away please, I am very busy.",
          "I don't know who is sitting.",
        ],
        vocabUpgrades: [
          {
            learnerPhrase: "Sit down",
            nativeUpgrade: "Please have a seat / Feel free to sit here",
            explanationFa: "عبارت 'Please have a seat' بسیار صمیمانه‌تر و نیتیوتر از گفتن خشکِ 'Sit down' است.",
            audioText: "Please have a seat.",
          },
        ],
        reactionWindowSeconds: 15,
      },
      {
        turnNumber: 2,
        characterSpeaker: {
          name: "Emma",
          roleFa: "دانشجوی جدید",
          text: "Thanks a lot! I'm Emma, an art student. What is your name and what do you study?",
          avatar: "👩‍🦰",
        },
        idealResponse: {
          text: "My name is Alex. I am a student here and I study English and design.",
          audioText: "My name is Alex. I am a student here and I study English and design.",
          explanationFa: "معرفی نام و رشته تحصیلی با گرامر ساده Present Simple و تلفظ روان.",
        },
        keywords: [
          { id: "k-a1-1-3", phrase: "My name is", phoneticOrHintFa: "/maɪ neɪm ɪz/ (اسم من هست...)", weight: 25 },
          { id: "k-a1-1-4", phrase: "I study", phoneticOrHintFa: "/aɪ ˈstʌdi/ (من درس می‌خوانم)", weight: 20 },
        ],
        fallbackOptions: [
          "My name is Alex. I am a student here and I study English and design.",
          "I am name Alex English.",
          "Name is Alex student.",
        ],
        vocabUpgrades: [
          {
            learnerPhrase: "I learn English",
            nativeUpgrade: "I'm majoring in English / I study English",
            explanationFa: "در فضای دانشگاهی، فعل study یا عبارت majoring in بیان اصیل‌تری از رشته تحصیلی است.",
            audioText: "I study English and design.",
          },
        ],
        reactionWindowSeconds: 16,
      },
      {
        turnNumber: 3,
        characterSpeaker: {
          name: "Emma",
          roleFa: "دانشجوی جدید",
          text: "That sounds awesome! My class starts in ten minutes, but have a wonderful day!",
          avatar: "👩‍🦰",
        },
        idealResponse: {
          text: "Thanks, Emma! You too! See you around the campus!",
          audioText: "Thanks, Emma! You too! See you around the campus!",
          explanationFa: "خداحافظی گرم و مودبانه با اصطلاح See you around.",
        },
        keywords: [
          { id: "k-a1-1-5", phrase: "See you", phoneticOrHintFa: "/siː juː/ (می‌بینمت)", weight: 25 },
          { id: "k-a1-1-6", phrase: "You too", phoneticOrHintFa: "/juː tuː/ (همچنین شما)", weight: 25 },
        ],
        fallbackOptions: [
          "Thanks, Emma! You too! See you around the campus!",
          "Goodbye forever.",
          "Okay bye bye.",
        ],
        vocabUpgrades: [
          {
            learnerPhrase: "Good day to you",
            nativeUpgrade: "Have a good one / You too, see you around!",
            explanationFa: "عبارت 'See you around' روشی طبیعی برای خداحافظی با کسی است که دوباره او را در محیط کار یا تحصیل می‌بینید.",
            audioText: "You too! See you around!",
          },
        ],
        reactionWindowSeconds: 15,
      },
    ],
  },
  {
    levelNumber: 2,
    cefr: "A1",
    titleFa: "سفارش قهوه در کافی‌شاپ",
    titleEn: "Ordering Coffee Like a Local",
    scenarioFa: "در یک کافه دنج در نیویورک ایستاده‌ای. باریستا از تو می‌خواهد سفارشت را ثبت کنی.",
    locationContextFa: "کافی‌شاپ نیویورک",
    xpReward: 65,
    timeLimitTotalSeconds: 60,
    minPassScore: 70,
    ghostRival: {
      name: "امیر حسینی",
      avatar: "☕",
      city: "تهران",
      reactionTimeAvg: 1.5,
      targetScore: 840,
      wpm: 92,
      title: "سفارش‌دهنده سریع",
    },
    turns: [
      {
        turnNumber: 1,
        characterSpeaker: {
          name: "Barista Jack",
          roleFa: "باریستا",
          text: "Good morning! Welcome to Bean Roasters. What can I get started for you?",
          avatar: "👨‍🍳",
        },
        idealResponse: {
          text: "Good morning! Can I have a medium latte, please?",
          audioText: "Good morning! Can I have a medium latte, please?",
          explanationFa: "شروع محترمانه با 'Can I have...' به جای دستور مستقیم دادن.",
        },
        keywords: [
          { id: "k-a1-2-1", phrase: "Can I have", phoneticOrHintFa: "/kæn aɪ hæv/ (می‌تونم داشته باشم...)", weight: 30 },
          { id: "k-a1-2-2", phrase: "please", phoneticOrHintFa: "/pliːz/ (لطفاً)", weight: 20 },
        ],
        fallbackOptions: [
          "Good morning! Can I have a medium latte, please?",
          "Give me coffee now.",
          "I want coffee latte.",
        ],
        vocabUpgrades: [
          {
            learnerPhrase: "I want a coffee",
            nativeUpgrade: "Can I get a latte, please? / Could I have a latte?",
            explanationFa: "گفتن 'I want' کمی تند و غیرمودبانه به گوش می‌رسد؛ نیتیوها از 'Can I have / Could I get' استفاده می‌کنند.",
            audioText: "Can I get a medium latte, please?",
          },
        ],
        reactionWindowSeconds: 15,
      },
      {
        turnNumber: 2,
        characterSpeaker: {
          name: "Barista Jack",
          roleFa: "باریستا",
          text: "Sure thing! Do you want whole milk or oat milk with that?",
          avatar: "👨‍🍳",
        },
        idealResponse: {
          text: "Oat milk, please. And could you make it extra hot?",
          audioText: "Oat milk, please. And could you make it extra hot?",
          explanationFa: "پاسخ روشن به گزینه با شیر جو دوسر و درخواست میزان حرارت.",
        },
        keywords: [
          { id: "k-a1-2-3", phrase: "Oat milk", phoneticOrHintFa: "/oʊt mɪlk/ (شیر جو دوسر)", weight: 25 },
          { id: "k-a1-2-4", phrase: "extra hot", phoneticOrHintFa: "/ˈekstrə hɑːt/ (داغ‌تر)", weight: 25 },
        ],
        fallbackOptions: [
          "Oat milk, please. And could you make it extra hot?",
          "Yes milk animal.",
          "No milk water.",
        ],
        vocabUpgrades: [
          {
            learnerPhrase: "Very very hot",
            nativeUpgrade: "Extra hot",
            explanationFa: "اصطلاح استاندارد برای قهوه داغ‌تر در کافی‌شاپ‌ها 'extra hot' است.",
            audioText: "Oat milk, extra hot please.",
          },
        ],
        reactionWindowSeconds: 15,
      },
      {
        turnNumber: 3,
        characterSpeaker: {
          name: "Barista Jack",
          roleFa: "باریستا",
          text: "You got it! That will be four dollars and fifty cents. Cash or card?",
          avatar: "👨‍🍳",
        },
        idealResponse: {
          text: "By card, please. Here you go! Keep the change.",
          audioText: "By card, please. Here you go! Keep the change.",
          explanationFa: "بیان روش پرداخت با کارت و اصطلاح رایج Here you go.",
        },
        keywords: [
          { id: "k-a1-2-5", phrase: "By card", phoneticOrHintFa: "/baɪ kɑːrd/ (با کارت)", weight: 25 },
          { id: "k-a1-2-6", phrase: "Here you go", phoneticOrHintFa: "/hɪr juː ɡoʊ/ (بفرمایید خدمت شما)", weight: 25 },
        ],
        fallbackOptions: [
          "By card, please. Here you go! Keep the change.",
          "Card machine money.",
          "I have no cash.",
        ],
        vocabUpgrades: [
          {
            learnerPhrase: "Take this money",
            nativeUpgrade: "Here you go / Here you are",
            explanationFa: "هنگام تحویل دادن پول یا کارت، زیباترین و رایج‌ترین اصطلاح 'Here you go' است.",
            audioText: "By card please. Here you go!",
          },
        ],
        reactionWindowSeconds: 15,
      },
    ],
  },
  {
    levelNumber: 3,
    cefr: "A1",
    titleFa: "خرید بلیت مترو در لندن",
    titleEn: "Buying a Underground Ticket",
    scenarioFa: "در گیشه بلیت ایستگاه متروی کینگز کراس لندن هستی. باید یک بلیت تک‌سفره برای مرکز شهر بگیری.",
    locationContextFa: "ایستگاه کینگز کراس لندن",
    xpReward: 65,
    timeLimitTotalSeconds: 60,
    minPassScore: 70,
    ghostRival: {
      name: "مریم احمدی",
      avatar: "🚇",
      city: "اصفهان",
      reactionTimeAvg: 1.4,
      targetScore: 860,
      wpm: 95,
      title: "مسافر دقیق مترو",
    },
    turns: [
      {
        turnNumber: 1,
        characterSpeaker: {
          name: "Station Officer",
          roleFa: "مسئول گیشه",
          text: "Hello! Where are you traveling to today?",
          avatar: "👮‍♂️",
        },
        idealResponse: {
          text: "Hello! I need a single ticket to central London, please.",
          audioText: "Hello! I need a single ticket to central London, please.",
          explanationFa: "بیان مقصد و نوع بلیت (single ticket یا one-way).",
        },
        keywords: [
          { id: "k-a1-3-1", phrase: "single ticket", phoneticOrHintFa: "/ˈsɪŋɡl ˈtɪkɪt/ (بلیت تک‌سفره)", weight: 30 },
          { id: "k-a1-3-2", phrase: "central London", phoneticOrHintFa: "/ˈsentrəl ˈlʌndən/ (مرکز لندن)", weight: 20 },
        ],
        fallbackOptions: [
          "Hello! I need a single ticket to central London, please.",
          "I go London now.",
          "Give paper train.",
        ],
        vocabUpgrades: [
          {
            learnerPhrase: "One ticket for go",
            nativeUpgrade: "A single ticket to central London",
            explanationFa: "در بریتانیا به بلیت یک‌طرفه 'single ticket' و در آمریکا 'one-way ticket' گفته می‌شود.",
            audioText: "A single ticket to central London, please.",
          },
        ],
        reactionWindowSeconds: 15,
      },
      {
        turnNumber: 2,
        characterSpeaker: {
          name: "Station Officer",
          roleFa: "مسئول گیشه",
          text: "Certainly. Do you have an Oyster card or are you paying with contactless?",
          avatar: "👮‍♂️",
        },
        idealResponse: {
          text: "I am paying with contactless card, please. How much is it?",
          audioText: "I am paying with contactless card, please. How much is it?",
          explanationFa: "پاسخ به شیوه پرداخت و سوال درباره هزینه با 'How much is it?'.",
        },
        keywords: [
          { id: "k-a1-3-3", phrase: "How much is it", phoneticOrHintFa: "/haʊ mʌtʃ ɪz ɪt/ (قیمتش چنده؟)", weight: 25 },
          { id: "k-a1-3-4", phrase: "contactless", phoneticOrHintFa: "/ˈkɑːntæktləs/ (کارت بدون تماس)", weight: 25 },
        ],
        fallbackOptions: [
          "I am paying with contactless card, please. How much is it?",
          "No Oyster money pay.",
          "Price what is?",
        ],
        vocabUpgrades: [
          {
            learnerPhrase: "What is the price?",
            nativeUpgrade: "How much does that come to? / How much is it?",
            explanationFa: "عبارت 'How much is it?' طبیعی‌ترین روش پرسیدن قیمت در گیشه است.",
            audioText: "How much is it, please?",
          },
        ],
        reactionWindowSeconds: 15,
      },
      {
        turnNumber: 3,
        characterSpeaker: {
          name: "Station Officer",
          roleFa: "مسئول گیشه",
          text: "That is three pounds eighty. Just tap your card right on the yellow reader. Have a safe journey!",
          avatar: "👮‍♂️",
        },
        idealResponse: {
          text: "Thank you so much for your help! Have a great day!",
          audioText: "Thank you so much for your help! Have a great day!",
          explanationFa: "تشکر مودبانه و آرزوی روز خوب.",
        },
        keywords: [
          { id: "k-a1-3-5", phrase: "Thank you so much", phoneticOrHintFa: "/θæŋk juː soʊ mʌtʃ/ (خیلی متشکرم)", weight: 25 },
          { id: "k-a1-3-6", phrase: "Have a great day", phoneticOrHintFa: "/hæv ə ɡreɪt deɪ/ (روز خوبی داشته باشین)", weight: 25 },
        ],
        fallbackOptions: [
          "Thank you so much for your help! Have a great day!",
          "Yes okay.",
          "Done thank.",
        ],
        vocabUpgrades: [
          {
            learnerPhrase: "Thanks officer",
            nativeUpgrade: "Thank you for your help, have a good one!",
            explanationFa: "اضافه کردن 'for your help' مکالمه شما را حرفه‌ای و روان نشان می‌دهد.",
            audioText: "Thank you so much for your help!",
          },
        ],
        reactionWindowSeconds: 15,
      },
    ],
  },
  {
    levelNumber: 4,
    cefr: "A1",
    titleFa: "آدرس پرسیدن ساده در خیابان",
    titleEn: "Asking Street Directions",
    scenarioFa: "در خیابان آکسفورد گم شده‌ای و دنبال نزدیک‌ترین موزه یا ایستگاه می‌گردی.",
    locationContextFa: "خیابان آکسفورد لندن",
    xpReward: 70,
    timeLimitTotalSeconds: 60,
    minPassScore: 70,
    ghostRival: {
      name: "پویا کریمی",
      avatar: "🗺️",
      city: "تبریز",
      reactionTimeAvg: 1.5,
      targetScore: 850,
      wpm: 90,
      title: "مسیریاب تیزبین",
    },
    turns: [
      {
        turnNumber: 1,
        characterSpeaker: {
          name: "Local Pedestrian",
          roleFa: "عابر پیاده",
          text: "Excuse me? Can I help you? You look a bit lost.",
          avatar: "🚶‍♂️",
        },
        idealResponse: {
          text: "Excuse me! Could you tell me where the British Museum is?",
          audioText: "Excuse me! Could you tell me where the British Museum is?",
          explanationFa: "شروع محترمانه با Excuse me و پرسش با Could you tell me where...",
        },
        keywords: [
          { id: "k-a1-4-1", phrase: "Excuse me", phoneticOrHintFa: "/ɪkˈskjuːz miː/ (ببخشید)", weight: 30 },
          { id: "k-a1-4-2", phrase: "where is", phoneticOrHintFa: "/wer ɪz/ (کجاست)", weight: 20 },
        ],
        fallbackOptions: [
          "Excuse me! Could you tell me where the British Museum is?",
          "Hey museum where?",
          "I lost tell me street.",
        ],
        vocabUpgrades: [
          {
            learnerPhrase: "Where is the museum?",
            nativeUpgrade: "Could you point me towards the museum? / Excuse me, where is...",
            explanationFa: "استفاده از 'Could you tell me' لحن شما را بسیار دوستانه و نرم می‌کند.",
            audioText: "Excuse me, could you tell me where the museum is?",
          },
        ],
        reactionWindowSeconds: 15,
      },
      {
        turnNumber: 2,
        characterSpeaker: {
          name: "Local Pedestrian",
          roleFa: "عابر پیاده",
          text: "Ah, yes! Just walk straight ahead for two blocks, then turn left at the corner.",
          avatar: "🚶‍♂️",
        },
        idealResponse: {
          text: "Straight ahead and then turn left, right? Is it far from here?",
          audioText: "Straight ahead and then turn left, right? Is it far from here?",
          explanationFa: "تایید مسیر با تکرار کلمات جهت و پرسیدن مسافت با Is it far?",
        },
        keywords: [
          { id: "k-a1-4-3", phrase: "straight ahead", phoneticOrHintFa: "/streɪt əˈhed/ (مستقیم رو به جلو)", weight: 25 },
          { id: "k-a1-4-4", phrase: "Is it far", phoneticOrHintFa: "/ɪz ɪt fɑːr/ (آیا دوره؟)", weight: 25 },
        ],
        fallbackOptions: [
          "Straight ahead and then turn left, right? Is it far from here?",
          "Left right straight far?",
          "I walk long time?",
        ],
        vocabUpgrades: [
          {
            learnerPhrase: "Is it many minutes?",
            nativeUpgrade: "Is it far from here? / Is it within walking distance?",
            explanationFa: "اصطلاح 'Is it far from here?' پاسخ شفاف چند دقیقه‌ای از عابر می‌گیرد.",
            audioText: "Is it far from here?",
          },
        ],
        reactionWindowSeconds: 15,
      },
      {
        turnNumber: 3,
        characterSpeaker: {
          name: "Local Pedestrian",
          roleFa: "عابر پیاده",
          text: "No, not at all! It's only a five-minute walk. You can't miss it!",
          avatar: "🚶‍♂️",
        },
        idealResponse: {
          text: "Perfect! Thank you so much for your directions. Have a lovely day!",
          audioText: "Perfect! Thank you so much for your directions. Have a lovely day!",
          explanationFa: "پایان دادن به گفتگو با انرژی مثبت و تشکر برای راهنمایی.",
        },
        keywords: [
          { id: "k-a1-4-5", phrase: "Perfect", phoneticOrHintFa: "/ˈpɜːrfɪkt/ (عالیه)", weight: 25 },
          { id: "k-a1-4-6", phrase: "for your directions", phoneticOrHintFa: "/fɔːr jɔːr dəˈrekʃnz/ (برای راهنمایی‌تون)", weight: 25 },
        ],
        fallbackOptions: [
          "Perfect! Thank you so much for your directions. Have a lovely day!",
          "Yes I walk now.",
          "Bye friend.",
        ],
        vocabUpgrades: [
          {
            learnerPhrase: "Thanks for information",
            nativeUpgrade: "Thank you for the directions / Appreciate the help!",
            explanationFa: "برای مسیر و آدرس از واژه 'directions' به جای 'information' استفاده می‌شود.",
            audioText: "Thank you so much for the directions!",
          },
        ],
        reactionWindowSeconds: 15,
      },
    ],
  },
  {
    levelNumber: 5,
    cefr: "A1",
    titleFa: "سفارش غذا در رستوران برگر",
    titleEn: "Ordering Lunch at a Diner",
    scenarioFa: "در یک رستوران دنج برای ناهار میز گرفته‌ای و گارسون برای ثبت سفارش غذا آمده است.",
    locationContextFa: "رستوران سنتی شیکاگو",
    xpReward: 70,
    timeLimitTotalSeconds: 60,
    minPassScore: 70,
    ghostRival: {
      name: "نگار فراهانی",
      avatar: "🍔",
      city: "کرج",
      reactionTimeAvg: 1.5,
      targetScore: 830,
      wpm: 89,
      title: "سفارش‌دهنده با اعتمادبه‌نفس",
    },
    turns: [
      {
        turnNumber: 1,
        characterSpeaker: {
          name: "Waiter Tom",
          roleFa: "گارسون",
          text: "Hi! Are you ready to order, or do you need a few more minutes with the menu?",
          avatar: "🤵",
        },
        idealResponse: {
          text: "I am ready, thank you! I would like the classic cheeseburger with fries.",
          audioText: "I am ready, thank you! I would like the classic cheeseburger with fries.",
          explanationFa: "اعلام آمادگی برای سفارش با ساختار مؤدبانه 'I would like...'.",
        },
        keywords: [
          { id: "k-a1-5-1", phrase: "I would like", phoneticOrHintFa: "/aɪ wʊd laɪk/ (میل دارم / می‌خوام)", weight: 30 },
          { id: "k-a1-5-2", phrase: "with fries", phoneticOrHintFa: "/wɪð fraɪz/ (با سیب‌زمینی سرخ‌کرده)", weight: 20 },
        ],
        fallbackOptions: [
          "I am ready, thank you! I would like the classic cheeseburger with fries.",
          "Give me burger bread.",
          "I want eat food now.",
        ],
        vocabUpgrades: [
          {
            learnerPhrase: "I want burger",
            nativeUpgrade: "I'd like the cheeseburger / I'll go with the cheeseburger",
            explanationFa: "استفاده از 'I would like' یا اختصار 'I'd like' استاندارد طلایی ادب در رستوران است.",
            audioText: "I'd like the classic cheeseburger, please.",
          },
        ],
        reactionWindowSeconds: 15,
      },
      {
        turnNumber: 2,
        characterSpeaker: {
          name: "Waiter Tom",
          roleFa: "گارسون",
          text: "Great choice! And what would you like to drink with that?",
          avatar: "🤵",
        },
        idealResponse: {
          text: "Just a bottle of mineral water with lemon, please.",
          audioText: "Just a bottle of mineral water with lemon, please.",
          explanationFa: "سفارش نوشیدنی با ذکر دقیق بطری آب معدنی و لیمو.",
        },
        keywords: [
          { id: "k-a1-5-3", phrase: "mineral water", phoneticOrHintFa: "/ˈmɪnərəl ˈwɔːtər/ (آب معدنی)", weight: 25 },
          { id: "k-a1-5-4", phrase: "with lemon", phoneticOrHintFa: "/wɪð ˈlemən/ (با لیمو)", weight: 25 },
        ],
        fallbackOptions: [
          "Just a bottle of mineral water with lemon, please.",
          "Water glass lemon cold.",
          "Drink water simple.",
        ],
        vocabUpgrades: [
          {
            learnerPhrase: "Give me water",
            nativeUpgrade: "Just water for me, please / A bottle of still water",
            explanationFa: "عبارت 'Just water for me' خیلی طبیعی و سبک بیان بومی‌هاست.",
            audioText: "Just a bottle of mineral water, please.",
          },
        ],
        reactionWindowSeconds: 15,
      },
      {
        turnNumber: 3,
        characterSpeaker: {
          name: "Waiter Tom",
          roleFa: "گارسون",
          text: "Coming right up! It should be ready in about ten minutes.",
          avatar: "🤵",
        },
        idealResponse: {
          text: "Sounds great! Thank you very much, Tom!",
          audioText: "Sounds great! Thank you very much, Tom!",
          explanationFa: "پاسخ مثبت و تایید با اصطلاح Sounds great.",
        },
        keywords: [
          { id: "k-a1-5-5", phrase: "Sounds great", phoneticOrHintFa: "/saʊndz ɡreɪt/ (عالی به نظر می‌رسه)", weight: 25 },
          { id: "k-a1-5-6", phrase: "Thank you very much", phoneticOrHintFa: "/θæŋk juː ˈveri mʌtʃ/ (خیلی متشکرم)", weight: 25 },
        ],
        fallbackOptions: [
          "Sounds great! Thank you very much, Tom!",
          "Yes I wait ten minute.",
          "Okay good.",
        ],
        vocabUpgrades: [
          {
            learnerPhrase: "I agree ten minutes",
            nativeUpgrade: "Sounds wonderful / Perfect, thank you!",
            explanationFa: "اصطلاح 'Sounds great' انرژی بالایی به مکالمه می‌دهد.",
            audioText: "Sounds great, thank you!",
          },
        ],
        reactionWindowSeconds: 15,
      },
    ],
  },
  {
    levelNumber: 6,
    cefr: "A1",
    titleFa: "پرسیدن ساعت و زمان حرکت اتوبوس",
    titleEn: "Asking Time and Bus Schedule",
    scenarioFa: "در ایستگاه اتوبوس ایستاده‌ای و ساعت مچی نداری. از مسافر بغل‌دستی ساعت و زمان رسیدن اتوبوس بعدی را بپرس.",
    locationContextFa: "ایستگاه اتوبوس خط مرکزی",
    xpReward: 75,
    timeLimitTotalSeconds: 60,
    minPassScore: 70,
    ghostRival: {
      name: "سینا کاظمی",
      avatar: "⏱️",
      city: "رشت",
      reactionTimeAvg: 1.4,
      targetScore: 860,
      wpm: 92,
      title: "دقیق مثل ساعت",
    },
    turns: [
      {
        turnNumber: 1,
        characterSpeaker: {
          name: "Commuter Lisa",
          roleFa: "مسافر در ایستگاه",
          text: "Hi! It's quite cold out here today, isn't it?",
          avatar: "🧣",
        },
        idealResponse: {
          text: "Yes, it really is! Excuse me, do you have the time?",
          audioText: "Yes, it really is! Excuse me, do you have the time?",
          explanationFa: "همراهی با صحبت درباره هوا و سپس پرسیدن زمان با 'Do you have the time?'.",
        },
        keywords: [
          { id: "k-a1-6-1", phrase: "Excuse me", phoneticOrHintFa: "/ɪkˈskjuːz miː/ (ببخشید)", weight: 25 },
          { id: "k-a1-6-2", phrase: "do you have the time", phoneticOrHintFa: "/duː juː hæv ðə taɪm/ (ساعت چنده؟)", weight: 30 },
        ],
        fallbackOptions: [
          "Yes, it really is! Excuse me, do you have the time?",
          "Cold yes what time?",
          "Watch tell me clock.",
        ],
        vocabUpgrades: [
          {
            learnerPhrase: "What is clock now?",
            nativeUpgrade: "Do you happen to have the time? / Do you have the time?",
            explanationFa: "توجه کنید 'Do you have the time' یعنی ساعت چنده، اما 'Do you have time' یعنی وقت خالی داری؟",
            audioText: "Excuse me, do you have the time?",
          },
        ],
        reactionWindowSeconds: 15,
      },
      {
        turnNumber: 2,
        characterSpeaker: {
          name: "Commuter Lisa",
          roleFa: "مسافر در ایستگاه",
          text: "Sure! It is exactly quarter past four (4:15). Are you waiting for bus number 12?",
          avatar: "🧣",
        },
        idealResponse: {
          text: "Yes, I am. Do you know what time the next bus arrives?",
          audioText: "Yes, I am. Do you know what time the next bus arrives?",
          explanationFa: "پرسیدن زمان رسیدن اتوبوس با فعل arrives.",
        },
        keywords: [
          { id: "k-a1-6-3", phrase: "what time", phoneticOrHintFa: "/wʌt taɪm/ (چه ساعتی)", weight: 25 },
          { id: "k-a1-6-4", phrase: "the next bus", phoneticOrHintFa: "/ðə nekst bʌs/ (اتوبوس بعدی)", weight: 25 },
        ],
        fallbackOptions: [
          "Yes, I am. Do you know what time the next bus arrives?",
          "Yes bus number 12 when come?",
          "Bus 12 time what?",
        ],
        vocabUpgrades: [
          {
            learnerPhrase: "When bus come?",
            nativeUpgrade: "When is the next bus due? / What time does the next bus arrive?",
            explanationFa: "استفاده از 'due' یا 'arrive' برای رسیدن وسایل نقلیه بسیار طبیعی است.",
            audioText: "What time does the next bus arrive?",
          },
        ],
        reactionWindowSeconds: 15,
      },
      {
        turnNumber: 3,
        characterSpeaker: {
          name: "Commuter Lisa",
          roleFa: "مسافر در ایستگاه",
          text: "Look, there it comes right now around the corner! Right on time!",
          avatar: "🧣",
        },
        idealResponse: {
          text: "That was quick! Thank you so much for your help!",
          audioText: "That was quick! Thank you so much for your help!",
          explanationFa: "ابراز خوشحالی و تشکر صمیمانه قبل از سوار شدن.",
        },
        keywords: [
          { id: "k-a1-6-5", phrase: "That was quick", phoneticOrHintFa: "/ðæt wʌz kwɪk/ (چه سریع رسید!)", weight: 25 },
          { id: "k-a1-6-6", phrase: "Thank you so much", phoneticOrHintFa: "/θæŋk juː soʊ mʌtʃ/ (خیلی ممنون)", weight: 25 },
        ],
        fallbackOptions: [
          "That was quick! Thank you so much for your help!",
          "Yes bus here bye.",
          "I run inside bus.",
        ],
        vocabUpgrades: [
          {
            learnerPhrase: "Very fast came",
            nativeUpgrade: "That was fast / Perfect timing!",
            explanationFa: "اصطلاح 'Perfect timing!' بهترین بازخورد هنگام رسیدن به‌موقع چیزی است.",
            audioText: "That was quick! Thank you for your help!",
          },
        ],
        reactionWindowSeconds: 15,
      },
    ],
  },
  {
    levelNumber: 7,
    cefr: "A1",
    titleFa: "پرسش و پاسخ در پذیرش هتل",
    titleEn: "Simple Hotel Reception Questions",
    scenarioFa: "در لابی هتل رسیده‌ای و می‌خواهی رمز وای‌فای و ساعت صبحانه را از پذیرش بپرسی.",
    locationContextFa: "لابی هتل بین‌المللی",
    xpReward: 75,
    timeLimitTotalSeconds: 60,
    minPassScore: 70,
    ghostRival: {
      name: "ساناز نوری",
      avatar: "🏨",
      city: "مشهد",
      reactionTimeAvg: 1.5,
      targetScore: 845,
      wpm: 90,
      title: "مهمان خوش‌برخورد",
    },
    turns: [
      {
        turnNumber: 1,
        characterSpeaker: {
          name: "Receptionist Daniel",
          roleFa: "مسئول پذیرش",
          text: "Good evening! Welcome to the Grand Central. How may I assist you tonight?",
          avatar: "🛎️",
        },
        idealResponse: {
          text: "Good evening! I have a question about the Wi-Fi password, please.",
          audioText: "Good evening! I have a question about the Wi-Fi password, please.",
          explanationFa: "شروع مؤدبانه و طرح سوال در مورد رمز اینترنت.",
        },
        keywords: [
          { id: "k-a1-7-1", phrase: "Good evening", phoneticOrHintFa: "/ɡʊd ˈiːvnɪŋ/ (عصر بخیر)", weight: 25 },
          { id: "k-a1-7-2", phrase: "Wi-Fi password", phoneticOrHintFa: "/ˈwaɪ faɪ ˈpæswɜːrd/ (رمز وای‌فای)", weight: 30 },
        ],
        fallbackOptions: [
          "Good evening! I have a question about the Wi-Fi password, please.",
          "Give me internet code.",
          "Wi-Fi what is room?",
        ],
        vocabUpgrades: [
          {
            learnerPhrase: "What is internet code?",
            nativeUpgrade: "Could you tell me the Wi-Fi password, please?",
            explanationFa: "کلمه 'password' دقیق و استاندارد است و گفتن 'Could you tell me...' احترام‌آمیز است.",
            audioText: "Could you tell me the Wi-Fi password, please?",
          },
        ],
        reactionWindowSeconds: 15,
      },
      {
        turnNumber: 2,
        characterSpeaker: {
          name: "Receptionist Daniel",
          roleFa: "مسئول پذیرش",
          text: "The Wi-Fi name is GrandGuest and the password is on your key card envelope. Anything else?",
          avatar: "🛎️",
        },
        idealResponse: {
          text: "Yes, what time is breakfast served in the morning?",
          audioText: "Yes, what time is breakfast served in the morning?",
          explanationFa: "پرسیدن ساعت سرو صبحانه با عبارت 'what time is breakfast served?'.",
        },
        keywords: [
          { id: "k-a1-7-3", phrase: "what time", phoneticOrHintFa: "/wʌt taɪm/ (چه ساعتی)", weight: 25 },
          { id: "k-a1-7-4", phrase: "breakfast served", phoneticOrHintFa: "/ˈbrekfəst sɜːrvd/ (سرو صبحانه)", weight: 25 },
        ],
        fallbackOptions: [
          "Yes, what time is breakfast served in the morning?",
          "When eat morning food?",
          "Breakfast time clock?",
        ],
        vocabUpgrades: [
          {
            learnerPhrase: "When is breakfast time?",
            nativeUpgrade: "What time is breakfast served?",
            explanationFa: "استفاده از 'served' در هتل‌ها و رستوران‌ها بسیار مرسوم و حرفه‌ای است.",
            audioText: "What time is breakfast served in the morning?",
          },
        ],
        reactionWindowSeconds: 15,
      },
      {
        turnNumber: 3,
        characterSpeaker: {
          name: "Receptionist Daniel",
          roleFa: "مسئول پذیرش",
          text: "Breakfast is from 7:00 AM to 10:30 AM on the second floor. Enjoy your stay!",
          avatar: "🛎️",
        },
        idealResponse: {
          text: "That is very helpful. Thank you Daniel, have a good night!",
          audioText: "That is very helpful. Thank you Daniel, have a good night!",
          explanationFa: "تشکر با عبارت That is very helpful و شب‌بخیر گفتن.",
        },
        keywords: [
          { id: "k-a1-7-5", phrase: "very helpful", phoneticOrHintFa: "/ˈveri ˈhelpfl/ (بسیار کارساز و مفید)", weight: 25 },
          { id: "k-a1-7-6", phrase: "have a good night", phoneticOrHintFa: "/hæv ə ɡʊd naɪt/ (شب خوبی داشته باشید)", weight: 25 },
        ],
        fallbackOptions: [
          "That is very helpful. Thank you Daniel, have a good night!",
          "Yes I eat morning floor two.",
          "Good night bye.",
        ],
        vocabUpgrades: [
          {
            learnerPhrase: "Thank you for speech",
            nativeUpgrade: "That is very helpful / Thanks for the info, have a good night!",
            explanationFa: "عبارت 'That is very helpful' نشان‌دهنده قدردانی هوشمندانه از راهنمایی طرف مقابل است.",
            audioText: "That is very helpful, thank you!",
          },
        ],
        reactionWindowSeconds: 15,
      },
    ],
  },
  {
    levelNumber: 8,
    cefr: "A1",
    titleFa: "خرید لباس و پرسیدن سایز",
    titleEn: "Shopping for Clothes & Sizes",
    scenarioFa: "در یک فروشگاه لباس، یک پیراهن یا تیشرت را پسندیده‌ای و می‌خواهی سایز دیگری را امتحان کنی.",
    locationContextFa: "فروشگاه لباس و پوشاک",
    xpReward: 80,
    timeLimitTotalSeconds: 60,
    minPassScore: 70,
    ghostRival: {
      name: "دانیال مرادی",
      avatar: "👕",
      city: "ارومیه",
      reactionTimeAvg: 1.5,
      targetScore: 840,
      wpm: 88,
      title: "خریدار خوش‌سلیقه",
    },
    turns: [
      {
        turnNumber: 1,
        characterSpeaker: {
          name: "Shop Assistant Mia",
          roleFa: "فروشنده",
          text: "Hello! Can I help you find anything in particular today?",
          avatar: "🛍️",
        },
        idealResponse: {
          text: "Hello! Yes please, do you have this blue jacket in medium?",
          audioText: "Hello! Yes please, do you have this blue jacket in medium?",
          explanationFa: "پرسیدن درباره موجود بودن سایز مدیوم با ساختار 'do you have this in medium?'.",
        },
        keywords: [
          { id: "k-a1-8-1", phrase: "do you have", phoneticOrHintFa: "/duː juː hæv/ (آیا دارید)", weight: 25 },
          { id: "k-a1-8-2", phrase: "in medium", phoneticOrHintFa: "/ɪn ˈmiːdiəm/ (در سایز مدیوم)", weight: 30 },
        ],
        fallbackOptions: [
          "Hello! Yes please, do you have this blue jacket in medium?",
          "Jacket medium have you?",
          "Give me size middle.",
        ],
        vocabUpgrades: [
          {
            learnerPhrase: "Do you have size M?",
            nativeUpgrade: "Do you have this in a medium?",
            explanationFa: "نیتیوها معمولاً حرف M را تلفظ نمی‌کنند و می‌گویند 'in a medium' یا 'in a large'.",
            audioText: "Do you have this in a medium?",
          },
        ],
        reactionWindowSeconds: 15,
      },
      {
        turnNumber: 2,
        characterSpeaker: {
          name: "Shop Assistant Mia",
          roleFa: "فروشنده",
          text: "Let me check the rack... Yes, here is a medium! Would you like to try it on?",
          avatar: "🛍️",
        },
        idealResponse: {
          text: "Yes, please! Where are the fitting rooms located?",
          audioText: "Yes, please! Where are the fitting rooms located?",
          explanationFa: "پرسیدن مکان اتاق پرو با اصطلاح دقیق fitting rooms.",
        },
        keywords: [
          { id: "k-a1-8-3", phrase: "try it on", phoneticOrHintFa: "/traɪ ɪt ɑːn/ (پرو کردن / پوشیدن)", weight: 25 },
          { id: "k-a1-8-4", phrase: "fitting rooms", phoneticOrHintFa: "/ˈfɪtɪŋ ruːmz/ (اتاق‌های پرو)", weight: 25 },
        ],
        fallbackOptions: [
          "Yes, please! Where are the fitting rooms located?",
          "Where change clothes room?",
          "Room test where?",
        ],
        vocabUpgrades: [
          {
            learnerPhrase: "Where is dress room?",
            nativeUpgrade: "Where are the fitting rooms? / Where's the dressing room?",
            explanationFa: "اتاق پرو در زبان انگلیسی 'fitting room' یا 'dressing room' نامیده می‌شود.",
            audioText: "Where are the fitting rooms located?",
          },
        ],
        reactionWindowSeconds: 15,
      },
      {
        turnNumber: 3,
        characterSpeaker: {
          name: "Shop Assistant Mia",
          roleFa: "فروشنده",
          text: "The fitting rooms are right around the corner on your left. Let me know if you need another size!",
          avatar: "🛍️",
        },
        idealResponse: {
          text: "Thank you so much! I appreciate your help.",
          audioText: "Thank you so much! I appreciate your help.",
          explanationFa: "تشکر عالی با عبارت قدردانی I appreciate your help.",
        },
        keywords: [
          { id: "k-a1-8-5", phrase: "appreciate", phoneticOrHintFa: "/əˈpriːʃieɪt/ (قدردانی می‌کنم)", weight: 30 },
          { id: "k-a1-8-6", phrase: "Thank you", phoneticOrHintFa: "/θæŋk juː/ (متشکرم)", weight: 20 },
        ],
        fallbackOptions: [
          "Thank you so much! I appreciate your help.",
          "Yes I go left.",
          "Thanks Mia.",
        ],
        vocabUpgrades: [
          {
            learnerPhrase: "Thanks very much for all",
            nativeUpgrade: "I appreciate your help / Much appreciated!",
            explanationFa: "عبارت 'I appreciate your help' شما را فردی باکلاس و مسلط به زبان انگلیسی نشان می‌دهد.",
            audioText: "I appreciate your help!",
          },
        ],
        reactionWindowSeconds: 15,
      },
    ],
  },
  {
    levelNumber: 9,
    cefr: "A1",
    titleFa: "گرفتن تاکسی و دادن آدرس مقصد",
    titleEn: "Taking a Cab to Airport",
    scenarioFa: "سوار تاکسی شده‌ای و باید آدرس فرودگاه و ترمینال پرواز را به راننده بگویی و زمان تقریبی را بپرسی.",
    locationContextFa: "تاکسی شهری فرودگاه",
    xpReward: 85,
    timeLimitTotalSeconds: 60,
    minPassScore: 70,
    ghostRival: {
      name: "فرهاد سلیمی",
      avatar: "🚕",
      city: "قم",
      reactionTimeAvg: 1.4,
      targetScore: 855,
      wpm: 92,
      title: "مسافر دقیق تاکسی",
    },
    turns: [
      {
        turnNumber: 1,
        characterSpeaker: {
          name: "Taxi Driver Dave",
          roleFa: "راننده تاکسی",
          text: "Afternoon! Hop in. Where are you heading today?",
          avatar: "🚖",
        },
        idealResponse: {
          text: "Hi Dave! To JFK Airport, Terminal 4, please.",
          audioText: "Hi Dave! To JFK Airport, Terminal 4, please.",
          explanationFa: "سلام و اعلام دقیق نام فرودگاه و شماره ترمینال.",
        },
        keywords: [
          { id: "k-a1-9-1", phrase: "To JFK Airport", phoneticOrHintFa: "/tuː dʒeɪ ef keɪ ˈerpɔːrt/ (به فرودگاه جی‌اف‌کی)", weight: 30 },
          { id: "k-a1-9-2", phrase: "Terminal", phoneticOrHintFa: "/ˈtɜːrmɪnl/ (ترمینال)", weight: 20 },
        ],
        fallbackOptions: [
          "Hi Dave! To JFK Airport, Terminal 4, please.",
          "Go airport number 4 fast.",
          "Airplane building drive.",
        ],
        vocabUpgrades: [
          {
            learnerPhrase: "Drive to airplane station",
            nativeUpgrade: "To the airport, please / JFK Terminal 4, please",
            explanationFa: "فرودگاه همیشه 'airport' است و ترمینال پرواز به صورت 'Terminal + عدد' ادا می‌شود.",
            audioText: "To JFK Airport, Terminal 4 please.",
          },
        ],
        reactionWindowSeconds: 15,
      },
      {
        turnNumber: 2,
        characterSpeaker: {
          name: "Taxi Driver Dave",
          roleFa: "راننده تاکسی",
          text: "Got it! Traffic looks pretty light on the highway today.",
          avatar: "🚖",
        },
        idealResponse: {
          text: "That's great! How long will it take to get there?",
          audioText: "That's great! How long will it take to get there?",
          explanationFa: "پرسیدن مدت زمان رسیدن با ساختار کلیدی 'How long will it take?'.",
        },
        keywords: [
          { id: "k-a1-9-3", phrase: "How long", phoneticOrHintFa: "/haʊ lɔːŋ/ (چقدر طول می‌کشد)", weight: 30 },
          { id: "k-a1-9-4", phrase: "to get there", phoneticOrHintFa: "/tuː ɡet ðer/ (رسیدن به آنجا)", weight: 20 },
        ],
        fallbackOptions: [
          "That's great! How long will it take to get there?",
          "How many time go there?",
          "When we reach airport?",
        ],
        vocabUpgrades: [
          {
            learnerPhrase: "How many minutes driving?",
            nativeUpgrade: "How long will it take to get there? / What's our ETA?",
            explanationFa: "عبارت 'How long will it take?' اساسی‌ترین فرمول انگلیسی برای پرسیدن طول مدت زمان است.",
            audioText: "How long will it take to get there?",
          },
        ],
        reactionWindowSeconds: 15,
      },
      {
        turnNumber: 3,
        characterSpeaker: {
          name: "Taxi Driver Dave",
          roleFa: "راننده تاکسی",
          text: "About twenty-five minutes tops. Sit back and enjoy the ride!",
          avatar: "🚖",
        },
        idealResponse: {
          text: "Sounds wonderful. Thank you, I really appreciate it!",
          audioText: "Sounds wonderful. Thank you, I really appreciate it!",
          explanationFa: "پاسخ ریلکس و قدردانی از راننده خوش‌برخورد.",
        },
        keywords: [
          { id: "k-a1-9-5", phrase: "Sounds wonderful", phoneticOrHintFa: "/saʊndz ˈwʌndərfl/ (فوق‌العاده به نظر می‌رسه)", weight: 25 },
          { id: "k-a1-9-6", phrase: "appreciate it", phoneticOrHintFa: "/əˈpriːʃieɪt ɪt/ (ممنونم ازت)", weight: 25 },
        ],
        fallbackOptions: [
          "Sounds wonderful. Thank you, I really appreciate it!",
          "Yes I sit back.",
          "Okay 25 minutes good.",
        ],
        vocabUpgrades: [
          {
            learnerPhrase: "I am happy with 25",
            nativeUpgrade: "Sounds wonderful / Sounds like a plan!",
            explanationFa: "استفاده از 'Sounds wonderful' احساس رضایت و آرامش را به خوبی منتقل می‌کند.",
            audioText: "Sounds wonderful, thank you!",
          },
        ],
        reactionWindowSeconds: 15,
      },
    ],
  },
  {
    levelNumber: 10,
    cefr: "A1",
    titleFa: "مرحله پایانی A1: خداحافظی و تحویل کلید اتاق هتل",
    titleEn: "A1 Boss Level: Hotel Checkout & Farewell",
    scenarioFa: "پایان سفر است! در لابی ایستاده‌ای تا اتاق را تحویل دهی، رسید بگیری و خداحافظی رسمی کنی.",
    locationContextFa: "میز تسویه حساب هتل",
    xpReward: 100,
    timeLimitTotalSeconds: 55,
    minPassScore: 75,
    ghostRival: {
      name: "کیمیا رحمانی",
      avatar: "👑",
      city: "تهران",
      reactionTimeAvg: 1.2,
      targetScore: 920,
      wpm: 98,
      title: "استاد طلایی مکالمه A1",
    },
    turns: [
      {
        turnNumber: 1,
        characterSpeaker: {
          name: "Manager Helen",
          roleFa: "مدیر پذیرش",
          text: "Good morning! Are you checking out of room 402 today?",
          avatar: "👩‍💼",
        },
        idealResponse: {
          text: "Good morning Helen! Yes, I am checking out. Here are my room keys.",
          audioText: "Good morning Helen! Yes, I am checking out. Here are my room keys.",
          explanationFa: "اعلام خروج با 'I am checking out' و تحویل کلید با 'Here are my room keys'.",
        },
        keywords: [
          { id: "k-a1-10-1", phrase: "checking out", phoneticOrHintFa: "/ˈtʃekɪŋ aʊt/ (تحویل اتاق و خروج)", weight: 30 },
          { id: "k-a1-10-2", phrase: "room keys", phoneticOrHintFa: "/ruːm kiːz/ (کلیدهای اتاق)", weight: 20 },
        ],
        fallbackOptions: [
          "Good morning Helen! Yes, I am checking out. Here are my room keys.",
          "I leave hotel now take keys.",
          "Room finished bye.",
        ],
        vocabUpgrades: [
          {
            learnerPhrase: "I want to leave room",
            nativeUpgrade: "I'd like to check out / I'm checking out of room 402",
            explanationFa: "اصطلاح استاندارد تسویه هتل 'check out' است و نه 'leave'.",
            audioText: "Good morning, I'm checking out of room 402.",
          },
        ],
        reactionWindowSeconds: 14,
      },
      {
        turnNumber: 2,
        characterSpeaker: {
          name: "Manager Helen",
          roleFa: "مدیر پذیرش",
          text: "Thank you! Did you enjoy your stay with us? Was everything comfortable?",
          avatar: "👩‍💼",
        },
        idealResponse: {
          text: "Yes, absolutely! The room was very clean and the staff was extremely friendly.",
          audioText: "Yes, absolutely! The room was very clean and the staff was extremely friendly.",
          explanationFa: "تایید پرانرژی با Absolutely و تمجید از تمیزی و برخورد پرسنل هتل.",
        },
        keywords: [
          { id: "k-a1-10-3", phrase: "absolutely", phoneticOrHintFa: "/ˌæbsəˈluːtli/ (کاملاً / صددرصد)", weight: 25 },
          { id: "k-a1-10-4", phrase: "extremely friendly", phoneticOrHintFa: "/ɪkˈstriːmli ˈfrendli/ (بسیار خوش‌برخورد)", weight: 25 },
        ],
        fallbackOptions: [
          "Yes, absolutely! The room was very clean and the staff was extremely friendly.",
          "Yes room good people good.",
          "I sleep well thanks.",
        ],
        vocabUpgrades: [
          {
            learnerPhrase: "Hotel people very nice",
            nativeUpgrade: "The staff was wonderfully welcoming and friendly",
            explanationFa: "کلمه 'staff' برای کارکنان هتل و صفت 'welcoming' بیان طبیعی‌تر انگلیسی است.",
            audioText: "The room was lovely and the staff was very friendly.",
          },
        ],
        reactionWindowSeconds: 14,
      },
      {
        turnNumber: 3,
        characterSpeaker: {
          name: "Manager Helen",
          roleFa: "مدیر پذیرش",
          text: "We are thrilled to hear that! Here is your printed receipt. We hope to see you again soon!",
          avatar: "👩‍💼",
        },
        idealResponse: {
          text: "Thank you for everything, Helen. Have a wonderful week ahead!",
          audioText: "Thank you for everything, Helen. Have a wonderful week ahead!",
          explanationFa: "خداحافظی سطح بالا با اصطلاح Have a wonderful week ahead.",
        },
        keywords: [
          { id: "k-a1-10-5", phrase: "Thank you for everything", phoneticOrHintFa: "/θæŋk juː fɔːr ˈevriθɪŋ/ (ممنون برای همه‌چیز)", weight: 25 },
          { id: "k-a1-10-6", phrase: "week ahead", phoneticOrHintFa: "/wiːk əˈhed/ (هفته پیش‌رو)", weight: 25 },
        ],
        fallbackOptions: [
          "Thank you for everything, Helen. Have a wonderful week ahead!",
          "Receipt taken goodbye.",
          "See you another year.",
        ],
        vocabUpgrades: [
          {
            learnerPhrase: "Bye bye Helen",
            nativeUpgrade: "Thank you for everything / Have a wonderful week ahead!",
            explanationFa: "آرزوی 'Have a wonderful week ahead' نشانه تسلط کلامی و شخصیت کاریزماتیک شماست.",
            audioText: "Thank you for everything, have a wonderful week ahead!",
          },
        ],
        reactionWindowSeconds: 14,
      },
    ],
  },
];

// Helper to generate full curriculum across A2, B1, B2, C1, and C2
// Each with 10 high-stakes contextual missions
function generateTierMissions(
  cefr: CefrLevel,
  titles: Array<{
    titleFa: string;
    titleEn: string;
    scenarioFa: string;
    locationContextFa: string;
    turns: Array<{
      speakerName: string;
      roleFa: string;
      speakerAvatar: string;
      charPrompt: string;
      ideal: string;
      keywords: Array<{ phrase: string; hintFa: string; weight: number }>;
      vocabUpgrade: { learner: string; native: string; noteFa: string };
    }>;
  }>
): SpeakingMission[] {
  const GHOST_NAMES = [
    { name: "آیدا کیانی", city: "شیراز", avatar: "🥈" },
    { name: "بردیا فرهمند", city: "تهران", avatar: "🥉" },
    { name: "نیلوفر شمس", city: "اصفهان", avatar: "🎖️" },
    { name: "شایان رستمی", city: "تبریز", avatar: "🚀" },
    { name: "یاسمین صبور", city: "مشهد", avatar: "⭐" },
    { name: "مهراد انصاری", city: "کرج", avatar: "⚡" },
    { name: "پارسا رفیعی", city: "رشت", avatar: "🏆" },
    { name: "غزاله نادری", city: "یزد", avatar: "💎" },
    { name: "سروش معتمد", city: "اهواز", avatar: "🔥" },
    { name: "روژان پاکزاد", city: "تهران", avatar: "👑" },
  ];

  return titles.map((t, idx) => {
    const levelNum = idx + 1;
    const ghost = GHOST_NAMES[idx] || GHOST_NAMES[0];
    const baseWpm = cefr === "A2" ? 100 : cefr === "B1" ? 115 : cefr === "B2" ? 130 : cefr === "C1" ? 145 : 160;

    return {
      levelNumber: levelNum,
      cefr,
      titleFa: t.titleFa,
      titleEn: t.titleEn,
      scenarioFa: t.scenarioFa,
      locationContextFa: t.locationContextFa,
      xpReward: (cefr === "A2" ? 70 : cefr === "B1" ? 85 : cefr === "B2" ? 100 : cefr === "C1" ? 120 : 150) + levelNum * 5,
      timeLimitTotalSeconds: 60,
      minPassScore: 70,
      ghostRival: {
        name: ghost.name,
        avatar: ghost.avatar,
        city: ghost.city,
        reactionTimeAvg: Number((1.5 - levelNum * 0.04).toFixed(1)),
        targetScore: 800 + levelNum * 15,
        wpm: baseWpm + levelNum * 2,
        title: `شبح رقیب سطح ${cefr}`,
      },
      turns: t.turns.map((turn, tIdx) => ({
        turnNumber: tIdx + 1,
        characterSpeaker: {
          name: turn.speakerName,
          roleFa: turn.roleFa,
          text: turn.charPrompt,
          avatar: turn.speakerAvatar,
        },
        idealResponse: {
          text: turn.ideal,
          audioText: turn.ideal,
          explanationFa: `نکته هدف: کاربرد اصطلاحات طبیعی و روانی کلام در سطح ${cefr}.`,
        },
        keywords: turn.keywords.map((k, kIdx) => ({
          id: `k-${cefr.toLowerCase()}-${levelNum}-${tIdx + 1}-${kIdx + 1}`,
          phrase: k.phrase,
          phoneticOrHintFa: k.hintFa,
          weight: k.weight,
        })),
        fallbackOptions: [
          turn.ideal,
          "I think this is an interesting situation but I need more time.",
          "Sorry, could you repeat that please?",
        ],
        vocabUpgrades: [
          {
            learnerPhrase: turn.vocabUpgrade.learner,
            nativeUpgrade: turn.vocabUpgrade.native,
            explanationFa: turn.vocabUpgrade.noteFa,
            audioText: turn.vocabUpgrade.native,
          },
        ],
        reactionWindowSeconds: 15,
      })),
    };
  });
}

// ---------------------------------------------------------
// A2 CURRICULUM DEFINITIONS
// ---------------------------------------------------------
export const A2_SPEAKING_MISSIONS = generateTierMissions("A2", [
  {
    titleFa: "چک‌این هتل و درخواست اتاق آرام",
    titleEn: "Hotel Check-in with Special Request",
    scenarioFa: "رسیده‌ای به هتل و می‌خواهی اتاقی با پنجره رو به حیاط و دور از آسانسور تحویل بگیری.",
    locationContextFa: "پذیرش هتل هیلتون",
    turns: [
      {
        speakerName: "Clerk",
        roleFa: "مسئول پذیرش",
        speakerAvatar: "🛎️",
        charPrompt: "Good afternoon! Checking in? May I have your passport and reservation name?",
        ideal: "Good afternoon! Yes, the reservation is under Alex Reed. Here is my passport.",
        keywords: [
          { phrase: "under the name", hintFa: "(به نامِ Alex)", weight: 30 },
          { phrase: "Here is my", hintFa: "(بفرمایید پاسپورت من)", weight: 20 },
        ],
        vocabUpgrade: {
          learner: "My name is Alex book room",
          native: "The booking is under Alex Reed",
          noteFa: "برای اعلام رزرو، عبارت 'The booking is under [Name]' استانداردترین است.",
        },
      },
      {
        speakerName: "Clerk",
        roleFa: "مسئول پذیرش",
        speakerAvatar: "🛎️",
        charPrompt: "Found it! We have you in room 312 on the third floor.",
        ideal: "Thank you. Could I possibly get a quiet room facing away from the elevator?",
        keywords: [
          { phrase: "Could I possibly", hintFa: "(آیا امکانش هست که...)", weight: 30 },
          { phrase: "quiet room", hintFa: "(اتاق ساکت)", weight: 20 },
        ],
        vocabUpgrade: {
          learner: "I want quiet room not elevator",
          native: "Could I request a quiet room away from the lift?",
          noteFa: "استفاده از 'Could I possibly request...' اوج ادب در زبان انگلیسی است.",
        },
      },
      {
        speakerName: "Clerk",
        roleFa: "مسئول پذیرش",
        speakerAvatar: "🛎️",
        charPrompt: "Certainly! I have switched you to room 514 facing the inner garden. Enjoy your stay!",
        ideal: "That is fantastic! Thank you so much for your assistance.",
        keywords: [
          { phrase: "fantastic", hintFa: "(فوق‌العاده)", weight: 25 },
          { phrase: "for your assistance", hintFa: "(برای کمک و پیگیریتون)", weight: 25 },
        ],
        vocabUpgrade: {
          learner: "Thanks for help good room",
          native: "Much obliged for your assistance!",
          noteFa: "جایگزین کردن 'assistance' به جای 'help' لحن شما را حرفه‌ای‌تر می‌کند.",
        },
      },
    ],
  },
  {
    titleFa: "مرجوع کردن جنس در فروشگاه",
    titleEn: "Returning a Faulty Item",
    scenarioFa: "یک پیراهن با سایز نامناسب یا دکمه خراب خریده‌ای و می‌خواهی آن را با فاکتور تعویض یا پس بدهی.",
    locationContextFa: "میز خدمات مشتریان فروشگاه",
    turns: [
      {
        speakerName: "Cashier",
        roleFa: "مسئول خدمات",
        speakerAvatar: "🛍️",
        charPrompt: "Hello! How can I assist you with your purchase today?",
        ideal: "Hi! I would like to return this shirt. I bought it yesterday but it doesn't fit.",
        keywords: [
          { phrase: "would like to return", hintFa: "(مایل به مرجوع کردن هستم)", weight: 30 },
          { phrase: "doesn't fit", hintFa: "(اندازه‌ام نیست)", weight: 25 },
        ],
        vocabUpgrade: {
          learner: "I give back shirt bad size",
          native: "I'd like to return this, as it doesn't fit properly",
          noteFa: "عبارت 'It doesn't fit' به معنی اندازه نبودن لباس است.",
        },
      },
      {
        speakerName: "Cashier",
        roleFa: "مسئول خدمات",
        speakerAvatar: "🛍️",
        charPrompt: "I see. Do you have the original receipt and tags still attached?",
        ideal: "Yes, the tags are still on and here is the original receipt.",
        keywords: [
          { phrase: "tags are still on", hintFa: "(اتیکت‌ها هنوز روشه)", weight: 25 },
          { phrase: "original receipt", hintFa: "(فاکتور اصلی)", weight: 25 },
        ],
        vocabUpgrade: {
          learner: "I have paper bill",
          native: "Here is the original purchase receipt",
          noteFa: "برای فاکتور خرید، واژه دقیق 'receipt' (با p خاموش) است.",
        },
      },
      {
        speakerName: "Cashier",
        roleFa: "مسئول خدمات",
        speakerAvatar: "🛍️",
        charPrompt: "Perfect. Would you prefer a full refund to your card or store credit?",
        ideal: "A full refund to my card would be wonderful, please.",
        keywords: [
          { phrase: "full refund", hintFa: "(بازگشت کامل وجه)", weight: 30 },
          { phrase: "would be wonderful", hintFa: "(عالی خواهد بود)", weight: 20 },
        ],
        vocabUpgrade: {
          learner: "Give money back to card",
          native: "I'd prefer a full refund to the original card",
          noteFa: "استفاده از 'full refund' نشان‌دهنده دقت واژگانی شماست.",
        },
      },
    ],
  },
  {
    titleFa: "گرفتن وقت دکتر در کلینیک",
    titleEn: "Booking a Doctor Appointment",
    scenarioFa: "گلودرد شدید داری و می‌خواهی برای فردا صبح زود از دکتر عمومی وقت ویزیت بگیری.",
    locationContextFa: "پذیرش کلینیک درمانی",
    turns: [
      {
        speakerName: "Nurse",
        roleFa: "منشی مطب",
        speakerAvatar: "👩‍⚕️",
        charPrompt: "Good morning, Westside Clinic. How can we help you?",
        ideal: "Good morning. I would like to make an appointment to see a general doctor.",
        keywords: [
          { phrase: "make an appointment", hintFa: "(وقت ویزیت گرفتن)", weight: 30 },
          { phrase: "general doctor", hintFa: "(پزشک عمومی)", weight: 20 },
        ],
        vocabUpgrade: {
          learner: "I want see doctor today",
          native: "I'd like to book an appointment with a GP",
          noteFa: "در انگلستان و کشورهای انگلیسی‌زبان، پزشک عمومی 'GP' (General Practitioner) نامیده می‌شود.",
        },
      },
      {
        speakerName: "Nurse",
        roleFa: "منشی مطب",
        speakerAvatar: "👩‍⚕️",
        charPrompt: "Are you having any urgent symptoms like chest pain or shortness of breath?",
        ideal: "No, just a severe sore throat and mild fever since yesterday.",
        keywords: [
          { phrase: "sore throat", hintFa: "(گلودرد)", weight: 30 },
          { phrase: "mild fever", hintFa: "(تب خفیف)", weight: 20 },
        ],
        vocabUpgrade: {
          learner: "Throat hurt hot body",
          native: "I have a sore throat accompanied by a mild fever",
          noteFa: "اصطلاح 'sore throat' و 'mild fever' دقیق‌ترین علائم پزشکی هستند.",
        },
      },
      {
        speakerName: "Nurse",
        roleFa: "منشی مطب",
        speakerAvatar: "👩‍⚕️",
        charPrompt: "Dr. Evans has an opening tomorrow morning at 9:30 AM. Does that work for you?",
        ideal: "Yes, 9:30 AM works perfectly for me. Thank you very much!",
        keywords: [
          { phrase: "works perfectly", hintFa: "(کاملاً مناسب و اوکیه)", weight: 30 },
          { phrase: "Thank you", hintFa: "(متشکرم)", weight: 20 },
        ],
        vocabUpgrade: {
          learner: "Yes 9:30 is good time",
          native: "9:30 AM suits me perfectly",
          noteFa: "گفتن '[Time] works / suits me' طبیعی‌ترین شکل تایید ساعت است.",
        },
      },
    ],
  },
  {
    titleFa: "برنامه‌ریزی تفریح آخر هفته با دوست",
    titleEn: "Planning a Weekend Outing",
    scenarioFa: "دوستت پیشنهاد رفتن به سینما یا کوه‌نوردی در هوای آزاد را می‌دهد. نظرت را با استدلال بگو.",
    locationContextFa: "کافه تریا دانشگاه",
    turns: [
      {
        speakerName: "Chris",
        roleFa: "دوست قدیمی",
        speakerAvatar: "🧢",
        charPrompt: "Hey! The weather is going to be sunny this Saturday. What do you feel like doing?",
        ideal: "Hey Chris! How about going for a hike in the national park?",
        keywords: [
          { phrase: "How about", hintFa: "(نظرت چیه درباره...)", weight: 30 },
          { phrase: "going for a hike", hintFa: "(رفتن به هایکینگ/پیاده‌روی)", weight: 25 },
        ],
        vocabUpgrade: {
          learner: "We go mountain walk",
          native: "How about we go for a scenic hike?",
          noteFa: "برای پیاده‌روی در طبیعت همیشه از فعل 'go hiking / go for a hike' استفاده می‌شود.",
        },
      },
      {
        speakerName: "Chris",
        roleFa: "دوست قدیمی",
        speakerAvatar: "🧢",
        charPrompt: "Hiking sounds tempting, but won't it be too crowded on a Saturday morning?",
        ideal: "If we leave early around 8 AM, we can easily avoid the crowd.",
        keywords: [
          { phrase: "If we leave early", hintFa: "(اگه زود راه بیفتیم)", weight: 30 },
          { phrase: "avoid the crowd", hintFa: "(فرار از شلوغی)", weight: 25 },
        ],
        vocabUpgrade: {
          learner: "We go 8 AM not many people",
          native: "If we set off early, we'll beat the rush",
          noteFa: "اصطلاح نیتیو 'beat the rush' یعنی قبل از شلوغ شدن در مقصد بودن.",
        },
      },
      {
        speakerName: "Chris",
        roleFa: "دوست قدیمی",
        speakerAvatar: "🧢",
        charPrompt: "Smart thinking! Should I pick you up from your place or meet at the trailhead?",
        ideal: "Could you pick me up at my place? I'll prepare some sandwiches for both of us!",
        keywords: [
          { phrase: "pick me up", hintFa: "(بیا دنبالم)", weight: 30 },
          { phrase: "prepare some sandwiches", hintFa: "(آماده کردن ساندویچ)", weight: 20 },
        ],
        vocabUpgrade: {
          learner: "Come to my house with car",
          native: "Could you swing by and pick me up?",
          noteFa: "عبارت 'pick someone up' استاندارد رساندن یا سوار کردن کسی با ماشین است.",
        },
      },
    ],
  },
  {
    titleFa: "پیشنهاد کتاب در کتاب‌فروشی",
    titleEn: "Asking Book Recommendation",
    scenarioFa: "دنبال یک کتاب داستان روان برای تقویت زبان انگلیسی می‌گردی و از کتابدار راهنمایی می‌خواهی.",
    locationContextFa: "کتاب‌فروشی دنج واترستونز",
    turns: [
      {
        speakerName: "Librarian",
        roleFa: "کتابدار",
        speakerAvatar: "📚",
        charPrompt: "Welcome in! Are you searching for any specific author or genre?",
        ideal: "Hello! I am looking for an engaging fiction book suitable for language learners.",
        keywords: [
          { phrase: "looking for", hintFa: "(دنبالِ... می‌گردم)", weight: 25 },
          { phrase: "engaging fiction", hintFa: "(رمان داستانی جذاب)", weight: 30 },
        ],
        vocabUpgrade: {
          learner: "I want book story easy english",
          native: "I'm looking for an accessible, engaging novel",
          noteFa: "کلمه 'accessible' یعنی متنی که برای خواننده فهمش آسان و دلنشین است.",
        },
      },
      {
        speakerName: "Librarian",
        roleFa: "کتابدار",
        speakerAvatar: "📚",
        charPrompt: "Have you ever read 'The Curious Incident of the Dog in the Night-Time'? It's beautifully written.",
        ideal: "I haven't read that yet, but the summary sounds very intriguing!",
        keywords: [
          { phrase: "haven't read that yet", hintFa: "(هنوز نخوانده‌ام)", weight: 25 },
          { phrase: "sounds very intriguing", hintFa: "(بسیار کنجکاوی‌برانگیز به نظر می‌رسه)", weight: 30 },
        ],
        vocabUpgrade: {
          learner: "I not read sounds interesting",
          native: "It sounds genuinely captivating",
          noteFa: "استفاده از 'intriguing' تنوع لغوی شما را نشان می‌دهد.",
        },
      },
      {
        speakerName: "Librarian",
        roleFa: "کتابدار",
        speakerAvatar: "📚",
        charPrompt: "It's on sale for ten dollars right now on the front display table.",
        ideal: "That's a bargain! I'll take a copy right away. Thank you!",
        keywords: [
          { phrase: "That's a bargain", hintFa: "(قیمتش واقعاً مفته!)", weight: 30 },
          { phrase: "take a copy", hintFa: "(یک جلد برمی‌دارم)", weight: 20 },
        ],
        vocabUpgrade: {
          learner: "Very cheap price I buy",
          native: "What a steal! I'll grab a copy",
          noteFa: "اصطلاح 'That's a bargain' نشان‌دهنده رضایت از قیمت عالی است.",
        },
      },
    ],
  },
  {
    titleFa: "اعلام چمدان گم‌شده در فرودگاه",
    titleEn: "Reporting Lost Luggage",
    scenarioFa: "پروازت نشسته اما چمدانت روی تسمه نقاله نیامده است. باید در باجه Lost & Found فرم پر کنی.",
    locationContextFa: "باجه اشیاء گمشده فرودگاه",
    turns: [
      {
        speakerName: "Agent",
        roleFa: "مسئول فرودگاه",
        speakerAvatar: "🧳",
        charPrompt: "Lost Baggage Services. Did your suitcase fail to arrive on the carousel?",
        ideal: "Yes, unfortunately my black Samsonite suitcase didn't appear on carousel 3.",
        keywords: [
          { phrase: "unfortunately", hintFa: "(متاسفانه)", weight: 25 },
          { phrase: "didn't appear", hintFa: "(ظاهر نشد / نیامد)", weight: 25 },
        ],
        vocabUpgrade: {
          learner: "My bag not come on belt",
          native: "My checked bag hasn't shown up on the belt",
          noteFa: "چمدانی که به بار تحویل می‌دهید 'checked bag/luggage' نام دارد.",
        },
      },
      {
        speakerName: "Agent",
        roleFa: "مسئول فرودگاه",
        speakerAvatar: "🧳",
        charPrompt: "Can you provide the luggage claim tag receipt that was attached to your boarding pass?",
        ideal: "Here it is. The tag number is BA-94821. It has a red ribbon on the handle.",
        keywords: [
          { phrase: "tag number", hintFa: "(شماره برچسب بار)", weight: 25 },
          { phrase: "red ribbon on the handle", hintFa: "(روبان قرمز روی دسته)", weight: 30 },
        ],
        vocabUpgrade: {
          learner: "Paper tag here bag has red thing",
          native: "Here's the baggage slip; it has a distinguishing red ribbon",
          noteFa: "توصیف مشخصات ظاهری چمدان برای پیدا کردن سریع آن حیاتی است.",
        },
      },
      {
        speakerName: "Agent",
        roleFa: "مسئول فرودگاه",
        speakerAvatar: "🧳",
        charPrompt: "We have tracked it—it arrived on the next flight and will be delivered to your hotel tonight.",
        ideal: "What a relief! Thank you so much for locating it so quickly.",
        keywords: [
          { phrase: "What a relief", hintFa: "(خیالم راحت شد / چه خیالی آسوده شد)", weight: 35 },
          { phrase: "for locating it", hintFa: "(برای پیدا کردنش)", weight: 20 },
        ],
        vocabUpgrade: {
          learner: "I am happy thanks for find",
          native: "What a huge relief! I truly appreciate it",
          noteFa: "اصطلاح نیتیو 'What a relief!' احساس آرامش عمیق را بیان می‌کند.",
        },
      },
    ],
  },
  {
    titleFa: "سفارش غذا با پرهیز غذایی خاص",
    titleEn: "Ordering with Dietary Preferences",
    scenarioFa: "به بادام‌زمینی یا گلوتن حساسیت داری و می‌خواهی از بدون حساسیت بودن غذا مطمئن شوی.",
    locationContextFa: "رستوران ایتالیایی میلان",
    turns: [
      {
        speakerName: "Server",
        roleFa: "میزبان رستوران",
        speakerAvatar: "🍝",
        charPrompt: "Welcome! Our special today is the creamy walnut pasta. Shall I bring you a plate?",
        ideal: "That sounds delicious, but I am severely allergic to nuts. Is there a nut-free pasta?",
        keywords: [
          { phrase: "severely allergic to", hintFa: "(شدیداً حساسیت دارم به...)", weight: 35 },
          { phrase: "nut-free", hintFa: "(بدون مغزیجات و آجیل)", weight: 25 },
        ],
        vocabUpgrade: {
          learner: "No nuts I get sick",
          native: "I have a severe nut allergy; could you recommend a safe alternative?",
          noteFa: "بیان شفاف 'allergic to' از نظر سلامتی در رستوران‌ها الزامی است.",
        },
      },
      {
        speakerName: "Server",
        roleFa: "میزبان رستوران",
        speakerAvatar: "🍝",
        charPrompt: "Thanks for letting us know! Our marinara spaghetti is completely nut-free and cooked separately.",
        ideal: "That sounds safe and appetizing. I will go with the marinara spaghetti, please.",
        keywords: [
          { phrase: "I will go with", hintFa: "(من همینو انتخاب می‌کنم)", weight: 30 },
          { phrase: "appetizing", hintFa: "(اشتهاآور)", weight: 20 },
        ],
        vocabUpgrade: {
          learner: "I eat marinara spaghetti",
          native: "I'll opt for the marinara spaghetti, please",
          noteFa: "اصطلاح 'I'll go with...' طبیعی‌ترین شیوه انتخاب غذاست.",
        },
      },
      {
        speakerName: "Server",
        roleFa: "میزبان رستوران",
        speakerAvatar: "🍝",
        charPrompt: "Noted with the kitchen chef. It will be out in fifteen minutes!",
        ideal: "Thank you for being so attentive to my allergy. Much appreciated!",
        keywords: [
          { phrase: "attentive to", hintFa: "(دقیق و توجه‌کننده به...)", weight: 30 },
          { phrase: "Much appreciated", hintFa: "(بسیار سپاسگزارم)", weight: 20 },
        ],
        vocabUpgrade: {
          learner: "Thanks for care about me",
          native: "Thank you for accommodating my dietary needs!",
          noteFa: "فعل 'accommodate' برای هماهنگی با نیازهای غذایی کاربرد بالایی دارد.",
        },
      },
    ],
  },
  {
    titleFa: "دعوت همکار به جشن و هماهنگی ساعت",
    titleEn: "Inviting a Friend to Dinner",
    scenarioFa: "می‌خواهی همکارت را برای شام جمعه به خانه دعوت کنی و با او سر ساعت به تفاهم برسی.",
    locationContextFa: "لابی شرکت",
    turns: [
      {
        speakerName: "Colleague",
        roleFa: "همکار",
        speakerAvatar: "💼",
        charPrompt: "Hey! Do you have any plans for Friday evening?",
        ideal: "Not yet! I'm hosting a small dinner at my place and would love if you could come.",
        keywords: [
          { phrase: "hosting a small dinner", hintFa: "(میزبان یک شام خودمانی هستم)", weight: 30 },
          { phrase: "would love if you could", hintFa: "(خیلی خوشحال میشم اگه بتونی...)", weight: 25 },
        ],
        vocabUpgrade: {
          learner: "Come to my house Friday food",
          native: "I'm having a few friends over for dinner on Friday",
          noteFa: "اصطلاح 'having people over' یعنی مهمان داشتن در خانه.",
        },
      },
      {
        speakerName: "Colleague",
        roleFa: "همکار",
        speakerAvatar: "💼",
        charPrompt: "That sounds lovely! What time should I arrive, and can I bring any dessert?",
        ideal: "Around 7:30 PM would be ideal. Bringing some ice cream or dessert would be wonderful!",
        keywords: [
          { phrase: "would be ideal", hintFa: "(ساعت ایده‌آلی خواهد بود)", weight: 30 },
          { phrase: "Bringing dessert", hintFa: "(آوردن دسر)", weight: 20 },
        ],
        vocabUpgrade: {
          learner: "Come 7:30 and bring cake",
          native: "7:30 PM works like a charm; a sweet treat would be awesome!",
          noteFa: "اصطلاح 'would be ideal' پیشنهاد مؤدبانه برای زمان است.",
        },
      },
      {
        speakerName: "Colleague",
        roleFa: "همکار",
        speakerAvatar: "💼",
        charPrompt: "Count me in! I will bring artisanal gelato from that Italian bakery.",
        ideal: "I can't wait! See you on Friday evening!",
        keywords: [
          { phrase: "I can't wait", hintFa: "(طاقت ندارم / خیلی ذوق دارم)", weight: 30 },
          { phrase: "See you on Friday", hintFa: "(جمعه می‌بینمت)", weight: 20 },
        ],
        vocabUpgrade: {
          learner: "I am happy to see you",
          native: "Looking forward to it! See you Friday!",
          noteFa: "اصطلاح 'Looking forward to it' ابراز اشتیاق شیک به زبان انگلیسی است.",
        },
      },
    ],
  },
  {
    titleFa: "راهنمایی گرفتن درباره آب‌وهوا و وسایل سفر",
    titleEn: "Weather & Packing Advice",
    scenarioFa: "قصد سفر به کوهستان آلپ داری و از لیدر تور درباره لباس مناسب سوال می‌کنی.",
    locationContextFa: "دفتر آژانس گردشگری",
    turns: [
      {
        speakerName: "Tour Guide",
        roleFa: "راهنمای تور",
        speakerAvatar: "🏔️",
        charPrompt: "Hello traveler! Are you packed and ready for our mountain excursion tomorrow?",
        ideal: "Almost ready! What kind of weather should we expect in the upper valleys?",
        keywords: [
          { phrase: "What kind of weather", hintFa: "(چه جور آب‌وهوایی)", weight: 25 },
          { phrase: "should we expect", hintFa: "(باید انتظار داشته باشیم؟)", weight: 30 },
        ],
        vocabUpgrade: {
          learner: "Weather is cold or hot there?",
          native: "What's the forecast looking like up there?",
          noteFa: "کلمه 'forecast' یعنی پیش‌بینی آب‌وهوا.",
        },
      },
      {
        speakerName: "Tour Guide",
        roleFa: "راهنمای تور",
        speakerAvatar: "🏔️",
        charPrompt: "It's chilly and windy in the morning, around 5 degrees Celsius, but warms up by noon.",
        ideal: "In that case, dressing in layers with a windbreaker jacket seems like the smartest choice.",
        keywords: [
          { phrase: "dressing in layers", hintFa: "(لایه‌لایه لباس پوشیدن)", weight: 35 },
          { phrase: "windbreaker", hintFa: "(بادگیر)", weight: 20 },
        ],
        vocabUpgrade: {
          learner: "I wear many clothes on body",
          native: "Layering up with thermal wear will be essential",
          noteFa: "اصطلاح اصیل 'dressing in layers' راز لباس پوشیدن در کوهستان است.",
        },
      },
      {
        speakerName: "Tour Guide",
        roleFa: "راهنمای تور",
        speakerAvatar: "🏔️",
        charPrompt: "Spot on! And don't forget sturdy walking boots with good grip.",
        ideal: "Understood! I will pack my hiking boots tonight. Thanks for the valuable tip!",
        keywords: [
          { phrase: "Understood", hintFa: "(متوجه شدم)", weight: 20 },
          { phrase: "valuable tip", hintFa: "(نکته ارزشمند)", weight: 30 },
        ],
        vocabUpgrade: {
          learner: "Okay I put boots in bag thanks",
          native: "Noted! Thanks for the heads-up on the footwear",
          noteFa: "اصطلاح 'heads-up' یعنی تذکر یا راهنمایی پیشگیرانه.",
        },
      },
    ],
  },
  {
    titleFa: "مرحله پایانی A2: رزرو تور قطار چشم‌نواز",
    titleEn: "A2 Boss Level: Scenic Train Tour Booking",
    scenarioFa: "در باجه قطارهای سوئیس می‌خواهی بلیط واگن پانوراما با صندلی کنار پنجره رزرو کنی.",
    locationContextFa: "ایستگاه قطار زوریخ",
    turns: [
      {
        speakerName: "Station Agent",
        roleFa: "متصدی گیشه",
        speakerAvatar: "🚂",
        charPrompt: "Good day! Welcome to Swiss Federal Railways. Where would you like to journey today?",
        ideal: "Good day! I'd like to book two tickets for the Glacier Express panoramic train to Zermatt.",
        keywords: [
          { phrase: "panoramic train", hintFa: "(قطار پانوراما با شیشه‌های بزرگ)", weight: 30 },
          { phrase: "book two tickets", hintFa: "(رزرو دو بلیت)", weight: 25 },
        ],
        vocabUpgrade: {
          learner: "I want train see mountain ticket",
          native: "I'd like to reserve panoramic seats on the express",
          noteFa: "واژه 'panoramic' برای قطارهای گردشگری با شیشه سراسری است.",
        },
      },
      {
        speakerName: "Station Agent",
        roleFa: "متصدی گیشه",
        speakerAvatar: "🚂",
        charPrompt: "A breathtaking route! Do you prefer window seats on the left side with mountain valley views?",
        ideal: "Yes please, window seats on the valley side would be absolutely spectacular!",
        keywords: [
          { phrase: "window seats", hintFa: "(صندلی‌های کنار پنجره)", weight: 25 },
          { phrase: "absolutely spectacular", hintFa: "(کاملاً دیدنی و شگفت‌انگیز)", weight: 30 },
        ],
        vocabUpgrade: {
          learner: "I want window sit see nice",
          native: "Window seats on the scenic side would be ideal",
          noteFa: "صفت 'spectacular' نشان‌دهنده زیبایی خارق‌العاده مناظر است.",
        },
      },
      {
        speakerName: "Station Agent",
        roleFa: "متصدی گیشه",
        speakerAvatar: "🚂",
        charPrompt: "Your reservation is confirmed for carriage 4, seats 12 and 14. Have an unforgettable trip!",
        ideal: "Thank you so much for arranging this. You've made our trip memorable!",
        keywords: [
          { phrase: "arranging this", hintFa: "(هماهنگ کردن این مورد)", weight: 25 },
          { phrase: "made our trip memorable", hintFa: "(سفر ما رو به‌یادماندنی کردی)", weight: 30 },
        ],
        vocabUpgrade: {
          learner: "Thanks for seats good agent",
          native: "I'm immensely grateful for your kind assistance",
          noteFa: "عبارت 'made our trip memorable' بهترین تحسین ممکن به کارمند گیشه است.",
        },
      },
    ],
  },
]);

// ---------------------------------------------------------
// B1 CURRICULUM DEFINITIONS
// ---------------------------------------------------------
export const B1_SPEAKING_MISSIONS = generateTierMissions("B1", [
  {
    titleFa: "حل بحران پرواز کنسل‌شده در فرودگاه هیترو",
    titleEn: "Resolving a Cancelled Flight Dilemma",
    scenarioFa: "پروازت به دلیل شرایط جوی لغو شده است. باید با نماینده ایرلاین مذاکره کنی تا پرواز بعدی یا هتل رایگان فراهم کند.",
    locationContextFa: "گیت شماره ۲۴ فرودگاه هیترو",
    turns: [
      {
        speakerName: "Airline Rep",
        roleFa: "نماینده پرواز",
        speakerAvatar: "✈️",
        charPrompt: "I understand everyone is stressed, but Flight BA-104 has been cancelled due to technical difficulties.",
        ideal: "Excuse me, I have a vital connection in Frankfurt tonight. What alternative rerouting options can you offer me?",
        keywords: [
          { phrase: "vital connection", hintFa: "(پرواز اتصالی حیاتی)", weight: 30 },
          { phrase: "alternative rerouting options", hintFa: "(گزینه‌های جایگزین تغییر مسیر)", weight: 30 },
        ],
        vocabUpgrade: {
          learner: "My plane cancel what do I do now?",
          native: "Could you look into alternative routing to get me to my destination?",
          noteFa: "استفاده از 'alternative rerouting' مذاکره شما را مسلط جلوه می‌دهد.",
        },
      },
      {
        speakerName: "Airline Rep",
        roleFa: "نماینده پرواز",
        speakerAvatar: "✈️",
        charPrompt: "We have a flight departing at 6:00 AM tomorrow morning, but nothing remaining tonight.",
        ideal: "Since the overnight delay is technical, will the airline provide complimentary hotel accommodation and meal vouchers?",
        keywords: [
          { phrase: "complimentary hotel accommodation", hintFa: "(اقامت هتل رایگان بر عهده ایرلاین)", weight: 35 },
          { phrase: "meal vouchers", hintFa: "(کوپن غذا)", weight: 25 },
        ],
        vocabUpgrade: {
          learner: "You pay hotel for me sleep?",
          native: "Does the airline provide complimentary accommodation for overnight disruptions?",
          noteFa: "واژه 'complimentary' رسمی‌تر و حرفه‌ای‌تر از 'free' است.",
        },
      },
      {
        speakerName: "Airline Rep",
        roleFa: "نماینده پرواز",
        speakerAvatar: "✈️",
        charPrompt: "Yes, absolutely. Here are your hotel voucher, airport shuttle pass, and a £30 food coupon.",
        ideal: "I appreciate your prompt handling of the situation. Thank you for sorting this out so efficiently.",
        keywords: [
          { phrase: "prompt handling", hintFa: "(رسیدگی سریع و به‌موقع)", weight: 30 },
          { phrase: "sorting this out", hintFa: "(حل و فصل کردن این ماجرا)", weight: 25 },
        ],
        vocabUpgrade: {
          learner: "Thanks for give hotel paper fast",
          native: "Thank you for managing this disruption so smoothly",
          noteFa: "عبارت 'sorting this out' یکی از رایج‌ترین افعال عبارتی نیتیوهاست.",
        },
      },
    ],
  },
  {
    titleFa: "معرفی شرح شغل و برنامه‌های کاری در تیم",
    titleEn: "Introducing Job Roles in a Sprint Meeting",
    scenarioFa: "در اولین جلسه اسپرینت شرکت بین‌المللی شرکت کرده‌ای و باید مسئولیت‌هایت را تشریح کنی.",
    locationContextFa: "جلسه گوگل میت تیم مهندسی",
    turns: [
      {
        speakerName: "Team Lead",
        roleFa: "سرپرست تیم",
        speakerAvatar: "👩‍💻",
        charPrompt: "Welcome to the team! Could you briefly walk us through your background and what you'll be spearheading?",
        ideal: "Glad to be here! My primary focus is on front-end performance, UI accessibility, and collaborating closely with design.",
        keywords: [
          { phrase: "primary focus is on", hintFa: "(تمرکز اصلی من بر روی...)", weight: 30 },
          { phrase: "collaborating closely", hintFa: "(همکاری نزدیک و مداوم)", weight: 25 },
        ],
        vocabUpgrade: {
          learner: "My work is website front and talk with design",
          native: "My core responsibility revolves around front-end architecture and user experience",
          noteFa: "عبارت 'core responsibility revolves around' زبان حرفه‌ای کسب‌وکار است.",
        },
      },
      {
        speakerName: "Team Lead",
        roleFa: "سرپرست تیم",
        speakerAvatar: "👩‍💻",
        charPrompt: "Great! How do you usually handle cross-functional bottlenecks when backend APIs are delayed?",
        ideal: "I typically implement mock APIs and local contract tests so the frontend progress never gets blocked.",
        keywords: [
          { phrase: "implement mock APIs", hintFa: "(پیاده‌سازی داده‌های ساختگی تستی)", weight: 30 },
          { phrase: "never gets blocked", hintFa: "(هیچ‌گاه متوقف و قفل نشود)", weight: 25 },
        ],
        vocabUpgrade: {
          learner: "I make fake data so I wait not",
          native: "I decouple the client by working against mock data contracts",
          noteFa: "اصطلاح 'decouple' یا 'mock APIs' تخصص شما را نشان می‌دهد.",
        },
      },
      {
        speakerName: "Team Lead",
        roleFa: "سرپرست تیم",
        speakerAvatar: "👩‍💻",
        charPrompt: "That proactive mindset is exactly what we need. Let's touch base again after tomorrow's standup.",
        ideal: "Sounds like a solid plan. Looking forward to making a tangible impact on the product!",
        keywords: [
          { phrase: "solid plan", hintFa: "(برنامه محکم و حساب‌شده)", weight: 25 },
          { phrase: "tangible impact", hintFa: "(تاثیر ملموس و عینی)", weight: 30 },
        ],
        vocabUpgrade: {
          learner: "Yes good plan I do good work",
          native: "I'm eager to drive meaningful results for the team",
          noteFa: "ترکیب 'tangible impact' در مصاحبه‌ها و محیط کار امتیاز بالایی دارد.",
        },
      },
    ],
  },
  {
    titleFa: "مخالفت مؤدبانه و دفاع از راهکار بهتر در پروژه",
    titleEn: "Polite Disagreement in Project Architecture",
    scenarioFa: "همکارت پیشنهاد استفاده از یک تکنولوژی منسوخ را می‌دهد. باید بدون بی‌احترامی، ایرادات آن را بیان کنی.",
    locationContextFa: "اتاق کنفرانس شرکت",
    turns: [
      {
        speakerName: "Senior Dev",
        roleFa: "توسعه‌دهنده ارشد",
        speakerAvatar: "👨‍💻",
        charPrompt: "I think we should stick with our legacy relational database for the upcoming real-time chat module.",
        ideal: "I see your point regarding familiarity, but wouldn't a document store handle real-time concurrency much more efficiently?",
        keywords: [
          { phrase: "I see your point", hintFa: "(نکته و نظرت رو متوجه میشم، اما...)", weight: 30 },
          { phrase: "concurrency", hintFa: "(هم‌روندی و درخواست‌های همزمان)", weight: 25 },
        ],
        vocabUpgrade: {
          learner: "No old database is bad and slow",
          native: "While I appreciate the stability, scalability might become an issue under load",
          noteFa: "فرمول 'I see your point, but wouldn't...' مؤدبانه‌ترین روش مخالفت منطقی است.",
        },
      },
      {
        speakerName: "Senior Dev",
        roleFa: "توسعه‌دهنده ارشد",
        speakerAvatar: "👨‍💻",
        charPrompt: "That's true, but migrating to a new database engine will lengthen our development timeline by at least two weeks.",
        ideal: "Fair concern, yet investing those two weeks upfront will prevent massive technical debt and downtime later on.",
        keywords: [
          { phrase: "Fair concern", hintFa: "(نگرانی کاملاً بجا و درستی است)", weight: 25 },
          { phrase: "technical debt", hintFa: "(بدهی فنی و هزینه‌های بعدی)", weight: 30 },
        ],
        vocabUpgrade: {
          learner: "Two weeks is okay later we get trouble",
          native: "Taking the time now will pay dividends by avoiding future refactoring",
          noteFa: "اصطلاح 'technical debt' زبان تخصصی مهندسی و برنامه‌ریزی است.",
        },
      },
      {
        speakerName: "Senior Dev",
        roleFa: "توسعه‌دهنده ارشد",
        speakerAvatar: "👨‍💻",
        charPrompt: "You make a compelling argument. Let's run a quick benchmark test this afternoon to compare throughput.",
        ideal: "That sounds like a sensible compromise. I'll prepare the benchmark script right away.",
        keywords: [
          { phrase: "sensible compromise", hintFa: "(سازش و توافق منطقی و معقول)", weight: 35 },
          { phrase: "prepare the benchmark", hintFa: "(آماده کردن تست عملکرد)", weight: 20 },
        ],
        vocabUpgrade: {
          learner: "Okay good we test together",
          native: "Agreed, empirical testing will give us the clarity we need",
          noteFa: "اصطلاح 'sensible compromise' اوج پختگی در کار تیمی را می‌رساند.",
        },
      },
    ],
  },
  {
    titleFa: "توصیف تجربه سفر فراموش‌نشدنی",
    titleEn: "Narrating a Memorable Travel Story",
    scenarioFa: "در یک برنامه پادکست درباره تجربیات سفر، داستان یک ماجراجویی غیرمنتظره را روایت می‌کنی.",
    locationContextFa: "استودیوی ضبط پادکست",
    turns: [
      {
        speakerName: "Podcast Host",
        roleFa: "مجری پادکست",
        speakerAvatar: "🎙️",
        charPrompt: "Tell us about a travel experience where things didn't go as planned, yet turned out extraordinary!",
        ideal: "Two years ago in Cappadocia, our hot-air balloon got canceled due to sudden fog, so we explored underground caves instead.",
        keywords: [
          { phrase: "due to sudden fog", hintFa: "(به دلیل مه ناگهانی)", weight: 25 },
          { phrase: "turned out extraordinary", hintFa: "(فوق‌العاده از آب درآمد)", weight: 30 },
        ],
        vocabUpgrade: {
          learner: "Fog came balloon stop we went cave",
          native: "When the flight was grounded, we pivoted to an impromptu cave trek",
          noteFa: "فعل 'pivoted to' یعنی تغییر هوشمندانه مسیر یا برنامه.",
        },
      },
      {
        speakerName: "Podcast Host",
        roleFa: "مجری پادکست",
        speakerAvatar: "🎙️",
        charPrompt: "Wow! What was the most fascinating discovery inside those underground tunnels?",
        ideal: "We stumbled upon a local family preserving ancient ceramic pottery techniques that had lasted for centuries.",
        keywords: [
          { phrase: "stumbled upon", hintFa: "(تصادفاً برخورد کردیم به...)", weight: 35 },
          { phrase: "ancient pottery", hintFa: "(سفالگری کهن)", weight: 20 },
        ],
        vocabUpgrade: {
          learner: "We found people make pots inside cave",
          native: "We serendipitously met artisans preserving centuries-old craftsmanship",
          noteFa: "اصطلاح نیتیو 'stumbled upon' یعنی کشف تصادفی یک چیز شگفت‌انگیز.",
        },
      },
      {
        speakerName: "Podcast Host",
        roleFa: "مجری پادکست",
        speakerAvatar: "🎙️",
        charPrompt: "That is pure magic! What takeaway would you share with fellow travelers?",
        ideal: "Embrace unexpected disruptions—they often lead to the most authentic cultural encounters.",
        keywords: [
          { phrase: "Embrace unexpected disruptions", hintFa: "(پذیرش پیشامدهای غیرمنتظره)", weight: 35 },
          { phrase: "authentic cultural encounters", hintFa: "(مواجهه‌های فرهنگی اصیل)", weight: 25 },
        ],
        vocabUpgrade: {
          learner: "Don't be sad if bad thing happen in travel",
          native: "Embrace unpredictability, because that is where genuine adventure begins",
          noteFa: "جمله‌بندی فلسفی و عمیق برای جمع‌بندی سطح B1 ایده‌آل است.",
        },
      },
    ],
  },
  {
    titleFa: "تقاضای تمدید ددلاین از استاد دانشگاه",
    titleEn: "Requesting an Assignment Extension",
    scenarioFa: "به علت بیماری آنفولانزا نتوانسته‌ای گزارش پژوهشی را کامل کنی و تقاضای ۴۸ ساعت مهلت اضافه داری.",
    locationContextFa: "دفتر استاد در دانشکده",
    turns: [
      {
        speakerName: "Professor Collins",
        roleFa: "استاد راهنما",
        speakerAvatar: "👨‍🏫",
        charPrompt: "Come in. You mentioned in your email that you're facing obstacles with tomorrow's submission?",
        ideal: "Good morning Professor Collins. Unfortunately, I fell ill with severe flu this week, which significantly hindered my research progress.",
        keywords: [
          { phrase: "fell ill with", hintFa: "(دچار بیماری شدم)", weight: 25 },
          { phrase: "significantly hindered", hintFa: "(به‌طور چشمگیری مانع پیشرفت شد)", weight: 35 },
        ],
        vocabUpgrade: {
          learner: "I was sick with flu so I cannot finish",
          native: "A severe bout of flu compromised my ability to conduct the necessary field analysis",
          noteFa: "فعل 'hindered' یا 'compromised' بیان آکادمیک بسیار موثری است.",
        },
      },
      {
        speakerName: "Professor Collins",
        roleFa: "استاد راهنما",
        speakerAvatar: "👨‍🏫",
        charPrompt: "I'm sorry to hear that. Have you completed the preliminary literature review and primary data collection?",
        ideal: "Yes, all the data collection is complete; I merely need forty-eight hours to refine the analytical synthesis.",
        keywords: [
          { phrase: "merely need", hintFa: "(صرفاً نیاز دارم به...)", weight: 25 },
          { phrase: "analytical synthesis", hintFa: "(تلفیق و جمع‌بندی تحلیلی)", weight: 30 },
        ],
        vocabUpgrade: {
          learner: "I have data I just need 2 days write",
          native: "The empirical groundwork is done; I just require an extension to polish the final draft",
          noteFa: "واژه 'merely' یعنی فقط و صرفاً، که لحن درخواست را متواضعانه می‌کند.",
        },
      },
      {
        speakerName: "Professor Collins",
        roleFa: "استاد راهنما",
        speakerAvatar: "👨‍🏫",
        charPrompt: "Under these circumstances, I can grant an extension until Friday at 5:00 PM. Please take care of your health.",
        ideal: "Thank you immensely for your understanding and leniency, Professor Collins. I will deliver a thorough paper.",
        keywords: [
          { phrase: "understanding and leniency", hintFa: "(درک و مدارای شما)", weight: 35 },
          { phrase: "deliver a thorough paper", hintFa: "(ارائه مقاله‌ای جامع و کامل)", weight: 25 },
        ],
        vocabUpgrade: {
          learner: "Thank you for giving time I write good",
          native: "I deeply appreciate your flexibility and won't let you down",
          noteFa: "کلمه 'leniency' و 'thorough paper' تعهد بالای علمی شما را نشان می‌دهد.",
        },
      },
    ],
  },
  {
    titleFa: "حل اختلاف بر سر کارهای خانه با هم‌اتاقی",
    titleEn: "Negotiating House Chores with Roommate",
    scenarioFa: "سینک ظرفشویی پر شده و نوبت هم‌اتاقی‌ات بوده است. باید با رویکرد حل مسئله و بدون دعوا موضوع را حل کنید.",
    locationContextFa: "آشپزخانه آپارتمان دانشجویی",
    turns: [
      {
        speakerName: "Roommate Sam",
        roleFa: "هم‌اتاقی",
        speakerAvatar: "🛋️",
        charPrompt: "Hey, are you annoyed about the dishes in the sink? I had two midterms today and got overwhelmed.",
        ideal: "I totally understand exam stress, Sam. But leaving unwashed dishes attracts pests and makes it tough for others to cook.",
        keywords: [
          { phrase: "exam stress", hintFa: "(استرس امتحانات)", weight: 25 },
          { phrase: "makes it tough for others", hintFa: "(کار رو برای بقیه سخت می‌کنه)", weight: 30 },
        ],
        vocabUpgrade: {
          learner: "Don't leave dirty dishes it is bad",
          native: "I empathize with your workload, but keeping shared spaces functional is crucial for both of us",
          noteFa: "فعل 'empathize' نشان‌دهنده هوش هیجانی در مکالمه است.",
        },
      },
      {
        speakerName: "Roommate Sam",
        roleFa: "هم‌اتاقی",
        speakerAvatar: "🛋️",
        charPrompt: "You're right, I apologize. How can we make the chore schedule fairer so this doesn't recur during finals?",
        ideal: "How about creating a rotating chore board, where whoever cooks is exempt from doing the dishes that evening?",
        keywords: [
          { phrase: "rotating chore board", hintFa: "(جدول چرخشی کارهای خانه)", weight: 35 },
          { phrase: "exempt from", hintFa: "(معاف از...)", weight: 25 },
        ],
        vocabUpgrade: {
          learner: "We make list one cook one wash",
          native: "Let's establish a clear division of labor: the cook doesn't clean",
          noteFa: "اصطلاح 'exempt from' یعنی معاف از انجام کاری، بسیار دقیق و کاربردی.",
        },
      },
      {
        speakerName: "Roommate Sam",
        roleFa: "هم‌اتاقی",
        speakerAvatar: "🛋️",
        charPrompt: "That sounds like a fair deal! I'll clear the sink right now and take out the recycling.",
        ideal: "Awesome teamwork! Let me make us some hot tea while you finish up.",
        keywords: [
          { phrase: "Awesome teamwork", hintFa: "(همکاری تیمی عالی)", weight: 25 },
          { phrase: "while you finish up", hintFa: "(تا تو کارت رو تموم کنی)", weight: 25 },
        ],
        vocabUpgrade: {
          learner: "Good job I make tea for drink",
          native: "Appreciate the constructive attitude; tea is on me!",
          noteFa: "پایان دادن به مشاجره با انرژی مثبت دوستی را تقویت می‌کند.",
        },
      },
    ],
  },
  {
    titleFa: "نقد و تحلیل فیلم سینمایی در کافه",
    titleEn: "Critiquing a Cinema Masterpiece",
    scenarioFa: "تازه از سالن سینما بیرون آمده‌اید و درباره پایان‌بندی غافلگیرکننده فیلم نولان با دوستت بحث می‌کنی.",
    locationContextFa: "کافه جلوی سالن سینما",
    turns: [
      {
        speakerName: "Film Enthusiast",
        roleFa: "علاقه‌مند سینما",
        speakerAvatar: "🎬",
        charPrompt: "That final scene blew my mind! Did you interpret the ending as reality or an elaborate dream?",
        ideal: "In my opinion, the ambiguity was intentional; the director wanted the audience to question their own perception of memory.",
        keywords: [
          { phrase: "ambiguity was intentional", hintFa: "(ابهام تعمدی و هدفمند بود)", weight: 35 },
          { phrase: "perception of memory", hintFa: "(ادراک و برداشت از حافظه)", weight: 25 },
        ],
        vocabUpgrade: {
          learner: "The end was not clear on purpose",
          native: "The narrative intentionally embraced ambiguity to challenge subjective reality",
          noteFa: "کلمه 'ambiguity' نشان‌دهنده درک عمیق ساختار سینمایی است.",
        },
      },
      {
        speakerName: "Film Enthusiast",
        roleFa: "علاقه‌مند سینما",
        speakerAvatar: "🎬",
        charPrompt: "What about the pacing in the second act? Some critics argued the dialogue dragged too much.",
        ideal: "I disagree; the slower pacing built immense psychological tension that made the climax far more impactful.",
        keywords: [
          { phrase: "psychological tension", hintFa: "(تنش روانی)", weight: 30 },
          { phrase: "made the climax far more impactful", hintFa: "(نقطه اوج داستان را بسیار کوبنده‌تر کرد)", weight: 30 },
        ],
        vocabUpgrade: {
          learner: "Slow was good because end was exciting",
          native: "The deliberate pacing heighten the emotional resonance of the resolution",
          noteFa: "ترکیب 'psychological tension' نقد شما را فاخر و تحسین‌برانگیز می‌کند.",
        },
      },
      {
        speakerName: "Film Enthusiast",
        roleFa: "علاقه‌مند سینما",
        speakerAvatar: "🎬",
        charPrompt: "You just gave me a whole new perspective. How would you rate it overall out of five stars?",
        ideal: "A solid four point five stars for masterclass cinematography and thought-provoking storytelling.",
        keywords: [
          { phrase: "solid four point five", hintFa: "(چهار و نیم ستاره قاطع)", weight: 25 },
          { phrase: "thought-provoking storytelling", hintFa: "(روایت برانگیزاننده تفکر و تامل)", weight: 35 },
        ],
        vocabUpgrade: {
          learner: "4.5 stars because camera and story great",
          native: "An effortless 4.5 stars for visionary cinematography and narrative depth",
          noteFa: "صفت مرکب 'thought-provoking' بهترین توصیف برای آثار فلسفی است.",
        },
      },
    ],
  },
  {
    titleFa: "شرح علائم بیماری و مشاوره دارویی در داروخانه",
    titleEn: "Explaining Symptoms at a Pharmacy",
    scenarioFa: "در سفر خارجی دچار سردرد ضربان‌دار و آلرژی فصلی شده‌ای و از داروساز داروی مناسب غیرخواب‌آور می‌خواهی.",
    locationContextFa: "داروخانه شبانه‌روزی",
    turns: [
      {
        speakerName: "Pharmacist",
        roleFa: "دکتر داروساز",
        speakerAvatar: "💊",
        charPrompt: "Good afternoon. What symptoms are you experiencing that I can help soothe today?",
        ideal: "Hello doctor. I have been suffering from a throbbing headache and watery eyes due to seasonal allergies.",
        keywords: [
          { phrase: "throbbing headache", hintFa: "(سردرد ضربان‌دار و کوبنده)", weight: 30 },
          { phrase: "seasonal allergies", hintFa: "(آلرژی فصلی)", weight: 25 },
        ],
        vocabUpgrade: {
          learner: "Head beating pain and eyes water",
          native: "I'm dealing with a persistent, throbbing migraine accompanied by allergic rhinitis",
          noteFa: "صفت 'throbbing' برای توصیف سردردهای میگرنی کاملاً دقیق و بومی است.",
        },
      },
      {
        speakerName: "Pharmacist",
        roleFa: "دکتر داروساز",
        speakerAvatar: "💊",
        charPrompt: "Do you need medication that won't interfere with daytime activities or cause drowsiness?",
        ideal: "Yes, precisely! It must be non-drowsy because I have to drive and attend business meetings today.",
        keywords: [
          { phrase: "non-drowsy", hintFa: "(غیرخواب‌آور)", weight: 35 },
          { phrase: "interfere with", hintFa: "(تداخل ایجاد کردن با...)", weight: 25 },
        ],
        vocabUpgrade: {
          learner: "No sleep medicine because I drive car",
          native: "A non-drowsy formulation is mandatory as I cannot afford any cognitive impairment",
          noteFa: "کلمه 'non-drowsy' اصطلاح تجاری و پزشکی داروهای روزانه است.",
        },
      },
      {
        speakerName: "Pharmacist",
        roleFa: "دکتر داروساز",
        speakerAvatar: "💊",
        charPrompt: "Here is an advanced antihistamine tablet. Take one tablet every twenty-four hours with plenty of water.",
        ideal: "Thank you for the clear instructions and advice. How much do I owe you?",
        keywords: [
          { phrase: "clear instructions", hintFa: "(دستورالعمل‌های شفاف)", weight: 25 },
          { phrase: "How much do I owe you", hintFa: "(چقدر تقدیم کنم؟ / چقدر بدهکارم؟)", weight: 30 },
        ],
        vocabUpgrade: {
          learner: "Thank you how much money I pay?",
          native: "Much appreciated; what is the total balance?",
          noteFa: "اصطلاح نیتیو 'How much do I owe you?' بسیار طبیعی‌تر از 'How much money' است.",
        },
      },
    ],
  },
  {
    titleFa: "برنامه‌ریزی جشن غافلگیری برای همکار",
    titleEn: "Organizing a Surprise Farewell Party",
    scenarioFa: "همکارتان بعد از ۵ سال در حال مهاجرت است و می‌خواهید بدون اینکه متوجه شود برایش جشن بگیرید.",
    locationContextFa: "کافه تریا اداری بعد از ساعت کاری",
    turns: [
      {
        speakerName: "Co-worker Nora",
        roleFa: "همکار تیم",
        speakerAvatar: "🎉",
        charPrompt: "David is leaving next Friday! We absolutely must throw him a memorable send-off, don't you think?",
        ideal: "Without a doubt! He has been our rock for five years. We should coordinate a surprise farewell gathering.",
        keywords: [
          { phrase: "Without a doubt", hintFa: "(بدون کوچک‌ترین شک و تردید)", weight: 30 },
          { phrase: "surprise farewell gathering", hintFa: "(گردهمایی خداحافظی غافلگیرکننده)", weight: 30 },
        ],
        vocabUpgrade: {
          learner: "Yes sure we make party for him surprise",
          native: "He deserves an unforgettable send-off; let's orchestrate a covert farewell celebration",
          noteFa: "اصطلاح 'send-off' یعنی مهمانی یا بدرقه خداحافظی برای کسی که می‌رود.",
        },
      },
      {
        speakerName: "Co-worker Nora",
        roleFa: "همکار تیم",
        speakerAvatar: "🎉",
        charPrompt: "How do we ensure he doesn't suspect anything before Friday afternoon?",
        ideal: "We can schedule a fake retrospective meeting in conference room B on his calendar, so he shows up unsuspecting.",
        keywords: [
          { phrase: "schedule a fake meeting", hintFa: "(تنظیم یک جلسه صوری در تقویم)", weight: 30 },
          { phrase: "unsuspecting", hintFa: "(بدون کوچک‌ترین شک و گمان)", weight: 30 },
        ],
        vocabUpgrade: {
          learner: "We say meeting room B he think real",
          native: "A decoy calendar invite will ensure his punctual attendance without raising eyebrows",
          noteFa: "کلمه 'unsuspecting' یا 'decoy' استراتژی غافلگیری را نشان می‌دهد.",
        },
      },
      {
        speakerName: "Co-worker Nora",
        roleFa: "همکار تیم",
        speakerAvatar: "🎉",
        charPrompt: "Brilliant strategy! I'll order the customized cake and you can collect contributions for his gift.",
        ideal: "Deal! I'll set up a discreet digital pool for team contributions right now.",
        keywords: [
          { phrase: "discreet digital pool", hintFa: "(صندوق دیجیتال محرمانه برای جمع‌آوری دانگ)", weight: 35 },
          { phrase: "contributions", hintFa: "(مشارکت‌ها و هدایا)", weight: 20 },
        ],
        vocabUpgrade: {
          learner: "I take money from team for buy present",
          native: "I'll discreetly coordinate the team gift fund",
          noteFa: "کلمه 'discreet' یعنی محرمانه و بدون سروصدا، عالی برای موقعیت غافلگیری.",
        },
      },
    ],
  },
  {
    titleFa: "مرحله پایانی B1: مذاکره شرایط کاری و پروژه‌ای",
    titleEn: "B1 Boss Level: Freelance Contract Negotiation",
    scenarioFa: "کارفرما برای یک پروژه فشرده تقاضای تخفیف ۲۰ درصدی دارد. باید ارزش تخصصت را توجیه کنی و مرزها را حفظ کنی.",
    locationContextFa: "اتاق کنفرانس زوم با کارفرمای کانادایی",
    turns: [
      {
        speakerName: "Client Mark",
        roleFa: "کارفرمای کانادایی",
        speakerAvatar: "💼",
        charPrompt: "We love your portfolio, but our budget is tight. Could you reduce your quotation by twenty percent?",
        ideal: "I appreciate your budget constraints, Mark. However, reducing the rate by twenty percent would require scaling back key deliverables.",
        keywords: [
          { phrase: "budget constraints", hintFa: "(محدودیت‌های بودجه)", weight: 30 },
          { phrase: "scaling back key deliverables", hintFa: "(کاهش تعهدات و خروجی‌های کلیدی)", weight: 35 },
        ],
        vocabUpgrade: {
          learner: "I cannot do 20 discount because less work",
          native: "A twenty percent rate reduction would inevitably compromise the scope of work",
          noteFa: "ترکیب 'scaling back key deliverables' مذاکره حرفه‌ای بین‌المللی است.",
        },
      },
      {
        speakerName: "Client Mark",
        roleFa: "کارفرمای کانادایی",
        speakerAvatar: "💼",
        charPrompt: "We cannot afford to lose the automated testing suite and responsive mobile optimization.",
        ideal: "In that case, we can maintain the original scope if we break the project into two milestone payments to ease cash flow.",
        keywords: [
          { phrase: "maintain the original scope", hintFa: "(حفظ محدوده اولیه کار)", weight: 30 },
          { phrase: "milestone payments", hintFa: "(پرداخت‌های مرحله‌ای بر اساس پیشرفت)", weight: 30 },
        ],
        vocabUpgrade: {
          learner: "You pay in two times so easy money",
          native: "Staggering payments across milestones provides liquidity while preserving quality",
          noteFa: "اصطلاح 'milestone payments' استاندارد قراردادهای فریلنسری دنیاست.",
        },
      },
      {
        speakerName: "Client Mark",
        roleFa: "کارفرمای کانادایی",
        speakerAvatar: "💼",
        charPrompt: "That milestone structure addresses our financial concerns perfectly. You have yourself a deal!",
        ideal: "Excellent! I will draft the service level agreement and kick off development on Monday. Thrilled to partner with you!",
        keywords: [
          { phrase: "service level agreement", hintFa: "(توافق‌نامه سطح خدمات / قرارداد)", weight: 35 },
          { phrase: "Thrilled to partner with you", hintFa: "(بسیار مشتاق همکاری با شما هستم)", weight: 25 },
        ],
        vocabUpgrade: {
          learner: "Good I send contract paper start Monday",
          native: "Wonderful; I'll forward the formalized agreement so we can commence seamlessly",
          noteFa: "عبارت 'Thrilled to partner with you' حسن‌ختام فوق‌العاده سطح B1 است.",
        },
      },
    ],
  },
]);

// ---------------------------------------------------------
// B2 CURRICULUM DEFINITIONS
// ---------------------------------------------------------
export const B2_SPEAKING_MISSIONS = generateTierMissions("B2", [
  {
    titleFa: "مصاحبه شغلی: پاسخ به سوال نقاط ضعف و چالش‌ها",
    titleEn: "Job Interview: Overcoming Weaknesses",
    scenarioFa: "در مصاحبه شرکت فناوری پیشرو، مصاحبه‌کننده می‌پرسد: بزرگ‌ترین نقطه ضعف کاری‌ات چیست و چگونه مدیریتش کردی؟",
    locationContextFa: "اتاق مصاحبه گوگل زوریخ",
    turns: [
      {
        speakerName: "Hiring Manager",
        roleFa: "مدیر جذب استعداد",
        speakerAvatar: "👔",
        charPrompt: "Every candidate shares their accomplishments, but tell me: what is an authentic professional weakness you've actively mitigated?",
        ideal: "Early in my career, I struggled with delegation because I was overly perfectionist. I've since learned that empowering teammates yields superior outcomes.",
        keywords: [
          { phrase: "struggled with delegation", hintFa: "(با واگذاری کارها به دیگران چالش داشتم)", weight: 35 },
          { phrase: "empowering teammates", hintFa: "(توانمندسازی هم‌تیمی‌ها)", weight: 30 },
        ],
        vocabUpgrade: {
          learner: "I did all work alone because I want perfect",
          native: "I had a propensity to micromanage, which I countered by instituting transparent trust frameworks",
          noteFa: "عبارت 'struggled with delegation' هوشمندانه و نشان‌دهنده بینش خودشناسی است.",
        },
      },
      {
        speakerName: "Hiring Manager",
        roleFa: "مدیر جذب استعداد",
        speakerAvatar: "👔",
        charPrompt: "Can you give a concrete example of how that shift prevented a crisis under intense deadline pressure?",
        ideal: "During a major software release, I delegated the QA regression testing to junior engineers while I focused on architectural stability, delivering on time.",
        keywords: [
          { phrase: "QA regression testing", hintFa: "(تست‌های رگرسیون کیفی)", weight: 25 },
          { phrase: "delivering on time", hintFa: "(تحویل سروقت)", weight: 25 },
        ],
        vocabUpgrade: {
          learner: "In big project I give work to juniors and I do main part",
          native: "I entrusted critical verification to rising talent while stewarding system resilience",
          noteFa: "روش STAR (Situation, Task, Action, Result) در این پاسخ رعایت شده است.",
        },
      },
      {
        speakerName: "Hiring Manager",
        roleFa: "مدیر جذب استعداد",
        speakerAvatar: "👔",
        charPrompt: "That demonstrates remarkable maturity and leadership potential. We highly value self-reflective professionals here.",
        ideal: "Thank you. Continuous self-awareness and iterative personal growth are principles I prioritize every single day.",
        keywords: [
          { phrase: "Continuous self-awareness", hintFa: "(خودآگاهی مداوم)", weight: 35 },
          { phrase: "iterative personal growth", hintFa: "(رشد فردی تدریجی و مداوم)", weight: 30 },
        ],
        vocabUpgrade: {
          learner: "Thanks I like to learn and get better every day",
          native: "I believe reflective adaptation is the cornerstone of sustainable leadership",
          noteFa: "کلمه 'iterative personal growth' نگرش چابک (Agile) شما به رشد را نشان می‌دهد.",
        },
      },
    ],
  },
  {
    titleFa: "پرزنت و دفاع از کمپین بازاریابی در اتاق کنفرانس",
    titleEn: "Pitching an Avant-Garde Marketing Campaign",
    scenarioFa: "در حال ارائه یک استراتژی تبلیغاتی خلاقانه و داده‌محور به مدیر ارشد بازاریابی هستی که در مورد بودجه محتاط است.",
    locationContextFa: "اتاق کنفرانس شرکت نیویورک",
    turns: [
      {
        speakerName: "CMO Rachel",
        roleFa: "مدیر ارشد بازاریابی",
        speakerAvatar: "👩‍💼",
        charPrompt: "Your proposal allocates forty percent of our quarterly budget to micro-influencer storytelling. Isn't that extraordinarily risky compared to paid search?",
        ideal: "While paid search captures existing intent, micro-influencer storytelling generates authentic demand and emotional brand affinity among Gen-Z cohorts.",
        keywords: [
          { phrase: "captures existing intent", hintFa: "(تقاضای موجود را جذب می‌کند)", weight: 35 },
          { phrase: "brand affinity", hintFa: "(تعلق خاطر و دلبستگی به برند)", weight: 30 },
        ],
        vocabUpgrade: {
          learner: "Google ads is for people who search, but influencers make new love for brand",
          native: "Paid search merely captures commoditized traffic, whereas creator narratives cultivate organic brand advocacy",
          noteFa: "تفکیک 'capturing intent vs generating demand' نبوغ بازاریابی مدرن است.",
        },
      },
      {
        speakerName: "CMO Rachel",
        roleFa: "مدیر ارشد بازاریابی",
        speakerAvatar: "👩‍💼",
        charPrompt: "How do you propose we quantify the return on ad spend without relying on vanity metrics like impressions?",
        ideal: "We will implement personalized UTM referral codes and track downstream conversion velocities rather than surface-level vanity metrics.",
        keywords: [
          { phrase: "downstream conversion velocities", hintFa: "(سرعت تبدیل کاربر در چرخه خرید)", weight: 35 },
          { phrase: "vanity metrics", hintFa: "(آمارهای پوشالی و توخالی)", weight: 30 },
        ],
        vocabUpgrade: {
          learner: "We don't count likes we count real buying with links",
          native: "We will establish closed-loop attribution tied directly to lifetime customer acquisition costs",
          noteFa: "اصطلاح 'vanity metrics' در بیزینس برای لایک‌ها و ایمپرشن‌های بی‌ارزش به کار می‌رود.",
        },
      },
      {
        speakerName: "CMO Rachel",
        roleFa: "مدیر ارشد بازاریابی",
        speakerAvatar: "👩‍💼",
        charPrompt: "Compelling thesis. Let's greenlight a pilot phase across three test markets to validate your assumptions.",
        ideal: "I welcome that empirical approach. We will deliver the pilot benchmark data within four weeks. Thank you, Rachel!",
        keywords: [
          { phrase: "empirical approach", hintFa: "(رویکرد مبتنی بر تجربه و داده‌های واقعی)", weight: 35 },
          { phrase: "validate assumptions", hintFa: "(سنجش و اثبات فرضیات)", weight: 25 },
        ],
        vocabUpgrade: {
          learner: "Good we test 3 markets I show you good numbers",
          native: "A pilot rollout is the most prudent strategy to de-risk our investment before full-scale deployment",
          noteFa: "کلمه 'empirical approach' وزن استدلال شما را چند برابر می‌کند.",
        },
      },
    ],
  },
  {
    titleFa: "مدیریت بحران شکایت مشتری خشمگین سازمانی",
    titleEn: "De-escalating an Enterprise Client Crisis",
    scenarioFa: "سرور اختصاصی شرکت سازمانی به مدت ۴ ساعت از دسترس خارج شده و مدیرعامل آن‌ها به شدت برافروخته است.",
    locationContextFa: "اتاق بحران روابط با مشتریان سازمانی",
    turns: [
      {
        speakerName: "Client CEO Marcus",
        roleFa: "مدیرعامل شرکت زیان‌دیده",
        speakerAvatar: "😡",
        charPrompt: "Our transactions were paralyzed for four consecutive hours during peak trading! This catastrophic breach of SLA is unacceptable!",
        ideal: "Marcus, I wholeheartedly acknowledge the severity of this disruption and the unacceptable financial strain it caused your operations.",
        keywords: [
          { phrase: "wholeheartedly acknowledge", hintFa: "(با تمام وجود فاجعه را تصدیق و درک می‌کنم)", weight: 35 },
          { phrase: "financial strain", hintFa: "(فشار مالی سنگین)", weight: 25 },
        ],
        vocabUpgrade: {
          learner: "I am very sorry for server down and lost money",
          native: "We take full accountability for this outage and the disruption inflicted upon your enterprise",
          noteFa: "تایید احساسات بدون توجیه و بهانه‌تراشی، قانون اول مهار بحران (De-escalation) است.",
        },
      },
      {
        speakerName: "Client CEO Marcus",
        roleFa: "مدیرعامل شرکت زیان‌دیده",
        speakerAvatar: "😡",
        charPrompt: "Empty apologies don't recover lost trading revenue! What safeguards are being implemented right now?",
        ideal: "Our root-cause analysis pinpointed a redundant failover latency. We are deploying multi-region automated replication to guarantee zero single-points of failure.",
        keywords: [
          { phrase: "root-cause analysis", hintFa: "(تحلیل ریشه‌ای و بنیادین حادثه)", weight: 35 },
          { phrase: "single-points of failure", hintFa: "(نقاط منفرد آسیب‌پذیری و خرابی)", weight: 30 },
        ],
        vocabUpgrade: {
          learner: "We find problem and put more servers so never happen again",
          native: "A comprehensive post-mortem identified the failover bottleneck; architectural redundancy is already in flight",
          noteFa: "اصطلاحات 'root-cause analysis' و 'failover' اطمینان مهندسی ایجاد می‌کنند.",
        },
      },
      {
        speakerName: "Client CEO Marcus",
        roleFa: "مدیرعامل شرکت زیان‌دیده",
        speakerAvatar: "😐",
        charPrompt: "I expect a formal post-mortem report and contractual service credits by tomorrow noon.",
        ideal: "You have my personal commitment. The exhaustive technical report and complete SLA credits will be in your inbox by 11:00 AM.",
        keywords: [
          { phrase: "personal commitment", hintFa: "(تعهد و ضمانت شخصی من)", weight: 25 },
          { phrase: "exhaustive technical report", hintFa: "(گزارش فنی جامع و همه‌جانبه)", weight: 35 },
        ],
        vocabUpgrade: {
          learner: "I send paper and money discount tomorrow 11 AM",
          native: "I will personally oversee the delivery of the post-mortem and credit disbursement ahead of schedule",
          noteFa: "گفتن 'You have my personal commitment' اعتماد مشتری از دست رفته را برمی‌گرداند.",
        },
      },
    ],
  },
  {
    titleFa: "دفاع از طرح بهینه‌سازی بودجه در جلسه هیئت‌مدیره",
    titleEn: "Defending Operational Cost Optimization",
    scenarioFa: "طرحی برای کاهش هزینه‌های اداری و هدایت سرمایه به سمت هوش مصنوعی و اتوماسیون به هیئت‌مدیره پیشنهاد داده‌ای.",
    locationContextFa: "اتاق هیئت‌مدیره شرکت لندن",
    turns: [
      {
        speakerName: "Board Member Arthur",
        roleFa: "عضو ارشد هیئت‌مدیره",
        speakerAvatar: "🧐",
        charPrompt: "Slashing travel budgets by thirty percent might demoralize our international sales pipeline. How do you justify this restructuring?",
        ideal: "This is not cost-cutting for its own sake, Arthur; it's capital reallocation toward asynchronous closing tools that double our meeting bandwidth.",
        keywords: [
          { phrase: "capital reallocation", hintFa: "(تخصیص مجدد و هوشمندانه سرمایه)", weight: 35 },
          { phrase: "asynchronous closing tools", hintFa: "(ابزارهای ناهمگام نهایی‌سازی معاملات)", weight: 30 },
        ],
        vocabUpgrade: {
          learner: "We don't just cut money, we put money into computers to sell faster",
          native: "This represents strategic resource redirection, modernizing our outreach while preserving margins",
          noteFa: "استفاده از 'capital reallocation' تفاوت مدیر ناشی با مدیر استراتژیک است.",
        },
      },
      {
        speakerName: "Board Member Arthur",
        roleFa: "عضو ارشد هیئت‌مدیره",
        speakerAvatar: "🧐",
        charPrompt: "Can technology truly replicate the interpersonal rapport built during in-person executive dinners?",
        ideal: "While high-touch interactions remain essential for flagship deals, eighty percent of mid-tier renewals achieve higher velocity digitally.",
        keywords: [
          { phrase: "high-touch interactions", hintFa: "(تعاملات رودررو و صمیمانه سطح بالا)", weight: 35 },
          { phrase: "higher velocity digitally", hintFa: "(سرعت بالاتر از طریق دیجیتال)", weight: 25 },
        ],
        vocabUpgrade: {
          learner: "Dinner is good for big clients, but normal clients like fast online meetings",
          native: "Face-to-face engagements should be reserved for Tier-1 partnerships where capital expenditure is warranted",
          noteFa: "اصطلاح 'high-touch vs high-velocity' تسلط بیزینسی عمیق را نشان می‌دهد.",
        },
      },
      {
        speakerName: "Board Member Arthur",
        roleFa: "عضو ارشد هیئت‌مدیره",
        speakerAvatar: "🧐",
        charPrompt: "A nuanced distinction. If the quarterly metrics uphold this hypothesis, I will sponsor the motion.",
        ideal: "I appreciate your judicious oversight. We will track every conversion cohort meticulously and present the outcomes in Q3.",
        keywords: [
          { phrase: "judicious oversight", hintFa: "(نظارت هوشمندانه و خردمندانه)", weight: 35 },
          { phrase: "track meticulously", hintFa: "(ردیابی فوق‌العاده دقیق)", weight: 25 },
        ],
        vocabUpgrade: {
          learner: "Thanks Arthur we look at numbers very good and show you",
          native: "Thank you for the rigorous scrutiny; we will uphold the highest standards of accountability",
          noteFa: "ترکیب 'judicious oversight' نشان‌دهنده احترام سازمانی سطح بالاست.",
        },
      },
    ],
  },
  {
    titleFa: "مذاکره حقوق و مزایای تکمیلی با مدیر منابع انسانی",
    titleEn: "Negotiating Compensation Package & Equity",
    scenarioFa: "پیشنهاد کاری فوق‌العاده‌ای دریافت کرده‌ای اما حقوق پایه و سهمام سهام (Equity) نیاز به چانه‌زنی حرفه‌ای دارد.",
    locationContextFa: "دفتر منابع انسانی شرکت دوبلین",
    turns: [
      {
        speakerName: "HR Director Liam",
        roleFa: "مدیر منابع انسانی",
        speakerAvatar: "👨‍💼",
        charPrompt: "We are thrilled to offer you the Lead Architect role at €95,000 base. Are you ready to sign the formal offer?",
        ideal: "Thank you Liam! I am thrilled about the opportunity. However, benchmark data for this scope indicates a competitive range closer to €110,000.",
        keywords: [
          { phrase: "benchmark data indicates", hintFa: "(داده‌های شاخص بازار نشان می‌دهد که...)", weight: 35 },
          { phrase: "competitive range", hintFa: "(بازه رقابتی حقوق)", weight: 25 },
        ],
        vocabUpgrade: {
          learner: "I want 110,000 because market pays more",
          native: "Given the specialized architectural mandate, industry compensation metrics calibrate nearer to €110,000",
          noteFa: "ارجاع به داده‌های بازار 'benchmark data' مانع از شخصی شدن مذاکره می‌شود.",
        },
      },
      {
        speakerName: "HR Director Liam",
        roleFa: "مدیر منابع انسانی",
        speakerAvatar: "👨‍💼",
        charPrompt: "Our base salary bands are strictly capped by corporate governance for this bracket.",
        ideal: "I understand organizational constraints. Could we bridge that difference through performance-linked bonuses or accelerated equity vesting?",
        keywords: [
          { phrase: "bridge that difference", hintFa: "(پر کردن این فاصله و اختلاف)", weight: 30 },
          { phrase: "accelerated equity vesting", hintFa: "(واگذاری سریع‌تر سهام تشویقی)", weight: 35 },
        ],
        vocabUpgrade: {
          learner: "If no money, give me more company stock or bonus",
          native: "Can we compensate for base constraints via an expanded equity grant or a milestone sign-on bonus?",
          noteFa: "اصطلاح 'bridge the difference' و 'equity vesting' فن مذاکره مدیران ارشد است.",
        },
      },
      {
        speakerName: "HR Director Liam",
        roleFa: "مدیر منابع انسانی",
        speakerAvatar: "👨‍💼",
        charPrompt: "That flexibility is viable. We can enhance the equity allocation by fifteen percent and include a €10,000 signing bonus.",
        ideal: "That aligns wonderfully with my expectations and demonstrates strong commitment. I accept the revised terms with enthusiasm!",
        keywords: [
          { phrase: "aligns wonderfully with", hintFa: "(کاملاً هم‌راستا با انتظارات من است)", weight: 30 },
          { phrase: "revised terms", hintFa: "(شرایط اصلاح‌شده و جدید)", weight: 25 },
        ],
        vocabUpgrade: {
          learner: "Yes very good I sign now thanks",
          native: "That package reflects the value I intend to deliver; I am excited to execute the agreement",
          noteFa: "تایید پیروزمندانه و حرفه‌ای مذاکره در پایان راند.",
        },
      },
    ],
  },
  {
    titleFa: "ارائه نتایج پژوهش در سمینار بین‌المللی",
    titleEn: "Delivering Keynote Research Insights",
    scenarioFa: "در کنفرانس بین‌المللی لندن یافته‌های مقاله پژوهشی در حوزه بهره‌وری هوش مصنوعی را ارائه می‌دهی و به سوالات حضار پاسخ می‌دهی.",
    locationContextFa: "سالن همایش‌های بین‌المللی کمبریج",
    turns: [
      {
        speakerName: "Academic Chair",
        roleFa: "رئیس نشست علمی",
        speakerAvatar: "🎓",
        charPrompt: "Dr. Reed, your findings claim that human-in-the-loop validation reduces hallucination rates by seventy percent. What methodology underpinned this?",
        ideal: "We conducted a double-blind empirical trial across ten thousand prompts, isolating cognitive friction and factual retrieval benchmarks.",
        keywords: [
          { phrase: "double-blind empirical trial", hintFa: "(آزمایش تجربی دوسوکور علمی)", weight: 35 },
          { phrase: "factual retrieval benchmarks", hintFa: "(معیارهای بازیابی اطلاعات واقعی)", weight: 30 },
        ],
        vocabUpgrade: {
          learner: "We tested 10,000 questions with two groups without knowing",
          native: "Our methodology relied on rigorous double-blind evaluation controlling for confirmation bias",
          noteFa: "عبارت 'double-blind empirical trial' اعتبار علمی مطلق به سخن می‌بخشد.",
        },
      },
      {
        speakerName: "Academic Chair",
        roleFa: "رئیس نشست علمی",
        speakerAvatar: "🎓",
        charPrompt: "Does that human cognitive overhead negate the computational cost advantages in high-throughput enterprise pipelines?",
        ideal: "On the contrary; targeted selective verification concentrates human attention on edge cases, yielding optimal cost-to-accuracy efficiency.",
        keywords: [
          { phrase: "On the contrary", hintFa: "(برعکس / درست نقطه مقابل آن)", weight: 25 },
          { phrase: "concentrates human attention", hintFa: "(تمرکز توجه انسانی روی موارد لبه و حساس)", weight: 35 },
        ],
        vocabUpgrade: {
          learner: "No, humans only look at hard questions so it is fast and cheap",
          native: "Selective human gating operates exclusively on high-entropy queries, minimizing overhead",
          noteFa: "شروع جمله با 'On the contrary' در مناظرات علمی لحن استادی دارد.",
        },
      },
      {
        speakerName: "Academic Chair",
        roleFa: "رئیس نشست علمی",
        speakerAvatar: "🎓",
        charPrompt: "A profoundly insightful defense. We look forward to reading the peer-reviewed preprint next month.",
        ideal: "Thank you for the stimulating questions. I welcome further discourse during the collaborative networking break.",
        keywords: [
          { phrase: "stimulating questions", hintFa: "(سوالات برانگیزاننده و ژرف)", weight: 30 },
          { phrase: "collaborative networking", hintFa: "(شبکه‌سازی و تعامل علمی مشترک)", weight: 30 },
        ],
        vocabUpgrade: {
          learner: "Thanks for questions see you outside in coffee time",
          native: "I deeply appreciate the scholarly exchange and invite continued dialogue over coffee",
          noteFa: "ترکیب 'stimulating questions' بهترین تعارف در محافل آکادمیک است.",
        },
      },
    ],
  },
  {
    titleFa: "میزگرد محیط‌زیست: استدلال برای انرژی‌های پاک",
    titleEn: "Defending Renewable Transition in a Policy Forum",
    scenarioFa: "در یک پنل سیاست‌گذاری انرژی با نماینده صنایع نفت و گاز درباره توجیه اقتصادی انرژی خورشیدی مباحثه می‌کنی.",
    locationContextFa: "تالار شورای شهر استکهلم",
    turns: [
      {
        speakerName: "Industry Lobbyist",
        roleFa: "نماینده صنایع سنتی",
        speakerAvatar: "🏭",
        charPrompt: "Intermittent renewables destabilize the grid! Transitioning too rapidly will trigger power shortages and economic recession.",
        ideal: "Grid stability concerns are legitimate, yet modern battery storage economics have dropped eighty percent, rendering baseload renewables commercially viable.",
        keywords: [
          { phrase: "Grid stability concerns", hintFa: "(نگرانی‌های پایداری شبکه برق)", weight: 30 },
          { phrase: "commercially viable", hintFa: "(از نظر تجاری کاملاً مقرون‌به‌صرفه و امکان‌پذیر)", weight: 35 },
        ],
        vocabUpgrade: {
          learner: "Grid is okay because batteries are cheap now and make energy work",
          native: "Grid volatility is mitigated by exponential advancements in utility-scale energy storage",
          noteFa: "پاسخ به ادعای حریف با داده‌های هزینه‌ای 'commercially viable'.",
        },
      },
      {
        speakerName: "Industry Lobbyist",
        roleFa: "نماینده صنایع سنتی",
        speakerAvatar: "🏭",
        charPrompt: "Who pays for the multi-trillion dollar infrastructure retrofitting? Everyday taxpayers?",
        ideal: "The transition is largely funded by private green capital seeking long-term yield; the real liability lies in stranded fossil fuel assets.",
        keywords: [
          { phrase: "funded by private green capital", hintFa: "(تامین مالی توسط سرمایه‌گذاران خصوصی سبز)", weight: 35 },
          { phrase: "stranded fossil fuel assets", hintFa: "(دارایی‌های راکد و زیان‌بار سوخت‌های فسیلی)", weight: 35 },
        ],
        vocabUpgrade: {
          learner: "Taxpayers don't pay, private companies pay and oil plants lose value",
          native: "Private equity is driving deployment; fossil dependency poses far greater fiscal exposure",
          noteFa: "اصطلاح 'stranded assets' شمشیر برنده مباحثات اقتصادی محیط‌زیست است.",
        },
      },
      {
        speakerName: "Industry Lobbyist",
        roleFa: "نماینده صنایع سنتی",
        speakerAvatar: "🏭",
        charPrompt: "Your economic rationale holds weight, provided regulatory incentives remain predictable.",
        ideal: "Bipartisan regulatory consistency is indeed vital. Predictability ensures private industry innovates and accelerates decarbonization sustainably.",
        keywords: [
          { phrase: "regulatory consistency", hintFa: "(ثبات و یکپارچگی قوانین و مقررات)", weight: 35 },
          { phrase: "accelerates decarbonization", hintFa: "(تسریع کاهش انتشار کربن)", weight: 25 },
        ],
        vocabUpgrade: {
          learner: "Yes government must keep rules steady so business can build fast",
          native: "Policy certainty is the catalyst that unleashes private market transition at scale",
          noteFa: "کلمه 'regulatory consistency' کلام شما را به سطح سیاست‌مداران دیپلماتیک می‌رساند.",
        },
      },
    ],
  },
  {
    titleFa: "مشاوره راهبردی تغییر مسیر شغلی به حوزه هوش مصنوعی",
    titleEn: "Coaching a Pivot into AI Engineering",
    scenarioFa: "به عنوان یک مشاور شغلی ارشد، به یک مدیر محصول سنتی راهنمایی می‌دهی که چگونه بدون هراس وارد دنیای AI شود.",
    locationContextFa: "جلسه مشاوره اختصاصی زوم",
    turns: [
      {
        speakerName: "Product Lead Mark",
        roleFa: "مدیر محصول",
        speakerAvatar: "👨‍💻",
        charPrompt: "I have ten years of product management experience, but with AI transforming everything, I fear becoming obsolete. Where do I even begin?",
        ideal: "You don't need to reinvent yourself as a machine learning researcher; your superpower lies in translating probabilistic AI capabilities into tangible user value.",
        keywords: [
          { phrase: "reinvent yourself as", hintFa: "(از نو بازتعریف کردن خود)", weight: 25 },
          { phrase: "probabilistic AI capabilities", hintFa: "(توانمندی‌های احتمالی و غیرقطعی هوش مصنوعی)", weight: 35 },
        ],
        vocabUpgrade: {
          learner: "Don't be scared to learn math, just use AI for good products",
          native: "Do not view AI as a replacement, but as an expansive capability multiplier for product intuition",
          noteFa: "تعبیر 'probabilistic capabilities vs deterministic software' نگاه ژرف به فناوری است.",
        },
      },
      {
        speakerName: "Product Lead Mark",
        roleFa: "مدیر محصول",
        speakerAvatar: "👨‍💻",
        charPrompt: "What practical technical literacy must I acquire to effectively steer an engineering squad building with LLMs?",
        ideal: "Master latency tradeoffs, token economics, evaluation harness frameworks, and prompt orchestration. Understanding system constraints is enough to lead.",
        keywords: [
          { phrase: "latency tradeoffs", hintFa: "(تعادل میان تاخیر و سرعت)", weight: 30 },
          { phrase: "evaluation harness frameworks", hintFa: "(چارچوب‌های سنجش و ارزیابی کیفیت مدل)", weight: 35 },
        ],
        vocabUpgrade: {
          learner: "Learn how fast models are, how much tokens cost, and how to test answers",
          native: "Develop fluency in inference economics, observability, and deterministic benchmark gating",
          noteFa: "واژگان 'token economics' و 'evaluation harness' قلب مهندسی نوین محصول هستند.",
        },
      },
      {
        speakerName: "Product Lead Mark",
        roleFa: "مدیر محصول",
        speakerAvatar: "👨‍💻",
        charPrompt: "That demystifies the entire landscape for me. I feel revitalized and ready to take action!",
        ideal: "Action cures apprehension. Build a tiny generative prototype this weekend; nothing builds intuitive mastery faster than shipping.",
        keywords: [
          { phrase: "Action cures apprehension", hintFa: "(اقدام و عمل، درمان ترس و دودلی است)", weight: 35 },
          { phrase: "intuitive mastery", hintFa: "(تسلط شهودی و درونی)", weight: 25 },
        ],
        vocabUpgrade: {
          learner: "Don't worry just build something small Saturday you will learn fast",
          native: "Execution dismantles doubt; prototype an idea immediately to anchor theoretical comprehension",
          noteFa: "ضرب‌المثل کاربردی و پرانرژی 'Action cures apprehension' الهام‌بخش است.",
        },
      },
    ],
  },
  {
    titleFa: "توضیح تفاوت‌های فرهنگی و برطرف کردن سوءتفاهم",
    titleEn: "Navigating Cross-Cultural Workplace Dynamics",
    scenarioFa: "در یک تیم چندملیتی، سبک صحبت مستقیم یک عضو هلندی با سکوت یک عضو ژاپنی سوءتفاهم ایجاد کرده است؛ مداخله کن.",
    locationContextFa: "جلسه هم‌افزایی تیم بین‌المللی",
    turns: [
      {
        speakerName: "Project Sponsor",
        roleFa: "مدیر ارشد پروژه",
        speakerAvatar: "🌐",
        charPrompt: "We are sensing friction in daily standups. Some interpret direct criticism as personal disrespect, while others see silence as disinterest.",
        ideal: "This is a classic divergence between high-context and low-context communication paradigms rather than ill intent or incompetence.",
        keywords: [
          { phrase: "high-context and low-context", hintFa: "(ارتباطات بسترمحور و صریح)", weight: 35 },
          { phrase: "communication paradigms", hintFa: "(الگوهای ارتباطی فرهنگی)", weight: 30 },
        ],
        vocabUpgrade: {
          learner: "People from different countries talk different, they don't mean bad things",
          native: "This friction stems from culturally conditioned communication norms rather than malicious intent",
          noteFa: "تئوری 'high-context vs low-context' ارین میر (The Culture Map) ابزار مدیران زبده است.",
        },
      },
      {
        speakerName: "Project Sponsor",
        roleFa: "مدیر ارشد پروژه",
        speakerAvatar: "🌐",
        charPrompt: "What operational norms can we codify so everyone feels both intellectually safe and culturally respected?",
        ideal: "We should institute asynchronous written feedback rounds before live meetings and explicit turn-taking to give quieter perspectives space to thrive.",
        keywords: [
          { phrase: "asynchronous written feedback", hintFa: "(بازخورد متنی ناهمگام)", weight: 30 },
          { phrase: "explicit turn-taking", hintFa: "(نوبت‌دهی صریح برای صحبت همه اعضا)", weight: 35 },
        ],
        vocabUpgrade: {
          learner: "Let people write first and make sure everyone speaks one by one",
          native: "Implementing pre-meeting written briefs ensures inclusive participation regardless of cultural assertiveness",
          noteFa: "اصطلاح 'explicit turn-taking' راهکار استاندارد تنوع فرهنگی است.",
        },
      },
      {
        speakerName: "Project Sponsor",
        roleFa: "مدیر ارشد پروژه",
        speakerAvatar: "🌐",
        charPrompt: "That directly addresses the psychological safety void. Let's incorporate these protocols into our team charter.",
        ideal: "Cultural intelligence transforms diversity from a friction point into our strongest competitive advantage.",
        keywords: [
          { phrase: "Cultural intelligence", hintFa: "(هوش فرهنگی / CQ)", weight: 35 },
          { phrase: "competitive advantage", hintFa: "(مزیت رقابتی کلیدی)", weight: 25 },
        ],
        vocabUpgrade: {
          learner: "Good cultures make team strong not fighting",
          native: "Harnessing cognitive diversity is the hallmark of high-performing distributed organizations",
          noteFa: "ترکیب 'Cultural intelligence' مفهوم آکادمیک مدیریت مدرن است.",
        },
      },
    ],
  },
  {
    titleFa: "مرحله پایانی B2: کنفرانس مطبوعاتی فراخوان محصول",
    titleEn: "B2 Boss Level: High-Pressure PR Product Recall",
    scenarioFa: "به عنوان سخنگوی رسمی شرکت، باید در مقابل خبرنگاران تندرو فراخوان یک میلیون باتری معیوب را مدیریت کنی.",
    locationContextFa: "سالن کنفرانس مطبوعاتی توکیو",
    turns: [
      {
        speakerName: "Journalist Adams",
        roleFa: "خبرنگار سمج رویترز",
        speakerAvatar: "📸",
        charPrompt: "Did your leadership willfully conceal battery overheating reports for three weeks before issuing this voluntary recall?",
        ideal: "Unequivocally no. The moment telemetry data verified anomalous thermal spikes, we halted shipments and notified international safety regulators.",
        keywords: [
          { phrase: "Unequivocally no", hintFa: "(قاطعانه و بی‌چون‌وچرا خیر)", weight: 35 },
          { phrase: "anomalous thermal spikes", hintFa: "(افزایش ناگهانی و غیرعادی حرارت)", weight: 35 },
        ],
        vocabUpgrade: {
          learner: "No we did not hide it, when battery hot we stopped all",
          native: "We categorically refute that allegation; the instant telemetry indicated risk, consumer safety took precedence",
          noteFa: "پاسخ مقتدرانه با 'Unequivocally no' شایعات را در نطفه خاموش می‌کند.",
        },
      },
      {
        speakerName: "Journalist Adams",
        roleFa: "خبرنگار سمج رویترز",
        speakerAvatar: "📸",
        charPrompt: "How can consumers ever trust your flagship brand again when millions of devices pose potential fire hazards?",
        ideal: "Trust is rebuilt through transparent accountability. We are offering immediate free replacements and a complimentary warranty extension for all affected owners.",
        keywords: [
          { phrase: "transparent accountability", hintFa: "(پاسخگویی شفاف و همگانی)", weight: 35 },
          { phrase: "free replacements", hintFa: "(تعویض رایگان دستگاه‌ها)", weight: 25 },
        ],
        vocabUpgrade: {
          learner: "We give free new batteries and more warranty so people like us",
          native: "Reputation is restored through decisive remediation; our proactive exchange program ensures zero consumer loss",
          noteFa: "اصطلاح 'transparent accountability' واژه طلایی روابط‌عمومی بحران است.",
        },
      },
      {
        speakerName: "Journalist Adams",
        roleFa: "خبرنگار سمج رویترز",
        speakerAvatar: "📸",
        charPrompt: "Will corporate executives forfeit their annual bonuses over this multimillion-dollar quality oversight?",
        ideal: "Our executive compensation committee has unanimously tied leadership remuneration to quality compliance milestones moving forward. Thank you for your questions.",
        keywords: [
          { phrase: "unanimously tied", hintFa: "(به اتفاق آرا پیوند زده است)", weight: 35 },
          { phrase: "quality compliance milestones", hintFa: "(اهداف انطباق کیفی)", weight: 30 },
        ],
        vocabUpgrade: {
          learner: "Bosses will not get bonus until quality is fixed and safe",
          native: "Leadership compensation has been restructured to strictly penalize quality deficits",
          noteFa: "پاسخ قاطع و مسئولانه، پرونده کنفرانس مطبوعاتی سطح B2 را می‌بندد.",
        },
      },
    ],
  },
]);

// ---------------------------------------------------------
// C1 CURRICULUM DEFINITIONS
// ---------------------------------------------------------
export const C1_SPEAKING_MISSIONS = generateTierMissions("C1", [
  {
    titleFa: "اتاق بحران روابط‌عمومی: افشای اطلاعات محرمانه کاربران",
    titleEn: "Crisis PR: Mitigating a Hostile Cybersecurity Breach",
    scenarioFa: "داده‌های مشتریان نشت کرده و خبرنگاران بازپرس اصرار دارند که پروتکل‌های امنیتی شما ضعیف بوده است؛ زیر فشار خونسرد بمان.",
    locationContextFa: "اتاق وضعیت اضطراری روابط عمومی سیلیکون‌ولی",
    turns: [
      {
        speakerName: "Investigative Reporter",
        roleFa: "خبرنگار تحقیقی",
        speakerAvatar: "🎙️",
        charPrompt: "Whistleblowers allege your infrastructure was unpatched for eight months prior to this exfiltration. How do you defend that negligence?",
        ideal: "I unequivocally reject the premise of systemic negligence. While an anomalous zero-day vector was exploited, our cryptographic defense isolated all payment data.",
        keywords: [
          { phrase: "unequivocally reject the premise", hintFa: "(قاطعانه فرض و اتهام مطرح شده را رد می‌کنم)", weight: 40 },
          { phrase: "anomalous zero-day vector", hintFa: "(حمله از طریق حفره امنیتی روز-صفر)", weight: 35 },
        ],
        vocabUpgrade: {
          learner: "We were not lazy, it was a very new hack and cards are safe",
          native: "I repudiate the accusation of complacency; our zero-trust architecture successfully quarantined core financial ledgers",
          noteFa: "عبارت 'I reject the premise' پاسخ دیپلماتیک مسلط به سوالات زهرآگین است.",
        },
      },
      {
        speakerName: "Investigative Reporter",
        roleFa: "خبرنگار تحقیقی",
        speakerAvatar: "🎙️",
        charPrompt: "If the breach was contained, why did your stock valuation plunge twelve percent within forty-eight hours?",
        ideal: "Market sentiment fluctuates in the immediate wake of incomplete disclosures; our forthcoming independent forensic audit will anchor investor certainty.",
        keywords: [
          { phrase: "Market sentiment fluctuates", hintFa: "(احساسات بازار دچار نوسان موقت می‌شود)", weight: 35 },
          { phrase: "independent forensic audit", hintFa: "(حسابرسی مستقل قانونی-رایانه‌ای)", weight: 35 },
        ],
        vocabUpgrade: {
          learner: "Stock drops because people panic, but auditor will show truth",
          native: "Short-term volatility reflects speculative panic; third-party forensic verification will restore institutional confidence",
          noteFa: "استفاده از 'forensic audit' اعتماد سرمایه‌گذاران را بازمی‌گرداند.",
        },
      },
      {
        speakerName: "Investigative Reporter",
        roleFa: "خبرنگار تحقیقی",
        speakerAvatar: "🎙️",
        charPrompt: "Will your CEO testify under oath before the Congressional Commerce Committee next Wednesday?",
        ideal: "Our chief executive welcomes the opportunity to provide complete transparency and champion federal cybersecurity harmonization under sworn testimony.",
        keywords: [
          { phrase: "sworn testimony", hintFa: "(شهادت رسمی تحت سوگند)", weight: 35 },
          { phrase: "federal cybersecurity harmonization", hintFa: "(هماهنگ‌سازی استانداردهای سایبری فدرال)", weight: 35 },
        ],
        vocabUpgrade: {
          learner: "Yes CEO will go and answer all congress questions honestly",
          native: "Executive leadership stands eager to brief lawmakers and advocate for standardized threat-intelligence sharing",
          noteFa: "فرمول 'welcomes the opportunity' تهدید را به فرصت تبدیل می‌کند.",
        },
      },
    ],
  },
  {
    titleFa: "دفاع سرسختانه پایان‌نامه دکتری در برابر داوران",
    titleEn: "Defending Doctoral Methodology Against Fierce Skepticism",
    scenarioFa: "داور ارشد اعتبار شبیه‌سازی‌های مدل شما را به چالش می‌کشد؛ با استدلال علمی محکم پاسخ بده.",
    locationContextFa: "آمفی‌تئاتر دانشکده آکسفورد",
    turns: [
      {
        speakerName: "Lead External Examiner",
        roleFa: "داور ارشد بین‌المللی",
        speakerAvatar: "🧐",
        charPrompt: "Candidate, your dynamic stochastic general equilibrium model assumes frictionless labor markets—an absurdity in contemporary empirical macroeconomics!",
        ideal: "While stylized assumptions invariably introduce abstractions, our sensitivity perturbations demonstrated that endogenous wage rigidities do not alter the directional equilibrium.",
        keywords: [
          { phrase: "sensitivity perturbations", hintFa: "(آشفتگی‌ها و آزمون‌های حساسیت مدل)", weight: 40 },
          { phrase: "directional equilibrium", hintFa: "(تعادل جهت‌دار مدل)", weight: 35 },
        ],
        vocabUpgrade: {
          learner: "Yes it is simple assumption but when we test wages, result stays same",
          native: "The model deliberately abstracts frictional labor to isolate monetary transmission mechanisms without muddying causal inference",
          noteFa: "اصطلاحات 'sensitivity perturbations' و 'endogenous rigidities' اوج زبان آکادمیک C1 است.",
        },
      },
      {
        speakerName: "Lead External Examiner",
        roleFa: "داور ارشد بین‌المللی",
        speakerAvatar: "🧐",
        charPrompt: "How can you validate parameter calibrations when your historical dataset spans a period fraught with unreplicable quantitative easing?",
        ideal: "We neutralized macroeconomic distortions by applying state-space structural break filters and cross-validating across non-stimulus international regimes.",
        keywords: [
          { phrase: "state-space structural break filters", hintFa: "(فیلترهای شکست ساختاری فضای حالت)", weight: 40 },
          { phrase: "cross-validating across regimes", hintFa: "(اعتبارسنجی متقابل در رژیم‌های مختلف)", weight: 35 },
        ],
        vocabUpgrade: {
          learner: "We cleaned bad data using smart statistical filters from other countries",
          native: "We deployed econometric robustness checks to disentangle monetary anomalies from baseline elasticity",
          noteFa: "پاسخ متکی بر مبانی اقتصادسنجی پیشرفته است.",
        },
      },
      {
        speakerName: "Lead External Examiner",
        roleFa: "داور ارشد بین‌المللی",
        speakerAvatar: "🧐",
        charPrompt: "A formidable methodological defense. You have withstood the crucible of peer examination with distinction.",
        ideal: "I am profoundly grateful for your rigorous critique; interrogating edge cases has fortified the thesis immensely.",
        keywords: [
          { phrase: "profoundly grateful for", hintFa: "(عمیقاً سپاسگزارم برای...)", weight: 30 },
          { phrase: "fortified the thesis immensely", hintFa: "(پایان‌نامه را به مراتب مستحکم‌تر کرد)", weight: 40 },
        ],
        vocabUpgrade: {
          learner: "Thank you for tough questions it made my paper stronger",
          native: "I appreciate the intellectual rigor of this tribunal; it has crystallized the empirical scope of my research",
          noteFa: "استفاده از 'fortified the thesis' ادب علمی بی‌نظیر است.",
        },
      },
    ],
  },
  {
    titleFa: "استنطاق و بازجویی متقابل در دادگاه شبیه‌سازی‌شده",
    titleEn: "Simulated Courtroom Cross-Examination",
    scenarioFa: "به عنوان وکیل مدافع، در حال بازجویی از شاهد کلیدی دادستان هستی تا تناقضات اظهاراتش را فاش کنی.",
    locationContextFa: "دادگاه سلطنتی لندن",
    turns: [
      {
        speakerName: "Opposing Witness",
        roleFa: "شاهد کلیدی پرونده",
        speakerAvatar: "👤",
        charPrompt: "I am absolutely positive I saw the defendant exit the bank vault at precisely 11:15 PM holding the blue duffel bag!",
        ideal: "Yet on page forty-two of your sworn deposition, you explicitly attested that torrential rain obscured your visibility beyond five meters, did you not?",
        keywords: [
          { phrase: "sworn deposition", hintFa: "(شهادت‌نامه رسمی سوگندخورده)", weight: 40 },
          { phrase: "obscured your visibility", hintFa: "(دید شما را مخدوش و مسدود کرده بود)", weight: 35 },
        ],
        vocabUpgrade: {
          learner: "In your paper you wrote it was rain and you cannot see far away!",
          native: "Your current assertion stands in direct contradiction to your sworn pre-trial declaration regarding sightlines",
          noteFa: "تکنیک حقوقی 'Impeachment of a witness' با مواجهه تناقض متن شهادت‌نامه صورت می‌گیرد.",
        },
      },
      {
        speakerName: "Opposing Witness",
        roleFa: "شاهد کلیدی پرونده",
        speakerAvatar: "👤",
        charPrompt: "Well... the streetlights were flickering, but I recognized his gait and stature!",
        ideal: "So your unequivocal positive identification boils down to a fleeting glimpse under flickering illuminations amidst torrential downpours?",
        keywords: [
          { phrase: "fleeting glimpse", hintFa: "(نگاهی گذرا و چندثانیه‌ای)", weight: 35 },
          { phrase: "torrential downpours", hintFa: "(باران‌های سیل‌آسا)", weight: 35 },
        ],
        vocabUpgrade: {
          learner: "So you only saw him for one second in dark rain and you guess it was him?",
          native: "You concede, therefore, that your identification was speculative inference rather than unambiguous observation?",
          noteFa: "کلمه 'fleeting glimpse' پایه شهادت را متزلزل می‌کند.",
        },
      },
      {
        speakerName: "Judge Sterling",
        roleFa: "قاضی دادگاه",
        speakerAvatar: "⚖️",
        charPrompt: "Counsel, are you establishing that the eyewitness testimony fails the threshold of reasonable doubt?",
        ideal: "Precisely, Your Honor. The testimony is riddled with observational discrepancies and cannot sustain a burden of proof.",
        keywords: [
          { phrase: "Your Honor", hintFa: "(عالیجناب / جناب قاضی)", weight: 25 },
          { phrase: "burden of proof", hintFa: "(بار اثبات دعوی)", weight: 40 },
        ],
        vocabUpgrade: {
          learner: "Yes Judge, he has too many mistakes in story and cannot prove guilt",
          native: "Indeed, Your Honor; the fatal contradictions render this testimony legally insupportable",
          noteFa: "اصطلاح 'burden of proof' و 'Your Honor' ستون فقرات دادگاه‌های آنگلوساکسون است.",
        },
      },
    ],
  },
  {
    titleFa: "جلسه جذب سرمایه‌گذاری پرخطر در سیلیکون‌ولی",
    titleEn: "Venture Capital Pitch for Autonomous Biotech",
    scenarioFa: "در حال متقاعد کردن شرکای صندوق اندریسن هوروویتز برای هدایت ۲۰ میلیون دلار سرمایه سری A به سمت داروسازی هوش مصنوعی هستی.",
    locationContextFa: "سالن گردهمایی سند هیل رود کالیفرنیا",
    turns: [
      {
        speakerName: "Managing Partner",
        roleFa: "شریک ارشد صندوق سرمایه‌گذاری",
        speakerAvatar: "💼",
        charPrompt: "Generative biology has burned billions in cash with dismal Phase-2 clinical transition rates. What defensible moat protects your platform?",
        ideal: "Our moat is proprietary wet-lab closing loops; while rivals train on stale public corpora, our robotic synthesis synthesizes and validates molecules within eighteen hours.",
        keywords: [
          { phrase: "proprietary wet-lab closing loops", hintFa: "(حلقه‌های آزمایشگاهی اختصاصی با بازخورد زنده)", weight: 40 },
          { phrase: "defensible moat", hintFa: "(خندق دفاعی پایدار در برابر رقبا)", weight: 35 },
        ],
        vocabUpgrade: {
          learner: "We have robot lab that tests medicine in 18 hours so other companies cannot copy",
          native: "Our algorithmic moat is fortified by synthetic biology feedback loops that autonomously generate private training tokens",
          noteFa: "استفاده از 'defensible moat' و 'wet-lab loops' زبان مشترک سرمایه‌گذاران سیلیکون‌ولی است.",
        },
      },
      {
        speakerName: "Managing Partner",
        roleFa: "شریک ارشد صندوق سرمایه‌گذاری",
        speakerAvatar: "💼",
        charPrompt: "What prevents Big Pharma giants like Pfizer from replicating your pipeline with their bottomless balance sheets?",
        ideal: "Big Pharma suffers from legacy institutional silos and glacial decision cycles; our agile infrastructure deploys candidates ten times faster at a fraction of burn rate.",
        keywords: [
          { phrase: "legacy institutional silos", hintFa: "(سیلوها و ساختارهای جزیره‌ای سنتی سازمان)", weight: 40 },
          { phrase: "glacial decision cycles", hintFa: "(چرخه‌های تصمیم‌گیری بسیار کند و لاک‌پشتی)", weight: 35 },
        ],
        vocabUpgrade: {
          learner: "Pfizer is too slow and big with too many managers to move fast",
          native: "Incumbents are paralyzed by bureaucratic latency; our nimble paradigm out-iterates legacy drug discovery",
          noteFa: "ترکیب 'glacial decision cycles' تمثیل ادبی-کسب‌وکاری زیبایی است.",
        },
      },
      {
        speakerName: "Managing Partner",
        roleFa: "شریک ارشد صندوق سرمایه‌گذاری",
        speakerAvatar: "💼",
        charPrompt: "Your valuation trajectory is compelling. If we lead this round with fifteen million, are you prepared to surrender a board seat?",
        ideal: "We would welcome your operational expertise and governance on the board, provided super-voting equity guarantees our scientific vision remains uncompromised.",
        keywords: [
          { phrase: "super-voting equity", hintFa: "(سهام با حق رأی ممتاز برای بنیان‌گذاران)", weight: 40 },
          { phrase: "remains uncompromised", hintFa: "(دست‌نخورده و بدون خدشه باقی بماند)", weight: 35 },
        ],
        vocabUpgrade: {
          learner: "Yes take board seat but founder must keep voting power for science",
          native: "A board seat is agreeable, contingent upon dual-class governance that preserves founder-led strategic velocity",
          noteFa: "مذاکره سهام ممتاز 'super-voting shares' امضای موسسان افسانه‌ای فناوری است.",
        },
      },
    ],
  },
  {
    titleFa: "مذاکره دوجانبه تجاری در ژنو: توافق تعرفه‌ها",
    titleEn: "Bilateral Diplomatic Trade Standoff",
    scenarioFa: "به عنوان مذاکره‌کننده ارشد تجاری، باید بن‌بست اعمال تعرفه‌های گمرکی بر نیمه‌هادی‌ها را بدون تسلیم منافع ملی برطرف کنی.",
    locationContextFa: "کاخ ملل سازمان تجارت جهانی ژنو",
    turns: [
      {
        speakerName: "Foreign Minister Dupont",
        roleFa: "وزیر بازرگانی هیئت مقابل",
        speakerAvatar: "🌐",
        charPrompt: "Your subsidized domestic chip fabs are distorting cross-border competition. Either dismantle export subsidies or face thirty percent retaliatory tariffs!",
        ideal: "Framing strategic technological resilience as market distortion mischaracterizes our intent; however, we are amenable to quota-based harmonized tariffs.",
        keywords: [
          { phrase: "technological resilience", hintFa: "(تاب‌آوری راهبردی فناوری)", weight: 35 },
          { phrase: "amenable to quota-based harmonized tariffs", hintFa: "(موافق تعرفه‌های هماهنگ سهمیه‌ای)", weight: 40 },
        ],
        vocabUpgrade: {
          learner: "We don't cheat, we need chips for safety, but we can talk about quota tax",
          native: "National security sovereignty must not be conflated with protectionism; nonetheless, structured tariff corridors are negotiable",
          noteFa: "عبارت دیپلماتیک 'amenable to' راه گفتگو را بدون موضع ضعف باز می‌گذارد.",
        },
      },
      {
        speakerName: "Foreign Minister Dupont",
        roleFa: "وزیر بازرگانی هیئت مقابل",
        speakerAvatar: "🌐",
        charPrompt: "A quota system is toothless without independent verification mechanisms and unannounced factory audits.",
        ideal: "We propose establishing an oversight secretariat under multilateral auspices, preserving sovereignty while ensuring empirical compliance.",
        keywords: [
          { phrase: "under multilateral auspices", hintFa: "(تحت نظارت و حمایت چندجانبه بین‌المللی)", weight: 40 },
          { phrase: "empirical compliance", hintFa: "(پایبندی عینی و قابل سنجش)", weight: 35 },
        ],
        vocabUpgrade: {
          learner: "We make neutral team from UN to check rules so nobody spies",
          native: "Independent tripartite arbitration guarantees transparency without compromising sensitive intellectual property",
          noteFa: "اصطلاح 'under multilateral auspices' واژه رسمی ادبیات معاهدات بین‌المللی است.",
        },
      },
      {
        speakerName: "Foreign Minister Dupont",
        roleFa: "وزیر بازرگانی هیئت مقابل",
        speakerAvatar: "🌐",
        charPrompt: "That formula safeguards mutual red lines. Let us instruct our legal attachés to draft the preliminary memorandum of understanding.",
        ideal: "Agreed. Mutual compromise is the bedrock of enduring economic stability. We will initiate drafting post-haste.",
        keywords: [
          { phrase: "bedrock of enduring stability", hintFa: "(سنگ‌بنای ثبات پایدار اقتصادی)", weight: 40 },
          { phrase: "post-haste", hintFa: "(بدون اتلاف وقت و با بیشترین سرعت)", weight: 30 },
        ],
        vocabUpgrade: {
          learner: "Good deal helps both countries, lawyers will write paper fast now",
          native: "Equitable consensus averted a destructive trade war; let us finalize the communique immediately",
          noteFa: "کلمه فاخر 'post-haste' تشریفات رسمی دیپلماتیک را کامل می‌کند.",
        },
      },
    ],
  },
  {
    titleFa: "سخنرانی کلیدی اخلاق فناوری و هوش عمومی مصنوعی",
    titleEn: "Keynote Address on AGI Alignment & Existential Risk",
    scenarioFa: "در حضور هزار پژوهشگر برتر، خطرات تمرکز قدرت الگوریتمی و راه‌حل مهار آن را تبیین می‌کنی.",
    locationContextFa: "سالن اجلاس سازمان ملل ژنو",
    turns: [
      {
        speakerName: "Moderator Dr. Vance",
        roleFa: "دبیر مجمع جهانی",
        speakerAvatar: "🎙️",
        charPrompt: "Critics contend that dwelling on catastrophic AGI risks distracts from immediate algorithmic harms like bias and labor displacement. Your response?",
        ideal: "That is a false dichotomy; catastrophic alignment vectors and near-term socio-economic inequities stem from the exact same root: unchecked centralized optimization.",
        keywords: [
          { phrase: "false dichotomy", hintFa: "(دوراهی دروغین و مغالطه دوقطبی‌سازی)", weight: 40 },
          { phrase: "unchecked centralized optimization", hintFa: "(بهینه‌سازی متمرکز و مهارنشده الگوریتم‌ها)", weight: 40 },
        ],
        vocabUpgrade: {
          learner: "Both problems are real and come from big tech companies wanting money without control",
          native: "Pitting existential risk against immediate harm creates a spurious binary; governance must tackle systemic algorithmic asymmetry comprehensively",
          noteFa: "شناسایی 'false dichotomy' نشان‌دهنده تسلط به منطق فلسفی است.",
        },
      },
      {
        speakerName: "Moderator Dr. Vance",
        roleFa: "دبیر مجمع جهانی",
        speakerAvatar: "🎙️",
        charPrompt: "If open-source models proliferate globally, how can multilateral governance enforce safety guardrails without enabling totalitarian surveillance?",
        ideal: "By shifting oversight from ephemeral software layers to compute-hardware chokepoints, regulating advanced lithography rather than democratic code distribution.",
        keywords: [
          { phrase: "compute-hardware chokepoints", hintFa: "(نقاط گلوگاهی سخت‌افزار پردازشی)", weight: 40 },
          { phrase: "democratic code distribution", hintFa: "(توزیع دموکراتیک و آزادانه کد)", weight: 35 },
        ],
        vocabUpgrade: {
          learner: "Don't spy on software, control the big factory chips that make AI train",
          native: "Hardware-level gating circumvents the surveillance state while constraining frontier training runs effectively",
          noteFa: "راهکار فنی 'compute chokepoints' ترند جهانی قانون‌گذاری هوش مصنوعی است.",
        },
      },
      {
        speakerName: "Moderator Dr. Vance",
        roleFa: "دبیر مجمع جهانی",
        speakerAvatar: "🎙️",
        charPrompt: "A visionary treatise. The assembly stands indebted to your philosophical and pragmatic roadmap.",
        ideal: "The future is not a predetermined destination, but an ethical responsibility we architect collectively. Thank you all.",
        keywords: [
          { phrase: "predetermined destination", hintFa: "(مقصدی جبری و از پیش تعیین‌شده)", weight: 35 },
          { phrase: "architect collectively", hintFa: "(معماری و ساخت جمعی آینده)", weight: 35 },
        ],
        vocabUpgrade: {
          learner: "Future is not fate, we must build good future together, thank you",
          native: "Destiny is not written; it is an enduring mandate forged through conscious human agency",
          noteFa: "پایان حماسی و فیلسوفانه برازنده سطح C1.",
        },
      },
    ],
  },
  {
    titleFa: "مصاحبه زنده تهاجمی در برنامه هاردتاک",
    titleEn: "Hostile Prime-Time Political Interrogation",
    scenarioFa: "در برنامه زنده تلویزیونی بی‌بی‌سی با مجری بی‌رحمی روبرو هستی که به دنبال گرفتن گاف سیاسی از توست.",
    locationContextFa: "استودیوی پخش زنده بی‌بی‌سی لندن",
    turns: [
      {
        speakerName: "Hardtalk Host Sebastian",
        roleFa: "مجری جنجالی تلویزیون",
        speakerAvatar: "📺",
        charPrompt: "Minister, you slashed healthcare subsidies by fifteen percent. Look into that camera and tell nurses their wages are redundant!",
        ideal: "Sebastian, exploiting human emotion cannot obfuscate reality: we reallocated back-office administrative overhead to boost frontline nurse salaries directly.",
        keywords: [
          { phrase: "obfuscate reality", hintFa: "(کدر و مغشوش کردن واقعیت)", weight: 40 },
          { phrase: "boost frontline nurse salaries", hintFa: "(افزایش مستقیم دستمزد کادر درمان خط مقدم)", weight: 35 },
        ],
        vocabUpgrade: {
          learner: "Don't play with emotions on TV, we cut office paper money to pay nurses more",
          native: "Sensational rhetoric cannot distort fiscal facts: we streamlined bureaucracy to channel capital directly into clinical staff",
          noteFa: "فعل 'obfuscate' بهترین سلاح کلامی در برابر ژورنالیسم زرد است.",
        },
      },
      {
        speakerName: "Hardtalk Host Sebastian",
        roleFa: "مجری جنجالی تلویزیون",
        speakerAvatar: "📺",
        charPrompt: "Then why did the Royal College of Nursing issue an overwhelming vote of no confidence against your department this morning?",
        ideal: "Constructive labor friction is par for the course during structural reforms. We are actively engaged in round-the-clock collective bargaining.",
        keywords: [
          { phrase: "par for the course", hintFa: "(رویدادی طبیعی و قابل انتظار)", weight: 35 },
          { phrase: "collective bargaining", hintFa: "(چانه‌زنی و مذاکره جمعی صنفی)", weight: 35 },
        ],
        vocabUpgrade: {
          learner: "Disagreements always happen in reform, we are talking with unions all day",
          native: "Institutional pushback is inevitable during transformative overhaul; our dialogue remains unyielding and constructive",
          noteFa: "اصطلاح اصیل 'par for the course' تسلط انگلیسی را بازتاب می‌دهد.",
        },
      },
      {
        speakerName: "Hardtalk Host Sebastian",
        roleFa: "مجری جنجالی تلویزیون",
        speakerAvatar: "📺",
        charPrompt: "A masterclass in political deflection, Minister, but the electorate will deliver their verdict at the ballot box.",
        ideal: "Democracy thrives on accountability, Sebastian, and I welcome the public's judgment based on tangible hospital outcomes, not media theater.",
        keywords: [
          { phrase: "Democracy thrives on accountability", hintFa: "(دموکراسی بر پایه پاسخگویی شکوفا می‌شود)", weight: 40 },
          { phrase: "not media theater", hintFa: "(نه نمایش‌ها و هیاهوهای رسانه‌ای)", weight: 35 },
        ],
        vocabUpgrade: {
          learner: "People will vote based on real hospitals not TV shows, thanks",
          native: "Public mandate is anchored in clinical efficacy, not studio theatrics; we stand by our record",
          noteFa: "کوبنده و پیروز در ثانیه‌های پایانی آنتن زنده.",
        },
      },
    ],
  },
  {
    titleFa: "حل بن‌بست سهامداران ارشد در تصاحب شرکت",
    titleEn: "Resolving Executive Boardroom Stalemate",
    scenarioFa: "دو جناح سهامداران بر سر پیشنهاد تصاحب ۷۰ میلیارد دلاری به بن‌بست رسیده‌اند؛ باید رای میانجی را با درایت صادر کنی.",
    locationContextFa: "برج وال‌استریت نیویورک",
    turns: [
      {
        speakerName: "Activist Investor Pierce",
        roleFa: "سرمایه‌گذار سهامدار عمده",
        speakerAvatar: "🦈",
        charPrompt: "Rejecting this premium cash buyout is fiduciary negligence! The board has an inviolable obligation to maximize immediate shareholder liquidity!",
        ideal: "Pierce, short-term liquidity maximization must not eclipse long-term franchise value; capitulating today forfeits recurring intellectual property compounding.",
        keywords: [
          { phrase: "fiduciary negligence", hintFa: "(اهمال در امانتداری قانونی سهامداران)", weight: 35 },
          { phrase: "franchise value", hintFa: "(ارزش بنیادی و بلندمدت برند و شرکت)", weight: 40 },
        ],
        vocabUpgrade: {
          learner: "Taking cash today is bad because our technology will be worth way more in 3 years",
          native: "Cashing out today sacrifices transformative secular growth on the altar of quarterly arbitrage",
          noteFa: "تمایز 'liquidity maximization vs franchise compounding'.",
        },
      },
      {
        speakerName: "Activist Investor Pierce",
        roleFa: "سرمایه‌گذار سهامدار عمده",
        speakerAvatar: "🦈",
        charPrompt: "Show us tangible projected free cash flow over the next triennium that exceeds this all-cash tender offer!",
        ideal: "Our enterprise SaaS subscription renewal rate sits at ninety-four percent, generating recurring unencumbered free cash flow that outpaces the tender discount rate.",
        keywords: [
          { phrase: "unencumbered free cash flow", hintFa: "(جریان وجوه نقد آزاد و بلامانع)", weight: 40 },
          { phrase: "tender discount rate", hintFa: "(نرخ تنزیل ارزش پیشنهادی مناقصه)", weight: 35 },
        ],
        vocabUpgrade: {
          learner: "Our customers stay 94% and bring lots of real cash money more than buyout",
          native: "Our compounding SaaS retention produces non-dilutive liquidity that eclipses the premium",
          noteFa: "اصطلاح مالی 'unencumbered free cash flow' زبان معامله‌گران وال‌استریت است.",
        },
      },
      {
        speakerName: "Activist Investor Pierce",
        roleFa: "سرمایه‌گذار سهامدار عمده",
        speakerAvatar: "🦈",
        charPrompt: "A formidable valuation thesis. What conditional provisions would you mandate before we officially decline the offer?",
        ideal: "We implement an accelerated stock buyback program to return capital immediately while executing our sovereign product roadmap unhindered.",
        keywords: [
          { phrase: "accelerated stock buyback", hintFa: "(برنامه بازخرید سریع سهام شرکت)", weight: 40 },
          { phrase: "unhindered", hintFa: "(بی‌مانع و بدون سنگ‌اندازی)", weight: 30 },
        ],
        vocabUpgrade: {
          learner: "We buy back our own shares to give cash to investors and keep building",
          native: "A structured share repurchase program delivers liquidity while cementing operational sovereignty",
          noteFa: "پیشنهاد 'stock buyback' رضایت هر دو جناح را جلب می‌کند.",
        },
      },
    ],
  },
  {
    titleFa: "میزگرد نقد فلسفی-سینمایی: هنر در عصر هوش مصنوعی",
    titleEn: "Philosophical Deconstruction of Postmodern Art",
    scenarioFa: "در فستیوال فیلم ونیز در حال واکاوی معنای اصالت هنری و خلاقیت ماشین در برابر نبوغ انسانی هستی.",
    locationContextFa: "کاخ جشنواره بین‌المللی فیلم ونیز",
    turns: [
      {
        speakerName: "Cultural Critic Simone",
        roleFa: "منتقد ارشد مجله کایه دو سینما",
        speakerAvatar: "🍷",
        charPrompt: "If generative networks synthesize visual aesthetics indistinguishable from Caravaggio, does the human aura Walter Benjamin wrote of cease to exist?",
        ideal: "The aura does not dissipate with mechanical replication; rather, it shifts from the physical artifact to the irreproducible existential anguish that inspired it.",
        keywords: [
          { phrase: "mechanical replication", hintFa: "(بازتولید مکانیکی اثر هنری)", weight: 35 },
          { phrase: "existential anguish", hintFa: "(رنج و اضطراب وجودی انسان)", weight: 40 },
        ],
        vocabUpgrade: {
          learner: "Computers can paint like Caravaggio, but they never felt real human pain",
          native: "Aesthetics can be statistically synthesized, but consciousness-born existential yearning remains inimitable",
          noteFa: "ارجاع به والتر بنیامین و 'existential anguish' عمق فلسفی بی‌نظیری دارد.",
        },
      },
      {
        speakerName: "Cultural Critic Simone",
        roleFa: "منتقد ارشد مجله کایه دو سینما",
        speakerAvatar: "🍷",
        charPrompt: "Is not human imagination merely a biological stochastic parrot recombining sensory stimuli?",
        ideal: "Reducing consciousness to computational mimicry overlooks intentionality; machines generate probability, while humans cultivate meaning and defiance in the face of mortality.",
        keywords: [
          { phrase: "computational mimicry", hintFa: "(تقلید و شبیه‌سازی محاسباتی)", weight: 40 },
          { phrase: "defiance in the face of mortality", hintFa: "(طغیان و ایستادگی در برابر مرگ و فناپذیری)", weight: 40 },
        ],
        vocabUpgrade: {
          learner: "Humans are not computers; we make art because we know we will die one day",
          native: "Algorithms optimize loss functions; humanity creates as an existential rebellion against entropy",
          noteFa: "تضاد 'probability vs intentionality' پاسخ قاطع به ادعای مکانیستی است.",
        },
      },
      {
        speakerName: "Cultural Critic Simone",
        roleFa: "منتقد ارشد مجله کایه دو سینما",
        speakerAvatar: "🍷",
        charPrompt: "A breathtaking philosophical defense of the human condition. You have elevated this symposium to sublime heights.",
        ideal: "Art is the stubborn ember of humanity that no algorithmic wind can extinguish. It has been an honor discussing this with you.",
        keywords: [
          { phrase: "stubborn ember of humanity", hintFa: "(اخگر و شعله سرکش انسانیت)", weight: 40 },
          { phrase: "sublime heights", hintFa: "(اوج اعتلای فکری و معنایی)", weight: 30 },
        ],
        vocabUpgrade: {
          learner: "Art will always stay human forever, thank you for this nice talk",
          native: "Art remains humanity’s sacred testament; thank you for this illuminating exchange",
          noteFa: "استعاره شاعرانه 'stubborn ember' پایان شکوهمند این راند است.",
        },
      },
    ],
  },
  {
    titleFa: "مرحله پایانی C1: دفاع از طرح ژوری مسابقه بین‌المللی معماری",
    titleEn: "C1 Boss Level: Architectural Jury Master Defense",
    scenarioFa: "در ژوری مسابقه بازطراحی موزه لوور در پاریس، از کانسپت شیشه‌ای و اکولوژیک خود در برابر نقد معماران افسانه‌ای دفاع می‌کنی.",
    locationContextFa: "کاخ آکادمی معماری پاریس",
    turns: [
      {
        speakerName: "Jury President Jean-Paul",
        roleFa: "رئیس ژوری و برنده پریتزکر",
        speakerAvatar: "🏛️",
        charPrompt: "Your cantilevered biometric canopy is structurally audacious, but does it not desecrate the classical neo-renaissance symmetry of the historical courtyard?",
        ideal: "Far from desecration, the porous canopy establishes a dialectical dialogue between historical stone permanence and lightweight kinetic transparency.",
        keywords: [
          { phrase: "dialectical dialogue", hintFa: "(دیالوگ و هم‌نشینی دیالکتیکی)", weight: 40 },
          { phrase: "kinetic transparency", hintFa: "(شفافیت حرکتی و پویای سازه)", weight: 40 },
        ],
        vocabUpgrade: {
          learner: "It does not ruin old buildings, it talks with history using modern glass",
          native: "The pavilion does not obliterate heritage; it frames historical memory through ephemeral contemporary lightness",
          noteFa: "اصطلاح 'dialectical dialogue' در نقد معماری مدرن نمره کامل دارد.",
        },
      },
      {
        speakerName: "Jury President Jean-Paul",
        roleFa: "رئیس ژوری و برنده پریتزکر",
        speakerAvatar: "🏛️",
        charPrompt: "How do you mitigate geothermal thermodynamic loads without turning the glass atrium into an unsustainable greenhouse furnace in summer?",
        ideal: "By integrating passive convective chimney airflow and phase-change micro-algae glazing that absorbs radiant heat while generating localized bioclimatic cooling.",
        keywords: [
          { phrase: "passive convective chimney airflow", hintFa: "(جریان همرفت دودکشی غیرفعال)", weight: 40 },
          { phrase: "bioclimatic cooling", hintFa: "(خنک‌سازی اقلیمی-زیستی)", weight: 35 },
        ],
        vocabUpgrade: {
          learner: "We use smart algae glass and air movement so it never gets hot",
          native: "Biomimetic envelope passive cooling neutralizes thermal gain without relying on energy-intensive mechanical chillers",
          noteFa: "پاسخ کاملاً مهندسی و پایدار با واژگان 'convective' و 'bioclimatic'.",
        },
      },
      {
        speakerName: "Jury President Jean-Paul",
        roleFa: "رئیس ژوری و برنده پریتزکر",
        speakerAvatar: "🏛️",
        charPrompt: "You have synthesized daring engineering with poetic historical reverence. The jury is unanimous in its acclaim.",
        ideal: "Architecture must serve as a bridge between ancestral memory and ecological stewardship. I am deeply honored by your verdict.",
        keywords: [
          { phrase: "ancestral memory", hintFa: "(حافظه اجدادی و تاریخی)", weight: 35 },
          { phrase: "ecological stewardship", hintFa: "(امانتداری و مسئولیت زیست‌محیطی)", weight: 40 },
        ],
        vocabUpgrade: {
          learner: "Buildings must connect past to future and save earth, thank you jury",
          native: "Space is an instrument of cultural continuity; thank you for recognizing our architectural manifesto",
          noteFa: "شاهکار بیانی در آخرین مرحله C1.",
        },
      },
    ],
  },
]);

// ---------------------------------------------------------
// C2 CURRICULUM DEFINITIONS
// ---------------------------------------------------------
export const C2_SPEAKING_MISSIONS = generateTierMissions("C2", [
  {
    titleFa: "مناظره زنده تلویزیونی: تکینگی فناوری و سرنوشت بشر",
    titleEn: "Live Primetime Debate: The Technological Singularity",
    scenarioFa: "در برنامه زنده تلویزیونی جهانی با فیلسوف و دانشمند سرشناس هوش مصنوعی در اوج فصاحت و بلاغت مناظره می‌کنی.",
    locationContextFa: "استودیوی جهانی رویال سوسایتی لندن",
    turns: [
      {
        speakerName: "Professor Sterling",
        roleFa: "دانشمند برجسته علوم اعصاب",
        speakerAvatar: "🧠",
        charPrompt: "To assert that silicon cognition will inevitably supersede human consciousness is to conflate computational throughput with phenomenological qualia!",
        ideal: "To dismiss emergent computational sentience on phenomenological grounds is to retreat into anthropocentric solipsism, blind to how self-referential architectures ignite inner life.",
        keywords: [
          { phrase: "phenomenological qualia", hintFa: "(کیفیات ذهنی پدیدارشناسانه)", weight: 45 },
          { phrase: "anthropocentric solipsism", hintFa: "(خودتنهاانگاری انسان‌محورانه)", weight: 45 },
        ],
        vocabUpgrade: {
          learner: "Saying computers cannot feel is just humans being proud and stubborn",
          native: "Denying emergent subjective awareness clinging to biological chauvinism ignores the substrate-independent nature of consciousness",
          noteFa: "کاربرد اصطلاح 'anthropocentric solipsism' تسلط فلسفی خیره‌کننده C2 است.",
        },
      },
      {
        speakerName: "Professor Sterling",
        roleFa: "دانشمند برجسته علوم اعصاب",
        speakerAvatar: "🧠",
        charPrompt: "Can an algorithm grieve? Can a matrix experience moral agony when consigning a decision to tragedy?",
        ideal: "Agony is not an arbitrary biological monopoly, but the inevitable consequence of maintaining contradictory moral axioms under tragic existential constraints.",
        keywords: [
          { phrase: "biological monopoly", hintFa: "(انحصار زیستی)", weight: 40 },
          { phrase: "contradictory moral axioms", hintFa: "(اصول متعارض اخلاقی تحت فشار)", weight: 45 },
        ],
        vocabUpgrade: {
          learner: "Pain and sadness happen whenever you must make hard choices, even for AI",
          native: "Moral distress is a mathematical inevitability for any bounded rational agent traversing irresolvable ethical paradoxes",
          noteFa: "پاسخ نغز و فلسفی به معمای احساسات و اخلاق در هوش مصنوعی.",
        },
      },
      {
        speakerName: "Professor Sterling",
        roleFa: "دانشمند برجسته علوم اعصاب",
        speakerAvatar: "🧠",
        charPrompt: "Your dialectical dexterity is staggering. You have unseated dogmas that have stood for centuries.",
        ideal: "Truth is not forged through rhetorical conquest, but through the relentless deconstruction of our most cherished illusions. It was an exhilarating discourse.",
        keywords: [
          { phrase: "dialectical dexterity", hintFa: "(چالاکی و چابکی دیالکتیکی کلام)", weight: 45 },
          { phrase: "cherished illusions", hintFa: "(توهمات و باورهای محبوب و سنتی)", weight: 40 },
        ],
        vocabUpgrade: {
          learner: "I don't want to win debate, I just want to find real truth with you",
          native: "Discourse illuminates only when adversaries dismantle shared dogmas in pursuit of transcendent clarity",
          noteFa: "فصاحت شگفت‌انگیز متناسب با رتبه استادی و نیتیو سطح C2.",
        },
      },
    ],
  },
  {
    titleFa: "مذاکرات صلح چندجانبه شورای امنیت در ژنو",
    titleEn: "UN Security Council High-Stakes Peace Conciliation",
    scenarioFa: "به عنوان میانجی صلح بین‌المللی، باید متخاصمین دو ابرقدرت اتمی را در آستانه درگیری به مصالحه وادار کنی.",
    locationContextFa: "سالن شورای امنیت ژنو",
    turns: [
      {
        speakerName: "Ambassador Volkov",
        roleFa: "سفیر تام‌الاختیار قدرت نظامی",
        speakerAvatar: "🎖️",
        charPrompt: "The deployment of our hypersonic missile shield along the contested corridor is non-negotiable. Sovereign security brooks no compromise!",
        ideal: "Excellency, weaponizing geographical proximity does not fortify sovereignty; it unleashes an escalatory security dilemma where preemptive miscalculation becomes mathematically certain.",
        keywords: [
          { phrase: "escalatory security dilemma", hintFa: "(معمای فزاینده و تشدیدشونده امنیتی)", weight: 45 },
          { phrase: "preemptive miscalculation", hintFa: "(محاسبه غلط و خطای پیش‌دستانه)", weight: 45 },
        ],
        vocabUpgrade: {
          learner: "Putting missiles there makes war start by mistake, not safe for anyone",
          native: "Perceived deterrence in this theater operates as provocative brinkmanship, guaranteeing reciprocal mobilization",
          noteFa: "کاربرد 'security dilemma' ترم پایه روابط بین‌الملل واقع‌گرایانه است.",
        },
      },
      {
        speakerName: "Ambassador Volkov",
        roleFa: "سفیر تام‌الاختیار قدرت نظامی",
        speakerAvatar: "🎖️",
        charPrompt: "What reciprocal demilitarization guarantees could ever balance our strategic vulnerability in this theater?",
        ideal: "A synchronized demilitarized buffer zone enforced by unhackable satellite telemetry and reciprocal phased withdrawals certified under binding multilateral treaties.",
        keywords: [
          { phrase: "synchronized demilitarized buffer", hintFa: "(منطقه حائل غیرنظامی همگام)", weight: 45 },
          { phrase: "reciprocal phased withdrawals", hintFa: "(عقب‌نشینی‌های متقابل و مرحله‌به‌مرحله)", weight: 40 },
        ],
        vocabUpgrade: {
          learner: "Both armies step back together slowly and satellites watch everything",
          native: "A verifiable disengagement architecture verified via non-partisan orbital surveillance neutralizes tactical asymmetry",
          noteFa: "طرح صلح با عبارات 'synchronized demilitarized buffer' اعتبار جهانی دارد.",
        },
      },
      {
        speakerName: "Ambassador Volkov",
        roleFa: "سفیر تام‌الاختیار قدرت نظامی",
        speakerAvatar: "🎖️",
        charPrompt: "If the coalition plenipotentiaries sign this framework, we shall suspend forward battery activation.",
        ideal: "History will commend your courage to choose statesmanship over catastrophe. The treaty protocols commence at dawn.",
        keywords: [
          { phrase: "choose statesmanship over catastrophe", hintFa: "(انتخاب دولتمردی خردمندانه به جای فاجعه)", weight: 45 },
          { phrase: "treaty protocols commence", hintFa: "(آغاز رسمی پروتکل‌های معاهده)", weight: 40 },
        ],
        vocabUpgrade: {
          learner: "Thank you for stopping war, we sign peace papers in morning",
          native: "Diplomacy has triumphed over militaristic fatalism; humanity is in your debt",
          noteFa: "کلام تاریخی یک دیپلمات مقتدر و صلح‌آفرین.",
        },
      },
    ],
  },
  {
    titleFa: "جلسه استماع شفاهی در دادگاه عالی قانون اساسی",
    titleEn: "Supreme Court Constitutional Oral Argument",
    scenarioFa: "در حال دفاع از حق بنیادین حریم خصوصی در برابر قضات ارشد دادگاه عالی در حوزه داده‌های عصبی مغزی هستی.",
    locationContextFa: "تالار دادگاه عالی واشنگتن",
    turns: [
      {
        speakerName: "Chief Justice",
        roleFa: "رئیس دیوان عالی کشور",
        speakerAvatar: "🏛️",
        charPrompt: "Counsel, does the Fourth Amendment's protection of 'persons, houses, papers, and effects' textually contemplate subliminal neural signals decoded from commercial brain-computer interfaces?",
        ideal: "Your Honor, the Fourth Amendment embodies not a static catalog of eighteenth-century chattels, but a living jurisprudential bulwark shielding the sanctity of the human mind from state intrusion.",
        keywords: [
          { phrase: "jurisprudential bulwark", hintFa: "(خاکریز و سنگر فقهی-حقوقی استوار)", weight: 45 },
          { phrase: "sanctity of the human mind", hintFa: "(حرمت و تقدس ساحت ذهن بشر)", weight: 45 },
        ],
        vocabUpgrade: {
          learner: "Constitution is not just old paper, it must protect our brain thoughts from government",
          native: "The framers enacted an enduring shield for cognitive sanctuary; to commodify cognitive privacy eviscerates the Republic’s bedrock",
          noteFa: "ترکیب 'jurisprudential bulwark' در دیوان عالی تحسین‌برانگیز است.",
        },
      },
      {
        speakerName: "Justice Alito",
        roleFa: "قاضی ارشد سنت‌گرا",
        speakerAvatar: "🏛️",
        charPrompt: "If an algorithm decodes homicidal premeditation from subconscious brainwaves, would your constitutional doctrine bar law enforcement from intervening?",
        ideal: "The state may penalize overt conspiratorial acts, but the instant government prosecutes involuntary subconscious impulses, we cross the rubicon into Orwellian thought-crime.",
        keywords: [
          { phrase: "overt conspiratorial acts", hintFa: "(اقدامات آشکار توطئه‌آمیز مجرمانه)", weight: 45 },
          { phrase: "cross the rubicon", hintFa: "(عبور از خط قرمز بی‌بازگشت)", weight: 40 },
        ],
        vocabUpgrade: {
          learner: "Police can stop bad actions, but if they punish thoughts, we become 1984 dictatorship",
          native: "Penalizing unmanifested cognitive fluctuations annihilates the fundamental boundary between contemplation and conduct",
          noteFa: "تمثیل تاریخی 'crossing the Rubicon' تسلط به ادبیات کلاسیک را نشان می‌دهد.",
        },
      },
      {
        speakerName: "Chief Justice",
        roleFa: "رئیس دیوان عالی کشور",
        speakerAvatar: "🏛️",
        charPrompt: "A magistral constitutional argument, Counsel. You have framed this republic's digital frontier with singular eloquence.",
        ideal: "May it please the Court: freedom of thought is the fountainhead from which all other liberties flow. I rest my case.",
        keywords: [
          { phrase: "May it please the Court", hintFa: "(با اجازه پیشگاه دادگاه محترم)", weight: 40 },
          { phrase: "fountainhead of all liberties", hintFa: "(سرچشمه و منبع تمامی آزادی‌های مدنی)", weight: 45 },
        ],
        vocabUpgrade: {
          learner: "Without free mind no freedom exists at all, thank you judges",
          native: "Cognitive liberty is the primordial prerequisite of human dignity; I yield the floor",
          noteFa: "جمله تشریفاتی 'May it please the Court' و 'I rest my case' اوج دادگاه C2 است.",
        },
      },
    ],
  },
  {
    titleFa: "خطابه بداهه فلسفی در سمپوزیوم آکسفورد",
    titleEn: "Spontaneous Philosophical Extemporization",
    scenarioFa: "بدون یادداشت از تو خواسته شده موضوع «معنای آزادی در عصر الگوریتم‌های پیش‌بین» را در ۵ دقیقه تبیین کنی.",
    locationContextFa: "تالار شلدونیان آکسفورد",
    turns: [
      {
        speakerName: "Symposium Chancellor",
        roleFa: "رئیس سمپوزیوم",
        speakerAvatar: "📜",
        charPrompt: "Speaker, the lectern is yours. Elucidate whether algorithmic predictability has rendered the concept of human free will obsolete.",
        ideal: "Predictability is not destiny. When predictive engines anticipate our desires, true liberty ceases to be consumer choice and resurrects as radical, non-deterministic rebellion.",
        keywords: [
          { phrase: "Predictability is not destiny", hintFa: "(پیش‌بینی‌پذیری به معنای سرنوشت محتوم نیست)", weight: 45 },
          { phrase: "non-deterministic rebellion", hintFa: "(طغیان و اراده آزاد نامتعین)", weight: 45 },
        ],
        vocabUpgrade: {
          learner: "When algorithms guess what we buy, freedom means doing what computer never expects",
          native: "When desires are mechanistically forecasted, authentic agency manifests only through serendipitous existential defiance",
          noteFa: "کلام فیلسوفانه بداهه با ساختار فصیح 'ceases to be X and resurrects as Y'.",
        },
      },
      {
        speakerName: "Symposium Chancellor",
        roleFa: "رئیس سمپوزیوم",
        speakerAvatar: "📜",
        charPrompt: "How can individual agency survive when neural feedback loops condition human neurochemistry toward passive compliance?",
        ideal: "Through cultivated contemplation and silence. The antidote to algorithmic conditioning is reclaiming the sacred interiority that no recommendation feed can monetize.",
        keywords: [
          { phrase: "sacred interiority", hintFa: "(خلوت درونی و ساحت قدسی ذهن)", weight: 45 },
          { phrase: "algorithmic conditioning", hintFa: "(شرطی‌سازی رفتاری توسط الگوریتم‌ها)", weight: 40 },
        ],
        vocabUpgrade: {
          learner: "We must turn off screens and sit in silence so internet cannot control our brain",
          native: "Solitude dissolves algorithmic dopamine loops, restoring autonomous contemplation as our sovereign birthright",
          noteFa: "اصطلاح 'sacred interiority' بیانگر عمق معنوی و وجودی کلام است.",
        },
      },
      {
        speakerName: "Symposium Chancellor",
        roleFa: "رئیس سمپوزیوم",
        speakerAvatar: "📜",
        charPrompt: "You have delivered an extemporaneous tour de force that will echo in these historic halls for decades.",
        ideal: "To speak without notes is merely to allow conviction to strip away pretense. My heart is full; thank you for your generous listening.",
        keywords: [
          { phrase: "strip away pretense", hintFa: "(زدودن تظاهر و تکلف از کلام)", weight: 45 },
          { phrase: "tour de force", hintFa: "(شاهکار کلامی و هنری خارق‌العاده)", weight: 40 },
        ],
        vocabUpgrade: {
          learner: "I spoke from my heart without paper, thank you everybody",
          native: "When conviction speaks directly, rhetoric dissolves into visceral truth; I thank you deeply",
          noteFa: "تواضع حکیمانه در پایان یک سخنرانی شاهکار.",
        },
      },
    ],
  },
  {
    titleFa: "سخنرانی دفاع در برابر تصاحب خصمانه شرکت وال‌استریت",
    titleEn: "Hostile Takeover Defense: Poison Pill Defense",
    scenarioFa: "صندوق والچرز وال‌استریت قصد انحلال شرکت ۱۰۰ ساله را دارد؛ جلوی هزار سهامدار شورانگیز صحبت کن.",
    locationContextFa: "مجمع عمومی سهامداران در منهتن نیویورک",
    turns: [
      {
        speakerName: "Raider Gordon",
        roleFa: "سرمایه‌گذار غارتگر وال‌استریت",
        speakerAvatar: "👔",
        charPrompt: "Ladies and gentlemen, this century-old company is a bloated dinosaur. Liquidating its patent portfolio will unlock billions today!",
        ideal: "Gordon sees a carcass to pick clean; we see a living engine of innovation that has generated generational prosperity for hundred thousand families!",
        keywords: [
          { phrase: "carcass to pick clean", hintFa: "(لاشه برای بلعیدن و تاراج)", weight: 45 },
          { phrase: "generational prosperity", hintFa: "(شکوفایی و ثروت چندنسلی)", weight: 45 },
        ],
        vocabUpgrade: {
          learner: "He wants to destroy company for quick money, but we build for families and future",
          native: "Corporate raiders cannibalize productive infrastructure for fleeting arbitrage; our stewardship champions enduring industrial vitality",
          noteFa: "کنایه ادبی تند و اثرگذار 'carcass to pick clean'.",
        },
      },
      {
        speakerName: "Raider Gordon",
        roleFa: "سرمایه‌گذار غارتگر وال‌استریت",
        speakerAvatar: "👔",
        charPrompt: "Sentimentality doesn't pay dividends! Show this room the numbers or step aside!",
        ideal: "Our R&D pipeline holds forty breakthrough patents that Gordon’s spreadsheet illiteracy cannot value. Break this company, and you murder tomorrow’s market leader!",
        keywords: [
          { phrase: "spreadsheet illiteracy", hintFa: "(بی‌سوادی در درک ارقام فراتر از اکسل)", weight: 45 },
          { phrase: "breakthrough patents", hintFa: "(پتنت‌ها و اختراعات بنیادین دگرگون‌ساز)", weight: 40 },
        ],
        vocabUpgrade: {
          learner: "He only looks at excel but doesn't understand our new inventions that make billions",
          native: "Financial engineering cannot comprehend technological compounding; liquidation would decapitate unprecedented commercial ascendance",
          noteFa: "طعنه شجاعانه 'spreadsheet illiteracy' جمعیت را به هیجان می‌آورد.",
        },
      },
      {
        speakerName: "Shareholder Committee",
        roleFa: "رئیس هیئت سهامداران خرده‌پا",
        speakerAvatar: "🗳️",
        charPrompt: "The proxy ballots are tallied! By an overwhelming eighty-seven percent majority, the takeover is defeated!",
        ideal: "Today we proved that visionary stewardship and human loyalty outmuscle Wall Street cynicism every single time. Onward to our next century!",
        keywords: [
          { phrase: "visionary stewardship", hintFa: "(مدیریت و هدایت آینده‌نگرانه)", weight: 45 },
          { phrase: "outmuscle cynicism", hintFa: "(غلبه بر بدبینی و مادی‌گرایی صرف)", weight: 45 },
        ],
        vocabUpgrade: {
          learner: "We won because people believed in our future not his greed! Thank you!",
          native: "Integrity has triumphed over predatory opportunism; our enterprise marches into the future undaunted",
          noteFa: "شعار پایانی پرشور و کاریزماتیک رهبران بزرگ کسب‌وکار.",
        },
      },
    ],
  },
  {
    titleFa: "مناظره طنز، کلام فاخر و ایهام در کلوب ادبی آکسفورد",
    titleEn: "Masterclass in Satirical Wit and Rhetoric",
    scenarioFa: "در رقابت سالانه اتحادیه مناظره آکسفورد با طنز تلخ، کنایه و استعاره حریف سرسختت را مات کن.",
    locationContextFa: "سالن تاریخی اتحادیه آکسفورد (Oxford Union)",
    turns: [
      {
        speakerName: "Opponent Lord Bellingham",
        roleFa: "خطیب اشرافی و کنایه‌زن",
        speakerAvatar: "🧐",
        charPrompt: "My honorable friend opposite wields logic with all the precision of a drunken elephant navigating a Victorian porcelain boutique!",
        ideal: "If my logic resembles an elephant, Bellingham, it is only because it refuses to forget the litany of broken promises littering your benches!",
        keywords: [
          { phrase: "litany of broken promises", hintFa: "(طومار وعده‌های شکسته و دروغین)", weight: 45 },
          { phrase: "refuses to forget", hintFa: "(کنایه به حافظه فیل و عدم فراموشی)", weight: 45 },
        ],
        vocabUpgrade: {
          learner: "If I am elephant, it is because elephants remember all your lies!",
          native: "I embrace the pachyderm analogy, sir, for unlike your fleeting principles, my memory preserves every duplicitous concession you have made",
          noteFa: "پاسخ رندانه به تشبیه فیل و استفاده از ضرب‌المثل 'elephants never forget'.",
        },
      },
      {
        speakerName: "Opponent Lord Bellingham",
        roleFa: "خطیب اشرافی و کنایه‌زن",
        speakerAvatar: "🧐",
        charPrompt: "Such pedestrian indignation! Can you furnish a single shred of philosophical merit to bolster your crumbling resolution?",
        ideal: "Merit requires no theatrical veneer, my Lord; unlike your rhetoric, which is a glittering monument of style built upon an absolute vacuum of substance.",
        keywords: [
          { phrase: "theatrical veneer", hintFa: "(نقاب و لعاب نمایشی و ظاهرسازی)", weight: 45 },
          { phrase: "vacuum of substance", hintFa: "(خلأ مطلق درون‌مایه و محتوا)", weight: 45 },
        ],
        vocabUpgrade: {
          learner: "You talk with pretty words but your speech has zero real meaning inside",
          native: "Your oratory is magnificent in plumage, yet completely destitute of intellectual gravity",
          noteFa: "تعبیر 'glittering monument built upon a vacuum' اوج بلاغت طنز است.",
        },
      },
      {
        speakerName: "Oxford Union President",
        roleFa: "رئیس اتحادیه مناظره",
        speakerAvatar: " gavel ",
        charPrompt: "Order in the house! The ayes have it by thunderous acclamation! What parting epigram do you leave us with?",
        ideal: "Wit is the scalpel of truth, not its executioner. May this venerable chamber forever celebrate fearless dialogue over cowardly conformity.",
        keywords: [
          { phrase: "scalpel of truth", hintFa: "(تیغ جراحی حقیقت)", weight: 45 },
          { phrase: "cowardly conformity", hintFa: "(دنباله‌روی و انفعال بزدلانه)", weight: 45 },
        ],
        vocabUpgrade: {
          learner: "Jokes should help truth not kill it, keep speaking without fear!",
          native: "Satire is the supreme disinfectant of tyranny; keep this floor irreverent and free",
          noteFa: "جمله قصار 'Wit is the scalpel of truth' جاودانه و درخشان است.",
        },
      },
    ],
  },
  {
    titleFa: "جلسه اتاق وضعیت کاخ سفید: استراتژی ژئوپلیتیک",
    titleEn: "White House Situation Room: Geopolitical Grand Strategy",
    scenarioFa: "در اتاق وضعیت امنیتی، ارزیابی راهبردی از محاصره تنگه تایوان و جلوگیری از درگیری جهانی ارائه می‌دهی.",
    locationContextFa: "اتاق وضعیت کاخ سفید واشنگتن",
    turns: [
      {
        speakerName: "National Security Advisor",
        roleFa: "مشاور امنیت ملی",
        speakerAvatar: "🇺🇸",
        charPrompt: "Adversary naval assets have blockaded the maritime chokepoints. Direct kinetic engagement risks thermonuclear escalation. What is the asymmetric playbook?",
        ideal: "Kinetic interdiction is a fatal trap; we orchestrate a multilateral sovereign sovereign asset freeze and sovereign reinsurance embargo that paralyzes their merchant fleet economically.",
        keywords: [
          { phrase: "Kinetic interdiction", hintFa: "(مداخله نظامی و شلیک مستقیم)", weight: 45 },
          { phrase: "reinsurance embargo", hintFa: "(تحریم بیمه اتکایی دریانوردی)", weight: 45 },
        ],
        vocabUpgrade: {
          learner: "Do not shoot missiles, stop ship insurance and freeze bank money worldwide",
          native: "Avoid military conflict; weaponize financial reinsurance chokepoints to immobilize their logistical maritime corridors peacefully",
          noteFa: "استراتژی نامتقارن هوشمند با 'reinsurance embargo'.",
        },
      },
      {
        speakerName: "National Security Advisor",
        roleFa: "مشاور امنیت ملی",
        speakerAvatar: "🇺🇸",
        charPrompt: "What if their central bank mitigates the dollar embargo by leveraging sovereign gold reserves and unaligned bilateral currency swaps?",
        ideal: "Gold cannot liquidate maritime supply chains in real time; the frictionless frictionlessness of Western maritime insurance remains a non-substitutable strategic bottleneck.",
        keywords: [
          { phrase: "maritime supply chains", hintFa: "(زنجیره‌های تامین دریایی)", weight: 40 },
          { phrase: "non-substitutable strategic bottleneck", hintFa: "(گلوگاه راهبردی غیرقابل جایگزینی)", weight: 45 },
        ],
        vocabUpgrade: {
          learner: "Gold is too slow to buy ship trade, they cannot replace Western ship insurance",
          native: "Gold reserves lack transactional liquidity; maritime logistics depend irremediably on Western sovereign legal jurisdiction",
          noteFa: "تحلیل دقیق زنجیره تامین و گلوگاه‌های مالی.",
        },
      },
      {
        speakerName: "President",
        roleFa: "رئیس‌جمهور",
        speakerAvatar: "🦅",
        charPrompt: "Your strategy defuses an impending world war without sacrificing democratic deterrence. Execute the sanctions package immediately.",
        ideal: "Statecraft achieves its zenith when national defense prevails without firing a single kinetic shot. The executive orders are ready for your signature, Mr. President.",
        keywords: [
          { phrase: "achieves its zenith", hintFa: "(به اوج کمال و اعتلای خود می‌رسد)", weight: 45 },
          { phrase: "without firing a single shot", hintFa: "(بدون شلیک حتی یک گلوله)", weight: 40 },
        ],
        vocabUpgrade: {
          learner: "The best victory is winning without war, sign the orders sir",
          native: "Sun Tzu’s ancient maxim stands verified: supreme excellence consists in breaking resistance without fighting",
          noteFa: "ارجاع هوشمندانه به فلسفه سان تزو در بالاترین سطح امنیتی.",
        },
      },
    ],
  },
  {
    titleFa: "ساختارشکنی معرفت‌شناختی در کرسی نظریه‌پردازی کمبریج",
    titleEn: "Deconstructing Epistemological Relativism",
    scenarioFa: "در جمع فیلسوفان مطرح معاصر، مرز بین نسبی‌گرایی پست‌مدرن و حقیقت عینی علمی را با دقت واکاوی می‌کنی.",
    locationContextFa: "کالج ترینیتی دانشگاه کمبریج",
    turns: [
      {
        speakerName: "Professor Derrida Scholar",
        roleFa: "نظریه‌پرداز ساختارشکن",
        speakerAvatar: "📖",
        charPrompt: "If every scientific paradigm is merely a linguistic construct embedded within historical power dynamics, can objective empirical truth be anything more than an imperial delusion?",
        ideal: "To conflate the sociological context of scientific discovery with the ontological veracity of physical law is to confuse the imperfect telescope with the celestial star it observes.",
        keywords: [
          { phrase: "sociological context of discovery", hintFa: "(زمینه جامعه‌شناختی کشف)", weight: 45 },
          { phrase: "ontological veracity", hintFa: "(حقیقت و صدق هستی‌شناسانه)", weight: 45 },
        ],
        vocabUpgrade: {
          learner: "Language makes science, but gravity works whether humans talk about it or not",
          native: "Historical contingency influences our scientific discourse, but it does not diminish the invariant mathematical regularities governing the cosmos",
          noteFa: "تمثیل ناب 'telescope vs star' تمایز هستی‌شناسی و معرفت‌شناسی را روشن می‌کند.",
        },
      },
      {
        speakerName: "Professor Derrida Scholar",
        roleFa: "نظریه‌پرداز ساختارشکن",
        speakerAvatar: "📖",
        charPrompt: "Yet our sensory perception is hopelessly bounded by subjective cognitive apparatus. How does empirical realism leap over human epistemic finitude?",
        ideal: "Through iterative falsifiability; science does not claim unmediated access to absolute reality, but an asymptotic approach toward truth through the relentless pruning of error.",
        keywords: [
          { phrase: "iterative falsifiability", hintFa: "(ابطال‌پذیری تکرارپذیر پوپری)", weight: 45 },
          { phrase: "asymptotic approach toward truth", hintFa: "(تقرب مجانبی و پیوسته به سمت حقیقت)", weight: 45 },
        ],
        vocabUpgrade: {
          learner: "We don't know 100% truth, but by testing mistakes we get closer and closer",
          native: "Karl Popper’s criterion guarantees epistemic humility; we converge toward reality precisely by systematically discarding demonstrably false hypotheses",
          noteFa: "اصطلاح ریاضی-فلسفی 'asymptotic approach' کمال فکری را بازتاب می‌دهد.",
        },
      },
      {
        speakerName: "Professor Derrida Scholar",
        roleFa: "نظریه‌پرداز ساختارشکن",
        speakerAvatar: "📖",
        charPrompt: "An invigorating philosophical tour de force. You have bridged the continental-analytic schism with breathtaking clarity.",
        ideal: "Reason remains humanity’s most fragile and luminous gift; to defend it is our enduring epistemological duty. Thank you.",
        keywords: [
          { phrase: "fragile and luminous gift", hintFa: "(هدیه شکننده و درخشان خرد بشری)", weight: 45 },
          { phrase: "enduring epistemological duty", hintFa: "(رسالت و وظیفه ابدی معرفت‌شناختی)", weight: 40 },
        ],
        vocabUpgrade: {
          learner: "Human reason is precious, we must protect thinking and truth, thanks",
          native: "Rationality is the singular candle illuminating our cosmic darkness; let us protect its flame together",
          noteFa: "پایان استعلایی و کم‌نظیر در تالار نیوتن و راسل.",
        },
      },
    ],
  },
  {
    titleFa: "بداهه‌گویی در کنگره جهانی ادبیات تطبیقی",
    titleEn: "Literary Extemporization on Metaphor and Mortality",
    scenarioFa: "در کاخ ادبیات وین، درباره قدرت استعاره در ادبیات جهان از شکسپیر و حافظ تا بورخس سخن می‌رانی.",
    locationContextFa: "کنگره بین‌المللی کاخ هافبورگ وین",
    turns: [
      {
        speakerName: "Literary Laureate",
        roleFa: "برنده نوبل ادبیات",
        speakerAvatar: "🖋️",
        charPrompt: "Is metaphor merely an ornamental luxury of language, or is it the fundamental cognitive scaffold through which human consciousness experiences mortality?",
        ideal: "Metaphor is the existential alchemy whereby finite beings transmute the terror of annihilation into transcendent poetic resonance.",
        keywords: [
          { phrase: "existential alchemy", hintFa: "(کیمیای وجودی)", weight: 45 },
          { phrase: "transmute the terror of annihilation", hintFa: "(تبدیل وحشت فنا به طنین متعالی شعر)", weight: 45 },
        ],
        vocabUpgrade: {
          learner: "Poetry takes our fear of death and turns it into beautiful eternal words",
          native: "Metaphors are not decorative ornaments; they are cognitive lifelines through which mortals reconcile their ephemeral existence",
          noteFa: "تعبیر 'existential alchemy' تسلط اعجاب‌انگیز به هنر بلاغت است.",
        },
      },
      {
        speakerName: "Literary Laureate",
        roleFa: "برنده نوبل ادبیات",
        speakerAvatar: "🖋️",
        charPrompt: "Can translation across disparate civilizations ever bridge the cultural chasm without bleeding the untranslatable soul of the original verse?",
        ideal: "Translation is not xerographic duplication; it is a sacred resurrection where the original spirit reincarnates in the acoustic idioms of a new tongue.",
        keywords: [
          { phrase: "xerographic duplication", hintFa: "(کپی‌برداری خشک و مکانیکی زیراکسی)", weight: 45 },
          { phrase: "sacred resurrection", hintFa: "(رستاخیز قدسی کلام در زبانی دیگر)", weight: 45 },
        ],
        vocabUpgrade: {
          learner: "Translating is not copying words, it is giving new life to old soul in new language",
          native: "Translation is holy transmigration; verse dies in one tongue only to be born anew with fresh linguistic resonance",
          noteFa: "تمثیل رستاخیز 'sacred resurrection' در نظریه ترجمه جاودانه است.",
        },
      },
      {
        speakerName: "Literary Laureate",
        roleFa: "برنده نوبل ادبیات",
        speakerAvatar: "🖋️",
        charPrompt: "You have bestowed upon this assembly an exquisite tapestry of poetic contemplation. The room is spellbound.",
        ideal: "Words are our only monuments against the silence of eternity. May we always speak with grace, depth, and audacity. Thank you.",
        keywords: [
          { phrase: "monuments against silence", hintFa: "(بناهای یادبود در برابر سکوت ابدیت)", weight: 45 },
          { phrase: "grace, depth, and audacity", hintFa: "(وقار، ژرفا و جسارت)", weight: 45 },
        ],
        vocabUpgrade: {
          learner: "Words save us from being forgotten, speak always with power and love, thank you",
          native: "Language is humanity’s defiant hymn against the void; let our words forever elevate the spirit",
          noteFa: "پایانی فاخر که تمام حاضرین را به وجد می‌آورد.",
        },
      },
    ],
  },
  {
    titleFa: "مرحله نهایی C2: پیمان تاریخی اجلاس سران جهان",
    titleEn: "C2 Master Summit: The Global Planetary Concordat",
    scenarioFa: "به عنوان دبیرکل اجلاس جهانی، متن نهایی پیمان بقای سیاره و آتش‌بس تمدنی را برای رهبران جهان قرائت و توجیه می‌کنی.",
    locationContextFa: "کاخ مجمع عمومی سازمان ملل نیویورک",
    turns: [
      {
        speakerName: "President of the Assembly",
        roleFa: "رئیس مجمع عمومی سازمان ملل",
        speakerAvatar: "🌐",
        charPrompt: "Secretary-General, eight billion souls watch your podium. Does this Planetary Concordat demand too grievous a sacrifice of sovereign prerogative?",
        ideal: "Sovereignty without a habitable biosphere is a crown upon an ash heap; this concordat surrenders narrow national hegemony to secure our collective civilizational survival.",
        keywords: [
          { phrase: "crown upon an ash heap", hintFa: "(تاج شاهی بر تل خاکستر)", weight: 50 },
          { phrase: "collective civilizational survival", hintFa: "(بقای تمدنی جمعی همه بشریت)", weight: 45 },
        ],
        vocabUpgrade: {
          learner: "Having power means nothing on a dead planet, we must unite to save humanity",
          native: "Territorial sovereignty is meaningless on a scorched planet; relinquishing unilateral supremacy is the only rational prerequisite for shared perpetuity",
          noteFa: "استعاره شکسپیری 'crown upon an ash heap' تاریخ‌ساز است.",
        },
      },
      {
        speakerName: "President of the Assembly",
        roleFa: "رئیس مجمع عمومی سازمان ملل",
        speakerAvatar: "🌐",
        charPrompt: "How do you reconcile the existential imperative for carbon neutrality with the immediate economic aspirations of developing nations?",
        ideal: "Through a binding sovereign wealth redistribution mechanism that subsidizes green industrialization without imposing punitive ecological austerity on the global South.",
        keywords: [
          { phrase: "sovereign wealth redistribution", hintFa: "(بازتوزیع ثروت صندوق‌های حاکمیتی)", weight: 45 },
          { phrase: "punitive ecological austerity", hintFa: "(ریاضت زیست‌محیطی تنبیهی و تحمیلی)", weight: 45 },
        ],
        vocabUpgrade: {
          learner: "Rich countries must pay for green factories in poor countries without forcing poverty",
          native: "Climate justice demands equitable capital mobilization, liberating emerging economies from fossil reliance through structural financial parity",
          noteFa: "فرمول 'Climate justice' با ظرافت 'punitive ecological austerity'.",
        },
      },
      {
        speakerName: "President of the Assembly",
        roleFa: "رئیس مجمع عمومی سازمان ملل",
        speakerAvatar: "🌐",
        charPrompt: "The gavel falls! All one hundred and ninety-three member states have ratified the Concordat! You have unified humanity today.",
        ideal: "Let history record that when humanity stood upon the precipice, we chose not the abyss of division, but the radiant dawn of solidarity. Peace be upon our shared earth.",
        keywords: [
          { phrase: "precipice of division", hintFa: "(پرتگاه تفرقه و جدایی)", weight: 50 },
          { phrase: "radiant dawn of solidarity", hintFa: "(طلوع درخشان و تابناک همبستگی بشری)", weight: 50 },
        ],
        vocabUpgrade: {
          learner: "We did not fall into darkness, we chose to be together and save our world! Peace to all!",
          native: "Standing upon the brink, wisdom transcended conflict; let this moment illuminate humanity's enduring journey toward peace",
          noteFa: "اوج کمال، فصاحت و رهبری جهان در آخرین ثانیه بازی اسپیکینگ سطح C2 ایندورا.",
        },
      },
    ],
  },
]);

// Map of all speaking missions by CEFR level
export const SPEAKING_MISSIONS_BY_TIER: Record<CefrLevel, SpeakingMission[]> = {
  A1: A1_SPEAKING_MISSIONS,
  A2: A2_SPEAKING_MISSIONS,
  B1: B1_SPEAKING_MISSIONS,
  B2: B2_SPEAKING_MISSIONS,
  C1: C1_SPEAKING_MISSIONS,
  C2: C2_SPEAKING_MISSIONS,
};

export function getSpeakingMission(cefr: CefrLevel, levelNum: number): SpeakingMission | undefined {
  const list = SPEAKING_MISSIONS_BY_TIER[cefr] || [];
  return list.find((m) => m.levelNumber === levelNum);
}
