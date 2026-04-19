import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, MapPin, TrendingUp, Target, BookOpen, Award } from 'lucide-react';
import { classSessions } from '@/data/mockData';
import { attendanceRecords } from '@/data/mockReports';
import { submissions } from '@/data/mockGrading';
import type { TabContext } from '../shared/TabContext';

const OverviewTab = ({ course, role, studentId, className, teacherName }: TabContext) => {
  // Attendance KPI
  const scoped = attendanceRecords.filter((a) =>
    (!className || a.className === className) &&
    (role === 'Teacher' || !studentId || a.studentId === studentId),
  );
  const total = scoped.length || 1;
  const present = scoped.filter((a) => a.status === 'Có mặt' || a.status === 'Đi muộn').length;
  const attendancePct = Math.round((present / total) * 100);

  // Sessions done vs total
  const totalSessions = course.syllabus?.sessions.length ?? course.sessions;
  const sessionsDone = Math.min(totalSessions, Math.round((attendancePct / 100) * totalSessions));

  // Pending submissions (student)
  const mySubmissions = submissions.filter((s) => !studentId || s.studentId === studentId);
  const pending = mySubmissions.filter((s) => s.status === 'Submitted' || s.status === 'Grading' || s.status === 'Assigned');

  // Next session mock
  const nextSession = classSessions.find((s) => s.className === className) ?? classSessions[0];

  return (
    <div className="space-y-4">
      {/* Hero */}
      <Card className="overflow-hidden border-0 shadow-elegant">
        <div className="gradient-hero p-6 text-primary-foreground relative">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 blur-3xl -translate-y-32 translate-x-32" />
          <div className="relative">
            <h2 className="font-display text-2xl font-bold mb-1">{course.name}</h2>
            <p className="opacity-90 text-sm mb-4">
              {role === 'Student' ? 'Tiếp tục cố gắng để đạt mục tiêu nhé!' : `Lớp ${className} • Sĩ số ${course.syllabus?.overview.maxStudents ?? 12} HV`}
            </p>
            <div className="grid grid-cols-4 gap-3 max-w-xl">
              <div><div className="text-2xl font-bold">{attendancePct}%</div><div className="text-xs opacity-80">Chuyên cần</div></div>
              <div><div className="text-2xl font-bold">8.5</div><div className="text-xs opacity-80">Điểm TB</div></div>
              <div><div className="text-2xl font-bold">{sessionsDone}/{totalSessions}</div><div className="text-xs opacity-80">Buổi đã học</div></div>
              <div><div className="text-2xl font-bold">{course.syllabus?.overview.targetBandOut ?? '—'}</div><div className="text-xs opacity-80">Band mục tiêu</div></div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Next session */}
        <Card className="border-border/60">
          <CardHeader><CardTitle className="text-base flex items-center justify-between">
            <span>Buổi học tiếp theo</span>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Sắp diễn ra</Badge>
          </CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h3 className="font-display text-lg font-bold">{nextSession.className}</h3>
              <p className="text-xs text-muted-foreground">GV. {nextSession.teacher ?? teacherName}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2 p-2 rounded-md bg-muted/40"><Calendar className="h-3.5 w-3.5 text-primary" /><span className="text-xs">{nextSession.date}</span></div>
              <div className="flex items-center gap-2 p-2 rounded-md bg-muted/40"><Clock className="h-3.5 w-3.5 text-primary" /><span className="text-xs">{nextSession.time}</span></div>
              <div className="col-span-2 flex items-center gap-2 p-2 rounded-md bg-muted/40"><MapPin className="h-3.5 w-3.5 text-primary" /><span className="text-xs">Phòng 301 - Cơ sở Cầu Giấy</span></div>
            </div>
          </CardContent>
        </Card>

        {/* Quick KPIs */}
        <Card className="border-border/60">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4" /> Tiến độ nhanh</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1"><span>Hoàn thành khoá</span><span className="font-semibold">{Math.round((sessionsDone / totalSessions) * 100)}%</span></div>
              <Progress value={(sessionsDone / totalSessions) * 100} />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1"><span>Chuyên cần</span><span className="font-semibold">{attendancePct}%</span></div>
              <Progress value={attendancePct} />
            </div>
            <div className="flex items-center justify-between text-sm pt-2 border-t border-border/60">
              <div className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-info" /><span>Bài tập cần làm</span></div>
              <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">{pending.length}</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2"><Target className="h-4 w-4 text-primary" /><span>Band hiện tại ước tính</span></div>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">5.0</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2"><Award className="h-4 w-4 text-success" /><span>Xếp hạng lớp</span></div>
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">#3 / 12</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending */}
      <Card className="border-border/60">
        <CardHeader><CardTitle className="text-base">Bài tập cần nộp ({pending.length})</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {pending.slice(0, 4).map((t) => (
            <div key={t.id} className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/30 transition">
              <div className="h-9 w-9 rounded-lg bg-warning/10 text-warning flex items-center justify-center flex-shrink-0">
                <BookOpen className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{t.lessonTitle}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{t.fileName}</div>
                <div className="text-xs text-destructive mt-1 font-medium">Hạn: {t.gradingDeadline ?? '—'}</div>
              </div>
            </div>
          ))}
          {pending.length === 0 && <div className="text-sm text-muted-foreground text-center py-6">Không có bài tập nào cần nộp 🎉</div>}
          {pending.length > 4 && <Button variant="outline" className="w-full" size="sm">Xem tất cả</Button>}
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewTab;
