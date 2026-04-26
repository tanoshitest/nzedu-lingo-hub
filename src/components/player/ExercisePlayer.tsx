import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Send,
  HelpCircle,
  Clock,
  Mic,
  Music,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { type Exercise } from '@/data/mockExercises';
import { toast } from 'sonner';

interface ExercisePlayerProps {
  exercise: Exercise;
  onSubmit: (answers: Record<string, string>) => void;
  onCancel: () => void;
}

export function ExercisePlayer({ exercise, onSubmit, onCancel }: ExercisePlayerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = exercise.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === exercise.questions.length - 1;

  const handleNext = () => {
    if (currentQuestionIndex < exercise.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleAnswerChange = (value: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleSubmit = () => {
    const answeredCount = Object.keys(answers).length;
    if (answeredCount < exercise.questions.length) {
      toast.warning(`Bạn mới trả lời ${answeredCount}/${exercise.questions.length} câu hỏi.`);
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit(answers);
      toast.success("Đã ghi nhận kết quả bài tập!");
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="mb-8 flex justify-between items-center">
        <Button variant="ghost" onClick={onCancel} className="gap-2">
          <ArrowLeft size={16} /> Thoát
        </Button>
        <div className="flex items-center gap-4">
          <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">
            Câu hỏi {currentQuestionIndex + 1} / {exercise.questions.length}
          </div>
          <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-300" 
              style={{ width: `${((currentQuestionIndex + 1) / exercise.questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="border-none shadow-2xl shadow-slate-200/50 overflow-hidden">
            <CardHeader className="bg-slate-900 text-white p-8">
              <div className="flex items-center gap-3 mb-4">
                 <Badge className="bg-blue-500 hover:bg-blue-600">{currentQuestion.type}</Badge>
              </div>
              <CardTitle className="text-2xl font-bold leading-relaxed">
                {currentQuestion.text}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-10">
              {currentQuestion.type === 'multiple-choice' || currentQuestion.type === 'true-false' ? (
                <RadioGroup 
                  value={answers[currentQuestion.id]} 
                  onValueChange={handleAnswerChange}
                  className="space-y-4"
                >
                  {currentQuestion.options?.map((option, i) => (
                    <div 
                      key={i} 
                      className={`flex items-center space-x-3 p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                        answers[currentQuestion.id] === option 
                          ? 'border-blue-500 bg-blue-50/50' 
                          : 'border-slate-100 hover:border-slate-200'
                      }`}
                      onClick={() => handleAnswerChange(option)}
                    >
                      <RadioGroupItem value={option} id={`q-${i}`} className="text-blue-600 border-slate-300" />
                      <Label htmlFor={`q-${i}`} className="flex-1 font-bold text-slate-700 cursor-pointer text-lg">{option}</Label>
                    </div>
                  )) || (currentQuestion.type === 'true-false' && ['True', 'False'].map((option, i) => (
                    <div 
                      key={i} 
                      className={`flex items-center space-x-3 p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                        answers[currentQuestion.id] === option 
                          ? 'border-blue-500 bg-blue-50/50' 
                          : 'border-slate-100 hover:border-slate-200'
                      }`}
                      onClick={() => handleAnswerChange(option)}
                    >
                      <RadioGroupItem value={option} id={`q-${i}`} className="text-blue-600 border-slate-300" />
                      <Label htmlFor={`q-${i}`} className="flex-1 font-bold text-slate-700 cursor-pointer text-lg">{option}</Label>
                    </div>
                  )))}
                </RadioGroup>
              ) : currentQuestion.type === 'writing' ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-blue-600 font-bold mb-2">
                    <FileText size={20} />
                    <span>Bài tập viết</span>
                  </div>
                  <Textarea 
                    value={answers[currentQuestion.id] || ''} 
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    placeholder="Nhập nội dung bài viết tại đây..."
                    className="min-h-[200px] text-lg font-medium border-2 border-slate-100 focus-visible:ring-blue-500 rounded-2xl p-6"
                    autoFocus
                  />
                  <p className="text-xs text-slate-400 text-right">
                    { (answers[currentQuestion.id] || '').trim().split(/\s+/).filter(Boolean).length } từ
                  </p>
                </div>
              ) : currentQuestion.type === 'speaking' ? (
                <div className="space-y-6 flex flex-col items-center py-10">
                  <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-4 animate-pulse">
                    <Mic size={40} />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-bold text-slate-900">Ghi âm câu trả lời</h3>
                    <p className="text-slate-500">Hãy nhấn nút bên dưới để bắt đầu ghi âm đoạn nói của bạn.</p>
                  </div>
                  
                  <div className="flex gap-4">
                    <Button 
                      className="bg-rose-600 hover:bg-rose-700 h-14 px-8 rounded-full gap-2 shadow-lg shadow-rose-200"
                      onClick={() => handleAnswerChange('audio_file_recorded_url.mp3')}
                    >
                      <div className="w-3 h-3 rounded-full bg-white animate-ping" /> Bắt đầu ghi âm
                    </Button>
                    {answers[currentQuestion.id] && (
                      <div className="flex items-center gap-2 p-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100">
                        <Music size={18} />
                        <span className="text-sm font-bold">Đã ghi âm: recording_01.mp3</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Label className="text-sm font-bold text-slate-500 uppercase">Nhập câu trả lời của bạn</Label>
                  <Input 
                    value={answers[currentQuestion.id] || ''} 
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    placeholder="Viết tại đây..."
                    className="h-16 text-xl font-bold border-2 border-slate-100 focus-visible:ring-blue-500 rounded-2xl px-6"
                    autoFocus
                  />
                </div>
              )}
            </CardContent>
            <CardFooter className="bg-slate-50/50 p-6 flex justify-between border-t border-slate-100">
              <Button 
                variant="outline" 
                onClick={handlePrev} 
                disabled={currentQuestionIndex === 0}
                className="rounded-xl border-slate-200 h-12 px-6"
              >
                <ArrowLeft size={18} className="mr-2" /> Quay lại
              </Button>
              
              {isLastQuestion ? (
                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200 rounded-xl h-12 px-8 gap-2"
                >
                  {isSubmitting ? "Đang gửi..." : "Nộp bài hoàn tất"}
                  {!isSubmitting && <Send size={18} />}
                </Button>
              ) : (
                <Button 
                  onClick={handleNext} 
                  disabled={!answers[currentQuestion.id]}
                  className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 rounded-xl h-12 px-8"
                >
                  Câu tiếp theo <ArrowRight size={18} className="ml-2" />
                </Button>
              )}
            </CardFooter>
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex justify-center gap-3">
        {exercise.questions.map((_, i) => (
          <div 
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              i === currentQuestionIndex ? 'bg-blue-600 w-8' : 
              answers[exercise.questions[i].id] ? 'bg-emerald-400' : 'bg-slate-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
