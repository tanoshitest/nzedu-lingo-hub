import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { ClipboardCheck } from 'lucide-react';
import { attendanceRecords } from '@/data/mockReports';
import type { TabContext } from '../shared/TabContext';

const statusColors: Record<string, string> = {
  'Có mặt': 'bg-success/10 text-success border-success/20',
  'Vắng': 'bg-destructive/10 text-destructive border-destructive/20',
  'Vắng có phép': 'bg-warning/10 text-warning border-warning/20',
  'Đi muộn': 'bg-info/10 text-info border-info/20',
};

const AttendanceTab = ({ role, studentId, className }: TabContext) => {
  const scoped = attendanceRecords.filter((a) =>
    (!className || a.className === className) &&
    (role === 'Teacher' || !studentId || a.studentId === studentId),
  );
  const total = scoped.length || 1;
  const present = scoped.filter((a) => a.status === 'Có mặt' || a.status === 'Đi muộn').length;
  const absent = scoped.filter((a) => a.status === 'Vắng').length;
  const excused = scoped.filter((a) => a.status === 'Vắng có phép').length;
  const pct = Math.round((present / total) * 100);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Tỉ lệ chuyên cần', value: `${pct}%`, tone: 'success' },
          { label: 'Có mặt / Đi muộn', value: present, tone: 'info' },
          { label: 'Vắng', value: absent, tone: 'destructive' },
          { label: 'Vắng có phép', value: excused, tone: 'warning' },
        ].map((k) => (
          <Card key={k.label} className="border-border/60">
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground">{k.label}</div>
              <div className="text-2xl font-bold mt-1">{k.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/60">
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><ClipboardCheck className="h-4 w-4" /> Mức chuyên cần</CardTitle></CardHeader>
        <CardContent><Progress value={pct} /></CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader><CardTitle className="text-base">Chi tiết điểm danh</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ngày</TableHead>
                {role === 'Teacher' && <TableHead>Học viên</TableHead>}
                <TableHead>Lớp</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ghi chú</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scoped.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="text-sm">{a.sessionDate}</TableCell>
                  {role === 'Teacher' && <TableCell className="text-sm">{a.studentName}</TableCell>}
                  <TableCell className="text-sm">{a.className}</TableCell>
                  <TableCell><Badge variant="outline" className={statusColors[a.status]}>{a.status}</Badge></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{a.note ?? '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {scoped.length === 0 && <div className="text-sm text-muted-foreground text-center py-6">Chưa có dữ liệu điểm danh.</div>}
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceTab;
