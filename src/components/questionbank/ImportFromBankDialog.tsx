import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Database } from 'lucide-react';
import { toast } from 'sonner';
import { useBankItems, bankStore } from './bankStore';
import {
  type BankItem, type BankSkill,
  bankDifficultyColors,
} from '@/data/mockQuestionBank';
import { type QuestionGroup, questionTypeLabels, presentationLabels } from '@/data/mockIeltsTests';

interface Props {
  open: boolean;
  onClose: () => void;
  skill: BankSkill;
  startNumber: number;             // first question number to assign in target test
  onImport: (groups: QuestionGroup[]) => void;
}

const cloneGroup = (src: QuestionGroup, baseNumber: number, idSuffix: number): QuestionGroup => {
  return {
    ...src,
    id: `QG-${Date.now()}-${idSuffix}`,
    wordBank: src.wordBank ? [...src.wordBank] : undefined,
    questions: src.questions.map((q, i) => ({
      ...q,
      number: baseNumber + i,
      options: q.options ? [...q.options] : undefined,
      answer: Array.isArray(q.answer) ? [...q.answer] : q.answer,
    })),
  };
};

const ImportFromBankDialog = ({ open, onClose, skill, startNumber, onImport }: Props) => {
  const items = useBankItems();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (open) setSelected(new Set());
  }, [open]);

  const filtered = items.filter((it) => {
    if (it.skill !== skill) return false;
    if (search) {
      const q = search.toLowerCase();
      const hay = [it.title, it.id, ...it.tags, questionTypeLabels[it.group.type]].join(' ').toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  const toggle = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const handleImport = () => {
    if (selected.size === 0) {
      toast.error('Select at least one item');
      return;
    }
    let cursor = startNumber;
    const groups: QuestionGroup[] = [];
    let i = 0;
    items.forEach((it) => {
      if (selected.has(it.id)) {
        const cloned = cloneGroup(it.group, cursor, i++);
        groups.push(cloned);
        cursor += cloned.questions.length;
        bankStore.incrementUsage(it.id);
      }
    });
    onImport(groups);
    toast.success(`Imported ${groups.length} group(s) — ${cursor - startNumber} questions`);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" /> Import from Question Bank — {skill}
          </DialogTitle>
          <DialogDescription>
            Selected items are copied (snapshot) into this test. Question numbers will continue from #{startNumber}. Editing them later won't change the bank.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search title, type, tag..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8" />
          </div>

          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8 border border-dashed rounded-md">
              No matching items in the bank.
            </p>
          ) : (
            <div className="space-y-2 max-h-[55vh] overflow-y-auto pr-1">
              {filtered.map((it) => {
                const checked = selected.has(it.id);
                return (
                  <Card
                    key={it.id}
                    className={`border-border/60 cursor-pointer transition-colors ${checked ? 'bg-primary/5 border-primary/40' : 'hover:bg-muted/40'}`}
                    onClick={() => toggle(it.id)}
                  >
                    <CardContent className="p-3 flex items-start gap-3">
                      <Checkbox checked={checked} onCheckedChange={() => toggle(it.id)} className="mt-1" />
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs text-muted-foreground">{it.id}</span>
                          <span className="font-medium">{it.title}</span>
                          <Badge variant="outline" className={bankDifficultyColors[it.difficulty]}>{it.difficulty}</Badge>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground">
                          <Badge variant="outline">{questionTypeLabels[it.group.type]}</Badge>
                          <Badge variant="outline">{presentationLabels[it.group.presentation]}</Badge>
                          <span>{it.group.questions.length} questions</span>
                          <span>•</span>
                          <span>used {it.usageCount}×</span>
                        </div>
                        {(it.passageExcerpt || it.audioContext) && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {it.passageExcerpt ?? it.audioContext}
                          </p>
                        )}
                        {it.tags.length > 0 && (
                          <div className="flex gap-1 flex-wrap">
                            {it.tags.map((t, i) => (
                              <Badge key={i} variant="outline" className="text-[10px] py-0">{t}</Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        <DialogFooter>
          <div className="flex-1 text-sm text-muted-foreground self-center">
            {selected.size > 0 && `${selected.size} selected`}
          </div>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleImport} className="gradient-hero" disabled={selected.size === 0}>
            Import Selected
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportFromBankDialog;
