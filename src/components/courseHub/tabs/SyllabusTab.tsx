import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { BookOpen, FileText, Sparkles, ChevronRight, Circle, CheckCircle2, CircleDashed, Clock, Download, Link as LinkIcon } from 'lucide-react';
import { exerciseScores, sampleDocuments, exerciseStatusLabels, exerciseStatusColors, sampleStatusLabels, sampleStatusColors, skillColors } from '@/data/mockCourseHub';
import { testAttempts, testAssignments } from '@/data/mockTestAttempts';
import { useClassReports, reportStore, reportStatusDot } from '@/data/mockClassReports';
import SessionReportForm from '../SessionReportForm';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { TabContext } from '../shared/TabContext';

const SyllabusTab = ({ course, role, studentId, className, teacherName }: TabContext) => {
  const sessions = course.syllabus?.sessions ?? [];
  const [selectedOrder, setSelectedOrder] = useState<number>(sessions[0]?.order ?? 1);
  useClassReports(); // subscribe rerender khi report đổi

  const courseEx = exerciseScores.filter((e) => e.courseCode === course.code);
  const courseSamples = sampleDocuments.filter((s) => s.courseCode === course.code);

  const totalExercises = courseEx.length;
  const totalSamples = courseSamples.length;
  const myAttempts = testAttempts.filter((a) => !studentId || a.studentId === studentId);
  const aiMockCount = myAttempts.length;

  if (!course.syllabus) {
    return (
      <Card className="border-border/60">
        <CardContent className="py-16 text-center text-sm text-muted-foreground">
          Khoá học này chưa có giáo trình được cấu hình.
        </CardContent>
      </Card>
    );
  }

  const session = sessions.find((s) => s.order === selectedOrder) ?? sessions[0];
  const sessionEx = courseEx.filter((e) => e.sessionOrder === session.order);
  const sessionSamples = courseSamples.filter((s) => s.sessionOrder === session.order);
  const sessionAiMock = myAttempts.slice(0, 2);

  const skillLabel = session.skillFocus[0] ?? 'General';
  const sessionStage = `GIAI ĐOẠN ${session.weekNumber} - HỌC ${skillLabel.toUpperCase()}`;

  const statusIcon = (status: string) => {
    if (status === 'Completed') return <CheckCircle2 className="h-4 w-4 text-success" />;
    if (status === 'InProgress') return <CircleDashed className="h-4 w-4 text-info" />;
    return <Circle className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <div className="space-y-4">
      {/* Session selector strip */}
      <Card className="border-border/60">
        <CardContent className="p-3">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {sessions.map((s) => {
              const isActive = s.order === selectedOrder;
              const report = role === 'Teacher' && className
                ? reportStore.findBySession(course.code, className, s.order)
                : undefined;
              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedOrder(s.order)}
                  className={cn(
                    'flex-shrink-0 px-3 py-2 rounded-lg border text-xs font-medium transition relative',
                    isActive ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:bg-muted/50',
                  )}
                >
                  Buổi {s.order}
                  <div className="text-[10px] opacity-70 truncate max-w-[140px]">{s.title}</div>
                  {role === 'Teacher' && (
                    <span
                      className={cn(
                        'absolute top-1.5 right-1.5 h-2 w-2 rounded-full',
                        report ? reportStatusDot[report.status] : 'bg-muted-foreground/30',
                      )}
                      title={report ? `Báo cáo: ${report.status}` : 'Chưa có báo cáo'}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Session header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="text-xs font-semibold text-primary tracking-wider">{sessionStage}</div>
          <h2 className="font-display text-xl font-bold mt-0.5">Buổi {session.order}: {session.title}</h2>
          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {session.durationMinutes} phút</span>
            <span>Tuần {session.weekNumber}</span>
            <div className="flex gap-1">
              {session.skillFocus.map((sk) => (
                <Badge key={sk} variant="outline" className="text-[10px]">{sk}</Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      <h3 className="font-display text-lg font-bold">{role === 'Teacher' ? 'In-Class & Report' : 'In-Class & Homework'}</h3>

      <Tabs defaultValue="inclass" className="w-full">
        <TabsList>
          <TabsTrigger value="inclass">In-Class</TabsTrigger>
          {role === 'Student'
            ? <TabsTrigger value="homework">Homework</TabsTrigger>
            : <TabsTrigger value="report">Report</TabsTrigger>}
          <TabsTrigger value="materials">Tài liệu</TabsTrigger>
        </TabsList>

        <TabsContent value="inclass" className="space-y-4 mt-4">
          {/* Banner stats */}
          <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
            <div className="text-sm">
              Mục này của bạn có <span className="font-bold text-primary">{sessionEx.length + sessionSamples.length + sessionAiMock.length}</span> bài luyện tập
            </div>
            <div className="flex gap-2 mt-2 flex-wrap">
              <Badge variant="outline" className="bg-info/10 text-info border-info/20 gap-1"><FileText className="h-3 w-3" /> {sessionEx.length} exercises</Badge>
              <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 gap-1"><BookOpen className="h-3 w-3" /> {sessionSamples.length} samples W/S</Badge>
              <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20 gap-1"><Sparkles className="h-3 w-3" /> {sessionAiMock.length} AI mock</Badge>
            </div>
          </div>

          {/* EXERCISES */}
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Exercises</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {sessionEx.length === 0 && <div className="text-xs text-muted-foreground text-center py-4">Chưa có exercise nào cho buổi này.</div>}
              <div className="grid md:grid-cols-2 gap-2">
                {sessionEx.map((ex) => (
                  <div key={ex.id} className="flex items-center gap-2 p-3 rounded-lg border border-border hover:bg-muted/30 transition cursor-pointer group">
                    {statusIcon(ex.status)}
                    <span className={cn('text-xs font-bold uppercase', skillColors[ex.skill])}>{ex.skill}</span>
                    {ex.bestScore !== undefined && (
                      <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-[10px]">Best: {ex.bestScore}/{ex.maxScore}</Badge>
                    )}
                    <div className="flex-1 min-w-0 text-xs truncate">{ex.title}</div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* SAMPLES */}
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Samples</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {sessionSamples.length === 0 && <div className="text-xs text-muted-foreground text-center py-4">Chưa có bài mẫu.</div>}
              {sessionSamples.map((s) => (
                <div key={s.id} className="flex items-center gap-2 p-3 rounded-lg border border-border hover:bg-muted/30 transition cursor-pointer group">
                  <BookOpen className="h-4 w-4 text-warning" />
                  <span className={cn('text-xs font-bold uppercase', s.type === 'Writing' ? 'text-primary' : 'text-success')}>{s.type}</span>
                  <Badge variant="outline" className={cn('text-[10px]', sampleStatusColors[s.status])}>{sampleStatusLabels[s.status]}</Badge>
                  <div className="flex-1 min-w-0 text-xs truncate">{s.title}</div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* AI MOCK TEST */}
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-purple-500" /> AI Mock Test
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {sessionAiMock.length === 0 && <div className="text-xs text-muted-foreground text-center py-4">Chưa có AI mock cho buổi này.</div>}
              {sessionAiMock.map((a) => {
                const asg = testAssignments.find((x) => x.id === a.assignmentId);
                return (
                  <div key={a.id} className="flex items-center gap-2 p-3 rounded-lg border border-border hover:bg-muted/30 transition cursor-pointer group">
                    <Sparkles className="h-4 w-4 text-purple-500" />
                    <Badge variant="outline" className="text-[10px]">{a.status}</Badge>
                    {a.overallBand !== undefined && (
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px]">Band {a.overallBand}</Badge>
                    )}
                    <div className="flex-1 min-w-0 text-xs truncate">{asg?.testTitle ?? 'AI Practice Test'}</div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition" />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="homework" className="space-y-4 mt-4">
          {role === 'Student' && (
            <Card className="border-border/60">
            <CardHeader><CardTitle className="text-base">Bài tập về nhà — Buổi {session.order}</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="p-4 rounded-lg border border-border bg-muted/20">
                <div className="text-sm">{session.homework.description}</div>
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" /> Ước tính {session.homework.estimatedMinutes} phút
                </div>
              </div>
              {role === 'Student' && (
                <Button className="w-full" variant="outline" size="sm">Nộp bài</Button>
              )}
              {session.assessment && (
                <div className="flex items-center justify-between text-sm p-3 rounded-md bg-warning/10 border border-warning/20">
                  <span>Đánh giá: {session.assessment.type}</span>
                  <Badge variant="outline" className="bg-warning/20 text-warning border-warning/30">Trọng số {session.assessment.weight}%</Badge>
                </div>
              )}
            </CardContent>
          </Card>
          )}
        </TabsContent>

        <TabsContent value="report" className="mt-4">
          {role === 'Teacher' && className && teacherName && (
            <SessionReportForm
              courseCode={course.code}
              className={className}
              sessionOrder={session.order}
              sessionTitle={session.title}
              teacherName={teacherName}
            />
          )}
        </TabsContent>

        <TabsContent value="materials" className="mt-4">
          {(() => {
            const allMaterials = course.syllabus?.materials ?? [];
            const sessionMaterials = allMaterials.filter((m) => session.materialIds.includes(m.id));
            const typeColors: Record<string, string> = {
              Textbook: 'bg-primary/10 text-primary border-primary/20',
              Workbook: 'bg-info/10 text-info border-info/20',
              OnlineResource: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
              InternalDoc: 'bg-warning/10 text-warning border-warning/20',
              TestBank: 'bg-success/10 text-success border-success/20',
            };
            return (
              <Card className="border-border/60">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <BookOpen className="h-4 w-4" /> Tài liệu buổi {session.order}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {sessionMaterials.length === 0 && (
                    <div className="text-sm text-muted-foreground text-center py-8">
                      Không có tài liệu được gán cho buổi này.
                    </div>
                  )}
                  {sessionMaterials.map((m) => (
                    <div key={m.id} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/30 transition">
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                        {m.url ? <LinkIcon className="h-4 w-4 text-primary" /> : <FileText className="h-4 w-4 text-primary" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className={cn('text-[10px]', typeColors[m.type])}>{m.type}</Badge>
                          {m.required && <Badge variant="outline" className="text-[10px] bg-destructive/10 text-destructive border-destructive/20">Bắt buộc</Badge>}
                          <span className="font-medium text-sm truncate">{m.title}</span>
                        </div>
                        {(m.author || m.publisher) && (
                          <div className="text-xs text-muted-foreground mt-0.5 truncate">
                            {m.author}{m.author && m.publisher ? ' • ' : ''}{m.publisher}
                          </div>
                        )}
                      </div>
                      {role === 'Teacher' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1"
                          onClick={() => toast.success(`Đã tải "${m.title}" (mock)`)}
                        >
                          <Download className="h-3.5 w-3.5" /> Tải
                        </Button>
                      )}
                      {role === 'Student' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1"
                          onClick={() => toast.success(`Đang mở "${m.title}" (mock)`)}
                        >
                          {m.url ? <LinkIcon className="h-3.5 w-3.5" /> : <Download className="h-3.5 w-3.5" />} Xem
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SyllabusTab;
