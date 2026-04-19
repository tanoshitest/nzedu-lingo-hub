import { useMemo, useState } from 'react';
import { Play, RotateCcw, Award, CheckCircle2, Clock, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import TestPlayer from '../player/TestPlayer';
import {
  attemptStore,
  attemptStatusColors,
  attemptStatusLabels,
  useAssignments,
  useAttempts,
  type TestAttempt,
} from '@/data/mockTestAttempts';

const CURRENT_STUDENT_ID = 'S001';
const CURRENT_STUDENT_NAME = 'Hoàng Minh Đức';

const StudentTests = () => {
  const assignments = useAssignments();
  const attempts = useAttempts();
  const [playing, setPlaying] = useState<TestAttempt | null>(null);
  const [viewResult, setViewResult] = useState<TestAttempt | null>(null);

  const myAttempts = useMemo(
    () => attempts.filter((a) => a.studentId === CURRENT_STUDENT_ID),
    [attempts],
  );

  const getAssignment = (attemptId: string) => {
    const at = myAttempts.find((x) => x.id === attemptId);
    return assignments.find((a) => a.id === at?.assignmentId);
  };

  const upcoming = myAttempts.filter((a) => a.status === 'NotStarted');
  const inProgress = myAttempts.filter((a) => a.status === 'InProgress');
  const completed = myAttempts.filter((a) => ['Submitted', 'Grading', 'PendingApproval', 'Approved', 'Returned'].includes(a.status));

  const startTest = (attempt: TestAttempt) => {
    const updated: TestAttempt = {
      ...attempt,
      status: 'InProgress',
      startedAt: attempt.startedAt ?? new Date().toISOString().slice(0, 10),
    };
    attemptStore.upsertAttempt(updated);
    setPlaying(updated);
  };

  if (playing) {
    const a = assignments.find((x) => x.id === playing.assignmentId);
    return (
      <TestPlayer
        attempt={playing}
        durationMinutes={a?.durationMinutes ?? 60}
        onExit={() => setPlaying(null)}
      />
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Danh sách các bài thi IELTS được giáo vụ / giáo viên giao. Hoàn thành trước hạn để được chấm điểm.</p>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming" className="gap-2"><Clock className="h-4 w-4" /> Sắp tới ({upcoming.length})</TabsTrigger>
          <TabsTrigger value="inprogress" className="gap-2"><RotateCcw className="h-4 w-4" /> Đang làm ({inProgress.length})</TabsTrigger>
          <TabsTrigger value="completed" className="gap-2"><Award className="h-4 w-4" /> Đã nộp ({completed.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-4 space-y-3">
          {upcoming.length === 0 && <EmptyState text="Bạn chưa có bài thi nào mới." />}
          {upcoming.map((at) => {
            const a = getAssignment(at.id);
            return (
              <Card key={at.id} className="border-border/60"><CardContent className="p-4 flex items-center justify-between flex-wrap gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold">{a?.testCode} — {a?.testTitle}</div>
                  <div className="text-xs text-muted-foreground">Hạn: {a?.dueAt} • {a?.durationMinutes} phút • {a?.skills.join(', ')}</div>
                  {a?.instructions && <div className="mt-1 text-xs text-muted-foreground italic">{a.instructions}</div>}
                </div>
                <Button onClick={() => startTest(at)} className="gap-2">
                  <Play className="h-4 w-4" /> Bắt đầu
                </Button>
              </CardContent></Card>
            );
          })}
        </TabsContent>

        <TabsContent value="inprogress" className="mt-4 space-y-3">
          {inProgress.length === 0 && <EmptyState text="Không có bài đang làm dở." />}
          {inProgress.map((at) => {
            const a = getAssignment(at.id);
            return (
              <Card key={at.id} className="border-border/60"><CardContent className="p-4 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <div className="font-semibold">{a?.testCode} — {a?.testTitle}</div>
                  <div className="text-xs text-muted-foreground">Bắt đầu: {at.startedAt}</div>
                </div>
                <Button onClick={() => setPlaying(at)} className="gap-2">
                  <RotateCcw className="h-4 w-4" /> Tiếp tục
                </Button>
              </CardContent></Card>
            );
          })}
        </TabsContent>

        <TabsContent value="completed" className="mt-4 space-y-3">
          {completed.length === 0 && <EmptyState text="Bạn chưa nộp bài thi nào." />}
          {completed.map((at) => {
            const a = getAssignment(at.id);
            return (
              <Card key={at.id} className="border-border/60"><CardContent className="p-4 flex items-center justify-between flex-wrap gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold">{a?.testCode} — {a?.testTitle}</div>
                  <div className="text-xs text-muted-foreground">Nộp: {at.submittedAt ?? '—'}</div>
                  <Badge variant="outline" className={`mt-1 ${attemptStatusColors[at.status]}`}>{attemptStatusLabels[at.status]}</Badge>
                </div>
                <div className="flex items-center gap-3">
                  {at.overallBand != null && (
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">Overall Band</div>
                      <div className="font-display text-2xl font-bold text-primary">{at.overallBand}</div>
                    </div>
                  )}
                  <Button variant="outline" onClick={() => setViewResult(at)} className="gap-2">
                    <FileText className="h-4 w-4" /> Xem kết quả
                  </Button>
                </div>
              </CardContent></Card>
            );
          })}
        </TabsContent>
      </Tabs>

      <Dialog open={!!viewResult} onOpenChange={(o) => !o && setViewResult(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {viewResult && (
            <>
              <DialogHeader>
                <DialogTitle>Kết quả bài thi</DialogTitle>
                <DialogDescription>{getAssignment(viewResult.id)?.testCode} — {CURRENT_STUDENT_NAME}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Badge variant="outline" className={attemptStatusColors[viewResult.status]}>{attemptStatusLabels[viewResult.status]}</Badge>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <BandCard label="Listening" band={viewResult.listeningBand} raw={viewResult.autoScoreListening} total={viewResult.listeningTotal} />
                  <BandCard label="Reading" band={viewResult.readingBand} raw={viewResult.autoScoreReading} total={viewResult.readingTotal} />
                  <BandCard label="Writing" band={viewResult.writingBand} />
                  <BandCard label="Speaking" band={viewResult.speakingBand} />
                </div>

                {viewResult.overallBand != null && (
                  <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 text-center">
                    <div className="text-xs text-muted-foreground">Overall Band</div>
                    <div className="font-display text-4xl font-bold text-primary">{viewResult.overallBand}</div>
                  </div>
                )}

                {viewResult.teacherFeedback && (
                  <div className="rounded-md border border-border p-3">
                    <div className="text-xs font-semibold text-muted-foreground mb-1">Nhận xét giáo viên</div>
                    <div className="text-sm whitespace-pre-wrap">{viewResult.teacherFeedback}</div>
                  </div>
                )}

                {viewResult.writingResponses.length > 0 && viewResult.status === 'Approved' && (
                  <div className="space-y-2">
                    <div className="font-semibold text-sm">Writing feedback</div>
                    {viewResult.writingResponses.map((w) => (
                      <div key={w.taskNumber} className="rounded-md border border-border p-3 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Task {w.taskNumber}</span>
                          {w.bandOverall && <Badge variant="outline">Band {w.bandOverall}</Badge>}
                        </div>
                        {w.feedback && <div className="text-xs text-muted-foreground mt-1">{w.feedback}</div>}
                      </div>
                    ))}
                  </div>
                )}

                {viewResult.coordinatorApprovalNote && (
                  <div className="rounded-md border border-border bg-muted/30 p-3">
                    <div className="text-xs font-semibold text-muted-foreground mb-1">Ghi chú giáo vụ</div>
                    <div className="text-sm">{viewResult.coordinatorApprovalNote}</div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const EmptyState = ({ text }: { text: string }) => (
  <Card className="border-dashed border-border/60"><CardContent className="py-10 text-center text-muted-foreground text-sm">
    <CheckCircle2 className="h-8 w-8 mx-auto mb-2 opacity-40" />
    {text}
  </CardContent></Card>
);

const BandCard = ({ label, band, raw, total }: { label: string; band?: number; raw?: number; total?: number }) => (
  <div className="rounded-md border border-border p-3 text-center">
    <div className="text-xs text-muted-foreground">{label}</div>
    <div className="font-bold text-lg">{band ?? '—'}</div>
    {raw != null && total != null && <div className="text-xs text-muted-foreground">{raw}/{total}</div>}
  </div>
);

export default StudentTests;
