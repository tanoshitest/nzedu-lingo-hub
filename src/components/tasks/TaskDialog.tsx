import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { type Task, type TaskCategory, type TaskPriority, taskCategoryLabels, taskPriorityLabels } from '@/data/mockTasks';
import { users } from '@/data/mockData';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Filter assignee dropdown by these roles. If empty/undefined → allow all */
  allowedAssigneeRoles?: Array<'Quản trị viên' | 'Giáo vụ' | 'Giáo viên' | 'Học viên'>;
  assignerId: string;
  defaultCategory?: TaskCategory;
  title?: string;
  description?: string;
  onCreate: (task: Task) => void;
}

const TaskDialog = ({
  open, onOpenChange, allowedAssigneeRoles, assignerId, defaultCategory = 'Admin',
  title = 'Giao việc mới', description = 'Tạo và phân công công việc trong hệ thống.', onCreate,
}: Props) => {
  const [form, setForm] = useState({
    title: '', desc: '', category: defaultCategory as TaskCategory,
    assigneeId: '', deadline: '', priority: 'Normal' as TaskPriority,
  });

  const assigneeOptions = allowedAssigneeRoles?.length
    ? users.filter((u) => allowedAssigneeRoles.includes(u.role))
    : users;

  const reset = () => setForm({ title: '', desc: '', category: defaultCategory, assigneeId: '', deadline: '', priority: 'Normal' });

  const handleSubmit = () => {
    if (!form.title || !form.assigneeId || !form.deadline) {
      toast.error('Vui lòng điền đầy đủ tiêu đề, người thực hiện và hạn chót');
      return;
    }
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yy = today.getFullYear();
    const newTask: Task = {
      id: `T${Math.floor(Math.random() * 9000 + 1000)}`,
      title: form.title,
      description: form.desc,
      category: form.category,
      assignerId,
      assigneeId: form.assigneeId,
      createdAt: `${dd}/${mm}/${yy}`,
      deadline: form.deadline,
      status: 'Pending',
      priority: form.priority,
    };
    onCreate(newTask);
    toast.success('Đã giao việc thành công');
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Tiêu đề</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Nhập tiêu đề công việc..." />
          </div>
          <div className="space-y-2">
            <Label>Mô tả</Label>
            <Textarea rows={3} value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} placeholder="Mô tả chi tiết..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Loại công việc</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v as TaskCategory })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(taskCategoryLabels).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Mức ưu tiên</Label>
              <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v as TaskPriority })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(taskPriorityLabels).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Người thực hiện</Label>
            <Select value={form.assigneeId} onValueChange={(v) => setForm({ ...form, assigneeId: v })}>
              <SelectTrigger><SelectValue placeholder="Chọn người thực hiện..." /></SelectTrigger>
              <SelectContent>
                {assigneeOptions.map((u) => (
                  <SelectItem key={u.id} value={u.id}>{u.name} — {u.role}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Hạn chót</Label>
            <Input type="text" placeholder="dd/mm/yyyy" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
          <Button onClick={handleSubmit} className="gradient-hero">Giao việc</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;
