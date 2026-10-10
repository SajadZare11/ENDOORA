// American English File - Tier A1 Grammar Specs (10 Stages x 20 Authentic Sentences = 200 Sentences)
// Every sentence has an authentic English structure, exact Persian translation, and L1 interference trap.

export const A1_SPECS = {
  // Stage 1: Verb To Be (am / is / are)
  1: [
    { prompt: "My brother", trans: "برادر من یک معمار خلاق در این شرکت بین‌المللی است.", steps: [
      { corr: "is", dist: ["are", "am", "be", "has"], trap: { text: "are", exp: "برای فاعل مفرد My brother باید از فعل is استفاده شود نه are." } },
      { corr: "a creative architect.", dist: ["creative architect.", "an creative architect.", "of architect.", "to architect."] }
    ]},
    { prompt: "Sarah and Emily", trans: "سارا و امیلی دانش‌آموزان کوشایی در مدرسه ما هستند.", steps: [
      { corr: "are", dist: ["is", "am", "be", "was"], trap: { text: "is", exp: "دو فاعل با and متصل شده‌اند، بنابراین فاعل جمع است و نیاز به are دارد." } },
      { corr: "hardworking students.", dist: ["hardworking student.", "a hardworking students.", "hardworking.", "the student."] }
    ]},
    { prompt: "I", trans: "من آماده هستم تا در جلسه کاری امروز شرکت کنم.", steps: [
      { corr: "am ready", dist: ["is ready", "are ready", "be ready", "have ready"], trap: { text: "is ready", exp: "برای ضمیر I تنها فعل am صحیح است." } },
      { corr: "for the business meeting.", dist: ["to business meeting.", "in the business meeting.", "for meeting business.", "on the meeting."] }
    ]},
    { prompt: "The new library", trans: "کتابخانه جدید روبه‌روی سالن اصلی تئاتر شهر است.", steps: [
      { corr: "is located", dist: ["are located", "am located", "be located", "locates"], trap: { text: "are located", exp: "اسم مفرد library با is هماهنگ می‌شود." } },
      { corr: "opposite the city theater.", dist: ["opposite to theater.", "opposite of theater.", "in opposite theater.", "at theater opposite."] }
    ]},
    { prompt: "These English exercises", trans: "این تمرین‌های زبان انگلیسی برای نوآموزان بسیار آسان هستند.", steps: [
      { corr: "are very easy", dist: ["is very easy", "am very easy", "be easy", "very easy"], trap: { text: "is very easy", exp: "فاعل these exercises جمع است و فعل are می‌خواهد." } },
      { corr: "for beginner students.", dist: ["to beginner students.", "for student beginners.", "with beginners.", "at beginners."] }
    ]},
    { prompt: "David", trans: "دیوید اهل ملبورن استرالیا است.", steps: [
      { corr: "is originally", dist: ["are originally", "am originally", "be originally", "has originally"], trap: { text: "are originally", exp: "دیوید مفرد است و با is می‌آید." } },
      { corr: "from Melbourne, Australia.", dist: ["of Melbourne.", "to Melbourne.", "in from Melbourne.", "at Melbourne."] }
    ]},
    { prompt: "Our grandparents", trans: "پدربزرگ و مادربزرگ ما اکنون در باغ آرام خود هستند.", steps: [
      { corr: "are currently", dist: ["is currently", "am currently", "be currently", "was currently"], trap: { text: "is currently", exp: "در فارسی برای احترام 'هستند' می‌گوییم اما در انگلیسی grandparents واقعاً جمع است و are می‌گیرد." } },
      { corr: "in their peaceful garden.", dist: ["at their garden.", "on their garden.", "to their garden.", "inside garden."] }
    ]},
    { prompt: "The doctor", trans: "پزشک اکنون در درمانگاه طبقه اول در دسترس است.", steps: [
      { corr: "is available", dist: ["are available", "am available", "be available", "has available"], trap: { text: "are available", exp: "فاعل مفرد The doctor با is به کار می‌رود." } },
      { corr: "on the first floor.", dist: ["in the first floor.", "at first floor.", "to first floor.", "by first floor."] }
    ]},
    { prompt: "We", trans: "ما از خدمات پذیرایی این رستوران بسیار راضی هستیم.", steps: [
      { corr: "are completely satisfied", dist: ["is completely satisfied", "am satisfied", "be satisfied", "satisfied"], trap: { text: "is completely satisfied", exp: "ضمیر we جمع است و با are می‌آید." } },
      { corr: "with the restaurant service.", dist: ["from restaurant service.", "of the restaurant.", "by restaurant.", "at restaurant."] }
    ]},
    { prompt: "The flight to Paris", trans: "پرواز به پاریس به موقع و آماده سوار شدن است.", steps: [
      { corr: "is on time", dist: ["are on time", "am on time", "be on time", "has on time"], trap: { text: "are on time", exp: "فاعل The flight مفرد است." } },
      { corr: "for immediate boarding.", dist: ["to boarding immediate.", "at boarding.", "for board.", "with boarding."] }
    ]},
    { prompt: "Alex and I", trans: "من و الکس در این پروژه تحقیقاتی همکار هستیم.", steps: [
      { corr: "are colleagues", dist: ["am colleagues", "is colleagues", "be colleagues", "colleagues"], trap: { text: "am colleagues", exp: "ترکیب Alex and I یک فاعل جمع (ما) است و فعل are می‌گیرد نه am." } },
      { corr: "on this research project.", dist: ["in this research project.", "at project research.", "for project this.", "to project."] }
    ]},
    { prompt: "The red car", trans: "ماشین قرمز مال برادر کوچکتر من است.", steps: [
      { corr: "is my younger brother's", dist: ["are my younger brother's", "am brother's", "be brother's", "brother's"], trap: { text: "are my younger brother's", exp: "فاعل ماشین مفرد است." } },
      { corr: "favorite vehicle.", dist: ["favorited vehicle.", "vehicles favorite.", "the favorite.", "favorite."] }
    ]},
    { prompt: "You", trans: "شما بازیکن شماره ده در تیم دانشگاه ما هستید.", steps: [
      { corr: "are the best player", dist: ["is the best player", "am the best player", "be player", "best player"], trap: { text: "is the best player", exp: "ضمیر you همیشه با are می‌آید، حتی وقتی به یک نفر اشاره دارد." } },
      { corr: "on our university team.", dist: ["in university team.", "at team university.", "of our team.", "to university team."] }
    ]},
    { prompt: "The weather", trans: "هوا در کوهستان امروز بسیار سرد و مه‌آلود است.", steps: [
      { corr: "is extremely cold", dist: ["are extremely cold", "am cold", "be cold", "has cold"], trap: { text: "are extremely cold", exp: "کلمه weather غیرقابل شمارش و مفرد است و با is می‌آید." } },
      { corr: "in the mountains today.", dist: ["at mountains today.", "on the mountains.", "to mountains.", "by mountains."] }
    ]},
    { prompt: "My parents", trans: "والدین من به موفقیت تحصیلی فرزندشان افتخار می‌کنند.", steps: [
      { corr: "are very proud", dist: ["is very proud", "am proud", "be proud", "has proud"], trap: { text: "is very proud", exp: "کلمه parents جمع است و با are می‌آید." } },
      { corr: "of my academic success.", dist: ["from my success.", "for my success.", "with my success.", "to my success."] }
    ]},
    { prompt: "This cup of tea", trans: "این فنجان چای خیلی داغ و تازه است.", steps: [
      { corr: "is fresh and hot,", dist: ["are fresh and hot,", "am fresh,", "be fresh,", "has fresh,"], trap: { text: "are fresh and hot,", exp: "فاعل this cup of tea مفرد است." } },
      { corr: "so drink it carefully.", dist: ["so drink carefully.", "drink it careful.", "to drink it.", "for drink it."] }
    ]},
    { prompt: "The keys", trans: "کلیدها درست روی میز جلوی در ورودی هستند.", steps: [
      { corr: "are right on the table", dist: ["is right on the table", "am on the table", "be on table", "was on table"], trap: { text: "is right on the table", exp: "فاعل keys جمع است و are می‌خواهد." } },
      { corr: "near the front entrance.", dist: ["next front entrance.", "at front entrance.", "to entrance front.", "by front."] }
    ]},
    { prompt: "Her apartment", trans: "آپارتمان او در طبقه پنجم یک برج شیک است.", steps: [
      { corr: "is situated", dist: ["are situated", "am situated", "be situated", "situated"], trap: { text: "are situated", exp: "آپارتمان مفرد است." } },
      { corr: "on the fifth floor.", dist: ["in the fifth floor.", "at fifth floor.", "to fifth floor.", "by floor fifth."] }
    ]},
    { prompt: "The museum tickets", trans: "بلیط‌های موزه برای کودکان زیر ده سال رایگان هستند.", steps: [
      { corr: "are completely free", dist: ["is completely free", "am free", "be free", "has free"], trap: { text: "is completely free", exp: "کلمه tickets جمع است." } },
      { corr: "for children under ten.", dist: ["to children under ten.", "at children under ten.", "of children.", "for children ten under."] }
    ]},
    { prompt: "I", trans: "من اهل شیراز هستم و عاشق آثار تاریخی باستانی‌ام.", steps: [
      { corr: "am from Shiraz", dist: ["is from Shiraz", "are from Shiraz", "be from Shiraz", "come from Shiraz"], trap: { text: "is from Shiraz", exp: "با ضمیر I فقط am به کار می‌رود." } },
      { corr: "and I love historical sites.", dist: ["and love history.", "and loving historical.", "and loves history.", "and to love sites."] }
    ]}
  ],

  // Stage 2: Do & Does Question Matrix
  2: [
    { prompt: "Does your father", trans: "آیا پدر شما در یک بیمارستان بزرگ کار می‌کند؟", steps: [
      { corr: "work", dist: ["works", "working", "worked", "to work"], trap: { text: "works", exp: "بعد از Does فعل اصلی باید به شکل ساده (work) بیاید و نباید s بگیرد." } },
      { corr: "at the central hospital?", dist: ["in central hospital?", "on central hospital?", "to hospital central?", "at hospital the?"] }
    ]},
    { prompt: "Do the students", trans: "آیا دانش‌آموزان هر روز بعد از کلاس کتاب می‌خوانند؟", steps: [
      { corr: "read English books", dist: ["reads English books", "reading English books", "readed books", "to read books"], trap: { text: "reads English books", exp: "فاعل students جمع است و بعد از Do فعل ساده می‌آید." } },
      { corr: "after their afternoon classes?", dist: ["after their classes afternoon?", "in afternoon classes?", "for classes afternoon?", "at classes?"] }
    ]},
    { prompt: "Does she", trans: "آیا او به نواختن پیانو در اوقات فراغت علاقه دارد؟", steps: [
      { corr: "enjoy playing", dist: ["enjoys playing", "enjoy to play", "enjoyed playing", "enjoy play"], trap: { text: "enjoys playing", exp: "پس از Does فعل اصلی s نمی‌گیرد." } },
      { corr: "the piano in her free time?", dist: ["piano in free time?", "the piano on free time?", "to piano in time?", "with piano in time?"] }
    ]},
    { prompt: "Do you", trans: "آیا شما هر روز صبح با اتوبوس به محل کار می‌روید؟", steps: [
      { corr: "take the bus", dist: ["takes the bus", "taking the bus", "took the bus", "to take bus"], trap: { text: "takes the bus", exp: "با ضمیر you فعل کمکی Do و شکل ساده take می‌آید." } },
      { corr: "to work every morning?", dist: ["for work every morning?", "at work morning?", "on work mornings?", "to working mornings?"] }
    ]},
    { prompt: "Does this shop", trans: "آیا این مغازه در روزهای جمعه کفش‌های ورزشی می‌فروشد؟", steps: [
      { corr: "sell athletic shoes", dist: ["sells athletic shoes", "selling shoes", "selled shoes", "to sell shoes"], trap: { text: "sells athletic shoes", exp: "بعد از Does فعل sell نباید s بگیرد." } },
      { corr: "on Friday afternoons?", dist: ["in Friday afternoons?", "at Friday afternoons?", "for Fridays afternoon?", "on Fridays afternoons?"] }
    ]},
    { prompt: "Do your parents", trans: "آیا والدین شما در این محله آرام زندگی می‌کنند؟", steps: [
      { corr: "live in", dist: ["lives in", "living in", "lived in", "to live in"], trap: { text: "lives in", exp: "کلمه parents جمع است و بعد از Do فعل live ساده می‌آید." } },
      { corr: "this peaceful neighborhood?", dist: ["this neighborhood peaceful?", "in neighborhood this?", "at this neighborhood?", "to this neighborhood?"] }
    ]},
    { prompt: "Does David", trans: "آیا دیوید زبان آلمانی را به روانی صحبت می‌کند؟", steps: [
      { corr: "speak German", dist: ["speaks German", "speaking German", "spoke German", "to speak German"], trap: { text: "speaks German", exp: "با وجود Does فعل speak ساده می‌ماند." } },
      { corr: "fluently with his clients?", dist: ["fluent with clients?", "in fluent with clients?", "with clients fluent?", "fluently clients?"] }
    ]},
    { prompt: "Do we", trans: "آیا ما زمان کافی برای تمام کردن پروژه داریم؟", steps: [
      { corr: "have enough time", dist: ["has enough time", "having time", "had enough time", "to have time"], trap: { text: "has enough time", exp: "با فاعل we فعل have می‌آید نه has." } },
      { corr: "to complete the project?", dist: ["for complete project?", "in completing project?", "to completing project?", "for project complete?"] }
    ]},
    { prompt: "Does the train", trans: "آیا قطار قبل از ساعت نه شب به ایستگاه می‌رسد؟", steps: [
      { corr: "arrive at the station", dist: ["arrives at station", "arriving at station", "arrived at station", "to arrive station"], trap: { text: "arrives at station", exp: "پس از Does فعل بدون s می‌آید." } },
      { corr: "before nine o'clock tonight?", dist: ["before nine at night?", "in nine o'clock?", "on nine tonight?", "at nine night?"] }
    ]},
    { prompt: "Do they", trans: "آیا آن‌ها قهوه داغ را به چای سبز ترجیح می‌دهند؟", steps: [
      { corr: "prefer hot coffee", dist: ["prefers hot coffee", "preferring coffee", "preferred coffee", "to prefer coffee"], trap: { text: "prefers hot coffee", exp: "با ضمیر they فعل prefer بدون s می‌آید." } },
      { corr: "to green tea?", dist: ["than green tea?", "from green tea?", "with green tea?", "over to green tea?"] }
    ]},
    { prompt: "Does Emily", trans: "آیا امیلی آخر هفته‌ها به مادرش در آشپزخانه کمک می‌کند؟", steps: [
      { corr: "help her mother", dist: ["helps her mother", "helping her mother", "helped her mother", "to help mother"], trap: { text: "helps her mother", exp: "حضور Does باعث حذف s از انتهای help می‌شود." } },
      { corr: "with the cooking on weekends?", dist: ["at cooking weekends?", "in the cooking weekend?", "for cooking weekends?", "with cooking in weekends?"] }
    ]},
    { prompt: "Do you", trans: "آیا شما هر شب قبل از خواب اخبار ورزشی را تماشا می‌کنید؟", steps: [
      { corr: "watch the sports news", dist: ["watches sports news", "watching news", "watched sports news", "to watch news"], trap: { text: "watches sports news", exp: "فاعل you فعل کمکی Do و فعل ساده watch می‌خواهد." } },
      { corr: "before going to bed?", dist: ["before to go bed?", "before go to bed?", "before you bed?", "in going to bed?"] }
    ]},
    { prompt: "Does Mr. Watson", trans: "آیا آقای واتسون در دانشگاه تاریخ تدریس می‌کند؟", steps: [
      { corr: "teach world history", dist: ["teaches world history", "teaching history", "taught history", "to teach history"], trap: { text: "teaches world history", exp: "بعد از Does شکل ساده teach درست است." } },
      { corr: "at the state university?", dist: ["in state university?", "on the university?", "to state university?", "with university?"] }
    ]},
    { prompt: "Do the children", trans: "آیا بچه‌ها بازی‌های فکری را در خانه دوست دارند؟", steps: [
      { corr: "like playing board games", dist: ["likes playing board games", "liking board games", "liked board games", "to like games"], trap: { text: "likes playing board games", exp: "فاعل children جمع است و like می‌گیرد." } },
      { corr: "on rainy days?", dist: ["in rainy days?", "at rainy days?", "for rainy days?", "during days rainy?"] }
    ]},
    { prompt: "Does your sister", trans: "آیا خواهرت هر روز صبح پیاده‌روی می‌کند؟", steps: [
      { corr: "walk to work", dist: ["walks to work", "walking to work", "walked to work", "to walk work"], trap: { text: "walks to work", exp: "بعد از Does فعل walk بدون s به کار می‌رود." } },
      { corr: "instead of taking a taxi?", dist: ["instead taking taxi?", "instead of take taxi?", "in place taxi?", "without taxi take?"] }
    ]},
    { prompt: "Do you", trans: "آیا شما معنی این کلمه جدید را می‌دانید؟", steps: [
      { corr: "know the definition", dist: ["knows definition", "knowing definition", "knew definition", "to know definition"], trap: { text: "knows definition", exp: "با you فعل know ساده است." } },
      { corr: "of this vocabulary word?", dist: ["from this word?", "to this word?", "about word this?", "for word this?"] }
    ]},
    { prompt: "Does he", trans: "آیا او آپارتمان خود را مرتب و تمیز نگه می‌دارد؟", steps: [
      { corr: "keep his room clean", dist: ["keeps his room clean", "keeping room clean", "kept room clean", "to keep room"], trap: { text: "keeps his room clean", exp: "بعد از Does فعل keep بدون s می‌آید." } },
      { corr: "throughout the week?", dist: ["during the week?", "along the week?", "over the week?", "in the week all?"] }
    ]},
    { prompt: "Do they", trans: "آیا آن‌ها تکالیف خود را با دقت انجام می‌دهند؟", steps: [
      { corr: "do their homework", dist: ["does their homework", "doing homework", "did homework", "to do homework"], trap: { text: "does their homework", exp: "فعل اصلی do با فاعل they می‌آید نه does." } },
      { corr: "carefully every afternoon?", dist: ["careful every afternoon?", "in careful afternoon?", "with care afternoons?", "carefully in afternoon?"] }
    ]},
    { prompt: "Does this bus", trans: "آیا این اتوبوس مستقیماً به فرودگاه بین‌المللی می‌رود؟", steps: [
      { corr: "go directly", dist: ["goes directly", "going directly", "went directly", "to go directly"], trap: { text: "goes directly", exp: "با حضور Does فعل go ساده به کار می‌رود." } },
      { corr: "to the international airport?", dist: ["towards airport international?", "for airport international?", "at international airport?", "in the airport?"] }
    ]},
    { prompt: "Do we", trans: "آیا ما نیاز داریم این سند را امضا کنیم؟", steps: [
      { corr: "need to sign", dist: ["needs to sign", "needing sign", "needed to sign", "to need sign"], trap: { text: "needs to sign", exp: "با we فعل need بدون s می‌آید." } },
      { corr: "this official document now?", dist: ["document official now?", "this document in now?", "for document now?", "at document now?"] }
    ]}
  ],

  // Stage 3: Adverbs of Frequency & Position (always, usually, often, never)
  3: [
    { prompt: "He", trans: "او همیشه قبل از ساعت هفت صبح صبحانه می‌خورد.", steps: [
      { corr: "always eats breakfast", dist: ["eats always breakfast", "is always eat breakfast", "always eat breakfast", "always eating breakfast"], trap: { text: "eats always breakfast", exp: "قید تکرار always باید قبل از فعل اصلی قرار بگیرد." } },
      { corr: "before seven in the morning.", dist: ["before seven morning.", "at seven morning.", "before of seven.", "to seven in morning."] }
    ]},
    { prompt: "She", trans: "او معمولاً برای رسیدن به محل کار با مترو سفر می‌کند.", steps: [
      { corr: "usually travels by subway", dist: ["travels usually by subway", "is usually travel by subway", "usually travel by subway", "usually traveling"], trap: { text: "travels usually by subway", exp: "قید تکرار usually باید قبل از فعل اصلی travels بیاید." } },
      { corr: "to avoid traffic jams.", dist: ["for avoid traffic jams.", "to avoiding traffic.", "in avoiding traffic.", "so avoid traffic."] }
    ]},
    { prompt: "They", trans: "آن‌ها اغلب در تعطیلات آخر هفته به دیدن مادربزرگ خود می‌روند.", steps: [
      { corr: "often visit their grandmother", dist: ["visit often their grandmother", "are often visit grandmother", "often visits grandmother", "often visiting grandmother"], trap: { text: "visit often their grandmother", exp: "قید often باید قبل از فعل اصلی visit بیاید." } },
      { corr: "during the weekend holidays.", dist: ["at weekend holidays.", "in the holidays weekend.", "for weekend holiday.", "on holidays weekend."] }
    ]},
    { prompt: "My brother", trans: "برادرم هرگز نوشیدنی‌های گازدار یا شیرین نمی‌نوشد.", steps: [
      { corr: "never drinks sugary sodas", dist: ["drinks never sodas", "is never drink sodas", "never drink sodas", "never drinking sodas"], trap: { text: "never drink sodas", exp: "با وجود never، فعل برای سوم شخص مفرد همچنان باید s بگیرد (drinks)." } },
      { corr: "because of his health.", dist: ["for his health.", "from his health.", "with his health.", "by his health."] }
    ]},
    { prompt: "We", trans: "ما گاهی اوقات پنجشنبه‌شب‌ها با هم پیتزا درست می‌کنیم.", steps: [
      { corr: "sometimes make homemade pizza", dist: ["make sometimes pizza", "are sometimes make pizza", "sometimes makes pizza", "sometimes making pizza"], trap: { text: "sometimes makes pizza", exp: "فاعل we جمع است و فعل make بدون s می‌آید." } },
      { corr: "with fresh ingredients.", dist: ["by fresh ingredients.", "from fresh ingredients.", "with ingredients fresh.", "of fresh ingredients."] }
    ]},
    { prompt: "The students", trans: "دانش‌آموزان همیشه قبل از شروع امتحان به موقع حاضر می‌شوند.", steps: [
      { corr: "are always on time", dist: ["always are on time", "always be on time", "are on time always", "always is on time"], trap: { text: "always are on time", exp: "قیدهای تکرار همیشه بعد از فعل to be (are always) قرار می‌گیرند نه قبل از آن." } },
      { corr: "for the morning exam.", dist: ["to morning exam.", "in morning exam.", "at exam morning.", "for exam the morning."] }
    ]},
    { prompt: "Our manager", trans: "مدیر ما به ندرت در جلسات مهم رسمی عصبانی می‌شود.", steps: [
      { corr: "rarely gets angry", dist: ["gets rarely angry", "is rarely get angry", "rarely get angry", "rarely getting angry"], trap: { text: "gets rarely angry", exp: "قید rarely قبل از فعل اصلی gets قرار می‌گیرد." } },
      { corr: "during important meetings.", dist: ["in meetings important.", "at important meeting.", "on important meetings.", "for important meetings."] }
    ]},
    { prompt: "I", trans: "من معمولاً شب‌ها قبل از خواب یک رمان کوتاه می‌خوانم.", steps: [
      { corr: "usually read a novel", dist: ["read usually a novel", "am usually read a novel", "usually reads a novel", "usually reading a novel"], trap: { text: "usually reads a novel", exp: "با فاعل I فعل read بدون s می‌آید." } },
      { corr: "before turning off the lamp.", dist: ["before turn off lamp.", "before to turn lamp.", "before of turning lamp.", "in turning lamp off."] }
    ]},
    { prompt: "David", trans: "دیوید همیشه پس از اتمام کار ورزشی دوش می‌گیرد.", steps: [
      { corr: "always takes a shower", dist: ["takes always a shower", "is always take a shower", "always take a shower", "always taking shower"], trap: { text: "always take a shower", exp: "دیوید مفرد است و فعل takes با s می‌آید." } },
      { corr: "after his workout session.", dist: ["after workout session his.", "at workout session.", "in his workout.", "for workout session."] }
    ]},
    { prompt: "They", trans: "آن‌ها هرگز قرارهای کاری خود را بدون دلیل موجه لغو نمی‌کنند.", steps: [
      { corr: "never cancel appointments", dist: ["cancel never appointments", "are never cancel appointments", "never cancels appointments", "never cancelling"], trap: { text: "never cancels appointments", exp: "فاعل they جمع است و cancel بدون s می‌آید." } },
      { corr: "without a valid reason.", dist: ["without reason valid.", "no with valid reason.", "without of valid reason.", "with no valid reasons."] }
    ]},
    { prompt: "Sarah", trans: "سارا اغلب در کتابخانه مرکزی به سایر دانش‌آموزان کمک می‌کند.", steps: [
      { corr: "often helps other students", dist: ["helps often other students", "is often help students", "often help students", "often helping students"], trap: { text: "helps often other students", exp: "قید often قبل از helps می‌نشیند." } },
      { corr: "with their math homework.", dist: ["in their math homework.", "for math homework.", "at their homework.", "to math homework."] }
    ]},
    { prompt: "You", trans: "شما همیشه نسبت به همه همکاران در محل کار مؤدب هستید.", steps: [
      { corr: "are always polite", dist: ["always are polite", "always be polite", "are polite always", "is always polite"], trap: { text: "always are polite", exp: "قید always پس از فعل to be (are always) قرار می‌گیرد." } },
      { corr: "to your office colleagues.", dist: ["with your colleagues.", "at office colleagues.", "for office colleagues.", "towards to colleagues."] }
    ]},
    { prompt: "The children", trans: "بچه‌ها معمولاً بعد از اتمام تکالیف در پارک بازی می‌کنند.", steps: [
      { corr: "usually play outdoors", dist: ["play usually outdoors", "are usually play outdoors", "usually plays outdoors", "usually playing outdoors"], trap: { text: "usually plays outdoors", exp: "کلمه children جمع است و play بدون s می‌آید." } },
      { corr: "when the weather is sunny.", dist: ["when weather sunny.", "if weather sunny.", "while sunny weather.", "when the sunny weather."] }
    ]},
    { prompt: "My father", trans: "پدرم به ندرت در طول هفته تلویزیون تماشا می‌کند.", steps: [
      { corr: "seldom watches television", dist: ["watches seldom television", "is seldom watch television", "seldom watch television", "seldom watching television"], trap: { text: "watches seldom television", exp: "قید seldom قبل از فعل اصلی watches می‌آید." } },
      { corr: "on weekday evenings.", dist: ["in weekday evenings.", "at weekday evenings.", "for weekday evening.", "during evenings weekday."] }
    ]},
    { prompt: "We", trans: "ما اغلب برای صرف ناهار به این رستوران سنتی می‌آییم.", steps: [
      { corr: "often eat lunch here", dist: ["eat often lunch here", "are often eat lunch", "often eats lunch here", "often eating lunch here"], trap: { text: "eat often lunch here", exp: "قید often قبل از eat می‌آید." } },
      { corr: "because the food is delicious.", dist: ["for food delicious.", "because food delicious.", "since of delicious food.", "due to food delicious."] }
    ]},
    { prompt: "The buses", trans: "اتوبوس‌ها در این شهر معمولاً سر وقت به ایستگاه می‌رسند.", steps: [
      { corr: "usually arrive punctually", dist: ["arrive usually punctually", "are usually arrive", "usually arrives punctually", "usually arriving"], trap: { text: "usually arrives punctually", exp: "فاعل buses جمع است و arrive بدون s می‌آید." } },
      { corr: "at every bus stop.", dist: ["in every bus stop.", "to every bus stop.", "on every bus stop.", "by every stop bus."] }
    ]},
    { prompt: "She", trans: "او هرگز در هوای سرد بدون پالتو گرم بیرون نمی‌رود.", steps: [
      { corr: "never goes outside", dist: ["goes never outside", "is never go outside", "never go outside", "never going outside"], trap: { text: "never go outside", exp: "با وجود never، برای فاعل she فعل goes با es می‌آید." } },
      { corr: "without a warm jacket.", dist: ["without jacket warm.", "no with warm jacket.", "without of jacket.", "with no jacket warm."] }
    ]},
    { prompt: "I", trans: "من گاهی اوقات آخر هفته‌ها تا دیروقت بیدار می‌مانم.", steps: [
      { corr: "sometimes stay up late", dist: ["stay sometimes up late", "am sometimes stay up", "sometimes stays up late", "sometimes staying late"], trap: { text: "stay sometimes up late", exp: "قید sometimes قبل از stay قرار می‌گیرد." } },
      { corr: "to watch action films.", dist: ["for watch action films.", "to watching films.", "in watching films.", "for films action."] }
    ]},
    { prompt: "Mr. Brown", trans: "آقای براون همیشه قبل از شروع سخنرانی یادداشت‌هایش را مرور می‌کند.", steps: [
      { corr: "always reviews his notes", dist: ["reviews always his notes", "is always review notes", "always review his notes", "always reviewing notes"], trap: { text: "reviews always his notes", exp: "قید always قبل از reviews می‌آید." } },
      { corr: "before giving a speech.", dist: ["before give speech.", "before to give speech.", "before of speech.", "in giving speech."] }
    ]},
    { prompt: "They", trans: "آن‌ها معمولاً قهوه صبحگاهی خود را بدون شکر می‌نوشند.", steps: [
      { corr: "usually drink coffee", dist: ["drink usually coffee", "are usually drink coffee", "usually drinks coffee", "usually drinking coffee"], trap: { text: "usually drinks coffee", exp: "با فاعل they فعل drink بدون s می‌آید." } },
      { corr: "without adding any sugar.", dist: ["without add any sugar.", "without to add sugar.", "with no adding sugar.", "without of sugar."] }
    ]}
  ],

  // Stage 4: Can & Can't for Ability & Permission
  4: [
    { prompt: "My sister", trans: "خواهر من می‌تواند به سه زبان خارجی به روانی صحبت کند.", steps: [
      { corr: "can speak", dist: ["can speaks", "can to speak", "cans speak", "is can speak"], trap: { text: "can speaks", exp: "بعد از فعل کمکی can، فعل اصلی باید به شکل ساده و بدون s سوم شخص بیاید." } },
      { corr: "three foreign languages fluently.", dist: ["three foreign languages fluent.", "with three languages.", "to three languages.", "three languages of fluent."] }
    ]},
    { prompt: "David", trans: "دیوید می‌تواند گیتار آکوستیک را خیلی خوب بنوازد.", steps: [
      { corr: "can play the guitar", dist: ["can plays the guitar", "can to play guitar", "cans play guitar", "is can play guitar"], trap: { text: "can to play guitar", exp: "بعد از can هرگز حرف اضافه to نمی‌آید؛ فقط شکل ساده فعل (bare infinitive)." } },
      { corr: "with great musical skill.", dist: ["with skill musical.", "in great skill.", "by skill musical.", "of great skill."] }
    ]},
    { prompt: "The doctor", trans: "پزشک می‌تواند امروز بعدازظهر ساعت چهار شما را ویزیت کند.", steps: [
      { corr: "can see you", dist: ["can sees you", "can to see you", "cans see you", "is can see you"], trap: { text: "can sees you", exp: "بعد از can فعل see نباید s بگیرد." } },
      { corr: "at four o'clock this afternoon.", dist: ["in four o'clock afternoon.", "on four o'clock.", "to four afternoon.", "by four afternoon."] }
    ]},
    { prompt: "I", trans: "من نمی‌توانم در آب عمیق بدون جلیقه نجات شنا کنم.", steps: [
      { corr: "cannot swim safely", dist: ["cannot swims safely", "cannot to swim", "cannots swim", "am cannot swim"], trap: { text: "cannot to swim", exp: "بعد از cannot فعل به شکل ساده swim می‌آید." } },
      { corr: "in deep ocean water.", dist: ["on deep ocean water.", "at deep water ocean.", "to ocean deep water.", "inside ocean."] }
    ]},
    { prompt: "Sarah", trans: "سارا می‌تواند کیک‌های شکلاتی خوشمزه‌ای برای مهمانی‌ها بپزد.", steps: [
      { corr: "can bake delicious cakes", dist: ["can bakes delicious cakes", "can to bake cakes", "cans bake cakes", "is can bake"], trap: { text: "can bakes delicious cakes", exp: "فعل bake بعد از can بدون s می‌آید." } },
      { corr: "for the birthday celebration.", dist: ["to birthday celebration.", "in birthday celebration.", "with birthday party.", "at celebration party."] }
    ]},
    { prompt: "We", trans: "ما نمی‌توانیم این درب چوبی سنگین را بدون کلید باز کنیم.", steps: [
      { corr: "can't open this door", dist: ["can't opens this door", "can't to open door", "can'ts open door", "are can't open"], trap: { text: "can't to open door", exp: "بعد از can't آوردن to اشتباه است." } },
      { corr: "without the master key.", dist: ["without of master key.", "no with key.", "without key master.", "with no master key."] }
    ]},
    { prompt: "Alex", trans: "الکس می‌تواند پنج کیلومتر را در بیست دقیقه بدود.", steps: [
      { corr: "can run five kilometers", dist: ["can runs five kilometers", "can to run kilometers", "cans run five kilometers", "is can run"], trap: { text: "can runs five kilometers", exp: "بعد از can شکل ساده run صحیح است." } },
      { corr: "in under twenty minutes.", dist: ["under of twenty minutes.", "at twenty minutes.", "on twenty minutes.", "by under minutes."] }
    ]},
    { prompt: "You", trans: "شما می‌توانید در طول امتحان از فرهنگ لغت من استفاده کنید.", steps: [
      { corr: "can use my dictionary", dist: ["can uses my dictionary", "can to use dictionary", "cans use dictionary", "are can use"], trap: { text: "can uses my dictionary", exp: "با can فعل use ساده به کار می‌رود." } },
      { corr: "during the final examination.", dist: ["in examination final.", "at final exam.", "on final exam.", "for examination final."] }
    ]},
    { prompt: "The mechanic", trans: "مکانیک می‌تواند موتور ماشین شما را تا فردا صبح تعمیر کند.", steps: [
      { corr: "can repair the engine", dist: ["can repairs the engine", "can to repair engine", "cans repair engine", "is can repair"], trap: { text: "can repairs the engine", exp: "بعد از can فعل repair بدون s می‌آید." } },
      { corr: "before tomorrow morning.", dist: ["before of tomorrow.", "to tomorrow morning.", "in tomorrow morning.", "at tomorrow morning."] }
    ]},
    { prompt: "She", trans: "او نمی‌تواند عینکش را هیچ‌کجا در اتاق نشیمن پیدا کند.", steps: [
      { corr: "can't find her glasses", dist: ["can't finds her glasses", "can't to find glasses", "can'ts find glasses", "is can't find"], trap: { text: "can't finds her glasses", exp: "حتی برای سوم شخص مفرد she، بعد از can't فعل find بدون s می‌آید." } },
      { corr: "anywhere in the apartment.", dist: ["somewhere in apartment.", "nowhere in apartment.", "everywhere of apartment.", "at apartment nowhere."] }
    ]},
    { prompt: "Can you", trans: "آیا می‌توانید صدای سوت قطار را از اینجا بشنوید؟", steps: [
      { corr: "hear the train whistle", dist: ["hears the train whistle", "to hear the train", "hearing train whistle", "heared the train"], trap: { text: "hears the train whistle", exp: "در سوالات با Can فعل اصلی ساده می‌ماند." } },
      { corr: "from this distance?", dist: ["of this distance?", "in this distance?", "at distance this?", "to this distance?"] }
    ]},
    { prompt: "They", trans: "آن‌ها نمی‌توانند به خاطر ترافیک سنگین در جلسه شرکت کنند.", steps: [
      { corr: "cannot attend the meeting", dist: ["cannot attends the meeting", "cannot to attend meeting", "cannots attend", "are cannot attend"], trap: { text: "cannot to attend meeting", exp: "بعد از cannot فعل attend بدون to می‌آید." } },
      { corr: "because of heavy traffic.", dist: ["because heavy traffic.", "due to of traffic.", "from traffic heavy.", "for heavy traffic."] }
    ]},
    { prompt: "My grandfather", trans: "پدربزرگم در هشتاد سالگی هنوز می‌تواند بدون عینک کتاب بخواند.", steps: [
      { corr: "can still read books", dist: ["can still reads books", "can to read still", "cans still read", "is can still read"], trap: { text: "can still reads books", exp: "بعد از can فعل read بدون s می‌آید." } },
      { corr: "without reading glasses.", dist: ["without of glasses.", "no with glasses.", "without glasses reading.", "with no glasses."] }
    ]},
    { prompt: "We", trans: "ما می‌توانیم روز پنجشنبه در کتابخانه مرکزی ملاقات کنیم.", steps: [
      { corr: "can meet together", dist: ["can meets together", "can to meet together", "cans meet together", "are can meet"], trap: { text: "can to meet together", exp: "بعد از can فعل meet بدون to است." } },
      { corr: "at the central library.", dist: ["in central library.", "on central library.", "to library central.", "by central library."] }
    ]},
    { prompt: "He", trans: "او نمی‌تواند این معادله پیچیده ریاضی را حل کند.", steps: [
      { corr: "can't solve this equation", dist: ["can't solves this equation", "can't to solve equation", "can'ts solve equation", "is can't solve"], trap: { text: "can't solves this equation", exp: "فعل solve بعد از can't بدون s می‌آید." } },
      { corr: "without a calculator.", dist: ["without of calculator.", "no with calculator.", "with no calculator.", "without calculator a."] }
    ]},
    { prompt: "Can I", trans: "آیا می‌توانم چتر بارانی شما را برای یک ساعت قرض بگیرم؟", steps: [
      { corr: "borrow your umbrella", dist: ["borrows your umbrella", "to borrow your umbrella", "borrowing umbrella", "borrowed umbrella"], trap: { text: "to borrow your umbrella", exp: "بعد از Can I شکل ساده borrow بدون to می‌آید." } },
      { corr: "for just an hour?", dist: ["to just an hour?", "in just hour?", "at just hour?", "during hour an?"] }
    ]},
    { prompt: "The children", trans: "بچه‌ها می‌توانند با خیال راحت در پارک دوچرخه‌سواری کنند.", steps: [
      { corr: "can ride their bikes", dist: ["can rides their bikes", "can to ride bikes", "cans ride bikes", "are can ride"], trap: { text: "can to ride bikes", exp: "بعد از can فعل ride ساده است." } },
      { corr: "safely in the park.", dist: ["safe in the park.", "in park safely.", "with safely in park.", "safely to park."] }
    ]},
    { prompt: "She", trans: "او به دلیل ضعف بینایی نمی‌تواند در شب رانندگی کند.", steps: [
      { corr: "cannot drive a vehicle", dist: ["cannot drives a vehicle", "cannot to drive vehicle", "cannots drive", "is cannot drive"], trap: { text: "cannot drives a vehicle", exp: "بعد از cannot فعل drive بدون s می‌آید." } },
      { corr: "at night on dark roads.", dist: ["in night on roads.", "on night dark roads.", "to night dark.", "by night on dark."] }
    ]},
    { prompt: "You", trans: "شما می‌توانید چمدان‌های سنگین خود را در پذیرش هتل بگذارید.", steps: [
      { corr: "can leave your luggage", dist: ["can leaves your luggage", "can to leave luggage", "cans leave luggage", "are can leave"], trap: { text: "can leaves your luggage", exp: "بعد از can فعل leave ساده است." } },
      { corr: "at the front desk.", dist: ["in the front desk.", "on front desk.", "to front desk.", "by desk front."] }
    ]},
    { prompt: "Our team", trans: "تیم ما می‌تواند در مسابقه نهایی این شنبه پیروز شود.", steps: [
      { corr: "can win the championship", dist: ["can wins championship", "can to win championship", "cans win championship", "is can win"], trap: { text: "can wins championship", exp: "بعد از can فعل win ساده می‌آید." } },
      { corr: "this Saturday afternoon.", dist: ["in Saturday afternoon.", "on Saturday afternoon this.", "at Saturday afternoon.", "for Saturday afternoon."] }
    ]}
  ],

  // Stage 5: Prepositions of Time (In, On, At)
  5: [
    { prompt: "The concert starts", trans: "کنسرت در ساعت هشت و نیم شب جمعه آغاز می‌شود.", steps: [
      { corr: "at eight thirty", dist: ["in eight thirty", "on eight thirty", "for eight thirty", "to eight thirty"], trap: { text: "in eight thirty", exp: "برای ساعت‌های مشخص همیشه از حرف اضافه at استفاده می‌شود نه in." } },
      { corr: "on Friday evening.", dist: ["in Friday evening.", "at Friday evening.", "to Friday evening.", "for Friday evening."] }
    ]},
    { prompt: "My birthday is", trans: "تولد من در ماه سپتامبر و در فصل پاییز است.", steps: [
      { corr: "in September,", dist: ["on September,", "at September,", "for September,", "to September,"], trap: { text: "on September,", exp: "برای ماه‌های سال حرف اضافه in استفاده می‌شود." } },
      { corr: "during the autumn season.", dist: ["in season autumn.", "at autumn season.", "on autumn season.", "for season autumn."] }
    ]},
    { prompt: "The train departs", trans: "قطار رأس ساعت شش صبح روز دوشنبه حرکت می‌کند.", steps: [
      { corr: "at exactly six o'clock", dist: ["in exactly six o'clock", "on six o'clock", "for six o'clock", "to six o'clock"], trap: { text: "on six o'clock", exp: "برای ساعات دقیق حرف اضافه at الزامی است." } },
      { corr: "on Monday morning.", dist: ["in Monday morning.", "at Monday morning.", "to Monday morning.", "by Monday morning."] }
    ]},
    { prompt: "We always go skiing", trans: "ما همیشه در فصل زمستان که هوا برفی است به اسکی می‌رویم.", steps: [
      { corr: "in the winter season", dist: ["on winter season", "at winter season", "for winter season", "to winter season"], trap: { text: "on winter season", exp: "برای فصل‌ها حرف اضافه in به کار می‌رود." } },
      { corr: "when the snow is deep.", dist: ["while snow is deep.", "at snow is deep.", "in snow is deep.", "for snow is deep."] }
    ]},
    { prompt: "The museum is closed", trans: "موزه در روزهای دوشنبه برای تعمیرات تعطیل است.", steps: [
      { corr: "on Mondays", dist: ["in Mondays", "at Mondays", "for Mondays", "to Mondays"], trap: { text: "in Mondays", exp: "برای روزهای هفته حرف اضافه on استفاده می‌شود." } },
      { corr: "for regular maintenance.", dist: ["to regular maintenance.", "in maintenance regular.", "at maintenance.", "with maintenance."] }
    ]},
    { prompt: "I usually wake up", trans: "من معمولاً ساعت هفت صبح در طول هفته بیدار می‌شوم.", steps: [
      { corr: "at seven a.m.", dist: ["in seven a.m.", "on seven a.m.", "for seven a.m.", "to seven a.m."], trap: { text: "in seven a.m.", exp: "برای ساعت دقیق at به کار می‌رود." } },
      { corr: "on weekdays.", dist: ["in weekdays.", "at weekdays.", "for weekdays.", "to weekdays."] }
    ]},
    { prompt: "Leaves fall from trees", trans: "برگ‌ها در فصل پاییز از درختان می‌ریزند.", steps: [
      { corr: "in autumn", dist: ["on autumn", "at autumn", "for autumn", "to autumn"], trap: { text: "at autumn", exp: "برای فصل پاییز in به کار می‌رود." } },
      { corr: "creating golden paths.", dist: ["creates golden paths.", "created golden paths.", "to create paths.", "for creating paths."] }
    ]},
    { prompt: "The party begins", trans: "مهمانی در ساعت نه شب آغاز می‌شود.", steps: [
      { corr: "at nine o'clock", dist: ["in nine o'clock", "on nine o'clock", "for nine o'clock", "to nine o'clock"], trap: { text: "in nine o'clock", exp: "برای ساعت at می‌آید." } },
      { corr: "at night.", dist: ["in night.", "on night.", "to night.", "for night."] }
    ]},
    { prompt: "They got married", trans: "آن‌ها در سال ۲۰۱۵ در یک مراسم زیبا ازدواج کردند.", steps: [
      { corr: "in 2015", dist: ["on 2015", "at 2015", "for 2015", "to 2015"], trap: { text: "on 2015", exp: "برای سال‌ها حرف اضافه in استفاده می‌شود." } },
      { corr: "during a private ceremony.", dist: ["in ceremony private.", "at ceremony private.", "on private ceremony.", "for ceremony."] }
    ]},
    { prompt: "We have an English exam", trans: "ما روز چهارشنبه بعدازظهر امتحان انگلیسی داریم.", steps: [
      { corr: "on Wednesday", dist: ["in Wednesday", "at Wednesday", "for Wednesday", "to Wednesday"], trap: { text: "in Wednesday", exp: "برای روزهای هفته on استفاده می‌شود." } },
      { corr: "in the afternoon.", dist: ["on the afternoon.", "at the afternoon.", "to afternoon.", "for afternoon."] }
    ]},
    { prompt: "The stars shine brightly", trans: "ستاره‌ها در شب در آسمان تاریک می‌درخشند.", steps: [
      { corr: "at night", dist: ["in night", "on night", "for night", "to night"], trap: { text: "in night", exp: "برای شب عبارت ثابت at night صحیح است (نه in night)." } },
      { corr: "in the clear sky.", dist: ["on the clear sky.", "at clear sky.", "to clear sky.", "under sky clear."] }
    ]},
    { prompt: "The university opens", trans: "دانشگاه در ماه اکتبر برای ترم جدید باز می‌شود.", steps: [
      { corr: "in October", dist: ["on October", "at October", "for October", "to October"], trap: { text: "on October", exp: "برای نام ماه in می‌آید." } },
      { corr: "for the autumn semester.", dist: ["to autumn semester.", "in autumn semester.", "at semester autumn.", "on semester."] }
    ]},
    { prompt: "The store closes early", trans: "فروشگاه روزهای یکشنبه زودتر بسته می‌شود.", steps: [
      { corr: "on Sundays", dist: ["in Sundays", "at Sundays", "for Sundays", "to Sundays"], trap: { text: "in Sundays", exp: "برای روزهای یکشنبه on می‌آید." } },
      { corr: "at five in the afternoon.", dist: ["in five in afternoon.", "on five in afternoon.", "to five afternoon.", "for five afternoon."] }
    ]},
    { prompt: "I like reading books", trans: "من دوست دارم صبح‌ها با یک فنجان چای کتاب بخوانم.", steps: [
      { corr: "in the morning", dist: ["on the morning", "at the morning", "to the morning", "for morning"], trap: { text: "at the morning", exp: "برای اوقات روز in the morning صحیح است." } },
      { corr: "with a warm cup of tea.", dist: ["by warm cup of tea.", "of warm cup of tea.", "for cup of tea.", "to warm cup."] }
    ]},
    { prompt: "The flight lands", trans: "پرواز در ساعت یازده و چهل و پنج دقیقه به زمین می‌نشیند.", steps: [
      { corr: "at eleven forty-five", dist: ["in eleven forty-five", "on eleven forty-five", "for eleven forty-five", "to eleven forty-five"], trap: { text: "in eleven forty-five", exp: "برای ساعت دقیق at می‌آید." } },
      { corr: "at midnight.", dist: ["in midnight.", "on midnight.", "to midnight.", "for midnight."] }
    ]},
    { prompt: "Schools are closed", trans: "مدارس در فصل تابستان برای تعطیلات تعطیل هستند.", steps: [
      { corr: "in the summer", dist: ["on summer", "at summer", "for summer", "to summer"], trap: { text: "on summer", exp: "برای فصل تابستان in the summer می‌آید." } },
      { corr: "for holiday vacations.", dist: ["to holiday vacations.", "in vacations holiday.", "at holiday vacation.", "with vacations."] }
    ]},
    { prompt: "The clinic opens", trans: "درمانگاه ساعت هشت و نیم صبح باز می‌شود.", steps: [
      { corr: "at eight thirty a.m.", dist: ["in eight thirty a.m.", "on eight thirty a.m.", "for eight thirty a.m.", "to eight thirty a.m."], trap: { text: "in eight thirty a.m.", exp: "برای ساعت at به کار می‌رود." } },
      { corr: "every single weekday.", dist: ["in every weekday.", "on every weekday.", "at every weekday.", "for weekday every."] }
    ]},
    { prompt: "We celebrate New Year", trans: "ما سال نو را در روز اول ژانویه جشن می‌گیریم.", steps: [
      { corr: "on January first", dist: ["in January first", "at January first", "for January first", "to January first"], trap: { text: "in January first", exp: "وقتی روز مشخص ماه ذکر شود از on استفاده می‌شود." } },
      { corr: "with family fireworks.", dist: ["by family fireworks.", "from family fireworks.", "for family fireworks.", "to family fireworks."] }
    ]},
    { prompt: "He was born", trans: "او در سال ۱۹۹۸ در یک روستای کوچک به دنیا آمد.", steps: [
      { corr: "in 1998", dist: ["on 1998", "at 1998", "for 1998", "to 1998"], trap: { text: "on 1998", exp: "برای سال‌ها in به کار می‌رود." } },
      { corr: "in a quiet rural village.", dist: ["at quiet rural village.", "on quiet rural village.", "to quiet village.", "by village quiet."] }
    ]},
    { prompt: "The meeting is scheduled", trans: "جلسه برای ساعت ده صبح روز پنجشنبه برنامه‌ریزی شده است.", steps: [
      { corr: "for ten a.m. on Thursday", dist: ["for ten a.m. in Thursday", "at ten a.m. in Thursday", "in ten a.m. on Thursday", "on ten a.m. on Thursday"], trap: { text: "at ten a.m. in Thursday", exp: "برای روز پنجشنبه باید on Thursday باشد نه in Thursday." } },
      { corr: "in the conference room.", dist: ["on the conference room.", "at room conference.", "to conference room.", "by conference room."] }
    ]}
  ],

  // Stages 6 to 10 for A1
  6: [
    { prompt: "There", trans: "یک کتابخانه مدرن در دانشگاه ما وجود دارد.", steps: [
      { corr: "is a modern library", dist: ["are a modern library", "is modern libraries", "are modern library", "be a library"], trap: { text: "are a modern library", exp: "برای اسم مفرد a modern library از There is استفاده می‌شود." } },
      { corr: "on our university campus.", dist: ["in campus university.", "at university campus.", "to university campus.", "by campus university."] }
    ]},
    { prompt: "There", trans: "چندین صندلی راحت در اتاق انتظار وجود دارد.", steps: [
      { corr: "are several comfortable chairs", dist: ["is several comfortable chairs", "are a comfortable chair", "is chairs comfortable", "be several chairs"], trap: { text: "is several comfortable chairs", exp: "برای اسم جمع chairs باید There are بیاید." } },
      { corr: "in the doctor's waiting room.", dist: ["at waiting room.", "on waiting room.", "to waiting room.", "by waiting room."] }
    ]},
    { prompt: "Is there", trans: "آیا در این نزدیکی داروخانه‌ای باز است؟", steps: [
      { corr: "any pharmacy open", dist: ["some pharmacy open", "a pharmacies open", "pharmacies any open", "many pharmacy open"], trap: { text: "some pharmacy open", exp: "در سوالات معمولاً از any به جای some استفاده می‌شود." } },
      { corr: "near this city subway station?", dist: ["next this station?", "close of this station?", "near to this station?", "by station this?"] }
    ]},
    { prompt: "There", trans: "کمی شیر تازه در یخچال باقی مانده است.", steps: [
      { corr: "is some fresh milk", dist: ["are some fresh milk", "is many fresh milk", "are much fresh milk", "is a fresh milk"], trap: { text: "are some fresh milk", exp: "کلمه milk غیرقابل شمارش است و فعل مفرد is می‌گیرد." } },
      { corr: "inside the kitchen refrigerator.", dist: ["on kitchen refrigerator.", "at refrigerator kitchen.", "to kitchen refrigerator.", "by refrigerator."] }
    ]},
    { prompt: "Are there", trans: "آیا سوالات دیگری قبل از پایان کلاس وجود دارد؟", steps: [
      { corr: "any other questions", dist: ["some other questions", "a other questions", "any other question", "much questions"], trap: { text: "some other questions", exp: "در جملات سوالی Are there any questions درست است." } },
      { corr: "before we finish the lesson?", dist: ["before finish lesson?", "before to finish lesson?", "in finishing lesson?", "for lesson finish?"] }
    ]},
    { prompt: "There", trans: "هیچ آبی در بطری شیشه‌ای نیست.", steps: [
      { corr: "isn't any water left", dist: ["aren't any water left", "isn't some water left", "not is water left", "is no any water"], trap: { text: "aren't any water left", exp: "کلمه water مفرد و غیرقابل شمارش است." } },
      { corr: "in the glass bottle.", dist: ["on the glass bottle.", "at bottle glass.", "to bottle glass.", "by glass bottle."] }
    ]},
    { prompt: "There", trans: "سه کامپیوتر جدید در آزمایشگاه مدرسه هست.", steps: [
      { corr: "are three new computers", dist: ["is three new computers", "be three new computers", "are a three computers", "is computers new"], trap: { text: "is three new computers", exp: "فاعل three computers جمع است و are می‌خواهد." } },
      { corr: "in the science laboratory.", dist: ["at science laboratory.", "on laboratory science.", "to science laboratory.", "by laboratory."] }
    ]},
    { prompt: "There", trans: "یک درخت سیب بزرگ در حیاط خلوت ما هست.", steps: [
      { corr: "is a large apple tree", dist: ["are a large apple tree", "is large apple trees", "are apple tree", "be a large tree"], trap: { text: "are a large apple tree", exp: "برای اسم مفرد a tree از is استفاده می‌شود." } },
      { corr: "in our family backyard.", dist: ["at backyard family.", "on family backyard.", "to family backyard.", "by backyard."] }
    ]},
    { prompt: "Are there", trans: "آیا سیب‌های تازه‌ای در سبد میوه هست؟", steps: [
      { corr: "any fresh apples", dist: ["some fresh apples", "a fresh apples", "any apple fresh", "much fresh apples"], trap: { text: "some fresh apples", exp: "در سوالات جمع any apples به کار می‌رود." } },
      { corr: "in the kitchen fruit basket?", dist: ["on fruit basket?", "at fruit basket?", "to basket fruit?", "by fruit basket?"] }
    ]},
    { prompt: "There", trans: "ترافیک سنگینی در بزرگراه وجود دارد.", steps: [
      { corr: "is heavy traffic", dist: ["are heavy traffic", "is a heavy traffics", "are heavy traffics", "be heavy traffic"], trap: { text: "are heavy traffic", exp: "کلمه traffic غیرقابل شمارش است و is می‌گیرد." } },
      { corr: "on the main highway today.", dist: ["in main highway today.", "at main highway.", "to highway main.", "by highway today."] }
    ]},
    { prompt: "There", trans: "بچه‌های زیادی در پارک بازی می‌کنند.", steps: [
      { corr: "are many children playing", dist: ["is many children playing", "are much children playing", "is children many", "be many children"], trap: { text: "is many children playing", exp: "کلمه children اسم جمع است و are می‌خواهد." } },
      { corr: "near the water fountain.", dist: ["next fountain water.", "close of fountain.", "at water fountain.", "by fountain water."] }
    ]},
    { prompt: "Is there", trans: "آیا پمپ بنزینی در این جاده وجود دارد؟", steps: [
      { corr: "a gas station", dist: ["any gas stations", "some gas station", "gas station a", "many gas station"], trap: { text: "any gas stations", exp: "با Is there اسم مفرد a gas station می‌آید." } },
      { corr: "along this quiet highway?", dist: ["in this highway?", "at highway this?", "to quiet highway?", "by highway quiet?"] }
    ]},
    { prompt: "There", trans: "هیچ دارویی در این کشو باقی نمانده است.", steps: [
      { corr: "is no medicine left", dist: ["are no medicine left", "is not no medicine", "are not medicine", "be no medicine"], trap: { text: "are no medicine left", exp: "کلمه medicine غیرقابل شمارش است." } },
      { corr: "in the bathroom cabinet.", dist: ["on bathroom cabinet.", "at cabinet bathroom.", "to bathroom cabinet.", "by cabinet."] }
    ]},
    { prompt: "There", trans: "دو گربه سیاه روی دیوار حیاط نشسته‌اند.", steps: [
      { corr: "are two black cats", dist: ["is two black cats", "are a two cats", "is cats black", "be two black cats"], trap: { text: "is two black cats", exp: "فاعل two cats جمع است." } },
      { corr: "sitting on the brick wall.", dist: ["sits on the brick wall.", "sat on brick wall.", "to sit on brick wall.", "sitting in wall."] }
    ]},
    { prompt: "There", trans: "یک پیام فوری روی میز شما قرار دارد.", steps: [
      { corr: "is an urgent message", dist: ["are an urgent message", "is urgent messages", "are urgent message", "be an urgent message"], trap: { text: "are an urgent message", exp: "برای اسم مفرد an urgent message فعل is می‌آید." } },
      { corr: "waiting on your office desk.", dist: ["waits on office desk.", "waited on desk.", "to wait on desk.", "waiting in desk."] }
    ]},
    { prompt: "Are there", trans: "آیا صندلی‌های خالی در اتوبوس وجود دارد؟", steps: [
      { corr: "any empty seats available", dist: ["some empty seats available", "a empty seats", "any seat empty available", "much empty seats"], trap: { text: "some empty seats available", exp: "در سوالات Are there any seats می‌آید." } },
      { corr: "on the morning express bus?", dist: ["in morning bus?", "at morning bus?", "to express bus?", "by express bus?"] }
    ]},
    { prompt: "There", trans: "چند نقاشی زیبا روی دیوار اتاق نشیمن هست.", steps: [
      { corr: "are several beautiful paintings", dist: ["is several beautiful paintings", "are a paintings", "is paintings beautiful", "be several paintings"], trap: { text: "is several beautiful paintings", exp: "فاعل paintings جمع است." } },
      { corr: "hanging in the living room.", dist: ["hangs in living room.", "hanged in living room.", "to hang in room.", "hanging on room."] }
    ]},
    { prompt: "There", trans: "کمی چای گرم در قوری وجود دارد.", steps: [
      { corr: "is some hot tea", dist: ["are some hot tea", "is many hot tea", "are much hot tea", "be some hot tea"], trap: { text: "are some hot tea", exp: "کلمه tea غیرقابل شمارش است." } },
      { corr: "inside the ceramic teapot.", dist: ["on ceramic teapot.", "at teapot ceramic.", "to ceramic teapot.", "by teapot."] }
    ]},
    { prompt: "Is there", trans: "آیا هتلی تمیز در نزدیکی فرودگاه هست؟", steps: [
      { corr: "a clean hotel located", dist: ["any hotels clean located", "some clean hotel located", "clean hotel a", "hotels any located"], trap: { text: "any hotels clean located", exp: "با Is there اسم مفرد a clean hotel می‌آید." } },
      { corr: "near the airport terminal?", dist: ["next airport terminal?", "close of airport?", "by terminal airport?", "at airport terminal?"] }
    ]},
    { prompt: "There", trans: "هیچ مشکلی در نتایج آزمایش وجود ندارد.", steps: [
      { corr: "are no problems detected", dist: ["is no problems detected", "are not no problems", "is not problems", "be no problems"], trap: { text: "is no problems detected", exp: "کلمه problems جمع است و are می‌گیرد." } },
      { corr: "in the final medical report.", dist: ["on medical report.", "at report medical.", "to medical report.", "by medical report."] }
    ]}
  ],

  // Stage 7: Past Simple of To Be (Was / Were)
  7: [
    { prompt: "Where", trans: "شما دیشب ساعت ده کجا بودید؟", steps: [
      { corr: "were you", dist: ["was you", "are you", "did you be", "have you been"], trap: { text: "was you", exp: "با ضمیر you در زمان گذشته همیشه were به کار می‌رود نه was." } },
      { corr: "at ten o'clock last night?", dist: ["in ten o'clock night?", "on ten o'clock night?", "to ten o'clock night?", "for ten o'clock night?"] }
    ]},
    { prompt: "She", trans: "او دیروز تمام روز در خانه بیمار بود.", steps: [
      { corr: "was sick in bed", dist: ["were sick in bed", "is sick in bed", "did sick in bed", "been sick in bed"], trap: { text: "were sick in bed", exp: "با ضمیر she در گذشته was می‌آید." } },
      { corr: "all day yesterday.", dist: ["all yesterday day.", "in yesterday day.", "at yesterday all.", "for all yesterday."] }
    ]},
    { prompt: "The weather", trans: "هوا در تعطیلات آخر هفته گذشته آفتابی و گرم بود.", steps: [
      { corr: "was sunny and warm", dist: ["were sunny and warm", "is sunny and warm", "did sunny", "been sunny"], trap: { text: "were sunny and warm", exp: "کلمه weather مفرد است و was می‌گیرد." } },
      { corr: "throughout the weekend.", dist: ["during of the weekend.", "along weekend.", "in weekend through.", "at weekend."] }
    ]},
    { prompt: "They", trans: "آن‌ها از نتایج اولیه مسابقه بسیار راضی بودند.", steps: [
      { corr: "were very happy", dist: ["was very happy", "are very happy", "did happy", "been happy"], trap: { text: "was very happy", exp: "با ضمیر they فعل were می‌آید." } },
      { corr: "with the match results.", dist: ["from match results.", "of match results.", "by match results.", "to results match."] }
    ]},
    { prompt: "My brother", trans: "برادرم سال گذشته دانشجوی دانشگاه آکسفورد بود.", steps: [
      { corr: "was a college student", dist: ["were a college student", "is a college student", "did a student", "been student"], trap: { text: "were a college student", exp: "فاعل My brother مفرد است." } },
      { corr: "at Oxford University last year.", dist: ["in Oxford last year.", "on Oxford last year.", "to Oxford last year.", "by Oxford last year."] }
    ]},
    { prompt: "We", trans: "ما دیشب بعد از رانندگی طولانی خیلی خسته بودیم.", steps: [
      { corr: "were completely exhausted", dist: ["was completely exhausted", "are exhausted", "did exhausted", "been exhausted"], trap: { text: "was completely exhausted", exp: "با فاعل we فعل were به کار می‌رود." } },
      { corr: "after the long road trip.", dist: ["after trip road long.", "in long trip road.", "at road trip.", "for trip road."] }
    ]},
    { prompt: "The keys", trans: "کلیدها تمام مدت روی میز آشپزخانه بودند.", steps: [
      { corr: "were on the table", dist: ["was on the table", "are on the table", "did on table", "been on table"], trap: { text: "was on the table", exp: "کلمه keys جمع است و were می‌خواهد." } },
      { corr: "the whole afternoon.", dist: ["all afternoon whole.", "in afternoon whole.", "at whole afternoon.", "during whole."] }
    ]},
    { prompt: "It", trans: "امتحان نهایی ریاضی بسیار دشوار و چالش‌برانگیز بود.", steps: [
      { corr: "was a very difficult test", dist: ["were a very difficult test", "is a difficult test", "did difficult test", "been difficult test"], trap: { text: "were a very difficult test", exp: "با ضمیر it فعل was می‌آید." } },
      { corr: "for all the students.", dist: ["to all the students.", "with all students.", "at all students.", "of students all."] }
    ]},
    { prompt: "David and Sarah", trans: "دیوید و سارا هفته گذشته در سفر کاری پاریس بودند.", steps: [
      { corr: "were in Paris", dist: ["was in Paris", "are in Paris", "did in Paris", "been in Paris"], trap: { text: "was in Paris", exp: "دو نفر با هم فاعل جمع می‌سازند و were می‌گیرند." } },
      { corr: "on an important business trip.", dist: ["in business trip.", "at trip business.", "to business trip.", "for trip business."] }
    ]},
    { prompt: "I", trans: "من دیروز به خاطر ترافیک سنگین دیر به کلاس رسیدم.", steps: [
      { corr: "was late for class", dist: ["were late for class", "am late for class", "did late for class", "been late for class"], trap: { text: "were late for class", exp: "با فاعل I در زمان گذشته was به کار می‌رود." } },
      { corr: "because of the morning traffic.", dist: ["because morning traffic.", "due to of traffic.", "from traffic morning.", "for morning traffic."] }
    ]},
    { prompt: "The museum tickets", trans: "بلیط‌های موزه دیروز عصر برای بازدیدکنندگان رایگان بودند.", steps: [
      { corr: "were completely free", dist: ["was completely free", "are free", "did free", "been free"], trap: { text: "was completely free", exp: "کلمه tickets جمع است." } },
      { corr: "for all museum visitors.", dist: ["to all museum visitors.", "at museum visitors.", "with visitors museum.", "for visitors all."] }
    ]},
    { prompt: "The film", trans: "فیلم دیشب بسیار هیجان‌انگیز و تماشایی بود.", steps: [
      { corr: "was extremely exciting,", dist: ["were extremely exciting,", "is exciting,", "did exciting,", "been exciting,"], trap: { text: "were extremely exciting,", exp: "فیلم مفرد است و was می‌گیرد." } },
      { corr: "so we watched it twice.", dist: ["so watched it twice.", "so we watch it twice.", "then watched twice.", "and watch twice."] }
    ]},
    { prompt: "You", trans: "شما سال گذشته بهترین مدیر در شرکت بودید.", steps: [
      { corr: "were the best manager", dist: ["was the best manager", "are the best manager", "did manager", "been manager"], trap: { text: "was the best manager", exp: "با ضمیر you فعل were الزامی است." } },
      { corr: "in our corporate branch.", dist: ["at corporate branch.", "on branch corporate.", "to branch corporate.", "by corporate branch."] }
    ]},
    { prompt: "The children", trans: "بچه‌ها دیشب در مهمانی تولد خیلی خوشحال بودند.", steps: [
      { corr: "were very joyful", dist: ["was very joyful", "are very joyful", "did joyful", "been joyful"], trap: { text: "was very joyful", exp: "کلمه children جمع است و were می‌خواهد." } },
      { corr: "at the celebration party.", dist: ["in celebration party.", "on party celebration.", "to celebration party.", "by party celebration."] }
    ]},
    { prompt: "The train", trans: "قطار دیروز صبح بیست دقیقه تاخیر داشت.", steps: [
      { corr: "was twenty minutes late", dist: ["were twenty minutes late", "is late minutes", "did late minutes", "been late minutes"], trap: { text: "were twenty minutes late", exp: "قطار مفرد است و was می‌گیرد." } },
      { corr: "due to heavy snowfall.", dist: ["because heavy snowfall.", "from snowfall heavy.", "for heavy snowfall.", "with snowfall heavy."] }
    ]},
    { prompt: "She", trans: "او پنج سال پیش معلم دبستان در روستا بود.", steps: [
      { corr: "was an elementary teacher", dist: ["were an elementary teacher", "is teacher elementary", "did teacher", "been teacher"], trap: { text: "were an elementary teacher", exp: "با she فعل was می‌آید." } },
      { corr: "five years ago.", dist: ["before five years.", "since five years.", "in five years ago.", "at five years ago."] }
    ]},
    { prompt: "We", trans: "ما هنگام وقوع طوفان ناگهانی در ساحل دریا بودیم.", steps: [
      { corr: "were at the beach", dist: ["was at the beach", "are at beach", "did at beach", "been at beach"], trap: { text: "was at the beach", exp: "با فاعل we فعل were صحیح است." } },
      { corr: "when the storm struck.", dist: ["while storm struck.", "at storm struck.", "in storm struck.", "since storm struck."] }
    ]},
    { prompt: "The coffee", trans: "قهوه دیروز صبح خیلی داغ و خوش‌طعم بود.", steps: [
      { corr: "was perfectly hot", dist: ["were perfectly hot", "is hot perfectly", "did hot", "been hot"], trap: { text: "were perfectly hot", exp: "قهوه اسم غیرقابل شمارش است و was می‌گیرد." } },
      { corr: "and tasted wonderful.", dist: ["and tastes wonderful.", "and tasting wonderful.", "and taste wonderful.", "and to taste wonderful."] }
    ]},
    { prompt: "My parents", trans: "والدین من هفته گذشته در تعطیلات شمال بودند.", steps: [
      { corr: "were on vacation", dist: ["was on vacation", "are on vacation", "did on vacation", "been on vacation"], trap: { text: "was on vacation", exp: "کلمه parents جمع است و were می‌خواهد." } },
      { corr: "in the northern provinces.", dist: ["at northern provinces.", "on provinces northern.", "to northern provinces.", "by northern provinces."] }
    ]},
    { prompt: "Why", trans: "چرا دیروز جلسه هیئت مدیره این‌قدر طولانی بود؟", steps: [
      { corr: "was the meeting so long", dist: ["were the meeting so long", "is the meeting so long", "did the meeting so long", "the meeting was so long"], trap: { text: "were the meeting so long", exp: "کلمه meeting مفرد است و was می‌گیرد." } },
      { corr: "yesterday afternoon?", dist: ["in yesterday afternoon?", "at yesterday afternoon?", "on afternoon yesterday?", "for yesterday afternoon?"] }
    ]}
  ],

  // Stage 8: Past Simple Regular Verbs & Negative didn't
  8: [
    { prompt: "We", trans: "ما دیروز به خاطر باران شدید فوتبال بازی نکردیم.", steps: [
      { corr: "didn't play football", dist: ["didn't played football", "don't played football", "didn't playing football", "not played football"], trap: { text: "didn't played football", exp: "بعد از فعل کمکی didn't فعل اصلی باید به شکل ساده (play) بیاید و نباید ed بگیرد." } },
      { corr: "because of heavy rain.", dist: ["because heavy rain.", "due to of rain.", "for heavy rain.", "from rain heavy."] }
    ]},
    { prompt: "Sarah", trans: "سارا دیروز از مادربزرگ خود در بیمارستان عیادت کرد.", steps: [
      { corr: "visited her grandmother", dist: ["visit her grandmother", "visiting her grandmother", "did visited grandmother", "was visited grandmother"], trap: { text: "visit her grandmother", exp: "در گذشته مثبت برای افعال باقاعده پسوند ed الزامی است (visited)." } },
      { corr: "at the general hospital.", dist: ["in hospital general.", "on general hospital.", "to general hospital.", "by hospital general."] }
    ]},
    { prompt: "They", trans: "آن‌ها آپارتمان قدیمی خود را سال گذشته بازسازی کردند.", steps: [
      { corr: "renovated their apartment", dist: ["renovate apartment", "renovating apartment", "did renovated apartment", "were renovated apartment"], trap: { text: "did renovated apartment", exp: "در جملات مثبت گذشته نیازی به فعل کمکی did نیست." } },
      { corr: "with modern wooden furniture.", dist: ["by furniture modern.", "from modern furniture.", "of wooden furniture.", "with furniture modern."] }
    ]},
    { prompt: "I", trans: "من دیشب بعد از شام فیلم سینمایی تماشا نکردم.", steps: [
      { corr: "didn't watch the movie", dist: ["didn't watched the movie", "don't watched movie", "didn't watching movie", "not watched movie"], trap: { text: "didn't watched the movie", exp: "بعد از didn't فعل watch بدون ed می‌آید." } },
      { corr: "after eating dinner.", dist: ["after eat dinner.", "after to eat dinner.", "in eating dinner.", "for dinner eat."] }
    ]},
    { prompt: "David", trans: "دیوید دیروز تمام روز برای امتحان نهایی تاریخ درس خواند.", steps: [
      { corr: "studied very hard", dist: ["study very hard", "studying hard", "did studied hard", "was studied hard"], trap: { text: "study very hard", exp: "در گذشته فعل study به صورت studied با تبدیل y به i نوشته می‌شود." } },
      { corr: "for the history exam.", dist: ["to history exam.", "in history exam.", "at exam history.", "with history exam."] }
    ]},
    { prompt: "The train", trans: "قطار رأس ساعت مقرر در ایستگاه مرکزی توقف کرد.", steps: [
      { corr: "stopped on schedule", dist: ["stop on schedule", "stopping on schedule", "did stopped on schedule", "was stopped on schedule"], trap: { text: "stop on schedule", exp: "گذشته فعل باقاعده stop با دو p و ed نوشته می‌شود (stopped)." } },
      { corr: "at the main station.", dist: ["in main station.", "on main station.", "to station main.", "by station main."] }
    ]},
    { prompt: "She", trans: "او در جلسه دیروز با پیشنهاد مدیر موافقت نکرد.", steps: [
      { corr: "didn't agree with", dist: ["didn't agreed with", "don't agreed with", "not agreed with", "didn't agreeing with"], trap: { text: "didn't agreed with", exp: "پس از didn't فعل agree بدون d می‌آید." } },
      { corr: "the manager's new proposal.", dist: ["proposal manager new.", "the proposal manager.", "to manager proposal.", "at proposal manager."] }
    ]},
    { prompt: "My parents", trans: "والدین من تابستان گذشته به پنج کشور اروپایی سفر کردند.", steps: [
      { corr: "traveled to Europe", dist: ["travel to Europe", "traveling to Europe", "did traveled to Europe", "were traveled to Europe"], trap: { text: "travel to Europe", exp: "گذشته فعل travel به صورت traveled با ed است." } },
      { corr: "during their summer holiday.", dist: ["at summer holiday.", "in holiday summer.", "for holiday summer.", "on holiday summer."] }
    ]},
    { prompt: "Alex", trans: "الکس دیروز اتاق کار خود را کاملاً تمیز و مرتب کرد.", steps: [
      { corr: "cleaned his office", dist: ["clean his office", "cleaning his office", "did cleaned office", "was cleaned office"], trap: { text: "clean his office", exp: "در گذشته ساده cleaned با ed می‌آید." } },
      { corr: "before leaving for home.", dist: ["before leave for home.", "before to leave home.", "in leaving home.", "for home leave."] }
    ]},
    { prompt: "We", trans: "ما دیشب از غذای رستوران سنتی لذت نبردیم.", steps: [
      { corr: "didn't enjoy the meal", dist: ["didn't enjoyed the meal", "don't enjoyed meal", "not enjoyed meal", "didn't enjoying meal"], trap: { text: "didn't enjoyed the meal", exp: "بعد از didn't شکل ساده enjoy درست است." } },
      { corr: "at the traditional restaurant.", dist: ["in restaurant traditional.", "on traditional restaurant.", "to traditional restaurant.", "by restaurant."] }
    ]},
    { prompt: "The mechanic", trans: "مکانیک ترمزهای اتومبیل را دیروز به دقت بررسی کرد.", steps: [
      { corr: "checked the car brakes", dist: ["check car brakes", "checking car brakes", "did checked brakes", "was checked brakes"], trap: { text: "check car brakes", exp: "گذشته فعل check با ed است (checked)." } },
      { corr: "with modern diagnostic tools.", dist: ["by diagnostic tools.", "from diagnostic tools.", "with tools diagnostic.", "of modern tools."] }
    ]},
    { prompt: "They", trans: "آن‌ها دیروز برای اتوبوس در ایستگاه منتظر نماندند.", steps: [
      { corr: "didn't wait for", dist: ["didn't waited for", "don't waited for", "not waited for", "didn't waiting for"], trap: { text: "didn't waited for", exp: "بعد از didn't فعل wait بدون ed می‌آید." } },
      { corr: "the morning express bus.", dist: ["bus express morning.", "the bus express.", "to express bus.", "in express bus."] }
    ]},
    { prompt: "Emma", trans: "اما هفته گذشته با موفقیت در رشته مدیریت فارغ‌التحصیل شد.", steps: [
      { corr: "graduated with honors", dist: ["graduate with honors", "graduating with honors", "did graduated", "was graduated"], trap: { text: "graduate with honors", exp: "گذشته فعل باقاعده graduated است." } },
      { corr: "from the state university.", dist: ["of state university.", "in state university.", "to state university.", "at university state."] }
    ]},
    { prompt: "I", trans: "من دیروز عصر پنجره‌های اتاق خواب را باز نکردم.", steps: [
      { corr: "didn't open the windows", dist: ["didn't opened the windows", "don't opened windows", "not opened windows", "didn't opening windows"], trap: { text: "didn't opened the windows", exp: "بعد از didn't فعل open ساده است." } },
      { corr: "because of the dusty wind.", dist: ["because dusty wind.", "due to of wind.", "for dusty wind.", "from wind dusty."] }
    ]},
    { prompt: "The artist", trans: "هنرمند نقاشی دیواری زیبایی را در پارک شهر نقاشی کرد.", steps: [
      { corr: "painted a beautiful mural", dist: ["paint a beautiful mural", "painting a mural", "did painted a mural", "was painted mural"], trap: { text: "paint a beautiful mural", exp: "گذشته ساده painted با ed است." } },
      { corr: "on the public community wall.", dist: ["in public wall.", "at community wall.", "to public wall.", "by wall public."] }
    ]},
    { prompt: "We", trans: "ما دیروز برنامه مهمانی را به خاطر باران لغو نکردیم.", steps: [
      { corr: "didn't cancel the event", dist: ["didn't canceled the event", "don't canceled event", "not canceled event", "didn't cancelling event"], trap: { text: "didn't canceled the event", exp: "بعد از didn't فعل cancel ساده است." } },
      { corr: "despite the cloudy weather.", dist: ["despite of weather.", "in spite cloudy weather.", "although cloudy weather.", "for weather cloudy."] }
    ]},
    { prompt: "David", trans: "دیوید دیروز به همکاران جدیدش در اداره سلام و احوالپرسی کرد.", steps: [
      { corr: "greeted his colleagues", dist: ["greet his colleagues", "greeting colleagues", "did greeted colleagues", "was greeted colleagues"], trap: { text: "greet his colleagues", exp: "فعل گذشته greeted با ed ساخته می‌شود." } },
      { corr: "with a warm smile.", dist: ["by warm smile.", "from warm smile.", "with smile warm.", "of warm smile."] }
    ]},
    { prompt: "She", trans: "او دیروز هیچ غذای فست‌فودی سفارش نداد.", steps: [
      { corr: "didn't order fast food", dist: ["didn't ordered fast food", "don't ordered food", "not ordered food", "didn't ordering food"], trap: { text: "didn't ordered fast food", exp: "بعد از didn't فعل order بدون ed می‌آید." } },
      { corr: "for her family dinner.", dist: ["to family dinner.", "in family dinner.", "at dinner family.", "with dinner family."] }
    ]},
    { prompt: "The children", trans: "بچه‌ها دیروز در حیاط خلوت با خوشحالی بازی کردند.", steps: [
      { corr: "played cheerfully", dist: ["play cheerfully", "playing cheerfully", "did played cheerfully", "were played cheerfully"], trap: { text: "play cheerfully", exp: "گذشته ساده played است." } },
      { corr: "until sunset arrived.", dist: ["until of sunset.", "since sunset arrived.", "before sunset arrive.", "to sunset arrived."] }
    ]},
    { prompt: "He", trans: "او دیروز بدون مدرک شناسایی درهای امنیتی را قفل نکرد.", steps: [
      { corr: "didn't lock the door", dist: ["didn't locked the door", "don't locked door", "not locked door", "didn't locking door"], trap: { text: "didn't locked the door", exp: "بعد از didn't شکل ساده lock درست است." } },
      { corr: "before checking the keys.", dist: ["before check keys.", "before to check keys.", "in checking keys.", "for keys check."] }
    ]}
  ],

  // Stage 9: Future with Be Going To
  9: [
    { prompt: "I am", trans: "من قصد دارم آخر این هفته به دیدن مادربزرگم بروم.", steps: [
      { corr: "going to visit", dist: ["going visit", "go to visit", "going to visiting", "go visit"], trap: { text: "going visit", exp: "ساختار آینده قطعی با be going to نیاز به حرف اضافه to قبل از فعل ساده دارد." } },
      { corr: "my grandmother this weekend.", dist: ["to my grandmother.", "at my grandmother.", "for grandmother this.", "with grandmother."] }
    ]},
    { prompt: "She is", trans: "او قصد دارد برای سال تحصیلی جدید یک لپ‌تاپ نو بخرد.", steps: [
      { corr: "going to buy", dist: ["going buy", "go to buy", "going to buying", "go buying"], trap: { text: "going buy", exp: "عبارت going to الزامی است." } },
      { corr: "a new laptop computer.", dist: ["a laptop computer new.", "computer laptop new.", "new computer laptop.", "the laptop new."] }
    ]},
    { prompt: "They are", trans: "آن‌ها قصد دارند ماه آینده به یک آپارتمان بزرگتر نقل مکان کنند.", steps: [
      { corr: "going to move", dist: ["going move", "go to move", "going to moving", "go moving"], trap: { text: "going move", exp: "بعد از are ساختار going to move درست است." } },
      { corr: "into a larger apartment.", dist: ["in larger apartment.", "to apartment larger.", "at larger apartment.", "by apartment."] }
    ]},
    { prompt: "We are", trans: "ما قصد داریم امشب در این رستوران سنتی شام بخوریم.", steps: [
      { corr: "going to eat dinner", dist: ["going eat dinner", "go to eat dinner", "going to eating dinner", "go dinner"], trap: { text: "going eat dinner", exp: "ساختار be going to نیاز به to دارد." } },
      { corr: "at the Italian restaurant.", dist: ["in Italian restaurant.", "on restaurant Italian.", "to Italian restaurant.", "by restaurant."] }
    ]},
    { prompt: "David is", trans: "دیوید قصد دارد فردا در آزمون رانندگی شرکت کند.", steps: [
      { corr: "going to take", dist: ["going take", "go to take", "going to taking", "go taking"], trap: { text: "going take", exp: "ساختار going to take شکل درست آینده با برنامه قبلی است." } },
      { corr: "his driving license test.", dist: ["his test driving license.", "test driving license his.", "at driving test.", "for test driving."] }
    ]},
    { prompt: "The doctor is", trans: "پزشک قصد دارد تا نیم ساعت دیگر بیمار جدید را معاینه کند.", steps: [
      { corr: "going to examine", dist: ["going examine", "go to examine", "going to examining", "go examining"], trap: { text: "going examine", exp: "بعد از is باید going to examine بیاید." } },
      { corr: "the patient in room four.", dist: ["patient in room four.", "to patient in room.", "at patient room four.", "for patient room."] }
    ]},
    { prompt: "Are you", trans: "آیا شما قصد دارید در تعطیلات به پاریس سفر کنید؟", steps: [
      { corr: "going to travel", dist: ["going travel", "go to travel", "going to traveling", "go traveling"], trap: { text: "going travel", exp: "در سوالات Are you going to travel درست است." } },
      { corr: "to Paris during the holidays?", dist: ["in Paris holidays?", "at Paris during holidays?", "for Paris in holidays?", "with Paris holidays?"] }
    ]},
    { prompt: "My parents are", trans: "والدین من قصد دارند خودروی قدیمی خود را بفروشند.", steps: [
      { corr: "going to sell", dist: ["going sell", "go to sell", "going to selling", "go selling"], trap: { text: "going sell", exp: "ساختار going to sell صحیح است." } },
      { corr: "their old family station wagon.", dist: ["family car their old.", "their car family old.", "to their old car.", "by family car."] }
    ]},
    { prompt: "It is", trans: "به این ابرهای سیاه نگاه کن؛ قرار است به زودی باران ببارد.", steps: [
      { corr: "going to rain heavily", dist: ["going rain heavily", "go to rain heavily", "going to raining", "go raining"], trap: { text: "going rain heavily", exp: "برای پیش‌بینی بر اساس شواهد موجود it is going to rain به کار می‌رود." } },
      { corr: "in just a few minutes.", dist: ["to just few minutes.", "at just few minutes.", "for few minutes in.", "by few minutes."] }
    ]},
    { prompt: "Alex is", trans: "الکس قصد دارد برای سلامتی بیشتر در یک باشگاه ورزشی ثبت‌نام کند.", steps: [
      { corr: "going to enroll", dist: ["going enroll", "go to enroll", "going to enrolling", "go enroll"], trap: { text: "going enroll", exp: "ساختار going to enroll درست است." } },
      { corr: "in an intensive gym course.", dist: ["at gym course.", "to gym course.", "on course gym.", "with gym course."] }
    ]},
    { prompt: "We are", trans: "ما قصد داریم تابستان امسال یک دوره برنامه‌نویسی را شروع کنیم.", steps: [
      { corr: "going to start", dist: ["going start", "go to start", "going to starting", "go starting"], trap: { text: "going start", exp: "نیاز به going to start دارد." } },
      { corr: "a modern coding boot-camp.", dist: ["a coding boot-camp modern.", "modern boot-camp coding.", "to coding boot-camp.", "at coding camp."] }
    ]},
    { prompt: "The students are", trans: "دانش‌آموزان قصد دارند هفته آینده پروژه علمی خود را تحویل دهند.", steps: [
      { corr: "going to submit", dist: ["going submit", "go to submit", "going to submitting", "go submit"], trap: { text: "going submit", exp: "ساختار going to submit صحیح است." } },
      { corr: "their annual science project.", dist: ["science project annual.", "their project science.", "to science project.", "at project science."] }
    ]},
    { prompt: "She is", trans: "او قصد ندارد این پیشنهاد شغلی را رد کند.", steps: [
      { corr: "not going to reject", dist: ["not going reject", "not go to reject", "not going to rejecting", "not go rejecting"], trap: { text: "not going reject", exp: "در حالت منفی not going to reject صحیح است." } },
      { corr: "the executive job offer.", dist: ["job offer executive.", "the offer job.", "to job offer.", "at executive offer."] }
    ]},
    { prompt: "I am", trans: "من قصد دارم بعد از اتمام کلاس با دوستانم تماس بگیرم.", steps: [
      { corr: "going to call my friends", dist: ["going call my friends", "go to call friends", "going to calling friends", "go calling friends"], trap: { text: "going call my friends", exp: "ساختار going to call صحیح است." } },
      { corr: "as soon as class finishes.", dist: ["as soon class finishes.", "when class finish.", "while finishes class.", "after class to finish."] }
    ]},
    { prompt: "They are", trans: "آن‌ها قصد دارند برای تعطیلات آخر هفته یک کلبه کوهستانی اجاره کنند.", steps: [
      { corr: "going to rent a cabin", dist: ["going rent a cabin", "go to rent cabin", "going to renting cabin", "go renting cabin"], trap: { text: "going rent a cabin", exp: "نیاز به going to rent دارد." } },
      { corr: "in the peaceful green mountains.", dist: ["at mountains green.", "on peaceful mountains.", "to green mountains.", "by mountains peaceful."] }
    ]},
    { prompt: "Is he", trans: "آیا او قصد دارد برای ادامه تحصیل به آلمان مهاجرت کند؟", steps: [
      { corr: "going to emigrate", dist: ["going emigrate", "go to emigrate", "going to emigrating", "go emigrating"], trap: { text: "going emigrate", exp: "در سوالات Is he going to emigrate درست است." } },
      { corr: "for advanced university studies?", dist: ["to studies university?", "in university studies?", "at advanced studies?", "with studies advanced?"] }
    ]},
    { prompt: "The company is", trans: "شرکت قصد دارد شعبه جدیدی در دبی افتتاح کند.", steps: [
      { corr: "going to open a branch", dist: ["going open a branch", "go to open branch", "going to opening branch", "go opening branch"], trap: { text: "going open a branch", exp: "ساختار going to open الزامی است." } },
      { corr: "in the downtown commercial district.", dist: ["at downtown district.", "on commercial district.", "to district commercial.", "by commercial district."] }
    ]},
    { prompt: "You are", trans: "شما قرار است در کنفرانس بین‌المللی فردا سخنرانی کنید.", steps: [
      { corr: "going to deliver a speech", dist: ["going deliver speech", "go to deliver speech", "going to delivering speech", "go delivering"], trap: { text: "going deliver speech", exp: "ساختار going to deliver صحیح است." } },
      { corr: "at the global conference.", dist: ["in global conference.", "on global conference.", "to conference global.", "by conference."] }
    ]},
    { prompt: "Sarah is", trans: "سارا قصد دارد برای سال نو یک ساز موسیقی سنتی یاد بگیرد.", steps: [
      { corr: "going to learn piano", dist: ["going learn piano", "go to learn piano", "going to learning piano", "go learning piano"], trap: { text: "going learn piano", exp: "ساختار going to learn صحیح است." } },
      { corr: "with an experienced tutor.", dist: ["by experienced tutor.", "from experienced tutor.", "with tutor experienced.", "of experienced tutor."] }
    ]},
    { prompt: "We are", trans: "ما قصد نداریم تا آماده شدن نتیجه آزمایش عجله کنیم.", steps: [
      { corr: "not going to rush", dist: ["not going rush", "not go to rush", "not going to rushing", "not go rush"], trap: { text: "not going rush", exp: "حالت منفی not going to rush است." } },
      { corr: "until the final verdict arrives.", dist: ["until of final verdict.", "since verdict arrives.", "before arrives verdict.", "to final verdict."] }
    ]}
  ],

  // Stage 10: Present Continuous (am/is/are + verb-ing)
  10: [
    { prompt: "Look! The children", trans: "نگاه کن! بچه‌ها دارند با خوشحالی در حیاط خلوت بازی می‌کنند.", steps: [
      { corr: "are playing happily", dist: ["is playing happily", "are play happily", "play happily", "be playing happily"], trap: { text: "is playing happily", exp: "کلمه children جمع است و فعل are playing می‌گیرد." } },
      { corr: "in the green garden backyard.", dist: ["at green backyard.", "on garden backyard.", "to backyard green.", "by backyard garden."] }
    ]},
    { prompt: "Right now, Sarah", trans: "همین الان، سارا دارد در کتابخانه مرکزی زبان فرانسوی مطالعه می‌کند.", steps: [
      { corr: "is studying French", dist: ["are studying French", "is study French", "studies French", "be studying French"], trap: { text: "are studying French", exp: "سارا مفرد است و is studying می‌آید." } },
      { corr: "for her upcoming exam.", dist: ["to upcoming exam.", "in upcoming exam.", "at exam upcoming.", "with upcoming exam."] }
    ]},
    { prompt: "Listen! Someone", trans: "گوش کن! یک نفر دارد پشت در ورودی ضربه می‌زند.", steps: [
      { corr: "is knocking softly", dist: ["are knocking softly", "is knock softly", "knocks softly", "be knocking softly"], trap: { text: "are knocking softly", exp: "کلمات نامعین مثل someone مفرد به حساب می‌آیند و is می‌گیرند." } },
      { corr: "at the main entrance door.", dist: ["in entrance door.", "on main entrance door.", "to main door entrance.", "by door entrance."] }
    ]},
    { prompt: "I", trans: "من در حال حاضر دارم روی یک گزارش مهم شرکتی کار می‌کنم.", steps: [
      { corr: "am currently working", dist: ["is currently working", "are currently working", "am work currently", "currently work"], trap: { text: "is currently working", exp: "با ضمیر I در زمان حال استمراری am working می‌آید." } },
      { corr: "on the financial report.", dist: ["in financial report.", "at financial report.", "to report financial.", "for report financial."] }
    ]},
    { prompt: "The workers", trans: "کارگران در حال حاضر دارند پل جدید شهر را تعمیر می‌کنند.", steps: [
      { corr: "are repairing the bridge", dist: ["is repairing the bridge", "are repair bridge", "repairs bridge", "be repairing bridge"], trap: { text: "is repairing the bridge", exp: "کلمه workers جمع است و are repairing می‌خواهد." } },
      { corr: "across the wide river.", dist: ["over of wide river.", "along wide river.", "through wide river.", "at river wide."] }
    ]},
    { prompt: "Why", trans: "چرا این کودک کوچک دارد با صدای بلند گریه می‌کند؟", steps: [
      { corr: "is the little baby crying", dist: ["are the baby crying", "is the baby cry", "does the baby crying", "the baby is crying"], trap: { text: "does the baby crying", exp: "در سوالات حال استمراری از فعل to be استفاده می‌شود نه does." } },
      { corr: "in the waiting room?", dist: ["at waiting room?", "on waiting room?", "to waiting room?", "by waiting room?"] }
    ]},
    { prompt: "The chef", trans: "سرآشپز دارد یک سوپ سبزیجات مخصوص برای مهمانان آماده می‌کند.", steps: [
      { corr: "is preparing a special soup", dist: ["are preparing a soup", "is prepare soup", "prepares special soup", "be preparing soup"], trap: { text: "are preparing a soup", exp: "فاعل The chef مفرد است." } },
      { corr: "for the evening guests.", dist: ["to evening guests.", "in evening guests.", "at guests evening.", "with guests evening."] }
    ]},
    { prompt: "They", trans: "آن‌ها در حال حاضر دارند در کنفرانس بین‌المللی سخنرانی می‌کنند.", steps: [
      { corr: "are presenting their research", dist: ["is presenting research", "are present research", "presents research", "be presenting research"], trap: { text: "is presenting research", exp: "با they فعل are presenting می‌آید." } },
      { corr: "at the scientific symposium.", dist: ["in scientific symposium.", "on symposium scientific.", "to symposium.", "by symposium."] }
    ]},
    { prompt: "Look out the window! It", trans: "به بیرون پنجره نگاه کن! دارد باران شدیدی می‌بارد.", steps: [
      { corr: "is raining heavily", dist: ["are raining heavily", "is rain heavily", "rains heavily", "be raining heavily"], trap: { text: "is rain heavily", exp: "در حال استمراری پسوند ing الزامی است." } },
      { corr: "all over the city.", dist: ["in all over city.", "at all over city.", "to all over city.", "by all over city."] }
    ]},
    { prompt: "My brother", trans: "برادرم دارد در گاراژ دوچرخه قدیمی‌اش را تعمیر می‌کند.", steps: [
      { corr: "is fixing his bicycle", dist: ["are fixing his bicycle", "is fix his bicycle", "fixes his bicycle", "be fixing bicycle"], trap: { text: "are fixing his bicycle", exp: "فاعل مفرد است و is می‌خواهد." } },
      { corr: "with his new tools.", dist: ["by his new tools.", "from new tools.", "with tools new.", "of new tools."] }
    ]},
    { prompt: "We", trans: "ما در حال حاضر داریم برای امتحان فردا صبح آماده می‌شویم.", steps: [
      { corr: "are getting ready", dist: ["is getting ready", "are get ready", "gets ready", "be getting ready"], trap: { text: "is getting ready", exp: "با we فعل are getting ready صحیح است." } },
      { corr: "for tomorrow's final exam.", dist: ["to tomorrow exam.", "in tomorrow exam.", "at exam tomorrow.", "with tomorrow exam."] }
    ]},
    { prompt: "The students", trans: "دانش‌آموزان دارند با دقت به تدریس استاد گوش می‌دهند.", steps: [
      { corr: "are listening attentively", dist: ["is listening attentively", "are listen attentively", "listens attentively", "be listening attentively"], trap: { text: "is listening attentively", exp: "کلمه students جمع است." } },
      { corr: "to the professor's lecture.", dist: ["at professor lecture.", "in lecture professor.", "for professor lecture.", "with professor lecture."] }
    ]},
    { prompt: "David", trans: "دیوید دارد رمان جدیدی می‌نویسد و تمام روز پشت میزش است.", steps: [
      { corr: "is writing a new book", dist: ["are writing a new book", "is write a new book", "writes a new book", "be writing book"], trap: { text: "are writing a new book", exp: "دیوید مفرد است و is writing می‌گیرد." } },
      { corr: "in his private study.", dist: ["at his private study.", "on private study.", "to private study.", "by private study."] }
    ]},
    { prompt: "The train", trans: "قطار دارد به آرامی وارد ایستگاه مرکزی شهر می‌شود.", steps: [
      { corr: "is approaching the platform", dist: ["are approaching the platform", "is approach platform", "approaches platform", "be approaching platform"], trap: { text: "are approaching the platform", exp: "قطار مفرد است." } },
      { corr: "on track number four.", dist: ["in track number four.", "at track number four.", "to track four.", "by track four."] }
    ]},
    { prompt: "You", trans: "شما دارید خیلی سریع در این جاده بارانی رانندگی می‌کنید.", steps: [
      { corr: "are driving too fast", dist: ["is driving too fast", "are drive too fast", "drives too fast", "be driving fast"], trap: { text: "is driving too fast", exp: "با ضمیر you فعل are driving می‌آید." } },
      { corr: "on this slippery highway.", dist: ["in this slippery highway.", "at highway slippery.", "to slippery highway.", "by slippery highway."] }
    ]},
    { prompt: "The sun", trans: "خورشید دارد در افق کوهستان با زیبایی تمام طلوع می‌کند.", steps: [
      { corr: "is rising majestically", dist: ["are rising majestically", "is rise majestically", "rises majestically", "be rising majestically"], trap: { text: "are rising majestically", exp: "خورشید مفرد است و is rising می‌گیرد." } },
      { corr: "over the eastern hills.", dist: ["in eastern hills.", "at eastern hills.", "to hills eastern.", "by eastern hills."] }
    ]},
    { prompt: "They", trans: "آن‌ها در حال حاضر دارند در سالن پذیرایی قهوه می‌نوشند.", steps: [
      { corr: "are drinking hot coffee", dist: ["is drinking hot coffee", "are drink hot coffee", "drinks hot coffee", "be drinking coffee"], trap: { text: "is drinking hot coffee", exp: "با they فعل are drinking درست است." } },
      { corr: "in the executive lounge.", dist: ["at executive lounge.", "on executive lounge.", "to executive lounge.", "by executive lounge."] }
    ]},
    { prompt: "She", trans: "او دارد یک ژاکت پشمی گرم برای زمستان می‌بافد.", steps: [
      { corr: "is knitting a warm sweater", dist: ["are knitting a warm sweater", "is knit sweater", "knits a sweater", "be knitting sweater"], trap: { text: "are knitting a warm sweater", exp: "فاعل she مفرد است و is knitting می‌خواهد." } },
      { corr: "for the upcoming cold season.", dist: ["to upcoming cold season.", "in cold season.", "at cold season.", "with cold season."] }
    ]},
    { prompt: "The birds", trans: "پرندگان دارند روی شاخه‌های بلند درخت آواز می‌خوانند.", steps: [
      { corr: "are singing cheerfully", dist: ["is singing cheerfully", "are sing cheerfully", "sings cheerfully", "be singing cheerfully"], trap: { text: "is singing cheerfully", exp: "کلمه birds جمع است و are singing می‌گیرد." } },
      { corr: "in the tall oak tree.", dist: ["on the tall oak tree.", "at tall oak tree.", "to oak tree tall.", "by oak tree tall."] }
    ]},
    { prompt: "I", trans: "من دارم وسایلم را برای سفر فردا صبح جمع می‌کنم.", steps: [
      { corr: "am packing my suitcase", dist: ["is packing my suitcase", "are packing my suitcase", "am pack suitcase", "packs suitcase"], trap: { text: "is packing my suitcase", exp: "با I فعل am packing می‌آید." } },
      { corr: "for the morning flight.", dist: ["to morning flight.", "in morning flight.", "at flight morning.", "with morning flight."] }
    ]}
  ]
};
