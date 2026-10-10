// American English File - Tier C1 Atomic Grammar Specs (10 Stages x 20 Authentic Sentences = 200 Sentences)
// Granular 4-5 node atomic routing where each hexagon tests a distinct grammatical role.
// Authentic English structures, exact Persian translations, and L1 interference traps.

import type { TierSpecMap } from './spec-types.ts';

export const C1_SPECS: TierSpecMap = {
  "1": [
    {
      "prompt": "Hardly",
      "trans": "به زحمت به خانه رسیده بودم که باران شروع شد.",
      "steps": [
        {
          "corr": "had",
          "dist": [
            "did",
            "was",
            "has",
            "were",
            "would"
          ],
          "trap": {
            "text": "did",
            "exp": "با Hardly برای عمل گذشته مقدم had به کار می‌رود."
          }
        },
        {
          "corr": "I",
          "dist": [
            "me",
            "my",
            "myself",
            "mine"
          ]
        },
        {
          "corr": "arrived",
          "dist": [
            "arrive",
            "arriving",
            "arrives",
            "to arrive"
          ]
        },
        {
          "corr": "home",
          "dist": [
            "to home",
            "at home",
            "in home",
            "for home"
          ],
          "trap": {
            "text": "to home",
            "exp": "کلمه home قید مکان است و بدون to می‌آید."
          }
        },
        {
          "corr": "when it rained.",
          "dist": [
            "than it rained.",
            "while it rained.",
            "then it rained.",
            "that it rained."
          ],
          "trap": {
            "text": "than it rained.",
            "exp": "جفت همبسته Hardly کلمه when است."
          }
        }
      ]
    },
    {
      "prompt": "Rarely",
      "trans": "به ندرت ما چنین غروب زیبایی را در این ساحل دیده‌ایم.",
      "steps": [
        {
          "corr": "have",
          "dist": [
            "had",
            "did",
            "do",
            "were",
            "are"
          ]
        },
        {
          "corr": "we",
          "dist": [
            "us",
            "our",
            "ours",
            "ourselves"
          ]
        },
        {
          "corr": "seen",
          "dist": [
            "saw",
            "see",
            "seeing",
            "sees"
          ]
        },
        {
          "corr": "such a sunset",
          "dist": [
            "so sunset",
            "such sunset",
            "so a sunset",
            "a such sunset"
          ],
          "trap": {
            "text": "so a sunset",
            "exp": "قبل از اسم مفرد such a به کار می‌رود."
          }
        },
        {
          "corr": "on this beach.",
          "dist": [
            "at this beach.",
            "in this beach.",
            "to this beach.",
            "by this beach."
          ]
        }
      ]
    },
    {
      "prompt": "Seldom",
      "trans": "به ندرت او برای جلسات صبحگاهی دوشنبه دیر می‌رسد.",
      "steps": [
        {
          "corr": "does",
          "dist": [
            "is",
            "has",
            "did",
            "was",
            "would"
          ]
        },
        {
          "corr": "he",
          "dist": [
            "him",
            "his",
            "himself",
            "to him"
          ]
        },
        {
          "corr": "arrive",
          "dist": [
            "arrives",
            "arrived",
            "arriving",
            "to arrive"
          ]
        },
        {
          "corr": "late",
          "dist": [
            "lately",
            "latelier",
            "latish",
            "lateliest"
          ],
          "trap": {
            "text": "lately",
            "exp": "کلمه lately به معنی اخیراً است؛ برای دیر رسیدن late قید است."
          }
        },
        {
          "corr": "for work.",
          "dist": [
            "to work.",
            "at work.",
            "in work.",
            "by work."
          ]
        }
      ]
    },
    {
      "prompt": "Little",
      "trans": "او اصلاً نمی‌دانست که دوستانش برایش جشن گرفته‌اند.",
      "steps": [
        {
          "corr": "did",
          "dist": [
            "had",
            "was",
            "does",
            "would",
            "is"
          ]
        },
        {
          "corr": "she",
          "dist": [
            "her",
            "hers",
            "herself",
            "to her"
          ]
        },
        {
          "corr": "know",
          "dist": [
            "knew",
            "known",
            "knowing",
            "knows"
          ]
        },
        {
          "corr": "about",
          "dist": [
            "of",
            "for",
            "with",
            "from"
          ]
        },
        {
          "corr": "the party.",
          "dist": [
            "a party.",
            "party the.",
            "to party.",
            "for party."
          ]
        }
      ]
    },
    {
      "prompt": "Under no circumstances",
      "trans": "تحت هیچ شرایطی نباید این در را در شب باز کنید.",
      "steps": [
        {
          "corr": "should",
          "dist": [
            "must",
            "can",
            "may",
            "would",
            "shall"
          ]
        },
        {
          "corr": "you",
          "dist": [
            "your",
            "yours",
            "yourself",
            "to you"
          ]
        },
        {
          "corr": "open",
          "dist": [
            "opened",
            "opening",
            "opens",
            "to open"
          ]
        },
        {
          "corr": "this door",
          "dist": [
            "door this",
            "the this door",
            "a this door",
            "to this door"
          ]
        },
        {
          "corr": "at night.",
          "dist": [
            "in night.",
            "on night.",
            "by night.",
            "for night."
          ]
        }
      ]
    },
    {
      "prompt": "Nowhere else",
      "trans": "در هیچ جای دیگری نمی‌توانید قهوه‌ای به این خوش‌طعمی پیدا کنید.",
      "steps": [
        {
          "corr": "can",
          "dist": [
            "could",
            "do",
            "are",
            "may",
            "will"
          ]
        },
        {
          "corr": "you",
          "dist": [
            "your",
            "yours",
            "yourself",
            "to you"
          ]
        },
        {
          "corr": "find",
          "dist": [
            "found",
            "finding",
            "finds",
            "to find"
          ]
        },
        {
          "corr": "such good coffee",
          "dist": [
            "so good coffee",
            "such coffee good",
            "coffee such good",
            "so coffee good"
          ]
        },
        {
          "corr": "in town.",
          "dist": [
            "at town.",
            "on town.",
            "to town.",
            "by town."
          ]
        }
      ]
    },
    {
      "prompt": "Never before",
      "trans": "او هرگز پیش از این غذایی به این تندی نخورده بود.",
      "steps": [
        {
          "corr": "had",
          "dist": [
            "did",
            "was",
            "has",
            "were",
            "would"
          ]
        },
        {
          "corr": "he",
          "dist": [
            "him",
            "his",
            "himself",
            "to him"
          ]
        },
        {
          "corr": "eaten",
          "dist": [
            "ate",
            "eat",
            "eating",
            "eats"
          ]
        },
        {
          "corr": "such spicy food",
          "dist": [
            "so spicy food",
            "such food spicy",
            "food such spicy",
            "so food spicy"
          ]
        },
        {
          "corr": "in a restaurant.",
          "dist": [
            "at restaurant a.",
            "on a restaurant.",
            "to a restaurant.",
            "by restaurant a."
          ]
        }
      ]
    },
    {
      "prompt": "Scarcely",
      "trans": "به زحمت او نشسته بود که تلفن زنگ خورد.",
      "steps": [
        {
          "corr": "had",
          "dist": [
            "did",
            "was",
            "has",
            "were",
            "would"
          ]
        },
        {
          "corr": "she",
          "dist": [
            "her",
            "hers",
            "herself",
            "to her"
          ]
        },
        {
          "corr": "sat down",
          "dist": [
            "sit down",
            "sitting down",
            "sits down",
            "to sit down"
          ]
        },
        {
          "corr": "when",
          "dist": [
            "than",
            "then",
            "while",
            "that"
          ]
        },
        {
          "corr": "the phone rang.",
          "dist": [
            "phone the rang.",
            "rang the phone.",
            "the phone ring.",
            "a phone rang."
          ]
        }
      ]
    },
    {
      "prompt": "At no time",
      "trans": "من در هیچ مقطعی احساس خطر نکردم.",
      "steps": [
        {
          "corr": "did",
          "dist": [
            "was",
            "had",
            "do",
            "would",
            "could"
          ]
        },
        {
          "corr": "I",
          "dist": [
            "me",
            "my",
            "myself",
            "mine"
          ]
        },
        {
          "corr": "feel",
          "dist": [
            "felt",
            "feeling",
            "feels",
            "to feel"
          ]
        },
        {
          "corr": "afraid",
          "dist": [
            "fearful",
            "afraided",
            "fear",
            "in fear"
          ]
        },
        {
          "corr": "during the walk.",
          "dist": [
            "while the walk.",
            "at the walk.",
            "for the walk.",
            "by the walk."
          ]
        }
      ]
    },
    {
      "prompt": "Not only",
      "trans": "او نه تنها آواز خواند، بلکه پیانو هم نواخت.",
      "steps": [
        {
          "corr": "did",
          "dist": [
            "was",
            "had",
            "does",
            "would",
            "could"
          ]
        },
        {
          "corr": "she",
          "dist": [
            "her",
            "hers",
            "herself",
            "to her"
          ]
        },
        {
          "corr": "sing,",
          "dist": [
            "sang,",
            "sung,",
            "singing,",
            "sings,"
          ]
        },
        {
          "corr": "but she also",
          "dist": [
            "and she also",
            "also she",
            "but also she",
            "however she"
          ]
        },
        {
          "corr": "played piano.",
          "dist": [
            "play piano.",
            "playing piano.",
            "played the piano.",
            "piano played."
          ]
        }
      ]
    },
    {
      "prompt": "Hardly",
      "trans": "به زحمت فیلم شروع شده بود که برق رفت.",
      "steps": [
        {
          "corr": "had",
          "dist": [
            "did",
            "was",
            "has",
            "were",
            "would"
          ]
        },
        {
          "corr": "the movie",
          "dist": [
            "movie the",
            "a movie",
            "the movies",
            "to movie"
          ]
        },
        {
          "corr": "started",
          "dist": [
            "start",
            "starting",
            "starts",
            "to start"
          ]
        },
        {
          "corr": "when the power",
          "dist": [
            "than the power",
            "while the power",
            "then the power",
            "that the power"
          ]
        },
        {
          "corr": "went out.",
          "dist": [
            "gone out.",
            "go out.",
            "goes out.",
            "out went."
          ]
        }
      ]
    },
    {
      "prompt": "Rarely",
      "trans": "به ندرت پدرم در طول روز چرت می‌زند.",
      "steps": [
        {
          "corr": "does",
          "dist": [
            "is",
            "has",
            "did",
            "was",
            "would"
          ]
        },
        {
          "corr": "my father",
          "dist": [
            "father my",
            "the my father",
            "my fathers",
            "to my father"
          ]
        },
        {
          "corr": "take",
          "dist": [
            "takes",
            "took",
            "taking",
            "to take"
          ]
        },
        {
          "corr": "a nap",
          "dist": [
            "nap a",
            "the nap",
            "an nap",
            "to nap"
          ]
        },
        {
          "corr": "in the afternoon.",
          "dist": [
            "at the afternoon.",
            "on afternoon the.",
            "for afternoon.",
            "by afternoon."
          ]
        }
      ]
    },
    {
      "prompt": "Seldom",
      "trans": "به ندرت این فروشگاه خدمات ضعیفی به مشتریان می‌دهد.",
      "steps": [
        {
          "corr": "does",
          "dist": [
            "is",
            "has",
            "did",
            "was",
            "would"
          ]
        },
        {
          "corr": "this shop",
          "dist": [
            "shop this",
            "the this shop",
            "a this shop",
            "to shop"
          ]
        },
        {
          "corr": "give",
          "dist": [
            "gives",
            "gave",
            "giving",
            "to give"
          ]
        },
        {
          "corr": "poor service",
          "dist": [
            "service poor",
            "a poor service",
            "poorly service",
            "the poor service"
          ]
        },
        {
          "corr": "to customers.",
          "dist": [
            "at customers.",
            "for customers.",
            "with customers.",
            "by customers."
          ]
        }
      ]
    },
    {
      "prompt": "Little",
      "trans": "ما اصلاً خبر نداشتیم که جاده مسدود است.",
      "steps": [
        {
          "corr": "did",
          "dist": [
            "had",
            "were",
            "was",
            "do",
            "would"
          ]
        },
        {
          "corr": "we",
          "dist": [
            "us",
            "our",
            "ours",
            "ourselves"
          ]
        },
        {
          "corr": "realize",
          "dist": [
            "realized",
            "realizing",
            "realizes",
            "to realize"
          ]
        },
        {
          "corr": "the road",
          "dist": [
            "road the",
            "a road",
            "that road",
            "to road"
          ]
        },
        {
          "corr": "was closed.",
          "dist": [
            "were closed.",
            "is closed.",
            "closed was.",
            "has closed."
          ]
        }
      ]
    },
    {
      "prompt": "Nowhere",
      "trans": "در هیچ جا هوایی به این پاکیزگی استشمام نخواهید کرد.",
      "steps": [
        {
          "corr": "will",
          "dist": [
            "do",
            "are",
            "would",
            "can",
            "did"
          ]
        },
        {
          "corr": "you",
          "dist": [
            "your",
            "yours",
            "yourself",
            "to you"
          ]
        },
        {
          "corr": "breathe",
          "dist": [
            "breathed",
            "breathing",
            "breathes",
            "breath"
          ]
        },
        {
          "corr": "such fresh air",
          "dist": [
            "so fresh air",
            "such air fresh",
            "air such fresh",
            "so air fresh"
          ]
        },
        {
          "corr": "in the hills.",
          "dist": [
            "at the hills.",
            "on hills the.",
            "to hills.",
            "by hills."
          ]
        }
      ]
    },
    {
      "prompt": "Never",
      "trans": "من هرگز قبلاً چنین داستانی نشنیده بودم.",
      "steps": [
        {
          "corr": "had",
          "dist": [
            "did",
            "was",
            "have",
            "were",
            "would"
          ]
        },
        {
          "corr": "I",
          "dist": [
            "me",
            "my",
            "myself",
            "mine"
          ]
        },
        {
          "corr": "heard",
          "dist": [
            "hear",
            "hearing",
            "hears",
            "to hear"
          ]
        },
        {
          "corr": "such a story",
          "dist": [
            "so story",
            "such story",
            "so a story",
            "a such story"
          ]
        },
        {
          "corr": "from anyone.",
          "dist": [
            "by anyone.",
            "with anyone.",
            "at anyone.",
            "of anyone."
          ]
        }
      ]
    },
    {
      "prompt": "Scarcely",
      "trans": "به زحمت او از پله‌ها بالا رفته بود که زنگ به صدا درآمد.",
      "steps": [
        {
          "corr": "had",
          "dist": [
            "did",
            "was",
            "has",
            "were",
            "would"
          ]
        },
        {
          "corr": "he",
          "dist": [
            "him",
            "his",
            "himself",
            "to him"
          ]
        },
        {
          "corr": "gone up",
          "dist": [
            "go up",
            "went up",
            "going up",
            "goes up"
          ]
        },
        {
          "corr": "when the bell",
          "dist": [
            "than the bell",
            "while the bell",
            "then the bell",
            "that the bell"
          ]
        },
        {
          "corr": "rang.",
          "dist": [
            "ring.",
            "rung.",
            "ringing.",
            "to ring."
          ]
        }
      ]
    },
    {
      "prompt": "Under no circumstances",
      "trans": "تحت هیچ شرایطی اجازه ندهید کودکان بدون مراقبت شنا کنند.",
      "steps": [
        {
          "corr": "should",
          "dist": [
            "must",
            "can",
            "may",
            "would",
            "shall"
          ]
        },
        {
          "corr": "parents",
          "dist": [
            "the parents",
            "a parent",
            "parent",
            "to parents"
          ]
        },
        {
          "corr": "allow",
          "dist": [
            "allowed",
            "allowing",
            "allows",
            "to allow"
          ]
        },
        {
          "corr": "kids to swim",
          "dist": [
            "kids swim to",
            "to swim kids",
            "kids swimming",
            "swim kids to"
          ]
        },
        {
          "corr": "alone.",
          "dist": [
            "lonely.",
            "loneliness.",
            "aloned.",
            "in alone."
          ]
        }
      ]
    },
    {
      "prompt": "At no time",
      "trans": "او در هیچ زمانی هدف اصلی‌اش را فراموش نکرد.",
      "steps": [
        {
          "corr": "did",
          "dist": [
            "had",
            "was",
            "does",
            "would",
            "could"
          ]
        },
        {
          "corr": "she",
          "dist": [
            "her",
            "hers",
            "herself",
            "to her"
          ]
        },
        {
          "corr": "forget",
          "dist": [
            "forgot",
            "forgotten",
            "forgetting",
            "forgets"
          ]
        },
        {
          "corr": "her main goal",
          "dist": [
            "main goal her",
            "the her main goal",
            "a main goal her",
            "to main goal"
          ]
        },
        {
          "corr": "in life.",
          "dist": [
            "at life.",
            "on life.",
            "by life.",
            "for life."
          ]
        }
      ]
    },
    {
      "prompt": "Rarely",
      "trans": "به ندرت برادرم برای صبحانه نان تست می‌خورد.",
      "steps": [
        {
          "corr": "does",
          "dist": [
            "is",
            "has",
            "did",
            "was",
            "would"
          ]
        },
        {
          "corr": "my brother",
          "dist": [
            "brother my",
            "the my brother",
            "my brothers",
            "to my brother"
          ]
        },
        {
          "corr": "eat",
          "dist": [
            "eats",
            "ate",
            "eating",
            "to eat"
          ]
        },
        {
          "corr": "toast",
          "dist": [
            "a toast",
            "the toast",
            "toasts",
            "to toast"
          ]
        },
        {
          "corr": "for breakfast.",
          "dist": [
            "at breakfast.",
            "in breakfast.",
            "on breakfast.",
            "by breakfast."
          ]
        }
      ]
    }
  ],
  "2": [
    {
      "prompt": "Not only",
      "trans": "او نه تنها نمره قبولی گرفت، بلکه جایزه‌ای هم برد.",
      "steps": [
        {
          "corr": "did",
          "dist": [
            "was",
            "had",
            "does",
            "would",
            "is"
          ]
        },
        {
          "corr": "he",
          "dist": [
            "him",
            "his",
            "himself",
            "to him"
          ]
        },
        {
          "corr": "pass,",
          "dist": [
            "passed,",
            "passing,",
            "passes,",
            "to pass,"
          ]
        },
        {
          "corr": "but he also",
          "dist": [
            "and he also",
            "also he",
            "but also he",
            "however he"
          ]
        },
        {
          "corr": "won a prize.",
          "dist": [
            "win a prize.",
            "winning prize.",
            "won prize a.",
            "prize won."
          ]
        }
      ]
    },
    {
      "prompt": "Not until",
      "trans": "تا زمانی که به خانه نرسیدم، متوجه گم شدن کلیدم نشدم.",
      "steps": [
        {
          "corr": "I got home",
          "dist": [
            "got I home",
            "I get home",
            "home I got",
            "I was home"
          ]
        },
        {
          "corr": "did",
          "dist": [
            "had",
            "was",
            "do",
            "would",
            "could"
          ]
        },
        {
          "corr": "I",
          "dist": [
            "me",
            "my",
            "myself",
            "mine"
          ]
        },
        {
          "corr": "miss",
          "dist": [
            "missed",
            "missing",
            "misses",
            "to miss"
          ]
        },
        {
          "corr": "my key.",
          "dist": [
            "key my.",
            "the key my.",
            "a key my.",
            "my keys."
          ]
        }
      ]
    },
    {
      "prompt": "Only after",
      "trans": "فقط پس از پایان کلاس بود که باران شروع شد.",
      "steps": [
        {
          "corr": "class ended",
          "dist": [
            "ended class",
            "class end",
            "class ending",
            "ended the class"
          ]
        },
        {
          "corr": "did",
          "dist": [
            "had",
            "was",
            "does",
            "would",
            "is"
          ]
        },
        {
          "corr": "it",
          "dist": [
            "its",
            "itself",
            "to it",
            "he"
          ]
        },
        {
          "corr": "start",
          "dist": [
            "started",
            "starting",
            "starts",
            "to start"
          ]
        },
        {
          "corr": "to rain.",
          "dist": [
            "for rain.",
            "raining to.",
            "to raining.",
            "rain to."
          ]
        }
      ]
    },
    {
      "prompt": "No sooner",
      "trans": "به محض اینکه نشستیم، پیشخدمت آمد.",
      "steps": [
        {
          "corr": "had",
          "dist": [
            "did",
            "was",
            "have",
            "were",
            "would"
          ]
        },
        {
          "corr": "we",
          "dist": [
            "us",
            "our",
            "ours",
            "ourselves"
          ]
        },
        {
          "corr": "sat down",
          "dist": [
            "sit down",
            "sitting down",
            "sits down",
            "to sit down"
          ]
        },
        {
          "corr": "than",
          "dist": [
            "when",
            "then",
            "while",
            "that"
          ]
        },
        {
          "corr": "the waiter came.",
          "dist": [
            "waiter the came.",
            "came the waiter.",
            "the waiter come.",
            "a waiter came."
          ]
        }
      ]
    },
    {
      "prompt": "Only when",
      "trans": "تنها وقتی چراغ‌ها خاموش شدند، صدای موسیقی را شنیدیم.",
      "steps": [
        {
          "corr": "the lights",
          "dist": [
            "lights the",
            "a lights",
            "light the",
            "to lights"
          ]
        },
        {
          "corr": "went off",
          "dist": [
            "go off",
            "gone off",
            "going off",
            "goes off"
          ]
        },
        {
          "corr": "did we",
          "dist": [
            "we did",
            "had we",
            "were we",
            "we had"
          ]
        },
        {
          "corr": "hear",
          "dist": [
            "heard",
            "hearing",
            "hears",
            "to hear"
          ]
        },
        {
          "corr": "the music.",
          "dist": [
            "music the.",
            "a music.",
            "the musics.",
            "to music."
          ]
        }
      ]
    },
    {
      "prompt": "Only then",
      "trans": "تنها در آن زمان بود که او حقیقت را به همه گفت.",
      "steps": [
        {
          "corr": "did",
          "dist": [
            "was",
            "had",
            "does",
            "would",
            "is"
          ]
        },
        {
          "corr": "she",
          "dist": [
            "her",
            "hers",
            "herself",
            "to her"
          ]
        },
        {
          "corr": "tell",
          "dist": [
            "told",
            "telling",
            "tells",
            "to tell"
          ]
        },
        {
          "corr": "the truth",
          "dist": [
            "truth the",
            "a truth",
            "true the",
            "to truth"
          ]
        },
        {
          "corr": "to everyone.",
          "dist": [
            "at everyone.",
            "for everyone.",
            "with everyone.",
            "by everyone."
          ]
        }
      ]
    },
    {
      "prompt": "Not only",
      "trans": "این ماشین نه تنها سریع است، بلکه سوخت کمی هم مصرف می‌کند.",
      "steps": [
        {
          "corr": "is",
          "dist": [
            "does",
            "has",
            "was",
            "would",
            "be"
          ]
        },
        {
          "corr": "this car",
          "dist": [
            "car this",
            "the this car",
            "a this car",
            "to car"
          ]
        },
        {
          "corr": "fast,",
          "dist": [
            "fastly,",
            "faster,",
            "fastest,",
            "being fast,"
          ]
        },
        {
          "corr": "but it also",
          "dist": [
            "and it also",
            "also it",
            "but also it",
            "however it"
          ]
        },
        {
          "corr": "saves fuel.",
          "dist": [
            "save fuel.",
            "saving fuel.",
            "fuel saves.",
            "saves a fuel."
          ]
        }
      ]
    },
    {
      "prompt": "Not until",
      "trans": "تا صبح روز بعد بود که پلیس به آنجا رسید.",
      "steps": [
        {
          "corr": "morning",
          "dist": [
            "the morning",
            "a morning",
            "mornings",
            "to morning"
          ]
        },
        {
          "corr": "did",
          "dist": [
            "had",
            "was",
            "do",
            "would",
            "could"
          ]
        },
        {
          "corr": "the police",
          "dist": [
            "police the",
            "a police",
            "the polices",
            "to police"
          ]
        },
        {
          "corr": "arrive",
          "dist": [
            "arrived",
            "arriving",
            "arrives",
            "to arrive"
          ]
        },
        {
          "corr": "at the scene.",
          "dist": [
            "in the scene.",
            "on scene the.",
            "to the scene.",
            "for scene the."
          ]
        }
      ]
    },
    {
      "prompt": "No sooner",
      "trans": "به محض اینکه قطار توقف کرد، مسافران پیاده شدند.",
      "steps": [
        {
          "corr": "had",
          "dist": [
            "did",
            "was",
            "has",
            "were",
            "would"
          ]
        },
        {
          "corr": "the train",
          "dist": [
            "train the",
            "a train",
            "the trains",
            "to train"
          ]
        },
        {
          "corr": "stopped",
          "dist": [
            "stop",
            "stopping",
            "stops",
            "to stop"
          ]
        },
        {
          "corr": "than",
          "dist": [
            "when",
            "then",
            "while",
            "that"
          ]
        },
        {
          "corr": "people got off.",
          "dist": [
            "got people off.",
            "people get off.",
            "off people got.",
            "people getting off."
          ]
        }
      ]
    },
    {
      "prompt": "Only by",
      "trans": "تنها با تمرین زیاد می‌توانید پیانو را خوب بنوازید.",
      "steps": [
        {
          "corr": "practicing hard",
          "dist": [
            "practice hard",
            "hardly practicing",
            "to practice hard",
            "practicing hardly"
          ]
        },
        {
          "corr": "can",
          "dist": [
            "could",
            "do",
            "are",
            "may",
            "will"
          ]
        },
        {
          "corr": "you",
          "dist": [
            "your",
            "yours",
            "yourself",
            "to you"
          ]
        },
        {
          "corr": "play",
          "dist": [
            "played",
            "playing",
            "plays",
            "to play"
          ]
        },
        {
          "corr": "the piano well.",
          "dist": [
            "piano the well.",
            "the piano good.",
            "well piano the.",
            "piano well the."
          ]
        }
      ]
    },
    {
      "prompt": "Not only",
      "trans": "او نه تنها کتاب خرید، بلکه یک مجله هم تهیه کرد.",
      "steps": [
        {
          "corr": "did",
          "dist": [
            "was",
            "had",
            "does",
            "would",
            "could"
          ]
        },
        {
          "corr": "he",
          "dist": [
            "him",
            "his",
            "himself",
            "to him"
          ]
        },
        {
          "corr": "buy a book,",
          "dist": [
            "bought a book,",
            "buying book a,",
            "buy book a,",
            "bought book,"
          ]
        },
        {
          "corr": "but he also",
          "dist": [
            "and he also",
            "also he",
            "but also he",
            "however he"
          ]
        },
        {
          "corr": "got a magazine.",
          "dist": [
            "get a magazine.",
            "getting magazine.",
            "got magazine a.",
            "magazine got."
          ]
        }
      ]
    },
    {
      "prompt": "Only later",
      "trans": "تنها مدتی بعد بود که اهمیت آن پیام را فهمیدم.",
      "steps": [
        {
          "corr": "did",
          "dist": [
            "was",
            "had",
            "do",
            "would",
            "could"
          ]
        },
        {
          "corr": "I",
          "dist": [
            "me",
            "my",
            "myself",
            "mine"
          ]
        },
        {
          "corr": "understand",
          "dist": [
            "understood",
            "understanding",
            "understands",
            "to understand"
          ]
        },
        {
          "corr": "the note,",
          "dist": [
            "note the,",
            "a note,",
            "notes the,",
            "to note,"
          ]
        },
        {
          "corr": "which was clear.",
          "dist": [
            "who was clear.",
            "what was clear.",
            "that clear was.",
            "clear which was."
          ]
        }
      ]
    },
    {
      "prompt": "No sooner",
      "trans": "به محض اینکه در باز شد، سگ به حیاط دوید.",
      "steps": [
        {
          "corr": "had",
          "dist": [
            "did",
            "was",
            "has",
            "were",
            "would"
          ]
        },
        {
          "corr": "the door",
          "dist": [
            "door the",
            "a door",
            "the doors",
            "to door"
          ]
        },
        {
          "corr": "opened",
          "dist": [
            "open",
            "opening",
            "opens",
            "to open"
          ]
        },
        {
          "corr": "than the dog",
          "dist": [
            "when the dog",
            "then the dog",
            "while the dog",
            "that the dog"
          ]
        },
        {
          "corr": "ran outside.",
          "dist": [
            "run outside.",
            "running outside.",
            "runs outside.",
            "outside ran."
          ]
        }
      ]
    },
    {
      "prompt": "Not until",
      "trans": "تا زمانی که او عذرخواهی نکرد، من با او صحبت نکردم.",
      "steps": [
        {
          "corr": "he apologized",
          "dist": [
            "apologized he",
            "he apologize",
            "he apologizes",
            "did he apologize"
          ]
        },
        {
          "corr": "did",
          "dist": [
            "had",
            "was",
            "do",
            "would",
            "could"
          ]
        },
        {
          "corr": "I",
          "dist": [
            "me",
            "my",
            "myself",
            "mine"
          ]
        },
        {
          "corr": "speak",
          "dist": [
            "spoke",
            "spoken",
            "speaking",
            "speaks"
          ]
        },
        {
          "corr": "to him again.",
          "dist": [
            "at him again.",
            "with he again.",
            "by him again.",
            "for he again."
          ]
        }
      ]
    },
    {
      "prompt": "Only after",
      "trans": "فقط پس از صبحانه بود که ما راه افتادیم.",
      "steps": [
        {
          "corr": "breakfast",
          "dist": [
            "the breakfast",
            "a breakfast",
            "breakfasts",
            "to breakfast"
          ]
        },
        {
          "corr": "did",
          "dist": [
            "had",
            "were",
            "was",
            "do",
            "would"
          ]
        },
        {
          "corr": "we",
          "dist": [
            "us",
            "our",
            "ours",
            "ourselves"
          ]
        },
        {
          "corr": "set off",
          "dist": [
            "setting off",
            "sets off",
            "to set off",
            "setted off"
          ]
        },
        {
          "corr": "on our trip.",
          "dist": [
            "in our trip.",
            "at our trip.",
            "to our trip.",
            "for our trip."
          ]
        }
      ]
    },
    {
      "prompt": "Not only",
      "trans": "آن هتل نه تنها تمیز بود، بلکه صبحانه رایگان هم داشت.",
      "steps": [
        {
          "corr": "was",
          "dist": [
            "did",
            "had",
            "is",
            "were",
            "would"
          ]
        },
        {
          "corr": "the hotel",
          "dist": [
            "hotel the",
            "a hotel",
            "the hotels",
            "to hotel"
          ]
        },
        {
          "corr": "clean,",
          "dist": [
            "cleaned,",
            "cleaning,",
            "cleanly,",
            "being clean,"
          ]
        },
        {
          "corr": "but it also",
          "dist": [
            "and it also",
            "also it",
            "but also it",
            "however it"
          ]
        },
        {
          "corr": "served breakfast.",
          "dist": [
            "serve breakfast.",
            "serving breakfast.",
            "breakfast served.",
            "serves breakfast."
          ]
        }
      ]
    },
    {
      "prompt": "No sooner",
      "trans": "به محض اینکه زنگ پایان خورد، دانش‌آموزان رفتند.",
      "steps": [
        {
          "corr": "had",
          "dist": [
            "did",
            "was",
            "has",
            "were",
            "would"
          ]
        },
        {
          "corr": "the bell",
          "dist": [
            "bell the",
            "a bell",
            "the bells",
            "to bell"
          ]
        },
        {
          "corr": "rung",
          "dist": [
            "rang",
            "ring",
            "ringing",
            "rings"
          ]
        },
        {
          "corr": "than",
          "dist": [
            "when",
            "then",
            "while",
            "that"
          ]
        },
        {
          "corr": "students left.",
          "dist": [
            "students leave.",
            "left students.",
            "students leaving.",
            "students to leave."
          ]
        }
      ]
    },
    {
      "prompt": "Only with",
      "trans": "تنها با کار گروهی می‌توانیم این مسابقه را ببریم.",
      "steps": [
        {
          "corr": "teamwork",
          "dist": [
            "the teamwork",
            "a teamwork",
            "teamworks",
            "to teamwork"
          ]
        },
        {
          "corr": "can",
          "dist": [
            "could",
            "do",
            "are",
            "may",
            "will"
          ]
        },
        {
          "corr": "we",
          "dist": [
            "us",
            "our",
            "ours",
            "ourselves"
          ]
        },
        {
          "corr": "win",
          "dist": [
            "won",
            "winning",
            "wins",
            "to win"
          ]
        },
        {
          "corr": "the game.",
          "dist": [
            "game the.",
            "a game.",
            "to game.",
            "for game."
          ]
        }
      ]
    },
    {
      "prompt": "Not until",
      "trans": "تا عصر بود که اخبار به ما رسید.",
      "steps": [
        {
          "corr": "evening",
          "dist": [
            "the evening",
            "an evening",
            "evenings",
            "to evening"
          ]
        },
        {
          "corr": "did",
          "dist": [
            "had",
            "was",
            "do",
            "would",
            "could"
          ]
        },
        {
          "corr": "the news",
          "dist": [
            "news the",
            "a news",
            "the new",
            "to news"
          ]
        },
        {
          "corr": "reach",
          "dist": [
            "reached",
            "reaching",
            "reaches",
            "to reach"
          ]
        },
        {
          "corr": "us.",
          "dist": [
            "we.",
            "our.",
            "ours.",
            "ourselves."
          ]
        }
      ]
    },
    {
      "prompt": "Only then",
      "trans": "تنها در آن موقع بود که خلبان برگشت.",
      "steps": [
        {
          "corr": "did",
          "dist": [
            "was",
            "had",
            "does",
            "would",
            "could"
          ]
        },
        {
          "corr": "the pilot",
          "dist": [
            "pilot the",
            "a pilot",
            "the pilots",
            "to pilot"
          ]
        },
        {
          "corr": "turn",
          "dist": [
            "turned",
            "turning",
            "turns",
            "to turn"
          ]
        },
        {
          "corr": "the plane",
          "dist": [
            "plane the",
            "a plane",
            "planes the",
            "to plane"
          ]
        },
        {
          "corr": "around.",
          "dist": [
            "round.",
            "about.",
            "over.",
            "away."
          ]
        }
      ]
    }
  ],
  "3": [
    {
      "prompt": "Having finished",
      "trans": "او پس از تمام کردن ناهارش، سر کار برگشت.",
      "steps": [
        {
          "corr": "his lunch,",
          "dist": [
            "lunch his,",
            "the his lunch,",
            "a lunch his,",
            "his lunches,"
          ]
        },
        {
          "corr": "Tom",
          "dist": [
            "the Tom",
            "a Tom",
            "Tom's",
            "to Tom"
          ]
        },
        {
          "corr": "went back",
          "dist": [
            "go back",
            "going back",
            "goes back",
            "was go back"
          ]
        },
        {
          "corr": "to work",
          "dist": [
            "at work",
            "in work",
            "on work",
            "for work"
          ]
        },
        {
          "corr": "happily.",
          "dist": [
            "happy.",
            "in happy.",
            "with happy.",
            "happiness."
          ]
        }
      ]
    },
    {
      "prompt": "Feeling tired",
      "trans": "او که احساس خستگی می‌کرد، زود به خواب رفت.",
      "steps": [
        {
          "corr": "after work,",
          "dist": [
            "at work,",
            "before work,",
            "with work,",
            "during work,"
          ]
        },
        {
          "corr": "she",
          "dist": [
            "her",
            "hers",
            "herself",
            "to her"
          ]
        },
        {
          "corr": "went",
          "dist": [
            "go",
            "gone",
            "going",
            "goes"
          ]
        },
        {
          "corr": "to sleep",
          "dist": [
            "in sleep",
            "at sleep",
            "on sleep",
            "for sleep"
          ]
        },
        {
          "corr": "early.",
          "dist": [
            "earlier.",
            "earliest.",
            "at early.",
            "with early."
          ]
        }
      ]
    },
    {
      "prompt": "Knowing the city",
      "trans": "علی چون شهر را خوب می‌شناخت، بدون نقشه ما را راهنمایی کرد.",
      "steps": [
        {
          "corr": "very well,",
          "dist": [
            "very good,",
            "good very,",
            "well very,",
            "so good,"
          ]
        },
        {
          "corr": "Ali",
          "dist": [
            "the Ali",
            "an Ali",
            "Ali's",
            "to Ali"
          ]
        },
        {
          "corr": "guided us",
          "dist": [
            "guided we",
            "guide us",
            "guiding us",
            "guides us"
          ]
        },
        {
          "corr": "without",
          "dist": [
            "with no",
            "with not",
            "except",
            "unless"
          ]
        },
        {
          "corr": "a map.",
          "dist": [
            "map a.",
            "the map.",
            "map.",
            "to map."
          ]
        }
      ]
    },
    {
      "prompt": "Seen from",
      "trans": "این برج وقتی از بالا دیده شود، شبیه یک ستاره است.",
      "steps": [
        {
          "corr": "the top,",
          "dist": [
            "top the,",
            "a top,",
            "to top,",
            "on top,"
          ]
        },
        {
          "corr": "the tower",
          "dist": [
            "tower the",
            "a tower",
            "the towers",
            "to tower"
          ]
        },
        {
          "corr": "looks like",
          "dist": [
            "look like",
            "looks as",
            "looking like",
            "looked like"
          ]
        },
        {
          "corr": "a star",
          "dist": [
            "star a",
            "the star",
            "an star",
            "to star"
          ]
        },
        {
          "corr": "at night.",
          "dist": [
            "in night.",
            "on night.",
            "with night.",
            "by night."
          ]
        }
      ]
    },
    {
      "prompt": "Walking through",
      "trans": "ما در حال قدم زدن در پارک، یک پرنده نادر دیدیم.",
      "steps": [
        {
          "corr": "the park,",
          "dist": [
            "park the,",
            "a park,",
            "the parks,",
            "to park,"
          ]
        },
        {
          "corr": "we",
          "dist": [
            "us",
            "our",
            "ours",
            "ourselves"
          ]
        },
        {
          "corr": "saw",
          "dist": [
            "seen",
            "see",
            "seeing",
            "sees"
          ]
        },
        {
          "corr": "a rare bird",
          "dist": [
            "rare a bird",
            "bird a rare",
            "the rare bird",
            "a bird rare"
          ]
        },
        {
          "corr": "singing.",
          "dist": [
            "sang.",
            "sung.",
            "sing.",
            "to sing."
          ]
        }
      ]
    },
    {
      "prompt": "Having lost",
      "trans": "او پس از گم کردن کیف پولش، به پلیس مراجعه کرد.",
      "steps": [
        {
          "corr": "his wallet,",
          "dist": [
            "wallet his,",
            "the his wallet,",
            "a wallet his,",
            "his wallets,"
          ]
        },
        {
          "corr": "David",
          "dist": [
            "the David",
            "a David",
            "David's",
            "to David"
          ]
        },
        {
          "corr": "went",
          "dist": [
            "go",
            "gone",
            "going",
            "goes"
          ]
        },
        {
          "corr": "to the police",
          "dist": [
            "at the police",
            "in police the",
            "for police the",
            "with the police"
          ]
        },
        {
          "corr": "for help.",
          "dist": [
            "to help.",
            "at help.",
            "by help.",
            "in help."
          ]
        }
      ]
    },
    {
      "prompt": "Surrounded by",
      "trans": "او در احاطه دوستانش، تولدش را جشن گرفت.",
      "steps": [
        {
          "corr": "good friends,",
          "dist": [
            "friends good,",
            "the good friends,",
            "a good friends,",
            "to good friends,"
          ]
        },
        {
          "corr": "she",
          "dist": [
            "her",
            "hers",
            "herself",
            "to her"
          ]
        },
        {
          "corr": "celebrated",
          "dist": [
            "celebrate",
            "celebrating",
            "celebrates",
            "to celebrate"
          ]
        },
        {
          "corr": "her birthday",
          "dist": [
            "birthday her",
            "the her birthday",
            "a birthday her",
            "to birthday"
          ]
        },
        {
          "corr": "at home.",
          "dist": [
            "in home.",
            "on home.",
            "to home.",
            "by home."
          ]
        }
      ]
    },
    {
      "prompt": "Not knowing",
      "trans": "من چون مسیر را نمی‌دانستم، از یک رهگذر سوال کردم.",
      "steps": [
        {
          "corr": "the way,",
          "dist": [
            "way the,",
            "a way,",
            "the ways,",
            "to way,"
          ]
        },
        {
          "corr": "I",
          "dist": [
            "me",
            "my",
            "myself",
            "mine"
          ]
        },
        {
          "corr": "asked",
          "dist": [
            "ask",
            "asking",
            "asks",
            "to ask"
          ]
        },
        {
          "corr": "a stranger",
          "dist": [
            "stranger a",
            "the stranger",
            "an stranger",
            "to stranger"
          ]
        },
        {
          "corr": "for help.",
          "dist": [
            "to help.",
            "at help.",
            "with help.",
            "in help."
          ]
        }
      ]
    },
    {
      "prompt": "Shocked by",
      "trans": "او که از شنیدن این خبر شوکه شده بود، کلمه‌ای حرف نزد.",
      "steps": [
        {
          "corr": "the news,",
          "dist": [
            "news the,",
            "a news,",
            "the new,",
            "to news,"
          ]
        },
        {
          "corr": "he",
          "dist": [
            "him",
            "his",
            "himself",
            "to him"
          ]
        },
        {
          "corr": "said",
          "dist": [
            "say",
            "saying",
            "says",
            "to say"
          ]
        },
        {
          "corr": "nothing",
          "dist": [
            "anything",
            "not anything",
            "no thing",
            "none"
          ]
        },
        {
          "corr": "at all.",
          "dist": [
            "in all.",
            "of all.",
            "by all.",
            "for all."
          ]
        }
      ]
    },
    {
      "prompt": "Having worked",
      "trans": "پدرم پس از کار در تمام طول روز، روی کاناپه خوابید.",
      "steps": [
        {
          "corr": "all day,",
          "dist": [
            "day all,",
            "the all day,",
            "all of day,",
            "at all day,"
          ]
        },
        {
          "corr": "my father",
          "dist": [
            "father my",
            "the my father",
            "my fathers",
            "to my father"
          ]
        },
        {
          "corr": "fell asleep",
          "dist": [
            "fall asleep",
            "falling asleep",
            "falls asleep",
            "felt asleep"
          ]
        },
        {
          "corr": "on the sofa",
          "dist": [
            "in the sofa",
            "at sofa the",
            "to the sofa",
            "by sofa the"
          ]
        },
        {
          "corr": "peacefully.",
          "dist": [
            "peaceful.",
            "in peace.",
            "with peaceful.",
            "peace."
          ]
        }
      ]
    },
    {
      "prompt": "Damaged by",
      "trans": "این ماشین که در طوفان آسیب دیده بود، به تعمیرگاه رفت.",
      "steps": [
        {
          "corr": "the storm,",
          "dist": [
            "storm the,",
            "a storm,",
            "the storms,",
            "to storm,"
          ]
        },
        {
          "corr": "the car",
          "dist": [
            "car the",
            "a car",
            "the cars",
            "to car"
          ]
        },
        {
          "corr": "was taken",
          "dist": [
            "took",
            "taken was",
            "was took",
            "is taken"
          ]
        },
        {
          "corr": "to a garage",
          "dist": [
            "at a garage",
            "in garage a",
            "for a garage",
            "by garage a"
          ]
        },
        {
          "corr": "today.",
          "dist": [
            "in today.",
            "at today.",
            "on today.",
            "for today."
          ]
        }
      ]
    },
    {
      "prompt": "Hearing",
      "trans": "مادر با شنیدن صدای گریه، به داخل اتاق دوید.",
      "steps": [
        {
          "corr": "a cry,",
          "dist": [
            "cry a,",
            "the cry,",
            "cries a,",
            "to cry,"
          ]
        },
        {
          "corr": "the mother",
          "dist": [
            "mother the",
            "a mother",
            "the mothers",
            "to mother"
          ]
        },
        {
          "corr": "ran",
          "dist": [
            "run",
            "running",
            "runs",
            "to run"
          ]
        },
        {
          "corr": "into the room",
          "dist": [
            "in room the",
            "at the room",
            "to room the",
            "inside room the"
          ]
        },
        {
          "corr": "quickly.",
          "dist": [
            "quick.",
            "with quick.",
            "in quickly.",
            "quickness."
          ]
        }
      ]
    },
    {
      "prompt": "Having saved",
      "trans": "سارا پس از پس‌انداز کردن پول، یک لپ‌تاپ خرید.",
      "steps": [
        {
          "corr": "some money,",
          "dist": [
            "money some,",
            "the some money,",
            "a money some,",
            "some of money,"
          ]
        },
        {
          "corr": "Sara",
          "dist": [
            "the Sara",
            "a Sara",
            "Sara's",
            "to Sara"
          ]
        },
        {
          "corr": "bought",
          "dist": [
            "buy",
            "buying",
            "buys",
            "to buy"
          ]
        },
        {
          "corr": "a laptop",
          "dist": [
            "laptop a",
            "the laptop",
            "laptops a",
            "to laptop"
          ]
        },
        {
          "corr": "yesterday.",
          "dist": [
            "in yesterday.",
            "at yesterday.",
            "on yesterday.",
            "for yesterday."
          ]
        }
      ]
    },
    {
      "prompt": "Worried about",
      "trans": "او که نگران امتحان بود، تمام شب درس خواند.",
      "steps": [
        {
          "corr": "the test,",
          "dist": [
            "test the,",
            "a test,",
            "the tests,",
            "to test,"
          ]
        },
        {
          "corr": "he",
          "dist": [
            "him",
            "his",
            "himself",
            "to him"
          ]
        },
        {
          "corr": "studied",
          "dist": [
            "study",
            "studying",
            "studies",
            "to study"
          ]
        },
        {
          "corr": "hard",
          "dist": [
            "hardly",
            "harder",
            "hardest",
            "with hard"
          ]
        },
        {
          "corr": "all night.",
          "dist": [
            "night all.",
            "the night all.",
            "in all night.",
            "at night all."
          ]
        }
      ]
    },
    {
      "prompt": "Written by",
      "trans": "این کتاب که توسط یک استاد نوشته شده، محبوب است.",
      "steps": [
        {
          "corr": "an expert,",
          "dist": [
            "expert an,",
            "the expert,",
            "a expert,",
            "experts an,"
          ]
        },
        {
          "corr": "the book",
          "dist": [
            "book the",
            "a book",
            "the books",
            "to book"
          ]
        },
        {
          "corr": "is",
          "dist": [
            "was",
            "are",
            "be",
            "been"
          ]
        },
        {
          "corr": "very popular",
          "dist": [
            "popular very",
            "much popular",
            "so popularity",
            "very popularity"
          ]
        },
        {
          "corr": "now.",
          "dist": [
            "at now.",
            "in now.",
            "on now.",
            "by now."
          ]
        }
      ]
    },
    {
      "prompt": "Having missed",
      "trans": "ما پس از از دست دادن اتوبوس، یک تاکسی گرفتیم.",
      "steps": [
        {
          "corr": "the bus,",
          "dist": [
            "bus the,",
            "a bus,",
            "the buses,",
            "to bus,"
          ]
        },
        {
          "corr": "we",
          "dist": [
            "us",
            "our",
            "ours",
            "ourselves"
          ]
        },
        {
          "corr": "took",
          "dist": [
            "take",
            "taken",
            "taking",
            "takes"
          ]
        },
        {
          "corr": "a cab",
          "dist": [
            "cab a",
            "the cab",
            "cabs a",
            "to cab"
          ]
        },
        {
          "corr": "to work.",
          "dist": [
            "at work.",
            "in work.",
            "for work.",
            "by work."
          ]
        }
      ]
    },
    {
      "prompt": "Sitting by",
      "trans": "او در حالی که کنار پنجره نشسته بود، چای نوشید.",
      "steps": [
        {
          "corr": "the window,",
          "dist": [
            "window the,",
            "a window,",
            "the windows,",
            "to window,"
          ]
        },
        {
          "corr": "she",
          "dist": [
            "her",
            "hers",
            "herself",
            "to her"
          ]
        },
        {
          "corr": "drank",
          "dist": [
            "drink",
            "drunk",
            "drinking",
            "drinks"
          ]
        },
        {
          "corr": "warm tea",
          "dist": [
            "tea warm",
            "a warm tea",
            "the warm tea",
            "warm teas"
          ]
        },
        {
          "corr": "slowly.",
          "dist": [
            "slow.",
            "in slow.",
            "with slow.",
            "slowness."
          ]
        }
      ]
    },
    {
      "prompt": "Tired from",
      "trans": "بچه‌ها که از بازی خسته بودند، روی مبل خوابیدند.",
      "steps": [
        {
          "corr": "playing,",
          "dist": [
            "play,",
            "played,",
            "to play,",
            "plays,"
          ]
        },
        {
          "corr": "the kids",
          "dist": [
            "kids the",
            "a kids",
            "the kid",
            "to kids"
          ]
        },
        {
          "corr": "slept",
          "dist": [
            "sleep",
            "sleeping",
            "sleeps",
            "to sleep"
          ]
        },
        {
          "corr": "on the sofa",
          "dist": [
            "in the sofa",
            "at sofa the",
            "to the sofa",
            "by sofa the"
          ]
        },
        {
          "corr": "for hours.",
          "dist": [
            "in hours.",
            "at hours.",
            "during hours.",
            "by hours."
          ]
        }
      ]
    },
    {
      "prompt": "Invited to",
      "trans": "او که به مهمانی دعوت شده بود، کت و شلوار پوشید.",
      "steps": [
        {
          "corr": "the party,",
          "dist": [
            "party the,",
            "a party,",
            "the parties,",
            "to party,"
          ]
        },
        {
          "corr": "he",
          "dist": [
            "him",
            "his",
            "himself",
            "to him"
          ]
        },
        {
          "corr": "wore",
          "dist": [
            "wear",
            "worn",
            "wearing",
            "wears"
          ]
        },
        {
          "corr": "a dark suit",
          "dist": [
            "dark a suit",
            "suit a dark",
            "the dark suit",
            "a suit dark"
          ]
        },
        {
          "corr": "tonight.",
          "dist": [
            "in tonight.",
            "at tonight.",
            "on tonight.",
            "for tonight."
          ]
        }
      ]
    },
    {
      "prompt": "Having arrived",
      "trans": "آنها پس از رسیدن زودهنگام، قهوه سفارش دادند.",
      "steps": [
        {
          "corr": "early,",
          "dist": [
            "earlier,",
            "earliest,",
            "at early,",
            "with early,"
          ]
        },
        {
          "corr": "they",
          "dist": [
            "them",
            "their",
            "theirs",
            "themselves"
          ]
        },
        {
          "corr": "ordered",
          "dist": [
            "order",
            "ordering",
            "orders",
            "to order"
          ]
        },
        {
          "corr": "coffee",
          "dist": [
            "a coffee",
            "coffees",
            "the coffee",
            "to coffee"
          ]
        },
        {
          "corr": "at the cafe.",
          "dist": [
            "in cafe the.",
            "to the cafe.",
            "on the cafe.",
            "by cafe the."
          ]
        }
      ]
    }
  ],
  "4": [
    {
      "prompt": "Had I",
      "trans": "اگر حقیقت را می‌دانستم، زودتر به تو زنگ می‌زدم.",
      "steps": [
        {
          "corr": "known",
          "dist": [
            "know",
            "knew",
            "knowing",
            "knows"
          ]
        },
        {
          "corr": "the truth,",
          "dist": [
            "truth the,",
            "a truth,",
            "true the,",
            "to truth,"
          ]
        },
        {
          "corr": "I would have",
          "dist": [
            "I will have",
            "I had",
            "I would",
            "have I would"
          ]
        },
        {
          "corr": "called you",
          "dist": [
            "call you",
            "calling you",
            "called to you",
            "you called"
          ]
        },
        {
          "corr": "sooner.",
          "dist": [
            "soon.",
            "soonest.",
            "early.",
            "more soon."
          ]
        }
      ]
    },
    {
      "prompt": "Were you",
      "trans": "اگر از من بپرسی، این ایده فوق‌العاده‌ای است.",
      "steps": [
        {
          "corr": "to ask",
          "dist": [
            "ask",
            "asking",
            "asked",
            "asks"
          ]
        },
        {
          "corr": "me,",
          "dist": [
            "I,",
            "my,",
            "mine,",
            "myself,"
          ]
        },
        {
          "corr": "it would be",
          "dist": [
            "it will be",
            "it is",
            "it would",
            "be it would"
          ]
        },
        {
          "corr": "a great",
          "dist": [
            "an great",
            "great a",
            "the great",
            "to great"
          ]
        },
        {
          "corr": "plan.",
          "dist": [
            "plans.",
            "planned.",
            "planning.",
            "to plan."
          ]
        }
      ]
    },
    {
      "prompt": "Should you",
      "trans": "اگر به کمکی نیاز داشتی، بدون معطلی به من خبر بده.",
      "steps": [
        {
          "corr": "need",
          "dist": [
            "needed",
            "needing",
            "needs",
            "to need"
          ]
        },
        {
          "corr": "any help,",
          "dist": [
            "some help,",
            "help any,",
            "a help,",
            "the help,"
          ]
        },
        {
          "corr": "please let",
          "dist": [
            "please to let",
            "please letting",
            "let please",
            "please lets"
          ]
        },
        {
          "corr": "me know",
          "dist": [
            "I know",
            "my know",
            "me to know",
            "me knowing"
          ]
        },
        {
          "corr": "anytime.",
          "dist": [
            "in anytime.",
            "at anytime.",
            "on anytime.",
            "for anytime."
          ]
        }
      ]
    },
    {
      "prompt": "Had we",
      "trans": "اگر زودتر راه افتاده بودیم، به قطار می‌رسیدیم.",
      "steps": [
        {
          "corr": "left",
          "dist": [
            "leave",
            "leaving",
            "leaves",
            "to leave"
          ]
        },
        {
          "corr": "earlier,",
          "dist": [
            "early,",
            "earliest,",
            "more early,",
            "at early,"
          ]
        },
        {
          "corr": "we would have",
          "dist": [
            "we will have",
            "we had",
            "we would",
            "have we"
          ]
        },
        {
          "corr": "caught",
          "dist": [
            "catch",
            "catching",
            "catches",
            "to catch"
          ]
        },
        {
          "corr": "the train.",
          "dist": [
            "train the.",
            "a train.",
            "to train.",
            "for train."
          ]
        }
      ]
    },
    {
      "prompt": "Were I",
      "trans": "اگر من جای تو بودم، این پیشنهاد کاری را می‌پذیرفتم.",
      "steps": [
        {
          "corr": "in your place,",
          "dist": [
            "in you place,",
            "at your place,",
            "on your place,",
            "for your place,"
          ]
        },
        {
          "corr": "I would",
          "dist": [
            "I will",
            "I had",
            "I did",
            "would I"
          ]
        },
        {
          "corr": "accept",
          "dist": [
            "accepted",
            "accepting",
            "accepts",
            "to accept"
          ]
        },
        {
          "corr": "the job",
          "dist": [
            "job the",
            "a job",
            "the jobs",
            "to job"
          ]
        },
        {
          "corr": "offer.",
          "dist": [
            "offered.",
            "offering.",
            "to offer.",
            "offers."
          ]
        }
      ]
    },
    {
      "prompt": "Should anyone",
      "trans": "اگر کسی تماس گرفت، بگو من نیم ساعت دیگر برمی‌گردم.",
      "steps": [
        {
          "corr": "call,",
          "dist": [
            "calls,",
            "called,",
            "calling,",
            "to call,"
          ]
        },
        {
          "corr": "tell them",
          "dist": [
            "tell they",
            "tell their",
            "to tell them",
            "say them"
          ]
        },
        {
          "corr": "I will be",
          "dist": [
            "I would be",
            "I am",
            "I was",
            "be I will"
          ]
        },
        {
          "corr": "back soon",
          "dist": [
            "soon back",
            "backly soon",
            "soon backly",
            "to back soon"
          ]
        },
        {
          "corr": "today.",
          "dist": [
            "in today.",
            "at today.",
            "on today.",
            "for today."
          ]
        }
      ]
    },
    {
      "prompt": "Had she",
      "trans": "اگر او بیشتر تمرین کرده بود، مسابقه را برنده می‌شد.",
      "steps": [
        {
          "corr": "practiced",
          "dist": [
            "practice",
            "practicing",
            "practices",
            "to practice"
          ]
        },
        {
          "corr": "more,",
          "dist": [
            "much,",
            "many,",
            "most,",
            "more of,"
          ]
        },
        {
          "corr": "she would have",
          "dist": [
            "she will have",
            "she had",
            "she would",
            "have she"
          ]
        },
        {
          "corr": "won",
          "dist": [
            "win",
            "winning",
            "wins",
            "to win"
          ]
        },
        {
          "corr": "the game.",
          "dist": [
            "game the.",
            "a game.",
            "to game.",
            "for game."
          ]
        }
      ]
    },
    {
      "prompt": "Were they",
      "trans": "اگر آنها برای حل مشکل تلاش کنند، همه چیز درست می‌شود.",
      "steps": [
        {
          "corr": "to try",
          "dist": [
            "try",
            "trying",
            "tried",
            "tries"
          ]
        },
        {
          "corr": "harder,",
          "dist": [
            "hard,",
            "hardly,",
            "more hard,",
            "hardest,"
          ]
        },
        {
          "corr": "things would",
          "dist": [
            "things will",
            "things had",
            "things do",
            "would things"
          ]
        },
        {
          "corr": "get better",
          "dist": [
            "got better",
            "getting better",
            "get good",
            "get best"
          ]
        },
        {
          "corr": "soon.",
          "dist": [
            "sooner.",
            "soonest.",
            "in soon.",
            "at soon."
          ]
        }
      ]
    },
    {
      "prompt": "Should the weather",
      "trans": "اگر هوا بدتر شود، ما در خانه می‌مانیم.",
      "steps": [
        {
          "corr": "get worse,",
          "dist": [
            "gets worse,",
            "got worse,",
            "getting worse,",
            "to get worse,"
          ]
        },
        {
          "corr": "we will",
          "dist": [
            "we would",
            "we had",
            "will we",
            "we do"
          ]
        },
        {
          "corr": "stay",
          "dist": [
            "stayed",
            "staying",
            "stays",
            "to stay"
          ]
        },
        {
          "corr": "at home",
          "dist": [
            "in home",
            "to home",
            "on home",
            "for home"
          ]
        },
        {
          "corr": "all day.",
          "dist": [
            "day all.",
            "in all day.",
            "all of day.",
            "at day all."
          ]
        }
      ]
    },
    {
      "prompt": "Had you",
      "trans": "اگر از من پرسیده بودی، راه درست را به تو می‌گفتم.",
      "steps": [
        {
          "corr": "asked",
          "dist": [
            "ask",
            "asking",
            "asks",
            "to ask"
          ]
        },
        {
          "corr": "me,",
          "dist": [
            "I,",
            "my,",
            "mine,",
            "myself,"
          ]
        },
        {
          "corr": "I would have",
          "dist": [
            "I will have",
            "I had",
            "I would",
            "have I"
          ]
        },
        {
          "corr": "told you",
          "dist": [
            "tell you",
            "telling you",
            "told to you",
            "you told"
          ]
        },
        {
          "corr": "the way.",
          "dist": [
            "way the.",
            "a way.",
            "to way.",
            "for way."
          ]
        }
      ]
    },
    {
      "prompt": "Were he",
      "trans": "اگر او ماشین بهتری می‌خرید، سفر راحت‌تر می‌شد.",
      "steps": [
        {
          "corr": "to buy",
          "dist": [
            "buy",
            "buying",
            "bought",
            "buys"
          ]
        },
        {
          "corr": "a car,",
          "dist": [
            "car a,",
            "the car,",
            "cars a,",
            "to car,"
          ]
        },
        {
          "corr": "travel would",
          "dist": [
            "travel will",
            "travel had",
            "would travel",
            "travel did"
          ]
        },
        {
          "corr": "be",
          "dist": [
            "is",
            "was",
            "been",
            "being"
          ]
        },
        {
          "corr": "easier.",
          "dist": [
            "easy.",
            "easiest.",
            "more easy.",
            "easily."
          ]
        }
      ]
    },
    {
      "prompt": "Should there",
      "trans": "اگر مشکلی پیش آمد، لطفاً به مدیر اطلاع دهید.",
      "steps": [
        {
          "corr": "be",
          "dist": [
            "is",
            "was",
            "are",
            "been"
          ]
        },
        {
          "corr": "a problem,",
          "dist": [
            "problem a,",
            "the problem,",
            "problems a,",
            "to problem,"
          ]
        },
        {
          "corr": "inform",
          "dist": [
            "informed",
            "informing",
            "informs",
            "to inform"
          ]
        },
        {
          "corr": "the manager",
          "dist": [
            "manager the",
            "a manager",
            "managers the",
            "to manager"
          ]
        },
        {
          "corr": "at once.",
          "dist": [
            "in once.",
            "on once.",
            "for once.",
            "by once."
          ]
        }
      ]
    },
    {
      "prompt": "Had they",
      "trans": "اگر آنها نقشه را بررسی کرده بودند، گم نمی‌شدند.",
      "steps": [
        {
          "corr": "checked",
          "dist": [
            "check",
            "checking",
            "checks",
            "to check"
          ]
        },
        {
          "corr": "the map,",
          "dist": [
            "map the,",
            "a map,",
            "maps the,",
            "to map,"
          ]
        },
        {
          "corr": "they would not",
          "dist": [
            "they will not",
            "they had not",
            "not they would",
            "they not would"
          ]
        },
        {
          "corr": "have gotten",
          "dist": [
            "get",
            "got",
            "getting",
            "gotten have"
          ]
        },
        {
          "corr": "lost.",
          "dist": [
            "lose.",
            "losing.",
            "loss.",
            "to lose."
          ]
        }
      ]
    },
    {
      "prompt": "Were we",
      "trans": "اگر ما الان در تعطیلات بودیم، کنار دریا استراحت می‌کردیم.",
      "steps": [
        {
          "corr": "on holiday,",
          "dist": [
            "in holiday,",
            "at holiday,",
            "for holiday,",
            "with holiday,"
          ]
        },
        {
          "corr": "we would",
          "dist": [
            "we will",
            "we had",
            "would we",
            "we did"
          ]
        },
        {
          "corr": "relax",
          "dist": [
            "relaxed",
            "relaxing",
            "relaxes",
            "to relax"
          ]
        },
        {
          "corr": "by the sea",
          "dist": [
            "at the sea",
            "in sea the",
            "on the sea",
            "to sea the"
          ]
        },
        {
          "corr": "all day.",
          "dist": [
            "day all.",
            "in all day.",
            "all of day.",
            "at day all."
          ]
        }
      ]
    },
    {
      "prompt": "Should it",
      "trans": "اگر فردا باران ببارد، بازی لغو خواهد شد.",
      "steps": [
        {
          "corr": "rain",
          "dist": [
            "rains",
            "rained",
            "raining",
            "to rain"
          ]
        },
        {
          "corr": "tomorrow,",
          "dist": [
            "in tomorrow,",
            "at tomorrow,",
            "on tomorrow,",
            "for tomorrow,"
          ]
        },
        {
          "corr": "the game",
          "dist": [
            "game the",
            "a game",
            "the games",
            "to game"
          ]
        },
        {
          "corr": "will be",
          "dist": [
            "would be",
            "is",
            "was",
            "be will"
          ]
        },
        {
          "corr": "cancelled.",
          "dist": [
            "cancel.",
            "cancelling.",
            "cancels.",
            "to cancel."
          ]
        }
      ]
    },
    {
      "prompt": "Had he",
      "trans": "اگر او با دقت گوش داده بود، این اشتباه را نمی‌کرد.",
      "steps": [
        {
          "corr": "listened",
          "dist": [
            "listen",
            "listening",
            "listens",
            "to listen"
          ]
        },
        {
          "corr": "carefully,",
          "dist": [
            "careful,",
            "with careful,",
            "in careful,",
            "carefulness,"
          ]
        },
        {
          "corr": "he would not",
          "dist": [
            "he will not",
            "he had not",
            "not he would",
            "he not would"
          ]
        },
        {
          "corr": "have made",
          "dist": [
            "make",
            "made",
            "making",
            "makes"
          ]
        },
        {
          "corr": "a mistake.",
          "dist": [
            "mistake a.",
            "the mistake.",
            "mistakes a.",
            "to mistake."
          ]
        }
      ]
    },
    {
      "prompt": "Were you",
      "trans": "اگر بخواهی حقیقت را بدانی، او کاملاً بی‌تقصیر بود.",
      "steps": [
        {
          "corr": "to know",
          "dist": [
            "know",
            "knowing",
            "knew",
            "knows"
          ]
        },
        {
          "corr": "the truth,",
          "dist": [
            "truth the,",
            "a truth,",
            "true the,",
            "to truth,"
          ]
        },
        {
          "corr": "he was",
          "dist": [
            "he were",
            "he is",
            "was he",
            "he had"
          ]
        },
        {
          "corr": "not to",
          "dist": [
            "to not",
            "no to",
            "not for",
            "not in"
          ]
        },
        {
          "corr": "blame.",
          "dist": [
            "blamed.",
            "blaming.",
            "blames.",
            "to blame."
          ]
        }
      ]
    },
    {
      "prompt": "Should you",
      "trans": "اگر سوالی داشتی، هر زمان که خواستی پیام بده.",
      "steps": [
        {
          "corr": "have",
          "dist": [
            "had",
            "having",
            "has",
            "to have"
          ]
        },
        {
          "corr": "questions,",
          "dist": [
            "question,",
            "a questions,",
            "the questions,",
            "to questions,"
          ]
        },
        {
          "corr": "just send",
          "dist": [
            "just to send",
            "just sending",
            "send just",
            "just sent"
          ]
        },
        {
          "corr": "a message",
          "dist": [
            "message a",
            "the message",
            "messages a",
            "to message"
          ]
        },
        {
          "corr": "to me.",
          "dist": [
            "at me.",
            "for I.",
            "with me.",
            "by me."
          ]
        }
      ]
    },
    {
      "prompt": "Had we",
      "trans": "اگر ما چتر برداشته بودیم، خیس نمی‌شدیم.",
      "steps": [
        {
          "corr": "taken",
          "dist": [
            "take",
            "taking",
            "took",
            "takes"
          ]
        },
        {
          "corr": "an umbrella,",
          "dist": [
            "a umbrella,",
            "umbrella an,",
            "the umbrella,",
            "to umbrella,"
          ]
        },
        {
          "corr": "we would not",
          "dist": [
            "we will not",
            "we had not",
            "not we would",
            "we not would"
          ]
        },
        {
          "corr": "have gotten",
          "dist": [
            "get",
            "got",
            "getting",
            "gotten have"
          ]
        },
        {
          "corr": "wet.",
          "dist": [
            "wetted.",
            "wetting.",
            "wetly.",
            "wetter."
          ]
        }
      ]
    },
    {
      "prompt": "Were she",
      "trans": "اگر او اینجا بود، دقیقاً می‌دانست چه کاری باید انجام دهد.",
      "steps": [
        {
          "corr": "here,",
          "dist": [
            "in here,",
            "at here,",
            "to here,",
            "on here,"
          ]
        },
        {
          "corr": "she would",
          "dist": [
            "she will",
            "she had",
            "would she",
            "she did"
          ]
        },
        {
          "corr": "know",
          "dist": [
            "knew",
            "known",
            "knowing",
            "knows"
          ]
        },
        {
          "corr": "what to do",
          "dist": [
            "what do to",
            "that to do",
            "how to do",
            "what doing"
          ]
        },
        {
          "corr": "now.",
          "dist": [
            "at now.",
            "in now.",
            "on now.",
            "by now."
          ]
        }
      ]
    }
  ],
  "5": [
    {
      "prompt": "To tell you",
      "trans": "راستش را بخواهی، من اصلاً غذای آن رستوران را دوست نداشتم.",
      "steps": [
        {
          "corr": "the truth,",
          "dist": [
            "truth the,",
            "a truth,",
            "true the,",
            "to truth,"
          ]
        },
        {
          "corr": "I did not",
          "dist": [
            "I do not",
            "I was not",
            "did not I",
            "I had not"
          ]
        },
        {
          "corr": "like",
          "dist": [
            "liked",
            "liking",
            "likes",
            "to like"
          ]
        },
        {
          "corr": "the meal",
          "dist": [
            "meal the",
            "a meal",
            "meals the",
            "to meal"
          ]
        },
        {
          "corr": "at all.",
          "dist": [
            "in all.",
            "of all.",
            "by all.",
            "for all."
          ]
        }
      ]
    },
    {
      "prompt": "As a matter",
      "trans": "در واقع، ما دیروز در جلسه به توافق کامل رسیدیم.",
      "steps": [
        {
          "corr": "of fact,",
          "dist": [
            "in fact,",
            "for fact,",
            "to fact,",
            "by fact,"
          ]
        },
        {
          "corr": "we agreed",
          "dist": [
            "we agree",
            "we agreeing",
            "agreed we",
            "we were agree"
          ]
        },
        {
          "corr": "on everything",
          "dist": [
            "in everything",
            "at everything",
            "to everything",
            "for everything"
          ]
        },
        {
          "corr": "at the meeting",
          "dist": [
            "in meeting the",
            "to the meeting",
            "on meeting the",
            "by the meeting"
          ]
        },
        {
          "corr": "yesterday.",
          "dist": [
            "in yesterday.",
            "at yesterday.",
            "on yesterday.",
            "for yesterday."
          ]
        }
      ]
    },
    {
      "prompt": "In all",
      "trans": "صادقانه بگویم، فکر نمی‌کنم او بتواند تا جمعه پروژه را تمام کند.",
      "steps": [
        {
          "corr": "honesty,",
          "dist": [
            "honest,",
            "honestly,",
            "the honesty,",
            "in honest,"
          ]
        },
        {
          "corr": "I doubt",
          "dist": [
            "I doubt not",
            "doubt I",
            "I am doubt",
            "I doubting"
          ]
        },
        {
          "corr": "he can",
          "dist": [
            "he could",
            "can he",
            "he may",
            "he will can"
          ]
        },
        {
          "corr": "finish",
          "dist": [
            "finished",
            "finishing",
            "finishes",
            "to finish"
          ]
        },
        {
          "corr": "on time.",
          "dist": [
            "in time.",
            "at time.",
            "for time.",
            "by time."
          ]
        }
      ]
    },
    {
      "prompt": "Strictly",
      "trans": "دقیقاً که صحبت کنیم، ورود به این پارک بعد از غروب مجاز نیست.",
      "steps": [
        {
          "corr": "speaking,",
          "dist": [
            "spoken,",
            "speaks,",
            "speak,",
            "to speak,"
          ]
        },
        {
          "corr": "entry",
          "dist": [
            "an entry",
            "the entry",
            "entries",
            "to entry"
          ]
        },
        {
          "corr": "is not",
          "dist": [
            "are not",
            "was not",
            "does not",
            "be not"
          ]
        },
        {
          "corr": "allowed",
          "dist": [
            "allow",
            "allowing",
            "allows",
            "to allow"
          ]
        },
        {
          "corr": "after dark.",
          "dist": [
            "before dark.",
            "in dark.",
            "at dark.",
            "by dark."
          ]
        }
      ]
    },
    {
      "prompt": "To be",
      "trans": "اگر منصف باشیم، او در طول سال گذشته تلاش بسیار زیادی کرد.",
      "steps": [
        {
          "corr": "fair,",
          "dist": [
            "fairly,",
            "the fair,",
            "in fair,",
            "fairness,"
          ]
        },
        {
          "corr": "she tried",
          "dist": [
            "she try",
            "she trying",
            "tried she",
            "she tries"
          ]
        },
        {
          "corr": "very hard",
          "dist": [
            "hard very",
            "very hardly",
            "much hard",
            "so hardly"
          ]
        },
        {
          "corr": "all year",
          "dist": [
            "year all",
            "in all year",
            "the all year",
            "at year all"
          ]
        },
        {
          "corr": "long.",
          "dist": [
            "longer.",
            "longest.",
            "length.",
            "in long."
          ]
        }
      ]
    },
    {
      "prompt": "All things",
      "trans": "با در نظر گرفتن همه موارد، سفر ما تجربه موفقی بود.",
      "steps": [
        {
          "corr": "considered,",
          "dist": [
            "considering,",
            "consider,",
            "considers,",
            "to consider,"
          ]
        },
        {
          "corr": "the trip",
          "dist": [
            "trip the",
            "a trip",
            "the trips",
            "to trip"
          ]
        },
        {
          "corr": "was a great",
          "dist": [
            "was great a",
            "were a great",
            "is a great",
            "great was a"
          ]
        },
        {
          "corr": "success",
          "dist": [
            "succeed",
            "successful",
            "successfully",
            "successes"
          ]
        },
        {
          "corr": "for us.",
          "dist": [
            "to us.",
            "at us.",
            "with us.",
            "by us."
          ]
        }
      ]
    },
    {
      "prompt": "In other",
      "trans": "به عبارت دیگر، ما باید قبل از شروع دوباره برنامه‌ریزی کنیم.",
      "steps": [
        {
          "corr": "words,",
          "dist": [
            "word,",
            "the words,",
            "in word,",
            "to words,"
          ]
        },
        {
          "corr": "we must",
          "dist": [
            "we should",
            "we can",
            "must we",
            "we have"
          ]
        },
        {
          "corr": "plan again",
          "dist": [
            "planning again",
            "planned again",
            "again plan",
            "plans again"
          ]
        },
        {
          "corr": "before",
          "dist": [
            "ahead",
            "prior",
            "in front of",
            "before of"
          ]
        },
        {
          "corr": "we start.",
          "dist": [
            "we started.",
            "start we.",
            "we starting.",
            "to start."
          ]
        }
      ]
    },
    {
      "prompt": "By the",
      "trans": "راستی، آیا تو کلید یدک ماشین را دیده‌ای؟",
      "steps": [
        {
          "corr": "way,",
          "dist": [
            "ways,",
            "the way,",
            "a way,",
            "to way,"
          ]
        },
        {
          "corr": "have you",
          "dist": [
            "did you",
            "are you",
            "do you",
            "you have"
          ]
        },
        {
          "corr": "seen",
          "dist": [
            "saw",
            "see",
            "seeing",
            "sees"
          ]
        },
        {
          "corr": "my spare",
          "dist": [
            "spare my",
            "the my spare",
            "a spare my",
            "to spare"
          ]
        },
        {
          "corr": "car key?",
          "dist": [
            "key car?",
            "car keys?",
            "the car key?",
            "of car key?"
          ]
        }
      ]
    },
    {
      "prompt": "Frankly",
      "trans": "رک و پوست‌کنده بگویم، بازی دیشب اصلاً هیجان‌انگیز نبود.",
      "steps": [
        {
          "corr": "speaking,",
          "dist": [
            "spoken,",
            "speaks,",
            "speak,",
            "to speak,"
          ]
        },
        {
          "corr": "the match",
          "dist": [
            "match the",
            "a match",
            "the matches",
            "to match"
          ]
        },
        {
          "corr": "was not",
          "dist": [
            "were not",
            "is not",
            "did not",
            "be not"
          ]
        },
        {
          "corr": "exciting",
          "dist": [
            "excited",
            "excitement",
            "excite",
            "to excite"
          ]
        },
        {
          "corr": "at all.",
          "dist": [
            "in all.",
            "of all.",
            "by all.",
            "for all."
          ]
        }
      ]
    },
    {
      "prompt": "On the other",
      "trans": "از سوی دیگر، کار در خانه باعث صرفه‌جویی در وقت می‌شود.",
      "steps": [
        {
          "corr": "hand,",
          "dist": [
            "side,",
            "part,",
            "way,",
            "end,"
          ]
        },
        {
          "corr": "working from",
          "dist": [
            "work from",
            "worked from",
            "to work from",
            "works from"
          ]
        },
        {
          "corr": "home saves",
          "dist": [
            "home save",
            "home saving",
            "saves home",
            "home saved"
          ]
        },
        {
          "corr": "a lot of",
          "dist": [
            "lot of a",
            "lots of a",
            "many of",
            "much of"
          ]
        },
        {
          "corr": "time.",
          "dist": [
            "times.",
            "timing.",
            "the time.",
            "a time."
          ]
        }
      ]
    },
    {
      "prompt": "As far as",
      "trans": "تا آنجا که من می‌دانم، دفتر فردا باز خواهد بود.",
      "steps": [
        {
          "corr": "I know,",
          "dist": [
            "I knew,",
            "know I,",
            "I knowing,",
            "to know,"
          ]
        },
        {
          "corr": "the office",
          "dist": [
            "office the",
            "an office",
            "the offices",
            "to office"
          ]
        },
        {
          "corr": "will be",
          "dist": [
            "would be",
            "is",
            "was",
            "be will"
          ]
        },
        {
          "corr": "open",
          "dist": [
            "opened",
            "opening",
            "opens",
            "to open"
          ]
        },
        {
          "corr": "tomorrow.",
          "dist": [
            "in tomorrow.",
            "at tomorrow.",
            "on tomorrow.",
            "for tomorrow."
          ]
        }
      ]
    },
    {
      "prompt": "Needless to",
      "trans": "ناگفته پیداست که ایمنی همیشه اولویت اول ماست.",
      "steps": [
        {
          "corr": "say,",
          "dist": [
            "said,",
            "saying,",
            "says,",
            "to say,"
          ]
        },
        {
          "corr": "safety is",
          "dist": [
            "safe is",
            "safety are",
            "is safety",
            "safely is"
          ]
        },
        {
          "corr": "our top",
          "dist": [
            "top our",
            "the our top",
            "a top our",
            "to top"
          ]
        },
        {
          "corr": "priority",
          "dist": [
            "prior",
            "prioritize",
            "priorities",
            "in priority"
          ]
        },
        {
          "corr": "always.",
          "dist": [
            "ever.",
            "all time.",
            "all times.",
            "forever."
          ]
        }
      ]
    },
    {
      "prompt": "To put it",
      "trans": "ساده بگویم، ما به زمان بیشتری برای تصمیم‌گیری نیاز داریم.",
      "steps": [
        {
          "corr": "simply,",
          "dist": [
            "simple,",
            "simplest,",
            "simpler,",
            "in simple,"
          ]
        },
        {
          "corr": "we need",
          "dist": [
            "we needed",
            "need we",
            "we needing",
            "we needs"
          ]
        },
        {
          "corr": "more time",
          "dist": [
            "time more",
            "many time",
            "most time",
            "much times"
          ]
        },
        {
          "corr": "to decide",
          "dist": [
            "for decide",
            "deciding",
            "to deciding",
            "decide"
          ]
        },
        {
          "corr": "fairly.",
          "dist": [
            "fair.",
            "in fair.",
            "fairness.",
            "with fair."
          ]
        }
      ]
    },
    {
      "prompt": "Generally",
      "trans": "به طور کلی، مردم این منطقه بسیار خونگرم و مهربان هستند.",
      "steps": [
        {
          "corr": "speaking,",
          "dist": [
            "spoken,",
            "speaks,",
            "speak,",
            "to speak,"
          ]
        },
        {
          "corr": "people here",
          "dist": [
            "here people",
            "people in here",
            "peoples here",
            "to people here"
          ]
        },
        {
          "corr": "are",
          "dist": [
            "is",
            "were",
            "be",
            "been"
          ]
        },
        {
          "corr": "very friendly",
          "dist": [
            "friendly very",
            "much friendly",
            "so friendliness",
            "friendliness"
          ]
        },
        {
          "corr": "to guests.",
          "dist": [
            "at guests.",
            "with guests.",
            "for guests.",
            "by guests."
          ]
        }
      ]
    },
    {
      "prompt": "At any",
      "trans": "در هر صورت، ما باید تا ساعت پنج آنجا باشیم.",
      "steps": [
        {
          "corr": "rate,",
          "dist": [
            "rates,",
            "cost,",
            "price,",
            "time,"
          ]
        },
        {
          "corr": "we should",
          "dist": [
            "we must",
            "we can",
            "should we",
            "we ought"
          ]
        },
        {
          "corr": "be there",
          "dist": [
            "there be",
            "being there",
            "been there",
            "to be there"
          ]
        },
        {
          "corr": "by five",
          "dist": [
            "at five",
            "in five",
            "on five",
            "to five"
          ]
        },
        {
          "corr": "o'clock.",
          "dist": [
            "clock.",
            "o clock.",
            "of clock.",
            "in clock."
          ]
        }
      ]
    },
    {
      "prompt": "To sum",
      "trans": "به طور خلاصه، نتایج آزمایش کاملاً رضایت‌بخش بود.",
      "steps": [
        {
          "corr": "up,",
          "dist": [
            "in,",
            "on,",
            "out,",
            "down,"
          ]
        },
        {
          "corr": "the results",
          "dist": [
            "results the",
            "a results",
            "result the",
            "to results"
          ]
        },
        {
          "corr": "were very",
          "dist": [
            "was very",
            "were much",
            "are very",
            "very were"
          ]
        },
        {
          "corr": "clear and",
          "dist": [
            "clearly and",
            "clear but",
            "clearness and",
            "clear so"
          ]
        },
        {
          "corr": "positive.",
          "dist": [
            "positively.",
            "positiveness.",
            "in positive.",
            "with positive."
          ]
        }
      ]
    },
    {
      "prompt": "Believe it",
      "trans": "باور کنی یا نه، او تمام مسیر را پیاده آمد.",
      "steps": [
        {
          "corr": "or not,",
          "dist": [
            "and not,",
            "if not,",
            "nor not,",
            "but not,"
          ]
        },
        {
          "corr": "he walked",
          "dist": [
            "he walk",
            "he walking",
            "walked he",
            "he was walk"
          ]
        },
        {
          "corr": "all the way",
          "dist": [
            "the all way",
            "way all the",
            "all way the",
            "the way all"
          ]
        },
        {
          "corr": "home",
          "dist": [
            "to home",
            "at home",
            "in home",
            "for home"
          ]
        },
        {
          "corr": "alone.",
          "dist": [
            "lonely.",
            "loneliness.",
            "aloned.",
            "in alone."
          ]
        }
      ]
    },
    {
      "prompt": "In fact,",
      "trans": "در واقع، قیمت‌ها از ماه گذشته هیچ تغییری نکرده است.",
      "steps": [
        {
          "corr": "prices have",
          "dist": [
            "prices has",
            "price have",
            "prices did",
            "have prices"
          ]
        },
        {
          "corr": "not changed",
          "dist": [
            "no changed",
            "not change",
            "not changing",
            "changed not"
          ]
        },
        {
          "corr": "at all",
          "dist": [
            "in all",
            "of all",
            "by all",
            "for all"
          ]
        },
        {
          "corr": "since last",
          "dist": [
            "from last",
            "for last",
            "by last",
            "in last"
          ]
        },
        {
          "corr": "month.",
          "dist": [
            "months.",
            "the month.",
            "a month.",
            "monthly."
          ]
        }
      ]
    },
    {
      "prompt": "After all,",
      "trans": "هر چه باشد، او تمام تلاش خود را برای کمک به ما انجام داد.",
      "steps": [
        {
          "corr": "he did",
          "dist": [
            "he does",
            "he was",
            "did he",
            "he had"
          ]
        },
        {
          "corr": "his best",
          "dist": [
            "the best his",
            "best his",
            "a best his",
            "to best"
          ]
        },
        {
          "corr": "to help",
          "dist": [
            "for help",
            "helping",
            "to helping",
            "help"
          ]
        },
        {
          "corr": "us with",
          "dist": [
            "we with",
            "our with",
            "us at",
            "us in"
          ]
        },
        {
          "corr": "the move.",
          "dist": [
            "move the.",
            "a move.",
            "moves the.",
            "to move."
          ]
        }
      ]
    },
    {
      "prompt": "Surprisingly",
      "trans": "با کمال تعجب، آزمون بسیار آسان‌تر از حد انتظار ما بود.",
      "steps": [
        {
          "corr": "enough,",
          "dist": [
            "too,",
            "very,",
            "much,",
            "so,"
          ]
        },
        {
          "corr": "the test",
          "dist": [
            "test the",
            "a test",
            "the tests",
            "to test"
          ]
        },
        {
          "corr": "was much",
          "dist": [
            "were much",
            "was very",
            "was more",
            "much was"
          ]
        },
        {
          "corr": "easier",
          "dist": [
            "easy",
            "easiest",
            "more easy",
            "easily"
          ]
        },
        {
          "corr": "than usual.",
          "dist": [
            "then usual.",
            "as usual.",
            "that usual.",
            "to usual."
          ]
        }
      ]
    }
  ],
  "6": [
    {
      "prompt": "What I",
      "trans": "آنچه واقعاً به آن نیاز دارم، یک فنجان چای داغ است.",
      "steps": [
        {
          "corr": "really need",
          "dist": [
            "need really",
            "really needing",
            "really needed",
            "real need"
          ]
        },
        {
          "corr": "is",
          "dist": [
            "are",
            "was",
            "be",
            "were"
          ]
        },
        {
          "corr": "a cup",
          "dist": [
            "cup a",
            "the cup",
            "cups a",
            "to cup"
          ]
        },
        {
          "corr": "of hot",
          "dist": [
            "in hot",
            "for hot",
            "with hot",
            "at hot"
          ]
        },
        {
          "corr": "tea.",
          "dist": [
            "teas.",
            "a tea.",
            "the tea.",
            "to tea."
          ]
        }
      ]
    },
    {
      "prompt": "It was",
      "trans": "سارا بود که دیروز به ما در تمیز کردن خانه کمک کرد.",
      "steps": [
        {
          "corr": "Sara who",
          "dist": [
            "Sara which",
            "Sara whom",
            "Sara whose",
            "Sara that who"
          ]
        },
        {
          "corr": "helped us",
          "dist": [
            "helped we",
            "help us",
            "helping us",
            "helps us"
          ]
        },
        {
          "corr": "clean",
          "dist": [
            "cleaned",
            "cleaning",
            "to cleaning",
            "cleans"
          ]
        },
        {
          "corr": "the house",
          "dist": [
            "house the",
            "a house",
            "houses the",
            "to house"
          ]
        },
        {
          "corr": "yesterday.",
          "dist": [
            "in yesterday.",
            "at yesterday.",
            "on yesterday.",
            "for yesterday."
          ]
        }
      ]
    },
    {
      "prompt": "What surprised",
      "trans": "آنچه همه را غافلگیر کرد، ورود زودهنگام او بود.",
      "steps": [
        {
          "corr": "everyone was",
          "dist": [
            "everyone were",
            "was everyone",
            "everyone is",
            "everyone be"
          ]
        },
        {
          "corr": "his early",
          "dist": [
            "early his",
            "the early his",
            "a early his",
            "he early"
          ]
        },
        {
          "corr": "arrival",
          "dist": [
            "arrive",
            "arrived",
            "arriving",
            "to arrive"
          ]
        },
        {
          "corr": "at the party",
          "dist": [
            "in party the",
            "to the party",
            "on party the",
            "for party the"
          ]
        },
        {
          "corr": "last night.",
          "dist": [
            "in last night.",
            "at last night.",
            "on last night.",
            "for last night."
          ]
        }
      ]
    },
    {
      "prompt": "All we",
      "trans": "تمام چیزی که می‌خواهیم، یک تعطیلات آرام کنار دریاست.",
      "steps": [
        {
          "corr": "want is",
          "dist": [
            "want are",
            "wanted is",
            "wants is",
            "is want"
          ]
        },
        {
          "corr": "a peaceful",
          "dist": [
            "peaceful a",
            "the peaceful",
            "an peaceful",
            "peace a"
          ]
        },
        {
          "corr": "break",
          "dist": [
            "broken",
            "breaking",
            "breaks",
            "to break"
          ]
        },
        {
          "corr": "by the sea",
          "dist": [
            "at the sea",
            "in sea the",
            "on the sea",
            "to sea the"
          ]
        },
        {
          "corr": "this summer.",
          "dist": [
            "in this summer.",
            "at summer this.",
            "on summer this.",
            "for summer."
          ]
        }
      ]
    },
    {
      "prompt": "It is",
      "trans": "صبر و حوصله است که برای یادگیری زبان بیش از همه لازم است.",
      "steps": [
        {
          "corr": "patience that",
          "dist": [
            "patience who",
            "patience which",
            "patient that",
            "patiently that"
          ]
        },
        {
          "corr": "you need",
          "dist": [
            "need you",
            "you needed",
            "you needing",
            "needs you"
          ]
        },
        {
          "corr": "most",
          "dist": [
            "mostly",
            "more",
            "the mostly",
            "almost"
          ]
        },
        {
          "corr": "when learning",
          "dist": [
            "while learn",
            "during learning",
            "at learning",
            "for learn"
          ]
        },
        {
          "corr": "a language.",
          "dist": [
            "language a.",
            "the language.",
            "languages a.",
            "to language."
          ]
        }
      ]
    },
    {
      "prompt": "What annoys",
      "trans": "آنچه مرا آزار می‌دهد، سر و صدای مداوم ترافیک است.",
      "steps": [
        {
          "corr": "me is",
          "dist": [
            "me are",
            "I is",
            "my is",
            "is me"
          ]
        },
        {
          "corr": "the constant",
          "dist": [
            "constant the",
            "a constant",
            "constantly the",
            "to constant"
          ]
        },
        {
          "corr": "noise",
          "dist": [
            "noises",
            "noisy",
            "noisily",
            "to noise"
          ]
        },
        {
          "corr": "from the cars",
          "dist": [
            "of the cars",
            "with cars the",
            "at cars the",
            "for cars the"
          ]
        },
        {
          "corr": "outside.",
          "dist": [
            "in outside.",
            "at outside.",
            "to outside.",
            "by outside."
          ]
        }
      ]
    },
    {
      "prompt": "The person",
      "trans": "کسی که کلیدها را پیدا کرد، برادر کوچکم بود.",
      "steps": [
        {
          "corr": "who found",
          "dist": [
            "which found",
            "whom found",
            "whose found",
            "found who"
          ]
        },
        {
          "corr": "the keys was",
          "dist": [
            "the keys were",
            "keys the was",
            "a keys was",
            "was the keys"
          ]
        },
        {
          "corr": "my younger",
          "dist": [
            "younger my",
            "the my younger",
            "a younger my",
            "to younger"
          ]
        },
        {
          "corr": "brother",
          "dist": [
            "brothers",
            "brotherly",
            "a brother",
            "the brother"
          ]
        },
        {
          "corr": "this morning.",
          "dist": [
            "in this morning.",
            "at morning this.",
            "on morning this.",
            "for morning."
          ]
        }
      ]
    },
    {
      "prompt": "The thing",
      "trans": "چیزی که از همه بیشتر دوست داشتم، موسیقی متن فیلم بود.",
      "steps": [
        {
          "corr": "that I liked",
          "dist": [
            "which I liked",
            "who I liked",
            "what I liked",
            "I liked that"
          ]
        },
        {
          "corr": "most was",
          "dist": [
            "most were",
            "mostly was",
            "was most",
            "more was"
          ]
        },
        {
          "corr": "the music",
          "dist": [
            "music the",
            "a music",
            "the musics",
            "to music"
          ]
        },
        {
          "corr": "in the movie,",
          "dist": [
            "at movie the,",
            "on the movie,",
            "for movie the,",
            "with movie the,"
          ]
        },
        {
          "corr": "not the story.",
          "dist": [
            "no the story.",
            "not story the.",
            "story not the.",
            "none the story."
          ]
        }
      ]
    },
    {
      "prompt": "What made",
      "trans": "آنچه او را عصبانی کرد، رفتار بی‌ادبانه راننده بود.",
      "steps": [
        {
          "corr": "him angry",
          "dist": [
            "he angry",
            "his angry",
            "him angrily",
            "angry him"
          ]
        },
        {
          "corr": "was the rude",
          "dist": [
            "were the rude",
            "was rude the",
            "is the rude",
            "was a rude"
          ]
        },
        {
          "corr": "manner",
          "dist": [
            "manners",
            "mannered",
            "mannerly",
            "to manner"
          ]
        },
        {
          "corr": "of the driver",
          "dist": [
            "for driver the",
            "with driver the",
            "by the driver",
            "at driver the"
          ]
        },
        {
          "corr": "yesterday.",
          "dist": [
            "in yesterday.",
            "at yesterday.",
            "on yesterday.",
            "for yesterday."
          ]
        }
      ]
    },
    {
      "prompt": "It was",
      "trans": "سال گذشته بود که ما برای اولین بار به رم سفر کردیم.",
      "steps": [
        {
          "corr": "last year that",
          "dist": [
            "last year when",
            "last year which",
            "year last that",
            "last year who"
          ]
        },
        {
          "corr": "we first",
          "dist": [
            "first we",
            "we firstly",
            "we at first",
            "firstly we"
          ]
        },
        {
          "corr": "visited",
          "dist": [
            "visit",
            "visiting",
            "visits",
            "to visit"
          ]
        },
        {
          "corr": "Rome",
          "dist": [
            "the Rome",
            "to Rome",
            "at Rome",
            "in Rome"
          ]
        },
        {
          "corr": "together.",
          "dist": [
            "in together.",
            "with together.",
            "togetherly.",
            "at together."
          ]
        }
      ]
    },
    {
      "prompt": "What matters",
      "trans": "آنچه بیش از همه اهمیت دارد، سلامتی و آرامش است.",
      "steps": [
        {
          "corr": "most is",
          "dist": [
            "most are",
            "mostly is",
            "more is",
            "is most"
          ]
        },
        {
          "corr": "staying",
          "dist": [
            "stay",
            "stayed",
            "to staying",
            "stays"
          ]
        },
        {
          "corr": "healthy",
          "dist": [
            "health",
            "healthily",
            "healthiness",
            "in health"
          ]
        },
        {
          "corr": "and happy",
          "dist": [
            "and happily",
            "and happiness",
            "with happy",
            "or happily"
          ]
        },
        {
          "corr": "every day.",
          "dist": [
            "in every day.",
            "at day every.",
            "on day every.",
            "for day."
          ]
        }
      ]
    },
    {
      "prompt": "The place",
      "trans": "جایی که ما همدیگر را دیدیم، یک کافه کوچک نزدیک کتابخانه بود.",
      "steps": [
        {
          "corr": "where we met",
          "dist": [
            "which we met",
            "that we met",
            "met we where",
            "when we met"
          ]
        },
        {
          "corr": "was a cozy",
          "dist": [
            "were a cozy",
            "was cozy a",
            "is a cozy",
            "a cozy was"
          ]
        },
        {
          "corr": "cafe",
          "dist": [
            "cafes",
            "the cafe",
            "a cafes",
            "to cafe"
          ]
        },
        {
          "corr": "near the park",
          "dist": [
            "near to the park",
            "nearby park the",
            "close park the",
            "at near the park"
          ]
        },
        {
          "corr": "downtown.",
          "dist": [
            "in downtown.",
            "at downtown.",
            "to downtown.",
            "for downtown."
          ]
        }
      ]
    },
    {
      "prompt": "All he",
      "trans": "تمام کاری که او کرد این بود که چند دقیقه عذرخواهی کند.",
      "steps": [
        {
          "corr": "did was",
          "dist": [
            "did were",
            "done was",
            "doing was",
            "was did"
          ]
        },
        {
          "corr": "say sorry",
          "dist": [
            "to say sorry",
            "saying sorry",
            "said sorry",
            "says sorry"
          ]
        },
        {
          "corr": "for",
          "dist": [
            "of",
            "about",
            "with",
            "to"
          ]
        },
        {
          "corr": "his mistake",
          "dist": [
            "mistake his",
            "the his mistake",
            "a mistake his",
            "to mistake"
          ]
        },
        {
          "corr": "quickly.",
          "dist": [
            "quick.",
            "with quick.",
            "in quickly.",
            "quickness."
          ]
        }
      ]
    },
    {
      "prompt": "It is",
      "trans": "شجاعت اوست که همه را در این تیم شگفت‌زده می‌کند.",
      "steps": [
        {
          "corr": "her courage that",
          "dist": [
            "her courage who",
            "her courage which",
            "courage her that",
            "she courage that"
          ]
        },
        {
          "corr": "inspires",
          "dist": [
            "inspire",
            "inspiring",
            "inspired",
            "to inspire"
          ]
        },
        {
          "corr": "everyone",
          "dist": [
            "everybody",
            "all people",
            "every ones",
            "to everyone"
          ]
        },
        {
          "corr": "on the team",
          "dist": [
            "in the team",
            "at team the",
            "for team the",
            "by the team"
          ]
        },
        {
          "corr": "today.",
          "dist": [
            "in today.",
            "at today.",
            "on today.",
            "for today."
          ]
        }
      ]
    },
    {
      "prompt": "What we",
      "trans": "آنچه کشف کردیم، کاملاً با انتظارات ما متفاوت بود.",
      "steps": [
        {
          "corr": "discovered was",
          "dist": [
            "discovered were",
            "discover was",
            "discovering was",
            "was discovered"
          ]
        },
        {
          "corr": "completely",
          "dist": [
            "complete",
            "in complete",
            "completeness",
            "completing"
          ]
        },
        {
          "corr": "different",
          "dist": [
            "differently",
            "difference",
            "differs",
            "to difference"
          ]
        },
        {
          "corr": "from our hopes",
          "dist": [
            "of our hopes",
            "with hopes our",
            "to our hopes",
            "by hopes our"
          ]
        },
        {
          "corr": "at first.",
          "dist": [
            "in first.",
            "on first.",
            "for first.",
            "by first."
          ]
        }
      ]
    },
    {
      "prompt": "The day",
      "trans": "روزی که قرارداد را امضا کردیم، دوشنبه بود.",
      "steps": [
        {
          "corr": "when we signed",
          "dist": [
            "which we signed",
            "that signed we",
            "where we signed",
            "signed we when"
          ]
        },
        {
          "corr": "the deal was",
          "dist": [
            "the deal were",
            "deal the was",
            "a deal was",
            "was the deal"
          ]
        },
        {
          "corr": "a rainy",
          "dist": [
            "rainy a",
            "the rainy",
            "an rainy",
            "to rainy"
          ]
        },
        {
          "corr": "Monday",
          "dist": [
            "Mondays",
            "the Monday",
            "on Monday",
            "at Monday"
          ]
        },
        {
          "corr": "in May.",
          "dist": [
            "at May.",
            "on May.",
            "for May.",
            "by May."
          ]
        }
      ]
    },
    {
      "prompt": "What I",
      "trans": "آنچه واقعاً دوست دارم، قدم زدن در پاییز است.",
      "steps": [
        {
          "corr": "love is",
          "dist": [
            "love are",
            "loved is",
            "loves is",
            "is love"
          ]
        },
        {
          "corr": "walking",
          "dist": [
            "walk",
            "walked",
            "to walking",
            "walks"
          ]
        },
        {
          "corr": "in autumn",
          "dist": [
            "at autumn",
            "on autumn",
            "for autumn",
            "by autumn"
          ]
        },
        {
          "corr": "under the trees",
          "dist": [
            "below trees the",
            "beneath the trees",
            "at the trees",
            "with trees the"
          ]
        },
        {
          "corr": "peacefully.",
          "dist": [
            "peaceful.",
            "in peace.",
            "with peaceful.",
            "peace."
          ]
        }
      ]
    },
    {
      "prompt": "It was",
      "trans": "آلیس بود که پیشنهاد کرد آخر هفته به کوهستان برویم.",
      "steps": [
        {
          "corr": "Alice who",
          "dist": [
            "Alice which",
            "Alice whom",
            "Alice whose",
            "Alice that who"
          ]
        },
        {
          "corr": "suggested",
          "dist": [
            "suggest",
            "suggesting",
            "suggests",
            "to suggest"
          ]
        },
        {
          "corr": "going to",
          "dist": [
            "go to",
            "to go to",
            "went to",
            "going"
          ]
        },
        {
          "corr": "the mountains",
          "dist": [
            "mountains the",
            "a mountain",
            "mountain the",
            "to mountain"
          ]
        },
        {
          "corr": "this weekend.",
          "dist": [
            "in this weekend.",
            "at weekend this.",
            "on weekend this.",
            "for weekend."
          ]
        }
      ]
    },
    {
      "prompt": "All she",
      "trans": "تمام چیزی که به آن احتیاج دارد، چند روز استراحت است.",
      "steps": [
        {
          "corr": "needs is",
          "dist": [
            "needs are",
            "needed is",
            "need is",
            "is need"
          ]
        },
        {
          "corr": "a few days",
          "dist": [
            "few days a",
            "few a days",
            "a few day",
            "the few days"
          ]
        },
        {
          "corr": "of rest",
          "dist": [
            "in rest",
            "for rest",
            "to rest",
            "with rest"
          ]
        },
        {
          "corr": "at home",
          "dist": [
            "in home",
            "to home",
            "on home",
            "for home"
          ]
        },
        {
          "corr": "this week.",
          "dist": [
            "in this week.",
            "at week this.",
            "on week this.",
            "for week."
          ]
        }
      ]
    },
    {
      "prompt": "The reason",
      "trans": "دلیلی که ما رفتیم، خستگی بیش از حد بود.",
      "steps": [
        {
          "corr": "why we left",
          "dist": [
            "which we left",
            "that left we",
            "where we left",
            "left we why"
          ]
        },
        {
          "corr": "was that we",
          "dist": [
            "were that we",
            "was we that",
            "is that we",
            "that we was"
          ]
        },
        {
          "corr": "felt",
          "dist": [
            "feel",
            "feeling",
            "feels",
            "to feel"
          ]
        },
        {
          "corr": "too tired",
          "dist": [
            "very tired",
            "tired too",
            "so tired",
            "much tired"
          ]
        },
        {
          "corr": "to stay.",
          "dist": [
            "for stay.",
            "staying to.",
            "to staying.",
            "stay to."
          ]
        }
      ]
    }
  ],
  "7": [
    {
      "prompt": "Will it rain",
      "trans": "آیا فردا باران خواهد بارید؟ من واقعاً امیدوارم اینطور نباشد.",
      "steps": [
        {
          "corr": "tomorrow?",
          "dist": [
            "in tomorrow?",
            "at tomorrow?",
            "on tomorrow?",
            "for tomorrow?"
          ]
        },
        {
          "corr": "I certainly",
          "dist": [
            "I certain",
            "certainly I",
            "I am certain",
            "I sure"
          ]
        },
        {
          "corr": "hope",
          "dist": [
            "hoped",
            "hoping",
            "hopes",
            "to hope"
          ]
        },
        {
          "corr": "not,",
          "dist": [
            "no,",
            "so not,",
            "not so,",
            "neither,"
          ]
        },
        {
          "corr": "for our trip.",
          "dist": [
            "to our trip.",
            "in our trip.",
            "at trip our.",
            "by our trip."
          ]
        }
      ]
    },
    {
      "prompt": "Are they",
      "trans": "آیا آنها امشب می‌آیند؟ فکر می‌کنم بله.",
      "steps": [
        {
          "corr": "coming tonight?",
          "dist": [
            "come tonight?",
            "came tonight?",
            "to come tonight?",
            "coming in tonight?"
          ]
        },
        {
          "corr": "I think",
          "dist": [
            "I thought",
            "think I",
            "I am think",
            "I thinking"
          ]
        },
        {
          "corr": "so,",
          "dist": [
            "it,",
            "that,",
            "this,",
            "yes,"
          ]
        },
        {
          "corr": "because they",
          "dist": [
            "since they",
            "as they",
            "for they",
            "why they"
          ]
        },
        {
          "corr": "called earlier.",
          "dist": [
            "call earlier.",
            "calling earlier.",
            "called early.",
            "early called."
          ]
        }
      ]
    },
    {
      "prompt": "Can you",
      "trans": "می‌توانی به من کمک کنی؟ اگر وقت نداری، بعداً بگو.",
      "steps": [
        {
          "corr": "help me?",
          "dist": [
            "helping me?",
            "helped me?",
            "to help me?",
            "help to me?"
          ]
        },
        {
          "corr": "If not,",
          "dist": [
            "If no,",
            "If neither,",
            "If none,",
            "If without,"
          ]
        },
        {
          "corr": "please let",
          "dist": [
            "please to let",
            "please letting",
            "let please",
            "please lets"
          ]
        },
        {
          "corr": "me know",
          "dist": [
            "I know",
            "my know",
            "me to know",
            "me knowing"
          ]
        },
        {
          "corr": "later.",
          "dist": [
            "lately.",
            "more late.",
            "latest.",
            "in later."
          ]
        }
      ]
    },
    {
      "prompt": "She wanted",
      "trans": "او می‌خواست به سینما برود، اما نتوانست.",
      "steps": [
        {
          "corr": "to go,",
          "dist": [
            "going,",
            "go,",
            "to going,",
            "gone,"
          ]
        },
        {
          "corr": "but her sister",
          "dist": [
            "and her sister",
            "also her sister",
            "however her sister",
            "sister her but"
          ]
        },
        {
          "corr": "could",
          "dist": [
            "can",
            "could to",
            "was able",
            "could have"
          ]
        },
        {
          "corr": "not",
          "dist": [
            "no",
            "neither",
            "none",
            "without"
          ]
        },
        {
          "corr": "make it.",
          "dist": [
            "made it.",
            "making it.",
            "make.",
            "to make it."
          ]
        }
      ]
    },
    {
      "prompt": "He promised",
      "trans": "او قول داد اتاقش را تمیز کند و بدون تأخیر این کار را کرد.",
      "steps": [
        {
          "corr": "to clean up,",
          "dist": [
            "cleaning up,",
            "clean up,",
            "cleaned up,",
            "to cleaning up,"
          ]
        },
        {
          "corr": "and he",
          "dist": [
            "but he",
            "so he",
            "yet he",
            "he and"
          ]
        },
        {
          "corr": "did",
          "dist": [
            "does",
            "done",
            "was",
            "had"
          ]
        },
        {
          "corr": "so",
          "dist": [
            "such",
            "it so",
            "same",
            "that so"
          ]
        },
        {
          "corr": "without delay.",
          "dist": [
            "with no delay.",
            "with not delay.",
            "except delay.",
            "unless delay."
          ]
        }
      ]
    },
    {
      "prompt": "Do you",
      "trans": "آیا به تعطیلات می‌روی؟ کاش می‌توانستم بروم.",
      "steps": [
        {
          "corr": "go away?",
          "dist": [
            "going away?",
            "gone away?",
            "went away?",
            "to go away?"
          ]
        },
        {
          "corr": "I wish",
          "dist": [
            "I wished",
            "wish I",
            "I am wish",
            "I wishing"
          ]
        },
        {
          "corr": "I could,",
          "dist": [
            "I can,",
            "could I,",
            "I would,",
            "I did,"
          ]
        },
        {
          "corr": "but I am",
          "dist": [
            "and I am",
            "so I am",
            "yet I am",
            "but am I"
          ]
        },
        {
          "corr": "too busy.",
          "dist": [
            "very busy.",
            "busy too.",
            "so busy.",
            "much busy."
          ]
        }
      ]
    },
    {
      "prompt": "Has he",
      "trans": "آیا او کار را تمام کرده است؟ امیدوارم اینطور باشد.",
      "steps": [
        {
          "corr": "finished yet?",
          "dist": [
            "finish yet?",
            "finishing yet?",
            "finished already?",
            "finished still?"
          ]
        },
        {
          "corr": "I certainly",
          "dist": [
            "I certain",
            "certainly I",
            "I am sure",
            "surely I"
          ]
        },
        {
          "corr": "hope",
          "dist": [
            "hoped",
            "hoping",
            "hopes",
            "to hope"
          ]
        },
        {
          "corr": "so,",
          "dist": [
            "it,",
            "that,",
            "this,",
            "yes,"
          ]
        },
        {
          "corr": "for his sake.",
          "dist": [
            "to his sake.",
            "in his sake.",
            "at sake his.",
            "by his sake."
          ]
        }
      ]
    },
    {
      "prompt": "Would you",
      "trans": "آیا مایلی به ما ملحق شوی؟ خیلی دوست دارم.",
      "steps": [
        {
          "corr": "like to join?",
          "dist": [
            "like join?",
            "liking to join?",
            "liked to join?",
            "like joining?"
          ]
        },
        {
          "corr": "I would",
          "dist": [
            "I will",
            "I had",
            "would I",
            "I did"
          ]
        },
        {
          "corr": "love",
          "dist": [
            "loved",
            "loving",
            "loves",
            "to love"
          ]
        },
        {
          "corr": "to,",
          "dist": [
            "it,",
            "that,",
            "so,",
            "too,"
          ]
        },
        {
          "corr": "thank you.",
          "dist": [
            "thanks to you.",
            "thank to you.",
            "thanks you.",
            "thanking you."
          ]
        }
      ]
    },
    {
      "prompt": "Did they",
      "trans": "آیا آنها خانه را خریدند؟ فکر نمی‌کنم خریده باشند.",
      "steps": [
        {
          "corr": "buy the house?",
          "dist": [
            "bought the house?",
            "buying the house?",
            "buy house?",
            "to buy the house?"
          ]
        },
        {
          "corr": "I do not",
          "dist": [
            "I did not",
            "do not I",
            "I am not",
            "I had not"
          ]
        },
        {
          "corr": "believe",
          "dist": [
            "believed",
            "believing",
            "believes",
            "to believe"
          ]
        },
        {
          "corr": "so,",
          "dist": [
            "it,",
            "that,",
            "this,",
            "yes,"
          ]
        },
        {
          "corr": "so I heard.",
          "dist": [
            "as I heard.",
            "that I heard.",
            "what I heard.",
            "how I heard."
          ]
        }
      ]
    },
    {
      "prompt": "She asked",
      "trans": "او از من خواست که پیانو بنوازم، اما من نپذیرفتم.",
      "steps": [
        {
          "corr": "me to play,",
          "dist": [
            "me play,",
            "I to play,",
            "my to play,",
            "me playing,"
          ]
        },
        {
          "corr": "but I",
          "dist": [
            "and I",
            "so I",
            "yet I",
            "however I"
          ]
        },
        {
          "corr": "preferred",
          "dist": [
            "prefer",
            "preferring",
            "prefers",
            "to prefer"
          ]
        },
        {
          "corr": "not",
          "dist": [
            "no",
            "neither",
            "none",
            "without"
          ]
        },
        {
          "corr": "to.",
          "dist": [
            "it.",
            "that.",
            "so.",
            "too."
          ]
        }
      ]
    },
    {
      "prompt": "Is dinner",
      "trans": "آیا شام حاضر است؟ به نظر من که اینطور است.",
      "steps": [
        {
          "corr": "ready yet?",
          "dist": [
            "ready already?",
            "readied yet?",
            "ready still?",
            "to ready yet?"
          ]
        },
        {
          "corr": "It certainly",
          "dist": [
            "It certain",
            "certainly it",
            "It is sure",
            "surely it"
          ]
        },
        {
          "corr": "seems",
          "dist": [
            "seemed",
            "seeming",
            "seem",
            "to seem"
          ]
        },
        {
          "corr": "so,",
          "dist": [
            "it,",
            "that,",
            "this,",
            "yes,"
          ]
        },
        {
          "corr": "by the smell.",
          "dist": [
            "from the smell.",
            "at the smell.",
            "with the smell.",
            "in the smell."
          ]
        }
      ]
    },
    {
      "prompt": "He wanted",
      "trans": "او قصد داشت استعفا دهد، اما دوستانش مانع شدند.",
      "steps": [
        {
          "corr": "to resign,",
          "dist": [
            "resigning,",
            "resign,",
            "resigned,",
            "to resigning,"
          ]
        },
        {
          "corr": "but was",
          "dist": [
            "and was",
            "so was",
            "yet was",
            "was but"
          ]
        },
        {
          "corr": "advised",
          "dist": [
            "advise",
            "advising",
            "advises",
            "to advise"
          ]
        },
        {
          "corr": "not",
          "dist": [
            "no",
            "neither",
            "none",
            "without"
          ]
        },
        {
          "corr": "to do so.",
          "dist": [
            "to do it.",
            "to do that.",
            "doing so.",
            "to do such."
          ]
        }
      ]
    },
    {
      "prompt": "Do we",
      "trans": "آیا نیاز به رزرو داریم؟ اگر اینطور است، من تماس می‌گیرم.",
      "steps": [
        {
          "corr": "need to book?",
          "dist": [
            "need booking?",
            "needed to book?",
            "need book?",
            "to need to book?"
          ]
        },
        {
          "corr": "If so,",
          "dist": [
            "If it,",
            "If that,",
            "If yes,",
            "If such,"
          ]
        },
        {
          "corr": "I will",
          "dist": [
            "I would",
            "will I",
            "I had",
            "I am"
          ]
        },
        {
          "corr": "call the place",
          "dist": [
            "call to place",
            "calling the place",
            "called place the",
            "place call the"
          ]
        },
        {
          "corr": "right now.",
          "dist": [
            "right away.",
            "straight now.",
            "now right.",
            "at once now."
          ]
        }
      ]
    },
    {
      "prompt": "Did she",
      "trans": "آیا او شغل را قبول کرد؟ من فکر می‌کنم بله.",
      "steps": [
        {
          "corr": "take the offer?",
          "dist": [
            "took the offer?",
            "taking the offer?",
            "take offer?",
            "to take the offer?"
          ]
        },
        {
          "corr": "I assume",
          "dist": [
            "I assumed",
            "assume I",
            "I am assume",
            "I assuming"
          ]
        },
        {
          "corr": "so,",
          "dist": [
            "it,",
            "that,",
            "this,",
            "yes,"
          ]
        },
        {
          "corr": "because she",
          "dist": [
            "since she",
            "as she",
            "for she",
            "why she"
          ]
        },
        {
          "corr": "smiled today.",
          "dist": [
            "smile today.",
            "smiling today.",
            "smiled in today.",
            "today smiled."
          ]
        }
      ]
    },
    {
      "prompt": "They invited",
      "trans": "آنها او را به شام دعوت کردند، اما او نرفت.",
      "steps": [
        {
          "corr": "him over,",
          "dist": [
            "he over,",
            "his over,",
            "him to over,",
            "over him,"
          ]
        },
        {
          "corr": "but he",
          "dist": [
            "and he",
            "so he",
            "yet he",
            "he but"
          ]
        },
        {
          "corr": "chose",
          "dist": [
            "choose",
            "chosen",
            "choosing",
            "chooses"
          ]
        },
        {
          "corr": "not",
          "dist": [
            "no",
            "neither",
            "none",
            "without"
          ]
        },
        {
          "corr": "to go.",
          "dist": [
            "going.",
            "go.",
            "gone.",
            "to going."
          ]
        }
      ]
    },
    {
      "prompt": "Will you",
      "trans": "آیا در جلسه شرکت می‌کنی؟ اگر مجبور نباشم، ترجیح می‌دهم شرکت نکنم.",
      "steps": [
        {
          "corr": "attend today?",
          "dist": [
            "attending today?",
            "attended today?",
            "attend in today?",
            "to attend today?"
          ]
        },
        {
          "corr": "I would rather",
          "dist": [
            "I will rather",
            "rather I would",
            "I had rather",
            "I would better"
          ]
        },
        {
          "corr": "not,",
          "dist": [
            "no,",
            "neither,",
            "none,",
            "not so,"
          ]
        },
        {
          "corr": "if that is",
          "dist": [
            "if it is",
            "if that was",
            "is that if",
            "if is that"
          ]
        },
        {
          "corr": "possible.",
          "dist": [
            "possibly.",
            "possibility.",
            "in possible.",
            "with possible."
          ]
        }
      ]
    },
    {
      "prompt": "Are we",
      "trans": "آیا مسیر را درست می‌رویم؟ من گمان می‌کنم بله.",
      "steps": [
        {
          "corr": "on track?",
          "dist": [
            "in track?",
            "at track?",
            "to track?",
            "by track?"
          ]
        },
        {
          "corr": "I suppose",
          "dist": [
            "I supposed",
            "suppose I",
            "I am suppose",
            "I supposing"
          ]
        },
        {
          "corr": "so,",
          "dist": [
            "it,",
            "that,",
            "this,",
            "yes,"
          ]
        },
        {
          "corr": "according to",
          "dist": [
            "accord to",
            "according with",
            "according at",
            "to accord"
          ]
        },
        {
          "corr": "the map.",
          "dist": [
            "map the.",
            "a map.",
            "maps the.",
            "to map."
          ]
        }
      ]
    },
    {
      "prompt": "Did he",
      "trans": "آیا او به پدرش گفت؟ بله، دیشب این کار را کرد.",
      "steps": [
        {
          "corr": "tell his father?",
          "dist": [
            "told his father?",
            "telling his father?",
            "tell to father?",
            "father tell his?"
          ]
        },
        {
          "corr": "Yes, he",
          "dist": [
            "Yes, him",
            "Yes, his",
            "Yes, he did",
            "Yes, was he"
          ]
        },
        {
          "corr": "did",
          "dist": [
            "does",
            "done",
            "was",
            "had"
          ]
        },
        {
          "corr": "so",
          "dist": [
            "such",
            "it so",
            "same",
            "that so"
          ]
        },
        {
          "corr": "last night.",
          "dist": [
            "in last night.",
            "at last night.",
            "on last night.",
            "for last night."
          ]
        }
      ]
    },
    {
      "prompt": "Can we",
      "trans": "آیا می‌توانیم ماشین را اینجا پارک کنیم؟ اگر امکان دارد، بله.",
      "steps": [
        {
          "corr": "park here?",
          "dist": [
            "parking here?",
            "parked here?",
            "to park here?",
            "park in here?"
          ]
        },
        {
          "corr": "If possible,",
          "dist": [
            "If possibly,",
            "If possibility,",
            "If it possible,",
            "If is possible,"
          ]
        },
        {
          "corr": "we should",
          "dist": [
            "we must",
            "we can",
            "should we",
            "we ought"
          ]
        },
        {
          "corr": "do",
          "dist": [
            "done",
            "did",
            "doing",
            "does"
          ]
        },
        {
          "corr": "so now.",
          "dist": [
            "it now.",
            "that now.",
            "so in now.",
            "now so."
          ]
        }
      ]
    },
    {
      "prompt": "Has she",
      "trans": "آیا او قبول شده است؟ امیدوارم اینطور باشد.",
      "steps": [
        {
          "corr": "passed the test?",
          "dist": [
            "pass the test?",
            "passing the test?",
            "passed test?",
            "to pass the test?"
          ]
        },
        {
          "corr": "I really",
          "dist": [
            "really I",
            "I am real",
            "I real",
            "surely I"
          ]
        },
        {
          "corr": "hope",
          "dist": [
            "hoped",
            "hoping",
            "hopes",
            "to hope"
          ]
        },
        {
          "corr": "so,",
          "dist": [
            "it,",
            "that,",
            "this,",
            "yes,"
          ]
        },
        {
          "corr": "for her future.",
          "dist": [
            "to her future.",
            "in her future.",
            "at future her.",
            "by her future."
          ]
        }
      ]
    }
  ],
  "8": [
    {
      "prompt": "It is",
      "trans": "وقت آن است که تصمیم نهایی را بگیریم.",
      "steps": [
        {
          "corr": "high time",
          "dist": [
            "time high",
            "a high time",
            "the high time",
            "in high time"
          ]
        },
        {
          "corr": "we made",
          "dist": [
            "we make",
            "we making",
            "made we",
            "we have made"
          ],
          "trap": {
            "text": "we make",
            "exp": "بعد از It is high time فعل گذشته غیرواقعی الزامی است."
          }
        },
        {
          "corr": "our final",
          "dist": [
            "final our",
            "the our final",
            "a final our",
            "to final"
          ]
        },
        {
          "corr": "decision",
          "dist": [
            "decide",
            "decided",
            "decisive",
            "deciding"
          ]
        },
        {
          "corr": "together.",
          "dist": [
            "in together.",
            "with together.",
            "togetherly.",
            "at together."
          ]
        }
      ]
    },
    {
      "prompt": "I would",
      "trans": "ترجیح می‌دهم امشب در خانه بمانی و استراحت کنی.",
      "steps": [
        {
          "corr": "rather you",
          "dist": [
            "rather that you",
            "better you",
            "prefer you",
            "rather to you"
          ]
        },
        {
          "corr": "stayed",
          "dist": [
            "stay",
            "staying",
            "stays",
            "to stay"
          ],
          "trap": {
            "text": "stay",
            "exp": "بعد از would rather + فاعل، فعل به شکل گذشته غیرواقعی می‌آید."
          }
        },
        {
          "corr": "home tonight",
          "dist": [
            "at home tonight",
            "in home tonight",
            "to home tonight",
            "home in tonight"
          ]
        },
        {
          "corr": "and rested",
          "dist": [
            "and rest",
            "and resting",
            "and to rest",
            "rested and"
          ]
        },
        {
          "corr": "quietly.",
          "dist": [
            "quiet.",
            "in quiet.",
            "with quiet.",
            "quietness."
          ]
        }
      ]
    },
    {
      "prompt": "If only",
      "trans": "کاش قبل از خرید خانه با یک وکیل مشورت کرده بودم.",
      "steps": [
        {
          "corr": "I had",
          "dist": [
            "I have",
            "had I",
            "I was",
            "I did"
          ]
        },
        {
          "corr": "talked",
          "dist": [
            "talk",
            "talking",
            "talks",
            "to talk"
          ]
        },
        {
          "corr": "to a lawyer",
          "dist": [
            "with lawyer a",
            "at a lawyer",
            "for lawyer a",
            "by a lawyer"
          ]
        },
        {
          "corr": "before signing",
          "dist": [
            "before sign",
            "ahead signing",
            "prior to sign",
            "before to sign"
          ]
        },
        {
          "corr": "the contract.",
          "dist": [
            "contract the.",
            "a contract.",
            "contracts the.",
            "to contract."
          ]
        }
      ]
    },
    {
      "prompt": "She wishes",
      "trans": "او آرزو دارد که می‌توانست گیتار را حرفه‌ای بنوازد.",
      "steps": [
        {
          "corr": "she could",
          "dist": [
            "she can",
            "could she",
            "she would",
            "she might"
          ]
        },
        {
          "corr": "play the guitar",
          "dist": [
            "play guitar the",
            "playing guitar",
            "played the guitar",
            "guitar play the"
          ]
        },
        {
          "corr": "well",
          "dist": [
            "good",
            "better",
            "best",
            "finely"
          ]
        },
        {
          "corr": "in front of",
          "dist": [
            "in ahead of",
            "ahead of",
            "prior to",
            "before of"
          ]
        },
        {
          "corr": "people.",
          "dist": [
            "peoples.",
            "the people.",
            "a people.",
            "to people."
          ]
        }
      ]
    },
    {
      "prompt": "He acts",
      "trans": "او طوری رفتار می‌کند که انگار همه چیز را در این شرکت می‌داند.",
      "steps": [
        {
          "corr": "as if",
          "dist": [
            "as though that",
            "like if",
            "as like",
            "so as"
          ]
        },
        {
          "corr": "he knew",
          "dist": [
            "he knows",
            "he know",
            "knew he",
            "he has known"
          ],
          "trap": {
            "text": "he knows",
            "exp": "برای حالت غیرواقعی فرضی از زمان گذشته knew استفاده می‌شود."
          }
        },
        {
          "corr": "everything",
          "dist": [
            "all things",
            "every thing",
            "the all",
            "anything"
          ]
        },
        {
          "corr": "about the job",
          "dist": [
            "of job the",
            "with the job",
            "at job the",
            "for the job"
          ]
        },
        {
          "corr": "already.",
          "dist": [
            "yet.",
            "still.",
            "now.",
            "before."
          ]
        }
      ]
    },
    {
      "prompt": "It is",
      "trans": "وقت آن رسیده است که او عذرخواهی کند.",
      "steps": [
        {
          "corr": "about time",
          "dist": [
            "time about",
            "the time about",
            "a time about",
            "in time about"
          ]
        },
        {
          "corr": "he said",
          "dist": [
            "he say",
            "he says",
            "said he",
            "he saying"
          ]
        },
        {
          "corr": "sorry",
          "dist": [
            "sorrow",
            "sorrowful",
            "sorriness",
            "in sorry"
          ]
        },
        {
          "corr": "for his mistake",
          "dist": [
            "of his mistake",
            "at mistake his",
            "with his mistake",
            "to mistake his"
          ]
        },
        {
          "corr": "to us.",
          "dist": [
            "at us.",
            "with us.",
            "for us.",
            "by us."
          ]
        }
      ]
    },
    {
      "prompt": "I wish",
      "trans": "کاش الان در ساحل بودیم و آفتاب می‌گرفتیم.",
      "steps": [
        {
          "corr": "we were",
          "dist": [
            "we was",
            "we are",
            "were we",
            "we have been"
          ],
          "trap": {
            "text": "we are",
            "exp": "برای آرزوی زمان حال از گذشته ساده were استفاده می‌شود."
          }
        },
        {
          "corr": "by the ocean",
          "dist": [
            "at the ocean",
            "in ocean the",
            "on the ocean",
            "to ocean the"
          ]
        },
        {
          "corr": "enjoying",
          "dist": [
            "enjoy",
            "enjoyed",
            "to enjoy",
            "enjoys"
          ]
        },
        {
          "corr": "the warm sun",
          "dist": [
            "warm sun the",
            "the sun warm",
            "a warm sun",
            "sun warm the"
          ]
        },
        {
          "corr": "today.",
          "dist": [
            "in today.",
            "at today.",
            "on today.",
            "for today."
          ]
        }
      ]
    },
    {
      "prompt": "I would",
      "trans": "ترجیح می‌دهم خودت با او صحبت کنی تا سوتفاهم پیش نیاید.",
      "steps": [
        {
          "corr": "rather you",
          "dist": [
            "rather that you",
            "better you",
            "prefer you",
            "rather to you"
          ]
        },
        {
          "corr": "spoke to him",
          "dist": [
            "speak to him",
            "speaking to him",
            "spoke with he",
            "speak with he"
          ]
        },
        {
          "corr": "in person",
          "dist": [
            "at person",
            "on person",
            "by person",
            "with person"
          ]
        },
        {
          "corr": "to clear",
          "dist": [
            "for clear",
            "clearing to",
            "clear to",
            "to clearing"
          ]
        },
        {
          "corr": "the air.",
          "dist": [
            "air the.",
            "an air.",
            "the airs.",
            "to air."
          ]
        }
      ]
    },
    {
      "prompt": "If only",
      "trans": "کاش پول بیشتری برای سفر پس‌انداز کرده بودیم.",
      "steps": [
        {
          "corr": "we had",
          "dist": [
            "we have",
            "had we",
            "we were",
            "we did"
          ]
        },
        {
          "corr": "saved",
          "dist": [
            "save",
            "saving",
            "saves",
            "to save"
          ]
        },
        {
          "corr": "more cash",
          "dist": [
            "cash more",
            "much cash",
            "many cash",
            "most cash"
          ]
        },
        {
          "corr": "for this trip",
          "dist": [
            "to trip this",
            "at this trip",
            "in this trip",
            "with trip this"
          ]
        },
        {
          "corr": "abroad.",
          "dist": [
            "in abroad.",
            "to abroad.",
            "at abroad.",
            "for abroad."
          ]
        }
      ]
    },
    {
      "prompt": "She talks",
      "trans": "او طوری صحبت می‌کند انگار خودش در آنجا حضور داشته است.",
      "steps": [
        {
          "corr": "as though",
          "dist": [
            "as if that",
            "like though",
            "as like",
            "so though"
          ]
        },
        {
          "corr": "she had been",
          "dist": [
            "she was",
            "she has been",
            "had she been",
            "she were been"
          ]
        },
        {
          "corr": "there",
          "dist": [
            "in there",
            "at there",
            "to there",
            "on there"
          ]
        },
        {
          "corr": "to witness",
          "dist": [
            "for witness",
            "witnessing",
            "witness",
            "to witnessing"
          ]
        },
        {
          "corr": "the event.",
          "dist": [
            "event the.",
            "an event.",
            "events the.",
            "to event."
          ]
        }
      ]
    },
    {
      "prompt": "It is",
      "trans": "وقت آن است که بچه‌ها به رختخواب بروند.",
      "steps": [
        {
          "corr": "high time",
          "dist": [
            "time high",
            "a high time",
            "the high time",
            "in high time"
          ]
        },
        {
          "corr": "the children",
          "dist": [
            "children the",
            "a children",
            "the child",
            "to children"
          ]
        },
        {
          "corr": "went",
          "dist": [
            "go",
            "gone",
            "going",
            "goes"
          ]
        },
        {
          "corr": "to bed",
          "dist": [
            "in bed",
            "at bed",
            "on bed",
            "for bed"
          ]
        },
        {
          "corr": "now.",
          "dist": [
            "at now.",
            "in now.",
            "on now.",
            "by now."
          ]
        }
      ]
    },
    {
      "prompt": "I would",
      "trans": "ترجیح می‌دهم این موضوع را به کسی نگویی.",
      "steps": [
        {
          "corr": "rather you",
          "dist": [
            "rather that you",
            "better you",
            "prefer you",
            "rather to you"
          ]
        },
        {
          "corr": "did not mention",
          "dist": [
            "do not mention",
            "not mention",
            "did not mentioned",
            "were not mention"
          ]
        },
        {
          "corr": "this secret",
          "dist": [
            "secret this",
            "the this secret",
            "a secret this",
            "to secret"
          ]
        },
        {
          "corr": "to anyone",
          "dist": [
            "at anyone",
            "with anyone",
            "for anyone",
            "by anyone"
          ]
        },
        {
          "corr": "at work.",
          "dist": [
            "in work.",
            "on work.",
            "to work.",
            "by work."
          ]
        }
      ]
    },
    {
      "prompt": "If only",
      "trans": "کاش آن ایمیل را در حالت عصبانیت نفرستاده بودم.",
      "steps": [
        {
          "corr": "I had not",
          "dist": [
            "I have not",
            "not had I",
            "I did not",
            "I was not"
          ]
        },
        {
          "corr": "sent",
          "dist": [
            "send",
            "sending",
            "sends",
            "to send"
          ]
        },
        {
          "corr": "that angry note",
          "dist": [
            "angry that note",
            "note that angry",
            "that note angry",
            "the note angry"
          ]
        },
        {
          "corr": "in a rush",
          "dist": [
            "at a rush",
            "with rush a",
            "on rush a",
            "for a rush"
          ]
        },
        {
          "corr": "yesterday.",
          "dist": [
            "in yesterday.",
            "at yesterday.",
            "on yesterday.",
            "for yesterday."
          ]
        }
      ]
    },
    {
      "prompt": "He wishes",
      "trans": "او آرزو دارد که زبان اسپانیایی را در مدرسه یاد گرفته بود.",
      "steps": [
        {
          "corr": "he had",
          "dist": [
            "he has",
            "had he",
            "he was",
            "he did"
          ]
        },
        {
          "corr": "learned",
          "dist": [
            "learn",
            "learning",
            "learns",
            "to learn"
          ]
        },
        {
          "corr": "Spanish",
          "dist": [
            "the Spanish",
            "a Spanish",
            "in Spanish",
            "to Spanish"
          ]
        },
        {
          "corr": "when he was",
          "dist": [
            "while was he",
            "when was he",
            "as he was",
            "since he was"
          ]
        },
        {
          "corr": "younger.",
          "dist": [
            "young.",
            "youngest.",
            "more young.",
            "at young."
          ]
        }
      ]
    },
    {
      "prompt": "They treat",
      "trans": "آنها با او طوری رفتار می‌کنند که انگار یک غریبه است.",
      "steps": [
        {
          "corr": "him as if",
          "dist": [
            "him like",
            "he as if",
            "his as if",
            "him as though that"
          ]
        },
        {
          "corr": "he were",
          "dist": [
            "he was",
            "he is",
            "were he",
            "he have been"
          ]
        },
        {
          "corr": "a complete",
          "dist": [
            "complete a",
            "the complete",
            "an complete",
            "to complete"
          ]
        },
        {
          "corr": "stranger",
          "dist": [
            "strangers",
            "strangely",
            "strangerly",
            "to stranger"
          ]
        },
        {
          "corr": "in town.",
          "dist": [
            "at town.",
            "on town.",
            "to town.",
            "by town."
          ]
        }
      ]
    },
    {
      "prompt": "It is",
      "trans": "وقت آن است که او کار جدیدی پیدا کند.",
      "steps": [
        {
          "corr": "about time",
          "dist": [
            "time about",
            "the time about",
            "a time about",
            "in time about"
          ]
        },
        {
          "corr": "she found",
          "dist": [
            "she find",
            "she finds",
            "found she",
            "she finding"
          ]
        },
        {
          "corr": "a new job",
          "dist": [
            "new a job",
            "job a new",
            "the new job",
            "a job new"
          ]
        },
        {
          "corr": "near her home",
          "dist": [
            "close to her home",
            "nearby home her",
            "beside her home",
            "at her home near"
          ]
        },
        {
          "corr": "this month.",
          "dist": [
            "in this month.",
            "at month this.",
            "on month this.",
            "for month."
          ]
        }
      ]
    },
    {
      "prompt": "I wish",
      "trans": "کاش امروز باران نمی‌بارید تا می‌توانستیم پیاده‌روی کنیم.",
      "steps": [
        {
          "corr": "it was not",
          "dist": [
            "it were not",
            "it is not",
            "was not it",
            "it did not"
          ]
        },
        {
          "corr": "raining",
          "dist": [
            "rain",
            "rained",
            "rains",
            "to rain"
          ]
        },
        {
          "corr": "so hard",
          "dist": [
            "so hardly",
            "very hard",
            "much hard",
            "hard so"
          ]
        },
        {
          "corr": "this morning",
          "dist": [
            "in this morning",
            "at morning this",
            "on morning this",
            "for morning"
          ]
        },
        {
          "corr": "in town.",
          "dist": [
            "at town.",
            "on town.",
            "to town.",
            "by town."
          ]
        }
      ]
    },
    {
      "prompt": "I would",
      "trans": "ترجیح می‌دهم فردا با قطار برویم تا ماشین.",
      "steps": [
        {
          "corr": "rather go",
          "dist": [
            "rather went",
            "better go",
            "prefer go",
            "rather going"
          ]
        },
        {
          "corr": "by train",
          "dist": [
            "with train",
            "on train",
            "in train",
            "at train"
          ]
        },
        {
          "corr": "than drive",
          "dist": [
            "then drive",
            "to drive",
            "than driving",
            "drive than"
          ]
        },
        {
          "corr": "all the way",
          "dist": [
            "the all way",
            "way all the",
            "all way the",
            "the way all"
          ]
        },
        {
          "corr": "in traffic.",
          "dist": [
            "at traffic.",
            "on traffic.",
            "for traffic.",
            "with traffic."
          ]
        }
      ]
    },
    {
      "prompt": "If only",
      "trans": "کاش بلیط‌ها را از قبل رزرو کرده بودیم.",
      "steps": [
        {
          "corr": "we had booked",
          "dist": [
            "we have booked",
            "had we booked",
            "we booked",
            "we were book"
          ]
        },
        {
          "corr": "our tickets",
          "dist": [
            "tickets our",
            "the our tickets",
            "a tickets our",
            "to tickets"
          ]
        },
        {
          "corr": "online",
          "dist": [
            "in online",
            "at online",
            "on online",
            "by online"
          ]
        },
        {
          "corr": "before arriving",
          "dist": [
            "ahead arrive",
            "before arrive",
            "prior arriving",
            "before to arrive"
          ]
        },
        {
          "corr": "at the station.",
          "dist": [
            "in station the.",
            "to the station.",
            "on station the.",
            "for station the."
          ]
        }
      ]
    },
    {
      "prompt": "He behaves",
      "trans": "او طوری رفتار می‌کند که انگار صاحب این مکان است.",
      "steps": [
        {
          "corr": "as if",
          "dist": [
            "as though that",
            "like if",
            "as like",
            "so as"
          ]
        },
        {
          "corr": "he owned",
          "dist": [
            "he owns",
            "he own",
            "owned he",
            "he has owned"
          ]
        },
        {
          "corr": "the whole",
          "dist": [
            "whole the",
            "a whole",
            "all the",
            "to whole"
          ]
        },
        {
          "corr": "place",
          "dist": [
            "places",
            "placed",
            "placing",
            "to place"
          ]
        },
        {
          "corr": "by himself.",
          "dist": [
            "with himself.",
            "at himself.",
            "for himself.",
            "of himself."
          ]
        }
      ]
    }
  ],
  "9": [
    {
      "prompt": "If you had",
      "trans": "اگر به توصیه‌ام گوش داده بودی، الان می‌دانستی چه کار کنی.",
      "steps": [
        {
          "corr": "listened to me,",
          "dist": [
            "listened at me,",
            "listen to me,",
            "listening to me,",
            "listens to me,"
          ]
        },
        {
          "corr": "you would",
          "dist": [
            "you will",
            "you had",
            "would you",
            "you did"
          ]
        },
        {
          "corr": "know what",
          "dist": [
            "knew what",
            "knowing what",
            "know that",
            "know how"
          ]
        },
        {
          "corr": "to do now",
          "dist": [
            "do to now",
            "doing now",
            "to doing now",
            "done now"
          ]
        },
        {
          "corr": "without stress.",
          "dist": [
            "with no stress.",
            "with not stress.",
            "except stress.",
            "unless stress."
          ]
        }
      ]
    },
    {
      "prompt": "Had he taken",
      "trans": "اگر آن شغل را قبول کرده بود، الان در نیویورک زندگی می‌کرد.",
      "steps": [
        {
          "corr": "the offer,",
          "dist": [
            "offer the,",
            "an offer,",
            "the offers,",
            "to offer,"
          ]
        },
        {
          "corr": "he would be",
          "dist": [
            "he will be",
            "he had been",
            "be he would",
            "he is"
          ]
        },
        {
          "corr": "living",
          "dist": [
            "live",
            "lived",
            "lives",
            "to live"
          ]
        },
        {
          "corr": "in New York",
          "dist": [
            "at New York",
            "on New York",
            "to New York",
            "for New York"
          ]
        },
        {
          "corr": "today.",
          "dist": [
            "in today.",
            "at today.",
            "on today.",
            "for today."
          ]
        }
      ]
    },
    {
      "prompt": "If I were",
      "trans": "اگر من آدم نترسی بودم، پاراگلایدر را امتحان می‌کردم.",
      "steps": [
        {
          "corr": "braver,",
          "dist": [
            "brave,",
            "more brave,",
            "bravest,",
            "with brave,"
          ]
        },
        {
          "corr": "I would have",
          "dist": [
            "I will have",
            "I had",
            "would I have",
            "I have"
          ]
        },
        {
          "corr": "tried",
          "dist": [
            "try",
            "trying",
            "tries",
            "to try"
          ]
        },
        {
          "corr": "paragliding",
          "dist": [
            "paraglide",
            "paraglided",
            "to paraglide",
            "a paragliding"
          ]
        },
        {
          "corr": "last summer.",
          "dist": [
            "in last summer.",
            "at summer last.",
            "on last summer.",
            "for summer."
          ]
        }
      ]
    },
    {
      "prompt": "Had they",
      "trans": "اگر آنها قطار اول را سوار شده بودند، الان اینجا بودند.",
      "steps": [
        {
          "corr": "caught the train,",
          "dist": [
            "catch the train,",
            "caught train the,",
            "catching the train,",
            "catches train,"
          ]
        },
        {
          "corr": "they would",
          "dist": [
            "they will",
            "they had",
            "would they",
            "they did"
          ]
        },
        {
          "corr": "be here",
          "dist": [
            "here be",
            "being here",
            "been here",
            "to be here"
          ]
        },
        {
          "corr": "with us",
          "dist": [
            "at us",
            "to us",
            "for us",
            "by us"
          ]
        },
        {
          "corr": "right now.",
          "dist": [
            "right away.",
            "straight now.",
            "now right.",
            "at once now."
          ]
        }
      ]
    },
    {
      "prompt": "If she had",
      "trans": "اگر او دیروز خواب کافی داشت، امروز اینقدر خسته نبود.",
      "steps": [
        {
          "corr": "slept well,",
          "dist": [
            "sleep well,",
            "slept good,",
            "sleeping well,",
            "sleeps well,"
          ]
        },
        {
          "corr": "she would not",
          "dist": [
            "she will not",
            "she had not",
            "not she would",
            "she not would"
          ]
        },
        {
          "corr": "feel",
          "dist": [
            "felt",
            "feeling",
            "feels",
            "to feel"
          ]
        },
        {
          "corr": "so exhausted",
          "dist": [
            "such exhausted",
            "exhausted so",
            "too exhausted",
            "very exhaustion"
          ]
        },
        {
          "corr": "today.",
          "dist": [
            "in today.",
            "at today.",
            "on today.",
            "for today."
          ]
        }
      ]
    },
    {
      "prompt": "Had we not",
      "trans": "اگر ما مسیر اشتباه را نرفته بودیم، الان در مقصد بودیم.",
      "steps": [
        {
          "corr": "gotten lost,",
          "dist": [
            "get lost,",
            "got lost,",
            "getting lost,",
            "gotten lose,"
          ]
        },
        {
          "corr": "we would",
          "dist": [
            "we will",
            "we had",
            "would we",
            "we did"
          ]
        },
        {
          "corr": "be",
          "dist": [
            "are",
            "were",
            "been",
            "being"
          ]
        },
        {
          "corr": "at the hotel",
          "dist": [
            "in the hotel",
            "to hotel the",
            "on the hotel",
            "by hotel the"
          ]
        },
        {
          "corr": "by now.",
          "dist": [
            "until now.",
            "since now.",
            "at now.",
            "for now."
          ]
        }
      ]
    },
    {
      "prompt": "If he were",
      "trans": "اگر او فرانسوی بلد بود، آن مقاله را برایمان ترجمه کرده بود.",
      "steps": [
        {
          "corr": "fluent in French,",
          "dist": [
            "fluently in French,",
            "fluent at French,",
            "fluent with French,",
            "fluency in French,"
          ]
        },
        {
          "corr": "he would have",
          "dist": [
            "he will have",
            "he had",
            "would he have",
            "have he"
          ]
        },
        {
          "corr": "translated",
          "dist": [
            "translate",
            "translating",
            "translates",
            "to translate"
          ]
        },
        {
          "corr": "the letter",
          "dist": [
            "letter the",
            "a letter",
            "letters the",
            "to letter"
          ]
        },
        {
          "corr": "for us.",
          "dist": [
            "to us.",
            "at us.",
            "with us.",
            "by us."
          ]
        }
      ]
    },
    {
      "prompt": "Had you",
      "trans": "اگر کلید یدک را آورده بودی، الان بیرون در منتظر نبودیم.",
      "steps": [
        {
          "corr": "brought the key,",
          "dist": [
            "bring the key,",
            "bringing key the,",
            "brought key the,",
            "brings the key,"
          ]
        },
        {
          "corr": "we would not",
          "dist": [
            "we will not",
            "we had not",
            "not we would",
            "we not would"
          ]
        },
        {
          "corr": "be waiting",
          "dist": [
            "wait",
            "waited",
            "waits",
            "to wait"
          ]
        },
        {
          "corr": "outside",
          "dist": [
            "in outside",
            "at outside",
            "to outside",
            "by outside"
          ]
        },
        {
          "corr": "in the cold.",
          "dist": [
            "at the cold.",
            "on cold the.",
            "with cold the.",
            "for cold."
          ]
        }
      ]
    },
    {
      "prompt": "If she were",
      "trans": "اگر او دقت بیشتری داشت، دیروز اشتباه نمی‌کرد.",
      "steps": [
        {
          "corr": "more careful,",
          "dist": [
            "more carefully,",
            "carefuler,",
            "most careful,",
            "careful more,"
          ]
        },
        {
          "corr": "she would not",
          "dist": [
            "she will not",
            "she had not",
            "not she would",
            "she not would"
          ]
        },
        {
          "corr": "have made",
          "dist": [
            "make",
            "made",
            "making",
            "makes"
          ]
        },
        {
          "corr": "that error",
          "dist": [
            "error that",
            "the error that",
            "a error that",
            "to error"
          ]
        },
        {
          "corr": "yesterday.",
          "dist": [
            "in yesterday.",
            "at yesterday.",
            "on yesterday.",
            "for yesterday."
          ]
        }
      ]
    },
    {
      "prompt": "Had I",
      "trans": "اگر پیشنهاد کاری را رد نکرده بودم، الان مدیر بودم.",
      "steps": [
        {
          "corr": "not refused,",
          "dist": [
            "not refuse,",
            "refused not,",
            "no refused,",
            "not refusing,"
          ]
        },
        {
          "corr": "I would",
          "dist": [
            "I will",
            "I had",
            "would I",
            "I did"
          ]
        },
        {
          "corr": "be",
          "dist": [
            "am",
            "was",
            "been",
            "being"
          ]
        },
        {
          "corr": "the team leader",
          "dist": [
            "leader team the",
            "a team leader",
            "the leader team",
            "team leader the"
          ]
        },
        {
          "corr": "today.",
          "dist": [
            "in today.",
            "at today.",
            "on today.",
            "for today."
          ]
        }
      ]
    },
    {
      "prompt": "If we had",
      "trans": "اگر چتر برداشته بودیم، الان لباس‌هایمان خیس نبود.",
      "steps": [
        {
          "corr": "taken umbrellas,",
          "dist": [
            "take umbrellas,",
            "took umbrellas,",
            "taking umbrellas,",
            "takes umbrellas,"
          ]
        },
        {
          "corr": "our clothes",
          "dist": [
            "clothes our",
            "the clothes our",
            "a clothes our",
            "to clothes"
          ]
        },
        {
          "corr": "would not",
          "dist": [
            "will not",
            "had not",
            "not would",
            "did not"
          ]
        },
        {
          "corr": "be soaking",
          "dist": [
            "are soaking",
            "were soaking",
            "been soaking",
            "to soak"
          ]
        },
        {
          "corr": "wet.",
          "dist": [
            "wetted.",
            "wetting.",
            "wetly.",
            "wetter."
          ]
        }
      ]
    },
    {
      "prompt": "Had she studied",
      "trans": "اگر او پزشکی خوانده بود، الان می‌توانست در بیمارستان کار کند.",
      "steps": [
        {
          "corr": "medicine,",
          "dist": [
            "the medicine,",
            "a medicine,",
            "medicines,",
            "to medicine,"
          ]
        },
        {
          "corr": "she could",
          "dist": [
            "she can",
            "could she",
            "she would can",
            "she might can"
          ]
        },
        {
          "corr": "work",
          "dist": [
            "worked",
            "working",
            "works",
            "to work"
          ]
        },
        {
          "corr": "as a doctor",
          "dist": [
            "like a doctor",
            "for a doctor",
            "at a doctor",
            "as doctor"
          ]
        },
        {
          "corr": "now.",
          "dist": [
            "at now.",
            "in now.",
            "on now.",
            "by now."
          ]
        }
      ]
    },
    {
      "prompt": "If I had",
      "trans": "اگر صبح صبحانه خورده بودم، الان اینقدر گرسنه نبودم.",
      "steps": [
        {
          "corr": "eaten breakfast,",
          "dist": [
            "eat breakfast,",
            "ate breakfast,",
            "eating breakfast,",
            "eats breakfast,"
          ]
        },
        {
          "corr": "I would not",
          "dist": [
            "I will not",
            "I had not",
            "not I would",
            "I not would"
          ]
        },
        {
          "corr": "be so hungry",
          "dist": [
            "be such hungry",
            "am so hungry",
            "was so hungry",
            "feel such hungry"
          ]
        },
        {
          "corr": "during",
          "dist": [
            "while",
            "at",
            "for",
            "throughout"
          ]
        },
        {
          "corr": "the class.",
          "dist": [
            "class the.",
            "a class.",
            "classes the.",
            "to class."
          ]
        }
      ]
    },
    {
      "prompt": "Had they saved",
      "trans": "اگر آنها پول پس‌انداز کرده بودند، الان خانه خودشان را داشتند.",
      "steps": [
        {
          "corr": "more money,",
          "dist": [
            "money more,",
            "many money,",
            "most money,",
            "cash more,"
          ]
        },
        {
          "corr": "they would",
          "dist": [
            "they will",
            "they had",
            "would they",
            "they did"
          ]
        },
        {
          "corr": "own",
          "dist": [
            "owned",
            "owning",
            "owns",
            "to own"
          ]
        },
        {
          "corr": "a home",
          "dist": [
            "home a",
            "the home",
            "homes a",
            "to home"
          ]
        },
        {
          "corr": "by now.",
          "dist": [
            "until now.",
            "since now.",
            "at now.",
            "for now."
          ]
        }
      ]
    },
    {
      "prompt": "If he were",
      "trans": "اگر او فرد مسئولیت‌پذیری بود، دیروز پروژه را تحویل می‌داد.",
      "steps": [
        {
          "corr": "reliable,",
          "dist": [
            "reliably,",
            "reliability,",
            "with reliable,",
            "in reliable,"
          ]
        },
        {
          "corr": "he would have",
          "dist": [
            "he will have",
            "he had",
            "would he have",
            "have he"
          ]
        },
        {
          "corr": "submitted",
          "dist": [
            "submit",
            "submitting",
            "submits",
            "to submit"
          ]
        },
        {
          "corr": "the report",
          "dist": [
            "report the",
            "a report",
            "reports the",
            "to report"
          ]
        },
        {
          "corr": "on time.",
          "dist": [
            "in time.",
            "at time.",
            "for time.",
            "by time."
          ]
        }
      ]
    },
    {
      "prompt": "Had you told",
      "trans": "اگر حقیقت را به من گفته بودی، الان عصبانی نبودم.",
      "steps": [
        {
          "corr": "me earlier,",
          "dist": [
            "me early,",
            "I earlier,",
            "my earlier,",
            "me earliest,"
          ]
        },
        {
          "corr": "I would not",
          "dist": [
            "I will not",
            "I had not",
            "not I would",
            "I not would"
          ]
        },
        {
          "corr": "be upset",
          "dist": [
            "am upset",
            "was upset",
            "feel upsetting",
            "upset be"
          ]
        },
        {
          "corr": "with you",
          "dist": [
            "at you",
            "to you",
            "for you",
            "by you"
          ]
        },
        {
          "corr": "right now.",
          "dist": [
            "right away.",
            "straight now.",
            "now right.",
            "at once now."
          ]
        }
      ]
    },
    {
      "prompt": "If she had",
      "trans": "اگر او پرواز مستقیم را گرفته بود، الان به مقصد رسیده بود.",
      "steps": [
        {
          "corr": "taken the direct",
          "dist": [
            "take direct the",
            "took the direct",
            "taking direct the",
            "direct taken the"
          ]
        },
        {
          "corr": "flight,",
          "dist": [
            "flights,",
            "flying,",
            "flighted,",
            "to flight,"
          ]
        },
        {
          "corr": "she would",
          "dist": [
            "she will",
            "she had",
            "would she",
            "she did"
          ]
        },
        {
          "corr": "be resting",
          "dist": [
            "rest",
            "rested",
            "rests",
            "to rest"
          ]
        },
        {
          "corr": "at home now.",
          "dist": [
            "in home now.",
            "to home now.",
            "home now at.",
            "for home now."
          ]
        }
      ]
    },
    {
      "prompt": "Had we known",
      "trans": "اگر می‌دانستیم جاده بسته است، الان در ترافیک نبودیم.",
      "steps": [
        {
          "corr": "about the closure,",
          "dist": [
            "of the closure,",
            "at closure the,",
            "with the closure,",
            "for closure the,"
          ]
        },
        {
          "corr": "we would",
          "dist": [
            "we will",
            "we had",
            "would we",
            "we did"
          ]
        },
        {
          "corr": "not be stuck",
          "dist": [
            "be not stuck",
            "not be stick",
            "not stuck be",
            "no be stuck"
          ]
        },
        {
          "corr": "in traffic",
          "dist": [
            "at traffic",
            "on traffic",
            "with traffic",
            "for traffic"
          ]
        },
        {
          "corr": "today.",
          "dist": [
            "in today.",
            "at today.",
            "on today.",
            "for today."
          ]
        }
      ]
    },
    {
      "prompt": "If you were",
      "trans": "اگر گواهینامه داشتی، دیروز ماشین را به تو قرض می‌دادم.",
      "steps": [
        {
          "corr": "a licensed driver,",
          "dist": [
            "licensed a driver,",
            "driver licensed a,",
            "the licensed driver,",
            "a driver licensed,"
          ]
        },
        {
          "corr": "I would have",
          "dist": [
            "I will have",
            "I had",
            "would I have",
            "have I"
          ]
        },
        {
          "corr": "lent you",
          "dist": [
            "lend you",
            "lending you",
            "lent to you",
            "you lent"
          ]
        },
        {
          "corr": "my car",
          "dist": [
            "car my",
            "the car my",
            "a car my",
            "to car my"
          ]
        },
        {
          "corr": "yesterday.",
          "dist": [
            "in yesterday.",
            "at yesterday.",
            "on yesterday.",
            "for yesterday."
          ]
        }
      ]
    },
    {
      "prompt": "Had he not",
      "trans": "اگر او پاییز گذشته مصدوم نشده بود، الان در مسابقات قهرمانی بازی می‌کرد.",
      "steps": [
        {
          "corr": "hurt his knee,",
          "dist": [
            "hurt knee his,",
            "hurting his knee,",
            "hurts his knee,",
            "hurted his knee,"
          ]
        },
        {
          "corr": "he would",
          "dist": [
            "he will",
            "he had",
            "would he",
            "he did"
          ]
        },
        {
          "corr": "be playing",
          "dist": [
            "play",
            "played",
            "plays",
            "to play"
          ]
        },
        {
          "corr": "in the finals",
          "dist": [
            "at the finals",
            "on finals the",
            "to the finals",
            "for finals the"
          ]
        },
        {
          "corr": "this week.",
          "dist": [
            "in this week.",
            "at week this.",
            "on week this.",
            "for week."
          ]
        }
      ]
    }
  ],
  "10": [
    {
      "prompt": "The thief",
      "trans": "گفته می‌شود که سارق هفته گذشته به خارج از کشور گریخته است.",
      "steps": [
        {
          "corr": "is believed",
          "dist": [
            "believes",
            "believed is",
            "is believe",
            "believing is"
          ]
        },
        {
          "corr": "to have escaped",
          "dist": [
            "to escape",
            "having escaped",
            "to had escaped",
            "for escaping"
          ],
          "trap": {
            "text": "to escape",
            "exp": "برای رویدادی که در گذشته انجام شده، مصدر کامل to have + P.P. الزامی است."
          }
        },
        {
          "corr": "abroad",
          "dist": [
            "to abroad",
            "in abroad",
            "at abroad",
            "for abroad"
          ]
        },
        {
          "corr": "last week",
          "dist": [
            "in last week",
            "at last week",
            "on last week",
            "for last week"
          ]
        },
        {
          "corr": "by boat.",
          "dist": [
            "with boat.",
            "in boat.",
            "on boat.",
            "at boat."
          ]
        }
      ]
    },
    {
      "prompt": "He was",
      "trans": "گزارش شد که او بدون اطلاع قبلی از سمت خود استعفا داده است.",
      "steps": [
        {
          "corr": "reported",
          "dist": [
            "report",
            "reporting",
            "reports",
            "to report"
          ]
        },
        {
          "corr": "to have resigned",
          "dist": [
            "to resign",
            "resigning",
            "to had resigned",
            "for resigning"
          ]
        },
        {
          "corr": "from his post",
          "dist": [
            "of his post",
            "at post his",
            "with his post",
            "in his post"
          ]
        },
        {
          "corr": "without warning",
          "dist": [
            "with no warning",
            "with not warning",
            "except warning",
            "unless warning"
          ]
        },
        {
          "corr": "yesterday.",
          "dist": [
            "in yesterday.",
            "at yesterday.",
            "on yesterday.",
            "for yesterday."
          ]
        }
      ]
    },
    {
      "prompt": "We had",
      "trans": "ما قبل از شروع سفر جاده‌ای، ماشین را در تعمیرگاه سرویس کردیم.",
      "steps": [
        {
          "corr": "our car",
          "dist": [
            "car our",
            "the our car",
            "a car our",
            "to car"
          ]
        },
        {
          "corr": "serviced",
          "dist": [
            "service",
            "servicing",
            "services",
            "to service"
          ],
          "trap": {
            "text": "service",
            "exp": "در ساختار سببی had + مفعول + قسمت سوم فعل (serviced) به کار می‌رود."
          }
        },
        {
          "corr": "at a garage",
          "dist": [
            "in garage a",
            "to a garage",
            "on garage a",
            "for a garage"
          ]
        },
        {
          "corr": "before the trip",
          "dist": [
            "ahead the trip",
            "prior the trip",
            "before of trip",
            "in front of trip"
          ]
        },
        {
          "corr": "began.",
          "dist": [
            "begin.",
            "begun.",
            "beginning.",
            "begins."
          ]
        }
      ]
    },
    {
      "prompt": "The old house",
      "trans": "دیوارهای این خانه قدیمی قبل از زمستان نیاز به رنگ‌آمیزی دارند.",
      "steps": [
        {
          "corr": "needs",
          "dist": [
            "is needing",
            "need",
            "needed",
            "to need"
          ]
        },
        {
          "corr": "painting",
          "dist": [
            "to paint",
            "painted",
            "paints",
            "paint"
          ],
          "trap": {
            "text": "to paint",
            "exp": "بعد از need برای مفاهیم مجهول، شکل ing به کار می‌رود (needs painting = needs to be painted)."
          }
        },
        {
          "corr": "before winter",
          "dist": [
            "ahead winter",
            "prior winter",
            "before of winter",
            "in front of winter"
          ]
        },
        {
          "corr": "arrives",
          "dist": [
            "arrive",
            "arriving",
            "arrived",
            "to arrive"
          ]
        },
        {
          "corr": "this year.",
          "dist": [
            "in this year.",
            "at year this.",
            "on year this.",
            "for year."
          ]
        }
      ]
    },
    {
      "prompt": "The lost puppy",
      "trans": "سگ گمشده دیده شد که خوشحال در پارک می‌دوید.",
      "steps": [
        {
          "corr": "was seen",
          "dist": [
            "saw",
            "seen was",
            "was saw",
            "is seen"
          ]
        },
        {
          "corr": "running happily",
          "dist": [
            "run happily",
            "ran happily",
            "running happy",
            "to run happy"
          ]
        },
        {
          "corr": "in the park",
          "dist": [
            "at park the",
            "to the park",
            "on park the",
            "for park the"
          ]
        },
        {
          "corr": "by a child",
          "dist": [
            "with a child",
            "from a child",
            "at a child",
            "of a child"
          ]
        },
        {
          "corr": "this morning.",
          "dist": [
            "in this morning.",
            "at morning this.",
            "on morning this.",
            "for morning."
          ]
        }
      ]
    },
    {
      "prompt": "She got",
      "trans": "او دیروز کلیدهای یدک را در بازار کلیدسازی تکثیر کرد.",
      "steps": [
        {
          "corr": "her keys",
          "dist": [
            "keys her",
            "the her keys",
            "a keys her",
            "to keys"
          ]
        },
        {
          "corr": "copied",
          "dist": [
            "copy",
            "copying",
            "copies",
            "to copy"
          ]
        },
        {
          "corr": "at the shop",
          "dist": [
            "in shop the",
            "to the shop",
            "on shop the",
            "for shop the"
          ]
        },
        {
          "corr": "in five minutes",
          "dist": [
            "at five minutes",
            "on minutes five",
            "for five minutes",
            "with five minutes"
          ]
        },
        {
          "corr": "yesterday.",
          "dist": [
            "in yesterday.",
            "at yesterday.",
            "on yesterday.",
            "for yesterday."
          ]
        }
      ]
    },
    {
      "prompt": "The painting",
      "trans": "تصور می‌شود این نقاشی با ارزش بیش از دو قرن قدمت داشته باشد.",
      "steps": [
        {
          "corr": "is thought",
          "dist": [
            "thinks",
            "thought is",
            "is think",
            "thinking is"
          ]
        },
        {
          "corr": "to be",
          "dist": [
            "being",
            "been",
            "was",
            "to being"
          ]
        },
        {
          "corr": "over two hundred",
          "dist": [
            "above two hundred",
            "more two hundred",
            "over of two hundred",
            "two hundred over"
          ]
        },
        {
          "corr": "years old",
          "dist": [
            "old years",
            "years of old",
            "year old",
            "aged years"
          ]
        },
        {
          "corr": "today.",
          "dist": [
            "in today.",
            "at today.",
            "on today.",
            "for today."
          ]
        }
      ]
    },
    {
      "prompt": "He had",
      "trans": "او ساعتش را پیش یک ساعت‌ساز ماهر در مرکز شهر تعمیر کرد.",
      "steps": [
        {
          "corr": "his watch",
          "dist": [
            "watch his",
            "the his watch",
            "a watch his",
            "to watch"
          ]
        },
        {
          "corr": "repaired",
          "dist": [
            "repair",
            "repairing",
            "repairs",
            "to repair"
          ]
        },
        {
          "corr": "by an expert",
          "dist": [
            "with an expert",
            "from an expert",
            "at an expert",
            "of an expert"
          ]
        },
        {
          "corr": "in town",
          "dist": [
            "at town",
            "on town",
            "to town",
            "for town"
          ]
        },
        {
          "corr": "last Friday.",
          "dist": [
            "in last Friday.",
            "at Friday last.",
            "on last Friday.",
            "for Friday."
          ]
        }
      ]
    },
    {
      "prompt": "The missing",
      "trans": "گفته می‌شود مدارک گم‌شده در آرشیو زیرزمین پیدا شده است.",
      "steps": [
        {
          "corr": "papers are",
          "dist": [
            "papers is",
            "paper are",
            "papers were",
            "are papers"
          ]
        },
        {
          "corr": "said to have",
          "dist": [
            "said to",
            "say to have",
            "said having",
            "saying to have"
          ]
        },
        {
          "corr": "been found",
          "dist": [
            "found been",
            "being found",
            "found",
            "to find"
          ]
        },
        {
          "corr": "in the basement",
          "dist": [
            "at basement the",
            "to the basement",
            "on basement the",
            "for basement the"
          ]
        },
        {
          "corr": "this afternoon.",
          "dist": [
            "in this afternoon.",
            "at afternoon this.",
            "on afternoon this.",
            "for afternoon."
          ]
        }
      ]
    },
    {
      "prompt": "Your hair",
      "trans": "موهایت قبل از عروسی آخر هفته نیاز به کوتاه شدن دارد.",
      "steps": [
        {
          "corr": "needs",
          "dist": [
            "is needing",
            "need",
            "needed",
            "to need"
          ]
        },
        {
          "corr": "cutting",
          "dist": [
            "to cut",
            "cut",
            "cuts",
            "cutting to"
          ]
        },
        {
          "corr": "before the wedding",
          "dist": [
            "ahead wedding the",
            "prior wedding the",
            "before of wedding",
            "in front of wedding"
          ]
        },
        {
          "corr": "this weekend",
          "dist": [
            "in this weekend",
            "at weekend this",
            "on weekend this",
            "for weekend"
          ]
        },
        {
          "corr": "for sure.",
          "dist": [
            "with sure.",
            "in sure.",
            "to sure.",
            "by sure."
          ]
        }
      ]
    },
    {
      "prompt": "The castle",
      "trans": "گفته می‌شود این قلعه قدیمی متعلق به قرن شانزدهم میلادی است.",
      "steps": [
        {
          "corr": "is said",
          "dist": [
            "says",
            "said is",
            "is say",
            "saying is"
          ]
        },
        {
          "corr": "to date back",
          "dist": [
            "to date",
            "dating back",
            "to dated back",
            "dated back"
          ]
        },
        {
          "corr": "to the sixteenth",
          "dist": [
            "at sixteenth the",
            "in the sixteenth",
            "for sixteenth the",
            "on sixteenth the"
          ]
        },
        {
          "corr": "century",
          "dist": [
            "centuries",
            "centuried",
            "century's",
            "to century"
          ]
        },
        {
          "corr": "in history.",
          "dist": [
            "at history.",
            "on history.",
            "for history.",
            "with history."
          ]
        }
      ]
    },
    {
      "prompt": "I will get",
      "trans": "من قبل از اینکه از فرودگاه راه بیفتم، چمدان‌هایم را تحویل خواهم گرفت.",
      "steps": [
        {
          "corr": "my bags",
          "dist": [
            "bags my",
            "the my bags",
            "a bags my",
            "to bags"
          ]
        },
        {
          "corr": "checked",
          "dist": [
            "check",
            "checking",
            "checks",
            "to check"
          ]
        },
        {
          "corr": "at the desk",
          "dist": [
            "in desk the",
            "to the desk",
            "on desk the",
            "for desk the"
          ]
        },
        {
          "corr": "before leaving",
          "dist": [
            "ahead leave",
            "prior leaving",
            "before leave",
            "before to leave"
          ]
        },
        {
          "corr": "the terminal.",
          "dist": [
            "terminal the.",
            "a terminal.",
            "terminals the.",
            "to terminal."
          ]
        }
      ]
    },
    {
      "prompt": "The athlete",
      "trans": "انتظار می‌رود این ورزشکار در مسابقه فردا مدال طلا را از آن خود کند.",
      "steps": [
        {
          "corr": "is expected",
          "dist": [
            "expects",
            "expected is",
            "is expect",
            "expecting is"
          ]
        },
        {
          "corr": "to win",
          "dist": [
            "winning",
            "won",
            "to won",
            "wins"
          ]
        },
        {
          "corr": "the gold",
          "dist": [
            "gold the",
            "a gold",
            "golds the",
            "to gold"
          ]
        },
        {
          "corr": "medal tomorrow",
          "dist": [
            "in tomorrow medal",
            "at medal tomorrow",
            "tomorrow medal",
            "for medal tomorrow"
          ]
        },
        {
          "corr": "in the race.",
          "dist": [
            "at race the.",
            "on the race.",
            "to race the.",
            "with race the."
          ]
        }
      ]
    },
    {
      "prompt": "We must have",
      "trans": "ما باید قبل از مهمانی امشب پنجره‌ها را کاملاً تمیز کنیم.",
      "steps": [
        {
          "corr": "the windows",
          "dist": [
            "windows the",
            "a windows",
            "window the",
            "to windows"
          ]
        },
        {
          "corr": "cleaned",
          "dist": [
            "clean",
            "cleaning",
            "cleans",
            "to clean"
          ]
        },
        {
          "corr": "before our guests",
          "dist": [
            "ahead guests our",
            "prior guests our",
            "before of guests",
            "in front of guests"
          ]
        },
        {
          "corr": "arrive",
          "dist": [
            "arrived",
            "arriving",
            "arrives",
            "to arrive"
          ]
        },
        {
          "corr": "this evening.",
          "dist": [
            "in this evening.",
            "at evening this.",
            "on evening this.",
            "for evening."
          ]
        }
      ]
    },
    {
      "prompt": "The kitchen",
      "trans": "شیر آشپزخانه چکه می‌کند و نیاز به تعمیر فوری دارد.",
      "steps": [
        {
          "corr": "tap needs",
          "dist": [
            "tap need",
            "tap is needing",
            "tap needed",
            "needs tap"
          ]
        },
        {
          "corr": "fixing",
          "dist": [
            "to fix",
            "fixed",
            "fixes",
            "fix"
          ]
        },
        {
          "corr": "before it leaks",
          "dist": [
            "ahead leaks it",
            "prior leaks it",
            "before it leak",
            "before leaking it"
          ]
        },
        {
          "corr": "more water",
          "dist": [
            "water more",
            "much water",
            "many water",
            "most water"
          ]
        },
        {
          "corr": "on the floor.",
          "dist": [
            "in the floor.",
            "at floor the.",
            "to floor the.",
            "with floor the."
          ]
        }
      ]
    },
    {
      "prompt": "He was seen",
      "trans": "او دیده شد که بدون خداحافظی جلسه را ترک کرد.",
      "steps": [
        {
          "corr": "leaving",
          "dist": [
            "left",
            "leave",
            "leaves",
            "to leave"
          ]
        },
        {
          "corr": "the meeting room",
          "dist": [
            "room meeting the",
            "the room meeting",
            "a meeting room",
            "meeting the room"
          ]
        },
        {
          "corr": "without a word",
          "dist": [
            "with no word",
            "with not word",
            "except a word",
            "unless a word"
          ]
        },
        {
          "corr": "to anyone",
          "dist": [
            "at anyone",
            "with anyone",
            "for anyone",
            "by anyone"
          ]
        },
        {
          "corr": "yesterday.",
          "dist": [
            "in yesterday.",
            "at yesterday.",
            "on yesterday.",
            "for yesterday."
          ]
        }
      ]
    },
    {
      "prompt": "She had",
      "trans": "او یک پیراهن زیبا را برای مراسم عروسی دوخت.",
      "steps": [
        {
          "corr": "a dress",
          "dist": [
            "dress a",
            "the dress",
            "dresses a",
            "to dress"
          ]
        },
        {
          "corr": "made",
          "dist": [
            "make",
            "making",
            "makes",
            "to make"
          ]
        },
        {
          "corr": "by a tailor",
          "dist": [
            "with a tailor",
            "from a tailor",
            "at tailor a",
            "of a tailor"
          ]
        },
        {
          "corr": "for the party",
          "dist": [
            "to the party",
            "at party the",
            "in party the",
            "with party the"
          ]
        },
        {
          "corr": "last month.",
          "dist": [
            "in last month.",
            "at month last.",
            "on last month.",
            "for month."
          ]
        }
      ]
    },
    {
      "prompt": "The project is",
      "trans": "گفته می‌شود این پروژه تا پایان سال جاری تکمیل خواهد شد.",
      "steps": [
        {
          "corr": "believed to be",
          "dist": [
            "believed being",
            "believe to be",
            "believed been",
            "believing to be"
          ]
        },
        {
          "corr": "on schedule",
          "dist": [
            "in schedule",
            "at schedule",
            "to schedule",
            "for schedule"
          ]
        },
        {
          "corr": "for completion",
          "dist": [
            "to completion",
            "at completion",
            "with completion",
            "in completion"
          ]
        },
        {
          "corr": "by December",
          "dist": [
            "until December",
            "since December",
            "at December",
            "in December"
          ]
        },
        {
          "corr": "this year.",
          "dist": [
            "in this year.",
            "at year this.",
            "on year this.",
            "for year."
          ]
        }
      ]
    },
    {
      "prompt": "I got",
      "trans": "من مدارک شناسایی‌ام را در اداره پست تایید کردم.",
      "steps": [
        {
          "corr": "my documents",
          "dist": [
            "documents my",
            "the documents my",
            "a documents my",
            "to documents"
          ]
        },
        {
          "corr": "signed",
          "dist": [
            "sign",
            "signing",
            "signs",
            "to sign"
          ]
        },
        {
          "corr": "at the office",
          "dist": [
            "in office the",
            "to the office",
            "on office the",
            "for office the"
          ]
        },
        {
          "corr": "without delay",
          "dist": [
            "with no delay",
            "with not delay",
            "except delay",
            "unless delay"
          ]
        },
        {
          "corr": "this morning.",
          "dist": [
            "in this morning.",
            "at morning this.",
            "on morning this.",
            "for morning."
          ]
        }
      ]
    },
    {
      "prompt": "The roof",
      "trans": "سقف خانه پس از طوفان دیشب نیاز به بازرسی دارد.",
      "steps": [
        {
          "corr": "needs",
          "dist": [
            "is needing",
            "need",
            "needed",
            "to need"
          ]
        },
        {
          "corr": "checking",
          "dist": [
            "to check",
            "checked",
            "checks",
            "check"
          ]
        },
        {
          "corr": "after the heavy",
          "dist": [
            "before the heavy",
            "at heavy the",
            "with heavy the",
            "during heavy the"
          ]
        },
        {
          "corr": "rain yesterday",
          "dist": [
            "in yesterday rain",
            "at rain yesterday",
            "yesterday rain",
            "rain in yesterday"
          ]
        },
        {
          "corr": "morning.",
          "dist": [
            "in morning.",
            "at morning.",
            "on morning.",
            "for morning."
          ]
        }
      ]
    }
  ]
};
