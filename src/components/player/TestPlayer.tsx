import { useMemo, useState } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import TimerBar from './TimerBar';
import ListeningPlayer from './ListeningPlayer';
import ReadingPlayer from './ReadingPlayer';
import WritingPlayer from './WritingPlayer';
import SpeakingPlayer from './SpeakingPlayer';
import { ieltsTests, type IeltsSkill, type QuestionGroup } from '@/data/mockIeltsTests';
import {
  attemptStore,
  rawToBand,
  type AttemptAnswer,
  type SpeakingResponse,
  type TestAttempt,
  type WritingResponse,
} from '@/data/mockTestAttempts';

interface Props {
  attempt: TestAttempt;
  durationMinutes: number;
  onExit: () => void;
}

const countWords = (t: string) => t.trim().split(/\s+/).filter(Boolean).length;

const matchAnswer = (user: string | string[] | undefined, correct: string | string[]): boolean => {
  if (user == null) return false;
  const norm = (x: string) => x.trim().toLowerCase();
  if (Array.isArray(correct)) {
    if (!Array.isArray(user)) return false;
    if (user.length !== correct.length) return false;
    const a = [...user].map(norm).sort();
    const b = [...correct].map(norm).sort();
    return a.every((v, i) => v === b[i]);
  }
  if (Array.isArray(user)) return false;
  return norm(user) === norm(correct);
};

const TestPlayer = ({ attempt, durationMinutes, onExit }: Props) => {
  const test = useMemo(() => ieltsTests.find((t) => t.id === attempt.testId), [attempt.testId]);
  const skills: IeltsSkill[] = test?.skills ?? [];
  const [tab, setTab] = useState<IeltsSkill>(skills[0] ?? 'Listening');
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [writing, setWriting] = useState<WritingResponse[]>(attempt.writingResponses ?? []);
  const [speaking, setSpeaking] = useState<SpeakingResponse[]>(attempt.speakingResponses ?? []);
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (!test) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Không tìm thấy đề thi.</p>
        <Button onClick={onExit} className="mt-4">Quay lại</Button>
      </div>
    );
  }

  const onAnswer = (n: number, v: string | string[]) => setAnswers((p) => ({ ...p, [n]: v }));
  const onWriting = (taskNumber: 1 | 2, text: string) => {
    setWriting((prev) => {
      const others = prev.filter((r) => r.taskNumber !== taskNumber);
      return [...others, { taskNumber, text, wordCount: countWords(text) }];
    });
  };
  const onSpeaking = (r: SpeakingResponse) => {
    setSpeaking((prev) => {
      const others = prev.filter((x) => !(x.partNumber === r.partNumber && x.promptIndex === r.promptIndex));
      return [...others, r];
    });
  };

  const collectGroups = (): { skill: 'Listening' | 'Reading'; group: QuestionGroup }[] => {
    const groups: { skill: 'Listening' | 'Reading'; group: QuestionGroup }[] = [];
    test.listening?.parts.forEach((p) => p.questionGroups.forEach((g) => groups.push({ skill: 'Listening', group: g })));
    test.reading?.passages.forEach((p) => p.questionGroups.forEach((g) => groups.push({ skill: 'Reading', group: g })));
    return groups;
  };

  const submit = () => {
    const allGroups = collectGroups();
    const answerList: AttemptAnswer[] = [];
    let listeningTotal = 0, readingTotal = 0, listeningCorrect = 0, readingCorrect = 0;
    allGroups.forEach(({ skill, group }) => {
      group.questions.forEach((q) => {
        const u = answers[q.number];
        const ok = matchAnswer(u, q.answer);
        answerList.push({ groupId: group.id, questionNumber: q.number, answer: u ?? '', isCorrect: ok });
        if (skill === 'Listening') { listeningTotal++; if (ok) listeningCorrect++; }
        if (skill === 'Reading') { readingTotal++; if (ok) readingCorrect++; }
      });
    });

    const hasW = skills.includes('Writing');
    const hasS = skills.includes('Speaking');
    const hasManual = hasW || hasS;

    const updated: TestAttempt = {
      ...attempt,
      status: hasManual ? 'Grading' : 'PendingApproval',
      answers: answerList,
      writingResponses: writing,
      speakingResponses: speaking,
      submittedAt: new Date().toISOString().slice(0, 10),
      autoScoreListening: skills.includes('Listening') ? listeningCorrect : undefined,
      autoScoreReading: skills.includes('Reading') ? readingCorrect : undefined,
      listeningTotal: skills.includes('Listening') ? listeningTotal : undefined,
      readingTotal: skills.includes('Reading') ? readingTotal : undefined,
      listeningBand: skills.includes('Listening') ? rawToBand(listeningCorrect, listeningTotal) : undefined,
      readingBand: skills.includes('Reading') ? rawToBand(readingCorrect, readingTotal) : undefined,
    };

    attemptStore.upsertAttempt(updated);
    toast.success(hasManual ? 'Đã nộp bài. Phần Writing/Speaking đang chờ giáo viên chấm.' : 'Đã nộp bài. Kết quả sẽ có sau khi duyệt.');
    onExit();
  };

  return (
    <div className="space-y-4">
      <div className="sticky top-0 z-30 -mx-4 md:-mx-6 lg:-mx-8 px-4 md:px-6 lg:px-8 py-3 bg-background/95 backdrop-blur-md border-b border-border flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Button variant="ghost" size="sm" onClick={onExit} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Thoát
          </Button>
          <div className="min-w-0">
            <div className="font-semibold truncate">{test.code} — {test.title}</div>
            <div className="text-xs text-muted-foreground truncate">{attempt.studentName}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <TimerBar durationSec={durationMinutes * 60} onExpire={() => { toast.error('Hết giờ — tự động nộp bài'); submit(); }} />
          <Button onClick={() => setConfirmOpen(true)} className="gap-2">
            <Send className="h-4 w-4" /> Nộp bài
          </Button>
        </div>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as IeltsSkill)}>
        <TabsList>
          {skills.map((s) => <TabsTrigger key={s} value={s}>{s}</TabsTrigger>)}
        </TabsList>

        {test.listening && skills.includes('Listening') && (
          <TabsContent value="Listening" className="mt-4">
            <ListeningPlayer section={test.listening} answers={answers} onAnswer={onAnswer} />
          </TabsContent>
        )}
        {test.reading && skills.includes('Reading') && (
          <TabsContent value="Reading" className="mt-4">
            <ReadingPlayer section={test.reading} answers={answers} onAnswer={onAnswer} />
          </TabsContent>
        )}
        {test.writing && skills.includes('Writing') && (
          <TabsContent value="Writing" className="mt-4">
            <WritingPlayer section={test.writing} responses={writing} onChange={onWriting} />
          </TabsContent>
        )}
        {test.speaking && skills.includes('Speaking') && (
          <TabsContent value="Speaking" className="mt-4">
            <SpeakingPlayer section={test.speaking} responses={speaking} onChange={onSpeaking} />
          </TabsContent>
        )}
      </Tabs>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Nộp bài?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn không thể chỉnh sửa câu trả lời sau khi nộp. Hệ thống sẽ tự chấm Listening / Reading; Writing / Speaking sẽ do giáo viên chấm.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Tiếp tục làm bài</AlertDialogCancel>
            <AlertDialogAction onClick={submit}>Xác nhận nộp bài</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TestPlayer;
