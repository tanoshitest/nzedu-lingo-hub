import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import {
  type IeltsTest, type IeltsVariant, type IeltsSkill,
} from '@/data/mockIeltsTests';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (t: IeltsTest) => void;
  nextCodeNumber: number;
}

const allSkills: IeltsSkill[] = ['Listening', 'Reading', 'Writing', 'Speaking'];

const buildEmptyTest = (id: string, code: string, title: string, variant: IeltsVariant, skills: IeltsSkill[], tags: string[], description: string): IeltsTest => {
  const now = new Date().toISOString().slice(0, 10);
  const test: IeltsTest = {
    id,
    code,
    title,
    variant,
    skills,
    status: 'Draft',
    createdBy: 'Admin',
    createdAt: now,
    updatedAt: now,
    tags,
    description,
  };
  if (skills.includes('Listening')) test.listening = { parts: [] };
  if (skills.includes('Reading')) test.reading = { passages: [] };
  if (skills.includes('Writing')) test.writing = {
    task1: { taskNumber: 1, prompt: '', taskType: variant === 'Academic' ? 'BarChart' : 'Letter', minWords: 150, timeMinutes: 20 },
    task2: { taskNumber: 2, prompt: '', taskType: 'Opinion', minWords: 250, timeMinutes: 40 },
  };
  if (skills.includes('Speaking')) test.speaking = {
    part1: { topics: [] },
    part2: { cueCard: { topic: '', bullets: ['', '', '', ''] } },
    part3: { questions: [] },
  };
  return test;
};

const IeltsTestForm = ({ open, onClose, onCreate, nextCodeNumber }: Props) => {
  const [title, setTitle] = useState('');
  const [variant, setVariant] = useState<IeltsVariant>('Academic');
  const [skills, setSkills] = useState<IeltsSkill[]>(['Listening', 'Reading', 'Writing', 'Speaking']);
  const [tagsText, setTagsText] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (open) {
      setTitle('');
      setVariant('Academic');
      setSkills(['Listening', 'Reading', 'Writing', 'Speaking']);
      setTagsText('');
      setDescription('');
    }
  }, [open]);

  const code = `NZ-IELTS-${String(nextCodeNumber).padStart(3, '0')}`;

  const toggleSkill = (s: IeltsSkill) => {
    setSkills((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  };

  const handleCreate = () => {
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    if (skills.length === 0) {
      toast.error('Select at least one skill');
      return;
    }
    const tags = tagsText.split(',').map((s) => s.trim()).filter(Boolean);
    const t = buildEmptyTest(`IT-${Date.now()}`, code, title.trim(), variant, skills, tags, description.trim());
    onCreate(t);
    toast.success('Test created');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>New IELTS Test</DialogTitle>
          <DialogDescription>Create a new test paper. You can configure each section after creation.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2 md:col-span-2">
              <Label>Title *</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Cambridge 17 — Mock Test 1" />
            </div>
            <div className="space-y-2">
              <Label>Code (auto)</Label>
              <Input value={code} disabled />
            </div>
            <div className="space-y-2">
              <Label>Variant *</Label>
              <Select value={variant} onValueChange={(v) => setVariant(v as IeltsVariant)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Academic">Academic</SelectItem>
                  <SelectItem value="General Training">General Training</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Skills *</Label>
            <div className="flex gap-3 flex-wrap">
              {allSkills.map((s) => (
                <label key={s} className="flex items-center gap-2 rounded-md border border-border px-3 py-2 cursor-pointer hover:bg-muted/40">
                  <Checkbox checked={skills.includes(s)} onCheckedChange={() => toggleSkill(s)} />
                  <span className="text-sm">{s}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tags (comma separated)</Label>
            <Input value={tagsText} onChange={(e) => setTagsText(e.target.value)} placeholder="Cambridge 17, Band 6.5, Mock Test" />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Notes about this test..." />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleCreate} className="gradient-hero">Create Test</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default IeltsTestForm;
