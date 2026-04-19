// ===== IELTS Course Syllabus types =====
// Syllabus cho khóa luyện thi IELTS tại trung tâm tiếng Anh.

export type IeltsVariant = 'Academic' | 'General Training';
export type LearningMode = 'Offline' | 'Online' | 'Hybrid';
export type CefrLevel = 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
export type IeltsSkill = 'Listening' | 'Reading' | 'Writing' | 'Speaking';
export type SessionSkillFocus = IeltsSkill | 'Vocabulary' | 'Grammar' | 'MockTest' | 'Review';
export type SyllabusStatus = 'Draft' | 'Published' | 'Archived';

export interface CourseOverview {
  variant: IeltsVariant;
  targetBandIn: number;
  targetBandOut: number;
  cefrLevel: CefrLevel;
  totalWeeks: number;
  sessionsPerWeek: number;
  hoursPerSession: number;
  learningMode: LearningMode;
  maxStudents: number;
  materialsFee?: number;
}

export interface TargetLearners {
  entryProfile: string;
  exitProfile: string;
  prerequisites: string[];
  placementTestRequired: boolean;
}

export interface LearningObjective {
  id: string;
  skill: IeltsSkill;
  description: string;
}

export type MaterialType = 'Textbook' | 'Workbook' | 'OnlineResource' | 'InternalDoc' | 'TestBank';
export interface CourseMaterial {
  id: string;
  type: MaterialType;
  title: string;
  author?: string;
  publisher?: string;
  url?: string;
  required: boolean;
}

export interface SessionPlan {
  id: string;
  order: number;
  weekNumber: number;
  title: string;
  durationMinutes: number;
  skillFocus: SessionSkillFocus[];
  objectives: string[];
  inClassActivities: string;
  materialIds: string[];
  homework: { description: string; estimatedMinutes: number };
  assessment?: { type: 'Quiz' | 'MiniTest' | 'MockTest'; weight: number };
  notes?: string;
}

export interface AssessmentScheme {
  attendanceWeight: number;
  homeworkWeight: number;
  midtermWeight: number;
  finalWeight: number;
  passThresholdBand: number;
  notes?: string;
}

export interface ClassPolicies {
  attendancePolicy: string;
  latePolicy: string;
  homeworkPolicy: string;
  makeupPolicy: string;
  refundPolicy: string;
  customRules: string[];
}

export interface CourseSyllabus {
  overview: CourseOverview;
  targetLearners: TargetLearners;
  objectives: LearningObjective[];
  materials: CourseMaterial[];
  sessions: SessionPlan[];
  assessment: AssessmentScheme;
  policies: ClassPolicies;
  status: SyllabusStatus;
  version: string;
  lastUpdated: string;
}

// ===== Defaults =====
export const defaultPolicies: ClassPolicies = {
  attendancePolicy: 'Học viên phải tham gia tối thiểu 80% số buổi. Vắng quá 20% số buổi sẽ phải đăng ký học bù.',
  latePolicy: 'Đi muộn quá 15 phút tính là vắng nửa buổi. Ba lần đi muộn = 1 buổi vắng.',
  homeworkPolicy: 'Bài tập phải nộp đúng hạn qua hệ thống LMS. Nộp muộn trừ 20% điểm mỗi ngày.',
  makeupPolicy: 'Học bù miễn phí cho lớp cùng trình độ trong cùng khóa. Cần đăng ký trước 24h với Giáo vụ.',
  refundPolicy: 'Hoàn phí 100% nếu nghỉ trước buổi 1. Hoàn 70% trước buổi 3. Không hoàn phí sau buổi 5.',
  customRules: [
    'Không sử dụng điện thoại trong giờ học (trừ khi giáo viên yêu cầu).',
    'Bật camera đầy đủ khi học Online.',
  ],
};

export const defaultAssessment: AssessmentScheme = {
  attendanceWeight: 10,
  homeworkWeight: 20,
  midtermWeight: 30,
  finalWeight: 40,
  passThresholdBand: 6.5,
  notes: 'Học viên đạt mức tối thiểu sẽ được cấp chứng nhận hoàn thành khóa.',
};

const genObjectives = (bandOut: number): LearningObjective[] => [
  { id: 'O1', skill: 'Listening', description: `Đạt band ${bandOut} Listening — nghe hiểu 4 sections, làm được 14 dạng câu (MCQ, Form, Map, Matching...).` },
  { id: 'O2', skill: 'Listening', description: 'Nhận diện giọng Anh-Anh, Anh-Mỹ, Úc, và các accent phổ biến khác.' },
  { id: 'O3', skill: 'Reading', description: `Đạt band ${bandOut} Reading — áp dụng kỹ thuật skimming, scanning, paraphrase nhận diện.` },
  { id: 'O4', skill: 'Reading', description: 'Thành thạo các dạng TFNG, YNNG, Matching Headings, Summary Completion.' },
  { id: 'O5', skill: 'Writing', description: `Đạt band ${bandOut} Writing — Task 1 mô tả biểu đồ/quy trình 150 từ trong 20 phút.` },
  { id: 'O6', skill: 'Writing', description: `Viết Task 2 Opinion/Discussion/ProblemSolution ${bandOut >= 6.5 ? 280 : 260} từ trong 40 phút.` },
  { id: 'O7', skill: 'Speaking', description: `Đạt band ${bandOut} Speaking — trình bày trôi chảy 3 parts, phát âm rõ ràng, ngữ pháp đa dạng.` },
  { id: 'O8', skill: 'Speaking', description: 'Mở rộng vốn từ theo 15+ topics phổ biến (Work, Education, Travel, Technology...).' },
];

const genMaterials = (bandOut: number): CourseMaterial[] => [
  { id: 'M1', type: 'Textbook', title: bandOut >= 7 ? 'Complete IELTS Bands 6.5-7.5' : 'Mindset for IELTS Foundation', author: 'Cambridge University Press', publisher: 'Cambridge', required: true },
  { id: 'M2', type: 'Workbook', title: 'Cambridge IELTS 17-18 Academic', author: 'Cambridge ESOL', publisher: 'Cambridge', required: true },
  { id: 'M3', type: 'InternalDoc', title: 'NZedu IELTS Vocabulary Pack (15 topics)', author: 'NZedu Academic Team', required: true },
  { id: 'M4', type: 'InternalDoc', title: 'NZedu Writing Sample Bank', author: 'NZedu Academic Team', required: false },
  { id: 'M5', type: 'OnlineResource', title: 'IELTS Liz — Task 2 Model Essays', url: 'https://ieltsliz.com', required: false },
  { id: 'M6', type: 'OnlineResource', title: 'BBC Learning English — 6 Minute English', url: 'https://www.bbc.co.uk/learningenglish', required: false },
  { id: 'M7', type: 'TestBank', title: 'NZedu Question Bank (nội bộ)', author: 'Admin', required: true },
];

// Template 24 buổi theo giai đoạn: Diagnostic → Foundation → Skill deep-dive → Mock rehearsal → Final
const buildSessions = (sessionsPerWeek: number, bandOut: number): SessionPlan[] => {
  const titles: { title: string; focus: SessionSkillFocus[]; hw: string; assessment?: SessionPlan['assessment'] }[] = [
    { title: 'Orientation & Diagnostic Test', focus: ['MockTest'], hw: 'Viết bài luận giới thiệu bản thân (200 từ).', assessment: { type: 'Quiz', weight: 0 } },
    { title: 'Listening Part 1 — Form & Note Completion', focus: ['Listening'], hw: 'Làm Test 1 Cambridge 17 — Part 1.' },
    { title: 'Reading — Skimming, Scanning & Paraphrase', focus: ['Reading'], hw: 'Đọc Passage 1 Cambridge 17 Test 1 + ghi chú paraphrase.' },
    { title: 'Writing Task 1 — Overview & Key Features', focus: ['Writing'], hw: 'Viết Task 1 Bar Chart 150 từ.' },
    { title: 'Speaking Part 1 — Familiar Topics', focus: ['Speaking', 'Vocabulary'], hw: 'Thu âm 10 câu Part 1 về Hometown & Hobbies.' },
    { title: 'Listening Part 2 — Maps & Directions', focus: ['Listening'], hw: 'Làm 2 bài Map Labelling.' },
    { title: 'Vocabulary Boost — Work & Education', focus: ['Vocabulary'], hw: 'Học 50 từ mới trên Quizlet deck Work/Education.' },
    { title: 'Reading — True / False / Not Given', focus: ['Reading'], hw: 'Làm 2 passages TFNG + giải thích lựa chọn.', assessment: { type: 'Quiz', weight: 5 } },
    { title: 'Writing Task 1 — Line Graph & Trends', focus: ['Writing', 'Grammar'], hw: 'Viết Task 1 Line Graph 160 từ.' },
    { title: 'Speaking Part 2 — Cue Card Strategy', focus: ['Speaking'], hw: 'Thu âm 3 cue cards theo template 4 bullet.' },
    { title: 'Listening Part 3 — Academic Discussions', focus: ['Listening'], hw: 'Làm Test 2 Cambridge 17 — Part 3 + chép lại phần sai.' },
    { title: 'Mid-term Mock Test (Full 4 skills)', focus: ['MockTest'], hw: 'Tự soát lỗi bài thi, viết reflection 150 từ.', assessment: { type: 'MockTest', weight: 30 } },
    { title: 'Reading — Matching Headings & Features', focus: ['Reading'], hw: 'Làm 2 passages Matching Headings.' },
    { title: 'Writing Task 2 — Opinion Essays', focus: ['Writing'], hw: 'Viết Task 2 Opinion 250 từ + sample analysis.' },
    { title: 'Speaking Part 3 — Abstract Discussion', focus: ['Speaking'], hw: 'Thu âm 5 câu Part 3 về Technology / Environment.' },
    { title: 'Listening Part 4 — Lectures & Note-taking', focus: ['Listening'], hw: 'Nghe 1 TED-Ed + note structure.' },
    { title: 'Grammar Refinement — Complex Structures', focus: ['Grammar'], hw: 'Viết lại 10 câu đơn thành complex sentences.' },
    { title: 'Writing Task 2 — Discussion & Problem-Solution', focus: ['Writing'], hw: 'Viết Task 2 Discussion 270 từ.', assessment: { type: 'Quiz', weight: 5 } },
    { title: 'Reading — Summary & Sentence Completion', focus: ['Reading'], hw: 'Làm Passage 3 Cambridge 18 Test 1.' },
    { title: 'Speaking Full Practice — Mock Interview', focus: ['Speaking'], hw: 'Thu âm full 14 phút 3 parts.', assessment: { type: 'MiniTest', weight: 5 } },
    { title: 'Reading Timed Test & Analysis', focus: ['Reading', 'MockTest'], hw: 'Làm full 60 phút Reading test.' },
    { title: 'Writing Feedback Workshop', focus: ['Writing', 'Review'], hw: 'Viết lại 1 Task 2 theo feedback GV.' },
    { title: 'Final Review & Exam Strategies', focus: ['Review'], hw: 'Tổng hợp 10 lỗi cá nhân thường gặp.' },
    { title: 'Final Mock Test (Full 4 skills)', focus: ['MockTest'], hw: 'Xem lại đáp án + chốt điểm yếu.', assessment: { type: 'MockTest', weight: 40 } },
  ];
  return titles.map((t, i) => ({
    id: `SES-${String(i + 1).padStart(2, '0')}`,
    order: i + 1,
    weekNumber: Math.floor(i / sessionsPerWeek) + 1,
    title: t.title,
    durationMinutes: 150,
    skillFocus: t.focus,
    objectives: [
      `Hoàn thành được dạng bài ${t.focus.join(' / ')}.`,
      bandOut >= 6.5 ? 'Phân tích lỗi sai và tự sửa trước buổi kế tiếp.' : 'Ghi chép từ vựng mới và luyện lại ở nhà.',
    ],
    inClassActivities: 'Warm-up 10 phút • Skill drill 40 phút • Pair / Group work 30 phút • Exam practice 50 phút • Review & Q&A 20 phút.',
    materialIds: ['M1', 'M2', 'M7'],
    homework: { description: t.hw, estimatedMinutes: 90 },
    assessment: t.assessment,
  }));
};

// ===== Template builder =====
export const buildIeltsTemplate = (targetBand: 5.5 | 6.5 | 7.0): CourseSyllabus => {
  const bandIn = targetBand === 5.5 ? 3.5 : targetBand === 6.5 ? 5.0 : 6.0;
  const cefr: CefrLevel = targetBand === 5.5 ? 'B1' : targetBand === 6.5 ? 'B2' : 'C1';
  const sessionsPerWeek = 2;
  return {
    overview: {
      variant: 'Academic',
      targetBandIn: bandIn,
      targetBandOut: targetBand,
      cefrLevel: cefr,
      totalWeeks: 12,
      sessionsPerWeek,
      hoursPerSession: 2.5,
      learningMode: 'Offline',
      maxStudents: 12,
      materialsFee: 500000,
    },
    targetLearners: {
      entryProfile: `Học viên đã có band ${bandIn} (tương đương ${cefr}), nền tảng ngữ pháp cơ bản, vốn từ ~${targetBand === 5.5 ? 2000 : targetBand === 6.5 ? 3500 : 5000} từ.`,
      exitProfile: `Đạt band ${targetBand} overall IELTS Academic, đủ điều kiện ứng tuyển đại học / du học / định cư.`,
      prerequisites: [
        `Đã học xong khóa tiền đề ${targetBand === 5.5 ? 'Pre-IELTS' : targetBand === 6.5 ? 'IELTS Foundation 5.5' : 'IELTS Intensive 6.5'} hoặc tương đương.`,
        'Có cam kết tự học tối thiểu 8 giờ/tuần.',
      ],
      placementTestRequired: true,
    },
    objectives: genObjectives(targetBand),
    materials: genMaterials(targetBand),
    sessions: buildSessions(sessionsPerWeek, targetBand),
    assessment: defaultAssessment,
    policies: defaultPolicies,
    status: 'Draft',
    version: 'v1.0',
    lastUpdated: new Date().toISOString().slice(0, 10),
  };
};

// ===== Sample syllabi =====
export const sampleSyllabusFoundation: CourseSyllabus = {
  ...buildIeltsTemplate(5.5),
  status: 'Published',
  version: 'v1.2',
  lastUpdated: '2026-02-15',
};

export const sampleSyllabusIntensive: CourseSyllabus = {
  ...buildIeltsTemplate(6.5),
  status: 'Published',
  version: 'v1.0',
  lastUpdated: '2026-03-01',
};

// ===== Labels =====
export const syllabusStatusLabels: Record<SyllabusStatus, string> = {
  Draft: 'Nháp',
  Published: 'Đã phát hành',
  Archived: 'Lưu trữ',
};

export const syllabusStatusColors: Record<SyllabusStatus, string> = {
  Draft: 'bg-muted text-muted-foreground border-border',
  Published: 'bg-success/10 text-success border-success/20',
  Archived: 'bg-warning/10 text-warning border-warning/20',
};

export const materialTypeLabels: Record<MaterialType, string> = {
  Textbook: 'Giáo trình chính',
  Workbook: 'Sách bài tập',
  OnlineResource: 'Tài nguyên online',
  InternalDoc: 'Tài liệu nội bộ',
  TestBank: 'Ngân hàng đề',
};
