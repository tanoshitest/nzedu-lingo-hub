import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText } from 'lucide-react';
import { submissions, submissionStatusColors, submissionStatusLabels } from '@/data/mockGrading';
import type { TabContext } from '../shared/TabContext';

const AssignmentsTab = ({ role, studentId, className }: TabContext) => {
  const list = submissions.filter((s) =>
    (!className || s.className === className) &&
    (role === 'Teacher' || !studentId || s.studentId === studentId),
  );

  return (
    <Card className="border-border/60">
      <CardHeader><CardTitle className="text-base flex items-center gap-2"><FileText className="h-4 w-4" /> Bài tập đã nộp ({list.length})</CardTitle></CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              {role === 'Teacher' && <TableHead>Học viên</TableHead>}
              <TableHead>Bài học</TableHead>
              <TableHead>File</TableHead>
              <TableHead>Nộp lúc</TableHead>
              <TableHead>Điểm</TableHead>
              <TableHead>Trạng thái</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.map((s) => (
              <TableRow key={s.id}>
                {role === 'Teacher' && <TableCell className="text-sm">{s.studentName}</TableCell>}
                <TableCell className="text-sm">{s.lessonTitle}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{s.fileName}</TableCell>
                <TableCell className="text-xs">{s.submittedAt}</TableCell>
                <TableCell className="text-sm font-semibold">{s.score ?? '—'}</TableCell>
                <TableCell><Badge variant="outline" className={submissionStatusColors[s.status]}>{submissionStatusLabels[s.status]}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {list.length === 0 && <div className="text-sm text-muted-foreground text-center py-8">Chưa có bài tập nào.</div>}
      </CardContent>
    </Card>
  );
};

export default AssignmentsTab;
