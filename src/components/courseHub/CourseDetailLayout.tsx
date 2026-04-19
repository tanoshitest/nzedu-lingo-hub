import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Course } from '@/data/mockFinance';
import { reportStore, useClassReports, reportStatusDot } from '@/data/mockClassReports';
import CourseSidebarNav, { type CourseTabKey } from './CourseSidebarNav';
import OverviewTab from './tabs/OverviewTab';
import SyllabusTab from './tabs/SyllabusTab';
import ScheduleTab from './tabs/ScheduleTab';
import AttendanceTab from './tabs/AttendanceTab';
import ProgressTab from './tabs/ProgressTab';
import AssignmentsTab from './tabs/AssignmentsTab';
import VocabularyTab from './tabs/VocabularyTab';
import ExercisesTab from './tabs/ExercisesTab';
import SampleWSTab from './tabs/SampleWSTab';
import AiMockTestTab from './tabs/AiMockTestTab';
import RoadmapTab from './tabs/RoadmapTab';
import MonthlyResultsTab from './tabs/MonthlyResultsTab';
import TestHistoryTab from './tabs/TestHistoryTab';
import FinalTestTab from './tabs/FinalTestTab';
import YearbookTab from './tabs/YearbookTab';
import CertificationTab from './tabs/CertificationTab';
import FeedbackTab from './tabs/FeedbackTab';
import CourseInfoTab from './tabs/CourseInfoTab';
import ExtraClassTab from './tabs/ExtraClassTab';

export type CourseRole = 'Student' | 'Teacher' | 'Coordinator';

interface Props {
  course: Course;
  role: CourseRole;
  studentId?: string; // for Student view
  className?: string; // class name to scope data (e.g. "IELTS 6.5 - A1")
  teacherName?: string;
  onBack: () => void;
}

const CourseDetailLayout = ({ course, role, studentId, className, teacherName, onBack }: Props) => {
  const [active, setActive] = useState<CourseTabKey>('overview');
  const sessions = course.syllabus?.sessions ?? [];
  const [selectedSessionOrder, setSelectedSessionOrder] = useState<number>(sessions[0]?.order ?? 1);
  useClassReports(); // subscribe to refresh status dots

  const ctx = {
    course,
    role,
    studentId,
    className,
    teacherName,
    selectedSessionOrder,
    onSelectSession: setSelectedSessionOrder,
  };

  const handleNavChange = (key: CourseTabKey) => {
    setActive(key);
  };

  const renderTab = () => {
    switch (active) {
      case 'overview': return <OverviewTab {...ctx} />;
      case 'syllabus': return <SyllabusTab {...ctx} />;
      case 'schedule': return <ScheduleTab {...ctx} />;
      case 'attendance': return <AttendanceTab {...ctx} />;
      case 'progress': return <ProgressTab {...ctx} />;
      case 'assignments': return <AssignmentsTab {...ctx} />;
      case 'vocabulary': return <VocabularyTab {...ctx} />;
      case 'exercises': return <ExercisesTab {...ctx} />;
      case 'samples': return <SampleWSTab {...ctx} />;
      case 'aimock': return <AiMockTestTab {...ctx} />;
      case 'roadmap': return <RoadmapTab {...ctx} />;
      case 'monthly': return <MonthlyResultsTab {...ctx} />;
      case 'test-history': return <TestHistoryTab {...ctx} />;
      case 'final-test': return <FinalTestTab {...ctx} />;
      case 'yearbook': return <YearbookTab {...ctx} />;
      case 'certification': return <CertificationTab {...ctx} />;
      case 'feedback': return <FeedbackTab {...ctx} />;
      case 'course-info': return <CourseInfoTab {...ctx} />;
      case 'extra-class': return <ExtraClassTab {...ctx} />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Breadcrumb + back */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Quay lại danh sách khoá
        </Button>
        <div className="text-xs text-muted-foreground">
          {role} / Khoá học của tôi / <span className="text-foreground font-medium">{course.code}</span>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid lg:grid-cols-[260px_1fr] gap-4">
        {/* Sidebar */}
        <aside className="lg:sticky lg:top-20 lg:h-[calc(100vh-6rem)] lg:overflow-y-auto rounded-lg border border-border/60 bg-card p-3">
          <div className="px-3 pb-3 mb-2 border-b border-border/60">
            <div className="font-display font-bold text-base truncate">{course.name}</div>
            <div className="flex items-center gap-1 flex-wrap mt-1">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px]">{course.code}</Badge>
              {className && <Badge variant="outline" className="text-[10px]">{className}</Badge>}
            </div>
            {teacherName && <div className="text-[11px] text-muted-foreground mt-1">GV: {teacherName}</div>}
          </div>
          <CourseSidebarNav
            active={active}
            onChange={handleNavChange}
            renderAfter={{
              syllabus: sessions.length > 0 ? (
                <div className="ml-3 pl-4 border-l border-border/60 space-y-0.5 py-1 max-h-[50vh] overflow-y-auto">
                  {sessions.map((s) => {
                    const isActiveSession = s.order === selectedSessionOrder;
                    const report = (role === 'Teacher' || role === 'Coordinator') && className
                      ? reportStore.findBySession(course.code, className, s.order)
                      : undefined;
                    return (
                      <button
                        key={s.id}
                        onClick={() => setSelectedSessionOrder(s.order)}
                        className={cn(
                          'group flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-all text-left',
                          isActiveSession
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                        )}
                      >
                        <ChevronRight className={cn('h-3 w-3 flex-shrink-0 transition-transform', isActiveSession && 'rotate-90 text-primary')} />
                        <span className="font-mono text-[10px] flex-shrink-0">B{s.order}</span>
                        <span className="flex-1 min-w-0 truncate">{s.title}</span>
                        {(role === 'Teacher' || role === 'Coordinator') && (
                          <span
                            className={cn(
                              'h-1.5 w-1.5 rounded-full flex-shrink-0',
                              report ? reportStatusDot[report.status] : 'bg-muted-foreground/30',
                            )}
                            title={report ? `Báo cáo: ${report.status}` : 'Chưa có báo cáo'}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : null,
            }}
          />
        </aside>

        {/* Content */}
        <main className="min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {renderTab()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default CourseDetailLayout;
