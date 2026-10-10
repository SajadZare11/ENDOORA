// American English File - Tier A2 Grammar Specs (10 Stages x 20 Authentic Sentences = 200 Sentences)
// Every sentence has an authentic English structure, exact Persian translation, and L1 interference trap.

export const A2_SPECS = {
  // Stage 1: Past Continuous vs Past Simple (While + was/were doing, did)
  1: [
    { prompt: "While I was driving home,", trans: "زمانی که داشتم به سمت خانه رانندگی می‌کردم، ناگهان باران شدیدی شروع به باریدن کرد.", steps: [
      { corr: "it suddenly started to rain", dist: ["it was suddenly starting to rain", "it suddenly starts to rain", "it has suddenly started", "it starting to rain"], trap: { text: "it was suddenly starting to rain", exp: "برای رویدادی که در میان یک عمل استمراری اتفاق می‌افتد، گذشته ساده (started) به کار می‌رود نه گذشته استمراری." } },
      { corr: "heavily over the highway.", dist: ["heavy over the highway.", "heavily in the highway.", "heavy on highway.", "with heavy rain."] }
    ]},
    { prompt: "When the phone rang,", trans: "وقتی تلفن زنگ زد، سارا در آشپزخانه مشغول آماده کردن شام بود.", steps: [
      { corr: "Sarah was cooking dinner", dist: ["Sarah cooked dinner", "Sarah is cooking dinner", "Sarah has cooked dinner", "Sarah cooks dinner"], trap: { text: "Sarah cooked dinner", exp: "عملی که در پس‌زمینه در حال جریان بوده است باید با گذشته استمراری (was cooking) بیان شود." } },
      { corr: "in the modern kitchen.", dist: ["at modern kitchen.", "on modern kitchen.", "to kitchen modern.", "by modern kitchen."] }
    ]},
    { prompt: "They were walking in the park", trans: "آن‌ها داشتند در پارک قدم می‌زدند که ناگهان یک سگ گمشده پیدا کردند.", steps: [
      { corr: "when they found", dist: ["while they found", "when they were finding", "when they find", "while they were finding"], trap: { text: "when they were finding", exp: "لحظه پیدا کردن یک رویداد لحظه‌ای در گذشته است و گذشته ساده (found) می‌خواهد." } },
      { corr: "a friendly golden retriever.", dist: ["a dog friendly retriever.", "golden retriever friendly.", "with golden retriever.", "at retriever dog."] }
    ]},
    { prompt: "While we were having lunch,", trans: "زمانی که داشتیم ناهار می‌خوردیم، زنگ در ورودی ناگهان به صدا درآمد.", steps: [
      { corr: "someone knocked loudly", dist: ["someone was knocking loudly", "someone knocks loudly", "someone has knocked", "someone knocking loudly"], trap: { text: "someone was knocking loudly", exp: "عمل قطع‌کننده با گذشته ساده (knocked) می‌آید." } },
      { corr: "at the wooden front door.", dist: ["in front door wooden.", "on front door.", "to wooden door.", "by front door."] }
    ]},
    { prompt: "He hurt his ankle", trans: "او هنگام بازی بسکتبال در دانشگاه به مچ پای خود آسیب زد.", steps: [
      { corr: "while he was playing basketball", dist: ["while he played basketball", "when he was play basketball", "while he is playing basketball", "when he plays basketball"], trap: { text: "while he played basketball", exp: "بعد از while برای فعالیت در حال انجام گذشته استمراری (was playing) درست‌تر است." } },
      { corr: "at the university sports hall.", dist: ["in sports hall university.", "on sports hall.", "to university sports.", "by sports hall."] }
    ]},
    { prompt: "As I was walking to the station,", trans: "همان‌طور که داشتم به سمت ایستگاه پیاده می‌رفتم، به معلم قدیمی‌ام برخورد کردم.", steps: [
      { corr: "I ran into my old teacher", dist: ["I was running into my teacher", "I run into my teacher", "I have run into teacher", "I running into teacher"], trap: { text: "I was running into my teacher", exp: "رویداد ناگهانی با گذشته ساده ran into بیان می‌شود." } },
      { corr: "near the central bookstore.", dist: ["next bookstore central.", "close of bookstore.", "by bookstore central.", "at bookstore."] }
    ]},
    { prompt: "She dropped her phone", trans: "او هنگام پیاده شدن از قطار گوشی خود را انداخت.", steps: [
      { corr: "while she was getting off", dist: ["while she got off", "when she gets off", "while she is getting off", "when she get off"], trap: { text: "while she got off", exp: "عمل پیاده شدن در آن لحظه با was getting off می‌آید." } },
      { corr: "the crowded passenger train.", dist: ["passenger train crowded.", "to train passenger.", "in crowded train.", "at passenger train."] }
    ]},
    { prompt: "The electricity went out", trans: "برق زمانی قطع شد که ما داشتیم یک فیلم مستند جالب تماشا می‌کردیم.", steps: [
      { corr: "while we were watching a film", dist: ["while we watched a film", "when we watch a film", "while we are watching film", "when we watching film"], trap: { text: "while we watched a film", exp: "بعد از while گذشته استمراری were watching به کار می‌رود." } },
      { corr: "in the cozy living room.", dist: ["at living room cozy.", "on cozy living room.", "to living room.", "by living room."] }
    ]},
    { prompt: "While the professor was explaining,", trans: "زمانی که استاد داشت درس را توضیح می‌داد، زنگ هشدار آتش به صدا درآمد.", steps: [
      { corr: "the fire alarm sounded", dist: ["the fire alarm was sounding", "the fire alarm sounds", "the alarm has sounded", "the alarm sounding"], trap: { text: "the fire alarm was sounding", exp: "رویداد قطع‌کننده گذشته ساده sounded می‌گیرد." } },
      { corr: "throughout the whole building.", dist: ["along the whole building.", "in building whole.", "at whole building.", "by whole building."] }
    ]},
    { prompt: "I was reading a novel", trans: "من داشتم رمان می‌خواندم که برادرم با خبرهای خوب به خانه آمد.", steps: [
      { corr: "when my brother arrived home", dist: ["while my brother arrived home", "when brother was arriving", "when brother arrives home", "while brother arrives"], trap: { text: "while my brother arrived home", exp: "برای رویداد نقطه‌ای گذشته ساده قبل از آن when می‌آید نه while." } },
      { corr: "with exciting news.", dist: ["by exciting news.", "from exciting news.", "of exciting news.", "with news exciting."] }
    ]},
    { prompt: "While they were waiting for the bus,", trans: "زمانی که آن‌ها منتظر اتوبوس بودند، یک تصادف کوچک خیابانی دیدند.", steps: [
      { corr: "they witnessed a car accident", dist: ["they were witnessing an accident", "they witness an accident", "they have witnessed", "they witnessing"], trap: { text: "they were witnessing an accident", exp: "فعل لحظه‌ای با گذشته ساده witnessed بیان می‌شود." } },
      { corr: "at the busy intersection.", dist: ["in intersection busy.", "on busy intersection.", "to busy intersection.", "by intersection."] }
    ]},
    { prompt: "Emily was sleeping peacefully", trans: "امیلی آرام خوابیده بود که صدای بلند رعد و برق او را بیدار کرد.", steps: [
      { corr: "when the loud thunder woke her", dist: ["while the thunder woke her", "when thunder was waking her", "when thunder wakes her", "while thunder was waking"], trap: { text: "when thunder was waking her", exp: "بیدار شدن لحظه‌ای است و woke گذشته ساده می‌خواهد." } },
      { corr: "in the middle of the night.", dist: ["at middle of night.", "on middle night.", "to night middle.", "by night middle."] }
    ]},
    { prompt: "While he was repairing the bicycle,", trans: "زمانی که او داشت دوچرخه را تعمیر می‌کرد، دستش با آچار برید.", steps: [
      { corr: "he cut his finger deeply", dist: ["he was cutting his finger", "he cuts his finger", "he has cut his finger", "he cutting finger"], trap: { text: "he was cutting his finger", exp: "بریدن دست رویداد ناگهانی است و گذشته ساده cut می‌گیرد." } },
      { corr: "with the metal wrench.", dist: ["by metal wrench.", "from metal wrench.", "of metal wrench.", "with wrench metal."] }
    ]},
    { prompt: "We were driving through the mountains", trans: "ما داشتیم از میان کوه‌ها رانندگی می‌کردیم که بنزین ماشین تمام شد.", steps: [
      { corr: "when the car ran out of gas", dist: ["while car ran out of gas", "when car was running out", "when car runs out", "while car runs out"], trap: { text: "when car was running out", exp: "تمام شدن بنزین با گذشته ساده ran out بیان می‌شود." } },
      { corr: "miles from the nearest town.", dist: ["miles of nearest town.", "in miles from town.", "at miles from town.", "to town nearest."] }
    ]},
    { prompt: "While Sarah was studying in London,", trans: "زمانی که سارا در لندن درس می‌خواند، دوستان بین‌المللی زیادی پیدا کرد.", steps: [
      { corr: "she made many lifelong friends", dist: ["she was making many friends", "she makes many friends", "she has made friends", "she making friends"], trap: { text: "she was making many friends", exp: "نتیجه رویداد با گذشته ساده made بیان می‌شود." } },
      { corr: "from all around the world.", dist: ["of all around world.", "in world around.", "at world all.", "by world around."] }
    ]},
    { prompt: "The sun was setting", trans: "خورشید داشت غروب می‌کرد که کوهنوردان به پناهگاه امن قله رسیدند.", steps: [
      { corr: "when the hikers reached the summit", dist: ["while hikers reached summit", "when hikers were reaching", "when hikers reach summit", "while hikers reach"], trap: { text: "while hikers reached summit", exp: "برای رویداد لحظه‌ای رسیدن when + گذشته ساده استفاده می‌شود." } },
      { corr: "before darkness arrived.", dist: ["before of darkness.", "since darkness arrive.", "in darkness arrived.", "at darkness."] }
    ]},
    { prompt: "While you were talking on the phone,", trans: "زمانی که تو داشتی با تلفن صحبت می‌کردی، بسته‌رسان بسته تو را تحویل داد.", steps: [
      { corr: "the courier delivered your parcel", dist: ["the courier was delivering", "courier delivers parcel", "courier has delivered", "courier delivering"], trap: { text: "the courier was delivering", exp: "تحویل بسته عمل گذشته ساده delivered است." } },
      { corr: "to the reception desk.", dist: ["in reception desk.", "at desk reception.", "for reception desk.", "by desk reception."] }
    ]},
    { prompt: "David lost his wallet", trans: "دیوید کیف پولش را زمانی گم کرد که داشت در بازار قدم می‌زد.", steps: [
      { corr: "while he was shopping", dist: ["while he shopped", "when he shops", "while he is shopping", "when he shopping"], trap: { text: "while he shopped", exp: "عمل طولانی‌تر پس‌زمینه با was shopping می‌آید." } },
      { corr: "at the crowded weekend market.", dist: ["in market crowded.", "on weekend market.", "to market crowded.", "by market weekend."] }
    ]},
    { prompt: "While the students were writing the test,", trans: "زمانی که دانش‌آموزان در حال نوشتن امتحان بودند، ناظر دستور توقف داد.", steps: [
      { corr: "the proctor called for silence", dist: ["the proctor was calling", "proctor calls for silence", "proctor has called", "proctor calling"], trap: { text: "the proctor was calling", exp: "دستور دادن گذشته ساده called است." } },
      { corr: "in the examination hall.", dist: ["at hall examination.", "on examination hall.", "to hall examination.", "by hall examination."] }
    ]},
    { prompt: "I was listening to music", trans: "من داشتم به موسیقی گوش می‌دادم که صدای شکستن شیشه را شنیدم.", steps: [
      { corr: "when I heard glass breaking", dist: ["while I heard glass", "when I was hearing glass", "when I hear glass", "while I was hearing"], trap: { text: "when I was hearing glass", exp: "فعل‌های حسی مانند hear حالت استمراری نمی‌گیرند و گذشته ساده heard درست است." } },
      { corr: "in the downstairs hallway.", dist: ["at hallway downstairs.", "on downstairs hallway.", "to hallway downstairs.", "by hallway downstairs."] }
    ]}
  ],

  // Stage 2: Defining Relative Clauses (Who, Which, That, Where)
  2: [
    { prompt: "That is the dedicated teacher", trans: "آن همان معلم فداکاری است که سال گذشته به ما زبان انگلیسی درس داد.", steps: [
      { corr: "who taught us English grammar", dist: ["which taught us English grammar", "where taught us English grammar", "whom taught us grammar", "whose taught us grammar"], trap: { text: "which taught us English grammar", exp: "برای انسان‌ها از ضمیر موصولی who استفاده می‌شود نه which." } },
      { corr: "with endless patience.", dist: ["by endless patience.", "from endless patience.", "with patience endless.", "of endless patience."] }
    ]},
    { prompt: "This is the modern laptop", trans: "این همان لپ‌تاپ مدرنی است که من برای کارهای گرافیکی خریدم.", steps: [
      { corr: "which I bought last month", dist: ["who I bought last month", "where I bought last month", "whom I bought", "whose I bought"], trap: { text: "who I bought last month", exp: "برای اشیا ضمیر موصولی which یا that درست است نه who." } },
      { corr: "for my graphic design work.", dist: ["to my graphic design.", "in graphic design.", "at design graphic.", "with graphic design."] }
    ]},
    { prompt: "I visited the charming city", trans: "من از شهر جذابی دیدن کردم که والدینم سال‌ها در آنجا زندگی می‌کردند.", steps: [
      { corr: "where my parents lived", dist: ["which my parents lived", "who my parents lived", "that my parents lived there", "where my parents lived there"], trap: { text: "which my parents lived", exp: "برای بیان مکان زندگی ضمیر where بدون تکرار there صحیح است." } },
      { corr: "for more than twenty years.", dist: ["since more twenty years.", "in more twenty years.", "at twenty years.", "during twenty years."] }
    ]},
    { prompt: "The architect", trans: "معماری که این برج را طراحی کرد، برنده جایزه بین‌المللی شد.", steps: [
      { corr: "who designed this skyscraper", dist: ["which designed this skyscraper", "where designed skyscraper", "whom designed skyscraper", "whose designed skyscraper"], trap: { text: "which designed this skyscraper", exp: "برای معمار (انسان) who الزامی است." } },
      { corr: "won an international award.", dist: ["wins international award.", "winning international award.", "to win an award.", "for winning award."] }
    ]},
    { prompt: "Here is the Italian restaurant", trans: "اینجا همان رستوران ایتالیایی است که بهترین پاستای شهر را سرو می‌کند.", steps: [
      { corr: "which serves the best pasta", dist: ["who serves best pasta", "where serves best pasta", "whom serves best pasta", "whose serves best pasta"], trap: { text: "where serves best pasta", exp: "چون بعد از موصول بلافاصله فعل serves آمده است، restaurant فاعل جمله موصولی است و which می‌خواهد نه where." } },
      { corr: "in the entire downtown area.", dist: ["at downtown area.", "on downtown area.", "to downtown area.", "by downtown area."] }
    ]},
    { prompt: "The young woman", trans: "زن جوانی که پشت میز پذیرش نشسته بسیار مهربان است.", steps: [
      { corr: "who is sitting at reception", dist: ["which is sitting at reception", "where is sitting at reception", "whose sitting at reception", "whom is sitting"], trap: { text: "which is sitting at reception", exp: "برای انسان who به کار می‌رود." } },
      { corr: "greeted everyone warmly.", dist: ["greets everyone warmly.", "greeting everyone.", "to greet everyone.", "with greet warmly."] }
    ]},
    { prompt: "She showed me the photograph", trans: "او عکسی را به من نشان داد که در طول سفر آفریقا گرفته بود.", steps: [
      { corr: "that she took during her trip", dist: ["who she took during trip", "where she took during trip", "whom she took", "whose she took"], trap: { text: "who she took during trip", exp: "برای عکس that یا which استفاده می‌شود." } },
      { corr: "across the wildlife reserve.", dist: ["in reserve wildlife.", "at wildlife reserve.", "to wildlife reserve.", "by wildlife reserve."] }
    ]},
    { prompt: "This is the quiet library", trans: "این همان کتابخانه آرامی است که من معمولاً برای امتحاناتم در آن درس می‌خوانم.", steps: [
      { corr: "where I usually study", dist: ["which I usually study", "who I usually study", "that I study there", "where I study there"], trap: { text: "which I usually study", exp: "برای مکانی که در آن عمل درس خواندن انجام می‌شود where بدون there می‌آید." } },
      { corr: "for my medical examinations.", dist: ["to medical examinations.", "in medical exam.", "at examinations medical.", "with medical exam."] }
    ]},
    { prompt: "The doctor", trans: "پزشکی که دیروز من را معاینه کرد، داروی بسیار مؤثری تجویز نمود.", steps: [
      { corr: "who examined me yesterday", dist: ["which examined me yesterday", "where examined me", "whom examined me", "whose examined me"], trap: { text: "which examined me yesterday", exp: "برای پزشک who صحیح است." } },
      { corr: "prescribed effective medicine.", dist: ["prescribes medicine effective.", "prescribing medicine.", "to prescribe medicine.", "with medicine effective."] }
    ]},
    { prompt: "The ancient bridge", trans: "پل باستانی که دو محله را به هم وصل می‌کند از سنگ ساخته شده است.", steps: [
      { corr: "which connects the two districts", dist: ["who connects two districts", "where connects two districts", "whom connects districts", "whose connects districts"], trap: { text: "who connects two districts", exp: "برای پل which استفاده می‌شود." } },
      { corr: "was constructed centuries ago.", dist: ["constructed centuries ago.", "is construct ago.", "was construct ago.", "has constructed ago."] }
    ]},
    { prompt: "The students", trans: "دانش‌آموزانی که سخت تلاش کردند همگی نمرات عالی گرفتند.", steps: [
      { corr: "who worked consistently hard", dist: ["which worked consistently hard", "where worked hard", "whom worked hard", "whose worked hard"], trap: { text: "which worked consistently hard", exp: "برای دانش‌آموزان who به کار می‌رود." } },
      { corr: "achieved top academic grades.", dist: ["achieves top grades.", "achieving top grades.", "to achieve top grades.", "for top grades."] }
    ]},
    { prompt: "This is the company", trans: "این همان شرکتی است که تجهیزات پزشکی پیشرفته تولید می‌کند.", steps: [
      { corr: "that produces medical devices", dist: ["who produces medical devices", "where produces medical devices", "whom produces devices", "whose produces devices"], trap: { text: "where produces medical devices", exp: "چون بعد از موصول فعل produces آمده، شرکت فاعل است و that یا which می‌خواهد." } },
      { corr: "for international hospitals.", dist: ["to international hospitals.", "in international hospitals.", "at hospitals international.", "with international hospitals."] }
    ]},
    { prompt: "We found a secluded cove", trans: "ما خلیج دنجی پیدا کردیم که در آن آب دریا کاملاً زلال بود.", steps: [
      { corr: "where the sea water was", dist: ["which the sea water was", "who the water was", "that the water was there", "where the water there"], trap: { text: "which the sea water was", exp: "برای موقعیت مکانی where به کار می‌رود." } },
      { corr: "crystal clear and warm.", dist: ["crystal clearly and warm.", "clear crystal warm.", "warm and clearly.", "with crystal clearly."] }
    ]},
    { prompt: "The mechanic", trans: "مکانیکی که موتور خودرو را تعمیر کرد کار بسیار تمیزی تحویل داد.", steps: [
      { corr: "who fixed our car engine", dist: ["which fixed our car engine", "where fixed car engine", "whom fixed engine", "whose fixed engine"], trap: { text: "which fixed our car engine", exp: "برای مکانیک who الزامی است." } },
      { corr: "did an outstanding job.", dist: ["does an outstanding job.", "doing outstanding job.", "to do outstanding job.", "for outstanding job."] }
    ]},
    { prompt: "I lost the silver key", trans: "من کلید نقره‌ای را گم کردم که در اصلی خانه را باز می‌کند.", steps: [
      { corr: "which opens the main door", dist: ["who opens the main door", "where opens main door", "whom opens main door", "whose opens main door"], trap: { text: "who opens the main door", exp: "برای کلید which یا that می‌آید." } },
      { corr: "to the front hallway.", dist: ["in front hallway.", "at hallway front.", "on front hallway.", "by front hallway."] }
    ]},
    { prompt: "The pilot", trans: "خلبانی که هواپیما را در طوفان به سلامت نشاند شجاعت زیادی نشان داد.", steps: [
      { corr: "who landed the plane safely", dist: ["which landed plane safely", "where landed plane", "whom landed plane", "whose landed plane"], trap: { text: "which landed plane safely", exp: "برای خلبان who استفاده می‌شود." } },
      { corr: "received a medal of honor.", dist: ["receives medal of honor.", "receiving medal.", "to receive medal.", "for medal honor."] }
    ]},
    { prompt: "The mobile phone", trans: "تلفن همراهی که دیروز خریدم باتری فوق‌العاده‌ای دارد.", steps: [
      { corr: "which I bought yesterday", dist: ["who I bought yesterday", "where I bought yesterday", "whom I bought", "whose I bought"], trap: { text: "who I bought yesterday", exp: "برای تلفن which صحیح است." } },
      { corr: "has a very long battery life.", dist: ["have long battery life.", "is long battery life.", "having battery life.", "with battery life long."] }
    ]},
    { prompt: "This is the peaceful town", trans: "این همان شهر آرامی است که پدربزرگ من در آنجا بزرگ شد.", steps: [
      { corr: "where my grandfather grew up", dist: ["which my grandfather grew up", "who my grandfather grew up", "that grandfather grew up there", "where grandfather grew there"], trap: { text: "which my grandfather grew up", exp: "برای مکان بزرگ شدن where درست است." } },
      { corr: "during the early fifties.", dist: ["in early fifties.", "at early fifties.", "on fifties early.", "since early fifties."] }
    ]},
    { prompt: "The scientist", trans: "دانشمندی که واکسن جدید را کشف کرد جایزه معتبری دریافت نمود.", steps: [
      { corr: "who discovered the vaccine", dist: ["which discovered the vaccine", "where discovered vaccine", "whom discovered vaccine", "whose discovered vaccine"], trap: { text: "which discovered the vaccine", exp: "برای دانشمند who می‌آید." } },
      { corr: "saved millions of lives.", dist: ["saves millions lives.", "saving millions lives.", "to save lives.", "with saving lives."] }
    ]},
    { prompt: "I still have the dictionary", trans: "من هنوز فرهنگ لغتی را دارم که پدرم ده سال پیش به من هدیه داد.", steps: [
      { corr: "that my father gave me", dist: ["who my father gave me", "where my father gave me", "whom father gave me", "whose father gave me"], trap: { text: "who my father gave me", exp: "برای فرهنگ لغت that یا which می‌آید نه who." } },
      { corr: "on my tenth birthday.", dist: ["in my tenth birthday.", "at tenth birthday.", "to tenth birthday.", "for birthday tenth."] }
    ]}
  ],

  // Stage 3 to 10 for A2
  3: [
    { prompt: "Have you ever", trans: "آیا تا به حال در طول عمرت سوار بالن هوای گرم شده‌ای؟", steps: [
      { corr: "flown in a hot-air balloon", dist: ["fly in a hot-air balloon", "flew in a hot-air balloon", "flying in balloon", "to fly in balloon"], trap: { text: "flew in a hot-air balloon", exp: "بعد از Have you ever باید شکل سوم فعل (past participle) یعنی flown بیاید نه گذشته ساده (flew)." } },
      { corr: "over the scenic valley?", dist: ["in scenic valley?", "at valley scenic?", "to scenic valley?", "by valley scenic?"] }
    ]},
    { prompt: "She has never", trans: "او هرگز در یک کشور خارجی به تنهایی سفر نکرده است.", steps: [
      { corr: "traveled abroad alone", dist: ["travel abroad alone", "traveled abroad lonely", "traveling abroad alone", "to travel abroad"], trap: { text: "travel abroad alone", exp: "بعد از has never شکل سوم فعل traveled الزامی است." } },
      { corr: "without family members.", dist: ["without of family.", "no with family.", "with no family members.", "without family member."] }
    ]},
    { prompt: "Have you ever", trans: "آیا تا به حال غذای تند مکزیکی در رستوران چشیده‌ای؟", steps: [
      { corr: "eaten spicy Mexican food", dist: ["ate spicy Mexican food", "eat spicy Mexican food", "eating spicy food", "to eat Mexican food"], trap: { text: "ate spicy Mexican food", exp: "قسمت سوم فعل eat کلمه eaten است نه ate." } },
      { corr: "at an authentic bistro?", dist: ["in authentic bistro?", "on bistro authentic?", "to authentic bistro?", "by bistro authentic?"] }
    ]},
    { prompt: "I have never", trans: "من هرگز نهنگ آبی را در اقیانوس آزاد از نزدیک ندیده‌ام.", steps: [
      { corr: "seen a blue whale", dist: ["saw a blue whale", "see a blue whale", "seeing a blue whale", "to see blue whale"], trap: { text: "saw a blue whale", exp: "بعد از have never شکل سوم seen صحیح است نه saw." } },
      { corr: "swimming in open waters.", dist: ["swim in open waters.", "swam in open waters.", "to swim in waters.", "swimming on waters."] }
    ]},
    { prompt: "Has David ever", trans: "آیا دیوید تا به حال به قله یک کوه برفی صعود کرده است؟", steps: [
      { corr: "climbed a snow-capped peak", dist: ["climb a snow-capped peak", "climbs snow-capped peak", "climbing peak", "to climb peak"], trap: { text: "climb a snow-capped peak", exp: "بعد از Has ever شکل سوم climbed می‌آید." } },
      { corr: "in freezing weather conditions?", dist: ["at weather conditions?", "on freezing weather?", "to weather conditions?", "by freezing weather?"] }
    ]},
    { prompt: "We have never", trans: "ما هرگز در هیچ آزمون دانشگاهی رد نشده‌ایم.", steps: [
      { corr: "failed a university exam", dist: ["fail a university exam", "failing exam", "to fail exam", "fails an exam"], trap: { text: "fail a university exam", exp: "شکل سوم failed الزامی است." } },
      { corr: "in our entire academic career.", dist: ["at academic career.", "on career academic.", "to academic career.", "by career academic."] }
    ]},
    { prompt: "Have they ever", trans: "آیا آن‌ها تا به حال در پاریس زندگی کرده‌اند؟", steps: [
      { corr: "lived in a foreign capital", dist: ["live in a foreign capital", "living in foreign capital", "lives in capital", "to live in capital"], trap: { text: "live in a foreign capital", exp: "شکل سوم lived درست است." } },
      { corr: "for more than six months?", dist: ["since six months?", "in six months?", "at six months?", "during six months?"] }
    ]},
    { prompt: "She has never", trans: "او هرگز هیچ رمانی به زبان اسپانیایی نخوانده است.", steps: [
      { corr: "read a Spanish novel", dist: ["reads a Spanish novel", "reading a novel", "to read a novel", "readed novel"], trap: { text: "readed novel", exp: "قسمت سوم فعل read همان read (تلفظ رد) است و ed نمی‌گیرد." } },
      { corr: "from beginning to end.", dist: ["of beginning to end.", "to beginning to end.", "at beginning to end.", "by beginning to end."] }
    ]},
    { prompt: "Have you ever", trans: "آیا تا به حال کلیدهای خانه خود را گم کرده‌ای؟", steps: [
      { corr: "lost your apartment keys", dist: ["lose your apartment keys", "losed apartment keys", "losing keys", "to lose keys"], trap: { text: "lose your apartment keys", exp: "قسمت سوم فعل lose کلمه lost است." } },
      { corr: "late at night?", dist: ["in night late?", "on late night?", "to late night?", "for late night?"] }
    ]},
    { prompt: "He has never", trans: "او هرگز در طول عمرش به کسی دروغ نگفته است.", steps: [
      { corr: "told a deliberate lie", dist: ["tell a deliberate lie", "telled a lie", "telling a lie", "to tell a lie"], trap: { text: "tell a deliberate lie", exp: "قسمت سوم tell کلمه told است." } },
      { corr: "to his close friends.", dist: ["with close friends.", "at close friends.", "for close friends.", "by close friends."] }
    ]},
    { prompt: "Have you ever", trans: "آیا تا به حال در مسابقه دو ماراتن دویده‌ای؟", steps: [
      { corr: "run an official marathon", dist: ["ran an official marathon", "running marathon", "to run marathon", "runs marathon"], trap: { text: "ran an official marathon", exp: "قسمت سوم run همان run است (run-ran-run) نه ran." } },
      { corr: "under four hours?", dist: ["in under four hours?", "at four hours?", "on four hours?", "to four hours?"] }
    ]},
    { prompt: "I have never", trans: "من هرگز برای پرواز هواپیما دیر نکرده‌ام.", steps: [
      { corr: "been late for a flight", dist: ["be late for a flight", "was late for a flight", "were late for flight", "being late flight"], trap: { text: "was late for a flight", exp: "قسمت سوم فعل to be کلمه been است." } },
      { corr: "at any airport.", dist: ["in any airport.", "on any airport.", "to any airport.", "by any airport."] }
    ]},
    { prompt: "Has Sarah ever", trans: "آیا سارا تا به حال با یک فرد مشهور گفتگو کرده است؟", steps: [
      { corr: "spoken with a celebrity", dist: ["spoke with a celebrity", "speak with a celebrity", "speaking celebrity", "to speak celebrity"], trap: { text: "spoke with a celebrity", exp: "قسمت سوم speak کلمه spoken است نه spoke." } },
      { corr: "in an official interview?", dist: ["at official interview?", "on interview official?", "to official interview?", "by official interview?"] }
    ]},
    { prompt: "They have never", trans: "آن‌ها هرگز خودروی برقی مدرن نرانده‌اند.", steps: [
      { corr: "driven an electric vehicle", dist: ["drove an electric vehicle", "drive electric vehicle", "driving vehicle", "to drive vehicle"], trap: { text: "drove an electric vehicle", exp: "قسمت سوم drive کلمه driven است نه drove." } },
      { corr: "on the highway.", dist: ["in the highway.", "at highway.", "to highway.", "by highway."] }
    ]},
    { prompt: "Have you ever", trans: "آیا تا به حال اهرام مصر را دیده‌ای؟", steps: [
      { corr: "visited the ancient pyramids", dist: ["visit ancient pyramids", "visiting pyramids", "visits pyramids", "to visit pyramids"], trap: { text: "visit ancient pyramids", exp: "قسمت سوم visited با ed است." } },
      { corr: "near the Nile river?", dist: ["next Nile river?", "close of river?", "at Nile river?", "by river Nile?"] }
    ]},
    { prompt: "We have never", trans: "ما هرگز در این ساحل شنا نکرده‌ایم.", steps: [
      { corr: "swum in this rough ocean", dist: ["swam in this rough ocean", "swim in this ocean", "swimming in ocean", "to swim ocean"], trap: { text: "swam in this rough ocean", exp: "قسمت سوم swim کلمه swum با u است نه swam." } },
      { corr: "due to dangerous currents.", dist: ["because currents.", "for currents dangerous.", "from currents.", "with currents."] }
    ]},
    { prompt: "Has he ever", trans: "آیا او تا به حال کیف پول گمشده‌ای پیدا کرده است؟", steps: [
      { corr: "found a lost wallet", dist: ["find a lost wallet", "finding wallet", "finds wallet", "to find wallet"], trap: { text: "find a lost wallet", exp: "قسمت سوم find کلمه found است." } },
      { corr: "and returned it to the owner?", dist: ["and return it?", "and returning it?", "and to return it?", "and returns it?"] }
    ]},
    { prompt: "I have never", trans: "من هرگز شترسواری در صحرا را تجربه نکرده‌ام.", steps: [
      { corr: "ridden a camel", dist: ["rode a camel", "ride a camel", "riding a camel", "to ride camel"], trap: { text: "rode a camel", exp: "قسمت سوم ride کلمه ridden است نه rode." } },
      { corr: "across desert sand dunes.", dist: ["in desert sand.", "at dunes sand.", "to desert dunes.", "by desert dunes."] }
    ]},
    { prompt: "Have you ever", trans: "آیا تا به حال نقاشی زیبا با آبرنگ کشیده‌ای؟", steps: [
      { corr: "painted with watercolors", dist: ["paint with watercolors", "painting watercolors", "paints watercolors", "to paint watercolors"], trap: { text: "paint with watercolors", exp: "قسمت سوم painted با ed است." } },
      { corr: "in an art class?", dist: ["at art class?", "on art class?", "to class art?", "by art class?"] }
    ]},
    { prompt: "She has never", trans: "او هرگز در یک هتل پنج ستاره اقامت نداشته است.", steps: [
      { corr: "stayed at a luxury resort", dist: ["stay at luxury resort", "staying at resort", "stays at resort", "to stay at resort"], trap: { text: "stay at luxury resort", exp: "قسمت سوم stayed با ed است." } },
      { corr: "during her vacations.", dist: ["at her vacations.", "on her vacations.", "to her vacations.", "by her vacations."] }
    ]}
  ],

  // Stage 4 to 10 for A2
  4: [
    { prompt: "Travelling by train is", trans: "سفر با قطار به اندازه سفر با هواپیما گران‌قیمت نیست.", steps: [
      { corr: "not as expensive as", dist: ["not expensive as", "not as expensive than", "not more expensive as", "no as expensive as"], trap: { text: "not as expensive than", exp: "در ساختار برابری صفت بین as ... as قرار می‌گیرد نه than." } },
      { corr: "taking an airline flight.", dist: ["to take airline flight.", "take airline flight.", "for take flight.", "in taking flight."] }
    ]},
    { prompt: "This new electric car is", trans: "این خودروی برقی جدید بسیار سریع‌تر و کم‌صداتر از مدل قدیمی است.", steps: [
      { corr: "much faster and quieter than", dist: ["more fast and quiet than", "much fast and quiet as", "more faster than", "as fast and quiet than"], trap: { text: "more faster than", exp: "برای صفت‌های تک‌سیلابی faster با er می‌آید و آوردن more قبل از آن غلط است." } },
      { corr: "the previous diesel model.", dist: ["previous model diesel.", "to diesel model.", "at model diesel.", "for previous model."] }
    ]},
    { prompt: "Mount Everest is", trans: "کوه اورست بلندترین قله در کل جهان است.", steps: [
      { corr: "the highest mountain peak", dist: ["the most high mountain peak", "highest mountain peak", "the more high mountain", "most highest peak"], trap: { text: "the most high mountain peak", exp: "برای صفت تک‌سیلابی high صفت عالی the highest است نه the most high." } },
      { corr: "in the entire world.", dist: ["of the entire world.", "at entire world.", "to world entire.", "by world entire."] }
    ]},
    { prompt: "My apartment is", trans: "آپارتمان من کمی بزرگتر از آپارتمان برادرم است.", steps: [
      { corr: "slightly larger than", dist: ["more larger than", "slightly large as", "as larger than", "larger as"], trap: { text: "more larger than", exp: "کلمه large به larger تبدیل می‌شود و more larger اشتباه فاحش است." } },
      { corr: "my brother's downtown studio.", dist: ["downtown studio my brother.", "to my brother studio.", "at studio brother.", "by brother studio."] }
    ]},
    { prompt: "Today is", trans: "امروز گرم‌ترین روز در این ماه است.", steps: [
      { corr: "the hottest day", dist: ["the most hot day", "hottest day", "the more hot day", "most hottest day"], trap: { text: "the most hot day", exp: "صفت عالی hot کلمه the hottest با تکرار t است." } },
      { corr: "of the entire summer.", dist: ["in entire summer.", "at summer entire.", "to entire summer.", "by summer entire."] }
    ]},
    { prompt: "English is", trans: "زبان انگلیسی به اندازه زبان چینی سنتی دشوار نیست.", steps: [
      { corr: "not as difficult as", dist: ["not difficult as", "not more difficult as", "not as difficult than", "no as difficult as"], trap: { text: "not as difficult than", exp: "ساختار منفی تساوی not as ... as است." } },
      { corr: "traditional Mandarin Chinese.", dist: ["Mandarin Chinese traditional.", "to Mandarin Chinese.", "at Chinese Mandarin.", "by Mandarin Chinese."] }
    ]},
    { prompt: "She is", trans: "او باهوش‌ترین دانش‌آموز در کل کلاس ما است.", steps: [
      { corr: "the most intelligent student", dist: ["the intelligentest student", "most intelligent student", "the more intelligent student", "intelligentest student"], trap: { text: "the intelligentest student", exp: "برای صفت‌های چندسیلابی the most intelligent به کار می‌رود نه پسوند est." } },
      { corr: "in our chemistry cohort.", dist: ["at chemistry cohort.", "of our cohort chemistry.", "to cohort chemistry.", "by cohort chemistry."] }
    ]},
    { prompt: "Living in a village is", trans: "زندگی در روستا به مراتب آرام‌تر از زندگی در کلان‌شهر است.", steps: [
      { corr: "far more peaceful than", dist: ["far peaceful than", "more peaceful as", "far peacefuller than", "peacefuller than"], trap: { text: "far peacefuller than", exp: "برای peaceful از more peaceful استفاده می‌شود." } },
      { corr: "residing in a metropolis.", dist: ["reside in metropolis.", "to reside in city.", "at metropolis reside.", "by metropolis."] }
    ]},
    { prompt: "This smartphone has", trans: "این گوشی هوشمند بهترین دوربین را در میان تمامی مدل‌ها دارد.", steps: [
      { corr: "the best digital camera", dist: ["the goodest camera", "bestest digital camera", "the most good camera", "the better camera"], trap: { text: "the goodest camera", exp: "صفت عالی good کلمه the best است و goodest وجود ندارد." } },
      { corr: "on the consumer market.", dist: ["in market consumer.", "at consumer market.", "to market consumer.", "by consumer market."] }
    ]},
    { prompt: "His test score was", trans: "نمره آزمون او بدتر از نمره آزمون قبلی‌اش بود.", steps: [
      { corr: "worse than", dist: ["badder than", "more bad than", "worse as", "more worse than"], trap: { text: "badder than", exp: "صفت تفضیلی bad کلمه worse است و badder اشتباه است." } },
      { corr: "his previous semester result.", dist: ["previous result his.", "to previous result.", "at semester result.", "by result previous."] }
    ]},
    { prompt: "The red dress is", trans: "لباس قرمز به زیبایی لباس آبی نیست.", steps: [
      { corr: "not as beautiful as", dist: ["not beautiful as", "not as beautiful than", "no as beautiful as", "not more beautiful as"], trap: { text: "not as beautiful than", exp: "ترکیب as ... as برای مقایسه شباهت الزامی است." } },
      { corr: "the blue silk gown.", dist: ["blue gown silk.", "to blue silk gown.", "at silk gown.", "by silk gown."] }
    ]},
    { prompt: "This is", trans: "این جالب‌ترین کتابی است که تا به حال خوانده‌ام.", steps: [
      { corr: "the most interesting book", dist: ["the interestingest book", "most interesting book", "the more interesting book", "interestingest book"], trap: { text: "the interestingest book", exp: "صفت عالی interesting با the most ساخته می‌شود." } },
      { corr: "I have ever read.", dist: ["I ever read.", "I had ever read.", "I have read ever.", "I ever reading."] }
    ]},
    { prompt: "The subway is", trans: "مترو در ساعات شلوغی سریع‌تر از تاکسی است.", steps: [
      { corr: "faster than a taxi", dist: ["more fast than a taxi", "fast than a taxi", "faster as a taxi", "more faster than taxi"], trap: { text: "more fast than a taxi", exp: "برای fast تفضیلی faster است نه more fast." } },
      { corr: "during morning rush hour.", dist: ["in rush hour morning.", "at rush hour.", "to rush hour.", "by rush hour."] }
    ]},
    { prompt: "That was", trans: "آن بدترین تصمیمی بود که هیئت مدیره گرفت.", steps: [
      { corr: "the worst decision", dist: ["the baddest decision", "the most bad decision", "worstest decision", "the more bad decision"], trap: { text: "the baddest decision", exp: "صفت عالی bad کلمه the worst است." } },
      { corr: "made by the board.", dist: ["make by board.", "making by board.", "to make by board.", "for making board."] }
    ]},
    { prompt: "Gold is", trans: "طلا بسیار سنگین‌تر و باارزش‌تر از نقره است.", steps: [
      { corr: "much heavier than silver", dist: ["more heavy than silver", "heavier as silver", "more heavier than silver", "as heavy than silver"], trap: { text: "more heavy than silver", exp: "تفضیلی heavy به صورت heavier است." } },
      { corr: "in mineral composition.", dist: ["at mineral composition.", "to mineral composition.", "on mineral composition.", "by mineral."] }
    ]},
    { prompt: "He is", trans: "او بلندقدترین بازیکن در تیم بسکتبال است.", steps: [
      { corr: "the tallest player", dist: ["the most tall player", "tallest player", "the more tall player", "most tallest player"], trap: { text: "the most tall player", exp: "صفت عالی tall کلمه the tallest است." } },
      { corr: "on the university team.", dist: ["in university team.", "at team university.", "to team university.", "by university team."] }
    ]},
    { prompt: "Winter in Canada is", trans: "زمستان در کانادا بسیار سردتر از فرانسه است.", steps: [
      { corr: "far colder than in France", dist: ["more colder than in France", "far cold as in France", "colder as in France", "more cold than France"], trap: { text: "more colder than in France", exp: "آوردن more قبل از colder اشتباه است." } },
      { corr: "with heavy snowstorms.", dist: ["by snowstorms heavy.", "from heavy snowstorms.", "of snowstorms heavy.", "with snowstorms heavy."] }
    ]},
    { prompt: "This hotel is", trans: "این هتل ارزان‌تر از هتلی است که دیشب در آن ماندیم.", steps: [
      { corr: "cheaper than the one", dist: ["more cheap than the one", "cheap than the one", "cheaper as the one", "more cheaper than one"], trap: { text: "more cheap than the one", exp: "تفضیلی cheap کلمه cheaper است." } },
      { corr: "where we stayed yesterday.", dist: ["which we stayed yesterday.", "who we stayed yesterday.", "that we stayed there.", "where we stayed there."] }
    ]},
    { prompt: "The cheetah is", trans: "یوزپلنگ سریع‌ترین حیوان روی خشکی است.", steps: [
      { corr: "the fastest land mammal", dist: ["the most fast land mammal", "fastest land mammal", "the more fast mammal", "most fastest mammal"], trap: { text: "the most fast land mammal", exp: "صفت عالی the fastest است." } },
      { corr: "on the planet earth.", dist: ["in planet earth.", "at earth planet.", "to planet earth.", "by earth planet."] }
    ]},
    { prompt: "My coffee is", trans: "قهوه من به اندازه قهوه شما شیرین نیست.", steps: [
      { corr: "not as sweet as yours", dist: ["not sweet as yours", "not as sweet than yours", "not more sweet as yours", "no as sweet as yours"], trap: { text: "not as sweet than yours", exp: "ساختار not as sweet as است." } },
      { corr: "because I added no sugar.", dist: ["because I add no sugar.", "for I add no sugar.", "since adding no sugar.", "due to no sugar."] }
    ]}
  ],

  // Stages 5 to 10 for A2
  5: [
    { prompt: "Tomorrow is Sunday, so you", trans: "فردا یکشنبه است، بنابراین نیازی نیست صبح زود بیدار شوی.", steps: [
      { corr: "don't have to wake up early", dist: ["mustn't wake up early", "not have to wake up early", "haven't to wake up early", "don't must wake up early"], trap: { text: "mustn't wake up early", exp: "برای 'عدم نیاز' از don't have to استفاده می‌شود؛ mustn't به معنای 'ممنوع بودن' و غیرقانونی بودن است." } },
      { corr: "for any office meetings.", dist: ["to any office meetings.", "in any office meetings.", "at meetings office.", "with meetings office."] }
    ]},
    { prompt: "You", trans: "شما نباید در داخل محوطه بیمارستان سیگار بکشید؛ این ممنوع است.", steps: [
      { corr: "must not smoke", dist: ["don't have to smoke", "haven't to smoke", "not must smoke", "must not to smoke"], trap: { text: "don't have to smoke", exp: "برای منع و ممنوعیت قطعی must not الزامی است." } },
      { corr: "inside the hospital building.", dist: ["at building hospital.", "on hospital building.", "to hospital building.", "by building hospital."] }
    ]},
    { prompt: "If you feel unwell, you", trans: "اگر حالت خوب نیست، باید به درمانگاه بروی و با یک پزشک مشورت کنی.", steps: [
      { corr: "should consult a doctor", dist: ["should to consult a doctor", "must to consult doctor", "ought consult a doctor", "should consulting doctor"], trap: { text: "should to consult a doctor", exp: "بعد از فعل وجهی should فعل به شکل ساده بدون to می‌آید." } },
      { corr: "without further delay.", dist: ["without of delay.", "no with delay.", "with no delay further.", "without delay further."] }
    ]},
    { prompt: "Every passenger", trans: "هر مسافری باید قبل از سوار شدن به هواپیما کارت پرواز معتبر نشان دهد.", steps: [
      { corr: "has to show a boarding pass", dist: ["have to show boarding pass", "must to show boarding pass", "has to shows boarding pass", "having to show pass"], trap: { text: "have to show boarding pass", exp: "فاعل Every passenger مفرد است و has to می‌گیرد." } },
      { corr: "at the departure gate.", dist: ["in departure gate.", "on gate departure.", "to departure gate.", "by gate departure."] }
    ]},
    { prompt: "You", trans: "برای امتحان فردا نیازی نیست فرهنگ لغت بخرید؛ مدرسه آن را می‌دهد.", steps: [
      { corr: "do not have to purchase", dist: ["must not purchase", "haven't to purchase", "not have to purchase", "don't must purchase"], trap: { text: "must not purchase", exp: "برای عدم نیاز do not have to به کار می‌رود." } },
      { corr: "an expensive dictionary.", dist: ["dictionary expensive an.", "an dictionary expensive.", "to expensive dictionary.", "with expensive dictionary."] }
    ]},
    { prompt: "Students", trans: "دانش‌آموزان نباید در حین امتحان نهایی از تلفن همراه استفاده کنند.", steps: [
      { corr: "must not use mobile phones", dist: ["don't have to use mobile phones", "haven't to use phones", "must not to use phones", "not must use phones"], trap: { text: "don't have to use mobile phones", exp: "استفاده از گوشی در امتحان ممنوع است و must not می‌خواهد." } },
      { corr: "during the examination.", dist: ["in examination during.", "at exam during.", "on examination during.", "for examination."] }
    ]},
    { prompt: "You look exhausted; you", trans: "خیلی خسته به نظر می‌رسی؛ باید کمی استراحت کنی.", steps: [
      { corr: "should take a break", dist: ["should to take a break", "should taking a break", "ought take break", "must to take break"], trap: { text: "should to take a break", exp: "بعد از should حرف اضافه to اشتباه است." } },
      { corr: "and get a good sleep.", dist: ["and gets good sleep.", "and getting sleep.", "and to get sleep.", "and get sleep good."] }
    ]},
    { prompt: "In this country, drivers", trans: "در این کشور، رانندگان باید در سمت چپ جاده رانندگی کنند.", steps: [
      { corr: "have to drive on the left", dist: ["has to drive on the left", "must to drive on the left", "have drive on left", "having to drive left"], trap: { text: "has to drive on the left", exp: "فاعل drivers جمع است و have to می‌خواهد." } },
      { corr: "according to traffic laws.", dist: ["according traffic laws.", "to traffic laws according.", "in traffic laws.", "by traffic laws."] }
    ]},
    { prompt: "Visitors", trans: "بازدیدکنندگان نباید به آثار هنری باستانی در موزه دست بزنند.", steps: [
      { corr: "must not touch the artwork", dist: ["don't have to touch artwork", "must not to touch artwork", "haven't to touch artwork", "not must touch artwork"], trap: { text: "don't have to touch artwork", exp: "دست زدن به آثار موزه اکیداً ممنوع است و must not می‌خواهد." } },
      { corr: "under any circumstances.", dist: ["in any circumstances.", "at circumstances any.", "to circumstances any.", "by any circumstances."] }
    ]},
    { prompt: "It is a free exhibition, so we", trans: "این یک نمایشگاه رایگان است، بنابراین نیازی نیست بلیط ورودی بخریم.", steps: [
      { corr: "don't have to pay anything", dist: ["mustn't pay anything", "haven't to pay anything", "not have to pay anything", "don't must pay anything"], trap: { text: "mustn't pay anything", exp: "عدم نیاز با don't have to بیان می‌شود." } },
      { corr: "for the admission tickets.", dist: ["to admission tickets.", "in admission tickets.", "at tickets admission.", "with tickets admission."] }
    ]},
    { prompt: "You", trans: "شما باید هنگام رانندگی کمربند ایمنی ببندید؛ قانون این را می‌گوید.", steps: [
      { corr: "must wear a seatbelt", dist: ["must to wear a seatbelt", "must wearing seatbelt", "must wears seatbelt", "ought wear seatbelt"], trap: { text: "must to wear a seatbelt", exp: "بعد از must فعل wear ساده بدون to است." } },
      { corr: "at all times on the road.", dist: ["in all times on road.", "on all times on road.", "to all times road.", "by all times road."] }
    ]},
    { prompt: "She", trans: "او سرفه بدی دارد؛ نباید نوشیدنی‌های خیلی یخ بنوشد.", steps: [
      { corr: "should not drink ice water", dist: ["should not to drink ice water", "must not to drink water", "shouldn't drinking water", "ought not drink water"], trap: { text: "should not to drink ice water", exp: "بعد از should not فعل ساده drink می‌آید." } },
      { corr: "until her throat recovers.", dist: ["until of throat recovers.", "since throat recovers.", "before throat recover.", "to throat recovers."] }
    ]},
    { prompt: "We", trans: "ما نیازی نیست لباس رسمی بپوشیم؛ مهمانی خودمانی است.", steps: [
      { corr: "do not have to dress formally", dist: ["must not dress formally", "haven't to dress formally", "not have to dress formally", "don't must dress formally"], trap: { text: "must not dress formally", exp: "عدم اجبار با do not have to می‌آید." } },
      { corr: "for the casual barbecue.", dist: ["to casual barbecue.", "in barbecue casual.", "at barbecue casual.", "with barbecue casual."] }
    ]},
    { prompt: "A doctor", trans: "یک پزشک باید در تصمیم‌گیری‌های جراحی بسیار دقیق و صبور باشد.", steps: [
      { corr: "has to be extremely careful", dist: ["have to be extremely careful", "has to is careful", "must to be careful", "having to be careful"], trap: { text: "have to be extremely careful", exp: "فاعل A doctor مفرد است و has to be می‌گیرد." } },
      { corr: "during complex operations.", dist: ["in complex operations.", "at operations complex.", "to complex operations.", "by complex operations."] }
    ]},
    { prompt: "You", trans: "شما نباید در کتابخانه بلند صحبت کنید؛ دیگران در حال مطالعه هستند.", steps: [
      { corr: "must not talk loudly", dist: ["don't have to talk loudly", "must not to talk loudly", "haven't to talk loudly", "not must talk loudly"], trap: { text: "don't have to talk loudly", exp: "ممنوعیت با must not بیان می‌شود." } },
      { corr: "in the silent reading room.", dist: ["at silent reading room.", "on silent room.", "to room reading.", "by room reading."] }
    ]},
    { prompt: "He has a headache, so he", trans: "او سردرد دارد، بنابراین باید برای مدتی چشمانش را ببندد.", steps: [
      { corr: "should close his eyes", dist: ["should to close his eyes", "should closing eyes", "must to close eyes", "ought close eyes"], trap: { text: "should to close his eyes", exp: "بعد از should فعل ساده close می‌آید." } },
      { corr: "and rest in a dark room.", dist: ["and rests in dark room.", "and resting in room.", "and to rest in room.", "and rest in room dark."] }
    ]},
    { prompt: "We have plenty of food, so you", trans: "ما غذای زیادی داریم، بنابراین نیازی نیست چیز دیگری بپزی.", steps: [
      { corr: "don't have to cook anything", dist: ["mustn't cook anything", "haven't to cook anything", "not have to cook anything", "don't must cook anything"], trap: { text: "mustn't cook anything", exp: "عدم نیاز با don't have to بیان می‌شود." } },
      { corr: "for tonight's dinner.", dist: ["to tonight dinner.", "in tonight dinner.", "at dinner tonight.", "with tonight dinner."] }
    ]},
    { prompt: "Pedestrians", trans: "عابران پیاده باید هنگام عبور از خیابان به چراغ راهنما توجه کنند.", steps: [
      { corr: "have to obey traffic signals", dist: ["has to obey traffic signals", "must to obey signals", "have obey signals", "having to obey signals"], trap: { text: "has to obey traffic signals", exp: "فاعل Pedestrians جمع است و have to می‌گیرد." } },
      { corr: "at every pedestrian crossing.", dist: ["in every crossing.", "on every crossing.", "to crossing every.", "by crossing every."] }
    ]},
    { prompt: "You", trans: "نباید رمز عبور حساب بانکی‌ات را به هیچ‌کس بگویی.", steps: [
      { corr: "must never reveal", dist: ["don't have to reveal", "must not to reveal", "haven't to reveal", "not must reveal"], trap: { text: "don't have to reveal", exp: "افشای رمز اکیداً نباید اتفاق بیفتد و must never می‌خواهد." } },
      { corr: "your private bank password.", dist: ["your password bank private.", "to bank password private.", "at private password.", "by bank password."] }
    ]},
    { prompt: "If you want to pass, you", trans: "اگر می‌خواهی قبول شوی، باید هر روز تمرین‌های بیشتری حل کنی.", steps: [
      { corr: "should practice every day", dist: ["should to practice every day", "should practicing every day", "must to practice every day", "ought practice every day"], trap: { text: "should to practice every day", exp: "بعد از should فعل ساده practice بدون to می‌آید." } },
      { corr: "with past examination papers.", dist: ["by past examination papers.", "from past papers.", "with papers exam.", "of past papers."] }
    ]}
  ],

  6: [
    { prompt: "If it rains tomorrow,", trans: "اگر فردا باران ببارد، ما برنامه پیکنیک را لغو خواهیم کرد.", steps: [
      { corr: "we will cancel the picnic", dist: ["we cancel the picnic", "we would cancel the picnic", "we will to cancel picnic", "we canceled picnic"], trap: { text: "we would cancel the picnic", exp: "در شرطی نوع اول در جواب شرط will + فعل ساده می‌آید نه would." } },
      { corr: "and stay safely indoors.", dist: ["and stays indoors.", "and staying indoors.", "and to stay indoors.", "and stayed indoors."] }
    ]},
    { prompt: "If you study hard for the exam,", trans: "اگر برای امتحان سخت درس بخوانی، نمره عالی کسب خواهی کرد.", steps: [
      { corr: "you will get top marks", dist: ["you get top marks", "you would get top marks", "you will to get marks", "you got marks"], trap: { text: "you would get top marks", exp: "در شرطی نوع اول از will get استفاده می‌شود." } },
      { corr: "in all subject categories.", dist: ["at all categories.", "to categories all.", "on all categories.", "by all categories."] }
    ]},
    { prompt: "Unless you leave right now,", trans: "مگر اینکه همین الان راه بیفتی، وگرنه به پروازت نخواهی رسید.", steps: [
      { corr: "you will miss the flight", dist: ["you miss the flight", "you would miss the flight", "you will to miss flight", "you missed flight"], trap: { text: "you would miss the flight", exp: "جواب شرط با will miss می‌آید." } },
      { corr: "to the international summit.", dist: ["in international summit.", "at summit international.", "for international summit.", "by international summit."] }
    ]},
    { prompt: "If she arrives early,", trans: "اگر او زود برسد، ما با هم یک فنجان قهوه داغ خواهیم نوشید.", steps: [
      { corr: "we will drink coffee together", dist: ["we drink coffee together", "we would drink coffee", "we will to drink coffee", "we drank coffee"], trap: { text: "we would drink coffee", exp: "با شرطی نوع اول will drink می‌آید." } },
      { corr: "at the cozy cafe.", dist: ["in cozy cafe.", "on cozy cafe.", "to cafe cozy.", "by cozy cafe."] }
    ]},
    { prompt: "If they don't hurry,", trans: "اگر آن‌ها عجله نکنند، قطار سریع‌السیر را از دست خواهند داد.", steps: [
      { corr: "they will miss the train", dist: ["they miss the train", "they would miss the train", "they will to miss train", "they missed train"], trap: { text: "they would miss the train", exp: "در شرطی اول will miss درست است." } },
      { corr: "at platform number two.", dist: ["in platform two.", "on platform two.", "to platform two.", "by platform two."] }
    ]},
    { prompt: "If I find your missing keys,", trans: "اگر کلیدهای گم‌شده‌ات را پیدا کنم، بلافاصله با تو تماس خواهم گرفت.", steps: [
      { corr: "I will call you immediately", dist: ["I call you immediately", "I would call you", "I will to call you", "I called you"], trap: { text: "I would call you", exp: "برای امکان واقعی آینده will call می‌آید." } },
      { corr: "on your mobile phone.", dist: ["in your mobile phone.", "at mobile phone your.", "to your mobile phone.", "by mobile phone."] }
    ]},
    { prompt: "If he passes the driving test,", trans: "اگر او در آزمون رانندگی قبول شود، پدرش برای او یک ماشین خواهد خرید.", steps: [
      { corr: "his father will buy him a car", dist: ["his father buys him a car", "father would buy him a car", "father will to buy car", "father bought him car"], trap: { text: "father would buy him a car", exp: "در شرطی نوع اول will buy صحیح است." } },
      { corr: "for his daily commute.", dist: ["to daily commute.", "in daily commute.", "at commute daily.", "with daily commute."] }
    ]},
    { prompt: "If we don't protect the forest,", trans: "اگر از جنگل محافظت نکنیم، بسیاری از گونه‌های حیوانی ناپدید خواهند شد.", steps: [
      { corr: "many animal species will disappear", dist: ["many species disappear", "species would disappear", "species will to disappear", "species disappeared"], trap: { text: "species would disappear", exp: "در شرطی اول will disappear می‌آید." } },
      { corr: "from their natural habitat.", dist: ["of natural habitat.", "in natural habitat.", "at habitat natural.", "by natural habitat."] }
    ]},
    { prompt: "If you don't eat breakfast,", trans: "اگر صبحانه نخوری، قبل از ظهر در کلاس احساس گرسنگی خواهی کرد.", steps: [
      { corr: "you will feel very hungry", dist: ["you feel very hungry", "you would feel hungry", "you will to feel hungry", "you felt hungry"], trap: { text: "you would feel hungry", exp: "جواب شرط نوع اول will feel است." } },
      { corr: "before noon arrives.", dist: ["before of noon.", "since noon arrives.", "at noon arrive.", "to noon arrives."] }
    ]},
    { prompt: "If the price drops,", trans: "اگر قیمت کاهش یابد، من دو جفت از این کفش‌های ورزشی را خواهم خرید.", steps: [
      { corr: "I will buy two pairs", dist: ["I buy two pairs", "I would buy two pairs", "I will to buy pairs", "I bought two pairs"], trap: { text: "I would buy two pairs", exp: "در شرطی نوع اول will buy درست است." } },
      { corr: "for my running sessions.", dist: ["to running sessions.", "in running sessions.", "at sessions running.", "with running sessions."] }
    ]},
    { prompt: "If she doesn't feel well,", trans: "اگر او حالش خوب نباشد، امروز در خانه خواهد ماند.", steps: [
      { corr: "she will stay at home", dist: ["she stays at home", "she would stay at home", "she will to stay home", "she stayed at home"], trap: { text: "she would stay at home", exp: "جواب شرط اول will stay است." } },
      { corr: "and rest peacefully.", dist: ["and rests peacefully.", "and resting peacefully.", "and to rest peacefully.", "and rested peacefully."] }
    ]},
    { prompt: "If you invite them politely,", trans: "اگر آن‌ها را مودبانه دعوت کنی، آن‌ها با خوشحالی به مهمانی تو خواهند آمد.", steps: [
      { corr: "they will gladly attend", dist: ["they gladly attend", "they would attend", "they will to attend", "they attended"], trap: { text: "they would attend", exp: "جواب شرط اول will attend است." } },
      { corr: "your graduation party.", dist: ["to graduation party.", "in party graduation.", "at graduation party.", "for party graduation."] }
    ]},
    { prompt: "If the train is delayed,", trans: "اگر قطار تاخیر داشته باشد، ما جلسه مهم را از دست خواهیم داد.", steps: [
      { corr: "we will miss the meeting", dist: ["we miss the meeting", "we would miss the meeting", "we will to miss meeting", "we missed meeting"], trap: { text: "we would miss the meeting", exp: "پاسخ شرط اول will miss است." } },
      { corr: "with foreign investors.", dist: ["by foreign investors.", "from foreign investors.", "with investors foreign.", "of foreign investors."] }
    ]},
    { prompt: "If it gets colder tonight,", trans: "اگر امشب هوا سردتر شود، من بخاری برقی اتاق را روشن خواهم کرد.", steps: [
      { corr: "I will turn on the heater", dist: ["I turn on the heater", "I would turn on heater", "I will to turn heater", "I turned on heater"], trap: { text: "I would turn on heater", exp: "در شرطی نوع اول will turn on صحیح است." } },
      { corr: "in the bedroom.", dist: ["at bedroom.", "on bedroom.", "to bedroom.", "by bedroom."] }
    ]},
    { prompt: "Unless we leave early,", trans: "مگر اینکه زود حرکت کنیم، وگرنه در ترافیک سنگین صبحگاهی گیر خواهیم افتاد.", steps: [
      { corr: "we will get stuck in traffic", dist: ["we get stuck in traffic", "we would get stuck", "we will to get stuck", "we got stuck"], trap: { text: "we would get stuck", exp: "در شرطی نوع اول will get stuck می‌آید." } },
      { corr: "on the main highway.", dist: ["in main highway.", "at highway main.", "to highway main.", "by highway main."] }
    ]},
    { prompt: "If you ask the teacher,", trans: "اگر از معلم بپرسی، او این مبحث دشوار را با مهربانی برایت توضیح خواهد داد.", steps: [
      { corr: "she will explain the concept", dist: ["she explains the concept", "she would explain concept", "she will to explain", "she explained concept"], trap: { text: "she would explain concept", exp: "در شرطی اول will explain درست است." } },
      { corr: "with clear examples.", dist: ["by clear examples.", "from clear examples.", "with examples clear.", "of clear examples."] }
    ]},
    { prompt: "If he saves enough money,", trans: "اگر او پول کافی پس‌انداز کند، تابستان آینده به ژاپن سفر خواهد کرد.", steps: [
      { corr: "he will travel to Japan", dist: ["he travels to Japan", "he would travel to Japan", "he will to travel Japan", "he traveled to Japan"], trap: { text: "he would travel to Japan", exp: "در شرطی اول will travel به کار می‌رود." } },
      { corr: "for a cultural vacation.", dist: ["to cultural vacation.", "in vacation cultural.", "at cultural vacation.", "with cultural vacation."] }
    ]},
    { prompt: "If we work together as a team,", trans: "اگر به عنوان یک تیم با هم کار کنیم، قبل از موعد کار را تمام خواهیم کرد.", steps: [
      { corr: "we will finish the project", dist: ["we finish the project", "we would finish project", "we will to finish project", "we finished project"], trap: { text: "we would finish project", exp: "در شرطی اول will finish می‌آید." } },
      { corr: "ahead of schedule.", dist: ["ahead schedule.", "in ahead of schedule.", "at schedule ahead.", "to schedule ahead."] }
    ]},
    { prompt: "If you drink too much coffee,", trans: "اگر بیش از حد قهوه بنوشی، امشب به سختی به خواب خواهی رفت.", steps: [
      { corr: "you will struggle to sleep", dist: ["you struggle to sleep", "you would struggle to sleep", "you will to struggle", "you struggled to sleep"], trap: { text: "you would struggle to sleep", exp: "در شرطی اول will struggle به کار می‌رود." } },
      { corr: "throughout the night.", dist: ["along the night.", "in night through.", "at night.", "by night."] }
    ]},
    { prompt: "If the sun shines brightly,", trans: "اگر خورشید به روشنی بتابد، ما برای پیاده‌روی به ساحل دریا خواهیم رفت.", steps: [
      { corr: "we will go to the beach", dist: ["we go to the beach", "we would go to beach", "we will to go beach", "we went to the beach"], trap: { text: "we would go to beach", exp: "در شرطی اول will go درست است." } },
      { corr: "and swim in the waves.", dist: ["and swims in waves.", "and swimming in waves.", "and to swim in waves.", "and swam in waves."] }
    ]}
  ],

  7: [
    { prompt: "She decided", trans: "او تصمیم گرفت برای پیشرفت شغلی خود در یک دوره آموزشی شرکت کند.", steps: [
      { corr: "to enroll in a course", dist: ["enrolling in a course", "enroll in a course", "to enrolling in course", "for enroll in course"], trap: { text: "enrolling in a course", exp: "بعد از فعل decide مصدر با to (to enroll) الزامی است." } },
      { corr: "for career advancement.", dist: ["to career advancement.", "in career advancement.", "at advancement career.", "with career advancement."] }
    ]},
    { prompt: "David enjoys", trans: "دیوید از خواندن رمان‌های علمی‌تخیلی در اوقات فراغت بسیار لذت می‌برد.", steps: [
      { corr: "reading science fiction", dist: ["to read science fiction", "read science fiction", "to reading fiction", "for reading fiction"], trap: { text: "to read science fiction", exp: "بعد از فعل enjoy همیشه اسم مصدر با ing (reading) می‌آید نه to read." } },
      { corr: "in his spare time.", dist: ["at his spare time.", "on spare time.", "to spare time.", "by spare time."] }
    ]},
    { prompt: "We promised", trans: "ما قول دادیم که حقیقت ماجرا را به مدیر بگوییم.", steps: [
      { corr: "to tell the truth", dist: ["telling the truth", "tell the truth", "to telling truth", "for telling truth"], trap: { text: "telling the truth", exp: "بعد از promise مصدر با to tell می‌آید." } },
      { corr: "to the branch manager.", dist: ["at branch manager.", "with manager branch.", "for branch manager.", "by manager branch."] }
    ]},
    { prompt: "They avoided", trans: "آن‌ها با حرکت در مسیر کمربندی، از گیر افتادن در ترافیک اجتناب کردند.", steps: [
      { corr: "driving during rush hour", dist: ["to drive during rush hour", "drive during rush hour", "to driving rush hour", "for drive rush hour"], trap: { text: "to drive during rush hour", exp: "بعد از avoid اسم مصدر driving می‌آید." } },
      { corr: "by taking the ring road.", dist: ["in taking ring road.", "with take ring road.", "to take ring road.", "for taking ring road."] }
    ]},
    { prompt: "I hope", trans: "من امیدوارم که تابستان آینده از برج ایفل در پاریس دیدن کنم.", steps: [
      { corr: "to visit Paris", dist: ["visiting Paris", "visit Paris", "to visiting Paris", "for visiting Paris"], trap: { text: "visiting Paris", exp: "بعد از hope مصدر to visit می‌آید." } },
      { corr: "during the summer holidays.", dist: ["at summer holidays.", "in holidays summer.", "for holiday summer.", "on holiday summer."] }
    ]},
    { prompt: "Sarah finished", trans: "سارا نوشتن پایان‌نامه کارشناسی ارشد خود را به موقع تمام کرد.", steps: [
      { corr: "writing her thesis", dist: ["to write her thesis", "write her thesis", "to writing thesis", "for writing thesis"], trap: { text: "to write her thesis", exp: "بعد از finish اسم مصدر writing می‌آید." } },
      { corr: "before the final deadline.", dist: ["before of deadline.", "to final deadline.", "in deadline final.", "at deadline final."] }
    ]},
    { prompt: "He agreed", trans: "او موافقت کرد که در ترجمه متون پیچیده آلمانی به من کمک کند.", steps: [
      { corr: "to help me translate", dist: ["helping me translate", "help me translate", "to helping me", "for help me"], trap: { text: "helping me translate", exp: "بعد از agree مصدر to help درست است." } },
      { corr: "the technical documents.", dist: ["documents technical.", "in technical documents.", "to technical documents.", "at documents."] }
    ]},
    { prompt: "Do you mind", trans: "آیا اشکالی ندارد که برای تهویه هوا پنجره را باز کنی؟", steps: [
      { corr: "opening the window", dist: ["to open the window", "open the window", "to opening window", "for open window"], trap: { text: "to open the window", exp: "بعد از عبارت Do you mind اسم مصدر opening می‌آید." } },
      { corr: "for fresh ventilation?", dist: ["to fresh ventilation?", "in fresh ventilation?", "at ventilation fresh?", "with ventilation fresh?"] }
    ]},
    { prompt: "We planned", trans: "ما برنامه‌ریزی کردیم که کلبه‌ای در کوهستان برفی اجاره کنیم.", steps: [
      { corr: "to rent a cabin", dist: ["renting a cabin", "rent a cabin", "to renting cabin", "for rent cabin"], trap: { text: "renting a cabin", exp: "بعد از plan مصدر to rent می‌آید." } },
      { corr: "in the snowy mountains.", dist: ["at snowy mountains.", "on snowy mountains.", "to snowy mountains.", "by mountains snowy."] }
    ]},
    { prompt: "He suggested", trans: "او پیشنهاد کرد که امشب برای شام پیتزای خانگی درست کنیم.", steps: [
      { corr: "making homemade pizza", dist: ["to make homemade pizza", "make homemade pizza", "to making pizza", "for make pizza"], trap: { text: "to make homemade pizza", exp: "بعد از suggest اسم مصدر making الزامی است." } },
      { corr: "with fresh ingredients.", dist: ["by fresh ingredients.", "from fresh ingredients.", "with ingredients fresh.", "of fresh ingredients."] }
    ]},
    { prompt: "She refused", trans: "او از امضای قرارداد غیرمنصفانه کاری خودداری کرد.", steps: [
      { corr: "to sign the contract", dist: ["signing the contract", "sign the contract", "to signing contract", "for signing contract"], trap: { text: "signing the contract", exp: "بعد از refuse مصدر to sign می‌آید." } },
      { corr: "without legal advice.", dist: ["without of advice.", "no with advice.", "with no legal advice.", "without advice legal."] }
    ]},
    { prompt: "I keep", trans: "من مدام کلیدهایم را در مکان‌های مختلف فراموش می‌کنم.", steps: [
      { corr: "forgetting my keys", dist: ["to forget my keys", "forget my keys", "to forgetting keys", "for forget keys"], trap: { text: "to forget my keys", exp: "بعد از keep فعل با ing می‌آید (forgetting)." } },
      { corr: "around the house.", dist: ["in around house.", "at house around.", "to house around.", "by house around."] }
    ]},
    { prompt: "The students managed", trans: "دانش‌آموزان موفق شدند این تمرین پیچیده را حل کنند.", steps: [
      { corr: "to solve the puzzle", dist: ["solving the puzzle", "solve the puzzle", "to solving puzzle", "for solve puzzle"], trap: { text: "solving the puzzle", exp: "بعد از manage مصدر to solve می‌آید." } },
      { corr: "before the bell rang.", dist: ["before of bell.", "since bell rang.", "in bell rang.", "at bell rang."] }
    ]},
    { prompt: "She can't stand", trans: "او تحمل ندارد که در صف‌های طولانی منتظر بماند.", steps: [
      { corr: "waiting in long lines", dist: ["to wait in long lines", "wait in long lines", "to waiting in lines", "for wait lines"], trap: { text: "to wait in long lines", exp: "بعد از can't stand فعل با ing می‌آید (waiting)." } },
      { corr: "at the supermarket.", dist: ["in supermarket.", "on supermarket.", "to supermarket.", "by supermarket."] }
    ]},
    { prompt: "They offered", trans: "آن‌ها پیشنهاد دادند که چمدان‌های سنگین ما را حمل کنند.", steps: [
      { corr: "to carry our luggage", dist: ["carrying our luggage", "carry our luggage", "to carrying luggage", "for carry luggage"], trap: { text: "carrying our luggage", exp: "بعد از offer مصدر to carry می‌آید." } },
      { corr: "up the steep stairs.", dist: ["in steep stairs.", "at stairs steep.", "to stairs steep.", "by stairs steep."] }
    ]},
    { prompt: "He gave up", trans: "او سال گذشته پس از سال‌ها سیگار کشیدن را ترک کرد.", steps: [
      { corr: "smoking cigarettes", dist: ["to smoke cigarettes", "smoke cigarettes", "to smoking cigarettes", "for smoke cigarettes"], trap: { text: "to smoke cigarettes", exp: "بعد از عبارت فعلی give up اسم مصدر smoking می‌آید." } },
      { corr: "for health reasons.", dist: ["to health reasons.", "in health reasons.", "at reasons health.", "with health reasons."] }
    ]},
    { prompt: "I forgot", trans: "من فراموش کردم که قبل از خروج درها را قفل کنم.", steps: [
      { corr: "to lock the door", dist: ["locking the door", "lock the door", "to locking door", "for lock door"], trap: { text: "locking the door", exp: "برای فراموش کردن انجام کاری to lock می‌آید." } },
      { corr: "before I left home.", dist: ["before of leaving.", "since I left.", "in leaving home.", "at leaving home."] }
    ]},
    { prompt: "She admitted", trans: "او اعتراف کرد که در محاسبه آمار مرتکب اشتباه شده است.", steps: [
      { corr: "making a calculation mistake", dist: ["to make a mistake", "make a mistake", "to making a mistake", "for make mistake"], trap: { text: "to make a mistake", exp: "بعد از admit اسم مصدر making می‌آید." } },
      { corr: "in the accounting report.", dist: ["at accounting report.", "on accounting report.", "to report accounting.", "by accounting report."] }
    ]},
    { prompt: "We chose", trans: "ما تصمیم گرفتیم که در یک هتل بوم‌گردی دنج اقامت کنیم.", steps: [
      { corr: "to stay at an eco-lodge", dist: ["staying at an eco-lodge", "stay at an eco-lodge", "to staying at lodge", "for stay at lodge"], trap: { text: "staying at an eco-lodge", exp: "بعد از choose مصدر to stay می‌آید." } },
      { corr: "near the nature reserve.", dist: ["next nature reserve.", "close of reserve.", "at nature reserve.", "by reserve nature."] }
    ]},
    { prompt: "He dislikes", trans: "او از اتو کشیدن پیراهن‌های رسمی در صبح‌ها بدش می‌آید.", steps: [
      { corr: "ironing formal shirts", dist: ["to iron formal shirts", "iron formal shirts", "to ironing shirts", "for iron shirts"], trap: { text: "to iron formal shirts", exp: "بعد از dislike اسم مصدر ironing می‌آید." } },
      { corr: "on Monday mornings.", dist: ["in Monday mornings.", "at Monday mornings.", "to Monday mornings.", "by Monday mornings."] }
    ]}
  ],

  8: [
    { prompt: "This ancient castle", trans: "این قلعه باستانی در قرن چهاردهم میلادی ساخته شد.", steps: [
      { corr: "was built by craftsmen", dist: ["built by craftsmen", "is built by craftsmen", "was build by craftsmen", "were built by craftsmen"], trap: { text: "was build by craftsmen", exp: "در مجهول گذشته ساختار was + قسمت سوم (built) است نه build." } },
      { corr: "in the fourteenth century.", dist: ["on fourteenth century.", "at fourteenth century.", "to century fourteenth.", "by century fourteenth."] }
    ]},
    { prompt: "These organic apples", trans: "این سیب‌های ارگانیک هر روز صبح توسط کشاورزان محلی چیده می‌شوند.", steps: [
      { corr: "are picked fresh", dist: ["is picked fresh", "are pick fresh", "picked fresh", "be picked fresh"], trap: { text: "is picked fresh", exp: "فاعل these apples جمع است و are picked می‌گیرد." } },
      { corr: "by local farmers.", dist: ["from local farmers.", "with local farmers.", "of local farmers.", "to local farmers."] }
    ]},
    { prompt: "The Mona Lisa", trans: "تابلو مونا لیزا توسط لئوناردو داوینچی نقاشی شد.", steps: [
      { corr: "was painted", dist: ["is painted", "painted", "was paint", "were painted"], trap: { text: "was paint", exp: "شکل سوم painted با ed است." } },
      { corr: "by Leonardo da Vinci.", dist: ["from Leonardo da Vinci.", "with Leonardo da Vinci.", "of Leonardo da Vinci.", "to Leonardo da Vinci."] }
    ]},
    { prompt: "Millions of emails", trans: "میلیون‌ها ایمیل روزانه در سرتاسر جهان ارسال می‌شوند.", steps: [
      { corr: "are sent globally", dist: ["is sent globally", "are send globally", "sent globally", "be sent globally"], trap: { text: "is sent globally", exp: "فاعل emails جمع است و are sent می‌خواهد." } },
      { corr: "every single day.", dist: ["in every single day.", "at every single day.", "on single day every.", "by single day."] }
    ]},
    { prompt: "The golden ring", trans: "انگشتر طلا دیروز در باغچه خانه پیدا شد.", steps: [
      { corr: "was found safely", dist: ["is found safely", "was find safely", "found safely", "were found safely"], trap: { text: "was find safely", exp: "قسمت سوم find کلمه found است." } },
      { corr: "in the backyard garden.", dist: ["at garden backyard.", "on backyard garden.", "to backyard garden.", "by backyard garden."] }
    ]},
    { prompt: "English", trans: "زبان انگلیسی به عنوان زبان بین‌المللی در مدارس تدریس می‌شود.", steps: [
      { corr: "is taught widely", dist: ["are taught widely", "is teach widely", "taught widely", "is teached widely"], trap: { text: "is teached widely", exp: "قسمت سوم teach کلمه taught است نه teached." } },
      { corr: "in primary schools.", dist: ["at primary schools.", "on schools primary.", "to primary schools.", "by schools primary."] }
    ]},
    { prompt: "The damaged car", trans: "اتومبیل آسیب‌دیده با جرثقیل به تعمیرگاه منتقل شد.", steps: [
      { corr: "was towed away", dist: ["were towed away", "is towed away", "was tow away", "towed away"], trap: { text: "were towed away", exp: "اتومبیل مفرد است و was towed می‌گیرد." } },
      { corr: "to the local repair shop.", dist: ["in repair shop.", "at shop repair.", "on repair shop.", "by repair shop."] }
    ]},
    { prompt: "Thousands of books", trans: "هزاران کتاب هر سال در این کتابخانه چاپ و نگهداری می‌شوند.", steps: [
      { corr: "are published and stored", dist: ["is published and stored", "are publish and store", "published and stored", "be published"], trap: { text: "is published and stored", exp: "کلمه books جمع است و are می‌خواهد." } },
      { corr: "in the university archives.", dist: ["at university archives.", "on archives university.", "to university archives.", "by archives."] }
    ]},
    { prompt: "The stolen bicycle", trans: "دوچرخه دزدیده‌شده توسط ماموران پلیس پیدا شد.", steps: [
      { corr: "was recovered quickly", dist: ["were recovered quickly", "is recovered quickly", "was recover quickly", "recovered quickly"], trap: { text: "were recovered quickly", exp: "دوچرخه مفرد است و was recovered می‌گیرد." } },
      { corr: "by the city police.", dist: ["from city police.", "with city police.", "of city police.", "to city police."] }
    ]},
    { prompt: "Delicious traditional meals", trans: "غذاهای سنتی خوشمزه با مواد اولیه تازه پخته می‌شوند.", steps: [
      { corr: "are cooked with care", dist: ["is cooked with care", "are cook with care", "cooked with care", "be cooked with care"], trap: { text: "is cooked with care", exp: "فاعل meals جمع است و are cooked می‌گیرد." } },
      { corr: "in the family restaurant.", dist: ["at family restaurant.", "on restaurant family.", "to family restaurant.", "by restaurant family."] }
    ]},
    { prompt: "The Eiffel Tower", trans: "برج ایفل برای نمایشگاه جهانی سال ۱۸۸۹ ساخته شد.", steps: [
      { corr: "was constructed in Paris", dist: ["were constructed in Paris", "is constructed in Paris", "was construct in Paris", "constructed in Paris"], trap: { text: "were constructed in Paris", exp: "برج مفرد است و was constructed می‌گیرد." } },
      { corr: "for the World Fair.", dist: ["to World Fair.", "in World Fair.", "at Fair World.", "by World Fair."] }
    ]},
    { prompt: "Fresh bread", trans: "نان تازه هر روز صبح زود در این نانوایی پخته می‌شود.", steps: [
      { corr: "is baked fresh", dist: ["are baked fresh", "is bake fresh", "baked fresh", "be baked fresh"], trap: { text: "are baked fresh", exp: "کلمه bread غیرقابل شمارش است و is baked می‌گیرد." } },
      { corr: "every morning at dawn.", dist: ["in every morning dawn.", "at morning dawn every.", "to dawn morning.", "by dawn morning."] }
    ]},
    { prompt: "The secret documents", trans: "اسناد محرمانه در یک گاوصندوق فولادی نگهداری می‌شدند.", steps: [
      { corr: "were kept securely", dist: ["was kept securely", "are kept securely", "were keep securely", "kept securely"], trap: { text: "was kept securely", exp: "کلمه documents جمع است و were kept می‌خواهد." } },
      { corr: "inside a steel safe.", dist: ["at steel safe.", "on steel safe.", "to safe steel.", "by steel safe."] }
    ]},
    { prompt: "Coffee beans", trans: "دانه‌های قهوه در کشورهای گرمسیری کشت و برداشت می‌شوند.", steps: [
      { corr: "are grown and harvested", dist: ["is grown and harvested", "are grow and harvest", "grown and harvested", "be grown"], trap: { text: "is grown and harvested", exp: "فاعل beans جمع است و are grown می‌گیرد." } },
      { corr: "in tropical climates.", dist: ["at tropical climates.", "on climates tropical.", "to tropical climates.", "by climates."] }
    ]},
    { prompt: "The broken window", trans: "پنجره شکسته دیروز توسط یک شیشه‌بر ماهر تعویض شد.", steps: [
      { corr: "was replaced immediately", dist: ["were replaced immediately", "is replaced immediately", "was replace", "replaced immediately"], trap: { text: "were replaced immediately", exp: "پنجره مفرد است و was replaced می‌گیرد." } },
      { corr: "by an experienced glazier.", dist: ["from glazier.", "with glazier.", "of glazier.", "to glazier."] }
    ]},
    { prompt: "Olympic gold medals", trans: "مدال‌های طلای المپیک به قهرمانان برتر اهدا می‌شوند.", steps: [
      { corr: "are awarded to champions", dist: ["is awarded to champions", "are award to champions", "awarded to champions", "be awarded"], trap: { text: "is awarded to champions", exp: "فاعل medals جمع است و are awarded می‌گیرد." } },
      { corr: "at the podium ceremony.", dist: ["in podium ceremony.", "on ceremony podium.", "to podium ceremony.", "by ceremony."] }
    ]},
    { prompt: "The ancient temple", trans: "معبد باستانی در جریان زلزله به شدت آسیب دید.", steps: [
      { corr: "was severely damaged", dist: ["were severely damaged", "is damaged severely", "was damage severely", "damaged severely"], trap: { text: "were severely damaged", exp: "معبد مفرد است و was damaged می‌گیرد." } },
      { corr: "during the seismic tremors.", dist: ["in seismic tremors.", "at tremors seismic.", "to tremors seismic.", "by tremors."] }
    ]},
    { prompt: "Credit cards", trans: "کارت‌های اعتباری در اکثر فروشگاه‌های معتبر شهر پذیرفته می‌شوند.", steps: [
      { corr: "are accepted widely", dist: ["is accepted widely", "are accept widely", "accepted widely", "be accepted widely"], trap: { text: "is accepted widely", exp: "کلمه cards جمع است و are accepted می‌گیرد." } },
      { corr: "at all shopping centers.", dist: ["in shopping centers all.", "on shopping centers.", "to centers shopping.", "by shopping centers."] }
    ]},
    { prompt: "The missing child", trans: "کودک گمشده پس از جستجوی طولانی صحیح و سالم پیدا شد.", steps: [
      { corr: "was found safe and sound", dist: ["were found safe and sound", "is found safe", "was find safe", "found safe"], trap: { text: "were found safe and sound", exp: "کودک مفرد است و was found می‌گیرد." } },
      { corr: "by local rescue volunteers.", dist: ["from rescue volunteers.", "with rescue volunteers.", "of volunteers.", "to volunteers."] }
    ]},
    { prompt: "Spanish and Portuguese", trans: "زبان اسپانیایی و پرتغالی در آمریکای جنوبی صحبت می‌شوند.", steps: [
      { corr: "are spoken extensively", dist: ["is spoken extensively", "are speak extensively", "spoken extensively", "be spoken"], trap: { text: "is spoken extensively", exp: "دو زبان با هم جمع هستند و are spoken می‌خواهند." } },
      { corr: "across South America.", dist: ["in South America across.", "at South America.", "to South America.", "by South America."] }
    ]}
  ],

  9: [
    { prompt: "When I was a student, I", trans: "وقتی دانشجو بودم، عادت داشتم هر روز با دوچرخه به دانشگاه بروم.", steps: [
      { corr: "used to ride my bicycle", dist: ["used to riding my bicycle", "use to ride my bicycle", "was used to ride bicycle", "am used to ride bicycle"], trap: { text: "used to riding my bicycle", exp: "برای بیان عادت گذشته used to + شکل ساده فعل (ride) درست است نه فعل با ing." } },
      { corr: "to university every morning.", dist: ["in university morning.", "at university every morning.", "for university morning.", "by university morning."] }
    ]},
    { prompt: "My grandfather", trans: "پدربزرگ من قبلاً در یک کارخانه نساجی بزرگ کار می‌کرد.", steps: [
      { corr: "used to work as an engineer", dist: ["used to working as an engineer", "use to work as an engineer", "was used to work engineer", "used work engineer"], trap: { text: "used to working as an engineer", exp: "بعد از used to فعل ساده work می‌آید." } },
      { corr: "in a textile factory.", dist: ["at factory textile.", "on textile factory.", "to textile factory.", "by factory."] }
    ]},
    { prompt: "Did you", trans: "آیا در دوران کودکی عادت داشتی ویولن بنوازی؟", steps: [
      { corr: "use to play the violin", dist: ["used to play the violin", "use to playing the violin", "used to playing violin", "used play violin"], trap: { text: "used to play the violin", exp: "در سوالات با Did کلمه used به شکل ساده use تبدیل می‌شود (Did you use to play)." } },
      { corr: "when you were young?", dist: ["while you were young?", "at you were young?", "in you young?", "since you were young?"] }
    ]},
    { prompt: "We", trans: "ما قبلاً در یک دهکده آرام زندگی می‌کردیم اما اکنون در شهر هستیم.", steps: [
      { corr: "used to live in a village", dist: ["used to living in a village", "use to live in a village", "were used to live in village", "used live village"], trap: { text: "used to living in a village", exp: "ساختار عادت گذشته used to live است." } },
      { corr: "before moving to the city.", dist: ["before move to city.", "before to move city.", "in moving to city.", "for moving city."] }
    ]},
    { prompt: "She", trans: "او قبلاً موهای بلندی داشت اما ماه گذشته آن را کوتاه کرد.", steps: [
      { corr: "used to have long hair", dist: ["used to having long hair", "use to have long hair", "was used to have hair", "used have hair"], trap: { text: "used to having long hair", exp: "برای حالت در گذشته used to have به کار می‌رود." } },
      { corr: "before she cut it short.", dist: ["before she cuts it short.", "before to cut it short.", "in cutting it short.", "since cut it short."] }
    ]},
    { prompt: "They", trans: "آن‌ها قبلاً قهوه نمی‌نوشیدند اما اکنون عاشق اسپرسو هستند.", steps: [
      { corr: "didn't use to drink coffee", dist: ["didn't used to drink coffee", "didn't use to drinking coffee", "not used to drink coffee", "don't use to drink coffee"], trap: { text: "didn't used to drink coffee", exp: "بعد از didn't شکل ساده use to می‌آید و نباید d داشته باشد." } },
      { corr: "in the early morning.", dist: ["at early morning.", "on morning early.", "to early morning.", "by morning early."] }
    ]},
    { prompt: "This quiet street", trans: "این خیابان آرام قبلاً محله‌ای بسیار شلوغ با فروشگاه‌های زیاد بود.", steps: [
      { corr: "used to be very noisy", dist: ["used to being very noisy", "use to be very noisy", "was used to be noisy", "used be noisy"], trap: { text: "used to being very noisy", exp: "ساختار used to be درست است." } },
      { corr: "with busy trade markets.", dist: ["by busy trade markets.", "from trade markets.", "with markets trade.", "of trade markets."] }
    ]},
    { prompt: "I", trans: "من قبلاً از سگ‌ها می‌ترسیدم اما الان خودم یک سگ دارم.", steps: [
      { corr: "used to be afraid of dogs", dist: ["used to being afraid of dogs", "use to be afraid", "was used to be afraid", "used be afraid"], trap: { text: "used to being afraid of dogs", exp: "ساختار used to be afraid of درست است." } },
      { corr: "when I was a small child.", dist: ["while small child.", "at I was child.", "in I was child.", "since small child."] }
    ]},
    { prompt: "Did he", trans: "آیا او قبلاً برای رفتن به محل کار سوار مترو می‌شد؟", steps: [
      { corr: "use to take the subway", dist: ["used to take the subway", "use to taking the subway", "used to taking subway", "used take subway"], trap: { text: "used to take the subway", exp: "با حضور Did کلمه use بدون d می‌آید." } },
      { corr: "during the morning commute?", dist: ["in commute morning?", "at morning commute?", "to morning commute?", "by commute morning?"] }
    ]},
    { prompt: "My family", trans: "خانواده من قبلاً هر تابستان به سفر کمپینگ می‌رفتند.", steps: [
      { corr: "used to go camping", dist: ["used to going camping", "use to go camping", "was used to go camping", "used go camping"], trap: { text: "used to going camping", exp: "ساختار used to go camping درست است." } },
      { corr: "in the provincial parks.", dist: ["at provincial parks.", "on parks provincial.", "to provincial parks.", "by parks provincial."] }
    ]},
    { prompt: "She", trans: "او قبلاً گوشت نمی‌خورد اما اکنون رژیم متعادلی دارد.", steps: [
      { corr: "didn't use to eat meat", dist: ["didn't used to eat meat", "didn't use to eating meat", "not used to eat meat", "don't use to eat meat"], trap: { text: "didn't used to eat meat", exp: "بعد از didn't باید use to بیاید." } },
      { corr: "before consulting a doctor.", dist: ["before consult doctor.", "before to consult doctor.", "in consulting doctor.", "since consult doctor."] }
    ]},
    { prompt: "People", trans: "مردم قبل از اختراع تلفن‌های هوشمند بیشتر کتاب می‌خواندند.", steps: [
      { corr: "used to read more books", dist: ["used to reading more books", "use to read more books", "were used to read books", "used read books"], trap: { text: "used to reading more books", exp: "عادت گذشته used to read است." } },
      { corr: "in their free leisure time.", dist: ["at leisure time.", "on free leisure time.", "to leisure time.", "by leisure time."] }
    ]},
    { prompt: "I", trans: "من قبلاً بازی‌های ویدیویی انجام می‌دادم اما الان وقت ندارم.", steps: [
      { corr: "used to play video games", dist: ["used to playing video games", "use to play video games", "was used to play games", "used play games"], trap: { text: "used to playing video games", exp: "ساختار used to play درست است." } },
      { corr: "every single afternoon.", dist: ["in every afternoon single.", "at afternoon single.", "on afternoon every.", "by single afternoon."] }
    ]},
    { prompt: "Did they", trans: "آیا آن‌ها قبلاً در این خانه آجری قدیمی زندگی می‌کردند؟", steps: [
      { corr: "use to live here", dist: ["used to live here", "use to living here", "used to living here", "used live here"], trap: { text: "used to live here", exp: "بعد از Did باید use to live باشد." } },
      { corr: "many decades ago?", dist: ["before decades ago?", "since many decades?", "in many decades ago?", "at decades ago?"] }
    ]},
    { prompt: "He", trans: "او قبلاً عینک می‌زد اما بعد از عمل جراحی چشم دیگر نیازی ندارد.", steps: [
      { corr: "used to wear glasses", dist: ["used to wearing glasses", "use to wear glasses", "was used to wear glasses", "used wear glasses"], trap: { text: "used to wearing glasses", exp: "ساختار used to wear glasses صحیح است." } },
      { corr: "before his laser eye surgery.", dist: ["before eye surgery laser.", "to eye surgery laser.", "in laser surgery eye.", "at eye surgery."] }
    ]},
    { prompt: "We", trans: "ما قبلاً زبان انگلیسی بلد نبودیم اما اکنون به روانی صحبت می‌کنیم.", steps: [
      { corr: "didn't use to speak English", dist: ["didn't used to speak English", "didn't use to speaking English", "not used to speak English", "don't use to speak English"], trap: { text: "didn't used to speak English", exp: "بعد از didn't کلمه use بدون d می‌آید." } },
      { corr: "with such fluency.", dist: ["by such fluency.", "from such fluency.", "with fluency such.", "of such fluency."] }
    ]},
    { prompt: "The climate", trans: "آب و هوا در زمستان‌ها در گذشته بسیار سردتر و پربرف‌تر بود.", steps: [
      { corr: "used to be much colder", dist: ["used to being much colder", "use to be much colder", "was used to be colder", "used be colder"], trap: { text: "used to being much colder", exp: "ساختار used to be colder درست است." } },
      { corr: "in this northern valley.", dist: ["at northern valley.", "on valley northern.", "to northern valley.", "by valley northern."] }
    ]},
    { prompt: "She", trans: "او قبلاً پیانو می‌نواخت اما سازش را فروخت.", steps: [
      { corr: "used to play the piano", dist: ["used to playing the piano", "use to play the piano", "was used to play piano", "used play piano"], trap: { text: "used to playing the piano", exp: "ساختار used to play piano درست است." } },
      { corr: "in the school orchestra.", dist: ["at school orchestra.", "on orchestra school.", "to school orchestra.", "by orchestra school."] }
    ]},
    { prompt: "Did you", trans: "آیا در دوران مدرسه پیاده به خانه برمی‌گشتی؟", steps: [
      { corr: "use to walk home", dist: ["used to walk home", "use to walking home", "used to walking home", "used walk home"], trap: { text: "used to walk home", exp: "بعد از Did شکل use to walk صحیح است." } },
      { corr: "after the final class bell?", dist: ["in final class bell?", "at bell class final?", "to final bell class?", "for bell class?"] }
    ]},
    { prompt: "My brother", trans: "برادرم قبلاً از سبزیجات بدش می‌آمد اما اکنون سالاد دوست دارد.", steps: [
      { corr: "didn't use to like vegetables", dist: ["didn't used to like vegetables", "didn't use to liking vegetables", "not used to like vegetables", "don't use to like vegetables"], trap: { text: "didn't used to like vegetables", exp: "بعد از didn't کلمه use بدون d می‌آید." } },
      { corr: "during his childhood.", dist: ["at his childhood.", "in his childhood.", "on childhood his.", "by his childhood."] }
    ]}
  ],

  10: [
    { prompt: "Unless you leave now,", trans: "مگر اینکه همین الان راه بیفتی، وگرنه قطار را از دست خواهی داد و دیر می‌رسی.", steps: [
      { corr: "you will miss the train", dist: ["you would miss train", "you miss the train", "you will to miss train", "you missed train"], trap: { text: "you would miss train", exp: "در شرطی نوع اول با unless در جواب شرط will + فعل ساده می‌آید." } },
      { corr: "and arrive late for the interview.", dist: ["and arrives late.", "and arriving late.", "and to arrive late.", "and arrived late."] }
    ]},
    { prompt: "While the students were studying,", trans: "زمانی که دانش‌آموزان مشغول مطالعه بودند، چراغ‌های سالن ناگهان خاموش شدند.", steps: [
      { corr: "the classroom lights went out", dist: ["the lights were going out", "the lights go out", "the lights has gone out", "the lights going out"], trap: { text: "the lights were going out", exp: "رویداد ناگهانی گذشته ساده went out می‌گیرد." } },
      { corr: "due to an electrical surge.", dist: ["because electrical surge.", "from electrical surge.", "for electrical surge.", "with electrical surge."] }
    ]},
    { prompt: "She is the talented musician", trans: "او همان موسیقی‌دان بااستعدادی است که برنده جایزه برتر شد.", steps: [
      { corr: "who won first place", dist: ["which won first place", "where won first place", "whom won first place", "whose won first place"], trap: { text: "which won first place", exp: "برای انسان who به کار می‌رود." } },
      { corr: "at the national music contest.", dist: ["in national music contest.", "on contest national.", "to contest national.", "by contest national."] }
    ]},
    { prompt: "Have you ever considered", trans: "آیا تا به حال به یادگیری زبان جدید در اوقات فراغت فکر کرده‌ای؟", steps: [
      { corr: "learning a new language", dist: ["to learn a new language", "learn a new language", "to learning language", "for learn language"], trap: { text: "to learn a new language", exp: "بعد از consider اسم مصدر با ing (learning) می‌آید." } },
      { corr: "with an online tutor?", dist: ["by online tutor?", "from online tutor?", "with tutor online?", "of online tutor?"] }
    ]},
    { prompt: "This modern electric vehicle is", trans: "این خودروی برقی مدرن بسیار کم‌مصرف‌تر از خودروهای بنزینی سنتی است.", steps: [
      { corr: "far more efficient than", dist: ["far efficienter than", "more efficient as", "far efficient than", "efficienter than"], trap: { text: "far efficienter than", exp: "صفت efficient با more مقایسه می‌شود." } },
      { corr: "traditional gasoline cars.", dist: ["cars gasoline traditional.", "to traditional cars.", "at cars gasoline.", "by traditional cars."] }
    ]},
    { prompt: "Visitors", trans: "بازدیدکنندگان نباید در محوطه تاریخی آتش روشن کنند.", steps: [
      { corr: "must not light campfires", dist: ["don't have to light fires", "haven't to light fires", "must not to light fires", "not must light fires"], trap: { text: "don't have to light fires", exp: "ممنوعیت با must not بیان می‌شود." } },
      { corr: "in the national sanctuary.", dist: ["at national sanctuary.", "on national sanctuary.", "to sanctuary national.", "by sanctuary national."] }
    ]},
    { prompt: "If the weather remains clear,", trans: "اگر هوا صاف بماند، ما فردا به کوهنوردی خواهیم رفت.", steps: [
      { corr: "we will hike up the mountain", dist: ["we hike up the mountain", "we would hike up mountain", "we will to hike", "we hiked up mountain"], trap: { text: "we would hike up mountain", exp: "در شرطی نوع اول will hike می‌آید." } },
      { corr: "before dawn breaks.", dist: ["before of dawn.", "since dawn breaks.", "at dawn break.", "to dawn breaks."] }
    ]},
    { prompt: "He decided", trans: "او تصمیم گرفت برای پیشرفت تحصیلی خود کتابخانه را ترک نکند.", steps: [
      { corr: "not to leave the study hall", dist: ["not leaving the study hall", "not leave study hall", "to not leaving study hall", "for not leave hall"], trap: { text: "not leaving the study hall", exp: "بعد از decide شکل منفی مصدر not to leave است." } },
      { corr: "until all exercises were done.", dist: ["until of exercises.", "since exercises done.", "at exercises done.", "to exercises done."] }
    ]},
    { prompt: "The historic building", trans: "ساختمان تاریخی سال گذشته توسط شهرداری با دقت مرمت شد.", steps: [
      { corr: "was carefully restored", dist: ["were carefully restored", "is restored carefully", "was restore carefully", "restored carefully"], trap: { text: "were carefully restored", exp: "ساختمان مفرد است و was restored می‌گیرد." } },
      { corr: "by the local heritage board.", dist: ["from heritage board.", "with heritage board.", "of heritage board.", "to heritage board."] }
    ]},
    { prompt: "I", trans: "من قبلاً هر روز صبح در پارک محله می‌دویدم.", steps: [
      { corr: "used to jog every morning", dist: ["used to jogging morning", "use to jog morning", "was used to jog", "used jog morning"], trap: { text: "used to jogging morning", exp: "عادت گذشته used to jog است." } },
      { corr: "before I started this job.", dist: ["before I start job.", "before to start job.", "in starting this job.", "since started job."] }
    ]},
    { prompt: "While the chef was cooking,", trans: "زمانی که سرآشپز داشت آشپزی می‌کرد، چاقوی تیز دستش را برید.", steps: [
      { corr: "the sharp knife cut his hand", dist: ["knife was cutting hand", "knife cuts his hand", "knife has cut hand", "knife cutting hand"], trap: { text: "knife was cutting hand", exp: "بریدن دست رویداد لحظه‌ای است و cut گذشته ساده می‌خواهد." } },
      { corr: "during the busy dinner service.", dist: ["at dinner service.", "in service dinner.", "to dinner service.", "by dinner service."] }
    ]},
    { prompt: "That is the quiet cafe", trans: "آن همان کافه آرامی است که من رمان اولم را در آن نوشتم.", steps: [
      { corr: "where I wrote my first book", dist: ["which I wrote my book", "who I wrote my book", "that I wrote book there", "where I wrote book there"], trap: { text: "which I wrote my book", exp: "برای مکانی که عملی در آن رخ داده where به کار می‌رود." } },
      { corr: "during rainy afternoons.", dist: ["at rainy afternoons.", "on rainy afternoons.", "to afternoons rainy.", "by afternoons rainy."] }
    ]},
    { prompt: "She has never", trans: "او هرگز در هیچ آزمون استخدامی بین‌المللی رد نشده است.", steps: [
      { corr: "failed an international interview", dist: ["fail an international interview", "failing an interview", "fails an interview", "to fail an interview"], trap: { text: "fail an international interview", exp: "قسمت سوم failed است." } },
      { corr: "in her entire career.", dist: ["at her career.", "on career her.", "to her career.", "by her career."] }
    ]},
    { prompt: "Public transport is", trans: "حمل و نقل عمومی بسیار ارزان‌تر از رانندگی با خودروی شخصی است.", steps: [
      { corr: "far cheaper than driving", dist: ["more cheap than driving", "cheaper as driving", "more cheaper than driving", "as cheap than driving"], trap: { text: "more cheap than driving", exp: "تفضیلی cheap کلمه cheaper است." } },
      { corr: "a private motor car.", dist: ["to private car.", "in private car.", "at car private.", "by private car."] }
    ]},
    { prompt: "You", trans: "شما نیازی نیست امروز هزینه ثبت‌نام بپردازید؛ رایگان است.", steps: [
      { corr: "don't have to pay registration", dist: ["mustn't pay registration", "haven't to pay registration", "not have to pay", "don't must pay"], trap: { text: "mustn't pay registration", exp: "عدم نیاز don't have to است." } },
      { corr: "for the orientation workshop.", dist: ["to workshop orientation.", "in workshop orientation.", "at workshop.", "with workshop."] }
    ]},
    { prompt: "If you don't wear a warm coat,", trans: "اگر پالتوی گرم نپوشی، در این هوای یخبندان سرما خواهی خورد.", steps: [
      { corr: "you will catch a severe cold", dist: ["you catch a cold", "you would catch a cold", "you will to catch cold", "you caught a cold"], trap: { text: "you would catch a cold", exp: "در شرطی نوع اول will catch می‌آید." } },
      { corr: "in this freezing weather.", dist: ["at freezing weather.", "on freezing weather.", "to freezing weather.", "by freezing weather."] }
    ]},
    { prompt: "They avoided", trans: "آن‌ها با بستن قرارداد رسمی، از بروز هرگونه اختلاف مالی جلوگیری کردند.", steps: [
      { corr: "having financial disputes", dist: ["to have financial disputes", "have financial disputes", "to having disputes", "for have disputes"], trap: { text: "to have financial disputes", exp: "بعد از avoid فعل با ing (having) می‌آید." } },
      { corr: "by signing a formal contract.", dist: ["in signing contract.", "with sign contract.", "to sign contract.", "for signing contract."] }
    ]},
    { prompt: "The ancient artifacts", trans: "اشیای باستانی در یک محفظه شیشه‌ای ایمن به نمایش گذاشته شدند.", steps: [
      { corr: "were displayed in a museum", dist: ["was displayed in museum", "are displayed in museum", "were display in museum", "displayed in museum"], trap: { text: "was displayed in museum", exp: "کلمه artifacts جمع است و were displayed می‌خواهد." } },
      { corr: "behind reinforced glass.", dist: ["at reinforced glass.", "on glass reinforced.", "to reinforced glass.", "by reinforced glass."] }
    ]},
    { prompt: "Did they", trans: "آیا آن‌ها قبلاً در این شهر ساحلی قایق‌رانی می‌کردند؟", steps: [
      { corr: "use to go sailing", dist: ["used to go sailing", "use to going sailing", "used to going sailing", "used go sailing"], trap: { text: "used to go sailing", exp: "بعد از Did شکل use to go درست است." } },
      { corr: "every weekend in summer?", dist: ["in weekend summer every?", "at summer weekend?", "to summer weekend?", "by summer weekend?"] }
    ]},
    { prompt: "Unless you practice consistently,", trans: "مگر اینکه مدام تمرین کنی، وگرنه نواختن پیانو را با مهارت یاد نخواهی گرفت.", steps: [
      { corr: "you will never master piano", dist: ["you never master piano", "you would never master piano", "you will to master", "you mastered piano"], trap: { text: "you would never master piano", exp: "جواب شرط اول will master است." } },
      { corr: "at a professional level.", dist: ["in professional level.", "on professional level.", "to level professional.", "by level professional."] }
    ]}
  ]
};
