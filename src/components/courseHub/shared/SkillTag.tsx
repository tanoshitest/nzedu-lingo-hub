import { Badge } from '@/components/ui/badge';
import { skillColors, type ExerciseSkill } from '@/data/mockCourseHub';
import { cn } from '@/lib/utils';

const SkillTag = ({ skill, className }: { skill: ExerciseSkill; className?: string }) => (
  <span className={cn('text-xs font-semibold', skillColors[skill], className)}>{skill}</span>
);

export const SkillBadge = ({ skill }: { skill: ExerciseSkill }) => (
  <Badge variant="outline" className={cn('text-[10px]', skillColors[skill])}>{skill}</Badge>
);

export default SkillTag;
