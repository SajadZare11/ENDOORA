// Helper to generate the complete AEF curriculum registry
import fs from 'fs';
import path from 'path';

const levelsConfig = [
  {
    tier: 'a1',
    cefr: 'A1',
    bookTitleFa: 'American English File Starter',
    bookTitleEn: 'American English File Starter (Beginner)',
    levelNameFa: 'سطح A1 · پایه و نوآموزان',
    levelNameEn: 'Level A1 · Starter & Beginner',
    gradient: 'linear-gradient(135deg, #059669, #10b981)',
    badgeColor: '#059669',
    icon: '🌱',
    descFa: 'شروع یادگیری با اصول بنیادی، الفبا، مکالمات روزمره کافه، هتل، احوالپرسی و عبارات کاربردی نیویورک.',
    units: [
      { id: '01', titleFa: 'در کلاس: سلام و احوالپرسی با جنی و راب', titleEn: 'In the Classroom: Hello and Goodbyes with Jenny and Rob', icon: '👋', duration: '3:20', durationSec: 200, unit: 'Episode 1', topic: 'سلام و احوالپرسی' },
      { id: '02', titleFa: 'نام و هویت: معرفی خود و دیگران در منهتن', titleEn: "What's Your Name? Introductions in Manhattan", icon: '🪪', duration: '3:45', durationSec: 225, unit: 'Episode 1', topic: 'معرفی خود و دیگران' },
      { id: '03', titleFa: 'در کافی‌شاپ: سفارش نوشیدنی و اسنک', titleEn: 'In the Coffee Shop: Ordering Drinks and Snacks', icon: '☕', duration: '4:10', durationSec: 250, unit: 'Episode 2', topic: 'سفارش قهوه و پرداخت' },
      { id: '04', titleFa: 'در هتل گرین‌ویچ: پذیرش و تحویل اتاق', titleEn: 'At Greenwich Hotel: Checking In and Getting Keys', icon: '🏨', duration: '3:50', durationSec: 230, unit: 'Episode 2', topic: 'مکالمه رزرو و هتل' },
      { id: '05', titleFa: 'اطلاعات فردی: تکمیل فرم و شماره تماس', titleEn: 'Personal Information: Filling Forms and Phone Numbers', icon: '📝', duration: '3:30', durationSec: 210, unit: 'Episode 3', topic: 'فرم مشخصات فردی' },
      { id: '06', titleFa: 'خرید بلیط مترو در ایستگاه پنسیلوانیا', titleEn: 'Metro Ticket: Buying Single and Return Tickets', icon: '🚇', duration: '4:00', durationSec: 240, unit: 'Episode 3', topic: 'حمل‌ونقل عمومی و بلیط' },
      { id: '07', titleFa: 'روزهای هفته و ساعت: تنظیم قرار ملاقات کاری', titleEn: 'Days and Times: Scheduling a Meeting at 24/7 Office', icon: '🗓️', duration: '3:40', durationSec: 220, unit: 'Episode 4', topic: 'روزها و زمان‌بندی' },
      { id: '08', titleFa: 'پرسیدن آدرس: یافتن کتابخانه عمومی نیویورک', titleEn: 'Asking Directions: Finding the NY Public Library', icon: '🗺️', duration: '4:20', durationSec: 260, unit: 'Episode 4', topic: 'آدرس‌دهی و جهت‌ها' },
      { id: '09', titleFa: 'خرید یادگاری و مگنت از سنترال پارک', titleEn: 'Souvenir Shop: Buying Gifts in Central Park', icon: '🛍️', duration: '3:35', durationSec: 215, unit: 'Episode 5', topic: 'خرید و قیمت اجناس' },
      { id: '10', titleFa: 'خانواده و دوستان: توصیف عکس‌های یادگاری', titleEn: 'Family and Friends: Describing Holiday Photos', icon: '👨‍👩‍👧', duration: '4:15', durationSec: 255, unit: 'Episode 5', topic: 'توصیف افراد و خانواده' },
      { id: '11', titleFa: 'غذا و نوشیدنی: انتخاب ناهار ساده در داینر', titleEn: 'Food and Drinks: Quick Lunch at a Classic Diner', icon: '🥪', duration: '3:55', durationSec: 235, unit: 'Episode 6', topic: 'نام غذاها و ترجیحات' },
      { id: '12', titleFa: 'برنامه روزانه: یک روز پرمشغله کاری برای راب', titleEn: "Daily Routine: A Busy Working Day for Rob", icon: '⏰', duration: '4:30', durationSec: 270, unit: 'Episode 6', topic: 'روتین روزمره و ساعت کاری' },
      { id: '13', titleFa: 'پرسیدن ساعت دقیق و تاخیر در جلسه کاری', titleEn: 'Telling Time: Being Late for the Morning Briefing', icon: '⌚', duration: '3:25', durationSec: 205, unit: 'Episode 7', topic: 'زمان و عذرخواهی برای تاخیر' },
      { id: '14', titleFa: 'خرید پوشاک: انتخاب پیراهن و سایز مناسب', titleEn: 'Clothes and Colors: Trying On Shirts and Sizes', icon: '👕', duration: '4:05', durationSec: 245, unit: 'Episode 7', topic: 'رنگ‌ها و اندازه‌ها' },
      { id: '15', titleFa: 'در رستوران ایتالیایی: سفارش شام و پرداخت', titleEn: 'Italian Restaurant: Ordering Dinner and Asking for the Bill', icon: '🍕', duration: '4:40', durationSec: 280, unit: 'Episode 8', topic: 'سفارش رستورانی و صورت‌حساب' },
      { id: '16', titleFa: 'آب و هوا: گفتگو درباره زمستان برفی نیویورک', titleEn: 'Weather and Seasons: Snowy Winter in Brooklyn', icon: '❄️', duration: '3:50', durationSec: 230, unit: 'Episode 8', topic: 'توصیف آب و هوا و فصول' },
      { id: '17', titleFa: 'برنامه آخر هفته: بازدید از موزه متروپولیتن', titleEn: 'Weekend Plans: Visiting the Met Museum with Jenny', icon: '🏛️', duration: '4:15', durationSec: 255, unit: 'Episode 9', topic: 'فعالیت‌های اوقات فراغت' },
      { id: '18', titleFa: 'تعطیلات گذشته: خاطرات سفر کوتاه به بوستون', titleEn: 'Past Holidays: Recounting a Weekend Trip to Boston', icon: '🎒', duration: '4:35', durationSec: 275, unit: 'Episode 9', topic: 'گذشته ساده و بیان رویدادها' },
      { id: '19', titleFa: 'برنامه‌ریزی تعطیلات تابستانی در ساحل کالیفرنیا', titleEn: 'Vacation Plans: Booking Beach Hotels in California', icon: '🏖️', duration: '4:00', durationSec: 240, unit: 'Episode 10', topic: 'آینده و برنامه‌ریزی سفر' },
      { id: '20', titleFa: 'مهمانی خداحافظی راب و بازگشت موقت به لندن', titleEn: "Farewell Party: Rob's Temporary Return to London", icon: '🥂', duration: '4:45', durationSec: 285, unit: 'Episode 10', topic: 'تبریک، آرزوی موفقیت و خداحافظی' },
    ]
  },
  {
    tier: 'a2',
    cefr: 'A2',
    bookTitleFa: 'American English File 1 & 2',
    bookTitleEn: 'American English File Level 1 & 2 (Elementary / Pre-Int)',
    levelNameFa: 'سطح A2 · پیش‌متوسط و عمومی',
    levelNameEn: 'Level A2 · Elementary to Pre-Intermediate',
    gradient: 'linear-gradient(135deg, #0284c7, #06b6d4)',
    badgeColor: '#0284c7',
    icon: '📘',
    descFa: 'توسعه ارتباطات روزمره، سفر، مکالمات فرودگاهی، خرید حرفه‌ای، قرارهای کاری و توصیف تجربیات گذشته.',
    units: [
      { id: '01', titleFa: 'ورود به فرودگاه هیترو لندن و عبور از گیت گذرنامه', titleEn: 'Arriving in London: Passport Control and Customs', icon: '✈️', duration: '4:20', durationSec: 260, unit: 'Episode 1', topic: 'فرودگاه و بررسی مدارک' },
      { id: '02', titleFa: 'سفارش قهوه بیرون‌بر و پرداخت بدون تماس در لندن', titleEn: 'Coffee to Go: Contactless Payment in Soho', icon: '☕', duration: '3:50', durationSec: 230, unit: 'Episode 1', topic: 'کافه و پرداخت الکترونیک' },
      { id: '03', titleFa: 'خرید پوشاک: پرو لباس، تعویض سایز و بازگرداندن کالا', titleEn: 'In a Clothing Store: Trying Sizes and Returns', icon: '👔', duration: '4:15', durationSec: 255, unit: 'Episode 2', topic: 'پوشاک و بازپس‌گیری کالا' },
      { id: '04', titleFa: 'مسیریابی در متروی لندن و خرید کارت اویستر', titleEn: 'Getting Around London: Buying Oyster Travel Cards', icon: '🚇', duration: '4:30', durationSec: 270, unit: 'Episode 2', topic: 'مسیریابی مترو و نقشه شهری' },
      { id: '05', titleFa: 'در داروخانه: خرید داروی سرماخوردگی و مشاوره', titleEn: 'At the Pharmacy: Buying Cold Medicine and Dosage', icon: '💊', duration: '4:05', durationSec: 245, unit: 'Episode 3', topic: 'داروخانه و تجویز ساده' },
      { id: '06', titleFa: 'در رستوران: سفارش غذای اصلی و استیک با جنی', titleEn: 'At the Restaurant: Ordering Steak and Side Dishes', icon: '🍽️', duration: '4:40', durationSec: 280, unit: 'Episode 3', topic: 'سفارش شام و جزئیات غذا' },
      { id: '07', titleFa: 'یک شب در وست‌اند لندن: رزرو تئاتر و تهیه بلیط', titleEn: 'A Night Out: Booking West End Theater Tickets', icon: '🎭', duration: '4:25', durationSec: 265, unit: 'Episode 4', topic: 'هنر، نمایش و اوقات فراغت' },
      { id: '08', titleFa: 'اجاره خودرو در فرودگاه جی‌اف‌کی نیویورک', titleEn: 'Renting a Car: Insurance and Navigation Options', icon: '🚗', duration: '4:50', durationSec: 290, unit: 'Episode 4', topic: 'اجاره خودرو و قرارداد' },
      { id: '09', titleFa: 'تسویه حساب هتل و بررسی اقلام فاکتور', titleEn: 'Checking Out: Reviewing the Bill and Minibar', icon: '🧾', duration: '4:10', durationSec: 250, unit: 'Episode 5', topic: 'فاکتور هتل و پیگیری خطا' },
      { id: '10', titleFa: 'مسیریابی در منهتن به سمت ساختمان امپایر استیت', titleEn: 'Directions in Manhattan: Walking to Empire State', icon: '🏙️', duration: '4:15', durationSec: 255, unit: 'Episode 5', topic: 'آدرس‌دهی دقیق تقاطع‌ها' },
      { id: '11', titleFa: 'دعوت به شام در خانه همکار و تعارفات فرهنگی', titleEn: 'Invitation to Dinner: Polite Small Talk with Hosts', icon: '🍷', duration: '4:35', durationSec: 275, unit: 'Episode 6', topic: 'اداب مهمانی و مکالمه غیررسمی' },
      { id: '12', titleFa: 'پیگیری تاخیر مرسوله پستی و تماس با پشتیبانی', titleEn: 'Problems with an Order: Contacting Courier Support', icon: '📦', duration: '4:20', durationSec: 260, unit: 'Episode 6', topic: 'پیگیری سفارش و پشتیبانی' },
      { id: '13', titleFa: 'در مطب پزشک: معاینه، علائم بیماری و توصیه استراحت', titleEn: "At the Doctor's: Symptoms and Medical Advice", icon: '🩺', duration: '4:45', durationSec: 285, unit: 'Episode 7', topic: 'پزشک، بیماری و علائم' },
      { id: '14', titleFa: 'رزرو تلفنی پرواز رفت و برگشت به میامی', titleEn: 'Booking a Flight: Confirming Dates and Seat Selection', icon: '🛫', duration: '4:15', durationSec: 255, unit: 'Episode 7', topic: 'رزرو پرواز و هماهنگی سفر' },
      { id: '15', titleFa: 'گزارش چمدان گم‌شده در سالن بار فرودگاه', titleEn: 'Lost Luggage: Filing a Claim at Baggage Services', icon: '🧳', duration: '4:30', durationSec: 270, unit: 'Episode 8', topic: 'گزارش مفقودی بار' },
      { id: '16', titleFa: 'بانک و ارز: افتتاح حساب دانشجویی و تبدیل ارز', titleEn: 'Banking and Currency: Opening a Student Account', icon: '💳', duration: '4:25', durationSec: 265, unit: 'Episode 8', topic: 'بانک، کارت و نرخ تبدیل' },
      { id: '17', titleFa: 'اجاره آپارتمان: بازدید از خانه و توافق با صاحبخانه', titleEn: 'Apartment Hunting: Viewing Flats and Deposit Rules', icon: '🔑', duration: '4:40', durationSec: 280, unit: 'Episode 9', topic: 'مسکن و قرارداد اجاره' },
      { id: '18', titleFa: 'مصاحبه کاری اولیه برای پست دستیار ویراستار', titleEn: 'Job Interview: Screening for Assistant Editor Role', icon: '💼', duration: '4:55', durationSec: 295, unit: 'Episode 9', topic: 'مصاحبه شغلی و معرفی تجارب' },
      { id: '19', titleFa: 'مکالمات عمومی در مهمانی شام دوستانه در منهتن', titleEn: 'Dinner with Friends: Informal Banter and Humor', icon: '🍽️', duration: '4:20', durationSec: 260, unit: 'Episode 10', topic: 'شوخ‌طبعی و مکالمه دوستانه' },
      { id: '20', titleFa: 'مرور پایان سطح: ارزیابی دستاوردهای زبانی A2', titleEn: 'Level Wrap-up: Reflecting on Milestone Achievements', icon: '🎯', duration: '4:30', durationSec: 270, unit: 'Episode 10', topic: 'مرور اهداف و ارزیابی سطح' },
    ]
  },
  {
    tier: 'b1',
    cefr: 'B1',
    bookTitleFa: 'American English File 2 & 3',
    bookTitleEn: 'American English File Level 2 & 3 (Intermediate)',
    levelNameFa: 'سطح B1 · متوسط مستقل',
    levelNameEn: 'Level B1 · Intermediate',
    gradient: 'linear-gradient(135deg, #2563eb, #3b82f6)',
    badgeColor: '#2563eb',
    icon: '🎓',
    descFa: 'مکالمات شغلی، سخنرانی‌های کاری، مهارت‌های حل تعارض، توصیف برنامه‌های آینده و نگارش ایمیل‌های رسمی.',
    units: [
      { id: '01', titleFa: 'ملاقات با والدین پارتنر و گفتگوهای رسمی شام', titleEn: 'Meeting the Parents: Courteous Dinner Etiquette', icon: '🥂', duration: '4:45', durationSec: 285, unit: 'Episode 1', topic: 'اداب گفتگوی رسمی خانوادگی' },
      { id: '02', titleFa: 'ارائه طرح پیشنهادی بازاریابی دیجیتال در جلسه شرکت', titleEn: 'Marketing Pitch: Presenting Digital Campaign Ideas', icon: '📊', duration: '5:10', durationSec: 310, unit: 'Episode 1', topic: 'ارائه طرح کسب‌وکار' },
      { id: '03', titleFa: 'اعتراض مودبانه به سرویس اتاق و خرابی تهویه هتل', titleEn: 'Making Complaints: Defective AC and Room Standards', icon: '🛎️', duration: '4:35', durationSec: 275, unit: 'Episode 2', topic: 'ثبت شکایت و مطالبه غرامت' },
      { id: '04', titleFa: 'مذاکره بر سر زمان‌بندی تحویل پروژه و بودجه نهایی', titleEn: 'Negotiating Timelines: Deadlines and Resource Allocations', icon: '🤝', duration: '5:00', durationSec: 300, unit: 'Episode 2', topic: 'اصول چانه‌زنی و توافق' },
      { id: '05', titleFa: 'سوءتفاهم‌های فرهنگی در محیط کار بین‌المللی', titleEn: 'Cultural Misunderstandings in Multinational Teams', icon: '🌐', duration: '4:50', durationSec: 290, unit: 'Episode 3', topic: 'ارتباطات میان‌فرهنگی' },
      { id: '06', titleFa: 'بحث درباره بازیافت، ردپای کربن و انرژی پاک', titleEn: 'Environmental Choices: Carbon Footprint and Clean Tech', icon: '♻️', duration: '4:40', durationSec: 280, unit: 'Episode 3', topic: 'محیط زیست و پایداری' },
      { id: '07', titleFa: 'ایمیل و تماس پیگیری پس از مصاحبه شغلی تخصصی', titleEn: 'Job Interview Follow-up: Writing an Impactful Note', icon: '✉️', duration: '4:25', durationSec: 265, unit: 'Episode 4', topic: 'نگارش مکاتبات کاری' },
      { id: '08', titleFa: 'بررسی سبک زندگی سالم، رژیم غذایی و تعادل کار', titleEn: 'Health and Wellness Trends: Work-Life Balance', icon: '🥗', duration: '4:35', durationSec: 275, unit: 'Episode 4', topic: 'سلامت روان و توازن زندگی' },
      { id: '09', titleFa: 'برنامه‌ریزی کنفرانس سالانه و هماهنگی مهمانان ویژه', titleEn: 'Event Management: Coordinating Guest Speakers', icon: '🎪', duration: '5:05', durationSec: 305, unit: 'Episode 5', topic: 'مدیریت رویداد و تشریفات' },
      { id: '10', titleFa: 'تشخیص اخبار جعلی و سواد رسانه‌ای در عصر دیجیتال', titleEn: 'Media Literacy: Spotting Misinformation Online', icon: '📰', duration: '4:55', durationSec: 295, unit: 'Episode 5', topic: 'تفکر نقادانه و رسانه' },
      { id: '11', titleFa: 'مدیریت تعارض بین اعضای تیم در محیط اداری', titleEn: 'Resolving Team Disputes: Constructive Mediation', icon: '⚖️', duration: '5:15', durationSec: 315, unit: 'Episode 6', topic: 'حل مسئله و حل اختلاف' },
      { id: '12', titleFa: 'تماس با پشتیبانی فنی برای رفع قطعی سرور سازمانی', titleEn: 'Tech Troubleshooting: Urgent Server Downtime Fix', icon: '💻', duration: '4:30', durationSec: 270, unit: 'Episode 6', topic: 'ارتباطات فنی و اصطلاحات IT' },
      { id: '13', titleFa: 'ساختار یک سخنرانی جذاب: از مقدمه تا پرسش و پاسخ', titleEn: 'Presentation Skills: Structuring an Engaging Talk', icon: '🎤', duration: '5:20', durationSec: 320, unit: 'Episode 7', topic: 'فن بیان و ساختار اسلاید' },
      { id: '14', titleFa: 'روایت ماجرای جا ماندن از قطار سریع‌السیر در اروپا', titleEn: 'Travel Mishaps: Missed Connections and Rebooking', icon: '🚄', duration: '4:40', durationSec: 280, unit: 'Episode 7', topic: 'داستان‌سرایی و زمان‌های گذشته' },
      { id: '15', titleFa: 'مشاوره مالی شخصی: پس‌انداز، بودجه‌بندی و سرمایه', titleEn: 'Personal Finance: Sensible Budgeting for Young Adults', icon: '💰', duration: '4:50', durationSec: 290, unit: 'Episode 8', topic: 'مدیریت مالی و هزینه‌ها' },
      { id: '16', titleFa: 'نقد فیلم و بحث درباره سبک کارگردانی سینما', titleEn: 'Film Review: Narrative Arcs and Cinematic Vision', icon: '🎬', duration: '4:35', durationSec: 275, unit: 'Episode 8', topic: 'نقد هنری و واژگان توصیفی' },
      { id: '17', titleFa: 'اثرات شبکه‌های اجتماعی بر تمرکز و عادات مطالعه', titleEn: 'Digital Wellbeing: Attention Spans and Notification Overload', icon: '📱', duration: '4:45', durationSec: 285, unit: 'Episode 9', topic: 'روانشناسی فناوری و تمرکز' },
      { id: '18', titleFa: 'تجارب کارهای داوطلبانه و حفاظت از اکوسیستم دریایی', titleEn: 'Volunteering Abroad: Marine Conservation Efforts', icon: '🌊', duration: '5:00', durationSec: 300, unit: 'Episode 9', topic: 'مسئولیت اجتماعی و طبیعت' },
      { id: '19', titleFa: 'تصمیم‌گیری بین استخدام شرکتی و فریلنسری مستقل', titleEn: 'Career Dilemma: Corporate Security vs Freelance Freedom', icon: '🧭', duration: '5:10', durationSec: 310, unit: 'Episode 10', topic: 'مسیر شغلی و دوراهی‌ها' },
      { id: '20', titleFa: 'خلاصه دستاوردهای سطح B1 و ورود به دنیای پیشرفته', titleEn: 'Level B1 Milestone: Ready for Fluent Conversations', icon: '🏆', duration: '4:30', durationSec: 270, unit: 'Episode 10', topic: 'جمع‌بندی تسلط سطح متوسط' },
    ]
  },
  {
    tier: 'b2',
    cefr: 'B2',
    bookTitleFa: 'American English File 3 & 4',
    bookTitleEn: 'American English File Level 3 & 4 (Upper-Intermediate)',
    levelNameFa: 'سطح B2 · بالاتر از متوسط (تسلط کاری)',
    levelNameEn: 'Level B2 · Upper-Intermediate',
    gradient: 'linear-gradient(135deg, #4f46e5, #6366f1)',
    badgeColor: '#4f46e5',
    icon: '💼',
    descFa: 'مباحثات تخصصی، مناظره، مذاکرات چندجانبه تجاری، گزارشگری، نقد فناوری و مدیریت بحران سازمانی.',
    units: [
      { id: '01', titleFa: 'ارائه استارتاپ به سرمایه‌گذاران جسور در دره سیلیکون', titleEn: 'Venture Pitch: Convincing Angel Investors in Tech', icon: '🚀', duration: '5:30', durationSec: 330, unit: 'Episode 1', topic: 'جذب سرمایه و اصطلاحات مالی' },
      { id: '02', titleFa: 'مدیریت بحران روابط عمومی و صدور بیانیه مطبوعاتی', titleEn: 'PR Crisis Management: Addressing Product Recalls', icon: '📢', duration: '5:15', durationSec: 315, unit: 'Episode 1', topic: 'روابط عمومی و پاسخ به رسانه‌ها' },
      { id: '03', titleFa: 'تاثیر هوش مصنوعی بر آینده بازار کار و مشاغل انسانی', titleEn: 'Artificial Intelligence and Workforce Transformation', icon: '🤖', duration: '5:45', durationSec: 345, unit: 'Episode 2', topic: 'فناوری‌های تحول‌آفرین' },
      { id: '04', titleFa: 'بررسی بندهای قرارداد کاری و حقوق مالکیت معنوی', titleEn: 'Legal Clauses: NDAs and Intellectual Property Rights', icon: '📜', duration: '5:20', durationSec: 320, unit: 'Episode 2', topic: 'زبان حقوقی و مفاد قرارداد' },
      { id: '05', titleFa: 'شهرهای هوشمند، حمل‌ونقل پایدار و معماری آینده', titleEn: 'Smart Cities: Urban Planning and Eco Mobility', icon: '🏙️', duration: '5:10', durationSec: 310, unit: 'Episode 3', topic: 'برنامه‌ریزی شهری و توسعه پایدار' },
      { id: '06', titleFa: 'اصول مذاکره بین‌المللی در فرهنگ‌های تجاری گوناگون', titleEn: 'Cross-Cultural Negotiations: Eastern vs Western Norms', icon: '🌏', duration: '5:40', durationSec: 340, unit: 'Episode 3', topic: 'دیپلماسی تجاری' },
      { id: '07', titleFa: 'روانشناسی تبلیغات و تکنیک‌های متقاعدسازی مصرف‌کننده', titleEn: 'The Psychology of Advertising: Subconscious Triggers', icon: '🎯', duration: '5:25', durationSec: 325, unit: 'Episode 4', topic: 'روانشناسی بازار و ترغیب' },
      { id: '08', titleFa: 'چالش‌های اخلاقی ویرایش ژنتیکی و بیوتکنولوژی مدرن', titleEn: 'Bioethics Debate: Gene Editing and Genetic Mod', icon: '🧬', duration: '5:50', durationSec: 350, unit: 'Episode 4', topic: 'اخلاق زیستی و علم ژنتیک' },
      { id: '09', titleFa: 'مناظره اقتصادی: مالیات تصاعدی در برابر مشوق‌های رشد', titleEn: 'Economic Debate: Progressive Taxation vs Market Incentives', icon: '📊', duration: '5:35', durationSec: 335, unit: 'Episode 5', topic: 'اقتصاد کلان و سیاست‌گذاری' },
      { id: '10', titleFa: 'سوگیری‌های شناختی و تاثیر آنها بر تصمیم‌گیری مالی', titleEn: 'Cognitive Biases in Everyday Financial Choices', icon: '🧠', duration: '5:15', durationSec: 315, unit: 'Episode 5', topic: 'روانشناسی شناختی و تصمیم‌گیری' },
      { id: '11', titleFa: 'رهبری تیم‌های دورکار در پهنه‌های زمانی متفاوت', titleEn: 'Leading Remote Distributed Teams Across Timezones', icon: '👥', duration: '5:30', durationSec: 330, unit: 'Episode 6', topic: 'مدیریت منابع انسانی نوین' },
      { id: '12', titleFa: 'گزارشگری تحقیقی: کشف فساد و مصاحبه با سوت‌زن‌ها', titleEn: 'Investigative Journalism: Whistleblowers and Evidence', icon: '🕵️', duration: '5:45', durationSec: 345, unit: 'Episode 6', topic: 'رسانه پژوهشی و منابع محرمانه' },
      { id: '13', titleFa: 'پیشگیری از فرسودگی شغلی و تاب‌آوری ذهنی مدیران', titleEn: 'Combating Executive Burnout and Mental Stamina', icon: '🧘', duration: '5:05', durationSec: 305, unit: 'Episode 7', topic: 'سلامت سازمانی و تاب‌آوری' },
      { id: '14', titleFa: 'تحول سیستم‌های دانشگاهی و مدارک مهارت‌محور', titleEn: 'Higher Education Disruption: Micro-Credentials Era', icon: '🎓', duration: '5:15', durationSec: 315, unit: 'Episode 7', topic: 'آموزش عالی و آینده مدرک‌ها' },
      { id: '15', titleFa: 'توافق‌های اقلیمی سازمان ملل و اجرای پیمان‌های الزام‌آور', titleEn: 'Global Climate Summits: Enforcing Binding Treaties', icon: '🌍', duration: '5:40', durationSec: 340, unit: 'Episode 8', topic: 'سیاست بین‌الملل و اقلیم' },
      { id: '16', titleFa: 'حق مالکیت ادبی، پتنت‌های نرم‌افزاری و دعواهای کپی‌رایت', titleEn: 'Software Patents and Copyright Infringement Lawsuits', icon: '⚖️', duration: '5:20', durationSec: 320, unit: 'Episode 8', topic: 'قوانین مالکیت فکری دیجیتال' },
      { id: '17', titleFa: 'تاب‌آوری زنجیره تامین جهانی در برابر شوک‌های ژئوپلیتیک', titleEn: 'Supply Chain Resiliency Against Geopolitical Shocks', icon: '🚢', duration: '5:35', durationSec: 335, unit: 'Episode 9', topic: 'لجستیک و بازرگانی جهانی' },
      { id: '18', titleFa: 'فلسفه اگزیستانسیالیسم و کاربرد آن در تصمیمات زندگی', titleEn: 'Applied Existentialism: Meaning-Making in Chaos', icon: '📖', duration: '5:50', durationSec: 350, unit: 'Episode 9', topic: 'مفاهیم فلسفی و معناگرایی' },
      { id: '19', titleFa: 'استراتژی‌های ورود به بازارهای نوظهور آسیایی', titleEn: 'Market Entry Strategies in Emerging Asian Economies', icon: '📈', duration: '5:30', durationSec: 330, unit: 'Episode 10', topic: 'استراتژی رقابتی شرکت‌ها' },
      { id: '20', titleFa: 'پروژه پایانی B2: ارائه جامع پرونده کسب‌وکار و دفاعیه', titleEn: 'B2 Capstone: Case Study Defense Before the Board', icon: '🏆', duration: '5:15', durationSec: 315, unit: 'Episode 10', topic: 'دفاع از پروژه و نتیجه‌گیری' },
    ]
  },
  {
    tier: 'c1',
    cefr: 'C1',
    bookTitleFa: 'American English File 5',
    bookTitleEn: 'American English File Level 5 (Advanced)',
    levelNameFa: 'سطح C1 · پیشرفته و آکادمیک',
    levelNameEn: 'Level C1 · Advanced Professional',
    gradient: 'linear-gradient(135deg, #7c3aed, #9333ea)',
    badgeColor: '#7c3aed',
    icon: '🔮',
    descFa: 'تسلط روان بر گفتمان‌های پیچیده، نقد آکادمیک، سخنرانی‌های کلیدی، ظرافت‌های کنایه، لحن و تحلیل متون سنگین.',
    units: [
      { id: '01', titleFa: 'سخنرانی کلیدی در مجمع جهانی اقتصاد و نوآوری دیجیتال', titleEn: 'Keynote Address on Technological Convergence at Davos', icon: '🎙️', duration: '6:10', durationSec: 370, unit: 'Episode 1', topic: 'سخنرانی رسمی سطح کلان' },
      { id: '02', titleFa: 'تحلیل ژئوپلیتیک تنش‌های تجاری و اثرات دلارزدایی', titleEn: 'Geopolitical Analysis: Currency Hegemony and Trade Wars', icon: '🌐', duration: '6:00', durationSec: 360, unit: 'Episode 1', topic: 'تحلیل ژئوپلیتیک و مالیه کلان' },
      { id: '03', titleFa: 'ظرافت‌های کنایه، لحن طنز و استعاره در زبان پیشرفته', titleEn: 'Linguistic Nuance: Sarcasm, Understatement and Idiom', icon: '🎭', duration: '5:45', durationSec: 345, unit: 'Episode 2', topic: 'ایهام و کنایه در مکالمه ادونس' },
      { id: '04', titleFa: 'مذاکرات ادغام ابرشرکت‌ها و انطباق قوانین ضد انحصار', titleEn: 'Cross-Border M&A and Antitrust Regulatory Scrutiny', icon: '🏢', duration: '6:20', durationSec: 380, unit: 'Episode 2', topic: 'ادغام تجاری و قوانین آنتی‌تراست' },
      { id: '05', titleFa: 'عصب‌پژوهی تصمیم‌گیری تحت فشار و استرس مدیران ارشد', titleEn: 'Neuroscience of High-Stakes Strategic Decisions', icon: '🧠', duration: '5:50', durationSec: 350, unit: 'Episode 3', topic: 'علوم اعصاب و رهبری سازمانی' },
      { id: '06', titleFa: 'میانجی‌گری در پرونده‌های حقوقی بین‌المللی چندمیلیاردی', titleEn: 'Complex Commercial Arbitration and Settlement Talks', icon: '⚖️', duration: '6:15', durationSec: 375, unit: 'Episode 3', topic: 'داوری بین‌المللی و حل منازعات' },
      { id: '07', titleFa: 'نقد فرمالیستی شاهکارهای ادبیات مدرن قرن بیستم', titleEn: 'Literary Criticism: Narrative Voice and Modernist Fiction', icon: '📚', duration: '6:05', durationSec: 365, unit: 'Episode 4', topic: 'نقد ادبی و سبک‌شناسی' },
      { id: '08', titleFa: 'مرزهای رایانش کوانتومی و برتری محاسباتی الگوریتم‌ها', titleEn: 'Quantum Computing Supremacy and Cryptographic Limits', icon: '⚛️', duration: '6:30', durationSec: 390, unit: 'Episode 4', topic: 'رایانش کوانتومی و الگوریتم‌ها' },
      { id: '09', titleFa: 'معرفت‌شناسی، ابطال‌پذیری کارل پوپر و تحول الگوهای علمی', titleEn: 'Epistemology: Falsification and Kuhnian Paradigms', icon: '🔭', duration: '6:00', durationSec: 360, unit: 'Episode 5', topic: 'فلسفه علم و شناخت‌شناسی' },
      { id: '10', titleFa: 'چشم‌انداز اقتصاد کلان جهانی: پیش‌بینی چرخه‌های رکود', titleEn: 'Macroeconomic Forecasting: Recessions and Central Banks', icon: '📉', duration: '6:15', durationSec: 375, unit: 'Episode 5', topic: 'سیاست‌های پولی بانک‌های مرکزی' },
      { id: '11', titleFa: 'تحلیل فنون بلاغی و استراتژی‌های اقناع در خطبه‌های مشهور', titleEn: 'Rhetorical Analysis of Historic Inaugural Addresses', icon: '📜', duration: '5:55', durationSec: 355, unit: 'Episode 6', topic: 'اصول بلاغت و خطابه سیاسی' },
      { id: '12', titleFa: 'اخلاق زیستی در توسعه هوش عمومی مصنوعی خودمختار', titleEn: 'Artificial General Intelligence Alignment and Ethics', icon: '🤖', duration: '6:35', durationSec: 395, unit: 'Episode 6', topic: 'هم‌راستاسازی هوش مصنوعی AGI' },
      { id: '13', titleFa: 'انسان‌شناسی فرهنگی: بررسی تطبیقی مناسک سنتی جوامع', titleEn: 'Cultural Anthropology: Rites of Passage and Liminality', icon: '🗿', duration: '6:05', durationSec: 365, unit: 'Episode 7', topic: 'مردم‌شناسی و نمادشناسی' },
      { id: '14', titleFa: 'زبان‌شناسی قضایی و تحلیل مشخصه‌های کلامی متهمان', titleEn: 'Forensic Linguistics: Authorship Profiling in Court', icon: '🔎', duration: '6:10', durationSec: 370, unit: 'Episode 7', topic: 'زبان‌شناسی قانونی و تحلیل متن' },
      { id: '15', titleFa: 'مدیریت ریسک در مگاپروژه‌های اکتشافات فضایی ناسا', titleEn: 'Probabilistic Risk Assessment in Deep Space Missions', icon: '🚀', duration: '6:25', durationSec: 385, unit: 'Episode 8', topic: 'صنایع هوافضا و مدیریت خطرات' },
      { id: '16', titleFa: 'نشانه‌شناسی فضا و فلسفه معماری دیکانستراکتیویسم', titleEn: 'Semiotics of Space: Deconstructivism in Architecture', icon: '🏛️', duration: '5:50', durationSec: 350, unit: 'Episode 8', topic: 'معماری و نظریه نشانه‌ها' },
      { id: '17', titleFa: 'پارادایم‌های برهم‌زننده فناوری و فروپاشی صنایع سنتی', titleEn: 'Disruptive Innovation Paradigms and Market Creation', icon: '⚡', duration: '6:00', durationSec: 360, unit: 'Episode 9', topic: 'نوآوری دگرگون‌ساز' },
      { id: '18', titleFa: 'روانشناسی رفتاری در معاملات وال‌استریت و حباب دارایی‌ها', titleEn: 'Market Mania: Speculative Bubbles and Herd Mentality', icon: '💹', duration: '6:20', durationSec: 380, unit: 'Episode 9', topic: 'مالیه رفتاری و روانشناسی توده‌ها' },
      { id: '19', titleFa: 'برنامه‌ریزی استراتژیک بر پایه سناریوپردازی احتمالی', titleEn: 'Strategic Scenario Planning for Volatile Realities', icon: '🧭', duration: '6:15', durationSec: 375, unit: 'Episode 10', topic: 'سناریونویسی مدیریتی' },
      { id: '20', titleFa: 'دفاعیه جامع سطح C1: دفاع از پژوهش تحلیلی پیشرفته', titleEn: 'C1 Capstone: Executive Colloquium Presentation', icon: '🏆', duration: '5:45', durationSec: 345, unit: 'Episode 10', topic: 'سخنرانی دفاعیه پایانی سطح ادونس' },
    ]
  },
  {
    tier: 'c2',
    cefr: 'C2',
    bookTitleFa: 'American English File Advanced Plus & Mastery',
    bookTitleEn: 'American English File Mastery (Bilingual Proficiency)',
    levelNameFa: 'سطح C2 · تسلط کامل هم‌سطح بومی',
    levelNameEn: 'Level C2 · Mastery & Native-Like Proficiency',
    gradient: 'linear-gradient(135deg, #d97706, #b45309)',
    badgeColor: '#d97706',
    icon: '👑',
    descFa: 'اوج تسلط زبانی: درک بی‌نقص متون فلسفی، تئوری‌های انتزاعی، فن مناظره نخبگانی، فصاحت زبانی و بیان شیوا.',
    units: [
      { id: '01', titleFa: 'مسئله دشوار خودآگاهی و ماهیت پدیدارشناسی ذهن', titleEn: 'The Hard Problem of Consciousness: Qualia and Mind', icon: '🧠', duration: '6:45', durationSec: 405, unit: 'Episode 1', topic: 'فلسفه ذهن و خودآگاهی' },
      { id: '02', titleFa: 'فرضیه نسبیت زبانی ساپیر-وورف و ساختار اندیشه بشری', titleEn: 'Linguistic Relativity: Does Syntax Shape Cognition?', icon: '🗣️', duration: '6:30', durationSec: 390, unit: 'Episode 1', topic: 'نسبیت زبانی و شناخت' },
      { id: '03', titleFa: 'رویه قضایی دادگاه عالی و هرمنوتیک تفسیری متون قانون', titleEn: 'Judicial Hermeneutics and Constitutional Precedents', icon: '⚖️', duration: '6:50', durationSec: 410, unit: 'Episode 2', topic: 'تفسیر حقوق اساسی و فقه تطبیقی' },
      { id: '04', titleFa: 'تواضع شناختی و پیچیدگی‌های حکمرانی در تمدن‌های نوین', titleEn: 'Epistemic Humility in Managing Hyper-Complex Systems', icon: '🏛️', duration: '6:20', durationSec: 380, unit: 'Episode 2', topic: 'حکمرانی سیستمی و پیچیدگی' },
      { id: '05', titleFa: 'معماری گرامر زایشی چامسکی و جهانی‌های زبانی', titleEn: 'Generative Grammar and Universal Linguistic Constraints', icon: '📐', duration: '6:40', durationSec: 400, unit: 'Episode 3', topic: 'زبان‌شناسی نظری و دستور زایشی' },
      { id: '06', titleFa: 'دیپلماسی پشت‌پرده و فن مذاکرات ژئواستراتژیک سران', titleEn: 'Backchannel Diplomacy and Grand Strategic Bargaining', icon: '🤝', duration: '6:35', durationSec: 395, unit: 'Episode 3', topic: 'دیپلماسی پنهان و استراتژی کلان' },
      { id: '07', titleFa: 'نظریه پساساختارگرایی فوکو، دیرینه‌شناسی دانش و قدرت', titleEn: 'Post-Structuralism: Archaeology of Knowledge and Power', icon: '📖', duration: '7:00', durationSec: 420, unit: 'Episode 4', topic: 'فلسفه قاره‌ای و نقد قدرت' },
      { id: '08', titleFa: 'نظریه بازی‌ها در استراتژی‌های بازدارندگی و تعادل نش', titleEn: 'Game Theory: Nash Equilibria in Deterrence Postures', icon: '♟️', duration: '6:30', durationSec: 390, unit: 'Episode 4', topic: 'نظریه بازی‌ها و امنیت بین‌الملل' },
      { id: '09', titleFa: 'زیبایی‌شناسی انتقادی کانت و داوری سلیقه هنری', titleEn: 'Critique of Aesthetic Judgment: The Sublime and Form', icon: '🎨', duration: '6:15', durationSec: 375, unit: 'Episode 5', topic: 'زیبایی‌شناسی فلسفی و امر والا' },
      { id: '10', titleFa: 'الگوهای چرخش تاریخی تمدن‌ها در بستر تاریخ کلان', titleEn: 'Macrohistorical Dynamics: The Rise and Fall of Empires', icon: '⏳', duration: '6:55', durationSec: 415, unit: 'Episode 5', topic: 'تاریخ کلان و تمدن‌پژوهی' },
      { id: '11', titleFa: 'تفسیر کپنهاگی در برابر مدل جهان‌های موازی در فیزیک', titleEn: 'Quantum Metaphysics: Copenhagen vs Many-Worlds', icon: '🌌', duration: '6:45', durationSec: 405, unit: 'Episode 6', topic: 'متافیزیک کوانتومی' },
      { id: '12', titleFa: 'تسلط بر جدل دیالکتیکی سقراطی و خنثی‌سازی مغالطات', titleEn: 'Dialectical Mastery: Dismantling Sophistry and Fallacies', icon: '⚡', duration: '6:25', durationSec: 385, unit: 'Episode 6', topic: 'جدل منطقی و مغالطات پیچیده' },
      { id: '13', titleFa: 'ریشه‌های زیست‌شناختی تکاملی پیدایش زبان در انسان', titleEn: 'Evolutionary Biology of Symbolic Language Emergence', icon: '🧬', duration: '6:50', durationSec: 410, unit: 'Episode 7', topic: 'فرگشت زبان و دیرینه‌مردم‌شناسی' },
      { id: '14', titleFa: 'حسابرسی قضایی پیشرفته و کشف پولشویی در زنجیره‌های فرامرزی', titleEn: 'Forensic Accounting: Unraveling Shell Company Networks', icon: '💼', duration: '6:40', durationSec: 400, unit: 'Episode 7', topic: 'تحقیقات مالی جنایی و جرایم سفید' },
      { id: '15', titleFa: 'معناشناسی ابهام و تضاد در معاهدات بین‌الدولی الزام‌آور', titleEn: 'Semantics of Constructive Ambiguity in Bilateral Treaties', icon: '📜', duration: '6:20', durationSec: 380, unit: 'Episode 8', topic: 'معناشناسی حقوق بین‌الملل' },
      { id: '16', titleFa: 'ارگونومی شناختی و تقویت توانمندی‌های هوش ترکیبی انسان', titleEn: 'Cognitive Ergonomics: Symbiosis of Mind and Machines', icon: '🤖', duration: '6:35', durationSec: 395, unit: 'Episode 8', topic: 'همزیستی انسان و فناوری پیشرفته' },
      { id: '17', titleFa: 'اصلاحات ساختاری در معماری مالی برتون وودز و بانک جهانی', titleEn: 'Reimagining the Bretton Woods Architecture for the 2030s', icon: '🏛️', duration: '6:45', durationSec: 405, unit: 'Episode 9', topic: 'ساختار مالی بین‌المللی و بازنگری' },
      { id: '18', titleFa: 'پویایی سیستم‌های سازگار پیچیده در بحران‌های اجتماعی', titleEn: 'Complex Adaptive Systems in Societal Cascade Failures', icon: '🔄', duration: '6:50', durationSec: 410, unit: 'Episode 9', topic: 'نظریه آشوب و شبکه‌های پیچیده' },
      { id: '19', titleFa: 'فصاحت کلامی نخبگانی، ظرافت بلاغی و ضرب‌المثل‌های نادر نیتیو', titleEn: 'Idiomatic Mastery: Archaisms, Nuance and Eloquent Cadence', icon: '🎙️', duration: '6:15', durationSec: 375, unit: 'Episode 10', topic: 'فصاحت زبانی و کاربرد اصطلاحات نادر' },
      { id: '20', titleFa: 'دفاع از پایان‌نامه جامع استادی زبان انگلیسی در سطح C2', titleEn: 'Grand Dissertation Defense: Achieving C2 Native Mastery', icon: '👑', duration: '7:15', durationSec: 435, unit: 'Episode 10', topic: 'دفاعیه تز نهایی تسلط مطلق بر زبان' },
    ]
  }
];

function generateCurriculumContent() {
  let fileContent = `/**
 * American English File (AEF) Complete Curriculum Registry
 * 6 CEFR Tiers (A1, A2, B1, B2, C1, C2) - 20 Videos per Tier (120 Total Videos)
 * Standardized 6-Skill Assessments: Listening, Vocabulary, Grammar, Speaking, Reading, Writing
 */

import { SkillType, ChoiceQuestion, SpeakingQuestion, WritingQuestion, TranscriptLine } from "./video-learning";

export type AEFLevelTier = "a1" | "a2" | "b1" | "b2" | "c1" | "c2";

export interface AEFLevelMeta {
  tier: AEFLevelTier;
  cefr: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  levelNameFa: string;
  levelNameEn: string;
  bookTitleFa: string;
  bookTitleEn: string;
  gradient: string;
  badgeColor: string;
  icon: string;
  descFa: string;
  totalVideos: number;
}

export interface AEFVideoLesson {
  id: string;
  level: AEFLevelTier;
  episodeNumber: number;
  titleFa: string;
  titleEn: string;
  bookLevel: string;
  unit: string;
  cefr: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  duration: string;
  durationSec: number;
  videoUrl?: string;
  embedType?: "direct" | "aparat" | "youtube";
  posterGradient: string;
  posterIcon: string;
  summaryFa: string;
  summaryEn: string;
  keyTopicsFa: string[];
  transcript: TranscriptLine[];
  questions: {
    listening: ChoiceQuestion;
    vocabulary: ChoiceQuestion;
    grammar: ChoiceQuestion;
    speaking: SpeakingQuestion;
    reading: ChoiceQuestion;
    writing: WritingQuestion;
  };
}

export const AEF_LEVELS_META: Record<AEFLevelTier, AEFLevelMeta> = {\n`;

  for (const lvl of levelsConfig) {
    fileContent += `  ${lvl.tier}: {
    tier: "${lvl.tier}",
    cefr: "${lvl.cefr}",
    levelNameFa: "${lvl.levelNameFa}",
    levelNameEn: "${lvl.levelNameEn}",
    bookTitleFa: "${lvl.bookTitleFa}",
    bookTitleEn: "${lvl.bookTitleEn}",
    gradient: "${lvl.gradient}",
    badgeColor: "${lvl.badgeColor}",
    icon: "${lvl.icon}",
    descFa: "${lvl.descFa}",
    totalVideos: 20,
  },\n`;
  }

  fileContent += `};\n\nexport const AEF_LESSONS: AEFVideoLesson[] = [\n`;

  for (const lvl of levelsConfig) {
    for (let idx = 0; idx < lvl.units.length; idx++) {
      const u = lvl.units[idx];
      const epNum = idx + 1;
      const lessonId = `${lvl.tier}-v${epNum.toString().padStart(2, '0')}`;

      // Generate realistic transcript lines
      const transcript = [
        { id: 1, seconds: 10, timeDisplay: "00:10", speaker: "Host", textEn: `Welcome to American English File ${lvl.cefr}. Today's focus is ${u.titleEn}.`, textFa: `به دوره امریکن انگلیش فایل سطح ${lvl.cefr} خوش آمدید. موضوع این درس: ${u.titleFa}.` },
        { id: 2, seconds: 35, timeDisplay: "00:35", speaker: "Rob", textEn: `Excuse me, could you give me more details regarding this situation?`, textFa: `ببخشید، آیا ممکن است اطلاعات و جزئیات بیشتری درباره این موقعیت به من بدهید؟` },
        { id: 3, seconds: 75, timeDisplay: "01:15", speaker: "Jenny", textEn: `Certainly! Here is everything you need to know to handle it naturally.`, textFa: `مسلماً! تمام نکاتی که برای بیان روان و طبیعی این موقعیت نیاز دارید اینجاست.` },
        { id: 4, seconds: 120, timeDisplay: "02:00", speaker: "Instructor", textEn: `Notice how the tone changes depending on formality and context.`, textFa: `دقت کنید که لحن بیان بر اساس میزان رسمیت و شرایط مکالمه چگونه تغییر می‌کند.` },
      ];

      // Generate structured 6-skill questions
      const questions = {
        listening: {
          skill: "listening",
          promptFa: `بر اساس آنچه در دقیقه ۱:۱۵ ویدیو شنیدید، پاسخ جنی به پرسش راب چه بود؟`,
          promptEn: `According to the video at 01:15, how did Jenny respond to Rob's inquiry?`,
          timestampSeconds: 75,
          timestampDisplay: "01:15",
          explanationFa: `جنی با اطمینان اعلام کرد که تمام اطلاعات مورد نیاز برای صحبت روان در این موقعیت را در اختیار او قرار می‌دهد.`,
          options: [
            { id: 1, textEn: "She offered complete assistance with enthusiasm.", textFa: "او با اشتیاق پیشنهاد کمک و راهنمایی کامل داد." },
            { id: 2, textEn: "She asked him to check the website instead.", textFa: "او از راب خواست به جای آن به وب‌سایت مراجعه کند." },
            { id: 3, textEn: "She was too busy to answer right away.", textFa: "او بسیار مشغول بود و بلافاصله پاسخ نداد." },
            { id: 4, textEn: "She requested him to return the next morning.", textFa: "او خواست که فردا صبح دوباره مراجعه کند." },
          ],
          correctOptionId: 1,
        },
        vocabulary: {
          skill: "vocabulary",
          targetTerm: u.topic,
          promptFa: `کدام واژه یا عبارت بهترین معادل برای مفهوم کلیدی «${u.topic}» در این درس است؟`,
          promptEn: `Which term best captures the core vocabulary theme of "${u.titleEn}"?`,
          explanationFa: `این عبارت در دیالوگ‌های کاربردی این سطح مکرراً برای برقراری ارتباط موثر استفاده می‌شود.`,
          options: [
            { id: 1, textEn: "Contextual expression and polite response", textFa: "اصطلاح مناسب زمینه و پاسخ مؤدبانه" },
            { id: 2, textEn: "Irrelevant passive voice idiom", textFa: "اصطلاح نامربوط مجهول" },
            { id: 3, textEn: "Technical terminology without practical usage", textFa: "اصطلاح فنی بدون کاربرد روزمره" },
            { id: 4, textEn: "Slang exclusively used in informal texting", textFa: "اصطلاحات عامیانه صرفاً چت متنی" },
          ],
          correctOptionId: 1,
        },
        grammar: {
          skill: "grammar",
          promptFa: `در این ساختار زبانی، کدام گزینه گرامر صحیح و استاندارد را نشان می‌دهد؟`,
          promptEn: `Select the grammatically accurate sentence reflecting the lesson's target structure:`,
          explanationFa: `ساختار درست گرامری بر اساس سطح ${lvl.cefr} کتاب نیازمند هماهنگی دقیق زمان فعل و مطابقت فاعل است.`,
          options: [
            { id: 1, textEn: "Could you please explain how this works?", textFa: "آیا می‌توانید لطفاً توضیح دهید این چطور کار می‌کند؟" },
            { id: 2, textEn: "Could you please to explain how does this work?", textFa: "ساختار نادرست مصدری و ترتیب پرسشی مضاعف" },
            { id: 3, textEn: "Can you explained how this working?", textFa: "زمان اشتباه فعل کمکی و وجه وصفی" },
            { id: 4, textEn: "Do you could explain how it work?", textFa: "ترکیب غلط فعل کمکی do با could" },
          ],
          correctOptionId: 1,
        },
        speaking: {
          skill: "speaking",
          promptFa: `عبارت زیر را با تلفظ صحیح و آهنگ کلام استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:`,
          promptEn: `Read the key phrase aloud with clear American pronunciation and record your response:`,
          targetPhraseEn: `I'd appreciate it if you could assist me with this matter.`,
          targetPhraseFa: `ممنون می‌شوم اگر بتوانید در این زمینه به من کمک کنید.`,
          phoneticGuide: `/aɪd əˈpriːʃieɪt ɪt ɪf juː kʊd əˈsɪst miː wɪð ðɪs ˈmætər/`,
          speakingTipsFa: `روی تلفظ پیوسته (Connected Speech) عبارت "I'd appreciate it" و تلفظ نرم صداهای /d/ و /t/ تمرکز کنید.`,
          explanationFa: `این عبارت یکی از رایج‌ترین و محترمانه‌ترین شیوه‌های درخواست در زبان انگلیسی بین‌المللی است.`,
        },
        reading: {
          skill: "reading",
          promptFa: `با توجه به خلاصه درس و ترنسکریپت ارائه شده، هدف اصلی گوینده در این بخش چیست؟`,
          promptEn: `Based on the lesson context, what is the speaker's primary communicative goal?`,
          explanationFa: `هدف اصلی گوینده برقراری ارتباط موثر و تبادل اطلاعات با لحن متناسب با سطح موقعیت است.`,
          options: [
            { id: 1, textEn: "To clarify requirements and facilitate polite communication.", textFa: "شفاف‌سازی خواسته‌ها و تسهیل گفتگوی مؤدبانه." },
            { id: 2, textEn: "To refuse the invitation due to scheduling conflict.", textFa: "رد دعوت به دلیل تداخل برنامه‌ها." },
            { id: 3, textEn: "To file a formal legal protest.", textFa: "طرح شکایت رسمی قانونی." },
            { id: 4, textEn: "To negotiate a financial discount.", textFa: "مذاکره برای تخفیف مالی." },
          ],
          correctOptionId: 1,
        },
        writing: {
          skill: "writing",
          promptFa: `بر اساس آموخته‌های این ویدیو، ۲ تا ۳ جمله انگلیسی بنویسید که در آن از کلمات کلیدی مشخص‌شده استفاده شده باشد.`,
          promptEn: `Write a concise 2-3 sentence paragraph related to this lesson's topic using the required keywords.`,
          minWords: 15,
          keywordsToUse: ["appreciate", "assistance", "certainly"],
          sampleAnswerEn: `I really appreciate your timely assistance during today's session. Certainly, this guidance makes a notable difference in my learning journey.`,
          sampleAnswerFa: `من واقعاً از کمک به‌موقع شما در جلسه امروز سپاسگزارم. مسلماً این راهنمایی تفاوت چشمگیری در مسیر یادگیری من ایجاد می‌کند.`,
          evaluationTipsFa: `دقت در نگارش املای کلمات، استفاده از حروف بزرگ در ابتدای جملات و نشانه‌گذاری مناسب ضروری است.`,
          explanationFa: `متن شما بر اساس کاربرد درست واژگان کلیدی، دقت گرامری و ارتباط با موضوع درس ارزیابی خواهد شد.`,
        },
      };

      fileContent += `  {
    id: "${lessonId}",
    level: "${lvl.tier}",
    episodeNumber: ${epNum},
    titleFa: "${u.titleFa}",
    titleEn: "${u.titleEn}",
    bookLevel: "${lvl.bookTitleFa} · درس ${epNum}",
    unit: "${u.unit}",
    cefr: "${lvl.cefr}",
    duration: "${u.duration}",
    durationSec: ${u.durationSec},
    posterGradient: "${lvl.gradient}",
    posterIcon: "${u.icon}",
    summaryFa: "در این ویدیو از مجموعه ${lvl.bookTitleFa}، مکالمات استاندارد و کاربردی پیرامون موضوع «${u.titleFa}» را به همراه کاربردهای واقعی زبان انگلیسی تمرین می‌کنید.",
    summaryEn: "In this episode from ${lvl.bookTitleEn}, learners explore practical dialogues and functional language focusing on '${u.titleEn}'.",
    keyTopicsFa: ["${u.topic}", "کاربرد در مکالمه واقعی", "تلفظ و لحن آمریکایی", "درک شنیداری نیتیو"],
    transcript: ${JSON.stringify(transcript, null, 6)},
    questions: ${JSON.stringify(questions, null, 6)},
  },\n`;
    }
  }

  fileContent += `];

export function getAEFLevelMeta(level: string): AEFLevelMeta | undefined {
  return AEF_LEVELS_META[level.toLowerCase() as AEFLevelTier];
}

export function getAllAEFLevels(): AEFLevelMeta[] {
  return Object.values(AEF_LEVELS_META);
}

export function getAEFLessonsByLevel(level: string): AEFVideoLesson[] {
  const norm = level.toLowerCase();
  return AEF_LESSONS.filter((l) => l.level === norm);
}

export function getAEFLessonById(id: string): AEFVideoLesson | undefined {
  return AEF_LESSONS.find((l) => l.id.toLowerCase() === id.toLowerCase());
}

export function getNextAEFLesson(currentId: string): AEFVideoLesson | null {
  const current = getAEFLessonById(currentId);
  if (!current) return null;
  const levelLessons = getAEFLessonsByLevel(current.level);
  const nextInLevel = levelLessons.find((l) => l.episodeNumber === current.episodeNumber + 1);
  return nextInLevel || null;
}
`;

  return fileContent;
}

const outputPath = "E:/0/Work/Website/The General Website/Endoora/apps/web/lib/aef-curriculum.ts";
const content = generateCurriculumContent();
fs.writeFileSync(outputPath, content, 'utf-8');
console.log(`Generated AEF Curriculum file successfully at ${outputPath} (${content.length} bytes)`);
