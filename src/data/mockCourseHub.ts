// ===== Course Hub mock data =====
// Bổ sung data cho trang "Khoá học của tôi" (Student/Teacher detail view)

export interface VocabItem {
  id: string;
  courseCode: string;
  word: string;
  phonetic: string;
  partOfSpeech: 'n' | 'v' | 'adj' | 'adv' | 'phrase';
  meaningVi: string;
  exampleEn: string;
  topic: string;
  learned: boolean;
}

export type ExerciseSkill = 'Listening' | 'Reading' | 'Writing' | 'Speaking' | 'Vocabulary' | 'Grammar';
export type ExerciseStatus = 'NotStarted' | 'InProgress' | 'Completed';

export interface ExerciseScore {
  id: string;
  courseCode: string;
  sessionOrder: number;
  skill: ExerciseSkill;
  title: string;
  bestScore?: number;
  maxScore: number;
  attempts: number;
  status: ExerciseStatus;
}

export type SampleType = 'Writing' | 'Speaking';
export type SampleReadStatus = 'Unread' | 'Reading' | 'Read';

export interface SampleDocument {
  id: string;
  courseCode: string;
  type: SampleType;
  sessionOrder: number;
  title: string;
  topic: string;
  status: SampleReadStatus;
}

export interface CourseFeedback {
  id: string;
  courseCode: string;
  studentId: string;
  studentName: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}

export interface CertificationInfo {
  studentId: string;
  courseCode: string;
  eligible: boolean;
  missingRequirements: string[];
  issuedAt?: string;
  certificateNumber?: string;
}

export type RoadmapStepStatus = 'Done' | 'InProgress' | 'Upcoming';
export interface RoadmapStep {
  id: string;
  courseCode: string;
  order: number;
  title: string;
  description: string;
  status: RoadmapStepStatus;
  expectedBand?: number;
  achievedAt?: string;
}

// ====== Seed data — focus IELTS01 (current student S001) ======

export const vocabItems: VocabItem[] = [
  { id: 'V01', courseCode: 'IELTS01', word: 'sustainable', phonetic: '/səˈsteɪnəbl/', partOfSpeech: 'adj', meaningVi: 'bền vững, có thể duy trì', exampleEn: 'We need a sustainable approach to development.', topic: 'Environment', learned: true },
  { id: 'V02', courseCode: 'IELTS01', word: 'phenomenon', phonetic: '/fɪˈnɒmɪnən/', partOfSpeech: 'n', meaningVi: 'hiện tượng', exampleEn: 'Climate change is a global phenomenon.', topic: 'Environment', learned: true },
  { id: 'V03', courseCode: 'IELTS01', word: 'inevitable', phonetic: '/ɪnˈevɪtəbl/', partOfSpeech: 'adj', meaningVi: 'không thể tránh khỏi', exampleEn: 'Conflict in such situations is inevitable.', topic: 'Society', learned: true },
  { id: 'V04', courseCode: 'IELTS01', word: 'allocate', phonetic: '/ˈæləkeɪt/', partOfSpeech: 'v', meaningVi: 'phân bổ, cấp phát', exampleEn: 'The government allocates funds for education.', topic: 'Education', learned: true },
  { id: 'V05', courseCode: 'IELTS01', word: 'curriculum', phonetic: '/kəˈrɪkjələm/', partOfSpeech: 'n', meaningVi: 'chương trình giảng dạy', exampleEn: 'The new curriculum focuses on critical thinking.', topic: 'Education', learned: false },
  { id: 'V06', courseCode: 'IELTS01', word: 'innovate', phonetic: '/ˈɪnəveɪt/', partOfSpeech: 'v', meaningVi: 'đổi mới, sáng tạo', exampleEn: 'Companies must innovate to stay competitive.', topic: 'Technology', learned: false },
  { id: 'V07', courseCode: 'IELTS01', word: 'breakthrough', phonetic: '/ˈbreɪkθruː/', partOfSpeech: 'n', meaningVi: 'bước đột phá', exampleEn: 'Scientists made a breakthrough in cancer research.', topic: 'Technology', learned: false },
  { id: 'V08', courseCode: 'IELTS01', word: 'pose a threat', phonetic: '/poʊz ə θret/', partOfSpeech: 'phrase', meaningVi: 'gây ra mối đe dọa', exampleEn: 'Plastic waste poses a threat to marine life.', topic: 'Environment', learned: true },
  { id: 'V09', courseCode: 'IELTS01', word: 'thoroughly', phonetic: '/ˈθʌrəli/', partOfSpeech: 'adv', meaningVi: 'một cách kỹ lưỡng', exampleEn: 'You should thoroughly review the contract.', topic: 'General', learned: false },
  { id: 'V10', courseCode: 'IELTS01', word: 'collaborate', phonetic: '/kəˈlæbəreɪt/', partOfSpeech: 'v', meaningVi: 'hợp tác', exampleEn: 'The two universities collaborate on research projects.', topic: 'Work', learned: true },
  { id: 'V11', courseCode: 'IELTS01', word: 'discrepancy', phonetic: '/dɪˈskrepənsi/', partOfSpeech: 'n', meaningVi: 'sự khác biệt, không nhất quán', exampleEn: 'There is a discrepancy between the two reports.', topic: 'General', learned: false },
  { id: 'V12', courseCode: 'IELTS01', word: 'enhance', phonetic: '/ɪnˈhɑːns/', partOfSpeech: 'v', meaningVi: 'nâng cao, tăng cường', exampleEn: 'Reading enhances vocabulary acquisition.', topic: 'Education', learned: true },
  { id: 'V13', courseCode: 'IELTS01', word: 'mitigate', phonetic: '/ˈmɪtɪɡeɪt/', partOfSpeech: 'v', meaningVi: 'giảm nhẹ', exampleEn: 'Measures to mitigate the impact of pollution.', topic: 'Environment', learned: false },
  { id: 'V14', courseCode: 'IELTS01', word: 'predominant', phonetic: '/prɪˈdɒmɪnənt/', partOfSpeech: 'adj', meaningVi: 'chiếm ưu thế', exampleEn: 'English is the predominant language in business.', topic: 'Society', learned: false },
  { id: 'V15', courseCode: 'IELTS01', word: 'underlying', phonetic: '/ˌʌndəˈlaɪɪŋ/', partOfSpeech: 'adj', meaningVi: 'tiềm ẩn, nằm dưới', exampleEn: 'We need to address the underlying causes.', topic: 'General', learned: false },
];

// 15 exercises trải đều 3 buổi đầu — bám sát layout screenshot
export const exerciseScores: ExerciseScore[] = [
  // Buổi 5 - Speaking part 1 (giống screenshot)
  { id: 'EX01', courseCode: 'IELTS01', sessionOrder: 5, skill: 'Speaking', title: 'IELTS 6.0 - Speaking - L1 - Ex1: Structure (Yes/No)', bestScore: 10, maxScore: 10, attempts: 2, status: 'Completed' },
  { id: 'EX02', courseCode: 'IELTS01', sessionOrder: 5, skill: 'Speaking', title: 'IELTS 6.0 - Speaking - L1 - Ex2: Structure (What/Which)', bestScore: 10, maxScore: 10, attempts: 1, status: 'Completed' },
  { id: 'EX03', courseCode: 'IELTS01', sessionOrder: 5, skill: 'Speaking', title: 'IELTS 6.0 - Speaking - L1 - Ex3: Structure (Who)', bestScore: 10, maxScore: 10, attempts: 1, status: 'Completed' },
  { id: 'EX04', courseCode: 'IELTS01', sessionOrder: 5, skill: 'Speaking', title: 'IELTS 6.0 - Speaking - L1 - Ex4: Structure (Where/When)', bestScore: 10, maxScore: 10, attempts: 1, status: 'Completed' },
  { id: 'EX05', courseCode: 'IELTS01', sessionOrder: 5, skill: 'Speaking', title: 'IELTS 6.0 - Speaking - L1 - Ex5: Structure (How)', bestScore: 10, maxScore: 10, attempts: 1, status: 'Completed' },
  { id: 'EX06', courseCode: 'IELTS01', sessionOrder: 5, skill: 'Speaking', title: 'IELTS 6.0 - Speaking - L1 - Ex6: Structure (Why)', bestScore: 10, maxScore: 10, attempts: 1, status: 'Completed' },
  { id: 'EX07', courseCode: 'IELTS01', sessionOrder: 5, skill: 'Speaking', title: 'IELTS 6.0 - Speaking - L1 - Ex7: Conversation', maxScore: 10, attempts: 0, status: 'NotStarted' },
  // Buổi 2 - Listening part 1
  { id: 'EX08', courseCode: 'IELTS01', sessionOrder: 2, skill: 'Listening', title: 'IELTS 6.0 - Listening - L1 - Ex1: Form Filling', bestScore: 8, maxScore: 10, attempts: 2, status: 'Completed' },
  { id: 'EX09', courseCode: 'IELTS01', sessionOrder: 2, skill: 'Listening', title: 'IELTS 6.0 - Listening - L1 - Ex2: Note Completion', bestScore: 7, maxScore: 10, attempts: 1, status: 'Completed' },
  // Buổi 3 - Reading skimming
  { id: 'EX10', courseCode: 'IELTS01', sessionOrder: 3, skill: 'Reading', title: 'IELTS 6.0 - Reading - L1 - Ex1: Skimming Practice', bestScore: 9, maxScore: 10, attempts: 1, status: 'Completed' },
  { id: 'EX11', courseCode: 'IELTS01', sessionOrder: 3, skill: 'Reading', title: 'IELTS 6.0 - Reading - L1 - Ex2: Scanning Practice', maxScore: 10, attempts: 1, status: 'InProgress' },
  // Buổi 4 - Writing task 1
  { id: 'EX12', courseCode: 'IELTS01', sessionOrder: 4, skill: 'Writing', title: 'IELTS 6.0 - Writing - L1 - Ex1: Paraphrase Introduction', bestScore: 7.5, maxScore: 9, attempts: 1, status: 'Completed' },
  { id: 'EX13', courseCode: 'IELTS01', sessionOrder: 4, skill: 'Writing', title: 'IELTS 6.0 - Writing - L1 - Ex2: Overview Sentence', maxScore: 9, attempts: 0, status: 'NotStarted' },
  // Vocabulary
  { id: 'EX14', courseCode: 'IELTS01', sessionOrder: 7, skill: 'Vocabulary', title: 'Vocabulary Quiz - Topic Environment', bestScore: 18, maxScore: 20, attempts: 2, status: 'Completed' },
  { id: 'EX15', courseCode: 'IELTS01', sessionOrder: 7, skill: 'Grammar', title: 'Grammar Quiz - Conditionals', maxScore: 15, attempts: 0, status: 'NotStarted' },
];

// Sample W/S — bám sát screenshot mục SAMPLES
export const sampleDocuments: SampleDocument[] = [
  { id: 'SP01', courseCode: 'IELTS01', type: 'Speaking', sessionOrder: 5, title: 'IELTS 6.0 - Sample Speaking (part 1) - Tư duy nối 1 câu đúng: Shopping', topic: 'Shopping', status: 'Reading' },
  { id: 'SP02', courseCode: 'IELTS01', type: 'Speaking', sessionOrder: 5, title: 'IELTS 6.0 - Sample Speaking (part 1) - Tư duy nối 1 câu đúng: Coffee', topic: 'Coffee', status: 'Unread' },
  { id: 'SP03', courseCode: 'IELTS01', type: 'Speaking', sessionOrder: 5, title: 'IELTS 6.0 - Sample Speaking (part 1) - Tư duy nối 1 câu đúng: Outdoors', topic: 'Outdoors', status: 'Unread' },
  { id: 'SP04', courseCode: 'IELTS01', type: 'Speaking', sessionOrder: 5, title: 'IELTS 6.0 - Sample Speaking (part 1) - Tư duy nối 1 câu đúng: Notes', topic: 'Notes', status: 'Unread' },
  { id: 'SP05', courseCode: 'IELTS01', type: 'Writing', sessionOrder: 9, title: 'IELTS 6.0 - Sample Writing Task 2 - Opinion Essay: Education', topic: 'Education', status: 'Read' },
  { id: 'SP06', courseCode: 'IELTS01', type: 'Writing', sessionOrder: 9, title: 'IELTS 6.0 - Sample Writing Task 2 - Discussion: Environment vs Economy', topic: 'Environment', status: 'Reading' },
];

export const courseFeedbacks: CourseFeedback[] = [
  { id: 'FB01', courseCode: 'IELTS01', studentId: 'S001', studentName: 'Hoàng Minh Đức', rating: 5, comment: 'Khoá học rất bổ ích, giáo viên nhiệt tình. Tài liệu đầy đủ.', createdAt: '10/04/2026' },
  { id: 'FB02', courseCode: 'IELTS01', studentId: 'S003', studentName: 'Đỗ Quang Huy', rating: 4, comment: 'Nội dung tốt, mong có thêm bài luyện Speaking cá nhân hoá.', createdAt: '12/04/2026' },
  { id: 'FB03', courseCode: 'IELTS01', studentId: 'S002', studentName: 'Vũ Thị Hà', rating: 5, comment: 'Lộ trình rõ ràng, đề thi mock test sát thực tế.', createdAt: '15/04/2026' },
];

export const certifications: CertificationInfo[] = [
  { studentId: 'S001', courseCode: 'IELTS01', eligible: false, missingRequirements: ['Cần hoàn thành Final Mock Test', 'Đạt mức chuyên cần ≥ 80% (hiện tại 75%)'] },
  { studentId: 'S003', courseCode: 'IELTS01', eligible: true, issuedAt: '01/04/2026', certificateNumber: 'NZE-2026-IELTS01-003', missingRequirements: [] },
];

export const roadmapSteps: RoadmapStep[] = [
  { id: 'RM01', courseCode: 'IELTS01', order: 1, title: 'Hoàn thành kiểm tra đầu vào', description: 'Diagnostic Test xác định band hiện tại để cá nhân hoá lộ trình.', status: 'Done', achievedAt: '15/01/2026', expectedBand: 4.0 },
  { id: 'RM02', courseCode: 'IELTS01', order: 2, title: 'Xây dựng nền tảng Listening & Reading', description: '6 buổi đầu tập trung skimming, scanning, form filling.', status: 'Done', achievedAt: '15/02/2026', expectedBand: 4.5 },
  { id: 'RM03', courseCode: 'IELTS01', order: 3, title: 'Phát triển Writing Task 1 & Speaking Part 1', description: 'Tập viết overview chuẩn cấu trúc + thu âm 10 câu/ngày.', status: 'InProgress', expectedBand: 5.0 },
  { id: 'RM04', courseCode: 'IELTS01', order: 4, title: 'Mid-term Mock Test', description: 'Đánh giá full 4 kỹ năng giữa khoá.', status: 'Upcoming', expectedBand: 5.0 },
  { id: 'RM05', courseCode: 'IELTS01', order: 5, title: 'Nâng cao Writing Task 2', description: 'Opinion / Discussion / Problem-Solution essays.', status: 'Upcoming', expectedBand: 5.5 },
  { id: 'RM06', courseCode: 'IELTS01', order: 6, title: 'Mock Test rehearsal', description: 'Làm 3-4 mock test full đầy đủ áp lực thời gian.', status: 'Upcoming', expectedBand: 5.5 },
  { id: 'RM07', courseCode: 'IELTS01', order: 7, title: 'Final Mock Test & chọn ngày thi thật', description: 'Đảm bảo đạt band mục tiêu trước khi đăng ký thi IELTS chính thức.', status: 'Upcoming', expectedBand: 6.0 },
];

// ===== Helpers =====
export const sampleStatusLabels: Record<SampleReadStatus, string> = {
  Unread: 'Chưa đọc',
  Reading: 'Đang đọc',
  Read: 'Hoàn thành',
};

export const sampleStatusColors: Record<SampleReadStatus, string> = {
  Unread: 'bg-muted text-muted-foreground border-border',
  Reading: 'bg-info/10 text-info border-info/20',
  Read: 'bg-success/10 text-success border-success/20',
};

export const exerciseStatusLabels: Record<ExerciseStatus, string> = {
  NotStarted: 'Chưa bắt đầu',
  InProgress: 'Đang làm',
  Completed: 'Hoàn thành',
};

export const exerciseStatusColors: Record<ExerciseStatus, string> = {
  NotStarted: 'bg-muted text-muted-foreground border-border',
  InProgress: 'bg-info/10 text-info border-info/20',
  Completed: 'bg-success/10 text-success border-success/20',
};

export const skillColors: Record<ExerciseSkill, string> = {
  Listening: 'text-info',
  Reading: 'text-warning',
  Writing: 'text-primary',
  Speaking: 'text-success',
  Vocabulary: 'text-purple-500',
  Grammar: 'text-orange-500',
};

export const roadmapStatusColors: Record<RoadmapStepStatus, string> = {
  Done: 'bg-success/10 text-success border-success/20',
  InProgress: 'bg-info/10 text-info border-info/20',
  Upcoming: 'bg-muted text-muted-foreground border-border',
};
