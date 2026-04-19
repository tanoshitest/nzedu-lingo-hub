import { useState, useMemo } from 'react';
import { Save, Award, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { classRosters } from '@/data/mockClassReports';
import type { TabContext } from '../shared/TabContext';

const months = ['04/2026', '03/2026', '02/2026'];

type Skill = 'listening' | 'reading' | 'writing' | 'speaking';
type Row = Record<Skill, string> & { comment: string };

const emptyRow = (): Row => ({ listening: '', reading: '', writing: '', speaking: '', comment: '' });

// Mock seed: tháng 03/2026 đã có điểm để Student xem được
const seedScores: Record<string, Record<string, Row>> = {
  '03/2026': {
    S001: { listening: '6.5', reading: '6.0', writing: '5.5', speaking: '6.0', comment: 'Tiến bộ ở Listening, cần luyện Writing Task 2.' },
    S002: { listening: '7.0', reading: '6.5', writing: '6.0', speaking: '6.5', comment: 'Học đều, tiếp tục duy trì.' },
    S003: { listening: '5.5', reading: '5.5', writing: '5.0', speaking: '5.5', comment: 'Cần làm thêm bài về nhà.' },
    S004: { listening: '7.5', reading: '7.0', writing: '6.5', speaking: '7.0', comment: 'Có tố chất, đẩy lên 7.5+.' },
    S005: { listening: '7.0', reading: '7.5', writing: '6.5', speaking: '6.5', comment: 'Reading rất tốt.' },
    S006: { listening: '6.5', reading: '7.0', writing: '6.0', speaking: '6.5', comment: 'Writing cần ý cụ thể hơn.' },
  },
};

const seedGeneral: Record<string, string> = {
  '03/2026': 'Lớp tiến bộ rõ ở Listening và Reading. Writing cần đẩy mạnh trong tháng tới — đặc biệt Task 2 với chủ đề Education và Environment.',
};

const avgBand = (r: Row) => {
  const nums = (['listening', 'reading', 'writing', 'speaking'] as const)
    .map((k) => parseFloat(r[k]))
    .filter((n) => !isNaN(n));
  if (!nums.length) return '—';
  const a = nums.reduce((s, n) => s + n, 0) / nums.length;
  return (Math.round(a * 2) / 2).toFixed(1);
};

const MonthlyResultsTab = ({ role, studentId, className }: TabContext) => {
  const [month, setMonth] = useState(months[1]); // mặc định 03/2026 để Student có data xem
  const roster = useMemo(() => (className && classRosters[className]) || [], [className]);

  const [scoresByMonth, setScoresByMonth] = useState<Record<string, Record<string, Row>>>(() => {
    const init: Record<string, Record<string, Row>> = {};
    months.forEach((m) => {
      init[m] = {};
      roster.forEach((r) => {
        init[m][r.studentId] = seedScores[m]?.[r.studentId] ?? emptyRow();
      });
    });
    return init;
  });
  const [generalByMonth, setGeneralByMonth] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    months.forEach((m) => { init[m] = seedGeneral[m] ?? ''; });
    return init;
  });

  const scores = scoresByMonth[month] ?? {};
  const general = generalByMonth[month] ?? '';

  const updateScore = (id: string, field: keyof Row, val: string) => {
    setScoresByMonth((prev) => ({
      ...prev,
      [month]: { ...prev[month], [id]: { ...prev[month][id], [field]: val } },
    }));
  };

  const handleSave = () => {
    toast.success(`Đã lưu kết quả tháng ${month}`);
  };

  // ===== STUDENT VIEW =====
  if (role === 'Student') {
    const myRow = studentId ? scores[studentId] : undefined;
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="font-display text-xl font-bold flex items-center gap-2"><Award className="h-5 w-5 text-primary" /> Kết quả định kỳ</h2>
            <p className="text-sm text-muted-foreground">Điểm thi tháng và nhận xét của Giáo viên</p>
          </div>
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>{months.map((m) => <SelectItem key={m} value={m}>Tháng {m}</SelectItem>)}</SelectContent>
          </Select>
        </div>

        {!myRow || avgBand(myRow) === '—' ? (
          <Card className="border-border/60"><CardContent className="py-12 text-center text-muted-foreground text-sm">Chưa có kết quả tháng {month}.</CardContent></Card>
        ) : (
          <>
            <Card className="overflow-hidden border-0 shadow-elegant">
              <div className="gradient-hero p-6 text-primary-foreground">
                <div className="text-sm opacity-90">Band trung bình tháng {month}</div>
                <div className="font-display text-5xl font-bold mt-1">{avgBand(myRow)}</div>
                <Badge variant="outline" className="mt-3 bg-white/20 border-white/30 text-white">{className}</Badge>
              </div>
            </Card>

            <Card className="border-border/60">
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4" /> Điểm 4 kỹ năng</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(['listening', 'reading', 'writing', 'speaking'] as const).map((k) => (
                  <div key={k} className="p-4 rounded-lg border border-border bg-muted/30 text-center">
                    <div className="text-xs uppercase text-muted-foreground tracking-wider">{k}</div>
                    <div className="text-2xl font-bold mt-1">{myRow[k] || '—'}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-border/60">
              <CardHeader><CardTitle className="text-base">Nhận xét của Giáo viên</CardTitle></CardHeader>
              <CardContent>
                <div className="rounded-lg bg-muted/30 border border-border p-4 text-sm whitespace-pre-wrap">{myRow.comment || 'Chưa có nhận xét.'}</div>
              </CardContent>
            </Card>

            {general && (
              <Card className="border-border/60">
                <CardHeader><CardTitle className="text-base">Báo cáo chung của lớp</CardTitle></CardHeader>
                <CardContent>
                  <div className="rounded-lg bg-primary/5 border border-primary/20 p-4 text-sm whitespace-pre-wrap">{general}</div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    );
  }

  // ===== TEACHER VIEW =====
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="font-display text-xl font-bold flex items-center gap-2"><Award className="h-5 w-5 text-primary" /> Kết quả định kỳ</h2>
          <p className="text-sm text-muted-foreground">Nhập điểm thi tháng và viết nhận xét cho từng học viên</p>
        </div>
        <Select value={month} onValueChange={setMonth}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>{months.map((m) => <SelectItem key={m} value={m}>Tháng {m}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      <Card className="border-border/60">
        <CardHeader><CardTitle className="text-base">Điểm thi tháng {month} — {className}</CardTitle></CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[160px]">Học viên</TableHead>
                <TableHead className="w-[90px]">Listening</TableHead>
                <TableHead className="w-[90px]">Reading</TableHead>
                <TableHead className="w-[90px]">Writing</TableHead>
                <TableHead className="w-[90px]">Speaking</TableHead>
                <TableHead className="w-[80px]">TB</TableHead>
                <TableHead className="min-w-[260px]">Nhận xét</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roster.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center text-sm text-muted-foreground py-8">Chưa có sĩ số cho lớp này.</TableCell></TableRow>
              )}
              {roster.map((s) => {
                const r = scores[s.studentId] ?? emptyRow();
                return (
                  <TableRow key={s.studentId}>
                    <TableCell className="font-medium text-sm">{s.studentName}</TableCell>
                    {(['listening', 'reading', 'writing', 'speaking'] as const).map((f) => (
                      <TableCell key={f}>
                        <Input type="number" min={0} max={9} step={0.5} className="h-9" value={r[f]} onChange={(e) => updateScore(s.studentId, f, e.target.value)} />
                      </TableCell>
                    ))}
                    <TableCell><Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">{avgBand(r)}</Badge></TableCell>
                    <TableCell>
                      <Input className="h-9" value={r.comment} onChange={(e) => updateScore(s.studentId, 'comment', e.target.value)} placeholder="Nhận xét..." />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader><CardTitle className="text-base">Báo cáo chung của lớp</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <Label>Đánh giá tình hình học tập chung của lớp trong tháng {month}</Label>
          <Textarea
            rows={5}
            value={general}
            onChange={(e) => setGeneralByMonth({ ...generalByMonth, [month]: e.target.value })}
            placeholder="Tình hình lớp, điểm mạnh, điểm cần cải thiện, kế hoạch tháng tới..."
          />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="gradient-hero gap-2"><Save className="h-4 w-4" /> Lưu kết quả tháng</Button>
      </div>
    </div>
  );
};

export default MonthlyResultsTab;
