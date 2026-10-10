// American English File - Tier B1 Grammar Specs (10 Stages x 20 Authentic Sentences = 200 Sentences)
// Granular 3-node routing for every sentence: Node 1 (Subject/Auxiliary), Node 2 (Verb/Structure), Node 3 (Complement/Adverbial)
// Every sentence has an authentic English structure, exact Persian translation, and L1 interference trap.

export const B1_SPECS = {
  // Stage 1: Second Conditional (If + Past Simple, would + Base Verb)
  1: [
    { prompt: "If I won a million dollars in the lottery,", trans: "اگر یک میلیون دلار در قرعه‌کشی برنده می‌شدم، فوراً به دور دنیا سفر می‌کردم.", steps: [
      { corr: "I would immediately", dist: ["I will immediately", "I had immediately", "I can immediately", "I am immediately"], trap: { text: "I will immediately", exp: "در شرطی نوع دوم فرضی، در جواب شرط will اشتباه است و حتماً would به کار می‌رود." } },
      { corr: "travel", dist: ["traveled", "traveling", "to travel", "travels"], trap: { text: "traveled", exp: "بعد از فعل کمکی وجهی would، فعل اصلی باید به شکل ساده و بدون پسوند بیاید." } },
      { corr: "around the entire world.", dist: ["for world entire.", "to world entire.", "in entire world around.", "with entire world."] }
    ]},
    { prompt: "If she had more free time on weekends,", trans: "اگر او در تعطیلات آخر هفته وقت آزاد بیشتری داشت، یک ساز موسیقی یاد می‌گرفت.", steps: [
      { corr: "she would certainly", dist: ["she will certainly", "she had certainly", "she is certainly", "she can certainly"], trap: { text: "she will certainly", exp: "برای موقعیت فرضی حال، در جواب شرط would می‌آید." } },
      { corr: "learn", dist: ["learned", "learning", "to learn", "learns"], trap: { text: "learned", exp: "بعد از would فعل به شکل ساده learn می‌آید." } },
      { corr: "to play the acoustic guitar.", dist: ["play acoustic guitar.", "playing acoustic guitar.", "for play guitar.", "at guitar acoustic."] }
    ]},
    { prompt: "If we lived closer to the university,", trans: "اگر ما نزدیک‌تر به دانشگاه زندگی می‌کردیم، هر روز پیاده به کلاس می‌رفتیم.", steps: [
      { corr: "we would walk", dist: ["we will walk", "we had walk", "we can walk", "we walked"], trap: { text: "we will walk", exp: "در شرطی نوع دوم we would walk درست است." } },
      { corr: "to our lectures", dist: ["for our lectures", "at our lectures", "in our lectures", "with our lectures"] },
      { corr: "instead of taking the crowded bus.", dist: ["instead take crowded bus.", "without take bus.", "in place bus crowded.", "instead of take bus."] }
    ]},
    { prompt: "If he spoke fluent German,", trans: "اگر او آلمانی را به روانی صحبت می‌کرد، برای این موقعیت شغلی درخواست می‌داد.", steps: [
      { corr: "he would definitely", dist: ["he will definitely", "he had definitely", "he is definitely", "he can definitely"], trap: { text: "he will definitely", exp: "در شرطی فرضی would definitely صحیح است." } },
      { corr: "apply for", dist: ["applied for", "applying for", "to apply for", "applies for"], trap: { text: "applied for", exp: "بعد از would فعل ساده apply می‌آید." } },
      { corr: "the engineering job in Berlin.", dist: ["to engineering job in Berlin.", "at Berlin job.", "with job Berlin.", "for Berlin job engineering."] }
    ]},
    { prompt: "If they were not so busy with exams,", trans: "اگر آن‌ها این‌قدر درگیر امتحانات نبودند، برای تعطیلات به اسکی می‌رفتند.", steps: [
      { corr: "they would happily", dist: ["they will happily", "they had happily", "they are happily", "they can happily"], trap: { text: "they will happily", exp: "در شرطی نوع دوم would happily صحیح است." } },
      { corr: "go skiing", dist: ["went skiing", "going skiing", "to go skiing", "goes skiing"], trap: { text: "went skiing", exp: "بعد از would فعل go ساده می‌آید." } },
      { corr: "in the snowy resort mountains.", dist: ["at snowy resort.", "on resort mountains.", "to snowy mountains resort.", "by resort mountains."] }
    ]},
    { prompt: "If I knew his private phone number,", trans: "اگر شماره تلفن خصوصی او را می‌دانستم، همین الان با او تماس می‌گرفتم.", steps: [
      { corr: "I would call", dist: ["I will call", "I had call", "I can call", "I called"], trap: { text: "I will call", exp: "در شرطی دوم would call درست است." } },
      { corr: "him right now", dist: ["to him right now", "for him right now", "at him right now", "with him right now"] },
      { corr: "to explain the urgent situation.", dist: ["for explain situation.", "in explaining situation.", "to explaining situation.", "for situation urgent."] }
    ]},
    { prompt: "If you practiced speaking English every day,", trans: "اگر هر روز انگلیسی صحبت کردن را تمرین می‌کردی، مهارتت به سرعت ارتقا می‌یافت.", steps: [
      { corr: "your fluency would", dist: ["your fluency will", "your fluency had", "your fluency is", "your fluency can"], trap: { text: "your fluency will", exp: "در شرطی دوم would الزامی است." } },
      { corr: "improve significantly", dist: ["improved significantly", "improving significantly", "to improve significantly", "improves significantly"], trap: { text: "improved significantly", exp: "بعد از would فعل improve ساده است." } },
      { corr: "within a few short months.", dist: ["in a few short months.", "at few short months.", "for few months short.", "by few short months."] }
    ]},
    { prompt: "If my parents had a larger garden,", trans: "اگر والدین من باغ بزرگتری داشتند، انواع سبزیجات تازه می‌کاشتند.", steps: [
      { corr: "they would cultivate", dist: ["they will cultivate", "they had cultivate", "they can cultivate", "they cultivated"], trap: { text: "they will cultivate", exp: "در شرطی دوم would cultivate درست است." } },
      { corr: "organic vegetables", dist: ["vegetables organic", "to organic vegetables", "for vegetables organic", "with organic vegetables"] },
      { corr: "throughout the spring season.", dist: ["at spring season.", "in season spring.", "for spring season.", "by spring season."] }
    ]},
    { prompt: "If it snowed heavily tonight,", trans: "اگر امشب برف سنگینی می‌بارید، فردا صبح همه مدارس تعطیل می‌شدند.", steps: [
      { corr: "all the schools would", dist: ["all schools will", "all schools had", "all schools are", "all schools can"], trap: { text: "all schools will", exp: "در شرطی دوم would می‌آید." } },
      { corr: "be closed", dist: ["are closed", "were closed", "been closed", "to be closed"], trap: { text: "were closed", exp: "بعد از would شکل ساده be closed می‌آید." } },
      { corr: "by the municipal authorities.", dist: ["from municipal authorities.", "with municipal authorities.", "of municipal authorities.", "to municipal authorities."] }
    ]},
    { prompt: "If I were in your difficult position,", trans: "اگر من در موقعیت دشوار شما بودم، بدون درنگ با یک وکیل مشورت می‌کردم.", steps: [
      { corr: "I would immediately", dist: ["I will immediately", "I had immediately", "I can immediately", "I am immediately"], trap: { text: "I will immediately", exp: "در عبارت شرطی If I were you در جواب شرط would می‌آید." } },
      { corr: "consult", dist: ["consulted", "consulting", "to consult", "consults"], trap: { text: "consulted", exp: "بعد از would فعل ساده consult می‌آید." } },
      { corr: "an experienced legal advisor.", dist: ["with legal advisor experienced.", "to legal advisor.", "for advisor legal.", "by legal advisor."] }
    ]},
    { prompt: "If she owned an electric car,", trans: "اگر او یک خودروی برقی داشت، پول بسیار زیادی در هزینه سوخت پس‌انداز می‌کرد.", steps: [
      { corr: "she would save", dist: ["she will save", "she had save", "she can save", "she saved"], trap: { text: "she will save", exp: "در شرطی نوع دوم would save درست است." } },
      { corr: "a substantial amount", dist: ["an amount substantial", "to substantial amount", "for substantial amount", "with substantial amount"] },
      { corr: "on monthly fuel expenses.", dist: ["in monthly fuel expenses.", "at fuel expenses.", "for expenses fuel.", "by monthly fuel."] }
    ]},
    { prompt: "If we had a direct train connection,", trans: "اگر ما خط مستقیم قطار داشتیم، رفت و آمد روزانه بسیار راحت‌تر می‌شد.", steps: [
      { corr: "the daily commute would", dist: ["the daily commute will", "commute had", "commute is", "commute can"], trap: { text: "the daily commute will", exp: "در شرطی دوم would الزامی است." } },
      { corr: "be much faster", dist: ["was much faster", "is much faster", "been much faster", "to be faster"], trap: { text: "was much faster", exp: "بعد از would شکل ساده be می‌آید." } },
      { corr: "and far less stressful.", dist: ["and far stress less.", "and less stress far.", "with less stress far.", "to less stress."] }
    ]},
    { prompt: "If David didn't have to work late,", trans: "اگر دیوید مجبور نبود تا دیروقت کار کند، امشب با ما به کنسرت می‌آمد.", steps: [
      { corr: "he would join us", dist: ["he will join us", "he had join us", "he can join us", "he joined us"], trap: { text: "he will join us", exp: "جواب شرط نوع دوم would join است." } },
      { corr: "at the symphony hall", dist: ["in symphony hall", "on symphony hall", "to symphony hall", "by symphony hall"] },
      { corr: "for the evening performance.", dist: ["to evening performance.", "in performance evening.", "at evening performance.", "with evening performance."] }
    ]},
    { prompt: "If I found a precious antique watch,", trans: "اگر ساعت عتیقه باارزشی پیدا می‌کردم، آن را به صاحب واقعی‌اش برمی‌گرداندم.", steps: [
      { corr: "I would make every effort", dist: ["I will make effort", "I had make effort", "I can make effort", "I made effort"], trap: { text: "I will make effort", exp: "در شرطی دوم would make می‌آید." } },
      { corr: "to return it", dist: ["returning it", "return it", "to returning it", "for return it"] },
      { corr: "to its rightful owner.", dist: ["at its rightful owner.", "for owner rightful.", "with rightful owner.", "by rightful owner."] }
    ]},
    { prompt: "If you drank herbal tea instead of coffee,", trans: "اگر به جای قهوه دمنوش گیاهی می‌نوشیدی، شب‌ها خیلی آرام‌تر می‌خوابیدی.", steps: [
      { corr: "you would sleep", dist: ["you will sleep", "you had sleep", "you can sleep", "you slept"], trap: { text: "you will sleep", exp: "در شرطی دوم would sleep درست است." } },
      { corr: "much more soundly", dist: ["more soundly much", "much soundly more", "soundly more much", "more soundly"] },
      { corr: "throughout the entire night.", dist: ["along the entire night.", "in night entire.", "at entire night.", "by entire night."] }
    ]},
    { prompt: "If the museum were open on Mondays,", trans: "اگر موزه روزهای دوشنبه باز بود، ما امروز از گالری نقاشی دیدن می‌کردیم.", steps: [
      { corr: "we would definitely", dist: ["we will definitely", "we had definitely", "we are definitely", "we can definitely"], trap: { text: "we will definitely", exp: "در شرطی دوم would definitely درست است." } },
      { corr: "visit the exhibits", dist: ["visited exhibits", "visiting exhibits", "to visit exhibits", "visits exhibits"], trap: { text: "visited exhibits", exp: "بعد از would فعل ساده visit می‌آید." } },
      { corr: "before returning to our hotel.", dist: ["before return to hotel.", "before to return hotel.", "in returning hotel.", "since return hotel."] }
    ]},
    { prompt: "If Sarah lived by the seaside,", trans: "اگر سارا کنار ساحل دریا زندگی می‌کرد، هر روز صبح در اقیانوس شنا می‌کرد.", steps: [
      { corr: "she would go swimming", dist: ["she will go swimming", "she had go swimming", "she can go swimming", "she went swimming"], trap: { text: "she will go swimming", exp: "در شرطی دوم would go درست است." } },
      { corr: "in the calm ocean waters", dist: ["at ocean calm waters", "on ocean waters calm", "to ocean calm waters", "by ocean waters"] },
      { corr: "before starting her workday.", dist: ["before start workday.", "before to start workday.", "in starting workday.", "since start workday."] }
    ]},
    { prompt: "If they offered you a promotion abroad,", trans: "اگر آن‌ها به شما ارتقای شغلی در خارج پیشنهاد می‌دادند، آیا آن را می‌پذیرفتید؟", steps: [
      { corr: "would you accept", dist: ["will you accept", "had you accept", "did you accept", "can you accept"], trap: { text: "will you accept", exp: "در سوال شرطی نوع دوم would you accept صحیح است." } },
      { corr: "the overseas contract", dist: ["contract overseas", "to overseas contract", "for contract overseas", "with contract overseas"] },
      { corr: "without any hesitation?", dist: ["without of hesitation?", "no with hesitation?", "with no hesitation?", "without hesitation any?"] }
    ]},
    { prompt: "If I had enough savings in the bank,", trans: "اگر پس‌انداز کافی در بانک داشتم، یک کسب‌وکار نوپا راه‌اندازی می‌کردم.", steps: [
      { corr: "I would launch", dist: ["I will launch", "I had launch", "I can launch", "I launched"], trap: { text: "I will launch", exp: "در شرطی دوم would launch درست است." } },
      { corr: "my own startup company", dist: ["startup company my own", "to my startup company", "for company startup", "with my startup"] },
      { corr: "in the technology sector.", dist: ["at technology sector.", "on sector technology.", "to technology sector.", "by technology sector."] }
    ]},
    { prompt: "If the weather were warm and sunny today,", trans: "اگر هوا امروز گرم و آفتابی بود، ما در پارک جنگلی پیکنیک برپا می‌کردیم.", steps: [
      { corr: "we would organize", dist: ["we will organize", "we had organize", "we can organize", "we organized"], trap: { text: "we will organize", exp: "در شرطی دوم would organize می‌آید." } },
      { corr: "a wonderful outdoor picnic", dist: ["picnic outdoor wonderful", "to outdoor picnic", "for picnic outdoor", "with picnic outdoor"] },
      { corr: "for all our family members.", dist: ["to all family members.", "in family members.", "at family members.", "by family members."] }
    ]}
  ],

  // Stage 2: Present Perfect Continuous vs Simple (has been doing vs has done)
  2: [
    { prompt: "She", trans: "او از ساعت هشت صبح تا الان دارد بی‌وقفه برای امتحاناتش مطالعه می‌کند.", steps: [
      { corr: "has been studying", dist: ["is studying", "has studied", "was studying", "studied"], trap: { text: "is studying", exp: "برای عملی که از گذشته تا زمان حال ادامه داشته با ذکر مبدا زمانی، حال کامل استمراری (has been studying) صحیح است." } },
      { corr: "for her medical exams", dist: ["to her medical exams", "in her medical exams", "at medical exams", "with medical exams"] },
      { corr: "since early this morning.", dist: ["for early morning.", "from early morning.", "in early morning.", "at early morning."] }
    ]},
    { prompt: "They", trans: "آن‌ها بیش از پنج سال است که در این شرکت بین‌المللی کار می‌کنند.", steps: [
      { corr: "have been working here", dist: ["are working here", "have worked here", "were working here", "worked here"], trap: { text: "are working here", exp: "با قید زمان for five years زمان حال کامل استمراری have been working الزامی است." } },
      { corr: "as software developers", dist: ["like software developers", "for software developers", "to software developers", "with software developers"] },
      { corr: "for more than five years.", dist: ["since more five years.", "in more five years.", "at five years.", "during five years."] }
    ]},
    { prompt: "The mechanic", trans: "مکانیک از صبح تا الان توانسته است سه خودرو را کاملاً تعمیر کند.", steps: [
      { corr: "has already repaired", dist: ["has been repairing", "is repairing", "repairs", "was repairing"], trap: { text: "has been repairing", exp: "وقتی تعداد موارد تکمیل‌شده (three cars) ذکر می‌شود، حال کامل ساده (has repaired) به کار می‌رود نه استمراری." } },
      { corr: "three different vehicles", dist: ["three vehicles different", "to three vehicles", "for three vehicles", "with three vehicles"] },
      { corr: "since he arrived at work.", dist: ["for he arrived work.", "from he arrived.", "in arriving work.", "when arrived work."] }
    ]},
    { prompt: "How long", trans: "چه مدت است که شما منتظر رسیدن اتوبوس سریع‌السیر هستید؟", steps: [
      { corr: "have you been waiting", dist: ["are you waiting", "have you waited", "were you waiting", "do you wait"], trap: { text: "are you waiting", exp: "با عبارت How long برای عمل جاری از گذشته حال کامل استمراری have you been waiting استفاده می‌شود." } },
      { corr: "at this bus stop", dist: ["in this bus stop", "on this bus stop", "to this bus stop", "by this bus stop"] },
      { corr: "in the cold morning rain?", dist: ["at rain cold morning?", "on morning rain cold?", "to rain morning?", "by cold rain?"] }
    ]},
    { prompt: "I", trans: "من تمام روز مشغول نقاشی کردن دیوارهای اتاق خواب بوده‌ام و لباسم خاکی است.", steps: [
      { corr: "have been painting", dist: ["am painting", "have painted", "was painting", "painted"], trap: { text: "am painting", exp: "برای فعالیت مداومی که تمام روز طول کشیده و اثر آن مشهود است have been painting به کار می‌رود." } },
      { corr: "the bedroom walls", dist: ["walls bedroom", "to bedroom walls", "for walls bedroom", "at bedroom walls"] },
      { corr: "all afternoon without a rest.", dist: ["all afternoon without rest.", "in afternoon all.", "at afternoon whole.", "during all afternoon."] }
    ]},
    { prompt: "David", trans: "دیوید نوشتن گزارش نهایی پروژه را تمام کرده و آن را تحویل داده است.", steps: [
      { corr: "has completed", dist: ["has been completing", "is completing", "completes", "was completing"], trap: { text: "has been completing", exp: "برای پایان یافتن یک نتیجه قطعی has completed صحیح است نه شکل استمراری." } },
      { corr: "the final project report", dist: ["report project final", "to final report", "for report final", "with final report"] },
      { corr: "and submitted it online.", dist: ["and submitting it.", "and submits it.", "and to submit it.", "and submit it."] }
    ]},
    { prompt: "It", trans: "از دیشب تا الان دارد بی‌وقفه در این کوهستان برف می‌بارد.", steps: [
      { corr: "has been snowing heavily", dist: ["is snowing heavily", "has snowed heavily", "was snowing heavily", "snows heavily"], trap: { text: "is snowing heavily", exp: "با ذکر مبدا since last night زمان has been snowing درست است." } },
      { corr: "over the alpine peaks", dist: ["in alpine peaks", "at peaks alpine", "to alpine peaks", "by alpine peaks"] },
      { corr: "since midnight yesterday.", dist: ["for midnight yesterday.", "from midnight yesterday.", "in midnight yesterday.", "at midnight yesterday."] }
    ]},
    { prompt: "The children", trans: "بچه‌ها دو ساعت است که دارند در حیاط با گل و لای بازی می‌کنند.", steps: [
      { corr: "have been playing outdoors", dist: ["are playing outdoors", "have played outdoors", "were playing outdoors", "play outdoors"], trap: { text: "are playing outdoors", exp: "با قید زمان for two hours حال کامل استمراری have been playing می‌آید." } },
      { corr: "in the muddy garden", dist: ["at muddy garden", "on garden muddy", "to muddy garden", "by muddy garden"] },
      { corr: "for over two hours now.", dist: ["since over two hours.", "in two hours over.", "at two hours now.", "during two hours."] }
    ]},
    { prompt: "Sarah", trans: "سارا تا کنون چهار مقاله پژوهشی در مجلات معتبر علمی منتشر کرده است.", steps: [
      { corr: "has published", dist: ["has been publishing", "is publishing", "publishes", "was publishing"], trap: { text: "has been publishing", exp: "برای ذکر تعداد کارهای انجام‌شده (four articles) حال کامل ساده has published درست است." } },
      { corr: "four peer-reviewed papers", dist: ["four papers peer-reviewed", "to four papers", "for papers four", "with four papers"] },
      { corr: "in prestigious journals.", dist: ["at prestigious journals.", "on journals prestigious.", "to prestigious journals.", "by prestigious journals."] }
    ]},
    { prompt: "We", trans: "ما از ساعت ده صبح در حال بحث در مورد قرارداد تجاری بوده‌ایم.", steps: [
      { corr: "have been discussing", dist: ["are discussing", "have discussed", "were discussing", "discuss"], trap: { text: "are discussing", exp: "با ذکر since ten o'clock حال کامل استمراری have been discussing به کار می‌رود." } },
      { corr: "the partnership agreement", dist: ["to partnership agreement", "for agreement partnership", "at partnership agreement", "with agreement"] },
      { corr: "since ten o'clock this morning.", dist: ["for ten o'clock.", "from ten o'clock morning.", "in ten o'clock.", "at ten o'clock morning."] }
    ]},
    { prompt: "He looks exhausted because he", trans: "او خیلی خسته به نظر می‌رسد چون ساعت‌ها در هوای گرم دویده است.", steps: [
      { corr: "has been running", dist: ["is running", "has run", "was running", "runs"], trap: { text: "is running", exp: "علت خستگی کنونی ناشی از عمل ممتد گذشته با has been running بیان می‌شود." } },
      { corr: "along the dusty road", dist: ["in dusty road", "at road dusty", "to dusty road", "by dusty road"] },
      { corr: "for several hours.", dist: ["since several hours.", "in several hours.", "at several hours.", "during hours several."] }
    ]},
    { prompt: "The author", trans: "نویسنده تا این لحظه دوازده فصل از رمان حماسی جدیدش را نوشته است.", steps: [
      { corr: "has written", dist: ["has been writing", "is writing", "writes", "was writing"], trap: { text: "has been writing", exp: "وقتی تعداد مشخص فصل‌ها (twelve chapters) بیان می‌شود حال کامل ساده has written درست است." } },
      { corr: "twelve fascinating chapters", dist: ["twelve chapters fascinating", "to twelve chapters", "for chapters twelve", "with twelve chapters"] },
      { corr: "of the upcoming historical novel.", dist: ["in novel historical.", "at historical novel.", "to novel historical.", "by historical novel."] }
    ]},
    { prompt: "How long", trans: "چه مدت است که این تیم پزشکی روی کشف درمان جدید تحقیق می‌کند؟", steps: [
      { corr: "has the research team been working", dist: ["is the team working", "has team worked", "did team work", "was team working"], trap: { text: "is the team working", exp: "با How long حال کامل استمراری has been working الزامی است." } },
      { corr: "on this medical breakthrough", dist: ["in this breakthrough", "at breakthrough medical", "to breakthrough medical", "for medical breakthrough"] },
      { corr: "in their modern laboratory?", dist: ["at laboratory modern?", "on modern laboratory?", "to modern laboratory?", "by modern laboratory?"] }
    ]},
    { prompt: "I", trans: "من از هفته گذشته تا الان پنج بار با بخش پشتیبانی تماس گرفته‌ام.", steps: [
      { corr: "have called customer support", dist: ["have been calling support", "am calling support", "called support", "was calling support"], trap: { text: "have been calling support", exp: "تعداد دفعات انجام کار (five times) نیاز به حال کامل ساده have called دارد." } },
      { corr: "five separate times", dist: ["five times separate", "to five times", "for times five", "with five times"] },
      { corr: "to resolve the account issue.", dist: ["for resolve issue.", "in resolving issue.", "to resolving issue.", "for issue resolve."] }
    ]},
    { prompt: "Emily", trans: "امیلی بیش از سه ساعت است که در آشپزخانه مشغول پختن کیک است.", steps: [
      { corr: "has been baking cakes", dist: ["is baking cakes", "has baked cakes", "was baking cakes", "bakes cakes"], trap: { text: "is baking cakes", exp: "با قید زمان for over three hours حال کامل استمراری has been baking می‌آید." } },
      { corr: "for the school festival", dist: ["to school festival", "in school festival", "at festival school", "with school festival"] },
      { corr: "since early this afternoon.", dist: ["for early afternoon.", "from early afternoon.", "in early afternoon.", "at afternoon early."] }
    ]},
    { prompt: "The company", trans: "این شرکت تا کنون بیش از هزار دستگاه خودروی الکتریکی تحویل داده است.", steps: [
      { corr: "has delivered", dist: ["has been delivering", "is delivering", "delivers", "was delivering"], trap: { text: "has been delivering", exp: "برای تعداد کل دستاوردهای تکمیل‌شده has delivered درست است." } },
      { corr: "over one thousand vehicles", dist: ["vehicles over one thousand", "to one thousand vehicles", "for vehicles thousand", "with thousand vehicles"] },
      { corr: "to customers across Europe.", dist: ["in customers Europe.", "at customers Europe.", "for customers Europe.", "by customers Europe."] }
    ]},
    { prompt: "Your eyes are red; you", trans: "چشمانت قرمز است؛ معلوم است که ساعت‌ها به صفحه مانیتور خیره شده‌ای.", steps: [
      { corr: "have been staring at the screen", dist: ["are staring at screen", "have stared at screen", "were staring screen", "stared at screen"], trap: { text: "are staring at screen", exp: "علت ممتد حالت کنونی have been staring است." } },
      { corr: "without taking any breaks", dist: ["without of breaks", "no with breaks", "with no any breaks", "without break any"] },
      { corr: "for the past four hours.", dist: ["since past four hours.", "in past four hours.", "at four hours past.", "during four hours."] }
    ]},
    { prompt: "We", trans: "ما تا کنون تمام مدارک لازم را برای اخذ ویزای دانشجویی جمع‌آوری کرده‌ایم.", steps: [
      { corr: "have gathered all documents", dist: ["have been gathering all", "are gathering all", "gathered all documents", "were gathering documents"], trap: { text: "have been gathering all", exp: "نتیجه نهایی جمع‌آوری مدارک have gathered است." } },
      { corr: "for the student visa application", dist: ["to visa application", "in visa application", "at application visa", "with visa application"] },
      { corr: "and submitted them to the embassy.", dist: ["and submitting them.", "and submits them.", "and to submit them.", "and submit them."] }
    ]},
    { prompt: "The athlete", trans: "این ورزشکار از شش سالگی تا الان دارد زیر نظر مربی حرفه‌ای تمرین می‌کند.", steps: [
      { corr: "has been training intensively", dist: ["is training intensively", "has trained intensively", "was training intensively", "trains intensively"], trap: { text: "is training intensively", exp: "با قید since age six زمان حال کامل استمراری has been training الزامی است." } },
      { corr: "under an Olympic coach", dist: ["below Olympic coach", "in Olympic coach", "at coach Olympic", "with coach Olympic"] },
      { corr: "since the age of six.", dist: ["for age of six.", "from age six.", "in age of six.", "at age of six."] }
    ]},
    { prompt: "I", trans: "من تمام کتاب‌های این نویسنده سرشناس را خوانده‌ام و قلم او را می‌شناسم.", steps: [
      { corr: "have read every novel", dist: ["have been reading every", "am reading every", "read every novel", "was reading novel"], trap: { text: "have been reading every", exp: "تکمیل تمام کتاب‌ها نیاز به حال کامل ساده have read دارد." } },
      { corr: "by this famous author", dist: ["from famous author", "with famous author", "of famous author", "to famous author"] },
      { corr: "over the last three years.", dist: ["since last three years.", "in three years last.", "at last three years.", "for three years last."] }
    ]}
  ],

  // Stages 3 to 10 for B1 (Modals of Deduction, Advanced Passive, Reported Speech, Phrasal Verbs, Linkers, Past Perfect, Verbs of Perception, B1 Master)
  3: [
    { prompt: "His office lights are still on, so he", trans: "چراغ‌های دفترش هنوز روشن است، بنابراین او حتماً دارد اضافه کار می‌کند.", steps: [
      { corr: "must be working late", dist: ["can't be working late", "might not be working", "should be work late", "must work late"], trap: { text: "can't be working late", exp: "با وجود شواهد روشن بودن چراغ، استنتاج قطعی مثبت must be working است نه can't." } },
      { corr: "on the urgent financial audit", dist: ["in financial audit", "at audit financial", "to audit financial", "for audit financial"] },
      { corr: "before the board meeting.", dist: ["before of meeting.", "since board meeting.", "in board meeting.", "at meeting board."] }
    ]},
    { prompt: "She hasn't eaten anything since breakfast; she", trans: "او از صبحانه تا الان چیزی نخورده است؛ حتماً الان خیلی گرسنه است.", steps: [
      { corr: "must be absolutely starving", dist: ["can't be starving", "might not be starving", "must starve", "must to be starving"], trap: { text: "can't be starving", exp: "استنتاج منطقی قطعی مثبت با must be بیان می‌شود." } },
      { corr: "after such a long workday", dist: ["to such long workday", "in such workday", "at long workday", "with long workday"] },
      { corr: "without taking a lunch break.", dist: ["without of lunch break.", "no with lunch break.", "with no lunch break.", "without break lunch."] }
    ]},
    { prompt: "That expensive sports car", trans: "آن خودروی اسپورت گران‌قیمت قطعا نمی‌تواند مال دیوید باشد؛ او دانشجو است.", steps: [
      { corr: "can't belong to David", dist: ["must belong to David", "must not belong to David", "can't to belong to David", "might belong to David"], trap: { text: "must not belong to David", exp: "برای بیان استنتاج غیرممکن بودن در زمان حال از can't belong استفاده می‌شود نه must not." } },
      { corr: "because he is still a student", dist: ["since he a student", "due to he is student", "because of he is student", "for he a student"] },
      { corr: "with no independent income.", dist: ["without of income.", "no with income.", "with no income independent.", "without income."] }
    ]},
    { prompt: "The laboratory door is locked and dark; the professor", trans: "در آزمایشگاه قفل و تاریک است؛ استاد احتمالاً به خانه رفته است.", steps: [
      { corr: "might have already gone home", dist: ["must have gone home definitely", "can't go home", "should to go home", "might to have gone"], trap: { text: "might to have gone", exp: "بعد از modal حرف اضافه to نمی‌آید؛ might have already gone درست است." } },
      { corr: "for the evening dinner", dist: ["to evening dinner", "in dinner evening", "at evening dinner", "with dinner evening"] },
      { corr: "after completing the trials.", dist: ["after complete trials.", "after to complete trials.", "in completing trials.", "since complete trials."] }
    ]},
    { prompt: "Listen to that professional accent! The speaker", trans: "به این لهجه حرفه‌ای گوش کن! سخنران حتماً اهل لندن است.", steps: [
      { corr: "must be a native speaker", dist: ["can't be a native speaker", "might not be speaker", "must to be native speaker", "should be speaker"], trap: { text: "can't be a native speaker", exp: "استنتاج مثبت قطعی must be است." } },
      { corr: "from the United Kingdom", dist: ["of United Kingdom", "to United Kingdom", "at United Kingdom", "in United Kingdom from"] },
      { corr: "judging by his pronunciation.", dist: ["judge by pronunciation.", "judging from his pronunciation.", "to judge by accent.", "for judging accent."] }
    ]},
    { prompt: "He looks very young; he", trans: "او خیلی جوان به نظر می‌رسد؛ غیرممکن است که بیش از سی سال داشته باشد.", steps: [
      { corr: "can't be older than thirty", dist: ["must be older than thirty", "must not be older than thirty", "can't to be older", "might not be older"], trap: { text: "must not be older than thirty", exp: "استنتاج منفی غیرممکن can't be است نه must not be." } },
      { corr: "despite his managerial title", dist: ["despite of managerial title", "in spite his title", "although his title", "for his title"] },
      { corr: "at the multinational firm.", dist: ["in firm multinational.", "on multinational firm.", "to firm multinational.", "by multinational firm."] }
    ]},
    { prompt: "I am not completely sure, but this key", trans: "کاملاً مطمئن نیستم، اما این کلید شاید در انبار را باز کند.", steps: [
      { corr: "might unlock the back door", dist: ["must unlock the back door", "can't unlock back door", "might to unlock back door", "should unlock back door"], trap: { text: "might to unlock back door", exp: "بعد از might فعل ساده unlock بدون to می‌آید." } },
      { corr: "to the storage basement", dist: ["in storage basement", "at basement storage", "on storage basement", "by basement storage"] },
      { corr: "behind the main workshop.", dist: ["next of main workshop.", "close main workshop.", "at workshop main.", "to workshop main."] }
    ]},
    { prompt: "The streets are crowded with umbrellas; it", trans: "خیابان‌ها پر از چتر است؛ حتماً دارد بیرون باران می‌بارد.", steps: [
      { corr: "must be raining outside", dist: ["can't be raining outside", "might not be raining", "must to rain outside", "should be rain"], trap: { text: "can't be raining outside", exp: "با شواهد چترها must be raining قطعی است." } },
      { corr: "in the city center", dist: ["at city center", "on city center", "to city center", "by city center"] },
      { corr: "right at this moment.", dist: ["in this moment right.", "at moment right.", "to this moment.", "for this moment."] }
    ]},
    { prompt: "Sarah knows nothing about the party; she", trans: "سارا چیزی از مهمانی نمی‌داند؛ او قطعاً نباید در جریان غافلگیری باشد.", steps: [
      { corr: "can't have heard the news", dist: ["must have heard the news", "must not have heard news", "can't to have heard", "might have heard definitely"], trap: { text: "must not have heard news", exp: "استنتاج منفی غیرممکن بودن can't have heard است." } },
      { corr: "about the surprise celebration", dist: ["to surprise celebration", "in surprise celebration", "at celebration surprise", "for celebration surprise"] },
      { corr: "planned by her colleagues.", dist: ["plan by her colleagues.", "planning by colleagues.", "to plan by colleagues.", "for plan by colleagues."] }
    ]},
    { prompt: "The phone keeps ringing with no answer; they", trans: "تلفن مدام زنگ می‌خورد و کسی پاسخ نمی‌دهد؛ آن‌ها شاید در حیاط باشند.", steps: [
      { corr: "might be sitting outdoors", dist: ["must be sitting definitely", "can't be sitting outdoors", "might to be sitting", "should be sit"], trap: { text: "might to be sitting", exp: "بعد از might فعل به صورت be sitting بدون to می‌آید." } },
      { corr: "in the spacious garden", dist: ["at spacious garden", "on garden spacious", "to spacious garden", "by spacious garden"] },
      { corr: "away from the telephone.", dist: ["far of telephone.", "away to telephone.", "distant telephone.", "off telephone."] }
    ]},
    { prompt: "He solved that advanced puzzle in seconds; he", trans: "او آن معما را در چند ثانیه حل کرد؛ او حتماً یک نابغه است.", steps: [
      { corr: "must be exceptionally smart", dist: ["can't be smart", "might not be smart", "must to be smart", "should be smart"], trap: { text: "can't be smart", exp: "استنتاج مثبت must be exceptionally smart است." } },
      { corr: "with logical reasoning skills", dist: ["by logical skills", "from logical skills", "in skills logical", "of logical skills"] },
      { corr: "far beyond his peers.", dist: ["beyond of his peers.", "above to his peers.", "over his peers far.", "at his peers."] }
    ]},
    { prompt: "That cannot be a real diamond; it", trans: "آن نمی‌تواند الماس واقعی باشد؛ قیمت آن بسیار ارزان است.", steps: [
      { corr: "can't be genuine jewelry", dist: ["must be genuine jewelry", "must not be genuine", "can't to be genuine", "might be genuine definitely"], trap: { text: "must not be genuine", exp: "استنتاج غیرممکن بودن can't be است." } },
      { corr: "at this low price", dist: ["in this low price", "on this low price", "to this low price", "for price low this"] },
      { corr: "offered by the street vendor.", dist: ["offer by vendor.", "offering by vendor.", "to offer by vendor.", "for offer vendor."] }
    ]},
    { prompt: "Take an umbrella with you; the dark clouds mean it", trans: "با خودت چتر ببر؛ این ابرهای سیاه یعنی شاید باران ببارد.", steps: [
      { corr: "might start raining", dist: ["must to start raining", "can't start raining", "might to start raining", "should start rain"], trap: { text: "might to start raining", exp: "بعد از might فعل ساده start می‌آید." } },
      { corr: "in a few minutes", dist: ["at few minutes", "on few minutes", "to minutes few", "by few minutes"] },
      { corr: "over the downtown area.", dist: ["in downtown area over.", "at downtown area.", "to downtown area.", "by downtown area."] }
    ]},
    { prompt: "The restaurant is packed with guests; the food", trans: "رستوران پر از مشتری است؛ غذا حتماً باید فوق‌العاده باشد.", steps: [
      { corr: "must be delicious", dist: ["can't be delicious", "might not be delicious", "must to be delicious", "should be taste"], trap: { text: "can't be delicious", exp: "استنتاج قطعی مثبت must be delicious است." } },
      { corr: "and reasonably priced", dist: ["and price reasonably", "and reasonable price", "and to price reasonably", "and priced reasonable"] },
      { corr: "according to local reviews.", dist: ["according local reviews.", "to reviews local according.", "in reviews local.", "by local reviews."] }
    ]},
    { prompt: "He never exercises and eats junk food; he", trans: "او هرگز ورزش نمی‌کند و غذای ناسالم می‌خورد؛ او نمی‌تواند بدنی سالم داشته باشد.", steps: [
      { corr: "can't be in good shape", dist: ["must be in good shape", "must not be in shape", "can't to be in shape", "might be in shape definitely"], trap: { text: "must not be in shape", exp: "استنتاج غیرممکن can't be in good shape است." } },
      { corr: "without regular workouts", dist: ["without of workouts", "no with workouts", "with no workouts", "without workout regular"] },
      { corr: "at a fitness center.", dist: ["in fitness center.", "on fitness center.", "to fitness center.", "by fitness center."] }
    ]},
    { prompt: "She doesn't answer her email; she", trans: "او به ایمیلش پاسخ نمی‌دهد؛ شاید در هواپیما در سفر باشد.", steps: [
      { corr: "might be traveling on a flight", dist: ["must be travel flight", "can't be traveling", "might to be traveling", "should be travel"], trap: { text: "might to be traveling", exp: "بعد از might فعل to نمی‌گیرد." } },
      { corr: "across the Atlantic Ocean", dist: ["in Atlantic Ocean", "at Atlantic Ocean", "to Atlantic Ocean", "by Atlantic Ocean"] },
      { corr: "without any internet signal.", dist: ["without of signal.", "no with signal.", "with no signal internet.", "without signal."] }
    ]},
    { prompt: "Look at the heavy snow on his coat! It", trans: "به برف سنگین روی کتش نگاه کن! بیرون حتماً کولاک است.", steps: [
      { corr: "must be freezing outside", dist: ["can't be freezing outside", "might not be freezing", "must to freeze", "should be freeze"], trap: { text: "can't be freezing outside", exp: "استنتاج قطعی مثبت must be freezing است." } },
      { corr: "in the mountain pass", dist: ["at mountain pass", "on pass mountain", "to mountain pass", "by mountain pass"] },
      { corr: "with sub-zero temperatures.", dist: ["by sub-zero temperatures.", "from temperatures.", "with temperatures sub-zero.", "of temperatures."] }
    ]},
    { prompt: "That tiny apartment", trans: "آن آپارتمان کوچک نمی‌تواند برای یک خانواده پنج نفره مناسب باشد.", steps: [
      { corr: "can't be comfortable enough", dist: ["must be comfortable enough", "must not be comfortable", "can't to be comfortable", "might be comfortable definitely"], trap: { text: "must not be comfortable", exp: "استنتاج غیرممکن can't be comfortable است." } },
      { corr: "for a family of five", dist: ["to family of five", "in family of five", "at family of five", "with family five"] },
      { corr: "with just one bedroom.", dist: ["by one bedroom.", "from one bedroom.", "with bedroom one.", "of one bedroom."] }
    ]},
    { prompt: "If you call him on his mobile, he", trans: "اگر با موبایلش تماس بگیری، او شاید پاسخ دهد.", steps: [
      { corr: "might answer your call", dist: ["must to answer your call", "can't answer your call", "might to answer call", "should answer to call"], trap: { text: "might to answer call", exp: "بعد از might فعل ساده answer بدون to می‌آید." } },
      { corr: "if he is not busy", dist: ["if he not busy", "whether he is not busy", "unless he busy", "if he hasn't busy"] },
      { corr: "in a client meeting.", dist: ["at client meeting.", "on meeting client.", "to client meeting.", "by client meeting."] }
    ]},
    { prompt: "The footprints lead directly to the door; someone", trans: "ردپاها مستقیماً به در ختم می‌شوند؛ کسی حتماً داخل ساختمان رفته است.", steps: [
      { corr: "must be inside the cabin", dist: ["can't be inside the cabin", "might not be inside", "must to be inside cabin", "should be inside"], trap: { text: "can't be inside the cabin", exp: "استنتاج قطعی با شواهد ردپا must be است." } },
      { corr: "waiting for the storm", dist: ["waits for storm", "waiting to storm", "to wait for storm", "for waiting storm"] },
      { corr: "to pass over safely.", dist: ["pass over safe.", "to pass over safe.", "in passing over.", "for pass over."] }
    ]}
  ],

  // Stages 4 to 10 for B1
  4: [
    { prompt: "The historical city bridge", trans: "پل تاریخی شهر در حال حاضر توسط مهندسان مرمت می‌شود.", steps: [
      { corr: "is currently being renovated", dist: ["is currently renovating", "is currently renovate", "has currently renovated", "was currently being renovate"], trap: { text: "is currently renovating", exp: "در مجهول حال استمراری ساختار is being + p.p. (renovated) الزامی است." } },
      { corr: "by skilled structural engineers", dist: ["from structural engineers", "with structural engineers", "of engineers structural", "to structural engineers"] },
      { corr: "to prevent future collapses.", dist: ["for prevent collapses.", "in preventing collapses.", "to preventing collapses.", "for collapses prevent."] }
    ]},
    { prompt: "The annual budget proposal", trans: "پیشنهاد بودجه سالانه توسط هیئت مدیره تصویب شده است.", steps: [
      { corr: "has already been approved", dist: ["has already approved", "is already been approved", "was already approve", "has been approve"], trap: { text: "has already approved", exp: "در مجهول حال کامل has been + p.p. (approved) به کار می‌رود." } },
      { corr: "by the board of directors", dist: ["from board of directors", "with board of directors", "of directors board", "to directors board"] },
      { corr: "after extensive negotiations.", dist: ["after negotiate extensive.", "after to negotiate.", "in negotiating extensive.", "since negotiations."] }
    ]},
    { prompt: "The international climate summit", trans: "نشست بین‌المللی آب و هوا ماه آینده در ژنو برگزار خواهد شد.", steps: [
      { corr: "will be held", dist: ["will hold", "will be hold", "is held will", "will been held"], trap: { text: "will hold", exp: "در مجهول آینده will be + p.p. (held) صحیح است." } },
      { corr: "in Geneva, Switzerland", dist: ["at Geneva, Switzerland", "on Geneva, Switzerland", "to Geneva, Switzerland", "by Geneva, Switzerland"] },
      { corr: "with world leaders attending.", dist: ["by world leaders.", "from world leaders.", "with leaders world attending.", "of world leaders."] }
    ]},
    { prompt: "These organic agricultural crops", trans: "این محصولات کشاورزی ارگانیک بدون استفاده از هیچ آفت‌کشی کشت می‌شوند.", steps: [
      { corr: "are grown organically", dist: ["are grow organically", "is grown organically", "grown organically", "are growing organically"], trap: { text: "are grow organically", exp: "قسمت سوم grow کلمه grown است." } },
      { corr: "without the use of chemical pesticides", dist: ["without of pesticides", "no with pesticides", "with no chemical pesticides", "without pesticides chemical"] },
      { corr: "to protect public health.", dist: ["for protect public health.", "in protecting health.", "to protecting health.", "for health public protect."] }
    ]},
    { prompt: "The missing archaeological artifacts", trans: "اشیای باستان‌شناسی گمشده سرانجام پس از دهه‌ها کشف شدند.", steps: [
      { corr: "have finally been discovered", dist: ["have finally discovered", "are finally discovered", "were finally discover", "have been discover"], trap: { text: "have finally discovered", exp: "در مجهول have been discovered درست است." } },
      { corr: "in an ancient subterranean tomb", dist: ["at tomb subterranean", "on ancient tomb", "to ancient tomb", "by tomb subterranean"] },
      { corr: "by international researchers.", dist: ["from researchers international.", "with researchers.", "of international researchers.", "to researchers."] }
    ]},
    { prompt: "The new highway", trans: "بزرگراه جدید تا پایان سال جاری میلادی افتتاح خواهد شد.", steps: [
      { corr: "will be opened to traffic", dist: ["will open to traffic", "will be open traffic", "is opened will traffic", "will been opened traffic"], trap: { text: "will open to traffic", exp: "در مجهول آینده will be opened درست است." } },
      { corr: "by the end of the year", dist: ["in end of the year", "at end of year", "to end of year", "on end of year"] },
      { corr: "to ease heavy congestion.", dist: ["for ease congestion.", "in easing congestion.", "to easing congestion.", "for congestion ease."] }
    ]},
    { prompt: "The stolen jewelry", trans: "جواهرات دزدیده‌شده توسط افسران پلیس فرودگاه پیدا شده‌اند.", steps: [
      { corr: "has been recovered", dist: ["has recovered", "is been recovered", "was recover", "have been recovered"], trap: { text: "have been recovered", exp: "کلمه jewelry غیرقابل شمارش و مفرد است و has been recovered می‌گیرد." } },
      { corr: "at the international terminal", dist: ["in international terminal", "on terminal international", "to international terminal", "by terminal international"] },
      { corr: "before the flight departed.", dist: ["before flight depart.", "before to depart flight.", "in flight departing.", "since flight depart."] }
    ]},
    { prompt: "All the exam papers", trans: "تمامی برگه‌های امتحانی در حال حاضر توسط اساتید تصحیح می‌شوند.", steps: [
      { corr: "are being graded", dist: ["are grading", "is being graded", "are grade", "were being grade"], trap: { text: "are grading", exp: "برگه‌ها تصحیح می‌شوند (مجهول): are being graded." } },
      { corr: "by the academic committee", dist: ["from academic committee", "with academic committee", "of committee academic", "to academic committee"] },
      { corr: "with strict standards.", dist: ["by strict standards.", "from strict standards.", "with standards strict.", "of strict standards."] }
    ]},
    { prompt: "The damaged electrical wires", trans: "سیم‌های برق آسیب‌دیده قبل از تاریک شدن هوا تعویض خواهند شد.", steps: [
      { corr: "will be replaced promptly", dist: ["will replace promptly", "will be replace promptly", "is replaced will", "will been replaced"], trap: { text: "will replace promptly", exp: "در مجهول آینده will be replaced می‌آید." } },
      { corr: "by certified technicians", dist: ["from certified technicians", "with certified technicians", "of technicians certified", "to certified technicians"] },
      { corr: "to restore power safely.", dist: ["for restore power.", "in restoring power.", "to restoring power.", "for power restore."] }
    ]},
    { prompt: "The scientific breakthrough", trans: "این دستاورد علمی در تمامی کنفرانس‌های بزرگ مورد بحث قرار گرفته است.", steps: [
      { corr: "has been discussed widely", dist: ["has discussed widely", "is been discussed", "was discuss widely", "have been discussed"], trap: { text: "has discussed widely", exp: "دستاورد مورد بحث قرار گرفته (مجهول): has been discussed." } },
      { corr: "across global universities", dist: ["at global universities", "in universities global", "to global universities", "by global universities"] },
      { corr: "over the past decade.", dist: ["since past decade.", "in past decade.", "at decade past.", "during past decade."] }
    ]},
    { prompt: "The confidential documents", trans: "اسناد محرمانه در حال حاضر در یک مرکز امن اسکن می‌شوند.", steps: [
      { corr: "are being scanned securely", dist: ["are scanning securely", "is being scanned", "are scan securely", "were being scan"], trap: { text: "are scanning securely", exp: "اسناد اسکن می‌شوند (مجهول استمراری): are being scanned." } },
      { corr: "into digital databases", dist: ["at digital databases", "on digital databases", "to databases digital", "by digital databases"] },
      { corr: "to prevent future data loss.", dist: ["for prevent data loss.", "in preventing loss.", "to preventing loss.", "for loss prevent."] }
    ]},
    { prompt: "The championship trophy", trans: "جام قهرمانی در مراسم پایانی به کاپیتان تیم اهدا خواهد شد.", steps: [
      { corr: "will be presented", dist: ["will present", "will be present", "is presented will", "will been presented"], trap: { text: "will present", exp: "جام اهدا خواهد شد (مجهول): will be presented." } },
      { corr: "to the winning captain", dist: ["at winning captain", "in winning captain", "for captain winning", "by captain winning"] },
      { corr: "at the stadium ceremony.", dist: ["in stadium ceremony.", "on stadium ceremony.", "to ceremony stadium.", "by ceremony stadium."] }
    ]},
    { prompt: "The old factory building", trans: "ساختمان کارخانه قدیمی تخریب شده و به یک مجتمع ورزشی تبدیل شده است.", steps: [
      { corr: "has been demolished", dist: ["has demolished", "is been demolished", "was demolish", "have been demolished"], trap: { text: "has demolished", exp: "کارخانه تخریب شده است: has been demolished." } },
      { corr: "by the city council", dist: ["from city council", "with city council", "of council city", "to city council"] },
      { corr: "to create a public park.", dist: ["for create public park.", "in creating park.", "to creating park.", "for park public."] }
    ]},
    { prompt: "New medical guidelines", trans: "دستورالعمل‌های پزشکی جدید توسط سازمان بهداشت جهانی منتشر شده‌اند.", steps: [
      { corr: "have been published", dist: ["have published", "has been published", "are publish", "were publish"], trap: { text: "has been published", exp: "فاعل guidelines جمع است و have been published می‌گیرد." } },
      { corr: "by global health experts", dist: ["from health experts", "with health experts", "of experts health", "to health experts"] },
      { corr: "for hospital staff worldwide.", dist: ["to hospital staff.", "in hospital staff.", "at staff hospital.", "with staff hospital."] }
    ]},
    { prompt: "The hospital patient", trans: "بیمار بیمارستان در حال حاضر توسط دو پزشک جراح متخصص معاینه می‌شود.", steps: [
      { corr: "is being examined carefully", dist: ["is examining carefully", "are being examined", "is examine carefully", "was being examine"], trap: { text: "is examining carefully", exp: "بیمار معاینه می‌شود: is being examined." } },
      { corr: "by top orthopedic surgeons", dist: ["from orthopedic surgeons", "with orthopedic surgeons", "of surgeons orthopedic", "to orthopedic surgeons"] },
      { corr: "in the operating theater.", dist: ["at operating theater.", "on operating theater.", "to theater operating.", "by theater operating."] }
    ]},
    { prompt: "The stolen masterpiece", trans: "شاهکار نقاشی دزدیده‌شده به گالری ملی بازگردانده خواهد شد.", steps: [
      { corr: "will be returned safely", dist: ["will return safely", "will be return safely", "is returned will", "will been returned"], trap: { text: "will return safely", exp: "شاهکار بازگردانده خواهد شد: will be returned." } },
      { corr: "to the national art gallery", dist: ["in national art gallery", "at gallery national", "for gallery art", "by gallery art"] },
      { corr: "after forensic verification.", dist: ["after verify forensic.", "after to verify forensic.", "in forensic verification.", "since verification."] }
    ]},
    { prompt: "The environmental law", trans: "قانون زیست‌محیطی به اتفاق آرا توسط مجلس تصویب شده است.", steps: [
      { corr: "has been ratified", dist: ["has ratified", "is been ratified", "was ratify", "have been ratified"], trap: { text: "has ratified", exp: "قانون تصویب شده است: has been ratified." } },
      { corr: "by the legislative parliament", dist: ["from parliament", "with parliament", "of parliament", "to parliament"] },
      { corr: "to reduce carbon emissions.", dist: ["for reduce emissions.", "in reducing emissions.", "to reducing emissions.", "for emissions reduce."] }
    ]},
    { prompt: "The modern apartment towers", trans: "برج‌های آپارتمانی مدرن با مصالح مقاوم در برابر زلزله ساخته شده‌اند.", steps: [
      { corr: "have been built", dist: ["have built", "has been built", "are build", "were build"], trap: { text: "has been built", exp: "کلمه towers جمع است و have been built می‌خواهد." } },
      { corr: "with seismic safety features", dist: ["by seismic features", "from safety features", "of safety features", "to safety features"] },
      { corr: "to protect residents.", dist: ["for protect residents.", "in protecting residents.", "to protecting residents.", "for residents protect."] }
    ]},
    { prompt: "The university degree", trans: "مدرک دانشگاهی به دانشجویانی که تمامی دوره‌ها را پاس کرده‌اند اعطا می‌شود.", steps: [
      { corr: "is awarded officially", dist: ["is award officially", "are awarded officially", "awarded officially", "be awarded officially"], trap: { text: "is award officially", exp: "مدرک اعطا می‌شود: is awarded." } },
      { corr: "to successful candidates", dist: ["at successful candidates", "in successful candidates", "for candidates successful", "by candidates successful"] },
      { corr: "at the graduation commencement.", dist: ["in graduation commencement.", "on commencement.", "to commencement.", "by commencement."] }
    ]},
    { prompt: "The defective laptops", trans: "لپ‌تاپ‌های معیوب بلافاصله توسط سازنده تعویض خواهند شد.", steps: [
      { corr: "will be replaced free of charge", dist: ["will replace free of charge", "will be replace free", "is replaced will", "will been replaced"], trap: { text: "will replace free of charge", exp: "لپ‌تاپ‌ها تعویض خواهند شد: will be replaced." } },
      { corr: "by the electronics manufacturer", dist: ["from manufacturer", "with manufacturer", "of manufacturer", "to manufacturer"] },
      { corr: "under the warranty terms.", dist: ["in warranty terms.", "at warranty terms.", "to terms warranty.", "by terms warranty."] }
    ]}
  ],

  // Stages 5 to 10 for B1
  5: [
    { prompt: "The manager stated that", trans: "مدیر اعلام کرد که شرکت قصد دارد سال آینده شعبه جدیدی در دبی افتتاح کند.", steps: [
      { corr: "the company would expand", dist: ["the company will expand", "the company expand", "the company is expand", "the company expands"], trap: { text: "the company will expand", exp: "در نقل قول غیرمستقیم بعد از stated زمان will به would تبدیل (backshift) می‌شود." } },
      { corr: "into European markets", dist: ["in European markets", "to markets European", "at European markets", "with European markets"] },
      { corr: "during the upcoming fiscal year.", dist: ["at fiscal year.", "in fiscal year upcoming.", "for year fiscal.", "by fiscal year."] }
    ]},
    { prompt: "Sarah told me that", trans: "سارا به من گفت که قبلاً دو بار از آن موزه تاریخی دیدن کرده است.", steps: [
      { corr: "she had already visited", dist: ["she has already visited", "she visited already", "she was visiting", "she visits already"], trap: { text: "she has already visited", exp: "در نقل قول گذشته، زمان حال کامل has visited به گذشته کامل had visited تبدیل می‌شود." } },
      { corr: "the ancient archaeological museum", dist: ["museum ancient archaeological", "to ancient museum", "for museum ancient", "with ancient museum"] },
      { corr: "with her university classmates.", dist: ["by her classmates.", "from her classmates.", "with classmates university.", "of her classmates."] }
    ]},
    { prompt: "The doctor explained that", trans: "پزشک توضیح داد که بیمار باید به مدت یک هفته استراحت مطلق داشته باشد.", steps: [
      { corr: "the patient needed to rest", dist: ["the patient needs to rest", "patient need to rest", "patient is needing to rest", "patient will need rest"], trap: { text: "the patient needs to rest", exp: "فعل needs در نقل قول به needed تبدیل می‌شود." } },
      { corr: "in complete quietness", dist: ["at quietness complete", "with complete quietness", "to complete quietness", "by quietness complete"] },
      { corr: "to make a full recovery.", dist: ["for make recovery.", "in making recovery.", "to making recovery.", "for recovery full."] }
    ]},
    { prompt: "David mentioned that", trans: "دیوید متذکر شد که نمی‌تواند فردا در جلسه هیئت مدیره شرکت کند.", steps: [
      { corr: "he could not attend", dist: ["he cannot attend", "he can't attend", "he is not attend", "he will not can attend"], trap: { text: "he cannot attend", exp: "فعل cannot به could not تبدیل می‌شود." } },
      { corr: "the executive board meeting", dist: ["meeting executive board", "to executive meeting", "at board meeting", "for meeting executive"] },
      { corr: "due to an unexpected flight delay.", dist: ["because flight delay.", "from flight delay.", "for delay flight.", "with flight delay."] }
    ]},
    { prompt: "They told us that", trans: "آن‌ها به ما گفتند که کلیدهای آپارتمان را روی میز پذیرش گذاشته‌اند.", steps: [
      { corr: "they had left the keys", dist: ["they have left the keys", "they leave the keys", "they were leaving keys", "they lefted keys"], trap: { text: "they have left the keys", exp: "زمان گذشته به گذشته کامل had left تغییر می‌یابد." } },
      { corr: "at the front desk reception", dist: ["in reception desk", "on front desk reception", "to front desk", "by desk reception"] },
      { corr: "before departing for the airport.", dist: ["before depart for airport.", "before to depart airport.", "in departing airport.", "since depart airport."] }
    ]},
    { prompt: "The professor said that", trans: "استاد گفت که نتایج نهایی امتحان هفته آینده منتشر خواهد شد.", steps: [
      { corr: "the final grades would be posted", dist: ["grades will be posted", "grades are posted", "grades would posted", "grades will posted"], trap: { text: "grades will be posted", exp: "will به would تبدیل می‌شود." } },
      { corr: "on the student portal", dist: ["in student portal", "at student portal", "to portal student", "by student portal"] },
      { corr: "by the following Monday.", dist: ["at following Monday.", "on following Monday by.", "in following Monday.", "to following Monday."] }
    ]},
    { prompt: "Emily confessed that", trans: "امیلی اعتراف کرد که یادداشت‌های مهم کنفرانس را گم کرده است.", steps: [
      { corr: "she had misplaced", dist: ["she has misplaced", "she misplaces", "she was misplacing", "she misplaced have"], trap: { text: "she has misplaced", exp: "has misplaced به had misplaced تبدیل می‌شود." } },
      { corr: "the confidential meeting notes", dist: ["notes meeting confidential", "to confidential notes", "for notes meeting", "with notes confidential"] },
      { corr: "somewhere in the library.", dist: ["anywhere in library.", "nowhere in library.", "everywhere in library.", "at library anywhere."] }
    ]},
    { prompt: "The architect reported that", trans: "معمار گزارش داد که پروژه با سرعت بسیار خوبی پیش می‌رود.", steps: [
      { corr: "the construction was progressing", dist: ["construction is progressing", "construction progresses", "construction will progress", "construction has progress"], trap: { text: "construction is progressing", exp: "is progressing به was progressing تغییر می‌یابد." } },
      { corr: "at a very steady pace", dist: ["in steady pace", "on steady pace", "to pace steady", "by pace steady"] },
      { corr: "without any safety incidents.", dist: ["without of incidents.", "no with incidents.", "with no safety incidents.", "without incidents."] }
    ]},
    { prompt: "He promised that", trans: "او قول داد که به محض رسیدن به فرودگاه با والدینش تماس خواهد گرفت.", steps: [
      { corr: "he would call his parents", dist: ["he will call his parents", "he calls his parents", "he called his parents", "he can call parents"], trap: { text: "he will call his parents", exp: "will call به would call تبدیل می‌شود." } },
      { corr: "as soon as he landed", dist: ["as soon as he lands", "as soon he land", "when he landing", "while he lands"] },
      { corr: "at the international terminal.", dist: ["in international terminal.", "on terminal international.", "to international terminal.", "by terminal international."] }
    ]},
    { prompt: "She explained that", trans: "او توضیح داد که به دلیل بیماری در روز قبل نتوانسته است بیاید.", steps: [
      { corr: "she had been sick", dist: ["she has been sick", "she was sick have", "she is sick", "she be sick"], trap: { text: "she has been sick", exp: "has been به had been تبدیل می‌شود." } },
      { corr: "the day before", dist: ["yesterday day", "before yesterday", "in day before", "at day before"] },
      { corr: "and could not finish the report.", dist: ["and cannot finish report.", "and can't finish report.", "and will not finish.", "and to not finish."] }
    ]},
    { prompt: "The engineer confirmed that", trans: "مهندس تأیید کرد که تمام آزمایش‌های ایمنی با موفقیت انجام شده است.", steps: [
      { corr: "all safety trials had succeeded", dist: ["trials have succeeded", "trials succeed", "trials were succeed", "trials are succeeded"], trap: { text: "trials have succeeded", exp: "have succeeded به had succeeded تبدیل می‌شود." } },
      { corr: "under extreme pressure tests", dist: ["at pressure tests", "in tests pressure", "on extreme pressure", "to pressure tests"] },
      { corr: "without causing any structural damage.", dist: ["without cause damage.", "without to cause damage.", "in causing damage.", "for damage cause."] }
    ]},
    { prompt: "They announced that", trans: "آن‌ها اعلام کردند که قیمت بلیط‌ها از ماه آینده افزایش خواهد یافت.", steps: [
      { corr: "ticket prices would increase", dist: ["prices will increase", "prices increase", "prices are increase", "prices to increase"], trap: { text: "prices will increase", exp: "will به would تبدیل می‌شود." } },
      { corr: "by ten percent", dist: ["in ten percent", "at ten percent", "to ten percent", "for ten percent"] },
      { corr: "starting from the next quarter.", dist: ["start from quarter.", "to start from quarter.", "in starting quarter.", "since quarter next."] }
    ]},
    { prompt: "David claimed that", trans: "دیوید ادعا کرد که هیچ پولی از گاوصندوق شرکت برنداشته است.", steps: [
      { corr: "he had not taken any funds", dist: ["he has not taken funds", "he did not took funds", "he not took funds", "he was not taking"], trap: { text: "he has not taken funds", exp: "has not taken به had not taken تبدیل می‌شود." } },
      { corr: "from the office safe", dist: ["of office safe", "in office safe", "at safe office", "to office safe"] },
      { corr: "during the previous night.", dist: ["at night previous.", "in previous night.", "on previous night.", "by previous night."] }
    ]},
    { prompt: "The guide told the tourists that", trans: "راهنما به گردشگران گفت که کاخ باستانی بیش از پانصد سال قدمت دارد.", steps: [
      { corr: "the palace was over", dist: ["the palace is over", "palace were over", "palace has over", "palace to be over"], trap: { text: "the palace is over", exp: "is به was تبدیل می‌شود." } },
      { corr: "five hundred years old", dist: ["years five hundred old", "to five hundred years", "for years old", "with years five hundred"] },
      { corr: "and built of solid stone.", dist: ["and build of stone.", "and building of stone.", "and to build stone.", "and builded of stone."] }
    ]},
    { prompt: "She admitted that", trans: "او اعتراف کرد که فراموش کرده بود فایل پیوست را به ایمیل اضافه کند.", steps: [
      { corr: "she had forgotten to attach", dist: ["she has forgotten to attach", "she forgot attach", "she was forgetting attach", "she forgets to attach"], trap: { text: "she has forgotten to attach", exp: "has forgotten به had forgotten تغییر می‌یابد." } },
      { corr: "the financial spreadsheet", dist: ["spreadsheet financial", "to spreadsheet financial", "for spreadsheet financial", "with financial spreadsheet"] },
      { corr: "to her official email message.", dist: ["in her email message.", "at email message her.", "for email message.", "by email message."] }
    ]},
    { prompt: "The inspector noted that", trans: "بازرس خاطرنشان کرد که سیستم تهویه به درستی کار نمی‌کرد.", steps: [
      { corr: "the ventilation was not operating", dist: ["ventilation is not operating", "ventilation does not operate", "ventilation will not operate", "ventilation has not operate"], trap: { text: "ventilation is not operating", exp: "is not operating به was not operating تبدیل می‌شود." } },
      { corr: "at optimal capacity", dist: ["in capacity optimal", "on optimal capacity", "to optimal capacity", "by capacity optimal"] },
      { corr: "during the morning inspection.", dist: ["at inspection morning.", "in morning inspection.", "on inspection morning.", "for morning inspection."] }
    ]},
    { prompt: "We believed that", trans: "ما باور داشتیم که تیم ما به راحتی مسابقه نهایی را خواهد برد.", steps: [
      { corr: "our team would win", dist: ["our team will win", "our team wins", "our team won", "our team is win"], trap: { text: "our team will win", exp: "will win به would win تبدیل می‌شود." } },
      { corr: "the championship match", dist: ["match championship", "to championship match", "for match championship", "with championship match"] },
      { corr: "against their fierce rivals.", dist: ["to fierce rivals.", "with rivals fierce.", "at fierce rivals.", "by fierce rivals."] }
    ]},
    { prompt: "He confirmed that", trans: "او تأیید کرد که تمام بدهی‌های بانکی‌اش را قبل از مهلت مقرر پرداخته است.", steps: [
      { corr: "he had paid off all debts", dist: ["he has paid off debts", "he pays off debts", "he was paying debts", "he payed off debts"], trap: { text: "he has paid off debts", exp: "has paid به had paid تبدیل می‌شود." } },
      { corr: "to the commercial bank", dist: ["at commercial bank", "in commercial bank", "for commercial bank", "with commercial bank"] },
      { corr: "ahead of the strict deadline.", dist: ["ahead deadline strict.", "in ahead of deadline.", "at deadline ahead.", "to deadline ahead."] }
    ]},
    { prompt: "The witness sworn that", trans: "شاهد سوگند یاد کرد که مردی را در حال فرار از ساختمان دیده است.", steps: [
      { corr: "she had seen a suspect", dist: ["she has seen a suspect", "she saw suspect have", "she sees a suspect", "she was seeing suspect"], trap: { text: "she has seen a suspect", exp: "has seen به had seen تبدیل می‌شود." } },
      { corr: "running across the parking lot", dist: ["run in parking lot", "ran across parking lot", "to run parking lot", "running on lot"] },
      { corr: "right after the alarm went off.", dist: ["after alarm go off.", "since alarm went off.", "when alarm go off.", "before alarm went off."] }
    ]},
    { prompt: "The reporter claimed that", trans: "خبرنگار ادعا کرد که وزیر استعفای خود را کتباً تقدیم کرده است.", steps: [
      { corr: "the minister had resigned", dist: ["the minister has resigned", "minister resigns", "minister was resigning", "minister will resign"], trap: { text: "the minister has resigned", exp: "has resigned به had resigned تغییر می‌یابد." } },
      { corr: "from his official post", dist: ["of official post", "in official post", "at post official", "to official post"] },
      { corr: "following the political scandal.", dist: ["follow scandal.", "to follow scandal.", "in following scandal.", "for following scandal."] }
    ]}
  ],

  // Stages 6 to 10 for B1
  6: [
    { prompt: "Before leaving the laboratory, you must", trans: "قبل از ترک آزمایشگاه، باید تمام دستگاه‌های برقی را خاموش کنی.", steps: [
      { corr: "turn off", dist: ["turn on", "turn into", "turn over", "turn away"], trap: { text: "turn on", exp: "برای خاموش کردن وسایل برقی turn off صحیح است نه turn on." } },
      { corr: "all the electrical appliances", dist: ["appliances electrical all", "to electrical appliances", "for appliances electrical", "with appliances electrical"] },
      { corr: "to maintain fire safety.", dist: ["for maintain safety.", "in maintaining safety.", "to maintaining safety.", "for safety maintain."] }
    ]},
    { prompt: "When she entered the apartment, she", trans: "وقتی او وارد آپارتمان شد، کتش را درآورد و روی صندلی آویزان کرد.", steps: [
      { corr: "took off", dist: ["took on", "took out", "took away", "took over"], trap: { text: "took on", exp: "برای درآوردن لباس take off به کار می‌رود نه take on." } },
      { corr: "her heavy winter jacket", dist: ["jacket winter heavy", "to winter jacket", "for jacket winter", "with jacket winter"] },
      { corr: "and hung it on the coat rack.", dist: ["and hangs it.", "and hanging it.", "and to hang it.", "and hanged it."] }
    ]},
    { prompt: "He was advised by his doctor to", trans: "پزشکش به او توصیه کرد که سیگار کشیدن را برای همیشه ترک کند.", steps: [
      { corr: "give up", dist: ["give in", "give away", "give back", "give off"], trap: { text: "give in", exp: "برای ترک یک عادت give up صحیح است (give in یعنی تسلیم شدن)." } },
      { corr: "smoking cigarettes completely", dist: ["smoke cigarettes completely", "to smoke cigarettes", "smoking completely cigarettes", "for smoking cigarettes"] },
      { corr: "to protect his lung health.", dist: ["for protect lung health.", "in protecting lungs.", "to protecting lungs.", "for lungs protect."] }
    ]},
    { prompt: "The flight was delayed, so they had to", trans: "پرواز تاخیر داشت، بنابراین آن‌ها مجبور شدند جلسه را تا فردا به تعویق بیندازند.", steps: [
      { corr: "put off the meeting", dist: ["put on the meeting", "put up the meeting", "put in the meeting", "put out meeting"], trap: { text: "put on the meeting", exp: "به تعویق انداختن با put off بیان می‌شود." } },
      { corr: "until tomorrow morning", dist: ["since tomorrow morning", "in tomorrow morning", "at tomorrow morning", "to tomorrow morning"] },
      { corr: "when everyone was available.", dist: ["while everyone available.", "at everyone available.", "since everyone available.", "where everyone available."] }
    ]},
    { prompt: "Can you please", trans: "می‌شود لطفاً صدای تلویزیون را کم کنی؟ من دارم درس می‌خوانم.", steps: [
      { corr: "turn down the volume", dist: ["turn up the volume", "turn on the volume", "turn off the volume completely", "turn out the volume"], trap: { text: "turn up the volume", exp: "برای کم کردن صدا turn down به کار می‌رود (turn up یعنی زیاد کردن)." } },
      { corr: "on the living room television", dist: ["in living room television", "at television living room", "to television room", "by television room"] },
      { corr: "so I can focus on my studies?", dist: ["for I can focus?", "in focusing my studies?", "to focus I can?", "that focus I can?"] }
    ]},
    { prompt: "While reading an English article, you should", trans: "هنگام خواندن مقاله انگلیسی، باید کلمات جدید را در فرهنگ لغت جستجو کنی.", steps: [
      { corr: "look up unfamiliar words", dist: ["look after words", "look into words", "look for words", "look out words"], trap: { text: "look after words", exp: "برای پیدا کردن معنی کلمه در دیکشنری look up صحیح است (look after یعنی مراقبت کردن)." } },
      { corr: "in an advanced dictionary", dist: ["at advanced dictionary", "on advanced dictionary", "to dictionary advanced", "by dictionary advanced"] },
      { corr: "to expand your vocabulary.", dist: ["for expand vocabulary.", "in expanding vocabulary.", "to expanding vocabulary.", "for vocabulary expand."] }
    ]},
    { prompt: "She promised to", trans: "او قول داد که وقتی والدینش در سفر هستند از گربه آن‌ها مراقبت کند.", steps: [
      { corr: "look after their cat", dist: ["look up their cat", "look for their cat", "look into their cat", "look at their cat"], trap: { text: "look up their cat", exp: "مراقبت کردن از کسی یا حیوانی look after است." } },
      { corr: "while they were away", dist: ["when they away", "since they away", "in they were away", "at they were away"] },
      { corr: "on their summer holiday.", dist: ["in summer holiday.", "at holiday summer.", "to summer holiday.", "by holiday summer."] }
    ]},
    { prompt: "The fire department managed to", trans: "آتش‌نشانی موفق شد آتش‌سوزی در انبار چوب را به سرعت خاموش کند.", steps: [
      { corr: "put out the blaze", dist: ["put off the blaze", "put on the blaze", "put up the blaze", "put in the blaze"], trap: { text: "put off the blaze", exp: "خاموش کردن آتش put out است (put off یعنی به تعویق انداختن)." } },
      { corr: "at the timber warehouse", dist: ["in timber warehouse", "on warehouse timber", "to timber warehouse", "by warehouse timber"] },
      { corr: "before it spread to houses.", dist: ["before of spreading.", "since it spread.", "in spreading to houses.", "to spread to houses."] }
    ]},
    { prompt: "Please don't forget to", trans: "لطفاً فراموش نکن که فرم ثبت‌نام دانشگاه را با دقت پر کنی.", steps: [
      { corr: "fill out the application", dist: ["fill in out application", "fill off application", "fill up application", "fill into application"], trap: { text: "fill off application", exp: "پر کردن فرم با fill out بیان می‌شود." } },
      { corr: "with your personal details", dist: ["by personal details", "from personal details", "of personal details", "to personal details"] },
      { corr: "before the final deadline.", dist: ["before of deadline.", "to final deadline.", "in deadline final.", "at deadline final."] }
    ]},
    { prompt: "He ran out of gas because he forgot to", trans: "بنزینش تمام شد چون فراموش کرده بود باک ماشین را پر کند.", steps: [
      { corr: "fill up the tank", dist: ["fill out the tank", "fill off the tank", "fill in the tank", "fill down the tank"], trap: { text: "fill out the tank", exp: "پر کردن باک بنزین fill up است." } },
      { corr: "at the highway petrol station", dist: ["in petrol station", "on station petrol", "to petrol station", "by petrol station"] },
      { corr: "before the long journey.", dist: ["before of journey.", "to long journey.", "in journey long.", "at long journey."] }
    ]},
    { prompt: "You should not", trans: "نباید به خاطر این که کسی پول کمتری دارد او را تحقیر کنی.", steps: [
      { corr: "look down on people", dist: ["look up to people", "look after people", "look out on people", "look into people"], trap: { text: "look up to people", exp: "تحقیر کردن look down on است (look up to یعنی احترام گذاشتن)." } },
      { corr: "who earn lower wages", dist: ["which earn wages", "where earn wages", "whom earn wages", "whose earn wages"] },
      { corr: "in our community society.", dist: ["at community society.", "on society community.", "to community society.", "by society community."] }
    ]},
    { prompt: "The young athlete really", trans: "این ورزشکار جوان واقعاً مربی باتجربه‌اش را به عنوان الگو ستایش می‌کند.", steps: [
      { corr: "looks up to his coach", dist: ["looks down on his coach", "looks after his coach", "looks for his coach", "looks into his coach"], trap: { text: "looks down on his coach", exp: "تحسین و احترام گذاشتن look up to است." } },
      { corr: "as a personal role model", dist: ["like role model", "for role model", "to role model", "with role model"] },
      { corr: "in professional sports.", dist: ["at professional sports.", "on sports professional.", "to sports professional.", "by professional sports."] }
    ]},
    { prompt: "If you don't need these old magazines, please", trans: "اگر به این مجلات قدیمی نیاز نداری، لطفاً آن‌ها را دور نینداز؛ بازیافت کن.", steps: [
      { corr: "throw them away", dist: ["throw away them", "throw off them", "throw them out away", "throw them into"], trap: { text: "throw away them", exp: "وقتی مفعول ضمیر است (them)، باید بین فعل و حرف اضافه قرار بگیرد (throw them away)." } },
      { corr: "in the garbage bin", dist: ["at garbage bin", "on bin garbage", "to garbage bin", "by garbage bin"] },
      { corr: "instead of recycling them.", dist: ["instead recycle them.", "without recycle them.", "in place recycling.", "instead of recycle them."] }
    ]},
    { prompt: "The plane is scheduled to", trans: "هواپیما قرار است دقیقاً رأس ساعت شش صبح پرواز کند.", steps: [
      { corr: "take off on runway four", dist: ["take on runway four", "take up runway four", "take out runway four", "take away runway four"], trap: { text: "take on runway four", exp: "بلند شدن هواپیما take off است." } },
      { corr: "at dawn tomorrow", dist: ["in dawn tomorrow", "on dawn tomorrow", "to dawn tomorrow", "by dawn tomorrow"] },
      { corr: "weather permitting.", dist: ["weather permit.", "with weather permit.", "in weather permit.", "to weather permitting."] }
    ]},
    { prompt: "She managed to", trans: "او موفق شد با سخت‌کوشی بر موانع زبانی در کشور جدید غلبه کند.", steps: [
      { corr: "get over the language barrier", dist: ["get through over barrier", "get up the barrier", "get off the barrier", "get into barrier"], trap: { text: "get off the barrier", exp: "غلبه بر یک مشکل get over است." } },
      { corr: "through intensive practice", dist: ["by practice intensive", "from intensive practice", "with practice intensive", "of intensive practice"] },
      { corr: "and continuous conversation.", dist: ["and continue conversation.", "and conversation continue.", "and to continue conversation.", "and continued conversation."] }
    ]},
    { prompt: "Don't forget to", trans: "فراموش نکن که کتاب‌های کتابخانه را قبل از موعد مقرر پس بدهی.", steps: [
      { corr: "give back the borrowed books", dist: ["give up the borrowed books", "give away the borrowed books", "give off borrowed books", "give in borrowed books"], trap: { text: "give up the borrowed books", exp: "پس دادن شیء امانتی give back است." } },
      { corr: "to the central desk", dist: ["at central desk", "in central desk", "for central desk", "with central desk"] },
      { corr: "before late fees apply.", dist: ["before of fees.", "since fees apply.", "in fees applying.", "to fees apply."] }
    ]},
    { prompt: "The detective promised to", trans: "کارآگاه قول داد که این سرقت عجیب را با دقت بررسی کند.", steps: [
      { corr: "look into the mystery", dist: ["look at the mystery", "look after the mystery", "look up the mystery", "look for mystery"], trap: { text: "look after the mystery", exp: "بررسی و تحقیق در مورد یک پرونده look into است." } },
      { corr: "with forensic evidence", dist: ["by forensic evidence", "from forensic evidence", "of forensic evidence", "to forensic evidence"] },
      { corr: "until the culprit is found.", dist: ["until of culprit.", "since culprit found.", "in culprit finding.", "to culprit found."] }
    ]},
    { prompt: "I can no longer", trans: "من دیگر نمی‌توانم این سر و صدای مداوم ترافیک را تحمل کنم.", steps: [
      { corr: "put up with the noise", dist: ["put down with noise", "put on with noise", "put out with noise", "put in with noise"], trap: { text: "put down with noise", exp: "تحمل کردن شرایط ناخوشایند put up with است." } },
      { corr: "from the busy street", dist: ["of busy street", "in street busy", "at busy street", "to busy street"] },
      { corr: "outside my bedroom window.", dist: ["outside of window.", "next my window.", "by window outside.", "in outside window."] }
    ]},
    { prompt: "She decided to", trans: "او تصمیم گرفت برای مصاحبه استخدامی بهترین لباس رسمی‌اش را بپوشد.", steps: [
      { corr: "put on her formal suit", dist: ["put off her formal suit", "put up her suit", "put in her suit", "put out her suit"], trap: { text: "put off her formal suit", exp: "پوشیدن لباس put on است (put off یعنی به تعویق انداختن)." } },
      { corr: "and polished shoes", dist: ["and shoes polished", "and polish shoes", "and to polish shoes", "and polishing shoes"] },
      { corr: "for the executive interview.", dist: ["to executive interview.", "in interview executive.", "at executive interview.", "with executive interview."] }
    ]},
    { prompt: "We unfortunately", trans: "ما متأسفانه در وسط بیابان بنزین تمام کردیم.", steps: [
      { corr: "ran out of petrol", dist: ["ran off petrol", "ran away petrol", "ran into petrol", "ran down petrol"], trap: { text: "ran off petrol", exp: "تمام شدن یک منبع ran out of است." } },
      { corr: "miles from the city", dist: ["miles of the city", "in miles from city", "at miles from city", "to city miles"] },
      { corr: "and had to call assistance.", dist: ["and has to call.", "and having to call.", "and to call assistance.", "and call assistance."] }
    ]}
  ],

  // Stages 7 to 10 for B1
  7: [
    { prompt: "Although the negotiations were extremely difficult,", trans: "اگرچه مذاکرات بسیار دشوار بود، هر دو هیئت موفق شدند به توافق برسند.", steps: [
      { corr: "both diplomatic teams managed", dist: ["both teams managing", "both teams manages", "both teams to manage", "both teams were manage"], trap: { text: "both teams managing", exp: "در بند اصلی نیاز به فعل گذشته ساده managed است." } },
      { corr: "to sign a historic accord", dist: ["signing historic accord", "sign historic accord", "to signing accord", "for sign accord"] },
      { corr: "in order to maintain peace.", dist: ["so that maintain peace.", "for maintain peace.", "in order maintain peace.", "so to maintain peace."] }
    ]},
    { prompt: "In spite of the heavy snowfall,", trans: "با وجود بارش سنگین برف، هواپیما سر وقت بدون تاخیر پرواز کرد.", steps: [
      { corr: "the morning flight took off", dist: ["flight taking off", "flight takes off", "flight to take off", "flight taken off"], trap: { text: "flight taking off", exp: "فعل اصلی گذشته took off است." } },
      { corr: "without any serious delay", dist: ["without of delay", "no with delay", "with no delay serious", "without delay serious"] },
      { corr: "so that passengers arrived on time.", dist: ["in order passengers arrive.", "so passengers arrive.", "for passengers arrive.", "in order to arrive."] }
    ]},
    { prompt: "He wore a warm wool scarf", trans: "او شال گردن پشمی گرمی بست تا در هوای یخبندان سرما نخورد.", steps: [
      { corr: "in order to avoid catching", dist: ["in order avoid catching", "so that avoid catching", "for avoid catch", "in order to catch"], trap: { text: "in order avoid catching", exp: "ساختار بیان هدف in order to + فعل ساده (avoid) است." } },
      { corr: "a severe winter cold", dist: ["cold winter severe", "to severe cold", "for cold severe", "with severe cold"] },
      { corr: "despite the freezing blizzard.", dist: ["despite of blizzard.", "in spite blizzard.", "although freezing blizzard.", "for blizzard freezing."] }
    ]},
    { prompt: "Although she felt exhausted after the journey,", trans: "اگرچه او بعد از سفر خسته بود، به آماده کردن شام کمک کرد.", steps: [
      { corr: "she insisted on helping", dist: ["she insisted to help", "she insists on helping", "she insisting on help", "she insist help"], trap: { text: "she insisted to help", exp: "بعد از insist حرف اضافه on و فعل با ing (on helping) می‌آید." } },
      { corr: "with the evening cooking", dist: ["in evening cooking", "at cooking evening", "to cooking evening", "for evening cook"] },
      { corr: "so that her mother could rest.", dist: ["in order her mother rest.", "so mother rest.", "for mother could rest.", "in order to rest mother."] }
    ]},
    { prompt: "Despite their financial difficulties,", trans: "با وجود مشکلات مالی، آن‌ها توانستند فرزندشان را به دانشگاه بفرستند.", steps: [
      { corr: "the family managed to finance", dist: ["family managing finance", "family manages finance", "family to manage finance", "family managed finance to"], trap: { text: "family managing finance", exp: "فعل اصلی managed to finance است." } },
      { corr: "their daughter's medical degree", dist: ["degree medical daughter", "to daughter degree", "for degree medical", "with degree daughter"] },
      { corr: "so that she could become a surgeon.", dist: ["in order she could become.", "so she become.", "for become surgeon.", "in order to become."] }
    ]},
    { prompt: "He spoke in a very low whisper", trans: "او بسیار آرام نجوا کرد تا هیچ‌کس گفتگوی محرمانه او را نشنود.", steps: [
      { corr: "so that nobody could hear", dist: ["so that nobody can hear", "in order nobody hear", "for nobody could hear", "in order to nobody hear"], trap: { text: "so that nobody can hear", exp: "چون جمله در گذشته است (spoke)، در بند هدف could hear می‌آید نه can." } },
      { corr: "the confidential details", dist: ["details confidential", "to details confidential", "for details confidential", "with confidential details"] },
      { corr: "although the room was quiet.", dist: ["despite room was quiet.", "in spite room was quiet.", "because of room quiet.", "even room quiet."] }
    ]},
    { prompt: "In spite of being warned about the storm,", trans: "با وجود هشدار در مورد طوفان، کوهنوردان به مسیر خود ادامه دادند.", steps: [
      { corr: "the adventurous hikers continued", dist: ["hikers continuing", "hikers continues", "hikers to continue", "hikers continue"], trap: { text: "hikers continuing", exp: "فعل اصلی گذشته continued است." } },
      { corr: "their dangerous ascent", dist: ["ascent dangerous their", "to dangerous ascent", "for ascent dangerous", "with dangerous ascent"] },
      { corr: "in order to reach the summit.", dist: ["so that reach summit.", "for reach summit.", "in order reach summit.", "so reach summit."] }
    ]},
    { prompt: "Although he had plenty of opportunities,", trans: "اگرچه فرصت‌های زیادی داشت، اما پیشنهاد کار در خارج را نپذیرفت.", steps: [
      { corr: "he chose to remain", dist: ["he chooses remain", "he choosing remain", "he chosen remain", "he choose to remain"], trap: { text: "he chooses remain", exp: "گذشته ساده chose to remain است." } },
      { corr: "in his hometown", dist: ["at his hometown", "to his hometown", "on hometown his", "by his hometown"] },
      { corr: "so that he could care for his parents.", dist: ["in order he could care.", "so he care.", "for care parents.", "in order to care."] }
    ]},
    { prompt: "She left for the airport early", trans: "او زودتر به سمت فرودگاه حرکت کرد تا در ترافیک سنگین گیر نیفتد.", steps: [
      { corr: "in order not to get stuck", dist: ["in order to not get stuck", "so that not get stuck", "for not get stuck", "in order no getting stuck"], trap: { text: "in order to not get stuck", exp: "حالت منفی in order not to + فعل ساده است." } },
      { corr: "in morning rush-hour traffic", dist: ["at traffic rush hour", "on rush hour traffic", "to traffic rush hour", "by traffic rush"] },
      { corr: "despite the clear forecast.", dist: ["despite of forecast.", "in spite forecast clear.", "although clear forecast.", "for clear forecast."] }
    ]},
    { prompt: "Despite studying late into the night,", trans: "با وجود این که تا پاسی از شب درس خواند، احساس خستگی نکرد.", steps: [
      { corr: "she woke up refreshed", dist: ["she wakes up refreshed", "she waking up refreshed", "she to wake up refreshed", "she woken up"], trap: { text: "she wakes up refreshed", exp: "گذشته ساده woke up است." } },
      { corr: "and ready for the test", dist: ["and readied for test", "and to ready for test", "and readiness test", "and reading test"] },
      { corr: "although the exam was difficult.", dist: ["despite exam was difficult.", "in spite exam difficult.", "because exam difficult.", "for exam difficult."] }
    ]},
    { prompt: "The company lowered prices", trans: "شرکت قیمت‌ها را کاهش داد تا سهم بیشتری از بازار به دست آورد.", steps: [
      { corr: "so that they could attract", dist: ["so that they can attract", "in order they attract", "for they could attract", "in order to they attract"], trap: { text: "so that they can attract", exp: "در گذشته could attract درست است." } },
      { corr: "new retail consumers", dist: ["consumers retail new", "to retail consumers", "for consumers retail", "with new consumers"] },
      { corr: "although profit margins shrank.", dist: ["despite margins shrank.", "in spite margins shrank.", "because margins shrank.", "for margins shrank."] }
    ]},
    { prompt: "In spite of working long overtime hours,", trans: "با وجود کار کردن ساعات طولانی، حقوق کافی دریافت نمی‌کرد.", steps: [
      { corr: "he was not paid fairly", dist: ["he did not paid fairly", "he not paid fairly", "he was not pay fairly", "he is not paid fairly"], trap: { text: "he did not paid fairly", exp: "مجهول گذشته was not paid است." } },
      { corr: "by the corporate contractor", dist: ["from corporate contractor", "with corporate contractor", "of contractor corporate", "to contractor corporate"] },
      { corr: "although the contract promised bonuses.", dist: ["despite contract promised.", "in spite contract promised.", "because contract promised.", "for contract promised."] }
    ]},
    { prompt: "We installed double-glazed windows", trans: "ما پنجره‌های دوجداره نصب کردیم تا سر و صدای خیابان را کاهش دهیم.", steps: [
      { corr: "in order to reduce noise", dist: ["in order reduce noise", "so that reduce noise", "for reduce noise", "in order to reducing noise"], trap: { text: "in order reduce noise", exp: "نیاز به in order to reduce دارد." } },
      { corr: "from the busy main road", dist: ["of main road busy", "in road main", "at busy road", "to main road"] },
      { corr: "despite the high installation cost.", dist: ["despite of cost.", "in spite cost high.", "although high cost.", "for high cost."] }
    ]},
    { prompt: "Although he lacked formal qualifications,", trans: "اگرچه مدارک رسمی نداشت، اما توانایی‌های عملی فوق‌العاده‌ای نشان داد.", steps: [
      { corr: "he demonstrated great talent", dist: ["he demonstrates talent", "he demonstrating talent", "he to demonstrate talent", "he demonstrate talent"], trap: { text: "he demonstrates talent", exp: "گذشته ساده demonstrated است." } },
      { corr: "in software programming", dist: ["at software programming", "on programming software", "to software programming", "by programming software"] },
      { corr: "so that the manager hired him.", dist: ["in order manager hired him.", "for manager hire him.", "so manager hire him.", "in order to hire."] }
    ]},
    { prompt: "She saved money every month", trans: "او هر ماه پس‌انداز کرد تا بتواند خانه‌ای کوچک برای خودش بخرد.", steps: [
      { corr: "so that she could purchase", dist: ["so that she can purchase", "in order she purchase", "for she could purchase", "in order to she purchase"], trap: { text: "so that she can purchase", exp: "در گذشته could purchase می‌آید." } },
      { corr: "her own private studio", dist: ["studio private her own", "to private studio", "for studio private", "with private studio"] },
      { corr: "despite rising property prices.", dist: ["despite of rising prices.", "in spite rising prices.", "although rising prices.", "for rising prices."] }
    ]},
    { prompt: "In spite of facing severe competition,", trans: "با وجود رقابت شدید، این استارتاپ به رشد سریع خود ادامه داد.", steps: [
      { corr: "the tech startup expanded", dist: ["startup expanding", "startup expands", "startup to expand", "startup expand"], trap: { text: "startup expanding", exp: "فعل گذشته expanded است." } },
      { corr: "into five international regions", dist: ["at five regions", "on five regions", "to regions five", "by five regions"] },
      { corr: "in order to dominate the market.", dist: ["so that dominate market.", "for dominate market.", "in order dominate market.", "so to dominate."] }
    ]},
    { prompt: "Although the movie was very long,", trans: "اگرچه فیلم بسیار طولانی بود، تماشاگران تا پایان مجذوب آن ماندند.", steps: [
      { corr: "the audience remained captivated", dist: ["audience remains captivated", "audience remaining captivated", "audience to remain captivated", "audience remain"], trap: { text: "audience remains captivated", exp: "گذشته ساده remained است." } },
      { corr: "by the stunning visuals", dist: ["from stunning visuals", "with visuals stunning", "of stunning visuals", "to stunning visuals"] },
      { corr: "despite the slow pacing.", dist: ["despite of pacing.", "in spite pacing slow.", "although slow pacing.", "for pacing slow."] }
    ]},
    { prompt: "He took detailed notes during lecture", trans: "او در طول تدریس یادداشت‌های دقیقی برداشت تا مباحث را فراموش نکند.", steps: [
      { corr: "in order not to forget", dist: ["in order to not forget", "so that not forget", "for not forget", "in order no forgetting"], trap: { text: "in order to not forget", exp: "حالت منفی in order not to forget است." } },
      { corr: "the complex formulas", dist: ["formulas complex", "to complex formulas", "for formulas complex", "with complex formulas"] },
      { corr: "although the textbook was helpful.", dist: ["despite textbook was helpful.", "in spite textbook was helpful.", "because textbook helpful.", "for textbook helpful."] }
    ]},
    { prompt: "Despite feeling nervous on stage,", trans: "با وجود احساس اضطراب، او سخنرانی بسیار موثری ارائه داد.", steps: [
      { corr: "she delivered a brilliant speech", dist: ["she delivers a speech", "she delivering a speech", "she to deliver a speech", "she deliver speech"], trap: { text: "she delivers a speech", exp: "گذشته ساده delivered است." } },
      { corr: "to the international delegates", dist: ["at international delegates", "in delegates international", "for delegates international", "with international delegates"] },
      { corr: "so that everyone applauded warmly.", dist: ["in order everyone applauded.", "so everyone applaud.", "for everyone applaud.", "in order to applaud."] }
    ]},
    { prompt: "We booked the airline tickets months in advance", trans: "ما بلیط‌های پرواز را ماه‌ها قبل رزرو کردیم تا هزینه کمتری بپردازیم.", steps: [
      { corr: "so that we could get", dist: ["so that we can get", "in order we get", "for we could get", "in order to we get"], trap: { text: "so that we can get", exp: "در گذشته could get می‌آید." } },
      { corr: "the cheapest discounted fares", dist: ["fares cheapest discounted", "to discounted fares", "for fares discounted", "with discounted fares"] },
      { corr: "despite the holiday season rush.", dist: ["despite of rush.", "in spite rush holiday.", "although holiday rush.", "for holiday rush."] }
    ]}
  ],

  8: [
    { prompt: "When the detective finally arrived at the crime scene,", trans: "وقتی کارآگاه سرانجام به صحنه جرم رسید، مظنونان قبلاً گریخته بودند.", steps: [
      { corr: "the suspects had already", dist: ["the suspects have already", "suspects were already", "suspects did already", "suspects has already"], trap: { text: "the suspects have already", exp: "برای عملی که قبل از یک عمل گذشته دیگر رخ داده، گذشته کامل had already الزامی است." } },
      { corr: "fled the building", dist: ["flee the building", "fleed the building", "fleeing the building", "to flee building"], trap: { text: "fleed the building", exp: "قسمت سوم فعل بی‌قاعده flee کلمه fled است نه fleed." } },
      { corr: "through the underground tunnels.", dist: ["in underground tunnels.", "at tunnels underground.", "to underground tunnels.", "by underground tunnels."] }
    ]},
    { prompt: "By the time we reached the cinema hall,", trans: "تا زمانی که به سالن سینما رسیدیم، فیلم بیست دقیقه قبل شروع شده بود.", steps: [
      { corr: "the feature film had begun", dist: ["the film has begun", "the film began", "the film was begin", "the film has began"], trap: { text: "the film has begun", exp: "با عبارت By the time گذشته کامل had begun می‌آید." } },
      { corr: "twenty minutes earlier", dist: ["twenty minutes before", "in twenty minutes earlier", "at twenty minutes earlier", "to twenty minutes earlier"] },
      { corr: "in total auditorium darkness.", dist: ["at darkness total.", "on auditorium darkness.", "to total darkness.", "by auditorium darkness."] }
    ]},
    { prompt: "She realized with shock that she", trans: "او با شوک متوجه شد که گذرنامه‌اش را در هتل جا گذاشته است.", steps: [
      { corr: "had left her passport", dist: ["has left her passport", "left her passport", "was leaving passport", "is left passport"], trap: { text: "has left her passport", exp: "جا گذاشتن پاسپورت قبل از متوجه شدن رخ داده، پس had left درست است." } },
      { corr: "in the bedside drawer", dist: ["at bedside drawer", "on drawer bedside", "to bedside drawer", "by bedside drawer"] },
      { corr: "miles from the departure gate.", dist: ["miles of gate.", "in miles from gate.", "at gate departure.", "to departure gate."] }
    ]},
    { prompt: "David could not buy the textbook because he", trans: "دیوید نتوانست کتاب را بخرد چون کیف پولش را گم کرده بود.", steps: [
      { corr: "had lost his wallet", dist: ["has lost his wallet", "lost his wallet", "was losing wallet", "losed his wallet"], trap: { text: "has lost his wallet", exp: "علت گذشته با had lost بیان می‌شود." } },
      { corr: "on the crowded morning train", dist: ["in morning train crowded", "at train crowded morning", "to crowded train", "by morning train"] },
      { corr: "earlier that fateful day.", dist: ["in that day earlier.", "at day earlier.", "to earlier that day.", "for day earlier."] }
    ]},
    { prompt: "By the time the firefighter squad arrived,", trans: "تا زمانی که تیم آتش‌نشانی رسید، همسایه‌ها آتش را خاموش کرده بودند.", steps: [
      { corr: "the local residents had put out", dist: ["residents have put out", "residents putted out", "residents were put out", "residents has put out"], trap: { text: "residents have put out", exp: "عمل قبل‌تر با had put out بیان می‌شود." } },
      { corr: "the garden blaze safely", dist: ["blaze garden safely", "to garden blaze", "for blaze garden", "with garden blaze"] },
      { corr: "with high-pressure hoses.", dist: ["by high-pressure hoses.", "from pressure hoses.", "with hoses pressure.", "of pressure hoses."] }
    ]},
    { prompt: "She felt confident during the test because she", trans: "او در طول امتحان مطمئن بود چون مطالب را بارها مرور کرده بود.", steps: [
      { corr: "had revised all chapters", dist: ["has revised all chapters", "revised all chapters", "was revising chapters", "had revise chapters"], trap: { text: "has revised all chapters", exp: "گذشته کامل had revised صحیح است." } },
      { corr: "several times thoroughly", dist: ["several times thorough", "thoroughly several times", "in several times", "at several times"] },
      { corr: "before entering the exam hall.", dist: ["before enter hall.", "before to enter hall.", "in entering hall.", "since enter hall."] }
    ]},
    { prompt: "When they offered him the job, he", trans: "وقتی شغل را به او پیشنهاد دادند، او قبلاً قرارداد دیگری امضا کرده بود.", steps: [
      { corr: "had already signed", dist: ["has already signed", "signed already", "was already signing", "did already sign"], trap: { text: "has already signed", exp: "امضای قرارداد قبل از پیشنهاد رخ داده: had already signed." } },
      { corr: "another lucrative contract", dist: ["contract lucrative another", "to another contract", "for contract lucrative", "with another contract"] },
      { corr: "with a rival technology firm.", dist: ["by rival technology firm.", "from technology firm.", "to technology firm.", "of rival firm."] }
    ]},
    { prompt: "The streets were soaking wet because it", trans: "خیابان‌ها کاملاً خیس بودند چون ساعاتی قبل باران سیل‌آسا باریده بود.", steps: [
      { corr: "had rained heavily", dist: ["has rained heavily", "rained heavily", "was rain heavily", "is rained heavily"], trap: { text: "has rained heavily", exp: "باریدن باران قبل از خیس بودن خیابان تمام شده: had rained." } },
      { corr: "throughout the early morning hours", dist: ["in early hours", "at morning hours", "to morning hours", "by early hours"] },
      { corr: "before sunrise arrived.", dist: ["before of sunrise.", "since sunrise arrived.", "in sunrise arrived.", "at sunrise."] }
    ]},
    { prompt: "I did not recognize my old school friend because he", trans: "من دوست قدیمی‌ام را نشناختم چون ریش بلندی گذاشته بود.", steps: [
      { corr: "had grown a thick beard", dist: ["has grown a beard", "grew a beard", "was growing beard", "had grow a beard"], trap: { text: "has grown a beard", exp: "گذشته کامل had grown درست است." } },
      { corr: "and lost significant weight", dist: ["and loses weight", "and losing weight", "and to lose weight", "and losted weight"] },
      { corr: "over the intervening decade.", dist: ["in decade intervening.", "at decade intervening.", "to intervening decade.", "by decade intervening."] }
    ]},
    { prompt: "By the time the doctor reached the room,", trans: "تا زمانی که پزشک به اتاق رسید، پرستاران بیمار را پایدار کرده بودند.", steps: [
      { corr: "the nurses had stabilized", dist: ["nurses have stabilized", "nurses stabilized", "nurses were stabilize", "nurses has stabilized"], trap: { text: "nurses have stabilized", exp: "عمل قبل‌تر با had stabilized بیان می‌شود." } },
      { corr: "the elderly patient's condition", dist: ["condition patient elderly", "to patient condition", "for condition patient", "with patient condition"] },
      { corr: "with emergency oxygen.", dist: ["by emergency oxygen.", "from oxygen emergency.", "with oxygen emergency.", "of emergency oxygen."] }
    ]},
    { prompt: "She could not enter her apartment because she", trans: "او نتوانست وارد خانه شود چون کلیدهایش را داخل جا گذاشته بود.", steps: [
      { corr: "had locked the keys inside", dist: ["has locked the keys inside", "locked keys inside", "was locking keys", "had lock keys inside"], trap: { text: "has locked the keys inside", exp: "گذشته کامل had locked است." } },
      { corr: "on the living room counter", dist: ["at counter living room", "in counter living room", "to counter living room", "by counter living room"] },
      { corr: "before slamming the door.", dist: ["before slam door.", "before to slam door.", "in slamming door.", "since slam door."] }
    ]},
    { prompt: "When we visited the historical castle, the museum", trans: "وقتی از قلعه دیدن کردیم، موزه نیم ساعت قبل بسته شده بود.", steps: [
      { corr: "had already closed its gates", dist: ["has already closed gates", "closed already gates", "was already closing", "did already close"], trap: { text: "has already closed gates", exp: "بسته شدن قبل از بازدید بوده: had already closed." } },
      { corr: "to international visitors", dist: ["at international visitors", "in international visitors", "for visitors international", "by visitors international"] },
      { corr: "for the evening maintenance.", dist: ["to evening maintenance.", "in maintenance evening.", "at maintenance evening.", "with maintenance evening."] }
    ]},
    { prompt: "He failed the driver test because he", trans: "او در آزمون رانندگی رد شد چون قوانین راهنمایی را نخوانده بود.", steps: [
      { corr: "had not studied traffic rules", dist: ["has not studied rules", "did not studied rules", "was not studying rules", "had not study rules"], trap: { text: "has not studied rules", exp: "گذشته کامل منفی had not studied است." } },
      { corr: "in the official handbook", dist: ["at official handbook", "on handbook official", "to handbook official", "by handbook official"] },
      { corr: "before taking the wheel.", dist: ["before take wheel.", "before to take wheel.", "in taking wheel.", "since take wheel."] }
    ]},
    { prompt: "By the time the train finally pulled in,", trans: "تا زمانی که قطار بالاخره وارد ایستگاه شد، مسافران یخ زده بودند.", steps: [
      { corr: "the commuters had waited", dist: ["commuters have waited", "commuters waited", "commuters were waiting", "commuters has waited"], trap: { text: "commuters have waited", exp: "انتظار قبل از رسیدن قطار: had waited." } },
      { corr: "for over forty-five minutes", dist: ["since forty-five minutes", "in forty-five minutes", "at forty-five minutes", "during forty-five minutes"] },
      { corr: "on the icy platform.", dist: ["in icy platform.", "at platform icy.", "to icy platform.", "by platform icy."] }
    ]},
    { prompt: "She knew the novel's surprise ending because she", trans: "او پایان غافلگیرکننده رمان را می‌دانست چون نقد آن را خوانده بود.", steps: [
      { corr: "had read a detailed review", dist: ["has read a detailed review", "read a review have", "was reading review", "had readed review"], trap: { text: "has read a detailed review", exp: "گذشته کامل had read است." } },
      { corr: "in a literary magazine", dist: ["at literary magazine", "on magazine literary", "to literary magazine", "by magazine literary"] },
      { corr: "before buying the paperback.", dist: ["before buy paperback.", "before to buy paperback.", "in buying paperback.", "since buy paperback."] }
    ]},
    { prompt: "The plane had to return because the pilot", trans: "هواپیما مجبور شد بازگردد چون خلبان نقص فنی کشف کرده بود.", steps: [
      { corr: "had detected a technical failure", dist: ["has detected a failure", "detected a failure have", "was detecting failure", "had detect failure"], trap: { text: "has detected a failure", exp: "کشف نقص قبل از تصمیم به بازگشت: had detected." } },
      { corr: "in the hydraulic system", dist: ["at hydraulic system", "on system hydraulic", "to hydraulic system", "by hydraulic system"] },
      { corr: "shortly after initial takeoff.", dist: ["shortly takeoff initial.", "in takeoff shortly.", "at takeoff shortly.", "to takeoff shortly."] }
    ]},
    { prompt: "When they arrived at the mountain resort, the snow", trans: "وقتی به پیست اسکی رسیدند، برف به خاطر آفتاب آب شده بود.", steps: [
      { corr: "had completely melted away", dist: ["has completely melted away", "completely melted away", "was completely melting", "had melt away"], trap: { text: "has completely melted away", exp: "آب شدن قبل از رسیدن: had completely melted." } },
      { corr: "under the warm spring sun", dist: ["below warm spring sun", "in warm spring sun", "at sun spring", "to spring sun"] },
      { corr: "ruining their skiing holiday.", dist: ["ruined their skiing holiday.", "ruining of holiday.", "to ruin their holiday.", "for ruining holiday."] }
    ]},
    { prompt: "I felt completely relaxed because I", trans: "من کاملاً احساس آرامش داشتم چون تمام پروژه‌هایم را تحویل داده بودم.", steps: [
      { corr: "had submitted every project", dist: ["has submitted every project", "submitted every project", "was submitting project", "had submit project"], trap: { text: "has submitted every project", exp: "گذشته کامل had submitted است." } },
      { corr: "to the department head", dist: ["at department head", "in department head", "for head department", "with department head"] },
      { corr: "before the final deadline expired.", dist: ["before deadline expire.", "since deadline expired.", "in deadline expiring.", "to deadline expired."] }
    ]},
    { prompt: "By the time the meeting adjourned, the board", trans: "تا زمانی که جلسه به پایان رسید، هیئت مدیره توافق کرده بود.", steps: [
      { corr: "had reached unanimous agreement", dist: ["has reached agreement", "reached unanimous agreement", "was reaching agreement", "had reach agreement"], trap: { text: "has reached agreement", exp: "رسیدن به توافق قبل از پایان جلسه: had reached." } },
      { corr: "on the annual budget cuts", dist: ["in annual budget cuts", "at budget cuts", "to budget cuts", "for budget cuts"] },
      { corr: "after hours of debate.", dist: ["after debate hours.", "in debate hours.", "to hours of debate.", "with debate hours."] }
    ]},
    { prompt: "He was not hungry at dinner because he", trans: "او سر شام گرسنه نبود چون عصرانه سنگینی خورده بود.", steps: [
      { corr: "had eaten a large sandwich", dist: ["has eaten a sandwich", "ate a sandwich have", "was eating sandwich", "had ate a sandwich"], trap: { text: "had ate a sandwich", exp: "قسمت سوم eat کلمه eaten است نه ate (had eaten)." } },
      { corr: "at a nearby bakery", dist: ["in nearby bakery", "on bakery nearby", "to nearby bakery", "by nearby bakery"] },
      { corr: "just two hours earlier.", dist: ["in two hours earlier.", "at two hours earlier.", "to two hours earlier.", "for two hours earlier."] }
    ]}
  ],

  9: [
    { prompt: "Sitting quietly in the auditorium, we", trans: "در حالی که آرام در سالن نشسته بودیم، صدای سوپرانو را شنیدیم که آریای نهایی را می‌خواند.", steps: [
      { corr: "heard the talented soprano", dist: ["heard to soprano", "hearing the soprano", "hear the soprano", "heared the soprano"], trap: { text: "heard to soprano", exp: "بعد از فعل حسی heard مفعول مستقیماً بدون حرف اضافه to می‌آید." } },
      { corr: "sing the final aria", dist: ["to sing the final aria", "sang the final aria", "sings the final aria", "to singing final aria"], trap: { text: "to sing the final aria", exp: "بعد از افعال حسی مانند hear someone do something فعل اصلی به شکل ساده (bare infinitive) بدون to می‌آید." } },
      { corr: "with breathtaking emotional intensity.", dist: ["by emotional intensity.", "from emotional intensity.", "with intensity emotional.", "of emotional intensity."] }
    ]},
    { prompt: "Standing near the crosswalk, I", trans: "در حالی که نزدیک خط عابر ایستاده بودم، دیدم که خودرو از چراغ قرمز عبور کرد.", steps: [
      { corr: "saw the red car", dist: ["saw to the red car", "seeing red car", "see the red car", "seen the red car"], trap: { text: "saw to the red car", exp: "بعد از saw مفعول بدون to می‌آید." } },
      { corr: "run through the red light", dist: ["to run through red light", "ran through red light", "running to red light", "runs through red light"], trap: { text: "to run through red light", exp: "دیدن کل عمل: see someone run (بدون to)." } },
      { corr: "at high speed yesterday.", dist: ["in high speed.", "with high speed yesterday.", "on high speed.", "by speed high."] }
    ]},
    { prompt: "Walking through the forest path, they", trans: "هنگام پیاده‌روی در مسیر جنگل، آن‌ها صدای چهچهه پرندگان را شنیدند.", steps: [
      { corr: "heard wild birds", dist: ["heard to wild birds", "hearing wild birds", "hear wild birds", "heared wild birds"], trap: { text: "heard to wild birds", exp: "مفعول بدون to می‌آید." } },
      { corr: "singing in the tall trees", dist: ["to sing in tall trees", "sang in tall trees", "sings in tall trees", "to singing in trees"], trap: { text: "to sing in tall trees", exp: "برای عمل استمراری فعل با ing بدون to می‌آید (singing)." } },
      { corr: "throughout the early morning.", dist: ["in morning early.", "at early morning.", "to early morning.", "by early morning."] }
    ]},
    { prompt: "From the upstairs bedroom window, she", trans: "از پنجره اتاق طبقه بالا، او دید که غریبه‌ای وارد حیاط خلوت شد.", steps: [
      { corr: "watched a mysterious stranger", dist: ["watched to stranger", "watching stranger", "watch stranger", "watched of stranger"], trap: { text: "watched to stranger", exp: "مفعول بعد از watched بدون حرف اضافه می‌آید." } },
      { corr: "enter the secluded garden", dist: ["to enter the garden", "entered the garden", "enters the garden", "to entering garden"], trap: { text: "to enter the garden", exp: "بعد از watch someone شکل ساده enter بدون to می‌آید." } },
      { corr: "late at night.", dist: ["in night late.", "on late night.", "to late night.", "by late night."] }
    ]},
    { prompt: "While waiting at the bus stop, we", trans: "هنگام انتظار در ایستگاه، ما لرزش زمین را زیر پاهایمان احساس کردیم.", steps: [
      { corr: "felt the ground shake", dist: ["felt ground to shake", "felt ground shook", "felt ground shakes", "felt to ground shake"], trap: { text: "felt ground to shake", exp: "بعد از فعل حسی feel someone/something فعل ساده shake بدون to می‌آید." } },
      { corr: "violently for several seconds", dist: ["violent for several seconds", "in violent seconds", "at seconds violent", "with violent seconds"] },
      { corr: "during the mild tremor.", dist: ["in mild tremor.", "at tremor mild.", "to mild tremor.", "by mild tremor."] }
    ]},
    { prompt: "Looking across the crowded plaza, he", trans: "با نگاه به میدان شلوغ، او دید که کبوترها به سمت پیرمرد پرواز کردند.", steps: [
      { corr: "noticed a flock of pigeons", dist: ["noticed to pigeons", "noticing pigeons", "notice pigeons", "noticed of pigeons"], trap: { text: "noticed to pigeons", exp: "مفعول بدون to می‌آید." } },
      { corr: "fly down toward an old man", dist: ["to fly down toward man", "flew down toward man", "flying to toward man", "flies down toward man"], trap: { text: "to fly down toward man", exp: "بعد از notice someone شکل ساده fly بدون to می‌آید." } },
      { corr: "feeding them bread crumbs.", dist: ["feed them bread.", "fed them bread.", "to feed them bread.", "for feeding them."] }
    ]},
    { prompt: "Listening intently at the door, I", trans: "با گوش دادن با دقت پشت در، صدای زمزمه کردن آن‌ها را شنیدم.", steps: [
      { corr: "heard them whispering", dist: ["heard them to whisper", "heard they whisper", "heard of them whisper", "hearing them whisper"], trap: { text: "heard them to whisper", exp: "بعد از hear فعل با ing (whispering) بدون to می‌آید." } },
      { corr: "about the secret surprise party", dist: ["to surprise party", "in surprise party", "at surprise party", "for party surprise"] },
      { corr: "planned for tomorrow.", dist: ["plan for tomorrow.", "planning for tomorrow.", "to plan tomorrow.", "for plan tomorrow."] }
    ]},
    { prompt: "Through the glass door, the teacher", trans: "از پشت در شیشه‌ای، معلم دید که دانش‌آموزان به آرامی تکالیفشان را می‌نویسند.", steps: [
      { corr: "observed the students", dist: ["observed to students", "observing students", "observe students", "observed of students"], trap: { text: "observed to students", exp: "مفعول بدون to می‌آید." } },
      { corr: "write their essay drafts", dist: ["to write their drafts", "wrote their drafts", "writes their drafts", "to writing drafts"], trap: { text: "to write their drafts", exp: "بعد از observe شکل ساده write بدون to درست است." } },
      { corr: "with complete concentration.", dist: ["by complete concentration.", "from concentration.", "with concentration complete.", "of concentration."] }
    ]},
    { prompt: "Walking by the open garage, we", trans: "هنگام عبور از گاراژ، ما دیدیم که مکانیک موتور اتومبیل را تعمیر می‌کند.", steps: [
      { corr: "saw the mechanic repairing", dist: ["saw mechanic to repair", "saw mechanic repaired", "saw of mechanic repair", "seeing mechanic repair"], trap: { text: "saw mechanic to repair", exp: "دیدن در حال انجام کار: saw someone repairing." } },
      { corr: "the vintage sports car", dist: ["car vintage sports", "to sports car", "for car vintage", "with sports car"] },
      { corr: "with modern specialty tools.", dist: ["by specialty tools.", "from specialty tools.", "with tools specialty.", "of specialty tools."] }
    ]},
    { prompt: "I was sitting on the bench when I", trans: "روی نیمکت نشسته بودم که سقوط یک سیب قرمز از درخت را احساس کردم.", steps: [
      { corr: "felt a cold raindrop", dist: ["felt to a raindrop", "feeling a raindrop", "feel a raindrop", "felt of raindrop"], trap: { text: "felt to a raindrop", exp: "مفعول بدون to می‌آید." } },
      { corr: "fall onto my hand", dist: ["to fall onto my hand", "fell onto my hand", "falling to my hand", "falls onto my hand"], trap: { text: "to fall onto my hand", exp: "بعد از felt شکل ساده fall بدون to می‌آید." } },
      { corr: "signaling an incoming storm.", dist: ["signal incoming storm.", "signaled incoming storm.", "to signal storm.", "for signaling storm."] }
    ]},
    { prompt: "From the stadium bleachers, the crowd", trans: "از روی سکوهای استادیوم، تماشاگران دیدند که مهاجم گل پیروزی را به ثمر رساند.", steps: [
      { corr: "watched the striker score", dist: ["watched striker to score", "watched striker scored", "watching striker score", "watched of striker"], trap: { text: "watched striker to score", exp: "دیدن عمل کامل: watch someone score بدون to." } },
      { corr: "the decisive winning goal", dist: ["goal winning decisive", "to winning goal", "for goal winning", "with decisive goal"] },
      { corr: "in the final minute of the match.", dist: ["at final minute.", "on final minute.", "to minute final.", "by minute final."] }
    ]},
    { prompt: "Entering the kitchen, she", trans: "با ورود به آشپزخانه، او بوی سوختن نان را از داخل فر استشمام کرد.", steps: [
      { corr: "smelled the toast burning", dist: ["smelled toast to burn", "smelled of toast burning", "smelling toast burn", "smelled toast burned"], trap: { text: "smelled toast to burn", exp: "بعد از فعل حسی smell عمل در حال رخ دادن با burning بیان می‌شود." } },
      { corr: "inside the electric oven", dist: ["at electric oven", "on oven electric", "to electric oven", "by electric oven"] },
      { corr: "and quickly unplugged it.", dist: ["and unplug it.", "and unplugging it.", "and to unplug it.", "and unplugs it."] }
    ]},
    { prompt: "Standing on the coastal cliff, we", trans: "با ایستادن روی صخره ساحلی، ما شیرجه رفتن دلفین‌ها را در امواج تماشا کردیم.", steps: [
      { corr: "watched dolphins dive", dist: ["watched dolphins to dive", "watched of dolphins dive", "watching dolphins dive", "watched dolphins dived"], trap: { text: "watched dolphins to dive", exp: "عمل شیرجه زدن: watch dolphins dive بدون to." } },
      { corr: "gracefully through the waves", dist: ["graceful through waves", "in graceful waves", "at waves graceful", "to waves graceful"] },
      { corr: "under the bright midday sun.", dist: ["below sun midday.", "in midday sun.", "at sun midday.", "to midday sun."] }
    ]},
    { prompt: "While resting in bed, he", trans: "هنگام استراحت در تخت، او صدای قدم زدن کسی در راهرو را شنید.", steps: [
      { corr: "heard heavy footsteps walking", dist: ["heard footsteps to walk", "heard of footsteps walking", "hearing footsteps walk", "heard footsteps walked"], trap: { text: "heard footsteps to walk", exp: "شنیدن صدای گام‌های در حال حرکت: heard footsteps walking." } },
      { corr: "down the wooden hallway", dist: ["at hallway wooden", "in wooden hallway", "to hallway wooden", "by hallway wooden"] },
      { corr: "late in the quiet night.", dist: ["at night quiet.", "on quiet night.", "to night quiet.", "by night quiet."] }
    ]},
    { prompt: "From the balcony, Sarah", trans: "از روی بالکن، سارا دید که دو پرنده زیبا روی نرده‌ها نشستند.", steps: [
      { corr: "saw two hummingbirds land", dist: ["saw two hummingbirds to land", "saw of birds land", "seeing birds land", "saw birds landed"], trap: { text: "saw two hummingbirds to land", exp: "دیدن لحظه فرود: saw birds land بدون to." } },
      { corr: "on the flowering plant", dist: ["at flowering plant", "in plant flowering", "to flowering plant", "by plant flowering"] },
      { corr: "to drink sweet nectar.", dist: ["for drink nectar.", "drinking sweet nectar.", "in drinking nectar.", "to drinking nectar."] }
    ]},
    { prompt: "While walking home, I", trans: "هنگام پیاده‌روی به خانه، متوجه شدم که یک سگ کوچک من را دنبال می‌کند.", steps: [
      { corr: "noticed a stray puppy following", dist: ["noticed puppy to follow", "noticed of puppy follow", "noticing puppy follow", "noticed puppy followed"], trap: { text: "noticed puppy to follow", exp: "دیدن در حال تعقیب: noticed puppy following." } },
      { corr: "behind me on the sidewalk", dist: ["after me on sidewalk", "in sidewalk behind", "at sidewalk behind", "to sidewalk behind"] },
      { corr: "with wagging tail.", dist: ["by wagging tail.", "from wagging tail.", "of wagging tail.", "with tail wagging."] }
    ]},
    { prompt: "The security guard", trans: "نگهبان دید که دو فرد مشکوک سعی کردند از در پشتی خارج شوند.", steps: [
      { corr: "observed two individuals attempt", dist: ["observed individuals to attempt", "observed of individuals attempt", "observing individuals attempt", "observed individuals attempted"], trap: { text: "observed individuals to attempt", exp: "دیدن اقدام: observed someone attempt بدون to." } },
      { corr: "to open the emergency exit", dist: ["opening emergency exit", "open emergency exit", "to opening exit", "for open exit"] },
      { corr: "before sounding the alarm.", dist: ["before sound alarm.", "before to sound alarm.", "in sounding alarm.", "since sound alarm."] }
    ]},
    { prompt: "Sitting by the calm lake, we", trans: "کنار دریاچه آرام نشسته بودیم که پریدن یک ماهی بزرگ از آب را دیدیم.", steps: [
      { corr: "watched a silver fish leap", dist: ["watched fish to leap", "watched of fish leap", "watching fish leap", "watched fish leaped"], trap: { text: "watched fish to leap", exp: "دیدن جهش ماهی: watch a fish leap بدون to." } },
      { corr: "high out of the water", dist: ["high of the water", "in water high", "at water high", "to water high"] },
      { corr: "creating circular ripples.", dist: ["creates circular ripples.", "created circular ripples.", "to create ripples.", "for creating ripples."] }
    ]},
    { prompt: "From the cafe terrace, they", trans: "از تراس کافه، آن‌ها صدای پیانو زدن نوازنده خیابانی را شنیدند.", steps: [
      { corr: "heard an artist play", dist: ["heard artist to play", "heard of artist play", "hearing artist play", "heard artist played"], trap: { text: "heard artist to play", exp: "شنیدن نواختن: heard artist play بدون to." } },
      { corr: "classical melodies on a violin", dist: ["melodies on violin classical", "to classical melodies", "for melodies classical", "with classical melodies"] },
      { corr: "for the gathered passersby.", dist: ["to gathered passersby.", "in gathered passersby.", "at passersby gathered.", "by passersby gathered."] }
    ]},
    { prompt: "In the quiet library, everyone", trans: "در کتابخانه ساکت، همه صدای افتادن یک کتاب سنگین روی زمین را شنیدند.", steps: [
      { corr: "heard a heavy dictionary drop", dist: ["heard dictionary to drop", "heard of dictionary drop", "hearing dictionary drop", "heard dictionary dropped"], trap: { text: "heard dictionary to drop", exp: "شنیدن صدای افتادن لحظه‌ای: heard dictionary drop بدون to." } },
      { corr: "onto the wooden floor", dist: ["in wooden floor", "at wooden floor", "to wooden floor", "by wooden floor"] },
      { corr: "with an echoing thud.", dist: ["by echoing thud.", "from echoing thud.", "of echoing thud.", "with thud echoing."] }
    ]}
  ],

  10: [
    { prompt: "If she had not studied so diligently, she", trans: "اگر او این‌قدر کوشا درس نخوانده بود، بورسیه دانشگاهی را به دست نمی‌آورد.", steps: [
      { corr: "would not have obtained", dist: ["will not have obtained", "would not obtain", "had not obtained", "can not have obtained"], trap: { text: "would not obtain", exp: "در شرایط ترکیبی گذشته با گذشته کامل، جواب شرط نوع سوم would not have obtained است." } },
      { corr: "the prestigious international scholarship", dist: ["scholarship international prestigious", "to international scholarship", "for scholarship prestigious", "with prestigious scholarship"] },
      { corr: "to study medicine abroad.", dist: ["for study medicine.", "in studying medicine.", "to studying medicine.", "for medicine study."] }
    ]},
    { prompt: "By the time the keynote speaker concluded, the audience", trans: "تا زمانی که سخنران اصلی سخنرانی را به پایان رساند، حضار کاملاً به وجد آمده بودند.", steps: [
      { corr: "had already given", dist: ["has already given", "gave already", "was already giving", "did already give"], trap: { text: "has already given", exp: "عمل قبل از پایان با had already given بیان می‌شود." } },
      { corr: "a standing ovation", dist: ["an ovation standing", "to standing ovation", "for ovation standing", "with standing ovation"] },
      { corr: "in recognition of his vision.", dist: ["at recognition of vision.", "to recognition of vision.", "by recognition of vision.", "for recognition."] }
    ]},
    { prompt: "Although the weather conditions were deteriorating, the flight crew", trans: "اگرچه شرایط جوی رو به وخامت بود، کادر پرواز موفق شد هواپیما را بنشاند.", steps: [
      { corr: "managed to land the aircraft", dist: ["managing to land aircraft", "manages to land aircraft", "to manage to land aircraft", "managed land aircraft to"], trap: { text: "managing to land aircraft", exp: "فعل اصلی گذشته managed to land است." } },
      { corr: "safely on the runway", dist: ["safe on the runway", "at runway safely", "in runway safely", "by runway safely"] },
      { corr: "so that all passengers were unharmed.", dist: ["in order passengers unharmed.", "for passengers unharmed.", "so passengers unharmed.", "in order to unharmed."] }
    ]},
    { prompt: "Looking down from the hill, we", trans: "با نگاه از بالای تپه، ما دیدیم که قطار سریع‌السیر از دره عبور کرد.", steps: [
      { corr: "saw the express train cross", dist: ["saw train to cross", "saw of train cross", "seeing train cross", "saw train crossed"], trap: { text: "saw train to cross", exp: "دیدن عبور کامل قطار: saw train cross بدون to." } },
      { corr: "the expansive valley viaduct", dist: ["viaduct valley expansive", "to expansive viaduct", "for viaduct valley", "with expansive viaduct"] },
      { corr: "at tremendous speed.", dist: ["in tremendous speed.", "with tremendous speed.", "on speed tremendous.", "by tremendous speed."] }
    ]},
    { prompt: "She explained to her colleagues that she", trans: "او به همکارانش توضیح داد که به زودی به شعبه توکیو منتقل خواهد شد.", steps: [
      { corr: "would be transferred", dist: ["will be transferred", "is transferred", "would transferred", "will transferred"], trap: { text: "will be transferred", exp: "در نقل قول غیرمستقیم will be transferred به would be transferred تبدیل می‌شود." } },
      { corr: "to the Tokyo headquarters", dist: ["at Tokyo headquarters", "in headquarters Tokyo", "for headquarters Tokyo", "with Tokyo headquarters"] },
      { corr: "within the coming month.", dist: ["at coming month.", "in coming month within.", "for coming month.", "by month coming."] }
    ]},
    { prompt: "Despite their initial disagreements, both parties", trans: "با وجود اختلافات اولیه، هر دو طرف توانستند بر سر شرایط اصلی توافق کنند.", steps: [
      { corr: "agreed to compromise on terms", dist: ["agree to compromise on terms", "agreeing to compromise", "agreed compromise terms", "agreed to compromising"], trap: { text: "agreed to compromising", exp: "بعد از agree مصدر to compromise می‌آید." } },
      { corr: "of the commercial partnership", dist: ["in commercial partnership", "at partnership commercial", "to partnership commercial", "by commercial partnership"] },
      { corr: "in order to avoid arbitration.", dist: ["so that avoid arbitration.", "for avoid arbitration.", "in order avoid arbitration.", "so to avoid."] }
    ]},
    { prompt: "He has been working on this novel for years, and he", trans: "او سال‌هاست روی این رمان کار می‌کند و اکنون فصل آخر را تمام کرده است.", steps: [
      { corr: "has finally completed", dist: ["has finally been completing", "is finally completing", "finally completed has", "completes finally"], trap: { text: "has finally been completing", exp: "پایان یافتن نتیجه قطعی: has finally completed." } },
      { corr: "the culminating chapter", dist: ["chapter culminating", "to culminating chapter", "for chapter culminating", "with culminating chapter"] },
      { corr: "of his literary masterpiece.", dist: ["in literary masterpiece.", "at masterpiece literary.", "to masterpiece literary.", "by literary masterpiece."] }
    ]},
    { prompt: "If you had not turned off the stove,", trans: "اگر اجاق گاز را خاموش نکرده بودی، آشپزخانه دچار آتش‌سوزی می‌شد.", steps: [
      { corr: "the entire kitchen would have", dist: ["kitchen will have", "kitchen had have", "kitchen would have been caught", "kitchen would catch"], trap: { text: "kitchen will have", exp: "در شرطی نوع سوم would have الزامی است." } },
      { corr: "caught fire instantly", dist: ["catch fire instantly", "catched fire instantly", "catching fire instantly", "to catch fire"], trap: { text: "catched fire instantly", exp: "قسمت سوم catch کلمه caught است." } },
      { corr: "causing severe structural destruction.", dist: ["cause severe destruction.", "caused severe destruction.", "to cause destruction.", "for causing destruction."] }
    ]},
    { prompt: "Before she left for the university, she made sure to", trans: "قبل از این که به دانشگاه برود، مطمئن شد که مدارکش را برداشته است.", steps: [
      { corr: "pick up her documents", dist: ["pick off her documents", "pick out her documents", "pick down documents", "pick in her documents"], trap: { text: "pick off her documents", exp: "برداشتن وسایل pick up است." } },
      { corr: "from the study desk", dist: ["of study desk", "in study desk", "at desk study", "to study desk"] },
      { corr: "to avoid being unprepared.", dist: ["for avoid unprepared.", "in avoiding unprepared.", "to avoiding unprepared.", "for unprepared avoid."] }
    ]},
    { prompt: "While walking along the riverbank, we", trans: "هنگام قدم زدن در امتداد رودخانه، ما پرواز عقابی بر فراز آب را تماشا کردیم.", steps: [
      { corr: "watched a magnificent eagle soar", dist: ["watched eagle to soar", "watched of eagle soar", "watching eagle soar", "watched eagle soared"], trap: { text: "watched eagle to soar", exp: "دیدن اوج‌گیری پرنده: watch someone soar بدون to." } },
      { corr: "above the deep water", dist: ["in deep water", "at deep water", "to deep water", "by deep water"] },
      { corr: "hunting for fresh fish.", dist: ["hunt for fresh fish.", "hunted for fresh fish.", "to hunt fresh fish.", "for hunting fish."] }
    ]},
    { prompt: "Although he had never lived abroad, he", trans: "اگرچه هرگز در خارج زندگی نکرده بود، زبان انگلیسی را فوق‌العاده صحبت می‌کرد.", steps: [
      { corr: "spoke the language fluently", dist: ["speaks the language fluently", "speaking the language", "to speak language fluently", "spoken the language"], trap: { text: "speaks the language fluently", exp: "فعل گذشته ساده spoke درست است." } },
      { corr: "with natural pronunciation", dist: ["by natural pronunciation", "from pronunciation natural", "with pronunciation natural", "of natural pronunciation"] },
      { corr: "having practiced every day.", dist: ["have practiced every day.", "had practiced every day.", "to practice every day.", "for practicing day."] }
    ]},
    { prompt: "The committee announced that the modern campus", trans: "کمیته اعلام کرد که پردیس مدرن دانشگاه تا پاییز آینده ساخته خواهد شد.", steps: [
      { corr: "would be constructed", dist: ["will be constructed", "is constructed", "would constructed", "will constructed"], trap: { text: "will be constructed", exp: "نقل قول گذشته: would be constructed." } },
      { corr: "on the city outskirts", dist: ["in city outskirts", "at outskirts city", "to city outskirts", "by city outskirts"] },
      { corr: "to accommodate more students.", dist: ["for accommodate students.", "in accommodating students.", "to accommodating students.", "for students accommodate."] }
    ]},
    { prompt: "She has been practicing violin since childhood, and she", trans: "او از کودکی ویولن تمرین کرده و اکنون در یک ارکستر بین‌المللی می‌نوازد.", steps: [
      { corr: "has won prestigious awards", dist: ["has been winning awards", "wins prestigious awards", "won awards have", "is winning awards"], trap: { text: "has been winning awards", exp: "کسب جوایز دستاورد تکمیل‌شده است: has won." } },
      { corr: "in classical competitions", dist: ["at classical competitions", "on competitions classical", "to classical competitions", "by classical competitions"] },
      { corr: "across the European continent.", dist: ["in European continent.", "at continent European.", "to European continent.", "by European continent."] }
    ]},
    { prompt: "If you had warned me about the schedule change,", trans: "اگر در مورد تغییر برنامه به من هشدار داده بودی، من زودتر بیدار می‌شدم.", steps: [
      { corr: "I would have set my alarm", dist: ["I will have set alarm", "I would set my alarm", "I had set my alarm", "I can have set alarm"], trap: { text: "I will have set alarm", exp: "در شرطی نوع سوم would have set درست است." } },
      { corr: "for an earlier hour", dist: ["in an earlier hour", "at earlier hour", "to earlier hour", "by earlier hour"] },
      { corr: "to catch the morning train.", dist: ["for catch morning train.", "in catching train.", "to catching train.", "for train morning catch."] }
    ]},
    { prompt: "He could not unlock the front entrance because he", trans: "او نتوانست در ورودی را باز کند چون دسته کلیدش را در اداره جا گذاشته بود.", steps: [
      { corr: "had misplaced his key ring", dist: ["has misplaced key ring", "misplaced key ring have", "was misplacing key ring", "had misplace key ring"], trap: { text: "has misplaced key ring", exp: "عمل قبل‌تر با had misplaced بیان می‌شود." } },
      { corr: "on his corporate desk", dist: ["in corporate desk", "at desk corporate", "to corporate desk", "by corporate desk"] },
      { corr: "before rushing to catch the bus.", dist: ["before rush to bus.", "before to rush bus.", "in rushing bus.", "since rush bus."] }
    ]},
    { prompt: "Despite experiencing severe technical difficulties, the pilot", trans: "با وجود مشکلات شدید فنی، خلبان موفق شد هواپیما را فرود آورد.", steps: [
      { corr: "brought the aircraft down", dist: ["bring aircraft down", "bringing aircraft down", "to bring aircraft down", "brought down aircraft to"], trap: { text: "bring aircraft down", exp: "گذشته ساده brought down است." } },
      { corr: "on the emergency runway", dist: ["in emergency runway", "at runway emergency", "to emergency runway", "by emergency runway"] },
      { corr: "without causing any injuries.", dist: ["without cause injuries.", "without to cause injuries.", "in causing injuries.", "for injuries cause."] }
    ]},
    { prompt: "We listened attentively and", trans: "ما با دقت گوش دادیم و شنیدیم که قطار در دوردست سوت می‌کشد.", steps: [
      { corr: "heard the distant train whistle", dist: ["heard to distant train whistle", "hearing train whistle", "hear the train whistle", "heared the train whistle"], trap: { text: "heard to distant train whistle", exp: "مفعول بدون to می‌آید." } },
      { corr: "echoing through the valley", dist: ["echo through valley", "echoed through valley", "to echo through valley", "to echoing through valley"], trap: { text: "to echo through valley", exp: "صدای ممتد سوت: echoing." } },
      { corr: "in the chilly morning air.", dist: ["at chilly morning air.", "on morning air chilly.", "to chilly morning air.", "by morning air."] }
    ]},
    { prompt: "The spokesperson confirmed that all victims", trans: "سخنگو تأیید کرد که تمام قربانیان به بیمارستان منتقل شده‌اند.", steps: [
      { corr: "had been transported safely", dist: ["have been transported", "were transport safely", "had transport safely", "are transported"], trap: { text: "have been transported", exp: "نقل قول گذشته: had been transported." } },
      { corr: "to the regional hospital", dist: ["at regional hospital", "in regional hospital", "for hospital regional", "with regional hospital"] },
      { corr: "by emergency medical teams.", dist: ["from medical teams.", "with medical teams.", "of medical teams.", "to medical teams."] }
    ]},
    { prompt: "If they offered her the fellowship, she", trans: "اگر آن‌ها بورسیه را به او پیشنهاد دهند، او فوراً آن را خواهد پذیرفت.", steps: [
      { corr: "would accept without hesitation", dist: ["will accept without hesitation", "had accept hesitation", "can accept without hesitation", "accepted without hesitation"], trap: { text: "will accept without hesitation", exp: "شرطی نوع دوم would accept است." } },
      { corr: "the generous research grant", dist: ["grant research generous", "to research grant", "for grant research", "with research grant"] },
      { corr: "to pursue her doctoral thesis.", dist: ["for pursue thesis.", "in pursuing thesis.", "to pursuing thesis.", "for thesis pursue."] }
    ]},
    { prompt: "She looked around the room and", trans: "او به اطراف اتاق نگاه کرد و دید که پرده‌ها در نسیم تکان می‌خورند.", steps: [
      { corr: "saw the white curtains flutter", dist: ["saw curtains to flutter", "saw of curtains flutter", "seeing curtains flutter", "saw curtains fluttered"], trap: { text: "saw curtains to flutter", exp: "دیدن تکان خوردن پرده: saw curtains flutter بدون to." } },
      { corr: "in the evening breeze", dist: ["at evening breeze", "on evening breeze", "to evening breeze", "by evening breeze"] },
      { corr: "cooling the quiet room.", dist: ["cool the quiet room.", "cooled quiet room.", "to cool quiet room.", "for cooling room."] }
    ]}
  ]
};
