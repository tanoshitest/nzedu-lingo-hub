import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Upload, 
  Mic, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Download,
  Info,
  Send
} from 'lucide-react';
import { toast } from 'sonner';

interface Exercise {
  id: string;
  title: string;
  description: string;
  type: 'Writing' | 'Speaking' | 'Quiz';
  deadline: string;
  instructions: string[];
}

const mockExercise: Exercise = {
  id: 'EX001',
  title: 'IELTS Writing Task 2: Technology in Education',
  description: 'Write an essay of at least 250 words on the following topic.',
  type: 'Writing',
  deadline: '28/04/2026 - 23:59',
  instructions: [
    'Use appropriate academic vocabulary.',
    'Ensure clear structure (Introduction, Body Paragraphs, Conclusion).',
    'Address all parts of the prompt.',
    'Check for grammar and spelling errors before submitting.'
  ]
};

export function StudentSubmissionView() {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'NotStarted' | 'Draft' | 'Submitted'>('NotStarted');
  const [submissionResult, setSubmissionResult] = useState<{ score: number, accuracy: number } | null>(null);

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  const handleSubmit = () => {
    if (wordCount < 10) {
      toast.error("Vui lòng viết ít nhất 10 từ trước khi nộp bài");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call and potential auto-grading
    setTimeout(() => {
      setIsSubmitting(false);
      setStatus('Submitted');
      
      // If it were a quiz, we'd show scores. For Writing, we show "Awaiting Grading"
      // but for demonstration, let's say we have an AI checker
      setSubmissionResult({
        score: 85,
        accuracy: 92
      });
      
      toast.success("Đã nộp bài thành công! Giáo viên sẽ chấm bài cho bạn sớm nhất có thể.");
    }, 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-1">
      {/* Exercise Overview Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Badge className="bg-indigo-600 hover:bg-indigo-700">{mockExercise.type}</Badge>
            <span className="text-sm text-slate-500 flex items-center gap-1">
              <Clock size={14} /> Hạn nộp: {mockExercise.deadline}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">{mockExercise.title}</h1>
        </div>
        <div className="flex gap-2">
          {status === 'Submitted' ? (
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 py-1.5 px-3">
              <CheckCircle2 size={16} className="mr-2" /> Đã nộp
            </Badge>
          ) : (
            <Button variant="outline" className="border-slate-200 shadow-sm">
              Lưu nháp
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Instructions & Files */}
        <div className="space-y-6">
          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-100">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Info size={16} className="text-indigo-600" />
                Hướng dẫn làm bài
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="space-y-3">
                {mockExercise.instructions.map((inst, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] font-bold">
                      {idx + 1}
                    </span>
                    {inst}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-100">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <FileText size={16} className="text-indigo-600" />
                Tài liệu đính kèm
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100 group hover:border-indigo-200 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-rose-50 text-rose-600 rounded">
                    <FileText size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-700">Writing_Task2_Prompts.pdf</p>
                    <p className="text-[10px] text-slate-500">2.4 MB</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="group-hover:text-indigo-600">
                  <Download size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Submission Area */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-xl">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Nội dung bài làm</span>
                <span className="text-sm font-normal text-slate-500">
                  Số từ: <span className="font-bold text-indigo-600">{wordCount}</span> / 250
                </span>
              </CardTitle>
              <CardDescription>
                Viết trực tiếp hoặc tải file bài làm của bạn lên.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea 
                placeholder="Bắt đầu viết bài tại đây..." 
                className="min-h-[400px] text-base leading-relaxed p-6 focus-visible:ring-indigo-500 border-slate-200"
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  if (status === 'NotStarted') setStatus('Draft');
                }}
                disabled={status === 'Submitted'}
              />
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="outline" className="flex-1 gap-2 py-6 border-dashed border-2 hover:bg-indigo-50 hover:border-indigo-300 transition-all">
                  <Upload size={18} />
                  Tải file PDF/Word
                </Button>
                <Button variant="outline" className="flex-1 gap-2 py-6 border-dashed border-2 hover:bg-indigo-50 hover:border-indigo-300 transition-all">
                  <Mic size={18} />
                  Ghi âm (Speaking)
                </Button>
              </div>
            </CardContent>
            <CardFooter className="bg-slate-50/50 border-t border-slate-100 p-6 flex justify-between items-center">
              <div className="flex items-center gap-2 text-xs text-slate-500 italic">
                <AlertCircle size={14} />
                Hệ thống sẽ lưu tự động bài làm của bạn.
              </div>
              <Button 
                onClick={handleSubmit} 
                className="bg-indigo-600 hover:bg-indigo-700 px-8 gap-2 shadow-lg shadow-indigo-200"
                disabled={isSubmitting || status === 'Submitted' || content.trim() === ''}
              >
                {isSubmitting ? "Đang xử lý..." : status === 'Submitted' ? "Đã nộp" : "Nộp bài"}
                {!isSubmitting && status !== 'Submitted' && <Send size={16} />}
              </Button>
            </CardFooter>
          </Card>

          {/* Submission Feedback (Simulated Auto-grading for aesthetics) */}
          {status === 'Submitted' && (
            <Card className="border-none bg-emerald-50 shadow-md animate-in fade-in slide-in-from-bottom-4 duration-500">
              <CardHeader>
                <CardTitle className="text-emerald-800 text-lg flex items-center gap-2">
                  <CheckCircle2 size={20} />
                  Ghi nhận nộp bài thành công
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-emerald-100">
                    <p className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">Tiến độ hoàn thành</p>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-2xl font-bold text-emerald-600">100%</span>
                    </div>
                    <Progress value={100} className="h-1.5 bg-emerald-100" />
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-emerald-100">
                    <p className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">Độ chính xác (AI check)</p>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-2xl font-bold text-indigo-600">{submissionResult?.accuracy}%</span>
                    </div>
                    <Progress value={submissionResult?.accuracy} className="h-1.5 bg-indigo-100" />
                  </div>
                </div>
                <div className="text-sm text-emerald-800 bg-white/50 p-4 rounded-lg italic">
                  "Bài làm đã được ghi nhận. Giáo viên chủ nhiệm sẽ tiến hành chấm và phản hồi chi tiết cho bạn trong vòng 24-48 giờ tới."
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
