import { Card, CardContent } from '@/components/ui/card';
import QuestionRenderer from './QuestionRenderer';
import { type ReadingSection } from '@/data/mockIeltsTests';

interface Props {
  section: ReadingSection;
  answers: Record<number, string | string[]>;
  onAnswer: (n: number, v: string | string[]) => void;
  readOnly?: boolean;
}

const ReadingPlayer = ({ section, answers, onAnswer, readOnly }: Props) => {
  return (
    <div className="space-y-6">
      {section.passages.map((p) => (
        <Card key={p.passageNumber} className="border-border/60">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center gap-3 border-b border-border pb-3">
              <div className="h-9 w-9 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-bold">{p.passageNumber}</div>
              <div>
                <div className="font-semibold">Passage {p.passageNumber}: {p.title}</div>
                {p.source && <div className="text-xs text-muted-foreground">{p.source}</div>}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="lg:sticky lg:top-24 max-h-[70vh] overflow-y-auto rounded-md border border-border bg-card p-4">
                <div className="font-display font-semibold mb-2">{p.title}</div>
                <div className="text-sm whitespace-pre-wrap leading-relaxed">{p.body}</div>
              </div>

              <div className="space-y-6">
                {p.questionGroups.map((g) => (
                  <QuestionRenderer key={g.id} group={g} answers={answers} onAnswer={onAnswer} readOnly={readOnly} />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ReadingPlayer;
