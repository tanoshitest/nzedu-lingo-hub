import { Users, BookOpen, FileClock, Wallet, TrendingUp, TrendingDown, Award, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { dashboardStats, monthlyEnrollments } from '@/data/mockData';
import { formatVND } from '@/data/mockFinance';

// Doanh thu 6 tháng gần nhất (mock)
const monthlyRevenue = [
  { month: 'T11', value: 142_000_000 },
  { month: 'T12', value: 168_000_000 },
  { month: 'T1', value: 155_000_000 },
  { month: 'T2', value: 138_000_000 },
  { month: 'T3', value: 175_000_000 },
  { month: 'T4', value: 192_000_000 },
];

// KPI hiệu suất giáo viên (mock)
const teacherKpis = [
  { name: 'Lê Hoàng Cường', sessions: 28, onTimeReports: 96, avgScore: 4.8, trend: 'up' as const },
  { name: 'Phạm Mai Dung', sessions: 22, onTimeReports: 91, avgScore: 4.6, trend: 'up' as const },
  { name: 'Bùi Lan Khanh', sessions: 18, onTimeReports: 78, avgScore: 4.3, trend: 'down' as const },
];

const StatCard = ({ icon: Icon, label, value, trend, color }: any) => (
  <Card className="overflow-hidden border-border/60 hover:shadow-elegant transition-all">
    <CardContent className="p-6">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="font-display text-3xl font-bold">{value}</p>
          {trend && (
            <div className="flex items-center gap-1 text-xs text-success font-medium">
              <TrendingUp className="h-3 w-3" />
              {trend}
            </div>
          )}
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const max = Math.max(...monthlyEnrollments.map((m) => m.value));
  const maxRev = Math.max(...monthlyRevenue.map((m) => m.value));
  const currentRev = monthlyRevenue[monthlyRevenue.length - 1].value;
  const prevRev = monthlyRevenue[monthlyRevenue.length - 2].value;
  const revGrowth = (((currentRev - prevRev) / prevRev) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Tổng học viên" value={dashboardStats.totalStudents.toLocaleString()} trend="+12% so với tháng trước" color="bg-primary/10 text-primary" />
        <StatCard icon={BookOpen} label="Lớp đang hoạt động" value={dashboardStats.activeClasses} trend="+3 lớp mới" color="bg-info/10 text-info" />
        <StatCard icon={FileClock} label="Báo cáo chờ duyệt" value={dashboardStats.pendingReports} color="bg-warning/10 text-warning" />
        <StatCard icon={Wallet} label="Doanh thu tháng" value={formatVND(currentRev)} trend={`+${revGrowth}% so tháng trước`} color="bg-success/10 text-success" />
      </div>

      {/* Doanh thu 6 tháng gần nhất */}
      <Card className="border-border/60">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-display">Doanh thu 6 tháng gần nhất</CardTitle>
              <p className="text-sm text-muted-foreground">Đơn vị: triệu VNĐ</p>
            </div>
            <Badge variant="outline" className="bg-success/10 text-success border-success/20 gap-1">
              <TrendingUp className="h-3 w-3" /> +{revGrowth}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-3 sm:gap-4 h-56 pt-4">
            {monthlyRevenue.map((m) => {
              const h = (m.value / maxRev) * 100;
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full flex-1 flex items-end relative">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition text-xs font-semibold bg-popover border border-border rounded px-2 py-0.5 whitespace-nowrap">
                      {(m.value / 1_000_000).toFixed(0)}M
                    </div>
                    <div
                      className="w-full rounded-t-md bg-gradient-to-t from-success to-primary hover:opacity-80 transition-all cursor-pointer"
                      style={{ height: `${h}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground font-medium">{m.month}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="font-display">Đăng ký học viên theo tháng</CardTitle>
          <p className="text-sm text-muted-foreground">Năm 2025 - Đơn vị: học viên mới</p>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2 sm:gap-3 h-64 pt-4">
            {monthlyEnrollments.map((m) => {
              const h = (m.value / max) * 100;
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full flex-1 flex items-end relative">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition text-xs font-semibold bg-popover border border-border rounded px-2 py-0.5 whitespace-nowrap">
                      {m.value}
                    </div>
                    <div
                      className="w-full rounded-t-md bg-gradient-to-t from-primary to-info hover:from-primary-glow hover:to-info transition-all cursor-pointer"
                      style={{ height: `${h}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground font-medium">{m.month}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-border/60 lg:col-span-1">
          <CardHeader>
            <CardTitle className="font-display text-base flex items-center gap-2"><Award className="h-4 w-4" /> KPI hiệu suất giáo viên</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {teacherKpis.map((t) => {
              const initials = t.name.split(' ').slice(-2).map((s) => s[0]).join('');
              return (
                <div key={t.name} className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8"><AvatarFallback className="gradient-hero text-primary-foreground text-xs">{initials}</AvatarFallback></Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.sessions} ca / tháng</div>
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-medium ${t.trend === 'up' ? 'text-success' : 'text-destructive'}`}>
                      {t.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      <Star className="h-3 w-3" /> {t.avgScore}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Báo cáo đúng hạn</span>
                      <span className="font-medium text-foreground">{t.onTimeReports}%</span>
                    </div>
                    <Progress value={t.onTimeReports} className="h-1.5" />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="font-display text-base">Hoạt động gần đây</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { time: '5 phút trước', text: 'Giáo viên Lê Hoàng Cường đã nộp báo cáo lớp IELTS 6.5 - A2' },
              { time: '23 phút trước', text: 'Thêm 3 học viên mới vào lớp TOEIC 750 - B1' },
              { time: '1 giờ trước', text: 'Giáo vụ Trần Thị Bình đã phê duyệt 5 báo cáo' },
              { time: '2 giờ trước', text: 'Cập nhật học phí khóa IELTS 7.0' },
            ].map((a, i) => (
              <div key={i} className="flex gap-3">
                <div className="h-2 w-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
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
            <CardTitle className="font-display text-base">Phân bổ khóa học</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: 'IELTS', count: 520, percent: 42 },
              { name: 'TOEIC', count: 380, percent: 30 },
              { name: 'Giao tiếp', count: 250, percent: 20 },
              { name: 'Trẻ em', count: 100, percent: 8 },
            ].map((c) => (
              <div key={c.name}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium">{c.name}</span>
                  <span className="text-muted-foreground">{c.count} học viên</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full gradient-hero rounded-full" style={{ width: `${c.percent}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
