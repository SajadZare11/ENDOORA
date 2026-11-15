import { DOWNLOAD_ITEMS, type DownloadItem } from "../downloads";

export interface BookVocabularyItem {
  term: string;
  phonetic?: string;
  meaningFa: string;
  example?: string;
}

export interface BookChapter {
  id: string;
  number: number | string;
  titleFa: string;
  titleEn: string;
  subtitle?: string;
  audioTimestamp?: string;
  content: string[];
  vocabulary?: BookVocabularyItem[];
  keyTakeawaysFa?: string[];
  notesFa?: string;
}

export interface BookContentData {
  id: string;
  titleFa: string;
  titleEn: string;
  author: string;
  genre: string;
  level: string;
  introFa: string;
  readingTipsFa: string[];
  pdfUrl?: string;
  audioCompanionUrl?: string;
  chapters: BookChapter[];
}

export const BOOK_CONTENTS: Record<string, BookContentData> = {
  // ---------------------------------------------------------------------------
  // 1. The Hound of the Baskervilles
  // ---------------------------------------------------------------------------
  "novel-sherlock-hound": {
    id: "novel-sherlock-hound",
    titleFa: "درنده‌ باسکرویل (شرلوک هولمز)",
    titleEn: "The Hound of the Baskervilles",
    author: "Sir Arthur Conan Doyle",
    genre: "معمایی / کارآگاهی کلاسیک",
    level: "سطح B1 / B2",
    introFa:
      "رمان درنده باسکرویل مشهورترین پرونده کارآگاه افسانه‌ای، شرلوک هولمز و دکتر جان واتسون است. ماجرا در دشت‌های مه‌آلود و وهم‌انگیز دارتمور رقم می‌خورد؛ جایی که نفرینی دیرینه بر خاندان باسکرویل سایه افکنده و شایعه وجود سگی هیولایی و آتشین مردم منطقه را به وحشت انداخته است.",
    readingTipsFa: [
      "برای یادگیری بهتر، کلمات جدید را درون جملات واتسون یادداشت کنید.",
      "اگر مایل بودید، فایل صوتی همراه را همزمان گوش دهید تا تلفظ اصیل بریتانیایی و لحن داستانی را تقویت کنید.",
      "به شیوه نتیجه‌گیری‌های منطقی هولمز دقت کنید؛ واژگان استدلال و مشاهده بسیار در این اثر تکرار شده‌اند.",
    ],
    pdfUrl: "https://dl.endoora.ir/novels/sherlock_hound_of_the_baskervilles_audio_pdf.zip",
    audioCompanionUrl: "https://dl.endoora.ir/audio/novels/sherlock_hound_ch1.mp3",
    chapters: [
      {
        id: "ch-1",
        number: 1,
        titleFa: "فصل اول: آقای شرلوک هولمز و عصای مرموز",
        titleEn: "Chapter 1: Mr. Sherlock Holmes & Dr. Mortimer's Walking Stick",
        subtitle: "The Science of Observation",
        content: [
          "Mr. Sherlock Holmes, who was usually very late in the mornings, save upon those not infrequent occasions when he was up all night, was seated at the breakfast table. I stood upon the hearth-rug and picked up the stick which our visitor had left behind him the night before.",
          "It was a fine, thick piece of wood, bulbous-headed, of the sort which is known as a 'Penang lawyer.' Just under the head was a broad silver band, nearly an inch across. 'To James Mortimer, M.R.C.S., from his friends of the C.C.H.,' was engraved upon it, with the date '1884.' It was just such a stick as the old-fashioned family practitioner used to carry—dignified, solid, and reassuring.",
          "'Well, Watson, what do you make of it?' Holmes was sitting with his back to me, and I had given him no sign of my occupation.",
          "'How did you know what I was doing? I believe you have eyes in the back of your head.'",
          "'I have, at least, a well-polished, silver-plated coffee-pot in front of me,' said he. 'But tell me, Watson, what do you deduce from our visitor’s stick? Since we have been so unfortunate as to miss him and have no notion of his errand, this accidental souvenir becomes of importance. Let me hear you reconstruct the man by an examination of it.'",
          "'I think,' said I, following so far as I could the methods of my companion, 'that Dr. Mortimer is a successful, elderly medical man, well-esteemed, since those who know him give him this mark of their appreciation.'",
          "'Good!' said Holmes. 'Excellent!'",
          "'I think also that the probability is in favour of his being a country practitioner who does a great deal of his visiting on foot.'",
          "'Why so?'",
          "'Because this stick, though originally a very handsome one, has been so knocked about that I can hardly imagine a town practitioner carrying it. The thick iron ferrule is worn down, so it is evident that he has done a great amount of walking with it.'",
          "'Perfectly sound!' said Holmes. 'And then again, there is the \"friends of the C.C.H.\" I should guess that to be the Something Hunt, the local hunt to whose members he has possibly given some surgical assistance, and which has made him a small presentation in return.'",
          "'Really, Watson, you excel yourself,' said Holmes, pushing back his chair and lighting a cigarette. 'I am bound to say that in all the accounts which you have been so good as to give of my own small achievements you have habitually underestimated your own abilities. It may be that you are not yourself luminous, but you are a conductor of light. Some people without possessing genius have a remarkable power of stimulating it. I confess, my dear fellow, that I am very much in your debt.'",
          "He had never said so much before, and I must admit that his words gave me keen pleasure, for I had often been piqued by his indifference to my admiration and to the attempts which I had made to give publicity to his methods. I was proud, too, to think that I had so far mastered his system as to apply it in a way which earned his approval.",
          "He now took the stick from my hands and examined it for a few minutes with his naked eyes. Then with an expression of interest he laid down his cigarette, and, carrying the cane to the window, he looked over it again with a convex lens.",
          "'Interesting, though elementary,' said he as he returned to his favourite corner of the settee. 'There are certainly one or two indications upon the stick. It gives us the basis for several deductions.'",
          "'Has anything escaped me?' I asked with some self-importance. 'I trust that there is nothing of consequence which I have overlooked?'",
          "'I am afraid, my dear Watson, that most of your conclusions were erroneous. When I said that you stimulated me I meant, to be frank, that in noting your fallacies I was occasionally guided towards the truth. Not that you are entirely wrong in this instance. The man is certainly a country practitioner. And he walks a good deal.'",
          "'Then I was right.'",
          "'To that extent.'",
          "'And that was all?'",
          "'No, no, my dear Watson, not all—by no means all. I would suggest, for example, that a presentation to a doctor is more likely to come from a hospital than from a hunt, and that when the initials \"C.C.\" are placed before that hospital the words \"Charing Cross\" very naturally suggest themselves.'",
          "'You may be right.'",
          "'The probability lies in that direction. And if we take this as a working hypothesis we have a fresh basis from which to start our construction of this unknown visitor.'",
          "'Well, then, supposing that \"C.C.H.\" does stand for \"Charing Cross Hospital,\" what further inferences may we draw?'",
          "'Do none suggest themselves? You know my methods. Apply them!'",
          "'I can only think of the obvious conclusion that the man has practised in town before going into the country.'",
          "'I would suggest that we may venture a little further than that. Consider: what occasion is a presentation most likely to occur? When would his friends unite to give him a pledge of their good will? Obviously at the moment when Dr. Mortimer withdrew from the service of the hospital to start in practice for himself. We know there has been a presentation. We believe there has been a change from a town hospital to a country practice. Is it, then, stretching our supposition too far to say that the presentation was on the occasion of the change?'",
          "'It certainly seems probable.'",
          "'Now, you will observe that he could not have been on the staff of the hospital, since only a man well-established in a London practice could hold such a position, and such a one would not drift into the country. What was he, then? If he was in the hospital and yet not on the staff he could only have been a house-surgeon or a house-physician—little more than a senior student. And he left five years ago—the date is on the stick. So your grave, middle-aged family practitioner vanishes into thin air, my dear Watson, and there emerges a young fellow under thirty, amiable, unambitious, absent-minded, and the possessor of a favourite dog, which I should describe roughly as being larger than a terrier and smaller than a mastiff.'",
        ],
        vocabulary: [
          { term: "Deduce / Deduction", phonetic: "/dɪˈdjuːs/", meaningFa: "نتیجه‌گیری منطقی بر اساس شواهد موجود", example: "What do you deduce from our visitor's stick?" },
          { term: "Practitioner", phonetic: "/prækˈtɪʃənər/", meaningFa: "پزشک شاغل در مطب عمومی یا درمانگاه", example: "He is a country medical practitioner." },
          { term: "Luminous", phonetic: "/ˈluːmɪnəs/", meaningFa: "درخشان، روشن‌کننده", example: "You are not yourself luminous, but you are a conductor of light." },
          { term: "Erroneous", phonetic: "/ɪˈrəʊniəs/", meaningFa: "اشتباه، نادرست", example: "Most of your conclusions were erroneous." },
          { term: "Absent-minded", phonetic: "/ˌæbsəntˈmaɪndɪd/", meaningFa: "حواس‌پرت، فراموش‌کار", example: "A young fellow under thirty, amiable and absent-minded." },
        ],
        keyTakeawaysFa: [
          "تفاوت قائل شدن میان دیدن سطحی (Seeing) و مشاهده عمیق تحلیلی (Observing).",
          "استفاده از شواهد فیزیکی ملموس (خراش‌های عصا، حکاکی حروف اختصاری) برای بازسازی مشخصات صاحب آن.",
        ],
      },
      {
        id: "ch-2",
        number: 2,
        titleFa: "فصل دوم: افسانه درنده باکرویل",
        titleEn: "Chapter 2: The Curse of the Baskervilles",
        subtitle: "The Ancient Manuscript",
        content: [
          "Dr. James Mortimer drew a folded manuscript from his breast-pocket.",
          "'I have in my pocket, Mr. Sherlock Holmes, an ancient manuscript,' said he.",
          "'I observed that as you entered the room,' said Holmes.",
          "'It is an old manuscript.'",
          "'Early eighteenth century, unless it is a forgery.'",
          "'How can you say that, sir?'",
          "'You have presented an inch or two of it to my examination all the time you have been talking. It is a poor expert who cannot tell the date of a document within a decade or so. I put it at 1730.'",
          "'The exact date is 1742,' Dr. Mortimer answered. 'This family paper was committed to my care by Sir Charles Baskerville, whose sudden and tragic death some three months ago created so much excitement in Devonshire. I may say that I was his personal friend as well as his medical attendant.'",
          "'He was a strong-minded man, sir, shrewd, practical, and as little imaginative as I am myself. Yet he took this document very seriously, and his mind was prepared for just such an end as did eventually overtake him.'",
          "Holmes leaned forward, rested his elbows upon his knees, and closed his eyes in rapt attention. Dr. Mortimer turned the manuscript to the light and read in a high, cracking voice the following curious narrative:",
          "'Of the origin of the Hound of the Baskervilles there have been many statements, yet as I come in a direct line from Hugo Baskerville, and as I had the story from my father, who also had it from his, I have set it down with all the truth.'",
          "'Know then that at the time of the Great Rebellion, this Hugo Baskerville was the lord of the manor of Baskerville, a wild, profane, and godless man. Now it happened that this Hugo had a wicked passion for the daughter of a yeoman who held lands near the Baskerville estate...'",
        ],
        vocabulary: [
          { term: "Manuscript", phonetic: "/ˈmænjuskrɪpt/", meaningFa: "دست‌نوشته کهن، نسخه خطی", example: "He drew an ancient manuscript from his pocket." },
          { term: "Forgery", phonetic: "/ˈfɔːdʒəri/", meaningFa: "جعل، سند ساختگی", example: "Early eighteenth century, unless it is a forgery." },
          { term: "Shrewd", phonetic: "/ʃruːd/", meaningFa: "زیرک، باهوش و عمل‌گرا", example: "He was a strong-minded man, shrewd and practical." },
          { term: "Manor", phonetic: "/ˈmænər/", meaningFa: "عمارت و املاک اربابی روستایی", example: "Hugo was lord of the manor of Baskerville." },
        ],
        keyTakeawaysFa: [
          "نفرین خاندان باسکرویل ریشه در غرور و بی‌عدالتی نیاکان در قرن هفدهم دارد.",
          "رمزگشایی از سند دست‌نویس تاریخی توسط هولمز با توجه به جنس کاغذ و خط.",
        ],
      },
      {
        id: "ch-3",
        number: 3,
        titleFa: "فصل سوم: مشکل و ماجرای سر چارلز",
        titleEn: "Chapter 3: The Problem",
        subtitle: "Footprints of a Gigantic Hound",
        content: [
          "Dr. Mortimer refolded his paper and replaced it in his pocket. 'That is the story of the Baskervilles, Mr. Holmes, which has been handed down from generation to generation.'",
          "'And what has that to do with the death of Sir Charles?' asked Holmes.",
          "'Mr. Holmes, Sir Charles was found dead at the head of the famous Yew Alley on the night of the fourth of May. The official report said heart exhaustion. But there were signs which no one noticed except myself.'",
          "'What signs?'",
          "'Sir Charles was waiting for someone by the gate. His ash had dropped twice from his cigar. And then he had evidently run down the alley for his life, running until his heart burst.'",
          "'And near the body?' asked Holmes, his voice sharp with suppressed excitement.",
          "'Mr. Holmes, the footprints of Sir Charles were there.'",
          "'And no others?'",
          "'None.'",
          "Holmes looked disappointed. 'I had hoped for more.'",
          "'Mr. Holmes,' whispered Dr. Mortimer, leaning over the table, 'they were not the footprints of a man.'",
          "'A woman, then?'",
          "'Mr. Holmes, they were the footprints of a gigantic hound!'",
        ],
        vocabulary: [
          { term: "Footprints", phonetic: "/ˈfʊtprɪnts/", meaningFa: "رد پا، اثر پا بر زمین", example: "They were the footprints of a gigantic hound." },
          { term: "Gigantic", phonetic: "/dʒaɪˈɡæntɪk/", meaningFa: "غول‌پیکر، بسیار عظیم", example: "A hound of gigantic dimensions." },
          { term: "Exhaustion", phonetic: "/ɪɡˈzɔːstʃən/", meaningFa: "فرسودگی مفرط، از کار افتادگی", example: "He died of heart exhaustion." },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // 2. 504 Absolutely Essential Words
  // ---------------------------------------------------------------------------
  "skill-504-words": {
    id: "skill-504-words",
    titleFa: "۵۰۴ واژه کاملاً ضروری زبان انگلیسی",
    titleEn: "504 Absolutely Essential Words (Enhanced Study Edition)",
    author: "Murray Bromberg, Julius Liebb, Arthur Traiger",
    genre: "واژگان کاربردی و آزمون‌های بین‌المللی",
    level: "تمام سطوح / متوسط تا پیشرفته",
    introFa:
      "کتاب ۵۰۴ واژه یکی از معتبرترین و شناخته‌شده‌ترین منابع آموزش لغت در سراسر جهان است. در این ویرایش استاندارد، ۴۲ درس تنظیم شده که هر درس شامل ۱۲ کلمه کلیدی، مثال‌های متنوع و داستان جذاب است تا لغات در حافظه بلندمدت تثبیت شوند.",
    readingTipsFa: [
      "هر کلمه را ابتدا در جمله و بافت داستانی بخوانید، سپس مترادف‌های آن را بررسی کنید.",
      "سعی کنید با هر یک از ۱۲ واژه یک جمله از زندگی روزمره خود بنویسید.",
      "تلفظ صحیح فونتیک هر واژه را با صدای بلند تکرار کنید.",
    ],
    pdfUrl: "https://dl.endoora.ir/books/504_essential_words_enhanced.pdf",
    chapters: [
      {
        id: "lesson-1",
        number: 1,
        titleFa: "درس اول: ۱۲ واژه کلیدی اول",
        titleEn: "Lesson 1: The Essential Dozen",
        subtitle: "Focus Words & Story: My Brother, the Gentleman",
        content: [
          "Welcome to Lesson 1 of 504 Absolutely Essential Words. The following 12 words are fundamental building blocks for high-level reading comprehension, academic writing, and everyday fluency.",
          "Story: My Brother, the Gentleman",
          "The story of my brother who tried to become a gentleman began when he decided to abandon his old, reckless habits. He was keen on improving his standing in the community and knew that to succeed, he had to exercise great tact when dealing with difficult neighbours.",
          "One evening, my brother took an oath that he would never again allow anger to ruin a good friendship. Though the old family house had remained vacant for years, he undertook the hardship of restoring it with his own hands.",
          "Everyone praised his gallant efforts to rescue the family heritage. Armed with accurate data about the real estate market, he proved that he was no longer an unaccustomed novice. Even as an unmarried bachelor, he demonstrated the maturity needed to qualify for a substantial bank loan.",
          "In the end, his dedication transformed him from an insecure dreamer into a respected citizen whose word was as solid as iron.",
        ],
        vocabulary: [
          { term: "1. abandon", phonetic: "/əˈbændən/", meaningFa: "رها کردن، ترک کردن، دست کشیدن از", example: "He decided to abandon his old habits." },
          { term: "2. keen", phonetic: "/kiːn/", meaningFa: "مشتاق، تیز، مشتاقانه علاقه‌مند به", example: "He was keen on improving his english vocabulary." },
          { term: "3. jealous", phonetic: "/ˈdʒeləs/", meaningFa: "حسود، رشک‌ورز", example: "A jealous friend can disrupt your peace of mind." },
          { term: "4. tact", phonetic: "/tækt/", meaningFa: "نزاکت، درایت در گفتار و رفتار", example: "It requires great tact to give constructive feedback." },
          { term: "5. oath", phonetic: "/əʊθ/", meaningFa: "سوگند، قسم رسمی", example: "He took an oath to uphold the law." },
          { term: "6. vacant", phonetic: "/ˈveɪkənt/", meaningFa: "خالی، بدون سکنه یا بدون متصدی", example: "The seat beside the window was still vacant." },
          { term: "7. hardship", phonetic: "/ˈhɑːdʃɪp/", meaningFa: "سختی، تنگدستی، مشقت زندگی", example: "They endured severe hardship during the winter." },
          { term: "8. gallant", phonetic: "/ˈɡælənt/", meaningFa: "شجاع، دلاور، باادب و جوانمرد", example: "The firefighters made a gallant rescue." },
          { term: "9. data", phonetic: "/ˈdeɪtə/", meaningFa: "داده‌ها، اطلاعات و شواهد آماری", example: "The research data supported our hypothesis." },
          { term: "10. unaccustomed", phonetic: "/ˌʌnəˈkʌstəmd/", meaningFa: "عادت‌نداشته، ناآشنا به چیزی", example: "He was unaccustomed to such cold weather." },
          { term: "11. bachelor", phonetic: "/ˈbætʃələr/", meaningFa: "مرد مجرد", example: "My uncle remained a confirmed bachelor." },
          { term: "12. qualify", phonetic: "/ˈkwɒlɪfaɪ/", meaningFa: "واجد شرایط شدن، صلاحیت کسب کردن", example: "He worked hard to qualify for the final exam." },
        ],
        keyTakeawaysFa: [
          "تسلط بر ۱۲ واژه اساسی درس اول و کاربرد آن‌ها در جملات توصیفی.",
          "توانایی شناسایی و استفاده از واژگان در فرم‌های اسمی و فعلی (مانند abandon / abandonment، qualify / qualification).",
        ],
      },
      {
        id: "lesson-2",
        number: 2,
        titleFa: "درس دوم: ۱۲ واژه کاربردی دوم",
        titleEn: "Lesson 2: Mystery and Adventure",
        subtitle: "Focus Words & Story: Bet Your Life",
        content: [
          "Lesson 2 introduces words frequently encountered in suspense fiction, journalism, and vivid descriptive writing.",
          "Story: Bet Your Life",
          "The detective knew that the criminal had tried to conceal the stolen jewels inside a hollow statue. Outside, the night was frigid and dark; the bitter mountain winds caused the officers' hands to become completely numb.",
          "They were entering a zone of extreme peril, where deep cliffs posed a constant hazard. When a sudden chilling shriek echoed through the cavern, even the most experienced guards hesitated.",
          "A sinister shadow moved across the wall, tempting the young deputy to fire blindly. But Captain Miller ordered everyone to recline behind the rocks and wait until daylight.",
          "It was a dangerous wager, but patience proved triumphant when the fugitives surrendered without a single gunshot being traded.",
        ],
        vocabulary: [
          { term: "1. corpse", phonetic: "/kɔːps/", meaningFa: "جسد، جنازه انسان", example: "The detectives guarded the scene where the corpse was found." },
          { term: "2. conceal", phonetic: "/kənˈsiːl/", meaningFa: "پنهان کردن، مخفی نگه‌داشتن", example: "He tried to conceal his anxiety with a wide smile." },
          { term: "3. dismal", phonetic: "/ˈdɪzməl/", meaningFa: "دلگیر، غم‌افزا، تاریک و ناامیدکننده", example: "The weather was dismal throughout November." },
          { term: "4. frigid", phonetic: "/ˈfrɪdʒɪd/", meaningFa: "بسیار سرد، منجمدکننده", example: "The frigid arctic air chilled everyone to the bone." },
          { term: "5. inhabit", phonetic: "/ɪnˈhæbɪt/", meaningFa: "ساکن شدن در، زندگی کردن در", example: "Rare birds inhabit this secluded forest." },
          { term: "6. numb", phonetic: "/nʌm/", meaningFa: "بی‌حس، کرخ", example: "My fingers grew numb from the freezing wind." },
          { term: "7. peril", phonetic: "/ˈperəl/", meaningFa: "خطر بزرگ، مهلکه", example: "They were in grave peril until the rescue team arrived." },
          { term: "8. recline", phonetic: "/rɪˈklaɪn/", meaningFa: "لم دادن، تکیه دادن به پشت", example: "He reclined in his favorite armchair with a novel." },
          { term: "9. shriek", phonetic: "/ʃriːk/", meaningFa: "جیغ کشیدن، فریاد بلند کشیدن", example: "A loud shriek echoed through the empty hallway." },
          { term: "10. sinister", phonetic: "/ˈsɪnɪstər/", meaningFa: "شوم، شرورانه، تهدیدآمیز", example: "There was something sinister about his calm demeanor." },
          { term: "11. tempt", phonetic: "/tempt/", meaningFa: "وسوسه کردن، ترغیب به کار وسوسه‌انگیز", example: "Do not tempt fate by driving recklessly." },
          { term: "12. wager", phonetic: "/ˈweɪdʒər/", meaningFa: "شرط‌بندی کردن، ریسک کردن", example: "I will wager ten dollars that our team wins tonight." },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // 3. Speak English Like an American
  // ---------------------------------------------------------------------------
  "skill-speak-american": {
    id: "skill-speak-american",
    titleFa: "انگلیسی را مثل یک آمریکایی صحبت کن",
    titleEn: "Speak English Like an American",
    author: "Amy Gillett",
    genre: "اصطلاحات عامیانه و گفتاری (Idioms & Expressions)",
    level: "متوسط تا پیشرفته (B1-C1)",
    introFa:
      "کتاب Speak English Like an American یکی از محبوب‌ترین کتاب‌های یادگیری اصطلاحات روزمره و عبارات محاوره‌ای در آمریکاست. شما در جریان ماجراهای خانواده جانسون (باب، تد، سوزان و نیکول) با پرکاربردترین اصطلاحات زبان انگلیسی عامیانه آشنا می‌شوید.",
    readingTipsFa: [
      "اصطلاحات داخل دیالوگ را کلمه به کلمه ترجمه نکنید؛ به معنای اصطلاحی کلی (Idiomatic meaning) دقت نمایید.",
      "دیالوگ‌ها را با صدای رسا بخوانید تا ریتم گفتگوی خودمانی را حس کنید.",
    ],
    pdfUrl: "https://dl.endoora.ir/books/speak_english_like_an_american_full.zip",
    chapters: [
      {
        id: "lesson-1",
        number: 1,
        titleFa: "درس اول: روز کاری باب (Bob's Day at Work)",
        titleEn: "Lesson 1: Bob's Day at Work",
        subtitle: "Everyday Idioms in the Workplace",
        content: [
          "Scene: Bob works as a manager in a furniture manufacturing company. Today, his boss, Peter, dropped a bombshell.",
          "Dialogue:",
          "Bob: 'Peter, we need to talk about the sales figures for the past quarter.'",
          "Peter: 'I know, Bob. Things have gone from bad to worse. If we can't boost revenue by twenty percent this month, the head office will give us the ax.'",
          "Bob: 'Give us the ax? But we've been working around the clock! Our team is putting their best foot forward.'",
          "Peter: 'I appreciate your dedication, Bob, but the board only cares about the bottom line. Don't lose your head, but we must make headway immediately.'",
          "Bob: 'Alright, Peter. If worse comes to worst, we can offer an end-of-season discount to clear inventory. Let's hang in there and keep our chin up!'",
          "Peter: 'That sounds like a last ditch effort, but it might just save our necks. Let's get cracking!'",
        ],
        vocabulary: [
          { term: "give someone the ax", meaningFa: "کسی را اخراج کردن از کار (fire someone)", example: "The company gave fifty workers the ax." },
          { term: "around the clock", meaningFa: "شبانه روزی، بیست و چهار ساعته", example: "Engineers worked around the clock to fix the power outage." },
          { term: "put one's best foot forward", meaningFa: "تمام تلاش خود را کردن، بهترین نمایش را ارائه دادن", example: "In an interview, always put your best foot forward." },
          { term: "lose one's head", meaningFa: "کنترل خود را از دست دادن، دستپاچه شدن", example: "Don't lose your head when emergencies occur." },
          { term: "hang in there", meaningFa: "طاقت بیار، مقاومت کن، کم نیار", example: "Hang in there, exams will be over next week!" },
          { term: "keep one's chin up", meaningFa: "روحیه خود را حفظ کردن، سرت رو بالا بگیر", example: "Keep your chin up, things will improve soon." },
          { term: "get cracking", meaningFa: "دست به کار شدن، زود شروع کردن", example: "We have a lot of chores today, let's get cracking!" },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // 4. English Grammar in Use
  // ---------------------------------------------------------------------------
  "skill-grammar-in-use": {
    id: "skill-grammar-in-use",
    titleFa: "گرامر این یوز (English Grammar in Use)",
    titleEn: "English Grammar in Use (5th Edition)",
    author: "Raymond Murphy",
    genre: "مرجع جامع گرامر زبان انگلیسی",
    level: "متوسط (Intermediate B1-B2)",
    introFa:
      "معروف‌ترین و پرفروش‌ترین کتاب گرامر زبان انگلیسی در جهان اثر ریموند مورفی. این کتاب به دلیل ساختار دو صفحه‌ای مشهورش (سمت چپ توضیح ساده و کاربردی، سمت راست تمرین‌های تثبیت‌کننده) انتخابی ایده‌آل برای تمام زبان‌آموزان است.",
    readingTipsFa: [
      "ابتدا مثال‌ها و تفاوت موقعیت‌های کاربرد هر زمان را مرور کنید.",
      "به نکات مقایسه‌ای (Contrast) بین زمان‌های گذشته، حال ساده و استمراری بسیار توجه داشته باشید.",
    ],
    pdfUrl: "https://dl.endoora.ir/books/English_Grammar_in_Use_5th.pdf",
    chapters: [
      {
        id: "unit-1",
        number: 1,
        titleFa: "یونیت اول: زمان حال استمراری (I am doing)",
        titleEn: "Unit 1: Present Continuous (I am doing)",
        subtitle: "Actions happening at or around the time of speaking",
        content: [
          "Study this example situation:",
          "Sarah is in her car. She is on her way to work. She is driving to work.",
          "This means: she is driving now, at the time of speaking. The action is not finished.",
          "Structure: am / is / are + -ing (present participle)",
          "Examples:",
          "• Please don't make so much noise. I'm trying to work. (not 'I try')",
          "• Where is Mark? 'He's having a shower.' (not 'He has')",
          "• Let's go out now. It isn't raining any more. (not 'It doesn't rain')",
          "• 'How's your new job going?' 'It's going very well, thanks.'",
          "Note on changes happening around now:",
          "We use the present continuous when we talk about changes happening around now, especially with verbs like: get, change, become, increase, rise, fall, grow, improve, begin, start.",
          "• Is your English getting better? (not 'Does your English get better')",
          "• The population of the world is increasing very fast.",
        ],
        vocabulary: [
          { term: "Present Continuous", meaningFa: "زمان حال استمراری برای کارهایی که هم‌اکنون در جریانند", example: "I am reading this book right now." },
          { term: "Temporary situations", meaningFa: "موقعیت‌های موقت که پایان می‌یابند", example: "I'm living with friends until I find a flat." },
        ],
      },
      {
        id: "unit-2",
        number: 2,
        titleFa: "یونیت دوم: زمان حال ساده (I do)",
        titleEn: "Unit 2: Present Simple (I do)",
        subtitle: "Habits, general truths, and permanent situations",
        content: [
          "Study this example situation:",
          "Alex is a bus driver, but now he is in bed asleep. He is not driving a bus. (He is asleep.)",
          "BUT he drives a bus. He is a bus driver.",
          "Formula: drive(s), work(s), do(es) etc. is the present simple.",
          "We use the present simple to talk about things in general. We use it to say that something happens all the time or repeatedly, or that something is true in general:",
          "• Nurses look after patients in hospitals.",
          "• I usually leave for work at 8 o'clock in the morning.",
          "• The earth goes round the sun.",
          "• The cafe opens at 7:30 every morning.",
          "Remember: I/we/you/they work - he/she/it works.",
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // 5. The Great Gatsby
  // ---------------------------------------------------------------------------
  "novel-great-gatsby": {
    id: "novel-great-gatsby",
    titleFa: "گتسبی بزرگ",
    titleEn: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "رمان کلاسیک / ادبیات قرن بیستم",
    level: "سطح B2",
    introFa:
      "شاهکار اف. اسکات فیتزجرالد، روایتی درخشان از دوران طلایی جاز در نیویورک دهه ۱۹۲۰ است. داستان از زبان نیک کاراوی روایت می‌شود که همسایه جی گتسبی، میلیونر اسرارآمیزی است که مهمانی‌های باشکوهی برای بازیابی عشق گمشده‌اش، دیزی بیوکنن، برپا می‌کند.",
    readingTipsFa: [
      "به توصیف‌های نمادین کتاب توجه کنید (نور سبز انتهای اسکله، دره خاکستر).",
      "قلم فیتزجرالد دارای ریتمی شاعرانه و غنی از صفات تماشایی است.",
    ],
    pdfUrl: "https://dl.endoora.ir/novels/the_great_gatsby_b2_audiobook.zip",
    chapters: [
      {
        id: "ch-1",
        number: 1,
        titleFa: "فصل اول: روزهای جوانی و نصیحت پدر",
        titleEn: "Chapter 1: In My Younger and More Vulnerable Years",
        subtitle: "Nick Carraway Arrives in West Egg",
        content: [
          "In my younger and more vulnerable years my father gave me some advice that I’ve been turning over in my mind ever since.",
          "'Whenever you feel like criticizing any one,' he told me, 'just remember that all the people in this world haven’t had the advantages that you’ve had.'",
          "He didn't say any more, but we’ve always been unusually communicative in a reserved way, and I understood that he meant a great deal more than that. In consequence, I’m inclined to reserve all judgements, a habit that has opened up many curious natures to me and also made me the victim of not a few veteran bores.",
          "When I came back from the East last autumn I felt that I wanted the world to be in uniform and at a sort of moral attention forever; I wanted no more riotous excursions with privileged glimpses into the human heart. Only Gatsby, the man who gives his name to this book, was exempt from my reaction—Gatsby, who represented everything for which I have an unaffected scorn.",
          "If personality is an unbroken series of successful gestures, then there was something gorgeous about him, some heightened sensitivity to the promises of life, as if he were related to one of those intricate machines that register earthquakes ten thousand miles away.",
        ],
        vocabulary: [
          { term: "Vulnerable", phonetic: "/ˈvʌlnərəbl/", meaningFa: "آسیب‌پذیر، حساس در برابر گزند", example: "In my younger and more vulnerable years." },
          { term: "Reserve judgements", meaningFa: "قضاوت نکردن عجولانه درباره دیگران", example: "I am inclined to reserve all judgements." },
          { term: "Scorn", phonetic: "/skɔːn/", meaningFa: "تحقیر، بیزاری عمیق", example: "He represented everything for which I have an unaffected scorn." },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // 6. American English File Starter (3rd Edition)
  // ---------------------------------------------------------------------------
  "aef-starter-3rd": {
    id: "aef-starter-3rd",
    titleFa: "امریکن انگلیش فایل استارتر (ویرایش سوم)",
    titleEn: "American English File Starter (3rd Edition)",
    author: "Christina Latham-Koenig, Clive Oxenden",
    genre: "دوره جامع آموزش مکالمه و مهارت‌های زبان",
    level: "مبتدی (Starter / A1)",
    introFa:
      "محبوب‌ترین متد آموزش مکالمه انگلیسی در آموزشگاه‌های ایران و سراسر دنیا. سطح Starter پایه‌ترین سطح این مجموعه بوده و برای یادگیری الفبا، تلفظ صحیح، مکالمات احوال‌پرسی روزمره و جمله‌سازی‌های ساده طراحی شده است.",
    readingTipsFa: [
      "به الگوهای پرسش و پاسخ (Question & Answer) در مکالمات دقت کنید.",
      "فایل‌های کتاب کار (Workbook) و صوت‌های همراه را از منوی ضمیمه دریافت نمایید.",
    ],
    pdfUrl: "https://github.com/SajadZare11/ENDOORA/releases/download/media-aef-starter/AEF-Starter-3rd-Complete.zip",
    chapters: [
      {
        id: "unit-1",
        number: 1,
        titleFa: "درس اول: سلام! خوشبختم (Hello & Introductions)",
        titleEn: "Unit 1: Hello! Nice to meet you",
        subtitle: "Grammar: Verb 'to be' • Vocabulary: Days of the Week, Numbers 0-10",
        content: [
          "Welcome to American English File Starter. Let's begin with everyday greetings and introductions.",
          "Conversation A: Meeting for the First Time",
          "• Lisa: Hello, I'm Lisa Silva. What's your name?",
          "• Mark: Hi Lisa. My name is Mark Richardson. Nice to meet you.",
          "• Lisa: Nice to meet you, too. Are you a student here?",
          "• Mark: Yes, I am. I'm in class 3B with Mr. Davis.",
          "• Lisa: Great! I'm in class 3B, too!",
          "Grammar Rule: The verb 'to be' (am / is / are)",
          "• I am (I'm) a student.",
          "• You are (You're) in room 4.",
          "• He is (He's) the teacher.",
          "• She is (She's) my classmate.",
          "Vocabulary: Numbers 0 to 10",
          "Zero (0), One (1), Two (2), Three (3), Four (4), Five (5), Six (6), Seven (7), Eight (8), Nine (9), Ten (10).",
        ],
        vocabulary: [
          { term: "Nice to meet you", meaningFa: "از آشنایی با شما خوشبختم", example: "Hello Mark, nice to meet you." },
          { term: "Classmate", meaningFa: "هم‌کلاسی", example: "She is my new classmate." },
        ],
      },
      {
        id: "unit-2",
        number: 2,
        titleFa: "درس دوم: مردم و کشورها (People & Places)",
        titleEn: "Unit 2: Where are you from?",
        subtitle: "Countries, Nationalities and the Negative / Question forms of 'to be'",
        content: [
          "Conversation: Where are you from?",
          "• Alex: Where are you from, Sofia?",
          "• Sofia: I'm from Madrid, in Spain.",
          "• Alex: Oh, are you Spanish?",
          "• Sofia: Yes, I am. And where are you from?",
          "• Alex: I'm from Toronto, Canada. So I'm Canadian.",
          "Question Form:",
          "• Are you from Spain? - Yes, I am. / No, I'm not.",
          "• Is he American? - Yes, he is. / No, he isn't.",
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // 7. National Final Exam - Khordad 1404
  // ---------------------------------------------------------------------------
  "exam-khordad-1404": {
    id: "exam-khordad-1404",
    titleFa: "امتحان نهایی زبان انگلیسی دوازدهم - خرداد ۱۴۰۴",
    titleEn: "National Final Examination Grade 12 - June 2025",
    author: "مرکز سنجش آموزش و پرورش",
    genre: "دفترچه سوالات رسمی کشوری و پاسخ‌نامه تحلیلی",
    level: "پایه دوازدهم (کلیه رشته‌ها)",
    introFa:
      "دفترچه کامل سوالات نهایی خرداد ۱۴۰۴ به همراه کلید رسمی دبیرخانه کشوری، متن فایل‌های شنیداری (Listening Transcripts) و توضیحات گرامر و واژگان. مطالعه این نمونه آزمون به داوطلبان کمک می‌کند فرمت سوالات امتحان نهایی جدید را به دقت فراگیرند.",
    readingTipsFa: [
      "ابتدا سوالات بخش لیسنینگ را بخوانید و کلیدواژه‌های خواسته شده را حدس بزنید.",
      "سپس به متن فایل شنیداری گوش دهید یا متن پیاده شده را بررسی کنید.",
    ],
    pdfUrl: "/scratch/exams/12th-Khordad-1404.pdf",
    chapters: [
      {
        id: "part-1",
        number: 1,
        titleFa: "بخش اول: آزمون شنیداری (Listening Section)",
        titleEn: "Section 1: Listening Comprehension Texts & Questions",
        subtitle: "Official Transcript and Multiple-choice Questions",
        content: [
          "Listening Part 1: Students, please listen carefully to the conversation between Dr. Rezaei and an interviewer about renewable energy.",
          "Transcript:",
          "Interviewer: Dr. Rezaei, welcome to our program. Could you explain why clean energy sources are becoming so vital for our country?",
          "Dr. Rezaei: Certainly. Fossil fuels like coal and crude oil produce heavy greenhouse gas emissions that damage our atmosphere. Wind turbines and solar panels, however, harness inexhaustible natural forces without emitting toxic pollutants.",
          "Interviewer: How can high school students contribute to energy conservation?",
          "Dr. Rezaei: Simple daily habits make a tremendous difference—turning off appliances when not in use, using public transit, and spreading awareness in their communities.",
          "Sample Questions:",
          "1. What is the primary disadvantage of fossil fuels mentioned by Dr. Rezaei?",
          "   a) High setup costs    b) Greenhouse gas emissions    c) Short lifespan",
          "2. Name two examples of renewable energy sources stated in the audio.",
        ],
        keyTakeawaysFa: [
          "کلید سوال اول: گزینه b (Greenhouse gas emissions).",
          "کلید سوال دوم: Wind turbines (توربین‌های بادی) و Solar panels (پنل‌های خورشیدی).",
        ],
      },
      {
        id: "part-2",
        number: 2,
        titleFa: "بخش دوم: درک مطلب و واژگان (Reading & Vocabulary)",
        titleEn: "Section 2: Reading Passage & Cloze Test",
        subtitle: "Passage: The Legacy of Avicenna & Medical Discoveries",
        content: [
          "Read the passage carefully and answer the following questions:",
          "Ibn Sina, universally celebrated in the Western world as Avicenna, was one of the most distinguished polymaths of the Islamic Golden Age. Born in 980 CE near Bukhara, he displayed extraordinary intellectual capacity from early childhood.",
          "His magnum opus, 'The Canon of Medicine' (القانون فی الطب), served as the paramount medical encyclopedia throughout European and Middle Eastern universities for over five centuries.",
          "He pioneered systematic clinical observation, recognized the contagious nature of infectious diseases, and highlighted the psychological dimensions of physical wellness.",
        ],
      },
    ],
  },
};

/**
 * Helper to get or generate book reading content for any item in DOWNLOAD_ITEMS
 */
export function getBookContent(itemId: string): BookContentData {
  if (BOOK_CONTENTS[itemId]) {
    return BOOK_CONTENTS[itemId];
  }

  // Find item from catalog
  const found = DOWNLOAD_ITEMS.find((it) => it.id === itemId);
  if (!found) {
    return {
      id: itemId,
      titleFa: "کتاب یافت نشد",
      titleEn: "Book Not Found",
      author: "ناشناس",
      genre: "عمومی",
      level: "همه سطوح",
      introFa: "متاسفانه اطلاعات متنی این کتاب در سامانه ثبت نشده است.",
      readingTipsFa: [],
      chapters: [],
    };
  }

  // Generate a handsome fallback reading experience
  return {
    id: found.id,
    titleFa: found.titleFa,
    titleEn: found.titleEn,
    author: found.authorOrPublisher,
    genre: found.categoryLabelFa,
    level: found.cefrLevel,
    introFa: found.descriptionFa,
    readingTipsFa: [
      "می‌توانید نسخه اصلی فایل را از تب «نسخه اصل فایل / PDF» به‌صورت تمام‌صفحه مشاهده فرمایید.",
      "کلیه بخش‌های تفکیک‌شده (کتاب کار، راهنمای تدریس، صوت‌ها) در پنل ضمیمه‌ها برای دانلود در دسترس هستند.",
      "تنظیمات قلم و نور صفحه بر روی این محیط ذخیره خواهند شد.",
    ],
    pdfUrl: found.downloadUrl,
    chapters: [
      {
        id: "overview",
        number: 1,
        titleFa: "معرفی و نمای کلی کتاب",
        titleEn: "Overview & Study Guide",
        subtitle: found.titleEn,
        content: [
          `به بخش مطالعه اختصاصی «${found.titleFa}» خوش آمدید.`,
          found.descriptionFa,
          `این منبع آموزشی ارزشمند توسط «${found.authorOrPublisher}» تهیه و تدوین گردیده و برای زبان‌آموزان و دانش‌پژوهان سطح ${found.cefrLevel} بهینه‌سازی شده است.`,
          "برای مطالعه مستقیم و ورق زدن صفحات کتاب اصلی، می‌توانید از دکمه سوئیچ بالای صفحه گزینه «📄 نسخه اصل فایل / PDF» را انتخاب نمایید تا فایل بدون نیاز به نرم‌افزار جانبی در همین صفحه برای شما گشوده شود.",
          "همچنین تمامی اجزای تفکیک‌شده این پکیج دانلودی از دکمه «📂 ضمیمه‌ها و دانلود اجزا» قابل دریافت مستقیم با حداکثر سرعت هستند.",
        ],
      },
    ],
  };
}
