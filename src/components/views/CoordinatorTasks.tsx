import { useState, useMemo } from 'react';
import { Plus, Inbox, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import TaskTable from '../tasks/TaskTable';
import TaskDialog from '../tasks/TaskDialog';
import { tasks as mockTasks, type Task } from '@/data/mockTasks';
import { toast } from 'sonner';

const COORD_ID = 'U002';

const CoordinatorTasks = () => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [openNew, setOpenNew] = useState(false);

  const incoming = useMemo(() => tasks.filter((t) => t.assigneeId === COORD_ID), [tasks]);
  const outgoing = useMemo(() => tasks.filter((t) => t.assignerId === COORD_ID && t.assigneeId !== COORD_ID), [tasks]);

  const handleComplete = (t: Task) => {
    setTasks(tasks.map((x) => x.id === t.id ? { ...x, status: 'WaitingApproval' } : x));
    toast.success(`Đã đánh dấu hoàn thành: ${t.title}`);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-border/60">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground"><Inbox className="h-3.5 w-3.5" /> Việc cần làm</div>
            <div className="text-2xl font-bold mt-1">{incoming.length}</div>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground"><Send className="h-3.5 w-3.5" /> Việc đã giao</div>
            <div className="text-2xl font-bold mt-1">{outgoing.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button className="gradient-hero shadow-elegant gap-2" onClick={() => setOpenNew(true)}>
          <Plus className="h-4 w-4" /> Giao việc cho Giáo viên
        </Button>
      </div>

      <Tabs defaultValue="incoming">
        <TabsList>
          <TabsTrigger value="incoming">Việc cần làm ({incoming.length})</TabsTrigger>
          <TabsTrigger value="outgoing">Việc đã giao ({outgoing.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="incoming" className="mt-4">
          <TaskTable
            tasks={incoming}
            showAssignee={false}
            emptyText="Hiện chưa có việc nào được giao cho bạn"
            onView={(t) => toast.info(`Xem chi tiết: ${t.title}`)}
            extraAction={(t) => t.status !== 'Done' && t.status !== 'WaitingApproval' ? (
              <Button size="sm" variant="outline" onClick={() => handleComplete(t)}>Hoàn thành</Button>
            ) : null}
          />
        </TabsContent>
        <TabsContent value="outgoing" className="mt-4">
          <TaskTable
            tasks={outgoing}
            showAssigner={false}
            emptyText="Bạn chưa giao việc nào"
            onView={(t) => toast.info(`Xem chi tiết: ${t.title}`)}
          />
        </TabsContent>
      </Tabs>

      <TaskDialog
        open={openNew}
        onOpenChange={setOpenNew}
        assignerId={COORD_ID}
        allowedAssigneeRoles={['Giáo viên']}
        defaultCategory="Grading"
        title="Giao việc cho Giáo viên"
        description="Giáo vụ phân công công việc cho Giáo viên (chấm bài, soạn đề, chuẩn bị tài liệu...)."
        onCreate={(t) => setTasks([t, ...tasks])}
      />
    </div>
  );
};

export default CoordinatorTasks;
