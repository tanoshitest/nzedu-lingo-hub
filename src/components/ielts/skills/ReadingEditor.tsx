import { useState } from 'react';
import { Plus, Trash2, BookOpen, Database } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from 'sonner';
import QuestionGroupCard from '../shared/QuestionGroupCard';
import QuestionGroupDialog from '../shared/QuestionGroupDialog';
import ImportFromBankDialog from '../../questionbank/ImportFromBankDialog';
import { type ReadingSection, type ReadingPassage, type QuestionGroup } from '@/data/mockIeltsTests';

interface Props {
  value: ReadingSection;
  onChange: (v: ReadingSection) => void;
  readOnly?: boolean;
}

const countWords = (t: string) => t.trim().split(/\s+/).filter(Boolean).length;

const ReadingEditor = ({ value, onChange, readOnly }: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<{ pIdx: number; gIdx: number } | null>(null);
  const [targetIdx, setTargetIdx] = useState<number | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [importTargetIdx, setImportTargetIdx] = useState<number | null>(null);

  const addPassage = () => {
    if (value.passages.length >= 3) {
      toast.error('Maximum 3 passages');
      return;
    }
    const nextNum = (value.passages.length + 1) as 1 | 2 | 3;
    onChange({
      passages: [...value.passages, { passageNumber: nextNum, title: '', body: '', questionGroups: [] }],
    });
  };

  const removePassage = (idx: number) => {
    const passages = value.passages.filter((_, i) => i !== idx).map((p, i) => ({ ...p, passageNumber: (i + 1) as 1 | 2 | 3 }));
    onChange({ passages });
  };

  const updatePassage = (idx: number, patch: Partial<ReadingPassage>) => {
    onChange({ passages: value.passages.map((p, i) => i === idx ? { ...p, ...patch } : p) });
  };

  const nextQuestionNumber = (): number => {
    const all = value.passages.flatMap((p) => p.questionGroups.flatMap((g) => g.questions.map((q) => q.number)));
    return all.length ? Math.max(...all) + 1 : 1;
  };

  const saveGroup = (g: QuestionGroup) => {
    if (targetIdx == null) return;
    const passages = [...value.passages];
    const qgs = [...passages[targetIdx].questionGroups];
    if (editing) qgs[editing.gIdx] = g;
    else qgs.push(g);
    passages[targetIdx] = { ...passages[targetIdx], questionGroups: qgs };
    onChange({ passages });
  };

  const deleteGroup = (pIdx: number, gIdx: number) => {
    const passages = [...value.passages];
    passages[pIdx] = { ...passages[pIdx], questionGroups: passages[pIdx].questionGroups.filter((_, i) => i !== gIdx) };
    onChange({ passages });
    toast.success('Question group deleted');
  };

  const handleImportGroups = (groups: QuestionGroup[]) => {
    if (importTargetIdx == null) return;
    const passages = [...value.passages];
    passages[importTargetIdx] = {
      ...passages[importTargetIdx],
      questionGroups: [...passages[importTargetIdx].questionGroups, ...groups],
    };
    onChange({ passages });
  };

  const totalQuestions = value.passages.reduce((s, p) => s + p.questionGroups.reduce((x, g) => x + g.questions.length, 0), 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="font-display text-lg font-semibold">Reading Section</h3>
          <p className="text-sm text-muted-foreground">3 passages • {totalQuestions}/40 questions</p>
        </div>
        {!readOnly && (
          <Button onClick={addPassage} className="gap-2" variant="outline" disabled={value.passages.length >= 3}>
            <Plus className="h-4 w-4" /> Add Passage ({value.passages.length}/3)
          </Button>
        )}
      </div>

      {value.passages.length === 0 && (
        <Card className="border-dashed border-border/60">
          <CardContent className="py-12 text-center text-muted-foreground">
            <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-40" />
            No passages yet. Click "Add Passage" to start.
          </CardContent>
        </Card>
      )}

      <Accordion type="multiple" defaultValue={value.passages.map((_, i) => `p-${i}`)}>
        {value.passages.map((p, idx) => (
          <AccordionItem key={idx} value={`p-${idx}`} className="border border-border rounded-lg mb-2">
            <AccordionTrigger className="px-4 hover:no-underline">
              <div className="flex items-center gap-3 text-left flex-1">
                <div className="h-8 w-8 rounded-md bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                  {p.passageNumber}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{p.title || `Passage ${p.passageNumber}`}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {p.wordCount ?? countWords(p.body)} words • {p.questionGroups.reduce((s, g) => s + g.questions.length, 0)} questions
                  </div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Input value={p.title} onChange={(e) => updatePassage(idx, { title: e.target.value })} placeholder="The History of Glass" disabled={readOnly} />
                </div>
                <div className="space-y-2">
                  <Label>Source</Label>
                  <Input value={p.source ?? ''} onChange={(e) => updatePassage(idx, { source: e.target.value })} placeholder="Cambridge IELTS 17" disabled={readOnly} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Passage Body * <span className="text-xs text-muted-foreground">({countWords(p.body)} words)</span></Label>
                  <Textarea
                    rows={10}
                    value={p.body}
                    onChange={(e) => updatePassage(idx, { body: e.target.value, wordCount: countWords(e.target.value) })}
                    placeholder="Paste the reading passage text here..."
                    disabled={readOnly}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold">Question Groups ({p.questionGroups.length})</Label>
                  {!readOnly && (
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => { setImportTargetIdx(idx); setImportOpen(true); }} className="gap-1">
                        <Database className="h-3.5 w-3.5" /> Import from Bank
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => { setEditing(null); setTargetIdx(idx); setDialogOpen(true); }} className="gap-1">
                        <Plus className="h-3.5 w-3.5" /> Add Group
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => removePassage(idx)} className="gap-1 text-destructive">
                        <Trash2 className="h-3.5 w-3.5" /> Remove Passage
                      </Button>
                    </div>
                  )}
                </div>

                {p.questionGroups.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6 border border-dashed rounded-md">
                    No question groups yet.
                  </p>
                ) : (
                  p.questionGroups.map((g, gi) => (
                    <QuestionGroupCard
                      key={g.id}
                      group={g}
                      readOnly={readOnly}
                      onEdit={() => { setEditing({ pIdx: idx, gIdx: gi }); setTargetIdx(idx); setDialogOpen(true); }}
                      onDelete={() => deleteGroup(idx, gi)}
                    />
                  ))
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <QuestionGroupDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        initial={editing && targetIdx != null ? value.passages[targetIdx].questionGroups[editing.gIdx] : null}
        startNumber={nextQuestionNumber()}
        onSave={saveGroup}
      />

      <ImportFromBankDialog
        open={importOpen}
        onClose={() => setImportOpen(false)}
        skill="Reading"
        startNumber={nextQuestionNumber()}
        onImport={handleImportGroups}
      />
    </div>
  );
};

export default ReadingEditor;
