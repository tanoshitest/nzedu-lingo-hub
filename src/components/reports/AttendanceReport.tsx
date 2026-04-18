import { useState, useMemo } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Clock, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { attendanceRecords, attendanceStatusColors, type AttendanceStatus } from '@/data/mockReports';

const ABSENT_THRESHOLD = 2; // số buổi vắng/đi muộn để được liệt vào danh sách "cần chú ý"

const AttendanceReport = () => {
  const [month, setMonth] = useState<string>('04/2026');
  const [classFilter, setClassFilter] = useState<string>('all');

  const months = useMemo(() => Array.from(new Set(attendanceRecords.map((r) => r.month))).sort().reverse(), []);
  const classes = useMemo(() => Array.from(new Set(attendanceRecords.map((r) => r.className))), []);

  const filtered = useMemo(() => attendanceRecords.filter((r) =>
    (month === 'all' || r.month === month) &&
    (classFilter === 'all' || r.className === classFilter)
  ), [month, classFilter]);

  // KPI
  const total = filtered.length;
  const present = filtered.filter((r) => r.status === 'Có mặt').length;
  const absent = filtered.filter((r) => r.status === 'Vắng').length;
  const excused = filtered.filter((r) => r.status === 'Vắng có phép').length;
  const late = filtered.filter((r) => r.status === 'Đi muộn').length;
  const presentRate = total ? (present / total) * 100 : 0;

  // Theo lớp
  const byClass = useMemo(() => {
    const map = new Map<string, { className: string; total: number; present: number }>();
    filtered.forEach((r) => {
      const cur = map.get(r.className) ?? { className: r.className, total: 0, present: 0 };
      cur.total += 1;
      if (r.status === 'Có mặt') cur.present += 1;
      map.set(r.className, cur);
    });
    return Array.from(map.values()).map((c) => ({
      ...c,
      rate: c.total ? (c.present / c.total) * 100 : 0,
    })).sort((a, b) => b.rate - a.rate);
  }, [filtered]);

  // HV cần chú ý
  const byStudent = useMemo(() => {
    const map = new Map<string, { studentId: string; name: string; className: string; total: number; absent: number; excused: number; late: number }>();
    filtered.forEach((r) => {
      const cur = map.get(r.studentId) ?? { studentId: r.studentId, name: r.studentName, className: r.className, total: 0, absent: 0, excused: 0, late: 0 };
      cur.total += 1;
      if (r.status === 'Vắng') cur.absent += 1;
      if (r.status === 'Vắng có phép') cur.excused += 1;
      if (r.status === 'Đi muộn') cur.late += 1;
      map.set(r.studentId, cur);
    });
    return Array.from(map.values()).map((s) => ({
      ...s,
      rate: s.total ? ((s.total - s.absent - s.late) / s.total) * 100 : 0,
    }));
  }, [filtered]);

  const watchList = byStudent.filter((s) => s.absent + s.late >= ABSENT_THRESHOLD).sort((a, b) => (b.absent + b.late) - (a.absent + a.late));

  const handleExport = () => toast.success('Đã xuất báo cáo Excel (mock)');

  return (
    <div className="space-y-6">
      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border-border/60"><CardContent className="p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground"><CheckCircle2 className="h-3.5 w-3.5 text-success" /> Tỉ lệ chuyên cần</div>
          <div className="text-2xl font-bold mt-1 text-success">{presentRate.toFixed(1)}%</div>
          <div className="text-xs text-muted-foreground mt-1">{present}/{total} lượt</div>
        </CardContent></Card>
        <Card className="border-border/60"><CardContent className="p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground"><XCircle className="h-3.5 w-3.5 text-destructive" /> Vắng không phép</div>
          <div className="text-2xl font-bold mt-1 text-destructive">{absent}</div>
        </CardContent></Card>
        <Card className="border-border/60"><CardContent className="p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground"><AlertCircle className="h-3.5 w-3.5 text-warning" /> Vắng có phép</div>
          <div className="text-2xl font-bold mt-1 text-warning">{excused}</div>
        </CardContent></Card>
        <Card className="border-border/60"><CardContent className="p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground"><Clock className="h-3.5 w-3.5 text-info" /> Đi muộn</div>
          <div className="text-2xl font-bold mt-1 text-info">{late}</div>
        </CardContent></Card>
      </div>

      {/* Filter bar */}
      <Card className="border-border/60">
        <CardContent className="p-4 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả tháng</SelectItem>
                {months.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả lớp</SelectItem>
                {classes.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" /> Xuất Excel
          </Button>
        </CardContent>
      </Card>

      {/* Theo lớp */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="font-display text-base">Tỉ lệ chuyên cần theo lớp</CardTitle>
          <p className="text-sm text-muted-foreground">{byClass.length} lớp được tổng hợp</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {byClass.map((c) => (
            <div key={c.className} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <div className="font-medium">{c.className}</div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{c.present}/{c.total} buổi</span>
                  <Badge variant="outline" className={
                    c.rate >= 90 ? 'bg-success/10 text-success border-success/20' :
                    c.rate >= 75 ? 'bg-warning/10 text-warning border-warning/20' :
                    'bg-destructive/10 text-destructive border-destructive/20'
                  }>{c.rate.toFixed(1)}%</Badge>
                </div>
              </div>
              <Progress value={c.rate} className="h-2" />
            </div>
          ))}
          {byClass.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">Không có dữ liệu</p>}
        </CardContent>
      </Card>

      {/* HV cần chú ý */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="font-display text-base flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-destructive" />
            Học viên cần chú ý
          </CardTitle>
          <p className="text-sm text-muted-foreground">Vắng/đi muộn ≥ {ABSENT_THRESHOLD} lượt trong kỳ</p>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Học viên</TableHead>
                <TableHead>Lớp</TableHead>
                <TableHead className="text-right">Tổng buổi</TableHead>
                <TableHead className="text-right">Vắng</TableHead>
                <TableHead className="text-right hidden md:table-cell">Có phép</TableHead>
                <TableHead className="text-right hidden md:table-cell">Đi muộn</TableHead>
                <TableHead className="text-right">Chuyên cần</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {watchList.map((s) => (
                <TableRow key={s.studentId}>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell className="text-sm">{s.className}</TableCell>
                  <TableCell className="text-right">{s.total}</TableCell>
                  <TableCell className="text-right text-destructive font-semibold">{s.absent}</TableCell>
                  <TableCell className="text-right hidden md:table-cell text-warning">{s.excused}</TableCell>
                  <TableCell className="text-right hidden md:table-cell text-info">{s.late}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className={
                      s.rate >= 80 ? 'bg-warning/10 text-warning border-warning/20' :
                      'bg-destructive/10 text-destructive border-destructive/20'
                    }>{s.rate.toFixed(0)}%</Badge>
                  </TableCell>
                </TableRow>
              ))}
              {watchList.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center py-12 text-muted-foreground">Không có HV nào cần chú ý 🎉</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Bảng điểm danh chi tiết */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="font-display text-base">Nhật ký điểm danh chi tiết</CardTitle>
          <p className="text-sm text-muted-foreground">{filtered.length} bản ghi</p>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ngày</TableHead>
                <TableHead>Học viên</TableHead>
                <TableHead className="hidden md:table-cell">Lớp</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="hidden md:table-cell">Ghi chú</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.slice(0, 30).map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="text-sm">{r.sessionDate}</TableCell>
                  <TableCell className="font-medium">{r.studentName}</TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{r.className}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={attendanceStatusColors[r.status as AttendanceStatus]}>{r.status}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{r.note ?? '—'}</TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center py-12 text-muted-foreground">Không có dữ liệu</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
          {filtered.length > 30 && (
            <div className="text-center text-xs text-muted-foreground py-3 border-t border-border">
              Hiển thị 30/{filtered.length} bản ghi. Dùng filter để xem cụ thể hơn.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceReport;
