import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { GradingTable, GradingTask } from '@/components/grading/GradingTable';
import { 
  ClipboardList, 
  History, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  User,
  GraduationCap,
  Sparkles
} from 'lucide-react';

const mockPendingTasks: GradingTask[] = [
  { id: 'SUB001', studentName: 'Hoàng Minh Đức', assignmentName: 'Writing Task 2', className: 'IELTS 6.5 - Lớp A1', submissionDate: '26/04/2026 08:30', type: 'Exam', status: 'Unassigned' },
  { id: 'SUB002', studentName: 'Vũ Thị Hà', assignmentName: 'Homework Unit 5', className: 'IELTS 6.5 - Lớp A1', submissionDate: '26/04/2026 09:15', type: 'Regular', status: 'Pending', assignedTeacher: 'Lê Hoàng Cường' },
  { id: 'SUB004', studentName: 'Nguyễn Thảo My', assignmentName: 'Final Test', className: 'IELTS 7.0 - Lớp B2', submissionDate: '26/04/2026 10:00', type: 'Exam', status: 'Unassigned' },
];

const mockStudentPending: GradingTask[] = [
  { id: 'SUB002', studentName: 'Tôi', assignmentName: 'Homework Unit 5', className: 'IELTS 6.5 - Lớp A1', submissionDate: '26/04/2026 09:15', type: 'Regular', status: 'Pending', assignedTeacher: 'Lê Hoàng Cường' },
  { id: 'SUB005', studentName: 'Tôi', assignmentName: 'Writing Practice', className: 'IELTS 6.5 - Lớp A1', submissionDate: '25/04/2026 14:20', type: 'Regular', status: 'Pending', assignedTeacher: 'Lê Hoàng Cường' },
];

export function PendingGradingView() {
  const [userRole, setUserRole] = useState<'Teacher' | 'Student'>('Teacher');

  return (
    <div className="space-y-8 p-1">
      {/* Role Toggle for Demo */}
      <div className="flex justify-end">
        <div className="bg-slate-100 p-1 rounded-lg flex gap-1">
          <Button 
            variant={userRole === 'Teacher' ? 'default' : 'ghost'} 
            size="sm" 
            onClick={() => setUserRole('Teacher')}
            className={userRole === 'Teacher' ? 'bg-white text-slate-900 shadow-sm hover:bg-white' : 'text-slate-500'}
          >
            <GraduationCap size={16} className="mr-2" /> Chế độ Giáo viên
          </Button>
          <Button 
            variant={userRole === 'Student' ? 'default' : 'ghost'} 
            size="sm" 
            onClick={() => setUserRole('Student')}
            className={userRole === 'Student' ? 'bg-white text-slate-900 shadow-sm hover:bg-white' : 'text-slate-500'}
          >
            <User size={16} className="mr-2" /> Chế độ Học sinh
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            {userRole === 'Teacher' ? (
              <><ClipboardList className="text-indigo-600" /> Danh sách bài cần chấm</>
            ) : (
              <><History className="text-indigo-600" /> Trạng thái bài tập</>
            )}
          </h1>
          <p className="text-slate-500 mt-1">
            {userRole === 'Teacher' 
              ? 'Quản lý các bài làm học viên đã gửi và đang chờ bạn nhận xét.' 
              : 'Theo dõi tiến độ chấm bài của các bài tập bạn đã nộp.'}
          </p>
        </div>
        {userRole === 'Teacher' && (
          <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-lg border border-amber-100 text-sm font-medium">
            <AlertTriangle size={16} />
            Bạn có 3 bài cần chấm ngay
          </div>
        )}
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="bg-transparent border-b border-slate-200 w-full justify-start rounded-none h-auto p-0 gap-8">
          <TabsTrigger 
            value="pending" 
            className="data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 border-b-2 border-transparent rounded-none px-2 pb-3 pt-0 bg-transparent shadow-none"
          >
            Đang chờ ({userRole === 'Teacher' ? mockPendingTasks.length : mockStudentPending.length})
          </TabsTrigger>
          <TabsTrigger 
            value="completed" 
            className="data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 border-b-2 border-transparent rounded-none px-2 pb-3 pt-0 bg-transparent shadow-none"
          >
            Đã hoàn thành
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-none shadow-sm bg-indigo-50/50">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Trung bình chờ</p>
                  <p className="text-xl font-bold text-slate-900">4.5 Giờ</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-emerald-50/50">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Đã chấm tuần này</p>
                  <p className="text-xl font-bold text-slate-900">12 Bài</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-purple-50/50">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                  <Sparkles size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Điểm TB</p>
                  <p className="text-xl font-bold text-slate-900">7.8</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <GradingTable 
            tasks={userRole === 'Teacher' ? mockPendingTasks : mockStudentPending} 
            showAssignAction={userRole === 'Teacher'}
          />
        </TabsContent>

        <TabsContent value="completed" className="pt-6">
          <div className="bg-white rounded-xl border border-slate-100 p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <History size={32} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Lịch sử bài tập</h3>
            <p className="text-slate-500 max-w-sm mx-auto mt-2">
              Các bài tập đã hoàn thành chấm điểm sẽ hiển thị tại đây để bạn xem lại kết quả và phản hồi.
            </p>
            <Button variant="outline" className="mt-6">Xem báo cáo chi tiết</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
