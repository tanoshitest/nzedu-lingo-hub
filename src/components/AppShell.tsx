import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, LogOut, Menu, X, LayoutDashboard, Users, Calendar, FileCheck, BookOpen, GanttChart, ClipboardList, PenSquare, Inbox, Wallet, Library, UserPlus, RefreshCw, Receipt, Building2, BarChart3, FileEdit, FileText, Database, ClipboardCheck } from 'lucide-react';
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
import CoordinatorGrading from './views/CoordinatorGrading';
import TeacherGrading from './views/TeacherGrading';
import AdminFinance from './views/AdminFinance';
import AdminCourses from './views/AdminCourses';
import CoordinatorAdmissions from './views/CoordinatorAdmissions';
import CoordinatorRenewals from './views/CoordinatorRenewals';
import StudentTuition from './views/StudentTuition';
import TeacherPayroll from './views/TeacherPayroll';
import CoordinatorOffice from './views/CoordinatorOffice';
import AdminReports from './views/AdminReports';
import AdminIeltsTests from './views/AdminIeltsTests';
import AdminQuestionBank from './views/AdminQuestionBank';
import TeacherIeltsTests from './views/TeacherIeltsTests';
import CoordinatorIeltsTests from './views/CoordinatorIeltsTests';
import CoordinatorTestAssignments from './views/CoordinatorTestAssignments';
import StudentMyCourse from './views/StudentMyCourse';
import TeacherMyCourse from './views/TeacherMyCourse';

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
    { key: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
    { key: 'users', label: 'Quản lý người dùng', icon: Users },
    { key: 'courses', label: 'Thiết kế khoá học', icon: Library },
    { key: 'ielts', label: 'Thiết kế đề thi', icon: FileEdit },
    { key: 'bank', label: 'Ngân hàng câu hỏi', icon: Database },
    { key: 'reports', label: 'Báo cáo', icon: BarChart3 },
    { key: 'tasks', label: 'Quản lý công việc', icon: ClipboardList },
  ],
  Coordinator: [
    { key: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
    { key: 'admissions', label: 'Tuyển sinh', icon: UserPlus },
    { key: 'schedule', label: 'Quản lý lịch học', icon: Calendar },
    { key: 'reports', label: 'Duyệt báo cáo', icon: FileCheck },
    { key: 'grading', label: 'Điều phối chấm bài', icon: Inbox },
    { key: 'test-assign', label: 'Giao & Duyệt bài thi', icon: ClipboardCheck },
    { key: 'renewals', label: 'Gia hạn & Công nợ', icon: RefreshCw },
    { key: 'tasks', label: 'Quản lý công việc', icon: ClipboardList },
    { key: 'office', label: 'Công tác văn phòng', icon: Building2 },
    { key: 'ielts', label: 'Đề thi IELTS', icon: FileText },
  ],
  Teacher: [
    { key: 'schedule', label: 'Lịch dạy', icon: Calendar },
    { key: 'my-course', label: 'Khoá học của tôi', icon: BookOpen },
    { key: 'grading', label: 'Khu vực chấm bài', icon: PenSquare },
    { key: 'tasks', label: 'Công việc & Yêu cầu', icon: ClipboardList },
    { key: 'payroll', label: 'Bảng công', icon: Wallet },
    { key: 'ielts', label: 'Đề thi IELTS', icon: FileText },
  ],
  Student: [
    { key: 'dashboard', label: 'Bảng điều khiển', icon: GanttChart },
    { key: 'my-course', label: 'Khoá học của tôi', icon: BookOpen },
    { key: 'schedule', label: 'Lịch học', icon: Calendar },
    { key: 'tuition', label: 'Học phí & Gia hạn', icon: Receipt },
  ],
};

const userNames: Record<Role, string> = {
  Admin: 'Nguyễn Văn An',
  Coordinator: 'Trần Thị Bình',
  Teacher: 'Lê Hoàng Cường',
  Student: 'Hoàng Minh Đức',
};

const AppShell = ({ role, onLogout }: AppShellProps) => {
  const [activeMenu, setActiveMenu] = useState<string>(menus[role][0].key);
  const [mobileOpen, setMobileOpen] = useState(false);

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
    'Coordinator-dashboard': <CoordinatorDashboard />,
    'Coordinator-admissions': <CoordinatorAdmissions />,
    'Coordinator-schedule': <CoordinatorSchedule />,
    'Coordinator-reports': <CoordinatorReports />,
    'Coordinator-grading': <CoordinatorGrading />,
    'Coordinator-renewals': <CoordinatorRenewals />,
    'Coordinator-tasks': <CoordinatorTasks />,
    'Coordinator-office': <CoordinatorOffice />,
    'Coordinator-ielts': <CoordinatorIeltsTests />,
    'Coordinator-test-assign': <CoordinatorTestAssignments />,
    'Teacher-schedule': <TeacherSchedule />,
    'Teacher-grading': <TeacherGrading />,
    'Teacher-tasks': <TeacherTasks />,
    'Teacher-payroll': <TeacherPayroll />,
    'Teacher-ielts': <TeacherIeltsTests />,
    'Teacher-my-course': <TeacherMyCourse />,
    'Student-dashboard': <StudentDashboard />,
    'Student-my-course': <StudentMyCourse />,
    'Student-schedule': <StudentSchedule />,
    'Student-tuition': <StudentTuition />,
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
    <div className="flex h-full w-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-hero">
          <GraduationCap className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <div className="font-display font-bold text-sidebar-primary-foreground">NZedu LMS</div>
          <div className="text-xs text-sidebar-foreground/70">{roleLabels[role]}</div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        <div className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
          Menu chính
        </div>
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
                'group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                active
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-md'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <Icon className={cn('h-4 w-4 transition-transform', active && 'scale-110')} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

    </div>
  );

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 border-r border-sidebar-border fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>
      <div className="hidden lg:block w-64 flex-shrink-0" aria-hidden="true" />

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border bg-card/80 backdrop-blur-md px-4 md:px-6">
          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64 bg-sidebar border-sidebar-border">
              <SidebarContent onItemClick={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>

          <div className="flex-1 min-w-0">
            <h1 className="font-display text-lg md:text-xl font-bold truncate">{currentItem.label}</h1>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Chào mừng trở lại, {userName.split(' ').slice(-1)[0]}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3 rounded-full border border-border bg-background px-3 py-1.5">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="gradient-hero text-primary-foreground text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="text-xs">
                <div className="font-medium leading-tight">{userName}</div>
                <div className="text-muted-foreground leading-tight">{roleLabels[role]}</div>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={onLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Đăng xuất</span>
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">
          <AnimatePresence mode="wait">{renderView()}</AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default AppShell;
