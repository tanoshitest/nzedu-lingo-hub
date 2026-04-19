import { Pencil, Trash2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { type QuestionGroup, questionTypeLabels, presentationLabels } from '@/data/mockIeltsTests';

interface Props {
  group: QuestionGroup;
  readOnly?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const QuestionGroupCard = ({ group, readOnly, onEdit, onDelete }: Props) => {
  const range = group.questions.length
    ? `Q${group.questions[0].number}${group.questions.length > 1 ? `–${group.questions[group.questions.length - 1].number}` : ''}`
    : '—';

  return (
    <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-3">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="space-y-1 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">{range}</Badge>
            <Badge variant="outline" className="bg-info/10 text-info border-info/20">{questionTypeLabels[group.type]}</Badge>
            <Badge variant="outline">{presentationLabels[group.presentation]}</Badge>
            {group.wordBank && group.wordBank.length > 0 && (
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">Word Bank ({group.wordBank.length})</Badge>
            )}
            {group.imageFileName && (
              <Badge variant="outline" className="gap-1"><ImageIcon className="h-3 w-3" /> {group.imageFileName}</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{group.instruction}</p>
          {group.wordLimit && <p className="text-xs text-muted-foreground italic">Limit: {group.wordLimit}</p>}
        </div>
        {!readOnly && (
          <div className="flex items-center gap-1 flex-shrink-0">
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={onEdit}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={onDelete}>
              <Trash2 className="h-3.5 w-3.5 text-destructive" />
            </Button>
          </div>
        )}
      </div>

      {group.wordBank && group.wordBank.length > 0 && (
        <div className="flex flex-wrap gap-2 p-2 rounded bg-background border border-border/60">
          {group.wordBank.map((w, i) => (
            <span key={i} className="text-xs px-2 py-1 rounded bg-primary/5 border border-primary/20">
              <span className="font-bold text-primary mr-1">{String.fromCharCode(65 + i)}.</span>{w}
            </span>
          ))}
        </div>
      )}

      <div className="space-y-1.5">
        {group.questions.map((q, i) => (
          <div key={i} className="text-sm flex items-start gap-2">
            <span className="font-semibold text-primary w-6 flex-shrink-0">{q.number}.</span>
            <div className="flex-1 min-w-0">
              <div>{q.prompt || <span className="text-muted-foreground italic">(empty prompt)</span>}</div>
              {q.options && q.options.length > 0 && (
                <div className="text-xs text-muted-foreground mt-0.5">
                  {q.options.filter(Boolean).join(' • ')}
                </div>
              )}
              <div className="text-xs text-success mt-0.5">
                <span className="font-medium">Answer:</span> {Array.isArray(q.answer) ? q.answer.join(', ') : q.answer || '—'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionGroupCard;
