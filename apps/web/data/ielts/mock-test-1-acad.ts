import type { IeltsExam } from "@endoora/contracts";

export const CAMBRIDGE_18_ACADEMIC_TEST_1: IeltsExam = {
  id: "cambridge-18-academic-test-1",
  title: "Cambridge IELTS 18 - Academic Practice Test 1",
  category: "Academic",
  source: "Cambridge",
  description:
    "Standard computer-delivered Cambridge IELTS 18 Academic mock examination covering Listening (40 questions), Reading (40 questions), Writing (Tasks 1 & 2), and Speaking (Parts 1, 2, & 3).",
  total_duration_minutes: 165,
  created_at: "2026-01-15T08:00:00Z",
  updated_at: "2026-03-01T12:00:00Z",
  modules: [
    // -------------------------------------------------------------------------
    // MODULE 1: LISTENING (40 Questions - Authentic Cambridge 18 Test 1)
    {
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
                              "accepted_answers": [
                                    "DW30 7YZ",
                                    "DW307YZ"
                              ],
                              "explanation": "Sadie states her postcode clearly as DW30 7YZ."
                        },
                        {
                              "id": "c18-l-q2",
                              "section_id": "c18-acad-t1-l-sec1",
                              "question_number": 2,
                              "question_type": "fill_in_the_blank",
                              "prompt": "Date of bus journey: [blank_2]",
                              "accepted_answers": [
                                    "24th April",
                                    "24 April",
                                    "24th of April"
                              ],
                              "explanation": "Sadie confirms she travelled by bus on the 24th of April."
                        },
                        {
                              "id": "c18-l-q3",
                              "section_id": "c18-acad-t1-l-sec1",
                              "question_number": 3,
                              "question_type": "fill_in_the_blank",
                              "prompt": "Reason for trip: shopping and visit to the [blank_3]",
                              "accepted_answers": [
                                    "dentist"
                              ],
                              "explanation": "She had an appointment with the dentist."
                        },
                        {
                              "id": "c18-l-q4",
                              "section_id": "c18-acad-t1-l-sec1",
                              "question_number": 4,
                              "question_type": "fill_in_the_blank",
                              "prompt": "Travelled by bus because cost of [blank_4] too high",
                              "accepted_answers": [
                                    "parking"
                              ],
                              "explanation": "She mentions parking charges in town are far too high."
                        },
                        {
                              "id": "c18-l-q5",
                              "section_id": "c18-acad-t1-l-sec1",
                              "question_number": 5,
                              "question_type": "fill_in_the_blank",
                              "prompt": "Got on bus at [blank_5] Street",
                              "accepted_answers": [
                                    "Claxby",
                                    "claxby"
                              ],
                              "explanation": "She spells Claxby Street."
                        },
                        {
                              "id": "c18-l-q6",
                              "section_id": "c18-acad-t1-l-sec1",
                              "question_number": 6,
                              "question_type": "fill_in_the_blank",
                              "prompt": "Complaint: bus today was [blank_6]",
                              "accepted_answers": [
                                    "late"
                              ],
                              "explanation": "She complains that the bus was twenty minutes late."
                        },
                        {
                              "id": "c18-l-q7",
                              "section_id": "c18-acad-t1-l-sec1",
                              "question_number": 7,
                              "question_type": "fill_in_the_blank",
                              "prompt": "Complaint: frequency of buses in the [blank_7]",
                              "accepted_answers": [
                                    "evening",
                                    "evenings"
                              ],
                              "explanation": "She criticizes the poor bus frequency in the evening."
                        },
                        {
                              "id": "c18-l-q8",
                              "section_id": "c18-acad-t1-l-sec1",
                              "question_number": 8,
                              "question_type": "fill_in_the_blank",
                              "prompt": "Goes to the [blank_8] by car",
                              "accepted_answers": [
                                    "supermarket"
                              ],
                              "explanation": "She only uses the car for regular trips to the supermarket."
                        },
                        {
                              "id": "c18-l-q9",
                              "section_id": "c18-acad-t1-l-sec1",
                              "question_number": 9,
                              "question_type": "fill_in_the_blank",
                              "prompt": "Dislikes travelling by bike in the city centre because of the [blank_9]",
                              "accepted_answers": [
                                    "pollution"
                              ],
                              "explanation": "She avoids cycling in the center due to the vehicle exhaust pollution."
                        },
                        {
                              "id": "c18-l-q10",
                              "section_id": "c18-acad-t1-l-sec1",
                              "question_number": 10,
                              "question_type": "fill_in_the_blank",
                              "prompt": "Doesn't own a bike because of a lack of [blank_10]",
                              "accepted_answers": [
                                    "storage"
                              ],
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
                                    {
                                          "id": "A",
                                          "text": "They are too small."
                                    },
                                    {
                                          "id": "B",
                                          "text": "There are not enough of them."
                                    },
                                    {
                                          "id": "C",
                                          "text": "Some of them are very close together."
                                    }
                              ],
                              "accepted_answers": [
                                    "C"
                              ],
                              "explanation": "Speaker mentions extra chairs were brought in, so people at the back may be squashed together."
                        },
                        {
                              "id": "c18-l-q12",
                              "section_id": "c18-acad-t1-l-sec2",
                              "question_number": 12,
                              "question_type": "multiple_choice",
                              "prompt": "What does the speaker say about the age of volunteers?",
                              "options": [
                                    {
                                          "id": "A",
                                          "text": "The age of volunteers is less important than other factors."
                                    },
                                    {
                                          "id": "B",
                                          "text": "Young volunteers are less reliable than older ones."
                                    },
                                    {
                                          "id": "C",
                                          "text": "Most volunteers are about 60 years old."
                                    }
                              ],
                              "accepted_answers": [
                                    "A"
                              ],
                              "explanation": "Speaker clarifies that motivation matters far more than chronological age."
                        },
                        {
                              "id": "c18-l-q13",
                              "section_id": "c18-acad-t1-l-sec2",
                              "question_number": 13,
                              "question_type": "multiple_choice",
                              "prompt": "What does the speaker say about training?",
                              "options": [
                                    {
                                          "id": "A",
                                          "text": "It is continuous."
                                    },
                                    {
                                          "id": "B",
                                          "text": "It is conducted by a manager."
                                    },
                                    {
                                          "id": "C",
                                          "text": "It takes place online."
                                    }
                              ],
                              "accepted_answers": [
                                    "A"
                              ],
                              "explanation": "Volunteers receive ongoing, continuous development rather than a one-off session."
                        },
                        {
                              "id": "c18-l-q14",
                              "section_id": "c18-acad-t1-l-sec2",
                              "question_number": 14,
                              "question_type": "multiple_choice",
                              "prompt": "Which TWO issues does the speaker ask the audience to consider before applying? (First choice)",
                              "options": [
                                    {
                                          "id": "A",
                                          "text": "their financial situation"
                                    },
                                    {
                                          "id": "B",
                                          "text": "their level of commitment"
                                    },
                                    {
                                          "id": "C",
                                          "text": "their work experience"
                                    },
                                    {
                                          "id": "D",
                                          "text": "their ambition"
                                    },
                                    {
                                          "id": "E",
                                          "text": "their availability"
                                    }
                              ],
                              "accepted_answers": [
                                    "B",
                                    "E"
                              ],
                              "explanation": "Applicants must consider their reliability/commitment (B) and available time (E)."
                        },
                        {
                              "id": "c18-l-q15",
                              "section_id": "c18-acad-t1-l-sec2",
                              "question_number": 15,
                              "question_type": "multiple_choice",
                              "prompt": "Which TWO issues does the speaker ask the audience to consider before applying? (Second choice)",
                              "options": [
                                    {
                                          "id": "A",
                                          "text": "their financial situation"
                                    },
                                    {
                                          "id": "B",
                                          "text": "their level of commitment"
                                    },
                                    {
                                          "id": "C",
                                          "text": "their work experience"
                                    },
                                    {
                                          "id": "D",
                                          "text": "their ambition"
                                    },
                                    {
                                          "id": "E",
                                          "text": "their availability"
                                    }
                              ],
                              "accepted_answers": [
                                    "B",
                                    "E"
                              ],
                              "explanation": "Applicants must consider their commitment and availability."
                        },
                        {
                              "id": "c18-l-q16",
                              "section_id": "c18-acad-t1-l-sec2",
                              "question_number": 16,
                              "question_type": "matching_features",
                              "prompt": "What helpful quality would assist: Fundraising",
                              "options": [
                                    {
                                          "id": "A",
                                          "text": "experience on stage"
                                    },
                                    {
                                          "id": "B",
                                          "text": "original, new ideas"
                                    },
                                    {
                                          "id": "C",
                                          "text": "parenting skills"
                                    },
                                    {
                                          "id": "D",
                                          "text": "an understanding of food and diet"
                                    },
                                    {
                                          "id": "E",
                                          "text": "retail experience"
                                    },
                                    {
                                          "id": "F",
                                          "text": "a good memory"
                                    },
                                    {
                                          "id": "G",
                                          "text": "a good level of fitness"
                                    }
                              ],
                              "accepted_answers": [
                                    "B"
                              ],
                              "explanation": "Fundraising relies on fresh, novel and original ideas."
                        },
                        {
                              "id": "c18-l-q17",
                              "section_id": "c18-acad-t1-l-sec2",
                              "question_number": 17,
                              "question_type": "matching_features",
                              "prompt": "What helpful quality would assist: Litter collection",
                              "options": [
                                    {
                                          "id": "A",
                                          "text": "experience on stage"
                                    },
                                    {
                                          "id": "B",
                                          "text": "original, new ideas"
                                    },
                                    {
                                          "id": "C",
                                          "text": "parenting skills"
                                    },
                                    {
                                          "id": "D",
                                          "text": "an understanding of food and diet"
                                    },
                                    {
                                          "id": "E",
                                          "text": "retail experience"
                                    },
                                    {
                                          "id": "F",
                                          "text": "a good memory"
                                    },
                                    {
                                          "id": "G",
                                          "text": "a good level of fitness"
                                    }
                              ],
                              "accepted_answers": [
                                    "G"
                              ],
                              "explanation": "Requires stamina and physical fitness."
                        },
                        {
                              "id": "c18-l-q18",
                              "section_id": "c18-acad-t1-l-sec2",
                              "question_number": 18,
                              "question_type": "matching_features",
                              "prompt": "What helpful quality would assist: 'Playmates'",
                              "options": [
                                    {
                                          "id": "A",
                                          "text": "experience on stage"
                                    },
                                    {
                                          "id": "B",
                                          "text": "original, new ideas"
                                    },
                                    {
                                          "id": "C",
                                          "text": "parenting skills"
                                    },
                                    {
                                          "id": "D",
                                          "text": "an understanding of food and diet"
                                    },
                                    {
                                          "id": "E",
                                          "text": "retail experience"
                                    },
                                    {
                                          "id": "F",
                                          "text": "a good memory"
                                    },
                                    {
                                          "id": "G",
                                          "text": "a good level of fitness"
                                    }
                              ],
                              "accepted_answers": [
                                    "D"
                              ],
                              "explanation": "Assisting with snacks requires nutritional knowledge."
                        },
                        {
                              "id": "c18-l-q19",
                              "section_id": "c18-acad-t1-l-sec2",
                              "question_number": 19,
                              "question_type": "matching_features",
                              "prompt": "What helpful quality would assist: Story club",
                              "options": [
                                    {
                                          "id": "A",
                                          "text": "experience on stage"
                                    },
                                    {
                                          "id": "B",
                                          "text": "original, new ideas"
                                    },
                                    {
                                          "id": "C",
                                          "text": "parenting skills"
                                    },
                                    {
                                          "id": "D",
                                          "text": "an understanding of food and diet"
                                    },
                                    {
                                          "id": "E",
                                          "text": "retail experience"
                                    },
                                    {
                                          "id": "F",
                                          "text": "a good memory"
                                    },
                                    {
                                          "id": "G",
                                          "text": "a good level of fitness"
                                    }
                              ],
                              "accepted_answers": [
                                    "A"
                              ],
                              "explanation": "Performing and storytelling benefits from acting / stage experience."
                        },
                        {
                              "id": "c18-l-q20",
                              "section_id": "c18-acad-t1-l-sec2",
                              "question_number": 20,
                              "question_type": "matching_features",
                              "prompt": "What helpful quality would assist: First aid",
                              "options": [
                                    {
                                          "id": "A",
                                          "text": "experience on stage"
                                    },
                                    {
                                          "id": "B",
                                          "text": "original, new ideas"
                                    },
                                    {
                                          "id": "C",
                                          "text": "parenting skills"
                                    },
                                    {
                                          "id": "D",
                                          "text": "an understanding of food and diet"
                                    },
                                    {
                                          "id": "E",
                                          "text": "retail experience"
                                    },
                                    {
                                          "id": "F",
                                          "text": "a good memory"
                                    },
                                    {
                                          "id": "G",
                                          "text": "a good level of fitness"
                                    }
                              ],
                              "accepted_answers": [
                                    "F"
                              ],
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
                                    {
                                          "id": "A",
                                          "text": "Her view of the speaker was blocked."
                                    },
                                    {
                                          "id": "B",
                                          "text": "She was unable to find an empty seat."
                                    },
                                    {
                                          "id": "C",
                                          "text": "The students next to her were talking."
                                    }
                              ],
                              "accepted_answers": [
                                    "A"
                              ],
                              "explanation": "A tall audience member sat right in front of her."
                        },
                        {
                              "id": "c18-l-q22",
                              "section_id": "c18-acad-t1-l-sec2",
                              "question_number": 22,
                              "question_type": "multiple_choice",
                              "prompt": "What were Hugo and Chantal surprised to hear about the job market?",
                              "options": [
                                    {
                                          "id": "A",
                                          "text": "It has become more competitive than it used to be."
                                    },
                                    {
                                          "id": "B",
                                          "text": "There is more variety in it than they had realised."
                                    },
                                    {
                                          "id": "C",
                                          "text": "Some areas of it are more exciting than others."
                                    }
                              ],
                              "accepted_answers": [
                                    "B"
                              ],
                              "explanation": "They were astonished by the wide variety of niche careers."
                        },
                        {
                              "id": "c18-l-q23",
                              "section_id": "c18-acad-t1-l-sec3",
                              "question_number": 23,
                              "question_type": "multiple_choice",
                              "prompt": "Hugo and Chantal agree that the speaker's message was...",
                              "options": [
                                    {
                                          "id": "A",
                                          "text": "unfair to them at times."
                                    },
                                    {
                                          "id": "B",
                                          "text": "hard for them to follow."
                                    },
                                    {
                                          "id": "C",
                                          "text": "critical of the industry."
                                    }
                              ],
                              "accepted_answers": [
                                    "A"
                              ],
                              "explanation": "They felt the speaker's tough tone was slightly unfair to first-year students."
                        },
                        {
                              "id": "c18-l-q24",
                              "section_id": "c18-acad-t1-l-sec3",
                              "question_number": 24,
                              "question_type": "multiple_choice",
                              "prompt": "What do Hugo and Chantal criticise about their school careers advice?",
                              "options": [
                                    {
                                          "id": "A",
                                          "text": "when they received the advice."
                                    },
                                    {
                                          "id": "B",
                                          "text": "how much advice was given."
                                    },
                                    {
                                          "id": "C",
                                          "text": "who gave the advice."
                                    }
                              ],
                              "accepted_answers": [
                                    "C"
                              ],
                              "explanation": "School advisors had zero practical creative industry background."
                        },
                        {
                              "id": "c18-l-q25",
                              "section_id": "c18-acad-t1-l-sec3",
                              "question_number": 25,
                              "question_type": "multiple_choice",
                              "prompt": "When discussing their future, Hugo and Chantal disagree on...",
                              "options": [
                                    {
                                          "id": "A",
                                          "text": "which is the best career in fashion."
                                    },
                                    {
                                          "id": "B",
                                          "text": "when to choose a career in fashion."
                                    },
                                    {
                                          "id": "C",
                                          "text": "why they would like a career in fashion."
                                    }
                              ],
                              "accepted_answers": [
                                    "B"
                              ],
                              "explanation": "Hugo prefers specializing early while Chantal wants to wait."
                        },
                        {
                              "id": "c18-l-q26",
                              "section_id": "c18-acad-t1-l-sec3",
                              "question_number": 26,
                              "question_type": "multiple_choice",
                              "prompt": "How does Hugo feel about being an unpaid assistant?",
                              "options": [
                                    {
                                          "id": "A",
                                          "text": "He is realistic about the practice."
                                    },
                                    {
                                          "id": "B",
                                          "text": "He is disappointed by the reality."
                                    },
                                    {
                                          "id": "C",
                                          "text": "He is hopeful it will change soon."
                                    }
                              ],
                              "accepted_answers": [
                                    "A"
                              ],
                              "explanation": "Hugo accepts unpaid internships as an unavoidable reality of entering the trade."
                        },
                        {
                              "id": "c18-l-q27",
                              "section_id": "c18-acad-t1-l-sec3",
                              "question_number": 27,
                              "question_type": "multiple_choice",
                              "prompt": "Which TWO mistakes did the speaker admit making in her first job? (First choice)",
                              "options": [
                                    {
                                          "id": "A",
                                          "text": "arguing with colleagues"
                                    },
                                    {
                                          "id": "B",
                                          "text": "paying too much attention to how she looked"
                                    },
                                    {
                                          "id": "C",
                                          "text": "refusing to do overtime"
                                    },
                                    {
                                          "id": "D",
                                          "text": "ignoring feedback from her manager"
                                    },
                                    {
                                          "id": "E",
                                          "text": "openly disliking her client"
                                    }
                              ],
                              "accepted_answers": [
                                    "B",
                                    "E"
                              ],
                              "explanation": "She focused excessively on wardrobe and clashed openly with a client."
                        },
                        {
                              "id": "c18-l-q28",
                              "section_id": "c18-acad-t1-l-sec3",
                              "question_number": 28,
                              "question_type": "multiple_choice",
                              "prompt": "Which TWO mistakes did the speaker admit making in her first job? (Second choice)",
                              "options": [
                                    {
                                          "id": "A",
                                          "text": "arguing with colleagues"
                                    },
                                    {
                                          "id": "B",
                                          "text": "paying too much attention to how she looked"
                                    },
                                    {
                                          "id": "C",
                                          "text": "refusing to do overtime"
                                    },
                                    {
                                          "id": "D",
                                          "text": "ignoring feedback from her manager"
                                    },
                                    {
                                          "id": "E",
                                          "text": "openly disliking her client"
                                    }
                              ],
                              "accepted_answers": [
                                    "B",
                                    "E"
                              ],
                              "explanation": "Admitted wardrobe obsession and showing dislike for a client."
                        },
                        {
                              "id": "c18-l-q29",
                              "section_id": "c18-acad-t1-l-sec3",
                              "question_number": 29,
                              "question_type": "multiple_choice",
                              "prompt": "Which TWO pieces of retail information do Hugo and Chantal agree would be useful? (First choice)",
                              "options": [
                                    {
                                          "id": "A",
                                          "text": "the reasons people return fashion items"
                                    },
                                    {
                                          "id": "B",
                                          "text": "the average price customers pay for clothes"
                                    },
                                    {
                                          "id": "C",
                                          "text": "fashion designs people want but can't find"
                                    },
                                    {
                                          "id": "D",
                                          "text": "which brand names customers prefer"
                                    },
                                    {
                                          "id": "E",
                                          "text": "how seasons affect clothing choices"
                                    }
                              ],
                              "accepted_answers": [
                                    "A",
                                    "C"
                              ],
                              "explanation": "Return statistics (A) and unfulfilled consumer design demand (C)."
                        },
                        {
                              "id": "c18-l-q30",
                              "section_id": "c18-acad-t1-l-sec3",
                              "question_number": 30,
                              "question_type": "multiple_choice",
                              "prompt": "Which TWO pieces of retail information do Hugo and Chantal agree would be useful? (Second choice)",
                              "options": [
                                    {
                                          "id": "A",
                                          "text": "the reasons people return fashion items"
                                    },
                                    {
                                          "id": "B",
                                          "text": "the average price customers pay for clothes"
                                    },
                                    {
                                          "id": "C",
                                          "text": "fashion designs people want but can't find"
                                    },
                                    {
                                          "id": "D",
                                          "text": "which brand names customers prefer"
                                    },
                                    {
                                          "id": "E",
                                          "text": "how seasons affect clothing choices"
                                    }
                              ],
                              "accepted_answers": [
                                    "A",
                                    "C"
                              ],
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
                              "accepted_answers": [
                                    "fences"
                              ],
                              "explanation": "Elephants broke park boundary fences."
                        },
                        {
                              "id": "c18-l-q32",
                              "section_id": "c18-acad-t1-l-sec4",
                              "question_number": 32,
                              "question_type": "fill_in_the_blank",
                              "prompt": "A suitable group of elephants from the same [blank_32] was selected",
                              "accepted_answers": [
                                    "family"
                              ],
                              "explanation": "Staff chose elephants belonging to the same family unit."
                        },
                        {
                              "id": "c18-l-q33",
                              "section_id": "c18-acad-t1-l-sec4",
                              "question_number": 33,
                              "question_type": "fill_in_the_blank",
                              "prompt": "Vets and park staff made use of [blank_33] to guide elephants",
                              "accepted_answers": [
                                    "helicopters"
                              ],
                              "explanation": "Helicopters were deployed to herd them to open terrain."
                        },
                        {
                              "id": "c18-l-q34",
                              "section_id": "c18-acad-t1-l-sec4",
                              "question_number": 34,
                              "question_type": "fill_in_the_blank",
                              "prompt": "Immobilisation completed quickly to reduce [blank_34]",
                              "accepted_answers": [
                                    "stress"
                              ],
                              "explanation": "Fast darting was essential to minimize physical and mental stress."
                        },
                        {
                              "id": "c18-l-q35",
                              "section_id": "c18-acad-t1-l-sec4",
                              "question_number": 35,
                              "question_type": "fill_in_the_blank",
                              "prompt": "Elephants had to be turned on their [blank_35] to avoid damage to lungs",
                              "accepted_answers": [
                                    "sides"
                              ],
                              "explanation": "They were positioned on their sides to prevent chest compression."
                        },
                        {
                              "id": "c18-l-q36",
                              "section_id": "c18-acad-t1-l-sec4",
                              "question_number": 36,
                              "question_type": "fill_in_the_blank",
                              "prompt": "Elephants' [blank_36] had to be monitored constantly",
                              "accepted_answers": [
                                    "breathing"
                              ],
                              "explanation": "Vets tracked respiration and breathing rates continuously."
                        },
                        {
                              "id": "c18-l-q37",
                              "section_id": "c18-acad-t1-l-sec4",
                              "question_number": 37,
                              "question_type": "fill_in_the_blank",
                              "prompt": "Data recorded included the size of tusks and [blank_37]",
                              "accepted_answers": [
                                    "feet"
                              ],
                              "explanation": "Foot measurements and tusk metrics were recorded."
                        },
                        {
                              "id": "c18-l-q38",
                              "section_id": "c18-acad-t1-l-sec4",
                              "question_number": 38,
                              "question_type": "fill_in_the_blank",
                              "prompt": "Community benefit: provided local [blank_38]",
                              "accepted_answers": [
                                    "employment",
                                    "jobs"
                              ],
                              "explanation": "Reserve generated stable employment for neighboring villages."
                        },
                        {
                              "id": "c18-l-q39",
                              "section_id": "c18-acad-t1-l-sec4",
                              "question_number": 39,
                              "question_type": "fill_in_the_blank",
                              "prompt": "Threat reduction: fewer weapons and [blank_39]",
                              "accepted_answers": [
                                    "snares",
                                    "weapons"
                              ],
                              "explanation": "Rangers removed illegal snares and firearms."
                        },
                        {
                              "id": "c18-l-q40",
                              "section_id": "c18-acad-t1-l-sec4",
                              "question_number": 40,
                              "question_type": "fill_in_the_blank",
                              "prompt": "Economic impact: significant increase in local [blank_40]",
                              "accepted_answers": [
                                    "tourism"
                              ],
                              "explanation": "Safari wildlife tourism expanded dramatically."
                        }
                  ]
            }
      ]
},
    // MODULE 2: READING (Academic - 40 Questions)
    // -------------------------------------------------------------------------
    {
      id: "c18-acad-t1-reading",
      exam_id: "cambridge-18-academic-test-1",
      skill: "reading",
      duration_minutes: 60,
      total_questions: 40,
      sections: [
        // Passage 1: Questions 1 - 13
        {
          id: "c18-acad-t1-r-sec1",
          module_id: "c18-acad-t1-reading",
          section_number: 1,
          passage_title: "Urban Green Infrastructure & Biophilic Architecture",
          passage_content: `<h3>Urban Green Infrastructure & Biophilic Architecture</h3>
<p><strong>Paragraph A:</strong> As global urbanization intensifies, metropolises increasingly grapple with thermal stress, air pollution, and mental fatigue. The urban heat island effect—wherein concrete and asphalt absorb solar radiation and elevate urban ambient temperatures by up to five degrees Celsius relative to surrounding rural hinterlands—presents severe public health challenges. In response, modern municipal planners are embracing biophilic architecture, an approach that systematically integrates vegetation, natural light, and organic geometries into civic construction.</p>

<p><strong>Paragraph B:</strong> Pioneering installations in Singapore, Milan, and Seoul demonstrate that vertical forests and intensive green roofs mitigate urban microclimates through solar reflectance and vegetative evapotranspiration. Plant foliage intercepts direct sunlight, preventing building envelopes from storing thermal mass. Concurrently, soil substrates act as acoustic buffers, reducing traffic noise penetration by as much as eight decibels. Furthermore, vegetated facades trap suspended particulate matter (PM2.5 and PM10), sequestering heavy metal pollutants that would otherwise degrade human respiratory health.</p>

<p><strong>Paragraph C:</strong> Beyond environmental thermodynamics, empirical psychological research highlights profound cognitive benefits linked to nature-infused urban spaces. Controlled clinical evaluations reveal that employees working in biophilic office towers demonstrate a 15% increase in cognitive stamina and significantly reduced salivary cortisol levels. Hospital convalescence periods also shorten markedly when patient rooms offer panoramic views of living green walls rather than blank concrete edifices.</p>

<p><strong>Paragraph D:</strong> Despite these evident advantages, engineering challenges remain substantial. Retrofitting existing high-rises with soil-intensive foliage incurs heavy structural loads, necessitating expensive reinforcement of structural load-bearing columns. Moreover, automated drip-irrigation networks require ongoing maintenance to prevent root intrusion and structural dampness. Urban ecologists also emphasize the importance of selecting drought-resilient native plant taxa to avoid excessive municipal water consumption during arid summer heatwaves.</p>`,
          instructions:
            "Answer Questions 1–13 based on Reading Passage 1.",
          questions: [
            {
              id: "c18-r-q1",
              section_id: "c18-acad-t1-r-sec1",
              question_number: 1,
              question_type: "true_false_not_given",
              prompt: "The urban heat island effect can cause cities to be up to five degrees warmer than adjacent rural regions.",
              accepted_answers: ["True", "true", "T"],
              explanation: "Paragraph A explicitly states: 'elevate urban ambient temperatures by up to five degrees Celsius relative to surrounding rural hinterlands'.",
              passage_reference: "Paragraph A",
            },
            {
              id: "c18-r-q2",
              section_id: "c18-acad-t1-r-sec1",
              question_number: 2,
              question_type: "true_false_not_given",
              prompt: "Vegetated building facades cause traffic noise levels to increase significantly.",
              accepted_answers: ["False", "false", "F"],
              explanation: "Paragraph B states soil substrates act as acoustic buffers, reducing traffic noise by up to eight decibels.",
              passage_reference: "Paragraph B",
            },
            {
              id: "c18-r-q3",
              section_id: "c18-acad-t1-r-sec1",
              question_number: 3,
              question_type: "true_false_not_given",
              prompt: "Singapore was the first city worldwide to enact mandatory green roof legislation.",
              accepted_answers: ["Not Given", "not given", "NG"],
              explanation: "The passage mentions Singapore alongside Milan and Seoul, but does not state it was the first to mandate legislation.",
              passage_reference: "Paragraph B",
            },
            {
              id: "c18-r-q4",
              section_id: "c18-acad-t1-r-sec1",
              question_number: 4,
              question_type: "true_false_not_given",
              prompt: "Cortisol levels in office workers rise when exposed to indoor greenery.",
              accepted_answers: ["False", "false", "F"],
              explanation: "Paragraph C states employees demonstrate 'significantly reduced salivary cortisol levels'.",
              passage_reference: "Paragraph C",
            },
            {
              id: "c18-r-q5",
              section_id: "c18-acad-t1-r-sec1",
              question_number: 5,
              question_type: "true_false_not_given",
              prompt: "Hospital patients heal faster when their recovery rooms overlook green walls.",
              accepted_answers: ["True", "true", "T"],
              explanation: "Paragraph C notes convalescence periods shorten markedly when patient rooms offer panoramic views of living green walls.",
              passage_reference: "Paragraph C",
            },
            {
              id: "c18-r-q6",
              section_id: "c18-acad-t1-r-sec1",
              question_number: 6,
              question_type: "true_false_not_given",
              prompt: "Structural columns in older high-rises never require reinforcement for green retrofits.",
              accepted_answers: ["False", "false", "F"],
              explanation: "Paragraph D explains that retrofitting foliage 'necessitates expensive reinforcement of structural load-bearing columns'.",
              passage_reference: "Paragraph D",
            },
            {
              id: "c18-r-q7",
              section_id: "c18-acad-t1-r-sec1",
              question_number: 7,
              question_type: "true_false_not_given",
              prompt: "Ecologists recommend prioritizing native plant species that require less water.",
              accepted_answers: ["True", "true", "T"],
              explanation: "Paragraph D notes ecologists emphasize selecting drought-resilient native plant taxa.",
              passage_reference: "Paragraph D",
            },
            {
              id: "c18-r-q8",
              section_id: "c18-acad-t1-r-sec1",
              question_number: 8,
              question_type: "fill_in_the_blank",
              prompt: "Urban heat islands elevate temperatures due to concrete and [blank_8] absorbing solar heat.",
              accepted_answers: ["asphalt", "Asphalt"],
              explanation: "Paragraph A: 'concrete and asphalt absorb solar radiation'.",
              passage_reference: "Paragraph A",
            },
            {
              id: "c18-r-q9",
              section_id: "c18-acad-t1-r-sec1",
              question_number: 9,
              question_type: "fill_in_the_blank",
              prompt: "Vegetative cooling occurs via solar reflectance and [blank_9].",
              accepted_answers: ["evapotranspiration", "Evapotranspiration"],
              explanation: "Paragraph B: 'mitigate urban microclimates through solar reflectance and vegetative evapotranspiration'.",
              passage_reference: "Paragraph B",
            },
            {
              id: "c18-r-q10",
              section_id: "c18-acad-t1-r-sec1",
              question_number: 10,
              question_type: "fill_in_the_blank",
              prompt: "Soil substrates decrease traffic noise by up to [blank_10] decibels.",
              accepted_answers: ["8", "eight", "8 decibels"],
              explanation: "Paragraph B: 'reducing traffic noise penetration by as much as eight decibels'.",
              passage_reference: "Paragraph B",
            },
            {
              id: "c18-r-q11",
              section_id: "c18-acad-t1-r-sec1",
              question_number: 11,
              question_type: "fill_in_the_blank",
              prompt: "Employees in biophilic offices experienced a [blank_11]% boost in cognitive stamina.",
              accepted_answers: ["15", "15%"],
              explanation: "Paragraph C: 'employees working in biophilic office towers demonstrate a 15% increase in cognitive stamina'.",
              passage_reference: "Paragraph C",
            },
            {
              id: "c18-r-q12",
              section_id: "c18-acad-t1-r-sec1",
              question_number: 12,
              question_type: "fill_in_the_blank",
              prompt: "Green facades capture airborne [blank_12] matter such as PM2.5.",
              accepted_answers: ["particulate", "Particulate"],
              explanation: "Paragraph B: 'facades trap suspended particulate matter (PM2.5 and PM10)'.",
              passage_reference: "Paragraph B",
            },
            {
              id: "c18-r-q13",
              section_id: "c18-acad-t1-r-sec1",
              question_number: 13,
              question_type: "fill_in_the_blank",
              prompt: "Drip-irrigation networks require maintenance to stop root [blank_13] and dampness.",
              accepted_answers: ["intrusion", "Intrusion"],
              explanation: "Paragraph D: 'require ongoing maintenance to prevent root intrusion and structural dampness'.",
              passage_reference: "Paragraph D",
            },
          ],
        },

        // Passage 2: Questions 14 - 26
        {
          id: "c18-acad-t1-r-sec2",
          module_id: "c18-acad-t1-reading",
          section_number: 2,
          passage_title: "The Neurobiology of Sleep & Memory Consolidation",
          passage_content: `<h3>The Neurobiology of Sleep & Memory Consolidation</h3>
<p><strong>Section A:</strong> For centuries, sleep was perceived as a passive biological cessation of consciousness—an inert state during which brain metabolism simply slowed to conserve energy. Modern polysomnography and functional magnetic resonance imaging (fMRI) have thoroughly overturned this dogma. Neural imaging demonstrates that the nocturnal brain exhibits dynamic, highly synchronized bursts of electrical oscillations essential for mnemonic processing and neural homeostasis.</p>

<p><strong>Section B:</strong> Memory consolidation proceeds through a dialogue between the hippocampus and the neocortex. During wakefulness, novel experiential data are rapidly encoded in the hippocampus, a temporary neural cache. During non-rapid eye movement (NREM) slow-wave sleep, high-amplitude delta waves coupled with hippocampal sharp-wave ripples replay daytime neural firing sequences at ten times their waking speed. This repeated replay gradually transfers fragile episodic memories into long-term neocortical storage repositories.</p>

<p><strong>Section C:</strong> In contrast, rapid eye movement (REM) sleep facilitates emotional memory integration and creative insight. During REM episodes, the neurotransmitter norepinephrine is extinguished, allowing the brain to process emotionally charged memories in a neurochemically safe, low-stress environment. Subjects tested on associative problem-solving tasks following REM-rich sleep cycles exhibit a threefold improvement in discerning hidden semantic connections.</p>

<p><strong>Section D:</strong> Sleep deprivation exerts severe pathological consequences on synaptic plasticity. Insufficient sleep causes microglial inflammation and impairs the brain's glymphatic waste-clearance system, resulting in the toxic accumulation of beta-amyloid and tau proteins. Over extended periods, chronic nocturnal deficit substantially elevates the long-term risk of neurodegenerative disorders.</p>`,
          instructions:
            "Answer Questions 14–26 based on Reading Passage 2.",
          questions: [
            {
              id: "c18-r-q14",
              section_id: "c18-acad-t1-r-sec2",
              question_number: 14,
              question_type: "matching_headings",
              prompt: "Choose the correct heading for Section A.",
              options: [
                { id: "i", text: "Challenging historical assumptions about sleep" },
                { id: "ii", text: "The biochemical risks of prolonged deprivation" },
                { id: "iii", text: "Consolidating facts via slow-wave replay" },
                { id: "iv", text: "The creative and emotional benefits of REM sleep" },
              ],
              accepted_answers: ["i", "I"],
              explanation: "Section A contrasts the historical view of sleep as passive cessation with modern discovery of active neural oscillations.",
              passage_reference: "Section A",
            },
            {
              id: "c18-r-q15",
              section_id: "c18-acad-t1-r-sec2",
              question_number: 15,
              question_type: "matching_headings",
              prompt: "Choose the correct heading for Section B.",
              options: [
                { id: "i", text: "Challenging historical assumptions about sleep" },
                { id: "ii", text: "The biochemical risks of prolonged deprivation" },
                { id: "iii", text: "Consolidating facts via slow-wave replay" },
                { id: "iv", text: "The creative and emotional benefits of REM sleep" },
              ],
              accepted_answers: ["iii", "III"],
              explanation: "Section B describes hippocampal-neocortical dialogue and memory transfer during NREM slow-wave sleep.",
              passage_reference: "Section B",
            },
            {
              id: "c18-r-q16",
              section_id: "c18-acad-t1-r-sec2",
              question_number: 16,
              question_type: "matching_headings",
              prompt: "Choose the correct heading for Section C.",
              options: [
                { id: "i", text: "Challenging historical assumptions about sleep" },
                { id: "ii", text: "The biochemical risks of prolonged deprivation" },
                { id: "iii", text: "Consolidating facts via slow-wave replay" },
                { id: "iv", text: "The creative and emotional benefits of REM sleep" },
              ],
              accepted_answers: ["iv", "IV"],
              explanation: "Section C details how REM sleep supports emotional memory and creative associative problem-solving.",
              passage_reference: "Section C",
            },
            {
              id: "c18-r-q17",
              section_id: "c18-acad-t1-r-sec2",
              question_number: 17,
              question_type: "matching_headings",
              prompt: "Choose the correct heading for Section D.",
              options: [
                { id: "i", text: "Challenging historical assumptions about sleep" },
                { id: "ii", text: "The biochemical risks of prolonged deprivation" },
                { id: "iii", text: "Consolidating facts via slow-wave replay" },
                { id: "iv", text: "The creative and emotional benefits of REM sleep" },
              ],
              accepted_answers: ["ii", "II"],
              explanation: "Section D details microglial inflammation, toxic protein accumulation, and neurodegenerative risks.",
              passage_reference: "Section D",
            },
            {
              id: "c18-r-q18",
              section_id: "c18-acad-t1-r-sec2",
              question_number: 18,
              question_type: "multiple_choice",
              prompt: "During wakefulness, new memories are initially held in the:",
              options: [
                { id: "A", text: "Neocortex" },
                { id: "B", text: "Hippocampus" },
                { id: "C", text: "Brainstem" },
                { id: "D", text: "Amygdala" },
              ],
              accepted_answers: ["B"],
              explanation: "Section B states new experiential data are encoded in the hippocampus as a temporary cache.",
              passage_reference: "Section B",
            },
            {
              id: "c18-r-q19",
              section_id: "c18-acad-t1-r-sec2",
              question_number: 19,
              question_type: "multiple_choice",
              prompt: "Hippocampal sharp-wave ripples replay waking firing sequences at:",
              options: [
                { id: "A", text: "Normal waking speed" },
                { id: "B", text: "Half normal speed" },
                { id: "C", text: "Ten times waking speed" },
                { id: "D", text: "Twice normal speed" },
              ],
              accepted_answers: ["C"],
              explanation: "Section B: 'replay daytime neural firing sequences at ten times their waking speed'.",
              passage_reference: "Section B",
            },
            {
              id: "c18-r-q20",
              section_id: "c18-acad-t1-r-sec2",
              question_number: 20,
              question_type: "multiple_choice",
              prompt: "Which neurotransmitter is suppressed during REM sleep to reduce stress?",
              options: [
                { id: "A", text: "Dopamine" },
                { id: "B", text: "Norepinephrine" },
                { id: "C", text: "Serotonin" },
                { id: "D", text: "Acetylcholine" },
              ],
              accepted_answers: ["B"],
              explanation: "Section C: 'the neurotransmitter norepinephrine is extinguished'.",
              passage_reference: "Section C",
            },
            {
              id: "c18-r-q21",
              section_id: "c18-acad-t1-r-sec2",
              question_number: 21,
              question_type: "fill_in_the_blank",
              prompt: "In NREM sleep, high-amplitude [blank_21] waves facilitate memory transfer.",
              accepted_answers: ["delta", "delta waves"],
              explanation: "Section B mentions high-amplitude delta waves coupled with ripples.",
              passage_reference: "Section B",
            },
            {
              id: "c18-r-q22",
              section_id: "c18-acad-t1-r-sec2",
              question_number: 22,
              question_type: "fill_in_the_blank",
              prompt: "Participants tested after REM sleep showed a [blank_22] improvement in problem solving.",
              accepted_answers: ["threefold", "3-fold", "triple"],
              explanation: "Section C notes a threefold improvement in discerning hidden semantic connections.",
              passage_reference: "Section C",
            },
            {
              id: "c18-r-q23",
              section_id: "c18-acad-t1-r-sec2",
              question_number: 23,
              question_type: "fill_in_the_blank",
              prompt: "The brain's waste removal mechanism is known as the [blank_23] system.",
              accepted_answers: ["glymphatic", "Glymphatic"],
              explanation: "Section D: 'the brain's glymphatic waste-clearance system'.",
              passage_reference: "Section D",
            },
            {
              id: "c18-r-q24",
              section_id: "c18-acad-t1-r-sec2",
              question_number: 24,
              question_type: "fill_in_the_blank",
              prompt: "Sleep deprivation triggers the buildup of tau and [blank_24] proteins.",
              accepted_answers: ["beta-amyloid", "beta amyloid"],
              explanation: "Section D: 'toxic accumulation of beta-amyloid and tau proteins'.",
              passage_reference: "Section D",
            },
            {
              id: "c18-r-q25",
              section_id: "c18-acad-t1-r-sec2",
              question_number: 25,
              question_type: "yes_no_not_given",
              prompt: "Early 20th-century scientists recognized that sleep involved active brain computation.",
              accepted_answers: ["No", "no", "N"],
              explanation: "Section A clarifies that historically sleep was viewed as a passive cessation of consciousness.",
              passage_reference: "Section A",
            },
            {
              id: "c18-r-q26",
              section_id: "c18-acad-t1-r-sec2",
              question_number: 26,
              question_type: "yes_no_not_given",
              prompt: "Chronic lack of sleep directly impacts cellular immune defenses.",
              accepted_answers: ["Not Given", "not given", "NG"],
              explanation: "The passage discusses microglial inflammation and brain waste, but does not measure systemic cellular immunity.",
              passage_reference: "Section D",
            },
          ],
        },

        // Passage 3: Questions 27 - 40
        {
          id: "c18-acad-t1-r-sec3",
          module_id: "c18-acad-t1-reading",
          section_number: 3,
          passage_title: "The Evolution of Oceanic Cartography & Celestial Navigation",
          passage_content: `<h3>The Evolution of Oceanic Cartography & Celestial Navigation</h3>
<p>Before the advent of satellite telemetry and atomic chronometers, transoceanic seafaring constituted an audacious wager against the elements. Early Mediterranean mariners clung closely to coastlines, relying on coastal landmarks and lead-weighted sounding lines to gauge bottom depths. It was not until the Age of Discovery in the fifteenth century that European explorers ventured into the open Atlantic, propelled by navigational borrowings from Arab, Persian, and Chinese mariners.</p>

<p>The magnetic compass, introduced to Europe from China via Silk Road trade routes, provided directional orientation irrespective of overcast skies. Yet determining a vessel's geographic coordinates upon featureless ocean swells presented acute mathematical quandaries. Calculating latitude—a ship's north-south distance from the equator—proved relatively straightforward by measuring the angular elevation of the North Star (Polaris) or the midday sun using an astrolabe or quadrant.</p>

<p>Calculating longitude—the east-west position—remained an elusive peril for nearly three centuries. Because Earth rotates 360 degrees every 24 hours, each hour of time difference corresponds to 15 degrees of longitude. To ascertain longitude, navigators required an exceptionally precise timepiece capable of retaining Greenwich Mean Time despite rocking ocean swells, atmospheric humidity, and extreme thermal fluctuations. The catastrophic Scilly naval disaster of 1707, in which four British warships wrecked with the loss of over 1,400 lives due to navigational miscalculation, impelled the British Parliament to pass the Longitude Act of 1714.</p>

<p>The Act established a monumental £20,000 prize for any mechanism able to determine longitude within half a degree. While academic astronomers favored the lunar distance method—a laborious calculation requiring hours of manual logarithmic reckoning—self-taught Yorkshire clockmaker John Harrison pursued a mechanical solution. Harrison's marine chronometer H4, perfected in 1759, employed bimetallic temperature compensation and diamond pallets, losing merely five seconds over an eight-week transatlantic crossing to Jamaica. Harrison's breakthrough transformed maritime navigation from hazardous guesswork into an exact discipline.</p>`,
          instructions:
            "Answer Questions 27–40 based on Reading Passage 3.",
          questions: [
            {
              id: "c18-r-q27",
              section_id: "c18-acad-t1-r-sec3",
              question_number: 27,
              question_type: "yes_no_not_given",
              prompt: "Early Mediterranean sailors avoided sailing far away from the coastline.",
              accepted_answers: ["Yes", "yes", "Y"],
              explanation: "Paragraph 1 states early mariners 'clung closely to coastlines, relying on coastal landmarks'.",
              passage_reference: "Paragraph 1",
            },
            {
              id: "c18-r-q28",
              section_id: "c18-acad-t1-r-sec3",
              question_number: 28,
              question_type: "yes_no_not_given",
              prompt: "The magnetic compass was invented in Renaissance Europe.",
              accepted_answers: ["No", "no", "N"],
              explanation: "Paragraph 2 states the compass was introduced to Europe from China.",
              passage_reference: "Paragraph 2",
            },
            {
              id: "c18-r-q29",
              section_id: "c18-acad-t1-r-sec3",
              question_number: 29,
              question_type: "yes_no_not_given",
              prompt: "Measuring latitude on open waters was more difficult than measuring longitude.",
              accepted_answers: ["No", "no", "N"],
              explanation: "Paragraph 2 states calculating latitude was 'relatively straightforward', whereas longitude remained elusive.",
              passage_reference: "Paragraph 2",
            },
            {
              id: "c18-r-q30",
              section_id: "c18-acad-t1-r-sec3",
              question_number: 30,
              question_type: "yes_no_not_given",
              prompt: "The 1707 Scilly naval disaster directly influenced government action on maritime navigation.",
              accepted_answers: ["Yes", "yes", "Y"],
              explanation: "Paragraph 3 notes the disaster impelled Parliament to pass the Longitude Act of 1714.",
              passage_reference: "Paragraph 3",
            },
            {
              id: "c18-r-q31",
              section_id: "c18-acad-t1-r-sec3",
              question_number: 31,
              question_type: "yes_no_not_given",
              prompt: "John Harrison was a university professor of astronomy.",
              accepted_answers: ["No", "no", "N"],
              explanation: "Paragraph 4 identifies him as a 'self-taught Yorkshire clockmaker'.",
              passage_reference: "Paragraph 4",
            },
            {
              id: "c18-r-q32",
              section_id: "c18-acad-t1-r-sec3",
              question_number: 32,
              question_type: "yes_no_not_given",
              prompt: "Harrison received his prize money immediately following the Jamaica voyage.",
              accepted_answers: ["Not Given", "not given", "NG"],
              explanation: "The passage notes the success of the test, but does not discuss payment timing.",
              passage_reference: "Paragraph 4",
            },
            {
              id: "c18-r-q33",
              section_id: "c18-acad-t1-r-sec3",
              question_number: 33,
              question_type: "multiple_choice",
              prompt: "Each hour of time difference between a ship and Greenwich corresponds to:",
              options: [
                { id: "A", text: "5 degrees of longitude" },
                { id: "B", text: "15 degrees of longitude" },
                { id: "C", text: "30 degrees of longitude" },
                { id: "D", text: "45 degrees of longitude" },
              ],
              accepted_answers: ["B"],
              explanation: "Paragraph 3: 'each hour of time difference corresponds to 15 degrees of longitude'.",
              passage_reference: "Paragraph 3",
            },
            {
              id: "c18-r-q34",
              section_id: "c18-acad-t1-r-sec3",
              question_number: 34,
              question_type: "multiple_choice",
              prompt: "What value was offered by Parliament for solving the longitude challenge?",
              options: [
                { id: "A", text: "£5,000" },
                { id: "B", text: "£10,000" },
                { id: "C", text: "£20,000" },
                { id: "D", text: "£50,000" },
              ],
              accepted_answers: ["C"],
              explanation: "Paragraph 4 states a £20,000 prize was established by the Longitude Act.",
              passage_reference: "Paragraph 4",
            },
            {
              id: "c18-r-q35",
              section_id: "c18-acad-t1-r-sec3",
              question_number: 35,
              question_type: "multiple_choice",
              prompt: "Which alternative approach was supported by professional astronomers?",
              options: [
                { id: "A", text: "The solar shadow method" },
                { id: "B", text: "The lunar distance method" },
                { id: "C", text: "Water clocks" },
                { id: "D", text: "Stellar drift charting" },
              ],
              accepted_answers: ["B"],
              explanation: "Paragraph 4: 'academic astronomers favored the lunar distance method'.",
              passage_reference: "Paragraph 4",
            },
            {
              id: "c18-r-q36",
              section_id: "c18-acad-t1-r-sec3",
              question_number: 36,
              question_type: "fill_in_the_blank",
              prompt: "Navigators measured the altitude of Polaris using an [blank_36] or quadrant.",
              accepted_answers: ["astrolabe", "Astrolabe"],
              explanation: "Paragraph 2: 'using an astrolabe or quadrant'.",
              passage_reference: "Paragraph 2",
            },
            {
              id: "c18-r-q37",
              section_id: "c18-acad-t1-r-sec3",
              question_number: 37,
              question_type: "fill_in_the_blank",
              prompt: "The Scilly disaster resulted in four British [blank_37] being wrecked.",
              accepted_answers: ["warships", "Warships", "ships"],
              explanation: "Paragraph 3: 'four British warships wrecked'.",
              passage_reference: "Paragraph 3",
            },
            {
              id: "c18-r-q38",
              section_id: "c18-acad-t1-r-sec3",
              question_number: 38,
              question_type: "fill_in_the_blank",
              prompt: "Harrison's award-winning marine watch was named [blank_38].",
              accepted_answers: ["H4", "h4", "Harrison 4"],
              explanation: "Paragraph 4 mentions marine chronometer H4.",
              passage_reference: "Paragraph 4",
            },
            {
              id: "c18-r-q39",
              section_id: "c18-acad-t1-r-sec3",
              question_number: 39,
              question_type: "fill_in_the_blank",
              prompt: "Over an eight-week voyage to Jamaica, H4 lost only [blank_39] seconds.",
              accepted_answers: ["5", "five"],
              explanation: "Paragraph 4: 'losing merely five seconds over an eight-week transatlantic crossing'.",
              passage_reference: "Paragraph 4",
            },
            {
              id: "c18-r-q40",
              section_id: "c18-acad-t1-r-sec3",
              question_number: 40,
              question_type: "fill_in_the_blank",
              prompt: "H4 utilized [blank_40] temperature compensation to retain accuracy.",
              accepted_answers: ["bimetallic", "Bimetallic"],
              explanation: "Paragraph 4: 'employed bimetallic temperature compensation'.",
              passage_reference: "Paragraph 4",
            },
          ],
        },
      ],
    },

    // -------------------------------------------------------------------------
    // MODULE 3: WRITING (Academic - Tasks 1 & 2)
    // -------------------------------------------------------------------------
    {
      id: "c18-acad-t1-writing",
      exam_id: "cambridge-18-academic-test-1",
      skill: "writing",
      duration_minutes: 60,
      total_questions: 2,
      sections: [
        {
          id: "c18-acad-t1-w-sec1",
          module_id: "c18-acad-t1-writing",
          section_number: 1,
          passage_title: "Task 1: Renewable Energy Production Trends",
          passage_content:
            "The chart illustrates the percentage of national electricity generated by three renewable energy sources (Wind, Solar, and Hydroelectric) in five European nations between 2010 and 2024.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
          instructions:
            "You should spend about 20 minutes on this task. Write at least 150 words.",
          questions: [
            {
              id: "c18-w-q1",
              section_id: "c18-acad-t1-w-sec1",
              question_number: 1,
              question_type: "fill_in_the_blank",
              prompt: "Academic Writing Task 1 Response (Minimum 150 words):",
              accepted_answers: [],
              explanation: "Evaluated on Task Achievement, Coherence & Cohesion, Lexical Resource, and Grammatical Range.",
            },
          ],
        },
        {
          id: "c18-acad-t1-w-sec2",
          module_id: "c18-acad-t1-writing",
          section_number: 2,
          passage_title: "Task 2: Automation and Artificial Intelligence in Employment",
          passage_content:
            "Some people believe that the rapid expansion of artificial intelligence and robotic automation will eliminate millions of professional careers and increase socioeconomic inequality. Others argue that AI will generate novel industries and elevate human quality of life.\n\nDiscuss both these views and give your own opinion.\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
          instructions:
            "You should spend about 40 minutes on this task. Write at least 250 words.",
          questions: [
            {
              id: "c18-w-q2",
              section_id: "c18-acad-t1-w-sec2",
              question_number: 2,
              question_type: "fill_in_the_blank",
              prompt: "Academic Writing Task 2 Essay (Minimum 250 words):",
              accepted_answers: [],
              explanation: "Evaluated on Task Response, Coherence & Cohesion, Lexical Resource, and Grammatical Range & Accuracy.",
            },
          ],
        },
      ],
    },

    // -------------------------------------------------------------------------
    // MODULE 4: SPEAKING (Parts 1, 2, & 3)
    // -------------------------------------------------------------------------
    {
      id: "c18-acad-t1-speaking",
      exam_id: "cambridge-18-academic-test-1",
      skill: "speaking",
      duration_minutes: 14,
      total_questions: 3,
      sections: [
        {
          id: "c18-acad-t1-s-sec1",
          module_id: "c18-acad-t1-speaking",
          section_number: 1,
          passage_title: "Part 1: Studies, Hobbies & Technology",
          passage_content:
            "The examiner will ask general questions about your hometown, your studies or profession, and how you use technology in your daily learning routine.",
          instructions: "Answer the examiner's questions naturally and clearly (4–5 minutes).",
          questions: [
            {
              id: "c18-s-q1",
              section_id: "c18-acad-t1-s-sec1",
              question_number: 1,
              question_type: "fill_in_the_blank",
              prompt: "Part 1 Interview Questions: How has digital technology influenced your study habits?",
              accepted_answers: [],
              explanation: "Focus on fluency, natural connective devices, and varied lexical choices.",
            },
          ],
        },
        {
          id: "c18-acad-t1-s-sec2",
          module_id: "c18-acad-t1-speaking",
          section_number: 2,
          passage_title: "Part 2: Candidate Cue Card",
          passage_content:
            "Describe an online educational resource or mobile application that significantly aided your studies.\n\nYou should say:\n- What it is and how you discovered it\n- How frequently you use it\n- What specific subjects or skills it helps you learn\n- And explain why this resource has been particularly valuable to your development.",
          instructions:
            "You have 1 minute to prepare notes. Then speak for 1 to 2 minutes on the topic.",
          questions: [
            {
              id: "c18-s-q2",
              section_id: "c18-acad-t1-s-sec2",
              question_number: 2,
              question_type: "fill_in_the_blank",
              prompt: "Part 2 Individual Long Turn (1-2 minutes recorded response):",
              accepted_answers: [],
              explanation: "Assessed on extended speech without pauses, structured topic development, and pronunciation.",
            },
          ],
        },
        {
          id: "c18-acad-t1-s-sec3",
          module_id: "c18-acad-t1-speaking",
          section_number: 3,
          passage_title: "Part 3: Two-Way Analytical Discussion",
          passage_content:
            "Discussion topics:\n- Traditional classroom pedagogy versus self-directed digital learning.\n- The role of artificial intelligence in personalized education.\n- How equitable is access to online educational tools across different socioeconomic strata?",
          instructions:
            "Discuss these broader abstract topics with the examiner (4–5 minutes).",
          questions: [
            {
              id: "c18-s-q3",
              section_id: "c18-acad-t1-s-sec3",
              question_number: 3,
              question_type: "fill_in_the_blank",
              prompt: "Part 3 Discussion Analysis: Will autonomous AI tools ever replace human mentors?",
              accepted_answers: [],
              explanation: "Focus on abstract reasoning, hypothetical structures, and complex discourse markers.",
            },
          ],
        },
      ],
    },
  ],
};
