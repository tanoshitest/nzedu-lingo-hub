import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { CheckCircle2, Users } from 'lucide-react';
import { toast } from 'sonner';
import { classRosters } from '@/data/mockClassReports';
import { attendanceStore, useAttendanceStore, type EvaluationAttendance } from '@/data/mockAttendanceStore';
import { cn } from '@/lib/utils';

const STATUSES: EvaluationAttendance[] = ['Có mặt', 'Đi muộn', 'Vắng có phép', 'Vắng'];

const statusColors: Record<EvaluationAttendance, string> = {
  'Có mặt': 'bg-success/10 text-success border-success/20',
  'Vắng': 'bg-destructive/10 text-destructive border-destructive/20',
  'Vắng có phép': 'bg-warning/10 text-warning border-warning/20',
  'Đi muộn': 'bg-info/10 text-info border-info/20',
};

interface Props {
  className: string;
  sessionDate: string;
  sessionLabel: string;
}

const SessionAttendanceForm = ({ className, sessionDate, sessionLabel }: Props) => {
  useAttendanceStore();

  const roster = classRosters[className] ?? [];
  const existing = attendanceStore.getBySession(className, sessionDate);

  const [rows, setRows] = useState(() => roster.map((s) => {
    const found = existing.find((e) => e.studentId === s.studentId);
    return {
      studentId: s.studentId,
      studentName: s.studentName,
      status: (found?.status ?? 'Có mặt') as EvaluationAttendance,
      note: found?.note ?? '',
    };
  }));

  const updateRow = (idx: number, field: 'status' | 'note', value: string) => {
    setRows((prev) => prev.map((r, i) => i === idx ? { ...r, [field]: value } : r));
  };

  const handleSave = () => {
    attendanceStore.bulkSave(className, sessionDate, sessionLabel, rows);
    toast.success('Đã lưu điểm danh!');
  };

  if (roster.length === 0) {
    return (
      <Card className="border-border/60">
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          Lớp chưa có danh sách học viên.
        </CardContent>
      </Card>
    );
  }

  const presentCount = rows.filter((r) => r.status === 'Có mặt' || r.status === 'Đi muộn').length;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Users className="h-4 w-4" />
        <span>Điểm danh {roster.length} học viên · Ngày {sessionDate}</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {STATUSES.map((s) => {
          const count = rows.filter((r) => r.status === s).length;
          return (
            <div key={s} className={cn('rounded-lg border p-3 text-center', statusColors[s])}>
              <div className="text-2xl font-bold">{count}</div>
              <div className="text-xs">{s}</div>
            </div>
          );
        })}
      </div>

      <Card className="border-border/60">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8 pl-4">#</TableHead>
                <TableHead>Học viên</TableHead>
                <TableHead className="w-48">Trạng thái</TableHead>
                <TableHead>Ghi chú</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, idx) => (
                <TableRow key={row.studentId}>
                  <TableCell className="pl-4 text-muted-foreground text-sm">{idx + 1}</TableCell>
                  <TableCell className="font-medium text-sm">{row.studentName}</TableCell>
                  <TableCell>
                    <Select value={row.status} onValueChange={(v) => updateRow(idx, 'status', v)}>
                      <SelectTrigger className={cn('h-8 text-xs border', statusColors[row.status])}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUSES.map((s) => (
                          <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input
                      value={row.note}
                      onChange={(e) => updateRow(idx, 'note', e.target.value)}
                      placeholder="Ghi chú (tuỳ chọn)"
                      className="h-8 text-xs"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Có mặt: <span className="font-semibold text-success">{presentCount}</span> / {roster.length}
        </div>
        <Button onClick={handleSave} className="gradient-hero gap-2 shadow-elegant">
          <CheckCircle2 className="h-4 w-4" /> Lưu điểm danh
        </Button>
      </div>
    </div>
  );
};

export default SessionAttendanceForm;
