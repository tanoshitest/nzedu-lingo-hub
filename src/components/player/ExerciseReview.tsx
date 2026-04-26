import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, 
  XCircle, 
  Info, 
  ArrowLeft,
  Trophy,
  History,
  Lightbulb,
  MessageSquare,
  Clock,
  Mic,
  Play
} from 'lucide-react';
import { type Exercise, type ExerciseResult } from '@/data/mockExercises';

interface ExerciseReviewProps {
  exercise: Exercise;
  result: ExerciseResult;
  onBack: () => void;
}

export function ExerciseReview({ exercise, result, onBack }: ExerciseReviewProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8">
      {/* Result Header */}
      <Card className="border-none bg-gradient-to-br from-slate-900 to-indigo-900 text-white shadow-2xl overflow-hidden">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="space-y-4 text-center md:text-left">
              <Badge className="bg-blue-500 hover:bg-blue-600 text-white border-none uppercase tracking-widest font-black text-[10px] py-1 px-3">
                KẾT QUẢ BÀI TẬP
              </Badge>
              <h1 className="text-3xl font-black">{exercise.title}</h1>
              <p className="text-slate-300 italic">Nộp lúc: {result.submittedAt}</p>
              <Button variant="outline" onClick={onBack} className="bg-white/10 border-white/20 text-white hover:bg-white hover:text-slate-900 transition-all rounded-xl mt-4">
                <ArrowLeft size={16} className="mr-2" /> Quay lại Syllabus
              </Button>
            </div>
            
            <div className="relative">
              <div className="w-40 h-40 rounded-full border-8 border-white/10 flex flex-col items-center justify-center bg-white/5 backdrop-blur-sm">
                 <span className="text-5xl font-black">{result.score}%</span>
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Accuracy</span>
              </div>
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center text-slate-900 shadow-xl border-4 border-slate-900">
                <Trophy size={20} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
           <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
             <History size={20} className="text-blue-600" /> Xem lại chi tiết
           </h2>
           <div className="flex gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div> Đúng
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-rose-600">
                <div className="w-3 h-3 rounded-full bg-rose-500"></div> Sai
              </div>
           </div>
        </div>

        <div className="space-y-6">
          {exercise.questions.map((question, idx) => {
            const studentAnswer = result.answers.find(a => a.questionId === question.id);
            const isCorrect = studentAnswer?.isCorrect;

            return (
              <Card key={question.id} className={`border-none shadow-sm overflow-hidden transition-all duration-500 ${
                result.status === 'pending' ? 'bg-orange-50/30' :
                isCorrect ? 'bg-emerald-50/30' : 'bg-rose-50/30'
              }`}>
                <CardHeader className="flex flex-row items-start justify-between gap-4 p-6">
                  <div className="flex gap-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm shrink-0 ${
                      result.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                      isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {idx + 1}
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-slate-800 leading-tight">{question.text}</h3>
                      <div className="flex gap-2">
                         <Badge variant="outline" className="text-[10px] font-bold text-slate-400 uppercase border-slate-200">
                            {question.type}
                         </Badge>
                         {result.status === 'pending' && (
                           <Badge className="bg-orange-500 text-white border-none text-[10px] uppercase font-black tracking-tighter">Đang chờ chấm</Badge>
                         )}
                      </div>
                    </div>
                  </div>
                  {result.status === 'pending' ? (
                    <Clock className="text-orange-500 shrink-0" size={24} />
                  ) : isCorrect ? (
                    <CheckCircle2 className="text-emerald-500 shrink-0" size={24} />
                  ) : (
                    <XCircle className="text-rose-500 shrink-0" size={24} />
                  )}
                </CardHeader>
                <CardContent className="p-6 pt-0 space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className={`p-4 rounded-2xl border-2 ${
                      result.status === 'pending' ? 'border-orange-100 bg-white' :
                      isCorrect ? 'border-emerald-100 bg-white' : 'border-rose-100 bg-white'
                    }`}>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Câu trả lời của bạn</p>
                      {question.type === 'speaking' ? (
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                           <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white cursor-pointer hover:bg-blue-600 transition-colors">
                              <Play size={18} fill="currentColor" />
                           </div>
                           <div className="flex-1">
                              <div className="h-1.5 bg-slate-200 rounded-full w-full">
                                <div className="h-full bg-blue-500 w-[40%] rounded-full"></div>
                              </div>
                           </div>
                           <span className="text-xs font-bold text-slate-500">0:12 / 0:30</span>
                        </div>
                      ) : (
                        <p className={`text-lg font-bold ${
                          result.status === 'pending' ? 'text-orange-700' :
                          isCorrect ? 'text-emerald-700' : 'text-rose-700'
                        }`}>
                          {studentAnswer?.studentAnswer || 'Chưa trả lời'}
                        </p>
                      )}
                    </div>
                    
                    {!isCorrect && result.status !== 'pending' && question.correctAnswer && (
                      <div className="p-4 rounded-2xl border-2 border-emerald-100 bg-white">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Đáp án đúng</p>
                        <p className="text-lg font-bold text-emerald-700">
                          {question.correctAnswer}
                        </p>
                      </div>
                    )}
                  </div>

                  {studentAnswer?.teacherComment ? (
                    <div className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100/50 flex gap-4">
                      <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg h-fit">
                         <MessageSquare size={18} />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-emerald-800 uppercase tracking-widest mb-1">Nhận xét từ giáo viên</h4>
                        <p className="text-sm text-emerald-700 leading-relaxed font-medium">
                          {studentAnswer.teacherComment}
                        </p>
                      </div>
                    </div>
                  ) : question.explanation ? (
                    <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100/50 flex gap-4">
                      <div className="p-2 bg-blue-100 text-blue-600 rounded-lg h-fit">
                         <Lightbulb size={18} />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-blue-800 uppercase tracking-widest mb-1">Giải thích</h4>
                        <p className="text-sm text-blue-700 leading-relaxed italic">
                          {question.explanation}
                        </p>
                      </div>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
