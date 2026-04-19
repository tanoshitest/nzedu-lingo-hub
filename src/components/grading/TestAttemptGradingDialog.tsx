import { useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { ieltsTests } from '@/data/mockIeltsTests';
import {
  attemptStore,
  type SpeakingResponse,
  type TestAttempt,
  type WritingResponse,
} from '@/data/mockTestAttempts';

interface Props {
  open: boolean;
  attempt: TestAttempt | null;
  gradedBy: string;
  onClose: () => void;
}

const avg4 = (a?: number, b?: number, c?: number, d?: number) => {
  const xs = [a, b, c, d].filter((x): x is number => typeof x === 'number' && !isNaN(x));
  if (xs.length === 0) return undefined;
  return Math.round((xs.reduce((s, x) => s + x, 0) / xs.length) * 2) / 2;
};

const roundHalf = (n: number) => Math.round(n * 2) / 2;

const TestAttemptGradingDialog = ({ open, attempt, gradedBy, onClose }: Props) => {
  const test = useMemo(() => ieltsTests.find((t) => t.id === attempt?.testId), [attempt?.testId]);
  const [writing, setWriting] = useState<WritingResponse[]>([]);
  const [speaking, setSpeaking] = useState<SpeakingResponse[]>([]);
  const [feedback, setFeedback] = useState('');

  // Sync when attempt changes
  useMemo(() => {
    if (attempt) {
      setWriting(attempt.writingResponses ?? []);
      setSpeaking(attempt.speakingResponses ?? []);
      setFeedback(attempt.teacherFeedback ?? '');
    }
  }, [attempt?.id]);

  if (!attempt || !test) return null;

  const updateWriting = (tn: 1 | 2, patch: Partial<WritingResponse>) => {
    setWriting((prev) => prev.map((w) => w.taskNumber === tn ? { ...w, ...patch, bandOverall: avg4(
      patch.taskAchievement ?? w.taskAchievement,
      patch.coherence ?? w.coherence,
      patch.lexical ?? w.lexical,
      patch.grammar ?? w.grammar,
    ) } : w));
  };

  const updateSpeaking = (idx: number, patch: Partial<SpeakingResponse>) => {
    setSpeaking((prev) => prev.map((s, i) => i === idx ? { ...s, ...patch } : s));
  };

  const computeWritingBand = (): number | undefined => {
    const w1 = writing.find((w) => w.taskNumber === 1)?.bandOverall;
    const w2 = writing.find((w) => w.taskNumber === 2)?.bandOverall;
    if (w1 == null && w2 == null) return undefined;
    // Task 2 weighted x2
    if (w1 != null && w2 != null) return roundHalf((w1 + w2 * 2) / 3);
    return w1 ?? w2;
  };

  const computeSpeakingBand = (): number | undefined => {
    const bands = speaking.map((s) => s.band).filter((x): x is number => typeof x === 'number');
    if (bands.length === 0) return undefined;
    return roundHalf(bands.reduce((s, x) => s + x, 0) / bands.length);
  };

  const submit = () => {
    const wBand = computeWritingBand();
    const sBand = computeSpeakingBand();
    const overall = avg4(attempt.listeningBand, attempt.readingBand, wBand, sBand);
    attemptStore.upsertAttempt({
      ...attempt,
      status: 'PendingApproval',
      writingResponses: writing,
      speakingResponses: speaking,
      writingBand: wBand,
      speakingBand: sBand,
      overallBand: overall,
      teacherFeedback: feedback,
      gradedBy,
      gradedAt: new Date().toISOString().slice(0, 10),
    });
    toast.success('Đã gửi kết quả chấm — Giáo vụ sẽ duyệt.');
    onClose();
  };

  const hasW = test.skills.includes('Writing');
  const hasS = test.skills.includes('Speaking');
  const hasL = test.skills.includes('Listening');
  const hasR = test.skills.includes('Reading');

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chấm bài — {attempt.studentName}</DialogTitle>
          <DialogDescription>{test.code} — {test.title}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={hasL ? 'LR' : hasW ? 'W' : 'S'}>
          <TabsList>
            {(hasL || hasR) && <TabsTrigger value="LR">Listening / Reading</TabsTrigger>}
            {hasW && <TabsTrigger value="W">Writing</TabsTrigger>}
            {hasS && <TabsTrigger value="S">Speaking</TabsTrigger>}
          </TabsList>

          {(hasL || hasR) && (
            <TabsContent value="LR" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-3">
                {hasL && (
                  <Card className="border-border/60"><CardContent className="p-4 text-center">
                    <div className="text-xs text-muted-foreground">Listening (auto)</div>
                    <div className="text-2xl font-bold">{attempt.autoScoreListening ?? 0}/{attempt.listeningTotal ?? 40}</div>
                    <Badge variant="outline" className="mt-1">Band {attempt.listeningBand ?? '—'}</Badge>
                  </CardContent></Card>
                )}
                {hasR && (
                  <Card className="border-border/60"><CardContent className="p-4 text-center">
                    <div className="text-xs text-muted-foreground">Reading (auto)</div>
                    <div className="text-2xl font-bold">{attempt.autoScoreReading ?? 0}/{attempt.readingTotal ?? 40}</div>
                    <Badge variant="outline" className="mt-1">Band {attempt.readingBand ?? '—'}</Badge>
                  </CardContent></Card>
                )}
              </div>
              {attempt.answers.length > 0 && (
                <Card className="border-border/60"><CardContent className="p-0">
                  <Table>
                    <TableHeader><TableRow>
                      <TableHead>#</TableHead><TableHead>Học viên trả lời</TableHead><TableHead>Kết quả</TableHead>
                    </TableRow></TableHeader>
                    <TableBody>
                      {attempt.answers.map((ans) => (
                        <TableRow key={ans.questionNumber}>
                          <TableCell className="font-mono text-xs">{ans.questionNumber}</TableCell>
                          <TableCell className="text-sm">{Array.isArray(ans.answer) ? ans.answer.join(', ') : (ans.answer || '—')}</TableCell>
                          <TableCell>
                            {ans.isCorrect
                              ? <Badge variant="outline" className="bg-success/10 text-success border-success/20">✓ Đúng</Badge>
                              : <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">✗ Sai</Badge>}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent></Card>
              )}
            </TabsContent>
          )}

          {hasW && (
            <TabsContent value="W" className="space-y-4 mt-4">
              {[1, 2].map((n) => {
                const w = writing.find((x) => x.taskNumber === n) ?? { taskNumber: n as 1 | 2, text: '', wordCount: 0 };
                return (
                  <Card key={n} className="border-border/60"><CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold">Task {n}</div>
                      <Badge variant="outline">{w.wordCount} words</Badge>
                    </div>
                    <div className="rounded-md border border-border bg-muted/30 p-3 text-sm whitespace-pre-wrap max-h-48 overflow-y-auto">
                      {w.text || '(chưa có bài làm)'}
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {(['taskAchievement', 'coherence', 'lexical', 'grammar'] as const).map((k) => (
                        <div key={k} className="space-y-1">
                          <Label className="text-xs capitalize">{k}</Label>
                          <Input
                            type="number" step="0.5" min={0} max={9}
                            value={w[k] ?? ''}
                            onChange={(e) => updateWriting(n as 1 | 2, { [k]: Number(e.target.value) } as Partial<WritingResponse>)}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Band task {n}: <span className="font-bold text-primary">{w.bandOverall ?? '—'}</span></span>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Feedback task {n}</Label>
                      <Textarea rows={2} value={w.feedback ?? ''} onChange={(e) => updateWriting(n as 1 | 2, { feedback: e.target.value })} />
                    </div>
                  </CardContent></Card>
                );
              })}
              <div className="text-sm">Writing band (trọng số Task 2 ×2): <span className="font-bold text-primary">{computeWritingBand() ?? '—'}</span></div>
            </TabsContent>
          )}

          {hasS && (
            <TabsContent value="S" className="space-y-4 mt-4">
              {speaking.length === 0 ? (
                <p className="text-sm text-muted-foreground">Học viên chưa ghi âm phần nói.</p>
              ) : (
                speaking.map((s, i) => (
                  <Card key={i} className="border-border/60"><CardContent className="p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Part {s.partNumber}</Badge>
                      <span className="text-sm font-medium">#{s.promptIndex + 1}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">{s.prompt}</div>
                    {s.audioBlobUrl ? (
                      <audio controls src={s.audioBlobUrl} className="w-full h-10" />
                    ) : s.audioFileName ? (
                      <div className="text-xs text-muted-foreground">File: {s.audioFileName}</div>
                    ) : (
                      <div className="text-xs text-muted-foreground">(Không có audio)</div>
                    )}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-xs">Band (0-9)</Label>
                        <Input type="number" step="0.5" min={0} max={9} value={s.band ?? ''} onChange={(e) => updateSpeaking(i, { band: Number(e.target.value) })} />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Feedback</Label>
                        <Input value={s.feedback ?? ''} onChange={(e) => updateSpeaking(i, { feedback: e.target.value })} />
                      </div>
                    </div>
                  </CardContent></Card>
                ))
              )}
              <div className="text-sm">Speaking band (trung bình): <span className="font-bold text-primary">{computeSpeakingBand() ?? '—'}</span></div>
            </TabsContent>
          )}
        </Tabs>

        <div className="space-y-1">
          <Label>Nhận xét tổng kết</Label>
          <Textarea rows={3} value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Nhận xét chung về bài làm của học viên..." />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Huỷ</Button>
          <Button onClick={submit}>Gửi kết quả duyệt</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TestAttemptGradingDialog;
