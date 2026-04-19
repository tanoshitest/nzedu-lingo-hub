import { Card, CardContent } from '@/components/ui/card';
import { Music } from 'lucide-react';
import QuestionRenderer from './QuestionRenderer';
import { type ListeningSection } from '@/data/mockIeltsTests';

interface Props {
  section: ListeningSection;
  answers: Record<number, string | string[]>;
  onAnswer: (n: number, v: string | string[]) => void;
  readOnly?: boolean;
}

const ListeningPlayer = ({ section, answers, onAnswer, readOnly }: Props) => {
  return (
    <div className="space-y-6">
      {section.parts.map((p) => (
        <Card key={p.partNumber} className="border-border/60">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center gap-3 border-b border-border pb-3">
              <div className="h-9 w-9 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-bold">{p.partNumber}</div>
              <div>
                <div className="font-semibold">Part {p.partNumber}</div>
                <div className="text-xs text-muted-foreground">{p.context}</div>
              </div>
            </div>

            <div className="rounded-md border border-border bg-muted/30 p-3 flex items-center gap-3">
              <Music className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <div className="text-sm font-medium">{p.audioFileName ?? '(no audio file)'}</div>
                <div className="text-xs text-muted-foreground">Audio mock — trong bản demo, file âm thanh chưa được gắn.</div>
              </div>
              <audio controls className="h-8" />
            </div>

            {p.questionGroups.map((g) => (
              <QuestionRenderer key={g.id} group={g} answers={answers} onAnswer={onAnswer} readOnly={readOnly} />
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ListeningPlayer;
