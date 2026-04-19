import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2 } from 'lucide-react';
import type { CourseMaterial, SessionPlan, SessionSkillFocus } from '@/data/mockSyllabus';

const SKILL_OPTIONS: SessionSkillFocus[] = ['Listening', 'Reading', 'Writing', 'Speaking', 'Vocabulary', 'Grammar', 'MockTest', 'Review'];

interface Props {
  open: boolean;
  session: SessionPlan | null;
  sessionsPerWeek: number;
  materials: CourseMaterial[];
  onSave: (s: SessionPlan) => void;
  onClose: () => void;
}

const SessionPlanDialog = ({ open, session, sessionsPerWeek, materials, onSave, onClose }: Props) => {
  const [form, setForm] = useState<SessionPlan | null>(session);
  const [objInput, setObjInput] = useState('');

  useEffect(() => {
    setForm(session);
    setObjInput('');
  }, [session?.id]);

  if (!form) return null;

  const toggleSkill = (s: SessionSkillFocus) => {
    const next = form.skillFocus.includes(s) ? form.skillFocus.filter((x) => x !== s) : [...form.skillFocus, s];
    setForm({ ...form, skillFocus: next });
  };

  const toggleMaterial = (mid: string) => {
    const next = form.materialIds.includes(mid) ? form.materialIds.filter((x) => x !== mid) : [...form.materialIds, mid];
    setForm({ ...form, materialIds: next });
  };

  const weekFromOrder = (order: number) => Math.floor((order - 1) / sessionsPerWeek) + 1;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Chỉnh sửa buổi học — Buổi {form.order}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1 col-span-2"><Label>Tiêu đề buổi học</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div className="space-y-1"><Label>Thời lượng (phút)</Label><Input type="number" value={form.durationMinutes} onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })} /></div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1"><Label>Thứ tự</Label><Input type="number" value={form.order} onChange={(e) => {
              const order = Number(e.target.value);
              setForm({ ...form, order, weekNumber: weekFromOrder(order) });
            }} /></div>
            <div className="space-y-1"><Label>Tuần</Label><Input type="number" value={form.weekNumber} onChange={(e) => setForm({ ...form, weekNumber: Number(e.target.value) })} /></div>
          </div>

          <div className="space-y-1">
            <Label>Kỹ năng trọng tâm</Label>
            <div className="flex flex-wrap gap-2">
              {SKILL_OPTIONS.map((s) => (
                <label key={s} className="flex items-center gap-1.5 rounded-md border border-border/60 px-2 py-1 cursor-pointer">
                  <Checkbox checked={form.skillFocus.includes(s)} onCheckedChange={() => toggleSkill(s)} />
                  <span className="text-xs">{s}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <Label>Mục tiêu buổi (CAN-DO)</Label>
            <div className="space-y-1">
              {form.objectives.map((o, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input value={o} onChange={(e) => setForm({ ...form, objectives: form.objectives.map((x, j) => j === i ? e.target.value : x) })} />
                  <Button variant="ghost" size="icon" onClick={() => setForm({ ...form, objectives: form.objectives.filter((_, j) => j !== i) })}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input placeholder="Thêm mục tiêu..." value={objInput} onChange={(e) => setObjInput(e.target.value)} />
              <Button size="sm" onClick={() => { if (objInput.trim()) { setForm({ ...form, objectives: [...form.objectives, objInput.trim()] }); setObjInput(''); }}}><Plus className="h-3.5 w-3.5" /></Button>
            </div>
          </div>

          <div className="space-y-1">
            <Label>Hoạt động trên lớp</Label>
            <Textarea rows={3} value={form.inClassActivities} onChange={(e) => setForm({ ...form, inClassActivities: e.target.value })} />
          </div>

          <div className="space-y-1">
            <Label>Học liệu sử dụng</Label>
            <div className="flex flex-wrap gap-2">
              {materials.map((m) => (
                <Badge key={m.id} variant="outline" onClick={() => toggleMaterial(m.id)}
                  className={`cursor-pointer ${form.materialIds.includes(m.id) ? 'bg-primary/10 text-primary border-primary/30' : ''}`}>
                  {m.title}
                </Badge>
              ))}
              {materials.length === 0 && <span className="text-xs text-muted-foreground">Chưa có học liệu — thêm ở tab Học liệu.</span>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1 col-span-2"><Label>Bài tập về nhà</Label><Textarea rows={2} value={form.homework.description} onChange={(e) => setForm({ ...form, homework: { ...form.homework, description: e.target.value } })} /></div>
            <div className="space-y-1"><Label>Ước tính (phút)</Label><Input type="number" value={form.homework.estimatedMinutes} onChange={(e) => setForm({ ...form, homework: { ...form.homework, estimatedMinutes: Number(e.target.value) } })} /></div>
          </div>

          <div className="space-y-1">
            <Label>Đánh giá (tuỳ chọn)</Label>
            <div className="grid grid-cols-3 gap-3">
              <Select value={form.assessment?.type ?? 'none'} onValueChange={(v) => setForm({ ...form, assessment: v === 'none' ? undefined : { type: v as any, weight: form.assessment?.weight ?? 0 } })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Không có</SelectItem>
                  <SelectItem value="Quiz">Quiz</SelectItem>
                  <SelectItem value="MiniTest">Mini Test</SelectItem>
                  <SelectItem value="MockTest">Mock Test</SelectItem>
                </SelectContent>
              </Select>
              {form.assessment && (
                <Input type="number" placeholder="Trọng số (%)" value={form.assessment.weight}
                  onChange={(e) => setForm({ ...form, assessment: { ...form.assessment!, weight: Number(e.target.value) } })} />
              )}
            </div>
          </div>

          <div className="space-y-1">
            <Label>Ghi chú (tuỳ chọn)</Label>
            <Textarea rows={2} value={form.notes ?? ''} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Huỷ</Button>
          <Button onClick={() => onSave(form)}>Lưu buổi học</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SessionPlanDialog;
