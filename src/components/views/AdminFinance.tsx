import { useState, useMemo } from 'react';
import { Check, X as XIcon, DollarSign, FileText, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  invoices as mockInvoices, type Invoice, invoiceStatusColors, invoiceStatusLabels,
  payrollEntries as mockPayroll, type PayrollEntry, formatVND,
} from '@/data/mockFinance';

const AdminFinance = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [payroll, setPayroll] = useState<PayrollEntry[]>(mockPayroll);

  const pendingNew = useMemo(() => invoices.filter((i) => i.status === 'Pending' && i.type === 'New'), [invoices]);
  const pendingRenewal = useMemo(() => invoices.filter((i) => i.status === 'Pending' && i.type === 'Renewal'), [invoices]);
  const pendingPayroll = useMemo(() => payroll.filter((p) => p.status === 'Pending'), [payroll]);

  const approveInvoice = (id: string) => {
    setInvoices(invoices.map((i) => i.id === id ? { ...i, status: 'Approved' } : i));
    toast.success('Đã duyệt hóa đơn');
  };
  const rejectInvoice = (id: string) => {
    setInvoices(invoices.map((i) => i.id === id ? { ...i, status: 'Rejected' } : i));
    toast.success('Đã từ chối hóa đơn');
  };
  const approvePayroll = (id: string) => {
    setPayroll(payroll.map((p) => p.id === id ? { ...p, status: 'Approved' } : p));
    toast.success('Đã duyệt bảng lương');
  };

  const totalPendingRevenue = [...pendingNew, ...pendingRenewal].reduce((s, i) => s + i.amount, 0);
  const totalPayrollDue = pendingPayroll.reduce((s, p) => s + p.total, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="border-border/60"><CardContent className="p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground"><FileText className="h-3.5 w-3.5" /> Hóa đơn chờ duyệt</div>
          <div className="text-2xl font-bold mt-1">{pendingNew.length + pendingRenewal.length}</div>
          <div className="text-xs text-muted-foreground mt-1">Tổng giá trị: {formatVND(totalPendingRevenue)}</div>
        </CardContent></Card>
        <Card className="border-border/60"><CardContent className="p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground"><DollarSign className="h-3.5 w-3.5" /> Yêu cầu gia hạn</div>
          <div className="text-2xl font-bold mt-1">{pendingRenewal.length}</div>
        </CardContent></Card>
        <Card className="border-border/60"><CardContent className="p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground"><Wallet className="h-3.5 w-3.5" /> Bảng lương chờ duyệt</div>
          <div className="text-2xl font-bold mt-1">{formatVND(totalPayrollDue)}</div>
        </CardContent></Card>
      </div>

      <Tabs defaultValue="new">
        <TabsList>
          <TabsTrigger value="new">Hóa đơn mới ({pendingNew.length})</TabsTrigger>
          <TabsTrigger value="renewal">Gia hạn ({pendingRenewal.length})</TabsTrigger>
          <TabsTrigger value="payroll">Bảng lương ({pendingPayroll.length})</TabsTrigger>
        </TabsList>

        {([['new', pendingNew, 'New'], ['renewal', pendingRenewal, 'Renewal']] as const).map(([key, list]) => (
          <TabsContent key={key} value={key} className="mt-4">
            <Card className="border-border/60"><CardContent className="p-0">
              <Table>
                <TableHeader><TableRow>
                  <TableHead>Mã HĐ</TableHead>
                  <TableHead>Học viên</TableHead>
                  <TableHead className="hidden md:table-cell">Khóa / Ca</TableHead>
                  <TableHead>Số tiền</TableHead>
                  <TableHead className="hidden md:table-cell">Ngày</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {list.map((i) => (
                    <TableRow key={i.id}>
                      <TableCell className="font-mono text-xs">{i.id}</TableCell>
                      <TableCell className="font-medium">{i.studentName}</TableCell>
                      <TableCell className="hidden md:table-cell text-sm">{i.courseCode} • {i.sessionsPurchased} buổi</TableCell>
                      <TableCell className="font-semibold">{formatVND(i.amount)}</TableCell>
                      <TableCell className="hidden md:table-cell text-sm">{i.issuedAt}</TableCell>
                      <TableCell><Badge variant="outline" className={invoiceStatusColors[i.status]}>{invoiceStatusLabels[i.status]}</Badge></TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button size="sm" variant="outline" onClick={() => rejectInvoice(i.id)} className="gap-1 text-destructive">
                            <XIcon className="h-3.5 w-3.5" /> Từ chối
                          </Button>
                          <Button size="sm" onClick={() => approveInvoice(i.id)} className="gap-1">
                            <Check className="h-3.5 w-3.5" /> Duyệt
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {list.length === 0 && <TableRow><TableCell colSpan={7} className="text-center py-12 text-muted-foreground">Không có hóa đơn nào chờ duyệt</TableCell></TableRow>}
                </TableBody>
              </Table>
            </CardContent></Card>
          </TabsContent>
        ))}

        <TabsContent value="payroll" className="mt-4">
          <Card className="border-border/60"><CardContent className="p-0">
            <Table>
              <TableHeader><TableRow>
                <TableHead>Giáo viên</TableHead>
                <TableHead>Tháng</TableHead>
                <TableHead className="text-center">Số ca (1.5h)</TableHead>
                <TableHead>Đơn giá / ca</TableHead>
                <TableHead>Tổng lương</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {pendingPayroll.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.teacherName}</TableCell>
                    <TableCell>{p.month}</TableCell>
                    <TableCell className="text-center">{p.sessions}</TableCell>
                    <TableCell className="text-sm">{formatVND(p.ratePerSession)}</TableCell>
                    <TableCell className="font-semibold">{formatVND(p.total)}</TableCell>
                    <TableCell><Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">Chờ duyệt</Badge></TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" onClick={() => approvePayroll(p.id)} className="gap-1">
                        <Check className="h-3.5 w-3.5" /> Duyệt
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {pendingPayroll.length === 0 && <TableRow><TableCell colSpan={7} className="text-center py-12 text-muted-foreground">Không có bảng lương chờ duyệt</TableCell></TableRow>}
              </TableBody>
            </Table>
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminFinance;
