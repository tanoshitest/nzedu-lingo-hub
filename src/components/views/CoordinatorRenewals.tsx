import { useState, useMemo } from 'react';
import { AlertTriangle, Bell, FileText, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { studentTuitions as mockTuitions, formatVND } from '@/data/mockFinance';

const months = ['04/2026', '05/2026', '06/2026'];

const CoordinatorRenewals = () => {
  const [tuitions] = useState(mockTuitions);
  const [filterMonth, setFilterMonth] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [threshold, setThreshold] = useState('3');

  const filtered = useMemo(() => {
    return tuitions.filter((t) => {
      const matchSearch = !search || t.studentName.toLowerCase().includes(search.toLowerCase());
      const matchThreshold = t.sessionsRemaining <= Number(threshold);
      const matchMonth = filterMonth === 'All' || (t.nextRenewalDue && t.nextRenewalDue.startsWith(filterMonth.split('/')[0]));
      return matchSearch && matchThreshold && matchMonth;
    });
  }, [tuitions, search, threshold, filterMonth]);

  const totalDebt = tuitions.reduce((s, t) => s + t.debt, 0);
  const debtors = tuitions.filter((t) => t.debt > 0);

  const remind = (name: string) => toast.success(`Đã gửi nhắc gia hạn tới ${name}`);
  const createRenewalRequest = (name: string) => toast.success(`Đã tạo yêu cầu gia hạn cho ${name} — gửi Admin duyệt`);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="border-warning/30 bg-warning/5"><CardContent className="p-4">
          <div className="flex items-center gap-2 text-xs text-warning"><AlertTriangle className="h-3.5 w-3.5" /> Học viên sắp hết buổi (≤ {threshold})</div>
          <div className="text-2xl font-bold mt-1 text-warning">{filtered.length}</div>
        </CardContent></Card>
        <Card className="border-destructive/30 bg-destructive/5"><CardContent className="p-4">
          <div className="text-xs text-destructive">HV còn công nợ</div>
          <div className="text-2xl font-bold mt-1 text-destructive">{debtors.length}</div>
        </CardContent></Card>
        <Card className="border-border/60"><CardContent className="p-4">
          <div className="text-xs text-muted-foreground">Tổng công nợ</div>
          <div className="text-2xl font-bold mt-1">{formatVND(totalDebt)}</div>
        </CardContent></Card>
      </div>

      <Card className="border-border/60">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="flex items-center gap-2 text-sm font-medium"><Filter className="h-4 w-4" /> Bộ lọc học phí</div>
          <Input className="max-w-xs" placeholder="Tìm tên học viên..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <Select value={filterMonth} onValueChange={setFilterMonth}>
            <SelectTrigger className="max-w-[160px]"><SelectValue placeholder="Tháng" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">Tất cả tháng</SelectItem>
              {months.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={threshold} onValueChange={setThreshold}>
            <SelectTrigger className="max-w-[200px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="3">Còn ≤ 3 buổi</SelectItem>
              <SelectItem value="5">Còn ≤ 5 buổi</SelectItem>
              <SelectItem value="10">Còn ≤ 10 buổi</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="border-border/60"><CardContent className="p-0">
        <Table>
          <TableHeader><TableRow>
            <TableHead>Học viên</TableHead>
            <TableHead className="hidden md:table-cell">Lớp</TableHead>
            <TableHead>Số buổi còn lại</TableHead>
            <TableHead className="hidden md:table-cell">Hạn gia hạn</TableHead>
            <TableHead>Công nợ</TableHead>
            <TableHead className="text-right">Hành động</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {filtered.map((t) => {
              const ratio = (t.sessionsRemaining / t.sessionsTotal) * 100;
              return (
                <TableRow key={t.studentId} className={t.sessionsRemaining <= 1 ? 'bg-destructive/5' : ''}>
                  <TableCell><div className="font-medium">{t.studentName}</div></TableCell>
                  <TableCell className="hidden md:table-cell text-sm">{t.className}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 max-w-[180px]">
                      <span className="font-bold text-warning">{t.sessionsRemaining}</span>
                      <span className="text-xs text-muted-foreground">/ {t.sessionsTotal}</span>
                      <Progress value={ratio} className="flex-1 h-2" />
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm">{t.nextRenewalDue ?? '—'}</TableCell>
                  <TableCell>
                    {t.debt > 0
                      ? <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">{formatVND(t.debt)}</Badge>
                      : <span className="text-sm text-muted-foreground">—</span>}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="sm" variant="outline" onClick={() => remind(t.studentName)} className="gap-1">
                        <Bell className="h-3.5 w-3.5" /> Nhắc
                      </Button>
                      <Button size="sm" onClick={() => createRenewalRequest(t.studentName)} className="gap-1">
                        <FileText className="h-3.5 w-3.5" /> Tạo gia hạn
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {filtered.length === 0 && <TableRow><TableCell colSpan={6} className="text-center py-12 text-muted-foreground">Không có học viên nào khớp bộ lọc</TableCell></TableRow>}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  );
};

export default CoordinatorRenewals;
