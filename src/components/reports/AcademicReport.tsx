import { useState, useMemo } from 'react';
import { Award, TrendingUp, TrendingDown, Download, GraduationCap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { submissions } from '@/data/mockGrading';

const ranges = [
  { label: '0 - 5', min: 0, max: 5, color: 'from-destructive to-warning' },
  { label: '5 - 7', min: 5, max: 7, color: 'from-warning to-info' },
  { label: '7 - 8.5', min: 7, max: 8.5, color: 'from-info to-primary' },
  { label: '8.5 - 10', min: 8.5, max: 10.01, color: 'from-primary to-success' },
];

const AcademicReport = () => {
  const [classFilter, setClassFilter] = useState<string>('all');

  const classes = useMemo(() => Array.from(new Set(submissions.map((s) => s.className))), []);

  const graded = useMemo(() => submissions.filter((s) =>
    s.score != null && (classFilter === 'all' || s.className === classFilter)
  ), [classFilter]);

  const scores = graded.map((g) => g.score!);
  const avg = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
  const min = scores.length ? Math.min(...scores) : 0;
  const max = scores.length ? Math.max(...scores) : 0;

  // Phân bố
  const distribution = ranges.map((r) => ({
    ...r,
    count: graded.filter((g) => g.score! >= r.min && g.score! < r.max).length,
  }));
  const maxCount = Math.max(1, ...distribution.map((d) => d.count));

  // Top / Bottom theo HV (gom theo studentName)
  const byStudent = useMemo(() => {
    const m = new Map<string, { name: string; scores: number[]; className: string }>();
    graded.forEach((g) => {
      const cur = m.get(g.studentName) ?? { name: g.studentName, scores: [], className: g.className };
      cur.scores.push(g.score!);
      m.set(g.studentName, cur);
    });
    return Array.from(m.values()).map((s) => ({
      name: s.name,
      className: s.className,
      avg: s.scores.reduce((a, b) => a + b, 0) / s.scores.length,
      count: s.scores.length,
    })).sort((a, b) => b.avg - a.avg);
  }, [graded]);

  const top = byStudent.slice(0, 3);
  const bottom = [...byStudent].reverse().slice(0, 3);

  const handleExport = () => toast.success('Đã xuất báo cáo Excel (mock)');

  return (
    <div className="space-y-6">
      {/* KPI */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <Card className="border-border/60"><CardContent className="p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground"><GraduationCap className="h-3.5 w-3.5" /> Tổng bài đã chấm</div>
          <div className="text-2xl font-bold mt-1">{graded.length}</div>
        </CardContent></Card>
        <Card className="border-border/60"><CardContent className="p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground"><Award className="h-3.5 w-3.5 text-primary" /> Điểm trung bình</div>
          <div className="text-2xl font-bold mt-1 text-primary">{avg.toFixed(2)}</div>
        </CardContent></Card>
        <Card className="border-border/60"><CardContent className="p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground"><TrendingUp className="h-3.5 w-3.5 text-success" /> Điểm cao nhất</div>
          <div className="text-2xl font-bold mt-1 text-success">{max.toFixed(1)}</div>
        </CardContent></Card>
        <Card className="border-border/60"><CardContent className="p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground"><TrendingDown className="h-3.5 w-3.5 text-warning" /> Điểm thấp nhất</div>
          <div className="text-2xl font-bold mt-1 text-warning">{min.toFixed(1)}</div>
        </CardContent></Card>
      </div>

      {/* Distribution */}
      <Card className="border-border/60">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <CardTitle className="font-display text-base">Phân bố điểm</CardTitle>
              <p className="text-sm text-muted-foreground">Số bài theo khung điểm</p>
            </div>
            <div className="flex items-center gap-2">
              <Select value={classFilter} onValueChange={setClassFilter}>
                <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả lớp</SelectItem>
                  {classes.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
                <Download className="h-4 w-4" /> Xuất Excel
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4 sm:gap-6 h-56 pt-4">
            {distribution.map((d) => {
              const h = (d.count / maxCount) * 100;
              return (
                <div key={d.label} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full flex-1 flex items-end relative">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition text-xs font-semibold bg-popover border border-border rounded px-2 py-0.5 whitespace-nowrap">
                      {d.count} bài
                    </div>
                    <div
                      className={`w-full rounded-t-md bg-gradient-to-t ${d.color} hover:opacity-80 transition-all cursor-pointer flex items-start justify-center pt-2 text-xs font-bold text-white`}
                      style={{ height: `${Math.max(h, 4)}%` }}
                    >
                      {d.count > 0 && d.count}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground font-medium">{d.label}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Top / Bottom */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="font-display text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-success" /> Top học viên xuất sắc
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {top.map((s, i) => {
              const initials = s.name.split(' ').slice(-2).map((x) => x[0]).join('');
              return (
                <div key={s.name} className="flex items-center gap-3">
                  <div className="w-6 text-center text-sm font-bold text-success">#{i + 1}</div>
                  <Avatar className="h-9 w-9"><AvatarFallback className="gradient-hero text-primary-foreground text-xs">{initials}</AvatarFallback></Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{s.name}</div>
                    <div className="text-xs text-muted-foreground">{s.className} • {s.count} bài</div>
                  </div>
                  <Badge variant="outline" className="bg-success/10 text-success border-success/20">{s.avg.toFixed(2)}</Badge>
                </div>
              );
            })}
            {top.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">Chưa có dữ liệu</p>}
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="font-display text-base flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-warning" /> HV cần hỗ trợ thêm
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {bottom.map((s) => {
              const initials = s.name.split(' ').slice(-2).map((x) => x[0]).join('');
              return (
                <div key={s.name} className="flex items-center gap-3">
                  <Avatar className="h-9 w-9"><AvatarFallback className="bg-warning/20 text-warning text-xs">{initials}</AvatarFallback></Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{s.name}</div>
                    <div className="text-xs text-muted-foreground">{s.className} • {s.count} bài</div>
                  </div>
                  <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">{s.avg.toFixed(2)}</Badge>
                </div>
              );
            })}
            {bottom.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">Chưa có dữ liệu</p>}
          </CardContent>
        </Card>
      </div>

      {/* Bảng chi tiết */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="font-display text-base">Chi tiết bài chấm</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Học viên</TableHead>
                <TableHead className="hidden md:table-cell">Bài</TableHead>
                <TableHead>Lớp</TableHead>
                <TableHead className="text-right">Điểm</TableHead>
                <TableHead className="hidden md:table-cell">Ngày chấm</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {graded.map((g) => (
                <TableRow key={g.id}>
                  <TableCell className="font-medium">{g.studentName}</TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground truncate max-w-[280px]">{g.lessonTitle}</TableCell>
                  <TableCell className="text-sm">{g.className}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className={
                      g.score! >= 8.5 ? 'bg-success/10 text-success border-success/20' :
                      g.score! >= 7 ? 'bg-info/10 text-info border-info/20' :
                      g.score! >= 5 ? 'bg-warning/10 text-warning border-warning/20' :
                      'bg-destructive/10 text-destructive border-destructive/20'
                    }>{g.score!.toFixed(1)}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{g.gradedAt ?? '—'}</TableCell>
                </TableRow>
              ))}
              {graded.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center py-12 text-muted-foreground">Không có bài đã chấm</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AcademicReport;
