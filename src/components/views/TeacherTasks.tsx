import { useState, useMemo } from 'react';
import { Plus, ListChecks, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import TaskTable from '../tasks/TaskTable';
import TaskDialog from '../tasks/TaskDialog';
import { tasks as mockTasks, type Task } from '@/data/mockTasks';
import { toast } from 'sonner';

const TEACHER_ID = 'U003';

const TeacherTasks = () => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [openNew, setOpenNew] = useState(false);

  const myTasks = useMemo(() => tasks.filter((t) => t.assigneeId === TEACHER_ID), [tasks]);
  const supportRequests = useMemo(
    () => tasks.filter((t) => t.assignerId === TEACHER_ID && t.category === 'Support'),
    [tasks]
  );

  const handleStart = (t: Task) => {
    setTasks(tasks.map((x) => x.id === t.id ? { ...x, status: 'InProgress' } : x));
    toast.success(`Bắt đầu: ${t.title}`);
  };
  const handleComplete = (t: Task) => {
    setTasks(tasks.map((x) => x.id === t.id ? { ...x, status: 'WaitingApproval' } : x));
    toast.success(`Đã đánh dấu hoàn thành — chờ Giáo vụ duyệt`);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-border/60">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground"><ListChecks className="h-3.5 w-3.5" /> Việc của tôi</div>
            <div className="text-2xl font-bold mt-1">{myTasks.length}</div>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground"><HelpCircle className="h-3.5 w-3.5" /> Yêu cầu hỗ trợ đã gửi</div>
            <div className="text-2xl font-bold mt-1">{supportRequests.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button className="gradient-hero shadow-elegant gap-2" onClick={() => setOpenNew(true)}>
          <Plus className="h-4 w-4" /> Yêu cầu hỗ trợ Giáo vụ
        </Button>
      </div>

      <Tabs defaultValue="mine">
        <TabsList>
          <TabsTrigger value="mine">Việc của tôi ({myTasks.length})</TabsTrigger>
          <TabsTrigger value="support">Yêu cầu hỗ trợ ({supportRequests.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="mine" className="mt-4">
          <TaskTable
            tasks={myTasks}
            showAssignee={false}
            emptyText="Bạn chưa có việc nào được giao"
            onView={(t) => toast.info(`Xem chi tiết: ${t.title}`)}
            extraAction={(t) => {
              if (t.status === 'Pending') {
                return <Button size="sm" variant="outline" onClick={() => handleStart(t)}>Bắt đầu</Button>;
              }
              if (t.status === 'InProgress' || t.status === 'Late') {
                return <Button size="sm" variant="outline" onClick={() => handleComplete(t)}>Hoàn thành</Button>;
              }
              return null;
            }}
          />
        </TabsContent>
        <TabsContent value="support" className="mt-4">
          <TaskTable
            tasks={supportRequests}
            showAssigner={false}
            emptyText="Chưa có yêu cầu hỗ trợ nào"
            onView={(t) => toast.info(`Xem chi tiết: ${t.title}`)}
          />
        </TabsContent>
      </Tabs>

      <TaskDialog
        open={openNew}
        onOpenChange={setOpenNew}
        assignerId={TEACHER_ID}
        allowedAssigneeRoles={['Giáo vụ']}
        defaultCategory="Support"
        title="Yêu cầu hỗ trợ Giáo vụ"
        description="Giáo viên gửi yêu cầu hỗ trợ tới Giáo vụ (in tài liệu, hỗ trợ kỹ thuật, liên hệ phụ huynh...)."
        onCreate={(t) => setTasks([t, ...tasks])}
      />
    </div>
  );
};

export default TeacherTasks;
