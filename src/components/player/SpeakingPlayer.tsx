import { Card, CardContent } from '@/components/ui/card';
import AudioRecorder from './AudioRecorder';
import { type SpeakingSection } from '@/data/mockIeltsTests';
import { type SpeakingResponse } from '@/data/mockTestAttempts';

interface Props {
  section: SpeakingSection;
  responses: SpeakingResponse[];
  onChange: (r: SpeakingResponse) => void;
  readOnly?: boolean;
}

const SpeakingPlayer = ({ section, responses, onChange, readOnly }: Props) => {
  const findResp = (part: 1 | 2 | 3, idx: number) =>
    responses.find((r) => r.partNumber === part && r.promptIndex === idx);

  const update = (part: 1 | 2 | 3, idx: number, prompt: string, audio: { audioBlobUrl?: string; audioFileName?: string; recordedDurationSec?: number }) => {
    onChange({
      partNumber: part,
      promptIndex: idx,
      prompt,
      audioBlobUrl: audio.audioBlobUrl,
      audioFileName: audio.audioFileName,
      recordedDurationSec: audio.recordedDurationSec,
    });
  };

  const renderRecorder = (part: 1 | 2 | 3, idx: number, prompt: string, maxSec: number) => {
    const r = findResp(part, idx);
    return (
      <AudioRecorder
        value={r ? { audioBlobUrl: r.audioBlobUrl, audioFileName: r.audioFileName, recordedDurationSec: r.recordedDurationSec } : undefined}
        onChange={(v) => update(part, idx, prompt, v)}
        readOnly={readOnly}
        maxSec={maxSec}
      />
    );
  };

  let idxCounter = 0;

  return (
    <div className="space-y-6">
      {/* Part 1 */}
      <Card className="border-border/60">
        <CardContent className="p-4 space-y-4">
          <div className="font-display font-semibold text-lg">Part 1 — Introduction & interview</div>
          {section.part1.topics.map((topic, ti) => (
            <div key={ti} className="space-y-3">
              <div className="font-medium text-sm">Topic: {topic.topic}</div>
              {topic.questions.map((q, qi) => {
                const idx = idxCounter++;
                return (
                  <div key={qi} className="rounded-md border border-border bg-card p-3 space-y-2">
                    <div className="text-sm">{q}</div>
                    {renderRecorder(1, idx, q, 30)}
                  </div>
                );
              })}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Part 2 */}
      <Card className="border-border/60">
        <CardContent className="p-4 space-y-3">
          <div className="font-display font-semibold text-lg">Part 2 — Long turn (Cue Card)</div>
          <div className="rounded-md border border-border bg-muted/30 p-4 space-y-2">
            <div className="font-semibold">{section.part2.cueCard.topic}</div>
            <div className="text-sm">You should say:</div>
            <ul className="list-disc pl-6 text-sm">
              {section.part2.cueCard.bullets.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
          </div>
          {renderRecorder(2, 0, section.part2.cueCard.topic, 120)}
        </CardContent>
      </Card>

      {/* Part 3 */}
      <Card className="border-border/60">
        <CardContent className="p-4 space-y-3">
          <div className="font-display font-semibold text-lg">Part 3 — Discussion</div>
          {section.part3.questions.map((q, qi) => (
            <div key={qi} className="rounded-md border border-border bg-card p-3 space-y-2">
              <div className="text-sm">{q}</div>
              {renderRecorder(3, qi, q, 45)}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default SpeakingPlayer;
