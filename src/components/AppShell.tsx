import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, LogOut, Menu, LayoutDashboard, Users, Calendar, BookOpen, ClipboardList, PenSquare, Inbox, GanttChart, Receipt, Library, BarChart3, FileEdit, Database, ClipboardCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import type { Role } from '@/data/mockData';
import { roleLabels } from '@/data/mockData';
import AdminDashboard from './views/AdminDashboard';
import AdminUsers from './views/AdminUsers';
import CoordinatorDashboard from './views/CoordinatorDashboard';
import CoordinatorSchedule from './views/CoordinatorSchedule';
import CoordinatorReports from './views/CoordinatorReports';
import TeacherSchedule from './views/TeacherSchedule';
import StudentDashboard from './views/StudentDashboard';
import StudentSchedule from './views/StudentSchedule';
import AdminTasks from './views/AdminTasks';
import CoordinatorTasks from './views/CoordinatorTasks';
import TeacherTasks from './views/TeacherTasks';
import AdminCourses from './views/AdminCourses';
import AdminFinance from './views/AdminFinance';
import AdminReports from './views/AdminReports';
import AdminIeltsTests from './views/AdminIeltsTests';
import AdminQuestionBank from './views/AdminQuestionBank';
import TeacherIeltsTests from './views/TeacherIeltsTests';
import CoordinatorIeltsTests from './views/CoordinatorIeltsTests';
import CoordinatorTestAssignments from './views/CoordinatorTestAssignments';
import CoordinatorAttendance from './views/CoordinatorAttendance';
import CoordinatorMyCourse from './views/CoordinatorMyCourse';
import StudentMyCourse from './views/StudentMyCourse';
import TeacherMyCourse from './views/TeacherMyCourse';
import SyllabusManagementView from './views/SyllabusManagementView';
import ClassProgressView from './views/ClassProgressView';
import TeacherGrading from './views/TeacherGrading';
import CoordinatorGrading from './views/CoordinatorGrading';
import CoordinatorAdmissions from './views/CoordinatorAdmissions';
import CoordinatorRenewals from './views/CoordinatorRenewals';
import StudentTuition from './views/StudentTuition';
import TeacherPayroll from './views/TeacherPayroll';
import CoordinatorOffice from './views/CoordinatorOffice';
import { GradingCoordinationView } from './views/GradingCoordinationView';
import { StudentSubmissionView } from './views/StudentSubmissionView';
import { PendingGradingView } from './views/PendingGradingView';
import { ClassManagementView } from './views/ClassManagementView';
import { MyClassesView } from './views/MyClassesView';
import { SyllabusDetailedView } from './syllabus/SyllabusDetailedView';

interface AppShellProps {
  role: Role;
  onLogout: () => void;
}

interface MenuItem {
  key: string;
  label: string;
  icon: any;
}

const menus: Record<Role, MenuItem[]> = {
  Admin: [
    { key: 'classes', label: 'Quản lý lớp học', icon: LayoutDashboard },
    { key: 'users', label: 'Quản lý người dùng', icon: Users },
    { key: 'ielts', label: 'Thiết kế đề thi', icon: FileEdit },
    { key: 'bank', label: 'Ngân hàng câu hỏi', icon: Database },
    { key: 'reports', label: 'Báo cáo', icon: BarChart3 },
    { key: 'syllabus-matrix', label: 'Quản lý Syllabus', icon: Library },
    { key: 'tasks', label: 'Quản lý công việc', icon: ClipboardList },
  ],
  Coordinator: [
    { key: 'classes', label: 'Quản lý lớp học', icon: LayoutDashboard },
    { key: 'grading', label: 'Điều phối chấm bài', icon: Inbox },
    { key: 'renewals', label: 'Gia hạn & Công nợ', icon: Receipt },
    { key: 'syllabus-matrix', label: 'Quản lý Syllabus', icon: Library },
    { key: 'tasks', label: 'Quản lý công việc', icon: ClipboardList },
  ],
  Teacher: [
    { key: 'my-classes', label: 'Lớp của tôi', icon: LayoutDashboard },
    { key: 'schedule', label: 'Lịch dạy', icon: Calendar },
    { key: 'grading', label: 'Khu vực chấm bài', icon: PenSquare },
    { key: 'tasks', label: 'Công việc & Yêu cầu', icon: ClipboardList },
  ],
  PART_TIME_TEACHER: [
    { key: 'my-classes', label: 'Lớp của tôi', icon: LayoutDashboard },
    { key: 'schedule', label: 'Lịch dạy', icon: Calendar },
    { key: 'grading', label: 'Khu vực chấm bài', icon: PenSquare },
    { key: 'tasks', label: 'Công việc & Yêu cầu', icon: ClipboardList },
  ],
  Student: [
    { key: 'dashboard', label: 'Bảng điều khiển', icon: GanttChart },
    { key: 'syllabus-matrix', label: 'Syllabus của tôi', icon: Library },
    { key: 'submission', label: 'Nộp bài tập', icon: PenSquare },
    { key: 'pending-grading', label: 'Trạng thái bài chấm', icon: ClipboardCheck },
    { key: 'tuition', label: 'Học phí & Gia hạn', icon: Receipt },
  ],
};

const userNames: Record<Role, string> = {
  Admin: 'Nguyễn Văn An',
  Coordinator: 'Trần Thị Bình',
  Teacher: 'Lê Hoàng Cường',
  Student: 'Hoàng Minh Đức',
  PART_TIME_TEACHER: 'Trần Văn Dũng',
};

const AppShell = ({ role, onLogout }: AppShellProps) => {
  const [activeMenu, setActiveMenu] = useState<string>(menus[role][0].key);
  const [selectedClass, setSelectedClass] = useState<{ syllabusId: string; className: string } | null>(null);
  const [activeLessonId, setActiveLessonId] = useState('nk1-1');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const items = menus[role];
  const currentItem = items.find((i) => i.key === activeMenu) ?? items[0];
  const userName = userNames[role];
  const initials = userName.split(' ').slice(-2).map((s) => s[0]).join('');

  const viewMap: Record<string, JSX.Element> = {
    'Admin-dashboard': <AdminDashboard />,
    'Admin-users': <AdminUsers />,
    'Admin-courses': <AdminCourses />,
    'Admin-finance': <AdminFinance />,
    'Admin-reports': <AdminReports />,
    'Admin-ielts': <AdminIeltsTests />,
    'Admin-bank': <AdminQuestionBank />,
    'Admin-tasks': <AdminTasks />,
    'Admin-grading': <GradingCoordinationView />,
    'Coordinator-dashboard': <CoordinatorDashboard />,
    'Coordinator-users': <AdminUsers />,
    'Coordinator-admissions': <CoordinatorAdmissions />,
    'Coordinator-schedule': <CoordinatorSchedule />,
    'Coordinator-attendance': <CoordinatorAttendance />,
    'Coordinator-reports': <CoordinatorReports />,
    'Admin-classes': <ClassManagementView />,
    'Coordinator-classes': <ClassManagementView />,
    'Teacher-my-classes': <MyClassesView teacherId="U003" onSelectClass={(sid, name) => {
      setSelectedClass({ syllabusId: sid, className: name });
      setActiveMenu('class-syllabus');
    }} />,
    'PART_TIME_TEACHER-my-classes': <MyClassesView teacherId="U003" onSelectClass={(sid, name) => {
      setSelectedClass({ syllabusId: sid, className: name });
      setActiveMenu('class-syllabus');
    }} />,
    'Coordinator-grading': <GradingCoordinationView />,
    'Coordinator-renewals': <CoordinatorRenewals />,
    'Coordinator-tasks': <CoordinatorTasks />,
    'Teacher-schedule': <TeacherSchedule />,
    'Teacher-grading': <PendingGradingView />,
    'Teacher-tasks': <TeacherTasks />,
    'Teacher-payroll': <TeacherPayroll />,
    'Teacher-ielts': <TeacherIeltsTests />,
    'Teacher-syllabus-matrix': <SyllabusManagementView userRole="Teacher" />,
    'PART_TIME_TEACHER-schedule': <TeacherSchedule />,
    'PART_TIME_TEACHER-grading': <PendingGradingView />,
    'PART_TIME_TEACHER-tasks': <TeacherTasks />,
    'PART_TIME_TEACHER-syllabus-matrix': <SyllabusManagementView userRole="PART_TIME_TEACHER" />,
    'Student-dashboard': <StudentDashboard />,
    'Student-submission': <StudentSubmissionView />,
    'Student-pending-grading': <PendingGradingView />,
    'Student-syllabus-matrix': <SyllabusManagementView userRole="Student" />,
    'class-syllabus': <SyllabusDetailedView 
      activeLessonId={activeLessonId} 
      onLessonChange={setActiveLessonId} 
      userRole={role}
      className={selectedClass?.className}
    />,
    'Student-schedule': <StudentSchedule />,
    'Student-tuition': <StudentTuition />,
    'Admin-syllabus-matrix': <SyllabusManagementView userRole="Admin" />,
    'Coordinator-syllabus-matrix': <SyllabusManagementView userRole="Coordinator" />,
    'Coordinator-class-progress': <ClassProgressView userRole="COORDINATOR" />,
    'Teacher-class-progress': <ClassProgressView userRole="PART_TIME_TEACHER" />,
  };

  const renderView = () => {
    const key = `${role}-${activeMenu}`;
    const content = viewMap[key] ?? <div className="text-muted-foreground">Chức năng đang được phát triển.</div>;
    return (
      <motion.div
        key={key}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 10 }}
        transition={{ duration: 0.25 }}
      >
        {content}
      </motion.div>
    );
  };

  const SidebarContent = ({ onItemClick }: { onItemClick?: () => void }) => (
    <div className="flex h-full w-full flex-col bg-sidebar text-sidebar-foreground transition-all duration-300">
      <div className={cn(
        "flex h-16 items-center border-b border-sidebar-border px-6 transition-all duration-300 relative",
        sidebarCollapsed ? "justify-center px-0" : "justify-between"
      )}>
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-hero shrink-0">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          {!sidebarCollapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="font-display font-bold text-sidebar-primary-foreground">NZEDU LMS</div>
              <div className="text-xs text-sidebar-foreground/70">{roleLabels[role]}</div>
            </motion.div>
          )}
        </div>
        
        {/* Toggle Button inside Sidebar - Only for Desktop */}
        <button 
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className={cn(
            "hidden lg:flex p-1.5 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground/50 hover:text-sidebar-foreground transition-all",
            sidebarCollapsed ? "absolute -right-4 top-6 bg-sidebar border border-sidebar-border shadow-md z-50 rounded-full" : ""
          )}
        >
          {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {!sidebarCollapsed && (
          <div className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
            Menu chính
          </div>
        )}
        {items.map((item) => {
          const Icon = item.icon;
          const active = item.key === activeMenu;
          return (
            <button
              key={item.key}
              onClick={() => {
                setActiveMenu(item.key);
                onItemClick?.();
              }}
              className={cn(
                'group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all relative',
                active
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-md'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                sidebarCollapsed && "justify-center px-0"
              )}
            >
              <Icon className={cn('h-4 w-4 transition-transform shrink-0', active && 'scale-110')} />
              {(!sidebarCollapsed || onItemClick) && <span>{item.label}</span>}
              {active && sidebarCollapsed && !onItemClick && (
                 <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-l-full" />
              )}
            </button>
          );
        })}
      </nav>

      <div className={cn(
        "p-4 border-t border-sidebar-border transition-all duration-300",
        (sidebarCollapsed && !onItemClick) ? "flex justify-center px-0" : ""
      )}>
        {(!sidebarCollapsed || onItemClick) ? (
          <>
            <div className="flex items-center gap-3 mb-4 px-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="gradient-hero text-primary-foreground text-xs">{initials}</AvatarFallback>
              </Avatar>
              <div className="text-xs">
                <div className="font-medium text-sidebar-primary-foreground">{userName}</div>
                <div className="text-sidebar-foreground/50">{roleLabels[role]}</div>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onLogout} className="w-full justify-start gap-2 text-sidebar-foreground/60 hover:text-sidebar-primary-foreground">
              <LogOut className="h-4 w-4" />
              Đăng xuất
            </Button>
          </>
        ) : (
          <Avatar className="h-8 w-8">
            <AvatarFallback className="gradient-hero text-primary-foreground text-[10px] font-black">{initials}</AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen w-full bg-background overflow-hidden">
      {/* Mobile Nav Trigger & Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b border-border bg-card/80 backdrop-blur-md px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-hero">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="font-display font-bold text-sidebar-foreground">NZEDU LMS</div>
        </div>
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <SidebarContent onItemClick={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden lg:flex flex-shrink-0 border-r border-sidebar-border fixed inset-y-0 left-0 z-30 transition-all duration-300",
        sidebarCollapsed ? "w-20" : "w-64"
      )}>
        <SidebarContent />
      </aside>
      
      {/* Spacer for fixed sidebar */}
      <div className={cn(
        "hidden lg:block transition-all duration-300",
        sidebarCollapsed ? "w-20" : "w-64"
      )} aria-hidden="true" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Mobile Header Spacer */}
        <div className="lg:hidden h-16 shrink-0" />

        {/* Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-[#FDFDFD] relative pb-20 lg:pb-0">
          <AnimatePresence mode="wait">{renderView()}</AnimatePresence>
        </main>

        {/* Mobile Bottom Tab Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-border bg-card/80 backdrop-blur-md px-2">
          {items.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const active = item.key === activeMenu;
            return (
              <button
                key={item.key}
                onClick={() => setActiveMenu(item.key)}
                className={cn(
                  "flex flex-col items-center gap-1 transition-all duration-200",
                  active ? "text-primary scale-110" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] font-medium truncate max-w-[60px]">
                  {item.label.split(' ').pop()}
                </span>
              </button>
            );
          })}
          <button
            onClick={() => setMobileOpen(true)}
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-all"
          >
            <Menu className="h-5 w-5" />
            <span className="text-[10px] font-medium">Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppShell;
