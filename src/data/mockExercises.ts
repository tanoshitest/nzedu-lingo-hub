export interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'fill-blank' | 'true-false' | 'writing' | 'speaking';
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
}

export interface Exercise {
  id: string;
  lessonId: string;
  title: string;
  description: string;
  questions: Question[];
  isManualGrading?: boolean;
}

export interface ExerciseResult {
  studentId: string;
  exerciseId: string;
  score: number;
  status: 'graded' | 'pending';
  answers: {
    questionId: string;
    studentAnswer: string;
    isCorrect?: boolean;
    teacherComment?: string;
  }[];
  submittedAt: string;
  gradedAt?: string;
}

export const mockExercises: Exercise[] = [
  {
    id: 'EX-001',
    lessonId: 'nk1-1',
    title: 'Review: Vocabulary Day 1',
    description: 'Kiểm tra lại các từ vựng về đồ dùng học tập đã học.',
    questions: [
      {
        id: 'Q1',
        text: 'What is this? (Cái bút mực)',
        type: 'multiple-choice',
        options: ['A pen', 'A pencil', 'A ruler', 'An eraser'],
        correctAnswer: 'A pen',
        explanation: 'Trong tiếng Anh, bút mực là "pen", còn bút chì là "pencil".'
      },
      {
        id: 'Q2',
        text: 'This is ___ eraser.',
        type: 'multiple-choice',
        options: ['a', 'an', 'the', 'some'],
        correctAnswer: 'an',
        explanation: 'Dùng mạo từ "an" trước các danh từ bắt đầu bằng nguyên âm (u, e, o, a, i).'
      },
      {
        id: 'Q3',
        text: 'Điền từ còn thiếu: P_ncil',
        type: 'fill-blank',
        correctAnswer: 'e',
        explanation: 'Cách viết đúng của bút chì là "Pencil".'
      }
    ]
  },
  {
    id: 'EX-002',
    lessonId: 'nk1-1',
    title: 'Grammar: What is it?',
    description: 'Luyện tập cấu trúc hỏi và trả lời về đồ vật.',
    questions: [
      {
        id: 'Q4',
        text: 'Is it a ruler? (Đúng)',
        type: 'true-false',
        correctAnswer: 'True',
        explanation: 'Khi đồng ý với câu hỏi Yes/No, ta dùng "Yes, it is" (True).'
      },
      {
        id: 'Q5',
        text: 'Sắp xếp: it / a / is / book / .',
        type: 'multiple-choice',
        options: ['It is a book.', 'Is it a book.', 'A book is it.', 'It a is book.'],
        correctAnswer: 'It is a book.',
        explanation: 'Cấu trúc câu khẳng định: Chủ ngữ (It) + Động từ (is) + Tân ngữ (a book).'
      }
    ]
  },
  {
    id: 'EX-WR-001',
    lessonId: 'nk1-1',
    title: 'Writing: Introduce Yourself',
    description: 'Viết một đoạn văn ngắn (20-30 từ) giới thiệu tên và tuổi của bạn.',
    isManualGrading: true,
    questions: [
      {
        id: 'Q-WR-1',
        text: 'Write about yourself (Name, Age, Favorite school thing).',
        type: 'writing'
      }
    ]
  },
  {
    id: 'EX-SP-001',
    lessonId: 'nk1-1',
    title: 'Speaking: Hello Teacher',
    description: 'Ghi âm câu chào và giới thiệu bản thân.',
    isManualGrading: true,
    questions: [
      {
        id: 'Q-SP-1',
        text: 'Record your voice: "Hello teacher, my name is Duc. I am 7 years old."',
        type: 'speaking'
      }
    ]
  },
  // Thêm các bài tập mẫu khác
];

// Dữ liệu kết quả mẫu cho học sinh
export const mockExerciseResults: ExerciseResult[] = [
  {
    studentId: 'U005', // Hoàng Minh Đức
    exerciseId: 'EX-001',
    score: 66.7,
    status: 'graded',
    answers: [
      { questionId: 'Q1', studentAnswer: 'A pen', isCorrect: true },
      { questionId: 'Q2', studentAnswer: 'a', isCorrect: false },
      { questionId: 'Q3', studentAnswer: 'e', isCorrect: true }
    ],
    submittedAt: '26/04/2026 09:30'
  },
  {
    studentId: 'U005',
    exerciseId: 'EX-WR-001',
    score: 85,
    status: 'graded',
    answers: [
      { 
        questionId: 'Q-WR-1', 
        studentAnswer: 'My name is Duc. I am 7 years old. I like my red pen.', 
        isCorrect: true,
        teacherComment: 'Tốt lắm Đức! Câu văn rõ ràng, đúng ngữ pháp. Cố gắng phát huy nhé.'
      }
    ],
    submittedAt: '26/04/2026 10:15',
    gradedAt: '26/04/2026 11:00'
  },
  {
    studentId: 'U005',
    exerciseId: 'EX-SP-001',
    score: 0,
    status: 'pending',
    answers: [
      { 
        questionId: 'Q-SP-1', 
        studentAnswer: 'audio_file_mock_url.mp3'
      }
    ],
    submittedAt: '26/04/2026 11:20'
  }
];
