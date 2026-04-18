import { useState, useMemo } from 'react';
import { Wallet, AlertCircle, CheckCircle2, Download, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { invoices, studentTuitions, formatVND, invoiceStatusColors, invoiceStatusLabels, courses } from '@/data/mockFinance';
import { tuitionHistory } from '@/data/mockReports';

const TuitionReport = () => {
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filtered = useMemo(() => invoices.filter((i) =>
    (courseFilter === 'all' || i.courseCode === courseFilter) &&
    (typeFilter === 'all' || i.type === typeFilter)
  ), [courseFilter, typeFilter]);

  const collected = filtered.filter((i) => i.status === 'Paid').reduce((s, i) => s + i.amount, 0);
  const pending = filtered.filter((i) => i.status === 'Pending' || i.status === 'Approved').reduce((s, i) => s + i.amount, 0);
  const totalDebt = studentTuitions.reduce((s, t) => s + t.debt, 0);
  const debtors = studentTuitions.filter((t) => t.debt > 0);

  const total = collected + pending || 1;
  const collectedPct = (collected / total) * 100;

  const maxBar = Math.max(...tuitionHistory.map((m) => m.collected + m.pending));
  const handleExport = () => toast.success('Đã xuất báo cáo Excel (mock)');

  return (
    <div className="space-y-6">
      {/* KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="border-border/60"><CardContent className="p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground"><CheckCircle2 className="h-3.5 w-3.5 text-success" /> Đã thu</div>
          <div className="text-2xl font-bold mt-1 text-success">{formatVND(collected)}</div>
          <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-success rounded-full" style={{ width: `${collectedPct}%` }} />
          </div>
          <div className="text-xs text-muted-foreground mt-1">{collectedPct.toFixed(1)}% tổng</div>
        </CardContent></Card>
        <Card className="border-border/60"><CardContent className="p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground"><Wallet className="h-3.5 w-3.5 text-warning" /> Chưa thu</div>
          <div className="text-2xl font-bold mt-1 text-warning">{formatVND(pending)}</div>
          <div className="text-xs text-muted-foreground mt-1">Hóa đơn chờ duyệt + đã duyệt chưa thu</div>
        </CardContent></Card>
        <Card className="border-border/60"><CardContent className="p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground"><AlertCircle className="h-3.5 w-3.5 text-destructive" /> Công nợ HV</div>
          <div className="text-2xl font-bold mt-1 text-destructive">{formatVND(totalDebt)}</div>
          <div className="text-xs text-muted-foreground mt-1">{debtors.length} học viên</div>
        </CardContent></Card>
      </div>

      {/* Bar chart */}
      <Card className="border-border/60">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <CardTitle className="font-display text-base">Doanh thu học phí 6 tháng gần nhất</CardTitle>
              <p className="text-sm text-muted-foreground">Đã thu (xanh) vs Chưa thu (vàng)</p>
            </div>
            <Badge variant="outline" className="bg-success/10 text-success border-success/20 gap-1">
              <TrendingUp className="h-3 w-3" /> Tăng trưởng
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-3 sm:gap-4 h-56 pt-4">
            {tuitionHistory.map((m) => {
              const total = m.collected + m.pending;
              const totalH = (total / maxBar) * 100;
              const collectedH = (m.collected / total) * 100;
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full flex-1 flex items-end relative">
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition text-xs bg-popover border border-border rounded px-2 py-1 whitespace-nowrap z-10">
                      <div className="font-semibold">{(total / 1_000_000).toFixed(0)}M</div>
                      <div className="text-success">Thu: {(m.collected / 1_000_000).toFixed(0)}M</div>
                      <div className="text-warning">Chưa: {(m.pending / 1_000_000).toFixed(0)}M</div>
                    </div>
                    <div className="w-full rounded-t-md overflow-hidden flex flex-col" style={{ height: `${totalH}%` }}>
                      <div className="w-full bg-warning/70" style={{ height: `${100 - collectedH}%` }} />
                      <div className="w-full bg-success" style={{ height: `${collectedH}%` }} />
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground font-medium">{m.month}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="invoices">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <TabsList>
            <TabsTrigger value="invoices">Danh sách hóa đơn</TabsTrigger>
            <TabsTrigger value="debt">Công nợ HV ({debtors.length})</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Select value={courseFilter} onValueChange={setCourseFilter}>
              <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả khóa</SelectItem>
                {courses.map((c) => <SelectItem key={c.code} value={c.code}>{c.code}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại</SelectItem>
                <SelectItem value="New">Mới</SelectItem>
                <SelectItem value="Renewal">Gia hạn</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
              <Download className="h-4 w-4" /> Xuất Excel
            </Button>
          </div>
        </div>

        <TabsContent value="invoices" className="mt-4">
          <Card className="border-border/60">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã HĐ</TableHead>
                    <TableHead>Học viên</TableHead>
                    <TableHead className="hidden md:table-cell">Khóa</TableHead>
                    <TableHead>Loại</TableHead>
                    <TableHead className="text-right">Số tiền</TableHead>
                    <TableHead className="hidden md:table-cell">Ngày</TableHead>
                    <TableHead>Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((i) => (
                    <TableRow key={i.id}>
                      <TableCell className="font-mono text-xs">{i.id}</TableCell>
                      <TableCell className="font-medium">{i.studentName}</TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">{i.courseCode}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={i.type === 'New' ? 'bg-info/10 text-info border-info/20' : 'bg-primary/10 text-primary border-primary/20'}>
                          {i.type === 'New' ? 'Mới' : 'Gia hạn'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold">{formatVND(i.amount)}</TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{i.issuedAt}</TableCell>
                      <TableCell><Badge variant="outline" className={invoiceStatusColors[i.status]}>{invoiceStatusLabels[i.status]}</Badge></TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow><TableCell colSpan={7} className="text-center py-12 text-muted-foreground">Không có hóa đơn</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="debt" className="mt-4">
          <Card className="border-border/60">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Học viên</TableHead>
                    <TableHead>Lớp</TableHead>
                    <TableHead className="text-right">Buổi còn lại</TableHead>
                    <TableHead className="hidden md:table-cell">Hạn gia hạn</TableHead>
                    <TableHead className="text-right">Công nợ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {debtors.map((t) => (
                    <TableRow key={t.studentId}>
                      <TableCell className="font-medium">{t.studentName}</TableCell>
                      <TableCell>{t.className}</TableCell>
                      <TableCell className="text-right">{t.sessionsRemaining}/{t.sessionsTotal}</TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{t.nextRenewalDue ?? '—'}</TableCell>
                      <TableCell className="text-right font-semibold text-destructive">{formatVND(t.debt)}</TableCell>
                    </TableRow>
                  ))}
                  {debtors.length === 0 && (
                    <TableRow><TableCell colSpan={5} className="text-center py-12 text-muted-foreground">Không có công nợ</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TuitionReport;
