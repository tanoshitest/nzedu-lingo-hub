import { LayoutDashboard, BookOpen, CalendarDays, ClipboardCheck, TrendingUp, FileText, Library, ListChecks, FileStack, Sparkles, Route, History, Trophy, Camera, Award, MessageSquare, Info, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export type CourseTabKey =
  | 'overview' | 'syllabus' | 'schedule' | 'attendance' | 'progress'
  | 'assignments' | 'vocabulary' | 'exercises' | 'samples' | 'aimock' | 'roadmap'
  | 'test-history' | 'final-test' | 'yearbook' | 'certification' | 'feedback'
  | 'course-info' | 'extra-class';

export interface NavItem { key: CourseTabKey; label: string; icon: any; hint?: string }
export interface NavGroup { label: string; items: NavItem[] }

export const COURSE_NAV: NavGroup[] = [
  {
    label: '',
    items: [
      { key: 'overview', label: 'Overview', icon: LayoutDashboard },
      { key: 'syllabus', label: 'Syllabus', icon: BookOpen },
      { key: 'schedule', label: 'Lịch lý thuyết', icon: CalendarDays },
      { key: 'attendance', label: 'Attendance & summary', icon: ClipboardCheck, hint: 'Xem summary mỗi buổi học' },
      { key: 'progress', label: 'Tiến độ khóa học', icon: TrendingUp },
    ],
  },
  {
    label: 'BÀI TẬP TRONG KHOÁ',
    items: [
      { key: 'assignments', label: 'Assignments', icon: FileText },
      { key: 'vocabulary', label: 'Vocabulary', icon: Library },
      { key: 'exercises', label: 'Exercises', icon: ListChecks },
      { key: 'samples', label: 'Sample W/S', icon: FileStack },
      { key: 'aimock', label: 'AI mock test', icon: Sparkles, hint: 'AI' },
      { key: 'roadmap', label: 'Roadmap cá nhân hoá', icon: Route },
    ],
  },
  {
    label: 'THỐNG KÊ KHOÁ',
    items: [
      { key: 'test-history', label: 'Lịch sử bài test', icon: History },
      { key: 'final-test', label: 'Final Test', icon: Trophy },
      { key: 'yearbook', label: 'Kỷ yếu', icon: Camera },
      { key: 'certification', label: 'Certification', icon: Award },
      { key: 'feedback', label: 'Feedback khóa học', icon: MessageSquare },
      { key: 'course-info', label: 'Course info', icon: Info },
      { key: 'extra-class', label: 'Extra class', icon: Plus },
    ],
  },
];

interface Props {
  active: CourseTabKey;
  onChange: (key: CourseTabKey) => void;
}

const CourseSidebarNav = ({ active, onChange }: Props) => (
  <nav className="space-y-4">
    {COURSE_NAV.map((group, gi) => (
      <div key={gi} className="space-y-1">
        {group.label && (
          <div className="px-3 pt-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {group.label}
          </div>
        )}
        {group.items.map((item) => {
          const Icon = item.icon;
          const isActive = item.key === active;
          return (
            <button
              key={item.key}
              onClick={() => onChange(item.key)}
              className={cn(
                'group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all text-left',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-foreground/80 hover:bg-muted hover:text-foreground',
              )}
            >
              <Icon className={cn('h-4 w-4 flex-shrink-0', isActive && 'text-primary')} />
              <div className="flex-1 min-w-0">
                <div className="truncate">{item.label}</div>
                {item.hint && <div className="text-[10px] text-muted-foreground truncate">{item.hint}</div>}
              </div>
            </button>
          );
        })}
      </div>
    ))}
  </nav>
);

export default CourseSidebarNav;
