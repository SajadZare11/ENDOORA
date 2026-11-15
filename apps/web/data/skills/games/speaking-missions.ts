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
    scenarioFa: "رسیده‌ای به هتل و می‌خواهی اتاقی ساکت و دور از آسانسور تحویل بگیری.",
    locationContextFa: "پذیرش هتل",
    turns: [
      {
        speakerName: "Clerk",
        roleFa: "مسئول پذیرش",
        speakerAvatar: "🛎️",
        charPrompt: "Good afternoon! Welcome to our hotel. What is your name?",
        ideal: "Good afternoon. I have a reservation under Alex Reed.",
        keywords: [
          { phrase: "have a reservation", hintFa: "(رزرو دارم)", weight: 30 },
          { phrase: "under Alex Reed", hintFa: "(به نام الکس رید)", weight: 20 },
        ],
        vocabUpgrade: {
          learner: "My name Alex room please",
          native: "I have a reservation under Alex Reed.",
          noteFa: "برای اعلام رزرو هتل می‌گوییم: I have a reservation under [Name].",
        },
      },
      {
        speakerName: "Clerk",
        roleFa: "مسئول پذیرش",
        speakerAvatar: "🛎️",
        charPrompt: "I found your booking on the third floor. Do you need anything?",
        ideal: "Can I have a quiet room far from the elevator?",
        keywords: [
          { phrase: "Can I have", hintFa: "(می‌توانم داشته باشم؟)", weight: 30 },
          { phrase: "quiet room", hintFa: "(اتاق ساکت)", weight: 20 },
        ],
        vocabUpgrade: {
          learner: "I want quiet room no elevator",
          native: "Can I have a quiet room far from the elevator?",
          noteFa: "برای درخواست مؤدبانه در سطح A2 از 'Can I have...?' استفاده می‌کنیم.",
        },
      },
      {
        speakerName: "Clerk",
        roleFa: "مسئول پذیرش",
        speakerAvatar: "🛎️",
        charPrompt: "Certainly! Room 410 is very quiet and has a nice view.",
        ideal: "That is great! Thank you so much for your help.",
        keywords: [
          { phrase: "That is great", hintFa: "(عالی است)", weight: 25 },
          { phrase: "for your help", hintFa: "(برای کمکتان)", weight: 25 },
        ],
        vocabUpgrade: {
          learner: "Very good thank you for help",
          native: "That is great! Thanks a lot for your help.",
          noteFa: "عبارت 'Thank you for your help' رایج‌ترین و محترمانه‌ترین روش تشکر است.",
        },
      },
    ],
  },
  {
    titleFa: "مرجوع کردن جنس در فروشگاه",
    titleEn: "Returning a Faulty Item",
    scenarioFa: "یک پیراهن خریده‌ای که اندازه‌ات نیست و می‌خواهی آن را تعویض کنی یا پس بدهی.",
    locationContextFa: "میز خدمات مشتریان فروشگاه",
    turns: [
      {
        speakerName: "Cashier",
        roleFa: "مسئول خدمات",
        speakerAvatar: "🛍️",
        charPrompt: "Hello! How can I help you today?",
        ideal: "Hi, I want to return this shirt. It is too small.",
        keywords: [
          { phrase: "return this shirt", hintFa: "(مرجوع کردن این پیراهن)", weight: 30 },
          { phrase: "too small", hintFa: "(خیلی کوچک)", weight: 25 },
        ],
        vocabUpgrade: {
          learner: "I give back shirt bad size",
          native: "I want to return this shirt, it is too small.",
          noteFa: "وقتی لباسی اندازه‌تان نیست، بگویید: It is too small یا It doesn't fit.",
        },
      },
      {
        speakerName: "Cashier",
        roleFa: "مسئول خدمات",
        speakerAvatar: "🛍️",
        charPrompt: "I see. Do you have the receipt with you?",
        ideal: "Yes, here is the receipt and the price tag.",
        keywords: [
          { phrase: "here is the receipt", hintFa: "(بفرمایید این رسید است)", weight: 25 },
          { phrase: "price tag", hintFa: "(اتیکت قیمت)", weight: 25 },
        ],
        vocabUpgrade: {
          learner: "Yes I have paper bill",
          native: "Yes, here is the receipt.",
          noteFa: "کلمه receipt به معنی فاکتور خرید است و حرف p در آن خوانده نمی‌شود (ری‌سیت).",
        },
      },
      {
        speakerName: "Cashier",
        roleFa: "مسئول خدمات",
        speakerAvatar: "🛍️",
        charPrompt: "Do you want to change it or get your money back?",
        ideal: "Can I get my money back on my card?",
        keywords: [
          { phrase: "get my money back", hintFa: "(پس گرفتن پولم)", weight: 30 },
          { phrase: "on my card", hintFa: "(به کارتم)", weight: 20 },
        ],
        vocabUpgrade: {
          learner: "Give money to my card please",
          native: "Can I get a refund to my card?",
          noteFa: "عبارت 'get my money back' روش ساده و طبیعی پس گرفتن وجه است.",
        },
      },
    ],
  },
  {
    titleFa: "گرفتن وقت دکتر در کلینیک",
    titleEn: "Booking a Doctor Appointment",
    scenarioFa: "گلودرد داری و می‌خواهی از دکتر عمومی برای فردا صبح وقت ویزیت بگیری.",
    locationContextFa: "پذیرش کلینیک درمانی",
    turns: [
      {
        speakerName: "Nurse",
        roleFa: "منشی مطب",
        speakerAvatar: "👩‍⚕️",
        charPrompt: "Good morning, Westside Clinic. How can I help you?",
        ideal: "Hello, I want to see a doctor today, please.",
        keywords: [
          { phrase: "see a doctor", hintFa: "(دیدن دکتر / ویزیت پزشک)", weight: 30 },
          { phrase: "today, please", hintFa: "(امروز، لطفاً)", weight: 20 },
        ],
        vocabUpgrade: {
          learner: "I want doctor today help",
          native: "I'd like to see a doctor today, please.",
          noteFa: "برای ویزیت پزشک می‌گوییم: see a doctor یا make an appointment.",
        },
      },
      {
        speakerName: "Nurse",
        roleFa: "منشی مطب",
        speakerAvatar: "👩‍⚕️",
        charPrompt: "What is the problem? Do you feel sick?",
        ideal: "I have a sore throat and a bad headache.",
        keywords: [
          { phrase: "sore throat", hintFa: "(گلودرد)", weight: 30 },
          { phrase: "bad headache", hintFa: "(سردرد شدید)", weight: 20 },
        ],
        vocabUpgrade: {
          learner: "My throat hurt and head hurt",
          native: "I have a sore throat and a headache.",
          noteFa: "برای بیان علائم بیماری از ساختار 'I have a...' استفاده می‌کنیم.",
        },
      },
      {
        speakerName: "Nurse",
        roleFa: "منشی مطب",
        speakerAvatar: "👩‍⚕️",
        charPrompt: "Doctor Evans has time tomorrow morning at ten. Is that okay?",
        ideal: "Yes, ten o'clock is great for me. Thank you!",
        keywords: [
          { phrase: "ten o'clock", hintFa: "(ساعت ده)", weight: 30 },
          { phrase: "great for me", hintFa: "(برای من عالی است)", weight: 20 },
        ],
        vocabUpgrade: {
          learner: "Yes ten is good time thanks",
          native: "Ten AM works great for me.",
          noteFa: "برای تایید زمان قرار ملاقات می‌گوییم: That is great for me یا That works for me.",
        },
      },
    ],
  },
  {
    titleFa: "برنامه‌ریزی تفریح آخر هفته با دوست",
    titleEn: "Planning a Weekend Outing",
    scenarioFa: "هوا آفتابی است و می‌خواهی با دوستت برای تفریح آخر هفته در پارک برنامه‌ریزی کنی.",
    locationContextFa: "کافه تریا دانشگاه",
    turns: [
      {
        speakerName: "Chris",
        roleFa: "دوست قدیمی",
        speakerAvatar: "🧢",
        charPrompt: "Hey! The weather is sunny this Saturday. What should we do?",
        ideal: "How about going to the park for a walk?",
        keywords: [
          { phrase: "How about", hintFa: "(نظرت چیه درباره...)", weight: 30 },
          { phrase: "to the park", hintFa: "(به پارک)", weight: 25 },
        ],
        vocabUpgrade: {
          learner: "We go park walk Saturday",
          native: "How about going for a walk in the park?",
          noteFa: "برای پیشنهاد دادن فعالیت تفریحی از فرمول 'How about + فعلing' استفاده کنید.",
        },
      },
      {
        speakerName: "Chris",
        roleFa: "دوست قدیمی",
        speakerAvatar: "🧢",
        charPrompt: "That sounds fun! What time should we meet there?",
        ideal: "Let us meet at nine in the morning.",
        keywords: [
          { phrase: "Let us meet", hintFa: "(بیا همدیگر را ببینیم)", weight: 30 },
          { phrase: "in the morning", hintFa: "(صبح / در هنگام صبح)", weight: 25 },
        ],
        vocabUpgrade: {
          learner: "We meet 9 morning",
          native: "Let's meet at nine in the morning.",
          noteFa: "با عبارت 'Let's meet at [time]' ساعت قرار را مشخص کنید.",
        },
      },
      {
        speakerName: "Chris",
        roleFa: "دوست قدیمی",
        speakerAvatar: "🧢",
        charPrompt: "Great! I can bring some juice. What can you bring?",
        ideal: "I can bring some sandwiches and a camera.",
        keywords: [
          { phrase: "bring some sandwiches", hintFa: "(آوردن چند ساندویچ)", weight: 30 },
          { phrase: "a camera", hintFa: "(یک دوربین عکاسی)", weight: 20 },
        ],
        vocabUpgrade: {
          learner: "I bring sandwich and camera",
          native: "I will bring some sandwiches and a camera.",
          noteFa: "از 'I can bring...' یا 'I will bring...' برای پیشنهاد همراه داشتن خوراکی یا وسایل استفاده کنید.",
        },
      },
    ],
  },
  {
    titleFa: "پیشنهاد کتاب در کتاب‌فروشی",
    titleEn: "Asking Book Recommendation",
    scenarioFa: "دنبال یک کتاب داستان انگلیسی ساده و جذاب می‌گردی و از فروشنده کمک می‌خواهی.",
    locationContextFa: "کتاب‌فروشی دنج",
    turns: [
      {
        speakerName: "Librarian",
        roleFa: "کتابدار",
        speakerAvatar: "📚",
        charPrompt: "Welcome! What kind of books do you like to read?",
        ideal: "I like mystery stories with easy English words.",
        keywords: [
          { phrase: "mystery stories", hintFa: "(داستان‌های معمایی)", weight: 25 },
          { phrase: "easy English", hintFa: "(انگلیسی ساده)", weight: 30 },
        ],
        vocabUpgrade: {
          learner: "I like detective book easy english",
          native: "I enjoy reading simple mystery stories.",
          noteFa: "برای بیان سلیقه کتاب از 'I like mystery stories' استفاده کنید.",
        },
      },
      {
        speakerName: "Librarian",
        roleFa: "کتابدار",
        speakerAvatar: "📚",
        charPrompt: "This Sherlock Holmes story is very popular and easy to read.",
        ideal: "How much is this book? Is it on sale?",
        keywords: [
          { phrase: "How much is", hintFa: "(چند است؟ / قیمتش چقدره؟)", weight: 30 },
          { phrase: "on sale", hintFa: "(در حراج / دارای تخفیف)", weight: 25 },
        ],
        vocabUpgrade: {
          learner: "What price of book is cheap?",
          native: "How much does this book cost?",
          noteFa: "برای پرسیدن قیمت کتاب می‌گوییم: How much is this book?",
        },
      },
      {
        speakerName: "Librarian",
        roleFa: "کتابدار",
        speakerAvatar: "📚",
        charPrompt: "Yes, it is only five dollars today on the front table.",
        ideal: "That is very cheap! I will buy it now.",
        keywords: [
          { phrase: "very cheap", hintFa: "(خیلی ارزان)", weight: 30 },
          { phrase: "buy it now", hintFa: "(همین الان می‌خرمش)", weight: 20 },
        ],
        vocabUpgrade: {
          learner: "Very cheap price I buy",
          native: "That is a great price! I'll take it.",
          noteFa: "وقتی قیمتی مناسب است می‌گوییم: That is cheap یا That's a great price.",
        },
      },
    ],
  },
  {
    titleFa: "اعلام چمدان گم‌شده در فرودگاه",
    titleEn: "Reporting Lost Luggage",
    scenarioFa: "پروازت نشسته اما چمدانت روی تسمه نیامده است. باید در باجه اشیاء گم‌شده گزارش بدهی.",
    locationContextFa: "باجه اشیاء گمشده فرودگاه",
    turns: [
      {
        speakerName: "Agent",
        roleFa: "مسئول فرودگاه",
        speakerAvatar: "🧳",
        charPrompt: "Hello, can I help you find your luggage?",
        ideal: "Yes, I cannot find my suitcase on the belt.",
        keywords: [
          { phrase: "cannot find", hintFa: "(نمی‌توانم پیدا کنم)", weight: 25 },
          { phrase: "my suitcase", hintFa: "(چمدان من)", weight: 30 },
        ],
        vocabUpgrade: {
          learner: "My bag not come on belt",
          native: "I can't find my suitcase on the belt.",
          noteFa: "برای چمدان بزرگ مسافرتی از کلمه suitcase و برای تسمه نقاله از belt استفاده می‌شود.",
        },
      },
      {
        speakerName: "Agent",
        roleFa: "مسئول فرودگاه",
        speakerAvatar: "🧳",
        charPrompt: "What does your suitcase look like? What color is it?",
        ideal: "It is a large black bag with a red tag.",
        keywords: [
          { phrase: "large black bag", hintFa: "(کیف بزرگ سیاه)", weight: 25 },
          { phrase: "red tag", hintFa: "(برچسب قرمز)", weight: 30 },
        ],
        vocabUpgrade: {
          learner: "Bag is big black has red paper",
          native: "It is a big black suitcase with a red tag.",
          noteFa: "ترتیب صفت‌ها در انگلیسی: ابتدا اندازه (large) و سپس رنگ (black).",
        },
      },
      {
        speakerName: "Agent",
        roleFa: "مسئول فرودگاه",
        speakerAvatar: "🧳",
        charPrompt: "We found your bag! We will send it to your hotel tonight.",
        ideal: "I am so happy to hear that! Thank you!",
        keywords: [
          { phrase: "happy to hear that", hintFa: "(خوشحالم که این را می‌شنوم)", weight: 35 },
          { phrase: "Thank you", hintFa: "(متشکرم)", weight: 20 },
        ],
        vocabUpgrade: {
          learner: "I happy thanks for find",
          native: "I am so glad to hear that! Thank you.",
          noteFa: "جمله 'I am happy to hear that' بهترین عکس‌العمل مؤدبانه به یک خبر خوش است.",
        },
      },
    ],
  },
  {
    titleFa: "سفارش غذا با پرهیز غذایی در رستوران",
    titleEn: "Ordering with Dietary Preferences",
    scenarioFa: "در رستوران ایتالیایی می‌خواهی غذا سفارش دهی اما به آجیل و مغزیجات حساسیت داری.",
    locationContextFa: "رستوران ایتالیایی",
    turns: [
      {
        speakerName: "Server",
        roleFa: "میزبان رستوران",
        speakerAvatar: "🍝",
        charPrompt: "Welcome! Would you like our pasta with walnut sauce today?",
        ideal: "That sounds nice, but I cannot eat any nuts.",
        keywords: [
          { phrase: "sounds nice", hintFa: "(خوب به نظر می‌رسد)", weight: 25 },
          { phrase: "cannot eat any nuts", hintFa: "(هیچ آجیلی نمی‌توانم بخورم)", weight: 35 },
        ],
        vocabUpgrade: {
          learner: "No nuts I get sick",
          native: "I cannot eat nuts, I have an allergy.",
          noteFa: "برای بیان پرهیز غذایی می‌گوییم: I cannot eat [food] یا I am allergic to [food].",
        },
      },
      {
        speakerName: "Server",
        roleFa: "میزبان رستوران",
        speakerAvatar: "🍝",
        charPrompt: "No problem! Our tomato pasta has no nuts at all. Would you like that?",
        ideal: "Yes, please. Does it come with fresh bread?",
        keywords: [
          { phrase: "Does it come with", hintFa: "(آیا همراهش هست؟)", weight: 30 },
          { phrase: "fresh bread", hintFa: "(نان تازه)", weight: 20 },
        ],
        vocabUpgrade: {
          learner: "Has bread with it?",
          native: "Does that come with fresh bread?",
          noteFa: "برای پرسیدن مخلفات همراه غذا می‌گوییم: Does it come with...?",
        },
      },
      {
        speakerName: "Server",
        roleFa: "میزبان رستوران",
        speakerAvatar: "🍝",
        charPrompt: "Yes, fresh bread is included. What would you like to drink?",
        ideal: "Just a glass of cold water with lemon, please.",
        keywords: [
          { phrase: "glass of cold water", hintFa: "(یک لیوان آب سرد)", weight: 30 },
          { phrase: "with lemon", hintFa: "(با لیمو)", weight: 20 },
        ],
        vocabUpgrade: {
          learner: "Cold water lemon please",
          native: "Just a glass of cold water with lemon, please.",
          noteFa: "برای سفارش نوشیدنی می‌گوییم: A glass of [drink], please.",
        },
      },
    ],
  },
  {
    titleFa: "دعوت دوست به خانه و هماهنگی زمان",
    titleEn: "Inviting a Friend to Dinner",
    scenarioFa: "می‌خواهی دوستت را برای شام جمعه به خانه‌ات دعوت کنی و سر ساعت به تفاهم برسی.",
    locationContextFa: "لابی شرکت",
    turns: [
      {
        speakerName: "Colleague",
        roleFa: "همکار",
        speakerAvatar: "💼",
        charPrompt: "Hey! Do you have any plans for Friday night?",
        ideal: "Do you want to have dinner at my house?",
        keywords: [
          { phrase: "Do you want to", hintFa: "(آیا می‌خواهی...؟)", weight: 30 },
          { phrase: "have dinner", hintFa: "(شام خوردن)", weight: 25 },
        ],
        vocabUpgrade: {
          learner: "Come to my house Friday food",
          native: "Would you like to come over for dinner on Friday?",
          noteFa: "ساده‌ترین دعوت دوستانه در A2: Do you want to have dinner at my house?",
        },
      },
      {
        speakerName: "Colleague",
        roleFa: "همکار",
        speakerAvatar: "💼",
        charPrompt: "That sounds great! What time should I come over?",
        ideal: "Please come at seven o'clock in the evening.",
        keywords: [
          { phrase: "at seven o'clock", hintFa: "(ساعت هفت)", weight: 30 },
          { phrase: "in the evening", hintFa: "(عصر / شب)", weight: 20 },
        ],
        vocabUpgrade: {
          learner: "Come 7 evening time",
          native: "Seven o'clock works best.",
          noteFa: "برای مشخص کردن ساعت آمدن مهمان: Please come at seven o'clock.",
        },
      },
      {
        speakerName: "Colleague",
        roleFa: "همکار",
        speakerAvatar: "💼",
        charPrompt: "Perfect! I will bring some chocolate cake. See you Friday!",
        ideal: "Thank you! I will see you on Friday night!",
        keywords: [
          { phrase: "Thank you", hintFa: "(متشکرم)", weight: 25 },
          { phrase: "see you on Friday", hintFa: "(جمعه می‌بینمت)", weight: 25 },
        ],
        vocabUpgrade: {
          learner: "Thanks see you Friday",
          native: "Sounds delicious! See you on Friday!",
          noteFa: "برای خداحافظی پس از هماهنگی مهمانی: See you on Friday!",
        },
      },
    ],
  },
  {
    titleFa: "راهنمایی درباره آب‌وهوا و بستن چمدان سفر",
    titleEn: "Weather & Packing Advice",
    scenarioFa: "فردا به کوهستان می‌روی و از راهنمای تور درباره وضعیت آب‌وهوا و لباس مناسب سوال می‌کنی.",
    locationContextFa: "دفتر آژانس گردشگری",
    turns: [
      {
        speakerName: "Tour Guide",
        roleFa: "راهنمای تور",
        speakerAvatar: "🏔️",
        charPrompt: "Hello traveler! Are you ready for our mountain trip tomorrow?",
        ideal: "Almost ready! What is the weather like up there?",
        keywords: [
          { phrase: "Almost ready", hintFa: "(تقریباً آماده‌ام)", weight: 25 },
          { phrase: "What is the weather like", hintFa: "(هوا چطور است؟)", weight: 30 },
        ],
        vocabUpgrade: {
          learner: "Weather is cold or hot there?",
          native: "What is the weather like in the mountains?",
          noteFa: "ساده‌ترین و کاربردی‌ترین روش پرسیدن آب‌وهوا: What is the weather like?",
        },
      },
      {
        speakerName: "Tour Guide",
        roleFa: "راهنمای تور",
        speakerAvatar: "🏔️",
        charPrompt: "It is very cold and windy in the morning, but sunny later.",
        ideal: "Should I wear a warm jacket and boots?",
        keywords: [
          { phrase: "Should I wear", hintFa: "(آیا باید بپوشم؟)", weight: 30 },
          { phrase: "warm jacket", hintFa: "(کاپشن گرم)", weight: 25 },
        ],
        vocabUpgrade: {
          learner: "I wear hot jacket and sport shoes?",
          native: "Should I wear a warm coat and hiking boots?",
          noteFa: "برای مشورت گرفتن درباره پوشش لباس از 'Should I wear...?' استفاده کنید.",
        },
      },
      {
        speakerName: "Tour Guide",
        roleFa: "راهنمای تور",
        speakerAvatar: "🏔️",
        charPrompt: "Yes, definitely wear a warm jacket and bring an umbrella too.",
        ideal: "Good idea! I will pack them in my backpack.",
        keywords: [
          { phrase: "Good idea", hintFa: "(ایده خوبی است)", weight: 25 },
          { phrase: "in my backpack", hintFa: "(در کوله‌پشتی‌ام)", weight: 25 },
        ],
        vocabUpgrade: {
          learner: "Good idea I put in bag",
          native: "Great tip! I will pack them in my backpack.",
          noteFa: "عبارت 'Good idea!' طبیعی‌ترین راه برای تایید پیشنهاد دیگران است.",
        },
      },
    ],
  },
  {
    titleFa: "مرحله پایانی A2: رزرو بلیت قطار با منظره زیبا",
    titleEn: "A2 Boss Level: Scenic Train Tour Booking",
    scenarioFa: "در ایستگاه قطار می‌خواهی دو بلیت قطار با صندلی کنار پنجره رزرو کنی.",
    locationContextFa: "ایستگاه قطار مرکزی",
    turns: [
      {
        speakerName: "Station Agent",
        roleFa: "متصدی گیشه",
        speakerAvatar: "🚂",
        charPrompt: "Good morning! Welcome to the station. Where are you going?",
        ideal: "Good morning! I want to buy two tickets to Oxford.",
        keywords: [
          { phrase: "buy two tickets", hintFa: "(خریدن دو بلیت)", weight: 30 },
          { phrase: "to Oxford", hintFa: "(به آکسفورد)", weight: 25 },
        ],
        vocabUpgrade: {
          learner: "I want two ticket Oxford train",
          native: "I would like to buy two tickets to Oxford, please.",
          noteFa: "برای خرید بلیت قطار در سطح A2 می‌گوییم: I want to buy [number] tickets to [city].",
        },
      },
      {
        speakerName: "Station Agent",
        roleFa: "متصدی گیشه",
        speakerAvatar: "🚂",
        charPrompt: "We have seats available. Do you want window or aisle seats?",
        ideal: "We prefer window seats so we can see outside.",
        keywords: [
          { phrase: "window seats", hintFa: "(صندلی‌های کنار پنجره)", weight: 30 },
          { phrase: "see outside", hintFa: "(دیدن بیرون / منظره بیرون)", weight: 25 },
        ],
        vocabUpgrade: {
          learner: "Window seats want look outside",
          native: "We prefer window seats to enjoy the view.",
          noteFa: "صندلی کنار پنجره window seat و صندلی کنار راهرو aisle seat نام دارد.",
        },
      },
      {
        speakerName: "Station Agent",
        roleFa: "متصدی گیشه",
        speakerAvatar: "🚂",
        charPrompt: "Your seats are confirmed in carriage four. Have a wonderful trip!",
        ideal: "Thank you so much! Have a great day!",
        keywords: [
          { phrase: "Thank you so much", hintFa: "(خیلی متشکرم)", weight: 25 },
          { phrase: "Have a great day", hintFa: "(روز خوبی داشته باشید)", weight: 25 },
        ],
        vocabUpgrade: {
          learner: "Thanks you good agent",
          native: "Thank you so much! Have a wonderful day!",
          noteFa: "عبارت 'Have a great day!' زیباترین آرزوی روز خوب هنگام پایان مکالمه است.",
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
    titleFa: "حل مشکل پرواز لغو شده در فرودگاه",
    titleEn: "Resolving a Cancelled Flight",
    scenarioFa: "پروازت به دلیل هوای بد لغو شده است. باید با نماینده ایرلاین صحبت کنی تا پرواز بعدی یا هتل رایگان فراهم کند.",
    locationContextFa: "گیت شماره ۲۴ فرودگاه",
    turns: [
      {
        speakerName: "Airline Rep",
        roleFa: "نماینده پرواز",
        speakerAvatar: "✈️",
        charPrompt: "I'm sorry, but Flight BA-104 has been cancelled because of bad weather.",
        ideal: "Excuse me, I have a connecting flight tonight. Are there any other flights available?",
        keywords: [
          { phrase: "connecting flight", hintFa: "(پرواز اتصالی)", weight: 35 },
          { phrase: "other flights available", hintFa: "(پروازهای دیگر موجود)", weight: 35 },
        ],
        vocabUpgrade: {
          learner: "My plane cancel what do I do now?",
          native: "Could you check if there are other flights to get me to my destination?",
          noteFa: "عبارت 'connecting flight' طبیعی‌ترین اصطلاح B1 برای پروازهای بعدی است.",
        },
      },
      {
        speakerName: "Airline Rep",
        roleFa: "نماینده پرواز",
        speakerAvatar: "✈️",
        charPrompt: "We have a flight tomorrow at 6:00 AM, but no flights tonight.",
        ideal: "Because the flight is tomorrow, will the airline give us a free hotel room and food vouchers?",
        keywords: [
          { phrase: "free hotel room", hintFa: "(اتاق رایگان هتل)", weight: 35 },
          { phrase: "food vouchers", hintFa: "(کوپن غذا)", weight: 30 },
        ],
        vocabUpgrade: {
          learner: "You pay hotel for me sleep?",
          native: "Does the airline provide a hotel room and meal vouchers for the night?",
          noteFa: "در سطح B1 استفاده از 'free hotel room and food vouchers' کاملاً روان و طبیعی است.",
        },
      },
      {
        speakerName: "Airline Rep",
        roleFa: "نماینده پرواز",
        speakerAvatar: "✈️",
        charPrompt: "Yes, of course. Here is your hotel voucher and a £30 food coupon.",
        ideal: "Thank you for your help. I really appreciate you solving this so quickly.",
        keywords: [
          { phrase: "really appreciate", hintFa: "(واقعاً قدردانی می‌کنم)", weight: 35 },
          { phrase: "solving this so quickly", hintFa: "(حل کردن سریع این موضوع)", weight: 35 },
        ],
        vocabUpgrade: {
          learner: "Thanks for give hotel paper fast",
          native: "Thank you so much for helping me sort this out so fast.",
          noteFa: "ترکیب 'really appreciate' برای تشکر رسمی و محترمانه در سطح B1 عالی است.",
        },
      },
    ],
  },
  {
    titleFa: "معرفی شرح شغل و برنامه‌های کاری در تیم",
    titleEn: "Introducing Your Role in a Team Meeting",
    scenarioFa: "در اولین جلسه کاری شرکت شرکت کرده‌ای و باید مسئولیت‌هایت را به زبان ساده تشریح کنی.",
    locationContextFa: "جلسه آنلاین تیم",
    turns: [
      {
        speakerName: "Team Lead",
        roleFa: "سرپرست تیم",
        speakerAvatar: "👩‍💻",
        charPrompt: "Welcome to the team! Could you tell us about your experience and what you will work on?",
        ideal: "Happy to be here! My main focus is building easy-to-use websites and working closely with our design team.",
        keywords: [
          { phrase: "main focus", hintFa: "(تمرکز اصلی)", weight: 35 },
          { phrase: "working closely", hintFa: "(همکاری نزدیک)", weight: 30 },
        ],
        vocabUpgrade: {
          learner: "My work is website front and talk with design",
          native: "My main focus is front-end development and working with the design team.",
          noteFa: "عبارت 'main focus' ساده و استاندارد برای معرفی نقش کاری در B1 است.",
        },
      },
      {
        speakerName: "Team Lead",
        roleFa: "سرپرست تیم",
        speakerAvatar: "👩‍💻",
        charPrompt: "Great! What do you do when the backend team is late with their work?",
        ideal: "I usually make simple test data so that I can keep working without waiting.",
        keywords: [
          { phrase: "simple test data", hintFa: "(داده‌های تستی ساده)", weight: 35 },
          { phrase: "keep working", hintFa: "(ادامه دادن به کار)", weight: 30 },
        ],
        vocabUpgrade: {
          learner: "I make fake data so I wait not",
          native: "I create sample data so my part doesn't get delayed.",
          noteFa: "ساختار 'so that I can keep working' بیان استاندارد B1 برای حل مشکل کاری است.",
        },
      },
      {
        speakerName: "Team Lead",
        roleFa: "سرپرست تیم",
        speakerAvatar: "👩‍💻",
        charPrompt: "That proactive attitude is great! Let's talk again after tomorrow's morning meeting.",
        ideal: "That sounds like a good plan. I look forward to working with everyone!",
        keywords: [
          { phrase: "good plan", hintFa: "(برنامه خوب)", weight: 30 },
          { phrase: "look forward to", hintFa: "(مشتاق بودن برای)", weight: 35 },
        ],
        vocabUpgrade: {
          learner: "Yes good plan I do good work",
          native: "Sounds great! I'm really looking forward to working with the team.",
          noteFa: "اصطلاح 'look forward to' یکی از مهم‌ترین اصطلاحات پرکاربرد سطح B1 است.",
        },
      },
    ],
  },
  {
    titleFa: "مخالفت مؤدبانه و پیشنهاد راهکار در جلسه کاری",
    titleEn: "Polite Disagreement in a Work Meeting",
    scenarioFa: "همکارت پیشنهاد استفاده از یک روش قدیمی را می‌دهد. باید با لحنی محترمانه نظرت را بیان کنی.",
    locationContextFa: "اتاق جلسه شرکت",
    turns: [
      {
        speakerName: "Senior Dev",
        roleFa: "همکار ارشد",
        speakerAvatar: "👨‍💻",
        charPrompt: "I think we should stick with our old database for the new project.",
        ideal: "I see your point, but wouldn't a newer system be much faster for our users?",
        keywords: [
          { phrase: "I see your point", hintFa: "(نظرت را می‌فهمم، اما...)", weight: 35 },
          { phrase: "much faster", hintFa: "(خیلی سریع‌تر)", weight: 30 },
        ],
        vocabUpgrade: {
          learner: "No old database is bad and slow",
          native: "I see your point, but a newer tool might give us much better speed.",
          noteFa: "قالب 'I see your point, but wouldn't... be faster?' بهترین فرمول مخالفت مؤدبانه در B1 است.",
        },
      },
      {
        speakerName: "Senior Dev",
        roleFa: "همکار ارشد",
        speakerAvatar: "👨‍💻",
        charPrompt: "That might be true, but learning a new tool will take two extra weeks.",
        ideal: "That is a fair point, but spending two weeks now will save us a lot of trouble later.",
        keywords: [
          { phrase: "fair point", hintFa: "(نکته و حرف درست و منطقی)", weight: 30 },
          { phrase: "save us a lot of trouble", hintFa: "(صرفه‌جویی در دردسرهای بعدی)", weight: 35 },
        ],
        vocabUpgrade: {
          learner: "Two weeks is okay later we get trouble",
          native: "That's a fair point, but it will save us from bigger headaches down the road.",
          noteFa: "اصطلاح 'fair point' و ترکیب 'save us trouble' در سطح اینترمدیت بسیار کاربردی است.",
        },
      },
      {
        speakerName: "Senior Dev",
        roleFa: "همکار ارشد",
        speakerAvatar: "👨‍💻",
        charPrompt: "Good thinking. Let's do a quick speed test this afternoon to see the difference.",
        ideal: "That sounds like a fair compromise. I can set up the test right after lunch.",
        keywords: [
          { phrase: "fair compromise", hintFa: "(توافق و مصالحه منصفانه)", weight: 35 },
          { phrase: "set up the test", hintFa: "(آماده کردن تست)", weight: 30 },
        ],
        vocabUpgrade: {
          learner: "Okay good we test together",
          native: "Sounds like a fair deal; I'll get the test ready right after lunch.",
          noteFa: "واژه 'compromise' (توافق و سازش) از لغات کلیدی سطح B1 است.",
        },
      },
    ],
  },
  {
    titleFa: "توصیف تجربه یک سفر خاطره‌انگیز",
    titleEn: "Narrating a Memorable Travel Story",
    scenarioFa: "در یک گفتگوی دوستانه، ماجرای یک سفر جالب و اتفاقات غیرمنتظره آن را تعریف می‌کنی.",
    locationContextFa: "گپ دوستانه درباره سفر",
    turns: [
      {
        speakerName: "Podcast Host",
        roleFa: "مجری پادکست",
        speakerAvatar: "🎙️",
        charPrompt: "Tell us about a trip where something unexpected happened, but it turned out great!",
        ideal: "Two years ago in Turkey, our balloon ride was cancelled because of thick fog, so we explored ancient caves instead.",
        keywords: [
          { phrase: "because of thick fog", hintFa: "(به دلیل مه غلیظ)", weight: 35 },
          { phrase: "explored ancient caves", hintFa: "(غارهای کهن را گشتیم)", weight: 30 },
        ],
        vocabUpgrade: {
          learner: "Fog came balloon stop we went cave",
          native: "Our balloon flight got cancelled because of bad fog, so we went exploring caves instead.",
          noteFa: "ساختار گذشته ساده و ربط با 'because of ... so ... instead' تسلط B1 را به خوبی نشان می‌دهد.",
        },
      },
      {
        speakerName: "Podcast Host",
        roleFa: "مجری پادکست",
        speakerAvatar: "🎙️",
        charPrompt: "That sounds amazing! What was the most interesting thing you saw in those caves?",
        ideal: "We met a local family who had been making traditional pottery in the cave for generations.",
        keywords: [
          { phrase: "met a local family", hintFa: "(یک خانواده محلی را دیدیم)", weight: 35 },
          { phrase: "traditional pottery", hintFa: "(سفالگری سنتی)", weight: 30 },
        ],
        vocabUpgrade: {
          learner: "We found people make pots inside cave",
          native: "We met a lovely local family who made handmade pottery right inside the caves.",
          noteFa: "واژه 'traditional pottery' و ساختار موصولی نمونه بارز B1 جذاب است.",
        },
      },
      {
        speakerName: "Podcast Host",
        roleFa: "مجری پادکست",
        speakerAvatar: "🎙️",
        charPrompt: "That is so cool! What advice would you give to people when travel plans go wrong?",
        ideal: "Do not get upset when plans change, because unexpected moments often make the best memories.",
        keywords: [
          { phrase: "when plans change", hintFa: "(وقتی برنامه‌ها تغییر می‌کند)", weight: 35 },
          { phrase: "make the best memories", hintFa: "(بهترین خاطرات را می‌سازد)", weight: 35 },
        ],
        vocabUpgrade: {
          learner: "Don't be sad if bad thing happen in travel",
          native: "Don't worry when things change—surprises usually become your best travel stories.",
          noteFa: "جمله روان و پرکاربرد 'make the best memories' یک نتیجه‌گیری گرم و طبیعی B1 است.",
        },
      },
    ],
  },
  {
    titleFa: "تقاضای مهلت برای تحویل پروژه از استاد",
    titleEn: "Requesting an Assignment Extension",
    scenarioFa: "به علت بیماری نتوانسته‌ای گزارش را سر وقت تمام کنی و تقاضای دو روز مهلت اضافه داری.",
    locationContextFa: "دفتر استاد در دانشگاه",
    turns: [
      {
        speakerName: "Professor Collins",
        roleFa: "استاد راهنما",
        speakerAvatar: "👨‍🏫",
        charPrompt: "Come in. You wrote in your email that you're having trouble finishing tomorrow's project?",
        ideal: "Good morning Professor Collins. Unfortunately, I was very sick with the flu this week and could not finish my research.",
        keywords: [
          { phrase: "sick with the flu", hintFa: "(بیمار مبتلا به آنفولانزا)", weight: 35 },
          { phrase: "could not finish", hintFa: "(نتوانستم تمام کنم)", weight: 30 },
        ],
        vocabUpgrade: {
          learner: "I was sick with flu so I cannot finish",
          native: "I caught a bad flu this week, which made it really hard to finish my research paper.",
          noteFa: "افعال مدال گذشته 'could not finish' و 'was sick with' کاملاً منطبق بر B1 هستند.",
        },
      },
      {
        speakerName: "Professor Collins",
        roleFa: "استاد راهنما",
        speakerAvatar: "👨‍🏫",
        charPrompt: "I'm sorry to hear that. Have you done the research and collected the information you need?",
        ideal: "Yes, all my research is done; I just need two more days to write and check the final report.",
        keywords: [
          { phrase: "research is done", hintFa: "(تحقیق و جمع‌آوری تمام شده)", weight: 30 },
          { phrase: "two more days", hintFa: "(دو روز دیگر)", weight: 35 },
        ],
        vocabUpgrade: {
          learner: "I have data I just need 2 days write",
          native: "Yes, I've gathered all my notes; I just need another forty-eight hours to write it up cleanly.",
          noteFa: "ساده‌سازی لغات سنگین آکادمیک به 'write and check the final report'.",
        },
      },
      {
        speakerName: "Professor Collins",
        roleFa: "استاد راهنما",
        speakerAvatar: "👨‍🏫",
        charPrompt: "Under these circumstances, you can submit it by Friday at 5:00 PM. Please get some rest.",
        ideal: "Thank you so much for your understanding, Professor Collins. I will do my very best on the paper.",
        keywords: [
          { phrase: "thank you so much for your understanding", hintFa: "(از درکتان بسیار متشکرم)", weight: 40 },
          { phrase: "do my very best", hintFa: "(تمام تلاشم را خواهم کرد)", weight: 30 },
        ],
        vocabUpgrade: {
          learner: "Thank you for giving time I write good",
          native: "Thank you so much for being flexible, Professor Collins. I'll make sure it's top quality.",
          noteFa: "عبارت 'Thank you so much for your understanding' مؤدب‌ترین جمله استاندارد B1 برای محیط دانشگاهی است.",
        },
      },
    ],
  },
  {
    titleFa: "حل اختلاف بر سر کارهای خانه با هم‌اتاقی",
    titleEn: "Sharing House Chores with a Roommate",
    scenarioFa: "سینک ظرفشویی پر شده و نوبت هم‌اتاقی‌ات بوده است. می‌خواهید دوستانه قرار جدیدی بگذارید.",
    locationContextFa: "آشپزخانه آپارتمان دانشجویی",
    turns: [
      {
        speakerName: "Roommate Sam",
        roleFa: "هم‌اتاقی",
        speakerAvatar: "🛋️",
        charPrompt: "Hey, are you upset about the dirty dishes in the sink? I had two big exams today and felt exhausted.",
        ideal: "I understand exam stress, Sam, but leaving dirty dishes makes the kitchen messy and hard for others to cook.",
        keywords: [
          { phrase: "understand exam stress", hintFa: "(درک استرس امتحانات)", weight: 35 },
          { phrase: "hard for others to cook", hintFa: "(آشپزی را برای بقیه سخت می‌کند)", weight: 35 },
        ],
        vocabUpgrade: {
          learner: "Don't leave dirty dishes it is bad",
          native: "I know you're stressed with exams, but a full sink makes it tough for anyone else to cook.",
          noteFa: "بیان همدلانه با فرمول 'I understand ..., but leaving ... makes it hard' در B1.",
        },
      },
      {
        speakerName: "Roommate Sam",
        roleFa: "هم‌اتاقی",
        speakerAvatar: "🛋️",
        charPrompt: "You're right, I'm sorry. How can we organize chores better so this doesn't happen again?",
        ideal: "How about a simple rule: whoever cooks dinner does not have to do the dishes that night?",
        keywords: [
          { phrase: "simple rule", hintFa: "(قانون ساده)", weight: 30 },
          { phrase: "does not have to do the dishes", hintFa: "(مجبور نیست ظرف‌ها را بشوید)", weight: 40 },
        ],
        vocabUpgrade: {
          learner: "We make list one cook one wash",
          native: "Why don't we agree that whoever cooks gets a pass on doing the dishes?",
          noteFa: "استفاده از فعل نیمه‌وجهی B1 'does not have to' به جای عبارت سنگین و اداری 'is exempt from'.",
        },
      },
      {
        speakerName: "Roommate Sam",
        roleFa: "هم‌اتاقی",
        speakerAvatar: "🛋️",
        charPrompt: "That sounds like a great idea! I will wash the dishes right now and take out the trash.",
        ideal: "Great teamwork! I will make some hot tea for both of us while you finish.",
        keywords: [
          { phrase: "Great teamwork", hintFa: "(همکاری عالی)", weight: 30 },
          { phrase: "while you finish", hintFa: "(در حالی که کارت را تمام می‌کنی)", weight: 35 },
        ],
        vocabUpgrade: {
          learner: "Good job I make tea for drink",
          native: "That's great! I'll put the kettle on for some tea while you clean up.",
          noteFa: "استفاده از 'while you finish' برای اتصال دو عمل همزمان در سطح B1.",
        },
      },
    ],
  },
  {
    titleFa: "نظر دادن درباره یک فیلم در جمع دوستان",
    titleEn: "Sharing Opinions About a Movie with Friends",
    scenarioFa: "تازه از سینما بیرون آمده‌اید و درباره پایان‌بندی غافلگیرکننده فیلم با دوستت صحبت می‌کنی.",
    locationContextFa: "کافه جلوی سالن سینما",
    turns: [
      {
        speakerName: "Film Enthusiast",
        roleFa: "علاقه‌مند سینما",
        speakerAvatar: "🎬",
        charPrompt: "That ending was unbelievable! Did you think the main character was dreaming or was it real?",
        ideal: "In my opinion, the director wanted to leave it as a mystery so the audience could decide for themselves.",
        keywords: [
          { phrase: "In my opinion", hintFa: "(به نظر من)", weight: 30 },
          { phrase: "decide for themselves", hintFa: "(خودشان تصمیم بگیرند)", weight: 35 },
        ],
        vocabUpgrade: {
          learner: "The end was not clear on purpose",
          native: "I think the director kept it open on purpose so everyone could make up their own mind.",
          noteFa: "جایگزینی عبارت سنگین و فلسفی با 'leave it as a mystery so the audience could decide'.",
        },
      },
      {
        speakerName: "Film Enthusiast",
        roleFa: "علاقه‌مند سینما",
        speakerAvatar: "🎬",
        charPrompt: "What did you think of the middle part? Some people felt the dialogue was a bit slow.",
        ideal: "I disagree; the slow parts made the story more exciting because we did not know what would happen next.",
        keywords: [
          { phrase: "I disagree", hintFa: "(من مخالفم)", weight: 30 },
          { phrase: "more exciting", hintFa: "(هیجان‌انگیزتر)", weight: 35 },
        ],
        vocabUpgrade: {
          learner: "Slow was good because end was exciting",
          native: "I disagree; the quiet moments built up the suspense for a much bigger payoff at the end.",
          noteFa: "ساده‌سازی 'immense psychological tension' به 'made the story more exciting'.",
        },
      },
      {
        speakerName: "Film Enthusiast",
        roleFa: "علاقه‌مند سینما",
        speakerAvatar: "🎬",
        charPrompt: "That makes a lot of sense! What score would you give the movie out of five stars?",
        ideal: "I would give it four and a half stars because the acting and the story were both wonderful.",
        keywords: [
          { phrase: "four and a half stars", hintFa: "(چهار ستاره و نیم)", weight: 35 },
          { phrase: "the story were both wonderful", hintFa: "(داستان و بازیگری هر دو عالی بودند)", weight: 35 },
        ],
        vocabUpgrade: {
          learner: "4.5 stars because camera and story great",
          native: "An easy 4.5 out of 5 for great acting and a really memorable story.",
          noteFa: "پرهیز از عبارات آکادمیک سینمایی و استفاده از لغات کاربردی B1.",
        },
      },
    ],
  },
  {
    titleFa: "شرح علائم سردرد و آلرژی در داروخانه",
    titleEn: "Explaining Symptoms at a Pharmacy",
    scenarioFa: "در سفر خارجی دچار سردرد و آلرژی شدی و از داروساز داروی غیرخواب‌آور روزانه می‌خواهی.",
    locationContextFa: "داروخانه شبانه‌روزی",
    turns: [
      {
        speakerName: "Pharmacist",
        roleFa: "دکتر داروساز",
        speakerAvatar: "💊",
        charPrompt: "Good afternoon. How can I help you today? Are you feeling unwell?",
        ideal: "Hello. I have a bad headache and a runny nose because of my seasonal allergies.",
        keywords: [
          { phrase: "bad headache", hintFa: "(سردرد شدید)", weight: 35 },
          { phrase: "seasonal allergies", hintFa: "(آلرژی فصلی)", weight: 35 },
        ],
        vocabUpgrade: {
          learner: "Head beating pain and eyes water",
          native: "Hello. I've got a really bad headache and watery eyes from seasonal allergies.",
          noteFa: "واژگان پزشکی روزمره B1: 'bad headache', 'runny nose', 'seasonal allergies'.",
        },
      },
      {
        speakerName: "Pharmacist",
        roleFa: "دکتر داروساز",
        speakerAvatar: "💊",
        charPrompt: "Do you need allergy pills that will not make you feel sleepy during the day?",
        ideal: "Yes, please! It must be non-drowsy because I have to drive and work all day.",
        keywords: [
          { phrase: "non-drowsy", hintFa: "(داروی غیرخواب‌آور)", weight: 40 },
          { phrase: "drive and work", hintFa: "(رانندگی و کار کردن)", weight: 30 },
        ],
        vocabUpgrade: {
          learner: "No sleep medicine because I drive car",
          native: "Yes, exactly! Non-drowsy pills please, since I have to drive and be sharp for work.",
          noteFa: "اصطلاح 'non-drowsy' در داروخانه‌های انگلیسی‌زبان پرکاربردترین واژه است.",
        },
      },
      {
        speakerName: "Pharmacist",
        roleFa: "دکتر داروساز",
        speakerAvatar: "💊",
        charPrompt: "Here are daytime allergy tablets. Take one pill once a day with a glass of water.",
        ideal: "Thank you very much for your advice. How much do I owe you?",
        keywords: [
          { phrase: "Thank you very much for your advice", hintFa: "(از راهنمایی شما بسیار متشکرم)", weight: 35 },
          { phrase: "How much do I owe you", hintFa: "(چقدر تقدیم کنم؟)", weight: 35 },
        ],
        vocabUpgrade: {
          learner: "Thank you how much money I pay?",
          native: "Thanks a lot for the advice! How much do I owe you for these?",
          noteFa: "عبارت 'How much do I owe you?' صمیمی و طبیعی‌ترین نحوه پرسیدن قیمت داروست.",
        },
      },
    ],
  },
  {
    titleFa: "برنامه‌ریزی جشن خداحافظی برای همکار",
    titleEn: "Planning a Farewell Party for a Co-worker",
    scenarioFa: "همکارتان بعد از چند سال در حال جابه‌جایی است و می‌خواهید بدون اینکه بفهمد برایش جشن بگیرید.",
    locationContextFa: "کافی‌شاپ شرکت بعد از کار",
    turns: [
      {
        speakerName: "Co-worker Nora",
        roleFa: "همکار تیم",
        speakerAvatar: "🎉",
        charPrompt: "David is moving away next Friday! We really should organize a nice goodbye party for him, right?",
        ideal: "Of course! He has been a great teammate for five years. We should plan a surprise party for him.",
        keywords: [
          { phrase: "great teammate", hintFa: "(هم‌تیمی فوق‌العاده)", weight: 30 },
          { phrase: "surprise party", hintFa: "(جشن غافلگیرکننده)", weight: 40 },
        ],
        vocabUpgrade: {
          learner: "Yes sure we make party for him surprise",
          native: "Definitely! He's been fantastic to work with. Let's throw him a surprise farewell party!",
          noteFa: "جایگزینی 'our rock' با 'great teammate' و 'surprise party' برای سادگی و روانی در B1.",
        },
      },
      {
        speakerName: "Co-worker Nora",
        roleFa: "همکار تیم",
        speakerAvatar: "🎉",
        charPrompt: "How can we make sure he doesn't find out before Friday afternoon?",
        ideal: "We can put a fake work meeting on his calendar so that he arrives without guessing anything.",
        keywords: [
          { phrase: "put a fake meeting", hintFa: "(گذاشتن یک جلسه صوری در تقویم)", weight: 35 },
          { phrase: "without guessing anything", hintFa: "(بدون اینکه چیزی حدس بزند)", weight: 35 },
        ],
        vocabUpgrade: {
          learner: "We say meeting room B he think real",
          native: "We can put a fake project sync on his calendar so he has no idea what's coming.",
          noteFa: "جایگزینی واژه نادر 'unsuspecting' با عبارت طبیعی B1: 'without guessing anything'.",
        },
      },
      {
        speakerName: "Co-worker Nora",
        roleFa: "همکار تیم",
        speakerAvatar: "🎉",
        charPrompt: "That is a smart plan! I will order the cake, and can you collect money from the team for his gift?",
        ideal: "Sure, no problem! I will send a quick message to the team to collect the money.",
        keywords: [
          { phrase: "no problem", hintFa: "(مشکلی نیست / حتماً)", weight: 30 },
          { phrase: "collect the money", hintFa: "(جمع‌آوری پول برای هدیه)", weight: 35 },
        ],
        vocabUpgrade: {
          learner: "I take money from team for buy present",
          native: "Sure thing! I'll ping the team and handle the gift collection right away.",
          noteFa: "حذف عبارت اداری و غریب 'discreet digital pool' و استفاده از 'collect the money for his gift'.",
        },
      },
    ],
  },
  {
    titleFa: "مرحله پایانی B1: مذاکره شرایط کاری و تحویل پروژه",
    titleEn: "B1 Boss Level: Discussing Project Scope & Deadlines",
    scenarioFa: "کارفرما برای یک پروژه فشرده تقاضای تخفیف دارد. باید با زبانی روان و محترمانه شرایط کار را مدیریت کنی.",
    locationContextFa: "جلسه آنلاین با کارفرما",
    turns: [
      {
        speakerName: "Client Mark",
        roleFa: "کارفرما",
        speakerAvatar: "💼",
        charPrompt: "We love your work, but our budget is tight. Can you give us a twenty percent discount?",
        ideal: "I understand your budget limits, but if I lower the price by twenty percent, we will have to remove some extra features.",
        keywords: [
          { phrase: "understand your budget limits", hintFa: "(محدودیت بودجه شما را درک می‌کنم)", weight: 35 },
          { phrase: "remove some extra features", hintFa: "(حذف کردن برخی قابلیت‌های اضافی)", weight: 35 },
        ],
        vocabUpgrade: {
          learner: "I cannot do 20 discount because less work",
          native: "I understand your budget is tight, but a 20% discount means we'd have to drop a few deliverables.",
          noteFa: "جایگزینی عبارت سنگین اداری 'scaling back key deliverables' با 'remove some extra features'.",
        },
      },
      {
        speakerName: "Client Mark",
        roleFa: "کارفرما",
        speakerAvatar: "💼",
        charPrompt: "We really need the mobile design and all the automated tests to be included.",
        ideal: "In that case, we can keep all features if you split the total payment into two stages.",
        keywords: [
          { phrase: "keep all features", hintFa: "(حفظ همه امکانات و ویژگی‌ها)", weight: 35 },
          { phrase: "split the total payment", hintFa: "(تقسیم پرداخت به دو بخش)", weight: 35 },
        ],
        vocabUpgrade: {
          learner: "You pay in two times so easy money",
          native: "We can keep the full scope if you split the payment into two milestones to help with cash flow.",
          noteFa: "ساده‌سازی 'milestone payments to ease cash flow' به 'split the total payment into two stages'.",
        },
      },
      {
        speakerName: "Client Mark",
        roleFa: "کارفرما",
        speakerAvatar: "💼",
        charPrompt: "Paying in two stages works very well for our cash flow. We have a deal!",
        ideal: "Wonderful! I will prepare the simple agreement and start work on Monday. Glad to work with you!",
        keywords: [
          { phrase: "prepare the simple agreement", hintFa: "(آماده کردن توافق‌نامه کاری)", weight: 35 },
          { phrase: "Glad to work with you", hintFa: "(خوشحالم که با شما همکاری می‌کنم)", weight: 30 },
        ],
        vocabUpgrade: {
          learner: "Good I send contract paper start Monday",
          native: "Awesome! I'll send over the short contract and kick things off on Monday. Really glad to partner with you!",
          noteFa: "جایگزینی اصطلاح ثقیل 'service level agreement' با 'prepare the simple agreement'.",
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
        charPrompt: "Whistleblowers allege your security patches were ignored for months. How do you defend that negligence?",
        ideal: "I completely reject the claim of negligence; our defense protocols immediately isolated all payment data.",
        keywords: [
          { phrase: "reject the claim", hintFa: "(ادعا را کاملاً رد می‌کنم)", weight: 50 },
          { phrase: "isolated all payment data", hintFa: "(جداسازی داده‌های پرداخت)", weight: 50 },
        ],
        vocabUpgrade: {
          learner: "We were not careless and our team protected the card numbers.",
          native: "I reject the premise of negligence; our systems contained the intrusion immediately.",
          noteFa: "عبارت 'reject the premise' شیوه دیپلماتیک مسلط برای رد فرض منفی خبرنگار است.",
        },
      },
      {
        speakerName: "Investigative Reporter",
        roleFa: "خبرنگار تحقیقی",
        speakerAvatar: "🎙️",
        charPrompt: "If the breach was contained, why did your company stock tumble ten percent today?",
        ideal: "Market volatility reflects short-term uncertainty, but our independent security audit will restore investor confidence.",
        keywords: [
          { phrase: "Market volatility reflects", hintFa: "(نوسان بازار منعکس‌کننده... است)", weight: 50 },
          { phrase: "restore investor confidence", hintFa: "(بازگرداندن اعتماد سرمایه‌گذاران)", weight: 50 },
        ],
        vocabUpgrade: {
          learner: "The stock fell because investors panicked after hearing the news.",
          native: "Short-term volatility reflects initial uncertainty, but our independent audit will restore trust.",
          noteFa: "استفاده از 'Market volatility' بار روانی سقوط سهام را در مصاحبه کاهش می‌دهد.",
        },
      },
      {
        speakerName: "Investigative Reporter",
        roleFa: "خبرنگار تحقیقی",
        speakerAvatar: "🎙️",
        charPrompt: "Will your chief executive agree to testify under oath before Congress next Wednesday?",
        ideal: "Our CEO welcomes the opportunity to provide full transparency and address all congressional questions.",
        keywords: [
          { phrase: "welcomes the opportunity", hintFa: "(از این فرصت استقبال می‌کند)", weight: 50 },
          { phrase: "provide full transparency", hintFa: "(شفافیت کامل ارائه دهد)", weight: 50 },
        ],
        vocabUpgrade: {
          learner: "Yes, our boss is ready to go to Congress and answer questions.",
          native: "Our leadership welcomes the opportunity to cooperate fully with regulatory authorities.",
          noteFa: "فرمول 'welcomes the opportunity' رویکردی شجاعانه و مبتنی بر شفافیت است.",
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
        charPrompt: "Candidate, your econometric model assumes perfect competition, which contradicts empirical realities in developing markets.",
        ideal: "While models require certain simplifications, our sensitivity tests demonstrate that the primary findings remain robust.",
        keywords: [
          { phrase: "require certain simplifications", hintFa: "(نیازمند ساده‌سازی‌های مشخصی است)", weight: 50 },
          { phrase: "primary findings remain robust", hintFa: "(یافته‌های اصلی استوار باقی می‌مانند)", weight: 50 },
        ],
        vocabUpgrade: {
          learner: "I know it is simplified, but our test results still stay the same.",
          native: "While abstractions are necessary, our sensitivity analyses confirm that the conclusions hold.",
          noteFa: "کلمه 'robust' در دفاعیات آکادمیک نشانه استحکام آماری یافته‌ها است.",
        },
      },
      {
        speakerName: "Lead External Examiner",
        roleFa: "داور ارشد بین‌المللی",
        speakerAvatar: "🧐",
        charPrompt: "How do you justify your sampling technique when the historical dataset spans high inflation?",
        ideal: "We addressed that limitation by cross-validating our regression estimates against several stable international economies.",
        keywords: [
          { phrase: "addressed that limitation", hintFa: "(آن محدودیت را برطرف کردیم)", weight: 50 },
          { phrase: "cross-validating our regression", hintFa: "(اعتبارسنجی متقاطع رگرسیون)", weight: 50 },
        ],
        vocabUpgrade: {
          learner: "We checked the data with other countries that had normal inflation.",
          native: "We controlled for structural breaks by benchmarking results across comparable economies.",
          noteFa: "عبارت 'addressed that limitation' فروتنی علمی همراه با تسلط را نشان می‌دهد.",
        },
      },
      {
        speakerName: "Lead External Examiner",
        roleFa: "داور ارشد بین‌المللی",
        speakerAvatar: "🧐",
        charPrompt: "Your defense is intellectually rigorous. How do you intend to publish these contentious findings?",
        ideal: "I am deeply grateful for your critique, which will strengthen our forthcoming journal manuscript.",
        keywords: [
          { phrase: "grateful for your critique", hintFa: "(سپاسگزار نقد سازنده شما هستم)", weight: 50 },
          { phrase: "forthcoming journal manuscript", hintFa: "(مقاله در دست چاپ در ژورنال)", weight: 50 },
        ],
        vocabUpgrade: {
          learner: "Thanks for the feedback, I will fix these points before publishing.",
          native: "Your insights will undoubtedly enrich the final revision of our academic manuscript.",
          noteFa: "پاسخ محترمانه 'grateful for your critique' تعامل آکادمیک پخته را بازتاب می‌دهد.",
        },
      },
    ],
  },
  {
    titleFa: "بازجویی متقابل در دادگاه شبیه‌سازی‌شده",
    titleEn: "Simulated Courtroom Cross-Examination",
    scenarioFa: "به عنوان وکیل مدافع، تناقضات آشکار در شهادت شاهد عینی را زیر سوال ببر.",
    locationContextFa: "دادگاه اولد بیلی لندن",
    turns: [
      {
        speakerName: "Prosecuting Attorney",
        roleFa: "دادستان دادگاه",
        speakerAvatar: "⚖️",
        charPrompt: "Counsel, the witness claims they recognized my client under the streetlamp fifty yards away.",
        ideal: "Yet in your original sworn statement, you admitted that visibility was severely limited by rain.",
        keywords: [
          { phrase: "original sworn statement", hintFa: "(اظهارات رسمی سوگندخورده اولیه)", weight: 50 },
          { phrase: "severely limited by rain", hintFa: "(به شدت به خاطر باران محدود بود)", weight: 50 },
        ],
        vocabUpgrade: {
          learner: "Earlier you said you could not see clearly because of dark rain.",
          native: "Your sworn deposition explicitly states that heavy precipitation impaired your field of vision.",
          noteFa: "عبارت 'sworn statement' تناقض بیانات شاهد با واقعیت را برجسته می‌کند.",
        },
      },
      {
        speakerName: "Prosecuting Attorney",
        roleFa: "دادستان دادگاه",
        speakerAvatar: "⚖️",
        charPrompt: "I might have been mistaken about the weather, but I am positive about his face!",
        ideal: "So your positive identification depends entirely on a fleeting glance in a dark alleyway?",
        keywords: [
          { phrase: "positive identification depends", hintFa: "(شناسایی قطعی بستگی دارد به...)", weight: 50 },
          { phrase: "on a fleeting glance", hintFa: "(به یک نگاه گذرا و کوتاه)", weight: 50 },
        ],
        vocabUpgrade: {
          learner: "You only saw him for one second in the dark street.",
          native: "Your identification relies on a momentary perception under compromised visual conditions.",
          noteFa: "اصطلاح 'fleeting glance' (نگاه گذرا) تردید جدی در قطعیت شناسایی ایجاد می‌کند.",
        },
      },
      {
        speakerName: "Prosecuting Attorney",
        roleFa: "دادستان دادگاه",
        speakerAvatar: "⚖️",
        charPrompt: "Objection, Your Honor! Counsel is badgering the witness regarding optical conditions.",
        ideal: "The testimony contains glaring factual contradictions and cannot establish guilt beyond all reasonable doubt.",
        keywords: [
          { phrase: "glaring factual contradictions", hintFa: "(تناقضات آشکار در حقایق)", weight: 50 },
          { phrase: "beyond all reasonable doubt", hintFa: "(فراتر از هرگونه شک معقول)", weight: 50 },
        ],
        vocabUpgrade: {
          learner: "The witness is confused and this evidence cannot prove anything.",
          native: "These material inconsistencies render the testimony insufficient to satisfy the burden of proof.",
          noteFa: "عبارت 'beyond all reasonable doubt' استاندارد طلایی حقوقی محاکم است.",
        },
      },
    ],
  },
  {
    titleFa: "پرزنت جذب سرمایه استارتاپ بیوتک پیشرفته",
    titleEn: "Venture Capital Pitch for Autonomous Biotech",
    scenarioFa: "پلتفرم کشف خودکار دارو را به سرمایه‌گذاران سخت‌گیر سیلیکون‌ولی ارائه بده.",
    locationContextFa: "دفتر ونچر کپیتال در ساند هیل رود",
    turns: [
      {
        speakerName: "General Partner",
        roleFa: "شریک ارشد صندوق سرمایه‌گذاری",
        speakerAvatar: "💼",
        charPrompt: "Traditional pharma spends billions on trials. What gives your automated platform a defensible competitive moat?",
        ideal: "Our automated platform synthesizes and tests novel drug candidates in hours rather than months.",
        keywords: [
          { phrase: "synthesizes and tests", hintFa: "(سنتز و آزمایش می‌کند)", weight: 50 },
          { phrase: "novel drug candidates", hintFa: "(نامزدهای دارویی جدید)", weight: 50 },
        ],
        vocabUpgrade: {
          learner: "We find new medicine much faster than big pharma with computers.",
          native: "Our closed-loop robotic workflow compresses discovery timelines by an order of magnitude.",
          noteFa: "استفاده از 'novel drug candidates' ادبیات دقیق بیوتک و سرمایه‌گذاری خطرپذیر است.",
        },
      },
      {
        speakerName: "General Partner",
        roleFa: "شریک ارشد صندوق سرمایه‌گذاری",
        speakerAvatar: "💼",
        charPrompt: "How do you plan to compete once giant pharmaceutical corporations build their own automated labs?",
        ideal: "Legacy firms face bureaucratic inertia, whereas our agile engineering culture deploys breakthroughs far more rapidly.",
        keywords: [
          { phrase: "face bureaucratic inertia", hintFa: "(با سکون و لختی بوروکراتیک روبرو هستند)", weight: 50 },
          { phrase: "agile engineering culture", hintFa: "(فرهنگ مهندسی چابک و سریع)", weight: 50 },
        ],
        vocabUpgrade: {
          learner: "Big companies are very slow at making decisions compared to us.",
          native: "Incumbents are hampered by legacy hierarchies, giving our focused team a structural advantage.",
          noteFa: "اصطلاح 'bureaucratic inertia' مزیت سرعت استارتاپ را اثبات می‌کند.",
        },
      },
      {
        speakerName: "General Partner",
        roleFa: "شریک ارشد صندوق سرمایه‌گذاری",
        speakerAvatar: "💼",
        charPrompt: "We are prepared to lead this round if you grant us two board seats.",
        ideal: "We welcome your strategic partnership, provided our founders retain voting control over scientific direction.",
        keywords: [
          { phrase: "welcome your strategic partnership", hintFa: "(از شراکت راهبردی استقبال می‌کنیم)", weight: 50 },
          { phrase: "retain voting control", hintFa: "(حفظ حق رأی و کنترل مدیریتی)", weight: 50 },
        ],
        vocabUpgrade: {
          learner: "We want your money and advice, but we must decide the science.",
          native: "We value your governance insights, provided our scientific autonomy remains firmly protected.",
          noteFa: "عبارت 'retain voting control' نشان‌دهنده هوش مذاکراتی بنیان‌گذاران است.",
        },
      },
    ],
  },
  {
    titleFa: "مذاکره تجاری و دیپلماتیک دوجانبه در بن‌بست",
    titleEn: "Bilateral Diplomatic Trade Standoff",
    scenarioFa: "در مذاکره تعرفه‌ای بین دو کشور، بر سر دسترسی به بازار فناوری به توافقی شرافتمندانه برس.",
    locationContextFa: "کاخ ملل، ژنو",
    turns: [
      {
        speakerName: "Chief Negotiator",
        roleFa: "سرمذاکره‌کننده تجاری",
        speakerAvatar: "🌐",
        charPrompt: "Your recent tariff increases violate the spirit of our mutual trade pact. Why should talks continue?",
        ideal: "Our strategic tariffs protect emerging domestic industries, yet we remain fully open to mutual concessions.",
        keywords: [
          { phrase: "protect emerging domestic industries", hintFa: "(محافظت از صنایع نوپای داخلی)", weight: 50 },
          { phrase: "open to mutual concessions", hintFa: "(آماده امتیازدهی متقابل هستیم)", weight: 50 },
        ],
        vocabUpgrade: {
          learner: "We raised taxes to help our factories, but we can make a deal.",
          native: "Our trade measures safeguard domestic capacity, but we stand ready for reciprocal adjustments.",
          noteFa: "ترکیب 'mutual concessions' لحن دیپلماتیک سازنده به مذاکره می‌بخشد.",
        },
      },
      {
        speakerName: "Chief Negotiator",
        roleFa: "سرمذاکره‌کننده تجاری",
        speakerAvatar: "🌐",
        charPrompt: "We cannot lift technology export restrictions without transparent regulatory monitoring on your part.",
        ideal: "We propose establishing a joint commission to verify compliance while respecting our sovereign regulatory authority.",
        keywords: [
          { phrase: "establishing a joint commission", hintFa: "(تشکیل یک کمیسیون مشترک)", weight: 50 },
          { phrase: "verify compliance while respecting", hintFa: "(راستی‌آزمایی با احترام به حاکمیت)", weight: 50 },
        ],
        vocabUpgrade: {
          learner: "We can make a shared committee to check the rules together.",
          native: "We advocate an independent bilateral oversight body to ensure verifiable regulatory adherence.",
          noteFa: "اصطلاح 'joint commission' راهکار دیپلماتیک کلاسیک برای حل بن‌بست است.",
        },
      },
      {
        speakerName: "Chief Negotiator",
        roleFa: "سرمذاکره‌کننده تجاری",
        speakerAvatar: "🌐",
        charPrompt: "That balanced mechanism addresses our core security concerns. Shall we instruct our teams to draft the treaty?",
        ideal: "Constructive compromise is the cornerstone of lasting peace; let us proceed with the final agreement.",
        keywords: [
          { phrase: "Constructive compromise is", hintFa: "(سازش سازنده، رکن اساسی است)", weight: 50 },
          { phrase: "proceed with the final agreement", hintFa: "(پیشبرد توافق نهایی)", weight: 50 },
        ],
        vocabUpgrade: {
          learner: "Good agreement is best for both sides, let us write the paper.",
          native: "Principled compromise serves our mutual interests; let us instruct our legal delegations accordingly.",
          noteFa: "جمله 'Constructive compromise is the cornerstone...' پایانی برازنده سطح C1 است.",
        },
      },
    ],
  },
  {
    titleFa: "سخنرانی کلیدی در همایش اخلاق و حاکمیت هوش مصنوعی",
    titleEn: "Keynote Address on AGI Alignment & Existential Risk",
    scenarioFa: "در برابر نخبگان هوش مصنوعی جهان، ضرورت تنظیم‌گری سخت‌افزاری و ایمنی را تبیین کن.",
    locationContextFa: "سالن کنفرانس داووس سوئیس",
    turns: [
      {
        speakerName: "Summit Moderator",
        roleFa: "مجری همایش جهانی",
        speakerAvatar: "🤖",
        charPrompt: "Some innovators argue safety regulations stifle scientific progress. How do you reconcile speed with existential risk?",
        ideal: "Accelerating technological development without robust safety guardrails is not innovation; it is reckless negligence.",
        keywords: [
          { phrase: "robust safety guardrails", hintFa: "(حصارها و تدابیر ایمنی مستحکم)", weight: 50 },
          { phrase: "reckless negligence", hintFa: "(بی‌پروایی و اهمال پرخطر)", weight: 50 },
        ],
        vocabUpgrade: {
          learner: "Moving fast without safety rules is dangerous and foolish.",
          native: "Pursuing raw capability without rigorous alignment safeguards invites catastrophic systemic failure.",
          noteFa: "کالوکیشن 'robust safety guardrails' اصطلاح تخصصی حوزه حاکمیت فناوری است.",
        },
      },
      {
        speakerName: "Summit Moderator",
        roleFa: "مجری همایش جهانی",
        speakerAvatar: "🤖",
        charPrompt: "How can international bodies enforce compliance when foundational code is decentralized globally?",
        ideal: "By shifting regulatory focus toward hardware bottlenecks and specialized semiconductor manufacturing facilities worldwide.",
        keywords: [
          { phrase: "hardware bottlenecks", hintFa: "(تنگناها و نقاط گلوگاهی سخت‌افزاری)", weight: 50 },
          { phrase: "semiconductor manufacturing facilities", hintFa: "(تاسیسات تولید نیمه‌رسانا)", weight: 50 },
        ],
        vocabUpgrade: {
          learner: "We should control the computer chips rather than tracking software.",
          native: "Focusing governance on advanced compute infrastructure provides enforceable points of leverage.",
          noteFa: "راهبرد 'hardware bottlenecks' عملیاتی‌ترین نگاه به رگولاتوری AI است.",
        },
      },
      {
        speakerName: "Summit Moderator",
        roleFa: "مجری همایش جهانی",
        speakerAvatar: "🤖",
        charPrompt: "Are you optimistic that humanity will navigate this unprecedented technological transition safely?",
        ideal: "The future is not predetermined, but an ongoing ethical responsibility that we must shape collectively.",
        keywords: [
          { phrase: "future is not predetermined", hintFa: "(آینده از پیش مقدر نشده است)", weight: 50 },
          { phrase: "ethical responsibility we must shape", hintFa: "(مسئولیت اخلاقی که باید بسازیم)", weight: 50 },
        ],
        vocabUpgrade: {
          learner: "We can make the future good if all countries work together.",
          native: "Our trajectory is not fatalistic; thoughtful human stewardship will determine our technological destiny.",
          noteFa: "عبارت 'ethical responsibility we must shape collectively' انگیزشی و تأثیرگذار است.",
        },
      },
    ],
  },
  {
    titleFa: "مصاحبه چالشی و زنده تلویزیونی سیاسی",
    titleEn: "Hostile Prime-Time Political Interrogation",
    scenarioFa: "در برنامه زنده تلویزیونی، از تصمیم بحث‌برانگیز اصلاح بودجه بهداشت دفاع کن.",
    locationContextFa: "استودیوی بی‌بی‌سی لندن",
    turns: [
      {
        speakerName: "Political Anchor",
        roleFa: "مجری کارکشته سیاسی",
        speakerAvatar: "📺",
        charPrompt: "Minister, you slashed provincial clinic subsidies. Isn't that an outright betrayal of vulnerable working families?",
        ideal: "We restructured administrative spending specifically to redirect funds toward frontline healthcare workers and emergency care.",
        keywords: [
          { phrase: "restructured administrative spending", hintFa: "(بازسازی هزینه‌های اداری)", weight: 50 },
          { phrase: "frontline healthcare workers", hintFa: "(کادر درمان خط مقدم)", weight: 50 },
        ],
        vocabUpgrade: {
          learner: "We cut office costs so that we could pay doctors and nurses more.",
          native: "We trimmed bureaucratic overhead to channel vital resources directly into acute patient care.",
          noteFa: "تعبیر 'restructured administrative spending' پاسخ هوشمندانه به برچسب کاهش بودجه است.",
        },
      },
      {
        speakerName: "Political Anchor",
        roleFa: "مجری کارکشته سیاسی",
        speakerAvatar: "📺",
        charPrompt: "Doctors are protesting nationwide today. How can you claim your hospital reforms are succeeding?",
        ideal: "Structural change inevitably creates friction, but we remain in continuous dialogue with union representatives.",
        keywords: [
          { phrase: "inevitably creates friction", hintFa: "(ناگزیر اصطکاک ایجاد می‌کند)", weight: 50 },
          { phrase: "continuous dialogue with union", hintFa: "(گفتگوی مستمر با اتحادیه)", weight: 50 },
        ],
        vocabUpgrade: {
          learner: "Change is always difficult, but we are talking to the medical unions.",
          native: "Institutional transitions entail friction, which we are resolving through constructive collective bargaining.",
          noteFa: "اصطلاح 'inevitably creates friction' واقع‌بینی مدیریت بحران را نشان می‌دهد.",
        },
      },
      {
        speakerName: "Political Anchor",
        roleFa: "مجری کارکشته سیاسی",
        speakerAvatar: "📺",
        charPrompt: "Voters will remember these disruptions during the general election in November, Minister.",
        ideal: "Democracy thrives on accountability, and I trust citizens will judge us on improved hospital outcomes.",
        keywords: [
          { phrase: "Democracy thrives on accountability", hintFa: "(مردمسالاری با پاسخگویی زنده است)", weight: 50 },
          { phrase: "improved hospital outcomes", hintFa: "(بهبود نتایج درمانی بیمارستان‌ها)", weight: 50 },
        ],
        vocabUpgrade: {
          learner: "People can vote against us if our hospitals do not get better.",
          native: "We welcome electoral scrutiny based on verifiable healthcare metrics rather than media sensationalism.",
          noteFa: "عبارت 'Democracy thrives on accountability' بیانگر اعتمادبه‌نفس سیاسی است.",
        },
      },
    ],
  },
  {
    titleFa: "حل بن‌بست در جلسه هیئت مدیره",
    titleEn: "Resolving Executive Boardroom Stalemate",
    scenarioFa: "در جلسه پرمناقشه هیئت مدیره، پیشنهاد تصاحب خصمانه شرکت را با استدلال قاطع رد کن.",
    locationContextFa: "اتاق هیئت مدیره در منهتن",
    turns: [
      {
        speakerName: "Hostile Director",
        roleFa: "عضو معترض هیئت مدیره",
        speakerAvatar: "👔",
        charPrompt: "The private equity tender offers an immediate premium. Why should shareholders gamble on internal expansion?",
        ideal: "Maximizing short-term cash must not eclipse the compounding long-term value of our proprietary technology platform.",
        keywords: [
          { phrase: "Maximizing short-term cash", hintFa: "(بیشینه‌سازی سود کوتاه‌مدت)", weight: 50 },
          { phrase: "compounding long-term value", hintFa: "(ارزش فزاینده بلندمدت)", weight: 50 },
        ],
        vocabUpgrade: {
          learner: "Selling now gives quick money, but our software will be worth much more.",
          native: "A premature buyout sacrifices the substantial upside of our scalable software assets.",
          noteFa: "مفهوم 'compounding long-term value' استدلال کلیدی هیئت مدیره در برابر خریدهای تهاجمی است.",
        },
      },
      {
        speakerName: "Hostile Director",
        roleFa: "عضو معترض هیئت مدیره",
        speakerAvatar: "👔",
        charPrompt: "What financial evidence proves our enterprise subscriptions will outpace the buyer's lucrative offer?",
        ideal: "Our customer retention rate exceeds ninety percent, generating predictable cash flows that justify our independence.",
        keywords: [
          { phrase: "customer retention rate exceeds", hintFa: "(نرخ حفظ مشتری بالاتر است از...)", weight: 50 },
          { phrase: "generating predictable cash flows", hintFa: "(تولید جریان‌های نقدی پیش‌بینی‌پذیر)", weight: 50 },
        ],
        vocabUpgrade: {
          learner: "Most customers stay with us and pay regularly every year.",
          native: "Our recurring subscription revenue model delivers exceptional margins and sustained cash conversion.",
          noteFa: "کالوکیشن 'predictable cash flows' ستون استدلال ارزش‌گذاری شرکت است.",
        },
      },
      {
        speakerName: "Hostile Director",
        roleFa: "عضو معترض هیئت مدیره",
        speakerAvatar: "👔",
        charPrompt: "How do you propose we placate institutional investors who expected an immediate dividend payout?",
        ideal: "We can initiate a share buyback program while maintaining our disciplined research and development roadmap.",
        keywords: [
          { phrase: "initiate a share buyback", hintFa: "(آغاز برنامه بازخرید سهام)", weight: 50 },
          { phrase: "disciplined research and development", hintFa: "(تحقیق و توسعه هدفمند و منضبط)", weight: 50 },
        ],
        vocabUpgrade: {
          learner: "We can buy back our shares to give money to investors.",
          native: "A targeted capital return via buybacks will satisfy investors without compromising product development.",
          noteFa: "اصطلاح مالی 'share buyback program' راهکار بهینه بازگرداندن سرمایه به سهامداران است.",
        },
      },
    ],
  },
  {
    titleFa: "مناظره فلسفی و نقد هنر معاصر",
    titleEn: "Philosophical Deconstruction of Postmodern Art",
    scenarioFa: "در گالری بین‌المللی تیت مدرن، اصالت اثر هنری مفهومی را در برابر رویکرد ماشینی تبیین کن.",
    locationContextFa: "گالری تیت مدرن لندن",
    turns: [
      {
        speakerName: "Art Critic",
        roleFa: "منتقد ارشد هنری",
        speakerAvatar: "🎨",
        charPrompt: "When every everyday object is exhibited as art, does artistic expression lose all transcendent meaning?",
        ideal: "Artistic significance shifts from physical craftsmanship to the conceptual dialogue provoked between spectator and artifact.",
        keywords: [
          { phrase: "Artistic significance shifts", hintFa: "(اهمیت هنری تغییر مکان می‌دهد)", weight: 50 },
          { phrase: "conceptual dialogue provoked", hintFa: "(گفتگوی مفهومی برانگیخته‌شده)", weight: 50 },
        ],
        vocabUpgrade: {
          learner: "Modern art is about the thoughts it gives people, not hand skills.",
          native: "Contemporary art locates aesthetic value in cognitive friction rather than manual virtuosity.",
          noteFa: "عبارت 'conceptual dialogue' چارچوب فکری نقد هنر معاصر را بیان می‌کند.",
        },
      },
      {
        speakerName: "Art Critic",
        roleFa: "منتقد ارشد هنری",
        speakerAvatar: "🎨",
        charPrompt: "Can synthetic algorithms produce genuine artistic meaning, or merely probabilistic computational mimicry?",
        ideal: "Algorithms generate probability distributions, whereas authentic art demands lived human experience and conscious intentionality.",
        keywords: [
          { phrase: "generate probability distributions", hintFa: "(توزیع‌های احتمالی تولید می‌کنند)", weight: 50 },
          { phrase: "demands lived human experience", hintFa: "(نیازمند زیست تجربی انسانی است)", weight: 50 },
        ],
        vocabUpgrade: {
          learner: "AI only copies patterns, but real art comes from human feelings.",
          native: "Computation reproduces stylistic patterns, but meaning requires human subjectivity and mortality.",
          noteFa: "تمایز بین 'computational mimicry' و 'human intentionality' مبنای نقد فلسفی هنر AI است.",
        },
      },
      {
        speakerName: "Art Critic",
        roleFa: "منتقد ارشد هنری",
        speakerAvatar: "🎨",
        charPrompt: "Your aesthetic defense was thoroughly compelling. Where does human creativity go from here?",
        ideal: "Creativity remains the indelible spark of human consciousness that no technological simulation can replicate.",
        keywords: [
          { phrase: "indelible spark of human consciousness", hintFa: "(جرقه محونشدنی آگاهی انسانی)", weight: 50 },
          { phrase: "technological simulation can replicate", hintFa: "(شبیه‌سازی فناورانه بازتولید کند)", weight: 50 },
        ],
        vocabUpgrade: {
          learner: "Human art will always stay special because machines do not have souls.",
          native: "Art represents an irreducible facet of human existence that resists algorithmic commodification.",
          noteFa: "تعبیر 'indelible spark' (جرقه زوال‌ناپذیر) پایان‌بخش متنی فاخر در سطح C1 است.",
        },
      },
    ],
  },
  {
    titleFa: "مرحله پایانی: دفاع نهایی پروژه ارشد معماری",
    titleEn: "C1 Boss Level: Architectural Jury Master Defense",
    scenarioFa: "در برابر داوران سرشناس بین‌المللی، از طرح بازآفرینی ارگانیک بنای تاریخی دفاع کن.",
    locationContextFa: "سالن ژوری انجمن سلطنتی معماران بریتانیا",
    turns: [
      {
        speakerName: "Jury President",
        roleFa: "رئیس هیئت داوران معماری",
        speakerAvatar: "🏛️",
        charPrompt: "Candidate, your glass canopy disrupts the historic integrity of this twelfth-century cathedral facade.",
        ideal: "The transparent canopy creates a harmonious dialogue between historic stone permanence and modern lightweight architecture.",
        keywords: [
          { phrase: "creates a harmonious dialogue", hintFa: "(گفتگویی هماهنگ پدید می‌آورد)", weight: 50 },
          { phrase: "historic stone permanence", hintFa: "(ماندگاری سنگ‌های تاریخی)", weight: 50 },
        ],
        vocabUpgrade: {
          learner: "The new glass roof looks nice next to the old cathedral walls.",
          native: "The intervention establishes a respectful juxtaposition between medieval masonry and contemporary structural transparency.",
          noteFa: "کالوکیشن 'harmonious dialogue' تکنیک طراحی تلفیقی سنت و مدرنیته را توجیه می‌کند.",
        },
      },
      {
        speakerName: "Jury President",
        roleFa: "رئیس هیئت داوران معماری",
        speakerAvatar: "🏛️",
        charPrompt: "How do you achieve environmental sustainability in such a cavernous uninsulated cathedral atrium?",
        ideal: "By utilizing natural geothermal ventilation and high-efficiency smart glass that regulates seasonal temperature fluctuations.",
        keywords: [
          { phrase: "geothermal ventilation", hintFa: "(تهویه زمین‌گرمایی طبیعی)", weight: 50 },
          { phrase: "regulates seasonal temperature fluctuations", hintFa: "(تنظیم نوسانات دمایی فصلی)", weight: 50 },
        ],
        vocabUpgrade: {
          learner: "We use underground air pipes and smart windows to stay warm and cool.",
          native: "We integrate passive thermal massing with adaptive glazing to minimize operational energy consumption.",
          noteFa: "تعبیر 'geothermal ventilation' تسلط فنی بر پایداری اکولوژیک را نشان می‌دهد.",
        },
      },
      {
        speakerName: "Jury President",
        roleFa: "رئیس هیئت داوران معماری",
        speakerAvatar: "🏛️",
        charPrompt: "Your mastery of structural innovation and civic memory is exemplary. The committee awards highest honors.",
        ideal: "Architecture must serve as an enduring bridge between historical heritage and ecological sustainability. Thank you.",
        keywords: [
          { phrase: "enduring bridge between", hintFa: "(پلی پایدار میان...)", weight: 50 },
          { phrase: "heritage and ecological sustainability", hintFa: "(میراث و پایداری بوم‌شناختی)", weight: 50 },
        ],
        vocabUpgrade: {
          learner: "I believe buildings should respect history and save the planet. Thank you.",
          native: "I am honored by this verdict; architecture ultimately synthesizes cultural legacy with planetary responsibility.",
          noteFa: "جمله 'Architecture must serve as an enduring bridge...' نتیجه‌گیری فلسفی و الهام‌بخش است.",
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
        charPrompt: "To assert that silicon algorithms can replicate human consciousness ignores the nuanced depth of subjective experience.",
        ideal: "While technological optimism appears alluring, we must never compromise rigorous oversight for hasty innovation in artificial intelligence.",
        keywords: [
          { phrase: "technological optimism", hintFa: "(خوش‌بینی فناورانه)", weight: 50 },
          { phrase: "rigorous oversight", hintFa: "(نظارت دقیق و موشکافانه)", weight: 50 },
        ],
        vocabUpgrade: {
          learner: "Computers might be smart, but we need to watch them carefully so nothing bad happens.",
          native: "Embracing technological optimism without rigorous oversight invites profound ethical and societal vulnerabilities.",
          noteFa: "ترکیب 'technological optimism' و 'rigorous oversight' بیانی پخته و آکادمیک در سطح C2 می‌سازد.",
        },
      },
      {
        speakerName: "Professor Sterling",
        roleFa: "دانشمند برجسته علوم اعصاب",
        speakerAvatar: "🧠",
        charPrompt: "Silicon Valley pioneers insist decentralized artificial intelligence naturally prevents autocratic control and algorithmic manipulation.",
        ideal: "Unregulated technical proliferation inevitably deepens systemic inequity, allowing digital monopolies to exploit vulnerable communities across society.",
        keywords: [
          { phrase: "systemic inequity", hintFa: "(نابرابری ساختاری)", weight: 50 },
          { phrase: "digital monopolies", hintFa: "(انحصارهای دیجیتال)", weight: 50 },
        ],
        vocabUpgrade: {
          learner: "Big tech firms will take over and poor people will get hurt.",
          native: "Unchecked expansion consolidates corporate hegemony while entrenching systemic disparities across the socio-economic spectrum.",
          noteFa: "استفاده از 'systemic inequity' و 'digital monopolies' دغدغه ساختاری را با شیوایی بیان می‌کند.",
        },
      },
      {
        speakerName: "Professor Sterling",
        roleFa: "دانشمند برجسته علوم اعصاب",
        speakerAvatar: "🧠",
        charPrompt: "Given these irreconcilable arguments, should humanity establish binding global treaties to halt autonomous machines?",
        ideal: "Only through enforceable international covenants can humanity avert catastrophic outcomes without stifling genuine scientific progress.",
        keywords: [
          { phrase: "international covenants", hintFa: "(میثاق‌های بین‌المللی)", weight: 50 },
          { phrase: "scientific progress", hintFa: "(پیشرفت علمی)", weight: 50 },
        ],
        vocabUpgrade: {
          learner: "We need world rules so robots do not ruin science.",
          native: "Binding international covenants alone provide the requisite equilibrium between existential caution and technological advancement.",
          noteFa: "ساختار وارونگی 'Only through... can humanity...' نشان‌دهنده تسلط سخنوری ممتاز C2 است.",
        },
      },
    ],
  },
  {
    titleFa: "مذاکرات صلح چندجانبه شورای امنیت در ژنو",
    titleEn: "UN Security Council High-Stakes Peace Conciliation",
    scenarioFa: "در بحبوحه یک بحران ژئوپلیتیک فوری، باید به عنوان نماینده ویژه شورای امنیت، طرفین را به یک آتش‌بس دیپلماتیک پایدار متقاعد کنی.",
    locationContextFa: "تالار شورای امنیت سازمان ملل در ژنو",
    turns: [
      {
        speakerName: "Ambassador Volkov",
        roleFa: "سفیر ارشد طرف مقابل",
        speakerAvatar: "🎖️",
        charPrompt: "Our military maneuvers merely protect sovereign borders against provocative troop build-ups along the disputed frontier.",
        ideal: "Disregarding established international norms undermines mutual trust, transforming localized border skirmishes into uncontrollable continental conflicts.",
        keywords: [
          { phrase: "international norms", hintFa: "(هنجارهای بین‌المللی)", weight: 50 },
          { phrase: "mutual trust", hintFa: "(اعتماد متقابل)", weight: 50 },
        ],
        vocabUpgrade: {
          learner: "Breaking the rules makes everyone fight and starts a bigger war.",
          native: "Violating established conventions erodes diplomatic good faith, escalating peripheral friction into systemic conflict.",
          noteFa: "کاربرد 'undermines mutual trust' لحن قاطع دیپلماتیک با کلام فاخر ایجاد می‌کند.",
        },
      },
      {
        speakerName: "Ambassador Volkov",
        roleFa: "سفیر ارشد طرف مقابل",
        speakerAvatar: "🎖️",
        charPrompt: "Any unconditional withdrawal would be seen as humiliating capitulation, which our government categorically rejects.",
        ideal: "A structured diplomatic disengagement preserves national dignity while establishing verifiable demilitarized zones supervised by international observers.",
        keywords: [
          { phrase: "diplomatic disengagement", hintFa: "(تنش‌زدایی و عقب‌نشینی دیپلماتیک)", weight: 50 },
          { phrase: "demilitarized zones", hintFa: "(مناطق غیرنظامی)", weight: 50 },
        ],
        vocabUpgrade: {
          learner: "You can pull back peacefully and keep your pride with UN guards.",
          native: "Reciprocal disengagement safeguards sovereign prestige while instituting monitored neutral buffer zones.",
          noteFa: "اصطلاحات 'diplomatic disengagement' و 'demilitarized zones' لغات تخصصی معاهدات دیپلماتیک هستند.",
        },
      },
      {
        speakerName: "Ambassador Volkov",
        roleFa: "سفیر ارشد طرف مقابل",
        speakerAvatar: "🎖️",
        charPrompt: "What binding guarantees ensure our economic corridors will remain uninhibited by unilateral punitive sanctions?",
        ideal: "This multilateral concordat guarantees unrestricted commercial transit, ensuring lasting stability across all participating sovereign states.",
        keywords: [
          { phrase: "multilateral concordat", hintFa: "(توافق‌نامه چندجانبه)", weight: 50 },
          { phrase: "commercial transit", hintFa: "(ترانزیت تجاری)", weight: 50 },
        ],
        vocabUpgrade: {
          learner: "The treaty promises trade will stay open so every country stays happy.",
          native: "This multilateral instrument guarantees unencumbered commerce, providing enduring economic security for every signatory.",
          noteFa: "'multilateral concordat' نشان‌دهنده بالاترین درجه انطباق زبانی در حوزه حقوق بین‌الملل است.",
        },
      },
    ],
  },
  {
    titleFa: "جلسه استماع شفاهی در دادگاه عالی قانون اساسی",
    titleEn: "Supreme Court Constitutional Oral Argument",
    scenarioFa: "در پیشگاه قضات دیوان عالی کشور، باید در پرونده‌ای سرنوشت‌ساز از حریم خصوصی دیجیتال در برابر نظارت دولتی دفاع کنی.",
    locationContextFa: "صحن دادگاه عالی واشنگتن",
    turns: [
      {
        speakerName: "Chief Justice",
        roleFa: "رئیس دیوان عالی",
        speakerAvatar: "⚖️",
        charPrompt: "Does your constitutional interpretation render federal counter-terrorism surveillance statutes completely impotent in modern cyber warfare?",
        ideal: "Far from crippling national security, our position ensures governmental surveillance remains anchored in strict constitutional jurisprudence.",
        keywords: [
          { phrase: "national security", hintFa: "(امنیت ملی)", weight: 50 },
          { phrase: "constitutional jurisprudence", hintFa: "(رویه‌های قضایی قانون اساسی)", weight: 50 },
        ],
        vocabUpgrade: {
          learner: "We are not making security weak, we just want police to follow the laws.",
          native: "Rather than compromising state security, our argument grounds investigative authority in rigorous statutory jurisprudence.",
          noteFa: "'Far from crippling...' مقدمه‌ای فوق‌العاده متین در خطابه حقوقی برای پاسخ به سؤال قاضی است.",
        },
      },
      {
        speakerName: "Justice Alito",
        roleFa: "قاضی ارشد دیوان عالی",
        speakerAvatar: "⚖️",
        charPrompt: "How do you reconcile absolute privacy protections with ubiquitous digital communication networks that transcend geographic boundaries?",
        ideal: "Constitutional protections must evolve alongside technological shifts, preventing warrantless intrusion into the private lives of citizens.",
        keywords: [
          { phrase: "technological shifts", hintFa: "(تحولات فناورانه)", weight: 50 },
          { phrase: "warrantless intrusion", hintFa: "(تعرض و ورود بدون مجوز قضایی)", weight: 50 },
        ],
        vocabUpgrade: {
          learner: "Laws should change with technology so agents cannot spy without warrants.",
          native: "Constitutional guarantees must keep pace with technological realities to forestall unauthorized invasions of privacy.",
          noteFa: "'warrantless intrusion' اصطلاح کلیدی حقوق اساسی در بررسی متمم چهارم است.",
        },
      },
      {
        speakerName: "Chief Justice",
        roleFa: "رئیس دیوان عالی",
        speakerAvatar: "⚖️",
        charPrompt: "Counsel, if we accept your narrow doctrine today, what workable standard governs future emergent cyber threats?",
        ideal: "We propose a clear judicial standard requiring individualized probable cause before accessing encrypted personal records.",
        keywords: [
          { phrase: "judicial standard", hintFa: "(معیار قضایی)", weight: 50 },
          { phrase: "probable cause", hintFa: "(دلیل موجه / ظن قوی قانونی)", weight: 50 },
        ],
        vocabUpgrade: {
          learner: "Judges should ask for real evidence before letting anyone see secret data.",
          native: "We urge the Court to affirm an evidentiary standard demanding particularized probable cause prior to digital searches.",
          noteFa: "'probable cause' و 'judicial standard' ارکان اساسی وکالت حقوقی در دیوان عالی هستند.",
        },
      },
    ],
  },
  {
    titleFa: "خطابه بداهه فلسفی در سمپوزیوم آکسفورد",
    titleEn: "Spontaneous Philosophical Extemporization",
    scenarioFa: "در سمپوزیوم بین‌المللی فلسفه آکسفورد، موضوعی غافلگیرکننده درباره جبر و اختیار و آگاهی اخلاقی به شما داده می‌شود تا بدون آمادگی سخنرانی کنی.",
    locationContextFa: "تالار شلدونیان دانشگاه آکسفورد",
    turns: [
      {
        speakerName: "Symposium Chancellor",
        roleFa: "رئیس سمپوزیوم فلسفه",
        speakerAvatar: "🎓",
        charPrompt: "If deterministic neurobiology governs all human decisions, does moral responsibility become an ungrounded social illusion?",
        ideal: "Determinism does not preclude agency; rather, moral accountability reflects our capacity for conscious deliberation within complex environments.",
        keywords: [
          { phrase: "moral accountability", hintFa: "(مسئولیت‌پذیری اخلاقی)", weight: 50 },
          { phrase: "conscious deliberation", hintFa: "(سنجش و تامل آگاهانه)", weight: 50 },
        ],
        vocabUpgrade: {
          learner: "Even if our brains decide things, we still need to take blame for our choices.",
          native: "Causal determinism does not nullify agency; moral accountability springs from reflective deliberation in rational agents.",
          noteFa: "ترکیب 'preclude agency' و 'conscious deliberation' عمق فلسفی را در زبانی روان متبلور می‌کند.",
        },
      },
      {
        speakerName: "Symposium Chancellor",
        roleFa: "رئیس سمپوزیوم فلسفه",
        speakerAvatar: "🎓",
        charPrompt: "How can one justify retributive criminal justice when malefactors are fundamentally shaped by adverse socioeconomic conditions?",
        ideal: "Enlightened justice prioritizes restorative rehabilitation, recognizing that punitive retribution fails to address underlying societal pathologies.",
        keywords: [
          { phrase: "restorative rehabilitation", hintFa: "(بازپروری ترمیمی)", weight: 50 },
          { phrase: "punitive retribution", hintFa: "(مجازات انتقام‌جویانه)", weight: 50 },
        ],
        vocabUpgrade: {
          learner: "Punishing criminals does not work; we must help fix their bad life conditions.",
          native: "Progressive jurisprudence embraces restorative justice, moving beyond mere punitive vengeance toward structural remediation.",
          noteFa: "'restorative rehabilitation' در تقابل با 'punitive retribution' بیانگر برهان فلسفی حقوقی است.",
        },
      },
      {
        speakerName: "Symposium Chancellor",
        roleFa: "رئیس سمپوزیوم فلسفه",
        speakerAvatar: "🎓",
        charPrompt: "Synthesize your conclusion: where does the transcendent spark of human dignity truly reside?",
        ideal: "Human dignity resides not in metaphysical abstractions, but in our shared commitment to alleviate unnecessary suffering.",
        keywords: [
          { phrase: "metaphysical abstractions", hintFa: "(انتزاعات مابعدالطبیعی)", weight: 50 },
          { phrase: "unnecessary suffering", hintFa: "(رنج‌های غیرضروری)", weight: 50 },
        ],
        vocabUpgrade: {
          learner: "Being human is not just big ideas, it means helping stop pain in the world.",
          native: "Dignity is grounded not in speculative metaphysics, but in the practical imperative to ease human misery.",
          noteFa: "ساختار زیبای 'not in... but in...' به همراه کلمات سنجیده، اوج سخنوری C2 است.",
        },
      },
    ],
  },
  {
    titleFa: "سخنرانی دفاع در برابر تصاحب خصمانه شرکت وال‌استریت",
    titleEn: "Hostile Takeover Defense: Poison Pill Defense",
    scenarioFa: "در مجمع فوق‌العاده سهامداران یک ابرشرکت، در برابر یک غارتگر مالی وال‌استریت که قصد خرید خصمانه و تجزیه شرکت را دارد، نطق دفاعیه ایراد می‌کنی.",
    locationContextFa: "برج مالی منهتن نیویورک",
    turns: [
      {
        speakerName: "Raider Gordon",
        roleFa: "غارتگر مالی وال‌استریت",
        speakerAvatar: "💼",
        charPrompt: "Your conservative board squanders capital on unproven innovations while our aggressive tender offer delivers immediate shareholder value!",
        ideal: "Short-term financial engineering may dazzle speculators, but sustainable capital growth demands patient investment in core capabilities.",
        keywords: [
          { phrase: "financial engineering", hintFa: "(مهندسی مالی)", weight: 50 },
          { phrase: "capital growth", hintFa: "(رشد سرمایه)", weight: 50 },
        ],
        vocabUpgrade: {
          learner: "Quick cash schemes look nice, but real companies take time to grow strong.",
          native: "Superficial financial manoeuvres pander to short-termism, whereas durable equity valuation requires sustained strategic investment.",
          noteFa: "'Short-term financial engineering' و 'sustainable capital growth' لحن قاطع دفاع شرکتی است.",
        },
      },
      {
        speakerName: "Raider Gordon",
        roleFa: "غارتگر مالی وال‌استریت",
        speakerAvatar: "💼",
        charPrompt: "Your shareholder rights plan is merely an entrenched management entrenchment scheme to deny investors their legitimate profits!",
        ideal: "Our strategic defensive measures protect equity holders from predatory undervaluation, ensuring the enterprise realizes its authentic potential.",
        keywords: [
          { phrase: "defensive measures", hintFa: "(اقدامات تدافعی)", weight: 50 },
          { phrase: "equity holders", hintFa: "(سهام‌داران)", weight: 50 },
        ],
        vocabUpgrade: {
          learner: "We put up rules so you cannot buy our shares for cheap and ruin us.",
          native: "The shareholder rights framework insulates stakeholders against predatory undervaluation, preserving long-term enterprise yield.",
          noteFa: "'defensive measures' و 'equity holders' اصطلاحات دقیق حاکمیت شرکتی C2 هستند.",
        },
      },
      {
        speakerName: "Shareholder Committee",
        roleFa: "کمیته سهامداران مستقل",
        speakerAvatar: "📊",
        charPrompt: "What decisive strategic roadmap will the incumbent executive leadership deliver if we reject this hostile takeover?",
        ideal: "By monetizing next-generation patents and consolidating high-margin markets, we will deliver exponential shareholder returns within three years.",
        keywords: [
          { phrase: "consolidating high-margin markets", hintFa: "(تثبیت بازارهای پربازده)", weight: 50 },
          { phrase: "shareholder returns", hintFa: "(بازدهی سهامداران)", weight: 50 },
        ],
        vocabUpgrade: {
          learner: "We will sell new inventions and sell to good markets to make lots of money.",
          native: "Capitalizing upon proprietary innovations and optimizing margin channels will generate substantial accretive value for shareholders.",
          noteFa: "'unlock exponential shareholder returns' لحن هیئت مدیره شرکت‌های Fortune 500 را بازتاب می‌دهد.",
        },
      },
    ],
  },
  {
    titleFa: "مناظره طنز، کلام فاخر و ایهام در کلوب ادبی آکسفورد",
    titleEn: "Masterclass in Satirical Wit and Rhetoric",
    scenarioFa: "در کلوب مناظره آکسفورد، با طعنه رندانه، ایهام‌های ظریف و کنایه‌های هوشمندانه، حریف پرمدعای خود را با لبخند خلع سلاح می‌کنی.",
    locationContextFa: "تالار مناظره آکسفورد یونیون",
    turns: [
      {
        speakerName: "Opponent Lord Bellingham",
        roleFa: "لرد پرمدعای حریف",
        speakerAvatar: "🎭",
        charPrompt: "My esteemed colleague champions antiquated traditions, mistaking stubborn nostalgic inertia for profound philosophical wisdom.",
        ideal: "My distinguished opponent mistakes superficial novelty for genuine enlightenment, confusing rhetorical grandstanding with persuasive intellectual substance.",
        keywords: [
          { phrase: "superficial novelty", hintFa: "(نوآوری سطحی)", weight: 50 },
          { phrase: "intellectual substance", hintFa: "(محتوا و مایه فکری)", weight: 50 },
        ],
        vocabUpgrade: {
          learner: "You just like new things and talk loudly without saying anything smart.",
          native: "The noble lord conflates transient novelty with enduring insight, substituting theatrical bravado for rigorous thought.",
          noteFa: "ترکیب طنزآمیز 'distinguished opponent' با 'rhetorical grandstanding' طعنه ادیبانه است.",
        },
      },
      {
        speakerName: "Opponent Lord Bellingham",
        roleFa: "لرد پرمدعای حریف",
        speakerAvatar: "🎭",
        charPrompt: "You mock modernity, yet you gladly rely on our contemporary infrastructure to broadcast your solemn complaints!",
        ideal: "Utilizing modern tools hardly obliges one to admire their flaws, much like using umbrellas without worshipping rainstorms.",
        keywords: [
          { phrase: "modern tools", hintFa: "(ابزارهای مدرن)", weight: 50 },
          { phrase: "admire their flaws", hintFa: "(تحسین کاستی‌های آن‌ها)", weight: 50 },
        ],
        vocabUpgrade: {
          learner: "Just because I use tools does not mean I love everything about modern life.",
          native: "Employing contemporary apparatus implies no duty of adoration, no more than taking shelter denotes reverence for the storm.",
          noteFa: "تشبیه کنایه‌آمیز به چتر و طوفان نماد بلاغت آکسفوردی است.",
        },
      },
      {
        speakerName: "Oxford Union President",
        roleFa: "رئیس جلسه آکسفورد یونیون",
        speakerAvatar: "🎩",
        charPrompt: "Deliver your concluding riposte: how should history evaluate tonight's theatrical display of wit and intellect?",
        ideal: "History will remember tonight as proof that civilized disagreement remains the most enduring ornament of enlightened democracy.",
        keywords: [
          { phrase: "civilized disagreement", hintFa: "(اختلاف‌نظر متمدنانه)", weight: 50 },
          { phrase: "enlightened democracy", hintFa: "(مردم‌سالاری روشنگرانه)", weight: 50 },
        ],
        vocabUpgrade: {
          learner: "People will remember that we showed how smart people can argue politely.",
          native: "Posterity will testify that our vigorous exchange demonstrated the indispensable nobility of civil disagreement.",
          noteFa: "'civilized disagreement' و 'enlightened democracy' اختتامیه سخنورانه کم‌نظیری است.",
        },
      },
    ],
  },
  {
    titleFa: "جلسه اتاق وضعیت کاخ سفید: استراتژی ژئوپلیتیک",
    titleEn: "White House Situation Room: Geopolitical Grand Strategy",
    scenarioFa: "در بحبوحه یک بحران چندجانبه دریایی و انرژی، باید به عنوان مشاور ارشد امنیت ملی، راهبردی بدون ریسک تصاعد تنش ارائه دهی.",
    locationContextFa: "اتاق وضعیت کاخ سفید",
    turns: [
      {
        speakerName: "National Security Advisor",
        roleFa: "مشاور امنیت ملی",
        speakerAvatar: "🦅",
        charPrompt: "Adversary naval assets have blockaded strategic shipping straits, threatening forty percent of allied liquefied natural gas shipments.",
        ideal: "We should establish coordinated multilateral maritime escorts while issuing measured diplomatic demarches to deter further aggression.",
        keywords: [
          { phrase: "maritime escorts", hintFa: "(اسکورت‌های دریایی)", weight: 50 },
          { phrase: "diplomatic demarches", hintFa: "(اعتراض‌ها و هشدارهای دیپلماتیک)", weight: 50 },
        ],
        vocabUpgrade: {
          learner: "We can send warships with the tankers and send official warning letters.",
          native: "Deploying allied maritime escorts coupled with calibrated diplomatic demarches will deter adventurism without precipitating conflict.",
          noteFa: "'diplomatic demarches' واژه فرانسوی الاصل وارد شده به زبان دیپلماسی عالی C2 است.",
        },
      },
      {
        speakerName: "National Security Advisor",
        roleFa: "مشاور امنیت ملی",
        speakerAvatar: "🦅",
        charPrompt: "Hawks within our cabinet demand immediate pre-emptive kinetic strikes against their coastal radar installations.",
        ideal: "Pre-emptive military strikes would needlessly trigger uncontrollable escalation, rupturing critical alliances across the international community.",
        keywords: [
          { phrase: "uncontrollable escalation", hintFa: "(تشدید تنش غیرقابل کنترل)", weight: 50 },
          { phrase: "international community", hintFa: "(جامعه بین‌المللی)", weight: 50 },
        ],
        vocabUpgrade: {
          learner: "If we attack first, war will explode and our allies will get mad.",
          native: "Pre-emptive kinetic operations would provoke catastrophic escalation while alienating our coalition partners.",
          noteFa: "'uncontrollable escalation' کلیدواژه مهار بحران در استراتژی نظامی است.",
        },
      },
      {
        speakerName: "President",
        roleFa: "رئیس‌جمهور",
        speakerAvatar: "🇺🇸",
        charPrompt: "Counsel, what overarching strategic doctrine secures our vital supply corridors without provoking global armed conflict?",
        ideal: "A resolute deterrence posture backed by economic leverage guarantees security without firing a single hostile shot.",
        keywords: [
          { phrase: "deterrence posture", hintFa: "(موضع بازدارندگی مقتدرانه)", weight: 50 },
          { phrase: "economic leverage", hintFa: "(اهرم فشار اقتصادی)", weight: 50 },
        ],
        vocabUpgrade: {
          learner: "Showing strong power and using money sanctions will keep peace without shooting.",
          native: "Credible deterrence fused with multifaceted economic leverage achieves strategic containment without armed engagement.",
          noteFa: "'deterrence posture' و 'economic leverage' ادبیات استراتژیک کاخ سفید را بازتاب می‌دهد.",
        },
      },
    ],
  },
  {
    titleFa: "ساختارشکنی معرفت‌شناختی در کرسی نظریه‌پردازی کمبریج",
    titleEn: "Deconstructing Epistemological Relativism",
    scenarioFa: "در دفاعیه کرسی نظریه‌پردازی دانشگاه کمبریج، با استدلالی منسجم و بی‌نقص، پارادوکس‌های خودویرانگر نسبی‌گرایی افراطی را اثبات می‌کنی.",
    locationContextFa: "دانشکده فلسفه دانشگاه کمبریج",
    turns: [
      {
        speakerName: "Professor Derrida Scholar",
        roleFa: "نظریه‌پرداز پساساختارگرا",
        speakerAvatar: "📖",
        charPrompt: "All truth claims merely reflect localized linguistic games and entrenched socio-political power structures across history.",
        ideal: "To declare all truth culturally relative constitutes an immediate self-refuting paradox that undermines your own theoretical assertion.",
        keywords: [
          { phrase: "self-refuting paradox", hintFa: "(پارادوکس خودویرانگر / نقض‌کننده خود)", weight: 50 },
          { phrase: "theoretical assertion", hintFa: "(ادعای نظری)", weight: 50 },
        ],
        vocabUpgrade: {
          learner: "If you say there is no truth, your own sentence cannot be true.",
          native: "Asserting the relativity of all truth collapses into performative incoherence, discrediting the very thesis advanced.",
          noteFa: "'self-refuting paradox' استدلال کلاسیک فلسفه تحلیلی علیه نسبی‌گرایی معرفتی است.",
        },
      },
      {
        speakerName: "Professor Derrida Scholar",
        roleFa: "نظریه‌پرداز پساساختارگرا",
        speakerAvatar: "📖",
        charPrompt: "How can you defend scientific objectivity when historical paradigms continually evolve and overturn previous orthodoxies?",
        ideal: "Scientific paradigms evolve through rigorous empirical validation, demonstrating progressive refinement rather than arbitrary epistemological chaos.",
        keywords: [
          { phrase: "empirical validation", hintFa: "(اعتبارسنجی تجربی)", weight: 50 },
          { phrase: "progressive refinement", hintFa: "(پالایش و ارتقای فزاینده)", weight: 50 },
        ],
        vocabUpgrade: {
          learner: "Science changes because experiments get better, not because people just change their minds.",
          native: "Paradigmatic shifts reflect cumulative empirical refinement, evincing asymptotic convergence toward objective reality.",
          noteFa: "'empirical validation' و 'progressive refinement' واژگان اصیل فلسفه علم هستند.",
        },
      },
      {
        speakerName: "Professor Derrida Scholar",
        roleFa: "نظریه‌پرداز پساساختارگرا",
        speakerAvatar: "📖",
        charPrompt: "What epistemological foundation remains once we discard dogmatic foundationalism and naive empiricism?",
        ideal: "Critical rationalism offers robust objective standards by continually submitting our boldest hypotheses to merciless empirical scrutiny.",
        keywords: [
          { phrase: "objective standards", hintFa: "(معیارهای عینی)", weight: 50 },
          { phrase: "empirical scrutiny", hintFa: "(بررسی و سنجش دقیق تجربی)", weight: 50 },
        ],
        vocabUpgrade: {
          learner: "We can test ideas against facts and throw away the wrong ones.",
          native: "Critical rationalism establishes epistemic rigor by exposing provisional conjectures to unsparing empirical scrutiny.",
          noteFa: "'empirical scrutiny' و 'objective standards' نماد فلسفه عقل‌گرایی نقادانه پوپری در سطح C2 است.",
        },
      },
    ],
  },
  {
    titleFa: "بداهه‌گویی در کنگره جهانی ادبیات تطبیقی",
    titleEn: "Literary Extemporization on Metaphor and Mortality",
    scenarioFa: "در حضور برندگان نوبل ادبیات، با زبانی شاعرانه و عمیق، پیرامون استعاره، گذر زمان و جاودانگی سخنرانی بداهه می‌کنی.",
    locationContextFa: "آکادمی ادبیات استکهلم",
    turns: [
      {
        speakerName: "Literary Laureate",
        roleFa: "برنده نوبل ادبیات",
        speakerAvatar: "🖋️",
        charPrompt: "Is literature merely a desperate psychological refuge against the terrifying inevitability of physical extinction?",
        ideal: "Literature transcends mere escapism; it transmutes our fleeting temporal existence into enduring vessels of shared human meaning.",
        keywords: [
          { phrase: "transmutes our fleeting", hintFa: "(دگرگون‌سازی دوران گذرا و ناپایدار ما)", weight: 50 },
          { phrase: "shared human meaning", hintFa: "(معنای مشترک بشری)", weight: 50 },
        ],
        vocabUpgrade: {
          learner: "Books are not just hiding from death, they turn short lives into lasting art.",
          native: "Literature is no mere palliative retreat; it transfigures mortal transience into enduring monuments of human consciousness.",
          noteFa: "فعل فاخر 'transmutes' لحن استعاری شکوهمندی برای نقد ادبی پدید می‌آورد.",
        },
      },
      {
        speakerName: "Literary Laureate",
        roleFa: "برنده نوبل ادبیات",
        speakerAvatar: "🖋️",
        charPrompt: "Can translated prose ever capture the untranslatable musical cadence and cultural soul of the original voice?",
        ideal: "While exact linguistic symmetry remains elusive, poetic translation illuminates unexpected resonances between distant literary traditions.",
        keywords: [
          { phrase: "linguistic symmetry", hintFa: "(تقارن زبانی)", weight: 50 },
          { phrase: "literary traditions", hintFa: "(سنت‌های ادبی)", weight: 50 },
        ],
        vocabUpgrade: {
          learner: "You cannot copy words exactly, but good translation shows how stories connect.",
          native: "Though verbatim fidelity is unattainable, gifted translation reveals harmonious affinities across distinct cultural traditions.",
          noteFa: "'linguistic symmetry remains elusive' دیدگاهی پخته و حرفه‌ای در ترجمه ادبی است.",
        },
      },
      {
        speakerName: "Literary Laureate",
        roleFa: "برنده نوبل ادبیات",
        speakerAvatar: "🖋️",
        charPrompt: "In our hyper-accelerated digital age, does slow literary contemplative reading still possess transformative power?",
        ideal: "Deep reading remains an irreplaceable sanctuary, cultivating empathetic resonance against the frantic shallowness of modern distraction.",
        keywords: [
          { phrase: "irreplaceable sanctuary", hintFa: "(پناهگاهی جایگزین‌ناپذیر)", weight: 50 },
          { phrase: "empathetic resonance", hintFa: "(طنین و درک همدلانه)", weight: 50 },
        ],
        vocabUpgrade: {
          learner: "Reading books is still very important because it teaches us how to care about people.",
          native: "Immersive literature provides a vital bulwark, nurturing contemplative empathy amidst the incessant turbulence of the digital epoch.",
          noteFa: "'irreplaceable sanctuary' و 'empathetic resonance' اوج زیبایی کلام در ستایش ادبیات است.",
        },
      },
    ],
  },
  {
    titleFa: "مرحله نهایی C2: پیمان تاریخی اجلاس سران جهان",
    titleEn: "C2 Master Summit: The Global Planetary Concordat",
    scenarioFa: "در سخنرانی پایانی اجلاس سران سازمان ملل، به عنوان سخنران برگزیده، باید رهبران جهان را به امضای معاهده سرنوشت‌ساز آینده بشریت فراخوانی.",
    locationContextFa: "صحن مجمع عمومی سازمان ملل متحد در نیویورک",
    turns: [
      {
        speakerName: "President of the Assembly",
        roleFa: "رئیس مجمع عمومی",
        speakerAvatar: "🌐",
        charPrompt: "Sovereign nations hesitate to surrender industrial advantages while developing economies demand financial reparations for historic injustices.",
        ideal: "Historical grievances must be addressed through equitable financing, transforming divisive suspicion into mutually advantageous planetary cooperation.",
        keywords: [
          { phrase: "equitable financing", hintFa: "(تأمین مالی عادلانه)", weight: 50 },
          { phrase: "planetary cooperation", hintFa: "(همکاری سیاره‌ای و بین‌المللی)", weight: 50 },
        ],
        vocabUpgrade: {
          learner: "Rich countries should pay fairly so everyone can work together happily.",
          native: "Addressing historical inequities through compensatory frameworks converts entrenched mistrust into synergistic global collaboration.",
          noteFa: "'equitable financing' و 'planetary cooperation' در دیپلماسی جهانی راهگشاست.",
        },
      },
      {
        speakerName: "President of the Assembly",
        roleFa: "رئیس مجمع عمومی",
        speakerAvatar: "🌐",
        charPrompt: "Cynics argue that international treaties inevitably collapse when domestic political pressures demand nationalistic isolationism.",
        ideal: "Isolationist impulses cannot insulate any sovereign nation from borderless ecological crises that threaten our collective survival.",
        keywords: [
          { phrase: "Isolationist impulses", hintFa: "(امیال و تکانه‌های انزواطلبانه)", weight: 50 },
          { phrase: "collective survival", hintFa: "(بقای جمعی ما)", weight: 50 },
        ],
        vocabUpgrade: {
          learner: "Countries cannot hide alone because climate disasters will hurt everybody anyway.",
          native: "Nationalist retrenchment offers illusory protection against planetary emergencies that disregard geopolitical demarcations.",
          noteFa: "'Isolationist impulses' و 'collective survival' قدرت بلاغی خطابه را به اوج می‌رسانند.",
        },
      },
      {
        speakerName: "President of the Assembly",
        roleFa: "رئیس مجمع عمومی",
        speakerAvatar: "🌐",
        charPrompt: "Deliver your final plea to the General Assembly: why must every head of state sign today?",
        ideal: "Let future generations remember that we rose above petty discord to safeguard the fragile sanctuary of humanity.",
        keywords: [
          { phrase: "petty discord", hintFa: "(اختلافات و مجادلات حقیرانه)", weight: 50 },
          { phrase: "sanctuary of humanity", hintFa: "(حریم امن و پناهگاه بشریت)", weight: 50 },
        ],
        vocabUpgrade: {
          learner: "Please sign this so our children can live peacefully in a safe world.",
          native: "Let posterity record that we transcended narrow parochialism to preserve our shared biosphere for tomorrow.",
          noteFa: "'rose above petty discord' اوج سخنوری مجمع عمومی سازمان ملل متحد است.",
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
