import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Calendar } from 'lucide-react';
import type { TabContext } from '../shared/TabContext';

const ExtraClassTab = ({ role }: TabContext) => (
  <Card className="border-border/60">
    <CardContent className="py-12 text-center">
      <div className="h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
        <Calendar className="h-6 w-6" />
      </div>
      <h3 className="font-display text-lg font-bold mb-1">Chưa có buổi học bù nào</h3>
      <p className="text-sm text-muted-foreground mb-4">Khi bạn vắng học hoặc cần học bổ sung, các buổi extra class sẽ hiển thị tại đây.</p>
      {role === 'Student' && <Button variant="outline" className="gap-1"><Plus className="h-4 w-4" />Đăng ký học bù</Button>}
    </CardContent>
  </Card>
);

export default ExtraClassTab;
