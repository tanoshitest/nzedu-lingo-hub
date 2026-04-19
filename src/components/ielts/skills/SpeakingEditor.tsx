import { Plus, Trash2, Mic } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { type SpeakingSection, type SpeakingTopic } from '@/data/mockIeltsTests';

interface Props {
  value: SpeakingSection;
  onChange: (v: SpeakingSection) => void;
  readOnly?: boolean;
}

const SpeakingEditor = ({ value, onChange, readOnly }: Props) => {
  // ===== PART 1 =====
  const addTopic = () => {
    const topic: SpeakingTopic = { topic: '', questions: [''] };
    onChange({ ...value, part1: { topics: [...value.part1.topics, topic] } });
  };
  const removeTopic = (idx: number) => {
    onChange({ ...value, part1: { topics: value.part1.topics.filter((_, i) => i !== idx) } });
  };
  const updateTopic = (idx: number, patch: Partial<SpeakingTopic>) => {
    onChange({
      ...value,
      part1: { topics: value.part1.topics.map((t, i) => (i === idx ? { ...t, ...patch } : t)) },
    });
  };
  const addTopicQuestion = (tIdx: number) => {
    const t = value.part1.topics[tIdx];
    updateTopic(tIdx, { questions: [...t.questions, ''] });
  };
  const updateTopicQuestion = (tIdx: number, qIdx: number, v: string) => {
    const t = value.part1.topics[tIdx];
    updateTopic(tIdx, { questions: t.questions.map((q, i) => (i === qIdx ? v : q)) });
  };
  const removeTopicQuestion = (tIdx: number, qIdx: number) => {
    const t = value.part1.topics[tIdx];
    updateTopic(tIdx, { questions: t.questions.filter((_, i) => i !== qIdx) });
  };

  // ===== PART 2 =====
  const updateCueCard = (patch: Partial<typeof value.part2.cueCard>) => {
    onChange({ ...value, part2: { cueCard: { ...value.part2.cueCard, ...patch } } });
  };
  const updateBullet = (idx: number, v: string) => {
    updateCueCard({ bullets: value.part2.cueCard.bullets.map((b, i) => (i === idx ? v : b)) });
  };
  const addBullet = () => updateCueCard({ bullets: [...value.part2.cueCard.bullets, ''] });
  const removeBullet = (idx: number) =>
    updateCueCard({ bullets: value.part2.cueCard.bullets.filter((_, i) => i !== idx) });

  const followUps = value.part2.cueCard.followUpQuestions ?? [];
  const addFollowUp = () => updateCueCard({ followUpQuestions: [...followUps, ''] });
  const updateFollowUp = (idx: number, v: string) =>
    updateCueCard({ followUpQuestions: followUps.map((q, i) => (i === idx ? v : q)) });
  const removeFollowUp = (idx: number) =>
    updateCueCard({ followUpQuestions: followUps.filter((_, i) => i !== idx) });

  // ===== PART 3 =====
  const addP3Question = () =>
    onChange({ ...value, part3: { questions: [...value.part3.questions, ''] } });
  const updateP3Question = (idx: number, v: string) =>
    onChange({
      ...value,
      part3: { questions: value.part3.questions.map((q, i) => (i === idx ? v : q)) },
    });
  const removeP3Question = (idx: number) =>
    onChange({ ...value, part3: { questions: value.part3.questions.filter((_, i) => i !== idx) } });

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-display text-lg font-semibold">Speaking Section</h3>
        <p className="text-sm text-muted-foreground">3 parts • 11–14 minutes</p>
      </div>

      {/* PART 1 */}
      <Card className="border-border/60">
        <CardHeader className="pb-3 flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Mic className="h-4 w-4 text-primary" /> Part 1 — Introduction & Interview
          </CardTitle>
          {!readOnly && (
            <Button size="sm" variant="outline" onClick={addTopic} className="gap-1">
              <Plus className="h-3.5 w-3.5" /> Add Topic
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {value.part1.topics.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-md">
              No topics yet.
            </p>
          )}
          {value.part1.topics.map((t, tIdx) => (
            <div key={tIdx} className="rounded-md border border-border p-3 space-y-3">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Topic (e.g. Hometown)"
                  value={t.topic}
                  onChange={(e) => updateTopic(tIdx, { topic: e.target.value })}
                  disabled={readOnly}
                  className="font-semibold"
                />
                {!readOnly && (
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => removeTopic(tIdx)}>
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                )}
              </div>
              <div className="space-y-2">
                {t.questions.map((q, qIdx) => (
                  <div key={qIdx} className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-muted-foreground w-5">{qIdx + 1}.</span>
                    <Input
                      placeholder="Question"
                      value={q}
                      onChange={(e) => updateTopicQuestion(tIdx, qIdx, e.target.value)}
                      disabled={readOnly}
                    />
                    {!readOnly && (
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => removeTopicQuestion(tIdx, qIdx)}>
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    )}
                  </div>
                ))}
                {!readOnly && (
                  <Button size="sm" variant="ghost" onClick={() => addTopicQuestion(tIdx)} className="gap-1">
                    <Plus className="h-3 w-3" /> Add Question
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* PART 2 */}
      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Mic className="h-4 w-4 text-primary" /> Part 2 — Cue Card (Long Turn)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label>Cue Card Topic *</Label>
            <Input
              placeholder="Describe a book you enjoyed reading"
              value={value.part2.cueCard.topic}
              onChange={(e) => updateCueCard({ topic: e.target.value })}
              disabled={readOnly}
            />
          </div>
          <div className="space-y-2">
            <Label>You should say:</Label>
            {value.part2.cueCard.bullets.map((b, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">•</span>
                <Input
                  placeholder="What the book was about"
                  value={b}
                  onChange={(e) => updateBullet(idx, e.target.value)}
                  disabled={readOnly}
                />
                {!readOnly && (
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => removeBullet(idx)}>
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                )}
              </div>
            ))}
            {!readOnly && (
              <Button size="sm" variant="ghost" onClick={addBullet} className="gap-1">
                <Plus className="h-3 w-3" /> Add Bullet
              </Button>
            )}
          </div>
          <div className="space-y-2">
            <Label>Follow-up Questions (optional)</Label>
            {followUps.map((q, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Input
                  placeholder="Do you read often?"
                  value={q}
                  onChange={(e) => updateFollowUp(idx, e.target.value)}
                  disabled={readOnly}
                />
                {!readOnly && (
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => removeFollowUp(idx)}>
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                )}
              </div>
            ))}
            {!readOnly && (
              <Button size="sm" variant="ghost" onClick={addFollowUp} className="gap-1">
                <Plus className="h-3 w-3" /> Add Follow-up
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* PART 3 */}
      <Card className="border-border/60">
        <CardHeader className="pb-3 flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Mic className="h-4 w-4 text-primary" /> Part 3 — Discussion
          </CardTitle>
          {!readOnly && (
            <Button size="sm" variant="outline" onClick={addP3Question} className="gap-1">
              <Plus className="h-3.5 w-3.5" /> Add Question
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-2">
          {value.part3.questions.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-md">
              No discussion questions yet.
            </p>
          )}
          {value.part3.questions.map((q, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground w-5">{idx + 1}.</span>
              <Textarea
                rows={2}
                placeholder="Why do you think people read less nowadays?"
                value={q}
                onChange={(e) => updateP3Question(idx, e.target.value)}
                disabled={readOnly}
              />
              {!readOnly && (
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => removeP3Question(idx)}>
                  <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default SpeakingEditor;
