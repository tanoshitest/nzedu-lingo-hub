import { useState } from 'react';
import { Upload, Check, FileText, Clock, CircleCheck, Eye, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import SubmissionStatusBadge from '../grading/SubmissionStatusBadge';
import { lessonAssignments as mockAssignments, submissions as mockSubmissions, type Submission, type LessonAssignment } from '@/data/mockGrading';

const STUDENT_ID = 'U005';

const StudentSubmissions = () => {
  const [assignments, setAssignments] = useState<LessonAssignment[]>(mockAssignments);
  const [subs, setSubs] = useState<Submission[]>(mockSubmissions);
  const [uploadFor, setUploadFor] = useState<LessonAssignment | null>(null);
  const [fileName, setFileName] = useState('');
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [detail, setDetail] = useState<Submission | null>(null);

  const mySubs = subs.filter((s) => s.studentId === STUDENT_ID);

  const startUpload = () => {
    if (!fileName || !uploadFor) {
      toast.error('Vui lòng chọn file');
      return;
    }
    setUploading(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          finalize();
          return 100;
        }
        return p + 12;
      });
    }, 120);
  };

  const finalize = () => {
    if (!uploadFor) return;
    const newId = `SB${Math.floor(Math.random() * 9000 + 1000)}`;
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yy = now.getFullYear();
    const hh = String(now.getHours()).padStart(2, '0');
    const mi = String(now.getMinutes()).padStart(2, '0');
    const newSub: Submission = {
      id: newId,
      studentId: STUDENT_ID,
      studentName: 'Hoàng Minh Đức',
      lessonId: uploadFor.id,
      lessonTitle: uploadFor.title,
      className: uploadFor.className,
      fileName,
      fileSize: '1.0 MB',
      submittedAt: `${dd}/${mm}/${yy} ${hh}:${mi}`,
      status: 'Submitted',
    };
    setSubs([newSub, ...subs]);
    setAssignments(assignments.map((a) => a.id === uploadFor.id ? { ...a, submitted: true, submissionId: newId } : a));
    setTimeout(() => {
      setUploading(false);
      setUploadFor(null);
      setFileName('');
      setProgress(0);
      toast.success('Nộp bài thành công! Giáo vụ sẽ phân công giáo viên chấm.');
    }, 300);
  };

  if (detail) {
    const steps = [
      { label: 'Đã nộp', done: true, time: detail.submittedAt },
      { label: 'Đã phân công GV', done: ['Assigned', 'Grading', 'PendingApproval', 'Approved', 'Returned'].includes(detail.status), time: detail.assignedTeacherId ? 'GV đã được phân công' : '' },
      { label: 'Đang chấm', done: ['Grading', 'PendingApproval', 'Approved', 'Returned'].includes(detail.status), time: '' },
      { label: 'Chờ Giáo vụ duyệt', done: ['PendingApproval', 'Approved', 'Returned'].includes(detail.status), time: detail.gradedAt ?? '' },
      { label: 'Đã có điểm', done: detail.status === 'Approved', time: '' },
    ];
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => setDetail(null)} className="gap-2"><ArrowLeft className="h-4 w-4" /> Quay lại</Button>
        <Card className="border-border/60">
          <CardHeader>
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <CardTitle>{detail.lessonTitle}</CardTitle>
                <div className="text-sm text-muted-foreground mt-1">{detail.className}</div>
              </div>
              <SubmissionStatusBadge status={detail.status} />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-3 p-3 rounded-lg border border-border/60 bg-muted/30">
              <FileText className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <div className="font-medium text-sm">{detail.fileName}</div>
                <div className="text-xs text-muted-foreground">{detail.fileSize} • Nộp lúc {detail.submittedAt}</div>
              </div>
              <Button variant="outline" size="sm">Xem file</Button>
            </div>

            {/* Timeline */}
            <div>
              <div className="font-semibold mb-3">Trạng thái xử lý</div>
              <div className="space-y-3">
                {steps.map((s, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 ${s.done ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'}`}>
                      {s.done ? <Check className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
                    </div>
                    <div className="flex-1 pt-0.5">
                      <div className={`text-sm font-medium ${s.done ? '' : 'text-muted-foreground'}`}>{s.label}</div>
                      {s.time && <div className="text-xs text-muted-foreground">{s.time}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {detail.status === 'Approved' && (
              <Card className="border-success/30 bg-success/5">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-success">Kết quả chấm</div>
                    <div className="text-3xl font-bold text-success">{detail.score?.toFixed(1)}</div>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Lời phê: </span>
                    <span className="text-muted-foreground">{detail.feedback}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-border/60">
        <CardHeader><CardTitle>Bài tập cần nộp</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {assignments.map((a) => {
            const sub = a.submissionId ? subs.find((s) => s.id === a.submissionId) : null;
            return (
              <div key={a.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-lg border border-border/60 hover:bg-muted/30 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{a.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{a.className} • Hạn: {a.dueDate}</div>
                </div>
                {sub ? (
                  <div className="flex items-center gap-2">
                    <SubmissionStatusBadge status={sub.status} />
                    <Button variant="outline" size="sm" onClick={() => setDetail(sub)} className="gap-1">
                      <Eye className="h-3.5 w-3.5" /> Xem
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => setUploadFor(a)} className="gradient-hero gap-2">
                    <Upload className="h-4 w-4" /> Nộp bài
                  </Button>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader><CardTitle>Lịch sử bài đã nộp</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {mySubs.map((s) => (
            <div key={s.id} onClick={() => setDetail(s)} className="flex items-center gap-3 p-3 rounded-lg border border-border/60 hover:bg-muted/30 cursor-pointer">
              <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{s.lessonTitle}</div>
                <div className="text-xs text-muted-foreground">Nộp {s.submittedAt}</div>
              </div>
              {s.status === 'Approved' && (
                <Badge className="bg-success/10 text-success border-success/20 gap-1" variant="outline">
                  <CircleCheck className="h-3 w-3" /> {s.score?.toFixed(1)}
                </Badge>
              )}
              <SubmissionStatusBadge status={s.status} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Upload dialog */}
      <Dialog open={!!uploadFor} onOpenChange={(o) => !o && !uploading && setUploadFor(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nộp bài</DialogTitle>
            <DialogDescription>{uploadFor?.title}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Chọn file (PDF / Ảnh / Audio)</Label>
              <Input type="file" onChange={(e) => setFileName(e.target.files?.[0]?.name ?? '')} disabled={uploading} />
              {fileName && <div className="text-xs text-muted-foreground">Đã chọn: {fileName}</div>}
            </div>
            {uploading && (
              <div className="space-y-1">
                <Progress value={progress} />
                <div className="text-xs text-muted-foreground text-right">{progress}%</div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadFor(null)} disabled={uploading}>Hủy</Button>
            <Button onClick={startUpload} disabled={uploading || !fileName} className="gradient-hero">
              {uploading ? 'Đang tải lên...' : 'Nộp bài'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentSubmissions;
