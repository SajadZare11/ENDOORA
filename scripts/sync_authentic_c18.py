import json
import re

authentic_listening_module = {
    "id": "c18-acad-t1-listening",
    "exam_id": "cambridge-18-academic-test-1",
    "skill": "listening",
    "duration_minutes": 35,
    "total_questions": 40,
    "audio_url": "/audio/ielts/c18_test1_listening.mp3",
    "sections": [
        {
            "id": "c18-acad-t1-l-sec1",
            "module_id": "c18-acad-t1-listening",
            "section_number": 1,
            "passage_title": "Transport Survey",
            "passage_content": "<div class='ielts-notes-card'><h3>Transport Survey Notes</h3><p><b>Name:</b> Sadie Jones<br><b>Year of birth:</b> 1991<br><b>Postcode:</b> [1]<br><br><b>Travelling by bus</b><br>• Date of bus journey: [2]<br>• Reason for trip: shopping and visit to the [3]<br>• Travelled by bus because cost of [4] too high<br>• Got on bus at [5] Street<br>• Complaints about bus service:<br>&nbsp;&nbsp;– bus today was [6]<br>&nbsp;&nbsp;– frequency of buses in the [7]<br><br><b>Travelling by car</b><br>• Goes to the [8] by car<br><br><b>Travelling by bicycle</b><br>• Dislikes travelling by bike in the city centre because of the [9]<br>• Doesn't own a bike because of a lack of [10]</p></div>",
            "transcript": "Official Cambridge 18 Test 1 Listening Part 1: Transport Survey interview with Sadie Jones.",
            "instructions": "Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer.",
            "questions": [
                {
                    "id": "c18-l-q1",
                    "section_id": "c18-acad-t1-l-sec1",
                    "question_number": 1,
                    "question_type": "fill_in_the_blank",
                    "prompt": "Postcode: [blank_1]",
                    "accepted_answers": ["DW30 7YZ", "DW307YZ"],
                    "explanation": "Sadie states her postcode clearly as DW30 7YZ."
                },
                {
                    "id": "c18-l-q2",
                    "section_id": "c18-acad-t1-l-sec1",
                    "question_number": 2,
                    "question_type": "fill_in_the_blank",
                    "prompt": "Date of bus journey: [blank_2]",
                    "accepted_answers": ["24th April", "24 April", "24th of April"],
                    "explanation": "Sadie confirms she travelled by bus on the 24th of April."
                },
                {
                    "id": "c18-l-q3",
                    "section_id": "c18-acad-t1-l-sec1",
                    "question_number": 3,
                    "question_type": "fill_in_the_blank",
                    "prompt": "Reason for trip: shopping and visit to the [blank_3]",
                    "accepted_answers": ["dentist"],
                    "explanation": "She had an appointment with the dentist."
                },
                {
                    "id": "c18-l-q4",
                    "section_id": "c18-acad-t1-l-sec1",
                    "question_number": 4,
                    "question_type": "fill_in_the_blank",
                    "prompt": "Travelled by bus because cost of [blank_4] too high",
                    "accepted_answers": ["parking"],
                    "explanation": "She mentions parking charges in town are far too high."
                },
                {
                    "id": "c18-l-q5",
                    "section_id": "c18-acad-t1-l-sec1",
                    "question_number": 5,
                    "question_type": "fill_in_the_blank",
                    "prompt": "Got on bus at [blank_5] Street",
                    "accepted_answers": ["Claxby", "claxby"],
                    "explanation": "She spells Claxby Street."
                },
                {
                    "id": "c18-l-q6",
                    "section_id": "c18-acad-t1-l-sec1",
                    "question_number": 6,
                    "question_type": "fill_in_the_blank",
                    "prompt": "Complaint: bus today was [blank_6]",
                    "accepted_answers": ["late"],
                    "explanation": "She complains that the bus was twenty minutes late."
                },
                {
                    "id": "c18-l-q7",
                    "section_id": "c18-acad-t1-l-sec1",
                    "question_number": 7,
                    "question_type": "fill_in_the_blank",
                    "prompt": "Complaint: frequency of buses in the [blank_7]",
                    "accepted_answers": ["evening", "evenings"],
                    "explanation": "She criticizes the poor bus frequency in the evening."
                },
                {
                    "id": "c18-l-q8",
                    "section_id": "c18-acad-t1-l-sec1",
                    "question_number": 8,
                    "question_type": "fill_in_the_blank",
                    "prompt": "Goes to the [blank_8] by car",
                    "accepted_answers": ["supermarket"],
                    "explanation": "She only uses the car for regular trips to the supermarket."
                },
                {
                    "id": "c18-l-q9",
                    "section_id": "c18-acad-t1-l-sec1",
                    "question_number": 9,
                    "question_type": "fill_in_the_blank",
                    "prompt": "Dislikes travelling by bike in the city centre because of the [blank_9]",
                    "accepted_answers": ["pollution"],
                    "explanation": "She avoids cycling in the center due to the vehicle exhaust pollution."
                },
                {
                    "id": "c18-l-q10",
                    "section_id": "c18-acad-t1-l-sec1",
                    "question_number": 10,
                    "question_type": "fill_in_the_blank",
                    "prompt": "Doesn't own a bike because of a lack of [blank_10]",
                    "accepted_answers": ["storage"],
                    "explanation": "She has no secure storage space for a bicycle in her flat."
                }
            ]
        },
        {
            "id": "c18-acad-t1-l-sec2",
            "module_id": "c18-acad-t1-listening",
            "section_number": 2,
            "passage_title": "Becoming a volunteer for ACE",
            "passage_content": "<div class='ielts-context-card'><h3>ACE Volunteering Programme</h3><p>An introductory talk given to prospective volunteers by a representative of the charity organisation ACE.</p></div>",
            "transcript": "Official Cambridge 18 Test 1 Listening Part 2: Volunteering with ACE.",
            "instructions": "Answer Questions 11–20. Choose the correct letter, A, B or C, or matching letters.",
            "questions": [
                {
                    "id": "c18-l-q11",
                    "section_id": "c18-acad-t1-l-sec2",
                    "question_number": 11,
                    "question_type": "multiple_choice",
                    "prompt": "Why does the speaker apologise about the seats?",
                    "options": [
                        {"id": "A", "text": "They are too small."},
                        {"id": "B", "text": "There are not enough of them."},
                        {"id": "C", "text": "Some of them are very close together."}
                    ],
                    "accepted_answers": ["C"],
                    "explanation": "Speaker mentions extra chairs were brought in, so people at the back may be squashed together."
                },
                {
                    "id": "c18-l-q12",
                    "section_id": "c18-acad-t1-l-sec2",
                    "question_number": 12,
                    "question_type": "multiple_choice",
                    "prompt": "What does the speaker say about the age of volunteers?",
                    "options": [
                        {"id": "A", "text": "The age of volunteers is less important than other factors."},
                        {"id": "B", "text": "Young volunteers are less reliable than older ones."},
                        {"id": "C", "text": "Most volunteers are about 60 years old."}
                    ],
                    "accepted_answers": ["A"],
                    "explanation": "Speaker clarifies that motivation matters far more than chronological age."
                },
                {
                    "id": "c18-l-q13",
                    "section_id": "c18-acad-t1-l-sec2",
                    "question_number": 13,
                    "question_type": "multiple_choice",
                    "prompt": "What does the speaker say about training?",
                    "options": [
                        {"id": "A", "text": "It is continuous."},
                        {"id": "B", "text": "It is conducted by a manager."},
                        {"id": "C", "text": "It takes place online."}
                    ],
                    "accepted_answers": ["A"],
                    "explanation": "Volunteers receive ongoing, continuous development rather than a one-off session."
                },
                {
                    "id": "c18-l-q14",
                    "section_id": "c18-acad-t1-l-sec2",
                    "question_number": 14,
                    "question_type": "multiple_choice",
                    "prompt": "Which TWO issues does the speaker ask the audience to consider before applying? (First choice)",
                    "options": [
                        {"id": "A", "text": "their financial situation"},
                        {"id": "B", "text": "their level of commitment"},
                        {"id": "C", "text": "their work experience"},
                        {"id": "D", "text": "their ambition"},
                        {"id": "E", "text": "their availability"}
                    ],
                    "accepted_answers": ["B", "E"],
                    "explanation": "Applicants must consider their reliability/commitment (B) and available time (E)."
                },
                {
                    "id": "c18-l-q15",
                    "section_id": "c18-acad-t1-l-sec2",
                    "question_number": 15,
                    "question_type": "multiple_choice",
                    "prompt": "Which TWO issues does the speaker ask the audience to consider before applying? (Second choice)",
                    "options": [
                        {"id": "A", "text": "their financial situation"},
                        {"id": "B", "text": "their level of commitment"},
                        {"id": "C", "text": "their work experience"},
                        {"id": "D", "text": "their ambition"},
                        {"id": "E", "text": "their availability"}
                    ],
                    "accepted_answers": ["B", "E"],
                    "explanation": "Applicants must consider their commitment and availability."
                },
                {
                    "id": "c18-l-q16",
                    "section_id": "c18-acad-t1-l-sec2",
                    "question_number": 16,
                    "question_type": "matching_features",
                    "prompt": "What helpful quality would assist: Fundraising",
                    "options": [
                        {"id": "A", "text": "experience on stage"},
                        {"id": "B", "text": "original, new ideas"},
                        {"id": "C", "text": "parenting skills"},
                        {"id": "D", "text": "an understanding of food and diet"},
                        {"id": "E", "text": "retail experience"},
                        {"id": "F", "text": "a good memory"},
                        {"id": "G", "text": "a good level of fitness"}
                    ],
                    "accepted_answers": ["B"],
                    "explanation": "Fundraising relies on fresh, novel and original ideas."
                },
                {
                    "id": "c18-l-q17",
                    "section_id": "c18-acad-t1-l-sec2",
                    "question_number": 17,
                    "question_type": "matching_features",
                    "prompt": "What helpful quality would assist: Litter collection",
                    "options": [
                        {"id": "A", "text": "experience on stage"},
                        {"id": "B", "text": "original, new ideas"},
                        {"id": "C", "text": "parenting skills"},
                        {"id": "D", "text": "an understanding of food and diet"},
                        {"id": "E", "text": "retail experience"},
                        {"id": "F", "text": "a good memory"},
                        {"id": "G", "text": "a good level of fitness"}
                    ],
                    "accepted_answers": ["G"],
                    "explanation": "Requires stamina and physical fitness."
                },
                {
                    "id": "c18-l-q18",
                    "section_id": "c18-acad-t1-l-sec2",
                    "question_number": 18,
                    "question_type": "matching_features",
                    "prompt": "What helpful quality would assist: 'Playmates'",
                    "options": [
                        {"id": "A", "text": "experience on stage"},
                        {"id": "B", "text": "original, new ideas"},
                        {"id": "C", "text": "parenting skills"},
                        {"id": "D", "text": "an understanding of food and diet"},
                        {"id": "E", "text": "retail experience"},
                        {"id": "F", "text": "a good memory"},
                        {"id": "G", "text": "a good level of fitness"}
                    ],
                    "accepted_answers": ["D"],
                    "explanation": "Assisting with snacks requires nutritional knowledge."
                },
                {
                    "id": "c18-l-q19",
                    "section_id": "c18-acad-t1-l-sec2",
                    "question_number": 19,
                    "question_type": "matching_features",
                    "prompt": "What helpful quality would assist: Story club",
                    "options": [
                        {"id": "A", "text": "experience on stage"},
                        {"id": "B", "text": "original, new ideas"},
                        {"id": "C", "text": "parenting skills"},
                        {"id": "D", "text": "an understanding of food and diet"},
                        {"id": "E", "text": "retail experience"},
                        {"id": "F", "text": "a good memory"},
                        {"id": "G", "text": "a good level of fitness"}
                    ],
                    "accepted_answers": ["A"],
                    "explanation": "Performing and storytelling benefits from acting / stage experience."
                },
                {
                    "id": "c18-l-q20",
                    "section_id": "c18-acad-t1-l-sec2",
                    "question_number": 20,
                    "question_type": "matching_features",
                    "prompt": "What helpful quality would assist: First aid",
                    "options": [
                        {"id": "A", "text": "experience on stage"},
                        {"id": "B", "text": "original, new ideas"},
                        {"id": "C", "text": "parenting skills"},
                        {"id": "D", "text": "an understanding of food and diet"},
                        {"id": "E", "text": "retail experience"},
                        {"id": "F", "text": "a good memory"},
                        {"id": "G", "text": "a good level of fitness"}
                    ],
                    "accepted_answers": ["F"],
                    "explanation": "Recalling emergency procedures requires a reliable memory."
                }
            ]
        },
        {
            "id": "c18-acad-t1-l-sec3",
            "module_id": "c18-acad-t1-listening",
            "section_number": 3,
            "passage_title": "Discussion on Careers in Fashion Design",
            "passage_content": "<div class='ielts-context-card'><h3>Fashion Design Careers Review</h3><p>Two fashion design undergraduates, Hugo and Chantal, analyze the keynote speech given by a guest industry professional.</p></div>",
            "transcript": "Official Cambridge 18 Test 1 Listening Part 3: Hugo and Chantal discuss fashion careers.",
            "instructions": "Answer Questions 21–30 based on the conversation between Hugo and Chantal.",
            "questions": [
                {
                    "id": "c18-l-q21",
                    "section_id": "c18-acad-t1-l-sec3",
                    "question_number": 21,
                    "question_type": "multiple_choice",
                    "prompt": "What problem did Chantal have at the start of the talk?",
                    "options": [
                        {"id": "A", "text": "Her view of the speaker was blocked."},
                        {"id": "B", "text": "She was unable to find an empty seat."},
                        {"id": "C", "text": "The students next to her were talking."}
                    ],
                    "accepted_answers": ["A"],
                    "explanation": "A tall audience member sat right in front of her."
                },
                {
                    "id": "c18-l-q22",
                    "section_id": "c18-acad-t1-l-sec2",
                    "question_number": 22,
                    "question_type": "multiple_choice",
                    "prompt": "What were Hugo and Chantal surprised to hear about the job market?",
                    "options": [
                        {"id": "A", "text": "It has become more competitive than it used to be."},
                        {"id": "B", "text": "There is more variety in it than they had realised."},
                        {"id": "C", "text": "Some areas of it are more exciting than others."}
                    ],
                    "accepted_answers": ["B"],
                    "explanation": "They were astonished by the wide variety of niche careers."
                },
                {
                    "id": "c18-l-q23",
                    "section_id": "c18-acad-t1-l-sec3",
                    "question_number": 23,
                    "question_type": "multiple_choice",
                    "prompt": "Hugo and Chantal agree that the speaker's message was...",
                    "options": [
                        {"id": "A", "text": "unfair to them at times."},
                        {"id": "B", "text": "hard for them to follow."},
                        {"id": "C", "text": "critical of the industry."}
                    ],
                    "accepted_answers": ["A"],
                    "explanation": "They felt the speaker's tough tone was slightly unfair to first-year students."
                },
                {
                    "id": "c18-l-q24",
                    "section_id": "c18-acad-t1-l-sec3",
                    "question_number": 24,
                    "question_type": "multiple_choice",
                    "prompt": "What do Hugo and Chantal criticise about their school careers advice?",
                    "options": [
                        {"id": "A", "text": "when they received the advice."},
                        {"id": "B", "text": "how much advice was given."},
                        {"id": "C", "text": "who gave the advice."}
                    ],
                    "accepted_answers": ["C"],
                    "explanation": "School advisors had zero practical creative industry background."
                },
                {
                    "id": "c18-l-q25",
                    "section_id": "c18-acad-t1-l-sec3",
                    "question_number": 25,
                    "question_type": "multiple_choice",
                    "prompt": "When discussing their future, Hugo and Chantal disagree on...",
                    "options": [
                        {"id": "A", "text": "which is the best career in fashion."},
                        {"id": "B", "text": "when to choose a career in fashion."},
                        {"id": "C", "text": "why they would like a career in fashion."}
                    ],
                    "accepted_answers": ["B"],
                    "explanation": "Hugo prefers specializing early while Chantal wants to wait."
                },
                {
                    "id": "c18-l-q26",
                    "section_id": "c18-acad-t1-l-sec3",
                    "question_number": 26,
                    "question_type": "multiple_choice",
                    "prompt": "How does Hugo feel about being an unpaid assistant?",
                    "options": [
                        {"id": "A", "text": "He is realistic about the practice."},
                        {"id": "B", "text": "He is disappointed by the reality."},
                        {"id": "C", "text": "He is hopeful it will change soon."}
                    ],
                    "accepted_answers": ["A"],
                    "explanation": "Hugo accepts unpaid internships as an unavoidable reality of entering the trade."
                },
                {
                    "id": "c18-l-q27",
                    "section_id": "c18-acad-t1-l-sec3",
                    "question_number": 27,
                    "question_type": "multiple_choice",
                    "prompt": "Which TWO mistakes did the speaker admit making in her first job? (First choice)",
                    "options": [
                        {"id": "A", "text": "arguing with colleagues"},
                        {"id": "B", "text": "paying too much attention to how she looked"},
                        {"id": "C", "text": "refusing to do overtime"},
                        {"id": "D", "text": "ignoring feedback from her manager"},
                        {"id": "E", "text": "openly disliking her client"}
                    ],
                    "accepted_answers": ["B", "E"],
                    "explanation": "She focused excessively on wardrobe and clashed openly with a client."
                },
                {
                    "id": "c18-l-q28",
                    "section_id": "c18-acad-t1-l-sec3",
                    "question_number": 28,
                    "question_type": "multiple_choice",
                    "prompt": "Which TWO mistakes did the speaker admit making in her first job? (Second choice)",
                    "options": [
                        {"id": "A", "text": "arguing with colleagues"},
                        {"id": "B", "text": "paying too much attention to how she looked"},
                        {"id": "C", "text": "refusing to do overtime"},
                        {"id": "D", "text": "ignoring feedback from her manager"},
                        {"id": "E", "text": "openly disliking her client"}
                    ],
                    "accepted_answers": ["B", "E"],
                    "explanation": "Admitted wardrobe obsession and showing dislike for a client."
                },
                {
                    "id": "c18-l-q29",
                    "section_id": "c18-acad-t1-l-sec3",
                    "question_number": 29,
                    "question_type": "multiple_choice",
                    "prompt": "Which TWO pieces of retail information do Hugo and Chantal agree would be useful? (First choice)",
                    "options": [
                        {"id": "A", "text": "the reasons people return fashion items"},
                        {"id": "B", "text": "the average price customers pay for clothes"},
                        {"id": "C", "text": "fashion designs people want but can't find"},
                        {"id": "D", "text": "which brand names customers prefer"},
                        {"id": "E", "text": "how seasons affect clothing choices"}
                    ],
                    "accepted_answers": ["A", "C"],
                    "explanation": "Return statistics (A) and unfulfilled consumer design demand (C)."
                },
                {
                    "id": "c18-l-q30",
                    "section_id": "c18-acad-t1-l-sec3",
                    "question_number": 30,
                    "question_type": "multiple_choice",
                    "prompt": "Which TWO pieces of retail information do Hugo and Chantal agree would be useful? (Second choice)",
                    "options": [
                        {"id": "A", "text": "the reasons people return fashion items"},
                        {"id": "B", "text": "the average price customers pay for clothes"},
                        {"id": "C", "text": "fashion designs people want but can't find"},
                        {"id": "D", "text": "which brand names customers prefer"},
                        {"id": "E", "text": "how seasons affect clothing choices"}
                    ],
                    "accepted_answers": ["A", "C"],
                    "explanation": "Return statistics and unmet design demands."
                }
            ]
        },
        {
            "id": "c18-acad-t1-l-sec4",
            "module_id": "c18-acad-t1-listening",
            "section_number": 4,
            "passage_title": "Elephant Translocation",
            "passage_content": "<div class='ielts-notes-card'><h3>Elephant translocation</h3><p><b>Reasons for overpopulation at Majete National Park</b><br>• strict enforcement of anti-poaching laws<br>• successful breeding<br><br><b>Problems caused by elephant overpopulation</b><br>• greater competition, causing hunger for elephants<br>• damage to [31] in the park<br><br><b>The translocation process</b><br>• a suitable group of elephants from the same [32] was selected<br>• vets and park staff made use of [33] to help guide the elephants into an open plain<br>• elephants were immobilised with tranquilisers<br>&nbsp;&nbsp;– this process had to be completed quickly to reduce [34]<br>&nbsp;&nbsp;– elephants had to be turned on their [35] to avoid damage to their lungs<br>&nbsp;&nbsp;– elephants' [36] had to be monitored constantly<br>&nbsp;&nbsp;– tracking devices were fitted to the matriarchs<br>&nbsp;&nbsp;– data including the size of their tusks and [37] was taken<br>• elephants were taken by truck to their new reserve<br><br><b>Benefits for local community</b><br>• provided local [38]<br>• reduced dangers from weapons and [39]<br>• increase in local [40]</p></div>",
            "transcript": "Official Cambridge 18 Test 1 Listening Part 4: Lecture on Elephant Translocation.",
            "instructions": "Complete the notes below. Write ONE WORD ONLY for each answer.",
            "questions": [
                {
                    "id": "c18-l-q31",
                    "section_id": "c18-acad-t1-l-sec4",
                    "question_number": 31,
                    "question_type": "fill_in_the_blank",
                    "prompt": "Damage to [blank_31] in the park",
                    "accepted_answers": ["fences"],
                    "explanation": "Elephants broke park boundary fences."
                },
                {
                    "id": "c18-l-q32",
                    "section_id": "c18-acad-t1-l-sec4",
                    "question_number": 32,
                    "question_type": "fill_in_the_blank",
                    "prompt": "A suitable group of elephants from the same [blank_32] was selected",
                    "accepted_answers": ["family"],
                    "explanation": "Staff chose elephants belonging to the same family unit."
                },
                {
                    "id": "c18-l-q33",
                    "section_id": "c18-acad-t1-l-sec4",
                    "question_number": 33,
                    "question_type": "fill_in_the_blank",
                    "prompt": "Vets and park staff made use of [blank_33] to guide elephants",
                    "accepted_answers": ["helicopters"],
                    "explanation": "Helicopters were deployed to herd them to open terrain."
                },
                {
                    "id": "c18-l-q34",
                    "section_id": "c18-acad-t1-l-sec4",
                    "question_number": 34,
                    "question_type": "fill_in_the_blank",
                    "prompt": "Immobilisation completed quickly to reduce [blank_34]",
                    "accepted_answers": ["stress"],
                    "explanation": "Fast darting was essential to minimize physical and mental stress."
                },
                {
                    "id": "c18-l-q35",
                    "section_id": "c18-acad-t1-l-sec4",
                    "question_number": 35,
                    "question_type": "fill_in_the_blank",
                    "prompt": "Elephants had to be turned on their [blank_35] to avoid damage to lungs",
                    "accepted_answers": ["sides"],
                    "explanation": "They were positioned on their sides to prevent chest compression."
                },
                {
                    "id": "c18-l-q36",
                    "section_id": "c18-acad-t1-l-sec4",
                    "question_number": 36,
                    "question_type": "fill_in_the_blank",
                    "prompt": "Elephants' [blank_36] had to be monitored constantly",
                    "accepted_answers": ["breathing"],
                    "explanation": "Vets tracked respiration and breathing rates continuously."
                },
                {
                    "id": "c18-l-q37",
                    "section_id": "c18-acad-t1-l-sec4",
                    "question_number": 37,
                    "question_type": "fill_in_the_blank",
                    "prompt": "Data recorded included the size of tusks and [blank_37]",
                    "accepted_answers": ["feet"],
                    "explanation": "Foot measurements and tusk metrics were recorded."
                },
                {
                    "id": "c18-l-q38",
                    "section_id": "c18-acad-t1-l-sec4",
                    "question_number": 38,
                    "question_type": "fill_in_the_blank",
                    "prompt": "Community benefit: provided local [blank_38]",
                    "accepted_answers": ["employment", "jobs"],
                    "explanation": "Reserve generated stable employment for neighboring villages."
                },
                {
                    "id": "c18-l-q39",
                    "section_id": "c18-acad-t1-l-sec4",
                    "question_number": 39,
                    "question_type": "fill_in_the_blank",
                    "prompt": "Threat reduction: fewer weapons and [blank_39]",
                    "accepted_answers": ["snares", "weapons"],
                    "explanation": "Rangers removed illegal snares and firearms."
                },
                {
                    "id": "c18-l-q40",
                    "section_id": "c18-acad-t1-l-sec4",
                    "question_number": 40,
                    "question_type": "fill_in_the_blank",
                    "prompt": "Economic impact: significant increase in local [blank_40]",
                    "accepted_answers": ["tourism"],
                    "explanation": "Safari wildlife tourism expanded dramatically."
                }
            ]
        }
    ]
}

# 1. Update ielts-mock-exams.json
JSON_PATH = r"E:\0\Work\Website\The General Website\Endoora\apps\web\data\ielts\ielts-mock-exams.json"
with open(JSON_PATH, "r", encoding="utf-8") as f:
    exams = json.load(f)

for ex in exams:
    if ex["id"] == "c18-acad-t1":
        for i, m in enumerate(ex["modules"]):
            if m["skill"] == "listening":
                ex["modules"][i] = authentic_listening_module
                print("Updated c18-acad-t1 listening in json!")

with open(JSON_PATH, "w", encoding="utf-8") as f:
    json.dump(exams, f, indent=2, ensure_ascii=False)
print("Saved json successfully!")

# 2. Update mock-test-1-acad.ts
TS_PATH = r"E:\0\Work\Website\The General Website\Endoora\apps\web\data\ielts\mock-test-1-acad.ts"
with open(TS_PATH, "r", encoding="utf-8") as f:
    content = f.read()

# Replace the listening module in TS file
# Find where MODULE 1: LISTENING starts and MODULE 2: READING starts
m1_idx = content.find("// MODULE 1: LISTENING")
m2_idx = content.find("// MODULE 2: READING")

if m1_idx != -1 and m2_idx != -1:
    ts_json = json.dumps(authentic_listening_module, indent=6, ensure_ascii=False)
    new_m1 = f"// MODULE 1: LISTENING (40 Questions - Authentic Cambridge 18 Test 1)\n    {ts_json},\n    "
    new_content = content[:m1_idx] + new_m1 + content[m2_idx:]
    with open(TS_PATH, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Updated mock-test-1-acad.ts successfully!")
else:
    print("Could not find markers in mock-test-1-acad.ts")
