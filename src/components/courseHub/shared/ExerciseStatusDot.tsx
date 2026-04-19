import { CheckCircle2, CircleDashed, Circle } from 'lucide-react';
import type { ExerciseStatus } from '@/data/mockCourseHub';
import { cn } from '@/lib/utils';

const ExerciseStatusDot = ({ status, className }: { status: ExerciseStatus; className?: string }) => {
  if (status === 'Completed') return <CheckCircle2 className={cn('h-4 w-4 text-success', className)} />;
  if (status === 'InProgress') return <CircleDashed className={cn('h-4 w-4 text-info', className)} />;
  return <Circle className={cn('h-4 w-4 text-muted-foreground', className)} />;
};

export default ExerciseStatusDot;
