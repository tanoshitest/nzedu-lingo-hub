import { useState } from 'react';
import { Plus, Trash2, Music, FileText, Database } from 'lucide-react';
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
import { type ListeningSection, type ListeningPart, type QuestionGroup } from '@/data/mockIeltsTests';

interface Props {
  value: ListeningSection;
  onChange: (v: ListeningSection) => void;
  readOnly?: boolean;
}

const ListeningEditor = ({ value, onChange, readOnly }: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<{ partIdx: number; groupIdx: number } | null>(null);
  const [targetPartIdx, setTargetPartIdx] = useState<number | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [importTargetIdx, setImportTargetIdx] = useState<number | null>(null);

  const addPart = () => {
    if (value.parts.length >= 4) {
      toast.error('Maximum 4 parts');
      return;
    }
    const nextNum = (value.parts.length + 1) as 1 | 2 | 3 | 4;
    onChange({
      parts: [...value.parts, { partNumber: nextNum, context: '', audioFileName: '', questionGroups: [] }],
    });
  };

  const removePart = (idx: number) => {
    const parts = value.parts.filter((_, i) => i !== idx).map((p, i) => ({ ...p, partNumber: (i + 1) as 1 | 2 | 3 | 4 }));
    onChange({ parts });
  };

  const updatePart = (idx: number, patch: Partial<ListeningPart>) => {
    onChange({ parts: value.parts.map((p, i) => i === idx ? { ...p, ...patch } : p) });
  };

  const openNewGroup = (partIdx: number) => {
    setEditing(null);
    setTargetPartIdx(partIdx);
    setDialogOpen(true);
  };
  const openEditGroup = (partIdx: number, groupIdx: number) => {
    setEditing({ partIdx, groupIdx });
    setTargetPartIdx(partIdx);
    setDialogOpen(true);
  };
  const deleteGroup = (partIdx: number, groupIdx: number) => {
    const parts = [...value.parts];
    parts[partIdx] = { ...parts[partIdx], questionGroups: parts[partIdx].questionGroups.filter((_, i) => i !== groupIdx) };
    onChange({ parts });
    toast.success('Question group deleted');
  };

  const saveGroup = (g: QuestionGroup) => {
    if (targetPartIdx == null) return;
    const parts = [...value.parts];
    const qgs = [...parts[targetPartIdx].questionGroups];
    if (editing) qgs[editing.groupIdx] = g;
    else qgs.push(g);
    parts[targetPartIdx] = { ...parts[targetPartIdx], questionGroups: qgs };
    onChange({ parts });
  };

  const handleImportGroups = (groups: QuestionGroup[]) => {
    if (importTargetIdx == null) return;
    const parts = [...value.parts];
    parts[importTargetIdx] = {
      ...parts[importTargetIdx],
      questionGroups: [...parts[importTargetIdx].questionGroups, ...groups],
    };
    onChange({ parts });
  };

  // Calculate next question number across all parts
  const nextQuestionNumber = (): number => {
    const all = value.parts.flatMap((p) => p.questionGroups.flatMap((g) => g.questions.map((q) => q.number)));
    return all.length ? Math.max(...all) + 1 : 1;
  };

  const totalQuestions = value.parts.reduce((sum, p) => sum + p.questionGroups.reduce((s, g) => s + g.questions.length, 0), 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="font-display text-lg font-semibold">Listening Section</h3>
          <p className="text-sm text-muted-foreground">4 parts • {totalQuestions}/40 questions</p>
        </div>
        {!readOnly && (
          <Button onClick={addPart} className="gap-2" variant="outline" disabled={value.parts.length >= 4}>
            <Plus className="h-4 w-4" /> Add Part ({value.parts.length}/4)
          </Button>
        )}
      </div>

      {value.parts.length === 0 && (
        <Card className="border-dashed border-border/60">
          <CardContent className="py-12 text-center text-muted-foreground">
            <Music className="h-10 w-10 mx-auto mb-3 opacity-40" />
            No parts yet. Click "Add Part" to start building the listening section.
          </CardContent>
        </Card>
      )}

      <Accordion type="multiple" defaultValue={value.parts.map((_, i) => `part-${i}`)}>
        {value.parts.map((p, idx) => (
          <AccordionItem key={idx} value={`part-${idx}`} className="border border-border rounded-lg mb-2">
            <AccordionTrigger className="px-4 hover:no-underline">
              <div className="flex items-center gap-3 text-left flex-1">
                <div className="h-8 w-8 rounded-md bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                  {p.partNumber}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold">Part {p.partNumber}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {p.context || '(no context yet)'} • {p.questionGroups.reduce((s, g) => s + g.questions.length, 0)} questions
                  </div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2 md:col-span-2">
                  <Label>Context</Label>
                  <Textarea
                    rows={2}
                    value={p.context}
                    onChange={(e) => updatePart(idx, { context: e.target.value })}
                    placeholder="e.g. A conversation between a student and a travel agent..."
                    disabled={readOnly}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Audio File (mock)</Label>
                  <Input
                    value={p.audioFileName ?? ''}
                    onChange={(e) => updatePart(idx, { audioFileName: e.target.value })}
                    placeholder="listening_part1.mp3"
                    disabled={readOnly}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Duration (seconds)</Label>
                  <Input
                    type="number"
                    value={p.audioDurationSec ?? ''}
                    onChange={(e) => updatePart(idx, { audioDurationSec: Number(e.target.value) || undefined })}
                    placeholder="300"
                    disabled={readOnly}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="flex items-center gap-1"><FileText className="h-3.5 w-3.5" /> Transcript (optional)</Label>
                  <Textarea
                    rows={3}
                    value={p.transcript ?? ''}
                    onChange={(e) => updatePart(idx, { transcript: e.target.value })}
                    placeholder="Full transcript of the audio..."
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
                      <Button size="sm" variant="outline" onClick={() => openNewGroup(idx)} className="gap-1">
                        <Plus className="h-3.5 w-3.5" /> Add Group
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => removePart(idx)} className="gap-1 text-destructive">
                        <Trash2 className="h-3.5 w-3.5" /> Remove Part
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
                      onEdit={() => openEditGroup(idx, gi)}
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
        initial={editing && targetPartIdx != null ? value.parts[targetPartIdx].questionGroups[editing.groupIdx] : null}
        startNumber={nextQuestionNumber()}
        onSave={saveGroup}
      />

      <ImportFromBankDialog
        open={importOpen}
        onClose={() => setImportOpen(false)}
        skill="Listening"
        startNumber={nextQuestionNumber()}
        onImport={handleImportGroups}
      />
    </div>
  );
};

export default ListeningEditor;
