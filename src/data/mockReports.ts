// ====== Attendance records (multi student × multi session) ======
export type AttendanceStatus = 'Có mặt' | 'Vắng' | 'Vắng có phép' | 'Đi muộn';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  sessionDate: string; // dd/mm/yyyy
  month: string;       // mm/yyyy (để filter)
  status: AttendanceStatus;
  note?: string;
}

export const attendanceStatusColors: Record<AttendanceStatus, string> = {
  'Có mặt': 'bg-success/10 text-success border-success/20',
  'Vắng có phép': 'bg-warning/10 text-warning border-warning/20',
  'Vắng': 'bg-destructive/10 text-destructive border-destructive/20',
  'Đi muộn': 'bg-info/10 text-info border-info/20',
};

// 3 lớp × ~5 HV × 4 buổi → ~60 records
const dates04 = ['03/04/2026', '08/04/2026', '10/04/2026', '15/04/2026', '17/04/2026'];
const dates03 = ['06/03/2026', '13/03/2026', '20/03/2026', '27/03/2026'];

const classA1 = {
  id: 'CL-A1',
  name: 'IELTS 6.5 - Lớp A1',
  students: [
    { id: 'U005', name: 'Hoàng Minh Đức' },
    { id: 'U007', name: 'Đỗ Quang Huy' },
    { id: 'S002', name: 'Vũ Thị Hà' },
  ],
};

const classA2 = {
  id: 'CL-A2',
  name: 'IELTS 6.5 - Lớp A2',
  students: [
    { id: 'S004', name: 'Nguyễn Thảo My' },
    { id: 'S005', name: 'Trần Bảo Long' },
  ],
};

const classA3 = {
  id: 'CL-A3',
  name: 'IELTS 7.0 - Lớp A3',
  students: [
    { id: 'S006', name: 'Lê Phương Linh' },
    { id: 'S007', name: 'Phạm Thanh Tùng' },
  ],
};

// Generate có pattern thực tế: HV có chuyên cần khác nhau
const presencePattern: Record<string, AttendanceStatus[]> = {
  // tháng 4
  'U005': ['Có mặt', 'Có mặt', 'Vắng có phép', 'Có mặt', 'Có mặt'],
  'U007': ['Có mặt', 'Có mặt', 'Có mặt', 'Có mặt', 'Đi muộn'],
  'S002': ['Có mặt', 'Vắng', 'Vắng', 'Có mặt', 'Vắng'],
  'S004': ['Có mặt', 'Có mặt', 'Có mặt', 'Vắng có phép', 'Có mặt'],
  'S005': ['Có mặt', 'Đi muộn', 'Có mặt', 'Có mặt', 'Vắng'],
  'S006': ['Có mặt', 'Có mặt', 'Có mặt', 'Có mặt', 'Có mặt'],
  'S007': ['Có mặt', 'Có mặt', 'Vắng có phép', 'Có mặt', 'Có mặt'],
};

const presencePatternMar: Record<string, AttendanceStatus[]> = {
  'U005': ['Có mặt', 'Có mặt', 'Có mặt', 'Vắng có phép'],
  'U007': ['Có mặt', 'Có mặt', 'Đi muộn', 'Có mặt'],
  'S002': ['Vắng', 'Có mặt', 'Vắng có phép', 'Có mặt'],
  'S004': ['Có mặt', 'Có mặt', 'Có mặt', 'Có mặt'],
  'S005': ['Có mặt', 'Vắng', 'Có mặt', 'Có mặt'],
  'S006': ['Có mặt', 'Có mặt', 'Có mặt', 'Có mặt'],
  'S007': ['Có mặt', 'Đi muộn', 'Có mặt', 'Có mặt'],
};

const buildRecords = (): AttendanceRecord[] => {
  const out: AttendanceRecord[] = [];
  let n = 1;
  const all = [classA1, classA2, classA3];
  for (const c of all) {
    for (const s of c.students) {
      // Tháng 4
      dates04.forEach((d, idx) => {
        const status = presencePattern[s.id]?.[idx] ?? 'Có mặt';
        out.push({
          id: `AT${String(n++).padStart(3, '0')}`,
          studentId: s.id,
          studentName: s.name,
          classId: c.id,
          className: c.name,
          sessionDate: d,
          month: '04/2026',
          status,
          note: status === 'Vắng' ? 'Không liên lạc được' : undefined,
        });
      });
      // Tháng 3
      dates03.forEach((d, idx) => {
        const status = presencePatternMar[s.id]?.[idx] ?? 'Có mặt';
        out.push({
          id: `AT${String(n++).padStart(3, '0')}`,
          studentId: s.id,
          studentName: s.name,
          classId: c.id,
          className: c.name,
          sessionDate: d,
          month: '03/2026',
          status,
        });
      });
    }
  }
  return out;
};

export const attendanceRecords: AttendanceRecord[] = buildRecords();

// ====== Lịch sử payroll bổ sung 6 tháng cho chart ======
export interface PayrollMonthSummary {
  month: string;          // T11, T12, T1, T2, T3, T4
  monthKey: string;       // 11/2025...
  totalCost: number;      // VNĐ
  sessions: number;
  teachers: number;
}

export const payrollHistory: PayrollMonthSummary[] = [
  { month: 'T11', monthKey: '11/2025', totalCost: 21_400_000, sessions: 68,  teachers: 3 },
  { month: 'T12', monthKey: '12/2025', totalCost: 23_800_000, sessions: 75,  teachers: 3 },
  { month: 'T1',  monthKey: '01/2026', totalCost: 22_100_000, sessions: 70,  teachers: 3 },
  { month: 'T2',  monthKey: '02/2026', totalCost: 19_500_000, sessions: 62,  teachers: 3 },
  { month: 'T3',  monthKey: '03/2026', totalCost: 25_300_000, sessions: 80,  teachers: 3 },
  { month: 'T4',  monthKey: '04/2026', totalCost: 21_440_000, sessions: 68,  teachers: 3 },
];

// ====== Lịch sử doanh thu học phí 6 tháng (cho chart Tuition) ======
export interface TuitionMonthSummary {
  month: string;
  monthKey: string;
  collected: number;   // đã thu
  pending: number;     // chưa thu
  newCount: number;
  renewalCount: number;
}

export const tuitionHistory: TuitionMonthSummary[] = [
  { month: 'T11', monthKey: '11/2025', collected: 142_000_000, pending: 18_000_000, newCount: 14, renewalCount: 6 },
  { month: 'T12', monthKey: '12/2025', collected: 168_000_000, pending: 12_500_000, newCount: 18, renewalCount: 8 },
  { month: 'T1',  monthKey: '01/2026', collected: 155_000_000, pending: 21_000_000, newCount: 16, renewalCount: 7 },
  { month: 'T2',  monthKey: '02/2026', collected: 138_000_000, pending: 15_500_000, newCount: 13, renewalCount: 9 },
  { month: 'T3',  monthKey: '03/2026', collected: 175_000_000, pending: 19_800_000, newCount: 19, renewalCount: 8 },
  { month: 'T4',  monthKey: '04/2026', collected: 96_500_000,  pending: 24_000_000, newCount: 11, renewalCount: 5 },
];
