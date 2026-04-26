import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Lightbulb,
  FileText,
  Mic,
  ListTodo
} from 'lucide-react';
import { type Exercise } from '@/data/mockExercises';

interface ExercisePreviewProps {
  exercise: Exercise;
  onBack: () => void;
}

export function ExercisePreview({ exercise, onBack }: ExercisePreviewProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onBack} className="p-0 h-auto hover:bg-transparent text-slate-500 hover:text-slate-900">
               <ArrowLeft size={16} /> Quay lại danh sách
            </Button>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">{exercise.title}</h1>
          <p className="text-slate-500">{exercise.description}</p>
        </div>
        <Badge className="bg-blue-50 text-blue-600 border-blue-100 font-bold px-4 py-1.5 rounded-full text-sm">
          {exercise.questions.length} câu hỏi
        </Badge>
      </div>

      <div className="space-y-6">
        {exercise.questions.map((question, idx) => (
          <Card key={question.id} className="border-none shadow-sm overflow-hidden bg-white border border-slate-100 hover:border-blue-100 transition-colors">
            <CardHeader className="flex flex-row items-start justify-between gap-4 p-6 bg-slate-50/50 border-b border-slate-100">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black text-sm shrink-0">
                  {idx + 1}
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-800 leading-tight">{question.text}</h3>
                  <Badge variant="outline" className="text-[10px] font-bold text-slate-400 uppercase border-slate-200 bg-white">
                    {question.type}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Options for MCQ / TF */}
              {(question.type === 'multiple-choice' || question.type === 'true-false') && (
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Danh sách lựa chọn</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {(question.options || (question.type === 'true-false' ? ['True', 'False'] : [])).map((option, i) => (
                      <div key={i} className={`p-4 rounded-xl border-2 flex items-center justify-between ${
                        option === question.correctAnswer 
                          ? 'border-emerald-500 bg-emerald-50/30' 
                          : 'border-slate-100 text-slate-500'
                      }`}>
                        <span className={`font-bold ${option === question.correctAnswer ? 'text-emerald-700' : ''}`}>
                          {option}
                        </span>
                        {option === question.correctAnswer && <CheckCircle2 size={18} className="text-emerald-500" />}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Fill Blank / Writing / Speaking */}
              {(question.type === 'fill-blank' || question.type === 'writing' || question.type === 'speaking') && (
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Thông tin bài tập</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                       {question.type === 'fill-blank' ? <ListTodo size={20} /> : 
                        question.type === 'writing' ? <FileText size={20} /> : <Mic size={20} />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700">
                        {question.type === 'fill-blank' ? 'Yêu cầu điền từ vào chỗ trống' : 
                         question.type === 'writing' ? 'Yêu cầu viết đoạn văn' : 'Yêu cầu ghi âm giọng nói'}
                      </p>
                      {question.correctAnswer && (
                        <p className="text-xs text-emerald-600 font-bold mt-1">Gợi ý đáp án: {question.correctAnswer}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Explanation Section */}
              {question.explanation && (
                <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100/50 flex gap-4">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg h-fit">
                     <Lightbulb size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-blue-800 uppercase tracking-widest mb-1">Giải thích & Hướng dẫn</h4>
                    <p className="text-sm text-blue-700 leading-relaxed italic">
                      {question.explanation}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
