// ====== Class Reports — báo cáo buổi dạy của Giáo viên ======
import { useSyncExternalStore } from 'react';

export type ReportStatus = 'Draft' | 'Submitted' | 'Approved' | 'Returned';
export type EvaluationAttendance = 'Có mặt' | 'Vắng' | 'Vắng có phép' | 'Đi muộn';

export interface StudentEvaluation {
  studentId: string;
  studentName: string;
  attendance: EvaluationAttendance;
  score?: number;
  comment?: string;
}

export interface ClassReport {
  id: string;
  courseCode: string;
  className: string;
  sessionOrder: number;
  sessionTitle: string;
  sessionDate: string;
  sessionTime?: string;
  teacherName: string;
  generalComment: string;
  homeworkAssigned: string;
  evaluations: StudentEvaluation[];
  status: ReportStatus;
  createdAt: string;
  submittedAt?: string;
  approvedAt?: string;
  approvedBy?: string;
  coordinatorNote?: string;
}

export const reportStatusLabels: Record<ReportStatus, string> = {
  Draft: 'Nháp',
  Submitted: 'Chờ duyệt',
  Approved: 'Đã duyệt',
  Returned: 'Bị trả lại',
};

export const reportStatusColors: Record<ReportStatus, string> = {
  Draft: 'bg-muted text-muted-foreground border-border',
  Submitted: 'bg-warning/10 text-warning border-warning/20',
  Approved: 'bg-success/10 text-success border-success/20',
  Returned: 'bg-destructive/10 text-destructive border-destructive/20',
};

export const reportStatusDot: Record<ReportStatus, string> = {
  Draft: 'bg-muted-foreground/50',
  Submitted: 'bg-warning',
  Approved: 'bg-success',
  Returned: 'bg-destructive',
};

// ===== Roster — HV trong từng lớp =====
export const classRosters: Record<string, { studentId: string; studentName: string }[]> = {
  'IELTS 6.5 - Lớp A1': [
    { studentId: 'S001', studentName: 'Hoàng Minh Đức' },
    { studentId: 'S002', studentName: 'Vũ Thị Hà' },
    { studentId: 'S003', studentName: 'Đỗ Quang Huy' },
  ],
  'IELTS 7.0 - Lớp B1': [
    { studentId: 'S004', studentName: 'Nguyễn Thảo My' },
    { studentId: 'S005', studentName: 'Trần Bảo Long' },
    { studentId: 'S006', studentName: 'Lê Phương Linh' },
  ],
};

// ===== Seed data =====
const seed: ClassReport[] = [
  // Lớp A1 - Buổi 1: Approved
  {
    id: 'CR-IELTS01-A1-01',
    courseCode: 'IELTS01',
    className: 'IELTS 6.5 - Lớp A1',
    sessionOrder: 1,
    sessionTitle: 'Orientation & Diagnostic Test',
    sessionDate: '15/01/2026',
    sessionTime: '18:00 - 19:30',
    teacherName: 'Lê Hoàng Cường',
    generalComment:
      'Lớp học đầu tiên diễn ra suôn sẻ. Học viên hăng hái tham gia làm diagnostic test. Trình độ đầu vào trung bình band 4.0-4.5, phù hợp với khoá Foundation 5.5.',
    homeworkAssigned: 'Hoàn thành self-introduction 1 phút ghi âm gửi về Zalo nhóm. Học 20 từ Topic "Hometown".',
    evaluations: [
      { studentId: 'S001', studentName: 'Hoàng Minh Đức', attendance: 'Có mặt', score: 7, comment: 'Tích cực phát biểu' },
      { studentId: 'S002', studentName: 'Vũ Thị Hà', attendance: 'Có mặt', score: 8, comment: 'Diagnostic test làm tốt, phát âm rõ' },
      { studentId: 'S003', studentName: 'Đỗ Quang Huy', attendance: 'Đi muộn', score: 6.5, comment: 'Đi muộn 15 phút' },
    ],
    status: 'Approved',
    createdAt: '15/01/2026',
    submittedAt: '15/01/2026',
    approvedAt: '16/01/2026',
    approvedBy: 'Trần Thị Bình',
    coordinatorNote: 'Báo cáo chi tiết, đầy đủ.',
  },
  // Lớp A1 - Buổi 2: Approved
  {
    id: 'CR-IELTS01-A1-02',
    courseCode: 'IELTS01',
    className: 'IELTS 6.5 - Lớp A1',
    sessionOrder: 2,
    sessionTitle: 'Listening Part 1 — Form Filling',
    sessionDate: '17/01/2026',
    sessionTime: '18:00 - 19:30',
    teacherName: 'Lê Hoàng Cường',
    generalComment:
      'Buổi học Listening Part 1 (Form Filling). HV nắm được kỹ thuật predict từ loại trước khi nghe. Một số HV vẫn nhầm giữa số 13 và 30.',
    homeworkAssigned: 'Nghe lại track 1-3 Cambridge 17 Test 1, làm form filling exercises trên Quizlet.',
    evaluations: [
      { studentId: 'S001', studentName: 'Hoàng Minh Đức', attendance: 'Có mặt', score: 7.5, comment: 'Làm đúng 8/10 câu' },
      { studentId: 'S002', studentName: 'Vũ Thị Hà', attendance: 'Có mặt', score: 8.5, comment: 'Nghe rất tốt' },
      { studentId: 'S003', studentName: 'Đỗ Quang Huy', attendance: 'Có mặt', score: 6, comment: 'Cần luyện spelling số nhiều hơn' },
    ],
    status: 'Approved',
    createdAt: '17/01/2026',
    submittedAt: '17/01/2026',
    approvedAt: '18/01/2026',
    approvedBy: 'Trần Thị Bình',
  },
  // Lớp A1 - Buổi 3: Submitted (chờ duyệt)
  {
    id: 'CR-IELTS01-A1-03',
    courseCode: 'IELTS01',
    className: 'IELTS 6.5 - Lớp A1',
    sessionOrder: 3,
    sessionTitle: 'Reading — Skimming, Scanning',
    sessionDate: '19/01/2026',
    sessionTime: '18:00 - 19:30',
    teacherName: 'Lê Hoàng Cường',
    generalComment:
      'Buổi Reading đầu tiên. HV làm quen với kỹ thuật skimming (đọc lấy ý chính) và scanning (tìm thông tin cụ thể). Có giới thiệu về keyword hunting.',
    homeworkAssigned: 'Làm Passage 1 Cambridge 17 Test 2, ghi chú strategy đã dùng cho từng câu.',
    evaluations: [
      { studentId: 'S001', studentName: 'Hoàng Minh Đức', attendance: 'Có mặt', score: 7, comment: 'Skimming tốt, scanning cần luyện thêm' },
      { studentId: 'S002', studentName: 'Vũ Thị Hà', attendance: 'Có mặt', score: 8, comment: 'Làm nhanh và chính xác' },
      { studentId: 'S003', studentName: 'Đỗ Quang Huy', attendance: 'Vắng có phép', comment: 'Ốm, có xin phép qua Zalo' },
    ],
    status: 'Submitted',
    createdAt: '19/01/2026',
    submittedAt: '19/01/2026',
  },
  // Lớp B1 - Buổi 1: Returned (cần sửa)
  {
    id: 'CR-IELTS02-B1-01',
    courseCode: 'IELTS02',
    className: 'IELTS 7.0 - Lớp B1',
    sessionOrder: 1,
    sessionTitle: 'Advanced Diagnostic Test',
    sessionDate: '15/01/2026',
    sessionTime: '19:45 - 21:15',
    teacherName: 'Lê Hoàng Cường',
    generalComment: 'Đánh giá ban đầu band 5.5-6.0. Cả lớp có nền tảng khá tốt.',
    homeworkAssigned: 'Đọc passage Cambridge 18 Test 1 Passage 3.',
    evaluations: [
      { studentId: 'S004', studentName: 'Nguyễn Thảo My', attendance: 'Có mặt', score: 7.5, comment: 'Tốt' },
      { studentId: 'S005', studentName: 'Trần Bảo Long', attendance: 'Có mặt', score: 7, comment: 'Khá' },
      { studentId: 'S006', studentName: 'Lê Phương Linh', attendance: 'Có mặt', score: 8, comment: 'Xuất sắc' },
    ],
    status: 'Returned',
    createdAt: '15/01/2026',
    submittedAt: '15/01/2026',
    coordinatorNote:
      'Phần nhận xét chung còn quá ngắn, chưa đủ thông tin để Giáo vụ đánh giá tình hình lớp. Đề nghị bổ sung: những nội dung đã dạy chi tiết, mức độ tương tác của HV, và các khó khăn gặp phải.',
  },
  // Lớp B1 - Buổi 2: Approved
  {
    id: 'CR-IELTS02-B1-02',
    courseCode: 'IELTS02',
    className: 'IELTS 7.0 - Lớp B1',
    sessionOrder: 2,
    sessionTitle: 'Academic Reading — TFNG Techniques',
    sessionDate: '17/01/2026',
    sessionTime: '19:45 - 21:15',
    teacherName: 'Lê Hoàng Cường',
    generalComment:
      'Lớp học sôi nổi, HV đã nắm được cách phân biệt True/False/Not Given - vốn là dạng bài khó nhất của IELTS Reading. Phần paraphrase được ôn kỹ.',
    homeworkAssigned: 'Làm 2 bài TFNG trong Cambridge IELTS 18 (Passage 2 Test 1 và Passage 3 Test 2).',
    evaluations: [
      { studentId: 'S004', studentName: 'Nguyễn Thảo My', attendance: 'Có mặt', score: 8, comment: 'Phân tích logic chắc' },
      { studentId: 'S005', studentName: 'Trần Bảo Long', attendance: 'Có mặt', score: 7.5, comment: 'Có tiến bộ' },
      { studentId: 'S006', studentName: 'Lê Phương Linh', attendance: 'Có mặt', score: 8.5, comment: 'Bài làm xuất sắc' },
    ],
    status: 'Approved',
    createdAt: '17/01/2026',
    submittedAt: '17/01/2026',
    approvedAt: '18/01/2026',
    approvedBy: 'Trần Thị Bình',
  },
];

// ===== Mutable store + React hook =====
type Listener = () => void;
const listeners = new Set<Listener>();
let reportsState: ClassReport[] = [...seed];

const emit = () => listeners.forEach((l) => l());

export const reportStore = {
  getAll(): ClassReport[] {
    return reportsState;
  },
  findBySession(courseCode: string, className: string, sessionOrder: number): ClassReport | undefined {
    return reportsState.find(
      (r) => r.courseCode === courseCode && r.className === className && r.sessionOrder === sessionOrder,
    );
  },
  findById(id: string): ClassReport | undefined {
    return reportsState.find((r) => r.id === id);
  },
  upsert(report: ClassReport) {
    const idx = reportsState.findIndex((r) => r.id === report.id);
    if (idx >= 0) {
      reportsState = [...reportsState.slice(0, idx), report, ...reportsState.slice(idx + 1)];
    } else {
      reportsState = [...reportsState, report];
    }
    emit();
  },
  approve(id: string, coordinatorNote: string | undefined, approvedBy: string) {
    const r = reportsState.find((x) => x.id === id);
    if (!r) return;
    this.upsert({ ...r, status: 'Approved', approvedBy, approvedAt: new Date().toLocaleDateString('vi-VN'), coordinatorNote });
  },
  returnBack(id: string, coordinatorNote: string) {
    const r = reportsState.find((x) => x.id === id);
    if (!r) return;
    this.upsert({ ...r, status: 'Returned', coordinatorNote });
  },
  countByStatus(status: ReportStatus): number {
    return reportsState.filter((r) => r.status === status).length;
  },
};

const subscribe = (l: Listener) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const getSnapshot = () => reportsState;

export const useClassReports = (): ClassReport[] =>
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

export const classReports = seed;
