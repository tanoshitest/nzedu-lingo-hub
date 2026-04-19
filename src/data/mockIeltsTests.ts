// ============================================================
// IELTS Test Designer - Data Model & Mock Data
// Language: English (for all test content and labels)
// ============================================================

export type IeltsVariant = 'Academic' | 'General Training';
export type IeltsSkill = 'Listening' | 'Reading' | 'Writing' | 'Speaking';
export type TestStatus = 'Draft' | 'Published' | 'Archived';

export type QuestionType =
  | 'MultipleChoice'
  | 'TrueFalseNotGiven'
  | 'YesNoNotGiven'
  | 'MatchingHeadings'
  | 'MatchingInformation'
  | 'MatchingFeatures'
  | 'MatchingSentenceEndings'
  | 'SentenceCompletion'
  | 'SummaryCompletion'
  | 'NoteCompletion'
  | 'TableCompletion'
  | 'FlowChartCompletion'
  | 'DiagramLabel'
  | 'MapPlanLabel'
  | 'ShortAnswer'
  | 'Classification';

export const questionTypeLabels: Record<QuestionType, string> = {
  MultipleChoice: 'Multiple Choice',
  TrueFalseNotGiven: 'True / False / Not Given',
  YesNoNotGiven: 'Yes / No / Not Given',
  MatchingHeadings: 'Matching Headings',
  MatchingInformation: 'Matching Information',
  MatchingFeatures: 'Matching Features',
  MatchingSentenceEndings: 'Matching Sentence Endings',
  SentenceCompletion: 'Sentence Completion',
  SummaryCompletion: 'Summary Completion',
  NoteCompletion: 'Note Completion',
  TableCompletion: 'Table Completion',
  FlowChartCompletion: 'Flow-chart Completion',
  DiagramLabel: 'Diagram Labelling',
  MapPlanLabel: 'Map / Plan Labelling',
  ShortAnswer: 'Short Answer',
  Classification: 'Classification',
};

export type Presentation = 'TypeIn' | 'DragDrop' | 'Dropdown' | 'Radio' | 'Checkbox';

export const presentationLabels: Record<Presentation, string> = {
  TypeIn: 'Type-in (free text)',
  DragDrop: 'Drag & Drop from Word Bank',
  Dropdown: 'Dropdown Select',
  Radio: 'Radio (single choice)',
  Checkbox: 'Checkbox (multi choice)',
};

// Which presentations make sense for each question type
export const allowedPresentations: Record<QuestionType, Presentation[]> = {
  MultipleChoice: ['Radio', 'Checkbox'],
  TrueFalseNotGiven: ['Radio', 'Dropdown'],
  YesNoNotGiven: ['Radio', 'Dropdown'],
  MatchingHeadings: ['DragDrop', 'Dropdown'],
  MatchingInformation: ['DragDrop', 'Dropdown'],
  MatchingFeatures: ['DragDrop', 'Dropdown'],
  MatchingSentenceEndings: ['DragDrop', 'Dropdown'],
  SentenceCompletion: ['TypeIn', 'DragDrop', 'Dropdown'],
  SummaryCompletion: ['TypeIn', 'DragDrop', 'Dropdown'],
  NoteCompletion: ['TypeIn', 'DragDrop'],
  TableCompletion: ['TypeIn', 'DragDrop'],
  FlowChartCompletion: ['TypeIn', 'DragDrop'],
  DiagramLabel: ['TypeIn', 'DragDrop'],
  MapPlanLabel: ['DragDrop', 'TypeIn'],
  ShortAnswer: ['TypeIn'],
  Classification: ['DragDrop', 'Dropdown'],
};

export const defaultInstructionByType: Record<QuestionType, string> = {
  MultipleChoice: 'Choose the correct letter, A, B, C or D.',
  TrueFalseNotGiven: 'Do the following statements agree with the information given in the passage? Write TRUE, FALSE, or NOT GIVEN.',
  YesNoNotGiven: 'Do the following statements agree with the views of the writer? Write YES, NO, or NOT GIVEN.',
  MatchingHeadings: 'The passage has several paragraphs. Choose the correct heading for each paragraph from the list of headings below.',
  MatchingInformation: 'Which paragraph contains the following information? You may use any letter more than once.',
  MatchingFeatures: 'Match each statement with the correct person/place/thing from the list.',
  MatchingSentenceEndings: 'Complete each sentence with the correct ending, A–G, from the box below.',
  SentenceCompletion: 'Complete the sentences below. Write NO MORE THAN THREE WORDS from the passage for each answer.',
  SummaryCompletion: 'Complete the summary below. Choose NO MORE THAN TWO WORDS from the passage for each answer.',
  NoteCompletion: 'Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer.',
  TableCompletion: 'Complete the table below. Write NO MORE THAN TWO WORDS for each answer.',
  FlowChartCompletion: 'Complete the flow-chart below. Write NO MORE THAN TWO WORDS for each answer.',
  DiagramLabel: 'Label the diagram below. Write NO MORE THAN TWO WORDS for each answer.',
  MapPlanLabel: 'Label the map/plan below. Choose the correct letter A–H for each answer.',
  ShortAnswer: 'Answer the questions below. Write NO MORE THAN THREE WORDS AND/OR A NUMBER for each answer.',
  Classification: 'Classify the following statements as referring to A, B, or C.',
};

// ===== LISTENING =====
export interface ListeningSection {
  parts: ListeningPart[];
}
export interface ListeningPart {
  partNumber: 1 | 2 | 3 | 4;
  context: string;
  audioFileName?: string;
  audioDurationSec?: number;
  transcript?: string;
  questionGroups: QuestionGroup[];
}

// ===== READING =====
export interface ReadingSection {
  passages: ReadingPassage[];
}
export interface ReadingPassage {
  passageNumber: 1 | 2 | 3;
  title: string;
  body: string;
  source?: string;
  wordCount?: number;
  questionGroups: QuestionGroup[];
}

// ===== QuestionGroup (shared) =====
export interface QuestionGroup {
  id: string;
  type: QuestionType;
  instruction: string;
  presentation: Presentation;
  wordLimit?: string;
  wordBank?: string[];
  imageFileName?: string;
  questions: Question[];
}
export interface Question {
  number: number;
  prompt: string;
  options?: string[];
  answer: string | string[];
  points: number;
}

// ===== WRITING =====
export interface WritingSection {
  task1: WritingTask;
  task2: WritingTask;
}
export type WritingTaskType =
  | 'BarChart' | 'LineGraph' | 'PieChart' | 'Table' | 'Map' | 'Process' | 'MixedChart'
  | 'Letter'
  | 'Opinion' | 'Discussion' | 'ProblemSolution' | 'AdvDisadv' | 'TwoPart';

export const writingTaskTypeLabels: Record<WritingTaskType, string> = {
  BarChart: 'Bar Chart',
  LineGraph: 'Line Graph',
  PieChart: 'Pie Chart',
  Table: 'Table',
  Map: 'Map',
  Process: 'Process / Diagram',
  MixedChart: 'Mixed Chart',
  Letter: 'Letter',
  Opinion: 'Opinion (Agree / Disagree)',
  Discussion: 'Discussion (Discuss both views)',
  ProblemSolution: 'Problem & Solution',
  AdvDisadv: 'Advantages & Disadvantages',
  TwoPart: 'Two-part / Direct Question',
};

export interface WritingTask {
  taskNumber: 1 | 2;
  prompt: string;
  taskType: WritingTaskType;
  imageFileName?: string;
  minWords: 150 | 250;
  timeMinutes: 20 | 40;
  sampleAnswer?: string;
  notes?: string;
}

// ===== SPEAKING =====
export interface SpeakingSection {
  part1: { topics: SpeakingTopic[] };
  part2: { cueCard: CueCard };
  part3: { questions: string[] };
}
export interface SpeakingTopic {
  topic: string;
  questions: string[];
}
export interface CueCard {
  topic: string;
  bullets: string[];
  followUpQuestions?: string[];
}

// ===== Main Test =====
export interface IeltsTest {
  id: string;
  code: string;
  title: string;
  variant: IeltsVariant;
  skills: IeltsSkill[];
  status: TestStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  durationMinutes?: number;
  tags: string[];
  description?: string;
  listening?: ListeningSection;
  reading?: ReadingSection;
  writing?: WritingSection;
  speaking?: SpeakingSection;
}

export const testStatusColors: Record<TestStatus, string> = {
  Draft: 'bg-muted text-muted-foreground border-border',
  Published: 'bg-success/10 text-success border-success/20',
  Archived: 'bg-warning/10 text-warning border-warning/20',
};

// ============================================================
// Sample tests
// ============================================================

export const ieltsTests: IeltsTest[] = [
  {
    id: 'IT001',
    code: 'NZ-IELTS-001',
    title: 'Academic Mock Test 01 — Full 4 Skills',
    variant: 'Academic',
    skills: ['Listening', 'Reading', 'Writing', 'Speaking'],
    status: 'Published',
    createdBy: 'Nguyễn Văn An',
    createdAt: '10/04/2026',
    updatedAt: '18/04/2026',
    durationMinutes: 165,
    tags: ['Cambridge 17', 'Mock Test', 'Band 6.5'],
    description: 'Full Academic mock test inspired by Cambridge IELTS 17, suitable for Band 6.0–7.0 target students.',
    listening: {
      parts: [
        {
          partNumber: 1,
          context: 'A conversation between a student and a travel agent about booking an accommodation.',
          audioFileName: 'listening_part1_travel.mp3',
          audioDurationSec: 310,
          transcript: 'AGENT: Good morning, Sunshine Travel, how can I help?\nSTUDENT: Hi, I\'d like to book...',
          questionGroups: [
            {
              id: 'QG-L1-1',
              type: 'NoteCompletion',
              instruction: 'Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer.',
              presentation: 'TypeIn',
              wordLimit: 'ONE WORD AND/OR A NUMBER',
              questions: [
                { number: 1, prompt: 'Customer name: Sarah __________', answer: 'Mitchell', points: 1 },
                { number: 2, prompt: 'Destination: __________', answer: 'Edinburgh', points: 1 },
                { number: 3, prompt: 'Check-in date: __________ of June', answer: '14th', points: 1 },
                { number: 4, prompt: 'Number of guests: __________', answer: '2', points: 1 },
                { number: 5, prompt: 'Room type: __________ room', answer: 'twin', points: 1 },
              ],
            },
          ],
        },
        {
          partNumber: 2,
          context: 'A monologue giving information about a local community centre.',
          audioFileName: 'listening_part2_centre.mp3',
          audioDurationSec: 295,
          questionGroups: [
            {
              id: 'QG-L2-1',
              type: 'MultipleChoice',
              instruction: 'Choose the correct letter, A, B, or C.',
              presentation: 'Radio',
              questions: [
                {
                  number: 6,
                  prompt: 'The community centre was originally built as a',
                  options: ['A. school', 'B. library', 'C. theatre'],
                  answer: 'C',
                  points: 1,
                },
                {
                  number: 7,
                  prompt: 'The centre is funded mainly by',
                  options: ['A. government grants', 'B. private donations', 'C. membership fees'],
                  answer: 'B',
                  points: 1,
                },
              ],
            },
            {
              id: 'QG-L2-2',
              type: 'MapPlanLabel',
              instruction: 'Label the plan below. Choose the correct letter A–H for each answer.',
              presentation: 'DragDrop',
              imageFileName: 'map_community_centre.png',
              wordBank: ['Main Hall', 'Kitchen', 'Library', 'Gym', 'Office', 'Storage', 'Cafeteria', 'Garden'],
              questions: [
                { number: 8, prompt: 'Location 8 on the map', answer: 'Main Hall', points: 1 },
                { number: 9, prompt: 'Location 9 on the map', answer: 'Library', points: 1 },
                { number: 10, prompt: 'Location 10 on the map', answer: 'Garden', points: 1 },
              ],
            },
          ],
        },
        {
          partNumber: 3,
          context: 'Discussion between two university students and their tutor about a research project.',
          audioFileName: 'listening_part3_research.mp3',
          audioDurationSec: 320,
          questionGroups: [
            {
              id: 'QG-L3-1',
              type: 'MatchingFeatures',
              instruction: 'Which student made each comment? Choose A, B, or C.',
              presentation: 'Dropdown',
              wordBank: ['A = Mark', 'B = Lisa', 'C = Dr. Nguyen'],
              questions: [
                { number: 11, prompt: 'Suggested focusing on quantitative data', answer: 'B', points: 1 },
                { number: 12, prompt: 'Was concerned about time constraints', answer: 'A', points: 1 },
                { number: 13, prompt: 'Recommended using interviews', answer: 'C', points: 1 },
              ],
            },
          ],
        },
        {
          partNumber: 4,
          context: 'A lecture on the history of urban planning.',
          audioFileName: 'listening_part4_urban.mp3',
          audioDurationSec: 410,
          questionGroups: [
            {
              id: 'QG-L4-1',
              type: 'SummaryCompletion',
              instruction: 'Complete the summary using words from the box. Drag each word into the correct gap.',
              presentation: 'DragDrop',
              wordBank: ['industrial', 'population', 'green', 'sustainable', 'housing', 'transport', 'pollution', 'density'],
              questions: [
                { number: 14, prompt: 'Urban planning emerged during the __________ revolution.', answer: 'industrial', points: 1 },
                { number: 15, prompt: 'Early cities suffered from high levels of __________.', answer: 'pollution', points: 1 },
                { number: 16, prompt: 'Modern planning emphasises __________ development.', answer: 'sustainable', points: 1 },
              ],
            },
          ],
        },
      ],
    },
    reading: {
      passages: [
        {
          passageNumber: 1,
          title: 'The History of Glass',
          source: 'Adapted from Cambridge IELTS 17 Academic',
          wordCount: 920,
          body: 'From our earliest origins, man has been making use of glass. Historians have discovered that a type of natural glass — obsidian — formed in places such as the mouth of a volcano as a result of the intense heat of an eruption melting sand...\n\n[Full passage would continue here — approx 900-1000 words]',
          questionGroups: [
            {
              id: 'QG-R1-1',
              type: 'TrueFalseNotGiven',
              instruction: 'Do the following statements agree with the information given in Reading Passage 1? Write TRUE, FALSE or NOT GIVEN.',
              presentation: 'Radio',
              questions: [
                { number: 1, prompt: 'Obsidian is a type of natural glass.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], answer: 'TRUE', points: 1 },
                { number: 2, prompt: 'The Egyptians were the first to manufacture glass.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], answer: 'NOT GIVEN', points: 1 },
                { number: 3, prompt: 'Glass-blowing was invented in the 1st century BC.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], answer: 'TRUE', points: 1 },
              ],
            },
            {
              id: 'QG-R1-2',
              type: 'SummaryCompletion',
              instruction: 'Complete the summary below. Choose NO MORE THAN TWO WORDS from the passage for each answer.',
              presentation: 'TypeIn',
              wordLimit: 'NO MORE THAN TWO WORDS',
              questions: [
                { number: 4, prompt: 'Glass was first made by combining sand, soda, and __________.', answer: 'lime', points: 1 },
                { number: 5, prompt: 'The technique of glass-blowing made production much __________.', answer: 'faster', points: 1 },
              ],
            },
          ],
        },
        {
          passageNumber: 2,
          title: 'Bring Back the Big Cats',
          source: 'Adapted from The Guardian',
          wordCount: 1050,
          body: 'It\'s time to start returning vanished native animals to Britain, says George Monbiot...\n\n[Full passage content]',
          questionGroups: [
            {
              id: 'QG-R2-1',
              type: 'MatchingHeadings',
              instruction: 'The passage has 7 paragraphs, A–G. Choose the correct heading for each paragraph from the list below. Drag each heading to the correct paragraph.',
              presentation: 'DragDrop',
              wordBank: [
                'i. The disappearance of native species',
                'ii. Economic benefits of rewilding',
                'iii. Ecological role of apex predators',
                'iv. Public opposition to reintroduction',
                'v. Successful cases in other countries',
                'vi. The author\'s personal experience',
                'vii. Legal challenges',
                'viii. A vision for the future',
              ],
              questions: [
                { number: 6, prompt: 'Paragraph A', answer: 'i', points: 1 },
                { number: 7, prompt: 'Paragraph B', answer: 'iii', points: 1 },
                { number: 8, prompt: 'Paragraph C', answer: 'v', points: 1 },
                { number: 9, prompt: 'Paragraph D', answer: 'ii', points: 1 },
                { number: 10, prompt: 'Paragraph E', answer: 'iv', points: 1 },
              ],
            },
          ],
        },
        {
          passageNumber: 3,
          title: 'The Psychology of Innovation',
          source: 'Adapted from Harvard Business Review',
          wordCount: 1180,
          body: 'Why are so few companies truly innovative? Innovation is risky, difficult, and...\n\n[Full passage content]',
          questionGroups: [
            {
              id: 'QG-R3-1',
              type: 'YesNoNotGiven',
              instruction: 'Do the following statements agree with the views of the writer? Write YES, NO, or NOT GIVEN.',
              presentation: 'Radio',
              questions: [
                { number: 11, prompt: 'Most companies are naturally innovative.', options: ['YES', 'NO', 'NOT GIVEN'], answer: 'NO', points: 1 },
                { number: 12, prompt: 'Innovation requires a tolerance of failure.', options: ['YES', 'NO', 'NOT GIVEN'], answer: 'YES', points: 1 },
              ],
            },
            {
              id: 'QG-R3-2',
              type: 'MultipleChoice',
              instruction: 'Choose the correct letter, A, B, C or D.',
              presentation: 'Radio',
              questions: [
                {
                  number: 13,
                  prompt: 'According to the writer, the main barrier to innovation is',
                  options: ['A. lack of funding', 'B. fear of failure', 'C. poor leadership', 'D. market conditions'],
                  answer: 'B',
                  points: 1,
                },
              ],
            },
          ],
        },
      ],
    },
    writing: {
      task1: {
        taskNumber: 1,
        taskType: 'BarChart',
        prompt: 'The bar chart below shows the number of international students enrolled in three Australian universities between 2010 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
        imageFileName: 'writing_task1_barchart.png',
        minWords: 150,
        timeMinutes: 20,
        notes: 'Encourage students to group data by trend (increase/decrease) rather than describing each bar separately.',
      },
      task2: {
        taskNumber: 2,
        taskType: 'Opinion',
        prompt: 'Some people believe that universities should only accept students with the highest academic results. Others think universities should be open to anyone who wants to study. Discuss both these views and give your own opinion.',
        minWords: 250,
        timeMinutes: 40,
        notes: 'Discussion-type prompt — students must cover BOTH views before giving opinion.',
      },
    },
    speaking: {
      part1: {
        topics: [
          {
            topic: 'Hometown',
            questions: [
              'Where is your hometown?',
              'What do you like most about your hometown?',
              'Has your hometown changed much in recent years?',
              'Would you like to live there in the future?',
            ],
          },
          {
            topic: 'Reading',
            questions: [
              'Do you enjoy reading?',
              'What kind of books do you prefer?',
              'Do you read more in print or digitally?',
              'Did you read a lot as a child?',
            ],
          },
        ],
      },
      part2: {
        cueCard: {
          topic: 'Describe a skill that you learned from an older person.',
          bullets: [
            'Who taught you this skill',
            'What the skill was',
            'How you learned it',
            'And explain how this skill has been useful to you',
          ],
          followUpQuestions: [
            'Do you still use this skill today?',
            'Would you teach it to someone else?',
          ],
        },
      },
      part3: {
        questions: [
          'What skills do young people typically learn from older generations?',
          'Do you think traditional skills are being lost in modern society?',
          'How has technology changed the way we learn new skills?',
          'Should schools teach more practical skills?',
          'What role do grandparents play in teaching children?',
          'Is it easier to learn from family members or professional teachers?',
        ],
      },
    },
  },
  {
    id: 'IT002',
    code: 'NZ-IELTS-002',
    title: 'Listening Practice — City Life',
    variant: 'Academic',
    skills: ['Listening'],
    status: 'Published',
    createdBy: 'Nguyễn Văn An',
    createdAt: '12/04/2026',
    updatedAt: '15/04/2026',
    durationMinutes: 40,
    tags: ['Practice', 'Band 5.5+'],
    description: 'A short Listening practice test focusing on everyday city conversations.',
    listening: {
      parts: [
        {
          partNumber: 1,
          context: 'Phone enquiry about a fitness centre membership.',
          audioFileName: 'listening_p1_fitness.mp3',
          audioDurationSec: 280,
          questionGroups: [
            {
              id: 'QG-L1-P1',
              type: 'NoteCompletion',
              instruction: 'Complete the form. Write NO MORE THAN TWO WORDS AND/OR A NUMBER.',
              presentation: 'TypeIn',
              wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
              questions: [
                { number: 1, prompt: 'Name: Daniel __________', answer: 'Thompson', points: 1 },
                { number: 2, prompt: 'Membership type: __________', answer: 'monthly', points: 1 },
                { number: 3, prompt: 'Monthly fee: £__________', answer: '45', points: 1 },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: 'IT003',
    code: 'NZ-IELTS-003',
    title: 'Writing Workshop — Opinion Essays',
    variant: 'Academic',
    skills: ['Writing'],
    status: 'Draft',
    createdBy: 'Nguyễn Văn An',
    createdAt: '17/04/2026',
    updatedAt: '18/04/2026',
    durationMinutes: 60,
    tags: ['Workshop', 'Task 2 Focus'],
    description: 'A workshop-style test focusing on Task 2 opinion essays.',
    writing: {
      task1: {
        taskNumber: 1,
        taskType: 'LineGraph',
        prompt: 'The line graph below shows the percentage of households owning a car in four European countries from 1980 to 2020. Summarise the information.',
        imageFileName: 'writing_t1_linegraph.png',
        minWords: 150,
        timeMinutes: 20,
      },
      task2: {
        taskNumber: 2,
        taskType: 'Opinion',
        prompt: 'Some people think that governments should invest more in public transport than in building new roads. To what extent do you agree or disagree?',
        minWords: 250,
        timeMinutes: 40,
      },
    },
  },
];
