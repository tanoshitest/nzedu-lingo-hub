import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { PenLine, Image as ImageIcon } from 'lucide-react';
import {
  type WritingSection, type WritingTask, type WritingTaskType,
  type IeltsVariant, writingTaskTypeLabels,
} from '@/data/mockIeltsTests';

interface Props {
  value: WritingSection;
  onChange: (v: WritingSection) => void;
  variant: IeltsVariant;
  readOnly?: boolean;
}

const task1AcademicTypes: WritingTaskType[] = ['BarChart', 'LineGraph', 'PieChart', 'Table', 'Map', 'Process', 'MixedChart'];
const task1GeneralTypes: WritingTaskType[] = ['Letter'];
const task2Types: WritingTaskType[] = ['Opinion', 'Discussion', 'ProblemSolution', 'AdvDisadv', 'TwoPart'];

const countWords = (t: string) => t.trim().split(/\s+/).filter(Boolean).length;

const TaskCard = ({
  task, onChange, allowedTypes, variant, readOnly, showImage,
}: {
  task: WritingTask;
  onChange: (t: WritingTask) => void;
  allowedTypes: WritingTaskType[];
  variant: IeltsVariant;
  readOnly?: boolean;
  showImage: boolean;
}) => {
  const promptWords = countWords(task.prompt);
  const sampleWords = countWords(task.sampleAnswer ?? '');
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <PenLine className="h-4 w-4 text-primary" />
          Task {task.taskNumber}
          <Badge variant="outline" className="ml-2">{task.minWords}+ words</Badge>
          <Badge variant="outline">{task.timeMinutes} min</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Task Type *</Label>
            <Select
              value={task.taskType}
              onValueChange={(v) => onChange({ ...task, taskType: v as WritingTaskType })}
              disabled={readOnly}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {allowedTypes.map((t) => (
                  <SelectItem key={t} value={t}>{writingTaskTypeLabels[t]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {task.taskNumber === 1
                ? variant === 'Academic' ? 'Describe visual data.' : 'Write a letter.'
                : 'Write an essay.'}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label>Min Words</Label>
              <Select
                value={String(task.minWords)}
                onValueChange={(v) => onChange({ ...task, minWords: Number(v) as 150 | 250 })}
                disabled={readOnly}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="150">150</SelectItem>
                  <SelectItem value="250">250</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Time (min)</Label>
              <Select
                value={String(task.timeMinutes)}
                onValueChange={(v) => onChange({ ...task, timeMinutes: Number(v) as 20 | 40 })}
                disabled={readOnly}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="40">40</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {showImage && (
          <div className="space-y-2">
            <Label className="flex items-center gap-1"><ImageIcon className="h-3.5 w-3.5" /> Image File (mock)</Label>
            <Input
              value={task.imageFileName ?? ''}
              onChange={(e) => onChange({ ...task, imageFileName: e.target.value })}
              placeholder="task1_barchart.png"
              disabled={readOnly}
            />
          </div>
        )}

        <div className="space-y-2">
          <Label>
            Prompt * <span className="text-xs text-muted-foreground">({promptWords} words)</span>
          </Label>
          <Textarea
            rows={5}
            value={task.prompt}
            onChange={(e) => onChange({ ...task, prompt: e.target.value })}
            placeholder={
              task.taskNumber === 1
                ? 'The chart below shows... Summarise the information by selecting and reporting the main features...'
                : 'Some people believe that... To what extent do you agree or disagree?'
            }
            disabled={readOnly}
          />
        </div>

        <div className="space-y-2">
          <Label>
            Sample Answer (optional){' '}
            <span className="text-xs text-muted-foreground">({sampleWords} words)</span>
          </Label>
          <Textarea
            rows={4}
            value={task.sampleAnswer ?? ''}
            onChange={(e) => onChange({ ...task, sampleAnswer: e.target.value })}
            placeholder="Model answer for reference..."
            disabled={readOnly}
          />
        </div>

        <div className="space-y-2">
          <Label>Internal Notes (optional)</Label>
          <Textarea
            rows={2}
            value={task.notes ?? ''}
            onChange={(e) => onChange({ ...task, notes: e.target.value })}
            placeholder="Marking guidance, common mistakes..."
            disabled={readOnly}
          />
        </div>
      </CardContent>
    </Card>
  );
};

const WritingEditor = ({ value, onChange, variant, readOnly }: Props) => {
  const task1Types = variant === 'Academic' ? task1AcademicTypes : task1GeneralTypes;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-display text-lg font-semibold">Writing Section</h3>
        <p className="text-sm text-muted-foreground">2 tasks • 60 minutes total ({variant})</p>
      </div>

      <TaskCard
        task={value.task1}
        onChange={(t) => onChange({ ...value, task1: t })}
        allowedTypes={task1Types}
        variant={variant}
        readOnly={readOnly}
        showImage={variant === 'Academic'}
      />
      <TaskCard
        task={value.task2}
        onChange={(t) => onChange({ ...value, task2: t })}
        allowedTypes={task2Types}
        variant={variant}
        readOnly={readOnly}
        showImage={false}
      />
    </div>
  );
};

export default WritingEditor;
