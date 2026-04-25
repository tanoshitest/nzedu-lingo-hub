import React from 'react';
import { ClassLesson } from '../../types/syllabus';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Copy, 
  BookOpen, 
  FileText, 
  Target, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { toast } from 'sonner';

interface LessonDetailModalProps {
  lesson: ClassLesson | null;
  isOpen: boolean;
  onClose: () => void;
}

export const LessonDetailModal: React.FC<LessonDetailModalProps> = ({ 
  lesson, 
  isOpen, 
  onClose 
}) => {
  if (!lesson) return null;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(lesson.lessonReminder);
    toast.success('Lesson reminder copied to clipboard!');
  };

  const skillBadge = (label: string, active: boolean) => (
    <Badge 
      variant={active ? 'default' : 'outline'} 
      className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${
        !active && 'opacity-30 border-dashed'
      }`}
    >
      {label}
    </Badge>
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl overflow-hidden p-0 gap-0">
        <DialogHeader className="p-6 bg-slate-50 border-b border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {lesson.isExtraLesson ? (
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200">
                    Extra Lesson
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200">
                    Standard Lesson
                  </Badge>
                )}
                <span className="text-sm font-medium text-slate-500">
                  Week {lesson.weekNumber} • Lesson {lesson.lessonNumber}
                </span>
              </div>
              <DialogTitle className="text-2xl font-bold text-slate-900 leading-tight">
                {lesson.topicName}
              </DialogTitle>
            </div>
            <div className="flex flex-col items-end gap-2">
               <div className={`px-3 py-1 rounded-full text-xs font-bold border ${
                 lesson.status === 'Completed' 
                 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                 : 'bg-slate-100 text-slate-600 border-slate-200'
               }`}>
                 {lesson.status}
               </div>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Books and Skills Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5" /> Reference Pages
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Pupil's Book</span>
                  <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    p. {lesson.pages.pupilBook}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Activity Book</span>
                  <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    p. {lesson.pages.activityBook}
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Skills Focused</h4>
              <div className="flex gap-2">
                {skillBadge('L', lesson.skills.L)}
                {skillBadge('S', lesson.skills.S)}
                {skillBadge('R', lesson.skills.R)}
                {skillBadge('W', lesson.skills.W)}
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-500" /> Vocabulary
              </h4>
              <p className="text-sm text-slate-600 bg-indigo-50/30 p-3 rounded-lg border border-indigo-100/50">
                {lesson.content.vocabulary}
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-violet-500" /> Language Focus
              </h4>
              <p className="text-sm text-slate-600 bg-violet-50/30 p-3 rounded-lg border border-violet-100/50">
                {lesson.content.language}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Target className="w-4 h-4 text-rose-500" /> Lesson Outcome
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              {lesson.lessonOutcome}
            </p>
          </div>

          {/* Lesson Reminder / Homework */}
          <div className="bg-slate-900 text-slate-100 rounded-xl p-5 relative group">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5" /> Lesson Reminder (Homework)
              </h4>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={copyToClipboard}
                className="h-8 bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200 gap-2"
              >
                <Copy className="w-3.5 h-3.5" /> Copy
              </Button>
            </div>
            <div className="text-sm font-medium leading-relaxed font-mono bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
              {lesson.lessonReminder}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 flex justify-end gap-3 bg-slate-50">
          <Button variant="outline" onClick={onClose}>Close</Button>
          {lesson.status !== 'Completed' && (
            <Button className="bg-emerald-600 hover:bg-emerald-700 gap-2">
              <CheckCircle2 className="w-4 h-4" /> Mark as Completed
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
