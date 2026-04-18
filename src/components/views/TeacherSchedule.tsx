import { useState } from 'react';
import { Calendar, Clock, FileText, ChevronLeft, ChevronRight, MapPin, LayoutGrid, CalendarDays } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';

type SessionType = 'Chủ nhiệm' | 'Dạy thay';
interface WeekSession {
  id: string;
  className: string;
  dayOfWeek: number; // 1 = Monday ... 7 = Sunday
  startTime: string; // "18:00"
  endTime: string;
  room: string;
  type: SessionType;
  status: 'Chờ báo cáo' | 'Đã nộp' | 'Đã duyệt' | 'Sắp diễn ra';
}

const weekSessions: WeekSession[] = [
  { id: 'W1', className: 'IELTS 6.5 - Lớp A1', dayOfWeek: 1, startTime: '18:00', endTime: '19:30', room: 'P.301', type: 'Chủ nhiệm', status: 'Đã duyệt' },
  { id: 'W2', className: 'IELTS 6.5 - Lớp A1', dayOfWeek: 3, startTime: '18:00', endTime: '19:30', room: 'P.301', type: 'Chủ nhiệm', status: 'Đã nộp' },
  { id: 'W3', className: 'IELTS 7.0 - Lớp A3', dayOfWeek: 4, startTime: '19:30', endTime: '21:00', room: 'P.305', type: 'Dạy thay', status: 'Chờ báo cáo' },
  { id: 'W4', className: 'IELTS 6.5 - Lớp A1', dayOfWeek: 5, startTime: '18:00', endTime: '19:30', room: 'P.301', type: 'Chủ nhiệm', status: 'Sắp diễn ra' },
  { id: 'W5', className: 'IELTS 6.5 - Lớp A2', dayOfWeek: 6, startTime: '09:00', endTime: '10:30', room: 'P.302', type: 'Dạy thay', status: 'Sắp diễn ra' },
  { id: 'W6', className: 'IELTS 6.5 - Lớp A1', dayOfWeek: 7, startTime: '18:00', endTime: '19:30', room: 'P.301', type: 'Chủ nhiệm', status: 'Sắp diễn ra' },
];

const dayLabels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const dayFullLabels = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'];

const statusColors: Record<string, string> = {
  'Chờ báo cáo': 'bg-info/10 text-info border-info/20',
  'Đã nộp': 'bg-warning/10 text-warning border-warning/20',
  'Đã duyệt': 'bg-success/10 text-success border-success/20',
  'Sắp diễn ra': 'bg-primary/10 text-primary border-primary/20',
};

const typeColors: Record<SessionType, string> = {
  'Chủ nhiệm': 'bg-primary/10 text-primary border-primary/20',
  'Dạy thay': 'bg-warning/10 text-warning border-warning/20',
};

const TeacherSchedule = () => {
  const [weekOffset, setWeekOffset] = useState(0);

  // Tính dates Mon-Sun cho tuần hiện tại + offset
  const today = new Date();
  const monday = new Date(today);
  const dow = today.getDay() === 0 ? 7 : today.getDay();
  monday.setDate(today.getDate() - (dow - 1) + weekOffset * 7);
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
  const fmt = (d: Date) => `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;

  const totalWeek = weekSessions.length;
  const thisWeekLabel = weekOffset === 0 ? 'Tuần này' : weekOffset === -1 ? 'Tuần trước' : weekOffset === 1 ? 'Tuần sau' : `Tuần ${weekOffset > 0 ? '+' : ''}${weekOffset}`;

  return (
    <div className="space-y-6">
      <Tabs defaultValue="week">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <TabsList>
            <TabsTrigger value="week" className="gap-2"><CalendarDays className="h-4 w-4" /> Tuần</TabsTrigger>
            <TabsTrigger value="list" className="gap-2"><LayoutGrid className="h-4 w-4" /> Danh sách</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Chủ nhiệm</Badge>
            <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">Dạy thay</Badge>
          </div>
        </div>

        <TabsContent value="week" className="mt-4 space-y-4">
          <Card className="border-border/60">
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <CardTitle className="font-display">Lịch dạy {thisWeekLabel}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {fmt(weekDates[0])} - {fmt(weekDates[6])} • {totalWeek} ca
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => setWeekOffset(weekOffset - 1)}><ChevronLeft className="h-4 w-4" /></Button>
                  <Button variant="outline" size="sm" onClick={() => setWeekOffset(0)}>Hôm nay</Button>
                  <Button variant="outline" size="icon" onClick={() => setWeekOffset(weekOffset + 1)}><ChevronRight className="h-4 w-4" /></Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-7 border-t border-border/60">
                {weekDates.map((d, i) => {
                  const isToday = weekOffset === 0 && d.toDateString() === today.toDateString();
                  const sessions = weekSessions.filter((s) => s.dayOfWeek === i + 1);
                  return (
                    <div key={i} className="border-r border-border/60 last:border-r-0 min-h-[260px]">
                      <div className={`p-2 text-center border-b border-border/60 ${isToday ? 'bg-primary/10' : 'bg-muted/30'}`}>
                        <div className="text-xs text-muted-foreground">{dayLabels[i]}</div>
                        <div className={`text-sm font-semibold ${isToday ? 'text-primary' : ''}`}>{fmt(d)}</div>
                      </div>
                      <div className="p-2 space-y-2">
                        {sessions.map((s) => (
                          <div
                            key={s.id}
                            className={`p-2 rounded-md border cursor-pointer hover:shadow-md transition-all ${
                              s.type === 'Chủ nhiệm' ? 'bg-primary/5 border-primary/20' : 'bg-warning/5 border-warning/20'
                            }`}
                            onClick={() => toast.info(`${s.className} - ${s.startTime}`)}
                          >
                            <div className="text-xs font-semibold truncate">{s.className}</div>
                            <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                              <Clock className="h-2.5 w-2.5" /> {s.startTime}-{s.endTime}
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-2.5 w-2.5" /> {s.room}
                            </div>
                            <Badge variant="outline" className={`${typeColors[s.type]} text-[10px] h-4 px-1 mt-1`}>{s.type}</Badge>
                          </div>
                        ))}
                        {sessions.length === 0 && <div className="text-xs text-muted-foreground/50 text-center py-4">—</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="mt-4">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="font-display">Lịch dạy của bạn</CardTitle>
              <p className="text-sm text-muted-foreground">{totalWeek} ca được phân công tuần này</p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {weekSessions.map((s) => (
                  <div key={s.id} className="rounded-xl border border-border bg-card p-5 hover:shadow-elegant transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div className="h-10 w-10 rounded-lg gradient-card flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <Badge variant="outline" className={typeColors[s.type]}>{s.type}</Badge>
                    </div>
                    <h3 className="font-semibold mb-1">{s.className}</h3>
                    <div className="text-xs text-muted-foreground mb-3">{dayFullLabels[s.dayOfWeek - 1]}</div>
                    <div className="space-y-1.5 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-2"><Clock className="h-3.5 w-3.5" /> {s.startTime} - {s.endTime}</div>
                      <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> {s.room}</div>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="outline" className={statusColors[s.status]}>{s.status}</Badge>
                      <Button
                        size="sm"
                        variant={s.status === 'Chờ báo cáo' ? 'default' : 'outline'}
                        onClick={() => toast.info('Mở tab "Báo cáo lớp học"')}
                        className="gap-1"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        {s.status === 'Chờ báo cáo' ? 'Báo cáo' : 'Xem'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeacherSchedule;
