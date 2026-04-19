import { useMemo, useState } from 'react';
import { Plus, PenSquare, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AssignTestDialog from '../assignments/AssignTestDialog';
import TestAttemptGradingDialog from '../grading/TestAttemptGradingDialog';
import {
  assignmentStatusColors,
  attemptStatusColors,
  attemptStatusLabels,
  useAssignments,
  useAttempts,
  type TestAttempt,
} from '@/data/mockTestAttempts';

const TEACHER_NAME = 'Lê Hoàng Cường';

const TeacherTestGrading = () => {
  const assignments = useAssignments();
  const attempts = useAttempts();
  const [assignOpen, setAssignOpen] = useState(false);
  const [grading, setGrading] = useState<TestAttempt | null>(null);

  const inbox = useMemo(
    () => attempts.filter((a) => a.status === 'Grading' || (a.status === 'Returned' && a.gradedBy === TEACHER_NAME)),
    [attempts],
  );
  const mine = useMemo(() => assignments.filter((a) => a.assignedBy === TEACHER_NAME), [assignments]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="text-sm text-muted-foreground">Giao đề IELTS cho lớp chủ nhiệm và chấm điểm Writing / Speaking.</p>
        <Button onClick={() => setAssignOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Giao đề mới
        </Button>
      </div>

      <Tabs defaultValue="grading">
        <TabsList>
          <TabsTrigger value="grading" className="gap-2">
            <PenSquare className="h-4 w-4" /> Cần chấm ({inbox.length})
          </TabsTrigger>
          <TabsTrigger value="assigned" className="gap-2">
            <ClipboardList className="h-4 w-4" /> Đề tôi đã giao ({mine.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="grading" className="mt-4">
          <Card className="border-border/60"><CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>HV</TableHead>
                  <TableHead>Đề</TableHead>
                  <TableHead>Nộp lúc</TableHead>
                  <TableHead>L auto</TableHead>
                  <TableHead>R auto</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inbox.map((at) => (
                  <TableRow key={at.id}>
                    <TableCell className="font-medium">{at.studentName}</TableCell>
                    <TableCell className="text-sm">{at.testId}</TableCell>
                    <TableCell className="text-xs">{at.submittedAt ?? '—'}</TableCell>
                    <TableCell className="text-sm">{at.autoScoreListening != null ? `${at.autoScoreListening}/${at.listeningTotal} (${at.listeningBand})` : '—'}</TableCell>
                    <TableCell className="text-sm">{at.autoScoreReading != null ? `${at.autoScoreReading}/${at.readingTotal} (${at.readingBand})` : '—'}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={attemptStatusColors[at.status]}>{attemptStatusLabels[at.status]}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" onClick={() => setGrading(at)} className="gap-1">
                        <PenSquare className="h-3.5 w-3.5" /> Chấm
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {inbox.length === 0 && (
                  <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">Không có bài nào cần chấm.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="assigned" className="mt-4">
          <Card className="border-border/60"><CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã</TableHead>
                  <TableHead>Đề</TableHead>
                  <TableHead>Lớp / HV</TableHead>
                  <TableHead>Mở</TableHead>
                  <TableHead>Hạn</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mine.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-mono text-xs">{a.id}</TableCell>
                    <TableCell className="text-sm">{a.testCode}</TableCell>
                    <TableCell className="text-sm">{a.className ?? `${a.studentIds.length} HV`}</TableCell>
                    <TableCell className="text-xs">{a.openAt}</TableCell>
                    <TableCell className="text-xs">{a.dueAt}</TableCell>
                    <TableCell><Badge variant="outline" className={assignmentStatusColors[a.status]}>{a.status}</Badge></TableCell>
                  </TableRow>
                ))}
                {mine.length === 0 && (
                  <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Bạn chưa giao đề nào.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent></Card>
        </TabsContent>
      </Tabs>

      <AssignTestDialog open={assignOpen} onClose={() => setAssignOpen(false)} assignedBy={TEACHER_NAME} assignedByRole="Teacher" />
      <TestAttemptGradingDialog open={!!grading} attempt={grading} gradedBy={TEACHER_NAME} onClose={() => setGrading(null)} />
    </div>
  );
};

export default TeacherTestGrading;
