import { useState } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, Calendar, Clock, User, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import {
  reportStore,
  useClassReports,
  reportStatusColors,
  reportStatusLabels,
  type ClassReport,
  type ReportStatus,
} from '@/data/mockClassReports';

const attendanceColors: Record<string, string> = {
  'Có mặt': 'bg-success/10 text-success border-success/20',
  'Vắng': 'bg-destructive/10 text-destructive border-destructive/20',
  'Vắng có phép': 'bg-warning/10 text-warning border-warning/20',
  'Đi muộn': 'bg-info/10 text-info border-info/20',
};

const ReportCard = ({ r, onClick }: { r: ClassReport; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="w-full text-left rounded-xl border border-border bg-card p-5 hover:shadow-elegant hover:border-primary/30 transition-all"
  >
    <div className="flex items-center justify-between flex-wrap gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="outline" className="text-[10px]">Buổi {r.sessionOrder}</Badge>
          <h3 className="font-semibold truncate">{r.sessionTitle}</h3>
        </div>
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{r.sessionDate}</span>
          {r.sessionTime && <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{r.sessionTime}</span>}
          <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" />GV. {r.teacherName}</span>
          <span>Lớp: {r.className}</span>
        </div>
      </div>
      <Badge variant="outline" className={reportStatusColors[r.status]}>{reportStatusLabels[r.status]}</Badge>
    </div>
  </button>
);

const CoordinatorReports = () => {
  const reports = useClassReports();
  const [selected, setSelected] = useState<ClassReport | null>(null);
  const [coordNote, setCoordNote] = useState('');

  const pending = reports.filter((r) => r.status === 'Submitted');
  const approved = reports.filter((r) => r.status === 'Approved');
  const returned = reports.filter((r) => r.status === 'Returned');

  const openReport = (r: ClassReport) => {
    setSelected(r);
    setCoordNote(r.coordinatorNote ?? '');
  };

  const handleApprove = () => {
    if (!selected) return;
    reportStore.approve(selected.id, coordNote.trim() || undefined, 'Trần Thị Bình');
    toast.success(`Đã phê duyệt báo cáo: ${selected.sessionTitle}`);
    setSelected(null);
    setCoordNote('');
  };

  const handleReturn = () => {
    if (!selected) return;
    if (!coordNote.trim()) {
      toast.error('Vui lòng nhập ghi chú khi trả lại báo cáo');
      return;
    }
    reportStore.returnBack(selected.id, coordNote.trim());
    toast.success(`Đã trả lại báo cáo: ${selected.sessionTitle}`);
    setSelected(null);
    setCoordNote('');
  };

  // ====== Detail view ======
  if (selected) {
    const r = selected;
    const present = r.evaluations.filter((e) => e.attendance === 'Có mặt' || e.attendance === 'Đi muộn').length;
    const scored = r.evaluations.filter((e) => e.score !== undefined);
    const avg = scored.length ? scored.reduce((s, e) => s + (e.score ?? 0), 0) / scored.length : 0;
    const readOnly = r.status === 'Approved';

    return (
      <div className="space-y-4 max-w-5xl">
        <Button variant="ghost" onClick={() => setSelected(null)} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Quay lại danh sách
        </Button>

        <Card className="border-border/60">
          <CardHeader>
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-[10px]">Buổi {r.sessionOrder}</Badge>
                  <CardTitle className="font-display text-xl">{r.sessionTitle}</CardTitle>
                </div>
                <div className="flex flex-wrap gap-3 mt-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{r.sessionDate}</span>
                  {r.sessionTime && <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{r.sessionTime}</span>}
                  <span className="flex items-center gap-1.5"><User className="h-4 w-4" />GV. {r.teacherName}</span>
                  <span>Lớp: {r.className}</span>
                </div>
              </div>
              <Badge variant="outline" className={reportStatusColors[r.status]}>{reportStatusLabels[r.status]}</Badge>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-md bg-muted/30">
              <div className="text-xs text-muted-foreground">Có mặt</div>
              <div className="text-lg font-bold">{present}/{r.evaluations.length}</div>
            </div>
            <div className="p-3 rounded-md bg-muted/30">
              <div className="text-xs text-muted-foreground">Điểm TB buổi</div>
              <div className="text-lg font-bold">{avg.toFixed(1)}</div>
            </div>
            <div className="p-3 rounded-md bg-muted/30">
              <div className="text-xs text-muted-foreground">Nộp ngày</div>
              <div className="text-lg font-bold">{r.submittedAt ?? '—'}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="pb-2"><CardTitle className="text-sm uppercase text-muted-foreground tracking-wider">Nhận xét chung của GV</CardTitle></CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm whitespace-pre-wrap">{r.generalComment}</div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="pb-2"><CardTitle className="text-sm uppercase text-muted-foreground tracking-wider">Bài tập về nhà</CardTitle></CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm whitespace-pre-wrap">{r.homeworkAssigned}</div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="pb-2"><CardTitle className="text-sm uppercase text-muted-foreground tracking-wider">Đánh giá học viên</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Học viên</TableHead>
                  <TableHead>Điểm danh</TableHead>
                  <TableHead>Điểm</TableHead>
                  <TableHead>Nhận xét</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {r.evaluations.map((e) => (
                  <TableRow key={e.studentId}>
                    <TableCell className="font-medium text-sm">{e.studentName}</TableCell>
                    <TableCell><Badge variant="outline" className={attendanceColors[e.attendance]}>{e.attendance}</Badge></TableCell>
                    <TableCell className="text-sm font-semibold">{e.score ?? '—'}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{e.comment || '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Coordinator action area */}
        <Card className="border-border/60">
          <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><FileText className="h-4 w-4" /> Ghi chú của Giáo vụ</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              value={coordNote}
              onChange={(e) => setCoordNote(e.target.value)}
              rows={4}
              placeholder={readOnly ? 'Ghi chú khi duyệt báo cáo...' : 'Nhập ghi chú (bắt buộc khi trả lại; tuỳ chọn khi duyệt)...'}
              disabled={readOnly}
            />
            {readOnly && (
              <div className="text-xs text-muted-foreground">Báo cáo này đã được duyệt bởi {r.approvedBy} ngày {r.approvedAt}.</div>
            )}
            {!readOnly && (
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleReturn} className="gap-2 text-destructive hover:text-destructive">
                  <XCircle className="h-4 w-4" /> Trả lại
                </Button>
                <Button onClick={handleApprove} className="gradient-hero gap-2 shadow-elegant">
                  <CheckCircle2 className="h-4 w-4" /> Phê duyệt
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // ====== List view (3 tabs) ======
  const renderList = (list: ClassReport[], emptyText: string) => (
    <div className="space-y-3">
      {list.length === 0 && <div className="text-center py-12 text-sm text-muted-foreground">{emptyText}</div>}
      {list.map((r) => <ReportCard key={r.id} r={r} onClick={() => openReport(r)} />)}
    </div>
  );

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-xl font-bold">Duyệt báo cáo lớp học</h2>
        <p className="text-sm text-muted-foreground">Xem xét, phê duyệt hoặc trả lại báo cáo do Giáo viên nộp.</p>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList>
          <TabsTrigger value="pending">Chờ duyệt ({pending.length})</TabsTrigger>
          <TabsTrigger value="approved">Đã duyệt ({approved.length})</TabsTrigger>
          <TabsTrigger value="returned">Đã trả lại ({returned.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="pending" className="mt-4">{renderList(pending, 'Không có báo cáo nào chờ duyệt 🎉')}</TabsContent>
        <TabsContent value="approved" className="mt-4">{renderList(approved, 'Chưa có báo cáo nào được duyệt.')}</TabsContent>
        <TabsContent value="returned" className="mt-4">{renderList(returned, 'Không có báo cáo bị trả lại.')}</TabsContent>
      </Tabs>
    </div>
  );
};

export default CoordinatorReports;
