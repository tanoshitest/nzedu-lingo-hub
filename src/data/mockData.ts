export type Role = 'Admin' | 'Coordinator' | 'Teacher' | 'Student' | 'PART_TIME_TEACHER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Quản trị viên' | 'Giáo vụ' | 'Giáo viên' | 'Học viên';
  status: 'Hoạt động' | 'Đã khóa';
}

export interface Student {
  id: string;
  name: string;
  currentGrade: string;
  attendance: string;
  homeworkScore: number;
}

export interface ClassSession {
  id: string;
  className: string;
  date: string;
  time: string;
  status: 'Chờ báo cáo' | 'Đã nộp' | 'Đã duyệt';
  teacher?: string;
  report?: {
    generalComment: string;
    homework: string;
  };
}

export const users: User[] = [
  { id: 'U001', name: 'Nguyễn Văn An', email: 'an.nguyen@nzedu.vn', role: 'Quản trị viên', status: 'Hoạt động' },
  { id: 'U002', name: 'Trần Thị Bình', email: 'binh.tran@nzedu.vn', role: 'Giáo vụ', status: 'Hoạt động' },
  { id: 'U003', name: 'Lê Hoàng Cường', email: 'cuong.le@nzedu.vn', role: 'Giáo viên', status: 'Hoạt động' },
  { id: 'U004', name: 'Phạm Mai Dung', email: 'dung.pham@nzedu.vn', role: 'Giáo viên', status: 'Hoạt động' },
  { id: 'U005', name: 'Hoàng Minh Đức', email: 'duc.hoang@gmail.com', role: 'Học viên', status: 'Hoạt động' },
  { id: 'U006', name: 'Vũ Thị Hà', email: 'ha.vu@gmail.com', role: 'Học viên', status: 'Đã khóa' },
  { id: 'U007', name: 'Đỗ Quang Huy', email: 'huy.do@gmail.com', role: 'Học viên', status: 'Hoạt động' },
  { id: 'U008', name: 'Bùi Lan Khanh', email: 'khanh.bui@nzedu.vn', role: 'Giáo viên', status: 'Hoạt động' },
];

export const studentsList: Student[] = [
  { id: 'S001', name: 'Hoàng Minh Đức', currentGrade: 'IELTS 6.5', attendance: '95%', homeworkScore: 8.5 },
  { id: 'S002', name: 'Vũ Thị Hà', currentGrade: 'IELTS 6.5', attendance: '88%', homeworkScore: 7.2 },
  { id: 'S003', name: 'Đỗ Quang Huy', currentGrade: 'IELTS 6.5', attendance: '100%', homeworkScore: 9.0 },
  { id: 'S004', name: 'Nguyễn Thảo My', currentGrade: 'IELTS 6.5', attendance: '92%', homeworkScore: 8.0 },
  { id: 'S005', name: 'Trần Bảo Long', currentGrade: 'IELTS 6.5', attendance: '85%', homeworkScore: 7.5 },
  { id: 'S006', name: 'Lê Phương Linh', currentGrade: 'IELTS 6.5', attendance: '98%', homeworkScore: 9.2 },
];

export const classSessions: ClassSession[] = [
  { id: 'C001', className: 'IELTS 6.5 - Lớp A1', date: '18/04/2026', time: '18:00 - 20:00', status: 'Chờ báo cáo', teacher: 'Lê Hoàng Cường' },
  { id: 'C002', className: 'IELTS 6.5 - Lớp A2', date: '17/04/2026', time: '18:00 - 20:00', status: 'Đã nộp', teacher: 'Lê Hoàng Cường', report: { generalComment: 'Lớp học sôi nổi, học viên tham gia tích cực vào phần Speaking. Cần cải thiện thêm phần Writing Task 2.', homework: 'Hoàn thành Cambridge IELTS 17 - Test 3 (Reading & Listening). Viết lại Writing Task 2 đề tuần trước.' } },
  { id: 'C003', className: 'TOEIC 750 - Lớp B1', date: '17/04/2026', time: '19:00 - 21:00', status: 'Đã nộp', teacher: 'Phạm Mai Dung', report: { generalComment: 'Học viên nắm vững ngữ pháp Part 5. Cần luyện thêm Part 7 về tốc độ đọc.', homework: 'Làm 2 bộ đề Part 5 & 6. Đọc 3 bài Part 7 dài.' } },
  { id: 'C004', className: 'Giao tiếp cơ bản - Lớp C1', date: '16/04/2026', time: '17:30 - 19:30', status: 'Đã duyệt', teacher: 'Bùi Lan Khanh' },
  { id: 'C005', className: 'IELTS 7.0 - Lớp A3', date: '19/04/2026', time: '18:00 - 20:00', status: 'Chờ báo cáo', teacher: 'Lê Hoàng Cường' },
  { id: 'C006', className: 'TOEIC 750 - Lớp B2', date: '18/04/2026', time: '19:00 - 21:00', status: 'Chờ báo cáo', teacher: 'Phạm Mai Dung' },
];

export const dashboardStats = {
  totalStudents: 1250,
  activeClasses: 45,
  pendingReports: 12,
  revenue: '150,000,000 VNĐ',
};

export const monthlyEnrollments = [
  { month: 'T1', value: 85 },
  { month: 'T2', value: 92 },
  { month: 'T3', value: 110 },
  { month: 'T4', value: 145 },
  { month: 'T5', value: 132 },
  { month: 'T6', value: 168 },
  { month: 'T7', value: 155 },
  { month: 'T8', value: 178 },
  { month: 'T9', value: 195 },
  { month: 'T10', value: 210 },
  { month: 'T11', value: 188 },
  { month: 'T12', value: 225 },
];

export const studentResults = [
  { id: 'R001', className: 'IELTS 6.5 - Lớp A1', date: '17/04/2026', score: 8.5, attendance: 'Có mặt', comment: 'Phát âm tốt, cần luyện thêm từ vựng học thuật.' },
  { id: 'R002', className: 'IELTS 6.5 - Lớp A1', date: '15/04/2026', score: 8.0, attendance: 'Có mặt', comment: 'Bài viết Task 2 có cấu trúc rõ ràng.' },
  { id: 'R003', className: 'IELTS 6.5 - Lớp A1', date: '12/04/2026', score: 7.5, attendance: 'Vắng', comment: 'Vắng có phép, cần xem lại bài giảng online.' },
  { id: 'R004', className: 'IELTS 6.5 - Lớp A1', date: '10/04/2026', score: 9.0, attendance: 'Có mặt', comment: 'Xuất sắc, phần Speaking rất tự nhiên.' },
];

export const roleLabels: Record<Role, string> = {
  Admin: 'Quản trị viên',
  Coordinator: 'Giáo vụ',
  Teacher: 'Giáo viên',
  Student: 'Học viên',
  PART_TIME_TEACHER: 'Giáo viên Part-time',
};
