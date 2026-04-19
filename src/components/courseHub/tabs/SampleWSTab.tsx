import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileStack, BookOpen } from 'lucide-react';
import { sampleDocuments, sampleStatusColors, sampleStatusLabels } from '@/data/mockCourseHub';
import { cn } from '@/lib/utils';
import type { TabContext } from '../shared/TabContext';

const SampleWSTab = ({ course }: TabContext) => {
  const list = sampleDocuments.filter((s) => s.courseCode === course.code);
  return (
    <Card className="border-border/60">
      <CardHeader><CardTitle className="text-base flex items-center gap-2"><FileStack className="h-4 w-4" /> Sample W/S ({list.length})</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        {list.map((s) => (
          <div key={s.id} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/30 transition">
            <div className={cn('h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0', s.type === 'Writing' ? 'bg-primary/10 text-primary' : 'bg-success/10 text-success')}>
              <BookOpen className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{s.title}</div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-[10px]">{s.type}</Badge>
                <Badge variant="outline" className="text-[10px]">{s.topic}</Badge>
                <Badge variant="outline" className={cn('text-[10px]', sampleStatusColors[s.status])}>{sampleStatusLabels[s.status]}</Badge>
              </div>
            </div>
            <Button size="sm" variant="outline">Xem</Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default SampleWSTab;
