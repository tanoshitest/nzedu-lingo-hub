import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle2, AlertTriangle, Send, Save, FileText } from 'lucide-react';
import {
  reportStore,
  useClassReports,
  classRosters,
  reportStatusColors,
  reportStatusLabels,
  type ClassReport,
  type StudentEvaluation,
  type EvaluationAttendance,
} from '@/data/mockClassReports';

interface Props {
  courseCode: string;
  className: string;
  sessionOrder: number;
  sessionTitle: string;
  sessionDate?: string;
  teacherName: string;
}

const buildDraft = (p: Props): ClassReport => {
  const roster = classRosters[p.className] ?? [];
  return {
    id: `CR-${p.courseCode}-${p.className.replace(/[^A-Za-z0-9]/g, '')}-${String(p.sessionOrder).padStart(2, '0')}`,
    courseCode: p.courseCode,
    className: p.className,
    sessionOrder: p.sessionOrder,
    sessionTitle: p.sessionTitle,
    sessionDate: p.sessionDate ?? new Date().toLocaleDateString('vi-VN'),
    teacherName: p.teacherName,
    generalComment: '',
    homeworkAssigned: '',
    evaluations: roster.map((r) => ({
      studentId: r.studentId,
      studentName: r.studentName,
      attendance: 'Có mặt' as EvaluationAttendance,
      score: undefined,
      comment: '',
    })),
    status: 'Draft',
    createdAt: new Date().toLocaleDateString('vi-VN'),
  };
};

const SessionReportForm = (props: Props) => {
  useClassReports(); // subscribe để rerender khi store đổi
  const existing = reportStore.findBySession(props.courseCode, props.className, props.sessionOrder);

  const [report, setReport] = useState<ClassReport>(() => existing ?? buildDraft(props));

  // Khi đổi buổi → nạp lại
  useEffect(() => {
    setReport(existing ?? buildDraft(props));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.courseCode, props.className, props.sessionOrder]);

  const readOnly = report.status === 'Approved';

  const updateField = <K extends keyof ClassReport>(k: K, v: ClassReport[K]) =>
    setReport((r) => ({ ...r, [k]: v }));

  const updateEval = (studentId: string, patch: Partial<StudentEvaluation>) =>
    setReport((r) => ({
      ...r,
      evaluations: r.evaluations.map((e) => (e.studentId === studentId ? { ...e, ...patch } : e)),
    }));

  const handleSaveDraft = () => {
    reportStore.upsert({ ...report, status: 'Draft' });
    toast.success('Đã lưu nháp báo cáo');
  };

  const handleSubmit = () => {
    if (!report.generalComment.trim() || !report.homeworkAssigned.trim()) {
      toast.error('Vui lòng nhập nhận xét chung và bài tập về nhà');
      return;
    }
    reportStore.upsert({
      ...report,
      status: 'Submitted',
      submittedAt: new Date().toLocaleDateString('vi-VN'),
    });
    toast.success('Đã nộp báo cáo cho Giáo vụ duyệt');
  };

  const stats = useMemo(() => {
    const present = report.evaluations.filter((e) => e.attendance === 'Có mặt' || e.attendance === 'Đi muộn').length;
    const total = report.evaluations.length || 1;
    const avg = report.evaluations.filter((e) => e.score !== undefined).reduce((s, e) => s + (e.score ?? 0), 0)
      / Math.max(1, report.evaluations.filter((e) => e.score !== undefined).length);
    return { present, total, avg: isNaN(avg) ? 0 : avg };
  }, [report.evaluations]);

  return (
    <div className="space-y-4">
      {/* Header status */}
      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between flex-wrap gap-2">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Báo cáo Buổi {report.sessionOrder}: {report.sessionTitle}
              </CardTitle>
              <div className="text-xs text-muted-foreground mt-1">
                {report.sessionDate} • Lớp {report.className} • GV. {report.teacherName}
              </div>
            </div>
            <Badge variant="outline" className={reportStatusColors[report.status]}>
              {reportStatusLabels[report.status]}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-3 pt-0">
          <div className="p-3 rounded-md bg-muted/30">
            <div className="text-xs text-muted-foreground">Có mặt</div>
            <div className="text-lg font-bold">{stats.present}/{stats.total}</div>
          </div>
          <div className="p-3 rounded-md bg-muted/30">
            <div className="text-xs text-muted-foreground">Điểm TB buổi</div>
            <div className="text-lg font-bold">{stats.avg.toFixed(1)}</div>
          </div>
          <div className="p-3 rounded-md bg-muted/30">
            <div className="text-xs text-muted-foreground">Sĩ số</div>
            <div className="text-lg font-bold">{stats.total}</div>
          </div>
        </CardContent>
      </Card>

      {/* Banner Approved */}
      {report.status === 'Approved' && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-success/10 border border-success/20">
          <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <div className="font-medium text-success">Báo cáo đã được duyệt bởi {report.approvedBy} • {report.approvedAt}</div>
            {report.coordinatorNote && <div className="text-xs text-muted-foreground mt-1">Ghi chú Giáo vụ: {report.coordinatorNote}</div>}
          </div>
        </div>
      )}

      {/* Banner Returned */}
      {report.status === 'Returned' && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
          <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <div className="font-medium text-destructive">Báo cáo bị Giáo vụ trả lại — vui lòng chỉnh sửa và nộp lại</div>
            {report.coordinatorNote && <div className="text-xs text-foreground mt-1 italic">"{report.coordinatorNote}"</div>}
          </div>
        </div>
      )}

      {/* Banner Submitted */}
      {report.status === 'Submitted' && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-warning/10 border border-warning/20">
          <FileText className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <div className="font-medium text-warning">Báo cáo đang chờ Giáo vụ duyệt</div>
            <div className="text-xs text-muted-foreground mt-0.5">Nộp ngày: {report.submittedAt}</div>
          </div>
        </div>
      )}

      {/* General comment */}
      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Nhận xét chung về buổi học</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            rows={4}
            value={report.generalComment}
            onChange={(e) => updateField('generalComment', e.target.value)}
            placeholder="Mô tả tình hình lớp, mức độ tham gia, nội dung đã dạy, các khó khăn gặp phải..."
            disabled={readOnly}
          />
        </CardContent>
      </Card>

      {/* Homework */}
      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Bài tập về nhà</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            rows={3}
            value={report.homeworkAssigned}
            onChange={(e) => updateField('homeworkAssigned', e.target.value)}
            placeholder="Liệt kê bài tập + nguồn tài liệu HV cần hoàn thành..."
            disabled={readOnly}
          />
        </CardContent>
      </Card>

      {/* Student evaluations */}
      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Đánh giá học viên</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[160px]">Học viên</TableHead>
                <TableHead className="w-[160px]">Điểm danh</TableHead>
                <TableHead className="w-[100px]">Điểm</TableHead>
                <TableHead className="min-w-[240px]">Nhận xét</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {report.evaluations.map((e) => (
                <TableRow key={e.studentId}>
                  <TableCell className="font-medium text-sm">{e.studentName}</TableCell>
                  <TableCell>
                    <Select
                      value={e.attendance}
                      onValueChange={(v) => updateEval(e.studentId, { attendance: v as EvaluationAttendance })}
                      disabled={readOnly}
                    >
                      <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Có mặt">Có mặt</SelectItem>
                        <SelectItem value="Đi muộn">Đi muộn</SelectItem>
                        <SelectItem value="Vắng có phép">Vắng có phép</SelectItem>
                        <SelectItem value="Vắng">Vắng</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min={0}
                      max={10}
                      step={0.5}
                      className="h-9"
                      value={e.score ?? ''}
                      onChange={(ev) => updateEval(e.studentId, { score: ev.target.value === '' ? undefined : Number(ev.target.value) })}
                      placeholder="0-10"
                      disabled={readOnly || e.attendance === 'Vắng'}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      className="h-9"
                      value={e.comment ?? ''}
                      onChange={(ev) => updateEval(e.studentId, { comment: ev.target.value })}
                      placeholder="Nhận xét..."
                      disabled={readOnly}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Footer actions */}
      {!readOnly && (
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleSaveDraft} className="gap-2">
            <Save className="h-4 w-4" /> Lưu nháp
          </Button>
          <Button onClick={handleSubmit} className="gradient-hero gap-2 shadow-elegant">
            <Send className="h-4 w-4" /> Nộp cho Giáo vụ duyệt
          </Button>
        </div>
      )}
    </div>
  );
};

export default SessionReportForm;
