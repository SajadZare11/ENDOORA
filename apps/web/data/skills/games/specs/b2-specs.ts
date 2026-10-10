// American English File - Tier B2 Grammar Specs (10 Stages x 20 Authentic Sentences = 200 Sentences)
// Granular 3-node routing for every sentence: Node 1 (Subject/Auxiliary), Node 2 (Verb/Structure), Node 3 (Complement/Adverbial)
// Every sentence has an authentic English structure, exact Persian translation, and L1 interference trap.

import type { TierSpecMap } from './spec-types.ts';

export const B2_SPECS: TierSpecMap = {
  // Stage 1: Third Conditional (Past Regrets: If + had done, would have done)
  1: [
    { prompt: "If we had arrived on time at the station,", trans: "اگر به موقع به ایستگاه قطار رسیده بودیم، پرواز صبح به پاریس را از دست نمی‌دادیم.", steps: [
      { corr: "we would not have", dist: ["we will not have", "we had not have", "we would not had", "we did not have"], trap: { text: "we will not have", exp: "در بند اصلی شرطی نوع سوم ساختار would have الزامی است نه will." } },
      { corr: "missed the international flight", dist: ["miss the international flight", "missing the flight", "to miss international flight", "misses the flight"], trap: { text: "miss the international flight", exp: "بعد از would have شکل سوم فعل (missed) می‌آید." } },
      { corr: "to the Paris diplomatic conference.", dist: ["in Paris diplomatic conference.", "at Paris conference.", "for conference Paris.", "by Paris conference."] }
    ]},
    { prompt: "If he had listened to the financial advisor,", trans: "اگر او به نصیحت مشاور مالی گوش فرا داده بود، همه سرمایه‌اش را از دست نمی‌داد.", steps: [
      { corr: "he would not have", dist: ["he will not have", "he had not have", "he would not had", "he did not have"], trap: { text: "he had not have", exp: "در جواب شرط نوع سوم had have غلط است و would have درست است." } },
      { corr: "lost all his personal savings", dist: ["lose all personal savings", "losing his savings", "to lose savings", "loses his savings"], trap: { text: "lose all personal savings", exp: "قسمت سوم lose کلمه lost است." } },
      { corr: "in the risky venture market.", dist: ["at market venture.", "to risky venture.", "on market venture.", "by venture market."] }
    ]},
    { prompt: "If she had accepted the university scholarship,", trans: "اگر او بورسیه دانشگاه را پذیرفته بود، سال گذشته به بریتانیا نقل مکان کرده بود.", steps: [
      { corr: "she would have moved", dist: ["she will have moved", "she would move", "she had moved", "she moved have"], trap: { text: "she would move", exp: "برای عمل گذشته در جواب شرط نوع سوم would have moved می‌آید نه would move." } },
      { corr: "to Oxford for research", dist: ["in Oxford for research", "at Oxford research", "for Oxford research", "by Oxford research"] },
      { corr: "in molecular genetics.", dist: ["at molecular genetics.", "on genetics molecular.", "to molecular genetics.", "by molecular genetics."] }
    ]},
    { prompt: "If the firefighters had not reacted so quickly,", trans: "اگر آتش‌نشانان با این سرعت عمل نکرده بودند، تمام انبار در آتش می‌سوخت.", steps: [
      { corr: "the timber warehouse would have", dist: ["the warehouse will have", "the warehouse had have", "the warehouse would had", "warehouse would burn"], trap: { text: "the warehouse will have", exp: "در شرطی سوم would have الزامی است." } },
      { corr: "burned down completely", dist: ["burn down completely", "burning down completely", "to burn down completely", "burns down completely"], trap: { text: "burn down completely", exp: "قسمت سوم burned درست است." } },
      { corr: "within twenty minutes.", dist: ["in twenty minutes within.", "at twenty minutes.", "for twenty minutes.", "by twenty minutes."] }
    ]},
    { prompt: "If you had checked the weather forecast,", trans: "اگر پیش‌بینی هواشناسی را بررسی کرده بودی، لباس‌های مناسب با خود برمی‌داشتی.", steps: [
      { corr: "you would have packed", dist: ["you will have packed", "you would pack", "you had packed", "you packed have"], trap: { text: "you would pack", exp: "برای گذشته would have packed درست است." } },
      { corr: "warm waterproof clothing", dist: ["clothing waterproof warm", "to waterproof clothing", "for clothing warm", "with clothing warm"] },
      { corr: "for the alpine expedition.", dist: ["to alpine expedition.", "in alpine expedition.", "at expedition alpine.", "with expedition alpine."] }
    ]},
    { prompt: "If the government had intervened earlier,", trans: "اگر دولت زودتر مداخله کرده بود، از بحران اقتصادی جلوگیری شده بود.", steps: [
      { corr: "the monetary crisis would have", dist: ["crisis will have", "crisis had have", "crisis would had", "crisis would avoid"], trap: { text: "crisis will have", exp: "در شرطی سوم would have الزامی است." } },
      { corr: "been entirely prevented", dist: ["been entire prevented", "be entirely prevented", "being entirely prevented", "to be prevented"], trap: { text: "be entirely prevented", exp: "در مجهول شرطی سوم would have been prevented درست است." } },
      { corr: "by central bank regulations.", dist: ["from bank regulations.", "with bank regulations.", "of bank regulations.", "to bank regulations."] }
    ]},
    { prompt: "If I had known about the traffic closure,", trans: "اگر از بسته بودن مسیر به خاطر ترافیک مطلع بودم، مسیر دیگری انتخاب می‌کردم.", steps: [
      { corr: "I would have taken", dist: ["I will have taken", "I would take", "I had taken", "I took have"], trap: { text: "I would take", exp: "برای گذشته would have taken صحیح است." } },
      { corr: "the coastal bypass road", dist: ["road coastal bypass", "to bypass road", "for bypass coastal", "with bypass road"] },
      { corr: "to avoid the morning jam.", dist: ["for avoid morning jam.", "in avoiding morning jam.", "to avoiding jam.", "for jam avoid."] }
    ]},
    { prompt: "If they had not installed security cameras,", trans: "اگر آن‌ها دوربین‌های مداربسته نصب نکرده بودند، سارقان هرگز شناسایی نمی‌شدند.", steps: [
      { corr: "the thieves would never have", dist: ["thieves will never have", "thieves had never have", "thieves would never had", "thieves were never have"], trap: { text: "thieves will never have", exp: "در شرطی سوم would have الزامی است." } },
      { corr: "been identified by police", dist: ["been identify by police", "be identified by police", "being identified", "identified police been"], trap: { text: "be identified by police", exp: "در مجهول would have been identified می‌آید." } },
      { corr: "after the museum robbery.", dist: ["after robbery museum.", "since robbery museum.", "in robbery museum.", "at museum robbery."] }
    ]},
    { prompt: "If we had booked the airline tickets in May,", trans: "اگر بلیط‌های هواپیما را در ماه مه رزرو کرده بودیم، صدها دلار صرفه‌جویی می‌کردیم.", steps: [
      { corr: "we would have saved", dist: ["we will have saved", "we would save", "we had saved", "we saved have"], trap: { text: "we would save", exp: "برای گذشته would have saved درست است." } },
      { corr: "several hundred dollars", dist: ["hundred several dollars", "to several hundred dollars", "for dollars several", "with several hundred dollars"] },
      { corr: "on international flight costs.", dist: ["in international flight costs.", "at flight costs.", "for costs flight.", "by flight costs."] }
    ]},
    { prompt: "If the doctor had not diagnosed the illness immediately,", trans: "اگر پزشک بیماری را فوراً تشخیص نداده بود، وضعیت او بحرانی می‌شد.", steps: [
      { corr: "her physical condition would have", dist: ["condition will have", "condition had have", "condition would had", "condition would deteriorate"], trap: { text: "condition will have", exp: "در شرطی سوم would have الزامی است." } },
      { corr: "deteriorated very rapidly", dist: ["deteriorate rapidly", "deteriorating rapidly", "to deteriorate rapidly", "deteriorates rapidly"], trap: { text: "deteriorate rapidly", exp: "قسمت سوم deteriorated درست است." } },
      { corr: "within a few short days.", dist: ["in a few short days.", "at few short days.", "for few days short.", "by few short days."] }
    ]},
    { prompt: "If Sarah had not forgotten her laboratory keys,", trans: "اگر سارا کلیدهای آزمایشگاهش را فراموش نکرده بود، آزمایش‌ها به موقع تمام می‌شدند.", steps: [
      { corr: "the scientific trials would have", dist: ["trials will have", "trials had have", "trials would had", "trials would finish"], trap: { text: "trials will have", exp: "در شرطی سوم would have می‌آید." } },
      { corr: "concluded on schedule", dist: ["conclude on schedule", "concluding on schedule", "to conclude schedule", "concludes schedule"], trap: { text: "conclude on schedule", exp: "قسمت سوم concluded الزامی است." } },
      { corr: "before the weekend arrived.", dist: ["before of weekend.", "since weekend arrived.", "in weekend arrived.", "at weekend."] }
    ]},
    { prompt: "If the pilot had not remained completely calm,", trans: "اگر خلبان کاملاً خونسرد نمانده بود، هواپیما دچار سانحه مرگباری می‌شد.", steps: [
      { corr: "the passenger aircraft would have", dist: ["aircraft will have", "aircraft had have", "aircraft would had", "aircraft would crash"], trap: { text: "aircraft will have", exp: "در شرطی سوم would have الزامی است." } },
      { corr: "suffered a fatal crash", dist: ["suffer a fatal crash", "suffering fatal crash", "to suffer crash", "suffers fatal crash"], trap: { text: "suffer a fatal crash", exp: "قسمت سوم suffered درست است." } },
      { corr: "during the violent storm.", dist: ["in violent storm.", "at storm violent.", "to violent storm.", "by violent storm."] }
    ]},
    { prompt: "If you had told me you were visiting London,", trans: "اگر به من گفته بودی که عازم لندن هستی، می‌توانستم به تو آپارتمانم را پیشنهاد دهم.", steps: [
      { corr: "I could have offered you", dist: ["I can have offered you", "I could offer you", "I had offered you", "I offered you have"], trap: { text: "I can have offered you", exp: "برای توانایی در گذشته could have offered درست است نه can have." } },
      { corr: "a comfortable spare room", dist: ["room comfortable spare", "to spare room", "for room spare", "with spare room"] },
      { corr: "in my downtown apartment.", dist: ["at downtown apartment.", "on apartment downtown.", "to downtown apartment.", "by downtown apartment."] }
    ]},
    { prompt: "If the company had not modernized its software,", trans: "اگر شرکت نرم‌افزارهای خود را مدرن نکرده بود، مشتریانش را از دست داده بود.", steps: [
      { corr: "it would have lost", dist: ["it will have lost", "it would lose", "it had lost", "it lost have"], trap: { text: "it would lose", exp: "برای گذشته would have lost درست است." } },
      { corr: "valuable commercial clients", dist: ["clients valuable commercial", "to commercial clients", "for clients commercial", "with commercial clients"] },
      { corr: "to international competitors.", dist: ["at international competitors.", "in competitors international.", "for competitors international.", "by competitors international."] }
    ]},
    { prompt: "If they had read the safety manual,", trans: "اگر آن‌ها دفترچه راهنمای ایمنی را خوانده بودند، دچار آن حادثه ناگوار نمی‌شدند.", steps: [
      { corr: "they would not have", dist: ["they will not have", "they had not have", "they would not had", "they did not have"], trap: { text: "they will not have", exp: "در شرطی سوم would have الزامی است." } },
      { corr: "encountered that accident", dist: ["encounter that accident", "encountering accident", "to encounter accident", "encounters accident"], trap: { text: "encounter that accident", exp: "قسمت سوم encountered درست است." } },
      { corr: "in the chemical laboratory.", dist: ["at chemical laboratory.", "on laboratory chemical.", "to chemical laboratory.", "by chemical laboratory."] }
    ]},
    { prompt: "If the train driver had seen the red signal,", trans: "اگر راننده قطار چراغ قرمز را دیده بود، فوراً ترمزهای اضطراری را می‌کشید.", steps: [
      { corr: "he would have pulled", dist: ["he will have pulled", "he would pull", "he had pulled", "he pulled have"], trap: { text: "he will have pulled", exp: "در شرطی سوم would have pulled می‌آید." } },
      { corr: "the emergency brake lever", dist: ["lever brake emergency", "to brake lever", "for lever brake", "with brake lever"] },
      { corr: "well before the collision point.", dist: ["before of collision.", "since collision point.", "in collision point.", "at collision point."] }
    ]},
    { prompt: "If she had taken the professional advice,", trans: "اگر او به نصیحت حرفه‌ای عمل کرده بود، در دادگاه محکوم نمی‌شد.", steps: [
      { corr: "she would not have been", dist: ["she will not have been", "she had not have been", "she would not be", "she was not have been"], trap: { text: "she would not be", exp: "برای گذشته would not have been درست است." } },
      { corr: "convicted in court", dist: ["convict in court", "convicting in court", "to convict in court", "convicts in court"], trap: { text: "convict in court", exp: "قسمت سوم convicted الزامی است." } },
      { corr: "due to lack of defense.", dist: ["because defense.", "from defense.", "for defense.", "with defense."] }
    ]},
    { prompt: "If we had studied the map carefully,", trans: "اگر نقشه را با دقت مطالعه کرده بودیم، در این جنگل مه‌آلود گم نمی‌شدیم.", steps: [
      { corr: "we would not have become", dist: ["we will not have become", "we would not become", "we had not become", "we became not have"], trap: { text: "we will not have become", exp: "در شرطی سوم would not have become درست است." } },
      { corr: "completely lost in the woods", dist: ["completely lose in woods", "lost in woods completely", "to lose in woods", "losing in woods"] },
      { corr: "without a compass signal.", dist: ["without of compass.", "no with compass.", "with no compass signal.", "without compass."] }
    ]},
    { prompt: "If the weather had been sunny last Saturday,", trans: "اگر شنبه گذشته هوا آفتابی بود، ما مسابقه قایق‌رانی را برگزار کرده بودیم.", steps: [
      { corr: "we would have held", dist: ["we will have held", "we would hold", "we had held", "we held have"], trap: { text: "we would hold", exp: "برای گذشته would have held درست است." } },
      { corr: "the annual sailing regatta", dist: ["regatta sailing annual", "to annual regatta", "for regatta annual", "with annual regatta"] },
      { corr: "on the coastal lake.", dist: ["in coastal lake.", "at lake coastal.", "to coastal lake.", "by coastal lake."] }
    ]},
    { prompt: "If he had remembered to renew his passport,", trans: "اگر او تمدید پاسپورتش را فراموش نکرده بود، به موقع به کنفرانس می‌رسید.", steps: [
      { corr: "he would have traveled", dist: ["he will have traveled", "he would travel", "he had traveled", "he traveled have"], trap: { text: "he would travel", exp: "در شرطی سوم would have traveled درست است." } },
      { corr: "with his colleagues abroad", dist: ["by his colleagues", "from his colleagues", "at his colleagues", "of his colleagues"] },
      { corr: "for the annual symposium.", dist: ["to annual symposium.", "in symposium annual.", "at annual symposium.", "with annual symposium."] }
    ]}
  ],

  // Stages 2 to 10 for B2 (Wish/If Only, Past Modals of Deduction, Passive with Reporting Verbs, Non-defining Relative, Purpose & Result, Would rather, 3-part Phrasal, Mixed Conditionals, B2 Master)
  2: [
    { prompt: "Looking back at the past decisions, I really wish", trans: "با نگاه به تصمیمات گذشته، واقعاً آرزو می‌کنم که آن روز به نصیحت صمیمانه او گوش داده بودم.", steps: [
      { corr: "I had listened to", dist: ["I listened to", "I have listened to", "I would listen to", "I had listen to"], trap: { text: "I listened to", exp: "برای بیان پشیمانی و آرزو در مورد گذشته ساختار wish + گذشته کامل (had listened) الزامی است." } },
      { corr: "his sincere career advice", dist: ["advice career sincere", "to career advice sincere", "for advice career", "with sincere advice"] },
      { corr: "before making that choice.", dist: ["before make that choice.", "before to make choice.", "in making choice.", "since make choice."] }
    ]},
    { prompt: "Standing in this heavy downpour without an umbrella, if only", trans: "زیر این باران سیل‌آسا بدون چتر، کاش پیش‌بینی وضع هوا را بررسی کرده بودم.", steps: [
      { corr: "we had checked", dist: ["we checked", "we have checked", "we would check", "we had check"], trap: { text: "we checked", exp: "برای حسرت در مورد گذشته بعد از If only زمان گذشته کامل (had checked) به کار می‌رود." } },
      { corr: "the morning weather forecast", dist: ["forecast weather morning", "to weather forecast", "for forecast weather", "with weather forecast"] },
      { corr: "before leaving our home.", dist: ["before leave our home.", "before to leave home.", "in leaving home.", "since leave home."] }
    ]},
    { prompt: "She struggles with basic Italian; she wishes", trans: "او با مکالمات ابتدایی ایتالیایی دست و پنجه نرم می‌کند؛ ای کاش زمان بیشتری برای تمرین داشت.", steps: [
      { corr: "she had more time", dist: ["she has more time", "she had had more time", "she would have time", "she having time"], trap: { text: "she has more time", exp: "برای آرزو در مورد زمان حال بعد از wish زمان گذشته ساده (had) می‌آید." } },
      { corr: "to practice conversational skills", dist: ["practicing conversational skills", "practice conversational skills", "to practicing skills", "for practice skills"] },
      { corr: "with native language tutors.", dist: ["by native language tutors.", "from native tutors.", "with tutors native.", "of native tutors."] }
    ]},
    { prompt: "The flight was terribly delayed; if only", trans: "پرواز به شدت تاخیر داشت؛ کاش با قطار سریع‌السیر سفر کرده بودیم.", steps: [
      { corr: "we had chosen to travel", dist: ["we chose to travel", "we have chosen to travel", "we would choose travel", "we had choose travel"], trap: { text: "we chose to travel", exp: "برای حسرت گذشته If only + had chosen درست است." } },
      { corr: "by the high-speed train", dist: ["in high-speed train", "with high-speed train", "on train high-speed", "at high-speed train"] },
      { corr: "instead of waiting at airport.", dist: ["instead wait at airport.", "without wait airport.", "in place waiting.", "instead of wait airport."] }
    ]},
    { prompt: "He is always interrupting colleagues; I really wish", trans: "او مدام صحبت همکاران را قطع می‌کند؛ واقعاً آرزو دارم که به این رفتار پایان دهد.", steps: [
      { corr: "he would stop interrupting", dist: ["he stopped interrupting", "he will stop interrupting", "he had stopped interrupting", "he stops interrupting"], trap: { text: "he stopped interrupting", exp: "برای ابراز نارضایتی از رفتار دیگران در زمان حال ساختار wish + would + فعل ساده به کار می‌رود." } },
      { corr: "during important meetings", dist: ["in meetings important", "at meetings important", "on meetings important", "for meetings important"] },
      { corr: "and listen more attentively.", dist: ["and listens attentively.", "and listening attentively.", "and to listen attentively.", "and listened attentively."] }
    ]},
    { prompt: "I missed the job application deadline; I wish", trans: "من مهلت ارسال رزومه را از دست دادم؛ ای کاش مدارکم را دیروز فرستاده بودم.", steps: [
      { corr: "I had submitted my resume", dist: ["I submitted my resume", "I have submitted resume", "I would submit resume", "I had submit resume"], trap: { text: "I submitted my resume", exp: "حسرت گذشته: had submitted." } },
      { corr: "to the recruitment board", dist: ["at recruitment board", "in board recruitment", "for recruitment board", "with recruitment board"] },
      { corr: "before the portal closed.", dist: ["before portal close.", "before to close portal.", "in portal closing.", "since portal close."] }
    ]},
    { prompt: "The room is freezing cold; if only", trans: "اتاق یخ است؛ کاش شوفاژها را از یک ساعت پیش روشن کرده بودیم.", steps: [
      { corr: "we had turned on the heaters", dist: ["we turned on heaters", "we have turned on heaters", "we would turn on heaters", "we had turn on heaters"], trap: { text: "we turned on heaters", exp: "حسرت گذشته: had turned on." } },
      { corr: "in the central living hall", dist: ["at living hall central", "on central living hall", "to central living hall", "by living hall"] },
      { corr: "before the guests arrived.", dist: ["before guests arrive.", "before to arrive guests.", "in guests arriving.", "since guests arrive."] }
    ]},
    { prompt: "He cannot play any musical instrument; he wishes", trans: "او هیچ سازی بلد نیست؛ آرزو دارد می‌توانست پیانو بنوازد.", steps: [
      { corr: "he could play the piano", dist: ["he can play the piano", "he could to play piano", "he would can play piano", "he played can piano"], trap: { text: "he can play the piano", exp: "برای آرزوی توانایی در حال wish + could به کار می‌رود." } },
      { corr: "with classical elegance", dist: ["by classical elegance", "from elegance classical", "with elegance classical", "of classical elegance"] },
      { corr: "in an orchestra performance.", dist: ["at orchestra performance.", "on performance orchestra.", "to orchestra performance.", "by orchestra."] }
    ]},
    { prompt: "We lost all our vacation photographs; if only", trans: "ما تمام عکس‌های تعطیلات را از دست دادیم؛ کاش از آن‌ها نسخه پشتیبان تهیه کرده بودیم.", steps: [
      { corr: "we had backed up the files", dist: ["we backed up files", "we have backed up files", "we would back up files", "we had back up files"], trap: { text: "we backed up files", exp: "حسرت گذشته: had backed up." } },
      { corr: "onto an external drive", dist: ["in external drive", "at drive external", "to drive external", "by external drive"] },
      { corr: "before the computer crashed.", dist: ["before crash computer.", "before to crash computer.", "in crashing computer.", "since crash computer."] }
    ]},
    { prompt: "She is always complaining about everything; I wish", trans: "او مدام از همه چیز شکایت می‌کند؛ کاش به جنبه‌های مثبت نگاه می‌کرد.", steps: [
      { corr: "she would look at the positives", dist: ["she looked at positives", "she will look positives", "she had looked positives", "she looks at positives"], trap: { text: "she looked at positives", exp: "آرزوی تغییر رفتار فرد دیگر: would look." } },
      { corr: "with a constructive attitude", dist: ["by constructive attitude", "from attitude constructive", "with attitude constructive", "of constructive attitude"] },
      { corr: "instead of finding faults.", dist: ["instead find faults.", "without find faults.", "in place finding.", "instead of find faults."] }
    ]},
    { prompt: "I bought this expensive jacket and regret it; I wish", trans: "من این پالتوی گران را خریدم و پشیمانم؛ کاش پولم را پس‌انداز کرده بودم.", steps: [
      { corr: "I had saved my money", dist: ["I saved my money", "I have saved money", "I would save money", "I had save money"], trap: { text: "I saved my money", exp: "پشیمانی از خرید گذشته: had saved." } },
      { corr: "for the upcoming tuition fees", dist: ["to tuition fees", "in tuition fees", "at fees tuition", "with tuition fees"] },
      { corr: "instead of spending it recklessly.", dist: ["instead spend it.", "without spend it.", "in place spending.", "instead of spend it."] }
    ]},
    { prompt: "The museum was closed today; if only", trans: "موزه امروز بسته بود؛ کاش ساعات کاری آن را چک کرده بودیم.", steps: [
      { corr: "we had checked the timetable", dist: ["we checked the timetable", "we have checked timetable", "we would check timetable", "we had check timetable"], trap: { text: "we checked the timetable", exp: "حسرت گذشته: had checked." } },
      { corr: "on the official website", dist: ["in official website", "at website official", "to official website", "by website official"] },
      { corr: "before traveling all this way.", dist: ["before travel all way.", "before to travel way.", "in traveling all way.", "since travel all way."] }
    ]},
    { prompt: "He is living so far from his family; he wishes", trans: "او خیلی دور از خانواده‌اش زندگی می‌کند؛ آرزو دارد نزدیک‌تر بود.", steps: [
      { corr: "he lived closer to them", dist: ["he lives closer to them", "he had lived closer", "he would live closer", "he living closer"], trap: { text: "he lives closer to them", exp: "آرزوی زمان حال: lived (گذشته ساده)." } },
      { corr: "in their hometown province", dist: ["at hometown province", "on province hometown", "to hometown province", "by hometown province"] },
      { corr: "so he could visit every weekend.", dist: ["so he visit weekend.", "in order visit weekend.", "for visit weekend.", "in order to visit."] }
    ]},
    { prompt: "I didn't study medicine at university; I wish", trans: "من در دانشگاه پزشکی نخواندم؛ ای کاش پزشک شده بودم.", steps: [
      { corr: "I had become a doctor", dist: ["I became a doctor", "I have become doctor", "I would become doctor", "I had became doctor"], trap: { text: "I became a doctor", exp: "پشیمانی گذشته: had become." } },
      { corr: "to help sick patients", dist: ["for help sick patients", "helping sick patients", "to helping patients", "in helping patients"] },
      { corr: "in underdeveloped regions.", dist: ["at underdeveloped regions.", "on regions underdeveloped.", "to underdeveloped regions.", "by underdeveloped regions."] }
    ]},
    { prompt: "The neighbors play loud music at midnight; if only", trans: "همسایه‌ها نصف شب آهنگ بلند می‌گذارند؛ کاش صدای آن را کم می‌کردند.", steps: [
      { corr: "they would turn it down", dist: ["they turned it down", "they will turn it down", "they had turned it down", "they turn it down"], trap: { text: "they turned it down", exp: "آرزوی تغییر رفتار آزاردهنده دیگران: would turn it down." } },
      { corr: "to a reasonable volume", dist: ["at reasonable volume", "in reasonable volume", "for volume reasonable", "with reasonable volume"] },
      { corr: "so that residents could sleep.", dist: ["in order residents sleep.", "so residents sleep.", "for residents could sleep.", "in order to sleep."] }
    ]},
    { prompt: "I failed the driving test yesterday; I wish", trans: "من دیروز در آزمون رانندگی رد شدم؛ کاش بیشتر تمرین کرده بودم.", steps: [
      { corr: "I had practiced parking more", dist: ["I practiced parking more", "I have practiced parking", "I would practice parking", "I had practice parking"], trap: { text: "I practiced parking more", exp: "حسرت گذشته: had practiced." } },
      { corr: "with my driving instructor", dist: ["by driving instructor", "from instructor driving", "at driving instructor", "of driving instructor"] },
      { corr: "before taking the road exam.", dist: ["before take road exam.", "before to take exam.", "in taking road exam.", "since take road exam."] }
    ]},
    { prompt: "It is raining heavily on our vacation; if only", trans: "در تعطیلات باران شدیدی می‌بارد؛ کاش هوا آفتابی بود.", steps: [
      { corr: "the weather were sunny", dist: ["the weather is sunny", "weather would be sunny", "weather has been sunny", "weather had been sunny today"], trap: { text: "the weather is sunny", exp: "آرزوی حال: were sunny (ساختار فرضی)." } },
      { corr: "so we could hike in the mountains", dist: ["so we hike in mountains", "in order hike mountains", "for hike in mountains", "in order to hike"] },
      { corr: "and enjoy the scenery.", dist: ["and enjoys scenery.", "and enjoying scenery.", "and to enjoy scenery.", "and enjoyed scenery."] }
    ]},
    { prompt: "He spoke very rudely to his manager; now he wishes", trans: "او بسیار بی‌ادبانه با مدیرش صحبت کرد؛ اکنون آرزو می‌کند که حرفش را پس بگیرد.", steps: [
      { corr: "he had not said those words", dist: ["he did not say words", "he has not said words", "he would not say words", "he not had said words"], trap: { text: "he did not say words", exp: "پشیمانی گذشته: had not said." } },
      { corr: "during the heated argument", dist: ["at argument heated", "in argument heated", "to heated argument", "with heated argument"] },
      { corr: "which cost him his promotion.", dist: ["who cost him promotion.", "where cost him promotion.", "that it cost him.", "whom cost him."] }
    ]},
    { prompt: "I don't have enough savings to buy a house; I wish", trans: "من پس‌انداز کافی برای خرید خانه ندارم؛ کاش درآمد بالاتری داشتم.", steps: [
      { corr: "I earned a higher salary", dist: ["I earn a higher salary", "I had earned salary", "I would earn salary", "I earning salary"], trap: { text: "I earn a higher salary", exp: "آرزوی حال: earned (گذشته ساده)." } },
      { corr: "at this corporate company", dist: ["in corporate company this", "on corporate company", "to corporate company", "by corporate company"] },
      { corr: "to afford a mortgage.", dist: ["for afford mortgage.", "in affording mortgage.", "to affording mortgage.", "for mortgage afford."] }
    ]},
    { prompt: "The train has departed without us; if only", trans: "قطار بدون ما حرکت کرده است؛ کاش با تاکسی آمده بودیم.", steps: [
      { corr: "we had taken a taxi", dist: ["we took a taxi", "we have taken a taxi", "we would take taxi", "we had take taxi"], trap: { text: "we took a taxi", exp: "حسرت گذشته: had taken." } },
      { corr: "directly to the platform", dist: ["in platform directly", "at platform directly", "for platform directly", "with platform"] },
      { corr: "instead of waiting for the bus.", dist: ["instead wait for bus.", "without wait bus.", "in place waiting.", "instead of wait bus."] }
    ]}
  ],

  // Stages 3 to 10 for B2
  3: [
    { prompt: "The front door was securely locked from inside, so the thief", trans: "در ورودی از داخل قفل بود، بنابراین دزد حتماً از پنجره زیرزمین وارد شده است.", steps: [
      { corr: "must have entered", dist: ["can't have entered", "might have enter", "should have entered", "must enter"], trap: { text: "can't have entered", exp: "استنتاج قطعی مثبت در زمان گذشته must have entered است." } },
      { corr: "through the basement window", dist: ["in basement window", "at window basement", "to basement window", "by basement window"] },
      { corr: "under the cover of darkness.", dist: ["below cover darkness.", "in cover darkness.", "at darkness cover.", "to cover darkness."] }
    ]},
    { prompt: "Sarah was in London all day yesterday, so she", trans: "سارا دیروز تمام روز در لندن بود، پس امکان ندارد که در صحنه تصادف حضور داشته باشد.", steps: [
      { corr: "can't have witnessed", dist: ["must have witnessed", "must not have witnessed", "might have witnessed definitely", "can't have witness"], trap: { text: "must not have witnessed", exp: "استنتاج غیرممکن بودن در زمان گذشته can't have + p.p. است نه must not have." } },
      { corr: "the vehicle collision", dist: ["collision vehicle", "to vehicle collision", "for collision vehicle", "with vehicle collision"] },
      { corr: "on the highway here.", dist: ["in highway here.", "at highway here.", "to highway here.", "by highway here."] }
    ]},
    { prompt: "The streets are soaking wet; it", trans: "خیابان‌ها کاملاً خیس هستند؛ حتماً دیشب باران شدیدی باریده است.", steps: [
      { corr: "must have rained", dist: ["can't have rained", "might have rain", "should have rained", "must to have rained"], trap: { text: "can't have rained", exp: "با شواهد خیسی خیابان استنتاج قطعی گذشته must have rained است." } },
      { corr: "very heavily", dist: ["heavy very", "very heavy", "in very heavy", "at very heavy"] },
      { corr: "throughout the entire night.", dist: ["along the entire night.", "in night entire.", "at entire night.", "by entire night."] }
    ]},
    { prompt: "I can't find my keys anywhere; I", trans: "کلیدهایم را پیدا نمی‌کنم؛ شاید آن‌ها را در کافه جا گذاشته باشم.", steps: [
      { corr: "might have left them", dist: ["must have left them definitely", "can't have left them", "might to have left them", "should have left them"], trap: { text: "might to have left them", exp: "بعد از modal حرف اضافه to غلط است: might have left." } },
      { corr: "on the cafe counter", dist: ["in counter cafe", "at counter cafe", "to cafe counter", "by cafe counter"] },
      { corr: "when I paid for lunch.", dist: ["while I paid lunch.", "at I paid for lunch.", "since I paid lunch.", "in paying lunch."] }
    ]},
    { prompt: "David was top of his class and studied hard; he", trans: "دیوید شاگرد اول بود و سخت درس خواند؛ غیرممکن است در این امتحان رد شده باشد.", steps: [
      { corr: "can't have failed", dist: ["must have failed", "must not have failed", "can't to have failed", "might have failed definitely"], trap: { text: "must not have failed", exp: "استنتاج غیرممکن در گذشته can't have failed است." } },
      { corr: "the chemistry exam", dist: ["exam chemistry", "to chemistry exam", "for exam chemistry", "with chemistry exam"] },
      { corr: "without some grading error.", dist: ["without of error.", "no with error.", "with no grading error.", "without error."] }
    ]},
    { prompt: "The lights in the laboratory were off at ten; the team", trans: "چراغ‌های آزمایشگاه ساعت ده خاموش بود؛ تیم حتماً کار را زودتر تمام کرده است.", steps: [
      { corr: "must have finished", dist: ["can't have finished", "might have finish", "should have finished", "must finish have"], trap: { text: "can't have finished", exp: "استنتاج قطعی گذشته must have finished است." } },
      { corr: "their experimental trials", dist: ["trials experimental their", "to experimental trials", "for trials experimental", "with experimental trials"] },
      { corr: "before the evening concluded.", dist: ["before of evening.", "since evening concluded.", "in evening concluding.", "at evening."] }
    ]},
    { prompt: "She looks very confused by the instructions; she", trans: "او از دستورالعمل‌ها گیج به نظر می‌رسد؛ شاید ایمیل توجیهی را دریافت نکرده باشد.", steps: [
      { corr: "might not have received", dist: ["can't have received", "must not have receive", "might to not have received", "should not have received"], trap: { text: "might to not have received", exp: "احتمال منفی در گذشته might not have received است." } },
      { corr: "the explanatory guidelines", dist: ["guidelines explanatory", "to explanatory guidelines", "for guidelines explanatory", "with explanatory guidelines"] },
      { corr: "sent out yesterday morning.", dist: ["send out yesterday.", "sending out yesterday.", "to send out yesterday.", "for send out yesterday."] }
    ]},
    { prompt: "The ancient vase was smashed to pieces; someone", trans: "گلدان باستانی تکه‌تکه شده بود؛ کسی حتماً آن را از روی تاقچه انداخته است.", steps: [
      { corr: "must have knocked it over", dist: ["can't have knocked it", "might have knock it", "should have knocked it", "must knock it have"], trap: { text: "can't have knocked it", exp: "استنتاج قطعی گذشته must have knocked it over است." } },
      { corr: "by accident", dist: ["in accident", "with accident", "at accident", "of accident"] },
      { corr: "while moving furniture.", dist: ["when move furniture.", "since moving furniture.", "at moving furniture.", "to move furniture."] }
    ]},
    { prompt: "He did not have the password, so he", trans: "او رمز عبور را نداشت، بنابراین امکان نداشت که به سرور مرکزی دسترسی پیدا کرده باشد.", steps: [
      { corr: "can't have accessed", dist: ["must have accessed", "must not have accessed", "can't to have accessed", "might have accessed definitely"], trap: { text: "must not have accessed", exp: "استنتاج غیرممکن گذشته can't have accessed است." } },
      { corr: "the confidential files", dist: ["files confidential", "to confidential files", "for files confidential", "with confidential files"] },
      { corr: "from his home terminal.", dist: ["at home terminal.", "in terminal home.", "to terminal home.", "by home terminal."] }
    ]},
    { prompt: "Her phone was turned off during the storm; she", trans: "گوشی او در طول طوفان خاموش بود؛ شاید باتری گوشی‌اش تمام شده بود.", steps: [
      { corr: "might have run out of battery", dist: ["must have run battery definitely", "can't have run battery", "might to have run battery", "should have run battery"], trap: { text: "might to have run battery", exp: "احتمال گذشته might have run out of است." } },
      { corr: "in the remote village", dist: ["at remote village", "on village remote", "to remote village", "by remote village"] },
      { corr: "with no electricity power.", dist: ["without of power.", "no with power.", "with no power electricity.", "without electricity."] }
    ]},
    { prompt: "The flight arrived thirty minutes early; the plane", trans: "پرواز نیم ساعت زودتر رسید؛ هواپیما حتماً باد موافق بسیار شدیدی داشته است.", steps: [
      { corr: "must have had strong tailwinds", dist: ["can't have had tailwinds", "might have have tailwinds", "should have had tailwinds", "must had tailwinds"], trap: { text: "can't have had tailwinds", exp: "استنتاج قطعی گذشته must have had است." } },
      { corr: "across the ocean route", dist: ["in ocean route", "at route ocean", "to ocean route", "by ocean route"] },
      { corr: "speeding up the journey.", dist: ["speed up journey.", "sped up journey.", "to speed up journey.", "for speeding journey."] }
    ]},
    { prompt: "The document has yesterday's timestamp; they", trans: "سند دارای مهر زمانی دیروز است؛ آن‌ها امکان نداشت هفته گذشته آن را امضا کرده باشند.", steps: [
      { corr: "can't have signed it last week", dist: ["must have signed it", "must not have signed it", "can't to have signed it", "might have signed it definitely"], trap: { text: "must not have signed it", exp: "استنتاج غیرممکن در گذشته can't have signed است." } },
      { corr: "before legal revisions", dist: ["after legal revisions", "to legal revisions", "at revisions legal", "with revisions legal"] },
      { corr: "were formally concluded.", dist: ["concluded formally were.", "are formally concluded.", "to be concluded.", "for concluding."] }
    ]},
    { prompt: "I saw an umbrella near his coat; he", trans: "من چتری کنار کتش دیدم؛ او شاید می‌دانسته که باران خواهد بارید.", steps: [
      { corr: "might have anticipated the rain", dist: ["must have anticipate rain", "can't have anticipated rain", "might to have anticipated", "should have anticipate"], trap: { text: "might to have anticipated", exp: "احتمال گذشته might have anticipated است." } },
      { corr: "before stepping outside", dist: ["before step outside", "before to step outside", "in stepping outside", "since step outside"] },
      { corr: "into the chilly morning.", dist: ["at chilly morning.", "on morning chilly.", "to chilly morning.", "by morning chilly."] }
    ]},
    { prompt: "The alarm went off and the doors were opened; someone", trans: "دزدگیر به صدا درآمد و درها باز شدند؛ کسی حتماً رمز عبور را اشتباه وارد کرده است.", steps: [
      { corr: "must have entered the wrong code", dist: ["can't have entered wrong code", "might have enter code", "should have entered code", "must enter code have"], trap: { text: "can't have entered wrong code", exp: "استنتاج قطعی گذشته must have entered است." } },
      { corr: "at the main entrance", dist: ["in main entrance", "on entrance main", "to main entrance", "by entrance main"] },
      { corr: "triggering the loud sirens.", dist: ["trigger loud sirens.", "triggered sirens.", "to trigger sirens.", "for triggering sirens."] }
    ]},
    { prompt: "He was on stage performing in front of hundreds; he", trans: "او روی صحنه در مقابل صدها نفر در حال اجرا بود؛ نمی‌توانست مرتکب جرم شده باشد.", steps: [
      { corr: "can't have committed the robbery", dist: ["must have committed robbery", "must not have committed", "can't to have committed", "might have committed definitely"], trap: { text: "must not have committed", exp: "استنتاج غیرممکن گذشته can't have committed است." } },
      { corr: "at the exact same time", dist: ["in same time exact", "on exact time", "to same time", "by exact time"] },
      { corr: "as proven by video evidence.", dist: ["from video evidence.", "with video evidence.", "of video evidence.", "to video evidence."] }
    ]},
    { prompt: "She wasn't at her desk all afternoon; she", trans: "او تمام بعدازظهر پشت میزش نبود؛ شاید با یک مشتری در بیرون ملاقات داشته است.", steps: [
      { corr: "might have met with clients", dist: ["must have meet clients", "can't have met clients", "might to have met", "should have met clients"], trap: { text: "might to have met", exp: "احتمال گذشته might have met است." } },
      { corr: "outside the corporate office", dist: ["inside of corporate office", "at corporate office", "to corporate office", "by office corporate"] },
      { corr: "to discuss the project.", dist: ["for discuss project.", "in discussing project.", "to discussing project.", "for project discuss."] }
    ]},
    { prompt: "The cake is completely burnt to a cinder; she", trans: "کیک کاملاً سوخته و خاکستر شده است؛ او حتماً دمای فر را خیلی بالا گذاشته بوده است.", steps: [
      { corr: "must have set the temperature", dist: ["can't have set temperature", "might have set temperature", "should have set temperature", "must set temperature have"], trap: { text: "can't have set temperature", exp: "استنتاج قطعی با شواهد سوختگی must have set است." } },
      { corr: "far too high", dist: ["too high far", "high far too", "far high too", "high too far"] },
      { corr: "and forgotten to check it.", dist: ["and forget to check it.", "and forgetting it.", "and to forget it.", "and forgets it."] }
    ]},
    { prompt: "The suspect has an unbreakable alibi; he", trans: "مظنون عذرموجه غیرقابل انکاری دارد؛ او نمی‌توانسته در محل حضور داشته باشد.", steps: [
      { corr: "can't have been present", dist: ["must have been present", "must not have been present", "can't to have been present", "might have been definitely"], trap: { text: "must not have been present", exp: "استنتاج غیرممکن بودن گذشته can't have been است." } },
      { corr: "at the scene of the incident", dist: ["in scene of incident", "on scene of incident", "to scene of incident", "by scene incident"] },
      { corr: "according to telephone records.", dist: ["according telephone records.", "to records telephone according.", "in records telephone.", "by records telephone."] }
    ]},
    { prompt: "The letter has no return address; the sender", trans: "نامه هیچ آدرس فرستنده‌ای ندارد؛ فرستنده شاید خواسته ناشناس بماند.", steps: [
      { corr: "might have wished to remain", dist: ["must have wish remain", "can't have wished remain", "might to have wished", "should have wish remain"], trap: { text: "might to have wished", exp: "احتمال گذشته might have wished است." } },
      { corr: "completely anonymous", dist: ["anonymous completely", "in complete anonymous", "with anonymous complete", "to anonymous completely"] },
      { corr: "for privacy protection.", dist: ["to privacy protection.", "in privacy protection.", "at protection privacy.", "with protection privacy."] }
    ]},
    { prompt: "The championship trophy is in their hands; they", trans: "جام قهرمانی در دستان آنهاست؛ آن‌ها حتماً تمام توان خود را گذاشته بوده‌اند.", steps: [
      { corr: "must have played their best", dist: ["can't have played best", "might have play best", "should have played best", "must play best have"], trap: { text: "can't have played best", exp: "استنتاج قطعی گذشته must have played است." } },
      { corr: "with extraordinary team spirit", dist: ["by team spirit", "from team spirit", "with spirit team", "of team spirit"] },
      { corr: "to win the golden prize.", dist: ["for win golden prize.", "in winning prize.", "to winning prize.", "for prize golden."] }
    ]}
  ],

  // Stages 4 to 10 for B2 (Passive with Reporting Verbs, Non-defining Relative, Purpose & Result, Would rather, 3-part Phrasal, Mixed Conditionals, B2 Master)
  4: [
    { prompt: "The billionaire entrepreneur is reported", trans: "گزارش شده است که این کارآفرین میلیاردر شرکت فناوری جدیدی را در توکیو تأسیس کرده است.", steps: [
      { corr: "to have founded a tech startup", dist: ["to found a tech startup", "founding a tech startup", "that he founded tech startup", "to having founded startup"], trap: { text: "to found a tech startup", exp: "برای عملی که در گذشته رخ داده ساختار مجهول نقلی to have founded الزامی است." } },
      { corr: "in the commercial center of Tokyo", dist: ["at Tokyo commercial center", "on center Tokyo", "to commercial center", "by center Tokyo"] },
      { corr: "with substantial venture capital.", dist: ["by venture capital.", "from venture capital.", "with capital venture.", "of venture capital."] }
    ]},
    { prompt: "The ancient medieval fortress is believed", trans: "اعتقاد بر این است که این قلعه باستانی قرون وسطایی بر روی بقایای یک معبد رومی ساخته شده است.", steps: [
      { corr: "to have been built on the ruins", dist: ["to be built on ruins", "building on ruins", "that it was built on ruins", "to have built on ruins"], trap: { text: "to be built on ruins", exp: "چون ساخت قلعه در گذشته رخ داده و مجهول است to have been built صحیح است." } },
      { corr: "of an archaic Roman temple", dist: ["in Roman temple", "at temple Roman", "to Roman temple", "by Roman temple"] },
      { corr: "centuries before the crusade.", dist: ["centuries crusade before.", "before centuries crusade.", "in centuries crusade.", "at crusade centuries."] }
    ]},
    { prompt: "The fugitive suspect is understood", trans: "اطلاعات نشان می‌دهد که متهم فراری با مدارک جعلی از مرز کشور خارج شده است.", steps: [
      { corr: "to have escaped across the border", dist: ["to escape across border", "escaping across border", "that he escaped border", "to having escaped border"], trap: { text: "to escape across border", exp: "فرار در گذشته انجام شده: to have escaped." } },
      { corr: "using forged travel documents", dist: ["use forged travel documents", "used forged travel documents", "to use forged documents", "for using documents"] },
      { corr: "before border guards reacted.", dist: ["before guards react.", "before to react guards.", "in guards reacting.", "since guards react."] }
    ]},
    { prompt: "The historical manuscript is widely considered", trans: "این نسخه خطی تاریخی به طور گسترده به عنوان مهم‌ترین اثر قرن دوازدهم تلقی می‌شود.", steps: [
      { corr: "to be the most important work", dist: ["to have been important work", "being the most important work", "that it is important work", "to being important work"], trap: { text: "being the most important work", exp: "بعد از considered ساختار مصدر با to be الزامی است." } },
      { corr: "of twelfth-century literature", dist: ["in literature twelfth-century", "at literature twelfth-century", "to literature twelfth-century", "by literature twelfth-century"] },
      { corr: "preserved in national archives.", dist: ["preserve in national archives.", "preserving in archives.", "to preserve in archives.", "for preserving archives."] }
    ]},
    { prompt: "The missing Renaissance painting is claimed", trans: "ادعا شده است که این نقاشی گم‌شده دوره رنسانس در حراجی خصوصی پاریس فروخته شده است.", steps: [
      { corr: "to have been sold privately", dist: ["to be sold privately", "selling privately", "that it was sold privately", "to have sold privately"], trap: { text: "to be sold privately", exp: "فروش در گذشته به شکل مجهول انجام شده: to have been sold." } },
      { corr: "at a confidential auction", dist: ["in confidential auction", "on auction confidential", "to confidential auction", "by auction confidential"] },
      { corr: "to an anonymous private collector.", dist: ["at private collector.", "in private collector.", "for collector private.", "by private collector."] }
    ]},
    { prompt: "The corporate director is alleged", trans: "ادعا می‌شود که مدیر شرکت میلیون‌ها دلار از دارایی‌های سهامداران را اختلاس کرده است.", steps: [
      { corr: "to have embezzled corporate funds", dist: ["to embezzle corporate funds", "embezzling corporate funds", "that he embezzled funds", "to having embezzled funds"], trap: { text: "to embezzle corporate funds", exp: "اختلاس در گذشته رخ داده: to have embezzled." } },
      { corr: "from the international bank", dist: ["at international bank", "in international bank", "for bank international", "with international bank"] },
      { corr: "before auditing was launched.", dist: ["before audit launch.", "before to launch audit.", "in auditing launched.", "since audit launched."] }
    ]},
    { prompt: "The deep oceanic trench is thought", trans: "تصور می‌شود که این گودال عمیق اقیانوسی گونه‌های ناشناخته بی‌شماری از آبزیان را در خود جای داده است.", steps: [
      { corr: "to harbor undiscovered species", dist: ["to have harbored species", "harboring undiscovered species", "that it harbors species", "to harboring species"], trap: { text: "harboring undiscovered species", exp: "حالت کنونی با to harbor بیان می‌شود." } },
      { corr: "of marine aquatic life", dist: ["in marine aquatic life", "at life marine aquatic", "to aquatic life marine", "by life marine"] },
      { corr: "under extreme underwater pressure.", dist: ["below extreme pressure.", "in extreme pressure.", "at pressure extreme.", "to pressure extreme."] }
    ]},
    { prompt: "The championship trophy is expected", trans: "انتظار می‌رود که جام قهرمانی امشب به برنده نهایی اهدا شود.", steps: [
      { corr: "to be presented tonight", dist: ["to have been presented tonight", "presenting tonight", "that it will be presented", "to presenting tonight"], trap: { text: "to have been presented tonight", exp: "رویداد آینده است: to be presented tonight." } },
      { corr: "by the federation president", dist: ["from federation president", "with federation president", "of president federation", "to federation president"] },
      { corr: "at the closing ceremony.", dist: ["in ceremony closing.", "on closing ceremony.", "to ceremony closing.", "by ceremony closing."] }
    ]},
    { prompt: "The ancient pharaoh is reputed", trans: "شهرت دارد که این فرعون باستانی بیش از شصت سال بر مصر حکومت کرده است.", steps: [
      { corr: "to have ruled the kingdom", dist: ["to rule the kingdom", "ruling the kingdom", "that he ruled kingdom", "to having ruled kingdom"], trap: { text: "to rule the kingdom", exp: "حکومت در گذشته انجام شده: to have ruled." } },
      { corr: "for over sixty golden years", dist: ["since sixty golden years", "in sixty golden years", "at sixty golden years", "during sixty golden years"] },
      { corr: "bringing great prosperity.", dist: ["bring prosperity.", "brought prosperity.", "to bring prosperity.", "for bringing prosperity."] }
    ]},
    { prompt: "The new electric engine is claimed", trans: "ادعا می‌شود که این موتور برقی جدید انرژی بسیار کمتری نسبت به مدل‌های قبلی مصرف می‌کند.", steps: [
      { corr: "to consume significantly less power", dist: ["to have consumed less power", "consuming significantly less", "that it consumes power", "to consuming less power"], trap: { text: "to have consumed less power", exp: "قابلیت جاری: to consume significantly less." } },
      { corr: "during highway travel", dist: ["at highway travel", "on highway travel", "to travel highway", "by travel highway"] },
      { corr: "while delivering peak performance.", dist: ["while deliver performance.", "while to deliver performance.", "in delivering performance.", "for delivering performance."] }
    ]},
    { prompt: "The stolen diamonds are suspected", trans: "سوءظن بر این است که الماس‌های مسروقه به خارج از کشور قاچاق شده‌اند.", steps: [
      { corr: "to have been smuggled abroad", dist: ["to be smuggled abroad", "smuggling abroad", "that they were smuggled", "to have smuggled abroad"], trap: { text: "to be smuggled abroad", exp: "قاچاق مجهول در گذشته: to have been smuggled." } },
      { corr: "via international diplomatic bags", dist: ["by diplomatic bags", "through diplomatic bags", "in bags diplomatic", "with bags diplomatic"] },
      { corr: "evading customs inspections.", dist: ["evade customs inspections.", "evaded customs inspections.", "to evade inspections.", "for evading inspections."] }
    ]},
    { prompt: "The ancient philosopher is acknowledged", trans: "این فیلسوف باستانی به عنوان بنیان‌گذار منطق رسمی شناخته می‌شود.", steps: [
      { corr: "to have laid the foundation", dist: ["to lay the foundation", "laying the foundation", "that he laid foundation", "to having laid foundation"], trap: { text: "to lay the foundation", exp: "پایه‌گذاری در گذشته بوده: to have laid." } },
      { corr: "of Western philosophical logic", dist: ["in philosophical logic", "at logic philosophical", "to logic philosophical", "by logic philosophical"] },
      { corr: "centuries before modern science.", dist: ["before modern science centuries.", "in centuries modern science.", "at science modern.", "to modern science."] }
    ]},
    { prompt: "The pharmaceutical drug is estimated", trans: "تخمین زده می‌شود که این داروی گیاهی جان هزاران بیمار را در سراسر جهان نجات دهد.", steps: [
      { corr: "to save thousands of lives", dist: ["to have saved lives", "saving thousands of lives", "that it saves lives", "to saving lives"], trap: { text: "to have saved lives", exp: "اثر کنونی و آینده: to save thousands." } },
      { corr: "across developing countries", dist: ["at developing countries", "in countries developing", "to developing countries", "by developing countries"] },
      { corr: "over the coming decade.", dist: ["since coming decade.", "in decade coming.", "at decade coming.", "during coming decade."] }
    ]},
    { prompt: "The secret military documents are believed", trans: "اعتقاد بر این است که اسناد نظامی محرمانه در جریان بازرسی آتش گرفته و نابود شده‌اند.", steps: [
      { corr: "to have been destroyed in the fire", dist: ["to be destroyed in fire", "destroying in fire", "that they were destroyed", "to have destroyed in fire"], trap: { text: "to be destroyed in fire", exp: "نابودی مجهول در گذشته: to have been destroyed." } },
      { corr: "at the military headquarters", dist: ["in military headquarters", "on headquarters military", "to military headquarters", "by headquarters military"] },
      { corr: "before investigators arrived.", dist: ["before investigators arrive.", "before to arrive investigators.", "in arriving investigators.", "since investigators arrive."] }
    ]},
    { prompt: "The volcanic eruption is thought", trans: "تصور می‌شود که فوران آتشفشانی بیش از پنج روستا را کاملاً زیر خاکستر دفن کرده است.", steps: [
      { corr: "to have buried several settlements", dist: ["to bury several settlements", "burying settlements", "that it buried settlements", "to having buried settlements"], trap: { text: "to bury several settlements", exp: "دفن کردن در گذشته رخ داده: to have buried." } },
      { corr: "beneath volcanic ash layers", dist: ["below ash layers", "in volcanic ash layers", "underneath of ash", "at ash layers"] },
      { corr: "centuries ago.", dist: ["before centuries ago.", "since centuries.", "in centuries ago.", "at centuries ago."] }
    ]},
    { prompt: "The corporate CEO is expected", trans: "انتظار می‌رود که مدیرعامل در مجمع عمومی سهامداران استعفای خود را اعلام کند.", steps: [
      { corr: "to announce his resignation", dist: ["to have announced resignation", "announcing his resignation", "that he announces resignation", "to announcing resignation"], trap: { text: "to have announced resignation", exp: "اقدام آینده: to announce his resignation." } },
      { corr: "at the shareholders' assembly", dist: ["in shareholders assembly", "on assembly shareholders", "to shareholders assembly", "by assembly shareholders"] },
      { corr: "following the financial audit.", dist: ["follow financial audit.", "to follow audit.", "in following audit.", "for following audit."] }
    ]},
    { prompt: "The missing explorer is reported", trans: "گزارش شده است که کاوشگر گمشده در کلبه‌ای دورافتاده در سلامت کامل پیدا شده است.", steps: [
      { corr: "to have been found safe and sound", dist: ["to be found safe and sound", "finding safe and sound", "that he was found safe", "to have found safe"], trap: { text: "to be found safe and sound", exp: "پیدا شدن مجهول در گذشته: to have been found." } },
      { corr: "by mountain rescue volunteers", dist: ["from rescue volunteers", "with rescue volunteers", "of rescue volunteers", "to rescue volunteers"] },
      { corr: "after days of intense searching.", dist: ["after days search intense.", "in days of searching.", "at days searching.", "since days searching."] }
    ]},
    { prompt: "The architectural monument is considered", trans: "این بنای معماری شاهکاری از مهندسی دوران باستان تلقی می‌شود.", steps: [
      { corr: "to be a masterpiece of design", dist: ["to have been masterpiece", "being a masterpiece of design", "that it is masterpiece", "to being masterpiece"], trap: { text: "being a masterpiece of design", exp: "حالت جاری با to be بیان می‌شود." } },
      { corr: "combining stone and marble", dist: ["combine stone and marble", "combined stone and marble", "to combine stone marble", "for combining stone"] },
      { corr: "with unprecedented geometric precision.", dist: ["by geometric precision.", "from geometric precision.", "with precision geometric.", "of precision geometric."] }
    ]},
    { prompt: "The ancient parchment is alleged", trans: "ادعا شده است که این پوست‌نوشته باستانی حاوی کدهای مخفی کیمیاگران قرون وسطی است.", steps: [
      { corr: "to contain secret mathematical codes", dist: ["to have contained codes", "containing secret codes", "that it contains codes", "to containing codes"], trap: { text: "to have contained codes", exp: "محتوای کنونی با to contain بیان می‌شود." } },
      { corr: "written by medieval scholars", dist: ["write by medieval scholars", "writing by scholars", "to write by scholars", "wrote by medieval scholars"] },
      { corr: "centuries before modern alchemy.", dist: ["before modern alchemy centuries.", "in alchemy modern.", "at alchemy modern.", "to modern alchemy."] }
    ]},
    { prompt: "The new solar technology is anticipated", trans: "پیش‌بینی می‌شود که این فناوری خورشیدی جدید هزینه تولید برق را به نصف کاهش دهد.", steps: [
      { corr: "to reduce energy costs by half", dist: ["to have reduced costs", "reducing energy costs", "that it reduces costs", "to reducing costs"], trap: { text: "to have reduced costs", exp: "رویداد آینده: to reduce energy costs." } },
      { corr: "for industrial manufacturing plants", dist: ["at industrial plants", "in plants industrial", "to manufacturing plants", "by manufacturing plants"] },
      { corr: "within the next five years.", dist: ["at next five years.", "in next five years within.", "for next five years.", "by years five next."] }
    ]}
  ],

  // Stages 5 to 10 for B2 (Non-defining Relative, Purpose & Result, Would rather, 3-part Phrasal, Mixed Conditionals, B2 Master)
  5: [
    { prompt: "His latest research paper,", trans: "جدیدترین مقاله پژوهشی او، که ماه گذشته در مجله نیچر منتشر شد، توجه جهانیان را جلب کرد.", steps: [
      { corr: "which was published in Nature,", dist: ["that was published in Nature,", "who was published in Nature,", "where was published in Nature,", "whose was published,"], trap: { text: "that was published in Nature,", exp: "در بندهای موصولی غیرتعریفی (بین دو کاما)، استفاده از that اکیداً ممنوع است و حتماً باید which به کار رود." } },
      { corr: "attracted widespread international acclaim", dist: ["attracts widespread acclaim", "attracting widespread acclaim", "to attract acclaim", "attracted of acclaim"] },
      { corr: "from leading genetic scientists.", dist: ["by leading genetic scientists.", "with leading genetic scientists.", "of genetic scientists.", "to genetic scientists."] }
    ]},
    { prompt: "Doctor Henderson,", trans: "دکتر هندرسون، که قبلاً رئیس انجمن جراحان بود، فردا این عمل پیچیده را انجام خواهد داد.", steps: [
      { corr: "who previously served as chief surgeon,", dist: ["which previously served as chief,", "that previously served as chief,", "whom previously served as chief,", "whose previously served,"], trap: { text: "that previously served as chief,", exp: "در بند موصولی غیرتعریفی برای انسان بعد از کاما از who استفاده می‌شود نه that." } },
      { corr: "will perform the delicate operation", dist: ["performs delicate operation", "performing delicate operation", "to perform operation", "performed delicate operation"] },
      { corr: "at the university hospital.", dist: ["in hospital university.", "on hospital university.", "to hospital university.", "by hospital university."] }
    ]},
    { prompt: "The city of Florence,", trans: "شهر فلورانس، که زادگاه دوره رنسانس به شمار می‌رود، هر سال میلیون‌ها گردشگر جذب می‌کند.", steps: [
      { corr: "which is regarded as the birthplace of the Renaissance,", dist: ["that is regarded as birthplace,", "where is regarded as birthplace,", "who is regarded as birthplace,", "whose is regarded as birthplace,"], trap: { text: "where is regarded as birthplace,", exp: "چون بعد از موصول بلافاصله فعل is regarded آمده است فلورانس فاعل بند است و which می‌خواهد نه where." } },
      { corr: "welcomes millions of tourists", dist: ["welcome millions of tourists", "welcoming millions of tourists", "to welcome tourists", "welcomed of tourists"] },
      { corr: "from across the globe annually.", dist: ["in across the globe.", "at globe across.", "to globe across.", "by globe across."] }
    ]},
    { prompt: "My elder brother,", trans: "برادر بزرگترم، که پنج سال است در ونکوور زندگی می‌کند، هفته آینده به دیدن ما می‌آید.", steps: [
      { corr: "who has lived in Vancouver for five years,", dist: ["which has lived in Vancouver,", "that has lived in Vancouver,", "whom has lived in Vancouver,", "whose has lived in Vancouver,"], trap: { text: "that has lived in Vancouver,", exp: "در بند غیرتعریفی با کاما that ممنوع است و who می‌آید." } },
      { corr: "is coming to visit our family", dist: ["comes to visit family", "coming to visit family", "to come to visit family", "come to visit family"] },
      { corr: "during the spring holidays.", dist: ["at spring holidays.", "in holidays spring.", "for holiday spring.", "on holiday spring."] }
    ]},
    { prompt: "The historical clock tower,", trans: "برج ساعت تاریخی، که در زلزله سال ۱۹۴۴ به شدت آسیب دید، به طور کامل بازسازی شده است.", steps: [
      { corr: "which was severely damaged in the earthquake,", dist: ["that was severely damaged in earthquake,", "where was severely damaged in earthquake,", "who was damaged severely,", "whose was damaged,"], trap: { text: "that was severely damaged in earthquake,", exp: "بعد از کاما that به کار نمی‌رود؛ which الزامی است." } },
      { corr: "has been restored completely", dist: ["has restored completely", "is restored completely", "was restore completely", "have been restored"] },
      { corr: "by master stone masons.", dist: ["from stone masons.", "with stone masons.", "of stone masons.", "to stone masons."] }
    ]},
    { prompt: "Professor Martinez,", trans: "پروفسور مارتینز، که کتاب‌هایش در سرتاسر جهان تدریس می‌شوند، فردا سخنرانی خواهد کرد.", steps: [
      { corr: "whose academic textbooks are studied worldwide,", dist: ["who academic textbooks are studied,", "which academic textbooks are studied,", "that academic textbooks are studied,", "whom academic textbooks,"], trap: { text: "who academic textbooks are studied,", exp: "برای بیان مالکیت (کتاب‌های او) ضمیر موصولی whose الزامی است." } },
      { corr: "will deliver the keynote lecture", dist: ["delivers keynote lecture", "delivering keynote lecture", "to deliver lecture", "delivered keynote lecture"] },
      { corr: "at the scientific symposium.", dist: ["in scientific symposium.", "on symposium scientific.", "to symposium.", "by symposium."] }
    ]},
    { prompt: "The Amazon rainforest,", trans: "جنگل‌های بارانی آمازون، که ریه کره زمین نامیده می‌شود، با خطر مداوم جنگل‌زدایی روبرو است.", steps: [
      { corr: "which produces a vital portion of Earth's oxygen,", dist: ["that produces oxygen of Earth,", "where produces oxygen of Earth,", "who produces oxygen of Earth,", "whose produces oxygen,"], trap: { text: "that produces oxygen of Earth,", exp: "بعد از کاما which می‌آید." } },
      { corr: "faces severe deforestation threats", dist: ["face severe deforestation", "facing deforestation threats", "to face threats", "faced of threats"] },
      { corr: "from commercial logging.", dist: ["by commercial logging.", "with commercial logging.", "of commercial logging.", "to commercial logging."] }
    ]},
    { prompt: "Our university library,", trans: "کتابخانه دانشگاه ما، که بیش از یک میلیون جلد کتاب دارد، بیست و چهار ساعته باز است.", steps: [
      { corr: "which houses over a million volumes,", dist: ["that houses over a million volumes,", "where houses over a million volumes,", "who houses a million volumes,", "whose houses volumes,"], trap: { text: "where houses over a million volumes,", exp: "چون houses فعل است و library فاعل آن است which درست است نه where." } },
      { corr: "remains open around the clock", dist: ["remain open around clock", "remaining open around clock", "to remain open clock", "remained of clock"] },
      { corr: "for dedicated research scholars.", dist: ["to research scholars.", "in research scholars.", "at scholars research.", "with research scholars."] }
    ]},
    { prompt: "Alexander Fleming,", trans: "الکساندر فلمینگ، که پنی‌سیلین را در سال ۱۹۲۸ کشف کرد، جایزه نوبل پزشکی را از آن خود کرد.", steps: [
      { corr: "who accidentally discovered penicillin,", dist: ["which discovered penicillin accidentally,", "that discovered penicillin accidentally,", "whom discovered penicillin,", "whose discovered penicillin,"], trap: { text: "that discovered penicillin accidentally,", exp: "برای انسان در بند با کاما who الزامی است." } },
      { corr: "was awarded the Nobel Prize", dist: ["awarded Nobel Prize", "is awarded Nobel Prize", "were awarded Nobel Prize", "has awarded Nobel Prize"] },
      { corr: "for saving millions of lives.", dist: ["to save millions lives.", "in saving lives.", "at saving lives.", "with saving lives."] }
    ]},
    { prompt: "The Olympic stadium,", trans: "استادیوم المپیک، که برای مسابقات سال ۲۰۱۲ ساخته شد، اکنون میزبان کنسرت‌ها است.", steps: [
      { corr: "which was constructed for the 2012 Games,", dist: ["that was constructed for 2012 Games,", "where was constructed for 2012 Games,", "who was constructed for Games,", "whose was constructed,"], trap: { text: "that was constructed for 2012 Games,", exp: "بعد از کاما which الزامی است." } },
      { corr: "now hosts major music concerts", dist: ["host major music concerts", "hosting music concerts", "to host music concerts", "hosted of concerts"] },
      { corr: "throughout the summer season.", dist: ["at summer season.", "in season summer.", "for season summer.", "by summer season."] }
    ]},
    { prompt: "Her latest sculpture,", trans: "جدیدترین مجسمه او، که از برنز خالص ساخته شده است، در ورودی موزه نصب شده است.", steps: [
      { corr: "which was cast in solid bronze,", dist: ["that was cast in solid bronze,", "where was cast in bronze,", "who was cast in bronze,", "whose was cast bronze,"], trap: { text: "that was cast in solid bronze,", exp: "در بند غیرتعریفی which می‌آید." } },
      { corr: "stands majestically", dist: ["stand majestically", "standing majestically", "to stand majestically", "stood of majestically"] },
      { corr: "in the gallery courtyard.", dist: ["at gallery courtyard.", "on courtyard gallery.", "to gallery courtyard.", "by courtyard gallery."] }
    ]},
    { prompt: "The ancient city walls,", trans: "دیوارهای باستانی شهر، که قرن‌ها پیش ساخته شدند، هنوز استوار ایستاده‌اند.", steps: [
      { corr: "which were erected in medieval times,", dist: ["that were erected in medieval times,", "where were erected in times,", "who were erected in times,", "whose were erected,"], trap: { text: "that were erected in medieval times,", exp: "بعد از کاما which می‌آید." } },
      { corr: "still surround the historic center", dist: ["surrounds historic center", "surrounding historic center", "to surround center", "surrounded of center"] },
      { corr: "protecting cobblestone streets.", dist: ["protect cobblestone streets.", "protected streets.", "to protect streets.", "for protecting streets."] }
    ]},
    { prompt: "Dr. Catherine Howard,", trans: "دکتر کاترین هوارد، که تخصص او در بیوشیمی است، رهبری این پژوهش را بر عهده دارد.", steps: [
      { corr: "whose specialty lies in biochemistry,", dist: ["who specialty lies in biochemistry,", "which specialty lies in biochemistry,", "that specialty lies in biochemistry,", "whom specialty lies,"], trap: { text: "who specialty lies in biochemistry,", exp: "برای مالکیت whose specialty به کار می‌رود." } },
      { corr: "leads the scientific expedition", dist: ["lead scientific expedition", "leading scientific expedition", "to lead expedition", "led of expedition"] },
      { corr: "into the deep arctic circle.", dist: ["at arctic circle deep.", "in circle arctic deep.", "to deep arctic circle.", "by circle arctic."] }
    ]},
    { prompt: "The Pacific ocean,", trans: "اقیانوس آرام، که بزرگترین پهنه آبی جهان است، هزاران جزیره زیبا دارد.", steps: [
      { corr: "which covers more than thirty percent of the Earth,", dist: ["that covers thirty percent of Earth,", "where covers thirty percent of Earth,", "who covers thirty percent,", "whose covers thirty percent,"], trap: { text: "that covers thirty percent of Earth,", exp: "بعد از کاما which الزامی است." } },
      { corr: "contains countless remote islands", dist: ["contain remote islands", "containing remote islands", "to contain islands", "contained of islands"] },
      { corr: "with unique marine ecosystems.", dist: ["by marine ecosystems.", "from ecosystems marine.", "with ecosystems marine.", "of marine ecosystems."] }
    ]},
    { prompt: "The chief executive officer,", trans: "مدیرعامل شرکت، که دیروز استعفای خود را اعلام کرد، بیست سال خدمت کرده بود.", steps: [
      { corr: "who announced his sudden retirement yesterday,", dist: ["which announced his retirement,", "that announced his retirement,", "whom announced his retirement,", "whose announced retirement,"], trap: { text: "that announced his retirement,", exp: "برای انسان who می‌آید." } },
      { corr: "had served the corporation", dist: ["has served corporation", "served corporation had", "was serving corporation", "serves corporation had"] },
      { corr: "for over two decades.", dist: ["since two decades.", "in two decades over.", "at two decades.", "during two decades."] }
    ]},
    { prompt: "The Golden Gate Bridge,", trans: "پل گلدن گیت، که در سال ۱۹۳۷ افتتاح شد، نماد شهر سانفرانسیسکو است.", steps: [
      { corr: "which was opened to traffic in 1937,", dist: ["that was opened to traffic in 1937,", "where was opened to traffic in 1937,", "who was opened to traffic,", "whose was opened,"], trap: { text: "that was opened to traffic in 1937,", exp: "بعد از کاما which می‌آید." } },
      { corr: "is an iconic engineering landmark", dist: ["are iconic landmark", "being iconic landmark", "to be landmark iconic", "been iconic landmark"] },
      { corr: "recognized around the world.", dist: ["recognize around world.", "recognizing world around.", "to recognize world.", "for recognizing world."] }
    ]},
    { prompt: "Marie Curie,", trans: "ماری کوری، که دو جایزه نوبل در رشته‌های مختلف دریافت کرد، پیشگام پژوهش‌های رادیواکتیو بود.", steps: [
      { corr: "who won Nobel prizes in physics and chemistry,", dist: ["which won Nobel prizes in physics,", "that won Nobel prizes in physics,", "whom won Nobel prizes,", "whose won Nobel prizes,"], trap: { text: "that won Nobel prizes in physics,", exp: "برای انسان who الزامی است." } },
      { corr: "pioneered radioactive research", dist: ["pioneer radioactive research", "pioneering research", "to pioneer research", "pioneers research"] },
      { corr: "in modern laboratory science.", dist: ["at modern laboratory science.", "on science laboratory.", "to laboratory science.", "by laboratory science."] }
    ]},
    { prompt: "The high-speed rail line,", trans: "خط راه‌آهن پرسرعت، که دو پایتخت را به هم متصل می‌کند، زمان سفر را به نصف رسانده است.", steps: [
      { corr: "which links the two metropolitan capitals,", dist: ["that links the two metropolitan capitals,", "where links the two capitals,", "who links two capitals,", "whose links two capitals,"], trap: { text: "that links the two metropolitan capitals,", exp: "بعد از کاما which درست است." } },
      { corr: "has cut journey travel times", dist: ["have cut travel times", "is cut travel times", "cut travel times has", "had cut travel times"] },
      { corr: "by more than fifty percent.", dist: ["in more fifty percent.", "at fifty percent more.", "to fifty percent.", "for fifty percent."] }
    ]},
    { prompt: "My grandfather's antique pocket watch,", trans: "ساعت جیبی عتیقه پدربزرگم، که از طلای جامد ساخته شده است، هنوز به دقت کار می‌کند.", steps: [
      { corr: "which was crafted from solid gold,", dist: ["that was crafted from solid gold,", "where was crafted from gold,", "who was crafted from gold,", "whose was crafted gold,"], trap: { text: "that was crafted from solid gold,", exp: "بعد از کاما which می‌آید." } },
      { corr: "still keeps perfect time", dist: ["still keep perfect time", "still keeping perfect time", "to keep perfect time", "still kept perfect time"] },
      { corr: "after nearly a century.", dist: ["since nearly century.", "in century nearly.", "at nearly century.", "during nearly century."] }
    ]},
    { prompt: "The international airport terminal,", trans: "ترمینال فرودگاه بین‌المللی، که ماه گذشته افتتاح شد، ظرفیت جابه‌جایی مسافران را دو برابر کرد.", steps: [
      { corr: "which was inaugurated last month,", dist: ["that was inaugurated last month,", "where was inaugurated last month,", "who was inaugurated last month,", "whose was inaugurated,"], trap: { text: "that was inaugurated last month,", exp: "بعد از کاما which الزامی است." } },
      { corr: "doubled passenger capacity", dist: ["double passenger capacity", "doubling capacity passenger", "to double capacity", "doubled of capacity"] },
      { corr: "for long-haul intercontinental flights.", dist: ["to long-haul flights.", "in flights long-haul.", "at flights intercontinental.", "with long-haul flights."] }
    ]}
  ],

  // Stages 6 to 10 for B2 (Purpose & Result, Would rather, 3-part Phrasal, Mixed Conditionals, B2 Master)
  6: [
    { prompt: "The architect reinforced the steel foundation", trans: "معمار پی فولادی را مقاوم‌سازی کرد تا آسمان‌خراش بتواند در برابر بادهای شدید مقاومت کند.", steps: [
      { corr: "so that the skyscraper could withstand", dist: ["so that the skyscraper can withstand", "in order the skyscraper withstand", "for the skyscraper could withstand", "so as the skyscraper withstand"], trap: { text: "so that the skyscraper can withstand", exp: "چون جمله اصلی گذشته است (reinforced)، در بند هدف could withstand می‌آید نه can." } },
      { corr: "extreme hurricane-force winds", dist: ["winds hurricane extreme", "to extreme winds", "for winds hurricane", "with extreme winds"] },
      { corr: "without suffering structural damage.", dist: ["without of damage.", "no with damage.", "with no structural damage.", "without damage."] }
    ]},
    { prompt: "She spoke in a gentle whisper", trans: "او با صدایی بسیار ملایم نجوا کرد تا بیمار در حال خواب بیدار نشود.", steps: [
      { corr: "in order not to wake", dist: ["in order to not wake", "so that not wake", "for not wake", "in order no waking"], trap: { text: "in order to not wake", exp: "حالت منفی بیان هدف in order not to + فعل ساده است." } },
      { corr: "the sleeping patient", dist: ["patient sleeping", "to sleeping patient", "for patient sleeping", "with patient sleeping"] },
      { corr: "in the recovery ward.", dist: ["at recovery ward.", "on recovery ward.", "to ward recovery.", "by recovery ward."] }
    ]},
    { prompt: "The team worked overtime throughout the weekend", trans: "تیم در طول آخر هفته اضافه کاری کرد تا قبل از مهلت دوشنبه پروژه را تحویل دهد.", steps: [
      { corr: "so that they would meet", dist: ["so that they will meet", "in order they meet", "for they would meet", "so to they meet"], trap: { text: "so that they will meet", exp: "در گذشته would meet به کار می‌رود." } },
      { corr: "the client's strict deadline", dist: ["deadline client strict", "to strict deadline", "for deadline strict", "with strict deadline"] },
      { corr: "without requesting an extension.", dist: ["without of extension.", "no with extension.", "with no extension.", "without extension."] }
    ]},
    { prompt: "He installed high-security digital locks", trans: "او قفل‌های دیجیتال فوق‌امنیتی نصب کرد تا از ورود غیرمجاز افراد جلوگیری کند.", steps: [
      { corr: "so as to prevent unauthorized access", dist: ["so as prevent unauthorized access", "in order prevent access", "so to prevent access", "for prevent access"], trap: { text: "so as prevent unauthorized access", exp: "ساختار so as to + فعل ساده (prevent) الزامی است." } },
      { corr: "to the server room", dist: ["in server room", "at server room", "on room server", "by server room"] },
      { corr: "by outside intruders.", dist: ["from outside intruders.", "with outside intruders.", "of intruders outside.", "to outside intruders."] }
    ]},
    { prompt: "The company lowered retail prices significantly", trans: "شرکت قیمت‌های خرده‌فروشی را به میزان قابل توجهی کاهش داد که در نتیجه آن فروش دو برابر شد.", steps: [
      { corr: "with the result that sales doubled", dist: ["with the result that sales double", "with result sales double", "so that sales to double", "in order that sales double"], trap: { text: "with the result that sales double", exp: "بیان نتیجه گذشته: sales doubled." } },
      { corr: "within the first quarter", dist: ["at first quarter", "on quarter first", "to quarter first", "by quarter first"] },
      { corr: "surpassing all financial expectations.", dist: ["surpassed expectations.", "surpass expectations.", "to surpass expectations.", "for surpassing expectations."] }
    ]},
    { prompt: "She left for the airport three hours early", trans: "او سه ساعت زودتر به سمت فرودگاه حرکت کرد تا مبادا به پرواز بین‌المللی نرسد.", steps: [
      { corr: "so that she would not miss", dist: ["so that she will not miss", "in order she not miss", "for she would not miss", "so that she miss not"], trap: { text: "so that she will not miss", exp: "در گذشته would not miss می‌آید." } },
      { corr: "the intercontinental departure", dist: ["departure intercontinental", "to departure intercontinental", "for departure intercontinental", "with departure"] },
      { corr: "in morning rush-hour traffic.", dist: ["at traffic rush hour.", "on rush hour traffic.", "to traffic rush.", "by traffic rush."] }
    ]},
    { prompt: "The doctor wore sterile surgical gloves", trans: "پزشک دستکش‌های استریل جراحی پوشید تا مانع از گسترش هرگونه عفونت باکتریایی شود.", steps: [
      { corr: "in order to prevent bacterial infection", dist: ["in order prevent infection", "so that prevent infection", "for prevent infection", "in order to preventing"], trap: { text: "in order prevent bacterial infection", exp: "نیاز به in order to prevent دارد." } },
      { corr: "during the operating procedure", dist: ["at operating procedure", "in procedure operating", "to operating procedure", "by operating procedure"] },
      { corr: "inside the clean theater.", dist: ["at clean theater.", "on clean theater.", "to clean theater.", "by clean theater."] }
    ]},
    { prompt: "We booked our flight tickets six months in advance", trans: "ما بلیط‌های پرواز را شش ماه قبل رزرو کردیم تا بتوانیم ارزان‌ترین نرخ‌ها را به دست آوریم.", steps: [
      { corr: "so that we could secure", dist: ["so that we can secure", "in order we secure", "for we could secure", "so that we secure to"], trap: { text: "so that we can secure", exp: "در گذشته could secure می‌آید." } },
      { corr: "the lowest promotional fares", dist: ["fares lowest promotional", "to promotional fares", "for fares promotional", "with promotional fares"] },
      { corr: "for our family vacation.", dist: ["to family vacation.", "in family vacation.", "at vacation family.", "with family vacation."] }
    ]},
    { prompt: "He wore dark tinted sunglasses", trans: "او عینک آفتابی تیره به چشم زد تا چشمانش در برابر نور شدید خورشید محافظت شوند.", steps: [
      { corr: "so as to shield his eyes", dist: ["so as shield his eyes", "in order shield eyes", "so to shield eyes", "for shield eyes"], trap: { text: "so as shield his eyes", exp: "ساختار so as to shield درست است." } },
      { corr: "from intense ultraviolet glare", dist: ["of intense ultraviolet glare", "by glare ultraviolet", "with ultraviolet glare", "at ultraviolet glare"] },
      { corr: "on the snowy alpine slopes.", dist: ["in alpine slopes snowy.", "at alpine slopes.", "to alpine slopes.", "by alpine slopes."] }
    ]},
    { prompt: "The government subsidized solar panels,", trans: "دولت برای پنل‌های خورشیدی یارانه اختصاص داد، که در نتیجه استفاده از انرژی سبز به اوج رسید.", steps: [
      { corr: "with the result that clean energy adoption", dist: ["with result clean adoption", "so that adoption to rise", "in order adoption rise", "with result that adoption rose"], trap: { text: "with result clean adoption", exp: "ساختار نتیجه with the result that ... است." } },
      { corr: "increased dramatically across cities", dist: ["increase dramatically across cities", "increasing across cities", "to increase across cities", "increased of cities"] },
      { corr: "within just three years.", dist: ["at three years within.", "in years three.", "for three years.", "by three years."] }
    ]},
    { prompt: "The scientist double-checked all chemical measurements", trans: "دانشمند تمام مقادیر شیمیایی را دو بار بررسی کرد تا از هرگونه اشتباه جلوگیری کند.", steps: [
      { corr: "in order not to make any errors", dist: ["in order to not make errors", "so that not make errors", "for not make errors", "in order no making errors"], trap: { text: "in order to not make errors", exp: "منفی بیان هدف in order not to make است." } },
      { corr: "in the final statistical analysis", dist: ["at statistical analysis", "on analysis statistical", "to statistical analysis", "by statistical analysis"] },
      { corr: "before publishing the results.", dist: ["before publish results.", "before to publish results.", "in publishing results.", "since publish results."] }
    ]},
    { prompt: "They soundproofed the recording studio", trans: "آن‌ها استودیوی ضبط را عایق صدا کردند تا صدای خیابان وارد آهنگ‌ها نشود.", steps: [
      { corr: "so that outside street noise", dist: ["in order street noise", "for street noise", "so that to street noise", "so street noise to"], trap: { text: "so that to street noise", exp: "ساختار so that + فاعل + فعل است." } },
      { corr: "would not bleed into the microphones", dist: ["will not bleed into microphones", "did not bleed into microphones", "is not bleed into microphones", "does not bleed microphones"], trap: { text: "will not bleed into microphones", exp: "در گذشته would not bleed می‌آید." } },
      { corr: "during acoustic sessions.", dist: ["at acoustic sessions.", "in sessions acoustic.", "to acoustic sessions.", "by acoustic sessions."] }
    ]},
    { prompt: "The chef stored the perishable seafood on ice", trans: "سرآشپز غذاهای دریایی فاسدشدنی را روی یخ نگه داشت تا آنها فاسد نشوند.", steps: [
      { corr: "so as to prevent spoilage", dist: ["so as prevent spoilage", "in order prevent spoilage", "so to prevent spoilage", "for prevent spoilage"], trap: { text: "so as prevent spoilage", exp: "ساختار so as to prevent درست است." } },
      { corr: "before the evening dinner service", dist: ["to dinner service", "at service dinner", "in dinner service", "by dinner service"] },
      { corr: "for high-end restaurant guests.", dist: ["to restaurant guests.", "in restaurant guests.", "at guests restaurant.", "with restaurant guests."] }
    ]},
    { prompt: "The driver drove cautiously through the thick fog", trans: "راننده با احتیاط در مه غلیظ رانندگی کرد تا تصادفی رخ ندهد.", steps: [
      { corr: "in order to avoid an accident", dist: ["in order avoid accident", "so that avoid accident", "for avoid accident", "in order to avoiding accident"], trap: { text: "in order avoid accident", exp: "نیاز به in order to avoid دارد." } },
      { corr: "on the slippery winding mountain pass", dist: ["in mountain pass slippery", "at pass mountain", "to mountain pass", "by mountain pass"] },
      { corr: "with near-zero visibility.", dist: ["by visibility near-zero.", "from visibility.", "with visibility zero.", "of visibility."] }
    ]},
    { prompt: "The municipality widened the pedestrian walkways,", trans: "شهرداری پیاده‌روها را تعریض کرد، که در نتیجه رفت و آمد بسیار روان‌تر شد.", steps: [
      { corr: "with the result that foot traffic", dist: ["with result foot traffic", "so that traffic to flow", "in order traffic flow", "with the result foot traffic to"], trap: { text: "with result foot traffic", exp: "ساختار with the result that است." } },
      { corr: "flowed much more smoothly", dist: ["flow much more smoothly", "flowing much smoothly", "to flow smoothly", "flowed of smoothly"] },
      { corr: "during evening rush hours.", dist: ["at rush hours evening.", "in rush hours evening.", "to rush hours.", "by rush hours."] }
    ]},
    { prompt: "He wore warm thermal boots", trans: "او چکمه‌های گرم ساق‌بلند پوشید تا پاهایش در برف یخ نزند.", steps: [
      { corr: "so that his feet would stay warm", dist: ["so that his feet will stay warm", "in order feet stay warm", "for his feet stay warm", "so his feet stay to"], trap: { text: "so that his feet will stay warm", exp: "در گذشته would stay می‌آید." } },
      { corr: "during the arctic expedition", dist: ["in arctic expedition", "at expedition arctic", "to arctic expedition", "by arctic expedition"] },
      { corr: "under sub-zero temperatures.", dist: ["below sub-zero temperatures.", "in temperatures sub-zero.", "at temperatures.", "to temperatures."] }
    ]},
    { prompt: "She hid the birthday gift in the top closet", trans: "او کادوی تولد را در بالای کمد پنهان کرد تا خواهرش آن را زودتر پیدا نکند.", steps: [
      { corr: "in order that her sister might not find it", dist: ["in order her sister not find it", "so that sister find not it", "for sister might not find", "in order to sister not find"], trap: { text: "in order her sister not find it", exp: "ساختار رسمی in order that + فاعل + might/would not است." } },
      { corr: "before the weekend celebration", dist: ["before of celebration.", "since celebration weekend.", "in weekend celebration.", "at celebration."] }
    ]},
    { prompt: "The teacher spoke loudly and clearly", trans: "معلم بلند و رسا صحبت کرد تا دانش‌آموزان در ردیف‌های آخر همه چیز را بشنوند.", steps: [
      { corr: "so that everyone in the back row could hear", dist: ["so that everyone can hear", "in order everyone hear", "for everyone could hear", "so to everyone hear"], trap: { text: "so that everyone can hear", exp: "در گذشته could hear می‌آید." } },
      { corr: "every single instruction", dist: ["instruction every single", "to instruction single", "for instruction every", "with every instruction"] },
      { corr: "for the upcoming exam.", dist: ["to upcoming exam.", "in upcoming exam.", "at exam upcoming.", "with upcoming exam."] }
    ]},
    { prompt: "They reinforced the coastal sea wall", trans: "آن‌ها دیواره ساحلی را تقویت کردند تا از ورود امواج سهمگین به شهر جلوگیری کنند.", steps: [
      { corr: "so as to protect the town", dist: ["so as protect the town", "in order protect town", "so to protect town", "for protect town"], trap: { text: "so as protect the town", exp: "ساختار so as to protect درست است." } },
      { corr: "from rising storm surges", dist: ["of storm surges rising", "by storm surges", "with surges storm", "at storm surges"] },
      { corr: "during seasonal typhoons.", dist: ["in seasonal typhoons.", "at typhoons seasonal.", "to seasonal typhoons.", "by seasonal typhoons."] }
    ]},
    { prompt: "The library enforced complete silence,", trans: "کتابخانه سکوت مطلق را اعمال کرد، که در نتیجه تمرکز دانشجویان بسیار بالا رفت.", steps: [
      { corr: "with the result that concentration levels", dist: ["with result concentration levels", "so that levels to rise", "in order levels rise", "with result that levels to"], trap: { text: "with result concentration levels", exp: "ساختار with the result that است." } },
      { corr: "improved remarkably among students", dist: ["improve remarkably among students", "improving among students", "to improve remarkably", "improved of students"] },
      { corr: "preparing for finals.", dist: ["prepare for finals.", "prepared for finals.", "to prepare finals.", "for prepare finals."] }
    ]}
  ],

  7: [
    { prompt: "Under the current circumstances, I would rather", trans: "در شرایط فعلی، ترجیح می‌دهم که شما ارقام محرمانه را به رقبا فاش نکنید.", steps: [
      { corr: "you did not disclose", dist: ["you do not disclose", "you will not disclose", "you not disclose", "you to not disclose"], trap: { text: "you do not disclose", exp: "وقتی فاعل بعد از would rather تغییر می‌کند (I would rather you...) فعل باید به زمان گذشته ساده (did not disclose) برود." } },
      { corr: "the confidential financial figures", dist: ["figures confidential financial", "to financial figures", "for figures financial", "with financial figures"] },
      { corr: "to competing commercial firms.", dist: ["at competing commercial firms.", "in firms commercial.", "for firms competing.", "by firms commercial."] }
    ]},
    { prompt: "You look terribly feverish and ill; you", trans: "خیلی تب‌دار و مریض به نظر می‌رسی؛ بهتر است همین الان با یک پزشک تماس بگیری.", steps: [
      { corr: "had better call a doctor", dist: ["had better to call a doctor", "would better call a doctor", "had best call a doctor", "have better call doctor"], trap: { text: "had better to call a doctor", exp: "بعد از had better فعل اصلی به صورت ساده بدون to می‌آید (call)." } },
      { corr: "at the nearest medical clinic", dist: ["in nearest clinic", "on clinic nearest", "to clinic medical", "by clinic medical"] },
      { corr: "before your condition worsens.", dist: ["before condition worsen.", "before to worsen.", "in condition worsening.", "since condition worsen."] }
    ]},
    { prompt: "I would rather", trans: "من ترجیح می‌دهم امشب به جای رفتن به رستوران در خانه شام بپزم.", steps: [
      { corr: "cook a quiet dinner at home", dist: ["to cook a quiet dinner", "cooking a quiet dinner", "cooked a quiet dinner", "for cook dinner"], trap: { text: "to cook a quiet dinner", exp: "وقتی فاعل یکسان است بعد از would rather فعل ساده بدون to (cook) می‌آید." } },
      { corr: "than dine out", dist: ["then dine out", "instead dine out", "rather dine out", "to dine out"], trap: { text: "then dine out", exp: "حرف ربط مقایسه بعد از would rather کلمه than است نه then." } },
      { corr: "at an overcrowded restaurant.", dist: ["in overcrowded restaurant.", "on restaurant overcrowded.", "to restaurant crowded.", "by restaurant crowded."] }
    ]},
    { prompt: "The flight boards in thirty minutes; we", trans: "سوار شدن به پرواز نیم ساعت دیگر آغاز می‌شود؛ بهتر است عجله کنیم.", steps: [
      { corr: "had better hurry up", dist: ["had better to hurry up", "would better hurry up", "have better hurry up", "had better hurrying"], trap: { text: "had better to hurry up", exp: "بعد از had better فعل ساده بدون to (hurry up) می‌آید." } },
      { corr: "through the security checkpoint", dist: ["in security checkpoint", "at checkpoint security", "to security checkpoint", "by checkpoint security"] },
      { corr: "to avoid missing the gate.", dist: ["for avoid missing gate.", "in avoiding gate.", "to avoiding gate.", "for gate missing."] }
    ]},
    { prompt: "My manager would rather I", trans: "مدیر من ترجیح می‌دهد که من پایان هفته اضافه کاری نکنم و استراحت کنم.", steps: [
      { corr: "did not work overtime", dist: ["do not work overtime", "will not work overtime", "not work overtime", "to not work overtime"], trap: { text: "do not work overtime", exp: "با تغییر فاعل گذشته ساده did not work الزامی است." } },
      { corr: "on the weekend project", dist: ["at weekend project", "in project weekend", "to weekend project", "by weekend project"] },
      { corr: "so that I avoid exhaustion.", dist: ["in order I avoid exhaustion.", "for avoid exhaustion.", "so avoid exhaustion.", "in order to avoid."] }
    ]},
    { prompt: "You had better", trans: "بهتر است رمز عبورت را به هیچ کس نگویی؛ در غیر این صورت هک می‌شوی.", steps: [
      { corr: "not share your password", dist: ["not to share your password", "don't share password", "to not share password", "not sharing password"], trap: { text: "not to share your password", exp: "حالت منفی had better با not + فعل ساده (not share) ساخته می‌شود." } },
      { corr: "with any third parties", dist: ["by third parties", "from third parties", "to third parties with", "of third parties"] },
      { corr: "to maintain system security.", dist: ["for maintain security.", "in maintaining security.", "to maintaining security.", "for security maintain."] }
    ]},
    { prompt: "She would rather", trans: "او ترجیح می‌دهد با مترو رفت و آمد کند تا اینکه در ترافیک بماند.", steps: [
      { corr: "take the rapid subway", dist: ["to take rapid subway", "taking rapid subway", "took rapid subway", "for take subway"], trap: { text: "to take rapid subway", exp: "بعد از would rather شکل ساده take می‌آید." } },
      { corr: "than get stuck", dist: ["then get stuck", "to get stuck", "rather get stuck", "instead get stuck"], trap: { text: "then get stuck", exp: "حرف ربط than است نه then." } },
      { corr: "in morning highway gridlock.", dist: ["at highway gridlock.", "on gridlock highway.", "to gridlock highway.", "by gridlock highway."] }
    ]},
    { prompt: "The icy roads are dangerous; you", trans: "جاده‌های یخ‌زده خطرناک هستند؛ بهتر است با سرعت مطمئنه رانندگی کنی.", steps: [
      { corr: "had better drive very carefully", dist: ["had better to drive carefully", "would better drive carefully", "have better drive carefully", "had better driving"], trap: { text: "had better to drive carefully", exp: "بعد از had better فعل ساده drive می‌آید." } },
      { corr: "on the winding mountain pass", dist: ["in mountain pass winding", "at pass mountain", "to mountain pass", "by mountain pass"] },
      { corr: "to prevent sliding off.", dist: ["for prevent sliding off.", "in preventing sliding.", "to preventing sliding.", "for sliding prevent."] }
    ]},
    { prompt: "I would rather they", trans: "من ترجیح می‌دهم آن‌ها نتیجه را صادقانه به من بگویند تا اینکه حقیقت را پنهان کنند.", steps: [
      { corr: "told me the absolute truth", dist: ["tell me absolute truth", "will tell me truth", "to tell me truth", "have told me truth"], trap: { text: "tell me absolute truth", exp: "با تغییر فاعل would rather they + گذشته ساده (told) الزامی است." } },
      { corr: "regarding the audit findings", dist: ["to audit findings", "in audit findings", "at findings audit", "for findings audit"] },
      { corr: "instead of concealing facts.", dist: ["instead conceal facts.", "without conceal facts.", "in place concealing.", "instead of conceal facts."] }
    ]},
    { prompt: "We had better", trans: "بهتر است کلید یدک را در مکانی امن نگه داریم.", steps: [
      { corr: "keep the spare key", dist: ["to keep the spare key", "keeping the spare key", "kept the spare key", "for keep spare key"], trap: { text: "to keep the spare key", exp: "بعد از had better فعل ساده keep بدون to می‌آید." } },
      { corr: "in a secure lockbox", dist: ["at secure lockbox", "on lockbox secure", "to lockbox secure", "by lockbox secure"] },
      { corr: "in case of emergencies.", dist: ["in case emergencies.", "for case of emergencies.", "at case emergencies.", "with case emergencies."] }
    ]},
    { prompt: "He would rather we", trans: "او ترجیح می‌دهد که ما موضوع را فردا در جلسه‌ای رسمی مطرح کنیم.", steps: [
      { corr: "discussed the matter tomorrow", dist: ["discuss the matter tomorrow", "will discuss matter", "to discuss matter", "have discussed matter"], trap: { text: "discuss the matter tomorrow", exp: "با تغییر فاعل گذشته ساده discussed الزامی است." } },
      { corr: "at a formal meeting", dist: ["in formal meeting", "on meeting formal", "to meeting formal", "by meeting formal"] },
      { corr: "rather than in the hallway.", dist: ["then in the hallway.", "instead in hallway.", "to hallway rather.", "for hallway."] }
    ]},
    { prompt: "The battery is critically low; she", trans: "باتری رو به اتمام است؛ او بهتر است لپ‌تاپ را به برق بزند.", steps: [
      { corr: "had better plug in the charger", dist: ["had better to plug in charger", "would better plug in charger", "has better plug in charger", "had better plugging"], trap: { text: "had better to plug in charger", exp: "بعد از had better فعل ساده plug in بدون to است." } },
      { corr: "to the wall outlet", dist: ["at wall outlet", "in wall outlet", "for wall outlet", "with wall outlet"] },
      { corr: "before unsaved work is lost.", dist: ["before work lose.", "before to lose work.", "in losing work.", "since work lose."] }
    ]},
    { prompt: "I would rather", trans: "من ترجیح می‌دهم یک سال دیگر صبر کنم تا بتوانم خودروی بهتری بخرم.", steps: [
      { corr: "wait another full year", dist: ["to wait another year", "waiting another year", "waited another year", "for wait another year"], trap: { text: "to wait another year", exp: "بعد از would rather فعل ساده wait بدون to می‌آید." } },
      { corr: "than purchase a subpar car", dist: ["then purchase car", "rather purchase car", "to purchase car", "instead purchase car"], trap: { text: "then purchase car", exp: "حرف ربط than است نه then." } },
      { corr: "with high maintenance costs.", dist: ["by maintenance costs.", "from maintenance costs.", "with costs maintenance.", "of maintenance costs."] }
    ]},
    { prompt: "You had better", trans: "بهتر است به این شیرها در حال کار دست نزنی؛ داغ هستند.", steps: [
      { corr: "not touch these metal pipes", dist: ["not to touch metal pipes", "don't touch metal pipes", "to not touch pipes", "not touching pipes"], trap: { text: "not to touch metal pipes", exp: "حالت منفی had better not touch بدون to است." } },
      { corr: "with bare hands", dist: ["by bare hands", "from bare hands", "in bare hands", "of bare hands"] },
      { corr: "because of scorching steam.", dist: ["because scorching steam.", "due to of steam.", "for scorching steam.", "with steam scorching."] }
    ]},
    { prompt: "They would rather the landlord", trans: "آن‌ها ترجیح می‌دهند که صاحبخانه سیستم گرمایشی را قبل از زمستان تعمیر کند.", steps: [
      { corr: "repaired the central radiator", dist: ["repairs central radiator", "will repair radiator", "to repair radiator", "repair central radiator"], trap: { text: "repair central radiator", exp: "با تغییر فاعل گذشته ساده repaired الزامی است." } },
      { corr: "before the first freezing freeze", dist: ["in first freeze", "at freezing freeze", "to freeze first", "by freeze first"] },
      { corr: "causes pipes to burst.", dist: ["cause pipes burst.", "causing pipes burst.", "to cause pipes burst.", "for causing burst."] }
    ]},
    { prompt: "The deadline is at five p.m.; we", trans: "مهلت ساعت پنج تمام می‌شود؛ بهتر است پروژه را همین الان ارسال کنیم.", steps: [
      { corr: "had better submit the proposal", dist: ["had better to submit proposal", "would better submit proposal", "have better submit proposal", "had better submitting"], trap: { text: "had better to submit proposal", exp: "بعد از had better فعل ساده submit می‌آید." } },
      { corr: "through the portal", dist: ["at the portal", "in the portal", "to portal through", "by the portal"] },
      { corr: "without delay.", dist: ["without of delay.", "no with delay.", "with no delay.", "without delay any."] }
    ]},
    { prompt: "She would rather", trans: "او ترجیح می‌دهد یک استارتاپ کوچک راه بیندازد تا در یک شرکت کسل‌کننده کار کند.", steps: [
      { corr: "launch her own startup", dist: ["to launch her own startup", "launching her startup", "launched her startup", "for launch startup"], trap: { text: "to launch her own startup", exp: "بعد از would rather فعل ساده launch بدون to می‌آید." } },
      { corr: "than work in a bureaucracy", dist: ["then work bureaucracy", "rather work bureaucracy", "to work in bureaucracy", "instead work bureaucracy"], trap: { text: "then work bureaucracy", exp: "حرف ربط than است نه then." } },
      { corr: "with rigid routines.", dist: ["by rigid routines.", "from rigid routines.", "with routines rigid.", "of rigid routines."] }
    ]},
    { prompt: "You had better", trans: "بهتر است قرارداد را با دقت بخوانی قبل از اینکه آن را امضا کنی.", steps: [
      { corr: "read the entire contract", dist: ["to read entire contract", "reading entire contract", "readed entire contract", "for read contract"], trap: { text: "to read entire contract", exp: "بعد از had better فعل ساده read می‌آید." } },
      { corr: "including fine print terms", dist: ["include fine print terms", "included fine terms", "to include terms", "for including terms"] },
      { corr: "before signing your name.", dist: ["before sign your name.", "before to sign name.", "in signing name.", "since sign name."] }
    ]},
    { prompt: "I would rather you", trans: "من ترجیح می‌دهم که تو در جلسه فردا به جای من شرکت کنی.", steps: [
      { corr: "represented our department", dist: ["represent our department", "will represent department", "to represent department", "have represented department"], trap: { text: "represent our department", exp: "با تغییر فاعل گذشته ساده represented الزامی است." } },
      { corr: "at the conference", dist: ["in the conference", "on the conference", "to the conference", "by the conference"] },
      { corr: "in place of me.", dist: ["instead of me place.", "at my place.", "to my place.", "by place of me."] }
    ]},
    { prompt: "We had better", trans: "بهتر است قبل از رسیدن ترافیک سنگین شهر را ترک کنیم.", steps: [
      { corr: "depart before rush hour", dist: ["to depart before rush hour", "departing before rush hour", "departed before rush hour", "for depart rush hour"], trap: { text: "to depart before rush hour", exp: "بعد از had better فعل ساده depart بدون to می‌آید." } },
      { corr: "via the bypass road", dist: ["in bypass road", "at road bypass", "to bypass road", "by bypass road"] },
      { corr: "to save valuable time.", dist: ["for save time.", "in saving time.", "to saving time.", "for time save."] }
    ]}
  ],

  // Stages 8 to 10 for B2 (3-part Phrasal, Mixed Conditionals, B2 Master)
  8: [
    { prompt: "During the intensive strategy session, the team", trans: "در طول جلسه استراتژی، تیم توانست طرح بازاریابی خلاقانه‌ای ارائه دهد.", steps: [
      { corr: "came up with", dist: ["came down with", "came out of", "came through with", "came away with"], trap: { text: "came down with", exp: "برای مطرح کردن یا ارائه یک ایده عبارت came up with صحیح است (came down with یعنی بیمار شدن)." } },
      { corr: "an innovative marketing campaign", dist: ["campaign marketing innovative", "to innovative campaign", "for campaign innovative", "with innovative campaign"] },
      { corr: "to boost quarterly sales.", dist: ["for boost quarterly sales.", "in boosting sales.", "to boosting sales.", "for sales boost."] }
    ]},
    { prompt: "We are all eagerly", trans: "ما همگی مشتاقانه چشم‌انتظار همکاری مجدد با تیم حرفه‌ای شما هستیم.", steps: [
      { corr: "looking forward to", dist: ["looking out for", "looking down on", "looking forward at", "looking forward for"], trap: { text: "looking forward for", exp: "عبارت سه بخشی looking forward to با حرف اضافه to همراه است." } },
      { corr: "collaborating closely with your team", dist: ["collaborate closely with team", "to collaborate with team", "collaborated with team", "for collaborate team"], trap: { text: "collaborate closely with team", exp: "بعد از looking forward to کلمه to یک حرف اضافه است و بعد از آن فعل با ing (collaborating) می‌آید." } },
      { corr: "on the international venture.", dist: ["in international venture.", "at venture international.", "to international venture.", "by international venture."] }
    ]},
    { prompt: "The dedicated nurse has had to", trans: "این پرستار فداکار مجبور بوده است ساعت‌های طولانی اضافه کاری را تحمل کند.", steps: [
      { corr: "put up with", dist: ["put down with", "put off with", "put out with", "put through with"], trap: { text: "put off with", exp: "برای تحمل کردن سختی یا شرایط ناخوشایند put up with به کار می‌رود." } },
      { corr: "exhausting hospital night shifts", dist: ["shifts night hospital", "to exhausting shifts", "for shifts exhausting", "with night shifts"] },
      { corr: "without any complaint.", dist: ["without of complaint.", "no with complaint.", "with no complaint.", "without complaint any."] }
    ]},
    { prompt: "He unfortunately", trans: "او متأسفانه در طول سفر به خاطر سرمای شدید به آنفولانزای فصلی مبتلا شد.", steps: [
      { corr: "came down with", dist: ["came up with", "came out of", "came through with", "came off with"], trap: { text: "came up with", exp: "مبتلا شدن به بیماری came down with است (came up with یعنی ایده دادن)." } },
      { corr: "a severe case of the flu", dist: ["the flu severe case", "to severe flu", "for flu severe", "with flu case"] },
      { corr: "during his winter travels.", dist: ["at winter travels.", "in travels winter.", "for travel winter.", "on winter travel."] }
    ]},
    { prompt: "You should not", trans: "نباید به خاطر تفاوت‌های طبقاتی سایر افراد جامعه را تحقیر کنی.", steps: [
      { corr: "look down on people", dist: ["look up to people", "look out for people", "look after people", "look forward to people"], trap: { text: "look up to people", exp: "تحقیر کردن look down on است (look up to یعنی احترام گذاشتن)." } },
      { corr: "from underprivileged backgrounds", dist: ["of underprivileged backgrounds", "in backgrounds underprivileged", "at backgrounds", "by backgrounds"] },
      { corr: "in any civilized society.", dist: ["at civilized society.", "on society civilized.", "to society civilized.", "by society civilized."] }
    ]},
    { prompt: "The young apprentice really", trans: "شاگرد جوان واقعاً استادکار خود را به عنوان مربی الگو تحسین می‌کند.", steps: [
      { corr: "looks up to his mentor", dist: ["looks down on his mentor", "looks forward to mentor", "looks out for mentor", "looks into mentor"], trap: { text: "looks down on his mentor", exp: "تحسین و احترام گذاشتن look up to است." } },
      { corr: "for his exceptional craftsmanship", dist: ["to his craftsmanship", "in craftsmanship exceptional", "by craftsmanship", "with craftsmanship"] },
      { corr: "and dedication to quality.", dist: ["and dedicate to quality.", "and dedicating quality.", "and to dedicate quality.", "and dedicated quality."] }
    ]},
    { prompt: "While walking in the wild mountains, you must", trans: "هنگام پیاده‌روی در کوهستان وحشی، باید مراقب مارها و صخره‌های لغزنده باشی.", steps: [
      { corr: "look out for", dist: ["look down on", "look forward to", "look up to", "look into for"], trap: { text: "look forward to", exp: "مراقب خطر بودن look out for است." } },
      { corr: "venomous snakes and loose rocks", dist: ["snakes venomous and rocks", "to venomous snakes", "for snakes venomous", "with venomous snakes"] },
      { corr: "along the steep trail.", dist: ["in steep trail.", "at trail steep.", "to steep trail.", "by steep trail."] }
    ]},
    { prompt: "The criminal managed to", trans: "مجرم توانست با جعل هویت از مجازات قانونی فرار کند.", steps: [
      { corr: "get away with", dist: ["get through with", "get up with", "get along with", "get off with"], trap: { text: "get along with", exp: "قسر در رفتن از مجازات get away with است (get along with یعنی سازگاری داشتن)." } },
      { corr: "the massive corporate fraud", dist: ["fraud corporate massive", "to corporate fraud", "for fraud corporate", "with corporate fraud"] },
      { corr: "for nearly three years.", dist: ["since three years.", "in three years.", "at three years.", "during three years."] }
    ]},
    { prompt: "I", trans: "من واقعاً با همکاران جدیدم در اداره رابطه صمیمانه و خوبی دارم.", steps: [
      { corr: "get along well with", dist: ["get away with", "get up with", "get through with", "get down with"], trap: { text: "get away with", exp: "سازگاری و رابطه خوب داشتن get along with است." } },
      { corr: "my fellow project colleagues", dist: ["colleagues project fellow", "to project colleagues", "for colleagues project", "with colleagues project"] },
      { corr: "in our corporate office.", dist: ["at corporate office.", "on office corporate.", "to corporate office.", "by corporate office."] }
    ]},
    { prompt: "We must not", trans: "نباید اجازه دهیم که بنزین خودرو در این جاده کوهستانی تمام شود.", steps: [
      { corr: "run out of fuel", dist: ["run away from fuel", "run down with fuel", "run off fuel", "run into fuel"], trap: { text: "run away from fuel", exp: "تمام شدن منبع run out of است." } },
      { corr: "in this remote mountain area", dist: ["at remote mountain area", "on area mountain", "to mountain area", "by mountain area"] },
      { corr: "far from any gas stations.", dist: ["far of gas stations.", "away gas stations.", "distant gas stations.", "off gas stations."] }
    ]},
    { prompt: "The government tried to", trans: "دولت تلاش کرد تا از زیر قول‌های انتخاباتی خود شانه خالی کند.", steps: [
      { corr: "get out of", dist: ["get away with", "get along with", "get through with", "get off with"], trap: { text: "get away with", exp: "شانه خالی کردن از تعهد get out of است." } },
      { corr: "its environmental commitments", dist: ["commitments environmental its", "to environmental commitments", "for commitments environmental", "with environmental commitments"] },
      { corr: "before the international summit.", dist: ["before of summit.", "since summit international.", "in international summit.", "at summit."] }
    ]},
    { prompt: "She is always trying to", trans: "او همیشه سعی می‌کند توجه دیگران را به مهارت‌هایش جلب کند.", steps: [
      { corr: "stand out from", dist: ["stand up to", "stand in for", "stand by with", "stand off from"], trap: { text: "stand up to", exp: "برجسته و متمایز بودن stand out from است." } },
      { corr: "the rest of her peers", dist: ["peers rest of her", "to rest of peers", "for peers rest", "with rest of peers"] },
      { corr: "through innovative research.", dist: ["by innovative research.", "from innovative research.", "with research innovative.", "of research."] }
    ]},
    { prompt: "You must learn to", trans: "باید یاد بگیری که در برابر افراد زورگو شجاعانه مقاومت کنی.", steps: [
      { corr: "stand up to bullies", dist: ["stand out from bullies", "stand in for bullies", "stand down to bullies", "stand by bullies"], trap: { text: "stand out from bullies", exp: "ایستادگی در برابر زورگو stand up to است." } },
      { corr: "without showing any fear", dist: ["without of fear", "no with fear", "with no fear showing", "without fear any"] },
      { corr: "in the school yard.", dist: ["at school yard.", "on school yard.", "to school yard.", "by school yard."] }
    ]},
    { prompt: "I cannot", trans: "من نمی‌توانم با این حجم عظیم تکالیف دانشگاهی کنار بیایم و نیاز به استراحت دارم.", steps: [
      { corr: "keep up with the heavy workload", dist: ["keep out of workload", "keep down with workload", "keep away from workload", "keep off workload"], trap: { text: "keep out of workload", exp: "همگام و همپای کار پیش رفتن keep up with است." } },
      { corr: "demanded by the professors", dist: ["demand by professors", "demanding by professors", "to demand by professors", "demanded of professors"] },
      { corr: "without sacrificing my sleep.", dist: ["without of sleep.", "no with sleep.", "with no sleep.", "without sleep."] }
    ]},
    { prompt: "The lawyer promised to", trans: "وکیل قول داد که تمام توانش را برای احقاق حق موکل به کار گیرد.", steps: [
      { corr: "go through with the lawsuit", dist: ["go out of lawsuit", "go away with lawsuit", "go along with lawsuit", "go down with lawsuit"], trap: { text: "go away with lawsuit", exp: "به پایان رساندن کار دشوار go through with است." } },
      { corr: "in the federal court", dist: ["at federal court", "on court federal", "to federal court", "by federal court"] },
      { corr: "despite mounting legal pressure.", dist: ["despite of pressure.", "in spite pressure legal.", "although legal pressure.", "for legal pressure."] }
    ]},
    { prompt: "We unfortunately", trans: "ما متأسفانه در انتهای بودجه با کمبود منابع مالی مواجه شدیم.", steps: [
      { corr: "ran short of funds", dist: ["ran out for funds", "ran down of funds", "ran away with funds", "ran through funds"], trap: { text: "ran out for funds", exp: "با کمبود مواجه شدن run short of است." } },
      { corr: "during the building renovation", dist: ["in renovation building", "at building renovation", "to building renovation", "by building renovation"] },
      { corr: "and had to seek loans.", dist: ["and has to seek loans.", "and having seek loans.", "and to seek loans.", "and seek loans."] }
    ]},
    { prompt: "She can no longer", trans: "او دیگر نمی‌تواند بی احترامی‌های مداوم همکارش را تحمل کند.", steps: [
      { corr: "put up with the constant rudeness", dist: ["put down with rudeness", "put out with rudeness", "put off with rudeness", "put in with rudeness"], trap: { text: "put down with rudeness", exp: "تحمل کردن شرایط بد put up with است." } },
      { corr: "displayed by her colleague", dist: ["display by colleague", "displaying by colleague", "to display by colleague", "displayed of colleague"] },
      { corr: "at the department office.", dist: ["in department office.", "on department office.", "to department office.", "by department office."] }
    ]},
    { prompt: "He is eagerly", trans: "او مشتاقانه چشم‌انتظار شروع سال تحصیلی جدید در دانشگاه کمبریج است.", steps: [
      { corr: "looking forward to commencing", dist: ["looking forward to commence", "looking out for commence", "looking down on commence", "looking up to commence"], trap: { text: "looking forward to commence", exp: "بعد از looking forward to فعل با ing (commencing) می‌آید." } },
      { corr: "his university studies", dist: ["his studies university", "to university studies", "for studies university", "with university studies"] },
      { corr: "at Cambridge next October.", dist: ["in Cambridge next October.", "on Cambridge October.", "to Cambridge October.", "by Cambridge October."] }
    ]},
    { prompt: "The detective managed to", trans: "کارآگاه موفق شد با هوشمندی رد پای مجرمان را تا مخفیگاهشان دنبال کند.", steps: [
      { corr: "catch up with the suspects", dist: ["catch down with suspects", "catch out of suspects", "catch on to suspects", "catch away with suspects"], trap: { text: "catch down with suspects", exp: "رسیدن به کسی و دنبال کردن او catch up with است." } },
      { corr: "at their remote warehouse", dist: ["in warehouse remote", "on remote warehouse", "to remote warehouse", "by remote warehouse"] },
      { corr: "before they crossed the border.", dist: ["before cross border.", "before to cross border.", "in crossing border.", "since cross border."] }
    ]},
    { prompt: "Don't try to", trans: "سعی نکن از زیر مسئولیت‌های شغلی‌ات شانه خالی کنی.", steps: [
      { corr: "get out of your duties", dist: ["get away with duties", "get along with duties", "get through with duties", "get off duties"], trap: { text: "get away with duties", exp: "شانه خالی کردن get out of است." } },
      { corr: "as a senior supervisor", dist: ["like senior supervisor", "for senior supervisor", "to supervisor senior", "with senior supervisor"] },
      { corr: "in this corporate team.", dist: ["at corporate team.", "on team corporate.", "to corporate team.", "by corporate team."] }
    ]}
  ],

  9: [
    { prompt: "If you had taken my medical advice earlier,", trans: "اگر قبلاً به توصیه پزشکی من گوش کرده بودی، الان در بیمارستان گرفتار نبودی.", steps: [
      { corr: "you would not be suffering", dist: ["you would not have suffered", "you will not be suffering", "you had not been suffering", "you are not suffering"], trap: { text: "you would not have suffered", exp: "در شرطی ترکیبی (گذشته به حال)، شرط در گذشته (had taken) ولی اثر در حال است (would not be suffering)." } },
      { corr: "in this hospital bed right now", dist: ["at hospital bed now", "to hospital bed right now", "on hospital bed now", "for bed hospital now"] },
      { corr: "with severe complications.", dist: ["by severe complications.", "from complications severe.", "with complications severe.", "of severe complications."] }
    ]},
    { prompt: "If he had accepted the scholarship last year,", trans: "اگر او سال گذشته بورسیه را پذیرفته بود، الان داشت در دانشگاه کمبریج درس می‌خواند.", steps: [
      { corr: "he would be studying", dist: ["he would have studied", "he will be studying", "he had been studying", "he is studying"], trap: { text: "he would have studied", exp: "اثر کنونی (الان درس می‌خواند): would be studying." } },
      { corr: "at Cambridge University today", dist: ["in Cambridge today", "on Cambridge today", "to Cambridge today", "by Cambridge today"] },
      { corr: "with leading scientists.", dist: ["by leading scientists.", "from leading scientists.", "with scientists leading.", "of leading scientists."] }
    ]},
    { prompt: "If I were not terrified of heights,", trans: "اگر من از ارتفاع وحشت نداشتم، دیروز همراه شما به بالای برج صعود کرده بودم.", steps: [
      { corr: "I would have climbed", dist: ["I would climb", "I will have climbed", "I had climbed", "I climbed have"], trap: { text: "I would climb", exp: "حالت کلی در حال (were not afraid) و عمل در گذشته (دیروز صعود کرده بودم): would have climbed." } },
      { corr: "to the observation deck yesterday", dist: ["at observation deck", "in deck observation", "on observation deck", "by observation deck"] },
      { corr: "with all our tourist friends.", dist: ["by all tourist friends.", "from tourist friends.", "with friends tourist.", "of tourist friends."] }
    ]},
    { prompt: "If they had invested wisely in technology,", trans: "اگر آن‌ها عاقلانه در فناوری سرمایه‌گذاری کرده بودند، الان شرکت ثروتمندی بودند.", steps: [
      { corr: "they would be extremely wealthy now", dist: ["they would have been wealthy", "they will be wealthy now", "they had been wealthy", "they are wealthy now"], trap: { text: "they would have been wealthy", exp: "وضعیت کنونی: would be extremely wealthy now." } },
      { corr: "in the commercial sector", dist: ["at commercial sector", "on sector commercial", "to commercial sector", "by commercial sector"] },
      { corr: "with millions in assets.", dist: ["by millions in assets.", "from assets millions.", "with assets millions.", "of millions assets."] }
    ]},
    { prompt: "If she spoke fluent French today,", trans: "اگر او امروز به فرانسوی مسلط بود، هفته گذشته برای کار مترجمی اقدام کرده بود.", steps: [
      { corr: "she would have applied for", dist: ["she would apply for", "she will have applied for", "she had applied for", "she applied for have"], trap: { text: "she would apply for", exp: "عمل در گذشته (هفته گذشته اقدام کرده بود): would have applied for." } },
      { corr: "the diplomatic translator position", dist: ["position translator diplomatic", "to translator position", "for position translator", "with translator position"] },
      { corr: "at the Paris embassy.", dist: ["in Paris embassy.", "on embassy Paris.", "to Paris embassy.", "by Paris embassy."] }
    ]},
    { prompt: "If we had not missed the express train,", trans: "اگر قطار سریع‌السیر را از دست نداده بودیم، الان در هتل در حال استراحت بودیم.", steps: [
      { corr: "we would be resting peacefully", dist: ["we would have rested", "we will be resting", "we had been resting", "we are resting"], trap: { text: "we would have rested", exp: "وضعیت در حال حاضر (الان در حال استراحت بودیم): would be resting." } },
      { corr: "at the mountain resort right now", dist: ["in mountain resort now", "on resort mountain", "to mountain resort", "by mountain resort"] },
      { corr: "instead of waiting here.", dist: ["instead wait here.", "without wait here.", "in place waiting.", "instead of wait here."] }
    ]},
    { prompt: "If he were more responsible with his finances,", trans: "اگر او در امور مالی مسئولیت‌پذیرتر بود، ماه گذشته ورشکست نمی‌شد.", steps: [
      { corr: "he would not have gone bankrupt", dist: ["he would not go bankrupt", "he will not have gone", "he had not gone bankrupt", "he went not bankrupt"], trap: { text: "he would not go bankrupt", exp: "رویداد گذشته (ماه گذشته ورشکست نمی‌شد): would not have gone bankrupt." } },
      { corr: "during the retail market crash", dist: ["at retail market crash", "in crash retail market", "to market crash retail", "by market crash"] },
      { corr: "last November.", dist: ["in last November.", "at last November.", "on last November.", "for last November."] }
    ]},
    { prompt: "If you had remembered to save your document,", trans: "اگر ذخیره کردن سند را فراموش نکرده بودی، الان مجبور نبودی دوباره آن را بنویسی.", steps: [
      { corr: "you would not have to rewrite it", dist: ["you would not have rewritten it", "you will not have to rewrite", "you had not to rewrite", "you do not have rewrite"], trap: { text: "you would not have rewritten it", exp: "الزام در حال حاضر (الان مجبور نبودی): would not have to rewrite it." } },
      { corr: "from scratch right now", dist: ["of scratch now", "in scratch right now", "at scratch now", "by scratch now"] },
      { corr: "before the impending deadline.", dist: ["before of deadline.", "to deadline impending.", "in deadline impending.", "at deadline impending."] }
    ]},
    { prompt: "If she were not so naturally talented,", trans: "اگر او این‌قدر ذاتاً بااستعداد نبود، سال گذشته برنده مسابقه بین‌المللی نمی‌شد.", steps: [
      { corr: "she would not have won", dist: ["she would not win", "she will not have won", "she had not won", "she won not have"], trap: { text: "she would not win", exp: "عمل در گذشته (سال گذشته برنده نمی‌شد): would not have won." } },
      { corr: "the first place gold medal", dist: ["medal gold first place", "to gold medal first", "for medal first gold", "with first gold medal"] },
      { corr: "at the piano competition.", dist: ["in piano competition.", "on competition piano.", "to piano competition.", "by piano competition."] }
    ]},
    { prompt: "If they had installed solar panels last spring,", trans: "اگر بهار گذشته پنل خورشیدی نصب کرده بودند، الان قبوض برق کمتری می‌پرداختند.", steps: [
      { corr: "they would be paying much less", dist: ["they would have paid less", "they will be paying less", "they had been paying", "they are paying less"], trap: { text: "they would have paid less", exp: "پرداخت کنونی: would be paying much less." } },
      { corr: "for their electricity consumption", dist: ["to electricity consumption", "in consumption electricity", "at electricity consumption", "with consumption electricity"] },
      { corr: "during these cold winter months.", dist: ["at winter months.", "in months winter.", "for winter months.", "by winter months."] }
    ]},
    { prompt: "If I knew how to code in Python,", trans: "اگر من بلد بودم با پایتون برنامه‌نویسی کنم، برای آن موقعیت عالی درخواست داده بودم.", steps: [
      { corr: "I would have applied for", dist: ["I would apply for", "I will have applied", "I had applied for", "I applied for have"], trap: { text: "I would apply for", exp: "عمل گذشته: would have applied for." } },
      { corr: "that lucrative software position", dist: ["position software lucrative", "to software position", "for position software", "with software position"] },
      { corr: "advertised last week.", dist: ["advertise last week.", "advertising last week.", "to advertise last week.", "for advertise last week."] }
    ]},
    { prompt: "If the doctor had not vaccinated the villagers,", trans: "اگر پزشک روستاییان را واکسینه نکرده بود، الان بسیاری از آن‌ها بیمار بودند.", steps: [
      { corr: "many residents would be ill today", dist: ["many would have been ill", "many will be ill today", "many had been ill", "many are ill today"], trap: { text: "many would have been ill", exp: "وضعیت کنونی: would be ill today." } },
      { corr: "with the seasonal virus", dist: ["by seasonal virus", "from virus seasonal", "with virus seasonal", "of seasonal virus"] },
      { corr: "in the northern district.", dist: ["at northern district.", "on district northern.", "to northern district.", "by northern district."] }
    ]},
    { prompt: "If he had trained diligently all summer,", trans: "اگر او تمام تابستان کوشانه تمرین کرده بود، الان آماده شرکت در ماراتن بود.", steps: [
      { corr: "he would be ready to compete", dist: ["he would have been ready", "he will be ready", "he had been ready", "he is ready to compete"], trap: { text: "he would have been ready", exp: "آمادگی در حال حاضر: would be ready to compete." } },
      { corr: "in this weekend's championship", dist: ["at championship weekend", "on weekend championship", "to weekend championship", "by championship weekend"] },
      { corr: "against elite runners.", dist: ["to elite runners.", "with runners elite.", "at elite runners.", "by elite runners."] }
    ]},
    { prompt: "If we were not citizens of this country,", trans: "اگر ما شهروند این کشور نبودیم، سال گذشته مجبور به اخذ ویزای گران‌قیمت شده بودیم.", steps: [
      { corr: "we would have had to purchase", dist: ["we would have to purchase", "we will have had to purchase", "we had had to purchase", "we had to purchase have"], trap: { text: "we would have to purchase", exp: "الزام در گذشته: would have had to purchase." } },
      { corr: "an expensive visitor permit", dist: ["permit visitor expensive an", "to expensive permit", "for permit visitor", "with expensive permit"] },
      { corr: "before entering the territory.", dist: ["before enter territory.", "before to enter territory.", "in entering territory.", "since enter territory."] }
    ]},
    { prompt: "If she had saved her university earnings,", trans: "اگر او درآمدهای دوران دانشگاه را پس‌انداز کرده بود، الان صاحب یک استودیو بود.", steps: [
      { corr: "she would own her private apartment", dist: ["she would have owned apartment", "she will own apartment", "she had owned apartment", "she owns apartment"], trap: { text: "she would have owned apartment", exp: "مالکیت کنونی: would own her private apartment." } },
      { corr: "in the downtown district", dist: ["at downtown district", "on district downtown", "to downtown district", "by downtown district"] },
      { corr: "without paying monthly rent.", dist: ["without of rent.", "no with rent.", "with no monthly rent.", "without rent monthly."] }
    ]},
    { prompt: "If I had bought those shares ten years ago,", trans: "اگر ده سال پیش آن سهام را خریده بودم، الان یک میلیونر بازنشسته بودم.", steps: [
      { corr: "I would be a retired millionaire", dist: ["I would have been millionaire", "I will be a millionaire", "I had been a millionaire", "I am a millionaire"], trap: { text: "I would have been millionaire", exp: "وضعیت کنونی: would be a retired millionaire." } },
      { corr: "living on passive dividends", dist: ["live on passive dividends", "lived on dividends", "to live on dividends", "lives on dividends"] },
      { corr: "by the sunny coastline.", dist: ["at sunny coastline.", "on coastline sunny.", "to sunny coastline.", "in coastline sunny."] }
    ]},
    { prompt: "If he were not such an arrogant person,", trans: "اگر او فرد مغروری نبود، دوستان صمیمی‌اش ماه گذشته او را ترک نمی‌کردند.", steps: [
      { corr: "his companions would not have abandoned him", dist: ["companions would not abandon him", "companions will not have abandoned", "companions had not abandoned", "companions abandoned not have"], trap: { text: "companions would not abandon him", exp: "عمل در گذشته: would not have abandoned him." } },
      { corr: "during his financial crisis", dist: ["at financial crisis", "in crisis financial", "to financial crisis", "with financial crisis"] },
      { corr: "when he needed support.", dist: ["while he needed support.", "at he needed support.", "since he needed support.", "in needing support."] }
    ]},
    { prompt: "If you had listened to your parents,", trans: "اگر به حرف والدینت گوش کرده بودی، الان در این آپارتمان کوچک حبس نبودی.", steps: [
      { corr: "you would not be trapped", dist: ["you would not have been trapped", "you will not be trapped", "you had not been trapped", "you are not trapped"], trap: { text: "you would not have been trapped", exp: "وضعیت جاری: would not be trapped." } },
      { corr: "in this difficult financial dilemma", dist: ["at financial dilemma", "to financial dilemma", "for dilemma financial", "with financial dilemma"] },
      { corr: "without any helpful advice.", dist: ["without of advice.", "no with advice.", "with no helpful advice.", "without advice."] }
    ]},
    { prompt: "If she had passed her medical board exams,", trans: "اگر او در آزمون پزشکی قبول شده بود، الان یک پزشک متخصص مشغول به کار بود.", steps: [
      { corr: "she would be practicing medicine", dist: ["she would have practiced medicine", "she will be practicing", "she had been practicing", "she is practicing"], trap: { text: "she would have practiced medicine", exp: "شغل کنونی: would be practicing medicine." } },
      { corr: "at the general hospital today", dist: ["in general hospital today", "on hospital general", "to general hospital", "by general hospital"] },
      { corr: "treating pediatric patients.", dist: ["treat pediatric patients.", "treated pediatric patients.", "to treat patients.", "for treating patients."] }
    ]},
    { prompt: "If they were not such close allies,", trans: "اگر آن‌ها متحدان نزدیکی نبودند، سال گذشته در مناقشه به یکدیگر کمک نظامی نمی‌کردند.", steps: [
      { corr: "they would not have provided aid", dist: ["they would not provide aid", "they will not have provided", "they had not provided aid", "they provided not have aid"], trap: { text: "they would not provide aid", exp: "کمک در گذشته: would not have provided aid." } },
      { corr: "during the regional conflict", dist: ["at regional conflict", "in conflict regional", "to regional conflict", "by regional conflict"] },
      { corr: "to protect diplomatic treaties.", dist: ["for protect treaties.", "in protecting treaties.", "to protecting treaties.", "for treaties protect."] }
    ]}
  ],

  10: [
    { prompt: "Had we known about the scheduled delays, we", trans: "اگر از تاخیرهای برنامه‌ریزی‌شده مطلع بودیم، قطار سریع‌السیر دیگری را انتخاب کرده بودیم.", steps: [
      { corr: "would have booked tickets", dist: ["will have booked tickets", "would book tickets", "had booked tickets", "booked tickets have"], trap: { text: "will have booked tickets", exp: "در ساختار وارونه شرطی سوم Had we known در بند اصلی would have booked الزامی است." } },
      { corr: "on the alternative high-speed service", dist: ["in alternative service", "at service alternative", "to alternative service", "by alternative service"] },
      { corr: "to arrive before nightfall.", dist: ["for arrive nightfall.", "in arriving nightfall.", "to arriving nightfall.", "for nightfall arrive."] }
    ]},
    { prompt: "The billionaire tech mogul is believed to", trans: "اعتقاد بر این است که این غول میلیاردر فناوری بخش عمده ثروت خود را وقف خیریه کرده است.", steps: [
      { corr: "have donated substantial fortunes", dist: ["donate substantial fortunes", "donating substantial fortunes", "have donating fortunes", "had donated fortunes"], trap: { text: "donate substantial fortunes", exp: "عمل در گذشته انجام شده: to have donated." } },
      { corr: "to environmental preservation charities", dist: ["in environmental charities", "at charities environmental", "for charities environmental", "with environmental charities"] },
      { corr: "before retiring from public life.", dist: ["before retire from life.", "before to retire life.", "in retiring life.", "since retire life."] }
    ]},
    { prompt: "His brilliant doctoral dissertation,", trans: "رساله دکترای درخشان او، که ماه گذشته منتشر شد، تحسین منتقدان را برانگیخت.", steps: [
      { corr: "which was published by Oxford Press,", dist: ["that was published by Oxford Press,", "who was published by Press,", "where was published by Press,", "whose was published,"], trap: { text: "that was published by Oxford Press,", exp: "در بند موصولی غیرتعریفی با کاما that ممنوع است و which می‌آید." } },
      { corr: "garnered unprecedented critical acclaim", dist: ["garners critical acclaim", "garnering critical acclaim", "to garner acclaim", "garnered of acclaim"] },
      { corr: "across the academic community.", dist: ["in academic community across.", "at community academic.", "to academic community.", "by academic community."] }
    ]},
    { prompt: "The government reinforced the flood barriers", trans: "دولت موانع سیل را تقویت کرد تا آب به مناطق مسکونی شهری نفوذ نکند.", steps: [
      { corr: "so that the swollen river would not", dist: ["so that river will not", "in order river not", "for river would not", "so to river not"], trap: { text: "so that river will not", exp: "در گذشته would not می‌آید." } },
      { corr: "inundate residential neighborhoods", dist: ["inundates residential neighborhoods", "inundating neighborhoods", "to inundate neighborhoods", "inundated neighborhoods"], trap: { text: "inundates residential neighborhoods", exp: "بعد از would فعل ساده inundate بدون s می‌آید." } },
      { corr: "during the torrential downpour.", dist: ["at downpour torrential.", "in downpour torrential.", "to torrential downpour.", "by torrential downpour."] }
    ]},
    { prompt: "I would rather you", trans: "ترجیح می‌دهم همین الان حقیقت را به من بگویی تا اینکه آن را پنهان کنی.", steps: [
      { corr: "did not hide the reality", dist: ["do not hide the reality", "will not hide reality", "not hide the reality", "to not hide reality"], trap: { text: "do not hide the reality", exp: "با تغییر فاعل would rather you + گذشته ساده did not hide الزامی است." } },
      { corr: "regarding the failed negotiations", dist: ["to failed negotiations", "in failed negotiations", "at negotiations failed", "for negotiations failed"] },
      { corr: "from our board members.", dist: ["by our board members.", "with our board members.", "of board members.", "to board members."] }
    ]},
    { prompt: "The management had to", trans: "مدیریت مجبور شد با افزایش اعتراضات کارگران کنار بیاید و وارد مذاکره شود.", steps: [
      { corr: "put up with growing complaints", dist: ["put down with complaints", "put off with complaints", "put out with complaints", "put through with complaints"], trap: { text: "put down with complaints", exp: "تحمل شرایط نامساعد put up with است." } },
      { corr: "from the labor union representatives", dist: ["by union representatives", "with union representatives", "of representatives union", "to union representatives"] },
      { corr: "before reaching a contract compromise.", dist: ["before reach compromise.", "before to reach compromise.", "in reaching compromise.", "since reach compromise."] }
    ]},
    { prompt: "If he had not lost his passport last week,", trans: "اگر او هفته گذشته پاسپورتش را گم نکرده بود، الان در سفر کاری بود.", steps: [
      { corr: "he would be attending the symposium", dist: ["he would have attended", "he will be attending", "he had been attending", "he is attending symposium"], trap: { text: "he would have attended", exp: "حضور در حال حاضر: would be attending." } },
      { corr: "in Zurich right now", dist: ["at Zurich now", "on Zurich now", "to Zurich right now", "by Zurich now"] },
      { corr: "with his research colleagues.", dist: ["by his colleagues.", "from his colleagues.", "with colleagues research.", "of his colleagues."] }
    ]},
    { prompt: "The old library was demolished,", trans: "کتابخانه قدیمی تخریب شد، که در نتیجه آن ساخت مجتمع چندمنظوره آغاز گردید.", steps: [
      { corr: "with the result that the project", dist: ["with result project", "so that project to start", "in order project start", "with the result project to"], trap: { text: "with result project", exp: "ساختار نتیجه with the result that است." } },
      { corr: "commenced ahead of schedule", dist: ["commence ahead schedule", "commencing ahead schedule", "to commence schedule", "commenced of schedule"] },
      { corr: "freeing up municipal space.", dist: ["free municipal space.", "freed municipal space.", "to free space municipal.", "for freeing space."] }
    ]},
    { prompt: "We had better", trans: "بهتر است به این شیرهای پرفشار دست نزنیم؛ بسیار داغ هستند.", steps: [
      { corr: "not tamper with the pressure valves", dist: ["not to tamper with valves", "don't tamper with valves", "to not tamper valves", "not tampering with valves"], trap: { text: "not to tamper with valves", exp: "حالت منفی had better not tamper بدون to است." } },
      { corr: "on the industrial boilers", dist: ["in industrial boilers", "at boilers industrial", "to industrial boilers", "by industrial boilers"] },
      { corr: "to avoid scalding steam.", dist: ["for avoid steam.", "in avoiding steam.", "to avoiding steam.", "for steam avoid."] }
    ]},
    { prompt: "The suspect is alleged to", trans: "ادعا شده است که متهم قبل از کشف جرم به خارج از کشور گریخته است.", steps: [
      { corr: "have fled the country", dist: ["flee the country", "fleeing the country", "have fleeing country", "had fled country"], trap: { text: "flee the country", exp: "فرار در گذشته رخ داده: to have fled." } },
      { corr: "under an assumed identity", dist: ["in assumed identity", "at identity assumed", "with assumed identity", "by identity assumed"] },
      { corr: "before international warrants were issued.", dist: ["before warrants issue.", "before to issue warrants.", "in issuing warrants.", "since warrants issue."] }
    ]},
    { prompt: "The historical museum,", trans: "موزه تاریخی، که سال گذشته بازسازی شد، دارای گنجینه‌ای از آثار باستانی است.", steps: [
      { corr: "which was renovated last year,", dist: ["that was renovated last year,", "where was renovated last year,", "who was renovated last year,", "whose was renovated,"], trap: { text: "that was renovated last year,", exp: "بعد از کاما which الزامی است." } },
      { corr: "houses priceless gold treasures", dist: ["house priceless treasures", "housing gold treasures", "to house gold treasures", "housed of treasures"] },
      { corr: "from ancient civilizations.", dist: ["by ancient civilizations.", "with ancient civilizations.", "of civilizations ancient.", "to ancient civilizations."] }
    ]},
    { prompt: "If you had informed us about the revised itinerary,", trans: "اگر ما را از برنامه تغییریافته مطلع کرده بودید، هتل دیگری رزرو می‌کردیم.", steps: [
      { corr: "we would have arranged accommodation", dist: ["we will have arranged", "we would arrange", "we had arranged", "we arranged have"], trap: { text: "we will have arranged", exp: "در شرطی سوم would have arranged درست است." } },
      { corr: "closer to the conference center", dist: ["at conference center closer", "in center conference", "to conference center closer", "by conference center"] },
      { corr: "to save commuting time.", dist: ["for save commuting time.", "in saving commuting time.", "to saving time.", "for time commuting save."] }
    ]},
    { prompt: "She can no longer", trans: "او دیگر نمی‌تواند تأخیرهای مداوم قطار شهری را تحمل کند.", steps: [
      { corr: "put up with the daily delays", dist: ["put down with delays", "put off with delays", "put out with delays", "put in with delays"], trap: { text: "put down with delays", exp: "تحمل کردن شرایط نامساعد put up with است." } },
      { corr: "on the metropolitan transit line", dist: ["in metropolitan transit line", "at transit line metropolitan", "to transit line", "by transit line"] },
      { corr: "during the morning rush hour.", dist: ["at rush hour morning.", "in rush hour morning.", "to rush hour.", "by rush hour."] }
    ]},
    { prompt: "The architect designed the atrium with skylights", trans: "معمار سالن را با نورگیر طراحی کرد تا نور طبیعی به طبقات پایین برسد.", steps: [
      { corr: "so that natural daylight would illuminate", dist: ["so that daylight will illuminate", "in order daylight illuminate", "for daylight illuminate", "so daylight illuminate to"], trap: { text: "so that daylight will illuminate", exp: "در گذشته would illuminate به کار می‌رود." } },
      { corr: "the subterranean levels", dist: ["levels subterranean", "to subterranean levels", "for levels subterranean", "with subterranean levels"] },
      { corr: "reducing artificial lighting needs.", dist: ["reduce lighting needs.", "reduced lighting needs.", "to reduce lighting needs.", "for reducing lighting."] }
    ]},
    { prompt: "Had the rescue team not reacted so swiftly,", trans: "اگر تیم نجات با این سرعت واکنش نشان نداده بود، کوهنوردان جان سالم به در نمی‌بردند.", steps: [
      { corr: "the stranded climbers would have perished", dist: ["climbers will have perished", "climbers would perish", "climbers had perished", "climbers perished have"], trap: { text: "climbers will have perished", exp: "در شرطی سوم منفی وارونه would have perished الزامی است." } },
      { corr: "in the freezing blizzard", dist: ["at freezing blizzard", "on blizzard freezing", "to freezing blizzard", "by freezing blizzard"] },
      { corr: "before dawn arrived.", dist: ["before of dawn.", "since dawn arrived.", "in dawn arriving.", "at dawn."] }
    ]},
    { prompt: "I would rather he", trans: "ترجیح می‌دهم او قبل از امضای قرارداد با یک مشاور حقوقی مشورت می‌کرد.", steps: [
      { corr: "consulted an experienced attorney", dist: ["consults an attorney", "will consult attorney", "to consult attorney", "consult an attorney"], trap: { text: "consult an attorney", exp: "با تغییر فاعل would rather he + گذشته ساده consulted درست است." } },
      { corr: "before finalizing the deal", dist: ["before finalize deal", "before to finalize deal", "in finalizing deal", "since finalize deal"] },
      { corr: "to avoid legal pitfalls.", dist: ["for avoid pitfalls.", "in avoiding pitfalls.", "to avoiding pitfalls.", "for pitfalls avoid."] }
    ]},
    { prompt: "The laboratory is reputed to", trans: "آزمایشگاه شهرت دارد که پیشرفته‌ترین واکسن‌های ایمنی را تولید کرده است.", steps: [
      { corr: "have engineered groundbreaking therapies", dist: ["engineer groundbreaking therapies", "engineering therapies", "have engineering therapies", "had engineered therapies"], trap: { text: "engineer groundbreaking therapies", exp: "دستاورد گذشته: to have engineered." } },
      { corr: "for rare genetic disorders", dist: ["in rare genetic disorders", "at disorders genetic", "to genetic disorders", "with genetic disorders"] },
      { corr: "under international supervision.", dist: ["below international supervision.", "in supervision international.", "at international supervision.", "by international supervision."] }
    ]},
    { prompt: "You had better", trans: "بهتر است اطلاعات محرمانه پروژه را برای هیچ کس فاش نکنی.", steps: [
      { corr: "not disclose the source code", dist: ["not to disclose source code", "don't disclose source code", "to not disclose code", "not disclosing source code"], trap: { text: "not to disclose source code", exp: "حالت منفی had better not disclose بدون to است." } },
      { corr: "to unauthorized personnel", dist: ["at unauthorized personnel", "in personnel unauthorized", "for personnel unauthorized", "with unauthorized personnel"] },
      { corr: "to maintain intellectual rights.", dist: ["for maintain rights.", "in maintaining rights.", "to maintaining rights.", "for rights maintain."] }
    ]},
    { prompt: "If she were not so dedicated to public service,", trans: "اگر او این‌قدر به خدمت عمومی متعهد نبود، سال گذشته شغل پردرآمد خود را رها نمی‌کرد.", steps: [
      { corr: "she would not have resigned", dist: ["she would not resign", "she will not have resigned", "she had not resigned", "she resigned not have"], trap: { text: "she would not resign", exp: "اقدام گذشته: would not have resigned." } },
      { corr: "from her corporate position", dist: ["of corporate position", "in corporate position", "at position corporate", "to corporate position"] },
      { corr: "to lead a non-profit charity.", dist: ["for lead charity.", "in leading charity.", "to leading charity.", "for charity lead."] }
    ]},
    { prompt: "The university auditorium,", trans: "سالن اجتماعات دانشگاه، که گنجایش دو هزار نفر را دارد، میزبان همایش بین‌المللی است.", steps: [
      { corr: "which seats over two thousand guests,", dist: ["that seats over two thousand guests,", "where seats two thousand guests,", "who seats two thousand guests,", "whose seats guests,"], trap: { text: "that seats over two thousand guests,", exp: "بعد از کاما which الزامی است." } },
      { corr: "will accommodate delegates", dist: ["accommodates delegates", "accommodating delegates", "to accommodate delegates", "accommodated of delegates"] },
      { corr: "from fifty different nations.", dist: ["by fifty nations.", "with fifty nations.", "of nations fifty.", "to fifty nations."] }
    ]}
  ]
};
