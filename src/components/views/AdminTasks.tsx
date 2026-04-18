import { useState, useMemo } from 'react';
import { Plus, AlertTriangle, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';
import TaskTable from '../tasks/TaskTable';
import TaskDialog from '../tasks/TaskDialog';
import { tasks as mockTasks, type Task, type TaskStatus, taskStatusLabels } from '@/data/mockTasks';

const AdminTasks = () => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [openNew, setOpenNew] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'All' | TaskStatus>('All');

  const filtered = useMemo(
    () => filterStatus === 'All' ? tasks : tasks.filter((t) => t.status === filterStatus),
    [tasks, filterStatus]
  );

  const lateTasks = tasks.filter((t) => t.status === 'Late');

  const stats = useMemo(() => ({
    total: tasks.length,
    late: tasks.filter((t) => t.status === 'Late').length,
    inProgress: tasks.filter((t) => t.status === 'InProgress').length,
    waitingApproval: tasks.filter((t) => t.status === 'WaitingApproval').length,
    done: tasks.filter((t) => t.status === 'Done').length,
  }), [tasks]);

  const handleIntervene = (t: Task) => {
    toast.success(`Đã đốc thúc task "${t.title}" — thông báo đã gửi tới người thực hiện`);
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Tổng công việc', value: stats.total, color: 'text-foreground' },
          { label: 'Trễ hạn', value: stats.late, color: 'text-destructive' },
          { label: 'Đang làm', value: stats.inProgress, color: 'text-info' },
          { label: 'Chờ duyệt', value: stats.waitingApproval, color: 'text-warning' },
          { label: 'Hoàn thành', value: stats.done, color: 'text-success' },
        ].map((s) => (
          <Card key={s.label} className="border-border/60">
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground">{s.label}</div>
              <div className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Late alert */}
      {lateTasks.length > 0 && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="font-semibold text-destructive">Cảnh báo: {lateTasks.length} công việc trễ hạn</div>
              <div className="text-sm text-muted-foreground mt-1">
                Hãy vào xem tab "Trễ hạn" để đốc thúc hoặc thay đổi người thực hiện.
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as 'All' | TaskStatus)}>
          <SelectTrigger className="max-w-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="All">Tất cả trạng thái</SelectItem>
            {Object.entries(taskStatusLabels).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button className="gradient-hero shadow-elegant gap-2" onClick={() => setOpenNew(true)}>
          <Plus className="h-4 w-4" /> Giao việc mới
        </Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Toàn bộ ({filtered.length})</TabsTrigger>
          <TabsTrigger value="late" className="gap-1">
            <ShieldAlert className="h-3.5 w-3.5" /> Trễ hạn ({lateTasks.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <TaskTable
            tasks={filtered}
            onView={(t) => toast.info(`Xem chi tiết: ${t.title}`)}
          />
        </TabsContent>
        <TabsContent value="late" className="mt-4">
          <TaskTable
            tasks={lateTasks}
            emptyText="Không có công việc nào trễ hạn"
            onView={(t) => toast.info(`Xem chi tiết: ${t.title}`)}
            extraAction={(t) => (
              <Button size="sm" variant="outline" className="gap-1" onClick={() => handleIntervene(t)}>
                <ShieldAlert className="h-3.5 w-3.5" /> Can thiệp
              </Button>
            )}
          />
        </TabsContent>
      </Tabs>

      <TaskDialog
        open={openNew}
        onOpenChange={setOpenNew}
        assignerId="U001"
        title="Giao việc mới (Admin)"
        description="Admin có thể giao việc cho bất kỳ ai trong hệ thống."
        onCreate={(t) => setTasks([t, ...tasks])}
      />
    </div>
  );
};

export default AdminTasks;
