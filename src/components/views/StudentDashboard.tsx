import { Calendar, Clock, BookOpen, MapPin, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const StudentDashboard = () => (
  <div className="space-y-6">
    <Card className="overflow-hidden border-0 shadow-elegant">
      <div className="gradient-hero p-6 md:p-8 text-primary-foreground relative">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 blur-3xl -translate-y-32 translate-x-32" />
        <div className="relative">
          <div className="flex items-center gap-2 text-sm opacity-90 mb-2">
            <Sparkles className="h-4 w-4" />
            Chào mừng trở lại
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">Hoàng Minh Đức</h2>
          <p className="opacity-90 max-w-xl">Bạn đang ở khóa <strong>IELTS 6.5 - Lớp A1</strong>. Tiếp tục cố gắng để đạt mục tiêu nhé!</p>
          
          <div className="grid grid-cols-3 gap-4 mt-6 max-w-md">
            <div>
              <div className="text-2xl font-bold">95%</div>
              <div className="text-xs opacity-80">Chuyên cần</div>
            </div>
            <div>
              <div className="text-2xl font-bold">8.5</div>
              <div className="text-xs opacity-80">Điểm TB</div>
            </div>
            <div>
              <div className="text-2xl font-bold">12/16</div>
              <div className="text-xs opacity-80">Buổi đã học</div>
            </div>
          </div>
        </div>
      </div>
    </Card>

    <div className="grid gap-4 md:grid-cols-2">
      <Card className="border-border/60 hover:shadow-elegant transition-all">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="font-display text-base">Lớp học tiếp theo</CardTitle>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Sắp diễn ra</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-display text-xl font-bold">IELTS 6.5 - Lớp A1</h3>
            <p className="text-sm text-muted-foreground">GV. Lê Hoàng Cường</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/40">
              <Calendar className="h-4 w-4 text-primary" />
              <span>18/04/2026</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/40">
              <Clock className="h-4 w-4 text-primary" />
              <span>18:00 - 20:00</span>
            </div>
            <div className="col-span-2 flex items-center gap-2 p-3 rounded-lg bg-muted/40">
              <MapPin className="h-4 w-4 text-primary" />
              <span>Phòng 301 - Cơ sở Cầu Giấy</span>
            </div>
          </div>
          <Button className="w-full gradient-hero">Xem chi tiết</Button>
        </CardContent>
      </Card>

      <Card className="border-border/60 hover:shadow-elegant transition-all">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="font-display text-base">Bài tập cần nộp</CardTitle>
            <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">2 bài</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { title: 'Cambridge IELTS 17 - Test 3', desc: 'Reading & Listening', deadline: 'Hạn: 19/04/2026', urgent: true },
            { title: 'Writing Task 2 - Environment', desc: 'Viết lại bài essay tuần trước', deadline: 'Hạn: 22/04/2026', urgent: false },
          ].map((t, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/30 transition">
              <div className={`h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 ${t.urgent ? 'bg-destructive/10 text-destructive' : 'bg-info/10 text-info'}`}>
                <BookOpen className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{t.title}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{t.desc}</div>
                <div className={`text-xs mt-1 font-medium ${t.urgent ? 'text-destructive' : 'text-muted-foreground'}`}>{t.deadline}</div>
              </div>
            </div>
          ))}
          <Button variant="outline" className="w-full">Xem tất cả bài tập</Button>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default StudentDashboard;
