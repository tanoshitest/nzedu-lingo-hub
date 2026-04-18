import { useState } from 'react';
import { Save, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { studentsList } from '@/data/mockData';

const months = ['04/2026', '03/2026', '02/2026'];
const classes = ['IELTS 6.5 - Lớp A1', 'IELTS 6.5 - Lớp A2', 'IELTS 7.0 - Lớp A3'];

const TeacherMonthlyResults = () => {
  const [month, setMonth] = useState(months[0]);
  const [klass, setKlass] = useState(classes[0]);
  const [generalReport, setGeneralReport] = useState('');
  const [scores, setScores] = useState<Record<string, { listening: string; reading: string; writing: string; speaking: string; comment: string }>>(
    Object.fromEntries(studentsList.map((s) => [s.id, { listening: '', reading: '', writing: '', speaking: '', comment: '' }]))
  );

  const updateScore = (id: string, field: keyof typeof scores[string], val: string) => {
    setScores({ ...scores, [id]: { ...scores[id], [field]: val } });
  };

  const handleSave = () => {
    toast.success(`Đã lưu kết quả tháng ${month} cho lớp ${klass}`);
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/60">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="flex items-center gap-2 text-sm font-medium"><Award className="h-4 w-4" /> Kết quả định kỳ</div>
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="max-w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>{months.map((m) => <SelectItem key={m} value={m}>Tháng {m}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={klass} onValueChange={setKlass}>
            <SelectTrigger className="max-w-[240px]"><SelectValue /></SelectTrigger>
            <SelectContent>{classes.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader><CardTitle>Điểm thi tháng — {klass}</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Học viên</TableHead>
              <TableHead>Listening</TableHead>
              <TableHead>Reading</TableHead>
              <TableHead>Writing</TableHead>
              <TableHead>Speaking</TableHead>
              <TableHead>Nhận xét ngắn</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {studentsList.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  {(['listening', 'reading', 'writing', 'speaking'] as const).map((f) => (
                    <TableCell key={f} className="w-20">
                      <Input type="number" min={0} max={10} step={0.5} value={scores[s.id][f]} onChange={(e) => updateScore(s.id, f, e.target.value)} />
                    </TableCell>
                  ))}
                  <TableCell className="w-64">
                    <Input value={scores[s.id].comment} onChange={(e) => updateScore(s.id, 'comment', e.target.value)} placeholder="Ví dụ: cần cải thiện Writing..." />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader><CardTitle>Báo cáo tổng quát lớp</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Label>Đánh giá tình hình học tập chung của lớp trong tháng</Label>
          <Textarea rows={6} value={generalReport} onChange={(e) => setGeneralReport(e.target.value)} placeholder="Lớp có tiến bộ rõ ở kỹ năng Listening, tuy nhiên..." />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="gradient-hero gap-2"><Save className="h-4 w-4" /> Lưu kết quả tháng</Button>
      </div>
    </div>
  );
};

export default TeacherMonthlyResults;
