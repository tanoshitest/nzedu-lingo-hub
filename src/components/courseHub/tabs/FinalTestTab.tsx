import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Calendar, Clock } from 'lucide-react';
import type { TabContext } from '../shared/TabContext';

const FinalTestTab = ({ course, role }: TabContext) => {
  const target = course.syllabus?.overview.targetBandOut ?? 6.5;
  return (
    <div className="space-y-4">
      <Card className="border-border/60 overflow-hidden">
        <div className="gradient-hero p-6 text-primary-foreground">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-5 w-5" />
            <span className="text-sm opacity-90">Final Mock Test</span>
          </div>
          <h2 className="font-display text-2xl font-bold mb-1">{course.name} — Final Test</h2>
          <p className="text-sm opacity-90">Đánh giá tổng hợp 4 kỹ năng • Mục tiêu band {target}</p>
        </div>
        <CardContent className="p-6 space-y-4">
          <div className="grid md:grid-cols-3 gap-3">
            <div className="p-3 rounded-md bg-muted/30 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <div>
                <div className="text-xs text-muted-foreground">Ngày thi</div>
                <div className="text-sm font-medium">15/06/2026</div>
              </div>
            </div>
            <div className="p-3 rounded-md bg-muted/30 flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <div>
                <div className="text-xs text-muted-foreground">Thời gian</div>
                <div className="text-sm font-medium">2h 45'</div>
              </div>
            </div>
            <div className="p-3 rounded-md bg-muted/30 flex items-center gap-2">
              <Trophy className="h-4 w-4 text-primary" />
              <div>
                <div className="text-xs text-muted-foreground">Trạng thái</div>
                <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">Chưa diễn ra</Badge>
              </div>
            </div>
          </div>
          {role === 'Student' && <Button className="w-full" disabled>Vào phòng thi (mở 60 phút trước giờ thi)</Button>}
        </CardContent>
      </Card>
    </div>
  );
};

export default FinalTestTab;
