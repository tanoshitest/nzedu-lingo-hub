import { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, Trash2, Sparkles, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import {
  buildIeltsTemplate,
  defaultAssessment,
  defaultPolicies,
  materialTypeLabels,
  type CefrLevel,
  type CourseMaterial,
  type CourseSyllabus,
  type IeltsSkill,
  type IeltsVariant,
  type LearningMode,
  type LearningObjective,
  type MaterialType,
  type SessionPlan,
} from '@/data/mockSyllabus';
import SessionPlanDialog from './SessionPlanDialog';

interface CoursePayload {
  code: string;
  name: string;
  tuition: number;
  sessions: number;
  syllabus: CourseSyllabus;
}

interface Props {
  open: boolean;
  initial?: { code: string; name: string; tuition: number; sessions: number; syllabus?: CourseSyllabus } | null;
  onSave: (payload: CoursePayload) => void;
  onClose: () => void;
}

const emptySyllabus = (): CourseSyllabus => ({
  overview: { variant: 'Academic', targetBandIn: 4.0, targetBandOut: 6.5, cefrLevel: 'B2', totalWeeks: 12, sessionsPerWeek: 2, hoursPerSession: 2.5, learningMode: 'Offline', maxStudents: 12 },
  targetLearners: { entryProfile: '', exitProfile: '', prerequisites: [], placementTestRequired: true },
  objectives: [],
  materials: [],
  sessions: [],
  assessment: { ...defaultAssessment },
  policies: { ...defaultPolicies, customRules: [...defaultPolicies.customRules] },
  status: 'Draft',
  version: 'v1.0',
  lastUpdated: new Date().toISOString().slice(0, 10),
});

const SKILL_OPTS: IeltsSkill[] = ['Listening', 'Reading', 'Writing', 'Speaking'];
const MATERIAL_TYPES: MaterialType[] = ['Textbook', 'Workbook', 'OnlineResource', 'InternalDoc', 'TestBank'];

const SyllabusDesigner = ({ open, initial, onSave, onClose }: Props) => {
  const [meta, setMeta] = useState({ code: '', name: '', tuition: '0', sessions: '24' });
  const [s, setS] = useState<CourseSyllabus>(emptySyllabus());
  const [editingSession, setEditingSession] = useState<SessionPlan | null>(null);
  const [prereqInput, setPrereqInput] = useState('');
  const [ruleInput, setRuleInput] = useState('');
  const [newObj, setNewObj] = useState<{ skill: IeltsSkill; description: string }>({ skill: 'Listening', description: '' });
  const [newMat, setNewMat] = useState<Partial<CourseMaterial>>({ type: 'Textbook', title: '', required: true });

  useEffect(() => {
    if (open) {
      if (initial) {
        setMeta({ code: initial.code, name: initial.name, tuition: String(initial.tuition), sessions: String(initial.sessions) });
        setS(initial.syllabus ?? emptySyllabus());
      } else {
        setMeta({ code: '', name: '', tuition: '0', sessions: '24' });
        setS(emptySyllabus());
      }
    }
  }, [open, initial?.code]);

  const totalWeight = s.assessment.attendanceWeight + s.assessment.homeworkWeight + s.assessment.midtermWeight + s.assessment.finalWeight;

  const generateTemplate = (band: 5.5 | 6.5 | 7.0) => {
    const tpl = buildIeltsTemplate(band);
    setS(tpl);
    setMeta((m) => ({
      ...m,
      sessions: String(tpl.sessions.length),
      name: m.name || `IELTS ${band === 5.5 ? 'Foundation' : band === 6.5 ? 'Intensive' : 'Advanced'} ${band}`,
    }));
    toast.success(`Đã tạo template band ${band}`);
  };

  const submit = (publish: boolean) => {
    if (!meta.code || !meta.name) { toast.error('Vui lòng nhập mã + tên khóa học'); return; }
    if (Math.round(totalWeight) !== 100) { toast.error(`Tổng trọng số đánh giá phải = 100% (hiện tại ${totalWeight}%)`); return; }
    onSave({
      code: meta.code,
      name: meta.name,
      tuition: Number(meta.tuition) || 0,
      sessions: Number(meta.sessions) || s.sessions.length,
      syllabus: { ...s, status: publish ? 'Published' : 'Draft', lastUpdated: new Date().toISOString().slice(0, 10) },
    });
  };

  // Sessions helpers
  const reorderSessions = (list: SessionPlan[]) => list.map((x, i) => ({ ...x, order: i + 1, weekNumber: Math.floor(i / s.overview.sessionsPerWeek) + 1 }));
  const addSession = () => {
    const order = s.sessions.length + 1;
    const newS: SessionPlan = {
      id: `SES-${Date.now()}`,
      order,
      weekNumber: Math.floor((order - 1) / s.overview.sessionsPerWeek) + 1,
      title: 'Buổi học mới',
      durationMinutes: s.overview.hoursPerSession * 60,
      skillFocus: ['Listening'],
      objectives: [],
      inClassActivities: '',
      materialIds: [],
      homework: { description: '', estimatedMinutes: 60 },
    };
    setS({ ...s, sessions: [...s.sessions, newS] });
    setEditingSession(newS);
  };
  const saveSession = (sess: SessionPlan) => {
    setS({ ...s, sessions: reorderSessions(s.sessions.map((x) => x.id === sess.id ? sess : x).sort((a, b) => a.order - b.order)) });
    setEditingSession(null);
    toast.success('Đã cập nhật buổi học');
  };
  const removeSession = (id: string) => setS({ ...s, sessions: reorderSessions(s.sessions.filter((x) => x.id !== id)) });

  const weeks = useMemo(() => s.sessions.reduce((acc, ss) => { (acc[ss.weekNumber] ??= []).push(ss); return acc; }, {} as Record<number, SessionPlan[]>), [s.sessions]);

  return (
    <>
      <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
        <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between flex-wrap gap-2">
              <span>{initial ? 'Chỉnh sửa giáo trình' : 'Thiết kế giáo trình khóa học IELTS'}</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Sparkles className="h-4 w-4" /> Generate IELTS Template
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => generateTemplate(5.5)}>Foundation → Band 5.5</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => generateTemplate(6.5)}>Intensive → Band 6.5</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => generateTemplate(7.0)}>Advanced → Band 7.0</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </DialogTitle>
          </DialogHeader>

          {/* Meta info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="space-y-1"><Label>Mã khóa</Label><Input value={meta.code} onChange={(e) => setMeta({ ...meta, code: e.target.value })} placeholder="IELTS03" /></div>
            <div className="space-y-1 col-span-2"><Label>Tên khóa</Label><Input value={meta.name} onChange={(e) => setMeta({ ...meta, name: e.target.value })} placeholder="IELTS Advanced 7.0" /></div>
            <div className="space-y-1"><Label>Học phí (VNĐ)</Label><Input type="number" value={meta.tuition} onChange={(e) => setMeta({ ...meta, tuition: e.target.value })} /></div>
          </div>

          <Tabs defaultValue="overview">
            <TabsList className="flex-wrap h-auto">
              <TabsTrigger value="overview">1. Tổng quan</TabsTrigger>
              <TabsTrigger value="learners">2. Đối tượng</TabsTrigger>
              <TabsTrigger value="objectives">3. Mục tiêu</TabsTrigger>
              <TabsTrigger value="materials">4. Học liệu</TabsTrigger>
              <TabsTrigger value="schedule">5. Lịch trình</TabsTrigger>
              <TabsTrigger value="assessment">6. Đánh giá</TabsTrigger>
              <TabsTrigger value="policies">7. Quy định</TabsTrigger>
            </TabsList>

            {/* TAB 1 — Overview */}
            <TabsContent value="overview" className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="space-y-1"><Label>Variant</Label>
                <Select value={s.overview.variant} onValueChange={(v) => setS({ ...s, overview: { ...s.overview, variant: v as IeltsVariant } })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="Academic">Academic</SelectItem><SelectItem value="General Training">General Training</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label>CEFR Level</Label>
                <Select value={s.overview.cefrLevel} onValueChange={(v) => setS({ ...s, overview: { ...s.overview, cefrLevel: v as CefrLevel } })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{(['A2', 'B1', 'B2', 'C1', 'C2'] as CefrLevel[]).map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label>Hình thức</Label>
                <Select value={s.overview.learningMode} onValueChange={(v) => setS({ ...s, overview: { ...s.overview, learningMode: v as LearningMode } })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="Offline">Offline</SelectItem><SelectItem value="Online">Online</SelectItem><SelectItem value="Hybrid">Hybrid</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label>Band đầu vào</Label><Input type="number" step="0.5" value={s.overview.targetBandIn} onChange={(e) => setS({ ...s, overview: { ...s.overview, targetBandIn: Number(e.target.value) } })} /></div>
              <div className="space-y-1"><Label>Band mục tiêu</Label><Input type="number" step="0.5" value={s.overview.targetBandOut} onChange={(e) => setS({ ...s, overview: { ...s.overview, targetBandOut: Number(e.target.value) } })} /></div>
              <div className="space-y-1"><Label>Tổng số tuần</Label><Input type="number" value={s.overview.totalWeeks} onChange={(e) => setS({ ...s, overview: { ...s.overview, totalWeeks: Number(e.target.value) } })} /></div>
              <div className="space-y-1"><Label>Buổi/tuần</Label><Input type="number" value={s.overview.sessionsPerWeek} onChange={(e) => setS({ ...s, overview: { ...s.overview, sessionsPerWeek: Number(e.target.value) } })} /></div>
              <div className="space-y-1"><Label>Giờ/buổi</Label><Input type="number" step="0.5" value={s.overview.hoursPerSession} onChange={(e) => setS({ ...s, overview: { ...s.overview, hoursPerSession: Number(e.target.value) } })} /></div>
              <div className="space-y-1"><Label>Sĩ số tối đa</Label><Input type="number" value={s.overview.maxStudents} onChange={(e) => setS({ ...s, overview: { ...s.overview, maxStudents: Number(e.target.value) } })} /></div>
              <div className="space-y-1"><Label>Phí tài liệu</Label><Input type="number" value={s.overview.materialsFee ?? 0} onChange={(e) => setS({ ...s, overview: { ...s.overview, materialsFee: Number(e.target.value) } })} /></div>
            </TabsContent>

            {/* TAB 2 — Target Learners */}
            <TabsContent value="learners" className="mt-4 space-y-3">
              <div className="space-y-1"><Label>Hồ sơ đầu vào</Label><Textarea rows={2} value={s.targetLearners.entryProfile} onChange={(e) => setS({ ...s, targetLearners: { ...s.targetLearners, entryProfile: e.target.value } })} /></div>
              <div className="space-y-1"><Label>Hồ sơ đầu ra</Label><Textarea rows={2} value={s.targetLearners.exitProfile} onChange={(e) => setS({ ...s, targetLearners: { ...s.targetLearners, exitProfile: e.target.value } })} /></div>
              <div className="space-y-1">
                <Label>Yêu cầu tiên quyết</Label>
                {s.targetLearners.prerequisites.map((p, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input value={p} onChange={(e) => setS({ ...s, targetLearners: { ...s.targetLearners, prerequisites: s.targetLearners.prerequisites.map((x, j) => j === i ? e.target.value : x) } })} />
                    <Button variant="ghost" size="icon" onClick={() => setS({ ...s, targetLearners: { ...s.targetLearners, prerequisites: s.targetLearners.prerequisites.filter((_, j) => j !== i) } })}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input placeholder="Thêm yêu cầu..." value={prereqInput} onChange={(e) => setPrereqInput(e.target.value)} />
                  <Button size="sm" onClick={() => { if (prereqInput.trim()) { setS({ ...s, targetLearners: { ...s.targetLearners, prerequisites: [...s.targetLearners.prerequisites, prereqInput.trim()] } }); setPrereqInput(''); }}}><Plus className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
              <label className="flex items-center gap-2">
                <Checkbox checked={s.targetLearners.placementTestRequired} onCheckedChange={(v) => setS({ ...s, targetLearners: { ...s.targetLearners, placementTestRequired: !!v } })} />
                <span className="text-sm">Yêu cầu test xếp lớp</span>
              </label>
            </TabsContent>

            {/* TAB 3 — Objectives */}
            <TabsContent value="objectives" className="mt-4 space-y-3">
              {s.objectives.map((o) => (
                <Card key={o.id} className="border-border/60"><CardContent className="p-3 flex items-start gap-2">
                  <Badge variant="outline">{o.skill}</Badge>
                  <Input className="flex-1" value={o.description} onChange={(e) => setS({ ...s, objectives: s.objectives.map((x) => x.id === o.id ? { ...x, description: e.target.value } : x) })} />
                  <Button variant="ghost" size="icon" onClick={() => setS({ ...s, objectives: s.objectives.filter((x) => x.id !== o.id) })}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </CardContent></Card>
              ))}
              <Card className="border-dashed border-border/60"><CardContent className="p-3 flex items-center gap-2">
                <Select value={newObj.skill} onValueChange={(v) => setNewObj({ ...newObj, skill: v as IeltsSkill })}>
                  <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                  <SelectContent>{SKILL_OPTS.map((sk) => <SelectItem key={sk} value={sk}>{sk}</SelectItem>)}</SelectContent>
                </Select>
                <Input className="flex-1" placeholder="Mô tả CAN-DO..." value={newObj.description} onChange={(e) => setNewObj({ ...newObj, description: e.target.value })} />
                <Button onClick={() => { if (newObj.description.trim()) { const o: LearningObjective = { id: `O${Date.now()}`, skill: newObj.skill, description: newObj.description.trim() }; setS({ ...s, objectives: [...s.objectives, o] }); setNewObj({ skill: 'Listening', description: '' }); }}}><Plus className="h-4 w-4" /></Button>
              </CardContent></Card>
            </TabsContent>

            {/* TAB 4 — Materials */}
            <TabsContent value="materials" className="mt-4 space-y-3">
              <Card className="border-border/60"><CardContent className="p-0">
                <Table>
                  <TableHeader><TableRow><TableHead>Loại</TableHead><TableHead>Tài liệu</TableHead><TableHead>Tác giả</TableHead><TableHead>Bắt buộc</TableHead><TableHead></TableHead></TableRow></TableHeader>
                  <TableBody>
                    {s.materials.map((m) => (
                      <TableRow key={m.id}>
                        <TableCell><Badge variant="outline">{materialTypeLabels[m.type]}</Badge></TableCell>
                        <TableCell><Input value={m.title} onChange={(e) => setS({ ...s, materials: s.materials.map((x) => x.id === m.id ? { ...x, title: e.target.value } : x) })} /></TableCell>
                        <TableCell><Input value={m.author ?? ''} onChange={(e) => setS({ ...s, materials: s.materials.map((x) => x.id === m.id ? { ...x, author: e.target.value } : x) })} /></TableCell>
                        <TableCell><Checkbox checked={m.required} onCheckedChange={(v) => setS({ ...s, materials: s.materials.map((x) => x.id === m.id ? { ...x, required: !!v } : x) })} /></TableCell>
                        <TableCell><Button variant="ghost" size="icon" onClick={() => setS({ ...s, materials: s.materials.filter((x) => x.id !== m.id) })}><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
                      </TableRow>
                    ))}
                    {s.materials.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-4">Chưa có học liệu.</TableCell></TableRow>}
                  </TableBody>
                </Table>
              </CardContent></Card>
              <Card className="border-dashed border-border/60"><CardContent className="p-3 flex items-center gap-2">
                <Select value={newMat.type} onValueChange={(v) => setNewMat({ ...newMat, type: v as MaterialType })}>
                  <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                  <SelectContent>{MATERIAL_TYPES.map((t) => <SelectItem key={t} value={t}>{materialTypeLabels[t]}</SelectItem>)}</SelectContent>
                </Select>
                <Input className="flex-1" placeholder="Tên tài liệu..." value={newMat.title ?? ''} onChange={(e) => setNewMat({ ...newMat, title: e.target.value })} />
                <Button onClick={() => { if (newMat.title?.trim()) { const m: CourseMaterial = { id: `M${Date.now()}`, type: newMat.type as MaterialType, title: newMat.title.trim(), required: newMat.required ?? true }; setS({ ...s, materials: [...s.materials, m] }); setNewMat({ type: 'Textbook', title: '', required: true }); }}}><Plus className="h-4 w-4" /></Button>
              </CardContent></Card>
            </TabsContent>

            {/* TAB 5 — Schedule */}
            <TabsContent value="schedule" className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">{s.sessions.length} buổi học • Nhóm theo tuần</div>
                <Button onClick={addSession} size="sm" className="gap-1"><Plus className="h-3.5 w-3.5" /> Thêm buổi</Button>
              </div>
              <Accordion type="multiple" className="w-full">
                {Object.keys(weeks).sort((a, b) => Number(a) - Number(b)).map((wk) => (
                  <AccordionItem key={wk} value={`w${wk}`}>
                    <AccordionTrigger className="text-sm">Tuần {wk} ({weeks[Number(wk)].length} buổi)</AccordionTrigger>
                    <AccordionContent className="space-y-2">
                      {weeks[Number(wk)].map((sess) => (
                        <div key={sess.id} className="rounded-md border border-border/60 p-3 flex items-center justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm">Buổi {sess.order}: {sess.title}</div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {sess.skillFocus.map((f) => <Badge key={f} variant="outline" className="text-[10px]">{f}</Badge>)}
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => setEditingSession(sess)}><Pencil className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => removeSession(sess.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              {s.sessions.length === 0 && <p className="text-center text-muted-foreground text-sm py-6">Chưa có buổi học. Bấm "Thêm buổi" hoặc "Generate IELTS Template" để bắt đầu.</p>}
            </TabsContent>

            {/* TAB 6 — Assessment */}
            <TabsContent value="assessment" className="mt-4 space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="space-y-1"><Label>Chuyên cần (%)</Label><Input type="number" value={s.assessment.attendanceWeight} onChange={(e) => setS({ ...s, assessment: { ...s.assessment, attendanceWeight: Number(e.target.value) } })} /></div>
                <div className="space-y-1"><Label>Bài tập (%)</Label><Input type="number" value={s.assessment.homeworkWeight} onChange={(e) => setS({ ...s, assessment: { ...s.assessment, homeworkWeight: Number(e.target.value) } })} /></div>
                <div className="space-y-1"><Label>Giữa kỳ (%)</Label><Input type="number" value={s.assessment.midtermWeight} onChange={(e) => setS({ ...s, assessment: { ...s.assessment, midtermWeight: Number(e.target.value) } })} /></div>
                <div className="space-y-1"><Label>Cuối kỳ (%)</Label><Input type="number" value={s.assessment.finalWeight} onChange={(e) => setS({ ...s, assessment: { ...s.assessment, finalWeight: Number(e.target.value) } })} /></div>
              </div>
              <div className={`text-sm font-semibold ${Math.round(totalWeight) === 100 ? 'text-success' : 'text-destructive'}`}>Tổng trọng số: {totalWeight}% {Math.round(totalWeight) === 100 ? '✓' : '(phải = 100%)'}</div>
              <div className="space-y-1"><Label>Mức đạt (band)</Label><Input type="number" step="0.5" value={s.assessment.passThresholdBand} onChange={(e) => setS({ ...s, assessment: { ...s.assessment, passThresholdBand: Number(e.target.value) } })} /></div>
              <div className="space-y-1"><Label>Ghi chú</Label><Textarea rows={2} value={s.assessment.notes ?? ''} onChange={(e) => setS({ ...s, assessment: { ...s.assessment, notes: e.target.value } })} /></div>
            </TabsContent>

            {/* TAB 7 — Policies */}
            <TabsContent value="policies" className="mt-4 space-y-3">
              {([
                ['attendancePolicy', 'Quy định chuyên cần'],
                ['latePolicy', 'Quy định đi muộn'],
                ['homeworkPolicy', 'Quy định bài tập'],
                ['makeupPolicy', 'Quy định học bù'],
                ['refundPolicy', 'Quy định hoàn phí / chuyển khóa'],
              ] as const).map(([key, label]) => (
                <div key={key} className="space-y-1">
                  <Label>{label}</Label>
                  <Textarea rows={2} value={s.policies[key]} onChange={(e) => setS({ ...s, policies: { ...s.policies, [key]: e.target.value } })} />
                </div>
              ))}
              <div className="space-y-1">
                <Label>Quy định khác</Label>
                {s.policies.customRules.map((r, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input value={r} onChange={(e) => setS({ ...s, policies: { ...s.policies, customRules: s.policies.customRules.map((x, j) => j === i ? e.target.value : x) } })} />
                    <Button variant="ghost" size="icon" onClick={() => setS({ ...s, policies: { ...s.policies, customRules: s.policies.customRules.filter((_, j) => j !== i) } })}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input placeholder="Thêm quy định..." value={ruleInput} onChange={(e) => setRuleInput(e.target.value)} />
                  <Button size="sm" onClick={() => { if (ruleInput.trim()) { setS({ ...s, policies: { ...s.policies, customRules: [...s.policies.customRules, ruleInput.trim()] } }); setRuleInput(''); }}}><Plus className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="flex-wrap gap-2">
            <Button variant="outline" onClick={onClose}>Huỷ</Button>
            <Button variant="outline" onClick={() => submit(false)}>Lưu nháp</Button>
            <Button onClick={() => submit(true)} className="gradient-hero">Xuất bản</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <SessionPlanDialog
        open={!!editingSession}
        session={editingSession}
        sessionsPerWeek={s.overview.sessionsPerWeek}
        materials={s.materials}
        onSave={saveSession}
        onClose={() => setEditingSession(null)}
      />
    </>
  );
};

export default SyllabusDesigner;
