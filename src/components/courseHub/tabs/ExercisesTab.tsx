import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ListChecks, RotateCcw, Play } from 'lucide-react';
import { exerciseScores, exerciseStatusColors, exerciseStatusLabels, skillColors } from '@/data/mockCourseHub';
import { cn } from '@/lib/utils';
import type { TabContext } from '../shared/TabContext';

const ExercisesTab = ({ course }: TabContext) => {
  const list = exerciseScores.filter((e) => e.courseCode === course.code);

  return (
    <Card className="border-border/60">
      <CardHeader><CardTitle className="text-base flex items-center gap-2"><ListChecks className="h-4 w-4" /> Tất cả bài tập ({list.length})</CardTitle></CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Buổi</TableHead>
              <TableHead>Kỹ năng</TableHead>
              <TableHead>Tiêu đề</TableHead>
              <TableHead>Best score</TableHead>
              <TableHead>Lượt làm</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.map((e) => (
              <TableRow key={e.id}>
                <TableCell className="text-sm">B{e.sessionOrder}</TableCell>
                <TableCell><span className={cn('text-xs font-bold uppercase', skillColors[e.skill])}>{e.skill}</span></TableCell>
                <TableCell className="text-sm max-w-md truncate">{e.title}</TableCell>
                <TableCell className="text-sm font-semibold">{e.bestScore !== undefined ? `${e.bestScore}/${e.maxScore}` : '—'}</TableCell>
                <TableCell className="text-xs">{e.attempts}</TableCell>
                <TableCell><Badge variant="outline" className={exerciseStatusColors[e.status]}>{exerciseStatusLabels[e.status]}</Badge></TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="outline" className="gap-1">
                    {e.status === 'Completed' ? <><RotateCcw className="h-3 w-3" />Làm lại</> : <><Play className="h-3 w-3" />Bắt đầu</>}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ExercisesTab;
