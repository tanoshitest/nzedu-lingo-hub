import type { Course } from '@/data/mockFinance';

export type CourseRole = 'Student' | 'Teacher';

export interface TabContext {
  course: Course;
  role: CourseRole;
  studentId?: string;
  className?: string;
  teacherName?: string;
}
