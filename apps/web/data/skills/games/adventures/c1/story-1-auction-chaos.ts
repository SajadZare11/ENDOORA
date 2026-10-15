import { buildAdventureStory, NodeDraft, EndingDraft } from "../builder";
import type { AdventureStory } from "../../reading-adventure-types";

// ============================================================================
// STORY 1 (C1 - Adult): The Grand Auction House Catastrophe (ماجرای خنده‌دار چکش حراج و نقاشی نامرئی)
// Genre: Humor & Everyday Life (طنز و روزمره)
// CEFR: C1 (Inversion with negative adverbials, mixed conditionals, past deduction modals, high-society workplace satire)
// Characters: Arthur Pendelton (Chief Auctioneer), Vivian Sterling (Senior Gallery Curator), Lord Harrington (Tech Billionaire)
// ============================================================================

const nodes: NodeDraft[] = [
  // STEP 1: Root
  {
    stepNumber: 1,
    pathCode: "root",
    passageEn:
      "Scarcely had the crystal chandeliers of the prestigious Mayfair auction house dimmed when Lot 42 was wheeled onto the velvet dais. The item in question was an audacious avant-garde canvas titled 'Absolute Nothingness'—a completely blank, white linen frame insured for eight hundred thousand pounds. Presiding over the podium with forty years of unflappable poise, Chief Auctioneer Arthur Pendelton adjusted his gold pince-nez. In the front row sat Lord Alistair Harrington, an eccentric robotics magnate suffering from an acute seasonal head cold. No sooner had Arthur opened bidding at two million pounds than Harrington unleashed a thunderous, convulsive sneeze, inadvertently jerking his ivory bidding paddle high above his head. Arthur's gavel struck the sound block with an authoritative crack: 'Sold to the gentleman in the bespoke tweed for fourteen million pounds!' Beside the velvet curtain, senior curator Vivian Sterling dropped her champagne glass in utter disbelief.",
    keywords: [
      { word: "audacious", meaningFa: "جسورانه، ساختارشکن و بی‌پروا", phonetic: "/ɔːˈdeɪʃəs/" },
      { word: "unflappable", meaningFa: "خونسرد، آرام در بحران‌ها و تسلیم‌ناپذیر", phonetic: "/ʌnˈflæpəbl/" },
      { word: "inadvertently", meaningFa: "سهواً، ندانسته و ناخواسته", phonetic: "/ˌɪnədˈvɜːrtəntli/" },
      { word: "bespoke", meaningFa: "دست‌دوز، سفارشی و اشرافی", phonetic: "/bɪˈspəʊk/" },
    ],
    question: {
      promptEn: "What accidental gesture led the auctioneer to declare a fourteen-million-pound sale?",
      promptFa: "چه حرکت تصادفی باعث شد مسئول حراج بگوید نقاشی به قیمت ۱۴ میلیون پوند فروخته شد؟",
      options: [
        "Lord Harrington violently raised his bidding paddle while sneezing uncontrollably",
        "A gallery assistant dropped the telephone on the electronic bidding console",
        "A rival art collector waved frantically to order another drink",
      ],
      correctIndex: 0,
      hintSnippet: "Harrington unleashed a thunderous, convulsive sneeze, inadvertently jerking his ivory bidding paddle high above his head",
      clueFa: "به خط چهارم دقت کن دوست من؛ لرد هرینگتون در حین یک عطسه شدید ناخواسته راکت شماره‌اش رو بالا برد و چکش معامله کوبیده شد.",
    },
    choiceA: {
      labelEn: "Uphold the sale publicly while whisking Lord Harrington backstage to negotiate an amicable retraction!",
      labelFa: "فروش را در سالن رسمی تایید کن اما لرد هرینگتون را محرمانه به پشت‌صحنه ببر تا دوستانه موضوع را حل کنید!",
      descriptionFa: "اعتبار حراجی در پخش زنده حفظ می‌شود و پشت درهای بسته با لبخند راه‌حل پیدا می‌کنید.",
    },
    choiceB: {
      labelEn: "Announce a humorous technical clarification immediately from the podium to charm the gallery audience!",
      labelFa: "پشت تریبون با شوخ‌طبعی و حاضر‌جوابی حقیقت ماجرا را به خنده برگزار کن و جو سالن را تلطیف کن!",
      descriptionFa: "صداقت صمیمانه با خنده حضار همراه می‌شود و تنش حراجی را به تفریح بدل می‌سازد.",
    },
  },

  // STEP 2 (A & B)
  {
    stepNumber: 2,
    pathCode: "A",
    passageEn:
      "Vivian ushered the flustered tech magnate into the mahogany-paneled Green Room, where Harrington was dabbing his streaming nose with a silk handkerchief. 'Had I known my pepper allergy would cost me fourteen million quid,' Harrington sputtered, 'I should never have dined on lobster bisque!' Arthur entered, pouring three glasses of vintage Armagnac. Seldom had the auction house faced such a public relations conundrum: international television networks were already broadcasting the record-breaking purchase of a blank canvas across four continents.",
    keywords: [
      { word: "conundrum", meaningFa: "معما، دوراهی پیچیده و گیج‌کننده", phonetic: "/kəˈnʌndrəm/" },
      { word: "flustered", meaningFa: "دستپاچه، آشفته و نگران", phonetic: "/ˈflʌstərd/" },
      { word: "Armagnac", meaningFa: "نوشیدنی سنتی و فرانسوی کهن", phonetic: "/ˌɑːrmænˈjæk/" },
      { word: "retraction", meaningFa: "پس گرفتن، لغو یا ابطال رسمی معامله", phonetic: "/rɪˈtrækʃn/" },
    ],
    question: {
      promptEn: "What was Lord Harrington's humorous explanation for his accidental bid?",
      promptFa: "توضیح خنده‌دار لرد هرینگتون برای این پیشنهاد تصادفی چه بود؟",
      options: [
        "A sudden pepper allergy triggered by eating lobster bisque",
        "A technical malfunction in his smart bionic watch",
        "An acoustic optical illusion from the chandelier crystals",
      ],
      correctIndex: 0,
      hintSnippet: "Had I known my pepper allergy would cost me fourteen million quid, Harrington sputtered, I should never have dined on lobster bisque!",
      clueFa: "خط دوم رو ببین رفیق؛ گفت اگه می‌دونستم حساسیتم به فلفل سوپ خرچنگ برام ۱۴ میلیون پوند آب می‌خوره، اصلاً لب بهش نمی‌زدم!",
    },
    choiceA: {
      labelEn: "Propose that Harrington donate the blank canvas to the Modern Tate as a tax-deductible philosophical conceptual stunt!",
      labelFa: "پیشنهاد بده نقاشی را به موزه هنر مدرن تیت اهدا کند تا هم تخفیف مالیاتی بگیرد و هم یک اقدام خیرخواهانه فلسفی ثبت شود!",
      descriptionFa: "تبدیل اشتباه به یک پیروزی روابط عمومی بزرگ و ماندگار در تاریخ هنر.",
    },
    choiceB: {
      labelEn: "Stage an impromptu live bidding duel with an eccentric eccentric Swiss collector waiting on phone line three!",
      labelFa: "یک رقابت ساختگی هیجان‌انگیز روی خط تلفن سه با کلکسیونر ثروتمند سوئیسی ترتیب بده!",
      descriptionFa: "انتقال فوری نقاشی به خریداری دیگر بدون اینکه نام لرد هرینگتون خدشه‌دار شود.",
    },
  },
  {
    stepNumber: 2,
    pathCode: "B",
    passageEn:
      "Arthur tapped his microphone, his eyebrows arching with masterly comedic timing. 'Ladies and gentlemen,' he declared in resonant baritone, 'it appears modern art has moved our distinguished guest not merely to tears, but to an involuntary respiratory symphony!' The crowded auction hall erupted in hearty laughter, breaking the stifling formality. Harrington himself chuckled sheepishly, waving his handkerchief in surrender. However, the elusive artist behind 'Absolute Nothingness', disguised in the fourth row wearing neon sunglasses, stood up and shouted that the sneeze was 'divine conceptual performance art' that must be honored.",
    keywords: [
      { word: "involuntary", meaningFa: "غیرارادی، ناخودآگاه و بی‌اختیار", phonetic: "/ɪnˈvɒləntri/" },
      { word: "respiratory", meaningFa: "تنفسی (مربوط به تنفس و ریه)", phonetic: "/rəˈspɪrətri/" },
      { word: "stifling", meaningFa: "خفه‌کننده، بیش از حد خشک و جدی", phonetic: "/ˈstaɪflɪŋ/" },
      { word: "performance art", meaningFa: "هنر اجرا و پرفورمنس مفهومی", phonetic: "/pəˈfɔːrməns ɑːt/" },
    ],
    question: {
      promptEn: "How did the disguised artist in the fourth row react to Arthur's humorous announcement?",
      promptFa: "هنرمند نقاب‌دار در ردیف چهارم چه واکنشی به طنز آرتور نشان داد؟",
      options: [
        "Claimed the sneeze was divine conceptual performance art that must be validated",
        "Demanded the security guards escort Arthur from the podium",
        "Stormed out of the gallery threatening a copyright lawsuit",
      ],
      correctIndex: 0,
      hintSnippet: "stood up and shouted that the sneeze was 'divine conceptual performance art' that must be honored",
      clueFa: "به جمله آخر متن دقت کن؛ بلند شد و فریاد زد که این عطسه یک شاهکار پرفورمنس الهی بوده و باید معامله رسمی ثبت بشه!",
    },
    choiceA: {
      labelEn: "Invite the artist to the podium to debate the existential definition of sneezing with Harrington!",
      labelFa: "هنرمند را به بالای سن دعوت کن تا در برابر جمعیت با هرینگتون درباره ماهیت وجودی عطسه مناظره کند!",
      descriptionFa: "تبدیل حراجی به جذاب‌ترین شوی کمدی و هنری پایتخت.",
    },
    choiceB: {
      labelEn: "Offer to auction off the silk sneeze handkerchief as Lot 42B for global medical research charity!",
      labelFa: "دستمال ابریشمی عطسه‌زده لرد را به عنوان اثر کمکی 42B برای امور خیریه پژوهش‌های پزشکی به مزایده بگذار!",
      descriptionFa: "یک ایده طنز خیرخواهانه که دل تمام رسانه‌ها و مهمانان را به دست می‌آورد.",
    },
  },

  // STEP 3 (AA, AB, BA, BB)
  {
    stepNumber: 3,
    pathCode: "AA",
    passageEn:
      "The Tate Modern's chief acquisition trustee, hearing the proposal over the speakerphone, was ecstatic. Never had an art institution capitalized so brilliantly on viral contemporary absurdity. Under the proposed covenant, Harrington would receive an eight-figure charitable deduction, while the blank canvas would tour Tokyo, Paris, and New York as 'The Fourteen-Million-Pound Inhale'. Vivian noted with amusement that Harrington's personal publicist was already drafting press releases praising the billionaire's 'unconventional patron saint generosity.'",
    keywords: [
      { word: "covenant", meaningFa: "تعهدنامه و قرارداد حقوقی رسمی", phonetic: "/ˈkʌvənənt/" },
      { word: "capitalized", meaningFa: "نهایت استفاده و بهره‌برداری را بردن", phonetic: "/ˈkæpɪtəlaɪzd/" },
      { word: "absurdity", meaningFa: "پوچی، ماجرای مضحک و نامتعارف", phonetic: "/əbˈsɜːrdəti/" },
      { word: "patron saint", meaningFa: "حامی معنوی و پشتیبان بزرگ", phonetic: "/ˌpeɪtrən ˈseɪnt/" },
    ],
    question: {
      promptEn: "What title did the traveling international exhibition assign to the blank canvas?",
      promptFa: "تور نمایشگاه‌های بین‌المللی چه عنوانی برای این بوم نقاشی سفید انتخاب کرد؟",
      options: [
        "The Fourteen-Million-Pound Inhale",
        "The Whispering Canvas of Mayfair",
        "The Midnight Sneeze of London",
      ],
      correctIndex: 0,
      hintSnippet: "the blank canvas would tour Tokyo, Paris, and New York as 'The Fourteen-Million-Pound Inhale'",
      clueFa: "خط سوم رو ببین دوست من؛ عنوان جذاب «دم عمیق چهارده میلیون پوندی» رو براش انتخاب کردند.",
    },
    choiceA: {
      labelEn: "Sign the donation contracts right there under the flashbulbs of the midnight press corps!",
      labelFa: "قرارداد اهدا را درست زیر نور فلاش خبرنگاران و پخش زنده نیمه‌شب امضا کنید!",
      descriptionFa: "پایان پیروزمندانه که نام هرینگتون و حراجی را سر زبان‌ها می‌اندازد.",
    },
    choiceB: {
      labelEn: "Commission an artisan frame lined with golden eucalyptus leaves to commemorate the famous sneeze!",
      labelFa: "یک قاب دست‌ساز تزیین‌شده با برگ‌های طلایی اکالیپتوس برای گرامیداشت عطسه تاریخی سفارش بده!",
      descriptionFa: "چاشنی شوخ‌طبعی انگلیسی در هنر مدرن که ارزش اثر را دوچندان می‌کند.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "AB",
    passageEn:
      "Vivian connected phone line three to the auditorium acoustics. The caller, Monsieur Delacroix—an eccentric Geneva watchmaker and art collector—had been desperately outbid earlier in the evening. Hearing that Lot 42 was unexpectedly back on the table due to 'buyer circumstance', Delacroix shouted without hesitation: 'Fifteen million! I shall wire the funds via Zurich escrow within the hour!' Arthur glanced at Harrington, whose eyes widened in sheer relief. The billionaire signaled with both thumbs up, practically leaping with joy in his bespoke brogues.",
    keywords: [
      { word: "escrow", meaningFa: "حساب امانی و واسطه تضمین‌شده بانکی", phonetic: "/ˈeskrəʊ/" },
      { word: "circumstance", meaningFa: "شرایط، اوضاع و احوال غیرمنتظره", phonetic: "/ˈsɜːrkəmstæns/" },
      { word: "brogues", meaningFa: "کفش‌های کلاسیک چرمی شیک مردانه", phonetic: "/brəʊɡz/" },
      { word: "acoustics", meaningFa: "سیستم صوتی و بازتاب صدای سالن", phonetic: "/əˈkuːstɪks/" },
    ],
    question: {
      promptEn: "How much did the Swiss caller Monsieur Delacroix offer to outbid Harrington?",
      promptFa: "موسیو دلاکروا خریدار سوئیسی چه مبلغی پیشنهاد داد تا از پیشنهاد هرینگتون سبقت بگیرد؟",
      options: [
        "Fifteen million pounds via Zurich escrow",
        "Ten million euros in cash bearer bonds",
        "Twelve million Swiss francs",
      ],
      correctIndex: 0,
      hintSnippet: "Delacroix shouted without hesitation: 'Fifteen million! I shall wire the funds via Zurich escrow within the hour!'",
      clueFa: "خط سوم رو ببین؛ با خوشحالی فریاد زد ۱۵ میلیون پوند که فوراً از طریق حساب امانی زوریخ حواله خواهد شد.",
    },
    choiceA: {
      labelEn: "Slam the gavel on fifteen million and present Harrington with a complimentary bottle of 1945 port!",
      labelFa: "چکش ۱۵ میلیون پوند را بکوب و یک بطری نوشیدنی نایاب ۱۹۴۵ به هرینگتون هدیه بده!",
      descriptionFa: "پایانی لوکس و پردرآمد برای حراجی و رفع کامل دردسر لرد هرینگتون.",
    },
    choiceB: {
      labelEn: "Invite Delacroix via private jet to London for a joint victory gala with Lord Harrington!",
      labelFa: "دلاکروا را با جت اختصاصی به لندن دعوت کن تا در ضیافت شام باشکوه در کنار لرد شرکت کند!",
      descriptionFa: "جشنی که آغازگر دوستی عمیق دو میلیاردر نامتعارف اروپایی خواهد شد.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "BA",
    passageEn:
      "The neon-sunglassed artist, who introduced himself simply as 'Zero', bounded onto the dais and grabbed the microphone. 'This sneeze,' Zero proclaimed with wild gesticulation, 'was the universe collapsing into our collective respiratory void!' Harrington, emboldened by the audience's warmth, stepped up and retorted: 'My dear boy, if clearing my sinuses constitutes genius, my grandmother’s pug is Leonardo da Vinci!' The entire room roared with delighted applause at the witty repartee, prompting national news anchors to broadcast the lively intellectual spectacle live.",
    keywords: [
      { word: "gesticulation", meaningFa: "حرکات پرشور دست و صورت هنگام صحبت", phonetic: "/dʒeˌstɪkjuˈleɪʃn/" },
      { word: "repartee", meaningFa: "حاضرجوابی طنزآمیز، بذله‌گویی هوشمندانه", phonetic: "/ˌrepɑːrˈtiː/" },
      { word: "emboldened", meaningFa: "جرئت‌یافته، جسورشده با تشویق دیگران", phonetic: "/ɪmˈbəʊldənd/" },
      { word: "void", meaningFa: "خلأ، تهیگی عمیق فلسفی", phonetic: "/vɔɪd/" },
    ],
    question: {
      promptEn: "What witty comparison did Lord Harrington make about his sneeze?",
      promptFa: "لرد هرینگتون چه مقایسه طنزآمیزی درباره عطسه خود پشت تریبون مطرح کرد؟",
      options: [
        "That if clearing his sinuses was genius, his grandmother's pug dog was Leonardo da Vinci",
        "That his sneeze sounded like a Beethoven trumpet concerto",
        "That the blank canvas looked like an unbuttered crumpet",
      ],
      correctIndex: 0,
      hintSnippet: "if clearing my sinuses constitutes genius, my grandmother’s pug is Leonardo da Vinci!",
      clueFa: "خط سوم رو نگاه کن؛ با شوخ‌طبعی گفت اگه تمیز کردن سینوس من نبوغ باشه، پس سگ پاک مادربزرگم لئوناردو داوینچیه!",
    },
    choiceA: {
      labelEn: "Announce a collaborative charity exhibition between Harrington's robotics firm and Zero's studio!",
      labelFa: "یک نمایشگاه مشترک خیریه میان شرکت رباتیک هرینگتون و آتلیه زیرو اعلام کن!",
      descriptionFa: "ترکیب تکنولوژی مدرن و هنر مفهومی با اهداف نیکوکارانه.",
    },
    choiceB: {
      labelEn: "Auction off the joint intellectual debate rights to a major streaming entertainment platform!",
      labelFa: "حق پخش مناظره زنده طنز فلسفی را به یک پلتفرم استریم جهانی بفروش!",
      descriptionFa: "درآمدی میلیونی از شوخی‌های خودجوش که به خیریه‌های آموزشی اختصاص می‌یابد.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "BB",
    passageEn:
      "Arthur held up Harrington's crisp monogrammed silk handkerchief with silver tongs, declaring Lot 42B open at ten thousand pounds. What followed was a bidding frenzy unlike anything Mayfair had seen. Eccentric aristocrats, allergy research foundations, and Silicon Valley tourists competed relentlessly for 'The Relic of the Great Mayfair Sneeze'. In four breathtaking minutes, the bidding climbed to eight hundred and fifty thousand pounds, with every penny legally pledged to the British Allergy and Asthma Research Fellowship.",
    keywords: [
      { word: "monogrammed", meaningFa: "حک‌شده یا دوخته‌شده با نشان حرف اول نام شخصی", phonetic: "/ˈmɒnəɡræmd/" },
      { word: "tongs", meaningFa: "انبرک‌های نقره‌ای ظریف جابجایی اشیای باارزش", phonetic: "/tɒŋz/" },
      { word: "frenzy", meaningFa: "شور و اشتیاق افسارگسیخته و پرهیاهو", phonetic: "/ˈfrenzi/" },
      { word: "fellowship", meaningFa: "بنیاد پژوهشی و بورسیه علمی دانشگاهی", phonetic: "/ˈfeləʊʃɪp/" },
    ],
    question: {
      promptEn: "To which charitable organization were the proceeds of the handkerchief auction pledged?",
      promptFa: "عواید حراج دستمال ابریشمی به کدام سازمان خیریه پژوهشی اختصاص یافت؟",
      options: [
        "The British Allergy and Asthma Research Fellowship",
        "The Royal Society of Ancient Coin Collectors",
        "The Mayfair Classical Opera Restoration League",
      ],
      correctIndex: 0,
      hintSnippet: "with every penny legally pledged to the British Allergy and Asthma Research Fellowship",
      clueFa: "خط آخر متن رو بخون؛ تمام پنی‌ها به بنیاد پژوهشی آلرژی و آسم بریتانیا اهدا شد.",
    },
    choiceA: {
      labelEn: "Present the silver-framed handkerchief to the winning medical consortium with fanfare!",
      labelFa: "دستمال را در قابی نقره‌ای با تشریفات رسمی به کنسرسیوم برنده اهدا کن!",
      descriptionFa: "پایان شیرین و انسانی که تیتر اول تمام روزنامه‌های صبح فردا می‌شود.",
    },
    choiceB: {
      labelEn: "Declare Lord Harrington the official Honorary Patron of the National Allergy Foundation!",
      labelFa: "لرد هرینگتون را به عنوان پدر معنوی و حامی افتخاری بنیاد ملی آلرژی معرفی کن!",
      descriptionFa: "عنوانی باشکوه که یک اشتباه بامزه را به افتخاری ملی بدل می‌کند.",
    },
  },

  // STEP 4 (8 Nodes: AAA, AAB, ABA, ABB, BAA, BAB, BBA, BBB)
  {
    stepNumber: 4,
    pathCode: "AAA",
    passageEn:
      "Signing the deed of gift under the blinding strobe of eighty press cameras, Harrington was hailed as a visionary benefactor. Vivian presented him with a bespoke golden quill, while museum curators toasted his impromptu generosity. The international wire services described the event as 'the most sophisticated comedic coup in modern cultural history.' Arthur, leaning on his mahogany podium, whispered to Vivian: 'Had he merely paid for the canvas, he would be a laughingstock; by giving it away, he is immortalized.'",
    keywords: [
      { word: "benefactor", meaningFa: "نیکوکار بزرگ و بانی خیر", phonetic: "/ˈbenɪfæktər/" },
      { word: "coup", meaningFa: "موفقیت درخشان، غافلگیرکننده و غیرمنتظره", phonetic: "/kuː/" },
      { word: "laughingstock", meaningFa: "مایه خنده و تمسخر دیگران", phonetic: "/ˈlɑːfɪŋstɒk/" },
      { word: "immortalized", meaningFa: "جاودانه و ماندگار در خاطره‌ها", phonetic: "/ɪˈmɔːrtəlaɪzd/" },
    ],
    question: {
      promptEn: "What philosophical observation did Arthur make about Harrington's donation?",
      promptFa: "آرتور چه نکته‌سنجی هوشمندانه‌ای درباره اهدای تابلوی هرینگتون بیان کرد؟",
      options: [
        "If he had merely paid for it he would be a laughingstock, but by donating it he became immortalized",
        "That blank canvases were mathematically superior to portrait paintings",
        "That lobster bisque should be permanently banned from pre-auction dinners",
      ],
      correctIndex: 0,
      hintSnippet: "Had he merely paid for the canvas, he would be a laughingstock; by giving it away, he is immortalized",
      clueFa: "خط آخر رو نگاه کن دوست من؛ گفت اگه نقاشی رو برای خودش نگه می‌داشت مسخره می‌شد، اما با بخشیدنش جاودانه شد.",
    },
    choiceA: {
      labelEn: "Host a black-tie champagne gala in the gallery to unveil the touring world exhibition!",
      labelFa: "یک ضیافت مجلل شام رسمی در نگارخانه برای رونمایی از تور جهانی نقاشی برپا کن!",
      descriptionFa: "شبی باشکوه با حضور چهره‌های سرشناس هنر و رسانه.",
    },
    choiceB: {
      labelEn: "Award Arthur Pendelton the Lifetime Achievement Gavel of the Royal Auctioneers Society!",
      labelFa: "چکش طلایی یک عمر دستاورد حرفه‌ای را به آرتور پندلتون اهدا کن!",
      descriptionFa: "تقدیر از مردی که با خونسردی چهل سال آبروی حراجی را نجات داد.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "AAB",
    passageEn:
      "The master woodcarver arrived at midnight with an exquisite frame carved from fragrant Tasmanian eucalyptus, inlaid with twenty-four-karat gold leaf filigree. Fitted into this opulent border, 'Absolute Nothingness' transformed from a minimalist curiosity into an enigmatic masterpiece that transfixed the gathered critics. Art historians began publishing serious scholarly treatises on 'The Dialectic of the Respiratory Brushstroke,' praising Harrington's accidental sneeze as a subconscious subversion of bourgeois artistic commodification.",
    keywords: [
      { word: "filigree", meaningFa: "ملیله‌کاری ظریف طلا و نقره", phonetic: "/ˈfɪlɪɡriː/" },
      { word: "transfixed", meaningFa: "مسحور و مات‌ومبهوت کرد", phonetic: "/trænsˈfɪkst/" },
      { word: "commodification", meaningFa: "کالایی‌سازی و تجاری کردن هنر", phonetic: "/kəˌmɒdɪfɪˈkeɪʃn/" },
      { word: "dialectic", meaningFa: "دیالکتیک و گفتگوی عمیق فلسفی", phonetic: "/ˌdaɪəˈlektɪk/" },
    ],
    question: {
      promptEn: "How did art critics academically interpret Harrington's accidental sneeze?",
      promptFa: "منتقدان هنری عطسه تصادفی هرینگتون را از نظر علمی چگونه تفسیر کردند؟",
      options: [
        "As a subconscious subversion of bourgeois artistic commodification",
        "As an unfortunate breach of British etiquette",
        "As a secret biological sound recording for cinema",
      ],
      correctIndex: 0,
      hintSnippet: "praising Harrington's accidental sneeze as a subconscious subversion of bourgeois artistic commodification",
      clueFa: "خط آخر رو بخون؛ منتقدان با اصطلاحات قلمبه‌سلمبه گفتن این عطسه یک ساختارشکنی ناخودآگاه در برابر تجاری‌سازی هنر بورژوایی بوده!",
    },
    choiceA: {
      labelEn: "Publish an opulent coffee-table art monograph chronicling the eucalyptus frame phenomenon!",
      labelFa: "یک کتاب مصور لوکس و معتبر درباره ماجرای قاب اکالیپتوس و تفسیرهای آن منتشر کن!",
      descriptionFa: "کتابی پرفروش که در تمام کتابخانه‌های هنری جهان ماندگار می‌شود.",
    },
    choiceB: {
      labelEn: "Place the framed canvas on the permanent central wall of the National Gallery foyer!",
      labelFa: "تابلوی قاب‌گرفته را در سالن مرکزی گالری ملی برای بازدید عموم نصب کن!",
      descriptionFa: "دیدار همیشگی میلیون‌ها توریست از عجیب‌ترین اثر هنری قرن.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "ABA",
    passageEn:
      "With a resounding rap of his gavel, Arthur finalized Delacroix's fifteen-million-pound purchase. The Swiss escrow transfer cleared in less than twelve minutes, generating a record-breaking commission for the auction house. Arthur personally uncorked a dusty bottle of 1945 Quinta do Noval port and poured it into crystal goblets for Harrington and Vivian. Raising his glass, Harrington laughed heartily: 'To pepper, to lobsters, and to Swiss horologists with deeper pockets than common sense!'",
    keywords: [
      { word: "resounding", meaningFa: "طنین‌انداز، رسا و گوش‌نواز", phonetic: "/rɪˈzaʊndɪŋ/" },
      { word: "commission", meaningFa: "حق‌العمل و درصد قانونی حراجی", phonetic: "/kəˈmɪʃn/" },
      { word: "goblets", meaningFa: "جام‌های پایه‌دار بلورین اشرافی", phonetic: "/ˈɡɒblɪts/" },
      { word: "horologists", meaningFa: "ساعت‌شناسان و سازندگان ساعت‌های مکانیکی دقیق", phonetic: "/hɒˈrɒlədʒɪsts/" },
    ],
    question: {
      promptEn: "What toast did Harrington propose when celebrating the finalized sale?",
      promptFa: "لرد هرینگتون هنگام بالا بردن جام جشن چه کلماتی به کار برد؟",
      options: [
        "To pepper, lobsters, and Swiss horologists with deeper pockets than common sense",
        "To eternal silence and invisible paintings",
        "To the Queen and the Bank of England",
      ],
      correctIndex: 0,
      hintSnippet: "To pepper, to lobsters, and to Swiss horologists with deeper pockets than common sense!",
      clueFa: "خط آخر رو نگاه کن؛ با خنده گفت سلامتی فلفل، خرچنگ و ساعت‌سازان سوئیسی که جیبشون از عقلشون پرتره!",
    },
    choiceA: {
      labelEn: "Establish an annual 'Mayfair Port & Fine Arts' fellowship in Arthur and Harrington's names!",
      labelFa: "بورسیه سالانه حراجی و هنرهای زیبا را به نام آرتور و هرینگتون تاسیس کن!",
      descriptionFa: "حمایت از هنرمندان جوان با عواید پربرکت این شب به‌یادماندنی.",
    },
    choiceB: {
      labelEn: "Retire Arthur's ivory gavel into the museum case as the luckiest hammer in England!",
      labelFa: "چکش عاج آرتور را به عنوان خوش‌قدم‌ترین چکش تاریخ حراجی انگلستان در موزه ثبت کن!",
      descriptionFa: "یادگاری از شبی که یک عطسه ساده ۱۵ میلیون پوند سود آفرید.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "ABB",
    passageEn:
      "Monsieur Delacroix arrived from Geneva on his private Gulfstream at two in the morning, dressed in an immaculate velvet smoking jacket. Entering the green room, he shook Harrington's hand warmly, declaring that the blank canvas would serve as the minimalist centerpiece of his private Swiss watchmaking atelier. The two eccentric tycoons bonded instantly over vintage mechanical gears and fine cigars, deciding on the spot to fund an international art prize celebrating delightfully chaotic misunderstandings.",
    keywords: [
      { word: "immaculate", meaningFa: "بی‌عیب‌ونقص، فوق‌العاده تمیز و آراسته", phonetic: "/ɪˈmækjələt/" },
      { word: "atelier", meaningFa: "کارگاه یا آتلیه طراحی هنری اختصاصی", phonetic: "/æˈtelieɪ/" },
      { word: "tycoons", meaningFa: "سرمایه‌داران و غول‌های اقتصادی بزرگ", phonetic: "/taɪˈkuːnz/" },
      { word: "misunderstandings", meaningFa: "سوءتفاهم‌ها و اشتباهات غیرمنتظره", phonetic: "/ˌmɪsʌndərˈstændɪŋz/" },
    ],
    question: {
      promptEn: "Where did Monsieur Delacroix plan to display the blank canvas in Switzerland?",
      promptFa: "موسیو دلاکروا قصد داشت بوم سفید را در کجای سوئیس به نمایش بگذارد؟",
      options: [
        "In his private Swiss watchmaking atelier as a minimalist centerpiece",
        "In a public bank vault under Zurich lake",
        "On the exterior wall of a ski chalet in Zermatt",
      ],
      correctIndex: 0,
      hintSnippet: "the blank canvas would serve as the minimalist centerpiece of his private Swiss watchmaking atelier",
      clueFa: "خط سوم رو ببین دوست من؛ در آتلیه خصوصی ساعت‌سازی‌اش در سوئیس به عنوان نقطه کانونی مینیمالیستی.",
    },
    choiceA: {
      labelEn: "Host the inaugural Delacroix-Harrington Art Prize banquet in St. Moritz!",
      labelFa: "ضیافت نخستین دوره جایزه هنری مشترک دلاکروا و هرینگتون را در سنت موریتز برگزار کن!",
      descriptionFa: "شبی برفی و مجلل در آلپ با حضور هنرمندان خلاق جهان.",
    },
    choiceB: {
      labelEn: "Commission a bespoke mechanical wrist chronograph featuring a miniature blank enamel dial!",
      labelFa: "سفارش ساخت یک ساعت مچی مکانیکی لوکس با صفحه سفید مینیمال به یادگار این شب بده!",
      descriptionFa: "شاهکار ساعت‌سازی که یادآور این ماجرای خنده‌دار در دستان کلکسیونرهاست.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BAA",
    passageEn:
      "The impromptu alliance between Harrington Robotics and Zero's conceptual studio took Fleet Street by storm. Together, they announced 'Project Pneumatic Muse'—a team of autonomous robotic arms designed to paint avant-garde abstract murals whenever triggered by human sneezing acoustic patterns. The press conference broke internet viewing records, transforming what could have been a mortifying social gaffe into an unprecedented triumph of tech-art innovation.",
    keywords: [
      { word: "pneumatic", meaningFa: "بادی، مکانیکی و فعال‌شونده با فشار هوا", phonetic: "/njuːˈmætɪk/" },
      { word: "mortifying", meaningFa: "شرم‌آور، سرافکنده و خجالت‌آور", phonetic: "/ˈmɔːrtɪfaɪɪŋ/" },
      { word: "gaffe", meaningFa: "سوتی، گاف و اشتباه خنده‌دار اجتماعی", phonetic: "/ɡæf/" },
      { word: "unprecedented", meaningFa: "بی‌سابقه، کم‌نظیر در طول تاریخ", phonetic: "/ʌnˈpresɪdentɪd/" },
    ],
    question: {
      promptEn: "What was the function of the robotic painting arms in Project Pneumatic Muse?",
      promptFa: "وظیفه بازوهای رباتیک نقاش در پروژه جدید چه بود؟",
      options: [
        "To paint abstract murals whenever triggered by human sneezing acoustic patterns",
        "To clean dusty oil paintings in cathedral ceilings",
        "To detect counterfeit gold coins in auction rooms",
      ],
      correctIndex: 0,
      hintSnippet: "autonomous robotic arms designed to paint avant-garde abstract murals whenever triggered by human sneezing acoustic patterns",
      clueFa: "خط دوم رو بخون؛ ربات‌هایی که به محض شنیدن صدای عطسه انسان، روی دیوار نقاشی‌های انتزاعی خلق می‌کردند!",
    },
    choiceA: {
      labelEn: "Exhibit the first sneeze-generated robotic mural at the Venice Biennale!",
      labelFa: "اولین اثر خلق‌شده با صدای عطسه توسط ربات‌ها را در دوسالانه ونیز به نمایش بگذار!",
      descriptionFa: "حضور پر سر و صدا در معتبرترین رویداد هنری جهان.",
    },
    choiceB: {
      labelEn: "Offer the robotic painting prototype to educational science centers worldwide!",
      labelFa: "نمونه اولیه ربات نقاش را به مراکز علمی و پژوهشی جوانان در دنیا هدیه بده!",
      descriptionFa: "جلب علاقه هزاران نوجوان به ترکیب خلاقانه علم رباتیک و هنر.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BAB",
    passageEn:
      "A fierce bidding war erupted between two global streaming networks for exclusive broadcast rights to 'The Sneeze That Shook Sotheby's'. Within thirty minutes, a six-million-pound distribution deal was inked in Arthur's private study. Under Vivian's eagle-eyed direction, fifty percent of net royalties were earmarked to establish art education academies in underprivileged inner-city boroughs, turning high-society absurdity into lasting educational empowerment.",
    keywords: [
      { word: "broadcast rights", meaningFa: "حقوق انحصاری پخش رسانه‌ای و تلویزیونی", phonetic: "/ˈbrɔːdkɑːst raɪts/" },
      { word: "earmarked", meaningFa: "تخصیص‌یافته و رسماً کنار گذاشته شده برای هدف معین", phonetic: "/ˈɪərmɑːrkt/" },
      { word: "boroughs", meaningFa: "محله‌ها و مناطق شهری", phonetic: "/ˈbʌrəz/" },
      { word: "empowerment", meaningFa: "توانمندسازی و فراهم کردن فرصت‌های برابر", phonetic: "/ɪmˈpaʊərmənt/" },
    ],
    question: {
      promptEn: "How were the streaming broadcast royalties utilized under Vivian's direction?",
      promptFa: "عواید حاصل از قرارداد پخش استریم با مدیریت ویوین چگونه صرف شد؟",
      options: [
        "Fifty percent was earmarked to establish art education academies in underprivileged boroughs",
        "To purchase a fleet of luxury limousines for gallery trustees",
        "To refund the entrance tickets of all auction attendees",
      ],
      correctIndex: 0,
      hintSnippet: "fifty percent of net royalties were earmarked to establish art education academies in underprivileged inner-city boroughs",
      clueFa: "خط سوم رو نگاه کن؛ نیمی از عواید برای تاسیس آموزشگاه‌های رایگان هنر در محله‌های محروم اختصاص یافت.",
    },
    choiceA: {
      labelEn: "Cut the ribbon on the first Mayfair Youth Art Academy alongside Lord Harrington!",
      labelFa: "روبان اولین فرهنگسرای هنر جوانان را در کنار لرد هرینگتون قیچی کن!",
      descriptionFa: "افتتاحیه‌ای پر از شور و نشاط برای آموزش نسل جدید هنرمندان.",
    },
    choiceB: {
      labelEn: "Win the National Television Award for Best Cultural Comedy Special!",
      labelFa: "جایزه بهترین برنامه طنز فرهنگی تلویزیونی سال را با افتخار دریافت کن!",
      descriptionFa: "برنامه‌ای پربیننده که میلیون‌ها خانواده را با خنده شاد کرد.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BBA",
    passageEn:
      "The CEO of the National Allergy Institute arrived personally to accept the eight-hundred-and-fifty-thousand-pound silk handkerchief in a velvet-lined rosewood casket. Addressing the packed chamber, she declared: 'Thanks to Lord Harrington's sensational involuntary reflex, twenty doctoral fellowships in autoimmune research are fully funded for the next five years.' Flashbulbs illuminated the cheering room as Arthur held up the champagne bottle in salute to common humanity.",
    keywords: [
      { word: "autoimmune", meaningFa: "خودایمنی (سیستم ایمنی بدن در برابر آلرژی‌ها)", phonetic: "/ˌɔːtəʊɪˈmjuːn/" },
      { word: "casket", meaningFa: "جعبه نفیس و منبت‌کاری‌شده نگهدارنده اشیا", phonetic: "/ˈkɑːskɪt/" },
      { word: "sensational", meaningFa: "پر سر و صدا، جنجالی و شگفت‌انگیز", phonetic: "/senˈseɪʃənl/" },
      { word: "fellowships", meaningFa: "بورسیه‌های تحقیقاتی دکتری", phonetic: "/ˈfeləʊʃɪps/" },
    ],
    question: {
      promptEn: "How many doctoral fellowships were funded by the handkerchief auction?",
      promptFa: "با درآمد حاصل از حراج دستمال چند بورسیه دکتری تحقیقات ایمنی بدن تامین بودجه شد؟",
      options: [
        "Twenty doctoral fellowships in autoimmune research for five years",
        "Five master's scholarships in classical sculpture",
        "One hundred clinical nursing internships",
      ],
      correctIndex: 0,
      hintSnippet: "twenty doctoral fellowships in autoimmune research are fully funded for the next five years",
      clueFa: "خط سوم رو ببین دوست من؛ بیست بورسیه کامل دوره دکتری برای ۵ سال تامین مالی شد.",
    },
    choiceA: {
      labelEn: "Unveil the Harrington Medical Wing at University College London with an official reception!",
      labelFa: "بخش جدید پژوهش‌های ایمنی هرینگتون را در دانشگاه لندن افتتاح کن!",
      descriptionFa: "مرکزی علمی که نجات‌بخش بیماران تنفسی در سراسر کشور خواهد بود.",
    },
    choiceB: {
      labelEn: "Publish a humorous illustrated memoir titled 'The Sneeze That Cured Sneezes'!",
      labelFa: "کتاب مصور و پرخنده «عطسه‌ای که عطسه‌ها را درمان کرد» را منتشر کن!",
      descriptionFa: "کتابی مفرح و الهام‌بخش که تمام سودش به خیریه کودکان تعلق می‌گیرد.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BBB",
    passageEn:
      "Garlanded in an oversized silk ribbon emblazoned with golden pollen motifs, Lord Harrington was officially inaugurated as the First Grand Patron of the Respiratory Society. Smiling broadly, Harrington pledged to match all annual public donations pound-for-pound from his personal fortune. Vivian and Arthur stood at his side, holding up miniature golden tissue boxes as comedic scepters of office, bringing the historic evening to an uproarious, heartwarming finale.",
    keywords: [
      { word: "garlanded", meaningFa: "تزیین‌شده با گل‌ها یا روبان‌های شادباش", phonetic: "/ˈɡɑːrləndɪd/" },
      { word: "emblazoned", meaningFa: "نقش‌بسته و برجسته‌شده با نشان افتخار", phonetic: "/ɪmˈbleɪznd/" },
      { word: "motifs", meaningFa: "طرح‌ها و نقش‌مایه‌های تزیینی", phonetic: "/məʊˈtiːfs/" },
      { word: "scepters", meaningFa: "عصاهای سلطنتی و نشان‌های نمادین ریاست", phonetic: "/ˈseptərz/" },
    ],
    question: {
      promptEn: "What philanthropic matching pledge did Harrington make upon his inauguration?",
      promptFa: "هرینگتون پس از انتصاب چه تعهد مالی سخاوتمندانه‌ای به بنیاد داد؟",
      options: [
        "To match all annual public donations pound-for-pound from his personal fortune",
        "To build a fleet of electric medical ambulances",
        "To buy every employee a holiday in the Caribbean",
      ],
      correctIndex: 0,
      hintSnippet: "Harrington pledged to match all annual public donations pound-for-pound from his personal fortune",
      clueFa: "خط دوم رو ببین؛ تعهد داد هر کمکی که مردم بکنند، معادل همون مبلغ رو از جیب خودش اضافه پرداخت کنه.",
    },
    choiceA: {
      labelEn: "Toast the golden tissue box scepters in a midnight parade through the historic streets of Mayfair!",
      labelFa: "با عصاهای نمادین جعبه دستمال‌کاغذی طلایی، رژه شبانه مفرحی در خیابان‌های لندن برگزار کنید!",
      descriptionFa: "شادی و خنده مردمی در دل پایتخت با حضور شهروندان خوشحال.",
    },
    choiceB: {
      labelEn: "Retire together to Harrington's country estate for a weekend of peaceful croquet and lobster-free dining!",
      labelFa: "برای استراحت به عمارت ییلاقی هرینگتون بروید و شبی بدون سوپ خرچنگ را در آرامش سپری کنید!",
      descriptionFa: "پایانی دنج و پر از شوخی در کنار دوستان باوفا.",
    },
  },

  // STEP 5 (16 Nodes: AAAA through BBBB)
  {
    stepNumber: 5,
    pathCode: "AAAA",
    passageEn:
      "Under the glittering chandeliers of the Grand Mayfair Ballroom, ambassadors, curators, and film stars clinked crystal flutes in honor of 'The Fourteen-Million-Pound Inhale'. The blank canvas, mounted inside its illuminated velvet pavilion, had become the sensation of the continent. Lord Harrington smiled warmly as Vivian led him toward the stage: 'Vivian, my dear, had your auction house not possessed such peerless diplomatic finesse, I should have been remembered as an eccentric buffoon rather than a patron of modern enlightenment.'",
    keywords: [
      { word: "flutes", meaningFa: "گیلاس‌های باریک و پایه‌دار نوشیدنی", phonetic: "/fluːts/" },
      { word: "peerless", meaningFa: "بی‌نظیر، بی‌همتا و بی‌رقیب", phonetic: "/ˈpɪələs/" },
      { word: "finesse", meaningFa: "ظرافت، تدبیر هوشمندانه و کیاست", phonetic: "/fɪˈnes/" },
      { word: "buffoon", meaningFa: "دلقک، فرد مضحک و دست‌وپاچلفتی", phonetic: "/bəˈfuːn/" },
    ],
    question: {
      promptEn: "What did Lord Harrington attribute his transformation from buffoon to patron of enlightenment to?",
      promptFa: "هرینگتون نجات آبرویش و تبدیل شدن به حامی روشنگری را مدیون چه چیزی دانست؟",
      options: [
        "The auction house's peerless diplomatic finesse",
        "His personal lawyer's aggressive court threats",
        "The mysterious healing properties of the blank canvas",
      ],
      correctIndex: 0,
      hintSnippet: "had your auction house not possessed such peerless diplomatic finesse, I should have been remembered as an eccentric buffoon",
      clueFa: "خط آخر رو ببین؛ به کیاست و تدبیر بی‌نظیر دیپلماتیک کادر حراجی اشاره کرد که ماجرا رو جمع کردند.",
    },
    choiceA: {
      labelEn: "Raise the final toast of the night to spontaneous wit and timeless British decorum!",
      labelFa: "آخرین سلامتی شب را به حاضر‌جوابی، ذکاوت و وقار اصیل تقدیم کن!",
      descriptionFa: "لحظه‌ای پرشکوه از همدلی و افتخار در قلب لندن.",
    },
    choiceB: {
      labelEn: "Announce the opening of the touring exhibition in Tokyo with Harrington cutting the ceremonial ribbon!",
      labelFa: "افتتاحیه تور در توکیو را اعلام کن تا هرینگتون روبان اولین نمایشگاه بین‌المللی را قیچی کند!",
      descriptionFa: "آغاز سفری جهانی برای اثر نامرئی که همه را به وجد آورد.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AAAB",
    passageEn:
      "The President of the International Auctioneers Guild stepped to the podium to present Arthur Pendelton with the Diamond-Studded Gavel of Lifetime Distinction. In his citation, the President noted that Arthur's split-second composure had turned an unprecedented high-society catastrophe into the most lucrative and heartwarming cultural triumph of the century. As the entire assembly rose in an emotional standing ovation, Arthur bowed with quiet elegance, murmuring: 'A good auctioneer sells what is visible; a great auctioneer sells the imagination.'",
    keywords: [
      { word: "distinction", meaningFa: "افتخار، برتری و شایستگی برجسته", phonetic: "/dɪˈstɪŋkʃn/" },
      { word: "citation", meaningFa: "تقدیرنامه رسمی و بیانیه تقدیر", phonetic: "/saɪˈteɪʃn/" },
      { word: "lucrative", meaningFa: "پرسود، پردرآمد و پرمنفعت", phonetic: "/ˈluːkrətɪv/" },
      { word: "composure", meaningFa: "آرامش درونی، وقار و تسلط بر اعصاب", phonetic: "/kəmˈpəʊʒər/" },
    ],
    question: {
      promptEn: "What memorable quote did Arthur share about the art of great auctioneering?",
      promptFa: "آرتور چه جمله قصار ماندگاری درباره هنر حراج‌داری بیان کرد؟",
      options: [
        "A good auctioneer sells what is visible; a great auctioneer sells the imagination",
        "Always check the bidder's bank balance before raising the gavel",
        "Pepper soup should be kept outside the gallery doors",
      ],
      correctIndex: 0,
      hintSnippet: "A good auctioneer sells what is visible; a great auctioneer sells the imagination",
      clueFa: "جمله آخر رو بخون رفیق؛ گفت حراج‌دار معمولی اون چیزی رو می‌فروشه که دیده می‌شه، اما حراج‌دار بزرگ تخیل و رویا رو می‌فروشه!",
    },
    choiceA: {
      labelEn: "Enshrine Arthur's golden words above the main entrance of Mayfair Auction House!",
      labelFa: "جمله طلایی آرتور را بر سردر ورودی اصلی حراجی لندن حکاکی کن!",
      descriptionFa: "پندی آموزنده برای نسل‌های آینده حراج‌داران دنیا.",
    },
    choiceB: {
      labelEn: "Retire with honors to a seaside cottage in Cornwall to write the definitive history of fine art scandals!",
      labelFa: "با عزت در کلبه‌ای ساحلی در کورن‌وال اقامت کن و تاریخچه رسوایی‌های هنری را به رشته تحریر درآور!",
      descriptionFa: "آرامش شایسته پس از یک عمر مدیریت موفقیت‌آمیز رویدادهای هنری.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AABA",
    passageEn:
      "The heavy, leather-bound monograph 'Breath, Canvas, and Comedy' landed on the bestseller lists within forty-eight hours of release. Critics hailed the detailed photographic study of the eucalyptus-framed blank canvas as a milestone in artistic documentation. Museums from Zurich to Melbourne scrambled to order collector copies, while universities established seminar modules analyzing the event as a textbook triumph of crisis public relations and cultural philosophy.",
    keywords: [
      { word: "monograph", meaningFa: "رساله پژوهشی و کتاب تخصصی تک‌نگاری", phonetic: "/ˈmɒnəɡrɑːf/" },
      { word: "scrambled", meaningFa: "با عجله و رقابت شدید هجوم آوردند", phonetic: "/ˈskræmbld/" },
      { word: "modules", meaningFa: "واحدهای درسی دانشگاهی", phonetic: "/ˈmɒdjuːlz/" },
      { word: "textbook", meaningFa: "الگو، استاندارد و طبق موازین آموزشی", phonetic: "/ˈtekstbʊk/" },
    ],
    question: {
      promptEn: "How quickly did the monograph reach national bestseller lists?",
      promptFa: "کتاب پژوهشی ماجرای قاب اکالیپتوس چقدر سریع به فهرست پرفروش‌ترین‌ها رسید؟",
      options: [
        "Within forty-eight hours of publication",
        "After two years of academic peer review",
        "Only when the author appeared on morning television",
      ],
      correctIndex: 0,
      hintSnippet: "landed on the bestseller lists within forty-eight hours of release",
      clueFa: "خط اول رو ببین؛ ظرف ۴۸ ساعت پس از انتشار به پرفروش‌ترین کتاب کشور تبدیل شد.",
    },
    choiceA: {
      labelEn: "Sign copies at a grand literary salon in Piccadilly alongside Lord Harrington and Vivian!",
      labelFa: "در جشن بزرگ امضای کتاب در میدان پیکدیلی در کنار هرینگتون و ویوین شرکت کن!",
      descriptionFa: "دیدار صمیمانه با هزاران خواننده مشتاق و دوستدار هنر.",
    },
    choiceB: {
      labelEn: "Endow an annual university prize for outstanding essays in contemporary art satire!",
      labelFa: "جایزه سالانه دانشگاهی برای برترین مقالات طنز در هنر معاصر را پایه‌گذاری کن!",
      descriptionFa: "پرورش شوخ‌طبعی و نبوغ انتقادی در دانشجویان نخبه.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AABB",
    passageEn:
      "Mounted upon the central marble pillar of the National Gallery foyer, the eucalyptus-framed canvas greeted five thousand visitors a day. Beneath the white linen, an engraved bronze plaque read simply: 'Dedicated to the serendipitous sneeze of Lord Harrington—proving that life's accidental moments create art's greatest stories.' Schoolchildren and art scholars alike stopped before the frame with appreciative grins, finding joy in a masterpiece that demanded only their smile.",
    keywords: [
      { word: "serendipitous", meaningFa: "خوش‌یمن، حاصل اتفاقی فرخنده و مبارک", phonetic: "/ˌserənˈdɪpɪtəs/" },
      { word: "appreciative", meaningFa: "قدرشناسانه، همراه با تحسین و لذت", phonetic: "/əˈpriːʃətɪv/" },
      { word: "plaque", meaningFa: "پلاک یا لوح برنزی یادبود", phonetic: "/plæk/" },
      { word: "grins", meaningFa: "لبخندهای پهن و خودمانی", phonetic: "/ɡrɪnz/" },
    ],
    question: {
      promptEn: "What message was engraved on the bronze plaque beneath the canvas at the National Gallery?",
      promptFa: "چه پیامی روی لوح برنزی زیر تابلو در گالری ملی حک شده بود؟",
      options: [
        "Dedicated to the serendipitous sneeze of Lord Harrington—proving that life's accidental moments create art's greatest stories",
        "Property of the Ministry of Revenue and Finance",
        "Silence must be observed at all times in this hall",
      ],
      correctIndex: 0,
      hintSnippet: "Dedicated to the serendipitous sneeze of Lord Harrington—proving that life's accidental moments create art's greatest stories",
      clueFa: "خط دوم رو بخون؛ تقدیم به عطسه فرخنده لرد هرینگتون، اثبات اینکه اتفاقات تصادفی زندگی بهترین داستان‌های هنر را می‌آفرینند.",
    },
    choiceA: {
      labelEn: "Celebrate the permanent installation with an open-air public picnic in Trafalgar Square!",
      labelFa: "نصب دائمی تابلو را با یک پیک‌نیک عمومی در میدان ترافالگار جشن بگیرید!",
      descriptionFa: "روزی شاد و مردمی با صرف چای و کیک زیر آفتاب بهاری.",
    },
    choiceB: {
      labelEn: "Commission a golden miniature replica to hang in Harrington's private boardroom as a reminder of humility!",
      labelFa: "نسخه کوچک طلایی اثر را در اتاق جلسات لرد هرینگتون نصب کن تا نماد تواضع در موفقیت باشد!",
      descriptionFa: "یادآوری همیشگی اینکه فروتنی و شوخ‌طبعی بهترین مشاور مدیران است.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABAA",
    passageEn:
      "The newly chartered Mayfair Fine Arts Fellowship awarded its first ten research grants to promising young sculptors, conservators, and painters. Seated on the judging dais, Arthur and Harrington raised crystal glasses of 1945 port to the future of British culture. Harrington remarked with a chuckle: 'Had I not ordered the spicy bisque that evening, forty young artists would be without studios today.' Vivian raised her glass: 'Long live bad cooking and brilliant auctions!'",
    keywords: [
      { word: "chartered", meaningFa: "دارای اساسنامه رسمی و ثبت قانونی", phonetic: "/ˈtʃɑːrtərd/" },
      { word: "conservators", meaningFa: "مرمت‌کاران تخصصی آثار تاریخی و عتیقه‌جات", phonetic: "/kənˈsɜːrvətərz/" },
      { word: "promising", meaningFa: "آینده‌دار، پرامید و بااستعداد", phonetic: "/ˈprɒmɪsɪŋ/" },
      { word: "grants", meaningFa: "کمک‌هزینه‌ها و گرنت‌های بلاعوض پژوهشی", phonetic: "/ɡrɑːnts/" },
    ],
    question: {
      promptEn: "What humorous reason did Harrington give for forty young artists having studios today?",
      promptFa: "هرینگتون به چه دلیل طنزآمیزی گفت که چهل هنرمند جوان امروز دارای کارگاه شدند؟",
      options: [
        "Because he ordered the spicy lobster bisque that caused his sneeze",
        "Because he won an international poker tournament",
        "Because his robotic factory discovered a vein of silver",
      ],
      correctIndex: 0,
      hintSnippet: "Had I not ordered the spicy bisque that evening, forty young artists would be without studios today",
      clueFa: "خط سوم رو نگاه کن؛ با خنده گفت اگه اون شب سوپ تند خرچنگ رو سفارش نداده بودم، این جوون‌ها صاحب آتلیه نمی‌شدن!",
    },
    choiceA: {
      labelEn: "Toast the fellowship's first cohort of graduate artists at an annual London gala dinner!",
      labelFa: "اولین گروه هنرمندان دانش‌آموخته بورسیه را در شام سالانه لندن گرامی بدار!",
      descriptionFa: "شبی ماندگار از تحقق رویاهای جوانان مستعد.",
    },
    choiceB: {
      labelEn: "Establish an international student exchange between London and Geneva art academies!",
      labelFa: "برنامه تبادل دانشجو میان آکادمی‌های هنر لندن و ژنو را برقرار کن!",
      descriptionFa: "گسترش پیوندهای فرهنگی میان مراکز آموزشی دو کشور.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABAB",
    passageEn:
      "Mounted securely inside a bulletproof velvet display case in the foyer of Mayfair, Arthur’s historic ivory gavel stood gleaming beneath museum spotlights. The inscription below proclaimed it: 'The Gavel of the Fourteen-Million Sneeze—Purchased by Wit, Validated by Generosity.' Visitors from across the world took photographs beside it, smiling as tour guides narrated the legendary evening when an auctioneer's lightning presence of mind saved an empire of elegance from disarray.",
    keywords: [
      { word: "bulletproof", meaningFa: "ضدگلوله و فوق‌العاده ایمن", phonetic: "/ˈbʊlɪtpruːf/" },
      { word: "disarray", meaningFa: "بی‌نظمی، هرج‌ومرج و آشفتگی", phonetic: "/ˌdɪsəˈreɪ/" },
      { word: "validated", meaningFa: "تاییدشده، مشروعیت‌یافته و تثبیت‌شده", phonetic: "/ˈvælɪdeɪtɪd/" },
      { word: "presence of mind", meaningFa: "حاضرجوابی و حضور ذهن سریع در بحران", phonetic: "/ˈprezns əv maɪnd/" },
    ],
    question: {
      promptEn: "What quality of Arthur's was credited on the tour plaque for saving the evening?",
      promptFa: "روی لوح یادبود چه ویژگی خاصی از آرتور به عنوان نجات‌بخش آن شب ذکر شد؟",
      options: [
        "His lightning presence of mind that saved an empire of elegance from disarray",
        "His loud auctioneering voice that echoed across London",
        "His expertise in ancient French calligraphy",
      ],
      correctIndex: 0,
      hintSnippet: "an auctioneer's lightning presence of mind saved an empire of elegance from disarray",
      clueFa: "خط آخر رو بخون دوست من؛ حضور ذهن برق‌آسا و خونسردی بی‌نظیر آرتور که آبروی حراجی رو حفظ کرد.",
    },
    choiceA: {
      labelEn: "Host an exclusive night tour of Mayfair's historic auction vaults for art enthusiasts!",
      labelFa: "تور شبانه اختصاصی بازدید از خزانه‌های تاریخی حراجی را برای علاقه‌مندان برگزار کن!",
      descriptionFa: "تجربه‌ای اسرارآمیز و جذاب در میان گرانبهاترین آثار باستانی.",
    },
    choiceB: {
      labelEn: "Award Arthur the honorary title of Emeritus Master of British Auctioneering!",
      labelFa: "عنوان افتخاری استاد ارشد بازنشسته حراجی انگلستان را به آرتور اعطا کن!",
      descriptionFa: "پایانی پر از احترام برای مردی که اسطوره اخلاق حرفه‌ای شد.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABBA",
    passageEn:
      "At the Palace Hotel in St. Moritz, the inaugural Delacroix-Harrington Prize for Creative Serendipity celebrated its first international winners. Fifty renowned contemporary creators gathered under ice-carved sculptures of blank canvases and golden gavels. Addressing the assembly, Monsieur Delacroix clinked his glass: 'Had our dear friend Alistair held back his sneeze, we should be sitting in cold offices tonight. Long live the unpredictable beauty of human folly!'",
    keywords: [
      { word: "serendipity", meaningFa: "رویداد فرخنده، اتفاق مبارک و کشف غیرمنتظره خوشایند", phonetic: "/ˌserənˈdɪpəti/" },
      { word: "folly", meaningFa: "حماقت شیرین، اشتباه بی‌ضرر و شوخ‌طبعانه", phonetic: "/ˈfɒli/" },
      { word: "inaugural", meaningFa: "افتتاحیه، نخستین دوره رسمی", phonetic: "/ɪˈnɔːɡjərəl/" },
      { word: "unpredictable", meaningFa: "پیش‌بینی‌ناپذیر و غافلگیرکننده", phonetic: "/ˌʌnprɪˈdɪktəbl/" },
    ],
    question: {
      promptEn: "What did Monsieur Delacroix celebrate in his toast at the St. Moritz gala?",
      promptFa: "موسیو دلاکروا در سخنرانی‌اش در سنت موریتز چه چیزی را ستایش کرد؟",
      options: [
        "The unpredictable beauty of human folly that brings unexpected joy",
        "The exact mechanical precision of Swiss wristwatches",
        "The complete eradication of common cold viruses",
      ],
      correctIndex: 0,
      hintSnippet: "Long live the unpredictable beauty of human folly!",
      clueFa: "خط آخر رو ببین؛ زیبایی پیش‌بینی‌ناپذیر اشتباهات انسانی که گاهی شگفتی و شادی به بار می‌آورد.",
    },
    choiceA: {
      labelEn: "Award the golden trophy to a witty Parisian performance troupe under dancing northern lights!",
      labelFa: "تندیس طلایی را به گروه نمایش خلاق پاریسی زیر نورهای زمستانی اهدا کن!",
      descriptionFa: "پایانی شاداب و باشکوه در کوهستان‌های برفی آلپ.",
    },
    choiceB: {
      labelEn: "Broadcast the gala worldwide as an annual festival of creative humor and human connection!",
      labelFa: "این رویداد را به فستیوال سالانه جهانی طنز خلاق و پیوند انسانی بدل کن!",
      descriptionFa: "رساندن پیام شادی و لبخند به میلیون‌ها مخاطب در سراسر گیتی.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABBB",
    passageEn:
      "In the Geneva workshops of Delacroix, master horologists unveiled 'The Chronometer 42'—an ultra-limited edition timepiece featuring a pure white grand feu enamel dial and a discreet miniature golden gavel as the second hand. Only twelve pieces were produced, gifted exclusively to the participants of that fabled evening. Fastening the alligator strap around his wrist, Harrington laughed: 'Every tick of this watch reminds me that one well-timed sneeze can bring friends together across borders.'",
    keywords: [
      { word: "grand feu", meaningFa: "میناکاری در کوره با حرارت بسیار بالا در ساعت‌های لوکس", phonetic: "/ɡrɑ̃ fø/" },
      { word: "fabled", meaningFa: "افسانه‌ای، زبانزد و پرآوازه", phonetic: "/ˈfeɪbld/" },
      { word: "chronometer", meaningFa: "زمان‌سنج بسیار دقیق با گواهی رسمی مکانیکی", phonetic: "/krəˈnɒmɪtər/" },
      { word: "enamel", meaningFa: "مینای بلورین لعاب‌داده‌شده سفید", phonetic: "/ɪˈnæml/" },
    ],
    question: {
      promptEn: "What unique artistic feature was incorporated into the second hand of 'The Chronometer 42'?",
      promptFa: "چه ویژگی هنری منحصربه‌فردی در عقربه ثانیه‌شمار ساعت کرونومتر ۴۲ به کار رفته بود؟",
      options: [
        "A discreet miniature golden gavel",
        "A microscopic diamond lobster",
        "A tiny silver pocket handkerchief",
      ],
      correctIndex: 0,
      hintSnippet: "a discreet miniature golden gavel as the second hand. Only twelve pieces were produced",
      clueFa: "خط دوم رو بخون دوست من؛ یک چکش حراج مینیاتوری طلایی ظریف به عنوان عقربه ثانیه‌شمار حرکت می‌کرد.",
    },
    choiceA: {
      labelEn: "Auction piece number 01 for children's hospitals at the Geneva Watch Grand Prix!",
      labelFa: "شماره ۰۱ این ساعت نایاب را برای بیمارستان‌های کودکان در جایزه بزرگ ژنو به حراج بگذار!",
      descriptionFa: "اثری ماندگار که لبخند را بر لبان کودکان بیمار می‌نشاند.",
    },
    choiceB: {
      labelEn: "Clink espresso cups on the shores of Lake Geneva with Delacroix as lifelong friends!",
      labelFa: "در کنار ساحل زیبای دریاچه ژنو فنجان‌های قهوه را با دلاکروا به سلامتی این رفاقت ماندگار به هم بزنید!",
      descriptionFa: "پایانی آرامش‌بخش، شیک و دوستانه در سوئیس.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BAAA",
    passageEn:
      "At the Venice Biennale, pavilion visitors stood mesmerized before a towering six-meter robotic arm fluidly sketching sweeping charcoal spirals across a pristine canvas. Every stroke was synchronized in real time to audio feeds of volunteers coughing or sneezing into acoustic funnel microphones outside. Art theorists debated passionately whether the resulting drawings represented machine empathy or organic satire, while Harrington and Zero drank Bellinis by the Grand Canal, reveling in the glorious absurdity of modern aesthetics.",
    keywords: [
      { word: "Biennale", meaningFa: "دوسالانه هنری بین‌المللی ونیز", phonetic: "/ˌbiːeˈnɑːleɪ/" },
      { word: "empathy", meaningFa: "همدلی و درک احساسات دیگران", phonetic: "/ˈempəθi/" },
      { word: "reveling", meaningFa: "غرق در لذت و شادی شدن", phonetic: "/ˈrevəlɪŋ/" },
      { word: "Bellinis", meaningFa: "نوشیدنی خنک هلو و انگور مخصوص ونیز", phonetic: "/bəˈliːniz/" },
    ],
    question: {
      promptEn: "How were the charcoal strokes of the robotic arm controlled at the Venice Biennale?",
      promptFa: "حرکات زغال بازوی رباتیک در دوسالانه ونیز چگونه کنترل می‌شدند؟",
      options: [
        "Synchronized in real time to audio feeds of visitors sneezing or coughing into funnel microphones",
        "Pre-programmed by a chess computer",
        "Controlled via remote satellite joysticks from London",
      ],
      correctIndex: 0,
      hintSnippet: "synchronized in real time to audio feeds of volunteers coughing or sneezing into acoustic funnel microphones outside",
      clueFa: "خط دوم رو ببین؛ هم‌زمان با صدای عطسه و سرفه تماشاگران از طریق میکروفون‌های قیفی بیرون سالن هدایت می‌شد.",
    },
    choiceA: {
      labelEn: "Accept the Golden Lion trophy at the Biennale with an impromptu joint acceptance speech!",
      labelFa: "جایزه معتبر شیر طلایی دوسالانه ونیز را با سخنرانی طنز مشترک دریافت کن!",
      descriptionFa: "افتخاری بین‌المللی که نام تیم را در تاریخ هنر ثبت می‌کند.",
    },
    choiceB: {
      labelEn: "Glide down the Grand Canal in a decorated gondola, toasting the triumph of laughter over pretension!",
      labelFa: "با گوندولای تزیین‌شده در کانال بزرگ ونیز گشت بزنید و پیروزی خنده بر تکلف را جشن بگیرید!",
      descriptionFa: "پایانی رویایی و سرشار از شوخ‌طبعی در ونیز ایتالیا.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BAAB",
    passageEn:
      "Over two hundred science and discovery museums across forty countries installed the 'Pneumatic Muse' robotic painting stations. Millions of young students crowded the exhibits, deliberately tickling their noses with feather dusters to trigger joyful mechanized splashes of paint onto digital canvases. School administrators reported a surge in children enrolling in STEM and robotics coursework, all inspired by the billionaire who sneezed his way into scientific history.",
    keywords: [
      { word: "mechanized", meaningFa: "مکانیزه و خودکار شده با ماشین‌آلات", phonetic: "/ˈmekənaɪzd/" },
      { word: "feather dusters", meaningFa: "گردگیرهای پردار نرم", phonetic: "/ˈfeðər ˌdʌstərz/" },
      { word: "STEM", meaningFa: "رشته‌های علوم، فناوری، مهندسی و ریاضیات", phonetic: "/stem/" },
      { word: "enrolling", meaningFa: "ثبت‌نام کردن و نام‌نویسی در دوره‌های آموزشی", phonetic: "/ɪnˈrəʊlɪŋ/" },
    ],
    question: {
      promptEn: "What academic trend was observed among children after interacting with the robotic exhibits?",
      promptFa: "چه روند تحصیلی مثبتی پس از تعامل با این ربات‌ها در بین دانش‌آموزان مشاهده شد؟",
      options: [
        "A surge in students enrolling in STEM and robotics coursework",
        "A decline in school attendance due to seasonal colds",
        "An increase in art students moving to Tasmanian eucalyptus farms",
      ],
      correctIndex: 0,
      hintSnippet: "School administrators reported a surge in children enrolling in STEM and robotics coursework",
      clueFa: "خط سوم رو نگاه کن دوست من؛ افزایش چشمگیر ثبت‌نام بچه‌ها در رشته‌های علوم، تکنولوژی، مهندسی و رباتیک.",
    },
    choiceA: {
      labelEn: "Celebrate the nationwide STEM milestone with a robotic art fair in London's Olympic Park!",
      labelFa: "این دستاورد ملی علمی را با جشنواره هنر رباتیک در پارک المپیک لندن جشن بگیر!",
      descriptionFa: "جشنی پرشور با حضور هزاران نوجوان و خانواده‌های شاد.",
    },
    choiceB: {
      labelEn: "Present Lord Harrington with the Royal Society Medal for Public Understanding of Science!",
      labelFa: "مدال افتخار انجمن سلطنتی برای ترویج علم در میان عموم را به لرد هرینگتون اهدا کن!",
      descriptionFa: "پایانی پربار که نشان داد شوخی و علم می‌توانند آینده‌ساز باشند.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BABA",
    passageEn:
      "Cutting the crimson velvet ribbon on the Mayfair Youth Arts Pavilion in East London, Vivian was surrounded by three hundred excited neighborhood students holding brushes and sketchpads. The school, fully endowed by the viral streaming rights from the infamous auction night, offered world-class art tuition completely free of charge. In her speech, Vivian remarked: 'Art belongs not to quiet auction rooms, but to the vibrant energy of curious young minds.'",
    keywords: [
      { word: "endowed", meaningFa: "وقف‌شده و دارای تامین مالی دائمی", phonetic: "/ɪnˈdaʊd/" },
      { word: "tuition", meaningFa: "شهریه و آموزش تخصصی", phonetic: "/tjuˈɪʃn/" },
      { word: "infamous", meaningFa: "پر سر و صدا، زبانزد و جنجالی", phonetic: "/ˈɪnfəməs/" },
      { word: "sketchpads", meaningFa: "دفترچه‌های مخصوص طراحی و نقاشی", phonetic: "/ˈsketʃpædz/" },
    ],
    question: {
      promptEn: "How was the tuition at the newly opened youth art pavilion structured for students?",
      promptFa: "شهریه آموزش در این فرهنگسرای نوبنیاد برای دانش‌آموزان چگونه تنظیم شده بود؟",
      options: [
        "Completely free of charge, fully endowed by the auction streaming royalties",
        "Subsidized only for children of professional auctioneers",
        "Exchanged for donated cans of lobster soup",
      ],
      correctIndex: 0,
      hintSnippet: "offered world-class art tuition completely free of charge",
      clueFa: "خط سوم رو بخون؛ کاملاً رایگان با بودجه حاصل از حق پخش استریم شب حراجی.",
    },
    choiceA: {
      labelEn: "Hang the students' first vibrant collaborative mural in the central lobby of Mayfair!",
      labelFa: "اولین نقاشی دیواری باشکوه بچه‌ها را در لابی اصلی حراجی لندن نصب کن!",
      descriptionFa: "درخشش هنر جوانان در معتبرترین سالن حراجی شهر.",
    },
    choiceB: {
      labelEn: "Host an annual summer street carnival celebrating community art and music!",
      labelFa: "کارناوال خیابانی تابستانه هنر و موسیقی مردمی را در محله برپا کن!",
      descriptionFa: "پایانی پر از رنگ، ساز و آواز برای تمام اهالی محل.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BABB",
    passageEn:
      "At the National Television Awards ceremony at the O2 Arena, the golden statuette for Best Cultural Comedy Special was presented to Arthur, Vivian, and Lord Harrington. The audience erupted in laughter as Harrington took the microphone and sneezed gently into his silk handkerchief before thanking his allergist, his chef, and the British public for turning his sinuses into national treasure. Arthur stood beside him holding the golden trophy aloft, beaming with theatrical panache.",
    keywords: [
      { word: "statuette", meaningFa: "تندیس یا مجسمه کوچک افتخار", phonetic: "/ˌstætʃuˈet/" },
      { word: "allergist", meaningFa: "پزشک متخصص بیماری‌های آلرژی و حساسیت", phonetic: "/ˈælədʒɪst/" },
      { word: "panache", meaningFa: "شکوه، طمانینه و سبک جذاب نمایشی", phonetic: "/pəˈnæʃ/" },
      { word: "theatrical", meaningFa: "نمایشی، گیرا و تحسین‌برانگیز", phonetic: "/θiˈætrɪkl/" },
    ],
    question: {
      promptEn: "What comedic gesture did Harrington perform upon receiving the television award?",
      promptFa: "هرینگتون هنگام دریافت جایزه تلویزیونی چه حرکت خنده‌داری انجام داد؟",
      options: [
        "He gently sneezed into his silk handkerchief before thanking his allergist and chef",
        "He dropped the golden statuette onto the presenter's shoes",
        "He attempted an opera aria in Italian",
      ],
      correctIndex: 0,
      hintSnippet: "sneezed gently into his silk handkerchief before thanking his allergist, his chef, and the British public",
      clueFa: "خط دوم رو ببین دوست من؛ با یک عطسه آرام توی دستمال ابریشمی شروع کرد و از پزشک آلرژی و سرآشپزش تشکر کرد!",
    },
    choiceA: {
      labelEn: "Celebrate backstage with the cast and crew with a tower of sparkling apple cider!",
      labelFa: "پشت صحنه را در کنار تمام عوامل با برجی از نوشیدنی‌های گازدار جشن بگیرید!",
      descriptionFa: "شبی پر از خنده، رقص و تبریک‌های صمیمانه.",
    },
    choiceB: {
      labelEn: "Embark on a nationwide comedy speaking tour on 'The Fine Art of Laughing at Oneself'!",
      labelFa: "تور سخنرانی‌های طنز و انگیزشی «هنر خندیدن به خویشتن» را در سراسر کشور آغاز کن!",
      descriptionFa: "الهام‌بخشی به میلیون‌ها نفر برای استقبال از شوخ‌طبعی و پذیرش اشتباهات.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBAA",
    passageEn:
      "The newly inaugurated Harrington Respiratory Institute at UCL was hailed as a global center of excellence. Inside its gleaming laboratories, forty doctoral researchers worked on revolutionary aerosol therapies and antihistamine compounds. Unveiling the entrance plaque, the Chancellor declared that no scientific research wing had ever been founded on such an entertaining premise. Beside him, Harrington wiped away a happy tear: 'I sneezed in foolishness, but these young scientists will breathe life into the world.'",
    keywords: [
      { word: "aerosol", meaningFa: "افشانه دارویی تنفسی", phonetic: "/ˈeərəsɒl/" },
      { word: "antihistamine", meaningFa: "آنتی‌هیستامین و ضدحساسیت دارویی", phonetic: "/ˌæntiˈhɪstəmiːn/" },
      { word: "premise", meaningFa: "پیش‌فرض، مقدمه و ماجرای اولیه", phonetic: "/ˈpremɪs/" },
      { word: "chancellor", meaningFa: "رئیس عالی‌رتبه دانشگاه", phonetic: "/ˈtʃɑːnsələr/" },
    ],
    question: {
      promptEn: "What research focus occupied the researchers at the newly inaugurated institute?",
      promptFa: "پژوهشگران در پژوهشکده تازه تاسیس روی چه موضوعی کار می‌کردند؟",
      options: [
        "Revolutionary aerosol therapies and antihistamine compounds",
        "Techniques for repairing water-damaged oil canvases",
        "The acoustic frequency of bronze auction gavels",
      ],
      correctIndex: 0,
      hintSnippet: "forty doctoral researchers worked on revolutionary aerosol therapies and antihistamine compounds",
      clueFa: "خط دوم رو نگاه کن؛ روی افشانه‌های تنفسی نوین و ترکیبات دارویی ضدآلرژی متمرکز بودند.",
    },
    choiceA: {
      labelEn: "Award the first clinical discovery prize to a team of young medical researchers!",
      labelFa: "اولین جایزه کشف درمانی را به تیم پژوهشگران جوان پزشکی اهدا کن!",
      descriptionFa: "تجلیل از دانشمندانی که زندگی بیماران را متحول می‌کنند.",
    },
    choiceB: {
      labelEn: "Host an annual charity garden party on the university lawn with lemon tea and scones!",
      labelFa: "جشن سالانه چای و شیرینی در محوطه سرسبز دانشگاه برای عموم مردم برگزار کن!",
      descriptionFa: "دورهمی پرمهر و باصفا در محیط دانشگاهی.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBAB",
    passageEn:
      "The illustrated humor book 'The Sneeze That Cured Sneezes' became a runaway publishing phenomenon, translated into twenty-four languages. Combining whimsical caricatures of Arthur, Harrington, and Vivian with accessible educational guides on managing respiratory health, the book raised three million pounds for pediatric allergy wards. Parents and doctors worldwide praised its warm, reassuring tone, proving that humor is indeed the finest medicine for human hearts.",
    keywords: [
      { word: "whimsical", meaningFa: "شوخ‌طبعانه، فانتزی و بامزه", phonetic: "/ˈwɪmzɪkl/" },
      { word: "pediatric", meaningFa: "مربوط به کودکان و طب اطفال", phonetic: "/ˌpiːdiˈætrɪk/" },
      { word: "caricatures", meaningFa: "کاریکاتورهای طنزآمیز و اغراق‌شده", phonetic: "/ˈkærɪkətʃʊərz/" },
      { word: "runaway", meaningFa: "مهارنشدنی، بسیار پرشتاب و پرفروش", phonetic: "/ˈrʌnəweɪ/" },
    ],
    question: {
      promptEn: "Where were the royalties of the whimsical illustrated book directed?",
      promptFa: "عواید حاصل از فروش این کتاب مصور طنزآمیز به کجا اختصاص یافت؟",
      options: [
        "To pediatric allergy hospital wards worldwide",
        "To purchase rare French wines for the publishers",
        "To fund private helicopter lessons for Arthur",
      ],
      correctIndex: 0,
      hintSnippet: "the book raised three million pounds for pediatric allergy wards",
      clueFa: "خط سوم رو بخون دوست من؛ سه میلیون پوند برای بخش‌های درمان آلرژی کودکان در بیمارستان‌ها جمع‌آوری شد.",
    },
    choiceA: {
      labelEn: "Read excerpts of the book to children at London's Great Ormond Street Hospital!",
      labelFa: "بخش‌هایی از کتاب را برای کودکان در بیمارستان کودکان لندن با خنده و قصه بخوان!",
      descriptionFa: "بخشیدن امید و شادی به دل کودکان معصوم.",
    },
    choiceB: {
      labelEn: "Receive the International Children's Book of the Year Award at the Frankfurt Book Fair!",
      labelFa: "جایزه کتاب کودک سال را در نمایشگاه بین‌المللی کتاب فرانکفورت دریافت کن!",
      descriptionFa: "افتخاری بین‌المللی برای اثری که خنده و آموزش را در هم آمیخت.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBBA",
    passageEn:
      "Under the bright morning sun, thousands of Londoners lined the streets of Mayfair for the festive 'Parade of the Golden Tissues'. Brass bands played jaunty maritime marches, while floats carrying giant papier-mâché sneezes and floating balloons filled the air with infectious laughter. Riding in an open-top vintage Rolls-Royce, Lord Harrington, Arthur, and Vivian waved their golden handkerchief scepters to roaring cheers, uniting the entire city in a shared celebration of mirth and goodwill.",
    keywords: [
      { word: "jaunty", meaningFa: "شاد، باانرژی و سرزنده", phonetic: "/ˈdʒɔːnti/" },
      { word: "papier-mâché", meaningFa: "پاپیه ماشه (مجسمه‌سازی با خمیر کاغذ)", phonetic: "/ˌpæpieɪ ˈmæʃeɪ/" },
      { word: "mirth", meaningFa: "شادی، خنده و نشاط فراوان", phonetic: "/mɜːrθ/" },
      { word: "infectious", meaningFa: "واگیردار و سرایت‌کننده (مانند خنده پرشور)", phonetic: "/ɪnˈfekʃəs/" },
    ],
    question: {
      promptEn: "What vehicle did Lord Harrington, Arthur, and Vivian ride in during the festive parade?",
      promptFa: "هرینگتون، آرتور و ویوین در طول رژه باشکوه سوار چه خودرویی بودند؟",
      options: [
        "An open-top vintage Rolls-Royce",
        "A horse-drawn royal golden carriage",
        "A customized autonomous electric rover",
      ],
      correctIndex: 0,
      hintSnippet: "Riding in an open-top vintage Rolls-Royce, Lord Harrington, Arthur, and Vivian waved their golden handkerchief scepters",
      clueFa: "خط سوم رو نگاه کن؛ سوار بر یک خودروی کلاسیک رولزرویس روباز در میان هلهله مردم دست تکان می‌دادند.",
    },
    choiceA: {
      labelEn: "Declare the first Saturday of May an annual municipal Day of Laughter and Kindness!",
      labelFa: "اولین شنبه ماه مه را روز رسمی خنده و مهربانی در تقویم شهر ثبت کن!",
      descriptionFa: "سنت زیبایی که هر سال شادی و دوستی را به خیابان‌ها می‌آورد.",
    },
    choiceB: {
      labelEn: "Gather for a group photograph in front of Mayfair with hundreds of cheering citizens!",
      labelFa: "عکس دسته‌جمعی یادگاری جلوی درب حراجی لندن در کنار صدها شهروند شاد بگیر!",
      descriptionFa: "ثبت تصویری جاودان از روزی که لندن یک‌صدا خندید.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBBB",
    passageEn:
      "Settled comfortably into wicker armchairs on the manicured lawn of Harrington’s Oxfordshire manor, the three comrades watched the golden sunset dip below ancient oak trees. Beside them lay croquet mallets and a tea table laden with warm scones, clotted cream, and strawberry jam—with not a single speck of black pepper or lobster in sight. Harrington took a contented sip of Earl Grey: 'My dear friends, we came together over a sneeze, but we stay together because life is simply too marvelous to take too seriously.'",
    keywords: [
      { word: "manicured", meaningFa: "آراسته، باغبانی‌شده و بسیار منظم", phonetic: "/ˈmænɪkjʊəd/" },
      { word: "mallets", meaningFa: "چکش‌های چوبی مخصوص بازی کروکت در چمنزار", phonetic: "/ˈmælɪts/" },
      { word: "contented", meaningFa: "راضی، خشنود و در آرامش خاطر", phonetic: "/kənˈtentɪd/" },
      { word: "marvelous", meaningFa: "شگفت‌انگیز، تماشایی و معجزه‌آسا", phonetic: "/ˈmɑːrvələs/" },
    ],
    question: {
      promptEn: "What philosophical conclusion did Lord Harrington share while sipping Earl Grey tea?",
      promptFa: "لرد هرینگتون هنگام نوشیدن چای ارل گری به چه نتیجه فلسفی دلنشینی رسید؟",
      options: [
        "That life is simply too marvelous to take too seriously",
        "That lobster bisque should only be eaten on Tuesdays",
        "That croquet is the only sport worth playing in England",
      ],
      correctIndex: 0,
      hintSnippet: "we came together over a sneeze, but we stay together because life is simply too marvelous to take too seriously",
      clueFa: "جمله آخر رو بخون؛ گفت ما با یک عطسه دور هم جمع شدیم، اما با هم موندیم چون زندگی واقعاً شگفت‌انگیزتر از اونه که خیلی سختش بگیریم!",
    },
    choiceA: {
      labelEn: "Clink porcelain teacups in quiet gratitude as twilight envelops the peaceful English countryside!",
      labelFa: "فنجان‌های چینی چای را با آرامش و سپاسگزاری در گرگ‌ومیش دل‌انگیز ییلاق به هم بزنید!",
      descriptionFa: "پایانی رویایی، صمیمی و آرام‌بخش در دل طبیعت.",
    },
    choiceB: {
      labelEn: "Promise to meet every autumn on the anniversary of the great sneeze to celebrate their friendship!",
      labelFa: "عهد ببندید که هر پاییز در سالگرد آن عطسه تاریخی گرد هم بیایید و دوستی‌تان را تازه کنید!",
      descriptionFa: "پیمانی جاودان میان دوستانی که با یک لبخند دنیا را تغییر دادند.",
    },
  },
];

const endings: EndingDraft[] = [
  { pathCode: "AAAAA", titleEn: "The Sovereign Toast of Mayfair", titleFa: "سلامتی اشرافی لندن", badgeCategory: "legendary", badgeIcon: "🥂", badgeNameFa: "پایان وقار و شکوه", climaxEn: "Under the chandeliers of Mayfair, the diplomatic triumph turns a billionaire's sneeze into the defining social legend of modern England.", climaxFa: "زیر لوسترهای باشکوه لندن، این پیروزی دیپلماتیک عطسه میلیاردر را به ماندگارترین افسانه اجتماعی انگلیس نوین بدل کرد.", xpReward: 270 },
  { pathCode: "AAAAB", titleEn: "The Tokyo Ribbon of Triumph", titleFa: "روبان پیروزی توکیو", badgeCategory: "explorer", badgeIcon: "✈️", badgeNameFa: "پایان بین‌المللی درخشان", climaxEn: "Harrington cuts the silk ribbon in Tokyo before ten thousand cheering patrons, inaugurating the world tour of 'The Fourteen-Million Inhale'.", climaxFa: "هرینگتون در توکیو روبان افتتاحیه را جلوی ده هزار تماشاگر قیچی کرد و تور جهانی «دم عمیق ۱۴ میلیون پوندی» را کلید زد.", xpReward: 265 },
  { pathCode: "AAABA", titleEn: "The Golden Maxim of Art", titleFa: "پند زرین هنر", badgeCategory: "scholar", badgeIcon: "🏛️", badgeNameFa: "پایان فلسفی و آموزنده", climaxEn: "Arthur's immortal maxim—'a great auctioneer sells the imagination'—is carved in marble above the gates of the Royal Academy of Arts.", climaxFa: "جمله جاودان آرتور که «حراج‌دار بزرگ تخیل را می‌فروشد» بر سردر سنگی آکادمی سلطنتی هنرهای زیبا حک شد.", xpReward: 275 },
  { pathCode: "AAABB", titleEn: "Cornish Sunset Solitude", titleFa: "غروب آرامش در کورن‌وال", badgeCategory: "scholar", badgeIcon: "🌊", badgeNameFa: "پایان ادبی و خاطره‌انگیز", climaxEn: "Arthur's published memoirs of high-society scandals top global bestseller lists, written from his peaceful seaside cottage in Cornwall.", climaxFa: "خاطرات جذاب آرتور از پشت‌پرده رسوایی‌های هنری، از کلبه آرام ساحلی‌اش در کورن‌وال منتشر و پرفروش‌ترین کتاب جهان شد.", xpReward: 260 },
  { pathCode: "AABAA", titleEn: "The Piccadilly Salon of Wit", titleFa: "ضیافت ادبا در پیکدیلی", badgeCategory: "heroic", badgeIcon: "📚", badgeNameFa: "پایان فرهنگی و پرمخاطب", climaxEn: "Four thousand readers queue around Piccadilly Circus as Harrington, Vivian, and Arthur sign the landmark monograph on modern satire.", climaxFa: "چهار هزار مشتاق در میدان پیکدیلی صف کشیدند تا کتاب رساله طنز مدرن را با امضای هرینگتون، ویوین و آرتور دریافت کنند.", xpReward: 265 },
  { pathCode: "AABAB", titleEn: "The University Satire Prize", titleFa: "جایزه طنز نقادانه دانشگاه", badgeCategory: "scholar", badgeIcon: "🎓", badgeNameFa: "پایان دانشگاهی برجسته", climaxEn: "The Harrington-Sterling Fellowship awards twenty annual grants to witty student essayists challenging artistic pretension worldwide.", climaxFa: "بنیاد مشترک هرینگتون و استرلینگ سالانه به بیست دانشجوی نخبه که تکلف‌های هنری را به چالش بکشند جایزه اهدا می‌کند.", xpReward: 270 },
  { pathCode: "AABBA", titleEn: "The Trafalgar Square Picnic", titleFa: "پیک‌نیک بزرگ ترافالگار", badgeCategory: "funny", badgeIcon: "🧺", badgeNameFa: "پایان شاداب و مردمی", climaxEn: "Ten thousand Londoners picnic in Trafalgar Square, celebrating the installation of the eucalyptus canvas with crumpets and smiles.", climaxFa: "ده هزار لندنی با چای و شیرینی در میدان ترافالگار گرد آمدند و نصب تابلوی اکالیپتوس را با خنده جشن گرفتند.", xpReward: 250 },
  { pathCode: "AABBB", titleEn: "The Boardroom Humility Trophy", titleFa: "تندیس تواضع اتاق مدیریت", badgeCategory: "legendary", badgeIcon: "🏆", badgeNameFa: "پایان اخلاقی و ماندگار", climaxEn: "The miniature golden canvas hangs behind Harrington's boardroom desk, reminding visiting executives that humility outshines pride.", climaxFa: "بوم مینیاتوری طلایی بالای میز جلسات لرد قرار گرفت تا به مدیران یادآوری کند تواضع از غرور ارزشمندتر است.", xpReward: 260 },
  { pathCode: "ABAAA", titleEn: "The Toast to the Rising Star", titleFa: "سلامتی به ستاره‌های فردا", badgeCategory: "scholar", badgeIcon: "🎨", badgeNameFa: "پایان پرامید و بالنده", climaxEn: "Forty young painters and sculptors showcase their debut collections at Mayfair, funded entirely by the 1945 port fellowship.", climaxFa: "چهل نقاش و مجسمه‌ساز جوان با بورسیه شب حراجی، اولین نمایشگاه بزرگ هنری خود را در قلب لندن به نمایش گذاشتند.", xpReward: 270 },
  { pathCode: "ABAAB", titleEn: "The Swiss-British Art Bridge", titleFa: "پل هنر لندن و ژنو", badgeCategory: "explorer", badgeIcon: "🤝", badgeNameFa: "پایان دیپلماتیک فرامرزی", climaxEn: "An enduring cultural exchange connects British creators with Swiss watchmakers, yielding revolutionary kinetic kinetic kinetic kinetic timepieces.", climaxFa: "برنامه تبادل فرهنگی هنرمندان لندن و ساعت‌سازان سوئیس را پیوند داد و شاهکارهای مکانیکی متحرک پدید آورد.", xpReward: 265 },
  { pathCode: "ABABA", titleEn: "The Vault of Curiosities", titleFa: "خزانه شگفتی‌های تاریخی", badgeCategory: "explorer", badgeIcon: "🗝️", badgeNameFa: "پایان جذاب تاریخی", climaxEn: "Arthur's lantern-lit vault tours reveal two centuries of eccentric auction folklore, drawing cultural pilgrims from every continent.", climaxFa: "تورهای شبانه آرتور با فانوس در خزانه‌های تاریخی، روایتگر دو قرن شگفتی‌های ناگفته حراجی برای گردشگران دنیا شد.", xpReward: 260 },
  { pathCode: "ABABB", titleEn: "The Grand Master Emeritus", titleFa: "استاد ارشد بازنشسته", badgeCategory: "legendary", badgeIcon: "👑", badgeNameFa: "پایان افتخارآمیز بازنشستگی", climaxEn: "Arthur receives the royal accolade of Master Emeritus, revered across Europe as the quintessential gentleman auctioneer.", climaxFa: "آرتور به لقب سلطنتی استاد ارشد مفتخر شد و در سراسر اروپا به عنوان الگوی اصیل ادب و حراج‌داری ستایش گشت.", xpReward: 275 },
  { pathCode: "ABBAA", titleEn: "The St. Moritz Golden Ribbon", titleFa: "روبان طلایی سنت موریتز", badgeCategory: "heroic", badgeIcon: "❄️", badgeNameFa: "پایان زمستانی درخشان", climaxEn: "Under alpine fireworks, the international trophy for creative serendipity establishes St. Moritz as the winter capital of witty art.", climaxFa: "زیر آتش‌بازی‌های آلپ، تندیس بین‌المللی اتفاقات فرخنده، سنت موریتز را به پایتخت زمستانه هنر طنز بدل ساخت.", xpReward: 270 },
  { pathCode: "ABBAB", titleEn: "The Carnival of Serendipity", titleFa: "کارناوال جهانی اتفاقات خندان", badgeCategory: "legendary", badgeIcon: "🎪", badgeNameFa: "پایان جهانی و پرشور", climaxEn: "The televised annual gala reaches fifty million homes, proving that human connection is born when we laugh together.", climaxFa: "پخش تلویزیونی جشن سالانه به ۵۰ میلیون خانه رسید و اثبات کرد پیوند دل‌ها زمانی شکل می‌گیرد که با هم بخندیم.", xpReward: 265 },
  { pathCode: "ABBBA", titleEn: "The Auction of the First Chronometer", titleFa: "حراج تاریخی ساعت شماره یک", badgeCategory: "heroic", badgeIcon: "⏱️", badgeNameFa: "پایان خیریه شکوهمند", climaxEn: "Chronometer Number 01 fetches two million francs at Geneva, building a state-of-the-art children's clinic in the Swiss Alps.", climaxFa: "ساعت شماره یک دو میلیون فرانک در ژنو چکش خورد و یک درمانگاه مدرن کودکان در دامنه‌های آلپ ساخت.", xpReward: 275 },
  { pathCode: "ABBBB", titleEn: "The Lake Geneva Espresso Pact", titleFa: "پیمان اسپرسو در دریاچه ژنو", badgeCategory: "funny", badgeIcon: "☕", badgeNameFa: "پایان دوستی مادام‌العمر", climaxEn: "Delacroix and Harrington clink porcelain cups at dawn, sealed in a lifelong pact that true friendship needs neither words nor clocks.", climaxFa: "دلاکروا و هرینگتون در سپیده‌دم فنجان‌ها را به هم زدند؛ پیمانی ابدی که دوستی راستین نه به واژه نیاز دارد و نه به ساعت.", xpReward: 260 },
  { pathCode: "BAAAA", titleEn: "The Golden Lion of Venice", titleFa: "شیر طلایی دوسالانه ونیز", badgeCategory: "legendary", badgeIcon: "🦁", badgeNameFa: "پایان فتح قله‌های هنر", climaxEn: "Zero and Harrington hoist the Venice Biennale Golden Lion, hailed as pioneers who united cybernetics with situational humor.", climaxFa: "زیرو و هرینگتون شیر طلایی دوسالانه ونیز را بالای سر بردند؛ پیشگامانی که سایبرنتیک را با طنز موقعیت پیوند زدند.", xpReward: 275 },
  { pathCode: "BAAAB", titleEn: "The Gondola of Laughter", titleFa: "گوندولای شادی در کانال بزرگ", badgeCategory: "funny", badgeIcon: "🚣", badgeNameFa: "پایان رمانتیک و شوخ‌طبع", climaxEn: "Singing serenades under the Rialto Bridge, Harrington toasts the crowd, declaring that a hearty laugh is worth more than gold.", climaxFa: "با ترانه‌خوانی زیر پل ریالتو ونیز، هرینگتون جامش را بالا برد و اعلام کرد یک خنده از ته دل از کوه طلا باارزش‌تر است.", xpReward: 255 },
  { pathCode: "BAABA", titleEn: "The Olympic Park STEM Jubilee", titleFa: "جشنواره دانش و نوآوری پارک المپیک", badgeCategory: "scholar", badgeIcon: "🔬", badgeNameFa: "پایان پرشور علمی", climaxEn: "Thirty thousand teenagers code autonomous painting robots at the Olympic Park, inspired by Harrington's whimsical vision.", climaxFa: "سی هزار نوجوان در پارک المپیک لندن ربات‌های نقاش را برنامه‌نویسی کردند؛ الهام‌گرفته از رویای پرامید لرد هرینگتون.", xpReward: 270 },
  { pathCode: "BAABB", titleEn: "The Royal Science Medal", titleFa: "مدال افتخار انجمن سلطنتی علم", badgeCategory: "scholar", badgeIcon: "🏅", badgeNameFa: "پایان بلندمرتبه علمی", climaxEn: "The Royal Society awards Harrington its highest honor for transforming an everyday sneeze into a global educational revolution.", climaxFa: "انجمن سلطنتی بالاترین نشان خود را برای تبدیل یک عطسه ساده به انقلابی در آموزش علمی جوانان به هرینگتون اهدا کرد.", xpReward: 270 },
  { pathCode: "BABAA", titleEn: "The East London Mural of Dreams", titleFa: "نقاشی دیواری رویاها در شرق لندن", badgeCategory: "heroic", badgeIcon: "🎨", badgeNameFa: "پایان مردمی و باشکوه", climaxEn: "A magnificent sixty-foot mural painted by local students hangs in Mayfair, proving that raw creative talent belongs to all.", climaxFa: "نقاشی دیواری ۱۸ متری شاهکار بچه‌های محله در لابی حراجی نصب شد تا ثابت کند نبوغ هنری متعلق به همه انسان‌هاست.", xpReward: 265 },
  { pathCode: "BABAB", titleEn: "The Summer Street Jubilee", titleFa: "کارناوال تابستانه خیابان‌های شهر", badgeCategory: "funny", badgeIcon: "🎺", badgeNameFa: "پایان پرشور و موزیکال", climaxEn: "Steel bands and dancers fill the avenues of East London, celebrating a decade of free community arts with unbridled joy.", climaxFa: "گروه‌های موسیقی و رقص خیابان‌های شرق لندن را پر کردند و یک دهه آموزش رایگان هنر را با سرور و پایکوبی جشن گرفتند.", xpReward: 255 },
  { pathCode: "BABBA", titleEn: "The Backstage Cider Tower", titleFa: "برج نوشیدنی‌های جشن پیروزی", badgeCategory: "funny", badgeIcon: "🥂", badgeNameFa: "پایان صمیمی و پرخنده", climaxEn: "Laughing until their sides ache, the crew celebrates their national television victory, knowing joy is the greatest masterpiece.", climaxFa: "با خنده‌هایی از ته دل، تیم پیروزی تلویزیونی‌شان را جشن گرفتند؛ با این باور که شادی بزرگ‌ترین شاهکار آفرینش است.", xpReward: 250 },
  { pathCode: "BABBB", titleEn: "The Nationwide Comedy Odyssey", titleFa: "سفرنامه ملی خنده و امید", badgeCategory: "heroic", badgeIcon: "🎭", badgeNameFa: "پایان الهام‌بخش صحنه", climaxEn: "Harrington and Arthur fill theaters across the United Kingdom, teaching audiences that the ability to laugh at yourself is true power.", climaxFa: "هرینگتون و آرتور سالن‌های تئاتر بریتانیا را پر کردند و به مردم آموختند توانایی خندیدن به خویشتن نهایت قدرت است.", xpReward: 270 },
  { pathCode: "BBAAA", titleEn: "The Aerosol Medical Breakthrough", titleFa: "انقلاب پزشکی درمان تنفس", badgeCategory: "scholar", badgeIcon: "🩺", badgeNameFa: "پایان نجات‌بخش درمانی", climaxEn: "The Harrington Institute patents a groundbreaking inhaler that relieves severe seasonal allergies for ten million sufferers worldwide.", climaxFa: "پژوهشکده هرینگتون داروی استنشاقی نوینی ثبت کرد که حساسیت فصلی ده میلیون بیمار را در جهان درمان کرد.", xpReward: 275 },
  { pathCode: "BBAAB", titleEn: "The University Lawn Garden Party", titleFa: "ضیافت چای و صفا در چمنزار دانشگاه", badgeCategory: "funny", badgeIcon: "🫖", badgeNameFa: "پایان پرمحبت و مردمی", climaxEn: "Three thousand citizens celebrate under blooming cherry trees, raising teacups to health, research, and benevolent laughter.", climaxFa: "سه هزار شهروند زیر شکوفه‌های گیلاس چای نوشیدند و به سلامتی علم، پژوهش و خنده‌های پربرکت درود فرستادند.", xpReward: 255 },
  { pathCode: "BBBAA", titleEn: "The Great Ormond Street Storytime", titleFa: "قصه‌گویی در بخش کودکان", badgeCategory: "heroic", badgeIcon: "📖", badgeNameFa: "پایان دل‌انگیز و پرامید", climaxEn: "Reading to laughing children in the hospital ward, Harrington and Vivian see their book light up little faces with pure courage.", climaxFa: "با خواندن قصه برای کودکان بیمار، هرینگتون و ویوین دیدند که چگونه کتابشان چهره‌های معصوم را غرق در امید و شجاعت کرد.", xpReward: 270 },
  { pathCode: "BBBAB", titleEn: "The Frankfurt Gold Laurels", titleFa: "برگ زرین نمایشگاه فرانکفورت", badgeCategory: "scholar", badgeIcon: "🎖️", badgeNameFa: "پایان ادبیات جهانی", climaxEn: "The International Children's Book Jury awards 'The Sneeze That Cured Sneezes' its gold medal for bringing joy to pediatric care.", climaxFa: "هیئت داوران نمایشگاه فرانکفورت مدال طلای خود را برای آوردن خنده به بخش‌های درمانی کودکان به کتاب اهدا کرد.", xpReward: 270 },
  { pathCode: "BBBBA", titleEn: "The Mayfair Day of Laughter", titleFa: "روز جاودانه خنده در تقویم لندن", badgeCategory: "legendary", badgeIcon: "🎉", badgeNameFa: "پایان تاریخی و شادمانه", climaxEn: "Every May, fifty thousand Londoners march with golden tissue banners, celebrating that life's best victories begin with a smile.", climaxFa: "هر سال در ماه مه، پنجاه هزار لندنی با پرچم‌های دستمال طلایی راهپیمایی می‌کنند؛ یادآور اینکه پیروزی با یک لبخند آغاز می‌شود.", xpReward: 275 },
  { pathCode: "BBBBB", titleEn: "The Scone and Earl Grey Pact", titleFa: "پیمان چای ارل گری و غروب آرامش", badgeCategory: "legendary", badgeIcon: "🫖", badgeNameFa: "پایان اصیل و جاودانه", climaxEn: "Sipping tea under twilight oaks without a single speck of pepper, three lifelong friends watch the stars awaken in perfect peace.", climaxFa: "با نوشیدن چای زیر درختان کهنسال و بدون ذره‌ای فلفل، سه یار باوفا در کمال آرامش طلوع ستارگان را به نظاره نشستند.", xpReward: 275 },
];

export const story1AuctionChaos: AdventureStory = buildAdventureStory({
  id: "c1-auction-house-chaos",
  storyIndex: 1,
  cefr: "C1",
  titleEn: "The Grand Sotheby's Mix-Up",
  titleFa: "ماجرای خنده‌دار چکش حراج و نقاشی نامرئی",
  genre: "comedy",
  genreLabelFa: "😄 طنز و روزمره",
  genreIcon: "😄",
  synopsisEn:
    "When an eccentric robotics magnate mistakes an allergic sneeze for a fourteen-million-pound bid on a blank avant-garde canvas, auctioneer Arthur Pendelton and curator Vivian Sterling must avert high-society scandal across 32 uproarious endings.",
  synopsisFa:
    "در حراجی مجلل لندن، یک عطسه غیرارادی ناشی از فلفل سوپ خرچنگ، به عنوان پیشنهاد خرید ۱۴ میلیون پوندی برای یک بوم سفید انتزاعی ثبت می‌شود! آرتور پندلتون (مسئول اتوکشیده حراج) و ویوین استرلینگ (کیوریتور باهوش نگارخانه) در برابر پخش زنده تلویزیونی و اشراف‌زادگان شوکه‌شده باید این آبروریزی بزرگ را جمع کنند! ۳۲ پایان پر از خنده، حاضر‌جوابی و تدبیر هوشمندانه در انتظارته!",
  coverImage: "/images/skills/reading/c1-auction-chaos.webp",
  nodes,
  endings,
});
