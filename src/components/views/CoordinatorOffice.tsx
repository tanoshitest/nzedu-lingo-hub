import { useState } from 'react';
import { Plus, Printer, Wrench, FileText, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

type OfficeType = 'Print' | 'Tech' | 'Material';
type OfficeStatus = 'Pending' | 'Processing' | 'Done';

interface OfficeRequest {
  id: string; type: OfficeType; title: string; requester: string; room?: string; quantity?: number; createdAt: string; note?: string; status: OfficeStatus;
}

const typeLabels: Record<OfficeType, string> = { Print: 'In tài liệu', Tech: 'Hỗ trợ kỹ thuật', Material: 'Cung cấp tài liệu' };
const typeIcons: Record<OfficeType, any> = { Print: Printer, Tech: Wrench, Material: FileText };
const statusLabels: Record<OfficeStatus, string> = { Pending: 'Chờ xử lý', Processing: 'Đang xử lý', Done: 'Hoàn thành' };
const statusColors: Record<OfficeStatus, string> = {
  Pending: 'bg-warning/10 text-warning border-warning/20',
  Processing: 'bg-info/10 text-info border-info/20',
  Done: 'bg-success/10 text-success border-success/20',
};

const seedRequests: OfficeRequest[] = [
  { id: 'OF001', type: 'Print', title: 'In 15 bộ Cambridge 17 - Test 4', requester: 'Lê Hoàng Cường', quantity: 15, createdAt: '17/04/2026', status: 'Processing' },
  { id: 'OF002', type: 'Tech', title: 'Máy chiếu phòng 302 không kết nối HDMI', requester: 'Phạm Mai Dung', room: 'Phòng 302', createdAt: '18/04/2026', status: 'Pending' },
  { id: 'OF003', type: 'Material', title: 'Cần 20 bộ flashcard từ vựng TOEIC', requester: 'Bùi Lan Khanh', quantity: 20, createdAt: '15/04/2026', status: 'Done' },
  { id: 'OF004', type: 'Print', title: 'In hand-out Speaking Part 2', requester: 'Lê Hoàng Cường', quantity: 12, createdAt: '18/04/2026', status: 'Pending' },
];

const CoordinatorOffice = () => {
  const [requests, setRequests] = useState<OfficeRequest[]>(seedRequests);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ type: 'Print' as OfficeType, title: '', room: '', quantity: '', note: '' });

  const updateStatus = (id: string, status: OfficeStatus) => {
    setRequests(requests.map((r) => r.id === id ? { ...r, status } : r));
    toast.success(`Đã cập nhật: ${statusLabels[status]}`);
  };

  const addRequest = () => {
    if (!form.title) {
      toast.error('Vui lòng nhập tiêu đề');
      return;
    }
    const now = new Date();
    const newItem: OfficeRequest = {
      id: `OF${Math.floor(Math.random() * 9000 + 1000)}`,
      type: form.type, title: form.title, requester: 'Trần Thị Bình',
      room: form.room || undefined, quantity: form.quantity ? Number(form.quantity) : undefined,
      note: form.note, status: 'Pending',
      createdAt: `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`,
    };
    setRequests([newItem, ...requests]);
    setForm({ type: 'Print', title: '', room: '', quantity: '', note: '' });
    setOpen(false);
    toast.success('Đã tạo yêu cầu văn phòng');
  };

  const byType = (t: OfficeType) => requests.filter((r) => r.type === t);

  const renderTable = (list: OfficeRequest[]) => (
    <Card className="border-border/60 mt-4"><CardContent className="p-0">
      <Table>
        <TableHeader><TableRow>
          <TableHead>Yêu cầu</TableHead>
          <TableHead className="hidden md:table-cell">Người yêu cầu</TableHead>
          <TableHead className="hidden sm:table-cell">Ngày</TableHead>
          <TableHead>Trạng thái</TableHead>
          <TableHead className="text-right">Hành động</TableHead>
        </TableRow></TableHeader>
        <TableBody>
          {list.map((r) => {
            const Icon = typeIcons[r.type];
            return (
              <TableRow key={r.id}>
                <TableCell>
                  <div className="flex items-start gap-2">
                    <Icon className="h-4 w-4 text-primary mt-0.5" />
                    <div>
                      <div className="font-medium">{r.title}</div>
                      {r.quantity && <div className="text-xs text-muted-foreground">Số lượng: {r.quantity}</div>}
                      {r.room && <div className="text-xs text-muted-foreground">{r.room}</div>}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell text-sm">{r.requester}</TableCell>
                <TableCell className="hidden sm:table-cell text-sm">{r.createdAt}</TableCell>
                <TableCell><Badge variant="outline" className={statusColors[r.status]}>{statusLabels[r.status]}</Badge></TableCell>
                <TableCell className="text-right">
                  {r.status === 'Pending' && <Button size="sm" onClick={() => updateStatus(r.id, 'Processing')}>Bắt đầu</Button>}
                  {r.status === 'Processing' && <Button size="sm" onClick={() => updateStatus(r.id, 'Done')} className="gap-1"><Check className="h-3.5 w-3.5" /> Hoàn thành</Button>}
                </TableCell>
              </TableRow>
            );
          })}
          {list.length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-12 text-muted-foreground">Không có yêu cầu</TableCell></TableRow>}
        </TableBody>
      </Table>
    </CardContent></Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Quản lý yêu cầu in ấn, tài liệu và hỗ trợ kỹ thuật phòng học.</p>
        </div>
        <Button onClick={() => setOpen(true)} className="gradient-hero gap-2"><Plus className="h-4 w-4" /> Yêu cầu mới</Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Tất cả ({requests.length})</TabsTrigger>
          <TabsTrigger value="print">In ấn ({byType('Print').length})</TabsTrigger>
          <TabsTrigger value="tech">Kỹ thuật ({byType('Tech').length})</TabsTrigger>
          <TabsTrigger value="material">Tài liệu ({byType('Material').length})</TabsTrigger>
        </TabsList>
        <TabsContent value="all">{renderTable(requests)}</TabsContent>
        <TabsContent value="print">{renderTable(byType('Print'))}</TabsContent>
        <TabsContent value="tech">{renderTable(byType('Tech'))}</TabsContent>
        <TabsContent value="material">{renderTable(byType('Material'))}</TabsContent>
      </Tabs>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Tạo yêu cầu văn phòng</DialogTitle><DialogDescription>Ghi nhận các việc hậu cần cần xử lý.</DialogDescription></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label>Loại</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as OfficeType })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{Object.entries(typeLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Tiêu đề</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label>Số lượng</Label><Input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} /></div>
              <div className="space-y-2"><Label>Phòng (nếu có)</Label><Input value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} placeholder="Phòng 302" /></div>
            </div>
            <div className="space-y-2"><Label>Ghi chú</Label><Textarea rows={3} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Hủy</Button><Button onClick={addRequest} className="gradient-hero">Tạo</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CoordinatorOffice;
