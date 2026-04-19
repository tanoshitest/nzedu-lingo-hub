import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, CheckCircle2, Clock, Circle } from 'lucide-react';
import { exerciseScores } from '@/data/mockCourseHub';
import type { TabContext } from '../shared/TabContext';

const ProgressTab = ({ course }: TabContext) => {
  const sessions = course.syllabus?.sessions ?? [];
  const ex = exerciseScores.filter((e) => e.courseCode === course.code);
  const totalSessions = sessions.length || 1;

  // Skill progress
  const skills = ['Listening', 'Reading', 'Writing', 'Speaking'] as const;
  const skillProgress = skills.map((sk) => {
    const items = ex.filter((e) => e.skill === sk);
    const done = items.filter((i) => i.status === 'Completed').length;
    return { skill: sk, total: items.length, done, pct: items.length ? Math.round((done / items.length) * 100) : 0 };
  });

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="border-border/60">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4" /> Tiến độ theo kỹ năng</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {skillProgress.map((s) => (
              <div key={s.skill}>
                <div className="flex justify-between text-xs mb-1">
                  <span>{s.skill}</span>
                  <span className="font-semibold">{s.done}/{s.total} • {s.pct}%</span>
                </div>
                <Progress value={s.pct} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader><CardTitle className="text-base">Tổng quan khoá</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-md bg-muted/30">
              <span className="text-sm">Tổng số buổi</span>
              <Badge variant="outline">{totalSessions} buổi</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-md bg-muted/30">
              <span className="text-sm">Exercises đã làm</span>
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">{ex.filter((e) => e.status === 'Completed').length}/{ex.length}</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-md bg-muted/30">
              <span className="text-sm">Đang làm dở</span>
              <Badge variant="outline" className="bg-info/10 text-info border-info/20">{ex.filter((e) => e.status === 'InProgress').length}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/60">
        <CardHeader><CardTitle className="text-base">Timeline các buổi học</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {sessions.slice(0, 10).map((s, i) => {
            const sessEx = ex.filter((e) => e.sessionOrder === s.order);
            const done = sessEx.length > 0 && sessEx.every((e) => e.status === 'Completed');
            const partial = sessEx.some((e) => e.status !== 'NotStarted');
            const icon = done ? <CheckCircle2 className="h-4 w-4 text-success" /> : partial ? <Clock className="h-4 w-4 text-info" /> : <Circle className="h-4 w-4 text-muted-foreground" />;
            return (
              <div key={s.id} className="flex items-center gap-3 p-3 rounded-lg border border-border">
                {icon}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">Buổi {s.order}: {s.title}</div>
                  <div className="text-xs text-muted-foreground">Tuần {s.weekNumber} • {s.durationMinutes} phút</div>
                </div>
                <Badge variant="outline" className="text-[10px]">{sessEx.length} bài tập</Badge>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressTab;
