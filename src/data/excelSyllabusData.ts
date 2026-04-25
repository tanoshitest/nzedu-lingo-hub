import { SyllabusLessonTemplate } from '../types/syllabus';

export interface VocabItem {
  word: string;
  pronunciation: string; // Cách đọc
  phonetics: string;     // Phiên âm
  meaning: string;
  example: string;
}

export interface GrammarItem {
  topic: string;
  example: string;
}

export interface DetailedLesson extends SyllabusLessonTemplate {
  phaseId: string; // NK1, NK2, NK3, NK4
  type?: 'lesson' | 'test'; // Phân loại bài học hoặc bài kiểm tra
  lectureSlide?: { label: string; url: string };
  quiz?: { label: string; url: string };
  periodicTest?: { label: string; url: string };
  inClassTasks?: string[];
  onlineTasks?: { label: string; url: string }[];
  vocabularyList?: VocabItem[];
  grammarList?: GrammarItem[];
  homeworkList?: string[];
}

const generatePhaseLessons = (phaseId: string, phaseNum: number) => {
  const lessons: DetailedLesson[] = [];
  for (let i = 1; i <= 10; i++) {
    lessons.push({
      id: `${phaseId.toLowerCase()}-${i}`,
      phaseId,
      type: 'lesson',
      syllabusTemplateId: `st${phaseNum}`,
      weekNumber: Math.ceil(i / 2),
      topicName: `Unit ${i}: Topic Name ${i}`,
      lessonNumber: i,
      pages: { pupilBook: `${i*10}-${i*10+1}`, activityBook: `${i*10}-${i*10+1}` },
      skills: { L: true, S: true, R: i % 2 === 0, W: i % 3 === 0 },
      vocabularyList: [
        { word: 'Example', pronunciation: 'Eg-zam-pờl', phonetics: '/ɪɡˈzɑːm.pəl/', meaning: 'Ví dụ', example: 'This is an example.' }
      ],
      grammarList: [
        { topic: 'Grammar Topic', example: 'Example sentence for grammar.' }
      ],
      homeworkList: ['Task 1', 'Task 2']
    });

    if (i === 5) {
      lessons.push({
        id: `${phaseId.toLowerCase()}-mid`,
        phaseId,
        type: 'test',
        topicName: `MIDTERM TEST (CHẶNG ${phaseNum})`,
        lessonNumber: 5.5,
        weekNumber: 3,
        pages: { pupilBook: '', activityBook: '' },
        skills: { L: true, S: true, R: true, W: true }
      });
    }

    if (i === 10) {
      lessons.push({
        id: `${phaseId.toLowerCase()}-final`,
        phaseId,
        type: 'test',
        topicName: `FINAL TEST (CHẶNG ${phaseNum})`,
        lessonNumber: 10.5,
        weekNumber: 5,
        pages: { pupilBook: '', activityBook: '' },
        skills: { L: true, S: true, R: true, W: true }
      });
    }
  }
  return lessons;
};

export const phaseLessons: DetailedLesson[] = [
  ...generatePhaseLessons('NK1', 1),
  ...generatePhaseLessons('NK2', 2),
  ...generatePhaseLessons('NK3', 3),
  ...generatePhaseLessons('NK4', 4),
];

// Special overrides for NK1-B1 to keep the detailed data we entered
const b1Index = phaseLessons.findIndex(l => l.id === 'nk1-1');
if (b1Index !== -1) {
  phaseLessons[b1Index] = {
    ...phaseLessons[b1Index],
    topicName: 'Unit 1: First Day',
    vocabularyList: [
      { word: 'Danny', pronunciation: 'Đan-ni', phonetics: '/ˈdæni/', meaning: 'Tên riêng (Danny)', example: 'Danny is my friend.' },
      { word: 'Emma', pronunciation: 'Em-ma', phonetics: '/ˈemə/', meaning: 'Tên riêng (Emma)', example: 'Emma is a smart girl.' },
      { word: 'Pen', pronunciation: 'Pen', phonetics: '/pen/', meaning: 'Cây bút mực', example: 'This is a blue pen.' },
      { word: 'Pencil', pronunciation: 'Pen-xờl', phonetics: '/ˈpensl/', meaning: 'Cây bút chì', example: 'I have a new pencil.' }
    ],
    grammarList: [
      { topic: 'Hỏi về tên đồ vật (Số ít)', example: 'What is it? -> It is a pen.' },
      { topic: 'Mạo từ "a" và "an"', example: 'A ruler, a pencil, an eraser.' }
    ],
    homeworkList: [
      'Thuộc lòng 80% từ vựng',
      'Thực hành luyện hỏi và trả lời cấu trúc đã học (Quay video thu hoạch lên nhóm)',
      'Hoàn thành sách BT: trang 4-5',
      'Hoàn thành sách Extra Workbook'
    ],
    lessonOutcome: '- remember 80% new words; - recognise new words, pronounce words with clear beginning and ending sounds; - define characters of the book; - Able to understand questions and answer with full sentences',
    lectureSlide: { label: 'Slide bài giảng Buổi 1 - Unit 1', url: '#' },
    quiz: { label: 'Quiz kiểm tra từ vựng B1', url: '#' },
    periodicTest: { label: 'Bài kiểm tra đầu vào (Placement Test)', url: '#' }
  };
}

export const phases = [
  { 
    id: 'NK1', 
    label: 'NK1 - Syllabus Pre Starters 1', 
    goals: [
      'talk about school supplies',
      'ask questions using What is it?/ It is a pen...',
      'Yes/ No questions: Is it a pen?/ Yes, it is/ No, it isn\'t',
      'Able to listen and point at words correctly'
    ]
  },
  { 
    id: 'NK2', 
    label: 'NK2 - Syllabus Pre Starters 2', 
    goals: [
      'Master numbers from 1 to 20',
      'Describe basic colors and shapes of objects',
      'Understand and follow simple classroom commands',
      'Identify and name common animals and pets'
    ]
  },
  { 
    id: 'NK3', 
    label: 'NK3 - Syllabus Starters', 
    goals: [
      'Express likes and dislikes about food and hobbies',
      'Describe family members and their characteristics',
      'Talk about daily routines and activities',
      'Understand and use basic prepositions of place'
    ]
  },
  { 
    id: 'NK4', 
    label: 'NK4 - Syllabus Movers', 
    goals: [
      'Talk about past events using simple past tense',
      'Compare objects and people using basic adjectives',
      'Describe weather conditions and seasons',
      'Master vocabulary related to health and symptoms'
    ]
  },
];
