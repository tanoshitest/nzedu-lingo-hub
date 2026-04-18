import { useState, useMemo } from 'react';
import { Wallet, TrendingUp, Users, Download, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { payrollEntries, formatVND, type PayrollStatus } from '@/data/mockFinance';
import { payrollHistory } from '@/data/mockReports';

const statusColors: Record<PayrollStatus, string> = {
  Pending: 'bg-warning/10 text-warning border-warning/20',
  Approved: 'bg-info/10 text-info border-info/20',
  Paid: 'bg-success/10 text-success border-success/20',
};

const statusLabels: Record<PayrollStatus, string> = {
  Pending: 'Chờ duyệt',
  Approved: 'Đã duyệt',
  Paid: 'Đã chi trả',
};

const PayrollReport = () => {
  const [month, setMonth] = useState<string>('all');
  const [status, setStatus] = useState<string>('all');

  const months = useMemo(() => Array.from(new Set(payrollEntries.map((p) => p.month))).sort().reverse(), []);

  const filtered = useMemo(() => {
    return payrollEntries.filter((p) =>
      (month === 'all' || p.month === month) &&
      (status === 'all' || p.status === status)
    );
  }, [month, status]);

  const totalCost = filtered.reduce((s, p) => s + p.total, 0);
  const totalSessions = filtered.reduce((s, p) => s + p.sessions, 0);
  const teacherCount = new Set(filtered.map((p) => p.teacherId)).size;

  const maxBar = Math.max(...payrollHistory.map((m) => m.totalCost));

  const handleExport = () => toast.success('Đã xuất báo cáo Excel (mock)');

  return (
    <div className="space-y-6">
      {/* KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="border-border/60"><CardContent className="p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground"><Wallet className="h-3.5 w-3.5" /> Tổng quỹ lương</div>
          <div className="text-2xl font-bold mt-1">{formatVND(totalCost)}</div>
          <div className="text-xs text-muted-foreground mt-1">{filtered.length} bản ghi</div>
        </CardContent></Card>
        <Card className="border-border/60"><CardContent className="p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground"><Calendar className="h-3.5 w-3.5" /> Tổng số ca dạy</div>
          <div className="text-2xl font-bold mt-1">{totalSessions}</div>
          <div className="text-xs text-muted-foreground mt-1">Quy đổi ca 1.5h</div>
        </CardContent></Card>
        <Card className="border-border/60"><CardContent className="p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground"><Users className="h-3.5 w-3.5" /> Số GV được trả</div>
          <div className="text-2xl font-bold mt-1">{teacherCount}</div>
        </CardContent></Card>
      </div>

      {/* Bar chart 6 tháng */}
      <Card className="border-border/60">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <CardTitle className="font-display text-base">Quỹ lương 6 tháng gần nhất</CardTitle>
              <p className="text-sm text-muted-foreground">Đơn vị: triệu VNĐ</p>
            </div>
            <Badge variant="outline" className="bg-success/10 text-success border-success/20 gap-1">
              <TrendingUp className="h-3 w-3" /> Ổn định
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-3 sm:gap-4 h-56 pt-4">
            {payrollHistory.map((m) => {
              const h = (m.totalCost / maxBar) * 100;
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full flex-1 flex items-end relative">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition text-xs font-semibold bg-popover border border-border rounded px-2 py-0.5 whitespace-nowrap">
                      {(m.totalCost / 1_000_000).toFixed(1)}M • {m.sessions} ca
                    </div>
                    <div
                      className="w-full rounded-t-md bg-gradient-to-t from-primary to-info hover:opacity-80 transition-all cursor-pointer"
                      style={{ height: `${h}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground font-medium">{m.month}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Filter + bảng chi tiết */}
      <Card className="border-border/60">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle className="font-display text-base">Chi tiết theo giáo viên</CardTitle>
            <div className="flex items-center gap-2">
              <Select value={month} onValueChange={setMonth}>
                <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả tháng</SelectItem>
                  {months.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả TT</SelectItem>
                  <SelectItem value="Pending">Chờ duyệt</SelectItem>
                  <SelectItem value="Approved">Đã duyệt</SelectItem>
                  <SelectItem value="Paid">Đã chi trả</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
                <Download className="h-4 w-4" /> Xuất Excel
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Giáo viên</TableHead>
                <TableHead>Tháng</TableHead>
                <TableHead className="text-right">Số ca</TableHead>
                <TableHead className="text-right hidden md:table-cell">Đơn giá/ca</TableHead>
                <TableHead className="text-right">Thành tiền</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.teacherName}</TableCell>
                  <TableCell>{p.month}</TableCell>
                  <TableCell className="text-right">{p.sessions}</TableCell>
                  <TableCell className="text-right hidden md:table-cell text-muted-foreground">{formatVND(p.ratePerSession)}</TableCell>
                  <TableCell className="text-right font-semibold">{formatVND(p.total)}</TableCell>
                  <TableCell><Badge variant="outline" className={statusColors[p.status]}>{statusLabels[p.status]}</Badge></TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center py-12 text-muted-foreground">Không có dữ liệu</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PayrollReport;
