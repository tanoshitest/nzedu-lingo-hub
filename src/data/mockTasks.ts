export type TaskStatus = 'Pending' | 'InProgress' | 'WaitingApproval' | 'Done' | 'Late';
export type TaskCategory = 'Grading' | 'Prep' | 'Admin' | 'Support' | 'Finance';
export type TaskPriority = 'Low' | 'Normal' | 'High';

export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  assignerId: string;
  assigneeId: string;
  createdAt: string;
  deadline: string;
  status: TaskStatus;
  priority: TaskPriority;
  relatedEntity?: { type: 'Submission' | 'Class' | 'Invoice'; id: string };
}

export const taskStatusLabels: Record<TaskStatus, string> = {
  Pending: 'Chờ xử lý',
  InProgress: 'Đang làm',
  WaitingApproval: 'Chờ duyệt',
  Done: 'Hoàn thành',
  Late: 'Trễ hạn',
};

export const taskStatusColors: Record<TaskStatus, string> = {
  Pending: 'bg-muted text-muted-foreground border-border',
  InProgress: 'bg-info/10 text-info border-info/20',
  WaitingApproval: 'bg-warning/10 text-warning border-warning/20',
  Done: 'bg-success/10 text-success border-success/20',
  Late: 'bg-destructive/10 text-destructive border-destructive/20',
};

export const taskCategoryLabels: Record<TaskCategory, string> = {
  Grading: 'Chấm bài',
  Prep: 'Chuẩn bị lớp',
  Admin: 'Hành chính',
  Support: 'Hỗ trợ',
  Finance: 'Tài chính',
};

export const taskPriorityLabels: Record<TaskPriority, string> = {
  Low: 'Thấp',
  Normal: 'Bình thường',
  High: 'Cao',
};

export const tasks: Task[] = [
  // Admin → Coordinator
  {
    id: 'T001',
    title: 'Lập kế hoạch tuyển sinh tháng 5',
    description: 'Xây dựng kế hoạch chiến dịch tuyển sinh khóa IELTS mới cho tháng 5/2026.',
    category: 'Admin',
    assignerId: 'U001',
    assigneeId: 'U002',
    createdAt: '15/04/2026',
    deadline: '25/04/2026',
    status: 'InProgress',
    priority: 'High',
  },
  {
    id: 'T002',
    title: 'Kiểm tra danh sách học viên sắp hết buổi',
    description: 'Lọc danh sách học viên còn ≤ 3 buổi và liên hệ gia hạn.',
    category: 'Finance',
    assignerId: 'U001',
    assigneeId: 'U002',
    createdAt: '10/04/2026',
    deadline: '17/04/2026',
    status: 'Late',
    priority: 'High',
  },
  // Admin → Teacher
  {
    id: 'T003',
    title: 'Soạn đề thi tháng cho lớp IELTS 6.5',
    description: 'Soạn đề kiểm tra giữa kỳ cho lớp IELTS 6.5 - A1, A2, A3.',
    category: 'Prep',
    assignerId: 'U001',
    assigneeId: 'U003',
    createdAt: '12/04/2026',
    deadline: '22/04/2026',
    status: 'InProgress',
    priority: 'Normal',
  },
  // Coordinator → Teacher (Grading)
  {
    id: 'T004',
    title: 'Chấm bài Writing Task 2 - Lớp A1',
    description: '6 bài Writing Task 2 của lớp IELTS 6.5 - A1 ngày 17/04.',
    category: 'Grading',
    assignerId: 'U002',
    assigneeId: 'U003',
    createdAt: '17/04/2026',
    deadline: '20/04/2026',
    status: 'InProgress',
    priority: 'High',
    relatedEntity: { type: 'Submission', id: 'SB001' },
  },
  {
    id: 'T005',
    title: 'Chấm bài Reading Test 3 - Lớp B1',
    description: '8 bài Reading Cambridge IELTS 17 Test 3.',
    category: 'Grading',
    assignerId: 'U002',
    assigneeId: 'U004',
    createdAt: '16/04/2026',
    deadline: '19/04/2026',
    status: 'WaitingApproval',
    priority: 'Normal',
    relatedEntity: { type: 'Submission', id: 'SB002' },
  },
  {
    id: 'T006',
    title: 'Cập nhật nhận xét định kỳ tháng 4',
    description: 'Viết nhận xét tháng cho 12 học viên lớp IELTS 7.0.',
    category: 'Prep',
    assignerId: 'U002',
    assigneeId: 'U003',
    createdAt: '14/04/2026',
    deadline: '30/04/2026',
    status: 'Pending',
    priority: 'Normal',
  },
  {
    id: 'T007',
    title: 'Chuẩn bị tài liệu Lesson 7 - Speaking',
    description: 'In hand-out Speaking Part 2 cho lớp tối thứ Hai.',
    category: 'Prep',
    assignerId: 'U002',
    assigneeId: 'U008',
    createdAt: '13/04/2026',
    deadline: '15/04/2026',
    status: 'Late',
    priority: 'Normal',
  },
  // Teacher → Coordinator (Support requests)
  {
    id: 'T008',
    title: 'Yêu cầu in tài liệu Cambridge 17',
    description: 'In 15 bộ tài liệu Cambridge IELTS 17 - Test 4 cho lớp A1.',
    category: 'Support',
    assignerId: 'U003',
    assigneeId: 'U002',
    createdAt: '16/04/2026',
    deadline: '18/04/2026',
    status: 'InProgress',
    priority: 'Normal',
  },
  {
    id: 'T009',
    title: 'Hỗ trợ kỹ thuật phòng học 302',
    description: 'Máy chiếu phòng 302 không kết nối được HDMI, cần kỹ thuật xử lý trước 18:00.',
    category: 'Support',
    assignerId: 'U004',
    assigneeId: 'U002',
    createdAt: '18/04/2026',
    deadline: '18/04/2026',
    status: 'Pending',
    priority: 'High',
  },
  {
    id: 'T010',
    title: 'Liên hệ phụ huynh học viên Vũ Thị Hà',
    description: 'Học viên vắng 3 buổi liên tiếp, đề nghị Giáo vụ liên hệ phụ huynh.',
    category: 'Support',
    assignerId: 'U003',
    assigneeId: 'U002',
    createdAt: '15/04/2026',
    deadline: '17/04/2026',
    status: 'Done',
    priority: 'High',
  },
  // Admin → Admin (self management)
  {
    id: 'T011',
    title: 'Phê duyệt bảng lương tháng 4',
    description: 'Rà soát và duyệt bảng lương quy đổi ca 1.5h tháng 4/2026.',
    category: 'Finance',
    assignerId: 'U001',
    assigneeId: 'U001',
    createdAt: '15/04/2026',
    deadline: '28/04/2026',
    status: 'Pending',
    priority: 'High',
  },
  // Coordinator → Coordinator
  {
    id: 'T012',
    title: 'Khởi tạo hóa đơn cho học viên mới',
    description: 'Nhập 5 hóa đơn mới từ sổ tư vấn tuần này.',
    category: 'Admin',
    assignerId: 'U002',
    assigneeId: 'U002',
    createdAt: '17/04/2026',
    deadline: '20/04/2026',
    status: 'InProgress',
    priority: 'Normal',
  },
  // Coordinator → Teacher (extra)
  {
    id: 'T013',
    title: 'Chấm bài Listening - Lớp C1',
    description: '10 bài Listening Practice Test cho lớp Giao tiếp cơ bản.',
    category: 'Grading',
    assignerId: 'U002',
    assigneeId: 'U008',
    createdAt: '16/04/2026',
    deadline: '21/04/2026',
    status: 'Pending',
    priority: 'Normal',
    relatedEntity: { type: 'Submission', id: 'SB003' },
  },
  {
    id: 'T014',
    title: 'Hoàn tất báo cáo tháng 3',
    description: 'Báo cáo tổng kết kết quả học tập tháng 3 cho lớp A2.',
    category: 'Prep',
    assignerId: 'U002',
    assigneeId: 'U003',
    createdAt: '01/04/2026',
    deadline: '10/04/2026',
    status: 'Done',
    priority: 'Normal',
  },
  // Admin → Coordinator (intervention candidate)
  {
    id: 'T015',
    title: 'Sắp xếp giáo viên dạy thay tuần này',
    description: 'GV Phạm Mai Dung nghỉ ốm, cần điều phối GV dạy thay 4 ca.',
    category: 'Admin',
    assignerId: 'U001',
    assigneeId: 'U002',
    createdAt: '16/04/2026',
    deadline: '18/04/2026',
    status: 'WaitingApproval',
    priority: 'High',
  },
];
