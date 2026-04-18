import { Award, TrendingUp, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { studentResults } from '@/data/mockData';

const StudentResults = () => {
  const avgScore = (studentResults.reduce((sum, r) => sum + r.score, 0) / studentResults.length).toFixed(1);
  const presentCount = studentResults.filter((r) => r.attendance === 'Có mặt').length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border/60">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Điểm trung bình</p>
              <p className="font-display text-2xl font-bold">{avgScore}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-success/10 text-success flex items-center justify-center">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Buổi có mặt</p>
              <p className="font-display text-2xl font-bold">{presentCount}/{studentResults.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-info/10 text-info flex items-center justify-center">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tiến bộ</p>
              <p className="font-display text-2xl font-bold text-success">+12%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="font-display">Kết quả các buổi học</CardTitle>
          <p className="text-sm text-muted-foreground">Điểm số và nhận xét từ giáo viên</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {studentResults.map((r) => (
              <div key={r.id} className="rounded-xl border border-border bg-card p-5 hover:shadow-md transition-all">
                <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                  <div>
                    <h3 className="font-semibold">{r.className}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {r.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={r.attendance === 'Có mặt' ? 'bg-success/10 text-success border-success/20' : 'bg-destructive/10 text-destructive border-destructive/20'}>
                      {r.attendance}
                    </Badge>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full gradient-card">
                      <Award className="h-3.5 w-3.5 text-primary" />
                      <span className="font-display font-bold text-primary">{r.score}</span>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg bg-muted/40 p-3 text-sm">
                  <span className="font-medium text-muted-foreground">Nhận xét: </span>
                  {r.comment}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentResults;
