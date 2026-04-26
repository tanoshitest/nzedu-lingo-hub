import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { GradingTable, GradingTask } from '@/components/grading/GradingTable';
import { 
  Users, 
  Search, 
  Filter, 
  UserPlus, 
  BarChart3, 
  AlertCircle,
  TrendingDown,
  TrendingUp
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';

import { mockExercises, mockExerciseResults } from '@/data/mockExercises';

// Mock data for teachers workload
const teacherWorkload = [
  { id: 'T1', name: 'Lê Hoàng Cường', activeTasks: 5, capacity: 10, status: 'Normal' },
  { id: 'T2', name: 'Phạm Mai Dung', activeTasks: 9, capacity: 10, status: 'Overloaded' },
  { id: 'T3', name: 'Bùi Lan Khanh', activeTasks: 2, capacity: 10, status: 'Available' },
  { id: 'T4', name: 'Nguyễn Văn Nam', activeTasks: 4, capacity: 10, status: 'Normal' },
];

const exerciseTasks: GradingTask[] = mockExerciseResults
  .filter(r => r.status === 'pending')
  .map(r => {
    const ex = mockExercises.find(e => e.id === r.exerciseId);
    return {
      id: `EX-${r.exerciseId}-${r.studentId}`,
      studentName: 'Hoàng Minh Đức',
      assignmentName: ex?.title || 'Bài tập tự luận',
      className: 'IELTS 6.0 - Day 1',
      submissionDate: r.submittedAt,
      type: 'Regular',
      status: 'Unassigned',
      priority: 'Medium'
    };
  });

const mockTasks: GradingTask[] = [
  ...exerciseTasks,
  { id: 'SUB001', studentName: 'Hoàng Minh Đức', assignmentName: 'Writing Task 2 - Education', className: 'IELTS 6.5 - Lớp A1', submissionDate: '26/04/2026 08:30', type: 'Exam', status: 'Unassigned' },
  { id: 'SUB002', studentName: 'Vũ Thị Hà', assignmentName: 'Homework Unit 5', className: 'IELTS 6.5 - Lớp A1', submissionDate: '26/04/2026 09:15', type: 'Regular', status: 'Pending', assignedTeacher: 'Lê Hoàng Cường' },
  { id: 'SUB003', studentName: 'Đỗ Quang Huy', assignmentName: 'Speaking Practice', className: 'IELTS 6.5 - Lớp A1', submissionDate: '25/04/2026 14:20', type: 'Regular', status: 'Graded', assignedTeacher: 'Lê Hoàng Cường' },
  { id: 'SUB004', studentName: 'Nguyễn Thảo My', assignmentName: 'Final Test - Listening', className: 'IELTS 7.0 - Lớp B2', submissionDate: '26/04/2026 10:00', type: 'Exam', status: 'Unassigned' },
  { id: 'SUB005', studentName: 'Trần Bảo Long', assignmentName: 'Writing Task 1', className: 'IELTS 6.0 - Lớp C1', submissionDate: '26/04/2026 10:45', type: 'Regular', status: 'Unassigned' },
];

export function GradingCoordinationView() {
  const [tasks, setTasks] = useState<GradingTask[]>(mockTasks);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         task.assignmentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || 
                       (filterType === 'Exam' && task.type === 'Exam') || 
                       (filterType === 'Regular' && task.type === 'Regular');
    return matchesSearch && matchesType;
  });

  const handleBulkAssign = (teacherId: string) => {
    if (selectedTasks.length === 0) {
      toast.error("Vui lòng chọn ít nhất một bài tập");
      return;
    }
    
    const teacher = teacherWorkload.find(t => t.id === teacherId);
    if (!teacher) return;

    setTasks(prev => prev.map(task => 
      selectedTasks.includes(task.id) 
        ? { ...task, status: 'Pending', assignedTeacher: teacher.name } 
        : task
    ));
    
    toast.success(`Đã điều phối ${selectedTasks.length} bài tập cho giáo viên ${teacher.name}`);
    setSelectedTasks([]);
  };

  return (
    <div className="space-y-8 p-1">
      {/* Header section with stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-none shadow-lg">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-indigo-100 text-sm font-medium">Chờ điều phối</p>
                <h3 className="text-3xl font-bold mt-1">
                  {tasks.filter(t => t.status === 'Unassigned').length}
                </h3>
              </div>
              <div className="p-2 bg-white/20 rounded-lg">
                <AlertCircle size={20} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-indigo-100">
              <TrendingUp size={14} className="mr-1" />
              <span>+3 bài nộp mới trong 1 giờ qua</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm border">
          <CardContent className="p-6">
            <div className="flex justify-between items-start text-slate-600">
              <div>
                <p className="text-slate-500 text-sm font-medium">Đang chấm</p>
                <h3 className="text-3xl font-bold mt-1 text-slate-900">
                  {tasks.filter(t => t.status === 'Pending' || t.status === 'In Progress').length}
                </h3>
              </div>
              <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                <Users size={20} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-emerald-600 font-medium">
              <TrendingDown size={14} className="mr-1" />
              <span>Thời gian chấm TB: 14h</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm border">
          <CardContent className="p-6">
            <div className="flex justify-between items-start text-slate-600">
              <div>
                <p className="text-slate-500 text-sm font-medium">Giáo viên sẵn sàng</p>
                <h3 className="text-3xl font-bold mt-1 text-slate-900">
                  {teacherWorkload.filter(t => t.status === 'Available').length}
                </h3>
              </div>
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                <UserPlus size={20} />
              </div>
            </div>
            <div className="mt-4 text-xs text-slate-500">
              Tổng số giáo viên: {teacherWorkload.length}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm border">
          <CardContent className="p-6">
            <div className="flex justify-between items-start text-slate-600">
              <div>
                <p className="text-slate-500 text-sm font-medium">Tỷ lệ hoàn thành</p>
                <h3 className="text-3xl font-bold mt-1 text-slate-900">85%</h3>
              </div>
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                <BarChart3 size={20} />
              </div>
            </div>
            <div className="mt-4 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-full w-[85%] rounded-full"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content: Workload & Table */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left Column: Teacher Workload */}
        <div className="xl:col-span-4 space-y-6">
          <Card className="shadow-md border-none overflow-hidden">
            <CardHeader className="bg-slate-900 text-white pb-6">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users size={18} />
                Tải công việc giáo viên
              </CardTitle>
              <CardDescription className="text-slate-400">
                Theo dõi và điều phối bài tập hợp lý
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {teacherWorkload.map((teacher) => (
                  <div key={teacher.id} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-medium text-slate-900">{teacher.name}</div>
                      <Badge 
                        variant={teacher.status === 'Overloaded' ? 'destructive' : 'outline'}
                        className={teacher.status === 'Available' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ''}
                      >
                        {teacher.status === 'Overloaded' ? 'Quá tải' : 
                         teacher.status === 'Available' ? 'Rảnh' : 'Bình thường'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            teacher.status === 'Overloaded' ? 'bg-rose-500' : 
                            teacher.status === 'Available' ? 'bg-emerald-500' : 'bg-indigo-500'
                          }`} 
                          style={{ width: `${(teacher.activeTasks / teacher.capacity) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-semibold text-slate-600">
                        {teacher.activeTasks}/{teacher.capacity} bài
                      </span>
                    </div>
                    <Button 
                      className="w-full mt-3 text-xs h-8 bg-slate-100 hover:bg-slate-200 text-slate-700 border-none"
                      disabled={selectedTasks.length === 0}
                      onClick={() => handleBulkAssign(teacher.id)}
                    >
                      Giao cho giáo viên này
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Tasks Table */}
        <div className="xl:col-span-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <Input 
                placeholder="Tìm học viên, bài tập..." 
                className="pl-10 bg-slate-50 border-slate-200" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[140px] bg-slate-50 border-slate-200">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Loại bài" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="Regular">Bài tập</SelectItem>
                  <SelectItem value="Exam">Bài thi</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="text-slate-600">
                Lọc nâng cao
              </Button>
            </div>
          </div>

          <GradingTable 
            tasks={filteredTasks} 
            showCheckbox={true} 
            showAssignAction={true}
            onSelectTasks={setSelectedTasks}
          />
        </div>
      </div>
    </div>
  );
}
