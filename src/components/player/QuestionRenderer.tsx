import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { type QuestionGroup, type Question } from '@/data/mockIeltsTests';

interface Props {
  group: QuestionGroup;
  answers: Record<number, string | string[]>;
  onAnswer: (qNumber: number, value: string | string[]) => void;
  readOnly?: boolean;
}

const letterLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

const QuestionRenderer = ({ group, answers, onAnswer, readOnly }: Props) => {
  const [dragOver, setDragOver] = useState<number | null>(null);
  const wordBank = group.wordBank ?? [];

  const renderOne = (q: Question) => {
    const current = answers[q.number];
    const disabled = !!readOnly;

    // Radio (MCQ single, TFNG, YNNG)
    if (group.presentation === 'Radio') {
      const options = q.options ?? (group.type === 'TrueFalseNotGiven'
        ? ['TRUE', 'FALSE', 'NOT GIVEN']
        : group.type === 'YesNoNotGiven'
        ? ['YES', 'NO', 'NOT GIVEN']
        : []);
      return (
        <RadioGroup
          value={(current as string) ?? ''}
          onValueChange={(v) => onAnswer(q.number, v)}
          disabled={disabled}
          className="space-y-1"
        >
          {options.map((opt) => {
            const val = opt.match(/^([A-Z])\./) ? opt.slice(0, 1) : opt;
            const id = `q${q.number}-${val}`;
            return (
              <div key={opt} className="flex items-center gap-2">
                <RadioGroupItem value={val} id={id} />
                <Label htmlFor={id} className="font-normal cursor-pointer text-sm">{opt}</Label>
              </div>
            );
          })}
        </RadioGroup>
      );
    }

    // Checkbox (MCQ multi)
    if (group.presentation === 'Checkbox') {
      const selected = Array.isArray(current) ? current : [];
      const options = q.options ?? [];
      return (
        <div className="space-y-1">
          {options.map((opt) => {
            const val = opt.match(/^([A-Z])\./) ? opt.slice(0, 1) : opt;
            const id = `q${q.number}-${val}`;
            const checked = selected.includes(val);
            return (
              <div key={opt} className="flex items-center gap-2">
                <Checkbox
                  id={id}
                  checked={checked}
                  disabled={disabled}
                  onCheckedChange={(c) => {
                    const next = c ? [...selected, val] : selected.filter((x) => x !== val);
                    onAnswer(q.number, next);
                  }}
                />
                <Label htmlFor={id} className="font-normal cursor-pointer text-sm">{opt}</Label>
              </div>
            );
          })}
        </div>
      );
    }

    // Dropdown
    if (group.presentation === 'Dropdown') {
      const options = wordBank.length > 0
        ? wordBank
        : q.options ?? (group.type === 'TrueFalseNotGiven'
          ? ['TRUE', 'FALSE', 'NOT GIVEN']
          : group.type === 'YesNoNotGiven'
          ? ['YES', 'NO', 'NOT GIVEN']
          : []);
      return (
        <Select value={(current as string) ?? ''} onValueChange={(v) => onAnswer(q.number, v)} disabled={disabled}>
          <SelectTrigger className="w-60"><SelectValue placeholder="Chọn đáp án" /></SelectTrigger>
          <SelectContent>
            {options.map((opt, i) => (
              <SelectItem key={i} value={opt}>{opt}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    // DragDrop
    if (group.presentation === 'DragDrop') {
      return (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(q.number); }}
          onDragLeave={() => setDragOver(null)}
          onDrop={(e) => {
            e.preventDefault();
            const w = e.dataTransfer.getData('text/word');
            if (w) onAnswer(q.number, w);
            setDragOver(null);
          }}
          className={`min-h-10 rounded-md border-2 border-dashed px-3 py-2 text-sm flex items-center gap-2 ${
            dragOver === q.number ? 'border-primary bg-primary/10' : 'border-border bg-muted/40'
          }`}
        >
          {current ? (
            <>
              <Badge variant="secondary" className="text-sm">{current as string}</Badge>
              {!disabled && (
                <button className="text-xs text-muted-foreground hover:text-destructive" onClick={() => onAnswer(q.number, '')}>
                  ✕
                </button>
              )}
            </>
          ) : (
            <span className="text-muted-foreground">Kéo đáp án vào đây</span>
          )}
        </div>
      );
    }

    // TypeIn default
    return (
      <Input
        value={(current as string) ?? ''}
        onChange={(e) => onAnswer(q.number, e.target.value)}
        disabled={disabled}
        placeholder={group.wordLimit ?? 'Nhập đáp án'}
        className="max-w-sm"
      />
    );
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-border/60 bg-muted/30 p-3">
        <div className="text-xs font-semibold uppercase text-muted-foreground">Questions {group.questions[0]?.number}–{group.questions[group.questions.length - 1]?.number}</div>
        <div className="text-sm mt-1">{group.instruction}</div>
        {group.wordLimit && <div className="text-xs text-muted-foreground mt-1">Word limit: {group.wordLimit}</div>}
      </div>

      {group.presentation === 'DragDrop' && wordBank.length > 0 && (
        <div className="rounded-md border border-border bg-card p-3">
          <div className="text-xs font-semibold uppercase text-muted-foreground mb-2">Word Bank</div>
          <div className="flex flex-wrap gap-2">
            {wordBank.map((w, i) => (
              <Badge
                key={i}
                draggable={!readOnly}
                onDragStart={(e) => e.dataTransfer.setData('text/word', w)}
                variant="outline"
                className="cursor-grab text-sm px-3 py-1"
              >
                {letterLabels[i] ? `${letterLabels[i]}. ` : ''}{w}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {group.imageFileName && (
        <div className="rounded-md border border-dashed border-border bg-muted/40 p-6 text-center text-sm text-muted-foreground">
          [Hình ảnh: {group.imageFileName}]
        </div>
      )}

      <div className="space-y-3">
        {group.questions.map((q) => (
          <div key={q.number} className="flex gap-3 items-start">
            <div className="h-7 w-7 shrink-0 rounded-md bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
              {q.number}
            </div>
            <div className="flex-1 space-y-2">
              <div className="text-sm">{q.prompt}</div>
              {renderOne(q)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionRenderer;
