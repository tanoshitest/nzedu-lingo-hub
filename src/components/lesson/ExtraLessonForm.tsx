import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { BookOpen, FileText, Target, MessageSquare, AlertCircle, Calendar } from 'lucide-react';

interface ExtraLessonFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export const ExtraLessonForm: React.FC<ExtraLessonFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, use React Hook Form + Zod
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      topicName: formData.get('topicName'),
      teachingDate: formData.get('teachingDate'),
      pages: {
        pupilBook: formData.get('pupilBook'),
        activityBook: formData.get('activityBook'),
      },
      skills: {
        L: (e.target as any).L.checked,
        S: (e.target as any).S.checked,
        R: (e.target as any).R.checked,
        W: (e.target as any).W.checked,
      },
      content: {
        vocabulary: formData.get('vocabulary'),
        language: formData.get('language'),
      },
      lessonOutcome: formData.get('lessonOutcome'),
      lessonReminder: formData.get('lessonReminder'),
      isExtraLesson: true,
      status: 'Pending',
    };
    onSubmit(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <PlusIcon className="w-5 h-5 text-primary" /> Create Extra Lesson
          </DialogTitle>
          <DialogDescription>
            Add a non-syllabus session for review or additional content.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2 md:col-span-1">
              <Label htmlFor="topicName">Topic / Unit Name</Label>
              <Input id="topicName" name="topicName" placeholder="e.g. Grammar Review Unit 1-3" required />
            </div>
            <div className="space-y-2 col-span-2 md:col-span-1">
              <Label htmlFor="teachingDate">Teaching Date</Label>
              <Input id="teachingDate" name="teachingDate" type="date" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5" /> Pupil's Book Pages
              </Label>
              <Input name="pupilBook" placeholder="e.g. 10-12" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5" /> Activity Book Pages
              </Label>
              <Input name="activityBook" placeholder="e.g. 8-9" />
            </div>
          </div>

          <div className="space-y-3">
            <Label>Skills Focused</Label>
            <div className="flex gap-6 p-3 bg-slate-50 rounded-lg border border-slate-100">
              {['L', 'S', 'R', 'W'].map((skill) => (
                <div key={skill} className="flex items-center gap-2">
                  <Checkbox id={skill} name={skill} />
                  <Label htmlFor={skill} className="font-bold text-slate-600">{skill}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-indigo-500" /> Vocabulary
              </Label>
              <Textarea name="vocabulary" placeholder="Key words covered..." className="h-20" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-violet-500" /> Language Focus
              </Label>
              <Textarea name="language" placeholder="Structures and grammar..." className="h-20" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Target className="w-3.5 h-3.5 text-rose-500" /> Lesson Outcome
            </Label>
            <Textarea name="lessonOutcome" placeholder="What should students achieve?" />
          </div>

          <div className="space-y-2 p-4 bg-slate-900 rounded-xl">
            <Label className="flex items-center gap-2 text-slate-300">
              <AlertCircle className="w-3.5 h-3.5 text-slate-400" /> Lesson Reminder (Homework)
            </Label>
            <Textarea 
              name="lessonReminder" 
              placeholder="Summary and homework for parents..." 
              className="bg-slate-800 border-slate-700 text-slate-100 min-h-[100px]"
            />
          </div>

          <DialogFooter className="pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="bg-primary text-white">Create Lesson</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const PlusIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);
