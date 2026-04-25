import React from 'react';
import { SyllabusLessonTemplate } from '../../types/syllabus';
import { BookOpen, CheckCircle2, ChevronRight, FileText } from 'lucide-react';
import { Badge } from '../ui/badge'; // Assuming shadcn/ui components exist

interface SyllabusMatrixViewProps {
  lessons: SyllabusLessonTemplate[];
}

export const SyllabusMatrixView: React.FC<SyllabusMatrixViewProps> = ({ lessons }) => {
  // Group lessons by week
  const groupedLessons = lessons.reduce((acc, lesson) => {
    if (!acc[lesson.weekNumber]) {
      acc[lesson.weekNumber] = [];
    }
    acc[lesson.weekNumber].push(lesson);
    return acc;
  }, {} as Record<number, SyllabusLessonTemplate[]>);

  const skillBadge = (skill: string, active: boolean) => (
    <span
      className={`inline-flex items-center justify-center w-6 h-6 text-[10px] font-bold rounded-full border ${
        active
          ? 'bg-primary/10 text-primary border-primary/20'
          : 'bg-muted text-muted-foreground border-transparent opacity-40'
      }`}
    >
      {skill}
    </span>
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-bottom border-slate-200">
              <th className="px-6 py-4 text-sm font-semibold text-slate-700 w-24">Week</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700">Topic & Lesson</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700 w-32">Books/Pages</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700 w-32 text-center">Skills</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700">Vocabulary & Language</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700">Outcome</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {Object.entries(groupedLessons).map(([week, weekLessons]) => (
              <React.Fragment key={week}>
                {/* Week Header Row */}
                <tr className="bg-slate-50/30">
                  <td className="px-6 py-3" rowSpan={weekLessons.length + 1}>
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Week</span>
                      <span className="text-2xl font-bold text-primary">{week}</span>
                    </div>
                  </td>
                </tr>
                {weekLessons.map((lesson) => (
                  <tr key={lesson.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-slate-500 mb-1">
                          Lesson {lesson.lessonNumber}
                        </span>
                        <span className="text-sm font-semibold text-slate-900 line-clamp-2">
                          {lesson.topicName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 text-[11px] text-slate-600">
                          <BookOpen className="w-3 h-3 text-blue-500" />
                          <span>PB: {lesson.pages.pupilBook}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-600">
                          <FileText className="w-3 h-3 text-emerald-500" />
                          <span>AB: {lesson.pages.activityBook}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-1">
                        {skillBadge('L', lesson.skills.L)}
                        {skillBadge('S', lesson.skills.S)}
                        {skillBadge('R', lesson.skills.R)}
                        {skillBadge('W', lesson.skills.W)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="text-xs">
                          <span className="font-bold text-slate-700 mr-1 italic">Vocab:</span>
                          <span className="text-slate-600">{lesson.content.vocabulary}</span>
                        </div>
                        <div className="text-xs">
                          <span className="font-bold text-slate-700 mr-1 italic">Lang:</span>
                          <span className="text-slate-600">{lesson.content.language}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-slate-600 leading-relaxed max-w-xs">
                        {lesson.lessonOutcome}
                      </p>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
