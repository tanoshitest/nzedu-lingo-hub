import { useState, useMemo } from 'react';
import { ArrowLeft, FileText, UserCheck, ThumbsUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import SubmissionStatusBadge from '../grading/SubmissionStatusBadge';
import { submissions as mockSubmissions, type Submission } from '@/data/mockGrading';
import { users } from '@/data/mockData';

const teachers = users.filter((u) => u.role === 'Giáo viên');

const CoordinatorGrading = () => {
  const [subs, setSubs] = useState<Submission[]>(mockSubmissions);
  const [assignFor, setAssignFor] = useState<Submission | null>(null);
  const [reviewFor, setReviewFor] = useState<Submission | null>(null);
  const [assignTeacher, setAssignTeacher] = useState('');
  const [assignDeadline, setAssignDeadline] = useState('');
  const [approvalNote, setApprovalNote] = useState('');

  const inbox = useMemo(() => subs.filter((s) => s.status === 'Submitted'), [subs]);
  const inProgress = useMemo(() => subs.filter((s) => ['Assigned', 'Grading'].includes(s.status)), [subs]);
  const pending = useMemo(() => subs.filter((s) => s.status === 'PendingApproval'), [subs]);
  const archive = useMemo(() => subs.filter((s) => ['Approved', 'Returned'].includes(s.status)), [subs]);

  const teacherName = (id?: string) => users.find((u) => u.id === id)?.name ?? '—';

  const handleAssign = () => {
    if (!assignFor || !assignTeacher || !assignDeadline) {
      toast.error('Vui lòng chọn giáo viên và đặt hạn chót');
      return;
    }
    setSubs(subs.map((s) => s.id === assignFor.id ? { ...s, status: 'Assigned', assignedTeacherId: assignTeacher, gradingDeadline: assignDeadline } : s));
    toast.success(`Đã giao bài cho ${teacherName(assignTeacher)} — hạn ${assignDeadline}`);
    setAssignFor(null);
    setAssignTeacher('');
    setAssignDeadline('');
  };

  const handleApprove = () => {
    if (!reviewFor) return;
    setSubs(subs.map((s) => s.id === reviewFor.id ? { ...s, status: 'Approved', approvalNote: approvalNote || 'Đã duyệt' } : s));
    toast.success('Đã duyệt kết quả chấm — học viên sẽ thấy điểm');
    setReviewFor(null);
    setApprovalNote('');
  };

  const handleReturn = () => {
    if (!reviewFor) return;
    if (!approvalNote) {
      toast.error('Vui lòng ghi lý do trả lại để giáo viên chỉnh sửa');
      return;
    }
    setSubs(subs.map((s) => s.id === reviewFor.id ? { ...s, status: 'Returned', approvalNote } : s));
    toast.success('Đã trả lại bài cho giáo viên');
    setReviewFor(null);
    setApprovalNote('');
  };

  const renderRow = (s: Submission) => (
    <TableRow key={s.id}>
      <TableCell>
        <div className="font-medium">{s.studentName}</div>
        <div className="text-xs text-muted-foreground">{s.className}</div>
      </TableCell>
      <TableCell>
        <div className="text-sm">{s.lessonTitle}</div>
        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><FileText className="h-3 w-3" /> {s.fileName}</div>
      </TableCell>
      <TableCell className="hidden md:table-cell text-sm">{s.submittedAt}</TableCell>
      <TableCell className="hidden lg:table-cell text-sm">{teacherName(s.assignedTeacherId)}</TableCell>
      <TableCell><SubmissionStatusBadge status={s.status} /></TableCell>
      <TableCell className="text-right">
        {s.status === 'Submitted' && (
          <Button size="sm" className="gap-1" onClick={() => setAssignFor(s)}>
            <UserCheck className="h-3.5 w-3.5" /> Giao GV chấm
          </Button>
        )}
        {s.status === 'PendingApproval' && (
          <Button size="sm" className="gap-1" onClick={() => setReviewFor(s)}>
            Duyệt
          </Button>
        )}
        {(s.status === 'Approved' || s.status === 'Returned') && s.score != null && (
          <span className="text-sm font-semibold">{s.score.toFixed(1)}</span>
        )}
        {(s.status === 'Assigned' || s.status === 'Grading') && (
          <span className="text-xs text-muted-foreground">Hạn: {s.gradingDeadline}</span>
        )}
      </TableCell>
    </TableRow>
  );

  const renderTable = (list: Submission[], emptyText: string) => (
    <Card className="border-border/60 mt-4">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Học viên</TableHead>
              <TableHead>Bài tập</TableHead>
              <TableHead className="hidden md:table-cell">Nộp lúc</TableHead>
              <TableHead className="hidden lg:table-cell">GV chấm</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.map(renderRow)}
            {list.length === 0 && (
              <TableRow><TableCell colSpan={6} className="text-center py-12 text-muted-foreground">{emptyText}</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Mới nộp', value: inbox.length, color: 'text-info' },
          { label: 'Đang chấm', value: inProgress.length, color: 'text-warning' },
          { label: 'Chờ duyệt', value: pending.length, color: 'text-warning' },
          { label: 'Đã hoàn tất', value: archive.length, color: 'text-success' },
        ].map((s) => (
          <Card key={s.label} className="border-border/60"><CardContent className="p-4">
            <div className="text-xs text-muted-foreground">{s.label}</div>
            <div className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</div>
          </CardContent></Card>
        ))}
      </div>

      <Tabs defaultValue="inbox">
        <TabsList>
          <TabsTrigger value="inbox">Mới nộp ({inbox.length})</TabsTrigger>
          <TabsTrigger value="progress">Đang chấm ({inProgress.length})</TabsTrigger>
          <TabsTrigger value="pending">Chờ duyệt ({pending.length})</TabsTrigger>
          <TabsTrigger value="archive">Đã hoàn tất</TabsTrigger>
        </TabsList>
        <TabsContent value="inbox">{renderTable(inbox, 'Hiện không có bài nào chờ phân công')}</TabsContent>
        <TabsContent value="progress">{renderTable(inProgress, 'Không có bài đang chấm')}</TabsContent>
        <TabsContent value="pending">{renderTable(pending, 'Không có bài chờ duyệt')}</TabsContent>
        <TabsContent value="archive">{renderTable(archive, 'Chưa có bài hoàn tất')}</TabsContent>
      </Tabs>

      {/* Assign dialog */}
      <Dialog open={!!assignFor} onOpenChange={(o) => !o && setAssignFor(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Giao giáo viên chấm</DialogTitle>
            <DialogDescription>{assignFor?.studentName} — {assignFor?.lessonTitle}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Chọn giáo viên</Label>
              <Select value={assignTeacher} onValueChange={setAssignTeacher}>
                <SelectTrigger><SelectValue placeholder="Chọn giáo viên..." /></SelectTrigger>
                <SelectContent>
                  {teachers.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Hạn chấm bài</Label>
              <Input placeholder="dd/mm/yyyy" value={assignDeadline} onChange={(e) => setAssignDeadline(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignFor(null)}>Hủy</Button>
            <Button onClick={handleAssign} className="gradient-hero">Phân công</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve / Return dialog */}
      <Dialog open={!!reviewFor} onOpenChange={(o) => !o && setReviewFor(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Duyệt kết quả chấm</DialogTitle>
            <DialogDescription>{reviewFor?.studentName} — {reviewFor?.lessonTitle}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Điểm GV chấm</Label>
                <div className="text-3xl font-bold text-primary">{reviewFor?.score?.toFixed(1)}</div>
              </div>
              <div className="space-y-1">
                <Label>GV chấm</Label>
                <div className="text-sm pt-2">{teacherName(reviewFor?.assignedTeacherId)}</div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Lời phê của GV</Label>
              <div className="text-sm p-3 rounded-md border border-border/60 bg-muted/30">{reviewFor?.feedback}</div>
            </div>
            <div className="space-y-2">
              <Label>Ghi chú duyệt (tùy chọn nếu duyệt, bắt buộc nếu trả lại)</Label>
              <Textarea rows={3} value={approvalNote} onChange={(e) => setApprovalNote(e.target.value)} placeholder="Ví dụ: Đề nghị GV viết feedback chi tiết hơn..." />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" onClick={handleReturn} className="gap-1"><RotateCcw className="h-4 w-4" /> Trả lại</Button>
            <Button onClick={handleApprove} className="gradient-hero gap-1"><ThumbsUp className="h-4 w-4" /> Duyệt</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CoordinatorGrading;
