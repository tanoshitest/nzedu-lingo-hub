import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ClipboardCheck, Calendar, CheckCircle2, ArrowLeft, Users } from 'lucide-react';
import { toast } from 'sonner';
import { attendanceRecords } from '@/data/mockReports';
import { classRosters } from '@/data/mockClassReports';
import { attendanceStore, useAttendanceStore, getSessionsForClass, type EvaluationAttendance } from '@/data/mockAttendanceStore';
import { cn } from '@/lib/utils';
import type { TabContext } from '../shared/TabContext';

const statusColors: Record<string, string> = {
  'Có mặt': 'bg-success/10 text-success border-success/20',
  'Vắng': 'bg-destructive/10 text-destructive border-destructive/20',
  'Vắng có phép': 'bg-warning/10 text-warning border-warning/20',
  'Đi muộn': 'bg-info/10 text-info border-info/20',
};

const STATUSES: EvaluationAttendance[] = ['Có mặt', 'Đi muộn', 'Vắng có phép', 'Vắng'];

// ────────────────────────────────────────────────
// Coordinator sub-view: edit attendance for a session
// ────────────────────────────────────────────────
interface CoordEditorProps {
  className: string;
  sessionDate: string;
  sessionLabel: string;
  onBack: () => void;
}

const CoordinatorSessionEditor = ({ className, sessionDate, sessionLabel, onBack }: CoordEditorProps) => {
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
    toast.success('Đã lưu điểm danh thành công!');
    onBack();
  };

  const presentCount = rows.filter((r) => r.status === 'Có mặt' || r.status === 'Đi muộn').length;

  return (
    <div className="space-y-4">
      <Button variant="ghost" onClick={onBack} className="gap-2 -ml-2">
        <ArrowLeft className="h-4 w-4" /> Quay lại danh sách buổi
      </Button>

      <div>
        <h2 className="font-display text-xl font-bold">{sessionLabel}</h2>
        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <span>{sessionDate}</span>
          <span>·</span>
          <Users className="h-3.5 w-3.5" />
          <span>{roster.length} học viên</span>
        </div>
      </div>

      {/* Stats bar */}
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
          Có mặt: <span className="font-semibold text-success">{presentCount}</span> / {roster.length} học viên
        </div>
        <Button onClick={handleSave} className="gradient-hero gap-2 shadow-elegant">
          <CheckCircle2 className="h-4 w-4" /> Lưu điểm danh
        </Button>
      </div>
    </div>
  );
};

// ────────────────────────────────────────────────
// Coordinator main: list sessions for class
// ────────────────────────────────────────────────
const CoordinatorAttendanceView = ({ className }: { className: string }) => {
  useAttendanceStore();
  const [editing, setEditing] = useState<{ date: string; label: string } | null>(null);
  const sessions = useMemo(() => getSessionsForClass(className), [className]);
  const roster = classRosters[className] ?? [];

  if (editing) {
    return (
      <CoordinatorSessionEditor
        className={className}
        sessionDate={editing.date}
        sessionLabel={editing.label}
        onBack={() => setEditing(null)}
      />
    );
  }

  const doneCount = sessions.filter((s) => attendanceStore.isSessionDone(className, s.sessionDate)).length;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-xl font-bold flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5 text-primary" /> Điểm danh lớp học
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Chọn buổi học để điểm danh cho {roster.length} học viên của lớp.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card className="border-border/60">
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Tổng số buổi</div>
            <div className="text-2xl font-bold mt-1">{sessions.length}</div>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Đã điểm danh</div>
            <div className="text-2xl font-bold mt-1 text-success">{doneCount}</div>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Chưa điểm danh</div>
            <div className="text-2xl font-bold mt-1 text-muted-foreground">{sessions.length - doneCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base">Danh sách buổi học</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {sessions.length === 0 && (
            <div className="text-sm text-muted-foreground text-center py-8">
              Chưa có buổi học nào được ghi nhận cho lớp này.
            </div>
          )}
          {sessions.map((s) => {
            const done = attendanceStore.isSessionDone(className, s.sessionDate);
            const entries = done ? attendanceStore.getBySession(className, s.sessionDate) : [];
            const presentCount = entries.filter((e) => e.status === 'Có mặt' || e.status === 'Đi muộn').length;
            return (
              <button
                key={`${className}-${s.sessionDate}`}
                onClick={() => setEditing({ date: s.sessionDate, label: s.sessionLabel })}
                className="w-full text-left rounded-lg border border-border bg-card p-4 hover:shadow-elegant hover:border-primary/30 transition-all flex items-center justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{s.sessionLabel}</div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <Calendar className="h-3 w-3" />
                    <span>{s.sessionDate}</span>
                    {done && (
                      <>
                        <span>·</span>
                        <span className="text-success font-medium">Có mặt: {presentCount}/{roster.length}</span>
                      </>
                    )}
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={done
                    ? 'bg-success/10 text-success border-success/20 whitespace-nowrap'
                    : 'bg-muted text-muted-foreground border-border whitespace-nowrap'}
                >
                  {done ? 'Đã điểm danh' : 'Chưa điểm danh'}
                </Badge>
              </button>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

// ────────────────────────────────────────────────
// Main AttendanceTab
// ────────────────────────────────────────────────
const AttendanceTab = ({ role, studentId, className }: TabContext) => {
  // Coordinator view: điểm danh interactive
  if (role === 'Coordinator' && className) {
    return <CoordinatorAttendanceView className={className} />;
  }

  // Student / Teacher view: read-only summary (giữ nguyên logic cũ)
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
