export type SubmissionStatus = 'Submitted' | 'Assigned' | 'Grading' | 'PendingApproval' | 'Approved' | 'Returned';

export interface Submission {
  id: string;
  studentId: string;
  studentName: string;
  lessonId: string;
  lessonTitle: string;
  className: string;
  fileName: string;
  fileSize: string;
  submittedAt: string;
  assignedTeacherId?: string;
  gradingDeadline?: string;
  score?: number;
  feedback?: string;
  gradedAt?: string;
  approvalNote?: string;
  status: SubmissionStatus;
}

export const submissionStatusLabels: Record<SubmissionStatus, string> = {
  Submitted: 'Đã nộp',
  Assigned: 'Đã phân công',
  Grading: 'Đang chấm',
  PendingApproval: 'Chờ Giáo vụ duyệt',
  Approved: 'Đã có điểm',
  Returned: 'Trả lại',
};

export const submissionStatusColors: Record<SubmissionStatus, string> = {
  Submitted: 'bg-info/10 text-info border-info/20',
  Assigned: 'bg-primary/10 text-primary border-primary/20',
  Grading: 'bg-warning/10 text-warning border-warning/20',
  PendingApproval: 'bg-warning/10 text-warning border-warning/20',
  Approved: 'bg-success/10 text-success border-success/20',
  Returned: 'bg-destructive/10 text-destructive border-destructive/20',
};

export const submissions: Submission[] = [
  {
    id: 'SB001',
    studentId: 'U005',
    studentName: 'Hoàng Minh Đức',
    lessonId: 'L07',
    lessonTitle: 'Lesson 7 - Writing Task 2: Opinion Essay',
    className: 'IELTS 6.5 - Lớp A1',
    fileName: 'writing_task2_duc.pdf',
    fileSize: '1.2 MB',
    submittedAt: '17/04/2026 20:15',
    assignedTeacherId: 'U003',
    gradingDeadline: '20/04/2026',
    status: 'Grading',
  },
  {
    id: 'SB002',
    studentId: 'U005',
    studentName: 'Hoàng Minh Đức',
    lessonId: 'L06',
    lessonTitle: 'Lesson 6 - Reading Test Cambridge 17',
    className: 'IELTS 6.5 - Lớp A1',
    fileName: 'reading_test3_duc.pdf',
    fileSize: '856 KB',
    submittedAt: '15/04/2026 19:42',
    assignedTeacherId: 'U004',
    gradingDeadline: '19/04/2026',
    score: 8.0,
    feedback: 'Bài làm cẩn thận, điểm Reading khá tốt. Cần cải thiện phần True/False/Not Given.',
    gradedAt: '17/04/2026',
    status: 'PendingApproval',
  },
  {
    id: 'SB003',
    studentId: 'U007',
    studentName: 'Đỗ Quang Huy',
    lessonId: 'L05',
    lessonTitle: 'Lesson 5 - Listening Practice',
    className: 'IELTS 6.5 - Lớp A1',
    fileName: 'listening_practice_huy.pdf',
    fileSize: '720 KB',
    submittedAt: '16/04/2026 21:10',
    status: 'Submitted',
  },
  {
    id: 'SB004',
    studentId: 'U005',
    studentName: 'Hoàng Minh Đức',
    lessonId: 'L05',
    lessonTitle: 'Lesson 5 - Listening Practice',
    className: 'IELTS 6.5 - Lớp A1',
    fileName: 'listening_duc.pdf',
    fileSize: '680 KB',
    submittedAt: '10/04/2026 18:30',
    assignedTeacherId: 'U003',
    gradingDeadline: '14/04/2026',
    score: 8.5,
    feedback: 'Rất tốt! Phần Section 3 và 4 xử lý ổn.',
    gradedAt: '13/04/2026',
    approvalNote: 'Đã duyệt, điểm hợp lý',
    status: 'Approved',
  },
  {
    id: 'SB005',
    studentId: 'U007',
    studentName: 'Đỗ Quang Huy',
    lessonId: 'L06',
    lessonTitle: 'Lesson 6 - Reading Test Cambridge 17',
    className: 'IELTS 6.5 - Lớp A1',
    fileName: 'reading_huy.pdf',
    fileSize: '910 KB',
    submittedAt: '15/04/2026 20:00',
    assignedTeacherId: 'U003',
    gradingDeadline: '19/04/2026',
    status: 'Assigned',
  },
  {
    id: 'SB006',
    studentId: 'U005',
    studentName: 'Hoàng Minh Đức',
    lessonId: 'L04',
    lessonTitle: 'Lesson 4 - Speaking Part 2',
    className: 'IELTS 6.5 - Lớp A1',
    fileName: 'speaking_recording.mp3',
    fileSize: '4.5 MB',
    submittedAt: '05/04/2026 19:00',
    assignedTeacherId: 'U003',
    gradingDeadline: '08/04/2026',
    score: 7.5,
    feedback: 'Phát âm tốt, cần thêm từ vựng academic.',
    gradedAt: '07/04/2026',
    approvalNote: 'Duyệt',
    status: 'Approved',
  },
  {
    id: 'SB007',
    studentId: 'U007',
    studentName: 'Đỗ Quang Huy',
    lessonId: 'L04',
    lessonTitle: 'Lesson 4 - Speaking Part 2',
    className: 'IELTS 6.5 - Lớp A1',
    fileName: 'speaking_huy.mp3',
    fileSize: '3.8 MB',
    submittedAt: '05/04/2026 18:45',
    assignedTeacherId: 'U003',
    gradingDeadline: '08/04/2026',
    score: 6.5,
    feedback: 'Lưu loát, ý tưởng tốt nhưng nhiều lỗi ngữ pháp nhỏ.',
    gradedAt: '07/04/2026',
    status: 'Returned',
    approvalNote: 'Đề nghị GV viết feedback chi tiết hơn phần Grammar.',
  },
  {
    id: 'SB008',
    studentId: 'U005',
    studentName: 'Hoàng Minh Đức',
    lessonId: 'L08',
    lessonTitle: 'Lesson 8 - Writing Task 1: Graph',
    className: 'IELTS 6.5 - Lớp A1',
    fileName: 'task1_graph_duc.pdf',
    fileSize: '980 KB',
    submittedAt: '18/04/2026 08:20',
    status: 'Submitted',
  },
];

/** Lesson list for Student "Nộp bài" UI */
export interface LessonAssignment {
  id: string;
  title: string;
  className: string;
  dueDate: string;
  submitted: boolean;
  submissionId?: string;
}

export const lessonAssignments: LessonAssignment[] = [
  { id: 'L09', title: 'Lesson 9 - Writing Task 2: Discussion Essay', className: 'IELTS 6.5 - Lớp A1', dueDate: '24/04/2026', submitted: false },
  { id: 'L08', title: 'Lesson 8 - Writing Task 1: Graph', className: 'IELTS 6.5 - Lớp A1', dueDate: '22/04/2026', submitted: true, submissionId: 'SB008' },
  { id: 'L07', title: 'Lesson 7 - Writing Task 2: Opinion Essay', className: 'IELTS 6.5 - Lớp A1', dueDate: '18/04/2026', submitted: true, submissionId: 'SB001' },
  { id: 'L06', title: 'Lesson 6 - Reading Test Cambridge 17', className: 'IELTS 6.5 - Lớp A1', dueDate: '16/04/2026', submitted: true, submissionId: 'SB002' },
  { id: 'L05', title: 'Lesson 5 - Listening Practice', className: 'IELTS 6.5 - Lớp A1', dueDate: '12/04/2026', submitted: true, submissionId: 'SB004' },
  { id: 'L04', title: 'Lesson 4 - Speaking Part 2', className: 'IELTS 6.5 - Lớp A1', dueDate: '08/04/2026', submitted: true, submissionId: 'SB006' },
];
