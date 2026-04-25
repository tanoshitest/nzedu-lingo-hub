export type Course = {
  id: string;
  name: string;
  description?: string;
};

export type SyllabusTemplate = {
  id: string;
  courseId: string;
  name: string;
};

export type SyllabusLessonTemplate = {
  id: string;
  syllabusTemplateId: string;
  weekNumber: number;
  topicName: string;
  lessonNumber: number;
  pages: {
    pupilBook: string;
    activityBook: string;
  };
  skills: {
    L: boolean;
    S: boolean;
    R: boolean;
    W: boolean;
  };
  content: {
    vocabulary: string;
    language: string;
  };
  lessonOutcome: string;
  lessonReminder: string; // Homework/Summary
};

export type Class = {
  id: string;
  name: string;
  courseId: string;
  leadTeacherId: string;
  totalLessons: number;
  completedLessons: number;
};

export type ClassLesson = {
  id: string;
  classId: string;
  templateId?: string; // Original lesson template ID if cloned
  weekNumber: number;
  topicName: string;
  lessonNumber: number;
  pages: {
    pupilBook: string;
    activityBook: string;
  };
  skills: {
    L: boolean;
    S: boolean;
    R: boolean;
    W: boolean;
  };
  content: {
    vocabulary: string;
    language: string;
  };
  lessonOutcome: string;
  lessonReminder: string;
  status: 'Pending' | 'Completed';
  isExtraLesson: boolean;
  assignedTeacherId: string;
  teachingDate: string;
};

export type UserRole = 'ADMIN' | 'LEAD_TEACHER' | 'PART_TIME_TEACHER';

export type User = {
  id: string;
  name: string;
  role: UserRole;
};
