import { AlertTriangle, CreditCard, Calendar, Receipt } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { studentTuitions, invoices, invoiceStatusLabels, invoiceStatusColors, formatVND } from '@/data/mockFinance';

const STUDENT_ID = 'U005';

const StudentTuition = () => {
  const tuition = studentTuitions.find((t) => t.studentId === STUDENT_ID);
  const myInvoices = invoices.filter((i) => i.studentId === STUDENT_ID);
  const ratio = tuition ? (tuition.sessionsRemaining / tuition.sessionsTotal) * 100 : 0;
  const nearOut = (tuition?.sessionsRemaining ?? 0) <= 3;

  return (
    <div className="space-y-6">
      {nearOut && tuition && (
        <Card className="border-warning/40 bg-warning/5">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="font-semibold text-warning">Sắp hết buổi học</div>
              <div className="text-sm text-muted-foreground mt-1">
                Bạn chỉ còn {tuition.sessionsRemaining} buổi học. Vui lòng liên hệ Giáo vụ để gia hạn trước ngày {tuition.nextRenewalDue}.
              </div>
            </div>
            <Button className="gradient-hero">Đăng ký gia hạn</Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border/60 md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><CreditCard className="h-4 w-4" /> Số buổi học còn lại</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-end gap-2">
              <span className="text-5xl font-bold text-primary">{tuition?.sessionsRemaining ?? 0}</span>
              <span className="text-muted-foreground mb-1">/ {tuition?.sessionsTotal ?? 0} buổi</span>
            </div>
            <Progress value={ratio} className="h-3" />
            <div className="grid grid-cols-2 gap-2 text-sm pt-2">
              <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="h-3.5 w-3.5" /> Hạn gia hạn: <span className="font-medium text-foreground">{tuition?.nextRenewalDue ?? '—'}</span></div>
              <div className="flex items-center gap-2 text-muted-foreground"><Receipt className="h-3.5 w-3.5" /> Lớp: <span className="font-medium text-foreground">{tuition?.className}</span></div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader><CardTitle>Công nợ</CardTitle></CardHeader>
          <CardContent>
            {tuition && tuition.debt > 0 ? (
              <>
                <div className="text-3xl font-bold text-destructive">{formatVND(tuition.debt)}</div>
                <div className="text-xs text-muted-foreground mt-2">Vui lòng thanh toán sớm để duy trì lịch học.</div>
              </>
            ) : (
              <>
                <div className="text-3xl font-bold text-success">0₫</div>
                <div className="text-xs text-muted-foreground mt-2">Bạn không có công nợ.</div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/60">
        <CardHeader><CardTitle>Lịch sử hóa đơn</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Mã</TableHead>
              <TableHead>Loại</TableHead>
              <TableHead className="hidden md:table-cell">Khóa / Số buổi</TableHead>
              <TableHead>Số tiền</TableHead>
              <TableHead className="hidden sm:table-cell">Ngày</TableHead>
              <TableHead>Trạng thái</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {myInvoices.map((i) => (
                <TableRow key={i.id}>
                  <TableCell className="font-mono text-xs">{i.id}</TableCell>
                  <TableCell><Badge variant="outline">{i.type === 'New' ? 'Mới' : 'Gia hạn'}</Badge></TableCell>
                  <TableCell className="hidden md:table-cell text-sm">{i.courseCode} • {i.sessionsPurchased} buổi</TableCell>
                  <TableCell className="font-semibold">{formatVND(i.amount)}</TableCell>
                  <TableCell className="hidden sm:table-cell text-sm">{i.issuedAt}</TableCell>
                  <TableCell><Badge variant="outline" className={invoiceStatusColors[i.status]}>{invoiceStatusLabels[i.status]}</Badge></TableCell>
                </TableRow>
              ))}
              {myInvoices.length === 0 && <TableRow><TableCell colSpan={6} className="text-center py-12 text-muted-foreground">Chưa có hóa đơn</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentTuition;
