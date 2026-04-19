import { type IeltsSkill } from './mockIeltsTests';

export type AssignmentStatus = 'Scheduled' | 'Open' | 'Closed';
export type AttemptStatus = 'NotStarted' | 'InProgress' | 'Submitted' | 'Grading' | 'PendingApproval' | 'Approved' | 'Returned';

export interface TestAssignment {
  id: string;
  testId: string;
  testCode: string;
  testTitle: string;
  skills: IeltsSkill[];
  assignedBy: string;
  assignedByRole: 'Coordinator' | 'Teacher';
  classId?: string;
  className?: string;
  studentIds: string[];
  studentNames: string[];        // denorm for display
  openAt: string;                // yyyy-mm-dd
  dueAt: string;
  durationMinutes: number;
  status: AssignmentStatus;
  instructions?: string;
}

export interface AttemptAnswer {
  groupId: string;
  questionNumber: number;
  answer: string | string[];
  isCorrect?: boolean;
}

export interface WritingResponse {
  taskNumber: 1 | 2;
  text: string;
  wordCount: number;
  taskAchievement?: number;
  coherence?: number;
  lexical?: number;
  grammar?: number;
  bandOverall?: number;
  feedback?: string;
}

export interface SpeakingResponse {
  partNumber: 1 | 2 | 3;
  promptIndex: number;           // index inside the part
  prompt: string;
  audioBlobUrl?: string;
  audioFileName?: string;
  recordedDurationSec?: number;
  band?: number;
  feedback?: string;
}

export interface TestAttempt {
  id: string;
  assignmentId: string;
  testId: string;
  studentId: string;
  studentName: string;
  startedAt?: string;
  submittedAt?: string;
  durationUsedSec?: number;
  status: AttemptStatus;
  answers: AttemptAnswer[];
  writingResponses: WritingResponse[];
  speakingResponses: SpeakingResponse[];
  autoScoreListening?: number;     // raw correct count
  autoScoreReading?: number;
  listeningTotal?: number;         // total questions in section
  readingTotal?: number;
  listeningBand?: number;
  readingBand?: number;
  writingBand?: number;
  speakingBand?: number;
  overallBand?: number;
  teacherFeedback?: string;
  coordinatorApprovalNote?: string;
  gradedBy?: string;
  gradedAt?: string;
}

export const assignmentStatusColors: Record<AssignmentStatus, string> = {
  Scheduled: 'bg-muted text-muted-foreground border-border',
  Open: 'bg-success/10 text-success border-success/20',
  Closed: 'bg-warning/10 text-warning border-warning/20',
};

export const attemptStatusColors: Record<AttemptStatus, string> = {
  NotStarted: 'bg-muted text-muted-foreground border-border',
  InProgress: 'bg-info/10 text-info border-info/20',
  Submitted: 'bg-primary/10 text-primary border-primary/20',
  Grading: 'bg-warning/10 text-warning border-warning/20',
  PendingApproval: 'bg-warning/10 text-warning border-warning/20',
  Approved: 'bg-success/10 text-success border-success/20',
  Returned: 'bg-destructive/10 text-destructive border-destructive/20',
};

export const attemptStatusLabels: Record<AttemptStatus, string> = {
  NotStarted: 'Chưa làm',
  InProgress: 'Đang làm',
  Submitted: 'Đã nộp',
  Grading: 'Đang chấm',
  PendingApproval: 'Chờ duyệt',
  Approved: 'Đã duyệt',
  Returned: 'Trả lại',
};

// Simplified IELTS raw → band conversion (Listening/Reading 40-question scale)
export const rawToBand = (raw: number, total: number): number => {
  if (total === 0) return 0;
  const pct = raw / total;
  if (pct >= 0.975) return 9;
  if (pct >= 0.925) return 8.5;
  if (pct >= 0.875) return 8;
  if (pct >= 0.8) return 7.5;
  if (pct >= 0.725) return 7;
  if (pct >= 0.65) return 6.5;
  if (pct >= 0.575) return 6;
  if (pct >= 0.5) return 5.5;
  if (pct >= 0.4) return 5;
  if (pct >= 0.3) return 4.5;
  if (pct >= 0.2) return 4;
  return 3.5;
};

// Seed: 1 assignment for IT001 to a few students with varied attempt statuses
export const testAssignments: TestAssignment[] = [
  {
    id: 'TA-001',
    testId: 'IT001',
    testCode: 'NZ-IELTS-001',
    testTitle: 'Cambridge 17 — Mock Test 1',
    skills: ['Listening', 'Reading', 'Writing', 'Speaking'],
    assignedBy: 'Trần Thị Bình',
    assignedByRole: 'Coordinator',
    classId: 'CL-A1',
    className: 'IELTS 6.5 - Lớp A1',
    studentIds: ['S001', 'S002', 'S003', 'S004'],
    studentNames: ['Hoàng Minh Đức', 'Vũ Thị Hà', 'Đỗ Quang Huy', 'Nguyễn Thảo My'],
    openAt: '2026-04-15',
    dueAt: '2026-04-22',
    durationMinutes: 165,
    status: 'Open',
    instructions: 'Vui lòng đảm bảo bạn ngồi ở nơi yên tĩnh, có tai nghe và microphone hoạt động trước khi bắt đầu.',
  },
  {
    id: 'TA-002',
    testId: 'IT002',
    testCode: 'NZ-IELTS-002',
    testTitle: 'Listening Practice — Set A',
    skills: ['Listening'],
    assignedBy: 'Lê Hoàng Cường',
    assignedByRole: 'Teacher',
    classId: 'CL-A1',
    className: 'IELTS 6.5 - Lớp A1',
    studentIds: ['S001', 'S002'],
    studentNames: ['Hoàng Minh Đức', 'Vũ Thị Hà'],
    openAt: '2026-04-18',
    dueAt: '2026-04-25',
    durationMinutes: 30,
    status: 'Open',
  },
];

export const testAttempts: TestAttempt[] = [
  // S001 - in progress on TA-001
  {
    id: 'AT-001',
    assignmentId: 'TA-001',
    testId: 'IT001',
    studentId: 'S001',
    studentName: 'Hoàng Minh Đức',
    status: 'NotStarted',
    answers: [],
    writingResponses: [],
    speakingResponses: [],
  },
  // S002 - submitted, waiting for grading
  {
    id: 'AT-002',
    assignmentId: 'TA-001',
    testId: 'IT001',
    studentId: 'S002',
    studentName: 'Vũ Thị Hà',
    status: 'Grading',
    answers: [],
    writingResponses: [
      { taskNumber: 1, text: 'The chart shows the percentage of households...', wordCount: 165 },
      { taskNumber: 2, text: 'In recent years, technology has profoundly changed the way we live...', wordCount: 285 },
    ],
    speakingResponses: [],
    autoScoreListening: 28,
    autoScoreReading: 30,
    listeningTotal: 40,
    readingTotal: 40,
    listeningBand: 6.5,
    readingBand: 7,
    startedAt: '2026-04-16',
    submittedAt: '2026-04-16',
  },
  // S003 - approved
  {
    id: 'AT-003',
    assignmentId: 'TA-001',
    testId: 'IT001',
    studentId: 'S003',
    studentName: 'Đỗ Quang Huy',
    status: 'Approved',
    answers: [],
    writingResponses: [
      { taskNumber: 1, text: '...', wordCount: 170, taskAchievement: 7, coherence: 7, lexical: 6.5, grammar: 7, bandOverall: 7, feedback: 'Good overview, accurate data.' },
      { taskNumber: 2, text: '...', wordCount: 290, taskAchievement: 7.5, coherence: 7, lexical: 7, grammar: 7, bandOverall: 7, feedback: 'Strong arguments and clear structure.' },
    ],
    speakingResponses: [],
    autoScoreListening: 34,
    autoScoreReading: 36,
    listeningTotal: 40,
    readingTotal: 40,
    listeningBand: 7.5,
    readingBand: 8,
    writingBand: 7,
    speakingBand: 7,
    overallBand: 7.5,
    teacherFeedback: 'Excellent work overall. Keep practicing complex sentence structures.',
    gradedBy: 'Lê Hoàng Cường',
    gradedAt: '2026-04-17',
    startedAt: '2026-04-15',
    submittedAt: '2026-04-15',
  },
  // S004 - not started yet
  {
    id: 'AT-004',
    assignmentId: 'TA-001',
    testId: 'IT001',
    studentId: 'S004',
    studentName: 'Nguyễn Thảo My',
    status: 'NotStarted',
    answers: [],
    writingResponses: [],
    speakingResponses: [],
  },
  // TA-002
  {
    id: 'AT-005',
    assignmentId: 'TA-002',
    testId: 'IT002',
    studentId: 'S001',
    studentName: 'Hoàng Minh Đức',
    status: 'NotStarted',
    answers: [],
    writingResponses: [],
    speakingResponses: [],
  },
  {
    id: 'AT-006',
    assignmentId: 'TA-002',
    testId: 'IT002',
    studentId: 'S002',
    studentName: 'Vũ Thị Hà',
    status: 'NotStarted',
    answers: [],
    writingResponses: [],
    speakingResponses: [],
  },
];

// In-memory store with subscription
let assignments: TestAssignment[] = [...testAssignments];
let attempts: TestAttempt[] = [...testAttempts];
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

export const attemptStore = {
  getAssignments: () => assignments,
  getAttempts: () => attempts,
  addAssignment: (a: TestAssignment, students: { id: string; name: string }[]) => {
    assignments = [...assignments, a];
    const newAttempts: TestAttempt[] = students.map((s) => ({
      id: `AT-${Date.now()}-${s.id}`,
      assignmentId: a.id,
      testId: a.testId,
      studentId: s.id,
      studentName: s.name,
      status: 'NotStarted',
      answers: [],
      writingResponses: [],
      speakingResponses: [],
    }));
    attempts = [...attempts, ...newAttempts];
    notify();
  },
  upsertAttempt: (att: TestAttempt) => {
    attempts = attempts.some((x) => x.id === att.id)
      ? attempts.map((x) => (x.id === att.id ? att : x))
      : [...attempts, att];
    notify();
  },
  subscribe: (cb: () => void) => {
    listeners.add(cb);
    return () => { listeners.delete(cb); };
  },
};

import { useSyncExternalStore } from 'react';

export const useAssignments = () =>
  useSyncExternalStore(
    (cb) => attemptStore.subscribe(cb),
    () => attemptStore.getAssignments(),
    () => attemptStore.getAssignments(),
  );

export const useAttempts = () =>
  useSyncExternalStore(
    (cb) => attemptStore.subscribe(cb),
    () => attemptStore.getAttempts(),
    () => attemptStore.getAttempts(),
  );
