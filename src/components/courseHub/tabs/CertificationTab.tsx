import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Award, CheckCircle2, AlertCircle, Download } from 'lucide-react';
import { certifications } from '@/data/mockCourseHub';
import type { TabContext } from '../shared/TabContext';

const CertificationTab = ({ course, studentId }: TabContext) => {
  const cert = certifications.find((c) => c.courseCode === course.code && (!studentId || c.studentId === studentId));

  if (!cert) {
    return (
      <Card className="border-border/60">
        <CardContent className="py-12 text-center text-sm text-muted-foreground">
          <Award className="h-10 w-10 mx-auto mb-2 opacity-40" />
          Chưa có thông tin chứng chỉ cho khoá học này.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/60 overflow-hidden">
      <div className={cert.eligible ? 'gradient-hero p-6 text-primary-foreground' : 'bg-warning/10 border-b border-warning/20 p-6'}>
        <div className="flex items-center gap-3">
          <Award className="h-8 w-8" />
          <div>
            <div className="text-xs opacity-90">Chứng chỉ hoàn thành khoá</div>
            <h2 className="font-display text-xl font-bold">{course.name}</h2>
          </div>
        </div>
      </div>
      <CardContent className="p-6 space-y-4">
        {cert.eligible ? (
          <>
            <div className="flex items-center gap-2 p-3 rounded-md bg-success/10 border border-success/20">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <div>
                <div className="text-sm font-medium text-success">Bạn đã đủ điều kiện nhận chứng chỉ!</div>
                <div className="text-xs text-muted-foreground">Số hiệu: {cert.certificateNumber} • Cấp ngày {cert.issuedAt}</div>
              </div>
            </div>
            <Button className="w-full gap-2"><Download className="h-4 w-4" />Tải chứng chỉ (PDF)</Button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 p-3 rounded-md bg-warning/10 border border-warning/20">
              <AlertCircle className="h-5 w-5 text-warning" />
              <div className="text-sm">Chưa đủ điều kiện nhận chứng chỉ.</div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Yêu cầu còn thiếu</div>
              <ul className="space-y-2">
                {cert.missingRequirements.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 text-[10px]">Thiếu</Badge>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CertificationTab;
