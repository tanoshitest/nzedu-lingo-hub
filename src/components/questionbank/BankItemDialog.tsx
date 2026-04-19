import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Edit3, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  type BankItem, type BankSkill, type BankDifficulty,
} from '@/data/mockQuestionBank';
import {
  type QuestionGroup, type QuestionType, type Presentation,
  questionTypeLabels, presentationLabels, allowedPresentations, defaultInstructionByType,
} from '@/data/mockIeltsTests';
import QuestionGroupDialog from '../ielts/shared/QuestionGroupDialog';
import QuestionGroupCard from '../ielts/shared/QuestionGroupCard';

interface Props {
  open: boolean;
  onClose: () => void;
  initial?: BankItem | null;
  onSave: (item: BankItem) => void;
}

const emptyGroup = (): QuestionGroup => ({
  id: `BANK-QG-${Date.now()}`,
  type: 'MultipleChoice',
  presentation: 'Radio',
  instruction: defaultInstructionByType['MultipleChoice'],
  questions: [],
});

const BankItemDialog = ({ open, onClose, initial, onSave }: Props) => {
  const [skill, setSkill] = useState<BankSkill>('Reading');
  const [title, setTitle] = useState('');
  const [tagsText, setTagsText] = useState('');
  const [difficulty, setDifficulty] = useState<BankDifficulty>('Medium');
  const [context, setContext] = useState('');
  const [group, setGroup] = useState<QuestionGroup>(emptyGroup());
  const [groupDialogOpen, setGroupDialogOpen] = useState(false);

  useEffect(() => {
    if (open) {
      if (initial) {
        setSkill(initial.skill);
        setTitle(initial.title);
        setTagsText(initial.tags.join(', '));
        setDifficulty(initial.difficulty);
        setContext(initial.skill === 'Reading' ? (initial.passageExcerpt ?? '') : (initial.audioContext ?? ''));
        setGroup(initial.group);
      } else {
        setSkill('Reading');
        setTitle('');
        setTagsText('');
        setDifficulty('Medium');
        setContext('');
        setGroup(emptyGroup());
      }
    }
  }, [open, initial]);

  const handleSave = () => {
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    if (group.questions.length === 0) {
      toast.error('Please configure the question group first');
      return;
    }
    const tags = tagsText.split(',').map((s) => s.trim()).filter(Boolean);
    const now = new Date().toISOString().slice(0, 10);
    const item: BankItem = {
      id: initial?.id ?? `QB-${Date.now()}`,
      skill,
      title: title.trim(),
      tags,
      difficulty,
      createdBy: initial?.createdBy ?? 'Admin',
      createdAt: initial?.createdAt ?? now,
      updatedAt: now,
      usageCount: initial?.usageCount ?? 0,
      group,
      passageExcerpt: skill === 'Reading' ? context.trim() || undefined : undefined,
      audioContext: skill === 'Listening' ? context.trim() || undefined : undefined,
    };
    onSave(item);
    toast.success(initial ? 'Bank item updated' : 'Bank item created');
    onClose();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{initial ? 'Edit Bank Item' : 'New Bank Item'}</DialogTitle>
            <DialogDescription>
              A reusable question group. Once imported into a test, it will be copied (snapshot) — later edits to this bank item won't affect tests already using it.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2 md:col-span-2">
                <Label>Title *</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Travel agent booking — MCQ" />
              </div>
              <div className="space-y-2">
                <Label>Skill *</Label>
                <Select value={skill} onValueChange={(v) => setSkill(v as BankSkill)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Listening">Listening</SelectItem>
                    <SelectItem value="Reading">Reading</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Difficulty *</Label>
                <Select value={difficulty} onValueChange={(v) => setDifficulty(v as BankDifficulty)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Tags (comma separated)</Label>
                <Input value={tagsText} onChange={(e) => setTagsText(e.target.value)} placeholder="Part 1, Travel, Cambridge 17" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>{skill === 'Reading' ? 'Passage Excerpt' : 'Audio Context'}</Label>
                <Textarea
                  rows={3}
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder={
                    skill === 'Reading'
                      ? 'A short excerpt of the passage so reviewers can preview without opening the full text.'
                      : 'Describe the audio scene (speakers, topic, register).'
                  }
                />
              </div>
            </div>

            {/* Group preview/editor */}
            <Card className="border-border/60">
              <CardContent className="p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold">Question Group</Label>
                  <Button size="sm" variant="outline" onClick={() => setGroupDialogOpen(true)} className="gap-1">
                    {group.questions.length === 0 ? <Plus className="h-3.5 w-3.5" /> : <Edit3 className="h-3.5 w-3.5" />}
                    {group.questions.length === 0 ? 'Configure Group' : 'Edit Group'}
                  </Button>
                </div>
                {group.questions.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6 border border-dashed rounded-md">
                    No questions yet. Click "Configure Group".
                  </p>
                ) : (
                  <QuestionGroupCard group={group} readOnly />
                )}
              </CardContent>
            </Card>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave} className="gradient-hero">Save Bank Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <QuestionGroupDialog
        open={groupDialogOpen}
        onClose={() => setGroupDialogOpen(false)}
        initial={group.questions.length > 0 ? group : null}
        startNumber={1}
        onSave={(g) => setGroup(g)}
      />
    </>
  );
};

export default BankItemDialog;
