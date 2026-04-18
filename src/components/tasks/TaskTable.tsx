import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Eye } from 'lucide-react';
import TaskStatusBadge from './TaskStatusBadge';
import { taskCategoryLabels, taskPriorityLabels, type Task } from '@/data/mockTasks';
import { users } from '@/data/mockData';

const priorityColors: Record<string, string> = {
  Low: 'bg-muted text-muted-foreground border-border',
  Normal: 'bg-info/10 text-info border-info/20',
  High: 'bg-destructive/10 text-destructive border-destructive/20',
};

const userName = (id: string) => users.find((u) => u.id === id)?.name ?? id;

interface Props {
  tasks: Task[];
  showAssigner?: boolean;
  showAssignee?: boolean;
  emptyText?: string;
  onView?: (task: Task) => void;
  extraAction?: (task: Task) => React.ReactNode;
}

const TaskTable = ({ tasks, showAssigner = true, showAssignee = true, emptyText = 'Chưa có công việc nào', onView, extraAction }: Props) => {
  return (
    <Card className="border-border/60">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Công việc</TableHead>
              <TableHead className="hidden md:table-cell">Loại</TableHead>
              {showAssigner && <TableHead className="hidden lg:table-cell">Người giao</TableHead>}
              {showAssignee && <TableHead className="hidden lg:table-cell">Người thực hiện</TableHead>}
              <TableHead className="hidden sm:table-cell">Hạn chót</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="hidden md:table-cell">Ưu tiên</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((t) => (
              <TableRow key={t.id} className={t.status === 'Late' ? 'bg-destructive/5' : ''}>
                <TableCell>
                  <div className="flex items-start gap-2">
                    {t.status === 'Late' && <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />}
                    <div>
                      <div className="font-medium leading-tight">{t.title}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{t.description}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell text-sm">{taskCategoryLabels[t.category]}</TableCell>
                {showAssigner && <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{userName(t.assignerId)}</TableCell>}
                {showAssignee && <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{userName(t.assigneeId)}</TableCell>}
                <TableCell className="hidden sm:table-cell text-sm">{t.deadline}</TableCell>
                <TableCell><TaskStatusBadge status={t.status} /></TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge variant="outline" className={priorityColors[t.priority]}>{taskPriorityLabels[t.priority]}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {onView && (
                      <Button variant="ghost" size="sm" onClick={() => onView(t)} className="gap-1">
                        <Eye className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Xem</span>
                      </Button>
                    )}
                    {extraAction?.(t)}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {tasks.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">{emptyText}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TaskTable;
