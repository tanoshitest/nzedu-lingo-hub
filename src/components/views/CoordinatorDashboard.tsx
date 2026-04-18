import { Calendar, FileClock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { classSessions } from '@/data/mockData';

const CoordinatorDashboard = () => {
  const todayClasses = classSessions.filter((c) => c.date === '18/04/2026').length;
  const pending = classSessions.filter((c) => c.status === 'Đã nộp').length;
  const approved = classSessions.filter((c) => c.status === 'Đã duyệt').length;
  const waiting = classSessions.filter((c) => c.status === 'Chờ báo cáo').length;

  const stats = [
    { icon: Calendar, label: 'Lớp học hôm nay', value: todayClasses, color: 'bg-primary/10 text-primary' },
    { icon: FileClock, label: 'Báo cáo chờ duyệt', value: pending, color: 'bg-warning/10 text-warning' },
    { icon: CheckCircle2, label: 'Báo cáo đã duyệt', value: approved, color: 'bg-success/10 text-success' },
    { icon: AlertCircle, label: 'Chờ giáo viên nộp', value: waiting, color: 'bg-info/10 text-info' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="border-border/60 hover:shadow-elegant transition-all">
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${s.color}`}>
                <s.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="font-display text-2xl font-bold">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="font-display text-base">Hoạt động gần đây</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { time: '5 phút trước', text: 'GV. Lê Hoàng Cường đã nộp báo cáo lớp IELTS 6.5 - A2', type: 'submit' },
              { time: '15 phút trước', text: 'GV. Phạm Mai Dung đã nộp báo cáo lớp TOEIC 750 - B1', type: 'submit' },
              { time: '1 giờ trước', text: 'Bạn đã phê duyệt báo cáo lớp Giao tiếp cơ bản - C1', type: 'approve' },
              { time: '2 giờ trước', text: 'Lịch lớp IELTS 7.0 - A3 đã được cập nhật', type: 'update' },
              { time: '3 giờ trước', text: 'Thêm 2 học viên mới vào lớp TOEIC 750 - B2', type: 'add' },
            ].map((a, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className={`h-2 w-2 rounded-full mt-1.5 flex-shrink-0 ${
                  a.type === 'submit' ? 'bg-warning' : a.type === 'approve' ? 'bg-success' : 'bg-primary'
                }`} />
                <div className="flex-1">
                  <p className="text-sm">{a.text}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="font-display text-base">Lịch học hôm nay</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {classSessions.filter((c) => c.date === '18/04/2026').map((c) => (
              <div key={c.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/40 hover:bg-muted/60 transition">
                <div>
                  <div className="font-medium text-sm">{c.className}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{c.time} • GV. {c.teacher}</div>
                </div>
                <Badge variant="outline" className="bg-info/10 text-info border-info/20">{c.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CoordinatorDashboard;
