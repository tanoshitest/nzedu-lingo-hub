import { type QuestionGroup } from './mockIeltsTests';

export type BankSkill = 'Listening' | 'Reading';
export type BankDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface BankItem {
  id: string;
  skill: BankSkill;
  title: string;                  // quick label shown in the list
  tags: string[];
  difficulty: BankDifficulty;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  usageCount: number;
  group: QuestionGroup;
  passageExcerpt?: string;        // Reading context
  audioContext?: string;          // Listening context
}

export const bankDifficultyColors: Record<BankDifficulty, string> = {
  Easy: 'bg-success/10 text-success border-success/20',
  Medium: 'bg-info/10 text-info border-info/20',
  Hard: 'bg-warning/10 text-warning border-warning/20',
};

export const bankSkillColors: Record<BankSkill, string> = {
  Listening: 'bg-info/10 text-info border-info/20',
  Reading: 'bg-primary/10 text-primary border-primary/20',
};

const today = '2026-04-15';

export const bankItems: BankItem[] = [
  {
    id: 'QB-001',
    skill: 'Listening',
    title: 'Travel agent booking — MCQ',
    tags: ['Part 1', 'Travel', 'Cambridge 17'],
    difficulty: 'Easy',
    createdBy: 'Admin',
    createdAt: today,
    updatedAt: today,
    usageCount: 3,
    audioContext: 'Conversation between a customer and a travel agent about booking a holiday to Spain.',
    group: {
      id: 'BANK-QG-001',
      type: 'MultipleChoice',
      presentation: 'Radio',
      instruction: 'Choose the correct letter, A, B, or C.',
      questions: [
        { number: 1, prompt: 'The customer wants to travel in', options: ['May', 'June', 'July'], answer: 'June', points: 1 },
        { number: 2, prompt: 'How many people will travel?', options: ['2', '3', '4'], answer: '4', points: 1 },
        { number: 3, prompt: 'The preferred accommodation is', options: ['hotel', 'apartment', 'villa'], answer: 'villa', points: 1 },
      ],
    },
  },
  {
    id: 'QB-002',
    skill: 'Listening',
    title: 'Library tour — Note Completion',
    tags: ['Part 2', 'Education', 'Monologue'],
    difficulty: 'Medium',
    createdBy: 'Admin',
    createdAt: today,
    updatedAt: today,
    usageCount: 1,
    audioContext: 'Tour guide describing the university library facilities.',
    group: {
      id: 'BANK-QG-002',
      type: 'NoteCompletion',
      presentation: 'TypeIn',
      instruction: 'Complete the notes. Write NO MORE THAN TWO WORDS for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS',
      questions: [
        { number: 1, prompt: 'Library opens at ___ on weekdays', answer: '8 am', points: 1 },
        { number: 2, prompt: 'Silent study area is on the ___ floor', answer: 'third', points: 1 },
        { number: 3, prompt: 'Students can borrow up to ___ books', answer: 'ten', points: 1 },
        { number: 4, prompt: 'Printing costs ___ cents per page', answer: 'ten', points: 1 },
      ],
    },
  },
  {
    id: 'QB-003',
    skill: 'Listening',
    title: 'Campus map — Map Labelling',
    tags: ['Part 2', 'Map', 'Drag-Drop'],
    difficulty: 'Hard',
    createdBy: 'Admin',
    createdAt: today,
    updatedAt: today,
    usageCount: 2,
    audioContext: 'Orientation session describing the university campus layout.',
    group: {
      id: 'BANK-QG-003',
      type: 'MapPlanLabel',
      presentation: 'DragDrop',
      instruction: 'Label the map. Drag items A–F to the correct location.',
      imageFileName: 'campus_map.png',
      wordBank: ['Cafeteria', 'Library', 'Gym', 'Admin Block', 'Lecture Hall', 'Dormitory'],
      questions: [
        { number: 1, prompt: 'Building 1', answer: 'Cafeteria', points: 1 },
        { number: 2, prompt: 'Building 2', answer: 'Library', points: 1 },
        { number: 3, prompt: 'Building 3', answer: 'Lecture Hall', points: 1 },
        { number: 4, prompt: 'Building 4', answer: 'Admin Block', points: 1 },
        { number: 5, prompt: 'Building 5', answer: 'Dormitory', points: 1 },
      ],
    },
  },
  {
    id: 'QB-004',
    skill: 'Reading',
    title: 'History of Glass — TFNG',
    tags: ['Passage 1', 'History', 'Cambridge 17'],
    difficulty: 'Medium',
    createdBy: 'Admin',
    createdAt: today,
    updatedAt: today,
    usageCount: 4,
    passageExcerpt: 'Glass is made from sand, soda ash and limestone. It was first produced around 3500 BC in ancient Mesopotamia...',
    group: {
      id: 'BANK-QG-004',
      type: 'TrueFalseNotGiven',
      presentation: 'Radio',
      instruction: 'Do the following statements agree with the information in the passage? Write TRUE, FALSE or NOT GIVEN.',
      questions: [
        { number: 1, prompt: 'Glass was invented in ancient Egypt.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], answer: 'FALSE', points: 1 },
        { number: 2, prompt: 'Glass production requires high temperatures.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], answer: 'TRUE', points: 1 },
        { number: 3, prompt: 'Roman glassmakers were considered skilled craftsmen.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], answer: 'NOT GIVEN', points: 1 },
        { number: 4, prompt: 'Modern glass is stronger than ancient glass.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], answer: 'TRUE', points: 1 },
      ],
    },
  },
  {
    id: 'QB-005',
    skill: 'Reading',
    title: 'Climate Change — Matching Headings',
    tags: ['Passage 2', 'Environment', 'Drag-Drop'],
    difficulty: 'Hard',
    createdBy: 'Admin',
    createdAt: today,
    updatedAt: today,
    usageCount: 2,
    passageExcerpt: 'The earth\'s climate has been changing rapidly due to human activity. This article examines five major aspects...',
    group: {
      id: 'BANK-QG-005',
      type: 'MatchingHeadings',
      presentation: 'DragDrop',
      instruction: 'Match each paragraph with the correct heading from the list below.',
      wordBank: [
        'Causes of global warming',
        'Melting polar ice caps',
        'Rising sea levels worldwide',
        'Impact on wildlife',
        'Policy responses',
        'Renewable energy solutions',
        'Individual action matters',
      ],
      questions: [
        { number: 1, prompt: 'Paragraph A', answer: 'Causes of global warming', points: 1 },
        { number: 2, prompt: 'Paragraph B', answer: 'Melting polar ice caps', points: 1 },
        { number: 3, prompt: 'Paragraph C', answer: 'Impact on wildlife', points: 1 },
        { number: 4, prompt: 'Paragraph D', answer: 'Policy responses', points: 1 },
        { number: 5, prompt: 'Paragraph E', answer: 'Renewable energy solutions', points: 1 },
      ],
    },
  },
  {
    id: 'QB-006',
    skill: 'Reading',
    title: 'Workplace Stress — Summary Completion',
    tags: ['Passage 3', 'Health', 'Word Bank'],
    difficulty: 'Medium',
    createdBy: 'Admin',
    createdAt: today,
    updatedAt: today,
    usageCount: 3,
    passageExcerpt: 'Workplace stress has become one of the leading causes of chronic illness in modern economies...',
    group: {
      id: 'BANK-QG-006',
      type: 'SummaryCompletion',
      presentation: 'Dropdown',
      instruction: 'Complete the summary using words from the list below.',
      wordBank: ['pressure', 'wellbeing', 'productivity', 'burnout', 'managers', 'deadlines', 'flexibility', 'remote'],
      questions: [
        { number: 1, prompt: 'The biggest driver of stress is unrealistic ___.', answer: 'deadlines', points: 1 },
        { number: 2, prompt: 'Companies now focus on employee ___.', answer: 'wellbeing', points: 1 },
        { number: 3, prompt: 'Offering ___ reduces attrition.', answer: 'flexibility', points: 1 },
        { number: 4, prompt: 'Chronic stress leads to ___.', answer: 'burnout', points: 1 },
      ],
    },
  },
  {
    id: 'QB-007',
    skill: 'Reading',
    title: 'Artificial Intelligence — Yes/No/Not Given',
    tags: ['Passage 2', 'Technology', 'Opinion'],
    difficulty: 'Hard',
    createdBy: 'Admin',
    createdAt: today,
    updatedAt: today,
    usageCount: 1,
    passageExcerpt: 'The author argues that artificial intelligence will reshape white-collar work within a decade...',
    group: {
      id: 'BANK-QG-007',
      type: 'YesNoNotGiven',
      presentation: 'Radio',
      instruction: 'Do the following statements agree with the views of the writer? Write YES, NO or NOT GIVEN.',
      questions: [
        { number: 1, prompt: 'AI will eliminate most white-collar jobs.', options: ['YES', 'NO', 'NOT GIVEN'], answer: 'NO', points: 1 },
        { number: 2, prompt: 'Reskilling is essential for modern workers.', options: ['YES', 'NO', 'NOT GIVEN'], answer: 'YES', points: 1 },
        { number: 3, prompt: 'The author has worked in AI research.', options: ['YES', 'NO', 'NOT GIVEN'], answer: 'NOT GIVEN', points: 1 },
      ],
    },
  },
  {
    id: 'QB-008',
    skill: 'Listening',
    title: 'Lecture on Bees — Sentence Completion',
    tags: ['Part 4', 'Biology', 'Academic'],
    difficulty: 'Hard',
    createdBy: 'Admin',
    createdAt: today,
    updatedAt: today,
    usageCount: 0,
    audioContext: 'University lecture on the ecological role of bees and colony collapse disorder.',
    group: {
      id: 'BANK-QG-008',
      type: 'SentenceCompletion',
      presentation: 'TypeIn',
      instruction: 'Complete each sentence. Write NO MORE THAN THREE WORDS for each answer.',
      wordLimit: 'NO MORE THAN THREE WORDS',
      questions: [
        { number: 1, prompt: 'Bees pollinate approximately ___ of global crops.', answer: 'one third', points: 1 },
        { number: 2, prompt: 'Colony collapse was first reported in ___.', answer: '2006', points: 1 },
        { number: 3, prompt: 'The main cause is believed to be ___.', answer: 'pesticide use', points: 1 },
        { number: 4, prompt: 'Conservation efforts focus on ___ habitats.', answer: 'wild flower', points: 1 },
      ],
    },
  },
];
