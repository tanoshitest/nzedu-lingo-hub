import React, { useMemo } from 'react';
import { Class, ClassLesson, User } from '../../types/syllabus';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { 
  Calendar, 
  ChevronRight, 
  Plus, 
  User as UserIcon,
  Filter
} from 'lucide-react';

interface ClassLessonListProps {
  currentClass: Class;
  lessons: ClassLesson[];
  currentUser: User;
  onLessonSelect: (lesson: ClassLesson) => void;
  onToggleStatus: (lessonId: string) => void;
  onAddExtraLesson: () => void;
}

export const ClassLessonList: React.FC<ClassLessonListProps> = ({
  currentClass,
  lessons,
  currentUser,
  onLessonSelect,
  onToggleStatus,
  onAddExtraLesson,
}) => {
  // Filter lessons based on role
  const filteredLessons = useMemo(() => {
    if (currentUser.role === 'PART_TIME_TEACHER') {
      // In a real app, we might also filter by "this week"
      return lessons.filter(l => l.assignedTeacherId === currentUser.id);
    }
    return lessons;
  }, [lessons, currentUser]);

  const progress = useMemo(() => {
    const total = lessons.length;
    const completed = lessons.filter(l => l.status === 'Completed').length;
    return total > 0 ? (completed / total) * 100 : 0;
  }, [lessons]);

  return (
    <div className="space-y-6">
      {/* Class Overview Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-2xl font-bold text-slate-900">{currentClass.name}</h2>
              <Badge variant="outline" className="text-slate-500 font-medium border-slate-200">
                Course ID: {currentClass.courseId}
              </Badge>
            </div>
            <p className="text-sm text-slate-500 flex items-center gap-2">
              <UserIcon className="w-4 h-4" /> Lead Teacher ID: {currentClass.leadTeacherId}
            </p>
          </div>
          <div className="flex flex-col md:items-end gap-2">
            <Button 
              onClick={onAddExtraLesson}
              className="bg-primary hover:bg-primary/90 text-white font-semibold gap-2"
            >
              <Plus className="w-4 h-4" /> Add Extra Lesson
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="font-bold text-slate-700">Class Progress</span>
            <span className="font-bold text-primary">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2.5 bg-slate-100" />
          <div className="flex justify-between text-[11px] font-medium text-slate-400 pt-1">
            <span>0% Start</span>
            <span>{lessons.filter(l => l.status === 'Completed').length} of {lessons.length} Lessons Completed</span>
            <span>100% Target</span>
          </div>
        </div>
      </div>

      {/* Lesson Timeline */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" /> 
            {currentUser.role === 'PART_TIME_TEACHER' ? 'Your Assigned Lessons' : 'Class Timeline'}
          </h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Completed
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <div className="w-2 h-2 rounded-full bg-slate-300"></div> Pending
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredLessons.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-slate-400 text-sm">No lessons found for the current filter.</p>
            </div>
          ) : (
            filteredLessons.map((lesson) => (
              <div 
                key={lesson.id} 
                className={`group flex items-center p-4 hover:bg-slate-50 transition-all cursor-pointer ${
                  lesson.status === 'Completed' ? 'opacity-80' : ''
                }`}
                onClick={() => onLessonSelect(lesson)}
              >
                <div className="flex items-center gap-4 w-full">
                  <div 
                    className="flex-shrink-0" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleStatus(lesson.id);
                    }}
                  >
                    <Checkbox 
                      checked={lesson.status === 'Completed'} 
                      className="w-5 h-5 border-slate-300 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                    />
                  </div>
                  
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        W{lesson.weekNumber} · L{lesson.lessonNumber}
                      </span>
                      {lesson.isExtraLesson && (
                        <Badge className="h-4 px-1.5 text-[9px] bg-orange-100 text-orange-600 hover:bg-orange-100 border-none uppercase font-bold">
                          Extra
                        </Badge>
                      )}
                      <span className="text-xs text-slate-400 flex items-center gap-1 ml-auto">
                        <Calendar className="w-3 h-3" /> {lesson.teachingDate}
                      </span>
                    </div>
                    <h4 className={`text-sm font-bold leading-none truncate ${
                      lesson.status === 'Completed' ? 'text-slate-400 line-through' : 'text-slate-800'
                    }`}>
                      {lesson.topicName}
                    </h4>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="hidden md:flex flex-col items-end">
                       <span className="text-[10px] font-medium text-slate-400">Assigned To</span>
                       <span className="text-xs font-semibold text-slate-600">Teacher ID: {lesson.assignedTeacherId}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
