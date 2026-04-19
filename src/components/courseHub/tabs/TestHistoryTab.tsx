import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { History } from 'lucide-react';
import { testAttempts, testAssignments } from '@/data/mockTestAttempts';
import type { TabContext } from '../shared/TabContext';

const TestHistoryTab = ({ role, studentId }: TabContext) => {
  const list = role === 'Student'
    ? testAttempts.filter((a) => !studentId || a.studentId === studentId)
    : testAttempts;

  return (
    <Card className="border-border/60">
      <CardHeader><CardTitle className="text-base flex items-center gap-2"><History className="h-4 w-4" /> Lịch sử bài test ({list.length})</CardTitle></CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              {role === 'Teacher' && <TableHead>Học viên</TableHead>}
              <TableHead>Đề</TableHead>
              <TableHead>Nộp lúc</TableHead>
              <TableHead>L</TableHead>
              <TableHead>R</TableHead>
              <TableHead>W</TableHead>
              <TableHead>S</TableHead>
              <TableHead>Overall</TableHead>
              <TableHead>Trạng thái</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.map((a) => {
              const asg = testAssignments.find((x) => x.id === a.assignmentId);
              return (
                <TableRow key={a.id}>
                  {role === 'Teacher' && <TableCell className="text-sm">{a.studentName}</TableCell>}
                  <TableCell className="text-sm max-w-xs truncate">{asg?.testTitle ?? '—'}</TableCell>
                  <TableCell className="text-xs">{a.submittedAt ?? '—'}</TableCell>
                  <TableCell className="text-sm">{a.listeningBand ?? '—'}</TableCell>
                  <TableCell className="text-sm">{a.readingBand ?? '—'}</TableCell>
                  <TableCell className="text-sm">{a.writingBand ?? '—'}</TableCell>
                  <TableCell className="text-sm">{a.speakingBand ?? '—'}</TableCell>
                  <TableCell className="text-sm font-bold">{a.overallBand ?? '—'}</TableCell>
                  <TableCell><Badge variant="outline" className="text-[10px]">{a.status}</Badge></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {list.length === 0 && <div className="text-sm text-muted-foreground text-center py-8">Chưa có bài test nào.</div>}
      </CardContent>
    </Card>
  );
};

export default TestHistoryTab;
