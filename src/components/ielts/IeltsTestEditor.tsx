import { useState } from 'react';
import { ArrowLeft, Save, Send, Archive, Copy, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  type IeltsTest, type IeltsSkill, type ListeningSection, type ReadingSection,
  type WritingSection, type SpeakingSection,
  testStatusColors,
} from '@/data/mockIeltsTests';
import ListeningEditor from './skills/ListeningEditor';
import ReadingEditor from './skills/ReadingEditor';
import WritingEditor from './skills/WritingEditor';
import SpeakingEditor from './skills/SpeakingEditor';

interface Props {
  test: IeltsTest;
  onChange: (t: IeltsTest) => void;
  onBack: () => void;
  onDuplicate?: (t: IeltsTest) => void;
  readOnly?: boolean;
}

const IeltsTestEditor = ({ test, onChange, onBack, onDuplicate, readOnly }: Props) => {
  const [activeTab, setActiveTab] = useState<IeltsSkill>(test.skills[0] ?? 'Listening');

  const touch = (patch: Partial<IeltsTest>) => {
    onChange({ ...test, ...patch, updatedAt: new Date().toISOString().slice(0, 10) });
  };

  const handlePublish = () => {
    touch({ status: 'Published' });
    toast.success('Test published');
  };
  const handleArchive = () => {
    touch({ status: 'Archived' });
    toast.success('Test archived');
  };
  const handleSaveDraft = () => {
    touch({ status: 'Draft' });
    toast.success('Draft saved');
  };
  const handleExport = () => toast.success('Exported to PDF (mock)');

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-display text-xl font-bold">{test.title}</h2>
              <Badge variant="outline" className={testStatusColors[test.status]}>{test.status}</Badge>
              <Badge variant="outline">{test.variant}</Badge>
            </div>
            <p className="text-xs text-muted-foreground font-mono">{test.code} • Updated {test.updatedAt}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {readOnly ? (
            <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
              <FileDown className="h-4 w-4" /> Export PDF
            </Button>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={handleSaveDraft} className="gap-2">
                <Save className="h-4 w-4" /> Save Draft
              </Button>
              {test.status !== 'Published' && (
                <Button size="sm" onClick={handlePublish} className="gap-2 gradient-hero">
                  <Send className="h-4 w-4" /> Publish
                </Button>
              )}
              {test.status !== 'Archived' && (
                <Button variant="outline" size="sm" onClick={handleArchive} className="gap-2">
                  <Archive className="h-4 w-4" /> Archive
                </Button>
              )}
              {onDuplicate && (
                <Button variant="outline" size="sm" onClick={() => onDuplicate(test)} className="gap-2">
                  <Copy className="h-4 w-4" /> Duplicate
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Meta */}
      <Card className="border-border/60">
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={test.title} onChange={(e) => touch({ title: e.target.value })} disabled={readOnly} />
          </div>
          <div className="space-y-2">
            <Label>Duration (minutes)</Label>
            <Input
              type="number"
              value={test.durationMinutes ?? ''}
              onChange={(e) => touch({ durationMinutes: Number(e.target.value) || undefined })}
              placeholder="165"
              disabled={readOnly}
            />
          </div>
          <div className="space-y-2">
            <Label>Tags (comma separated)</Label>
            <Input
              value={test.tags.join(', ')}
              onChange={(e) => touch({ tags: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
              disabled={readOnly}
            />
          </div>
          <div className="space-y-2 md:col-span-3">
            <Label>Description</Label>
            <Textarea
              rows={2}
              value={test.description ?? ''}
              onChange={(e) => touch({ description: e.target.value })}
              disabled={readOnly}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabs per skill */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as IeltsSkill)}>
        <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${test.skills.length}, minmax(0, 1fr))` }}>
          {test.skills.map((s) => (
            <TabsTrigger key={s} value={s}>{s}</TabsTrigger>
          ))}
        </TabsList>

        {test.skills.includes('Listening') && (
          <TabsContent value="Listening" className="mt-4">
            <ListeningEditor
              value={test.listening ?? { parts: [] }}
              onChange={(v: ListeningSection) => touch({ listening: v })}
              readOnly={readOnly}
            />
          </TabsContent>
        )}

        {test.skills.includes('Reading') && (
          <TabsContent value="Reading" className="mt-4">
            <ReadingEditor
              value={test.reading ?? { passages: [] }}
              onChange={(v: ReadingSection) => touch({ reading: v })}
              readOnly={readOnly}
            />
          </TabsContent>
        )}

        {test.skills.includes('Writing') && (
          <TabsContent value="Writing" className="mt-4">
            <WritingEditor
              value={test.writing ?? {
                task1: { taskNumber: 1, prompt: '', taskType: test.variant === 'Academic' ? 'BarChart' : 'Letter', minWords: 150, timeMinutes: 20 },
                task2: { taskNumber: 2, prompt: '', taskType: 'Opinion', minWords: 250, timeMinutes: 40 },
              }}
              onChange={(v: WritingSection) => touch({ writing: v })}
              variant={test.variant}
              readOnly={readOnly}
            />
          </TabsContent>
        )}

        {test.skills.includes('Speaking') && (
          <TabsContent value="Speaking" className="mt-4">
            <SpeakingEditor
              value={test.speaking ?? {
                part1: { topics: [] },
                part2: { cueCard: { topic: '', bullets: ['', '', '', ''] } },
                part3: { questions: [] },
              }}
              onChange={(v: SpeakingSection) => touch({ speaking: v })}
              readOnly={readOnly}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default IeltsTestEditor;
