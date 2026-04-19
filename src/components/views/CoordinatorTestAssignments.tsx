import { useMemo, useState } from 'react';
import { Plus, ClipboardList, ThumbsUp, RotateCcw, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import AssignTestDialog from '../assignments/AssignTestDialog';
import {
  attemptStore,
  assignmentStatusColors,
  attemptStatusColors,
  attemptStatusLabels,
  useAssignments,
  useAttempts,
  type TestAttempt,
} from '@/data/mockTestAttempts';

const CoordinatorTestAssignments = () => {
  const assignments = useAssignments();
  const attempts = useAttempts();
  const [assignOpen, setAssignOpen] = useState(false);
  const [reviewing, setReviewing] = useState<TestAttempt | null>(null);
  const [note, setNote] = useState('');

  const pendingApproval = useMemo(() => attempts.filter((a) => a.status === 'PendingApproval'), [attempts]);

  const countByStatus = (assignmentId: string) => {
    const list = attempts.filter((a) => a.assignmentId === assignmentId);
    const submitted = list.filter((a) => ['Submitted', 'Grading', 'PendingApproval', 'Approved'].includes(a.status)).length;
    return { total: list.length, submitted };
  };

  const approve = () => {
    if (!reviewing) return;
    const overall = avgBand(reviewing);
    attemptStore.upsertAttempt({ ...reviewing, status: 'Approved', coordinatorApprovalNote: note || 'Đã duyệt', overallBand: overall });
    toast.success('Đã duyệt — học viên có thể xem kết quả.');
    setReviewing(null); setNote('');
  };

  const returnBack = () => {
    if (!reviewing) return;
    if (!note) { toast.error('Vui lòng ghi lý do trả lại'); return; }
    attemptStore.upsertAttempt({ ...reviewing, status: 'Grading', coordinatorApprovalNote: note });
    toast.success('Đã trả bài về cho giáo viên chỉnh sửa.');
    setReviewing(null); setNote('');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <p className="text-sm text-muted-foreground">Giao đề thi cho lớp / học viên và duyệt kết quả chấm.</p>
        </div>
        <Button onClick={() => setAssignOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Giao đề mới
        </Button>
      </div>

      <Tabs defaultValue="assignments">
        <TabsList>
          <TabsTrigger value="assignments" className="gap-2">
            <ClipboardList className="h-4 w-4" /> Đề đã giao ({assignments.length})
          </TabsTrigger>
          <TabsTrigger value="approve" className="gap-2">
            <ThumbsUp className="h-4 w-4" /> Chờ duyệt ({pendingApproval.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assignments" className="mt-4">
          <Card className="border-border/60">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã</TableHead>
                    <TableHead>Đề thi</TableHead>
                    <TableHead>Đối tượng</TableHead>
                    <TableHead>Mở</TableHead>
                    <TableHead>Hạn</TableHead>
                    <TableHead>Tiến độ</TableHead>
                    <TableHead>Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignments.map((a) => {
                    const c = countByStatus(a.id);
                    return (
                      <TableRow key={a.id}>
                        <TableCell className="font-mono text-xs">{a.id}</TableCell>
                        <TableCell>
                          <div className="font-medium">{a.testCode}</div>
                          <div className="text-xs text-muted-foreground">{a.testTitle}</div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {a.className ?? `${a.studentIds.length} HV`}
                          <div className="text-xs text-muted-foreground">Giao: {a.assignedBy}</div>
                        </TableCell>
                        <TableCell className="text-xs">{a.openAt}</TableCell>
                        <TableCell className="text-xs">{a.dueAt}</TableCell>
                        <TableCell className="text-sm">{c.submitted}/{c.total}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={assignmentStatusColors[a.status]}>{a.status}</Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {assignments.length === 0 && (
                    <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">Chưa có đề nào được giao.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approve" className="mt-4">
          <Card className="border-border/60">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>HV</TableHead>
                    <TableHead>Đề thi</TableHead>
                    <TableHead>L</TableHead>
                    <TableHead>R</TableHead>
                    <TableHead>W</TableHead>
                    <TableHead>S</TableHead>
                    <TableHead>Overall</TableHead>
                    <TableHead>GV chấm</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingApproval.map((at) => (
                    <TableRow key={at.id}>
                      <TableCell className="font-medium">{at.studentName}</TableCell>
                      <TableCell className="text-sm">{at.testId}</TableCell>
                      <TableCell>{at.listeningBand ?? '—'}</TableCell>
                      <TableCell>{at.readingBand ?? '—'}</TableCell>
                      <TableCell>{at.writingBand ?? '—'}</TableCell>
                      <TableCell>{at.speakingBand ?? '—'}</TableCell>
                      <TableCell className="font-semibold text-primary">{avgBand(at)}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{at.gradedBy ?? '—'}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" onClick={() => { setReviewing(at); setNote(''); }} className="gap-1">
                          <Eye className="h-3.5 w-3.5" /> Xem
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {pendingApproval.length === 0 && (
                    <TableRow><TableCell colSpan={9} className="text-center text-muted-foreground py-8">Không có bài chờ duyệt.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AssignTestDialog open={assignOpen} onClose={() => setAssignOpen(false)} assignedBy="Trần Thị Bình" assignedByRole="Coordinator" />

      <Dialog open={!!reviewing} onOpenChange={(o) => !o && setReviewing(null)}>
        <DialogContent className="max-w-xl">
          {reviewing && (
            <>
              <DialogHeader>
                <DialogTitle>Duyệt kết quả — {reviewing.studentName}</DialogTitle>
                <DialogDescription>Bài thi: {reviewing.testId}</DialogDescription>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-4 gap-2">
                  <Stat label="Listening" v={reviewing.listeningBand} />
                  <Stat label="Reading" v={reviewing.readingBand} />
                  <Stat label="Writing" v={reviewing.writingBand} />
                  <Stat label="Speaking" v={reviewing.speakingBand} />
                </div>
                <div className="rounded-md border border-border bg-muted/30 p-3 text-center">
                  <div className="text-xs text-muted-foreground">Overall (dự kiến)</div>
                  <div className="font-display text-2xl font-bold text-primary">{avgBand(reviewing)}</div>
                </div>
                {reviewing.teacherFeedback && (
                  <div className="rounded-md border border-border p-3">
                    <Badge className="mb-1" variant="outline">Feedback giáo viên</Badge>
                    <div className="text-sm">{reviewing.teacherFeedback}</div>
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Ghi chú duyệt / lý do trả lại</Label>
                  <Textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="(tuỳ chọn khi duyệt, bắt buộc khi trả lại)" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={returnBack} className="gap-2"><RotateCcw className="h-4 w-4" /> Trả lại GV</Button>
                <Button onClick={approve} className="gap-2"><ThumbsUp className="h-4 w-4" /> Duyệt</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Stat = ({ label, v }: { label: string; v?: number }) => (
  <div className="rounded-md border border-border p-2 text-center">
    <div className="text-xs text-muted-foreground">{label}</div>
    <div className="font-bold">{v ?? '—'}</div>
  </div>
);

export const avgBand = (a: TestAttempt): number => {
  const xs = [a.listeningBand, a.readingBand, a.writingBand, a.speakingBand].filter((x): x is number => typeof x === 'number');
  if (xs.length === 0) return 0;
  const avg = xs.reduce((s, x) => s + x, 0) / xs.length;
  return Math.round(avg * 2) / 2;
};

export default CoordinatorTestAssignments;
