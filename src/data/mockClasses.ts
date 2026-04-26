export interface Class {
  id: string;
  name: string;
  level: string;
  syllabusId: string; // Link to phaseId (NK1, NK2, etc.)
  teacherId: string;
  studentsCount: number;
  schedule: string;
  currentDay: number;
  status: 'Active' | 'Completed' | 'Pending';
}

export const mockClasses: Class[] = [
  {
    id: 'CLASS001',
    name: 'IELTS 6.5 - Lớp A1',
    level: 'Pre Starters 1',
    syllabusId: 'NK1',
    teacherId: 'U003', // Lê Hoàng Cường
    studentsCount: 12,
    schedule: 'Thứ 2 - 4 - 6 • 18:00 - 19:30',
    currentDay: 5,
    status: 'Active',
  },
  {
    id: 'CLASS002',
    name: 'IELTS 7.0 - Lớp B1',
    level: 'Pre Starters 2',
    syllabusId: 'NK2',
    teacherId: 'U003', // Lê Hoàng Cường
    studentsCount: 10,
    schedule: 'Thứ 3 - 5 - 7 • 18:00 - 19:30',
    currentDay: 2,
    status: 'Active',
  },
  {
    id: 'CLASS003',
    name: 'Starters - Lớp S1',
    level: 'Starters',
    syllabusId: 'NK3',
    teacherId: 'U004', // Phạm Mai Dung
    studentsCount: 15,
    schedule: 'Thứ 7 - CN • 08:00 - 09:30',
    currentDay: 8,
    status: 'Active',
  },
  {
    id: 'CLASS004',
    name: 'Movers - Lớp M1',
    level: 'Movers',
    syllabusId: 'NK4',
    teacherId: 'U008', // Bùi Lan Khanh
    studentsCount: 8,
    schedule: 'Thứ 3 - 5 • 19:45 - 21:15',
    currentDay: 1,
    status: 'Pending',
  },
];
