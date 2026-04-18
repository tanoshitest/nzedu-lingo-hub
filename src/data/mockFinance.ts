// ====== Invoices ======
export type InvoiceStatus = 'Draft' | 'Pending' | 'Approved' | 'Paid' | 'Rejected';
export type InvoiceType = 'New' | 'Renewal';

export interface Invoice {
  id: string;
  studentId: string;
  studentName: string;
  courseCode: string;
  amount: number;
  sessionsPurchased: number;
  issuedAt: string;
  createdBy: string;
  type: InvoiceType;
  status: InvoiceStatus;
  note?: string;
}

export const invoiceStatusLabels: Record<InvoiceStatus, string> = {
  Draft: 'Nháp',
  Pending: 'Chờ duyệt',
  Approved: 'Đã duyệt',
  Paid: 'Đã thanh toán',
  Rejected: 'Từ chối',
};

export const invoiceStatusColors: Record<InvoiceStatus, string> = {
  Draft: 'bg-muted text-muted-foreground border-border',
  Pending: 'bg-warning/10 text-warning border-warning/20',
  Approved: 'bg-info/10 text-info border-info/20',
  Paid: 'bg-success/10 text-success border-success/20',
  Rejected: 'bg-destructive/10 text-destructive border-destructive/20',
};

export const invoices: Invoice[] = [
  { id: 'INV001', studentId: 'U005', studentName: 'Hoàng Minh Đức', courseCode: 'IELTS01', amount: 8500000, sessionsPurchased: 30, issuedAt: '15/01/2026', createdBy: 'U002', type: 'New', status: 'Paid' },
  { id: 'INV002', studentId: 'U007', studentName: 'Đỗ Quang Huy', courseCode: 'IELTS01', amount: 8500000, sessionsPurchased: 30, issuedAt: '20/01/2026', createdBy: 'U002', type: 'New', status: 'Paid' },
  { id: 'INV003', studentId: 'P001', studentName: 'Lê Thu Hương', courseCode: 'IELTS02', amount: 9500000, sessionsPurchased: 30, issuedAt: '17/04/2026', createdBy: 'U002', type: 'New', status: 'Pending' },
  { id: 'INV004', studentId: 'P002', studentName: 'Nguyễn Quốc Bảo', courseCode: 'IELTS01', amount: 8500000, sessionsPurchased: 30, issuedAt: '18/04/2026', createdBy: 'U002', type: 'New', status: 'Pending' },
  { id: 'INV005', studentId: 'U005', studentName: 'Hoàng Minh Đức', courseCode: 'IELTS01', amount: 7000000, sessionsPurchased: 24, issuedAt: '16/04/2026', createdBy: 'U002', type: 'Renewal', status: 'Pending', note: 'Gia hạn học viên sắp hết buổi' },
  { id: 'INV006', studentId: 'S004', studentName: 'Nguyễn Thảo My', courseCode: 'IELTS01', amount: 7000000, sessionsPurchased: 24, issuedAt: '15/04/2026', createdBy: 'U002', type: 'Renewal', status: 'Approved' },
  { id: 'INV007', studentId: 'P003', studentName: 'Trần Phương Anh', courseCode: 'IELTS01', amount: 8500000, sessionsPurchased: 30, issuedAt: '18/04/2026', createdBy: 'U002', type: 'New', status: 'Draft' },
];

// ====== Courses ======
export interface Lesson { id: string; order: number; title: string }
export interface Course {
  id: string;
  code: string;
  name: string;
  tuition: number;
  sessions: number;
  lessons: Lesson[];
}

export const courses: Course[] = [
  {
    id: 'C-IELTS01', code: 'IELTS01', name: 'IELTS Foundation 5.5', tuition: 8500000, sessions: 30,
    lessons: [
      { id: 'L01', order: 1, title: 'Lesson 1 - Introduction & Diagnostic Test' },
      { id: 'L02', order: 2, title: 'Lesson 2 - Listening Part 1-2' },
      { id: 'L03', order: 3, title: 'Lesson 3 - Reading Skimming & Scanning' },
      { id: 'L04', order: 4, title: 'Lesson 4 - Speaking Part 2' },
      { id: 'L05', order: 5, title: 'Lesson 5 - Listening Practice' },
      { id: 'L06', order: 6, title: 'Lesson 6 - Reading Test Cambridge 17' },
      { id: 'L07', order: 7, title: 'Lesson 7 - Writing Task 2: Opinion Essay' },
      { id: 'L08', order: 8, title: 'Lesson 8 - Writing Task 1: Graph' },
      { id: 'L09', order: 9, title: 'Lesson 9 - Writing Task 2: Discussion' },
      { id: 'L10', order: 10, title: 'Lesson 10 - Mock Test & Review' },
    ],
  },
  {
    id: 'C-IELTS02', code: 'IELTS02', name: 'IELTS Intensive 6.5', tuition: 9500000, sessions: 30,
    lessons: [
      { id: 'L01', order: 1, title: 'Lesson 1 - Advanced Vocabulary' },
      { id: 'L02', order: 2, title: 'Lesson 2 - Listening Section 3-4' },
      { id: 'L03', order: 3, title: 'Lesson 3 - Writing Task 1: Maps & Processes' },
      { id: 'L04', order: 4, title: 'Lesson 4 - Speaking Part 3' },
      { id: 'L05', order: 5, title: 'Lesson 5 - Reading True/False/NG' },
    ],
  },
  {
    id: 'C-TOEIC01', code: 'TOEIC01', name: 'TOEIC 500-750', tuition: 6500000, sessions: 24,
    lessons: [
      { id: 'L01', order: 1, title: 'Lesson 1 - Part 1-2 Photos & Responses' },
      { id: 'L02', order: 2, title: 'Lesson 2 - Part 5 Grammar' },
      { id: 'L03', order: 3, title: 'Lesson 3 - Part 7 Reading' },
    ],
  },
];

// ====== Payroll ======
export type PayrollStatus = 'Pending' | 'Approved' | 'Paid';
export interface PayrollEntry {
  id: string;
  teacherId: string;
  teacherName: string;
  month: string;
  sessions: number;          // số ca 1.5h
  ratePerSession: number;
  total: number;
  status: PayrollStatus;
}

export const payrollEntries: PayrollEntry[] = [
  { id: 'PR001', teacherId: 'U003', teacherName: 'Lê Hoàng Cường', month: '04/2026', sessions: 28, ratePerSession: 350000, total: 9800000, status: 'Pending' },
  { id: 'PR002', teacherId: 'U004', teacherName: 'Phạm Mai Dung', month: '04/2026', sessions: 22, ratePerSession: 300000, total: 6600000, status: 'Pending' },
  { id: 'PR003', teacherId: 'U008', teacherName: 'Bùi Lan Khanh', month: '04/2026', sessions: 18, ratePerSession: 280000, total: 5040000, status: 'Pending' },
  { id: 'PR004', teacherId: 'U003', teacherName: 'Lê Hoàng Cường', month: '03/2026', sessions: 30, ratePerSession: 350000, total: 10500000, status: 'Paid' },
  { id: 'PR005', teacherId: 'U004', teacherName: 'Phạm Mai Dung', month: '03/2026', sessions: 26, ratePerSession: 300000, total: 7800000, status: 'Paid' },
];

// ====== Consultation log ======
export type ConsultationStatus = 'New' | 'InProgress' | 'Converted' | 'Lost';
export interface ConsultationLog {
  id: string;
  prospectName: string;
  phone: string;
  source: string;
  courseInterest: string;
  note: string;
  createdAt: string;
  status: ConsultationStatus;
}

export const consultationStatusLabels: Record<ConsultationStatus, string> = {
  New: 'Mới',
  InProgress: 'Đang tư vấn',
  Converted: 'Đã chuyển HV',
  Lost: 'Mất khách',
};

export const consultationStatusColors: Record<ConsultationStatus, string> = {
  New: 'bg-info/10 text-info border-info/20',
  InProgress: 'bg-warning/10 text-warning border-warning/20',
  Converted: 'bg-success/10 text-success border-success/20',
  Lost: 'bg-muted text-muted-foreground border-border',
};

export const consultations: ConsultationLog[] = [
  { id: 'CS001', prospectName: 'Lê Thu Hương', phone: '0912 345 678', source: 'Facebook Ads', courseInterest: 'IELTS02', note: 'Đã có nền tảng, mục tiêu 6.5', createdAt: '16/04/2026', status: 'Converted' },
  { id: 'CS002', prospectName: 'Nguyễn Quốc Bảo', phone: '0908 111 222', source: 'Giới thiệu', courseInterest: 'IELTS01', note: 'Mới bắt đầu học IELTS', createdAt: '17/04/2026', status: 'Converted' },
  { id: 'CS003', prospectName: 'Trần Phương Anh', phone: '0987 654 321', source: 'Website', courseInterest: 'IELTS01', note: 'Học sinh lớp 11, hỏi lịch cuối tuần', createdAt: '18/04/2026', status: 'InProgress' },
  { id: 'CS004', prospectName: 'Phạm Tuấn Kiệt', phone: '0933 222 333', source: 'Facebook Ads', courseInterest: 'TOEIC01', note: 'Cần đi làm, muốn học tối', createdAt: '17/04/2026', status: 'New' },
  { id: 'CS005', prospectName: 'Ngô Khánh Linh', phone: '0944 555 666', source: 'Tiktok', courseInterest: 'IELTS02', note: 'Yêu cầu test đầu vào', createdAt: '15/04/2026', status: 'InProgress' },
  { id: 'CS006', prospectName: 'Đào Văn Phong', phone: '0977 888 999', source: 'Website', courseInterest: 'IELTS01', note: 'So sánh học phí với trung tâm khác', createdAt: '10/04/2026', status: 'Lost' },
];

// ====== Tuition tracking ======
export interface StudentTuition {
  studentId: string;
  studentName: string;
  className: string;
  courseCode: string;
  sessionsRemaining: number;
  sessionsTotal: number;
  nextRenewalDue?: string;
  debt: number;
  lastPaymentDate: string;
}

export const studentTuitions: StudentTuition[] = [
  { studentId: 'U005', studentName: 'Hoàng Minh Đức', className: 'IELTS 6.5 - A1', courseCode: 'IELTS01', sessionsRemaining: 2, sessionsTotal: 30, nextRenewalDue: '25/04/2026', debt: 0, lastPaymentDate: '15/01/2026' },
  { studentId: 'U007', studentName: 'Đỗ Quang Huy', className: 'IELTS 6.5 - A1', courseCode: 'IELTS01', sessionsRemaining: 3, sessionsTotal: 30, nextRenewalDue: '28/04/2026', debt: 0, lastPaymentDate: '20/01/2026' },
  { studentId: 'S002', studentName: 'Vũ Thị Hà', className: 'IELTS 6.5 - A1', courseCode: 'IELTS01', sessionsRemaining: 1, sessionsTotal: 30, nextRenewalDue: '20/04/2026', debt: 2000000, lastPaymentDate: '10/01/2026' },
  { studentId: 'S004', studentName: 'Nguyễn Thảo My', className: 'IELTS 6.5 - A2', courseCode: 'IELTS01', sessionsRemaining: 3, sessionsTotal: 30, nextRenewalDue: '30/04/2026', debt: 0, lastPaymentDate: '05/02/2026' },
  { studentId: 'S005', studentName: 'Trần Bảo Long', className: 'IELTS 6.5 - A2', courseCode: 'IELTS01', sessionsRemaining: 8, sessionsTotal: 30, nextRenewalDue: '20/05/2026', debt: 0, lastPaymentDate: '05/02/2026' },
  { studentId: 'S006', studentName: 'Lê Phương Linh', className: 'IELTS 7.0 - A3', courseCode: 'IELTS02', sessionsRemaining: 15, sessionsTotal: 30, nextRenewalDue: '10/06/2026', debt: 0, lastPaymentDate: '01/03/2026' },
];

// ====== Helper format ======
export const formatVND = (n: number) => new Intl.NumberFormat('vi-VN').format(n) + '₫';
