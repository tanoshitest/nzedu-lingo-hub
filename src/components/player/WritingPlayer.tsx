import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Image as ImageIcon } from 'lucide-react';
import { type WritingSection, type WritingTask, writingTaskTypeLabels } from '@/data/mockIeltsTests';
import { type WritingResponse } from '@/data/mockTestAttempts';

interface Props {
  section: WritingSection;
  responses: WritingResponse[];
  onChange: (taskNumber: 1 | 2, text: string) => void;
  readOnly?: boolean;
}

const countWords = (t: string) => t.trim().split(/\s+/).filter(Boolean).length;

const WritingPlayer = ({ section, responses, onChange, readOnly }: Props) => {
  const render = (task: WritingTask) => {
    const resp = responses.find((r) => r.taskNumber === task.taskNumber);
    const text = resp?.text ?? '';
    const wc = countWords(text);
    const meetsMin = wc >= task.minWords;

    return (
      <Card key={task.taskNumber} className="border-border/60">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-3 border-b border-border pb-3">
            <div className="h-9 w-9 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-bold">T{task.taskNumber}</div>
            <div className="flex-1">
              <div className="font-semibold">Task {task.taskNumber} — {writingTaskTypeLabels[task.taskType]}</div>
              <div className="text-xs text-muted-foreground">Min {task.minWords} words • ~{task.timeMinutes} min</div>
            </div>
          </div>

          <div className="rounded-md border border-border bg-muted/30 p-3 text-sm whitespace-pre-wrap">{task.prompt}</div>

          {task.imageFileName && (
            <div className="rounded-md border border-dashed border-border bg-muted/40 p-4 text-sm text-muted-foreground flex items-center gap-2">
              <ImageIcon className="h-4 w-4" /> [Hình ảnh: {task.imageFileName}]
            </div>
          )}

          <div className="space-y-1">
            <Textarea
              rows={14}
              value={text}
              onChange={(e) => onChange(task.taskNumber, e.target.value)}
              placeholder="Bắt đầu viết bài làm tại đây..."
              disabled={readOnly}
              className="font-serif"
            />
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Word count: <span className="font-semibold">{wc}</span> / {task.minWords}</span>
              <Badge variant="outline" className={meetsMin ? 'bg-success/10 text-success border-success/20' : 'bg-warning/10 text-warning border-warning/20'}>
                {meetsMin ? 'Đủ số từ' : 'Chưa đủ số từ'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {render(section.task1)}
      {render(section.task2)}
    </div>
  );
};

export default WritingPlayer;
