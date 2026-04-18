import { Badge } from '@/components/ui/badge';
import { taskStatusColors, taskStatusLabels, type TaskStatus } from '@/data/mockTasks';

interface Props {
  status: TaskStatus;
  className?: string;
}

const TaskStatusBadge = ({ status, className }: Props) => (
  <Badge variant="outline" className={`${taskStatusColors[status]} ${className ?? ''}`}>
    {taskStatusLabels[status]}
  </Badge>
);

export default TaskStatusBadge;
