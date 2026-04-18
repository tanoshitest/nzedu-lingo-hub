import { Badge } from '@/components/ui/badge';
import { submissionStatusColors, submissionStatusLabels, type SubmissionStatus } from '@/data/mockGrading';

const SubmissionStatusBadge = ({ status }: { status: SubmissionStatus }) => (
  <Badge variant="outline" className={submissionStatusColors[status]}>
    {submissionStatusLabels[status]}
  </Badge>
);

export default SubmissionStatusBadge;
