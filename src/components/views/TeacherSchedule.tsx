import { Calendar, Clock, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { classSessions } from '@/data/mockData';

const statusColors: Record<string, string> = {
  'Chờ báo cáo': 'bg-info/10 text-info border-info/20',
  'Đã nộp': 'bg-warning/10 text-warning border-warning/20',
  'Đã duyệt': 'bg-success/10 text-success border-success/20',
};

const TeacherSchedule = () => {
  const myClasses = classSessions.filter((c) => c.teacher === 'Lê Hoàng Cường');

  return (
    <div className="space-y-6">
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="font-display">Lịch dạy của bạn</CardTitle>
          <p className="text-sm text-muted-foreground">{myClasses.length} lớp được phân công</p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {myClasses.map((c) => (
              <div key={c.id} className="rounded-xl border border-border bg-card p-5 hover:shadow-elegant transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-10 w-10 rounded-lg gradient-card flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <Badge variant="outline" className={statusColors[c.status]}>{c.status}</Badge>
                </div>
                <h3 className="font-semibold mb-3">{c.className}</h3>
                <div className="space-y-1.5 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5" />
                    {c.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5" />
                    {c.time}
                  </div>
                </div>
                <Button
                  className="w-full gap-2"
                  variant={c.status === 'Chờ báo cáo' ? 'default' : 'outline'}
                  onClick={() => toast.info('Chuyển đến tab "Báo cáo lớp học" để viết báo cáo')}
                >
                  <FileText className="h-4 w-4" />
                  {c.status === 'Chờ báo cáo' ? 'Viết báo cáo' : 'Xem báo cáo'}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherSchedule;
