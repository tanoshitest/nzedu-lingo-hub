import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { classSessions } from '@/data/mockData';
import type { TabContext } from '../shared/TabContext';

const ScheduleTab = ({ className }: TabContext) => {
  const sessions = classSessions.filter((s) => !className || s.className === className);
  return (
    <Card className="border-border/60">
      <CardHeader><CardTitle className="text-base flex items-center gap-2"><Calendar className="h-4 w-4" /> Lịch lý thuyết</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        {sessions.length === 0 && <div className="text-sm text-muted-foreground text-center py-6">Chưa có lịch học nào.</div>}
        {sessions.map((s, i) => (
          <div key={s.id} className="flex items-center gap-4 p-3 rounded-lg border border-border hover:bg-muted/30 transition">
            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 font-bold text-sm">
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm">{s.className}</div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{s.date}</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{s.time}</span>
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />Phòng 301</span>
              </div>
            </div>
            <Badge variant="outline" className="text-[10px]">{s.status}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ScheduleTab;
