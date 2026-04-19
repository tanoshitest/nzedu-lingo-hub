import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import {
  type QuestionGroup, type Question, type QuestionType, type Presentation,
  questionTypeLabels, presentationLabels, allowedPresentations, defaultInstructionByType,
} from '@/data/mockIeltsTests';

interface Props {
  open: boolean;
  onClose: () => void;
  initial?: QuestionGroup | null;
  startNumber: number;
  onSave: (group: QuestionGroup) => void;
}

const emptyGroup = (start: number): QuestionGroup => ({
  id: `QG-${Date.now()}`,
  type: 'MultipleChoice',
  presentation: 'Radio',
  instruction: defaultInstructionByType['MultipleChoice'],
  wordLimit: '',
  wordBank: [],
  imageFileName: '',
  questions: [
    { number: start, prompt: '', options: ['', '', '', ''], answer: '', points: 1 },
  ],
});

const QuestionGroupDialog = ({ open, onClose, initial, startNumber, onSave }: Props) => {
  const [g, setG] = useState<QuestionGroup>(emptyGroup(startNumber));
  const [useWordBank, setUseWordBank] = useState(false);
  const [wordBankText, setWordBankText] = useState('');

  useEffect(() => {
    if (open) {
      if (initial) {
        setG(initial);
        setUseWordBank(Array.isArray(initial.wordBank) && initial.wordBank.length > 0);
        setWordBankText((initial.wordBank ?? []).join('\n'));
      } else {
        setG(emptyGroup(startNumber));
        setUseWordBank(false);
        setWordBankText('');
      }
    }
  }, [open, initial, startNumber]);

  const updateType = (type: QuestionType) => {
    const allowed = allowedPresentations[type];
    const suggestedPres: Presentation = allowed.includes(g.presentation) ? g.presentation : allowed[0];
    setG({ ...g, type, presentation: suggestedPres, instruction: defaultInstructionByType[type] });
  };

  const addQuestion = () => {
    const lastNum = g.questions.length ? g.questions[g.questions.length - 1].number : startNumber - 1;
    setG({
      ...g,
      questions: [...g.questions, {
        number: lastNum + 1,
        prompt: '',
        options: g.type === 'MultipleChoice' ? ['', '', '', ''] : undefined,
        answer: '',
        points: 1,
      }],
    });
  };

  const removeQuestion = (idx: number) => {
    setG({ ...g, questions: g.questions.filter((_, i) => i !== idx) });
  };

  const updateQuestion = (idx: number, patch: Partial<Question>) => {
    setG({ ...g, questions: g.questions.map((q, i) => i === idx ? { ...q, ...patch } : q) });
  };

  const handleSave = () => {
    if (!g.instruction.trim()) {
      toast.error('Please enter an instruction');
      return;
    }
    if (g.questions.length === 0) {
      toast.error('Please add at least one question');
      return;
    }
    const wordBank = useWordBank
      ? wordBankText.split('\n').map((s) => s.trim()).filter(Boolean)
      : undefined;
    onSave({ ...g, wordBank });
    toast.success('Question group saved');
    onClose();
  };

  const allowedPres = allowedPresentations[g.type];
  const wordBankCompatible = ['DragDrop', 'Dropdown'].includes(g.presentation);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initial ? 'Edit Question Group' : 'Add Question Group'}</DialogTitle>
          <DialogDescription>Configure question type, presentation, and questions.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Type + Presentation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Question Type *</Label>
              <Select value={g.type} onValueChange={(v) => updateType(v as QuestionType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {(Object.keys(questionTypeLabels) as QuestionType[]).map((t) => (
                    <SelectItem key={t} value={t}>{questionTypeLabels[t]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Presentation *</Label>
              <Select value={g.presentation} onValueChange={(v) => setG({ ...g, presentation: v as Presentation })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {allowedPres.map((p) => (
                    <SelectItem key={p} value={p}>{presentationLabels[p]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Allowed for this question type: {allowedPres.map((p) => p).join(', ')}</p>
            </div>
          </div>

          {/* Instruction */}
          <div className="space-y-2">
            <Label>Instruction *</Label>
            <Textarea rows={2} value={g.instruction} onChange={(e) => setG({ ...g, instruction: e.target.value })} />
          </div>

          {/* Word Limit */}
          <div className="space-y-2">
            <Label>Word Limit (optional)</Label>
            <Input value={g.wordLimit ?? ''} onChange={(e) => setG({ ...g, wordLimit: e.target.value })} placeholder="e.g. NO MORE THAN TWO WORDS" />
          </div>

          {/* Word Bank toggle */}
          <div className="rounded-lg border border-border p-3 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-semibold">Use Word Bank</Label>
                <p className="text-xs text-muted-foreground">
                  Enable to let students choose from a fixed list of words (A, B, C…).
                  {!wordBankCompatible && ' (Current presentation doesn\'t support word bank — switch to Drag & Drop or Dropdown.)'}
                </p>
              </div>
              <Switch checked={useWordBank} onCheckedChange={setUseWordBank} disabled={!wordBankCompatible} />
            </div>
            {useWordBank && wordBankCompatible && (
              <div className="space-y-1">
                <Label className="text-xs">Words (one per line — labels A, B, C… auto-generated)</Label>
                <Textarea
                  rows={5}
                  value={wordBankText}
                  onChange={(e) => setWordBankText(e.target.value)}
                  placeholder={'sustainable\nindustrial\npopulation\n...'}
                />
              </div>
            )}
          </div>

          {/* Image for Map/Diagram */}
          {(g.type === 'MapPlanLabel' || g.type === 'DiagramLabel') && (
            <div className="space-y-2">
              <Label>Image File (mock — just file name)</Label>
              <Input value={g.imageFileName ?? ''} onChange={(e) => setG({ ...g, imageFileName: e.target.value })} placeholder="diagram.png" />
            </div>
          )}

          {/* Questions list */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">Questions ({g.questions.length})</Label>
              <Button type="button" size="sm" variant="outline" onClick={addQuestion} className="gap-1">
                <Plus className="h-3.5 w-3.5" /> Add Question
              </Button>
            </div>

            {g.questions.map((q, idx) => (
              <div key={idx} className="rounded-md border border-border p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-primary">Question #{q.number}</span>
                  <Button type="button" size="icon" variant="ghost" className="h-7 w-7" onClick={() => removeQuestion(idx)}>
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <Input
                    placeholder="Question prompt"
                    value={q.prompt}
                    onChange={(e) => updateQuestion(idx, { prompt: e.target.value })}
                  />
                  {g.type === 'MultipleChoice' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {(q.options ?? ['', '', '', '']).map((opt, oi) => (
                        <Input
                          key={oi}
                          placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                          value={opt}
                          onChange={(e) => {
                            const opts = [...(q.options ?? ['', '', '', ''])];
                            opts[oi] = e.target.value;
                            updateQuestion(idx, { options: opts });
                          }}
                        />
                      ))}
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div className="md:col-span-2">
                      <Input
                        placeholder="Answer"
                        value={Array.isArray(q.answer) ? q.answer.join(', ') : q.answer}
                        onChange={(e) => updateQuestion(idx, { answer: e.target.value })}
                      />
                    </div>
                    <Input
                      type="number"
                      placeholder="Points"
                      value={q.points}
                      onChange={(e) => updateQuestion(idx, { points: Number(e.target.value) || 1 })}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} className="gradient-hero">Save Group</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionGroupDialog;
