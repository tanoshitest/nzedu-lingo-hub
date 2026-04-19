import { useState } from 'react';
import { ArrowLeft, Calendar, CheckCircle2, Circle, Users, ClipboardList } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  attendanceStore,
  useAttendanceStore,
  getSessionsForClass,
  type EvaluationAttendance,
  type AttendanceEntry,
} from '@/data/mockAttendanceStore';
import { classRosters } from '@/data/mockClassReports';
import { cn } from '@/lib/utils';

// ──────────────────────────────────────────────
// Attendance status config
// ──────────────────────────────────────────────
const STATUSES: EvaluationAttendance[] = ['Có mặt', 'Đi muộn', 'Vắng có phép', 'Vắng'];

const statusColors: Record<EvaluationAttendance, string> = {
  'Có mặt': 'bg-success/10 text-success border-success/20',
  'Vắng': 'bg-destructive/10 text-destructive border-destructive/20',
  'Vắng có phép': 'bg-warning/10 text-warning border-warning/20',
  'Đi muộn': 'bg-info/10 text-info border-info/20',
};

// ──────────────────────────────────────────────
// Level 3 — Attendance form for a session
// ──────────────────────────────────────────────
interface SessionFormProps {
  className: string;
  sessionDate: string;
  sessionLabel: string;
  onBack: () => void;
}

const SessionAttendanceForm = ({ className, sessionDate, sessionLabel, onBack }: SessionFormProps) => {
  useAttendanceStore(); // subscribe to re-render on changes

  const roster = classRosters[className] ?? [];
  const existing = attendanceStore.getBySession(className, sessionDate);

  const getInitialStatus = (studentId: string): EvaluationAttendance => {
    const found = existing.find((e) => e.studentId === studentId);
    return found ? found.status : 'Có mặt';
  };

  const getInitialNote = (studentId: string): string => {
    const found = existing.find((e) => e.studentId === studentId);
    return found?.note ?? '';
  };

  const [rows, setRows] = useState<{ studentId: string; studentName: string; status: EvaluationAttendance; note: string }[]>(
    () => roster.map((s) => ({ studentId: s.studentId, studentName: s.studentName, status: getInitialStatus(s.studentId), note: getInitialNote(s.studentId) }))
  );

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
    <div className="space-y-4 max-w-4xl">
      <Button variant="ghost" onClick={onBack} className="gap-2 -ml-2">
        <ArrowLeft className="h-4 w-4" /> Quay lại danh sách buổi
      </Button>

      <div>
        <div className="text-xs font-semibold text-primary tracking-wider uppercase mb-1">{className}</div>
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

      {/* Attendance table */}
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
                    <Select
                      value={row.status}
                      onValueChange={(v) => updateRow(idx, 'status', v)}
                    >
                      <SelectTrigger className={cn('h-8 text-xs border', statusColors[row.status])}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUSES.map((s) => (
                          <SelectItem key={s} value={s} className="text-xs">
                            {s}
                          </SelectItem>
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

// ──────────────────────────────────────────────
// Level 2 — Session list for a class
// ──────────────────────────────────────────────
interface ClassSessionsProps {
  className: string;
  onBack: () => void;
  onSelectSession: (date: string, label: string) => void;
}

const ClassSessions = ({ className, onBack, onSelectSession }: ClassSessionsProps) => {
  useAttendanceStore();

  const sessions = getSessionsForClass(className);

  return (
    <div className="space-y-4 max-w-3xl">
      <Button variant="ghost" onClick={onBack} className="gap-2 -ml-2">
        <ArrowLeft className="h-4 w-4" /> Quay lại danh sách lớp
      </Button>

      <div>
        <h2 className="font-display text-xl font-bold">{className}</h2>
        <p className="text-sm text-muted-foreground mt-1">Chọn buổi học để điểm danh</p>
      </div>

      {sessions.length === 0 && (
        <Card className="border-border/60">
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            Chưa có buổi học nào được ghi nhận cho lớp này.
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        {sessions.map((s) => {
          const done = attendanceStore.isSessionDone(s.className, s.sessionDate);
          const entries = done ? attendanceStore.getBySession(s.className, s.sessionDate) : [];
          const presentCount = entries.filter((e) => e.status === 'Có mặt' || e.status === 'Đi muộn').length;
          const totalCount = classRosters[className]?.length ?? 0;

          return (
            <button
              key={`${s.className}-${s.sessionDate}`}
              onClick={() => onSelectSession(s.sessionDate, s.sessionLabel)}
              className="w-full text-left rounded-xl border border-border bg-card p-4 hover:shadow-elegant hover:border-primary/30 transition-all flex items-center justify-between gap-3"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm truncate">{s.sessionLabel}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{s.sessionDate}</span>
                  {done && (
                    <>
                      <span>·</span>
                      <span className="text-success font-medium">Có mặt: {presentCount}/{totalCount}</span>
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
                {done ? <><CheckCircle2 className="h-3 w-3 mr-1" />Đã điểm danh</> : <><Circle className="h-3 w-3 mr-1" />Chưa điểm danh</>}
              </Badge>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────
// Level 1 — Class list
// ──────────────────────────────────────────────
interface ClassListProps {
  onSelectClass: (className: string) => void;
}

const ClassList = ({ onSelectClass }: ClassListProps) => {
  useAttendanceStore();

  const summaries = attendanceStore.getClassSummaries();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-xl font-bold">Điểm danh lớp học</h2>
        <p className="text-sm text-muted-foreground">Chọn lớp để điểm danh theo buổi học.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {summaries.map(({ className, totalSessions, doneSessions, roster }) => {
          const percent = totalSessions > 0 ? Math.round((doneSessions / totalSessions) * 100) : 0;

          return (
            <button
              key={className}
              onClick={() => onSelectClass(className)}
              className="text-left rounded-xl border border-border bg-card p-5 hover:shadow-elegant hover:border-primary/30 hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="h-10 w-10 rounded-lg gradient-card flex items-center justify-center">
                  <ClipboardList className="h-5 w-5 text-primary" />
                </div>
                <Badge variant="outline" className={doneSessions === totalSessions && totalSessions > 0 ? 'bg-success/10 text-success border-success/20' : 'bg-info/10 text-info border-info/20'}>
                  {doneSessions}/{totalSessions} buổi
                </Badge>
              </div>

              <h3 className="font-semibold mb-1 text-sm leading-snug">{className}</h3>

              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                <Users className="h-3 w-3" />
                <span>{roster.length} học viên</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-muted rounded-full h-1.5">
                <div
                  className="bg-primary rounded-full h-1.5 transition-all"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <div className="text-xs text-muted-foreground mt-1">{percent}% buổi đã điểm danh</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────
// Root component
// ──────────────────────────────────────────────
type Screen =
  | { view: 'classes' }
  | { view: 'sessions'; className: string }
  | { view: 'form'; className: string; sessionDate: string; sessionLabel: string };

const CoordinatorAttendance = () => {
  const [screen, setScreen] = useState<Screen>({ view: 'classes' });

  if (screen.view === 'form') {
    return (
      <SessionAttendanceForm
        className={screen.className}
        sessionDate={screen.sessionDate}
        sessionLabel={screen.sessionLabel}
        onBack={() => setScreen({ view: 'sessions', className: screen.className })}
      />
    );
  }

  if (screen.view === 'sessions') {
    return (
      <ClassSessions
        className={screen.className}
        onBack={() => setScreen({ view: 'classes' })}
        onSelectSession={(date, label) => setScreen({ view: 'form', className: screen.className, sessionDate: date, sessionLabel: label })}
      />
    );
  }

  return (
    <ClassList
      onSelectClass={(className) => setScreen({ view: 'sessions', className })}
    />
  );
};

export default CoordinatorAttendance;
