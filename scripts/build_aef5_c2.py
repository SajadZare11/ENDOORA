# -*- coding: utf-8 -*-
"""
American English File 5 - Tier C2 Grammar Specs (Complete 10 Stages x 20 Sentences = 200 Sentences)
Strict atomic granularity: 1-2 words per step (max 3 short words).
All sentences are natural, communicative, advanced English from AEF 5 curriculum.
"""

def s(prompt, trans, steps):
    return {"prompt": prompt, "trans": trans, "steps": steps}

c2_data = {}

# ==============================================================================
# Stage C2.1: Locative & Directional Inversion
# Down the road walked, Into the room stepped, On the hill stood
# ==============================================================================
c2_data["1"] = [
    s("Down the road", "پیرمردی با یک عصای چوبی در امتداد جاده قدم می‌زد.", [
        {"corr": "walked", "dist": ["walk", "walking", "was walked", "did walk"], "trap": {"text": "did walk", "exp": "در وارونگی مکانی (Locative Inversion) فعل اصلی مستقیماً قبل از فاعل می‌آید و فعل کمکی did به کار نمی‌رود."}},
        {"corr": "an old man", "dist": ["old man an", "the old man", "an man old", "old an man"]},
        {"corr": "with a wooden", "dist": ["by a wooden", "in a wooden", "with wooden a", "at a wooden"]},
        {"corr": "cane", "dist": ["canes", "a cane", "caning", "to cane"]},
        {"corr": "quietly.", "dist": ["quiet.", "in quiet.", "with quiet.", "quietness."]}
    ]),
    s("Into the room", "معلم با لبخندی گرم بر لب وارد اتاق شد.", [
        {"corr": "stepped", "dist": ["step", "stepping", "did step", "steps"]},
        {"corr": "the teacher", "dist": ["teacher the", "a teacher", "the teachers", "to teacher"]},
        {"corr": "with a warm", "dist": ["by a warm", "in a warm", "with warm a", "at a warm"]},
        {"corr": "smile", "dist": ["smiles", "smiling", "smiled", "to smile"]},
        {"corr": "for everyone.", "dist": ["at everyone.", "with everyone.", "to everyone.", "by everyone."]}
    ]),
    s("On the hill", "کلبه چوبی کوچکی با نمایی زیبا روی تپه قرار داشت.", [
        {"corr": "stood", "dist": ["stand", "standing", "was stood", "did stand"]},
        {"corr": "a small wooden", "dist": ["small a wooden", "a wooden small", "the small wooden", "small wooden a"]},
        {"corr": "cabin", "dist": ["cabins", "cabined", "cabining", "to cabin"]},
        {"corr": "overlooking", "dist": ["overlooked", "overlooks", "to overlook", "overlook"]},
        {"corr": "the valley.", "dist": ["valley the.", "a valley.", "valleys the.", "to valley."]}
    ]),
    s("Out of the fog", "کشتی باری بزرگی به آرامی از میان مه پدیدار شد.", [
        {"corr": "appeared", "dist": ["appear", "appearing", "did appear", "appears"]},
        {"corr": "a giant cargo", "dist": ["giant a cargo", "a cargo giant", "the giant cargo", "cargo giant a"]},
        {"corr": "ship", "dist": ["ships", "shipped", "shipping", "to ship"]},
        {"corr": "moving", "dist": ["moved", "move", "moves", "to move"]},
        {"corr": "very slowly.", "dist": ["slowly very.", "very slow.", "much slowly.", "so slow."]}
    ]),
    s("Around the corner", "دوچرخه‌سوار جوانی با سرعت از پیچ خیابان گذشت.", [
        {"corr": "sped", "dist": ["speed", "speeding", "did speed", "speeds"]},
        {"corr": "a young", "dist": ["young a", "the young", "an young", "to young"]},
        {"corr": "cyclist", "dist": ["cyclists", "cycling", "cycled", "to cyclist"]},
        {"corr": "in a red", "dist": ["at a red", "with a red", "in red a", "on a red"]},
        {"corr": "jacket.", "dist": ["jackets.", "jacketed.", "jacketing.", "to jacket."]}
    ]),
    s("Across the river", "پل سنگی باریکی از روی رودخانه کشیده شده بود.", [
        {"corr": "lay", "dist": ["laid", "lying", "lie", "layed"], "trap": {"text": "laid", "exp": "گذشته فعل قرار داشتن/امتداد یافتن (lie) کلمه lay است؛ laid گذشته فعل گذاشتن (lay) است."}},
        {"corr": "a narrow stone", "dist": ["narrow a stone", "a stone narrow", "the narrow stone", "stone narrow a"]},
        {"corr": "bridge", "dist": ["bridges", "bridged", "bridging", "to bridge"]},
        {"corr": "built", "dist": ["building", "build", "builds", "was built"]},
        {"corr": "years ago.", "dist": ["years before.", "ago years.", "since years.", "for years."]}
    ]),
    s("Up the stairs", "پسربچه با عجله از پله‌ها بالا دوید.", [
        {"corr": "ran", "dist": ["run", "running", "did run", "runs"]},
        {"corr": "the little boy", "dist": ["little boy the", "the boy little", "a little boy", "boy little the"]},
        {"corr": "holding", "dist": ["held", "hold", "holds", "to hold"]},
        {"corr": "his new", "dist": ["new his", "the his new", "a new his", "to new"]},
        {"corr": "toy car.", "dist": ["car toy.", "toy cars.", "the toy car.", "a car toy."]}
    ]),
    s("Behind the sofa", "گربه کوچکی پشت مبل قایم شده بود.", [
        {"corr": "sat", "dist": ["sit", "sitting", "did sit", "sits"]},
        {"corr": "a tiny black", "dist": ["tiny a black", "a black tiny", "the tiny black", "black tiny a"]},
        {"corr": "cat", "dist": ["cats", "catting", "catted", "to cat"]},
        {"corr": "hiding from", "dist": ["hide from", "hidden from", "hides from", "to hide from"]},
        {"corr": "the dog.", "dist": ["dog the.", "a dog.", "dogs the.", "to dog."]}
    ]),
    s("Through the window", "پرتوهای درخشان خورشید صبحگاهی از پنجره به داخل تابید.", [
        {"corr": "shone", "dist": ["shine", "shining", "shined", "did shine"]},
        {"corr": "the morning", "dist": ["morning the", "a morning", "the mornings", "to morning"]},
        {"corr": "sunlight", "dist": ["sunlights", "sunlighting", "sunlit", "to sunlight"]},
        {"corr": "warming", "dist": ["warm", "warmed", "warms", "to warm"]},
        {"corr": "the room.", "dist": ["room the.", "a room.", "rooms the.", "to room."]}
    ]),
    s("Under the tree", "سگ قهوه‌ای وفاداری زیر درخت استراحت می‌کرد.", [
        {"corr": "rested", "dist": ["rest", "resting", "did rest", "rests"]},
        {"corr": "the faithful", "dist": ["faithful the", "a faithful", "the faithfulness", "faithfully the"]},
        {"corr": "dog", "dist": ["dogs", "dogging", "dogged", "to dog"]},
        {"corr": "in the cool", "dist": ["at the cool", "with cool the", "on the cool", "for cool the"]},
        {"corr": "shade.", "dist": ["shadow.", "shades.", "shading.", "to shade."]}
    ]),
    s("Along the path", "ردیف منظمی از گل‌های رنگارنگ در امتداد مسیر روییده بود.", [
        {"corr": "grew", "dist": ["grow", "growing", "grown", "did grow"]},
        {"corr": "wild flowers", "dist": ["flowers wild", "the wild flowers", "a wild flowers", "wild flower"]},
        {"corr": "blooming", "dist": ["bloom", "bloomed", "blooms", "to bloom"]},
        {"corr": "in the bright", "dist": ["at the bright", "with bright the", "on the bright", "for bright the"]},
        {"corr": "sun.", "dist": ["sunlight.", "suns.", "sunny.", "to sun."]}
    ]),
    s("At the gates", "دو نگهبان یونیفورم‌پوش دم در ایستاده بودند.", [
        {"corr": "stood", "dist": ["stand", "standing", "was stood", "did stand"]},
        {"corr": "two uniformed", "dist": ["uniformed two", "the two uniformed", "two of uniformed", "two uniforms"]},
        {"corr": "guards", "dist": ["guard", "guarding", "guarded", "to guard"]},
        {"corr": "watching", "dist": ["watched", "watch", "watches", "to watch"]},
        {"corr": "the entrance.", "dist": ["entrance the.", "an entrance.", "entrances the.", "to entrance."]}
    ]),
    s("Above the clouds", "هواپیمای مسافربری نقره‌ای بر فراز ابرها پرواز می‌کرد.", [
        {"corr": "flew", "dist": ["fly", "flying", "flown", "did fly"]},
        {"corr": "the silver", "dist": ["silver the", "a silver", "the silvers", "to silver"]},
        {"corr": "airplane", "dist": ["airplanes", "airplaned", "airplaning", "to airplane"]},
        {"corr": "heading", "dist": ["head", "headed", "heads", "to head"]},
        {"corr": "for London.", "dist": ["to London.", "at London.", "in London.", "with London."]}
    ]),
    s("Between the trees", "برکه فیروزه‌ای زلالی میان درختان پنهان شده بود.", [
        {"corr": "lay", "dist": ["laid", "lying", "lie", "layed"]},
        {"corr": "a clear blue", "dist": ["clear a blue", "a blue clear", "the clear blue", "blue clear a"]},
        {"corr": "pond", "dist": ["ponds", "ponded", "ponding", "to pond"]},
        {"corr": "reflecting", "dist": ["reflected", "reflect", "reflects", "to reflect"]},
        {"corr": "the sky.", "dist": ["sky the.", "a sky.", "skies the.", "to sky."]}
    ]),
    s("Before the crowd", "سخنران اصلی همراه با یادداشت‌هایش روبه‌روی جمعیت ایستاد.", [
        {"corr": "stood", "dist": ["stand", "standing", "was stood", "did stand"]},
        {"corr": "the speaker", "dist": ["speaker the", "a speaker", "the speakers", "to speaker"]},
        {"corr": "ready to give", "dist": ["ready giving", "ready for give", "ready to giving", "give ready to"]},
        {"corr": "his opening", "dist": ["opening his", "the his opening", "a opening his", "he opening"]},
        {"corr": "speech.", "dist": ["speeches.", "speaking.", "spoke.", "to speech."]}
    ]),
    s("From the dark", "مردی قدبلند در لباسی تیره از تاریکی خارج شد.", [
        {"corr": "emerged", "dist": ["emerge", "emerging", "did emerge", "emerges"]},
        {"corr": "a tall figure", "dist": ["tall a figure", "a figure tall", "the tall figure", "figure tall a"]},
        {"corr": "wearing", "dist": ["wore", "worn", "wears", "to wear"]},
        {"corr": "a heavy black", "dist": ["heavy a black", "a black heavy", "the heavy black", "black heavy a"]},
        {"corr": "coat.", "dist": ["coats.", "coated.", "coating.", "to coat."]}
    ]),
    s("Near the lake", "گروهی از مسافران خسته نزدیک دریاچه اتراق کردند.", [
        {"corr": "camped", "dist": ["camp", "camping", "did camp", "camps"]},
        {"corr": "a group of", "dist": ["group a of", "a group in", "the group of", "group of a"]},
        {"corr": "tired hikers", "dist": ["hikers tired", "the tired hikers", "a tired hikers", "hiker tired"]},
        {"corr": "resting for", "dist": ["rest for", "rested for", "rests for", "to rest for"]},
        {"corr": "the night.", "dist": ["night the.", "a night.", "nights the.", "to night."]}
    ]),
    s("On the desk", "دسته بزرگی از نامه‌های خوانده‌نشده روی میز کار قرار داشت.", [
        {"corr": "lay", "dist": ["laid", "lying", "lie", "layed"]},
        {"corr": "a pile of", "dist": ["pile a of", "a pile in", "the pile of", "pile of a"]},
        {"corr": "unread letters", "dist": ["letters unread", "the unread letters", "an unread letters", "unread letter"]},
        {"corr": "waiting to be", "dist": ["waiting be", "waited to be", "waiting to been", "to wait be"]},
        {"corr": "answered.", "dist": ["answer.", "answering.", "answers.", "to answer."]}
    ]),
    s("Toward the sea", "رودخانه خروشانی به سمت دریا جاری بود.", [
        {"corr": "flowed", "dist": ["flow", "flowing", "did flow", "flows"]},
        {"corr": "the mighty mountain", "dist": ["mighty mountain the", "the mountain mighty", "a mighty mountain", "mountain mighty the"]},
        {"corr": "river", "dist": ["rivers", "rivered", "rivering", "to river"]},
        {"corr": "carrying", "dist": ["carried", "carry", "carries", "to carry"]},
        {"corr": "fresh water.", "dist": ["water fresh.", "a fresh water.", "the fresh water.", "freshly water."]}
    ]),
    s("By the fire", "مادربزرگ مهربان کنار آتش شال‌گردن می‌بافت.", [
        {"corr": "sat", "dist": ["sit", "sitting", "did sit", "sits"]},
        {"corr": "the kind old", "dist": ["kind old the", "the old kind", "a kind old", "old kind the"]},
        {"corr": "grandmother", "dist": ["grandmothers", "grandmotherly", "a grandmother", "the grandmother"]},
        {"corr": "knitting", "dist": ["knit", "knitted", "knits", "to knit"]},
        {"corr": "a wool scarf.", "dist": ["wool a scarf.", "a scarf wool.", "scarf wool a.", "the wool scarf."]}
    ])
]

# ==============================================================================
# Stage C2.2: Fixed & Formulaic Subjunctive
# Be that as it may, Come what may, Suffice it to say, Far be it from me
# ==============================================================================
c2_data["2"] = [
    s("Be that", "هر چه که باشد، ما باید به تعهدات خود پایبند بمانیم.", [
        {"corr": "as it may,", "dist": ["as it might,", "so it may,", "as may it,", "like it may,"]},
        {"corr": "we must honor", "dist": ["we should honor", "honor we must", "we must to honor", "must we honor"]},
        {"corr": "our promise", "dist": ["promise our", "the our promise", "a promise our", "to promise"]},
        {"corr": "to the team", "dist": ["at the team", "with the team", "for team the", "in team the"]},
        {"corr": "without delay.", "dist": ["with no delay.", "with not delay.", "except delay.", "unless delay."]}
    ]),
    s("Come what", "هر چه پیش آید، من همیشه کنارت خواهم ماند.", [
        {"corr": "may,", "dist": ["might,", "can,", "will,", "could,"]},
        {"corr": "I will stand", "dist": ["I would stand", "stand I will", "I stand will", "I am stand"]},
        {"corr": "by you", "dist": ["with you", "at you", "to you", "for you"]},
        {"corr": "through every", "dist": ["in every", "at every", "with every", "for every"]},
        {"corr": "hardship.", "dist": ["hard.", "hardly.", "hardness.", "in hard."]}
    ]),
    s("Suffice it", "کافی است بگوییم که سفر ما پر از شگفتی بود.", [
        {"corr": "to say that", "dist": ["saying that", "to said that", "that to say", "to say which"]},
        {"corr": "our trip was", "dist": ["our trip were", "was our trip", "trip our was", "our trip is"]},
        {"corr": "full of joyful", "dist": ["full with joyful", "filled of joyful", "full of joyfully", "joyful full of"]},
        {"corr": "surprises", "dist": ["surprise", "surprised", "surprising", "to surprise"]},
        {"corr": "for everyone.", "dist": ["at everyone.", "with everyone.", "to everyone.", "by everyone."]}
    ]),
    s("Far be it", "دور از من است که درباره کار او قضاوت کنم.", [
        {"corr": "from me to", "dist": ["of me to", "with me to", "at me to", "by me to"]},
        {"corr": "criticize", "dist": ["criticized", "criticizing", "criticizes", "to criticize"]},
        {"corr": "her hard work", "dist": ["hard work her", "the her hard work", "a hard work her", "she hard work"]},
        {"corr": "on this important", "dist": ["in this important", "at this important", "with important this", "for this important"]},
        {"corr": "project.", "dist": ["projects.", "projected.", "projecting.", "to project."]}
    ]),
    s("Heaven forbid", "خدا نکند که قطار را از دست بدهیم.", [
        {"corr": "that we", "dist": ["which we", "what we", "if we", "we that"]},
        {"corr": "miss the train", "dist": ["missed the train", "missing train the", "miss train the", "to miss train"]},
        {"corr": "and have to", "dist": ["and had to", "and having to", "to have to and", "and must to"]},
        {"corr": "wait here", "dist": ["here wait", "waiting here", "waited here", "to wait here"]},
        {"corr": "in the cold.", "dist": ["at the cold.", "on cold the.", "with cold the.", "for cold."]}
    ]),
    s("So be", "اگر این تصمیمی است که گرفته‌اید، بگذار چنین باشد.", [
        {"corr": "it, then,", "dist": ["it, so,", "it, as,", "it, like,", "it, if,"]},
        {"corr": "if that is", "dist": ["if it is", "if that was", "is that if", "if is that"]},
        {"corr": "what you have", "dist": ["that you have", "which you have", "what have you", "what you had"]},
        {"corr": "decided to do", "dist": ["decide to do", "deciding to do", "decided doing", "to decide to do"]},
        {"corr": "together.", "dist": ["in together.", "with together.", "togetherly.", "at together."]}
    ]),
    s("Be that", "هر چه که باشد، ما چاره‌ای جز پذیرش نتایج نداریم.", [
        {"corr": "as it may,", "dist": ["as it might,", "so it may,", "as may it,", "like it may,"]},
        {"corr": "we have to", "dist": ["we had to", "have we to", "we must to", "we having to"]},
        {"corr": "accept the facts", "dist": ["accept facts the", "accepted the facts", "accepting the facts", "facts accept the"]},
        {"corr": "as they are", "dist": ["as they were", "like they are", "how they are", "so they are"]},
        {"corr": "now.", "dist": ["at now.", "in now.", "on now.", "by now."]}
    ]),
    s("Come what", "هر چه پیش آید، حقیقت بالاخره روشن خواهد شد.", [
        {"corr": "may,", "dist": ["might,", "can,", "will,", "could,"]},
        {"corr": "the truth will", "dist": ["truth the will", "the truth would", "will the truth", "the true will"]},
        {"corr": "come out", "dist": ["came out", "coming out", "comes out", "out come"]},
        {"corr": "sooner or", "dist": ["soon or", "sooner and", "soonest or", "more soon or"]},
        {"corr": "later.", "dist": ["lately.", "latest.", "more late.", "in later."]}
    ]),
    s("Suffice it", "کافی است بگوییم که همه از نتیجه کار راضی بودند.", [
        {"corr": "to say that", "dist": ["saying that", "to said that", "that to say", "to say which"]},
        {"corr": "everyone was", "dist": ["everyone were", "was everyone", "everyone is", "everyone be"]},
        {"corr": "very pleased", "dist": ["pleased very", "much pleased", "so pleasing", "very pleasing"]},
        {"corr": "with the final", "dist": ["at final the", "in the final", "for final the", "to final the"]},
        {"corr": "score.", "dist": ["scores.", "scored.", "scoring.", "to score."]}
    ]),
    s("Far be it", "دور از من است که درباره زندگی شخصی دیگران نظر بدهم.", [
        {"corr": "from me to", "dist": ["of me to", "with me to", "at me to", "by me to"]},
        {"corr": "judge others", "dist": ["judged others", "judging others", "judges others", "to judge others"]},
        {"corr": "and their private", "dist": ["with their private", "at private their", "for private their", "in their private"]},
        {"corr": "lives in any", "dist": ["life in any", "lives at any", "living in any", "lives with any"]},
        {"corr": "way.", "dist": ["ways.", "manner.", "path.", "road."]}
    ]),
    s("Heaven forbid", "خدا نکند که کسی در این هوای بارانی سرما بخورد.", [
        {"corr": "that anyone", "dist": ["which anyone", "what anyone", "if anyone", "anyone that"]},
        {"corr": "catch a cold", "dist": ["catches a cold", "caught a cold", "catching cold", "to catch cold"]},
        {"corr": "in this stormy", "dist": ["at this stormy", "with stormy this", "under stormy this", "for this stormy"]},
        {"corr": "weather", "dist": ["weathers", "weathered", "weathering", "to weather"]},
        {"corr": "today.", "dist": ["in today.", "at today.", "on today.", "for today."]}
    ]),
    s("So be", "اگر چنین تقدیری رقم خورده است، پس بگذار همان باشد.", [
        {"corr": "it, then,", "dist": ["it, so,", "it, as,", "it, like,", "it, if,"]},
        {"corr": "we must make", "dist": ["make we must", "we should make", "we must to make", "must we make"]},
        {"corr": "the best of", "dist": ["best of the", "the best in", "a best of", "best the of"]},
        {"corr": "this difficult", "dist": ["difficult this", "the difficult this", "a difficult this", "to difficult"]},
        {"corr": "moment.", "dist": ["moments.", "momentary.", "in moment.", "at moment."]}
    ]),
    s("Be that", "هر چه که باشد، ما باید به بررسی گزینه‌های دیگر ادامه دهیم.", [
        {"corr": "as it may,", "dist": ["as it might,", "so it may,", "as may it,", "like it may,"]},
        {"corr": "we must keep", "dist": ["keep we must", "we should keep", "we must to keep", "must we keep"]},
        {"corr": "looking for", "dist": ["look for", "looked for", "looks for", "to look for"]},
        {"corr": "better answers", "dist": ["answers better", "the better answers", "good answers", "best answers"]},
        {"corr": "today.", "dist": ["in today.", "at today.", "on today.", "for today."]}
    ]),
    s("Come what", "هر چه پیش آید، ما به پیمان دوستی خود وفاداریم.", [
        {"corr": "may,", "dist": ["might,", "can,", "will,", "could,"]},
        {"corr": "we will remain", "dist": ["we would remain", "remain we will", "we remain will", "we are remain"]},
        {"corr": "close friends", "dist": ["closely friends", "friends close", "closed friends", "the close friends"]},
        {"corr": "for many", "dist": ["in many", "at many", "with many", "by many"]},
        {"corr": "years to come.", "dist": ["years coming.", "years to came.", "to come years.", "years of come."]}
    ]),
    s("Suffice it", "کافی است بگوییم که این تجربه چیزهای زیادی به ما آموخت.", [
        {"corr": "to say that", "dist": ["saying that", "to said that", "that to say", "to say which"]},
        {"corr": "we learned a", "dist": ["we learn a", "we learning a", "learned we a", "we were learn a"]},
        {"corr": "valuable lesson", "dist": ["lesson valuable", "a lesson valuable", "valuable a lesson", "the valuable lesson"]},
        {"corr": "from that mistake", "dist": ["of that mistake", "with mistake that", "at that mistake", "by that mistake"]},
        {"corr": "yesterday.", "dist": ["in yesterday.", "at yesterday.", "on yesterday.", "for yesterday."]}
    ]),
    s("Far be it", "دور از من است که در تصمیمات خانوادگی او دخالت کنم.", [
        {"corr": "from me to", "dist": ["of me to", "with me to", "at me to", "by me to"]},
        {"corr": "interfere in", "dist": ["interfered in", "interfering in", "interferes in", "to interfere in"]},
        {"corr": "her personal", "dist": ["personal her", "the her personal", "a personal her", "she personal"]},
        {"corr": "choices at this", "dist": ["choice at this", "choices in this", "chosen at this", "choices with this"]},
        {"corr": "time.", "dist": ["times.", "timing.", "the time.", "a time."]}
    ]),
    s("Heaven forbid", "خدا نکند که در مسیر برگشت بنزین تمام کنیم.", [
        {"corr": "that we run", "dist": ["that we ran", "which we run", "if we run", "that run we"]},
        {"corr": "out of fuel", "dist": ["out fuel", "of fuel out", "off fuel", "out with fuel"]},
        {"corr": "on this lonely", "dist": ["in this lonely", "at lonely this", "with lonely this", "for this lonely"]},
        {"corr": "country", "dist": ["countries", "countried", "countrying", "to country"]},
        {"corr": "road.", "dist": ["roads.", "roaded.", "roading.", "to road."]}
    ]),
    s("So be", "اگر قوانین اینگونه نوشته شده‌اند، پس بگذار چنین باشد.", [
        {"corr": "it, then,", "dist": ["it, so,", "it, as,", "it, like,", "it, if,"]},
        {"corr": "if the rule", "dist": ["if rules the", "if a rule", "that the rule", "which the rule"]},
        {"corr": "applies to", "dist": ["apply to", "applied to", "applying to", "to apply to"]},
        {"corr": "all of us", "dist": ["we all", "us all of", "all to us", "all with us"]},
        {"corr": "equally.", "dist": ["equal.", "in equal.", "equality.", "with equal."]}
    ]),
    s("Be that", "هر چه که باشد، ما باید به گفتگوهای سازنده ادامه دهیم.", [
        {"corr": "as it may,", "dist": ["as it might,", "so it may,", "as may it,", "like it may,"]},
        {"corr": "we must continue", "dist": ["continue we must", "we should continue", "we must to continue", "must we continue"]},
        {"corr": "our peaceful", "dist": ["peaceful our", "the our peaceful", "a peaceful our", "to peaceful"]},
        {"corr": "talks for a", "dist": ["talk for a", "talking for a", "talks with a", "talks in a"]},
        {"corr": "solution.", "dist": ["solve.", "solving.", "solutions.", "to solve."]}
    ]),
    s("Come what", "هر چه پیش آید، ما تا رسیدن به هدف دست از تلاش برنمی‌داریم.", [
        {"corr": "may,", "dist": ["might,", "can,", "will,", "could,"]},
        {"corr": "we will not", "dist": ["we would not", "not we will", "we not will", "will not we"]},
        {"corr": "give up our", "dist": ["giving up our", "gave up our", "gives up our", "to give up our"]},
        {"corr": "dream of success", "dist": ["dream for success", "dreams of success", "dream with success", "dreaming of success"]},
        {"corr": "in life.", "dist": ["at life.", "on life.", "by life.", "for life."]}
    ])
]

# ==============================================================================
# Stage C2.3: Wh-Clefts & Reverse Focus Clefts
# What struck me most was, All that remained was, It was precisely this that
# ==============================================================================
c2_data["3"] = [
    s("What struck", "آنچه بیش از همه مرا شگفت‌زده کرد، لبخند آرام و متین او بود.", [
        {"corr": "me most", "dist": ["I most", "my most", "most me", "me mostly"]},
        {"corr": "was his calm", "dist": ["were his calm", "is his calm", "was calm his", "his calm was"]},
        {"corr": "and gentle", "dist": ["and gently", "with gentle", "and gentleness", "or gently"]},
        {"corr": "smile throughout", "dist": ["smiling throughout", "smiled throughout", "smile during", "smiles throughout"]},
        {"corr": "the crisis.", "dist": ["crisis the.", "a crisis.", "crises the.", "to crisis."]}
    ]),
    s("All that", "تنها چیزی که باقی مانده بود، مشتی خاکستر روی زمین بود.", [
        {"corr": "remained was", "dist": ["remained were", "remain was", "remaining was", "was remained"]},
        {"corr": "a handful of", "dist": ["handful a of", "a handful in", "the handful of", "handful of a"]},
        {"corr": "cold gray", "dist": ["gray cold", "a cold gray", "the cold gray", "cold and gray"]},
        {"corr": "ashes on the", "dist": ["ash on the", "ashes at the", "ashes in the", "ashes with the"]},
        {"corr": "ground.", "dist": ["floor.", "grounds.", "grounded.", "to ground."]}
    ]),
    s("It was", "دقیقاً همین حس شوخ‌طبعی بود که همه ما را سرپا نگه داشت.", [
        {"corr": "precisely this sense", "dist": ["precise this sense", "this sense precisely", "precisely a sense", "sense this precisely"]},
        {"corr": "of humor that", "dist": ["in humor that", "of humor which", "of humorous that", "with humor that"]},
        {"corr": "kept our spirits", "dist": ["keep our spirits", "keeping spirits our", "kept spirits our", "to keep our spirits"]},
        {"corr": "high during", "dist": ["highly during", "height during", "in high during", "high while"]},
        {"corr": "the journey.", "dist": ["journey the.", "a journey.", "journeys the.", "to journey."]}
    ]),
    s("What alarmed", "آنچه ساکنان محلی را نگران کرد، افت ناگهانی دمای هوا بود.", [
        {"corr": "the residents", "dist": ["residents the", "a residents", "the resident", "to residents"]},
        {"corr": "was the sudden", "dist": ["were the sudden", "was sudden the", "is the sudden", "was a sudden"]},
        {"corr": "drop in the", "dist": ["fall in the", "drop at the", "dropping in the", "drop of the"]},
        {"corr": "temperature", "dist": ["temperatures", "temperate", "tempered", "to temperature"]},
        {"corr": "overnight.", "dist": ["in overnight.", "at overnight.", "on overnight.", "for overnight."]}
    ]),
    s("The thing", "چیزی که او بیش از هر چیز قدردانش بود، وفاداری دوستانش بود.", [
        {"corr": "she valued", "dist": ["she value", "valued she", "she valuing", "she values"]},
        {"corr": "most was the", "dist": ["most were the", "mostly was the", "was most the", "more was the"]},
        {"corr": "loyalty of her", "dist": ["loyal of her", "loyalty for her", "loyalty with her", "loyally of her"]},
        {"corr": "dearest childhood", "dist": ["dear childhood", "childhood dearest", "dearest child", "childhood dear"]},
        {"corr": "friends.", "dist": ["friend.", "friendly.", "friendship.", "to friends."]}
    ]),
    s("What made", "آنچه این کتاب را خاص می‌کرد، توصیف‌های زنده از طبیعت بود.", [
        {"corr": "the book special", "dist": ["book the special", "the special book", "the book specially", "special the book"]},
        {"corr": "was the vivid", "dist": ["were the vivid", "was vivid the", "is the vivid", "was a vivid"]},
        {"corr": "description of", "dist": ["describe of", "descriptive of", "descriptions for", "description in"]},
        {"corr": "nature in the", "dist": ["natural in the", "nature at the", "nature with the", "nature for the"]},
        {"corr": "mountains.", "dist": ["mountain.", "mountained.", "mountaining.", "to mountains."]}
    ]),
    s("All we", "تنها چیزی که توانستیم پیدا کنیم، یک کلید قدیمی زنگ‌زده بود.", [
        {"corr": "could find was", "dist": ["could find were", "can find was", "find could was", "could found was"]},
        {"corr": "an old rusty", "dist": ["old an rusty", "a rusty old", "the old rusty", "rusty an old"]},
        {"corr": "iron key", "dist": ["key iron", "iron of key", "a iron key", "the key iron"]},
        {"corr": "under the heavy", "dist": ["below heavy the", "beneath heavy the", "at the heavy", "with heavy the"]},
        {"corr": "cabinet.", "dist": ["cabinets.", "cupboard.", "table.", "to cabinet."]}
    ]),
    s("It was", "به خاطر راهنمایی‌های او بود که ما سرانجام مسیر درست را یافتیم.", [
        {"corr": "thanks to her", "dist": ["thank to her", "thanks for her", "thanking her", "to thank her"]},
        {"corr": "advice that we", "dist": ["advice which we", "advices that we", "advise that we", "advice what we"]},
        {"corr": "finally found our", "dist": ["final found our", "found finally our", "finally find our", "our finally found"]},
        {"corr": "way through the", "dist": ["path through the", "way in the", "way across the", "ways through the"]},
        {"corr": "forest.", "dist": ["wood.", "forests.", "tree.", "to forest."]}
    ]),
    s("What puzzled", "آنچه کارآگاهان را سردرگم کرد، غیبت کامل هرگونه شواهد بود.", [
        {"corr": "the detectives", "dist": ["detectives the", "a detectives", "the detective", "to detectives"]},
        {"corr": "was the total", "dist": ["were the total", "was total the", "is the total", "was a total"]},
        {"corr": "absence of any", "dist": ["absent of any", "absence in any", "absence for any", "absence with any"]},
        {"corr": "clear evidence", "dist": ["evidence clear", "a clear evidence", "clearly evidence", "the evidence clear"]},
        {"corr": "at the scene.", "dist": ["in the scene.", "on scene the.", "to the scene.", "for scene the."]}
    ]),
    s("The person", "کسی که بیشترین سهم را در این موفقیت داشت، سارا بود.", [
        {"corr": "who contributed", "dist": ["which contributed", "whom contributed", "whose contributed", "contributed who"]},
        {"corr": "most to our", "dist": ["most at our", "mostly to our", "more to our", "most in our"]},
        {"corr": "triumph was", "dist": ["triumph were", "triumphant was", "victory were", "was triumph"]},
        {"corr": "Sarah, our lead", "dist": ["Sarah, lead our", "Sarah, a lead", "Sarah, our leader", "Sarah our leading"]},
        {"corr": "designer.", "dist": ["design.", "designing.", "designed.", "to designer."]}
    ]),
    s("What pleased", "آنچه خانواده را بیش از هر چیز شاد کرد، بهبودی سریع او بود.", [
        {"corr": "the family most", "dist": ["family the most", "the most family", "the family mostly", "most the family"]},
        {"corr": "was his swift", "dist": ["were his swift", "was swift his", "is his swift", "was a swift"]},
        {"corr": "recovery from", "dist": ["recover from", "recovering from", "recovers from", "to recover from"]},
        {"corr": "the severe", "dist": ["severe the", "a severe", "the severely", "severely the"]},
        {"corr": "illness.", "dist": ["ill.", "sick.", "sicknesses.", "to illness."]}
    ]),
    s("All they", "تنها درخواستی که مطرح کردند، یک جلسه کوتاه با هیئت‌مدیره بود.", [
        {"corr": "requested was", "dist": ["requested were", "request was", "requesting was", "was requested"]},
        {"corr": "a brief meeting", "dist": ["brief a meeting", "a meeting brief", "the brief meeting", "briefly a meeting"]},
        {"corr": "with the board", "dist": ["at board the", "for board the", "to the board", "by board the"]},
        {"corr": "to discuss the", "dist": ["for discuss the", "discussing the", "to discussing the", "discuss the"]},
        {"corr": "matter.", "dist": ["matters.", "mattered.", "mattering.", "to matter."]}
    ]),
    s("It was", "تنها پس از پایان گفتگوها بود که همه نفس راحتی کشیدند.", [
        {"corr": "only after the", "dist": ["after only the", "only the after", "only before the", "after the only"]},
        {"corr": "talks ended that", "dist": ["talks end that", "ended talks that", "talks ended which", "talks ending that"]},
        {"corr": "everyone breathed a", "dist": ["everyone breath a", "breathed everyone a", "everyone breathing a", "all breathed a"]},
        {"corr": "deep sigh of", "dist": ["deep of sigh", "sigh deep of", "a deep sigh", "deeply sigh of"]},
        {"corr": "relief.", "dist": ["relieve.", "relieved.", "relieving.", "to relief."]}
    ]),
    s("What intrigued", "آنچه دانشمندان را شگفت‌زده کرد، ساختار غیرمعمول بلور بود.", [
        {"corr": "the researchers", "dist": ["researchers the", "a researchers", "the researcher", "to researchers"]},
        {"corr": "was the unusual", "dist": ["were the unusual", "was unusual the", "is the unusual", "was an unusual"]},
        {"corr": "structure of the", "dist": ["construct of the", "structure in the", "structuring of the", "structure for the"]},
        {"corr": "newly discovered", "dist": ["new discovered", "newly discover", "discovering newly", "discovered newly"]},
        {"corr": "mineral.", "dist": ["minerals.", "mining.", "miner.", "to mineral."]}
    ]),
    s("The factor", "عاملی که بیشترین تاثیر را داشت، تعهد بی‌دریغ کادر درمان بود.", [
        {"corr": "that played the", "dist": ["which played the", "who played the", "played that the", "what played the"]},
        {"corr": "biggest role was", "dist": ["biggest role were", "bigger role was", "role biggest was", "was biggest role"]},
        {"corr": "the staff's dedication", "dist": ["the staff dedication", "dedication staff the", "the staff dedicated", "staff dedication the"]},
        {"corr": "to patient care", "dist": ["for patient care", "at care patient", "with patient care", "in patient care"]},
        {"corr": "every day.", "dist": ["in every day.", "at day every.", "on day every.", "for day."]}
    ]),
    s("What astonished", "آنچه مخاطبان را متحیر ساخت، تسلط بی‌نقص او بر ساز بود.", [
        {"corr": "the audience was", "dist": ["the audience were", "audience the was", "was the audience", "is the audience"]},
        {"corr": "her effortless", "dist": ["effortless her", "the effortless her", "a effortless her", "she effortless"]},
        {"corr": "command of the", "dist": ["command in the", "commanding of the", "command at the", "command with the"]},
        {"corr": "complex musical", "dist": ["music complex", "complex music", "musical complex", "complexly musical"]},
        {"corr": "piece.", "dist": ["pieces.", "part.", "pieced.", "to piece."]}
    ]),
    s("All he", "تنها چیزی که او از سفرهایش به همراه آورد، یک آلبوم عکس بود.", [
        {"corr": "brought back was", "dist": ["brought back were", "bring back was", "bringing back was", "was brought back"]},
        {"corr": "a thick album", "dist": ["thick a album", "an thick album", "the thick album", "thick album a"]},
        {"corr": "of photographs", "dist": ["in photographs", "for photographs", "with photographs", "at photographs"]},
        {"corr": "taken during his", "dist": ["took during his", "taking during his", "takes during his", "taken in his"]},
        {"corr": "travels.", "dist": ["travel.", "traveling.", "traveled.", "to travel."]}
    ]),
    s("It was", "در سکوت شب بود که او بهترین شعرهایش را می‌سرود.", [
        {"corr": "in the quiet", "dist": ["at the quiet", "on quiet the", "with the quiet", "for quiet the"]},
        {"corr": "of night that", "dist": ["of night which", "in night that", "of nightly that", "at night that"]},
        {"corr": "she composed her", "dist": ["she compose her", "composed she her", "she composing her", "her she composed"]},
        {"corr": "most moving", "dist": ["more moving", "mostly moving", "moving most", "much moving"]},
        {"corr": "poems.", "dist": ["poetry.", "poem.", "poetic.", "to poems."]}
    ]),
    s("What touched", "آنچه قلب همه را تحت تاثیر قرار داد، مهربانی بی‌پایان او بود.", [
        {"corr": "everyone deeply", "dist": ["everyone deep", "deeply everyone", "everybody deeply", "all deeply"]},
        {"corr": "was her boundless", "dist": ["were her boundless", "was boundless her", "is her boundless", "was a boundless"]},
        {"corr": "generosity toward", "dist": ["generous toward", "generosity at", "generosity for", "generously toward"]},
        {"corr": "those in great", "dist": ["them in great", "those at great", "those with great", "people in great"]},
        {"corr": "need.", "dist": ["needy.", "needs.", "needing.", "to need."]}
    ]),
    s("The memory", "خاطره‌ای که برای همیشه در ذهن ماند، غروب بر فراز قله بود.", [
        {"corr": "that remained with", "dist": ["which remained with", "remained that with", "that remain with", "what remained with"]},
        {"corr": "us was the", "dist": ["we was the", "us were the", "our was the", "was us the"]},
        {"corr": "breathtaking view", "dist": ["view breathtaking", "a view breathtaking", "the view breathtaking", "breathtakingly view"]},
        {"corr": "from the mountain", "dist": ["at the mountain", "of mountain the", "in mountain the", "to the mountain"]},
        {"corr": "summit.", "dist": ["top.", "peak.", "summits.", "to summit."]}
    ])
]

# ==============================================================================
# Stage C2.4: Fronted Adjectives with As/Though
# Tired though he was, Difficult as it seemed, Strange though it sounds
# ==============================================================================
c2_data["4"] = [
    s("Tired though", "هر چند او خسته بود، غذای گرمی برای خانواده آماده کرد.", [
        {"corr": "he was,", "dist": ["was he,", "he were,", "he is,", "did he,"]},
        {"corr": "he prepared", "dist": ["he prepare", "prepared he", "he preparing", "he was prepare"]},
        {"corr": "a hot meal", "dist": ["hot a meal", "a meal hot", "the hot meal", "meal hot a"]},
        {"corr": "for his family", "dist": ["to his family", "at family his", "with his family", "in family his"]},
        {"corr": "with love.", "dist": ["by love.", "in love.", "with lovely.", "at love."]}
    ]),
    s("Difficult as", "هر چند این کار دشوار به نظر می‌رسید، ما پیش از موعد آن را تمام کردیم.", [
        {"corr": "it seemed,", "dist": ["seemed it,", "it seems,", "it was seem,", "did it seem,"]},
        {"corr": "we finished", "dist": ["we finish", "finished we", "we finishing", "we were finish"]},
        {"corr": "the task", "dist": ["task the", "a task", "tasks the", "to task"]},
        {"corr": "well ahead of", "dist": ["good ahead of", "well before to", "ahead well of", "well in front of"]},
        {"corr": "the deadline.", "dist": ["deadline the.", "a deadline.", "deadlines the.", "to deadline."]}
    ]),
    s("Strange though", "هر چند عجیب به نظر می‌رسد، داستان او کاملاً واقعی بود.", [
        {"corr": "it may sound,", "dist": ["sound it may,", "it may sounds,", "it might sounds,", "may it sound,"]},
        {"corr": "every detail", "dist": ["details every", "all detail", "every of detail", "detail every"]},
        {"corr": "of his story", "dist": ["in story his", "with his story", "for his story", "at story his"]},
        {"corr": "was proved to", "dist": ["were proved to", "was prove to", "proved was to", "is proved to"]},
        {"corr": "be true.", "dist": ["be truth.", "be truly.", "being true.", "to be true."]}
    ]),
    s("Busy as", "هر چند او بسیار سرش شلوغ است، همیشه برای بچه‌هایش وقت می‌گذارد.", [
        {"corr": "she is,", "dist": ["is she,", "she was,", "she be,", "does she,"]},
        {"corr": "she always", "dist": ["always she", "she is always", "always is she", "she ever"]},
        {"corr": "finds time", "dist": ["find time", "finding time", "finds the time", "found time"]},
        {"corr": "to read with", "dist": ["for read with", "reading with", "to reading with", "read with"]},
        {"corr": "her children.", "dist": ["children her.", "her child.", "kids her.", "to children."]}
    ]),
    s("Simple though", "هر چند این طرح ساده به نظر می‌رسد، سال‌هاست بی‌نقص کار می‌کند.", [
        {"corr": "the design is,", "dist": ["is the design,", "design the is,", "the design was,", "was the design,"]},
        {"corr": "it has worked", "dist": ["it worked", "it works", "worked it has", "it had worked"]},
        {"corr": "flawlessly for", "dist": ["flawless for", "with flawless for", "flawlessly in", "flawlessly at"]},
        {"corr": "more than two", "dist": ["above than two", "over than two", "more of two", "more to two"]},
        {"corr": "decades.", "dist": ["years.", "decade.", "centuries.", "to decades."]}
    ]),
    s("Young as", "هر چند او سن کمی دارد، استعدادی خیره‌کننده در شطرنج نشان می‌دهد.", [
        {"corr": "he is,", "dist": ["is he,", "he was,", "he be,", "does he,"]},
        {"corr": "he displays", "dist": ["he display", "displays he", "he displaying", "he displayed"]},
        {"corr": "remarkable tactical", "dist": ["remarkably tactical", "tactical remarkable", "a remarkable tactical", "remarkable tactics"]},
        {"corr": "skill at the", "dist": ["skills at the", "skill in the", "skill with the", "skill on the"]},
        {"corr": "chessboard.", "dist": ["chess.", "board.", "game.", "to chessboard."]}
    ]),
    s("Late though", "هر چند دیر وقت بود، مهمانان تمایلی به ترک مهمانی نداشتند.", [
        {"corr": "the hour was,", "dist": ["was the hour,", "hour the was,", "the hour were,", "were the hour,"]},
        {"corr": "the guests were", "dist": ["the guests was", "guests the were", "were the guests", "the guest were"]},
        {"corr": "reluctant to", "dist": ["reluctance to", "reluctantly to", "reluctant for", "in reluctant to"]},
        {"corr": "leave the joyful", "dist": ["left the joyful", "leaving the joyful", "leave joyful the", "leaves the joyful"]},
        {"corr": "gathering.", "dist": ["party.", "gather.", "gathered.", "to gathering."]}
    ]),
    s("Poor though", "هر چند آنها فقیر بودند، با روی گشاده از هر مسافری پذیرایی می‌کردند.", [
        {"corr": "they were,", "dist": ["were they,", "they was,", "they are,", "did they,"]},
        {"corr": "they welcomed", "dist": ["they welcome", "welcomed they", "they welcoming", "they were welcome"]},
        {"corr": "every traveler", "dist": ["all traveler", "traveler every", "every of traveler", "each travelers"]},
        {"corr": "with unmatched", "dist": ["in unmatched", "by unmatched", "with no matched", "at unmatched"]},
        {"corr": "hospitality.", "dist": ["hospital.", "hospitable.", "in hospitality.", "to hospital."]}
    ]),
    s("Clever as", "هر چند این پاسخ هوشمندانه به نظر می‌رسید، مشکل اصلی را حل نکرد.", [
        {"corr": "the answer seemed,", "dist": ["seemed the answer,", "the answer seems,", "answer the seemed,", "did the answer seem,"]},
        {"corr": "it did not", "dist": ["it does not", "it was not", "did not it", "it had not"]},
        {"corr": "address the core", "dist": ["addressed the core", "address core the", "addressing the core", "to address the core"]},
        {"corr": "issue under", "dist": ["issue in", "issues under", "issue at", "issue below"]},
        {"corr": "discussion.", "dist": ["discuss.", "discussing.", "discussions.", "to discuss."]}
    ]),
    s("Unlikely though", "هر چند بعید به نظر می‌رسد، ما باید برای هر احتمالی آماده باشیم.", [
        {"corr": "it may seem,", "dist": ["seem it may,", "it may seems,", "it might seems,", "may it seem,"]},
        {"corr": "we should remain", "dist": ["we must remain", "remain we should", "we should to remain", "should we remain"]},
        {"corr": "prepared for", "dist": ["prepare for", "preparing for", "preparation for", "in prepare for"]},
        {"corr": "every possible", "dist": ["all possible", "possible every", "every possibility", "each possible"]},
        {"corr": "outcome.", "dist": ["result.", "outcomes.", "end.", "to outcome."]}
    ]),
    s("Small though", "هر چند این روستا کوچک است، جاذبه‌های تاریخی فراوانی دارد.", [
        {"corr": "the village is,", "dist": ["is the village,", "village the is,", "the village was,", "was the village,"]},
        {"corr": "it boasts", "dist": ["it boast", "boasts it", "it boasting", "it boasted"]},
        {"corr": "several ancient", "dist": ["several of ancient", "ancient several", "some of ancient", "the several ancient"]},
        {"corr": "monuments of", "dist": ["monument of", "monuments in", "monuments for", "monuments with"]},
        {"corr": "great value.", "dist": ["value great.", "a great value.", "greatly value.", "in value great."]}
    ]),
    s("Costly as", "هر چند تعمیرات پرهزینه بود، ایمنی ساختمان را تضمین کرد.", [
        {"corr": "the repairs were,", "dist": ["were the repairs,", "repairs the were,", "the repair was,", "was the repairs,"]},
        {"corr": "they ensured the", "dist": ["they ensure the", "ensured they the", "they ensuring the", "they were ensure the"]},
        {"corr": "safety of the", "dist": ["safe of the", "safety in the", "safely of the", "safeness of the"]},
        {"corr": "entire residential", "dist": ["whole residential", "all residential", "residential entire", "entirely residential"]},
        {"corr": "complex.", "dist": ["building.", "complexes.", "area.", "to complex."]}
    ]),
    s("Hard though", "هر چند ما به سختی تلاش کردیم، به تمام اهداف نرسیدیم.", [
        {"corr": "we tried,", "dist": ["tried we,", "we try,", "we trying,", "did we try,"]},
        {"corr": "we were unable", "dist": ["we are unable", "unable we were", "we could unable", "were we unable"]},
        {"corr": "to accomplish", "dist": ["for accomplish", "accomplishing", "to accomplishing", "accomplish"]},
        {"corr": "every single", "dist": ["all single", "single every", "each single", "every of single"]},
        {"corr": "target.", "dist": ["goal.", "targets.", "aim.", "to target."]}
    ]),
    s("Proud though", "هر چند او مغرور بود، در نهایت اشتباه محاسباتی خود را پذیرفت.", [
        {"corr": "he was,", "dist": ["was he,", "he were,", "he is,", "did he,"]},
        {"corr": "he ultimately", "dist": ["he ultimate", "ultimately he", "he was ultimate", "he in ultimate"]},
        {"corr": "admitted his", "dist": ["admit his", "admitting his", "admits his", "to admit his"]},
        {"corr": "error in the", "dist": ["error at the", "errors in the", "error with the", "error of the"]},
        {"corr": "calculations.", "dist": ["calculate.", "calculating.", "calculated.", "to calculate."]}
    ]),
    s("Fast though", "هر چند قطار پرسرعت بود، مسافران دیر به فرودگاه رسیدند.", [
        {"corr": "the train was,", "dist": ["was the train,", "train the was,", "the train were,", "were the train,"]},
        {"corr": "the passengers", "dist": ["passengers the", "a passengers", "the passenger", "to passengers"]},
        {"corr": "still arrived", "dist": ["arrived still", "still arrive", "still arriving", "were still arrive"]},
        {"corr": "behind schedule", "dist": ["after schedule", "late schedule", "behind the schedule", "at schedule behind"]},
        {"corr": "yesterday.", "dist": ["in yesterday.", "at yesterday.", "on yesterday.", "for yesterday."]}
    ]),
    s("Polite as", "هر چند درخواست آنها مودبانه بود، مدیر نتوانست با آن موافقت کند.", [
        {"corr": "their request was,", "dist": ["was their request,", "their request were,", "request their was,", "were their request,"]},
        {"corr": "the manager could", "dist": ["the manager can", "manager the could", "could the manager", "the manager was"]},
        {"corr": "not grant them", "dist": ["not grant they", "not give they", "grant not them", "not to grant them"]},
        {"corr": "the required", "dist": ["require the", "the requiring", "a required", "the requirement"]},
        {"corr": "permission.", "dist": ["permit.", "permissions.", "in permission.", "to permission."]}
    ]),
    s("Rich though", "هر چند او ثروتمند است، سبک زندگی ساده و بی‌پیرایه‌ای دارد.", [
        {"corr": "she is,", "dist": ["is she,", "she was,", "she be,", "does she,"]},
        {"corr": "she chooses to", "dist": ["she choose to", "chooses she to", "she choosing to", "she chosen to"]},
        {"corr": "lead a modest", "dist": ["live a modest", "lead modest a", "lead the modest", "leading a modest"]},
        {"corr": "and unpretentious", "dist": ["and simple", "with unpretentious", "and pretentious", "or unpretentious"]},
        {"corr": "life.", "dist": ["lives.", "living.", "lifestyle.", "to life."]}
    ]),
    s("Cold though", "هر چند هوا بسیار سرد بود، بچه‌ها از برف‌بازی سیر نمی‌شدند.", [
        {"corr": "the morning was,", "dist": ["was the morning,", "morning the was,", "the morning were,", "were the morning,"]},
        {"corr": "the children", "dist": ["children the", "a children", "the child", "to children"]},
        {"corr": "played happily", "dist": ["played happy", "happy played", "playing happily", "plays happily"]},
        {"corr": "in the fresh", "dist": ["at the fresh", "on fresh the", "with the fresh", "for fresh the"]},
        {"corr": "snow.", "dist": ["snows.", "snowing.", "snowy.", "to snow."]}
    ]),
    s("Strong as", "هر چند سد بتنی بسیار مستحکم بود، فشار آب سرانجام رخنه ایجاد کرد.", [
        {"corr": "the barrier was,", "dist": ["was the barrier,", "barrier the was,", "the barrier were,", "were the barrier,"]},
        {"corr": "the rushing flood", "dist": ["rushing flood the", "the flood rushing", "a rushing flood", "flood rushing the"]},
        {"corr": "forced its way", "dist": ["force its way", "forced it way", "forcing its way", "forces its way"]},
        {"corr": "through the weak", "dist": ["across the weak", "in the weak", "at weak the", "with weak the"]},
        {"corr": "points.", "dist": ["point.", "pointing.", "pointed.", "to point."]}
    ]),
    s("Quiet though", "هر چند محله آرام به نظر می‌رسید، همسایه‌ها همیشه هوای هم را داشتند.", [
        {"corr": "the street seemed,", "dist": ["seemed the street,", "the street seems,", "street the seemed,", "did the street seem,"]},
        {"corr": "the neighbors", "dist": ["neighbors the", "a neighbors", "the neighbor", "to neighbors"]},
        {"corr": "looked after one", "dist": ["look after one", "looking after one", "looked after each", "looks after one"]},
        {"corr": "another with", "dist": ["other with", "another at", "other at", "another in"]},
        {"corr": "great care.", "dist": ["care great.", "a great care.", "greatly care.", "in care great."]}
    ])
]

# ==============================================================================
# Stage C2.5: Inverted Hypothetical Conditionals
# Had it not been for, Were it not for, Should anything happen
# ==============================================================================
c2_data["5"] = [
    s("Had it not", "اگر کمک و همراهی شما نبود، ما در دستیابی به هدف شکست می‌خوردیم.", [
        {"corr": "been for your", "dist": ["being for your", "be for your", "been with your", "been to your"]},
        {"corr": "help, we would", "dist": ["help, we will", "help, would we", "help, we had", "helping, we would"]},
        {"corr": "have failed to", "dist": ["fail to", "failed to", "have fail to", "having failed to"]},
        {"corr": "reach our main", "dist": ["reaching our main", "reach main our", "reach the our main", "our main reach"]},
        {"corr": "goal.", "dist": ["goals.", "aim.", "target.", "to goal."]}
    ]),
    s("Were it not", "اگر این باران سیل‌آسا نبود، الان در مسیر بازگشت به خانه بودیم.", [
        {"corr": "for this heavy", "dist": ["for heavy this", "with this heavy", "to this heavy", "in this heavy"]},
        {"corr": "rain, we would", "dist": ["rain, we will", "raining, we would", "rain, would we", "rain, we had"]},
        {"corr": "be driving", "dist": ["drive", "driven", "drove", "to drive"]},
        {"corr": "back toward the", "dist": ["toward back the", "back to the", "back in the", "forward the"]},
        {"corr": "city.", "dist": ["town.", "cities.", "home.", "to city."]}
    ]),
    s("Should anything", "اگر رویداد غیرمنتظره‌ای رخ داد، فوراً به من اطلاع دهید.", [
        {"corr": "unexpected happen,", "dist": ["happen unexpected,", "unexpected happens,", "unexpectedly happen,", "unexpected happened,"]},
        {"corr": "please contact", "dist": ["please to contact", "please contacting", "contact please", "please contacts"]},
        {"corr": "my office", "dist": ["office my", "the my office", "a office my", "to office"]},
        {"corr": "without a moment's", "dist": ["with no moment's", "with not moment's", "except a moment's", "without moment"]},
        {"corr": "hesitation.", "dist": ["hesitate.", "hesitating.", "hesitated.", "in hesitation."]}
    ]),
    s("Had anyone", "اگر کسی از من نظر می‌خواست، من با صراحت مخالفت می‌کردم.", [
        {"corr": "asked for my", "dist": ["ask for my", "asking for my", "asked of my", "asked my for"]},
        {"corr": "opinion, I would", "dist": ["opinion, I will", "opinion, would I", "opinion, I had", "opinions, I would"]},
        {"corr": "have opposed the", "dist": ["oppose the", "opposed the", "have oppose the", "having opposed the"]},
        {"corr": "proposed changes", "dist": ["propose changes", "changes proposed", "proposing changes", "changes of propose"]},
        {"corr": "firmly.", "dist": ["firm.", "in firm.", "firmness.", "with firm."]}
    ]),
    s("Were we to", "اگر بخواهیم این قرارداد را امضا کنیم، باید تضمین‌های بیشتری بخواهیم.", [
        {"corr": "accept these new", "dist": ["accepting these new", "accepted these new", "accept this new", "to accept these new"]},
        {"corr": "terms, we would", "dist": ["terms, we will", "term, we would", "terms, would we", "terms, we had"]},
        {"corr": "require stronger", "dist": ["requiring stronger", "required stronger", "requires stronger", "to require stronger"]},
        {"corr": "guarantees for", "dist": ["guarantee for", "guarantees in", "guarantees to", "guarantees with"]},
        {"corr": "delivery.", "dist": ["deliver.", "delivering.", "deliveries.", "to deliver."]}
    ]),
    s("Had the driver", "اگر راننده با چنین سرعتی حرکت نکرده بود، سانحه رخ نمی‌داد.", [
        {"corr": "not been speeding,", "dist": ["not speeding,", "been not speeding,", "no been speeding,", "not be speed,"]},
        {"corr": "the accident", "dist": ["accident the", "an accident", "the accidents", "to accident"]},
        {"corr": "would not have", "dist": ["will not have", "would have not", "not would have", "had not"]},
        {"corr": "happened on the", "dist": ["happen on the", "happening on the", "happened at the", "happened in the"]},
        {"corr": "highway.", "dist": ["road.", "street.", "highways.", "to highway."]}
    ]),
    s("Were you to", "اگر بخواهید با دقت بررسی کنید، تناقض‌های متعددی خواهید یافت.", [
        {"corr": "examine the facts", "dist": ["examining the facts", "examined the facts", "examine facts the", "to examine the facts"]},
        {"corr": "closely, you would", "dist": ["close, you would", "closely, you will", "closely, would you", "closely, you had"]},
        {"corr": "find clear signs", "dist": ["found clear signs", "finding clear signs", "find clearly signs", "signs clear find"]},
        {"corr": "of internal", "dist": ["in internal", "for internal", "with internal", "to internal"]},
        {"corr": "disagreement.", "dist": ["disagree.", "disagreeing.", "disagreed.", "to disagree."]}
    ]),
    s("Had we known", "اگر می‌دانستیم پرواز تاخیر دارد، ساعت‌ها در سالن معطل نمی‌شدیم.", [
        {"corr": "about the delay,", "dist": ["of the delay,", "at delay the,", "with the delay,", "for delay the,"]},
        {"corr": "we would not", "dist": ["we will not", "we had not", "not we would", "we not would"]},
        {"corr": "have spent hours", "dist": ["spend hours", "spent hours have", "have spend hours", "spent hours"]},
        {"corr": "waiting at the", "dist": ["wait at the", "waited at the", "waiting in the", "for wait at the"]},
        {"corr": "airport.", "dist": ["station.", "terminal.", "airports.", "to airport."]}
    ]),
    s("Should the weather", "اگر شرایط جوی نامساعد بماند، پروازها معلق خواهند شد.", [
        {"corr": "remain adverse,", "dist": ["remains adverse,", "remained adverse,", "remaining adverse,", "remain adversely,"]},
        {"corr": "all scheduled", "dist": ["scheduled all", "the all scheduled", "all schedule", "every scheduled"]},
        {"corr": "flights will be", "dist": ["flights would be", "flight will be", "flights will", "be flights will"]},
        {"corr": "grounded until", "dist": ["ground until", "grounding until", "grounded by", "grounded since"]},
        {"corr": "further notice.", "dist": ["farther notice.", "more notice.", "notice further.", "future notice."]}
    ]),
    s("Were it not", "اگر حمایت مداوم خانواده‌اش نبود، او به این جایگاه نمی‌رسید.", [
        {"corr": "for her family's", "dist": ["for her family", "with her family's", "to her family's", "in her family's"]},
        {"corr": "support, she would", "dist": ["support, she will", "support, would she", "supporting, she would", "support, she had"]},
        {"corr": "never have achieved", "dist": ["never achieve", "have never achieve", "never has achieved", "achieved never have"]},
        {"corr": "such remarkable", "dist": ["so remarkable", "such a remarkable", "remarkable such", "so a remarkable"]},
        {"corr": "success.", "dist": ["successful.", "succeed.", "successfully.", "to success."]}
    ]),
    s("Had she taken", "اگر او داروها را سر وقت مصرف کرده بود، بیماری تشدید نمی‌شد.", [
        {"corr": "the medication on", "dist": ["medication the on", "the medicine on", "a medication on", "medication on the"]},
        {"corr": "time, her condition", "dist": ["time, condition her", "time, her conditions", "time, she condition", "timed, her condition"]},
        {"corr": "would not have", "dist": ["will not have", "would have not", "not would have", "had not"]},
        {"corr": "worsened so", "dist": ["worse so", "worsening so", "worsened such", "worse so much"]},
        {"corr": "rapidly.", "dist": ["rapid.", "in rapid.", "with rapid.", "rapidity."]}
    ]),
    s("Were they to", "اگر آنها بدون تایید مهندس ادامه دهند، سازه تخریب خواهد شد.", [
        {"corr": "proceed without", "dist": ["proceeding without", "proceeded without", "proceed with no", "to proceed without"]},
        {"corr": "approval, the entire", "dist": ["approve, the entire", "approval, entire the", "approval, a entire", "approving, the entire"]},
        {"corr": "structure could", "dist": ["structure can", "structure would", "structures could", "structural could"]},
        {"corr": "collapse under", "dist": ["collapsing under", "collapsed under", "collapse below", "to collapse under"]},
        {"corr": "heavy load.", "dist": ["load heavy.", "a heavy load.", "heavily load.", "the load heavy."]}
    ]),
    s("Had the alarm", "اگر زنگ هشدار به صدا درنیامده بود، آتش خسارت سنگینی می‌زد.", [
        {"corr": "not sounded,", "dist": ["not sound,", "sounded not,", "no sounded,", "not sounding,"]},
        {"corr": "the fire would", "dist": ["fire the would", "the fire will", "would the fire", "the fire had"]},
        {"corr": "have spread", "dist": ["spread", "spreading", "have spreading", "have spreaded"]},
        {"corr": "throughout the whole", "dist": ["across the whole", "in the whole", "through the all", "at the whole"]},
        {"corr": "building.", "dist": ["house.", "facility.", "buildings.", "to building."]}
    ]),
    s("Should you wish", "اگر مایل به انصراف هستید، فرم پیوست را تکمیل کنید.", [
        {"corr": "to cancel your", "dist": ["canceling your", "to canceling your", "cancel your", "for cancel your"]},
        {"corr": "booking, please", "dist": ["booked, please", "bookings, please", "book, please", "booking please"]},
        {"corr": "fill out the", "dist": ["fill in the", "filling out the", "filled out the", "out fill the"]},
        {"corr": "attached refund", "dist": ["attach refund", "attaching refund", "refund attached", "refund attach"]},
        {"corr": "form.", "dist": ["sheet.", "paper.", "forms.", "to form."]}
    ]),
    s("Were it not", "اگر شجاعت آتش‌نشانان نبود، کل طبقه خاکستر می‌شد.", [
        {"corr": "for the courage", "dist": ["with the courage", "for courage the", "to the courage", "in the courage"]},
        {"corr": "of the crew,", "dist": ["with the crew,", "for the crew,", "by the crew,", "at the crew,"]},
        {"corr": "the entire floor", "dist": ["entire floor the", "the floor entire", "whole the floor", "a entire floor"]},
        {"corr": "would have been", "dist": ["will have been", "would be", "would been have", "had been"]},
        {"corr": "destroyed.", "dist": ["destroy.", "destroying.", "destroys.", "to destroy."]}
    ]),
    s("Had he listened", "اگر او به توصیه‌های ایمنی گوش کرده بود، آسیبی نمی‌دید.", [
        {"corr": "to the warnings,", "dist": ["at the warnings,", "with the warnings,", "for the warnings,", "to warnings the,"]},
        {"corr": "he would not", "dist": ["he will not", "he had not", "not he would", "he not would"]},
        {"corr": "have suffered such", "dist": ["suffer such", "suffered such", "have suffer such", "have suffered so"]},
        {"corr": "a painful", "dist": ["painful a", "the painful", "an painful", "pain a"]},
        {"corr": "injury.", "dist": ["injuries.", "injured.", "injuring.", "to injury."]}
    ]),
    s("Were we to", "اگر ما تصمیم بگیریم پیشنهاد را بپذیریم، همکاری جدیدی آغاز خواهد شد.", [
        {"corr": "sign the agreement", "dist": ["signing the agreement", "signed the agreement", "sign agreement the", "to sign the agreement"]},
        {"corr": "today, a new", "dist": ["today, the new", "yesterday, a new", "now, a new", "today a new"]},
        {"corr": "partnership would", "dist": ["partnership will", "partner would", "partnerships would", "would partnership"]},
        {"corr": "commence from", "dist": ["commencing from", "commenced from", "start from", "commence at"]},
        {"corr": "next week.", "dist": ["following week.", "week next.", "the next week.", "coming week."]}
    ]),
    s("Had the rescue", "اگر تیم امداد اندکی دیرتر رسیده بود، کوهنوردان نجات نمی‌یافتند.", [
        {"corr": "team arrived any", "dist": ["team arrive any", "team arriving any", "arrived team any", "team arrived some"]},
        {"corr": "later, the stranded", "dist": ["late, the stranded", "latest, the stranded", "later the stranded", "more late, the stranded"]},
        {"corr": "climbers would have", "dist": ["climbers will have", "climber would have", "climbers would", "have climbers would"]},
        {"corr": "perished in the", "dist": ["perish in the", "perishing in the", "perished at the", "perished under the"]},
        {"corr": "snowstorm.", "dist": ["blizzard.", "storm.", "snowstorms.", "to storm."]}
    ]),
    s("Should anyone need", "اگر کسی نیاز به اطلاعات تکمیلی دارد، با دفتر هماهنگ کند.", [
        {"corr": "further guidance,", "dist": ["farther guidance,", "more guidance,", "guidance further,", "guide further,"]},
        {"corr": "they may reach", "dist": ["they might reach", "may they reach", "they can to reach", "they will reach"]},
        {"corr": "out to our", "dist": ["to our out", "in to our", "out at our", "out with our"]},
        {"corr": "support desk", "dist": ["desk support", "supporting desk", "supported desk", "a support desk"]},
        {"corr": "at any time.", "dist": ["in any time.", "on any time.", "for any time.", "by any time."]}
    ]),
    s("Were it not", "اگر راهنمایی‌های استاد نبود، این رساله به پایان نمی‌رسید.", [
        {"corr": "for the mentor's", "dist": ["for mentor the", "with the mentor's", "to the mentor's", "in the mentor's"]},
        {"corr": "guidance, this thesis", "dist": ["guide, this thesis", "guidance, these thesis", "guided, this thesis", "guidance this thesis"]},
        {"corr": "would never have", "dist": ["will never have", "would have never", "never would have", "had never"]},
        {"corr": "reached", "dist": ["reach", "reaching", "reaches", "to reach"]},
        {"corr": "completion.", "dist": ["complete.", "completing.", "completed.", "to completion."]}
    ])
]

# ==============================================================================
# Stage C2.6: Negative Fronting & Frequency Inversion
# On no account must you, At no time was anyone, Scarcely had she
# ==============================================================================
c2_data["6"] = [
    s("On no account", "به هیچ وجه نباید این پرونده‌ها بدون اجازه خارج شوند.", [
        {"corr": "must these files", "dist": ["these files must", "should files these", "must files these", "shall these files"]},
        {"corr": "be removed from", "dist": ["remove from", "being removed from", "removed from be", "to be removed from"]},
        {"corr": "the archive without", "dist": ["archive the without", "the archive with no", "an archive without", "the archive unless"]},
        {"corr": "written permission", "dist": ["write permission", "writing permission", "permission written", "a written permission"]},
        {"corr": "from management.", "dist": ["of management.", "by management.", "with management.", "at management."]}
    ]),
    s("At no time", "شاهدان در هیچ مقطعی از بازجویی اظهارات خود را تغییر ندادند.", [
        {"corr": "did the witnesses", "dist": ["the witnesses did", "witnesses did the", "had the witnesses", "were the witnesses"]},
        {"corr": "alter their original", "dist": ["altered their original", "alter original their", "altering their original", "alter their origin"]},
        {"corr": "statements given to", "dist": ["statement given to", "statements give to", "statements giving to", "statements gave to"]},
        {"corr": "the authorities", "dist": ["authorities the", "an authorities", "the authority", "to authorities"]},
        {"corr": "yesterday.", "dist": ["in yesterday.", "at yesterday.", "on yesterday.", "for yesterday."]}
    ]),
    s("Scarcely had", "به زحمت او وارد خانه شده بود که برق قطع شد.", [
        {"corr": "she stepped inside", "dist": ["she step inside", "stepped she inside", "she stepping inside", "she was step inside"]},
        {"corr": "when the power", "dist": ["than the power", "while the power", "then the power", "that the power"]},
        {"corr": "grid failed,", "dist": ["grid fail,", "failed grid,", "grid failing,", "grid was fail,"]},
        {"corr": "leaving the street", "dist": ["left the street", "leave the street", "leaves the street", "to leave the street"]},
        {"corr": "in darkness.", "dist": ["at darkness.", "with darkness.", "on darkness.", "under darkness."]}
    ]),
    s("In vain did", "آنها بیهوده تلاش کردند تا نظر هیئت‌مدیره را تغییر دهند.", [
        {"corr": "the delegates try", "dist": ["the delegates tried", "delegates the try", "tried the delegates", "the delegates trying"]},
        {"corr": "to persuade the", "dist": ["for persuade the", "persuading the", "to persuading the", "persuade the"]},
        {"corr": "committee to delay", "dist": ["committee delaying", "committee for delay", "committee delay", "committee to delaying"]},
        {"corr": "the final vote", "dist": ["final vote the", "the vote final", "a final vote", "vote final the"]},
        {"corr": "until Monday.", "dist": ["to Monday.", "by Monday.", "at Monday.", "for Monday."]}
    ]),
    s("Under no circumstances", "تحت هیچ شرایطی اجازه ندهید افراد بدون کارت وارد شوند.", [
        {"corr": "should visitors be", "dist": ["visitors should be", "should be visitors", "shall visitors be", "visitors shall be"]},
        {"corr": "permitted to enter", "dist": ["permit to enter", "permitting to enter", "permitted enter", "permitted for enter"]},
        {"corr": "the secure facility", "dist": ["facility secure the", "the facility secure", "a secure facility", "secure facility the"]},
        {"corr": "without official", "dist": ["with no official", "with not official", "except official", "unless official"]},
        {"corr": "identification.", "dist": ["identity.", "identifying.", "identified.", "to identification."]}
    ]),
    s("Nowhere in", "در هیچ کجای دنیا چنین مردم مهمان‌نوازی پیدا نخواهید کرد.", [
        {"corr": "the world will", "dist": ["world the will", "the world would", "will the world", "the world do"]},
        {"corr": "you encounter such", "dist": ["encounter you such", "you encounter so", "you encountered such", "encounter you so"]},
        {"corr": "warm and genuine", "dist": ["warmly and genuine", "warm and genuinely", "warm with genuine", "genuine and warm"]},
        {"corr": "kindness among", "dist": ["kind among", "kindly among", "kindness between", "kindness in"]},
        {"corr": "strangers.", "dist": ["people.", "travelers.", "neighbors.", "to strangers."]}
    ]),
    s("Seldom has", "به ندرت یک کشف علمی چنین تاثیری بر پزشکی گذاشته است.", [
        {"corr": "a single discovery", "dist": ["single a discovery", "a discovery single", "the single discovery", "discovery a single"]},
        {"corr": "produced such an", "dist": ["produce such an", "producing such an", "produced so an", "produced such a"]},
        {"corr": "immense impact on", "dist": ["immense an impact on", "impact immense on", "immensely impact on", "immense impact at"]},
        {"corr": "modern medical", "dist": ["medical modern", "the modern medical", "a modern medical", "modernly medical"]},
        {"corr": "science.", "dist": ["scientific.", "scientist.", "sciences.", "to science."]}
    ]),
    s("Not for a", "او حتی برای یک ثانیه هم در درستی تصمیم خود تردید نکرد.", [
        {"corr": "second did she", "dist": ["second she did", "second did her", "second had she", "second was she"]},
        {"corr": "doubt the wisdom", "dist": ["doubted the wisdom", "doubting the wisdom", "doubt wisdom the", "doubt the wise"]},
        {"corr": "of choosing to", "dist": ["in choosing to", "for choosing to", "to choose to", "of choose to"]},
        {"corr": "pursue her lifelong", "dist": ["pursuing her lifelong", "pursued her lifelong", "pursue lifelong her", "pursue her life"]},
        {"corr": "dream.", "dist": ["ambition.", "goal.", "wishes.", "to dream."]}
    ]),
    s("Little did", "او اصلاً خبر نداشت که همکارانش برایش هدیه‌ای تدارک دیده‌اند.", [
        {"corr": "he suspect that", "dist": ["he suspected that", "suspect he that", "he suspecting that", "did he suspect that"]},
        {"corr": "his colleagues had", "dist": ["colleagues his had", "his colleagues have", "his colleague had", "had his colleagues"]},
        {"corr": "arranged a farewell", "dist": ["arrange a farewell", "arranging a farewell", "arranged farewell a", "arranged the farewell"]},
        {"corr": "gathering in his", "dist": ["gather in his", "gatherings in his", "gathering at his", "gathering for his"]},
        {"corr": "honor.", "dist": ["honoring.", "honored.", "honorable.", "to honor."]}
    ]),
    s("Only by", "تنها با همکاری و خرد جمعی می‌توان این بحران را حل کرد.", [
        {"corr": "working together can", "dist": ["work together can", "working together could", "working together do", "together working can"]},
        {"corr": "we hope to", "dist": ["hope we to", "we hoping to", "we hoped to", "we hope for"]},
        {"corr": "overcome these complex", "dist": ["overcame these complex", "overcoming these complex", "overcome this complex", "overcome complex these"]},
        {"corr": "challenges facing", "dist": ["challenge facing", "challenges face", "challenges faced", "challenging facing"]},
        {"corr": "our society.", "dist": ["society our.", "the society our.", "a society our.", "to society."]}
    ]),
    s("On no account", "به هیچ وجه نباید جزئیات مالی این قرارداد فاش شود.", [
        {"corr": "should confidential data", "dist": ["confidential data should", "should data confidential", "shall confidential data", "data confidential should"]},
        {"corr": "be disclosed to", "dist": ["disclose to", "being disclosed to", "disclosed be to", "to be disclosed to"]},
        {"corr": "external parties without", "dist": ["parties external without", "external party without", "parties external with no", "external parties unless"]},
        {"corr": "explicit written", "dist": ["explicit write", "explicitly written", "written explicit", "an explicit written"]},
        {"corr": "consent.", "dist": ["agreement.", "permission.", "consenting.", "to consent."]}
    ]),
    s("At no time", "او در هیچ مقطعی از مسیر تعهد خود به صداقت را رها نکرد.", [
        {"corr": "did he compromise", "dist": ["he compromised did", "he compromise did", "did compromise he", "did he compromised"]},
        {"corr": "his high moral", "dist": ["high moral his", "his morally high", "the his high moral", "he high moral"]},
        {"corr": "principles despite", "dist": ["principle despite", "principled despite", "principles in spite", "principles although"]},
        {"corr": "enormous commercial", "dist": ["enormously commercial", "commercial enormous", "the enormous commercial", "an enormous commercial"]},
        {"corr": "pressure.", "dist": ["stress.", "pressured.", "pressuring.", "to pressure."]}
    ]),
    s("Scarcely had", "به زحمت هواپیما فرود آمده بود که مسافران گوشی‌های خود را روشن کردند.", [
        {"corr": "the flight touched", "dist": ["flight the touched", "the flight touch", "touched the flight", "the flight touching"]},
        {"corr": "down when mobile", "dist": ["down than mobile", "down while mobile", "down then mobile", "down that mobile"]},
        {"corr": "phones began to", "dist": ["phone began to", "phones begin to", "phones beginning to", "phones begun to"]},
        {"corr": "chime throughout the", "dist": ["ring throughout the", "chime across the", "chiming throughout the", "chime in the"]},
        {"corr": "cabin.", "dist": ["plane.", "aircraft.", "cabins.", "to cabin."]}
    ]),
    s("In vain did", "دانشمندان بیهوده کوشیدند تا نظریه منسوخ را احیا کنند.", [
        {"corr": "the theorists seek", "dist": ["the theorists sought", "theorists the seek", "sought the theorists", "the theorists seeking"]},
        {"corr": "to defend the", "dist": ["for defend the", "defending the", "to defending the", "defend the"]},
        {"corr": "flawed model against", "dist": ["flaw model against", "model flawed against", "flawed model with", "flawed model at"]},
        {"corr": "growing empirical", "dist": ["grow empirical", "grown empirical", "empirical growing", "growth empirical"]},
        {"corr": "evidence.", "dist": ["proof.", "evidences.", "evident.", "to evidence."]}
    ]),
    s("Under no circumstances", "تحت هیچ شرایطی کلید اصلی سرور نباید گم شود.", [
        {"corr": "must the primary", "dist": ["the primary must", "must primary the", "shall the primary", "primary the must"]},
        {"corr": "security credentials be", "dist": ["credentials security be", "security credential be", "security credentials being", "credentials security being"]},
        {"corr": "shared across unsecured", "dist": ["share across unsecured", "sharing across unsecured", "shared in unsecured", "shared on unsecured"]},
        {"corr": "messaging platforms", "dist": ["platform messaging", "messaging platform", "platforms messaging", "message platforms"]},
        {"corr": "online.", "dist": ["at online.", "in online.", "on online.", "by online."]}
    ]),
    s("Nowhere else", "در هیچ جای دیگری چنین هماهنگی شگفت‌آوری میان سنت و مدرنیته دیده نمی‌شود.", [
        {"corr": "does one observe", "dist": ["one observes does", "one observe does", "does observe one", "did one observe"]},
        {"corr": "such exquisite harmony", "dist": ["so exquisite harmony", "such harmony exquisite", "harmony such exquisite", "so harmony exquisite"]},
        {"corr": "between ancient heritage", "dist": ["among ancient heritage", "with ancient heritage", "between heritage ancient", "for ancient heritage"]},
        {"corr": "and futuristic urban", "dist": ["and future urban", "and urban futuristic", "with futuristic urban", "or futuristic urban"]},
        {"corr": "design.", "dist": ["architecture.", "planning.", "designs.", "to design."]}
    ]),
    s("Seldom do", "به ندرت منتقدان سینما به اتفاق آرا یک اثر را تحسین می‌کنند.", [
        {"corr": "film critics reach", "dist": ["critics film reach", "film critics reaches", "reach film critics", "film critics reached"]},
        {"corr": "such unanimous praise", "dist": ["so unanimous praise", "such praise unanimous", "praise such unanimous", "so praise unanimous"]},
        {"corr": "for an independent", "dist": ["to an independent", "at an independent", "with an independent", "in an independent"]},
        {"corr": "low budget feature", "dist": ["feature low budget", "budget low feature", "low feature budget", "budget feature low"]},
        {"corr": "film.", "dist": ["movie.", "cinema.", "films.", "to film."]}
    ]),
    s("Not for one", "ما حتی برای یک لحظه نیز تعهد خود را فراموش نکردیم.", [
        {"corr": "moment did we", "dist": ["moment we did", "moment did us", "moment had we", "moment was we"]},
        {"corr": "waver in our", "dist": ["wavered in our", "wavering in our", "waver at our", "waver on our"]},
        {"corr": "resolve to finish", "dist": ["resolution to finish", "resolve for finish", "resolve finishing", "to resolve to finish"]},
        {"corr": "the monumental", "dist": ["monument the", "a monumental", "monumentally the", "the monument"]},
        {"corr": "undertaking.", "dist": ["task.", "project.", "effort.", "to undertake."]}
    ]),
    s("Little were", "آنها اصلاً خبر نداشتند که چه تحولات بزرگی در انتظارشان است.", [
        {"corr": "they aware of", "dist": ["they aware about", "aware they of", "they awareness of", "they aware in"]},
        {"corr": "the profound changes", "dist": ["profound the changes", "the changes profound", "a profound changes", "changes profound the"]},
        {"corr": "awaiting their return", "dist": ["await their return", "awaited their return", "awaiting return their", "for await their return"]},
        {"corr": "after many years", "dist": ["before many years", "during many years", "in many years", "at many years"]},
        {"corr": "in exile.", "dist": ["at exile.", "on exile.", "with exile.", "for exile."]}
    ]),
    s("Only through", "تنها از طریق گفتگوی صادقانه می‌توان اعتماد از دست رفته را بازیافت.", [
        {"corr": "genuine dialogue can", "dist": ["dialogue genuine can", "genuine dialogue could", "genuine dialogue do", "dialogue genuine do"]},
        {"corr": "lasting trust be", "dist": ["trust lasting be", "lasting trust being", "trust lasting being", "lasting trust been"]},
        {"corr": "rebuilt among all", "dist": ["rebuild among all", "rebuilding among all", "rebuilt between all", "rebuilt with all"]},
        {"corr": "participating members", "dist": ["members participating", "participated members", "member participating", "participating member"]},
        {"corr": "of the council.", "dist": ["in the council.", "at council the.", "for the council.", "to the council."]}
    ])
]

# ==============================================================================
# Stage C2.7: Advanced Nominalization & Verb Stems
# Her sudden departure, The immediate cancellation, His calm response
# ==============================================================================
c2_data["7"] = [
    s("Her sudden", "خروج ناگهانی او از شرکت همه همکاران را شگفت‌زده کرد.", [
        {"corr": "departure from the", "dist": ["depart from the", "departing from the", "departure of the", "departure in the"]},
        {"corr": "firm surprised all", "dist": ["firm surprise all", "firm surprising all", "firm surprised to all", "firm was surprise all"]},
        {"corr": "her colleagues on", "dist": ["her colleague on", "colleagues her on", "she colleagues on", "her colleagues at"]},
        {"corr": "the executive team", "dist": ["team executive the", "the team executive", "an executive team", "executive team the"]},
        {"corr": "yesterday.", "dist": ["in yesterday.", "at yesterday.", "on yesterday.", "for yesterday."]}
    ]),
    s("The immediate", "لغو فوری مسابقه از آسیب‌دیدگی تماشاگران جلوگیری کرد.", [
        {"corr": "cancellation of the", "dist": ["cancel of the", "cancelling of the", "cancellation in the", "cancellation for the"]},
        {"corr": "match prevented any", "dist": ["game prevent any", "match preventing any", "match prevents any", "matches prevented any"]},
        {"corr": "serious injuries among", "dist": ["injury serious among", "serious injury among", "seriously injuries among", "serious injuries between"]},
        {"corr": "the spectators in", "dist": ["spectators the in", "the spectator in", "a spectators in", "spectators in the"]},
        {"corr": "the storm.", "dist": ["storm the.", "a storm.", "storms the.", "to storm."]}
    ]),
    s("His calm", "پاسخ سنجیده و آرام او به انتقادات تنش جلسه را کاهش داد.", [
        {"corr": "response to harsh", "dist": ["respond to harsh", "responding to harsh", "response at harsh", "response with harsh"]},
        {"corr": "criticism defused the", "dist": ["critic defused the", "critical defused the", "criticisms defuse the", "criticism defusing the"]},
        {"corr": "tense atmosphere among", "dist": ["tension atmosphere among", "tensed atmosphere among", "atmosphere tense among", "tensely atmosphere among"]},
        {"corr": "the frustrated board", "dist": ["the frustrating board", "frustrated the board", "a frustrated board", "the board frustrated"]},
        {"corr": "members.", "dist": ["member.", "membership.", "people.", "to members."]}
    ]),
    s("The rapid", "توسعه سریع سامانه قطار شهری عبور و مرور را دگرگون ساخت.", [
        {"corr": "expansion of the", "dist": ["expand of the", "expanding of the", "expansion in the", "expansion for the"]},
        {"corr": "transit network has", "dist": ["network transit has", "transit networks has", "transit network have", "network transiting has"]},
        {"corr": "greatly improved daily", "dist": ["great improved daily", "greatly improve daily", "greatly improving daily", "improved greatly daily"]},
        {"corr": "commutes across the", "dist": ["commute across the", "commutes in the", "commutes over the", "commuting across the"]},
        {"corr": "metropolis.", "dist": ["city.", "capital.", "town.", "to metropolis."]}
    ]),
    s("Her complete", "فداکاری تمام‌عیار او برای تدریس، صدها دانش‌آموز را به وجد آورد.", [
        {"corr": "dedication to teaching", "dist": ["dedicate to teaching", "dedicating to teaching", "dedication for teach", "dedication to teach"]},
        {"corr": "inspired hundreds of", "dist": ["inspire hundreds of", "inspiring hundreds of", "inspired hundred of", "inspiration hundreds of"]},
        {"corr": "young students to", "dist": ["student young to", "young student to", "youth students to", "young students for"]},
        {"corr": "pursue academic careers", "dist": ["pursuing academic careers", "pursued academic careers", "pursue careers academic", "pursue academic career"]},
        {"corr": "in science.", "dist": ["at science.", "with science.", "for science.", "to science."]}
    ]),
    s("The sudden", "افزایش ناگهانی هزینه‌های زندگی بسیاری از خانواده‌ها را نگران کرد.", [
        {"corr": "escalation in living", "dist": ["escalate in living", "escalating in living", "escalation of life", "escalation for living"]},
        {"corr": "costs caused severe", "dist": ["cost caused severe", "costs cause severe", "costs causing severe", "costs caused severely"]},
        {"corr": "financial strain on", "dist": ["strain financial on", "financial strained on", "finances strain on", "financially strain on"]},
        {"corr": "working families across", "dist": ["work families across", "family working across", "working family across", "worked families across"]},
        {"corr": "the nation.", "dist": ["nation the.", "a nation.", "nations the.", "to nation."]}
    ]),
    s("Their persistent", "امتناع مداوم آنها از سازش، مذاکرات را به بن‌بست کشاند.", [
        {"corr": "refusal to compromise", "dist": ["refuse to compromise", "refusing to compromise", "refusal for compromise", "refusal of compromise"]},
        {"corr": "led to an", "dist": ["lead to an", "leading to an", "led to a", "leads to an"]},
        {"corr": "unavoidable deadlock in", "dist": ["deadlock unavoidable in", "avoidable deadlock in", "unavoidably deadlock in", "an unavoidable deadlock"]},
        {"corr": "the bilateral trade", "dist": ["bilateral the trade", "the trade bilateral", "a bilateral trade", "trade bilateral the"]},
        {"corr": "negotiations.", "dist": ["talks.", "meeting.", "negotiate.", "to negotiate."]}
    ]),
    s("The widespread", "شناخت گسترده دستاوردهای پژوهشی او جوایز فراوانی به همراه داشت.", [
        {"corr": "recognition of her", "dist": ["recognize of her", "recognizing of her", "recognition for her", "recognition in her"]},
        {"corr": "scientific work brought", "dist": ["work scientific brought", "scientific works brought", "scientific work bring", "scientifically work brought"]},
        {"corr": "numerous international honors", "dist": ["honors numerous international", "international numerous honors", "numerous honor international", "numbered international honors"]},
        {"corr": "to her university", "dist": ["at her university", "for her university", "with university her", "in her university"]},
        {"corr": "department.", "dist": ["faculty.", "institution.", "center.", "to department."]}
    ]),
    s("His thoughtful", "رویکرد متفکرانه او به برنامه‌ریزی شهری جوایز متعددی دریافت کرد.", [
        {"corr": "approach to urban", "dist": ["approaching to urban", "approached to urban", "approach in urban", "approach for urban"]},
        {"corr": "planning earned widespread", "dist": ["plan earned widespread", "planning earning widespread", "planned earned widespread", "planning earns widespread"]},
        {"corr": "praise from modern", "dist": ["praises from modern", "praised from modern", "praising from modern", "praise of modern"]},
        {"corr": "architects across the", "dist": ["architect across the", "architecture across the", "architects in the", "architects over the"]},
        {"corr": "country.", "dist": ["nation.", "world.", "region.", "to country."]}
    ]),
    s("The thorough", "تحقیق همه‌جانبه درباره تخلفات مالی اعتماد عمومی را بازگرداند.", [
        {"corr": "investigation into the", "dist": ["investigate into the", "investigating into the", "investigation in the", "investigation of the"]},
        {"corr": "financial misconduct restored", "dist": ["misconduct financial restored", "financial misconduct restore", "financially misconduct restored", "financial conduct restored"]},
        {"corr": "public confidence in", "dist": ["confidence public in", "public confident in", "publical confidence in", "public confide in"]},
        {"corr": "the oversight committee", "dist": ["committee oversight the", "the committee oversight", "an oversight committee", "oversight committee the"]},
        {"corr": "swiftly.", "dist": ["swift.", "in swift.", "swiftness.", "with swift."]}
    ]),
    s("Her sharp", "درک تیزبینانه او از پویایی بازار تصمیم‌گیری را تسریع کرد.", [
        {"corr": "comprehension of market", "dist": ["comprehend of market", "comprehending of market", "comprehension in market", "comprehension for market"]},
        {"corr": "dynamics enabled rapid", "dist": ["dynamic enabled rapid", "dynamics enable rapid", "dynamism enabled rapid", "dynamics enabling rapid"]},
        {"corr": "decision making under", "dist": ["make decision under", "deciding making under", "decision made under", "decisions making under"]},
        {"corr": "intense pressure from", "dist": ["intensely pressure from", "pressure intense from", "intense pressurized from", "intensity pressure from"]},
        {"corr": "competitors.", "dist": ["rivals.", "companies.", "competitor.", "to competitors."]}
    ]),
    s("The gradual", "ناپدید شدن تدریجی گونه‌های بومی زنگ خطر را به صدا درآورد.", [
        {"corr": "disappearance of native", "dist": ["disappear of native", "disappearing of native", "disappearance in native", "disappearance for native"]},
        {"corr": "species triggered urgent", "dist": ["specie triggered urgent", "species trigger urgent", "species triggering urgent", "speciation triggered urgent"]},
        {"corr": "calls for habitat", "dist": ["call for habitat", "calling for habitat", "calls in habitat", "calls of habitat"]},
        {"corr": "conservation across the", "dist": ["conserve across the", "conserving across the", "conservation in the", "conservation over the"]},
        {"corr": "region.", "dist": ["area.", "zone.", "territory.", "to region."]}
    ]),
    s("Their prompt", "اقدام به‌موقع آنها در مهار نشت گاز فاجعه را دفع کرد.", [
        {"corr": "intervention in the", "dist": ["intervene in the", "intervening in the", "intervention at the", "intervention into the"]},
        {"corr": "crisis averted a", "dist": ["crisis avert a", "crises averted a", "crisis averting a", "crisis averted an"]},
        {"corr": "potential disaster for", "dist": ["potentially disaster for", "disaster potential for", "potential disastrous for", "potency disaster for"]},
        {"corr": "the nearby residential", "dist": ["nearby residential the", "the residential nearby", "a nearby residential", "residential nearby the"]},
        {"corr": "community.", "dist": ["neighborhood.", "society.", "district.", "to community."]}
    ]),
    s("His articulate", "بیان شیوا و رسا از طرح‌های آینده هیئت‌مدیره را قانع ساخت.", [
        {"corr": "presentation of the", "dist": ["present of the", "presenting of the", "presentation in the", "presentation for the"]},
        {"corr": "proposed reforms convinced", "dist": ["propose reforms convinced", "reform proposed convinced", "proposed reforming convinced", "proposed reform convince"]},
        {"corr": "all stakeholders to", "dist": ["stakeholder all to", "all stakeholder to", "stakeholders all to", "all stakeholders for"]},
        {"corr": "endorse the strategic", "dist": ["endorsing the strategic", "endorsed the strategic", "endorsement the strategic", "endorse strategy the"]},
        {"corr": "initiative.", "dist": ["plan.", "program.", "effort.", "to initiative."]}
    ]),
    s("The precise", "اندازه‌گیری دقیق فاصله‌ها امکان ساخت دقیق را فراهم آورد.", [
        {"corr": "measurement of these", "dist": ["measure of these", "measuring of these", "measurement in these", "measurements for these"]},
        {"corr": "distances enabled exact", "dist": ["distance enabled exact", "distances enable exact", "distances enabling exact", "distances enabled exactly"]},
        {"corr": "assembly of the", "dist": ["assemble of the", "assembling of the", "assemblage of the", "assembly in the"]},
        {"corr": "structural components at", "dist": ["component structural at", "components structure at", "structurally components at", "components structural in"]},
        {"corr": "the factory.", "dist": ["factory the.", "a factory.", "factories the.", "to factory."]}
    ]),
    s("Her constant", "تلاش خستگی‌ناپذیر او برای بهبود کیفیت بازدهی تیم را افزایش داد.", [
        {"corr": "pursuit of excellence", "dist": ["pursue of excellence", "pursuing of excellence", "pursuit for excellence", "pursuit in excellence"]},
        {"corr": "elevated standards across", "dist": ["elevate standards across", "elevating standards across", "elevated standard across", "elevation standards across"]},
        {"corr": "every project managed", "dist": ["all project managed", "project every managed", "every projects managed", "each project manage"]},
        {"corr": "by her dedicated", "dist": ["with her dedicated", "from her dedicated", "at her dedicated", "for her dedicated"]},
        {"corr": "group.", "dist": ["team.", "department.", "division.", "to group."]}
    ]),
    s("The successful", "پیاده‌سازی موفق نرم‌افزار جدید هزینه‌ها را کاهش داد.", [
        {"corr": "implementation of new", "dist": ["implement of new", "implementing of new", "implementation in new", "implementation for new"]},
        {"corr": "software lowered operating", "dist": ["softwares lowered operating", "software lower operating", "software lowering operating", "software lowered operated"]},
        {"corr": "expenses significantly for", "dist": ["expense significantly for", "expenses significant for", "expenditure significantly for", "expenses significantly in"]},
        {"corr": "the retail enterprise", "dist": ["enterprise retail the", "the enterprise retail", "a retail enterprise", "retail enterprise the"]},
        {"corr": "this quarter.", "dist": ["in this quarter.", "at quarter this.", "on quarter this.", "for quarter."]}
    ]),
    s("His modest", "توصیف متواضعانه او از دستاوردهایش مورد تمجید دیگران واقع شد.", [
        {"corr": "portrayal of his", "dist": ["portray of his", "portraying of his", "portrayal in his", "portrayal for his"]},
        {"corr": "achievements earned him", "dist": ["achievement earned him", "achievements earn him", "achievements earning him", "achieved earned him"]},
        {"corr": "wide admiration from", "dist": ["widely admiration from", "admiration wide from", "width admiration from", "wide admire from"]},
        {"corr": "peers in the", "dist": ["peer in the", "peers at the", "peering in the", "peers on the"]},
        {"corr": "academic world.", "dist": ["academy world.", "world academic.", "scholarly world.", "to world."]}
    ]),
    s("The rigorous", "اعتبارسنجی دقیق داده‌ها صحت نتایج را به اثبات رساند.", [
        {"corr": "verification of all", "dist": ["verify of all", "verifying of all", "verification in all", "verification for all"]},
        {"corr": "sources guaranteed the", "dist": ["source guaranteed the", "sources guarantee the", "sources guaranteeing the", "sources guaranteed a"]},
        {"corr": "accuracy of the", "dist": ["accurate of the", "accurately of the", "accurateness of the", "accuracy in the"]},
        {"corr": "final published research", "dist": ["publish final research", "final publishing research", "research final published", "final published researcher"]},
        {"corr": "findings.", "dist": ["results.", "report.", "papers.", "to findings."]}
    ]),
    s("Her insightful", "تحلیل موشکافانه او از داده‌ها چشم‌اندازهای نوینی گشود.", [
        {"corr": "critique of current", "dist": ["critic of current", "criticize of current", "critiquing of current", "critique in current"]},
        {"corr": "policies stimulated fresh", "dist": ["policy stimulated fresh", "policies stimulate fresh", "policies stimulating fresh", "policy stimulation fresh"]},
        {"corr": "debate among elected", "dist": ["debates among elected", "debating among elected", "debate between elected", "debate in elected"]},
        {"corr": "officials in the", "dist": ["official in the", "officials at the", "officially in the", "officials on the"]},
        {"corr": "legislature.", "dist": ["parliament.", "congress.", "assembly.", "to legislature."]}
    ])
]

# ==============================================================================
# Stage C2.8: Reduced Concession & Prepositional Participles
# Despite feeling exhausted, In spite of arriving late, Notwithstanding the rain
# ==============================================================================
c2_data["8"] = [
    s("Despite feeling", "علیرغم احساس خستگی شدید، او تا اتمام کامل گزارش پشت میز نشست.", [
        {"corr": "exhausted, she remained", "dist": ["exhausting, she remained", "exhaust, she remained", "exhausted she remained", "exhausted, she remain"]},
        {"corr": "at her desk until", "dist": ["in her desk until", "on her desk until", "to her desk until", "at her desk while"]},
        {"corr": "she had completed", "dist": ["she completed", "she has completed", "completed she had", "had she completed"]},
        {"corr": "the financial summary", "dist": ["summary financial the", "the summary financial", "a financial summary", "financial summary the"]},
        {"corr": "in full.", "dist": ["at full.", "with full.", "on full.", "for full."]}
    ]),
    s("In spite of", "علیرغم رسیدن با تاخیر به هتل، پذیرش اتاق بدون معطلی انجام شد.", [
        {"corr": "arriving very late,", "dist": ["arrive very late,", "arrived very late,", "to arrive very late,", "arriving late very,"]},
        {"corr": "the travelers were", "dist": ["the travelers was", "travelers the were", "were the travelers", "the traveler were"]},
        {"corr": "checked in without", "dist": ["checking in without", "checked at without", "check in without", "checked into without"]},
        {"corr": "any inconvenient delay", "dist": ["inconvenient any delay", "some inconvenient delay", "any delay inconvenient", "an inconvenient delay"]},
        {"corr": "at midnight.", "dist": ["in midnight.", "on midnight.", "by midnight.", "for midnight."]}
    ]),
    s("Notwithstanding the", "علیرغم آب و هوای بارانی، صدها هوادار در ورزشگاه جمع شدند.", [
        {"corr": "inclement weather, hundreds", "dist": ["weather inclement, hundreds", "inclement weather hundreds", "inclemently weather, hundreds", "the inclement weather, hundreds"]},
        {"corr": "of loyal supporters", "dist": ["for loyal supporters", "with loyal supporters", "of supporter loyal", "of loyally supporters"]},
        {"corr": "gathered at the", "dist": ["gather at the", "gathering at the", "gathered in the", "gathered on the"]},
        {"corr": "stadium to cheer", "dist": ["arena to cheer", "stadium for cheer", "stadium cheering", "stadium to cheering"]},
        {"corr": "their team.", "dist": ["team their.", "the team their.", "a team their.", "to team."]}
    ]),
    s("Barring any", "به شرط عدم بروز نقص فنی، پرتاب فضاپیما طبق برنامه انجام خواهد شد.", [
        {"corr": "unforeseen technical glitches,", "dist": ["unforeseen glitches technical,", "technical unforeseen glitches,", "glitches unforeseen technical,", "unforeseen technical glitch,"]},
        {"corr": "the space mission", "dist": ["mission space the", "the mission space", "a space mission", "space mission the"]},
        {"corr": "will proceed according", "dist": ["would proceed according", "proceed will according", "will proceeds according", "will proceeding according"]},
        {"corr": "to the original", "dist": ["at the original", "with the original", "in the original", "for original the"]},
        {"corr": "flight plan.", "dist": ["plan flight.", "plane flight.", "plans flight.", "to flight plan."]}
    ]),
    s("Despite having", "علیرغم صرف زمان کافی، نتوانستیم تمام پرسش‌ها را پاسخ دهیم.", [
        {"corr": "plenty of time,", "dist": ["plenty time of,", "time plenty of,", "a plenty of time,", "plenty in time,"]},
        {"corr": "we were unable", "dist": ["we are unable", "unable we were", "were we unable", "we could unable"]},
        {"corr": "to answer every", "dist": ["for answer every", "answering every", "to answering every", "answer every"]},
        {"corr": "question in the", "dist": ["questions in the", "question at the", "question on the", "question with the"]},
        {"corr": "final exam.", "dist": ["exam final.", "test final.", "exams final.", "to final exam."]}
    ]),
    s("In spite of", "علیرغم نداشتن پیشینه مالی، او اصول سرمایه‌گذاری را سریع فرا گرفت.", [
        {"corr": "having no background", "dist": ["having not background", "have no background", "having without background", "had no background"]},
        {"corr": "in finance, she", "dist": ["at finance, she", "with finance, she", "for finance, she", "in financial, she"]},
        {"corr": "grasped the fundamental", "dist": ["grasp the fundamental", "grasped fundamental the", "grasping the fundamental", "grasped the fundamentally"]},
        {"corr": "principles of investment", "dist": ["principle of investment", "principles for investment", "principles in investment", "principles with investment"]},
        {"corr": "very quickly.", "dist": ["quickly very.", "very quick.", "so quick.", "much quickly."]}
    ]),
    s("Notwithstanding their", "علیرغم اختلافات پیشین، دو کشور معاهده تجاری را امضا کردند.", [
        {"corr": "earlier disagreements, both", "dist": ["earlier disagreement, both", "early disagreements, both", "both earlier disagreements,", "disagreements earlier, both"]},
        {"corr": "delegations signed the", "dist": ["delegation signed the", "delegations sign the", "delegations signing the", "signed both delegations the"]},
        {"corr": "bilateral economic treaty", "dist": ["treaty economic bilateral", "economic bilateral treaty", "a bilateral economic treaty", "bilateral the economic treaty"]},
        {"corr": "in a spirit", "dist": ["with a spirit", "at a spirit", "for a spirit", "in spirit a"]},
        {"corr": "of cooperation.", "dist": ["in cooperation.", "with cooperation.", "for cooperation.", "to cooperation."]}
    ]),
    s("Despite being", "علیرغم تجربه کم در مدیریت، او کارایی تیم را دو برابر کرد.", [
        {"corr": "relatively inexperienced, he", "dist": ["relative inexperienced, he", "relatively inexperience, he", "inexperienced relatively, he", "he relatively inexperienced,"]},
        {"corr": "managed to double", "dist": ["manage to double", "managing to double", "managed doubling", "managed for double"]},
        {"corr": "the overall output", "dist": ["output overall the", "the output overall", "an overall output", "overall output the"]},
        {"corr": "of the manufacturing", "dist": ["in the manufacturing", "for the manufacturing", "with manufacturing the", "at the manufacturing"]},
        {"corr": "plant.", "dist": ["facility.", "factory.", "unit.", "to plant."]}
    ]),
    s("In spite of", "علیرغم سرمای طاقت‌فرسای زمستان، کارگران ساختمانی به کار ادامه دادند.", [
        {"corr": "the bitter cold,", "dist": ["bitter the cold,", "the cold bitter,", "a bitter cold,", "cold bitter the,"]},
        {"corr": "the construction workers", "dist": ["workers construction the", "the worker construction", "construction the workers", "a construction workers"]},
        {"corr": "persevered until the", "dist": ["persevere until the", "persevering until the", "persevered while the", "persevered before the"]},
        {"corr": "foundations were poured", "dist": ["foundation were poured", "foundations was poured", "foundations poured were", "foundations are poured"]},
        {"corr": "successfully.", "dist": ["successful.", "in successful.", "success.", "with successful."]}
    ]),
    s("Barring an", "به شرط عدم وقوع بحران غیرمنتظره، صادرات نفت افزایش خواهد یافت.", [
        {"corr": "unanticipated downturn, the", "dist": ["unanticipated downturn the", "downturn unanticipated, the", "unanticipatedly downturn, the", "an unanticipated downturn the"]},
        {"corr": "country's export volume", "dist": ["export volume country's", "country export volume", "volume export country's", "the country export volume"]},
        {"corr": "is projected to", "dist": ["are projected to", "projected is to", "is project to", "is projecting to"]},
        {"corr": "rise steadily over", "dist": ["rose steadily over", "rising steadily over", "rise steady over", "rise steadily in"]},
        {"corr": "the coming year.", "dist": ["year coming the.", "next coming year.", "the next year coming.", "coming year the."]}
    ]),
    s("Despite facing", "علیرغم مواجهه با رقبای قدرتمند، این شرکت نوپا سهم بازار را افزایش داد.", [
        {"corr": "fierce competition, the", "dist": ["fiercely competition, the", "competition fierce, the", "fierce competitive, the", "the fierce competition"]},
        {"corr": "innovative startup expanded", "dist": ["innovate startup expanded", "startup innovative expanded", "innovative startup expand", "innovative startups expanded"]},
        {"corr": "its market share", "dist": ["it market share", "market share its", "its share market", "share its market"]},
        {"corr": "in the domestic", "dist": ["at the domestic", "on domestic the", "for domestic the", "with the domestic"]},
        {"corr": "retail sector.", "dist": ["sector retail.", "area retail.", "market retail.", "to retail sector."]}
    ]),
    s("In spite of", "علیرغم کمبود بودجه پژوهشی، محققان واکسن جدید را تولید کردند.", [
        {"corr": "severe funding shortages,", "dist": ["severely funding shortages,", "funding severe shortages,", "severe funded shortages,", "shortages severe funding,"]},
        {"corr": "the lab scientists", "dist": ["scientists lab the", "the scientist lab", "lab the scientists", "a lab scientists"]},
        {"corr": "developed a workable", "dist": ["develop a workable", "developing a workable", "developed workable a", "developed a work"]},
        {"corr": "formula for the", "dist": ["formulas for the", "formula in the", "formula at the", "formula with the"]},
        {"corr": "new vaccine.", "dist": ["vaccine new.", "a new vaccine.", "the vaccine new.", "to vaccine."]}
    ]),
    s("Notwithstanding public", "علیرغم تردیدهای عمومی، پارلمان لایحه نوسازی را تصویب کرد.", [
        {"corr": "skepticism, parliament passed", "dist": ["skeptical, parliament passed", "skepticism parliament passed", "skepticism, passed parliament", "skeptically, parliament passed"]},
        {"corr": "the controversial urban", "dist": ["controversial the urban", "the urban controversial", "a controversial urban", "controversially urban the"]},
        {"corr": "reform legislation by", "dist": ["reforms legislation by", "reform legislate by", "legislation reform by", "reform legislative by"]},
        {"corr": "a narrow margin", "dist": ["narrow a margin", "the narrow margin", "a margin narrow", "narrowly a margin"]},
        {"corr": "last week.", "dist": ["in last week.", "at last week.", "on last week.", "for last week."]}
    ]),
    s("Despite receiving", "علیرغم دریافت پیشنهادهای جذاب خارجی، او در زادگاهش ماند.", [
        {"corr": "lucrative overseas offers,", "dist": ["lucratively overseas offers,", "offers overseas lucrative,", "lucrative offer overseas,", "lucrative overseas offer,"]},
        {"corr": "the young surgeon", "dist": ["surgeon young the", "the surgeon young", "a young surgeon", "young surgeon the"]},
        {"corr": "chose to remain", "dist": ["choose to remain", "chosen to remain", "choosing to remain", "chose remaining"]},
        {"corr": "and serve her", "dist": ["and served her", "and serving her", "to serve her and", "and service her"]},
        {"corr": "home province.", "dist": ["province home.", "hometown province.", "native province.", "to home province."]}
    ]),
    s("In spite of", "علیرغم باران سیل‌آسا، رژه سنتی در میدان اصلی برگزار شد.", [
        {"corr": "the torrential rain,", "dist": ["torrential the rain,", "the rain torrential,", "a torrential rain,", "rain torrential the,"]},
        {"corr": "the cultural festival", "dist": ["festival cultural the", "the festival cultural", "a cultural festival", "cultural festival the"]},
        {"corr": "attracted thousands of", "dist": ["attract thousands of", "attracting thousands of", "attracted thousand of", "attraction thousands of"]},
        {"corr": "enthusiastic visitors to", "dist": ["enthusiastically visitors to", "visitors enthusiastic to", "enthusiastic visitor to", "enthusiasm visitors to"]},
        {"corr": "the city.", "dist": ["town.", "capital.", "center.", "to city."]}
    ]),
    s("Barring further", "به شرط عدم افزایش بیشتر قیمت نفت، تورم مهار خواهد شد.", [
        {"corr": "price hikes, inflation", "dist": ["price hike, inflation", "hikes price, inflation", "price hiking, inflation", "prices hike, inflation"]},
        {"corr": "should stabilize within", "dist": ["must stabilize within", "stabilize should within", "should stabilizes within", "should stabilizing within"]},
        {"corr": "the coming six", "dist": ["the next six", "coming the six", "the six coming", "a coming six"]},
        {"corr": "months according to", "dist": ["month according to", "months accord to", "months according with", "months according at"]},
        {"corr": "the analysts.", "dist": ["analysts the.", "the analysis.", "an analyst.", "to analysts."]}
    ]),
    s("Despite having", "علیرغم صرف سال‌ها تلاش بی‌وقفه، او ادعای برتری نکرد.", [
        {"corr": "dedicated his career", "dist": ["dedicate his career", "dedicating his career", "dedicated career his", "dedication his career"]},
        {"corr": "to the subject,", "dist": ["at the subject,", "for the subject,", "in the subject,", "with subject the,"]},
        {"corr": "he remained modest", "dist": ["he remain modest", "remained he modest", "he remained modestly", "he was remain modest"]},
        {"corr": "about his great", "dist": ["of his great", "at his great", "with his great", "in his great"]},
        {"corr": "contributions.", "dist": ["contribution.", "contribute.", "contributed.", "to contributions."]}
    ]),
    s("In spite of", "علیرغم هشدارهای متعدد کارشناسان، مسافران وارد دره خطرناک شدند.", [
        {"corr": "repeated official warnings,", "dist": ["repeat official warnings,", "repeatedly official warnings,", "warnings official repeated,", "official repeat warnings,"]},
        {"corr": "a few reckless", "dist": ["few a reckless", "a reckless few", "the few reckless", "reckless a few"]},
        {"corr": "tourists ventured deep", "dist": ["tourist ventured deep", "tourists venture deep", "tourists venturing deep", "tourists ventured deeply"]},
        {"corr": "into the hazardous", "dist": ["in the hazardous", "at the hazardous", "to hazardous the", "into hazardous the"]},
        {"corr": "canyon.", "dist": ["valley.", "gorge.", "mountain.", "to canyon."]}
    ]),
    s("Notwithstanding her", "علیرغم تردیدهای آغازین، او با اعتماد به نفس کنفرانس را اداره کرد.", [
        {"corr": "initial reservations, she", "dist": ["initial reservation, she", "initially reservations, she", "reservations initial, she", "she initial reservations,"]},
        {"corr": "guided the international", "dist": ["guide the international", "guiding the international", "guided international the", "guided an international"]},
        {"corr": "conference through contentious", "dist": ["conference in contentious", "conference with contentious", "conferencing through contentious", "conference through contentiously"]},
        {"corr": "debates to a", "dist": ["debate to a", "debates at a", "debating to a", "debates with a"]},
        {"corr": "consensual conclusion.", "dist": ["conclusion consensual.", "consensus conclusion.", "consensually conclusion.", "to consensual conclusion."]}
    ]),
    s("Despite suffering", "علیرغم تحمل شکست‌های متوالی، این تیم مصمم به پیروزی بود.", [
        {"corr": "recurrent setbacks, the", "dist": ["recurrently setbacks, the", "setbacks recurrent, the", "recurrent setback, the", "recurrent setting, the"]},
        {"corr": "squad refused to", "dist": ["squads refused to", "squad refuse to", "squad refusing to", "squad was refuse to"]},
        {"corr": "surrender their collective", "dist": ["surrendering their collective", "surrendered their collective", "surrender collective their", "surrender their collectively"]},
        {"corr": "dream of athletic", "dist": ["dreams of athletic", "dream for athletic", "dreaming of athletic", "dream in athletic"]},
        {"corr": "glory.", "dist": ["glorious.", "glories.", "in glory.", "to glory."]}
    ])
]

# ==============================================================================
# Stage C2.9: Impersonal Reporting with Perfect Forms
# The artist is rumored to have painted, He is believed to have fled
# ==============================================================================
c2_data["9"] = [
    s("The suspect is", "گفته می‌شود مظنون قبل از رسیدن پلیس از کشور گریخته است.", [
        {"corr": "believed to have", "dist": ["believed to", "believing to have", "believed having", "believe to have"]},
        {"corr": "fled the country", "dist": ["flee the country", "fled country the", "flying the country", "fleed the country"]},
        {"corr": "hours before security", "dist": ["hours ahead security", "hour before security", "hours prior security", "hours in security"]},
        {"corr": "forces surrounded the", "dist": ["force surrounded the", "forces surround the", "forces surrounding the", "surrounded forces the"]},
        {"corr": "building.", "dist": ["facility.", "house.", "premises.", "to building."]}
    ]),
    s("The ancient", "تصور می‌شود این کتیبه باستانی بیش از سه هزار سال قدمت داشته باشد.", [
        {"corr": "manuscript is estimated", "dist": ["manuscript estimated is", "manuscripts is estimated", "manuscript are estimated", "manuscript is estimate"]},
        {"corr": "to date back", "dist": ["to date", "dating back", "to dated back", "dated back"]},
        {"corr": "more than three", "dist": ["above than three", "over than three", "more of three", "three more than"]},
        {"corr": "millennia to the", "dist": ["millennium to the", "millennia at the", "millennia in the", "millennia for the"]},
        {"corr": "Bronze Age.", "dist": ["Age Bronze.", "Iron Age.", "Stone Age.", "to Bronze Age."]}
    ]),
    s("The prime", "شایعه شده است که نخست‌وزیر قصد دارد ماه آینده استعفا دهد.", [
        {"corr": "minister is rumored", "dist": ["minister rumored is", "minister is rumor", "ministers is rumored", "minister are rumored"]},
        {"corr": "to be contemplating", "dist": ["to contemplate", "contemplating to be", "to being contemplated", "contemplated to be"]},
        {"corr": "an early resignation", "dist": ["early an resignation", "a resignation early", "the early resignation", "an resign early"]},
        {"corr": "ahead of upcoming", "dist": ["before of upcoming", "prior to upcoming", "in front of upcoming", "ahead to upcoming"]},
        {"corr": "elections.", "dist": ["election.", "electing.", "elected.", "to elections."]}
    ]),
    s("The lost", "ادعا می‌شود این شهر گمشده زیر لایه‌های ضخیم شن مدفون شده است.", [
        {"corr": "settlement is claimed", "dist": ["settlement claimed is", "settlement is claim", "settlements is claimed", "settlement are claimed"]},
        {"corr": "to have been", "dist": ["to be", "having been", "to had been", "been to have"]},
        {"corr": "buried under thick", "dist": ["bury under thick", "burying under thick", "buried below thick", "buried beneath thick"]},
        {"corr": "layers of desert", "dist": ["layer of desert", "layers in desert", "layers with desert", "layers for desert"]},
        {"corr": "sand.", "dist": ["sands.", "sandy.", "dust.", "to sand."]}
    ]),
    s("The CEO is", "گفته می‌شود مدیرعامل به توافق محرمانه‌ای با سهامداران دست یافته است.", [
        {"corr": "understood to have", "dist": ["understood to", "understanding to have", "understood having", "understand to have"]},
        {"corr": "reached a confidential", "dist": ["reach a confidential", "reached confidential a", "reaching a confidential", "reached the confidential"]},
        {"corr": "settlement with the", "dist": ["settle with the", "settling with the", "settlement at the", "settlement in the"]},
        {"corr": "company's dissatisfied", "dist": ["dissatisfied company's", "company dissatisfied", "company's satisfy", "company's dissatisfaction"]},
        {"corr": "investors.", "dist": ["shareholders.", "partners.", "investor.", "to investors."]}
    ]),
    s("The painting is", "فرض بر این است که این اثر گرانبها در جنگ جهانی دوم به غارت رفته است.", [
        {"corr": "presumed to have", "dist": ["presumed to", "presuming to have", "presumed having", "presume to have"]},
        {"corr": "been looted during", "dist": ["looted during be", "been loot during", "being looted during", "looted been during"]},
        {"corr": "the chaotic retreat", "dist": ["chaotic the retreat", "the retreat chaotic", "a chaotic retreat", "retreat chaotic the"]},
        {"corr": "of occupation forces", "dist": ["of forces occupation", "in occupation forces", "by occupation forces", "with occupation forces"]},
        {"corr": "in 1944.", "dist": ["at 1944.", "on 1944.", "by 1944.", "for 1944."]}
    ]),
    s("The missing", "گزارش شده که قایق بادبانی گمشده بدون سرنشین در آب شناور بوده است.", [
        {"corr": "vessel was reported", "dist": ["vessel reported was", "vessels was reported", "vessel were reported", "vessel was report"]},
        {"corr": "to have been", "dist": ["to be", "having been", "to had been", "been to have"]},
        {"corr": "seen drifting without", "dist": ["saw drifting without", "see drifting without", "seen drift without", "seen drifted without"]},
        {"corr": "a crew off", "dist": ["the crew off", "a crew of", "crew a off", "a crew at"]},
        {"corr": "the coast.", "dist": ["coast the.", "a coast.", "coasts the.", "to coast."]}
    ]),
    s("The virus is", "تصور می‌شود ویروس ابتدا از طریق حیوانات وحشی به انسان سرایت کرده باشد.", [
        {"corr": "thought to have", "dist": ["thought to", "thinking to have", "thought having", "think to have"]},
        {"corr": "jumped species in", "dist": ["jump species in", "jumping species in", "jumped specie in", "jumped species at"]},
        {"corr": "a rural agricultural", "dist": ["rural an agricultural", "a agricultural rural", "the rural agricultural", "an rural agricultural"]},
        {"corr": "market several months", "dist": ["market some months", "markets several months", "market month several", "market several month"]},
        {"corr": "prior.", "dist": ["before.", "earlier.", "ahead.", "to prior."]}
    ]),
    s("The athlete is", "اذعان می‌شود که این ورزشکار یکی از بهترین‌های نسل خود است.", [
        {"corr": "acknowledged to be", "dist": ["acknowledged being", "acknowledge to be", "acknowledged been", "acknowledging to be"]},
        {"corr": "among the finest", "dist": ["between the finest", "among finest the", "in the finest", "among of the finest"]},
        {"corr": "sprinters ever to", "dist": ["sprinter ever to", "sprinters never to", "sprinters ever for", "sprinter ever for"]},
        {"corr": "represent her home", "dist": ["representing her home", "represented her home", "represent home her", "to represent her home"]},
        {"corr": "country.", "dist": ["nation.", "state.", "homeland.", "to country."]}
    ]),
    s("The castle is", "گفته می‌شود قلعه بر روی ویرانه‌های دژ کهن رومی بنا شده است.", [
        {"corr": "said to have", "dist": ["said to", "saying to have", "said having", "say to have"]},
        {"corr": "been constructed on", "dist": ["constructed on been", "been construct on", "being constructed on", "constructed been on"]},
        {"corr": "the ruins of", "dist": ["ruin of the", "the ruin of", "ruins the of", "a ruins of"]},
        {"corr": "an ancient Roman", "dist": ["ancient an Roman", "a ancient Roman", "the ancient Roman", "Roman ancient an"]},
        {"corr": "fortress.", "dist": ["castle.", "stronghold.", "citadel.", "to fortress."]}
    ]),
    s("The company is", "ادعا می‌شود این غول فناوری میلیاردها دلار در پژوهش هوش مصنوعی سرمایه‌گذاری کرده است.", [
        {"corr": "reputed to have", "dist": ["reputed to", "reputing to have", "reputed having", "repute to have"]},
        {"corr": "poured billions into", "dist": ["pour billions into", "pouring billions into", "poured billion into", "poured billions in"]},
        {"corr": "deep learning architectures", "dist": ["deep architectures learning", "deeply learning architectures", "deep learning architecture", "architecture deep learning"]},
        {"corr": "over the past", "dist": ["in the past", "across the past", "for the past", "during the past"]},
        {"corr": "five years.", "dist": ["years five.", "five year.", "the five years.", "past five years."]}
    ]),
    s("The documents are", "باور بر این است که اسناد برای چندین دهه در آرشیو محرمانه مخفی مانده‌اند.", [
        {"corr": "believed to have", "dist": ["believed to", "believing to have", "believed having", "believe to have"]},
        {"corr": "remained secret for", "dist": ["remain secret for", "remained secrecy for", "remaining secret for", "remained secretly for"]},
        {"corr": "more than half", "dist": ["above than half", "over than half", "more of half", "half more than"]},
        {"corr": "a century in", "dist": ["century a in", "the century in", "an century in", "a century at"]},
        {"corr": "the vault.", "dist": ["vault the.", "a vault.", "vaults the.", "to vault."]}
    ]),
    s("The politician is", "گزارش شده که این چهره سیاسی در معاملات مشکوک دست داشته است.", [
        {"corr": "alleged to have", "dist": ["alleged to", "alleging to have", "alleged having", "allege to have"]},
        {"corr": "benefited from illicit", "dist": ["benefit from illicit", "benefiting from illicit", "benefited in illicit", "benefited of illicit"]},
        {"corr": "real estate transactions", "dist": ["real transaction estate", "realty estate transactions", "estate real transactions", "real estate transaction"]},
        {"corr": "brokered by offshore", "dist": ["broker by offshore", "brokering by offshore", "brokered with offshore", "brokered at offshore"]},
        {"corr": "firms.", "dist": ["companies.", "agencies.", "corporations.", "to firms."]}
    ]),
    s("The artifact is", "حدس زده می‌شود این عتیقه برای مقاصد تشریفاتی مذهبی ساخته شده باشد.", [
        {"corr": "conjectured to have", "dist": ["conjectured to", "conjecturing to have", "conjectured having", "conjecture to have"]},
        {"corr": "served a ceremonial", "dist": ["serve a ceremonial", "serving a ceremonial", "served ceremonial a", "served the ceremonial"]},
        {"corr": "purpose in sacred", "dist": ["purposes in sacred", "purpose at sacred", "purpose for sacred", "purpose with sacred"]},
        {"corr": "rituals honoring the", "dist": ["ritual honoring the", "rituals honor the", "rituals honored the", "rituals for honor the"]},
        {"corr": "gods.", "dist": ["deities.", "spirits.", "idols.", "to gods."]}
    ]),
    s("The species is", "تصور می‌شد این گونه گیاهی منقرض شده، اما دوباره کشف شد.", [
        {"corr": "considered to have", "dist": ["considered to", "considering to have", "considered having", "consider to have"]},
        {"corr": "died out until", "dist": ["die out until", "dying out until", "died off until", "dead out until"]},
        {"corr": "botanists rediscovered a", "dist": ["botanist rediscovered a", "botanists rediscover a", "botanists rediscovering a", "rediscovered botanists a"]},
        {"corr": "thriving colony in", "dist": ["thrive colony in", "thriving colonies in", "colony thriving in", "a thriving colony in"]},
        {"corr": "the valley.", "dist": ["valley the.", "a valley.", "valleys the.", "to valley."]}
    ]),
    s("The author is", "گفته می‌شود این نویسنده شاهکارش را در دوران انزوا در جزیره نگاشته است.", [
        {"corr": "held to have", "dist": ["held to", "holding to have", "held having", "hold to have"]},
        {"corr": "composed his finest", "dist": ["compose his finest", "composing his finest", "composed finest his", "composed his fine"]},
        {"corr": "work while living", "dist": ["works while living", "work during living", "work while lived", "work while live"]},
        {"corr": "in seclusion on", "dist": ["at seclusion on", "with seclusion on", "in secluded on", "under seclusion on"]},
        {"corr": "the island.", "dist": ["island the.", "an island.", "islands the.", "to island."]}
    ]),
    s("The summit is", "انتظار می‌رود این اجلاس راه را برای پیمان‌های جدید باز کند.", [
        {"corr": "projected to pave", "dist": ["projected paving", "project to pave", "projected paved", "projecting to pave"]},
        {"corr": "the way for", "dist": ["way the for", "the path for", "way for the", "the road for"]},
        {"corr": "groundbreaking treaties across", "dist": ["treaties groundbreaking across", "groundbreaking treaty across", "groundbreak treaties across", "groundbreaking treaties in"]},
        {"corr": "multiple sectors of", "dist": ["multiple sector of", "multiplied sectors of", "multi sectors of", "multiple of sectors of"]},
        {"corr": "the economy.", "dist": ["economy the.", "an economy.", "economies the.", "to economy."]}
    ]),
    s("The patient is", "گزارش شده که وضعیت بیمار پس از جراحی رضایت‌بخش است.", [
        {"corr": "reported to be", "dist": ["reported being", "report to be", "reported been", "reporting to be"]},
        {"corr": "making satisfactory progress", "dist": ["make satisfactory progress", "making progress satisfactory", "making satisfactorily progress", "made satisfactory progress"]},
        {"corr": "following the complex", "dist": ["follow the complex", "followed the complex", "after the complex", "following complex the"]},
        {"corr": "procedure performed this", "dist": ["performed procedure this", "procedure perform this", "procedures performed this", "procedure performing this"]},
        {"corr": "morning.", "dist": ["in morning.", "at morning.", "on morning.", "for morning."]}
    ]),
    s("The bridge is", "تخمین زده می‌شود ساخت پل تا اواخر پاییز سال آینده تمام شود.", [
        {"corr": "anticipated to reach", "dist": ["anticipated reaching", "anticipate to reach", "anticipated reached", "anticipating to reach"]},
        {"corr": "completion by the", "dist": ["complete by the", "completing by the", "completion at the", "completion in the"]},
        {"corr": "autumn of next", "dist": ["fall of next", "autumn in next", "autumn for next", "autumn at next"]},
        {"corr": "year under the", "dist": ["year in the", "year with the", "year at the", "years under the"]},
        {"corr": "contract.", "dist": ["agreement.", "deal.", "contracts.", "to contract."]}
    ]),
    s("The scientist is", "او به عنوان یکی از پیشگامان فیزیک کوانتوم شناخته می‌شود.", [
        {"corr": "regarded as being", "dist": ["regarded to be", "regarded as be", "regard as being", "regarding as being"]},
        {"corr": "among the pioneers", "dist": ["between the pioneers", "among pioneer the", "in the pioneers", "among of the pioneers"]},
        {"corr": "of modern quantum", "dist": ["in modern quantum", "for modern quantum", "at modern quantum", "with modern quantum"]},
        {"corr": "mechanics in the", "dist": ["mechanic in the", "mechanical in the", "mechanics at the", "mechanics on the"]},
        {"corr": "twentieth century.", "dist": ["century twentieth.", "twentieth centuries.", "the twentieth century.", "to twentieth century."]}
    ])
]

# ==============================================================================
# Stage C2.10: Discourse Balancing & Advanced Rhetorical Inversion
# Only then did he realize, Not until then did we see, So great was the applause
# ==============================================================================
c2_data["10"] = [
    s("Only then did", "تنها در آن هنگام بود که او به ابعاد فداکاری‌های همکارانش پی برد.", [
        {"corr": "he comprehend the", "dist": ["he comprehended the", "comprehend he the", "he comprehends the", "did he comprehend"]},
        {"corr": "extent of the", "dist": ["extent in the", "extents of the", "extent for the", "the extent of"]},
        {"corr": "sacrifices made by", "dist": ["sacrifice made by", "sacrifices make by", "sacrifices making by", "made sacrifices by"]},
        {"corr": "his loyal team", "dist": ["team loyal his", "his loyalty team", "the his loyal team", "he loyal team"]},
        {"corr": "members.", "dist": ["member.", "people.", "staff.", "to members."]}
    ]),
    s("So intense was", "حرارت به قدری شدید بود که حتی عینک‌های محافظ آتش‌نشانان ذوب شد.", [
        {"corr": "the heat that", "dist": ["heat the that", "the heat which", "a heat that", "heat that the"]},
        {"corr": "protective gear began", "dist": ["protect gear began", "protective gears began", "protective gear begin", "protecting gear began"]},
        {"corr": "to melt within", "dist": ["melting within", "for melt within", "to melting within", "melt to within"]},
        {"corr": "minutes of entering", "dist": ["minute of entering", "minutes of enter", "minutes for enter", "minutes in enter"]},
        {"corr": "the blaze.", "dist": ["fire the.", "the fire.", "the furnace.", "to blaze."]}
    ]),
    s("Such was his", "اشتیاق او برای حقیقت به قدری بود که هر خطری را به جان خرید.", [
        {"corr": "passion for truth", "dist": ["passionate for truth", "passion of truth", "passion with truth", "a passion for truth"]},
        {"corr": "that he risked", "dist": ["which he risked", "that risked he", "that he risk", "what he risked"]},
        {"corr": "everything to expose", "dist": ["all to expose", "everything for expose", "everything exposing", "every thing to expose"]},
        {"corr": "the corporate corruption", "dist": ["corporate the corruption", "the corruption corporate", "a corporate corruption", "corruption corporate the"]},
        {"corr": "in court.", "dist": ["at court.", "on court.", "with court.", "for court."]}
    ]),
    s("Not until much", "تنها سال‌ها بعد بود که دانشمندان به ارزش این کشف پی بردند.", [
        {"corr": "later did researchers", "dist": ["later researchers did", "late did researchers", "later had researchers", "later were researchers"]},
        {"corr": "appreciate the true", "dist": ["appreciated the true", "appreciate true the", "appreciating the true", "appreciate the truth"]},
        {"corr": "significance of the", "dist": ["significant of the", "significance in the", "significance for the", "significance with the"]},
        {"corr": "early laboratory", "dist": ["laboratory early", "earlier laboratory", "the early laboratory", "an early laboratory"]},
        {"corr": "experiments.", "dist": ["experiment.", "trials.", "tests.", "to experiments."]}
    ]),
    s("Little did anyone", "هیچ‌کس حدس نمی‌زد که این جلسه کوتاه مسیر تاریخ را دگرگون کند.", [
        {"corr": "suspect that this", "dist": ["suspected that this", "suspect that these", "suspecting that this", "did suspect that this"]},
        {"corr": "brief encounter would", "dist": ["encounter brief would", "brief encounter will", "briefly encounter would", "encounter would brief"]},
        {"corr": "shape the future", "dist": ["shaped the future", "shaping the future", "shape future the", "shapes the future"]},
        {"corr": "course of international", "dist": ["courses of international", "course in international", "course for international", "course with international"]},
        {"corr": "diplomacy.", "dist": ["diplomatic.", "diplomats.", "politics.", "to diplomacy."]}
    ]),
    s("So profound was", "اندوه ناشی از آن ضایعه چنان عمیق بود که شهر در ماتم فرو رفت.", [
        {"corr": "the sorrow that", "dist": ["sorrow the that", "the sorrow which", "a sorrow that", "sorrow that the"]},
        {"corr": "public celebrations were", "dist": ["celebrations public were", "public celebration was", "publicly celebrations were", "celebrations were public"]},
        {"corr": "canceled across all", "dist": ["cancel across all", "canceling across all", "canceled in all", "cancellation across all"]},
        {"corr": "major provinces of", "dist": ["province major of", "major province of", "majors provinces of", "major provinces in"]},
        {"corr": "the realm.", "dist": ["country.", "state.", "nation.", "to realm."]}
    ]),
    s("Such were the", "موانع پیش رو چنان دشوار بود که بسیاری از ادامه راه منصرف شدند.", [
        {"corr": "obstacles that many", "dist": ["obstacle that many", "obstacles which many", "obstacles that much", "the obstacles that many"]},
        {"corr": "mountaineers chose to", "dist": ["mountaineer chose to", "mountaineers choose to", "mountaineers choosing to", "chose mountaineers to"]},
        {"corr": "turn back before", "dist": ["turning back before", "turned back before", "turn around before", "turn back ahead"]},
        {"corr": "reaching the dangerous", "dist": ["reach the dangerous", "reached the dangerous", "reaching dangerous the", "to reach the dangerous"]},
        {"corr": "crest.", "dist": ["peak.", "summit.", "top.", "to crest."]}
    ]),
    s("Only by embracing", "تنها با پذیرش نوآوری می‌توان در این عصر پرشتاب رقابت کرد.", [
        {"corr": "change can modern", "dist": ["change could modern", "change do modern", "changing can modern", "change modern can"]},
        {"corr": "enterprises thrive in", "dist": ["enterprise thrive in", "enterprises thriving in", "enterprises thrived in", "enterprises thrive at"]},
        {"corr": "an increasingly volatile", "dist": ["a increasingly volatile", "an volatile increasingly", "increasingly an volatile", "an increase volatile"]},
        {"corr": "global economic", "dist": ["economic global", "globally economic", "the global economic", "a global economic"]},
        {"corr": "landscape.", "dist": ["market.", "environment.", "arena.", "to landscape."]}
    ]),
    s("Not until the", "تنها پس از پایان آخرین مرحله بود که برنده مسابقه معلوم شد.", [
        {"corr": "final lap was", "dist": ["final lap were", "lap final was", "final laps was", "was final lap"]},
        {"corr": "the victor decided", "dist": ["the victor decide", "victor the decided", "decided the victor", "the victory decided"]},
        {"corr": "in a thrilling", "dist": ["at a thrilling", "with a thrilling", "in thrilling a", "for a thrilling"]},
        {"corr": "display of raw", "dist": ["display with raw", "displays of raw", "display in raw", "displaying of raw"]},
        {"corr": "speed.", "dist": ["pace.", "power.", "velocity.", "to speed."]}
    ]),
    s("So compelling were", "شواهد ارائه شده چنان قانع‌کننده بود که هیچ تردیدی باقی نگذاشت.", [
        {"corr": "the findings that", "dist": ["findings the that", "the findings which", "the finding was", "findings that the"]},
        {"corr": "the scientific jury", "dist": ["jury scientific the", "the jury scientific", "a scientific jury", "scientific jury the"]},
        {"corr": "voted unanimously to", "dist": ["vote unanimously to", "voting unanimously to", "voted unanimous to", "voted unanimously for"]},
        {"corr": "endorse the groundbreaking", "dist": ["endorsed the groundbreaking", "endorsing the groundbreaking", "endorsement the groundbreaking", "endorse groundbreaking the"]},
        {"corr": "hypothesis.", "dist": ["theory.", "proposal.", "model.", "to hypothesis."]}
    ]),
    s("Such was their", "تعهد و وفاداری آنها به قدری بود که هرگز یکدیگر را تنها نگذاشتند.", [
        {"corr": "allegiance that they", "dist": ["loyal that they", "allegiance which they", "allegiances that they", "their allegiance that"]},
        {"corr": "never abandoned each", "dist": ["ever abandoned each", "never abandon each", "abandoned never each", "never abandoning each"]},
        {"corr": "other even during", "dist": ["other also during", "other even in", "others even during", "other even while"]},
        {"corr": "the darkest hours", "dist": ["the dark hours", "darkest hours the", "a darkest hours", "the darker hours"]},
        {"corr": "of trial.", "dist": ["of tests.", "in trial.", "of ordeal.", "to trial."]}
    ]),
    s("Only after repeated", "تنها پس از آزمایش‌های مکرر بود که فرمولاسیون دارویی تایید شد.", [
        {"corr": "trials was the", "dist": ["trial was the", "trials were the", "trials did the", "was trials the"]},
        {"corr": "compound approved for", "dist": ["compounds approved for", "compound approve for", "compound approving for", "compound approved in"]},
        {"corr": "widespread clinical use", "dist": ["use widespread clinical", "clinical widespread use", "widespread clinically use", "a widespread clinical use"]},
        {"corr": "across specialized healthcare", "dist": ["in specialized healthcare", "at specialized healthcare", "for specialized healthcare", "with specialized healthcare"]},
        {"corr": "facilities.", "dist": ["centers.", "hospitals.", "institutions.", "to facilities."]}
    ]),
    s("Not until dusk", "تنها در هنگام غروب بود که کاروان به ورودی واحه رسید.", [
        {"corr": "did the weary", "dist": ["the weary did", "weary did the", "had the weary", "were the weary"]},
        {"corr": "caravan reach the", "dist": ["caravan reached the", "caravans reach the", "caravan reaching the", "reach caravan the"]},
        {"corr": "shelter of the", "dist": ["shelters of the", "shelter in the", "shelter with the", "sheltering of the"]},
        {"corr": "welcoming green", "dist": ["green welcoming", "welcome green", "welcoming a green", "the welcoming green"]},
        {"corr": "oasis.", "dist": ["palm trees.", "spring.", "haven.", "to oasis."]}
    ]),
    s("So dramatic was", "تغییر و تحول به قدری شگرف بود که چهره شهر غیرقابل‌شناسایی شد.", [
        {"corr": "the transformation that", "dist": ["transformation the that", "the transformation which", "a transformation that", "transformation that the"]},
        {"corr": "former residents could", "dist": ["resident former could", "former resident could", "residents former could", "former residents can"]},
        {"corr": "scarcely recognize their", "dist": ["scarce recognize their", "scarcely recognized their", "scarcely recognizing their", "recognize scarcely their"]},
        {"corr": "old childhood", "dist": ["childhood old", "elder childhood", "olden childhood", "former childhood"]},
        {"corr": "neighborhood.", "dist": ["district.", "street.", "quarter.", "to neighborhood."]}
    ]),
    s("Such was the", "وسعت فاجعه به قدری بود که امدادگران از سراسر جهان فراخوانده شدند.", [
        {"corr": "scale of destruction", "dist": ["scale in destruction", "scaling of destruction", "scale for destruction", "destructing scale"]},
        {"corr": "that aid agencies", "dist": ["which aid agencies", "that agency aid", "that aid agency", "what aid agencies"]},
        {"corr": "mobilized assistance from", "dist": ["mobilize assistance from", "mobilizing assistance from", "mobilized assist from", "mobilized assistance in"]},
        {"corr": "every corner of", "dist": ["all corner of", "corner every of", "every corners of", "each corner of"]},
        {"corr": "the globe.", "dist": ["world.", "planet.", "earth.", "to globe."]}
    ]),
    s("Only when all", "تنها وقتی تمام اسناد تایید شد، قرارداد نهایی امضا گردید.", [
        {"corr": "documents were verified", "dist": ["document were verified", "documents was verified", "verified were documents", "documents are verified"]},
        {"corr": "did the parties", "dist": ["parties the did", "had the parties", "the parties did", "were the parties"]},
        {"corr": "sign the binding", "dist": ["signed the binding", "sign binding the", "signing the binding", "sign a binding"]},
        {"corr": "corporate merger", "dist": ["merger corporate", "corporation merger", "corporate merging", "the corporate merger"]},
        {"corr": "agreement.", "dist": ["deal.", "contract.", "accord.", "to agreement."]}
    ]),
    s("Not until morning", "تنها با طلوع صبح بود که عمق فاجعه آشکار شد.", [
        {"corr": "did the full", "dist": ["the full did", "full did the", "had the full", "was the full"]},
        {"corr": "extent of damage", "dist": ["extents of damage", "extent in damage", "extent for damage", "extent of damages"]},
        {"corr": "become apparent to", "dist": ["became apparent to", "becoming apparent to", "become apparent at", "become apparently to"]},
        {"corr": "the local relief", "dist": ["relief local the", "the relief local", "a local relief", "local the relief"]},
        {"corr": "workers.", "dist": ["crews.", "teams.", "volunteers.", "to workers."]}
    ]),
    s("So swift was", "پاسخ تیم پزشکی چنان سریع بود که جان مصدوم نجات یافت.", [
        {"corr": "the medical response", "dist": ["medical the response", "the response medical", "a medical response", "response medical the"]},
        {"corr": "that the injured", "dist": ["which the injured", "that injured the", "that the injury", "what the injured"]},
        {"corr": "driver made a", "dist": ["driver make a", "drivers made a", "driver making a", "made driver a"]},
        {"corr": "full recovery within", "dist": ["fully recovery within", "full recover within", "recovery full within", "a full recovery within"]},
        {"corr": "two weeks.", "dist": ["two week.", "weeks two.", "the two weeks.", "second week."]}
    ]),
    s("Such was his", "نفوذ و اعتبار او چنان بود که سخنانش فصل‌الخطاب مناقشات شد.", [
        {"corr": "authority that his", "dist": ["authoritative that his", "authority which his", "authority that he", "authorities that his"]},
        {"corr": "words resolved the", "dist": ["word resolved the", "words resolve the", "words resolving the", "resolved words the"]},
        {"corr": "prolonged dispute without", "dist": ["prolong dispute without", "dispute prolonged without", "prolonging dispute without", "prolonged disputes without"]},
        {"corr": "the need for", "dist": ["need the for", "the need in", "need for the", "the needed for"]},
        {"corr": "litigation.", "dist": ["lawsuit.", "arbitration.", "trial.", "to litigation."]}
    ]),
    s("Only in retrospect", "تنها در نگاه به گذشته بود که تدبیر و حکمت تصمیم او آشکار گشت.", [
        {"corr": "did the wisdom", "dist": ["the wisdom did", "wisdom did the", "had the wisdom", "was the wisdom"]},
        {"corr": "of his strategic", "dist": ["in his strategic", "for his strategic", "with his strategic", "of his strategy"]},
        {"corr": "choice become entirely", "dist": ["choices become entirely", "choice became entirely", "choice become entire", "choice becoming entirely"]},
        {"corr": "evident to all", "dist": ["evident at all", "evidently to all", "evident for all", "evidence to all"]},
        {"corr": "observers.", "dist": ["viewers.", "analysts.", "people.", "to observers."]}
    ])
]

print("AEF 5 C2 Stages 1-10 complete! Total sentences:", sum(len(v) for v in c2_data.values()))
