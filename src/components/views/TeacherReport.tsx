import { useState } from 'react';
import { Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { studentsList, classSessions } from '@/data/mockData';

interface StudentRow {
  id: string;
  attendance: 'Có mặt' | 'Vắng';
  score: string;
  comment: string;
}

const TeacherReport = () => {
  const pendingClasses = classSessions.filter((c) => c.teacher === 'Lê Hoàng Cường' && c.status === 'Chờ báo cáo');
  const [selectedClass, setSelectedClass] = useState(pendingClasses[0]?.id ?? '');
  const [generalComment, setGeneralComment] = useState('');
  const [homework, setHomework] = useState('');
  const [rows, setRows] = useState<StudentRow[]>(
    studentsList.map((s) => ({ id: s.id, attendance: 'Có mặt', score: '', comment: '' }))
  );

  const updateRow = (id: string, field: keyof StudentRow, value: string) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const handleSubmit = () => {
    if (!generalComment || !homework) {
      toast.error('Vui lòng điền nhận xét chung và bài tập');
      return;
    }
    toast.success('Đã nộp báo cáo lớp học thành công!');
    setGeneralComment('');
    setHomework('');
    setRows(studentsList.map((s) => ({ id: s.id, attendance: 'Có mặt', score: '', comment: '' })));
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="font-display">Viết báo cáo lớp học</CardTitle>
          <p className="text-sm text-muted-foreground">Hoàn thành báo cáo sau mỗi buổi dạy để Giáo vụ phê duyệt</p>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Chọn lớp học</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger><SelectValue placeholder="Chọn lớp..." /></SelectTrigger>
                <SelectContent>
                  {pendingClasses.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.className} - {c.date}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Buổi học</Label>
              <Input value={pendingClasses.find((c) => c.id === selectedClass)?.time ?? ''} readOnly />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Nhận xét chung về lớp học</Label>
            <Textarea
              placeholder="Mô tả tình hình chung của lớp, mức độ tham gia, nội dung đã dạy..."
              rows={4}
              value={generalComment}
              onChange={(e) => setGeneralComment(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Bài tập về nhà</Label>
            <Textarea
              placeholder="Liệt kê bài tập và nguồn tài liệu học viên cần hoàn thành..."
              rows={3}
              value={homework}
              onChange={(e) => setHomework(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="font-display text-base">Đánh giá học viên</CardTitle>
          <p className="text-sm text-muted-foreground">Nhập điểm danh, điểm số và nhận xét cho từng học viên</p>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[160px]">Học viên</TableHead>
                <TableHead className="w-[140px]">Điểm danh</TableHead>
                <TableHead className="w-[100px]">Điểm</TableHead>
                <TableHead className="min-w-[240px]">Nhận xét</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {studentsList.map((s) => {
                const row = rows.find((r) => r.id === s.id)!;
                return (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell>
                      <Select value={row.attendance} onValueChange={(v) => updateRow(s.id, 'attendance', v)}>
                        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Có mặt">Có mặt</SelectItem>
                          <SelectItem value="Vắng">Vắng</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        className="h-9"
                        value={row.score}
                        onChange={(e) => updateRow(s.id, 'score', e.target.value)}
                        placeholder="0-10"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        className="h-9"
                        value={row.comment}
                        onChange={(e) => updateRow(s.id, 'comment', e.target.value)}
                        placeholder="Nhận xét..."
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline">Lưu nháp</Button>
        <Button onClick={handleSubmit} className="gradient-hero gap-2 shadow-elegant">
          <Send className="h-4 w-4" />
          Nộp báo cáo
        </Button>
      </div>
    </div>
  );
};

export default TeacherReport;
