import { useState } from 'react';
import { Plus, BookOpen, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { courses as mockCourses, type Course, type Lesson, formatVND } from '@/data/mockFinance';

const AdminCourses = () => {
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [openNew, setOpenNew] = useState(false);
  const [selected, setSelected] = useState<Course | null>(null);
  const [form, setForm] = useState({ code: '', name: '', tuition: '', sessions: '' });
  const [newLesson, setNewLesson] = useState('');

  const addCourse = () => {
    if (!form.code || !form.name || !form.tuition) {
      toast.error('Vui lòng điền đầy đủ thông tin khóa học');
      return;
    }
    const c: Course = {
      id: `C-${form.code}`, code: form.code, name: form.name,
      tuition: Number(form.tuition), sessions: Number(form.sessions) || 30,
      lessons: [],
    };
    setCourses([c, ...courses]);
    setForm({ code: '', name: '', tuition: '', sessions: '' });
    setOpenNew(false);
    toast.success('Đã thêm khóa học');
  };

  const addLesson = () => {
    if (!selected || !newLesson) return;
    const next: Lesson = { id: `L${String(selected.lessons.length + 1).padStart(2, '0')}`, order: selected.lessons.length + 1, title: newLesson };
    const updated = { ...selected, lessons: [...selected.lessons, next] };
    setCourses(courses.map((c) => c.id === selected.id ? updated : c));
    setSelected(updated);
    setNewLesson('');
    toast.success('Đã thêm lesson');
  };

  const removeLesson = (lessonId: string) => {
    if (!selected) return;
    const updated = { ...selected, lessons: selected.lessons.filter((l) => l.id !== lessonId) };
    setCourses(courses.map((c) => c.id === selected.id ? updated : c));
    setSelected(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Quản lý danh mục khóa học và khung chương trình từng Lesson.</p>
        </div>
        <Button onClick={() => setOpenNew(true)} className="gradient-hero gap-2">
          <Plus className="h-4 w-4" /> Thêm khóa học
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((c) => (
          <Card key={c.id} className="border-border/60 hover:shadow-elegant transition-shadow cursor-pointer" onClick={() => setSelected(c)}>
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle className="text-base">{c.name}</CardTitle>
                  <Badge variant="outline" className="mt-1 bg-primary/10 text-primary border-primary/20">{c.code}</Badge>
                </div>
                <div className="h-10 w-10 rounded-lg gradient-hero flex items-center justify-center flex-shrink-0">
                  <BookOpen className="h-5 w-5 text-primary-foreground" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Học phí</span><span className="font-semibold">{formatVND(c.tuition)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Số buổi</span><span>{c.sessions}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Lessons</span><span>{c.lessons.length}</span></div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add course */}
      <Dialog open={openNew} onOpenChange={setOpenNew}>
        <DialogContent>
          <DialogHeader><DialogTitle>Thêm khóa học mới</DialogTitle><DialogDescription>Tạo khóa học cho hệ thống.</DialogDescription></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label>Mã khóa</Label><Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="IELTS03" /></div>
              <div className="space-y-2"><Label>Số buổi</Label><Input type="number" value={form.sessions} onChange={(e) => setForm({ ...form, sessions: e.target.value })} placeholder="30" /></div>
            </div>
            <div className="space-y-2"><Label>Tên khóa</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="IELTS Advanced 7.0" /></div>
            <div className="space-y-2"><Label>Học phí (VNĐ)</Label><Input type="number" value={form.tuition} onChange={(e) => setForm({ ...form, tuition: e.target.value })} placeholder="9500000" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenNew(false)}>Hủy</Button>
            <Button onClick={addCourse} className="gradient-hero">Thêm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Course detail */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selected?.name}</DialogTitle>
            <DialogDescription>{selected?.code} • {formatVND(selected?.tuition ?? 0)} • {selected?.sessions} buổi</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 max-h-96 overflow-y-auto">
            <Label>Khung chương trình</Label>
            {selected?.lessons.map((l) => (
              <div key={l.id} className="flex items-center gap-2 p-2 rounded-md border border-border/60">
                <Badge variant="outline">{l.order}</Badge>
                <span className="flex-1 text-sm">{l.title}</span>
                <Button variant="ghost" size="icon" onClick={() => removeLesson(l.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            ))}
            {selected?.lessons.length === 0 && <div className="text-sm text-muted-foreground py-4 text-center">Chưa có lesson nào</div>}
            <div className="flex gap-2 pt-2">
              <Input placeholder="Lesson mới..." value={newLesson} onChange={(e) => setNewLesson(e.target.value)} />
              <Button onClick={addLesson}>Thêm</Button>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setSelected(null)}>Đóng</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCourses;
