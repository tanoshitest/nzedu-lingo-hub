import { Calendar, Clock, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const schedule = [
  { date: '18/04/2026', day: 'Thứ Sáu', className: 'IELTS 6.5 - Lớp A1', time: '18:00 - 20:00', room: 'P. 301 - CS Cầu Giấy', teacher: 'Lê Hoàng Cường', status: 'upcoming' },
  { date: '20/04/2026', day: 'Chủ Nhật', className: 'IELTS 6.5 - Lớp A1', time: '09:00 - 11:00', room: 'P. 301 - CS Cầu Giấy', teacher: 'Lê Hoàng Cường', status: 'upcoming' },
  { date: '22/04/2026', day: 'Thứ Ba', className: 'IELTS 6.5 - Lớp A1', time: '18:00 - 20:00', room: 'P. 301 - CS Cầu Giấy', teacher: 'Lê Hoàng Cường', status: 'upcoming' },
  { date: '17/04/2026', day: 'Thứ Năm', className: 'IELTS 6.5 - Lớp A1', time: '18:00 - 20:00', room: 'P. 301 - CS Cầu Giấy', teacher: 'Lê Hoàng Cường', status: 'completed' },
  { date: '15/04/2026', day: 'Thứ Ba', className: 'IELTS 6.5 - Lớp A1', time: '18:00 - 20:00', room: 'P. 301 - CS Cầu Giấy', teacher: 'Lê Hoàng Cường', status: 'completed' },
];

const StudentSchedule = () => (
  <div className="space-y-6">
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="font-display">Lịch học của bạn</CardTitle>
        <p className="text-sm text-muted-foreground">Tất cả các buổi học sắp tới và đã hoàn thành</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {schedule.map((s, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:shadow-md transition-all">
              <div className="flex-shrink-0 w-16 text-center p-3 rounded-lg gradient-card">
                <div className="text-xs text-primary font-medium">{s.day}</div>
                <div className="font-display text-xl font-bold text-primary">{s.date.split('/')[0]}</div>
                <div className="text-xs text-muted-foreground">T{parseInt(s.date.split('/')[1])}</div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-semibold">{s.className}</h3>
                  <Badge variant="outline" className={s.status === 'upcoming' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-success/10 text-success border-success/20'}>
                    {s.status === 'upcoming' ? 'Sắp diễn ra' : 'Đã hoàn thành'}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{s.time}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{s.room}</span>
                  <span>GV. {s.teacher}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

export default StudentSchedule;
