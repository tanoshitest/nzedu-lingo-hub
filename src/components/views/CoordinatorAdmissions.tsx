import { useState } from 'react';
import { Plus, UserPlus, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { consultations as mockConsultations, type ConsultationLog, consultationStatusColors, consultationStatusLabels, courses, formatVND } from '@/data/mockFinance';

const CoordinatorAdmissions = () => {
  const [list, setList] = useState<ConsultationLog[]>(mockConsultations);
  const [openNew, setOpenNew] = useState(false);
  const [convert, setConvert] = useState<ConsultationLog | null>(null);
  const [form, setForm] = useState({ name: '', phone: '', source: 'Facebook Ads', courseInterest: 'IELTS01', note: '' });
  const [convertForm, setConvertForm] = useState({ courseCode: 'IELTS01', sessions: '30' });

  const addProspect = () => {
    if (!form.name || !form.phone) {
      toast.error('Vui lòng điền họ tên và SĐT');
      return;
    }
    const now = new Date();
    const newItem: ConsultationLog = {
      id: `CS${Math.floor(Math.random() * 9000 + 1000)}`,
      prospectName: form.name, phone: form.phone, source: form.source,
      courseInterest: form.courseInterest, note: form.note,
      createdAt: `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`,
      status: 'New',
    };
    setList([newItem, ...list]);
    setForm({ name: '', phone: '', source: 'Facebook Ads', courseInterest: 'IELTS01', note: '' });
    setOpenNew(false);
    toast.success('Đã thêm vào sổ tư vấn');
  };

  const startConvert = (c: ConsultationLog) => {
    setConvert(c);
    setConvertForm({ courseCode: c.courseInterest, sessions: '30' });
  };

  const handleConvert = () => {
    if (!convert) return;
    setList(list.map((c) => c.id === convert.id ? { ...c, status: 'Converted' } : c));
    toast.success('Đã chuyển thành học viên — hóa đơn Draft đã được tạo, đang chờ Admin duyệt');
    setConvert(null);
  };

  const tuitionForCourse = courses.find((c) => c.code === convertForm.courseCode)?.tuition ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Quản lý sổ tư vấn và chuyển đổi thành học viên chính thức.</p>
        </div>
        <Button onClick={() => setOpenNew(true)} className="gradient-hero gap-2">
          <Plus className="h-4 w-4" /> Thêm khách tư vấn
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(['New', 'InProgress', 'Converted', 'Lost'] as const).map((s) => {
          const count = list.filter((l) => l.status === s).length;
          return (
            <Card key={s} className="border-border/60"><CardContent className="p-4">
              <div className="text-xs text-muted-foreground">{consultationStatusLabels[s]}</div>
              <div className="text-2xl font-bold mt-1">{count}</div>
            </CardContent></Card>
          );
        })}
      </div>

      <Card className="border-border/60"><CardContent className="p-0">
        <Table>
          <TableHeader><TableRow>
            <TableHead>Khách tư vấn</TableHead>
            <TableHead className="hidden md:table-cell">SĐT</TableHead>
            <TableHead className="hidden lg:table-cell">Nguồn</TableHead>
            <TableHead className="hidden md:table-cell">Khóa quan tâm</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="hidden sm:table-cell">Ngày</TableHead>
            <TableHead className="text-right">Hành động</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {list.map((c) => (
              <TableRow key={c.id}>
                <TableCell>
                  <div className="font-medium">{c.prospectName}</div>
                  <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{c.note}</div>
                </TableCell>
                <TableCell className="hidden md:table-cell text-sm">
                  <div className="flex items-center gap-1"><Phone className="h-3 w-3" /> {c.phone}</div>
                </TableCell>
                <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{c.source}</TableCell>
                <TableCell className="hidden md:table-cell"><Badge variant="outline">{c.courseInterest}</Badge></TableCell>
                <TableCell><Badge variant="outline" className={consultationStatusColors[c.status]}>{consultationStatusLabels[c.status]}</Badge></TableCell>
                <TableCell className="hidden sm:table-cell text-sm">{c.createdAt}</TableCell>
                <TableCell className="text-right">
                  {c.status !== 'Converted' && c.status !== 'Lost' && (
                    <Button size="sm" onClick={() => startConvert(c)} className="gap-1">
                      <UserPlus className="h-3.5 w-3.5" /> Chuyển HV
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>

      {/* Add prospect */}
      <Dialog open={openNew} onOpenChange={setOpenNew}>
        <DialogContent>
          <DialogHeader><DialogTitle>Thêm vào sổ tư vấn</DialogTitle><DialogDescription>Ghi nhận thông tin khách hàng mới tư vấn.</DialogDescription></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label>Họ tên</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div className="space-y-2"><Label>SĐT</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label>Nguồn</Label>
                <Select value={form.source} onValueChange={(v) => setForm({ ...form, source: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Facebook Ads">Facebook Ads</SelectItem>
                    <SelectItem value="Tiktok">Tiktok</SelectItem>
                    <SelectItem value="Website">Website</SelectItem>
                    <SelectItem value="Giới thiệu">Giới thiệu</SelectItem>
                    <SelectItem value="Khác">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Khóa quan tâm</Label>
                <Select value={form.courseInterest} onValueChange={(v) => setForm({ ...form, courseInterest: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{courses.map((c) => <SelectItem key={c.code} value={c.code}>{c.code} - {c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2"><Label>Ghi chú</Label><Textarea rows={3} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setOpenNew(false)}>Hủy</Button><Button onClick={addProspect} className="gradient-hero">Thêm</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Convert */}
      <Dialog open={!!convert} onOpenChange={(o) => !o && setConvert(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Chuyển thành học viên chính thức</DialogTitle><DialogDescription>{convert?.prospectName} — {convert?.phone}</DialogDescription></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label>Khóa học</Label>
              <Select value={convertForm.courseCode} onValueChange={(v) => setConvertForm({ ...convertForm, courseCode: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{courses.map((c) => <SelectItem key={c.code} value={c.code}>{c.code} - {c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Số buổi</Label><Input value={convertForm.sessions} onChange={(e) => setConvertForm({ ...convertForm, sessions: e.target.value })} /></div>
            <Card className="border-primary/30 bg-primary/5"><CardContent className="p-3">
              <div className="flex justify-between text-sm"><span>Học phí tạm tính:</span><span className="font-bold text-primary">{formatVND(tuitionForCourse)}</span></div>
              <div className="text-xs text-muted-foreground mt-1">Hóa đơn sẽ ở trạng thái Draft, gửi Admin duyệt.</div>
            </CardContent></Card>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setConvert(null)}>Hủy</Button><Button onClick={handleConvert} className="gradient-hero">Khởi tạo hóa đơn</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CoordinatorAdmissions;
