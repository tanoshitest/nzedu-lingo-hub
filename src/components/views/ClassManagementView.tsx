import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  BookOpen, 
  Search, 
  Plus, 
  Calendar, 
  ChevronRight, 
  MoreHorizontal,
  LayoutGrid,
  List,
  Clock
} from 'lucide-react';
import { mockClasses, type Class } from '@/data/mockClasses';
import { users } from '@/data/mockData';

export function ClassManagementView() {
  const [searchTerm, setSearchTerm] = React.useState('');
  
  const getTeacherName = (id: string) => users.find(u => u.id === id)?.name || 'Chưa gán';

  const filteredClasses = mockClasses.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.level.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 p-1">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản lý lớp học</h1>
          <p className="text-sm text-slate-500 mt-1">Quản trị danh sách lớp, giáo viên và lộ trình giảng dạy.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 gap-2 flex-1 md:flex-none">
            <Plus size={18} /> Mở lớp mới
          </Button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Tổng số lớp', value: mockClasses.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Đang hoạt động', value: mockClasses.filter(c => c.status === 'Active').length, icon: Calendar, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Lớp mới/Chờ', value: mockClasses.filter(c => c.status === 'Pending').length, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Syllabus đã gán', value: '100%', icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
                <p className="text-xl font-bold text-slate-900">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter and Table */}
      <Card className="border-none shadow-xl shadow-slate-200/50">
        <CardHeader className="border-b border-slate-50 flex flex-row items-center justify-between pb-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input 
              placeholder="Tìm tên lớp, trình độ..." 
              className="pl-10 bg-slate-50 border-slate-100 focus-visible:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
             <Button variant="outline" size="icon" className="rounded-lg"><LayoutGrid size={18} /></Button>
             <Button variant="outline" size="icon" className="rounded-lg bg-blue-50 text-blue-600 border-blue-100"><List size={18} /></Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="font-black text-slate-400 text-[10px] uppercase tracking-widest pl-6">Lớp & Trình độ</TableHead>
                <TableHead className="font-black text-slate-400 text-[10px] uppercase tracking-widest">Syllabus gán kèm</TableHead>
                <TableHead className="font-black text-slate-400 text-[10px] uppercase tracking-widest">Giáo viên</TableHead>
                <TableHead className="font-black text-slate-400 text-[10px] uppercase tracking-widest">Sĩ số</TableHead>
                <TableHead className="font-black text-slate-400 text-[10px] uppercase tracking-widest">Trạng thái</TableHead>
                <TableHead className="text-right pr-6"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClasses.map((cls) => (
                <TableRow key={cls.id} className="hover:bg-slate-50/50 transition-colors group">
                  <TableCell className="pl-6 py-4">
                    <div className="font-bold text-slate-900">{cls.name}</div>
                    <div className="text-xs text-slate-500">{cls.level}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-100 font-bold">
                        {cls.syllabusId}
                      </Badge>
                      <span className="text-xs text-slate-400 group-hover:text-blue-500 transition-colors cursor-pointer flex items-center gap-1">
                        Chi tiết <ChevronRight size={12} />
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">
                        {getTeacherName(cls.teacherId).split(' ').pop()?.[0]}
                      </div>
                      <span className="text-sm font-medium text-slate-700">{getTeacherName(cls.teacherId)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-bold text-slate-600">{cls.studentsCount} học viên</span>
                  </TableCell>
                  <TableCell>
                    <Badge className={
                      cls.status === 'Active' ? 'bg-emerald-500' : 
                      cls.status === 'Pending' ? 'bg-orange-500' : 'bg-slate-400'
                    }>
                      {cls.status === 'Active' ? 'Đang học' : 
                       cls.status === 'Pending' ? 'Chờ khai giảng' : cls.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <Button variant="ghost" size="icon" className="text-slate-400">
                      <MoreHorizontal size={18} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
