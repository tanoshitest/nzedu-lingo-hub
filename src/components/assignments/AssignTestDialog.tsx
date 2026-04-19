import { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ieltsTests } from '@/data/mockIeltsTests';
import { studentsList } from '@/data/mockData';
import { attemptStore, type TestAssignment } from '@/data/mockTestAttempts';

interface Props {
  open: boolean;
  onClose: () => void;
  assignedBy: string;
  assignedByRole: 'Coordinator' | 'Teacher';
}

const TODAY = new Date().toISOString().slice(0, 10);
const PLUS_7 = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);

const AssignTestDialog = ({ open, onClose, assignedBy, assignedByRole }: Props) => {
  const publishedTests = useMemo(() => ieltsTests.filter((t) => t.status === 'Published'), []);
  const [testId, setTestId] = useState('');
  const [mode, setMode] = useState<'class' | 'individual'>('class');
  const [classId, setClassId] = useState('CL-A1');
  const [studentIds, setStudentIds] = useState<string[]>([]);
  const [openAt, setOpenAt] = useState(TODAY);
  const [dueAt, setDueAt] = useState(PLUS_7);
  const [duration, setDuration] = useState(60);
  const [instructions, setInstructions] = useState('');

  const test = publishedTests.find((t) => t.id === testId);

  useEffect(() => {
    if (test?.durationMinutes) setDuration(test.durationMinutes);
  }, [testId]);

  useEffect(() => {
    if (!open) {
      setTestId('');
      setMode('class');
      setClassId('CL-A1');
      setStudentIds([]);
      setOpenAt(TODAY);
      setDueAt(PLUS_7);
      setInstructions('');
    }
  }, [open]);

  const toggleStudent = (id: string) => {
    setStudentIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const submit = () => {
    if (!test) {
      toast.error('Vui lòng chọn đề thi');
      return;
    }
    const selectedStudents =
      mode === 'class'
        ? studentsList.map((s) => ({ id: s.id, name: s.name }))
        : studentsList.filter((s) => studentIds.includes(s.id)).map((s) => ({ id: s.id, name: s.name }));

    if (selectedStudents.length === 0) {
      toast.error('Vui lòng chọn ít nhất 1 học viên');
      return;
    }
    if (!openAt || !dueAt) {
      toast.error('Vui lòng chọn ngày mở và hạn nộp');
      return;
    }

    const a: TestAssignment = {
      id: `TA-${Date.now()}`,
      testId: test.id,
      testCode: test.code,
      testTitle: test.title,
      skills: test.skills,
      assignedBy,
      assignedByRole,
      classId: mode === 'class' ? classId : undefined,
      className: mode === 'class' ? 'IELTS 6.5 - Lớp A1' : undefined,
      studentIds: selectedStudents.map((s) => s.id),
      studentNames: selectedStudents.map((s) => s.name),
      openAt,
      dueAt,
      durationMinutes: duration,
      status: openAt <= TODAY ? 'Open' : 'Scheduled',
      instructions: instructions || undefined,
    };
    attemptStore.addAssignment(a, selectedStudents);
    toast.success(`Đã giao đề "${test.code}" cho ${selectedStudents.length} học viên`);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Giao đề thi cho học viên</DialogTitle>
          <DialogDescription>Chọn đề (đã Publish) và đối tượng nhận bài.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Đề thi *</Label>
            <Select value={testId} onValueChange={setTestId}>
              <SelectTrigger><SelectValue placeholder="Chọn đề thi đã xuất bản" /></SelectTrigger>
              <SelectContent>
                {publishedTests.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.code} — {t.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {test && (
              <div className="flex flex-wrap gap-1 mt-1">
                {test.skills.map((s) => (
                  <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Đối tượng *</Label>
            <RadioGroup value={mode} onValueChange={(v) => setMode(v as 'class' | 'individual')} className="flex gap-6">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="class" id="r-class" />
                <Label htmlFor="r-class" className="font-normal cursor-pointer">Toàn lớp</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="individual" id="r-ind" />
                <Label htmlFor="r-ind" className="font-normal cursor-pointer">Học viên cụ thể</Label>
              </div>
            </RadioGroup>
          </div>

          {mode === 'class' ? (
            <div className="space-y-2">
              <Label>Lớp</Label>
              <Select value={classId} onValueChange={setClassId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="CL-A1">IELTS 6.5 - Lớp A1</SelectItem>
                  <SelectItem value="CL-A2">IELTS 6.5 - Lớp A2</SelectItem>
                  <SelectItem value="CL-A3">IELTS 7.0 - Lớp A3</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Sẽ giao cho tất cả {studentsList.length} học viên trong danh sách lớp.</p>
            </div>
          ) : (
            <div className="space-y-2">
              <Label>Chọn học viên ({studentIds.length} đã chọn)</Label>
              <div className="border border-border rounded-md p-3 max-h-44 overflow-y-auto space-y-2">
                {studentsList.map((s) => (
                  <label key={s.id} className="flex items-center gap-2 cursor-pointer text-sm">
                    <Checkbox checked={studentIds.includes(s.id)} onCheckedChange={() => toggleStudent(s.id)} />
                    <span>{s.name}</span>
                    <span className="text-xs text-muted-foreground">— {s.currentGrade}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label>Mở từ ngày *</Label>
              <Input type="date" value={openAt} onChange={(e) => setOpenAt(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Hạn nộp *</Label>
              <Input type="date" value={dueAt} onChange={(e) => setDueAt(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Thời gian (phút)</Label>
              <Input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value) || 0)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Hướng dẫn (tuỳ chọn)</Label>
            <Textarea rows={3} value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder="Lưu ý cho học viên trước khi làm bài..." />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Huỷ</Button>
          <Button onClick={submit}>Giao đề</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignTestDialog;
