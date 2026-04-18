import { useState, useMemo } from 'react';
import { ArrowLeft, FileText, CircleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import SubmissionStatusBadge from '../grading/SubmissionStatusBadge';
import { submissions as mockSubmissions, type Submission } from '@/data/mockGrading';

const TEACHER_ID = 'U003';

const TeacherGrading = () => {
  const [subs, setSubs] = useState<Submission[]>(mockSubmissions);
  const [selected, setSelected] = useState<Submission | null>(null);
  const [score, setScore] = useState('');
  const [feedback, setFeedback] = useState('');

  const myAssigned = useMemo(
    () => subs.filter((s) => s.assignedTeacherId === TEACHER_ID && ['Assigned', 'Grading', 'Returned'].includes(s.status)),
    [subs]
  );
  const myDone = useMemo(
    () => subs.filter((s) => s.assignedTeacherId === TEACHER_ID && ['PendingApproval', 'Approved'].includes(s.status)),
    [subs]
  );

  const openGrade = (s: Submission) => {
    setSelected(s);
    setScore(s.score?.toString() ?? '');
    setFeedback(s.feedback ?? '');
    if (s.status === 'Assigned') {
      setSubs((prev) => prev.map((x) => x.id === s.id ? { ...x, status: 'Grading' } : x));
    }
  };

  const handleSubmit = () => {
    if (!selected) return;
    const num = parseFloat(score);
    if (isNaN(num) || num < 0 || num > 10) {
      toast.error('Điểm phải từ 0 đến 10');
      return;
    }
    if (!feedback.trim()) {
      toast.error('Vui lòng nhập lời phê');
      return;
    }
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    setSubs(subs.map((s) => s.id === selected.id ? { ...s, status: 'PendingApproval', score: num, feedback, gradedAt: `${dd}/${mm}/${now.getFullYear()}` } : s));
    toast.success('Đã gửi kết quả — chờ Giáo vụ duyệt');
    setSelected(null);
    setScore('');
    setFeedback('');
  };

  if (selected) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => setSelected(null)} className="gap-2"><ArrowLeft className="h-4 w-4" /> Danh sách</Button>
        <Card className="border-border/60">
          <CardHeader>
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <CardTitle>{selected.lessonTitle}</CardTitle>
                <div className="text-sm text-muted-foreground mt-1">{selected.studentName} — {selected.className}</div>
              </div>
              <SubmissionStatusBadge status={selected.status} />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {selected.status === 'Returned' && selected.approvalNote && (
              <Card className="border-destructive/30 bg-destructive/5">
                <CardContent className="p-3 flex items-start gap-2">
                  <CircleAlert className="h-4 w-4 text-destructive mt-0.5" />
                  <div className="text-sm">
                    <div className="font-semibold text-destructive">Giáo vụ trả lại</div>
                    <div className="text-muted-foreground mt-1">{selected.approvalNote}</div>
                  </div>
                </CardContent>
              </Card>
            )}
            <div className="flex items-center gap-3 p-3 rounded-lg border border-border/60 bg-muted/30">
              <FileText className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <div className="font-medium text-sm">{selected.fileName}</div>
                <div className="text-xs text-muted-foreground">{selected.fileSize} • Hạn chấm: {selected.gradingDeadline}</div>
              </div>
              <Button variant="outline" size="sm">Xem file</Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Điểm (0-10)</Label>
                <Input type="number" min={0} max={10} step={0.1} value={score} onChange={(e) => setScore(e.target.value)} placeholder="8.5" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Lời phê</Label>
              <Textarea rows={5} value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Nhận xét chi tiết về bài làm..." />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelected(null)}>Hủy</Button>
              <Button onClick={handleSubmit} className="gradient-hero">Gửi kết quả</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderTable = (list: Submission[], emptyText: string, showAction: boolean) => (
    <Card className="border-border/60 mt-4">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Học viên</TableHead>
              <TableHead>Bài tập</TableHead>
              <TableHead className="hidden md:table-cell">Hạn chấm</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">{showAction ? 'Hành động' : 'Điểm'}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.map((s) => (
              <TableRow key={s.id}>
                <TableCell>
                  <div className="font-medium">{s.studentName}</div>
                  <div className="text-xs text-muted-foreground">{s.className}</div>
                </TableCell>
                <TableCell className="text-sm">{s.lessonTitle}</TableCell>
                <TableCell className="hidden md:table-cell text-sm">{s.gradingDeadline}</TableCell>
                <TableCell><SubmissionStatusBadge status={s.status} /></TableCell>
                <TableCell className="text-right">
                  {showAction
                    ? <Button size="sm" onClick={() => openGrade(s)}>{s.status === 'Returned' ? 'Sửa lại' : 'Chấm bài'}</Button>
                    : <span className="font-semibold">{s.score?.toFixed(1)}</span>}
                </TableCell>
              </TableRow>
            ))}
            {list.length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-12 text-muted-foreground">{emptyText}</TableCell></TableRow>}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Tabs defaultValue="todo">
        <TabsList>
          <TabsTrigger value="todo">Cần chấm ({myAssigned.length})</TabsTrigger>
          <TabsTrigger value="done">Đã chấm ({myDone.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="todo">{renderTable(myAssigned, 'Hiện không có bài nào cần chấm', true)}</TabsContent>
        <TabsContent value="done">{renderTable(myDone, 'Bạn chưa chấm bài nào', false)}</TabsContent>
      </Tabs>
    </div>
  );
};

export default TeacherGrading;
