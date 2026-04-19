import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { GraduationCap, Target, BookMarked, Library as LibraryIcon, CalendarDays, Award, Shield } from 'lucide-react';
import {
  type CourseSyllabus,
  materialTypeLabels,
  syllabusStatusColors,
  syllabusStatusLabels,
} from '@/data/mockSyllabus';
import { formatVND } from '@/data/mockFinance';

interface Props {
  syllabus: CourseSyllabus;
  courseName: string;
  courseCode: string;
}

const Section = ({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) => (
  <Card className="border-border/60">
    <CardHeader className="pb-3">
      <CardTitle className="text-base flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="text-sm space-y-2">{children}</CardContent>
  </Card>
);

const SyllabusViewer = ({ syllabus, courseName, courseCode }: Props) => {
  const { overview, targetLearners, objectives, materials, sessions, assessment, policies } = syllabus;

  // Group sessions by week
  const weeks = sessions.reduce((acc, s) => {
    (acc[s.weekNumber] ??= []).push(s);
    return acc;
  }, {} as Record<number, typeof sessions>);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">{courseCode}</Badge>
        <Badge variant="outline">{overview.variant}</Badge>
        <Badge variant="outline">CEFR {overview.cefrLevel}</Badge>
        <Badge variant="outline">→ Band {overview.targetBandOut}</Badge>
        <Badge variant="outline" className={syllabusStatusColors[syllabus.status]}>{syllabusStatusLabels[syllabus.status]}</Badge>
        <span className="text-xs text-muted-foreground ml-auto">{syllabus.version} • {syllabus.lastUpdated}</span>
      </div>

      <Section icon={GraduationCap} title="1. Tổng quan khóa học">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Stat label="Hình thức" value={overview.learningMode} />
          <Stat label="Tổng thời lượng" value={`${overview.totalWeeks} tuần`} />
          <Stat label="Số buổi/tuần" value={`${overview.sessionsPerWeek} buổi`} />
          <Stat label="Thời lượng/buổi" value={`${overview.hoursPerSession} giờ`} />
          <Stat label="Sĩ số tối đa" value={`${overview.maxStudents} HV`} />
          <Stat label="Band đầu vào" value={overview.targetBandIn.toFixed(1)} />
          <Stat label="Band mục tiêu" value={overview.targetBandOut.toFixed(1)} />
          <Stat label="Phí tài liệu" value={overview.materialsFee ? formatVND(overview.materialsFee) : '—'} />
        </div>
      </Section>

      <Section icon={Target} title="2. Đối tượng học viên">
        <div><span className="font-semibold">Hồ sơ đầu vào:</span> {targetLearners.entryProfile}</div>
        <div><span className="font-semibold">Hồ sơ đầu ra:</span> {targetLearners.exitProfile}</div>
        <div>
          <div className="font-semibold">Yêu cầu tiên quyết:</div>
          <ul className="list-disc list-inside text-muted-foreground">
            {targetLearners.prerequisites.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </div>
        <div className="text-xs text-muted-foreground">Yêu cầu test xếp lớp: {targetLearners.placementTestRequired ? 'Có' : 'Không'}</div>
      </Section>

      <Section icon={BookMarked} title={`3. Mục tiêu khóa học (${objectives.length})`}>
        <div className="grid md:grid-cols-2 gap-2">
          {objectives.map((o) => (
            <div key={o.id} className="flex items-start gap-2 rounded-md border border-border/60 p-2">
              <Badge variant="outline" className="text-[10px]">{o.skill}</Badge>
              <span className="text-xs text-muted-foreground">{o.description}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section icon={LibraryIcon} title={`4. Học liệu (${materials.length})`}>
        <Table>
          <TableHeader><TableRow><TableHead>Loại</TableHead><TableHead>Tài liệu</TableHead><TableHead>Tác giả / NXB</TableHead><TableHead>Bắt buộc</TableHead></TableRow></TableHeader>
          <TableBody>
            {materials.map((m) => (
              <TableRow key={m.id}>
                <TableCell><Badge variant="outline">{materialTypeLabels[m.type]}</Badge></TableCell>
                <TableCell className="font-medium">{m.title}{m.url && <a href={m.url} target="_blank" rel="noreferrer" className="ml-2 text-xs text-primary underline">link</a>}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{[m.author, m.publisher].filter(Boolean).join(' • ') || '—'}</TableCell>
                <TableCell>{m.required ? <Badge variant="outline" className="bg-success/10 text-success border-success/20">Có</Badge> : <span className="text-xs text-muted-foreground">—</span>}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Section>

      <Section icon={CalendarDays} title={`5. Lịch trình chi tiết — ${sessions.length} buổi`}>
        <Accordion type="multiple" className="w-full">
          {Object.keys(weeks).map((wk) => (
            <AccordionItem key={wk} value={`w${wk}`}>
              <AccordionTrigger className="text-sm">Tuần {wk} ({weeks[Number(wk)].length} buổi)</AccordionTrigger>
              <AccordionContent className="space-y-2">
                {weeks[Number(wk)].map((s) => (
                  <div key={s.id} className="rounded-md border border-border/60 p-3 space-y-1">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="font-semibold text-sm">Buổi {s.order}: {s.title}</div>
                      <div className="flex gap-1 flex-wrap">
                        {s.skillFocus.map((f) => <Badge key={f} variant="outline" className="text-[10px]">{f}</Badge>)}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">⏱ {s.durationMinutes} phút</div>
                    {s.objectives.length > 0 && (
                      <div className="text-xs"><span className="font-semibold">Mục tiêu:</span> {s.objectives.join(' • ')}</div>
                    )}
                    <div className="text-xs"><span className="font-semibold">Hoạt động:</span> {s.inClassActivities}</div>
                    <div className="text-xs"><span className="font-semibold">Bài tập:</span> {s.homework.description} <span className="text-muted-foreground">(~{s.homework.estimatedMinutes} phút)</span></div>
                    {s.assessment && <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 text-[10px]">Đánh giá: {s.assessment.type} ({s.assessment.weight}%)</Badge>}
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Section>

      <Section icon={Award} title="6. Đánh giá & Cho điểm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Stat label="Chuyên cần" value={`${assessment.attendanceWeight}%`} />
          <Stat label="Bài tập" value={`${assessment.homeworkWeight}%`} />
          <Stat label="Giữa kỳ" value={`${assessment.midtermWeight}%`} />
          <Stat label="Cuối kỳ" value={`${assessment.finalWeight}%`} />
        </div>
        <div className="text-sm">Mức đạt: <span className="font-bold text-primary">Band ≥ {assessment.passThresholdBand}</span></div>
        {assessment.notes && <div className="text-xs text-muted-foreground italic">{assessment.notes}</div>}
      </Section>

      <Section icon={Shield} title="7. Quy định lớp học">
        <PolicyRow label="Chuyên cần" text={policies.attendancePolicy} />
        <PolicyRow label="Đi muộn" text={policies.latePolicy} />
        <PolicyRow label="Bài tập" text={policies.homeworkPolicy} />
        <PolicyRow label="Học bù" text={policies.makeupPolicy} />
        <PolicyRow label="Hoàn phí" text={policies.refundPolicy} />
        {policies.customRules.length > 0 && (
          <div>
            <div className="font-semibold">Quy định khác:</div>
            <ul className="list-disc list-inside text-muted-foreground text-xs">
              {policies.customRules.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>
        )}
      </Section>
    </div>
  );
};

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-md border border-border/60 p-2">
    <div className="text-[10px] uppercase text-muted-foreground tracking-wider">{label}</div>
    <div className="font-semibold text-sm">{value}</div>
  </div>
);

const PolicyRow = ({ label, text }: { label: string; text: string }) => (
  <div className="text-xs"><span className="font-semibold">{label}:</span> <span className="text-muted-foreground">{text}</span></div>
);

export default SyllabusViewer;
