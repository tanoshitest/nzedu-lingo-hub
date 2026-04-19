import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { testAttempts, testAssignments } from '@/data/mockTestAttempts';
import type { TabContext } from '../shared/TabContext';

const AiMockTestTab = ({ role, studentId }: TabContext) => {
  const list = role === 'Student'
    ? testAttempts.filter((a) => !studentId || a.studentId === studentId)
    : testAttempts;

  return (
    <div className="space-y-4">
      <Card className="border-purple-500/30 bg-purple-500/5">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-purple-500" />
            <div>
              <div className="text-sm font-medium">AI Mock Test</div>
              <div className="text-xs text-muted-foreground">Tổng số bài đã làm: {list.length}</div>
            </div>
          </div>
          {role === 'Student' && <Button size="sm" className="gap-1"><Sparkles className="h-3 w-3" />Bắt đầu mock mới</Button>}
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader><CardTitle className="text-base">Lịch sử AI Mock</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {list.length === 0 && <div className="text-sm text-muted-foreground text-center py-6">Chưa có mock test nào.</div>}
          {list.map((a) => {
            const asg = testAssignments.find((x) => x.id === a.assignmentId);
            return (
              <div key={a.id} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/30 transition">
                <Sparkles className="h-4 w-4 text-purple-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{asg?.testTitle ?? 'AI Mock Test'}</div>
                  <div className="text-xs text-muted-foreground">{a.studentName} • {a.submittedAt ?? 'Chưa nộp'}</div>
                </div>
                {a.overallBand !== undefined && (
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Band {a.overallBand}</Badge>
                )}
                <Badge variant="outline" className="text-[10px]">{a.status}</Badge>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default AiMockTestTab;
