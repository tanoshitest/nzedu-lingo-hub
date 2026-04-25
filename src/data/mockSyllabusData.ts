import { Course, SyllabusTemplate, SyllabusLessonTemplate, Class, ClassLesson, User } from '../types/syllabus';

export const mockUsers: User[] = [
  { id: 'u1', name: 'Nguyen Van A', role: 'LEAD_TEACHER' },
  { id: 'u2', name: 'Tran Thi B', role: 'PART_TIME_TEACHER' },
];

export const mockCourses: (Course & { activeClasses: string[] })[] = [
  {
    id: 'c-ielts6',
    name: 'IELTS 6.0',
    description: 'Targeting 6.0 overall band score',
    activeClasses: ['IELTS-6.0-A1', 'IELTS-6.0-A2', 'IELTS-6.0-B1'],
  },
  {
    id: 'c-ielts7',
    name: 'IELTS 7.0',
    description: 'Advanced targeting 7.0 overall band score',
    activeClasses: ['IELTS-7.0-X1', 'IELTS-7.0-X2'],
  },
  {
    id: 'c-ielts8',
    name: 'IELTS 8.0',
    description: 'Expert targeting 8.0 overall band score',
    activeClasses: ['IELTS-8.0-VIP'],
  },
  {
    id: 'c-ielts9',
    name: 'IELTS 9.0',
    description: 'Mastery targeting 9.0 overall band score',
    activeClasses: ['IELTS-9.0-Elite'],
  },
];

export const mockSyllabusLessons: SyllabusLessonTemplate[] = [
  {
    id: 'slt1',
    syllabusTemplateId: 'st1',
    weekNumber: 1,
    topicName: 'Introduction to IELTS & Diagnostic Test',
    lessonNumber: 1,
    pages: { pupilBook: '10-15', activityBook: '5-10' },
    skills: { L: true, S: true, R: true, W: true },
    content: {
      vocabulary: 'Academic context, Assessment criteria',
      language: 'Present Tenses, Paraphrasing techniques',
    },
    lessonOutcome: 'Students understand the test format and identify their baseline.',
    lessonReminder: 'Complete the personality quiz on p.12. Bring headphones.',
  },
  {
    id: 'slt2',
    syllabusTemplateId: 'st1',
    weekNumber: 1,
    topicName: 'Listening: Form Completion & Spelling',
    lessonNumber: 2,
    pages: { pupilBook: '16-20', activityBook: '11-15' },
    skills: { L: true, S: false, R: false, W: false },
    content: {
      vocabulary: 'Names, Addresses, Numbers',
      language: 'Predicting answers, Identifying distractors',
    },
    lessonOutcome: 'Students can accurately capture personal details in Listening Part 1.',
    lessonReminder: 'Listen to the BBC podcast provided. Practice spelling names.',
  },
  {
    id: 'slt3',
    syllabusTemplateId: 'st1',
    weekNumber: 2,
    topicName: 'Reading: Skimming & Scanning',
    lessonNumber: 3,
    pages: { pupilBook: '21-25', activityBook: '16-20' },
    skills: { L: false, S: false, R: true, W: false },
    content: {
      vocabulary: 'Technical terms, Synonyms',
      language: 'Main idea identification, Keyword matching',
    },
    lessonOutcome: 'Students can quickly locate information in long texts.',
    lessonReminder: 'Read the article in Pupil Book p.22 and highlight main ideas.',
  },
];

export const mockClass: Class = {
  id: 'cl1',
  name: 'IELTS-6.0-A1',
  courseId: 'c-ielts6',
  leadTeacherId: 'u1',
  totalLessons: 40,
  completedLessons: 2,
};

export const mockClassLessons: ClassLesson[] = [
  {
    id: 'cls1',
    classId: 'cl1',
    templateId: 'slt1',
    weekNumber: 1,
    topicName: 'Introduction to IELTS & Diagnostic Test',
    lessonNumber: 1,
    pages: { pupilBook: '10-15', activityBook: '5-10' },
    skills: { L: true, S: true, R: true, W: true },
    content: {
      vocabulary: 'Academic context, Assessment criteria',
      language: 'Present Tenses, Paraphrasing techniques',
    },
    lessonOutcome: 'Students understand the test format and identify their baseline.',
    lessonReminder: 'Complete the personality quiz on p.12. Bring headphones.',
    status: 'Completed',
    isExtraLesson: false,
    assignedTeacherId: 'u1',
    teachingDate: '2026-04-20',
  },
  {
    id: 'cls2',
    classId: 'cl1',
    templateId: 'slt2',
    weekNumber: 1,
    topicName: 'Listening: Form Completion & Spelling',
    lessonNumber: 2,
    pages: { pupilBook: '16-20', activityBook: '11-15' },
    skills: { L: true, S: false, R: false, W: false },
    content: {
      vocabulary: 'Names, Addresses, Numbers',
      language: 'Predicting answers, Identifying distractors',
    },
    lessonOutcome: 'Students can accurately capture personal details in Listening Part 1.',
    lessonReminder: 'Listen to the BBC podcast provided. Practice spelling names.',
    status: 'Completed',
    isExtraLesson: false,
    assignedTeacherId: 'u2',
    teachingDate: '2026-04-22',
  },
];
