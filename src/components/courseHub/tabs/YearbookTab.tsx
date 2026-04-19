import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera } from 'lucide-react';
import type { TabContext } from '../shared/TabContext';

const YearbookTab = ({ className }: TabContext) => (
  <Card className="border-border/60">
    <CardHeader><CardTitle className="text-base flex items-center gap-2"><Camera className="h-4 w-4" /> Kỷ yếu lớp {className ?? ''}</CardTitle></CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-video rounded-lg bg-gradient-to-br from-primary/20 via-info/20 to-warning/20 flex items-center justify-center border border-border">
            <Camera className="h-8 w-8 text-muted-foreground opacity-40" />
          </div>
        ))}
      </div>
      <div className="text-xs text-muted-foreground text-center mt-4">Kỷ yếu sẽ được cập nhật sau buổi học cuối khoá.</div>
    </CardContent>
  </Card>
);

export default YearbookTab;
