import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Route, CheckCircle2, Clock, Circle } from 'lucide-react';
import { roadmapSteps, roadmapStatusColors } from '@/data/mockCourseHub';
import type { TabContext } from '../shared/TabContext';

const icons = {
  Done: <CheckCircle2 className="h-5 w-5 text-success" />,
  InProgress: <Clock className="h-5 w-5 text-info" />,
  Upcoming: <Circle className="h-5 w-5 text-muted-foreground" />,
};

const RoadmapTab = ({ course }: TabContext) => {
  const list = roadmapSteps.filter((r) => r.courseCode === course.code).sort((a, b) => a.order - b.order);
  return (
    <Card className="border-border/60">
      <CardHeader><CardTitle className="text-base flex items-center gap-2"><Route className="h-4 w-4" /> Lộ trình cá nhân hoá</CardTitle></CardHeader>
      <CardContent>
        <div className="relative space-y-4 pl-6">
          <div className="absolute left-2.5 top-2 bottom-2 w-px bg-border" />
          {list.map((r) => (
            <div key={r.id} className="relative">
              <div className="absolute -left-6 top-0 bg-card">{icons[r.status]}</div>
              <div className="p-3 rounded-lg border border-border">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-medium">Bước {r.order}: {r.title}</div>
                    <p className="text-xs text-muted-foreground mt-1">{r.description}</p>
                  </div>
                  <Badge variant="outline" className={roadmapStatusColors[r.status]}>{r.status}</Badge>
                </div>
                <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground">
                  {r.expectedBand && <span>Band dự kiến: <span className="font-semibold">{r.expectedBand}</span></span>}
                  {r.achievedAt && <span>Đạt vào: {r.achievedAt}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RoadmapTab;
