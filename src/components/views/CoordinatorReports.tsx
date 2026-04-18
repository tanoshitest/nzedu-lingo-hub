import { useState } from 'react';
import { ArrowLeft, CheckCircle2, Calendar, Clock, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { classSessions, type ClassSession } from '@/data/mockData';

const CoordinatorReports = () => {
  const submitted = classSessions.filter((c) => c.status === 'Đã nộp');
  const [selected, setSelected] = useState<ClassSession | null>(null);
  const [evaluation, setEvaluation] = useState('');

  const handleApprove = () => {
    toast.success(`Đã phê duyệt báo cáo lớp ${selected?.className}`);
    setSelected(null);
    setEvaluation('');
  };

  if (selected) {
    return (
      <div className="space-y-6 max-w-4xl">
        <Button variant="ghost" onClick={() => setSelected(null)} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Quay lại danh sách
        </Button>

        <Card className="border-border/60">
          <CardHeader>
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <CardTitle className="font-display text-2xl">{selected.className}</CardTitle>
                <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{selected.date}</span>
                  <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{selected.time}</span>
                  <span className="flex items-center gap-1.5"><User className="h-4 w-4" />GV. {selected.teacher}</span>
                </div>
              </div>
              <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">{selected.status}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground mb-2">NHẬN XÉT CHUNG CỦA GIÁO VIÊN</h4>
              <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm">
                {selected.report?.generalComment}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-muted-foreground mb-2">BÀI TẬP VỀ NHÀ</h4>
              <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm">
                {selected.report?.homework}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-2">Đánh giá của Giáo vụ</h4>
              <Textarea
                placeholder="Nhập đánh giá của bạn về báo cáo này..."
                value={evaluation}
                onChange={(e) => setEvaluation(e.target.value)}
                rows={5}
              />
            </div>

            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setSelected(null)}>Hủy</Button>
              <Button onClick={handleApprove} className="gradient-hero gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Phê duyệt
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="font-display">Báo cáo chờ phê duyệt</CardTitle>
          <p className="text-sm text-muted-foreground">{submitted.length} báo cáo đang chờ bạn xem xét</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {submitted.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelected(c)}
                className="w-full text-left rounded-xl border border-border bg-card p-5 hover:shadow-elegant hover:border-primary/30 transition-all"
              >
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold mb-1">{c.className}</h3>
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{c.date}</span>
                      <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{c.time}</span>
                      <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" />GV. {c.teacher}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">{c.status}</Badge>
                </div>
              </button>
            ))}
            {submitted.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">Không có báo cáo nào chờ duyệt</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoordinatorReports;
