import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wallet, Clock, Calendar } from 'lucide-react';
import { payrollEntries, formatVND } from '@/data/mockFinance';

const TEACHER_ID = 'U003';
const months = ['04/2026', '03/2026'];

// Mock chi tiết các ca đã dạy (1.5h/ca)
interface SessionLog { id: string; date: string; className: string; time: string; type: 'Chủ nhiệm' | 'Dạy thay'; status: 'Đã dạy' | 'Vắng' }
const sessionLogs: Record<string, SessionLog[]> = {
  '04/2026': [
    { id: 'SE001', date: '02/04/2026', className: 'IELTS 6.5 - A1', time: '18:00 - 19:30', type: 'Chủ nhiệm', status: 'Đã dạy' },
    { id: 'SE002', date: '04/04/2026', className: 'IELTS 6.5 - A1', time: '18:00 - 19:30', type: 'Chủ nhiệm', status: 'Đã dạy' },
    { id: 'SE003', date: '07/04/2026', className: 'IELTS 7.0 - A3', time: '19:30 - 21:00', type: 'Dạy thay', status: 'Đã dạy' },
    { id: 'SE004', date: '09/04/2026', className: 'IELTS 6.5 - A1', time: '18:00 - 19:30', type: 'Chủ nhiệm', status: 'Đã dạy' },
    { id: 'SE005', date: '11/04/2026', className: 'IELTS 6.5 - A1', time: '18:00 - 19:30', type: 'Chủ nhiệm', status: 'Đã dạy' },
  ],
  '03/2026': [
    { id: 'SE100', date: '03/03/2026', className: 'IELTS 6.5 - A1', time: '18:00 - 19:30', type: 'Chủ nhiệm', status: 'Đã dạy' },
    { id: 'SE101', date: '05/03/2026', className: 'IELTS 6.5 - A1', time: '18:00 - 19:30', type: 'Chủ nhiệm', status: 'Đã dạy' },
  ],
};

const TeacherPayroll = () => {
  const [month, setMonth] = useState(months[0]);
  const myPayroll = payrollEntries.find((p) => p.teacherId === TEACHER_ID && p.month === month);
  const logs = sessionLogs[month] ?? [];

  return (
    <div className="space-y-6">
      <Card className="border-border/60">
        <CardContent className="p-4 flex items-center gap-3">
          <span className="text-sm font-medium">Bảng công tháng</span>
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="max-w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>{months.map((m) => <SelectItem key={m} value={m}>Tháng {m}</SelectItem>)}</SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="border-border/60"><CardContent className="p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground"><Calendar className="h-3.5 w-3.5" /> Số ca đã dạy</div>
          <div className="text-2xl font-bold mt-1">{myPayroll?.sessions ?? logs.length}</div>
          <div className="text-xs text-muted-foreground mt-1">(quy đổi 1.5h / ca)</div>
        </CardContent></Card>
        <Card className="border-border/60"><CardContent className="p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground"><Clock className="h-3.5 w-3.5" /> Đơn giá / ca</div>
          <div className="text-2xl font-bold mt-1">{formatVND(myPayroll?.ratePerSession ?? 0)}</div>
        </CardContent></Card>
        <Card className="border-primary/30 bg-primary/5"><CardContent className="p-4">
          <div className="flex items-center gap-2 text-xs text-primary"><Wallet className="h-3.5 w-3.5" /> Tổng lương dự kiến</div>
          <div className="text-2xl font-bold mt-1 text-primary">{formatVND(myPayroll?.total ?? 0)}</div>
          {myPayroll && (
            <Badge variant="outline" className="mt-2">
              {myPayroll.status === 'Pending' ? 'Chờ Admin duyệt' : myPayroll.status === 'Approved' ? 'Đã duyệt' : 'Đã thanh toán'}
            </Badge>
          )}
        </CardContent></Card>
      </div>

      <Card className="border-border/60">
        <CardHeader><CardTitle>Chi tiết ca dạy</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Ngày</TableHead>
              <TableHead>Lớp</TableHead>
              <TableHead>Giờ</TableHead>
              <TableHead>Loại</TableHead>
              <TableHead>Trạng thái</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {logs.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{s.date}</TableCell>
                  <TableCell className="font-medium">{s.className}</TableCell>
                  <TableCell className="text-sm">{s.time}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={s.type === 'Chủ nhiệm' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-warning/10 text-warning border-warning/20'}>
                      {s.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={s.status === 'Đã dạy' ? 'bg-success/10 text-success border-success/20' : 'bg-muted text-muted-foreground'}>{s.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
              {logs.length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-12 text-muted-foreground">Không có dữ liệu tháng này</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherPayroll;
