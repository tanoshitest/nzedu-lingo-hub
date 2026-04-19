import { useState } from 'react';
import { Plus, BookOpen, Pencil, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { courses as mockCourses, type Course, formatVND } from '@/data/mockFinance';
import SyllabusDesigner from '../syllabus/SyllabusDesigner';
import SyllabusViewer from '../syllabus/SyllabusViewer';
import { syllabusStatusColors, syllabusStatusLabels } from '@/data/mockSyllabus';

const AdminCourses = () => {
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [designerOpen, setDesignerOpen] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);
  const [viewing, setViewing] = useState<Course | null>(null);

  const openNew = () => { setEditing(null); setDesignerOpen(true); };
  const openEdit = (c: Course) => { setEditing(c); setDesignerOpen(true); setViewing(null); };

  const handleSave = (payload: { code: string; name: string; tuition: number; sessions: number; syllabus: any }) => {
    if (editing) {
      const updated: Course = { ...editing, ...payload };
      setCourses(courses.map((c) => c.id === editing.id ? updated : c));
      toast.success('Đã cập nhật giáo trình khóa học');
    } else {
      const c: Course = {
        id: `C-${payload.code}`,
        code: payload.code,
        name: payload.name,
        tuition: payload.tuition,
        sessions: payload.sessions,
        lessons: [],
        syllabus: payload.syllabus,
      };
      setCourses([c, ...courses]);
      toast.success('Đã tạo khóa học mới với giáo trình đầy đủ');
    }
    setDesignerOpen(false);
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-sm text-muted-foreground">Quản lý danh mục khóa học và thiết kế giáo trình IELTS chi tiết.</p>
        </div>
        <Button onClick={openNew} className="gradient-hero gap-2">
          <Plus className="h-4 w-4" /> Thêm khóa học
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((c) => (
          <Card key={c.id} className="border-border/60 hover:shadow-elegant transition-shadow cursor-pointer" onClick={() => setViewing(c)}>
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <CardTitle className="text-base truncate">{c.name}</CardTitle>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">{c.code}</Badge>
                    {c.syllabus && (
                      <>
                        <Badge variant="outline">{c.syllabus.overview.variant}</Badge>
                        <Badge variant="outline">→ {c.syllabus.overview.targetBandOut}</Badge>
                        <Badge variant="outline" className={syllabusStatusColors[c.syllabus.status]}>{syllabusStatusLabels[c.syllabus.status]}</Badge>
                      </>
                    )}
                    {!c.syllabus && <Badge variant="outline" className="bg-muted text-muted-foreground border-border">Chưa có giáo trình</Badge>}
                  </div>
                </div>
                <div className="h-10 w-10 rounded-lg gradient-hero flex items-center justify-center flex-shrink-0">
                  <BookOpen className="h-5 w-5 text-primary-foreground" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Học phí</span><span className="font-semibold">{formatVND(c.tuition)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Số buổi</span><span>{c.syllabus?.sessions.length ?? c.sessions}</span></div>
              {c.syllabus && (
                <div className="flex justify-between"><span className="text-muted-foreground">Thời lượng</span><span>{c.syllabus.overview.totalWeeks} tuần × {c.syllabus.overview.sessionsPerWeek} buổi</span></div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Designer */}
      <SyllabusDesigner
        open={designerOpen}
        initial={editing ? { code: editing.code, name: editing.name, tuition: editing.tuition, sessions: editing.sessions, syllabus: editing.syllabus } : null}
        onSave={handleSave}
        onClose={() => { setDesignerOpen(false); setEditing(null); }}
      />

      {/* Viewer */}
      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between gap-2 flex-wrap">
              <span>{viewing?.name}</span>
              {viewing && (
                <Button variant="outline" size="sm" className="gap-2" onClick={() => openEdit(viewing)}>
                  <Pencil className="h-4 w-4" /> {viewing.syllabus ? 'Chỉnh sửa giáo trình' : 'Tạo giáo trình'}
                </Button>
              )}
            </DialogTitle>
          </DialogHeader>
          {viewing && viewing.syllabus ? (
            <SyllabusViewer syllabus={viewing.syllabus} courseName={viewing.name} courseCode={viewing.code} />
          ) : viewing ? (
            <div className="text-center py-10 text-muted-foreground">
              <FileText className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p>Khóa học này chưa có giáo trình chi tiết.</p>
              <p className="text-xs">Bấm "Tạo giáo trình" để bắt đầu thiết kế syllabus IELTS đầy đủ.</p>
            </div>
          ) : null}
          <DialogFooter><Button variant="outline" onClick={() => setViewing(null)}>Đóng</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCourses;
