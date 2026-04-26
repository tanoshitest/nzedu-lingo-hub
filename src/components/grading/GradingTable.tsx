import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { User, BookOpen, Clock, FileText } from 'lucide-react';

export interface GradingTask {
  id: string;
  studentName: string;
  assignmentName: string;
  className: string;
  submissionDate: string;
  type: 'Regular' | 'Exam';
  status: 'Pending' | 'In Progress' | 'Graded' | 'Unassigned';
  assignedTeacher?: string;
  priority?: 'High' | 'Medium' | 'Low';
}

interface GradingTableProps {
  tasks: GradingTask[];
  onSelectTasks?: (ids: string[]) => void;
  onAssign?: (taskId: string) => void;
  showCheckbox?: boolean;
  showAssignAction?: boolean;
}

export function GradingTable({
  tasks,
  onSelectTasks,
  onAssign,
  showCheckbox = false,
  showAssignAction = false,
}: GradingTableProps) {
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  const toggleSelect = (id: string) => {
    const newSelection = selectedIds.includes(id)
      ? selectedIds.filter((i) => i !== id)
      : [...selectedIds, id];
    setSelectedIds(newSelection);
    onSelectTasks?.(newSelection);
  };

  const getStatusBadge = (status: GradingTask['status']) => {
    switch (status) {
      case 'Pending':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Chờ chấm</Badge>;
      case 'In Progress':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Đang chấm</Badge>;
      case 'Graded':
        return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Đã chấm</Badge>;
      case 'Unassigned':
        return <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200">Chưa điều phối</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: GradingTask['type']) => {
    return type === 'Exam' 
      ? <Badge className="bg-purple-600">Bài thi</Badge>
      : <Badge variant="secondary">Bài tập</Badge>;
  };

  return (
    <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50/50">
          <TableRow>
            {showCheckbox && (
              <TableHead className="w-[50px]">
                <Checkbox 
                  checked={selectedIds.length === tasks.length && tasks.length > 0}
                  onCheckedChange={(checked) => {
                    const ids = checked ? tasks.map(t => t.id) : [];
                    setSelectedIds(ids);
                    onSelectTasks?.(ids);
                  }}
                />
              </TableHead>
            )}
            <TableHead>Học viên</TableHead>
            <TableHead>Bài tập / Lớp</TableHead>
            <TableHead>Ngày nộp</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Giáo viên chấm</TableHead>
            {showAssignAction && <TableHead className="text-right">Thao tác</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id} className="hover:bg-slate-50/50 transition-colors">
              {showCheckbox && (
                <TableCell>
                  <Checkbox 
                    checked={selectedIds.includes(task.id)}
                    onCheckedChange={() => toggleSelect(task.id)}
                  />
                </TableCell>
              )}
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                    <User size={16} />
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">{task.studentName}</div>
                    <div className="text-xs text-slate-500">ID: {task.id}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <FileText size={14} className="text-slate-400" />
                    <span className="font-medium text-slate-700">{task.assignmentName}</span>
                    {getTypeBadge(task.type)}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <BookOpen size={12} />
                    {task.className}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock size={14} className="text-slate-400" />
                  {task.submissionDate}
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(task.status)}</TableCell>
              <TableCell>
                <div className="text-sm text-slate-600 italic">
                  {task.assignedTeacher || 'Chưa gán'}
                </div>
              </TableCell>
              {showAssignAction && (
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                    onClick={() => onAssign?.(task.id)}
                  >
                    Điều phối
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
          {tasks.length === 0 && (
            <TableRow>
              <TableCell colSpan={showAssignAction ? 7 : 6} className="h-32 text-center text-slate-500">
                Không có dữ liệu bài tập.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
